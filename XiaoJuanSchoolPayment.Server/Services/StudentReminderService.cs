using Microsoft.EntityFrameworkCore;
using XiaoJuanSchoolPayment.Server.Controllers;
using XiaoJuanSchoolPayment.Server.Data;
using XiaoJuanSchoolPayment.Server.Data.DTO;
using XiaoJuanSchoolPayment.Server.Data.Models;

namespace XiaoJuanSchoolPayment.Server.Services
{
  /// <summary>
  /// Automatic follow-up reminders, checked every hour between 09:00 and 21:00 China time.
  /// Fees: an unpaid fee item is reminded <see cref="FeeDueDays"/> days before its due date and once more from
  /// <see cref="FeeFinalDays"/> day before. Departure: while requested documents are missing or fees are unpaid,
  /// <see cref="DepartureDays"/> days before the course starts and once more from <see cref="DepartureFinalDays"/> days before.
  /// A student with an account is reminded by email (and WeChat when turned on) from what they can already see,
  /// the last published version. Every reminder also goes into one staff email per check, which says whether the
  /// student was reminded; a student without an account, or whose file is not published yet, is listed there
  /// from the employees' current version so a consultant contacts them. Each reminder is recorded once in
  /// StudentReminderLogs, so nothing repeats after a restart. Cancelled and on-hold applications are left out.
  /// </summary>
  public sealed class StudentReminderService : BackgroundService
  {
    public const int FeeDueDays = 7;
    public const int FeeFinalDays = 1;
    public const int DepartureDays = 14;
    public const int DepartureFinalDays = 3;
    private const string FeeDueKind = "fee-due";
    private const string DepartureKind = "departure";
    private const string CancelledStatus = "已取消";
    private const string OnHoldStatus = "保留/延期";
    private static readonly string[] AlreadyThereStatuses = ["已入学", "已完成"];

    private readonly IServiceScopeFactory _scopeFactory;
    private readonly IStudentNotifications _notifications;
    private readonly ILogger<StudentReminderService> _logger;

    public StudentReminderService(IServiceScopeFactory scopeFactory, IStudentNotifications notifications, ILogger<StudentReminderService> logger)
    {
      _scopeFactory = scopeFactory;
      _notifications = notifications;
      _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
      try
      {
        // Let startup finish its database migration first.
        await Task.Delay(TimeSpan.FromMinutes(3), stoppingToken);
        using var timer = new PeriodicTimer(TimeSpan.FromHours(1));
        do
        {
          try
          {
            await RunOnceAsync(stoppingToken);
          }
          catch (Exception exception) when (exception is not OperationCanceledException)
          {
            _logger.LogError(exception, "Student reminders could not be checked.");
          }
        }
        while (await timer.WaitForNextTickAsync(stoppingToken));
      }
      catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
      {
      }
    }

    private async Task RunOnceAsync(CancellationToken cancellationToken)
    {
      var chinaNow = StudentNotifications.ChinaNow();
      if (chinaNow.Hour < 9 || chinaNow.Hour >= 21) return;
      var today = chinaNow.Date;

      using var scope = _scopeFactory.CreateScope();
      var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
      var applications = await context.StudentApplications
        .Where(application => application.Status != CancelledStatus && application.Status != OnHoldStatus)
        .Include(application => application.StudentUser).Include(application => application.School)
        .Include(application => application.Documents).Include(application => application.Payments)
        .Include(application => application.Submissions)
        .AsSplitQuery()
        .ToListAsync(cancellationToken);
      if (applications.Count == 0) return;

      // Older entries can never match again: every reminder key holds a date at most two weeks ahead.
      var logsSince = DateTime.UtcNow.AddDays(-60);
      var sent = (await context.StudentReminderLogs
          .Where(log => log.SentAt >= logsSince)
          .Select(log => new { log.StudentApplicationId, log.Kind, log.ReminderKey })
          .ToListAsync(cancellationToken))
        .Select(log => (log.StudentApplicationId, log.Kind, log.ReminderKey))
        .ToHashSet();

      var outgoing = new List<Action>();
      var staff = new List<StaffFollowUp>();
      foreach (var application in applications)
      {
        var student = application.StudentUser;
        var published = StudentApplicationsController.StudentView(application);
        var canRemindStudent = student != null && published != null;
        // The student is reminded only about what they can see; staff hear about the rest from their own version.
        var view = canRemindStudent ? published! : StudentApplicationsController.WorkingView(application);
        if (view.Status is CancelledStatus or OnHoldStatus) continue;

        var fees = DueSoon(view, today)
          .Where(fee => !sent.Contains((application.Id, FeeDueKind, FeeKey(fee))))
          .ToList();
        var departure = DepartureDue(view, today);
        if (departure != null && sent.Contains((application.Id, DepartureKind, DepartureKey(departure)))) departure = null;
        if (fees.Count == 0 && departure == null) continue;

        foreach (var fee in fees) context.StudentReminderLogs.Add(Log(application.Id, FeeDueKind, FeeKey(fee)));
        if (departure != null) context.StudentReminderLogs.Add(Log(application.Id, DepartureKind, DepartureKey(departure)));

        if (canRemindStudent)
        {
          outgoing.Add(() =>
          {
            if (fees.Count > 0) _notifications.FeesDueSoon(view, fees, student!);
            if (departure != null) _notifications.DepartureSoon(view, departure, student!);
          });
        }

        staff.Add(new StaffFollowUp(
          application.Id,
          string.IsNullOrWhiteSpace(view.StudentName) ? "未填姓名" : view.StudentName,
          view.SchoolName,
          view.ConsultantName ?? application.ConsultantName,
          fees,
          departure,
          canRemindStudent ? null : student == null ? "学员还没有注册账号" : "档案还没有发布，学员看不到"));
      }

      if (staff.Count == 0) return;
      // Record first, so a failure never makes the next check send the same reminder again.
      await context.SaveChangesAsync(cancellationToken);
      foreach (var send in outgoing) send();
      _notifications.StaffFollowUps(staff);
    }

    /// <summary>
    /// Unpaid fee items due today or within the next <see cref="FeeDueDays"/> days. Overdue items are not
    /// reminded again; the employee list keeps showing them.
    /// </summary>
    public static IList<FeeReminder> DueSoon(StudentApplicationDTO view, DateTime today) =>
      StudentApplicationsController.UnpaidFeeItems(view.FeeItems, view.Payments)
        .Where(fee => fee.Item.DueDate.HasValue)
        .Select(fee => new FeeReminder(fee.Item, fee.Remaining, (fee.Item.DueDate!.Value.Date - today).Days))
        .Where(fee => fee.DaysLeft >= 0 && fee.DaysLeft <= FeeDueDays)
        .ToList();

    /// <summary>
    /// The course starts within <see cref="DepartureDays"/> days (not today or earlier) and requested documents
    /// are still missing or fees are unpaid; null otherwise, and for students who are already at the school.
    /// </summary>
    public static DepartureReminder? DepartureDue(StudentApplicationDTO view, DateTime today)
    {
      if (view.StartDate is not DateTime start || AlreadyThereStatuses.Contains(view.Status)) return null;
      var daysLeft = (start.Date - today).Days;
      if (daysLeft < 1 || daysLeft > DepartureDays) return null;
      var missing = MissingDocuments(view);
      var unpaid = view.FeeSummaries.Where(summary => summary.Remaining > 0).ToList();
      return missing.Count == 0 && unpaid.Count == 0 ? null : new DepartureReminder(start.Date, daysLeft, missing, unpaid);
    }

    /// <summary>Requested documents the student still has to upload (never uploaded, or returned).</summary>
    public static IList<string> MissingDocuments(StudentApplicationDTO view) =>
      view.RequestedDocuments
        .Where(request => request.UploadStatus is "未上传" or "需重新上传")
        .Select(request => request.DocumentType)
        .Distinct()
        .ToList();

    // Each key ends with its stage, so the first and the last reminder are recorded separately, and a changed
    // due date or start date is reminded again.
    private static string FeeKey(FeeReminder fee) =>
      Limit($"{fee.Item.DueDate:yyyy-MM-dd}:{Stage(fee.DaysLeft, FeeFinalDays)}:{fee.Item.Key}");

    private static string DepartureKey(DepartureReminder departure) =>
      $"{departure.StartDate:yyyy-MM-dd}:{Stage(departure.DaysLeft, DepartureFinalDays)}";

    private static string Stage(int daysLeft, int finalDays) => daysLeft <= finalDays ? "final" : "first";

    private static string Limit(string value) => value.Length <= 120 ? value : value[..120];

    private static StudentReminderLog Log(Guid applicationId, string kind, string key) => new()
    {
      Id = Guid.NewGuid(),
      StudentApplicationId = applicationId,
      Kind = kind,
      ReminderKey = key,
      SentAt = DateTime.UtcNow,
    };
  }
}

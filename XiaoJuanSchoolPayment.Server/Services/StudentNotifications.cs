using System.Globalization;
using System.Net;
using System.Net.Mail;
using System.Text;
using System.Text.Json;
using System.Threading.Channels;
using Microsoft.Extensions.Options;
using XiaoJuanSchoolPayment.Server.Data.Config;
using XiaoJuanSchoolPayment.Server.Data.DTO;
using XiaoJuanSchoolPayment.Server.Data.Models;
using XiaoJuanSchoolPayment.Server.Services.WeChat;

namespace XiaoJuanSchoolPayment.Server.Services
{
  /// <summary>
  /// Notifications about student applications: progress updates, confirmed payments, returned uploads and the
  /// automatic fee-due and departure reminders go to the student's registered email and, when the student turned
  /// on WeChat reminders in the mini program, as a WeChat subscribe message. New student uploads go to the company
  /// inbox (ContactForm:RecipientEmail). Messages are queued and sent by <see cref="StudentEmailSender"/> and
  /// <see cref="WeChatMessageSender"/>, so a slow or missing SMTP or WeChat server never blocks the request.
  /// </summary>
  public interface IStudentNotifications
  {
    void ApplicationPublished(StudentApplicationDTO? before, StudentApplicationDTO after, SchoolUser? student);
    void PaymentConfirmed(StudentApplicationDTO application, StudentPaymentDTO payment, SchoolUser? student);
    void SubmissionReturned(StudentApplicationDTO application, StudentSubmissionDTO submission, SchoolUser? student);
    void SubmissionReceived(StudentApplicationDTO application, StudentSubmissionDTO submission);
    void FeesDueSoon(StudentApplicationDTO application, IList<FeeReminder> fees, SchoolUser student);
    void DepartureSoon(StudentApplicationDTO application, DepartureReminder departure, SchoolUser student);
    void StaffFollowUps(IList<StaffFollowUp> items);
  }

  /// <summary>A fee item and the part of it that confirmed payments do not cover yet.</summary>
  public sealed record UnpaidFeeItem(StudentFeeItemDTO Item, decimal Remaining);

  /// <summary>An unpaid fee whose due date is <paramref name="DaysLeft"/> days away (0 = due today).</summary>
  public sealed record FeeReminder(StudentFeeItemDTO Item, decimal Remaining, int DaysLeft);

  /// <summary>A course that starts in <paramref name="DaysLeft"/> days while documents or fees are outstanding.</summary>
  public sealed record DepartureReminder(DateTime StartDate, int DaysLeft, IList<string> MissingDocuments, IList<StudentFeeSummaryDTO> Unpaid);

  /// <summary>
  /// One application in the staff follow-up email. <paramref name="NotRemindedReason"/> is null when the student
  /// was reminded automatically, otherwise why the system could not (no account, nothing published yet).
  /// </summary>
  public sealed record StaffFollowUp(
    Guid ApplicationId,
    string StudentName,
    string SchoolName,
    string? ConsultantName,
    IList<FeeReminder> Fees,
    DepartureReminder? Departure,
    string? NotRemindedReason);

  public sealed record StudentEmail(string To, string Subject, string Body);

  public sealed class StudentEmailQueue
  {
    private readonly Channel<StudentEmail> _channel = Channel.CreateBounded<StudentEmail>(
      new BoundedChannelOptions(500) { FullMode = BoundedChannelFullMode.DropOldest });

    public void Enqueue(StudentEmail email) => _channel.Writer.TryWrite(email);

    public ChannelReader<StudentEmail> Reader => _channel.Reader;
  }

  public sealed class StudentNotifications : IStudentNotifications
  {
    private const string MiniProgramPath = "微信小程序「思达启航留学与英语游学」→ 我的 → 学员中心";

    private readonly StudentEmailQueue _queue;
    private readonly WeChatMessageQueue _weChatQueue;
    private readonly IConfiguration _configuration;
    private readonly ContactFormOptions _options;

    public StudentNotifications(
      StudentEmailQueue queue,
      WeChatMessageQueue weChatQueue,
      IConfiguration configuration,
      IOptions<ContactFormOptions> options)
    {
      _queue = queue;
      _weChatQueue = weChatQueue;
      _configuration = configuration;
      _options = options.Value;
    }

    public void ApplicationPublished(StudentApplicationDTO? before, StudentApplicationDTO after, SchoolUser? student)
    {
      if (student == null) return;
      var changes = DescribeChanges(before, after);
      if (changes.Count == 0) return;

      var body = new StringBuilder();
      body.Append(Greeting(after.StudentName));
      body.Append(before == null
        ? $"你在思达启航的报名档案（{after.SchoolName}）已经建立：\r\n"
        : $"你在思达启航的报名信息（{after.SchoolName}）有更新：\r\n");
      foreach (var change in changes) body.Append($"· {change}\r\n");
      AppendPortalLinks(body);
      SendEmail(student, $"报名进度更新：{after.SchoolName}", body);
      SendWeChat(student, WeChatTemplateKinds.Progress, after, "报名进度更新", "有更新",
        changes.Count == 1 ? changes[0] : $"{changes[0]}等{changes.Count}项");
    }

    public void PaymentConfirmed(StudentApplicationDTO application, StudentPaymentDTO payment, SchoolUser? student)
    {
      if (student == null || !payment.IsVisibleToStudent) return;
      var body = new StringBuilder();
      body.Append(Greeting(application.StudentName));
      body.Append($"我们已确认收到你的付款（{application.SchoolName}）：\r\n");
      body.Append($"· {payment.PaymentType}：{Money(payment.Amount, payment.CurrencyCode)}（{payment.PaidAt:yyyy-MM-dd}）\r\n");
      foreach (var summary in application.FeeSummaries)
      {
        body.Append(summary.Remaining > 0
          ? $"· 还需支付：{Money(summary.Remaining, summary.CurrencyCode)}\r\n"
          : $"· {CurrencyName(summary.CurrencyCode)}费用已付清\r\n");
      }
      AppendPortalLinks(body);
      SendEmail(student, "付款已确认", body);
      SendWeChat(student, WeChatTemplateKinds.Progress, application, "付款已确认", "已确认",
        $"{payment.PaymentType} {Money(payment.Amount, payment.CurrencyCode)}",
        amount: WeChatValue.OfMoney(payment.Amount, payment.CurrencyCode), item: payment.PaymentType);
    }

    public void SubmissionReturned(StudentApplicationDTO application, StudentSubmissionDTO submission, SchoolUser? student)
    {
      if (student == null) return;
      var body = new StringBuilder();
      body.Append(Greeting(application.StudentName));
      body.Append($"你上传的「{submission.DocumentType}」需要重新上传。\r\n");
      if (!string.IsNullOrWhiteSpace(submission.ReviewNote)) body.Append($"原因：{submission.ReviewNote}\r\n");
      AppendPortalLinks(body);
      SendEmail(student, $"请重新上传：{submission.DocumentType}", body);
      SendWeChat(student, WeChatTemplateKinds.Progress, application, "请重新上传资料", "需重传",
        string.IsNullOrWhiteSpace(submission.ReviewNote) ? submission.DocumentType : $"{submission.DocumentType}：{submission.ReviewNote}",
        item: submission.DocumentType);
    }

    public void FeesDueSoon(StudentApplicationDTO application, IList<FeeReminder> fees, SchoolUser student)
    {
      if (fees.Count == 0) return;
      var ordered = fees.OrderBy(fee => fee.DaysLeft).ThenBy(fee => fee.Item.Name).ToList();
      var urgent = ordered[0].DaysLeft <= StudentReminderService.FeeFinalDays;
      var body = new StringBuilder();
      body.Append(Greeting(application.StudentName));
      body.Append(urgent
        ? $"以下费用马上到付款截止日期了（{application.SchoolName}）：\r\n"
        : $"以下费用快到付款截止日期了（{application.SchoolName}）：\r\n");
      foreach (var fee in ordered)
      {
        body.Append($"· {FeeLine(fee)}\r\n");
        if (!string.IsNullOrWhiteSpace(fee.Item.Note)) body.Append($"  {fee.Item.Note}\r\n");
      }
      body.Append("\r\n如果已经付款，请把付款截图发给你的顾问，或在学员中心「上传资料」里上传；顾问确认后，学员中心会显示已付。\r\n");
      AppendPortalLinks(body);
      SendEmail(student, urgent ? $"付款提醒（即将截止）：{application.SchoolName}" : $"付款提醒：{application.SchoolName}", body);

      var first = ordered[0];
      var due = first.Item.DueDate ?? ChinaToday();
      SendWeChat(student, WeChatTemplateKinds.FeeDue, application, urgent ? "付款即将截止" : "付款提醒", urgent ? "即将截止" : "待付款",
        ordered.Count == 1
          ? $"{first.Item.Name}，{DaysLeftText(first.DaysLeft)}截止"
          : $"{first.Item.Name}等{ordered.Count}笔，{DaysLeftText(first.DaysLeft)}截止",
        amount: WeChatValue.OfMoney(first.Remaining, first.Item.CurrencyCode),
        item: ordered.Count == 1 ? first.Item.Name : $"{first.Item.Name}等{ordered.Count}笔",
        // A fee is due by the end of its day.
        date: WeChatValue.OfDateTime(due.Date.AddHours(23).AddMinutes(59)));
    }

    public void DepartureSoon(StudentApplicationDTO application, DepartureReminder departure, SchoolUser student)
    {
      if (departure.MissingDocuments.Count == 0 && departure.Unpaid.Count == 0) return;
      var body = new StringBuilder();
      body.Append(Greeting(application.StudentName));
      body.Append($"你在 {application.SchoolName} 的课程将在 {departure.StartDate:yyyy-MM-dd} 开始（{DaysLeftText(departure.DaysLeft)}）。出发前还需要：\r\n");
      foreach (var line in DepartureLines(departure)) body.Append($"· {line}\r\n");
      body.Append("\r\n资料可以直接在学员中心上传；有任何问题请联系你的顾问。\r\n");
      AppendPortalLinks(body);
      SendEmail(student, $"出发前提醒：{application.SchoolName}", body);

      var parts = new List<string>();
      if (departure.MissingDocuments.Count > 0) parts.Add($"还差{string.Join("、", departure.MissingDocuments)}");
      if (departure.Unpaid.Count > 0) parts.Add("还有费用未付");
      SendWeChat(student, WeChatTemplateKinds.Departure, application, "出发前提醒", "待完成", string.Join("；", parts),
        date: WeChatValue.OfDate(departure.StartDate));
    }

    /// <summary>
    /// One email to the company inbox listing every application that entered a follow-up window in this check:
    /// which students the system reminded, and which it could not, so a consultant contacts them directly.
    /// </summary>
    public void StaffFollowUps(IList<StaffFollowUp> items)
    {
      var inbox = _options.RecipientEmail?.Trim();
      if (string.IsNullOrWhiteSpace(inbox) || items.Count == 0) return;
      var manual = items.Count(item => item.NotRemindedReason != null);
      var body = new StringBuilder();
      body.Append($"以下 {items.Count} 位学员的付款截止日期或开课日期快到了：\r\n");
      foreach (var item in items.OrderBy(item => item.NotRemindedReason == null).ThenBy(item => item.StudentName))
      {
        var consultant = string.IsNullOrWhiteSpace(item.ConsultantName) ? "未指定顾问" : $"顾问 {item.ConsultantName}";
        body.Append($"\r\n{item.StudentName}（{item.SchoolName}）｜{consultant}\r\n");
        foreach (var fee in item.Fees.OrderBy(fee => fee.DaysLeft)) body.Append($"· 付款：{FeeLine(fee)}\r\n");
        if (item.Departure != null)
        {
          body.Append($"· 出发：{item.Departure.StartDate:yyyy-MM-dd} 开课（{DaysLeftText(item.Departure.DaysLeft)}），{string.Join("；", DepartureLines(item.Departure))}\r\n");
        }
        body.Append(item.NotRemindedReason == null
          ? "→ 系统已提醒学员。\r\n"
          : $"→ {item.NotRemindedReason}，系统没有提醒，请顾问直接联系学员。\r\n");
        body.Append($"{Origin()}/admin/student-applications?applicationId={item.ApplicationId}\r\n");
      }
      body.Append("\r\n付款截止前 7 天和前 1 天、开课前 14 天和前 3 天各提醒一次；学员付清或交齐资料后不再提醒。\r\n");
      var subject = manual > 0 ? $"学员跟进提醒：{items.Count} 位（{manual} 位需要顾问联系）" : $"学员跟进提醒：{items.Count} 位";
      _queue.Enqueue(new StudentEmail(inbox, subject, body.ToString()));
    }

    public void SubmissionReceived(StudentApplicationDTO application, StudentSubmissionDTO submission)
    {
      var inbox = _options.RecipientEmail?.Trim();
      if (string.IsNullOrWhiteSpace(inbox)) return;
      var body = new StringBuilder();
      body.Append($"学员 {application.StudentName}（{application.SchoolName}）在学员中心上传了资料：\r\n");
      body.Append($"· {submission.DocumentType}：{submission.OriginalFileName}\r\n");
      if (!string.IsNullOrWhiteSpace(submission.StudentNote)) body.Append($"· 学员说明：{submission.StudentNote}\r\n");
      body.Append($"\r\n请到员工后台查看并确认收到或退回：\r\n{Origin()}/admin/student-applications?applicationId={application.Id}&submissionId={submission.Id}\r\n");
      _queue.Enqueue(new StudentEmail(inbox, $"学员上传资料：{application.StudentName} · {submission.DocumentType}", body.ToString()));
    }

    /// <summary>What a student would notice between two published versions. Exported for tests.</summary>
    public static List<string> DescribeChanges(StudentApplicationDTO? before, StudentApplicationDTO after)
    {
      var changes = new List<string>();
      if (before == null)
      {
        changes.Add($"申请进度：{after.Status}");
        if (!string.IsNullOrWhiteSpace(after.VisaStatus) && after.VisaStatus != "未确认") changes.Add($"签证进度：{after.VisaStatus}");
        if (after.Documents.Count > 0) changes.Add($"文件：{Names(after.Documents.Select(document => document.DisplayName))}");
        if (after.FeeItems.Count > 0) changes.Add("费用明细已列出");
        if (after.RequestedDocuments.Count > 0) changes.Add($"请上传：{Names(after.RequestedDocuments.Select(item => item.DocumentType))}");
        if (!string.IsNullOrWhiteSpace(after.ConsultantName)) changes.Add($"负责顾问：{after.ConsultantName}");
        if (!string.IsNullOrWhiteSpace(after.StudentVisibleNotes)) changes.Add($"顾问留言：{Shorten(after.StudentVisibleNotes)}");
        return changes;
      }

      if (before.Status != after.Status) changes.Add($"申请进度：{before.Status} → {after.Status}");
      if (before.VisaStatus != after.VisaStatus) changes.Add($"签证进度：{before.VisaStatus} → {after.VisaStatus}");

      var oldDocuments = before.Documents.Select(document => document.Id).ToHashSet();
      var newDocuments = after.Documents.Where(document => !oldDocuments.Contains(document.Id)).ToList();
      if (newDocuments.Count > 0) changes.Add($"新文件：{Names(newDocuments.Select(document => document.DisplayName))}");

      if (Json(before.FeeItems) != Json(after.FeeItems)) changes.Add("费用明细已更新");

      var oldRequests = before.RequestedDocuments.Select(item => item.DocumentType).ToHashSet();
      var newRequests = after.RequestedDocuments.Where(item => !oldRequests.Contains(item.DocumentType)).ToList();
      if (newRequests.Count > 0) changes.Add($"请上传：{Names(newRequests.Select(item => item.DocumentType))}");

      if (Json(before.CoursePlans) != Json(after.CoursePlans) || Json(before.AccommodationPlans) != Json(after.AccommodationPlans) ||
          before.StartDate != after.StartDate || before.EndDate != after.EndDate)
      {
        changes.Add("课程、住宿或日期已更新");
      }

      if (!string.IsNullOrWhiteSpace(after.ConsultantName) && before.ConsultantName != after.ConsultantName)
      {
        changes.Add($"负责顾问：{after.ConsultantName}");
      }

      if (!string.IsNullOrWhiteSpace(after.StudentVisibleNotes) && before.StudentVisibleNotes != after.StudentVisibleNotes)
      {
        changes.Add($"顾问留言：{Shorten(after.StudentVisibleNotes)}");
      }

      return changes;
    }

    public static string CurrencyName(string code) => (code ?? "").ToUpperInvariant() switch
    {
      "USD" => "美元",
      "PHP" => "比索",
      "CNY" or "RMB" => "人民币",
      "EUR" => "欧元",
      "GBP" => "英镑",
      "MYR" => "马来西亚林吉特",
      var other => other,
    };

    public static string Money(decimal amount, string currencyCode) =>
      $"{amount.ToString("#,0.00", CultureInfo.InvariantCulture)} {CurrencyName(currencyCode)}";

    public static string DaysLeftText(int daysLeft) => daysLeft switch
    {
      <= 0 => "今天",
      1 => "明天",
      _ => $"还有 {daysLeft} 天",
    };

    private static string FeeLine(FeeReminder fee) =>
      $"{fee.Item.Name}：{Money(fee.Remaining, fee.Item.CurrencyCode)}，{fee.Item.DueDate:yyyy-MM-dd} 截止（{DaysLeftText(fee.DaysLeft)}）";

    private static IEnumerable<string> DepartureLines(DepartureReminder departure)
    {
      if (departure.MissingDocuments.Count > 0) yield return $"还差资料：{string.Join("、", departure.MissingDocuments)}";
      foreach (var summary in departure.Unpaid) yield return $"还需支付：{Money(summary.Remaining, summary.CurrencyCode)}";
    }

    private void SendEmail(SchoolUser student, string subject, StringBuilder body)
    {
      if (string.IsNullOrWhiteSpace(student.Email)) return;
      _queue.Enqueue(new StudentEmail(student.Email.Trim(), subject, body.ToString()));
    }

    private void SendWeChat(
      SchoolUser student,
      string kind,
      StudentApplicationDTO application,
      string title,
      string state,
      string detail,
      WeChatValue? amount = null,
      string? item = null,
      WeChatValue? date = null)
    {
      if (string.IsNullOrWhiteSpace(student.WeChatOpenId)) return;
      var values = new Dictionary<string, WeChatValue>(StringComparer.OrdinalIgnoreCase)
      {
        ["title"] = WeChatValue.OfText(title),
        ["school"] = WeChatValue.OfText(application.SchoolName),
        ["student"] = WeChatValue.OfText(application.StudentName),
        ["detail"] = WeChatValue.OfText(detail),
        // {state} is a short all-Chinese word for WeChat's 5-character phrase fields; {status} is the application's progress.
        ["state"] = WeChatValue.OfText(state),
        ["status"] = WeChatValue.OfText(application.Status),
        ["item"] = WeChatValue.OfText(item ?? title),
        ["amount"] = amount ?? WeChatValue.OfText(""),
        // Progress messages carry the moment of the update; reminders pass their own due or start date.
        ["date"] = date ?? WeChatValue.OfDateTime(ChinaNow()),
      };
      _weChatQueue.Enqueue(new WeChatMessage(student.WeChatOpenId.Trim(), kind, values));
    }

    /// <summary>The time in China, where students and staff are.</summary>
    public static DateTime ChinaNow() => DateTime.UtcNow.AddHours(8);

    /// <summary>Today's date in China.</summary>
    public static DateTime ChinaToday() => ChinaNow().Date;

    private void AppendPortalLinks(StringBuilder body)
    {
      body.Append("\r\n请登录学员中心查看详情：\r\n");
      body.Append($"网站：{Origin()}/student\r\n");
      body.Append($"{MiniProgramPath}\r\n");
      body.Append("\r\n如有疑问，请直接联系你的顾问。\r\n思达启航\r\n");
    }

    private string Origin()
    {
      var configured = _configuration["Authentication:PublicOrigin"]?.Trim().TrimEnd('/');
      return string.IsNullOrWhiteSpace(configured) ? "https://sidaqihang.com" : configured;
    }

    private static string Greeting(string name) =>
      string.IsNullOrWhiteSpace(name) ? "你好：\r\n\r\n" : $"{name}，你好：\r\n\r\n";

    private static string Names(IEnumerable<string> names)
    {
      var list = names.Where(name => !string.IsNullOrWhiteSpace(name)).ToList();
      return list.Count <= 3 ? string.Join("、", list) : $"{string.Join("、", list.Take(3))} 等 {list.Count} 项";
    }

    private static string Shorten(string text)
    {
      var oneLine = text.Replace("\r", "").Replace('\n', ' ').Trim();
      return oneLine.Length <= 200 ? oneLine : $"{oneLine[..200]}…";
    }

    private static string Json<T>(T value) => JsonSerializer.Serialize(value);
  }

  /// <summary>Sends queued student emails one at a time through the ContactForm SMTP settings.</summary>
  public sealed class StudentEmailSender : BackgroundService
  {
    private readonly StudentEmailQueue _queue;
    private readonly ContactFormOptions _options;
    private readonly ILogger<StudentEmailSender> _logger;

    public StudentEmailSender(StudentEmailQueue queue, IOptions<ContactFormOptions> options, ILogger<StudentEmailSender> logger)
    {
      _queue = queue;
      _options = options.Value;
      _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
      await foreach (var email in _queue.Reader.ReadAllAsync(stoppingToken))
      {
        if (string.IsNullOrWhiteSpace(_options.SenderEmail) || string.IsNullOrWhiteSpace(_options.Smtp.Host) ||
            string.IsNullOrWhiteSpace(_options.Smtp.Username) || string.IsNullOrWhiteSpace(_options.Smtp.Password))
        {
          _logger.LogWarning("Student email not sent: SMTP is not configured.");
          continue;
        }

        try
        {
          using var message = new MailMessage
          {
            From = new MailAddress(_options.SenderEmail, "思达启航教育"),
            Subject = email.Subject,
            Body = email.Body,
            IsBodyHtml = false,
            BodyEncoding = Encoding.UTF8,
            SubjectEncoding = Encoding.UTF8,
          };
          message.To.Add(email.To);

          using var smtpClient = new SmtpClient(_options.Smtp.Host, _options.Smtp.Port)
          {
            EnableSsl = _options.Smtp.EnableSsl,
            UseDefaultCredentials = false,
            Credentials = new NetworkCredential(_options.Smtp.Username, _options.Smtp.Password),
            Timeout = 30_000,
          };
          await smtpClient.SendMailAsync(message, stoppingToken);
        }
        catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
        {
          return;
        }
        catch (Exception exception)
        {
          // Never log the address, subject or body: they identify the student.
          _logger.LogError(exception, "Student email could not be sent.");
        }
      }
    }
  }
}

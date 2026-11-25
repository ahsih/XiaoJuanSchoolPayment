using System.Security.Claims;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using XiaoJuanSchoolPayment.Server.Data;
using XiaoJuanSchoolPayment.Server.Data.DTO;
using XiaoJuanSchoolPayment.Server.Data.Models;
using XiaoJuanSchoolPayment.Server.Interface;
using XiaoJuanSchoolPayment.Server.Services;
using XiaoJuanSchoolPayment.Server.Services.Security;

namespace XiaoJuanSchoolPayment.Server.Controllers
{
  [ApiController]
  [Authorize]
  [Route("student-applications")]
  public class StudentApplicationsController : ControllerBase
  {
    private const string DraftReviewStatus = "Draft";
    private const string PendingReviewStatus = "PendingReview";
    private const string PublishedReviewStatus = "Published";
    private const string PendingPaymentStatus = "PendingReview";
    private const string ConfirmedPaymentStatus = "Confirmed";
    private const string ReturnedPaymentStatus = "Returned";
    private const long MaxDocumentSizeBytes = 15 * 1024 * 1024;
    private static readonly HashSet<string> AllowedStatuses = new(StringComparer.OrdinalIgnoreCase)
    {
      "资料准备", "已提交学校", "等待学校审核", "已收到录取通知书", "签证办理中", "行前准备", "已入学", "已完成", "保留/延期", "已取消",
    };
    private static readonly HashSet<string> AllowedVisaStatuses = new(StringComparer.OrdinalIgnoreCase)
    {
      "未确认", "无需办理", "未办理", "资料准备", "已递交", "审理中", "待补件", "已获签", "被拒/重新办理",
    };
    private static readonly HashSet<string> AllowedEnrollmentTypes = new(StringComparer.OrdinalIgnoreCase)
    {
      "单人报名", "亲子家庭", "多人同行",
    };
    private static readonly Dictionary<string, string> AllowedDocumentTypes = new(StringComparer.OrdinalIgnoreCase)
    {
      [".pdf"] = "application/pdf",
      [".png"] = "image/png",
      [".jpg"] = "image/jpeg",
      [".jpeg"] = "image/jpeg",
      [".docx"] = "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    };
    private static readonly HashSet<string> AllowedDocumentCategories = new(StringComparer.OrdinalIgnoreCase)
    {
      "学生报价单", "报价单", "学校账单/学生发票", "账单", "付款凭证", "入学通知书",
      "护照首页", "签证材料", "签证结果", "签证文件", "机票行程单", "保险资料", "其他",
    };
    private static readonly HashSet<string> AllowedPaymentTypes = new(StringComparer.OrdinalIgnoreCase)
    {
      "定金", "学费/住宿费", "尾款", "签证费", "服务费", "其他",
    };
    private static readonly HashSet<string> AllowedPaymentMethods = new(StringComparer.OrdinalIgnoreCase)
    {
      "微信支付", "支付宝", "银行转账", "对公账户", "现金", "其他",
    };
    private static readonly HashSet<string> AllowedPaymentCurrencies = new(StringComparer.OrdinalIgnoreCase)
    {
      "CNY", "USD", "PHP", "EUR", "GBP", "MYR",
    };
    private static readonly Dictionary<string, string> AllowedPaymentFileTypes = new(StringComparer.OrdinalIgnoreCase)
    {
      [".pdf"] = "application/pdf",
      [".png"] = "image/png",
      [".jpg"] = "image/jpeg",
      [".jpeg"] = "image/jpeg",
      [".webp"] = "image/webp",
    };
    private const string PendingSubmissionStatus = "PendingReview";
    private const string AcceptedSubmissionStatus = "Accepted";
    private const string ReturnedSubmissionStatus = "Returned";
    private const int MaxSubmissionsPerApplication = 60;
    private const int MaxPendingSubmissions = 20;
    /// <summary>What a student may upload, and what a consultant may ask for. Keep in step with the website and mini program lists.</summary>
    private static readonly HashSet<string> AllowedSubmissionTypes = new(StringComparer.Ordinal)
    {
      "护照首页", "证件照", "机票行程单", "签证材料", "付款截图", "保险资料", "其他",
    };
    private static readonly Dictionary<string, string> AllowedSubmissionFileTypes = new(StringComparer.OrdinalIgnoreCase)
    {
      [".pdf"] = "application/pdf",
      [".png"] = "image/png",
      [".jpg"] = "image/jpeg",
      [".jpeg"] = "image/jpeg",
      [".webp"] = "image/webp",
      [".docx"] = "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    };

    private readonly AppDbContext _context;
    private readonly UserManager<SchoolUser> _userManager;
    private readonly IWebHostEnvironment _environment;
    private readonly IConfiguration _configuration;
    private readonly IStaffPermissionService _permissions;
    private readonly IStudentNotifications _notifications;

    public StudentApplicationsController(
      AppDbContext context,
      UserManager<SchoolUser> userManager,
      IWebHostEnvironment environment,
      IConfiguration configuration,
      IStaffPermissionService permissions,
      IStudentNotifications notifications)
    {
      _context = context;
      _userManager = userManager;
      _environment = environment;
      _configuration = configuration;
      _permissions = permissions;
      _notifications = notifications;
    }

    [Authorize(Roles = "Admin,Manager,Staff")]
    [HttpGet]
    public async Task<ActionResult<IList<StudentApplicationDTO>>> GetAll([FromQuery] string? search, CancellationToken cancellationToken)
    {
      var query = BaseQuery();
      var allowedSchoolIds = await _permissions.GetSchoolIdsAsync(User, StaffPermissionScopes.Students, cancellationToken);
      query = query.Where(x => allowedSchoolIds.Contains(x.SchoolId));
      if (!string.IsNullOrWhiteSpace(search))
      {
        var keyword = search.Trim().ToLower();
        query = query.Where(x =>
          (x.StudentEmail ?? "").ToLower().Contains(keyword) ||
          (x.StudentPhone ?? "").ToLower().Contains(keyword) ||
          ((x.StudentFirstName ?? "") + " " + (x.StudentLastName ?? "")).ToLower().Contains(keyword) ||
          (x.MembersJson ?? "").ToLower().Contains(keyword) ||
          (x.CoursePlansJson ?? "").ToLower().Contains(keyword) ||
          (x.AccommodationPlansJson ?? "").ToLower().Contains(keyword) ||
          (x.StudentUser != null &&
            ((x.StudentUser.Email ?? "").ToLower().Contains(keyword) ||
             (x.StudentUser.FirstName + " " + x.StudentUser.LastName).ToLower().Contains(keyword))) ||
          (x.School != null && x.School.Name.ToLower().Contains(keyword)));
      }

      var applications = await query.OrderByDescending(x => x.LastUpdated).ToListAsync(cancellationToken);
      return Ok(applications.Select(x => ToDto(x, includeInternalNotes: true)).ToList());
    }

    [Authorize(Roles = "Admin,Manager")]
    [HttpGet("reviews")]
    public async Task<ActionResult<IList<StudentApplicationDTO>>> GetPendingReviews(CancellationToken cancellationToken)
    {
      var applications = await BaseQuery()
        .Where(application => application.ReviewStatus == PendingReviewStatus)
        .OrderBy(application => application.SubmittedAt)
        .ToListAsync(cancellationToken);
      return Ok(applications.Select(application => ToDto(application, includeInternalNotes: true)).ToList());
    }

    [Authorize(Roles = "Student")]
    [HttpGet("me")]
    public async Task<ActionResult<IList<StudentApplicationDTO>>> GetMine(CancellationToken cancellationToken)
    {
      var userId = await GetCurrentUserIdAsync();
      if (userId == null) return Unauthorized();

      var applications = await BaseQuery()
        .Where(x => x.StudentUserId == userId)
        .OrderByDescending(x => x.LastUpdated)
        .ToListAsync(cancellationToken);

      var visibleApplications = applications
        .Select(StudentView)
        .Where(view => view != null)
        .Select(view => view!)
        .ToList();
      return Ok(visibleApplications);
    }

    /// <summary>
    /// What the student sees: the last published version of the application, plus live confirmed payments, the
    /// student's own uploads and the fee totals computed from both. Null while nothing has been published yet.
    /// </summary>
    internal static StudentApplicationDTO? StudentView(StudentApplication application)
    {
      StudentApplicationDTO? view = null;
      if (!string.IsNullOrWhiteSpace(application.PublishedSnapshotJson))
      {
        view = DeserializeSnapshot(application.PublishedSnapshotJson);
      }
      else if (application.ReviewStatus == PublishedReviewStatus)
      {
        view = ToDto(application, includeInternalNotes: false);
      }
      if (view == null) return null;

      view.Payments = ConfirmedPayments(application);
      view.Submissions = StudentSubmissions(application);
      view.FeeSummaries = ComputeFeeSummaries(view.FeeItems, view.Payments);
      ApplyUploadStatuses(view.RequestedDocuments, application.Submissions);
      return view;
    }

    /// <summary>
    /// The employees' current version (drafts included) with only confirmed payments, without internal notes.
    /// Follow-up reminders to staff use it for a student who has no account or no published version yet.
    /// </summary>
    internal static StudentApplicationDTO WorkingView(StudentApplication application) =>
      ToDto(application, includeInternalNotes: false);

    private static StudentApplicationDTO? DeserializeSnapshot(string? json)
    {
      if (string.IsNullOrWhiteSpace(json)) return null;
      try
      {
        return JsonSerializer.Deserialize<StudentApplicationDTO>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
      }
      catch (JsonException)
      {
        return null;
      }
    }

    [Authorize(Roles = "Student")]
    [HttpPost("{id:guid}/submissions")]
    [EnableRateLimiting(AbuseRateLimits.StudentUploadPolicy)]
    [RequestSizeLimit(MaxDocumentSizeBytes + 1024 * 1024)]
    public async Task<ActionResult<StudentSubmissionDTO>> UploadSubmission(
      Guid id,
      [FromForm] StudentSubmissionUploadDTO request,
      CancellationToken cancellationToken)
    {
      var userId = await GetCurrentUserIdAsync();
      if (userId == null) return Unauthorized();
      var application = await BaseQuery().FirstOrDefaultAsync(item => item.Id == id && item.StudentUserId == userId, cancellationToken);
      var view = application == null ? null : StudentView(application);
      if (application == null || view == null) return NotFound("没有找到这份报名。");

      var documentType = request.DocumentType?.Trim() ?? "";
      if (!AllowedSubmissionTypes.Contains(documentType)) return BadRequest("请选择资料类型。");
      if (application.Submissions.Count >= MaxSubmissionsPerApplication) return BadRequest("上传的文件已经很多了，请联系顾问处理。");
      if (application.Submissions.Count(item => item.ReviewStatus == PendingSubmissionStatus) >= MaxPendingSubmissions)
      {
        return BadRequest("还有很多文件等待顾问确认，请稍后再上传。");
      }

      var submissionId = Guid.NewGuid();
      var saved = await SaveSubmissionFileAsync(id, submissionId, request.File, request.FileName, cancellationToken);
      if (saved.Error != null) return BadRequest(saved.Error);

      var submission = new StudentSubmission
      {
        Id = submissionId,
        StudentApplicationId = id,
        DocumentType = documentType,
        StudentNote = Limit(TrimToNull(request.Note), 300),
        OriginalFileName = saved.OriginalFileName!,
        StoredFileName = saved.StoredFileName!,
        FilePath = saved.RelativePath!,
        ContentType = saved.ContentType!,
        SizeBytes = request.File.Length,
        ReviewStatus = PendingSubmissionStatus,
        SubmittedByUserId = userId,
        SubmittedAt = DateTime.UtcNow,
      };

      try
      {
        _context.StudentSubmissions.Add(submission);
        await _context.SaveChangesAsync(cancellationToken);
      }
      catch
      {
        DeletePrivateFile(saved.RelativePath!);
        throw;
      }

      var dto = ToSubmissionDto(submission);
      _notifications.SubmissionReceived(view, dto);
      return Ok(dto);
    }

    [Authorize(Roles = "Student")]
    [HttpDelete("{applicationId:guid}/submissions/{submissionId:guid}")]
    public async Task<IActionResult> DeleteSubmission(Guid applicationId, Guid submissionId, CancellationToken cancellationToken)
    {
      var userId = await GetCurrentUserIdAsync();
      if (userId == null) return Unauthorized();
      var submission = await _context.StudentSubmissions
        .Include(item => item.StudentApplication)
        .FirstOrDefaultAsync(item => item.Id == submissionId && item.StudentApplicationId == applicationId, cancellationToken);
      if (submission?.StudentApplication == null || submission.StudentApplication.StudentUserId != userId) return NotFound();
      if (submission.ReviewStatus == AcceptedSubmissionStatus) return BadRequest("顾问已经确认收到这个文件，不能删除。如需更换，请重新上传或联系顾问。");

      var path = submission.FilePath;
      _context.StudentSubmissions.Remove(submission);
      await _context.SaveChangesAsync(cancellationToken);
      DeletePrivateFile(path);
      return NoContent();
    }

    [HttpGet("{applicationId:guid}/submissions/{submissionId:guid}/file")]
    public async Task<IActionResult> DownloadSubmission(Guid applicationId, Guid submissionId, CancellationToken cancellationToken)
    {
      var submission = await _context.StudentSubmissions.AsNoTracking()
        .Include(item => item.StudentApplication)
        .FirstOrDefaultAsync(item => item.Id == submissionId && item.StudentApplicationId == applicationId, cancellationToken);
      if (submission?.StudentApplication == null) return NotFound();

      if (User.IsInRole("Staff") || User.IsInRole("Manager"))
      {
        if (!await CanManageStudents(submission.StudentApplication.SchoolId, cancellationToken)) return Forbid();
      }
      else if (!User.IsInRole("Admin"))
      {
        var userId = await GetCurrentUserIdAsync();
        if (!User.IsInRole("Student") || userId != submission.StudentApplication.StudentUserId) return Forbid();
      }

      var path = ResolvePrivateDocumentPath(submission.FilePath);
      if (!System.IO.File.Exists(path)) return NotFound();
      return PhysicalFile(path, submission.ContentType, submission.OriginalFileName, enableRangeProcessing: true);
    }

    [Authorize(Roles = "Admin,Manager,Staff")]
    [HttpPost("{applicationId:guid}/submissions/{submissionId:guid}/accept")]
    public async Task<ActionResult<StudentSubmissionDTO>> AcceptSubmission(Guid applicationId, Guid submissionId, CancellationToken cancellationToken)
    {
      var application = await BaseQuery().FirstOrDefaultAsync(item => item.Id == applicationId, cancellationToken);
      if (application == null) return NotFound();
      if (!await CanManageStudents(application.SchoolId, cancellationToken)) return Forbid();
      var submission = application.Submissions.FirstOrDefault(item => item.Id == submissionId);
      if (submission == null) return NotFound();
      if (submission.ReviewStatus == AcceptedSubmissionStatus) return Ok(ToSubmissionDto(submission));

      submission.ReviewStatus = AcceptedSubmissionStatus;
      submission.ReviewedByUserId = await GetCurrentUserIdAsync();
      submission.ReviewedByName = CurrentUserName();
      submission.ReviewedAt = DateTime.UtcNow;
      submission.ReviewNote = null;
      await _context.SaveChangesAsync(cancellationToken);
      return Ok(ToSubmissionDto(submission));
    }

    [Authorize(Roles = "Admin,Manager,Staff")]
    [HttpPost("{applicationId:guid}/submissions/{submissionId:guid}/return")]
    public async Task<ActionResult<StudentSubmissionDTO>> ReturnSubmission(
      Guid applicationId,
      Guid submissionId,
      [FromBody] ReturnStudentSubmissionDTO request,
      CancellationToken cancellationToken)
    {
      var application = await BaseQuery().FirstOrDefaultAsync(item => item.Id == applicationId, cancellationToken);
      if (application == null) return NotFound();
      if (!await CanManageStudents(application.SchoolId, cancellationToken)) return Forbid();
      var submission = application.Submissions.FirstOrDefault(item => item.Id == submissionId);
      if (submission == null) return NotFound();
      var reason = TrimToNull(request.Reason);
      if (reason == null) return BadRequest("请填写需要学员重新上传的原因。");

      submission.ReviewStatus = ReturnedSubmissionStatus;
      submission.ReviewedByUserId = await GetCurrentUserIdAsync();
      submission.ReviewedByName = CurrentUserName();
      submission.ReviewedAt = DateTime.UtcNow;
      submission.ReviewNote = Limit(reason, 500);
      await _context.SaveChangesAsync(cancellationToken);

      var dto = ToSubmissionDto(submission);
      var view = StudentView(application);
      if (view != null) _notifications.SubmissionReturned(view, dto, application.StudentUser);
      return Ok(dto);
    }

    [Authorize(Roles = "Admin,Manager,Staff")]
    [HttpPost]
    public async Task<ActionResult<StudentApplicationDTO>> Create([FromBody] CreateStudentApplicationDTO request, CancellationToken cancellationToken)
    {
      var validationError = ValidateApplication(request.SchoolId, request.StartDate, request.EndDate, request.Status, request.VisaStatus);
      if (validationError != null) return BadRequest(validationError);
      if (!await CanManageStudents(request.SchoolId, cancellationToken)) return Forbid();
      if (!await _context.Schools.AnyAsync(x => x.Id == request.SchoolId, cancellationToken)) return BadRequest("所选学校不存在。");

      var firstName = request.FirstName.Trim();
      if (string.IsNullOrWhiteSpace(firstName)) return BadRequest("请填写学生姓名。");
      var structureError = PrepareStructure(
        request.EnrollmentType, request.Members, request.CoursePlans, request.AccommodationPlans,
        out var enrollmentType, out var members, out var coursePlans, out var accommodationPlans);
      if (structureError != null) return BadRequest(structureError);
      var extrasError = PrepareExtras(request.FeeItems, request.RequestedDocuments, out var feeItems, out var requestedDocuments);
      if (extrasError != null) return BadRequest(extrasError);
      var email = TrimToNull(request.Email)?.ToLowerInvariant();
      SchoolUser? student = null;
      if (email != null)
      {
        student = await _userManager.FindByEmailAsync(email);
        if (student != null && !await _userManager.IsInRoleAsync(student, "Student"))
        {
          return BadRequest("该邮箱已属于员工账号，不能关联为学生账号。");
        }
      }

      var now = DateTime.UtcNow;
      var application = new StudentApplication
      {
        Id = Guid.NewGuid(),
        StudentUserId = student?.Id,
        StudentFirstName = firstName,
        StudentLastName = TrimToNull(request.LastName),
        StudentEmail = email,
        StudentPhone = TrimToNull(request.PhoneNumber),
        EnrollmentType = enrollmentType,
        EnrollmentDate = request.EnrollmentDate?.Date ?? now.Date,
        VisaStatus = NormalizeVisaStatus(request.VisaStatus),
        MembersJson = SerializeDetails(members),
        CoursePlansJson = SerializeDetails(coursePlans),
        AccommodationPlansJson = SerializeDetails(accommodationPlans),
        SchoolId = request.SchoolId,
        CourseName = Limit(SummarizePlanNames(coursePlans) ?? TrimToNull(request.CourseName), 200),
        AccommodationName = Limit(SummarizePlanNames(accommodationPlans) ?? TrimToNull(request.AccommodationName), 200),
        StartDate = EarliestStart(coursePlans, accommodationPlans) ?? request.StartDate,
        EndDate = LatestEnd(coursePlans, accommodationPlans) ?? request.EndDate,
        Status = NormalizeStatus(request.Status),
        StudentVisibleNotes = TrimToNull(request.StudentVisibleNotes),
        InternalNotes = TrimToNull(request.InternalNotes),
        FeeItemsJson = SerializeDetails(feeItems),
        RequestedDocumentsJson = SerializeDetails(requestedDocuments),
        ConsultantName = Limit(TrimToNull(request.ConsultantName), 50),
        CreatedAt = now,
        LastUpdated = now,
        ReviewStatus = DraftReviewStatus,
      };

      _context.StudentApplications.Add(application);
      await _context.SaveChangesAsync(cancellationToken);

      application.StudentUser = student;
      application.School = await _context.Schools.AsNoTracking().FirstAsync(x => x.Id == application.SchoolId, cancellationToken);
      return CreatedAtAction(nameof(GetAll), ToDto(application, includeInternalNotes: true));
    }

    [Authorize(Roles = "Admin,Manager,Staff")]
    [HttpPut("{id:guid}")]
    public async Task<ActionResult<StudentApplicationDTO>> Update(Guid id, [FromBody] UpdateStudentApplicationDTO request, CancellationToken cancellationToken)
    {
      var validationError = ValidateApplication(request.SchoolId, request.StartDate, request.EndDate, request.Status, request.VisaStatus);
      if (validationError != null) return BadRequest(validationError);

      var application = await BaseQuery().FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
      if (application == null) return NotFound();
      if (!await CanManageStudents(application.SchoolId, cancellationToken) ||
          !await CanManageStudents(request.SchoolId, cancellationToken)) return Forbid();
      if (!await _context.Schools.AnyAsync(x => x.Id == request.SchoolId, cancellationToken)) return BadRequest("所选学校不存在。");

      EnsurePublishedSnapshot(application);

      var firstName = request.FirstName.Trim();
      if (string.IsNullOrWhiteSpace(firstName)) return BadRequest("请填写学生姓名。");
      var structureError = PrepareStructure(
        request.EnrollmentType, request.Members, request.CoursePlans, request.AccommodationPlans,
        out var enrollmentType, out var members, out var coursePlans, out var accommodationPlans);
      if (structureError != null) return BadRequest(structureError);
      var extrasError = PrepareExtras(request.FeeItems, request.RequestedDocuments, out var feeItems, out var requestedDocuments);
      if (extrasError != null) return BadRequest(extrasError);
      var email = TrimToNull(request.Email)?.ToLowerInvariant();
      if (application.StudentUserId != null)
      {
        var linkedEmail = application.StudentUser?.Email?.Trim().ToLowerInvariant();
        if (email != linkedEmail)
        {
          return BadRequest("该档案已经关联学生账号，不能在报名资料中更换登录邮箱。请由管理处理账号信息。");
        }
      }
      else if (email != null)
      {
        var matchingUser = await _userManager.FindByEmailAsync(email);
        if (matchingUser != null)
        {
          if (!await _userManager.IsInRoleAsync(matchingUser, "Student"))
          {
            return BadRequest("该邮箱已属于员工账号，不能关联为学生账号。");
          }
          application.StudentUserId = matchingUser.Id;
          application.StudentUser = matchingUser;
        }
      }

      application.StudentFirstName = firstName;
      application.StudentLastName = TrimToNull(request.LastName);
      application.StudentEmail = email;
      application.StudentPhone = TrimToNull(request.PhoneNumber);
      application.EnrollmentType = enrollmentType;
      application.EnrollmentDate = request.EnrollmentDate?.Date;
      application.VisaStatus = NormalizeVisaStatus(request.VisaStatus);
      application.MembersJson = SerializeDetails(members);
      application.CoursePlansJson = SerializeDetails(coursePlans);
      application.AccommodationPlansJson = SerializeDetails(accommodationPlans);
      application.SchoolId = request.SchoolId;
      application.CourseName = Limit(SummarizePlanNames(coursePlans) ?? TrimToNull(request.CourseName), 200);
      application.AccommodationName = Limit(SummarizePlanNames(accommodationPlans) ?? TrimToNull(request.AccommodationName), 200);
      application.StartDate = EarliestStart(coursePlans, accommodationPlans) ?? request.StartDate;
      application.EndDate = LatestEnd(coursePlans, accommodationPlans) ?? request.EndDate;
      application.Status = NormalizeStatus(request.Status);
      application.StudentVisibleNotes = TrimToNull(request.StudentVisibleNotes);
      application.InternalNotes = TrimToNull(request.InternalNotes);
      application.FeeItemsJson = SerializeDetails(feeItems);
      application.RequestedDocumentsJson = SerializeDetails(requestedDocuments);
      application.ConsultantName = Limit(TrimToNull(request.ConsultantName), 50);
      application.LastUpdated = DateTime.UtcNow;
      MarkDraft(application);

      await _context.SaveChangesAsync(cancellationToken);
      application.School = await _context.Schools.AsNoTracking().FirstAsync(x => x.Id == application.SchoolId, cancellationToken);
      return Ok(ToDto(application, includeInternalNotes: true));
    }

    [Authorize(Roles = "Admin,Manager,Staff")]
    [HttpPost("{id:guid}/documents")]
    [RequestSizeLimit(MaxDocumentSizeBytes + 1024 * 1024)]
    public async Task<ActionResult<StudentApplicationDocumentDTO>> UploadDocument(Guid id, [FromForm] StudentDocumentUploadDTO request, CancellationToken cancellationToken)
    {
      var application = await BaseQuery().FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
      if (application == null) return NotFound();
      if (!await CanManageStudents(application.SchoolId, cancellationToken)) return Forbid();
      if (request.File.Length == 0 || request.File.Length > MaxDocumentSizeBytes) return BadRequest("文件不能为空，且大小不能超过 15MB。");
      if (!AllowedDocumentCategories.Contains(request.DocumentType.Trim())) return BadRequest("文件类型无效。");

      var extension = Path.GetExtension(request.File.FileName);
      if (!AllowedDocumentTypes.TryGetValue(extension, out var safeContentType)) return BadRequest("仅支持 PDF、PNG、JPG 和 DOCX 文件。");

      var documentId = Guid.NewGuid();
      var storedFileName = $"{documentId:N}{extension.ToLowerInvariant()}";
      var relativePath = Path.Combine(id.ToString("N"), storedFileName);
      var targetPath = ResolvePrivateDocumentPath(relativePath);
      Directory.CreateDirectory(Path.GetDirectoryName(targetPath)!);

      await using (var stream = new FileStream(targetPath, FileMode.CreateNew, FileAccess.Write, FileShare.None))
      {
        await request.File.CopyToAsync(stream, cancellationToken);
      }

      var originalFileName = Path.GetFileName(request.File.FileName);
      var document = new StudentApplicationDocument
      {
        Id = documentId,
        StudentApplicationId = id,
        DocumentType = request.DocumentType.Trim(),
        DisplayName = TrimToNull(request.DisplayName) ?? originalFileName,
        OriginalFileName = originalFileName,
        StoredFileName = storedFileName,
        FilePath = relativePath.Replace('\\', '/'),
        ContentType = safeContentType,
        SizeBytes = request.File.Length,
        IsVisibleToStudent = request.IsVisibleToStudent,
        UploadedAt = DateTime.UtcNow,
      };

      try
      {
        EnsurePublishedSnapshot(application);
        _context.StudentApplicationDocuments.Add(document);
        application.LastUpdated = DateTime.UtcNow;
        MarkDraft(application);
        await _context.SaveChangesAsync(cancellationToken);
      }
      catch
      {
        System.IO.File.Delete(targetPath);
        throw;
      }

      return Ok(ToDocumentDto(document));
    }

    [Authorize(Roles = "Admin,Manager")]
    [HttpGet("payment-reviews")]
    public async Task<ActionResult<IList<StudentPaymentDTO>>> GetPendingPaymentReviews(CancellationToken cancellationToken)
    {
      var payments = await _context.StudentPayments.AsNoTracking()
        .Include(payment => payment.StudentApplication)
        .ThenInclude(application => application!.School)
        .Where(payment => payment.ReviewStatus == PendingPaymentStatus)
        .OrderBy(payment => payment.SubmittedAt)
        .ToListAsync(cancellationToken);
      return Ok(payments.Select(ToPaymentDto).ToList());
    }

    [Authorize(Roles = "Admin,Manager,Staff")]
    [HttpPost("{id:guid}/payments")]
    [RequestSizeLimit(MaxDocumentSizeBytes + 1024 * 1024)]
    public async Task<ActionResult<StudentPaymentDTO>> SubmitPayment(
      Guid id,
      [FromForm] StudentPaymentSubmissionDTO request,
      CancellationToken cancellationToken)
    {
      var application = await BaseQuery().FirstOrDefaultAsync(item => item.Id == id, cancellationToken);
      if (application == null) return NotFound();
      if (!await CanManageStudents(application.SchoolId, cancellationToken)) return Forbid();
      var validationError = ValidatePayment(request, requireFile: true);
      if (validationError != null) return BadRequest(validationError);

      var paymentId = Guid.NewGuid();
      var savedFile = await SavePaymentFileAsync(id, paymentId, request.File!, cancellationToken);
      if (savedFile.Error != null) return BadRequest(savedFile.Error);

      var now = DateTime.UtcNow;
      var payment = new StudentPayment
      {
        Id = paymentId,
        StudentApplicationId = id,
        StudentApplication = application,
        PayerName = request.PayerName.Trim(),
        PaymentType = request.PaymentType.Trim(),
        Amount = decimal.Round(request.Amount, 2),
        CurrencyCode = request.CurrencyCode.Trim().ToUpperInvariant(),
        PaidAt = request.PaidAt.Date,
        PaymentMethod = request.PaymentMethod.Trim(),
        ReceivingAccount = Limit(TrimToNull(request.ReceivingAccount), 150),
        ReferenceNumber = Limit(TrimToNull(request.ReferenceNumber), 100),
        Note = Limit(TrimToNull(request.Note), 500),
        ReviewStatus = PendingPaymentStatus,
        SubmittedByUserId = await GetCurrentUserIdAsync(),
        SubmittedByName = CurrentUserName(),
        SubmittedAt = now,
        OriginalFileName = savedFile.OriginalFileName!,
        StoredFileName = savedFile.StoredFileName!,
        FilePath = savedFile.RelativePath!,
        ContentType = savedFile.ContentType!,
        SizeBytes = request.File!.Length,
        CreatedAt = now,
        LastUpdated = now,
      };

      try
      {
        _context.StudentPayments.Add(payment);
        application.LastUpdated = now;
        await _context.SaveChangesAsync(cancellationToken);
      }
      catch
      {
        DeletePrivateFile(savedFile.RelativePath!);
        throw;
      }

      return Ok(ToPaymentDto(payment));
    }

    [Authorize(Roles = "Admin,Manager,Staff")]
    [HttpPut("{applicationId:guid}/payments/{paymentId:guid}")]
    [RequestSizeLimit(MaxDocumentSizeBytes + 1024 * 1024)]
    public async Task<ActionResult<StudentPaymentDTO>> ResubmitPayment(
      Guid applicationId,
      Guid paymentId,
      [FromForm] StudentPaymentSubmissionDTO request,
      CancellationToken cancellationToken)
    {
      var application = await BaseQuery().FirstOrDefaultAsync(item => item.Id == applicationId, cancellationToken);
      if (application == null) return NotFound();
      if (!await CanManageStudents(application.SchoolId, cancellationToken)) return Forbid();
      var payment = application.Payments.FirstOrDefault(item => item.Id == paymentId);
      if (payment == null) return NotFound();
      if (payment.ReviewStatus == ConfirmedPaymentStatus) return BadRequest("已确认到账的记录不能修改。");
      var validationError = ValidatePayment(request, requireFile: false);
      if (validationError != null) return BadRequest(validationError);

      PaymentFileResult? savedFile = null;
      if (request.File != null)
      {
        savedFile = await SavePaymentFileAsync(applicationId, paymentId, request.File, cancellationToken);
        if (savedFile.Error != null) return BadRequest(savedFile.Error);
      }

      var previousPath = payment.FilePath;
      var now = DateTime.UtcNow;
      payment.PayerName = request.PayerName.Trim();
      payment.PaymentType = request.PaymentType.Trim();
      payment.Amount = decimal.Round(request.Amount, 2);
      payment.CurrencyCode = request.CurrencyCode.Trim().ToUpperInvariant();
      payment.PaidAt = request.PaidAt.Date;
      payment.PaymentMethod = request.PaymentMethod.Trim();
      payment.ReceivingAccount = Limit(TrimToNull(request.ReceivingAccount), 150);
      payment.ReferenceNumber = Limit(TrimToNull(request.ReferenceNumber), 100);
      payment.Note = Limit(TrimToNull(request.Note), 500);
      payment.ReviewStatus = PendingPaymentStatus;
      payment.SubmittedByUserId = await GetCurrentUserIdAsync();
      payment.SubmittedByName = CurrentUserName();
      payment.SubmittedAt = now;
      payment.ReviewedByUserId = null;
      payment.ReviewedByName = null;
      payment.ReviewedAt = null;
      payment.ReviewNote = null;
      payment.LastUpdated = now;
      application.LastUpdated = now;
      if (savedFile != null)
      {
        payment.OriginalFileName = savedFile.OriginalFileName!;
        payment.StoredFileName = savedFile.StoredFileName!;
        payment.FilePath = savedFile.RelativePath!;
        payment.ContentType = savedFile.ContentType!;
        payment.SizeBytes = request.File!.Length;
      }

      try
      {
        await _context.SaveChangesAsync(cancellationToken);
      }
      catch
      {
        if (savedFile != null) DeletePrivateFile(savedFile.RelativePath!);
        throw;
      }
      if (savedFile != null) DeletePrivateFile(previousPath);
      return Ok(ToPaymentDto(payment));
    }

    [Authorize(Roles = "Admin,Manager")]
    [HttpPost("{applicationId:guid}/payments/{paymentId:guid}/confirm")]
    public async Task<ActionResult<StudentPaymentDTO>> ConfirmPayment(
      Guid applicationId,
      Guid paymentId,
      [FromBody] StudentPaymentReviewDTO? request,
      CancellationToken cancellationToken)
    {
      var application = await BaseQuery().FirstOrDefaultAsync(item => item.Id == applicationId, cancellationToken);
      if (application == null) return NotFound();
      var payment = application.Payments.FirstOrDefault(item => item.Id == paymentId);
      if (payment == null) return NotFound();
      if (payment.ReviewStatus != PendingPaymentStatus) return BadRequest("只有待审核付款可以确认到账。");

      var now = DateTime.UtcNow;
      payment.ReviewStatus = ConfirmedPaymentStatus;
      payment.ReviewedByUserId = await GetCurrentUserIdAsync();
      payment.ReviewedByName = CurrentUserName();
      payment.ReviewedAt = now;
      payment.ReviewNote = Limit(TrimToNull(request?.Note), 500);
      payment.LastUpdated = now;
      application.LastUpdated = now;
      await _context.SaveChangesAsync(cancellationToken);

      var paymentDto = ToPaymentDto(payment);
      var view = StudentView(application);
      if (view != null) _notifications.PaymentConfirmed(view, paymentDto, application.StudentUser);
      return Ok(paymentDto);
    }

    [Authorize(Roles = "Admin,Manager")]
    [HttpPost("{applicationId:guid}/payments/{paymentId:guid}/return")]
    public async Task<ActionResult<StudentPaymentDTO>> ReturnPayment(
      Guid applicationId,
      Guid paymentId,
      [FromBody] ReturnStudentPaymentReviewDTO request,
      CancellationToken cancellationToken)
    {
      var application = await BaseQuery().FirstOrDefaultAsync(item => item.Id == applicationId, cancellationToken);
      if (application == null) return NotFound();
      var payment = application.Payments.FirstOrDefault(item => item.Id == paymentId);
      if (payment == null) return NotFound();
      if (payment.ReviewStatus != PendingPaymentStatus) return BadRequest("只有待审核付款可以退回修改。");
      var reason = TrimToNull(request.Reason);
      if (reason == null) return BadRequest("请填写退回原因。");

      var now = DateTime.UtcNow;
      payment.ReviewStatus = ReturnedPaymentStatus;
      payment.ReviewedByUserId = await GetCurrentUserIdAsync();
      payment.ReviewedByName = CurrentUserName();
      payment.ReviewedAt = now;
      payment.ReviewNote = Limit(reason, 500);
      payment.LastUpdated = now;
      application.LastUpdated = now;
      await _context.SaveChangesAsync(cancellationToken);
      return Ok(ToPaymentDto(payment));
    }

    [Authorize(Roles = "Admin,Manager,Staff")]
    [HttpDelete("{applicationId:guid}/payments/{paymentId:guid}")]
    public async Task<IActionResult> DeletePayment(Guid applicationId, Guid paymentId, CancellationToken cancellationToken)
    {
      var application = await BaseQuery().FirstOrDefaultAsync(item => item.Id == applicationId, cancellationToken);
      if (application == null) return NotFound();
      if (!await CanManageStudents(application.SchoolId, cancellationToken)) return Forbid();
      var payment = application.Payments.FirstOrDefault(item => item.Id == paymentId);
      if (payment == null) return NotFound();
      if (payment.ReviewStatus == ConfirmedPaymentStatus) return BadRequest("已确认到账的记录不能删除。");

      var path = payment.FilePath;
      _context.StudentPayments.Remove(payment);
      application.LastUpdated = DateTime.UtcNow;
      await _context.SaveChangesAsync(cancellationToken);
      DeletePrivateFile(path);
      return NoContent();
    }

    [HttpGet("{applicationId:guid}/payments/{paymentId:guid}/receipt")]
    public async Task<IActionResult> DownloadPaymentReceipt(Guid applicationId, Guid paymentId, CancellationToken cancellationToken)
    {
      var payment = await _context.StudentPayments.AsNoTracking()
        .Include(item => item.StudentApplication)
        .FirstOrDefaultAsync(item => item.Id == paymentId && item.StudentApplicationId == applicationId, cancellationToken);
      if (payment?.StudentApplication == null) return NotFound();

      if (User.IsInRole("Staff") || User.IsInRole("Manager"))
      {
        if (!await CanManageStudents(payment.StudentApplication.SchoolId, cancellationToken)) return Forbid();
      }
      else if (!User.IsInRole("Admin"))
      {
        var userId = await GetCurrentUserIdAsync();
        if (!User.IsInRole("Student") || userId != payment.StudentApplication.StudentUserId ||
            payment.ReviewStatus != ConfirmedPaymentStatus || !payment.IsVisibleToStudent) return Forbid();
      }

      var path = ResolvePrivateDocumentPath(payment.FilePath);
      if (!System.IO.File.Exists(path)) return NotFound();
      return PhysicalFile(path, payment.ContentType, payment.OriginalFileName, enableRangeProcessing: true);
    }

    [Authorize(Roles = "Admin,Manager,Staff")]
    [HttpPost("{id:guid}/submit-review")]
    public async Task<ActionResult<StudentApplicationDTO>> SubmitForReview(
      Guid id,
      [FromBody] SubmitStudentApplicationReviewDTO request,
      CancellationToken cancellationToken)
    {
      var application = await BaseQuery().FirstOrDefaultAsync(item => item.Id == id, cancellationToken);
      if (application == null) return NotFound();
      if (!await CanManageStudents(application.SchoolId, cancellationToken)) return Forbid();
      if (application.ReviewStatus != DraftReviewStatus) return BadRequest("只有草稿可以提交审核。");

      var summary = TrimToNull(request.ChangeSummary);
      if (summary == null) return BadRequest("请填写本次修改说明后再提交审核。");
      application.ChangeSummary = summary.Length <= 500 ? summary : summary[..500];
      application.ReviewStatus = PendingReviewStatus;
      application.SubmittedByUserId = await GetCurrentUserIdAsync();
      application.SubmittedByName = CurrentUserName();
      application.SubmittedAt = DateTime.UtcNow;
      await _context.SaveChangesAsync(cancellationToken);
      return Ok(ToDto(application, includeInternalNotes: true));
    }

    [Authorize(Roles = "Admin,Manager")]
    [HttpPost("{id:guid}/publish")]
    public async Task<ActionResult<StudentApplicationDTO>> Publish(
      Guid id,
      [FromBody] PublishStudentApplicationDTO? request,
      CancellationToken cancellationToken)
    {
      var application = await BaseQuery().FirstOrDefaultAsync(item => item.Id == id, cancellationToken);
      if (application == null) return NotFound();
      if (application.ReviewStatus != DraftReviewStatus && application.ReviewStatus != PendingReviewStatus)
      {
        return BadRequest("只有草稿或待审核档案可以发布。");
      }

      if (application.ReviewStatus == DraftReviewStatus)
      {
        var summary = TrimToNull(request?.ChangeSummary);
        if (summary == null) return BadRequest("管理直接发布前，请填写本次修改说明。");
        application.ChangeSummary = summary.Length <= 500 ? summary : summary[..500];
        application.SubmittedByUserId = await GetCurrentUserIdAsync();
        application.SubmittedByName = CurrentUserName();
        application.SubmittedAt = DateTime.UtcNow;
      }

      var now = DateTime.UtcNow;
      var previousVersion = DeserializeSnapshot(application.PublishedSnapshotJson);
      application.PublishedByUserId = await GetCurrentUserIdAsync();
      application.PublishedByName = CurrentUserName();
      application.PublishedAt = now;
      application.PublishedSnapshotJson = CreatePublishedSnapshot(application, now);
      application.ReviewStatus = PublishedReviewStatus;
      application.LastUpdated = now;

      var pendingDeletions = application.Documents.Where(document => document.IsPendingDeletion).ToList();
      _context.StudentApplicationDocuments.RemoveRange(pendingDeletions);
      await _context.SaveChangesAsync(cancellationToken);
      foreach (var document in pendingDeletions)
      {
        var path = ResolvePrivateDocumentPath(document.FilePath);
        if (System.IO.File.Exists(path)) System.IO.File.Delete(path);
      }

      var publishedVersion = DeserializeSnapshot(application.PublishedSnapshotJson);
      if (publishedVersion != null)
      {
        _notifications.ApplicationPublished(previousVersion, publishedVersion, application.StudentUser);
      }

      return Ok(ToDto(application, includeInternalNotes: true));
    }

    [Authorize(Roles = "Admin,Manager")]
    [HttpPost("{id:guid}/return-to-draft")]
    public async Task<ActionResult<StudentApplicationDTO>> ReturnToDraft(
      Guid id,
      [FromBody] ReturnStudentApplicationReviewDTO request,
      CancellationToken cancellationToken)
    {
      var application = await BaseQuery().FirstOrDefaultAsync(item => item.Id == id, cancellationToken);
      if (application == null) return NotFound();
      if (application.ReviewStatus != PendingReviewStatus) return BadRequest("只有待审核档案可以退回。");

      application.ReviewStatus = DraftReviewStatus;
      var normalizedReason = TrimToNull(request.Reason);
      if (normalizedReason != null)
      {
        application.ChangeSummary = $"{application.ChangeSummary ?? "待审核修改"}｜管理退回：{normalizedReason}";
        if (application.ChangeSummary.Length > 500) application.ChangeSummary = application.ChangeSummary[..500];
      }
      application.LastUpdated = DateTime.UtcNow;
      await _context.SaveChangesAsync(cancellationToken);
      return Ok(ToDto(application, includeInternalNotes: true));
    }

    [HttpGet("{applicationId:guid}/documents/{documentId:guid}")]
    public async Task<IActionResult> DownloadDocument(Guid applicationId, Guid documentId, CancellationToken cancellationToken)
    {
      var document = await _context.StudentApplicationDocuments.AsNoTracking().Include(x => x.StudentApplication)
        .FirstOrDefaultAsync(x => x.Id == documentId && x.StudentApplicationId == applicationId, cancellationToken);
      if (document?.StudentApplication == null) return NotFound();

      if (User.IsInRole("Staff") || User.IsInRole("Manager"))
      {
        if (!await CanManageStudents(document.StudentApplication.SchoolId, cancellationToken)) return Forbid();
      }
      else if (!User.IsInRole("Admin"))
      {
        var userId = await GetCurrentUserIdAsync();
        if (!User.IsInRole("Student") || userId != document.StudentApplication.StudentUserId ||
            !IsDocumentPublishedToStudent(document.StudentApplication, document)) return Forbid();
      }

      var path = ResolvePrivateDocumentPath(document.FilePath);
      if (!System.IO.File.Exists(path)) return NotFound();
      return PhysicalFile(path, document.ContentType, document.OriginalFileName, enableRangeProcessing: true);
    }

    [Authorize(Roles = "Admin,Manager,Staff")]
    [HttpDelete("{applicationId:guid}/documents/{documentId:guid}")]
    public async Task<IActionResult> DeleteDocument(Guid applicationId, Guid documentId, CancellationToken cancellationToken)
    {
      var application = await BaseQuery().FirstOrDefaultAsync(item => item.Id == applicationId, cancellationToken);
      if (application == null) return NotFound();
      var document = application.Documents.FirstOrDefault(item => item.Id == documentId && !item.IsPendingDeletion);
      if (document == null) return NotFound();
      if (!await CanManageStudents(application.SchoolId, cancellationToken)) return Forbid();

      EnsurePublishedSnapshot(application);
      document.IsPendingDeletion = true;
      application.LastUpdated = DateTime.UtcNow;
      MarkDraft(application);
      await _context.SaveChangesAsync(cancellationToken);
      return NoContent();
    }

    private IQueryable<StudentApplication> BaseQuery() => _context.StudentApplications
      .Include(x => x.StudentUser).Include(x => x.School).Include(x => x.Documents).Include(x => x.Payments)
      .Include(x => x.Submissions).AsSplitQuery();

    private async Task<string?> GetCurrentUserIdAsync()
    {
      var id = User.FindFirstValue(ClaimTypes.NameIdentifier);
      if (!string.IsNullOrWhiteSpace(id)) return id;
      var email = User.FindFirstValue(ClaimTypes.Email);
      return string.IsNullOrWhiteSpace(email) ? null : (await _userManager.FindByEmailAsync(email))?.Id;
    }

    private Task<bool> CanManageStudents(Guid schoolId, CancellationToken cancellationToken) =>
      _permissions.HasAsync(User, schoolId, StaffPermissionScopes.Students, cancellationToken);

    private string ResolvePrivateDocumentPath(string relativePath)
    {
      var configuredRoot = _configuration["StudentDocuments:RootPath"];
      var rootPath = string.IsNullOrWhiteSpace(configuredRoot)
        ? Path.Combine(_environment.ContentRootPath, "App_Data", "student-documents")
        : Path.IsPathRooted(configuredRoot)
          ? configuredRoot
          : Path.Combine(_environment.ContentRootPath, configuredRoot);
      var root = Path.GetFullPath(rootPath)
        .TrimEnd(Path.DirectorySeparatorChar, Path.AltDirectorySeparatorChar);
      var candidate = Path.GetFullPath(Path.Combine(root, relativePath.Replace('/', Path.DirectorySeparatorChar)));
      if (!candidate.StartsWith($"{root}{Path.DirectorySeparatorChar}", StringComparison.OrdinalIgnoreCase)) throw new InvalidOperationException("Invalid document path.");
      return candidate;
    }

    private static StudentApplicationDTO ToDto(StudentApplication application, bool includeInternalNotes)
    {
      var coursePlans = DeserializeDetails<StudentApplicationPlanDTO>(application.CoursePlansJson);
      var accommodationPlans = DeserializeDetails<StudentApplicationPlanDTO>(application.AccommodationPlansJson);
      if (coursePlans.Count == 0 && !string.IsNullOrWhiteSpace(application.CourseName))
      {
        coursePlans.Add(new StudentApplicationPlanDTO
        {
          Key = "legacy-course",
          ParticipantKey = "primary",
          Name = application.CourseName,
          StartDate = application.StartDate,
          EndDate = application.EndDate,
          Weeks = CalculateWeeks(application.StartDate, application.EndDate),
        });
      }
      if (accommodationPlans.Count == 0 && !string.IsNullOrWhiteSpace(application.AccommodationName))
      {
        accommodationPlans.Add(new StudentApplicationPlanDTO
        {
          Key = "legacy-accommodation",
          ParticipantKey = "primary",
          Name = application.AccommodationName,
          StartDate = application.StartDate,
          EndDate = application.EndDate,
          Weeks = CalculateWeeks(application.StartDate, application.EndDate),
        });
      }

      var feeItems = DeserializeDetails<StudentFeeItemDTO>(application.FeeItemsJson);
      var requestedDocuments = DeserializeDetails<StudentRequestedDocumentDTO>(application.RequestedDocumentsJson);
      ApplyUploadStatuses(requestedDocuments, application.Submissions);

      return new StudentApplicationDTO
      {
        Id = application.Id,
        FeeItems = feeItems,
        FeeSummaries = ComputeFeeSummaries(feeItems, ConfirmedPayments(application)),
        RequestedDocuments = requestedDocuments,
        ConsultantName = application.ConsultantName,
        Submissions = StudentSubmissions(application),
        StudentFirstName = application.StudentFirstName ?? application.StudentUser?.FirstName ?? "",
        StudentLastName = application.StudentLastName ?? application.StudentUser?.LastName ?? "",
        StudentName = $"{application.StudentFirstName ?? application.StudentUser?.FirstName} {application.StudentLastName ?? application.StudentUser?.LastName}".Trim(),
        StudentEmail = application.StudentEmail ?? application.StudentUser?.Email,
        StudentPhone = application.StudentPhone ?? application.StudentUser?.PhoneNumber,
        HasStudentAccount = application.StudentUserId != null,
        EnrollmentType = AllowedEnrollmentTypes.Contains(application.EnrollmentType) ? application.EnrollmentType : "单人报名",
        EnrollmentDate = application.EnrollmentDate ?? application.CreatedAt.Date,
        VisaStatus = AllowedVisaStatuses.Contains(application.VisaStatus) ? application.VisaStatus : "未确认",
        Members = DeserializeDetails<StudentApplicationMemberDTO>(application.MembersJson),
        CoursePlans = coursePlans,
        AccommodationPlans = accommodationPlans,
        StudyWeeks = CalculateStudyWeeks(coursePlans, application.StartDate, application.EndDate),
        SchoolId = application.SchoolId,
        SchoolName = application.School?.Name ?? "",
        CourseName = application.CourseName,
        AccommodationName = application.AccommodationName,
        StartDate = application.StartDate,
        EndDate = application.EndDate,
        Status = application.Status,
        StudentVisibleNotes = application.StudentVisibleNotes,
        InternalNotes = includeInternalNotes ? application.InternalNotes : null,
        CreatedAt = application.CreatedAt,
        LastUpdated = application.LastUpdated,
        ReviewStatus = application.ReviewStatus,
        ChangeSummary = application.ChangeSummary,
        SubmittedByName = application.SubmittedByName,
        SubmittedAt = application.SubmittedAt,
        PublishedByName = application.PublishedByName,
        PublishedAt = application.PublishedAt,
        Documents = application.Documents.Where(x => !x.IsPendingDeletion && (includeInternalNotes || x.IsVisibleToStudent))
          .OrderByDescending(x => x.UploadedAt).Select(ToDocumentDto).ToList(),
        Payments = application.Payments
          .Where(payment => includeInternalNotes || (payment.ReviewStatus == ConfirmedPaymentStatus && payment.IsVisibleToStudent))
          .OrderByDescending(payment => payment.PaidAt)
          .ThenByDescending(payment => payment.SubmittedAt)
          .Select(ToPaymentDto)
          .ToList(),
      };
    }

    private static StudentApplicationDocumentDTO ToDocumentDto(StudentApplicationDocument document) => new()
    {
      Id = document.Id,
      DocumentType = document.DocumentType,
      DisplayName = document.DisplayName,
      OriginalFileName = document.OriginalFileName,
      SizeBytes = document.SizeBytes,
      IsVisibleToStudent = document.IsVisibleToStudent,
      UploadedAt = document.UploadedAt,
      DownloadUrl = $"student-applications/{document.StudentApplicationId}/documents/{document.Id}",
    };

    private static StudentPaymentDTO ToPaymentDto(StudentPayment payment)
    {
      var application = payment.StudentApplication;
      var studentName = $"{application?.StudentFirstName ?? application?.StudentUser?.FirstName} {application?.StudentLastName ?? application?.StudentUser?.LastName}".Trim();
      return new StudentPaymentDTO
      {
        Id = payment.Id,
        StudentApplicationId = payment.StudentApplicationId,
        StudentName = studentName,
        SchoolName = application?.School?.Name ?? "",
        PayerName = payment.PayerName,
        PaymentType = payment.PaymentType,
        Amount = payment.Amount,
        CurrencyCode = payment.CurrencyCode,
        PaidAt = payment.PaidAt,
        PaymentMethod = payment.PaymentMethod,
        ReceivingAccount = payment.ReceivingAccount,
        ReferenceNumber = payment.ReferenceNumber,
        Note = payment.Note,
        ReviewStatus = payment.ReviewStatus,
        SubmittedByName = payment.SubmittedByName,
        SubmittedAt = payment.SubmittedAt,
        ReviewedByName = payment.ReviewedByName,
        ReviewedAt = payment.ReviewedAt,
        ReviewNote = payment.ReviewNote,
        OriginalFileName = payment.OriginalFileName,
        SizeBytes = payment.SizeBytes,
        IsVisibleToStudent = payment.IsVisibleToStudent,
        DownloadUrl = $"student-applications/{payment.StudentApplicationId}/payments/{payment.Id}/receipt",
      };
    }

    private static IList<StudentPaymentDTO> ConfirmedPayments(StudentApplication application) =>
      application.Payments
        .Where(payment => payment.ReviewStatus == ConfirmedPaymentStatus && payment.IsVisibleToStudent)
        .OrderByDescending(payment => payment.PaidAt)
        .ThenByDescending(payment => payment.SubmittedAt)
        .Select(ToPaymentDto)
        .ToList();

    private static IList<StudentSubmissionDTO> StudentSubmissions(StudentApplication application) =>
      application.Submissions
        .OrderByDescending(submission => submission.SubmittedAt)
        .Select(ToSubmissionDto)
        .ToList();

    private static StudentSubmissionDTO ToSubmissionDto(StudentSubmission submission) => new()
    {
      Id = submission.Id,
      StudentApplicationId = submission.StudentApplicationId,
      DocumentType = submission.DocumentType,
      StudentNote = submission.StudentNote,
      OriginalFileName = submission.OriginalFileName,
      SizeBytes = submission.SizeBytes,
      ReviewStatus = submission.ReviewStatus,
      SubmittedAt = submission.SubmittedAt,
      ReviewedByName = submission.ReviewedByName,
      ReviewedAt = submission.ReviewedAt,
      ReviewNote = submission.ReviewNote,
      DownloadUrl = $"student-applications/{submission.StudentApplicationId}/submissions/{submission.Id}/file",
    };

    /// <summary>
    /// Per currency: the fees due, the confirmed payments in that currency and what is left. Fees are covered in
    /// due-date order, so the next deadline is the due date of the first fee the payments do not cover yet.
    /// </summary>
    private static IList<StudentFeeSummaryDTO> ComputeFeeSummaries(IList<StudentFeeItemDTO> feeItems, IList<StudentPaymentDTO> confirmedPayments)
    {
      var summaries = new List<StudentFeeSummaryDTO>();
      foreach (var group in feeItems.GroupBy(item => item.CurrencyCode.ToUpperInvariant()))
      {
        var paid = confirmedPayments
          .Where(payment => payment.CurrencyCode.ToUpperInvariant() == group.Key)
          .Sum(payment => payment.Amount);
        var totalDue = group.Sum(item => item.Amount);
        var remaining = Math.Max(0, totalDue - paid);
        DateTime? nextDueDate = null;
        decimal? nextDueAmount = null;
        if (remaining > 0)
        {
          decimal covered = 0;
          foreach (var item in group.OrderBy(item => item.DueDate ?? DateTime.MaxValue))
          {
            covered += item.Amount;
            if (covered <= paid) continue;
            if (item.DueDate.HasValue)
            {
              nextDueDate = item.DueDate;
              nextDueAmount = covered - paid;
            }
            break;
          }
        }

        summaries.Add(new StudentFeeSummaryDTO
        {
          CurrencyCode = group.Key,
          TotalDue = totalDue,
          Paid = paid,
          Remaining = remaining,
          NextDueDate = nextDueDate,
          NextDueAmount = nextDueAmount,
        });
      }
      return summaries;
    }

    /// <summary>
    /// The fee items that confirmed payments do not cover yet, with the uncovered part. Payments in a currency
    /// cover that currency's fees in due-date order, as in <see cref="ComputeFeeSummaries"/>.
    /// </summary>
    internal static IList<UnpaidFeeItem> UnpaidFeeItems(IList<StudentFeeItemDTO> feeItems, IList<StudentPaymentDTO> confirmedPayments)
    {
      var unpaid = new List<UnpaidFeeItem>();
      foreach (var group in feeItems.GroupBy(item => item.CurrencyCode.ToUpperInvariant()))
      {
        var paidLeft = confirmedPayments
          .Where(payment => payment.CurrencyCode.ToUpperInvariant() == group.Key)
          .Sum(payment => payment.Amount);
        foreach (var item in group.OrderBy(item => item.DueDate ?? DateTime.MaxValue))
        {
          var covered = Math.Min(paidLeft, item.Amount);
          paidLeft -= covered;
          if (item.Amount - covered > 0) unpaid.Add(new UnpaidFeeItem(item, item.Amount - covered));
        }
      }
      return unpaid;
    }

    private static void ApplyUploadStatuses(IList<StudentRequestedDocumentDTO> requests, IEnumerable<StudentSubmission> submissions)
    {
      foreach (var request in requests)
      {
        var latest = submissions
          .Where(submission => submission.DocumentType == request.DocumentType)
          .OrderByDescending(submission => submission.SubmittedAt)
          .FirstOrDefault();
        request.UploadStatus = latest?.ReviewStatus switch
        {
          null => "未上传",
          AcceptedSubmissionStatus => "已收到",
          ReturnedSubmissionStatus => "需重新上传",
          _ => "待确认",
        };
      }
    }

    private static string? PrepareExtras(
      IList<StudentFeeItemDTO>? requestedFees,
      IList<StudentRequestedDocumentDTO>? requestedUploads,
      out List<StudentFeeItemDTO> feeItems,
      out List<StudentRequestedDocumentDTO> requestedDocuments)
    {
      feeItems = new List<StudentFeeItemDTO>();
      requestedDocuments = new List<StudentRequestedDocumentDTO>();

      foreach (var requested in requestedFees ?? Array.Empty<StudentFeeItemDTO>())
      {
        var name = TrimToNull(requested.Name);
        if (name == null) return "请填写费用名称，或删除空白的费用。";
        if (requested.Amount <= 0 || requested.Amount > 100_000_000) return $"「{name}」的金额必须大于 0。";
        var currency = requested.CurrencyCode?.Trim().ToUpperInvariant() ?? "";
        if (!AllowedPaymentCurrencies.Contains(currency)) return $"「{name}」的币种无效。";
        var key = TrimToNull(requested.Key) ?? Guid.NewGuid().ToString("N");
        feeItems.Add(new StudentFeeItemDTO
        {
          Key = key.Length <= 50 ? key : key[..50],
          Name = name.Length <= 100 ? name : name[..100],
          Amount = decimal.Round(requested.Amount, 2),
          CurrencyCode = currency,
          DueDate = requested.DueDate?.Date,
          Note = Limit(TrimToNull(requested.Note), 200),
        });
      }
      if (feeItems.Count > 20) return "每个档案最多登记 20 项费用。";

      var types = new HashSet<string>(StringComparer.Ordinal);
      foreach (var requested in requestedUploads ?? Array.Empty<StudentRequestedDocumentDTO>())
      {
        var documentType = TrimToNull(requested.DocumentType);
        if (documentType == null || !AllowedSubmissionTypes.Contains(documentType)) return "需要学员上传的资料类型无效。";
        if (!types.Add(documentType)) return $"「{documentType}」重复了，请只保留一条。";
        var key = TrimToNull(requested.Key) ?? Guid.NewGuid().ToString("N");
        requestedDocuments.Add(new StudentRequestedDocumentDTO
        {
          Key = key.Length <= 50 ? key : key[..50],
          DocumentType = documentType,
          Note = Limit(TrimToNull(requested.Note), 200),
        });
      }
      return null;
    }

    private async Task<PaymentFileResult> SaveSubmissionFileAsync(
      Guid applicationId,
      Guid submissionId,
      IFormFile? file,
      string? displayFileName,
      CancellationToken cancellationToken)
    {
      if (file == null || file.Length == 0 || file.Length > MaxDocumentSizeBytes)
      {
        return new PaymentFileResult("请选择文件，大小不能超过 15MB。", null, null, null, null);
      }

      var extension = Path.GetExtension(file.FileName);
      if (!AllowedSubmissionFileTypes.TryGetValue(extension, out var safeContentType))
      {
        return new PaymentFileResult("只能上传 PDF、JPG、PNG、WebP 图片或 Word（DOCX）文件。", null, null, null, null);
      }

      await using (var head = file.OpenReadStream())
      {
        if (!await HasExpectedSignatureAsync(head, extension, cancellationToken))
        {
          return new PaymentFileResult("文件内容和扩展名不一致，请重新导出后再上传。", null, null, null, null);
        }
      }

      var storedFileName = $"{submissionId:N}{extension.ToLowerInvariant()}";
      var relativePath = Path.Combine(applicationId.ToString("N"), "student-uploads", storedFileName).Replace('\\', '/');
      var targetPath = ResolvePrivateDocumentPath(relativePath);
      Directory.CreateDirectory(Path.GetDirectoryName(targetPath)!);
      await using (var stream = new FileStream(targetPath, FileMode.CreateNew, FileAccess.Write, FileShare.None))
      {
        await file.CopyToAsync(stream, cancellationToken);
      }

      // The mini program uploads a temporary copy (tmp_xxx.pdf) and sends the real name separately;
      // use that name only when it has the same extension as the file that was checked.
      var givenName = TrimToNull(Path.GetFileName(displayFileName ?? ""));
      var nameToKeep = givenName != null && string.Equals(Path.GetExtension(givenName), extension, StringComparison.OrdinalIgnoreCase)
        ? givenName
        : Path.GetFileName(file.FileName);
      var originalFileName = Limit(nameToKeep, 255) ?? storedFileName;
      return new PaymentFileResult(null, originalFileName, storedFileName, relativePath, safeContentType);
    }

    /// <summary>Checks the first bytes, so a renamed file of another kind is refused.</summary>
    private static async Task<bool> HasExpectedSignatureAsync(Stream stream, string extension, CancellationToken cancellationToken)
    {
      var head = new byte[12];
      var read = 0;
      while (read < head.Length)
      {
        var count = await stream.ReadAsync(head.AsMemory(read, head.Length - read), cancellationToken);
        if (count == 0) break;
        read += count;
      }

      bool StartsWith(params byte[] bytes) => read >= bytes.Length && bytes.Select((value, index) => head[index] == value).All(match => match);
      return extension.ToLowerInvariant() switch
      {
        ".pdf" => StartsWith(0x25, 0x50, 0x44, 0x46),
        ".png" => StartsWith(0x89, 0x50, 0x4E, 0x47),
        ".jpg" or ".jpeg" => StartsWith(0xFF, 0xD8, 0xFF),
        ".webp" => StartsWith(0x52, 0x49, 0x46, 0x46) && read >= 12 && head[8] == 0x57 && head[9] == 0x45 && head[10] == 0x42 && head[11] == 0x50,
        ".docx" => StartsWith(0x50, 0x4B, 0x03, 0x04),
        _ => false,
      };
    }

    private static string? ValidatePayment(StudentPaymentSubmissionDTO request, bool requireFile)
    {
      if (string.IsNullOrWhiteSpace(request.PayerName)) return "请填写付款人姓名。";
      if (!AllowedPaymentTypes.Contains(request.PaymentType?.Trim() ?? "")) return "付款类型无效。";
      if (request.Amount <= 0) return "付款金额必须大于 0。";
      if (!AllowedPaymentCurrencies.Contains(request.CurrencyCode?.Trim() ?? "")) return "付款币种无效。";
      if (request.PaidAt == default) return "请选择付款日期。";
      if (!AllowedPaymentMethods.Contains(request.PaymentMethod?.Trim() ?? "")) return "付款方式无效。";
      if (requireFile && request.File == null) return "请上传付款截图或银行回单。";
      return null;
    }

    private async Task<PaymentFileResult> SavePaymentFileAsync(
      Guid applicationId,
      Guid paymentId,
      IFormFile file,
      CancellationToken cancellationToken)
    {
      if (file.Length == 0 || file.Length > MaxDocumentSizeBytes)
      {
        return new PaymentFileResult("付款截图不能为空，且大小不能超过 15MB。", null, null, null, null);
      }

      var extension = Path.GetExtension(file.FileName);
      if (!AllowedPaymentFileTypes.TryGetValue(extension, out var safeContentType))
      {
        return new PaymentFileResult("付款凭证仅支持 PDF、PNG、JPG 和 WebP 文件。", null, null, null, null);
      }

      var storedFileName = $"{Guid.NewGuid():N}{extension.ToLowerInvariant()}";
      var relativePath = Path.Combine(applicationId.ToString("N"), "payments", paymentId.ToString("N"), storedFileName)
        .Replace('\\', '/');
      var targetPath = ResolvePrivateDocumentPath(relativePath);
      Directory.CreateDirectory(Path.GetDirectoryName(targetPath)!);
      await using var stream = new FileStream(targetPath, FileMode.CreateNew, FileAccess.Write, FileShare.None);
      await file.CopyToAsync(stream, cancellationToken);
      return new PaymentFileResult(null, Path.GetFileName(file.FileName), storedFileName, relativePath, safeContentType);
    }

    private void DeletePrivateFile(string relativePath)
    {
      var path = ResolvePrivateDocumentPath(relativePath);
      if (System.IO.File.Exists(path)) System.IO.File.Delete(path);
    }

    private sealed record PaymentFileResult(
      string? Error,
      string? OriginalFileName,
      string? StoredFileName,
      string? RelativePath,
      string? ContentType);

    private static string? PrepareStructure(
      string? requestedEnrollmentType,
      IList<StudentApplicationMemberDTO>? requestedMembers,
      IList<StudentApplicationPlanDTO>? requestedCoursePlans,
      IList<StudentApplicationPlanDTO>? requestedAccommodationPlans,
      out string enrollmentType,
      out List<StudentApplicationMemberDTO> members,
      out List<StudentApplicationPlanDTO> coursePlans,
      out List<StudentApplicationPlanDTO> accommodationPlans)
    {
      enrollmentType = string.IsNullOrWhiteSpace(requestedEnrollmentType) ? "单人报名" : requestedEnrollmentType.Trim();
      members = new List<StudentApplicationMemberDTO>();
      coursePlans = new List<StudentApplicationPlanDTO>();
      accommodationPlans = new List<StudentApplicationPlanDTO>();
      if (!AllowedEnrollmentTypes.Contains(enrollmentType)) return "报名类型无效。";

      var memberKeys = new HashSet<string>(StringComparer.OrdinalIgnoreCase) { "primary" };
      foreach (var requested in requestedMembers ?? Array.Empty<StudentApplicationMemberDTO>())
      {
        var name = TrimToNull(requested.Name);
        if (name == null) return "请填写同行人姓名，或删除空白同行人。";
        var key = TrimToNull(requested.Key) ?? Guid.NewGuid().ToString("N");
        if (key.Length > 50) key = key[..50];
        if (!memberKeys.Add(key)) return "同行人编号重复，请重新添加该成员。";
        members.Add(new StudentApplicationMemberDTO
        {
          Key = key,
          Name = name.Length <= 100 ? name : name[..100],
          Relationship = Limit(TrimToNull(requested.Relationship), 50),
          Email = Limit(TrimToNull(requested.Email)?.ToLowerInvariant(), 256),
          PhoneNumber = Limit(TrimToNull(requested.PhoneNumber), 32),
        });
      }
      if (members.Count > 19) return "一个报名档案最多可登记 20 人（含主联系人）。";
      if (members.Count > 0 && enrollmentType == "单人报名") enrollmentType = "多人同行";

      var courseError = NormalizePlans(requestedCoursePlans, memberKeys, "课程", coursePlans);
      if (courseError != null) return courseError;
      var accommodationError = NormalizePlans(requestedAccommodationPlans, memberKeys, "住宿", accommodationPlans);
      if (accommodationError != null) return accommodationError;
      return null;
    }

    private static string? NormalizePlans(
      IList<StudentApplicationPlanDTO>? requestedPlans,
      HashSet<string> memberKeys,
      string label,
      List<StudentApplicationPlanDTO> destination)
    {
      foreach (var requested in requestedPlans ?? Array.Empty<StudentApplicationPlanDTO>())
      {
        var name = TrimToNull(requested.Name);
        if (name == null) return $"请填写{label}名称，或删除空白的{label}记录。";
        var participantKey = TrimToNull(requested.ParticipantKey) ?? "primary";
        if (!memberKeys.Contains(participantKey)) return $"{label}记录对应的报名成员不存在。";
        if (requested.Weeks.HasValue && (requested.Weeks < 1 || requested.Weeks > 104)) return $"{label}周期须为 1–104 周。";

        var startDate = requested.StartDate?.Date;
        var endDate = requested.EndDate?.Date;
        var weeks = requested.Weeks;
        if (startDate.HasValue && weeks.HasValue) endDate = startDate.Value.AddDays(weeks.Value * 7 - 1);
        else if (startDate.HasValue && endDate.HasValue)
        {
          if (endDate < startDate) return $"{label}结束日期不能早于开始日期。";
          weeks = CalculateWeeks(startDate, endDate);
        }

        var key = TrimToNull(requested.Key) ?? Guid.NewGuid().ToString("N");
        destination.Add(new StudentApplicationPlanDTO
        {
          Key = key.Length <= 50 ? key : key[..50],
          ParticipantKey = participantKey,
          Name = name.Length <= 200 ? name : name[..200],
          StartDate = startDate,
          Weeks = weeks,
          EndDate = endDate,
        });
      }
      return destination.Count > 30 ? $"每个档案最多登记 30 段{label}。" : null;
    }

    private static string? SerializeDetails<T>(IList<T> items) =>
      items.Count == 0 ? null : JsonSerializer.Serialize(items);

    private static List<T> DeserializeDetails<T>(string? json)
    {
      if (string.IsNullOrWhiteSpace(json)) return new List<T>();
      try
      {
        return JsonSerializer.Deserialize<List<T>>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true }) ?? new List<T>();
      }
      catch (JsonException)
      {
        return new List<T>();
      }
    }

    private static string? SummarizePlanNames(IList<StudentApplicationPlanDTO> plans)
    {
      var names = plans.Select(plan => plan.Name).Where(name => !string.IsNullOrWhiteSpace(name)).Distinct().ToList();
      if (names.Count == 0) return null;
      return names.Count <= 2 ? string.Join(" / ", names) : $"{string.Join(" / ", names.Take(2))} 等 {names.Count} 段";
    }

    private static DateTime? EarliestStart(params IList<StudentApplicationPlanDTO>[] planGroups) =>
      planGroups.SelectMany(group => group).Where(plan => plan.StartDate.HasValue).Select(plan => plan.StartDate!.Value).Cast<DateTime?>().Min();

    private static DateTime? LatestEnd(params IList<StudentApplicationPlanDTO>[] planGroups) =>
      planGroups.SelectMany(group => group).Where(plan => plan.EndDate.HasValue).Select(plan => plan.EndDate!.Value).Cast<DateTime?>().Max();

    private static int? CalculateStudyWeeks(IList<StudentApplicationPlanDTO> plans, DateTime? fallbackStart, DateTime? fallbackEnd)
    {
      var perPerson = plans.Where(plan => plan.Weeks.HasValue)
        .GroupBy(plan => plan.ParticipantKey)
        .Select(group => group.Sum(plan => plan.Weeks ?? 0))
        .ToList();
      return perPerson.Count > 0 ? perPerson.Max() : CalculateWeeks(fallbackStart, fallbackEnd);
    }

    private static int? CalculateWeeks(DateTime? startDate, DateTime? endDate)
    {
      if (!startDate.HasValue || !endDate.HasValue || endDate < startDate) return null;
      return Math.Max(1, (int)Math.Ceiling((endDate.Value.Date - startDate.Value.Date).TotalDays / 7d));
    }

    private static string? Limit(string? value, int maxLength) =>
      value == null || value.Length <= maxLength ? value : value[..maxLength];

    private static string? ValidateApplication(Guid schoolId, DateTime? startDate, DateTime? endDate, string? status, string? visaStatus)
    {
      if (schoolId == Guid.Empty) return "请选择学校。";
      if (startDate.HasValue && endDate.HasValue && endDate < startDate) return "结束日期不能早于开始日期。";
      if (!AllowedStatuses.Contains(NormalizeStatus(status))) return "报名状态无效。";
      if (!AllowedVisaStatuses.Contains(NormalizeVisaStatus(visaStatus))) return "签证状态无效。";
      return null;
    }

    private static string NormalizeStatus(string? status) => string.IsNullOrWhiteSpace(status) ? "资料准备" : status.Trim();

    private static string NormalizeVisaStatus(string? status) => string.IsNullOrWhiteSpace(status) ? "未确认" : status.Trim();

    private string CurrentUserName() =>
      User.FindFirstValue(ClaimTypes.Name) ?? User.Identity?.Name ?? "员工";

    private static void MarkDraft(StudentApplication application)
    {
      application.ReviewStatus = DraftReviewStatus;
      application.ChangeSummary = null;
      application.SubmittedByUserId = null;
      application.SubmittedByName = null;
      application.SubmittedAt = null;
    }

    private static void EnsurePublishedSnapshot(StudentApplication application)
    {
      if (application.ReviewStatus == PublishedReviewStatus && string.IsNullOrWhiteSpace(application.PublishedSnapshotJson))
      {
        application.PublishedSnapshotJson = CreatePublishedSnapshot(application, application.PublishedAt ?? application.LastUpdated);
      }
    }

    private static string CreatePublishedSnapshot(StudentApplication application, DateTime publishedAt)
    {
      var snapshot = ToDto(application, includeInternalNotes: false);
      // Payments, uploads and the fee totals are live data, added again on every read (StudentView).
      snapshot.Payments = new List<StudentPaymentDTO>();
      snapshot.Submissions = new List<StudentSubmissionDTO>();
      snapshot.FeeSummaries = new List<StudentFeeSummaryDTO>();
      foreach (var request in snapshot.RequestedDocuments) request.UploadStatus = null;
      snapshot.ReviewStatus = PublishedReviewStatus;
      snapshot.ChangeSummary = null;
      snapshot.SubmittedByName = null;
      snapshot.SubmittedAt = null;
      snapshot.PublishedByName = application.PublishedByName;
      snapshot.PublishedAt = publishedAt;
      snapshot.LastUpdated = publishedAt;
      return JsonSerializer.Serialize(snapshot);
    }

    private static bool IsDocumentPublishedToStudent(
      StudentApplication application,
      StudentApplicationDocument document)
    {
      if (string.IsNullOrWhiteSpace(application.PublishedSnapshotJson))
      {
        return application.ReviewStatus == PublishedReviewStatus &&
          document.IsVisibleToStudent && !document.IsPendingDeletion;
      }

      var snapshot = JsonSerializer.Deserialize<StudentApplicationDTO>(
        application.PublishedSnapshotJson,
        new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
      return snapshot?.Documents.Any(item => item.Id == document.Id && item.IsVisibleToStudent) == true;
    }
    private static string? TrimToNull(string? value)
    {
      var trimmed = value?.Trim();
      return string.IsNullOrWhiteSpace(trimmed) ? null : trimmed;
    }
  }
}

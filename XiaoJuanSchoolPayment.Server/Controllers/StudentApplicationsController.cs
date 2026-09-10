using System.Security.Claims;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using XiaoJuanSchoolPayment.Server.Data;
using XiaoJuanSchoolPayment.Server.Data.DTO;
using XiaoJuanSchoolPayment.Server.Data.Models;
using XiaoJuanSchoolPayment.Server.Interface;

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

    private readonly AppDbContext _context;
    private readonly UserManager<SchoolUser> _userManager;
    private readonly IWebHostEnvironment _environment;
    private readonly IConfiguration _configuration;
    private readonly IStaffPermissionService _permissions;

    public StudentApplicationsController(
      AppDbContext context,
      UserManager<SchoolUser> userManager,
      IWebHostEnvironment environment,
      IConfiguration configuration,
      IStaffPermissionService permissions)
    {
      _context = context;
      _userManager = userManager;
      _environment = environment;
      _configuration = configuration;
      _permissions = permissions;
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

      var visibleApplications = new List<StudentApplicationDTO>();
      foreach (var application in applications)
      {
        if (!string.IsNullOrWhiteSpace(application.PublishedSnapshotJson))
        {
          var snapshot = JsonSerializer.Deserialize<StudentApplicationDTO>(
            application.PublishedSnapshotJson,
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
          if (snapshot != null)
          {
            snapshot.Payments = ConfirmedPayments(application);
            visibleApplications.Add(snapshot);
          }
        }
        else if (application.ReviewStatus == PublishedReviewStatus)
        {
          visibleApplications.Add(ToDto(application, includeInternalNotes: false));
        }
      }

      return Ok(visibleApplications);
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
      return Ok(ToPaymentDto(payment));
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
      .Include(x => x.StudentUser).Include(x => x.School).Include(x => x.Documents).Include(x => x.Payments).AsSplitQuery();

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

      return new StudentApplicationDTO
      {
        Id = application.Id,
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
      snapshot.Payments = new List<StudentPaymentDTO>();
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

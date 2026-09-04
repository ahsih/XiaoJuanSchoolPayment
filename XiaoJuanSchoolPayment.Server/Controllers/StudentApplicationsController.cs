using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using XiaoJuanSchoolPayment.Server.Data;
using XiaoJuanSchoolPayment.Server.Data.DTO;
using XiaoJuanSchoolPayment.Server.Data.Models;

namespace XiaoJuanSchoolPayment.Server.Controllers
{
  [ApiController]
  [Authorize]
  [Route("student-applications")]
  public class StudentApplicationsController : ControllerBase
  {
    private const long MaxDocumentSizeBytes = 15 * 1024 * 1024;
    private static readonly HashSet<string> AllowedStatuses = new(StringComparer.OrdinalIgnoreCase)
    {
      "资料准备", "已提交学校", "等待学校审核", "已收到录取通知书", "签证办理中", "行前准备", "已入学", "已完成", "已取消",
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
      "报价单", "入学通知书", "账单", "付款凭证", "签证文件", "其他",
    };

    private readonly AppDbContext _context;
    private readonly UserManager<SchoolUser> _userManager;
    private readonly IWebHostEnvironment _environment;
    private readonly IConfiguration _configuration;

    public StudentApplicationsController(
      AppDbContext context,
      UserManager<SchoolUser> userManager,
      IWebHostEnvironment environment,
      IConfiguration configuration)
    {
      _context = context;
      _userManager = userManager;
      _environment = environment;
      _configuration = configuration;
    }

    [Authorize(Roles = "Admin")]
    [HttpGet]
    public async Task<ActionResult<IList<StudentApplicationDTO>>> GetAll([FromQuery] string? search, CancellationToken cancellationToken)
    {
      var query = BaseQuery();
      if (!string.IsNullOrWhiteSpace(search))
      {
        var keyword = search.Trim().ToLower();
        query = query.Where(x =>
          (x.StudentUser != null &&
            ((x.StudentUser.Email ?? "").ToLower().Contains(keyword) ||
             (x.StudentUser.FirstName + " " + x.StudentUser.LastName).ToLower().Contains(keyword))) ||
          (x.School != null && x.School.Name.ToLower().Contains(keyword)));
      }

      var applications = await query.OrderByDescending(x => x.LastUpdated).ToListAsync(cancellationToken);
      return Ok(applications.Select(x => ToDto(x, includeInternalNotes: true)).ToList());
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

      return Ok(applications.Select(x => ToDto(x, includeInternalNotes: false)).ToList());
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<StudentApplicationDTO>> Create([FromBody] CreateStudentApplicationDTO request, CancellationToken cancellationToken)
    {
      var validationError = ValidateApplication(request.SchoolId, request.StartDate, request.EndDate, request.Status);
      if (validationError != null) return BadRequest(validationError);
      if (!await _context.Schools.AnyAsync(x => x.Id == request.SchoolId, cancellationToken)) return BadRequest("所选学校不存在。");

      var email = request.Email.Trim();
      var student = await _userManager.FindByEmailAsync(email);
      await using var transaction = await _context.Database.BeginTransactionAsync(cancellationToken);
      if (student == null)
      {
        if (string.IsNullOrWhiteSpace(request.TemporaryPassword)) return BadRequest("新学生必须设置临时密码。");

        student = new SchoolUser
        {
          Email = email,
          UserName = email,
          FirstName = request.FirstName.Trim(),
          LastName = request.LastName.Trim(),
          EmailConfirmed = true,
        };

        var createResult = await _userManager.CreateAsync(student, request.TemporaryPassword);
        if (!createResult.Succeeded) return BadRequest(createResult.Errors.Select(x => x.Description));
        var roleResult = await _userManager.AddToRoleAsync(student, "Student");
        if (!roleResult.Succeeded)
        {
          return BadRequest(roleResult.Errors.Select(x => x.Description));
        }
      }
      else if (!await _userManager.IsInRoleAsync(student, "Student"))
      {
        return BadRequest("该邮箱已属于员工账号，不能创建为学生账号。");
      }

      var now = DateTime.UtcNow;
      var application = new StudentApplication
      {
        Id = Guid.NewGuid(),
        StudentUserId = student.Id,
        SchoolId = request.SchoolId,
        CourseName = TrimToNull(request.CourseName),
        AccommodationName = TrimToNull(request.AccommodationName),
        StartDate = request.StartDate,
        EndDate = request.EndDate,
        Status = NormalizeStatus(request.Status),
        StudentVisibleNotes = TrimToNull(request.StudentVisibleNotes),
        InternalNotes = TrimToNull(request.InternalNotes),
        CreatedAt = now,
        LastUpdated = now,
      };

      _context.StudentApplications.Add(application);
      await _context.SaveChangesAsync(cancellationToken);
      await transaction.CommitAsync(cancellationToken);

      application.StudentUser = student;
      application.School = await _context.Schools.AsNoTracking().FirstAsync(x => x.Id == application.SchoolId, cancellationToken);
      return CreatedAtAction(nameof(GetAll), ToDto(application, includeInternalNotes: true));
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id:guid}")]
    public async Task<ActionResult<StudentApplicationDTO>> Update(Guid id, [FromBody] UpdateStudentApplicationDTO request, CancellationToken cancellationToken)
    {
      var validationError = ValidateApplication(request.SchoolId, request.StartDate, request.EndDate, request.Status);
      if (validationError != null) return BadRequest(validationError);

      var application = await BaseQuery().FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
      if (application == null) return NotFound();
      if (!await _context.Schools.AnyAsync(x => x.Id == request.SchoolId, cancellationToken)) return BadRequest("所选学校不存在。");

      application.SchoolId = request.SchoolId;
      application.CourseName = TrimToNull(request.CourseName);
      application.AccommodationName = TrimToNull(request.AccommodationName);
      application.StartDate = request.StartDate;
      application.EndDate = request.EndDate;
      application.Status = NormalizeStatus(request.Status);
      application.StudentVisibleNotes = TrimToNull(request.StudentVisibleNotes);
      application.InternalNotes = TrimToNull(request.InternalNotes);
      application.LastUpdated = DateTime.UtcNow;

      await _context.SaveChangesAsync(cancellationToken);
      application.School = await _context.Schools.AsNoTracking().FirstAsync(x => x.Id == application.SchoolId, cancellationToken);
      return Ok(ToDto(application, includeInternalNotes: true));
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("{id:guid}/documents")]
    [RequestSizeLimit(MaxDocumentSizeBytes + 1024 * 1024)]
    public async Task<ActionResult<StudentApplicationDocumentDTO>> UploadDocument(Guid id, [FromForm] StudentDocumentUploadDTO request, CancellationToken cancellationToken)
    {
      var application = await _context.StudentApplications.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
      if (application == null) return NotFound();
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
        _context.StudentApplicationDocuments.Add(document);
        application.LastUpdated = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);
      }
      catch
      {
        System.IO.File.Delete(targetPath);
        throw;
      }

      return Ok(ToDocumentDto(document));
    }

    [HttpGet("{applicationId:guid}/documents/{documentId:guid}")]
    public async Task<IActionResult> DownloadDocument(Guid applicationId, Guid documentId, CancellationToken cancellationToken)
    {
      var document = await _context.StudentApplicationDocuments.AsNoTracking().Include(x => x.StudentApplication)
        .FirstOrDefaultAsync(x => x.Id == documentId && x.StudentApplicationId == applicationId, cancellationToken);
      if (document?.StudentApplication == null) return NotFound();

      if (!User.IsInRole("Admin"))
      {
        var userId = await GetCurrentUserIdAsync();
        if (!User.IsInRole("Student") || userId != document.StudentApplication.StudentUserId || !document.IsVisibleToStudent) return Forbid();
      }

      var path = ResolvePrivateDocumentPath(document.FilePath);
      if (!System.IO.File.Exists(path)) return NotFound();
      return PhysicalFile(path, document.ContentType, document.OriginalFileName, enableRangeProcessing: true);
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{applicationId:guid}/documents/{documentId:guid}")]
    public async Task<IActionResult> DeleteDocument(Guid applicationId, Guid documentId, CancellationToken cancellationToken)
    {
      var document = await _context.StudentApplicationDocuments
        .FirstOrDefaultAsync(x => x.Id == documentId && x.StudentApplicationId == applicationId, cancellationToken);
      if (document == null) return NotFound();

      var path = ResolvePrivateDocumentPath(document.FilePath);
      _context.StudentApplicationDocuments.Remove(document);
      await _context.SaveChangesAsync(cancellationToken);
      if (System.IO.File.Exists(path)) System.IO.File.Delete(path);
      return NoContent();
    }

    private IQueryable<StudentApplication> BaseQuery() => _context.StudentApplications
      .Include(x => x.StudentUser).Include(x => x.School).Include(x => x.Documents).AsSplitQuery();

    private async Task<string?> GetCurrentUserIdAsync()
    {
      var id = User.FindFirstValue(ClaimTypes.NameIdentifier);
      if (!string.IsNullOrWhiteSpace(id)) return id;
      var email = User.FindFirstValue(ClaimTypes.Email);
      return string.IsNullOrWhiteSpace(email) ? null : (await _userManager.FindByEmailAsync(email))?.Id;
    }

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

    private static StudentApplicationDTO ToDto(StudentApplication application, bool includeInternalNotes) => new()
    {
      Id = application.Id,
      StudentFirstName = application.StudentUser?.FirstName ?? "",
      StudentLastName = application.StudentUser?.LastName ?? "",
      StudentName = $"{application.StudentUser?.FirstName} {application.StudentUser?.LastName}".Trim(),
      StudentEmail = application.StudentUser?.Email ?? "",
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
      Documents = application.Documents.Where(x => includeInternalNotes || x.IsVisibleToStudent)
        .OrderByDescending(x => x.UploadedAt).Select(ToDocumentDto).ToList(),
    };

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

    private static string? ValidateApplication(Guid schoolId, DateTime? startDate, DateTime? endDate, string? status)
    {
      if (schoolId == Guid.Empty) return "请选择学校。";
      if (startDate.HasValue && endDate.HasValue && endDate < startDate) return "结束日期不能早于开始日期。";
      if (!AllowedStatuses.Contains(NormalizeStatus(status))) return "报名状态无效。";
      return null;
    }

    private static string NormalizeStatus(string? status) => string.IsNullOrWhiteSpace(status) ? "资料准备" : status.Trim();
    private static string? TrimToNull(string? value)
    {
      var trimmed = value?.Trim();
      return string.IsNullOrWhiteSpace(trimmed) ? null : trimmed;
    }
  }
}

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using XiaoJuanSchoolPayment.Server.Data;
using XiaoJuanSchoolPayment.Server.Data.DTO;
using XiaoJuanSchoolPayment.Server.Data.Filter;
using XiaoJuanSchoolPayment.Server.Interface;

namespace XiaoJuanSchoolPayment.Server.Controllers
{
  [ApiController]
  [Route("school")]
  public class SchoolController : ControllerBase
  {
    private readonly ISchoolService _schoolService;
    private readonly IStaffPermissionService _permissions;
    private readonly ISchoolMediaStorage _mediaStorage;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly AppDbContext _context;
    public SchoolController(
      ISchoolService schoolService,
      IStaffPermissionService permissions,
      ISchoolMediaStorage mediaStorage,
      IHttpClientFactory httpClientFactory,
      AppDbContext context) {
      _schoolService = schoolService;
      _permissions = permissions;
      _mediaStorage = mediaStorage;
      _httpClientFactory = httpClientFactory;
      _context = context;
    }
    [Authorize(Roles = "Admin,Manager")]
    [HttpPut("save")]
    public async Task<IActionResult> SaveSchool([FromBody]SchoolDTO school, CancellationToken ct)
    {
      if (!await _permissions.HasAsync(User, school.Id, StaffPermissionScopes.SchoolContent, ct)) return Forbid();
      var result = await _schoolService.SaveSchool(school,ct);
      return Ok(result);
    }

    [Authorize(Roles = "Admin,Manager")]
    [HttpPut("save-lesson")]
    public async Task<IActionResult> SaveSchoolLesson([FromBody] SchoolLessonDTO lesson, CancellationToken ct)
    {
      if (!await _permissions.HasAsync(User, lesson.SchoolId, StaffPermissionScopes.Pricing, ct)) return Forbid();
      var result = await _schoolService.SaveSchoolLesson(lesson, ct);
      return Ok(result);
    }

    [Authorize(Roles = "Admin,Manager")]
    [HttpPut("save-room")]
    public async Task<IActionResult> SaveSchoolRoom([FromBody] SchoolRoomDTO lesson, CancellationToken ct)
    {
      if (!await _permissions.HasAsync(User, lesson.SchoolId, StaffPermissionScopes.Pricing, ct)) return Forbid();
      var result = await _schoolService.SaveSchoolRoom(lesson, ct);
      return Ok(result);
    }

    [Authorize(Roles = "Admin,Manager")]
    [HttpPut("save-school-fee")]
    public async Task<IActionResult> SaveSchoolFee([FromBody] SchoolFeeDTO feeDTO, CancellationToken ct)
    {
      if (!await _permissions.HasAsync(User, feeDTO.SchoolId, StaffPermissionScopes.Pricing, ct)) return Forbid();
      var result = await _schoolService.SaveSchoolFee(feeDTO, ct);
      return Ok(result);
    }

    [Authorize(Roles = "Admin,Manager")]
    [HttpPut("save-school-note")]
    public async Task<IActionResult> SaveSchoolNote([FromBody] SchoolNoteDTO noteDto, CancellationToken ct)
    {
      if (!await _permissions.HasAsync(User, noteDto.SchoolId, StaffPermissionScopes.SchoolContent, ct)) return Forbid();
      var result = await _schoolService.SaveSchoolNote(noteDto, ct);
      return Ok(result);
    }

    [Authorize(Roles = "Admin,Manager,Staff")]
    [HttpPost("upload-photo")]
    [HttpPost("upload-media")]
    [RequestSizeLimit(512L * 1024 * 1024)]
    [RequestFormLimits(MultipartBodyLengthLimit = 512L * 1024 * 1024)]
    public async Task<IActionResult> UploadSchoolPhoto([FromForm] SchoolPhotoUploadDTO photo, CancellationToken ct)
    {
      if (!await _permissions.HasAsync(User, photo.SchoolId, StaffPermissionScopes.Media, ct)) return Forbid();
      try
      {
        var result = await _schoolService.UploadSchoolPhoto(photo, ct);
        if (_mediaStorage.Enabled && !result.IsActive)
        {
          result.Url = _mediaStorage.CreatePreviewUrl(result.Id);
        }
        return Ok(result);
      }
      catch (ArgumentException ex)
      {
        return BadRequest(ex.Message);
      }
    }

    [Authorize(Roles = "Admin,Manager")]
    [HttpPut("save-photo")]
    public async Task<IActionResult> SaveSchoolPhoto([FromBody] SchoolPhotoDTO photo, CancellationToken ct)
    {
      if (!await _permissions.HasAsync(User, photo.SchoolId, StaffPermissionScopes.Media, ct)) return Forbid();
      var result = await _schoolService.SaveSchoolPhoto(photo, ct);
      return result ? Ok(result) : NotFound();
    }

    [Authorize(Roles = "Admin,Manager")]
    [HttpDelete("delete-photo/{id:guid}")]
    public async Task<IActionResult> DeleteSchoolPhoto(Guid id, CancellationToken ct)
    {
      var schoolId = await _context.SchoolPhotos.AsNoTracking()
        .Where(photo => photo.Id == id)
        .Select(photo => (Guid?)photo.SchoolId)
        .FirstOrDefaultAsync(ct);
      if (!schoolId.HasValue) return NotFound();
      if (!await _permissions.HasAsync(User, schoolId.Value, StaffPermissionScopes.Media, ct)) return Forbid();
      var result = await _schoolService.DeleteSchoolPhoto(id, ct);
      return result ? Ok(result) : NotFound();
    }

    [AllowAnonymous]
    [HttpGet("media-file/{id:guid}")]
    [HttpHead("media-file/{id:guid}")]
    public async Task<IActionResult> GetSchoolMediaFile(
      Guid id,
      [FromQuery] long? previewExpires,
      [FromQuery] string? previewSignature,
      CancellationToken ct)
    {
      var photo = await _context.SchoolPhotos.AsNoTracking()
        .Where(item => item.Id == id)
        .Select(item => new
        {
          item.FilePath,
          item.ContentType,
          item.IsActive,
        })
        .FirstOrDefaultAsync(ct);
      if (photo == null || !_mediaStorage.Enabled || !_mediaStorage.IsCosObjectKey(photo.FilePath))
      {
        return NotFound();
      }

      var hasValidPreviewToken = previewExpires.HasValue &&
        !string.IsNullOrWhiteSpace(previewSignature) &&
        _mediaStorage.IsValidPreviewToken(id, previewExpires.Value, previewSignature);
      if (!photo.IsActive && !hasValidPreviewToken)
      {
        return NotFound();
      }

      var method = HttpMethods.IsHead(Request.Method) ? HttpMethod.Head : HttpMethod.Get;
      var signedUrl = _mediaStorage.CreateSignedReadUrl(photo.FilePath, method.Method);
      // Draft media always stays behind our no-store proxy. Redirect delivery is
      // reserved for published objects so a browser/CDN cannot retain a draft.
      if (_mediaStorage.UsesRedirectDelivery && photo.IsActive)
      {
        return Redirect(signedUrl);
      }

      using var cosRequest = new HttpRequestMessage(method, signedUrl);
      CopyRequestHeader("Range");
      CopyRequestHeader("If-None-Match");
      CopyRequestHeader("If-Modified-Since");

      var client = _httpClientFactory.CreateClient("TencentCosMedia");
      using var cosResponse = await client.SendAsync(
        cosRequest,
        HttpCompletionOption.ResponseHeadersRead,
        ct);

      Response.StatusCode = (int)cosResponse.StatusCode;
      Response.ContentType = cosResponse.Content.Headers.ContentType?.ToString() ?? photo.ContentType;
      Response.ContentLength = cosResponse.Content.Headers.ContentLength;
      CopyResponseHeader("Content-Range");
      CopyResponseHeader("Accept-Ranges");
      CopyResponseHeader("ETag");
      CopyResponseHeader("Last-Modified");
      Response.Headers.CacheControl = photo.IsActive
        ? "public, max-age=300"
        : "private, no-store";

      if (!HttpMethods.IsHead(Request.Method))
      {
        await cosResponse.Content.CopyToAsync(Response.Body, ct);
      }
      return new EmptyResult();

      void CopyRequestHeader(string name)
      {
        if (Request.Headers.TryGetValue(name, out var values))
        {
          cosRequest.Headers.TryAddWithoutValidation(name, values.ToString());
        }
      }

      void CopyResponseHeader(string name)
      {
        if (cosResponse.Headers.TryGetValues(name, out var values) ||
            cosResponse.Content.Headers.TryGetValues(name, out values))
        {
          Response.Headers[name] = values.ToArray();
        }
      }
    }

    [HttpGet("get-schools")]
    public async Task<IActionResult> GetSchools([FromQuery]SchoolFilter filter,CancellationToken ct) { 
      var result = await _schoolService.GetSchools(filter,ct);
      return Ok(result);
    }

    [HttpGet("get-school-lessons")]
    public async Task<IActionResult> GetSchoolLessons([FromQuery] LessonFilter filter, CancellationToken ct)
    {
      var result = await _schoolService.GetSchoolLessons(filter,ct);
      return Ok(result);
    }

    [HttpGet("get-school-rooms")]
    public async Task<IActionResult> GetSchoolRooms([FromQuery] SchoolRoomFilter filter,CancellationToken ct)
    {
      var result = await _schoolService.GetSchoolRooms(filter,ct);
      return Ok(result);
    }

    [HttpGet("get-school-fees")]
    public async Task<IActionResult> GetSchoolFees([FromQuery] SchoolFeeFilter filter,CancellationToken ct)
    {
      var result = await _schoolService.GetSchoolFees(filter,ct);
      return Ok(result);
    }

    [HttpGet("get-school-notes")]
    public async Task<IActionResult> GetSchoolNotes([FromQuery] SchoolNoteFilter filter,CancellationToken ct)
    {
      var result = await _schoolService.GetSchoolNotes(filter,ct);
      return Ok(result);
    }

    [HttpGet("get-school-photos")]
    public async Task<IActionResult> GetSchoolPhotos([FromQuery] SchoolPhotoFilter filter, CancellationToken ct)
    {
      var isEmployee = User.Identity?.IsAuthenticated == true &&
        (User.IsInRole("Admin") || User.IsInRole("Manager") || User.IsInRole("Staff"));
      if (!isEmployee)
      {
        filter.IsActive = true;
      }
      var result = await _schoolService.GetSchoolPhotos(filter, ct);
      if (isEmployee && _mediaStorage.Enabled)
      {
        foreach (var photo in result.Where(item => !item.IsActive))
        {
          photo.Url = _mediaStorage.CreatePreviewUrl(photo.Id);
        }
      }
      return Ok(result);
    }
  }
}

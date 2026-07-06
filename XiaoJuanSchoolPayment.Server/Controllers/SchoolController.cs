using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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
    public SchoolController(ISchoolService schoolService) { 
      _schoolService = schoolService;
    }
    [Authorize(Roles = "Admin")]
    [HttpPut("save")]
    public async Task<IActionResult> SaveSchool([FromBody]SchoolDTO school, CancellationToken ct)
    {
      var result = await _schoolService.SaveSchool(school,ct);
      return Ok(result);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("save-lesson")]
    public async Task<IActionResult> SaveSchoolLesson([FromBody] SchoolLessonDTO lesson, CancellationToken ct)
    {
      var result = await _schoolService.SaveSchoolLesson(lesson, ct);
      return Ok(result);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("save-room")]
    public async Task<IActionResult> SaveSchoolRoom([FromBody] SchoolRoomDTO lesson, CancellationToken ct)
    {
      var result = await _schoolService.SaveSchoolRoom(lesson, ct);
      return Ok(result);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("save-school-fee")]
    public async Task<IActionResult> SaveSchoolFee([FromBody] SchoolFeeDTO feeDTO, CancellationToken ct)
    {
      var result = await _schoolService.SaveSchoolFee(feeDTO, ct);
      return Ok(result);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("save-school-note")]
    public async Task<IActionResult> SaveSchoolNote([FromBody] SchoolNoteDTO noteDto, CancellationToken ct)
    {
      var result = await _schoolService.SaveSchoolNote(noteDto, ct);
      return Ok(result);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("upload-photo")]
    [RequestSizeLimit(12 * 1024 * 1024)]
    public async Task<IActionResult> UploadSchoolPhoto([FromForm] SchoolPhotoUploadDTO photo, CancellationToken ct)
    {
      try
      {
        var result = await _schoolService.UploadSchoolPhoto(photo, ct);
        return Ok(result);
      }
      catch (ArgumentException ex)
      {
        return BadRequest(ex.Message);
      }
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("save-photo")]
    public async Task<IActionResult> SaveSchoolPhoto([FromBody] SchoolPhotoDTO photo, CancellationToken ct)
    {
      var result = await _schoolService.SaveSchoolPhoto(photo, ct);
      return result ? Ok(result) : NotFound();
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("delete-photo/{id:guid}")]
    public async Task<IActionResult> DeleteSchoolPhoto(Guid id, CancellationToken ct)
    {
      var result = await _schoolService.DeleteSchoolPhoto(id, ct);
      return result ? Ok(result) : NotFound();
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
      var result = await _schoolService.GetSchoolPhotos(filter, ct);
      return Ok(result);
    }
  }
}

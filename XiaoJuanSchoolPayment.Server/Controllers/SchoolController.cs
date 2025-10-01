using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using XiaoJuanSchoolPayment.Server.Data.DTO;
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
    [HttpGet("get-schools")]
    public async Task<IActionResult> GetSchools(CancellationToken ct) { 
      var result = await _schoolService.GetSchools(ct);
      return Ok(result);
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("get-school-lessons")]
    public async Task<IActionResult> GetSchoolLessons(CancellationToken ct)
    {
      var result = await _schoolService.GetSchoolLessons(ct);
      return Ok(result);
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("get-school-rooms")]
    public async Task<IActionResult> GetSchoolRooms(CancellationToken ct)
    {
      var result = await _schoolService.GetSchoolRooms(ct);
      return Ok(result);
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("get-school-fees")]
    public async Task<IActionResult> GetSchoolFees(CancellationToken ct)
    {
      var result = await _schoolService.GetSchoolFees(ct);
      return Ok(result);
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("get-school-notes")]
    public async Task<IActionResult> GetSchoolNotes(CancellationToken ct)
    {
      var result = await _schoolService.GetSchoolNotes(ct);
      return Ok(result);
    }
  }
}

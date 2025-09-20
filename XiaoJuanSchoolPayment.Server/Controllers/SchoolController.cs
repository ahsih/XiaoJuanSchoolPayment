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
  }
}

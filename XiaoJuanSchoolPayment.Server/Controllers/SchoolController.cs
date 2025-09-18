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
    [Authorize(Roles = "test")]
    [HttpPut("save")]
    public IActionResult SaveSchool([FromBody]SchoolDTO school, CancellationToken ct)
    {
      var result = _schoolService.SaveSchool(school,ct);
      return Ok(result);
    }
  }
}

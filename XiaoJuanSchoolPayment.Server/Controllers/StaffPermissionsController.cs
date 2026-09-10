using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using XiaoJuanSchoolPayment.Server.Data.DTO;
using XiaoJuanSchoolPayment.Server.Interface;

namespace XiaoJuanSchoolPayment.Server.Controllers
{
  [ApiController]
  [Route("staff-permissions")]
  public class StaffPermissionsController : ControllerBase
  {
    private readonly IStaffPermissionService _permissions;
    public StaffPermissionsController(IStaffPermissionService permissions) { _permissions = permissions; }

    [Authorize(Roles = "Admin")]
    [HttpGet]
    public async Task<ActionResult<IList<StaffPermissionUserDTO>>> GetAll(CancellationToken cancellationToken) =>
      Ok(await _permissions.GetStaffAsync(cancellationToken));

    [Authorize(Roles = "Admin,Manager,Staff")]
    [HttpGet("me")]
    public async Task<ActionResult<StaffPermissionUserDTO>> GetMine(CancellationToken cancellationToken)
    {
      var result = await _permissions.GetMineAsync(User, cancellationToken);
      return result == null ? Unauthorized() : Ok(result);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{userId}")]
    public async Task<ActionResult<StaffPermissionUserDTO>> Update(string userId, UpdateStaffPermissionsDTO request, CancellationToken cancellationToken)
    {
      var result = await _permissions.UpdateAsync(userId, request.Schools, cancellationToken);
      return result == null ? NotFound("没有找到该员工账号。") : Ok(result);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{userId}/employee-type")]
    public async Task<ActionResult<StaffPermissionUserDTO>> UpdateEmployeeType(
      string userId,
      UpdateEmployeeTypeDTO request,
      CancellationToken cancellationToken)
    {
      try
      {
        var result = await _permissions.UpdateEmployeeTypeAsync(userId, request.EmployeeType, cancellationToken);
        return result == null ? NotFound("没有找到该员工账号。") : Ok(result);
      }
      catch (ArgumentException ex)
      {
        return BadRequest(ex.Message);
      }
    }
  }
}

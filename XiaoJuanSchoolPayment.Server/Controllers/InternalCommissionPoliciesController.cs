using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using XiaoJuanSchoolPayment.Server.Data;
using XiaoJuanSchoolPayment.Server.Data.DTO;

namespace XiaoJuanSchoolPayment.Server.Controllers
{
  [ApiController]
  [Authorize(Roles = "Admin,Manager")]
  [ResponseCache(NoStore = true, Location = ResponseCacheLocation.None)]
  [Route("internal-commission-policies")]
  public class InternalCommissionPoliciesController : ControllerBase
  {
    private readonly AppDbContext _context;

    public InternalCommissionPoliciesController(AppDbContext context) { _context = context; }

    [HttpGet]
    public async Task<ActionResult<IList<SchoolCommissionPolicyDTO>>> GetAll(CancellationToken cancellationToken)
    {
      var policies = await _context.SchoolCommissionPolicies
        .AsNoTracking()
        .Include(x => x.School)
        .Include(x => x.RoomBases)
        .OrderBy(x => x.School!.Name)
        .ThenByDescending(x => x.EffectiveRegistrationDate)
        .ToListAsync(cancellationToken);

      return Ok(policies.Select(policy => new SchoolCommissionPolicyDTO
      {
        Id = policy.Id,
        SchoolId = policy.SchoolId,
        SchoolName = policy.School?.Name ?? string.Empty,
        PolicyCode = policy.PolicyCode,
        Title = policy.Title,
        EffectiveRegistrationDate = policy.EffectiveRegistrationDate,
        NewStudentsOnly = policy.NewStudentsOnly,
        CommissionRate = policy.CommissionRate,
        CurrencyCode = policy.CurrencyCode,
        FormulaNote = policy.FormulaNote,
        ScopeNote = policy.ScopeNote,
        Source = policy.Source,
        SourceNotice = policy.SourceNotice,
        RecordedAt = policy.RecordedAt,
        RoomBases = policy.RoomBases.OrderBy(x => x.RoomName).Select(room => new SchoolCommissionRoomBasisDTO
        {
          RoomCode = room.RoomCode,
          RoomName = room.RoomName,
          PublishedRoomPriceFourWeeks = room.PublishedRoomPriceFourWeeks,
          CommissionBasisFourWeeks = room.CommissionBasisFourWeeks,
          Note = room.Note,
        }).ToList(),
      }).ToList());
    }
  }
}

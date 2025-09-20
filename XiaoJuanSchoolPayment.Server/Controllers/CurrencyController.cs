using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using XiaoJuanSchoolPayment.Server.Data.DTO;
using XiaoJuanSchoolPayment.Server.Interface;

namespace XiaoJuanSchoolPayment.Server.Controllers
{
  [ApiController]
  [Route("currency")]
  public class CurrencyController : ControllerBase
  {
    private readonly ICurrencyService _currencyService;
    public CurrencyController(ICurrencyService currencyService) {
      _currencyService = currencyService;
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("get-currencys")]
    public async Task<IActionResult> GetSchools(CancellationToken ct) {
      var result = await _currencyService.GetCurrencyDTOs(ct);
      return Ok(result);
    }
  }
}

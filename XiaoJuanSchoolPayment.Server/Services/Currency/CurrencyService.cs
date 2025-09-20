using System.Data.Entity;
using XiaoJuanSchoolPayment.Server.Data;
using XiaoJuanSchoolPayment.Server.Data.DTO;
using XiaoJuanSchoolPayment.Server.Interface;

namespace XiaoJuanSchoolPayment.Server.Services.Currency
{
  public class CurrencyService : ICurrencyService
  {
    private readonly AppDbContext _appDbContext;
    public CurrencyService(AppDbContext appDbContext) {
      _appDbContext = appDbContext;
    }

    public async Task<IList<CurrencyDTO>> GetCurrencyDTOs(CancellationToken cancellationToken)
    {
      return await _appDbContext.SchoolCurrency.AsNoTracking().Select(x => new CurrencyDTO { 
        Id = x.Id,
        CurrencyCode  = x.CurrencyCode,
        Symbol = x.Symbol }).ToListAsync(cancellationToken);
    }
  }
}

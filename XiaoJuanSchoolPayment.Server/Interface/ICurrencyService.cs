using XiaoJuanSchoolPayment.Server.Data.DTO;

namespace XiaoJuanSchoolPayment.Server.Interface
{
  public interface ICurrencyService
  {
    public Task<IList<CurrencyDTO>> GetCurrencyDTOs(CancellationToken cancellationToken);
  }
}

namespace XiaoJuanSchoolPayment.Server.Data.DTO
{
  public class CurrencyDTO
  {
    public int Id { get; set; }
    public required string CurrencyCode { get; set; }
    public required string Symbol { get; set; }
  }
}

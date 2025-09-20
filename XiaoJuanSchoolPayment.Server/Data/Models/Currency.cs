namespace XiaoJuanSchoolPayment.Server.Data.Models
{
  public class Currency
  {
    public int Id { get; set; }
    public required string Symbol { get; set; }
    public required string CurrencyCode { get; set; }
  }
}

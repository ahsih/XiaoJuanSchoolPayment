namespace XiaoJuanSchoolPayment.Server.Data.Filter
{
  public class SchoolFeeFilter
  {
    public Guid? SchoolId { get; set; }
    public string? Name { get; set; }
    public decimal? MaxFee { get; set; }
    public decimal? MinFee { get; set; }
  }
}

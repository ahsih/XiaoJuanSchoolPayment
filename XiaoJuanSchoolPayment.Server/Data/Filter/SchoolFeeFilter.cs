namespace XiaoJuanSchoolPayment.Server.Data.Filter
{
  public class SchoolFeeFilter
  {
    public Guid? SchoolId { get; set; }
    public string? Name { get; set; }
    public int? MaxFee { get; set; }
    public int? MinFee { get; set; }
  }
}

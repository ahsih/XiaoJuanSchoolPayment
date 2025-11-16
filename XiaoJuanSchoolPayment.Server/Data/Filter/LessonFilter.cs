namespace XiaoJuanSchoolPayment.Server.Data.Filter
{
  public class LessonFilter
  {
    public Guid? SchoolId { get; set; }
    public int? Week { get; set; }
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }
    public string? Name { get; set; }
  }
}

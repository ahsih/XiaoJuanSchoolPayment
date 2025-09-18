namespace XiaoJuanSchoolPayment.Server.Data.DTO
{
  public class SchoolDTO
  {
    public Guid Id { get; set; }
    public required string Name { get; set; }
    public required DateTime CreatedDate { get; set; }
  }
}

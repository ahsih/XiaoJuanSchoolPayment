namespace XiaoJuanSchoolPayment.Server.Data.Models
{
  public class SchoolLesson : AuditableEntity
  {
    public required string Name { get; set; }
    public int Week { get; set; }
    public decimal Price { get; set; }
    public string? Description { get; set; }
    public string? Note { get; set; }
    public required School School { get; set; }
    public Guid SchoolId { get; set; }
  }
}

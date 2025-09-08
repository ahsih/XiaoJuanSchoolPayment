namespace XiaoJuanSchoolPayment.Server.Data.Models
{
  public class SchoolRoom : AuditableEntity
  {
    public required string Name { get; set; }
    public decimal Price { get; set; }
    public int Currency { get; set; }
    public string? Description { get; set; }
    public Guid SchoolId { get; set; }
    public required School School { get; set; }
  }
}

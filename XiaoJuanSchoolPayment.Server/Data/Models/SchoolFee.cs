namespace XiaoJuanSchoolPayment.Server.Data.Models
{
  public class SchoolFee : AuditableEntity
  {
    public required string Name { get; set; }
    public decimal Fee { get; set; }
    public string? Description { get; set; }
  }
}

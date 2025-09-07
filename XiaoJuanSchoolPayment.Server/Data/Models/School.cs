namespace XiaoJuanSchoolPayment.Server.Data.Models
{
  public class School : AuditableEntity
  {
    public required string Name { get; set; }
    public DateTime CreatedDate { get; set; }
  }
}

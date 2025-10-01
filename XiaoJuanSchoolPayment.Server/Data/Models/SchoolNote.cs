namespace XiaoJuanSchoolPayment.Server.Data.Models
{
  public class SchoolNote : AuditableEntity
  {
    public School? School { get; set; }
    public Guid SchoolId { get; set; }
    public required string Notes { get; set; }
    public DateTime LastUpdated { get; set; }
  }
}

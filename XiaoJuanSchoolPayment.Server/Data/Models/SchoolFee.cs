namespace XiaoJuanSchoolPayment.Server.Data.Models
{
  public class SchoolFee : AuditableEntity
  {
    public School? School { get; set; }
    public Guid SchoolId { get; set; }
    public required string Name { get; set; }
    public decimal Fee { get; set; }
    public string? Description { get; set; }
    public Currency? Currency { get; set; }
    public int CurrencyId { get; set; }
    public DateTime LastUpdated { get; set; }
  }
}

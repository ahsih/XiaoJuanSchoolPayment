using XiaoJuanSchoolPayment.Server.Data.Models;

namespace XiaoJuanSchoolPayment.Server.Data.DTO
{
  public class SchoolFeeDTO
  {
    public Guid Id { get; set; }
    public Guid SchoolId { get; set; }
    public required string Name { get; set; }
    public decimal Fee { get; set; }
    public string? Description { get; set; }
    public int CurrencyId { get; set; }
    public DateTime LastUpdated { get; set; }
    public string? SchoolName { get; set; }
    public string? CurrencyCode { get; set; }
  }
}

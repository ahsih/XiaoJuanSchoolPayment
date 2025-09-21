using XiaoJuanSchoolPayment.Server.Data.Models;

namespace XiaoJuanSchoolPayment.Server.Data.DTO
{
  public class SchoolLessonDTO
  {
    public Guid Id { get; set; }
    public required string Name { get; set; }
    public int Week { get; set; }
    public decimal Price { get; set; }
    public string? Description { get; set; }
    public string? Note { get; set; }
    public string? SchoolName { get; set; }
    public string? CurrencyCode { get; set; }
    public int CurrencyId { get; set; }
    public Guid SchoolId { get; set; }
  }
}

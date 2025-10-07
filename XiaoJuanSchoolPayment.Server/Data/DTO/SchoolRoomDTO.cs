using XiaoJuanSchoolPayment.Server.Data.Models;

namespace XiaoJuanSchoolPayment.Server.Data.DTO
{
  public class SchoolRoomDTO
  {
    public Guid Id { get; set; }
    public required string Name { get; set; }
    public decimal Price { get; set; }
    public int CurrencyId { get; set; }
    public string? Description { get; set; }
    public string? CurrencyCode { get; set; }
    public Guid SchoolId { get; set; }
    public int Week { get; set; }
    public string? SchoolName { get; set; }
  }
}

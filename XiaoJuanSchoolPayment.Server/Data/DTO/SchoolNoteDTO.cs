using XiaoJuanSchoolPayment.Server.Data.Models;

namespace XiaoJuanSchoolPayment.Server.Data.DTO
{
  public class SchoolNoteDTO
  {
    public Guid Id { get; set; }
    public string? SchoolName { get; set; }
    public Guid SchoolId { get; set; }
    public required string Notes { get; set; }
    public DateTime LastUpdated { get; set; }
  }
}

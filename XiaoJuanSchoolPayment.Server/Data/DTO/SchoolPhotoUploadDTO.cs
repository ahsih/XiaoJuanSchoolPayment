using Microsoft.AspNetCore.Http;

namespace XiaoJuanSchoolPayment.Server.Data.DTO
{
  public class SchoolPhotoUploadDTO
  {
    public Guid SchoolId { get; set; }
    public required IFormFile File { get; set; }
    public string? Category { get; set; }
    public string? Caption { get; set; }
    public string? AltText { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;
  }
}

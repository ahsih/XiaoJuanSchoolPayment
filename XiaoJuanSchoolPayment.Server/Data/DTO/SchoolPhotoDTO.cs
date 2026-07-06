namespace XiaoJuanSchoolPayment.Server.Data.DTO
{
  public class SchoolPhotoDTO
  {
    public Guid Id { get; set; }
    public Guid SchoolId { get; set; }
    public string? SchoolName { get; set; }
    public string? OriginalFileName { get; set; }
    public string? StoredFileName { get; set; }
    public string? Url { get; set; }
    public string? ContentType { get; set; }
    public long SizeBytes { get; set; }
    public string? Category { get; set; }
    public string? Caption { get; set; }
    public string? AltText { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime LastUpdated { get; set; }
  }
}

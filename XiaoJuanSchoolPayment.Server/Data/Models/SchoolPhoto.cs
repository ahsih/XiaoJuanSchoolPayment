namespace XiaoJuanSchoolPayment.Server.Data.Models
{
  public class SchoolPhoto : AuditableEntity
  {
    public Guid SchoolId { get; set; }
    public School? School { get; set; }
    public required string OriginalFileName { get; set; }
    public required string StoredFileName { get; set; }
    public required string FilePath { get; set; }
    public required string Url { get; set; }
    public required string ContentType { get; set; }
    public long SizeBytes { get; set; }
    public string? Category { get; set; }
    public string? Caption { get; set; }
    public string? AltText { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; }
    public DateTime LastUpdated { get; set; }
  }
}

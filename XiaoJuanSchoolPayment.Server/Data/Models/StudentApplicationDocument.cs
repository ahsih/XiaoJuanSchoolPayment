using System.ComponentModel.DataAnnotations;

namespace XiaoJuanSchoolPayment.Server.Data.Models
{
  public class StudentApplicationDocument : AuditableEntity
  {
    public Guid StudentApplicationId { get; set; }
    public StudentApplication? StudentApplication { get; set; }

    [MaxLength(50)]
    public required string DocumentType { get; set; }

    [MaxLength(255)]
    public required string DisplayName { get; set; }

    [MaxLength(255)]
    public required string OriginalFileName { get; set; }

    [MaxLength(255)]
    public required string StoredFileName { get; set; }

    [MaxLength(500)]
    public required string FilePath { get; set; }

    [MaxLength(100)]
    public required string ContentType { get; set; }

    public long SizeBytes { get; set; }
    public bool IsVisibleToStudent { get; set; } = true;
    public DateTime UploadedAt { get; set; }
  }
}

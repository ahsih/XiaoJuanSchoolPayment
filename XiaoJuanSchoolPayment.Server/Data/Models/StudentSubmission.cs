using System.ComponentModel.DataAnnotations;

namespace XiaoJuanSchoolPayment.Server.Data.Models
{
  /// <summary>
  /// A file the student uploaded from the website student center or the mini program (passport page, photo,
  /// flight itinerary...). It has its own review: an employee accepts it or returns it with a reason. It never
  /// becomes part of the published application snapshot.
  /// </summary>
  public class StudentSubmission : AuditableEntity
  {
    public Guid StudentApplicationId { get; set; }
    public StudentApplication? StudentApplication { get; set; }

    [MaxLength(50)]
    public required string DocumentType { get; set; }

    [MaxLength(300)]
    public string? StudentNote { get; set; }

    [MaxLength(255)]
    public required string OriginalFileName { get; set; }

    [MaxLength(255)]
    public required string StoredFileName { get; set; }

    [MaxLength(500)]
    public required string FilePath { get; set; }

    [MaxLength(100)]
    public required string ContentType { get; set; }

    public long SizeBytes { get; set; }

    /// <summary>PendingReview, Accepted or Returned.</summary>
    [MaxLength(20)]
    public string ReviewStatus { get; set; } = "PendingReview";

    [MaxLength(450)]
    public string? SubmittedByUserId { get; set; }

    public DateTime SubmittedAt { get; set; }

    [MaxLength(450)]
    public string? ReviewedByUserId { get; set; }

    [MaxLength(256)]
    public string? ReviewedByName { get; set; }

    public DateTime? ReviewedAt { get; set; }

    [MaxLength(500)]
    public string? ReviewNote { get; set; }
  }
}

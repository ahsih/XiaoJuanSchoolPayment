using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace XiaoJuanSchoolPayment.Server.Data.Models
{
  public class StudentPayment : AuditableEntity
  {
    public Guid StudentApplicationId { get; set; }
    public StudentApplication? StudentApplication { get; set; }

    [MaxLength(100)]
    public required string PayerName { get; set; }

    [MaxLength(50)]
    public required string PaymentType { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal Amount { get; set; }

    [MaxLength(10)]
    public required string CurrencyCode { get; set; }

    public DateTime PaidAt { get; set; }

    [MaxLength(50)]
    public required string PaymentMethod { get; set; }

    [MaxLength(150)]
    public string? ReceivingAccount { get; set; }

    [MaxLength(100)]
    public string? ReferenceNumber { get; set; }

    [MaxLength(500)]
    public string? Note { get; set; }

    [MaxLength(20)]
    public string ReviewStatus { get; set; } = "PendingReview";

    [MaxLength(450)]
    public string? SubmittedByUserId { get; set; }

    [MaxLength(256)]
    public string? SubmittedByName { get; set; }

    public DateTime SubmittedAt { get; set; }

    [MaxLength(450)]
    public string? ReviewedByUserId { get; set; }

    [MaxLength(256)]
    public string? ReviewedByName { get; set; }

    public DateTime? ReviewedAt { get; set; }

    [MaxLength(500)]
    public string? ReviewNote { get; set; }

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
    public DateTime CreatedAt { get; set; }
    public DateTime LastUpdated { get; set; }
  }
}

using System.ComponentModel.DataAnnotations;

namespace XiaoJuanSchoolPayment.Server.Data.Models
{
  public class StudentApplication : AuditableEntity
  {
    [MaxLength(450)]
    public string? StudentUserId { get; set; }
    public SchoolUser? StudentUser { get; set; }

    [MaxLength(100)]
    public string? StudentFirstName { get; set; }

    [MaxLength(100)]
    public string? StudentLastName { get; set; }

    [MaxLength(256)]
    public string? StudentEmail { get; set; }

    [MaxLength(32)]
    public string? StudentPhone { get; set; }

    [MaxLength(20)]
    public string EnrollmentType { get; set; } = "单人报名";

    public DateTime? EnrollmentDate { get; set; }

    [MaxLength(30)]
    public string VisaStatus { get; set; } = "未确认";

    public string? MembersJson { get; set; }

    public string? CoursePlansJson { get; set; }

    public string? AccommodationPlansJson { get; set; }

    public Guid SchoolId { get; set; }
    public School? School { get; set; }

    [MaxLength(200)]
    public string? CourseName { get; set; }

    [MaxLength(200)]
    public string? AccommodationName { get; set; }

    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }

    [MaxLength(50)]
    public required string Status { get; set; }

    [MaxLength(2000)]
    public string? StudentVisibleNotes { get; set; }

    [MaxLength(2000)]
    public string? InternalNotes { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime LastUpdated { get; set; }

    [MaxLength(20)]
    public string ReviewStatus { get; set; } = "Published";

    [MaxLength(500)]
    public string? ChangeSummary { get; set; }

    [MaxLength(450)]
    public string? SubmittedByUserId { get; set; }

    [MaxLength(256)]
    public string? SubmittedByName { get; set; }

    public DateTime? SubmittedAt { get; set; }

    [MaxLength(450)]
    public string? PublishedByUserId { get; set; }

    [MaxLength(256)]
    public string? PublishedByName { get; set; }

    public DateTime? PublishedAt { get; set; }

    public string? PublishedSnapshotJson { get; set; }

    public ICollection<StudentApplicationDocument> Documents { get; set; } = new List<StudentApplicationDocument>();
    public ICollection<StudentPayment> Payments { get; set; } = new List<StudentPayment>();
  }
}

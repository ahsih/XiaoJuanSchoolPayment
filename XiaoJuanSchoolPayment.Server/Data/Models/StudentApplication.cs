using System.ComponentModel.DataAnnotations;

namespace XiaoJuanSchoolPayment.Server.Data.Models
{
  public class StudentApplication : AuditableEntity
  {
    [MaxLength(450)]
    public required string StudentUserId { get; set; }
    public SchoolUser? StudentUser { get; set; }

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

    public ICollection<StudentApplicationDocument> Documents { get; set; } = new List<StudentApplicationDocument>();
  }
}

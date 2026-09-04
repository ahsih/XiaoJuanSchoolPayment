using System.ComponentModel.DataAnnotations;

namespace XiaoJuanSchoolPayment.Server.Data.DTO
{
  public class StudentApplicationDTO
  {
    public Guid Id { get; set; }
    public required string StudentFirstName { get; set; }
    public required string StudentLastName { get; set; }
    public required string StudentName { get; set; }
    public required string StudentEmail { get; set; }
    public Guid SchoolId { get; set; }
    public required string SchoolName { get; set; }
    public string? CourseName { get; set; }
    public string? AccommodationName { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public required string Status { get; set; }
    public string? StudentVisibleNotes { get; set; }
    public string? InternalNotes { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime LastUpdated { get; set; }
    public IList<StudentApplicationDocumentDTO> Documents { get; set; } = new List<StudentApplicationDocumentDTO>();
  }

  public class StudentApplicationDocumentDTO
  {
    public Guid Id { get; set; }
    public required string DocumentType { get; set; }
    public required string DisplayName { get; set; }
    public required string OriginalFileName { get; set; }
    public long SizeBytes { get; set; }
    public bool IsVisibleToStudent { get; set; }
    public DateTime UploadedAt { get; set; }
    public required string DownloadUrl { get; set; }
  }

  public class CreateStudentApplicationDTO
  {
    [Required, EmailAddress, MaxLength(256)]
    public required string Email { get; set; }
    [MaxLength(128)]
    public string? TemporaryPassword { get; set; }
    [Required, MaxLength(100)]
    public required string FirstName { get; set; }
    [Required, MaxLength(100)]
    public required string LastName { get; set; }
    public Guid SchoolId { get; set; }
    [MaxLength(200)]
    public string? CourseName { get; set; }
    [MaxLength(200)]
    public string? AccommodationName { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    [MaxLength(50)]
    public string? Status { get; set; }
    [MaxLength(2000)]
    public string? StudentVisibleNotes { get; set; }
    [MaxLength(2000)]
    public string? InternalNotes { get; set; }
  }

  public class UpdateStudentApplicationDTO
  {
    public Guid SchoolId { get; set; }
    [MaxLength(200)]
    public string? CourseName { get; set; }
    [MaxLength(200)]
    public string? AccommodationName { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    [Required, MaxLength(50)]
    public required string Status { get; set; }
    [MaxLength(2000)]
    public string? StudentVisibleNotes { get; set; }
    [MaxLength(2000)]
    public string? InternalNotes { get; set; }
  }

  public class StudentDocumentUploadDTO
  {
    public required IFormFile File { get; set; }
    [Required, MaxLength(50)]
    public required string DocumentType { get; set; }
    [MaxLength(255)]
    public string? DisplayName { get; set; }
    public bool IsVisibleToStudent { get; set; } = true;
  }
}

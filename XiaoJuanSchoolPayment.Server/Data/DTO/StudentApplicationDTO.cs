using System.ComponentModel.DataAnnotations;

namespace XiaoJuanSchoolPayment.Server.Data.DTO
{
  public class StudentApplicationDTO
  {
    public Guid Id { get; set; }
    public required string StudentFirstName { get; set; }
    public required string StudentLastName { get; set; }
    public required string StudentName { get; set; }
    public string? StudentEmail { get; set; }
    public string? StudentPhone { get; set; }
    public bool HasStudentAccount { get; set; }
    public string EnrollmentType { get; set; } = "单人报名";
    public DateTime? EnrollmentDate { get; set; }
    public string VisaStatus { get; set; } = "未确认";
    public IList<StudentApplicationMemberDTO> Members { get; set; } = new List<StudentApplicationMemberDTO>();
    public IList<StudentApplicationPlanDTO> CoursePlans { get; set; } = new List<StudentApplicationPlanDTO>();
    public IList<StudentApplicationPlanDTO> AccommodationPlans { get; set; } = new List<StudentApplicationPlanDTO>();
    public int? StudyWeeks { get; set; }
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
    public string ReviewStatus { get; set; } = "Published";
    public string? ChangeSummary { get; set; }
    public string? SubmittedByName { get; set; }
    public DateTime? SubmittedAt { get; set; }
    public string? PublishedByName { get; set; }
    public DateTime? PublishedAt { get; set; }
    public IList<StudentApplicationDocumentDTO> Documents { get; set; } = new List<StudentApplicationDocumentDTO>();
    public IList<StudentPaymentDTO> Payments { get; set; } = new List<StudentPaymentDTO>();
  }

  public class StudentApplicationMemberDTO
  {
    [Required, MaxLength(50)]
    public required string Key { get; set; }
    [Required, MaxLength(100)]
    public required string Name { get; set; }
    [MaxLength(50)]
    public string? Relationship { get; set; }
    [EmailAddress, MaxLength(256)]
    public string? Email { get; set; }
    [MaxLength(32)]
    public string? PhoneNumber { get; set; }
  }

  public class StudentApplicationPlanDTO
  {
    [Required, MaxLength(50)]
    public required string Key { get; set; }
    [Required, MaxLength(50)]
    public required string ParticipantKey { get; set; }
    [Required, MaxLength(200)]
    public required string Name { get; set; }
    public DateTime? StartDate { get; set; }
    [Range(1, 104)]
    public int? Weeks { get; set; }
    public DateTime? EndDate { get; set; }
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
    [EmailAddress, MaxLength(256)]
    public string? Email { get; set; }
    [MaxLength(32)]
    public string? PhoneNumber { get; set; }
    [MaxLength(20)]
    public string EnrollmentType { get; set; } = "单人报名";
    public DateTime? EnrollmentDate { get; set; }
    [MaxLength(30)]
    public string VisaStatus { get; set; } = "未确认";
    public IList<StudentApplicationMemberDTO> Members { get; set; } = new List<StudentApplicationMemberDTO>();
    public IList<StudentApplicationPlanDTO> CoursePlans { get; set; } = new List<StudentApplicationPlanDTO>();
    public IList<StudentApplicationPlanDTO> AccommodationPlans { get; set; } = new List<StudentApplicationPlanDTO>();
    [Required, MaxLength(100)]
    public required string FirstName { get; set; }
    [MaxLength(100)]
    public string? LastName { get; set; }
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
    [Required, MaxLength(100)]
    public required string FirstName { get; set; }
    [MaxLength(100)]
    public string? LastName { get; set; }
    [EmailAddress, MaxLength(256)]
    public string? Email { get; set; }
    [MaxLength(32)]
    public string? PhoneNumber { get; set; }
    [MaxLength(20)]
    public string EnrollmentType { get; set; } = "单人报名";
    public DateTime? EnrollmentDate { get; set; }
    [MaxLength(30)]
    public string VisaStatus { get; set; } = "未确认";
    public IList<StudentApplicationMemberDTO> Members { get; set; } = new List<StudentApplicationMemberDTO>();
    public IList<StudentApplicationPlanDTO> CoursePlans { get; set; } = new List<StudentApplicationPlanDTO>();
    public IList<StudentApplicationPlanDTO> AccommodationPlans { get; set; } = new List<StudentApplicationPlanDTO>();
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

  public class StudentPaymentDTO
  {
    public Guid Id { get; set; }
    public Guid StudentApplicationId { get; set; }
    public required string StudentName { get; set; }
    public required string SchoolName { get; set; }
    public required string PayerName { get; set; }
    public required string PaymentType { get; set; }
    public decimal Amount { get; set; }
    public required string CurrencyCode { get; set; }
    public DateTime PaidAt { get; set; }
    public required string PaymentMethod { get; set; }
    public string? ReceivingAccount { get; set; }
    public string? ReferenceNumber { get; set; }
    public string? Note { get; set; }
    public required string ReviewStatus { get; set; }
    public string? SubmittedByName { get; set; }
    public DateTime SubmittedAt { get; set; }
    public string? ReviewedByName { get; set; }
    public DateTime? ReviewedAt { get; set; }
    public string? ReviewNote { get; set; }
    public required string OriginalFileName { get; set; }
    public long SizeBytes { get; set; }
    public bool IsVisibleToStudent { get; set; }
    public required string DownloadUrl { get; set; }
  }

  public class StudentPaymentSubmissionDTO
  {
    public IFormFile? File { get; set; }
    [Required, MaxLength(100)]
    public required string PayerName { get; set; }
    [Required, MaxLength(50)]
    public required string PaymentType { get; set; }
    [Range(typeof(decimal), "0.01", "9999999999999999")]
    public decimal Amount { get; set; }
    [Required, RegularExpression("^[A-Za-z]{3}$")]
    public required string CurrencyCode { get; set; }
    public DateTime PaidAt { get; set; }
    [Required, MaxLength(50)]
    public required string PaymentMethod { get; set; }
    [MaxLength(150)]
    public string? ReceivingAccount { get; set; }
    [MaxLength(100)]
    public string? ReferenceNumber { get; set; }
    [MaxLength(500)]
    public string? Note { get; set; }
  }

  public class StudentPaymentReviewDTO
  {
    [MaxLength(500)]
    public string? Note { get; set; }
  }

  public class ReturnStudentPaymentReviewDTO
  {
    [Required, MaxLength(500)]
    public required string Reason { get; set; }
  }

  public class SubmitStudentApplicationReviewDTO
  {
    [Required, MaxLength(500)]
    public required string ChangeSummary { get; set; }
  }

  public class PublishStudentApplicationDTO
  {
    [MaxLength(500)]
    public string? ChangeSummary { get; set; }
  }

  public class ReturnStudentApplicationReviewDTO
  {
    [Required, MaxLength(500)]
    public required string Reason { get; set; }
  }
}

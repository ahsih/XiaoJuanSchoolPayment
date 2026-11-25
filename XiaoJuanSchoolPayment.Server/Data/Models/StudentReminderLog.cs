using System.ComponentModel.DataAnnotations;

namespace XiaoJuanSchoolPayment.Server.Data.Models
{
  /// <summary>
  /// One automatic reminder already sent to a student (a fee due soon, or the trip starting soon), so the daily
  /// reminder check never sends the same reminder twice.
  /// </summary>
  public class StudentReminderLog : AuditableEntity
  {
    public Guid StudentApplicationId { get; set; }
    public StudentApplication? StudentApplication { get; set; }

    [MaxLength(30)]
    public required string Kind { get; set; }

    [MaxLength(120)]
    public required string ReminderKey { get; set; }

    public DateTime SentAt { get; set; }
  }
}

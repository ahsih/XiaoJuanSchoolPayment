using System.ComponentModel.DataAnnotations;

namespace XiaoJuanSchoolPayment.Server.Data.Models
{
  public class AccountVerificationCode : AuditableEntity
  {
    [MaxLength(256)]
    public required string Account { get; set; }

    [MaxLength(16)]
    public required string AccountType { get; set; }

    [MaxLength(16)]
    public required string Purpose { get; set; }

    [MaxLength(64)]
    public required string CodeHash { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime ExpiresAt { get; set; }
    public DateTime? ConsumedAt { get; set; }
    public int FailedAttempts { get; set; }
  }
}

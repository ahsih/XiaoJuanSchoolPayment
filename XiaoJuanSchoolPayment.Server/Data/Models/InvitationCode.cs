using System.ComponentModel.DataAnnotations;

namespace XiaoJuanSchoolPayment.Server.Data.Models
{
  public class InvitationCode : AuditableEntity
  {
    [MaxLength(64)]
    public required string CodeHash { get; set; }

    [MaxLength(16)]
    public required string CodePrefix { get; set; }

    [MaxLength(20)]
    public required string Role { get; set; }

    [MaxLength(450)]
    public required string CreatedByUserId { get; set; }

    [MaxLength(450)]
    public string? UsedByUserId { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime ExpiresAt { get; set; }
    public DateTime? UsedAt { get; set; }
    public DateTime? RevokedAt { get; set; }
  }
}

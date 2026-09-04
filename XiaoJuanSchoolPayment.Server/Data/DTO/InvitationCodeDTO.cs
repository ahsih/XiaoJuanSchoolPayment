using System.ComponentModel.DataAnnotations;

namespace XiaoJuanSchoolPayment.Server.Data.DTO
{
  public class CreateInvitationCodeDTO
  {
    [Range(1, 30)]
    public int ExpiresInDays { get; set; } = 7;
  }

  public class InvitationCodeDTO
  {
    public Guid Id { get; set; }
    public string? Code { get; set; }
    public required string CodePrefix { get; set; }
    public required string Role { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime ExpiresAt { get; set; }
    public DateTime? UsedAt { get; set; }
    public DateTime? RevokedAt { get; set; }
    public required string Status { get; set; }
  }
}

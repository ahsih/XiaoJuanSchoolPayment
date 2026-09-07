using System.ComponentModel.DataAnnotations;

namespace XiaoJuanSchoolPayment.Server.Data.DTO
{
  public class SendVerificationCodeDTO
  {
    [Required, MaxLength(256)]
    public required string Account { get; set; }

    [Required, RegularExpression("^(Login|Register)$")]
    public required string Purpose { get; set; }
  }

  public class VerificationCodeResponseDTO
  {
    public required string DeliveryChannel { get; set; }
    public required string MaskedAccount { get; set; }
    public int ExpiresInSeconds { get; set; }
    public int RetryAfterSeconds { get; set; }
    public string? DevelopmentCode { get; set; }
  }
}

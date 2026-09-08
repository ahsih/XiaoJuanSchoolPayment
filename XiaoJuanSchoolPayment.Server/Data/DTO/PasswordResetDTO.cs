using System.ComponentModel.DataAnnotations;

namespace XiaoJuanSchoolPayment.Server.Data.DTO
{
  public sealed class ForgotPasswordDTO
  {
    [Required, MaxLength(256)]
    public required string Account { get; set; }
  }

  public sealed class ResetPasswordDTO
  {
    [Required, EmailAddress, MaxLength(256)]
    public required string Email { get; set; }

    [Required]
    public required string Token { get; set; }

    [Required, MinLength(8), MaxLength(128)]
    public required string NewPassword { get; set; }
  }
}

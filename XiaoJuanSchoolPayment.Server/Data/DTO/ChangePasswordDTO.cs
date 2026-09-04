using System.ComponentModel.DataAnnotations;

namespace XiaoJuanSchoolPayment.Server.Data.DTO
{
  public class ChangePasswordDTO
  {
    [Required]
    public required string CurrentPassword { get; set; }
    [Required, MinLength(8), MaxLength(128)]
    public required string NewPassword { get; set; }
  }
}

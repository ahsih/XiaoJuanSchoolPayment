using System.ComponentModel.DataAnnotations;

namespace XiaoJuanSchoolPayment.Server.Data.DTO;

public sealed class ContactFormRequestDTO
{
  [Required]
  [StringLength(120)]
  public string Name { get; set; } = string.Empty;

  [Required]
  [EmailAddress]
  [StringLength(200)]
  public string Email { get; set; } = string.Empty;

  [Required]
  [RegularExpression(@"^\d+$", ErrorMessage = "Phone number must contain numbers only.")]
  [StringLength(40)]
  public string Phone { get; set; } = string.Empty;

  [Required]
  [StringLength(80)]
  public string Wechat { get; set; } = string.Empty;

  [Required]
  [StringLength(2000)]
  public string Message { get; set; } = string.Empty;
}

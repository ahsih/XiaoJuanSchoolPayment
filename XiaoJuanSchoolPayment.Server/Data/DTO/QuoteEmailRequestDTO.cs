using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace XiaoJuanSchoolPayment.Server.Data.DTO;

public sealed class QuoteEmailRequestDTO
{
  [Required]
  [EmailAddress]
  [StringLength(200)]
  public string Email { get; set; } = string.Empty;

  [Required]
  [StringLength(160)]
  public string FileName { get; set; } = "quote-image.png";

  [Required]
  public IFormFile? Image { get; set; }

  [StringLength(160)]
  public string? SchoolName { get; set; }

  [StringLength(400)]
  public string? Summary { get; set; }
}

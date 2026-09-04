namespace XiaoJuanSchoolPayment.Server.Data.DTO
{
  public class LoginDTO
  {
    [System.ComponentModel.DataAnnotations.MaxLength(256)]
    public string? Account { get; set; }
    [System.ComponentModel.DataAnnotations.MaxLength(256)]
    public string? Email { get; set; }
    [System.ComponentModel.DataAnnotations.Required]
    public required string Password { get; set; }
  }
}

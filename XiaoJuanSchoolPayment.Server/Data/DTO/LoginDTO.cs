namespace XiaoJuanSchoolPayment.Server.Data.DTO
{
  public class LoginDTO
  {
    [System.ComponentModel.DataAnnotations.Required, System.ComponentModel.DataAnnotations.MaxLength(256)]
    public required string Account { get; set; }
    [System.ComponentModel.DataAnnotations.Required, System.ComponentModel.DataAnnotations.MaxLength(128)]
    public required string Password { get; set; }
  }
}

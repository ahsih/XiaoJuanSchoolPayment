namespace XiaoJuanSchoolPayment.Server.Data.DTO
{
  public class LoginDTO
  {
    [System.ComponentModel.DataAnnotations.Required, System.ComponentModel.DataAnnotations.MaxLength(256)]
    public required string Account { get; set; }
    [System.ComponentModel.DataAnnotations.Required, System.ComponentModel.DataAnnotations.RegularExpression("^(Password|Code)$")]
    public required string Method { get; set; }
    [System.ComponentModel.DataAnnotations.MaxLength(128)]
    public string? Password { get; set; }
    [System.ComponentModel.DataAnnotations.RegularExpression("^[0-9]{6}$")]
    public string? VerificationCode { get; set; }
  }
}

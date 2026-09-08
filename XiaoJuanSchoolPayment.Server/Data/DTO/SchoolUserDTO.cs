namespace XiaoJuanSchoolPayment.Server.Data.DTO
{
  public class SchoolUserDTO
  {
    [System.ComponentModel.DataAnnotations.Required, System.ComponentModel.DataAnnotations.EmailAddress, System.ComponentModel.DataAnnotations.MaxLength(256)]
    public required string Email { get; set; }
    [System.ComponentModel.DataAnnotations.MaxLength(32)]
    public string? PhoneNumber { get; set; }
    [System.ComponentModel.DataAnnotations.Required, System.ComponentModel.DataAnnotations.MinLength(8), System.ComponentModel.DataAnnotations.MaxLength(128)]
    public required string Password { get; set; }
    [System.ComponentModel.DataAnnotations.Required, System.ComponentModel.DataAnnotations.MaxLength(100)]
    public required string Name { get; set; }
    [System.ComponentModel.DataAnnotations.Required, System.ComponentModel.DataAnnotations.MaxLength(64)]
    public required string InvitationCode { get; set; }
    public required string AccessCode { get; set; }
  }
}

namespace XiaoJuanSchoolPayment.Server.Data.DTO
{
  public class JWTLoginTokenDTO
  {
    public required string Token { get; set; }
    public DateTime ExpiryDate { get; set; }
    public required IList<string> Roles { get; set; }
    public required string Name { get; set; }
    public required string Email { get; set; }
  }
}

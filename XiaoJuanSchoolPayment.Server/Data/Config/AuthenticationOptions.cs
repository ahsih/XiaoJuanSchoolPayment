namespace XiaoJuanSchoolPayment.Server.Data.Config;

public sealed class AuthenticationOptions
{
  public int VerificationCodeLifetimeMinutes { get; set; } = 5;
  public int ResendCooldownSeconds { get; set; } = 60;
  public int MaxRequestsPerHour { get; set; } = 5;
  public int MaxFailedAttempts { get; set; } = 5;
  public AliyunSmsOptions Sms { get; set; } = new();
}

public sealed class AliyunSmsOptions
{
  public string AccessKeyId { get; set; } = string.Empty;
  public string AccessKeySecret { get; set; } = string.Empty;
  public string SignName { get; set; } = string.Empty;
  public string TemplateCode { get; set; } = string.Empty;
}

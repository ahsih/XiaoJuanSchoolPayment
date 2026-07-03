namespace XiaoJuanSchoolPayment.Server.Data.Config;

public sealed class ContactFormOptions
{
  public string RecipientEmail { get; set; } = string.Empty;
  public string SenderEmail { get; set; } = string.Empty;
  public SmtpOptions Smtp { get; set; } = new();
}

public sealed class SmtpOptions
{
  public string Host { get; set; } = string.Empty;
  public int Port { get; set; } = 587;
  public string Username { get; set; } = string.Empty;
  public string Password { get; set; } = string.Empty;
  public bool EnableSsl { get; set; } = true;
}

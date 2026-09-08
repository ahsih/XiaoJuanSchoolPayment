using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Options;
using XiaoJuanSchoolPayment.Server.Data.Config;

namespace XiaoJuanSchoolPayment.Server.Services
{
  public interface IAccountEmailService
  {
    Task SendPasswordResetAsync(
      string email,
      string displayName,
      string resetUrl,
      CancellationToken cancellationToken);
  }

  public sealed class AccountEmailService : IAccountEmailService
  {
    private readonly ContactFormOptions _options;

    public AccountEmailService(IOptions<ContactFormOptions> options)
    {
      _options = options.Value;
    }

    public async Task SendPasswordResetAsync(
      string email,
      string displayName,
      string resetUrl,
      CancellationToken cancellationToken)
    {
      if (string.IsNullOrWhiteSpace(_options.SenderEmail)
        || string.IsNullOrWhiteSpace(_options.Smtp.Host)
        || string.IsNullOrWhiteSpace(_options.Smtp.Username)
        || string.IsNullOrWhiteSpace(_options.Smtp.Password))
      {
        throw new AccountEmailDeliveryUnavailableException("密码重置邮件服务尚未配置。");
      }

      var greeting = string.IsNullOrWhiteSpace(displayName) ? "您好" : $"{displayName}，您好";
      using var message = new MailMessage
      {
        From = new MailAddress(_options.SenderEmail, "思达启航教育"),
        Subject = "重置思达启航账号密码",
        Body = $"{greeting}\r\n\r\n请点击以下链接重置密码（链接 1 小时内有效）：\r\n{resetUrl}\r\n\r\n如非本人操作，请忽略本邮件。",
        IsBodyHtml = false,
      };
      message.To.Add(email);

      using var smtpClient = new SmtpClient(_options.Smtp.Host, _options.Smtp.Port)
      {
        EnableSsl = _options.Smtp.EnableSsl,
        UseDefaultCredentials = false,
        Credentials = new NetworkCredential(_options.Smtp.Username, _options.Smtp.Password),
      };

      await smtpClient.SendMailAsync(message, cancellationToken);
    }
  }

  public sealed class AccountEmailDeliveryUnavailableException : Exception
  {
    public AccountEmailDeliveryUnavailableException(string message) : base(message)
    {
    }
  }
}

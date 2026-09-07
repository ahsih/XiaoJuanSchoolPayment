using System.Globalization;
using System.Net;
using System.Net.Mail;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Options;
using XiaoJuanSchoolPayment.Server.Data.Config;

namespace XiaoJuanSchoolPayment.Server.Services
{
  public interface IVerificationCodeDeliveryService
  {
    Task SendAsync(AccountIdentifier account, string code, CancellationToken cancellationToken);
  }

  public sealed class VerificationCodeDeliveryService : IVerificationCodeDeliveryService
  {
    private readonly ContactFormOptions _contactOptions;
    private readonly AuthenticationOptions _authOptions;
    private readonly IHttpClientFactory _httpClientFactory;

    public VerificationCodeDeliveryService(
      IOptions<ContactFormOptions> contactOptions,
      IOptions<AuthenticationOptions> authOptions,
      IHttpClientFactory httpClientFactory)
    {
      _contactOptions = contactOptions.Value;
      _authOptions = authOptions.Value;
      _httpClientFactory = httpClientFactory;
    }

    public Task SendAsync(AccountIdentifier account, string code, CancellationToken cancellationToken)
    {
      return account.Type == "Email"
        ? SendEmailAsync(account.Value, code, cancellationToken)
        : SendSmsAsync(account.Value, code, cancellationToken);
    }

    private async Task SendEmailAsync(string email, string code, CancellationToken cancellationToken)
    {
      if (string.IsNullOrWhiteSpace(_contactOptions.SenderEmail)
        || string.IsNullOrWhiteSpace(_contactOptions.Smtp.Host)
        || string.IsNullOrWhiteSpace(_contactOptions.Smtp.Username)
        || string.IsNullOrWhiteSpace(_contactOptions.Smtp.Password))
      {
        throw new VerificationDeliveryUnavailableException("邮箱验证码服务尚未配置。");
      }

      using var message = new MailMessage
      {
        From = new MailAddress(_contactOptions.SenderEmail, "思达启航教育"),
        Subject = "思达启航账号验证码",
        Body = $"您好，您的验证码是：{code}\r\n\r\n验证码 {_authOptions.VerificationCodeLifetimeMinutes} 分钟内有效。如非本人操作，请忽略本邮件。",
        IsBodyHtml = false,
      };
      message.To.Add(email);

      using var smtpClient = new SmtpClient(_contactOptions.Smtp.Host, _contactOptions.Smtp.Port)
      {
        EnableSsl = _contactOptions.Smtp.EnableSsl,
        UseDefaultCredentials = false,
        Credentials = new NetworkCredential(_contactOptions.Smtp.Username, _contactOptions.Smtp.Password),
      };

      await smtpClient.SendMailAsync(message, cancellationToken);
    }

    private async Task SendSmsAsync(string phoneNumber, string code, CancellationToken cancellationToken)
    {
      var sms = _authOptions.Sms;
      if (string.IsNullOrWhiteSpace(sms.AccessKeyId)
        || string.IsNullOrWhiteSpace(sms.AccessKeySecret)
        || string.IsNullOrWhiteSpace(sms.SignName)
        || string.IsNullOrWhiteSpace(sms.TemplateCode))
      {
        throw new VerificationDeliveryUnavailableException("短信验证码服务尚未配置。");
      }

      var parameters = new SortedDictionary<string, string>(StringComparer.Ordinal)
      {
        ["AccessKeyId"] = sms.AccessKeyId,
        ["Action"] = "SendSms",
        ["Format"] = "JSON",
        ["PhoneNumbers"] = phoneNumber.StartsWith("+86", StringComparison.Ordinal) ? phoneNumber[3..] : phoneNumber.TrimStart('+'),
        ["RegionId"] = "cn-hangzhou",
        ["SignName"] = sms.SignName,
        ["SignatureMethod"] = "HMAC-SHA1",
        ["SignatureNonce"] = Guid.NewGuid().ToString("N"),
        ["SignatureVersion"] = "1.0",
        ["TemplateCode"] = sms.TemplateCode,
        ["TemplateParam"] = JsonSerializer.Serialize(new { code }),
        ["Timestamp"] = DateTime.UtcNow.ToString("yyyy-MM-dd'T'HH:mm:ss'Z'", CultureInfo.InvariantCulture),
        ["Version"] = "2017-05-25",
      };

      var canonicalQuery = string.Join("&", parameters.Select(pair => $"{PercentEncode(pair.Key)}={PercentEncode(pair.Value)}"));
      var stringToSign = $"POST&%2F&{PercentEncode(canonicalQuery)}";
      using var hmac = new HMACSHA1(Encoding.UTF8.GetBytes($"{sms.AccessKeySecret}&"));
      var signature = Convert.ToBase64String(hmac.ComputeHash(Encoding.UTF8.GetBytes(stringToSign)));

      var form = new Dictionary<string, string>(parameters)
      {
        ["Signature"] = signature,
      };

      using var request = new HttpRequestMessage(HttpMethod.Post, "https://dysmsapi.aliyuncs.com/")
      {
        Content = new FormUrlEncodedContent(form),
      };
      using var response = await _httpClientFactory.CreateClient("AliyunSms").SendAsync(request, cancellationToken);
      var responseBody = await response.Content.ReadAsStringAsync(cancellationToken);
      if (!response.IsSuccessStatusCode)
      {
        throw new VerificationDeliveryUnavailableException("短信验证码发送失败，请稍后重试。");
      }

      using var document = JsonDocument.Parse(responseBody);
      var responseCode = document.RootElement.TryGetProperty("Code", out var codeElement)
        ? codeElement.GetString()
        : null;
      if (!string.Equals(responseCode, "OK", StringComparison.OrdinalIgnoreCase))
      {
        throw new VerificationDeliveryUnavailableException("短信验证码发送失败，请检查短信服务配置。");
      }
    }

    private static string PercentEncode(string value)
    {
      return Uri.EscapeDataString(value)
        .Replace("+", "%20", StringComparison.Ordinal)
        .Replace("*", "%2A", StringComparison.Ordinal)
        .Replace("%7E", "~", StringComparison.Ordinal);
    }
  }

  public sealed class VerificationDeliveryUnavailableException : Exception
  {
    public VerificationDeliveryUnavailableException(string message) : base(message)
    {
    }
  }
}

using System.Net;
using System.Net.Mail;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using XiaoJuanSchoolPayment.Server.Data.Config;
using XiaoJuanSchoolPayment.Server.Data.DTO;

namespace XiaoJuanSchoolPayment.Server.Controllers;

[ApiController]
[AllowAnonymous]
[Route("contact-form")]
public class ContactFormController : ControllerBase
{
  private readonly ContactFormOptions _options;
  private readonly ILogger<ContactFormController> _logger;

  public ContactFormController(
    IOptions<ContactFormOptions> options,
    ILogger<ContactFormController> logger)
  {
    _options = options.Value;
    _logger = logger;
  }

  [HttpPost("send")]
  public async Task<IActionResult> Send([FromBody] ContactFormRequestDTO request, CancellationToken ct)
  {
    if (!ModelState.IsValid)
    {
      return ValidationProblem(ModelState);
    }

    if (!HasRequiredValues(request))
    {
      return BadRequest(new { message = "Name, email, phone, WeChat, and message are required." });
    }

    if (!HasEmailConfiguration())
    {
      _logger.LogError("Contact form email settings are incomplete.");
      return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Email settings are incomplete." });
    }

    try
    {
      using var mailMessage = CreateMailMessage(request);
      using var smtpClient = new SmtpClient(_options.Smtp.Host, _options.Smtp.Port)
      {
        EnableSsl = _options.Smtp.EnableSsl,
        UseDefaultCredentials = false,
        Credentials = new NetworkCredential(_options.Smtp.Username, _options.Smtp.Password),
      };

      await smtpClient.SendMailAsync(mailMessage, ct);
      return Ok(new { message = "Contact request sent." });
    }
    catch (Exception ex)
    {
      _logger.LogError(ex, "Failed to send contact form email.");
      return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Unable to send contact request." });
    }
  }

  private MailMessage CreateMailMessage(ContactFormRequestDTO request)
  {
    var cleanName = ToSingleLine(request.Name);
    var safeName = WebUtility.HtmlEncode(cleanName);
    var safeEmail = WebUtility.HtmlEncode(request.Email.Trim());
    var safePhone = WebUtility.HtmlEncode(request.Phone.Trim());
    var safeWechat = WebUtility.HtmlEncode(ToSingleLine(request.Wechat));
    var safeMessage = WebUtility.HtmlEncode(request.Message.Trim()).Replace("\n", "<br />");

    var body = new StringBuilder()
      .AppendLine("<h2>官网需求表单</h2>")
      .AppendLine("<p>有新的用户通过思达启航官网提交咨询需求。</p>")
      .AppendLine("<table cellpadding=\"8\" cellspacing=\"0\" style=\"border-collapse:collapse;\">")
      .AppendLine($"<tr><td><strong>姓名</strong></td><td>{safeName}</td></tr>")
      .AppendLine($"<tr><td><strong>邮箱</strong></td><td>{safeEmail}</td></tr>")
      .AppendLine($"<tr><td><strong>电话</strong></td><td>{safePhone}</td></tr>")
      .AppendLine($"<tr><td><strong>微信号</strong></td><td>{safeWechat}</td></tr>")
      .AppendLine($"<tr><td><strong>留言</strong></td><td>{safeMessage}</td></tr>")
      .AppendLine("</table>")
      .ToString();

    var mailMessage = new MailMessage
    {
      From = new MailAddress(_options.SenderEmail, "思达启航官网"),
      Subject = $"官网咨询需求 - {cleanName}",
      Body = body,
      IsBodyHtml = true,
    };

    mailMessage.To.Add(_options.RecipientEmail);
    mailMessage.ReplyToList.Add(new MailAddress(request.Email.Trim(), cleanName));

    return mailMessage;
  }

  private static bool HasRequiredValues(ContactFormRequestDTO request)
  {
    return !string.IsNullOrWhiteSpace(request.Name)
      && !string.IsNullOrWhiteSpace(request.Email)
      && !string.IsNullOrWhiteSpace(request.Phone)
      && !string.IsNullOrWhiteSpace(request.Wechat)
      && !string.IsNullOrWhiteSpace(request.Message);
  }

  private static string ToSingleLine(string value)
  {
    return value.Trim().Replace("\r", " ").Replace("\n", " ");
  }

  private bool HasEmailConfiguration()
  {
    return !string.IsNullOrWhiteSpace(_options.RecipientEmail)
      && !string.IsNullOrWhiteSpace(_options.SenderEmail)
      && !string.IsNullOrWhiteSpace(_options.Smtp.Host)
      && !string.IsNullOrWhiteSpace(_options.Smtp.Username)
      && !string.IsNullOrWhiteSpace(_options.Smtp.Password)
      && _options.Smtp.Port > 0;
  }
}

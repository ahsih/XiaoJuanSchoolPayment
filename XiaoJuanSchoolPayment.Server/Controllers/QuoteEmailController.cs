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
[Route("quote-email")]
public class QuoteEmailController : ControllerBase
{
  private const long MaxImageBytes = 12_000_000;
  private const long MaxMultipartBodyBytes = 14_000_000;

  private readonly ContactFormOptions _options;
  private readonly ILogger<QuoteEmailController> _logger;

  public QuoteEmailController(
    IOptions<ContactFormOptions> options,
    ILogger<QuoteEmailController> logger)
  {
    _options = options.Value;
    _logger = logger;
  }

  [HttpPost("send")]
  [Consumes("multipart/form-data")]
  [RequestSizeLimit(MaxMultipartBodyBytes)]
  [RequestFormLimits(MultipartBodyLengthLimit = MaxMultipartBodyBytes)]
  public async Task<IActionResult> Send([FromForm] QuoteEmailRequestDTO request, CancellationToken ct)
  {
    if (!ModelState.IsValid)
    {
      return ValidationProblem(ModelState);
    }

    if (request.Image is null || request.Image.Length == 0)
    {
      return BadRequest(new { message = "报价单图片内容为空，请重新生成后再试。" });
    }

    if (request.Image.Length > MaxImageBytes)
    {
      return BadRequest(new { message = "报价单图片过大，请重新生成后再试。" });
    }

    if (!HasEmailConfiguration())
    {
      _logger.LogError("Quote email settings are incomplete.");
      return StatusCode(StatusCodes.Status500InternalServerError, new { message = "邮件配置不完整，请联系顾问发送报价单。" });
    }

    using var imageMemoryStream = new MemoryStream();
    await request.Image.CopyToAsync(imageMemoryStream, ct);
    var imageBytes = imageMemoryStream.ToArray();

    try
    {
      using var mailMessage = CreateMailMessage(request, imageBytes);
      using var smtpClient = new SmtpClient(_options.Smtp.Host, _options.Smtp.Port)
      {
        EnableSsl = _options.Smtp.EnableSsl,
        UseDefaultCredentials = false,
        Credentials = new NetworkCredential(_options.Smtp.Username, _options.Smtp.Password),
      };

      await smtpClient.SendMailAsync(mailMessage, ct);
      return Ok(new { message = "报价单图片已发送。" });
    }
    catch (Exception ex)
    {
      _logger.LogError(ex, "Failed to send quote image email to {Email}.", request.Email);
      return StatusCode(StatusCodes.Status500InternalServerError, new { message = "报价单邮件发送失败，请稍后重试或联系顾问。" });
    }
  }

  private MailMessage CreateMailMessage(QuoteEmailRequestDTO request, byte[] imageBytes)
  {
    var schoolName = ToSingleLine(request.SchoolName ?? "思达启航报价单");
    var summary = ToSingleLine(request.Summary ?? string.Empty);
    var safeSchoolName = WebUtility.HtmlEncode(schoolName);
    var safeSummary = WebUtility.HtmlEncode(summary);
    var attachmentName = GetAttachmentFileName(request.FileName);
    var imageStream = new MemoryStream(imageBytes);

    var body = new StringBuilder()
      .AppendLine("<h2>思达启航参考报价单</h2>")
      .AppendLine($"<p>您好，附件是您在思达启航网站生成的 <strong>{safeSchoolName}</strong> 图片报价单。</p>")
      .AppendLine(string.IsNullOrWhiteSpace(summary) ? string.Empty : $"<p>{safeSummary}</p>")
      .AppendLine("<p>本报价为参考估算，最终以学校最新报价、空房、优惠及思达启航顾问确认为准。</p>")
      .ToString();

    var mailMessage = new MailMessage
    {
      From = new MailAddress(_options.SenderEmail, "思达启航教育"),
      Subject = $"{schoolName} 参考报价单",
      Body = body,
      IsBodyHtml = true,
      BodyEncoding = Encoding.UTF8,
      SubjectEncoding = Encoding.UTF8,
    };

    mailMessage.To.Add(new MailAddress(request.Email.Trim()));
    mailMessage.Attachments.Add(new Attachment(imageStream, attachmentName, "image/png"));

    return mailMessage;
  }

  private bool HasEmailConfiguration()
  {
    return !string.IsNullOrWhiteSpace(_options.SenderEmail)
      && !string.IsNullOrWhiteSpace(_options.Smtp.Host)
      && !string.IsNullOrWhiteSpace(_options.Smtp.Username)
      && !string.IsNullOrWhiteSpace(_options.Smtp.Password)
      && _options.Smtp.Port > 0;
  }

  private static string GetAttachmentFileName(string fileName)
  {
    var cleanName = Path.GetFileName(ToSingleLine(fileName));

    if (string.IsNullOrWhiteSpace(cleanName))
    {
      cleanName = "quote-image.png";
    }

    foreach (var invalidChar in Path.GetInvalidFileNameChars())
    {
      cleanName = cleanName.Replace(invalidChar, '-');
    }

    if (!cleanName.EndsWith(".png", StringComparison.OrdinalIgnoreCase))
    {
      cleanName += ".png";
    }

    return cleanName.Length > 160 ? cleanName[^160..] : cleanName;
  }

  private static string ToSingleLine(string value)
  {
    return value.Trim().Replace("\r", " ").Replace("\n", " ");
  }
}

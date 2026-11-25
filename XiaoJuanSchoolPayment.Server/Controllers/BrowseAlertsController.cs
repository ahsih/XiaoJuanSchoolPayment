using System.Security.Claims;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using XiaoJuanSchoolPayment.Server.Data;
using XiaoJuanSchoolPayment.Server.Data.DTO;
using XiaoJuanSchoolPayment.Server.Data.Models;
using XiaoJuanSchoolPayment.Server.Services.BrowseAlerts;
using XiaoJuanSchoolPayment.Server.Services.Security;

namespace XiaoJuanSchoolPayment.Server.Controllers
{
  /// <summary>
  /// Student browse reminders: employees make a personal link for one student; the website reports
  /// each school page that student opens (POST view), and the consultant gets a WeCom message (an app
  /// message to their own account, or the group robot). Owner Admins set the robots, each consultant's
  /// WeCom account and the WeCom app. The WeCom chat sidebar is BrowseAlertSidebarController.
  /// </summary>
  [ApiController]
  [Authorize(Roles = "Admin,Manager,Staff")]
  [ResponseCache(NoStore = true, Location = ResponseCacheLocation.None)]
  [Route("browse-alerts")]
  public partial class BrowseAlertsController : ControllerBase
  {
    /// <summary>Repeating the same page within this time (a refresh, going back) records the view but sends no reminder.</summary>
    private static readonly TimeSpan RepeatWindow = TimeSpan.FromMinutes(10);
    /// <summary>At most this many reminders per link per hour, in case a link is passed around.</summary>
    private const int MaxRemindersPerHour = 30;

    private readonly AppDbContext _context;
    private readonly BrowsePageCatalog _catalog;
    private readonly BrowseAlertQueue _queue;
    private readonly WeComWebhook _webhook;
    private readonly WeComApp _app;

    public BrowseAlertsController(
      AppDbContext context, BrowsePageCatalog catalog, BrowseAlertQueue queue, WeComWebhook webhook, WeComApp app)
    {
      _context = context;
      _catalog = catalog;
      _queue = queue;
      _webhook = webhook;
      _app = app;
    }

    [HttpPost("view")]
    [AllowAnonymous]
    [EnableRateLimiting(AbuseRateLimits.BrowseViewPolicy)]
    public async Task<ActionResult<BrowseAlertViewResponseDTO>> RecordView(
      [FromBody] BrowseAlertViewRequestDTO request, CancellationToken cancellationToken)
    {
      var code = request.Code?.Trim().ToLowerInvariant();
      if (!BrowseAlertCodes.IsValid(code))
      {
        return Ok(new BrowseAlertViewResponseDTO { Active = false });
      }

      var link = await _context.BrowseAlertLinks.FirstOrDefaultAsync(x => x.Code == code, cancellationToken);
      if (link == null || link.RevokedAt != null)
      {
        return Ok(new BrowseAlertViewResponseDTO { Active = false });
      }

      var response = new BrowseAlertViewResponseDTO { Active = true, ConsultantName = link.ConsultantName };
      var path = BrowsePageCatalog.NormalizePath(request.Path);
      if (path == null || !_catalog.TryGetName(path, out var pageName))
      {
        return Ok(response);
      }

      var now = DateTime.UtcNow;
      var repeatSince = now - RepeatWindow;
      var hourAgo = now.AddHours(-1);
      var repeated = await _context.BrowseAlertViews.AnyAsync(
        x => x.BrowseAlertLinkId == link.Id && x.Path == path && x.ViewedAt >= repeatSince, cancellationToken);
      var remindersLastHour = repeated ? 0 : await _context.BrowseAlertViews.CountAsync(
        x => x.BrowseAlertLinkId == link.Id && x.Notified && x.ViewedAt >= hourAgo, cancellationToken);

      var view = new BrowseAlertView
      {
        Id = Guid.NewGuid(),
        BrowseAlertLinkId = link.Id,
        Path = path,
        PageName = pageName,
        ViewedAt = now,
        Notified = !repeated && remindersLastHour < MaxRemindersPerHour,
      };
      _context.BrowseAlertViews.Add(view);
      link.ViewCount += 1;
      link.LastViewedAt = now;
      await _context.SaveChangesAsync(cancellationToken);

      if (view.Notified)
      {
        _queue.TryEnqueue(view.Id);
      }

      return Ok(response);
    }

    [HttpGet("pages")]
    public ActionResult<IList<BrowseAlertPageDTO>> GetPages()
    {
      return Ok(_catalog.All()
        .OrderBy(x => x.Path, StringComparer.Ordinal)
        .Select(x => new BrowseAlertPageDTO { Path = x.Path, Name = x.Name })
        .ToList());
    }

    [HttpGet("links")]
    public async Task<ActionResult<IList<BrowseAlertLinkDTO>>> GetLinks(CancellationToken cancellationToken)
    {
      var links = await _context.BrowseAlertLinks.AsNoTracking()
        .OrderByDescending(x => x.LastViewedAt ?? x.CreatedAt)
        .Take(500)
        .Select(x => new
        {
          Link = x,
          LastPageName = x.Views.OrderByDescending(v => v.ViewedAt).Select(v => v.PageName).FirstOrDefault(),
        })
        .ToListAsync(cancellationToken);

      return Ok(links.Select(x => ToDto(x.Link, x.LastPageName)).ToList());
    }

    [HttpPost("links")]
    public async Task<ActionResult<BrowseAlertLinkDTO>> CreateLink(
      [FromBody] SaveBrowseAlertLinkDTO request, CancellationToken cancellationToken)
    {
      var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
      if (string.IsNullOrWhiteSpace(userId)) return Unauthorized();

      var error = Validate(request, out var studentName, out var consultantName, out var landingPath);
      if (error != null) return BadRequest(new { message = error });

      var code = await BrowseAlertCodes.NewCodeAsync(_context, cancellationToken);
      var link = new BrowseAlertLink
      {
        Id = Guid.NewGuid(),
        Code = code,
        StudentName = studentName,
        ConsultantName = consultantName,
        Note = CleanNote(request.Note),
        LandingPath = landingPath,
        CreatedByUserId = userId,
        CreatedAt = DateTime.UtcNow,
      };
      _context.BrowseAlertLinks.Add(link);
      await _context.SaveChangesAsync(cancellationToken);
      return Ok(ToDto(link, lastPageName: null));
    }

    [HttpPut("links/{id:guid}")]
    public async Task<ActionResult<BrowseAlertLinkDTO>> UpdateLink(
      Guid id, [FromBody] SaveBrowseAlertLinkDTO request, CancellationToken cancellationToken)
    {
      var link = await _context.BrowseAlertLinks.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
      if (link == null) return NotFound();

      var error = Validate(request, out var studentName, out var consultantName, out var landingPath);
      if (error != null) return BadRequest(new { message = error });

      link.StudentName = studentName;
      link.ConsultantName = consultantName;
      link.Note = CleanNote(request.Note);
      link.LandingPath = landingPath;
      if (request.Active == false && link.RevokedAt == null) link.RevokedAt = DateTime.UtcNow;
      if (request.Active == true) link.RevokedAt = null;
      await _context.SaveChangesAsync(cancellationToken);

      var lastPageName = await _context.BrowseAlertViews.AsNoTracking()
        .Where(x => x.BrowseAlertLinkId == id)
        .OrderByDescending(x => x.ViewedAt)
        .Select(x => x.PageName)
        .FirstOrDefaultAsync(cancellationToken);
      return Ok(ToDto(link, lastPageName));
    }

    /// <summary>Deletes the link and its whole browse history, for example when a student asks for it.</summary>
    [HttpDelete("links/{id:guid}")]
    public async Task<IActionResult> DeleteLink(Guid id, CancellationToken cancellationToken)
    {
      var link = await _context.BrowseAlertLinks.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
      if (link == null) return NotFound();
      _context.BrowseAlertLinks.Remove(link);
      await _context.SaveChangesAsync(cancellationToken);
      return NoContent();
    }

    [HttpGet("links/{id:guid}/views")]
    public async Task<ActionResult<IList<BrowseAlertViewDTO>>> GetViews(Guid id, CancellationToken cancellationToken)
    {
      var views = await _context.BrowseAlertViews.AsNoTracking()
        .Where(x => x.BrowseAlertLinkId == id)
        .OrderByDescending(x => x.ViewedAt)
        .Take(200)
        .ToListAsync(cancellationToken);

      return Ok(views.Select(x => new BrowseAlertViewDTO
      {
        Path = x.Path,
        PageName = x.PageName,
        ViewedAt = AsUtc(x.ViewedAt),
        Notified = x.Notified,
      }).ToList());
    }

    [HttpGet("channels")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IList<BrowseAlertChannelDTO>>> GetChannels(CancellationToken cancellationToken)
    {
      var channels = await _context.BrowseAlertChannels.AsNoTracking().ToListAsync(cancellationToken);
      return Ok(channels.Select(ToDto).ToList());
    }

    [HttpPut("channels")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<BrowseAlertChannelDTO>> SaveChannel(
      [FromBody] SaveBrowseAlertChannelDTO request, CancellationToken cancellationToken)
    {
      var name = request.ConsultantName.Trim();
      if (name != BrowseAlertChannel.DefaultName && !ConsultantPattern().IsMatch(name))
      {
        return BadRequest(new { message = "顾问名称无效。" });
      }

      string? webhook = null;
      if (!string.IsNullOrWhiteSpace(request.WebhookUrl))
      {
        webhook = WeComWebhook.NormalizeUrl(request.WebhookUrl);
        if (webhook == null)
        {
          return BadRequest(new { message = $"请粘贴企业微信群机器人的完整地址（以 {WeComWebhook.UrlPrefix} 开头）。" });
        }
      }

      string? mention = null;
      if (!string.IsNullOrWhiteSpace(request.Mention))
      {
        mention = WeComWebhook.NormalizeMention(request.Mention);
        if (mention == null) return BadRequest(new { message = "请填写顾问的企业微信手机号或账号。" });
      }

      string? weComUserId = null;
      if (name != BrowseAlertChannel.DefaultName && !string.IsNullOrWhiteSpace(request.WeComUserId))
      {
        weComUserId = WeComApp.NormalizeUserId(request.WeComUserId);
        if (weComUserId == null) return BadRequest(new { message = "企业微信账号只能有字母、数字和 _ . @ -。" });
      }

      var channel = await _context.BrowseAlertChannels.FirstOrDefaultAsync(x => x.ConsultantName == name, cancellationToken);
      if (channel == null)
      {
        channel = new BrowseAlertChannel { ConsultantName = name };
        _context.BrowseAlertChannels.Add(channel);
      }

      // Null keeps the saved robot; an empty string removes it.
      if (request.WebhookUrl != null) channel.WebhookUrl = webhook;
      channel.Mention = mention;
      channel.WeComUserId = weComUserId;
      channel.UpdatedAt = DateTime.UtcNow;
      channel.UpdatedByUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
      await _context.SaveChangesAsync(cancellationToken);
      return Ok(ToDto(channel));
    }

    [HttpPost("channels/test")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> TestChannel([FromBody] BrowseAlertTestDTO request, CancellationToken cancellationToken)
    {
      var name = request.ConsultantName.Trim();
      var route = await BrowseAlertSender.ResolveChannelAsync(_context, name, cancellationToken);
      var who = name == BrowseAlertChannel.DefaultName ? "共用群" : name;

      string? appError = null;
      if (name != BrowseAlertChannel.DefaultName && route.WeComUserId != null
        && await WeComAppConfig.LoadAsync(_context, cancellationToken) is { } app)
      {
        var (sent, error) = await _app.SendTextAsync(
          app, route.WeComUserId, $"【学生浏览提醒】测试消息：{who}的学生浏览提醒会直接发到这里。", cancellationToken);
        if (sent) return Ok(new { message = $"测试消息已发到{who}本人的企业微信（应用消息）。" });
        appError = error;
      }

      if (route.WebhookUrl == null)
      {
        return BadRequest(new { message = appError ?? "还没有设置企业微信应用或群机器人。" });
      }
      var (ok, message) = await _webhook.SendTextAsync(
        route.WebhookUrl, $"【学生浏览提醒】测试消息：{who}的提醒会发到这里。", route.Mention, cancellationToken);
      if (!ok) return BadRequest(new { message = appError == null ? message : $"{appError} 群机器人也没发出去：{message}" });
      return Ok(new { message = appError == null
        ? "测试消息已发送，请到企业微信群里查看。"
        : $"发给本人没成功（{appError}），已改发到企业微信群。" });
    }

    [HttpGet("wecom-app")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<WeComAppSettingDTO>> GetWeComApp(CancellationToken cancellationToken)
    {
      var setting = await _context.WeComAppSettings.AsNoTracking()
        .FirstOrDefaultAsync(x => x.Id == WeComAppSetting.DefaultId, cancellationToken);
      return Ok(ToDto(setting));
    }

    /// <summary>Saves the WeCom app and, when it is complete, checks the corp id and secret with WeCom.</summary>
    [HttpPut("wecom-app")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<WeComAppSettingDTO>> SaveWeComApp(
      [FromBody] SaveWeComAppSettingDTO request, CancellationToken cancellationToken)
    {
      var corpId = request.CorpId?.Trim();
      if (!string.IsNullOrEmpty(corpId) && !WeComApp.IsCorpId(corpId))
      {
        return BadRequest(new { message = "企业ID（CorpID）格式不对，一般是 ww 开头的一串字母和数字。" });
      }
      if (request.AgentId is { } agentId && agentId <= 0)
      {
        return BadRequest(new { message = "AgentId 是应用详情页上的一串数字。" });
      }
      var secret = request.Secret?.Trim();
      if (!string.IsNullOrEmpty(secret) && (secret.Length < 16 || secret.Any(char.IsWhiteSpace)))
      {
        return BadRequest(new { message = "Secret 格式不对，请到应用详情页重新复制。" });
      }

      var setting = await _context.WeComAppSettings.FirstOrDefaultAsync(x => x.Id == WeComAppSetting.DefaultId, cancellationToken);
      if (setting == null)
      {
        setting = new WeComAppSetting { Id = WeComAppSetting.DefaultId };
        _context.WeComAppSettings.Add(setting);
      }
      setting.CorpId = string.IsNullOrEmpty(corpId) ? null : corpId;
      setting.AgentId = request.AgentId;
      // Null keeps the saved secret; an empty string removes it.
      if (request.Secret != null) setting.Secret = string.IsNullOrEmpty(secret) ? null : secret;
      setting.UpdatedAt = DateTime.UtcNow;
      setting.UpdatedByUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
      await _context.SaveChangesAsync(cancellationToken);

      var dto = ToDto(setting);
      if (WeComAppConfig.From(setting) is { } config)
      {
        var (ok, message) = await _app.CheckAsync(config, cancellationToken);
        dto.CheckOk = ok;
        dto.CheckMessage = message;
      }
      return Ok(dto);
    }

    private string? Validate(SaveBrowseAlertLinkDTO request, out string studentName, out string consultantName, out string landingPath)
    {
      studentName = request.StudentName.Trim();
      consultantName = request.ConsultantName.Trim();
      landingPath = BrowsePageCatalog.NormalizePath(request.LandingPath) ?? string.Empty;

      if (studentName.Length == 0) return "请填写学生名字。";
      if (studentName.Length > 60) return "学生名字太长。";
      if (!ConsultantPattern().IsMatch(consultantName)
        || string.Equals(consultantName, BrowseAlertChannel.DefaultName, StringComparison.OrdinalIgnoreCase))
      {
        return "请选择顾问。";
      }
      if (!_catalog.TryGetName(landingPath, out _)) return "请选择要发给学生的学校页面。";
      return null;
    }

    private static string? CleanNote(string? note)
    {
      var trimmed = note?.Trim();
      if (string.IsNullOrEmpty(trimmed)) return null;
      return trimmed.Length > 300 ? trimmed[..300] : trimmed;
    }

    private BrowseAlertLinkDTO ToDto(BrowseAlertLink link, string? lastPageName)
    {
      _catalog.TryGetName(link.LandingPath, out var landingName);
      return new BrowseAlertLinkDTO
      {
        Id = link.Id,
        Code = link.Code,
        StudentName = link.StudentName,
        ConsultantName = link.ConsultantName,
        Note = link.Note,
        LandingPath = link.LandingPath,
        LandingPageName = landingName,
        CreatedAt = AsUtc(link.CreatedAt),
        Active = link.RevokedAt == null,
        LastViewedAt = link.LastViewedAt is { } last ? AsUtc(last) : null,
        LastPageName = lastPageName,
        ViewCount = link.ViewCount,
        FromWeCom = link.WeComExternalUserId != null,
      };
    }

    private static BrowseAlertChannelDTO ToDto(BrowseAlertChannel channel)
    {
      var webhook = WeComWebhook.NormalizeUrl(channel.WebhookUrl);
      return new BrowseAlertChannelDTO
      {
        ConsultantName = channel.ConsultantName,
        HasWebhook = webhook != null,
        WebhookHint = webhook == null ? null : WeComWebhook.Hint(webhook),
        Mention = channel.Mention,
        WeComUserId = channel.WeComUserId,
      };
    }

    private static WeComAppSettingDTO ToDto(WeComAppSetting? setting)
    {
      var secret = setting?.Secret;
      return new WeComAppSettingDTO
      {
        CorpId = setting?.CorpId,
        AgentId = setting?.AgentId,
        HasSecret = !string.IsNullOrEmpty(secret),
        SecretHint = string.IsNullOrEmpty(secret) ? null : (secret.Length <= 4 ? "****" : $"****{secret[^4..]}"),
        Complete = WeComAppConfig.From(setting) != null,
      };
    }

    private static DateTime AsUtc(DateTime value) => DateTime.SpecifyKind(value, DateTimeKind.Utc);

    [GeneratedRegex("^[A-Za-z][A-Za-z ]{1,19}$")]
    private static partial Regex ConsultantPattern();
  }
}

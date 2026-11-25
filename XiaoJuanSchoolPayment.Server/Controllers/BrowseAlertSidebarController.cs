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
  /// The WeCom chat sidebar (page /wecom-sidebar, opened from the chat toolbar of a one-to-one chat with
  /// a customer). The consultant signs in through WeCom's own login (an OAuth code, no password); the
  /// page reads the current customer with the JS-SDK, and sending a school page here makes (or reuses)
  /// that student's personal link, so browse reminders follow without any back-office step. Every call
  /// is checked against WeCom: the account must be linked to a consultant in /admin/browse-alerts, and
  /// the customer must be that consultant's own.
  /// </summary>
  [ApiController]
  [AllowAnonymous]
  [EnableRateLimiting(AbuseRateLimits.WeComSidebarPolicy)]
  [ResponseCache(NoStore = true, Location = ResponseCacheLocation.None)]
  [Route("browse-alerts/sidebar")]
  public partial class BrowseAlertSidebarController : ControllerBase
  {
    public const string PagePath = "/wecom-sidebar";
    private const string CardDescription = "思达启航为你整理的学校介绍，点开查看课程、住宿和费用。";

    private readonly AppDbContext _context;
    private readonly BrowsePageCatalog _catalog;
    private readonly WeComApp _app;
    private readonly WeComSidebarSessions _sessions;
    private readonly IConfiguration _configuration;

    public BrowseAlertSidebarController(
      AppDbContext context,
      BrowsePageCatalog catalog,
      WeComApp app,
      WeComSidebarSessions sessions,
      IConfiguration configuration)
    {
      _context = context;
      _catalog = catalog;
      _app = app;
      _sessions = sessions;
      _configuration = configuration;
    }

    [HttpGet("config")]
    public async Task<ActionResult<WeComSidebarConfigDTO>> GetConfig(CancellationToken cancellationToken)
    {
      var app = await WeComAppConfig.LoadAsync(_context, cancellationToken);
      return Ok(new WeComSidebarConfigDTO { Enabled = app != null, CorpId = app?.CorpId, AgentId = app?.AgentId });
    }

    /// <summary>Turns WeCom's login code into a sidebar session for the consultant linked to that account.</summary>
    [HttpPost("session")]
    public async Task<ActionResult<WeComSidebarSessionDTO>> SignIn(
      [FromBody] WeComSidebarSessionRequestDTO request, CancellationToken cancellationToken)
    {
      var code = request.Code?.Trim();
      if (string.IsNullOrEmpty(code) || !OAuthCodePattern().IsMatch(code))
      {
        return BadRequest(new { message = "登录信息无效，请关掉侧边栏再重新打开。" });
      }
      var app = await WeComAppConfig.LoadAsync(_context, cancellationToken);
      if (app == null) return NotConfigured();

      var (userId, error) = await _app.GetUserIdFromCodeAsync(app, code, cancellationToken);
      if (userId == null) return BadRequest(new { message = error });

      var channels = await _context.BrowseAlertChannels.AsNoTracking()
        .Where(x => x.WeComUserId != null && x.ConsultantName != BrowseAlertChannel.DefaultName)
        .ToListAsync(cancellationToken);
      var consultant = channels
        .FirstOrDefault(x => string.Equals(x.WeComUserId?.Trim(), userId, StringComparison.OrdinalIgnoreCase))
        ?.ConsultantName;

      return Ok(new WeComSidebarSessionDTO
      {
        WeComUserId = userId,
        ConsultantName = consultant,
        Token = consultant == null ? null : _sessions.Create(userId, consultant),
      });
    }

    /// <summary>wx.config and wx.agentConfig signatures for the sidebar page itself.</summary>
    [HttpPost("signature")]
    public async Task<ActionResult<WeComSidebarSignatureDTO>> Sign(
      [FromBody] WeComSidebarSignatureRequestDTO request, CancellationToken cancellationToken)
    {
      if (CurrentSession() == null) return SessionExpired();
      var url = request.Url?.Trim();
      if (string.IsNullOrEmpty(url)
        || !Uri.TryCreate(url, UriKind.Absolute, out var uri)
        || (uri.Scheme != Uri.UriSchemeHttps && uri.Scheme != Uri.UriSchemeHttp)
        || !string.Equals(uri.AbsolutePath.TrimEnd('/'), PagePath, StringComparison.Ordinal)
        || url.Contains('#'))
      {
        return BadRequest(new { message = "页面地址无效。" });
      }

      var app = await WeComAppConfig.LoadAsync(_context, cancellationToken);
      if (app == null) return NotConfigured();
      var (signature, error) = await _app.SignAsync(app, url, cancellationToken);
      if (signature == null) return BadRequest(new { message = error });

      return Ok(new WeComSidebarSignatureDTO
      {
        CorpId = app.CorpId,
        AgentId = app.AgentId,
        Timestamp = signature.Timestamp,
        NonceStr = signature.NonceStr,
        ConfigSignature = signature.ConfigSignature,
        AgentSignature = signature.AgentSignature,
      });
    }

    [HttpGet("pages")]
    public ActionResult<IList<BrowseAlertPageDTO>> GetPages()
    {
      if (CurrentSession() == null) return SessionExpired();
      return Ok(_catalog.All()
        .OrderBy(x => x.Path, StringComparer.Ordinal)
        .Select(x => new BrowseAlertPageDTO { Path = x.Path, Name = x.Name })
        .ToList());
    }

    /// <summary>The student in the current chat: name, and what they opened through their link so far.</summary>
    [HttpPost("contact")]
    public async Task<ActionResult<WeComSidebarContactDTO>> GetContact(
      [FromBody] WeComSidebarContactRequestDTO request, CancellationToken cancellationToken)
    {
      var session = CurrentSession();
      if (session == null) return SessionExpired();
      var externalUserId = request.ExternalUserId?.Trim();
      var (weChatName, problem) = await CheckContactAsync(session, externalUserId, cancellationToken);
      if (problem != null) return problem;

      var link = await FindLinkAsync(session, externalUserId!, cancellationToken);
      var views = link == null
        ? new List<BrowseAlertView>()
        : await _context.BrowseAlertViews.AsNoTracking()
          .Where(x => x.BrowseAlertLinkId == link.Id)
          .OrderByDescending(x => x.ViewedAt)
          .Take(8)
          .ToListAsync(cancellationToken);

      return Ok(new WeComSidebarContactDTO
      {
        StudentName = link?.StudentName ?? weChatName!,
        HasLink = link != null,
        LinkActive = link?.RevokedAt == null,
        ViewCount = link?.ViewCount ?? 0,
        RecentViews = views.Select(x => new BrowseAlertViewDTO
        {
          Path = x.Path,
          PageName = x.PageName,
          ViewedAt = DateTime.SpecifyKind(x.ViewedAt, DateTimeKind.Utc),
          Notified = x.Notified,
        }).ToList(),
      });
    }

    /// <summary>Makes or reuses the student's personal link and returns the card the page sends into the chat.</summary>
    [HttpPost("send")]
    public async Task<ActionResult<WeComSidebarCardDTO>> Send(
      [FromBody] WeComSidebarSendRequestDTO request, CancellationToken cancellationToken)
    {
      var session = CurrentSession();
      if (session == null) return SessionExpired();
      var path = BrowsePageCatalog.NormalizePath(request.Path);
      if (path == null || !_catalog.TryGetName(path, out var pageName))
      {
        return BadRequest(new { message = "请选择要发给学生的学校页面。" });
      }

      var externalUserId = request.ExternalUserId?.Trim();
      var (weChatName, problem) = await CheckContactAsync(session, externalUserId, cancellationToken);
      if (problem != null) return problem;

      var requestedName = request.StudentName?.Trim();
      if (requestedName?.Length > 60) requestedName = requestedName[..60];

      var link = await FindLinkAsync(session, externalUserId!, cancellationToken);
      if (link == null)
      {
        link = new BrowseAlertLink
        {
          Id = Guid.NewGuid(),
          Code = await BrowseAlertCodes.NewCodeAsync(_context, cancellationToken),
          StudentName = string.IsNullOrEmpty(requestedName) ? weChatName! : requestedName,
          ConsultantName = session.ConsultantName,
          LandingPath = path,
          WeComExternalUserId = externalUserId,
          CreatedByUserId = $"wecom:{session.WeComUserId}",
          CreatedAt = DateTime.UtcNow,
        };
        _context.BrowseAlertLinks.Add(link);
      }
      else
      {
        if (!string.IsNullOrEmpty(requestedName)) link.StudentName = requestedName;
        link.LandingPath = path;
      }
      await _context.SaveChangesAsync(cancellationToken);

      // A link switched off in the back office stays off: the card then opens the plain page.
      var tracked = link.RevokedAt == null;
      var origin = PublicOrigin();
      var image = _catalog.ImageFor(path) ?? "/assets/sida-qihang-education-logo-rectangle.webp";
      return Ok(new WeComSidebarCardDTO
      {
        Url = tracked ? $"{origin}{path}?{BrowseAlertCodes.QueryParameter}={link.Code}" : $"{origin}{path}",
        Title = pageName,
        Description = CardDescription,
        ImageUrl = image.StartsWith("https://", StringComparison.Ordinal) ? image : $"{origin}{image}",
        Tracked = tracked,
      });
    }

    /// <summary>The customer must be the signed-in consultant's own; returns the name to use for a new link.</summary>
    private async Task<(string? WeChatName, ActionResult? Problem)> CheckContactAsync(
      WeComSidebarSession session, string? externalUserId, CancellationToken cancellationToken)
    {
      if (!WeComApp.IsExternalUserId(externalUserId))
      {
        return (null, BadRequest(new { message = "请在和学生的单聊窗口里打开侧边栏。" }));
      }
      if (session.CheckedContacts.TryGetValue(externalUserId!, out var known)) return (known, null);

      var app = await WeComAppConfig.LoadAsync(_context, cancellationToken);
      if (app == null) return (null, NotConfigured());
      var (contact, error) = await _app.GetExternalContactAsync(app, externalUserId!, cancellationToken);
      if (contact == null) return (null, BadRequest(new { message = error }));
      if (!contact.RemarksByUserId.TryGetValue(session.WeComUserId, out var remark))
      {
        return (null, StatusCode(StatusCodes.Status403Forbidden, new { message = "这位学生不是你的企业微信客户。" }));
      }

      var name = string.IsNullOrWhiteSpace(remark) ? contact.Name : remark.Trim();
      if (string.IsNullOrWhiteSpace(name)) name = "企业微信客户";
      if (name.Length > 60) name = name[..60];
      session.CheckedContacts[externalUserId!] = name;
      return (name, null);
    }

    private Task<BrowseAlertLink?> FindLinkAsync(WeComSidebarSession session, string externalUserId, CancellationToken cancellationToken)
    {
      return _context.BrowseAlertLinks
        .Where(x => x.ConsultantName == session.ConsultantName && x.WeComExternalUserId == externalUserId)
        .OrderByDescending(x => x.CreatedAt)
        .FirstOrDefaultAsync(cancellationToken);
    }

    private WeComSidebarSession? CurrentSession() => _sessions.Find(Request.Headers[WeComSidebarSessions.HeaderName].FirstOrDefault());

    private ObjectResult SessionExpired() =>
      StatusCode(StatusCodes.Status401Unauthorized, new { message = "登录已过期，请关掉侧边栏再重新打开。" });

    private ObjectResult NotConfigured() =>
      StatusCode(StatusCodes.Status503ServiceUnavailable, new { message = "企业微信应用还没设置好，请联系管理员。" });

    /// <summary>Same rule as the sitemap: the configured canonical origin, otherwise the request's own.</summary>
    private string PublicOrigin()
    {
      var configured = _configuration["Authentication:PublicOrigin"]?.Trim().TrimEnd('/');
      if (!string.IsNullOrWhiteSpace(configured) && Uri.TryCreate(configured, UriKind.Absolute, out _)) return configured;
      return $"{Request.Scheme}://{Request.Host.Value}".TrimEnd('/');
    }

    [GeneratedRegex("^[A-Za-z0-9_-]{1,512}$")]
    private static partial Regex OAuthCodePattern();
  }
}

using System.Text;
using System.Threading.Channels;
using Microsoft.EntityFrameworkCore;
using XiaoJuanSchoolPayment.Server.Data;
using XiaoJuanSchoolPayment.Server.Data.Models;

namespace XiaoJuanSchoolPayment.Server.Services.BrowseAlerts;

/// <summary>Page views waiting for their WeCom reminder, so the website's request never waits for WeCom.</summary>
public sealed class BrowseAlertQueue
{
  private readonly Channel<Guid> _views = Channel.CreateBounded<Guid>(new BoundedChannelOptions(500)
  {
    FullMode = BoundedChannelFullMode.DropWrite,
    SingleReader = true,
  });

  public bool TryEnqueue(Guid viewId) => _views.Writer.TryWrite(viewId);

  public IAsyncEnumerable<Guid> ReadAllAsync(CancellationToken cancellationToken) => _views.Reader.ReadAllAsync(cancellationToken);
}

/// <summary>Where one consultant's reminders go: their own WeCom account (app message) and/or a group robot.</summary>
public sealed record BrowseAlertRoute(string? WebhookUrl, string? Mention, string? WeComUserId);

/// <summary>
/// Sends one WeCom message per queued page view to the link's consultant: an app message to the
/// consultant's own account when the WeCom app and that account are set, otherwise (or if that fails)
/// the group robot. Once a day it deletes page views older than <see cref="RetentionDays"/> days.
/// </summary>
public sealed class BrowseAlertSender : BackgroundService
{
  public const int RetentionDays = 180;
  private static readonly TimeSpan ChinaOffset = TimeSpan.FromHours(8);

  private readonly BrowseAlertQueue _queue;
  private readonly IServiceScopeFactory _scopeFactory;
  private readonly WeComWebhook _webhook;
  private readonly WeComApp _app;
  private readonly ILogger<BrowseAlertSender> _logger;
  private DateTime _lastCleanup = DateTime.MinValue;

  public BrowseAlertSender(
    BrowseAlertQueue queue,
    IServiceScopeFactory scopeFactory,
    WeComWebhook webhook,
    WeComApp app,
    ILogger<BrowseAlertSender> logger)
  {
    _queue = queue;
    _scopeFactory = scopeFactory;
    _webhook = webhook;
    _app = app;
    _logger = logger;
  }

  protected override async Task ExecuteAsync(CancellationToken stoppingToken)
  {
    await foreach (var viewId in _queue.ReadAllAsync(stoppingToken))
    {
      try
      {
        await SendAsync(viewId, stoppingToken);
        await CleanUpIfDueAsync(stoppingToken);
      }
      catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
      {
        break;
      }
      catch (Exception ex)
      {
        _logger.LogError(ex, "Browse reminder for view {ViewId} failed.", viewId);
      }
    }
  }

  private async Task SendAsync(Guid viewId, CancellationToken cancellationToken)
  {
    using var scope = _scopeFactory.CreateScope();
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    var view = await context.BrowseAlertViews.AsNoTracking()
      .Include(x => x.BrowseAlertLink)
      .FirstOrDefaultAsync(x => x.Id == viewId, cancellationToken);
    var link = view?.BrowseAlertLink;
    if (view == null || link == null) return;

    var route = await ResolveChannelAsync(context, link.ConsultantName, cancellationToken);
    var app = route.WeComUserId != null ? await WeComAppConfig.LoadAsync(context, cancellationToken) : null;
    if (route.WebhookUrl == null && app == null)
    {
      _logger.LogInformation("No WeCom app account or robot is set for consultant {Consultant}; browse reminder skipped.", link.ConsultantName);
      return;
    }

    var todayStartUtc = ChinaDayStartUtc(view.ViewedAt);
    var timesToday = await context.BrowseAlertViews.AsNoTracking()
      .CountAsync(x => x.BrowseAlertLinkId == link.Id && x.Path == view.Path
        && x.ViewedAt >= todayStartUtc && x.ViewedAt <= view.ViewedAt, cancellationToken);
    var since = view.ViewedAt.AddDays(-7);
    var recent = await context.BrowseAlertViews.AsNoTracking()
      .Where(x => x.BrowseAlertLinkId == link.Id && x.Path != view.Path && x.ViewedAt >= since && x.ViewedAt < view.ViewedAt)
      .OrderByDescending(x => x.ViewedAt)
      .Select(x => x.PageName)
      .Take(30)
      .ToListAsync(cancellationToken);

    var content = BuildMessage(link, view, timesToday, recent.Distinct().Take(3).ToList());
    if (app != null && route.WeComUserId != null)
    {
      var (sent, error) = await _app.SendTextAsync(app, route.WeComUserId, content, cancellationToken);
      if (sent) return;
      _logger.LogWarning("WeCom app message to {Consultant} failed ({Message}); trying the group robot.", link.ConsultantName, error);
    }

    if (route.WebhookUrl == null) return;
    var (ok, message) = await _webhook.SendTextAsync(route.WebhookUrl, content, route.Mention, cancellationToken);
    if (!ok)
    {
      _logger.LogWarning("Browse reminder for {Consultant} was not delivered: {Message}", link.ConsultantName, message);
    }
  }

  /// <summary>
  /// The consultant's own robot if set, otherwise the shared one; the @ and the WeCom account always come
  /// from the consultant's row (the account doubles as the @ when no mobile number is set).
  /// </summary>
  public static async Task<BrowseAlertRoute> ResolveChannelAsync(
    AppDbContext context, string consultantName, CancellationToken cancellationToken)
  {
    var channels = await context.BrowseAlertChannels.AsNoTracking()
      .Where(x => x.ConsultantName == consultantName || x.ConsultantName == BrowseAlertChannel.DefaultName)
      .ToListAsync(cancellationToken);
    var own = channels.FirstOrDefault(x => x.ConsultantName == consultantName);
    var shared = channels.FirstOrDefault(x => x.ConsultantName == BrowseAlertChannel.DefaultName);
    var webhook = WeComWebhook.NormalizeUrl(own?.WebhookUrl) ?? WeComWebhook.NormalizeUrl(shared?.WebhookUrl);
    var weComUserId = WeComApp.NormalizeUserId(own?.WeComUserId);
    return new BrowseAlertRoute(webhook, WeComWebhook.NormalizeMention(own?.Mention) ?? weComUserId, weComUserId);
  }

  public static string BuildMessage(BrowseAlertLink link, BrowseAlertView view, int timesToday, IReadOnlyList<string> recentPages)
  {
    var text = new StringBuilder();
    text.Append("【学生浏览提醒】").Append(link.StudentName).Append(" 正在看：").Append(view.PageName).Append('\n');
    text.Append(timesToday <= 1 ? "今天第1次打开这个页面" : $"今天第{timesToday}次打开这个页面").Append('\n');
    if (recentPages.Count > 0)
    {
      text.Append("最近还看了：").Append(string.Join("、", recentPages)).Append('\n');
    }
    if (!string.IsNullOrWhiteSpace(link.Note))
    {
      text.Append("备注：").Append(link.Note.Trim()).Append('\n');
    }
    var chinaTime = DateTime.SpecifyKind(view.ViewedAt, DateTimeKind.Utc) + ChinaOffset;
    text.Append("顾问：").Append(link.ConsultantName).Append(" · ").Append(chinaTime.ToString("MM/dd HH:mm"));
    return text.ToString();
  }

  private static DateTime ChinaDayStartUtc(DateTime utc)
  {
    var china = utc + ChinaOffset;
    return china.Date - ChinaOffset;
  }

  private async Task CleanUpIfDueAsync(CancellationToken cancellationToken)
  {
    var now = DateTime.UtcNow;
    if (now - _lastCleanup < TimeSpan.FromDays(1)) return;
    _lastCleanup = now;

    using var scope = _scopeFactory.CreateScope();
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    var cutoff = now.AddDays(-RetentionDays);
    var deleted = await context.BrowseAlertViews.Where(x => x.ViewedAt < cutoff).ExecuteDeleteAsync(cancellationToken);
    if (deleted > 0)
    {
      _logger.LogInformation("Deleted {Count} browse records older than {Days} days.", deleted, RetentionDays);
    }
  }
}

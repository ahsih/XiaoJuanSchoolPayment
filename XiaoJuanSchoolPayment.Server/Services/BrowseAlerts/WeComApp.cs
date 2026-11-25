using System.Collections.Concurrent;
using System.Net.Http.Json;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json.Serialization;
using System.Text.RegularExpressions;
using Microsoft.EntityFrameworkCore;
using XiaoJuanSchoolPayment.Server.Data;
using XiaoJuanSchoolPayment.Server.Data.Models;

namespace XiaoJuanSchoolPayment.Server.Services.BrowseAlerts;

/// <summary>The saved WeCom self-built app, complete enough to call WeCom.</summary>
public sealed record WeComAppConfig(string CorpId, int AgentId, string Secret)
{
  public static async Task<WeComAppConfig?> LoadAsync(AppDbContext context, CancellationToken cancellationToken)
  {
    var setting = await context.WeComAppSettings.AsNoTracking()
      .FirstOrDefaultAsync(x => x.Id == WeComAppSetting.DefaultId, cancellationToken);
    return From(setting);
  }

  public static WeComAppConfig? From(WeComAppSetting? setting)
  {
    if (setting?.AgentId is not { } agentId || agentId <= 0) return null;
    var corpId = setting.CorpId?.Trim();
    var secret = setting.Secret?.Trim();
    if (string.IsNullOrEmpty(corpId) || string.IsNullOrEmpty(secret)) return null;
    return new WeComAppConfig(corpId, agentId, secret);
  }
}

/// <summary>A customer (external contact) and the remark each employee gave them.</summary>
public sealed record WeComExternalContact(string Name, IReadOnlyDictionary<string, string?> RemarksByUserId);

/// <summary>Signatures for wx.config (corp) and wx.agentConfig (app) on one page URL.</summary>
public sealed record WeComJsSignature(long Timestamp, string NonceStr, string ConfigSignature, string AgentSignature);

/// <summary>
/// Calls the WeCom server API (qyapi.weixin.qq.com only) for the self-built app: access token and
/// JS-SDK tickets (cached until shortly before they expire), app messages to one employee, the employee
/// behind a sidebar login code, and a customer's name and remarks.
/// </summary>
public sealed partial class WeComApp
{
  private const string ApiBase = "https://qyapi.weixin.qq.com/cgi-bin/";
  private static readonly TimeSpan RefreshMargin = TimeSpan.FromMinutes(5);

  private readonly IHttpClientFactory _httpClientFactory;
  private readonly ILogger<WeComApp> _logger;
  private readonly ConcurrentDictionary<string, (string Value, DateTime ExpiresAt)> _cache = new();
  private readonly SemaphoreSlim _refreshGate = new(1, 1);

  public WeComApp(IHttpClientFactory httpClientFactory, ILogger<WeComApp> logger)
  {
    _httpClientFactory = httpClientFactory;
    _logger = logger;
  }

  /// <summary>Accepts a WeCom account (userid): letters, digits and _ . @ -.</summary>
  public static string? NormalizeUserId(string? userId)
  {
    var trimmed = userId?.Trim();
    return !string.IsNullOrEmpty(trimmed) && UserIdPattern().IsMatch(trimmed) ? trimmed : null;
  }

  public static bool IsExternalUserId(string? value) => !string.IsNullOrEmpty(value) && ExternalUserIdPattern().IsMatch(value);

  public static bool IsCorpId(string? value) => !string.IsNullOrEmpty(value) && CorpIdPattern().IsMatch(value);

  /// <summary>Checks the corp id and secret by asking for an access token.</summary>
  public async Task<(bool Ok, string Message)> CheckAsync(WeComAppConfig config, CancellationToken cancellationToken)
  {
    var (token, error) = await GetAccessTokenAsync(config, force: true, cancellationToken);
    return token != null ? (true, "企业ID和Secret正确。") : (false, error!);
  }

  public async Task<(bool Ok, string Message)> SendTextAsync(
    WeComAppConfig config, string userId, string content, CancellationToken cancellationToken)
  {
    var body = new SendTextRequest { ToUser = userId, AgentId = config.AgentId, Text = new TextContent { Content = content } };
    var (result, error) = await CallAsync<SendResult>(config,
      (client, token) => client.PostAsJsonAsync($"{ApiBase}message/send?access_token={token}", body, cancellationToken),
      cancellationToken);
    if (result == null) return (false, error!);
    if (!string.IsNullOrEmpty(result.InvalidUser))
    {
      return (false, $"企业微信账号“{result.InvalidUser}”不存在，或不在这个应用的可见范围里。");
    }
    return (true, "已发送。");
  }

  /// <summary>The employee account behind a sidebar OAuth code, or an error message.</summary>
  public async Task<(string? UserId, string? Error)> GetUserIdFromCodeAsync(
    WeComAppConfig config, string code, CancellationToken cancellationToken)
  {
    var (result, error) = await CallAsync<UserInfoResult>(config,
      (client, token) => client.GetAsync(
        $"{ApiBase}auth/getuserinfo?access_token={token}&code={Uri.EscapeDataString(code)}", cancellationToken),
      cancellationToken);
    if (result == null) return (null, error);
    var userId = NormalizeUserId(result.UserId ?? result.LegacyUserId);
    return userId != null ? (userId, null) : (null, "只有本企业的员工才能使用这个侧边栏。");
  }

  public async Task<(WeComExternalContact? Contact, string? Error)> GetExternalContactAsync(
    WeComAppConfig config, string externalUserId, CancellationToken cancellationToken)
  {
    var (result, error) = await CallAsync<ExternalContactResult>(config,
      (client, token) => client.GetAsync(
        $"{ApiBase}externalcontact/get?access_token={token}&external_userid={Uri.EscapeDataString(externalUserId)}",
        cancellationToken),
      cancellationToken);
    if (result?.ExternalContact == null) return (null, error ?? "读取不到这位客户。");

    var remarks = new Dictionary<string, string?>(StringComparer.OrdinalIgnoreCase);
    foreach (var follow in result.FollowUser ?? [])
    {
      if (!string.IsNullOrEmpty(follow.UserId)) remarks[follow.UserId] = follow.Remark;
    }
    return (new WeComExternalContact(result.ExternalContact.Name?.Trim() ?? string.Empty, remarks), null);
  }

  public async Task<(WeComJsSignature? Signature, string? Error)> SignAsync(
    WeComAppConfig config, string url, CancellationToken cancellationToken)
  {
    var (corpTicket, corpError) = await GetTicketAsync(config, agent: false, cancellationToken);
    if (corpTicket == null) return (null, corpError);
    var (agentTicket, agentError) = await GetTicketAsync(config, agent: true, cancellationToken);
    if (agentTicket == null) return (null, agentError);

    var timestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
    var nonce = Convert.ToHexString(RandomNumberGenerator.GetBytes(8)).ToLowerInvariant();
    return (new WeComJsSignature(timestamp, nonce, Sign(corpTicket, nonce, timestamp, url), Sign(agentTicket, nonce, timestamp, url)), null);
  }

  /// <summary>WeCom JS-SDK signature: sha1 of jsapi_ticket, noncestr, timestamp and url in that order.</summary>
  public static string Sign(string ticket, string nonce, long timestamp, string url)
  {
    var text = $"jsapi_ticket={ticket}&noncestr={nonce}&timestamp={timestamp}&url={url}";
    return Convert.ToHexString(SHA1.HashData(Encoding.UTF8.GetBytes(text))).ToLowerInvariant();
  }

  /// <summary>A Chinese explanation of a WeCom error code for the person setting the app up.</summary>
  public static string Describe(int errCode, string? errMsg) => errCode switch
  {
    40013 => "企业ID（CorpID）不对，请到企业微信管理后台“我的企业”页面最下面复制。",
    40001 or 40091 or 42009 => "Secret 不对，请到应用详情页重新查看并复制 Secret。",
    40056 or 301002 => "AgentId 不对，请到应用详情页复制。",
    60020 => "服务器IP还没加到这个应用的“企业可信IP”里" + (FromIpPattern().Match(errMsg ?? string.Empty) is { Success: true } match
      ? $"，请把 {match.Groups[1].Value} 加进去。"
      : "。"),
    48002 => "这个应用没有调用这个接口的权限：请在“客户联系 → API”里把它加到“可调用接口的应用”，并把顾问加进应用可见范围。",
    81013 or 60111 or 46004 => "这位顾问的企业微信账号不对，或不在这个应用的可见范围里。",
    84061 => "这位学生不是当前顾问的企业微信客户。",
    40029 or 40163 or 50001 => "登录信息已失效，请关掉侧边栏再重新打开。",
    45009 or 45033 => "企业微信调用太频繁，请稍后再试。",
    _ => $"企业微信返回错误 {errCode}：{errMsg}",
  };

  private async Task<(string? Ticket, string? Error)> GetTicketAsync(WeComAppConfig config, bool agent, CancellationToken cancellationToken)
  {
    var key = CacheKey(agent ? "agent-ticket" : "corp-ticket", config);
    if (TryGetCached(key, out var cached)) return (cached, null);

    await _refreshGate.WaitAsync(cancellationToken);
    try
    {
      if (TryGetCached(key, out cached)) return (cached, null);
      var (result, error) = await CallAsync<TicketResult>(config,
        (client, token) => client.GetAsync(agent
          ? $"{ApiBase}ticket/get?access_token={token}&type=agent_config"
          : $"{ApiBase}get_jsapi_ticket?access_token={token}", cancellationToken),
        cancellationToken,
        gateHeld: true);
      if (string.IsNullOrEmpty(result?.Ticket)) return (null, error ?? "读取 JS-SDK 票据失败。");
      Store(key, result.Ticket, result.ExpiresIn);
      return (result.Ticket, null);
    }
    finally
    {
      _refreshGate.Release();
    }
  }

  private async Task<(string? Token, string? Error)> GetAccessTokenAsync(
    WeComAppConfig config, bool force, CancellationToken cancellationToken, bool gateHeld = false)
  {
    var key = CacheKey("token", config);
    if (!force && TryGetCached(key, out var cached)) return (cached, null);

    if (!gateHeld) await _refreshGate.WaitAsync(cancellationToken);
    try
    {
      if (!force && TryGetCached(key, out cached)) return (cached, null);
      var client = _httpClientFactory.CreateClient(WeComWebhook.HttpClientName);
      using var response = await client.GetAsync(
        $"{ApiBase}gettoken?corpid={Uri.EscapeDataString(config.CorpId)}&corpsecret={Uri.EscapeDataString(config.Secret)}",
        cancellationToken);
      var result = await response.Content.ReadFromJsonAsync<TokenResult>(cancellationToken);
      if (result?.ErrCode == 0 && !string.IsNullOrEmpty(result.AccessToken))
      {
        Store(key, result.AccessToken, result.ExpiresIn);
        return (result.AccessToken, null);
      }
      _logger.LogWarning("WeCom gettoken returned errcode {ErrCode}: {ErrMsg}", result?.ErrCode, result?.ErrMsg);
      return (null, Describe(result?.ErrCode ?? -1, result?.ErrMsg));
    }
    catch (Exception ex) when (ex is HttpRequestException or TaskCanceledException or System.Text.Json.JsonException)
    {
      _logger.LogWarning(ex, "Could not reach WeCom for an access token.");
      return (null, "连接企业微信失败，请稍后再试。");
    }
    finally
    {
      if (!gateHeld) _refreshGate.Release();
    }
  }

  /// <summary>Calls one API with the cached access token, fetching a new token once if WeCom says it expired.</summary>
  private async Task<(T? Result, string? Error)> CallAsync<T>(
    WeComAppConfig config,
    Func<HttpClient, string, Task<HttpResponseMessage>> send,
    CancellationToken cancellationToken,
    bool gateHeld = false) where T : WeComResult
  {
    var client = _httpClientFactory.CreateClient(WeComWebhook.HttpClientName);
    for (var attempt = 0; attempt < 2; attempt++)
    {
      var (token, tokenError) = await GetAccessTokenAsync(config, force: attempt > 0, cancellationToken, gateHeld);
      if (token == null) return (null, tokenError);

      try
      {
        using var response = await send(client, token);
        var result = await response.Content.ReadFromJsonAsync<T>(cancellationToken);
        if (result == null) return (null, "企业微信没有返回内容。");
        if (result.ErrCode == 0) return (result, null);
        if (attempt == 0 && result.ErrCode is 40014 or 42001) continue;

        _logger.LogWarning("WeCom API {Type} returned errcode {ErrCode}: {ErrMsg}", typeof(T).Name, result.ErrCode, result.ErrMsg);
        return (null, Describe(result.ErrCode, result.ErrMsg));
      }
      catch (Exception ex) when (ex is HttpRequestException or TaskCanceledException or System.Text.Json.JsonException)
      {
        _logger.LogWarning(ex, "Could not reach WeCom ({Type}).", typeof(T).Name);
        return (null, "连接企业微信失败，请稍后再试。");
      }
    }
    return (null, "企业微信登录凭证失效，请稍后再试。");
  }

  private bool TryGetCached(string key, out string value)
  {
    if (_cache.TryGetValue(key, out var entry) && entry.ExpiresAt > DateTime.UtcNow)
    {
      value = entry.Value;
      return true;
    }
    value = string.Empty;
    return false;
  }

  private void Store(string key, string value, int expiresInSeconds)
  {
    var lifetime = TimeSpan.FromSeconds(expiresInSeconds > 0 ? expiresInSeconds : 7200) - RefreshMargin;
    if (lifetime < TimeSpan.FromMinutes(1)) lifetime = TimeSpan.FromMinutes(1);
    _cache[key] = (value, DateTime.UtcNow + lifetime);
  }

  /// <summary>Keyed by corp, app and a hash of the secret, so a changed setting never reuses an old token.</summary>
  private static string CacheKey(string kind, WeComAppConfig config)
  {
    var secretHash = Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(config.Secret)))[..16];
    return $"{kind}:{config.CorpId}:{config.AgentId}:{secretHash}";
  }

  [GeneratedRegex("^[A-Za-z0-9_.@-]{1,64}$")]
  private static partial Regex UserIdPattern();

  [GeneratedRegex("^[A-Za-z0-9_-]{8,64}$")]
  private static partial Regex ExternalUserIdPattern();

  [GeneratedRegex("^[A-Za-z0-9]{6,64}$")]
  private static partial Regex CorpIdPattern();

  [GeneratedRegex(@"from ip:\s*([0-9a-fA-F.:]+)")]
  private static partial Regex FromIpPattern();

  public class WeComResult
  {
    [JsonPropertyName("errcode")]
    public int ErrCode { get; set; }

    [JsonPropertyName("errmsg")]
    public string? ErrMsg { get; set; }
  }

  private sealed class TokenResult : WeComResult
  {
    [JsonPropertyName("access_token")]
    public string? AccessToken { get; set; }

    [JsonPropertyName("expires_in")]
    public int ExpiresIn { get; set; }
  }

  private sealed class TicketResult : WeComResult
  {
    [JsonPropertyName("ticket")]
    public string? Ticket { get; set; }

    [JsonPropertyName("expires_in")]
    public int ExpiresIn { get; set; }
  }

  private sealed class SendResult : WeComResult
  {
    [JsonPropertyName("invaliduser")]
    public string? InvalidUser { get; set; }
  }

  private sealed class UserInfoResult : WeComResult
  {
    [JsonPropertyName("userid")]
    public string? UserId { get; set; }

    [JsonPropertyName("UserId")]
    public string? LegacyUserId { get; set; }
  }

  private sealed class ExternalContactResult : WeComResult
  {
    [JsonPropertyName("external_contact")]
    public ExternalContactBody? ExternalContact { get; set; }

    [JsonPropertyName("follow_user")]
    public List<FollowUser>? FollowUser { get; set; }
  }

  private sealed class ExternalContactBody
  {
    [JsonPropertyName("name")]
    public string? Name { get; set; }
  }

  private sealed class FollowUser
  {
    [JsonPropertyName("userid")]
    public string? UserId { get; set; }

    [JsonPropertyName("remark")]
    public string? Remark { get; set; }
  }

  private sealed class SendTextRequest
  {
    [JsonPropertyName("touser")]
    public required string ToUser { get; set; }

    [JsonPropertyName("msgtype")]
    public string MsgType { get; set; } = "text";

    [JsonPropertyName("agentid")]
    public int AgentId { get; set; }

    [JsonPropertyName("text")]
    public required TextContent Text { get; set; }
  }

  private sealed class TextContent
  {
    [JsonPropertyName("content")]
    public required string Content { get; set; }
  }
}

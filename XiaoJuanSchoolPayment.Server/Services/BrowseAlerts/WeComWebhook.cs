using System.Net.Http.Json;
using System.Text.Json.Serialization;
using System.Text.RegularExpressions;

namespace XiaoJuanSchoolPayment.Server.Services.BrowseAlerts;

/// <summary>
/// Sends text messages through a WeCom (企业微信) group robot. Only the official robot address is
/// accepted, so a saved setting can never make the server call another host.
/// </summary>
public sealed partial class WeComWebhook
{
  public const string HttpClientName = "WeComWebhook";
  public const string UrlPrefix = "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=";

  private readonly IHttpClientFactory _httpClientFactory;
  private readonly ILogger<WeComWebhook> _logger;

  public WeComWebhook(IHttpClientFactory httpClientFactory, ILogger<WeComWebhook> logger)
  {
    _httpClientFactory = httpClientFactory;
    _logger = logger;
  }

  /// <summary>Returns the cleaned robot address, or null when it is not a WeCom group robot address.</summary>
  public static string? NormalizeUrl(string? url)
  {
    var trimmed = url?.Trim();
    if (string.IsNullOrEmpty(trimmed) || !trimmed.StartsWith(UrlPrefix, StringComparison.Ordinal)) return null;
    var key = trimmed[UrlPrefix.Length..];
    return RobotKeyPattern().IsMatch(key) ? trimmed : null;
  }

  /// <summary>The last characters of the robot key, so staff can tell saved robots apart without seeing the key.</summary>
  public static string Hint(string url)
  {
    var key = url.Length > UrlPrefix.Length ? url[UrlPrefix.Length..] : url;
    return key.Length <= 4 ? "****" : $"****{key[^4..]}";
  }

  /// <summary>Accepts a mainland mobile number or a WeCom account name; returns null for anything else.</summary>
  public static string? NormalizeMention(string? mention)
  {
    var trimmed = mention?.Trim();
    if (string.IsNullOrEmpty(trimmed)) return null;
    return MentionPattern().IsMatch(trimmed) && !string.Equals(trimmed, "@all", StringComparison.OrdinalIgnoreCase)
      ? trimmed
      : null;
  }

  public async Task<(bool Ok, string Message)> SendTextAsync(
    string webhookUrl, string content, string? mention, CancellationToken cancellationToken)
  {
    var url = NormalizeUrl(webhookUrl);
    if (url == null) return (false, "群机器人地址无效。");

    var text = new WeComText { Content = content };
    if (mention != null)
    {
      if (MobilePattern().IsMatch(mention)) text.MentionedMobileList = [mention];
      else text.MentionedList = [mention];
    }

    try
    {
      var client = _httpClientFactory.CreateClient(HttpClientName);
      using var response = await client.PostAsJsonAsync(url, new WeComTextMessage { Text = text }, cancellationToken);
      var result = await response.Content.ReadFromJsonAsync<WeComResult>(cancellationToken);
      if (response.IsSuccessStatusCode && result?.ErrCode == 0) return (true, "已发送。");

      _logger.LogWarning("WeCom robot returned {Status} errcode {ErrCode}: {ErrMsg}",
        (int)response.StatusCode, result?.ErrCode, result?.ErrMsg);
      return (false, result?.ErrCode switch
      {
        93000 => "群机器人地址已失效，请在企业微信群里重新复制机器人地址。",
        45009 => "群机器人发送太频繁（每分钟最多20条），请稍后再试。",
        _ => $"企业微信返回错误 {result?.ErrCode}：{result?.ErrMsg}",
      });
    }
    catch (Exception ex) when (ex is HttpRequestException or TaskCanceledException or System.Text.Json.JsonException)
    {
      _logger.LogWarning(ex, "Could not reach the WeCom robot.");
      return (false, "连接企业微信失败，请稍后再试。");
    }
  }

  [GeneratedRegex("^[A-Za-z0-9-]{16,64}$")]
  private static partial Regex RobotKeyPattern();

  [GeneratedRegex("^1[3-9][0-9]{9}$")]
  private static partial Regex MobilePattern();

  [GeneratedRegex("^(1[3-9][0-9]{9}|[A-Za-z0-9_.@-]{1,64})$")]
  private static partial Regex MentionPattern();

  private sealed class WeComTextMessage
  {
    [JsonPropertyName("msgtype")]
    public string MsgType { get; set; } = "text";

    [JsonPropertyName("text")]
    public required WeComText Text { get; set; }
  }

  private sealed class WeComText
  {
    [JsonPropertyName("content")]
    public required string Content { get; set; }

    [JsonPropertyName("mentioned_list")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string[]? MentionedList { get; set; }

    [JsonPropertyName("mentioned_mobile_list")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string[]? MentionedMobileList { get; set; }
  }

  private sealed class WeComResult
  {
    [JsonPropertyName("errcode")]
    public int ErrCode { get; set; }

    [JsonPropertyName("errmsg")]
    public string? ErrMsg { get; set; }
  }
}

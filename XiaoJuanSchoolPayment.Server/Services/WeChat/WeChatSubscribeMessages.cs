using System.Globalization;
using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Text.RegularExpressions;
using System.Threading.Channels;
using Microsoft.Extensions.Options;
using XiaoJuanSchoolPayment.Server.Data.Config;

namespace XiaoJuanSchoolPayment.Server.Services.WeChat
{
  /// <summary>A value for a template placeholder, in the forms WeChat's field types need.</summary>
  public sealed record WeChatValue(string Text, decimal? Amount = null, string? CurrencyCode = null, DateTime? Date = null, bool HasTime = false)
  {
    public static WeChatValue OfText(string? text) => new(text ?? "");

    /// <summary>A calendar date with no time of day, such as a course start date.</summary>
    public static WeChatValue OfDate(DateTime date) => new(date.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture), Date: date.Date);

    /// <summary>A moment, such as when something was updated, or a deadline at the end of its day.</summary>
    public static WeChatValue OfDateTime(DateTime moment) =>
      new(moment.ToString("yyyy-MM-dd HH:mm", CultureInfo.InvariantCulture), Date: moment, HasTime: true);

    public static WeChatValue OfMoney(decimal amount, string currencyCode) =>
      new(StudentNotifications.Money(amount, currencyCode), amount, currencyCode);
  }

  public sealed record WeChatMessage(string OpenId, string Kind, IReadOnlyDictionary<string, WeChatValue> Values);

  public sealed class WeChatMessageQueue
  {
    private readonly Channel<WeChatMessage> _channel = Channel.CreateBounded<WeChatMessage>(
      new BoundedChannelOptions(500) { FullMode = BoundedChannelFullMode.DropOldest });

    public void Enqueue(WeChatMessage message) => _channel.Writer.TryWrite(message);

    public ChannelReader<WeChatMessage> Reader => _channel.Reader;
  }

  /// <summary>
  /// Calls the WeChat server API: login codes to openids, and the access token for subscribe messages
  /// (the stable token, so another system using the same AppSecret never invalidates ours).
  /// </summary>
  public sealed class WeChatApiClient
  {
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly WeChatMiniProgramOptions _options;
    private readonly SemaphoreSlim _tokenLock = new(1, 1);
    private string? _accessToken;
    private DateTime _accessTokenExpiresAt;

    public WeChatApiClient(IHttpClientFactory httpClientFactory, IOptions<WeChatMiniProgramOptions> options)
    {
      _httpClientFactory = httpClientFactory;
      _options = options.Value;
    }

    public bool Enabled => _options.CanCallApi;

    /// <summary>The openid for a wx.login code, or null when WeChat rejects the code.</summary>
    public async Task<string?> GetOpenIdAsync(string code, CancellationToken cancellationToken)
    {
      if (!Enabled) return null;
      var client = _httpClientFactory.CreateClient("WeChat");
      var url = "sns/jscode2session?grant_type=authorization_code" +
        $"&appid={Uri.EscapeDataString(_options.AppId.Trim())}" +
        $"&secret={Uri.EscapeDataString(_options.AppSecret.Trim())}" +
        $"&js_code={Uri.EscapeDataString(code)}";
      using var response = await client.GetAsync(url, cancellationToken);
      if (!response.IsSuccessStatusCode) return null;
      // The response also carries session_key; it is never stored or logged.
      var body = await ReadJsonAsync<CodeSessionResponse>(response, cancellationToken);
      return body?.ErrCode is null or 0 && !string.IsNullOrWhiteSpace(body?.OpenId) ? body!.OpenId!.Trim() : null;
    }

    /// <summary>
    /// The access token, cached until shortly before it expires. <paramref name="skipCache"/> asks WeChat again
    /// after it rejected our cached token; the stable-token call then returns the token that is valid now,
    /// without invalidating it for anyone else.
    /// </summary>
    public async Task<string?> GetAccessTokenAsync(bool skipCache, CancellationToken cancellationToken)
    {
      if (!Enabled) return null;
      await _tokenLock.WaitAsync(cancellationToken);
      try
      {
        if (!skipCache && _accessToken != null && DateTime.UtcNow < _accessTokenExpiresAt) return _accessToken;
        var client = _httpClientFactory.CreateClient("WeChat");
        using var response = await client.PostAsJsonAsync("cgi-bin/stable_token", new
        {
          grant_type = "client_credential",
          appid = _options.AppId.Trim(),
          secret = _options.AppSecret.Trim(),
          force_refresh = false,
        }, cancellationToken);
        if (!response.IsSuccessStatusCode) return null;
        var body = await ReadJsonAsync<TokenResponse>(response, cancellationToken);
        if (string.IsNullOrWhiteSpace(body?.AccessToken)) return null;
        _accessToken = body.AccessToken;
        _accessTokenExpiresAt = DateTime.UtcNow.AddSeconds(Math.Max(60, body.ExpiresIn - 300));
        return _accessToken;
      }
      finally
      {
        _tokenLock.Release();
      }
    }

    /// <summary>
    /// WeChat sometimes answers JSON with a text/plain content type, which the typed JSON readers reject,
    /// so the bytes are parsed directly.
    /// </summary>
    private static async Task<T?> ReadJsonAsync<T>(HttpResponseMessage response, CancellationToken cancellationToken) where T : class
    {
      var bytes = await response.Content.ReadAsByteArrayAsync(cancellationToken);
      try
      {
        return JsonSerializer.Deserialize<T>(bytes);
      }
      catch (JsonException)
      {
        return null;
      }
    }

    private sealed class CodeSessionResponse
    {
      [JsonPropertyName("openid")] public string? OpenId { get; set; }
      [JsonPropertyName("errcode")] public int? ErrCode { get; set; }
    }

    private sealed class TokenResponse
    {
      [JsonPropertyName("access_token")] public string? AccessToken { get; set; }
      [JsonPropertyName("expires_in")] public int ExpiresIn { get; set; }
    }
  }

  /// <summary>
  /// Turns placeholder text into the values each WeChat template field type accepts. WeChat rejects the whole
  /// message (errcode 47003) when one value is empty, too long or of the wrong kind, so every type is trimmed
  /// to its documented limit and an empty value gets a neutral fallback.
  /// </summary>
  public static class WeChatTemplateFormatter
  {
    private static readonly Regex Placeholder = new(@"\{([a-zA-Z]+)\}", RegexOptions.Compiled);

    /// <summary>The field type: the letters before the number in a key such as thing1 or character_string2.</summary>
    public static string FieldType(string key) => new string(key.TakeWhile(char.IsLetter).ToArray()).ToLowerInvariant();

    public static bool HasTimeField(WeChatTemplateOptions template) => template.Fields.Keys.Any(key => FieldType(key) == "time");

    /// <param name="timeOfDayRequired">
    /// A time field normally shows a plain date as a date. WeChat's rules say a time field needs a time of day,
    /// so when it rejects the message the sender builds it again with this set, which adds 00:00.
    /// </param>
    public static Dictionary<string, object> Build(
      WeChatTemplateOptions template,
      IReadOnlyDictionary<string, WeChatValue> values,
      bool timeOfDayRequired = false)
    {
      var data = new Dictionary<string, object>(StringComparer.Ordinal);
      foreach (var (key, pattern) in template.Fields)
      {
        var trimmed = (pattern ?? "").Trim();
        var single = Placeholder.Match(trimmed);
        var whole = single.Success && single.Length == trimmed.Length && values.TryGetValue(single.Groups[1].Value, out var only)
          ? only
          : null;
        var text = Placeholder.Replace(trimmed, match => values.TryGetValue(match.Groups[1].Value, out var value) ? value.Text : "");
        data[key] = new { value = Format(FieldType(key), text, whole, timeOfDayRequired) };
      }
      return data;
    }

    public static string Format(string type, string text, WeChatValue? whole, bool timeOfDayRequired = false)
    {
      var plain = Regex.Replace(text ?? "", @"\s+", " ").Trim();
      switch (type)
      {
        case "date":
          return whole?.Date is DateTime date ? ChineseDate(date) : Fallback(Cut(plain, 20), ChineseDate(StudentNotifications.ChinaToday()));
        case "time":
          if (whole?.Date is DateTime moment)
          {
            return whole.HasTime || timeOfDayRequired
              ? $"{ChineseDate(moment)} {moment.ToString("HH:mm", CultureInfo.InvariantCulture)}"
              : ChineseDate(moment);
          }
          return Fallback(Cut(plain, 20), ChineseDate(StudentNotifications.ChinaToday()));
        case "amount":
          // One currency symbol and up to 10 digits.
          if (whole?.Amount is decimal amount)
          {
            return $"{CurrencySymbol(whole.CurrencyCode)}{Math.Min(amount, 9_999_999.99m).ToString("0.##", CultureInfo.InvariantCulture)}";
          }
          return Cut(plain, 11, ellipsis: false);
        case "number":
          return Fallback(Cut(new string(plain.Where(ch => char.IsAsciiDigit(ch) || ch == '.').ToArray()), 32, ellipsis: false), "0");
        case "phrase":
          // Up to 5 Chinese characters, nothing else.
          return Fallback(Cut(new string(plain.Where(IsChinese).ToArray()), 5, ellipsis: false), "请查看");
        case "name":
          // Up to 10 Chinese characters, or up to 20 letters; a mix of both is rejected.
          return plain.Any(IsChinese)
            ? Cut(new string(plain.Where(IsChinese).ToArray()), 10, ellipsis: false)
            : Fallback(Cut(new string(plain.Where(ch => ch < 128).ToArray()).Trim(), 20, ellipsis: false), "同学");
        case "letter":
          return Fallback(Cut(new string(plain.Where(char.IsAsciiLetter).ToArray()), 32, ellipsis: false), "A");
        case "symbol":
          return Fallback(Cut(plain, 5, ellipsis: false), "-");
        case "character":
          // character_string: digits, letters and symbols only.
          return Fallback(Cut(new string(plain.Where(ch => ch > 32 && ch < 127).ToArray()), 32, ellipsis: false), "-");
        default:
          // thing and the rarer text types: up to 20 characters of any kind.
          return Fallback(Cut(plain, 20), "详见学员中心");
      }
    }

    private static string ChineseDate(DateTime date) => date.ToString("yyyy年M月d日", CultureInfo.InvariantCulture);

    private static bool IsChinese(char ch) => ch >= 0x4E00 && ch <= 0x9FFF;

    private static string Fallback(string value, string fallback) => string.IsNullOrWhiteSpace(value) ? fallback : value;

    private static string CurrencySymbol(string? code) => (code ?? "").ToUpperInvariant() switch
    {
      "USD" => "$",
      "EUR" => "€",
      "GBP" => "£",
      "PHP" => "₱",
      _ => "¥",
    };

    private static string Cut(string text, int max, bool ellipsis = true) =>
      text.Length <= max ? text : ellipsis ? $"{text[..(max - 1)]}…" : text[..max];
  }

  /// <summary>
  /// Sends queued subscribe messages. A student who has no quota left for a template (they have not tapped
  /// 允许 again since the last message) makes WeChat answer 43101; that message is simply dropped, and the
  /// student still has the email.
  /// </summary>
  public sealed class WeChatMessageSender : BackgroundService
  {
    private const string StudentPage = "pages/student/student";
    private const int NoQuota = 43101;
    private const int InvalidData = 47003;
    private readonly WeChatMessageQueue _queue;
    private readonly WeChatApiClient _api;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly WeChatMiniProgramOptions _options;
    private readonly ILogger<WeChatMessageSender> _logger;

    public WeChatMessageSender(
      WeChatMessageQueue queue,
      WeChatApiClient api,
      IHttpClientFactory httpClientFactory,
      IOptions<WeChatMiniProgramOptions> options,
      ILogger<WeChatMessageSender> logger)
    {
      _queue = queue;
      _api = api;
      _httpClientFactory = httpClientFactory;
      _options = options.Value;
      _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
      try
      {
        await foreach (var message in _queue.Reader.ReadAllAsync(stoppingToken))
        {
          var template = _options.Template(message.Kind);
          if (template == null || !_api.Enabled) continue;
          try
          {
            var result = await SendAsync(message, template, skipTokenCache: false, timeOfDayRequired: false, stoppingToken);
            if (result.Code is 40001 or 42001)
            {
              result = await SendAsync(message, template, skipTokenCache: true, timeOfDayRequired: false, stoppingToken);
            }
            if (result.Code == InvalidData && WeChatTemplateFormatter.HasTimeField(template))
            {
              result = await SendAsync(message, template, skipTokenCache: false, timeOfDayRequired: true, stoppingToken);
            }
            if (result.Code is not (0 or NoQuota))
            {
              // Never log the openid or the message text: they identify the student. WeChat's own error text
              // names only the field or setting that is wrong, which is what fixing the configuration needs.
              _logger.LogWarning("WeChat subscribe message ({Kind}) was not sent: errcode {ErrorCode} {ErrorText}",
                message.Kind, result.Code, result.Text);
            }
          }
          catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
          {
            return;
          }
          catch (Exception exception)
          {
            _logger.LogError(exception, "WeChat subscribe message ({Kind}) could not be sent.", message.Kind);
          }
        }
      }
      catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
      {
      }
    }

    private async Task<(int Code, string Text)> SendAsync(
      WeChatMessage message,
      WeChatTemplateOptions template,
      bool skipTokenCache,
      bool timeOfDayRequired,
      CancellationToken cancellationToken)
    {
      var token = await _api.GetAccessTokenAsync(skipTokenCache, cancellationToken);
      if (token == null) return (-1, "no access token");
      var client = _httpClientFactory.CreateClient("WeChat");
      using var response = await client.PostAsJsonAsync($"cgi-bin/message/subscribe/send?access_token={Uri.EscapeDataString(token)}", new
      {
        touser = message.OpenId,
        template_id = template.TemplateId.Trim(),
        page = StudentPage,
        miniprogram_state = string.IsNullOrWhiteSpace(_options.MiniProgramState) ? "formal" : _options.MiniProgramState.Trim(),
        lang = "zh_CN",
        data = WeChatTemplateFormatter.Build(template, message.Values, timeOfDayRequired),
      }, cancellationToken);
      if (!response.IsSuccessStatusCode) return ((int)response.StatusCode, "http error");
      try
      {
        using var document = JsonDocument.Parse(await response.Content.ReadAsByteArrayAsync(cancellationToken));
        var code = document.RootElement.TryGetProperty("errcode", out var codeElement) && codeElement.TryGetInt32(out var value) ? value : 0;
        var text = document.RootElement.TryGetProperty("errmsg", out var textElement) ? textElement.GetString() ?? "" : "";
        return (code, text.Length <= 160 ? text : text[..160]);
      }
      catch (JsonException)
      {
        return (-2, "unreadable answer");
      }
    }
  }
}

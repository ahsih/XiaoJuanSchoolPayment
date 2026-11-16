using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;

namespace XiaoJuanSchoolPayment.Server.Controllers;

/// <summary>
/// Same-origin copy of the Frankfurter (ECB) CNY reference rates that the website quote pages fetch
/// directly. The WeChat mini program may only call ICP-filed domains, so its quote calculator reads
/// the rates here and applies the same validation rules (exchange-rate-rules.ts) as the website.
/// The response keeps Frankfurter's shape: { amount, base, date, rates }.
/// </summary>
[ApiController]
[Route("exchange-rates")]
[AllowAnonymous]
public sealed class ExchangeRatesController : ControllerBase
{
  private const string FreshCacheKey = "exchange-rates:cny:fresh";
  private const string StaleCacheKey = "exchange-rates:cny:stale";
  private const string LatestCnyPath = "v1/latest?base=CNY&providers=ECB";
  private readonly IHttpClientFactory _httpClientFactory;
  private readonly IMemoryCache _cache;
  private readonly ILogger<ExchangeRatesController> _logger;

  public ExchangeRatesController(
      IHttpClientFactory httpClientFactory,
      IMemoryCache cache,
      ILogger<ExchangeRatesController> logger)
  {
    _httpClientFactory = httpClientFactory;
    _cache = cache;
    _logger = logger;
  }

  [HttpGet("cny")]
  public async Task<ActionResult<FrankfurterRatesResponse>> GetCny(CancellationToken cancellationToken)
  {
    if (_cache.TryGetValue(FreshCacheKey, out FrankfurterRatesResponse? cached) && cached is not null)
    {
      return Ok(cached);
    }

    try
    {
      var client = _httpClientFactory.CreateClient("Frankfurter");
      using var response = await client.GetAsync(LatestCnyPath, cancellationToken);
      response.EnsureSuccessStatusCode();
      await using var stream = await response.Content.ReadAsStreamAsync(cancellationToken);
      using var document = await JsonDocument.ParseAsync(stream, cancellationToken: cancellationToken);
      var rates = Sanitize(document.RootElement);
      _cache.Set(FreshCacheKey, rates, TimeSpan.FromHours(1));
      // Bridge short upstream outages; clients still reject observations older than seven days.
      _cache.Set(StaleCacheKey, rates, TimeSpan.FromHours(24));
      return Ok(rates);
    }
    catch (Exception ex) when (ex is HttpRequestException or TaskCanceledException or JsonException or InvalidDataException)
    {
      _logger.LogWarning(ex, "Unable to refresh the Frankfurter CNY reference rates.");
      if (_cache.TryGetValue(StaleCacheKey, out FrankfurterRatesResponse? stale) && stale is not null)
      {
        return Ok(stale);
      }

      return StatusCode(StatusCodes.Status502BadGateway, new { message = "参考汇率暂不可用，请稍后重试。" });
    }
  }

  /// <summary>Keeps only the documented fields and positive numeric rates.</summary>
  private static FrankfurterRatesResponse Sanitize(JsonElement root)
  {
    if (root.ValueKind != JsonValueKind.Object
        || !root.TryGetProperty("base", out var baseElement) || baseElement.GetString() != "CNY"
        || !root.TryGetProperty("date", out var dateElement) || dateElement.ValueKind != JsonValueKind.String
        || !root.TryGetProperty("rates", out var ratesElement) || ratesElement.ValueKind != JsonValueKind.Object)
    {
      throw new InvalidDataException("Unexpected Frankfurter response.");
    }

    var amount = root.TryGetProperty("amount", out var amountElement) && amountElement.ValueKind == JsonValueKind.Number
      ? amountElement.GetDecimal()
      : 1m;
    var rates = new Dictionary<string, decimal>(StringComparer.Ordinal);
    foreach (var property in ratesElement.EnumerateObject())
    {
      if (property.Name.Length == 3 && property.Value.ValueKind == JsonValueKind.Number
          && property.Value.TryGetDecimal(out var rate) && rate > 0)
      {
        rates[property.Name] = rate;
      }
    }

    if (!rates.ContainsKey("USD") || !rates.ContainsKey("PHP"))
    {
      throw new InvalidDataException("Frankfurter response lacks USD or PHP.");
    }

    return new FrankfurterRatesResponse(amount, "CNY", dateElement.GetString()!, rates);
  }

  public sealed record FrankfurterRatesResponse(
      decimal Amount,
      string Base,
      string Date,
      IReadOnlyDictionary<string, decimal> Rates);
}

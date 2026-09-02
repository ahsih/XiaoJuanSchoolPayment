using System.Globalization;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;

namespace XiaoJuanSchoolPayment.Server.Controllers;

[ApiController]
[Route("pines-room-availability")]
[AllowAnonymous]
public sealed class PinesRoomAvailabilityController : ControllerBase
{
  private const string FreshCacheKey = "pines-room-availability:fresh";
  private const string StaleCacheKey = "pines-room-availability:stale";
  private readonly IHttpClientFactory _httpClientFactory;
  private readonly IMemoryCache _cache;
  private readonly ILogger<PinesRoomAvailabilityController> _logger;

  public PinesRoomAvailabilityController(
      IHttpClientFactory httpClientFactory,
      IMemoryCache cache,
      ILogger<PinesRoomAvailabilityController> logger)
  {
    _httpClientFactory = httpClientFactory;
    _cache = cache;
    _logger = logger;
  }

  [HttpGet]
  public async Task<ActionResult<PinesRoomAvailabilityResponse>> Get(CancellationToken cancellationToken)
  {
    if (_cache.TryGetValue(FreshCacheKey, out PinesRoomAvailabilityResponse? cached) && cached is not null)
    {
      return Ok(cached);
    }

    try
    {
      var client = _httpClientFactory.CreateClient("PinesPortal");
      const string publicPagePath = "appl/agent/closing/closing_v2_for_all/ETC";
      using var publicPageResponse = await client.GetAsync(
          publicPagePath,
          HttpCompletionOption.ResponseHeadersRead,
          cancellationToken);
      publicPageResponse.EnsureSuccessStatusCode();

      using var request = new HttpRequestMessage(HttpMethod.Get, "appl/agent/closing/closing_v2_list");
      request.Headers.Referrer = new Uri(client.BaseAddress!, publicPagePath);
      request.Headers.Add("X-Requested-With", "XMLHttpRequest");
      request.Headers.Accept.ParseAdd("application/json");
      using var response = await client.SendAsync(request, HttpCompletionOption.ResponseHeadersRead, cancellationToken);
      response.EnsureSuccessStatusCode();

      await using var stream = await response.Content.ReadAsStreamAsync(cancellationToken);
      using var document = await JsonDocument.ParseAsync(stream, cancellationToken: cancellationToken);
      var sanitized = BuildSanitizedResponse(document.RootElement);

      _cache.Set(FreshCacheKey, sanitized, TimeSpan.FromMinutes(5));
      _cache.Set(StaleCacheKey, sanitized, TimeSpan.FromHours(2));
      return Ok(sanitized);
    }
    catch (Exception ex) when (ex is HttpRequestException or TaskCanceledException or JsonException or InvalidOperationException)
    {
      _logger.LogWarning(ex, "Unable to refresh the public PINES room availability feed.");
      if (_cache.TryGetValue(StaleCacheKey, out PinesRoomAvailabilityResponse? stale) && stale is not null)
      {
        return Ok(stale with { IsCached = true });
      }

      return Problem(
          title: "PINES房态暂时无法更新",
          detail: "学校公开房态服务暂时不可用，请稍后再试。",
          statusCode: StatusCodes.Status503ServiceUnavailable);
    }
  }

  private static PinesRoomAvailabilityResponse BuildSanitizedResponse(JsonElement root)
  {
    if (!root.TryGetProperty("ca_list", out var campusList) ||
        !root.TryGetProperty("dorm_list", out var dormList) ||
        !root.TryGetProperty("sd_list", out var dateList) ||
        !root.TryGetProperty("result", out var resultRoot))
    {
      throw new InvalidOperationException("The public PINES room feed did not contain the expected fields.");
    }

    var dates = dateList.EnumerateArray()
        .Select(item => new SourceDate(GetString(item, "sd_id"), GetString(item, "sd_departure_date")))
        .Where(item => item.Id.Length > 0 && DateOnly.TryParseExact(item.Date, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out _))
        .ToArray();

    var campuses = new List<PinesRoomCampus>();
    foreach (var campus in campusList.EnumerateArray())
    {
      var schoolCode = GetString(campus, "br_name_short");
      var campusCode = GetString(campus, "ca_code").ToUpperInvariant();
      if (!schoolCode.Equals("PINES", StringComparison.OrdinalIgnoreCase) || (campusCode != "MAIN" && campusCode != "IELTS"))
      {
        continue;
      }

      var campusId = GetString(campus, "ca_id");
      if (!resultRoot.TryGetProperty(campusId, out var campusResults)) continue;

      var rooms = dormList.EnumerateArray()
          .Where(room => GetString(room, "do_ca_id") == campusId && GetString(room, "do_show_reg_yn") == "Y")
          .Select(room => new SourceRoom(
              GetString(room, "do_id"),
              FirstNonEmpty(GetString(room, "do_name_short"), GetString(room, "do_name_ch"), GetString(room, "do_name"))))
          .Where(room => room.Id.Length > 0 && room.Name.Length > 0)
          .ToArray();

      var rows = dates.Select(date => new PinesRoomDate(
          date.Date,
          rooms.Select(room => BuildRoomStatus(campusResults, room, date)).ToArray())).ToArray();

      campuses.Add(new PinesRoomCampus(
          campusCode,
          campusCode == "MAIN" ? "Main 主校区" : "IELTS 雅思校区",
          rows));
    }

    if (campuses.Count == 0)
    {
      throw new InvalidOperationException("No public PINES campuses were present in the room feed.");
    }

    return new PinesRoomAvailabilityResponse(DateTimeOffset.UtcNow, false, campuses);
  }

  private static PinesRoomStatus BuildRoomStatus(JsonElement campusResults, SourceRoom room, SourceDate date)
  {
    if (!campusResults.TryGetProperty(room.Id, out var roomResults) ||
        !roomResults.TryGetProperty(date.Id, out var result))
    {
      return new PinesRoomStatus(room.Name, "closed", null);
    }

    var state = GetString(result, "state").ToUpperInvariant();
    var arrivalState = GetString(result, "state_arrival").ToUpperInvariant();
    var vacancies = GetInt(result, "avail");
    var departureDate = DateOnly.ParseExact(date.Date, "yyyy-MM-dd", CultureInfo.InvariantCulture);
    var daysUntilDeparture = departureDate.DayNumber - DateOnly.FromDateTime(DateTime.UtcNow).DayNumber;

    if (arrivalState == "C")
    {
      var stayOnly = state != "C" && vacancies > 0 && daysUntilDeparture > 14;
      return new PinesRoomStatus(room.Name, stayOnly ? "stay-only" : "closed", null);
    }

    return state switch
    {
      "I" => new PinesRoomStatus(room.Name, "limited", Math.Max(vacancies, 0)),
      "O" => new PinesRoomStatus(room.Name, "open", null),
      _ => new PinesRoomStatus(room.Name, "closed", null),
    };
  }

  private static string GetString(JsonElement element, string propertyName)
  {
    if (!element.TryGetProperty(propertyName, out var value)) return string.Empty;
    return value.ValueKind == JsonValueKind.String ? value.GetString()?.Trim() ?? string.Empty : value.ToString().Trim();
  }

  private static int GetInt(JsonElement element, string propertyName)
  {
    if (!element.TryGetProperty(propertyName, out var value)) return 0;
    if (value.ValueKind == JsonValueKind.Number && value.TryGetInt32(out var number)) return number;
    return int.TryParse(value.ToString(), NumberStyles.Integer, CultureInfo.InvariantCulture, out number) ? number : 0;
  }

  private static string FirstNonEmpty(params string[] values) => values.FirstOrDefault(value => !string.IsNullOrWhiteSpace(value)) ?? string.Empty;

  private sealed record SourceDate(string Id, string Date);
  private sealed record SourceRoom(string Id, string Name);
}

public sealed record PinesRoomAvailabilityResponse(
    DateTimeOffset UpdatedAt,
    bool IsCached,
    IReadOnlyList<PinesRoomCampus> Campuses);

public sealed record PinesRoomCampus(
    string Code,
    string Name,
    IReadOnlyList<PinesRoomDate> Dates);

public sealed record PinesRoomDate(
    string Date,
    IReadOnlyList<PinesRoomStatus> Rooms);

public sealed record PinesRoomStatus(
    string Name,
    string Status,
    int? Vacancies);

using System.Globalization;
using System.Net.Http.Headers;
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
  private const string PublicPagePath = "appl/agent/closing/closing_v2_for_all/ETC";
  private const string ListPath = "appl/agent/closing/closing_v2_list";
  private const string StayListPath = "appl/agent/closing/closing_v2_finish_list";
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
  public async Task<ActionResult<PinesRoomAvailabilityResponse>> Get(
      [FromQuery] bool refresh = false,
      CancellationToken cancellationToken = default)
  {
    if (!refresh && _cache.TryGetValue(FreshCacheKey, out PinesRoomAvailabilityResponse? cached) && cached is not null)
    {
      return Ok(cached);
    }

    try
    {
      using var document = await LoadPublicFeedAsync(cancellationToken);
      var sanitized = BuildSanitizedResponse(document.RootElement);
      _cache.Set(FreshCacheKey, sanitized, TimeSpan.FromMinutes(5));
      _cache.Set(StaleCacheKey, sanitized, TimeSpan.FromMinutes(15));
      return Ok(sanitized);
    }
    catch (Exception ex) when (IsUpstreamException(ex))
    {
      _logger.LogWarning(ex, "Unable to refresh the public PINES room availability feed.");
      if (_cache.TryGetValue(StaleCacheKey, out PinesRoomAvailabilityResponse? stale) && stale is not null)
      {
        return Ok(stale with { IsCached = true });
      }

      return UpstreamProblem();
    }
  }

  [HttpGet("stay-options")]
  public async Task<ActionResult<PinesStayAvailabilityResponse>> GetStayOptions(
      [FromQuery] string campus,
      [FromQuery] string startDate,
      CancellationToken cancellationToken)
  {
    campus = campus.Trim().ToUpperInvariant();
    if ((campus != "MAIN" && campus != "IELTS") ||
        !DateOnly.TryParseExact(startDate, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out var parsedStartDate))
    {
      return BadRequest("校区或入学日期格式不正确。");
    }

    var cacheKey = $"pines-room-stay:{campus}:{startDate}";
    if (_cache.TryGetValue(cacheKey, out PinesStayAvailabilityResponse? cached) && cached is not null)
    {
      return Ok(cached);
    }

    try
    {
      using var publicDocument = await LoadPublicFeedAsync(cancellationToken);
      var source = ResolveStayRequest(publicDocument.RootElement, campus, parsedStartDate);
      if (source is null) return NotFound("学校当前公开房态中没有这个入学日期。");

      if (!source.CanStart)
      {
        var unavailable = BuildUnavailableStayResponse(publicDocument.RootElement, source, parsedStartDate);
        _cache.Set(cacheKey, unavailable, TimeSpan.FromMinutes(5));
        _cache.Set($"{cacheKey}:stale", unavailable, TimeSpan.FromMinutes(15));
        return Ok(unavailable);
      }

      using var stayDocument = await LoadStayFeedAsync(source, cancellationToken);
      var sanitized = BuildStayResponse(stayDocument.RootElement, source, parsedStartDate);
      _cache.Set(cacheKey, sanitized, TimeSpan.FromMinutes(5));
      _cache.Set($"{cacheKey}:stale", sanitized, TimeSpan.FromMinutes(15));
      return Ok(sanitized);
    }
    catch (Exception ex) when (IsUpstreamException(ex))
    {
      _logger.LogWarning(ex, "Unable to refresh PINES stay options for {Campus} on {StartDate}.", campus, startDate);
      if (_cache.TryGetValue($"{cacheKey}:stale", out PinesStayAvailabilityResponse? stale) && stale is not null)
      {
        return Ok(stale with { IsCached = true });
      }

      return UpstreamProblem();
    }
  }

  private async Task<JsonDocument> LoadPublicFeedAsync(CancellationToken cancellationToken)
  {
    var client = _httpClientFactory.CreateClient("PinesPortal");
    await WarmPortalSessionAsync(client, cancellationToken);
    using var request = CreatePortalRequest(HttpMethod.Get, ListPath);
    using var response = await client.SendAsync(request, HttpCompletionOption.ResponseHeadersRead, cancellationToken);
    response.EnsureSuccessStatusCode();
    await using var stream = await response.Content.ReadAsStreamAsync(cancellationToken);
    return await JsonDocument.ParseAsync(stream, cancellationToken: cancellationToken);
  }

  private async Task<JsonDocument> LoadStayFeedAsync(SourceStayRequest source, CancellationToken cancellationToken)
  {
    var client = _httpClientFactory.CreateClient("PinesPortal");
    await WarmPortalSessionAsync(client, cancellationToken);
    using var request = CreatePortalRequest(HttpMethod.Post, StayListPath);
    request.Content = new FormUrlEncodedContent(new Dictionary<string, string>
    {
      ["ca_id"] = source.CampusId,
      ["do_id"] = source.RoomId,
      ["sd_id"] = source.DateId,
    });
    using var response = await client.SendAsync(request, HttpCompletionOption.ResponseHeadersRead, cancellationToken);
    response.EnsureSuccessStatusCode();
    await using var stream = await response.Content.ReadAsStreamAsync(cancellationToken);
    return await JsonDocument.ParseAsync(stream, cancellationToken: cancellationToken);
  }

  private static async Task WarmPortalSessionAsync(HttpClient client, CancellationToken cancellationToken)
  {
    using var response = await client.GetAsync(PublicPagePath, HttpCompletionOption.ResponseHeadersRead, cancellationToken);
    response.EnsureSuccessStatusCode();
  }

  private static HttpRequestMessage CreatePortalRequest(HttpMethod method, string path)
  {
    var request = new HttpRequestMessage(method, path);
    request.Headers.Referrer = new Uri("https://pinesportal.com/" + PublicPagePath);
    request.Headers.Add("X-Requested-With", "XMLHttpRequest");
    request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
    return request;
  }

  private static PinesRoomAvailabilityResponse BuildSanitizedResponse(JsonElement root)
  {
    var source = GetExpectedSource(root);
    var today = DateOnly.FromDateTime(DateTime.UtcNow);
    var lastVisibleDate = today.AddYears(1);
    var dates = source.Dates.EnumerateArray()
        .Select(item => new SourceDate(GetString(item, "sd_id"), GetString(item, "sd_departure_date")))
        .Where(item => item.Id.Length > 0 &&
            DateOnly.TryParseExact(item.Date, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out var date) &&
            date >= today && date <= lastVisibleDate)
        .ToArray();

    var campuses = new List<PinesRoomCampus>();
    foreach (var campus in source.Campuses.EnumerateArray())
    {
      var schoolCode = GetString(campus, "br_name_short");
      var campusCode = GetString(campus, "ca_code").ToUpperInvariant();
      if (!schoolCode.Equals("PINES", StringComparison.OrdinalIgnoreCase) || (campusCode != "MAIN" && campusCode != "IELTS")) continue;

      var campusId = GetString(campus, "ca_id");
      if (!source.Results.TryGetProperty(campusId, out var campusResults)) continue;
      var rooms = GetSourceRooms(source.Rooms, campusId);
      var rows = dates.Select(date => new PinesRoomDate(
          date.Date,
          rooms.Select(room => BuildRoomStatus(campusResults, room, date)).ToArray())).ToArray();

      campuses.Add(new PinesRoomCampus(
          campusCode,
          campusCode == "MAIN" ? "Main 主校区" : "IELTS 雅思校区",
          rows));
    }

    if (campuses.Count == 0) throw new InvalidOperationException("No public PINES campuses were present in the room feed.");
    return new PinesRoomAvailabilityResponse(DateTimeOffset.UtcNow, false, campuses);
  }

  private static PinesRoomStatus BuildRoomStatus(JsonElement campusResults, SourceRoom room, SourceDate date)
  {
    if (!campusResults.TryGetProperty(room.Id, out var roomResults) ||
        !roomResults.TryGetProperty(date.Id, out var result))
    {
      return new PinesRoomStatus(room.Name, ClosedGenderStatus(), ClosedGenderStatus());
    }

    return new PinesRoomStatus(
        room.Name,
        BuildGenderStatus(result, room.Name, "male", "state_m", "avail_m", date.Date),
        BuildGenderStatus(result, room.Name, "female", "state_f", "avail_f", date.Date));
  }

  private static PinesGenderRoomStatus BuildGenderStatus(
      JsonElement result,
      string roomName,
      string gender,
      string stateProperty,
      string vacancyProperty,
      string date)
  {
    if (!RoomAllowsGender(roomName, gender)) return ClosedGenderStatus();

    var overallState = GetString(result, "state").ToUpperInvariant();
    var state = GetString(result, stateProperty).ToUpperInvariant();
    var arrivalState = GetString(result, "state_arrival").ToUpperInvariant();
    var vacancies = GetInt(result, vacancyProperty);
    var departureDate = DateOnly.ParseExact(date, "yyyy-MM-dd", CultureInfo.InvariantCulture);
    var daysUntilDeparture = departureDate.DayNumber - DateOnly.FromDateTime(DateTime.UtcNow).DayNumber;

    if (arrivalState == "C")
    {
      var stayOnly = overallState != "C" && state != "C" && (state == "O" || vacancies > 0) && daysUntilDeparture > 14;
      return new PinesGenderRoomStatus(stayOnly ? "stay-only" : "closed", null);
    }

    // The public table's aggregate room state is the authoritative start gate.
    // Gender fields may retain a value even when the visible school table shows "-".
    if (overallState == "C") return ClosedGenderStatus();

    return (overallState, state) switch
    {
      (_, "C") => ClosedGenderStatus(),
      ("I", _) when vacancies > 0 => new PinesGenderRoomStatus("limited", vacancies),
      (_, "I") when vacancies > 0 => new PinesGenderRoomStatus("limited", vacancies),
      ("O", "O") => new PinesGenderRoomStatus("open", null),
      _ => ClosedGenderStatus(),
    };
  }

  private static SourceStayRequest? ResolveStayRequest(JsonElement root, string campusCode, DateOnly startDate)
  {
    var source = GetExpectedSource(root);
    var campus = source.Campuses.EnumerateArray().FirstOrDefault(item =>
        GetString(item, "br_name_short").Equals("PINES", StringComparison.OrdinalIgnoreCase) &&
        GetString(item, "ca_code").Equals(campusCode, StringComparison.OrdinalIgnoreCase));
    if (campus.ValueKind == JsonValueKind.Undefined) return null;

    var campusId = GetString(campus, "ca_id");
    var date = source.Dates.EnumerateArray().FirstOrDefault(item => GetString(item, "sd_departure_date") == startDate.ToString("yyyy-MM-dd"));
    if (date.ValueKind == JsonValueKind.Undefined) return null;

    var rooms = GetSourceRooms(source.Rooms, campusId);
    SourceRoom? room = null;
    if (source.Results.TryGetProperty(campusId, out var campusResults))
    {
      room = rooms.FirstOrDefault(candidate =>
          campusResults.TryGetProperty(candidate.Id, out var roomResults) &&
          roomResults.TryGetProperty(GetString(date, "sd_id"), out var result) &&
          !GetString(result, "state_arrival").Equals("C", StringComparison.OrdinalIgnoreCase) &&
          !GetString(result, "state").Equals("C", StringComparison.OrdinalIgnoreCase));
    }
    var canStart = room is not null;
    room ??= rooms.FirstOrDefault();
    return room is null ? null : new SourceStayRequest(campusId, campusCode, GetString(date, "sd_id"), room.Id, startDate.ToString("yyyy-MM-dd"), canStart);
  }

  private static PinesStayAvailabilityResponse BuildUnavailableStayResponse(JsonElement root, SourceStayRequest request, DateOnly startDate)
  {
    var source = GetExpectedSource(root);
    var dates = source.Dates.EnumerateArray()
        .Select(item => new SourceDate(GetString(item, "sd_id"), GetString(item, "sd_departure_date")))
        .Where(item => DateOnly.TryParseExact(item.Date, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out var date) && date >= startDate)
        .Take(10)
        .ToArray();
    var rooms = GetSourceRooms(source.Rooms, request.CampusId).Select(room =>
    {
      var periods = dates.Select((date, index) => new PinesStayPeriod((index + 1) * 2, date.Date, false, null, false)).ToArray();
      return new PinesStayRoom(room.Name, periods, periods);
    }).ToArray();
    return new PinesStayAvailabilityResponse(DateTimeOffset.UtcNow, false, request.CampusCode, request.StartDate, dates.Length * 2, rooms);
  }

  private static PinesStayAvailabilityResponse BuildStayResponse(JsonElement root, SourceStayRequest request, DateOnly startDate)
  {
    var source = GetExpectedSource(root);
    var campus = source.Campuses.EnumerateArray().FirstOrDefault(item =>
        GetString(item, "br_name_short").Equals("PINES", StringComparison.OrdinalIgnoreCase) &&
        GetString(item, "ca_id") == request.CampusId);
    if (campus.ValueKind == JsonValueKind.Undefined || !source.Results.TryGetProperty(request.CampusId, out var campusResults))
    {
      throw new InvalidOperationException("The requested PINES campus was missing from the stay feed.");
    }

    var dates = source.Dates.EnumerateArray()
        .Select(item => new SourceDate(GetString(item, "sd_id"), GetString(item, "sd_departure_date")))
        .Where(item => DateOnly.TryParseExact(item.Date, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out var date) && date >= startDate)
        .Take(10)
        .ToArray();
    if (dates.Length == 0 || dates[0].Date != request.StartDate)
    {
      throw new InvalidOperationException("The requested start date was missing from the PINES stay feed.");
    }

    var rooms = GetSourceRooms(source.Rooms, request.CampusId).Select(room =>
    {
      if (!campusResults.TryGetProperty(room.Id, out var roomResults))
      {
        return new PinesStayRoom(room.Name, Array.Empty<PinesStayPeriod>(), Array.Empty<PinesStayPeriod>());
      }

      var male = dates.Select((date, index) => BuildStayPeriod(root, roomResults, room.Id, room.Name, request.DateId, date, index, "male", "state_m", "avail_m")).ToArray();
      var female = dates.Select((date, index) => BuildStayPeriod(root, roomResults, room.Id, room.Name, request.DateId, date, index, "female", "state_f", "avail_f")).ToArray();
      return new PinesStayRoom(room.Name, male, female);
    }).ToArray();

    return new PinesStayAvailabilityResponse(
        DateTimeOffset.UtcNow,
        false,
        request.CampusCode,
        request.StartDate,
        dates.Length * 2,
        rooms);
  }

  private static PinesStayPeriod BuildStayPeriod(
      JsonElement root,
      JsonElement roomResults,
      string roomId,
      string roomName,
      string startDateId,
      SourceDate date,
      int index,
      string gender,
      string stateProperty,
      string vacancyProperty)
  {
    var weeks = (index + 1) * 2;
    if (!roomResults.TryGetProperty(date.Id, out var result))
    {
      return new PinesStayPeriod(weeks, date.Date, false, null, false);
    }

    var roomState = GetString(result, "state").ToUpperInvariant();
    var genderState = GetString(result, stateProperty).ToUpperInvariant();
    var arrivalState = GetString(result, "state_arrival").ToUpperInvariant();
    var vacancies = GetInt(result, vacancyProperty);
    var canStart = roomResults.TryGetProperty(startDateId, out var startResult) &&
        GetString(startResult, "state").ToUpperInvariant() != "C" &&
        GetString(startResult, "state_arrival").ToUpperInvariant() != "C" &&
        GetString(startResult, stateProperty).ToUpperInvariant() != "C";
    var available = canStart && RoomAllowsGender(roomName, gender) && roomState != "C" && genderState != "C" &&
        (index > 0 || arrivalState != "C") &&
        (genderState == "O" || vacancies > 0);
    var mustMoveAfter = available &&
        (GetString(result, "state_return").Equals("C", StringComparison.OrdinalIgnoreCase) ||
         IsPeriodClosed(root, startDateId, roomId, weeks));

    return new PinesStayPeriod(
        weeks,
        date.Date,
        available,
        genderState == "I" && vacancies > 0 ? vacancies : null,
        mustMoveAfter);
  }

  private static bool IsPeriodClosed(JsonElement root, string startDateId, string roomId, int weeks)
  {
    if (!root.TryGetProperty("train_close_period_list", out var rules) || rules.ValueKind != JsonValueKind.Array) return false;
    foreach (var rule in rules.EnumerateArray())
    {
      if (GetString(rule, "tcp_sd_id") != startDateId || GetString(rule, "tcp_do_id") != roomId) continue;
      var from = GetInt(rule, "tcp_week");
      var to = GetInt(rule, "tcp_week2");
      return GetString(rule, "tcp_condition").ToUpperInvariant() switch
      {
        "EQ" => from <= weeks && weeks <= to,
        "GT" => from <= weeks,
        "LT" => from >= weeks,
        _ => false,
      };
    }

    return false;
  }

  private static SourceRoot GetExpectedSource(JsonElement root)
  {
    if (!root.TryGetProperty("ca_list", out var campuses) ||
        !root.TryGetProperty("dorm_list", out var rooms) ||
        !root.TryGetProperty("sd_list", out var dates) ||
        !root.TryGetProperty("result", out var results))
    {
      throw new InvalidOperationException("The public PINES room feed did not contain the expected fields.");
    }

    return new SourceRoot(campuses, rooms, dates, results);
  }

  private static SourceRoom[] GetSourceRooms(JsonElement rooms, string campusId) => rooms.EnumerateArray()
      .Where(room => GetString(room, "do_ca_id") == campusId && GetString(room, "do_show_reg_yn") == "Y")
      .Select(room => new SourceRoom(
          GetString(room, "do_id"),
          FirstNonEmpty(GetString(room, "do_name_short"), GetString(room, "do_name_ch"), GetString(room, "do_name"))))
      .Where(room => room.Id.Length > 0 && room.Name.Length > 0)
      .ToArray();

  private static PinesGenderRoomStatus ClosedGenderStatus() => new("closed", null);
  private static bool RoomAllowsGender(string roomName, string gender)
  {
    if (roomName.Contains("Male", StringComparison.OrdinalIgnoreCase) || roomName.Contains("男", StringComparison.Ordinal))
    {
      return gender == "male";
    }

    if (roomName.Contains("Female", StringComparison.OrdinalIgnoreCase) || roomName.Contains("女", StringComparison.Ordinal))
    {
      return gender == "female";
    }

    return true;
  }
  private static bool IsUpstreamException(Exception ex) => ex is HttpRequestException or TaskCanceledException or JsonException or InvalidOperationException;
  private ObjectResult UpstreamProblem() => Problem(
      title: "PINES房态暂时无法更新",
      detail: "学校公开房态服务暂时不可用，请稍后再试。",
      statusCode: StatusCodes.Status503ServiceUnavailable);

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

  private sealed record SourceRoot(JsonElement Campuses, JsonElement Rooms, JsonElement Dates, JsonElement Results);
  private sealed record SourceDate(string Id, string Date);
  private sealed record SourceRoom(string Id, string Name);
  private sealed record SourceStayRequest(string CampusId, string CampusCode, string DateId, string RoomId, string StartDate, bool CanStart);
}

public sealed record PinesRoomAvailabilityResponse(DateTimeOffset UpdatedAt, bool IsCached, IReadOnlyList<PinesRoomCampus> Campuses);
public sealed record PinesRoomCampus(string Code, string Name, IReadOnlyList<PinesRoomDate> Dates);
public sealed record PinesRoomDate(string Date, IReadOnlyList<PinesRoomStatus> Rooms);
public sealed record PinesRoomStatus(string Name, PinesGenderRoomStatus Male, PinesGenderRoomStatus Female);
public sealed record PinesGenderRoomStatus(string Status, int? Vacancies);

public sealed record PinesStayAvailabilityResponse(
    DateTimeOffset UpdatedAt,
    bool IsCached,
    string Campus,
    string StartDate,
    int MaxWeeks,
    IReadOnlyList<PinesStayRoom> Rooms);
public sealed record PinesStayRoom(string Name, IReadOnlyList<PinesStayPeriod> Male, IReadOnlyList<PinesStayPeriod> Female);
public sealed record PinesStayPeriod(int Weeks, string Date, bool Available, int? Vacancies, bool MustMoveAfter);

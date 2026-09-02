using System.Globalization;

namespace XiaoJuanSchoolPayment.Server.Controllers;

/// <summary>
/// A last-known snapshot of the public PINES room table. The live public feed
/// remains authoritative; this snapshot only keeps the public query usable when
/// the school portal temporarily rejects server-side requests.
/// </summary>
internal static class PinesRoomAvailabilityFallback
{
  private static readonly DateTimeOffset SnapshotUpdatedAt =
      new(2026, 9, 2, 23, 15, 0, TimeSpan.FromHours(8));

  private static readonly string[] MainRooms =
  [
    "Single A", "Single A(2beds)", "Single B Male", "Single B Female",
    "Single C Male", "Single C Female", "Twin A", "Twin B", "5B Solo", "4B", "6B",
  ];

  private static readonly SnapshotRow[] MainRows =
  [
    new("2026-09-06", ["-", "I1", "-", "-", "I1", "-", "I4", "I1", "O", "O", "O"]),
    new("2026-09-20", ["I1", "I1", "-", "-", "I1", "I2", "I3", "I2", "O", "O", "I13"]),
    new("2026-10-04", ["-", "-", "-", "-", "-", "-", "I1", "-", "-", "I1", "I1"]),
    new("2026-10-18", ["-", "-", "-", "-", "-", "-", "I1", "-", "-", "-", "-"]),
    new("2026-11-01", ["-", "-", "-", "-", "-", "-", "I1", "-", "-", "-", "-"]),
    new("2026-11-15", ["-", "-", "-", "-", "-", "-", "I3", "-", "-", "-", "I9"]),
    new("2026-11-29", ["-", "-", "I1", "I1", "-", "-", "I4", "I2", "I2", "I8", "I13"]),
    new("2026-12-13", ["I4", "-", "I1", "I1", "-", "-", "O", "I2", "I4", "I15", "O"]),
    new("2026-12-27", ["O", "-", "I2", "I1", "-", "I2", "O", "I2", "O", "O", "O"]),
    new("2027-01-10", ["O", "-", "I2", "I2", "-", "I1", "O", "-", "I1", "I6", "-"]),
    new("2027-01-24", ["S", "-", "I2", "I2", "-", "-", "O", "-", "I2", "S", "I4"]),
    new("2027-02-07", ["O", "-", "I1", "I2", "-", "-", "O", "I2", "I4", "I15", "O"]),
    new("2027-02-21", ["O", "-", "I1", "I2", "-", "-", "O", "I2", "O", "O", "O"]),
    new("2027-03-07", ["O", "-", "I1", "I2", "-", "-", "O", "-", "O", "O", "O"]),
    new("2027-03-21", ["O", "-", "I1", "I2", "I1", "-", "O", "-", "O", "O", "O"]),
  ];

  private static readonly string[] IeltsRooms =
  [
    "Single A", "Single B Male", "Single B Female", "Single C Male", "Single C Female",
    "Twin A", "3B", "5B Solo", "4B", "6B",
  ];

  private static readonly SnapshotRow[] IeltsRows =
  [
    new("2026-09-06", ["-", "-", "-", "-", "-", "I2", "I4", "-", "-", "-"]),
    new("2026-09-20", ["I1", "-", "-", "-", "-", "I3", "I4", "-", "-", "-"]),
    new("2026-10-04", ["-", "-", "-", "-", "-", "I1", "-", "I2", "I3", "I2"]),
    new("2026-10-18", ["-", "-", "-", "-", "-", "-", "-", "-", "I2", "-"]),
    new("2026-11-01", ["-", "-", "O", "-", "-", "-", "-", "I5", "I2", "S"]),
    new("2026-11-15", ["-", "-", "O", "-", "-", "I2", "-", "I3", "I8", "I5"]),
    new("2026-11-29", ["I1", "-", "-", "-", "O", "O", "-", "O", "I14", "I9"]),
    new("2026-12-13", ["I4", "O", "-", "O", "O", "I4", "-", "O", "O", "I10"]),
    new("2026-12-27", ["O", "O", "O", "O", "O", "O", "-", "O", "O", "I13"]),
    new("2027-01-10", ["O", "O", "O", "O", "O", "O", "-", "O", "O", "S"]),
    new("2027-01-24", ["O", "O", "O", "O", "O", "O", "-", "O", "I13", "S"]),
    new("2027-02-07", ["O", "O", "O", "O", "O", "O", "-", "O", "I13", "I12"]),
    new("2027-02-21", ["O", "O", "O", "O", "O", "O", "-", "O", "O", "I14"]),
    new("2027-03-07", ["O", "O", "O", "O", "O", "O", "-", "O", "O", "I14"]),
    new("2027-03-21", ["O", "O", "O", "O", "O", "O", "-", "O", "O", "I14"]),
  ];

  public static PinesRoomAvailabilityResponse? Build()
  {
    var today = DateOnly.FromDateTime(DateTime.UtcNow);
    var lastVisibleDate = today.AddYears(1);
    var campuses = new[]
    {
      BuildCampus("MAIN", "Main 主校区", MainRooms, MainRows, today, lastVisibleDate),
      BuildCampus("IELTS", "IELTS 雅思校区", IeltsRooms, IeltsRows, today, lastVisibleDate),
    }.Where(campus => campus.Dates.Count > 0).ToArray();

    return campuses.Length == 0
        ? null
        : new PinesRoomAvailabilityResponse(SnapshotUpdatedAt, true, campuses);
  }

  private static PinesRoomCampus BuildCampus(
      string code,
      string name,
      IReadOnlyList<string> rooms,
      IEnumerable<SnapshotRow> rows,
      DateOnly today,
      DateOnly lastVisibleDate)
  {
    var dates = rows
        .Select(row => (Row: row, Date: ParseDate(row.Date)))
        .Where(item => item.Date >= today && item.Date <= lastVisibleDate)
        .Select(item => new PinesRoomDate(
            item.Row.Date,
            rooms.Select((room, index) => BuildRoomStatus(room, item.Row.Values[index])).ToArray()))
        .ToArray();

    return new PinesRoomCampus(code, name, dates);
  }

  private static PinesRoomStatus BuildRoomStatus(string roomName, string token)
  {
    var status = ParseStatus(token);
    var closed = new PinesGenderRoomStatus("closed", null);
    var male = AllowsGender(roomName, "male") ? status : closed;
    var female = AllowsGender(roomName, "female") ? status : closed;
    return new PinesRoomStatus(roomName, male, female);
  }

  private static PinesGenderRoomStatus ParseStatus(string token)
  {
    if (token.StartsWith('I') && int.TryParse(token[1..], NumberStyles.None, CultureInfo.InvariantCulture, out var vacancies))
    {
      return new PinesGenderRoomStatus("limited", vacancies);
    }

    return token switch
    {
      "O" => new PinesGenderRoomStatus("open", null),
      "S" => new PinesGenderRoomStatus("stay-only", null),
      _ => new PinesGenderRoomStatus("closed", null),
    };
  }

  private static bool AllowsGender(string roomName, string gender)
  {
    if (roomName.Contains("Male", StringComparison.OrdinalIgnoreCase)) return gender == "male";
    if (roomName.Contains("Female", StringComparison.OrdinalIgnoreCase)) return gender == "female";
    return true;
  }

  private static DateOnly ParseDate(string value) =>
      DateOnly.ParseExact(value, "yyyy-MM-dd", CultureInfo.InvariantCulture);

  private sealed record SnapshotRow(string Date, string[] Values);
}

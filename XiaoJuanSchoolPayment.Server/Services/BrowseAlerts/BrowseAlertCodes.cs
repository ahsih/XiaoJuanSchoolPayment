using System.Security.Cryptography;
using System.Text.RegularExpressions;
using Microsoft.EntityFrameworkCore;
using XiaoJuanSchoolPayment.Server.Data;

namespace XiaoJuanSchoolPayment.Server.Services.BrowseAlerts;

/// <summary>The random code of a personal link (?vt=…), shared by the back office and the WeCom chat sidebar.</summary>
public static partial class BrowseAlertCodes
{
  public const string QueryParameter = "vt";
  private const string Alphabet = "abcdefghjkmnpqrstuvwxyz23456789";
  private const int Length = 10;

  public static bool IsValid(string? code) => !string.IsNullOrEmpty(code) && CodePattern().IsMatch(code);

  public static async Task<string> NewCodeAsync(AppDbContext context, CancellationToken cancellationToken)
  {
    for (var attempt = 0; attempt < 5; attempt++)
    {
      var chars = new char[Length];
      for (var i = 0; i < chars.Length; i++)
      {
        chars[i] = Alphabet[RandomNumberGenerator.GetInt32(Alphabet.Length)];
      }
      var code = new string(chars);
      if (!await context.BrowseAlertLinks.AnyAsync(x => x.Code == code, cancellationToken)) return code;
    }
    throw new InvalidOperationException("Could not create a unique browse link code.");
  }

  [GeneratedRegex("^[a-z0-9]{8,16}$")]
  private static partial Regex CodePattern();
}

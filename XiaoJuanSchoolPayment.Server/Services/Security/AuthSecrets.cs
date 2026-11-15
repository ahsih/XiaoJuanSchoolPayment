using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using XiaoJuanSchoolPayment.Server.Data.Models;

namespace XiaoJuanSchoolPayment.Server.Services.Security;

/// <summary>
/// Makes issued JWTs revocable. Each token carries a hash of the user's Identity security stamp,
/// and every authenticated request checks it against the database. Password changes/resets and
/// employee-type changes rotate the stamp, so earlier tokens stop working immediately.
/// Only a hash is embedded because Identity also derives one-time codes from the raw stamp.
/// </summary>
public static class JwtSecurityStamp
{
  public const string ClaimType = "sstamp";

  public static string Hash(string securityStamp) =>
    Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(securityStamp))).ToLowerInvariant();

  public static async Task ValidateAsync(TokenValidatedContext context)
  {
    var userId = context.Principal?.FindFirstValue(ClaimTypes.NameIdentifier);
    var stampHash = context.Principal?.FindFirstValue(ClaimType);
    if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(stampHash))
    {
      context.Fail("Token was issued before revocation support and must be renewed.");
      return;
    }

    var userManager = context.HttpContext.RequestServices.GetRequiredService<UserManager<SchoolUser>>();
    var user = await userManager.FindByIdAsync(userId);
    if (user?.SecurityStamp == null
      || !CryptographicOperations.FixedTimeEquals(
        Encoding.ASCII.GetBytes(Hash(user.SecurityStamp)),
        Encoding.ASCII.GetBytes(stampHash)))
    {
      context.Fail("Token has been revoked.");
    }
  }
}

/// <summary>
/// Rejects secrets that were once committed to source control. Matching is by SHA-256 so the
/// revoked values themselves never appear in the code again; any deployment that still supplies
/// one of them (for example by copying an old appsettings.json into its environment) is treated
/// as if the secret were not configured.
/// </summary>
public static class RevokedSecrets
{
  private static readonly HashSet<string> RevokedSha256 = new(StringComparer.Ordinal)
  {
    "400d57e6c0f69cdc68c55d411b6b2c468fc63c0d962542441a2d2e9536057282", // former committed Jwt:Key
    "edf71cc1e7edc0f92d3cfcad661a153befeeeaf82b15598c38586c74d6bc5cee", // former committed AccessCode
  };

  public static bool IsRevoked(string? value) =>
    !string.IsNullOrEmpty(value) &&
    RevokedSha256.Contains(Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(value))).ToLowerInvariant());

  /// <summary>The administrator access code if one is configured and not revoked; otherwise null.</summary>
  public static string? UsableAccessCode(IConfiguration configuration)
  {
    var configured = configuration["AccessCode"];
    return string.IsNullOrWhiteSpace(configured) || IsRevoked(configured) ? null : configured;
  }
}

/// <summary>
/// The single HMAC key used both to issue and to validate employee/student JWTs.
/// A missing, too-short or revoked configured key falls back to a random per-process key so the
/// public site keeps running; signed-in users are then signed out on every restart until
/// <c>Jwt__Key</c> is configured.
/// </summary>
public sealed class JwtSigningKey
{
  public const int MinimumKeyBytes = 32;

  private JwtSigningKey(SymmetricSecurityKey key, string? warning)
  {
    Key = key;
    Warning = warning;
  }

  public SymmetricSecurityKey Key { get; }

  /// <summary>Non-null when the random fallback key is in use; describes why.</summary>
  public string? Warning { get; }

  public static JwtSigningKey FromConfiguration(IConfiguration configuration)
  {
    var configured = configuration["Jwt:Key"];
    string? problem = null;
    if (string.IsNullOrWhiteSpace(configured))
    {
      problem = "Jwt:Key is not configured";
    }
    else if (Encoding.UTF8.GetByteCount(configured) < MinimumKeyBytes)
    {
      problem = $"Jwt:Key is shorter than {MinimumKeyBytes} bytes";
    }
    else if (RevokedSecrets.IsRevoked(configured))
    {
      problem = "Jwt:Key matches a value that was committed to source control";
    }

    if (problem == null)
    {
      return new JwtSigningKey(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configured!)), null);
    }

    return new JwtSigningKey(
      new SymmetricSecurityKey(RandomNumberGenerator.GetBytes(64)),
      $"{problem}. Using a random per-process signing key, so every restart signs all users out. " +
      $"Set Jwt__Key to a private random value of at least {MinimumKeyBytes} bytes.");
  }
}

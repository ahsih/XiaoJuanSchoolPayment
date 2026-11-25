using System.Collections.Concurrent;
using System.Security.Cryptography;
using Microsoft.Extensions.Caching.Memory;

namespace XiaoJuanSchoolPayment.Server.Services.BrowseAlerts;

/// <summary>A consultant signed in to the WeCom chat sidebar through WeCom's own login (OAuth code).</summary>
public sealed class WeComSidebarSession
{
  public required string WeComUserId { get; init; }
  public required string ConsultantName { get; init; }

  /// <summary>Customers already checked with WeCom as this consultant's own, so sending again needs no second check.</summary>
  public ConcurrentDictionary<string, string> CheckedContacts { get; } = new(StringComparer.Ordinal);
}

/// <summary>
/// Sidebar sign-ins, kept in memory for 12 hours under a random token. A server restart only makes the
/// sidebar sign in again, which WeCom does silently.
/// </summary>
public sealed class WeComSidebarSessions
{
  public const string HeaderName = "X-Sidebar-Token";
  private static readonly TimeSpan Lifetime = TimeSpan.FromHours(12);
  private readonly IMemoryCache _cache;

  public WeComSidebarSessions(IMemoryCache cache)
  {
    _cache = cache;
  }

  public string Create(string weComUserId, string consultantName)
  {
    var token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(32)).TrimEnd('=').Replace('+', '-').Replace('/', '_');
    _cache.Set(Key(token), new WeComSidebarSession { WeComUserId = weComUserId, ConsultantName = consultantName }, Lifetime);
    return token;
  }

  public WeComSidebarSession? Find(string? token)
  {
    if (string.IsNullOrEmpty(token) || token.Length != 43) return null;
    return _cache.TryGetValue(Key(token), out WeComSidebarSession? session) ? session : null;
  }

  private static string Key(string token) => $"wecom-sidebar:{token}";
}

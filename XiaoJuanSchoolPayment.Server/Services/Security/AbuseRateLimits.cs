using System.Globalization;
using System.Net;
using System.Net.Sockets;
using System.Threading.RateLimiting;
using Microsoft.AspNetCore.RateLimiting;

namespace XiaoJuanSchoolPayment.Server.Services.Security;

/// <summary>
/// Per-client request limits for anonymous endpoints that send mail or check credentials.
/// Site-wide ceilings on actual outbound mail live in <see cref="OutboundMailThrottle"/>.
/// </summary>
public static class AbuseRateLimits
{
  public const string QuoteEmailPolicy = "quote-email";
  public const string ContactFormPolicy = "contact-form";
  public const string AuthPolicy = "auth";

  public const string RejectionMessage = "请求过于频繁，请稍后再试。";

  public static IServiceCollection AddAbuseRateLimits(this IServiceCollection services)
  {
    services.AddSingleton<OutboundMailThrottle>();
    return services.AddRateLimiter(options =>
    {
      options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
      options.OnRejected = async (context, cancellationToken) =>
      {
        if (context.Lease.TryGetMetadata(MetadataName.RetryAfter, out var retryAfter))
        {
          context.HttpContext.Response.Headers.RetryAfter =
            ((int)Math.Ceiling(retryAfter.TotalSeconds)).ToString(CultureInfo.InvariantCulture);
        }
        await context.HttpContext.Response.WriteAsJsonAsync(new { message = RejectionMessage }, cancellationToken);
      };

      options.AddPolicy(QuoteEmailPolicy, httpContext => PerClient(httpContext, 10, TimeSpan.FromMinutes(10)));
      options.AddPolicy(ContactFormPolicy, httpContext => PerClient(httpContext, 5, TimeSpan.FromMinutes(10)));
      options.AddPolicy(AuthPolicy, httpContext => PerClient(httpContext, 20, TimeSpan.FromMinutes(5)));
    });
  }

  private static RateLimitPartition<string> PerClient(HttpContext httpContext, int permitLimit, TimeSpan window) =>
    RateLimitPartition.GetFixedWindowLimiter(ClientKey(httpContext), _ => new FixedWindowRateLimiterOptions
    {
      PermitLimit = permitLimit,
      Window = window,
      QueueLimit = 0,
      AutoReplenishment = true,
    });

  /// <summary>
  /// The client address used to partition limits. X-Forwarded-For is trusted only when the direct
  /// peer is a loopback or private address (the production Caddy proxy), and then only its last
  /// entry, which is the address the proxy itself saw. Direct public callers cannot spoof it.
  /// </summary>
  public static string ClientKey(HttpContext httpContext)
  {
    var remote = httpContext.Connection.RemoteIpAddress;
    if (remote != null && IsLoopbackOrPrivate(remote))
    {
      var forwarded = httpContext.Request.Headers["X-Forwarded-For"].ToString();
      var last = forwarded
        .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
        .LastOrDefault();
      if (last != null && IPAddress.TryParse(last, out var forwardedAddress))
      {
        return Normalize(forwardedAddress).ToString();
      }
    }

    return remote == null ? "unknown" : Normalize(remote).ToString();
  }

  private static IPAddress Normalize(IPAddress address) =>
    address.IsIPv4MappedToIPv6 ? address.MapToIPv4() : address;

  private static bool IsLoopbackOrPrivate(IPAddress address)
  {
    address = Normalize(address);
    if (IPAddress.IsLoopback(address)) return true;
    if (address.AddressFamily == AddressFamily.InterNetwork)
    {
      var bytes = address.GetAddressBytes();
      return bytes[0] == 10
        || (bytes[0] == 172 && bytes[1] >= 16 && bytes[1] <= 31)
        || (bytes[0] == 192 && bytes[1] == 168);
    }

    return address.IsIPv6UniqueLocal || address.IsIPv6LinkLocal;
  }
}

/// <summary>
/// Site-wide ceilings on anonymous outbound mail, counted only for messages that pass validation
/// and are about to be sent. They bound abuse from clients that rotate addresses and protect the
/// SMTP account's sending quota, which password-reset mail also depends on.
/// </summary>
public sealed class OutboundMailThrottle : IDisposable
{
  private readonly FixedWindowRateLimiter _quoteEmails = Create(30, TimeSpan.FromHours(1));
  private readonly FixedWindowRateLimiter _contactForms = Create(20, TimeSpan.FromHours(1));

  public bool TryAcquireQuoteEmail() => TryAcquire(_quoteEmails);

  public bool TryAcquireContactForm() => TryAcquire(_contactForms);

  public void Dispose()
  {
    _quoteEmails.Dispose();
    _contactForms.Dispose();
  }

  private static bool TryAcquire(FixedWindowRateLimiter limiter)
  {
    using var lease = limiter.AttemptAcquire();
    return lease.IsAcquired;
  }

  private static FixedWindowRateLimiter Create(int permitLimit, TimeSpan window) => new(new FixedWindowRateLimiterOptions
  {
    PermitLimit = permitLimit,
    Window = window,
    QueueLimit = 0,
    AutoReplenishment = true,
  });
}

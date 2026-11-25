using System.Text.Json;
using System.Text.RegularExpressions;

namespace XiaoJuanSchoolPayment.Server.Services.BrowseAlerts;

/// <summary>
/// The pages that trigger a browse reminder and their short names, read from wwwroot/browse-pages.json.
/// scripts/export-seo-pages.cjs writes that file at build time from prerender-school-routes.txt (every
/// school detail page plus the price comparison) and each page's SEO title, so adding a school page
/// there adds it here too. The file also holds each page's SEO image, used on the link card the WeCom chat
/// sidebar sends. A missing file (for example in local development) means no page qualifies.
/// </summary>
public sealed partial class BrowsePageCatalog
{
  private static readonly TimeSpan RecheckInterval = TimeSpan.FromMinutes(1);

  private readonly string _filePath;
  private readonly ILogger<BrowsePageCatalog> _logger;
  private readonly object _gate = new();
  private IReadOnlyDictionary<string, string> _pages = new Dictionary<string, string>();
  private IReadOnlyDictionary<string, string> _images = new Dictionary<string, string>();
  private DateTime _loadedWriteTime;
  private DateTime _checkedAt = DateTime.MinValue;
  private bool _warnedMissing;

  public BrowsePageCatalog(IWebHostEnvironment environment, ILogger<BrowsePageCatalog> logger)
  {
    _filePath = Path.Combine(environment.WebRootPath ?? Path.Combine(environment.ContentRootPath, "wwwroot"), "browse-pages.json");
    _logger = logger;
  }

  /// <summary>Strips the query, fragment and trailing slash; returns null for anything that is not a plain site path.</summary>
  public static string? NormalizePath(string? rawPath)
  {
    if (string.IsNullOrWhiteSpace(rawPath)) return null;
    var path = rawPath.Trim().Split('?', '#')[0];
    if (path.Length > 1) path = path.TrimEnd('/');
    if (path.Length == 0) path = "/";
    return SitePathPattern().IsMatch(path) ? path : null;
  }

  public bool TryGetName(string path, out string name)
  {
    return Pages().TryGetValue(path, out name!);
  }

  /// <summary>The page's SEO image: a site path such as /assets/cia/campus-building.webp, or a full https address.</summary>
  public string? ImageFor(string path)
  {
    Pages();
    lock (_gate)
    {
      return _images.TryGetValue(path, out var image) ? image : null;
    }
  }

  public IReadOnlyList<(string Path, string Name)> All()
  {
    return Pages().Select(x => (x.Key, x.Value)).ToList();
  }

  private IReadOnlyDictionary<string, string> Pages()
  {
    lock (_gate)
    {
      var now = DateTime.UtcNow;
      if (now - _checkedAt < RecheckInterval) return _pages;
      _checkedAt = now;

      try
      {
        if (!File.Exists(_filePath))
        {
          if (!_warnedMissing)
          {
            _logger.LogWarning("Browse reminders are off: {File} is missing.", _filePath);
            _warnedMissing = true;
          }
          _pages = new Dictionary<string, string>();
          _images = new Dictionary<string, string>();
          _loadedWriteTime = DateTime.MinValue;
          return _pages;
        }

        _warnedMissing = false;
        var writeTime = File.GetLastWriteTimeUtc(_filePath);
        if (writeTime == _loadedWriteTime) return _pages;

        using var stream = File.OpenRead(_filePath);
        var data = JsonSerializer.Deserialize<CatalogFile>(stream, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        var pages = new Dictionary<string, string>(StringComparer.Ordinal);
        foreach (var (rawPath, rawName) in data?.Pages ?? new Dictionary<string, string>())
        {
          var path = NormalizePath(rawPath);
          var name = rawName?.Trim();
          if (path != null && !string.IsNullOrEmpty(name))
          {
            pages[path] = name.Length > 120 ? name[..120] : name;
          }
        }

        var images = new Dictionary<string, string>(StringComparer.Ordinal);
        foreach (var (rawPath, rawImage) in data?.Images ?? new Dictionary<string, string>())
        {
          var path = NormalizePath(rawPath);
          var image = rawImage?.Trim();
          if (path != null && pages.ContainsKey(path) && image != null && image.Length <= 500
            && (image.StartsWith("/assets/", StringComparison.Ordinal) || image.StartsWith("https://", StringComparison.Ordinal)))
          {
            images[path] = image;
          }
        }

        _pages = pages;
        _images = images;
        _loadedWriteTime = writeTime;
      }
      catch (Exception ex)
      {
        _logger.LogError(ex, "Could not read {File}; keeping the previous browse page list.", _filePath);
      }

      return _pages;
    }
  }

  [GeneratedRegex("^/[a-z0-9/_-]{0,298}$")]
  private static partial Regex SitePathPattern();

  private sealed class CatalogFile
  {
    public Dictionary<string, string>? Pages { get; set; }
    public Dictionary<string, string>? Images { get; set; }
  }
}

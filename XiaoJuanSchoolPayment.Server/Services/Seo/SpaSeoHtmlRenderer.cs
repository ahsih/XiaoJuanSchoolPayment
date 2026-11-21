using System.Net;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;

namespace XiaoJuanSchoolPayment.Server.Services.Seo;

/// <summary>
/// Serves the Angular HTML for client routes with that route's own title, description, keywords,
/// Open Graph/Twitter tags, canonical link and schema.org JSON-LD already in the HTML. Routes the build
/// prerendered (prerender-routes.txt in the client) get their prerendered page, whose body text is in
/// the HTML; every other route gets the empty shell. Baidu, WeChat link previews and most AI crawlers
/// do not run JavaScript, so without this every URL showed the homepage metadata and no body text.
/// The data is wwwroot/seo-pages.json, generated at build time from the client's seo.service.ts and the
/// prerendered pages (scripts/export-seo-pages.cjs); the Angular SeoService keeps updating the same tags
/// during in-app navigation, and Angular replaces the prerendered body when it starts. "/" is the
/// prerendered index.html, served as a static file. Missing files fail safe: no index.csr.html or
/// index.html → 404 (as before), no seo-pages.json → the original HTML.
/// </summary>
public sealed partial class SpaSeoHtmlRenderer
{
  private readonly IWebHostEnvironment _environment;
  private readonly ILogger<SpaSeoHtmlRenderer> _logger;
  private readonly Lazy<Template?> _template;

  public SpaSeoHtmlRenderer(IWebHostEnvironment environment, ILogger<SpaSeoHtmlRenderer> logger)
  {
    _environment = environment;
    _logger = logger;
    _template = new Lazy<Template?>(LoadTemplate, LazyThreadSafetyMode.ExecutionAndPublication);
  }

  /// <summary>The HTML for <paramref name="requestPath"/>, or null when there is no built index.html.</summary>
  public string? Render(string requestPath, string origin)
  {
    var template = _template.Value;
    if (template == null)
    {
      return null;
    }

    if (template.Data == null)
    {
      return template.OriginalHtml;
    }

    var path = NormalizePath(requestPath);
    SeoEntry page = template.Data.Pages.GetValueOrDefault(path)
      ?? template.Data.Sections.FirstOrDefault(section => path.StartsWith(section.Prefix, StringComparison.Ordinal))
      ?? template.Data.Default!;
    var html = template.Prerendered.GetValueOrDefault(path) ?? template.Shell;

    var canonical = origin + path;
    var image = page.Image.StartsWith("http://", StringComparison.OrdinalIgnoreCase)
      || page.Image.StartsWith("https://", StringComparison.OrdinalIgnoreCase)
        ? page.Image
        : origin + (page.Image.StartsWith('/') ? page.Image : "/" + page.Image);

    var tags = new StringBuilder()
      .Append("<title>").Append(Encode(page.Title)).Append("</title>\n")
      .Append(Meta("name", "description", page.Description))
      .Append(Meta("name", "keywords", page.Keywords))
      .Append(Meta("property", "og:site_name", template.Data.SiteName))
      .Append(Meta("property", "og:type", page.Type))
      .Append(Meta("property", "og:title", page.Title))
      .Append(Meta("property", "og:description", page.Description))
      .Append(Meta("property", "og:url", canonical))
      .Append(Meta("property", "og:image", image))
      .Append(Meta("name", "twitter:card", "summary_large_image"))
      .Append(Meta("name", "twitter:title", page.Title))
      .Append(Meta("name", "twitter:description", page.Description))
      .Append(Meta("name", "twitter:image", image))
      .Append("<link rel=\"canonical\" href=\"").Append(Encode(canonical)).Append("\" />\n");

    // Build output from seo.service.ts: JSON with "<" escaped.
    if (!string.IsNullOrEmpty(page.JsonLd))
    {
      tags.Append("<script type=\"application/ld+json\" id=\"seo-json-ld\">").Append(page.JsonLd).Append("</script>\n");
    }

    return html.BeforeHeadEnd + tags + html.FromHeadEnd;
  }

  private static string NormalizePath(string rawPath)
  {
    // Same rule as the client SeoService: drop trailing slashes except for the root.
    var trimmed = (rawPath ?? string.Empty).TrimEnd('/');
    return trimmed.Length == 0 ? "/" : trimmed;
  }

  private static string Meta(string attribute, string key, string content) =>
    $"<meta {attribute}=\"{key}\" content=\"{Encode(content)}\" />\n";

  private static string Encode(string value) => WebUtility.HtmlEncode(value ?? string.Empty);

  [GeneratedRegex(
    """<title>[\s\S]*?</title>\s*|<meta\s[^>]*?(?:name|property)="(?:description|keywords|og:[a-z_:]+|twitter:[a-z_:]+)"[^>]*>\s*|<link\s[^>]*?rel="canonical"[^>]*>\s*|<script\s[^>]*?id="seo-json-ld"[^>]*>[\s\S]*?</script>\s*""",
    RegexOptions.IgnoreCase)]
  private static partial Regex SeoTagPattern();

  /// <summary>The HTML without its SEO tags, split where the route's own tags go (before &lt;/head&gt;).</summary>
  private static Html? Split(string html)
  {
    var stripped = SeoTagPattern().Replace(html, string.Empty);
    var headEnd = stripped.IndexOf("</head>", StringComparison.OrdinalIgnoreCase);
    return headEnd < 0 ? null : new Html(stripped[..headEnd], stripped[headEnd..]);
  }

  private Template? LoadTemplate()
  {
    var webRoot = _environment.WebRootPath;
    if (string.IsNullOrEmpty(webRoot))
    {
      return null;
    }

    // When the build prerenders "/", index.html is the home page and index.csr.html the empty shell.
    var shellPath = Path.Combine(webRoot, "index.csr.html");
    if (!File.Exists(shellPath))
    {
      shellPath = Path.Combine(webRoot, "index.html");
    }

    if (!File.Exists(shellPath))
    {
      return null;
    }

    var originalHtml = File.ReadAllText(shellPath);
    var dataPath = Path.Combine(webRoot, "seo-pages.json");
    SeoData? data = null;
    try
    {
      if (File.Exists(dataPath))
      {
        data = JsonSerializer.Deserialize<SeoData>(File.ReadAllText(dataPath), new JsonSerializerOptions
        {
          PropertyNameCaseInsensitive = true,
        });
      }
    }
    catch (JsonException ex)
    {
      _logger.LogError(ex, "seo-pages.json is invalid; serving the page shell without per-page SEO tags.");
      data = null;
    }

    var shell = Split(originalHtml);
    if (data?.Default == null || shell == null)
    {
      _logger.LogWarning("Per-page SEO tags are disabled: seo-pages.json is missing or the page shell has no </head>.");
      return new Template(originalHtml, null, new Html(originalHtml, string.Empty), new Dictionary<string, Html>());
    }

    data.Sections ??= [];
    data.Pages ??= new Dictionary<string, SeoEntry>(StringComparer.Ordinal);

    var prerendered = new Dictionary<string, Html>(StringComparer.Ordinal);
    foreach (var (route, html) in data.Prerendered ?? new Dictionary<string, string>())
    {
      var page = Split(html ?? string.Empty);
      if (page == null)
      {
        _logger.LogWarning("The prerendered page for {Route} has no </head>; serving the page shell instead.", route);
        continue;
      }

      prerendered[NormalizePath(route)] = page;
    }

    data.Prerendered = null; // Each page is kept once, already split.
    return new Template(originalHtml, data, shell, prerendered);
  }

  private sealed record Html(string BeforeHeadEnd, string FromHeadEnd);

  private sealed record Template(string OriginalHtml, SeoData? Data, Html Shell, Dictionary<string, Html> Prerendered);

  private sealed class SeoData
  {
    public string SiteName { get; set; } = string.Empty;
    public SeoEntry? Default { get; set; }
    public Dictionary<string, SeoEntry> Pages { get; set; } = new(StringComparer.Ordinal);
    public List<SeoSection> Sections { get; set; } = [];
    public Dictionary<string, string>? Prerendered { get; set; }
  }

  private class SeoEntry
  {
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Keywords { get; set; } = string.Empty;
    public string Image { get; set; } = string.Empty;
    public string Type { get; set; } = "website";
    public string JsonLd { get; set; } = string.Empty;
  }

  private sealed class SeoSection : SeoEntry
  {
    public string Prefix { get; set; } = string.Empty;
  }
}

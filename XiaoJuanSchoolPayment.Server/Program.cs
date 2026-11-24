using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.StaticFiles;
using System.Text;
using System.Xml.Linq;
using XiaoJuanSchoolPayment.Server.Data;
using XiaoJuanSchoolPayment.Server.Data.Config;
using XiaoJuanSchoolPayment.Server.Data.Models;
using XiaoJuanSchoolPayment.Server.Interface;
using XiaoJuanSchoolPayment.Server.Services;
using XiaoJuanSchoolPayment.Server.Services.Currency;
using XiaoJuanSchoolPayment.Server.Services.School;
using XiaoJuanSchoolPayment.Server.Services.Security;
using XiaoJuanSchoolPayment.Server.Services.Seo;
using XiaoJuanSchoolPayment.Server.Services.Storage;

var builder = WebApplication.CreateBuilder(args);
var jwtSigningKey = JwtSigningKey.FromConfiguration(builder.Configuration);
builder.Services.AddSingleton(jwtSigningKey);

// Add services to the container.
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("DefaultConnection"))
    ));

builder.Services.AddIdentity<SchoolUser, IdentityRole>(options =>
  {
    options.Password.RequiredLength = 8;
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = false;
    options.Password.RequireUppercase = false;
    options.Password.RequireNonAlphanumeric = false;
    options.User.RequireUniqueEmail = true;
    options.Lockout.MaxFailedAccessAttempts = 5;
    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(15);
  })
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders();

builder.Services.Configure<DataProtectionTokenProviderOptions>(options =>
{
  options.TokenLifespan = TimeSpan.FromHours(1);
});

// Identity registers cookie defaults, so configure the API's JWT defaults after Identity.
builder.Services.AddAuthentication(options =>
{
  options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
  options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
  options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
  options.DefaultForbidScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
  options.TokenValidationParameters = new TokenValidationParameters
  {
    ValidateIssuer = true,
    ValidateAudience = true,
    ValidateLifetime = true,
    ValidateIssuerSigningKey = true,
    ValidIssuer = builder.Configuration["Jwt:Issuer"],
    ValidAudience = builder.Configuration["Jwt:Audience"],
    IssuerSigningKey = jwtSigningKey.Key,
    RoleClaimType = System.Security.Claims.ClaimTypes.Role
  };
  options.Events = new JwtBearerEvents
  {
    OnTokenValidated = JwtSecurityStamp.ValidateAsync,
  };
});

builder.Services.ConfigureApplicationCookie(o =>
{
  o.Events.OnRedirectToLogin = ctx => { ctx.Response.StatusCode = 401; return Task.CompletedTask; };
  o.Events.OnRedirectToAccessDenied = ctx => { ctx.Response.StatusCode = 403; return Task.CompletedTask; };
});

builder.Services.AddAuthorization(options =>
{
  options.DefaultPolicy = new AuthorizationPolicyBuilder(JwtBearerDefaults.AuthenticationScheme)
      .RequireAuthenticatedUser()
      .Build();
});

builder.Services.AddScoped<ISchoolService, SchoolService>();
builder.Services.AddScoped<ISchoolContentService, SchoolContentService>();
builder.Services.AddScoped<IStaffPermissionService, StaffPermissionService>();
builder.Services.AddScoped<ICurrencyService, CurrencyService>();
builder.Services.Configure<ContactFormOptions>(builder.Configuration.GetSection("ContactForm"));
builder.Services.AddOptions<TencentCosOptions>()
  .Bind(builder.Configuration.GetSection(TencentCosOptions.SectionName))
  .Validate(options => !options.Enabled ||
    (!string.IsNullOrWhiteSpace(options.AppId) &&
     !string.IsNullOrWhiteSpace(options.Region) &&
     !string.IsNullOrWhiteSpace(options.Bucket) &&
     !string.IsNullOrWhiteSpace(options.SecretId) &&
     !string.IsNullOrWhiteSpace(options.SecretKey)),
    "启用腾讯云 COS 时必须配置 AppId、Region、Bucket、SecretId 和 SecretKey。")
  .Validate(options =>
    string.Equals(options.DeliveryMode, "Proxy", StringComparison.OrdinalIgnoreCase) ||
    string.Equals(options.DeliveryMode, "Redirect", StringComparison.OrdinalIgnoreCase),
    "TencentCos:DeliveryMode 只能是 Proxy 或 Redirect。")
  .Validate(options => !options.Enabled ||
    !string.Equals(options.DeliveryMode, "Redirect", StringComparison.OrdinalIgnoreCase) ||
    Uri.TryCreate(options.CustomDomain, UriKind.Absolute, out var uri) && uri.Scheme == Uri.UriSchemeHttps,
    "COS Redirect 模式必须配置 HTTPS 自定义域名。")
  .ValidateOnStart();
builder.Services.AddSingleton<ISchoolMediaStorage, TencentCosSchoolMediaStorage>();
builder.Services.AddScoped<IAccountEmailService, AccountEmailService>();
builder.Services.AddAbuseRateLimits();
builder.Services.AddSingleton<SchoolDataFreshness>();
builder.Services.AddSingleton<SpaSeoHtmlRenderer>();
builder.Services.AddMemoryCache();
builder.Services.AddHttpClient("TencentCosMedia", client =>
{
  client.Timeout = TimeSpan.FromMinutes(30);
});
builder.Services.AddHttpClient("PinesPortal", client =>
{
  client.BaseAddress = new Uri("https://pinesportal.com/");
  client.Timeout = TimeSpan.FromSeconds(12);
  client.DefaultRequestHeaders.UserAgent.ParseAdd("SidaQihang-PublicRoomAvailability/1.0");
});
// CNY reference rates for the WeChat mini program quote calculator (see ExchangeRatesController).
builder.Services.AddHttpClient("Frankfurter", client =>
{
  client.BaseAddress = new Uri("https://api.frankfurter.dev/");
  client.Timeout = TimeSpan.FromSeconds(8);
  client.DefaultRequestHeaders.UserAgent.ParseAdd("SidaQihang-QuoteRates/1.0");
});

builder.Services.AddCors(options =>
{
  options.AddPolicy("AllowAll",
      policy => policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
});


builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();
var startupLogger = app.Services.GetRequiredService<ILoggerFactory>().CreateLogger("DatabaseStartup");
var securityLogger = app.Services.GetRequiredService<ILoggerFactory>().CreateLogger("SecurityConfiguration");
if (jwtSigningKey.Warning != null)
{
  securityLogger.LogCritical("{Warning}", jwtSigningKey.Warning);
}
if (RevokedSecrets.IsRevoked(app.Configuration["AccessCode"]))
{
  securityLogger.LogCritical(
    "AccessCode matches a value that was committed to source control and is ignored. " +
    "Set AccessCode to a new private value to re-enable administrator registration.");
}
if (!app.Environment.IsDevelopment() && string.IsNullOrWhiteSpace(app.Configuration["Authentication:PublicOrigin"]))
{
  securityLogger.LogError(
    "Authentication:PublicOrigin is not configured, so password-reset email is disabled. " +
    "Set Authentication__PublicOrigin to the site's public https origin.");
}

app.UseCors("AllowAll");
// "/" itself reaches the SPA fallback below (endpoint routing runs first), which serves the prerendered
// home page with its tags; the static index.html answers only direct /index.html requests.
app.UseDefaultFiles();
var staticContentTypes = new FileExtensionContentTypeProvider();
staticContentTypes.Mappings[".mov"] = "video/quicktime";
staticContentTypes.Mappings[".m4v"] = "video/x-m4v";
app.UseStaticFiles(new StaticFileOptions
{
  ContentTypeProvider = staticContentTypes,
  OnPrepareResponse = context =>
  {
    // llms.txt (written by scripts/export-seo-pages.cjs) is Chinese text; without a charset many HTTP
    // clients decode text/plain as Latin-1. Other .txt files, such as the WeChat check file, keep their headers.
    if (context.File.Name == "llms.txt")
    {
      context.Context.Response.ContentType = "text/plain; charset=utf-8";
      context.Context.Response.Headers.CacheControl = "no-cache";
    }
  },
});

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
  app.UseSwagger();
  app.UseSwaggerUI();
}

for (var attempt = 1; attempt <= 5; attempt++)
{
  try
  {
    using var scope = app.Services.CreateScope();
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<AppDbContext>();

    await context.Database.MigrateAsync();
    await UserRoleInitialize.Initialize(services);
    await DataInitialize.SeedAsync(services);
    break;
  }
  catch (Exception ex) when (attempt < 5)
  {
    startupLogger.LogWarning(ex, "Database startup failed on attempt {Attempt}. Retrying...", attempt);
    await Task.Delay(TimeSpan.FromSeconds(5));
  }
}

app.UseHttpsRedirection();

app.UseRateLimiter();

app.UseAuthentication();
app.UseAuthorization();

var sitemapEntries = new (string Path, string ChangeFrequency, string Priority)[]
{
  ("/", "weekly", "1.0"),
  ("/philippines-study/why-philippines", "monthly", "0.9"),
  ("/philippines-study/bohol/english-mint-international-academy", "monthly", "0.85"),
  ("/philippines-study/bohol/english-mint-international-academy/quote", "monthly", "0.75"),
  ("/philippines-study/schools/by-city", "weekly", "0.95"),
  ("/philippines-study/cebu", "weekly", "0.95"),
  ("/philippines-study/baguio", "weekly", "0.95"),
  ("/philippines-study/baguio/airport-pickup", "monthly", "0.8"),
  ("/philippines-study/clark", "weekly", "0.95"),
  ("/philippines-study/manila", "monthly", "0.85"),
  ("/philippines-study/boracay", "monthly", "0.75"),
  ("/philippines-study/bacolod", "monthly", "0.75"),
  ("/philippines-study/bacolod/e-room-language-center", "monthly", "0.75"),
  ("/philippines-study/iloilo", "monthly", "0.75"),
  ("/philippines-study/iloilo/mk-language-training-center", "monthly", "0.75"),
  ("/philippines-study/davao", "monthly", "0.75"),
  ("/philippines-study/subic", "monthly", "0.75"),
  ("/philippines-study/cost", "monthly", "0.9"),
  ("/price-compare", "weekly", "0.85"),
  ("/philippines-study/faq", "monthly", "0.85"),
  ("/philippines-study/offers", "weekly", "0.85"),
  ("/philippines-study/recommendations/ielts-schools", "monthly", "0.85"),
  ("/philippines-study/recommendations/budget-schools", "monthly", "0.85"),
  ("/philippines-study/recommendations/family-schools", "monthly", "0.85"),
  ("/philippines-study/recommendations/junior-camp", "monthly", "0.85"),
  ("/philippines-study/recommendations/sparta-schools", "monthly", "0.85"),
  ("/philippines-study/schools/by-course", "monthly", "0.85"),
  ("/philippines-study/schools/by-style", "monthly", "0.85"),
  ("/philippines-study/schools/popular", "monthly", "0.85"),
  ("/study-tour-guide/philippines", "monthly", "0.85"),
  // Static 60-day English plan served from wwwroot/study60/index.html (not an Angular route).
  ("/study60/", "monthly", "0.7"),
  ("/philippines-study/cebu/cia-cebu-international-academy", "monthly", "0.8"),
  ("/philippines-study/cebu/cia-cebu-international-academy/student-reviews/cebu-city-night-with-friends", "monthly", "0.65"),
  ("/philippines-study/cebu/cia-cebu-international-academy/student-reviews/first-overseas-english-study", "monthly", "0.65"),
  ("/philippines-study/cebu/cia-cebu-international-academy/student-reviews/cebu-nature-and-culture", "monthly", "0.65"),
  ("/philippines-study/cebu/cia-cebu-international-academy/student-reviews/memorable-cebu-trip-with-friends", "monthly", "0.65"),
  ("/philippines-study/cebu/ciec", "monthly", "0.8"),
  ("/overseas-study-tour/uk/burlington-school", "monthly", "0.8"),
  ("/overseas-study-tour/ireland/atc-language-schools", "monthly", "0.8"),
  ("/philippines-study/cebu/elsa-international-language-school", "monthly", "0.8"),
  ("/philippines-study/cebu/ethos-language-school", "monthly", "0.8"),
  ("/philippines-study/cebu/ims-academy", "monthly", "0.8"),
  ("/philippines-study/cebu/target-global-english-academy", "monthly", "0.8"),
  ("/philippines-study/cebu/iu-english-academy", "monthly", "0.8"),
  ("/philippines-study/cebu/cg-academy-banilad-campus", "monthly", "0.8"),
  ("/philippines-study/cebu/ev-academy", "monthly", "0.8"),
  ("/philippines-study/cebu/ev-la-mer", "monthly", "0.8"),
  ("/philippines-study/cebu/cpi-cebu-pelis-institute", "monthly", "0.8"),
  ("/philippines-study/cebu/bcebu", "monthly", "0.8"),
  ("/philippines-study/cebu/btes-english-academy", "monthly", "0.8"),
  ("/philippines-study/cebu/cpils", "monthly", "0.8"),
  ("/philippines-study/cebu/english-fella-first-campus", "monthly", "0.8"),
  ("/philippines-study/cebu/english-fella-second-campus", "monthly", "0.8"),
  ("/philippines-study/cebu/philinter-academy", "monthly", "0.8"),
  ("/philippines-study/cebu/cg-academy-sparta-campus", "monthly", "0.8"),
  ("/philippines-study/cebu/smeag-capital", "monthly", "0.8"),
  ("/philippines-study/cebu/smeag-encanto", "monthly", "0.75"),
  ("/philippines-study/cebu/ibreeze", "monthly", "0.8"),
  ("/philippines-study/cebu/icl", "monthly", "0.8"),
  ("/philippines-study/cebu/global-language-cebu", "monthly", "0.8"),
  ("/philippines-study/cebu/cella-uni-sparta-campus", "monthly", "0.8"),
  ("/philippines-study/cebu/cella-premium-campus", "monthly", "0.8"),
  ("/philippines-study/cebu/cebu-blue-ocean-academy", "monthly", "0.8"),
  ("/philippines-study/cebu/glant", "monthly", "0.75"),
  ("/philippines-study/cebu/cij-academy-premium-campus", "monthly", "0.75"),
  ("/philippines-study/cebu/3d-academy", "monthly", "0.75"),
  ("/philippines-study/cebu/curious-world-academy", "monthly", "0.75"),
  ("/philippines-study/cebu/first-english-global-college", "monthly", "0.75"),
  ("/philippines-study/cebu/genius-english-academy", "monthly", "0.75"),
  ("/philippines-study/cebu/howdy-english-academy", "monthly", "0.75"),
  ("/philippines-study/cebu/lapulapu", "monthly", "0.75"),
  ("/philippines-study/cebu/qqenglish-beachfront-campus", "monthly", "0.75"),
  ("/philippines-study/cebu/stargate-global-education", "monthly", "0.75"),
  ("/philippines-study/cebu/winning-english-academy", "monthly", "0.75"),
  ("/philippines-study/boracay/boracay-coco-english-academy", "monthly", "0.7"),
  ("/philippines-study/boracay/paradise-english-boracay-language-institute", "monthly", "0.7"),
  ("/philippines-study/iloilo/gitc-college-international-language-center", "monthly", "0.7"),
  ("/philippines-study/iloilo/polyglot-international-academy", "monthly", "0.7"),
  ("/philippines-study/iloilo/we-academy", "monthly", "0.7"),
  ("/philippines-study/baguio/pines-international-academy", "monthly", "0.8"),
  ("/philippines-study/baguio/beci-eop-campus", "monthly", "0.8"),
  ("/philippines-study/baguio/beci-sparta-campus", "monthly", "0.8"),
  ("/philippines-study/baguio/api-beci-city-campus", "monthly", "0.8"),
  ("/philippines-study/baguio/baguio-jic-challenger", "monthly", "0.8"),
  ("/philippines-study/baguio/baguio-jic-premium", "monthly", "0.8"),
  ("/philippines-study/baguio/monol", "monthly", "0.8"),
  ("/philippines-study/baguio/monol-sparta-campus", "monthly", "0.8"),
  ("/philippines-study/baguio/wales-academy", "monthly", "0.8"),
  ("/philippines-study/baguio/anj-e-edu-english-academy", "monthly", "0.8"),
  ("/philippines-study/baguio/help-english-longlong-campus", "monthly", "0.8"),
  ("/philippines-study/clark/cip-english-kepos", "monthly", "0.8"),
  ("/philippines-study/clark/talk-academy", "monthly", "0.75"),
  ("/philippines-study/clark/eg-academy", "monthly", "0.8"),
  ("/philippines-study/clark/clark-we-academy", "monthly", "0.8"),
  ("/philippines-study/clark/help-english-clark", "monthly", "0.8"),
  ("/philippines-study/clark/aelc-native-focused-clark-schools", "monthly", "0.8"),
  ("/philippines-study/clark/hana-academy", "monthly", "0.8"),
  ("/philippines-study/manila/enderun-extension", "monthly", "0.75"),
  ("/philippines-study/manila/american-english-skills-development-center", "monthly", "0.75"),
  ("/philippines-study/manila/berlitz-philippines", "monthly", "0.75"),
  ("/philippines-study/manila/manila-business-college", "monthly", "0.75"),
  ("/about-sida/about", "monthly", "0.9"),
  ("/about-sida/contact", "monthly", "0.8"),
  ("/student-feedback/study-tour", "monthly", "0.7"),
  ("/student-feedback/study-tour/philippines-study-mid-autumn", "yearly", "0.7"),
};

app.MapGet("/robots.txt", (HttpRequest request) =>
{
  var origin = GetPublicOrigin(request, app.Configuration);
  var robots = string.Join('\n', new[]
  {
    "User-agent: *",
    "Allow: /",
    "Allow: /student-feedback/",
    "Disallow: /admin",
    "Disallow: /student",
    "Disallow: /login",
    "Disallow: /register",
    "Disallow: /reset-password",
    $"Sitemap: {origin}/sitemap.xml",
    string.Empty,
  });

  return Results.Text(robots, "text/plain; charset=utf-8");
});

app.MapGet("/sitemap.xml", (HttpRequest request) =>
{
  var origin = GetPublicOrigin(request, app.Configuration);
  XNamespace ns = "http://www.sitemaps.org/schemas/sitemap/0.9";
  var urls = sitemapEntries.Select(entry =>
    new XElement(
      ns + "url",
      new XElement(ns + "loc", $"{origin}{entry.Path}"),
      new XElement(ns + "changefreq", entry.ChangeFrequency),
      new XElement(ns + "priority", entry.Priority)));
  var document = new XDocument(new XDeclaration("1.0", "utf-8", null), new XElement(ns + "urlset", urls));

  return Results.Text(document.ToString(SaveOptions.DisableFormatting), "application/xml; charset=utf-8");
});

app.MapControllers();

// SPA fallback with each route's own <title>/description/Open Graph/canonical tags in the HTML, for
// crawlers and link previews (Baidu, WeChat) that do not run JavaScript. See SpaSeoHtmlRenderer.
app.MapFallback(async (HttpContext context, SpaSeoHtmlRenderer seoHtml) =>
{
  var path = context.Request.Path.Value ?? "/";

  // A wwwroot folder with its own index.html (for example /study60/) is a separate static site.
  // Endpoint routing picks this fallback before UseDefaultFiles can rewrite the directory request,
  // so serve that index.html here, after redirecting to the trailing slash its relative links need.
  var staticSiteIndex = FindStaticSiteIndex(app.Environment, path);
  if (staticSiteIndex != null)
  {
    if (!path.EndsWith('/'))
    {
      return Results.Redirect($"{path}/{context.Request.QueryString}", permanent: true);
    }

    context.Response.Headers.CacheControl = "no-cache";
    return Results.File(staticSiteIndex, "text/html; charset=utf-8");
  }

  var html = await seoHtml.RenderAsync(path, GetPublicOrigin(context.Request, app.Configuration), context.RequestAborted);
  if (html == null)
  {
    return Results.NotFound();
  }

  context.Response.Headers.CacheControl = "no-cache";
  return Results.Content(html, "text/html; charset=utf-8");
});

app.Run();

static string? FindStaticSiteIndex(IWebHostEnvironment environment, string requestPath)
{
  var directory = requestPath.Trim('/');
  if (directory.Length == 0)
  {
    return null;
  }

  // The physical provider rejects ".." and absolute paths, so this cannot leave wwwroot.
  var index = environment.WebRootFileProvider.GetFileInfo($"{directory}/index.html");
  return index.Exists && !index.IsDirectory ? index.PhysicalPath : null;
}

static string GetPublicOrigin(HttpRequest request, IConfiguration configuration)
{
  // Prefer the configured canonical origin so request headers cannot change sitemap/robots URLs.
  var configuredOrigin = configuration["Authentication:PublicOrigin"]?.Trim().TrimEnd('/');
  if (!string.IsNullOrWhiteSpace(configuredOrigin) && Uri.TryCreate(configuredOrigin, UriKind.Absolute, out _))
  {
    return configuredOrigin;
  }

  var forwardedProto = request.Headers["X-Forwarded-Proto"].FirstOrDefault();
  var scheme = string.IsNullOrWhiteSpace(forwardedProto) ? request.Scheme : forwardedProto.Split(',')[0].Trim();

  var forwardedHost = request.Headers["X-Forwarded-Host"].FirstOrDefault();
  var host = string.IsNullOrWhiteSpace(forwardedHost) ? request.Host.Value : forwardedHost.Split(',')[0].Trim();

  return $"{scheme}://{host}".TrimEnd('/');
}

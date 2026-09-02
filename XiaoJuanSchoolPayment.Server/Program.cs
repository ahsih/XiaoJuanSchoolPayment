using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Xml.Linq;
using XiaoJuanSchoolPayment.Server.Data;
using XiaoJuanSchoolPayment.Server.Data.Config;
using XiaoJuanSchoolPayment.Server.Data.Models;
using XiaoJuanSchoolPayment.Server.Interface;
using XiaoJuanSchoolPayment.Server.Services;
using XiaoJuanSchoolPayment.Server.Services.Currency;
using XiaoJuanSchoolPayment.Server.Services.School;

var builder = WebApplication.CreateBuilder(args);
// Prevent cookie auth from redirecting for APIs (return 401/403 instead)
builder.Services.ConfigureApplicationCookie(o =>
{
  o.Events.OnRedirectToLogin = ctx => { ctx.Response.StatusCode = 401; return Task.CompletedTask; };
  o.Events.OnRedirectToAccessDenied = ctx => { ctx.Response.StatusCode = 403; return Task.CompletedTask; };
});
// 1. Add authentication
builder.Services.AddAuthentication(options =>
{
  options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
  options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
  options.TokenValidationParameters = new TokenValidationParameters
  {
    ValidateIssuer = true,
    ValidateAudience = true,
    ValidateLifetime = false,
    ValidateIssuerSigningKey = true,
    ValidIssuer = builder.Configuration["Jwt:Issuer"],
    ValidAudience = builder.Configuration["Jwt:Audience"],
    IssuerSigningKey = new SymmetricSecurityKey(
          Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"])),
    RoleClaimType = "role"
  };
});

// 2. Add authorization
builder.Services.AddAuthorization(options =>
{
  options.DefaultPolicy = new AuthorizationPolicyBuilder(JwtBearerDefaults.AuthenticationScheme)
      .RequireAuthenticatedUser()
      .Build();
});

// Add services to the container.
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("DefaultConnection"))
    ));

builder.Services.AddIdentity<SchoolUser, IdentityRole>()
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders();

builder.Services.AddScoped<ISchoolService, SchoolService>();
builder.Services.AddScoped<ICurrencyService, CurrencyService>();
builder.Services.Configure<ContactFormOptions>(builder.Configuration.GetSection("ContactForm"));
builder.Services.AddMemoryCache();
builder.Services.AddHttpClient("PinesPortal", client =>
{
  client.BaseAddress = new Uri("https://pinesportal.com/");
  client.Timeout = TimeSpan.FromSeconds(12);
  client.DefaultRequestHeaders.UserAgent.ParseAdd("SidaQihang-PublicRoomAvailability/1.0");
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

app.UseCors("AllowAll");
app.UseDefaultFiles();
app.UseStaticFiles();

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

app.UseAuthentication();
app.UseAuthorization();

var sitemapEntries = new (string Path, string ChangeFrequency, string Priority)[]
{
  ("/", "weekly", "1.0"),
  ("/philippines-study/why-philippines", "monthly", "0.9"),
  ("/philippines-study/schools/by-city", "weekly", "0.95"),
  ("/philippines-study/cebu", "weekly", "0.95"),
  ("/philippines-study/baguio", "weekly", "0.95"),
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
  ("/philippines-study/cebu/cia-cebu-international-academy", "monthly", "0.8"),
  ("/philippines-study/cebu/cia-cebu-international-academy/student-reviews/cebu-city-night-with-friends", "monthly", "0.65"),
  ("/philippines-study/cebu/cia-cebu-international-academy/student-reviews/first-overseas-english-study", "monthly", "0.65"),
  ("/philippines-study/cebu/cia-cebu-international-academy/student-reviews/cebu-nature-and-culture", "monthly", "0.65"),
  ("/philippines-study/cebu/cia-cebu-international-academy/student-reviews/memorable-cebu-trip-with-friends", "monthly", "0.65"),
  ("/philippines-study/cebu/ciec", "monthly", "0.8"),
  ("/philippines-study/cebu/elsa-international-language-school", "monthly", "0.8"),
  ("/philippines-study/cebu/ethos-language-school", "monthly", "0.8"),
  ("/philippines-study/cebu/ims-academy", "monthly", "0.8"),
  ("/philippines-study/cebu/target-global-english-academy", "monthly", "0.8"),
  ("/philippines-study/cebu/iu-english-academy", "monthly", "0.8"),
  ("/philippines-study/cebu/cg-academy-banilad-campus", "monthly", "0.8"),
  ("/philippines-study/cebu/ev-academy", "monthly", "0.8"),
  ("/philippines-study/cebu/cpi-cebu-pelis-institute", "monthly", "0.8"),
  ("/philippines-study/cebu/bcebu", "monthly", "0.8"),
  ("/philippines-study/cebu/btes-english-academy", "monthly", "0.8"),
  ("/philippines-study/cebu/cpils", "monthly", "0.8"),
  ("/philippines-study/cebu/english-fella", "monthly", "0.8"),
  ("/philippines-study/cebu/philinter-academy", "monthly", "0.8"),
  ("/philippines-study/baguio/pines-international-academy", "monthly", "0.8"),
  ("/philippines-study/baguio/beci-international-language-academy", "monthly", "0.8"),
  ("/philippines-study/baguio/baguio-jic", "monthly", "0.8"),
  ("/philippines-study/baguio/monol", "monthly", "0.8"),
  ("/philippines-study/baguio/wales-academy", "monthly", "0.8"),
  ("/philippines-study/baguio/anj-e-edu-english-academy", "monthly", "0.8"),
  ("/philippines-study/baguio/help-english-longlong-campus", "monthly", "0.8"),
  ("/philippines-study/baguio/talk-academy", "monthly", "0.8"),
  ("/philippines-study/clark/cip-english-kepos", "monthly", "0.8"),
  ("/philippines-study/clark/eg-academy", "monthly", "0.8"),
  ("/philippines-study/clark/clark-we-academy", "monthly", "0.8"),
  ("/philippines-study/clark/help-english-clark", "monthly", "0.8"),
  ("/philippines-study/clark/aelc-native-focused-clark-schools", "monthly", "0.8"),
  ("/philippines-study/clark/hana-academy", "monthly", "0.8"),
  ("/philippines-study/manila/enderun-extension", "monthly", "0.75"),
  ("/philippines-study/manila/american-english-skills-development-center", "monthly", "0.75"),
  ("/philippines-study/manila/berlitz-philippines", "monthly", "0.75"),
  ("/philippines-study/manila/manila-business-college", "monthly", "0.75"),
  ("/philippines-study/manila/legacy-esl-candidates", "monthly", "0.75"),
  ("/about-sida/contact", "monthly", "0.8"),
};

app.MapGet("/robots.txt", (HttpRequest request) =>
{
  var origin = GetPublicOrigin(request);
  var robots = string.Join('\n', new[]
  {
    "User-agent: *",
    "Allow: /",
    "Disallow: /admin",
    "Disallow: /login",
    $"Sitemap: {origin}/sitemap.xml",
    string.Empty,
  });

  return Results.Text(robots, "text/plain; charset=utf-8");
});

app.MapGet("/sitemap.xml", (HttpRequest request) =>
{
  var origin = GetPublicOrigin(request);
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

app.MapFallbackToFile("/index.html");

app.Run();

static string GetPublicOrigin(HttpRequest request)
{
  var forwardedProto = request.Headers["X-Forwarded-Proto"].FirstOrDefault();
  var scheme = string.IsNullOrWhiteSpace(forwardedProto) ? request.Scheme : forwardedProto.Split(',')[0].Trim();

  var forwardedHost = request.Headers["X-Forwarded-Host"].FirstOrDefault();
  var host = string.IsNullOrWhiteSpace(forwardedHost) ? request.Host.Value : forwardedHost.Split(',')[0].Trim();

  return $"{scheme}://{host}".TrimEnd('/');
}

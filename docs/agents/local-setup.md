# Local setup

Moved verbatim from AGENTS.md on 2026-11-26 to keep that file small. Record new decisions about this topic here; AGENTS.md holds only rules that apply to every task.

## Local setup

Prerequisites:

- Node.js 22 and npm.
- .NET 10 SDK.
- MySQL 8 or a compatible MariaDB instance.
- A trusted ASP.NET development HTTPS certificate (`dotnet dev-certs https --trust`) if using HTTPS locally.

Install the client dependencies:

```powershell
cd xiaojuanschoolpayment.client
npm ci
cd ..
```

Configure secrets outside source control. ASP.NET Core environment variables use double underscores for nested keys. A minimal PowerShell example is:

```powershell
$env:ConnectionStrings__DefaultConnection = "server=localhost;port=3306;database=SchoolPayment;user=<user>;password=<password>"
$env:Jwt__Key = "<long-random-development-key>"
$env:Jwt__Issuer = "SchoolPayment"
$env:Jwt__Audience = "YourAppUsers"
$env:AccessCode = "<private-registration-code>"
$env:Authentication__PublicOrigin = "https://www.example.com"
```

SMTP is required to exercise contact delivery, quote-email delivery, and password recovery. Configure it with `ContactForm__RecipientEmail`, `ContactForm__SenderEmail`, `ContactForm__Smtp__Host`, `__Port`, `__Username`, `__Password`, and `__EnableSsl` environment variables or .NET user secrets.

Committed `appsettings*.json` files keep `Jwt:Key`, `AccessCode` and `ContactForm:Smtp:Password` empty. For local Development use .NET user secrets (the server project already has a `UserSecretsId`), for example `dotnet user-secrets set "Jwt:Key" "<32+ byte random value>" --project XiaoJuanSchoolPayment.Server`. Never put real values back into the JSON files. The local-development `ConnectionStrings:DefaultConnection` is still committed because production may currently depend on it; move it to the production `.env` before blanking it.

Production school media can use the private Tencent COS bucket configured by `TencentCos`. Set `TencentCos__Enabled=true`, `TencentCos__SecretId`, and `TencentCos__SecretKey` outside source control; `AppId`, `Region`, and `Bucket` may also be overridden with environment variables. The default `Proxy` delivery mode streams signed private objects through `/school/media-file/<id>` and does not require a browser-usable COS default domain or CORS. `Redirect` mode is optional and requires an HTTPS `TencentCos__CustomDomain`. Uploaded COS objects remain inaccessible through the stable route while inactive; authenticated editor responses receive short-lived preview URLs, and publishing activates the database record. Keep stable URLs, not signed COS URLs or preview-token URLs, in `SchoolContentRevision` JSON.

Start from Visual Studio by opening the solution and launching the HTTPS profile, or run:

```powershell
dotnet run --project XiaoJuanSchoolPayment.Server --launch-profile https
```

The Visual Studio SPA proxy integration normally starts the Angular client after `npm ci`. If running the two processes separately, use a second terminal:

```powershell
cd xiaojuanschoolpayment.client
npm start
```

Useful local URLs:

- Angular: `https://localhost:53747`
- API/Swagger: `https://localhost:7209/swagger`
- HTTP API fallback: `http://localhost:5023`

On API startup, `Program.cs` retries database access, applies pending migrations, creates the `Admin`, `Staff`, `User`, and `Student` roles, and runs the insert-only `DataInitialize.SeedAsync`. The initializer adds missing baseline records but preserves all existing rows and values. A reachable database is therefore required for normal startup, and manual `dotnet ef database update` is usually unnecessary.

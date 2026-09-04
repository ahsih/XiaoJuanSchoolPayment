# AI repository guide

This file applies to the whole repository. Read it before changing code. Keep it current when architecture, setup, routes, or deployment behavior changes.

## Product summary

XiaoJuanSchoolPayment is the codebase for **思达启航教育 (Sida Qihang Education)**, a Chinese-language education consultancy website. Despite the original project name, it is now broader than school payments. The public site markets and explains:

- Ireland undergraduate, postgraduate, foundation, visa, accommodation, and pre-departure services.
- Philippines English-study destinations, language schools, courses, accommodation, and fees.
- Online English courses, overseas study tours, guides, student feedback, and company information.
- School-specific quote calculators backed by database pricing.
- Contact and quote-image email forms.

There is also a JWT-protected admin area for maintaining schools, lessons, rooms, fees, notes, and uploaded school photos. Registration requires a configured access code and currently creates an Admin user.

## Architecture at a glance

```text
Angular browser app
  |-- public content and static assets
  |-- relative HTTP calls (/school, /auth, /contact-form, ...)
  v
ASP.NET Core API and static-file host
  |-- ASP.NET Identity + JWT roles
  |-- EF Core migrations and startup seed data
  |-- SMTP contact/quote delivery
  v
MySQL/MariaDB database
```

- Frontend: Angular 19, TypeScript 5.7, RxJS, Angular Material, Karma/Jasmine.
- Backend: ASP.NET Core 8, EF Core 9, Pomelo MySQL provider, ASP.NET Identity, JWT bearer authentication, Swagger.
- Production container: builds Angular with Node 22, publishes the .NET API, and serves the Angular build from `wwwroot` on port 8080.
- Development: Angular runs at `https://localhost:53747` and proxies API paths to the ASP.NET server, normally `https://localhost:7209`.

## Repository map

- `XiaoJuanSchoolPayment.sln`: Visual Studio solution containing the client and server projects.
- `xiaojuanschoolpayment.client/`: Angular application.
  - `src/app/app-routing.module.ts`: canonical client route table. It is large and mixes NgModule components with lazy standalone components.
  - `src/app/config/navigation.config.ts`: navbar/menu hierarchy. Routes added to the router are not added here automatically.
  - `src/app/pages/`: public pages, school pages, login/register pages, and admin screens.
  - `src/app/components/`: reusable UI such as navigation, expandable images, shared sections, and quote-image download behavior.
  - `src/services/`: authentication, school API, currency, SEO, and translation services. These intentionally sit beside `src/app`, not inside it.
  - `src/interfaces/`: client DTOs and request filters corresponding to server DTOs.
  - `src/guard/role.guard.ts`: protects `/admin` by checking the JWT and the `Admin` role.
  - `public/assets/`: source-controlled images and other browser assets. Angular copies `public/` into the build output.
  - `src/proxy.conf.js`: development proxy paths and backend target selection.
- `XiaoJuanSchoolPayment.Server/`: ASP.NET Core API.
  - `Program.cs`: dependency setup, auth, CORS, middleware, database migration/seed startup, robots.txt, sitemap, and SPA fallback.
  - `Controllers/`: HTTP endpoints for auth, school data, currency, contact email, and quote email.
  - `Data/Models/`: EF Core and Identity entities.
  - `Data/DTO/` and `Data/Filter/`: API contracts and query filters.
  - `Services/School/SchoolService.cs`: school CRUD/query logic and physical photo storage.
  - `Services/DataInitialize.cs`: large, idempotent-ish seed/upsert routine for currencies, schools, pricing, rooms, lessons, fees, and notes.
  - `Migrations/`: EF Core schema history. Do not hand-edit the model snapshot.
  - `wwwroot/uploads/`: runtime school-photo storage; only `.gitkeep` is source controlled.
- `Dockerfile`: multi-stage production build.
- `.github/workflows/deploy-github-pages.yml`: builds and publishes the static Angular frontend to GitHub Pages. API-dependent features require a separate reachable backend and will not work from a static-only deployment without additional configuration.
- `Logo/`, the Chinese `.docx` files, and the Chinese `.xlsx` files at the root are reference/source material, not runtime code.
- PNG files and `*.log` files near the client root are development screenshots/logs, not Angular source assets.

## Main data model and API behavior

`AppDbContext` extends `IdentityDbContext<SchoolUser>` and contains:

- `School`: parent record.
- `SchoolLesson`: course, duration in weeks, price, currency, description, and note.
- `SchoolRoom`: accommodation option, duration, price, currency, and description.
- `SchoolFee`: additional fee, currency, description, and last-updated time.
- `SchoolNote`: free-form school note.
- `SchoolPhoto`: metadata for a file stored under `wwwroot/uploads/schools/<school-id>/`.
- `Currency`: code and symbol.
- `SchoolUser`: ASP.NET Identity user with first and last name.

Key endpoint groups use route prefixes without `/api`:

- `/auth`: register and login.
- `/school`: public read endpoints; Admin-only create/update/photo-delete endpoints.
- `/currency`: Admin-only currency lookup.
- `/contact-form/send`: anonymous JSON contact submission through SMTP.
- `/quote-email/send`: anonymous multipart upload that emails a generated quote PNG.
- `/pines-room-availability`: anonymous read-only PINES room availability feed; the server fetches fixed public school endpoints and returns only sanitized Main/IELTS dates, male/female vacancies, and exact continuous-stay options. The `/stay-options` child route supports the public room-plan calculator without exposing portal identifiers or navigation.
- `/uploads`: static uploaded files through ASP.NET static-file middleware.

The Angular services use relative URLs so the development proxy and production same-origin hosting both work. Preserve this unless deployment is intentionally changed.

## Two content/data layers

Do not assume all visible information comes from the database:

1. Marketing copy, school descriptions, feature lists, citations, and many image references are stored directly in page component `.ts` arrays and `.html` templates.
2. Interactive quote/course/room/fee data comes from MySQL through `SchoolService`; initial values are created or updated by `Services/DataInitialize.cs`.

CG Banilad and CG Sparta use page-local course/room pricing and share their user-confirmed local-fee estimates in `src/app/pages/philippines/cg-local-fees.ts`. Their webpages and quote images reuse the same fee amounts, quantities, and notes; keep both campuses synchronized when changing these estimates.
CG Sparta is displayed as “CG斯巴达校区” in public copy and quote images. Keep its existing route slug, asset paths, course IDs, and database lookup names unchanged when localizing display labels.
CG Sparta quotes support independent course and accommodation rows, each with 1–52 whole weeks and its own editable Sunday start date; the Saturday end date is calculated. New rows default to the next Sunday, but editing/deleting one row does not shift other rows. Per-list duration and the full stay span are limited to 52 weeks; overlapping rows within one list block export, while unmatched course/room dates show a warning and are billed separately. Display bilingual course names and a compact course-schedule column. Each row uses 40%/60%/85% of the four-week rate for 1/2/3 weeks (CG public short-stay percentages); longer rows are proportional estimates. Registration is charged once; management/utilities use accommodation weeks, visas use the first-to-last stay span including gaps. The user approved extending visa fees beyond the fifth extension at 4,460 pesos per additional 30-day extension; keep the estimate note identical in the webpage and image. Long-stay discounts are capped at the published 200-dollar tier and continuous course periods are evaluated separately. Over-24-week estimates flag permit renewals and additional actual charges for school confirmation. Quote images merge every course/accommodation row into the school payment table, with bilingual `detailTitle`, date/week `detailSubtitle`, and the complete course schedule in the note; do not add a separate plan table or duplicate aggregate course/room rows. Full-detail images preserve all payment rows, not just the first seven, and size rows dynamically. Keep image footnotes concise and applicable to the selected plan while preserving verbatim webpage local-fee notes. Other schools retain their existing UI and image layouts.

CIA, CG Banilad, SMEAG Capital, CPI, and CPILS use the shared multi-row quote plan in `src/app/components/school-quote-plan*`, with separate course and accommodation periods capped at 24 weeks. Each row retains its own type, weeks, Sunday start date, Saturday end date, price, and school-specific rules. Keep webpage and generated-image rows synchronized, charge registration only once, block overlapping periods, and preserve each school's discounts, surcharges, local fees, and course-linked extras. Quote-image headings should be only the school/campus name plus total course weeks and “报价”; avoid duplicate recaps such as “组合方案” or “停留跨度”.

EV Academy quotes use the same independent course/accommodation list pattern with a maximum of 24 weeks per list and a maximum 24-week full-stay span. Preserve EV's existing 40%/65%/85% short-stay ratios, 95% course/accommodation price, minor fee and peak-season rules. Registration is charged once. Management and utilities use accommodation weeks, textbooks use course weeks, and visa/document estimates use the first-to-last stay span including gaps. Mixed campus/off-campus stays show and calculate both management-fee rows from their respective accumulated accommodation weeks. Overlapping rows block image export; unmatched course/room dates show a warning and remain separately billable. Quote images use CG's dynamically sized school-payment rows for every selected course/accommodation, including names, dates, weeks and course schedules. Use the exact image heading pattern “EV主校区{累计课程周数}周报价”, including multi-row quotes; omit the subtitle, “组合” label and stay-span recaps. Stay span remains an internal calculation input, not a displayed summary. Keep local-fee introductory text, all fee notes and displayed currency rounding identical to the webpage; image footnotes include only applicable short-stay/proration and date-mismatch rules, with discounts and applicable surcharges explained in their payment rows.

Before changing school content or pricing, search for the school name across both projects. Update the static page, seed data, and pricing lookup name together when the requested change affects all of them. The string used by `getSchools({ name: ... })` must continue to match a seeded/database school name.

## Local setup

Prerequisites:

- Node.js 22 and npm.
- .NET 8 SDK.
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
```

SMTP is only required to exercise the contact and quote-email endpoints. Configure it with `ContactForm__RecipientEmail`, `ContactForm__SenderEmail`, `ContactForm__Smtp__Host`, `__Port`, `__Username`, `__Password`, and `__EnableSsl` environment variables or .NET user secrets.

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

On API startup, `Program.cs` retries database access, applies pending migrations, creates the `Admin` and `User` roles, and runs `DataInitialize.SeedAsync`. A reachable database is therefore required for normal startup, and manual `dotnet ef database update` is usually unnecessary.

## Build and test commands

Run the checks relevant to the files changed:

```powershell
npm --prefix xiaojuanschoolpayment.client run build
dotnet build XiaoJuanSchoolPayment.Server/XiaoJuanSchoolPayment.Server.csproj
npm --prefix xiaojuanschoolpayment.client test -- --watch=false --browsers=ChromeHeadless
docker build -t xiaojuan-school-payment .
```

The solution-level build also evaluates the `.esproj` and therefore needs the Visual Studio JavaScript SDK; build the server `.csproj` directly in a plain .NET SDK environment. There is no backend test project at present. The Angular suite has component specs, but some older generated specs may require maintenance as components gain dependencies. Report pre-existing failures; do not hide them.

For visual work, verify both desktop and narrow mobile layouts. Important public pages are content-heavy, and a successful compiler build does not catch overflow, clipped Chinese text, broken image paths, or mobile menu regressions.

## Common change workflows

### Add or change a public page

1. Follow a nearby page's component pattern. Most newer content pages are standalone and lazy loaded; older shell pages are declared in `AppModule`.
2. Add or update the route in `src/app/app-routing.module.ts`.
3. Update `src/app/config/navigation.config.ts` if the page belongs in the menu.
4. Add/update metadata in `src/services/seo.service.ts` for an indexable page.
5. Add/update the manual `sitemapEntries` list in server `Program.cs`.
6. Put local browser images in `xiaojuanschoolpayment.client/public/assets/<feature-or-school>/` and reference them as `/assets/...`.
7. Test direct navigation and the mobile navbar, not only in-app links.

### Change database-backed school pricing

1. Find the page's `SchoolService` lookup and requested `week` filter.
2. Update the matching section in `Services/DataInitialize.cs` when the value is canonical seed data.
3. Keep currency IDs aligned with the seeded currencies.
4. Ensure startup seeding updates existing rows as intended; some helper methods only insert missing rows while others upsert.
5. Verify the public calculator and the matching admin table.

### Change the schema or API contract

1. Change server model/DTO/filter/service/controller layers as appropriate.
2. Create an EF Core migration; do not rewrite an already-deployed migration.
3. Update the matching TypeScript interface and service call.
4. Check authorization explicitly: reads are generally public, mutations are Admin-only.
5. Build both projects and exercise the endpoint through the Angular proxy.

### Add an admin feature

Keep `/admin` under `RoleGuard`, use `[Authorize(Roles = "Admin")]` for server mutations, and attach the bearer token in the Angular service. Do not rely on the client guard as the security boundary.

## Conventions and safe-edit rules

- Shared quote-image exports use an in-page real-image preview on phones/tablets and WeChat; users long-press to save, with file sharing only when supported and triggered by a fresh tap. Do not automatically navigate WeChat to a blob download or claim that a webpage can silently write to the photo album. Desktop download URLs live for at least 60 seconds. Keep PNG non-empty/decode validation, bounded asset/encoding timeouts, one lower-resolution retry, mobile canvas size/pixel budgets, and bitmap cleanup. Detailed quotes must not load unused consultant avatars/QRs. Preserve quote contents and fee calculations when changing the export path; actual iOS/Android WeChat saving still needs physical-device acceptance testing.
- Quote-image brand headers sample the existing high-resolution `sida-qihang-navbar-logo.jpg` artwork directly and draw the two-line tagline as canvas text. Keep the approved header placement; do not upscale the old 427×54 header PNG or rasterize the tagline into that small asset again.
- Full-detail quote images align the payment, local-fee, total, and optional-fee tables on shared project/notes boundaries; align monetary amounts to one right edge. The local-fee middle group retains its rate, quantity, and subtotal subdivisions. Use the short heading “学校费用明细”. Promotion names stay dark bold, monetary discounts/discount rates are orange, and conditions use regular gray text; non-cash benefits and pending statuses stay neutral. Preserve all fee calculations.
- `applySchoolQuoteImageLayout` fixes the shared image layout and section headings; `presentSchoolQuote` uses it for CIA, CG Banilad, SMEAG Capital, CPI, and CPILS. CG Sparta also uses this presentation helper and the same webpage list styling, while retaining its independent 52-week calculator and Sunday-only date picker. Do not replace CG Sparta's rules with the other schools' 24-week model. Single-course/single-room selections remove only their excess rows and numbering, never switch templates. Rollout tests also cover one course with three rooms and three courses with one room, asserting shared column edges, amount alignment, promotion colors and complete lower sections.

- Full-detail quote images use regular-weight notes, right-aligned monetary amounts, and content-sized service/footer cards. Consolidate exchange-rate and generic final-confirmation notes once in the footer; place any date-coverage mismatch first and emphasize it. Keep course details, local-fee explanations, promotion conditions, and additional-payment warnings (such as CIA IAU registration) beside their relevant rows or totals.
- EV's discount/rate preview uses the actual monetary deduction in the discount amount column, with the discount percentage and eligible fees only in the note. Its `conversionRates` contains the calculator's actual rates: show dollar-to-renminbi and renminbi-to-peso references as regular gray text below their respective renminbi totals, with the snapshot date once in the footer. Never infer rates from rounded totals or label fallback rates as live. Other schools have not yet opted into this preview change.
- CIA, CG Banilad, SMEAG Capital, CPI, and CPILS all use this approved full-detail image layout. Render course periods first and accommodation periods next, chronologically within each group without mutating editable rows; omit numbering for single periods. Short-stay footnotes use each school's existing multipliers only for selected short periods. Keep visa notes current-plan-specific and identical to the webpage, without unrelated duration examples. Regression coverage renders 1/3/4 course-and-room periods for every school and checks the complete image through the footer.
- Full-detail quote images place course and accommodation names in the first “项目” column, with their row label as secondary text; keep dates and schedules in “说明” without repeating the name. Measure both columns for wrapping and row height. Local-fee introductory text has no orange accent bar, and optional pickup/deposit amounts use neutral dark text. Preserve orange emphasis on totals and the existing alumni-benefit highlight.
- Quote-image short-stay notes appear only when a selected row uses that rule. CG visa notes and rate references are conditional on the current extension count; do not print unrelated 12/16/20/24-week examples. Preserve the 59-day assumption, the 30-day-visa caveat, and (only beyond five extensions) the extended-fee-estimate caveat. Webpage and image reuse these notes without changing fee calculations.
- Preserve Chinese user-facing copy unless the task explicitly changes wording or language behavior.
- 报价单文案偏好（用户明确要求）：突出学校、周数、所选课程和房型、日期、金额及必要条件；同一信息只在最合适的位置说明一次，不换不同说法重复堆叠。不要主动添加“停留跨度”“组合方案”“默认报价参考房型”或内部计算过程等无助于学生决策的文字；保留影响实际费用、资格或安排的必要细节。标题直接用“学校/校区 + 周数 + 报价”，计算逻辑与界面文案分开处理。
- 所有学校的费用展示统一使用中文币种名称：美元、比索、人民币等，不使用 USD、PHP、CNY 等英文币种代码作为展示文案。此规则适用于课程与住宿价格、报价计算器、学杂费、优惠及附加费说明，以及生成的报价图片。内部计算、API 字段、数据库币种代码和 ID 保持原有含义，不因展示中文化而更改。后续调整任一学校费用时，同时检查网页与报价图片的一致性。
- Reuse a neighboring page's layout and shared CSS before inventing another school-detail pattern. Shared styles include files such as `school-detail-layout.css`, `cebu-school-detail-layout.css`, and school-family component styles.
- Keep API paths relative and keep DTO property meaning synchronized across C# and TypeScript.
- Avoid broad mechanical formatting of the very large route, seed, SEO, and navigation files; make focused edits to reduce merge conflicts.
- Do not edit generated output (`dist`, `bin`, `obj`, `.angular`, browser profiles, screenshots, or logs) as source code.
- Do not overwrite unrelated working-tree changes. At the time this guide was created, developers commonly used screenshot-based visual review, so root/client PNGs may be intentional evidence rather than production assets.
- When a school name or route slug changes, search the whole repository. It may appear in routes, navigation, SEO, sitemap entries, static page data, seed aliases, calculators, and tests.
- Uploaded files and database contents are separate state. Back up both before destructive data or photo operations.

## Security and deployment cautions

- Configuration files in the current history contain development database/auth values and an SMTP credential. Never quote those values in tickets, prompts, logs, or documentation. Replace committed secrets with environment variables/user secrets and rotate exposed credentials before any real deployment.
- `ValidateLifetime` is currently disabled for JWT validation, CORS allows any origin, and access-code registration grants the Admin role. Treat these as known security risks and review them before exposing the API publicly.
- Swagger is enabled only in Development.
- The Docker image does not contain MySQL; supply `ConnectionStrings__DefaultConnection` at runtime.
- Uploaded school photos are written to the container/local filesystem. Mount persistent storage in production or uploads will disappear when the container is replaced.
- The GitHub Pages workflow deploys only static frontend files. Same-origin relative API requests will target GitHub Pages and fail unless a backend/base-URL strategy is added.

## Definition of done

A change is complete when the requested behavior works, relevant client/server builds pass, desktop and mobile layouts are checked for visual changes, route/navigation/SEO/sitemap entries are synchronized when applicable, and no secret or generated artifact was added to the commit.

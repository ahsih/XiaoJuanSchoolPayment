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
- `SchoolUser`: ASP.NET Identity user with first and last name. Admin accounts use the employee backend; Student accounts use the student portal.
- `StudentApplication`: a student's school application, course/accommodation summary, dates, status, student-visible notes, and employee-only notes. One student can have multiple applications.
- `StudentApplicationDocument`: private application files such as quotes and offer letters. Files are stored outside `wwwroot` under `App_Data/student-documents` and are downloaded only through an authorized endpoint.

Key endpoint groups use route prefixes without `/api`:

- `/auth`: register and login.
- `/school`: public read endpoints; Admin-only create/update/photo-delete endpoints.
- `/currency`: Admin-only currency lookup.
- `/contact-form/send`: anonymous JSON contact submission through SMTP.
- `/quote-email/send`: anonymous multipart upload that emails a generated quote PNG.
- `/student-applications`: Admin-only student/account/application management and document upload; `/student-applications/me` returns only the signed-in student's applications. Document downloads enforce Admin access or matching Student ownership.
- `/pines-room-availability`: anonymous read-only PINES room availability feed; the server fetches fixed public school endpoints and returns only sanitized Main/IELTS dates, male/female vacancies, and exact continuous-stay options. The `/stay-options` child route supports the public room-plan calculator without exposing portal identifiers or navigation.
- `/uploads`: static uploaded files through ASP.NET static-file middleware.

The existing `/admin` area is the employee backend. `/student` is the Student-role portal. Employees create student accounts with a temporary password; students cannot self-register and can change their password after login. Keep student documents out of public static-file folders. `StudentDocuments__RootPath` can point document storage at a persistent mounted directory in production; the default is `App_Data/student-documents` under the server content root.

The Angular services use relative URLs so the development proxy and production same-origin hosting both work. Preserve this unless deployment is intentionally changed.

## Two content/data layers

Do not assume all visible information comes from the database:

1. Marketing copy, school descriptions, feature lists, citations, and many image references are stored directly in page component `.ts` arrays and `.html` templates.
2. Interactive quote/course/room/fee data comes from MySQL through `SchoolService`; initial values are created or updated by `Services/DataInitialize.cs`.

CG Banilad and CG Sparta use page-local course/room pricing and share their user-confirmed local-fee estimates in `src/app/pages/philippines/cg-local-fees.ts`. Their webpages and quote images reuse the same fee amounts, quantities, and notes; keep both campuses synchronized when changing these estimates. Both campuses support single-person and group quotes with independent per-student course/accommodation rows, age information, visa type, and returning-student status. Registration is charged once per new student and returning students are exempt. Long-term visas provisionally zero SSP, SSP E-CARD, ACR I-CARD and tourist-extension fees while retaining an adviser-confirmation warning. ARP is estimated at 300 pesos on a tourist's first extension and once for long-term visas. Local fees are computed per student and then grouped only when their fee rule and note match; unclear shared pickup/deposit units remain reference amounts rather than being multiplied automatically.
I.BREEZE uses the shared multi-row plan and full-detail image template, with its existing 4/8/12/16/20/24-week options. `ibreeze-catalog.ts` holds the user-confirmed bilingual course schedules and room descriptions; database prices remain authoritative. Off-campus water/electricity are included, so only campus accommodation periods generate water/electric charges. Under-18 students pay Junior tuition; unaccompanied minors pay 100 dollars per four weeks, including pickup and a four-weekly island trip (do not charge pickup twice). Advance multi-course plans have no course-change fee; the 100-dollar/four-week change fee applies only after arrival. Summer surcharges are 40 dollars per overlapping study week during 2026/06/28–08/15, with 2027/06/27 (Sunday)–08/14 (Saturday) estimated on the same seven-week pattern. The latest user-supplied September poster replaces the prior August offer: registration 2026/09/01–09/30 inclusive, arrival before 2026/12/27; IB1/IB2 twins receive 120 dollars per four weeks, IB1 triples and IB1/IB2 quads 200 dollars per four weeks. Christmas grants 100 dollars once per student whose course periods cover 2026/12/27–2027/01/02, including earlier arrivals; accommodation-only coverage or gaps in study do not qualify. Evaluate both offers per student and allow them together when both conditions hold. Makeup classes remain December 24 and 30, 2026, and January 9, 2027. Quote optional pickup/deposit rows carry `cnyAmount` from actual conversion inputs, rendered in regular gray text beneath the neutral amount.
- I.BREEZE students independently select a visa type: 30-day tourist (default), 59-day tourist, student, work, SRRV or SIRV. Tourist extensions use ceil(max(0, full stay days including gaps minus initial days) / 30), reusing the existing five extension prices; ACR is included once when an extension is needed. The four long-term types provisionally estimate SSP, SSP E-CARD, ACR I-CARD and extensions at zero while retaining all four rows. Each affected note identifies the selected visa and says exemption must be confirmed by the adviser with the school because requirements/policies may differ. Never present these provisional exemptions as guaranteed legal entitlements. Webpage and image reuse the same notes; group quotes keep differing visa assumptions separately student-labeled. Other fees remain unchanged, and switching back to a tourist visa restores its calculations.
- I.BREEZE group images consolidate the same cash-promotion type into one row, summing each student's numeric calculated deduction (never parsing formatted currency). Show common conditions once with eligible headcount or student identifiers; preserve student-specific differing conditions. Keep single-person images, per-student webpage calculations, course/accommodation rows, surcharges and totals unchanged. Image course/room labels use “课程名称”/“住宿名称”, keeping concrete names in the project column and amounts in the amount column.
- 菲律宾学校日期规则（用户明确要求）：入学/入住按周日，退房/离校按周六。参照上一年设置下一年档期时应对齐星期并保持对应周数，不直接照搬月日；报名截止日期等非入学/离校日期仍按学校公布或用户确认值。
- I.BREEZE报价保留三个抵达时年龄段（用户最新确认）：18岁及以上按所选课程收费；16–17岁可选其他课程但按青少年学费收费；未满16岁（最低5岁）须选青少年课程，否则提示并阻止导出。网页直接显示三条规则，图片仅保留当前适用说明。未成年时显示独立的“未成年管理费（100美元／4周）”勾选项，由顾问手动计入，不自动收取；切回成人清除管理费勾选，网页与图片一致。
- I.BREEZE supports default single-person and 2–20-person group quotes. `ibreeze-student-quote.ts` owns each student's independent age, returning-student flag, registration date, guardian selection and course/room plan. Registration is 150 dollars per new student, not per period; each person's 24-week limits, overlaps, promotions and local fees are evaluated separately. Preserve inactive student edits when changing mode/count, but exclude them from totals. Group images retain the shared full-detail template, label course/room rows by student and use “I.BREEZE N人报价” rather than adding person-weeks into the title. Identical local-fee rules aggregate amounts/quantities; different visa rules stay adjacent and identify students. Optional pickup/deposit prices remain references with renminbi estimates, not group totals; shared pickup/room deposits require school confirmation and must not be blindly multiplied by headcount. Single quotes retain their original rows and heading without student labels.
GLC's user-supplied 2026 **weekly** course/room catalog is in `src/app/pages/philippines/glc-school/glc-pricing.ts`; keep its 20 courses, six rooms, full schedules and registration note synchronized with `SeedGlcPricingAsync`. `glc-quote.ts` owns GLC's confirmed promotions and local-fee estimates, reused verbatim by the webpage and approved shared quote-image layout. Each complete four consecutive eligible study weeks within 2026-06-01–2027-07-03 or 2027-08-29–2028-01-01 earns 150 dollars; Light Power Speaking, Family, Kids and Junior courses do not receive the school discount or its study-period pickup benefit. The separate Sida-exclusive benefit is 50 dollars per complete four course weeks. There are no winter/summer surcharges. Family Package tuition is one shared course plan for two people; `GlcQuotePlan` validates accommodation separately per occupant, permitting two people to stay on the same dates while blocking overlaps for the same person. Rooms, registration and local fees are charged per person; returning students pay no registration fee. All GLC visa extensions are estimated at 4,670 pesos per additional 30 days, assuming a 59-day initial visa unless the user selects 30 days. Both quote lists and each person's stay are capped at 24 weeks. Pickup and deposit show renminbi estimates on the webpage and image using `ExchangeRateService`, explicitly labeling fallback rates. The public school API lookup remains unchanged; GLC uses API weekly tuition/room rates with the confirmed local catalog as fallback. GLC also has a separate user-confirmed Sunday-pickup offer for all courses (including Light, Family, Kids and Junior): registration dates 2026-04-05–2027-01-02 inclusive and at least four course weeks. Use the editable registration date, defaulting to today's local date, not an arrival date. Either this registration offer or the existing study-period offer can waive pickup once; never charge or gift pickup twice. Non-Sunday pickup remains 1,750 pesos, and opting out remains zero. Keep the registration window, Sunday-only condition and full fee in the optional-fee note below local fees, shared verbatim with the image. GLC's public course catalog groups all 20 bilingual courses in a full-width weekly-price/schedule section; the six accommodation types have a separate full-width section. Use the same calculator course rates for these tables, keep complete schedules, and retain the old special-fees anchor at the family group. Do not restore the duplicate course/room price matrix or removed price-update notice. GLC local-fee cells wrap within their columns rather than overflowing into quantities.

IU and ICL use `iu-icl-quote.ts` for their confirmed 2026 course, accommodation, school-package, local-fee, and IELTS-guarantee rules; keep it synchronized with `SeedIuPricingAsync` and `SeedIclPricingAsync`. Their quote pages and generated images use the I.BREEZE full-detail structure but retain IU/ICL-specific calculations. Regular 1/2/3-week tuition and accommodation are 40%/60%/80% of four weeks, and longer stays are proportional. The school low-season package applies only to same-date course and campus-accommodation rows of at least four weeks within the poster period 2026/08/23–2027/01/09, with graduation before 2027/01/16; because arrivals are Sundays and departures Saturdays, 2027/01/09 is the last eligible departure. Eligible packages waive the one-time 100-dollar registration fee. Never add a Sida or other intermediary discount on top of either regular or school-package prices. Keep IU and ICL room prices distinct, preserve the poster room-opening notes, calculate the confirmed peso fee totals, and show all IELTS guarantee conditions on the webpage and image when applicable.
CG Sparta is displayed as “CG斯巴达校区” in public copy and quote images. Keep its existing route slug, asset paths, course IDs, and database lookup names unchanged when localizing display labels.
CG Sparta quotes support independent per-student course and accommodation rows, each with 1–52 whole weeks and its own editable Sunday start date; the Saturday end date is calculated. New rows default to the next Sunday, but editing/deleting one row does not shift other rows. Per-list duration and the full stay span are limited to 52 weeks; overlapping rows within one student's list block export, while unmatched course/room dates show a warning and are billed separately. Display bilingual course names and a compact course-schedule column. Each row uses 40%/60%/85% of the four-week rate for 1/2/3 weeks (CG public short-stay percentages); longer rows are proportional estimates. Management/utilities use each student's accommodation weeks, while visas use that student's first-to-last stay span including gaps. The user approved extending tourist-visa fees beyond the fifth extension at 4,460 pesos per additional 30-day extension; show that caveat only when the current plan reaches it and keep the estimate note identical in the webpage and image. Long-stay discounts are capped at the published 200-dollar tier and continuous course periods are evaluated separately. Over-24-week estimates flag permit renewals and additional actual charges for school confirmation. Quote images merge every student's course/accommodation row into the school payment table, with bilingual `detailTitle`, date/week `detailSubtitle`, and the complete course schedule in the note; do not add a separate plan table or duplicate aggregate course/room rows. Full-detail images preserve all payment rows, not just the first seven, and size rows dynamically. Keep image footnotes concise and applicable to the selected plan while preserving verbatim webpage local-fee notes. Other schools retain their existing UI and image layouts.

CIA, CG Banilad, SMEAG Capital, CPI, and CPILS use the shared multi-row quote plan in `src/app/components/school-quote-plan*`, with separate course and accommodation periods capped at 24 weeks. Each row retains its own type, weeks, Sunday start date, Saturday end date, price, and school-specific rules. Keep webpage and generated-image rows synchronized, charge registration only once per student, block overlapping periods within each student's plan, and preserve each school's discounts, surcharges, local fees, and course-linked extras. Single-person quote-image headings use school/campus name plus total course weeks and “报价”; avoid duplicate recaps such as “组合方案” or “停留跨度”.

CIA is the first I.BREEZE-style group-quote pilot; other schools are not yet migrated. `cia-student-quote.ts` keeps CIA per-student pricing separate; `school-group-quote.ts` aggregates already-calculated local fees and promotions without owning school prices. Default single / 2–20-person modes retain inactive edits but exclude them from totals. Each student has registration date, adult/minor age selection (selected-course tuition in both cases), returning flag and six visa types. Registration is waived for returning students or individually qualified Christmas offers, never twice. Preserve CIA's 40/60/80% short-stay ratios, 2026/2027 price gate, 95% tuition/room rate and individual seasonal/Christmas eligibility. Tourist visas default to59 days with30 available; use actual stay span and existing CIA extension prices. Long-term student/work/SRRV/SIRV provisionally zero SSP, SSP E-CARD, ACR and extensions, retaining adviser-confirmation notes. ARP is300 pesos once on first tourist extension and once for long-term visas (not exempt). Deposit is2,500 pesos per person; pickup remains a price reference pending actual arrangements. Both show renminbi estimates. Group images use “CIA N人报价”, student-labeled course/accommodation names, merged same-type discounts with eligibility preserved, and identical local-fee notes. CIA opts into `expandTotalNote` so per-student IAU50-dollar warnings remain complete beside the school total, below the conversion rate; other schools keep their existing total layout. Rollout checklist and further school migrations await user acceptance.

EV Academy quotes use the same independent course/accommodation list pattern with a maximum of 24 weeks per list and a maximum 24-week full-stay span. Preserve EV's existing 40%/65%/85% short-stay ratios, 95% course/accommodation price, minor fee and peak-season rules. Registration is charged once. Management and utilities use accommodation weeks, textbooks use course weeks, and visa/document estimates use the first-to-last stay span including gaps. Mixed campus/off-campus stays show and calculate both management-fee rows from their respective accumulated accommodation weeks. Overlapping rows block image export; unmatched course/room dates show a warning and remain separately billable. Quote images use CG's dynamically sized school-payment rows for every selected course/accommodation, including names, dates, weeks and course schedules. Use the exact image heading pattern “EV主校区{累计课程周数}周报价”, including multi-row quotes; omit the subtitle, “组合” label and stay-span recaps. Stay span remains an internal calculation input, not a displayed summary. Keep local-fee introductory text, all fee notes and displayed currency rounding identical to the webpage; image footnotes include only applicable short-stay/proration and date-mismatch rules, with discounts and applicable surcharges explained in their payment rows.

B'Cebu uses `bcebu-pricing.ts` for the confirmed 11-course/7-room 2026 four-week catalog and `bcebu-quote.ts` for five stackable benefits and shared webpage/image notes. Keep `SeedBCebuPricingAsync` synchronized. Independent course/room lists use the shared layout with 1–52 whole weeks; Sunday list dates map to Monday admission for the two 2026 promotion windows (February 16–June 29 and August 17–December 28). Adult tuition/accommodation receives 15% off, families 10%; eligible adult reporters receive 25 dollars per course week from four weeks, calculated before seasonal and Sida 10% discounts, followed by the long-stay deduction (8/12/16/20/24 weeks: 50/100/200/300/400 dollars, then 100 per complete four weeks). Reporter cash is precollected and the discounted difference refunded after successful completion; include the extra daily 1:1 class, 500-follower and 100-character/post requirements. The quote form uses a family checkbox and optional unaccompanied-minor fee selection (none / under 15 / 15–under 18), without age or new/returning-student inputs. Course/room age requirements remain in their notes. Selected minor care and Junior/kindergarten courses exclude adult promotions; family mode applies its own discount and no unaccompanied-minor fee. Registration is waived once; its image note is exactly “一次性费用，老学员返校免费”. Family quotes are per person, with 500-dollar/person tuition prepayment, not an additional charge; students aged 15+ can choose ESL/IELTS and pay the selected course price. Preserve 40/60/80% short-stay rates, 40 dollars/week for July 5–August 15, and unaccompanied minor fees (under 15: 100/week; 15–under 18: 50/week) without discounts. Utilities/maintenance use accommodation weeks, books course weeks, visa estimates the full stay and a selectable 30/59-day initial visa. Pickup and deposit show estimated renminbi on the webpage and image with actual/fallback exchange-rate labels. Over-24-week documents/deposits remain school-confirmation estimates.

PHILINTER uses the shared independent 1–24-week course/accommodation lists and I.BREEZE full-detail quote layout. `philinter-catalog.ts` holds the supplied 15-course/six-room catalog, with stable English database lookup names and bilingual labels; keep `SeedPhilinterPricingAsync` synchronized. Do not restore Primary (under-12) or the unsupported TOEIC Guarantee rate from the old catalog. Short stays use 45/65/85% for 1/2/3 weeks. Adult eligibility is reaching 18 during the study year; Junior is only 12–17, requires an already-adult guardian in the same non-single room, and blocks export otherwise. Family prepayment is 500 dollars/person toward tuition, not an extra charge; each quote is per person. The 2026/08/16–12/25 offer counts complete consecutive eligible study weeks with eligible accommodation (campus triple, Azon single/twin), 300 dollars per eight weeks, excluding guarantee courses and other school offers/Vouchers; Sida 10% tuition/room discount is separate. Management/electricity/water use the supplied four-week rates, textbooks are estimated per course set; 8 weeks with no visa extension gives 26,700 pesos. Visa counts use selected initial 30/59 days and full stay including gaps, with 6,920 pesos per extension explicitly an estimate pending school confirmation. Pickup, deposits and extra accommodation (3,000 pesos/night) are reference rows below local fees and in the image, with actual/fallback exchange-rate labels. The user removed pickup and extra-night input controls; do not display them above the local-fee table or add them to totals. Do not add an other-offer/Voucher checkbox: the supplied offer only states a non-stacking condition, not another available promotion. Do not add a family-mode checkbox just to show explanatory copy; show the 500-dollar/person family prepayment note directly, without the extra per-person-quote/guardian-separate-quote recap. Registration is user-confirmed at a fixed 120 dollars per person, once per quote regardless of period count. Do not add accommodation registration or let stale database fee values override this fixed amount. The user removed the accommodation-season selector. Keep winter minimum-stay rules as informational notes until dates are supplied; automatically apply the summer rules from course-date overlap (campus 8 weeks, Azon 4 weeks, with a school-confirmed short-stay exception). Summer surcharges are 40 dollars per overlapping course week during 2026/07/05–08/29 and the user-requested 2027 estimate 07/04 (Sunday)–08/28 (Saturday), preserving exactly eight weeks. Do not charge accommodation-only weeks or discount the surcharge. Webpage and image reuse all policy/local-fee notes.

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

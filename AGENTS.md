# AI repository guide

This file applies to the whole repository. Read it before changing code. Keep it current when architecture, setup, routes, or deployment behavior changes.

## Product summary

XiaoJuanSchoolPayment is the codebase for **思达启航教育 (Sida Qihang Education)**, a Chinese-language education consultancy website. Despite the original project name, it is now broader than school payments. The public site markets and explains:

- Ireland undergraduate, postgraduate, foundation, visa, accommodation, and pre-departure services.
- Philippines English-study destinations, language schools, courses, accommodation, and fees.
- Online English courses, overseas study tours, guides, student feedback, and company information.
- School-specific quote calculators backed by database pricing.
- Contact and quote-image email forms.

There is also a JWT-protected employee area for maintaining schools, lessons, rooms, fees, notes, student applications, private documents, invitations, and uploaded school photos. Accounts register with a required email, an optional phone number, an access/invitation code, and a password; the configured access code always grants owner-level Admin while invitation codes carry their stored Staff (顾问), Manager (管理), or Student role. Login is password-only and accepts either the registered email or optional phone number. Password recovery accepts either identifier but always emails the reset link to the account's registered email.

## Philippine school page rules (user decision 2026-11-21)

These rules cover every Philippine school page, its quote, 方案对比 and quote images, and its mini program export. Check a new or reworked school against every item before asking the user to review it. The files under `docs/agents/` hold the details for some items; where an older school-specific paragraph contradicts these rules, these rules win unless the user decides otherwise for that school. A decision the user made after 2026-11-21 (dated in its own section) wins over this list.

1. **One template.** Every Philippine school uses the latest CIA template (see "Philippine school page template"): page layout, quote modes, 方案对比 and `layoutVersion: 2` quote images. Company content is the same for every school: why-Sida, consultant cards, the floating 免费咨询 panel, the quote image's header, consultant QR and footer, and the `SCHOOL_REFERENCE_NOTE` line. Only the school's own content changes. A section the school has no content for is left out; content only this school has becomes an optional template section in CIA's style that later schools can reuse. A template change reaches every school, so first ask the user whether a design change is for one school or for all.
2. **No contact details, peers or outside links.** Never show any school's phone, email, WeChat, 公众号, website, social accounts, street address/postcode or QR code, also inside photos, posters and videos (crop, mosaic or leave it out). Never show anything of a peer agency or other company: names, logos, watermarks, QR codes, agency T-shirts, banners or media logos. No third-party links and no embedded third-party players (especially ones with ads or paywalls). Check every video frame by frame at its opening and ending, and look at T-shirts, banners and signs throughout. Media sources in this order: the user's files, the school's own website and official accounts, then the school's Facebook; Korean partner agencies only when the school has nothing, with their watermark, logo and contacts removed; never Chinese agencies or peers. Ordinary clothing brands on students may stay.
3. **Taiwan and sensitive content.** Write 中国台湾, 中国大陆, 中国香港 and 中国澳门; student-source lists say 国家和地区, never 国籍 (details under "Conventions and safe-edit rules"). Mosaic or leave out a flag of the Taiwan authorities or "TAIWAN" shown as a country. A map must show China's complete territory, including Taiwan and the South China Sea islands; if that is not certain, do not use the map. On score reports, certificates and other documents, mosaic the student's name, photo, birth date and ID, passport, candidate and report numbers.
4. **Courses, rooms and prices are checked line by line.** They are the most important content of a school page. Use only the school's latest official price list and notices; every number on the page must be found in them. For each course check the Chinese and English names, the number of one-to-one and group classes per day (see rule 10), allowed and minimum weeks, age rules, the price and the year it applies to. For each room check the type, bed count, campus or off-campus, meals, price, and that its photos show exactly that room type. The public price tables, the calculator and the quote image must give the same amounts; before review, work out at least a single 4-week, a single 12-week and a group quote by hand from the source and compare. When sources conflict or a price is missing, never guess: mark it 待学校确认, block the quote export and ask the user. Dated prices (2026, 2027) say when they apply.
5. **Record the sources internally.** Keep one source record per school in `docs/` (file names and dates, what was taken from each, open questions), as for CIP, La Mer and CPILS, so a new price list shows at once what must change. Never cite sources on the page.
6. **No absolute or promise wording.** School pages never claim 第一, 唯一, 首选, 最好, 最便宜, 保证录取, 保证提分, 100%, 成功率 or 录取无忧, and never give unprovable student or partner-school counts. A guarantee course (保分班) states only the school's own conditions. The ban is on claims, not words: 第一周 or 保证金 are fine. `BRAND_FORBIDDEN_PHRASES` checks only the about page and `llms.txt` at build time, so check school pages by hand.
7. **Real, sharp media.** Photos and videos are the school's own and match exactly what they are labelled as (school, campus, room type, course, facility); leave out anything uncertain. No blurry or upscaled images. Never present an AI-generated image as a real photo. Compare older photos with the newest brochure, because renovated rooms look different.
8. **Money and naming.** Chinese currency names (美元, 比索, 人民币); school fees and 到校学杂费 are always shown separately and never added together; the brand is always 思达启航 in full.
9. **Review order.** The user confirms a school's layout first, then its content. Check desktop and phone layouts before review. The CIA page stays locked (see "CIA page locked").
10. **Detailed, but promise only what the school guarantees** (user decision 2026-11-21). Students hold us to every line, so pages stay detailed while stating as fact only what the school guarantees; everything the school arranges on site is described as the school's arrangement (以学校实际安排为准). Apply this when each school is written or reworked; do not sweep older pages unless the user asks, and leave CIA as it is until the user unlocks it.
    - **Courses:** a course's own description (course list, course notes, quote and quote image) states only how many one-to-one and group (or large-group) classes it has per day and which classes are optional. It never lists the subject, textbook, teacher or teacher nationality of each class, because the school decides them after the level test on arrival. Each school also shows a daily reference timetable (每日课程表参考); there each period may name a subject as an example, because the timetable is clearly marked as a reference (以学校实际安排为准). Class sizes, teacher numbers and student nationality ratios are the school's usual figures (一般, 约), never guarantees.
    - **Rooms:** the booked room type and bed count are what we promise. Building, floor, view, roommates and their nationality, furniture, air conditioning and Wi-Fi speed are the school's allocation and are never promised; when rooms are full the school may offer another type.
    - **Facilities, meals, activities and transport:** opening hours, menus, weekend activities, shuttles and pickup times may change or stop; describe them as usual arrangements, never as a schedule the student is owed.
    - **Prices and offers:** every price says the year or dates it applies to. Every offer shows its conditions, deadline, quota and whether it stacks right beside it, and disappears on its end date (as `CIA_2026_PRICES_UNTIL` does) instead of staying on the page. Peso local fees, visa fees and exchange rates are estimates; the school collects the actual amounts on arrival.
    - **免费 and 包含:** write them only when the school's documents say so, and say what is not included where a student would expect it (for example pickup, deposit, electricity beyond the allowance).
    - **Results and policies:** no promised score, level or fluency (rule 6). Visa, immigration and refund rules follow the school's and the immigration bureau's current rules; never add a refund promise of our own, and add a refund section only when the user asks.

## One page, one record (user rule 2026-11-26)

Every page has its own record: a school in `docs/agents/schools/<school>.md` (campuses that share code, such as CG, CELLA, JIC, MONOL, SMEAG, IU/ICL, BECI and English Fella, share their school's file), any other page in `docs/agents/pages/<page>.md`. Pages do not affect each other, so when the user asks to change a page:

1. Read only that page's record, the source record it names in `docs/`, and that page's own folder (for example `pages/philippines/pines-school/`) and assets.
2. Do not read, scan or review other pages, other schools' records or folders, or the rest of the site, and do not check other pages for consistency, unless the user asks.
3. Read a shared file or topic record (the `school-page/` template, `ph-template.md`, `quote-rules.md`, quote-image renderers, consultants) only when the change needs it. If the change must edit a shared file, tell the user first, because it reaches every page that uses it (see also "CIA page locked").
4. Search narrowly (the page's route, file names or symbols). In shared registration files (routes, navigation, SEO, sitemap, prerender lists, `content.json`) touch only that page's entry.
5. Run only that page's tests (the command in its record); run the full build once at the end of a batch of pages, not after every page.
6. Write new decisions about the page into its own record, never into this file or another page's record. A new page gets a new record and one line in the lists below.

## Where the details are (read only what the task needs)

To keep every session cheap, school notes and feature notes were moved verbatim out of this file on 2026-11-26 into `docs/agents/`. Before working on a school, read its file in `docs/agents/schools/` (and the school's own `docs/` source record it names); before changing shared code, read the matching topic file. Record new school or feature decisions in that file, not here, and keep this file to rules that apply to every task. A new school gets a new `docs/agents/schools/<school>.md` and one line in the list below.

Topics in `docs/agents/`:

- `ph-template.md`: the shared Philippine school page template, the quote image template, consultants and their daily order, the one-stay rule. Read it before any change in `school-page/` or other shared files.
- `quote-rules.md`: cross-school quote rules (returning students, visas and ACR, internal duration and synchronization rules, BESA/CALA peaks, date rule, textbooks, exchange rates).
- `quote-images.md`: quote-image export and layout conventions.
- `employee-backend.md`: `/admin`, the visual school editors and their preview handshake. `api.md`: endpoint groups and roles.
- `student-portal.md`: student applications, documents, payments, uploads, emails and reminders.
- `mini-program.md`, `seo-and-brand.md` (SEO tags, prerendering, brand facts, `llms.txt`), `deployment.md`, `local-setup.md`, `study60.md`, `price-compare.md`, `school-knowledge-pack.md`.
- `pages/`: one record per non-school page: `service-process.md`, `baguio-airport-pickup.md`, `phone-top-up.md`, `mid-autumn-story.md`.

Rules from `quote-rules.md` that apply to every Philippine quote: returning students waive registration unless the school's file says otherwise; ACR I-Card is charged once with the first tourist-visa extension (week 5 on a 30-day visa, week 9 on a 59-day visa); arrival is a Sunday and leaving a Saturday, and next-year dates keep the weekday; the price tier comes from each student's own total course weeks; the BESA/CALA 2027 peak is 60 dollars per unique week outside every discount; exchange rates come only from Frankfurter/ECB with no fixed fallback.

School files in `docs/agents/schools/`: `cia.md` (CIA, locked), `anj.md` (A&J), `bcebu.md` (B'Cebu), `beci.md` (BECI EOP/Sparta/City), `btes.md`, `cboa.md` (Cebu Blue Ocean), `cella.md` (CELLA Uni/Premium), `cg.md` (CG Banilad/Sparta), `ciec.md`, `cip.md`, `cpi.md`, `cpils.md`, `elsa.md`, `ev.md` (EV main campus), `la-mer.md` (EV La Mer), `fella.md` (English Fella), `genius.md`, `glc.md`, `hana.md`, `help.md` (HELP Clark), `ibreeze.md`, `ims.md`, `iu-icl.md`, `jic.md` (JIC Challenger/Premium), `mint.md` (English MINT), `mk.md` (MK, Iloilo), `monol.md` (MONOL main and Sparta), `philinter.md`, `pines.md`, `smeag.md` (SMEAG Capital and Encanto), `target.md`, `wales.md`; outside the Philippines `burlington.md` (with the UK quote sheet), `st-giles.md`, `atc.md` (with the shared non-Philippine template), `babel.md` (Babel, Dublin) and `canadian-education.md` (Singapore). Schools without a file (CWA, QQ English, Winning and other directory-style pages) have no recorded notes.

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
- Backend: ASP.NET Core 10, EF Core 9, Pomelo MySQL provider, ASP.NET Identity, JWT bearer authentication, Swagger.
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
  - `public/content/content.json` and `src/app/mini-program/`: shared content and native school pages for the WeChat mini program (`../SiDaQiHangWeChat`). Exported modules must stay pure (no Angular, DOM, storage, regex lookbehind, `structuredClone`, or a variable named `window`). Details: `docs/agents/mini-program.md`.
  - `src/app/pages/about-sida/about/brand-facts.ts`: the brand fact card behind the about page, its JSON-LD and `/llms.txt`. Always write the brand in full as 思达启航, never 思达 or 思达游学. Details: `docs/agents/seo-and-brand.md`.
  - `public/rlx9pIUtlg.txt`: WeChat mini program 业务域名 verification file. It proves ownership of `sidaqihang.com` so the mini program can open site pages in `web-view`. It must stay byte-for-byte unchanged and reachable at `https://sidaqihang.com/rlx9pIUtlg.txt`; never delete or rename it, or web-view pages may stop opening in the mini program.
  - `public/study60/`: generated standalone study page served by `FindStaticSiteIndex`; never edit its `index.html` by hand. Details: `docs/agents/study60.md`.
  - `src/proxy.conf.js`: development proxy paths and backend target selection.
- `XiaoJuanSchoolPayment.Server/`: ASP.NET Core API.
  - `Program.cs`: dependency setup, auth, CORS, middleware, database migration/seed startup, robots.txt, sitemap, and SPA fallback.
  - `Controllers/`: HTTP endpoints for auth, school data, currency, contact email, and quote email.
  - `Data/Models/`: EF Core and Identity entities.
  - `Data/DTO/` and `Data/Filter/`: API contracts and query filters.
  - `Services/School/SchoolService.cs`: school CRUD/query logic and school-media persistence, using Tencent COS when configured and local disk as the development/legacy fallback.
  - `Services/Storage/TencentCosSchoolMediaStorage.cs`: private Tencent COS upload/delete/signing support plus short-lived employee-preview tokens.
  - `Services/DataInitialize.cs`: large, insert-only startup seed routine for currencies, schools, pricing, rooms, lessons, fees, and notes. It adds missing baseline records but never updates or deletes existing production records.
  - `Migrations/`: EF Core schema history. Do not hand-edit the model snapshot.
  - `wwwroot/uploads/`: legacy/local-development school-photo storage; only `.gitkeep` is source controlled. New production uploads use COS when `TencentCos__Enabled=true`.
- `Dockerfile`: multi-stage production build.
- `.github/workflows/deploy-server.yml`: every `main` push deploys production by pushing over SSH to the server, which never pulls from GitHub. Never add `--volumes` or `-a` image pruning. Details: `docs/agents/deployment.md`.
- `.github/workflows/deploy-github-pages.yml`: builds and publishes the static Angular frontend to GitHub Pages. API-dependent features require a separate reachable backend and will not work from a static-only deployment without additional configuration.
- `study60/`: source for `public/study60/`; see `docs/agents/study60.md`.
- `tools/school-knowledge-pack/`: builds the knowledge pack for the planned 百问百答 student Q&A bot from the schools' own materials on the user's G: drive (never from the website); runs only on the user's PC. See `docs/agents/school-knowledge-pack.md`.
- `Logo/`, the Chinese `.docx` files, and the Chinese `.xlsx` files at the root are reference/source material, not runtime code.
- PNG files and `*.log` files near the client root are development screenshots/logs, not Angular source assets.

## Main data model and API behavior

`AppDbContext` extends `IdentityDbContext<SchoolUser>` and contains:

- `School`: parent record.
- `SchoolLesson`: course, duration in weeks, price, currency, description, and note.
- `SchoolRoom`: accommodation option, duration, price, currency, and description.
- `SchoolFee`: additional fee, currency, description, and last-updated time.
- `SchoolNote`: free-form school note.
- `SchoolPhoto`: school photo/video metadata. For COS-backed records `FilePath` is the object key and `Url` is the stable same-origin `/school/media-file/<id>` route; legacy/local records still point under `wwwroot/uploads/schools/<school-id>/`.
- `Currency`: code and symbol.
- `SchoolUser`: ASP.NET Identity user with first and last name. Admin accounts use the employee backend; Student accounts use the student portal.
- `InvitationCode`: single-use, expiring role invitation. Admin users create Staff/Consultant or Manager invitations; Manager and Staff users create Student invitations.
- `AccountVerificationCode`: legacy verification-code records retained for migration compatibility; the current authentication flow does not create or accept verification codes.
- `SchoolContentRevision`: per-school JSON snapshots for employee drafts and administrator-published website content, including version, author, change summary, and publish timestamps.
- `SchoolCommissionPolicy` and `SchoolCommissionRoomBasis`: private, structured partner-commission notices and room calculation bases. They are separate from public school content and readable only by Admin/Manager.
- `StudentApplication`, `StudentApplicationDocument`, `StudentPayment`, `StudentSubmission`, fee items, student emails, reminders and WeChat reminders: see `docs/agents/student-portal.md`.

API routes have no `/api` prefix (`/auth`, `/school`, `/school-content`, `/student-applications`, `/contact-form/send`, `/quote-email/send`, `/exchange-rates/cny`, `/uploads` and others). The WeChat mini program calls `/auth` and the student endpoints, so keep their request and response shapes compatible. Endpoint details and roles: `docs/agents/api.md`.
The `/admin` area is the employee backend. Staff (顾问) saves drafts and submits them with a required change summary and can never publish; Manager (管理) and Admin (owner) also publish or return. Visual school editors, their roster and the preview handshake: `docs/agents/employee-backend.md`.
The Angular services use relative URLs so the development proxy and production same-origin hosting both work. Preserve this unless deployment is intentionally changed.

## Content/data layers

Do not assume all visible information comes from the database:

1. Marketing copy, school descriptions, feature lists, citations, and many image references are stored directly in page component `.ts` arrays and `.html` templates.
2. Interactive quote/course/room/fee data comes from MySQL through `SchoolService`; missing initial values are inserted by `Services/DataInitialize.cs`, while existing database values remain unchanged on startup.
3. Each school migrated to the visual workbench stores employee-editable courses, rooms, local fees, promotions, quote rules, quote-image copy, and media in a versioned `SchoolContentRevision` JSON document. Published content overrides database/compiled defaults on that public page; the page, calculator, local-fee table, and generated quote image must continue to use the same published configuration. `cia-content-config.ts` defines the shared schema, while school-specific default config factories are fallbacks rather than a second published source of truth.

Before changing school content or pricing, search for that one school name across both projects (a targeted search, not a read of other pages). Update the static page, seed data, and pricing lookup name together when the requested change affects all of them. The string used by `getSchools({ name: ... })` must continue to match a seeded/database school name.

## Local setup

Node.js 22, .NET 10 SDK and MySQL 8 or MariaDB. Secrets (`Jwt:Key`, `AccessCode`, SMTP, Tencent COS) go in .NET user secrets or environment variables, never in `appsettings*.json`. Angular runs at `https://localhost:53747`, the API at `https://localhost:7209`. Full setup: `docs/agents/local-setup.md`.
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
2. Add or update the route in `src/app/app-routing.module.ts`. A page path must not start with an API prefix listed in `src/proxy.conf.js` (`/school`, `/auth`, `/currency`, ...): the development proxy matches by plain prefix, so `/school-compare` was sent to the backend.
3. Update `src/app/config/navigation.config.ts` if the page belongs in the menu.
4. For a public content page, add its route to `xiaojuanschoolpayment.client/prerender-routes.txt` (a school detail page: `prerender-school-routes.txt`) so its body text is in the page source (see the prerendering note under Conventions), and keep browser-only code out of its first render.
5. Add/update metadata in `src/services/seo.service.ts` for an indexable page: an explicit `SEO_PAGES` entry, or a `SCHOOL_DETAIL_SEO` row for a school detail page (the row generates a school-named title/description; set `quote: true` only when the page has an online quote calculator). Otherwise the page falls back to its city's generic `SECTION_SEO` title.
6. Add/update the manual `sitemapEntries` list in server `Program.cs`.
7. Put local browser images in `xiaojuanschoolpayment.client/public/assets/<feature-or-school>/` and reference them as `/assets/...`.
8. Test direct navigation and the mobile navbar, not only in-app links.

### Create or rework a school page (mini-program-ready, user decision 2026-11-17)

Write every new or reworked school page so the WeChat mini program can reuse it later without a second refactor; extracting CIA's text and calculator after the fact, and proving the page unchanged, was the most expensive part of its port.

1. Put the page's static text and data (headings, paragraphs, cards, schedules, FAQ, gallery lists) in a pure `<school>-page-content.ts` module, as `cia-page-content.ts` does. The component exposes it and the template reads it; do not leave copy inline in the template.
2. Put the quote calculation and quote-image data in a pure module that takes the published content document, as `cia-quote-engine.ts` does: students, payment lines, local fees, totals and `QuoteImageCardData`. The component only binds form inputs and delegates. Prices and rules still come only from the versioned content document and its defaults.
3. Keep these modules free of Angular, DOM, storage and regex lookbehind, so the mini program can bundle them.
4. The website layout is the website's own choice. The mini program renders every school with one shared template (`utils/school-template.ts`), so layout decisions never need a mini program change.
5. Order of work: the user first confirms the school's website layout, then its content. Only confirmed schools are synced to the mini program, several at a time (builder in `mini-program/school-pages.ts`, `detail` in `public/content/content.json`, calculator export in `mini-program/quote-engine.ts` plus `npm run quote:sync` in the mini program repo), with one mini program release per batch. After a sync, text and published price changes need no mini program release; calculation-rule changes need a resync and a release.
6. When moving an existing page's code into these modules, prove the public page unchanged: compare quote data and the rendered quote image for several scenarios before and after, as was done for CIA.
7. User decision 2026-11-20: every Philippine school page will follow the CIA page's website layout and detail design (sales section order, grouped course list with daily schedules, room price list and room photos with arrows, album arrows, unfolded video rows, IELTS results and reviews before the quote, the three quote modes, why-Sida section, FAQ and consultant cards); only the content differs. The CIA page has been turned into the shared template in `school-page/` (see "Philippine school page template"); EV and CPILS have been moved onto it. Move other schools one at a time by writing a profile and a quote adapter; do not copy the CIA component per school.

### Change database-backed school pricing

1. Find the page's `SchoolService` lookup and requested `week` filter.
2. Update the matching section in `Services/DataInitialize.cs` when the value is canonical seed data.
3. Keep currency IDs aligned with the seeded currencies.
4. Startup seeding is insert-only. Changing a seed definition does not update an existing environment; apply intentional production data changes through the employee tools, an EF migration, or an explicit maintenance operation.
5. Verify the public calculator and the matching admin table.

### Change the schema or API contract

1. Change server model/DTO/filter/service/controller layers as appropriate.
2. Create an EF Core migration; do not rewrite an already-deployed migration.
3. Update the matching TypeScript interface and service call.
4. Check authorization explicitly: reads are generally public; employee drafts allow Admin/Manager/Staff, publishing allows only Admin/Manager, and owner account/role management allows only Admin.
5. Build both projects and exercise the endpoint through the Angular proxy.

### Add an admin feature

Keep `/admin` under `RoleGuard`, use the narrowest server role set required by the workflow, and attach the bearer token in the Angular service. Do not rely on the client guard as the security boundary; especially never allow Staff to call a direct write that bypasses content review.

## Conventions and safe-edit rules

- A `<select>` whose options come from a method or getter that builds new objects (for example `optionGroups()` in `school-quote-plan.component`) needs `trackBy`, or Angular rebuilds every `<option>` on the next check and desktop browsers, including PC WeChat, close the open list at once (colleague report 2026-11-25; phones were unaffected).
- Quote-image export and layout conventions: `docs/agents/quote-images.md`.
- SEO tags, JSON-LD, `llms.txt` and build-time prerendering: `docs/agents/seo-and-brand.md`. Pages listed in `prerender-routes.txt` / `prerender-school-routes.txt` must not touch `window`, `localStorage`, `navigator` or `document` during their first render. Never remove the `baidu-site-verification` meta tag.
- The home page footer shows the site's ICP filing number `粤ICP备2026144654号` linked to `https://beian.miit.gov.cn/`; filed mainland-China sites must display it at the bottom of the home page, so keep it there. Home page styles are loaded from `public/assets/home-page.css` (linked at the top of `home.component.html`); `home.component.css` and `home.component.compact.css` are not referenced by the component, so edits there have no effect.
- Fonts are self-hosted because Google domains (fonts.googleapis.com, fonts.gstatic.com, storage.googleapis.com) are unreachable from mainland China. `src/fonts.css` (first entry in the `angular.json` styles) declares Material Icons and the latin/latin-ext Roboto variable font from `public/assets/fonts/`, and `index.html` preloads the icon font. Never add Google Fonts or other Google-hosted runtime assets again. Icon fonts use `font-display: block` so ligature names never flash as text. Public pages use the site's Aptos/Segoe UI stack; Roboto is only requested where Angular Material typography uses it.
- Consultant avatars and WeChat QR codes exist only in `SIDA_CONSULTANT_MEDIA` (`components/sida-consultants.ts`); `scripts/check-consultant-media.cjs` fails the build otherwise. Details: `docs/agents/ph-template.md`.
- Photos must be the school's own and match exactly what they are labelled as: school, campus, room type, course or facility (user rule 2026-11-20). If it is not certain that a photo shows that item, leave it out rather than guess; students ask why their room looks different from the page.
- Agency information is never public (user rule 2026-11-24, every school and every source): commission, a school's rules for agencies (payment deadlines, price floors, cancellation penalties, visits, fam trips, NET group rates) and any rule that affects agencies stay off pages, quotes, quote images, SEO and the mini program. Publish only student-facing rules; a school's 中介折扣 is shown as the 思达启航 discount.
- 思达启航 registration deposit (user rule 2026-11-24, every school): 思达启航 collects a 2,000-yuan 报名预收定金 that is never refunded; a student who asks at least 4 weeks before entry may change the start date or keep the deposit for one year. A school's post-entry refund ratios may be published; a refund section opens with a 报名与入学前 group carrying the same two rules (报名定金, 改期与保留) word for word on every page (EV, CIEC, HELP, MONOL Sparta, CBOA so far; CIA is locked), then the school's 到校以后 group.
- Preserve Chinese user-facing copy unless the task explicitly changes wording or language behavior.
- Taiwan wording (user rule 2026-11-21, a serious requirement): Taiwan is part of China. Wherever copy names Taiwan or tells it apart from the mainland, write 中国台湾 and 中国大陆, never a bare 台湾 or 中国 used as its opposite (for example 中国台湾学员 / 中国大陆学员). In nationality or student-source lists write 中国台湾 and 中国大陆 and say 国家和地区, never list Taiwan as a country or 国籍. Hong Kong and Macau are 中国香港 / 中国澳门 or 香港特区 / 澳门特区. This covers pages, quote images, alt text and the mini program; file names may keep their old English words. Images and videos count too: a flag of the Taiwan authorities or "TAIWAN" printed as a country or nationality must be covered with a gray mosaic or left out (done 2026-11-21 for CIA's 中国台湾 interview video, its poster and one IELTS report). Check new school media for this before adding it.
- 报价单文案偏好（用户明确要求）：突出学校、周数、所选课程和房型、日期、金额及必要条件；同一信息只在最合适的位置说明一次，不换不同说法重复堆叠。不要主动添加“停留跨度”“组合方案”“默认报价参考房型”或内部计算过程等无助于学生决策的文字；保留影响实际费用、资格或安排的必要细节。标题直接用“学校/校区 + 周数 + 报价”，计算逻辑与界面文案分开处理。学校费用与到校学杂费始终分开显示，不要相加成“预计总花费”或每周平均总价（2026-11-19用户决定：同行都分开报学杂费，合计会让学生误以为更贵）。
- 所有学校的费用展示统一使用中文币种名称：美元、比索、人民币等，不使用 USD、PHP、CNY 等英文币种代码作为展示文案。此规则适用于课程与住宿价格、报价计算器、学杂费、优惠及附加费说明，以及生成的报价图片。内部计算、API 字段、数据库币种代码和 ID 保持原有含义，不因展示中文化而更改。后续调整任一学校费用时，同时检查网页与报价图片的一致性。
- Reuse a neighboring page's layout and shared CSS before inventing another school-detail pattern. Shared styles include files such as `school-detail-layout.css`, `cebu-school-detail-layout.css`, and school-family component styles.
- Keep API paths relative and keep DTO property meaning synchronized across C# and TypeScript.
- Avoid broad mechanical formatting of the very large route, seed, SEO, and navigation files; make focused edits to reduce merge conflicts.
- Do not edit generated output (`dist`, `bin`, `obj`, `.angular`, browser profiles, screenshots, or logs) as source code.
- Do not overwrite unrelated working-tree changes. At the time this guide was created, developers commonly used screenshot-based visual review, so root/client PNGs may be intentional evidence rather than production assets.
- When a school name or route slug changes, search the whole repository. It may appear in routes, navigation, SEO, sitemap entries, static page data, seed aliases, calculators, and tests.
- Uploaded files and database contents are separate state. Back up both before destructive data or photo operations.

## Security and deployment cautions

- Every push to `main` deploys production through `.github/workflows/deploy-server.yml` (disk cleanup, runner-to-server SSH `git push`, fast-forward, `docker compose --env-file /opt/sida/.env -f compose.production.yml up -d --build app caddy`). The runner pushes the commit to the server over SSH, and the server then runs `docker compose --env-file /opt/sida/.env -f compose.production.yml up -d --build app caddy`; see the repository map entry above. The server never pulls from GitHub: its former mirror `gh.gitwarp.top` returned HTTP 523 from 2026-11-09 until the 2026-11-15 workflow fix. Caddy is the reverse proxy. `compose.production.yml` and `.env` exist only on the server, so a change that requires a new setting must fail safe rather than crash startup.
- Git history still contains a former JWT key, administrator `AccessCode`, local database values and a Gmail SMTP app password. Never quote those values in tickets, prompts, logs, or documentation. `Services/Security/AuthSecrets.cs` (`RevokedSecrets`) rejects the former JWT key and access code by SHA-256 hash, so they never authenticate again even if copied into an environment. The SMTP password must be revoked at its provider; code cannot revoke it.
- JWT signing uses the single `JwtSigningKey` singleton. A missing, shorter-than-32-byte or revoked `Jwt:Key` falls back to a random per-process key and logs a critical warning; the site keeps running but every restart signs users out. Tokens default to 7 days (`Jwt:ExpiresInMinutes`, clamped to at most 30 days) and carry a SHA-256 hash of the Identity security stamp (claim `sstamp`) that `JwtSecurityStamp.ValidateAsync` checks against the database on every authenticated request. Password change/reset and employee-type changes rotate the stamp and revoke older tokens; `/auth/change-password` returns a replacement token. The Angular `AuthSessionInterceptor` clears the stored session and routes to `/login` when a request that carried a bearer token receives 401.
- `AccessCode` grants Admin registration whenever supplied and must be protected as an administrator credential. It is compared in constant time, and a revoked or empty value disables access-code registration. Registration codes are HMAC-hashed and invitations are SHA-256-hashed in storage.
- The canonical public origin `https://sidaqihang.com` is committed in `appsettings.Production.json` (not a secret; `Authentication__PublicOrigin` still overrides it). Password-reset links use only `Authentication:PublicOrigin` outside Development. Without it, `/auth/forgot-password` returns 503 and logs an error rather than trusting the request Host header. Sitemap/robots URLs also prefer the configured origin.
- `Services/Security/AbuseRateLimits.cs` applies per-client fixed-window limits: quote email 10 per 10 minutes, contact form 5 per 10 minutes, and login/register/forgot/reset password 20 per 5 minutes, all returning 429 with a Chinese message. `X-Forwarded-For` is trusted only from loopback/private peers (Caddy), using its last entry. `OutboundMailThrottle` additionally caps actually sent anonymous mail site-wide at 30 quote emails and 20 contact forms per hour. Quote email accepts only PNG signatures.
- CORS still allows any origin and should be restricted to trusted production domains before exposing the API publicly.
- Swagger is enabled only in Development.
- The Docker image does not contain MySQL; supply `ConnectionStrings__DefaultConnection` at runtime.
- With `TencentCos__Enabled=true`, new school photos and videos are written to the configured private COS bucket; keep its credentials out of source control and grant only the required object permissions for the `school-media/` prefix. Existing local records continue to be served from `wwwroot/uploads`, so preserve or migrate that directory before removing its production volume. Without COS enabled, all new school media still uses local storage and therefore requires a persistent mount.
- The GitHub Pages workflow deploys only static frontend files. Same-origin relative API requests will target GitHub Pages and fail unless a backend/base-URL strategy is added.

## CIA page locked (2026-11-20)

User decision: the CIA page is finished and locked. Do not change CIA content unless the user explicitly unlocks it for that change; ask first, in Chinese, every time, even for a one-word fix. Locked files are `pages/philippines/cia-school/`, `pages/philippines/cia-student-review/`, `public/assets/cia/` and `public/assets/cia-video/`. The project hook `.claude/hooks/cia-lock.cjs` (registered in `.claude/settings.json`) makes Claude Code show a permission prompt before any edit, file write or shell write to those paths and to the hook and settings files themselves; it takes effect in sessions started after the settings file exists. Allowing that prompt unlocks only that one change.

Shared files also shape the CIA page: the `school-page/` template and styles, `components/sida-consultants.ts`, `components/sida-why-content.ts`, the global `app-cia-school` rules in `src/styles.css`, the quote-image renderers, `school-quote-plan*`, `plan-compare/` and `services/exchange-rate-rules.ts`. A change there for another school must leave the CIA page, quote data and quote images identical (compare before and after, as for the template). If it cannot, ask the user to unlock CIA before making it.

## Definition of done

A change is complete when the requested behavior works, relevant client/server builds pass, desktop and mobile layouts are checked for visual changes, route/navigation/SEO/sitemap entries are synchronized when applicable, and no secret or generated artifact was added to the commit.

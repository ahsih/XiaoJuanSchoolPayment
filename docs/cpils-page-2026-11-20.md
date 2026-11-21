# CPILS page on the shared Philippine template (2026-11-20)

The user supplied two CPILS packs (`2026 年优惠活动.zip`, `2027价格调整及优惠活动.zip`) and the school's Google Drive media folder, and asked for the CPILS website to be updated. Online-course material was excluded at the user's request.

## What changed

- `/philippines-study/cebu/cpils` now renders `CpilsSchoolPageComponent` on the shared CIA-based template (`school-page/`), like EV. The old `cpils-school-detail.component.*`, `cpils-school.component.*` and `scripts/verify-cpils-page.cjs` were removed.
- New pure modules:
  - `cpils-page-content.ts`: all page text and data, including the gallery, rooms, schedules, course guides, dorm rules, practical guides and FAQ.
  - `cpils-page-profile.ts`: fills the template.
  - `cpils-page-quote.ts`: wraps the unchanged CPILS calculation for the single, comparison and group quotes.
- `cpils-pricing.ts` adds `CPILS_POLICY_VERSION = 2`. It upgrades saved content once and changes only defaults that were never edited:
  - Chinese course names, separate fit/note text and full daily schedules.
  - The 2027 parent-child (PCP) courses.
  - The 2027 course-table note and group-class note.
  - The handbook visa/ARP notes, and 保证班 → 保分班.
- The course list shows 2027 prices. Opening a course shows its 2026 price when one exists.
  - Guarantee courses are fixed packages, so they show the whole package price with a `/8周` or `/12周` unit. The template's new `coursePriceUnit` and `oldListPrice` hooks handle this; CIA and EV keep the defaults.
  - Pre-IELTS costs the same as the IELTS course (user decision 2026-11-21). The 2027 sheet does not list it, so the version-2 upgrade copies the IELTS course's 2027 price into it while it has none; the 2026 prices were already equal. It is listed in the 雅思 group and in the comparison shortcut.
  - Practicum is hidden because it is an add-on that cannot be booked alone. It remains in the content document.
- The room list shows 2027 room prices in three groups: 普通房, 无对外窗房 and 高级房.
- Seed: `scripts/sync-cpils-seed.cjs` keeps the English database lesson names as aliases. `DataInitialize.cs` was regenerated, and initialization stays insert-only.
- The CPILS page uses CIA's latest template (user request 2026-11-21, after CIA's compact layout and new quote images were merged to `main`):
  - `compactLayout`, with both compact stylesheets in `CpilsSchoolPageComponent`.
  - `overviewFacts`: 8 key facts under the hero title. The 门禁 rule moved there because the compact layout no longer shows the old campus text.
  - `videoTabs`: the school film opens the hero album, followed by the photos by area.
  - `courseHighlights`: badges for the 2027 IELTS and TOEIC official-exam gifts.
  - Course notes now carry `courseIds` and open inside their courses: 雅思保分目标, 托业保分目标 and 亲子课程怎么报. 分级、测试与换课 is the general note. Guarantee courses lead the IELTS and TOEIC groups.
  - Each room price card opens that room type's photos. The profile's `rateIds` (added for EV) link the cards to the photos, because CPILS shows no room codes; CIA still matches by `bookingCode`.
  - The compact calendar shows only the peak weeks. The month table is left out when a school has no holiday calendar.
  - The quote and 方案对比 use `layoutVersion: 2`: the consultant select, the title card with that consultant's QR code, the 报价条件 line, per-student 小计 and merged 本次不产生 rows. Rows set to zero for a long-term visa carry `waived`, so they keep their own row and adviser-confirmation note instead of being merged.
  - Shared company content: the five consultants in daily rotation, the floating 免费咨询 panel, the why-思达启航 section and the shared `SCHOOL_REFERENCE_NOTE`.
  - The earlier single-video CSS in `ph-school-page-options.css` was dropped. With the hero album it is no longer needed.

## Content decisions

- The page never shows school contacts, the website, social accounts, the street address, the dorm Wi-Fi password, staff or student names, agent commission, or source citations.
- The 2027 peak surcharge is 60 dollars per study week for 2027-07-04 to 08-28, following the BESA/CALA joint notice (user decision 2026-11-21). CPILS is now in `ASSOCIATION_PEAK_SCHOOL_CODES`, so 2026 weeks stay at 40 dollars and a saved per-week fee cannot change either rate. Only study weeks count (accommodation-only weeks do not), and the surcharge is outside every discount.
- Visa rules come from the June 2026 orientation handbook:
  - 30-day visa: the first extension is 5,130 pesos and the second is 6,400 pesos.
  - 59-day visa: the first extension counts as the second (6,400 pesos).
  - ACR I-CARD and ARP (200 pesos) are added with the second extension.

## Quote rules added 2026-11-21 (user decisions)

- Light ESL does not run in July or August. A course row with any Monday–Friday class day in those months blocks the quote with “轻松ESL（Light）7、8月不开课”. Its course note says so.
- Stays over 24 weeks pay the SSP again (7,800 pesos a second time) and the CRTV once (1,400 pesos). Both count in the local-fee total; for long-term visas both stay at zero with the adviser-confirmation note. The quote now allows up to 48 weeks, the length a second SSP covers. Up to 24 weeks the CRTV row is zero, and the image merges it into 本次不产生.
- Parent-child child course: CPILS's sheet did not date the off-season, so every week outside the peak surcharge dates (2027-07-04 to 08-28) is off-season.
  - Off-season (all one-to-one): 1,197 dollars per four weeks, 491/778/1,017 for 1/2/3 weeks.
  - Peak: 1,092, 448/710/928.
  - A plan across both is priced week by week at the student's own duration tier, and the peak weeks also pay the 60-dollar surcharge.
  - The parent course keeps one price all year.
- The no-window room discount is capped at the supplied 24-week tier (300 dollars), so longer stays do not add more.
- CPILS is the third school on `/price-compare`. Its page shows the 和其他学校比一比 link. The comparison applies the same course and room filters as the page (`cpilsVisibleCourses`, `cpilsRooms2027`, now in `cpils-pricing.ts`).

## Media

- `public/assets/cpils/gallery/`: 68 WebP images.
- `public/assets/cpils/rooms/`: 27 WebP images.
- `public/assets/cpils/videos/cpils-intro-2027.mp4`: 2:30, 720p, about 40 MB, with a poster image.
- All of it comes from the school's Drive folder. Duplicates and a photo of mostly minors were dropped.
- Five segments were cut from the intro video:
  - the "best school" title;
  - the online-class segment;
  - named student review cards;
  - student score posters;
  - trailing black frames.
- The 11 older WebP files in `assets/cpils/` are untouched because the Cebu directory uses them.
- Taiwan wording rule (2026-11-21): the student-source lines say 中国大陆 and 中国台湾 and 国家和地区. The lobby photo `gallery/campus-lobby.webp` shows a world map made of flags, so the Taiwan island on it is covered with a small gray mosaic. The same map appears briefly in the intro video, but there it is only one or two pixels and cannot be read.

## Verification

- `npm run build`, the server `.csproj` build and `node scripts/sync-cpils-seed.cjs --check` pass.
- CPILS tests pass (53 after the 2026-11-21 rules):
  ```
  npx ng test --watch=false --browsers=ChromeHeadlessNoSandbox --ts-config=tsconfig.cpils.spec.json --include=src/app/pages/philippines/cpils-school/cpils-school-page.spec.ts --progress=false
  ```
- Results of other test suites:
  - The school comparison suite (`tsconfig.school-compare.spec.json`) passes, including the CPILS equality checks.
  - The quote-rules, EV and CIA plan-compare/preview suites pass.
  - The textbook-integration, school-quote-rollout and CIA group suites fail exactly as on unchanged code, with the same tests and the same injection errors.
  - The CPILS promotion-preview spec, which already failed on unchanged code, now uses a fixed scenario and passes.
- Desktop (1440 px, and 1280 px after the template move) and phone (375 px) layouts were checked in a local dev server, without the API, so compiled defaults were used. There was no horizontal overflow.
- Nothing has been published to the production content revision.

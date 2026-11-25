# HELP Clark page update (2026-11-24)

HELP sent a Google Drive folder ("学校云端") with material for its Clark and Baguio campuses. The user asked to update
the HELP Clark page, so only the Clark material is used; the Baguio permits and photos are not.

## What changed

- `/philippines-study/clark/help-english-clark` now renders `HelpSchoolPageComponent` on the shared Philippine school
  template in CIA's compact layout, with `layoutVersion: 2` quote and comparison images. The old
  `help-school.component.*` and `help-school-detail.component.*` files were removed.
- `help-page-content.ts` holds all page text and data, `help-page-profile.ts` fills the template and
  `help-page-quote.ts` calculates each student. `help-content-config.ts` (school code `HELP-CLARK`) holds prices, offers
  and local fees. Prices come only from this document (`applyPricingData` is a no-op).
- Photos: `public/assets/help-clark/campus/` (36) and `rooms/` (twin, triple and quad, six each), WebP at most 1400 px.
  Videos: `public/assets/help-clark/videos/` (720p H.264 with posters): the 2024 campus tour and one clip each of the
  new twin, triple and quad rooms; each room's photo album opens with its own clip. The single room has no photo.
- SEO title, description and image updated; the route, sitemap entry, prerender list and menu entry were already there.

## Sources used

| File in the pack | Used for |
| --- | --- |
| 价格&淡季优惠 (2026 price list and second-half offer) | 7 courses, 4 family-camp courses, 4 rooms, 40/65/80% short stays, 100-dollar registration, off-season and SNS offers, registration waiver |
| HELP Admission Calendar 2026 | Admission Sundays every two weeks (2026-01-04 to 2026-12-20) |
| Clark student handbook (Regular Orientation) | Daily timetable, attendance and level tests, meals and hours, cleaning and laundry, dorm and curfew rules, visa and passport |
| HELP agency handbook (C-v1-2025) | Floors and facilities, course lines, local-fee sheet (cross-checked with the handbook) |
| HELP-FAMILY CAMP (v1), 亲子课程学员手册 | Family-camp courses, GIS kindergarten, kindergarten materials |
| HELP-JUNIOR CAMP (2027), GIS junior camp, Junior OT | 2027 summer junior camp (information only, not in the calculator) |
| HELP Students' pick up | Clark and Manila pickup rates by group size |
| Business permit, TESDA certificate | Licence strip text (CDC permit 2026-01-22 to 2028-12-31; TESDA ESL to 2029-07-09); documents not published |
| MEAL MENU | Meal description only |

## Decisions

- 2027 prices are not published yet: the quote uses 2026 prices and says so in the course note and image footer.
- Offers (first course start 2026-08-16 to 2026-12-06): 100 dollars off-season and 200 dollars SNS per complete four
  course weeks; registration waived from 8 course weeks. Then the 思达启航 5% on tuition and accommodation less those
  offers. Returning students waive registration. No peak surcharge.
- Minors in an adult course may not study in January, February, June, July or August (blocked); otherwise they pay the
  200-dollar minor management fee. Family-camp children do not.
- Local fees follow the school's 30-day and 59-day tables for 4–24 weeks (checked for 4/6/8/10/12/14/18/22/24 weeks):
  SSP 7,800, E-CARD 4,500, visa extensions 4,940/6,210/4,240 (30-day entry) or 6,210/4,210 (59-day entry), ACR I-CARD
  4,000 with the first extension, books 1,700 per started 4 course weeks, ID 200, water, electricity, laundry and
  maintenance 250 each per room week, kindergarten materials 500 per started 4 weeks. The 3,000-peso deposit and the
  pickups stay outside the total.
- Left out because the sources disagree or would expose agency or school information: commission rates, group NET
  prices, the off-season cancellation day count, Special Class rules, the extra-laundry kilo price, Taiwan lead flights,
  and all school contact details, address, website and social accounts.

## Tests

`npx ng test --watch=false --browsers=ChromeHeadlessNoSandbox --ts-config=tsconfig.help.spec.json --include=src/app/pages/philippines/help-school/help-school-page.spec.ts --progress=false`
(11 tests: offers and Sida order, registration waiver, short stays, minors, local fees, deposit and pickups, room links).

## Videos from HELP's YouTube channels (2026-11-25)

Searched HELP's two official YouTube channels ("HELP ENGLISH" and "HELP English Academy") for Clark footage. Agency
channels (Phil English, DMM留学 and others) were not used.

| Video | File | Notes |
| --- | --- | --- |
| A Daily Life in HELP Clark Campus (2024-11-28) | `student-day-2024.mp4`, 3:35 | Used whole: a Vietnamese student's day (classes, lunch, special class, self-study, vocabulary test, dorm). Vietnamese captions. |
| HELP Junior Camp 2026 Recap (2026-10-05) | `junior-camp-2026.mp4`, 1:14 | Kept 0:05–0:19.5, 0:23.7–1:13.8, 1:20.5–1:25.3 and 1:35.8–1:41. Cut: airline wing (opening), a visiting group in orange uniform T-shirts with another organisation's logo (group photo, presentations, ending), water park and bowling alley (venue branding). |

Not used: the 2019 teacher interviews (ESL, Business, Test; campus not identifiable, teachers may have left), the 2019
Clark campus film (older than the 2024 tour), and the Baguio, online-course and Vietnamese-language promotional videos.
The HELP Facebook page could not be reached from this PC, so nothing was taken from Facebook.

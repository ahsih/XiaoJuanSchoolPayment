# A&J ECO Campus page update (2026-11-24)

The school shared a Google Drive folder (brochure, 2026 and 2027 course guides, price list, local-fee notice, offer
posters, 2027 peak notice, refund rules, 2027 holiday poster, new-student handbook, photos and videos). The user
asked to update the Baguio A&J page from it.

## What changed

- `/philippines-study/baguio/anj-e-edu-english-academy` now renders `AnjSchoolPageComponent` on the shared
  Philippine school template in CIA's compact layout, with `layoutVersion: 2` quote and comparison images. The old
  `anj-school.component.*`, `anj-pricing.ts` and `anj-student-quote.ts` (and their specs) were removed.
- `anj-page-content.ts` holds all page text and data, `anj-page-profile.ts` fills the template and
  `anj-page-quote.ts` calculates each student. `anj-content-config.ts` (`ANJ_POLICY_VERSION` 1) holds courses, rooms,
  offers and local fees; `cloneAnjContentConfig` replaces the older offers, local fees and untouched image copy of a
  saved document once and keeps other employee edits.
- Prices come only from the content document (`applyPricingData` is a no-op); the database rows are an older 2026
  copy. The server seed is unchanged (insert-only).
- Photos: `public/assets/anj/campus/` and `rooms/` (WebP, at most 1400 px, never upscaled). Videos:
  `public/assets/anj/videos/` (720p H.264 with posters, `preload="none"`): the school film and seven room clips
  (Deluxe single, twin and triple, Premium twin, Premium Studio, Suite, Villa). Each room's photo album opens with its
  own clip. There are no Premium Studio photos, so its card uses the clip's poster.
- 14 vertical clips (720×1280) from A&J's WeChat Channels folder (user, 2026-11-24): gate, campus lawns, dorm
  building, Deluxe single, twin and triple, Villa, gym, indoor sports hall, golf range, camping area, store, cafe and
  dining hall, meals. Their overlays name only 碧瑶A&J and the place; no other company, contact or end card. The hero
  album groups all clips as 校园／宿舍／设施／餐厅. The channel's 复式套房 clip is not used: it walks through a Premium
  apartment and then another unit, so it cannot be matched to one priced room.
- 15 room prices do not fit the template's one-row price table on wide screens, so `anj-school-page.component.css`
  (this page only) shows the five room groups in two rows. The shared template is unchanged.

## Sources used

| File in the pack | Used for |
| --- | --- |
| Eco Campus brochure, 学校手册 | Overview, buildings, facilities, room descriptions |
| 2027学校课程介绍 (and 2026 for comparison) | 12 courses, daily classes, guarantee conditions, Working Holiday OJT |
| 价格表 | 4-week course and room prices, whole-room prices, guarantee packages |
| AJ_Campus_Local_Fees_Notice_EN + the Chinese fee sheet | SSP, E-Card, visa extensions (30 and 59 days), ACR, utilities, maintenance, books, ID, BESA pickup, deposit, laundry |
| 新-优惠汇总 and the offer posters | Regular, 2026 and 2027 low-season, birthday and IELTS-exam offers; they stack |
| 2027.6.27-8.22旺季附加费 | 2027 summer peak: 60 dollars per study week, at least 4 weeks |
| 退款规则 | Refunds after arrival (shown) |
| 2027 假期表 | Weekday holidays in the 2027 calendar |
| 新生手册 | Timetable, dorm rules, meals, cleaning and laundry, arrival and pickup, other fees |

## Decisions

- 思达启航 waives the 100-dollar registration fee for every student and takes 5% off the full tuition and room
  price first; the school offers come off after it (A&J's files give no order). The peak surcharge is never discounted.
- Regular offer: 2026/08/01–11/30 arrivals 50/150/300/450/600/750 dollars for 4–24 weeks; 2026/12/01–2027/02/28
  arrivals 100/200/300/400/500 for 8–24 weeks. Low season: 100 dollars per 4 course weeks for 2026/10/01–2027/01/09
  arrivals, 300 for 2027/02/28–06/26 and 2027/08/22–12/26 arrivals (peak weeks do not count). Birthday 100 dollars
  with at least 4 weeks: 2026 by birth-day ending per arrival quarter, from 2027 birth month = arrival month.
- IELTS course 12 weeks or more: one free official IELTS test (non-cash row). Guarantee courses are whole packages:
  IELTS 12/20/24 weeks (3,150/5,250/6,300), TOEIC 12/16 weeks (2,850/3,800); the course list shows the 12-week price.
  Working Holiday runs 4, 8 or 12 weeks.
- 1/2/3-week stays cost 40/65/90% of the 4-week price; longer stays are proportional.
- Summer peak: 40 dollars a week through 2026 (2026/06/28–08/22), 60 from 2027 (2027/06/27–08/22, at least 4 weeks);
  a week counts when its Monday–Friday class days touch the range, course and room weeks once.
- Whole rooms (Suite for two, Studio for three or four, Villa for two to four) are priced once per room and split
  among the group members who pick the same room and dates; a single quote is blocked with a note. Their utility,
  maintenance and deposit are split the same way. Family-only rooms are marked.
- Local fees: SSP 7,800, E-Card 4,500, visa extensions 4,940/6,210 then 4,240 (59-day entry starts at 6,210),
  ACR I-Card 4,000 with the first extension, utilities 3,000/4,000/4,500 and maintenance 1,500/2,000 per 4 room
  weeks, books 1,000 (ESL) or 1,500 (test courses) per started 4 course weeks, ID 200, BESA Sunday pickup 3,000
  (can be turned off). Deposit and laundry are reference rows outside the total.
- Junior courses are for under-18 students only; adults are blocked.
- The refund section shows only rules after arrival plus 思达启航's own deposit rule. The school's pre-entry change
  and cancellation penalties, agency rules and the December agency-only offer are not published.
- No address, phone, website, social account, QR code or commission text is published.

## Tests

`npx ng test --watch=false --browsers=ChromeHeadlessNoSandbox --ts-config=tsconfig.anj-spec.json --include=src/app/pages/philippines/anj-school/anj-school-page.spec.ts --progress=false`
(12 tests).

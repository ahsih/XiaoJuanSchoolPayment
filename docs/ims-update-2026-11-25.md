# IMS Academy page update (2026-11-25)

The user sent IMS's 2026-11-19 notice on the off-season 2+2 offer and the school's IMS-CHINA Google Drive folder, and
asked to update the IMS page. Per the standing decision for Philippine schools, the page moved onto the shared template.

## What changed

- `/philippines-study/cebu/ims-academy` now renders `ImsSchoolPageComponent` on the shared Philippine school template in
  CIA's compact layout, with `layoutVersion: 2` quote and comparison images. The old `ims-school.component.*`,
  `ims-student-quote.ts` and their specs were removed.
- `ims-page-content.ts` holds all page text and data, `ims-page-profile.ts` fills the template, `ims-page-quote.ts`
  calculates each student (`ImsPageStudent`, `ImsQuote`, `ImsPlanComparison`), and `ims-content-config.ts` (code `IMS`)
  holds prices, offers and local fees. `ims-pricing.ts` stays as the price-list transcription the document is built from.
  Prices come only from the content document (`applyPricingData` is a no-op); `SeedImsPricingAsync` is unchanged.
- `IMS_POLICY_VERSION` 1 moves a document saved for the former page once onto the new course names, class lines,
  walk-in choice, local fees and offers; saved prices and switches are kept. Because IMS has one price year and the
  employee editor edits only `tuition`, `cloneImsContentConfig` keeps `tuition2027` equal to it (guarantee courses use
  their 12-week package price). The editor now shows the 1/2/3-week ratio fields for IMS.
- Media: 32 campus and 9 room photos (WebP) in `public/assets/ims/campus/` and `rooms/`, and eight school videos in
  `videos/` (720p H.264 with posters, about 128 MB): from the Drive pack the campus film, pool party, business
  presentation and Power Speaking speech; from IMS's official YouTube channel (@IMSAcademy, user request: videos that
  build trust) three student interviews (Korean IELTS student, Vietnamese Premium ESL student, Vietnamese IELTS student)
  in a new 学员访谈 album group, and the Senior ESL class among the course videos. The old top-level
  `public/assets/ims/*.webp` files and `ims-campus-tour.mp4` were removed.
- Template additions used by IMS (optional, other schools unchanged): `PhPageStudent.hideReturning` hides the
  new/returning choice, and `PhSchoolQuote.registrationBaseNote` lets a school replace the registration-row note.

## Sources used

| File in the pack | Used for |
| --- | --- |
| 关于IMS淡季2+2推广优惠活动的执行说明 (2026-11-19) | 2+2 rules and tasks (3 notes + 1 video on 小红书/抖音 by Friday 12:00 of week 3, interview video in the last week), no 95折 on those four weeks |
| 2026 China price list (xlsx) | 26 courses, 4 rooms, 30/60/80% short stays, guarantee 12/16/20/24-week packages, extra-class prices, minor services |
| Off-season and long-stay offers (2026-09-30) | 300 dollars per four off-season weeks (75 a week for leftover weeks), long-stay tiers 50–400 on paid course weeks, group-class exchange periods |
| Registration notice (2026-10-16) | 100 dollars for every student, returning students too |
| Local-fee sheet (2026-07-01) | SSP 8,000, E-CARD 4,000, visa extensions, ACR I-CARD, books 3,000, ID 300, water/electricity 500 and air-conditioning 250 per room week, deposit, pickup and drop-off |
| 2026 Chinese brochure | Course lines and age limits, floors and facilities, daily timetable, family courses, junior class counts |
| Stay-in and walk-in regulations | Curfew and outing hours, dorm rules, meals and hours, cleaning and laundry, refund rules after arrival, walk-in fees |
| 2027 calendar, Christmas make-up poster, 2027 winter-camp posters | Holiday table, FAQ items (hidden after their dates) |

## Decisions

- Videos (2026-11-25 check): the campus film's study-room shot shows the flag of the Taiwan authorities on a wall,
  so it was cut, together with its ESL/IELTS/ETS TOEIC logo card (72 s now). The Vietnamese ESL interview has the
  same wall: its classroom shot keeps a gray mosaic over the flag row, and the sentence listing "Chinese, Taiwan" among
  countries, with flag stickers, was cut. Both interviews from YouTube end before the ims7.com card. The Senior ESL
  clip keeps its title card, group class and one-to-one class only: its class tables (Senior ESL 4 with only one-to-one
  classes) differ from the 2026 price list, and a door in the other shots carries a logo sign we could not identify.
  Not used: promo films repeating the campus film (and opening with an airport and a flag fountain), camp videos,
  Ayala-campus and pre-2024 uploads, the city day tour (shop signs) and the Working Holiday talk (Vietnamese subtitles).
  The Facebook page needs a login and its public video tab shows only 2019 clips. Card texts follow the videos' own
  captions and never name the students.
- Order: 思达启航 5% on the full tuition and room first, except the four 2+2 weeks (the school notice says they take no
  95折); then 2+2, the off-season offer and the long-stay tier.
- A week belongs to the month of its Wednesday; January, June, July and August are not off-season. The calendar marks
  2027-01-03–01-30 and 2027-05-30–08-28 as weeks without the off-season offer (no peak surcharge). For such
  school-only ranges the template now marks a month only when a covered class week has its Wednesday in it, so May is
  not marked; HANA's months are unchanged and ranges with a surcharge keep the old rule.
- Ages: most courses 15+; TOEIC Speaking, OPIc, TESOL and Parents ESL 20+ (the course table; one detail page says 15+);
  Senior ESL 50+; Junior courses 7–14 with a parent on Parents ESL. Guardian Service (450 dollars per 4 weeks) only in
  the off-season; School Management (2,100) any time; both are optional choices under 学生情况.
- Walk-in students pay only tuition and no water, electricity, air-conditioning or deposit; walk-in lunch is a reference.
- 2027 prices are not published: quotes use the 2026 list and say so.
- Refund section: the 思达启航 deposit rows word for word, then the school's post-entry rules. Not published: the agency
  refund account, agency-only extension rules, the penalty for sharing agency discounts, commission, the 2022 business
  permit (out of date, so no licence strip), addresses, phone numbers, social accounts and the nationality chart.
- The free 17:30–20:30 evening care for children (family page) and "evening care in peak season only" (course table)
  disagree; the page states both and asks the adviser to confirm.

## Verification

- `npx ng test --watch=false --browsers=ChromeHeadlessNoSandbox --ts-config=tsconfig.ims.spec.json --include=src/app/pages/philippines/ims-school/ims-school-page.spec.ts --progress=false`: 16 passed.
- `tsconfig.quote-rules.spec.json` (`school-quote-rules.spec.ts`): 138 passed. `node scripts/verify-textbook-estimates.cjs`: 85 passed.
- `school-textbook-integration.spec.ts`: 49 passed, 35 failed; every school (IMS included) fails the same
  "production PNG renderer" test with NG0203 for `ExchangeRateService`, a known harness problem, not this change.
- `tsc --noEmit` for the app and the spec projects is clean. A full `ng build` was not run because C: had about 1 GB free.

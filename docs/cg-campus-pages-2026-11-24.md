# CG Banilad and CG Sparta on the Philippine template (2026-11-24)

## Request

The user sent CG Academy's 2026-11 school pack and asked for both campus pages to be updated as two separate pages whose content is never mixed. Both routes now render on the shared Philippine school template in CIA's compact layout, with `layoutVersion: 2` quote and comparison images.

| | CG Banilad | CG Sparta (CG斯巴达校区) |
| --- | --- | --- |
| Route | `/philippines-study/cebu/cg-academy-banilad-campus` | `/philippines-study/cebu/cg-academy-sparta-campus` |
| Component | `CgBaniladSchoolPageComponent` | `CgSpartaSchoolPageComponent` |
| Content document | `cg-banilad-content-config.ts`, `CG-BANILAD` | `cg-sparta-content-config.ts`, `CG-SPARTA` |
| Page text and data | `cg-banilad-page-content.ts` | `cg-sparta-page-content.ts` |
| Profile / quote | `cg-banilad-page-profile.ts`, `cg-banilad-page-quote.ts` | `cg-sparta-page-profile.ts`, `cg-sparta-page-quote.ts` |
| Media | `public/assets/cg-banilad/` | `public/assets/cg-sparta/` |

Shared code only: `cg-page-quote.ts` (calculation, campus differences in `CgCampusRules`), `cg-content-policy.ts` (`CG_POLICY_VERSION`) and `cg-local-fees.ts`. The old standalone components, their student-quote classes and CSS were deleted.

## Sources

Files in the pack (also kept at `G:\菲律宾游学\宿务\CG\2026-11-23\`):

- 2026 Chinese brochure, both campuses' orientation guides and price lists.
- Both 2027 holiday calendars.
- CALA 2027 peak-season notice (2027/07/04–08/28, 60 dollars per week).
- CG Sparta IELTS Guarantee 2027 opening dates and schedule (poster).
- CG's Google Drive folder: campus photos, two campus films, IELTS score reports.

## What the pages use

- Prices: the 2026 price lists, unchanged for 2027. `applyPricingData` is a no-op; the database lookup `CG Academy` returns both campuses and `findSchool` picks the right record.
- Banilad: 12 courses (semi-Sparta and ESL, Light ESL, Booster, Junior, Guardian), 1–24 weeks; campus single/twin/triple/quad rooms only; long-stay scholarship counts all course weeks once (12/16/20/24 weeks → 50/100/150/200 dollars).
- Sparta: 9 courses, 1–52 weeks; long-stay offer per continuous course period, capped at 200; IELTS Guarantee only 12 weeks from the school's arrival Sundays (`CG_SPARTA_IELTS_GUARANTEE_STARTS`), listed as 3,300 dollars per 12 weeks; IELTS Intensive from 4 weeks.
- Booster ESL at both campuses: sold only on its own, 1 week (370) or 2 weeks (640), listed per week.
- Short stays 40/60/85%; registration 100 dollars, returning students free; Sida 10% on tuition and room, then 150 dollars per full 4 weeks for course periods starting 2026/08/30–12/27 or 2027/02/14–05/23; CALA surcharge 60 dollars per unique week in 2027/07/04–08/28 (40 in 2026), outside every discount.
- Local fees: SSP 7,800 (twice for stays of 25 weeks or more, as both orientation guides say), ACR E-Card 4,500, ACR I-Card 4,500 and biometrics 300 with the first tourist extension (6,390, then 4,460 each); management 2,000, electricity 2,000 and water 500 per 4 room weeks, switching for arrivals from 2027/01/03 to 750, 500 (base; air-conditioning extra at 25 pesos/kWh) and 300 per week; textbooks 2,000 per started 8 weeks of each course type, computed (the old manual count is gone); pickup 1,200 and the 250-peso weekly room deposit stay outside the total. Long-term visas zero the visa rows with the adviser note.
- `CG_POLICY_VERSION` moves saved revisions once onto the pack's Chinese course names, schedules and notes, adds Booster, disables rooms the school no longer offers (Sparta's off-campus M&J rooms) and refreshes untouched table and image copy. Edited prices are kept.

## Media

- Photos: WebP, at most 1400 px, from CG's Drive folder, each labelled by what it shows. Banilad's triple room has no photo of its own, so it shows none.
- Videos: each campus has its own campus film and a vertical student-day clip (720p H.264, posters in `videos/`). The Banilad film's classroom shots with a flag of the Taiwan authorities were cut; the Sparta film's shots showing a British Council sign were cut.
- More videos (2026-11-25, user request for trust-building clips): from CG's official YouTube channel, only clips whose title, caption or signs name the campus. Banilad: purple-building walk (2024), Irisa interview (a Chinese student, 2026), a second student-day clip (2025) and the first day (2024: pickup, orientation, campus tour, local fees, class schedule). Sparta: Hanni (Japanese, 24-week Sparta course, 2025) and Johnson (中国台湾学员, 2025) interviews, and a daily-life clip (2024). Cuts: the interviews' opening cards (school website), the second Banilad student-day clip's classroom collage (a flag of the Taiwan authorities on the wall), the first-day clip's mall and shop shots and end cards (it was also cut out of its vertical frame, 720×404), and the daily-life clip's black bars (720×960) and CapCut end card. Johnson's subtitle says he is from Taiwan; the page calls him 中国台湾学员. The hero album groups the videos as 校园／学员访谈／学员日常 (`topic`).
- Left out from the channel: clips that do not name a campus (graduations, the coffee shop, gym and self-study shorts, 2018–2020 class and interview videos), a student interview filmed at Banilad but labelled Sparta course, the snack-bar clip (ice-cream and snack brands fill the frame) and an agency-facing marketing video. Facebook was not used: CG's pages there are per market (Vietnam, Taiwan, Junior Camp) and show videos only after login.
- IELTS reports: Banilad two (Vietnamese students), Sparta one (Korean student), with names, photos, birth dates and candidate and report numbers pixelated.

## Left out on purpose

- The brochure's nationality chart (it lists Taiwan as a country).
- CG's addresses, phone numbers, websites and social accounts.
- Internal agency terms from the pack.

## Tests

```powershell
npx ng test --watch=false --browsers=ChromeHeadlessNoSandbox --ts-config=tsconfig.cg.spec.json --include=src/app/pages/philippines/cg-school-pages.spec.ts --progress=false
```

`cg-school-pages.spec.ts` checks the media separation, default prices, long-stay rules, IELTS Guarantee and Booster limits, the 2027 utilities switch and the policy upgrade. The cross-school specs (quote rules, rollout, textbook, unified content, quote-image layout and comparison) were updated for the new components; the textbook-integration and quote-image-layout suites had the same failures on the unchanged baseline.

# MONOL main campus page: sources and decisions (2026-11-25)

The user asked to update the MONOL main-campus page from the school's Google Drive pack ("PHOTO & VIDEO"). The page
at `/philippines-study/baguio/monol` now runs on the shared Philippine school template (CIA's compact layout,
`layoutVersion: 2` quote and 方案对比 images), like MONOL Sparta on 2026-11-24. The two campuses stay separate
schools: no price, rule or photo is shared.

## Files

| File | Role |
| --- | --- |
| `monol-school/monol-page-content.ts` | All page text and data (pure, mini-program-ready) |
| `monol-school/monol-page-profile.ts` | Template profile |
| `monol-school/monol-page-quote.ts` | Student calculation, quote and plan comparison |
| `monol-school/monol-content-config.ts` | Versioned content document, `MONOL_POLICY_VERSION` 1 |
| `monol-school/monol-school-page.component.ts` | Route component |
| `public/assets/philippines/monol-main/` | `campus/` (31), `rooms/` (35) WebP photos, `videos/` (9 clips, 720p H.264, about 105 MB) |

Removed: `monol-school-detail.component.*`, the unused `monol-school.component.*`, `monol-student-quote.ts` and
`scripts/verify-monol-promotions.cjs` (its cases are in `monol-school-page.spec.ts`). The older
`public/assets/philippines/monol-*.webp` files stay because the Baguio directory and other pages use them.

## Sources in the pack

| File | Used for |
| --- | --- |
| `MONOL費用明細表Updated on 20260907.pdf` | Course and room prices, short-stay rates, registration, SSP, ACR, visa extensions, pickup, deposit, meals |
| `学生手册CN (2026.10) for printing.pdf` | Services, courses, timetable, dorm rules, penalties, refund rules, class days, graduation |
| `MONOL 主校區 20261023.pdf` | Courses, fitness classes, MONOL+, weekend trips, rooms, meals, first day, BESA pickups |
| `SNS MAIN CAMPUS TW&CN&JP.jpg` and the 2026 promotion poster | 2026 course, room, SNS, long-stay and Christmas offers |
| `BESA CALENDAR 2027 REVISED.png` | 2027 holidays and BESA pickup dates |
| `DORMITORY`, `FACILITIES`, `FITNESS CLASS`, `VIDEO` folders, `MONOL Campus Tour.mp4` | Gallery, room albums, videos |

Not used:

- The Taiwan handbook, the Taiwan school summary, the Taiwanese surf posters and the BESA-TW fam-tour folder (agency material or
  duplicates of the Chinese handbook).
- `MONOL 2025 FAM TOUR PPT.pptx` and the fam-tour material: agency information, never public.
- `2026 MONOL夏令營手冊.pdf`: the 2026 summer camp is over; no 2027 camp details yet.
- `Old Promos`, `MONOL CALENDAR 2026.png`, the barista and Golfgram posters: past or paid extras with no current price.
- `Baguio Street Interview.mp4`, summer-camp clips and interviews aimed at other countries' markets.
- The handbook's address, e-mail, website, Wi-Fi details, agency service-fee lines and payment deadlines.

## Prices and rules (content document, policy version 1)

- **Courses** (dollars per 4 weeks): Light ESL 轻量ESL 750, General ESL 综合ESL 900, IELTS 雅思 1,000 (includes a
  100-dollar academic fee), LEAP English 客制化课程 1,150 (includes 250). 2027 prices equal 2026.
- **Rooms** (dollars per 4 weeks, no meals): 高级单人间A型 1,100, 高级单人间B型 1,100, 标准单人间 750, 单人雅房 650,
  三人间 500, 胶囊四人间 400. Premium A and B have two large beds and take 2–4 people; each extra person pays 200
  dollars per 4 weeks (the 高级单人间同住 choice under 学生情况), and that part gets no room offer.
- **Short stays:** 1/2/3 weeks are 40/60/80% of the four-week price; four weeks and more are proportional.
- **Registration:** 100 dollars, waived for every 思达启航 student.
- **2026 offers** (registration by 2026/12/31, study weeks that also have a room on campus; weeks touching
  2027/06/27–08/21 do not count; split rows are added together):
  - 100 dollars off tuition and 100 off accommodation per complete 4 weeks.
  - SNS (opt-in, standard single and semi-single rooms only): another 100 per complete 4 weeks in those rooms.
  - Long stay (registration 2026/09/07–12/31): 150 / 200 / 300 dollars at 16 / 20 / 24 weeks (the highest tier reached).
  - Christmas and New Year: 100 dollars once for a Sunday arrival 2026/11/29–2027/01/10 with at least 4 weeks.
  - Free breakfast on class days through 2027/12/31 (information only).
- **Peak surcharge:** BESA 2027/06/27–08/22, 60 dollars per unique study or stay week, outside every offer.
- **Visa extensions:** a 30-day visa from week 5, a 59-day visa from week 9, then every 4 weeks; 6,210 pesos first,
  then 4,240 each. The fee sheet's 4,940-peso waiver step applies only to visa-free nationalities, so it is not used.
- **Local fees in the total:** SSP 7,800, SSP ACR I-CARD 4,500, BESA group pickup from Manila or Clark 3,000 when chosen.
- **Outside the total:** deposit 100 dollars (or 4,000 pesos); meals about 14,000 pesos per 4 weeks (pay per meal);
  TVV ACR I-CARD 4,000 for stays over 59 days (immigration does not charge it at present); individual pickup
  12,000 (Manila) or 7,000 (Clark) pesos per car.
- The old textbook, student-ID and per-room-week rows are dropped by the upgrade: electronic textbooks, laundry,
  room cleaning, water and electricity are free.

## Open question for the user

The 2026-10-23 overview lists every room 50 dollars higher (1,150 / 800 / 700 / 550 / 450) than the 2026-09-07 fee
sheet and the October handbook. The page uses the fee-sheet prices until the user confirms which list is current.

## Tests

`npx ng test --watch=false --browsers=ChromeHeadlessNoSandbox --ts-config=tsconfig.monol.spec.json --include=src/app/pages/philippines/monol-school/monol-school-page.spec.ts --progress=false`

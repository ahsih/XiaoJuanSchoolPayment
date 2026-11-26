# MONOL Sparta page: sources and decisions (2026-11-24)

The user asked to update the MONOL Sparta page from the school's Google Drive pack. The page at
`/philippines-study/baguio/monol-sparta-campus` now runs on the shared Philippine school template (CIA's compact
layout, `layoutVersion: 2` quote and 方案对比 images).

## Sources in the pack

| File | Used for |
| --- | --- |
| `斯巴达校区学生手册_261019.pdf` (October 2026) | Floor guide, courses and timetable, penalty system, outing and dorm rules, meals, school items, refund rules, neighbourhood, visa sequence |
| `MONOL Sparta校區費用明細表.pdf` (August 2026) | Course and room prices, registration, SSP, ACR, pickup, deposit |
| `MONOL斯巴達校區優惠活動.jpg` | 2026 course, room and SNS offers |
| `MONOL簽證及移民局相關費用算法.xlsx` | Hong Kong and Macau visa-free stays |
| `MONOL Sparta Campus/…` photo folders and the room, rooftop, cafeteria and discipline clips | Gallery, room albums, hero videos |
| `only facilities.mov` | Facilities tour (cut at 1:55, before a 76-second black tail; ends on the MONOL logo) |
| MONOL official YouTube Shorts (2026-11-25): Sparta mini tour, teacher interview, gym, study room, 1st semester moments | Hero album 校园／课堂／访谈 (`sparta-mini-tour`, `teacher-interview`, `gym-tour`, `study-room`, `semester-moments`) |

Not used:

- `w_ people.mov` (`campus-life.mp4`): the people in it look generated, so it may not show the real campus.
- Two photos from the penalty-check folder, one double-room photo, and food photos 74–80: blurred, duplicated or unclear.
- `MONOL Sparta LOGO.JPG`.

YouTube cuts (2026-11-25, every frame checked):

- Mini tour: the bulletin-board shot (28.9–32.45 s, bus-company QR codes and a Wi-Fi poster) and the closing poster (from 42.4 s: website and a generated person) were cut.
- 1st semester moments: the group classroom whose glass still carries the former CNS school logo (10.4–12.2 s) was cut.
- Teacher interview: the sentences naming CNS (3.1–12.07 s and 27.9–42.95 s) were cut; it keeps the welcome, the Main-versus-Sparta comparison and the closing message.
- Not used: the 24-hour timelapse and “Main vs Sparta” videos (generated people), the “two campuses” logo animation, the Chinese campus guide (its Sparta part mixes generated shots and shows the CNS glass logo), and the IELTS mock-test student story (its description does not say Sparta). MONOL's Facebook page could not be browsed from here, so only YouTube was used.

## Prices and rules (content document `monol-sparta-content-config.ts`, policy version 1)

- **Courses:**
  - Booster ESL 强化ESL: 950 dollars per 4 weeks.
  - Master IELTS 雅思高分: 950 dollars per 4 weeks.
- **Rooms:** 豪华单人间 1,200 / 标准单人间 1,050 / 单人雅房 900 / 双人间 800 / 三人间 700 dollars per 4 weeks, with meals.
- **Short stays:** quotes start at 4 weeks. Longer stays are proportional. For 1–3 weeks the quote tells the student to ask the consultant.
- **Registration:** the school charges 100 dollars; 思达启航 waives it for every student.
- **2026 offers** (registration by 2026/12/31):
  - 100 dollars off tuition and 100 dollars off accommodation per complete 4 weeks of study plus stay. Split rows are counted together.
  - SNS offer: another 100 dollars per complete 4 weeks. It is opt-in; the page says the school may end it at any time.
- **Peak surcharge:** 2027/06/27–08/22, 60 dollars per week (BESA notice). It is charged once per week and no offer applies to it.
- **Visa extensions:**

  | Passport and entry | Extensions start | Amounts (pesos, each extension) |
  | --- | --- | --- |
  | 30-day tourist visa | Week 5 | 4,940, then 6,210, then 4,240 each |
  | 59-day tourist visa | Week 9 | 6,210, then 4,240 each |
  | Hong Kong (14 days) or Macau (7 days) | See note | 2,460 first, then the 30-day sequence |

  Hong Kong and Macau follow the visa sheet's week bands.
- **Local fees:**
  - SSP: 7,800 pesos.
  - SSP ACR I-CARD: 4,500 pesos.
  - Group pickup from Manila or Clark: 3,000 pesos, in the total when chosen.
  - Individual pickup: 12,000 or 7,000 pesos per car, outside the total.
  - Deposit: 100 dollars or 4,000 pesos, outside the total.
  - TVV ACR I-CARD (stays over 59 days): listed for reference; immigration does not charge it at present.
- **Removed rows:** water and electricity, textbooks, the Academic Admin Fee, the unfinished-study deduction and weekend transport are switched off by the version-1 upgrade. The handbook lists none of them as a fee; the unfinished-study deduction is explained in the course notes instead.

## Left out on purpose

- The school's street address, Wi-Fi details, website and contacts.
- Agency-facing lines from the handbook: agency service fees, notifying agencies, and the Academic Admin Fee wording in the refund rules.
- Refunds before entry follow the handbook, but the page starts with 思达启航's own rule: the 2,000-yuan deposit is never refunded. A student may move the start date at least 4 weeks before entry, or keep the deposit for one year.
- No 2027 holiday calendar was in the pack, so the page has no calendar section.

## Files

- `monol-sparta-page-content.ts`: page text and data.
- `monol-sparta-page-profile.ts`: template profile.
- `monol-sparta-page-quote.ts`: student calculation, quote and comparison. The quote image sets
  `compactDetailedSections`, so the short local-fee table leaves no empty space.
- `monol-sparta-school-page.component.ts`: route component.
- Videos: `public/assets/philippines/monol-sparta/videos/` (16 clips with posters, about 56 MB).
- The old `monol-sparta-school-detail` component and `monol-sparta-student-quote.ts` were removed. The admin quote-image preview now uses `MonolSpartaQuote`.

Tests:

```
npx ng test --watch=false --browsers=ChromeHeadlessNoSandbox --ts-config=tsconfig.monol.spec.json --include=src/app/pages/philippines/monol-sparta-school/monol-sparta-school-page.spec.ts --progress=false
```

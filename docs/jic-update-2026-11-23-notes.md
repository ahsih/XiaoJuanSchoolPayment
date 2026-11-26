# JIC pages on the Philippine template (2026-11-23)

Both JIC campus pages (Challenger and Premium, Baguio) now use the shared Philippine school template in CIA's
compact layout with `layoutVersion: 2` quote and comparison images, built like CELLA's two campus pages. Prices,
offers and fees follow the user's 2026-11 school pack: the 260915 orientation deck (OT), Pricelist_202605, the
BAGUIO JIC優惠一覽 20260619 offer table, the 2025-07 local-fee sheets, the 2027 school calendar, the
December 2026 holiday notice and the BESA pickup poster.

## Files

- `jic-school/jic-page-content.ts`: all page text and data per campus (pure, mini-program-ready), the 2027 holiday
  calendar, term starts, monthly tests and the shared practical guides.
- `jic-school/jic-page-profile.ts`: fills `PhSchoolProfile` for one campus. Both campuses share one school record
  (`菲律宾碧瑶JIC语言学校`) and one content document (`JIC`); `jicCampusContent` gives each page its campus part.
- `jic-school/jic-page-quote.ts`: `JicPageStudent` wraps the unchanged-in-spirit `JicStudentQuote`; `JicQuote` and
  `JicPlanComparison` (both `layoutVersion: 2`).
- `jic-school/jic-school-page.ts` plus `jic-challenger-school.component.ts` and `jic-premium-school.component.ts`.
  The old `jic-school-detail.component.*` was removed. `/philippines-study/baguio/baguio-jic` (the former combined
  page) and `/baguio-jic-academy` now redirect to the Challenger page and left the sitemap and prerender list.
- Template hook `acceptUploadedMedia` / `refreshUploadedMedia` (in `ph-school-page.component.ts`): a page can keep
  only its own uploads. JIC reads the campus tag of each media item in the content document; untagged uploads show
  on both pages. Other schools are unchanged (the default accepts every upload).
- Tests: `tsconfig.jic.spec.json` (`jic-student-quote.spec.ts`, `jic-school-page.spec.ts`); the cross-school
  specs now create `JicChallengerSchoolComponent` and `JicPremiumSchoolComponent`.

## Rules implemented

- Prices: 2027 equals 2026 (Pricelist_202605); 1/2/3 weeks are 40/65/85% of four weeks, longer stays
  proportional, priced by each student's total course weeks.
- Registration: 100 dollars with an equal `思达启航注册费减免` line for every new student; returning students show
  0 and no waiver line. The total is the same either way.
- Off-season (`jic-off-season-*`): counted by study week, not arrival date. Room weeks wholly inside a window and
  not in a peak week are grouped by four; each complete four weeks earns the room's rate. 2026/08/23–2027/01/09:
  quad 150, twin and single 50. 2027/02/21–06/26 and 2027/08/22–2028/01/08: quad 100, twin 50, single only the
  Premium 单人雅房 50 (fixes the old bug that gave Challenger singles 50 in 2027). Not for in-school extensions.
- Peak: BESA 2027/06/27–08/22 at 60 dollars a week (2026 at 40). The week starting 2027/08/22 is both the first
  week of the second 2027 off-season window and a peak week; it counts as peak, so it earns no off-season credit.
- Holiday offer: only on term-start arrivals inside the window (2026/11/29, 12/13, 12/27, 2027/01/10: 200 once;
  2027/11/28, 12/12, 12/26, 2028/01/09: 150 once), twin or quad room, at least four weeks.
- Long-term: 12/16/20/24 weeks 300/400/500/600, then 100 more for each further complete four weeks.
- Terms start every second Sunday from 2026/11/29. New quotes start on the next term Sunday. An arrival or a
  leaving off the term dates is counted per time and shown as an 8,000-peso reference row (school confirms).
- IELTS Guarantee: same tuition as IELTS Standard, at least 8 consecutive weeks (shorter plans are blocked),
  18,000 pesos at school per started 8 weeks.
- Visa extensions (user rule 2026-11-24): a 30-day visa needs one per started four weeks beyond week 4, a 59-day
  visa one per started four weeks beyond week 8; a 59-day visa's first extension is the school's second (6,210).
- Local fees: SSP 7,800, SSP-E card 4,500, ACR 4,000 with the first extension, extensions 4,940 / 6,210 / 4,240…,
  utilities 3,000, maintenance 1,200 and laundry 1,200 per 4 accommodation weeks (proportional), ID 200,
  course textbooks per started 4 weeks, BESA Sunday pickup 3,000 (Manila or Clark), Challenger paid special
  classes 2,000 per 4 weeks when chosen. The refundable 3,000 deposit stays outside the total.
- Student conditions: visa (30 or 59 days), age, new or returning; JIC-only choices are 机场接机 and, on
  Challenger, 付费特别课. The registration date is not asked: the BESA offer that needed it has closed.

## Decisions and open points

- Maintenance: 1,200 pesos per 4 weeks, confirmed by the user on 2026-11-24 (the 2026-09 OT deck says 1,200; the
  older 2025-07 local-fee sheets said 1,000). The insert-only seed now also uses 1,200.
- Clark pickup: the BESA poster lists Sunday 01:30 for WALES, PINES and MONOL only; JIC uses Sunday 12:00 and
  17:00 and the Monday 01:30 van (bay 3).
- Not on the page: internal sales remarks from 重要提醒 (teacher quality, garbage burning), the refund rules
  (OT p80–81, not requested), school contact details, and photos that do not surely show what they are labelled
  as (`jic-main-ielts-class.webp` shows an adviser meeting; `jic-premium-single-no-balcony.webp` is a garden porch,
  used only as a campus photo; the 单人雅房 uses its video poster).
- Meals: described as mostly Korean with Japanese, Vietnamese and Filipino dishes at times; no vegetarian meals.
- Not yet synced to the WeChat mini program; follow the mini-program workflow in AGENTS.md once the user confirms.

## Official YouTube videos (2026-11-26)

User request: more videos that build trust, from JIC's own YouTube channel (@BaguioJIC). All are from 2026. Files are
720p H.264 in `public/assets/philippines/` with posters in `jic-posters/`.

- Challenger, 学员访谈 chip: `jic-challenger-student-interview` ("PRO CHALLENGER INTERVIEW: KANO"); the opening card
  with the student's full name was cut.
- Challenger, 课堂视频 chip: `jic-challenger-class-observation` ("JIC Class Observation"). Its TERMINAL ribbons are
  JIC's own campus café (already on the page as 咖啡厅), so they were kept.
- Premium, 学员访谈 chip: `jic-premium-student-interview-jack` and `jic-premium-student-interview-rick`.
- Premium, 活动视频 chip: `jic-premium-circuit-training` and `jic-premium-graduation` ("Awarding of Certificates");
  three seconds of certificates showing students' full names were cut.

Facebook was not checked (user decision 2026-11-26).

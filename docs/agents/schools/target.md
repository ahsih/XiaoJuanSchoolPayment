# School notes: target

Record new decisions about this page here; AGENTS.md holds only rules that apply to every task.

## On the shared template (2026-11-26)

`/philippines-study/cebu/target-global-english-academy` renders `TargetSchoolPageComponent` on the shared Philippine
template in CIA's compact layout with `layoutVersion: 2` quote and comparison images. Files in
`pages/philippines/target-school/`: `target-content-config.ts` (content document, code `TARGET`, `TARGET_POLICY_VERSION`
1 replaces an older saved document's catalogue, local fees and quote settings once; prices only here,
`applyPricingData` is a no-op and `TARGET` is in `CONTENT_ONLY_PRICE_SCHOOL_CODES`), `target-page-content.ts` (page text
and data), `target-page-profile.ts`, `target-page-quote.ts` and `target-school-page.component.ts`. The old
`target-school.component.*`, `target-pricing.ts` and `target-student-quote.ts` are gone; `remaining-content-config.ts`
re-exports the TARGET document for the employee editors. Sources and open questions:
`docs/target-source-2026-11-26.md`.

- Prices: the school's list for applications from 2026/07/10. Every price is a course-and-campus-room package; the
  course price is the six-person package and other rooms are supplements per 4 weeks (quad +80, triple +140, twin
  +240, single +500), which reproduces every cell. Room cards show “+X 美元” and “课程价已含” (`supplementBaseLabel`).
  1/2/3 weeks are 0.4/0.6/0.8 of the 4-week price; the shared plan applies the student's total-weeks tier to every row.
  IELTS Guarantee is 12 weeks only. Registration 150 dollars, returning students free.
- Offers: campaign discount 20/30/35 dollars per non-peak week (3 / 4–11 / 12+ weeks), none in 2026/06/28–08/22 and
  2027/06/27–08/14; then 思达启航 9折 on the package and the peak surcharge after it (registration and peso fees
  excluded; user decision 2026-11-26).
  限时尊享升级计划 (registration by 2026/11/30, entry 2026/08/23–2027/04/04, whole stay on one of TARGET 4/5/6; user decision
  2026-11-26: 4+ weeks course, 8+ weeks also room, 12+ weeks also the choice): a free 0-dollar line in the quote; its offer card and FAQ hide from 2026-12-01.
- 2027 peak 06/27–08/14: 40 dollars per peak study week, waived when the courses add up to 8 weeks or more (a 0-dollar
  line then says so).
- Local fees: SSP 7,800, E-CARD 4,500, ACR I-CARD 4,300 with the first extension, extensions 6,410 / 5,830 / 5,830 /
  5,800 from the first extension on either entry visa (a 30-day entry pays nothing for 4 weeks; user decision
  2026-11-26; past the table 5,800 each, marked as an estimate),
  exit clearance 5,000 when the stay is over 24 weeks, textbooks by course type (500 / 1,000 / 2,000 / 3,000, +1,000
  per further 4 weeks for any length, user decision 2026-11-26), electricity 600, water 200, management 500 per room week. Deposit, pickup, send-off, laundry,
  extra nights and the minor care fee are references outside the total. The two user-confirmed footer lines of the
  quote image (payment two weeks before arrival; local fees collected by the school) stay word for word.
- Media: 53 school photos and 7 school videos (introduction, campus tour, one per room type) in `public/assets/target/`.
  Room albums open with that room type's video. The old hero `public/assets/philippines/target-campus-hero.webp` stays
  because the quote-image editor still uses it.
- Not yet synced to the mini program (waiting for the user's layout and content review).

Tests: `npx ng test --watch=false --browsers=ChromeHeadlessNoSandbox --ts-config=tsconfig.target-spec.json --include=src/app/pages/philippines/target-school/target-school-page.spec.ts --progress=false`.

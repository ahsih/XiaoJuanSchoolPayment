# ELSA page on the template (2026-11-25)

The user asked to update the ELSA page from the school's Google Drive pack and said: quotes stay on the 2026 price
version; the 2027 winter peak is full; 2027 off-season offers are not decided yet (expected next month); the 2027
summer peak will carry a surcharge whose amount is still being decided.

## Sources

- 思达启航's ELSA 2026–2027 price list: course prices include the five-person room and three meals; other rooms add a
  fixed amount per four weeks (四人间 +50, 三人间 +100, 双人间 +150, 单人间 +650). These reproduce every cell of the
  list.
- School pack (Google Drive): 2026 comprehensive brochure, 2026-09 adult ESL brochure, junior/schooling/family
  brochure, 2026-10 new-student orientation, 2026-10-14 pre-departure guide with its local-fee sheet, 2027 ESL
  calendar, permits (Compostela 2026 business permit, Bureau of Immigration accreditation to 2029-02-07, DepEd
  permits), photos and the aerial campus video.
- Not downloaded: the Junior, Kinder and School class photo folders (the Drive download did not arrive).

## Decisions

- Prices: `elsa-content-config.ts` only (`applyPricingData` is a no-op; the database row
  `菲律宾宿务ELSA International Language School` is a regional starting price). 1–3 weeks are proportional.
- Offers: 思达启航 10% on course and room first, then the school's 2026 off-season offers (adult ESL half price for
  study weeks in 2026/08/30–12/26; junior, schooling and kindergarten courses wholly inside that window: 报3周送1周,
  报8周送4周, the free weeks being the cheapest, after the 10%). A parent who only stays (家长陪读) pays the package
  price, which holds registration, with no discount, in a triple to five-person room. Returning students waive
  registration.
- No peak surcharge yet: the 2027 summer amount is not decided. Page, FAQ and quote notes say the winter peak is full
  and the summer surcharge is to be announced.
- Local fees (2026-10 sheet): SSP 7,800, E-CARD 4,500, ACR I-CARD 4,000 with the first extension, extensions
  5,160 / 6,400 / 4,440 (59-day entry from 6,400), facility 1,500 per person per week, books about 2,000 per 4 course
  weeks; schooling uniform and copies once. Air conditioning (about 4,000 a month), the 5,000-peso family deposit and
  the 1,000-peso pickup are references outside the total.
- Template options added for ELSA (other schools unchanged): `copy.rooms.supplementBaseLabel` (room cards show
  “+150 美元” and “课程价已含”) and `copy.quote.courseFeeLabel` / `roomFeeLabel` (课程＋食宿, 房型加价).

## Media

`public/assets/elsa/`: 59 WebP photos (campus, classrooms, dorm buildings A/B/C, meals, facilities) at most 1400 px,
never upscaled, and `videos/campus-aerial.mp4` (118 s, 960×540, cropped to remove the school website watermark,
credits cut). Photos with flag bunting were left out. The school's photos are sorted by dorm building, not room type,
so the room cards share two albums (B/C for single, twin and triple; A for four and five).

## Not published

School address, phones, KakaoTalk, websites, the expulsion list's details, agency terms. The school files give no
refund ratios, so the refund section has only the 思达启航 deposit rules and “按学校规定”.

## Open questions for the school

- 2027 prices, 2027 off-season offers, 2027 summer peak dates and surcharge.
- Whether parent courses get any off-season offer.
- IELTS course prices (not on the price list; the page says to ask a consultant).

Tests: `npx ng test --watch=false --browsers=ChromeHeadlessNoSandbox --ts-config=tsconfig.elsa.spec.json --include=src/app/pages/philippines/elsa-school/elsa-school-page.spec.ts --progress=false`.

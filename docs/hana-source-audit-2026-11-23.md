# HANA Academy page update (2026-11-23)

The Clark HANA Academy page (`/philippines-study/clark/hana-academy`) moved onto the shared Philippine school template
(CIA compact layout, `layoutVersion: 2` quote and comparison images). Files:

- `hana-school/hana-content-config.ts`: courses, rooms, local fees, promotions and quote settings (content defaults).
- `hana-school/hana-page-quote.ts`: per-student calculation (`HanaPageStudent`), `HanaQuote`, `HanaPlanComparison`.
- `hana-school/hana-page-content.ts`: all page text and data (pure, mini-program-ready).
- `hana-school/hana-page-profile.ts`, `hana-school/hana-school-page.component.ts`: template wiring.
- Media: `public/assets/hana/` (17 campus and 5 room WebP photos, 2 videos with posters, about 30 MB).

## Sources used

- The user's zip of 2026-11-23: 2026–27 Chinese brochures (price list, adult courses, family program, junior camp,
  low-season promotion, early study abroad) and the new-student orientation (docx).
- The school's confirmed message (items 1–12) and its 2027 holiday image, pasted by the user.
- The school's public map reviews (six short excerpts, names removed; one adult excerpt from the adult brochure).
- Never published: the school's address, phone, website, online application link, social accounts, staff names, the
  brochures' graduate and review counts, and the 中国台湾 nationality labels on brochure testimonials.

## Pricing decisions

- 2026 four-week prices; 1/2/3 weeks are 35%/65%/85% of four weeks; longer stays are proportional by the student's total
  course weeks. From 2027-01-01 the quote is blocked until HANA publishes 2027 prices (students who pay by 2026-12-31
  keep 2026 prices).
- No peak surcharge. Peak seasons 2026/6/28–8/29, 2027/1/3–2/27 and 2027/6/27–8/28 are marked on the calendar only.
- Low-season long-stay discount on course and room: 10% (1–7 low weeks), 11.5% (8–11), 13% (12–15), 14.5% (16+);
  senior course 10%. Not for the junior camp, which has its own season prices.
- “Pay 4 weeks, study 8 weeks” (1,470 dollars for 8 weeks of Light ESL with a double room, scaled by the brochure's
  1–16-week table): adults, Light ESL only, double room (a parent may use a 3-person family room), low-season windows
  2026/8/30–2027/1/2 and 2027/2/28–6/26. It replaces the low-season discount and is chosen by default when eligible;
  peak weeks in the plan stay at full price. No agency discount is added (school rule).
- Registration 100 dollars per person; returning students waive it. Camp registration is extra too.
- Junior camp: all-inclusive season price (A: 2,000 low / 2,800 peak per 4 weeks, extra weeks 400 / 600;
  B: plus 100 per 4 weeks); visa extensions from week 5 are extra.
- Senior course: local fees included except the deposit (one 已含 row).
- Local fees: SSP 7,500 and E-Card 4,000 (stays of 3+ weeks; not for a non-studying parent, a low-season kindergarten
  child, or a promotion stay of up to 4 weeks), ACR I-Card 4,000 (9+ weeks), visa extensions from 4,630, student ID
  200, utility and electricity by room type and accommodation week, unaccompanied-minor care 12,000 per 4 weeks.
  Pickup, deposit and textbooks are references outside the total.

## Open questions for the school

- Visa extension sequence for a 59-day entry visa (estimated 5,900 then 4,130 each) and whether senior stays over
  4 weeks include visa extensions.
- Whether a winter-peak camp shorter or longer than the listed lengths is allowed; Junior Camp B extra-week price
  (A's extra rates are used).
- Single, triple and family room photos (only double-room photos were certain; the others are left out).
- The partner hotel dormitories and the early-study-abroad programs are not quoted online (adviser quote).
- Golf course price: the message says 1,000 for golf; the brochures say 700 (leisure) and 1,000 (intensive). Both are listed.
- Brochure refund wording (200,000 won) differs from the message (200 dollars); the page uses 200 dollars.
- The school film's narration was not checked word by word; its first seconds showed another company's logo and were cut.

## Shared template additions (CIA unchanged)

- `PhSchoolProfile.peakSeasonsWithoutSurcharge`: marks peak months on the compact calendar with a 旺季不加价 line.
- `PhSchoolProfile.textReviews` and `copy.reviews.textNote`: short written reviews as cards (styles in
  `ph-school-page-options.css`).

# HANA Academy page update (2026-11-23)

The Clark HANA Academy page (`/philippines-study/clark/hana-academy`) moved onto the shared Philippine school template
(CIA compact layout, `layoutVersion: 2` quote and comparison images). Files:

- `hana-school/hana-content-config.ts`: courses, rooms, local fees, promotions and quote settings (content defaults).
- `hana-school/hana-page-quote.ts`: per-student calculation (`HanaPageStudent`), `HanaQuote`, `HanaPlanComparison`.
- `hana-school/hana-page-content.ts`: all page text and data (pure, mini-program-ready).
- `hana-school/hana-page-profile.ts`, `hana-school/hana-school-page.component.ts`: template wiring.
- Media: `public/assets/hana/` (17 campus and 8 room WebP photos, 2 videos with posters, about 30 MB).

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
  B: 2,100 / 2,900 per 4 weeks, extra weeks at its 4-week average, 525 / 725, user decision 2026-11-24);
  visa extensions from week 5 are extra.
- Senior course: local fees included except the deposit (one 已含 row).
- Local fees: SSP 7,500 and E-Card 4,000 (stays of 3+ weeks; not for a non-studying parent, a low-season kindergarten
  child, or a promotion stay of up to 4 weeks), ACR I-Card 4,000 (the sheet lists 9+ weeks; charged with the first visa extension by the user rule of 2026-11-24), visa extensions from 4,630, student ID
  200, utility and electricity by room type and accommodation week, unaccompanied-minor care 12,000 per 4 weeks.
  Pickup, deposit and textbooks are references outside the total.

## Open questions for the school

- Whether senior stays over 4 weeks include visa extensions. Visa extensions are estimated by the user's rule
  (2026-11-24): one extension per extra 30 days, from week 5 on a 30-day visa and from week 9 on a 59-day visa;
  the 59-day sequence is estimated at 5,900 then 4,130 each.
- Whether a winter-peak camp shorter or longer than the listed lengths is allowed.
- Single and family room photos. The triple room uses the school's 2019 facility photos of a room with a single bed
  and a bunk bed (the 2023 brochure lists 1-, 2- and 3-bed rooms and family rooms, so this is the 3-bed room).
  The 2026 family brochure's 家庭房 photo carries Google Gemini's sparkle watermark (AI-made or AI-edited), so it is
  not used; no single-room photo is certain (the one-bed shots also show two desk chairs).
- The partner hotel dormitories and the early-study-abroad programs are not quoted online (adviser quote).
- The school film's narration was not checked word by word; its first seconds showed another company's logo and were cut.

## School answers (2026-11-24) and the revised Chinese orientation (OT)

- Golf: both courses run. Leisure 700 and Intensive 1,000 dollars per 4 weeks, both from 2 weeks (no 1 or 3 weeks).
  Golf in the morning, classes in the afternoon (3 Filipino one-to-one + 1 group). Both include unlimited EG Golf
  practice with balls; Intensive adds 16 private golf lessons per 4 weeks. School clubs are free to borrow but shared
  and worn, so students should bring their own (especially a 7 iron). Real golf course play is not included.
- Refund: the cancellation fee is 200 dollars (the won amount was a typo). The "deposit" is a new 400-dollar
  non-refundable family peak-season booking deposit from summer 2027; the school says it is up to the agency whether to
  collect it, so it is not on the page. The no-refund rule is "fewer than 4 weeks remain", and those weeks can be used
  in a later low season.
- Page refund section follows the 思达启航 rule for every school: the 2,000-yuan deposit and rescheduling rows, a
  late-cancellation line without the school's pre-entry amounts, the post-entry 50% rule counted from the dorm check-in
  day, the “付4周读8周” rule (counted on paid weeks: 8 weeks refundable within week 2, 12 weeks within week 3), illness
  or family emergency 50% of the remaining tuition, the 100-dollar registration never refunded, and the no-refund cases
  (expulsion, disaster or epidemic closure, absence through the student's own fault).
- Added from the OT: extending a stay of 8 weeks or less past 59 days needs a new SSP and I-CARD, 9,700 pesos extra.
- Not published from the OT: the school's mailing address, staff names, social accounts and the agency promotion note.

## Shared template additions (CIA unchanged)

- `PhSchoolProfile.peakSeasonsWithoutSurcharge`: marks peak months on the compact calendar with a 旺季不加价 line.
- `PhSchoolProfile.textReviews` and `copy.reviews.textNote`: short written reviews as cards (styles in
  `ph-school-page-options.css`).

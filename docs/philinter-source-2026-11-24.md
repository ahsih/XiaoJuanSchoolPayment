# Philinter page update, 2026-11-24

The user asked to update the Philinter (Cebu) page and supplied the school's Google Drive folder "Philinter 2026-2027" plus two PDFs (the 2025 Chinese integrated brochure and a 2026-03-02 simplified-Chinese brochure). This note records what each file was used for and what is still open.

## Sources used

| File in the pack | Used for |
| --- | --- |
| 2027 tuition sheet (updated 2026-11-04, marked 搶鮮看，尚未實施) | 2027 course and room prices, fixed course lengths, the two new courses (Booster Speaking, PTE), registration 150 dollars, junior room rules |
| 2026 tuition sheet | Room prices and registration 120 dollars, used for every quote until the school says when the 2027 sheet starts (course prices are unchanged in 2027) |
| Local-fee sheet, 2026-10-19 (dormitory and Azon) | SSP, E-card, ACR I-card, ARP, ID, visa extensions for 30-day and 59-day entries, water, electricity, maintenance, deposit tiers, pickup, early check-in and late check-out |
| Student handbook, 2026-10-19 | Timetable, first week, attendance and warnings, tests, course changes, curfew, facilities, health, housekeeping, room charges, refund rules |
| Dormitory and Azon new-student guides | Room and condo rules, shuttle, nearby shops, Azon Wi-Fi and gas |
| 2026 brochure | Course lines, Sparta and semi-Sparta courses, IELTS guarantee targets, exam venue |
| 2027 holiday poster | Weekday holidays in the 2027 calendar |
| Peak-season notice | 2027 summer 2027-07-04 to 08-28 at the 60-dollar association rate |
| Business permit, immigration accreditation, TESDA registration | Licence strip (text only) |

## Photos and videos

- 61 photos from the pack's photo folders and 12 clips from its video folders and the school's own channels, each viewed before use. Photos are WebP at most 1,400 px wide, never upscaled: rooms in `public/assets/philinter/rooms/` (校内单人间 4 + bathroom, 双人间 2, 三人间 2, Azon single 3, twin 1, triple 1, Azon kitchen, bathroom and shower), everything else in `gallery/`. The two outreach photos were removed again (local children, faces already blurred), leaving 59.
- Videos are 720p H.264 (two 540p sources stay 540p) with a poster frame each, about 104 MB. Cuts: the Azon clips end before shop signs, a mall and an email address; two interviews end before social-media handles; the “From Taiwan” bar in the pronunciation interview is covered with a gray mosaic.
- Left out: a 中国台湾 student video and review cards showing the Taiwan authorities' flag; a business review with “TAIWAN” and the school website on screen; clips with subscribe badges, a stock-photo URL, another company's slide, a streaming-service parody; the outreach video (close-ups of local children); photos with store logos, brand packaging, a contact line, lyrics, an unknown logo, masks, unclear room types or low resolution.
- The older top-level photos `lobby` (a night pool), `one-on-one-room` (a large study room), `single-room`, `double-room`, `triple-room`, `study-hall`, `cafeteria-1/2`, `laundry` and the old holiday poster were deleted because they were unused or did not show what their names said. `condo-room` is the Azon tower and is labelled so.

Not published: the nationality chart, Wi-Fi passwords, the handbook's sensitive-topic list, agency rules (extensions only through the original agency, commission), the school's contacts and address, extra-class prices.

## Decisions

- The 2027 sheet is marked not yet in force and gives no start date or rule (by arrival or by registration). User decision 2026-11-24: until the school announces a start date, every student pays the 2026 prices (room `fee`, 120-dollar registration), whether arriving in 2026 or 2027. The page's room note and FAQ say so. Course prices are the same in both years. The 2027 room prices and the 150-dollar registration stay in the content document; setting `priceSwitchArrival` to the first Sunday arrival the school names makes stays from that date pay them and the room price list show them.
- The only dated rule in the pack is the 2027 peak surcharge, which goes by registration date: 60 dollars a week for students registered from 2026-11-02, 40 for those registered earlier. The quote charges 60 for every 2027 peak week, which is right for every new registration.
- Sida 10% on tuition and accommodation comes first; the 2026 low-season offer (300 dollars per 8 consecutive weeks in a campus triple or Azon single or twin, 2026-08-16 to 12-25, no guarantee courses) comes after it.
- Booster Speaking and PTE can only start from 2027-01-03 (`PHILINTER_NEW_COURSE_START`, separate from the price switch). IELTS Guarantee runs 8 or 12 weeks, the 16-week IELTS courses 16 weeks, Premium Speaking 8 weeks, Premium Junior Speaking 4 to 6 weeks, Booster Speaking 4 weeks, TOEIC Guarantee at least 12 weeks. Focus Industry cannot be booked directly.
- Junior courses only for under-18s, never in a single room; adults cannot take junior courses.
- Local fees follow the sheet exactly; textbooks are an estimate of 2,000 pesos per course type per started 4 weeks, because the sheet has none. Deposit and pickup stay outside the total.
- Summer and winter minimum stays (campus 8 weeks, Azon 4 weeks in summer; campus 6 weeks in winter) are shown as stay rules, not enforced by the quote.
- Prices come only from the content document; the database's older 4-week rows are not read.

## Checks

- `tsconfig.philinter.spec.json`: 13 focused tests (prices, offers, 2026 prices for 2027 arrivals and the optional 2027 switch, surcharge, fixed lengths, age rules, both local-fee sheets, long-term visa, upgrade of saved content).
- `school-quote-rules.spec.ts` and `unified-school-content-config.spec.ts` pass. In `school-textbook-integration.spec.ts` every school, Philinter included, fails only the PNG renderer test with an `ExchangeRateService` injection error that also happens on unchanged code.

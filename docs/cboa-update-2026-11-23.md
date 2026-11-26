# Cebu Blue Ocean Academy (蓝海CBOA) update (2026-11-23)

The school sent a Google Drive folder with Pines and Cebu Blue Ocean material. The user asked for the CBOA page to be updated and the Pines files to be ignored.

## Sources used

- 2027 price list: tuition and rooms, the new EBE course and the Ocean Suites Couple Room.
- 2027 promotion sheet: 2026 offers for registrations up to 2027/01/31 and 2027 offers for registrations 2027/02/01–06/30.
- 2027 local-fee sheet: management, textbooks, visa, deposit, pickup and laundry.
- Brochure: course lines (classes per day, 1:1 and 4:1), room descriptions and Ocean Suites facilities.
- Minor-student notice: from 2026/08/23 entry, students under 18 may only take the Junior family course.
- Ocean Suites photos and videos, plus campus life photos.

## Not published

- Agency-only rules: payment 5 days before entry, visit rules and commission (never public, user rule 2026-11-24).
- School contacts, website and address.
- The bank ATM shot in the Ocean Suites tour video, which was cut out.

## What changed

- The page moved onto the shared Philippine template in CIA's compact layout, with `layoutVersion: 2` quote and comparison images.
  - New files in `cebu-blue-ocean-school/`: `cboa-page-content.ts`, `cboa-page-profile.ts`, `cboa-page-quote.ts` and `cboa-school-page.component.ts`.
  - The old component and `blue-ocean-student-quote.ts` were removed.
- `cboa-content-config.ts` holds both price years: `tuition`/`fee` are the 2026 prices and `tuition2027`/`fee2027` the 2027 prices.
  - `CBOA_POLICY_VERSION` 1 replaces a saved document's catalogue, local fees, offers and peak dates once.
  - Media and edited image lines are kept.
- Tuition, rooms and offers follow the registration date. Local fees follow the entry date. Both switch on 2027/02/01.
- Peak: the school's own dates, 2027/06/27–08/21 at 60 dollars per unique study or accommodation week. These replace the CALA notice's 07/04–08/28. Family courses have no peak price, so a family course in the peak blocks the quote.
- Local fees:
  - ACR I-CARD is charged with the first visa extension.
  - Textbooks are now in the local-fee total as estimates for each course type.
  - Ocean Suites electricity and water is 1,000 pesos a week.
  - Deposit, EGI electricity and water (by meter), pickup, drop-off and laundry are reference rows outside the total.
- Seed (`SeedCebuBlueOceanPricingAsync`, insert-only):
  - Adds EBE and the Couple Room as 2027 rows.
  - Updates the price note and the peak fee notes.
  - Existing database rows are not changed.
- SEO: the school detail row now names 蓝海CBOA and uses the Ocean Suites pool photo.

## Follow-up (2026-11-24, user decisions)

- New rule for every school: nothing about agencies (commission, agency rules, rules that affect agencies) is published.
- Refunds: the page has a folded refund section.
  - School rule for students who leave after arrival: the first two weeks are not refunded and the rest is refunded at 70%.
  - The peak family camp's 300-dollar deposit per family is not refunded after the application is complete.
  - The 思达启航 deposit rule, in the same words as the other school pages: the 2,000-yuan deposit is never refunded; telling the adviser at least 4 weeks before entry allows a free date change or keeping the deposit for one year.
- Peak: only the latest notice's 2027/06/27–08/21 range at 60 dollars a week; the past 2026 range was removed.
- ACR I-CARD: charged with the first visa extension. A 30-day visa for 6 weeks pays it; a 59-day visa for 8 weeks does not.
- EGI dorm photos: the brochure's three embedded room photos are placed under the EGI price cards (`rooms/egi-01…03.webp`), for the school to check.
  - They are only 281, 144 and 134 px wide, so they look soft. Ask the school for the original files.
  - The brochure does not say which EGI room type they show, so all three EGI cards open the same photos.
- Exchange rates stay live (Frankfurter); no fixed rate.

## Official YouTube videos (2026-11-26)

User request: more videos that build trust, from the school's own YouTube channel (@cebublueoceanacademy). Facebook
was not checked (user decision 2026-11-26). Files are 720p H.264 in `public/assets/cebu-blue-ocean/videos/` with
`poster-<name>.jpg`; the hero album gains a 校园 chip and a 学员 chip.

| File | Source | Cuts |
| --- | --- | --- |
| `campus-tour-2025` | "Discover Cebu Blue Ocean Academy" (2025-02) | Removed the row of flags at the entrance (one was the Taiwan authorities' flag), the lobby wall with a test company's logo, the café counter with other brands' products and payment signs, and a notice board with QR codes. |
| `one-on-one-2024` | Short "One-on-One Classes" (2024-08), vertical | None. |
| `self-study-2024` | Short "Self-Study Time" (2024-08), vertical | None. |
| `student-interview-diving` | "Chinese Student Explains" (2025-12), English | None; the student gives only his first name. |
| `student-vlog` | "Student Vlog" (2025-11), Chinese narration | Removed the intro card, the smoking-area line, and the supermarket, fruit stand and restaurants outside the gate. About 3:21, longer than the 2:30 first estimated. |

The tour also shows the EGI single, twin and triple rooms, but in one clip, so it opens no room album.

Left out: clips with the Taiwan authorities' flag or Taiwan named as a country, clips with other companies' brands
(test centres, cafés, fast food, supermarkets), QR codes, students' full names, and trips that are not the school.

## Checks

```powershell
npx ng test --watch=false --browsers=ChromeHeadlessNoGpu --karma-config=karma.blue-ocean.conf.js --ts-config=tsconfig.blue-ocean.spec.json --include=src/app/pages/philippines/cebu-blue-ocean-school/cboa-school-page.spec.ts
```

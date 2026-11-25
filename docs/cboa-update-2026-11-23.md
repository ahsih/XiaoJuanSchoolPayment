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

## Checks

```powershell
npx ng test --watch=false --browsers=ChromeHeadlessNoGpu --karma-config=karma.blue-ocean.conf.js --ts-config=tsconfig.blue-ocean.spec.json --include=src/app/pages/philippines/cebu-blue-ocean-school/cboa-school-page.spec.ts
```

## Official YouTube videos (2026-11-25)

The user asked for more videos from the school's official YouTube and Facebook that build trust. Source: the school's own YouTube channel `@cebublueoceanacademy` (240 videos, 61 shorts). Facebook was not needed.

| File | Source video | Kept | Cut out |
| --- | --- | --- | --- |
| `campus-tour.mp4` | School tour (2025-02) | 0:00–0:05, 0:08–2:25 | flag shot (one flag is the Taiwan authorities'), end logo |
| `egi-rooms.mp4` | same tour | 1:56–2:02 | EGI twin and triple rooms only |
| `pickup-first-day.mp4` | How CBOA welcomes you (2025) | 0:24–0:29, 0:37–2:17 | road shots, airport shop signs, end logo |
| `textbooks-one-on-one.mp4` | Personalized English learning (2025) | 0:07–0:24, 0:26–0:39, 0:43–1:22 | intro logo, IELTS logo shot, PINES logo shot, end card |
| `teacher-method.mp4` | Filipino teacher's method (2025) | 0:13–1:42 | intro and title card, end card |
| `student-china.mp4` | Chinese student explains (2025) | 0:09–1:36 | intro and his self-introduction (name), end card |

Not used: the activity films (rows of small national flags that cannot be checked one by one), the family-course interview (names two children), the brand film (shows a fast-food statue and a supermarket sign), and the Ocean Suites film (the page already has the pack's Ocean Suites tour).

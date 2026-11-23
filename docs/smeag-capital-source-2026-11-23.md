# SMEAG Capital page update (2026-11-23)

The school sent a Google Drive folder with material for its Capital and Encanto campuses. The user asked to update
the SMEAG Capital page and to ignore the Encanto material, so nothing from the Encanto or Tarlac folders is used.

## What changed

- `/philippines-study/cebu/smeag-capital` now renders `SmeagCapitalSchoolPageComponent` on the shared Philippine
  school template in CIA's compact layout, with `layoutVersion: 2` quote and comparison images. The old
  `smeag-capital-school.component.*` files and their global `app-smeag-capital-school` styles were removed.
- `smeag-page-content.ts` holds all page text and data, `smeag-page-profile.ts` fills the template and
  `smeag-page-quote.ts` calculates each student. `smeag-content-config.ts` (`SMEAG_POLICY_VERSION` 1) holds prices,
  offers and local fees; `cloneSmeagContentConfig` upgrades saved documents once.
- Photos: `public/assets/smeag-capital/campus/` and `rooms/` (WebP, at most 1400 px). Videos:
  `public/assets/smeag-capital/videos/` (four dormitory clips, 720p H.264 with posters).

## Sources used

| File in the pack | Used for |
| --- | --- |
| 2025 Capital brochure | Floors and facilities, course lines, room descriptions |
| 2026-09-24 new-student orientation | Daily timetable, Sparta classes, attendance and warnings, meals, services, dorm rules, rental items, photos needed |
| 2026 price list | 17 courses and 9 rooms, 4-week prices, 45/65/85% short stays, 100-dollar registration |
| 2027 local-fee sheet | SSP, I-cards, visa extensions, utilities, water and electricity, textbooks, pickup, deposit |
| Partner-hotel rules and shuttle times | Hotel rules, shuttle timetable, no water/electricity charge |
| 2027 holiday poster | `smeag-holidays-2027.ts` (unchanged), shown as 停课 or 假日特别课 |
| Offer posters | 2026 second-half low season, 2026 Christmas, 2027 first-half low season |
| Under-15 notice | Minors need a guardian who also studies; 15+ may study alone without supervision |
| Additional-class poster | Extra day and evening classes in 其他收费 |

The live database prices (checked 2026-11-23) equal the 2026 price list; `applyPricingData` maps the database's
combined rows (TOEFL / IELTS, ESL / Speaking Master) onto the separate course ids.

## Decisions

- IELTS and TOEFL are separate rows (the database keeps one combined row at the same price). ESL 2 and Speaking
  Master are separate rows for the same reason. The TOEIC guarantee course is suspended.
- The official exam is promised for students who register 12 weeks or more (taken around week 10), so the page says
  报名12周以上, not 读满12周.
- 思达启航折扣 10% applies to tuition and campus rooms only; partner-hotel rooms are not discounted.
- The 25-dollar weekly offers count study weeks lying wholly inside the offer dates. The Christmas offer (100 dollars)
  needs at least 4 course weeks and any study week touching 2026/12/20–2027/01/02.
- Local fees per student: 30-day visa extensions 5,130 / 6,400 / 4,430 (then 4,430); VISA I-CARD 4,500 once the stay
  reaches 60 days; utilities 3,000 per started 4 accommodation weeks; water and electricity 2,400 per started 4
  campus weeks (none at the hotels); one textbook set per course type. Pickup (1,200) and the refundable deposit
  (2,000) are reference rows outside the total. Our totals equal the sheet's totals minus pickup and deposit, plus
  the textbook.
- There is no peak-season surcharge.
- The five-person room has no photos in the pack, so its price card has no photo button.
- The partner-hotel videos are not used: their opening shows a booking banner and the hotel address.
- Campus photos that show the flag of the Taiwan authorities are not used (photos 52, 53, 54 and 64 of the campus
  folder). A group-class photo that might show a one-to-one room was dropped because the label was not certain.
- The ETS TOEFL iBT sign in the billiards and table-tennis photos stays: it marks an official test centre, not another
  company.
- No address, phone, website, social account, QR code, nationality chart or commission text is published.

## Open questions for the school

- The 59-day visa extension sequence (6,400, then 4,430) is an estimate; the sheet lists only the 30-day sequence.
- The older hotel rule mentions a 2,000-peso maintenance fee; the 2027 sheet charges utilities of 3,000 per 4 weeks
  for everyone. The quote uses the 2027 sheet.
- Junior course schedules are not in the pack, so those rows say the schedule is confirmed at registration.

## Tests

`npx ng test --watch=false --browsers=ChromeHeadlessNoSandbox --ts-config=tsconfig.smeag.spec.json --include=src/app/pages/philippines/smeag-capital-school/smeag-capital-school-page.spec.ts --include=src/app/pages/philippines/smeag-holidays-2027.spec.ts --progress=false`

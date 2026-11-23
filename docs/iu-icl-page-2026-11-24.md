# IU and ICL pages on the template (2026-11-24)

The school sent its 2026 IU and ICL price lists, the joint 2026 low-season package poster and a Google Drive folder
(IU Facility, ICL Facility, Night classes, Social Media Video, Winter Camp 2027). The user asked to update both
campus pages without mixing their content.

## What changed

- `/philippines-study/cebu/iu-english-academy` (`IuSchoolComponent`) and `/philippines-study/cebu/icl`
  (`IclSchoolComponent`) now render the shared Philippine school template in CIA's compact layout, with
  `layoutVersion: 2` quote and comparison images. Each is its own school: own content document, prices, rooms,
  photos, videos and quote. `IuIclSchoolPageComponent` (`iu-school/iu-icl-school-page.ts`) holds what they share; a
  subclass only names its campus, like the CELLA pages.
- `iu-icl-page-content.ts` holds all page text and data per campus (`IU_ICL_PAGE_CONTENT.IU` / `.ICL`),
  `iu-icl-page-profile.ts` fills the template and `iu-icl-page-quote.ts` calculates each student. The content
  document stays `iu-icl-content-config.ts`; `IU_ICL_POLICY_VERSION` 2 rebuilds saved documents once, keeping each
  saved course and room price, switch and media and the package table, and replacing names, notes, local fees, offers
  and image copy (the old copy carried an agency payment rule).
- Removed: the old `iu-school.component.html`, `icl-school.component.html/.css`, `iu-icl-quote.ts`, its two specs,
  `iu-icl-quote-layout.css` and the promotion poster image. The employee quote-image preview now uses
  `iuIclPreviewQuoteImage`.
- Photos: `public/assets/iu/campus|rooms` and `public/assets/icl/campus|rooms` (WebP, at most 1400 px, never upscaled).
  Videos: `public/assets/iu/videos` (4) and `public/assets/icl/videos` (10), 720p H.264 with posters, about 50 MB each
  school. The hero album groups them as 校园／宿舍／课程／餐厅; ICL's room clips open the matching room photos.

## Rules in the quote

- 1/2/3 weeks cost 40/60/80% of four weeks; longer stays are proportional. Registration 100 dollars, returning
  students free. No peak surcharge.
- School low-season package (2026/09/01–2027/01/16): a package course and a campus room starting the same Sunday for
  the same weeks (at least 4), leaving by 2027/01/16. The package price replaces course and room, waives registration
  and is not discounted again. Guarantee courses only as whole 8 or 12 weeks. A split plan inside the window is blocked
  with a note to ask the adviser.
- 思达启航9折 on every course and room charge the package does not cover (off-campus rooms, other dates, other courses).
- Local fees (per person): SSP 7,800, E-Card 4,500, visa extensions 5,500 / 6,500 / 5,500 from week 5 (30-day entry)
  or 6,500 / 5,500 from week 9 (59-day entry), ACR I-Card 4,500 from week 9, textbooks about 2,000 per course type;
  pickup 800, deposit 3,000, maintenance 400, electricity 500 and laundry 300 per room week for students who stay at
  the school. Walk-in students pay no dormitory fees.

## Left out

- Winter Camp 2027: the folder holds passports, visas, tickets and emergency contacts of the group leaders, so it was
  not downloaded; the FAQ only says dates and prices change each year.
- Bank account details, agency terms, school contacts, address, teacher names and other companies' material.
- ICL off-campus single room has no photo (none was sure to show it).

## Tests

`npx ng test --watch=false --browsers=ChromeHeadlessNoSandbox --ts-config=tsconfig.iu-icl.spec.json --include=src/app/pages/philippines/iu-school/iu-icl-school-page.spec.ts --progress=false`
(13 tests). `school-quote-rules.spec.ts` passes; in `school-textbook-integration.spec.ts` every school's
"production PNG renderer" test fails with NG0203 on unchanged code too.

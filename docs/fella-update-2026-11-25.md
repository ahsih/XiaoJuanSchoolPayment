# English Fella pages on the Philippine template (2026-11-25)

English Fella's two Cebu campuses now have two separate pages on the shared Philippine school template in CIA's
compact layout, with `layoutVersion: 2` quote and comparison images, built like the JIC and CELLA campus pages. The
content follows the school's 2026 pack (Google Drive folder "English Fella_2026 School Information(TW)", received
2026-11-25): the 2026 Chinese brochure, the First Campus and Second Campus orientations, the agency orientation of
2026-10-02, the 2026 tuition and room sheet, the 2026 local-fee sheet, the 2026 Christmas offer and the 2027 holiday
poster.

- First Campus (Fella1, 斯巴达): `/philippines-study/cebu/english-fella-first-campus`
- Second Campus (Fella2, 自律型 Classic and 半斯巴达 J-Sparta): `/philippines-study/cebu/english-fella-second-campus`
- The former combined page `/philippines-study/cebu/english-fella` redirects to the First Campus page.

Each page shows and quotes only its own campus; a quote never mixes the campuses.

## Files

- `fella-school/fella-pricing.ts`: the 2026 catalogue (17 courses and 5 rooms, each tagged with its campus), short
  stays, the Christmas weeks, the guardian fee and the room-deposit tiers. Pure data.
- `fella-school/fella-content-config.ts`: the one content document (`FELLA`, school record
  `菲律宾宿务English Fella语言学校`) for both campuses; `fellaCampusContent` gives each page its campus part, and the
  quote-image copy stays per campus (`campusQuoteImageSettings`). `FELLA_POLICY_VERSION` 1 moves an older saved
  document once onto the Chinese course names and lines, the room campuses, the 30/60/90% short stays, the 2026
  local-fee sheet and the Christmas and 思达启航 terms; saved prices, switches, media and edited image lines are kept,
  and the ended July offer is switched off.
- `fella-school/fella-page-content.ts`: all page text and data per campus (pure, mini-program-ready).
- `fella-school/fella-page-profile.ts`, `fella-page-quote.ts` (`FellaPageStudent`, `FellaQuote`,
  `FellaPlanComparison`), `fella-school-page.ts`, `fella-first-campus-school.component.ts`,
  `fella-second-campus-school.component.ts`.
- Removed: `fella-school.component.*`, `fella-school-detail.component.*` and `fella-student-quote.ts` with its spec.
- Prices come only from the content document (`applyPricingData` is a no-op). `SeedFellaPricingAsync` stays the
  insert-only baseline and is not read by the pages.
- Media (user request 2026-11-25: the pack's photos looked old): photos and videos come from the school's official
  YouTube channel (@CEBUENGLISHFELLA). The 2026 campus tour was split into one 720p H.264 clip per campus
  (`public/assets/fella-1/videos/campus-tour-2026.mp4`, 2:42; `fella-2/videos/campus-tour-2026.mp4`, 2:20), and
  every campus and room photo (`fella-1|2/campus/`, `fella-1|2/rooms/`, WebP) is a frame of that campus's part of
  the tour, cropped above the subtitles and logo, each room from the shot the narration names. Interviews: TOEIC
  (3:13), IELTS (2:27) and a 3-month student (1:29) on the First Campus, the 40+ SSC student (2:06) on the Second.
  The IELTS student studied at the Second Campus before and now at the First, where the interview was filmed. Cuts:
  IELTS / British Council / IDP signs and other companies' signs blurred or mosaicked (moving mosaics in the IELTS
  interview), the IELTS test-centre shots and the closing "No.1" cards removed, and every "From Taiwan" name label
  covered with a gray mosaic. Small café logos on coffee cups are ordinary items and stay. Posters are
  `poster-<name>.jpg` beside each video. The hero album groups the videos as 校园 and 学员访谈; the tours show several
  rooms, so no clip opens a room album.

## Rules

- Courses: PIC-4/5/6, TOEIC+ESL, TOEIC, PIFT-E, PIFT, PIRC, PPT and PTFT at both campuses; PIGI 雅思保分班 and
  TOEIC 托业保分班 only at the First Campus, each one 12-week set; EBC, SSC (40+) and the family courses GEC
  (parents), P-JEC (5–6) and JEC (7–15) only at the Second Campus. Child courses need an under-18 student; GEC is
  for adults.
- Rooms: 1P and the 2A twin and 3A triple at both campuses; 1A and 1B only at the First Campus.
- 1/2/3 weeks are 30/60/90% of the four-week price; from four total course weeks every segment is proportional.
- Registration 100 dollars, waived for returning students.
- Christmas 2026: 100 dollars for each of the weeks 2026/12/21–12/27 and 12/28–2027/01/03 whose class days fall in
  a course week, at most 200.
- 思达启航 5%: from four course weeks, on tuition plus accommodation after the Christmas offer, not when the plan has a
  family course. Registration and the guardian fee are outside it.
- First Campus only: a student under 18 studying without a parent at the school pays the guardian fee (50 dollars
  for 1–2 weeks, 100 for 3–4 weeks, then 25 a course week), undiscounted.
- No peak surcharge.
- Local fees (2026 sheet): SSP 7,800; SSP E-CARD 4,100 (4,600 for a one-week stay); visa extensions from week 5 on a
  30-day visa (6,440 / 4,480 / 4,480 / 4,480 / 5,890) or from week 9 on a 59-day visa (6,440 / 4,480…); ACR I-CARD
  4,100 and ARP 500 with the first extension; management 1,000 for the first room week, then 500 a week; textbooks
  2,500 per course type (1,500 for GEC or a course of up to 2 weeks); student ID 200. A 30-day visa for 4 weeks is
  17,100 pesos, for 8 weeks 30,140 (the sheet's 34,240 less the deposit, padlock deposit and pickup). Long-term
  visas zero the visa rows with the adviser note.
- Outside the total: room deposit 1,000 / 2,000 / 3,000 / 4,000 pesos (1 week / 2 weeks / 3–11 weeks / 12+ weeks),
  padlock deposit 100, Cebu airport pickup 1,000 (700 for family-course students).
- 方案对比 leaves out the family courses.

## Not published

The school's address, phone, LINE and social accounts, website, Wi-Fi details, staff names, QR codes and every
agency term (commission, partner discount rules, pre-arrival cancellation penalties). The refund section uses the
思达启航 deposit rows and the school's post-entry rules only.

## Open

- The Second Campus tour shows no 1A or 1B room (those are First Campus only), so every listed room type has photos.
- 2027 prices have not been published; quotes use the 2026 prices.
- Corrections to the former page: 1A and 1B are First Campus rooms only, ARP is 500, short stays are 30/60/90%,
  the Christmas offer is capped at 200, the 思达启航 5% starts at four weeks and comes after Christmas, the guardian
  fee is First Campus only, textbooks are per course type, and a 4-week stay on a 30-day visa needs no extension
  (the former 27,940-peso 4-week total charged one).

## Tests

`npx ng test --watch=false --browsers=ChromeHeadlessNoSandbox --ts-config=tsconfig.fella.spec.json --include=src/app/pages/philippines/fella-school/fella-school-page.spec.ts --progress=false`

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
  Videos: `public/assets/iu/videos` (22) and `public/assets/icl/videos` (20), 720p H.264 with posters, about 180 MB
  for IU and 130 MB for ICL (since 2026-11-25). The hero album groups them as 校园／宿舍／课程／餐厅 (and 学员 since 2026-11-25); ICL's four landscape campus-room clips
  open the matching room photos.
- WeChat Channels clips (user zips 2026-11-24): 10 for IU (front desk, lounge and court, rooftop pool, AV room, gym,
  classrooms, group class, double, family triple, family quad) and 6 for ICL (campus and classes, first floor, gym,
  triple, quad, lawn barbecue), re-encoded to 720p H.264 with their burned-in captions kept. Left out: ICL's 3-minute official film
  (repeats the intro), its dance clip (opens on a "5000+ Success Stories" banner) and three IU repeats. IU's three room
  clips show carpeted rooms unlike IU's room photos, so they stay in the hero album and do not open a room album. ICL's
  off-campus clip shows both the double and the triple room, so it no longer opens either room album.
- Vertical videos (user request 2026-11-24): on IU they are shown whole, centred over a blurred copy of their own
  poster, instead of being cropped to fill the frame; on phones the hero frame for them is 4:3. This is the template's
  `tallVideoBackdrop` profile flag, tried on IU first and made the default for every template school the same day
  (ICL included); only CIA keeps cropping, because its page is locked (user answer: CIA 先不改).

## Official YouTube and Facebook clips (2026-11-25)

User request: add more of the schools' own videos that build trust. Sources are only the schools' official channels:
YouTube "IU ENGLISH ACADEMY" (it also posts ICL videos) and "ICL English Academy", plus the one video each Facebook
page shows without a login. Each clip was checked frame by frame, its burned-in captions read, and its opening and
end card looked at. A new 学员 chip in both hero albums holds the student stories.

- IU (8): the principal's two Chinese-narrated clips on the dormitory and the meals (cut before the opening reply to
  online complaints and before the end card with social accounts; the dormitory clip shows carpeted rooms, so it
  opens no room album), the salad bar, new-student orientation, teacher training, a Russian student's day at IU
  (the name card in the first seconds and a milk-carton brand cut, the portrait part cropped out of the
  landscape frame), and two Saudi
  students' stories (Facebook and YouTube; the second one's full-name card cut).
- ICL (4 new): a Chinese-narrated tour of the four room types (end card cut), a Vietnamese student's IELTS story (her
  full name card cut, the entry-test sheet that shows her full name blurred twice, her official report and the end
  card cut), the entry level test and the job-interview class. `icl-overview` is the "Step Inside ICL" film; it was
  re-cut without the two seconds of corridor that show a QR code.
- Left out: the principal's pre-departure series, camp and "Inside IU" videos (Taiwan passport, Taiwan named beside
  countries), the lunch review (a low rating and a Taiwan remark), the schedule-change apology, a fitness story and
  gym tour whose end cards carry a gym brand (IU already has a gym clip), the ICL year-in-review (many national flags,
  a restaurant sign), the coffee shop (a milk brand), a second IELTS story (one is enough) and short photo
  slideshows. Two videos were no longer available. Facebook needs a login to list more videos.

## Rules in the quote

- 1/2/3 weeks cost 40/60/80% of four weeks; longer stays are proportional. Registration 100 dollars, returning
  students free. No peak surcharge.
- School low-season package (2026/09/01–2027/01/16): a package course and a campus room starting the same Sunday for
  the same weeks (at least 4), leaving by 2027/01/16. The package price replaces course and room, waives registration
  and is not discounted again. Guarantee courses only as whole 8 or 12 weeks. A split plan inside the window is blocked
  with a note to ask the adviser.
- 思达启航9折 on every course and room charge the package does not cover (off-campus rooms, other dates, other courses).
- Local fees (per person): SSP 7,800, E-Card 4,500, visa extensions 5,500 / 6,500 / 5,500 from week 5 (30-day entry)
  or 6,500 / 5,500 from week 9 (59-day entry), ACR I-Card 4,500 with the first visa extension (user rule 2026-11-24), textbooks about 2,000 per course type;
  pickup 800, deposit 3,000, maintenance 400, electricity 500 and laundry 300 per room week for students who stay at
  the school. Walk-in students pay no dormitory fees.

## Left out

- Winter Camp 2027: the folder holds passports, visas, tickets and emergency contacts of the group leaders, so it was
  not downloaded; the FAQ only says dates and prices change each year.
- Bank account details, agency terms, school contacts, address, teacher names and other companies' material.
- ICL off-campus single room has no photo (none was sure to show it).

## Tests

`npx ng test --watch=false --browsers=ChromeHeadlessNoSandbox --ts-config=tsconfig.iu-icl.spec.json --include=src/app/pages/philippines/iu-school/iu-icl-school-page.spec.ts --progress=false`
(14 tests). `school-quote-rules.spec.ts` passes; in `school-textbook-integration.spec.ts` every school's
"production PNG renderer" test fails with NG0203 on unchanged code too.

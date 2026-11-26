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
  `public/assets/smeag-capital/videos/` (H.264 with posters): four dormitory clips from the pack, plus ten clips from
  SMEAG's 主校区 WeChat Channels (user folder, 2026-11-24): lobby, lounge, office, twin room, triple room, one-to-one,
  group class, classroom area, canteen and cafe. Its 单人间 and 四人间 clips repeat the pack's room clips and are not
  used. Clips filmed landscape inside a vertical frame are cropped to the 16:9 picture (1080×608), which also removes the
  added 宿务SMEAG captions; vertical clips are 720×1280. The hero album groups them as 校园／宿舍／课程／餐厅, and the twin
  room's photo album now opens with its video.
- YouTube (2026-11-25): five clips from SMEAG's own channels, @smeagedu (the Korean promo channel) and @smeagtv (the
  school's channel since 2026-08, whose descriptions name the Capital Campus), at 1280×720 or 720×1280:
  - `capital-promo-2025`: "2025 SMEAG CAPITAL 리뉴얼 홍보 비디오", kept 6.0–13.9 s and 20.2–141.2 s. Cut: the logo
    intro, QR-code posters with SMEAG Vietnam's Facebook name and a PTE poster, a flag row that includes the flag of
    the Taiwan authorities, a Cebu map with malls and hotels, IELTS/IDP award plaques, and the logo and website end card.
    It is the first clip in the album.
  - `orientation`: "New Student Orientation at SMEAG Global Education" (Capital Campus per its description), whole.
  - `summer-party`: "2025 SMEAG CAPITAL EVENT - Feel the Heat", kept 5.3–84.5 s (no logo intro or end card).
  - `lunch-buffet`: "SMEAG Student Life Reel: From Classroom to Dining" (Capital Campus), whole.
  - `student-interview`: "Japanese Student Shares What She Learned at SMEAG", whole; she speaks English with burned-in
    English captions. It opens a fifth album group, 访谈.
- Not used from YouTube: the 2019–2023 channels (before the renewal); the dormitory slideshow (the same room photos as
  the page); a Vietnamese-narrated dorm tour (repeats the room clips); the costume "first day" short; the 2026
  Teachers' Day dance; the staff dance short (an "IELTS 9.0 (7 students)" score banner); "3000+ students scored 6.0+"
  (a result claim); the Cambridge OET video (another organisation); the Tarlac, Encanto and junior-camp videos (other
  campuses); and the 2025 outdoor-activity video (trips outside the school). Minori's part 1 could not be downloaded.
- Facebook (SMEAGCEBU) shows nothing without a login and was not searched.

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
- Local fees per student: 30-day visa extensions 5,130 / 6,400 / 4,430 (then 4,430); VISA I-CARD 4,500 with the first visa
  extension (user rule 2026-11-24; the sheet lists it from 60 days); utilities 3,000 and water and electricity 2,400 per started 4
  campus weeks; partner-hotel weeks pay only a management fee of 2,000 per started 4 weeks (user confirmation
  2026-11-24, policy version 2, which adds the fee rule to saved documents); one textbook set per course type. Pickup (1,200) and the refundable deposit
  (2,000) are reference rows outside the total. Our totals equal the sheet's totals minus pickup and deposit, plus
  the textbook.
- There is no peak-season surcharge.
- The 2027 holiday table is on the page; the rest of the 2026 Capital holiday poster (11/27 and 12/30 holiday classes,
  12/24, 12/25 and 12/31 closed) is one line under it.
- The five-person room has no photos in the pack, so its price card has no photo button.
- The partner-hotel videos are not used: their opening shows a booking banner and the hotel address.
- Campus photos that show the flag of the Taiwan authorities are not used (photos 52, 53, 54 and 64 of the campus
  folder). A group-class photo that might show a one-to-one room was dropped because the label was not certain.
- The ETS TOEFL iBT sign in the billiards and table-tennis photos stays: it marks an official test centre, not another
  company.
- No address, phone, website, social account, QR code, nationality chart or commission text is published.

## Open questions for the school

- The 59-day visa extension sequence (6,400, then 4,430) is an estimate; the sheet lists only the 30-day sequence.
- Junior course schedules are not in the pack, so those rows say the schedule is confirmed at registration.

## Tests

`npx ng test --watch=false --browsers=ChromeHeadlessNoSandbox --ts-config=tsconfig.smeag.spec.json --include=src/app/pages/philippines/smeag-capital-school/smeag-capital-school-page.spec.ts --include=src/app/pages/philippines/smeag-holidays-2027.spec.ts --progress=false`

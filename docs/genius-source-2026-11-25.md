# Genius English Academy page update (2026-11-25)

The user supplied Genius's school pack (`G:\菲律宾游学\宿务\Genius\26-11-25.zip`, unpacked under
`G:\Claude下载\genius`). The route `/philippines-study/cebu/genius-english-academy` now renders
`GeniusSchoolPageComponent` on the shared Philippine template in CIA's compact layout, with `layoutVersion: 2` quote
and comparison images. The old `genius-school.component.*`, which used another agency's website photos, is gone.

## Sources used

- `Separated GENIUS ENGLISH PRICE LIST SEPTEMBER 2026 - 2027.pdf`: courses, rooms, exact 1/2/3-week prices,
  sea-view supplement, add-ons (semi-Sparta, Sparta, extra classes, unaccompanied minor), registration and local fees.
- `Family Program Genius English Price 2026 Oct 30 Updated.pdf`: family-program prices per person (child, parent
  studying, parent not studying), the lower price for two or more children, up to 12 weeks.
- `CHINESE Short BROCHURE Genius English Academy.pdf`: courses, management modes, facilities and opening hours,
  rooms (beds added or removed by occupancy), meals, daily timetable.
- `Genius - 学生守则2(1).pdf`: curfew and punch-card rules, attendance, room and check-out rules.
- Two September–December 2026 offer posters: 200 dollars per four regular-course weeks, and the 999-dollar
  promotion (GE／Power Speaking A + four-person room, 4 weeks, registered by 2026-11-30, with social-media duties).

## Files

- `genius-content-config.ts`: the content document (prices only from here; the database has only a regional
  starting-price row, so `applyPricingData` is a no-op).
- `genius-page-content.ts`: all page text and data.
- `genius-page-media.ts`: photos, videos and room profiles.
- `genius-page-profile.ts`, `genius-page-quote.ts`, `genius-school-page.component.ts`.
- Tests: `genius-school-page.spec.ts` (`tsconfig.genius.spec.json`).

## Quote rules

- 1–3 weeks use the school's exact short-stay prices; from 4 weeks every period is the 4-week price ÷ 4 × weeks,
  tiered by the student's own total course weeks. Sea-view rooms add 125 dollars per 4 weeks (counted by the week).
- Registration 125 dollars; returning students free.
- Add-ons per 4 course weeks: semi-Sparta 100, Sparta 125, one extra one-to-one 125, one extra group class 100,
  unaccompanied minor 100.
- Family program: per-person prices include the room and three meals; the room becomes the family room; one child
  2,100 dollars per 4 weeks, two or more children 1,900 each; at most 12 weeks, not mixed with other courses.
- September–December 2026 offer: 200 dollars per complete four regular-course weeks whose class Mondays fall in
  2026-09-01–12-31; not for the family program; not with the 999 promotion.
- 999 promotion: opt-in under 学生情况 while registration is open (to 2026-11-30); only GE／Power Speaking A with a
  four-person room (sea view 125 more), exactly 4 weeks studied in September–December 2026; registration and local
  fees extra. Other plans with it chosen are blocked.
- 思达启航9折 (user 2026-11-25; not in the pack): 10% off course and room fees, the family program and the sea-view
  supplement included, applied first; the September–December offer is then subtracted in full, and with the 999
  promotion the price is 999 × 0.9. Registration, management and extra-class add-ons and local fees are not discounted.
- Local fees: SSP 11,800 pesos; visa extensions from the price list's cumulative table (30-day visa from week 5,
  59-day visa from week 9); ACR I-Card 4,000 with the first extension (user rule 2026-11-24); materials 40 dollars
  (60 for B courses and family children) per started 4 course weeks; maintenance 10, laundry 6 and water 6 dollars per
  room week (shown in pesos at the quote's reference rates). Deposit 100 dollars, airport pickup 18 dollars and
  electricity (18 pesos per kWh) are reference rows outside the total. Long-term visas zero the visa rows with the
  adviser note.

## Media

84 WebP photos and 12 videos (720p H.264 with posters, about 59 MB) in `public/assets/genius/`. Room types were
decided by counting beds, desks and safes in each room folder; each room card names the room number its photos show.
Left out:

- Photos showing another business (a HOTEL sign reflection, the neighbouring EGI hotel sign), a "No.1 English Academy
  in Cebu" banner (an unprovable claim), a product shot and a lobby screen with a person.
- The last 2.4 seconds of the campus tour (school website) and of the dinner video (logo, then the website).
- The partner-school video, the Taiwan-version facilities video, the long promotional films, weekend-trip and safety
  seminar videos, and the CAMPS archives (17 zips, not unpacked).

## Not published

The school's address, website, email, Telegram group, staff names, the nationality chart and any agency terms.

## Open questions

- 2027 offers after December 2026 have not been published.
- The brochure lists a 豪华房 that has no price on the price list, so it is not offered.

## Update 2026-11-26

- Resent files (same names as the 2026-11-25 pack): brochure, price list, family list, 学生守则2, both offer posters. The family list was re-read: one child 740/1,265/1,790/2,100/2,625/3,150/3,675/4,200/6,300 dollars for 1–8 and 12 weeks; two or more children 670/1,145/1,620/1,900/2,375/2,850/3,325/3,800/5,700 each; parent studying 494/844/1,194/1,400/1,750/2,100/2,450/2,800/4,200; parent not studying 317/542/767/900/1,125/1,350/1,575/1,800/2,700. These match the config.
- User (WeChat, 2026-11-26): family program from age 6; regular courses from age 13; no peak-season surcharge.
- School holidays page (`studyenglishgenius.com/holidays/`, read 2026-11-26): Philippine regular holidays 2026 — Jan 1, Apr 2, Apr 3, Apr 9, May 1, Jun 12, Aug 31, Nov 30, Dec 25, Dec 30; 2027 — Jan 1, Mar 25, Mar 26, Apr 9, May 1 (Sat), Jun 12 (Sat), Aug 30, Nov 30, Dec 24, Dec 30. The page does not mention make-up classes; the student rules say no classes and no make-up on national and local holidays.
- School media Drive folder `4. Pictures and videos` (public link from the user): ACTIVITIES, CAMPS, CLASSES, COURSES, Facilities, Food, Room Pictures, School Campus pictures and videos, Student Reviews, TRENDY — the same library as the 2026-11-25 pack. `Student Reviews` holds six interview videos (Arabian, Japanese, Kamile Koc, two Taiwanese and a Turkish review, about 880 MB), not yet downloaded or used; the two Taiwanese ones need the rule-3 flag check.

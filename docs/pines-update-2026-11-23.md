# PINES page on the shared Philippine template (2026-11-23 school pack)

## Source material

The user supplied the PINES school pack on 2026-11-23. It contained:

- Morgan's notice.
- The school's Google Drive folder: the 2027 price list and promotions, the 2026-10 Chinese brochure, the before-registration guide and the payment/check-in guide, the IELTS mock and guarantee notes, the minor policy, and campus/room photos.
- The 2026 floor-by-floor campus video.
- Three PDFs: IELTS Q&A 2023, the Global Youth IELTS 中文介绍 and the Ground Portfolio.
- The pasted 2027 March/April holiday and make-up notice.
- The registration-date/arrival-date price rules.

The Cebu Blue Ocean material in the same message was handled in another session.

## What changed

- `/philippines-study/baguio/pines-international-academy` now renders `PinesSchoolPageComponent` on the shared Philippine template. It uses CIA's compact layout and `layoutVersion: 2` quote and comparison images, like EV, CPI, CPILS and CELLA.
- Removed old files:
  - `pines-school-detail.component.*`
  - the unused `pines-school.component.*`
  - `pines-student-quote.ts` and its spec
- New pure modules:
  - `pines-page-content.ts`: all page text and data, including floors, gallery, room albums, course notes, practical guides, the 2027 March/April holidays, make-up Saturdays and FAQ.
  - `pines-page-profile.ts`: fills the template.
  - `pines-page-quote.ts`: the student calculation for the single, group and comparison quotes.
- `pines-content-config.ts` holds both price lists. `PINES_POLICY_VERSION` 20271123 replaces an older saved catalogue, fees, promotions and table copy once. It keeps media and the edited company lines of the image.
- Shared template change: the 1周 short-stay row is hidden when a school has no `'1'` ratio. PINES has only 2 weeks (65%) and 3 weeks (85%). Every other template school defines a 1-week ratio, so CIA is unchanged.
- Shared template fix: a room price card without a booking code (all PINES rooms) links to its album only through `rateIds`. Before, an empty code matched every profile without a booking code, so every card opened 单人房A. CIA rooms all have codes, so CIA is unchanged.
- Shared specs: `school-quote-rules.spec.ts` and `school-textbook-integration.spec.ts` now build `PinesSchoolPageComponent`.
- `tsconfig.pines.spec.json` runs only `pines-school-page.spec.ts`.
- SEO description and image were updated. The route was already in `prerender-school-routes.txt`.

## Price rules

- **Which list applies.** Tuition, rooms and promotions follow the **registration date**: the 2026 list through 2027-01-31 and the 2027 list from 2027-02-01. Local fees follow the **arrival date**, with 2027 fees from 2027-02-01.
- **Registration through 2027-01-31:**
  - Sida registration waiver.
  - 150 dollars per four non-peak course weeks.
  - 100 dollars at 12 weeks.
  - 100 dollars at 16 weeks, plus 25 for every further two weeks.
- **Registration 2027-02-01 to 06-30, arriving from 2027-02-01:**
  - 25 dollars per non-peak course week, from four weeks.
  - 100 dollars at 12 weeks, plus 25 for every further week. Peak weeks count toward this length offer.
- **Sida 95% rate.** Taken off the full tuition and room price first; the school offers are subtracted after it (user rule 2026-11-24: the school files give no order, so the order cheaper for the student).
- **Peak surcharge.** 40 dollars per unique study/stay week for 2026/06/28–08/22, and 60 dollars for 2027/06/27–08/21. It is never discounted.
- **Guarantee courses** are fixed packages:
  - IELTS Guarantee runs 8 or 12 weeks.
  - TOEIC Guarantee runs 8 weeks and exists only on the 2027 list.
  - The course list shows one package price per `/8周` or `/12周`.
- **Junior and family courses** keep their price in the summer peak and pay the peak surcharge like everyone else (user answer 2026-11-24).
- **Under-18 students** may take only:
  - Global Youth IELTS: ages 13–17, in the youth 4BR room with 3 students and 1 Filipino teacher.
  - The junior family course: ages 7–15, with a parent on the Parents course.

- **Price list display until 2027-02-01:**
  - The course list shows the 2026 price, and each opened course shows its 2027 price.
  - Each room price group carries one line with the changed 2027 room prices (`pinesRoomGroupNotes`).
  - From 2027-02-01 only the 2027 prices are shown.

## 2027 local fees (arrival from 2027-02-01)

**Included in the total:**

| Item | Amount |
| --- | --- |
| SSP | 7,800 |
| SSP I-Card | 4,500 |
| ACR I-Card | 4,000 from week 9 |
| Electricity/water | 3,800 per four weeks |
| Maintenance | 500 per week |
| Visa extensions | 4,940 / 6,210 / 4,240… |
| Textbooks | 1,500 / 1,900 / 2,700 per started four course weeks, by book tier |
| Student ID | 200 |

**Reference rows, outside the total:**

- Pickup: 3,000.
- Points: 4,000 per four weeks.
- Room deposit: 100 dollars.
- Laundry.
- EB Pro.

## Media

- **Photos.** Campus and room photos are WebP files in `public/assets/pines/campus/` and `rooms/`, taken from the school's 2026 Drive folder.
  - Left out: photos with British Council or TOEIC logo signs, and the pre-merge campus folder.
  - The 4-bed and 6-bed photos cannot be told apart, so both prices open one shared album.
  - The youth room has no album.
- **Video.** `public/assets/pines/videos/campus-tour-2026.mp4` is the school's floor-by-floor tour, cut to 61 seconds. The cut removes:
  - the skit
  - a coffee-chain shot
  - the pass-rate quiz
  - a score report with a student's name
  - a test-centre logo
  - the sign-off
- **视频号 clips (2026-11-24).** 13 clips from the user's PINES 视频号 pack, 720×1280 or 960×540 H.264 with poster frames:
  - 校园视频: 到校第一天, 前台和办公区, 咖啡厅和餐厅, 健身房和乒乓球, 洗衣房, 雅思官方考场 (after the campus tour).
  - 宿舍视频: 单人房B和C, 双人房A, 四人间, 六人间. Each also opens its room album (`roomVideos`); the 4-bed and 6-bed rooms are now two albums sharing the same photos.
  - 课程视频: 一对一口语课, 选修小组课教室, 瑜伽晨课.
  - Cuts: the laundry clip stops at 10.5 s, before a room list with students' full names; the test-room clip stops at 7.9 s, before the IELTS banners; the first-day video blurs a British Council poster at the frame edge (29.3–34.9 s). The first-day and gym clips were letterboxed landscape footage and were cut out of the vertical frame.
  - Not used: the pack's 雅思校区 clips, which show the former IELTS campus building (including triple rooms that are no longer offered), and the long raw drone and interview files.
- **Not published:** pass rates, teacher statistics, the school's email and the commission notice.

## Removed from the page

- **Room availability feed.** The `/pines-room-availability` feed is no longer shown. Its school source has served only a 2026-09-02 cache split by the former Main and IELTS campuses. The server endpoint is unchanged.
- **Old export fallback.** The old page's desktop preview-before-download fallback and its Main/IELTS cross-campus check are gone. The template's shared save button is used instead.

## Open points to confirm with the school

- **Condo location.** The Condo rooms (Single A/B/C, Twin A, Family 3BR) carry the 校内 badge because the school's campus illustration draws the Condo on campus.
- **2027 regular offer start.** The offer was read as starting from four course weeks.
- **Visa extension table.** It was read as for a 30-day entry; a 59-day entry starts one step later. ACR is charged from week 9. The number of extensions follows the user rule of 2026-11-24: one per four weeks beyond the entry visa.
- **Textbook tiers.** These are estimates.
- **Hotel Deposit.** It was treated as the 100-dollar room deposit.
- **Youth room size.** The price list says 3 students + 1 teacher (used), but the Global Youth PDF says a 6-bed room with 4 + 1.
- **Official exam schedule.** The 2023 IELTS Q&A's official-exam schedule is marked 以考试中心当期安排为准.
- **Eid holiday.** The Eid date (2027-03-10) is provisional.

## Tests

```powershell
npx ng test --watch=false --browsers=ChromeHeadlessNoSandbox --ts-config=tsconfig.pines.spec.json --include=src/app/pages/philippines/pines-school/pines-school-page.spec.ts --progress=false
```

This spec has 12 tests. The cross-school `school-quote-rules.spec.ts` (138 tests) also passes with PINES on the template.

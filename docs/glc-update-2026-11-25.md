# GLC page update (2026-11-25)

The GLC page at `/philippines-study/cebu/global-language-cebu` moved onto the shared Philippine school template (CIA's compact layout, `layoutVersion: 2` quote and comparison images) and now follows GLC's 2026-11 school pack.

## Sources

The user's pack `G:\菲律宾游学\宿务\GLC\GLC宣传手册.zip`:

- `GLC 27年价格表.pdf`: 2027 weekly course and room prices, registration, short-term charge, guardian fee, pickup, local fees.
- `GLC 27年旺季公告.pdf`: 2027 winter and summer rules (adults 18+ and a few families, no offers, summer at least 4 weeks).
- `GLC 中文PPT.pdf`: Chinese brochure (courses, campus, facilities, services).
- `GLC-OT自律型.pdf` and `新生指南.pdf`: orientation, daily timetable, meals, services, first day.
- `校规 26年.pdf`: dormitory and school rules.
- `中国学生课程取消规定.pdf`: refund rules.
- `27年校历`, `27年活动一览`: 2027 holidays and activities.
- The photo zips (main building, Annex2, meals, dining, facilities, gym, pool, activities).

`GLC线上考试手册.pptx` (online placement test) was not used on the page.

## What changed

- Files: `glc-content-config.ts` (content document, `GLC_POLICY_VERSION` 1), `glc-page-content.ts`, `glc-page-profile.ts`, `glc-page-quote.ts`, `glc-school-page.component.ts`. The old component, `glc-pricing.ts`, `glc-quote.ts`, `glc-quote-plan.ts` and their specs were removed.
- Prices are 4-week amounts (weekly × 4), one list for 2026 and 2027. The database keeps the old weekly rows; the page ignores them.
- New optional template field `shortStayRows` (GLC: 1–3 weeks pay 60 dollars a week extra). CIA leaves it out and is unchanged.
- Employee editors: the GLC-only weekly fields were removed; GLC is edited as 4-week prices like every other school, and the quote-image preview uses Power Speaking with the main twin room.
- The Cebu directory card uses the school's own photo instead of an external link.

## Videos (added 2026-11-25)

The user asked for videos that build trust, from GLC's official YouTube and Facebook. All 14 clips come from the official YouTube channel "GLC (Global Language Cebu) Official" (2026 uploads on the current campus); Facebook needs a login and was not checked. They are 720p H.264 (CRF 26, AAC 128k, faststart) in `public/assets/glc/videos/` with `poster-<name>.jpg`, listed in `GLC_VIDEOS`:

- 校园: school promo, FPV drone flight through both buildings, Annex2 tour, one-minute campus short.
- 宿舍: room-types short (several types, hero album only), main single-room tour (also opens the 主楼单人间 album).
- 课程: classes short, Business English introduction, weekday and Saturday elective classes.
- 生活: a day in a student's life.
- 访谈: a young student from China, a Russian IELTS student and a Thai Sparta IELTS student (names not written on the page).

Cuts: the FPV drone flight keeps 0:00–2:20 and 3:33–4:38 (3:25 in all; the dormitory corridors, a long empty stretch and the slow ending are left out to keep the file small); the Annex2 tour starts at 1:59 in the Annex2 courtyard (the walk before it passes vans branded IDEA EDUCATION, another company); the young student's interview drops 1:17–1:26 (his answer about friends, whose subtitle lists classmates by nationality, including Taiwan). Not used: a Vietnamese student's interview (flag props, classmates listed by nationality), the kids' life clip (YouTube asks for sign-in), English-lesson clips (no trust value), and every agency or personal channel found in search.

### School Drive clips (added 2026-11-26)

The school shared its social-media video folder on Google Drive (`Video from Jonah - Only Updated`, monthly folders for 2023–2026, 294 files). Six clips were added, 720p H.264 at 30 fps (CRF 26, AAC 128k, faststart), uncut:

- 校园: `glc-campus-2026` (A Sneak Peek Inside GLC in 2026, 1:10, second in the album after the promo), `glc-face-id` (How to Enter and Exit GLC, 2:12: ID worn on campus, face scan at every gate, temporary card for new students).
- 生活: `glc-meals` (GLC Meals 2026, 0:57, buffet with allergen cards), `glc-october-highlights` (October 2026 highlights, 1:34), `glc-weekend-trips` (Outdoor & Weekend Activities, 2024, 0:40), `glc-kids-art` (Kid's Art Workshop, August 2026, 0:40).

Checked frame by frame: only GLC's own logo and signs; the yellow vans in the face-ID clip say only SCHOOL SERVICE; students' ordinary clothing brands remain; no flags. Not used: the POOL OPENING clip (the owner blocked downloads), duplicates of the YouTube clips (Ethan interview, a day in the life), a 2024 campus glimpse and buffet clip (replaced by the 2026 ones), the elective-class and kids' test clips (older or covered), corporate TOEIC training and awarding (other companies' staff), the screen-system, What's new (an office wall of national flags), fire-drill, swimming-lesson, volunteer basketball (a branded outside court) and English Wizard clips, restaurant promotions, nationality camps and nights, and posters.

## Left off the page

- The agency payment deadline, the commission and every agency rule.
- The school's pre-entry cancellation penalties (only the 思达启航 deposit rows and the post-entry rules are shown).
- The school's address details, contacts, website, social accounts, QR codes and forms.
- Absolute claims from the brochure.
- Photos that do not surely show what they are labelled as.

## Open questions

- Whether the 思达启航 50 dollars per four weeks also applies to weeks in the 2027 winter and summer. The school says no offers in those weeks, so the quote leaves them out for now.
- The server seed says the school was founded in 2011; the brochure says 2012. The seed is insert-only and not shown on the page.

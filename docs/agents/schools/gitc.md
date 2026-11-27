# School notes: gitc

## GITC campus pages on the template (2026-11-26)

User request 2026-11-26: update GITC's two campus pages from the school's Drive pack. User decisions the same day: two template pages (Iloilo kept, Cebu added), 2026 and 2027 prices by arrival date, local fees from the 2026-09-16 sheet, SMDC and Mega World 2027 prices shown as 待学校确认. Source record: `docs/gitc-source-2026-11-26.md` (with the open questions for the school).

- Routes: Iloilo `/philippines-study/iloilo/gitc-college-international-language-center` (`GitcIloiloSchoolComponent`), Cebu `/philippines-study/cebu/gitc-cebu-campus` (`GitcCebuSchoolComponent`). The old `gitc-school.component.*` page (with hot-linked photos from other agencies' sites) is gone.
- Like BECI: one database record (`菲律宾怡朗GITC College International Language Center`) and one content document `GITC` with `campus` on every course and room; `gitcCampusContent` gives each page its part. `gitc-school-page.ts` is the shared base, `gitc-page-profile.ts` builds each profile, `gitc-page-quote.ts` calculates (`GitcPageStudent`, `GitcQuote`, `GitcPlanComparison`), page text in `gitc-shared-content.ts` and `gitc-<campus>-page-content.ts`. Untagged uploads belong to the Iloilo page.
- Two price lists: `tuition`/`fee` = 2026, `tuition2027`/`fee2027` = courses starting from 2027-02-15 (arrival 2027-02-14). 0 = not offered in that period; `price2027Pending` = 待学校确认, never quoted. GITC is in `TWO_COURSE_PRICE_SCHOOL_CODES` and `CONTENT_ONLY_PRICE_SCHOOL_CODES`. Until 2027-02-14 the lists show 2026 prices, with 2027 inside each course and under each room group.
- `schoolCode` is cast (`GITC_SCHOOL_CODE`) because the schema union lives in the locked CIA folder; add 'GITC' there when the user next unlocks CIA.
- Rules: 1/2/3 weeks 40/75/90% (tuition and room); guarantee courses from 12 weeks; Iloilo twin (2) and family triple (3) need that many students of a group quote; no peak surcharge or offers; registration 100 (returning students free).
- Not yet done: the employee editor, photo and quote-image workbenches do not list GITC; no videos on the pages yet.
- Tests: `npx ng test --watch=false --browsers=ChromeHeadlessNoSandbox --ts-config=tsconfig.gitc.spec.json --include=src/app/pages/philippines/gitc-school/gitc-school-page.spec.ts --progress=false`.

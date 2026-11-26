// Builds /content/schools/burlington.json for the WeChat mini program from the same data the
// Burlington web page renders (burlington-page-content.ts). Sections are tagged with the standard
// template part (`kind`); the mini program decides order, titles and folding, so the page looks like
// every other school. Burlington has no `pricing` part: its prices are pounds per week from the
// compiled 2027 price list, shown here as tables, and the mini program has no UK quote calculator yet.
// Same publishing rules as the web page: no agent commission, no source citations, and never the
// school's phone, email, WhatsApp, social accounts, website or street address.
import { MiniBlock, MiniSection, SCHOOL_MINI_PAGE_SCHEMA_VERSION, SchoolMiniPage } from '../../../../mini-program/school-mini-page';
import {
  miniAsset as asset,
  miniHeading as heading,
  miniNote as note,
  miniText as text,
  serviceContactSection,
} from '../../../../mini-program/shared-sections';
import {
  BURLINGTON_ACCOMMODATION_NOTES as roomNotes,
  BURLINGTON_ADULT_COURSE_TYPES,
  BURLINGTON_ADULT_NOTES,
  BURLINGTON_ADULT_TIER_ROWS,
  BURLINGTON_ADULT_TIMETABLE,
  BURLINGTON_ADVISOR as advisor,
  BURLINGTON_AGE_STAY,
  BURLINGTON_APARTMENT_ROWS,
  BURLINGTON_BASIC_INFO,
  BURLINGTON_CASTLE as castle,
  BURLINGTON_CONSULTANTS,
  BURLINGTON_DINING,
  BURLINGTON_FAQ,
  BURLINGTON_FEE_ROWS,
  BURLINGTON_FIT,
  BURLINGTON_GALLERY,
  BURLINGTON_GALLERY_CATEGORIES,
  BURLINGTON_HIGHLIGHTS,
  BURLINGTON_HOMESTAY_ROWS,
  BURLINGTON_HOMESTAY_SUPPLEMENT_ROWS,
  BURLINGTON_HOMESTAY_TYPES,
  BURLINGTON_HOMESTAY_VETTING,
  BURLINGTON_JUNIOR_DAY,
  BURLINGTON_JUNIOR_DAY_NOTE,
  BURLINGTON_JUNIOR_INCLUDES,
  BURLINGTON_JUNIOR_NOTE,
  BURLINGTON_JUNIOR_PROJECT_NOTE,
  BURLINGTON_JUNIOR_PROJECTS,
  BURLINGTON_JUNIOR_SAFETY,
  BURLINGTON_JUNIOR_SEASON_ROWS,
  BURLINGTON_LABELS as labels,
  BURLINGTON_ONSITE_ROWS,
  BURLINGTON_PAGE_COPY as copy,
  BURLINGTON_PROGRAMME_CARDS,
  BURLINGTON_REFERENCE_NOTES as reference,
  BURLINGTON_SECTIONS as sections,
  BURLINGTON_SERVICE,
  BURLINGTON_SUMMER_RESIDENCE_EXTRAS,
  BURLINGTON_SUMMER_RESIDENCE_INCLUDES,
  BURLINGTON_VIDEOS,
  BURLINGTON_ZONES as zones,
} from './burlington-page-content';
import { BURLINGTON_SUMMER_RESIDENCE, burlingtonSummerResidenceRate } from './burlington-pricing';

export const BURLINGTON_MINI_PROGRAM_ID = 'burlington';
export const BURLINGTON_SITE_PATH = '/overseas-study-tour/uk/burlington-school';

const photo = (name: string) => BURLINGTON_GALLERY.find(image => image.src.endsWith(`/${name}.jpg`)) ?? BURLINGTON_GALLERY[0];
const timetable = (rows: Array<{ time: string; title: string; text: string }>): MiniBlock => ({
  type: 'table',
  columns: ['时间', '安排'],
  rows: rows.map(row => [row.time, `${row.title}：${row.text}`]),
});
/** Eyebrow naming the programme a section belongs to, like the web page's zone pill. */
const zoneEyebrow = (zone: 'adult' | 'junior', eyebrow: string) => `${zones[zone].label} · ${eyebrow}`;
/** Zone titles start with "成人项目：" for the web banner; under a zone eyebrow that would repeat. */
const withoutZone = (title: string) => title.replace(/^[^：]*：/, '');

function overviewSection(): MiniSection {
  return {
    kind: 'overview',
    eyebrow: sections.programmes.eyebrow,
    title: sections.programmes.title,
    intro: sections.programmes.intro,
    blocks: [
      {
        type: 'cards',
        layout: 'list',
        items: BURLINGTON_PROGRAMME_CARDS.map(card => ({
          badge: zones[card.zone].label,
          title: card.name,
          subtitle: card.dates,
          text: `${card.price}。${card.sub}`,
          points: card.points,
        })),
      },
      heading(sections.ageTable.title),
      // Adults first; compact label/value rows keep the overview short so the prices come sooner.
      { type: 'facts', items: [...BURLINGTON_AGE_STAY].reverse().map(row => ({ label: row.age, value: row.programme, note: row.stay })) },
      note(copy.trustNote),
    ],
  };
}

/**
 * 顾问点评 sits before the prices in the shared template, so it stays short like CIA's: the main
 * point and the two lists by title. The other advisor paragraphs repeat the rooms, canteen and
 * price sections, and the titles of the "需要考虑" list already carry their warnings.
 */
function fitSection(): MiniSection {
  // Adult items first, then the ones about younger students.
  const titles = (list: Array<{ title: string; junior?: boolean }>) =>
    [...list.filter(item => !item.junior), ...list.filter(item => item.junior)].map(item => item.title);
  return {
    kind: 'fit',
    eyebrow: advisor.eyebrow,
    title: advisor.heading,
    blocks: [
      text(advisor.paragraphs[0]),
      { type: 'list', title: labels.fitSuitable, style: 'check', items: titles(BURLINGTON_FIT.suitable) },
      { type: 'list', title: labels.fitLessSuitable, style: 'cross', items: titles(BURLINGTON_FIT.lessSuitable) },
    ],
  };
}

/**
 * 课程与价格 holds the adult courses only. The template orders parts as courses, rooms, fees,
 * packages, so the junior programme (an all-inclusive package) goes under packages after the adult
 * summer residence: the reader sees every adult part before any junior one, as on the web page.
 */
function adultCourseSection(): MiniSection {
  return {
    kind: 'courses',
    eyebrow: zoneEyebrow('adult', `${zones.adult.age} · ${sections.adult.eyebrow}`),
    title: withoutZone(zones.adult.title),
    intro: sections.adult.intro,
    blocks: [
      { type: 'list', style: 'check', items: zones.adult.facts },
      {
        type: 'cards',
        layout: 'list',
        items: BURLINGTON_ADULT_COURSE_TYPES.map(course => ({
          title: course.name,
          subtitle: course.english,
          facts: [
            { label: labels.courseFacts.hours, value: course.hours },
            { label: labels.courseFacts.time, value: course.time },
            { label: labels.courseFacts.price, value: course.price },
          ],
          text: course.note,
        })),
      },
      // Three columns fit a phone; the hours are on the course cards above, the example in the notes.
      {
        type: 'table',
        title: labels.tiers.title,
        columns: [labels.tiers.columns[0], '标准课程', '强化课程'],
        rows: BURLINGTON_ADULT_TIER_ROWS.map(row => [row.weeks, row.standard, row.intensive]),
      },
      ...BURLINGTON_ADULT_NOTES.map(item => note(item)),
      heading(labels.adultDay),
      timetable(BURLINGTON_ADULT_TIMETABLE),
      note(reference.adult),
    ],
  };
}

/**
 * 套餐价格: the adult summer residence, then the junior programme, then the other fees. The template
 * puts 优惠与学杂费 before 套餐价格, which would show transfers and bank charges before two of the
 * three programmes; under 套餐价格 the fees come after every programme's price instead.
 */
function packageSections(): MiniSection[] {
  const residence: MiniSection = {
    kind: 'packages',
    eyebrow: zoneEyebrow('adult', sections.residence.eyebrow),
    title: sections.residence.title,
    intro: sections.residence.intro,
    blocks: [
      // One row per length, so each total sits in its own cell instead of a crowded list.
      {
        type: 'table',
        title: labels.residencePrices.title,
        columns: labels.residencePrices.columns,
        rows: residenceWeekRows(),
      },
      heading(labels.residenceIncludes),
      { type: 'cards', layout: 'list', items: BURLINGTON_SUMMER_RESIDENCE_INCLUDES.map(group => ({ title: group.title, points: group.items })) },
      ...BURLINGTON_SUMMER_RESIDENCE_EXTRAS.map(item => note(item)),
      note(reference.residence),
    ],
  };
  const [, , weeksColumn, dayColumn, fullColumn, castleColumn] = labels.juniorSeasons.columns;
  const junior: MiniSection = {
    kind: 'packages',
    eyebrow: zoneEyebrow('junior', zones.junior.age),
    title: withoutZone(zones.junior.title),
    // The web banner opens by contrasting the two zones; the mini program shows the junior facts alone.
    intro: zones.junior.text.replace(/^这一部分[^：]*：/, ''),
    blocks: [
      { type: 'list', style: 'check', items: zones.junior.facts },
      heading(labels.juniorSeasons.title),
      {
        type: 'cards',
        layout: 'list',
        items: BURLINGTON_JUNIOR_SEASON_ROWS.map(row => ({
          title: row.name,
          subtitle: row.dates,
          facts: [
            { label: weeksColumn, value: row.weeks },
            { label: dayColumn, value: row.day },
            { label: fullColumn, value: row.full },
            { label: castleColumn, value: row.castle },
          ],
        })),
      },
      note(BURLINGTON_JUNIOR_NOTE),
      // One card per way of staying (the web page's columns), so nothing needs sideways scrolling.
      heading(labels.juniorIncludes.title),
      {
        type: 'cards',
        layout: 'list',
        items: BURLINGTON_JUNIOR_INCLUDES.headers.map((header, index) => ({
          title: header,
          facts: BURLINGTON_JUNIOR_INCLUDES.rows.map(row => ({ label: row.label, value: row.values[index] })),
        })),
      },
      heading(labels.juniorDay),
      timetable(BURLINGTON_JUNIOR_DAY),
      note(BURLINGTON_JUNIOR_DAY_NOTE),
      heading(labels.juniorProjects),
      text(BURLINGTON_JUNIOR_PROJECT_NOTE),
      { type: 'facts', items: BURLINGTON_JUNIOR_PROJECTS.map(item => ({ label: item.group, value: item.text })) },
      // Safety stays with the junior programme, as on the web page, not in the folded 学校规定 part.
      { type: 'list', title: labels.juniorSafety, style: 'check', items: BURLINGTON_JUNIOR_SAFETY },
      note(reference.junior),
    ],
  };
  const fees: MiniSection = {
    kind: 'packages',
    eyebrow: sections.fees.eyebrow,
    title: sections.fees.title,
    blocks: [{ type: 'cards', layout: 'list', items: BURLINGTON_FEE_ROWS.map(fee => ({ title: fee.item, subtitle: fee.amount, text: fee.note })) }],
  };
  return [residence, junior, fees];
}

/** Every bookable length of the summer residence with its weekly rate and total. */
function residenceWeekRows(): string[][] {
  const config = BURLINGTON_SUMMER_RESIDENCE;
  const maxWeeks = Math.round((Date.parse(config.end) - Date.parse(config.start)) / (7 * 86400000));
  const rows: string[][] = [];
  for (let weeks = config.minWeeks; weeks <= maxWeeks; weeks += 1) {
    const rate = burlingtonSummerResidenceRate(weeks);
    if (rate !== null) rows.push([`${weeks}周`, `${rate}英镑`, `${(rate * weeks).toLocaleString('en-US')}英镑`]);
  }
  return rows;
}

function roomsSection(): MiniSection {
  const priceTable = (rows: Array<{ name: string; price: string }>): MiniBlock => ({
    type: 'table',
    columns: ['房型', '每周价格'],
    rows: rows.map(row => [row.name, row.price]),
  });
  return {
    kind: 'rooms',
    eyebrow: zoneEyebrow('adult', sections.accommodation.eyebrow),
    title: sections.accommodation.title,
    intro: sections.accommodation.intro,
    blocks: [
      heading(labels.onsite),
      priceTable(BURLINGTON_ONSITE_ROWS),
      text(roomNotes.onsite),
      heading(labels.dining),
      { type: 'image', image: { src: asset(photo('dining-collage').src), caption: photo('dining-collage').description } },
      { type: 'list', style: 'check', items: BURLINGTON_DINING },
      heading(labels.apartment),
      priceTable(BURLINGTON_APARTMENT_ROWS),
      text(roomNotes.apartment),
      heading(labels.homestay),
      { type: 'cards', layout: 'list', items: BURLINGTON_HOMESTAY_TYPES.map(item => ({ title: item.name, text: item.text })) },
      text(roomNotes.homestay),
      // A card per homestay with its three meal options, instead of a four-column table.
      heading(labels.homestayPrices.title),
      {
        type: 'cards',
        layout: 'list',
        items: BURLINGTON_HOMESTAY_ROWS.map(row => ({
          title: row.name,
          facts: [
            { label: labels.homestayPrices.columns[1], value: row.self },
            { label: labels.homestayPrices.columns[2], value: row.bb },
            { label: labels.homestayPrices.columns[3], value: row.hb },
          ],
        })),
      },
      { type: 'facts', items: BURLINGTON_HOMESTAY_SUPPLEMENT_ROWS.map(row => ({ label: row.label, value: row.value })) },
      { type: 'list', title: labels.homestayVetting, style: 'check', items: BURLINGTON_HOMESTAY_VETTING },
      note(reference.accommodation),
    ],
  };
}

function featureSections(): MiniSection[] {
  return [
    {
      kind: 'features',
      eyebrow: sections.highlights.eyebrow,
      title: sections.highlights.title,
      blocks: [{ type: 'cards', layout: 'list', items: BURLINGTON_HIGHLIGHTS.map(item => ({ title: item.title, text: item.text })) }],
    },
    {
      kind: 'features',
      eyebrow: sections.castle.eyebrow,
      title: sections.castle.title,
      intro: castle.intro,
      blocks: [
        { type: 'image', image: { src: asset(photo('castle-exterior').src), caption: photo('castle-exterior').description } },
        { type: 'cards', layout: 'list', items: castle.options.map(option => ({ title: option.who, subtitle: option.price, text: option.text })) },
        note(castle.note),
      ],
    },
  ];
}

function campusSection(): MiniSection {
  // The canteen collage repeats photos already in its album, so albums skip cover-only images.
  const albums = BURLINGTON_GALLERY_CATEGORIES
    .filter(category => category !== '全部')
    .map(category => ({
      title: category,
      images: BURLINGTON_GALLERY
        .filter(image => image.category === category && !image.coverOnly)
        .map(image => ({ src: asset(image.src), title: image.title, caption: image.description })),
    }))
    .filter(album => album.images.length > 0);
  return {
    kind: 'campus',
    intro: sections.gallery.intro,
    blocks: [
      { type: 'albums', albums },
      heading(sections.about.title, sections.about.eyebrow),
      { type: 'facts', items: BURLINGTON_BASIC_INFO },
      note(reference.about),
    ],
  };
}

export function buildBurlingtonMiniProgramPage(): SchoolMiniPage {
  // Adult rooms in the hero: the multi-bed dorm photo is captioned as the junior residence.
  const heroImages = ['campus-courtyard', 'residence-single', 'dining-collage', 'castle-exterior']
    .map(name => photo(name))
    .map(image => ({ src: asset(image.src), title: image.title, caption: image.description }));

  const sectionList: MiniSection[] = [
    overviewSection(),
    fitSection(),
    adultCourseSection(),
    roomsSection(),
    ...packageSections(),
    ...featureSections(),
    campusSection(),
    {
      kind: 'videos',
      intro: sections.videos.intro,
      blocks: [{
        type: 'videos',
        items: BURLINGTON_VIDEOS.map(video => ({
          title: video.title,
          src: asset(video.src),
          poster: asset(video.poster),
          text: `${video.tag.label} · ${video.duration}｜${video.description}`,
        })),
      }],
    },
    {
      kind: 'faq',
      blocks: [{ type: 'details', items: BURLINGTON_FAQ.map(item => ({ title: item.title, blocks: [text(item.text)] })) }],
    },
    serviceContactSection(
      { ...sections.service, steps: BURLINGTON_SERVICE },
      { title: advisor.contactTitle, text: advisor.contactText },
      BURLINGTON_CONSULTANTS,
    ),
  ];

  return {
    schemaVersion: SCHOOL_MINI_PAGE_SCHEMA_VERSION,
    id: BURLINGTON_MINI_PROGRAM_ID,
    sitePath: BURLINGTON_SITE_PATH,
    navigationTitle: 'Burlington School',
    hero: {
      breadcrumb: copy.breadcrumb,
      title: copy.title,
      lead: copy.lead,
      tags: copy.tags.map(tag => tag.text),
      images: heroImages,
    },
    sections: sectionList,
  };
}

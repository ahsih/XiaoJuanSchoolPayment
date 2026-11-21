// Builds /content/schools/burlington.json for the WeChat mini program from the same data the Burlington
// page renders (burlington-page-content.ts, prices from burlington-pricing.ts). The mini program has no UK
// calculator yet, so the page carries no `pricing`: prices are shown as the website's tables, and quotes go
// through a consultant. Like the website: no agent commission and no school contact details.
import type { MiniBlock, MiniImage, MiniSection, SchoolMiniPage } from '../../../../mini-program/school-mini-page';
import { SCHOOL_MINI_PAGE_SCHEMA_VERSION } from '../../../../mini-program/school-mini-page';
import { miniAsset as asset, miniHeading as heading, miniNote as note, miniText as text } from '../../../../mini-program/shared-sections';
import { SIDA_CALLABLE_CONSULTANTS } from '../../../../components/sida-consultants';
import { BURLINGTON_ADULT_COURSES, BURLINGTON_COURSE_FOCUS } from './burlington-pricing';
import {
  BURLINGTON_ACCOMMODATION_NOTES,
  BURLINGTON_ADULT_EXTRAS,
  BURLINGTON_ADULT_TIER_ROWS,
  BURLINGTON_ADULT_TIMETABLE,
  BURLINGTON_ADVISOR,
  BURLINGTON_APARTMENT_ROWS,
  BURLINGTON_BASIC_INFO,
  BURLINGTON_CALENDAR,
  BURLINGTON_CASTLE,
  BURLINGTON_FAQ,
  BURLINGTON_FEE_ROWS,
  BURLINGTON_FIT,
  BURLINGTON_GALLERY,
  BURLINGTON_GALLERY_CATEGORIES,
  BURLINGTON_HIGHLIGHTS,
  BURLINGTON_HOMESTAY_ROWS,
  BURLINGTON_HOMESTAY_SUPPLEMENT_ROWS,
  BURLINGTON_HOMESTAY_VETTING,
  BURLINGTON_JUNIOR_DAY,
  BURLINGTON_JUNIOR_DAY_NOTE,
  BURLINGTON_JUNIOR_INCLUDES,
  BURLINGTON_JUNIOR_PROJECTS,
  BURLINGTON_JUNIOR_SAFETY,
  BURLINGTON_JUNIOR_SEASON_ROWS,
  BURLINGTON_ONSITE_ROWS,
  BURLINGTON_PAGE_COPY as copy,
  BURLINGTON_PROGRAMME_CARDS,
  BURLINGTON_QUICK_INFO,
  BURLINGTON_REFERENCE_NOTE,
  BURLINGTON_SERVICE,
  BURLINGTON_SUMMER_RESIDENCE_INCLUDES,
  BURLINGTON_SUMMER_RESIDENCE_ROOM_ONLY,
  BURLINGTON_VIDEOS,
  type BurlingtonGalleryCategory,
} from './burlington-page-content';

/** The page's consultant for UK schools (BurlingtonSchoolComponent.consultant). */
const CONSULTANT = SIDA_CALLABLE_CONSULTANTS.find(item => item.name === BURLINGTON_ADVISOR.name) ?? SIDA_CALLABLE_CONSULTANTS[0];

const photo = (name: string): MiniImage => {
  const image = BURLINGTON_GALLERY.find(item => item.src.endsWith(`/${name}.jpg`));
  if (!image) throw new Error(`Burlington gallery has no photo ${name}`);
  return { src: asset(image.src), title: image.title, caption: image.description };
};

const album = (category: BurlingtonGalleryCategory): MiniImage[] =>
  BURLINGTON_GALLERY.filter(image => image.category === category).map(image => ({ src: asset(image.src), title: image.title, caption: image.description }));

const timeline =(rows: ReadonlyArray<{ time: string; title: string; text: string }>): MiniBlock => ({
  type: 'table',
  columns: ['时间', '安排'],
  rows: rows.map(row => [row.time, `${row.title}：${row.text}`]),
});

/** 项目和价格: the four programmes, adult tuition tiers and the adult day. */
function coursesSection(): MiniSection {
  const standard = BURLINGTON_ADULT_COURSES[0];
  const intensive = BURLINGTON_ADULT_COURSES[1];
  return {
    kind: 'courses',
    title: '四类项目，先按年龄和时间选',
    blocks: [
      {
        type: 'cards',
        layout: 'list',
        items: BURLINGTON_PROGRAMME_CARDS.map(card => ({
          badge: card.type,
          title: card.name,
          subtitle: card.dates,
          facts: [
            { label: '周数', value: card.weeks },
            { label: '价格', value: card.price, note: card.sub },
          ],
          points: card.points,
        })),
      },
      heading('成人英语课程：报得越久每周越便宜', '16岁以上'),
      {
        type: 'table',
        columns: ['周数', standard.name, intensive.name, '举例'],
        rows: BURLINGTON_ADULT_TIER_ROWS.map(row => [row.weeks, row.standard, row.intensive, row.example]),
      },
      { type: 'list', title: '课程方向', style: 'dot', items: BURLINGTON_COURSE_FOCUS.map(focus => `${focus.name}：${focus.level}`) },
      {
        type: 'details',
        items: [
          { title: '成人的一天', blocks: [timeline(BURLINGTON_ADULT_TIMETABLE), note(BURLINGTON_REFERENCE_NOTE)] },
          { title: '一对一和其他课程', blocks: [{ type: 'facts', items: BURLINGTON_ADULT_EXTRAS.map(item => ({ label: item.label, value: item.value, note: item.note })) }] },
        ],
      },
      note(copy.trustNote),
    ],
  };
}

/** 套餐价格: junior all-inclusive packages and the adult summer apartment package. */
function packagesSection(): MiniSection {
  return {
    kind: 'packages',
    blocks: [
      heading('青少年项目：课程、三餐和出游打包', '11–17岁'),
      {
        type: 'table',
        title: '各季日期和每周价格',
        columns: ['项目', '日期', '周数', '只上课', '宿舍或寄宿家庭全包', '巴斯城堡两晚'],
        rows: BURLINGTON_JUNIOR_SEASON_ROWS.map(row => [row.name, row.dates, row.weeks, row.day, row.full, row.castle]),
      },
      {
        type: 'table',
        title: '套餐包含什么',
        columns: ['', ...BURLINGTON_JUNIOR_INCLUDES.headers],
        rows: BURLINGTON_JUNIOR_INCLUDES.rows.map(row => [row.label, ...row.values]),
      },
      {
        type: 'details',
        items: [
          { title: '青少年的一天', blocks: [timeline(BURLINGTON_JUNIOR_DAY), note(BURLINGTON_JUNIOR_DAY_NOTE)] },
          { title: '项目课主题', blocks: [{ type: 'facts', items: BURLINGTON_JUNIOR_PROJECTS.map(item => ({ label: item.group, value: item.text })) }] },
          { title: '外出和安全规定', blocks: [{ type: 'list', style: 'dot', items: [...BURLINGTON_JUNIOR_SAFETY] }, note(BURLINGTON_REFERENCE_NOTE)] },
        ],
      },
      heading('成人暑期公寓套餐：课程＋公寓单人间', '16岁以上'),
      { type: 'cards', layout: 'list', items: BURLINGTON_SUMMER_RESIDENCE_INCLUDES.map(group => ({ title: group.title, points: group.items })) },
      note(BURLINGTON_SUMMER_RESIDENCE_ROOM_ONLY),
    ],
  };
}

/** 住宿: on-site residence, apartments and homestays with their weekly prices. */
function roomsSection(): MiniSection {
  return {
    kind: 'rooms',
    title: '校内宿舍、公寓和寄宿家庭',
    intro: '以下为成人课程的住宿价格；青少年项目的住宿已含在全包套餐里。',
    blocks: [
      heading('校内宿舍'),
      text(BURLINGTON_ACCOMMODATION_NOTES.onsite),
      { type: 'table', columns: ['房型', '每周价格'], rows: BURLINGTON_ONSITE_ROWS.map(row => [row.name, row.price]) },
      { type: 'albums', albums: [{ title: '校内宿舍相册', images: album('宿舍') }] },
      heading('Wandsworth 公寓'),
      text(BURLINGTON_ACCOMMODATION_NOTES.apartment),
      { type: 'table', columns: ['房型', '每周价格'], rows: BURLINGTON_APARTMENT_ROWS.map(row => [row.name, row.price]) },
      heading('寄宿家庭'),
      text(BURLINGTON_ACCOMMODATION_NOTES.homestay),
      {
        type: 'table',
        columns: ['房型', '不含餐', '含早餐', '含早晚餐'],
        rows: BURLINGTON_HOMESTAY_ROWS.map(row => [row.name, row.self, row.bb, row.hb]),
      },
      { type: 'facts', items: BURLINGTON_HOMESTAY_SUPPLEMENT_ROWS.map(row => ({ label: row.label, value: row.value })) },
      { type: 'list', title: '精选寄宿家庭怎么审核', style: 'check', items: [...BURLINGTON_HOMESTAY_VETTING] },
      note(BURLINGTON_REFERENCE_NOTE),
    ],
  };
}

/** 学校特色: the school's own Bath castle. */
function castleSection(): MiniSection {
  return {
    kind: 'features',
    title: '在城堡住两晚，游览巴斯和英格兰乡村',
    blocks: [
      text(BURLINGTON_CASTLE.intro),
      { type: 'cards', layout: 'list', items: BURLINGTON_CASTLE.options.map(option => ({ badge: option.price, title: option.who, text: option.text })) },
      { type: 'albums', albums: [{ title: '巴斯城堡相册', images: album('城堡') }] },
      note(BURLINGTON_CASTLE.note),
    ],
  };
}

function campusSection(): MiniSection {
  const albums = BURLINGTON_GALLERY_CATEGORIES
    .filter(category => category !== '全部' && category !== '宿舍' && category !== '城堡')
    .map(category => ({ title: `${category}相册`, images: album(category) }))
    .filter(album => album.images.length > 0);
  return {
    kind: 'campus',
    title: 'Burlington School 基本资料',
    blocks: [
      { type: 'facts', items: BURLINGTON_BASIC_INFO.map(row => ({ label: row.label, value: row.value })) },
      { type: 'albums', albums },
    ],
  };
}

/** The closing part as on the website: what Sida does, then the page's UK consultant. */
function contactSection(): MiniSection {
  return {
    kind: 'contact',
    blocks: [
      heading('报名 Burlington，思达启航可以帮你做什么', '思达启航'),
      { type: 'cards', layout: 'grid', items: BURLINGTON_SERVICE.map(item => ({ title: item.title, text: item.text })) },
      heading('把学生年龄、出发时间、周数和住宿想法告诉思达启航，我们帮你确认学位和费用', '获取 Burlington 正式报价'),
      text('顾问会跟学校确认空位、房型和当期价格，并提醒签证、机票、保险和接机安排。'),
      { type: 'list', style: 'check', items: ['按2027年价格报价', '必付和可选费用分开列', '可以并排比较住宿方案', '出发前逐项提醒'] },
      {
        type: 'consultants',
        items: [{
          name: CONSULTANT.name,
          title: CONSULTANT.title,
          text: CONSULTANT.description,
          phone: CONSULTANT.phone,
          avatar: asset(CONSULTANT.avatarSrc),
          qr: asset(CONSULTANT.qrSrc),
        }],
      },
    ],
  };
}

export function buildBurlingtonMiniProgramPage(): SchoolMiniPage {
  const sections: MiniSection[] = [
    {
      kind: 'overview',
      blocks: [
        { type: 'facts', items: BURLINGTON_QUICK_INFO.map(item => ({ label: item.label, value: item.value, note: item.note })) },
        { type: 'cards', layout: 'list', items: BURLINGTON_HIGHLIGHTS.map(item => ({ title: item.title, text: item.text })) },
      ],
    },
    {
      kind: 'fit',
      blocks: [
        heading(BURLINGTON_ADVISOR.heading),
        text(BURLINGTON_ADVISOR.text),
        { type: 'list', title: '适合', style: 'check', items: BURLINGTON_FIT.suitable.map(item => `${item.title}：${item.text}`) },
        { type: 'list', title: '需要考虑', style: 'cross', items: BURLINGTON_FIT.lessSuitable.map(item => `${item.title}：${item.text}`) },
        { type: 'text', text: BURLINGTON_ADVISOR.advice, style: 'quote' },
      ],
    },
    coursesSection(),
    packagesSection(),
    roomsSection(),
    {
      kind: 'fees',
      title: '注册、教材、接送机和交通',
      blocks: [{ type: 'table', columns: ['项目', '金额', '说明'], rows: BURLINGTON_FEE_ROWS.map(row => [row.item, row.amount, row.note]) }],
    },
    castleSection(),
    campusSection(),
    {
      kind: 'videos',
      // Landscape videos only, like the other schools; the vertical clips stay on the website.
      blocks: [{
        type: 'videos',
        items: BURLINGTON_VIDEOS.filter(video => !video.vertical).map(video => ({
          title: video.title,
          src: asset(video.src),
          poster: asset(video.poster),
          text: video.description,
          points: [`时长 ${video.duration}`],
        })),
      }],
    },
    {
      kind: 'calendar',
      title: '开课日期和假期',
      blocks: [{
        type: 'dates',
        groups: [{ title: '2027年', dates: BURLINGTON_CALENDAR.map(item => ({ day: item.date, text: item.title, note: item.note })) }],
      }],
    },
    {
      kind: 'faq',
      blocks: [{ type: 'details', items: BURLINGTON_FAQ.map(item => ({ title: item.title, blocks: [text(item.text)] })) }],
    },
    contactSection(),
  ];

  return {
    schemaVersion: SCHOOL_MINI_PAGE_SCHEMA_VERSION,
    id: 'burlington',
    sitePath: '/overseas-study-tour/uk/burlington-school',
    navigationTitle: 'Burlington School',
    hero: {
      breadcrumb: copy.breadcrumb,
      title: copy.title,
      lead: copy.lead,
      tags: copy.tags.map(tag => tag.text),
      images: ['campus-courtyard', 'residence-dorm-hero', 'dining-coffee-bar', 'castle-exterior'].map(photo),
    },
    sections,
  };
}

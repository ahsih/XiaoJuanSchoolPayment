// B'Cebu content for the shared Philippine school page (school-page/ph-school-page.component.*).
// Text and data come from bcebu-page-content.ts and bcebu-page-media.ts; prices and rules from
// bcebu-content-config.ts. Keep it pure data (no Angular, DOM or storage), like the modules it reads.
import { createCiaQuotePricing } from '../cia-school/cia-quote-engine';
import {
  CIA_CTA_CONSULTANTS,
  CIA_GALLERY_CATEGORIES,
  CIA_PAGE_COPY,
  CIA_SIDA_REASONS,
  CIA_SIDA_TRUST_BADGES,
  type RoomRateGroup,
} from '../cia-school/cia-page-content';
import type { PhPageCopy, PhSchoolProfile } from '../school-page/ph-school-profile';
import { cloneBCebuContentConfig, createDefaultBCebuContentConfig } from './bcebu-content-config';
import {
  BCEBU_BASIC_INFO,
  BCEBU_CAMPUS_BUILDINGS,
  BCEBU_COURSE_DETAIL_GUIDES,
  BCEBU_DORM_RULES,
  BCEBU_FAQS,
  BCEBU_FINAL_CTA_BADGES,
  BCEBU_HOLIDAY_CALENDARS,
  BCEBU_HOLIDAY_FOOTNOTE,
  BCEBU_LICENSE,
  BCEBU_NOT_SUITABLE_FOR,
  BCEBU_OVERVIEW_FACTS,
  BCEBU_PAGE_TEXT,
  BCEBU_PRACTICAL_GUIDES,
  BCEBU_QUICK_INFO,
  BCEBU_REFERENCE_NOTE,
  BCEBU_SCHEDULE,
  BCEBU_SUITABLE_FOR,
} from './bcebu-page-content';
import {
  BCEBU_ALBUM_DESCRIPTIONS,
  BCEBU_CAMPUS_LIFE_VIDEOS,
  BCEBU_GALLERY_IMAGES,
  BCEBU_ROOM_PROFILES,
  BCEBU_ROOM_VIDEOS,
  BCEBU_VIDEO_CARDS,
  BCEBU_VIDEO_TABS,
} from './bcebu-page-media';
import {
  BCEBU_IELTS_GUARANTEE_ID,
  BCEBU_JUNIOR_COURSE_ID,
  BCEBU_KIDS_COURSE_ID,
  BCEBU_LITE_40_COURSE_ID,
} from './bcebu-pricing';

const defaults = createDefaultBCebuContentConfig();
const AFTERNOON_START = BCEBU_SCHEDULE.findIndex(row => row.time.startsWith('13:30'));
const initialPricing = createCiaQuotePricing(defaults);
const brandBCebu = (text: string) => text.replace(/CIA/g, "B'Cebu");

const BCEBU_COPY: PhPageCopy = {
  swipeHint: CIA_PAGE_COPY.swipeHint,
  referenceNote: BCEBU_REFERENCE_NOTE,
  hero: {
    breadcrumb: "菲律宾游学 / 宿务学校 / B'Cebu",
    title: "菲律宾宿务 B'Cebu 语言学校",
    lead: BCEBU_PAGE_TEXT.heroLead,
    // “获取 B'Cebu 最新报价” is cut off on a 375px phone.
    quoteLabel: "获取 B'Cebu 报价",
    tags: [
      { icon: 'location_on', text: '宿务麦克坦岛' },
      { icon: 'verified', text: '半斯巴达（可选斯巴达）' },
      { icon: 'pool', text: '泳池和健身房' },
      { icon: 'family_restroom', text: '亲子与幼儿课程' },
    ],
  },
  overview: { title: "30 秒看懂 B'Cebu" },
  advisorReview: {
    title: "顾问怎么看 B'Cebu",
    text: BCEBU_PAGE_TEXT.advisorText,
    suitableTitle: '适合谁',
    notSuitableTitle: '报名前想清楚',
  },
  license: BCEBU_LICENSE,
  campus: {
    eyebrow: 'CAMPUS AT A GLANCE',
    title: "B'Cebu 校园介绍",
    intro: BCEBU_PAGE_TEXT.campusIntro,
  },
  gallery: {
    title: "按区域查看 B'Cebu 环境",
    intro: '按区域查看校园、教室、住宿、餐厅和设施；相册内用左右箭头或缩略图切换，点击主图可放大。',
    photoNote: CIA_PAGE_COPY.gallery.photoNote,
    roomComparisonTitle: '房型对比',
    roomDisclaimer: BCEBU_REFERENCE_NOTE,
  },
  courses: {
    title: "B'Cebu 课程怎么选？",
    intro: BCEBU_PAGE_TEXT.coursesIntro,
    priceUnit: '/4周',
    fitLabel: '适合人群',
    noteLabel: '课程说明',
    detailSummaryTitle: '查看课程细节与每日作息',
    detailSummaryHint: '斯巴达管理、雅思课程、亲子课程、上课规定和每日作息',
    guideTitle: '报名前值得确认的课程细节',
  },
  schedule: {
    eyebrow: 'DAILY TIMETABLE',
    title: "B'Cebu 每日作息（周一至周五）",
    intro: '每节课45分钟，课间休息10分钟；每人按所选课程上其中几节，课表在第一天发放。',
    badge: '斯巴达多出早晚词汇课和晚自习',
  },
  planning: {
    summaryTitle: '2027年假期与暑假附加费',
    summaryHint: '学校假期与暑假附加费档期',
  },
  calendar: {
    eyebrow: 'ACADEMIC CALENDAR',
    title: "B'Cebu 2027年日历",
    intro: '学校假期和暑假附加费档期一表看完，用于规划入学日期和周数。国定假日停课，不补课。',
    footnote: BCEBU_HOLIDAY_FOOTNOTE,
    peakEyebrow: '2027 SUMMER',
    peakTitle: '2027年暑假附加费',
    peakIntro: '课程或住宿计划覆盖以下学习周时，每名学生按实际重叠周数计收暑假附加费。',
    peakNote: '入学按周日、离校按周六；课程与住宿在同一周重叠只计一次，暑假附加费不参与任何折扣。',
  },
  videos: {
    eyebrow: 'SCHOOL VIDEOS',
    title: "用视频了解 B'Cebu",
    intro: "视频来自 B'Cebu 学校官方和思达启航实拍：校园、宿舍、真实课堂、中国学员访谈和校园生活。",
    badge: "B'Cebu 学校视频",
    lifeTitle: '校园生活短片',
  },
  rooms: {
    photoTitle: '房型实景',
    photoIntro: BCEBU_PAGE_TEXT.roomsPhotoIntro,
    rulesTitle: '短期费率、入住离校与宿舍规定',
    rulesHint: '1–3周住宿费比例、入住离校、额外住宿费、门禁与宿舍规定',
    dormRulesTitle: '宿舍规定',
  },
  quote: {
    ...CIA_PAGE_COPY.quote,
    compareShortcuts: [
      { focus: 'room', label: '比房型', hint: '如单人间、双人间和三人间' },
      { focus: 'course', label: '比同类课程', hint: '如 Speed ESL、Intensive 和斯巴达' },
      { focus: 'weeks', label: '比周数', hint: '如4周、8周、12周' },
    ],
  },
  fees: CIA_PAGE_COPY.fees,
  practicalGuide: {
    summaryTitle: '到校须知与学校服务',
    summaryHint: '第一天安排、用餐与开放时间、打扫洗衣、校车、护照签证、其他收费',
    intro: '出发前和到校后最常问到的安排。',
  },
  sida: {
    ...CIA_PAGE_COPY.sida,
    title: brandBCebu(CIA_PAGE_COPY.sida.title),
    photoAlt: brandBCebu(CIA_PAGE_COPY.sida.photoAlt),
    photoCaption: brandBCebu(CIA_PAGE_COPY.sida.photoCaption),
  },
  faq: CIA_PAGE_COPY.faq,
  finalCta: {
    title: BCEBU_PAGE_TEXT.finalCtaTitle,
    text: BCEBU_PAGE_TEXT.finalCtaText,
    primaryLabel: "获取 B'Cebu 完整报价单",
    secondaryLabel: '咨询当前空房',
  },
};

const BCEBU_INITIAL_ROOM_RATE_GROUPS: RoomRateGroup[] = [...new Set(defaults.rooms.map(room => room.group))].map(title => ({
  title,
  rooms: defaults.rooms
    .filter(room => room.enabled && room.group === title)
    .map(room => ({ id: room.id, label: room.label, code: room.code, location: room.location })),
}));

export const BCEBU_PAGE_PROFILE: PhSchoolProfile = {
  code: 'BCEBU',
  name: "B'Cebu",
  previewPrefix: 'bcebu',
  pricingSchoolName: "B'Cebu",
  copy: BCEBU_COPY,
  compactLayout: true,
  overviewFacts: BCEBU_OVERVIEW_FACTS,
  videoTabs: BCEBU_VIDEO_TABS,
  roomVideos: BCEBU_ROOM_VIDEOS,
  gallery: {
    categories: CIA_GALLERY_CATEGORIES,
    albumCategories: ['校园', '教室', '住宿', '餐厅', '设施'],
    images: BCEBU_GALLERY_IMAGES,
    heroCategories: ['校园', '设施', '住宿'],
    albumDescriptions: BCEBU_ALBUM_DESCRIPTIONS,
    uploadedPhotoTitle: "B'Cebu 学校媒体",
    uploadedPhotoDescription: "B'Cebu 学校实景内容",
    uploadedVideoTitle: "B'Cebu 学校视频",
  },
  snapshotCards: BCEBU_QUICK_INFO,
  basicInfo: BCEBU_BASIC_INFO,
  suitableFor: BCEBU_SUITABLE_FOR.map(title => ({ title, text: '' })),
  notSuitableFor: BCEBU_NOT_SUITABLE_FOR.map(title => ({ title, text: '' })),
  campusBuildings: BCEBU_CAMPUS_BUILDINGS,
  videoCards: BCEBU_VIDEO_CARDS,
  campusLifeVideos: BCEBU_CAMPUS_LIFE_VIDEOS,
  interviewVideos: [],
  courseGroups: [
    { icon: 'forum', title: '综合英语 ESL', text: '一对一为主，可选斯巴达管理', courseIds: ['speed-esl', 'intensive-esl', 'b-sparta'] },
    { icon: 'workspace_premium', title: '雅思 IELTS', text: '常规、斯巴达和12周保证班', courseIds: [BCEBU_IELTS_GUARANTEE_ID, 'ielts', 'ielts-sparta'] },
    { icon: 'business_center', title: '商务英语', text: '职场与商务英语', courseIds: ['business-english'] },
    { icon: 'self_improvement', title: '轻松课程', text: '每天4节或2节一对一，不用月考', courseIds: ['lite-esl4', BCEBU_LITE_40_COURSE_ID] },
    { icon: 'family_restroom', title: '青少年与幼儿', text: '小学和初中生、4–6岁幼儿', courseIds: [BCEBU_JUNIOR_COURSE_ID, BCEBU_KIDS_COURSE_ID] },
  ],
  studyModes: [],
  courseDetailGuides: BCEBU_COURSE_DETAIL_GUIDES,
  scheduleColumns: [
    { code: 'MORNING', title: '上午', rows: BCEBU_SCHEDULE.slice(0, AFTERNOON_START) },
    { code: 'AFTERNOON', title: '下午和晚上', rows: BCEBU_SCHEDULE.slice(AFTERNOON_START) },
  ],
  initialCourseFees: initialPricing.courseFees,
  initialRoomFees: initialPricing.roomFees,
  initialRoomRateGroups: BCEBU_INITIAL_ROOM_RATE_GROUPS,
  showRoomCodes: false,
  dormRules: BCEBU_DORM_RULES,
  roomProfiles: BCEBU_ROOM_PROFILES,
  ieltsResults: [],
  studentReviews: [],
  reviewPath: '',
  holidayCalendars: BCEBU_HOLIDAY_CALENDARS,
  ieltsComputerExamDates2027: [],
  studentCareServices: [],
  campusPracticalGuides: BCEBU_PRACTICAL_GUIDES,
  studentTracks: [],
  sidaReasons: CIA_SIDA_REASONS.map(reason => ({ ...reason, alt: brandBCebu(reason.alt) })),
  sidaTrustBadges: CIA_SIDA_TRUST_BADGES,
  ctaBadges: BCEBU_FINAL_CTA_BADGES,
  ctaConsultants: CIA_CTA_CONSULTANTS,
  mobileAnchors: [
    { label: '视频', target: 'gallery', icon: 'smart_display' },
    { label: '概览', target: 'overview', icon: 'dashboard' },
    { label: '课程', target: 'courses', icon: 'menu_book' },
    { label: '住宿', target: 'rooms', icon: 'bed' },
    { label: '报价', target: 'quote', icon: 'calculate' },
    { label: 'FAQ', target: 'faq', icon: 'help' },
  ],
  faqs: () => BCEBU_FAQS.map(item => ({ ...item })),
  shows2026Prices: () => false,
  defaultContent: createDefaultBCebuContentConfig,
  cloneContent: cloneBCebuContentConfig,
};

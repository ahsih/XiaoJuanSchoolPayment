// MK content for the shared Philippine school page (school-page/ph-school-page.component.*).
// Text and data come from mk-page-content.ts; prices and rules from mk-content-config.ts.
// Keep it pure data (no Angular, DOM or storage), like the modules it reads.
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
import { cloneMkContentConfig, createDefaultMkContentConfig, MK_IELTS_GUARANTEE_ID } from './mk-content-config';
import {
  MK_ALBUM_DESCRIPTIONS,
  MK_BASIC_INFO,
  MK_CAMPUS_BUILDINGS,
  MK_COURSE_DETAIL_GUIDES,
  MK_FAQS,
  MK_FINAL_CTA_BADGES,
  MK_GALLERY_IMAGES,
  MK_HOLIDAY_CALENDARS,
  MK_HOLIDAY_FOOTNOTE,
  MK_LICENSE,
  MK_NOT_SUITABLE_FOR,
  MK_OVERVIEW_FACTS,
  MK_PAGE_TEXT,
  MK_PRACTICAL_GUIDES,
  MK_QUICK_INFO,
  MK_REFERENCE_NOTE,
  MK_ROOM_PROFILES,
  MK_SUITABLE_FOR,
} from './mk-page-content';

/** Database school names, the current one first (the regional seed and its aliases). */
export const MK_SCHOOL_NAMES: readonly string[] = [
  '菲律宾伊洛伊洛MK Language Training Center',
  'MK Language Training Center',
  'MK Education',
  'Metro Korea Language Training Center',
];

const defaults = createDefaultMkContentConfig();
const initialPricing = createCiaQuotePricing(defaults);
const brandMk = (text: string) => text.replace(/CIA/g, 'MK');

const MK_COPY: PhPageCopy = {
  swipeHint: CIA_PAGE_COPY.swipeHint,
  referenceNote: MK_REFERENCE_NOTE,
  hero: {
    breadcrumb: '菲律宾游学 / 伊洛伊洛学校 / MK',
    title: '菲律宾伊洛伊洛 MK 语言学校',
    lead: MK_PAGE_TEXT.heroLead,
    tags: [
      { icon: 'location_on', text: '伊洛伊洛市' },
      { icon: 'history_edu', text: '2002年成立' },
      { icon: 'family_restroom', text: '亲子课程' },
      { icon: 'pool', text: '校内泳池' },
    ],
  },
  overview: { title: '30 秒看懂 MK' },
  advisorReview: {
    title: '顾问怎么看 MK',
    text: MK_PAGE_TEXT.advisorText,
    suitableTitle: '适合谁',
    notSuitableTitle: '报名前想清楚',
  },
  license: MK_LICENSE,
  campus: {
    eyebrow: 'CAMPUS AT A GLANCE',
    title: 'MK 校园介绍',
    intro: MK_PAGE_TEXT.campusIntro,
  },
  gallery: {
    title: '按区域查看 MK 环境',
    intro: MK_PAGE_TEXT.galleryIntro,
    photoNote: CIA_PAGE_COPY.gallery.photoNote,
    roomComparisonTitle: '房型对比',
    roomDisclaimer: MK_REFERENCE_NOTE,
  },
  courses: {
    title: 'MK 课程怎么选？',
    intro: MK_PAGE_TEXT.coursesIntro,
    priceUnit: '/4周',
    fitLabel: '适合人群',
    noteLabel: '课程说明',
    detailSummaryTitle: '查看课程细节',
    detailSummaryHint: '雅思保分班、亲子课程、实习和TESOL',
    guideTitle: '报名前值得确认的课程细节',
  },
  planning: {
    summaryTitle: '2027年学校假期',
    summaryHint: '学校停课日，规划入学日期时查看',
  },
  calendar: {
    eyebrow: 'ACADEMIC CALENDAR',
    title: 'MK 2027年日历',
    intro: '学校2027年的停课日一表看完，用于规划入学日期和周数。',
    footnote: MK_HOLIDAY_FOOTNOTE,
    peakEyebrow: '2027 PEAK SEASON',
    peakTitle: '2027年旺季',
    peakIntro: '',
    peakNote: '',
  },
  videos: {
    eyebrow: 'SCHOOL VIDEOS',
    title: '用视频了解 MK',
    intro: '',
    badge: 'MK 视频',
  },
  rooms: {
    photoTitle: '房型实景',
    photoIntro: MK_PAGE_TEXT.roomsPhotoIntro,
    rulesTitle: '短期费率与入住离校',
    rulesHint: '1–3周住宿费比例、入住离校时间',
  },
  quote: {
    ...CIA_PAGE_COPY.quote,
    compareShortcuts: [
      { focus: 'room', label: '比房型', hint: '如单人间、双人间和三人间' },
      { focus: 'course', label: '比同类课程', hint: '如综合英语基础、标准和高级' },
      { focus: 'weeks', label: '比周数', hint: '如4周、8周、12周' },
    ],
  },
  fees: CIA_PAGE_COPY.fees,
  practicalGuide: {
    summaryTitle: '到校须知与学校服务',
    summaryHint: '抵达与接机、用餐与宿舍服务、课外活动',
    intro: '出发前和到校后最常问到的安排。',
  },
  sida: {
    ...CIA_PAGE_COPY.sida,
    title: brandMk(CIA_PAGE_COPY.sida.title),
    photoAlt: brandMk(CIA_PAGE_COPY.sida.photoAlt),
    photoCaption: brandMk(CIA_PAGE_COPY.sida.photoCaption),
  },
  faq: CIA_PAGE_COPY.faq,
  finalCta: {
    title: MK_PAGE_TEXT.finalCtaTitle,
    text: MK_PAGE_TEXT.finalCtaText,
    primaryLabel: '获取 MK 完整报价单',
    secondaryLabel: '咨询当前空房',
  },
};

const MK_INITIAL_ROOM_RATE_GROUPS: RoomRateGroup[] = [...new Set(defaults.rooms.map(room => room.group))].map(title => ({
  title,
  rooms: defaults.rooms
    .filter(room => room.enabled && room.group === title)
    .map(room => ({ id: room.id, label: room.label, code: room.code, location: room.location })),
}));

export const MK_PAGE_PROFILE: PhSchoolProfile = {
  code: 'MK',
  name: 'MK',
  previewPrefix: 'mk',
  // The API matches names by substring, so this finds the seeded name and its English aliases; findSchool picks the exact one.
  pricingSchoolName: 'Language Training Center',
  copy: MK_COPY,
  compactLayout: true,
  overviewFacts: MK_OVERVIEW_FACTS,
  courseHighlights: {
    [MK_IELTS_GUARANTEE_ID]: {
      badge: '送1次官方雅思考试',
      label: '考试福利',
      text: '保分班学生可免费参加1次官方雅思考试。',
    },
  },
  gallery: {
    categories: CIA_GALLERY_CATEGORIES,
    albumCategories: ['校园', '教室', '住宿', '餐厅', '设施'],
    images: MK_GALLERY_IMAGES,
    heroCategories: ['校园', '设施', '住宿'],
    albumDescriptions: MK_ALBUM_DESCRIPTIONS,
    uploadedPhotoTitle: 'MK 学校媒体',
    uploadedPhotoDescription: 'MK 学校实景内容',
    uploadedVideoTitle: 'MK 学校视频',
  },
  snapshotCards: MK_QUICK_INFO,
  basicInfo: MK_BASIC_INFO,
  suitableFor: MK_SUITABLE_FOR.map(title => ({ title, text: '' })),
  notSuitableFor: MK_NOT_SUITABLE_FOR.map(title => ({ title, text: '' })),
  campusBuildings: MK_CAMPUS_BUILDINGS,
  // MK supplied no videos or daily timetable, so those sections stay out.
  videoCards: [],
  campusLifeVideos: [],
  interviewVideos: [],
  courseGroups: [
    { icon: 'forum', title: '综合英语 ESL', text: '基础、标准、高级和全一对一强化', courseIds: ['esl-basic', 'esl-standard', 'esl-premium', 'esl-intensive'] },
    { icon: 'workspace_premium', title: '雅思 IELTS', text: '常规课程和12周保分班', courseIds: [MK_IELTS_GUARANTEE_ID, 'ielts'] },
    {
      icon: 'business_center', title: '职场与特色课程', text: '商务、打工度假、实习和生存英语',
      courseIds: ['business', 'working-holiday', 'internship', 'survival'],
    },
    { icon: 'family_restroom', title: '青少年与家长', text: '孩子和陪读家长', courseIds: ['junior-basic', 'junior-premium', 'guardian'] },
  ],
  studyModes: [],
  courseDetailGuides: MK_COURSE_DETAIL_GUIDES,
  scheduleColumns: [],
  initialCourseFees: initialPricing.courseFees,
  initialRoomFees: initialPricing.roomFees,
  initialRoomRateGroups: MK_INITIAL_ROOM_RATE_GROUPS,
  showRoomCodes: false,
  dormRules: [],
  roomProfiles: MK_ROOM_PROFILES,
  ieltsResults: [],
  studentReviews: [],
  reviewPath: '',
  holidayCalendars: MK_HOLIDAY_CALENDARS,
  ieltsComputerExamDates2027: [],
  studentCareServices: [],
  campusPracticalGuides: MK_PRACTICAL_GUIDES,
  studentTracks: [],
  sidaReasons: CIA_SIDA_REASONS.map(reason => ({ ...reason, alt: brandMk(reason.alt) })),
  sidaTrustBadges: CIA_SIDA_TRUST_BADGES,
  ctaBadges: MK_FINAL_CTA_BADGES,
  ctaConsultants: CIA_CTA_CONSULTANTS,
  mobileAnchors: [
    { label: '照片', target: 'gallery', icon: 'photo_library' },
    { label: '概览', target: 'overview', icon: 'dashboard' },
    { label: '课程', target: 'courses', icon: 'menu_book' },
    { label: '住宿', target: 'rooms', icon: 'bed' },
    { label: '报价', target: 'quote', icon: 'calculate' },
    { label: 'FAQ', target: 'faq', icon: 'help' },
  ],
  faqs: () => MK_FAQS.map(item => ({ ...item })),
  shows2026Prices: () => false,
  defaultContent: createDefaultMkContentConfig,
  cloneContent: cloneMkContentConfig,
};

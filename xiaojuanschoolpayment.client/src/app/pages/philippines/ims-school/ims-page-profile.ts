// IMS Academy content for the shared Philippine school page (school-page/ph-school-page.component.*).
// Text and data come from ims-page-content.ts; prices and rules from ims-content-config.ts.
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
import { cloneImsContentConfig, createDefaultImsContentConfig } from './ims-content-config';
import {
  IMS_ALBUM_DESCRIPTIONS,
  IMS_BASIC_INFO,
  IMS_CAMPUS_FLOORS,
  IMS_CAMPUS_VIDEOS,
  IMS_COURSE_DETAIL_GUIDES,
  IMS_COURSE_VIDEOS,
  IMS_INTERVIEW_VIDEOS,
  IMS_DORM_RULES,
  IMS_FAQS,
  IMS_FINAL_CTA_BADGES,
  IMS_GALLERY_IMAGES,
  IMS_HOLIDAY_CALENDARS,
  IMS_HOLIDAY_FOOTNOTE,
  IMS_NOT_SUITABLE_FOR,
  IMS_OFFERS,
  IMS_OVERVIEW_FACTS,
  IMS_PAGE_TEXT,
  IMS_PEAK_RANGES_2027,
  IMS_PRACTICAL_GUIDES,
  IMS_QUICK_INFO,
  IMS_REFERENCE_NOTE,
  IMS_REFUND_COPY,
  IMS_ROOM_PROFILES,
  IMS_SCHEDULE,
  IMS_SUITABLE_FOR,
} from './ims-page-content';

/** The IMS school code of the content document and the employee editors. */
export const IMS_SCHOOL_CODE = 'IMS';

const defaults = createDefaultImsContentConfig();
const AFTERNOON_START = IMS_SCHEDULE.findIndex(row => row.time.startsWith('13:00'));
const initialPricing = createCiaQuotePricing(defaults);
const brandIms = (text: string) => text.replace(/CIA/g, 'IMS');

const IMS_COPY: PhPageCopy = {
  swipeHint: CIA_PAGE_COPY.swipeHint,
  referenceNote: IMS_REFERENCE_NOTE,
  hero: {
    breadcrumb: '菲律宾游学 / 宿务学校 / IMS',
    title: '菲律宾宿务 IMS Academy 语言学校',
    lead: IMS_PAGE_TEXT.heroLead,
    tags: [
      { icon: 'location_on', text: '宿务市Banilad' },
      { icon: 'record_voice_over', text: '一对一为主' },
      { icon: 'workspace_premium', text: '雅思托业保分' },
      { icon: 'family_restroom', text: '亲子课程' },
    ],
    quoteLabel: '获取 IMS 最新报价',
  },
  overview: { title: '30 秒看懂 IMS' },
  advisorReview: {
    title: '顾问怎么看 IMS',
    text: IMS_PAGE_TEXT.advisorText,
    suitableTitle: '适合谁',
    notSuitableTitle: '报名前想清楚',
  },
  campus: {
    eyebrow: 'CAMPUS AT A GLANCE',
    title: 'IMS 校园介绍',
    intro: IMS_PAGE_TEXT.campusIntro,
  },
  gallery: {
    title: '按区域查看 IMS 环境',
    intro: IMS_PAGE_TEXT.galleryIntro,
    photoNote: CIA_PAGE_COPY.gallery.photoNote,
    roomComparisonTitle: '房型对比',
    roomDisclaimer: IMS_REFERENCE_NOTE,
  },
  courses: {
    title: 'IMS 课程怎么选？',
    intro: IMS_PAGE_TEXT.coursesIntro,
    priceUnit: '/4周',
    fitLabel: '适合人群',
    noteLabel: '课程说明',
    detailSummaryTitle: '查看课程细节与每日作息',
    detailSummaryHint: '保分班、托福和SAT、TESOL、亲子课程、分级与换课',
    guideTitle: '报名前值得确认的课程细节',
  },
  schedule: {
    eyebrow: 'DAILY TIMETABLE',
    title: 'IMS 每日作息（周一至周五）',
    intro: '每节课45分钟，课间休息10分钟；每天上哪几节、一对一还是小组课，按所选课程和分班安排。',
    badge: '自习室24小时开放',
  },
  planning: {
    summaryTitle: '2027年学校假期',
    summaryHint: '公休日停课，不补课',
  },
  calendar: {
    eyebrow: 'ACADEMIC CALENDAR',
    title: 'IMS 2027年日历',
    intro: '学校假期和不参加淡季优惠的周一表看完，用于规划入学日期和周数。',
    footnote: IMS_HOLIDAY_FOOTNOTE,
    peakEyebrow: '2027 PEAK MONTHS',
    peakTitle: '不参加淡季优惠的周',
    peakIntro: '1月和6–8月不参加2+2和淡季优惠；学校不收旺季附加费。',
    peakNote: '入学按周日、离校按周六。',
  },
  videos: {
    eyebrow: 'SCHOOL VIDEOS',
    title: '用视频了解 IMS',
    intro: '学校的宣传片、泳池派对和课堂视频。',
    badge: 'IMS 学校视频',
  },
  rooms: {
    photoTitle: '房型实景',
    photoIntro: IMS_PAGE_TEXT.roomsPhotoIntro,
    rulesTitle: '短期费率、入住离校与宿舍规定',
    rulesHint: '1–3周价格、入住离校、外出门禁与宿舍规定',
    dormRulesTitle: '宿舍与外出规定',
  },
  quote: {
    ...CIA_PAGE_COPY.quote,
    compareShortcuts: [
      { focus: 'room', label: '比房型', hint: '如四人间、三人间和双人间' },
      { focus: 'course', label: '比同类课程', hint: '如每天4节、5节和6节一对一' },
      { focus: 'weeks', label: '比周数', hint: '如4周、8周、12周' },
    ],
  },
  fees: CIA_PAGE_COPY.fees,
  refund: IMS_REFUND_COPY,
  practicalGuide: {
    summaryTitle: '到校须知与学校服务',
    summaryHint: '用餐与开放时间、打扫洗衣、签证护照、入住离校',
    intro: '出发前和到校后最常问到的安排。',
  },
  offers: {
    eyebrow: 'OFFERS',
    title: 'IMS 报名优惠',
    intro: '思达启航95折和学校优惠可以一起用；淡季指1、6、7、8月以外的课程周。',
    note: '报价器会按入学日期和课程周数自动算出能用的优惠；最终以学校确认为准。',
  },
  sida: {
    ...CIA_PAGE_COPY.sida,
    title: brandIms(CIA_PAGE_COPY.sida.title),
    photoAlt: brandIms(CIA_PAGE_COPY.sida.photoAlt),
    photoCaption: brandIms(CIA_PAGE_COPY.sida.photoCaption),
  },
  faq: CIA_PAGE_COPY.faq,
  finalCta: {
    title: IMS_PAGE_TEXT.finalCtaTitle,
    text: IMS_PAGE_TEXT.finalCtaText,
    primaryLabel: '获取 IMS 完整报价单',
    secondaryLabel: '咨询空房和优惠',
  },
};

const IMS_INITIAL_ROOM_RATE_GROUPS: RoomRateGroup[] = [...new Set(defaults.rooms.map(room => room.group))].map(title => ({
  title,
  rooms: defaults.rooms
    .filter(room => room.enabled && room.group === title)
    .map(room => ({ id: room.id, label: room.label, code: room.code, location: room.location })),
}));

export const IMS_PAGE_PROFILE: PhSchoolProfile = {
  code: IMS_SCHOOL_CODE,
  name: 'IMS',
  previewPrefix: 'ims',
  pricingSchoolName: '菲律宾宿务IMS Academy',
  copy: IMS_COPY,
  compactLayout: true,
  overviewFacts: IMS_OVERVIEW_FACTS,
  videoTabs: [
    { label: '校园视频', icon: 'videocam', items: IMS_CAMPUS_VIDEOS },
    { label: '学员访谈', icon: 'videocam', items: IMS_INTERVIEW_VIDEOS },
    { label: '课程视频', icon: 'videocam', items: IMS_COURSE_VIDEOS },
  ],
  courseHighlights: {
    'ielts-guarantee': { badge: '读满12周送1次官方考试' },
    'toeic-guarantee': { badge: '读满12周送1次官方考试' },
  },
  peakSeasonsWithoutSurcharge: { title: '不参加淡季优惠的周（不收旺季附加费）', ranges: IMS_PEAK_RANGES_2027 },
  gallery: {
    categories: CIA_GALLERY_CATEGORIES,
    albumCategories: ['校园', '教室', '住宿', '餐厅', '设施'],
    images: IMS_GALLERY_IMAGES,
    heroCategories: ['校园', '设施', '住宿', '教室', '餐厅'],
    albumDescriptions: IMS_ALBUM_DESCRIPTIONS,
    uploadedPhotoTitle: 'IMS 学校媒体',
    uploadedPhotoDescription: 'IMS 学校实景内容',
    uploadedVideoTitle: 'IMS 学校视频',
  },
  snapshotCards: IMS_QUICK_INFO,
  basicInfo: IMS_BASIC_INFO,
  suitableFor: IMS_SUITABLE_FOR.map(title => ({ title, text: '' })),
  notSuitableFor: IMS_NOT_SUITABLE_FOR.map(title => ({ title, text: '' })),
  campusBuildings: IMS_CAMPUS_FLOORS,
  videoCards: [],
  campusLifeVideos: [],
  interviewVideos: [],
  courseGroups: [
    {
      icon: 'forum', title: '综合英语 ESL', text: '每天4–6节一对一，按需要选',
      courseIds: ['premium-esl', 'intensive-esl', 'essential-esl-6', 'essential-esl-5', 'essential-esl-4', 'senior-esl'],
    },
    {
      icon: 'record_voice_over', title: '口语与职场英语', text: '演讲、商务、打工度假和口语考试',
      courseIds: ['power-speaking', 'business-english', 'working-holiday', 'toeic-speaking', 'opic'],
    },
    { icon: 'workspace_premium', title: '雅思 IELTS', text: '保分班读满12周送官方考试', courseIds: ['ielts-guarantee', 'ielts', 'pre-ielts'] },
    { icon: 'fact_check', title: '托业 TOEIC', text: '保分班读满12周送官方考试', courseIds: ['toeic-guarantee', 'toeic', 'pre-toeic'] },
    { icon: 'school', title: '托福和SAT', text: '强化班和SAT至少读4周', courseIds: ['intensive-toefl', 'pre-toefl', 'sat'] },
    { icon: 'cast_for_education', title: 'TESOL 英语教学', text: '20岁以上，至少读4周', courseIds: ['mommy-tesol', 'tesol-light'] },
    {
      icon: 'family_restroom', title: '亲子课程', text: '家长和7–14岁孩子一起读',
      courseIds: ['parents-esl', 'junior-esl-6', 'junior-esl-8', 'junior-esl-9'],
    },
  ],
  studyModes: [],
  courseDetailGuides: IMS_COURSE_DETAIL_GUIDES,
  scheduleColumns: [
    { code: 'MORNING', title: '上午', rows: IMS_SCHEDULE.slice(0, AFTERNOON_START) },
    { code: 'AFTERNOON', title: '下午和晚上', rows: IMS_SCHEDULE.slice(AFTERNOON_START) },
  ],
  initialCourseFees: initialPricing.courseFees,
  initialRoomFees: initialPricing.roomFees,
  initialRoomRateGroups: IMS_INITIAL_ROOM_RATE_GROUPS,
  roomGroupNotes: { 走读: '不住宿，只收课程费；不交水电、空调费和宿舍押金，可另付走读午餐。' },
  showRoomCodes: false,
  dormRules: IMS_DORM_RULES,
  roomProfiles: IMS_ROOM_PROFILES,
  ieltsResults: [],
  studentReviews: [],
  reviewPath: '',
  offers: IMS_OFFERS,
  holidayCalendars: IMS_HOLIDAY_CALENDARS,
  ieltsComputerExamDates2027: [],
  studentCareServices: [],
  campusPracticalGuides: IMS_PRACTICAL_GUIDES,
  studentTracks: [],
  sidaReasons: CIA_SIDA_REASONS.map(reason => ({ ...reason, alt: brandIms(reason.alt) })),
  sidaTrustBadges: CIA_SIDA_TRUST_BADGES,
  ctaBadges: IMS_FINAL_CTA_BADGES,
  ctaConsultants: CIA_CTA_CONSULTANTS,
  mobileAnchors: [
    { label: '视频', target: 'gallery', icon: 'smart_display' },
    { label: '概览', target: 'overview', icon: 'dashboard' },
    { label: '课程', target: 'courses', icon: 'menu_book' },
    { label: '住宿', target: 'rooms', icon: 'bed' },
    { label: '优惠', target: 'offers', icon: 'local_offer' },
    { label: '报价', target: 'quote', icon: 'calculate' },
    { label: 'FAQ', target: 'faq', icon: 'help' },
  ],
  faqs: () => IMS_FAQS.map(item => ({ ...item })),
  shows2026Prices: () => false,
  defaultContent: createDefaultImsContentConfig,
  cloneContent: cloneImsContentConfig,
};

// CIEC content for the shared Philippine school page (school-page/ph-school-page.component.*).
// Text and data come from ciec-page-content.ts; prices and rules from ciec-content-config.ts.
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
import {
  CIEC_CIDEC_GRADE_TUITION,
  CIEC_CIDEC_ID,
  CIEC_GUARDIAN_COURSE_IDS,
  CIEC_KINDERGARTEN_ID,
  cloneCiecContentConfig,
  createDefaultCiecContentConfig,
} from './ciec-content-config';
import {
  CIEC_ALBUM_DESCRIPTIONS,
  CIEC_BASIC_INFO,
  CIEC_CAMPUS_BUILDINGS,
  CIEC_COURSE_DETAIL_GUIDES,
  CIEC_DORM_RULES,
  CIEC_FAQS,
  CIEC_FINAL_CTA_BADGES,
  CIEC_GALLERY_IMAGES,
  CIEC_HOLIDAY_CALENDARS,
  CIEC_HOLIDAY_FOOTNOTE,
  CIEC_NOT_SUITABLE_FOR,
  CIEC_OVERVIEW_FACTS,
  CIEC_PAGE_TEXT,
  CIEC_PRACTICAL_GUIDES,
  CIEC_QUICK_INFO,
  CIEC_REFERENCE_NOTE,
  CIEC_REFUND_COPY,
  CIEC_REVIEWS_COPY,
  CIEC_ROOM_PROFILES,
  CIEC_SCHEDULE_COLUMNS,
  CIEC_SUITABLE_FOR,
  CIEC_TEST_RESULTS,
} from './ciec-page-content';

const defaults = createDefaultCiecContentConfig();
const initialPricing = createCiaQuotePricing(defaults);
const brandCiec = (text: string) => text.replace(/CIA/g, 'CIEC');

const CIEC_COPY: PhPageCopy = {
  swipeHint: CIA_PAGE_COPY.swipeHint,
  referenceNote: CIEC_REFERENCE_NOTE,
  hero: {
    breadcrumb: '菲律宾游学 / 宿务学校 / CIEC',
    title: '菲律宾宿务 CIEC 青少年英语学校',
    lead: CIEC_PAGE_TEXT.heroLead,
    tags: [
      { icon: 'location_on', text: '宿务市 Talamban' },
      { icon: 'family_restroom', text: '青少年与亲子' },
      { icon: 'child_care', text: '4岁起可读幼儿园' },
      { icon: 'history_edu', text: 'CIDEC 菲律宾学历' },
    ],
  },
  overview: { title: '30 秒看懂 CIEC' },
  advisorReview: {
    title: '顾问怎么看 CIEC',
    text: CIEC_PAGE_TEXT.advisorText,
    suitableTitle: '适合谁',
    notSuitableTitle: '报名前想清楚',
  },
  campus: {
    eyebrow: 'CAMPUS AT A GLANCE',
    title: 'CIEC 校园介绍',
    intro: CIEC_PAGE_TEXT.campusIntro,
  },
  gallery: {
    title: '按区域查看 CIEC 环境',
    intro: CIEC_PAGE_TEXT.galleryIntro,
    photoNote: CIA_PAGE_COPY.gallery.photoNote,
    roomComparisonTitle: '房型对比',
    roomDisclaimer: CIEC_REFERENCE_NOTE,
  },
  courses: {
    title: 'CIEC 课程怎么选？',
    intro: CIEC_PAGE_TEXT.coursesIntro,
    priceUnit: '/4周',
    fitLabel: '适合人群',
    noteLabel: '课程说明',
    detailSummaryTitle: '查看课程细节与每日作息',
    detailSummaryHint: '幼儿园、升学、CIDEC、家长课程和上课规定',
    guideTitle: '报名前值得确认的课程细节',
  },
  schedule: {
    eyebrow: 'DAILY TIMETABLE',
    title: 'CIEC 每日作息（周一至周五）',
    intro: '学校课表示例；实际课表按所选课程和分班安排。',
    badge: '小组课最多7人',
  },
  planning: {
    summaryTitle: '2027年学校假期',
    summaryHint: '菲律宾公休日停课，不补课',
  },
  calendar: {
    eyebrow: 'ACADEMIC CALENDAR',
    title: 'CIEC 2027年日历',
    intro: '学校假期一表看完，用于规划入学日期和周数。公休日停课，不补课也不退费。',
    footnote: CIEC_HOLIDAY_FOOTNOTE,
    peakEyebrow: 'PEAK SEASON',
    peakTitle: '旺季',
    peakIntro: '',
    peakNote: '',
  },
  videos: {
    eyebrow: 'SCHOOL VIDEOS',
    title: '用视频了解 CIEC',
    intro: '',
    badge: '',
  },
  rooms: {
    photoTitle: '房型实景',
    photoIntro: CIEC_PAGE_TEXT.roomsPhotoIntro,
    rulesTitle: '短期费率、入住离校与宿舍规定',
    rulesHint: '2–3周费率、婴幼儿食宿费、入住离校、外出与访客规定',
    dormRulesTitle: '宿舍与外出规定',
  },
  quote: {
    ...CIA_PAGE_COPY.quote,
    compareShortcuts: [
      { focus: 'room', label: '比房型', hint: '如双人间和三人间' },
      { focus: 'course', label: '比同类课程', hint: '如青少年学术和密集课程' },
      { focus: 'weeks', label: '比周数', hint: '如4周、8周、12周' },
    ],
  },
  fees: CIA_PAGE_COPY.fees,
  refund: CIEC_REFUND_COPY,
  reviews: CIEC_REVIEWS_COPY,
  practicalGuide: {
    summaryTitle: '到校须知与学校服务',
    summaryHint: '第一天安排、用餐与开放时间、洗衣打扫、离校退押金、安全提醒',
    intro: '出发前和到校后最常问到的安排。',
  },
  sida: {
    ...CIA_PAGE_COPY.sida,
    title: brandCiec(CIA_PAGE_COPY.sida.title),
    photoAlt: brandCiec(CIA_PAGE_COPY.sida.photoAlt),
    photoCaption: brandCiec(CIA_PAGE_COPY.sida.photoCaption),
  },
  faq: CIA_PAGE_COPY.faq,
  finalCta: {
    title: CIEC_PAGE_TEXT.finalCtaTitle,
    text: CIEC_PAGE_TEXT.finalCtaText,
    primaryLabel: '获取 CIEC 完整报价单',
    secondaryLabel: '咨询当前空房',
  },
};

const CIEC_INITIAL_ROOM_RATE_GROUPS: RoomRateGroup[] = [...new Set(defaults.rooms.map(room => room.group))].map(title => ({
  title,
  rooms: defaults.rooms
    .filter(room => room.enabled && room.group === title)
    .map(room => ({ id: room.id, label: room.label, code: room.code, location: room.location })),
}));

export const CIEC_PAGE_PROFILE: PhSchoolProfile = {
  code: 'CIEC',
  name: 'CIEC',
  previewPrefix: 'ciec',
  pricingSchoolName: '菲律宾宿务CIEC',
  copy: CIEC_COPY,
  compactLayout: true,
  overviewFacts: CIEC_OVERVIEW_FACTS,
  videoTabs: [],
  courseHighlights: {
    [CIEC_CIDEC_ID]: { badge: `另收一次性年级学费${CIEC_CIDEC_GRADE_TUITION.toLocaleString('en-US')}美元`, icon: 'info' },
  },
  gallery: {
    categories: CIA_GALLERY_CATEGORIES,
    albumCategories: ['校园', '教室', '住宿', '餐厅', '设施'],
    images: CIEC_GALLERY_IMAGES,
    heroCategories: ['校园', '教室', '住宿', '餐厅', '设施'],
    albumDescriptions: CIEC_ALBUM_DESCRIPTIONS,
    uploadedPhotoTitle: 'CIEC 学校媒体',
    uploadedPhotoDescription: 'CIEC 学校实景内容',
    uploadedVideoTitle: 'CIEC 学校视频',
  },
  snapshotCards: CIEC_QUICK_INFO,
  basicInfo: CIEC_BASIC_INFO,
  suitableFor: CIEC_SUITABLE_FOR.map(title => ({ title, text: '' })),
  notSuitableFor: CIEC_NOT_SUITABLE_FOR.map(title => ({ title, text: '' })),
  campusBuildings: CIEC_CAMPUS_BUILDINGS,
  videoCards: [],
  campusLifeVideos: [],
  interviewVideos: [],
  courseGroups: [
    { icon: 'child_care', title: '幼儿园', text: '满4–6岁，须家长陪同', courseIds: [CIEC_KINDERGARTEN_ID] },
    { icon: 'school', title: '青少年英语', text: '小学1年级到高中3年级', courseIds: ['junior-academic', 'junior-intensive'] },
    {
      icon: 'workspace_premium', title: '考试与升学', text: '雅思托福、入学准备和留学课程',
      courseIds: ['junior-ielts-toefl', 'school-preparation', 'overseas-school'],
    },
    { icon: 'history_edu', title: 'CIDEC 学历课程', text: '同时读菲律宾正规学年', courseIds: [CIEC_CIDEC_ID] },
    { icon: 'family_restroom', title: '家长课程', text: '陪读家长每天3节一对一', courseIds: CIEC_GUARDIAN_COURSE_IDS },
  ],
  studyModes: [],
  courseDetailGuides: CIEC_COURSE_DETAIL_GUIDES,
  scheduleColumns: CIEC_SCHEDULE_COLUMNS,
  initialCourseFees: initialPricing.courseFees,
  initialRoomFees: initialPricing.roomFees,
  initialRoomRateGroups: CIEC_INITIAL_ROOM_RATE_GROUPS,
  showRoomCodes: false,
  dormRules: CIEC_DORM_RULES,
  roomProfiles: CIEC_ROOM_PROFILES,
  ieltsResults: CIEC_TEST_RESULTS,
  studentReviews: [],
  reviewPath: '',
  holidayCalendars: CIEC_HOLIDAY_CALENDARS,
  ieltsComputerExamDates2027: [],
  studentCareServices: [],
  campusPracticalGuides: CIEC_PRACTICAL_GUIDES,
  studentTracks: [],
  sidaReasons: CIA_SIDA_REASONS.map(reason => ({ ...reason, alt: brandCiec(reason.alt) })),
  sidaTrustBadges: CIA_SIDA_TRUST_BADGES,
  ctaBadges: CIEC_FINAL_CTA_BADGES,
  ctaConsultants: CIA_CTA_CONSULTANTS,
  mobileAnchors: [
    { label: '照片', target: 'gallery', icon: 'photo_library' },
    { label: '概览', target: 'overview', icon: 'dashboard' },
    { label: '课程', target: 'courses', icon: 'menu_book' },
    { label: '住宿', target: 'rooms', icon: 'bed' },
    { label: '成绩', target: 'student-reviews', icon: 'workspace_premium' },
    { label: '报价', target: 'quote', icon: 'calculate' },
    { label: 'FAQ', target: 'faq', icon: 'help' },
  ],
  faqs: () => CIEC_FAQS.map(item => ({ ...item })),
  shows2026Prices: () => false,
  defaultContent: createDefaultCiecContentConfig,
  cloneContent: cloneCiecContentConfig,
};

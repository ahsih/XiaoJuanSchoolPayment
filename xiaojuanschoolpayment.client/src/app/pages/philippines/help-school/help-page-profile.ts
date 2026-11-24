// HELP Clark content for the shared Philippine school page (school-page/ph-school-page.component.*).
// Text and data come from help-page-content.ts; prices and rules from help-content-config.ts.
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
import { cloneHelpContentConfig, createDefaultHelpContentConfig, HELP_SCHOOL_CODE } from './help-content-config';
import {
  HELP_ALBUM_DESCRIPTIONS,
  HELP_BASIC_INFO,
  HELP_CAMPUS_FLOORS,
  HELP_CAMPUS_TOUR,
  HELP_COURSE_DETAIL_GUIDES,
  HELP_DORM_RULES,
  HELP_FAQS,
  HELP_FINAL_CTA_BADGES,
  HELP_GALLERY_IMAGES,
  HELP_LICENSE,
  HELP_NOT_SUITABLE_FOR,
  HELP_OVERVIEW_FACTS,
  HELP_PAGE_TEXT,
  HELP_PRACTICAL_GUIDES,
  HELP_QUICK_INFO,
  HELP_REFERENCE_NOTE,
  HELP_REFUND_COPY,
  HELP_ROOM_PROFILES,
  HELP_ROOM_VIDEOS,
  HELP_SCHEDULE,
  HELP_SUITABLE_FOR,
} from './help-page-content';

const defaults = createDefaultHelpContentConfig();
const AFTERNOON_START = HELP_SCHEDULE.findIndex(row => row.time.startsWith('13:15'));
const initialPricing = createCiaQuotePricing(defaults);
const brandHelp = (text: string) => text.replace(/CIA/g, 'HELP 克拉克');

const HELP_COPY: PhPageCopy = {
  swipeHint: CIA_PAGE_COPY.swipeHint,
  referenceNote: HELP_REFERENCE_NOTE,
  hero: {
    breadcrumb: '菲律宾游学 / 克拉克学校 / HELP',
    title: '菲律宾克拉克 HELP English 语言学校',
    lead: HELP_PAGE_TEXT.heroLead,
    tags: [
      { icon: 'location_on', text: '克拉克自由港区' },
      { icon: 'verified', text: '斯巴达管理' },
      { icon: 'record_voice_over', text: '每天4–5节一对一' },
      { icon: 'family_restroom', text: '亲子营' },
    ],
    quoteLabel: '获取 HELP 最新报价',
  },
  overview: { title: '30 秒看懂 HELP 克拉克' },
  advisorReview: {
    title: '顾问怎么看 HELP 克拉克',
    text: HELP_PAGE_TEXT.advisorText,
    suitableTitle: '适合谁',
    notSuitableTitle: '报名前想清楚',
  },
  license: HELP_LICENSE,
  campus: {
    eyebrow: 'CAMPUS AT A GLANCE',
    title: 'HELP 克拉克校园介绍',
    intro: HELP_PAGE_TEXT.campusIntro,
  },
  gallery: {
    title: '按区域查看 HELP 克拉克环境',
    intro: HELP_PAGE_TEXT.galleryIntro,
    photoNote: CIA_PAGE_COPY.gallery.photoNote,
    roomComparisonTitle: '房型对比',
    roomDisclaimer: HELP_REFERENCE_NOTE,
  },
  courses: {
    title: 'HELP 克拉克课程怎么选？',
    intro: HELP_PAGE_TEXT.coursesIntro,
    priceUnit: '/4周',
    fitLabel: '适合人群',
    noteLabel: '课程说明',
    detailSummaryTitle: '查看课程细节与每日作息',
    detailSummaryHint: '分级与模考、亲子营、2027夏季青少年营和上课规定',
    guideTitle: '报名前值得确认的课程细节',
  },
  schedule: {
    eyebrow: 'DAILY TIMETABLE',
    title: 'HELP 克拉克每日作息（周一至周五）',
    intro: 'ESL课程示例，每节课40分钟；实际课表按所选课程和分班安排。',
    badge: '每天单词测试',
  },
  videos: {
    eyebrow: 'SCHOOL VIDEOS',
    title: '用视频了解 HELP 克拉克',
    intro: '校园导览和2026年新房间的实拍视频。',
    badge: 'HELP 学校视频',
  },
  rooms: {
    photoTitle: '房型实景',
    photoIntro: HELP_PAGE_TEXT.roomsPhotoIntro,
    rulesTitle: '短期费率、入住离校与宿舍规定',
    rulesHint: '1–3周住宿费比例、入住离校、外出门禁与宿舍规定',
    dormRulesTitle: '宿舍与外出规定',
  },
  quote: {
    ...CIA_PAGE_COPY.quote,
    compareShortcuts: [
      { focus: 'room', label: '比房型', hint: '如四人间、三人间和双人间' },
      { focus: 'course', label: '比同类课程', hint: '如ESL和密集ESL' },
      { focus: 'weeks', label: '比周数', hint: '如4周、8周、12周' },
    ],
  },
  fees: CIA_PAGE_COPY.fees,
  refund: HELP_REFUND_COPY,
  practicalGuide: {
    summaryTitle: '到校须知与学校服务',
    summaryHint: '用餐与开放时间、打扫洗衣、签证护照、出发前准备',
    intro: '出发前和到校后最常问到的安排。',
  },
  sida: {
    ...CIA_PAGE_COPY.sida,
    title: brandHelp(CIA_PAGE_COPY.sida.title),
    photoAlt: brandHelp(CIA_PAGE_COPY.sida.photoAlt),
    photoCaption: brandHelp(CIA_PAGE_COPY.sida.photoCaption),
  },
  faq: CIA_PAGE_COPY.faq,
  finalCta: {
    title: HELP_PAGE_TEXT.finalCtaTitle,
    text: HELP_PAGE_TEXT.finalCtaText,
    primaryLabel: '获取 HELP 克拉克完整报价单',
    secondaryLabel: '咨询开课日和空房',
  },
};

const HELP_INITIAL_ROOM_RATE_GROUPS: RoomRateGroup[] = [...new Set(defaults.rooms.map(room => room.group))].map(title => ({
  title,
  rooms: defaults.rooms
    .filter(room => room.enabled && room.group === title)
    .map(room => ({ id: room.id, label: room.label, code: room.code, location: room.location })),
}));

export const HELP_PAGE_PROFILE: PhSchoolProfile = {
  code: HELP_SCHOOL_CODE,
  name: 'HELP 克拉克',
  previewPrefix: 'help-clark',
  pricingSchoolName: 'HELP',
  copy: HELP_COPY,
  compactLayout: true,
  overviewFacts: HELP_OVERVIEW_FACTS,
  videoTabs: [
    { label: '校园视频', icon: 'videocam', items: [HELP_CAMPUS_TOUR] },
    { label: '宿舍视频', icon: 'videocam', items: Object.values(HELP_ROOM_VIDEOS) },
  ],
  roomVideos: HELP_ROOM_VIDEOS,
  gallery: {
    categories: CIA_GALLERY_CATEGORIES,
    albumCategories: ['校园', '教室', '住宿', '餐厅', '设施'],
    images: HELP_GALLERY_IMAGES,
    heroCategories: ['校园', '设施', '住宿'],
    albumDescriptions: HELP_ALBUM_DESCRIPTIONS,
    uploadedPhotoTitle: 'HELP 克拉克学校媒体',
    uploadedPhotoDescription: 'HELP 克拉克学校实景内容',
    uploadedVideoTitle: 'HELP 克拉克学校视频',
  },
  snapshotCards: HELP_QUICK_INFO,
  basicInfo: HELP_BASIC_INFO,
  suitableFor: HELP_SUITABLE_FOR.map(title => ({ title, text: '' })),
  notSuitableFor: HELP_NOT_SUITABLE_FOR.map(title => ({ title, text: '' })),
  campusBuildings: HELP_CAMPUS_FLOORS,
  videoCards: [],
  campusLifeVideos: [],
  interviewVideos: [],
  courseGroups: [
    { icon: 'forum', title: '综合英语 ESL', text: '9个级别，每4周测试一次', courseIds: ['esl', 'esl-intensive'] },
    { icon: 'workspace_premium', title: '雅思 IELTS', text: '按入学成绩分级，定期模考', courseIds: ['ielts-basic', 'ielts-advanced'] },
    { icon: 'fact_check', title: '托业 TOEIC', text: '按入学成绩分级，定期模考', courseIds: ['toeic-basic', 'toeic-advanced'] },
    { icon: 'business_center', title: '商务英语', text: '每天5节一对一', courseIds: ['business'] },
    {
      icon: 'family_restroom', title: '亲子营', text: '家长和3岁以上孩子一起报名',
      courseIds: ['family-guardian', 'family-kindergarten', 'family-kid-1', 'family-kid-2'],
    },
  ],
  studyModes: [],
  courseDetailGuides: HELP_COURSE_DETAIL_GUIDES,
  scheduleColumns: [
    { code: 'MORNING', title: '上午', rows: HELP_SCHEDULE.slice(0, AFTERNOON_START) },
    { code: 'AFTERNOON', title: '下午和晚上', rows: HELP_SCHEDULE.slice(AFTERNOON_START) },
  ],
  initialCourseFees: initialPricing.courseFees,
  initialRoomFees: initialPricing.roomFees,
  initialRoomRateGroups: HELP_INITIAL_ROOM_RATE_GROUPS,
  showRoomCodes: false,
  dormRules: HELP_DORM_RULES,
  roomProfiles: HELP_ROOM_PROFILES,
  ieltsResults: [],
  studentReviews: [],
  reviewPath: '',
  holidayCalendars: [],
  ieltsComputerExamDates2027: [],
  studentCareServices: [],
  campusPracticalGuides: HELP_PRACTICAL_GUIDES,
  studentTracks: [],
  sidaReasons: CIA_SIDA_REASONS.map(reason => ({ ...reason, alt: brandHelp(reason.alt) })),
  sidaTrustBadges: CIA_SIDA_TRUST_BADGES,
  ctaBadges: HELP_FINAL_CTA_BADGES,
  ctaConsultants: CIA_CTA_CONSULTANTS,
  mobileAnchors: [
    { label: '视频', target: 'gallery', icon: 'smart_display' },
    { label: '概览', target: 'overview', icon: 'dashboard' },
    { label: '课程', target: 'courses', icon: 'menu_book' },
    { label: '住宿', target: 'rooms', icon: 'bed' },
    { label: '报价', target: 'quote', icon: 'calculate' },
    { label: 'FAQ', target: 'faq', icon: 'help' },
  ],
  faqs: () => HELP_FAQS.map(item => ({ ...item })),
  shows2026Prices: () => false,
  defaultContent: createDefaultHelpContentConfig,
  cloneContent: cloneHelpContentConfig,
};

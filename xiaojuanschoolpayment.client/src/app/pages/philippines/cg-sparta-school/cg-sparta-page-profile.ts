// CG Sparta content for the shared Philippine school page (school-page/ph-school-page.component.*).
// Text and data come from cg-sparta-page-content.ts; prices and rules from cg-sparta-content-config.ts.
// Nothing here is shared with the CG Banilad page. Keep it pure data (no Angular, DOM or storage).
import { createCiaQuotePricing } from '../cia-school/cia-quote-engine';
import {
  CIA_CTA_CONSULTANTS,
  CIA_GALLERY_CATEGORIES,
  CIA_PAGE_COPY,
  CIA_SIDA_REASONS,
  CIA_SIDA_TRUST_BADGES,
  type CiaShortVideo,
  type RoomRateGroup,
} from '../cia-school/cia-page-content';
import type { PhPageCopy, PhSchoolProfile, PhVideoItem, PhVideoTab } from '../school-page/ph-school-profile';
import { cloneCgSpartaContentConfig, createDefaultCgSpartaContentConfig } from './cg-sparta-content-config';
import {
  CG_SPARTA_ALBUM_DESCRIPTIONS,
  CG_SPARTA_BASIC_INFO,
  CG_SPARTA_CAMPUS_AREAS,
  CG_SPARTA_COURSE_DETAIL_GUIDES,
  CG_SPARTA_DORM_RULES,
  CG_SPARTA_FAQS,
  CG_SPARTA_FINAL_CTA_BADGES,
  CG_SPARTA_GALLERY_IMAGES,
  CG_SPARTA_HOLIDAY_CALENDARS,
  CG_SPARTA_IELTS_RESULTS,
  CG_SPARTA_NOT_SUITABLE_FOR,
  CG_SPARTA_OVERVIEW_FACTS,
  CG_SPARTA_PAGE_TEXT,
  CG_SPARTA_PRACTICAL_GUIDES,
  CG_SPARTA_QUICK_INFO,
  CG_SPARTA_REFERENCE_NOTE,
  CG_SPARTA_REFUND_COPY,
  CG_SPARTA_REVIEWS_COPY,
  CG_SPARTA_ROOM_PROFILES,
  CG_SPARTA_SCHEDULE,
  CG_SPARTA_SUITABLE_FOR,
  CG_SPARTA_VIDEOS,
  cgSpartaVideoPoster,
  cgSpartaVideoSrc,
  type CgSpartaVideo,
} from './cg-sparta-page-content';

const defaults = createDefaultCgSpartaContentConfig();
const initialPricing = createCiaQuotePricing(defaults);
const AFTERNOON_START = CG_SPARTA_SCHEDULE.findIndex(row => row.time.startsWith('12:25'));
const brandCg = (text: string) => text.replace(/CIA/g, 'CG斯巴达校区');

const CG_SPARTA_COPY: PhPageCopy = {
  swipeHint: CIA_PAGE_COPY.swipeHint,
  referenceNote: CG_SPARTA_REFERENCE_NOTE,
  hero: {
    breadcrumb: '菲律宾游学 / 宿务学校 / CG斯巴达校区',
    title: '菲律宾宿务 CG Academy 斯巴达校区',
    lead: CG_SPARTA_PAGE_TEXT.heroLead,
    tags: [
      { icon: 'rule', text: '全斯巴达管理' },
      { icon: 'record_voice_over', text: '平日全英语' },
      { icon: 'workspace_premium', text: '雅思保分班' },
      { icon: 'pool', text: '校内游泳池' },
    ],
    quoteLabel: '获取本校区最新报价',
  },
  overview: { title: '30 秒看懂 CG斯巴达校区' },
  advisorReview: {
    title: '顾问怎么看 CG斯巴达校区',
    text: CG_SPARTA_PAGE_TEXT.advisorText,
    suitableTitle: '适合谁',
    notSuitableTitle: '报名前想清楚',
  },
  license: {
    title: '学校资质',
    items: ['宿务语言学校协会（CALA）成员', '菲律宾TESDA和SEC注册', '菲律宾移民局SSP认证，可为学生办理学习许可'],
    note: '',
  },
  campus: {
    eyebrow: 'CAMPUS AT A GLANCE',
    title: 'CG斯巴达校区校园介绍',
    intro: CG_SPARTA_PAGE_TEXT.campusIntro,
  },
  gallery: {
    title: '按区域查看 CG斯巴达校区环境',
    intro: CG_SPARTA_PAGE_TEXT.galleryIntro,
    photoNote: CIA_PAGE_COPY.gallery.photoNote,
    roomComparisonTitle: '房型对比',
    roomDisclaimer: CG_SPARTA_REFERENCE_NOTE,
  },
  courses: {
    title: 'CG斯巴达校区课程怎么选？',
    intro: CG_SPARTA_PAGE_TEXT.coursesIntro,
    priceUnit: '/4周',
    fitLabel: '适合人群',
    noteLabel: '课程说明',
    detailSummaryTitle: '查看课程细节与每日作息',
    detailSummaryHint: '雅思保分班、雅思强化、短期冲刺、单词测试、分级和换课',
    guideTitle: '报名前值得确认的课程细节',
  },
  schedule: {
    eyebrow: 'DAILY TIMETABLE',
    title: 'CG斯巴达校区每日作息（周一至周四）',
    intro: '每节课45分钟；每天正课8节，按所选课程和分班安排，周五17:00毕业典礼后可外出。',
    badge: '每天学到22:00',
  },
  planning: {
    summaryTitle: '2027年学校假期',
    summaryHint: '菲律宾公众假期停课，不补课',
  },
  calendar: {
    eyebrow: 'ACADEMIC CALENDAR',
    title: 'CG斯巴达校区2027年假期',
    intro: '公众假期不上课，也不补课；用于规划入学日期和周数。',
    peakEyebrow: '',
    peakTitle: '',
    peakIntro: '',
    peakNote: '',
  },
  videos: {
    eyebrow: 'SCHOOL VIDEOS',
    title: '用视频了解 CG斯巴达校区',
    intro: '校园、学员访谈和学员日常的实拍视频。',
    badge: 'CG 学校视频',
    lifeTitle: '校园短片',
  },
  rooms: {
    photoTitle: '房型实景',
    photoIntro: CG_SPARTA_PAGE_TEXT.roomsPhotoIntro,
    rulesTitle: '短期费率、入住退房与宿舍规定',
    rulesHint: '1–3周费率、入住退房、加住、外出、门禁与扣分',
    dormRulesTitle: '外出、门禁与宿舍规定',
  },
  quote: {
    ...CIA_PAGE_COPY.quote,
    compareShortcuts: [
      { focus: 'room', label: '比房型', hint: '如单人间、双人间和四人间' },
      { focus: 'course', label: '比同类课程', hint: '如斯巴达和高阶斯巴达' },
      { focus: 'weeks', label: '比周数', hint: '如4周、8周、12周' },
    ],
  },
  fees: CIA_PAGE_COPY.fees,
  refund: CG_SPARTA_REFUND_COPY,
  reviews: CG_SPARTA_REVIEWS_COPY,
  practicalGuide: {
    summaryTitle: '到校须知与学校服务',
    summaryHint: '第一天安排、用餐与开放时间、打扫洗衣、学校活动、出发前准备',
    intro: '出发前和到校后最常问到的安排。',
  },
  sida: {
    ...CIA_PAGE_COPY.sida,
    title: brandCg(CIA_PAGE_COPY.sida.title),
    photoAlt: brandCg(CIA_PAGE_COPY.sida.photoAlt),
    photoCaption: brandCg(CIA_PAGE_COPY.sida.photoCaption),
  },
  faq: CIA_PAGE_COPY.faq,
  finalCta: {
    title: CG_SPARTA_PAGE_TEXT.finalCtaTitle,
    text: CG_SPARTA_PAGE_TEXT.finalCtaText,
    primaryLabel: '获取 CG斯巴达校区完整报价单',
    secondaryLabel: '咨询当前空房',
  },
};

const CG_SPARTA_INITIAL_ROOM_RATE_GROUPS: RoomRateGroup[] = [...new Set(defaults.rooms.map(room => room.group))].map(title => ({
  title,
  rooms: defaults.rooms
    .filter(room => room.enabled && room.group === title)
    .map(room => ({ id: room.id, label: room.label, code: room.code, location: room.location })),
}));

const albumVideo = (item: CgSpartaVideo): PhVideoItem => ({
  title: item.title,
  text: item.description,
  src: cgSpartaVideoSrc(item),
  poster: cgSpartaVideoPoster(item),
  duration: item.duration,
  shape: item.orientation === 'landscape' ? 'wide' : 'tall',
});
const shortVideo = (item: CgSpartaVideo): CiaShortVideo => ({
  title: item.title,
  text: item.description,
  src: cgSpartaVideoSrc(item),
  poster: cgSpartaVideoPoster(item),
  duration: item.duration,
  ...(item.orientation === 'landscape' ? { shape: 'wide' as const } : {}),
});

const CG_SPARTA_VIDEO_TOPICS: ReadonlyArray<CgSpartaVideo['topic']> = ['校园', '学员访谈', '学员日常'];
const CG_SPARTA_VIDEO_TABS: PhVideoTab[] = CG_SPARTA_VIDEO_TOPICS.map(topic => ({
  label: topic === '校园' ? '校园视频' : topic,
  icon: 'videocam',
  items: CG_SPARTA_VIDEOS.filter(item => item.topic === topic).map(albumVideo),
}));

export const CG_SPARTA_PAGE_PROFILE: PhSchoolProfile = {
  code: 'CG-SPARTA',
  name: 'CG斯巴达校区',
  previewPrefix: 'cg-sparta',
  pricingSchoolName: 'CG Academy',
  copy: CG_SPARTA_COPY,
  compactLayout: true,
  overviewFacts: CG_SPARTA_OVERVIEW_FACTS,
  videoTabs: CG_SPARTA_VIDEO_TABS,
  courseHighlights: {
    'ielts-guarantee': { badge: '只报12周，指定日期开课', icon: 'workspace_premium' },
    booster: { badge: '只报1–2周', icon: 'bolt' },
  },
  gallery: {
    categories: CIA_GALLERY_CATEGORIES,
    albumCategories: ['校园', '教室', '住宿', '餐厅', '设施'],
    images: CG_SPARTA_GALLERY_IMAGES,
    heroCategories: ['校园', '设施', '住宿'],
    albumDescriptions: CG_SPARTA_ALBUM_DESCRIPTIONS,
    uploadedPhotoTitle: 'CG斯巴达校区学校媒体',
    uploadedPhotoDescription: 'CG斯巴达校区学校实景内容',
    uploadedVideoTitle: 'CG斯巴达校区学校视频',
  },
  snapshotCards: CG_SPARTA_QUICK_INFO,
  basicInfo: CG_SPARTA_BASIC_INFO,
  suitableFor: CG_SPARTA_SUITABLE_FOR.map(title => ({ title, text: '' })),
  notSuitableFor: CG_SPARTA_NOT_SUITABLE_FOR.map(title => ({ title, text: '' })),
  campusBuildings: CG_SPARTA_CAMPUS_AREAS,
  videoCards: [],
  campusLifeVideos: CG_SPARTA_VIDEOS.map(shortVideo),
  interviewVideos: [],
  courseGroups: [
    { icon: 'rule', title: '斯巴达', text: '每天8节课加晚课和晚自习', courseIds: ['sparta', 'premier-sparta'] },
    { icon: 'workspace_premium', title: '雅思', text: '保分班、强化和基础', courseIds: ['ielts-guarantee', 'ielts-intensive', 'ielts-basic'] },
    { icon: 'fact_check', title: '托业', text: '每两周一次托业模考', courseIds: ['toeic-sparta', 'toeic-premier'] },
    { icon: 'business_center', title: '商务英语', text: '商务课加ESL', courseIds: ['business-english'] },
    { icon: 'bolt', title: '短期冲刺', text: '1–2周，每天8节一对一', courseIds: ['booster'] },
  ],
  studyModes: [],
  courseDetailGuides: CG_SPARTA_COURSE_DETAIL_GUIDES,
  scheduleColumns: [
    { code: 'MORNING', title: '上午', rows: CG_SPARTA_SCHEDULE.slice(0, AFTERNOON_START) },
    { code: 'AFTERNOON', title: '下午和晚上', rows: CG_SPARTA_SCHEDULE.slice(AFTERNOON_START) },
  ],
  initialCourseFees: initialPricing.courseFees,
  initialRoomFees: initialPricing.roomFees,
  initialRoomRateGroups: CG_SPARTA_INITIAL_ROOM_RATE_GROUPS,
  showRoomCodes: false,
  dormRules: CG_SPARTA_DORM_RULES,
  roomProfiles: CG_SPARTA_ROOM_PROFILES,
  ieltsResults: CG_SPARTA_IELTS_RESULTS,
  studentReviews: [],
  reviewPath: '',
  holidayCalendars: CG_SPARTA_HOLIDAY_CALENDARS,
  ieltsComputerExamDates2027: [],
  studentCareServices: [],
  campusPracticalGuides: CG_SPARTA_PRACTICAL_GUIDES,
  studentTracks: [],
  sidaReasons: CIA_SIDA_REASONS.map(reason => ({ ...reason, alt: brandCg(reason.alt) })),
  sidaTrustBadges: CIA_SIDA_TRUST_BADGES,
  ctaBadges: CG_SPARTA_FINAL_CTA_BADGES,
  ctaConsultants: CIA_CTA_CONSULTANTS,
  mobileAnchors: [
    { label: '视频', target: 'gallery', icon: 'smart_display' },
    { label: '概览', target: 'overview', icon: 'dashboard' },
    { label: '课程', target: 'courses', icon: 'menu_book' },
    { label: '住宿', target: 'rooms', icon: 'bed' },
    { label: '成绩', target: 'student-reviews', icon: 'workspace_premium' },
    { label: '报价', target: 'quote', icon: 'calculate' },
    { label: 'FAQ', target: 'faq', icon: 'help' },
  ],
  faqs: () => CG_SPARTA_FAQS.map(item => ({ ...item })),
  shows2026Prices: () => false,
  defaultContent: createDefaultCgSpartaContentConfig,
  cloneContent: cloneCgSpartaContentConfig,
};

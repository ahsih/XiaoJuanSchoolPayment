// CG Banilad content for the shared Philippine school page (school-page/ph-school-page.component.*).
// Text and data come from cg-banilad-page-content.ts; prices and rules from cg-banilad-content-config.ts.
// Nothing here is shared with the CG Sparta page. Keep it pure data (no Angular, DOM or storage).
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
import { cloneCgBaniladContentConfig, createDefaultCgBaniladContentConfig } from './cg-banilad-content-config';
import {
  CG_BANILAD_ALBUM_DESCRIPTIONS,
  CG_BANILAD_BASIC_INFO,
  CG_BANILAD_CAMPUS_AREAS,
  CG_BANILAD_COURSE_DETAIL_GUIDES,
  CG_BANILAD_DORM_RULES,
  CG_BANILAD_FAQS,
  CG_BANILAD_FINAL_CTA_BADGES,
  CG_BANILAD_GALLERY_IMAGES,
  CG_BANILAD_HOLIDAY_CALENDARS,
  CG_BANILAD_IELTS_RESULTS,
  CG_BANILAD_NOT_SUITABLE_FOR,
  CG_BANILAD_OVERVIEW_FACTS,
  CG_BANILAD_PAGE_TEXT,
  CG_BANILAD_PRACTICAL_GUIDES,
  CG_BANILAD_QUICK_INFO,
  CG_BANILAD_REFERENCE_NOTE,
  CG_BANILAD_REFUND_COPY,
  CG_BANILAD_REVIEWS_COPY,
  CG_BANILAD_ROOM_PROFILES,
  CG_BANILAD_SCHEDULE,
  CG_BANILAD_SUITABLE_FOR,
  CG_BANILAD_VIDEOS,
  cgBaniladVideoPoster,
  cgBaniladVideoSrc,
  type CgBaniladVideo,
} from './cg-banilad-page-content';

const defaults = createDefaultCgBaniladContentConfig();
const initialPricing = createCiaQuotePricing(defaults);
const AFTERNOON_START = CG_BANILAD_SCHEDULE.findIndex(row => row.time.startsWith('12:05'));
const brandCg = (text: string) => text.replace(/CIA/g, 'CG Banilad');

const CG_BANILAD_COPY: PhPageCopy = {
  swipeHint: CIA_PAGE_COPY.swipeHint,
  referenceNote: CG_BANILAD_REFERENCE_NOTE,
  hero: {
    breadcrumb: '菲律宾游学 / 宿务学校 / CG Banilad',
    title: '菲律宾宿务 CG Academy Banilad 校区',
    lead: CG_BANILAD_PAGE_TEXT.heroLead,
    tags: [
      { icon: 'location_on', text: '宿务市中心' },
      { icon: 'tune', text: '半斯巴达和一般课程' },
      { icon: 'groups', text: '小组课最多4人' },
      { icon: 'pool', text: '度假村风格校园' },
    ],
    quoteLabel: '获取本校区最新报价',
  },
  overview: { title: '30 秒看懂 CG Banilad' },
  advisorReview: {
    title: '顾问怎么看 CG Banilad',
    text: CG_BANILAD_PAGE_TEXT.advisorText,
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
    title: 'CG Banilad 校园介绍',
    intro: CG_BANILAD_PAGE_TEXT.campusIntro,
  },
  gallery: {
    title: '按区域查看 CG Banilad 环境',
    intro: CG_BANILAD_PAGE_TEXT.galleryIntro,
    photoNote: CIA_PAGE_COPY.gallery.photoNote,
    roomComparisonTitle: '房型对比',
    roomDisclaimer: CG_BANILAD_REFERENCE_NOTE,
  },
  courses: {
    title: 'CG Banilad 课程怎么选？',
    intro: CG_BANILAD_PAGE_TEXT.coursesIntro,
    priceUnit: '/4周',
    fitLabel: '适合人群',
    noteLabel: '课程说明',
    detailSummaryTitle: '查看课程细节与每日作息',
    detailSummaryHint: '半斯巴达管理、短期冲刺、亲子课程、分级和换课',
    guideTitle: '报名前值得确认的课程细节',
  },
  schedule: {
    eyebrow: 'DAILY TIMETABLE',
    title: 'CG Banilad 每日作息（周一至周五）',
    intro: '每节课45分钟；每天上几节、哪几节是空堂，按所选课程和分班安排。',
    badge: '小组课最多4人',
  },
  planning: {
    summaryTitle: '2027年学校假期',
    summaryHint: '菲律宾公众假期停课，不补课',
  },
  calendar: {
    eyebrow: 'ACADEMIC CALENDAR',
    title: 'CG Banilad 2027年假期',
    intro: '公众假期不上课，也不补课；用于规划入学日期和周数。',
    peakEyebrow: '',
    peakTitle: '',
    peakIntro: '',
    peakNote: '',
  },
  videos: {
    eyebrow: 'SCHOOL VIDEOS',
    title: '用视频了解 CG Banilad',
    intro: '校园、学员访谈和学员日常的实拍视频。',
    badge: 'CG 学校视频',
    lifeTitle: '校园短片',
  },
  rooms: {
    photoTitle: '房型实景',
    photoIntro: CG_BANILAD_PAGE_TEXT.roomsPhotoIntro,
    rulesTitle: '短期费率、入住退房与宿舍规定',
    rulesHint: '1–3周费率、入住退房、加住、外出与门禁',
    dormRulesTitle: '外出、门禁与宿舍规定',
  },
  quote: {
    ...CIA_PAGE_COPY.quote,
    compareShortcuts: [
      { focus: 'room', label: '比房型', hint: '如单人间、双人间和四人间' },
      { focus: 'course', label: '比同类课程', hint: '如一般ESL和强化ESL' },
      { focus: 'weeks', label: '比周数', hint: '如4周、8周、12周' },
    ],
  },
  fees: CIA_PAGE_COPY.fees,
  refund: CG_BANILAD_REFUND_COPY,
  reviews: CG_BANILAD_REVIEWS_COPY,
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
    title: CG_BANILAD_PAGE_TEXT.finalCtaTitle,
    text: CG_BANILAD_PAGE_TEXT.finalCtaText,
    primaryLabel: '获取 CG Banilad 完整报价单',
    secondaryLabel: '咨询当前空房',
  },
};

const CG_BANILAD_INITIAL_ROOM_RATE_GROUPS: RoomRateGroup[] = [...new Set(defaults.rooms.map(room => room.group))].map(title => ({
  title,
  rooms: defaults.rooms
    .filter(room => room.enabled && room.group === title)
    .map(room => ({ id: room.id, label: room.label, code: room.code, location: room.location })),
}));

const albumVideo = (item: CgBaniladVideo): PhVideoItem => ({
  title: item.title,
  text: item.description,
  src: cgBaniladVideoSrc(item),
  poster: cgBaniladVideoPoster(item),
  duration: item.duration,
  shape: item.orientation === 'landscape' ? 'wide' : 'tall',
});
const shortVideo = (item: CgBaniladVideo): CiaShortVideo => ({
  title: item.title,
  text: item.description,
  src: cgBaniladVideoSrc(item),
  poster: cgBaniladVideoPoster(item),
  duration: item.duration,
  ...(item.orientation === 'landscape' ? { shape: 'wide' as const } : {}),
});

const CG_BANILAD_VIDEO_TOPICS: ReadonlyArray<CgBaniladVideo['topic']> = ['校园', '学员访谈', '学员日常'];
const CG_BANILAD_VIDEO_TABS: PhVideoTab[] = CG_BANILAD_VIDEO_TOPICS.map(topic => ({
  label: topic === '校园' ? '校园视频' : topic,
  icon: 'videocam',
  items: CG_BANILAD_VIDEOS.filter(item => item.topic === topic).map(albumVideo),
}));

export const CG_BANILAD_PAGE_PROFILE: PhSchoolProfile = {
  code: 'CG-BANILAD',
  name: 'CG Banilad',
  previewPrefix: 'cg-banilad',
  pricingSchoolName: 'CG Academy',
  copy: CG_BANILAD_COPY,
  compactLayout: true,
  overviewFacts: CG_BANILAD_OVERVIEW_FACTS,
  videoTabs: CG_BANILAD_VIDEO_TABS,
  courseHighlights: {
    booster: { badge: '只报1–2周', icon: 'bolt' },
  },
  gallery: {
    categories: CIA_GALLERY_CATEGORIES,
    albumCategories: ['校园', '教室', '住宿', '餐厅', '设施'],
    images: CG_BANILAD_GALLERY_IMAGES,
    heroCategories: ['校园', '设施', '住宿'],
    albumDescriptions: CG_BANILAD_ALBUM_DESCRIPTIONS,
    uploadedPhotoTitle: 'CG Banilad 学校媒体',
    uploadedPhotoDescription: 'CG Banilad 学校实景内容',
    uploadedVideoTitle: 'CG Banilad 学校视频',
  },
  snapshotCards: CG_BANILAD_QUICK_INFO,
  basicInfo: CG_BANILAD_BASIC_INFO,
  suitableFor: CG_BANILAD_SUITABLE_FOR.map(title => ({ title, text: '' })),
  notSuitableFor: CG_BANILAD_NOT_SUITABLE_FOR.map(title => ({ title, text: '' })),
  campusBuildings: CG_BANILAD_CAMPUS_AREAS,
  videoCards: [],
  campusLifeVideos: CG_BANILAD_VIDEOS.map(shortVideo),
  interviewVideos: [],
  courseGroups: [
    { icon: 'forum', title: '综合英语 ESL', text: '按一对一和小组课比例选', courseIds: ['light-esl', 'general-esl', 'intensive-esl', 'power-esl'] },
    { icon: 'rule', title: '半斯巴达', text: '每天8节课，单词测试和作文', courseIds: ['semi-sparta', 'premier-semi-sparta'] },
    { icon: 'workspace_premium', title: '雅思和托业', text: '考试课加ESL，半斯巴达管理', courseIds: ['ielts-basic', 'toeic'] },
    { icon: 'business_center', title: '商务英语', text: '商务课加ESL', courseIds: ['business'] },
    { icon: 'bolt', title: '短期冲刺', text: '1–2周，每天8节一对一', courseIds: ['booster'] },
    { icon: 'family_restroom', title: '亲子课程', text: '家长陪同的小学到高中学生', courseIds: ['junior', 'guardian'] },
  ],
  studyModes: [],
  courseDetailGuides: CG_BANILAD_COURSE_DETAIL_GUIDES,
  scheduleColumns: [
    { code: 'MORNING', title: '上午', rows: CG_BANILAD_SCHEDULE.slice(0, AFTERNOON_START) },
    { code: 'AFTERNOON', title: '下午和晚上', rows: CG_BANILAD_SCHEDULE.slice(AFTERNOON_START) },
  ],
  initialCourseFees: initialPricing.courseFees,
  initialRoomFees: initialPricing.roomFees,
  initialRoomRateGroups: CG_BANILAD_INITIAL_ROOM_RATE_GROUPS,
  showRoomCodes: false,
  dormRules: CG_BANILAD_DORM_RULES,
  roomProfiles: CG_BANILAD_ROOM_PROFILES,
  ieltsResults: CG_BANILAD_IELTS_RESULTS,
  studentReviews: [],
  reviewPath: '',
  holidayCalendars: CG_BANILAD_HOLIDAY_CALENDARS,
  ieltsComputerExamDates2027: [],
  studentCareServices: [],
  campusPracticalGuides: CG_BANILAD_PRACTICAL_GUIDES,
  studentTracks: [],
  sidaReasons: CIA_SIDA_REASONS.map(reason => ({ ...reason, alt: brandCg(reason.alt) })),
  sidaTrustBadges: CIA_SIDA_TRUST_BADGES,
  ctaBadges: CG_BANILAD_FINAL_CTA_BADGES,
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
  faqs: () => CG_BANILAD_FAQS.map(item => ({ ...item })),
  shows2026Prices: () => false,
  defaultContent: createDefaultCgBaniladContentConfig,
  cloneContent: cloneCgBaniladContentConfig,
};

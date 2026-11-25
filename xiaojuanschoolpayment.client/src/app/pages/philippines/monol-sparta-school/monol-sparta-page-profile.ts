// MONOL Sparta content for the shared Philippine school page (school-page/ph-school-page.component.*).
// Text and data come from monol-sparta-page-content.ts; prices and rules from monol-sparta-content-config.ts.
// Keep it pure data (no Angular, DOM or storage), like the modules it reads.
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
import { cloneMonolSpartaContentConfig, createDefaultMonolSpartaContentConfig } from './monol-sparta-content-config';
import {
  MONOL_SPARTA_ALBUM_DESCRIPTIONS,
  MONOL_SPARTA_BASIC_INFO,
  MONOL_SPARTA_COURSE_DETAIL_GUIDES,
  MONOL_SPARTA_DORM_RULES,
  MONOL_SPARTA_FAQS,
  MONOL_SPARTA_FINAL_CTA_BADGES,
  MONOL_SPARTA_FLOORS,
  MONOL_SPARTA_GALLERY_IMAGES,
  MONOL_SPARTA_NOT_SUITABLE_FOR,
  MONOL_SPARTA_OVERVIEW_FACTS,
  MONOL_SPARTA_PAGE_TEXT,
  MONOL_SPARTA_PRACTICAL_GUIDES,
  MONOL_SPARTA_QUICK_INFO,
  MONOL_SPARTA_REFERENCE_NOTE,
  MONOL_SPARTA_REFUND_COPY,
  MONOL_SPARTA_ROOM_PROFILES,
  MONOL_SPARTA_SCHEDULE,
  MONOL_SPARTA_SUITABLE_FOR,
  MONOL_SPARTA_VIDEOS,
  monolSpartaVideoPoster,
  monolSpartaVideoSrc,
  type MonolSpartaVideo,
} from './monol-sparta-page-content';

const defaults = createDefaultMonolSpartaContentConfig();
const AFTERNOON_START = MONOL_SPARTA_SCHEDULE.findIndex(row => row.time.startsWith('13:30'));
const initialPricing = createCiaQuotePricing(defaults);
const brandMonol = (text: string) => text.replace(/CIA/g, 'MONOL斯巴达校区');

const MONOL_SPARTA_COPY: PhPageCopy = {
  swipeHint: CIA_PAGE_COPY.swipeHint,
  referenceNote: MONOL_SPARTA_REFERENCE_NOTE,
  hero: {
    breadcrumb: '菲律宾游学 / 碧瑶学校 / MONOL斯巴达校区',
    title: '菲律宾碧瑶 MONOL 斯巴达校区',
    lead: MONOL_SPARTA_PAGE_TEXT.heroLead,
    tags: [
      { icon: 'terrain', text: '碧瑶' },
      { icon: 'lock_clock', text: '全斯巴达' },
      { icon: 'menu_book', text: '每天10节' },
      { icon: 'quiz', text: '雅思每天模考' },
    ],
    quoteLabel: '获取 MONOL 斯巴达最新报价',
  },
  overview: { title: '30 秒看懂 MONOL 斯巴达校区' },
  advisorReview: {
    title: '顾问怎么看 MONOL 斯巴达校区',
    text: MONOL_SPARTA_PAGE_TEXT.advisorText,
    suitableTitle: '适合谁',
    notSuitableTitle: '报名前想清楚',
  },
  campus: {
    eyebrow: 'CAMPUS AT A GLANCE',
    title: 'MONOL 斯巴达校区校园介绍',
    intro: MONOL_SPARTA_PAGE_TEXT.campusIntro,
  },
  gallery: {
    title: '按区域查看 MONOL 斯巴达校区环境',
    intro: MONOL_SPARTA_PAGE_TEXT.galleryIntro,
    photoNote: CIA_PAGE_COPY.gallery.photoNote,
    roomComparisonTitle: '房型对比',
    roomDisclaimer: MONOL_SPARTA_REFERENCE_NOTE,
  },
  courses: {
    title: 'MONOL 斯巴达校区课程怎么选？',
    intro: MONOL_SPARTA_PAGE_TEXT.coursesIntro,
    priceUnit: '/4周',
    fitLabel: '适合人群',
    noteLabel: '课程说明',
    detailSummaryTitle: '查看课程细节与每日作息',
    detailSummaryHint: '每天上什么、迟到缺课补自习、分班跳级和上课天数',
    guideTitle: '报名前值得确认的课程细节',
  },
  schedule: {
    eyebrow: 'DAILY TIMETABLE',
    title: 'MONOL 斯巴达校区每日作息（周一至周五）',
    intro: 'Booster ESL 的课表示例，每节课45分钟；Master IELTS 的团体课和模考时段按学校课表安排。',
    badge: '每天10节',
  },
  videos: {
    eyebrow: 'SCHOOL VIDEOS',
    title: '用视频了解 MONOL 斯巴达校区',
    intro: '校园、课堂、宿舍和餐厅的实拍视频，还有老师访谈。',
    badge: 'MONOL 学校视频',
    lifeTitle: '校园短片',
  },
  rooms: {
    photoTitle: '房型实景',
    photoIntro: MONOL_SPARTA_PAGE_TEXT.roomsPhotoIntro,
    rulesTitle: '入住离校、外出与宿舍规定',
    rulesHint: '入住离校、外出时间、访客、吸烟和退学规定',
    dormRulesTitle: '生活与宿舍规定',
  },
  quote: {
    ...CIA_PAGE_COPY.quote,
    compareShortcuts: [
      { focus: 'room', label: '比房型', hint: '如三人间、双人间和单人间' },
      { focus: 'course', label: '比课程', hint: 'Booster ESL 和 Master IELTS' },
      { focus: 'weeks', label: '比周数', hint: '如4周、8周、12周' },
    ],
  },
  fees: CIA_PAGE_COPY.fees,
  refund: MONOL_SPARTA_REFUND_COPY,
  practicalGuide: {
    summaryTitle: '到校须知与学校服务',
    summaryHint: '用餐与外出时间、学校物品、学校周边、出发前准备',
    intro: '出发前和到校后最常问到的安排。',
  },
  sida: {
    ...CIA_PAGE_COPY.sida,
    title: brandMonol(CIA_PAGE_COPY.sida.title),
    photoAlt: brandMonol(CIA_PAGE_COPY.sida.photoAlt),
    photoCaption: brandMonol(CIA_PAGE_COPY.sida.photoCaption),
  },
  faq: CIA_PAGE_COPY.faq,
  finalCta: {
    title: MONOL_SPARTA_PAGE_TEXT.finalCtaTitle,
    text: MONOL_SPARTA_PAGE_TEXT.finalCtaText,
    primaryLabel: '获取 MONOL 斯巴达校区完整报价单',
    secondaryLabel: '咨询当前空房',
  },
};

const MONOL_SPARTA_INITIAL_ROOM_RATE_GROUPS: RoomRateGroup[] = [...new Set(defaults.rooms.map(room => room.group))].map(title => ({
  title,
  rooms: defaults.rooms
    .filter(room => room.enabled && room.group === title)
    .map(room => ({ id: room.id, label: room.label, code: room.code, location: room.location })),
}));

const video = (name: string): MonolSpartaVideo => MONOL_SPARTA_VIDEOS.find(item => item.name === name) as MonolSpartaVideo;
const albumVideo = (name: string): PhVideoItem => {
  const item = video(name);
  return {
    title: item.title,
    text: item.description,
    src: monolSpartaVideoSrc(item),
    poster: monolSpartaVideoPoster(item),
    duration: item.duration,
    shape: item.orientation === 'landscape' ? 'wide' : 'tall',
  };
};
const shortVideo = (item: MonolSpartaVideo): CiaShortVideo => ({
  title: item.title,
  text: item.description,
  src: monolSpartaVideoSrc(item),
  poster: monolSpartaVideoPoster(item),
  duration: item.duration,
  ...(item.orientation === 'landscape' ? { shape: 'wide' as const } : {}),
});

const MONOL_SPARTA_VIDEO_TOPICS: ReadonlyArray<MonolSpartaVideo['topic']> = ['校园', '课堂', '宿舍', '餐厅', '访谈'];
const MONOL_SPARTA_VIDEO_TABS: PhVideoTab[] = MONOL_SPARTA_VIDEO_TOPICS.map(topic => ({
  label: `${topic}视频`,
  icon: 'videocam',
  items: MONOL_SPARTA_VIDEOS.filter(item => item.topic === topic).map(item => albumVideo(item.name)),
}));

export const MONOL_SPARTA_PAGE_PROFILE: PhSchoolProfile = {
  code: 'MONOL-SPARTA',
  name: 'MONOL斯巴达校区',
  previewPrefix: 'monol-sparta',
  pricingSchoolName: '菲律宾碧瑶MONOL斯巴达校区',
  copy: MONOL_SPARTA_COPY,
  compactLayout: true,
  overviewFacts: MONOL_SPARTA_OVERVIEW_FACTS,
  videoTabs: MONOL_SPARTA_VIDEO_TABS,
  courseHighlights: {
    'master-ielts': { badge: '每天雅思模考' },
  },
  roomVideos: {
    'premium-single': albumVideo('premium-single-room-tour'),
    'standard-single': albumVideo('standard-single-room-tour'),
    'semi-single': albumVideo('semi-single-room-tour'),
    double: albumVideo('double-room-tour'),
    triple: albumVideo('triple-room-tour-01'),
  },
  gallery: {
    categories: CIA_GALLERY_CATEGORIES,
    albumCategories: ['校园', '教室', '住宿', '餐厅', '设施'],
    images: MONOL_SPARTA_GALLERY_IMAGES,
    heroCategories: ['校园', '住宿', '餐厅'],
    albumDescriptions: MONOL_SPARTA_ALBUM_DESCRIPTIONS,
    uploadedPhotoTitle: 'MONOL斯巴达校区学校媒体',
    uploadedPhotoDescription: 'MONOL斯巴达校区实景内容',
    uploadedVideoTitle: 'MONOL斯巴达校区学校视频',
  },
  snapshotCards: MONOL_SPARTA_QUICK_INFO,
  basicInfo: MONOL_SPARTA_BASIC_INFO,
  suitableFor: MONOL_SPARTA_SUITABLE_FOR.map(title => ({ title, text: '' })),
  notSuitableFor: MONOL_SPARTA_NOT_SUITABLE_FOR.map(title => ({ title, text: '' })),
  campusBuildings: MONOL_SPARTA_FLOORS,
  videoCards: [],
  campusLifeVideos: MONOL_SPARTA_VIDEOS.map(shortVideo),
  interviewVideos: [],
  courseGroups: [
    { icon: 'bolt', title: '综合英语 ESL', text: '每天6节一对一，听说读写一起练', courseIds: ['booster-esl'] },
    { icon: 'workspace_premium', title: '雅思 IELTS', text: '每天5节一对一加雅思模考', courseIds: ['master-ielts'] },
  ],
  studyModes: [],
  courseDetailGuides: MONOL_SPARTA_COURSE_DETAIL_GUIDES,
  scheduleColumns: [
    { code: 'MORNING', title: '上午', rows: MONOL_SPARTA_SCHEDULE.slice(0, AFTERNOON_START) },
    { code: 'AFTERNOON', title: '下午和晚上', rows: MONOL_SPARTA_SCHEDULE.slice(AFTERNOON_START) },
  ],
  initialCourseFees: initialPricing.courseFees,
  initialRoomFees: initialPricing.roomFees,
  initialRoomRateGroups: MONOL_SPARTA_INITIAL_ROOM_RATE_GROUPS,
  roomGroupNotes: {},
  showRoomCodes: false,
  dormRules: MONOL_SPARTA_DORM_RULES,
  roomProfiles: MONOL_SPARTA_ROOM_PROFILES,
  ieltsResults: [],
  studentReviews: [],
  reviewPath: '',
  holidayCalendars: [],
  ieltsComputerExamDates2027: [],
  studentCareServices: [],
  campusPracticalGuides: MONOL_SPARTA_PRACTICAL_GUIDES,
  studentTracks: [],
  sidaReasons: CIA_SIDA_REASONS.map(reason => ({ ...reason, alt: brandMonol(reason.alt) })),
  sidaTrustBadges: CIA_SIDA_TRUST_BADGES,
  ctaBadges: MONOL_SPARTA_FINAL_CTA_BADGES,
  ctaConsultants: CIA_CTA_CONSULTANTS,
  mobileAnchors: [
    { label: '视频', target: 'gallery', icon: 'smart_display' },
    { label: '概览', target: 'overview', icon: 'dashboard' },
    { label: '课程', target: 'courses', icon: 'menu_book' },
    { label: '住宿', target: 'rooms', icon: 'bed' },
    { label: '报价', target: 'quote', icon: 'calculate' },
    { label: 'FAQ', target: 'faq', icon: 'help' },
  ],
  faqs: () => MONOL_SPARTA_FAQS.map(item => ({ ...item })),
  shows2026Prices: () => false,
  defaultContent: createDefaultMonolSpartaContentConfig,
  cloneContent: cloneMonolSpartaContentConfig,
};

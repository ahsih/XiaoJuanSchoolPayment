// Cebu Blue Ocean Academy (蓝海CBOA) content for the shared Philippine school page (school-page/ph-school-page.component.*).
// Text and data come from cboa-page-content.ts; prices and rules from cboa-content-config.ts.
// Keep it pure data (no Angular, DOM or storage), like the modules it reads.
import { createCiaQuotePricing } from '../cia-school/cia-quote-engine';
import {
  CIA_CTA_CONSULTANTS,
  CIA_GALLERY_CATEGORIES,
  CIA_PAGE_COPY,
  CIA_SIDA_REASONS,
  CIA_SIDA_TRUST_BADGES,
  type CiaVideoCard,
  type RoomRateGroup,
} from '../cia-school/cia-page-content';
import type { PhPageCopy, PhSchoolProfile, PhVideoItem, PhVideoTab } from '../school-page/ph-school-profile';
import {
  CBOA_FAMILY_COURSE_IDS,
  CBOA_PRICE_SWITCH,
  CBOA_SENIOR_COURSE_ID,
  CBOA_SURVIVAL_COURSE_ID,
  cloneBlueOceanContentConfig,
  createDefaultBlueOceanContentConfig,
} from './cboa-content-config';
import {
  CBOA_ALBUM_DESCRIPTIONS,
  CBOA_BASIC_INFO,
  CBOA_CAMPUS_BUILDINGS,
  CBOA_COURSE_DETAIL_GUIDES,
  CBOA_FAQS,
  CBOA_FINAL_CTA_BADGES,
  CBOA_GALLERY_IMAGES,
  CBOA_NOT_SUITABLE_FOR,
  CBOA_OVERVIEW_FACTS,
  CBOA_PAGE_TEXT,
  CBOA_PRACTICAL_GUIDES,
  CBOA_QUICK_INFO,
  CBOA_REFERENCE_NOTE,
  CBOA_REFUND_COPY,
  CBOA_ROOM_PROFILES,
  CBOA_SUITABLE_FOR,
  CBOA_VIDEOS,
  cboaVideoPoster,
  cboaVideoSrc,
  type CboaVideo,
} from './cboa-page-content';

/** Database school names, the current one first (DataInitialize.CebuBlueOceanSchoolName). */
export const CBOA_SCHOOL_NAMES = ['菲律宾宿务Cebu Blue Ocean Academy', 'Cebu Blue Ocean Academy'];
export const CBOA_SHORT_NAME = '蓝海CBOA';

const defaults = createDefaultBlueOceanContentConfig();
const initialPricing = createCiaQuotePricing(defaults);
const brand = (text: string) => text.replace(/CIA/g, CBOA_SHORT_NAME);

/** Whether the course list still shows the other price year (until the 2027 prices take over on 2027/02/01). */
export function cboaShows2026Prices(today = new Date()): boolean {
  const local = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  return local < CBOA_PRICE_SWITCH;
}

const CBOA_COPY: PhPageCopy = {
  swipeHint: CIA_PAGE_COPY.swipeHint,
  referenceNote: CBOA_REFERENCE_NOTE,
  hero: {
    breadcrumb: '菲律宾游学 / 宿务学校 / 蓝海CBOA',
    title: '菲律宾宿务蓝海语言学校 CBOA',
    lead: CBOA_PAGE_TEXT.heroLead,
    tags: [
      { icon: 'beach_access', text: '宿务麦克坦岛海边' },
      { icon: 'menu_book', text: 'PINES课程体系' },
      { icon: 'apartment', text: 'Ocean Suites单人公寓' },
      { icon: 'elderly', text: '40岁以上课程' },
    ],
    quoteLabel: '获取蓝海CBOA最新报价',
  },
  overview: { title: '30 秒看懂蓝海CBOA' },
  advisorReview: {
    title: '顾问怎么看蓝海CBOA',
    text: CBOA_PAGE_TEXT.advisorText,
    suitableTitle: '适合谁',
    notSuitableTitle: '报名前想清楚',
  },
  campus: {
    eyebrow: 'CAMPUS AT A GLANCE',
    title: '蓝海CBOA 校区与住宿',
    intro: CBOA_PAGE_TEXT.campusIntro,
  },
  gallery: {
    title: '按区域查看蓝海CBOA',
    intro: CBOA_PAGE_TEXT.galleryIntro,
    photoNote: CIA_PAGE_COPY.gallery.photoNote,
    roomComparisonTitle: '房型对比',
    roomDisclaimer: CBOA_REFERENCE_NOTE,
  },
  courses: {
    title: '蓝海CBOA 课程怎么选？',
    intro: CBOA_PAGE_TEXT.coursesIntro,
    priceUnit: '/4周',
    oldPriceLabel: `${CBOA_PRICE_SWITCH.replace(/-/g, '/')}起报名`,
    fitLabel: '适合人群',
    noteLabel: '课程内容',
    detailSummaryTitle: '查看课程细节',
    detailSummaryHint: '家庭课程、40岁以上课程、生存ESL和报名年龄',
    guideTitle: '报名前值得确认的课程细节',
  },
  planning: {
    summaryTitle: '暑期旺季',
    summaryHint: '旺季附加费档期与收费方式',
  },
  calendar: {
    eyebrow: 'PEAK SEASON',
    title: '蓝海CBOA 暑期旺季附加费',
    intro: '2027年暑期旺季（06/27–08/21）每周加收60美元附加费；学校假期以蓝海CBOA当期通知为准。',
    peakEyebrow: 'PEAK SEASON',
    peakTitle: '暑期旺季',
    peakIntro: '课程或住宿计划碰到以下学习周时，每名学生按实际重叠周数计收旺季附加费，每周60美元。',
    peakNote: '入学按周日、离校按周六；课程与住宿在同一周重叠只计一次，旺季附加费不参与任何优惠。',
  },
  videos: {
    eyebrow: 'SCHOOL VIDEOS',
    title: '用视频了解蓝海CBOA',
    intro: '蓝海CBOA官方视频：校园导览、机场接机、教材和课堂、老师和学员访谈，以及宿舍实拍。',
    badge: '蓝海CBOA 官方视频',
  },
  rooms: {
    photoTitle: '房型实景',
    photoIntro: CBOA_PAGE_TEXT.roomsPhotoIntro,
    rulesTitle: '短期费率与入住离校',
    rulesHint: '1–3周住宿费比例、入住离校时间、额外住宿费',
  },
  quote: {
    ...CIA_PAGE_COPY.quote,
    compareShortcuts: [
      { focus: 'room', label: '比房型', hint: '如EGI宿舍和Ocean Suites单人间' },
      { focus: 'course', label: '比同类课程', hint: '如基础ESL、强化口语和进阶ESL' },
      { focus: 'weeks', label: '比周数', hint: '如4周、8周、12周' },
    ],
  },
  fees: CIA_PAGE_COPY.fees,
  refund: CBOA_REFUND_COPY,
  practicalGuide: {
    summaryTitle: 'Ocean Suites生活与到校须知',
    summaryHint: '早餐、校车时间、设施开放时间、入住与接送机、其他收费',
    intro: '出发前和到校后最常问到的安排。',
  },
  sida: {
    ...CIA_PAGE_COPY.sida,
    title: brand(CIA_PAGE_COPY.sida.title),
    photoAlt: brand(CIA_PAGE_COPY.sida.photoAlt),
    photoCaption: brand(CIA_PAGE_COPY.sida.photoCaption),
  },
  faq: CIA_PAGE_COPY.faq,
  finalCta: {
    title: CBOA_PAGE_TEXT.finalCtaTitle,
    text: CBOA_PAGE_TEXT.finalCtaText,
    primaryLabel: '获取蓝海CBOA完整报价单',
    secondaryLabel: '咨询当前空房',
  },
};

const CBOA_INITIAL_ROOM_RATE_GROUPS: RoomRateGroup[] = [...new Set(defaults.rooms.map(room => room.group))].map(title => ({
  title,
  rooms: defaults.rooms
    .filter(room => room.enabled && room.group === title)
    .map(room => ({ id: room.id, label: room.label, code: room.code, location: room.location })),
}));

const video = (name: string): CboaVideo => CBOA_VIDEOS.find(item => item.name === name) as CboaVideo;
const albumVideo = (name: string): PhVideoItem => {
  const item = video(name);
  return { title: item.title, text: item.description, src: cboaVideoSrc(item), poster: cboaVideoPoster(item), duration: item.duration, shape: 'wide' };
};
const videoCard = (item: CboaVideo, label: string): CiaVideoCard => ({
  code: 'CBOA',
  label,
  title: item.title,
  text: item.description,
  poster: cboaVideoPoster(item),
  videoSrc: cboaVideoSrc(item),
  contentType: 'video/mp4',
  details: [`时长 ${item.duration}`],
});

/** Videos in the hero album; the school's own campus tour opens it. */
const CBOA_VIDEO_TABS: PhVideoTab[] = [
  { label: '校园视频', icon: 'videocam', items: ['campus-tour', 'pickup-first-day'].map(albumVideo) },
  { label: '课程视频', icon: 'videocam', items: ['textbooks-one-on-one', 'teacher-method'].map(albumVideo) },
  { label: '学员访谈', icon: 'videocam', items: [albumVideo('student-china')] },
  {
    label: '宿舍视频', icon: 'videocam',
    items: ['ocean-suites-tour', 'egi-rooms', 'ocean-suites-ocean-view', 'ocean-suites-deluxe', 'ocean-suites-superior'].map(albumVideo),
  },
];

export const CBOA_PAGE_PROFILE: PhSchoolProfile = {
  code: 'BLUE-OCEAN',
  name: CBOA_SHORT_NAME,
  previewPrefix: 'blue-ocean',
  pricingSchoolName: CBOA_SCHOOL_NAMES[0],
  copy: CBOA_COPY,
  compactLayout: true,
  overviewFacts: CBOA_OVERVIEW_FACTS,
  videoTabs: CBOA_VIDEO_TABS,
  courseHighlights: {
    ebe: { badge: '2027年新课程', icon: 'fiber_new' },
  },
  // Each Ocean Suites room clip shows exactly that room type; the EGI clip shows its twin and triple rooms.
  roomVideos: {
    egi: albumVideo('egi-rooms'),
    'ocean-view': albumVideo('ocean-suites-ocean-view'),
    deluxe: albumVideo('ocean-suites-deluxe'),
    superior: albumVideo('ocean-suites-superior'),
  },
  gallery: {
    categories: CIA_GALLERY_CATEGORIES,
    albumCategories: ['校园', '教室', '住宿', '餐厅', '设施'],
    images: CBOA_GALLERY_IMAGES,
    heroCategories: ['住宿', '设施', '校园'],
    albumDescriptions: CBOA_ALBUM_DESCRIPTIONS,
    uploadedPhotoTitle: '蓝海CBOA 学校媒体',
    uploadedPhotoDescription: '蓝海CBOA 学校实景内容',
    uploadedVideoTitle: '蓝海CBOA 学校视频',
  },
  snapshotCards: CBOA_QUICK_INFO,
  basicInfo: CBOA_BASIC_INFO,
  suitableFor: CBOA_SUITABLE_FOR.map(title => ({ title, text: '' })),
  notSuitableFor: CBOA_NOT_SUITABLE_FOR.map(title => ({ title, text: '' })),
  campusBuildings: CBOA_CAMPUS_BUILDINGS,
  videoCards: [videoCard(video('campus-tour'), 'CAMPUS TOUR'), videoCard(video('ocean-suites-tour'), 'OCEAN SUITES')],
  campusLifeVideos: [],
  interviewVideos: [],
  courseGroups: [
    {
      icon: 'forum', title: '口语 ESL', text: '从每天4节到7节一对一',
      courseIds: ['light-esl', 'intensive-esl', CBOA_SURVIVAL_COURSE_ID, 'power-esl-5', 'power-esl-7'],
    },
    { icon: 'fact_check', title: '托业／雅思', text: '一对一加4:1听力小组课', courseIds: ['toeic', 'ielts'] },
    { icon: 'business_center', title: '商务英语', text: '职场沟通和高管商务英语', courseIds: ['business', 'ebe'] },
    { icon: 'elderly', title: '40岁以上', text: '只收40岁及以上学生', courseIds: [CBOA_SENIOR_COURSE_ID] },
    { icon: 'family_restroom', title: '家庭课程', text: '7–15岁孩子和陪读家长', courseIds: CBOA_FAMILY_COURSE_IDS },
  ],
  studyModes: [],
  courseDetailGuides: CBOA_COURSE_DETAIL_GUIDES,
  scheduleColumns: [],
  initialCourseFees: initialPricing.courseFees,
  initialRoomFees: initialPricing.roomFees,
  initialRoomRateGroups: CBOA_INITIAL_ROOM_RATE_GROUPS,
  // Until 2027/02/01 the cards show the 2026 prices (registration date decides the year).
  roomGroupNotes: cboaShows2026Prices()
    ? {
      'EGI 校内宿舍': '以上为2027/01/31前报名的价格；2027/02/01起报名，双人间每4周加50美元，三人间不变。',
      'Ocean Suites 校外单人公寓': '以上为2027/01/31前报名的价格；2027/02/01起报名，单人间每4周加100美元。\n情侣房2027/02/01起报名才可选，须两人一起报名、同住一间。',
    }
    : { 'Ocean Suites 校外单人公寓': '情侣房按每人价格，须两人一起报名、同住一间。' },
  showRoomCodes: false,
  dormRules: [],
  roomProfiles: CBOA_ROOM_PROFILES,
  ieltsResults: [],
  studentReviews: [],
  reviewPath: '',
  holidayCalendars: [],
  ieltsComputerExamDates2027: [],
  studentCareServices: [],
  campusPracticalGuides: CBOA_PRACTICAL_GUIDES,
  studentTracks: [],
  sidaReasons: CIA_SIDA_REASONS.map(reason => ({ ...reason, alt: brand(reason.alt) })),
  sidaTrustBadges: CIA_SIDA_TRUST_BADGES,
  ctaBadges: CBOA_FINAL_CTA_BADGES,
  ctaConsultants: CIA_CTA_CONSULTANTS,
  mobileAnchors: [
    { label: '视频', target: 'gallery', icon: 'smart_display' },
    { label: '概览', target: 'overview', icon: 'dashboard' },
    { label: '课程', target: 'courses', icon: 'menu_book' },
    { label: '住宿', target: 'rooms', icon: 'bed' },
    { label: '报价', target: 'quote', icon: 'calculate' },
    { label: 'FAQ', target: 'faq', icon: 'help' },
  ],
  faqs: () => CBOA_FAQS.map(item => ({ ...item })),
  shows2026Prices: () => cboaShows2026Prices(),
  defaultContent: createDefaultBlueOceanContentConfig,
  cloneContent: cloneBlueOceanContentConfig,
};

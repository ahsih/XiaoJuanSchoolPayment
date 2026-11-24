// I.BREEZE content for the shared Philippine school page (school-page/ph-school-page.component.*).
// Text and data come from ibreeze-page-content.ts; prices and rules from ibreeze-content-config.ts.
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
import { cloneIbreezeContentConfig, createDefaultIbreezeContentConfig } from './ibreeze-content-config';
import {
  IBREEZE_ALBUM_DESCRIPTIONS,
  IBREEZE_BASIC_INFO,
  IBREEZE_CAMPUS_BUILDINGS,
  IBREEZE_COURSE_DETAIL_GUIDES,
  IBREEZE_DORM_RULES,
  IBREEZE_FAQS,
  IBREEZE_FINAL_CTA_BADGES,
  IBREEZE_GALLERY_IMAGES,
  IBREEZE_NOT_SUITABLE_FOR,
  IBREEZE_OVERVIEW_FACTS,
  IBREEZE_PAGE_TEXT,
  IBREEZE_PRACTICAL_GUIDES,
  IBREEZE_QUICK_INFO,
  IBREEZE_REFERENCE_NOTE,
  IBREEZE_ROOM_PROFILES,
  IBREEZE_SCHEDULE,
  IBREEZE_SUITABLE_FOR,
  IBREEZE_VIDEOS,
  ibreezeVideoPoster,
  ibreezeVideoSrc,
  type IbreezeVideo,
} from './ibreeze-page-content';
import { IBREEZE_PRICE_REGISTRATION_START } from './ibreeze-pricing-2027';

const defaults = createDefaultIbreezeContentConfig();
const AFTERNOON_START = IBREEZE_SCHEDULE.findIndex(row => row.time.startsWith('13:05'));
const initialPricing = createCiaQuotePricing(defaults);
const brandIbreeze = (text: string) => text.replace(/CIA/g, 'I.BREEZE');
const localToday = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

/** Until 2027-01-01 a new registration still pays the 2026 prices, which the course and room lists then show first. */
export const ibreezeShows2026Prices = (today = localToday()): boolean => today < IBREEZE_PRICE_REGISTRATION_START;

const IBREEZE_COPY: PhPageCopy = {
  swipeHint: CIA_PAGE_COPY.swipeHint,
  referenceNote: IBREEZE_REFERENCE_NOTE,
  hero: {
    breadcrumb: '菲律宾游学 / 宿务学校 / I.BREEZE',
    title: '菲律宾宿务 I.BREEZE 语言学校',
    lead: IBREEZE_PAGE_TEXT.heroLead,
    tags: [
      { icon: 'location_on', text: '宿务市中心 Mabolo' },
      { icon: 'verified', text: '半斯巴达' },
      { icon: 'school', text: '130多位全职老师' },
      { icon: 'fact_check', text: '步行7分钟到雅思考点' },
    ],
  },
  overview: { title: '30 秒看懂 I.BREEZE' },
  advisorReview: {
    title: '顾问怎么看 I.BREEZE',
    text: IBREEZE_PAGE_TEXT.advisorText,
    suitableTitle: '适合谁',
    notSuitableTitle: '报名前想清楚',
  },
  campus: {
    eyebrow: 'CAMPUS AT A GLANCE',
    title: 'I.BREEZE 校园介绍',
    intro: IBREEZE_PAGE_TEXT.campusIntro,
  },
  gallery: {
    title: '按区域查看 I.BREEZE 环境',
    intro: IBREEZE_PAGE_TEXT.galleryIntro,
    photoNote: CIA_PAGE_COPY.gallery.photoNote,
    roomComparisonTitle: '房型对比',
    roomDisclaimer: IBREEZE_REFERENCE_NOTE,
  },
  courses: {
    title: 'I.BREEZE 课程怎么选？',
    intro: IBREEZE_PAGE_TEXT.coursesIntro,
    priceUnit: '/4周',
    fitLabel: '适合人群',
    noteLabel: '课程说明',
    oldPriceLabel: '2027/01/01起报名',
    detailSummaryTitle: '查看课程细节与每日作息',
    detailSummaryHint: '雅思考试福利、青少年报名、上课规定和每日作息',
    guideTitle: '报名前值得确认的课程细节',
  },
  schedule: {
    eyebrow: 'DAILY TIMETABLE',
    title: 'I.BREEZE 每日作息（强化英语，周一至周五）',
    intro: '每节课45分钟，课间休息5分钟；实际课表按所选课程和分班安排。',
    badge: '课后有免费晚间课',
  },
  videos: {
    eyebrow: 'SCHOOL VIDEOS',
    title: '用视频了解 I.BREEZE',
    intro: '视频来自I.BREEZE学校，可以看到校园、各类宿舍和校外公寓。',
    badge: 'I.BREEZE 学校视频',
  },
  rooms: {
    photoTitle: '房型实景',
    photoIntro: IBREEZE_PAGE_TEXT.roomsPhotoIntro,
    rulesTitle: '短期费率、入住离校与宿舍规定',
    rulesHint: '1–3周住宿费比例、入住离校、门禁与宿舍规定',
    dormRulesTitle: '宿舍与校外公寓规定',
  },
  quote: {
    ...CIA_PAGE_COPY.quote,
    compareShortcuts: [
      { focus: 'room', label: '比房型', hint: '如IB1、IB2宿舍和校外公寓' },
      { focus: 'course', label: '比同类课程', hint: '如强化英语、轻度ESL和密集口语' },
      { focus: 'weeks', label: '比周数', hint: '如4周、8周、12周' },
    ],
  },
  fees: { ...CIA_PAGE_COPY.fees, shortStayTitle: '短期就读费率（以强化英语为例）' },
  practicalGuide: {
    summaryTitle: '到校须知与学校服务',
    summaryHint: '第一天安排、用餐与开放时间、清洁洗衣、校外公寓、其他收费、周末活动',
    intro: '出发前和到校后最常问到的安排。',
  },
  sida: {
    ...CIA_PAGE_COPY.sida,
    title: brandIbreeze(CIA_PAGE_COPY.sida.title),
    photoAlt: brandIbreeze(CIA_PAGE_COPY.sida.photoAlt),
    photoCaption: brandIbreeze(CIA_PAGE_COPY.sida.photoCaption),
  },
  faq: CIA_PAGE_COPY.faq,
  finalCta: {
    title: IBREEZE_PAGE_TEXT.finalCtaTitle,
    text: IBREEZE_PAGE_TEXT.finalCtaText,
    primaryLabel: '获取 I.BREEZE 完整报价单',
    secondaryLabel: '咨询当前空房',
  },
};

const IBREEZE_INITIAL_ROOM_RATE_GROUPS: RoomRateGroup[] = [...new Set(defaults.rooms.map(room => room.group))].map(title => ({
  title,
  rooms: defaults.rooms
    .filter(room => room.enabled && room.group === title)
    .map(room => ({ id: room.id, label: room.label, code: room.code, location: room.location })),
}));

const video = (name: string): IbreezeVideo => IBREEZE_VIDEOS.find(item => item.name === name) as IbreezeVideo;
const albumVideo = (item: IbreezeVideo): PhVideoItem => ({
  title: item.title,
  text: item.description,
  src: ibreezeVideoSrc(item),
  poster: ibreezeVideoPoster(item),
  duration: item.duration,
  shape: 'wide',
});
const videoCard = (item: IbreezeVideo): CiaVideoCard => ({
  code: 'I.BREEZE',
  label: 'SCHOOL FILM',
  title: item.title,
  text: item.description,
  poster: ibreezeVideoPoster(item),
  videoSrc: ibreezeVideoSrc(item),
  contentType: 'video/mp4',
  details: ['校园、教室与宿舍', '餐厅与课后生活', `时长 ${item.duration}`],
});
const roomClips = (prefix: string) => IBREEZE_VIDEOS.filter(item => item.roomId?.startsWith(prefix)).map(albumVideo);

/** Videos in the hero album, one chip per topic; the school film opens the album. */
const IBREEZE_VIDEO_TABS: PhVideoTab[] = [
  { label: '校园视频', icon: 'videocam', items: [albumVideo(video('ibreeze-school-film'))] },
  { label: '宿舍视频', icon: 'videocam', items: [...roomClips('ib1-'), ...roomClips('ib2-')] },
  { label: '校外公寓视频', icon: 'videocam', items: roomClips('condo-') },
];

/** Each room clip shows exactly one room type, so it opens that room's photo album. */
const IBREEZE_ROOM_VIDEOS: Record<string, PhVideoItem> = Object.fromEntries(
  IBREEZE_VIDEOS.filter(item => item.roomId).map(item => [item.roomId!, albumVideo(item)]),
);

export const IBREEZE_PAGE_PROFILE: PhSchoolProfile = {
  code: 'IBREEZE',
  name: 'I.BREEZE',
  previewPrefix: 'ibreeze',
  pricingSchoolName: 'I.BREEZE',
  copy: IBREEZE_COPY,
  compactLayout: true,
  overviewFacts: IBREEZE_OVERVIEW_FACTS,
  videoTabs: IBREEZE_VIDEO_TABS,
  roomVideos: IBREEZE_ROOM_VIDEOS,
  courseHighlights: {
    'ielts-target': {
      badge: '12周以上可获1次免费官方考试',
      label: '考试福利',
      text: '报名12周或以上，出勤率90%以上、每天参加词汇测试，并在第10周前模考达到目标分，可获1次免费官方雅思考试。',
    },
    'toeic-target': {
      badge: '12周以上可获1次免费官方考试',
      label: '考试福利',
      text: '报名超过12周，出勤率90%以上，毕业前3周模考达到550分，可获1次免费托业官方考试。',
    },
  },
  gallery: {
    categories: CIA_GALLERY_CATEGORIES,
    albumCategories: ['校园', '教室', '住宿', '餐厅', '设施'],
    images: IBREEZE_GALLERY_IMAGES,
    heroCategories: ['校园', '设施', '住宿'],
    albumDescriptions: IBREEZE_ALBUM_DESCRIPTIONS,
    uploadedPhotoTitle: 'I.BREEZE 学校媒体',
    uploadedPhotoDescription: 'I.BREEZE 学校实景内容',
    uploadedVideoTitle: 'I.BREEZE 学校视频',
  },
  snapshotCards: IBREEZE_QUICK_INFO,
  basicInfo: IBREEZE_BASIC_INFO,
  suitableFor: IBREEZE_SUITABLE_FOR.map(title => ({ title, text: '' })),
  notSuitableFor: IBREEZE_NOT_SUITABLE_FOR.map(title => ({ title, text: '' })),
  campusBuildings: IBREEZE_CAMPUS_BUILDINGS,
  videoCards: [videoCard(video('ibreeze-school-film'))],
  campusLifeVideos: [],
  interviewVideos: [],
  courseGroups: [
    {
      icon: 'forum', title: '综合英语 ESL', text: '从零基础到流利表达',
      courseIds: ['power-esl', 'intensive-beginner', 'light-esl', 'intensive-speaking'],
    },
    { icon: 'workspace_premium', title: '雅思 IELTS', text: '零基础起步到目标分数', courseIds: ['ielts-target', 'ielts-starter'] },
    { icon: 'business_center', title: '托业与商务英语', text: '求职、职场和商务沟通', courseIds: ['toeic-target', 'general-business-and-bec'] },
    { icon: 'child_care', title: '青少年', text: '5–15岁与家长同行，或16–17岁单独来读', courseIds: ['junior-english'] },
  ],
  studyModes: [],
  courseDetailGuides: IBREEZE_COURSE_DETAIL_GUIDES,
  scheduleColumns: [
    { code: 'MORNING', title: '上午', rows: IBREEZE_SCHEDULE.slice(0, AFTERNOON_START) },
    { code: 'AFTERNOON', title: '下午和晚上', rows: IBREEZE_SCHEDULE.slice(AFTERNOON_START) },
  ],
  initialCourseFees: initialPricing.courseFees,
  initialRoomFees: initialPricing.roomFees,
  initialRoomRateGroups: IBREEZE_INITIAL_ROOM_RATE_GROUPS,
  roomGroupNotes: { 校外公寓: '2027/06/27–08/14暑期只接受家庭学生。' },
  showRoomCodes: false,
  dormRules: IBREEZE_DORM_RULES,
  roomProfiles: IBREEZE_ROOM_PROFILES,
  ieltsResults: [],
  studentReviews: [],
  reviewPath: '',
  holidayCalendars: [],
  ieltsComputerExamDates2027: [],
  studentCareServices: [],
  campusPracticalGuides: IBREEZE_PRACTICAL_GUIDES,
  studentTracks: [],
  sidaReasons: CIA_SIDA_REASONS.map(reason => ({ ...reason, alt: brandIbreeze(reason.alt) })),
  sidaTrustBadges: CIA_SIDA_TRUST_BADGES,
  ctaBadges: IBREEZE_FINAL_CTA_BADGES,
  ctaConsultants: CIA_CTA_CONSULTANTS,
  mobileAnchors: [
    { label: '视频', target: 'gallery', icon: 'smart_display' },
    { label: '概览', target: 'overview', icon: 'dashboard' },
    { label: '课程', target: 'courses', icon: 'menu_book' },
    { label: '住宿', target: 'rooms', icon: 'bed' },
    { label: '报价', target: 'quote', icon: 'calculate' },
    { label: 'FAQ', target: 'faq', icon: 'help' },
  ],
  // Price and offer answers that end with 2026 hide themselves from their `until` date.
  faqs: () => IBREEZE_FAQS.filter(item => !item.until || localToday() < item.until).map(item => ({ ...item })),
  shows2026Prices: () => ibreezeShows2026Prices(),
  defaultContent: createDefaultIbreezeContentConfig,
  cloneContent: cloneIbreezeContentConfig,
};

// A&J ECO Campus content for the shared Philippine school page (school-page/ph-school-page.component.*).
// Text and data come from anj-page-content.ts; prices and rules from anj-content-config.ts.
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
import { cloneAnjContentConfig, createDefaultAnjContentConfig } from './anj-content-config';
import {
  ANJ_ALBUM_DESCRIPTIONS,
  ANJ_BASIC_INFO,
  ANJ_CAMPUS_AREAS,
  ANJ_COURSE_DETAIL_GUIDES,
  ANJ_DORM_RULES,
  ANJ_FAQS,
  ANJ_FINAL_CTA_BADGES,
  ANJ_GALLERY_IMAGES,
  ANJ_HOLIDAY_CALENDARS,
  ANJ_HOLIDAY_FOOTNOTE,
  ANJ_NOT_SUITABLE_FOR,
  ANJ_OVERVIEW_FACTS,
  ANJ_PAGE_TEXT,
  ANJ_PRACTICAL_GUIDES,
  ANJ_QUICK_INFO,
  ANJ_REFERENCE_NOTE,
  ANJ_REFUND_COPY,
  ANJ_ROOM_PROFILES,
  ANJ_SCHEDULE,
  ANJ_SUITABLE_FOR,
  ANJ_VIDEOS,
  anjVideoPoster,
  anjVideoSrc,
  type AnjVideo,
} from './anj-page-content';

const defaults = createDefaultAnjContentConfig();
const AFTERNOON_START = ANJ_SCHEDULE.findIndex(row => row.time.startsWith('13:30'));
const initialPricing = createCiaQuotePricing(defaults);
const brandAnj = (text: string) => text.replace(/CIA/g, 'A&J');

const ANJ_COPY: PhPageCopy = {
  swipeHint: CIA_PAGE_COPY.swipeHint,
  referenceNote: ANJ_REFERENCE_NOTE,
  hero: {
    breadcrumb: '菲律宾游学 / 碧瑶学校 / A&J ECO 校区',
    title: '菲律宾碧瑶 A&J e-Edu Academy ECO 校区',
    lead: ANJ_PAGE_TEXT.heroLead,
    tags: [
      { icon: 'forest', text: '碧瑶松林校园' },
      { icon: 'rule', text: '半斯巴达／斯巴达' },
      { icon: 'workspace_premium', text: '雅思送官方考试' },
      { icon: 'family_restroom', text: '亲子与青少年' },
    ],
    quoteLabel: '获取 A&J 最新报价',
  },
  overview: { title: '30 秒看懂 A&J ECO 校区' },
  advisorReview: {
    title: '顾问怎么看 A&J',
    text: ANJ_PAGE_TEXT.advisorText,
    suitableTitle: '适合谁',
    notSuitableTitle: '报名前想清楚',
  },
  campus: {
    eyebrow: 'CAMPUS AT A GLANCE',
    title: 'A&J ECO 校区介绍',
    intro: ANJ_PAGE_TEXT.campusIntro,
  },
  gallery: {
    title: '按区域查看 A&J ECO 校区环境',
    intro: ANJ_PAGE_TEXT.galleryIntro,
    photoNote: CIA_PAGE_COPY.gallery.photoNote,
    roomComparisonTitle: '房型对比',
    roomDisclaimer: ANJ_REFERENCE_NOTE,
  },
  courses: {
    title: 'A&J 课程怎么选？',
    intro: ANJ_PAGE_TEXT.coursesIntro,
    priceUnit: '/4周',
    fitLabel: '适合人群',
    noteLabel: '课程说明',
    detailSummaryTitle: '查看课程细节与每日作息',
    detailSummaryHint: '保分班、雅思送考、打工度假、青少年和亲子课程、管理方式与考试',
    guideTitle: '报名前值得确认的课程细节',
  },
  schedule: {
    eyebrow: 'DAILY TIMETABLE',
    title: 'A&J 每日作息（周一至周五）',
    intro: '每节课50分钟；实际课表按所选课程和分班安排。',
    badge: '小组课最多6人',
  },
  planning: {
    summaryTitle: '2027年学校假期',
    summaryHint: '公休日停课，每4周保证18个上课日',
  },
  calendar: {
    eyebrow: 'ACADEMIC CALENDAR',
    title: 'A&J 2027年日历',
    intro: '学校假期和暑期旺季一表看完，用于规划入学日期和周数。',
    footnote: ANJ_HOLIDAY_FOOTNOTE,
    peakEyebrow: 'PEAK SEASON',
    peakTitle: '暑期旺季',
    peakIntro: '',
    peakNote: '',
  },
  videos: {
    eyebrow: 'SCHOOL VIDEOS',
    title: '用视频了解 A&J ECO 校区',
    intro: '学校宣传片和各房型的实拍视频。',
    badge: 'A&J 学校视频',
    lifeTitle: '房型视频',
  },
  rooms: {
    photoTitle: '房型实景',
    photoIntro: ANJ_PAGE_TEXT.roomsPhotoIntro,
    rulesTitle: '短期费率、入住离校与宿舍规定',
    rulesHint: '1–3周住宿费比例、整间房型、入住离校与宿舍规定',
    dormRulesTitle: '宿舍规定',
  },
  quote: {
    ...CIA_PAGE_COPY.quote,
    compareShortcuts: [
      { focus: 'room', label: '比房型', hint: '如 Deluxe 三人间、双人间和单人间' },
      { focus: 'course', label: '比同类课程', hint: '如 Eco Relax、Eco Hub 和 Eco Sparta' },
      { focus: 'weeks', label: '比周数', hint: '如4周、8周、12周' },
    ],
  },
  fees: CIA_PAGE_COPY.fees,
  refund: ANJ_REFUND_COPY,
  practicalGuide: {
    summaryTitle: '到校须知与学校服务',
    summaryHint: '用餐与开放时间、打扫洗衣、入学与接机、其他收费、出发前准备',
    intro: '出发前和到校后最常问到的安排。',
  },
  sida: {
    ...CIA_PAGE_COPY.sida,
    title: brandAnj(CIA_PAGE_COPY.sida.title),
    photoAlt: brandAnj(CIA_PAGE_COPY.sida.photoAlt),
    photoCaption: brandAnj(CIA_PAGE_COPY.sida.photoCaption),
  },
  faq: CIA_PAGE_COPY.faq,
  finalCta: {
    title: ANJ_PAGE_TEXT.finalCtaTitle,
    text: ANJ_PAGE_TEXT.finalCtaText,
    primaryLabel: '获取 A&J 完整报价单',
    secondaryLabel: '咨询当前空房',
  },
};

const ANJ_INITIAL_ROOM_RATE_GROUPS: RoomRateGroup[] = [...new Set(defaults.rooms.map(room => room.group))].map(title => ({
  title,
  rooms: defaults.rooms
    .filter(room => room.enabled && room.group === title)
    .map(room => ({ id: room.id, label: room.label, code: room.code, location: room.location })),
}));

const video = (name: string): AnjVideo => ANJ_VIDEOS.find(item => item.name === name) as AnjVideo;
const albumVideo = (name: string): PhVideoItem => {
  const item = video(name);
  return {
    title: item.title,
    text: item.description,
    src: anjVideoSrc(item),
    poster: anjVideoPoster(item),
    duration: item.duration,
    shape: item.orientation === 'landscape' ? 'wide' : 'tall',
  };
};
const shortVideo = (item: AnjVideo): CiaShortVideo => ({
  title: item.title,
  text: item.description,
  src: anjVideoSrc(item),
  poster: anjVideoPoster(item),
  duration: item.duration,
  ...(item.orientation === 'landscape' ? { shape: 'wide' as const } : {}),
});

const ANJ_VIDEO_TOPICS: ReadonlyArray<AnjVideo['topic']> = ['校园', '宿舍', '设施', '餐厅'];
const ANJ_VIDEO_TABS: PhVideoTab[] = ANJ_VIDEO_TOPICS.map(topic => ({
  label: `${topic}视频`,
  icon: 'videocam',
  items: ANJ_VIDEOS.filter(item => item.topic === topic).map(item => albumVideo(item.name)),
}));

export const ANJ_PAGE_PROFILE: PhSchoolProfile = {
  code: 'ANJ',
  name: 'A&J',
  previewPrefix: 'anj',
  pricingSchoolName: '菲律宾碧瑶A&J e-Edu English Academy',
  copy: ANJ_COPY,
  compactLayout: true,
  overviewFacts: ANJ_OVERVIEW_FACTS,
  videoTabs: ANJ_VIDEO_TABS,
  courseHighlights: {
    'test-ielts': { badge: '报12周送1次官方考试' },
    'ielts-guarantee': { badge: '送1次官方考试' },
    'toeic-guarantee': { badge: '送1次官方考试' },
  },
  roomVideos: {
    'deluxe-single': albumVideo('deluxe-single'),
    'deluxe-twin': albumVideo('deluxe-twin'),
    'deluxe-triple': albumVideo('deluxe-triple'),
    'premium-twin': albumVideo('premium-twin'),
    suite: albumVideo('suite'),
    studio: albumVideo('premium-studio'),
    villa: albumVideo('villa'),
  },
  gallery: {
    categories: CIA_GALLERY_CATEGORIES,
    albumCategories: ['校园', '教室', '住宿', '餐厅', '设施'],
    images: ANJ_GALLERY_IMAGES,
    heroCategories: ['校园', '设施', '住宿'],
    albumDescriptions: ANJ_ALBUM_DESCRIPTIONS,
    uploadedPhotoTitle: 'A&J 学校媒体',
    uploadedPhotoDescription: 'A&J ECO 校区实景内容',
    uploadedVideoTitle: 'A&J 学校视频',
  },
  snapshotCards: ANJ_QUICK_INFO,
  basicInfo: ANJ_BASIC_INFO,
  suitableFor: ANJ_SUITABLE_FOR.map(title => ({ title, text: '' })),
  notSuitableFor: ANJ_NOT_SUITABLE_FOR.map(title => ({ title, text: '' })),
  campusBuildings: ANJ_CAMPUS_AREAS,
  videoCards: [],
  campusLifeVideos: ANJ_VIDEOS.map(shortVideo),
  interviewVideos: [],
  courseGroups: [
    { icon: 'forum', title: '综合英语 ESL', text: '从轻松到斯巴达，一对一为主', courseIds: ['eco-relax-lite', 'eco-relax-plus', 'eco-hub', 'eco-sparta'] },
    {
      icon: 'workspace_premium', title: '考试与保分班', text: '雅思、托业、托福和PTE，雅思课程报12周送考',
      courseIds: ['ielts-guarantee', 'toeic-guarantee', 'test-ielts', 'test-course'],
    },
    { icon: 'work', title: '打工度假', text: '工作英语加实习', courseIds: ['working-holiday'] },
    { icon: 'family_restroom', title: '青少年与亲子', text: '4–16岁孩子，家长可以陪读上课', courseIds: ['junior-lite', 'junior-esl', 'junior-test'] },
  ],
  studyModes: [],
  courseDetailGuides: ANJ_COURSE_DETAIL_GUIDES,
  scheduleColumns: [
    { code: 'MORNING', title: '上午', rows: ANJ_SCHEDULE.slice(0, AFTERNOON_START) },
    { code: 'AFTERNOON', title: '下午和晚上', rows: ANJ_SCHEDULE.slice(AFTERNOON_START) },
  ],
  initialCourseFees: initialPricing.courseFees,
  initialRoomFees: initialPricing.roomFees,
  initialRoomRateGroups: ANJ_INITIAL_ROOM_RATE_GROUPS,
  roomGroupNotes: {
    'Premium 公寓': '公寓有客厅和小厨房，可以做饭。',
    'Suite 套房': '两人入住按整间价由两人平分。',
    'Premium Studio': '三人或四人入住按整间价平分；可以做饭。',
    'Eco Villa 别墅': '两人以上限家庭，按整间价平分；可以做饭。',
  },
  showRoomCodes: false,
  dormRules: ANJ_DORM_RULES,
  roomProfiles: ANJ_ROOM_PROFILES,
  ieltsResults: [],
  studentReviews: [],
  reviewPath: '',
  holidayCalendars: ANJ_HOLIDAY_CALENDARS,
  ieltsComputerExamDates2027: [],
  studentCareServices: [],
  campusPracticalGuides: ANJ_PRACTICAL_GUIDES,
  studentTracks: [],
  sidaReasons: CIA_SIDA_REASONS.map(reason => ({ ...reason, alt: brandAnj(reason.alt) })),
  sidaTrustBadges: CIA_SIDA_TRUST_BADGES,
  ctaBadges: ANJ_FINAL_CTA_BADGES,
  ctaConsultants: CIA_CTA_CONSULTANTS,
  mobileAnchors: [
    { label: '视频', target: 'gallery', icon: 'smart_display' },
    { label: '概览', target: 'overview', icon: 'dashboard' },
    { label: '课程', target: 'courses', icon: 'menu_book' },
    { label: '住宿', target: 'rooms', icon: 'bed' },
    { label: '报价', target: 'quote', icon: 'calculate' },
    { label: 'FAQ', target: 'faq', icon: 'help' },
  ],
  faqs: () => ANJ_FAQS.map(item => ({ ...item })),
  shows2026Prices: () => false,
  defaultContent: createDefaultAnjContentConfig,
  cloneContent: cloneAnjContentConfig,
};

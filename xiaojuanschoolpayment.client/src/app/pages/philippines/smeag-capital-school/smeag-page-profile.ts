// SMEAG Capital content for the shared Philippine school page (school-page/ph-school-page.component.*).
// Text and data come from smeag-page-content.ts; prices and rules from smeag-content-config.ts.
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
import { cloneSmeagContentConfig, createDefaultSmeagContentConfig } from './smeag-content-config';
import {
  SMEAG_ALBUM_DESCRIPTIONS,
  SMEAG_BASIC_INFO,
  SMEAG_CAMPUS_FLOORS,
  SMEAG_COURSE_DETAIL_GUIDES,
  SMEAG_DORM_RULES,
  SMEAG_FAQS,
  SMEAG_FINAL_CTA_BADGES,
  SMEAG_GALLERY_IMAGES,
  SMEAG_HOLIDAY_CALENDARS,
  SMEAG_NOT_SUITABLE_FOR,
  SMEAG_OVERVIEW_FACTS,
  SMEAG_PAGE_TEXT,
  SMEAG_PRACTICAL_GUIDES,
  SMEAG_QUICK_INFO,
  SMEAG_REFERENCE_NOTE,
  SMEAG_ROOM_PROFILES,
  SMEAG_SCHEDULE,
  SMEAG_SUITABLE_FOR,
  SMEAG_VIDEOS,
  smeagVideoPoster,
  smeagVideoSrc,
  type SmeagVideo,
} from './smeag-page-content';

const defaults = createDefaultSmeagContentConfig();
const AFTERNOON_START = SMEAG_SCHEDULE.findIndex(row => row.time.startsWith('13:00'));
const initialPricing = createCiaQuotePricing(defaults);
const brandSmeag = (text: string) => text.replace(/CIA/g, 'SMEAG Capital');

const SMEAG_COPY: PhPageCopy = {
  swipeHint: CIA_PAGE_COPY.swipeHint,
  referenceNote: SMEAG_REFERENCE_NOTE,
  hero: {
    breadcrumb: '菲律宾游学 / 宿务学校 / SMEAG Capital',
    title: '菲律宾宿务 SMEAG Capital 校区',
    lead: SMEAG_PAGE_TEXT.heroLead,
    tags: [
      { icon: 'location_on', text: '宿务市区' },
      { icon: 'verified', text: '前4周斯巴达' },
      { icon: 'workspace_premium', text: '雅思·托福·托业' },
      { icon: 'school', text: '剑桥体系 ESL' },
    ],
    quoteLabel: '获取 SMEAG 最新报价',
  },
  overview: { title: '30 秒看懂 SMEAG Capital' },
  advisorReview: {
    title: '顾问怎么看 SMEAG Capital',
    text: SMEAG_PAGE_TEXT.advisorText,
    suitableTitle: '适合谁',
    notSuitableTitle: '报名前想清楚',
  },
  campus: {
    eyebrow: 'CAMPUS AT A GLANCE',
    title: 'SMEAG Capital 校园介绍',
    intro: SMEAG_PAGE_TEXT.campusIntro,
  },
  gallery: {
    title: '按区域查看 SMEAG Capital 环境',
    intro: SMEAG_PAGE_TEXT.galleryIntro,
    photoNote: CIA_PAGE_COPY.gallery.photoNote,
    roomComparisonTitle: '房型对比',
    roomDisclaimer: SMEAG_REFERENCE_NOTE,
  },
  courses: {
    title: 'SMEAG Capital 课程怎么选？',
    intro: SMEAG_PAGE_TEXT.coursesIntro,
    priceUnit: '/4周',
    fitLabel: '适合人群',
    noteLabel: '课程说明',
    detailSummaryTitle: '查看课程细节与每日作息',
    detailSummaryHint: '送考与保分班、托业、亲子课程、斯巴达课和出勤规定',
    guideTitle: '报名前值得确认的课程细节',
  },
  schedule: {
    eyebrow: 'DAILY TIMETABLE',
    title: 'SMEAG Capital 每日作息（周一至周五）',
    intro: '每节课45分钟；实际课表按所选课程和分班安排，斯巴达课只在前4周必上。',
    badge: '每周模考',
  },
  planning: {
    summaryTitle: '2027年学校假期',
    summaryHint: '停课日和假日特别课',
  },
  calendar: {
    eyebrow: 'ACADEMIC CALENDAR',
    title: 'SMEAG Capital 2027年假期',
    intro: '标“停课”的日子不上课；其他假日照常有假日特别课。用于规划入学日期和周数。',
    peakEyebrow: '',
    peakTitle: '',
    peakIntro: '',
    peakNote: '',
    // The rest of the 2026 Capital holiday poster (user, 2026-11-24); the table above is 2027 only.
    footnote: '2026年剩余假期：11/27、12/30有假日特别课；12/24、12/25、12/31停课。',
  },
  videos: {
    eyebrow: 'SCHOOL VIDEOS',
    title: '用视频了解 SMEAG Capital',
    intro: '校园、宿舍、课堂和餐厅的实拍视频。',
    badge: 'SMEAG 学校视频',
    lifeTitle: '校园短片',
  },
  rooms: {
    photoTitle: '房型实景',
    photoIntro: SMEAG_PAGE_TEXT.roomsPhotoIntro,
    rulesTitle: '短期费率、入住离校与宿舍规定',
    rulesHint: '1–3周住宿费比例、入住离校、门禁与宿舍规定',
    dormRulesTitle: '宿舍与合作酒店规定',
  },
  quote: {
    ...CIA_PAGE_COPY.quote,
    compareShortcuts: [
      { focus: 'room', label: '比房型', hint: '如校内四人间、双人间和合作酒店' },
      { focus: 'course', label: '比同类课程', hint: '如雅思预备和常规' },
      { focus: 'weeks', label: '比周数', hint: '如4周、8周、12周' },
    ],
  },
  fees: CIA_PAGE_COPY.fees,
  practicalGuide: {
    summaryTitle: '到校须知与学校服务',
    summaryHint: '用餐与开放时间、清洁洗衣、合作酒店接送车、其他收费、出发前准备',
    intro: '出发前和到校后最常问到的安排。',
  },
  sida: {
    ...CIA_PAGE_COPY.sida,
    title: brandSmeag(CIA_PAGE_COPY.sida.title),
    photoAlt: brandSmeag(CIA_PAGE_COPY.sida.photoAlt),
    photoCaption: brandSmeag(CIA_PAGE_COPY.sida.photoCaption),
  },
  faq: CIA_PAGE_COPY.faq,
  finalCta: {
    title: SMEAG_PAGE_TEXT.finalCtaTitle,
    text: SMEAG_PAGE_TEXT.finalCtaText,
    primaryLabel: '获取 SMEAG Capital 完整报价单',
    secondaryLabel: '咨询当前空房',
  },
};

const SMEAG_INITIAL_ROOM_RATE_GROUPS: RoomRateGroup[] = [...new Set(defaults.rooms.map(room => room.group))].map(title => ({
  title,
  rooms: defaults.rooms
    .filter(room => room.enabled && room.group === title)
    .map(room => ({ id: room.id, label: room.label, code: room.code, location: room.location })),
}));

const video = (name: string): SmeagVideo => SMEAG_VIDEOS.find(item => item.name === name) as SmeagVideo;
const albumVideo = (name: string): PhVideoItem => {
  const item = video(name);
  return {
    title: item.title,
    text: item.description,
    src: smeagVideoSrc(item),
    poster: smeagVideoPoster(item),
    duration: item.duration,
    shape: item.orientation === 'landscape' ? 'wide' : 'tall',
  };
};
const shortVideo = (item: SmeagVideo): CiaShortVideo => ({
  title: item.title,
  text: item.description,
  src: smeagVideoSrc(item),
  poster: smeagVideoPoster(item),
  duration: item.duration,
  ...(item.orientation === 'landscape' ? { shape: 'wide' as const } : {}),
});

const SMEAG_VIDEO_TOPICS: ReadonlyArray<SmeagVideo['topic']> = ['校园', '宿舍', '课程', '餐厅'];
const SMEAG_VIDEO_TABS: PhVideoTab[] = SMEAG_VIDEO_TOPICS.map(topic => ({
  label: `${topic}视频`,
  icon: 'videocam',
  items: SMEAG_VIDEOS.filter(item => item.topic === topic).map(item => albumVideo(item.name)),
}));

export const SMEAG_PAGE_PROFILE: PhSchoolProfile = {
  code: 'SMEAG',
  name: 'SMEAG Capital',
  previewPrefix: 'smeag',
  pricingSchoolName: 'SMEAG Capital',
  copy: SMEAG_COPY,
  compactLayout: true,
  overviewFacts: SMEAG_OVERVIEW_FACTS,
  videoTabs: SMEAG_VIDEO_TABS,
  courseHighlights: {
    'ielts-regular': { badge: '报12周送1次官方考试' },
    'toefl-regular': { badge: '报12周送1次官方考试' },
  },
  roomVideos: {
    'campus-single': albumVideo('single-room'),
    'campus-twin': albumVideo('twin-room'),
    'campus-triple': albumVideo('triple-room'),
    'campus-quad': albumVideo('quad-room'),
  },
  gallery: {
    categories: CIA_GALLERY_CATEGORIES,
    albumCategories: ['校园', '教室', '住宿', '餐厅', '设施'],
    images: SMEAG_GALLERY_IMAGES,
    heroCategories: ['校园', '设施', '住宿'],
    albumDescriptions: SMEAG_ALBUM_DESCRIPTIONS,
    uploadedPhotoTitle: 'SMEAG Capital 学校媒体',
    uploadedPhotoDescription: 'SMEAG Capital 学校实景内容',
    uploadedVideoTitle: 'SMEAG Capital 学校视频',
  },
  snapshotCards: SMEAG_QUICK_INFO,
  basicInfo: SMEAG_BASIC_INFO,
  suitableFor: SMEAG_SUITABLE_FOR.map(title => ({ title, text: '' })),
  notSuitableFor: SMEAG_NOT_SUITABLE_FOR.map(title => ({ title, text: '' })),
  campusBuildings: SMEAG_CAMPUS_FLOORS,
  videoCards: [],
  campusLifeVideos: SMEAG_VIDEOS.map(shortVideo),
  interviewVideos: [],
  courseGroups: [
    {
      icon: 'forum', title: '综合英语 ESL', text: '剑桥体系分级，听说读写全面提升',
      courseIds: ['esl-regular-ket-pet-fce', 'esl-cae', 'esl-2', 'esl-2-cae'],
    },
    { icon: 'record_voice_over', title: '口语强化', text: '集中练口语和表达', courseIds: ['speaking-master-ket-pet-fce', 'speaking-master-cae'] },
    { icon: 'workspace_premium', title: '雅思 IELTS', text: '预备和常规，常规班可报保分', courseIds: ['ielts-regular', 'ielts-pre'] },
    { icon: 'school', title: '托福 TOEFL', text: '预备和常规，常规班可报保分', courseIds: ['toefl-regular', 'toefl-pre'] },
    { icon: 'fact_check', title: '托业 TOEIC', text: '预备和常规', courseIds: ['toeic-regular', 'toeic-pre'] },
    { icon: 'business_center', title: '商务英语', text: '口语、写作、阅读和听力', courseIds: ['business'] },
    {
      icon: 'family_restroom', title: '青少年与亲子', text: '2–12岁孩子、陪读家长和青少年',
      courseIds: ['children', 'guardian', 'esl-junior', 'esl-junior-2'],
    },
  ],
  studyModes: [],
  courseDetailGuides: SMEAG_COURSE_DETAIL_GUIDES,
  scheduleColumns: [
    { code: 'MORNING', title: '上午', rows: SMEAG_SCHEDULE.slice(0, AFTERNOON_START) },
    { code: 'AFTERNOON', title: '下午和晚上', rows: SMEAG_SCHEDULE.slice(AFTERNOON_START) },
  ],
  initialCourseFees: initialPricing.courseFees,
  initialRoomFees: initialPricing.roomFees,
  initialRoomRateGroups: SMEAG_INITIAL_ROOM_RATE_GROUPS,
  roomGroupNotes: {
    '校外合作酒店': '步行约3分钟到学校，早晚有接送车。',
  },
  showRoomCodes: false,
  dormRules: SMEAG_DORM_RULES,
  roomProfiles: SMEAG_ROOM_PROFILES,
  ieltsResults: [],
  studentReviews: [],
  reviewPath: '',
  holidayCalendars: SMEAG_HOLIDAY_CALENDARS,
  ieltsComputerExamDates2027: [],
  studentCareServices: [],
  campusPracticalGuides: SMEAG_PRACTICAL_GUIDES,
  studentTracks: [],
  sidaReasons: CIA_SIDA_REASONS.map(reason => ({ ...reason, alt: brandSmeag(reason.alt) })),
  sidaTrustBadges: CIA_SIDA_TRUST_BADGES,
  ctaBadges: SMEAG_FINAL_CTA_BADGES,
  ctaConsultants: CIA_CTA_CONSULTANTS,
  mobileAnchors: [
    { label: '视频', target: 'gallery', icon: 'smart_display' },
    { label: '概览', target: 'overview', icon: 'dashboard' },
    { label: '课程', target: 'courses', icon: 'menu_book' },
    { label: '住宿', target: 'rooms', icon: 'bed' },
    { label: '报价', target: 'quote', icon: 'calculate' },
    { label: 'FAQ', target: 'faq', icon: 'help' },
  ],
  faqs: () => SMEAG_FAQS.map(item => ({ ...item })),
  shows2026Prices: () => false,
  defaultContent: createDefaultSmeagContentConfig,
  cloneContent: cloneSmeagContentConfig,
};

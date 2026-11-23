// Philinter content for the shared Philippine school page (school-page/ph-school-page.component.*).
// Text and data come from philinter-page-content.ts; prices and rules from philinter-content-config.ts.
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
import { clonePhilinterContentConfig, createDefaultPhilinterContentConfig } from './philinter-content-config';
import {
  PHILINTER_ALBUM_DESCRIPTIONS,
  PHILINTER_BASIC_INFO,
  PHILINTER_CAMPUS_BUILDINGS,
  PHILINTER_COURSE_DETAIL_GUIDES,
  PHILINTER_DORM_RULES,
  PHILINTER_FAQS,
  PHILINTER_FINAL_CTA_BADGES,
  PHILINTER_GALLERY_IMAGES,
  PHILINTER_HOLIDAY_CALENDARS,
  PHILINTER_HOLIDAY_FOOTNOTE,
  PHILINTER_LICENSE,
  PHILINTER_NOT_SUITABLE_FOR,
  PHILINTER_OVERVIEW_FACTS,
  PHILINTER_PAGE_TEXT,
  PHILINTER_PRACTICAL_GUIDES,
  PHILINTER_QUICK_INFO,
  PHILINTER_REFERENCE_NOTE,
  PHILINTER_REFUND_COPY,
  PHILINTER_ROOM_PROFILES,
  PHILINTER_SCHEDULE_COLUMNS,
  PHILINTER_STUDY_MODES,
  PHILINTER_SUITABLE_FOR,
  PHILINTER_VIDEOS,
  philinterVideoPoster,
  philinterVideoSrc,
  type PhilinterVideo,
} from './philinter-page-content';

const defaults = createDefaultPhilinterContentConfig();
const initialPricing = createCiaQuotePricing(defaults);
const brandPhilinter = (text: string) => text.replace(/CIA/g, 'Philinter');

const PHILINTER_COPY: PhPageCopy = {
  swipeHint: CIA_PAGE_COPY.swipeHint,
  referenceNote: PHILINTER_REFERENCE_NOTE,
  hero: {
    breadcrumb: '菲律宾游学 / 宿务学校 / Philinter',
    title: '菲律宾宿务 Philinter 语言学校',
    lead: PHILINTER_PAGE_TEXT.heroLead,
    tags: [
      { icon: 'flight_land', text: '麦克坦岛·近机场' },
      { icon: 'rule', text: '斯巴达／半斯巴达' },
      { icon: 'workspace_premium', text: '雅思·托业保分班' },
      { icon: 'history_edu', text: '2003年创办' },
    ],
    quoteLabel: '获取 Philinter 最新报价',
  },
  overview: { title: '30 秒看懂 Philinter' },
  advisorReview: {
    title: '顾问怎么看 Philinter',
    text: PHILINTER_PAGE_TEXT.advisorText,
    suitableTitle: '适合谁',
    notSuitableTitle: '报名前想清楚',
  },
  license: PHILINTER_LICENSE,
  campus: {
    eyebrow: 'CAMPUS AT A GLANCE',
    title: 'Philinter 校园介绍',
    intro: PHILINTER_PAGE_TEXT.campusIntro,
  },
  gallery: {
    title: '按区域查看 Philinter 环境',
    intro: PHILINTER_PAGE_TEXT.galleryIntro,
    photoNote: CIA_PAGE_COPY.gallery.photoNote,
    roomComparisonTitle: '房型对比',
    roomDisclaimer: PHILINTER_REFERENCE_NOTE,
  },
  courses: {
    title: 'Philinter 课程怎么选？',
    intro: PHILINTER_PAGE_TEXT.coursesIntro,
    priceUnit: '/4周',
    fitLabel: '适合人群',
    noteLabel: '课程说明',
    detailSummaryTitle: '查看课程细节与每日作息',
    detailSummaryHint: '雅思和托业保分班、雅思16周、精品口语、青少年、分级与换课',
    guideTitle: '报名前值得确认的课程细节',
  },
  studyModes: {
    title: '斯巴达还是半斯巴达？',
    intro: '按所选课程决定。两种都有门禁；斯巴达课程周一至周四晚上多两小时必修晚自习。',
    note: '精品口语、行业英语和青少年ESL按学校安排；报名时顾问会说明。',
  },
  schedule: {
    eyebrow: 'DAILY TIMETABLE',
    title: 'Philinter 每日作息（周一至周五）',
    intro: '每节课40–45分钟；实际课表按所选课程和分班安排，旺季17:05–17:45可能加一节课。',
    badge: '每周六雅思模考',
  },
  planning: {
    summaryTitle: '2027年假期与暑期旺季',
    summaryHint: '学校假期与旺季附加费档期',
  },
  calendar: {
    eyebrow: 'ACADEMIC CALENDAR',
    title: 'Philinter 2027年日历',
    intro: '学校假期和暑期旺季一表看完，用于规划入学日期和周数。公休日停课。',
    footnote: PHILINTER_HOLIDAY_FOOTNOTE,
    peakEyebrow: '2027 PEAK SEASON',
    peakTitle: '2027年暑期旺季',
    peakIntro: '课程或住宿计划覆盖以下学习周时，每名学生按实际重叠周数计收旺季附加费。',
    peakNote: '入学按周日、离校按周六；课程与住宿在同一周重叠只计一次，旺季附加费不参与思达启航折扣。',
  },
  videos: {
    eyebrow: 'SCHOOL VIDEOS',
    title: '用视频了解 Philinter',
    intro: '校园、宿舍、课堂和生活的实拍视频。',
    badge: 'Philinter 学校视频',
    lifeTitle: '校园短片',
    interviewTitle: '学员访谈',
  },
  rooms: {
    photoTitle: '房型实景',
    photoIntro: PHILINTER_PAGE_TEXT.roomsPhotoIntro,
    rulesTitle: '短期费率、入住离校与宿舍规定',
    rulesHint: '1–3周住宿费比例、入住离校、门禁与宿舍规定',
    dormRulesTitle: '宿舍与 Azon 公寓规定',
  },
  quote: {
    ...CIA_PAGE_COPY.quote,
    compareShortcuts: [
      { focus: 'room', label: '比房型', hint: '如校内三人间、双人间和Azon公寓' },
      { focus: 'course', label: '比同类课程', hint: '如强化ESL和综合ESL' },
      { focus: 'weeks', label: '比周数', hint: '如4周、8周、12周' },
    ],
  },
  fees: CIA_PAGE_COPY.fees,
  refund: PHILINTER_REFUND_COPY,
  practicalGuide: {
    summaryTitle: '到校须知与学校服务',
    summaryHint: '第一周安排、用餐与开放时间、清洁洗衣、看病、周边、Azon公寓、其他收费',
    intro: '出发前和到校后最常问到的安排。',
  },
  sida: {
    ...CIA_PAGE_COPY.sida,
    title: brandPhilinter(CIA_PAGE_COPY.sida.title),
    photoAlt: brandPhilinter(CIA_PAGE_COPY.sida.photoAlt),
    photoCaption: brandPhilinter(CIA_PAGE_COPY.sida.photoCaption),
  },
  faq: CIA_PAGE_COPY.faq,
  finalCta: {
    title: PHILINTER_PAGE_TEXT.finalCtaTitle,
    text: PHILINTER_PAGE_TEXT.finalCtaText,
    primaryLabel: '获取 Philinter 完整报价单',
    secondaryLabel: '咨询当前空房',
  },
};

const PHILINTER_INITIAL_ROOM_RATE_GROUPS: RoomRateGroup[] = [...new Set(defaults.rooms.map(room => room.group))].map(title => ({
  title,
  rooms: defaults.rooms
    .filter(room => room.enabled && room.group === title)
    .map(room => ({ id: room.id, label: room.label, code: room.code, location: room.location })),
}));

const albumVideo = (item: PhilinterVideo): PhVideoItem => ({
  title: item.title,
  text: item.description,
  src: philinterVideoSrc(item),
  poster: philinterVideoPoster(item),
  duration: item.duration,
  shape: item.orientation === 'landscape' ? 'wide' : 'tall',
});
const shortVideo = (item: PhilinterVideo): CiaShortVideo => ({
  title: item.title,
  text: item.description,
  src: philinterVideoSrc(item),
  poster: philinterVideoPoster(item),
  duration: item.duration,
  ...(item.orientation === 'landscape' ? { shape: 'wide' as const } : {}),
});

const PHILINTER_VIDEO_TOPICS: ReadonlyArray<PhilinterVideo['topic']> = ['校园', '宿舍', '课程', '活动', '学员访谈'];
const PHILINTER_VIDEO_TABS: PhVideoTab[] = PHILINTER_VIDEO_TOPICS
  .map(topic => ({
    label: topic === '学员访谈' ? topic : `${topic}视频`,
    icon: 'videocam',
    items: PHILINTER_VIDEOS.filter(item => item.topic === topic).map(albumVideo),
  }))
  .filter(tab => tab.items.length > 0);

/** A room's own clip opens its photo album (only a clip of exactly that room type). */
const roomVideos = (): Record<string, PhVideoItem> => {
  const result: Record<string, PhVideoItem> = {};
  for (const item of PHILINTER_VIDEOS) {
    if (item.roomProfileId && !result[item.roomProfileId]) result[item.roomProfileId] = albumVideo(item);
  }
  return result;
};

export const PHILINTER_PAGE_PROFILE: PhSchoolProfile = {
  code: 'PHILINTER',
  name: 'Philinter',
  previewPrefix: 'philinter',
  pricingSchoolName: '菲律宾宿务Philinter语言学校',
  copy: PHILINTER_COPY,
  compactLayout: true,
  overviewFacts: PHILINTER_OVERVIEW_FACTS,
  videoTabs: PHILINTER_VIDEO_TABS,
  courseHighlights: {
    'ielts-guarantee-8-weeks': { badge: '含1次官方雅思考试' },
    'ielts-guarantee-12-weeks': { badge: '含1次官方雅思考试' },
    'booster-speaking': { badge: '2027年1月起开课' },
    pte: { badge: '2027年1月起开课' },
  },
  roomVideos: roomVideos(),
  gallery: {
    categories: CIA_GALLERY_CATEGORIES,
    albumCategories: ['校园', '教室', '住宿', '餐厅', '设施'],
    images: PHILINTER_GALLERY_IMAGES,
    heroCategories: ['校园', '设施', '住宿'],
    albumDescriptions: PHILINTER_ALBUM_DESCRIPTIONS,
    uploadedPhotoTitle: 'Philinter 学校媒体',
    uploadedPhotoDescription: 'Philinter 学校实景内容',
    uploadedVideoTitle: 'Philinter 学校视频',
  },
  snapshotCards: PHILINTER_QUICK_INFO,
  basicInfo: PHILINTER_BASIC_INFO,
  suitableFor: PHILINTER_SUITABLE_FOR.map(title => ({ title, text: '' })),
  notSuitableFor: PHILINTER_NOT_SUITABLE_FOR.map(title => ({ title, text: '' })),
  campusBuildings: PHILINTER_CAMPUS_BUILDINGS,
  videoCards: [],
  campusLifeVideos: PHILINTER_VIDEOS.filter(item => item.topic !== '学员访谈').map(shortVideo),
  interviewVideos: PHILINTER_VIDEOS.filter(item => item.topic === '学员访谈').map(shortVideo),
  courseGroups: [
    { icon: 'forum', title: '综合英语 ESL', text: '强化、综合和轻松三种强度', courseIds: ['intensive-esl', 'general-esl', 'light-esl'] },
    {
      icon: 'record_voice_over', title: '口语强化', text: '集中练开口、发音和表达',
      courseIds: ['intensive-power-speaking', 'booster-speaking', 'speaking'],
    },
    {
      icon: 'workspace_premium', title: '雅思与PTE', text: '保分班、强化班、16周课程和PTE',
      courseIds: ['ielts-guarantee-8-weeks', 'ielts-guarantee-12-weeks', 'ielts-intensive', 'ielts-16-weeks-6-5', 'ielts-16-weeks-5-5', 'pte'],
    },
    { icon: 'fact_check', title: '托业 TOEIC', text: '保分班和常规班', courseIds: ['toeic-guarantee-12-weeks', 'toeic-regular'] },
    { icon: 'business_center', title: '商务英语', text: '基础和进阶', courseIds: ['basic-business', 'advanced-business', 'focus-industry'] },
    {
      icon: 'family_restroom', title: '青少年', text: '须与监护人同住，监护人报轻松ESL',
      courseIds: ['junior-esl-12-17-years', 'junior-ielts-12-17-years', 'junior-speaking'],
    },
  ],
  studyModes: PHILINTER_STUDY_MODES,
  courseDetailGuides: PHILINTER_COURSE_DETAIL_GUIDES,
  scheduleColumns: PHILINTER_SCHEDULE_COLUMNS,
  initialCourseFees: initialPricing.courseFees,
  initialRoomFees: initialPricing.roomFees,
  initialRoomRateGroups: PHILINTER_INITIAL_ROOM_RATE_GROUPS,
  roomGroupNotes: {
    'Azon 校外公寓': '没有门禁，可以自己做饭；上课日有接送车。',
  },
  showRoomCodes: false,
  dormRules: PHILINTER_DORM_RULES,
  roomProfiles: PHILINTER_ROOM_PROFILES,
  ieltsResults: [],
  studentReviews: [],
  reviewPath: '',
  holidayCalendars: PHILINTER_HOLIDAY_CALENDARS,
  ieltsComputerExamDates2027: [],
  studentCareServices: [],
  campusPracticalGuides: PHILINTER_PRACTICAL_GUIDES,
  studentTracks: [],
  sidaReasons: CIA_SIDA_REASONS.map(reason => ({ ...reason, alt: brandPhilinter(reason.alt) })),
  sidaTrustBadges: CIA_SIDA_TRUST_BADGES,
  ctaBadges: PHILINTER_FINAL_CTA_BADGES,
  ctaConsultants: CIA_CTA_CONSULTANTS,
  mobileAnchors: [
    { label: '视频', target: 'gallery', icon: 'smart_display' },
    { label: '概览', target: 'overview', icon: 'dashboard' },
    { label: '课程', target: 'courses', icon: 'menu_book' },
    { label: '住宿', target: 'rooms', icon: 'bed' },
    { label: '报价', target: 'quote', icon: 'calculate' },
    { label: 'FAQ', target: 'faq', icon: 'help' },
  ],
  faqs: () => PHILINTER_FAQS.map(item => ({ ...item })),
  shows2026Prices: () => false,
  defaultContent: createDefaultPhilinterContentConfig,
  cloneContent: clonePhilinterContentConfig,
};

// PINES content for the shared Philippine school page (school-page/ph-school-page.component.*).
// Text and data come from pines-page-content.ts; prices and rules from pines-content-config.ts.
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
import type { PhPageCopy, PhSchoolProfile, PhVideoItem } from '../school-page/ph-school-profile';
import {
  clonePinesContentConfig,
  createDefaultPinesContentConfig,
  PINES_2027_PRICE_REGISTRATION_START,
} from './pines-content-config';
import {
  PINES_ALBUM_DESCRIPTIONS,
  PINES_BASIC_INFO,
  PINES_CAMPUS_BUILDINGS,
  PINES_CAMPUS_TOUR,
  PINES_CAMPUS_VIDEOS,
  PINES_COURSE_VIDEOS,
  PINES_ROOM_VIDEOS,
  PINES_COURSE_DETAIL_GUIDES,
  PINES_FAQS,
  PINES_FINAL_CTA_BADGES,
  PINES_GALLERY_IMAGES,
  PINES_HOLIDAY_CALENDARS,
  PINES_IELTS_GUARANTEE_IDS,
  PINES_MAKEUP_NOTE,
  PINES_NOT_SUITABLE_FOR,
  PINES_OVERVIEW_FACTS,
  PINES_PAGE_TEXT,
  PINES_PRACTICAL_GUIDES,
  PINES_QUICK_INFO,
  PINES_REFERENCE_NOTE,
  PINES_ROOM_PROFILES,
  PINES_SUITABLE_FOR,
} from './pines-page-content';

const defaults = createDefaultPinesContentConfig();
const initialPricing = createCiaQuotePricing(defaults);
const brandPines = (text: string) => text.replace(/CIA/g, 'PINES');

/** Local date (YYYY-MM-DD); 2026 prices stay on the list until 2027 prices start for new registrations. */
export const pinesLocalToday = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};
export const pinesListsTwoPriceYears = (): boolean => pinesLocalToday() < PINES_2027_PRICE_REGISTRATION_START;

const PINES_COPY: PhPageCopy = {
  swipeHint: CIA_PAGE_COPY.swipeHint,
  referenceNote: PINES_REFERENCE_NOTE,
  hero: {
    breadcrumb: '菲律宾游学 / 碧瑶学校 / PINES',
    title: '菲律宾碧瑶 PINES 语言学校',
    lead: PINES_PAGE_TEXT.heroLead,
    tags: [
      { icon: 'location_on', text: '菲律宾碧瑶' },
      { icon: 'history_edu', text: '2001年创办' },
      { icon: 'workspace_premium', text: '校内雅思、托业官方考点' },
      { icon: 'apartment', text: '教学、住宿、餐厅在一栋楼' },
    ],
  },
  overview: { title: '30 秒看懂 PINES' },
  advisorReview: {
    title: '顾问怎么看 PINES',
    text: PINES_PAGE_TEXT.advisorText,
    suitableTitle: '适合谁',
    notSuitableTitle: '报名前想清楚',
  },
  campus: {
    eyebrow: 'CAMPUS AT A GLANCE',
    title: 'PINES 校园介绍',
    intro: PINES_PAGE_TEXT.campusIntro,
  },
  gallery: {
    title: '按区域查看 PINES 环境',
    intro: PINES_PAGE_TEXT.galleryIntro,
    photoNote: CIA_PAGE_COPY.gallery.photoNote,
    roomComparisonTitle: '房型对比',
    roomDisclaimer: PINES_REFERENCE_NOTE,
  },
  courses: {
    title: 'PINES 课程怎么选？',
    intro: PINES_PAGE_TEXT.coursesIntro,
    priceUnit: '/4周',
    oldPriceLabel: '2027/02/01起报名',
    fitLabel: '适合人群',
    noteLabel: '课程说明',
    detailSummaryTitle: '查看课程细节',
    detailSummaryHint: '雅思保分班、模考安排、青少年雅思营、亲子课程和EB Pro',
    guideTitle: '报名前值得确认的课程细节',
  },
  planning: {
    summaryTitle: '2027年假期、补课与暑期旺季',
    summaryHint: '3–4月学校假期和周六补课日、暑期旺季附加费档期',
  },
  calendar: {
    eyebrow: 'ACADEMIC CALENDAR',
    title: 'PINES 2027年日历',
    intro: '学校目前公布了2027年3–4月的假期和补课日，其他月份以学校通知为准；暑期旺季按周收附加费。',
    peakEyebrow: '2027 PEAK SEASON',
    peakTitle: '2027年暑期旺季',
    peakIntro: '课程或住宿覆盖以下学习周时，每名学生按实际重叠的周数收旺季附加费。',
    peakNote: '入学按周日、离校按周六；课程与住宿在同一周只算一次，旺季附加费不打折。',
    provisionalLabel: '日期待官方确认',
    footnote: `${PINES_MAKEUP_NOTE}开斋节日期待官方确认，假期以学校当期通知为准。`,
  },
  videos: {
    eyebrow: 'SCHOOL VIDEO',
    title: '用视频了解 PINES',
    intro: '学校2026年的官方校园导览，从一楼到5楼逐层介绍教室、宿舍、餐厅和健身房。',
    badge: 'PINES 官方视频',
  },
  rooms: {
    photoTitle: '房型实景',
    photoIntro: PINES_PAGE_TEXT.roomsPhotoIntro,
    rulesTitle: '短期费率与入住离校',
    rulesHint: '2–3周住宿费比例、入住离校、用餐和多住一晚费用',
  },
  quote: {
    ...CIA_PAGE_COPY.quote,
    compareShortcuts: [
      { focus: 'room', label: '比房型', hint: '如单人房、双人房和多人间' },
      { focus: 'course', label: '比同类课程', hint: '如口语强化和密集英语、雅思常规和预科' },
      { focus: 'weeks', label: '比周数', hint: '如4周、8周、12周' },
    ],
  },
  fees: CIA_PAGE_COPY.fees,
  practicalGuide: {
    summaryTitle: '出发前与到校须知',
    summaryHint: '分级测试、接机、现金、第一天安排、用餐、设施时间和其他收费',
    intro: '出发前和到校后最常问到的安排。',
  },
  sida: {
    ...CIA_PAGE_COPY.sida,
    title: brandPines(CIA_PAGE_COPY.sida.title),
    photoAlt: brandPines(CIA_PAGE_COPY.sida.photoAlt),
    photoCaption: brandPines(CIA_PAGE_COPY.sida.photoCaption),
  },
  faq: CIA_PAGE_COPY.faq,
  finalCta: {
    title: PINES_PAGE_TEXT.finalCtaTitle,
    text: PINES_PAGE_TEXT.finalCtaText,
    primaryLabel: '获取 PINES 完整报价单',
    secondaryLabel: '咨询当前空房',
  },
};

const PINES_INITIAL_ROOM_RATE_GROUPS: RoomRateGroup[] = [...new Set(defaults.rooms.map(room => room.group))].map(title => ({
  title,
  rooms: defaults.rooms
    .filter(room => room.enabled && room.group === title)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(room => ({ id: room.id, label: room.label, code: room.code, location: room.location })),
}));

const tourVideo: PhVideoItem = {
  title: PINES_CAMPUS_TOUR.title,
  text: PINES_CAMPUS_TOUR.description,
  src: PINES_CAMPUS_TOUR.src,
  poster: PINES_CAMPUS_TOUR.poster,
  duration: PINES_CAMPUS_TOUR.duration,
  shape: 'wide',
};
const tourCard: CiaVideoCard = {
  code: 'PINES',
  label: 'CAMPUS TOUR',
  title: PINES_CAMPUS_TOUR.title,
  text: PINES_CAMPUS_TOUR.description,
  poster: PINES_CAMPUS_TOUR.poster,
  videoSrc: PINES_CAMPUS_TOUR.src,
  contentType: 'video/mp4',
  details: [...PINES_CAMPUS_TOUR.details, `时长 ${PINES_CAMPUS_TOUR.duration}`],
};

export const PINES_PAGE_PROFILE: PhSchoolProfile = {
  code: 'PINES',
  name: 'PINES',
  previewPrefix: 'pines',
  pricingSchoolName: '菲律宾碧瑶PINES语言学校',
  copy: PINES_COPY,
  compactLayout: true,
  overviewFacts: PINES_OVERVIEW_FACTS,
  overviewReferenceNote: true,
  videoTabs: [
    { label: '校园视频', icon: 'videocam', items: [tourVideo, ...PINES_CAMPUS_VIDEOS] },
    { label: '宿舍视频', icon: 'videocam', items: Object.values(PINES_ROOM_VIDEOS) },
    { label: '课程视频', icon: 'videocam', items: PINES_COURSE_VIDEOS },
  ],
  courseHighlights: Object.fromEntries(PINES_IELTS_GUARANTEE_IDS.map(id => [id, {
    badge: '含1次官方雅思考试',
    label: '考试福利',
    text: '课程期间安排1次官方雅思考试，不用另付考试费。',
  }])),
  // Each room album opens with that room type's own clip; the B and C singles share one suite and one clip.
  roomVideos: {
    'single-b': PINES_ROOM_VIDEOS.singleBc,
    'single-c': PINES_ROOM_VIDEOS.singleBc,
    'twin-a': PINES_ROOM_VIDEOS.twinA,
    'dorm-4': PINES_ROOM_VIDEOS.quad,
    'dorm-6': PINES_ROOM_VIDEOS.sextuple,
  },
  gallery: {
    categories: CIA_GALLERY_CATEGORIES,
    albumCategories: ['校园', '教室', '住宿', '餐厅', '设施'],
    images: PINES_GALLERY_IMAGES,
    heroCategories: ['校园', '教室', '设施'],
    albumDescriptions: PINES_ALBUM_DESCRIPTIONS,
    uploadedPhotoTitle: 'PINES 学校媒体',
    uploadedPhotoDescription: 'PINES 学校实景内容',
    uploadedVideoTitle: 'PINES 学校视频',
  },
  snapshotCards: PINES_QUICK_INFO,
  basicInfo: PINES_BASIC_INFO,
  suitableFor: PINES_SUITABLE_FOR.map(title => ({ title, text: '' })),
  notSuitableFor: PINES_NOT_SUITABLE_FOR.map(title => ({ title, text: '' })),
  campusBuildings: PINES_CAMPUS_BUILDINGS,
  videoCards: [tourCard],
  campusLifeVideos: [],
  interviewVideos: [],
  courseGroups: [
    {
      icon: 'record_voice_over', title: '口语与综合英语', text: '大量开口，或听说读写一起提高',
      courseIds: ['power-speaking', 'intensive-esl', 'light-esl-4', 'power-esl-5', 'power-esl-7'],
    },
    { icon: 'business_center', title: '商务英语', text: '职场沟通、开会和演讲', courseIds: ['business-english-practical', 'business-english-executive'] },
    { icon: 'fact_check', title: '托业 TOEIC', text: '托业、托业口语和8周保分班', courseIds: ['toeic-guarantee-8-weeks', 'toeic-toeic-speaking'] },
    {
      icon: 'workspace_premium', title: '雅思 IELTS', text: '保分班、预科、常规和口语写作密集',
      courseIds: [...PINES_IELTS_GUARANTEE_IDS, 'pre-ielts', 'ielts-regular', 'ielts-intensive'],
    },
    {
      icon: 'family_restroom', title: '青少年与亲子', text: '13–17岁青少年雅思营；7–15岁孩子和陪读家长',
      courseIds: ['global-youth-ielts', 'junior-family-course', 'parents-course'],
    },
  ],
  studyModes: [],
  courseDetailGuides: PINES_COURSE_DETAIL_GUIDES,
  scheduleColumns: [],
  initialCourseFees: initialPricing.courseFees,
  initialRoomFees: initialPricing.roomFees,
  initialRoomRateGroups: PINES_INITIAL_ROOM_RATE_GROUPS,
  showRoomCodes: false,
  dormRules: [],
  roomProfiles: PINES_ROOM_PROFILES,
  ieltsResults: [],
  studentReviews: [],
  reviewPath: '',
  holidayCalendars: PINES_HOLIDAY_CALENDARS,
  ieltsComputerExamDates2027: [],
  studentCareServices: [],
  campusPracticalGuides: PINES_PRACTICAL_GUIDES,
  studentTracks: [],
  sidaReasons: CIA_SIDA_REASONS.map(reason => ({ ...reason, alt: brandPines(reason.alt) })),
  sidaTrustBadges: CIA_SIDA_TRUST_BADGES,
  ctaBadges: PINES_FINAL_CTA_BADGES,
  ctaConsultants: CIA_CTA_CONSULTANTS,
  mobileAnchors: [
    { label: '视频', target: 'gallery', icon: 'smart_display' },
    { label: '概览', target: 'overview', icon: 'dashboard' },
    { label: '课程', target: 'courses', icon: 'menu_book' },
    { label: '住宿', target: 'rooms', icon: 'bed' },
    { label: '报价', target: 'quote', icon: 'calculate' },
    { label: 'FAQ', target: 'faq', icon: 'help' },
  ],
  faqs: () => PINES_FAQS.map(item => ({ ...item })),
  shows2026Prices: pinesListsTwoPriceYears,
  defaultContent: createDefaultPinesContentConfig,
  cloneContent: clonePinesContentConfig,
};

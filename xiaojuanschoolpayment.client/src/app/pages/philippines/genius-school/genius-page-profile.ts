// Genius English Academy content for the shared Philippine school page (school-page/ph-school-page.component.*).
// Text comes from genius-page-content.ts, photos and videos from genius-page-media.ts, prices and rules from
// genius-content-config.ts. Keep it pure data (no Angular, DOM or storage), like the modules it reads.
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
import { GENIUS_SHORT_PRICES, cloneGeniusContentConfig, createDefaultGeniusContentConfig } from './genius-content-config';
import {
  GENIUS_BASIC_INFO,
  GENIUS_COURSE_DETAIL_GUIDES,
  GENIUS_COURSE_GROUPS,
  GENIUS_DORM_RULES,
  GENIUS_FAQS,
  GENIUS_FINAL_CTA_BADGES,
  GENIUS_NOT_SUITABLE_FOR,
  GENIUS_OFFERS,
  GENIUS_OFFERS_COPY,
  GENIUS_OVERVIEW_FACTS,
  GENIUS_PAGE_TEXT,
  GENIUS_PRACTICAL_GUIDES,
  GENIUS_QUICK_INFO,
  GENIUS_REFERENCE_NOTE,
  GENIUS_REFUND_COPY,
  GENIUS_SCHEDULE,
  GENIUS_STUDY_MODES,
  GENIUS_STUDY_MODE_COPY,
  GENIUS_SUITABLE_FOR,
} from './genius-page-content';
import {
  GENIUS_ALBUM_DESCRIPTIONS,
  GENIUS_GALLERY_IMAGES,
  GENIUS_ROOM_PROFILES,
  GENIUS_ROOM_VIDEOS,
  GENIUS_VIDEO_TABS,
} from './genius-page-media';

const defaults = createDefaultGeniusContentConfig();
const AFTERNOON_START = GENIUS_SCHEDULE.findIndex(row => row.time.startsWith('12:00'));
const initialPricing = createCiaQuotePricing(defaults);
const brandGenius = (text: string) => text.replace(/CIA/g, 'Genius');

/** The room price list's short-stay block: the school's exact 1–3-week room prices instead of ratios. */
const shortRoomPrices = (weeks: '1' | '2' | '3') => (['single', 'double', 'triple', 'quad'] as const)
  .map(id => GENIUS_SHORT_PRICES[id][weeks].toLocaleString('en-US')).join('／');

const GENIUS_COPY: PhPageCopy = {
  swipeHint: CIA_PAGE_COPY.swipeHint,
  referenceNote: GENIUS_REFERENCE_NOTE,
  hero: {
    breadcrumb: '菲律宾游学 / 宿务学校 / Genius',
    title: '菲律宾宿务 Genius English Academy 语言学校',
    lead: GENIUS_PAGE_TEXT.heroLead,
    tags: [
      { icon: 'beach_access', text: '麦克坦岛海边' },
      { icon: 'record_voice_over', text: '本地老师一对一＋外教小组课' },
      { icon: 'tune', text: '常规／半斯巴达／斯巴达' },
      { icon: 'family_restroom', text: '亲子课程' },
    ],
    quoteLabel: '获取 Genius 最新报价',
  },
  overview: { title: '30 秒看懂 Genius' },
  advisorReview: {
    title: '顾问怎么看 Genius',
    text: GENIUS_PAGE_TEXT.advisorText,
    suitableTitle: '适合谁',
    notSuitableTitle: '报名前想清楚',
  },
  campus: {
    eyebrow: 'CAMPUS AT A GLANCE',
    title: 'Genius 校园介绍',
    intro: GENIUS_PAGE_TEXT.campusIntro,
  },
  gallery: {
    title: '按区域查看 Genius 环境',
    intro: GENIUS_PAGE_TEXT.galleryIntro,
    photoNote: CIA_PAGE_COPY.gallery.photoNote,
    roomComparisonTitle: '房型对比',
    roomDisclaimer: GENIUS_REFERENCE_NOTE,
  },
  courses: {
    title: 'Genius 课程怎么选？',
    intro: GENIUS_PAGE_TEXT.coursesIntro,
    priceUnit: '/4周',
    fitLabel: '适合人群',
    noteLabel: '课程说明',
    detailSummaryTitle: '查看课程细节与每日作息',
    detailSummaryHint: '课程内容、亲子课程、加课和管理方式、考试与出勤规定',
    guideTitle: '报名前值得确认的课程细节',
  },
  studyModes: GENIUS_STUDY_MODE_COPY,
  schedule: {
    eyebrow: 'DAILY TIMETABLE',
    title: 'Genius 每日作息（周一至周五）',
    intro: '学校的示例作息，每节课50分钟；实际课表按所选课程和管理方式安排。',
    badge: '电影之夜每周二、周四',
  },
  videos: {
    eyebrow: 'SCHOOL VIDEOS',
    title: '用视频了解 Genius',
    intro: '学校拍的校园、课堂、宿舍和餐厅。',
    badge: 'Genius 学校视频',
  },
  rooms: {
    photoTitle: '房型实景',
    photoIntro: GENIUS_PAGE_TEXT.roomsPhotoIntro,
    rulesTitle: '短期房费、入住与宿舍规定',
    rulesHint: '1–3周房费、入住和换房、门禁与宿舍规定',
    dormRulesTitle: '宿舍与外出规定',
  },
  offers: GENIUS_OFFERS_COPY,
  quote: {
    ...CIA_PAGE_COPY.quote,
    compareShortcuts: [
      { focus: 'room', label: '比房型', hint: '如四人间、双人间和海景房' },
      { focus: 'course', label: '比同类课程', hint: '如一般英语A、B、C、D' },
      { focus: 'weeks', label: '比周数', hint: '如4周、8周、12周' },
    ],
  },
  fees: CIA_PAGE_COPY.fees,
  refund: GENIUS_REFUND_COPY,
  practicalGuide: {
    summaryTitle: '到校须知与学校服务',
    summaryHint: '开放时间、打扫洗衣、校内规定、到校与费用',
    intro: '出发前和到校后最常问到的安排。',
  },
  sida: {
    ...CIA_PAGE_COPY.sida,
    title: brandGenius(CIA_PAGE_COPY.sida.title),
    photoAlt: brandGenius(CIA_PAGE_COPY.sida.photoAlt),
    photoCaption: brandGenius(CIA_PAGE_COPY.sida.photoCaption),
  },
  faq: CIA_PAGE_COPY.faq,
  finalCta: {
    title: GENIUS_PAGE_TEXT.finalCtaTitle,
    text: GENIUS_PAGE_TEXT.finalCtaText,
    primaryLabel: '获取 Genius 完整报价单',
    secondaryLabel: '咨询当前空房',
  },
};

const GENIUS_INITIAL_ROOM_RATE_GROUPS: RoomRateGroup[] = [...new Set(defaults.rooms.map(room => room.group))].map(title => ({
  title,
  rooms: defaults.rooms
    .filter(room => room.enabled && room.group === title)
    .map(room => ({ id: room.id, label: room.label, code: room.code, location: room.location })),
}));

export const GENIUS_PAGE_PROFILE: PhSchoolProfile = {
  code: defaults.schoolCode,
  name: 'Genius',
  previewPrefix: 'genius',
  pricingSchoolName: '菲律宾宿务Genius English Academy语言学校',
  copy: GENIUS_COPY,
  compactLayout: true,
  overviewFacts: GENIUS_OVERVIEW_FACTS,
  videoTabs: GENIUS_VIDEO_TABS,
  roomVideos: GENIUS_ROOM_VIDEOS,
  offers: GENIUS_OFFERS,
  shortStayRows: [
    { label: '1周', text: `单人／双人／三人／四人间 ${shortRoomPrices('1')} 美元` },
    { label: '2周', text: `${shortRoomPrices('2')} 美元` },
    { label: '3周', text: `${shortRoomPrices('3')} 美元` },
    { label: '海景房', text: '每4周多125美元，短期按周数折算' },
  ],
  gallery: {
    categories: CIA_GALLERY_CATEGORIES,
    albumCategories: ['校园', '教室', '住宿', '餐厅', '设施'],
    images: GENIUS_GALLERY_IMAGES,
    heroCategories: ['校园', '设施', '住宿'],
    albumDescriptions: GENIUS_ALBUM_DESCRIPTIONS,
    uploadedPhotoTitle: 'Genius 学校媒体',
    uploadedPhotoDescription: 'Genius 学校实景内容',
    uploadedVideoTitle: 'Genius 学校视频',
  },
  snapshotCards: GENIUS_QUICK_INFO,
  basicInfo: GENIUS_BASIC_INFO,
  suitableFor: GENIUS_SUITABLE_FOR.map(title => ({ title, text: '' })),
  notSuitableFor: GENIUS_NOT_SUITABLE_FOR.map(title => ({ title, text: '' })),
  campusBuildings: [],
  videoCards: [],
  campusLifeVideos: [],
  interviewVideos: [],
  courseGroups: GENIUS_COURSE_GROUPS,
  studyModes: GENIUS_STUDY_MODES,
  courseDetailGuides: GENIUS_COURSE_DETAIL_GUIDES,
  scheduleColumns: [
    { code: 'MORNING', title: '上午', rows: GENIUS_SCHEDULE.slice(0, AFTERNOON_START) },
    { code: 'AFTERNOON', title: '下午和晚上', rows: GENIUS_SCHEDULE.slice(AFTERNOON_START) },
  ],
  initialCourseFees: initialPricing.courseFees,
  initialRoomFees: initialPricing.roomFees,
  initialRoomRateGroups: GENIUS_INITIAL_ROOM_RATE_GROUPS,
  roomGroupNotes: {
    海景房: '比同类普通房每4周多125美元，视空房安排；空调为分体式或窗式。',
  },
  showRoomCodes: false,
  dormRules: GENIUS_DORM_RULES,
  roomProfiles: GENIUS_ROOM_PROFILES,
  ieltsResults: [],
  studentReviews: [],
  reviewPath: '',
  holidayCalendars: [],
  ieltsComputerExamDates2027: [],
  studentCareServices: [],
  campusPracticalGuides: GENIUS_PRACTICAL_GUIDES,
  studentTracks: [],
  sidaReasons: CIA_SIDA_REASONS.map(reason => ({ ...reason, alt: brandGenius(reason.alt) })),
  sidaTrustBadges: CIA_SIDA_TRUST_BADGES,
  ctaBadges: GENIUS_FINAL_CTA_BADGES,
  ctaConsultants: CIA_CTA_CONSULTANTS,
  mobileAnchors: [
    { label: '视频', target: 'gallery', icon: 'smart_display' },
    { label: '概览', target: 'overview', icon: 'dashboard' },
    { label: '课程', target: 'courses', icon: 'menu_book' },
    { label: '住宿', target: 'rooms', icon: 'bed' },
    { label: '优惠', target: 'offers', icon: 'local_offer' },
    { label: '报价', target: 'quote', icon: 'calculate' },
    { label: 'FAQ', target: 'faq', icon: 'help' },
  ],
  faqs: () => GENIUS_FAQS.map(item => ({ ...item })),
  shows2026Prices: () => false,
  defaultContent: createDefaultGeniusContentConfig,
  cloneContent: cloneGeniusContentConfig,
};

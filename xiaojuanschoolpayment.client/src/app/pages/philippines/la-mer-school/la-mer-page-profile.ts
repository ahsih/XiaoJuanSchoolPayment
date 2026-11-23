// EV Academy La Mer content for the shared Philippine school page (school-page/ph-school-page.component.*).
// Text and data come from la-mer-page-content.ts; prices, offers and family packages from la-mer-content-config.ts.
// Keep it pure data (no Angular, DOM or storage), like the modules it reads.
import { SIDA_PHILIPPINES_CONSULTANTS } from '../../../components/sida-consultants';
import { createCiaQuotePricing } from '../cia-school/cia-quote-engine';
import {
  CIA_GALLERY_CATEGORIES,
  CIA_PAGE_COPY,
  CIA_SIDA_REASONS,
  CIA_SIDA_TRUST_BADGES,
  type RoomRateGroup,
} from '../cia-school/cia-page-content';
import type { PhPageCopy, PhSchoolProfile } from '../school-page/ph-school-profile';
import { cloneLaMerContentConfig, createDefaultLaMerContentConfig, LA_MER_SCHOOL_NAME } from './la-mer-content-config';
import {
  LA_MER_ALBUM_DESCRIPTIONS,
  LA_MER_BASIC_INFO,
  LA_MER_CAMPUS_BUILDINGS,
  LA_MER_COURSE_DETAIL_GUIDES,
  LA_MER_COURSE_GROUPS,
  LA_MER_CTA_BADGES,
  LA_MER_DORM_RULES,
  LA_MER_FAQS,
  LA_MER_GALLERY_IMAGES,
  LA_MER_NOT_SUITABLE_FOR,
  LA_MER_OVERVIEW_FACTS,
  LA_MER_PAGE_COPY,
  LA_MER_PRACTICAL_GUIDES,
  LA_MER_QUICK_INFO,
  LA_MER_REFERENCE_NOTE,
  LA_MER_ROOM_PROFILES,
  LA_MER_ROOM_VIDEOS,
  LA_MER_SCHEDULE,
  LA_MER_SUITABLE_FOR,
  LA_MER_VIDEO_TABS,
} from './la-mer-page-content';

const defaults = createDefaultLaMerContentConfig();
const initialPricing = createCiaQuotePricing(defaults);
const brand = (text: string) => text.replace(/CIA/g, 'EV La Mer');

const LA_MER_COPY: PhPageCopy = {
  swipeHint: CIA_PAGE_COPY.swipeHint,
  referenceNote: LA_MER_REFERENCE_NOTE,
  hero: {
    breadcrumb: LA_MER_PAGE_COPY.breadcrumb,
    title: LA_MER_PAGE_COPY.title,
    lead: LA_MER_PAGE_COPY.heroLead,
    tags: [
      { icon: 'location_on', text: '宿务麦克坦岛' },
      { icon: 'rule', text: '半斯巴达' },
      { icon: 'family_restroom', text: '成人 / 熟龄 / 亲子' },
      { icon: 'pool', text: '度假村式校园' },
    ],
    quoteLabel: '获取 La Mer 最新报价',
  },
  overview: { title: LA_MER_PAGE_COPY.overviewTitle },
  advisorReview: {
    title: '顾问怎么看 EV La Mer',
    text: LA_MER_PAGE_COPY.advisorText,
    suitableTitle: '适合谁',
    notSuitableTitle: '报名前想清楚',
  },
  campus: {
    eyebrow: 'CAMPUS AT A GLANCE',
    title: 'EV La Mer 校园介绍',
    intro: LA_MER_PAGE_COPY.campusIntro,
  },
  gallery: {
    title: '按区域查看 EV La Mer 环境',
    intro: LA_MER_PAGE_COPY.galleryIntro,
    photoNote: CIA_PAGE_COPY.gallery.photoNote,
    roomComparisonTitle: '房型对比',
    roomDisclaimer: LA_MER_REFERENCE_NOTE,
  },
  courses: {
    title: 'EV La Mer 课程怎么选？',
    intro: LA_MER_PAGE_COPY.coursesIntro,
    priceUnit: '/4周',
    fitLabel: '适合人群',
    noteLabel: '课程说明',
    detailSummaryTitle: '查看课程细节',
    detailSummaryHint: '口语强化、熟龄英语、亲子套餐和免费选修课',
    guideTitle: '报名前值得确认的课程细节',
  },
  schedule: {
    eyebrow: 'DAILY TIMETABLE',
    title: 'EV La Mer 每日作息',
    intro: '周一至周五每天10个课时段，按所选课程排8节正课，另可免费选1节选修课；空出的时段是自由时间。',
    badge: '每节45分钟',
  },
  videos: {
    eyebrow: 'SCHOOL VIDEOS',
    title: '用视频了解 EV La Mer',
    intro: '校园导览、宣传片和餐厅实拍。',
    badge: 'La Mer 视频',
  },
  rooms: {
    photoTitle: '房型实景',
    photoIntro: LA_MER_PAGE_COPY.roomsPhotoIntro,
    rulesTitle: '短期费率、入住离校与宿舍规定',
    rulesHint: '1–3周住宿费比例、入住离校、门禁和宿舍规定',
    dormRulesTitle: '门禁与宿舍规定',
  },
  quote: {
    ...CIA_PAGE_COPY.quote,
    compareShortcuts: [
      { focus: 'room', label: '比房型', hint: '如直通泳池双人间和标准双人间' },
      { focus: 'course', label: '比同类课程', hint: '如经典ESL和口语强化6、8' },
      { focus: 'weeks', label: '比周数', hint: '如4周、8周、12周' },
    ],
  },
  fees: CIA_PAGE_COPY.fees,
  practicalGuide: {
    summaryTitle: '到校须知、学校服务与活动',
    summaryHint: '第一天安排、接驳车、诊所和咖啡厅时间、活动、其他收费',
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
    title: LA_MER_PAGE_COPY.finalCtaTitle,
    text: LA_MER_PAGE_COPY.finalCtaText,
    primaryLabel: '获取 EV La Mer 完整报价单',
    secondaryLabel: '咨询当前空房',
  },
};

const LA_MER_INITIAL_ROOM_RATE_GROUPS: RoomRateGroup[] = [...new Set(defaults.rooms.map(room => room.group))].map(title => ({
  title,
  rooms: defaults.rooms
    .filter(room => room.enabled && room.group === title)
    .map(room => ({ id: room.id, label: room.label, code: room.code, location: room.location })),
}));

const LA_MER_CTA_CONSULTANTS = ['Lemon', 'Perrin', 'Iris', 'Lisa', 'Jenny']
  .map(name => SIDA_PHILIPPINES_CONSULTANTS.find(item => item.name === name))
  .filter(item => !!item)
  .map(item => item!);

export const LA_MER_PAGE_PROFILE: PhSchoolProfile = {
  code: 'EV-LAMER',
  name: 'EV La Mer',
  previewPrefix: 'ev-lamer',
  pricingSchoolName: LA_MER_SCHOOL_NAME,
  copy: LA_MER_COPY,
  // The CIA layout, the fixed template for every Philippine school (user decision 2026-11-21).
  compactLayout: true,
  overviewFacts: LA_MER_OVERVIEW_FACTS,
  videoTabs: LA_MER_VIDEO_TABS,
  roomVideos: LA_MER_ROOM_VIDEOS,
  gallery: {
    categories: CIA_GALLERY_CATEGORIES,
    albumCategories: ['校园', '教室', '住宿', '餐厅', '设施'],
    images: LA_MER_GALLERY_IMAGES.map(image => ({ ...image })),
    heroCategories: ['校园', '教室', '设施'],
    albumDescriptions: LA_MER_ALBUM_DESCRIPTIONS,
    uploadedPhotoTitle: 'EV La Mer 学校媒体',
    uploadedPhotoDescription: 'EV La Mer 学校实景内容',
    uploadedVideoTitle: 'EV La Mer 学校视频',
  },
  snapshotCards: LA_MER_QUICK_INFO,
  basicInfo: LA_MER_BASIC_INFO,
  suitableFor: LA_MER_SUITABLE_FOR.map(title => ({ title, text: '' })),
  notSuitableFor: LA_MER_NOT_SUITABLE_FOR.map(title => ({ title, text: '' })),
  campusBuildings: LA_MER_CAMPUS_BUILDINGS,
  videoCards: [],
  campusLifeVideos: [],
  interviewVideos: [],
  courseGroups: LA_MER_COURSE_GROUPS,
  studyModes: [],
  courseDetailGuides: LA_MER_COURSE_DETAIL_GUIDES,
  scheduleColumns: [{ code: 'DAILY', title: '周一至周五', rows: [...LA_MER_SCHEDULE] }],
  initialCourseFees: initialPricing.courseFees,
  initialRoomFees: initialPricing.roomFees,
  initialRoomRateGroups: LA_MER_INITIAL_ROOM_RATE_GROUPS,
  showRoomCodes: false,
  dormRules: LA_MER_DORM_RULES,
  roomProfiles: LA_MER_ROOM_PROFILES,
  ieltsResults: [],
  studentReviews: [],
  reviewPath: '',
  holidayCalendars: [],
  ieltsComputerExamDates2027: [],
  studentCareServices: [],
  campusPracticalGuides: LA_MER_PRACTICAL_GUIDES,
  studentTracks: [],
  sidaReasons: CIA_SIDA_REASONS.map(reason => ({ ...reason, alt: brand(reason.alt) })),
  sidaTrustBadges: CIA_SIDA_TRUST_BADGES,
  ctaBadges: LA_MER_CTA_BADGES,
  ctaConsultants: LA_MER_CTA_CONSULTANTS,
  // Same tabs and order as CIA; La Mer has no student-review section, so 评价 is left out.
  mobileAnchors: [
    { label: '视频', target: 'gallery', icon: 'smart_display' },
    { label: '概览', target: 'overview', icon: 'dashboard' },
    { label: '课程', target: 'courses', icon: 'menu_book' },
    { label: '住宿', target: 'rooms', icon: 'bed' },
    { label: '报价', target: 'quote', icon: 'calculate' },
    { label: 'FAQ', target: 'faq', icon: 'help' },
  ],
  faqs: () => LA_MER_FAQS.map(item => ({ ...item })),
  shows2026Prices: () => false,
  defaultContent: createDefaultLaMerContentConfig,
  cloneContent: cloneLaMerContentConfig,
};

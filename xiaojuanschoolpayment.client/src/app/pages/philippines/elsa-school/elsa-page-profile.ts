// ELSA content for the shared Philippine school page (school-page/ph-school-page.component.*).
// Text and data come from elsa-page-content.ts; prices and rules from elsa-content-config.ts.
// Keep it pure data (no Angular, DOM or storage), like the modules it reads.
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
import { cloneElsaContentConfig, createDefaultElsaContentConfig, ELSA_SCHOOL_CODE } from './elsa-content-config';
import {
  ELSA_ALBUM_DESCRIPTIONS,
  ELSA_BASIC_INFO,
  ELSA_CAMPUS_BUILDINGS,
  ELSA_CAMPUS_VIDEO,
  ELSA_COURSE_DETAIL_GUIDES,
  ELSA_DORM_RULES,
  ELSA_FAQS,
  ELSA_FINAL_CTA_BADGES,
  ELSA_GALLERY_IMAGES,
  ELSA_HOLIDAY_CALENDARS,
  ELSA_HOLIDAY_FOOTNOTE,
  ELSA_LICENSE,
  ELSA_NOT_SUITABLE_FOR,
  ELSA_OFFERS,
  ELSA_OVERVIEW_FACTS,
  ELSA_PAGE_TEXT,
  ELSA_PRACTICAL_GUIDES,
  ELSA_QUICK_INFO,
  ELSA_REFERENCE_NOTE,
  ELSA_REFUND_COPY,
  ELSA_ROOM_PROFILES,
  ELSA_SCHEDULE,
  ELSA_SUITABLE_FOR,
} from './elsa-page-content';

const defaults = createDefaultElsaContentConfig();
const AFTERNOON_START = ELSA_SCHEDULE.findIndex(row => row.time.startsWith('13:10'));
const initialPricing = createCiaQuotePricing(defaults);
/** Local date YYYY-MM-DD; FAQ entries about an ended offer hide from their `until` date. */
const localIsoDate = (date: Date): string =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
const brandElsa = (text: string) => text.replace(/CIA/g, 'ELSA');

const ELSA_COPY: PhPageCopy = {
  swipeHint: CIA_PAGE_COPY.swipeHint,
  referenceNote: ELSA_REFERENCE_NOTE,
  hero: {
    breadcrumb: '菲律宾游学 / 宿务学校 / ELSA',
    title: '菲律宾宿务 ELSA 国际语言学校',
    lead: ELSA_PAGE_TEXT.heroLead,
    tags: [
      { icon: 'location_on', text: '宿务北部' },
      { icon: 'restaurant', text: '课程含食宿' },
      { icon: 'school', text: '本地学校随班' },
      { icon: 'family_restroom', text: '家长陪读' },
    ],
    quoteLabel: '获取 ELSA 最新报价',
  },
  overview: { title: '30 秒看懂 ELSA' },
  advisorReview: {
    title: '顾问怎么看 ELSA',
    text: ELSA_PAGE_TEXT.advisorText,
    suitableTitle: '适合谁',
    notSuitableTitle: '报名前想清楚',
  },
  license: ELSA_LICENSE,
  campus: {
    eyebrow: 'CAMPUS AT A GLANCE',
    title: 'ELSA 校园介绍',
    intro: ELSA_PAGE_TEXT.campusIntro,
  },
  gallery: {
    title: '按区域查看 ELSA 环境',
    intro: ELSA_PAGE_TEXT.galleryIntro,
    photoNote: CIA_PAGE_COPY.gallery.photoNote,
    roomComparisonTitle: '房型对比',
    roomDisclaimer: ELSA_REFERENCE_NOTE,
  },
  courses: {
    title: 'ELSA 课程怎么选？',
    intro: ELSA_PAGE_TEXT.coursesIntro,
    priceUnit: '/4周 含食宿',
    fitLabel: '适合人群',
    noteLabel: '课程说明',
    detailSummaryTitle: '查看课程细节与每日作息',
    detailSummaryHint: '分级与教材、孩子和家长课程、入学与换课',
    guideTitle: '报名前值得确认的课程细节',
  },
  schedule: {
    eyebrow: 'DAILY TIMETABLE',
    title: 'ELSA 成人课程每日作息（周一至周五）',
    intro: '每节课50分钟；8节课里按所选课程排一对一、小组课或空堂，孩子的课表按年级安排。',
    badge: '晚自习自愿参加',
  },
  planning: {
    summaryTitle: '2027年学校假期与旺季',
    summaryHint: '公休日停课；寒假旺季已满，暑假旺季另收附加费',
  },
  calendar: {
    eyebrow: 'ACADEMIC CALENDAR',
    title: 'ELSA 2027年日历',
    intro: '学校假期一表看完，用于规划入学日期和周数。2027年寒假旺季已经报满；暑假旺季会另收附加费，金额学校还在确定，公布后报价器会一起更新。',
    footnote: ELSA_HOLIDAY_FOOTNOTE,
    peakEyebrow: 'PEAK SEASON',
    peakTitle: '旺季',
    peakIntro: '',
    peakNote: '',
  },
  offers: {
    eyebrow: 'OFFERS',
    title: 'ELSA 报名优惠',
    intro: '思达启航折扣和学校优惠可以叠加：课程和食宿费先享思达启航9折，再扣学校优惠。',
    note: '学校优惠名额有限、报满即止，以学校确认为准；2027年淡季优惠学校预计下个月公布。',
  },
  videos: {
    eyebrow: 'SCHOOL VIDEOS',
    title: '用视频了解 ELSA',
    intro: '学校拍的校园航拍视频。',
    badge: 'ELSA 学校视频',
  },
  rooms: {
    photoTitle: '宿舍实景',
    photoIntro: ELSA_PAGE_TEXT.roomsPhotoIntro,
    rulesTitle: '入住离校与宿舍规定',
    rulesHint: '入住离校、门禁、喝酒吸烟和换宿舍',
    dormRulesTitle: '宿舍与外出规定',
    supplementBaseLabel: '课程价已含',
  },
  quote: {
    ...CIA_PAGE_COPY.quote,
    courseFeeLabel: '课程＋食宿',
    roomFeeLabel: '房型加价',
    compareShortcuts: [
      { focus: 'room', label: '比房型', hint: '如五人间、三人间和双人间' },
      { focus: 'course', label: '比同类课程', hint: '如综合英语和密集英语' },
      { focus: 'weeks', label: '比周数', hint: '如4周、8周、12周' },
    ],
  },
  fees: CIA_PAGE_COPY.fees,
  refund: ELSA_REFUND_COPY,
  practicalGuide: {
    summaryTitle: '到校须知与学校服务',
    summaryHint: '用餐与开放时间、打扫洗衣、签证护照、出发前准备',
    intro: '出发前和到校后最常问到的安排。',
  },
  sida: {
    ...CIA_PAGE_COPY.sida,
    title: brandElsa(CIA_PAGE_COPY.sida.title),
    photoAlt: brandElsa(CIA_PAGE_COPY.sida.photoAlt),
    photoCaption: brandElsa(CIA_PAGE_COPY.sida.photoCaption),
  },
  faq: CIA_PAGE_COPY.faq,
  finalCta: {
    title: ELSA_PAGE_TEXT.finalCtaTitle,
    text: ELSA_PAGE_TEXT.finalCtaText,
    primaryLabel: '获取 ELSA 完整报价单',
    secondaryLabel: '咨询空房和优惠',
  },
};

const ELSA_INITIAL_ROOM_RATE_GROUPS: RoomRateGroup[] = [...new Set(defaults.rooms.map(room => room.group))].map(title => ({
  title,
  rooms: defaults.rooms
    .filter(room => room.enabled && room.group === title)
    .map(room => ({ id: room.id, label: room.label, code: room.code, location: room.location })),
}));

export const ELSA_PAGE_PROFILE: PhSchoolProfile = {
  code: ELSA_SCHOOL_CODE,
  name: 'ELSA',
  previewPrefix: 'elsa',
  pricingSchoolName: 'ELSA',
  copy: ELSA_COPY,
  compactLayout: true,
  overviewFacts: ELSA_OVERVIEW_FACTS,
  videoTabs: [{ label: '校园视频', icon: 'videocam', items: [ELSA_CAMPUS_VIDEO] }],
  gallery: {
    categories: CIA_GALLERY_CATEGORIES,
    albumCategories: ['校园', '教室', '住宿', '餐厅', '设施'],
    images: ELSA_GALLERY_IMAGES,
    heroCategories: ['校园', '教室', '设施'],
    albumDescriptions: ELSA_ALBUM_DESCRIPTIONS,
    uploadedPhotoTitle: 'ELSA 学校媒体',
    uploadedPhotoDescription: 'ELSA 学校实景内容',
    uploadedVideoTitle: 'ELSA 学校视频',
  },
  snapshotCards: ELSA_QUICK_INFO,
  basicInfo: ELSA_BASIC_INFO,
  suitableFor: ELSA_SUITABLE_FOR.map(title => ({ title, text: '' })),
  notSuitableFor: ELSA_NOT_SUITABLE_FOR.map(title => ({ title, text: '' })),
  campusBuildings: ELSA_CAMPUS_BUILDINGS,
  videoCards: [],
  campusLifeVideos: [],
  interviewVideos: [],
  courseGroups: [
    { icon: 'forum', title: '成人ESL', text: '按每天一对一节数分五档', courseIds: ['general', 'intensive', 'super-intensive', 'basic', 'super-basic'] },
    { icon: 'school', title: '青少年与本地学校', text: '7–14岁青少年ESL，或进本地学校随班上课', courseIds: ['junior-esl', 'schooling-half', 'schooling-all'] },
    { icon: 'child_care', title: '幼儿', text: '42个月至7岁', courseIds: ['kinder', 'nursery'] },
    {
      icon: 'family_restroom', title: '家长', text: '陪孩子来的家长可以上课，也可以只陪读',
      courseIds: ['guardian-relax', 'guardian-esl', 'guardian-group', 'guardian-golf', 'guardian-stay'],
    },
  ],
  studyModes: [],
  courseDetailGuides: ELSA_COURSE_DETAIL_GUIDES,
  scheduleColumns: [
    { code: 'MORNING', title: '上午', rows: ELSA_SCHEDULE.slice(0, AFTERNOON_START) },
    { code: 'AFTERNOON', title: '下午和晚上', rows: ELSA_SCHEDULE.slice(AFTERNOON_START) },
  ],
  initialCourseFees: initialPricing.courseFees,
  initialRoomFees: initialPricing.roomFees,
  initialRoomRateGroups: ELSA_INITIAL_ROOM_RATE_GROUPS,
  showRoomCodes: false,
  dormRules: ELSA_DORM_RULES,
  roomProfiles: ELSA_ROOM_PROFILES,
  ieltsResults: [],
  studentReviews: [],
  reviewPath: '',
  offers: ELSA_OFFERS,
  holidayCalendars: ELSA_HOLIDAY_CALENDARS,
  ieltsComputerExamDates2027: [],
  studentCareServices: [],
  campusPracticalGuides: ELSA_PRACTICAL_GUIDES,
  studentTracks: [],
  sidaReasons: CIA_SIDA_REASONS.map(reason => ({ ...reason, alt: brandElsa(reason.alt) })),
  sidaTrustBadges: CIA_SIDA_TRUST_BADGES,
  ctaBadges: ELSA_FINAL_CTA_BADGES,
  ctaConsultants: CIA_CTA_CONSULTANTS,
  mobileAnchors: [
    { label: '视频', target: 'gallery', icon: 'smart_display' },
    { label: '概览', target: 'overview', icon: 'dashboard' },
    { label: '课程', target: 'courses', icon: 'menu_book' },
    { label: '住宿', target: 'rooms', icon: 'bed' },
    { label: '报价', target: 'quote', icon: 'calculate' },
    { label: 'FAQ', target: 'faq', icon: 'help' },
  ],
  faqs: () => {
    const today = localIsoDate(new Date());
    return ELSA_FAQS.filter(item => !item.until || today < item.until).map(item => ({ ...item }));
  },
  shows2026Prices: () => false,
  defaultContent: createDefaultElsaContentConfig,
  cloneContent: cloneElsaContentConfig,
};

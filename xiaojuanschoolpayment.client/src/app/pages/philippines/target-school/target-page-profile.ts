// TARGET content for the shared Philippine school page (school-page/ph-school-page.component.*).
// Text and data come from target-page-content.ts; prices and rules from target-content-config.ts.
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
import { cloneTargetContentConfig, createDefaultTargetContentConfig, TARGET_SCHOOL_CODE } from './target-content-config';
import {
  TARGET_ALBUM_DESCRIPTIONS,
  TARGET_BASIC_INFO,
  TARGET_CAMPUS_BUILDINGS,
  TARGET_CAMPUS_VIDEO,
  TARGET_COURSE_DETAIL_GUIDES,
  TARGET_DORM_RULES,
  TARGET_FAQS,
  TARGET_FINAL_CTA_BADGES,
  TARGET_GALLERY_IMAGES,
  TARGET_HOLIDAY_CALENDARS,
  TARGET_HOLIDAY_FOOTNOTE,
  TARGET_IELTS_SCHEDULE,
  TARGET_NOT_SUITABLE_FOR,
  TARGET_OFFERS,
  TARGET_OVERVIEW_FACTS,
  TARGET_PAGE_TEXT,
  TARGET_PRACTICAL_GUIDES,
  TARGET_QUICK_INFO,
  TARGET_REFERENCE_NOTE,
  TARGET_REFUND_COPY,
  TARGET_ROOM_PROFILES,
  TARGET_ROOM_VIDEOS,
  TARGET_SCHEDULE,
  TARGET_SCHOOL_VIDEO,
  TARGET_SUITABLE_FOR,
} from './target-page-content';

const defaults = createDefaultTargetContentConfig();
const initialPricing = createCiaQuotePricing(defaults);
/** Local date YYYY-MM-DD; FAQ entries about an ended offer hide from their `until` date. */
const localIsoDate = (date: Date): string =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
const brandTarget = (text: string) => text.replace(/CIA/g, 'TARGET');

const TARGET_COPY: PhPageCopy = {
  swipeHint: CIA_PAGE_COPY.swipeHint,
  referenceNote: TARGET_REFERENCE_NOTE,
  hero: {
    breadcrumb: '菲律宾游学 / 宿务学校 / TARGET',
    title: '菲律宾宿务 TARGET Global English Academy',
    lead: TARGET_PAGE_TEXT.heroLead,
    tags: [
      { icon: 'location_on', text: '宿务 Talamban' },
      { icon: 'home', text: '课程含住宿' },
      { icon: 'rule', text: '半斯巴达' },
      { icon: 'pool', text: '泳池校园' },
    ],
    quoteLabel: '获取 TARGET 最新报价',
  },
  overview: { title: '30 秒看懂 TARGET' },
  advisorReview: {
    title: '顾问怎么看 TARGET',
    text: TARGET_PAGE_TEXT.advisorText,
    suitableTitle: '适合谁',
    notSuitableTitle: '报名前想清楚',
  },
  campus: {
    eyebrow: 'CAMPUS AT A GLANCE',
    title: 'TARGET 校园介绍',
    intro: TARGET_PAGE_TEXT.campusIntro,
  },
  gallery: {
    title: '按区域查看 TARGET 环境',
    intro: TARGET_PAGE_TEXT.galleryIntro,
    photoNote: CIA_PAGE_COPY.gallery.photoNote,
    roomComparisonTitle: '房型对比',
    roomDisclaimer: TARGET_REFERENCE_NOTE,
  },
  courses: {
    title: 'TARGET 课程怎么选？',
    intro: TARGET_PAGE_TEXT.coursesIntro,
    priceUnit: '/4周 含住宿',
    fitLabel: '适合人群',
    noteLabel: '课程说明',
    detailSummaryTitle: '查看课程细节与每日作息',
    detailSummaryHint: '课程安排、雅思保分条件、短期和节假日、入学与出勤',
    guideTitle: '报名前值得确认的课程细节',
  },
  schedule: {
    eyebrow: 'DAILY TIMETABLE',
    title: 'TARGET 每日课程表参考（周一至周五）',
    intro: '每节课45分钟；一对一、小组课和自习按所选课程排进8节里，具体科目和老师由学校在入学测试后安排。',
    badge: '以学校实际安排为准',
  },
  planning: {
    summaryTitle: '2027年学校假期与旺季',
    summaryHint: '公休日停课；2027/06/27–08/14旺季每周加40美元',
  },
  calendar: {
    eyebrow: 'ACADEMIC CALENDAR',
    title: 'TARGET 2027年日历',
    intro: '学校假期一表看完，用于规划入学日期和周数。2027年6月27日至8月14日共7周是旺季：旺季里的每一周加40美元，读满8周免收；旺季的周没有学校长期优惠。',
    footnote: TARGET_HOLIDAY_FOOTNOTE,
    peakEyebrow: 'PEAK SEASON',
    peakTitle: '旺季',
    peakIntro: '',
    peakNote: '',
  },
  offers: {
    eyebrow: 'OFFERS',
    title: 'TARGET 报名优惠',
    intro: '学校优惠和思达启航折扣可以叠加：课程＋住宿（和旺季附加费）减去学校长期优惠后，再打思达启航9折。',
    note: '优惠以学校确认为准；限时升级名额有限、额满即止。',
  },
  videos: {
    eyebrow: 'SCHOOL VIDEOS',
    title: '用视频了解 TARGET',
    intro: '学校拍的介绍视频、校园和各房型实景。',
    badge: 'TARGET 学校视频',
  },
  rooms: {
    photoTitle: '宿舍实景',
    photoIntro: TARGET_PAGE_TEXT.roomsPhotoIntro,
    rulesTitle: '入住离校与宿舍规定',
    rulesHint: '入住退房、门禁、外出、喝酒吸烟和半斯巴达',
    dormRulesTitle: '宿舍与外出规定',
    supplementBaseLabel: '课程价已含',
  },
  quote: {
    ...CIA_PAGE_COPY.quote,
    courseFeeLabel: '课程＋住宿',
    roomFeeLabel: '房型加价',
    compareShortcuts: [
      { focus: 'room', label: '比房型', hint: '如六人房、三人房和单人房' },
      { focus: 'course', label: '比同类课程', hint: '如TARGET 4和TARGET 6' },
      { focus: 'weeks', label: '比周数', hint: '如4周、8周、12周' },
    ],
  },
  fees: CIA_PAGE_COPY.fees,
  refund: TARGET_REFUND_COPY,
  practicalGuide: {
    summaryTitle: '到校须知与学校服务',
    summaryHint: '用餐与开放时间、洗衣和小卖部、签证护照、出发前准备',
    intro: '出发前和到校后最常问到的安排。',
  },
  sida: {
    ...CIA_PAGE_COPY.sida,
    title: brandTarget(CIA_PAGE_COPY.sida.title),
    photoAlt: brandTarget(CIA_PAGE_COPY.sida.photoAlt),
    photoCaption: brandTarget(CIA_PAGE_COPY.sida.photoCaption),
  },
  faq: CIA_PAGE_COPY.faq,
  finalCta: {
    title: TARGET_PAGE_TEXT.finalCtaTitle,
    text: TARGET_PAGE_TEXT.finalCtaText,
    primaryLabel: '获取 TARGET 完整报价单',
    secondaryLabel: '咨询空房和优惠',
  },
};

const TARGET_INITIAL_ROOM_RATE_GROUPS: RoomRateGroup[] = [...new Set(defaults.rooms.map(room => room.group))].map(title => ({
  title,
  rooms: defaults.rooms
    .filter(room => room.enabled && room.group === title)
    .map(room => ({ id: room.id, label: room.label, code: room.code, location: room.location })),
}));

export const TARGET_PAGE_PROFILE: PhSchoolProfile = {
  code: TARGET_SCHOOL_CODE,
  name: 'TARGET',
  previewPrefix: 'target',
  pricingSchoolName: 'TARGET',
  copy: TARGET_COPY,
  compactLayout: true,
  overviewFacts: TARGET_OVERVIEW_FACTS,
  videoTabs: [{ label: '学校视频', icon: 'videocam', items: [TARGET_SCHOOL_VIDEO, TARGET_CAMPUS_VIDEO] }],
  roomVideos: TARGET_ROOM_VIDEOS,
  gallery: {
    categories: CIA_GALLERY_CATEGORIES,
    albumCategories: ['校园', '教室', '住宿', '餐厅', '设施'],
    images: TARGET_GALLERY_IMAGES,
    heroCategories: ['校园', '教室', '设施'],
    albumDescriptions: TARGET_ALBUM_DESCRIPTIONS,
    uploadedPhotoTitle: 'TARGET 学校媒体',
    uploadedPhotoDescription: 'TARGET 学校实景内容',
    uploadedVideoTitle: 'TARGET 学校视频',
  },
  snapshotCards: TARGET_QUICK_INFO,
  basicInfo: TARGET_BASIC_INFO,
  suitableFor: TARGET_SUITABLE_FOR.map(title => ({ title, text: '' })),
  notSuitableFor: TARGET_NOT_SUITABLE_FOR.map(title => ({ title, text: '' })),
  campusBuildings: TARGET_CAMPUS_BUILDINGS,
  videoCards: [],
  campusLifeVideos: [],
  interviewVideos: [],
  courseGroups: [
    { icon: 'forum', title: 'ESL课程', text: '按每天一对一节数分档，4到8节', courseIds: ['lite4', 'target4', 'target5', 'target6', 'ultimate8'] },
    { icon: 'work', title: '打工度假准备', text: '英语面试和英文简历等实用技能', courseIds: ['working-holiday'] },
    { icon: 'school', title: '雅思课程', text: '常规班，或按学校条件读12周保分班', courseIds: ['ielts-regular', 'ielts-guarantee'] },
  ],
  studyModes: [],
  courseDetailGuides: TARGET_COURSE_DETAIL_GUIDES,
  scheduleColumns: [
    { code: 'ESL', title: '平日作息', rows: TARGET_SCHEDULE },
    { code: 'IELTS', title: '雅思课程一周安排', rows: TARGET_IELTS_SCHEDULE },
  ],
  initialCourseFees: initialPricing.courseFees,
  initialRoomFees: initialPricing.roomFees,
  initialRoomRateGroups: TARGET_INITIAL_ROOM_RATE_GROUPS,
  showRoomCodes: false,
  dormRules: TARGET_DORM_RULES,
  roomProfiles: TARGET_ROOM_PROFILES,
  ieltsResults: [],
  studentReviews: [],
  reviewPath: '',
  offers: TARGET_OFFERS,
  holidayCalendars: TARGET_HOLIDAY_CALENDARS,
  ieltsComputerExamDates2027: [],
  studentCareServices: [],
  campusPracticalGuides: TARGET_PRACTICAL_GUIDES,
  studentTracks: [],
  sidaReasons: CIA_SIDA_REASONS.map(reason => ({ ...reason, alt: brandTarget(reason.alt) })),
  sidaTrustBadges: CIA_SIDA_TRUST_BADGES,
  ctaBadges: TARGET_FINAL_CTA_BADGES,
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
    return TARGET_FAQS.filter(item => !item.until || today < item.until).map(item => ({ ...item }));
  },
  shows2026Prices: () => false,
  defaultContent: createDefaultTargetContentConfig,
  cloneContent: cloneTargetContentConfig,
};

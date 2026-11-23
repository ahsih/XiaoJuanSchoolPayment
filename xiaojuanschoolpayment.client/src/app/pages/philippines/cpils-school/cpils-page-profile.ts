// CPILS content for the shared Philippine school page (school-page/ph-school-page.component.*).
// Text and data come from cpils-page-content.ts; prices and rules from cpils-content-config.ts.
// Keep it pure data (no Angular, DOM or storage), like the modules it reads.
import { SIDA_PHILIPPINES_CONSULTANTS } from '../../../components/sida-consultants';
import { createCiaQuotePricing, type CiaQuoteCourse } from '../cia-school/cia-quote-engine';
import {
  CIA_GALLERY_CATEGORIES,
  CIA_PAGE_COPY,
  CIA_SIDA_REASONS,
  CIA_SIDA_TRUST_BADGES,
  ciaShows2026Prices,
  type RoomRateGroup,
} from '../cia-school/cia-page-content';
import type { CiaContentConfig } from '../cia-school/cia-content-config';
import type { PhPageCopy, PhSchoolProfile } from '../school-page/ph-school-profile';
import { SCHOOL_REFERENCE_NOTE } from '../school-page/school-reference-note';
import { cloneCpilsContentConfig, createDefaultCpilsContentConfig } from './cpils-content-config';
import { CPILS_CAREER_COURSE_IDS, cpilsRooms2027, cpilsVisibleCourses } from './cpils-pricing';
import {
  CPILS_BASIC_INFO,
  CPILS_CAMPUS_BUILDINGS,
  CPILS_COURSE_DETAIL_GUIDES,
  CPILS_DORM_RULES,
  CPILS_FAQS,
  CPILS_FINAL_CTA_BADGES,
  CPILS_GALLERY_IMAGES,
  CPILS_HOLIDAY_CALENDARS,
  CPILS_NOT_SUITABLE_FOR,
  CPILS_OFFERS,
  CPILS_OVERVIEW_FACTS,
  CPILS_PAGE_COPY,
  CPILS_PRACTICAL_GUIDES,
  CPILS_QUICK_INFO,
  CPILS_ROOM_PROFILES,
  CPILS_SCHEDULE,
  CPILS_SUITABLE_FOR,
  CPILS_VIDEO_CARDS,
  CPILS_LIFE_VIDEOS,
  CPILS_VIDEO_TABS,
} from './cpils-page-content';

// Shared with the cross-school comparison, so they live in the pure pricing module.
export { CPILS_HIDDEN_COURSE_IDS, cpilsRooms2027, cpilsShortStayRatios, cpilsVisibleCourses } from './cpils-pricing';


const defaults = createDefaultCpilsContentConfig();
const initialPricing = createCiaQuotePricing(defaults);
const brandCpils = (text: string) => text.replace(/CIA/g, 'CPILS');

const CPILS_COPY: PhPageCopy = {
  swipeHint: CIA_PAGE_COPY.swipeHint,
  referenceNote: SCHOOL_REFERENCE_NOTE,
  hero: {
    breadcrumb: '菲律宾游学 / 宿务学校 / CPILS',
    title: '菲律宾宿务 CPILS 语言学校',
    lead: CPILS_PAGE_COPY.heroLead,
    tags: [
      { icon: 'location_on', text: '宿务市区' },
      { icon: 'account_balance', text: 'USJ-R大学英语中心' },
      { icon: 'fact_check', text: '校内雅思／托业官方考场' },
      { icon: 'verified', text: '斯巴达／普通课程可选' },
    ],
  },
  overview: { title: CPILS_PAGE_COPY.overviewTitle },
  advisorReview: {
    title: CPILS_PAGE_COPY.advisorTitle,
    text: CPILS_PAGE_COPY.advisorText,
    suitableTitle: CPILS_PAGE_COPY.suitableTitle,
    notSuitableTitle: CPILS_PAGE_COPY.notSuitableTitle,
  },
  campus: {
    eyebrow: 'CAMPUS AT A GLANCE',
    title: 'CPILS 校园介绍',
    intro: CPILS_PAGE_COPY.campusIntro,
    ruleTitle: CPILS_PAGE_COPY.ruleTitle,
    ruleText: CPILS_PAGE_COPY.ruleText,
  },
  gallery: {
    title: '按区域查看 CPILS 环境',
    intro: `${CPILS_PAGE_COPY.galleryLead}相册内用左右箭头或缩略图切换，点击主图可放大。`,
    photoNote: SCHOOL_REFERENCE_NOTE,
    roomComparisonTitle: '房型对比',
    roomDisclaimer: SCHOOL_REFERENCE_NOTE,
  },
  courses: {
    title: 'CPILS 课程怎么选？',
    intro: '按学习目标选课；每门课下面是每天的课时，点开可看适合人群和说明。',
    priceUnit: '/4周',
    oldPriceLabel: '2026年内开课',
    fitLabel: '适合人群',
    noteLabel: '课程说明',
    detailSummaryTitle: '查看课程细节与每日作息',
    detailSummaryHint: '保分班目标分、亲子课程、职业英语、分级与换课、每日作息',
    guideTitle: '报名前值得确认的课程细节',
  },
  schedule: {
    eyebrow: 'DAILY TIMETABLE',
    title: 'CPILS 每日作息',
    intro: '每节课45分钟，8:00开始；普通ESL下午结束，斯巴达、ESL Premium和考试课上到20:30。',
    badge: '每周五16:10毕业典礼',
  },
  planning: {
    summaryTitle: '2027年校历与暑期旺季',
    summaryHint: '学校假期、旺季附加费档期',
  },
  calendar: {
    eyebrow: 'ACADEMIC CALENDAR',
    title: 'CPILS 2027年校历',
    intro: '学校假期和暑期旺季一表看完，规划入学日期和周数时先看这里。',
    peakEyebrow: '2027 PEAK SEASON',
    peakTitle: '2027年暑期旺季',
    peakIntro: '课程覆盖以下学习周时，每名学生按实际重叠的学习周计收旺季附加费。',
    peakNote: '入学按周日、离校按周六；旺季附加费不参与思达启航折扣。2026/12/31及之前报名2027年暑期的学生至少报8周。',
    footnote: '开斋节、宰牲节以官方公布的日期为准，政府也可能临时调整假期。',
  },
  offers: {
    eyebrow: 'OFFERS',
    title: 'CPILS 报名优惠',
    intro: '思达启航折扣和学校优惠可以叠加；每项优惠的报名日期、开课日期和周数条件写在卡片上。',
    note: '报价器会按报名日、开课日和周数自动算出能用的优惠；学校优惠不能折现、出售或转让。',
  },
  videos: {
    eyebrow: 'SCHOOL VIDEOS',
    title: '用视频了解 CPILS',
    intro: CPILS_PAGE_COPY.videoLead,
    badge: 'CPILS 学校视频',
    lifeTitle: '校园生活短片',
  },
  rooms: {
    photoTitle: '房型实景',
    photoIntro: '点选房型查看实景；各房型价格见上方住宿费表。',
    rulesTitle: '短期费率、入住离校与宿舍规定',
    rulesHint: '1–3周住宿费比例、入住离校、宿舍规定',
    dormRulesTitle: '宿舍规定',
  },
  quote: {
    ...CIA_PAGE_COPY.quote,
    compareShortcuts: [
      { focus: 'room', label: '比房型', hint: '课程和周数不变' },
      { focus: 'course', label: '比同类课程', hint: '如普通ESL和斯巴达、雅思和保分班' },
      { focus: 'weeks', label: '比周数', hint: '如4周、8周、12周' },
    ],
  },
  fees: CIA_PAGE_COPY.fees,
  practicalGuide: {
    summaryTitle: '到校须知、学校服务与校规',
    summaryHint: '抵达与第一周、开放时间、外出规定、活动、其他收费、出勤与扣分',
    intro: '出发前和到校后最常问到的安排。',
  },
  sida: {
    ...CIA_PAGE_COPY.sida,
    title: brandCpils(CIA_PAGE_COPY.sida.title),
    photoAlt: brandCpils(CIA_PAGE_COPY.sida.photoAlt),
    photoCaption: brandCpils(CIA_PAGE_COPY.sida.photoCaption),
  },
  faq: CIA_PAGE_COPY.faq,
  finalCta: {
    title: CPILS_PAGE_COPY.finalCtaTitle,
    text: CPILS_PAGE_COPY.finalCtaText,
    primaryLabel: '获取 CPILS 完整报价单',
    secondaryLabel: '咨询当前空房',
  },
};

const CPILS_INITIAL_ROOM_RATE_GROUPS: RoomRateGroup[] = [...new Set(defaults.rooms.map(room => room.group))].map(title => ({
  title: title === 'Regular' ? '普通房' : title === 'Premium' ? '高级房' : `${title}房`,
  rooms: defaults.rooms
    .filter(room => room.enabled && room.group === title)
    .map(room => ({ id: room.id, label: room.label, code: room.code, location: room.location })),
}));

/** 2027 official exam gifts (registration 2026/09/29–2027/12/27, class start in 2027 except 05/31–08/29). */
const CPILS_EXAM_TERMS = '2027/01/01–12/27开课（05/31–08/29开课除外）';
const CPILS_IELTS_EXAM_HIGHLIGHT = {
  badge: '注册12周送1次官方考试',
  label: '考试福利',
  text: `${CPILS_EXAM_TERMS}，雅思课程（含预备雅思）一次注册12周及以上，赠1次雅思官方考试。`,
};
const CPILS_IELTS_GUARANTEE8_EXAM_HIGHLIGHT = {
  badge: '送1次官方考试',
  label: '考试福利',
  text: `${CPILS_EXAM_TERMS}，8周雅思保分班赠1次雅思官方考试。`,
};
const CPILS_TOEIC_EXAM_HIGHLIGHT = {
  badge: '每满4周送1次官方考试',
  label: '考试福利',
  text: `${CPILS_EXAM_TERMS}，托业课程4–7周赠1次，每满4周再加1次，24周最多6次。`,
};

/** 2027 career-course offer (school poster 2026-11-23). */
const CPILS_CAREER_HIGHLIGHT = {
  badge: '2027开课最高减200美元',
  label: '课程优惠',
  text: '2027年开课的职业培训课程，报名4–7周减50美元、8–11周减100美元、12–15周减150美元、16周及以上减200美元。',
};

const initialCourses: CiaQuoteCourse[] = cpilsVisibleCourses(defaults, initialPricing.courseFees);

export const CPILS_PAGE_PROFILE: PhSchoolProfile = {
  code: 'CPILS',
  name: 'CPILS',
  previewPrefix: 'cpils',
  pricingSchoolName: 'CPILS',
  schoolCompareId: 'cpils',
  copy: CPILS_COPY,
  compactLayout: true,
  overviewFacts: CPILS_OVERVIEW_FACTS,
  videoTabs: CPILS_VIDEO_TABS,
  courseHighlights: {
    'pre-ielts-course': CPILS_IELTS_EXAM_HIGHLIGHT,
    'ielts-course': CPILS_IELTS_EXAM_HIGHLIGHT,
    'ielts-guarantee-8-weeks': CPILS_IELTS_GUARANTEE8_EXAM_HIGHLIGHT,
    'ielts-guarantee-12-weeks': CPILS_IELTS_EXAM_HIGHLIGHT,
    'toeic-course': CPILS_TOEIC_EXAM_HIGHLIGHT,
    'toeic-guarantee': CPILS_TOEIC_EXAM_HIGHLIGHT,
    ...Object.fromEntries(CPILS_CAREER_COURSE_IDS.map(id => [id, CPILS_CAREER_HIGHLIGHT])),
  },
  offers: CPILS_OFFERS,
  gallery: {
    categories: CIA_GALLERY_CATEGORIES,
    albumCategories: ['校园', '教室', '住宿', '餐厅', '设施'],
    images: CPILS_GALLERY_IMAGES,
    heroCategories: ['校园', '教室', '设施'],
    albumDescriptions: {
      校园: '校园外观、大堂、泳池与学生活动',
      教室: '一对一、小组课、自习室与官方考场',
      住宿: '普通房、高级房与宿舍走廊',
      餐厅: '自助餐厅、咖啡厅与便利店',
      设施: '健身房、诊所、休息室与洗衣',
    },
    uploadedPhotoTitle: 'CPILS 学校媒体',
    uploadedPhotoDescription: 'CPILS 学校实景内容',
    uploadedVideoTitle: 'CPILS 学校视频',
  },
  snapshotCards: CPILS_QUICK_INFO,
  basicInfo: CPILS_BASIC_INFO,
  suitableFor: CPILS_SUITABLE_FOR,
  notSuitableFor: CPILS_NOT_SUITABLE_FOR,
  campusBuildings: CPILS_CAMPUS_BUILDINGS,
  videoCards: CPILS_VIDEO_CARDS,
  campusLifeVideos: CPILS_LIFE_VIDEOS,
  interviewVideos: [],
  courseGroups: [
    {
      icon: 'forum', title: '综合英语 ESL', text: '普通课程晚上自由，斯巴达有强制自习',
      courseIds: ['general-esl-light', 'general-esl', 'general-esl-plus', 'esl-premium', 'premier-sparta'],
    },
    { icon: 'workspace_premium', title: '雅思 IELTS', text: '保分班固定8周或12周', courseIds: ['ielts-guarantee-8-weeks', 'ielts-guarantee-12-weeks', 'pre-ielts-course', 'ielts-course'] },
    { icon: 'quiz', title: '托业 TOEIC / 托福 TOEFL', text: '每月模考，托业保分班12周', courseIds: ['toeic-guarantee', 'toeic-course', 'toefl-course'] },
    {
      icon: 'business_center', title: '商务与职业英语', text: '演讲、商务、TESOL与行业英语',
      courseIds: ['business-english', 'power-speaking-and-modern-communication', 'tesol', 'medical-english', 'hotel-hospitality', 'barista-beverage', 'working-holiday'],
    },
    { icon: 'family_restroom', title: '亲子课程', text: '家长和孩子同校学习，孩子9岁及以上', courseIds: ['pcp-intensive-parent', 'pcp-intensive-child', 'pcp-basic'] },
  ],
  studyModes: [],
  courseDetailGuides: CPILS_COURSE_DETAIL_GUIDES,
  scheduleColumns: [
    { code: 'MON–THU', title: '周一至周四', rows: CPILS_SCHEDULE.weekday },
    { code: 'FRI', title: '周五', rows: CPILS_SCHEDULE.friday },
  ],
  initialCourseFees: initialCourses,
  initialRoomFees: cpilsRooms2027(defaults, initialPricing.roomFees),
  initialRoomRateGroups: CPILS_INITIAL_ROOM_RATE_GROUPS,
  showRoomCodes: false,
  dormRules: CPILS_DORM_RULES,
  roomProfiles: CPILS_ROOM_PROFILES,
  ieltsResults: [],
  studentReviews: [],
  reviewPath: '',
  holidayCalendars: CPILS_HOLIDAY_CALENDARS,
  ieltsComputerExamDates2027: [],
  studentCareServices: [],
  campusPracticalGuides: CPILS_PRACTICAL_GUIDES,
  studentTracks: [],
  sidaReasons: CIA_SIDA_REASONS.map(reason => ({ ...reason, alt: brandCpils(reason.alt) })),
  sidaTrustBadges: CIA_SIDA_TRUST_BADGES,
  ctaBadges: CPILS_FINAL_CTA_BADGES,
  ctaConsultants: SIDA_PHILIPPINES_CONSULTANTS,
  mobileAnchors: [
    { label: '视频', target: 'gallery', icon: 'smart_display' },
    { label: '概览', target: 'overview', icon: 'dashboard' },
    { label: '课程', target: 'courses', icon: 'menu_book' },
    { label: '住宿', target: 'rooms', icon: 'bed' },
    { label: '优惠', target: 'offers', icon: 'local_offer' },
    { label: '报价', target: 'quote', icon: 'calculate' },
    { label: 'FAQ', target: 'faq', icon: 'help' },
  ],
  faqs: () => CPILS_FAQS.map(item => ({ ...item })),
  shows2026Prices: () => ciaShows2026Prices(),
  defaultContent: createDefaultCpilsContentConfig,
  cloneContent: cloneCpilsContentConfig,
};

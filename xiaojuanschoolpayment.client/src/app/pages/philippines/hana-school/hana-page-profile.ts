// HANA Academy content for the shared Philippine school page (school-page/ph-school-page.component.*).
// Text and data come from hana-page-content.ts; prices and rules from hana-content-config.ts.
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
import {
  HANA_CAMP_IDS,
  HANA_GUARDIAN_IDS,
  HANA_JUNIOR_IDS,
  HANA_KINDER_IDS,
  HANA_LIGHT_ESL_ID,
  HANA_SENIOR_ID,
  cloneHanaContentConfig,
  createDefaultHanaContentConfig,
} from './hana-content-config';
import {
  HANA_ALBUM_DESCRIPTIONS,
  HANA_BASIC_INFO,
  HANA_CAMPUS_BUILDINGS,
  HANA_COURSE_DETAIL_GUIDES,
  HANA_DORM_RULES,
  HANA_FAQS,
  HANA_FINAL_CTA_BADGES,
  HANA_GALLERY_IMAGES,
  HANA_HOLIDAY_CALENDARS,
  HANA_HOLIDAY_FOOTNOTE,
  HANA_NOT_SUITABLE_FOR,
  HANA_OVERVIEW_FACTS,
  HANA_PAGE_TEXT,
  HANA_PEAK_SEASON_RANGES,
  HANA_PRACTICAL_GUIDES,
  HANA_QUICK_INFO,
  HANA_REFERENCE_NOTE,
  HANA_REFUND,
  HANA_ROOM_PROFILES,
  HANA_SCHEDULE,
  HANA_SUITABLE_FOR,
  HANA_TEXT_REVIEWS,
  HANA_VIDEOS,
  hanaVideoPoster,
  hanaVideoSrc,
  type HanaVideo,
} from './hana-page-content';

const defaults = createDefaultHanaContentConfig();
const AFTERNOON_START = HANA_SCHEDULE.findIndex(row => row.time.startsWith('12:35'));
const initialPricing = createCiaQuotePricing(defaults);
const brandHana = (text: string) => text.replace(/CIA/g, 'HANA');

const HANA_COPY: PhPageCopy = {
  swipeHint: CIA_PAGE_COPY.swipeHint,
  referenceNote: HANA_REFERENCE_NOTE,
  hero: {
    breadcrumb: '菲律宾游学 / 克拉克学校 / HANA',
    title: '菲律宾克拉克 HANA 语言学校',
    lead: HANA_PAGE_TEXT.heroLead,
    tags: [
      { icon: 'location_on', text: '克拉克－安吉利斯' },
      { icon: 'record_voice_over', text: '菲师一对一＋美国外教' },
      { icon: 'family_restroom', text: '成人、亲子与乐龄' },
      { icon: 'event_available', text: '旺季不加价' },
    ],
  },
  overview: { title: '30 秒看懂 HANA' },
  advisorReview: {
    title: '顾问怎么看 HANA',
    text: HANA_PAGE_TEXT.advisorText,
    suitableTitle: '适合谁',
    notSuitableTitle: '报名前想清楚',
  },
  campus: {
    eyebrow: 'CAMPUS AT A GLANCE',
    title: 'HANA 校园介绍',
    intro: HANA_PAGE_TEXT.campusIntro,
  },
  gallery: {
    title: '按区域查看 HANA 环境',
    intro: HANA_PAGE_TEXT.galleryIntro,
    photoNote: CIA_PAGE_COPY.gallery.photoNote,
    roomComparisonTitle: '房型对比',
    roomDisclaimer: HANA_REFERENCE_NOTE,
  },
  courses: {
    title: 'HANA 课程怎么选？',
    intro: HANA_PAGE_TEXT.coursesIntro,
    priceUnit: '/4周',
    fitLabel: '适合人群',
    noteLabel: '课程说明',
    detailSummaryTitle: '查看课程细节与每日作息',
    detailSummaryHint: '淡季优惠、上课和换课规定、每日作息',
    guideTitle: '报名前值得确认的课程细节',
  },
  schedule: {
    eyebrow: 'DAILY TIMETABLE',
    title: 'HANA 每日作息（General ESL，周一至周五）',
    intro: '每节课45分钟，课间休息5分钟；实际课表按所选课程和分班安排。',
    badge: '下午有时间游泳、打球',
  },
  planning: {
    summaryTitle: '2027年假期与旺季',
    summaryHint: '学校假期、旺季日期和2026年末补课',
  },
  calendar: {
    eyebrow: 'ACADEMIC CALENDAR',
    title: 'HANA 2027年日历',
    intro: '学校假期和旺季一表看完，用于规划入学日期和周数。',
    footnote: HANA_HOLIDAY_FOOTNOTE,
    peakEyebrow: '2027 PEAK SEASON',
    peakTitle: '2027年旺季',
    peakIntro: '旺季不另收附加费。',
    peakNote: '入学按周日、离校按周六。',
  },
  videos: {
    eyebrow: 'SCHOOL VIDEOS',
    title: '用视频了解 HANA',
    intro: '学校介绍片和美国外教采访，可以看到教室、宿舍、泳池和花园。',
    badge: 'HANA 学校视频',
  },
  rooms: {
    photoTitle: '房型实景',
    photoIntro: HANA_PAGE_TEXT.roomsPhotoIntro,
    rulesTitle: '短期费率、入住离校与宿舍规定',
    rulesHint: '1–3周住宿费比例、入住离校、延住费用、门禁与宿舍规定',
    dormRulesTitle: '宿舍规定',
  },
  quote: {
    ...CIA_PAGE_COPY.quote,
    compareShortcuts: [
      { focus: 'room', label: '比房型', hint: '如单人间、双人间和家庭房' },
      { focus: 'course', label: '比同类课程', hint: '如Light、General和Native ESL' },
      { focus: 'weeks', label: '比周数', hint: '如4周、8周、12周' },
    ],
  },
  fees: CIA_PAGE_COPY.fees,
  refund: HANA_REFUND,
  practicalGuide: {
    summaryTitle: '到校须知与学校服务',
    summaryHint: '到校离校、用餐与开放时间、清洁洗衣、学校周边、周末活动、其他收费',
    intro: '出发前和到校后最常问到的安排。',
  },
  reviews: {
    eyebrow: 'STUDENT REVIEWS',
    title: '在HANA学习与生活，学员怎么说？',
    intro: '来过HANA的家长和学员，说说老师、校园和生活上的感受。',
    source: '学员公开评价摘录',
    textNote: '评价为学员个人感受，按原意节选，已隐去姓名。',
  },
  sida: {
    ...CIA_PAGE_COPY.sida,
    title: brandHana(CIA_PAGE_COPY.sida.title),
    photoAlt: brandHana(CIA_PAGE_COPY.sida.photoAlt),
    photoCaption: brandHana(CIA_PAGE_COPY.sida.photoCaption),
  },
  faq: CIA_PAGE_COPY.faq,
  finalCta: {
    title: HANA_PAGE_TEXT.finalCtaTitle,
    text: HANA_PAGE_TEXT.finalCtaText,
    primaryLabel: '获取 HANA 完整报价单',
    secondaryLabel: '咨询当前空房',
  },
};

const HANA_INITIAL_ROOM_RATE_GROUPS: RoomRateGroup[] = [...new Set(defaults.rooms.map(room => room.group))].map(title => ({
  title,
  rooms: defaults.rooms
    .filter(room => room.enabled && room.group === title)
    .map(room => ({ id: room.id, label: room.label, code: room.code, location: room.location })),
}));

const videoCard = (video: HanaVideo): CiaVideoCard => ({
  code: 'HANA',
  label: video.label,
  title: video.title,
  text: video.description,
  poster: hanaVideoPoster(video),
  videoSrc: hanaVideoSrc(video),
  contentType: 'video/mp4',
  details: [...video.details, `时长 ${video.duration}`],
});

const albumVideo = (video: HanaVideo): PhVideoItem => ({
  title: video.title,
  text: video.description,
  src: hanaVideoSrc(video),
  poster: hanaVideoPoster(video),
  duration: video.duration,
  shape: 'wide',
});
const videoNamed = (name: string) => albumVideo(HANA_VIDEOS.find(item => item.name === name) as HanaVideo);

/** Videos in the hero album; the school film opens the album. */
const HANA_VIDEO_TABS: PhVideoTab[] = [
  { label: '校园视频', icon: 'videocam', items: [videoNamed('school-film')] },
  { label: '外教视频', icon: 'videocam', items: [videoNamed('teacher-interview')] },
];

export const HANA_PAGE_PROFILE: PhSchoolProfile = {
  code: 'HANA',
  name: 'HANA',
  previewPrefix: 'hana',
  pricingSchoolName: '菲律宾克拉克HANA Academy',
  copy: HANA_COPY,
  compactLayout: true,
  overviewFacts: HANA_OVERVIEW_FACTS,
  videoTabs: HANA_VIDEO_TABS,
  courseHighlights: {
    [HANA_LIGHT_ESL_ID]: {
      badge: '淡季付4周读8周',
      label: '淡季优惠',
      text: '淡季住双人间，付4周1,470美元读8周（含学费和住宿）。',
    },
  },
  peakSeasonsWithoutSurcharge: { title: '旺季不加价', ranges: HANA_PEAK_SEASON_RANGES },
  textReviews: HANA_TEXT_REVIEWS,
  gallery: {
    categories: CIA_GALLERY_CATEGORIES.filter(category => category !== '餐厅'),
    albumCategories: ['校园', '教室', '住宿', '设施'],
    images: HANA_GALLERY_IMAGES,
    heroCategories: ['校园', '教室', '住宿'],
    albumDescriptions: HANA_ALBUM_DESCRIPTIONS,
    uploadedPhotoTitle: 'HANA 学校媒体',
    uploadedPhotoDescription: 'HANA 学校实景内容',
    uploadedVideoTitle: 'HANA 学校视频',
  },
  snapshotCards: HANA_QUICK_INFO,
  basicInfo: HANA_BASIC_INFO,
  suitableFor: HANA_SUITABLE_FOR.map(title => ({ title, text: '' })),
  notSuitableFor: HANA_NOT_SUITABLE_FOR.map(title => ({ title, text: '' })),
  campusBuildings: HANA_CAMPUS_BUILDINGS,
  videoCards: HANA_VIDEOS.map(videoCard),
  campusLifeVideos: [],
  interviewVideos: [],
  courseGroups: [
    { icon: 'forum', title: '成人英语 ESL', text: '菲师一对一为主，都有外教小班', courseIds: [HANA_LIGHT_ESL_ID, 'general-esl', 'native-esl', 'native-only'] },
    { icon: 'quiz', title: '托业和雅思', text: '每周一次模拟测试', courseIds: ['toeic', 'ielts'] },
    { icon: 'sports_golf', title: '英语＋高尔夫', text: '步行1分钟到练习场', courseIds: ['golf-intensive', 'golf-leisure'] },
    { icon: 'elderly', title: '乐龄课程', text: '50岁以上，只在淡季开放', courseIds: [HANA_SENIOR_ID] },
    { icon: 'child_care', title: 'Junior（7–17岁）', text: '家长陪同，每天8节课', courseIds: [...HANA_JUNIOR_IDS] },
    { icon: 'toys', title: '幼儿园（3–6岁）', text: '半日班或全日班', courseIds: [...HANA_KINDER_IDS] },
    { icon: 'family_restroom', title: '陪读家长', text: '按需上课，淡季也可不上课', courseIds: [...HANA_GUARDIAN_IDS] },
    { icon: 'cabin', title: '青少年英语营', text: '7–17岁孩子独自参加，全包价', courseIds: [...HANA_CAMP_IDS] },
  ],
  studyModes: [],
  courseDetailGuides: HANA_COURSE_DETAIL_GUIDES,
  scheduleColumns: [
    { code: 'MORNING', title: '上午', rows: HANA_SCHEDULE.slice(0, AFTERNOON_START) },
    { code: 'AFTERNOON', title: '下午和晚上', rows: HANA_SCHEDULE.slice(AFTERNOON_START) },
  ],
  initialCourseFees: initialPricing.courseFees,
  initialRoomFees: initialPricing.roomFees,
  initialRoomRateGroups: HANA_INITIAL_ROOM_RATE_GROUPS,
  roomGroupNotes: {
    家庭房: '按每人价格；2人家庭房只在3–6月、9–12月开放。',
    乐龄夫妻房: '只供报名乐龄课程的夫妻，价格已含当地费用。',
  },
  showRoomCodes: false,
  dormRules: HANA_DORM_RULES,
  roomProfiles: HANA_ROOM_PROFILES,
  ieltsResults: [],
  studentReviews: [],
  reviewPath: '',
  holidayCalendars: HANA_HOLIDAY_CALENDARS,
  ieltsComputerExamDates2027: [],
  studentCareServices: [],
  campusPracticalGuides: HANA_PRACTICAL_GUIDES,
  studentTracks: [],
  sidaReasons: CIA_SIDA_REASONS.map(reason => ({ ...reason, alt: brandHana(reason.alt) })),
  sidaTrustBadges: CIA_SIDA_TRUST_BADGES,
  ctaBadges: HANA_FINAL_CTA_BADGES,
  ctaConsultants: CIA_CTA_CONSULTANTS,
  mobileAnchors: [
    { label: '视频', target: 'gallery', icon: 'smart_display' },
    { label: '概览', target: 'overview', icon: 'dashboard' },
    { label: '课程', target: 'courses', icon: 'menu_book' },
    { label: '住宿', target: 'rooms', icon: 'bed' },
    { label: '评价', target: 'student-reviews', icon: 'reviews' },
    { label: '报价', target: 'quote', icon: 'calculate' },
    { label: 'FAQ', target: 'faq', icon: 'help' },
  ],
  faqs: () => HANA_FAQS.map(item => ({ ...item })),
  shows2026Prices: () => false,
  defaultContent: createDefaultHanaContentConfig,
  cloneContent: cloneHanaContentConfig,
};

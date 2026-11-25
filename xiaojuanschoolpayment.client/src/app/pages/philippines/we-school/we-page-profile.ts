// WE Academy (Clark) content for the shared Philippine school page (school-page/ph-school-page.component.*).
// Text and data come from we-page-content.ts; prices and rules from we-content-config.ts.
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
  WE_GUARDIAN_COURSE_ID,
  WE_KINDER_COURSE_ID,
  WE_NO_CLASS_COURSE_ID,
  cloneWeContentConfig,
  createDefaultWeContentConfig,
} from './we-content-config';
import {
  WE_ALBUM_DESCRIPTIONS,
  WE_BASIC_INFO,
  WE_CAMPUS_BUILDINGS,
  WE_COURSE_DETAIL_GUIDES,
  WE_DORM_RULES,
  WE_FAQS,
  WE_FINAL_CTA_BADGES,
  WE_GALLERY_IMAGES,
  WE_HOLIDAY_CALENDARS,
  WE_HOLIDAY_FOOTNOTE,
  WE_NOT_SUITABLE_FOR,
  WE_OVERVIEW_FACTS,
  WE_PAGE_TEXT,
  WE_PRACTICAL_GUIDES,
  WE_QUICK_INFO,
  WE_REFERENCE_NOTE,
  WE_ROOM_PROFILES,
  WE_SCHEDULE,
  WE_SUITABLE_FOR,
  WE_VIDEOS,
  weVideoPoster,
  weVideoSrc,
  type WeVideo,
} from './we-page-content';

const defaults = createDefaultWeContentConfig();
const AFTERNOON_START = WE_SCHEDULE.findIndex(row => row.time.startsWith('13:00'));
const initialPricing = createCiaQuotePricing(defaults);
const brandWe = (text: string) => text.replace(/CIA/g, 'WE');

const WE_COPY: PhPageCopy = {
  swipeHint: CIA_PAGE_COPY.swipeHint,
  referenceNote: WE_REFERENCE_NOTE,
  hero: {
    breadcrumb: '菲律宾游学 / 克拉克学校 / WE',
    title: '克拉克 WE 语言学校',
    lead: WE_PAGE_TEXT.heroLead,
    tags: [
      { icon: 'location_on', text: '克拉克' },
      { icon: 'verified', text: '自由型，成人无门禁' },
      { icon: 'family_restroom', text: '4岁起亲子游学' },
      { icon: 'apartment', text: '新建 WE 公寓' },
    ],
  },
  overview: { title: '30 秒看懂 WE' },
  advisorReview: {
    title: '顾问怎么看 WE',
    text: WE_PAGE_TEXT.advisorText,
    suitableTitle: '适合谁',
    notSuitableTitle: '报名前想清楚',
  },
  campus: {
    eyebrow: 'CAMPUS AT A GLANCE',
    title: 'WE 校园介绍',
    intro: WE_PAGE_TEXT.campusIntro,
  },
  gallery: {
    title: '按区域查看 WE 环境',
    intro: WE_PAGE_TEXT.galleryIntro,
    photoNote: CIA_PAGE_COPY.gallery.photoNote,
    roomComparisonTitle: '房型对比',
    roomDisclaimer: WE_REFERENCE_NOTE,
  },
  courses: {
    title: 'WE 课程怎么选？',
    intro: WE_PAGE_TEXT.coursesIntro,
    priceUnit: '/4周',
    fitLabel: '适合人群',
    noteLabel: '课程说明',
    detailSummaryTitle: '查看课程细节与每日作息',
    detailSummaryHint: '外教课、考试课、幼儿园、高尔夫、家长课程和上课规定',
    guideTitle: '报名前值得确认的课程细节',
  },
  schedule: {
    eyebrow: 'DAILY TIMETABLE',
    title: 'WE 每日作息（周一至周五）',
    intro: '每节课45分钟；实际课表按所选课程和分班安排，课程少的时段是自由时间。',
    badge: '周一至周四晚间有选修课',
  },
  planning: {
    summaryTitle: '2027年学校假期',
    summaryHint: '哪些节日停课、哪些照常上课',
  },
  calendar: {
    eyebrow: 'ACADEMIC CALENDAR',
    title: 'WE 2027年假期',
    intro: '以下是平日的停课日和特别小组课日；表里没有的节日照常上课。',
    footnote: WE_HOLIDAY_FOOTNOTE,
    peakEyebrow: 'BUSY SEASON',
    peakTitle: '旺季',
    peakIntro: '12–2月、6–8月为旺季，不收附加费。',
    peakNote: '旺季报名时每人先付300美元押金，可抵扣学费全款。',
  },
  videos: {
    eyebrow: 'SCHOOL VIDEOS',
    title: '用视频了解 WE',
    intro: '视频都来自WE学校，可以看到校园、课堂、幼儿园和新建的WE公寓。',
    badge: 'WE 学校视频',
  },
  rooms: {
    photoTitle: '房型实景',
    photoIntro: WE_PAGE_TEXT.roomsPhotoIntro,
    rulesTitle: '短期费率、入住离校与宿舍规定',
    rulesHint: '1–3周住宿费比例、入住离校、额外住宿费、门禁与宿舍规定',
    dormRulesTitle: '宿舍与WE公寓规定',
  },
  quote: {
    ...CIA_PAGE_COPY.quote,
    compareShortcuts: [
      { focus: 'room', label: '比房型', hint: '如宿舍、家庭房和WE公寓' },
      { focus: 'course', label: '比同类课程', hint: '如外教混合LIGHT、GENERAL和INTENSIVE' },
      { focus: 'weeks', label: '比周数', hint: '如4周、8周、12周' },
    ],
  },
  fees: CIA_PAGE_COPY.fees,
  practicalGuide: {
    summaryTitle: '到校须知与学校服务',
    summaryHint: '第一天安排、用餐与开放时间、清洁洗衣、看病和其他收费',
    intro: '出发前和到校后最常问到的安排。',
  },
  sida: {
    ...CIA_PAGE_COPY.sida,
    title: brandWe(CIA_PAGE_COPY.sida.title),
    photoAlt: brandWe(CIA_PAGE_COPY.sida.photoAlt),
    photoCaption: brandWe(CIA_PAGE_COPY.sida.photoCaption),
  },
  faq: CIA_PAGE_COPY.faq,
  finalCta: {
    title: WE_PAGE_TEXT.finalCtaTitle,
    text: WE_PAGE_TEXT.finalCtaText,
    primaryLabel: '获取 WE 完整报价单',
    secondaryLabel: '咨询当前空房',
  },
};

const WE_INITIAL_ROOM_RATE_GROUPS: RoomRateGroup[] = [...new Set(defaults.rooms.map(room => room.group))].map(title => ({
  title,
  rooms: defaults.rooms
    .filter(room => room.enabled && room.group === title)
    .map(room => ({ id: room.id, label: room.label, code: room.code, location: room.location })),
}));

const video = (name: string): WeVideo => WE_VIDEOS.find(item => item.name === name) as WeVideo;
const videoCard = (item: WeVideo): CiaVideoCard => ({
  code: 'WE',
  label: item.label,
  title: item.title,
  text: item.description,
  poster: weVideoPoster(item),
  videoSrc: weVideoSrc(item),
  contentType: 'video/mp4',
  details: [...item.details, `时长 ${item.duration}`],
});
const albumVideo = (name: string): PhVideoItem => {
  const item = video(name);
  return { title: item.title, text: item.description, src: weVideoSrc(item), poster: weVideoPoster(item), duration: item.duration, shape: 'wide' };
};

/** Videos in the hero album, one chip per topic; the school film opens the album. */
const WE_VIDEO_TABS: PhVideoTab[] = [
  { label: '校园视频', icon: 'videocam', items: ['campus-film', 'arrival', 'campus-day-night'].map(albumVideo) },
  { label: '课程视频', icon: 'videocam', items: ['classes', 'kindergarten'].map(albumVideo) },
  { label: 'WE公寓视频', icon: 'videocam', items: ['residence-one-queen', 'residence-two-queen'].map(albumVideo) },
];

export const WE_PAGE_PROFILE: PhSchoolProfile = {
  code: 'WE',
  name: 'WE',
  previewPrefix: 'we',
  pricingSchoolName: '菲律宾克拉克WE Academy语言学校',
  copy: WE_COPY,
  compactLayout: true,
  overviewFacts: WE_OVERVIEW_FACTS,
  videoTabs: WE_VIDEO_TABS,
  // Each WE Residence room video shows exactly that room type, so it opens its room's album.
  roomVideos: {
    'residence-one-queen': albumVideo('residence-one-queen'),
    'residence-two-queen': albumVideo('residence-two-queen'),
  },
  gallery: {
    categories: CIA_GALLERY_CATEGORIES,
    albumCategories: ['校园', '教室', '住宿', '餐厅', '设施'],
    images: WE_GALLERY_IMAGES,
    heroCategories: ['校园', '设施', '住宿'],
    albumDescriptions: WE_ALBUM_DESCRIPTIONS,
    uploadedPhotoTitle: 'WE 学校媒体',
    uploadedPhotoDescription: 'WE 学校实景内容',
    uploadedVideoTitle: 'WE 学校视频',
  },
  snapshotCards: WE_QUICK_INFO,
  basicInfo: WE_BASIC_INFO,
  suitableFor: WE_SUITABLE_FOR.map(title => ({ title, text: '' })),
  notSuitableFor: WE_NOT_SUITABLE_FOR.map(title => ({ title, text: '' })),
  campusBuildings: WE_CAMPUS_BUILDINGS,
  videoCards: WE_VIDEOS.filter(item => !item.name.startsWith('residence')).map(videoCard),
  campusLifeVideos: [],
  interviewVideos: [],
  courseGroups: [
    { icon: 'forum', title: '一般英语 ESL', text: '菲教一对一为主，听说读写全面提升', courseIds: ['esl-4', 'esl-5', 'esl-6'] },
    {
      icon: 'record_voice_over', title: '外教混合 NATIVE MIX', text: '每天1–3节外教一对一',
      courseIds: ['native-mix-light', 'native-mix-general', 'native-mix-intensive'],
    },
    { icon: 'fact_check', title: '考试与商务英语', text: '每天6节专项一对一', courseIds: ['toeic', 'toefl', 'ielts', 'business'] },
    {
      icon: 'child_care', title: '青少年与幼儿园', text: '4–6岁幼儿园，小学到初中青少年课程',
      courseIds: ['junior-esl', 'junior-esl-native', WE_KINDER_COURSE_ID],
    },
    { icon: 'golf_course', title: '高尔夫英语 GOLF', text: '上午英语，下午练球', courseIds: ['esl-golf', 'esl-golf-round'] },
    { icon: 'family_restroom', title: '陪读家长', text: '住宿舍须报课；住WE公寓可以不上课', courseIds: [WE_GUARDIAN_COURSE_ID, WE_NO_CLASS_COURSE_ID] },
  ],
  studyModes: [],
  courseDetailGuides: WE_COURSE_DETAIL_GUIDES,
  scheduleColumns: [
    { code: 'MORNING', title: '上午', rows: WE_SCHEDULE.slice(0, AFTERNOON_START) },
    { code: 'AFTERNOON', title: '下午和晚上', rows: WE_SCHEDULE.slice(AFTERNOON_START) },
  ],
  initialCourseFees: initialPricing.courseFees,
  initialRoomFees: initialPricing.roomFees,
  initialRoomRateGroups: WE_INITIAL_ROOM_RATE_GROUPS,
  roomGroupNotes: {
    '家庭房': '仅限家庭入住。',
    'WE公寓': '含餐；同住的人须同一天入住，不与陌生人合住。旺季至少住4周，淡季至少2周。',
  },
  showRoomCodes: false,
  dormRules: WE_DORM_RULES,
  roomProfiles: WE_ROOM_PROFILES,
  ieltsResults: [],
  studentReviews: [],
  reviewPath: '',
  schoolCompareId: undefined,
  holidayCalendars: WE_HOLIDAY_CALENDARS,
  ieltsComputerExamDates2027: [],
  studentCareServices: [],
  campusPracticalGuides: WE_PRACTICAL_GUIDES,
  studentTracks: [],
  sidaReasons: CIA_SIDA_REASONS.map(reason => ({ ...reason, alt: brandWe(reason.alt) })),
  sidaTrustBadges: CIA_SIDA_TRUST_BADGES,
  ctaBadges: WE_FINAL_CTA_BADGES,
  ctaConsultants: CIA_CTA_CONSULTANTS,
  mobileAnchors: [
    { label: '视频', target: 'gallery', icon: 'smart_display' },
    { label: '概览', target: 'overview', icon: 'dashboard' },
    { label: '课程', target: 'courses', icon: 'menu_book' },
    { label: '住宿', target: 'rooms', icon: 'bed' },
    { label: '报价', target: 'quote', icon: 'calculate' },
    { label: 'FAQ', target: 'faq', icon: 'help' },
  ],
  faqs: () => WE_FAQS.map(item => ({ ...item })),
  shows2026Prices: () => false,
  defaultContent: createDefaultWeContentConfig,
  cloneContent: cloneWeContentConfig,
};

// CIP content for the shared Philippine school page (school-page/ph-school-page.component.*).
// Text and data come from cip-page-content.ts; prices and rules from cip-content-config.ts.
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
import { cloneCipContentConfig, createDefaultCipContentConfig } from './cip-content-config';
import {
  CIP_ALBUM_DESCRIPTIONS,
  CIP_BASIC_INFO,
  CIP_CAMPUS_AREAS,
  CIP_COURSE_DETAIL_GUIDES,
  CIP_DORM_RULES,
  CIP_FAQS,
  CIP_FINAL_CTA_BADGES,
  CIP_GALLERY_IMAGES,
  CIP_HOLIDAY_CALENDARS,
  CIP_NOT_SUITABLE_FOR,
  CIP_OFFERS,
  CIP_OVERVIEW_FACTS,
  CIP_PAGE_TEXT,
  CIP_PRACTICAL_GUIDES,
  CIP_QUICK_INFO,
  CIP_REFERENCE_NOTE,
  CIP_REFUND_COPY,
  CIP_ROOM_PROFILES,
  CIP_SCHEDULE,
  CIP_SUITABLE_FOR,
  CIP_VIDEOS,
  cipVideoPoster,
  cipVideoSrc,
  type CipVideo,
} from './cip-page-content';

const defaults = createDefaultCipContentConfig();
const AFTERNOON_START = CIP_SCHEDULE.findIndex(row => row.time.startsWith('13:00'));
const initialPricing = createCiaQuotePricing(defaults);
const brandCip = (text: string) => text.replace(/CIA/g, 'CIP');
const HOTEL_GROUP = defaults.rooms.find(room => room.location === '校外')?.group ?? '';

const CIP_COPY: PhPageCopy = {
  swipeHint: CIA_PAGE_COPY.swipeHint,
  referenceNote: CIP_REFERENCE_NOTE,
  hero: {
    breadcrumb: '菲律宾游学 / 克拉克学校 / CIP',
    // Word joiners keep 克拉克 on one line; the hero title is balanced over two lines on phones.
    title: '菲律宾克\u2060拉\u2060克 CIP 语言学校',
    lead: CIP_PAGE_TEXT.heroLead,
    tags: [
      { icon: 'location_on', text: '克拉克' },
      { icon: 'record_voice_over', text: '外籍老师一对一' },
      { icon: 'workspace_premium', text: '雅思保分班' },
      { icon: 'family_restroom', text: '7–15岁青少年课程' },
    ],
    quoteLabel: '获取 CIP 最新报价',
  },
  overview: { title: '30 秒看懂 CIP' },
  advisorReview: {
    title: '顾问怎么看 CIP',
    text: CIP_PAGE_TEXT.advisorText,
    suitableTitle: '适合谁',
    notSuitableTitle: '报名前想清楚',
  },
  campus: {
    eyebrow: 'CAMPUS AT A GLANCE',
    title: 'CIP 校园介绍',
    intro: CIP_PAGE_TEXT.campusIntro,
  },
  gallery: {
    title: '按区域查看 CIP 环境',
    intro: CIP_PAGE_TEXT.galleryIntro,
    photoNote: CIA_PAGE_COPY.gallery.photoNote,
    roomComparisonTitle: '房型对比',
    roomDisclaimer: CIP_REFERENCE_NOTE,
  },
  courses: {
    title: 'CIP 课程怎么选？',
    intro: CIP_PAGE_TEXT.coursesIntro,
    priceUnit: '/4周',
    fitLabel: '适合人群',
    noteLabel: '课程说明',
    detailSummaryTitle: '查看课程细节与每日作息',
    detailSummaryHint: '雅思保分班、全斯巴达规定、青少年、分级测试和加课费用',
    guideTitle: '报名前值得确认的课程细节',
  },
  schedule: {
    eyebrow: 'DAILY TIMETABLE',
    title: 'CIP 每日作息（周一至周五）',
    intro: '每节课45分钟；实际课表按所选课程和分班安排。',
    badge: '每节45分钟',
  },
  planning: {
    summaryTitle: '2027年学校假期',
    summaryHint: '停课日和半天课',
  },
  calendar: {
    eyebrow: 'ACADEMIC CALENDAR',
    title: 'CIP 2027年假期',
    intro: '学校每月保证至少19天课程，假期导致不足时会安排补课。用于规划入学日期和周数。',
    footnote: '开斋节、宰牲节以官方公布的日期为准；10月还有两个邦板牙省节日（La Naval、Tigtigan Terakan King Dalan）停课，日期待公布。政府和当地也可能临时调整假期。',
    peakEyebrow: '',
    peakTitle: '',
    peakIntro: '',
    peakNote: '',
  },
  videos: {
    eyebrow: 'SCHOOL VIDEOS',
    title: '用视频了解 CIP',
    intro: '校园、宿舍、外籍老师和学校活动的实拍视频。',
    badge: 'CIP 学校视频',
    lifeTitle: '校园短片',
  },
  rooms: {
    photoTitle: '房型实景',
    photoIntro: CIP_PAGE_TEXT.roomsPhotoIntro,
    rulesTitle: '短期费率、入住离校与宿舍规定',
    rulesHint: '1–3周住宿费比例、入住离校、门禁与宿舍规定',
    dormRulesTitle: '宿舍规定',
  },
  quote: {
    ...CIA_PAGE_COPY.quote,
    compareShortcuts: [
      { focus: 'room', label: '比房型', hint: '如单人间B、双人间和三人间' },
      { focus: 'course', label: '比同类课程', hint: '如 Regular ESL 和 Power ESL' },
      { focus: 'weeks', label: '比周数', hint: '如4周、8周、12周' },
    ],
  },
  fees: CIA_PAGE_COPY.fees,
  refund: CIP_REFUND_COPY,
  offers: {
    eyebrow: 'OFFERS',
    title: 'CIP 报名优惠',
    intro: '学校优惠按入学日期和报名周数计算，条件写在卡片上。',
    note: '报价器会自动算出淡季、长期和老学员优惠；接机和淡季福利不能折现。',
  },
  practicalGuide: {
    summaryTitle: '到校须知与学校服务',
    summaryHint: '用餐与开放时间、打扫洗衣、免费班车、学校活动、毕业离校、出发前准备',
    intro: '出发前和到校后最常问到的安排。',
  },
  sida: {
    ...CIA_PAGE_COPY.sida,
    title: brandCip(CIA_PAGE_COPY.sida.title),
    photoAlt: brandCip(CIA_PAGE_COPY.sida.photoAlt),
    photoCaption: brandCip(CIA_PAGE_COPY.sida.photoCaption),
  },
  faq: CIA_PAGE_COPY.faq,
  finalCta: {
    title: CIP_PAGE_TEXT.finalCtaTitle,
    text: CIP_PAGE_TEXT.finalCtaText,
    primaryLabel: '获取 CIP 完整报价单',
    secondaryLabel: '咨询当前空房',
  },
};

const CIP_INITIAL_ROOM_RATE_GROUPS: RoomRateGroup[] = [...new Set(defaults.rooms.map(room => room.group))].map(title => ({
  title,
  rooms: defaults.rooms
    .filter(room => room.enabled && room.group === title)
    .map(room => ({ id: room.id, label: room.label, code: room.code, location: room.location })),
}));

const video = (name: string): CipVideo => CIP_VIDEOS.find(item => item.name === name) as CipVideo;
const albumVideo = (name: string): PhVideoItem => {
  const item = video(name);
  return {
    title: item.title,
    text: item.description,
    src: cipVideoSrc(item),
    poster: cipVideoPoster(item),
    duration: item.duration,
    shape: item.orientation === 'landscape' ? 'wide' : 'tall',
  };
};
const shortVideo = (item: CipVideo): CiaShortVideo => ({
  title: item.title,
  text: item.description,
  src: cipVideoSrc(item),
  poster: cipVideoPoster(item),
  duration: item.duration,
  ...(item.orientation === 'landscape' ? { shape: 'wide' as const } : {}),
});

const CIP_VIDEO_TOPICS: ReadonlyArray<CipVideo['topic']> = ['校园', '宿舍', '课程', '餐厅与活动'];
const CIP_VIDEO_TABS: PhVideoTab[] = CIP_VIDEO_TOPICS.map(topic => ({
  label: `${topic}视频`,
  icon: 'videocam',
  items: CIP_VIDEOS.filter(item => item.topic === topic).map(item => albumVideo(item.name)),
}));

export const CIP_PAGE_PROFILE: PhSchoolProfile = {
  code: 'CIP',
  name: 'CIP',
  previewPrefix: 'cip',
  pricingSchoolName: '菲律宾克拉克 CIP语言学校',
  copy: CIP_COPY,
  compactLayout: true,
  overviewFacts: CIP_OVERVIEW_FACTS,
  videoTabs: CIP_VIDEO_TABS,
  courseHighlights: {
    'ielts-guarantee': { badge: '没达标可免学费续读' },
    'premium-native-light': { badge: '一对一全部是外籍老师' },
  },
  roomVideos: {
    'single-a': albumVideo('room-single-a'),
    'single-b': albumVideo('room-single-b'),
    double: albumVideo('room-double'),
    triple: albumVideo('room-triple'),
  },
  gallery: {
    categories: CIA_GALLERY_CATEGORIES,
    albumCategories: ['校园', '教室', '住宿', '餐厅', '设施'],
    images: CIP_GALLERY_IMAGES,
    heroCategories: ['校园', '设施', '住宿'],
    albumDescriptions: CIP_ALBUM_DESCRIPTIONS,
    uploadedPhotoTitle: 'CIP 学校媒体',
    uploadedPhotoDescription: 'CIP 学校实景内容',
    uploadedVideoTitle: 'CIP 学校视频',
  },
  snapshotCards: CIP_QUICK_INFO,
  basicInfo: CIP_BASIC_INFO,
  suitableFor: CIP_SUITABLE_FOR.map(title => ({ title, text: '' })),
  notSuitableFor: CIP_NOT_SUITABLE_FOR.map(title => ({ title, text: '' })),
  campusBuildings: CIP_CAMPUS_AREAS,
  videoCards: [],
  campusLifeVideos: CIP_VIDEOS.map(shortVideo),
  interviewVideos: [],
  courseGroups: [
    { icon: 'self_improvement', title: '轻量与短期', text: '课少，或只读1–2周', courseIds: ['light-esl', 'premium-native-light', 'speak-up'] },
    {
      icon: 'forum', title: '综合英语与口语', text: '半斯巴达，平日下课后可外出',
      courseIds: ['regular-esl', 'power-esl', 'native-esl', 'speaking-master', 'native-master'],
    },
    { icon: 'business_center', title: '商务与托业', text: '半斯巴达，须先通过线上面试', courseIds: ['advanced-business', 'toeic-regular'] },
    {
      icon: 'workspace_premium', title: '雅思', text: '全斯巴达，晚课到22:00',
      courseIds: ['ielts-guarantee', 'ielts-basic', 'ielts-intensive', 'ielts-native'],
    },
    { icon: 'bolt', title: '斯巴达综合英语', text: '全斯巴达，平日不能外出', courseIds: ['intensive-esl'] },
    { icon: 'family_restroom', title: '青少年', text: '7–15岁，只能报青少年课程', courseIds: ['primary-english', 'junior-esl', 'junior-native'] },
  ],
  studyModes: [],
  courseDetailGuides: CIP_COURSE_DETAIL_GUIDES,
  scheduleColumns: [
    { code: 'MORNING', title: '上午', rows: CIP_SCHEDULE.slice(0, AFTERNOON_START) },
    { code: 'AFTERNOON', title: '下午和晚上', rows: CIP_SCHEDULE.slice(AFTERNOON_START) },
  ],
  initialCourseFees: initialPricing.courseFees,
  initialRoomFees: initialPricing.roomFees,
  initialRoomRateGroups: CIP_INITIAL_ROOM_RATE_GROUPS,
  roomGroupNotes: {
    [HOTEL_GROUP]: '车程约5分钟，学校有免费接送车；价格为每人价格，全斯巴达课程不能住。',
  },
  showRoomCodes: false,
  dormRules: CIP_DORM_RULES,
  roomProfiles: CIP_ROOM_PROFILES,
  ieltsResults: [],
  studentReviews: [],
  reviewPath: '',
  offers: CIP_OFFERS,
  holidayCalendars: CIP_HOLIDAY_CALENDARS,
  ieltsComputerExamDates2027: [],
  studentCareServices: [],
  campusPracticalGuides: CIP_PRACTICAL_GUIDES,
  studentTracks: [],
  sidaReasons: CIA_SIDA_REASONS.map(reason => ({ ...reason, alt: brandCip(reason.alt) })),
  sidaTrustBadges: CIA_SIDA_TRUST_BADGES,
  ctaBadges: CIP_FINAL_CTA_BADGES,
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
  faqs: () => CIP_FAQS.map(item => ({ ...item })),
  shows2026Prices: () => false,
  defaultContent: createDefaultCipContentConfig,
  cloneContent: cloneCipContentConfig,
};

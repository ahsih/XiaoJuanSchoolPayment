// MONOL main-campus content for the shared Philippine school page (school-page/ph-school-page.component.*).
// Text and data come from monol-page-content.ts; prices and rules from monol-content-config.ts.
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
import type { CiaRoomContent } from '../cia-school/cia-content-config';
import type { PhPageCopy, PhSchoolProfile, PhVideoItem, PhVideoTab } from '../school-page/ph-school-profile';
import { cloneMonolContentConfig, createDefaultMonolContentConfig, MONOL_2027_PRICE_REGISTRATION_START } from './monol-content-config';
import {
  MONOL_ALBUM_DESCRIPTIONS,
  MONOL_BASIC_INFO,
  MONOL_COURSE_DETAIL_GUIDES,
  MONOL_DORM_RULES,
  MONOL_FACILITIES,
  MONOL_FAQS,
  MONOL_FINAL_CTA_BADGES,
  MONOL_GALLERY_IMAGES,
  MONOL_HOLIDAY_CALENDARS,
  MONOL_NOT_SUITABLE_FOR,
  MONOL_OFFERS,
  MONOL_OVERVIEW_FACTS,
  MONOL_PAGE_TEXT,
  MONOL_PRACTICAL_GUIDES,
  MONOL_QUICK_INFO,
  MONOL_REFERENCE_NOTE,
  MONOL_REFUND_COPY,
  MONOL_ROOM_PROFILES,
  MONOL_SCHEDULE,
  MONOL_SUITABLE_FOR,
  MONOL_VIDEOS,
  monolVideoPoster,
  monolVideoSrc,
  type MonolVideo,
} from './monol-page-content';

const defaults = createDefaultMonolContentConfig();
const EVENING_START = MONOL_SCHEDULE.findIndex(row => row.time.startsWith('17:00'));
const initialPricing = createCiaQuotePricing(defaults);
const brandMonol = (text: string) => text.replace(/CIA/g, 'MONOL主校区');

const MONOL_COPY: PhPageCopy = {
  swipeHint: CIA_PAGE_COPY.swipeHint,
  referenceNote: MONOL_REFERENCE_NOTE,
  hero: {
    breadcrumb: '菲律宾游学 / 碧瑶学校 / MONOL主校区',
    title: '菲律宾碧瑶 MONOL 主校区',
    lead: MONOL_PAGE_TEXT.heroLead,
    tags: [
      { icon: 'terrain', text: '碧瑶' },
      { icon: 'self_improvement', text: '半自律' },
      { icon: 'fitness_center', text: '免费健身课' },
      { icon: 'tune', text: 'LEAP自选科目' },
    ],
    quoteLabel: '获取 MONOL 最新报价',
  },
  overview: { title: '30 秒看懂 MONOL 主校区' },
  advisorReview: {
    title: '顾问怎么看 MONOL 主校区',
    text: MONOL_PAGE_TEXT.advisorText,
    suitableTitle: '适合谁',
    notSuitableTitle: '报名前想清楚',
  },
  campus: {
    eyebrow: 'CAMPUS AT A GLANCE',
    title: 'MONOL 主校区校园介绍',
    intro: MONOL_PAGE_TEXT.campusIntro,
  },
  gallery: {
    title: '按区域查看 MONOL 主校区环境',
    intro: MONOL_PAGE_TEXT.galleryIntro,
    photoNote: CIA_PAGE_COPY.gallery.photoNote,
    roomComparisonTitle: '房型对比',
    roomDisclaimer: MONOL_REFERENCE_NOTE,
  },
  courses: {
    title: 'MONOL 主校区课程怎么选？',
    intro: MONOL_PAGE_TEXT.coursesIntro,
    priceUnit: '/4周',
    fitLabel: '适合人群',
    noteLabel: '课程说明',
    detailSummaryTitle: '查看课程细节与每日作息',
    detailSummaryHint: '每节课上什么、分级和升级、加购一对一和上课天数',
    guideTitle: '报名前值得确认的课程细节',
  },
  schedule: {
    eyebrow: 'DAILY TIMETABLE',
    title: 'MONOL 主校区每日作息（周一至周五）',
    intro: '每节课45分钟；一对一和团体课的时段按个人课表安排，傍晚的健身课免费、自由参加。',
    badge: '每天最多9节',
  },
  planning: {
    summaryTitle: '2027年学校假期',
    summaryHint: '公休日停课，暑期旺季每周加收附加费',
  },
  calendar: {
    eyebrow: 'ACADEMIC CALENDAR',
    title: 'MONOL 主校区 2027年日历',
    intro: '学校假期和暑期旺季一表看完，用于规划入学日期和周数。',
    footnote: '只列周一至周五的公休日；标“待定”的日期以菲律宾政府公告为准。',
    peakEyebrow: 'PEAK SEASON',
    peakTitle: '暑期旺季',
    peakIntro: '',
    peakNote: '',
  },
  videos: {
    eyebrow: 'SCHOOL VIDEOS',
    title: '用视频了解 MONOL 主校区',
    intro: '校园、宿舍、课堂、运动设施和各国学员访谈的实拍视频。',
    badge: 'MONOL 学校视频',
    lifeTitle: '校园短片',
  },
  rooms: {
    photoTitle: '房型实景',
    photoIntro: MONOL_PAGE_TEXT.roomsPhotoIntro,
    rulesTitle: '入住离校、门禁与宿舍规定',
    rulesHint: '短期费率、入住离校、门禁、外出旅行和宿舍规定',
    dormRulesTitle: '宿舍规定',
  },
  quote: {
    ...CIA_PAGE_COPY.quote,
    compareShortcuts: [
      { focus: 'room', label: '比房型', hint: '如胶囊四人间、三人间和单人间' },
      { focus: 'course', label: '比课程', hint: '如 Light ESL 和 General ESL' },
      { focus: 'weeks', label: '比周数', hint: '如4周、8周、12周' },
    ],
  },
  fees: CIA_PAGE_COPY.fees,
  refund: MONOL_REFUND_COPY,
  practicalGuide: {
    summaryTitle: '到校须知与学校服务',
    summaryHint: '吃饭、生活服务、接机和第一天、付费课程与周末出游、学校周边',
    intro: '出发前和到校后最常问到的安排。',
  },
  sida: {
    ...CIA_PAGE_COPY.sida,
    title: brandMonol(CIA_PAGE_COPY.sida.title),
    photoAlt: brandMonol(CIA_PAGE_COPY.sida.photoAlt),
    photoCaption: brandMonol(CIA_PAGE_COPY.sida.photoCaption),
  },
  offers: {
    eyebrow: 'OFFERS',
    title: 'MONOL 主校区报名优惠',
    intro: '思达启航免注册费和学校优惠可以叠加；每项优惠的报名日期、入学日期和周数条件写在卡片上。',
    note: '报价器会按报名日、入学日和周数自动算出能用的优惠；最终以学校确认为准。',
  },
  faq: CIA_PAGE_COPY.faq,
  finalCta: {
    title: MONOL_PAGE_TEXT.finalCtaTitle,
    text: MONOL_PAGE_TEXT.finalCtaText,
    primaryLabel: '获取 MONOL 主校区完整报价单',
    secondaryLabel: '咨询当前空房',
  },
};

/** Local date (YYYY-MM-DD). */
const monolLocalToday = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};
/** Until 2026/12/31 the room list shows the current prices; from 2027/01/01 it shows the 2027 ones. */
export const monolListsCurrentRoomPrices = (): boolean => monolLocalToday() < MONOL_2027_PRICE_REGISTRATION_START;

const PREMIUM_SHARE_NOTE = '高级单人间A型和B型有两张大床，最多4人同住，同住的每人每4周加200美元。';

/** Notes under the room price groups: Premium sharing, and the 2027 prices while the list still shows the current ones. */
export function monolRoomGroupNotes(rooms: readonly CiaRoomContent[], listsCurrent = monolListsCurrentRoomPrices()): Record<string, string> {
  const notes: Record<string, string> = { 单人间: PREMIUM_SHARE_NOTE };
  if (!listsCurrent) return notes;
  for (const group of new Set(rooms.filter(room => room.enabled).map(room => room.group))) {
    const changed = rooms
      .filter(room => room.enabled && room.group === group && room.fee2027 !== undefined && room.fee2027 !== room.fee)
      .sort((a, b) => a.sortOrder - b.sortOrder);
    if (!changed.length) continue;
    const line = `2026/12/31前报名按现价；2027/01/01起报名：${changed.map(room => `${room.label} ${(room.fee2027 as number).toLocaleString('en-US')}`).join('、')} 美元。`;
    notes[group] = notes[group] ? notes[group] + line : line;
  }
  return notes;
}

const MONOL_INITIAL_ROOM_RATE_GROUPS: RoomRateGroup[] = [...new Set(defaults.rooms.map(room => room.group))].map(title => ({
  title,
  rooms: defaults.rooms
    .filter(room => room.enabled && room.group === title)
    .map(room => ({ id: room.id, label: room.label, code: room.code, location: room.location })),
}));

const video = (name: string): MonolVideo => MONOL_VIDEOS.find(item => item.name === name) as MonolVideo;
const albumVideo = (name: string): PhVideoItem => {
  const item = video(name);
  return {
    title: item.title, text: item.description, src: monolVideoSrc(item), poster: monolVideoPoster(item), duration: item.duration,
    shape: item.vertical ? 'tall' : 'wide',
  };
};
const shortVideo = (item: MonolVideo): CiaShortVideo => ({
  title: item.title, text: item.description, src: monolVideoSrc(item), poster: monolVideoPoster(item), duration: item.duration,
  ...(item.vertical ? {} : { shape: 'wide' as const }),
});

const MONOL_VIDEO_TOPICS: ReadonlyArray<MonolVideo['topic']> = ['校园', '宿舍', '课堂', '设施', '访谈'];
const MONOL_VIDEO_TABS: PhVideoTab[] = MONOL_VIDEO_TOPICS.map(topic => ({
  label: `${topic}视频`,
  icon: 'videocam',
  items: MONOL_VIDEOS.filter(item => item.topic === topic).map(item => albumVideo(item.name)),
}));

export const MONOL_PAGE_PROFILE: PhSchoolProfile = {
  code: 'MONOL',
  name: 'MONOL主校区',
  previewPrefix: 'monol',
  pricingSchoolName: '菲律宾碧瑶MONOL主校区',
  copy: MONOL_COPY,
  compactLayout: true,
  overviewFacts: MONOL_OVERVIEW_FACTS,
  videoTabs: MONOL_VIDEO_TABS,
  courseHighlights: {
    ielts: { badge: '每两周一次雅思模考' },
    'leap-english': { badge: '科目自己组合' },
  },
  roomVideos: {
    'premium-b': albumVideo('room-premium-b'),
    'standard-single': albumVideo('room-standard-single'),
    'semi-single': albumVideo('room-semi-single'),
  },
  gallery: {
    categories: CIA_GALLERY_CATEGORIES,
    albumCategories: ['校园', '教室', '住宿', '餐厅', '设施'],
    images: MONOL_GALLERY_IMAGES,
    heroCategories: ['校园', '住宿', '设施'],
    albumDescriptions: MONOL_ALBUM_DESCRIPTIONS,
    uploadedPhotoTitle: 'MONOL主校区学校媒体',
    uploadedPhotoDescription: 'MONOL主校区实景内容',
    uploadedVideoTitle: 'MONOL主校区学校视频',
  },
  snapshotCards: MONOL_QUICK_INFO,
  basicInfo: MONOL_BASIC_INFO,
  suitableFor: MONOL_SUITABLE_FOR.map(title => ({ title, text: '' })),
  notSuitableFor: MONOL_NOT_SUITABLE_FOR.map(title => ({ title, text: '' })),
  campusBuildings: MONOL_FACILITIES,
  videoCards: [],
  campusLifeVideos: MONOL_VIDEOS.map(shortVideo),
  interviewVideos: [],
  courseGroups: [
    { icon: 'forum', title: '综合英语 ESL', text: '每天4–5节一对一，加免费团体课', courseIds: ['esl-4', 'general-esl'] },
    { icon: 'workspace_premium', title: '雅思 IELTS', text: '5节一对一，每两周一次模考', courseIds: ['ielts'] },
    { icon: 'tune', title: '客制化 LEAP', text: '按目标自己组合一对一科目', courseIds: ['leap-english'] },
  ],
  studyModes: [],
  courseDetailGuides: MONOL_COURSE_DETAIL_GUIDES,
  scheduleColumns: [
    { code: 'DAY', title: '白天课程', rows: MONOL_SCHEDULE.slice(0, EVENING_START) },
    { code: 'EVENING', title: '傍晚免费健身课', rows: MONOL_SCHEDULE.slice(EVENING_START) },
  ],
  initialCourseFees: initialPricing.courseFees,
  initialRoomFees: initialPricing.roomFees,
  initialRoomRateGroups: MONOL_INITIAL_ROOM_RATE_GROUPS,
  roomGroupNotes: monolRoomGroupNotes(defaults.rooms),
  showRoomCodes: false,
  dormRules: MONOL_DORM_RULES,
  roomProfiles: MONOL_ROOM_PROFILES,
  ieltsResults: [],
  studentReviews: [],
  reviewPath: '',
  holidayCalendars: MONOL_HOLIDAY_CALENDARS,
  ieltsComputerExamDates2027: [],
  studentCareServices: [],
  campusPracticalGuides: MONOL_PRACTICAL_GUIDES,
  studentTracks: [],
  sidaReasons: CIA_SIDA_REASONS.map(reason => ({ ...reason, alt: brandMonol(reason.alt) })),
  sidaTrustBadges: CIA_SIDA_TRUST_BADGES,
  ctaBadges: MONOL_FINAL_CTA_BADGES,
  ctaConsultants: CIA_CTA_CONSULTANTS,
  offers: MONOL_OFFERS,
  mobileAnchors: [
    { label: '视频', target: 'gallery', icon: 'smart_display' },
    { label: '概览', target: 'overview', icon: 'dashboard' },
    { label: '课程', target: 'courses', icon: 'menu_book' },
    { label: '住宿', target: 'rooms', icon: 'bed' },
    { label: '优惠', target: 'offers', icon: 'local_offer' },
    { label: '报价', target: 'quote', icon: 'calculate' },
    { label: 'FAQ', target: 'faq', icon: 'help' },
  ],
  faqs: () => MONOL_FAQS.map(item => ({ ...item })),
  shows2026Prices: () => false,
  defaultContent: createDefaultMonolContentConfig,
  cloneContent: cloneMonolContentConfig,
};

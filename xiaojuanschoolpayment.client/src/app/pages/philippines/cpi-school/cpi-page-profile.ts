// CPI content for the shared Philippine school page (school-page/ph-school-page.component.*).
// Text and data come from cpi-page-content.ts; prices and rules from cpi-content-config.ts.
// Keep it pure data (no Angular, DOM or storage), like the modules it reads.
import { createCiaQuotePricing } from '../cia-school/cia-quote-engine';
import {
  CIA_CTA_CONSULTANTS,
  CIA_GALLERY_CATEGORIES,
  CIA_PAGE_COPY,
  CIA_SIDA_REASONS,
  CIA_SIDA_TRUST_BADGES,
  type CiaShortVideo,
  type CiaVideoCard,
  type RoomRateGroup,
} from '../cia-school/cia-page-content';
import type { PhPageCopy, PhSchoolProfile, PhVideoItem, PhVideoTab } from '../school-page/ph-school-profile';
import {
  CPI_IELTS_GUARANTEE_ID,
  CPI_JUNIOR_COURSE_ID,
  CPI_PARENTS_COURSE_ID,
  CPI_PREMIUM_STAY_WINDOWS,
  cloneCpiContentConfig,
  createDefaultCpiContentConfig,
} from './cpi-content-config';
import {
  CPI_ALBUM_DESCRIPTIONS,
  CPI_BASIC_INFO,
  CPI_CAMPUS_BUILDINGS,
  CPI_COURSE_DETAIL_GUIDES,
  CPI_DORM_RULES,
  CPI_FAQS,
  CPI_FINAL_CTA_BADGES,
  CPI_GALLERY_IMAGES,
  CPI_NOT_SUITABLE_FOR,
  CPI_OVERVIEW_FACTS,
  CPI_PAGE_TEXT,
  CPI_PRACTICAL_GUIDES,
  CPI_QUICK_INFO,
  CPI_REFERENCE_NOTE,
  CPI_ROOM_PROFILES,
  CPI_SCHEDULE,
  CPI_SUITABLE_FOR,
  CPI_VIDEOS,
  cpiVideoPoster,
  cpiVideoSrc,
  type CpiVideo,
} from './cpi-page-content';

const defaults = createDefaultCpiContentConfig();
const AFTERNOON_START = CPI_SCHEDULE.findIndex(row => row.time.startsWith('13:15'));
const initialPricing = createCiaQuotePricing(defaults);
const brandCpi = (text: string) => text.replace(/CIA/g, 'CPI');

const CPI_COPY: PhPageCopy = {
  swipeHint: CIA_PAGE_COPY.swipeHint,
  referenceNote: CPI_REFERENCE_NOTE,
  hero: {
    breadcrumb: '菲律宾游学 / 宿务学校 / CPI',
    title: '菲律宾宿务 CPI 语言学校',
    lead: CPI_PAGE_TEXT.heroLead,
    tags: [
      { icon: 'location_on', text: '宿务市区 Lahug' },
      { icon: 'verified', text: '半斯巴达（可选斯巴达）' },
      { icon: 'pool', text: '奥运规格泳池' },
      { icon: 'apartment', text: '新开 Premium 公寓' },
    ],
  },
  overview: { title: '30 秒看懂 CPI' },
  advisorReview: {
    title: '顾问怎么看 CPI',
    text: CPI_PAGE_TEXT.advisorText,
    suitableTitle: '适合谁',
    notSuitableTitle: '报名前想清楚',
  },
  campus: {
    eyebrow: 'CAMPUS AT A GLANCE',
    title: 'CPI 校园介绍',
    intro: CPI_PAGE_TEXT.campusIntro,
  },
  gallery: {
    title: '按区域查看 CPI 环境',
    intro: CPI_PAGE_TEXT.galleryIntro,
    photoNote: CIA_PAGE_COPY.gallery.photoNote,
    roomComparisonTitle: '房型对比',
    roomDisclaimer: CPI_REFERENCE_NOTE,
  },
  courses: {
    title: 'CPI 课程怎么选？',
    intro: CPI_PAGE_TEXT.coursesIntro,
    priceUnit: '/4周',
    fitLabel: '适合人群',
    noteLabel: '课程说明',
    detailSummaryTitle: '查看课程细节与每日作息',
    detailSummaryHint: '雅思保证班、免费课程、亲子课程、上课规定和每日作息',
    guideTitle: '报名前值得确认的课程细节',
  },
  schedule: {
    eyebrow: 'DAILY TIMETABLE',
    title: 'CPI 每日作息（密集英语，周一至周五）',
    intro: '每节课45分钟，课间休息5分钟；实际课表按所选课程和分班安排。',
    badge: '课后有免费课程和社团',
  },
  videos: {
    eyebrow: 'SCHOOL VIDEOS',
    title: '用视频了解 CPI',
    intro: '可以看到房间、教室、餐厅、泳池和课后活动。部分学校官方视频拍摄于2016–2019年，现况以学校为准；新开的Premium公寓暂无视频。',
    badge: 'CPI 校园视频',
    lifeTitle: '校园生活短片',
  },
  rooms: {
    photoTitle: '房型实景',
    photoIntro: CPI_PAGE_TEXT.roomsPhotoIntro,
    videoLink: '看宿舍导览视频 →',
    rulesTitle: '短期费率、入住离校与宿舍规定',
    rulesHint: '1–3周住宿费比例、入住离校、额外住宿费、门禁与宿舍规定',
    dormRulesTitle: '宿舍与Premium公寓规定',
  },
  quote: {
    ...CIA_PAGE_COPY.quote,
    compareShortcuts: [
      { focus: 'room', label: '比房型', hint: '如A栋、B栋和Premium公寓' },
      { focus: 'course', label: '比同类课程', hint: '如雅思常规、强化和保证班' },
      { focus: 'weeks', label: '比周数', hint: '如4周、8周、12周' },
    ],
  },
  fees: CIA_PAGE_COPY.fees,
  practicalGuide: {
    summaryTitle: '到校须知与学校服务',
    summaryHint: '第一天安排、用餐与开放时间、清洁洗衣、公寓接驳车、其他收费、周末活动',
    intro: '出发前和到校后最常问到的安排。',
  },
  sida: {
    ...CIA_PAGE_COPY.sida,
    title: brandCpi(CIA_PAGE_COPY.sida.title),
    photoAlt: brandCpi(CIA_PAGE_COPY.sida.photoAlt),
    photoCaption: brandCpi(CIA_PAGE_COPY.sida.photoCaption),
  },
  faq: CIA_PAGE_COPY.faq,
  finalCta: {
    title: CPI_PAGE_TEXT.finalCtaTitle,
    text: CPI_PAGE_TEXT.finalCtaText,
    primaryLabel: '获取 CPI 完整报价单',
    secondaryLabel: '咨询当前空房',
  },
};

const CPI_INITIAL_ROOM_RATE_GROUPS: RoomRateGroup[] = [...new Set(defaults.rooms.map(room => room.group))].map(title => ({
  title,
  rooms: defaults.rooms
    .filter(room => room.enabled && room.group === title)
    .map(room => ({ id: room.id, label: room.label, code: room.code, location: room.location })),
}));

const videoCard = (video: CpiVideo): CiaVideoCard => ({
  code: 'CPI',
  label: video.label ?? 'CPI',
  title: video.title,
  text: video.description,
  poster: cpiVideoPoster(video),
  videoSrc: cpiVideoSrc(video),
  contentType: 'video/mp4',
  details: [...(video.details ?? []), `时长 ${video.duration}`],
});
const shortVideo = (video: CpiVideo): CiaShortVideo => ({
  title: video.title,
  text: video.description,
  src: cpiVideoSrc(video),
  poster: cpiVideoPoster(video),
  duration: video.duration,
  ...(video.orientation === 'landscape' ? { shape: 'wide' as const } : {}),
});
const videosIn = (section: CpiVideo['section']) => CPI_VIDEOS.filter(video => video.section === section);

const albumVideo = (name: string): PhVideoItem => {
  const video = CPI_VIDEOS.find(item => item.name === name) as CpiVideo;
  return {
    title: video.title,
    text: video.description,
    src: cpiVideoSrc(video),
    poster: cpiVideoPoster(video),
    duration: video.duration,
    shape: video.orientation === 'landscape' ? 'wide' : 'tall',
  };
};

/** Videos in the hero album, one chip per topic; the school film opens the album, newer clips come next. */
const CPI_VIDEO_TABS: PhVideoTab[] = [
  {
    label: '校园视频', icon: 'videocam',
    items: ['school-intro', 'teachers-day', 'new-students', 'campus-walk', 'pool', 'gym', 'campus-night', 'teachers'].map(albumVideo),
  },
  { label: '宿舍视频', icon: 'videocam', items: ['room-a-double', 'dorm-tour'].map(albumVideo) },
  {
    label: '课程视频', icon: 'videocam',
    items: ['class-one-to-one', 'class-group', 'exam-room', 'junior-program', 'ukulele-class'].map(albumVideo),
  },
  { label: '餐厅与活动视频', icon: 'videocam', items: ['dining', 'meals-activities', 'graduation', 'coolture-festival', 'foam-festival'].map(albumVideo) },
];

export const CPI_PAGE_PROFILE: PhSchoolProfile = {
  code: 'CPI',
  name: 'CPI',
  previewPrefix: 'cpi',
  pricingSchoolName: 'CPI',
  copy: CPI_COPY,
  compactLayout: true,
  overviewFacts: CPI_OVERVIEW_FACTS,
  videoTabs: CPI_VIDEO_TABS,
  courseHighlights: {
    [CPI_IELTS_GUARANTEE_ID]: {
      badge: '送1次官方雅思考试',
      label: '考试福利',
      text: '学校在最后一个月安排1次官方雅思考试，不用另付考试费。',
    },
  },
  // The A-2 clip opens that room's photos; the dorm tour shows several room types, so it stays in the hero album only.
  roomVideos: { 'a-double': albumVideo('room-a-double') },
  gallery: {
    categories: CIA_GALLERY_CATEGORIES,
    albumCategories: ['校园', '教室', '住宿', '餐厅', '设施'],
    images: CPI_GALLERY_IMAGES,
    heroCategories: ['校园', '设施', '住宿'],
    albumDescriptions: CPI_ALBUM_DESCRIPTIONS,
    uploadedPhotoTitle: 'CPI 学校媒体',
    uploadedPhotoDescription: 'CPI 学校实景内容',
    uploadedVideoTitle: 'CPI 学校视频',
  },
  snapshotCards: CPI_QUICK_INFO,
  basicInfo: CPI_BASIC_INFO,
  suitableFor: CPI_SUITABLE_FOR.map(title => ({ title, text: '' })),
  notSuitableFor: CPI_NOT_SUITABLE_FOR.map(title => ({ title, text: '' })),
  campusBuildings: CPI_CAMPUS_BUILDINGS,
  videoCards: videosIn('tour').map(videoCard),
  campusLifeVideos: videosIn('life').map(shortVideo),
  interviewVideos: [],
  courseGroups: [
    { icon: 'forum', title: '综合英语 ESL', text: '听说读写全面提升', courseIds: ['esl-general-15', 'esl-intensive'] },
    {
      icon: 'workspace_premium', title: '雅思 IELTS', text: '预备、常规、强化和12周保证班',
      courseIds: [CPI_IELTS_GUARANTEE_ID, 'ielts-preparatory', 'ielts-general', 'ielts-intensive'],
    },
    {
      icon: 'fact_check', title: '托业 TOEIC', text: '预备、常规、强化和保证班',
      courseIds: ['toeic-guarantee', 'toeic-preparatory', 'toeic-general', 'toeic-intensive'],
    },
    {
      icon: 'school', title: '托福 TOEFL', text: '预备、常规、强化和保证班',
      courseIds: ['toefl-guarantee', 'toefl-preparatory', 'toefl-general', 'toefl-intensive'],
    },
    { icon: 'business_center', title: '商务英语 ESP', text: '面试、会议和职场写作', courseIds: ['esp-bridge', 'esp-general'] },
    { icon: 'family_restroom', title: '青少年与家长', text: '6–15岁孩子和陪读家长', courseIds: [CPI_JUNIOR_COURSE_ID, CPI_PARENTS_COURSE_ID] },
  ],
  studyModes: [],
  courseDetailGuides: CPI_COURSE_DETAIL_GUIDES,
  scheduleColumns: [
    { code: 'MORNING', title: '上午', rows: CPI_SCHEDULE.slice(0, AFTERNOON_START) },
    { code: 'AFTERNOON', title: '下午和晚上', rows: CPI_SCHEDULE.slice(AFTERNOON_START) },
  ],
  initialCourseFees: initialPricing.courseFees,
  initialRoomFees: initialPricing.roomFees,
  initialRoomRateGroups: CPI_INITIAL_ROOM_RATE_GROUPS,
  // User decision 2026-11-21: say on the price list when Premium is open; other dates cannot be quoted.
  roomGroupNotes: {
    // One period per line, so a narrow price column never splits a date.
    'Premium公寓': `只接受以下日期入住：\n${CPI_PREMIUM_STAY_WINDOWS.map(period => period.label).join('\n')}\n其他日期不能报价。`,
  },
  showRoomCodes: false,
  dormRules: CPI_DORM_RULES,
  roomProfiles: CPI_ROOM_PROFILES,
  ieltsResults: [],
  studentReviews: [],
  reviewPath: '',
  schoolCompareId: 'cpi',
  holidayCalendars: [],
  ieltsComputerExamDates2027: [],
  studentCareServices: [],
  campusPracticalGuides: CPI_PRACTICAL_GUIDES,
  studentTracks: [],
  sidaReasons: CIA_SIDA_REASONS.map(reason => ({ ...reason, alt: brandCpi(reason.alt) })),
  sidaTrustBadges: CIA_SIDA_TRUST_BADGES,
  ctaBadges: CPI_FINAL_CTA_BADGES,
  ctaConsultants: CIA_CTA_CONSULTANTS,
  mobileAnchors: [
    { label: '视频', target: 'gallery', icon: 'smart_display' },
    { label: '概览', target: 'overview', icon: 'dashboard' },
    { label: '课程', target: 'courses', icon: 'menu_book' },
    { label: '住宿', target: 'rooms', icon: 'bed' },
    { label: '报价', target: 'quote', icon: 'calculate' },
    { label: 'FAQ', target: 'faq', icon: 'help' },
  ],
  faqs: () => CPI_FAQS.map(item => ({ ...item })),
  shows2026Prices: () => false,
  defaultContent: createDefaultCpiContentConfig,
  cloneContent: cloneCpiContentConfig,
};

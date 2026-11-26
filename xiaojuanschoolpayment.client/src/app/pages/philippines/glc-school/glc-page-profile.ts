// GLC content for the shared Philippine school page (school-page/ph-school-page.component.*).
// Text and data come from glc-page-content.ts; prices and rules from glc-content-config.ts.
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
import { cloneGlcContentConfig, createDefaultGlcContentConfig, GLC_PEAK_SEASONS } from './glc-content-config';
import {
  GLC_ALBUM_DESCRIPTIONS,
  GLC_BASIC_INFO,
  GLC_CAMPUS_BUILDINGS,
  GLC_COURSE_DETAIL_GUIDES,
  GLC_DORM_RULES,
  GLC_FAQS,
  GLC_FINAL_CTA_BADGES,
  GLC_GALLERY_IMAGES,
  GLC_HOLIDAY_CALENDARS,
  GLC_INTERVIEW_VIDEOS,
  GLC_LIFE_VIDEOS,
  GLC_NOT_SUITABLE_FOR,
  GLC_OVERVIEW_FACTS,
  GLC_PAGE_TEXT,
  GLC_PEAK_NOTE,
  GLC_PRACTICAL_GUIDES,
  GLC_QUICK_INFO,
  GLC_REFERENCE_NOTE,
  GLC_REFUND_COPY,
  GLC_ROOM_PROFILES,
  GLC_ROOM_VIDEOS,
  GLC_SCHEDULE_COLUMNS,
  GLC_STUDY_MODES,
  GLC_SUITABLE_FOR,
  GLC_VIDEO_CARDS,
  GLC_VIDEO_TABS,
} from './glc-page-content';

const defaults = createDefaultGlcContentConfig();
const initialPricing = createCiaQuotePricing(defaults);
const brandGlc = (text: string) => text.replace(/CIA/g, 'GLC');

const GLC_COPY: PhPageCopy = {
  swipeHint: CIA_PAGE_COPY.swipeHint,
  referenceNote: GLC_REFERENCE_NOTE,
  hero: {
    breadcrumb: '菲律宾游学 / 宿务学校 / GLC',
    title: '菲律宾宿务 GLC 语言学校',
    lead: GLC_PAGE_TEXT.heroLead,
    tags: [
      { icon: 'location_on', text: '宿务市区' },
      { icon: 'record_voice_over', text: '口语课程' },
      { icon: 'rule', text: '自律型＋斯巴达' },
      { icon: 'family_restroom', text: '亲子套餐' },
    ],
    quoteLabel: '获取 GLC 最新报价',
  },
  overview: { title: '30 秒看懂 GLC' },
  advisorReview: {
    title: '顾问怎么看 GLC',
    text: GLC_PAGE_TEXT.advisorText,
    suitableTitle: '适合谁',
    notSuitableTitle: '报名前想清楚',
  },
  campus: {
    eyebrow: 'CAMPUS AT A GLANCE',
    title: 'GLC 校园介绍',
    intro: GLC_PAGE_TEXT.campusIntro,
  },
  gallery: {
    title: '按区域查看 GLC 环境',
    intro: GLC_PAGE_TEXT.galleryIntro,
    photoNote: CIA_PAGE_COPY.gallery.photoNote,
    roomComparisonTitle: '房型对比',
    roomDisclaimer: GLC_REFERENCE_NOTE,
  },
  courses: {
    title: 'GLC 课程怎么选？',
    intro: GLC_PAGE_TEXT.coursesIntro,
    priceUnit: '/4周',
    fitLabel: '适合人群',
    noteLabel: '课程说明',
    detailSummaryTitle: '查看课程细节与每日作息',
    detailSummaryHint: '口语、雅思、托业、商务、斯巴达、亲子和儿童课程',
    guideTitle: '报名前值得确认的课程细节',
  },
  studyModes: {
    title: '自律型还是斯巴达？',
    intro: 'GLC 的大多数课程是自律型：下课后可以外出，测验、选修课和晚自习自由参加。斯巴达英语、斯巴达雅思和斯巴达托业另有严格管理。',
    note: '斯巴达学生只能住副楼 Annex2 单人间或双人间；积分低于80%会改成自律型课程，差价不退。',
  },
  schedule: {
    eyebrow: 'DAILY TIMETABLE',
    title: 'GLC 每日作息（课表范例）',
    intro: '每节课50分钟；以下是学校周一至周五的课表范例，每位学生的实际课表会按课程和分班不同。',
    badge: '免费选修课',
  },
  planning: {
    summaryTitle: '2027年假期与寒暑假',
    summaryHint: '停课日、特别团体课和寒暑假规定',
  },
  calendar: {
    eyebrow: 'ACADEMIC CALENDAR',
    title: 'GLC 2027年日历',
    intro: '标“停课”的日子不上课；标“特别团体课”的日子不上正课，学校开8节团体选修课，所有学生都可以参加。',
    footnote: '周末的停课日和周末活动没有列出。',
    peakEyebrow: '2027 WINTER & SUMMER',
    peakTitle: '2027年寒暑假',
    peakIntro: GLC_PEAK_NOTE,
    peakNote: '入学按周日、离校按周六。',
  },
  videos: {
    eyebrow: 'SCHOOL VIDEOS',
    title: '用视频了解 GLC',
    intro: '学校官方拍摄的校园、宿舍、课堂、餐食、活动和学员访谈。',
    badge: 'GLC 学校视频',
    lifeTitle: '校园短片',
    interviewTitle: '学员访谈',
  },
  rooms: {
    photoTitle: '房型实景',
    photoIntro: GLC_PAGE_TEXT.roomsPhotoIntro,
    rulesTitle: '短期附加费、入住离校与宿舍规定',
    rulesHint: '1–3周附加费、入住离校、延迟退房和宿舍规定',
    dormRulesTitle: '宿舍规定',
  },
  quote: {
    ...CIA_PAGE_COPY.quote,
    compareShortcuts: [
      { focus: 'room', label: '比房型', hint: '如主楼双人间、三人间和副楼单人间' },
      { focus: 'course', label: '比同类课程', hint: '如标准口语和强化口语' },
      { focus: 'weeks', label: '比周数', hint: '如4周、8周、12周' },
    ],
  },
  fees: CIA_PAGE_COPY.fees,
  refund: GLC_REFUND_COPY,
  practicalGuide: {
    summaryTitle: '到校须知与学校服务',
    summaryHint: '用餐与开放时间、洗衣看病、购物班车、选修课与活动、出发前准备',
    intro: '出发前和到校后最常问到的安排。',
  },
  sida: {
    ...CIA_PAGE_COPY.sida,
    title: brandGlc(CIA_PAGE_COPY.sida.title),
    photoAlt: brandGlc(CIA_PAGE_COPY.sida.photoAlt),
    photoCaption: brandGlc(CIA_PAGE_COPY.sida.photoCaption),
  },
  faq: CIA_PAGE_COPY.faq,
  finalCta: {
    title: GLC_PAGE_TEXT.finalCtaTitle,
    text: GLC_PAGE_TEXT.finalCtaText,
    primaryLabel: '获取 GLC 完整报价单',
    secondaryLabel: '咨询当前空房',
  },
};

const GLC_INITIAL_ROOM_RATE_GROUPS: RoomRateGroup[] = [...new Set(defaults.rooms.map(room => room.group))].map(title => ({
  title,
  rooms: defaults.rooms
    .filter(room => room.enabled && room.group === title)
    .map(room => ({ id: room.id, label: room.label, code: room.code, location: room.location })),
}));

export const GLC_PAGE_PROFILE: PhSchoolProfile = {
  code: 'GLC',
  name: 'GLC',
  previewPrefix: 'glc',
  pricingSchoolName: '菲律宾宿务Global Language Cebu',
  copy: GLC_COPY,
  compactLayout: true,
  overviewFacts: GLC_OVERVIEW_FACTS,
  videoTabs: GLC_VIDEO_TABS,
  roomVideos: GLC_ROOM_VIDEOS,
  peakSeasonsWithoutSurcharge: { title: '寒暑假不加价', ranges: GLC_PEAK_SEASONS },
  shortStayRows: [
    { label: '1–3周', text: '课程和住宿按周计算，另收每周60美元短期附加费' },
    { label: '4周以上', text: '不收短期附加费' },
  ],
  gallery: {
    categories: CIA_GALLERY_CATEGORIES,
    albumCategories: ['校园', '教室', '住宿', '餐厅', '设施'],
    images: GLC_GALLERY_IMAGES,
    heroCategories: ['校园', '设施', '住宿'],
    albumDescriptions: GLC_ALBUM_DESCRIPTIONS,
    uploadedPhotoTitle: 'GLC 学校媒体',
    uploadedPhotoDescription: 'GLC 学校实景内容',
    uploadedVideoTitle: 'GLC 学校视频',
  },
  snapshotCards: GLC_QUICK_INFO,
  basicInfo: GLC_BASIC_INFO,
  suitableFor: GLC_SUITABLE_FOR.map(title => ({ title, text: '' })),
  notSuitableFor: GLC_NOT_SUITABLE_FOR.map(title => ({ title, text: '' })),
  campusBuildings: GLC_CAMPUS_BUILDINGS,
  videoCards: GLC_VIDEO_CARDS,
  campusLifeVideos: GLC_LIFE_VIDEOS,
  interviewVideos: GLC_INTERVIEW_VIDEOS,
  courseGroups: [
    {
      icon: 'record_voice_over', title: '口语 ESL', text: '以口语和日常沟通为主，含斯巴达英语',
      courseIds: ['light-power-speaking', 'power-speaking', 'intensive-power-speaking', 'ultra7-power-speaking', 'ultra-sparta-esl'],
    },
    {
      icon: 'workspace_premium', title: '雅思 IELTS', text: '学术类雅思，Global Exam 线上题库',
      courseIds: ['general-ielts', 'intensive-ielts', 'ultra8-ielts', 'ultra-ielts-sparta'],
    },
    {
      icon: 'fact_check', title: '托业 TOEIC', text: '求职和升学用的英语考试',
      courseIds: ['general-toeic', 'intensive-toeic', 'ultra8-toeic', 'ultra-toeic-sparta'],
    },
    { icon: 'business_center', title: '商务英语', text: '18岁以上，会议和营销等商务场景', courseIds: ['business-course', 'ultra7-business'] },
    { icon: 'family_restroom', title: '亲子套餐', text: '2–4人家庭同住一间，家长可以不上课', courseIds: ['family-package-2', 'family-package-3', 'family-package-4'] },
    {
      icon: 'child_care', title: '儿童和青少年', text: '5–11岁儿童英语，12–14岁青少年口语',
      courseIds: ['kids-english-6', 'kids-english-7', 'kids-english-8', 'junior-power-speaking-6', 'junior-power-speaking-7', 'junior-power-speaking-8'],
    },
  ],
  studyModes: GLC_STUDY_MODES,
  courseDetailGuides: GLC_COURSE_DETAIL_GUIDES,
  scheduleColumns: GLC_SCHEDULE_COLUMNS,
  initialCourseFees: initialPricing.courseFees,
  initialRoomFees: initialPricing.roomFees,
  initialRoomRateGroups: GLC_INITIAL_ROOM_RATE_GROUPS,
  roomGroupNotes: {
    '副楼 Annex2 宿舍': '斯巴达课程学生只能住副楼。',
    '校外合作酒店': '具体入住哪家酒店，报名时向学校确认；住酒店不收宿舍水电费和押金。',
  },
  showRoomCodes: false,
  dormRules: GLC_DORM_RULES,
  roomProfiles: GLC_ROOM_PROFILES,
  ieltsResults: [],
  studentReviews: [],
  reviewPath: '',
  holidayCalendars: GLC_HOLIDAY_CALENDARS,
  ieltsComputerExamDates2027: [],
  studentCareServices: [],
  campusPracticalGuides: GLC_PRACTICAL_GUIDES,
  studentTracks: [],
  sidaReasons: CIA_SIDA_REASONS.map(reason => ({ ...reason, alt: brandGlc(reason.alt) })),
  sidaTrustBadges: CIA_SIDA_TRUST_BADGES,
  ctaBadges: GLC_FINAL_CTA_BADGES,
  ctaConsultants: CIA_CTA_CONSULTANTS,
  mobileAnchors: [
    { label: '照片', target: 'gallery', icon: 'photo_library' },
    { label: '概览', target: 'overview', icon: 'dashboard' },
    { label: '课程', target: 'courses', icon: 'menu_book' },
    { label: '住宿', target: 'rooms', icon: 'bed' },
    { label: '报价', target: 'quote', icon: 'calculate' },
    { label: 'FAQ', target: 'faq', icon: 'help' },
  ],
  faqs: () => GLC_FAQS.map(item => ({ ...item })),
  shows2026Prices: () => false,
  defaultContent: createDefaultGlcContentConfig,
  cloneContent: cloneGlcContentConfig,
};

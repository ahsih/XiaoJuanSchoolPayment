// EV main campus content for the shared Philippine school page (school-page/ph-school-page.component.*).
// Text and data come from ev-page-content.ts; prices and rules from ev-content-config.ts.
// Keep it pure data (no Angular, DOM or storage), like the modules it reads.
import { SIDA_PHILIPPINES_CONSULTANTS } from '../../../components/sida-consultants';
import { createCiaQuotePricing } from '../cia-school/cia-quote-engine';
import {
  CIA_GALLERY_CATEGORIES,
  CIA_PAGE_COPY,
  CIA_SIDA_REASONS,
  CIA_SIDA_TRUST_BADGES,
  type CampusBuildingCard,
  type CampusPracticalGuide,
  type CiaShortVideo,
  type CiaVideoCard,
  type CourseDetailGuide,
  type DailyScheduleRow,
  type GalleryImage,
  type RoomRateGroup,
} from '../cia-school/cia-page-content';
import type { PhPageCopy, PhRoomProfile, PhSchoolProfile } from '../school-page/ph-school-profile';
import { cloneEvContentConfig, createDefaultEvContentConfig, EV_IELTS_GUARANTEE_ID } from './ev-content-config';
import {
  EV_ACTIVITY_TIMES,
  EV_BASIC_INFO,
  EV_CAMPUS_ACTIVITIES,
  EV_DORM_RULES,
  EV_ELECTIVE_GROUPS,
  EV_FAQS,
  EV_FINAL_CTA_BADGES,
  EV_FIRST_DAY,
  EV_FIRST_DAY_NOTES,
  EV_GALLERY_IMAGES,
  EV_IELTS_GUARANTEE_NOTE,
  EV_IELTS_GUARANTEE_TARGETS,
  EV_NOTES,
  EV_NOT_SUITABLE_FOR,
  EV_OTHER_FEES,
  EV_PACKING_NOTES,
  EV_PAGE_COPY,
  EV_QUICK_INFO,
  EV_REFERENCE_NOTE,
  EV_SCHEDULE,
  EV_SCHOOL_SERVICES,
  EV_SERVICE_FACTS,
  EV_STUDY_PLANS,
  EV_SUITABLE_FOR,
  EV_VIDEOS,
  EV_WEEKEND_ACTIVITIES,
  EV_WEEKEND_SIGNUP,
  type EvScheduleItem,
  type EvVideo,
} from './ev-page-content';

const defaults = createDefaultEvContentConfig();
const initialPricing = createCiaQuotePricing(defaults);
const brandEv = (text: string) => text.replace(/CIA/g, 'EV');

const EV_COPY: PhPageCopy = {
  swipeHint: CIA_PAGE_COPY.swipeHint,
  referenceNote: EV_REFERENCE_NOTE,
  hero: {
    breadcrumb: '菲律宾游学 / 宿务学校 / EV',
    title: '菲律宾宿务 EV 语言学校',
    lead: EV_PAGE_COPY.heroLead,
    tags: [
      { icon: 'location_on', text: '宿务市区 Talamban' },
      { icon: 'verified', text: '斯巴达 / 半斯巴达' },
      { icon: 'fact_check', text: '校内 IDP 雅思考点' },
      { icon: 'pool', text: '度假村式校园' },
    ],
  },
  overview: { title: EV_PAGE_COPY.overviewTitle },
  advisorReview: {
    title: EV_PAGE_COPY.advisorTitle,
    text: EV_PAGE_COPY.advisorText,
    suitableTitle: EV_PAGE_COPY.suitableTitle,
    notSuitableTitle: EV_PAGE_COPY.notSuitableTitle,
  },
  campus: {
    eyebrow: 'CAMPUS AT A GLANCE',
    title: 'EV 校园介绍',
    intro: '2017年启用的度假村式校园，教学、住宿、餐厅和休闲设施都在校内。',
    studentCapacity: '380',
    ruleTitle: 'English Only（EOP）规则',
    ruleText: EV_PAGE_COPY.eopNote,
  },
  gallery: {
    title: '按区域查看 EV 环境',
    intro: `${EV_PAGE_COPY.galleryLead}相册内用左右箭头或缩略图切换，点击主图可放大。`,
    photoNote: EV_REFERENCE_NOTE,
    roomComparisonTitle: '房型对比',
    roomDisclaimer: EV_REFERENCE_NOTE,
  },
  courses: {
    title: 'EV 课程怎么选？',
    intro: '先选管理模式，再按学习目标选课；每门课下面是每天的课时，点开可看适合人群。',
    priceUnit: '/4周',
    fitLabel: '适合人群',
    noteLabel: '课程说明',
    detailSummaryTitle: '查看课程细节与每日作息',
    detailSummaryHint: '雅思保分班目标分、免费选修课、两种模式的每日作息',
    guideTitle: '报名前值得确认的课程细节',
  },
  studyModes: {
    title: '斯巴达还是半斯巴达？',
    intro: EV_PAGE_COPY.studyPlanLead,
    note: EV_PAGE_COPY.otherPlansNote,
  },
  schedule: {
    eyebrow: 'DAILY TIMETABLE',
    title: 'EV 每日作息',
    intro: EV_PAGE_COPY.dailyLead,
    badge: '斯巴达多出早晚课和晚自习',
  },
  planning: {
    summaryTitle: '2027年暑期旺季',
    summaryHint: '旺季附加费档期与收费方式',
  },
  calendar: {
    eyebrow: 'PEAK SEASON',
    title: 'EV 2027年旺季附加费',
    intro: 'EV是CALA会员学校，2027年暑期旺季按协会规定每周加收附加费；学校假期以EV当期通知为准。',
    peakEyebrow: '2027 PEAK SEASON',
    peakTitle: '2027年暑期旺季',
    peakIntro: '课程或住宿计划覆盖以下学习周时，每名学生按实际重叠周数计收旺季附加费。',
    peakNote: '入学按周日、离校按周六；课程与住宿在同一周重叠只计一次，旺季附加费不参与思达启航折扣。',
  },
  videos: {
    eyebrow: 'SCHOOL VIDEOS',
    title: '用视频了解 EV 校园与课程',
    intro: EV_PAGE_COPY.videoLead,
    badge: 'EV 学校视频',
    lifeTitle: '校园生活短片',
    interviewTitle: '学员分享（英文原声）',
  },
  rooms: {
    photoTitle: '房型实景',
    photoIntro: '点选房型查看实景；各房型价格见上方住宿费表。',
    rulesTitle: '短期费率、入住离校与宿舍规定',
    rulesHint: '1–3周住宿费比例、入住离校、宿舍与公寓规定、公寓接驳车',
    dormRulesTitle: '宿舍与校外公寓规定',
  },
  quote: {
    ...CIA_PAGE_COPY.quote,
    compareShortcuts: [
      { focus: 'room', label: '比房型', hint: '课程和周数不变' },
      { focus: 'course', label: '比同类课程', hint: '如口语强化6和8、斯巴达和半斯巴达' },
      { focus: 'weeks', label: '比周数', hint: '如4周、8周、12周' },
    ],
  },
  fees: CIA_PAGE_COPY.fees,
  practicalGuide: {
    summaryTitle: '到校须知、学校服务与活动',
    summaryHint: '第一天安排、出发前准备、清洁洗衣、活动时间、其他收费、校规要点',
    intro: '出发前和到校后最常问到的安排。',
  },
  sida: {
    ...CIA_PAGE_COPY.sida,
    title: brandEv(CIA_PAGE_COPY.sida.title),
    photoAlt: brandEv(CIA_PAGE_COPY.sida.photoAlt),
    photoCaption: brandEv(CIA_PAGE_COPY.sida.photoCaption),
  },
  faq: CIA_PAGE_COPY.faq,
  finalCta: {
    title: EV_PAGE_COPY.finalCtaTitle,
    text: EV_PAGE_COPY.finalCtaText,
    primaryLabel: '获取 EV 完整报价单',
    secondaryLabel: '咨询当前空房',
  },
};

/** Photos marked featured come first, so the hero and each album open on the best view. */
const EV_PAGE_GALLERY: GalleryImage[] = [
  ...EV_GALLERY_IMAGES.filter(image => image.featured),
  ...EV_GALLERY_IMAGES.filter(image => !image.featured),
].map(({ category, title, description, src }) => ({ category, title, description, src }));

const EV_CAMPUS_BUILDINGS: CampusBuildingCard[] = [
  { code: 'STUDY', title: '教学区', icon: 'school', facilities: ['175间一对一教室', '小团体和大团体教室', 'Westudy学习区与雅思资源中心', '图书馆、大教室'] },
  { code: 'EXAM', title: '雅思考点', icon: 'fact_check', facilities: ['校内IDP官方考点', '可考机考和纸笔考试'] },
  { code: 'LIFE', title: '休闲设施', icon: 'pool', facilities: ['游泳池（06:00–23:00，上课时间除外）', '健身房', '台球、飞镖和投篮机娱乐室', '电影院'] },
  { code: 'DINING', title: '餐饮', icon: 'restaurant', facilities: ['学生餐厅一日三餐自助，周末也有', 'EV Bucks咖啡店：咖啡、零食、电话卡和打印'] },
];

const scheduleRow = (item: EvScheduleItem): DailyScheduleRow => ({
  time: item.time,
  activity: item.title,
  kind: /午餐|晚餐/.test(item.title) ? 'meal'
    : item.highlighted ? 'test'
      : /选修|自由/.test(item.title) ? 'free'
        : 'class',
});

const videoCard = (video: EvVideo): CiaVideoCard => {
  const card = VIDEO_CARDS[video.src];
  return {
    code: 'EV',
    label: card?.label ?? 'EV',
    title: video.title,
    text: card?.text ?? video.description,
    poster: video.poster,
    videoSrc: video.src,
    contentType: 'video/mp4',
    details: [...(card?.details ?? []), `时长 ${video.duration}`],
  };
};
const shortVideo = (video: EvVideo): CiaShortVideo => ({
  title: video.title,
  text: video.description,
  src: video.src,
  poster: video.poster,
  duration: video.duration,
  ...(video.orientation === 'landscape' ? { shape: 'wide' as const } : {}),
});
/** Card text for the wide videos, from the same EV material as the gallery. */
const VIDEO_CARDS: Record<string, { label: string; text: string; details: string[] }> = {
  '/assets/ev/videos/promo-film.mp4': {
    label: 'PROMO FILM',
    text: 'EV主校区宣传片，快速看一遍学习、住宿和课后生活。',
    details: ['自习区与电影院', '宿舍与自助餐', '泳池与每周活动'],
  },
  '/assets/ev/videos/campus-tour.mp4': {
    label: 'CAMPUS TOUR',
    text: '跟着镜头走一遍EV主校区。',
    details: ['教学楼与宿舍', '泳池与健身房', '雅思资源中心'],
  },
  '/assets/ev/videos/dinner-buffet.mp4': {
    label: 'DINING',
    text: '校内学生餐厅的一顿晚饭。',
    details: ['一日三餐自助供应', '周末也有三餐'],
  },
  '/assets/ev/videos/yoga-class.mp4': {
    label: 'YOGA CLASS',
    text: '学校免费瑜伽课的一节。',
    details: ['每周两晚18:00–19:00', '自愿参加，不另收费'],
  },
  '/assets/ev/videos/power-speaking.mp4': {
    label: 'STUDENT INTERVIEW',
    text: '口语强化课学员聊课堂收获。',
    details: ['一对一和小组课', '英文原声'],
  },
};
const videosIn = (section: EvVideo['section']) => EV_VIDEOS.filter(video => video.section === section);

const guaranteePoint = (target: typeof EV_IELTS_GUARANTEE_TARGETS[number]): string => {
  const goals = [
    target.eightWeeks !== '—' ? `8周保${target.eightWeeks}分` : '',
    target.twelveWeeks !== '—' ? `12周保${target.twelveWeeks}分` : '',
  ].filter(Boolean).join('，');
  return `${target.level} 入学${target.entry}分：${goals}`;
};

const EV_COURSE_DETAIL_GUIDES: CourseDetailGuide[] = [
  {
    icon: 'workspace_premium',
    title: '雅思保分班',
    subtitle: '学术类雅思 · 8周起 · 仅开设斯巴达',
    facts: [
      { label: '入学分级', value: '按入学雅思分数分G1至G8' },
      { label: '最高目标', value: '8.0分；6.0分以上每提高0.5分需要8周' },
    ],
    points: EV_IELTS_GUARANTEE_TARGETS.map(guaranteePoint),
    notice: EV_IELTS_GUARANTEE_NOTE,
  },
  {
    icon: 'apps',
    title: '免费选修课',
    subtitle: '所有学生都可参加，按兴趣自愿报名',
    facts: EV_ELECTIVE_GROUPS.map(group => ({ label: `${group.period}（${group.level}）`, value: group.courses.join('、') })),
    points: ['周末和假日上午另有4节选修团体课，需提前报名。'],
  },
  {
    icon: 'quiz',
    title: '测试、换课与教师培训日',
    subtitle: '每4周升级测试，每周二、周五可申请换课',
    facts: [
      { label: '升级测试', value: '每4周的周四，所有学生都要参加，结果当天下午公布' },
      { label: '考试课程', value: '雅思每周四课堂模考；托业每周五08:00–10:00测试，周四20:00–22:00可付费参加托业模考（200比索）' },
      { label: '换课换老师', value: '周二申请周三生效，周五申请下周一生效' },
      { label: '换管理模式', value: '斯巴达改半斯巴达5,000比索；半斯巴达改斯巴达每4周2,500比索，周五前申请，下周一生效' },
      { label: '教师培训日', value: '每月最后一个周五每节课20分钟，12:05下课，之后可以外出' },
    ],
    points: ['社交媒体英语（Digital English）需要E3以上水平（约雅思5分），每期4周。'],
  },
];

const EV_PRACTICAL_GUIDES: CampusPracticalGuide[] = [
  { icon: 'event', eyebrow: 'FIRST DAY', title: '到校第一天（周一）', facts: EV_FIRST_DAY, points: EV_FIRST_DAY_NOTES, note: '' },
  { icon: 'luggage', eyebrow: 'BEFORE YOU GO', title: '出发前准备', facts: [], points: EV_PACKING_NOTES, note: '入境和签证材料由思达启航顾问逐项帮你核对。' },
  { icon: 'room_service', eyebrow: 'SCHOOL SERVICES', title: '学校服务', facts: EV_SERVICE_FACTS, points: EV_SCHOOL_SERVICES, note: '' },
  {
    icon: 'celebration',
    eyebrow: 'ACTIVITIES',
    title: '校园与周末活动',
    facts: [
      ...EV_ACTIVITY_TIMES,
      { label: '校内活动', value: EV_CAMPUS_ACTIVITIES.join('；') },
      { label: '周末活动', value: EV_WEEKEND_ACTIVITIES.join('、') },
    ],
    points: [EV_WEEKEND_SIGNUP],
    note: '',
  },
  { icon: 'receipt_long', eyebrow: 'OTHER FEES', title: '其他收费', facts: EV_OTHER_FEES, note: '到校后按比索在学校缴纳。' },
  { icon: 'rule', eyebrow: 'BEFORE YOU APPLY', title: '报名前须知', facts: [], points: EV_NOTES, note: '' },
];

const roomPhoto = (file: string) => `assets/ev/${file}.webp`;
/** Main photo, then rooms/<prefix>-02 … in order, then any shared photos (the dorm bathroom). */
const roomGallery = (main: string, prefix: string, extraCount: number, shared: readonly string[] = []) =>
  [main, ...Array.from({ length: extraCount }, (_, index) => `rooms/${prefix}-0${index + 2}`), ...shared].map(roomPhoto);
const DORM_BATHROOM = ['rooms/dorm-bathroom', 'rooms/dorm-shower'];
const EV_DORM_HIGHLIGHTS = ['一日三餐，周末也供应', '空调、热水器和保险箱', '浴室干湿分离', '每周两次清洁、每周换床单'];
const roomProfile = (
  id: string, label: string, location: '校内' | '校外', gallery: string[], suitable: string, note: string, highlights: string[],
): PhRoomProfile => ({
  id, label, location, suitable, note, highlights,
  image: gallery[0],
  gallery,
  imageAlt: `EV${label}实景`,
});
const EV_ROOM_PROFILES: PhRoomProfile[] = [
  roomProfile('single', '单人间', '校内', roomGallery('single-room', 'single', 5, DORM_BATHROOM), '重视隐私、需要安静学习空间的学生', '一人一间。', EV_DORM_HIGHLIGHTS),
  roomProfile('double', '双人间', '校内', roomGallery('double-room', 'double', 4, DORM_BATHROOM), '朋友同行或想兼顾预算的学生', '两人一间。', EV_DORM_HIGHLIGHTS),
  roomProfile('triple', '三人间', '校内', roomGallery('triple-room', 'triple', 4, DORM_BATHROOM), '想控制预算、又希望有独立书桌的学生', '三人一间，每人有独立书桌。', EV_DORM_HIGHLIGHTS),
  roomProfile('quad-bunk', '四人间（上下铺）', '校内', roomGallery('quad-room', 'quad', 4, DORM_BATHROOM), '预算优先、能接受上下铺的学生', '上下铺房型，费用最低。', EV_DORM_HIGHLIGHTS),
  roomProfile(
    'off-campus', '校外公寓', '校外', roomGallery('condo', 'condo', 7), '选半斯巴达、喜欢独立生活的学生',
    '仅限半斯巴达课程；每周清洁一次，到校管理费比校内宿舍高。',
    ['无门禁，带小厨房和冰箱', '空调、保险箱和饮水机', '住户泳池06:00–22:00', '平日接驳车往返学校'],
  ),
];

const EV_INITIAL_ROOM_RATE_GROUPS: RoomRateGroup[] = [...new Set(defaults.rooms.map(room => room.group))].map(title => ({
  title,
  rooms: defaults.rooms
    .filter(room => room.enabled && room.group === title)
    .map(room => ({ id: room.id, label: room.label, code: room.code, location: room.location })),
}));

const EV_CTA_CONSULTANTS = ['Lemon', 'Penin', 'Jenny']
  .map(name => SIDA_PHILIPPINES_CONSULTANTS.find(item => item.name === name))
  .filter(item => !!item)
  .map(item => item!);

export const EV_PAGE_PROFILE: PhSchoolProfile = {
  code: 'EV',
  name: 'EV',
  previewPrefix: 'ev',
  pricingSchoolName: 'EV Academy',
  copy: EV_COPY,
  gallery: {
    categories: CIA_GALLERY_CATEGORIES,
    albumCategories: ['校园', '教室', '住宿', '餐厅', '设施'],
    images: EV_PAGE_GALLERY,
    heroCategories: ['校园', '教室', '设施'],
    albumDescriptions: {
      校园: '度假村式校园、草坪与大堂',
      教室: '一对一、团体课、学习区与图书馆',
      住宿: '校内宿舍各房型与校外公寓',
      餐厅: '学生餐厅与咖啡店',
      设施: '泳池、健身房、娱乐室与电影院',
    },
    uploadedPhotoTitle: 'EV 学校媒体',
    uploadedPhotoDescription: 'EV 学校实景内容',
    uploadedVideoTitle: 'EV 学校视频',
  },
  snapshotCards: EV_QUICK_INFO,
  // Facilities are already listed in the campus cards above the fact strip.
  basicInfo: EV_BASIC_INFO.filter(row => row.label !== '校园设施'),
  suitableFor: EV_SUITABLE_FOR.map(item => ({ title: item.title, text: '' })),
  notSuitableFor: EV_NOT_SUITABLE_FOR.map(item => ({ title: item.title, text: '' })),
  campusBuildings: EV_CAMPUS_BUILDINGS,
  videoCards: videosIn('tour').map(videoCard),
  campusLifeVideos: videosIn('life').map(shortVideo),
  interviewVideos: videosIn('interview').map(shortVideo),
  // Listed inside the 半斯巴达 and 斯巴达 zones (courseModes) in this order; 雅思 is last because
  // only 斯巴达 offers it, so the rows above it line up across the two zones.
  courseGroups: [
    { icon: 'forum', title: '综合英语 ESL', text: '听说读写全面提升', courseIds: ['semi-sparta-esl', 'sparta-intensive-esl'] },
    {
      icon: 'record_voice_over', title: '口语强化', text: '每天6至8节一对一',
      courseIds: ['semi-sparta-power-speaking-6', 'semi-sparta-power-speaking-8', 'sparta-power-speaking-6', 'sparta-power-speaking-8'],
    },
    {
      icon: 'business_center', title: '托业 / 商务 / 社交媒体', text: '考试、职场与内容创作',
      courseIds: [
        'semi-sparta-toeic', 'semi-sparta-business', 'semi-sparta-social-media-english',
        'sparta-toeic', 'sparta-business', 'sparta-social-media-english',
      ],
    },
    { icon: 'workspace_premium', title: '雅思', text: '保分班8周起', courseIds: ['sparta-ielts-regular', EV_IELTS_GUARANTEE_ID] },
  ],
  courseModes: [
    { title: '半斯巴达', hint: '没有早晚课和晚自习，平日17:10后可外出', idPrefix: 'semi-sparta-' },
    { title: '斯巴达', hint: '加早晚课和晚自习，周一至周四不能外出', idPrefix: 'sparta-', strict: true },
  ],
  studyModes: EV_STUDY_PLANS,
  courseDetailGuides: EV_COURSE_DETAIL_GUIDES,
  scheduleColumns: [
    { code: 'SEMI-SPARTA', title: '半斯巴达', rows: EV_SCHEDULE.filter(item => item.appliesTo === '所有学生').map(scheduleRow) },
    { code: 'SPARTA', title: '斯巴达', rows: EV_SCHEDULE.map(scheduleRow) },
  ],
  initialCourseFees: initialPricing.courseFees,
  initialRoomFees: initialPricing.roomFees,
  initialRoomRateGroups: EV_INITIAL_ROOM_RATE_GROUPS,
  showRoomCodes: false,
  dormRules: EV_DORM_RULES,
  roomProfiles: EV_ROOM_PROFILES,
  ieltsResults: [],
  studentReviews: [],
  reviewPath: '',
  holidayCalendars: [],
  ieltsComputerExamDates2027: [],
  studentCareServices: [],
  campusPracticalGuides: EV_PRACTICAL_GUIDES,
  studentTracks: [],
  sidaReasons: CIA_SIDA_REASONS.map(reason => ({ ...reason, alt: brandEv(reason.alt) })),
  sidaTrustBadges: CIA_SIDA_TRUST_BADGES,
  ctaBadges: EV_FINAL_CTA_BADGES,
  ctaConsultants: EV_CTA_CONSULTANTS,
  mobileAnchors: [
    { label: '概览', target: 'overview', icon: 'dashboard' },
    { label: '校园', target: 'campus-introduction', icon: 'apartment' },
    { label: '图片', target: 'gallery', icon: 'photo_library' },
    { label: '视频', target: 'videos', icon: 'smart_display' },
    { label: '课程', target: 'courses', icon: 'menu_book' },
    { label: '住宿', target: 'rooms', icon: 'bed' },
    { label: '报价', target: 'quote', icon: 'calculate' },
    { label: 'FAQ', target: 'faq', icon: 'help' },
  ],
  faqs: () => EV_FAQS.map(item => ({ ...item })),
  shows2026Prices: () => false,
  defaultContent: createDefaultEvContentConfig,
  cloneContent: cloneEvContentConfig,
};

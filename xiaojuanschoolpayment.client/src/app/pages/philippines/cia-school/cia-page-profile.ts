// CIA's content for the shared Philippine school page (school-page/ph-school-page.component.*).
// Text and data come from cia-page-content.ts, which the WeChat mini program also reads.
import type { PhSchoolProfile } from '../school-page/ph-school-profile';
import { cloneCiaContentConfig, createDefaultCiaContentConfig } from './cia-content-config';
import {
  CIA_BASIC_INFO,
  CIA_CAMPUS_BUILDINGS,
  CIA_CAMPUS_LIFE_VIDEOS,
  CIA_CAMPUS_PRACTICAL_GUIDES,
  CIA_COURSE_DETAIL_GUIDES,
  CIA_COURSE_GROUPS,
  CIA_CTA_BADGES,
  CIA_CTA_CONSULTANTS,
  CIA_DORM_RULES,
  CIA_FRIDAY_SCHEDULE,
  CIA_GALLERY_ALBUM_CATEGORIES,
  CIA_GALLERY_ALBUM_DESCRIPTIONS,
  CIA_GALLERY_CATEGORIES,
  CIA_GALLERY_IMAGES,
  CIA_HERO_GALLERY_CATEGORIES,
  CIA_HOLIDAY_CALENDARS,
  CIA_IELTS_COMPUTER_EXAM_DATES_2027,
  CIA_IELTS_EXAM_DATES_2026,
  CIA_IELTS_RESULTS,
  CIA_INTERVIEW_VIDEOS,
  CIA_MOBILE_ANCHORS,
  CIA_NOT_SUITABLE_FOR,
  CIA_PAGE_COPY,
  CIA_ROOM_COMPARISON_PROFILES,
  CIA_SIDA_REASONS,
  CIA_SIDA_TRUST_BADGES,
  CIA_SNAPSHOT_CARDS,
  CIA_STUDENT_CARE_SERVICES,
  CIA_STUDENT_TRACKS,
  CIA_SUITABLE_FOR,
  CIA_VIDEO_CARDS,
  CIA_WEEKDAY_SCHEDULE,
  ciaShows2026Prices,
  currentCiaFaqs,
  type CourseFee,
  type RoomFee,
  type RoomRateGroup,
} from './cia-page-content';
import { CIA_STUDENT_REVIEWS } from './cia-student-reviews.data';

/** Course details the database rows lack; the CIA component also merges them into database courses. */
export const CIA_COURSE_FEE_DETAILS: Record<string, Pick<CourseFee, 'schedule' | 'note' | 'suitable' | 'highlightNote'>> = {
  'regular-esl': {
    suitable: '基础综合提升 / 可申请 Light ESL',
    schedule:
      '一对一4节 + 小组1节 + 中组1节 + 大组1节 + 选修1节 + 写作1节 + 自习1节',
    note: 'Regular ESL 均衡提升听说读写；Light ESL 需在出发前申请，可按学校规则减少部分课程。',
  },
  'intensive-esl': {
    suitable: '想增加一对一课时',
    schedule:
      '一对一5节 + 小组1节 + 中组1节 + 选修1节 + 写作1节 + 自习1节',
    note: '比 Regular ESL 多1节一对一，适合短期加强口语输出和老师纠音。',
  },
  'power-intensive': {
    suitable: '短期高强度口语突破',
    schedule:
      '一对一6节 + 小组1节 + 选修1节 + 写作1节 + 自习1节',
    note: '一对一比例最高，适合时间有限、希望集中补弱项的学生。',
  },
  'pre-toeic': {
    suitable: '托业预备 / 无入学分数要求',
    schedule:
      '托业一对一4节 + ESL小组1节 + TOEIC Clinic中组2节 + 选修1节 + 写作1节 + 自习2节',
    note: '4周为一个学习单元，每2周安排一次模拟考试，适合先建立托业基础。',
  },
  'toeic-regular': {
    suitable: '托业常规备考',
    schedule:
      '托业一对一4节 + 托业小组1节 + TOEIC Clinic中组2节 + 选修1节 + 写作1节 + 自习2节',
    note: '4周为一个学习单元，每2周安排一次模拟考试。',
  },
  'toeic-guarantee': {
    suitable: '托业600 / 700 / 800 / 900分保证班',
    schedule:
      '托业一对一4节 + 托业小组1节 + TOEIC Clinic中组2节 + 选修1节 + 写作1节 + 自习2节',
    note: '12周课程；入学参考分数为400 / 500 / 650 / 790分，并有出勤、每周模考和官方考试要求。',
  },
  'pre-ielts': {
    suitable: '雅思预备 / 无入学分数要求',
    schedule:
      '雅思一对一4节 + ESL小组1节 + IELTS Clinic中组2节 + 选修1节 + 写作1节 + 自习2节',
    note: '4周为一个学习单元，每2周安排一次模拟考试，适合先补齐雅思基础。',
  },
  'ielts-regular': {
    suitable: '雅思常规备考',
    schedule:
      '雅思一对一4节 + 雅思小组1节 + IELTS Clinic中组2节 + 选修1节 + 写作1节 + 自习2节',
    note: '建议雅思3.5分以上，4周为一个学习单元，每2周安排一次模拟考试。',
  },
  'ielts-guarantee': {
    suitable: '雅思5.5 / 6.0 / 6.5 / 7.0分保证班',
    schedule:
      '雅思一对一4节 + 雅思小组1节 + IELTS Clinic中组2节 + 选修1节 + 写作1节 + 自习2节；周一至周三另有强化晚课',
    note: '12周课程；入学参考分数为3.5–4.5 / 5.0–5.5 / 6.0 / 6.5分，并有出勤、每周四模考和官方考试要求。',
  },
  business: {
    suitable: '商务沟通、演示与职场写作',
    schedule:
      '商务一对一5节 + 商务小组1节 + 综合中组1节 + 选修1节 + 写作1节 + 自习2节',
    note: '入学参考为 CIA Level 4 或 TOEIC 400分；4或8周为一个单元，4周以上学生需完成商务PPT发表。',
  },
  'working-holiday': {
    suitable: '海外生活与面试沟通',
    schedule:
      'ESL一对一4节 + ESL小组1节 + 综合中组1节 + 外教/CNN大组1节 + 选修1节 + 写作1节 + 自习2节',
    note: '4周为一个学习单元，内容覆盖生存英语、求职准备和海外生活沟通。',
  },
  'callan-esl': {
    suitable: '高频问答与快速口语反应',
    schedule:
      'Callan一对一3节 + ESL一对一2节 + ESL小组1节 + 综合中组1节 + 选修1节 + 写作1节 + 自习2节',
    note: '4周为一个学习单元，通过快速问答、即时纠错和系统复习训练英语反应速度。',
  },
  'college-immersion': {
    suitable: '想参加IAU航空大学体验，报名时应选择此课程',
    schedule:
      'ESL一对一4节 + ESL小组1节 + 综合中组1节 + 外教/CNN大组1节 + 选修1节 + 写作1节 + 自习2节',
    note: '不是Regular ESL的临时加选课；4周为一个学习单元，另收IAU一次性注册费50美元，详细旁听与证书说明见下方课程细节。',
  },
};

/** Prices shown before the database and the published revision load (the page's long-standing defaults). */
const CIA_INITIAL_COURSE_FEES: CourseFee[] = [
  {
    id: 'regular-esl',
    name: 'Regular ESL',
    tuition: 900,
    tuition2027: 1000,
    ...CIA_COURSE_FEE_DETAILS['regular-esl'],
  },
  {
    id: 'intensive-esl',
    name: 'Intensive ESL',
    tuition: 1000,
    tuition2027: 1100,
    ...CIA_COURSE_FEE_DETAILS['intensive-esl'],
  },
  {
    id: 'power-intensive',
    name: 'Power Intensive',
    tuition: 1100,
    tuition2027: 1200,
    ...CIA_COURSE_FEE_DETAILS['power-intensive'],
  },
  {
    id: 'pre-toeic',
    name: 'Pre-TOEIC',
    tuition: 1000,
    tuition2027: 1100,
    ...CIA_COURSE_FEE_DETAILS['pre-toeic'],
  },
  {
    id: 'toeic-regular',
    name: 'TOEIC Regular',
    tuition: 1000,
    tuition2027: 1100,
    ...CIA_COURSE_FEE_DETAILS['toeic-regular'],
  },
  {
    id: 'toeic-guarantee',
    name: 'TOEIC Guarantee',
    tuition: 1000,
    tuition2027: 1100,
    ...CIA_COURSE_FEE_DETAILS['toeic-guarantee'],
  },
  {
    id: 'pre-ielts',
    name: 'Pre-IELTS',
    tuition: 1050,
    tuition2027: 1150,
    ...CIA_COURSE_FEE_DETAILS['pre-ielts'],
  },
  {
    id: 'ielts-regular',
    name: 'IELTS Regular',
    tuition: 1050,
    tuition2027: 1150,
    ...CIA_COURSE_FEE_DETAILS['ielts-regular'],
  },
  {
    id: 'ielts-guarantee',
    name: 'IELTS Guarantee',
    tuition: 1050,
    tuition2027: 1150,
    ...CIA_COURSE_FEE_DETAILS['ielts-guarantee'],
  },
  {
    id: 'business',
    name: 'Business',
    tuition: 1050,
    tuition2027: 1150,
    ...CIA_COURSE_FEE_DETAILS['business'],
  },
  {
    id: 'working-holiday',
    name: 'Working Holiday',
    tuition: 950,
    tuition2027: 1050,
    ...CIA_COURSE_FEE_DETAILS['working-holiday'],
  },
  {
    id: 'callan-esl',
    name: 'Callan ESL',
    tuition: 1050,
    tuition2027: 1050,
    ...CIA_COURSE_FEE_DETAILS['callan-esl'],
  },
  {
    id: 'college-immersion',
    name: 'College Immersion（IAU大学沉浸）',
    tuition: 1000,
    tuition2027: 1100,
    ...CIA_COURSE_FEE_DETAILS['college-immersion'],
  },
];

const CIA_INITIAL_ROOM_FEES: RoomFee[] = [
  {
    id: 'p1',
    name: '豪华单人间 P-1',
    fee: 1700,
    note: '豪华单人间多了一个电磁炉，可以简单加热食物',
  },
  {
    id: 's1',
    name: '标准单人间 S-1',
    fee: 1500,
    note: '标准单人间，适合重视独立空间的学生',
  },
  {
    id: 'pn1',
    name: '校外单人间 PN-1',
    fee: 1700,
    note: '在学校对面的4号楼',
  },
  {
    id: 'd2',
    name: '双人间 D-2',
    fee: 1100,
    note: '双人间，适合朋友同行或希望平衡预算',
  },
  { id: 'd3', name: '三人间 D-3', fee: 850, note: '预算比双人间更低' },
  {
    id: 'd4',
    name: '四人间 D-4',
    fee: 750,
    note: '默认报价参考，预算压力较低',
  },
  {
    id: 'sr1',
    name: '单人套房 SR-1',
    fee: 2500,
    note: '套房房型，空间更完整',
  },
  {
    id: 'sr2',
    name: '双人套房 SR-2',
    fee: 1400,
    note: '套房房型，适合两人入住',
  },
  {
    id: 'sr3',
    name: '三人套房 SR-3',
    fee: 1200,
    note: '套房房型，适合小组同行',
  },
  {
    id: 'sr4',
    name: '四人套房 SR-4',
    fee: 1100,
    note: '套房房型，预算和空间较平衡',
  },
];

const CIA_INITIAL_ROOM_RATE_GROUPS: RoomRateGroup[] = [
  {
    title: '单人间',
    rooms: [
      { id: 'p1', label: '豪华单人间', code: 'P-1', location: '校内' },
      { id: 'pn1', label: '校外单人间', code: 'PN-1', location: '校外' },
      { id: 's1', label: '标准单人间', code: 'S-1', location: '校内' },
    ],
  },
  {
    title: '普通多人间',
    rooms: [
      { id: 'd2', label: '双人间', code: 'D-2', location: '校内' },
      { id: 'd3', label: '三人间', code: 'D-3', location: '校内' },
      { id: 'd4', label: '四人间', code: 'D-4', location: '校内' },
    ],
  },
  {
    title: '家庭精致套房',
    rooms: [
      { id: 'sr1', label: '单人套房', code: 'SR-1', location: '校内' },
      { id: 'sr2', label: '双人套房', code: 'SR-2', location: '校内' },
      { id: 'sr3', label: '三人套房', code: 'SR-3', location: '校内' },
      { id: 'sr4', label: '四人套房', code: 'SR-4', location: '校内' },
    ],
  },
];

export const CIA_PAGE_PROFILE: PhSchoolProfile = {
  code: 'CIA',
  name: 'CIA',
  previewPrefix: 'cia',
  pricingSchoolName: 'CIA Cebu International Academy',
  copy: CIA_PAGE_COPY,
  gallery: {
    categories: CIA_GALLERY_CATEGORIES,
    albumCategories: CIA_GALLERY_ALBUM_CATEGORIES,
    images: CIA_GALLERY_IMAGES,
    heroCategories: CIA_HERO_GALLERY_CATEGORIES,
    albumDescriptions: CIA_GALLERY_ALBUM_DESCRIPTIONS,
    uploadedPhotoTitle: 'CIA Cebu photo',
    uploadedPhotoDescription: 'CIA Cebu school photo',
    uploadedVideoTitle: 'CIA 学校视频',
  },
  snapshotCards: CIA_SNAPSHOT_CARDS,
  basicInfo: CIA_BASIC_INFO,
  suitableFor: CIA_SUITABLE_FOR,
  notSuitableFor: CIA_NOT_SUITABLE_FOR,
  campusBuildings: CIA_CAMPUS_BUILDINGS,
  videoCards: CIA_VIDEO_CARDS,
  campusLifeVideos: CIA_CAMPUS_LIFE_VIDEOS,
  interviewVideos: CIA_INTERVIEW_VIDEOS,
  courseGroups: CIA_COURSE_GROUPS,
  studyModes: [],
  courseDetailGuides: CIA_COURSE_DETAIL_GUIDES,
  scheduleColumns: [
    { code: CIA_PAGE_COPY.schedule.weekdayCode, title: CIA_PAGE_COPY.schedule.weekdayTitle, rows: CIA_WEEKDAY_SCHEDULE },
    { code: CIA_PAGE_COPY.schedule.fridayCode, title: CIA_PAGE_COPY.schedule.fridayTitle, rows: CIA_FRIDAY_SCHEDULE },
  ],
  initialCourseFees: CIA_INITIAL_COURSE_FEES,
  initialRoomFees: CIA_INITIAL_ROOM_FEES,
  initialRoomRateGroups: CIA_INITIAL_ROOM_RATE_GROUPS,
  showRoomCodes: true,
  dormRules: CIA_DORM_RULES,
  roomProfiles: CIA_ROOM_COMPARISON_PROFILES,
  ieltsResults: CIA_IELTS_RESULTS,
  studentReviews: CIA_STUDENT_REVIEWS,
  reviewPath: '/philippines-study/cebu/cia-cebu-international-academy/student-reviews',
  holidayCalendars: CIA_HOLIDAY_CALENDARS,
  ieltsComputerExamDates2027: CIA_IELTS_COMPUTER_EXAM_DATES_2027,
  ieltsExamDates2026: CIA_IELTS_EXAM_DATES_2026,
  studentCareServices: CIA_STUDENT_CARE_SERVICES,
  campusPracticalGuides: CIA_CAMPUS_PRACTICAL_GUIDES,
  studentTracks: CIA_STUDENT_TRACKS,
  sidaReasons: CIA_SIDA_REASONS,
  sidaTrustBadges: CIA_SIDA_TRUST_BADGES,
  ctaBadges: CIA_CTA_BADGES,
  ctaConsultants: CIA_CTA_CONSULTANTS,
  mobileAnchors: CIA_MOBILE_ANCHORS,
  faqs: () => currentCiaFaqs(),
  shows2026Prices: () => ciaShows2026Prices(),
  defaultContent: createDefaultCiaContentConfig,
  cloneContent: cloneCiaContentConfig,
};

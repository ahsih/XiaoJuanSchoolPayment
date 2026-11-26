// Text and data of the MONOL Sparta page, from the school's Google Drive pack: the October 2026 student handbook
// (斯巴达校区学生手册_261019: floor guide, courses, timetable, penalty system, fees, refund rules, other rules and
// the neighbourhood), the fee sheet, the 2026 promotion poster, and the school's photo and video folders.
// The shared Philippine school template reads this module through monol-sparta-page-profile.ts. Keep it pure
// data (no Angular, DOM or storage), so the WeChat mini program can reuse it. Never add the school's address,
// Wi-Fi passwords, website or contacts, and never anything the handbook addresses to agencies.
import type {
  BasicInfoRow,
  CampusBuildingCard,
  CampusPracticalGuide,
  CourseDetailGuide,
  DailyScheduleRow,
  FaqItem,
  GalleryImage,
} from '../cia-school/cia-page-content';
import type { PhPageCopy, PhRoomProfile } from '../school-page/ph-school-profile';
import { SCHOOL_REFERENCE_NOTE } from '../school-page/school-reference-note';

/** Closes every content section once; the same line as on every Philippine school page. */
export const MONOL_SPARTA_REFERENCE_NOTE = SCHOOL_REFERENCE_NOTE;

export const MONOL_SPARTA_PAGE_TEXT = {
  heroLead: 'MONOL 在碧瑶的全斯巴达校区：一栋楼里上课、住宿和吃饭，每天10节学习安排，晚上背单字测验，适合想在短时间里逼自己一把的学生。',
  advisorText: 'MONOL 斯巴达校区只开两门课：Booster ESL 每天6节一对一，Master IELTS 每天5节一对一加雅思模考。不上选修团体课的时段要在自习室固定座位自习，迟到、缺课不罚钱，而是周末补自习。平日只有周一至周四17:00–19:00能外出，适合需要学校管着学、目标明确的学生。',
  campusIntro: '整个校区是一栋楼：1楼教室、运动场和健身房，4楼办公室和雅思自习室，4.5楼 ESL 自习室，6楼餐厅和学生交谊厅，2、3、5、7楼宿舍，楼顶是空中花园。',
  galleryIntro: '按区域查看校舍、教室、住宿、餐厅和运动场；相册内用左右箭头或缩略图切换，点击主图可放大。',
  coursesIntro: '两门课都是每天10节学习安排、950美元／4周；点开课程可看每节课上什么和适合谁。每节课45分钟。',
  roomsPhotoIntro: '点选房型查看实景；各房型价格见上方住宿费表。',
  finalCtaTitle: '想确认 MONOL 斯巴达校区的空房和优惠？',
  finalCtaText: '告诉顾问你的入学日期、周数、课程和想住的房型，我们帮你确认房间并做一份完整报价。',
} as const;

export const MONOL_SPARTA_QUICK_INFO = [
  { icon: 'terrain', title: '碧瑶', text: '坐车到市中心3–5分钟' },
  { icon: 'lock_clock', title: '全斯巴达', text: '每天10节，不上选修课就固定座位自习' },
  { icon: 'menu_book', title: '两门课', text: 'Booster ESL 和 Master IELTS，都是950美元／4周' },
  { icon: 'quiz', title: '每天测验', text: '晚上背单字句型并测验；雅思每天模考' },
  { icon: 'bed', title: '5种房型', text: '豪华单人间到三人间，住宿费含餐' },
  { icon: 'schedule', title: '外出时间', text: '周一至周四17:00–19:00' },
];

/** Key facts under the hero title (compact layout); what each floor has is in MONOL_SPARTA_FLOORS. */
export const MONOL_SPARTA_OVERVIEW_FACTS: ReadonlyArray<{ icon: string; label: string; value: string }> = [
  { icon: 'location_on', label: '位置', value: '菲律宾碧瑶，坐车到市中心3–5分钟' },
  { icon: 'rule', label: '管理', value: '全斯巴达：每天10节，不上选修课的时段在自习室固定座位自习' },
  { icon: 'menu_book', label: '课程', value: 'Booster ESL 强化ESL、Master IELTS 雅思高分' },
  { icon: 'quiz', label: '测验', value: '每天晚上单字句型测验；雅思每天模考，每2周评估' },
  { icon: 'schedule', label: '外出', value: '周一至周四17:00–19:00；第二天没课可到午夜12:00' },
  { icon: 'event', label: '入学', value: '每周日入住，周一开课' },
  { icon: 'bed', label: '住宿', value: '豪华单人间到三人间，含平日三餐和周末早午餐' },
];

export const MONOL_SPARTA_BASIC_INFO: BasicInfoRow[] = [
  { label: '学校', value: 'MONOL 斯巴达校区（MONOL Sparta Campus）' },
  { label: '位置', value: '菲律宾碧瑶' },
  { label: '管理方式', value: '全斯巴达，迟到缺课补自习' },
  { label: '课程', value: 'Booster ESL 强化ESL、Master IELTS 雅思高分' },
  { label: '住宿', value: '校内宿舍：豪华单人间、标准单人间、单人雅房、双人间、三人间' },
  { label: '入学', value: '每周日入住，周一开课' },
];

export const MONOL_SPARTA_SUITABLE_FOR = [
  '想在短时间内密集提高英语的学生',
  '准备雅思、想每天做模考的学生',
  '自制力一般、需要学校管着学的学生',
  '想住单人间、安静学习的学生',
];

export const MONOL_SPARTA_NOT_SUITABLE_FOR = [
  '想边玩边学、平日自由外出的学生',
  '只想读1–3周的学生（学校按4周一期收费）',
  '想读商务、托业等其他课程的学生（这里只有两门课）',
];

/** The handbook's floor guide, as the hero's campus strip. */
export const MONOL_SPARTA_FLOORS: CampusBuildingCard[] = [
  { code: '1F', title: '1楼', icon: 'sports_basketball', facilities: ['一对一和团体教室', '羽毛球和篮球场', '健身房'] },
  { code: '2·3·5·7F', title: '宿舍', icon: 'bed', facilities: ['2、3、5、7楼是学生宿舍'] },
  { code: '4F·4.5F', title: '4楼和4.5楼', icon: 'menu_book', facilities: ['学生事务办公室', '雅思自习室（4楼）', 'ESL自习室（4.5楼）'] },
  { code: '6F·RF', title: '6楼和楼顶', icon: 'restaurant', facilities: ['餐厅和学生交谊厅', '楼顶空中花园'] },
];

const asset = (file: string) => `assets/philippines/monol-sparta/${file}`;
const photo = (prefix: string, index: number) => asset(`gallery/${prefix}-${String(index).padStart(2, '0')}.webp`);
const photos = (prefix: string, indexes: readonly number[]) => indexes.map(index => photo(prefix, index));
export const MONOL_SPARTA_QUOTE_IMAGE_HERO = `/${asset('campus-building.webp')}`;

const range = (from: number, to: number, skip: readonly number[] = []) =>
  Array.from({ length: to - from + 1 }, (_, index) => from + index).filter(index => !skip.includes(index));

const series = (
  category: GalleryImage['category'], prefix: string, indexes: readonly number[], title: string, description: string,
): GalleryImage[] => indexes.map(index => ({ category, title, description, src: photo(prefix, index) }));

export const MONOL_SPARTA_GALLERY_IMAGES: GalleryImage[] = [
  { category: '校园', title: 'MONOL 斯巴达校区校舍', description: '一栋楼里有教室、宿舍、餐厅和自习室。', src: photo('campus', 1) },
  ...series('校园', 'rooftop', [1, 2, 4, 6, 9, 12, 15, 18], '楼顶空中花园', '户外休息、看碧瑶的风景。'),
  ...series('教室', 'classroom-one-to-one', range(1, 10), '一对一教室', '1楼的一对一小教室。'),
  ...series('教室', 'classroom-group', range(1, 7), '团体教室', '选修团体课和雅思团体课的教室。'),
  { category: '教室', title: '自习巡查', description: '老师在自习时间检查出席。', src: photo('discipline', 1) },
  { category: '住宿', title: '豪华单人间', description: '房内有卫生间。', src: photo('premium-single', 1) },
  { category: '住宿', title: '标准单人间', description: '房内有卫生间。', src: photo('standard-single', 1) },
  { category: '住宿', title: '单人雅房', description: '一人一间。', src: photo('semi-single', 1) },
  { category: '住宿', title: '双人间', description: '两人一间。', src: photo('double-room', 1) },
  { category: '住宿', title: '三人间', description: '三人一间。', src: photo('triple-room', 1) },
  ...series('餐厅', 'cafeteria', [1, 2, 3, 4, 7, 9, 13], '6楼餐厅和交谊厅', '用餐、自习和休息的地方。'),
  ...series('餐厅', 'food', [1, 9, 19, 29, 37, 40, 54, 55, 64, 66, 69, 72], '学校的饭菜', '平日三餐，周末和假日一餐早午餐。'),
  ...series('设施', 'sports-field', range(1, 4), '运动场', '1楼户外的羽毛球和篮球场。'),
];

export const MONOL_SPARTA_ALBUM_DESCRIPTIONS = {
  校园: '校舍和楼顶空中花园',
  教室: '一对一教室、团体教室和自习巡查',
  住宿: '五种房型',
  餐厅: '6楼餐厅和每天的饭菜',
  设施: '1楼运动场',
} as const;

/**
 * A clip from MONOL Sparta's own Drive folders or MONOL's official YouTube channel, in
 * public/assets/philippines/monol-sparta/videos/ (720p H.264 with a poster each). The facilities tour is cut before
 * its 76-second black tail. The five YouTube Shorts (2026-11-25: mini tour, teacher interview, gym, study room,
 * first-semester moments) are cut as follows: the mini tour loses its bulletin-board shot (bus-company QR codes) and
 * its closing poster (website, generated person); the moments clip loses the classroom whose glass still carries the
 * former CNS school logo; the teacher interview loses the sentences naming CNS. Left out, because their people look
 * generated: the school's “with people” promo, the 24-hour timelapse, the Main vs Sparta video and the AI shots that
 * the Chinese campus guide mixes into its Sparta part. Every frame was checked for other companies and contact
 * details; check every frame of a new clip the same way.
 */
export interface MonolSpartaVideo {
  name: string;
  title: string;
  description: string;
  duration: string;
  orientation: 'landscape' | 'portrait';
  /** Hero album group. */
  topic: '校园' | '课堂' | '宿舍' | '餐厅' | '访谈';
}

export const monolSpartaVideoSrc = (video: MonolSpartaVideo) => `/${asset(`videos/${video.name}.mp4`)}`;
export const monolSpartaVideoPoster = (video: MonolSpartaVideo) => `/${asset(`videos/poster-${video.name}.jpg`)}`;

export const MONOL_SPARTA_VIDEOS: MonolSpartaVideo[] = [
  { name: 'facilities-tour', title: '校园设施导览', description: '一对一教室、餐厅、交谊厅、楼顶花园和各种房型。', duration: '1:55', orientation: 'landscape', topic: '校园' },
  { name: 'rooftop-tour-01', title: '楼顶空中花园', description: '草坪、步道和休息区。', duration: '0:28', orientation: 'landscape', topic: '校园' },
  { name: 'rooftop-tour-02', title: '空中花园看碧瑶', description: '从楼顶看碧瑶市区。', duration: '0:18', orientation: 'landscape', topic: '校园' },
  { name: 'sparta-mini-tour', title: '校区快速导览', description: '校门、前台、自习区、一对一和团体教室、餐厅和碧瑶市景。', duration: '0:39', orientation: 'portrait', topic: '校园' },
  { name: 'gym-tour', title: '1楼健身房', description: '综合训练架、跑步机和动感单车。', duration: '0:11', orientation: 'portrait', topic: '校园' },
  { name: 'semester-moments', title: '第一学期课堂片段', description: '一对一课、团体课和课间运动场。', duration: '0:14', orientation: 'portrait', topic: '课堂' },
  { name: 'study-room', title: '自习室', description: '一人一格的隔间座位，带台灯和白板。', duration: '0:08', orientation: 'portrait', topic: '课堂' },
  { name: 'discipline-check', title: '自习巡查', description: '老师在宿舍楼层巡查。', duration: '0:09', orientation: 'portrait', topic: '课堂' },
  { name: 'premium-single-room-tour', title: '豪华单人间', description: '卧室、阳台、书桌、衣柜和卫生间。', duration: '0:24', orientation: 'landscape', topic: '宿舍' },
  { name: 'standard-single-room-tour', title: '标准单人间', description: '床、书桌、小冰箱和卫生间。', duration: '0:24', orientation: 'landscape', topic: '宿舍' },
  { name: 'semi-single-room-tour', title: '单人雅房', description: '床、书桌、衣柜和卫生间。', duration: '0:24', orientation: 'landscape', topic: '宿舍' },
  { name: 'double-room-tour', title: '双人间', description: '两张床、书桌、洗手台和卫生间。', duration: '0:29', orientation: 'landscape', topic: '宿舍' },
  { name: 'triple-room-tour-01', title: '三人间', description: '三张床、书桌和卫生间。', duration: '0:24', orientation: 'landscape', topic: '宿舍' },
  { name: 'triple-room-tour-02', title: '三人间（另一间）', description: '三张床、书桌和卫生间。', duration: '0:24', orientation: 'landscape', topic: '宿舍' },
  { name: 'cafeteria-tour', title: '6楼餐厅和交谊厅', description: '用餐区和靠窗的自习座位。', duration: '0:12', orientation: 'landscape', topic: '餐厅' },
  { name: 'teacher-interview', title: '老师谈斯巴达校区', description: '两位老师讲斯巴达校区的不同：管得更严，晚上还有词汇、发音和商务课。英文对话，带英文字幕。', duration: '1:10', orientation: 'portrait', topic: '访谈' },
];

const ROOM_SERVICE = '住宿费含平日三餐，周末和假日一餐（早午餐）';

/** Photos come only from the school's room folders and match the labelled room type. */
export const MONOL_SPARTA_ROOM_PROFILES: PhRoomProfile[] = [
  {
    id: 'premium-single', rateIds: ['premium-single-room'], label: '豪华单人间', location: '校内', service: ROOM_SERVICE,
    suitable: '预算充足、想住得最舒服的学生', note: '视频里的房间带阳台；具体房间以学校安排为准。',
    highlights: ['房内有卫生间', '书桌、衣柜、小冰箱和热水壶'],
    image: photo('premium-single', 1), gallery: photos('premium-single', range(1, 11)), imageAlt: 'MONOL斯巴达校区豪华单人间实景',
  },
  {
    id: 'standard-single', rateIds: ['standard-single-room'], label: '标准单人间', location: '校内', service: ROOM_SERVICE,
    suitable: '想住单人间、又想省一点的学生', note: '一人一间，房内有卫生间。',
    highlights: ['房内有卫生间', '书桌、小冰箱和热水壶'],
    image: photo('standard-single', 1), gallery: photos('standard-single', range(1, 15)), imageAlt: 'MONOL斯巴达校区标准单人间实景',
  },
  {
    id: 'semi-single', rateIds: ['semi-single-room'], label: '单人雅房', location: '校内', service: ROOM_SERVICE,
    suitable: '想要自己的房间、预算有限的学生', note: '一人一间，是最便宜的单人房型。',
    highlights: ['书桌和衣柜', '小冰箱和热水壶'],
    image: photo('semi-single', 1), gallery: photos('semi-single', range(1, 10)), imageAlt: 'MONOL斯巴达校区单人雅房实景',
  },
  {
    id: 'double', rateIds: ['double-room'], label: '双人间', location: '校内', bed: '两张床', service: ROOM_SERVICE,
    suitable: '朋友同行，或想有室友一起练口语的学生', note: '两人一间。',
    highlights: ['两张书桌', '房内有卫生间'],
    image: photo('double-room', 1), gallery: photos('double-room', range(1, 12, [6])), imageAlt: 'MONOL斯巴达校区双人间实景',
  },
  {
    id: 'triple', rateIds: ['triple-room'], label: '三人间', location: '校内', bed: '三张床', service: ROOM_SERVICE,
    suitable: '预算优先、喜欢热闹的学生', note: '三人一间，是最省预算的房型。',
    highlights: ['书桌和衣柜', '房内有卫生间'],
    image: photo('triple-room', 1), gallery: photos('triple-room', range(1, 9)), imageAlt: 'MONOL斯巴达校区三人间实景',
  },
];

/** The handbook's life, dormitory and expulsion rules. */
export const MONOL_SPARTA_DORM_RULES = [
  { title: '外出时间', text: '周一至周四17:00–19:00可以外出；第二天没课可到午夜12:00，第二天有课须在21:00前回来。晚归1–10分钟补25分钟自习，11–59分钟补50分钟，1小时以上补5小时。' },
  { title: '外出外宿', text: '要先得到学校批准；擅自外出或外宿补8小时自习。' },
  { title: '校外人员', text: '不能擅自带校外人员进学校，否则补8小时自习；留宿校外人员直接退学。' },
  { title: '吸烟', text: '只能在指定吸烟区；在运动场、宿舍、学校门口等地方吸烟补8小时自习并警告，再犯退学。' },
  { title: '进出房间', text: '进入同性别同学的房间补8小时自习；不论什么理由进入异性房间，直接退学。' },
  { title: '退学', text: '带酒进学校或宿舍、在校内喝酒，偷窃、暴力或毒品，一律退学，已交的费用都不退。' },
  { title: '卫生', text: '房间不干净、弄脏被褥或损坏设施，从押金扣清洁维修费并警告1次。' },
];

/** The handbook's Booster ESL weekday; the profile shows the morning and the afternoon side by side. */
export const MONOL_SPARTA_SCHEDULE: DailyScheduleRow[] = [
  { time: '07:00–08:00', activity: '早餐和课前准备', kind: 'meal' },
  { time: '08:00–08:45', activity: '一对一', kind: 'class' },
  { time: '08:55–09:40', activity: '一对一', kind: 'class' },
  { time: '09:50–10:35', activity: '一对一', kind: 'class' },
  { time: '10:45–11:30', activity: '选修团体课或自习', kind: 'activity' },
  { time: '11:40–12:25', activity: '自习或休息', kind: 'free' },
  { time: '12:25–13:30', activity: '午餐和休息', kind: 'meal' },
  { time: '13:30–14:15', activity: '一对一', kind: 'class' },
  { time: '14:25–15:10', activity: '一对一', kind: 'class' },
  { time: '15:20–16:05', activity: '一对一', kind: 'class' },
  { time: '16:15–17:00', activity: '选修团体课或自习', kind: 'activity' },
  { time: '17:00–19:00', activity: '休息（可外出）和晚餐', kind: 'meal' },
  { time: '19:00–19:45', activity: '晚间选修课或自习', kind: 'activity' },
  { time: '20:00–21:00', activity: '背单字句型并测验', kind: 'test' },
  { time: '21:00–', activity: '自习或休息', kind: 'free' },
];

export const MONOL_SPARTA_COURSE_DETAIL_GUIDES: CourseDetailGuide[] = [
  {
    icon: 'bolt',
    title: 'Booster ESL 每天上什么',
    subtitle: '6节一对一 + 3节选修团体课 + 晚间测验',
    courseIds: ['booster-esl'],
    facts: [
      { label: '一对一', value: '口语2节、听力2节、阅读1节、讨论1节' },
      { label: '选修团体课', value: '白天写作、文法各1节；晚上商务英语或发音1节' },
      { label: '晚间测验', value: '每天背30个单字和10个句型，20:00测验' },
      { label: '评估', value: '每4周1次，出学习成效报告' },
    ],
    points: ['选修团体课可以不去，但那个时段要在自习室的固定座位自习。'],
  },
  {
    icon: 'workspace_premium',
    title: 'Master IELTS 每天上什么',
    subtitle: '5节一对一 + 4节团体课 + 每天模考',
    courseIds: ['master-ielts'],
    facts: [
      { label: '一对一', value: '口语、听力、阅读、写作Task 1、写作Task 2各1节' },
      { label: '团体课', value: '雅思口语、雅思文法和雅思模考（必修）；晚上商务英语或发音' },
      { label: '每天模考', value: '周一阅读、周二听力、周三写作、周四阅读、周五听力；口语在一对一课上测' },
      { label: '晚间测验', value: '每天20个雅思单字和10个句型' },
      { label: '评估', value: '每2周1次' },
    ],
    points: ['学校按老师的专长分配科目：阅读、听力、口语、写作各有专门的老师。'],
  },
  {
    icon: 'rule',
    title: '迟到、缺课和周末补自习',
    subtitle: '所有课程',
    facts: [
      { label: '迟到', value: '上课或自习开始3分钟后到，补25分钟自习' },
      { label: '缺课', value: '无故缺席，或开始10分钟后才到，补50分钟' },
      { label: '说母语', value: '在英语区（EOP）说母语，补25分钟' },
      { label: '其他', value: '上课玩游戏、看视频、睡觉，或缺单字测验、没交作业，补50分钟' },
      { label: '怎么补', value: '每周五21:00公布，当晚交周末计划；周六、周日09:00–17:00在自习室补，老师监督' },
    ],
    points: [
      '不罚钱，换成补自习；没补完的延到下一周继续补。',
      '毕业时还没补完，每25分钟扣25比索，先从押金扣；这些钱作为学生福利基金买点心，不算学校收入。补完前不发结业证书。',
    ],
  },
  {
    icon: 'event_available',
    title: '分班、跳级和上课天数',
    subtitle: '所有课程',
    facts: [
      { label: '上课天数', value: '每4周一期20天课（新生第一天入学测试，19天）；遇假日至少保证18天，超过2天假日的部分补课' },
      { label: '分班', value: '按入学测试分班，自己不能要求换班' },
      { label: '跳级', value: '每4周一次：第4周老师推荐、所有老师同意后学校通知参加，考过下一期跳过一册' },
      { label: '老师', value: '随机安排，不能指定老师、教室和上课时间' },
      { label: '换老师', value: '有影响学习的正当理由可以申请：找学生经理、填表、和主任老师面谈、听课确认' },
    ],
    points: [],
  },
];

export const MONOL_SPARTA_PRACTICAL_GUIDES: CampusPracticalGuide[] = [
  {
    icon: 'restaurant',
    eyebrow: 'MEALS & HOURS',
    title: '用餐与外出时间',
    facts: [
      { label: '平日', value: '三餐' },
      { label: '周末和假日', value: '一餐，早午餐09:00–11:00' },
      { label: '外出', value: '周一至周四17:00–19:00' },
      { label: '第二天没课', value: '可到午夜12:00' },
      { label: '第二天有课', value: '21:00前回来' },
    ],
    note: '6楼是餐厅和学生交谊厅，也可以在那里自习和休息。',
  },
  {
    icon: 'key',
    eyebrow: 'SCHOOL ITEMS',
    title: '学校物品',
    facts: [
      { label: 'ID卡丢失', value: '60比索' },
      { label: '洗衣牌丢失', value: '35比索' },
      { label: '宿舍钥匙丢失', value: '500比索' },
      { label: '宿舍钥匙损坏', value: '50比索' },
    ],
    note: '学校的东西不能带出校外；自己弄丢或弄坏要赔。',
  },
  {
    icon: 'storefront',
    eyebrow: 'NEARBY',
    title: '学校周边',
    facts: [
      { label: '步行', value: '便利店2分钟，生态公园和森林步道3分钟，超市、按摩店、健身房5分钟，室内运动中心6分钟' },
      { label: '坐车', value: '碧瑶市政府3分钟，咖啡店、快餐店、Burnham公园和公共市场5分钟，SM商场8分钟，MONOL主校区5分钟' },
      { label: '医院', value: '坐车7–8分钟有3家医院' },
      { label: '周末出游', value: '温泉30分钟，海滩1.5–2小时，Vigan古城4–5小时，Sagada洞穴5小时' },
    ],
    note: '时间是学校给的参考，坐吉普尼、出租车或巴士。',
  },
  {
    icon: 'event',
    eyebrow: 'BEFORE YOU GO',
    title: '出发前准备',
    facts: [
      { label: '入住', value: '周日入住，周一入学测试和入学说明' },
      { label: '接机', value: '马尼拉或克拉克机场团体接机3,000比索；单独派车马尼拉12,000、克拉克7,000比索' },
      { label: '押金', value: '100美元或4,000比索，原则上毕业当天退还' },
      { label: '离校', value: '课程结束后的周六' },
    ],
    note: '入境和签证材料由思达启航顾问逐项帮你核对；eTravel入境登记也由顾问协助填写。',
  },
];

/** Post-entry refunds follow the handbook; agency-facing lines are left out, and 思达启航's own deposit rule comes first. */
export const MONOL_SPARTA_REFUND_COPY: NonNullable<PhPageCopy['refund']> = {
  summaryTitle: 'MONOL 斯巴达校区取消与退款规定',
  summaryHint: '报名定金、入学前取消、到校后退款',
  eyebrow: 'CANCELLATION & REFUND',
  title: 'MONOL 斯巴达校区取消与退款规定',
  intro: '到校后的退款按4周一期计算；每周从周日算到周六，延长课程后退费也按同样规定。',
  alert: '报名前请确认',
  groups: [
    {
      title: '报名与入学前',
      note: '',
      rules: [
        { when: '报名定金', text: '通过思达启航报名时预收定金2,000元人民币，为学生向学校订位；定金交了以后不退。' },
        { when: '改期', text: '入学4周前告诉顾问，可以改入学日期，或把定金保留1年。' },
        { when: '入学14天以前取消', text: '学校退还已付的学费和住宿费。' },
        { when: '入学前14天内取消', text: '扣100美元营运损失费，其余退还。' },
      ],
      footnote: '',
    },
    {
      title: '到校以后',
      note: '',
      rules: [
        { when: '第一周内申请', text: '当周周五前申请，退还当周以外的学费和住宿费。' },
        { when: '下一期开始14天以前申请', text: '退还该期学费和住宿费的70%。' },
        { when: '下一期开始前14天内申请', text: '退70%，另扣2周原价住宿费。' },
        { when: '这一期已经开始', text: '这一期不退。' },
        { when: '换便宜的房型或课程', text: '入学说明当天申请，退差价的70%；之后申请退50%。' },
      ],
      footnote: '',
    },
    {
      title: '其他情况',
      note: '',
      rules: [
        { when: '违规退学', text: '已交的所有费用都不退，包括剩余的学费和住宿费。' },
        { when: '不退的费用', text: 'SSP、ACR I-CARD、签证延签、注册费、接机费和转账手续费。' },
        { when: '怎么申请', text: '到学校学生服务部门（SRD）填退费申请，毕业后两周内退还，由思达启航协助办理。' },
      ],
      footnote: MONOL_SPARTA_REFERENCE_NOTE,
    },
  ],
};

export const MONOL_SPARTA_FAQS: FaqItem[] = [
  { question: 'MONOL 斯巴达校区和 MONOL 主校区一样吗？', answer: '不一样。斯巴达校区是独立的一栋楼，只开 Booster ESL 和 Master IELTS 两门课，价格、房型和优惠都和主校区分开。' },
  { question: '每天要上几节课？', answer: '每天10节学习安排：Booster ESL 6节一对一，Master IELTS 5节一对一，其余是选修团体课和晚上的单字句型测验。不上选修团体课的时段，要在自习室的固定座位自习。' },
  { question: '迟到、缺课会罚款吗？', answer: '不罚钱，换成补自习：迟到或在英语区说母语补25分钟，缺课补50分钟，周六、周日09:00–17:00在自习室补完。毕业时还没补完的，每25分钟扣25比索，先从押金扣。' },
  { question: '平日可以外出吗？', answer: '周一至周四17:00–19:00可以外出；第二天没课可以到午夜12:00，第二天有课21:00前回来。外出外宿要先得到学校批准，擅自外出或外宿要补8小时自习。' },
  { question: '住宿费包含餐食吗？', answer: '包含平日三餐，周末和假日一餐（早午餐09:00–11:00）。' },
  { question: '现在报名有什么优惠？', answer: '2026/12/31前报名，在斯巴达校区学习并住宿，每满4周学费减100美元、住宿费减100美元；参加SNS活动（每4周发1条在校动态）每满4周再减100美元，活动可能随时结束。通过思达启航报名还免100美元注册费。报价器会自动计算。' },
  { question: '暑假去要多交钱吗？', answer: '2027/06/27–08/22 是碧瑶学校的暑期旺季，在这段时间学习或住宿的每一周加收60美元；同一周课程和住宿只算一次，不参加任何优惠。' },
  { question: '可以只读1–3周吗？', answer: '学校按4周一期收费，页面只报4周及以上。想读1–3周，请联系顾问向学校询价。' },
  { question: '签证费用怎么算？', answer: '中国护照可以办30天或59天旅游签证，香港特区和澳门特区护照分别免签停留14天和7天，超过就要延签。30天签证读5–8周延签4,940比索，9–12周累计11,150比索；59天签证读到9周才要延签。报价器按你选的护照和周数自动算。' },
  { question: '页面上的报价包含全部费用吗？', answer: '学校费用包含课程费和住宿费，并自动扣除优惠；到校学杂费单独列出，押金另外准备。两者分开显示，不相加。' },
  { question: '思达启航会协助签证和入境吗？', answer: '会。通过思达启航报名，顾问会免费协助菲律宾入境和签证相关手续，你只需要按顾问指引准备个人资料。' },
];

export const MONOL_SPARTA_FINAL_CTA_BADGES = ['免费选校建议', '确认空房和优惠', '签证与入境协助'];

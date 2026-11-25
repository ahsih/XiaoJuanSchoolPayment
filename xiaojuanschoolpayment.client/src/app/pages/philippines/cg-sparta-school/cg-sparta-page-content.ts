// Text and data of the CG Sparta page (CG斯巴达校区), from CG's 2026-11 school pack (2026 Chinese brochure, Sparta
// orientation guide, 2026 Sparta price list, 2027 Sparta calendar, 2027 IELTS Guarantee schedule) and the photos,
// videos and IELTS report in CG's own Google Drive folder. Nothing from the Banilad campus belongs here: the two
// campuses have separate pages. The shared Philippine school template reads this module through
// cg-sparta-page-profile.ts. Keep it pure data (no Angular, DOM or storage), so the WeChat mini program can reuse
// it. Never add the school's phone, address, website, e-mail or nationality chart.
import type {
  BasicInfoRow,
  CampusBuildingCard,
  CampusPracticalGuide,
  CourseDetailGuide,
  DailyScheduleRow,
  FaqItem,
  GalleryImage,
  HolidayCalendar,
} from '../cia-school/cia-page-content';
import type { PhRoomProfile } from '../school-page/ph-school-profile';
import { SCHOOL_REFERENCE_NOTE } from '../school-page/school-reference-note';

export const CG_SPARTA_REFERENCE_NOTE = SCHOOL_REFERENCE_NOTE;

/**
 * Arrival Sundays of the 2027 IELTS Guarantee intakes (the school's 2027 schedule): classes start the next Monday,
 * and the official test is on the Saturday after the 10th study week.
 */
export const CG_SPARTA_IELTS_GUARANTEE_STARTS: ReadonlyArray<{ arrival: string; classStart: string; test: string }> = [
  { arrival: '2026-11-08', classStart: '2026-11-09', test: '2027-01-16' },
  { arrival: '2026-12-06', classStart: '2026-12-07', test: '2027-02-13' },
  { arrival: '2027-01-03', classStart: '2027-01-04', test: '2027-03-13' },
  { arrival: '2027-01-31', classStart: '2027-02-01', test: '2027-04-10' },
  { arrival: '2027-02-28', classStart: '2027-03-01', test: '2027-05-08' },
  { arrival: '2027-04-11', classStart: '2027-04-12', test: '2027-06-19' },
  { arrival: '2027-05-02', classStart: '2027-05-03', test: '2027-07-10' },
  { arrival: '2027-06-06', classStart: '2027-06-07', test: '2027-08-14' },
  { arrival: '2027-07-04', classStart: '2027-07-05', test: '2027-09-11' },
  { arrival: '2027-08-01', classStart: '2027-08-02', test: '2027-10-09' },
  { arrival: '2027-09-05', classStart: '2027-09-06', test: '2027-11-13' },
  { arrival: '2027-10-03', classStart: '2027-10-04', test: '2027-12-11' },
];

const shortDate = (value: string) => value.slice(5).replace('-', '/');

export const CG_SPARTA_PAGE_TEXT = {
  heroLead: 'CG 的斯巴达校区：周一到周四不外出，每天从早上8点学到晚上10点，平日上课时间全英语（EOP）；有雅思保分班、托业和商务英语，校园里有游泳池、篮球场和慢跑道。',
  advisorText: 'CG斯巴达校区适合想在短时间里集中提高的学生：平日不外出，每天正课8节，晚上还有晚课、单词测试、作文和晚自习；单词测试没通过会限制周末外出。雅思保分班只开12周，按学校指定日期入学。想住在市区、空堂可以外出，可以看 CG Banilad 校区（另一个页面）。',
  campusIntro: '教室、宿舍、餐厅、小卖部、游泳池、篮球场、乒乓球和健身区都在一个校园里，宿舍从单人间到四人间。',
  galleryIntro: '按区域查看校园、教室、住宿、餐厅和设施；相册内用左右箭头或缩略图切换，点击主图可放大。',
  coursesIntro: '按学习目标分组，每门课下面是每天的课时；点开可看适合人群和说明。每节课45分钟，小组课每班最多4人。',
  roomsPhotoIntro: '点选房型查看实景；各房型价格见上方住宿费表。',
  finalCtaTitle: '想确认 CG斯巴达校区的空房和开课日期？',
  finalCtaText: '告诉顾问你的入学日期、周数、课程和想住的房型，我们帮你确认房间和开课日期，并做一份完整报价。',
} as const;

export const CG_SPARTA_QUICK_INFO = [
  { icon: 'rule', title: '全斯巴达', text: '周一到周四不外出，周五毕业典礼后可外出' },
  { icon: 'schedule', title: '每天学到22:00', text: '正课8节，晚课、单词测试、作文和晚自习' },
  { icon: 'record_voice_over', title: '全英语环境', text: '平日08:00–17:00校内只讲英语（EOP）' },
  { icon: 'workspace_premium', title: '雅思保分班', text: '12周，按学校指定日期入学' },
  { icon: 'groups', title: '小组课最多4人', text: '雅思保分班和雅思强化除外' },
  { icon: 'pool', title: '校园设施', text: '游泳池、篮球场、乒乓球、慢跑道、小卖部' },
];

/** Key facts under the hero title (compact layout). */
export const CG_SPARTA_OVERVIEW_FACTS: ReadonlyArray<{ icon: string; label: string; value: string }> = [
  { icon: 'location_on', label: '位置', value: '宿务省塔里赛市，校园独立，周末打车出行' },
  { icon: 'rule', label: '管理', value: '周一到周四不能外出；周五17:00毕业典礼后才能外出' },
  { icon: 'schedule', label: '门禁', value: '周五、周六和假期前一天24:00；周日和连假最后一天22:00' },
  { icon: 'record_voice_over', label: '全英语', value: '平日08:00–17:00校内只讲英语（午餐、宿舍和办公室除外）' },
  { icon: 'menu_book', label: '课程', value: '斯巴达、托业、雅思基础、雅思保分班、雅思强化、商务英语和短期冲刺' },
  { icon: 'quiz', label: '测试', value: '平日每天单词测试；每月最后一周的周五水平测试；雅思保分班和雅思强化每周模考' },
  { icon: 'event', label: '入学', value: '每周日入住，周一上午水平测试、下午说明会' },
  { icon: 'bed', label: '住宿', value: '校内单人间、双人间、三人间和四人间' },
];

export const CG_SPARTA_BASIC_INFO: BasicInfoRow[] = [
  { label: '学校', value: 'CG Academy（Cebu Globalization Academy）斯巴达校区' },
  { label: '位置', value: '菲律宾宿务省塔里赛市' },
  { label: '管理方式', value: '全斯巴达：周一到周四不外出，平日上课时间全英语' },
  { label: '课程', value: '斯巴达、托业、雅思基础、雅思保分班、雅思强化、商务英语、短期冲刺' },
  { label: '住宿', value: '校内单人间、双人间、三人间、四人间' },
  { label: '入学', value: '每周日入住，周一开课；雅思保分班按指定日期开课' },
];

export const CG_SPARTA_SUITABLE_FOR = [
  '自制力一般、需要严格管理推着学的学生',
  '要在几个月里冲雅思或托业分数的学生',
  '想在全英语环境里多开口的学生',
  '去澳洲打工度假或留学前想集中补英语的学生',
];

export const CG_SPARTA_NOT_SUITABLE_FOR = [
  '想平日下课后出去玩的学生（可看 CG Banilad 校区）',
  '想边学边度假、作息自由的学生',
  '不能接受校内禁酒、平日不外出和扣分制度的学生',
];

/** What is on campus and when it is open (Sparta orientation guide and brochure). */
export const CG_SPARTA_CAMPUS_AREAS: CampusBuildingCard[] = [
  { code: 'STUDY', title: '学习', icon: 'school', facilities: ['一对一和小组教室', '大教室', '自习室和会议室'] },
  { code: 'LIFE', title: '生活', icon: 'restaurant', facilities: ['自助餐厅，每天三餐', '小卖部（平日07:30–23:00）', '洗衣房'] },
  { code: 'SPORT', title: '运动', icon: 'pool', facilities: ['游泳池（平日20:00–24:00）', '篮球场 17:00–24:00', '乒乓球、羽毛球和慢跑道'] },
  { code: 'DORM', title: '宿舍', icon: 'bed', facilities: ['单人间到四人间', '房间有书桌、衣柜和空调', 'Wi-Fi（含在综合管理费里）'] },
];

const photo = (file: string) => `assets/cg-sparta/photos/${file}.webp`;
export const CG_SPARTA_QUOTE_IMAGE_HERO = '/assets/philippines/cg-sparta-campus-hero.webp';

export const CG_SPARTA_GALLERY_IMAGES: GalleryImage[] = [
  { category: '校园', title: 'CG斯巴达校区', description: '游泳池和宿舍楼。', src: photo('campus-pool-sign') },
  { category: '校园', title: '校园全景', description: '泳池在校园中间。', src: photo('campus-03') },
  { category: '校园', title: '宿舍楼', description: '一排宿舍楼。', src: photo('campus-01') },
  { category: '校园', title: '宿舍楼', description: '宿舍楼前的道路。', src: photo('campus-02') },
  { category: '校园', title: '校园标志', description: 'CG SPARTA 立体字。', src: photo('campus-sign-01') },
  { category: '校园', title: '校园标志', description: '校园里的 CG SPARTA 立体字。', src: photo('campus-sign-02') },
  { category: '校园', title: '教室走廊', description: '上课时间全英语。', src: photo('corridor-01') },
  { category: '校园', title: '夜晚的校园', description: '晚上的校园和泳池。', src: photo('campus-night-01') },
  { category: '校园', title: '夜晚的校园', description: '晚自习到22:00。', src: photo('campus-night-02') },
  { category: '教室', title: '一对一课', description: '每节课45分钟。', src: photo('one-to-one-01') },
  { category: '教室', title: '一对一课', description: '一位老师对一位学生。', src: photo('one-to-one-02') },
  { category: '教室', title: '一对一课', description: '一对一教室。', src: photo('one-to-one-03') },
  { category: '教室', title: '一对一课', description: '上课时只讲英语。', src: photo('one-to-one-04') },
  { category: '教室', title: '1:4小组课', description: '小组课每班最多4人。', src: photo('group-01') },
  { category: '教室', title: '1:4小组课', description: '和不同国家的同学一起练口语。', src: photo('group-02') },
  { category: '教室', title: '大教室', description: '人数较多的课和活动在这里举行。', src: photo('evening-01') },
  { category: '教室', title: '大教室上课', description: '老师带着大家一起上课。', src: photo('evening-02') },
  { category: '教室', title: '大教室', description: '可容纳很多学生的教室。', src: photo('lecture-room-01') },
  { category: '教室', title: '大教室', description: '大教室的座位。', src: photo('lecture-room-02') },
  { category: '住宿', title: '单人间', description: '一个人住，有书桌、衣柜和空调。', src: photo('single-01') },
  { category: '住宿', title: '双人间', description: '两人同住。', src: photo('twin-01') },
  { category: '住宿', title: '三人间', description: '三人同住。', src: photo('triple-01') },
  { category: '住宿', title: '四人间', description: '四人同住，预算最低。', src: photo('quad-01') },
  { category: '餐厅', title: '学生餐厅', description: '自助餐，每天三餐。', src: photo('dining-01') },
  { category: '餐厅', title: '学生餐厅', description: '用餐区。', src: photo('dining-02') },
  { category: '餐厅', title: '学生餐厅', description: '早餐用新鲜食材。', src: photo('dining-03') },
  { category: '餐厅', title: '学生餐厅', description: '同学们一起吃饭。', src: photo('dining-04') },
  { category: '餐厅', title: '自助餐台', description: '午餐有主菜和多种小菜。', src: photo('dining-buffet') },
  { category: '餐厅', title: '餐点', description: '晚餐有三道主菜和十多道小菜。', src: photo('dining-food-01') },
  { category: '餐厅', title: '沙拉和水果', description: '每天有沙拉和当季水果。', src: photo('dining-salad') },
  { category: '餐厅', title: '小卖部', description: '平日07:30–23:00，周末和假日10:00–19:00。', src: photo('snack-bar-01') },
  { category: '餐厅', title: '小卖部', description: '饮料和零食。', src: photo('snack-bar-02') },
  { category: '餐厅', title: '小卖部', description: '借球拍也在这里，出示学生证。', src: photo('snack-bar-03') },
  { category: '设施', title: '游泳池', description: '平日20:00–24:00，周末和假日08:00–24:00。', src: photo('pool-01') },
  { category: '设施', title: '游泳池', description: '下课后游泳放松。', src: photo('pool-02') },
  { category: '设施', title: '游泳池', description: '泳池边的宿舍楼。', src: photo('pool-03') },
  { category: '设施', title: '休息区', description: '茅草屋顶的休息区，08:00–24:00开放。', src: photo('rest-area-01') },
  { category: '设施', title: '休息区', description: '休息区的躺椅。', src: photo('rest-area-02') },
  { category: '设施', title: '休息区', description: '课后聊天、休息的地方。', src: photo('rest-area-03') },
  { category: '设施', title: '休息区', description: '休息区一角。', src: photo('rest-area-04') },
  { category: '设施', title: '健身区', description: '有顶棚的户外健身区。', src: photo('gym-01') },
  { category: '设施', title: '健身区', description: '健身器械。', src: photo('gym-02') },
  { category: '设施', title: '健身区', description: '课后锻炼的地方。', src: photo('gym-03') },
  { category: '设施', title: '乒乓球', description: '08:00–24:00开放，在小卖部借球拍。', src: photo('table-tennis-01') },
  { category: '设施', title: '乒乓球', description: '乒乓球台。', src: photo('table-tennis-02') },
];

export const CG_SPARTA_ALBUM_DESCRIPTIONS = {
  校园: '校园、宿舍楼和夜景',
  教室: '一对一、1:4小组课和大教室',
  住宿: '校内单人间到四人间',
  餐厅: '自助餐厅和小卖部',
  设施: '游泳池、休息区、健身区和乒乓球',
} as const;

/**
 * A clip in public/assets/cg-sparta/videos/ (720p H.264 with a poster each), from CG's own Google Drive folder.
 * The school film had its shots with another organisation's signage cut out. Check every frame of a new clip for
 * other companies, flags and contact details before adding it.
 */
export interface CgSpartaVideo {
  name: string;
  title: string;
  description: string;
  duration: string;
  orientation: 'landscape' | 'portrait';
}

export const cgSpartaVideoSrc = (video: CgSpartaVideo) => `/assets/cg-sparta/videos/${video.name}.mp4`;
export const cgSpartaVideoPoster = (video: CgSpartaVideo) => `/assets/cg-sparta/videos/poster-${video.name}.jpg`;

export const CG_SPARTA_VIDEOS: CgSpartaVideo[] = [
  { name: 'campus-film', title: 'CG斯巴达校区介绍', description: '校园、教室、宿舍、餐厅和泳池。', duration: '2:52', orientation: 'landscape' },
  { name: 'student-day', title: '学员的一天', description: '一位学员在斯巴达校区的一天：上课、吃饭、晚自习。', duration: '1:17', orientation: 'portrait' },
];

const DORM_SERVICE = '可申请打扫，每周最多2次（提前1天预约）；衣服交洗衣房洗';
const numbered = (prefix: string, count: number) => Array.from({ length: count }, (_, index) => photo(`${prefix}-${String(index + 1).padStart(2, '0')}`));
const DORM_HIGHLIGHTS = ['书桌、书柜、衣柜和空调', 'Wi-Fi（含在综合管理费里）'];

export const CG_SPARTA_ROOM_PROFILES: PhRoomProfile[] = [
  {
    id: 'single', rateIds: ['single'], label: '单人间', location: '校内', bed: '单人床', service: DORM_SERVICE,
    suitable: '重视隐私、晚上想安静自习的学生', note: '一个人住，房内有卫生间。', highlights: DORM_HIGHLIGHTS,
    image: photo('single-01'), gallery: [...numbered('single', 4), photo('single-bath')], imageAlt: 'CG斯巴达校区单人间实景',
  },
  {
    id: 'twin', rateIds: ['twin'], label: '双人间', location: '校内', bed: '两张单人床', service: DORM_SERVICE,
    suitable: '朋友同行或想兼顾预算的学生', note: '两人同住，空调电费两人分摊。', highlights: DORM_HIGHLIGHTS,
    image: photo('twin-01'), gallery: [...numbered('twin', 3), photo('twin-bath')], imageAlt: 'CG斯巴达校区双人间实景',
  },
  {
    id: 'triple', rateIds: ['triple'], label: '三人间', location: '校内', bed: '三张单人床', service: DORM_SERVICE,
    suitable: '想控制预算、又不想住四人间的学生', note: '三人同住，空调电费按人数分摊。', highlights: DORM_HIGHLIGHTS,
    image: photo('triple-01'), gallery: [...numbered('triple', 4), photo('triple-bath')], imageAlt: 'CG斯巴达校区三人间实景',
  },
  {
    id: 'quad', rateIds: ['quad'], label: '四人间', location: '校内', bed: '四张单人床', service: DORM_SERVICE,
    suitable: '预算优先、喜欢热闹的学生', note: '四人同住，空调电费按人数分摊。', highlights: DORM_HIGHLIGHTS,
    image: photo('quad-01'), gallery: [...numbered('quad', 4), photo('quad-bath')], imageAlt: 'CG斯巴达校区四人间实景',
  },
];

export const CG_SPARTA_DORM_RULES = [
  { title: '平日外出', text: '周一到周四不能外出；周五17:00毕业典礼以后才能外出。看病、买药可以外出，但不能顺便购物或在外逗留。' },
  { title: '门禁', text: '周五、周六和假期前一天24:00；周日和连假最后一天22:00。超过1小时内扣50分，超过1小时扣100分。' },
  { title: '未成年人', text: '门禁21:00；外出须有成人陪同并取得管理员许可，外宿和旅行还要家长同意。' },
  { title: '外宿和旅行', text: '只有周末和假期旅行可以外宿：平日17:00前交旅行计划，周一17:00前交住宿凭证。只能住麦克坦岛学校指定的酒店，不能在宿务市、曼达维和塔里赛外宿。3天2晚的行程可以多请周五或周一（记缺勤、不扣分；雅思保分班不适用）。' },
  { title: '出行方式', text: '外出坐出租车或三轮车（三轮车到19:00），不能步行或坐摩托车。' },
  { title: '家人探访', text: '直系亲属或朋友来宿务，每12周可以请1次假，最长7天6晚，须出示机票。' },
  { title: '扣分', text: '扣分累计到50分禁足1周，100分2周，150分3周，200分退学；读12周以上的学生，从第13周起清零出勤扣分。' },
  { title: '禁止事项', text: '校内禁止喝酒和带酒回校；不能进入别人的房间（同性也不行）；校内不能做饭；24:00以后保持安静，也不能叫外卖。' },
  { title: '房间物品', text: '冰箱每4周800比索、风扇每4周200比索；保险箱免费，另交押金2,000比索。钥匙丢失赔1,000比索。' },
];

/** One weekday (Monday–Thursday) at the Sparta campus. */
export const CG_SPARTA_SCHEDULE: DailyScheduleRow[] = [
  { time: '07:00–08:00', activity: '早餐（周末和假日08:00–09:00）', kind: 'meal' },
  { time: '08:00–08:45', activity: '第1节', kind: 'class' },
  { time: '08:55–09:40', activity: '第2节', kind: 'class' },
  { time: '09:50–10:35', activity: '第3节', kind: 'class' },
  { time: '10:45–11:30', activity: '第4节', kind: 'class' },
  { time: '11:40–12:25', activity: '第5节', kind: 'class' },
  { time: '12:25–13:25', activity: '午餐', kind: 'meal' },
  { time: '13:25–14:10', activity: '第6节', kind: 'class' },
  { time: '14:20–15:05', activity: '第7节', kind: 'class' },
  { time: '15:15–16:00', activity: '第8节', kind: 'class' },
  { time: '16:10–16:55', activity: '第9节', kind: 'class' },
  { time: '17:05–17:50', activity: '晚课：语法、托业听力或雅思听力', kind: 'activity' },
  { time: '17:50–19:00', activity: '晚餐', kind: 'meal' },
  { time: '19:00–20:00', activity: '单词测试和作文', kind: 'test' },
  { time: '20:10–22:00', activity: '晚自习（所有学生参加）', kind: 'activity' },
];

const GUARANTEE_STARTS_TEXT = CG_SPARTA_IELTS_GUARANTEE_STARTS
  .filter(item => item.arrival >= '2027-01-01')
  .map(item => shortDate(item.arrival))
  .join('、');

export const CG_SPARTA_COURSE_DETAIL_GUIDES: CourseDetailGuide[] = [
  {
    icon: 'workspace_premium',
    title: '雅思保分班怎么报',
    subtitle: '12周，按学校指定日期入学',
    courseIds: ['ielts-guarantee'],
    facts: [
      { label: '周数', value: '12周：10周上课，之后2周等官方成绩' },
      { label: '2027年入住日', value: `${GUARANTEE_STARTS_TEXT}（周日入住，周一开课）` },
      { label: '目标5.5', value: '入学测试3.5，或托业500分' },
      { label: '目标6.0', value: '入学测试5.0，或托业700分' },
      { label: '目标6.5', value: '入学测试6.0，或托业810分' },
      { label: '目标7.0', value: '2年内官方雅思6.5' },
    ],
    points: [
      '没有官方成绩的学生，到校后先做学校的雅思模考定目标分。',
      '晚课（TED TALK）、雅思单词测试和晚自习都必上，单词测试通过线23分；每周一次模考。',
      '小组课不是1:4小班。',
    ],
    notice: '保分条件以学校规定为准，报名前顾问会和你逐项确认。',
  },
  {
    icon: 'school',
    title: '雅思强化',
    subtitle: '4周起报，目标5.0–6.5',
    courseIds: ['ielts-intensive'],
    facts: [
      { label: '目标5.0–5.5', value: '入学测试3.0，或托业500分' },
      { label: '目标6.0–6.5', value: '入学测试5.0，或托业700分' },
      { label: '模考', value: '每周一次' },
      { label: '晚上', value: '晚课自选，单词测试必上（通过线20分）' },
    ],
    points: ['小组课不是1:4小班。'],
  },
  {
    icon: 'bolt',
    title: '短期冲刺怎么报',
    subtitle: '只读1–2周的学生',
    courseIds: ['booster'],
    facts: [
      { label: '课程', value: '每天一对一8节，由8位老师上课' },
      { label: '周数', value: '只能单独报1周（370美元）或2周（640美元）' },
      { label: '开课', value: '周一下午开始上课' },
      { label: '晚上', value: '晚课或自习，单词测试和作文，晚自习' },
    ],
    points: ['公众假期的课自选参加。'],
  },
  {
    icon: 'quiz',
    title: '单词测试与作文',
    subtitle: '所有课程',
    facts: [
      { label: '单词测试', value: '每天20个单词，要背下来并造句，满分30分' },
      { label: '通过线', value: '斯巴达、雅思基础、托业、商务英语15分；雅思强化20分；雅思保分班23分' },
      { label: '没通过', value: '一周2次不能周五外出，3次周五和周六，4次整个周末' },
      { label: '作文', value: '每天两个题目选一个，至少写10行，22:00前交' },
    ],
    points: ['新生第一周周一下午领单词表，周二的单词测试一律算通过。'],
  },
  {
    icon: 'swap_horiz',
    title: '分级、换课与出勤',
    subtitle: '所有课程',
    facts: [
      { label: '分级', value: '入学当天水平测试，分8个级别；每月最后一周的周五水平测试' },
      { label: '晚课', value: '初级学生可以上晚课或自习；中级以上必须上自己选的晚课' },
      { label: '换课', value: '每周指定日子07:30–09:00到办公室登记，下周一开始上新课' },
      { label: '差价', value: '升级补差价；降级不退差价，也不能再换回' },
      { label: '迟到缺课', value: '3分钟内没进教室算迟到，5分钟算缺课；病假每月8节内不扣分' },
      { label: '毕业证书', value: '出勤率80%以上、扣分不超过100分' },
    ],
    points: ['所有学生都要按课表买指定教材（平日17:00前）。', '晚自习每位学生可以申请免除，最多两次。'],
  },
];

export const CG_SPARTA_PRACTICAL_GUIDES: CampusPracticalGuide[] = [
  {
    icon: 'flight_land',
    eyebrow: 'FIRST DAY',
    title: '第一天怎么安排',
    facts: [
      { label: '上午', value: '水平测试' },
      { label: '下午', value: '新生说明会，之后到 Robinson 商场买日用品' },
      { label: '17:00前', value: '到办公室交到校费用，领课表和学生证' },
      { label: '毕业典礼', value: '每周五17:00' },
    ],
    note: '到校后要交的费用（SSP、押金、综合管理费、接机费）在说明会后到办公室交。',
  },
  {
    icon: 'restaurant',
    eyebrow: 'MEALS & HOURS',
    title: '用餐与开放时间',
    facts: [
      { label: '早餐', value: '平日07:00–08:00，周末和假日08:00–09:00' },
      { label: '午餐', value: '12:25–13:25' },
      { label: '晚餐', value: '17:50–19:00' },
      { label: '小卖部', value: '平日07:30–23:00，周末和假日10:00–19:00' },
      { label: '游泳池', value: '平日20:00–24:00，周末和假日08:00–24:00' },
      { label: '运动', value: '乒乓球、羽毛球、休息区08:00–24:00；篮球场17:00–24:00' },
    ],
    note: '自助餐每周有一天特色菜单；晚餐有三道主菜、十多道小菜和水果、沙拉。',
  },
  {
    icon: 'cleaning_services',
    eyebrow: 'SCHOOL SERVICES',
    title: '打扫与洗衣',
    facts: [
      { label: '打扫', value: '可申请，每周最多2次，周一至周五08:00–17:00，提前1天预约' },
      { label: '洗衣', value: '每天08:00–17:00，假日休息；衣服装满洗衣篮交洗' },
      { label: '自己洗', value: '牛仔裤、针织衫等不能机洗的衣物，以及袜子和内衣' },
    ],
    note: '肥皂、牙膏、洗发水、纸巾等日用品自己准备。',
  },
  {
    icon: 'celebration',
    eyebrow: 'ACTIVITIES',
    title: '学校活动',
    facts: [
      { label: '每月', value: '跳岛游、公益活动，部分月份有知识竞赛和才艺表演' },
      { label: '节日', value: '情人节、万圣节和圣诞节活动' },
    ],
    note: '活动安排以学校当月日历为准。',
  },
  {
    icon: 'luggage',
    eyebrow: 'BEFORE YOU GO',
    title: '出发前准备',
    facts: [
      { label: '回程机票', value: '读9周以上要交回程机票' },
      { label: '护照', value: '办SSP和学生卡约2–3周，期间护照由学校保管' },
      { label: '保险', value: '出发前必须买好旅行保险' },
      { label: '银行卡', value: '带一张能在境外用的银行卡' },
      { label: '衣物和药品', value: '空调开得足，带几件长袖和薄外套；感冒药、外伤药和自己常用的药' },
    ],
    note: '入境和签证材料由思达启航顾问逐项帮你核对；eTravel入境登记也由顾问协助填写。',
  },
];

const HOLIDAYS_2027: Array<[number, number, string]> = [
  [1, 1, '元旦'],
  [1, 15, '建市纪念日（Charter Day）'],
  [3, 12, '开斋节'],
  [3, 25, '圣周四'],
  [3, 26, '耶稣受难日'],
  [4, 9, '英勇日'],
  [5, 21, '宰牲节'],
  [8, 6, '地方纪念日（Charter Day）'],
  [9, 3, '国家英雄日'],
  [9, 10, '奥斯梅尼亚纪念日'],
  [11, 1, '万圣节'],
  [11, 2, '万灵节'],
  [12, 3, '博尼法西奥纪念日'],
  [12, 10, '圣母无原罪瞻礼'],
  [12, 24, '平安夜'],
  [12, 30, '黎刹纪念日'],
  [12, 31, '年末'],
];

/** The Sparta campus's 2027 weekday holidays, from the school calendar; holidays have no class and no makeup class. */
export const CG_SPARTA_HOLIDAY_CALENDARS: HolidayCalendar[] = [{
  year: 2027,
  label: '规划2027年入学时优先查看',
  months: [...new Set(HOLIDAYS_2027.map(([month]) => month))].map(month => ({
    month,
    holidays: HOLIDAYS_2027.filter(([m]) => m === month).map(([, day, name]) => ({ day: `${day}日`, name })),
  })),
}];

/** IELTS report from CG's folder, cut and pixelated so no name, photo, birth date or candidate number shows. */
export const CG_SPARTA_IELTS_RESULTS = [
  {
    image: 'assets/cg-sparta/ielts-results/ielts-korea-10w-6-5.webp', title: '韩国学员 · 2025年5月入学', entrance: '3.5', overall: '6.5',
    summary: '入学测试3.5 → 约10周后官方雅思6.5', detail: '听力7.0 阅读6.5 写作6.0 口语5.5',
  },
];

export const CG_SPARTA_REVIEWS_COPY = {
  eyebrow: 'IELTS RESULTS',
  title: 'CG斯巴达校区学员的雅思成绩',
  intro: '学员入学先做水平测试，学习期间参加模考，最后去考官方雅思。',
  source: '真实学员成绩单',
  scoresTitle: '入学测试 → 官方雅思',
  scoresIntro: '点击可查看成绩单。',
  scoresNote: '已隐藏学员个人信息；成绩因个人基础和投入而异，仅供参考。',
};

/** The school's refund rules, plus 思达启航's own deposit rule (user decision 2026-11-24). */
export const CG_SPARTA_REFUND_COPY = {
  summaryTitle: 'CG斯巴达校区取消、改期与退款规定',
  summaryHint: '报名定金、出发前取消、到校后退款和保留课程',
  eyebrow: 'CANCELLATION & REFUND',
  title: 'CG斯巴达校区取消与退款规定',
  intro: '注册费不退；报名4周以上才能按下面的规定退款，退款在离校4周后办理。',
  alert: '报名前请确认',
  groups: [
    {
      title: '报名与出发前',
      note: '',
      rules: [
        { when: '报名定金', text: '通过思达启航报名时预收定金2,000元人民币，为学生向学校订位；定金交了以后不退。' },
        { when: '改期', text: '入学4周前告诉顾问，可以改入学日期，或把定金保留1年；不足4周改期可能要扣违约金，以学校确认为准。' },
        { when: '出发2周前取消', text: '扣注册费，其余全额退还。' },
        { when: '出发前2周内取消', text: '退学费的80%。' },
      ],
      footnote: '',
    },
    {
      title: '开课以后',
      note: '',
      rules: [
        { when: '学习时间25%以内', text: '上课当周不退，其余退50%。' },
        { when: '学习时间25%–50%', text: '上课当周不退，其余退20%。' },
        { when: '学习时间超过50%', text: '不退款。' },
        { when: '降级', text: '换成更便宜的课程或房型不退差价，也不能再换回。' },
        { when: '延长课程', text: '延长部分开始前取消，退50%；开始后按上面的规定退。' },
      ],
      footnote: '',
    },
    {
      title: '保留课程',
      note: '',
      rules: [
        { when: '家人生病或丧事', text: '剩余4周以上可以保留课程，退房4周后、1年内回来继续读；不能在旺季回来，也不能转给别人。剩余不足4周不能保留。' },
        { when: '违规退学', text: '扣分累计200分会被退学，不退款。' },
      ],
      footnote: '',
    },
  ],
};

export const CG_SPARTA_FAQS: FaqItem[] = [
  { question: 'CG斯巴达校区和 CG Banilad 有什么不同？', answer: '斯巴达校区周一到周四不能外出，每天从早上8点学到晚上10点，平日上课时间全英语；Banilad 在宿务市中心，一般课程空堂就能外出。两个校区是两个页面，课程和价格各自不同。' },
  { question: '单词测试没通过会怎样？', answer: '一周内2次没通过，周五不能外出；3次周五和周六不能外出；4次整个周末都不能外出。通过线按课程不同：斯巴达等课程15分，雅思强化20分，雅思保分班23分（满分30分）。' },
  { question: '雅思保分班哪天入学？', answer: `只能报12周，在学校指定的日期入学。2027年的周日入住日是${GUARANTEE_STARTS_TEXT}。报价器会提示你选对日期。` },
  { question: '只能读1–2周可以吗？', answer: '可以。1–3周按4周价格的40%／60%／85%计算；也可以报短期冲刺课程（每天一对一8节，1周370美元，2周640美元）。雅思保分班只能报12周，雅思强化4周起报。' },
  { question: '2026–2027年有什么优惠？', answer: '2026/08/30–12/27或2027/02/14–05/23入学，每满4周课程减150美元；每段连续课程12/16/20/24周再减50/100/150/200美元。通过思达启航报名，课程费和住宿费享9折。报价器会按你的日期自动计算。' },
  { question: '暑假要加钱吗？', answer: '2027/07/04–08/28期间的学习周，每周加收60美元暑假附加费（2026年暑期每周40美元）；同一周课程和住宿只算一次，不参与折扣。' },
  { question: '可以读超过24周吗？', answer: '可以，斯巴达校区最长可以报52周。报名25周以上要交两次SSP，签证续签次数也会增加，顾问会帮你逐项确认。' },
  { question: '页面上的报价包含全部费用吗？', answer: '学校费用包含注册费、课程费和住宿费，并自动扣除优惠；到校学杂费单独列出，接机和押金另外准备。两者分开显示，不相加。' },
  { question: '思达启航会协助签证和入境吗？', answer: '会。通过思达启航报名，顾问会免费协助菲律宾入境和签证相关手续，你只需要按顾问指引准备个人资料。' },
];

export const CG_SPARTA_FINAL_CTA_BADGES = ['免费选校建议', '确认空房和开课日期', '签证与入境协助'];

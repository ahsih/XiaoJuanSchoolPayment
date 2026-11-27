// Text and data of the TARGET page, from the school's files received 2026-11-26: the school brochure, the IELTS course
// brochure, the price list for applications from 2026/07/10, the school rules (from 2025/09/01), the welcome sheet,
// the 2027 holiday schedule (as of 2026/11/19), the November 2026 partner notice and the school's Google Drive photos
// and videos. The shared Philippine school template reads this module through target-page-profile.ts. Keep it pure
// data (no Angular, DOM or storage), so the WeChat mini program can reuse it. Never add the school's address, phone,
// website, Wi-Fi password, WeChat or other contact channels, or any agency term. Sources: docs/target-source-2026-11-26.md.
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
import type { PhOfferCard, PhRoomProfile, PhVideoItem } from '../school-page/ph-school-profile';
import { SCHOOL_REFERENCE_NOTE } from '../school-page/school-reference-note';
import { TARGET_UPGRADE_OFFER } from './target-content-config';

/** Closes every content section once; the same line as on every Philippine school page. */
export const TARGET_REFERENCE_NOTE = SCHOOL_REFERENCE_NOTE;

export const TARGET_PAGE_TEXT = {
  heroLead: 'TARGET 2013年创立，由日本人经营，在宿务市北部的 Talamban，离 IT Park 约15分钟车程。度假风校园带泳池，教学楼和宿舍都在校内；课程价已含校内住宿，每天4–8节一对一，半斯巴达管理，也有雅思常规班和12周保分班。',
  advisorText: 'TARGET 是一所小而安静的度假风学校：泳池在校园中间，教室和宿舍都在校内，不用通勤。课程按每天一对一节数分档，从4节到8节，一节课45分钟；平日下课后可以外出，但周一至周四的单词考试没过或必修课缺席，当天就不能外出（半斯巴达）。学校由日本人经营，管理细致、校规清楚，适合15岁以上、读4周以上、想安心学习的学生。周边步行可到商场、便利店和餐厅，但不在市中心，想每天逛市区的学生要考虑交通。',
  campusIntro: '校园是一个围着泳池的院子：一侧是两层的学生宿舍和办公室，另一侧是一对一教室、小组教室和自习室；还有学生餐厅、小卖部、桌球和乒乓球室、篮球架和医务室。',
  galleryIntro: '按区域查看校园、教室、住宿、餐厅和设施；相册内用左右箭头或缩略图切换，点击主图可放大。',
  coursesIntro: '课程价含课程和校内住宿，按六人房计算；住其他房型见下方房型加价。每节课45分钟，点开课程可看适合人群和说明。',
  roomsPhotoIntro: '照片和视频按房型分：单人房、双人房、三人房、四人房（上下铺）和六人房（上下铺）。同一房型的房间大小、朝向和设施新旧可能不同，具体房间由学校安排。',
  finalCtaTitle: '想确认 TARGET 的空房、课程和优惠？',
  finalCtaText: '告诉顾问入学日期、周数、想读的课程和房型，我们帮你向学校确认，并做一份完整报价。',
} as const;

export const TARGET_QUICK_INFO = [
  { icon: 'location_on', title: '宿务 Talamban', text: '宿务市北部，离 IT Park 约15分钟车程' },
  { icon: 'home', title: '课程含住宿', text: '课程价已含校内住宿，按六人房计算' },
  { icon: 'record_voice_over', title: '一对一4–8节', text: '每天4、5、6或8节一对一，每节45分钟' },
  { icon: 'rule', title: '半斯巴达', text: '平日可外出；单词考试没过当天不能外出' },
  { icon: 'school', title: '雅思课程', text: '常规班和12周保分班，每周五模考' },
  { icon: 'pool', title: '度假风校园', text: '泳池、桌球乒乓球室和篮球架' },
];

/** Key facts under the hero title (compact layout); the buildings are in TARGET_CAMPUS_BUILDINGS. */
export const TARGET_OVERVIEW_FACTS: ReadonlyArray<{ icon: string; label: string; value: string }> = [
  { icon: 'location_on', label: '位置', value: '宿务市北部 Talamban，离 IT Park 约15分钟车程；步行可到商场、便利店、咖啡店和餐厅' },
  { icon: 'history_edu', label: '创立', value: '2013年，由日本人创办和经营' },
  { icon: 'menu_book', label: '课程', value: 'ESL 五档（LITE 4 到 ULTIMATE 8）、打工度假准备、雅思常规班和12周保分班' },
  { icon: 'home', label: '含住宿', value: '课程价已含校内住宿，按六人房计算；单人房到六人房' },
  { icon: 'rule', label: '管理', value: '半斯巴达：平日下课后可外出，周一至周四单词考试没过或必修课缺席当天不能外出' },
  { icon: 'event_busy', label: '2027旺季', value: '2027/06/27–08/14 共7周，旺季周每周加40美元（读满8周免收）' },
];

export const TARGET_BASIC_INFO: BasicInfoRow[] = [
  { label: '学校', value: 'TARGET Global English Academy（宿务）' },
  { label: '创立', value: '2013年' },
  { label: '位置', value: '菲律宾宿务市 Talamban' },
  { label: '课程', value: 'ESL、打工度假准备、雅思常规班、雅思保分班' },
  { label: '住宿', value: '校内宿舍，单人房到六人房（上下铺）' },
  { label: '入学', value: '周日入住，周一上午入学测试和说明' },
];

export const TARGET_SUITABLE_FOR = [
  '15岁以上、想在安静环境里专心学习的学生',
  '读4周以上、想多上一对一的学生',
  '准备雅思考试、想按学校条件读保分班的学生',
  '准备打工度假、想练英语面试和简历的学生',
  '带6岁以上孩子一起读的家长（LITE 4、TARGET 4）',
];

export const TARGET_NOT_SUITABLE_FOR = [
  '不想遵守单词考试和出勤要求的学生',
  '平日下课后想天天去市中心逛街的学生',
  '想读托福或雅思以外考试课程的学生',
];

/** The campus map of the school brochure; shown as the campus strip in the hero. */
export const TARGET_CAMPUS_BUILDINGS: CampusBuildingCard[] = [
  { code: 'DORM', title: '学生宿舍楼', icon: 'bed', facilities: ['单人房到六人房', '办公室', '医务室'] },
  { code: 'CLASS', title: '教学区', icon: 'school', facilities: ['一对一教室', '小组课教室', '自习室'] },
  { code: 'LIFE', title: '餐厅和小卖部', icon: 'restaurant', facilities: ['学生餐厅', '小卖部', '桌球和乒乓球室'] },
  { code: 'OUT', title: '户外', icon: 'pool', facilities: ['游泳池和户外休息区', '篮球架'] },
];

const campus = (file: string) => `assets/target/campus/${file}.webp`;
const study = (file: string) => `assets/target/study/${file}.webp`;
const life = (file: string) => `assets/target/life/${file}.webp`;
const rooms = (file: string) => `assets/target/rooms/${file}.webp`;
export const TARGET_QUOTE_IMAGE_HERO = '/assets/target/campus/courtyard-01.webp';

export const TARGET_GALLERY_IMAGES: GalleryImage[] = [
  { category: '校园', title: 'TARGET 校园', description: '宿舍楼围着中间的泳池。', src: campus('courtyard-01') },
  { category: '校园', title: '校园中庭', description: '泳池、遮阳伞和户外座位。', src: campus('courtyard-02') },
  { category: '校园', title: '校园一角', description: '宿舍楼前的花园和泳池。', src: campus('courtyard-03') },
  { category: '校园', title: '校园俯瞰', description: '从上方看泳池和户外休息区。', src: campus('pool-aerial') },
  { category: '校园', title: '傍晚的校园', description: '日落时的泳池和宿舍。', src: campus('pool-sunset') },
  { category: '校园', title: '夜晚的校园', description: '晚上亮灯的泳池。', src: campus('pool-night') },
  { category: '校园', title: '宿舍走廊', description: '从宿舍走廊看泳池。', src: campus('balcony-view') },
  { category: '教室', title: '一对一教室', description: '一位老师对一位学生，每节课45分钟。', src: study('one-on-one-booth') },
  { category: '教室', title: '小组课教室', description: '小组课教室。', src: study('group-room-01') },
  { category: '教室', title: '小组课教室', description: '小组课教室。', src: study('group-room-02') },
  { category: '教室', title: '小组课教室', description: '小组课教室。', src: study('group-room-03') },
  { category: '教室', title: '教室', description: '桌椅式教室。', src: study('classroom-01') },
  { category: '教室', title: '教室', description: '桌椅式教室。', src: study('classroom-02') },
  { category: '教室', title: '雅思教材', description: '雅思课程用的 Collins 和 Cambridge 教材，按级别选用。', src: study('ielts-books-01') },
  { category: '教室', title: '雅思教材', description: '听力、口语、阅读和写作分册。', src: study('ielts-books-02') },
  { category: '教室', title: '雅思教材', description: 'Complete IELTS 系列。', src: study('ielts-books-03') },
  { category: '住宿', title: '单人房', description: '一人住一间。', src: rooms('single-01') },
  { category: '住宿', title: '双人房', description: '两张单人床。', src: rooms('twin-01') },
  { category: '住宿', title: '三人房', description: '三张单人床。', src: rooms('triple-01') },
  { category: '住宿', title: '四人房（上下铺）', description: '两组上下铺。', src: rooms('quad-01') },
  { category: '住宿', title: '六人房（上下铺）', description: '三组上下铺，床位有帘子。', src: rooms('six-02') },
  { category: '餐厅', title: '学生餐厅', description: '一日三餐在这里吃。', src: life('dining-hall-01') },
  { category: '餐厅', title: '学生餐厅', description: '宽敞的餐厅。', src: life('dining-hall-02') },
  { category: '餐厅', title: '学生餐厅', description: '餐厅的座位区。', src: life('dining-hall-03') },
  { category: '餐厅', title: '小卖部', description: '日用品、零食和饮料。', src: life('mini-mart-01') },
  { category: '餐厅', title: '小卖部', description: '小卖部的货架。', src: life('mini-mart-02') },
  { category: '设施', title: '游泳池', description: '泳池一般开放到21:30，以学校安排为准。', src: campus('pool-01') },
  { category: '设施', title: '游泳池', description: '池底有 TARGET 字样。', src: campus('pool-02') },
  { category: '设施', title: '泳池边休息区', description: '遮阳伞下的桌椅。', src: campus('pool-03') },
  { category: '设施', title: '泳池边休息区', description: '可以在户外看书、写作业。', src: campus('poolside-study') },
  { category: '设施', title: '泳池', description: '泳池和宿舍楼。', src: campus('pool-04') },
  { category: '设施', title: '户外休息区', description: '泳池旁的座位。', src: campus('poolside') },
  { category: '设施', title: '篮球架', description: '校园里的篮球架。', src: campus('basketball') },
  { category: '设施', title: '桌球和乒乓球室', description: '下课后可以打球。', src: life('game-room-01') },
  { category: '设施', title: '桌球和乒乓球室', description: '乒乓球台和桌球台。', src: life('game-room-02') },
  { category: '设施', title: '桌球', description: '桌球台。', src: life('billiards') },
  { category: '设施', title: '休息区', description: '人造草坪和懒人沙发。', src: life('rest-space') },
];

export const TARGET_ALBUM_DESCRIPTIONS = {
  校园: '泳池中庭、宿舍楼与校园俯瞰',
  教室: '一对一教室、小组课教室与雅思教材',
  住宿: '单人房到六人房',
  餐厅: '学生餐厅与小卖部',
  设施: '游泳池、户外休息区、篮球架与桌球乒乓球室',
} as const;

/** The school's videos, 720p H.264 in public/assets/target/videos/; every frame shows only the school's own logo. */
export const TARGET_SCHOOL_VIDEO: PhVideoItem = {
  title: 'TARGET 学校介绍', text: '学校拍的介绍视频：课堂、宿舍、泳池、餐厅和毕业典礼（英文字幕）。',
  src: '/assets/target/videos/school-intro.mp4', poster: '/assets/target/videos/school-intro.webp', duration: '1:55', shape: 'wide',
};
export const TARGET_CAMPUS_VIDEO: PhVideoItem = {
  title: '校园走一圈', text: '中庭、泳池、餐厅和小卖部、桌球室、办公室和教室。',
  src: '/assets/target/videos/campus-tour.mp4', poster: '/assets/target/videos/campus-tour.webp', duration: '1:00', shape: 'wide',
};

const roomVideo = (id: string, label: string, duration: string): PhVideoItem => ({
  title: `${label}视频`, text: `学校拍的${label}实景。`,
  src: `/assets/target/videos/room-${id}.mp4`, poster: `/assets/target/videos/room-${id}.webp`, duration, shape: 'wide',
});

/** Room videos, keyed by room profile id; each shows exactly that room type. */
export const TARGET_ROOM_VIDEOS: Readonly<Record<string, PhVideoItem>> = {
  single: roomVideo('single', '单人房', '0:21'),
  twin: roomVideo('twin', '双人房', '0:23'),
  triple: roomVideo('triple', '三人房', '0:24'),
  quad: roomVideo('quad', '四人房', '0:23'),
  six: roomVideo('six', '六人房', '0:25'),
};

const numbered = (prefix: string, count: number) => Array.from({ length: count }, (_, index) => rooms(`${prefix}-${String(index + 1).padStart(2, '0')}`));
/** Room fittings of the school brochure; the school allocates the actual room. */
const ROOM_FITTINGS = '书桌椅、置物架、独立卫浴（热水淋浴）、空调、冰箱和吹风机';

export const TARGET_ROOM_PROFILES: PhRoomProfile[] = [
  {
    id: 'single', rateIds: ['single'], label: '单人房', location: '校内', bed: '单人床',
    suitable: '想要自己的空间、作息安静的学生', note: '单人房和双人房是同一种房间，一人住；房间以学校安排为准。',
    highlights: [ROOM_FITTINGS],
    image: rooms('single-01'), gallery: numbered('single', 2), imageAlt: 'TARGET 单人房实景',
  },
  {
    id: 'twin', rateIds: ['twin'], label: '双人房', location: '校内', bed: '两张单人床',
    suitable: '和朋友、家人同住，或想要一位室友的学生', note: '室友由学校安排；同行的朋友或家人可以申请同住。',
    highlights: [ROOM_FITTINGS],
    image: rooms('twin-01'), gallery: numbered('twin', 4), imageAlt: 'TARGET 双人房实景',
  },
  {
    id: 'triple', rateIds: ['triple'], label: '三人房', location: '校内', bed: '三张单人床',
    suitable: '预算和空间都想兼顾的学生', note: '学校介绍三人房都带阳台，采光和通风较好。',
    highlights: [ROOM_FITTINGS, '房间带阳台'],
    image: rooms('triple-01'), gallery: numbered('triple', 3), imageAlt: 'TARGET 三人房实景',
  },
  {
    id: 'quad', rateIds: ['quad'], label: '四人房（上下铺）', location: '校内', bed: '两组上下铺，床位有帘子',
    suitable: '预算优先、能接受上下铺的学生', note: '上下铺带帘子，保留个人空间；上铺还是下铺由室友商量决定。',
    highlights: [ROOM_FITTINGS],
    image: rooms('quad-01'), gallery: numbered('quad', 5), imageAlt: 'TARGET 四人房实景',
  },
  {
    id: 'six', rateIds: ['six'], label: '六人房（上下铺）', location: '校内', bed: '三组上下铺，床位有帘子和灯',
    suitable: '预算最优先的学生', note: '课程价按六人房计算；上铺还是下铺由室友商量决定。',
    highlights: [ROOM_FITTINGS],
    image: rooms('six-02'), gallery: [rooms('six-02'), rooms('six-01'), rooms('six-03'), rooms('six-04'), rooms('six-05'), rooms('six-06')], imageAlt: 'TARGET 六人房实景',
  },
];

/** From the school rules (in force from 2025/09/01) and the welcome sheet; the school gives the full rules on arrival. */
export const TARGET_DORM_RULES = [
  { title: '入住和退房', text: '周日至周一早上06:00入住（按抵达宿务机场的时间），周六12:00前退房；提前入住或延住原则上前后各限1天，须提前预约。' },
  { title: '门禁', text: '成人周一至周四和周日23:00，节假日前一晚不限；未成年人（含高中生）22:00；早上06:00开门。' },
  { title: '外出和外宿', text: '外出时向警卫出示学生证并登记；上课时间不能外出。外宿原则上只限节假日前一晚，须在办公时间申请。未成年人原则上不能单独外出。' },
  { title: '喝酒和吸烟', text: '校内不能喝酒或带酒；只能在大门前的指定区域吸烟。未满18岁（含高中生）喝酒或吸烟会被退学。' },
  { title: '安静时间', text: '晚上10点到早上6点全校保持安静；23:00以后不要放音乐。' },
  { title: '半斯巴达', text: '周一至周四的单词考试没过或没参加，或必修课缺席，当天不能外出；出勤率低于90%时学校会约谈。' },
  { title: '违纪积分', text: '违反校规会记1–2分，累计到5分退学；未成年人喝酒吸烟、打架、盗窃等严重违规一次就退学，被退学不退款。' },
  { title: '房间', text: '只能选房型，不能指定房间；不能进入他人宿舍，也不能带外人进校。' },
];

/**
 * A weekday reference timetable. The school's files give the meal times and the IELTS weekly table, not the clock times
 * of each class; subjects in the IELTS column are the school's example and follow the level test.
 */
export const TARGET_SCHEDULE: DailyScheduleRow[] = [
  { time: '07:30–09:00', activity: '早餐', kind: 'meal' },
  { time: '上午', activity: '第1–4节（一对一、小组课或自习，按所选课程排）', kind: 'class' },
  { time: '12:30–13:30', activity: '午餐', kind: 'meal' },
  { time: '下午', activity: '第5–8节（按所选课程排；空堂自由安排）', kind: 'class' },
  { time: '18:00–19:00', activity: '晚餐', kind: 'meal' },
  { time: '晚上', activity: '英语活动和主题夜间课（自愿参加）', kind: 'activity' },
  { time: '22:00／23:00', activity: '门禁：未成年人22:00，成人23:00', kind: 'free' },
];

export const TARGET_IELTS_SCHEDULE: DailyScheduleRow[] = [
  { time: '第1–4节', activity: '一对一：口语、听力、阅读、写作（周一至周五）', kind: 'class' },
  { time: '第5节', activity: '一对一：单词（周一至周四）', kind: 'class' },
  { time: '第6–7节', activity: '小组课：发音小组、ESL小组（ESL小组可改自习）', kind: 'class' },
  { time: '第8节', activity: '必修自习', kind: 'activity' },
  { time: '周五第5–8节', activity: '雅思模考，老师给反馈', kind: 'test' },
  { time: '每天', activity: '单词测试；课后作业约2–3小时', kind: 'test' },
];

export const TARGET_COURSE_DETAIL_GUIDES: CourseDetailGuide[] = [
  {
    icon: 'forum',
    title: 'ESL 课程：按一对一节数分档',
    subtitle: 'LITE 4、TARGET 4／5／6、ULTIMATE 8 和打工度假准备',
    courseIds: ['lite4', 'target4', 'target5', 'working-holiday', 'target6', 'ultimate8'],
    facts: [
      { label: '一节课', value: '45分钟' },
      { label: '一对一', value: '按你的目标组合内容，例如综合英语、TOEIC、商务英语、旅游英语和打工度假准备；有特殊方向的学生请自备教材' },
      { label: '小组课', value: '和同学一起练表达；人数和老师由学校安排' },
      { label: '亲子课程', value: 'LITE 4 和 TARGET 4 可报亲子课程，孩子须6岁以上；小组课没有足够同学时，学校改上同样节数的一对一' },
    ],
    points: ['具体上哪些科目、用哪本教材和哪位老师，由学校在入学测试后安排。'],
  },
  {
    icon: 'school',
    title: '雅思常规班和12周保分班',
    subtitle: '两种班都可以每周入学',
    courseIds: ['ielts-regular', 'ielts-guarantee'],
    facts: [
      { label: '入学水平', value: '需雅思3.5左右的英语水平，抵达后做雅思预备测试确认；没达到时可能先上ESL课程，差价在当地退还' },
      { label: '每周', value: '每周五模考并给反馈，按入学测试和模考结果调整课程和作业；每天单词测试，作业约2–3小时' },
      { label: '教材', value: '按水平选用 Collins 和 Cambridge 的雅思教材，也有补充和自编教材；进度需要时可能另买教材' },
      { label: '保分班', value: '学12周；第10周参加官方雅思机考，考试费由学校承担' },
      { label: '保分条件', value: '入学时提供官方成绩单；课程出勤率和作业提交率都达到95%以上；遵守校规（违反即取消保分资格）；每日单词测试出勤率95%以上、合格率80%以上' },
      { label: '保分内容', value: '按学校规定：雅思4.0提升到5.0、4.5提升到5.5、5.0提升到6.0；未达到时可免学费再读4周，住宿费和签证费等另付' },
    ],
    points: ['保分班延期住宿费每4周：单人房950、双人房690、三人房590、四人房530、六人房450美元（以学校确认为准）。'],
  },
  {
    icon: 'event_available',
    title: '短期学习和节假日',
    subtitle: '所有课程',
    facts: [
      { label: '短期', value: '读两周以内的学生，入学日下午就开始上课' },
      { label: '节假日', value: '读两周以内的学生，菲律宾国定假日学校最多安排6节一对一，不另收费（部分特殊日期除外）' },
      { label: '加课', value: '周末和国定假日可以加一对一，每天最多6小时，每小时700比索' },
    ],
    points: [],
  },
  {
    icon: 'rule',
    title: '入学、出勤和夜间活动',
    subtitle: '所有课程',
    facts: [
      { label: '第一天', value: '周一上午入学测试；带文具、护照、电子机票和换钱的收据' },
      { label: '出勤', value: '迟到或缺席要提前告诉办公室；出勤率低于90%时学校会约谈' },
      { label: '夜间活动', value: '平日下课后自愿参加的英语活动和主题课（发音、会话、英文游戏、基础语法等），内容由学校安排' },
      { label: '典礼', value: '新生介绍和毕业典礼要参加，请准备简单的英文发言' },
    ],
    points: [],
  },
];

export const TARGET_PRACTICAL_GUIDES: CampusPracticalGuide[] = [
  {
    icon: 'restaurant',
    eyebrow: 'MEALS & HOURS',
    title: '用餐与开放时间',
    facts: [
      { label: '平日', value: '早餐07:30–09:00，午餐12:30–13:30，晚餐18:00–19:00' },
      { label: '周末和假日', value: '早午餐约10:00–12:00或10:30–13:00，晚餐约17:30–19:00；国定假日只供早午餐' },
      { label: '餐食', value: '学校一般提供日式、中式、菲式和泰式的单人份餐，含主食、蔬菜、汤和水果或甜点' },
      { label: '设施', value: '泳池等设施一般开放到21:30，自习室24小时开放' },
    ],
    note: '用餐和开放时间以学校当时的安排为准。',
  },
  {
    icon: 'cleaning_services',
    eyebrow: 'SCHOOL SERVICES',
    title: '洗衣、打扫和小卖部',
    facts: [
      { label: '洗衣', value: '每次150比索（6公斤），每周最多送洗3次' },
      { label: '打扫', value: '学校安排房间清洁' },
      { label: '小卖部', value: '日用品、零食、饮料、咖啡和简餐' },
      { label: '网络', value: '公共区域有Wi-Fi；宿舍原则上不提供，建议办本地电话卡' },
    ],
    note: '学校的换钱汇率通常比市区高，周一说明会可以换钱；出发前可少量准备比索现金。',
  },
  {
    icon: 'badge',
    eyebrow: 'VISA & PASSPORT',
    title: '签证与护照',
    facts: [
      { label: 'SSP', value: '新生入学时由学校代办SSP和E-CARD' },
      { label: '续签', value: '超过入境签证天数要在当地续签，学校代办；第一次续签时办ACR I-CARD' },
      { label: '超过24周', value: '另付5,000比索离境清关费' },
      { label: '学杂费', value: '到校后用比索现金交' },
    ],
    note: '入境和签证材料由思达启航顾问逐项帮你核对；eTravel入境登记也由顾问协助填写。',
  },
  {
    icon: 'flight',
    eyebrow: 'BEFORE YOU GO',
    title: '出发前准备',
    facts: [
      { label: '航班', value: '提前把航班告诉学校；没告知或改了航班没通知，学校无法接机' },
      { label: '接机', value: '宿务机场接机1,200比索（周日08:00–24:00到达），其他时段另加1,000比索' },
      { label: '贵重物品', value: '学校不代管贵重物品，请锁在行李箱里；饮用校内饮水机的水' },
      { label: '健康', value: '有慢性病、过敏等情况，报名时要书面告诉学校' },
    ],
    note: '学校离 IT Park 约15分钟车程；周边步行可到商场、便利店和餐厅。',
  },
];

/**
 * The school's cancellation and refund rules (school rules, section B). The first group is 思达启航's own rule, the same
 * words on every page; the 2,000-yuan deposit is 思达启航's, the school's rules cover what was paid to the school.
 */
export const TARGET_REFUND_COPY = {
  summaryTitle: 'TARGET 定金、改期与退款',
  summaryHint: '报名定金、开课前取消和到校后退款',
  eyebrow: 'CANCELLATION & REFUND',
  title: 'TARGET 定金与退款',
  intro: '报名定金由思达启航收取；已交给学校的费用按学校的退款规定办理，注册费在任何情况下都不退，银行手续费由学生承担。',
  alert: '报名前请确认',
  groups: [
    {
      title: '报名与入学前',
      note: '',
      rules: [
        { when: '报名定金', text: '通过思达启航报名时预收定金2,000元人民币，为学生向学校订位；定金交了以后不退。' },
        { when: '改期与保留', text: '入学4周前告诉顾问，可以免费改入学日期，或申请把定金保留1年。' },
      ],
      footnote: '',
    },
    {
      title: '开课前取消（已交学校的课程和住宿费）',
      note: '开课日按入住日和入学日中较早的一天算。',
      rules: [
        { when: '开课15天以前', text: '退还100%。' },
        { when: '开课8–14天前', text: '退还70%。' },
        { when: '开课前7天到前一天', text: '课程8周及以内退还50%；9周及以上退还70%。' },
        { when: '开课14天以内改行程', text: '学校收改期手续费；只延长学习期间的不收。' },
      ],
      footnote: '',
    },
    {
      title: '到校以后',
      note: '按剩余周数分段计算，不足1周不计；退款＝A＋B＋C。',
      rules: [
        { when: 'A：剩余周数中的前4周', text: '不退。' },
        { when: 'B：剩余的第5–12周', text: '退还50%。' },
        { when: 'C：剩余的第13周以后', text: '退还70%。' },
        { when: '休学', text: '不退款，可保留1年内重新入学的权利，复学时继续用剩余课程；1年内没复学或放弃复学时，按申请休学时的退款规定办理。' },
        { when: '被学校退学', text: '违反校规或法律被退学的不退款；因疾病或受伤无法继续、学校认可的，按正常退款规定办理。' },
      ],
      footnote: TARGET_REFERENCE_NOTE,
    },
  ],
};

/**
 * Weekday school holidays of TARGET's 2027 schedule (as of 2026/11/19); holidays on a weekend (2/6 春节, 3/27, 5/1,
 * 6/12, 8/21, 12/25) are left out. Some holidays move to a Friday, as the school's own column gives them.
 */
export const TARGET_HOLIDAY_CALENDARS: HolidayCalendar[] = [
  {
    year: 2027,
    label: '规划2027年入学时优先查看',
    months: [
      { month: 1, holidays: [{ day: '1日', name: '元旦' }] },
      { month: 2, holidays: [{ day: '26日', name: '宿务市建市纪念日（原24日）', provisional: true }] },
      {
        month: 3,
        holidays: [
          { day: '5日', name: 'EDSA人民力量革命纪念日（原2月25日）' },
          { day: '25日', name: '濯足节' },
          { day: '26日', name: '耶稣受难日' },
        ],
      },
      { month: 4, holidays: [{ day: '9日', name: '勇士日' }] },
      { month: 8, holidays: [{ day: '6日', name: '宿务省建省纪念日、奥斯梅尼亚日', provisional: true }] },
      { month: 9, holidays: [{ day: '3日', name: '国家英雄日（原8月30日）' }] },
      {
        month: 11,
        holidays: [
          { day: '1日', name: '万圣节（新生说明会照常在周一）' },
          { day: '2日', name: '万灵节' },
        ],
      },
      {
        month: 12,
        holidays: [
          { day: '3日', name: '博尼法西奥日（原11月30日）' },
          { day: '10日', name: '圣母无原罪节（原8日）' },
          { day: '24日', name: '平安夜' },
          { day: '30日', name: '黎刹日' },
          { day: '31日', name: '除夕' },
        ],
      },
    ],
  },
];

export const TARGET_HOLIDAY_FOOTNOTE = '只列出周一至周五的学校假日；开斋节日期待政府公布，政府也可能增加或调整假日。标“待定”的是传统上放假的日子。国定假日只供早午餐。';

export const TARGET_FAQS: FaqItem[] = [
  { question: 'TARGET 的价格包含什么？', answer: '课程价已含课程和校内住宿，按六人房计算；住其他房型每4周加80到500美元。另交一次性注册费150美元（复课生免收）。到校后的签证、SSP、水电和管理费、教材费用比索现金另付。' },
  { question: '现在报名有什么优惠？', answer: '学校长期优惠：读3周每周减20美元，4–11周每周减30美元，12周及以上每周减35美元，旺季的周不减。通过思达启航报名，课程＋住宿（和旺季附加费）减去学校优惠后再打9折。报价器会按你的日期自动计算。' },
  { question: '限时尊享升级计划怎么用？', answer: '2026年11月30日前报名、2026年8月23日至2027年4月4日入学，读TARGET 4、TARGET 5或TARGET 6：读4周以上免费升1档课程，读8周以上再免费升1档房型，读12周以上另外二选一：最后4周升ULTIMATE 8或雅思课程，或免费参加2次周末旅游。只适用于整段读同一种课程，拼不同课程不能升级（例如8周TARGET 6＋4周TARGET 4，最后4周不能升级）。房型按学校当时空房安排，名额有限、额满即止，可以和学校长期优惠同时享受。', until: TARGET_UPGRADE_OFFER.hideFrom },
  { question: '2027年旺季要加钱吗？', answer: '2027年6月27日至8月14日共7周是旺季，旺季里的每一周加40美元，只按实际落在旺季的周数算；全部课程读满8周及以上免收旺季附加费。旺季的周没有学校长期优惠。8月15日起入学不算旺季。' },
  { question: '雅思保分班怎么保分？', answer: '保分班学12周，第10周参加官方雅思机考，考试费由学校承担。须入学时提供官方成绩单，出勤率和作业提交率都在95%以上，遵守校规，每日单词测试出勤95%以上、合格率80%以上。学校的保分内容是：雅思4.0到5.0、4.5到5.5、5.0到6.0；未达到时可免学费再读4周，住宿费和签证费等另付。' },
  { question: '半斯巴达是什么意思？', answer: '平日下课后可以外出，但周一至周四的单词考试没过或没参加、必修课缺席，当天不能外出。门禁成人23:00（节假日前一晚不限），未成年人22:00。' },
  { question: '到校学杂费大概多少？', answer: '主要是SSP 7,800和E-CARD 4,500比索（只办一次），水电和管理费每周1,300比索，教材4周约2,000比索；读超过入境签证天数要续签，第一次续签时办ACR I-CARD 4,300比索。押金2,500比索退房时退。报价器会按你的周数和签证算出明细。' },
  { question: '孩子可以来读吗？', answer: '学校的学生一般是15岁以上。家长陪同时，6岁以上的孩子可以报 LITE 4 或 TARGET 4 的亲子课程。独自留学的未成年人（含18岁高中生）每周另收2,000比索安心服务费，门禁22:00，原则上不能单独外出。' },
  { question: '思达启航会协助签证和入境吗？', answer: '会。通过思达启航报名，顾问会免费协助菲律宾入境和签证相关手续，你只需要按顾问指引准备个人资料。' },
];

export const TARGET_FINAL_CTA_BADGES = ['免费选校建议', '确认空房和优惠', '签证与入境协助'];

/** Offer cards above the quote; the upgrade card hides from the day after its registration deadline. */
export const TARGET_OFFERS: PhOfferCard[] = [
  {
    icon: 'upgrade', title: '限时尊享升级计划', amount: '免费升级课程和房型',
    text: '2026年11月30日前报名、2026年8月23日至2027年4月4日入学，读TARGET 4／5／6：4周以上升1档课程，8周以上再升1档房型，12周以上另选最后4周升ULTIMATE 8或雅思、或2次周末旅游。',
    detail: '只适用于整段读同一种课程；房型按空房安排，名额有限、额满即止；可和学校长期优惠同时享受。',
    until: TARGET_UPGRADE_OFFER.hideFrom, promotionIds: ['target-upgrade'],
  },
  {
    icon: 'sell', title: '学校长期优惠', amount: '每周减20–35美元',
    text: '读3周每周减20美元，4–11周每周减30美元，12周及以上每周减35美元。',
    detail: '旺季的周（2027/06/27–08/14）不减。', promotionIds: ['target-campaign'],
  },
];

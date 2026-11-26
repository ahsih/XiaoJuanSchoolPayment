// Text and data of the HELP Clark page, from HELP's Google Drive pack received 2026-11-24 (2025 Chinese brochure,
// 2025 agency handbook, Clark student handbook, family camp and 2027 junior camp brochures, 2026 admission calendar,
// pickup sheet, photos and videos). The Baguio material in the same pack is not used. The shared Philippine school
// template reads this module through help-page-profile.ts. Keep it pure data (no Angular, DOM or storage), so the
// WeChat mini program can reuse it. Never add the school's phone, email, address, website, social accounts or its
// nationality chart, and never the agency commission or the junior camp's group prices and lead flights.
import type {
  BasicInfoRow,
  CampusBuildingCard,
  CampusPracticalGuide,
  CourseDetailGuide,
  DailyScheduleRow,
  FaqItem,
  GalleryImage,
} from '../cia-school/cia-page-content';
import type { PhRoomProfile, PhVideoItem } from '../school-page/ph-school-profile';
import { SCHOOL_REFERENCE_NOTE } from '../school-page/school-reference-note';

/** Closes every content section once; the same line as on every Philippine school page. */
export const HELP_REFERENCE_NOTE = SCHOOL_REFERENCE_NOTE;

export const HELP_PAGE_TEXT = {
  heroLead: 'HELP 1996年创立，克拉克校区2011年开办，在原美军基地改建的克拉克自由港区内。斯巴达管理，平日不外出，每天4–5节一对一，适合想集中学英语、考雅思或托业的学生，也有带孩子来的亲子营。',
  advisorText: 'HELP 克拉克是管得严的斯巴达学校：周一至周五不能外出，校内只说英语，每天有早读课、单词测试和晚自习。一对一多，适合自制力一般、想在短时间内集中提高的成人；雅思和托业按入学成绩分级。校园在克拉克自由港区，离克拉克机场近，有游泳池、健身房和有顶棚的球场。学校按固定开课日入学，带孩子的家庭可以报亲子营。',
  campusIntro: '一栋三层主楼：1楼是办公室、教室、学生餐厅、小卖部和多功能厅，2楼和3楼是宿舍和医务室；户外有游泳池、有顶棚的球场和后院休息区。',
  galleryIntro: '按区域查看校园、教室、住宿、餐厅和设施；相册内用左右箭头或缩略图切换，点击主图可放大。',
  coursesIntro: '按学习目标分组，每门课下面是每天的课时；点开可看适合人群和说明。每节课40分钟。',
  roomsPhotoIntro: '点选房型查看实景；照片和视频是学校2026年提供的新房间。单人间暂时没有照片。',
  finalCtaTitle: '想确认 HELP 克拉克的开课日、空房和优惠？',
  finalCtaText: '告诉顾问你的入学日期、周数、课程和想住的房型，我们帮你确认开课日和房间，并做一份完整报价。',
} as const;

export const HELP_QUICK_INFO = [
  { icon: 'location_on', title: '克拉克自由港区', text: '原美军基地改建，离克拉克国际机场近' },
  { icon: 'verified', title: '斯巴达管理', text: '平日不外出，校内只说英语' },
  { icon: 'record_voice_over', title: '一对一多', text: '每天4–5节一对一，另有小组课和早读课' },
  { icon: 'workspace_premium', title: '雅思和托业', text: '按入学成绩分基础、中级和高级' },
  { icon: 'event', title: '固定开课日', text: '2026年每两周一次，周日入住、周一开课' },
  { icon: 'family_restroom', title: '亲子营', text: '3–6岁幼儿园和7岁以上孩子课程' },
];

/** Key facts under the hero title (compact layout); what each floor has is in HELP_CAMPUS_FLOORS. */
export const HELP_OVERVIEW_FACTS: ReadonlyArray<{ icon: string; label: string; value: string }> = [
  { icon: 'location_on', label: '位置', value: '邦板牙省克拉克自由港区（原美军基地），离克拉克国际机场近，马尼拉以北约95公里' },
  { icon: 'rule', label: '管理', value: '斯巴达：周一至周五不外出，周六06:00–24:00、周日06:00–22:00可外出；校内只说英语' },
  { icon: 'menu_book', label: '课程', value: 'ESL、密集ESL、商务英语、雅思、托业和亲子营' },
  { icon: 'apartment', label: '规模', value: '约1万平方米，130间一对一教室，可住约220名学生，约105位老师' },
  { icon: 'event', label: '入学', value: '固定开课日，2026年每两周一次（周日入住、周一开课）' },
  { icon: 'bed', label: '住宿', value: '校内单人间到四人间，房内有卫生间' },
];

export const HELP_BASIC_INFO: BasicInfoRow[] = [
  { label: '学校', value: 'HELP English 克拉克校区' },
  { label: '创立', value: 'HELP 1996年创立，克拉克校区2011年开办' },
  { label: '位置', value: '菲律宾邦板牙省克拉克自由港区' },
  { label: '管理方式', value: '斯巴达管理，平日不外出' },
  { label: '课程', value: 'ESL、密集ESL、商务英语、雅思、托业、亲子营' },
  { label: '住宿', value: '校内单人间、双人间、三人间、四人间' },
  { label: '入学', value: '固定开课日，周日入住、周一开课' },
];

export const HELP_SUITABLE_FOR = [
  '自制力一般、想被管着集中学习的学生',
  '想多上一对一、短期内提高口语的成人',
  '准备雅思或托业考试的学生',
  '带3岁以上孩子来读书的家长',
];

export const HELP_NOT_SUITABLE_FOR = [
  '想平日下课后自由外出的学生',
  '想边学习边度假的学生',
  '旺季（1、2、6、7、8月）想单独来读成人课程的未满18岁学生',
];

/** What each floor has (2025 brochure, Clark handbook); shown as the campus strip in the hero. */
export const HELP_CAMPUS_FLOORS: CampusBuildingCard[] = [
  { code: '1F', title: '1楼', icon: 'school', facilities: ['办公室和前台', '一对一和小组教室', '学生餐厅和小卖部', '多功能厅'] },
  { code: '2F', title: '2楼', icon: 'bed', facilities: ['学生宿舍', '医务室'] },
  { code: '3F', title: '3楼', icon: 'bed', facilities: ['学生宿舍'] },
  { code: 'OUT', title: '户外和其他', icon: 'pool', facilities: ['游泳池', '有顶棚的球场', '健身房', '咖啡厅和学生厨房'] },
];

const campus = (file: string) => `assets/help-clark/campus/${file}.webp`;
const rooms = (file: string) => `assets/help-clark/rooms/${file}.webp`;
export const HELP_QUOTE_IMAGE_HERO = '/assets/help-clark/campus/main-building.webp';

export const HELP_GALLERY_IMAGES: GalleryImage[] = [
  { category: '校园', title: 'HELP 克拉克主楼', description: '三层主楼，教室、餐厅和宿舍都在楼里。', src: campus('main-building') },
  { category: '校园', title: '学校招牌', description: '校门口的 HELP English 招牌。', src: campus('school-sign') },
  { category: '校园', title: '主楼前院', description: '主楼前的绿地和车道。', src: campus('front-yard') },
  { category: '校园', title: '主楼前院', description: '主楼前的车道。', src: campus('school-bus') },
  { category: '校园', title: '大厅和前台', description: '1楼大厅，办手续、报修都在前台。', src: campus('lobby-01') },
  { category: '校园', title: '大厅', description: '1楼大厅的另一侧。', src: campus('lobby-02') },
  { category: '校园', title: '学生休息区', description: '下课后休息、聊天的地方。', src: campus('lounge-01') },
  { category: '校园', title: '学生休息区', description: '绿植墙和桌椅。', src: campus('lounge-02') },
  { category: '校园', title: '学生休息区', description: '休息区全景。', src: campus('lounge-03') },
  { category: '校园', title: '后院', description: '主楼后院的户外桌椅。', src: campus('backyard-01') },
  { category: '校园', title: '后院', description: '有遮阳棚的户外座位。', src: campus('backyard-02') },
  { category: '校园', title: '后院', description: '从后院看主楼。', src: campus('backyard-03') },
  { category: '教室', title: '教室走廊', description: '一对一教室沿走廊排开。', src: campus('class-hallway') },
  { category: '教室', title: '一对一教室', description: '每节课40分钟。', src: campus('class-one-to-one') },
  { category: '教室', title: '一对一教室', description: '一位老师对一位学生。', src: campus('class-one-to-one-02') },
  { category: '教室', title: '新教室', description: '新装修的教室。', src: campus('class-doors') },
  { category: '教室', title: '多功能厅', description: '早读课、特别课和活动在多功能厅上。', src: campus('hall-01') },
  { category: '教室', title: '多功能厅', description: '另一间多功能厅。', src: campus('hall-02') },
  { category: '教室', title: '多功能厅', description: '长桌布置的多功能厅。', src: campus('hall-03') },
  { category: '住宿', title: '双人间', description: '2026年的新房间。', src: rooms('twin-01') },
  { category: '住宿', title: '三人间', description: '2026年的新房间。', src: rooms('triple-01') },
  { category: '住宿', title: '四人间', description: '2026年的新房间。', src: rooms('quad-01') },
  { category: '餐厅', title: '学生餐厅', description: '平日三餐；周末和假日是早午餐和晚餐，周六没有晚餐。', src: campus('dining-01') },
  { category: '餐厅', title: '学生餐厅', description: '靠墙的吧台座位。', src: campus('dining-02') },
  { category: '餐厅', title: '学生餐厅', description: '用餐区。', src: campus('dining-03') },
  { category: '餐厅', title: '学生餐厅', description: '用餐区的另一侧。', src: campus('dining-04') },
  { category: '餐厅', title: '咖啡厅', description: '校内咖啡厅。', src: campus('cafe') },
  { category: '餐厅', title: '咖啡厅', description: '咖啡和甜点。', src: campus('coffee') },
  { category: '设施', title: '游泳池', description: '平日20:15–22:00，周末10:00–22:00开放。', src: campus('pool-01') },
  { category: '设施', title: '游泳池', description: '泳池有顶棚。', src: campus('pool-02') },
  { category: '设施', title: '有顶棚的球场', description: '篮球和排球，球可以免费借。', src: campus('court-01') },
  { category: '设施', title: '有顶棚的球场', description: '下雨天也能运动。', src: campus('court-02') },
  { category: '设施', title: '健身房', description: '平日06:00–09:00和16:00–22:40，周末10:00–20:00开放。', src: campus('gym-01') },
  { category: '设施', title: '健身房', description: '器械区。', src: campus('gym-02') },
  { category: '设施', title: '小卖部', description: '零食、饮料和日用品。', src: campus('store-01') },
  { category: '设施', title: '小卖部', description: '零食货架。', src: campus('store-02') },
  { category: '设施', title: '学生厨房', description: '06:00–22:00开放，用后自己打扫。', src: campus('kitchen-01') },
  { category: '设施', title: '学生厨房', description: '电磁炉和厨具。', src: campus('kitchen-02') },
  { category: '设施', title: '脱水机', description: '手洗衣物后可以用脱水机甩干。', src: campus('spinner') },
];

export const HELP_ALBUM_DESCRIPTIONS = {
  校园: '主楼、大厅、休息区与后院',
  教室: '一对一教室与多功能厅',
  住宿: '双人间、三人间与四人间',
  餐厅: '学生餐厅与咖啡厅',
  设施: '游泳池、球场、健身房、小卖部与厨房',
} as const;

const video = (name: string) => `/assets/help-clark/videos/${name}.mp4`;
const poster = (name: string) => `/assets/help-clark/videos/${name}-poster.jpg`;

/**
 * HELP's own clips (Drive pack 2026-11-24), 720p H.264 in public/assets/help-clark/videos/. The campus tour had a
 * gate shot with other companies' signs, which was cut out; its ending shows only the school logo.
 */
export const HELP_CAMPUS_TOUR: PhVideoItem = {
  title: '校园导览（2024年）', text: '学校2024年拍的校园导览；宿舍画面是当时的房间，新房间见住宿部分。',
  src: video('campus-tour-2024'), poster: poster('campus-tour-2024'), duration: '1:37', shape: 'wide',
};

/**
 * From HELP's own YouTube channels (2026-11-25), Clark campus only. The student-day vlog is whole; the junior-camp
 * recap lost its airline-wing opening, the shots of a visiting group in orange uniform T-shirts with another
 * organisation's logo, the water-park and bowling-alley shots (venue branding) and its uniform-group ending.
 */
export const HELP_STUDENT_DAY: PhVideoItem = {
  title: '学员的一天（2024年）', text: '一位越南学员拍的一天：一对一和小组课、午餐、特别课、自习、单词测试和宿舍；字幕是越南语。',
  src: video('student-day-2024'), poster: poster('student-day-2024'), duration: '3:35', shape: 'wide',
};

export const HELP_JUNIOR_CAMP: PhVideoItem = {
  title: '青少年营回顾（2026年）', text: '2026年青少年营：上课、体育和游泳、英语演讲、户外活动和结业；每年的营期安排以学校当年通知为准。',
  src: video('junior-camp-2026'), poster: poster('junior-camp-2026'), duration: '1:14', shape: 'wide',
};

export const HELP_ROOM_VIDEOS: Readonly<Record<string, PhVideoItem>> = {
  'room-2': { title: '双人间', text: '2026年的新双人间。', src: video('room-2'), poster: poster('room-2'), duration: '0:58', shape: 'wide' },
  'room-3': { title: '三人间', text: '2026年的新三人间。', src: video('room-3'), poster: poster('room-3'), duration: '0:59', shape: 'wide' },
  'room-4': { title: '四人间', text: '2026年的新四人间。', src: video('room-4'), poster: poster('room-4'), duration: '0:48', shape: 'wide' },
};

const ROOM_SERVICE = '每周打扫2次，每2周换床单；洗衣每周3次';
const numbered = (prefix: string, count: number) => Array.from({ length: count }, (_, index) => rooms(`${prefix}-${String(index + 1).padStart(2, '0')}`));

/** Photos only from HELP's “new rooms” folders (2026), each matching its room type. Room for 1 has none yet. */
export const HELP_ROOM_PROFILES: PhRoomProfile[] = [
  {
    id: 'room-2', rateIds: ['room-2'], label: '双人间', location: '校内', bed: '两张单人床', service: ROOM_SERVICE,
    suitable: '朋友同行或想兼顾预算的学生', note: '两张床之间有隔板，房内有卫生间。',
    highlights: ['书桌、置物架和空调', '独立卫生间'],
    image: rooms('twin-01'), gallery: numbered('twin', 6), imageAlt: 'HELP克拉克双人间实景',
  },
  {
    id: 'room-3', rateIds: ['room-3'], label: '三人间', location: '校内', bed: '三张单人床', service: ROOM_SERVICE,
    suitable: '想控制预算的学生', note: '三张床，房内有卫生间。',
    highlights: ['书桌、置物架和空调', '独立卫生间'],
    image: rooms('triple-01'), gallery: numbered('triple', 6), imageAlt: 'HELP克拉克三人间实景',
  },
  {
    id: 'room-4', rateIds: ['room-4'], label: '四人间', location: '校内', bed: '四张单人床', service: ROOM_SERVICE,
    suitable: '预算优先、喜欢热闹的学生', note: '四张床，房内有卫生间。',
    highlights: ['书桌、衣架和空调', '独立卫生间'],
    image: rooms('quad-01'), gallery: numbered('quad', 6), imageAlt: 'HELP克拉克四人间实景',
  },
];

export const HELP_DORM_RULES = [
  { title: '外出', text: '周一至周五不能外出；周六06:00–24:00、周日06:00–22:00可以外出，出校门时把学生证交给门卫。' },
  { title: '门禁', text: '周五、周六24:00，周日至周四22:00查寝；23:00全楼关灯锁门，学生须在自己房间。亲子营家庭22:00门禁。' },
  { title: '外宿和旅行', text: '入学第一周不能外宿或旅行；旅行只能在假期，周四20:00前交旅行计划，回来后交目的地照片。' },
  { title: '只说英语', text: '1楼和教室里只说英语，说其他语言每次罚款50比索。' },
  { title: '禁止事项', text: '校内禁止喝酒；房间内禁止吸烟和煮食；不能进入其他学生的房间；23:00后不能叫外卖，外卖在公共区域吃。' },
  { title: '换房', text: '入住4周后，有空房时可以向经理申请换房。' },
  { title: '赔偿', text: '丢失钥匙750比索；损坏照价赔偿，例如椅子1,000、门窗或镜子2,000、洗手盆3,000、床4,000比索。' },
  { title: '处罚', text: '违反规定会罚款或禁足；禁足累计4周会被退学。' },
];

/** The Clark weekday timetable of the 2025 agency handbook (ESL, 4 one-to-one classes); classes are 40 minutes. */
export const HELP_SCHEDULE: DailyScheduleRow[] = [
  { time: '07:00–08:00', activity: '早餐', kind: 'meal' },
  { time: '07:45–08:25 / 08:30–09:10', activity: '早读课（两个时段二选一）', kind: 'class' },
  { time: '09:20–10:00', activity: '第1节一对一', kind: 'class' },
  { time: '10:10–10:50', activity: '第2节一对一', kind: 'class' },
  { time: '11:00–11:40', activity: '第1节小组课', kind: 'class' },
  { time: '11:40–13:05', activity: '午餐', kind: 'meal' },
  { time: '13:15–13:55', activity: '第3节一对一', kind: 'class' },
  { time: '14:05–14:45', activity: '自习', kind: 'free' },
  { time: '14:55–15:35', activity: '第4节一对一', kind: 'class' },
  { time: '15:45–16:25', activity: '第2节小组课', kind: 'class' },
  { time: '16:35–17:15', activity: '特别课（周一至周四）', kind: 'class' },
  { time: '17:15–18:00', activity: '晚餐', kind: 'meal' },
  { time: '19:00–20:00', activity: '晚自习（必须参加）', kind: 'activity' },
  { time: '20:00–20:30', activity: '单词测试', kind: 'test' },
  { time: '21:00–22:00', activity: '晚自习（必须参加）', kind: 'activity' },
];

export const HELP_COURSE_DETAIL_GUIDES: CourseDetailGuide[] = [
  {
    icon: 'workspace_premium',
    title: '雅思和托业：分级与模考',
    subtitle: '按入学成绩分基础、中级和高级',
    courseIds: ['ielts-basic', 'ielts-advanced', 'toeic-basic', 'toeic-advanced'],
    facts: [
      { label: '雅思入学', value: '基础约3.5分，中级约4.5分，高级约5.5分；低于3.0分须先读4周ESL' },
      { label: '托业入学', value: '基础约350分，中级约500分，高级约750分' },
      { label: '模考', value: '基础和中级每4周一次，高级每2周一次；雅思模考达到5.0分后改为每2周一次' },
    ],
    points: ['模考不能缺席，缺席罚款200比索。'],
  },
  {
    icon: 'forum',
    title: 'ESL 分级与测试',
    subtitle: '共9个级别',
    courseIds: ['esl', 'esl-intensive'],
    facts: [
      { label: '级别', value: '共9个级别，入学测试后分班' },
      { label: '级别测试', value: '每4周一次，口语在周四的课上考，写作、阅读和听力在周四下午考' },
      { label: '单词测试', value: '周一至周四每天考，周五复习当周单词' },
    ],
    points: ['每天另有句型作业：选5个句型，各造3个句子，交给写作老师检查。'],
  },
  {
    icon: 'family_restroom',
    title: '亲子营怎么报',
    subtitle: '家长和孩子一起报名',
    courseIds: ['family-guardian', 'family-kindergarten', 'family-kid-1', 'family-kid-2'],
    facts: [
      { label: '孩子年龄', value: '幼儿园3–6岁，方案1须7岁以上，方案2须10岁以上' },
      { label: '家长', value: '带未成年孩子来时，家长只能报亲子营家长课程，不能报成人课程' },
      { label: '转课', value: '家长最多可把3节课转给孩子，到校前一周申请' },
      { label: '照看孩子', value: '孩子上课时家长须留在校内；孩子满8岁、托给其他家长照看时，家长可以外出，但不能托给老师或员工' },
      { label: '门禁', value: '22:00；全家一起外出时21:00前回校' },
      { label: '家人探访', value: '最多住1周，每天2,000比索' },
    ],
    points: [],
  },
  {
    icon: 'rule',
    title: '上课、出勤与结业',
    subtitle: '所有课程',
    facts: [
      { label: '课时', value: '每节课40分钟，周一至周五上课' },
      { label: '迟到', value: '迟到10分钟算缺课，不补课' },
      { label: '换老师', value: '上课观察一周后可以申请；不能指定老师和上课时间' },
      { label: '结业证书', value: '出勤率90%以上' },
      { label: '延长课程', value: '提前2周申请，至少延长2周' },
      { label: '假期', value: '菲律宾法定假日和天灾停课，不补课也不退费' },
    ],
    points: [],
  },
  {
    icon: 'beach_access',
    title: '2027夏季青少年营',
    subtitle: '10–17岁，不带家长',
    facts: [
      { label: '入学', value: '2027年7月4日或7月18日（周日）入学，读2–8周' },
      { label: 'ESL', value: '2周1,825、3周2,350、4周2,950、6周4,400、8周5,400美元' },
      { label: '雅思和托业', value: '4周3,050、6周4,500、8周5,500美元' },
      { label: '已包含', value: '注册费、SSP、签证延期、学费、住宿、洗衣、电费、教材、结业证书和周末活动' },
      { label: '不包含', value: '机票、接机、保险和个人花费；未满15岁另付入境许可费3,620比索' },
    ],
    points: ['平日不外出，周六户外活动、周日购物。'],
    notice: '青少年营是整包价，不在下方报价器里计算，报名请联系顾问。',
  },
];

export const HELP_PRACTICAL_GUIDES: CampusPracticalGuide[] = [
  {
    icon: 'restaurant',
    eyebrow: 'MEALS & HOURS',
    title: '用餐与开放时间',
    facts: [
      { label: '平日三餐', value: '早餐07:00–07:40，午餐11:00–12:20，晚餐17:10–18:00' },
      { label: '周末和假日', value: '早午餐10:30–12:00，晚餐17:00；周六没有晚餐' },
      { label: '游泳池', value: '平日20:15–22:00，周末10:00–22:00' },
      { label: '健身房', value: '平日06:00–09:00和16:00–22:40，周末10:00–20:00' },
      { label: '厨房和休息区', value: '06:00–22:00' },
    ],
    note: '用餐时间可能调整，学校会提前通知。',
  },
  {
    icon: 'cleaning_services',
    eyebrow: 'SCHOOL SERVICES',
    title: '打扫、洗衣与网络',
    facts: [
      { label: '打扫', value: '每周2次，每2周换床单；打扫时本人要在房间' },
      { label: '洗衣', value: '周一、周三、周五11:30–13:00送洗；每4周可洗16公斤，超出另付' },
      { label: 'Wi-Fi', value: '校内免费' },
      { label: '电话卡', value: '到校后在商店买当地电话卡' },
    ],
    note: '贴身衣物建议自己手洗，校内有脱水机。',
  },
  {
    icon: 'badge',
    eyebrow: 'VISA & PASSPORT',
    title: '签证与护照',
    facts: [
      { label: '护照', value: '由学校统一保管，用于办理SSP和签证延期' },
      { label: '照片', value: '需要延签的学生，第一天入学说明会时交2×2英寸照片' },
      { label: '出境旅行', value: '出境后签证要重新办理，有旅行计划请提前和经理确认' },
      { label: '付款', value: '学杂费只收比索现金，学校没有刷卡机' },
    ],
    note: '入境和签证材料由思达启航顾问逐项帮你核对；eTravel入境登记也由顾问协助填写。',
  },
  {
    icon: 'event',
    eyebrow: 'BEFORE YOU GO',
    title: '出发前准备',
    facts: [
      { label: '机票', value: '按开课日前一天（周日）到校、结业周六离校订票' },
      { label: '保险', value: '建议出发前在国内买好海外旅行保险，菲律宾看病较贵' },
      { label: '衣物', value: '克拉克天气炎热，准备6–7套夏季衣服' },
    ],
    note: '提前入住或延住每晚2,000比索，须提前申请。',
  },
];

/** Cancellation and refund rules from HELP's Clark student handbook, plus 思达启航's own deposit rule. */
export const HELP_REFUND_COPY = {
  summaryTitle: 'HELP 取消、改期与退款规定',
  summaryHint: '报名定金、出发前取消、到校后退款、保留和延长课程',
  eyebrow: 'CANCELLATION & REFUND',
  title: 'HELP 取消与退款规定',
  intro: '注册费不退；到校后已经开始的课程不退，剩下的课程每4周为一期按比例退。',
  alert: '报名前请确认',
  groups: [
    {
      title: '报名与出发前',
      note: '',
      rules: [
        { when: '报名定金', text: '通过思达启航报名时预收定金2,000元人民币，为学生向学校订位；定金交了以后不退。' },
        { when: '改期', text: '入学4周前告诉顾问，可以改入学日期，或把定金保留1年；不足4周改期可能要扣违约金，以学校确认为准。' },
        { when: '报名后取消', text: '违约金100美元（即注册费）。' },
        { when: '出发前取消', text: '淡季违约金300美元；旺季须出发1个月前申请，违约金500美元。' },
        { when: '出发当天取消', text: '扣除4周课程费。' },
      ],
      footnote: '',
    },
    {
      title: '到校以后',
      note: '',
      rules: [
        { when: '已开始的课程', text: '不退款。' },
        { when: '剩下的课程', text: '每4周为一期：下一期退30%，再往后各期退50%。' },
        { when: '不能退款', text: '报名不满12周，或剩下的课程不足4周。' },
        { when: '被学校开除', text: '不退款。' },
      ],
      footnote: '',
    },
    {
      title: '保留、延长与其他',
      note: '',
      rules: [
        { when: '保留课程', text: '报名12周以上、剩下4周以上时可以保留，最多1年，只能在淡季使用，提前1个月告诉学校，不能转让。' },
        { when: '延长课程', text: '提前2周申请，至少延长2周。' },
        { when: 'SSP和签证费', text: '学校还没替你办理前可以退。' },
        { when: '接机费', text: '车辆出发前可以退。' },
        { when: '办理时间', text: '填写退款申请表约15天后退款，由思达启航协助办理。' },
      ],
      footnote: HELP_REFERENCE_NOTE,
    },
  ],
};

export const HELP_LICENSE = {
  title: '办学资质已核验',
  items: [
    '克拉克开发公司（CDC）经营许可：英语培训，有效期2026年1月22日至2028年12月31日',
    '菲律宾技术教育与技能发展署（TESDA）ESL课程注册，有效至2029年7月9日',
  ],
  note: '证件可向思达启航顾问索取查看',
};

export const HELP_FAQS: FaqItem[] = [
  { question: 'HELP 克拉克是斯巴达学校吗？', answer: '是。周一至周五不能外出，周六06:00–24:00、周日06:00–22:00可以外出；校内只说英语，每天有早读课、单词测试和两节晚自习。入学第一周不能外宿或旅行。' },
  { question: '什么时候可以入学？', answer: 'HELP 按固定开课日入学，2026年每两周一次，周日入住、周一开课。2026年还剩12月6日和12月20日入住两期；2027年的开课日以学校通知为准，顾问会帮你确认。', until: '2026-12-21' },
  { question: '现在报名有什么优惠？', answer: '2026年8月17日至12月7日开课（最后一期是12月6日入住）：每读满4周减淡季优惠100美元和SNS优惠200美元，读8周以上免注册费。SNS优惠要求每4周在个人社交平台发2篇文章并@学校，把链接交给学校。课程费和住宿费扣除这些优惠后，再享思达启航95折。报价器会按你的日期自动计算。', until: '2026-12-07' },
  { question: '未满18岁可以一个人来读成人课程吗？', answer: '旺季（1、2、6、7、8月）须满18岁或高中毕业，未满18岁只能报亲子营或青少年营。淡季满15岁可以报成人课程，另付200美元特殊管理费。' },
  { question: '可以带孩子一起来吗？', answer: '可以报亲子营：3–6岁读校内GIS国际幼儿园，7岁以上和10岁以上各有一种孩子课程，家长读家长课程。带未成年孩子来时，家长不能报成人课程。孩子上课时家长须留在校内。' },
  { question: '到校学杂费大概多少？', answer: '按30天签证读4周，约18,200比索（SSP、E-CARD、教材、学生证、水电、洗衣和宿舍维护费），另交押金3,000比索；读得越久，签证延期和每周费用越多。报价器会按你的周数和签证算出明细。' },
  { question: '页面上的报价包含全部费用吗？', answer: '学校费用包含注册费、课程费和住宿费，并自动扣除优惠；到校学杂费单独列出，接机和押金另外准备。两者分开显示，不相加。' },
  { question: '思达启航会协助签证和入境吗？', answer: '会。通过思达启航报名，顾问会免费协助菲律宾入境和签证相关手续，你只需要按顾问指引准备个人资料。' },
];

export const HELP_FINAL_CTA_BADGES = ['免费选校建议', '确认开课日和空房', '签证与入境协助'];

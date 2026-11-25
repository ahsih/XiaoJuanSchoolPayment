// Text and data of the CG Banilad page, from CG's 2026-11 school pack (2026 Chinese brochure, Banilad orientation
// guide, 2026 Banilad price list, 2027 Banilad calendar) and the photos, videos and IELTS reports in CG's own
// Google Drive folder. Nothing from the Sparta campus belongs here: the two campuses have separate pages. The
// shared Philippine school template reads this module through cg-banilad-page-profile.ts. Keep it pure data (no
// Angular, DOM or storage), so the WeChat mini program can reuse it. Never add the school's phone, address,
// website, e-mail or nationality chart.
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

export const CG_BANILAD_REFERENCE_NOTE = SCHOOL_REFERENCE_NOTE;

export const CG_BANILAD_PAGE_TEXT = {
  heroLead: 'CG 在宿务市中心 Banilad 区的校区：度假村风格的校园，有游泳池和咖啡厅；半斯巴达和一般 ESL 课程都有，空堂可以外出（半斯巴达课程下课后才能外出）。',
  advisorText: 'CG Banilad 适合想在市区边学边生活的学生：离 IT Park 车程5–10分钟，步行5分钟就有餐厅、超市和银行。课程从每天4节一对一的轻松ESL到每天8节课的半斯巴达都有，小组课每班最多4人；也收家长陪同的小学到高中学生。想更严格、平日不外出，可以看 CG 斯巴达校区（另一个页面）。',
  campusIntro: '教室、宿舍、餐厅、咖啡厅、游泳池、健身房和篮球场都在一个校园里，宿舍从单人间到四人间。',
  galleryIntro: '按区域查看校园、教室、住宿、餐厅和设施；相册内用左右箭头或缩略图切换，点击主图可放大。',
  coursesIntro: '按学习目标分组，每门课下面是每天的课时；点开可看适合人群和说明。每节课45分钟，小组课每班最多4人。',
  roomsPhotoIntro: '点选房型查看实景；各房型价格见上方住宿费表。',
  finalCtaTitle: '想确认 CG Banilad 的空房和最新优惠？',
  finalCtaText: '告诉顾问你的入学日期、周数、课程和想住的房型，我们帮你确认房间并做一份完整报价。',
} as const;

export const CG_BANILAD_QUICK_INFO = [
  { icon: 'location_on', title: '宿务市中心', text: 'Banilad 区，到 IT Park 车程5–10分钟' },
  { icon: 'tune', title: '半斯巴达和一般课程', text: '一般课程空堂可外出；半斯巴达下课后外出' },
  { icon: 'groups', title: '小组课最多4人', text: '正课里的小组课都是1:4' },
  { icon: 'pool', title: '度假村风格校园', text: '游泳池、咖啡厅、健身房、篮球场' },
  { icon: 'bed', title: '校内宿舍', text: '单人间到四人间，都在校园里' },
  { icon: 'family_restroom', title: '亲子课程', text: '家长陪同的小学到高中学生' },
];

/** Key facts under the hero title (compact layout). */
export const CG_BANILAD_OVERVIEW_FACTS: ReadonlyArray<{ icon: string; label: string; value: string }> = [
  { icon: 'location_on', label: '位置', value: '宿务市 Banilad 区；到 IT Park 车程5–10分钟，步行5分钟有餐厅、超市和银行' },
  { icon: 'rule', label: '管理', value: '一般课程空堂可以外出；半斯巴达、雅思和托业课程下课并通过单词测试后外出' },
  { icon: 'schedule', label: '门禁', value: '周日至周四22:00，周五、周六和假期前一天24:00' },
  { icon: 'menu_book', label: '课程', value: 'ESL、半斯巴达、雅思基础、托业、商务英语、短期冲刺和亲子课程' },
  { icon: 'groups', label: '小组课', value: '每班最多4人；每节课45分钟' },
  { icon: 'event', label: '入学', value: '每周日入住，周一上午水平测试、下午说明会' },
  { icon: 'bed', label: '住宿', value: '校内单人间、双人间、三人间和四人间' },
  { icon: 'pool', label: '设施', value: '游泳池、咖啡厅、健身房、篮球场、自习室' },
];

export const CG_BANILAD_BASIC_INFO: BasicInfoRow[] = [
  { label: '学校', value: 'CG Academy（Cebu Globalization Academy）Banilad 校区' },
  { label: '位置', value: '菲律宾宿务市 Banilad 区' },
  { label: '管理方式', value: '一般课程空堂可外出；半斯巴达类课程下课后外出' },
  { label: '课程', value: 'ESL、半斯巴达、雅思基础、托业、商务英语、短期冲刺、亲子课程' },
  { label: '住宿', value: '校内单人间、双人间、三人间、四人间' },
  { label: '入学', value: '每周日入住，周一开课' },
];

export const CG_BANILAD_SUITABLE_FOR = [
  '想住在市区、周末方便出去玩的学生',
  '想自己安排节奏、空堂可以外出的成人',
  '想有一定管理、但不想全斯巴达的学生（选半斯巴达课程）',
  '家长陪同来读书的小学到高中学生',
];

export const CG_BANILAD_NOT_SUITABLE_FOR = [
  '想平日完全不外出、全天集中学习的学生（可看 CG 斯巴达校区）',
  '想住校外公寓或酒店的学生（只有校内宿舍）',
  '想只读1–2周又想上小组课的学生（1–2周可以报短期冲刺，全是一对一）',
];

/** What is on campus and when it is open (Banilad orientation guide). */
export const CG_BANILAD_CAMPUS_AREAS: CampusBuildingCard[] = [
  { code: 'STUDY', title: '学习', icon: 'school', facilities: ['一对一和小组教室', '自习室 08:00–24:00', '大会议室'] },
  { code: 'LIFE', title: '生活', icon: 'restaurant', facilities: ['自助餐厅，每天三餐', '咖啡厅（周一至周五08:00–20:00，周日12:00–19:00）', '洗衣房'] },
  { code: 'SPORT', title: '运动', icon: 'pool', facilities: ['游泳池 08:00–22:00', '健身房（平日13:00–22:00）', '篮球场 08:00–22:00'] },
  { code: 'DORM', title: '宿舍', icon: 'bed', facilities: ['单人间到四人间', '房间有书桌、衣柜和空调', 'Wi-Fi（含在综合管理费里）'] },
];

const photo = (file: string) => `assets/cg-banilad/photos/${file}.webp`;
export const CG_BANILAD_QUOTE_IMAGE_HERO = '/assets/philippines/cg-banilad-campus-hero.webp';

export const CG_BANILAD_GALLERY_IMAGES: GalleryImage[] = [
  { category: '校园', title: 'CG Banilad 校园', description: '游泳池在校园中间，四周是教学楼和宿舍。', src: photo('campus-01') },
  { category: '校园', title: '校园标志', description: '篮球场旁的 CG BANILAD 立体字。', src: photo('campus-sign') },
  { category: '校园', title: '泳池和教学楼', description: '下课走几步就到泳池。', src: photo('campus-02') },
  { category: '校园', title: '校园一角', description: '泳池边的教学楼和宿舍。', src: photo('campus-03') },
  { category: '校园', title: '教学楼', description: '带阳台的楼房。', src: photo('campus-04') },
  { category: '校园', title: '校园全景', description: '学校的车停在校园里。', src: photo('campus-05') },
  { category: '校园', title: '校园走廊', description: '教室外的走廊。', src: photo('corridor-01') },
  { category: '校园', title: '夜晚的泳池', description: '泳池开放到22:00。', src: photo('campus-night-01') },
  { category: '校园', title: '夜晚的校园', description: '亮灯后的校园标志。', src: photo('campus-night-02') },
  { category: '教室', title: '一对一课', description: '每节课45分钟。', src: photo('one-to-one-01') },
  { category: '教室', title: '一对一课', description: '一位老师对一位学生。', src: photo('one-to-one-02') },
  { category: '教室', title: '1:4小组课', description: '正课里的小组课每班最多4人。', src: photo('group-01') },
  { category: '教室', title: '1:4小组课', description: '和不同国家的同学一起练口语。', src: photo('group-02') },
  { category: '教室', title: '大教室', description: '人数较多的课和活动在这里举行。', src: photo('evening-01') },
  { category: '教室', title: '大教室上课', description: '老师带着大家一起上课。', src: photo('evening-02') },
  { category: '住宿', title: '单人间', description: '一个人住，有书桌、衣柜和空调。', src: photo('single-01') },
  { category: '住宿', title: '双人间', description: '两人同住。', src: photo('twin-01') },
  { category: '住宿', title: '四人间', description: '四人同住，预算最低。', src: photo('quad-01') },
  { category: '餐厅', title: '学生餐厅', description: '自助餐，每天三餐。', src: photo('dining-01') },
  { category: '餐厅', title: '学生餐厅', description: '午餐有主菜和小菜。', src: photo('dining-02') },
  { category: '餐厅', title: '学生餐厅', description: '晚餐有三道主菜和十多道小菜。', src: photo('dining-03') },
  { category: '餐厅', title: '咖啡厅', description: '下课后看书、做作业的地方。', src: photo('cafe-01') },
  { category: '餐厅', title: '咖啡厅座位', description: '周一至周五08:00–20:00，周日12:00–19:00。', src: photo('cafe-02') },
  { category: '餐厅', title: '咖啡厅柜台', description: '饮料和点心在这里点。', src: photo('cafe-04') },
  { category: '餐厅', title: '咖啡厅阳台', description: '在阳台上可以看到整个校园。', src: photo('cafe-03') },
  { category: '设施', title: '游泳池', description: '每天08:00–22:00开放。', src: photo('pool-01') },
  { category: '设施', title: '游泳池', description: '泳池边有躺椅。', src: photo('pool-02') },
  { category: '设施', title: '游泳池', description: '泳池和校园标志。', src: photo('pool-03') },
  { category: '设施', title: '游泳池', description: '泳池和宿舍楼。', src: photo('pool-04') },
  { category: '设施', title: '健身房', description: '周一至周五13:00–22:00，周末和假日13:00–17:00。', src: photo('gym-01') },
  { category: '设施', title: '健身房', description: '有跑步机和力量器械。', src: photo('gym-02') },
  { category: '设施', title: '健身房', description: '下课后锻炼的地方。', src: photo('gym-03') },
  { category: '设施', title: '篮球场', description: '每天08:00–22:00开放。', src: photo('court-01') },
  { category: '设施', title: '篮球场', description: '周末也可以打球。', src: photo('court-02') },
  { category: '设施', title: '洗衣房', description: '衣服装满洗衣篮交到这里。', src: photo('laundry-01') },
];

export const CG_BANILAD_ALBUM_DESCRIPTIONS = {
  校园: '校园、泳池、教学楼和夜景',
  教室: '一对一、1:4小组课和大教室',
  住宿: '校内单人间、双人间和四人间',
  餐厅: '自助餐厅与咖啡厅',
  设施: '游泳池、健身房、篮球场和洗衣房',
} as const;

/**
 * A clip in public/assets/cg-banilad/videos/ (720p H.264 with a poster each), from CG's own Google Drive folder.
 * The school film had its classroom shots with the flag of the Taiwan authorities cut out. Check every frame of a
 * new clip for other companies, flags and contact details before adding it.
 */
export interface CgBaniladVideo {
  name: string;
  title: string;
  description: string;
  duration: string;
  orientation: 'landscape' | 'portrait';
}

export const cgBaniladVideoSrc = (video: CgBaniladVideo) => `/assets/cg-banilad/videos/${video.name}.mp4`;
export const cgBaniladVideoPoster = (video: CgBaniladVideo) => `/assets/cg-banilad/videos/poster-${video.name}.jpg`;

export const CG_BANILAD_VIDEOS: CgBaniladVideo[] = [
  { name: 'campus-film', title: 'CG Banilad 校园介绍', description: '校园、教室、宿舍、餐厅和泳池。', duration: '2:38', orientation: 'landscape' },
  { name: 'student-day', title: '学员的一天', description: '一位学员在 Banilad 校区的一天：上课、吃饭和课后生活。', duration: '1:17', orientation: 'portrait' },
];

const DORM_SERVICE = '可申请打扫，每周最多2次；衣服交洗衣房洗';
const numbered = (prefix: string, count: number) => Array.from({ length: count }, (_, index) => photo(`${prefix}-${String(index + 1).padStart(2, '0')}`));

/** Only rooms with their own photos; the triple room has none yet, so its price card opens no album. */
export const CG_BANILAD_ROOM_PROFILES: PhRoomProfile[] = [
  {
    id: 'single', rateIds: ['single'], label: '单人间', location: '校内', bed: '单人床', service: DORM_SERVICE,
    suitable: '重视隐私、需要安静学习空间的学生', note: '一个人住，房内有卫生间。',
    highlights: ['书桌、衣柜和空调', 'Wi-Fi（含在综合管理费里）'],
    image: photo('single-01'), gallery: [...numbered('single', 4), photo('single-bath')], imageAlt: 'CG Banilad单人间实景',
  },
  {
    id: 'twin', rateIds: ['twin'], label: '双人间', location: '校内', bed: '两张单人床', service: DORM_SERVICE,
    suitable: '朋友、家人同行或想兼顾预算的学生', note: '两人同住。',
    highlights: ['书桌、衣柜和空调', 'Wi-Fi（含在综合管理费里）'],
    image: photo('twin-01'), gallery: numbered('twin', 5), imageAlt: 'CG Banilad双人间实景',
  },
  {
    id: 'quad', rateIds: ['quad'], label: '四人间', location: '校内', bed: '四张单人床', service: DORM_SERVICE,
    suitable: '预算优先、喜欢热闹的学生', note: '四人同住，共用卫生间。',
    highlights: ['书桌、衣柜和空调', 'Wi-Fi（含在综合管理费里）'],
    image: photo('quad-01'), gallery: [...numbered('quad', 5), photo('quad-bath')], imageAlt: 'CG Banilad四人间实景',
  },
];

export const CG_BANILAD_DORM_RULES = [
  { title: '外出', text: '平日08:00起空堂可以外出；半斯巴达、雅思基础和托业课程的学生要等作文课结束、通过单词测试后（约17:00）才能外出。周末和假日05:00起可以外出。' },
  { title: '周五', text: '除一般ESL课程外，其他课程的学生要等16:30毕业典礼以后才能外出。' },
  { title: '门禁', text: '周日至周四和连假最后一天22:00；周五、周六和假期前一天24:00。未成年学生21:00，外出须有成人陪同。' },
  { title: '外宿', text: '只有周末和假期旅行可以外宿：平日17:00前在线提交旅行计划，下周一17:00前交住宿凭证。为了安全，不能在宿务市、曼达维、塔里赛和麦克坦岛外宿（麦克坦岛只能住学校指定的酒店）。' },
  { title: '家人探访', text: '每12周可以请1次假（最多7天6晚），陪来访的家人或朋友。' },
  { title: '禁止事项', text: '校内禁止喝酒和带酒回校；只能在指定区域吸烟；不能进入别人的房间和异性房间。' },
  { title: '安静时间', text: '24:00以后保持安静；22:00以后不能叫外卖。' },
  { title: '房间物品', text: '冰箱每4周800比索、风扇每4周200比索；保险箱免费，另交押金2,000比索。钥匙丢失赔1,000比索。' },
  { title: '空调电费', text: '房间空调按电表收费，每度25比索，从押金中结算；私自改动电表会罚款。' },
];

/** One weekday at Banilad (orientation guide). */
export const CG_BANILAD_SCHEDULE: DailyScheduleRow[] = [
  { time: '07:00–08:00', activity: '早餐；半斯巴达管理的课程考单词', kind: 'meal' },
  { time: '08:00–08:45', activity: '第1节', kind: 'class' },
  { time: '08:50–09:35', activity: '第2节', kind: 'class' },
  { time: '09:40–10:25', activity: '第3节', kind: 'class' },
  { time: '10:30–11:15', activity: '第4节', kind: 'class' },
  { time: '11:20–12:05', activity: '第5节', kind: 'class' },
  { time: '12:05–13:05', activity: '午餐', kind: 'meal' },
  { time: '13:05–13:50', activity: '第6节', kind: 'class' },
  { time: '13:55–14:40', activity: '第7节', kind: 'class' },
  { time: '14:45–15:30', activity: '第8节', kind: 'class' },
  { time: '15:35–16:20', activity: '第9节', kind: 'class' },
  { time: '16:25–17:00', activity: '选修课1：作文（半斯巴达、雅思基础和托业课程必上）', kind: 'activity' },
  { time: '17:05–17:50', activity: '选修课2：语法、托业听力或雅思听力（自选）', kind: 'activity' },
  { time: '17:50–19:00', activity: '晚餐', kind: 'meal' },
  { time: '19:00以后', activity: '自由时间', kind: 'free' },
];

const SEMI_SPARTA_IDS = ['semi-sparta', 'premier-semi-sparta', 'ielts-basic', 'toeic'];

export const CG_BANILAD_COURSE_DETAIL_GUIDES: CourseDetailGuide[] = [
  {
    icon: 'rule',
    title: '半斯巴达类课程怎么管',
    subtitle: '半斯巴达、高阶半斯巴达、雅思基础、托业',
    courseIds: SEMI_SPARTA_IDS,
    facts: [
      { label: '单词测试', value: '平日每天早上约15分钟' },
      { label: '作文课', value: '16:25–17:00 选修课1必上' },
      { label: '外出', value: '空堂不能外出；作文课结束、通过单词测试后才能外出' },
      { label: '模考', value: '雅思基础每两周一次' },
    ],
    points: ['单词测试的结果决定当天能不能外出。'],
  },
  {
    icon: 'bolt',
    title: '短期冲刺怎么报',
    subtitle: '只读1–2周的15岁以上学生',
    courseIds: ['booster'],
    facts: [
      { label: '课程', value: '每天一对一8节，由8位老师上课' },
      { label: '周数', value: '只能单独报1周（370美元）或2周（640美元）' },
      { label: '开课', value: '周一下午开始上课' },
      { label: '假期', value: '公众假期的课自选参加' },
    ],
    points: ['下午可以参加选修课：作文、语法、托业听力或雅思听力。'],
  },
  {
    icon: 'family_restroom',
    title: '亲子课程',
    subtitle: '家长陪同的小学、初中和高中学生',
    courseIds: ['guardian', 'junior'],
    facts: [
      { label: '孩子', value: '一对一4节（写作、听力、口语、阅读）+ 1:4小组课2节' },
      { label: '家长', value: '一对一4节，不点名' },
      { label: '转课', value: '家长的课可以转给孩子上，最多2节；也可以放弃' },
      { label: '选修课', value: '亲子课程没有选修课' },
    ],
    points: ['未成年学生门禁21:00，外出须有成人陪同。'],
  },
  {
    icon: 'swap_horiz',
    title: '分级、换课与出勤',
    subtitle: '所有课程',
    facts: [
      { label: '分级', value: '入学当天水平测试，分8个级别；每月一次定期水平测试' },
      { label: '换课', value: '每周三07:30–09:00到办公室申请，下周一开始上新课' },
      { label: '差价', value: '升级补差价；降级不退差价，降级后不能再换回' },
      { label: '减课', value: '55岁以上学生可以申请少上最多2节（半斯巴达类课程除外）' },
      { label: '教材', value: '报名2周以上要买教材，平日17:00前购买' },
    ],
    points: ['迟到、早退和旷课都会扣分，累计扣分可能被禁足。', '周五下午、水平测试当天和前一天没有选修课。'],
  },
];

export const CG_BANILAD_PRACTICAL_GUIDES: CampusPracticalGuide[] = [
  {
    icon: 'flight_land',
    eyebrow: 'FIRST DAY',
    title: '第一天怎么安排',
    facts: [
      { label: '08:00–12:00', value: '水平测试' },
      { label: '13:00–15:30', value: '新生说明会' },
      { label: '15:30–18:00', value: '到附近换钱、买日用品（步行5分钟），到办公室交到校费用，领课表和学生证' },
      { label: '毕业典礼', value: '每周五16:30' },
    ],
    note: '到校后要交的费用（SSP、押金、综合管理费、接机费）在说明会后到办公室交。',
  },
  {
    icon: 'restaurant',
    eyebrow: 'MEALS & HOURS',
    title: '用餐与开放时间',
    facts: [
      { label: '早餐', value: '平日07:00–08:00，周末和假日08:00–09:00' },
      { label: '午餐', value: '12:05–13:05' },
      { label: '晚餐', value: '17:50–19:00' },
      { label: '咖啡厅', value: '周一至周五08:00–20:00，周日12:00–19:00，周六和假日休息' },
      { label: '自习室', value: '08:00–24:00' },
    ],
    note: '自助餐每周有一天特色菜单；晚餐有三道主菜、十多道小菜和水果、沙拉。',
  },
  {
    icon: 'cleaning_services',
    eyebrow: 'SCHOOL SERVICES',
    title: '打扫与洗衣',
    facts: [
      { label: '打扫', value: '可申请，每周最多2次，周一至周五08:00–16:50' },
      { label: '洗衣', value: '周一至周五07:30–17:00，周末10:00–17:00，假日休息；衣服装满洗衣篮交洗' },
    ],
    note: '肥皂、牙膏、洗发水、纸巾等日用品自己准备，在宿务买更便宜。',
  },
  {
    icon: 'celebration',
    eyebrow: 'ACTIVITIES',
    title: '学校活动',
    facts: [
      { label: '每月', value: '跳岛游、尊巴舞、公益活动，部分月份有知识竞赛和才艺表演' },
      { label: '节日', value: '万圣节和圣诞节活动' },
    ],
    note: '活动安排以学校当月日历为准。',
  },
  {
    icon: 'luggage',
    eyebrow: 'BEFORE YOU GO',
    title: '出发前准备',
    facts: [
      { label: '回程机票', value: '读9周以上要交回程机票' },
      { label: '护照', value: '办SSP和学生卡约2周，期间护照由学校保管' },
      { label: '银行卡', value: '带一张能在境外用的银行卡' },
      { label: '衣物', value: '教室和宿舍空调开得足，带几件长袖和薄外套' },
      { label: '药品', value: '感冒药、外伤药、创可贴和自己常用的药' },
    ],
    note: '入境和签证材料由思达启航顾问逐项帮你核对；eTravel入境登记也由顾问协助填写。出发前请买好旅行保险。',
  },
];

const HOLIDAYS_2027: Array<[number, number, string]> = [
  [1, 1, '元旦'],
  [2, 26, '宿务市建市纪念日'],
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

/** Banilad's 2027 weekday holidays, from the school calendar; holidays have no class and no makeup class. */
export const CG_BANILAD_HOLIDAY_CALENDARS: HolidayCalendar[] = [{
  year: 2027,
  label: '规划2027年入学时优先查看',
  months: [...new Set(HOLIDAYS_2027.map(([month]) => month))].map(month => ({
    month,
    holidays: HOLIDAYS_2027.filter(([m]) => m === month).map(([, day, name]) => ({ day: `${day}日`, name })),
  })),
}];

/** IELTS reports from CG's folder, cut and pixelated so no name, photo, birth date or candidate number shows. */
export const CG_BANILAD_IELTS_RESULTS = [
  {
    image: 'assets/cg-banilad/ielts-results/ielts-vietnam-4w-6-5.webp', title: '越南学员 · 2025年6月', entrance: '4.0', overall: '6.5',
    summary: '入学测试4.0 → 约4周后官方雅思6.5', detail: '听力7.0 阅读6.0 写作6.0 口语6.0',
  },
  {
    image: 'assets/cg-banilad/ielts-results/ielts-vietnam-6-0.webp', title: '越南学员 · 2025年11月入学', entrance: '3.5', overall: '6.0',
    summary: '入学测试3.5 → 回国后官方雅思6.0', detail: '听力5.5 阅读5.0 写作6.5 口语6.0',
  },
];

export const CG_BANILAD_REVIEWS_COPY = {
  eyebrow: 'IELTS RESULTS',
  title: 'CG Banilad 学员的雅思成绩',
  intro: '学员入学先做水平测试，学习期间参加模考，最后去考官方雅思。',
  source: '真实学员成绩单',
  scoresTitle: '入学测试 → 官方雅思',
  scoresIntro: '点击可查看成绩单。',
  scoresNote: '已隐藏学员个人信息；成绩因个人基础和投入而异，仅供参考。',
};

/** The school's refund rules, plus 思达启航's own deposit rule (user decision 2026-11-24). */
export const CG_BANILAD_REFUND_COPY = {
  summaryTitle: 'CG Banilad 取消、改期与退款规定',
  summaryHint: '报名定金、出发前取消、到校后退款和保留课程',
  eyebrow: 'CANCELLATION & REFUND',
  title: 'CG Banilad 取消与退款规定',
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
        { when: '出发前2周内取消', text: '退80%。' },
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
        { when: '降级', text: '换成更便宜的课程或房型不退差价。' },
        { when: '延长课程', text: '延长部分开始前取消，退50%。' },
      ],
      footnote: '',
    },
    {
      title: '保留课程',
      note: '',
      rules: [
        { when: '家人生病或丧事', text: '剩余4周以上可以保留课程，至少4周后、1年内回来继续读；不能在旺季回来，也不能转给别人。剩余不足4周不能保留。' },
        { when: '违规退学', text: '按校规被退学的，不退款也不补偿。' },
      ],
      footnote: '',
    },
  ],
};

export const CG_BANILAD_FAQS: FaqItem[] = [
  { question: 'CG Banilad 和 CG 斯巴达校区有什么不同？', answer: 'Banilad 在宿务市中心，一般课程空堂就能外出，校园有泳池和咖啡厅；斯巴达校区平日周一到周四不能外出，每天从早上8点学到晚上10点。两个校区是两个页面，课程和价格各自不同。' },
  { question: '半斯巴达课程管得多严？', answer: '每天早上单词测试，下午作文课必上；空堂不能外出，作文课结束、通过单词测试后（约17:00）才能外出。门禁和一般课程一样。' },
  { question: '只能读1–2周可以吗？', answer: '可以。1–3周按4周价格的40%／60%／85%计算；也可以报短期冲刺课程（15岁以上，每天一对一8节，1周370美元，2周640美元）。' },
  { question: '2026–2027年有什么优惠？', answer: '2026/08/30–12/27或2027/02/14–05/23入学，每满4周课程减150美元；课程12/16/20/24周再减50/100/150/200美元。通过思达启航报名，课程费和住宿费享9折。报价器会按你的日期自动计算。' },
  { question: '暑假要加钱吗？', answer: '2027/07/04–08/28期间的学习周，每周加收60美元暑假附加费（2026年暑期每周40美元）；同一周课程和住宿只算一次，不参与折扣。' },
  { question: '未成年人可以去吗？', answer: '小学到高中学生可以报亲子课程，由家长陪同。未成年学生门禁21:00，外出须有成人陪同。' },
  { question: '页面上的报价包含全部费用吗？', answer: '学校费用包含注册费、课程费和住宿费，并自动扣除优惠；到校学杂费单独列出，接机和押金另外准备。两者分开显示，不相加。' },
  { question: '思达启航会协助签证和入境吗？', answer: '会。通过思达启航报名，顾问会免费协助菲律宾入境和签证相关手续，你只需要按顾问指引准备个人资料。' },
];

export const CG_BANILAD_FINAL_CTA_BADGES = ['免费选校建议', '确认空房和优惠', '签证与入境协助'];

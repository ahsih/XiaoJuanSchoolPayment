// Text and data of the CIP (Clark) page, from CIP's 2026-11 school pack: the 2026 new-student handbook, the course
// guide and rules (課程簡介與規定), the 2027 USD price list, the 2027 off-season and December 2026 posters, the 2027
// holiday poster, the room and Clover Hotel introductions, and the school's photo and video folders (received
// 2026-11-24). The shared Philippine school template reads it through cip-page-profile.ts. Keep it pure data (no
// Angular, DOM or storage), so the WeChat mini program can reuse it.
// Never add the school's address, phone, email, LINE/Instagram/Facebook accounts, website or any student score report,
// and never the links the school's files came from.
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
import type { PhOfferCard, PhRoomProfile } from '../school-page/ph-school-profile';
import { SCHOOL_REFERENCE_NOTE } from '../school-page/school-reference-note';
import { CIP_LONG_STAY_RULE_ID, CIP_OFF_SEASON_RULE_ID, CIP_RETURNING_RULE_ID } from './cip-content-config';

/** Closes every content section once; the same line as on every Philippine school page. */
export const CIP_REFERENCE_NOTE = SCHOOL_REFERENCE_NOTE;

export const CIP_PAGE_TEXT = {
  heroLead: '克拉克的花园式校园，有泳池和有顶篮球场；轻量、半斯巴达、全斯巴达和青少年课程都有，多门课程带外籍老师一对一。',
  advisorText: 'CIP 适合想在克拉克安静学习的成人和亲子家庭：半斯巴达课程平日下课后可以外出，全斯巴达课程平日不能外出、晚上有晚课和每周小考。外籍老师来自澳大利亚、美国和加拿大，口语和雅思课程都能选外教一对一。7–15岁孩子有专门的青少年课程。校内宿舍从单人间到四人间，也可以住车程约5分钟的 Clover Hotel。',
  campusIntro: '教学区、宿舍、餐厅、泳池和有顶篮球场都在同一个校园里，另有自习室和学生厨房。',
  galleryIntro: '按区域查看校园、教室、住宿、餐厅和设施；相册内用左右箭头或缩略图切换，点击主图可放大。',
  coursesIntro: '按学习方式分组，每门课下面是每天的课时；点开可看适合人群和说明。每节课45分钟。',
  roomsPhotoIntro: '点选房型查看实景；各房型价格见上方住宿费表。',
  finalCtaTitle: '想确认 CIP 的空房和最新优惠？',
  finalCtaText: '告诉顾问你的入学日期、周数、课程和想住的房型，我们帮你确认房间并做一份完整报价。',
} as const;

export const CIP_QUICK_INFO = [
  { icon: 'location_on', title: '克拉克', text: '安吉利斯市，平日和周六有免费班车去商场' },
  { icon: 'rule', title: '半斯巴达或全斯巴达', text: '半斯巴达平日下课后可外出；全斯巴达平日不能外出' },
  { icon: 'record_voice_over', title: '外籍老师', text: '澳、美、加籍外教，多门课程有外教一对一' },
  { icon: 'workspace_premium', title: '雅思保分班', text: '8周或12周，每周六雅思模考' },
  { icon: 'family_restroom', title: '青少年课程', text: '7–15岁孩子，生活导师每天给家长发学习报告' },
  { icon: 'pool', title: '校园设施', text: '泳池、有顶篮球场、自习室和学生厨房' },
];

/** Key facts under the hero title (compact layout). */
export const CIP_OVERVIEW_FACTS: ReadonlyArray<{ icon: string; label: string; value: string }> = [
  { icon: 'location_on', label: '位置', value: '菲律宾克拉克（安吉利斯市）' },
  { icon: 'rule', label: '管理', value: '半斯巴达平日下课后可外出，门禁22:00；全斯巴达周一至周四不能外出' },
  { icon: 'menu_book', label: '课程', value: '轻量、短期口语、综合英语、口语强化、商务、托业、雅思和青少年课程' },
  { icon: 'record_voice_over', label: '外教', value: '外籍老师来自澳大利亚、美国和加拿大，多门课程有外教一对一' },
  { icon: 'workspace_premium', label: '考试', value: '雅思和托业每周六模考；雅思保分班8周或12周' },
  { icon: 'event', label: '入学', value: '每周日入住，周一开课；每月保证至少19天课程' },
  { icon: 'bed', label: '住宿', value: '校内单人间到四人间；也可住车程约5分钟的 Clover Hotel' },
  { icon: 'pool', label: '设施', value: '泳池、有顶篮球场、自习室、学生厨房和自助洗衣' },
];

export const CIP_BASIC_INFO: BasicInfoRow[] = [
  { label: '学校', value: 'CIP English Academy（KEPOS 校区）' },
  { label: '位置', value: '菲律宾克拉克（安吉利斯市）' },
  { label: '管理方式', value: '半斯巴达和全斯巴达课程分开管理' },
  { label: '课程', value: '轻量、短期口语、综合英语、口语强化、商务、托业、雅思和青少年课程' },
  { label: '住宿', value: '校内宿舍单人间到四人间；校外 Clover Hotel' },
  { label: '入学', value: '每周日入住，周一开课' },
];

export const CIP_SUITABLE_FOR = [
  '想跟外籍老师练口语和发音的学生',
  '想在安静校园里学习、平日也想外出的成人',
  '需要严格管理、准备雅思的学生（选全斯巴达课程）',
  '带7–15岁孩子来读书的家庭',
];

export const CIP_NOT_SUITABLE_FOR = [
  '想住海边、周末就近玩海的学生（克拉克在内陆）',
  '全斯巴达课程的学生不能住校外酒店',
  '16–17岁的学生只能选全斯巴达课程',
];

/** Areas of the campus; shown as the campus strip in the hero. */
export const CIP_CAMPUS_AREAS: CampusBuildingCard[] = [
  { code: '教学', title: '教学区', icon: 'school', facilities: ['一对一隔间教室', '小组和大班教室', '自习室和图书区'] },
  { code: '生活', title: '生活区', icon: 'restaurant', facilities: ['校内宿舍', '学生餐厅，每天三餐', '学生厨房和自助洗衣'] },
  { code: '运动', title: '运动休闲', icon: 'pool', facilities: ['泳池', '有顶篮球场', '花园和露台'] },
  { code: '酒店', title: '校外酒店', icon: 'hotel', facilities: ['Clover Hotel', '车程约5分钟', '学校有免费接送车'] },
];

const campus = (file: string) => `assets/cip/campus/${file}.webp`;
const classes = (file: string) => `assets/cip/classes/${file}.webp`;
const dining = (file: string) => `assets/cip/dining/${file}.webp`;
const life = (file: string) => `assets/cip/life/${file}.webp`;
const rooms = (file: string) => `assets/cip/rooms/${file}.webp`;
const hotel = (file: string) => `assets/cip/hotel/${file}.webp`;
export const CIP_QUOTE_IMAGE_HERO = '/assets/cip/campus/campus-01.webp';

/** Photos come only from CIP's own photo folders and match their label (see public/assets/cip). */
export const CIP_GALLERY_IMAGES: GalleryImage[] = [
  { category: '校园', title: 'CIP 校舍', description: '花园里的行政楼。', src: campus('campus-01') },
  { category: '校园', title: '校舍夜景', description: '晚上的行政楼。', src: campus('campus-02') },
  { category: '校园', title: '教学楼', description: '两层的教学楼。', src: campus('campus-03') },
  { category: '校园', title: '校园走道', description: '教学楼之间的走道。', src: campus('campus-04') },
  { category: '校园', title: '校园花园', description: '课间可以在花园里走走。', src: campus('campus-05') },
  { category: '校园', title: '学校办公室', description: '报到、请假和各种申请都在这里办。', src: campus('campus-06') },
  { category: '校园', title: '教学楼外观', description: '校园里的教学楼。', src: campus('campus-13') },
  { category: '校园', title: '露台', description: '挂着灯笼的户外露台。', src: campus('campus-22') },
  { category: '校园', title: '校园里的学生', description: '下课后的校园。', src: campus('campus-21') },
  { category: '校园', title: 'English Day 活动', description: '学校的 English Day 活动日。', src: life('life-01') },
  { category: '校园', title: 'English Day 活动', description: '在篮球场上的水上游戏。', src: life('life-02') },
  { category: '校园', title: 'English Day 活动', description: '全校师生一起参加。', src: life('life-03') },
  { category: '校园', title: '校园比赛', description: '分组比赛后的合影。', src: life('life-06') },
  { category: '校园', title: '篮球场上的游戏', description: '全校活动的团体游戏。', src: life('life-11') },
  { category: '校园', title: '篮球场上的游戏', description: '学生和老师一起玩。', src: life('life-12') },
  { category: '校园', title: '充气水上乐园', description: '学校活动时的充气水上乐园。', src: life('life-07') },
  { category: '校园', title: '马尼拉一日游', description: '学校组织的马尼拉王城一日游。', src: life('life-10') },
  { category: '教室', title: '大班教室', description: '有桌椅和屏幕的大教室。', src: campus('campus-10') },
  { category: '教室', title: '小组课教室', description: '小组课为1:5。', src: campus('campus-11') },
  { category: '教室', title: '一对一隔间', description: '一对一课在独立隔间里上。', src: campus('campus-12') },
  { category: '教室', title: '外籍老师一对一', description: '外籍老师来自澳大利亚、美国和加拿大。', src: classes('class-13') },
  { category: '教室', title: '外籍老师一对一', description: '外籍老师一对一口语课。', src: classes('class-12') },
  { category: '教室', title: '外籍老师', description: 'CIP 的外籍老师。', src: classes('class-10') },
  { category: '教室', title: '小组课', description: '小组课上课的样子。', src: classes('class-04') },
  { category: '教室', title: '大班课', description: '大班课为1:10。', src: classes('class-06') },
  { category: '教室', title: '大班课', description: '全班一起练表达。', src: classes('class-11') },
  { category: '教室', title: '图书区一对一', description: '在图书区上的一对一课。', src: classes('class-05') },
  { category: '教室', title: '两人小课', description: '小组课的讨论。', src: classes('class-08') },
  { category: '教室', title: '青少年外籍老师一对一', description: 'Junior Native 课程有外籍老师一对一。', src: classes('class-01') },
  { category: '教室', title: '青少年一对一', description: '外籍老师给青少年上一对一。', src: classes('class-03') },
  { category: '教室', title: '青少年小组课', description: '青少年课程的小组课。', src: classes('class-02') },
  { category: '教室', title: '青少年小组课', description: '孩子们一起上课。', src: classes('class-09') },
  { category: '教室', title: '青少年大班课', description: '青少年课程的大班课。', src: classes('class-07') },
  { category: '教室', title: '青少年课堂', description: '老师带孩子做练习。', src: campus('campus-19') },
  { category: '教室', title: '青少年一对一', description: '用平板上的一对一课。', src: campus('campus-20') },
  { category: '住宿', title: '单人间A', description: '较大的单人间。', src: rooms('single-a-01') },
  { category: '住宿', title: '单人间B', description: '较小的单人间，有书桌和小冰箱。', src: rooms('single-b-01') },
  { category: '住宿', title: '双人间', description: '两张单人床。', src: rooms('double-01') },
  { category: '住宿', title: '三人间', description: '三张单人床。', src: rooms('triple-02') },
  { category: '住宿', title: '四人间', description: '三张床加一张抽拉床。', src: rooms('quad-01') },
  { category: '住宿', title: '宿舍卫浴', description: '宿舍房间的卫生间。', src: rooms('bathroom-01') },
  { category: '住宿', title: '宿舍卫浴', description: '部分房间的卫生间有浴缸。', src: rooms('bathroom-02') },
  { category: '住宿', title: 'Clover Hotel 豪华大床房', description: '车程约5分钟的校外酒店。', src: hotel('king-02') },
  { category: '住宿', title: 'Clover Hotel 豪华双床房', description: '一张大床和一张单人床。', src: hotel('twin-01') },
  { category: '住宿', title: 'Clover Hotel 行政套房', description: '两间卧室，带客厅和厨房。', src: hotel('suite-01') },
  { category: '餐厅', title: '学生餐厅', description: '两层的学生餐厅。', src: dining('dining-04') },
  { category: '餐厅', title: '自助取餐', description: '自助式取餐。', src: dining('dining-02') },
  { category: '餐厅', title: '每天的菜', description: '每餐有几道菜可选。', src: dining('dining-03') },
  { category: '餐厅', title: '用餐', description: '学生在餐厅吃饭。', src: dining('dining-01') },
  { category: '餐厅', title: '餐厅座位', description: '课后也可以在这里看书。', src: dining('dining-05') },
  { category: '餐厅', title: '餐厅一角', description: '餐厅里的书架。', src: dining('dining-06') },
  { category: '餐厅', title: '餐厅', description: '周一至周六三餐，周日早午餐和晚餐。', src: dining('dining-07') },
  { category: '设施', title: '泳池', description: '平日13:00–21:00，周末10:00–21:00开放。', src: campus('campus-08') },
  { category: '设施', title: '泳池', description: '校园里的泳池。', src: campus('campus-09') },
  { category: '设施', title: '泳池遮阳区', description: '泳池边有遮阳篷。', src: campus('campus-24') },
  { category: '设施', title: '课后游泳', description: '学生在泳池里玩。', src: campus('campus-17') },
  { category: '设施', title: '孩子们游泳', description: '孩子们在泳池里玩。', src: campus('campus-25') },
  { category: '设施', title: '有顶篮球场', description: '每天09:00–21:00开放。', src: campus('campus-07') },
  { category: '设施', title: '篮球场', description: '学生课后打篮球。', src: campus('campus-16') },
  { category: '设施', title: '自习室', description: '晚上的强制自习也在这里。', src: campus('campus-15') },
  { category: '设施', title: '自习室', description: '学生在自习室学习。', src: campus('campus-18') },
  { category: '设施', title: '自习室', description: '安静的学习空间。', src: campus('campus-23') },
  { category: '设施', title: '图书区', description: '有书架和桌子的图书区。', src: campus('campus-14') },
  { category: '设施', title: '学生厨房', description: '每天09:00–22:00开放，食材自备。', src: campus('kitchen-02') },
  { category: '设施', title: '学生厨房', description: '有炉灶。', src: campus('kitchen-01') },
  { category: '设施', title: '学生厨房', description: '有水槽和微波炉。', src: campus('kitchen-03') },
];

export const CIP_ALBUM_DESCRIPTIONS = {
  校园: '校舍、花园和校园活动',
  教室: '一对一、小组和大班课堂',
  住宿: '校内宿舍与 Clover Hotel',
  餐厅: '学生餐厅',
  设施: '泳池、篮球场、自习室和学生厨房',
} as const;

/**
 * A clip of CIP in public/assets/cip/videos/ (720p H.264 with a poster each), all from CIP's own video folders. The
 * campus film's shots of a flag were cut. Check every frame of a new clip for other companies or contact details.
 */
export interface CipVideo {
  name: string;
  title: string;
  description: string;
  duration: string;
  orientation: 'landscape' | 'portrait';
  /** Hero album group. */
  topic: '校园' | '宿舍' | '课程' | '餐厅与活动';
}

export const cipVideoSrc = (video: CipVideo) => `/assets/cip/videos/${video.name}.mp4`;
export const cipVideoPoster = (video: CipVideo) => `/assets/cip/videos/poster-${video.name}.jpg`;

export const CIP_VIDEOS: CipVideo[] = [
  { name: 'campus-tour', title: 'CIP 校园介绍', description: '学校的校园介绍影片。', duration: '1:40', orientation: 'landscape', topic: '校园' },
  { name: 'room-single-a', title: '单人间A', description: '单人间A的实拍。', duration: '0:30', orientation: 'portrait', topic: '宿舍' },
  { name: 'room-single-b', title: '单人间B', description: '单人间B的实拍。', duration: '0:40', orientation: 'portrait', topic: '宿舍' },
  { name: 'room-double', title: '双人间', description: '双人间的实拍。', duration: '0:49', orientation: 'portrait', topic: '宿舍' },
  { name: 'room-triple', title: '三人间', description: '三人间的实拍。', duration: '0:31', orientation: 'portrait', topic: '宿舍' },
  { name: 'native-teachers', title: '外籍老师', description: 'CIP 的外籍老师介绍自己。', duration: '0:17', orientation: 'landscape', topic: '课程' },
  { name: 'dining', title: '学生餐厅', description: '餐厅的菜。', duration: '0:19', orientation: 'portrait', topic: '餐厅与活动' },
  { name: 'english-day', title: 'English Day', description: '全校师生一起参加的活动日。', duration: '1:07', orientation: 'landscape', topic: '餐厅与活动' },
];

const DORM_SERVICE = '每周打扫2次，每1–2周换床单；外包洗衣周一至周五收送';
const DORM_HIGHLIGHTS = ['房内有卫生间', '空调、书桌和衣柜'];
const HOTEL_SERVICE = '每天打扫，补充洗漱用品和毛巾';
const HOTEL_HIGHLIGHTS = ['2023年开业的四星酒店', '车程约5分钟，学校有免费接送车', '冰箱、电热水壶、保险箱和电视', '全斯巴达课程不能住'];
const numbered = (make: (file: string) => string, prefix: string, count: number) =>
  Array.from({ length: count }, (_, index) => make(`${prefix}-${String(index + 1).padStart(2, '0')}`));

/** Photos come only from CIP's room folders and the Clover Hotel introduction, and match the labelled room type. */
export const CIP_ROOM_PROFILES: PhRoomProfile[] = [
  {
    id: 'single-a', rateIds: ['single-a'], label: '单人间A', location: '校内', bed: '单人床', service: DORM_SERVICE,
    suitable: '想要较大独立空间的学生', note: '比单人间B大。', highlights: DORM_HIGHLIGHTS,
    image: rooms('single-a-01'), gallery: [rooms('single-a-01')], imageAlt: 'CIP单人间A实景',
  },
  {
    id: 'single-b', rateIds: ['single-b'], label: '单人间B', location: '校内', bed: '单人床', service: DORM_SERVICE,
    suitable: '想要独立房间、又想控制预算的学生', note: '较小的单人间，有小冰箱。', highlights: DORM_HIGHLIGHTS,
    image: rooms('single-b-01'), gallery: [rooms('single-b-01')], imageAlt: 'CIP单人间B实景',
  },
  {
    id: 'double', rateIds: ['double'], label: '双人间', location: '校内', bed: '两张单人床', service: DORM_SERVICE,
    suitable: '朋友同行或想兼顾预算的学生', note: '两张单人床，两套书桌。', highlights: [...DORM_HIGHLIGHTS, '小冰箱'],
    image: rooms('double-01'), gallery: numbered(rooms, 'double', 6), imageAlt: 'CIP双人间实景',
  },
  {
    id: 'triple', rateIds: ['triple'], label: '三人间', location: '校内', bed: '三张单人床', service: DORM_SERVICE,
    suitable: '预算优先、喜欢热闹的学生', note: '三张单人床，三套书桌。', highlights: [...DORM_HIGHLIGHTS, '小冰箱和书架'],
    image: rooms('triple-02'), gallery: numbered(rooms, 'triple', 8), imageAlt: 'CIP三人间实景',
  },
  {
    id: 'quad', rateIds: ['quad'], label: '四人间', location: '校内', bed: '三张单人床和一张抽拉床', service: DORM_SERVICE,
    suitable: '家庭或4人同行', note: '床位安排以学校确认为准。', highlights: DORM_HIGHLIGHTS,
    image: rooms('quad-01'), gallery: [rooms('quad-01')], imageAlt: 'CIP四人间实景',
  },
  {
    id: 'hotel-king', rateIds: ['hotel-king-single', 'hotel-king-double'], label: 'Clover Hotel 豪华大床房', location: '校外',
    size: '约28平方米', bed: '一张特大床', service: HOTEL_SERVICE,
    suitable: '一个人住或夫妻同住', note: '1–2人住，价格按入住人数不同；未成年学生不能单独入住。', highlights: HOTEL_HIGHLIGHTS,
    image: hotel('king-02'), gallery: [hotel('king-02'), hotel('king-03'), hotel('king-01')], imageAlt: 'Clover Hotel豪华大床房实景',
  },
  {
    id: 'hotel-twin', rateIds: ['hotel-twin-double', 'hotel-twin-triple'], label: 'Clover Hotel 豪华双床房', location: '校外',
    size: '约28平方米', bed: '一张大床和一张单人床', service: HOTEL_SERVICE,
    suitable: '夫妻或2–3人的家庭', note: '2–3人住，价格按入住人数不同，须和同行的人同住。', highlights: HOTEL_HIGHLIGHTS,
    image: hotel('twin-01'), gallery: [hotel('twin-01'), hotel('twin-02')], imageAlt: 'Clover Hotel豪华双床房实景',
  },
  {
    id: 'hotel-suite', rateIds: ['hotel-suite-triple', 'hotel-suite-quad'], label: 'Clover Hotel 行政套房', location: '校外',
    size: '约63平方米', bed: '一张特大床、一张大床和客厅沙发床', service: HOTEL_SERVICE,
    suitable: '3–4人的家庭', note: '两间卧室、两个卫生间，客厅和带炉灶的厨房；须和同行的人同住。', highlights: HOTEL_HIGHLIGHTS,
    image: hotel('suite-01'), gallery: numbered(hotel, 'suite', 9), imageAlt: 'Clover Hotel行政套房实景',
  },
];

export const CIP_DORM_RULES = [
  { title: '门禁', text: '成人周日至周四22:00，周五、周六和假日前一晚到次日01:00（第二天有课仍是22:00）；未成年21:00，须有成人陪同。' },
  { title: '外出', text: '外出时在大门登记，把钥匙和学生证交给门卫；全斯巴达课程周一至周四不能外出，可填临时外出单短暂外出。' },
  { title: '外宿', text: '周五或假日前17:00前到办公室签外宿安全协议，经理签名后才能外宿。' },
  { title: '安静时间', text: '22:00后待在房间里并保持安静，不能在校园里聚集。' },
  { title: '禁止事项', text: '校内喝酒、带酒进校、在房间或吸烟区以外吸烟（含电子烟）都会被警告。' },
  { title: '赔偿', text: '丢失房间钥匙500比索；把餐具带出餐厅罚500比索；退房前检查家具，损坏照价赔偿。' },
  { title: '退房', text: '课程结束后的周六13:00前退房，钥匙交给门卫。' },
  { title: '护照', text: '要带护照去外地旅行时，至少提前2周向经理申请。' },
  { title: 'Clover Hotel', text: '住酒店不受宿舍门禁限制。' },
];

/** One weekday; the profile shows the morning and the afternoon side by side. */
export const CIP_SCHEDULE: DailyScheduleRow[] = [
  { time: '07:00–08:00', activity: '早餐', kind: 'meal' },
  { time: '08:00–08:45', activity: '第1节', kind: 'class' },
  { time: '08:50–09:35', activity: '第2节', kind: 'class' },
  { time: '09:40–10:25', activity: '第3节', kind: 'class' },
  { time: '10:30–11:15', activity: '第4节', kind: 'class' },
  { time: '11:20–12:00', activity: '第5节', kind: 'class' },
  { time: '12:00–13:00', activity: '午餐（餐厅11:40起供餐）', kind: 'meal' },
  { time: '13:00–13:45', activity: '第6节', kind: 'class' },
  { time: '13:50–14:35', activity: '第7节', kind: 'class' },
  { time: '14:40–15:25', activity: '第8节', kind: 'class' },
  { time: '15:30–16:15', activity: '第9节', kind: 'class' },
  { time: '16:20–17:00', activity: '第10节', kind: 'class' },
  { time: '17:05', activity: '全斯巴达每周小考（第2周起，周一至周四）', kind: 'test' },
  { time: '17:45–19:00', activity: '晚餐', kind: 'meal' },
  { time: '19:00–21:00', activity: '晚课（全斯巴达必上，雅思到22:00；其他课程可自愿参加）', kind: 'activity' },
];

const IELTS_COURSES = ['ielts-basic', 'ielts-intensive', 'ielts-native', 'ielts-guarantee'];

export const CIP_COURSE_DETAIL_GUIDES: CourseDetailGuide[] = [
  {
    icon: 'workspace_premium',
    title: '雅思保分班',
    subtitle: '8周或12周',
    courseIds: ['ielts-guarantee'],
    facts: [
      { label: '入学要求', value: '目标5.5分须达到4.0；目标6.5分须达到5.5；目标7.0分须有一年内的官方雅思6.5分' },
      { label: '官方考试', value: '8周班在第8周考，12周班在第10–11周考，都是机考' },
      { label: '出勤', value: '所有课程（含晚课）出勤和准时率至少96%，每周六模考100%出席' },
      { label: '模考', value: '模考分数不能连续3次下降' },
    ],
    points: [
      '8周班没考到目标分：毕业后1年内可以再报任何课程，最多免4周学费，住宿费和到校学杂费自付。',
      '12周班没考到目标分：之后的学费免收，每次延长4周，最多延长8周，住宿费和到校学杂费自付。',
      '迟到10分钟算缺席，迟到5次算1次缺席。',
    ],
    notice: '保分条件以学校当期规定为准，报名前顾问会和你逐项确认。',
  },
  {
    icon: 'bolt',
    title: '全斯巴达课程规定',
    subtitle: 'Intensive ESL 和所有雅思课程',
    courseIds: ['intensive-esl', ...IELTS_COURSES],
    facts: [
      { label: '外出', value: '周一至周四不能外出，可填临时外出单短暂外出' },
      { label: '晚课', value: 'Intensive ESL 周一至周四19:00–21:00（1小时课＋1小时强制自习）；雅思课程周一至周四19:00–22:00、周五19:00–20:00' },
      { label: '每周小考', value: '第2周起每天17:05：周一、周二单词，周三语法，周四复习考' },
      { label: '小考没过', value: '低于75%，周六07:50–08:50加1小时自习' },
      { label: '周六', value: '08:50–11:15上课；雅思课程13:00–16:00模考' },
    ],
    points: ['模考不能缺席，缺席会被警告并要补考；课程最后一周的模考改在周四早上8点。'],
  },
  {
    icon: 'child_care',
    title: '青少年和未成年学生',
    subtitle: '7–17岁',
    courseIds: ['primary-english', 'junior-esl', 'junior-native'],
    facts: [
      { label: '课程', value: '7–11岁 Primary English；12–15岁 Junior ESL 或 Junior Native；青少年课程不能选其他课程' },
      { label: '15–17岁', value: '可选任一全斯巴达课程，不能选半斯巴达、轻量和短期课程' },
      { label: '学习报告', value: '生活导师每天给家长发学习报告（课程内容和作业）' },
      { label: '外出', value: '须由20岁以上的成人监护人陪同，周一至周五17:00前到办公室取得经理同意；假日不接受临时申请' },
      { label: '门禁', value: '21:00，须有成人陪同' },
    ],
    points: [
      '入学前家长和学生须签署同意书，没签署不能入学，也不退费。',
      '未成年学生吸烟、喝酒、出入娱乐场所或赌场，学生和同行的监护人都会被立即退学，剩余课程不退费。',
    ],
  },
  {
    icon: 'fact_check',
    title: '入学测试、分级和换老师',
    subtitle: '所有课程',
    facts: [
      { label: '入学门槛', value: '雅思、托业和商务英语课程须先通过线上面试；雅思基础和青少年课程到校后笔试分班' },
      { label: '程度测验', value: '入学后每4周的周四08:00–12:00，1–3周的学生不考；缺考会被警告且没有成绩单' },
      { label: '课时保障', value: '每月至少保证19天课程，因假日不足时学校安排补课；个人原因缺课不补' },
      { label: '换老师换课表', value: '第1–2周每天16:30前申请，次日生效；第3周起周三、周四16:30前申请，下周一生效' },
      { label: '换课本', value: '入学第1周周三17:00前，书上没写字才能换' },
    ],
    points: ['半斯巴达和轻量课程的学生周六上午可报名2–3节免费选修团体课，每周报名。'],
  },
  {
    icon: 'rule',
    title: '出勤与警告',
    subtitle: '所有课程',
    facts: [
      { label: '迟到', value: '上课5分钟没到算迟到，10分钟没到算缺席；团体课开课10分钟后不能进教室' },
      { label: '缺席', value: '一周缺席3次会口头警告并约谈，再犯会收到书面警告' },
      { label: '警告', value: '第1、2次警告单并处罚；第3次开除，不退款，24小时内离校' },
      { label: '清零', value: '警告每12周自动清零' },
    ],
    points: [],
  },
  {
    icon: 'add_circle',
    title: '到校后加课和换课',
    subtitle: '在校学生申请',
    facts: [
      { label: '加外籍老师一对一', value: '每4周360美元' },
      { label: '加菲律宾老师一对一', value: '每4周180美元（雅思课程210美元）' },
      { label: '加小组课', value: '每4周100美元' },
      { label: '菲律宾老师一对一换外籍老师', value: '每4周加250美元' },
      { label: '小组课换外籍老师一对一', value: '每4周加260美元' },
      { label: '小组课换菲律宾老师一对一', value: '每4周加120美元' },
    ],
    points: ['到校后在学校申请和缴费；能不能加课视老师空堂而定。'],
  },
];

export const CIP_PRACTICAL_GUIDES: CampusPracticalGuide[] = [
  {
    icon: 'restaurant',
    eyebrow: 'MEALS & HOURS',
    title: '用餐与开放时间',
    facts: [
      { label: '周一至周六', value: '早餐07:00–08:00，午餐11:40–13:00，晚餐17:45–19:00' },
      { label: '周日和假日', value: '早午餐10:30–13:00，晚餐17:45–19:00' },
      { label: '泳池', value: '平日13:00–21:00，周末10:00–21:00' },
      { label: '运动场', value: '每天09:00–21:00' },
      { label: '学生厨房', value: '每天09:00–22:00，食材自备' },
    ],
    note: '喝酒后不能使用泳池。',
  },
  {
    icon: 'cleaning_services',
    eyebrow: 'SCHOOL SERVICES',
    title: '打扫与洗衣',
    facts: [
      { label: '打扫', value: '每周2次，按洗衣房外的时间表；打扫时换垃圾袋' },
      { label: '换床单', value: '每1–2周' },
      { label: '外包洗衣', value: '周一至周五08:00–16:30到办公室称重付款，第二天17:15后到办公室取' },
      { label: '洗衣价格', value: '5公斤以内150、6–8公斤200、9–10公斤300比索' },
      { label: '自助洗衣', value: '每天10:00–21:00免费使用，自备洗衣液、自己晾衣服' },
    ],
    note: '周六、周日没有打扫和外包洗衣；钱和贵重物品请收好。',
  },
  {
    icon: 'directions_bus',
    eyebrow: 'FREE SHUTTLE',
    title: '免费班车',
    facts: [
      { label: '周一至周五17:05', value: '到 GOAL\'S GYM 健身房或 NEPO MALL 商场，当天16:00前到办公室报名' },
      { label: '周六13:00', value: '到 SM City Clark 商场，前一个上班日17:00前到办公室报名' },
    ],
    note: '3人成团，不足3人取消；只送不接，回程自己安排；国定假日停开（周六的国定假日照常）。',
  },
  {
    icon: 'celebration',
    eyebrow: 'ACTIVITIES',
    title: '学校活动',
    facts: [
      { label: '校外活动', value: '每月1–2次，如游乐园、动物园、水上乐园、马尼拉一日游，费用按地点自理' },
      { label: '全校活动', value: '每月最后一个周五15:30–17:00' },
      { label: '周六选修课', value: '半斯巴达和轻量课程的学生可报名2–3节免费团体课' },
    ],
    note: '报名人数不足时，学校会取消校外活动。',
  },
  {
    icon: 'flight_takeoff',
    eyebrow: 'GRADUATION',
    title: '毕业与离校',
    facts: [
      { label: '毕业手续', value: '周五办理（周五放假改周四）' },
      { label: '押金和护照', value: '毕业当周周五16:00后退还，押金先扣电费' },
      { label: '送机', value: '提前告诉学校办公室，需付费' },
    ],
    note: '学校不负责校外发生的事；外出建议用 Grab 叫车。',
  },
  {
    icon: 'event',
    eyebrow: 'BEFORE YOU GO',
    title: '出发前准备',
    facts: [
      { label: '入境', value: 'eTravel 入境登记由思达启航顾问协助填写' },
      { label: '签证', value: '入境和签证材料由思达启航顾问逐项帮你核对' },
      { label: '生活导师', value: '每位新生有 Buddy Teacher，学习和生活上的问题都可以问' },
    ],
    note: '有问题可以先问 Buddy Teacher 或思达启航顾问。',
  },
];

/** CIP's 2027 holiday poster (Clark/Pampanga); the poster's 2026 on 9/8 is read as 2027. */
export const CIP_HOLIDAY_CALENDARS: HolidayCalendar[] = [{
  year: 2027,
  label: '规划2027年入学时优先查看',
  months: [
    { month: 1, holidays: [{ day: '1日', name: '元旦（停课）' }] },
    { month: 2, holidays: [{ day: '6日', name: '春节（停课）' }, { day: '25日', name: 'EDSA革命纪念日（照常上课）' }] },
    {
      month: 3,
      holidays: [
        { day: '10日', name: '开斋节（停课）', provisional: true },
        { day: '25日', name: '圣周四（停课）' },
        { day: '26日', name: '耶稣受难日（停课）' },
        { day: '27日', name: '圣周六（停课）' },
      ],
    },
    { month: 4, holidays: [{ day: '9日', name: '勇士日（停课）' }] },
    {
      month: 5,
      holidays: [
        { day: '1日', name: '劳动节（停课）' },
        { day: '7日', name: '何塞·阿巴德·桑托斯纪念日（停课）' },
        { day: '18日', name: '宰牲节（停课）', provisional: true },
      ],
    },
    { month: 6, holidays: [{ day: '12日', name: '独立日（停课）' }] },
    { month: 8, holidays: [{ day: '21日', name: '尼诺·阿基诺纪念日（停课）' }, { day: '30日', name: '国家英雄日（停课）' }] },
    { month: 9, holidays: [{ day: '8日', name: '雷梅迪奥斯圣母加冕纪念日（半天课）' }] },
    {
      month: 11,
      holidays: [
        { day: '1日', name: '诸圣节（停课）' },
        { day: '2日', name: '追思节（停课）' },
        { day: '30日', name: '博尼法西奥日（停课）' },
      ],
    },
    {
      month: 12,
      holidays: [
        { day: '8日', name: '圣母无染原罪节（停课）' },
        { day: '11日', name: '邦板牙省日（停课）' },
        { day: '24日', name: '平安夜（停课）' },
        { day: '25日', name: '圣诞节（停课）' },
        { day: '30日', name: '黎刹日（停课）' },
        { day: '31日', name: '年末（停课）' },
      ],
    },
  ],
}];

export const CIP_REFUND_COPY = {
  summaryTitle: 'CIP 取消、改期与退款规定',
  summaryHint: '报名定金、改期、到校后退款',
  eyebrow: 'CANCELLATION & REFUND',
  title: 'CIP 取消与退款规定',
  intro: '到校后的退款按剩余课程计算，并扣除注册费和已经享受的优惠。',
  alert: '报名前请确认',
  groups: [
    {
      title: '报名与入学前',
      note: '',
      rules: [
        { when: '报名定金', text: '通过思达启航报名时预收定金2,000元人民币，为学生向学校订位；定金交了以后不退。' },
        { when: '改期', text: '入学4周前告诉顾问，可以改入学日期，或把定金保留1年；不足4周改期可能要扣违约金，以学校确认为准。' },
      ],
      footnote: '',
    },
    {
      title: '到校以后',
      note: '',
      rules: [
        { when: '剩余课程4周以下', text: '不退款。' },
        { when: '剩余课程5周以上', text: '退剩余课程费用的50%，扣除注册费和已享受的优惠。' },
        { when: '违规开除', text: '不退款，24小时内离校。' },
      ],
      footnote: CIP_REFERENCE_NOTE,
    },
  ],
};

/** CIP's offers; a card hides from `until`, or when none of its promotions is enabled in the content document. */
export const CIP_OFFERS: PhOfferCard[] = [
  {
    icon: 'savings', title: '2027淡季优惠', amount: '每满4周减50美元',
    text: '2027/01/03–12/31入学，按报名周数每满4周减50美元；6–8月的学习周不计。',
    detail: '另送克拉克机场接机，并任选1项：1节菲律宾老师一对一升级为外籍老师、每天加1节一对一，或单人间A按双人间价格（视空房）；前两项在6–8月暂停。',
    until: '2028-01-01', promotionIds: [CIP_OFF_SEASON_RULE_ID],
  },
  {
    icon: 'event_available', title: '长期优惠', amount: '最高减150美元',
    text: '报名16周及以上，按总周数减一次。', detail: '16周减50 · 20周减100 · 24周减150美元',
    promotionIds: [CIP_LONG_STAY_RULE_ID],
  },
  {
    icon: 'replay', title: '老学员返校', amount: '免注册费100美元',
    text: '以前在 CIP 读过的学生再次报名，免注册费。', promotionIds: [CIP_RETURNING_RULE_ID],
  },
  {
    icon: 'park', title: '2026年12月特别优惠', amount: '读4周只付3周',
    text: '2026/11/28–12/28入学、全日制至少4周：免1周课程费和住宿费。',
    detail: '不适用青少年营和3人以上团体，到校学杂费照付；这期间入学按学校人民币价格单独报价，请联系顾问。',
    until: '2026-12-29',
  },
];

export const CIP_FAQS: FaqItem[] = [
  { question: 'CIP 是斯巴达学校吗？', answer: '两种都有。半斯巴达和轻量课程平日下课后可以外出，门禁22:00；全斯巴达课程（Intensive ESL 和所有雅思课程）周一至周四不能外出，晚上有晚课和强制自习，第2周起每周小考，周六上午上课。' },
  { question: '2027年怎么报价？', answer: '2027/01/03起入学按学校的美元价格报价，报价器从这个日期开始算。之前入学按学校的人民币价格报价，请联系顾问。' },
  { question: '有旺季附加费吗？', answer: '没有，6–8月也不收旺季附加费。但淡季优惠不计6–8月的学习周。' },
  { question: '淡季优惠怎么算？', answer: '2027年入学，按报名周数每满4周减50美元（不满4周不算），6–8月的学习周不计；另送克拉克机场接机，并任选1项学校福利。报价器会按你的日期自动计算。' },
  { question: '可以住校外酒店吗？', answer: '可以住 Clover Hotel，2023年开业的四星酒店，车程约5分钟，学校有免费接送车；每天打扫并补洗漱用品，不受宿舍门禁限制。全斯巴达课程不能住酒店；住酒店不收电费和宿舍押金，设施使用费照收。' },
  { question: '孩子可以来读吗？', answer: '7–11岁读 Primary English，12–15岁读 Junior ESL 或 Junior Native，生活导师每天给家长发学习报告；15–17岁可以选全斯巴达课程。未成年学生外出须有20岁以上的成人陪同。' },
  { question: '雅思保分班有什么条件？', answer: '只能报8周或12周，按目标分数有入学要求；所有课程出勤和准时率至少96%，模考全勤。没达标时，8周班毕业1年内最多免4周学费，12周班最多免费延长8周，住宿费和学杂费自付。' },
  { question: '页面上的报价包含全部费用吗？', answer: '学校费用包含注册费、课程费和住宿费，并自动扣除优惠；到校学杂费单独列出，接机和押金另外准备。两者分开显示，不相加。' },
  { question: '思达启航会协助签证和入境吗？', answer: '会。通过思达启航报名，顾问会免费协助菲律宾入境和签证相关手续，你只需要按顾问指引准备个人资料。' },
];

export const CIP_FINAL_CTA_BADGES = ['免费选校建议', '确认空房和优惠', '签证与入境协助'];

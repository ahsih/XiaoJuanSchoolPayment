// Text and data of the A&J e-Edu Academy ECO Campus page (Baguio), from the school's Google Drive pack received
// 2026-11-24: the ECO Campus brochure, the 2027 course guide (arrivals from 2027-01-01), the new-student handbook,
// the 2026-11 local-fee notice, the offer posters, the 2027 peak notice, the refund poster and the 2027 calendar.
// The shared Philippine school template reads this module through anj-page-profile.ts. Keep it pure data (no Angular,
// DOM or storage), so the WeChat mini program can reuse it. Never add the school's phone, address, website, social
// accounts or any agency term (commission, agency rules, agency-only offers).
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

/** Closes every content section once; the same line as on every Philippine school page. */
export const ANJ_REFERENCE_NOTE = SCHOOL_REFERENCE_NOTE;

export const ANJ_PAGE_TEXT = {
  heroLead: '碧瑶市郊的松林校园，一对一为主；Eco Sparta 斯巴达管理，其他课程半斯巴达。雅思课程报名12周以上送1次官方考试，另有雅思、托业保分班和4–16岁青少年课程。',
  advisorText: 'A&J ECO 校区在碧瑶市郊的松林里，环境安静，适合想专心学习的学生。课程以一对一为主：想轻松学可以选 Eco Relax，想冲刺可以选 Eco Sparta；雅思课程报名12周以上送1次官方考试，需要分数的可以报雅思或托业保分班。住宿从 Deluxe 三人间到独栋别墅都有，Premium 公寓和别墅可以自己做饭，适合家庭一起来。',
  campusIntro: '校园约8,500平方米，可容纳约150名学生；宿舍、教学楼、餐厅和运动设施都在松林里，到碧瑶市区约15–20分钟。',
  galleryIntro: '按区域查看校园、教室、住宿、餐厅和设施；相册内用左右箭头或缩略图切换，点击主图可放大。',
  coursesIntro: '按学习目标分组，每门课下面是每天的课时；点开可看适合人群和说明。每节课50分钟。',
  roomsPhotoIntro: '点选房型查看实景；各房型价格见上方住宿费表。',
  finalCtaTitle: '想确认 A&J 的空房和最新优惠？',
  finalCtaText: '告诉顾问你的入学日期、周数、课程和想住的房型，我们帮你确认房间并做一份完整报价。',
} as const;

export const ANJ_QUICK_INFO = [
  { icon: 'forest', title: '碧瑶松林校园', text: '约8,500平方米，到市区约15–20分钟' },
  { icon: 'rule', title: '半斯巴达／斯巴达', text: 'Eco Sparta 斯巴达管理，其他课程半斯巴达' },
  { icon: 'workspace_premium', title: '雅思送考', text: '雅思课程报名12周以上送1次官方考试' },
  { icon: 'verified', title: '保分班', text: '雅思、托业保分班，没达标可减免学费续读' },
  { icon: 'bed', title: '多种房型', text: 'Deluxe、Premium、套房、Studio 和独栋别墅' },
  { icon: 'family_restroom', title: '亲子与青少年', text: '4–16岁青少年课程，家长可以陪读上课' },
];

/** Key facts under the hero title (compact layout); what each area has is in ANJ_CAMPUS_AREAS. */
export const ANJ_OVERVIEW_FACTS: ReadonlyArray<{ icon: string; label: string; value: string }> = [
  { icon: 'location_on', label: '位置', value: '菲律宾碧瑶市郊松林，到市区约15–20分钟' },
  { icon: 'rule', label: '管理', value: 'Eco Sparta 周一至周四不能外出；其他课程周日至周四21:30宵禁' },
  { icon: 'menu_book', label: '课程', value: 'ESL、雅思、托业、托福、PTE、保分班、打工度假和青少年课程' },
  { icon: 'workspace_premium', label: '考试', value: '雅思课程报名12周以上送1次官方考试；每两周考试、每月月考' },
  { icon: 'event', label: '入学', value: '每周日入住，周一开课；BESA 团体接机在指定周日' },
  { icon: 'bed', label: '住宿', value: 'Deluxe 单人到三人间、Premium 公寓、套房、Studio 和独栋别墅' },
];

export const ANJ_BASIC_INFO: BasicInfoRow[] = [
  { label: '学校', value: 'A&J e-Edu Academy ECO 校区（2009年创办）' },
  { label: '位置', value: '菲律宾碧瑶市郊松林' },
  { label: '规模', value: '校园约8,500平方米，可容纳约150名学生' },
  { label: '管理方式', value: 'Eco Sparta 斯巴达管理，其他课程半斯巴达' },
  { label: '课程', value: 'ESL、考试课程、雅思和托业保分班、打工度假、青少年和亲子课程' },
  { label: '入学', value: '每周日入住，周一开课' },
];

export const ANJ_SUITABLE_FOR = [
  '喜欢安静自然环境、想专心学习的学生',
  '需要雅思或托业分数、想报保分班的学生',
  '带4–16岁孩子一起来读书的家庭',
  '准备海外打工度假、想先练工作英语的学生',
];

export const ANJ_NOT_SUITABLE_FOR = [
  '想住在市中心、下课随时逛街的学生（校园在市郊）',
  '不想参加单词测试的学生（除 Lite 课程外，前4周都要考）',
  '未满16岁、想单独报成人课程的学生（请报青少年课程）',
];

/** What each campus area has (2027 brochure and handbook); shown as the campus strip in the hero. */
export const ANJ_CAMPUS_AREAS: CampusBuildingCard[] = [
  { code: 'DORM', title: '宿舍', icon: 'apartment', facilities: ['主楼 Deluxe 房52间', '4间套房', 'Premium 公寓和 Studio', '2栋独栋别墅'] },
  { code: 'CLASS', title: '教学楼', icon: 'school', facilities: ['67间一对一教室', '7间小组课教室'] },
  { code: 'DINING', title: '餐厅', icon: 'restaurant', facilities: ['自助餐厅', '便利店和咖啡厅', '烧烤露营区'] },
  { code: 'SPORTS', title: '运动设施', icon: 'sports_tennis', facilities: ['室内体育馆（篮球、羽毛球）', '高尔夫练习场', '健身房'] },
];

const campus = (file: string) => `assets/anj/campus/${file}.webp`;
const rooms = (file: string) => `assets/anj/rooms/${file}.webp`;

export const ANJ_GALLERY_IMAGES: GalleryImage[] = [
  { category: '校园', title: 'A&J ECO 校区主楼', description: '松林里的主楼，Deluxe 房和套房都在这里。', src: campus('main-building') },
  { category: '校园', title: '校门', description: '校园入口。', src: campus('gate') },
  { category: '校园', title: 'Deluxe 宿舍楼', description: 'Deluxe 房所在的宿舍楼。', src: campus('deluxe-building') },
  { category: '校园', title: 'Eco Villa 别墅', description: '校园里的独栋别墅。', src: campus('eco-villa') },
  { category: '校园', title: '松林小路', description: '校园里连接各栋楼的小路。', src: campus('garden-path') },
  { category: '校园', title: '校园一角', description: '下课后散步、休息的地方。', src: campus('plaza') },
  { category: '校园', title: '校园夜景', description: '晚上的校园。', src: campus('campus-night') },
  { category: '校园', title: '大堂', description: '学生办事和等候的地方。', src: campus('lobby') },
  { category: '校园', title: '服务台', description: '学生有事可以到这里询问。', src: campus('information') },
  { category: '教室', title: '教学楼', description: '67间一对一教室和7间小组课教室。', src: campus('lecture-hall') },
  { category: '教室', title: '一对一课', description: '每节课50分钟。', src: campus('one-to-one') },
  { category: '教室', title: '一对一课', description: '老师按学生的程度安排内容。', src: campus('one-to-one-2') },
  { category: '教室', title: '小组课', description: '每班最多6人。', src: campus('group-class') },
  { category: '教室', title: '小组课', description: '分 Beginner 和 Intermediate 两个级别。', src: campus('group-class-2') },
  { category: '住宿', title: 'Deluxe 单人间', description: '主楼 Deluxe 房，一人一间。', src: rooms('deluxe-single-1') },
  { category: '住宿', title: 'Deluxe 双人间', description: '主楼 Deluxe 房，两人一间。', src: rooms('deluxe-twin-1') },
  { category: '住宿', title: 'Deluxe 三人间', description: '主楼 Deluxe 房，三人一间。', src: rooms('deluxe-triple-1') },
  { category: '住宿', title: 'Premium 单人间', description: 'Premium 公寓里的单人房。', src: rooms('premium-single-1') },
  { category: '住宿', title: 'Premium 公寓客厅', description: '公寓有客厅和小厨房，可以做饭。', src: rooms('premium-living-1') },
  { category: '住宿', title: 'Suite 套房', description: '主楼的套房。', src: rooms('suite-1') },
  { category: '住宿', title: 'Eco Villa 别墅', description: '独栋别墅，有客厅、小厨房和阳台。', src: rooms('villa-1') },
  { category: '餐厅', title: '学生餐厅', description: '自助取餐，平日三餐，周末和假日两餐。', src: campus('dining-hall') },
  { category: '餐厅', title: '学生餐厅', description: '餐厅06:00–24:00开放，也可以在这里自习。', src: campus('dining-hall-2') },
  { category: '餐厅', title: '餐厅夜景', description: '晚上的餐厅。', src: campus('dining-night') },
  { category: '餐厅', title: '咖啡厅', description: '周一至周五10:00–17:00营业。', src: campus('cafe') },
  { category: '餐厅', title: '咖啡厅露台', description: '课间喝咖啡、聊天的地方。', src: campus('cafe-terrace') },
  { category: '设施', title: '烧烤露营区', description: '校园里的烧烤和露营区。', src: campus('bbq-camping') },
  { category: '设施', title: '露营之夜', description: '晚上的露营区。', src: campus('camping-night') },
  { category: '设施', title: '高尔夫练习场', description: '14岁以上学生免费使用，08:30–17:30。', src: campus('golf-range') },
  { category: '设施', title: '室内体育馆', description: '羽毛球场，每小时400比索。', src: campus('indoor-gym') },
  { category: '设施', title: '室内体育馆', description: '篮球场，每小时1,200比索。', src: campus('indoor-gym-2') },
  { category: '设施', title: '健身房', description: '14岁以上学生免费使用。', src: campus('fitness-gym') },
  { category: '设施', title: '健身房', description: '周一至周六05:00–21:00，周日09:00–21:00。', src: campus('fitness-gym-2') },
];

export const ANJ_ALBUM_DESCRIPTIONS = {
  校园: '主楼、宿舍楼、别墅与松林校园',
  教室: '教学楼、一对一和小组课',
  住宿: 'Deluxe、Premium、套房与别墅',
  餐厅: '学生餐厅与咖啡厅',
  设施: '体育馆、高尔夫练习场、健身房与露营区',
} as const;

/**
 * A clip of the ECO Campus in public/assets/anj/videos/ (720p H.264 with a poster each), all from the school's own
 * pack (3.Photos and Videos). Every frame was checked: no other company, no contact details. Check every frame of a
 * new clip the same way before adding it.
 */
/**
 * A clip in public/assets/anj/videos/ (H.264 with a poster each). The landscape clips come from A&J's own pack; the
 * vertical ones (720×1280) from A&J's WeChat Channels folder (user 2026-11-24), whose labels name only the school and
 * the place. Its 复式套房 clip is left out: it walks through a Premium apartment and then another unit, so it cannot be
 * matched to one priced room. Check every frame of a new clip for other companies or contact details.
 */
export interface AnjVideo {
  name: string;
  title: string;
  description: string;
  duration: string;
  orientation: 'landscape' | 'portrait';
  /** Hero album group. */
  topic: '校园' | '宿舍' | '设施' | '餐厅';
}

export const anjVideoSrc = (video: AnjVideo) => `/assets/anj/videos/${video.name}.mp4`;
export const anjVideoPoster = (video: AnjVideo) => `/assets/anj/videos/${video.name}.jpg`;

export const ANJ_VIDEOS: AnjVideo[] = [
  { name: 'campus-film', title: 'A&J ECO 校区介绍', description: '学校的宣传片：校园、课堂、宿舍和活动。', duration: '3:58', orientation: 'landscape', topic: '校园' },
  { name: 'gate', title: '学校大门', description: '从门卫室走进大门，沿主路看校园。', duration: '0:21', orientation: 'portrait', topic: '校园' },
  { name: 'public-area', title: '松林校园', description: '校园的草坪、松林、户外露台和露营区。', duration: '0:37', orientation: 'portrait', topic: '校园' },
  { name: 'dorm-area', title: '宿舍楼', description: '宿舍楼外观、楼梯和走廊。', duration: '0:36', orientation: 'portrait', topic: '宿舍' },
  { name: 'deluxe-single', title: 'Deluxe 单人间', description: '走一圈看 Deluxe 单人间。', duration: '1:05', orientation: 'landscape', topic: '宿舍' },
  { name: 'deluxe-single-tour', title: 'Deluxe 单人间实拍', description: '床、书桌、冰箱、梳妆台和卫生间。', duration: '0:43', orientation: 'portrait', topic: '宿舍' },
  { name: 'deluxe-twin', title: 'Deluxe 双人间', description: '走一圈看 Deluxe 双人间。', duration: '0:54', orientation: 'landscape', topic: '宿舍' },
  { name: 'deluxe-twin-tour', title: 'Deluxe 双人间实拍', description: '两张床、书桌、衣柜和卫生间。', duration: '0:43', orientation: 'portrait', topic: '宿舍' },
  { name: 'deluxe-triple', title: 'Deluxe 三人间', description: '走一圈看 Deluxe 三人间。', duration: '1:18', orientation: 'landscape', topic: '宿舍' },
  { name: 'deluxe-triple-tour', title: 'Deluxe 三人间实拍', description: '上下铺和单人床、书桌、衣柜和卫生间。', duration: '0:31', orientation: 'portrait', topic: '宿舍' },
  { name: 'premium-twin', title: 'Premium 公寓', description: '公寓的客厅、楼梯、厨房和双人房。', duration: '1:18', orientation: 'landscape', topic: '宿舍' },
  { name: 'premium-studio', title: 'Premium Studio', description: '一张双人床和一张上下铺，有小厨房和餐桌。', duration: '1:06', orientation: 'landscape', topic: '宿舍' },
  { name: 'suite', title: 'Suite 套房', description: '走一圈看主楼的套房。', duration: '2:08', orientation: 'landscape', topic: '宿舍' },
  { name: 'villa', title: 'Eco Villa 别墅', description: '别墅外观、客厅、小厨房、卧室、卫生间和阳台。', duration: '2:08', orientation: 'landscape', topic: '宿舍' },
  { name: 'villa-tour', title: 'Eco Villa 别墅实拍', description: '阳台、客厅、小厨房、卧室和卫生间。', duration: '1:06', orientation: 'portrait', topic: '宿舍' },
  { name: 'gym', title: '健身房', description: '走到健身房，看跑步机、单车和力量器械。', duration: '0:33', orientation: 'portrait', topic: '设施' },
  { name: 'sports-hall', title: '室内体育馆', description: '羽毛球场和篮球场。', duration: '0:16', orientation: 'portrait', topic: '设施' },
  { name: 'golf', title: '高尔夫练习场', description: '有顶棚的高尔夫打击练习区。', duration: '0:09', orientation: 'portrait', topic: '设施' },
  { name: 'camping', title: '烧烤露营区', description: '松林里的露营区和木屋露台。', duration: '0:09', orientation: 'portrait', topic: '设施' },
  { name: 'store', title: '便利店', description: '校内便利店，有零食、饮料和日用品。', duration: '0:18', orientation: 'portrait', topic: '设施' },
  { name: 'cafe-dining', title: '咖啡厅和餐厅', description: '咖啡厅、学生餐厅、厨房和饮水区。', duration: '1:12', orientation: 'portrait', topic: '餐厅' },
  { name: 'meals', title: '学生餐', description: '自助取餐台：米饭、几道菜、汤和甜点。', duration: '0:31', orientation: 'portrait', topic: '餐厅' },
];

const SERVICE = '每周打扫2次；床单和被子每月换1次';
const VILLA_SERVICE = '每周三、周六打扫；床单和被子每月换1次';
const numbered = (prefix: string, count: number) => Array.from({ length: count }, (_, index) => rooms(`${prefix}-${index + 1}`));
const PREMIUM_LIVING = numbered('premium-living', 4);

/** Photos come only from A&J's room folders and match the labelled room type (see public/assets/anj). */
export const ANJ_ROOM_PROFILES: PhRoomProfile[] = [
  {
    id: 'deluxe-single', rateIds: ['deluxe-single'], label: 'Deluxe 单人间', location: '校内', service: SERVICE,
    suitable: '重视隐私、需要安静学习空间的学生', note: '主楼 Deluxe 房，一人一间。',
    highlights: ['房内有保险箱'],
    image: rooms('deluxe-single-1'), gallery: numbered('deluxe-single', 6), imageAlt: 'A&J ECO校区Deluxe单人间实景',
  },
  {
    id: 'deluxe-twin', rateIds: ['deluxe-twin'], label: 'Deluxe 双人间', location: '校内', service: SERVICE,
    suitable: '朋友同行或想兼顾预算的学生', note: '主楼 Deluxe 房，两人一间；室友由学校安排。',
    highlights: ['房内有保险箱'],
    image: rooms('deluxe-twin-1'), gallery: numbered('deluxe-twin', 5), imageAlt: 'A&J ECO校区Deluxe双人间实景',
  },
  {
    id: 'deluxe-triple', rateIds: ['deluxe-triple'], label: 'Deluxe 三人间', location: '校内', service: SERVICE,
    suitable: '预算优先、喜欢热闹的学生', note: '主楼 Deluxe 房，三人一间，住宿费最低；室友由学校安排。',
    highlights: ['房内有保险箱'],
    image: rooms('deluxe-triple-1'), gallery: numbered('deluxe-triple', 6), imageAlt: 'A&J ECO校区Deluxe三人间实景',
  },
  {
    id: 'premium-single', rateIds: ['premium-single'], label: 'Premium 单人间', location: '校内', service: VILLA_SERVICE,
    suitable: '想住得更宽敞、自己做饭的成人', note: 'Premium 公寓里的单人房；公寓有客厅和小厨房，可以做饭。',
    highlights: ['客厅和小厨房', '可以做饭'],
    image: rooms('premium-single-1'), gallery: [...numbered('premium-single', 5), ...PREMIUM_LIVING], imageAlt: 'A&J ECO校区Premium单人间实景',
  },
  {
    id: 'premium-twin', rateIds: ['premium-twin'], label: 'Premium 双人间（限家庭）', location: '校内', service: VILLA_SERVICE,
    suitable: '一起来读书的家庭', note: 'Premium 公寓里的双人房，按每人计价；须以家庭身份报名并同住。',
    highlights: ['客厅和小厨房', '可以做饭'],
    image: rooms('premium-twin-1'), gallery: [...numbered('premium-twin', 4), ...PREMIUM_LIVING], imageAlt: 'A&J ECO校区Premium双人间实景',
  },
  {
    id: 'suite', rateIds: ['premium-suite', 'premium-suite-twin'], label: 'Suite 套房', location: '校内', service: SERVICE,
    suitable: '想住大房间的学生，或两位家人、同性朋友同住', note: '主楼套房；一人入住按每人计价，两人入住按整间4周价由两人平分。',
    image: rooms('suite-1'), gallery: numbered('suite', 6), imageAlt: 'A&J ECO校区套房实景',
  },
  {
    id: 'studio', rateIds: ['premium-studio-single', 'premium-studio-twin', 'premium-studio-triple-use', 'premium-studio-quad-use'],
    label: 'Premium Studio', location: '校内', bed: '一张双人床和一张上下铺', service: VILLA_SERVICE,
    suitable: '一家人或几位同行的朋友', note: '房内有小厨房和餐桌；一人或两人（限家庭）按每人计价，三人或四人按整间4周价平分。',
    highlights: ['小厨房和餐桌', '可以做饭'],
    image: 'assets/anj/videos/premium-studio.jpg', gallery: ['assets/anj/videos/premium-studio.jpg'], imageAlt: 'A&J ECO校区Premium Studio实景',
  },
  {
    id: 'villa', rateIds: ['eco-villa-single', 'eco-villa-exclusive-twin', 'eco-villa-exclusive-triple', 'eco-villa-quad-use'],
    label: 'Eco Villa 别墅', location: '校内', service: VILLA_SERVICE,
    suitable: '想有独立空间的家庭', note: '独栋别墅，有客厅、小厨房和阳台；一人入住按每人计价，两人以上限家庭，按整间4周价平分。',
    highlights: ['客厅、小厨房和阳台', '可以做饭'],
    image: rooms('villa-1'), gallery: numbered('villa', 6), imageAlt: 'A&J ECO校区别墅实景',
  },
];

export const ANJ_DORM_RULES = [
  { title: '宵禁与外出', text: '半斯巴达课程周日至周四21:30宵禁检查，须在宿舍；Eco Sparta 周一至周四不能外出。外出旅行须先提交申请。' },
  { title: '房间', text: '不能进入他人房间，同性也不行；进入异性房间会被没收押金或退学。房间和室友由学校安排。' },
  { title: '禁止事项', text: '校内禁止饮酒和吸烟：第一次没收押金，第二次退学。21:30–06:00校内禁止喧哗。' },
  { title: '做饭和洗衣', text: '只有 Premium 公寓、Studio 和别墅可以做饭；宿舍内禁止洗衣服，统一用学校的洗衣服务。' },
  { title: '钥匙卡', text: '遗失或损坏罚款1,500比索；贵重物品请放进房内保险箱。' },
  { title: '扣分制度', text: '违规扣分：累计100分取消1次延长老师资格，200分没收一半押金，300分没收押金，超过300分退学。全勤、月考第一等可以加分换奖励。' },
  { title: '护照', text: '由学校保管，用于办理签证手续。' },
];

/** One weekday (2027 handbook); the profile shows the morning and the afternoon side by side. */
export const ANJ_SCHEDULE: DailyScheduleRow[] = [
  { time: '07:10–08:00', activity: '早餐', kind: 'meal' },
  { time: '08:30–12:20', activity: '第1–4节（每节50分钟）', kind: 'class' },
  { time: '12:30–13:20', activity: '午餐', kind: 'meal' },
  { time: '13:30–17:20', activity: '第5–8节（每节50分钟）', kind: 'class' },
  { time: '17:30–18:20', activity: '选修课 ECA／EAA（周一至周四）', kind: 'activity' },
  { time: '18:00–18:50', activity: '晚餐', kind: 'meal' },
  { time: '19:00–20:00', activity: '单词测试', kind: 'test' },
  { time: '20:00–23:00', activity: '自习', kind: 'activity' },
  { time: '21:30', activity: '宵禁检查（周日至周四）', kind: 'activity' },
];

export const ANJ_COURSE_DETAIL_GUIDES: CourseDetailGuide[] = [
  {
    icon: 'workspace_premium',
    title: '雅思保分班',
    subtitle: '12周5.5分、20周6.0分、24周6.5分',
    courseIds: ['ielts-guarantee'],
    facts: [
      { label: '入学门槛', value: '4.0分，以学校入学考试为准' },
      { label: '保证分数', value: '12周5.5分，20周6.0分，24周6.5分' },
      { label: '送考', value: '毕业前送1次官方考试' },
      { label: '每周考试', value: '必须参加' },
    ],
    points: [
      '入学考试没达到4.0分，先读4周ESL，学费按50%收。',
      '官方考试没达到保证分数，免50%学费继续上课，直到达标。',
    ],
    notice: '保分条件以学校当期规定为准，报名前顾问会和你逐项确认。',
  },
  {
    icon: 'fact_check',
    title: '托业保分班',
    subtitle: '12周或16周，每天模拟考',
    courseIds: ['toeic-guarantee'],
    facts: [
      { label: '12周保证', value: '入学0–295分保证300分以上；300–595分保证提高200分以上；600分以上保证提高100分以上' },
      { label: '16周保证', value: '800分以上' },
      { label: '送考', value: '毕业前送1次官方考试' },
    ],
    points: ['没达到保证分数，续读4周托业，学费减半；第二次考试自费。'],
    notice: '保分条件以学校当期规定为准，报名前顾问会和你逐项确认。',
  },
  {
    icon: 'quiz',
    title: '雅思课程送官方考试',
    subtitle: '报名12周以上送1次',
    courseIds: ['test-ielts'],
    facts: [
      { label: '条件', value: '2026/11/29起入学，报名雅思课程12周以上' },
      { label: '送考', value: '1次雅思官方考试，考点在碧瑶' },
      { label: '考试方式', value: '入学考试和模拟考都是机考' },
    ],
    points: ['已经报名的学生也适用。'],
  },
  {
    icon: 'work',
    title: '打工度假课程',
    subtitle: '含实习（OJT）',
    courseIds: ['working-holiday'],
    facts: [
      { label: '可报周数', value: '4周、8周或12周' },
      { label: '实习时数', value: '4周10小时，8周20小时，12周40小时' },
      { label: '结业评估', value: '最后一周：面试、实务任务和简报' },
    ],
    points: ['实习不支薪，结业发证书。'],
  },
  {
    icon: 'family_restroom',
    title: '青少年和亲子课程',
    subtitle: '4–16岁孩子和陪读家长',
    courseIds: ['junior-lite', 'junior-esl', 'junior-test'],
    facts: [
      { label: '年龄', value: 'Junior Lite 4–6岁，Junior ESL 7–15岁，Junior Test 12–16岁' },
      { label: '家长课程', value: 'Eco Relax Lite 或 Eco Relax Plus' },
      { label: '转课给孩子', value: '家长最多可以把2节一对一转给孩子；小组课不能转' },
      { label: '家庭方案', value: '以家庭身份报名并同住' },
    ],
    points: ['未满18岁须填家长同意书。'],
  },
  {
    icon: 'rule',
    title: '半斯巴达与斯巴达',
    subtitle: '所有课程',
    facts: [
      { label: '半斯巴达', value: '周日至周四21:30宵禁；前4周参加单词测试（Lite 课程可以不考）；不强制只说英语；选修课自由参加' },
      { label: '斯巴达', value: 'Eco Sparta：周一至周四不能外出；全程单词测试，错的单词罚写20次；只说英语（EOP）；选修课必须参加' },
    ],
    points: [],
  },
  {
    icon: 'groups',
    title: '小组课、选修课和考试',
    subtitle: '所有课程',
    facts: [
      { label: '小组课', value: '每班最多6人，分 Beginner 和 Intermediate；不足2人或没有合适级别时，2节小组课改为1节一对一' },
      { label: '选修课', value: 'ECA（兴趣社团）和 EAA（主题讨论），周一至周四17:30–18:20，当天14:30前到布告栏报名' },
      { label: '双周考和月考', value: '每两周在课堂上考1次；每月底考两天：第1天笔试阅读和写作，第2天在课堂上考听力和口语' },
      { label: '加课和减课', value: '可以付费加课（视师资安排）；可以申请减少课数（保分班除外），但不退费' },
    ],
    points: [],
  },
];

/** BESA group pickup Sundays in 2027 (A&J 2027 calendar). */
export const ANJ_BESA_PICKUP_2027 = [
  '1/10', '1/24', '2/7', '2/21', '3/7', '3/21', '4/4', '4/18', '5/2', '5/16', '5/30', '6/13', '6/27',
  '7/11', '7/25', '8/8', '8/22', '9/5', '9/19', '10/3', '10/17', '10/31', '11/14', '11/28', '12/12', '12/26',
];

export const ANJ_PRACTICAL_GUIDES: CampusPracticalGuide[] = [
  {
    icon: 'restaurant',
    eyebrow: 'MEALS & HOURS',
    title: '用餐与开放时间',
    facts: [
      { label: '周一至周五', value: '早餐07:10–08:00，午餐12:30–13:20，晚餐18:00–18:50' },
      { label: '周末和假日', value: '早午餐10:00–10:50，晚餐18:00–18:50' },
      { label: '餐厅', value: '06:00–24:00开放' },
      { label: '便利店', value: '周一至周六10:00–18:00' },
      { label: '咖啡厅', value: '周一至周五10:00–17:00' },
      { label: '健身房', value: '周一至周六05:00–21:00，周日09:00–21:00' },
    ],
    note: '健身房和高尔夫练习场（08:30–17:30）对14岁以上学生免费开放。',
  },
  {
    icon: 'cleaning_services',
    eyebrow: 'SCHOOL SERVICES',
    title: '打扫与洗衣',
    facts: [
      { label: '打扫', value: '每周2次；Premium 和别墅在周三、周六' },
      { label: '床单', value: '床单和被子每月换1次' },
      { label: '洗衣', value: '周一、三、五14:00前把洗衣袋放到宿舍入口大厅，下一个洗衣日送回' },
      { label: '洗衣费', value: '每3公斤180比索，每多1公斤加60；内衣每件10、帽子每顶50、浴巾每公斤47比索' },
    ],
    note: '宿舍内禁止洗衣服，以免损坏木地板。',
  },
  {
    icon: 'directions_bus',
    eyebrow: 'ARRIVAL',
    title: '入学与接机',
    facts: [
      { label: '入住', value: '周日入住，周一开课；课程结束后的周六退房' },
      { label: 'BESA 团体接机', value: '马尼拉或克拉克机场，在指定周日统一接机，3,000比索' },
      { label: '2027年接机日', value: ANJ_BESA_PICKUP_2027.join('、') },
    ],
    note: '入学日期尽量选接机日；其他日期到校，交通请先和顾问确认。',
  },
  {
    icon: 'receipt_long',
    eyebrow: 'OTHER FEES',
    title: '其他收费',
    facts: [
      { label: '体育馆', value: '篮球场每小时1,200比索，羽毛球场每小时400比索' },
      { label: '去 SM 商场', value: '学校班车100比索' },
      { label: '加课（每4周）', value: '一对一ESL 8,000比索，考试一对一10,000，小组课6,000；视师资安排' },
      { label: '床品更换', value: '枕套50比索，枕头或床垫套150，棉被200' },
      { label: '钥匙卡', value: '遗失或损坏罚款1,500比索' },
    ],
    note: '到校后用比索在学校缴纳。',
  },
  {
    icon: 'event',
    eyebrow: 'BEFORE YOU GO',
    title: '出发前准备',
    facts: [
      { label: '护照', value: '到校后交学校保管，用于办理签证' },
      { label: '入学测试', value: '到校后参加入学测试，按程度分级' },
      { label: '押金', value: 'Deluxe 3,000比索，其他房型5,000；离校时无损坏、无欠费退还' },
    ],
    note: '入境和签证材料由思达启航顾问逐项帮你核对；eTravel入境登记也由顾问协助填写。',
  },
];

/**
 * A&J's 2027 calendar: weekday holidays only, because the weekend ones (Lunar New Year 2/6, Black Saturday 3/27,
 * Labor Day 5/1, Independence Day 6/12, Ninoy Aquino Day 8/21, Christmas 12/25) do not take a class day.
 * The two Eid dates are the school's estimates.
 */
export const ANJ_HOLIDAY_CALENDARS: HolidayCalendar[] = [
  {
    year: 2027,
    label: '规划2027年入学时优先查看',
    months: [
      { month: 1, holidays: [{ day: '1日', name: '元旦' }] },
      {
        month: 3,
        holidays: [
          { day: '10日', name: '开斋节（预计）' },
          { day: '25日', name: '濯足节' },
          { day: '26日', name: '耶稣受难日' },
        ],
      },
      { month: 4, holidays: [{ day: '9日', name: '勇士日' }] },
      { month: 5, holidays: [{ day: '17日', name: '宰牲节（预计）' }] },
      { month: 7, holidays: [{ day: '15日', name: '科迪勒拉日' }] },
      { month: 8, holidays: [{ day: '30日', name: '国家英雄日' }] },
      { month: 9, holidays: [{ day: '1日', name: '碧瑶市宪章日' }] },
      {
        month: 11,
        holidays: [
          { day: '1日', name: '诸圣节' },
          { day: '2日', name: '万灵节' },
          { day: '30日', name: '博尼法西奥日' },
        ],
      },
      {
        month: 12,
        holidays: [
          { day: '8日', name: '圣母无原罪瞻礼' },
          { day: '24日', name: '平安夜' },
          { day: '30日', name: '黎刹日' },
          { day: '31日', name: '除夕' },
        ],
      },
    ],
  },
];

export const ANJ_HOLIDAY_FOOTNOTE = '只列平日的假期；周末的假期（春节2/6、复活节前的周六3/27、劳动节5/1、独立日6/12、尼诺伊·阿基诺日8/21、圣诞节12/25）不占上课日。每4周保证18个上课日：假期占3天以上时补1天课，一般在周六；天灾停课不补。';

/**
 * The school's refund poster (after-entry rules and no-refund cases) plus 思达启航's own deposit rule (user rule
 * 2026-11-24). The school's pre-entry change and cancellation penalties stay off the page.
 */
export const ANJ_REFUND_COPY = {
  summaryTitle: 'A&J 取消、改期与退款规定',
  summaryHint: '报名定金、改期、到校后退款和不退款的情况',
  eyebrow: 'CANCELLATION & REFUND',
  title: 'A&J 取消与退款规定',
  intro: '到校后，当前所在的学期不计，只退剩余学期费用的50%；注册费不退。',
  alert: '报名前请确认',
  groups: [
    {
      title: '报名与入学前',
      note: '',
      rules: [
        { when: '报名定金', text: '通过思达启航报名时预收定金2,000元人民币，为学生向学校订位；定金交了以后不退。' },
        { when: '改期', text: '入学4周前告诉顾问，可以改入学日期，或把定金保留1年；临近入学改期或取消，学校可能收违约金，以学校确认为准。' },
        { when: '临时改期', text: '学校按实际入学情况安排，临时可能无法更改入学日期。' },
      ],
      footnote: '',
    },
    {
      title: '到校以后',
      note: '',
      rules: [
        { when: '学费和住宿费', text: '当前所在的学期不计，只退剩余学期费用的50%。' },
        { when: '到校学杂费', text: '按2周为单位退还。' },
        { when: '冻结学期', text: '仅限紧急情况：12个月内返校，学期不能转让或退款，返校日期可以改1次。' },
        { when: '退款方式', text: '按实际支付的金额计算；离校30天后银行转账，手续费由学生承担。' },
      ],
      footnote: '',
    },
    {
      title: '不退款的情况',
      note: '',
      rules: [
        { when: '读4周以内', text: '不退款。' },
        { when: '被退学', text: '因自身原因被退学，不退款。' },
        { when: '不可抗力', text: '因不可抗力（如严重流行病）学校停课，不退款。' },
        { when: '注册费', text: '不退。' },
      ],
      footnote: ANJ_REFERENCE_NOTE,
    },
  ],
};

export const ANJ_FAQS: FaqItem[] = [
  { question: 'A&J ECO 校区是斯巴达学校吗？', answer: '看课程：Eco Sparta 是斯巴达管理，周一至周四不能外出，全程单词测试，只说英语，选修课必须参加。其他课程按半斯巴达管理：周日至周四21:30宵禁，前4周参加单词测试（Lite 课程可以不考），选修课自由参加。' },
  { question: '读雅思送官方考试吗？', answer: '送。2026/11/29起入学、报名雅思课程12周以上，送1次雅思官方考试，已经报名的学生也适用，考点在碧瑶。入学考试和模拟考都是机考。' },
  { question: '保分班怎么报？', answer: '雅思保分班入学要达到4.0分，12周保证5.5分、20周6.0分、24周6.5分；托业保分班12周按入学分数保证提分，16周保证800分以上。两种都在毕业前送1次官方考试，没达标可以减免学费继续上课。只能按规定的周数报名。' },
  { question: '2026–2027年有什么优惠？', answer: '2026/08/01–2027/02/28入学有常规优惠，按课程周数减50–750美元；2026/10/01–2027/01/09入学每满4周课程再减100美元，2027/02/28–06/26和08/22–12/26入学每满4周减300美元；课程至少4周、符合生日条件再减100美元。可以叠加，报价器会按你的日期自动计算。' },
  { question: '暑期旺季要加钱吗？', answer: '要。2027/06/27–08/22期间每个上课周加60美元；在旺季上课的学生要报满4周以上。附加费不打折。' },
  { question: '可以带孩子一起去吗？', answer: '可以。孩子按年龄报 Junior Lite（4–6岁）、Junior ESL（7–15岁）或 Junior Test（12–16岁），家长报 Eco Relax Lite 或 Plus 一起上课，最多可以把2节一对一转给孩子。家庭可以住 Premium 公寓、Studio 或别墅，自己做饭。' },
  { question: '页面上的报价包含全部费用吗？', answer: '学校费用包含注册费、课程费和住宿费，并自动扣除优惠；到校学杂费单独列出，押金和洗衣费另外准备。两者分开显示，不相加。' },
  { question: '思达启航会协助签证和入境吗？', answer: '会。通过思达启航报名，顾问会免费协助菲律宾入境和签证相关手续，你只需要按顾问指引准备个人资料。' },
];

export const ANJ_FINAL_CTA_BADGES = ['免费选校建议', '确认空房和优惠', '签证与入境协助'];

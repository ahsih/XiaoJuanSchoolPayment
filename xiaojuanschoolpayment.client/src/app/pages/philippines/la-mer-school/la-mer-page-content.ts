// Text and data of the EV Academy La Mer page on the shared Philippine school template.
// Prices, offers, family packages and local fees come from la-mer-content-config.ts and the published
// content document, not from this file. Sources: La Mer's 2026-10 Chinese orientation guide, the 2025-12-17
// rules, the 2026 brochure and course guide, and the 2027 family-course sheet. Photos and videos are the
// school's own and show exactly the room or area they name. Never add the school's phone, email, website,
// social accounts or address (user rule). Keep this file pure data (no Angular, DOM or storage).
import type {
  BasicInfoRow,
  CampusBuildingCard,
  CampusPracticalGuide,
  CourseDetailGuide,
  DailyScheduleRow,
  FaqItem,
  GalleryImage,
} from '../cia-school/cia-page-content';
import type { PhAlbumCategory, PhRoomProfile, PhVideoItem, PhVideoTab } from '../school-page/ph-school-profile';
import { SCHOOL_REFERENCE_NOTE } from '../school-page/school-reference-note';

export const LA_MER_REFERENCE_NOTE = SCHOOL_REFERENCE_NOTE;

export const LA_MER_PAGE_COPY = {
  breadcrumb: '菲律宾游学 / 宿务学校 / EV La Mer',
  title: '菲律宾宿务 EV La Mer 校区',
  heroLead: 'EV Academy 2025年在麦克坦岛开设的第二校区：白色建筑围着泳池和花园，半斯巴达管理，有成人综合英语、口语强化、50岁以上熟龄课程和亲子家庭套餐。',
  overviewTitle: '30 秒看懂 EV La Mer',
  advisorText: 'La Mer 和 EV 主校区是同一所学校的两个校区，课程、价格和管理各自独立。这里更安静、更像度假村，课程以一对一口语为主，没有雅思和托业，适合想边学边放松的成人、50岁以上的熟龄学员和带孩子来的家庭。平日下午下课后可以外出，学校有接驳车去附近商场。想考雅思，或想要斯巴达式的强管理，选 EV 主校区更合适。',
  campusIntro: '教室、宿舍、餐厅、泳池和健身房都在一个校园里，24小时有保安值守。',
  galleryIntro: '按区域查看校园、教室、住宿、餐厅和设施；相册内用左右箭头或缩略图切换，点击主图可放大。',
  coursesIntro: '四门成人课程都是半斯巴达管理，每节45分钟；每门课下面是每天的课时，点开可看课程内容。带孩子来请看报价里的亲子套餐。',
  roomsPhotoIntro: '点选房型查看实景；各房型价格见上方住宿费表。',
  finalCtaTitle: '想确认 La Mer 的空房、亲子名额和正式报价？',
  finalCtaText: '把入学日期、周数、同行人数和想住的房型发给顾问，我们帮你核对学校当期价格、空房、亲子名额和到校费用。',
} as const;

export const LA_MER_OVERVIEW_FACTS: ReadonlyArray<{ icon: string; label: string; value: string }> = [
  { icon: 'location_on', label: '位置', value: '宿务麦克坦岛 Cordova，离机场约25分钟' },
  { icon: 'history_edu', label: '开设', value: '2025年开设，EV Academy 第二校区' },
  { icon: 'rule', label: '管理', value: '半斯巴达，平日下课后可外出' },
  { icon: 'menu_book', label: '课程', value: '经典ESL、口语强化6／8、熟龄英语（50岁以上）' },
  { icon: 'family_restroom', label: '亲子', value: '监护人和7岁以上孩子同住，整包价含学杂费' },
  { icon: 'bed', label: '住宿', value: '单人到四人间，有直通泳池的双人间' },
  { icon: 'pool', label: '设施', value: '泳池、健身房、瑜伽室、娱乐室、咖啡厅' },
  { icon: 'directions_bus', label: '出行', value: '学校接驳车去 SM Seaside 和 Shang’s Mall' },
];

export const LA_MER_QUICK_INFO: ReadonlyArray<{ icon: string; title: string; text: string }> = [
  { icon: 'location_on', title: '麦克坦岛 Cordova', text: '离机场约25分钟，周边安静' },
  { icon: 'rule', title: '半斯巴达', text: '平日17:10下课后可外出' },
  { icon: 'family_restroom', title: '亲子与熟龄', text: '孩子7岁起，熟龄课程50岁以上' },
  { icon: 'pool', title: '度假村式校园', text: '泳池、花园和屋顶草坪' },
];

export const LA_MER_BASIC_INFO: readonly BasicInfoRow[] = [
  { label: '学校', value: 'EV Academy La Mer Campus' },
  { label: '位置', value: '菲律宾宿务麦克坦岛 Cordova（Gabi）' },
  { label: '开设', value: '2025年，EV Academy 第二校区' },
  { label: '管理', value: '半斯巴达' },
  { label: '课程', value: '经典ESL、熟龄英语、口语强化6、口语强化8、亲子家庭课程' },
];

export const LA_MER_SUITABLE_FOR: readonly string[] = [
  '想多练口语、又想住得舒服的成人',
  '50岁以上、想边学英语边交朋友的熟龄学员',
  '想陪7岁以上孩子一起学英语的家庭',
];

export const LA_MER_NOT_SUITABLE_FOR: readonly string[] = [
  '要考雅思、托业：La Mer 没有考试课程，请看 EV 主校区',
  '想要斯巴达管理、晚上还有课和自习',
  '亲子家庭：学校不提供保姆，课后由监护人照顾孩子',
];

export const LA_MER_CAMPUS_BUILDINGS: readonly CampusBuildingCard[] = [
  { code: 'STUDY', title: '教学区', icon: 'school', facilities: ['一楼和二楼教室', '一对一教室和小组教室', '会议室'] },
  { code: 'DORM', title: '宿舍', icon: 'bed', facilities: ['一楼和二楼宿舍', '有直通泳池的房间', '宿舍有 Wi-Fi'] },
  { code: 'LIFE', title: '休闲设施', icon: 'pool', facilities: ['泳池（06:00–22:00）', '健身房（15岁以上）', '瑜伽室、娱乐室', '篮球、乒乓球'] },
  { code: 'DINING', title: '餐饮', icon: 'restaurant', facilities: ['一楼学生餐厅，一日三餐，周末也有', '咖啡厅：咖啡、零食、电话卡'] },
];

const campus = (file: string) => `assets/la-mer/campus/${file}.webp`;
const study = (file: string) => `assets/la-mer/study/${file}.webp`;
const life = (file: string) => `assets/la-mer/life/${file}.webp`;
const room = (file: string) => `assets/la-mer/rooms/${file}.webp`;
const image = (category: PhAlbumCategory, title: string, description: string, src: string): GalleryImage =>
  ({ category, title, description, src });

export const LA_MER_GALLERY_IMAGES: readonly GalleryImage[] = [
  image('校园', '泳池与校园日落', '白色建筑围着中央泳池', campus('pool-sunset')),
  image('校园', '白天的泳池庭院', '泳池在校园正中', campus('pool-day')),
  image('校园', 'La Mer 校区', '校区标志', campus('sign')),
  image('校园', '泳池小桥', '连接校园两侧的小桥', campus('bridge-logo')),
  image('校园', '教学和宿舍楼', '教室和宿舍都在校内', campus('main-building')),
  image('校园', '花园步道', '楼间的花园小路', campus('garden-path')),
  image('校园', '屋顶草坪', '屋顶的休息草坪', campus('rooftop-lawn')),
  image('校园', '蓝色窗户', '圣托里尼风格的外墙', campus('blue-window')),
  image('校园', '圣托里尼露台', '白墙蓝窗的休息区', campus('santorini-terrace')),
  image('校园', '露台一角', '露台休息区', campus('santorini-corner')),
  image('校园', '泳池和小桥', '从泳池另一侧看小桥', campus('pool-bridge')),
  image('校园', '泳池躺椅', '泳池边的躺椅', campus('pool-loungers')),
  image('校园', '夜晚的泳池', '晚上的校园', campus('night-pool')),
  image('校园', '夜晚的花园', '晚上的花园', campus('night-garden')),
  image('校园', '夜晚的小桥', '晚上的小桥', campus('night-bridge')),
  image('校园', '大堂', '学校大堂', campus('lobby-1')),
  image('校园', '大堂休息区', '大堂的座位', campus('lobby-2')),
  image('校园', '前台', '办理入学和日常事务', campus('reception')),
  image('教室', '一对一教室', '一位老师带一位学生', study('mtm-room')),
  image('教室', '一对一上课', '一对一课堂', study('mtm-class')),
  image('教室', '小组教室', '小组课教室', study('group-room')),
  image('教室', '小组课', '小组课堂', study('group-class')),
  image('教室', '会议室', '大组课和活动', study('conference-room')),
  image('教室', '会议室上课', '会议室里的课堂', study('conference-class')),
  image('教室', '教学走廊', '教室外的走廊', study('hallway')),
  image('住宿', '单人间', '一人一间，带浴缸', room('single-1')),
  image('住宿', '直通泳池双人间', '房门外就是泳池', room('pool-double-1')),
  image('住宿', '标准双人间', '两人一间', room('double-1')),
  image('住宿', '三人间', '三人一间', room('triple-1')),
  image('住宿', '四人间', '四人一间', room('quad-1')),
  image('餐厅', '学生餐厅', '一楼学生餐厅', life('restaurant-1')),
  image('餐厅', '自助餐台', '一日三餐，周末也有', life('restaurant-buffet')),
  image('餐厅', '餐厅露台', '可以在户外用餐', life('restaurant-terrace')),
  image('餐厅', '餐厅外的泳池', '从餐厅看泳池', life('restaurant-pool-view')),
  image('餐厅', '学生餐', '餐厅的一餐', life('meal-1')),
  image('餐厅', '学生餐', '餐厅的一餐', life('meal-2')),
  image('餐厅', '学生餐', '餐厅的一餐', life('meal-3')),
  image('餐厅', '学生餐', '餐厅的一餐', life('meal-4')),
  image('餐厅', '饮料', '餐厅饮料', life('meal-drinks')),
  image('餐厅', '咖啡厅', '咖啡、零食和电话卡', life('cafe-counter')),
  image('餐厅', '咖啡厅吧台', '咖啡厅', life('cafe-bar')),
  image('餐厅', '小卖部', '零食和日用品', life('shop-1')),
  image('餐厅', '小卖部货架', '零食和日用品', life('shop-2')),
  image('设施', '泳池', '06:00–22:00 开放，上课时间除外', life('pool-1')),
  image('设施', '泳池', '课后在泳池放松', life('pool-2')),
  image('设施', '夜晚的泳池', '晚上的泳池', life('pool-night')),
  image('设施', '水中尊巴', '每月一次的水中尊巴', life('aqua-zumba-1')),
  image('设施', '水中尊巴', '水中尊巴活动', life('aqua-zumba-2')),
  image('设施', '健身房', '15岁以上可用', life('gym-1')),
  image('设施', '健身房器械', '健身房', life('gym-2')),
  image('设施', '乒乓球', '球拍可向大堂保安借', life('table-tennis')),
  image('设施', '篮球场', '平日17:10后可以打球', life('basketball')),
  image('设施', '泳池边的亲子家庭', '亲子家庭的课后时间', life('junior-students')),
];

export const LA_MER_ALBUM_DESCRIPTIONS: Record<PhAlbumCategory, string> = {
  校园: '泳池、花园、屋顶草坪与大堂',
  教室: '一对一、小组课与会议室',
  住宿: '单人间到四人间、直通泳池双人间',
  餐厅: '学生餐厅、咖啡厅与小卖部',
  设施: '泳池、健身房、球类与活动',
};

const video = (name: string, title: string, text: string, duration: string, shape: PhVideoItem['shape']): PhVideoItem => ({
  title,
  text,
  src: `/assets/la-mer/videos/${name}.mp4`,
  poster: `/assets/la-mer/videos/${name}.jpg`,
  duration,
  shape,
});

// campus-tour, promo and lunch are the school's own; the rest were filmed on campus by 思达启航 (2026-11).
export const LA_MER_VIDEOS = {
  campusTour: video('campus-tour', 'La Mer 校园导览', '跟着镜头走一遍校园和泳池。', '0:31', 'wide'),
  promo: video('promo', 'La Mer 宣传片', '课堂、宿舍、餐厅和课后活动。', '2:49', 'wide'),
  pool: video('pool', '学校泳池', '思达启航实拍：泳池和花园。', '0:16', 'tall'),
  classes: video('classes', '教室和课堂', '思达启航实拍：教学走廊、一对一和团体课。', '0:29', 'tall'),
  roomPoolDouble: video('room-pool-double', '直通泳池双人间实拍', '思达启航实拍：从阳台就能下到泳池。', '0:33', 'tall'),
  roomDouble: video('room-double', '标准双人间实拍', '思达启航实拍：两张单人床、书桌和阳台。', '0:22', 'tall'),
  roomQuad: video('room-quad', '四人间实拍', '思达启航实拍：床位、书桌、卫浴和阳台。', '0:33', 'tall'),
  diningHall: video('dining-hall', '学生餐厅', '思达启航实拍：一楼学生餐厅。', '0:13', 'tall'),
  lunch: video('lunch', '学生餐厅的午餐', '餐厅的一顿午饭。', '0:12', 'tall'),
  shop: video('shop', '校园小卖部', '思达启航实拍：零食、饮料和日用品。', '0:25', 'tall'),
  gym: video('gym', '健身房', '思达启航实拍：健身房器械。', '0:07', 'tall'),
} as const;

/**
 * Hero album video chips, named like the photo chips; the promo film opens the album (its aerial poster looks best,
 * user decision 2026-11-24). The three room clips each show exactly one room type (checked frame by frame
 * 2026-11-24), so they also open that room's photos.
 */
export const LA_MER_VIDEO_TABS: readonly PhVideoTab[] = [
  { label: '校园视频', icon: 'videocam', items: [LA_MER_VIDEOS.promo, LA_MER_VIDEOS.campusTour] },
  { label: '教室视频', icon: 'videocam', items: [LA_MER_VIDEOS.classes] },
  { label: '住宿视频', icon: 'videocam', items: [LA_MER_VIDEOS.roomPoolDouble, LA_MER_VIDEOS.roomDouble, LA_MER_VIDEOS.roomQuad] },
  { label: '餐厅视频', icon: 'videocam', items: [LA_MER_VIDEOS.diningHall, LA_MER_VIDEOS.lunch, LA_MER_VIDEOS.shop] },
  { label: '设施视频', icon: 'videocam', items: [LA_MER_VIDEOS.pool, LA_MER_VIDEOS.gym] },
];

/** The first item of a room's photo album. */
export const LA_MER_ROOM_VIDEOS: Readonly<Record<string, PhVideoItem>> = {
  'pool-double': LA_MER_VIDEOS.roomPoolDouble,
  double: LA_MER_VIDEOS.roomDouble,
  quad: LA_MER_VIDEOS.roomQuad,
};

const DORM_HIGHLIGHTS = ['一日三餐，周末也供应', '空调、热水、冰箱和吹风机', '每周打扫两次、每周换床单', '宿舍有 Wi-Fi，24小时保安'];
const roomProfile = (
  id: string, label: string, gallery: readonly string[], suitable: string, note: string, highlights: readonly string[] = DORM_HIGHLIGHTS,
): PhRoomProfile => ({
  id, label, location: '校内', suitable, note, highlights: [...highlights], rateIds: [id],
  image: gallery[0],
  gallery,
  imageAlt: `EV La Mer ${label}实景`,
});
const roomGallery = (prefix: string, count: number) => Array.from({ length: count }, (_, index) => room(`${prefix}-${index + 1}`));

export const LA_MER_ROOM_PROFILES: readonly PhRoomProfile[] = [
  roomProfile('single', '单人间', roomGallery('single', 5), '重视隐私、想有自己空间的学员', '一人一间，带浴缸。', ['独立浴缸', ...DORM_HIGHLIGHTS]),
  roomProfile('pool-double', '直通泳池双人间', roomGallery('pool-double', 4), '朋友或夫妻同行、喜欢下楼就能游泳的学员', '两人一间，房门外就是泳池；按每人计价。', ['房门直通泳池', ...DORM_HIGHLIGHTS]),
  roomProfile('double', '标准双人间', roomGallery('double', 6), '朋友同行或想兼顾预算的学员', '两人一间；按每人计价。部分房间带浴缸，以学校实际分配为准。'),
  roomProfile('triple', '三人间', roomGallery('triple', 6), '想控制预算的学员', '三人一间；按每人计价。'),
  roomProfile('quad', '四人间', roomGallery('quad', 7), '预算优先的学员', '四人一间；按每人计价。'),
];

export const LA_MER_COURSE_GROUPS: ReadonlyArray<{ icon: string; title: string; text: string; courseIds: readonly string[] }> = [
  { icon: 'forum', title: '综合英语', text: '听说读写打基础', courseIds: ['esl-classic'] },
  { icon: 'record_voice_over', title: '口语强化', text: '每天6至8节一对一', courseIds: ['power-speaking-6', 'power-speaking-8'] },
  { icon: 'elderly', title: '熟龄课程', text: '50岁以上', courseIds: ['senior'] },
];

// A guide with courseIds opens inside those course rows; the others are listed once under 所有课程通用说明.
export const LA_MER_COURSE_DETAIL_GUIDES: readonly CourseDetailGuide[] = [
  {
    icon: 'record_voice_over',
    title: '口语强化课怎么上',
    subtitle: '一对一全部练口语',
    courseIds: ['power-speaking-6', 'power-speaking-8'],
    facts: [
      { label: '口语强化6', value: '6节一对一（流利口语、会话、有效沟通、词汇、时事讨论、阅读）＋小组演讲课＋大组口语课' },
      { label: '口语强化8', value: '8节一对一，在口语强化6之外再加 Northstar 口语和公众演讲' },
    ],
    points: ['适合工作常要开口的人、想多练实用口语的大学生和上班族，以及想改发音和口音的学员。'],
  },
  {
    icon: 'elderly',
    title: '熟龄英语',
    subtitle: '面向50岁以上的学员',
    courseIds: ['senior'],
    facts: [
      { label: '一对一', value: '流利口语、会话、有效沟通、词汇' },
      { label: '团体课', value: '语法、听力、演讲、口语' },
    ],
    points: ['课程之外有适合熟龄学员的休闲活动，如文化参观和海滩活动，具体以学校当期安排为准。'],
  },
  {
    icon: 'family_restroom',
    title: '亲子家庭套餐',
    subtitle: '监护人和7岁以上孩子同住',
    facts: [
      { label: '孩子', value: '每天5节一对一：阅读、写作、听力、口语、词汇' },
      { label: '监护人', value: '每天3节一对一（阅读、写作、口语）＋2节团体课（语法、演讲、听力、口语）' },
      { label: '整包价含', value: '课程、住宿、三餐、清洁、SSP、SSP E-CARD、学生证、水电、管理费、教材和接机' },
      { label: '另付', value: '签证续签、ACR I-CARD 和可退押金按人另付；每周用电超过15度按每度20比索' },
    ],
    points: [
      '至少1位监护人和1位孩子，2–4人一户；每期最多10个家庭，先到先得。',
      '报名时每人付500美元订金（含在整包价里），余款在出发前4周付清；报名后不能改期或转让。',
      '学校不提供保姆服务，课后由监护人照顾孩子，孩子外出须监护人陪同。',
    ],
    notice: '亲子套餐在报价器的“课程”里选择，按入学日期自动套用淡季或旺季整包价。',
  },
  {
    icon: 'quiz',
    title: '测试、换课与加课',
    subtitle: '每4周升级测试',
    facts: [
      { label: '升级测试', value: '每4周的周四第1、2节课；读3周的在最后一周周四考' },
      { label: '换课换老师', value: '周二申请周三生效，周五申请下周一生效' },
      { label: '换课程类型', value: '每次1,000比索，另补课程差价' },
      { label: '加课', value: '加一对一每4周8,000比索，加团体课每4周3,000比索；周末一对一每节500比索' },
      { label: '教师培训日', value: '每月最后一个周五每节课20分钟，12:05下课' },
    ],
    points: [],
  },
  {
    icon: 'apps',
    title: '免费选修课',
    subtitle: '自愿参加',
    facts: [{ label: '科目', value: '语法、写作、口语、青少年活动课' }],
    points: ['每天08:00–17:10之间可以免费上1节选修课，是否开课看报名人数。'],
  },
];

const row = (time: string, activity: string, kind: DailyScheduleRow['kind']): DailyScheduleRow => ({ time, activity, kind });

/** Monday to Friday; 8 regular classes and one free elective among the ten periods. */
export const LA_MER_SCHEDULE: readonly DailyScheduleRow[] = [
  row('07:00–08:00', '早餐', 'meal'),
  row('08:00–08:45', '第1节', 'class'),
  row('08:50–09:35', '第2节', 'class'),
  row('09:40–10:25', '第3节', 'class'),
  row('10:30–11:15', '第4节', 'class'),
  row('11:20–12:05', '第5节', 'class'),
  row('12:05–13:05', '午餐', 'meal'),
  row('13:05–13:50', '第6节', 'class'),
  row('13:55–14:40', '第7节', 'class'),
  row('14:45–15:30', '第8节', 'class'),
  row('15:35–16:20', '第9节', 'class'),
  row('16:25–17:10', '第10节', 'class'),
  row('17:15–18:00', '自由时间（尊巴、瑜伽等活动）', 'activity'),
  row('18:00–19:00', '晚餐', 'meal'),
  row('19:00–', '自由时间', 'free'),
];

export const LA_MER_DORM_RULES: ReadonlyArray<{ title: string; text: string }> = [
  { title: '门禁', text: '周一至周四22:00，周五24:00，周六05:00–24:00，周日05:00–22:00；超时30分钟内扣2分，超过30分钟扣5分。' },
  { title: '未成年学生', text: '平日不能外出；周末须监护人陪同，门禁21:00。' },
  { title: '外宿与旅行', text: '外出旅行须提前一个工作日交旅行申请；未经学校同意不能在外过夜。' },
  { title: '宿舍', text: '不能进入异性房间（违者开除），也不能进别人的房间；校内禁酒，只能在指定区域吸烟，宿舍不能做饭。' },
  { title: '泳池', text: '06:00–22:00 开放，上课时间除外；未成年人须在监护人看护下使用。' },
  { title: '扣分', text: '累计扣分超过上限会被开除且不退款：1–12周10分，13–18周15分，19周以上20分。' },
  { title: '换房与赔偿', text: '换房每次1,000比索；丢失学生证或钥匙各500比索。' },
  { title: '退房', text: '最后一周周六中午12点前退房，行李放到警卫室；离校当天领回护照、结业证书和押金。' },
];

export const LA_MER_FIRST_DAY: ReadonlyArray<{ label: string; value: string }> = [
  { label: '07:00', value: '早餐' },
  { label: '08:00', value: '入学测试：带护照原件、往返机票复印件（学校留存）和黑笔' },
  { label: '11:35', value: '午餐，拍学生证照片（续签也会用到）' },
  { label: '12:35', value: '换钱、由学校工作人员带去买日用品' },
  { label: '15:00', value: '在办公室缴到校学杂费' },
  { label: '15:30', value: '中国经理介绍校园生活和校规' },
  { label: '18:45', value: '语法测试，带手机' },
];

export const LA_MER_PRACTICAL_GUIDES: readonly CampusPracticalGuide[] = [
  {
    icon: 'event', eyebrow: 'FIRST DAY', title: '到校第一天（周一）', facts: [...LA_MER_FIRST_DAY],
    points: ['第一天下午17:05–18:45不能外出，语法测试后可以外出，门禁22:00。'], note: '',
  },
  {
    icon: 'room_service', eyebrow: 'SCHOOL SERVICES', title: '学校服务',
    facts: [
      { label: '清洁', value: '每周打扫房间两次，每周换一次床单' },
      { label: '洗衣', value: '周一至周四12:05–13:05在一楼洗衣房送洗；女生周一、周三取，男生周二、周四取' },
      { label: '咖啡厅', value: '平日07:30–20:00，周末13:00–20:00；有零食、饮料和 Smart 电话卡' },
      { label: '医务室', value: '周一至周五08:00–17:00有护士，不提供药品' },
      { label: '网络', value: '宿舍有 Wi-Fi，菲律宾网速偏慢' },
    ],
    points: ['贵重物品请放房间保险箱；大额现金可寄存在办公室。'],
    note: '',
  },
  {
    icon: 'directions_bus', eyebrow: 'SHUTTLE', title: '学校接驳车',
    facts: [
      { label: '平日', value: '17:30出发，21:00返校' },
      { label: '周末', value: '10:30出发，15:00返校' },
      { label: '去哪里', value: 'SM Seaside（周一、三、五、日），Shang’s Mall（周二、四、六）' },
    ],
    points: ['须在前一天17:30前到大厅登记，先到先得；没登记直接上车扣5分。'],
    note: '',
  },
  {
    icon: 'celebration', eyebrow: 'ACTIVITIES', title: '校园与周末活动',
    facts: [
      { label: '尊巴', value: '每周二、周四17:30–18:00' },
      { label: '瑜伽', value: '每周一、周三18:00–18:30／18:30–19:00' },
      { label: '水中尊巴', value: '每月一次' },
      { label: '周末活动', value: '跳岛、Oslob、宿务市区游等，自费，周四16:30前付款报名' },
    ],
    points: ['活动视天气和人数调整；天气不好取消会退费。'],
    note: '',
  },
  {
    icon: 'receipt_long', eyebrow: 'OTHER FEES', title: '其他收费',
    facts: [
      { label: '送机', value: '1,200比索' },
      { label: '提前到或延住', value: '每晚2,000比索' },
      { label: '护照加急', value: '500比索' },
      { label: 'ECC 离境证明', value: '读满6个月以上1,010比索' },
    ],
    note: '到校后按比索在学校缴纳。',
  },
  {
    icon: 'rule', eyebrow: 'BEFORE YOU APPLY', title: '报名前须知', facts: [],
    points: [
      '学生必须买保险，入学前办好；在校受伤或生病按保险理赔。',
      '想在校延长就读，至少提前4周申请，延长部分的学费在开始前2周付清；入境材料由思达启航顾问帮你逐项核对。',
      '健身房15岁以上才能使用。',
    ],
    note: '',
  },
];

const ORDINARY_FEES_FAQ: FaqItem = {
  question: '页面上的报价包含哪些费用？',
  answer: '学校费用（注册费、课程费、住宿费、旺季附加费和优惠）以美元计；到校学杂费（SSP学习许可、签证续签、水电、管理费、学生证等）以比索在学校缴纳，两部分分开显示。教材按书单实购，接机和可退押金另列，不计入合计。',
};

export const LA_MER_FAQS: readonly FaqItem[] = [
  {
    question: 'La Mer 和 EV 主校区有什么不同？',
    answer: '两个校区课程、价格和管理各自独立。La Mer 在麦克坦岛，环境更像度假村，只有半斯巴达管理和成人、熟龄、亲子课程；EV 主校区在宿务市区，有斯巴达管理、雅思和托业课程，校内还有 IDP 雅思考点。',
  },
  {
    question: '孩子几岁可以来？',
    answer: '亲子家庭课程要求孩子7岁以上，至少1位监护人陪同，2–4人一户。学校不提供保姆，课后由监护人照顾孩子。',
  },
  {
    question: '亲子套餐包含哪些费用？',
    answer: '整包价含课程、住宿、三餐、清洁、SSP、SSP E-CARD、学生证、水电、管理费、教材和接机。签证续签、ACR I-CARD 和可退押金按每位成员另付；每周用电超过15度按每度20比索收取。',
  },
  {
    question: '熟龄英语适合谁？',
    answer: '学校为50岁以上学员开设，一对一练流利口语、会话和沟通，团体课学语法和听力，另有适合熟龄学员的休闲活动。',
  },
  {
    question: '平时可以外出吗？离市区远吗？',
    answer: '可以。平日17:10下课后可外出，门禁周一至周四22:00、周五24:00。学校接驳车平日17:30去 SM Seaside 或 Shang’s Mall，21:00返校，须提前一天登记。',
  },
  {
    question: '在 La Mer 能准备雅思吗？',
    answer: 'La Mer 没有雅思和托业课程。要考雅思，请看 EV 主校区的雅思和雅思保分班。',
  },
  {
    question: '有哪些优惠？',
    answer: '2026/08/24–12/31 开课（以周一开课日算），学校每人每周减50美元；思达启航学员在学校优惠后，课程和住宿再打95折，亲子套餐整包也打95折。报价器会按日期自动计算。',
  },
  ORDINARY_FEES_FAQ,
  {
    question: '报价准吗？',
    answer: '报价按学校当期价格和规则计算，空房、亲子名额和最终金额以学校确认为准，报名前顾问会和学校再核对一次。',
  },
];

export const LA_MER_CTA_BADGES: readonly string[] = ['学校当期价格', '亲子整包价', '到校学杂费另列'];

// Text and data of the CPI school page, from CPI's 2026 school introduction, the 2026-10-09 new-student
// orientation, the 2027 price list, the 2026-11-04 promotion notice, the IELTS Guarantee sheet and the
// Premium Residence brochure (all received 2026-11-21). The shared Philippine school template reads it
// through cpi-page-profile.ts. Keep it pure data (no Angular, DOM or storage), so the WeChat mini program
// can reuse it. Never add the school's phone, address, website or social accounts.
import type {
  BasicInfoRow,
  CampusBuildingCard,
  CampusPracticalGuide,
  CourseDetailGuide,
  DailyScheduleRow,
  FaqItem,
  GalleryImage,
} from '../cia-school/cia-page-content';
import type { PhRoomProfile } from '../school-page/ph-school-profile';
import { SCHOOL_REFERENCE_NOTE } from '../school-page/school-reference-note';

/** Closes every content section once; the same line as on every Philippine school page. */
export const CPI_REFERENCE_NOTE = SCHOOL_REFERENCE_NOTE;

export const CPI_PAGE_TEXT = {
  heroLead: '宿务市区山坡上的度假村式校园，半斯巴达管理，适合想学习和生活兼顾的成人和亲子家庭。',
  advisorText: 'CPI 校园像度假村，住宿选择多：校内A栋、B栋，还有新开的校外Premium公寓，生活很舒服。学习是半斯巴达管理，想更严格可以申请斯巴达。适合想学习和生活兼顾的成人、带孩子的家庭，以及想住得更独立的上班族和长期学生。',
  campusIntro: '教学楼、宿舍、餐厅、泳池和健身房都在同一个校园里，宿舍分A栋和B栋。',
  galleryIntro: '按区域查看校园、教室、住宿、餐厅和设施；相册内用左右箭头或缩略图切换，点击主图可放大。',
  coursesIntro: '按学习目标分组，每门课下面是每天的课时；点开可看适合人群和说明。每节课45分钟。',
  roomsPhotoIntro: '点选房型查看实景；各房型价格见上方住宿费表。',
  finalCtaTitle: '想确认 CPI 的空房和最新优惠？',
  finalCtaText: '告诉顾问你的入学日期、周数和想住的房型，我们帮你确认房间并做一份完整报价。',
} as const;

export const CPI_QUICK_INFO = [
  { icon: 'location_on', title: '宿务市区', text: 'Lahug山坡上，到市区商场约5分钟车程' },
  { icon: 'verified', title: '半斯巴达', text: '可申请斯巴达；有课的前一晚21:00前回校' },
  { icon: 'school', title: '130间一对一教室', text: '每节45分钟；1:4小组课最多5人' },
  { icon: 'pool', title: '奥运规格泳池', text: '健身房、咖啡厅、自习室都在校内' },
  { icon: 'apartment', title: '3类住宿', text: 'A栋、B栋宿舍和校外Premium公寓' },
  { icon: 'event_available', title: '旺季不加价', text: '12–2月、6–8月没有旺季附加费，但房间紧张' },
];

/** Key facts under the hero title (compact layout); what each area has is in CPI_CAMPUS_BUILDINGS. */
export const CPI_OVERVIEW_FACTS: ReadonlyArray<{ icon: string; label: string; value: string }> = [
  { icon: 'location_on', label: '位置', value: '宿务市 Lahug 区山坡上，到市区商场约5分钟车程' },
  { icon: 'rule', label: '管理', value: '半斯巴达，可申请斯巴达；有课的前一晚21:00前回校' },
  { icon: 'menu_book', label: '课程', value: '一般／密集英语、雅思、托业、托福、商务英语；6–15岁青少年和家长课程' },
  { icon: 'event', label: '入学', value: '每周日入住，周一分级测试后开课' },
  { icon: 'bed', label: '住宿', value: '校内A栋、B栋宿舍，另有校外Premium酒店式公寓' },
  { icon: 'event_available', label: '旺季', value: '12–2月、6–8月不加价，但房间紧张，建议提前订' },
];

export const CPI_BASIC_INFO: BasicInfoRow[] = [
  { label: '学校', value: 'Cebu Pelis Institute（CPI）' },
  { label: '位置', value: '菲律宾宿务市 Lahug 区山坡上' },
  { label: '管理方式', value: '半斯巴达（可申请斯巴达）' },
  { label: '课程', value: '一般／密集英语、雅思、托业、托福、商务英语、青少年和家长课程' },
  { label: '住宿', value: '校内A栋、B栋宿舍；校外Premium酒店式公寓' },
  { label: '入学', value: '每周日入住，周一分级测试后开课' },
];

export const CPI_SUITABLE_FOR = [
  '第一次游学、想住得舒服的成人',
  '带6–15岁孩子的亲子家庭',
  '想住独立公寓的夫妻、上班族和长期学生',
  '准备雅思、托业、托福或商务英语的学生',
];

export const CPI_NOT_SUITABLE_FOR = [
  '只看最低预算的学生（单人间和Premium公寓价格较高）',
  '想在海边上学的学生（学校在市区山坡上）',
  '旺季（12–2月、6–8月）才临时报名的学生：房间紧张，要尽早订',
];

export const CPI_CAMPUS_BUILDINGS: CampusBuildingCard[] = [
  { code: 'STUDY', title: '教学区', icon: 'school', facilities: ['130间一对一教室', '20间1:4小组教室、4间1:8团体教室', '会议室和4间多功能教室', '自习室每天08:00–23:00'] },
  { code: 'DORM', title: '校内宿舍', icon: 'bed', facilities: ['A栋：单人到上床下桌四人间', 'B栋：房间更大，有家庭房和女生六人间', '定期打扫、每周换床单、免费洗衣'] },
  { code: 'LIFE', title: '休闲设施', icon: 'pool', facilities: ['奥运规格泳池，分儿童、成人和跳水区', '健身房每天07:00–23:00', '咖啡厅（周六休息）'] },
  { code: 'DINING', title: '餐厅', icon: 'restaurant', facilities: ['约250个座位，有空调', '一日三餐，早餐和晚餐自助', '周末和假日也供应三餐'] },
];

const campus = (file: string) => `assets/cpi/campus/${file}.webp`;
const rooms = (file: string) => `assets/cpi/rooms/${file}.webp`;
const premium = (file: string) => `assets/cpi/premium/${file}.webp`;
const dorm = (file: string) => `assets/cpi/dorm-photos/${file}`;

export const CPI_GALLERY_IMAGES: GalleryImage[] = [
  { category: '校园', title: 'CPI校园全景', description: '校园在宿务市Lahug区的山坡上，远处是宿务市区。', src: campus('campus-skyline') },
  { category: '校园', title: 'CPI校区主景', description: '教学楼、宿舍和泳池在同一个校园。', src: 'assets/cpi/campus-exterior.webp' },
  { category: '校园', title: '校园航拍', description: '教学楼和宿舍楼围着中间的泳池，背后是山。', src: campus('campus-aerial') },
  { category: '校园', title: '校园与泳池', description: '从楼上走廊看校园中心的泳池。', src: campus('campus-pool-day') },
  { category: '校园', title: '校园正门广场', description: '校园广场和CPI校旗。', src: campus('campus-front') },
  { category: '校园', title: '校园夜景', description: '晚上的泳池和宿舍楼。', src: campus('campus-night') },
  { category: '校园', title: '校园俯瞰', description: '校园四周是绿地和山景。', src: campus('campus-aerial-02') },
  { category: '教室', title: '一对一教室', description: '共130间，每节课45分钟。', src: campus('class-one-to-one') },
  { category: '教室', title: '小组课教室', description: '1:4小组课和1:8团体课的教室。', src: campus('class-group') },
  { category: '教室', title: '教学楼走廊', description: '教室集中在同一栋楼。', src: campus('class-corridor') },
  { category: '住宿', title: 'B栋单人间', description: '一人一间，B栋房间比A栋大。', src: rooms('b-single-01') },
  { category: '住宿', title: 'B栋双人间A', description: '两张加大床。', src: rooms('b-double-a-01') },
  { category: '住宿', title: 'B栋女生六人间', description: '六张床，带客厅，仅限女生。', src: dorm('six-female-01.jpg') },
  { category: '住宿', title: 'Premium公寓卧室', description: '校外酒店式公寓，距学校约3分钟车程。', src: premium('bedroom') },
  { category: '住宿', title: 'Premium公寓所在大楼', description: 'Hayat Sky Tower酒店大楼。', src: premium('building') },
  { category: '住宿', title: 'Premium公寓无边泳池', description: '住户免费使用。', src: premium('infinity-pool') },
  { category: '住宿', title: 'Premium公寓大堂', description: '24小时前台和保安。', src: premium('lobby') },
  { category: '餐厅', title: '学生餐厅', description: '约250个座位，有空调。', src: campus('dining-hall') },
  { category: '餐厅', title: '自助餐', description: '早餐和晚餐为自助形式。', src: campus('dining-buffet') },
  { category: '餐厅', title: '学生餐', description: '每天的菜色会更换。', src: campus('dining-food') },
  { category: '餐厅', title: '校内咖啡厅', description: '周日至周五11:30–20:00营业。', src: campus('cafe') },
  { category: '餐厅', title: '咖啡厅晚上', description: '课后看书、聊天的地方。', src: campus('cafe-night') },
  { category: '设施', title: '奥运规格泳池', description: '分儿童、成人和跳水区，有开放时间。', src: campus('pool-night') },
  { category: '设施', title: '泳池', description: '课后游泳放松。', src: campus('pool-students') },
];

export const CPI_ALBUM_DESCRIPTIONS = {
  校园: '校园全景、宿舍楼与泳池',
  教室: '一对一、小组和团体教室',
  住宿: 'B栋宿舍与校外Premium公寓',
  餐厅: '学生餐厅、自助餐与咖啡厅',
  设施: '奥运规格泳池',
} as const;

/**
 * A video from CPI's own YouTube channels (CPI Cebu and CPI's Japanese channel), never from an agency.
 * Transcoded to 720p H.264 in public/assets/cpi/videos/. School account end cards, an editing placeholder and
 * every shot showing another company (agency T-shirts, test-prep books, a water park, a CNN slide) were cut
 * out; check every frame of a new clip, including clothing and signs, for other companies or contact details.
 * Landscape clips are big cards ('tour'); vertical clips go in the short-clip row ('life').
 */
export interface CpiVideo {
  name: string;
  title: string;
  description: string;
  duration: string;
  orientation: 'landscape' | 'portrait';
  section: 'tour' | 'life';
  /** Badge on a big card. */
  label?: string;
  /** Points under a big card; the year shows how old the footage is. */
  details?: string[];
}

export const cpiVideoSrc = (video: CpiVideo) => `/assets/cpi/videos/${video.name}.mp4`;
export const cpiVideoPoster = (video: CpiVideo) => `/assets/cpi/videos/poster-${video.name}.jpg`;

export const CPI_VIDEOS: CpiVideo[] = [
  {
    name: 'school-intro', title: 'CPI 学校介绍片', duration: '3:12', orientation: 'landscape', section: 'tour', label: 'SCHOOL FILM',
    description: '一支片子看完CPI：房间、餐厅、泳池、课程，还有潜水、出海和节日活动。',
    details: ['房间、餐厅与泳池', '课程与课后活动', '2019年拍摄'],
  },
  {
    name: 'dorm-tour', title: '宿舍与校园导览', duration: '3:21', orientation: 'landscape', section: 'tour', label: 'DORM TOUR',
    description: '跟着镜头走进A栋、B栋宿舍，看各类房间和卫生间，也看教室、餐厅和泳池。不含新开的Premium公寓。',
    details: ['A栋、B栋房间与卫生间', '教室、餐厅与泳池', '2017年拍摄，英文原声'],
  },
  {
    name: 'meals-activities', title: '餐厅与课后活动', duration: '2:51', orientation: 'landscape', section: 'tour', label: 'MEALS & CLUBS',
    description: '学生餐厅的自助餐，以及课后的尊巴舞、潜水俱乐部和烹饪社等活动。',
    details: ['自助式三餐', '课后活动与社团', '2017年拍摄，英文原声'],
  },
  {
    name: 'junior-program', title: '青少年课程介绍', duration: '0:45', orientation: 'landscape', section: 'tour', label: 'JUNIOR PROGRAM',
    description: '负责青少年课程的老师介绍上课方式和课后、周末活动。想带孩子来读的家长可以先看。',
    details: ['老师英文讲解，英文字幕', '2016年拍摄'],
  },
  {
    name: 'foam-festival', title: '夏日泡沫节', duration: '2:11', orientation: 'landscape', section: 'tour', label: 'CAMPUS EVENT',
    description: '校内夏日活动节的精选片段：白天乒乓球和泳池篮球，晚上泡沫派对。',
    details: ['校内节日活动', '2024年8月拍摄'],
  },
  { name: 'campus-night', title: '夜晚的校园', duration: '0:09', orientation: 'portrait', section: 'life', description: '晚上的泳池和宿舍楼。' },
  { name: 'teachers', title: '老师团队', duration: '0:45', orientation: 'portrait', section: 'life', description: 'CPI的老师们在校园里合影。' },
  { name: 'graduation', title: '每周毕业典礼', duration: '0:51', orientation: 'portrait', section: 'life', description: '结业学员上台发言、表演，大家一起祝贺。' },
  { name: 'ukulele-class', title: '尤克里里课', duration: '0:49', orientation: 'portrait', section: 'life', description: '青少年营的学生在学校餐厅学尤克里里。' },
];

const A_SERVICE = '每周打扫2次、洗衣2次，每周换床单1次';
const B_SERVICE = '每周打扫3次、洗衣3次，每周换床单1次';
const A_HIGHLIGHTS = ['空调、冰箱', '约29.6㎡'];
const B_HIGHLIGHTS = ['空调、冰箱、咖啡壶', '约34.2㎡，比A栋大'];
const dormRoom = (
  id: string, label: string, code: string, englishName: string, bed: string, service: string,
  gallery: string[], suitable: string, note: string, highlights: string[],
): PhRoomProfile => ({
  id, label, englishName, bookingCode: code, location: '校内', bed, service, suitable, note, highlights,
  image: gallery[0], gallery, imageAlt: `CPI${label}实景`,
});
const PREMIUM_GALLERY = [
  premium('bedroom'), premium('room-01'), premium('room-05'), premium('living'),
  premium('room-06'), premium('room-03'), premium('room-07'), premium('room-08'),
  premium('building'), premium('lobby'), premium('infinity-pool'), premium('pool-sunset'),
  premium('gym'), premium('gym-02'), premium('restaurant'),
];

/** Photos come only from CPI's own material and match the labelled room (see public/assets/cpi). */
export const CPI_ROOM_PROFILES: PhRoomProfile[] = [
  dormRoom('a-single', 'A栋单人间', 'A-1', 'DELUXE SINGLE', '1张加大双人床', A_SERVICE,
    [rooms('a-single-01'), rooms('a-single-02')], '重视隐私、需要安静学习空间的学生', '一人一间。', A_HIGHLIGHTS),
  dormRoom('a-double', 'A栋双人间', 'A-2', 'DELUXE DOUBLE', '两张单人床', A_SERVICE,
    [rooms('a-double-01'), rooms('a-double-02')],
    '朋友同行或想兼顾预算的学生', '两人一间，房间最多的房型。', A_HIGHLIGHTS),
  dormRoom('a-triple', 'A栋三人间', 'A-3', 'DELUXE TRIPLE', '三张单人床', A_SERVICE,
    [rooms('a-triple-01'), rooms('a-triple-02')],
    '想控制预算、又不想睡上下铺的学生', '三人一间。', A_HIGHLIGHTS),
  dormRoom('a-quad', 'A栋四人间（上床下桌）', 'A-4', 'DELUXE QUAD', '四张上床下桌', A_SERVICE,
    [rooms('a-quad-02'), rooms('a-quad-01')],
    '预算优先、能接受上床下桌的学生', '床在上、书桌在下，费用最低。', ['空调、热水器', '约31.6㎡']),
  dormRoom('b-single', 'B栋单人间', 'B-1', 'SUPERIOR SINGLE', '1张加大床', B_SERVICE,
    [rooms('b-single-01'), rooms('b-single-02')],
    '想要更大单人空间的学生', 'B栋只有2间单人间，建议尽早确认。', B_HIGHLIGHTS),
  dormRoom('b-double-a', 'B栋双人间A', 'B-2A', 'SUPERIOR DOUBLE A', '两张加大床', B_SERVICE,
    [rooms('b-double-a-01'), rooms('b-double-a-02')], '夫妻、亲子或想睡大床的朋友', '两张加大床，只有2间。', B_HIGHLIGHTS),
  dormRoom('b-double-b', 'B栋双人间B', 'B-2B', 'SUPERIOR DOUBLE B', '两张单人床', B_SERVICE,
    [rooms('b-double-b-01'), rooms('b-double-b-02')], '朋友同行、想住大一点的学生', '两张单人床，只有2间。', B_HIGHLIGHTS),
  dormRoom('b-triple', 'B栋三人间', 'B-3', 'SUPERIOR TRIPLE', '三张单人床', B_SERVICE,
    [rooms('b-triple-01'), rooms('b-triple-02')],
    '三人同行或亲子家庭', 'B栋三人房，共6间。', B_HIGHLIGHTS),
  dormRoom('b-quad', 'B栋家庭房（3张床）', 'B-4', 'SUPERIOR QUAD / FAMILY', '1张加大床 + 2张单人床', B_SERVICE,
    [rooms('b-quad-01'), rooms('b-quad-02')],
    '一家三四口同住', '仅限家庭入住，共3间。', B_HIGHLIGHTS),
  dormRoom('b-hexa', 'B栋六人间（女生）', 'B-6', 'SUPERIOR HEXA', '六张床，带客厅', B_SERVICE,
    [dorm('six-female-01.jpg'), ...['02', '03', '04'].map(n => dorm(`six-female-${n}.webp`)), dorm('six-female-05.jpg'), dorm('six-female-06.webp')],
    '预算优先、喜欢热闹的女生', '仅限女生，共2间。', ['客厅有沙发、餐桌和微波炉', '客厅和房间都有空调']),
  {
    id: 'premium',
    label: 'Premium公寓',
    englishName: 'CPI PREMIUM RESIDENCE',
    bookingCode: 'P-1/P-2',
    location: '校外',
    bed: '单人间1张大床；双人间按入住安排',
    service: '每周打扫3次、换床单1次',
    suitable: '夫妻、亲子家庭、上班族和长期学生',
    note: '在Hayat Sky Tower酒店大楼内，距学校约3分钟车程。共10间，先到先得。',
    highlights: ['无门禁，有小厨房和客厅', '免费健身房和无边泳池', '24小时前台和保安，楼下有便利店', '平日7班、周末6班免费接驳车'],
    image: PREMIUM_GALLERY[0],
    gallery: PREMIUM_GALLERY,
    imageAlt: 'CPI Premium公寓实景',
    variants: {
      'P-1': { label: 'Premium单人间', suitable: '想要独立空间的上班族和长期学生' },
      'P-2': { label: 'Premium双人间', suitable: '夫妻、亲子或朋友同住' },
    },
  },
];

export const CPI_DORM_RULES = [
  { title: '门禁', text: '有课的前一晚（周日至周四、假日）21:00前回校，周五、周六23:00前；23:00–07:00校门关闭。' },
  { title: '外宿', text: '周一至周四不能外宿；周末外宿要先填外宿单。斯巴达学生周一至周四不能外出。' },
  { title: '访客', text: '须提前申请，10:00–17:00，每次30分钟内，不能进宿舍和教室。' },
  { title: '禁止事项', text: '校内禁止喝酒；宿舍内禁止吸烟；男女不能进对方宿舍，男生不能进A栋三楼。' },
  { title: '安静时间', text: '23:00后不能在户外喧哗，01:30后不能在宿舍外逗留。' },
  { title: '护照', text: '由学校统一保管，用于办理SSP和续签；需要用时提前一周申请。' },
  { title: 'Premium公寓', text: '没有门禁；往返学校坐学校的免费接驳车。' },
];

/** One weekday of 密集英语; the profile shows the morning and the afternoon side by side. */
export const CPI_SCHEDULE: DailyScheduleRow[] = [
  { time: '06:50–07:30', activity: 'CNN听力课（自由参加）', kind: 'activity' },
  { time: '07:20–08:10', activity: '早餐', kind: 'meal' },
  { time: '08:10–08:55', activity: '一对一 1', kind: 'class' },
  { time: '09:00–09:45', activity: '一对一 2', kind: 'class' },
  { time: '09:50–10:35', activity: '自习', kind: 'free' },
  { time: '10:40–11:25', activity: '1:4小组课 1', kind: 'class' },
  { time: '11:30–12:15', activity: '1:8团体课', kind: 'class' },
  { time: '12:15–13:00', activity: '午餐', kind: 'meal' },
  { time: '13:15–14:00', activity: '一对一 3', kind: 'class' },
  { time: '14:05–14:50', activity: '一对一 4', kind: 'class' },
  { time: '14:55–15:40', activity: '自习', kind: 'free' },
  { time: '15:45–16:30', activity: '1:4小组课 2', kind: 'class' },
  { time: '16:35–17:20', activity: '一对一 5', kind: 'class' },
  { time: '17:25–18:10', activity: '发音课（斯巴达必上）', kind: 'activity' },
  { time: '18:10–19:00', activity: '晚餐', kind: 'meal' },
  { time: '19:00–22:30', activity: '晚间课程与社团（见下方免费课程）', kind: 'free' },
];

export const CPI_COURSE_DETAIL_GUIDES: CourseDetailGuide[] = [
  {
    icon: 'workspace_premium',
    title: '雅思保证班',
    subtitle: '12周 · 送1次官方雅思考试',
    courseIds: ['ielts-guarantee'],
    facts: [
      { label: 'A班', value: '入学雅思3.0或托业400分，目标4.5分' },
      { label: 'B班', value: '入学雅思4.5或托业650分，目标5.5分' },
      { label: 'C班', value: '入学雅思5.5或托业750分，目标6.5分' },
      { label: '模考', value: '隔周六一次' },
    ],
    points: [
      '读满12周没达到目标分，可以免学费继续上课到达标（住宿费和到校学杂费照付）。',
      '条件：出勤率95%以上（含晚间辅导课），不能减课，整个就读期间警告不超过2次。',
    ],
    notice: '保证条件以学校当期规定为准，报名前顾问会和你逐项确认。',
  },
  {
    icon: 'apps',
    title: '免费课程与社团',
    subtitle: '课后自由参加，不用报名',
    facts: [
      { label: 'CNN听力', value: '周一至周五 06:50–07:30' },
      { label: '发音课', value: '周一至周四 17:25–18:10（斯巴达必上）' },
      { label: '流行英语', value: '周二至周四 19:00–19:45，用歌曲和电影学英语' },
      { label: '口语练习SSP', value: '周二至周四 19:30–22:20，模拟面试和自由讨论' },
      { label: '晚间辅导', value: '周二至周四 21:00–22:30，有老师答疑（斯巴达必上）' },
      { label: '尊巴舞', value: '每周一 19:25–20:20' },
    ],
    points: ['自习室每天08:00–23:00开放。'],
  },
  {
    icon: 'child_care',
    title: '青少年与家长课程',
    subtitle: '6–15岁孩子和陪读家长',
    courseIds: ['junior-6-15', 'parents'],
    facts: [
      { label: '作业辅导', value: '周一至周四 18:30–19:15，周五 16:30–17:10' },
      { label: '才艺课', value: '周二至周四 19:20–20:05（美术、手工、烹饪）' },
      { label: '平日选修', value: '游泳或尤克里里，每门500比索，满10人开课' },
      { label: '可住房型', value: '双人间、三人间、B栋家庭房或Premium双人间' },
    ],
    points: ['一对一老师每天写课堂反馈，家长可以回复。'],
  },
  {
    icon: 'rule',
    title: '上课与换课规定',
    subtitle: '所有课程',
    facts: [
      { label: '每节课', value: '45分钟，课间休息5分钟' },
      { label: '上课天数', value: '每月至少18天，不足时周六补课' },
      { label: '老师', value: '由学校安排，不能指定；老师请假时安排代课' },
      { label: '换课', value: '周二至周四 09:00–16:00 面谈申请，下周一生效' },
      { label: '缺课', value: '每4周无故缺课超过3次，会取消该门课' },
    ],
    points: ['请假要在上课前到前台填假单；每天1次、每周2次、每月4次以内，超过要附医院证明。'],
  },
];

const FIRST_DAY = [
  { label: '08:30', value: '前台集合，交资料' },
  { label: '09:00–12:00', value: '分级测试' },
  { label: '13:00–15:00', value: '拍集体照，课程和生活说明' },
  { label: '15:00–19:00', value: '去Ayala商场换钱、拍证件照、买日用品' },
  { label: '19:30', value: '新生说明会，领教材、收据和课表' },
];

export const CPI_PRACTICAL_GUIDES: CampusPracticalGuide[] = [
  { icon: 'event', eyebrow: 'FIRST DAY', title: '到校第一天（周一）', facts: FIRST_DAY, note: '入境和签证材料由思达启航顾问逐项帮你核对；eTravel入境登记也由顾问协助填写。' },
  {
    icon: 'restaurant',
    eyebrow: 'MEALS & HOURS',
    title: '用餐与开放时间',
    facts: [
      { label: '平日三餐', value: '07:20–08:10 / 11:30–13:00 / 17:30–19:00' },
      { label: '周末与假日', value: '08:00–09:00 / 12:00–13:00 / 18:00–19:00' },
      { label: '咖啡厅', value: '周日至周五 11:30–20:00（14:00–15:00休息），周六休息' },
      { label: '健身房', value: '每天 07:00–23:00' },
      { label: '泳池', value: '平日15:00–18:00、19:00–21:00；周末和假日15:00–18:00' },
    ],
    note: '个别周六学校消毒，当天不供应午餐和晚餐。',
  },
  {
    icon: 'cleaning_services',
    eyebrow: 'SCHOOL SERVICES',
    title: '清洁、洗衣与看病',
    facts: [
      { label: '打扫', value: 'A栋每周2次，B栋每周3次；每周换床单1次' },
      { label: '洗衣', value: '免费，A栋每周2次，B栋每周3次，日晒晾干；用烘干机每次200比索（5公斤内）' },
      { label: '报修', value: '线上或前台申请，一般1–4小时修好' },
      { label: '校医', value: '周一至周五到校看诊，每次500比索，早上9点前到前台预约' },
    ],
    note: '贵重物品请自己保管好。',
  },
  {
    icon: 'directions_bus',
    eyebrow: 'PREMIUM RESIDENCE',
    title: 'Premium公寓接驳车',
    facts: [
      { label: '平日', value: '07:30、08:30、12:00、13:00、16:30、18:30、20:30' },
      { label: '周末与假日', value: '08:00、10:20、12:00、12:50、14:50、18:00' },
    ],
    note: '学校往返Premium公寓，免费；班次可能按学校安排调整。',
  },
  {
    icon: 'receipt_long',
    eyebrow: 'OTHER FEES',
    title: '其他收费',
    facts: [
      { label: '加课', value: 'ESL一对一每4周7,000比索，考试一对一每4周7,500比索' },
      { label: '电风扇租借', value: '1–12周300比索；13周以上每4周100比索' },
      { label: '额外住宿', value: '单人2,000、双人1,800、三人1,500、四人1,200比索／晚' },
      { label: '送机', value: '平日1,000比索' },
      { label: '其他', value: '丢失房卡850比索，换房500比索，CPI T恤350比索' },
    ],
    note: '到校后用比索在学校缴纳。',
  },
  {
    icon: 'beach_access',
    eyebrow: 'WEEKENDS',
    title: '周末活动',
    facts: [{ label: '常见行程', value: '出海跳岛、Oslob看鲸鲨和Moalboal、Kawasan瀑布溯溪、潜水考证、游艇' }],
    note: '自愿参加、费用自付；出发前要按学校规定填外出申请。',
  },
];

export const CPI_FAQS: FaqItem[] = [
  { question: 'CPI有旺季附加费吗？', answer: '没有。学校的旺季是每年12–2月和6–8月，旺季不加收附加费，但房间比较紧张，建议提前2–3个月预订。' },
  { question: 'CPI是斯巴达还是半斯巴达？', answer: '默认半斯巴达：有课的前一晚21:00前回校，周五、周六23:00前。想更严格可以申请斯巴达，周一至周四不能外出，发音课和晚间辅导必须参加。' },
  { question: 'Premium公寓和校内宿舍有什么不同？', answer: 'Premium公寓在校外的酒店大楼里，约3分钟车程，有小厨房、客厅、无边泳池和健身房，没有门禁，坐免费接驳车上学。价格和B栋同房型一样，电费和管理费照常另收。目前只接受2026/08/31–2027/01/01、2027/03/01–07/02入住，共10间。' },
  { question: '2026–2027年有什么优惠？', answer: '淡季（2026/08/24–2027/01/01、2027/02/22–06/04、2027/08/30–12/31）每个学习周减25美元；12月额外每周再减25美元；住Premium公寓每周再减25美元；2027年2–3月和8–9月开课前20名可加1节一对一。报价器会按你的日期自动计算。' },
  { question: 'CPI适合带孩子去吗？', answer: '适合。6–15岁可读青少年课程，家长可读课量较轻的家长课程；亲子可住双人间、三人间、B栋家庭房或Premium双人间。' },
  { question: '页面上的报价包含全部费用吗？', answer: '学校费用包含注册费、课程费和住宿费，并自动扣除优惠；到校学杂费单独列出，接机和押金另外准备。两者分开显示，不相加。' },
  { question: '思达启航会协助签证和入境吗？', answer: '会。通过思达启航报名，顾问会免费协助菲律宾入境和签证相关手续，你只需要按顾问指引准备个人资料。' },
];

export const CPI_FINAL_CTA_BADGES = ['免费选校建议', '确认空房和优惠', '签证与入境协助'];

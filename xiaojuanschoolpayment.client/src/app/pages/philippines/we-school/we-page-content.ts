// Text and data of the WE Academy (Clark) page, from WE's 2026–2027 brochure, the January 2026 rules, the 2026
// program guide, the 2026 photo pack, the 2027 holiday list, the WE Residence notice and rules, and the 2027
// off-season promotion (received 2026-11-23). The shared Philippine school template reads it through
// we-page-profile.ts. Keep it pure data (no Angular, DOM or storage), so the WeChat mini program can reuse it.
// Never add the school's phone, address, website, social accounts or map link.
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
export const WE_REFERENCE_NOTE = SCHOOL_REFERENCE_NOTE;

export const WE_PAGE_TEXT = {
  heroLead: '克拉克约12,000平方米的度假式校园，成人无门禁、生活自由；有4岁起的幼儿园和青少年课程，适合亲子家庭和想轻松学习的成人。',
  advisorText: 'WE 校园大、绿地多，泳池、高尔夫练习场和健身房都在校内。管理很宽松，成人可以自由外出，没有门禁。最大特点是适合亲子：4–6岁可读幼儿园，小学到初中有青少年课程，家长可以读家长课程，住新建的WE公寓时也可以只陪读不上课。成人可选一般英语、外教混合、考试课或高尔夫英语。旺季不加价，2027年3–6月还有淡季优惠。',
  campusIntro: '教学楼、宿舍、WE公寓、幼儿园、餐厅和运动设施都在同一个校园里。',
  galleryIntro: '按区域查看校园、教室、住宿、餐厅和设施；相册内用左右箭头或缩略图切换，点击主图可放大。',
  coursesIntro: '按学习目标分组，每门课下面是每天的课时；点开可看适合人群和说明。每节课45分钟，小组课最多6人。',
  roomsPhotoIntro: '点选房型查看实景；各房型价格见上方住宿费表。',
  finalCtaTitle: '想确认 WE 的空房和2027淡季优惠？',
  finalCtaText: '告诉顾问入学日期、周数、同行人数和想住的房型，我们帮你确认房间并做一份完整报价。',
} as const;

export const WE_QUICK_INFO = [
  { icon: 'location_on', title: '菲律宾克拉克', text: '距克拉克国际机场约20分钟车程' },
  { icon: 'verified', title: '自由型管理', text: '成人无门禁；未成年人须由监护人陪同' },
  { icon: 'family_restroom', title: '亲子友好', text: '4岁起幼儿园、青少年课程和家长课程' },
  { icon: 'golf_course', title: '校内设施多', text: '泳池、高尔夫练习场、健身房、篮球场' },
  { icon: 'apartment', title: '新建WE公寓', text: '有厨房和客厅，不与陌生人合住' },
  { icon: 'event_available', title: '旺季不加价', text: '旺季报名时每人先付300美元押金，可抵扣学费' },
];

/** Key facts under the hero title (compact layout); what each area has is in WE_CAMPUS_BUILDINGS. */
export const WE_OVERVIEW_FACTS: ReadonlyArray<{ icon: string; label: string; value: string }> = [
  { icon: 'location_on', label: '位置', value: '菲律宾克拉克（安吉利斯市），距克拉克国际机场约20分钟车程' },
  { icon: 'rule', label: '管理', value: '自由型：成人无门禁、可自由外出；未成年人须由监护人陪同外出' },
  { icon: 'menu_book', label: '课程', value: '一般英语、外教混合、托业／托福／雅思／商务、高尔夫英语；4–6岁幼儿园和青少年课程' },
  { icon: 'event', label: '入学', value: '周六15:00后或周日入住，周一分级测试后开课' },
  { icon: 'bed', label: '住宿', value: '校内宿舍（单人到四人间、家庭房），另有新建WE公寓' },
  { icon: 'event_available', label: '旺季', value: '12–2月、6–8月不加价，报名时每人先付300美元押金，可抵扣学费' },
];

export const WE_BASIC_INFO: BasicInfoRow[] = [
  { label: '学校', value: 'WE Academy（WE语言学校）' },
  { label: '位置', value: '菲律宾克拉克（安吉利斯市）' },
  { label: '管理方式', value: '自由型（成人无门禁）' },
  { label: '课程', value: '一般英语、外教混合、考试与商务英语、高尔夫英语、青少年和幼儿园课程' },
  { label: '住宿', value: '校内宿舍、家庭房和新建WE公寓' },
  { label: '入学', value: '周六15:00后或周日入住，周一分级测试后开课' },
];

export const WE_SUITABLE_FOR = [
  '带4岁以上孩子的亲子家庭',
  '想边学英语边享受度假生活的成人',
  '想多上外教课的打工度假或留学准备学生',
  '想在学英语的同时练高尔夫的学生',
];

export const WE_NOT_SUITABLE_FOR = [
  '需要学校严格管理、帮自己自律的学生（WE成人无门禁）',
  '只准备雅思、需要保分承诺的学生（WE没有保分班）',
  '旺季才临时报名、又想住WE公寓的家庭：公寓房间少，要尽早订',
];

export const WE_CAMPUS_BUILDINGS: CampusBuildingCard[] = [
  { code: 'STUDY', title: '教学区', icon: 'school', facilities: ['教学楼1号楼和2号楼', '55间一对一教室、10间小组教室', '课室都有监控，自习室19:00–24:00开放'] },
  { code: 'DORM', title: '宿舍与WE公寓', icon: 'bed', facilities: ['宿舍：单人到四人间', '大号家庭房3间、独栋Green House 1栋', '新建WE公寓：大床房和双大床房'] },
  { code: 'KIDS', title: '幼儿园', icon: 'child_care', facilities: ['独立一栋，招收4–6岁孩子', '08:50–16:15上课，上下午各有点心', '家长和孩子一起在餐厅吃饭'] },
  { code: 'LIFE', title: '运动与生活', icon: 'pool', facilities: ['泳池、高尔夫练习场、健身房', '篮球／羽毛球场、五人制足球场、儿童游乐区', '校内小卖部，步行3分钟有超市和餐厅'] },
];

const asset = (path: string) => `assets/we/${path}.webp`;

export const WE_GALLERY_IMAGES: GalleryImage[] = [
  { category: '校园', title: '教学楼1号楼', description: '一对一教室集中在这栋楼。', src: asset('campus/building-1') },
  { category: '校园', title: '教学楼2号楼', description: '小组课教室在2号楼。', src: asset('campus/building-2') },
  { category: '校园', title: '宿舍楼与草坪', description: '宿舍楼前是大片草坪。', src: asset('campus/dorm-lawn') },
  { category: '校园', title: '宿舍楼', description: '校内宿舍，单人到四人间。', src: asset('campus/dorm-building') },
  { category: '校园', title: '校园夜景', description: '晚上的校园。', src: asset('campus/campus-night') },
  { category: '校园', title: 'WE休息区', description: '课间和课后休息的地方。', src: asset('campus/lounge') },
  { category: '校园', title: 'WE休息区夜景', description: '晚上的休息区。', src: asset('campus/lounge-night') },
  { category: '校园', title: '校园标志', description: '校园里的WE标志。', src: asset('campus/we-love-u') },
  { category: '校园', title: '办公区', description: '学校行政办公区。', src: asset('campus/office-building') },
  { category: '校园', title: '老师团队', description: 'WE的菲律宾老师。', src: asset('campus/teachers') },
  { category: '教室', title: '一对一教室', description: '每节课45分钟。', src: asset('class/one-to-one-room') },
  { category: '教室', title: '成人一对一课', description: '菲教一对一上课。', src: asset('class/one-to-one-adult') },
  { category: '教室', title: '青少年一对一课', description: '孩子的一对一课。', src: asset('class/one-to-one-kid') },
  { category: '教室', title: '小组课', description: '小组课最多6人。', src: asset('class/group-class') },
  { category: '教室', title: '小组课', description: '成人小组课。', src: asset('class/group-class-02') },
  { category: '教室', title: '青少年小组课', description: '孩子们的小组课。', src: asset('class/group-kids') },
  { category: '教室', title: '青少年小组课', description: '孩子们的小组课。', src: asset('class/group-kids-02') },
  { category: '教室', title: '大教室', description: '可以上大班活动的教室。', src: asset('class/big-classroom') },
  { category: '教室', title: '教室', description: '学校的教室。', src: asset('class/green-classroom') },
  { category: '教室', title: 'WE图书馆', description: '校内图书馆，书架上摆满英语读物。', src: asset('class/library') },
  { category: '教室', title: '教材书架', description: '各课程教材按级别摆放。', src: asset('class/textbook-room') },
  { category: '教室', title: '幼儿园区', description: '幼儿园区的彩绘墙面。', src: asset('kinder/kinder-building') },
  { category: '教室', title: '幼儿园教室', description: '4–6岁孩子上课的教室。', src: asset('kinder/kinder-room') },
  { category: '教室', title: '幼儿园上课', description: '幼儿园的小组课。', src: asset('kinder/kinder-class') },
  { category: '教室', title: '幼儿园上课', description: '唱歌、手工和游戏。', src: asset('kinder/kinder-class-02') },
  { category: '教室', title: '幼儿园上课', description: '幼儿园的小组课。', src: asset('kinder/kinder-class-03') },
  { category: '住宿', title: 'WE公寓双大床房', description: '新建公寓，两张大床，有厨房和客厅。', src: asset('residence/two-queen-01') },
  { category: '住宿', title: 'WE公寓大床房', description: '新建公寓，一张大床，有厨房和客厅。', src: asset('residence/one-queen-01') },
  { category: '住宿', title: 'WE公寓外观', description: 'WE公寓在校园里。', src: asset('residence/outside-01') },
  { category: '住宿', title: '宿舍单人间', description: '一人一间。', src: asset('rooms/single-01') },
  { category: '住宿', title: '宿舍双人间', description: '两人一间。', src: asset('rooms/twin-01') },
  { category: '住宿', title: '宿舍三人间', description: '三人一间。', src: asset('rooms/triple-01') },
  { category: '住宿', title: '宿舍四人间', description: '四人一间。', src: asset('rooms/quad-01') },
  { category: '住宿', title: '大号家庭房', description: '适合3–6人的家庭，有独立浴室。', src: asset('rooms/big-01') },
  { category: '住宿', title: 'Green House独栋家庭屋', description: '适合3–4人的家庭，可以自己做饭。', src: asset('rooms/green-01') },
  { category: '餐厅', title: '学生餐厅', description: '平日三餐，周末和假日两餐。', src: asset('dining/cafeteria') },
  { category: '餐厅', title: '学生餐厅', description: '每天至少供应一次新鲜水果。', src: asset('dining/cafeteria-02') },
  { category: '餐厅', title: '学生餐', description: '荤素搭配。', src: asset('dining/buffet') },
  { category: '餐厅', title: '学生餐', description: '每天的菜色会更换。', src: asset('dining/buffet-02') },
  { category: '餐厅', title: '烧烤活动', description: '学校的烧烤活动。', src: asset('dining/bbq') },
  { category: '设施', title: '游泳池', description: '每天06:00–21:00开放，22:00后不能游泳。', src: asset('facility/pool') },
  { category: '设施', title: '游泳池', description: '未成年人须由监护人陪同使用。', src: asset('facility/pool-02') },
  { category: '设施', title: '游泳池', description: '课后游泳放松。', src: asset('facility/pool-03') },
  { category: '设施', title: '高尔夫练习场', description: '高尔夫英语课程在这里上课。', src: asset('facility/golf-range') },
  { category: '设施', title: '高尔夫课', description: '持证菲律宾教练上课。', src: asset('facility/golf-lesson') },
  { category: '设施', title: '健身房', description: '校内健身房。', src: asset('facility/gym') },
  { category: '设施', title: '健身房', description: '有跑步机和力量器械。', src: asset('facility/gym-02') },
  { category: '设施', title: '篮球场', description: '也可以打羽毛球。', src: asset('facility/basketball') },
  { category: '设施', title: '草坪球场', description: '孩子课后在草坪上踢球玩耍。', src: asset('facility/playground') },
  { category: '设施', title: '校内小卖部 WE MART', description: '买零食、饮料和日用品。', src: asset('facility/we-mart') },
];

export const WE_ALBUM_DESCRIPTIONS = {
  校园: '教学楼、宿舍楼、休息区和老师',
  教室: '一对一、小组课、图书馆和幼儿园',
  住宿: 'WE公寓、宿舍和家庭房',
  餐厅: '学生餐厅和每天的餐食',
  设施: '泳池、高尔夫、健身房和运动场',
} as const;

/**
 * A video from WE's own school folder (received 2026-11-23), never from an agency. Transcoded to H.264 in
 * public/assets/we/videos/. Clips with mall or shop signs, other countries' flags, an outside hotel, superlative
 * claims or other companies were left out; check every frame of a new clip before adding it.
 */
export interface WeVideo {
  name: string;
  title: string;
  description: string;
  duration: string;
  /** Badge on a big card. */
  label: string;
  /** Points under a big card. */
  details: string[];
}

export const weVideoSrc = (video: WeVideo) => `/assets/we/videos/${video.name}.mp4`;
export const weVideoPoster = (video: WeVideo) => `/assets/we/videos/poster-${video.name}.jpg`;

export const WE_VIDEOS: WeVideo[] = [
  {
    name: 'campus-film', title: 'WE 学校宣传片', duration: '2:21', label: 'SCHOOL FILM',
    description: '一支片子看完WE：校园、教室、宿舍、餐厅、泳池和高尔夫练习场。',
    details: ['校园与设施', '课堂与宿舍'],
  },
  {
    name: 'arrival', title: '到校第一天', duration: '1:12', label: 'ARRIVAL',
    description: '从机场接机、领欢迎礼包到入住宿舍，先看看到校当天是什么样子。',
    details: ['接机与入住', '宿舍与校园'],
  },
  {
    name: 'campus-day-night', title: '校园的白天和夜晚', duration: '1:00', label: 'CAMPUS',
    description: '2026年10月拍的校园日常，从白天到晚上。',
    details: ['2026年10月拍摄'],
  },
  {
    name: 'classes', title: '课堂片段', duration: '0:20', label: 'CLASSES',
    description: '一对一和小组课的上课片段。',
    details: ['一对一与小组课'],
  },
  {
    name: 'kindergarten', title: 'WE 幼儿园', duration: '2:36', label: 'KINDERGARTEN',
    description: '4–6岁孩子在幼儿园的一天：唱歌、手工、游戏和户外活动。',
    details: ['4–6岁幼儿园课程', '家长可以先看'],
  },
  {
    name: 'residence-one-queen', title: 'WE公寓大床房', duration: '0:25', label: 'WE RESIDENCE',
    description: '新建WE公寓的大床房：卧室、厨房、客厅和浴室。',
    details: ['一张大床', '有厨房和客厅'],
  },
  {
    name: 'residence-two-queen', title: 'WE公寓双大床房', duration: '0:36', label: 'WE RESIDENCE',
    description: '新建WE公寓的双大床房：两张大床，适合2–4人的家庭。',
    details: ['两张大床', '有厨房和客厅'],
  },
];

const room = (file: string) => asset(`rooms/${file}`);
const residence = (file: string) => asset(`residence/${file}`);
const DORM_SERVICE = '每周打扫3次、洗衣3次';
const DORM_HIGHLIGHTS = ['空调，每间房有独立电表', '每层楼有饮水机', '平日三餐，周末和假日两餐'];
const RESIDENCE_HIGHLIGHTS = ['三星变频空调、LG双门冰箱、50英寸智能电视', '厨房有电磁炉、微波炉和电热水壶', '沙发、餐桌、户外桌椅和电子门锁', 'Starlink网络，24小时监控；含餐'];
const RESIDENCE_EXTRAS = [residence('outside-01'), residence('outside-02')];
const range = (prefix: string, count: number) => Array.from({ length: count }, (_, index) => `${prefix}-${String(index + 1).padStart(2, '0')}`);

const dormRoom = (
  id: string, label: string, gallery: string[], suitable: string, note: string, highlights: string[] = DORM_HIGHLIGHTS,
  rateIds: readonly string[] = [id], bed?: string,
): PhRoomProfile => ({
  id, label, location: '校内', service: DORM_SERVICE, suitable, note, highlights, rateIds,
  ...(bed ? { bed } : {}),
  image: gallery[0], gallery, imageAlt: `WE${label}实景`,
});

/** Photos come only from WE's own photo pack and match the labelled room (see public/assets/we). */
export const WE_ROOM_PROFILES: PhRoomProfile[] = [
  dormRoom('dorm-single', '宿舍单人间', [...range('single', 3), 'dorm-bath', 'dorm-hall'].map(room), '重视隐私的成人', '一人一间；家长课程、青少年和幼儿园课程不能住单人间。'),
  dormRoom('dorm-twin', '宿舍双人间', [...range('twin', 3), 'dorm-bath', 'dorm-hall'].map(room), '朋友同行、一位家长带一个孩子', '两人一间。'),
  dormRoom('dorm-triple', '宿舍三人间', [...range('triple', 6), 'dorm-bath', 'dorm-hall'].map(room), '想控制预算的学生或三人家庭', '三人一间。'),
  dormRoom('dorm-quad', '宿舍四人间', [...range('quad', 3), 'dorm-bath', 'dorm-common'].map(room), '预算优先的学生或四人家庭', '四人一间，费用最低。'),
  dormRoom('big-room', '大号家庭房', range('big', 8).map(room), '3–6人的家庭',
    '共3间，以前是小组活动室；有3–6张床、空调、冰箱、饮水机、衣帽间和独立浴室。',
    ['3–6张床，独立浴室', '空调、冰箱、饮水机', '仅限家庭入住'], ['big-room-3', 'big-room-4']),
  dormRoom('green-house', 'Green House独栋家庭屋', range('green', 12).map(room), '3–4人的家庭',
    '只有1栋，在宿舍楼和2号教学楼之间；1张大号双人床加1张特大单人床，可以自己做饭。',
    ['独立一栋，可以做饭', '电视、微波炉、电磁炉、冰箱', '仅限家庭入住'], ['green-house-3', 'green-house-4']),
  {
    id: 'residence-one-queen', label: 'WE公寓大床房', englishName: 'WE RESIDENCE · ONE QUEEN BED', location: '校内',
    bed: '一张大床', service: '服务费含打扫、洗衣、水和网络；含餐',
    suitable: '一位成人、夫妻、一位家长带一个孩子', note: '新建公寓，不与陌生人合住；同住的人须同一天入住。',
    highlights: RESIDENCE_HIGHLIGHTS, rateIds: ['residence-one-queen-1', 'residence-one-queen-2'],
    gallery: [...range('one-queen', 9).map(residence), residence('bath-01'), residence('doorlock'), ...RESIDENCE_EXTRAS],
    image: residence('one-queen-01'), imageAlt: 'WE公寓大床房实景',
  },
  {
    id: 'residence-two-queen', label: 'WE公寓双大床房', englishName: 'WE RESIDENCE · TWO QUEEN BEDS', location: '校内',
    bed: '两张大床', service: '服务费含打扫、洗衣、水和网络；含餐',
    suitable: '2–4人的家庭或朋友', note: '新建公寓，不与陌生人合住；同住的人须同一天入住。两张大床共用，请按孩子年龄安排床位。',
    highlights: RESIDENCE_HIGHLIGHTS, rateIds: ['residence-two-queen-2', 'residence-two-queen-3', 'residence-two-queen-4'],
    gallery: [...range('two-queen', 9).map(residence), residence('bath-02'), ...RESIDENCE_EXTRAS],
    image: residence('two-queen-01'), imageAlt: 'WE公寓双大床房实景',
  },
];

export const WE_DORM_RULES = [
  { title: '门禁', text: '成人没有门禁，可以自由外出；未成年学生须由监护人陪同外出，晚上10点前回校。' },
  { title: '外宿与旅行', text: '外宿或旅行前一天要填旅行表；23:00–06:00必须外出（如赶飞机）要先告诉办公室。' },
  { title: '访客', text: '须提前申请，平日10:00–17:00，周末不能探访；不能进宿舍和教室。' },
  { title: '禁止事项', text: '校内禁止喝酒、指定区域外禁止吸烟（各罚2,000比索）；宿舍内不能用热水壶、电饭锅等发热电器；男女不能进对方房间。' },
  { title: '泳池', text: '开放到21:00，22:00后不能游泳；只能穿泳衣，未成年人须由监护人陪同。' },
  { title: 'WE公寓', text: '室内严禁吸烟和电子烟（罚10,000比索并立即退住）；22:00后保持安静；只能简单做饭，不能烤肉、煎鱼等油烟大的料理；访客须先申请。' },
  { title: '违规处理', text: '第一次违规停课1周，第二次再停课2周，第三次开除且不退费。' },
];

/** One weekday; the profile shows the morning and the afternoon side by side. */
export const WE_SCHEDULE: DailyScheduleRow[] = [
  { time: '07:00–08:20', activity: '早餐', kind: 'meal' },
  { time: '08:00–08:45', activity: '第1节', kind: 'class' },
  { time: '08:50–09:35', activity: '第2节', kind: 'class' },
  { time: '09:40–10:25', activity: '第3节', kind: 'class' },
  { time: '10:30–11:15', activity: '第4节', kind: 'class' },
  { time: '11:20–12:05', activity: '第5节', kind: 'class' },
  { time: '11:50–12:50', activity: '午餐（按课表错开）', kind: 'meal' },
  { time: '13:00–13:45', activity: '第6节', kind: 'class' },
  { time: '13:50–14:35', activity: '第7节', kind: 'class' },
  { time: '14:40–15:25', activity: '第8节', kind: 'class' },
  { time: '15:30–16:15', activity: '第9节', kind: 'class' },
  { time: '16:20–17:05', activity: '第10节', kind: 'class' },
  { time: '17:30–18:30', activity: '晚餐', kind: 'meal' },
  { time: '19:00–21:00', activity: '晚间选修课（周一至周四，选1小时）／自习', kind: 'activity' },
];

export const WE_COURSE_DETAIL_GUIDES: CourseDetailGuide[] = [
  {
    icon: 'record_voice_over',
    title: '外教混合课程',
    subtitle: '每天1–3节外教一对一',
    courseIds: ['native-mix-light', 'native-mix-general', 'native-mix-intensive'],
    facts: [
      { label: '外教', value: '来自美国、英国、澳大利亚和加拿大等国家' },
      { label: 'LIGHT', value: '外教一对一1节，练口语' },
      { label: 'GENERAL', value: '外教一对一2节，练口语和写作' },
      { label: 'INTENSIVE', value: '外教一对一3节，练口语、写作、阅读和词汇' },
    ],
    points: ['准备打工度假、海外实习或出国留学的学生，学校推荐外教课程。'],
  },
  {
    icon: 'fact_check',
    title: '考试与商务课程',
    subtitle: '每天6节专项一对一',
    courseIds: ['toeic', 'toefl', 'ielts', 'business'],
    facts: [
      { label: '托业', value: '阅读3节、听力2节、词汇1节' },
      { label: '托福／雅思', value: '写作2节，阅读、听力、口语、词汇各1节' },
      { label: '商务英语', value: '口语2节，阅读、写作、听力、词汇各1节' },
      { label: '小组课', value: '每天1节ESL听力小组课' },
    ],
    points: ['课上做模拟题，随时了解自己的进度。WE没有保分班。'],
  },
  {
    icon: 'child_care',
    title: '幼儿园和青少年课程',
    subtitle: '4岁到初中的孩子',
    courseIds: ['kinder-esl', 'junior-esl', 'junior-esl-native'],
    facts: [
      { label: '幼儿园', value: '4–6岁，08:50–16:15，上下午各有点心' },
      { label: '幼儿园内容', value: '唱歌、自然拼读、写字、手工、故事、户内外活动和体育' },
      { label: '青少年', value: '小学到初中；每天另有约2小时自习（可选）' },
      { label: '监护', value: '须由父母等直系亲属陪同；代理监护人要带家长授权书' },
    ],
    points: ['午餐在餐厅和家长一起吃；未成年人用泳池须由监护人陪同。'],
  },
  {
    icon: 'golf_course',
    title: '高尔夫英语',
    subtitle: '上午英语，下午练球',
    courseIds: ['esl-golf', 'esl-golf-round'],
    facts: [
      { label: '高尔夫课', value: '持证菲律宾教练，周一至周五每天1小时，按水平上课' },
      { label: '球杆', value: '初学者可借学校球杆；中级以上建议自带' },
      { label: '下场', value: '每周1次，通常周三或周六上午，每次1–3名学员' },
      { label: '下场另付', value: '果岭费、球童费、球车费；淡季约100美元一次，按球场和季节不同' },
    ],
    points: ['下场课的学费已含上课和交通。'],
  },
  {
    icon: 'family_restroom',
    title: '家长课程与只陪读',
    subtitle: '陪孩子来的家长',
    courseIds: ['esl-3', 'guardian-no-class'],
    facts: [
      { label: '住宿舍', value: '家长须报一门课程（如家长英语ESL 3），课时可以转给孩子' },
      { label: '住WE公寓', value: '家长可以不上课，只陪读' },
      { label: '不上课', value: '不用办SSP和SSP E-CARD；注册费和学生证照常' },
      { label: '监护人', value: '须为孩子的直系亲属（父母、兄弟姐妹等）' },
    ],
    points: ['每个家庭可有1位访客（须为孩子的父亲或母亲），每晚1,500比索含三餐，最多住5晚，和家人同住一间。'],
  },
  {
    icon: 'rule',
    title: '上课与换课规定',
    subtitle: '所有课程',
    facts: [
      { label: '每节课', value: '45分钟；小组课最多6人' },
      { label: '晚间选修课', value: '周一至周四19:00–21:00，生存／旅行英语或商务英语／CNN，按水平选1小时' },
      { label: '换课', value: '周二至周四到办公室申请，周四16:30前办完，下周一生效' },
      { label: '假日', value: '菲律宾节假日停课，不补课也不退费' },
    ],
    points: ['入学时有分级测试；每4周可自愿参加一次水平测试。换课可能要另付教材费。'],
  },
];

const FIRST_DAY = [
  { label: '07:00–08:20', value: '早餐' },
  { label: '08:20–10:00', value: '分级测试（听力、阅读、语法、口语）' },
  { label: '10:00–11:00', value: '新生说明会' },
  { label: '13:00–15:30', value: '去SM商场换钱、拍证件照、买日用品（带护照）' },
  { label: '16:00–16:40', value: '领课表和教材、缴纳到校费用' },
];

export const WE_PRACTICAL_GUIDES: CampusPracticalGuide[] = [
  { icon: 'event', eyebrow: 'FIRST DAY', title: '到校第一天（周一）', facts: FIRST_DAY, note: '入境和签证材料由思达启航顾问逐项帮你核对；eTravel入境登记也由顾问协助填写。' },
  {
    icon: 'restaurant',
    eyebrow: 'MEALS & HOURS',
    title: '用餐与开放时间',
    facts: [
      { label: '平日三餐', value: '07:00–08:20 / 11:50–12:50 / 17:30–18:30（旺季午餐、晚餐延长）' },
      { label: '周末与假日', value: '两餐：早午餐09:30–12:00，晚餐17:30–18:30' },
      { label: '运动设施', value: '每天06:00–21:00（泳池、篮球场、高尔夫练习场等）' },
      { label: '自习室', value: '每天19:00–24:00' },
    ],
    note: '假日用餐要在前一天中午前到餐厅登记。',
  },
  {
    icon: 'cleaning_services',
    eyebrow: 'SCHOOL SERVICES',
    title: '清洁、洗衣与看病',
    facts: [
      { label: '打扫', value: '每周3次；每周消毒1次，每月深度消毒1次' },
      { label: '洗衣', value: '每周3次，另有自助洗衣机（20:00前）；假日不洗衣' },
      { label: '安全', value: '校内约114个监控摄像头，一对一和小组教室都有' },
      { label: '看病', value: '学校先建议去约10分钟车程的综合医院，往返接送500比索' },
    ],
    note: '贵重物品可存在办公室保险箱；不要放在房间里。',
  },
  {
    icon: 'payments',
    eyebrow: 'OTHER FEES',
    title: '其他收费',
    facts: [
      { label: '额外住宿', value: '宿舍每晚1,500比索（单人间2,000），WE公寓2,000，视空房而定' },
      { label: '换房', value: '因个人原因换房1,000比索；升级另补差价' },
      { label: '补办', value: '学生证300比索，钥匙500比索' },
      { label: 'ECC离境证', value: '停留超过180天须办，学校代办服务费1,500比索' },
    ],
    note: '到校费用在第一天去商场换钱后缴纳，请保留好收据。',
  },
];

/** The school's 2027 holiday list: weekday holidays with no class or a special group class; other days have class. */
export const WE_HOLIDAY_CALENDARS: HolidayCalendar[] = [
  {
    year: 2027,
    label: '规划2027年入学时优先查看',
    months: [
      { month: 1, holidays: [{ day: '1日', name: '元旦（停课）' }] },
      {
        month: 3,
        holidays: [
          { day: '10日', name: '开斋节（停课）', provisional: true },
          { day: '25日', name: '濯足节（特别小组课）' },
          { day: '26日', name: '耶稣受难日（特别小组课）' },
        ],
      },
      { month: 4, holidays: [{ day: '9日', name: '勇士日（停课）' }] },
      { month: 5, holidays: [{ day: '17日', name: '宰牲节（停课）', provisional: true }] },
      { month: 6, holidays: [{ day: '18日', name: '皮纳图博火山纪念日（6/15）移到周五，停课' }] },
      { month: 8, holidays: [{ day: '30日', name: '国家英雄日（停课）' }] },
      { month: 10, holidays: [{ day: '8日', name: '当地节日 Fiesta Kuliat（停课）' }] },
      {
        month: 11,
        holidays: [
          { day: '1日', name: '万圣节（停课）' },
          { day: '2日', name: '万灵节（停课）' },
          { day: '30日', name: '博尼法西奥日（停课）' },
        ],
      },
      {
        month: 12,
        holidays: [
          { day: '8日', name: '圣母无原罪瞻礼（停课）' },
          { day: '24日', name: '平安夜（停课）' },
          { day: '30日', name: '黎刹日（停课）' },
          { day: '31日', name: '除夕（停课）' },
        ],
      },
    ],
  },
];

export const WE_HOLIDAY_FOOTNOTE = '标“暂定”的日期以政府公布为准；菲律宾政府也可能临时宣布假期（包括台风停课），学校会另行通知。假日停课不补课、不退费。';

export const WE_FAQS: FaqItem[] = [
  { question: 'WE有旺季附加费吗？', answer: '没有。旺季（12–2月、6–8月）不加价，但报名时每人要和注册费一起先付300美元押金，这笔押金可抵扣学费全款，不是额外费用。旺季宿舍至少住2周，WE公寓至少住4周。' },
  { question: 'WE是斯巴达还是自由型？', answer: '自由型。成人没有门禁，可以自由外出；未成年学生须由监护人陪同外出。想要严格管理的学生，可以让顾问推荐斯巴达学校。' },
  { question: '2027年有什么优惠？', answer: '2027/02/28–06/26期间入住、且至少2周在这段时间内：一般英语、外教混合、考试课和青少年课程每周减50美元，家长英语ESL 3每周减25美元；WE公寓、宿舍单人间、双人间和家庭房每周再减50美元；另送每天1节外教选修小组课。报价器会按你的日期自动计算。' },
  { question: '家长一定要上课吗？', answer: '住宿舍的家长须报一门课程（可选家长英语ESL 3），课时可以转给孩子；住WE公寓的家长可以只陪读不上课，不用办SSP，但注册费和学生证照常。' },
  { question: 'WE公寓和宿舍有什么不同？', answer: 'WE公寓是新建的，有厨房、客厅、智能电视和Starlink网络，不与陌生人合住，价格较高；宿舍性价比高，房型多。两者都在校园里，课程和设施一样用。' },
  { question: '页面上的报价包含全部费用吗？', answer: '学校费用包含注册费、课程费和住宿费，并自动扣除优惠；到校学杂费单独列出，接机、押金、教材和电费另外准备。两者分开显示，不相加。' },
  { question: '思达启航会协助签证和入境吗？', answer: '会。通过思达启航报名，顾问会免费协助菲律宾入境和签证相关手续，你只需要按顾问指引准备个人资料。' },
];

export const WE_FINAL_CTA_BADGES = ['免费选校建议', '确认空房和优惠', '签证与入境协助'];

// Text and data of the I.BREEZE school page, from the school's 2026-11-20 Chinese introduction, the 2026-10-19
// school policy, the 2026-10-16 new-student guide and the 2026 and 2027 price lists (received 2026-11-23). The
// shared Philippine school template reads it through ibreeze-page-profile.ts. Keep it pure data (no Angular, DOM
// or storage), so the WeChat mini program can reuse it. Never add the school's phone, address, website or social
// accounts, and write 中国大陆 / 中国台湾, never a bare 中国 beside 中国台湾.
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
export const IBREEZE_REFERENCE_NOTE = SCHOOL_REFERENCE_NOTE;

export const IBREEZE_PAGE_TEXT = {
  heroLead: '宿务市中心的半斯巴达语言学校：入学测试后按水平分班，雅思和托业每周模考，课后出门购物、换钱都方便。',
  advisorText: 'I.BREEZE在宿务市中心Mabolo区，步行约15分钟到SM City商场，生活很方便。课程从零基础强化到雅思目标都有，入学测试后按水平分班，强化英语和零基础强化同价，可以按测试结果互换。雅思和托业课程每周模考，报名12周以上并达到出勤和模考条件，可获1次免费官方考试。住宿有主校区IB1、Prime校区IB2和步行约5分钟的校外公寓，适合成人、上班族和带孩子的家庭。',
  campusIntro: '主校区IB1有教学区、餐厅、泳池、咖啡厅和A–E栋宿舍，旁边是Prime校区IB2大楼；校外公寓步行约5分钟。',
  galleryIntro: '按区域查看校园、教室、住宿、餐厅和设施；相册内用左右箭头或缩略图切换，点击主图可放大。',
  coursesIntro: '按学习目标分组，每门课下面是每天的一对一和小组课节数；点开可看适合人群和说明。每节课45分钟。',
  roomsPhotoIntro: '点选房型查看实景；各房型价格见上方住宿费表。',
  finalCtaTitle: '想确认 I.BREEZE 的空房和最新优惠？',
  finalCtaText: '告诉顾问你的入学日期、周数和想住的房型，我们帮你确认房间并做一份完整报价。',
} as const;

export const IBREEZE_QUICK_INFO = [
  { icon: 'location_on', title: '宿务市中心', text: 'Mabolo区，步行约15分钟到SM City商场' },
  { icon: 'verified', title: '半斯巴达', text: '有课的前一晚22:00前回校' },
  { icon: 'school', title: '130多位全职老师', text: '每节课45分钟；小组课最多6人' },
  { icon: 'fact_check', title: '雅思考点就在附近', text: '步行约7分钟到IDP雅思考点' },
  { icon: 'apartment', title: '3类住宿', text: 'IB1主校区、IB2 Prime校区宿舍和校外公寓' },
  { icon: 'pool', title: '校内设施', text: '泳池、健身房、咖啡厅、自习室和休息室' },
];

/** Key facts under the hero title (compact layout); what each area has is in IBREEZE_CAMPUS_BUILDINGS. */
export const IBREEZE_OVERVIEW_FACTS: ReadonlyArray<{ icon: string; label: string; value: string }> = [
  { icon: 'location_on', label: '位置', value: '宿务市中心Mabolo区，步行约15分钟到SM City商场' },
  { icon: 'groups', label: '规模', value: '可容纳约300名学生，130多位全职老师' },
  { icon: 'rule', label: '管理', value: '半斯巴达；有课的前一晚22:00前回校' },
  { icon: 'menu_book', label: '课程', value: '综合英语、雅思、托业、商务英语，以及5–17岁青少年课程' },
  { icon: 'event', label: '入学', value: '每周日入住，周一分级测试后开课' },
  { icon: 'bed', label: '住宿', value: 'IB1主校区、IB2 Prime校区宿舍，另有步行约5分钟的校外公寓' },
  { icon: 'fact_check', label: '考试', value: '步行约7分钟到IDP雅思考点' },
  { icon: 'public', label: '学生', value: '来自韩国、日本、中国大陆、中国台湾、蒙古、泰国、越南、沙特阿拉伯等国家和地区' },
];

export const IBREEZE_BASIC_INFO: BasicInfoRow[] = [
  { label: '学校', value: 'I.BREEZE International Language Center' },
  { label: '位置', value: '菲律宾宿务市中心 Mabolo 区' },
  { label: '管理方式', value: '半斯巴达' },
  { label: '课程', value: '综合英语、雅思、托业、商务英语、青少年课程' },
  { label: '住宿', value: 'IB1主校区、IB2 Prime校区宿舍；校外公寓' },
  { label: '入学', value: '每周日入住，周一分级测试后开课' },
];

export const IBREEZE_SUITABLE_FOR = [
  '想住在市中心、课后生活方便的学生',
  '零基础或基础薄弱、想从头学起的学生',
  '准备雅思或托业考试的学生',
  '带5–15岁孩子的亲子家庭',
];

export const IBREEZE_NOT_SUITABLE_FOR = [
  '想在海边或度假村环境里上学的学生（学校在市中心）',
  '想要全斯巴达严格管理的学生（这里是半斯巴达）',
  '2027暑期想住校外公寓的个人学生：暑期公寓只接受家庭',
];

export const IBREEZE_CAMPUS_BUILDINGS: CampusBuildingCard[] = [
  { code: 'IB1', title: '主校区 IB1', icon: 'school', facilities: ['1楼一对一隔间教室，2楼会议室和瑜伽室', '学生餐厅、泳池和Breeze咖啡厅', 'A栋双人间、B栋单人间、C栋三人间', 'D栋女生四人间，E栋男生三人间和四人间'] },
  { code: 'IB2', title: 'Prime校区 IB2', icon: 'apartment', facilities: ['Prime大楼：一对一教室、自习室和宿舍', 'Prime办公室和医务室', '单人间、双人间和四人间'] },
  { code: 'LIFE', title: '休闲设施', icon: 'pool', facilities: ['泳池', '健身房（C栋）', '休息室：台球、桌游', '自习室平日08:00–24:00开放'] },
  { code: 'CONDO', title: '校外公寓', icon: 'home', facilities: ['步行约5分钟到学校', '周一至周五早晚接送', '房内带厨房，含水费和Wi-Fi'] },
];

const campus = (file: string) => `assets/ibreeze/campus/${file}.webp`;
const room = (file: string) => `assets/ibreeze/rooms/${file}.webp`;
const numbered = (prefix: string, count: number) => Array.from({ length: count }, (_, index) => room(`${prefix}-${index + 1}`));

export const IBREEZE_GALLERY_IMAGES: GalleryImage[] = [
  { category: '校园', title: 'Prime校区大楼', description: 'IB2 Prime校区大楼外观。', src: campus('prime-campus') },
  { category: '校园', title: '校内泳池', description: '主校区泳池，课后可以游泳放松。', src: campus('pool') },
  { category: '校园', title: '绿植墙走廊', description: '校内的绿植墙走廊。', src: campus('feel-the-breeze') },
  { category: '校园', title: '老师团队', description: 'I.BREEZE的老师们在泳池边合影。', src: campus('teachers') },
  { category: '校园', title: '结业合影', description: '结业学员和老师合影。', src: campus('graduation') },
  { category: '校园', title: '花园音乐会', description: '学生在校园音乐会上表演。', src: campus('garden-concert') },
  { category: '教室', title: '一对一隔间教室', description: '主校区1楼的独立隔间教室。', src: campus('cubicle') },
  { category: '教室', title: 'Prime校区一对一教室', description: '带白板的一对一教室。', src: campus('ib2-cubicle') },
  { category: '教室', title: '考试教室', description: '考试用的教室。', src: campus('test-room') },
  { category: '教室', title: '会议室', description: '主校区2楼会议室。', src: campus('conference-room') },
  { category: '教室', title: '自习室', description: '平日08:00–24:00，周末10:00–24:00开放。', src: campus('prime-study-room') },
  { category: '住宿', title: 'IB1单人间', description: '主校区B栋，一人一间。', src: room('ib1-single-1') },
  { category: '住宿', title: 'IB1双人间', description: '主校区A栋。', src: room('ib1-twin-1') },
  { category: '住宿', title: 'IB1三人间', description: '主校区宿舍。', src: room('ib1-triple-1') },
  { category: '住宿', title: 'IB1四人间', description: '上下铺；女生住D栋，男生住E栋。', src: room('ib1-quad-1') },
  { category: '住宿', title: 'IB2单人间', description: 'Prime校区宿舍，一人一间。', src: room('ib2-single-1') },
  { category: '住宿', title: 'IB2双人间', description: 'Prime校区宿舍。', src: room('ib2-twin-1') },
  { category: '住宿', title: 'IB2四人间', description: 'Prime校区宿舍，上下铺。', src: room('ib2-quad-1') },
  { category: '住宿', title: '校外公寓高级单人间', description: '1张大床，独立卧室和客厅。', src: room('condo-super-single') },
  { category: '住宿', title: '校外公寓家庭房', description: '2间卧室、2个卫生间和客厅。', src: room('condo-family') },
  { category: '餐厅', title: '餐厅入口', description: '主校区学生餐厅入口。', src: campus('dining-entrance') },
  { category: '餐厅', title: '学生餐厅', description: '周一至周日每天三餐。', src: campus('dining') },
  { category: '餐厅', title: 'Breeze咖啡厅', description: '每天08:00–23:00营业。', src: campus('cafe') },
  { category: '餐厅', title: '咖啡厅里的学生', description: '课后和同学聊天的地方。', src: campus('cafe-gathering') },
  { category: '设施', title: '健身房', description: '平日15:45–21:00，周末09:00–21:00开放。', src: campus('gym') },
  { category: '设施', title: '瑜伽室', description: '主校区2楼瑜伽室。', src: campus('yoga-room') },
  { category: '设施', title: '休息室', description: '有台球桌和沙发。', src: campus('student-lounge-1') },
  { category: '设施', title: '休息室', description: '课间休息、看书的地方。', src: campus('student-lounge-2') },
  { category: '设施', title: '休息室里的学生', description: '课后和同学一起玩桌游。', src: campus('student-lounge-3') },
];

export const IBREEZE_ALBUM_DESCRIPTIONS = {
  校园: '校园、泳池和老师团队',
  教室: '一对一教室、考试教室和自习室',
  住宿: 'IB1、IB2宿舍与校外公寓',
  餐厅: '学生餐厅与Breeze咖啡厅',
  设施: '健身房、瑜伽室和休息室',
} as const;

/**
 * Videos from the school's own 2026 material (public/assets/ibreeze/videos/, 720p H.264 with poster frames).
 * The room clips each show exactly one room type and are cut from the school's room tours; the IB1 single room
 * has no clip. Check every frame of a new clip for other companies or the school's contact details.
 */
export interface IbreezeVideo {
  name: string;
  title: string;
  description: string;
  duration: string;
  /** The room profile this clip shows; school-wide videos have none. */
  roomId?: string;
}

export const ibreezeVideoSrc = (video: IbreezeVideo) => `/assets/ibreeze/videos/${video.name}.mp4`;
export const ibreezeVideoPoster = (video: IbreezeVideo) => `/assets/ibreeze/videos/poster-${video.name}.jpg`;

export const IBREEZE_VIDEOS: IbreezeVideo[] = [
  { name: 'ibreeze-school-film', title: 'I.BREEZE 学校介绍片', duration: '3:36', description: '一支片子看完校园、教室、宿舍、餐厅和课后生活。' },
  { name: 'ib1-twin', title: 'IB1双人间', duration: '0:12', description: '主校区A栋双人间。', roomId: 'ib1-twin' },
  { name: 'ib1-triple', title: 'IB1三人间', duration: '0:05', description: '主校区三人间。', roomId: 'ib1-triple' },
  { name: 'ib1-quad', title: 'IB1四人间', duration: '0:07', description: '主校区四人间，上下铺。', roomId: 'ib1-quad' },
  { name: 'ib2-single', title: 'IB2单人间', duration: '0:11', description: 'Prime校区单人间。', roomId: 'ib2-single' },
  { name: 'ib2-twin', title: 'IB2双人间', duration: '0:04', description: 'Prime校区双人间。', roomId: 'ib2-twin' },
  { name: 'ib2-quad', title: 'IB2四人间', duration: '0:12', description: 'Prime校区四人间，上下铺。', roomId: 'ib2-quad' },
  { name: 'condo-regular-single', title: '校外公寓标准单人间', duration: '0:13', description: '一人入住，房内2张单人床。', roomId: 'condo-standard-single' },
  { name: 'condo-super-single', title: '校外公寓高级单人间', duration: '0:20', description: '1张大床，独立卧室和客厅。', roomId: 'condo-superior-single' },
  { name: 'condo-regular-twin', title: '校外公寓标准双人间', duration: '0:16', description: '2张单人床。', roomId: 'condo-standard-twin' },
  { name: 'condo-super-twin', title: '校外公寓高级双人间', duration: '0:22', description: '两人入住的高级双人间。', roomId: 'condo-superior-twin' },
  { name: 'condo-family', title: '校外公寓家庭房', duration: '0:54', description: '2间卧室、2个卫生间和客厅。', roomId: 'condo-family' },
];

const DORM_SERVICE = '每周打扫2次（须登记并在场），每2周免费换床单';
const CONDO_HIGHLIGHTS = ['厨房：微波炉、冰箱、电饭煲、烧水壶', '空调、电视、保险箱、衣柜、吹风机', '含水费和Wi-Fi，电费另计'];
const dorm = (
  id: string, label: string, englishName: string, rateId: string, gallery: string[], suitable: string, note: string,
): PhRoomProfile => ({
  id, label, englishName, location: '校内', service: DORM_SERVICE, suitable, note,
  image: gallery[0], gallery, imageAlt: `I.BREEZE${label}实景`, rateIds: [rateId],
});
const condo = (
  id: string, label: string, englishName: string, rateId: string, gallery: string[], suitable: string, note: string, bed?: string,
): PhRoomProfile => ({
  id, label, englishName, location: '校外', ...(bed ? { bed } : {}), suitable, note, highlights: CONDO_HIGHLIGHTS,
  image: gallery[0], gallery, imageAlt: `I.BREEZE${label}实景`, rateIds: [rateId],
});

/** Photos come only from the school's own 2026 material and match the labelled room (see public/assets/ibreeze). */
export const IBREEZE_ROOM_PROFILES: PhRoomProfile[] = [
  dorm('ib1-single', 'IB1单人间', 'IB1 SINGLE', 'single-main', numbered('ib1-single', 3), '重视隐私、需要安静学习空间的学生', '主校区B栋，一人一间。'),
  dorm('ib1-twin', 'IB1双人间', 'IB1 TWIN', 'twin-main', numbered('ib1-twin', 5), '朋友同行或想兼顾预算的学生', '主校区A栋，两人一间。'),
  dorm('ib1-triple', 'IB1三人间', 'IB1 TRIPLE', 'triple-main', numbered('ib1-triple', 4), '想控制预算的学生', '主校区C栋；男生也可能住E栋。'),
  dorm('ib1-quad', 'IB1四人间', 'IB1 QUAD', 'quad-main', numbered('ib1-quad', 3), '预算优先、能接受上下铺的学生', '上下铺；女生住D栋，男生住E栋。'),
  dorm('ib2-single', 'IB2单人间', 'IB2 SINGLE', 'single-ib2', numbered('ib2-single', 6), '想住Prime校区、需要独立空间的学生', 'Prime校区大楼，一人一间。'),
  dorm('ib2-twin', 'IB2双人间', 'IB2 TWIN', 'twin-ib2', numbered('ib2-twin', 4), '朋友同行、想住Prime校区的学生', 'Prime校区大楼，两人一间。'),
  dorm('ib2-quad', 'IB2四人间', 'IB2 QUAD', 'quad-ib2', numbered('ib2-quad', 7), '预算优先、想住Prime校区的学生', 'Prime校区大楼，上下铺。'),
  condo('condo-standard-single', '校外公寓标准单人间', 'CONDO REGULAR SINGLE', 'off-campus-standard-single',
    [room('condo-regular-single')], '想自己做饭、要独立空间的上班族和长期学生', '一人入住，步行约5分钟到学校。', '2张单人床'),
  condo('condo-superior-single', '校外公寓高级单人间', 'CONDO SUPER SINGLE', 'off-campus-superior-single',
    [room('condo-super-single'), room('condo-super-single-kitchen')], '想要独立卧室和客厅的学生', '一人入住，步行约5分钟到学校。', '1张大床（Queen）'),
  condo('condo-standard-twin', '校外公寓标准双人间', 'CONDO REGULAR TWIN', 'off-campus-standard-twin',
    [room('condo-regular-twin')], '夫妻、朋友或亲子两人同住', '两人入住，步行约5分钟到学校。', '2张单人床'),
  condo('condo-superior-twin', '校外公寓高级双人间', 'CONDO SUPER TWIN', 'off-campus-superior-twin',
    [room('condo-super-twin')], '夫妻、朋友或亲子两人同住', '两人入住，步行约5分钟到学校。'),
  condo('condo-family', '校外公寓家庭房', 'CONDO FAMILY UNIT', 'off-campus-family',
    [room('condo-family'), room('condo-family-kitchen'), room('condo-family-bedroom')],
    '3–5人的家庭', '2间卧室、2个卫生间和客厅；至少3人入住。', '1张大床 + 2张单人床'),
];

export const IBREEZE_DORM_RULES = [
  { title: '门禁', text: '周一至周四课后（15:30后）可外出，22:00前回校，21:00后不能再外出；周五和节假日前一天24:00前回校，23:00后不能再外出；周六和节假日05:00起可外出，24:00前回校；周日和节假日最后一天22:00前回校。' },
  { title: '外宿', text: '每4周可外宿2次，须提前申请。' },
  { title: '未成年学生', text: '每天22:00前回校，外出须有成人陪同。' },
  { title: '禁止事项', text: '校内禁止饮酒，违反可能被退学。' },
  { title: '退房', text: '课程结束的周六12:00前退房；丢失房间钥匙罚500比索。' },
  { title: '校外公寓', text: '周一至周五早晚有接送；2027/06/27–08/14暑期只接受家庭学生。' },
];

/** One weekday of 强化英语 (Power ESL); the profile shows the morning and the afternoon side by side. */
export const IBREEZE_SCHEDULE: DailyScheduleRow[] = [
  { time: '07:00–07:50', activity: '早餐（周末和假日08:00起）', kind: 'meal' },
  { time: '07:35–07:55', activity: '每日词汇测试（报名参加）', kind: 'test' },
  { time: '08:00–08:45', activity: '一对一 口语', kind: 'class' },
  { time: '08:50–09:35', activity: '一对一 阅读', kind: 'class' },
  { time: '09:40–10:25', activity: '自习', kind: 'free' },
  { time: '10:30–11:15', activity: '小组课', kind: 'class' },
  { time: '11:20–12:05', activity: '一对一 语法', kind: 'class' },
  { time: '11:30–13:00', activity: '午餐', kind: 'meal' },
  { time: '13:05–13:50', activity: '自习', kind: 'free' },
  { time: '13:55–14:40', activity: '特色小组课（母语外教或资深主管老师）', kind: 'class' },
  { time: '14:45–15:30', activity: '一对一 写作', kind: 'class' },
  { time: '15:35–16:20', activity: '小组课', kind: 'class' },
  { time: '16:25–17:10', activity: '一对一 听力', kind: 'class' },
  { time: '17:15–18:00', activity: '瑜伽或尊巴（自由参加）', kind: 'activity' },
  { time: '17:30–18:30', activity: '晚餐', kind: 'meal' },
  { time: '18:30–19:15', activity: '晚间课（自由参加）', kind: 'activity' },
  { time: '19:00–21:00', activity: '电影之夜等晚间活动（自由参加）', kind: 'free' },
];

export const IBREEZE_COURSE_DETAIL_GUIDES: CourseDetailGuide[] = [
  {
    icon: 'workspace_premium',
    title: '雅思目标课程',
    subtitle: '最少4周 · 每周模考',
    courseIds: ['ielts-target'],
    facts: [
      { label: '晚间雅思课', value: '周一至周四 18:30–20:00，报名12周以上必须参加' },
      { label: '模考', value: '每周一次模考和解析，雅思主管老师每两周跟进分数' },
      { label: '入学3.5分', value: '目标5.0分' },
      { label: '入学4.0分', value: '目标5.5分' },
      { label: '入学5.0分', value: '目标6.5分' },
      { label: '入学6.0分', value: '目标7.0分' },
    ],
    points: [
      '免费官方考试：报名12周或以上，常规课和晚间课出勤率90%以上，每天参加词汇测试，并在第10周前模考达到目标分。',
      '第10周前模考没达到目标分，免费官方考试改为4周免费线上课（每周3节，每节25分钟）。',
    ],
    notice: '考试福利条件以学校当期规定为准，报名前顾问会和你逐项确认。',
  },
  {
    icon: 'trending_up',
    title: '雅思起步怎么升班',
    subtitle: '3–8周 · 两周一次模考',
    courseIds: ['ielts-starter'],
    facts: [
      { label: '升入雅思目标', value: '两周后模考达到雅思3.5、托业350或校内A2，自动升入雅思目标课程' },
      { label: '未达入学要求', value: '先上强化英语，4周后模考达到要求再升入雅思起步' },
    ],
    points: [],
  },
  {
    icon: 'child_care',
    title: '青少年与未成年报名',
    subtitle: '按抵达日的国际年龄计算',
    courseIds: ['junior-english'],
    facts: [
      { label: '5–15岁', value: '须读青少年英语，可与家长同行，家长选成人课程' },
      { label: '16–17岁', value: '可选其他课程，课程费仍按青少年英语计算' },
      { label: '单独就读', value: '另收监护管理费100美元／4周，含免费机场接送和每4周一次跳岛游' },
      { label: '门禁', value: '每天22:00前回校，外出须有成人陪同' },
    ],
    points: ['青少年学生须遵守学校的青少年管理规定。'],
  },
  {
    icon: 'rule',
    title: '上课、换班与出勤',
    subtitle: '所有课程',
    facts: [
      { label: '每节课', value: '45分钟，课间休息5分钟' },
      { label: '换班', value: '每周三09:00–12:00申请（新生周四），每两周可换一次' },
      { label: '换课', value: '出发前安排多门课程不收费；到校后更换课程100美元／4周' },
      { label: '测试', value: '每4周一次月考；雅思、托业每周模考' },
      { label: '出勤', value: '出勤率90%以上可获结业证书；每周无故缺课3次记1次警告' },
    ],
    points: ['每日词汇测试周一至周四07:35开始，每周100个词，报名参加；未通过的当晚不能外出。零基础强化课程必须参加。'],
  },
  {
    icon: 'nights_stay',
    title: '免费晚间课程与活动',
    subtitle: '课后自由参加',
    facts: [
      { label: '晚间ESL课', value: '周一至周四，对话、流行歌曲等' },
      { label: '晚间雅思课', value: '周一至周四，雅思专项练习' },
      { label: '晚间活动', value: '周一、周四瑜伽（100比索／次），周二尊巴，周三电影之夜' },
    ],
    points: [],
  },
];

const FIRST_DAY = [
  { label: '08:50–12:00', value: '分级测试（雅思、托业学生08:10到办公室）' },
  { label: '13:00', value: '新生说明会' },
  { label: '15:00', value: '拍集体照' },
  { label: '15:30–22:00', value: '可以外出换钱、买日用品' },
  { label: '第二天07:50', value: '领课表和教材' },
  { label: '第二天10:00–15:00', value: '缴纳到校学杂费' },
];

export const IBREEZE_PRACTICAL_GUIDES: CampusPracticalGuide[] = [
  { icon: 'event', eyebrow: 'FIRST DAY', title: '到校第一天（周一）', facts: FIRST_DAY, note: '请准备5张5×5厘米证件照。入境和签证材料由思达启航顾问逐项帮你核对；eTravel入境登记也由顾问协助填写。' },
  {
    icon: 'restaurant',
    eyebrow: 'MEALS & HOURS',
    title: '用餐与开放时间',
    facts: [
      { label: '平日三餐', value: '07:00–07:50 / 11:30–13:00 / 17:30–18:30' },
      { label: '周末与假日', value: '08:00–08:50 / 12:00–13:00 / 17:30–18:30' },
      { label: '咖啡厅', value: '每天 08:00–23:00' },
      { label: '自习室', value: '平日08:00–24:00，周末10:00–24:00' },
      { label: '健身房', value: '平日15:45–21:00，周末09:00–21:00' },
      { label: '泳池', value: '平日17:00–21:00，周末09:00–21:00' },
    ],
    note: '周一至周日每天供应三餐。',
  },
  {
    icon: 'cleaning_services',
    eyebrow: 'SCHOOL SERVICES',
    title: '清洁、洗衣与看病',
    facts: [
      { label: '打扫', value: '每周2次，须登记并在场' },
      { label: '床单', value: '每2周免费更换' },
      { label: '自助洗衣', value: '免费，06:00–20:00；周一、三、五、六女生，周二、四、日男生' },
      { label: '洗衣服务', value: '5公斤130比索（48小时）或190比索（24小时），平日09:00–12:00、13:00–17:00收件' },
      { label: '医务室', value: '周一至周五09:00–18:00（13:00–14:00午休），节假日休息' },
      { label: '安全', value: '校内监控摄像头和24小时保安' },
    ],
    note: '校门口有药店。',
  },
  {
    icon: 'directions_bus',
    eyebrow: 'OFF-CAMPUS CONDO',
    title: '校外公寓',
    facts: [
      { label: '位置', value: '步行约5分钟到学校' },
      { label: '接送', value: '周一至周五 早上7:10、7:30，傍晚17:00、18:00' },
      { label: '费用', value: '含水费和Wi-Fi；电费和公共设施费各1,000比索／周／人' },
      { label: '入住', value: '最少1周；家庭房至少3人' },
    ],
    note: '2027/06/27–08/14暑期，校外公寓只接受家庭学生。',
  },
  {
    icon: 'receipt_long',
    eyebrow: 'OTHER FEES',
    title: '其他收费',
    facts: [
      { label: '加课（每4周）', value: '一对一150美元，小组课70美元，特色课100美元' },
      { label: '换课', value: '到校后更换课程100美元／4周' },
      { label: '送机', value: '1,200比索／人' },
      { label: '换房', value: '第一周免费，之后1,000比索' },
      { label: '补办', value: '房间钥匙500比索，学生证200比索' },
      { label: '保险箱', value: '押金500比索，租金100比索／周' },
      { label: '停留超过6个月', value: '离境前办理ECC 2,000比索和CRTV 1,910比索' },
    ],
    note: '比索费用到校后在学校缴纳。',
  },
  {
    icon: 'beach_access',
    eyebrow: 'WEEKENDS',
    title: '周末活动',
    facts: [{ label: '常见行程', value: '跳岛游、Oslob、市区游和志愿者活动' }],
    note: '自愿参加、费用自付。',
  },
];

export const IBREEZE_FAQS: FaqItem[] = [
  { question: 'I.BREEZE是斯巴达还是半斯巴达？', answer: '半斯巴达。平日课后可以外出，有课的前一晚22:00前回校；周五、周六和节假日前一晚24:00前回校。每日词汇测试和晚间课自由参加，零基础强化课程须参加词汇测试。' },
  { question: '2027年报名价格会变吗？', answer: '会。2026/12/31前报名按2026年价格，入学在2027年也一样；2027/01/01起报名按2027年价格，强化英语、零基础强化、轻度ESL、雅思起步和部分单人间、双人间调价。报价会按报名日期自动计算。', until: '2027-01-01' },
  { question: '现在报名有什么优惠？', answer: '2026/11/01–12/31报名、2027/05/02前入学，IB1/IB2双人间每4周减100美元，IB1三人间和IB1/IB2四人间每4周减200美元（至少住4周，2027/01/03–01/23的住宿周不计）；2026/12/27–2027/01/02在读的学生每人再减100美元；思达启航另给课程费和住宿费5%优惠。报价会自动计算。', until: '2027-01-01' },
  { question: '暑期有附加费吗？', answer: '有。2027/06/27–08/14在读的每周加收40美元，暑期最少报名4周；暑期校外公寓只接受家庭学生。' },
  { question: '可以带孩子来读吗？', answer: '可以。5–15岁的孩子读青少年英语，家长选成人课程一起入学。16–17岁可以单独来读，课程费按青少年英语计算，另收监护管理费100美元／4周（含免费机场接送和每4周一次跳岛游）。' },
  { question: '校外公寓和校内宿舍有什么不同？', answer: '校外公寓步行约5分钟，房内有厨房，含水费和Wi-Fi，电费和公共设施费各1,000比索／周／人，平日早晚有接送。校内宿舍分IB1主校区和IB2 Prime校区，公共管理费1,000比索／周、电费500比索／周、水费250比索／周。' },
  { question: '页面上的报价包含全部费用吗？', answer: '学校费用包含注册费、课程费和住宿费，并自动扣除优惠；到校学杂费单独列出，接机和押金另外准备。两者分开显示，不相加。' },
  { question: '思达启航会协助签证和入境吗？', answer: '会。通过思达启航报名，顾问会免费协助菲律宾入境和签证相关手续，你只需要按顾问指引准备个人资料。' },
];

export const IBREEZE_FINAL_CTA_BADGES = ['免费选校建议', '确认空房和优惠', '签证与入境协助'];

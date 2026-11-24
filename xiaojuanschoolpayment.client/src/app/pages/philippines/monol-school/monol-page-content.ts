// Text and data of the MONOL main-campus page, from the school's Google Drive pack: the October 2026 Chinese student
// handbook (学生手册CN 2026.10: services, courses, dormitory rules, penalties, fees, refund rules, graduation and
// class days), the 2026-10-23 campus overview (courses, fitness classes, MONOL+, weekend trips, rooms, services,
// meals, first day, BESA pickups), the 2026-09-07 fee sheet, the 2026 promotion poster, the 2027 BESA calendar
// and the school's photo and video folders. The shared Philippine school template reads this module through
// monol-page-profile.ts. Keep it pure data (no Angular, DOM or storage), so the WeChat mini program can reuse it.
// Never add the school's address, e-mail, website or contacts, and never anything the school addresses to agencies.
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
import type { PhOfferCard, PhPageCopy, PhRoomProfile } from '../school-page/ph-school-profile';
import { SCHOOL_REFERENCE_NOTE } from '../school-page/school-reference-note';

/** Closes every content section once; the same line as on every Philippine school page. */
export const MONOL_REFERENCE_NOTE = SCHOOL_REFERENCE_NOTE;

export const MONOL_PAGE_TEXT = {
  heroLead: 'MONOL 主校区在碧瑶凉爽的松林山间，一栋14层的楼里有教室、宿舍、健身房和咖啡餐厅。每天5节一对一加4节免费团体课，傍晚还有免费健身课，节奏自己安排。',
  advisorText: 'MONOL 主校区不走斯巴达路线：一对一是每天固定要上的核心课，团体课和健身课按需要自己选，晚上没有强制自习。课程分 Light ESL、General ESL、雅思和可以自己组合科目的 LEAP。住宿费不含餐，可以在校内咖啡餐厅用学生卡打85折、外出吃或在公共厨房自己做；洗衣、房间清洁和水电不另收费，电子教材免费。适合想认真学、又想保留自己生活节奏的成年人。',
  campusIntro: 'MONOL 是一栋14层的校舍，教室、宿舍和生活设施都在同一栋楼里；楼顶有露台和健身区，可以看碧瑶的山景和城市。',
  galleryIntro: '按区域查看校舍、教室、住宿、餐厅和运动设施；相册内用左右箭头或缩略图切换，点击主图可放大。',
  coursesIntro: '每门课都是每天5节一对一（Light ESL 4节）加最多4节免费团体课，傍晚还有免费健身课；点开课程可看每节课上什么和适合谁。每节课45分钟。',
  roomsPhotoIntro: '点选房型查看实景；各房型价格见上方住宿费表。',
  finalCtaTitle: '想确认 MONOL 主校区的空房和优惠？',
  finalCtaText: '告诉顾问你的入学日期、周数、课程和想住的房型，我们帮你确认房间并做一份完整报价。',
} as const;

export const MONOL_QUICK_INFO = [
  { icon: 'terrain', title: '碧瑶', text: '松林山间，常年约10–22度' },
  { icon: 'self_improvement', title: '半自律', text: '一对一必上，团体课和健身课自己选' },
  { icon: 'menu_book', title: '4门课程', text: 'Light ESL、General ESL、雅思和LEAP' },
  { icon: 'fitness_center', title: '免费健身课', text: '平日17:00–22:00，拳击、瑜伽、普拉提' },
  { icon: 'bed', title: '6种房型', text: '高级单人间到胶囊四人间，不含餐' },
  { icon: 'local_laundry_service', title: '不另收费', text: '洗衣、房间清洁、水电和电子教材' },
];

/** Key facts under the hero title (compact layout); what the building has is in MONOL_FACILITIES. */
export const MONOL_OVERVIEW_FACTS: ReadonlyArray<{ icon: string; label: string; value: string }> = [
  { icon: 'location_on', label: '位置', value: '菲律宾碧瑶松林山间，坐车10–15分钟到市中心' },
  { icon: 'rule', label: '管理', value: '半自律：每天一对一必上，团体课和健身课自由选择' },
  { icon: 'menu_book', label: '课程', value: 'Light ESL、General ESL、雅思（IELTS）、LEAP 客制化课程' },
  { icon: 'fitness_center', label: '健身', value: '平日17:00–22:00免费健身课，健身房每天7:00–22:00开放' },
  { icon: 'schedule', label: '门禁', value: '第二天有课21:00，第二天没课24:00' },
  { icon: 'event', label: '入学', value: '周日入住，周一分级测试；BESA团体接机每两周一次' },
  { icon: 'bed', label: '住宿', value: '高级单人间到胶囊四人间，住宿费不含餐' },
];

export const MONOL_BASIC_INFO: BasicInfoRow[] = [
  { label: '学校', value: 'MONOL 主校区（MONOL Language Academy）' },
  { label: '位置', value: '菲律宾碧瑶' },
  { label: '创办', value: '2003年，碧瑶语言学校协会（BESA）会员' },
  { label: '管理方式', value: '半自律，一对一必上，团体课和健身课自选' },
  { label: '课程', value: 'Light ESL、General ESL、IELTS、LEAP English' },
  { label: '住宿', value: '校内宿舍：高级单人间A型和B型、标准单人间、单人雅房、三人间、胶囊四人间' },
  { label: '入学', value: '周日入住，周一分级测试和新生说明会' },
];

export const MONOL_SUITABLE_FOR = [
  '想每天上足一对一、又不想被斯巴达管着的成年人',
  '想住单人间、下课后自己安排时间的学生',
  '准备雅思，或想按自己的目标组合课程（LEAP）的学生',
  '喜欢运动、想傍晚上免费健身课的学生',
];

export const MONOL_NOT_SUITABLE_FOR = [
  '需要学校全天管着学、晚上强制自习的学生（可以看 MONOL 斯巴达校区）',
  '希望住宿费包三餐的学生（这里吃饭另付）',
  '怕冷的学生（碧瑶全年约10–22度，要带外套）',
];

/** What the one building has, as the hero's campus strip. */
export const MONOL_FACILITIES: CampusBuildingCard[] = [
  { code: 'STUDY', title: '学习', icon: 'menu_book', facilities: ['一对一和团体教室', '自习室', '学生交谊厅'] },
  { code: 'FOOD', title: '吃饭', icon: 'restaurant', facilities: ['校内AQUA GARDEN咖啡餐厅', '公共厨房'] },
  { code: 'SPORT', title: '运动', icon: 'fitness_center', facilities: ['健身房和桑拿', '瑜伽室和拳击区', '室内高尔夫模拟器'] },
  { code: 'LIFE', title: '生活', icon: 'local_laundry_service', facilities: ['免费洗衣和自助洗衣机', '医务室', '24小时前台和保安'] },
];

const asset = (file: string) => `assets/philippines/monol-main/${file}`;
const campus = (name: string) => asset(`campus/${name}.webp`);
const room = (prefix: string, index: number) => asset(`rooms/${prefix}-${String(index).padStart(2, '0')}.webp`);
const rooms = (prefix: string, count: number) => Array.from({ length: count }, (_, index) => room(prefix, index + 1));
export const MONOL_QUOTE_IMAGE_HERO = `/${campus('building-aerial')}`;

const picture = (category: GalleryImage['category'], name: string, title: string, description: string): GalleryImage =>
  ({ category, title, description, src: campus(name) });

export const MONOL_GALLERY_IMAGES: GalleryImage[] = [
  picture('校园', 'building-aerial', 'MONOL 主校区校舍', '14层的校舍，四周是碧瑶的松林。'),
  picture('校园', 'baguio-view', '从学校看碧瑶', '学校在山上，窗外就是碧瑶的山景和城市。'),
  picture('校园', 'rooftop-sunset', '楼顶露台', '傍晚在露台看日落。'),
  picture('校园', 'rooftop-2', '楼顶露台', '有遮阳伞和桌椅，下课后可以在这里休息。'),
  picture('校园', 'rooftop-dusk', '楼顶露台', '露台外是碧瑶的山景。'),
  picture('校园', 'rooftop', '楼顶露台的傍晚', '露台也用来办学生聚会。'),
  picture('教室', 'one-to-one-room', '一对一教室', '一对一小教室。'),
  picture('教室', 'one-to-one-room-2', '一对一教室', '一张桌子，老师和学生面对面上课。'),
  picture('教室', 'group-classroom', '团体教室', '写作、文法、发音、讨论等团体课的教室。'),
  picture('教室', 'group-classroom-2', '团体教室', '靠窗的团体教室。'),
  picture('教室', 'self-study-room', '自习室', '课后自习和写作业的地方。'),
  { category: '住宿', title: '高级单人间A型', description: '两张大床，房内有按摩椅。', src: room('premium-a', 1) },
  { category: '住宿', title: '高级单人间B型', description: '两张大床，带厨房区。', src: room('premium-b', 2) },
  { category: '住宿', title: '标准单人间', description: '一人一间，卫浴在房内。', src: room('standard-single', 1) },
  { category: '住宿', title: '单人雅房', description: '一人一间的小房间。', src: room('semi-single', 1) },
  { category: '住宿', title: '三人间', description: '三张双人床尺寸的床。', src: room('triple', 1) },
  { category: '住宿', title: '胶囊四人间', description: '每人一个可以关上的胶囊床位。', src: room('capsule', 1) },
  picture('餐厅', 'aqua-garden-aquarium', 'AQUA GARDEN 咖啡餐厅', '学校自己经营的咖啡餐厅，以水族馆为主题。'),
  picture('餐厅', 'aqua-garden-night', 'AQUA GARDEN 的夜晚', '用学生卡付款打85折。'),
  picture('餐厅', 'aqua-garden-seating', 'AQUA GARDEN 座位区', '吃饭、喝咖啡和休息。'),
  picture('餐厅', 'aqua-garden-terrace', 'AQUA GARDEN 户外座位', '可以边吃边看山景。'),
  picture('餐厅', 'aqua-garden-meal', 'AQUA GARDEN 的餐点', '餐点按实际点餐付费。'),
  picture('餐厅', 'common-kitchen', '公共厨房', '可以自己做饭。'),
  picture('餐厅', 'common-kitchen-2', '公共厨房', '有水槽和操作台。'),
  picture('设施', 'gym', '健身房', '力量训练器械。'),
  picture('设施', 'gym-bikes', '健身房', '跑步机靠窗一排。'),
  picture('设施', 'gym-night', '健身房', '动感单车。'),
  picture('设施', 'gym-weights', '楼顶运动区', '健身课和自主训练的场地。'),
  picture('设施', 'yoga-room', '瑜伽室', '瑜伽和普拉提课在这里上。'),
  picture('设施', 'boxing-corner', '拳击区', '拳套、沙袋和训练用具。'),
  picture('设施', 'boxing-class', '拳击课', '平日18:00–19:00的免费拳击课。'),
  picture('设施', 'boxing-class-2', '拳击课', '教练带着练。'),
  picture('设施', 'golf-simulator', '室内高尔夫模拟器', 'MONOL+付费高尔夫课程使用。'),
  picture('设施', 'golf-simulator-lounge', '室内高尔夫模拟器', '模拟器旁有休息区。'),
  picture('设施', 'b6-lounge', '学生交谊厅', '沙发区，可以聊天和休息。'),
  picture('设施', 'massage-chairs', '按摩椅', '投币使用。'),
  picture('设施', 'clinic', '医务室', '平日08:00–17:00有护士值班。'),
];

export const MONOL_ALBUM_DESCRIPTIONS = {
  校园: '校舍、山景和楼顶露台',
  教室: '一对一教室、团体教室和自习室',
  住宿: '六种房型',
  餐厅: 'AQUA GARDEN 咖啡餐厅和公共厨房',
  设施: '健身房、瑜伽室、拳击区、高尔夫模拟器和医务室',
} as const;

/**
 * A clip from MONOL's own Drive folders, in public/assets/philippines/monol-main/videos/ (720p H.264 with a WebP
 * poster each). The campus tour keeps its Chinese labels and its weekend-trip part. Interviews from other countries'
 * markets, old promos, summer-camp and street-interview clips were left out. Every frame was checked for other
 * companies and contact details; check every frame of a new clip the same way.
 */
export interface MonolVideo {
  name: string;
  title: string;
  description: string;
  duration: string;
  /** Hero album group. */
  topic: '校园' | '宿舍' | '设施' | '访谈';
}

export const monolVideoSrc = (video: MonolVideo) => `/${asset(`videos/${video.name}.mp4`)}`;
export const monolVideoPoster = (video: MonolVideo) => `/${asset(`videos/${video.name}.webp`)}`;

export const MONOL_VIDEOS: MonolVideo[] = [
  { name: 'campus-tour', title: '校园导览', description: '宿舍、健身房、桑拿、公共厨房、交谊厅、医务室、高尔夫、洗衣房和AQUA GARDEN，最后是周末出游。', duration: '4:31', topic: '校园' },
  { name: 'b6-lounge', title: '学生交谊厅和自习区', description: '交谊厅、自习区、按摩椅和图书角。', duration: '1:17', topic: '校园' },
  { name: 'room-premium-b', title: '高级单人间B型', description: '两张大床和厨房区，可以和家人或伴侣同住。', duration: '0:48', topic: '宿舍' },
  { name: 'room-standard-single', title: '标准单人间', description: '一人一间，大床、书桌和卫浴。', duration: '0:48', topic: '宿舍' },
  { name: 'room-semi-single', title: '单人雅房', description: '一人一间的小房间。', duration: '1:11', topic: '宿舍' },
  { name: 'fitness-room', title: '瑜伽室和拳击区', description: '免费健身课的场地。', duration: '0:51', topic: '设施' },
  { name: 'golf-simulator', title: '室内高尔夫模拟器', description: 'MONOL+付费高尔夫课程使用的模拟器。', duration: '0:19', topic: '设施' },
  { name: 'interview-eddy', title: '中国学员 Eddy', description: '读 LEAP 课程的中国学员的英语访谈。', duration: '1:05', topic: '访谈' },
  { name: 'interview-jean', title: '中国学员 Jean', description: '读雅思课程的中国学员的英语访谈。', duration: '3:40', topic: '访谈' },
];

const ROOM_SERVICE = '住宿费不含餐；洗衣、房间清洁和水电不另收费';
const ROOM_KIT = '冰箱、微波炉、热水壶、除湿机和保险箱';

/** Photos come only from the school's room folders and match the labelled room type. */
export const MONOL_ROOM_PROFILES: PhRoomProfile[] = [
  {
    id: 'premium-a', rateIds: ['premium-single-room'], label: '高级单人间A型', location: '校内', bed: '两张双人床尺寸的床', service: ROOM_SERVICE,
    suitable: '想住得最舒服，或和家人、伴侣、朋友同住的学生',
    note: '可2–4人同住（同进同出），第一位按房价，每多1人加200美元／4周，加的部分不享受住宿优惠。',
    highlights: ['房内有按摩椅', '卫浴在房内', ROOM_KIT],
    image: room('premium-a', 1), gallery: rooms('premium-a', 6), imageAlt: 'MONOL主校区高级单人间A型实景',
  },
  {
    id: 'premium-b', rateIds: ['premium-single-b'], label: '高级单人间B型', location: '校内', bed: '两张双人床尺寸的床', service: ROOM_SERVICE,
    suitable: '想自己做饭，或和家人、伴侣同住的学生',
    note: '可2–4人同住（同进同出），第一位按房价，每多1人加200美元／4周，加的部分不享受住宿优惠。',
    highlights: ['房内有厨房区', '卫浴在房内', ROOM_KIT],
    image: room('premium-b', 2), gallery: rooms('premium-b', 6), imageAlt: 'MONOL主校区高级单人间B型实景',
  },
  {
    id: 'standard-single', rateIds: ['standard-single-room'], label: '标准单人间', location: '校内', service: ROOM_SERVICE,
    suitable: '想有自己的房间、下课后安静学习或远程工作的学生', note: '一人一间，卫浴一体，在房内。',
    highlights: ['卫浴在房内', ROOM_KIT],
    image: room('standard-single', 1), gallery: rooms('standard-single', 5), imageAlt: 'MONOL主校区标准单人间实景',
  },
  {
    id: 'semi-single', rateIds: ['small-single-room'], label: '单人雅房', location: '校内', service: ROOM_SERVICE,
    suitable: '想要自己的房间、又想省一点预算的学生', note: '一人一间的小房间，由大房间隔成两间，两间共用卫浴。',
    highlights: ['一人一间', ROOM_KIT],
    image: room('semi-single', 1), gallery: rooms('semi-single', 6), imageAlt: 'MONOL主校区单人雅房实景',
  },
  {
    id: 'triple', rateIds: ['triple-room'], label: '三人间', location: '校内', bed: '三张双人床尺寸的床', service: ROOM_SERVICE,
    suitable: '预算有限、想和不同国家的室友一起练口语的学生', note: '三人一间，床是双人床尺寸。',
    highlights: ['卫浴在房内', ROOM_KIT],
    image: room('triple', 1), gallery: rooms('triple', 6), imageAlt: 'MONOL主校区三人间实景',
  },
  {
    id: 'capsule', rateIds: ['quad-room'], label: '胶囊四人间', location: '校内', bed: '四个胶囊床位（上下铺）', service: ROOM_SERVICE,
    suitable: '预算优先、又想要一点私人空间的学生', note: '四人一间，每人一个可以关上的胶囊床位；是最省预算的房型。',
    highlights: ['每人一个胶囊床位', '靠窗的长书桌', ROOM_KIT],
    image: room('capsule', 1), gallery: rooms('capsule', 6), imageAlt: 'MONOL主校区胶囊四人间实景',
  },
];

/** The handbook's dormitory rules, curfew, trips and penalty points. */
export const MONOL_DORM_RULES = [
  { title: '门禁', text: '第二天有课21:00前回来，第二天没课24:00前回来；05:00以后才能出门。晚归按分钟记罚分。' },
  { title: '周末旅行', text: '周五17:00到周日21:00可以出去旅行。平日也要出去的，行程须包括周末两天、最多5天，出发3天前到学生事务办公室（SRD）申请。' },
  { title: '未成年学生', text: '外出要有外出许可单，并由监护人或成年学生陪同。' },
  { title: '房间', text: '禁止进入异性学生的房间（楼层有监控）；宿舍内禁止明火，电热毯须经理同意；有空房可申请换房，两周一次。' },
  { title: '烟酒', text: '只能在指定吸烟区吸烟；酒不能带进校园，校内不能喝酒。' },
  { title: '安静时间', text: '22:00–07:00保持安静；校内只说英语，说其他语言记2分。' },
  { title: '罚分', text: '违规按分数累计：满20分与经理面谈，满40分取消后面的课程（按退款规定退费），满80分立即退学且当期不退。罚分每期清零。' },
  { title: '退学', text: '毒品、偷窃、打架、性骚扰和赌博等行为，可能直接退学。' },
];

/**
 * A General ESL weekday: 5 one-to-one and 4 group classes of 45 minutes between 08:00 and 17:00 (which period is
 * which comes from each student's own timetable), then the free fitness classes (the 2026-10-23 overview).
 */
export const MONOL_SCHEDULE: DailyScheduleRow[] = [
  { time: '07:00–08:00', activity: '早餐（上课日免费）', kind: 'meal' },
  { time: '08:00–08:45', activity: '第1节', kind: 'class' },
  { time: '08:55–09:40', activity: '第2节', kind: 'class' },
  { time: '09:50–10:35', activity: '第3节', kind: 'class' },
  { time: '10:45–11:30', activity: '第4节', kind: 'class' },
  { time: '11:40–12:25', activity: '第5节', kind: 'class' },
  { time: '12:25–13:30', activity: '午餐和休息', kind: 'meal' },
  { time: '13:30–14:15', activity: '第6节', kind: 'class' },
  { time: '14:25–15:10', activity: '第7节', kind: 'class' },
  { time: '15:20–16:05', activity: '第8节', kind: 'class' },
  { time: '16:15–17:00', activity: '第9节', kind: 'class' },
  { time: '17:00–18:00', activity: '健身房训练（教练指导）', kind: 'activity' },
  { time: '18:00–19:00', activity: '拳击', kind: 'activity' },
  { time: '19:00–20:00', activity: '冲浪Fit', kind: 'activity' },
  { time: '20:00–21:00', activity: '普拉提（周一、周二）或瑜伽（周三至周五）', kind: 'activity' },
  { time: '21:00–22:00', activity: '健身房训练', kind: 'activity' },
];

export const MONOL_COURSE_DETAIL_GUIDES: CourseDetailGuide[] = [
  {
    icon: 'spa',
    title: 'Light ESL 每天上什么',
    subtitle: '4节一对一 + 4节团体课（选修）+ 健身课（选修）',
    courseIds: ['esl-4'],
    facts: [
      { label: '一对一', value: '口语2节、听力1节、阅读1节' },
      { label: '团体课', value: '写作、文法、发音、讨论，自己选' },
      { label: '教材', value: '和 General ESL 相同' },
    ],
    points: ['一对一从 General ESL 的5节里选4节；没特别说明时少上1节听力。'],
  },
  {
    icon: 'record_voice_over',
    title: 'General ESL 每天上什么',
    subtitle: '5节一对一 + 4节团体课（选修）+ 健身课（选修）',
    courseIds: ['general-esl'],
    facts: [
      { label: '一对一', value: '口语2节、听力2节、阅读1节' },
      { label: '团体课', value: '写作、文法、发音、讨论，自己选' },
      { label: '级别', value: '从初级到高级共5级（CEFR A1–C1），每级2册学校自编教材' },
      { label: '升级', value: '每册4周，两册总成绩80分以上可升级' },
    ],
    points: ['一对一练说和听这些“技能”，团体课补文法、写作这些“知识”，每天最多9节。'],
  },
  {
    icon: 'workspace_premium',
    title: 'IELTS 雅思每天上什么',
    subtitle: '5节一对一 + 4节团体课（选修）+ 每两周模考',
    courseIds: ['ielts'],
    facts: [
      { label: '一对一', value: '口语、听力、阅读、写作Task 1、写作Task 2各1节' },
      { label: '团体课', value: '雅思口语、雅思文法、雅思听力和发音' },
      { label: '模考', value: '每两周一次' },
      { label: '学术管理费', value: '学费里含100美元／4周' },
    ],
    points: ['培训类和学术类（GT／Academic）都可以学。', '雅思科目只由完成学校培训、各科达到雅思7.0标准的老师教。'],
  },
  {
    icon: 'tune',
    title: 'LEAP English 怎么排课',
    subtitle: '5节一对一自选科目 + 4节团体课（选修）',
    courseIds: ['leap-english'],
    facts: [
      { label: '一对一', value: '从ESL、雅思、托业、商务英语、演讲、面试、旅行英语、医疗英语、空乘英语等科目中任选5节' },
      { label: '导师', value: '每位学生有导师制定学习计划、跟进进度' },
      { label: '入读前', value: '先做测试和学习目标分析' },
      { label: '学术管理费', value: '学费里含250美元／4周' },
    ],
    points: ['在校中途转读 LEAP 的，第二周到 SRD 申请，第四周周四前确认。'],
  },
  {
    icon: 'event_available',
    title: '分级、升级和上课天数',
    subtitle: '所有课程',
    facts: [
      { label: '分级测试', value: '入学第一个周一考听说读写，分班后自己不能要求换班' },
      { label: '没过升级', value: '77–79分可补考一次；76分以下进入4周补充课程' },
      { label: '跳级', value: '第3、4周由老师推荐，学校通知参加，考过跳过下一册' },
      { label: '上课天数', value: '每4周一期20天课（新生19天）；遇假日至少保证18天，多出的假日补课' },
      { label: '老师', value: '随机安排，不能指定；有正当理由可以申请更换' },
    ],
    points: ['课程可以每天加1节一对一：General ESL 150美元、雅思165美元、LEAP 180美元／4周。'],
  },
];

export const MONOL_PRACTICAL_GUIDES: CampusPracticalGuide[] = [
  {
    icon: 'restaurant',
    eyebrow: 'MEALS',
    title: '吃饭怎么安排',
    facts: [
      { label: '早餐', value: '上课日免费（周末和假日除外），到2027/12/31' },
      { label: '校内餐厅', value: 'AQUA GARDEN 咖啡餐厅，学生卡付款打85折' },
      { label: '自己做', value: '公共厨房可以做饭' },
      { label: '花费', value: '每餐约150–250比索，4周约14,000比索' },
    ],
    note: '学费和住宿费都不含餐，也可以外出吃或叫外卖。',
  },
  {
    icon: 'local_laundry_service',
    eyebrow: 'SERVICES',
    title: '生活服务',
    facts: [
      { label: '洗衣', value: '免费：周一至周五08:00–13:00送洗，2–3天后14:00–16:30领取；楼顶也有自助洗衣机（自带洗衣液）' },
      { label: '房间清洁', value: '免费，预约后在你在房间时打扫' },
      { label: '水电', value: '不另收费' },
      { label: '教材', value: '电子教材免费（自带电脑或平板），纸本每本200比索起' },
      { label: '医务室', value: '平日08:00–17:00有护士，需要时协助看医生' },
      { label: '安全', value: '24小时前台和保安，有发电机和净水设备' },
    ],
    note: '贵重物品可以放房间的密码保险箱，或交给学生事务办公室（SRD）保管。',
  },
  {
    icon: 'flight_land',
    eyebrow: 'ARRIVAL',
    title: '接机和入学第一天',
    facts: [
      { label: '2027年BESA接机日', value: '1/10、1/24、2/7、2/21、3/7、3/21、4/4、4/18、5/2、5/16、5/30、6/13、6/27、7/11、7/25、8/8、8/22、9/5、9/19、10/3、10/17、10/31、11/14、11/28、12/12、12/26（都是周日）' },
      { label: '马尼拉机场', value: '1号航站楼B6、3号航站楼Bay 7，周日01:00、08:00、14:00、20:00' },
      { label: '克拉克机场', value: '2号航站楼Bay 3，周日12:00、13:30、17:00和周一01:30' },
      { label: '其他日期', value: '也可以入学，要安排个人接机或自己到校' },
      { label: '第一天', value: '08:00–12:00分级测试，13:00–15:00新生说明会，15:30–18:00校园和SM商场导览' },
    ],
    note: '带2张2×2英寸照片，想好2个英文名；碧瑶约10–22度，记得带外套和长袖。离校送机只到克拉克机场。',
  },
  {
    icon: 'sports_golf',
    eyebrow: 'MONOL+ & TRIPS',
    title: '付费课程和周末出游',
    facts: [
      { label: '高尔夫', value: '韩籍专业教练一对一，12节一套；有室内模拟器，也可以去球场练（付费）' },
      { label: '咖啡师', value: '在AQUA GARDEN学，每周3次、3周完成，结业有证书（付费）' },
      { label: '周末出游', value: '每两周一次，去百岛、维甘古城、Pugo、San Juan、Bauang等地（费用另付）' },
      { label: '冲浪之旅', value: '没有周末出游的那一周，每两周去San Juan冲浪一次' },
    ],
    note: '费用和日期以学校当期通知为准。',
  },
  {
    icon: 'storefront',
    eyebrow: 'NEARBY',
    title: '学校周边',
    facts: [
      { label: '步行', value: '餐厅1分钟，便利店2分钟，菲律宾菜餐厅约6分钟' },
      { label: '坐车', value: '超市10–15分钟，SM商场15–20分钟' },
    ],
    note: '时间是学校给的参考。',
  },
];

/** The 2027 calendar, weekday holidays only (the school's 2027 calendar); weekend holidays change no class day. */
export const MONOL_HOLIDAY_CALENDARS: HolidayCalendar[] = [
  {
    year: 2027,
    label: '学校2027年日历',
    months: [
      { month: 1, holidays: [{ day: '1日', name: '元旦' }] },
      { month: 3, holidays: [{ day: '10日', name: '开斋节', provisional: true }, { day: '25日', name: '圣周四' }, { day: '26日', name: '耶稣受难日' }] },
      { month: 4, holidays: [{ day: '9日', name: '勇士日' }] },
      { month: 5, holidays: [{ day: '17日', name: '宰牲节', provisional: true }] },
      { month: 7, holidays: [{ day: '15日', name: '科迪勒拉自治区成立纪念日' }] },
      { month: 8, holidays: [{ day: '30日', name: '国家英雄日' }] },
      { month: 9, holidays: [{ day: '1日', name: '碧瑶市日' }, { day: '13日', name: '达塔山和平协议40周年' }] },
      { month: 10, holidays: [{ day: '1日', name: '教师节' }] },
      { month: 11, holidays: [{ day: '1日', name: '万圣节' }, { day: '2日', name: '万灵节' }, { day: '30日', name: '博尼法西奥日' }] },
      { month: 12, holidays: [{ day: '8日', name: '圣母无原罪瞻礼' }, { day: '24日', name: '平安夜' }, { day: '30日', name: '黎刹日' }, { day: '31日', name: '除夕' }] },
    ],
  },
];

/** The 2026 promotion poster and the fee sheet; cards hide when their rules are switched off or have ended. */
export const MONOL_OFFERS: PhOfferCard[] = [
  { icon: 'how_to_reg', title: '思达启航免注册费', amount: '免100美元', text: '通过思达启航报名，学校注册费全免。', promotionIds: ['monol-registration-waiver'] },
  {
    icon: 'savings', title: '2026学费和住宿优惠', amount: '每满4周各减100美元',
    text: '2026/12/31前报名，在主校区学习并住宿；学费和住宿费每满4周各减100美元。',
    detail: '雅思和LEAP的学术管理费不减；2027/06/27–08/21的周数不算。',
    until: '2027-01-01', promotionIds: ['monol-off-season-course-2026', 'monol-off-season-room-2026'],
  },
  {
    icon: 'photo_camera', title: 'SNS活动', amount: '每满4周再减100美元',
    text: '住标准单人间或单人雅房，2026/12/31前报名，在小红书、Instagram、TikTok等任一平台发1篇在校故事。',
    detail: '活动可能随时结束，报名前由顾问向学校确认；2027/06/27–08/21的周数不算。',
    until: '2027-01-01', promotionIds: ['monol-sns'],
  },
  {
    icon: 'hourglass_bottom', title: '长住优惠', amount: '16／20／24周减150／200／300美元',
    text: '2026/09/07–12/31报名，学习并住宿16、20或24周。',
    detail: '取消或缩短周数则不再适用。',
    until: '2027-01-01', promotionIds: ['monol-long-term'],
  },
  {
    icon: 'celebration', title: '圣诞新年优惠', amount: '每人减100美元',
    text: '2026/11/29–2027/01/10之间的周日入学，学习并住宿至少4周。',
    detail: '学校保证假期期间的上课天数。',
    until: '2027-01-11', promotionIds: ['monol-christmas'],
  },
  {
    icon: 'free_breakfast', title: '上课日免费早餐', amount: '有效到2027/12/31',
    text: '上课日早餐免费，周末和假日除外。',
    until: '2028-01-01',
  },
];

/** Refunds after arrival follow the handbook; agency-facing lines are left out, and 思达启航's own deposit rule comes first. */
export const MONOL_REFUND_COPY: NonNullable<PhPageCopy['refund']> = {
  summaryTitle: 'MONOL 主校区取消与退款规定',
  summaryHint: '报名定金、入学前取消、到校后退款',
  eyebrow: 'CANCELLATION & REFUND',
  title: 'MONOL 主校区取消与退款规定',
  intro: '到校后的退款按4周一期计算；每周从周日算到周六，延长课程后退费也按同样规定。',
  alert: '报名前请确认',
  groups: [
    {
      title: '报名与入学前',
      note: '',
      rules: [
        { when: '报名定金', text: '通过思达启航报名时预收定金2,000元人民币，为学生向学校订位；定金交了以后不退。' },
        { when: '改期与保留', text: '入学4周前告诉顾问，可以免费改入学日期，或申请把定金保留1年。' },
        { when: '入学14天以前取消', text: '学校退还已付的学费和住宿费。' },
        { when: '入学前14天内取消', text: '扣100美元营运损失费，其余退还。' },
      ],
      footnote: '',
    },
    {
      title: '到校以后',
      note: '',
      rules: [
        { when: '第一周内申请', text: '当周周五前申请，扣除当周的学费、住宿费和学术管理费，其余退还。' },
        { when: '下一期开始14天以前申请', text: '退还该期学费、住宿费和学术管理费的70%。' },
        { when: '下一期开始前14天内申请', text: '退70%，另扣2周原价住宿费。' },
        { when: '这一期已经开始', text: '这一期不退。' },
        { when: '换便宜的房型或课程', text: '入学说明当天申请，退差价的70%；之后申请退50%。' },
        { when: '从雅思或LEAP换到General ESL', text: '入学说明当天或下一期开始前申请，学术管理费全退；这一期开始后不退。' },
      ],
      footnote: '',
    },
    {
      title: '其他情况',
      note: '',
      rules: [
        { when: '违规退学', text: '已交的学费都不退。' },
        { when: '不退的费用', text: 'SSP、ACR I-CARD、签证延签、注册费、接机费和转账手续费。' },
        { when: '怎么申请', text: '到学校学生事务办公室（SRD）填退费申请，毕业后两周内退还，由思达启航协助办理。' },
      ],
      footnote: MONOL_REFERENCE_NOTE,
    },
  ],
};

export const MONOL_FAQS: FaqItem[] = [
  { question: 'MONOL 主校区和斯巴达校区有什么不同？', answer: '主校区是半自律：每天一对一必上，团体课和健身课自己选，晚上没有强制自习，住宿费不含餐。斯巴达校区每天10节学习安排、晚上测验、住宿含三餐。两个校区的课程、价格、房型和优惠都分开。' },
  { question: '每天要上几节课？', answer: 'General ESL、雅思和 LEAP 每天5节一对一，Light ESL 4节；另外最多4节团体课和傍晚的健身课，都免费、自由参加。每节课45分钟，08:00–17:00之间上。' },
  { question: '住宿费包含吃饭吗？', answer: '不包含。上课日早餐免费（到2027/12/31），其他餐可以在校内 AQUA GARDEN 咖啡餐厅吃（学生卡打85折）、外出吃，或在公共厨房自己做，每餐约150–250比索。洗衣、房间清洁和水电不另收费。' },
  { question: '现在报名有什么优惠？', answer: '通过思达启航报名免100美元注册费。2026/12/31前报名并在主校区学习住宿，学费和住宿费每满4周各减100美元；住标准单人间或单人雅房参加SNS活动，每满4周再减100美元；2026/09/07–12/31报名读16／20／24周再减150／200／300美元；2026/11/29–2027/01/10周日入学读满4周再减100美元。报价器会自动计算。' },
  { question: '暑假去要多交钱吗？', answer: '2027/06/27–08/22 是碧瑶学校的暑期旺季，在这段时间学习或住宿的每一周加收60美元；同一周课程和住宿只算一次，不参加任何优惠。' },
  { question: '可以只读1–3周吗？', answer: '可以。1周按4周价格的40%，2周60%，3周80%；4周以上按实际周数计算，例如6周是4周价格的1.5倍。学校建议至少读8周。' },
  { question: '可以和家人或伴侣一起住吗？', answer: '可以住高级单人间A型或B型：房里有两张大床，最多4人同住，需同进同出。第一位按房价，每多1人加200美元／4周，加的部分不享受住宿优惠。' },
  { question: '签证费用怎么算？', answer: '持30天签证读5–8周要延签1次，持59天签证读到9周才要延签。延签第一次6,210比索，之后每次4,240比索；另交SSP 7,800比索和SSP ACR I-CARD 4,500比索。报价器按你选的签证和周数自动算。' },
  { question: '页面上的报价包含全部费用吗？', answer: '学校费用包含课程费和住宿费，并自动扣除优惠；到校学杂费单独列出，押金和餐费另外准备。两者分开显示，不相加。' },
  { question: '思达启航会协助签证和入境吗？', answer: '会。通过思达启航报名，顾问会免费协助菲律宾入境和签证相关手续，你只需要按顾问指引准备个人资料。' },
];

export const MONOL_FINAL_CTA_BADGES = ['免费选校建议', '确认空房和优惠', '签证与入境协助'];

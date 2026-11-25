// Text and data of the CIEC school page, from CIEC's 2027 Chinese brochure, the 2027 tuition sheet, the 2027
// low-season offer, the new-student guide and the 2027 holiday poster (school pack received 2026-11-23). The shared
// Philippine school template reads it through ciec-page-profile.ts. Keep it pure data (no Angular, DOM or storage),
// so the WeChat mini program can reuse it. Never add the school's phone, address, website, e-mail or social accounts.
import type {
  BasicInfoRow,
  CampusBuildingCard,
  CampusPracticalGuide,
  CiaShortVideo,
  CiaVideoCard,
  CourseDetailGuide,
  DailyScheduleRow,
  FaqItem,
  GalleryImage,
  HolidayCalendar,
} from '../cia-school/cia-page-content';
import type { PhRoomProfile, PhVideoItem, PhVideoTab } from '../school-page/ph-school-profile';
import { SCHOOL_REFERENCE_NOTE } from '../school-page/school-reference-note';
import {
  CIEC_CIDEC_ID,
  CIEC_DOUBLE_ROOM_ID,
  CIEC_FAMILY2_TRIPLE_ROOM_ID,
  CIEC_FAMILY4_ROOM_ID,
  CIEC_GUARDIAN_COURSE_IDS,
  CIEC_KINDERGARTEN_ID,
  CIEC_TRIPLE_ROOM_ID,
} from './ciec-content-config';

/** Closes every content section once; the same line as on every Philippine school page. */
export const CIEC_REFERENCE_NOTE = SCHOOL_REFERENCE_NOTE;

export const CIEC_PAGE_TEXT = {
  heroLead: '宿务市Talamban区的青少年和亲子语言学校，学校管理孩子的学习和生活；有幼儿园、青少年、家长课程，也能读菲律宾正规学年。',
  advisorText: 'CIEC 只做青少年和亲子游学，课程是专门为孩子设计的，不是把成人课程改给孩子上。学校在宿务市区外的Talamban，附近是几所国际学校，环境安静。孩子不能自己外出，家长要带自己孩子出门也要登记、22:00前回校；没有家长陪同的孩子由学校负责管理。适合带4岁以上孩子来游学的家庭，也适合准备读宿务国际学校或想用CIDEC读菲律宾学历的学生。',
  campusIntro: '教室、宿舍、餐厅、泳池和球场都在同一个校园里，宿舍可住约140名学生。',
  galleryIntro: '按区域查看校园、课堂、宿舍、餐厅和设施；相册内用左右箭头或缩略图切换，点击主图可放大。',
  coursesIntro: '按孩子的年龄和目标分组，每门课下面是每天的课时；点开可看适合谁和课程说明。',
  roomsPhotoIntro: '点选房型查看实景；各房型价格见上方住宿费表。',
  finalCtaTitle: '想确认 CIEC 的空房和淡季优惠？',
  finalCtaText: '告诉顾问孩子的年龄、入学日期、周数和同行家人，我们帮你确认房间并做一份完整报价。',
} as const;

export const CIEC_QUICK_INFO = [
  { icon: 'location_on', title: '宿务市Talamban', text: '市区外的安静区域，附近是几所国际学校' },
  { icon: 'family_restroom', title: '青少年和亲子', text: '满4岁到高三的孩子，以及陪读家长' },
  { icon: 'school', title: '70多位一对一老师', text: '小组课最多7人，按水平和年龄分班' },
  { icon: 'pool', title: '泳池和球场', text: '孩子游泳须家长陪同' },
  { icon: 'bed', title: '校内宿舍', text: '双人间、三人间，含工作日三餐、周末两餐' },
  { icon: 'event_available', title: '全年开班', text: '每周日入住，周一分级测试' },
];

/** Key facts under the hero title (compact layout); what each area has is in CIEC_CAMPUS_BUILDINGS. */
export const CIEC_OVERVIEW_FACTS: ReadonlyArray<{ icon: string; label: string; value: string }> = [
  { icon: 'location_on', label: '位置', value: '宿务市Talamban区，到Gaisano Grand商场约5分钟、Ayala商场约30分钟车程' },
  { icon: 'family_restroom', label: '学生', value: '满4岁（48个月）到高三的孩子，以及陪孩子来的家长' },
  { icon: 'rule', label: '管理', value: '孩子只参加学校安排的外出；家长登记后可带自己孩子外出，22:00前回校' },
  { icon: 'menu_book', label: '课程', value: '幼儿园、青少年学术／密集、青少年雅思托福、入学准备、留学课程、CIDEC学历课程和家长课程' },
  { icon: 'event', label: '入学', value: '全年开班，每周日入住，周一分级测试' },
  { icon: 'bed', label: '住宿', value: '校内双人间、三人间，约140个床位；含工作日三餐、周末两餐' },
  { icon: 'event_busy', label: '旺季', value: '6–8月、12–2月报名，每户先交500美元订位押金' },
];

export const CIEC_BASIC_INFO: BasicInfoRow[] = [
  { label: '学校', value: 'CIEC GLOBAL（Cebu Ivy Education Center）' },
  { label: '位置', value: '菲律宾宿务市 Talamban 区' },
  { label: '学生', value: '满4岁（48个月）到高三的孩子和陪读家长' },
  { label: '课程', value: '幼儿园、青少年、考试、升学、CIDEC学历和家长课程' },
  { label: '住宿', value: '校内双人间、三人间' },
  { label: '入学', value: '全年开班，每周日入住、周一开课' },
];

export const CIEC_SUITABLE_FOR = [
  '带4–17岁孩子来游学的家长',
  '寒暑假想让孩子集中补英语的家庭',
  '准备考宿务国际学校、私立学校或海外学校的学生',
  '想在游学期间同时读菲律宾正规学年（CIDEC）的学生',
];

export const CIEC_NOT_SUITABLE_FOR = [
  '独自来读的成人：CIEC只收孩子和陪读家长',
  '想自由外出的学生：孩子不能自己外出，家长外出要登记',
  '需要素食、过敏或病号餐的学生：学校不提供特殊餐',
];

export const CIEC_CAMPUS_BUILDINGS: CampusBuildingCard[] = [
  { code: 'STUDY', title: '教学区', icon: 'school', facilities: ['70多位一对一老师', '小组课教室，最多1:7', 'AVR多功能教室', '自习室 08:30–22:00'] },
  { code: 'DORM', title: '校内宿舍', icon: 'bed', facilities: ['约140个床位，双人间和三人间', '床、衣柜、书桌、冰箱、变频空调', '每周2次洗衣和打扫'] },
  { code: 'LIFE', title: '休闲设施', icon: 'pool', facilities: ['游泳池（孩子须家长陪同）', '篮球场和宽敞庭院', '每月一次全校活动'] },
  { code: 'DINING', title: '餐厅与茶水间', icon: 'restaurant', facilities: ['工作日三餐、周末两餐', '茶水间有电磁炉、锅和微波炉', '校内小卖部'] },
];

const asset = (file: string) => `assets/ciec/${file}.webp`;

/** CIEC's own brochure photos (2027 Chinese brochure); each label matches what the brochure shows. */
export const CIEC_GALLERY_IMAGES: GalleryImage[] = [
  { category: '校园', title: 'CIEC校园', description: '校门口的CIEC标志和两层宿舍楼。', src: asset('campus-entrance') },
  { category: '校园', title: '校园庭院', description: '从楼上看校园庭院。', src: asset('campus-courtyard') },
  { category: '校园', title: '校园一角', description: '校内的平房和有顶棚的走道。', src: asset('campus-building') },
  { category: '校园', title: '庭院里的活动', description: '学生在宿舍楼前的庭院里做游戏。', src: asset('campus-activity') },
  { category: '校园', title: 'CIEC标志', description: '学生在校园的CIEC标志前合影。', src: asset('campus-sign') },
  { category: '校园', title: '毕业典礼', description: '毕业典礼上穿学士服的学生。', src: asset('graduation') },
  { category: '校园', title: '演讲比赛', description: '校内英语演讲比赛。', src: asset('speech-contest') },
  { category: '教室', title: '小组课', description: '小组课最多7人，按水平和年龄分班。', src: asset('class-group') },
  { category: '教室', title: '一对一课', description: '孩子和老师一对一上课。', src: asset('class-one-to-one') },
  { category: '教室', title: '家长一对一课', description: '家长课程每天3节一对一。', src: asset('class-one-to-one-adult') },
  { category: '教室', title: '幼儿园自然拼读', description: '幼儿园的一对一字母和自然拼读课。', src: asset('kindergarten-phonics') },
  { category: '教室', title: '幼儿园美术课', description: '幼儿园孩子一起画画。', src: asset('kindergarten-art') },
  { category: '教室', title: '幼儿园烹饪活动', description: '幼儿园孩子戴上厨师帽做食物。', src: asset('kindergarten-cooking') },
  { category: '教室', title: '课堂动手活动', description: '学生分组动手做实验。', src: asset('class-science') },
  { category: '教室', title: '项目课展示', description: '学生用英语介绍自己的项目。', src: asset('class-project') },
  { category: '教室', title: '课后辅导', description: '老师在图书区陪学生做功课。', src: asset('class-tutoring') },
  { category: '教室', title: '小组课教室', description: '有投影和空调的教室。', src: asset('classroom') },
  { category: '教室', title: 'AVR多功能教室', description: '分级测试和新生说明会在这里进行。', src: asset('class-avr') },
  { category: '住宿', title: '双人间', description: '两张单人床、衣柜和书桌。', src: asset('room-double') },
  { category: '住宿', title: '三人间', description: '三张单人床，有冰箱和空调。', src: asset('room-triple') },
  { category: '住宿', title: '房间衣柜和冰箱', description: '每人一个衣柜，房间有冰箱。', src: asset('room-wardrobe') },
  { category: '住宿', title: '宿舍卫生间', description: '房间内的卫生间。', src: asset('room-bathroom') },
  { category: '餐厅', title: '学生餐厅', description: '工作日三餐、周末两餐。', src: asset('canteen') },
  { category: '餐厅', title: '茶水间', description: '有电磁炉、锅、平底锅和微波炉，07:00–22:00开放。', src: asset('kitchenette') },
  { category: '餐厅', title: '校内小卖部', description: '零食、饮料和日用品。', src: asset('store') },
  { category: '设施', title: '游泳池', description: '孩子游泳须家长陪同。', src: asset('pool') },
  { category: '设施', title: '泳池边', description: '泳池旁有遮阳伞和座位。', src: asset('pool-02') },
  { category: '设施', title: '孩子们游泳', description: '课后在泳池玩水。', src: asset('pool-kids') },
  { category: '设施', title: '篮球场', description: '校内的篮球场。', src: asset('basketball') },
];

export const CIEC_ALBUM_DESCRIPTIONS = {
  校园: '校园、庭院与校内活动',
  教室: '一对一、小组课和幼儿园课堂',
  住宿: '双人间、三人间与卫生间',
  餐厅: '学生餐厅、茶水间与小卖部',
  设施: '游泳池与篮球场',
} as const;

/** One video in public/assets/ciec/videos/: <name>.mp4 with its poster-<name>.jpg. */
export interface CiecVideo {
  name: string;
  title: string;
  description: string;
  duration: string;
  orientation: 'landscape' | 'portrait';
  label?: string;
  details?: string[];
}

export const ciecVideoSrc = (video: CiecVideo) => `/assets/ciec/videos/${video.name}.mp4`;
export const ciecVideoPoster = (video: CiecVideo) => `/assets/ciec/videos/poster-${video.name}.jpg`;

/**
 * Clips from CIEC's own YouTube channels (CIEC GLOBAL and the Korean CIDEC CIEC channel), checked frame by frame on
 * 2026-11-25. The tour lost its logo cards (they carry a “best junior school” slogan) and the STEAM class its stock
 * footage and subscribe card. Left out: talks in Vietnamese only (parent interviews, a seminar, a graduate), clips
 * that show only the airport, and 2018–2019 footage of the campus before it was repainted.
 */
export const CIEC_VIDEOS: CiecVideo[] = [
  {
    name: 'ciec-school-tour-2022', title: '校园导览（2022年）', duration: '3:18', orientation: 'landscape', label: 'SCHOOL TOUR',
    description: '学校2022年拍的校园导览：庭院、户外用餐区、餐厅、游泳池、自习室、大厅、幼儿园教室、AVR教室，以及双人间、三人间和卫生间。',
    details: ['庭院、餐厅与游泳池', '幼儿园与AVR教室', '双人间和三人间'],
  },
  {
    name: 'ciec-pronunciation-class', title: '发音课实拍', duration: '2:25', orientation: 'portrait',
    description: '老师全程用英语上发音课，边写白板边讲解单词的读法。',
  },
  {
    name: 'ciec-steam-class-2020', title: 'STEAM体验课（2020年）', duration: '2:22', orientation: 'landscape', label: 'STEAM CLASS',
    description: '2020年学校STEAM营的一节课：老师用英语讲结构工程和桁架桥，学生分组搭桥，再放砖块做承重测试。',
    details: ['老师用英语讲解', '学生分组动手搭桥', '承重测试'],
  },
  {
    name: 'ciec-summer-camp-2026', title: '一位学员的夏令营（2026年）', duration: '3:19', orientation: 'portrait',
    description: '学校跟拍一位学员的2026年夏令营：欢迎会、一对一和小组课、自助餐、和老师一起吃饭、出海游玩、毕业典礼。字幕是越南语。',
  },
  {
    name: 'ciec-student-teachers', title: '学生说：最喜欢的老师（一）', duration: '0:36', orientation: 'portrait',
    description: '学生用英语讲自己最喜欢的CIEC老师，以及喜欢的原因。',
  },
  {
    name: 'ciec-favourite-teacher', title: '学生说：最喜欢的老师（二）', duration: '0:35', orientation: 'portrait',
    description: '另一位学生用英语讲自己最喜欢的CIEC老师。',
  },
];

const ciecVideo = (name: string) => CIEC_VIDEOS.find(video => video.name === name) as CiecVideo;
const albumVideo = (name: string): PhVideoItem => {
  const video = ciecVideo(name);
  return {
    title: video.title,
    text: video.description,
    src: ciecVideoSrc(video),
    poster: ciecVideoPoster(video),
    duration: video.duration,
    shape: video.orientation === 'landscape' ? 'wide' : 'tall',
  };
};

export const CIEC_VIDEO_CARDS: CiaVideoCard[] = CIEC_VIDEOS.filter(video => video.orientation === 'landscape').map(video => ({
  code: 'CIEC',
  label: video.label ?? 'CIEC',
  title: video.title,
  text: video.description,
  poster: ciecVideoPoster(video),
  videoSrc: ciecVideoSrc(video),
  contentType: 'video/mp4',
  details: [...(video.details ?? []), `时长 ${video.duration}`],
}));

export const CIEC_LIFE_VIDEOS: CiaShortVideo[] = CIEC_VIDEOS.filter(video => video.orientation === 'portrait').map(video => ({
  title: video.title,
  text: video.description,
  src: ciecVideoSrc(video),
  poster: ciecVideoPoster(video),
  duration: video.duration,
}));

/** Videos of the hero album (compact layout), one chip per topic; the campus tour opens it. */
export const CIEC_VIDEO_TABS: PhVideoTab[] = [
  { label: '校园视频', icon: 'videocam', items: ['ciec-school-tour-2022'].map(albumVideo) },
  { label: '课堂视频', icon: 'videocam', items: ['ciec-pronunciation-class', 'ciec-steam-class-2020'].map(albumVideo) },
  { label: '夏令营视频', icon: 'videocam', items: ['ciec-summer-camp-2026'].map(albumVideo) },
  { label: '学员访谈', icon: 'videocam', items: ['ciec-student-teachers', 'ciec-favourite-teacher'].map(albumVideo) },
];

const ROOM_SERVICE = '每周打扫2次、洗衣2次，床单每两周换一次';
const ROOM_HIGHLIGHTS = ['床、衣柜、书桌、冰箱', '变频静音空调'];

/** Photos come only from CIEC's brochure and match the labelled room. */
export const CIEC_ROOM_PROFILES: PhRoomProfile[] = [
  {
    id: CIEC_DOUBLE_ROOM_ID,
    rateIds: [CIEC_DOUBLE_ROOM_ID],
    label: '双人间',
    englishName: 'DOUBLE ROOM',
    location: '校内',
    bed: '两张单人床',
    service: ROOM_SERVICE,
    suitable: '一位家长带一个孩子，或两个孩子同住',
    note: '两人一间；淡季两人家庭的家长食宿有优惠。',
    highlights: ROOM_HIGHLIGHTS,
    image: asset('room-double'),
    gallery: [asset('room-double'), asset('room-bathroom')],
    imageAlt: 'CIEC双人间实景',
  },
  {
    id: CIEC_TRIPLE_ROOM_ID,
    rateIds: [CIEC_TRIPLE_ROOM_ID, CIEC_FAMILY4_ROOM_ID, CIEC_FAMILY2_TRIPLE_ROOM_ID],
    label: '三人间',
    englishName: 'TRIPLE ROOM',
    location: '校内',
    bed: '三张单人床',
    service: ROOM_SERVICE,
    suitable: '一位家长带两个孩子，或4人家庭',
    note: '三人一间；4位家人同住一间时每人价格更低。淡季三人家庭的家长食宿免费；淡季有空房时，两人家庭也可以加价升级住三人间。',
    highlights: ROOM_HIGHLIGHTS,
    image: asset('room-triple'),
    gallery: [asset('room-triple'), asset('room-wardrobe'), asset('room-bathroom')],
    imageAlt: 'CIEC三人间实景',
  },
];

export const CIEC_DORM_RULES = [
  { title: '外出', text: '孩子只参加学校安排的外出；家长填写出入记录后可带自己孩子外出，带别的孩子要有对方家长同意书；22:00前回校。' },
  { title: '外宿', text: '家长填写旅行计划书、学校同意后才能外宿或旅行。' },
  { title: '访客', text: '须提前向办公室申请，10:00–17:00，亲子家庭的家属不能留宿；访客用餐每餐250比索。' },
  { title: '单独就读的孩子', text: '家长来访只限周末；想住宿舍每晚1,500比索，最多3晚，和孩子同住一间。' },
  { title: '手机', text: '没有家长陪同的孩子手机交办公室保管：平日20:20–21:55、周末08:00–20:00可用。' },
  { title: '夜间', text: '22:00后熄灯，不能进别人的房间。' },
  { title: '警告', text: '吸烟、带外人进校、打架、喧哗、损坏设施、无故外宿、喂猫等会被警告；4周内3次警告要退学，家长受警告时同行孩子同样处理。' },
  { title: '赔偿', text: '损坏学校设施照价赔偿，例如百叶窗4,500比索、被子2,000比索、纱窗1,000比索。' },
];

/** One weekday of the junior academic / intensive course (brochure example). */
const JUNIOR_SCHEDULE: DailyScheduleRow[] = [
  { time: '08:00–12:10', activity: '一对一：阅读、词汇1', kind: 'class' },
  { time: '08:00–12:10', activity: '小组课：写作、演讲', kind: 'class' },
  { time: '12:10–13:10', activity: '午餐', kind: 'meal' },
  { time: '13:10–17:20', activity: '一对一：词汇2、写作', kind: 'class' },
  { time: '13:10–17:20', activity: '小组课：听力；另有空堂可自习', kind: 'class' },
  { time: '17:20–18:20', activity: '晚餐', kind: 'meal' },
  { time: '18:20–19:55', activity: '密集课程：IEC小组课和晚自习', kind: 'activity' },
];

/** One weekday of the kindergarten course (brochure example). */
const KINDERGARTEN_SCHEDULE: DailyScheduleRow[] = [
  { time: '09:00–09:10', activity: '晨会', kind: 'activity' },
  { time: '09:10–09:40', activity: '体育课', kind: 'class' },
  { time: '09:40–10:10', activity: '讲故事', kind: 'class' },
  { time: '10:10–10:30', activity: '休息和零食', kind: 'free' },
  { time: '10:30–11:50', activity: '英语、科学或数学（两节）', kind: 'class' },
  { time: '11:50–12:10', activity: '室内或户外游戏', kind: 'class' },
  { time: '12:10–13:10', activity: '午餐', kind: 'meal' },
  { time: '13:10–13:55', activity: '午休（家长看顾）', kind: 'free' },
  { time: '14:00–14:45', activity: '一对一：拼读（4–5岁）／读写（6岁）', kind: 'class' },
  { time: '14:50–15:35', activity: '一对一：动手项目（4–5岁）／听说（6岁）', kind: 'class' },
];

export const CIEC_SCHEDULE_COLUMNS = [
  { code: 'JUNIOR', title: '青少年学术／密集', rows: JUNIOR_SCHEDULE },
  { code: 'KINDER', title: '幼儿园', rows: KINDERGARTEN_SCHEDULE },
];

export const CIEC_COURSE_DETAIL_GUIDES: CourseDetailGuide[] = [
  {
    icon: 'child_care',
    title: '幼儿园课程',
    subtitle: '满4–6岁 · 须有家长陪同',
    courseIds: [CIEC_KINDERGARTEN_ID],
    facts: [
      { label: '上午', value: '3小时小班课：晨会、体育、讲故事、英语／科学／数学、游戏' },
      { label: '下午', value: '2节一对一，按4–5岁班和6岁班分内容' },
      { label: '午休', value: '1小时，由家长看顾' },
      { label: '要带的', value: '水壶、零食、湿巾、彩色笔，室内鞋或防滑袜' },
    ],
    points: [
      '上午09:00前进教室，每天10点是零食时间。',
      '6岁以下的孩子都读幼儿园课程，和英语水平无关；不适应一对一时可以改上小组课。',
      '除幼儿园孩子外，家长不能进教室旁听，在门外看不超过5分钟。',
    ],
  },
  {
    icon: 'workspace_premium',
    title: '青少年雅思／托福',
    subtitle: '英语中级以上的中学生',
    courseIds: ['junior-ielts-toefl'],
    facts: [
      { label: '一对一', value: '每天4节：阅读、写作、听力、口语' },
      { label: '小组课', value: '每天3节：听力语法、写作，晚上18:20–19:55模考' },
    ],
    points: ['下午有空堂，可以自习或做寒暑假作业。'],
  },
  {
    icon: 'school',
    title: '入学准备班',
    subtitle: '准备考宿务国际学校、私立学校或海外学校',
    courseIds: ['school-preparation'],
    facts: [
      { label: '一对一', value: '每天6节：阅读、数学、科学、英语学科、口语、面试' },
      { label: '入学前', value: '先做分级测试和英语、数学、科学测试，再定目标学校' },
      { label: '考前30天', value: '英语约占60–70%，学科30–40%，弱科优先' },
      { label: '考前', value: '集中准备英语面试，交齐入学资料，跟进第二、第三志愿' },
    ],
    points: ['晚上18:20–19:55小组自习。'],
  },
  {
    icon: 'directions_bus',
    title: '留学课程',
    subtitle: '在宿务国际学校或私立学校读书',
    courseIds: ['overseas-school'],
    facts: [
      { label: '白天', value: '坐学校车辆上下学，CIEC准备午餐盒' },
      { label: '放学后', value: '3小时辅导：英语学科、数学和科学、英语写作' },
      { label: '另付', value: '国际学校或私立学校的学费等所有费用' },
    ],
    points: ['CIEC的辅导老师陪学生做作业、预习复习和备考，也可咨询升学和留学。'],
  },
  {
    icon: 'workspace_premium',
    title: 'CIDEC 学历课程',
    subtitle: '菲律宾教育部认可的12年制学校',
    courseIds: [CIEC_CIDEC_ID],
    facts: [
      { label: '学校', value: 'Cebu International Distance Education College，2000年成立，School ID 404428' },
      { label: '年级', value: '1–12年级，在CIEC上课，同时读菲律宾正规学年' },
      { label: '年级学费', value: '一次性3,000美元，含项目材料和课程模块' },
      { label: '学习许可', value: 'SSP和E-CARD合计15,000比索，有效6个月' },
    ],
    points: [
      '毕业、升级和研究等费用按年级另收，例如12年级毕业费4,000比索，11–12年级研究费3,500比索。',
      '可以先在CIDEC读，再转到目标学校。',
    ],
  },
  {
    icon: 'family_restroom',
    title: '家长课程',
    subtitle: '陪孩子来的18岁以上家长',
    courseIds: CIEC_GUARDIAN_COURSE_IDS,
    facts: [
      { label: '每天', value: '3节一对一：上午2节，下午1节' },
      { label: 'ESL', value: '阅读、写作、口语、词汇和语法' },
      { label: '商务／雅思', value: '商务英语，或雅思阅读、口语、听力、写作' },
      { label: '可以不上课', value: '停留超过12周，或带4岁以下婴幼儿；淡季两人、三人家庭优惠也可不上课' },
    ],
    points: ['上课的家长要办SSP；入学分级测试后没有其他考试，想考要提前申请。', '淡季家长可按意愿加课。'],
  },
  {
    icon: 'rule',
    title: '上课与换课规定',
    subtitle: '所有课程',
    facts: [
      { label: '小组课', value: '最多1:7，按英语水平和年龄分班；人数不够时2节小组课改为1节一对一' },
      { label: '换课', value: '每周一次，周三、周四17:00前到Academic Office申请' },
      { label: '老师', value: '由学校安排，不能指定；同一位老师每天不超过1小时（小组课和加课除外）' },
      { label: '迟到缺课', value: '迟到10分钟算缺课；迟到3次算缺课1次；缺课4次起每次警告' },
      { label: '考试', value: '每周四上午测试，周五16:30毕业典礼（幼儿园周五12:20）' },
      { label: '结业证书', value: '上课天数80%以上才发' },
    ],
    points: [
      '菲律宾公休日放假，不补课。',
      '加课只在3–5月和9–10月：一对一ESL 9,500、雅思／托福11,000比索；小组课ESL 8,000、雅思／托福（2小时）16,000比索（计费周期报名时向学校确认）。',
      '第一天用复印教材试课，合适再买原版书；小组课资料每周一发，丢失每张10比索。',
    ],
  },
];

const FIRST_DAY = [
  { label: '周日', value: '10:00以后入住' },
  { label: '周一 09:00–12:00', value: '分级测试（阅读、听力、写作、一对一口语），带上笔' },
  { label: '10:30–12:00', value: '坐校车到附近超市换钱、买日用品' },
  { label: '14:30', value: 'AVR新生说明会' },
  { label: '15:00以后', value: '护照和到校学杂费交到Admin Office' },
  { label: '周二 07:50', value: 'Academic Office领测试结果和课表' },
];

export const CIEC_PRACTICAL_GUIDES: CampusPracticalGuide[] = [
  {
    icon: 'event',
    eyebrow: 'FIRST DAY',
    title: '入住与第一天',
    facts: FIRST_DAY,
    note: '请准备2张证件照，用于SSP和签证。入境和签证材料由思达启航顾问逐项帮你核对；eTravel入境登记也由顾问协助填写。',
  },
  {
    icon: 'restaurant',
    eyebrow: 'MEALS & HOURS',
    title: '用餐与开放时间',
    facts: [
      { label: '早餐', value: '平日07:30–08:30；周末早午餐10:30–11:30' },
      { label: '午餐', value: '12:10–13:10' },
      { label: '晚餐', value: '17:00–18:00 或 17:20–18:20' },
      { label: '茶水间', value: '07:00–22:00' },
      { label: '自习室', value: '08:30–22:00' },
      { label: '泳池', value: '周二至周五17:00–20:30，周六、周日14:00–20:30' },
    ],
    note: '结束前10分钟停止供餐；不提供素食、过敏或病号餐。',
  },
  {
    icon: 'local_laundry_service',
    eyebrow: 'SCHOOL SERVICES',
    title: '洗衣、打扫与看病',
    facts: [
      { label: '洗衣', value: '每周2次，填洗衣单，上午8–9点放门外收取' },
      { label: '自己洗', value: '帽子、运动鞋、泳衣；贵重衣物和内衣建议送外面洗衣店' },
      { label: '打扫', value: '每周2次；床单每两周换一次，加换每套500比索' },
      { label: '看病', value: '学校不提供车辆，自己打车；住院陪护费用自付' },
    ],
    note: '贵重物品请自己保管；学校网络较慢，请不要下载大文件。',
  },
  {
    icon: 'logout',
    eyebrow: 'CHECK-OUT',
    title: '离校与退押金',
    facts: [
      { label: '周末离校', value: '最后一周周五14:30–17:00办理' },
      { label: '平日离校', value: '离校当天上午或前一天办理' },
      { label: '离开时间', value: '最后一周周六14:00前' },
      { label: '送机', value: '每户2,000比索（4人以内，超过每人加500）；旺季不送机' },
    ],
    note: '结清电费等费用后退还押金和护照；周五前离校要提前2周申请，可参加前一周的毕业典礼。',
  },
  {
    icon: 'shield',
    eyebrow: 'SAFETY',
    title: '生活安全提醒',
    facts: [
      { label: '出门', value: '穿着朴素、带小面额纸币，坐出租车并告诉家人行程' },
      { label: '身体', value: '注意饮食和防蚊，宿舍里尽量不吃东西' },
      { label: '消防', value: '误按消防铃会被消防局罚款10,000比索，乱用灭火器5,000比索' },
    ],
    note: '走廊有回音，晚上请轻声关门。',
  },
];

/**
 * CIEC's 2027 holiday poster: weekday holidays only, because the weekend ones (Lunar New Year 2/6, Black Saturday
 * 3/27, Labor Day 5/1, Independence Day 6/12, Ninoy Aquino Day 8/21, Christmas 12/25) do not take a class day.
 * EDSA Day 2/25 is a working day. The two Eid holidays are proclaimed later, so they are not listed.
 */
export const CIEC_HOLIDAY_CALENDARS: HolidayCalendar[] = [
  {
    year: 2027,
    label: '规划2027年入学时优先查看',
    months: [
      { month: 1, holidays: [{ day: '1日', name: '元旦' }] },
      { month: 2, holidays: [{ day: '24日', name: '宿务市宪章日' }] },
      {
        month: 3,
        holidays: [
          { day: '25日', name: '濯足节' },
          { day: '26日', name: '耶稣受难日' },
        ],
      },
      { month: 4, holidays: [{ day: '9日', name: '勇士日' }] },
      {
        month: 8,
        holidays: [
          { day: '6日', name: '宿务省宪章日' },
          { day: '30日', name: '国家英雄日' },
        ],
      },
      { month: 9, holidays: [{ day: '9日', name: '奥斯梅尼亚日' }] },
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

export const CIEC_HOLIDAY_FOOTNOTE = '只列平日的假期；周末的假期（春节2/6、复活节前的周六3/27、劳动节5/1、独立日6/12、尼诺伊·阿基诺日8/21、圣诞节12/25）不占上课日。开斋节和宰牲节等政府公布日期。';

export const CIEC_FAQS: FaqItem[] = [
  { question: 'CIEC收什么样的学生？', answer: '满4岁（48个月）到高三的孩子，以及陪孩子来的家长。成人不能单独报名，只能作为陪读家长入学。' },
  { question: '孩子可以不带家长单独去吗？', answer: '可以，1–12年级的孩子可以单独就读，由学校管理，每4周另收300美元监护费；淡季9岁及以上可免监护费。幼儿园的孩子必须有家长陪同。' },
  { question: '家长一定要上课吗？', answer: '一般要上家长课程（每天3节一对一）。停留超过12周、带4岁以下婴幼儿，或享受淡季两人、三人家庭优惠时，家长可以只陪读不上课。上课的家长要办SSP。' },
  { question: '2027年有什么淡季优惠？', answer: '在2027/03/01–05/21和2027/08/30–12/31上课：一位家长带一个孩子住双人间，家长食宿每4周930美元降到400美元；带两个孩子住三人间，家长食宿免费；家长课程每4周降到400美元（ESL）或500美元（商务／雅思）；单独就读的9岁以上孩子免监护费。至少报名4周。有空房时，两人家庭可以升级住三人间，每人每4周加200美元。2026/08/31–2027/01/01另有2026年的淡季优惠。报价器会按日期自动计算。' },
  { question: '婴幼儿怎么收费？', answer: '24个月及以下不收食宿费，25–47个月收一半，都不算房间人数；综合管理费和水费照收，注册费每人一次。' },
  { question: '旺季有什么不同？', answer: '6–8月、12–2月是旺季，学费不加价，但每户要先交500美元订位押金，取消时不退、也不能延期；旺季不提供送机。' },
  { question: '页面上的报价包含全部费用吗？', answer: '学校费用包含注册费、课程费、食宿费、监护费和接机费，并自动扣除优惠；到校学杂费单独列出，押金和电费另外准备。两者分开显示，不相加。' },
  { question: '思达启航会协助签证和入境吗？', answer: '会。通过思达启航报名，顾问会免费协助菲律宾入境和签证相关手续，你只需要按顾问指引准备个人资料。' },
];

export const CIEC_FINAL_CTA_BADGES = ['免费选校建议', '确认空房和优惠', '签证与入境协助'];

/**
 * Real CIEC test reports (user allowed them 2026-11-24 with personal data hidden): student names and the school's
 * address and phone are pixelated, empty remark boxes cut off. Level reports grade each skill L1–L6; the other
 * reports give a 9-point band score. Dates are the placement test and the last progress test on each report.
 */
export const CIEC_TEST_RESULTS = [
  {
    image: 'assets/ciec/test-results/ciec-level-11w.webp', title: '级别测试 · 2026年3–5月', entrance: '', overall: '',
    summary: '约11周后，阅读、写作、口语各升1级', detail: '阅读L2→L3 写作L1→L2 听力L1 口语L2→L3', kind: '校内测试成绩单',
  },
  {
    image: 'assets/ciec/test-results/ciec-level-3w.webp', title: '级别测试 · 2026年7–8月', entrance: '', overall: '',
    summary: '约3周后，听力、阅读、写作各升1级', detail: '听力L3→L4 阅读L5→L6 写作L3→L4 口语L2', kind: '校内测试成绩单',
  },
  {
    image: 'assets/ciec/test-results/ciec-level-5w.webp', title: '级别测试 · 2026年7–8月', entrance: '', overall: '',
    summary: '约5周后，听力、口语各升1级', detail: '听力L3→L4 阅读L5 写作L2 口语L3→L4', kind: '校内测试成绩单',
  },
  {
    image: 'assets/ciec/test-results/ciec-band-6w.webp', title: '9分制测试 · 2026年7–8月', entrance: '2.5', overall: '4.5',
    summary: '入学2.5 → 约6周后4.5', detail: '阅读5 写作3.5 听力4.5 口语4.5', kind: '校内测试成绩单',
  },
  {
    image: 'assets/ciec/test-results/ciec-band-3w-a.webp', title: '9分制测试 · 2026年7–8月', entrance: '5', overall: '6',
    summary: '入学5 → 约3周后6', detail: '阅读6 写作5 听力6.5 口语5.5', kind: '校内测试成绩单',
  },
  {
    image: 'assets/ciec/test-results/ciec-band-3w-b.webp', title: '9分制测试 · 2025年7–8月', entrance: '4.5', overall: '5.5',
    summary: '入学4.5 → 约3周后5.5', detail: '阅读5.5 写作5 听力6.5 口语5', kind: '校内测试成绩单',
  },
];

export const CIEC_REVIEWS_COPY = {
  eyebrow: 'TEST RESULTS',
  title: 'CIEC 学生的测试成绩',
  intro: '学生入学先做分级测试，之后做阶段测试；成绩单列出听、说、读、写每一项的级别或分数，家长能看到每一项的变化。',
  source: '真实学生成绩单',
  scoresTitle: '入学测试 → 阶段测试',
  scoresIntro: '点击可查看成绩单。',
  scoresNote: '已隐藏学生姓名和学校联系方式；成绩因个人基础和投入而异，仅供参考。',
};

/**
 * Cancellation and refund rules from the new-student guide and the brochure, plus 思达启航's own deposit rule
 * (user decision 2026-11-24: the deposit paid when registering is never refunded; late cancellation or rescheduling
 * costs a penalty).
 */
export const CIEC_REFUND_COPY = {
  summaryTitle: 'CIEC 取消、改期与退款规定',
  summaryHint: '报名定金、入学前取消或改期、到校后退款',
  eyebrow: 'CANCELLATION & REFUND',
  title: 'CIEC 取消与退款规定',
  intro: '到校后的退款按剩余的完整4周计算；退款时扣除注册费和已经享受的优惠。',
  alert: '报名前请确认',
  groups: [
    {
      title: '报名与入学前',
      note: '',
      rules: [
        { when: '报名定金', text: '通过思达启航报名时预收定金2,000元人民币，为学生向学校订位；定金交了以后不退。' },
        { when: '付清费用', text: '入学4周前付清学费和食宿费。' },
        { when: '入学4周前取消', text: '扣注册费，其余已付学费和食宿费退还。' },
        { when: '入学前不足4周取消', text: '扣注册费、2周学费和2周食宿费，其余退还。' },
        { when: '改期', text: '入学4周前告诉顾问，可以改入学日期，或把定金保留1年；不足4周改期可能要扣违约金，以学校确认为准。' },
        { when: '旺季订位', text: '6–8月、12–2月每户500美元押金，取消不退，也不能延期。' },
      ],
      footnote: '',
    },
    {
      title: '到校以后',
      note: '',
      rules: [
        { when: '只报4周', text: '到校后不退款。' },
        { when: '读完不到一半', text: '剩余4周以上时，退剩余学费和食宿费的50%（例：剩余10周，按8周退50%）。' },
        { when: '读完一半以上', text: '不退款；报名超过16周的，仍按剩余学费和食宿费的50%退。' },
        { when: '换宿舍', text: '房费差额按周退一半。' },
      ],
      footnote: '',
    },
    {
      title: '其他情况',
      note: '',
      rules: [
        { when: '丧、婚、病', text: '本人或直系亲属的丧事、婚事或生病，凭证明材料退剩余费用的60%。' },
        { when: '违规退学', text: '4周内3次警告要退学，不退款。' },
        { when: '到校学杂费', text: '管理费、水费和小组课教材费按剩余周数退，押金和没用到的签证延期费也退；电费和已交给移民局的费用不退。' },
        { when: '办理时间', text: '学校30天内处理，由思达启航协助办理。' },
      ],
      footnote: CIEC_REFERENCE_NOTE,
    },
  ],
};

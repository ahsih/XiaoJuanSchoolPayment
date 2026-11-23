// Text and data of the SMEAG Capital page, from the Capital folders of SMEAG's Google Drive pack (2025 Capital
// brochure, 2026-09-24 new-student orientation, 2026 price list, 2027 local-fee sheet, partner-hotel rules and
// shuttle times, 2027 holiday poster, offer posters and the under-15 notice; received 2026-11-23). The Encanto
// material in the same pack is not used. The shared Philippine school template reads this module through
// smeag-page-profile.ts. Keep it pure data (no Angular, DOM or storage), so the WeChat mini program can reuse it.
// Never add the school's phone, address, website, social accounts or its nationality chart.
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
import { SMEAG_HOLIDAYS_2027 } from '../smeag-holidays-2027';

/** Closes every content section once; the same line as on every Philippine school page. */
export const SMEAG_REFERENCE_NOTE = SCHOOL_REFERENCE_NOTE;

export const SMEAG_PAGE_TEXT = {
  heroLead: 'SMEAG 在宿务市区的校区，主打雅思、托福、托业备考和剑桥体系 ESL；前4周上斯巴达课，平日下课后可以外出。',
  advisorText: 'SMEAG Capital 适合目标明确、想考分的成人：雅思和托福常规班报名12周以上送1次官方考试，符合条件还能报保分班；ESL 按剑桥英语体系分级。前4周要上斯巴达课，平日下课后可以外出，门禁23:00。校内宿舍从单人间到五人间都有，也可以住步行约3分钟的合作酒店。',
  campusIntro: '教室、宿舍、餐厅和健身房都在校园里：1楼餐厅、咖啡厅和洗衣房，2楼医务室和学生休息室，3–5楼宿舍，6楼健身房和自习室。',
  galleryIntro: '按区域查看校园、教室、住宿、餐厅和设施；相册内用左右箭头或缩略图切换，点击主图可放大。',
  coursesIntro: '按学习目标分组，每门课下面是每天的课时；点开可看适合人群和说明。每节课45分钟。',
  roomsPhotoIntro: '点选房型查看实景；各房型价格见上方住宿费表。',
  finalCtaTitle: '想确认 SMEAG Capital 的空房和最新优惠？',
  finalCtaText: '告诉顾问你的入学日期、周数、课程和想住的房型，我们帮你确认房间并做一份完整报价。',
} as const;

export const SMEAG_QUICK_INFO = [
  { icon: 'location_on', title: '宿务市区', text: 'Guadalupe 区，宿务省政府（Capitol）一带' },
  { icon: 'verified', title: '前4周斯巴达', text: '之后平日下课后可外出，门禁23:00' },
  { icon: 'workspace_premium', title: '考试课程', text: '雅思、托福常规班报名12周以上送1次官方考试' },
  { icon: 'quiz', title: '每周模考', text: '周四晚上模考（托福周三），周一和老师检讨' },
  { icon: 'bed', title: '2类住宿', text: '校内单人间到五人间，另有步行3分钟的合作酒店' },
  { icon: 'family_restroom', title: '亲子课程', text: '2–12岁孩子和陪读家长一起上课' },
];

/** Key facts under the hero title (compact layout); what each floor has is in SMEAG_CAMPUS_FLOORS. */
export const SMEAG_OVERVIEW_FACTS: ReadonlyArray<{ icon: string; label: string; value: string }> = [
  { icon: 'location_on', label: '位置', value: '宿务市 Guadalupe 区，宿务省政府（Capitol）一带' },
  { icon: 'rule', label: '管理', value: '前4周必上斯巴达课；平日下课后可外出，门禁23:00' },
  { icon: 'menu_book', label: '课程', value: '剑桥体系 ESL、口语强化、雅思、托福、托业、商务英语和亲子课程' },
  { icon: 'workspace_premium', label: '考试', value: '雅思、托福常规班报名12周以上送1次官方考试；每周模考' },
  { icon: 'event', label: '入学', value: '每周日入住，周一开课' },
  { icon: 'bed', label: '住宿', value: '校内单人间到五人间；也可住步行约3分钟的合作酒店' },
];

export const SMEAG_BASIC_INFO: BasicInfoRow[] = [
  { label: '学校', value: 'SMEAG Global Education Capital 校区' },
  { label: '位置', value: '菲律宾宿务市 Guadalupe 区' },
  { label: '管理方式', value: '前4周斯巴达课，之后平日下课后可外出' },
  { label: '课程', value: '剑桥体系 ESL、口语强化、雅思、托福、托业、商务英语、青少年和亲子课程' },
  { label: '住宿', value: '校内宿舍单人间到五人间；校外合作酒店' },
  { label: '入学', value: '每周日入住，周一开课' },
];

export const SMEAG_SUITABLE_FOR = [
  '想考雅思、托福或托业分数的学生',
  '想按剑桥英语体系系统提高的成人',
  '能接受前4周斯巴达管理的学生',
  '带2–12岁孩子来读书的家长',
];

export const SMEAG_NOT_SUITABLE_FOR = [
  '想在海边度假学习的学生（学校在宿务市区）',
  '不想上早晚斯巴达课的学生（前4周必须参加）',
  '未满15岁、没有监护人陪读的学生',
];

/** What each floor has (2025 Capital brochure); shown as the campus strip in the hero. */
export const SMEAG_CAMPUS_FLOORS: CampusBuildingCard[] = [
  { code: '1F', title: '1楼', icon: 'restaurant', facilities: ['学生餐厅，每天三餐', '咖啡厅', '洗衣房'] },
  { code: '2F', title: '2楼', icon: 'local_hospital', facilities: ['护士站和医务室', '学生办公室', '放映厅和学生休息室', '托福教室'] },
  { code: '3–5F', title: '3–5楼宿舍', icon: 'bed', facilities: ['3楼男生', '4楼女生和家庭', '5楼女生'] },
  { code: '6F', title: '6楼', icon: 'fitness_center', facilities: ['健身房 06:00–24:00', '24小时自习室', '台球和乒乓球', '托业教室'] },
];

const campus = (file: string) => `assets/smeag-capital/campus/${file}.webp`;
const rooms = (file: string) => `assets/smeag-capital/rooms/${file}.webp`;
export const SMEAG_QUOTE_IMAGE_HERO = '/assets/philippines/smeag-capital-building.webp';

export const SMEAG_GALLERY_IMAGES: GalleryImage[] = [
  { category: '校园', title: 'SMEAG Capital 校舍', description: '学校在宿务市 Guadalupe 区。', src: SMEAG_QUOTE_IMAGE_HERO.slice(1) },
  { category: '校园', title: '大堂', description: '一进门的大堂。', src: campus('lobby') },
  { category: '校园', title: '学生休息室', description: '下课后休息、聊天的地方。', src: campus('lounge-01') },
  { category: '校园', title: '学生休息室', description: '沙发区和投影。', src: campus('lounge-02') },
  { category: '校园', title: '放映厅', description: '电影之夜和毕业典礼在这里举行。', src: campus('theater') },
  { category: '教室', title: '一对一教室', description: '每节课45分钟。', src: campus('class-one-to-one') },
  { category: '教室', title: '团体课教室', description: '团体课用的大教室，有白板和电视。', src: campus('class-large') },
  { category: '教室', title: '托福教室', description: '2楼的托福教室，隔间式座位。', src: campus('toefl-room') },
  { category: '住宿', title: '校内单人间', description: '两间独立卧室共用客厅、小厨房和卫生间。', src: rooms('single-03') },
  { category: '住宿', title: '校内双人间', description: '两张床中间有书架隔开。', src: rooms('twin-01') },
  { category: '住宿', title: '校内三人间', description: '三张床，房内有卫生间。', src: rooms('triple-01') },
  { category: '住宿', title: '校内四人间', description: '两个区域各两张床。', src: rooms('quad-01') },
  { category: '住宿', title: '合作酒店双人间', description: '步行约3分钟到学校。', src: rooms('hotel-twin-05') },
  { category: '餐厅', title: '学生餐厅', description: '自助式取餐，每天开放。', src: campus('dining-01') },
  { category: '餐厅', title: '学生餐厅', description: '周一至周六三餐，周日早午餐和晚餐。', src: campus('dining-02') },
  { category: '餐厅', title: '咖啡厅', description: '1楼咖啡厅，用电子钱包卡付款。', src: campus('cafe-01') },
  { category: '餐厅', title: '咖啡厅座位', description: '课后看书、聊天的地方。', src: campus('cafe-02') },
  { category: '设施', title: '健身房', description: '6楼，每天06:00–24:00开放。', src: campus('gym-01') },
  { category: '设施', title: '健身房单车区', description: '有动感单车和空调。', src: campus('gym-02') },
  { category: '设施', title: '自习室', description: '6楼，24小时开放，有空调。', src: campus('self-study') },
  { category: '设施', title: '台球', description: '凭学生证在1楼保安处借用，开放到23:00。', src: campus('billiards') },
  { category: '设施', title: '乒乓球', description: '6楼的休闲区。', src: campus('table-tennis') },
  { category: '设施', title: '洗衣房', description: '每天09:00–21:00收送衣物。', src: campus('laundry') },
  { category: '设施', title: '医务室', description: '护士站周一至周五开放。', src: campus('clinic') },
];

export const SMEAG_ALBUM_DESCRIPTIONS = {
  校园: '校舍、大堂、休息室与放映厅',
  教室: '一对一、小组和团体教室',
  住宿: '校内宿舍与合作酒店',
  餐厅: '学生餐厅与咖啡厅',
  设施: '健身房、自习室、洗衣房与医务室',
} as const;

/**
 * A clip of SMEAG Capital in public/assets/smeag-capital/videos/ (H.264 with a poster each). The four dormitory clips come
 * from SMEAG's own pack (09_capital宣传视频 and the room folders); the partner-hotel clips there are not used, because their
 * opening shows a booking banner and the hotel address. The other ten are SMEAG's own 主校区 WeChat Channels clips
 * (user folder 2026-11-24); its 单人间 and 四人间 clips repeat the pack's room clips and are left out. Clips filmed
 * landscape inside a vertical frame are cropped to their 16:9 picture, which also drops the added captions. Check every
 * frame of a new clip for other companies or contact details.
 */
export interface SmeagVideo {
  name: string;
  title: string;
  description: string;
  duration: string;
  orientation: 'landscape' | 'portrait';
  /** Hero album group. */
  topic: '校园' | '宿舍' | '课程' | '餐厅';
}

export const smeagVideoSrc = (video: SmeagVideo) => `/assets/smeag-capital/videos/${video.name}.mp4`;
export const smeagVideoPoster = (video: SmeagVideo) => `/assets/smeag-capital/videos/poster-${video.name}.jpg`;

export const SMEAG_VIDEOS: SmeagVideo[] = [
  { name: 'lobby', title: '1楼大堂', description: '从大堂走过1楼走廊。', duration: '0:17', orientation: 'landscape', topic: '校园' },
  { name: 'lounge', title: '课间休息', description: '课间的学生休息室。', duration: '0:18', orientation: 'landscape', topic: '校园' },
  { name: 'office', title: '学校办公室', description: '学生到办公室办事。', duration: '0:21', orientation: 'landscape', topic: '校园' },
  { name: 'single-room', title: '校内单人间', description: '单人间的卧室。', duration: '0:10', orientation: 'portrait', topic: '宿舍' },
  { name: 'single-room-bath', title: '单人间的小厨房和卫生间', description: '两间单人卧室共用的小厨房和卫生间。', duration: '0:12', orientation: 'portrait', topic: '宿舍' },
  { name: 'twin-room', title: '校内双人间', description: '从门口走进双人间：冰箱、卫生间和两张床。', duration: '0:23', orientation: 'portrait', topic: '宿舍' },
  { name: 'triple-room', title: '校内三人间', description: '三人间：三张床、书桌、衣柜和卫生间。', duration: '0:37', orientation: 'landscape', topic: '宿舍' },
  { name: 'triple-room-tour', title: '三人间实拍', description: '冰箱、衣柜、三张床、窗边空调和卫生间。', duration: '0:25', orientation: 'portrait', topic: '宿舍' },
  { name: 'quad-room', title: '校内四人间', description: '走一圈看四人间的两个睡眠区和公共空间。', duration: '0:29', orientation: 'landscape', topic: '宿舍' },
  { name: 'one-to-one', title: '一对一课堂', description: '一对一课堂和教室走廊。', duration: '0:11', orientation: 'portrait', topic: '课程' },
  { name: 'group-class', title: '团体课', description: '团体课上课的样子。', duration: '0:15', orientation: 'landscape', topic: '课程' },
  { name: 'classrooms', title: '教室区域', description: '教室走廊和服务台。', duration: '0:07', orientation: 'portrait', topic: '课程' },
  { name: 'dining', title: '学生餐厅', description: '自助取餐区和用餐区。', duration: '0:13', orientation: 'portrait', topic: '餐厅' },
  { name: 'cafe', title: '咖啡厅', description: '1楼咖啡厅，有饮料和零食。', duration: '0:20', orientation: 'landscape', topic: '餐厅' },
];

const DORM_SERVICE = '每周打扫1次并换床单；洗衣每天收送';
const HOTEL_SERVICE = '衣物自己拿到学校洗衣房送洗';
const HOTEL_HIGHLIGHTS = ['步行约3分钟到学校，早晚有接送车', '门禁23:00', '房间没有冰箱，有Wi-Fi', '不收水电费'];
const HOTEL_NOTE = '照片来自学校的三家合作酒店（Amethyst、Canberry、S Hotel），具体入住哪一家报名时向学校确认。';
const numbered = (prefix: string, count: number) => Array.from({ length: count }, (_, index) => rooms(`${prefix}-${String(index + 1).padStart(2, '0')}`));

/** Photos come only from SMEAG's room folders and match the labelled room type (see public/assets/smeag-capital). */
export const SMEAG_ROOM_PROFILES: PhRoomProfile[] = [
  {
    id: 'campus-single', rateIds: ['campus-single'], label: '校内单人间', location: '校内', bed: '单人床', service: DORM_SERVICE,
    suitable: '重视隐私、需要安静学习空间的学生', note: '两间独立卧室共用客厅、小厨房和两个卫生间。',
    highlights: ['冰箱、书桌、衣柜', '空调和吊扇'],
    image: rooms('single-03'), gallery: numbered('single', 7), imageAlt: 'SMEAG Capital校内单人间实景',
  },
  {
    id: 'campus-twin', rateIds: ['campus-twin'], label: '校内双人间', location: '校内', bed: '两张单人床', service: DORM_SERVICE,
    suitable: '朋友同行或想兼顾预算的学生', note: '两张床中间有书架隔开，房内有卫生间。',
    highlights: ['书桌、衣柜和空调'],
    image: rooms('twin-01'), gallery: numbered('twin', 6), imageAlt: 'SMEAG Capital校内双人间实景',
  },
  {
    id: 'campus-triple', rateIds: ['campus-triple'], label: '校内三人间', location: '校内', bed: '三张单人床', service: DORM_SERVICE,
    suitable: '想控制预算、又想有自己空间的学生', note: '书架把三张床隔开，房内有卫生间。',
    highlights: ['书桌、衣柜和空调'],
    image: rooms('triple-01'), gallery: numbered('triple', 7), imageAlt: 'SMEAG Capital校内三人间实景',
  },
  {
    id: 'campus-quad', rateIds: ['campus-quad'], label: '校内四人间', location: '校内', bed: '四张单人床', service: DORM_SERVICE,
    suitable: '预算优先、喜欢热闹的学生', note: '分成两个区域，各两张床，共用卫生间。',
    highlights: ['书桌、衣柜和空调'],
    image: rooms('quad-01'), gallery: numbered('quad', 6), imageAlt: 'SMEAG Capital校内四人间实景',
  },
  {
    id: 'hotel-single', rateIds: ['hotel-single'], label: '合作酒店单人间', location: '校外', bed: '单人床', service: HOTEL_SERVICE,
    suitable: '想住得更独立的成人', note: HOTEL_NOTE, highlights: HOTEL_HIGHLIGHTS,
    image: rooms('hotel-single-01'), gallery: numbered('hotel-single', 6), imageAlt: 'SMEAG Capital合作酒店单人间实景',
  },
  {
    id: 'hotel-twin', rateIds: ['hotel-twin'], label: '合作酒店双人间', location: '校外', bed: '标准间，两张床', service: HOTEL_SERVICE,
    suitable: '朋友或夫妻同住', note: HOTEL_NOTE, highlights: HOTEL_HIGHLIGHTS,
    image: rooms('hotel-twin-05'), gallery: numbered('hotel-twin', 6), imageAlt: 'SMEAG Capital合作酒店双人间实景',
  },
  {
    id: 'hotel-triple', rateIds: ['hotel-triple'], label: '合作酒店三人间', location: '校外', bed: '一张大床和一张单人床', service: HOTEL_SERVICE,
    suitable: '三人同行或亲子家庭', note: '照片来自 Canberry 和 S Hotel，具体入住哪一家报名时向学校确认。', highlights: HOTEL_HIGHLIGHTS,
    image: rooms('hotel-triple-01'), gallery: numbered('hotel-triple', 4), imageAlt: 'SMEAG Capital合作酒店三人间实景',
  },
  {
    id: 'hotel-quad', rateIds: ['hotel-quad'], label: '合作酒店四人间', location: '校外', service: HOTEL_SERVICE,
    suitable: '四人同行', note: '只有 S Hotel 有四人间。', highlights: HOTEL_HIGHLIGHTS,
    image: rooms('hotel-quad-01'), gallery: numbered('hotel-quad', 5), imageAlt: 'SMEAG Capital合作酒店四人间实景',
  },
];

export const SMEAG_DORM_RULES = [
  { title: '门禁', text: '23:00–05:00不能外出；平日下课后可以外出。' },
  { title: '外宿', text: '平日、周末和假日外宿都须提前申请；周末和假日外出或外宿前，须先参加安全教育（周五12:40）。' },
  { title: '禁止事项', text: '校内禁止喝酒；房间内禁止吸烟，违者警告并罚款1,000比索；不能进入异性房间，违者退学。' },
  { title: '未成年人', text: '外出须有人陪同，或由监护人签署未成年人协议；外出须提前2天取得家长同意。' },
  { title: '换房', text: '周三前申请，周六换房，每次500比索。' },
  { title: '护照', text: '由学校保管，用于办理签证手续。' },
  { title: '退房', text: '周日入住的学生，课程结束后的周六13:00前退房。' },
  { title: '合作酒店', text: '门禁同样是23:00；房间没有冰箱。' },
];

/** One weekday; the profile shows the morning and the afternoon side by side. */
export const SMEAG_SCHEDULE: DailyScheduleRow[] = [
  { time: '06:40–08:00', activity: '早上斯巴达课（前4周雅思、托福、托业必上）', kind: 'activity' },
  { time: '07:45–09:00', activity: '早餐', kind: 'meal' },
  { time: '08:40–09:25', activity: '第1节', kind: 'class' },
  { time: '09:30–10:15', activity: '第2节', kind: 'class' },
  { time: '10:25–11:10', activity: '第3节', kind: 'class' },
  { time: '11:15–12:00', activity: '第4节', kind: 'class' },
  { time: '11:45–13:00', activity: '午餐', kind: 'meal' },
  { time: '13:00–13:45', activity: '第5节', kind: 'class' },
  { time: '13:50–14:35', activity: '第6节', kind: 'class' },
  { time: '14:45–15:30', activity: '第7节', kind: 'class' },
  { time: '15:35–16:20', activity: '第8节', kind: 'class' },
  { time: '16:30–17:15', activity: '第9节', kind: 'class' },
  { time: '17:20–18:05', activity: '第10节', kind: 'class' },
  { time: '17:45–19:00', activity: '晚餐', kind: 'meal' },
  { time: '19:00–20:35', activity: '晚上斯巴达课（周一至周三，前4周必上）', kind: 'activity' },
  { time: '19:00', activity: '周四模考（托福在周三）', kind: 'test' },
];

export const SMEAG_COURSE_DETAIL_GUIDES: CourseDetailGuide[] = [
  {
    icon: 'workspace_premium',
    title: '雅思、托福官方考试和保分班',
    subtitle: '常规班报名12周以上送1次官方考试',
    courseIds: ['ielts-regular', 'toefl-regular'],
    facts: [
      { label: '送考', value: '报名12周以上，约入学第10周参加1次官方考试' },
      { label: '模考', value: '每周四19:00（托福周三），周一和老师一起检讨' },
      { label: '保分班报名', value: '报名12周以上，按学校指定日期入学，报名时选好目标分数段' },
      { label: '保分条件', value: '正课出勤100%，不能有任何警告' },
    ],
    points: [
      '保分班读满后没达到目标分，可以免学费继续上课到达标（住宿费和到校学杂费照付），每4周续一次，并安排1次官方考试。',
      '缺课1次或收到1次行政警告，就失去保分资格；12周内收到3次警告，也会失去免费官方考试。',
    ],
    notice: '保分条件以学校当期规定为准，报名前顾问会和你逐项确认。',
  },
  {
    icon: 'fact_check',
    title: '托业课程',
    subtitle: '每周模考',
    courseIds: ['toeic-pre', 'toeic-regular'],
    facts: [
      { label: '模考', value: '每周四19:00，周一和老师一起检讨' },
      { label: '保分班', value: '目前暂停' },
    ],
    points: [],
  },
  {
    icon: 'child_care',
    title: '亲子课程',
    subtitle: '2–12岁孩子和陪读家长',
    courseIds: ['children', 'guardian', 'esl-junior', 'esl-junior-2'],
    facts: [
      { label: '孩子年龄', value: 'Busy Bee 2–4岁，Family Program 5–12岁' },
      { label: '下午活动', value: '第7–10节：讲故事、游泳、跳舞、烹饪、美术' },
      { label: '晚上', value: '1:4词汇课' },
      { label: '斯巴达课', value: '亲子课程不强制' },
      { label: '家长面谈', value: '第2周起每周五12:30，每次30分钟' },
    ],
    points: [
      '未满15岁须有至少一位监护人陪读并上课；15岁以上可以单独就读。',
      '孩子上课时不能用手机；家长同样要遵守出勤和警告规定。',
    ],
  },
  {
    icon: 'rule',
    title: '斯巴达课、出勤与换课',
    subtitle: '所有课程',
    facts: [
      { label: '斯巴达课', value: '前4周必上：雅思、托福、托业早晚都上；ESL、口语强化和商务英语只上晚上；亲子课程不强制' },
      { label: '迟到', value: '超过5分钟算缺课' },
      { label: '缺课警告', value: '累计缺课8次警告1次，10次第2次，12次第3次' },
      { label: '结业证书', value: '出勤率80%以上' },
      { label: '换课换老师', value: '到校后换课每次500比索；换老师每2周可申请1次（周四申请）' },
    ],
    points: ['警告12周后失效；学业和行政警告合计5次会被退学。'],
  },
];

export const SMEAG_PRACTICAL_GUIDES: CampusPracticalGuide[] = [
  {
    icon: 'restaurant',
    eyebrow: 'MEALS & HOURS',
    title: '用餐与开放时间',
    facts: [
      { label: '周一至周六', value: '早餐07:45–09:00，午餐11:45–13:00，晚餐17:45–19:00' },
      { label: '周日', value: '早午餐10:30–13:00，晚餐17:45–19:00' },
      { label: '咖啡厅', value: '08:00–21:00' },
      { label: '便利店', value: '08:00–22:00' },
      { label: '健身房', value: '每天06:00–24:00' },
      { label: '自习室', value: '24小时开放' },
    ],
    note: '餐厅每天开放，假日也有餐；咖啡厅和便利店只收电子钱包卡。',
  },
  {
    icon: 'cleaning_services',
    eyebrow: 'SCHOOL SERVICES',
    title: '清洁、洗衣与看病',
    facts: [
      { label: '打扫', value: '每周1次，同时换床单' },
      { label: '洗衣', value: '每天09:00–21:00，件数和重量不限，洗好叠好送回房门口' },
      { label: '护士站', value: '周一至周五开放' },
      { label: '校医', value: '每周一、周四到校，看诊免费，须预约；药费可能另付' },
      { label: '租借', value: '台灯、风扇、吹风机每样每月200比索，另付押金1,000比索' },
    ],
    note: '住合作酒店的学生，衣物自己拿到学校洗衣房送洗。',
  },
  {
    icon: 'directions_bus',
    eyebrow: 'PARTNER HOTELS',
    title: '合作酒店接送车',
    facts: [
      { label: '早上去学校', value: '06:10–06:30、07:30–07:50、08:00–08:20 三班，依次到 Amethyst、S Hotel、Canberry 接人' },
      { label: '晚上回酒店', value: '19:00、19:20、20:50 三班（Canberry 晚10分钟）' },
    ],
    note: '酒店步行到学校约3分钟；班次可能按学校安排调整。',
  },
  {
    icon: 'receipt_long',
    eyebrow: 'OTHER FEES',
    title: '其他收费',
    facts: [
      { label: '加课', value: '白天每周5节5,000比索，晚上每周3节3,000比索；假日不上课，也不退费' },
      { label: '换课', value: '到校后每次500比索' },
      { label: '换房', value: '每次500比索' },
      { label: '送机', value: '1,500比索' },
    ],
    note: '到校后用比索在学校缴纳。',
  },
  {
    icon: 'event',
    eyebrow: 'BEFORE YOU GO',
    title: '出发前准备',
    facts: [
      { label: '照片', value: '1张2×2英寸（5.08厘米）照片和1张护照照片；读满24周离境前办ECC，需4张2×2照片' },
      { label: '手机', value: '自己带能用的手机，方便学校联系' },
      { label: '护照', value: '到校后交学校保管，用于办理签证' },
      { label: '活动', value: '每周五20:40在放映厅有电影之夜' },
    ],
    note: '入境和签证材料由思达启航顾问逐项帮你核对；eTravel入境登记也由顾问协助填写。',
  },
];

/** The school's 2027 holidays (SMEAG_HOLIDAYS_2027, Capital column), one line per day. */
export const SMEAG_HOLIDAY_CALENDARS: HolidayCalendar[] = [{
  year: 2027,
  label: '规划2027年入学时优先查看',
  months: [...new Set(SMEAG_HOLIDAYS_2027.map(item => item.month))].map(month => ({
    month,
    holidays: SMEAG_HOLIDAYS_2027.filter(item => item.month === month).map(item => ({
      day: `${item.day}日`,
      name: `${item.holidayZh}（${item.capital.status === 'closed' ? '停课' : '假日特别课'}）`,
    })),
  })),
}];

export const SMEAG_FAQS: FaqItem[] = [
  { question: 'SMEAG Capital 是斯巴达学校吗？', answer: '前4周必须上斯巴达课：雅思、托福、托业早晚都上，ESL、口语强化和商务英语只上晚上，亲子课程不强制。平日下课后可以外出，门禁23:00；外宿要提前申请。' },
  { question: '读雅思或托福送官方考试吗？', answer: '送。雅思、托福常规班报名12周以上，约入学第10周参加1次官方考试；预备班不送。12周内收到3次警告会失去这次考试。' },
  { question: '保分班怎么报？', answer: '报名12周以上，按学校指定的日期入学，报名时选好目标分数段；正课出勤100%、没有任何警告。读满后没达标可以免学费继续上课到达标，住宿费和到校学杂费照付。托业保分班目前暂停。' },
  { question: '可以住校外吗？', answer: '可以住学校的合作酒店，步行约3分钟，早晚有接送车，门禁同样是23:00。酒店房费比校内同类房型高，不享受思达启航折扣；住酒店不收水电费，设施使用费照收。' },
  { question: '2026–2027年有什么优惠？', answer: '2026/08/23起入学，2026/08/23–2027/01/01期间每个学习周减25美元；就读期间涉及12/20–1/2、学习至少4周，再减100美元圣诞优惠。2027/03/01起入学，03/01–06/25期间每个学习周减25美元。所有课程适用，到校后延期不适用。报价器会按你的日期自动计算。' },
  { question: '未满15岁可以一个人去吗？', answer: '不可以，须有至少一位监护人陪读并上课。15岁以上可以单独就读，但学校只负责上课和基本的校园管理，不监督学习、不向家长汇报出勤、不代管手机，学生要自己带手机。' },
  { question: '页面上的报价包含全部费用吗？', answer: '学校费用包含注册费、课程费和住宿费，并自动扣除优惠；到校学杂费单独列出，接机和押金另外准备。两者分开显示，不相加。' },
  { question: '思达启航会协助签证和入境吗？', answer: '会。通过思达启航报名，顾问会免费协助菲律宾入境和签证相关手续，你只需要按顾问指引准备个人资料。' },
];

export const SMEAG_FINAL_CTA_BADGES = ['免费选校建议', '确认空房和优惠', '签证与入境协助'];

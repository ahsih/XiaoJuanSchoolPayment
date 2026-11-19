// Static content of the CIA school page (/philippines-study/cebu/cia-cebu-international-academy).
//
// Pure data only: no Angular or browser imports. The page component renders it, and
// scripts/export-mini-program-content.cjs exports the same objects to
// /content/schools/cia.json for the WeChat mini program, so both always show the same text.
// Prices, rooms, local fees and promotions are not here: they come from cia-content-config.ts
// and the published employee revision.

import { SIDA_PHILIPPINES_CONSULTANTS } from '../../../components/sida-consultants';

export type GalleryCategory = '全部' | '校园' | '教室' | '住宿' | '餐厅' | '设施';

export interface QuickInfo {
  icon: string;
  label: string;
  value: string;
  note: string;
}

export interface GalleryImage {
  category: Exclude<GalleryCategory, '全部'>;
  title: string;
  description: string;
  src: string;
  gallery?: readonly string[];
  details?: string[];
}

export interface CiaVideoCard {
  code: string;
  /** Badge on the player; defaults to “<code> COURSE”. */
  label?: string;
  title: string;
  text: string;
  poster?: string;
  brandLogo?: string;
  brandAlt?: string;
  videoSrc: string;
  contentType: string;
  details: string[];
}

/** A short clip from CIA's official YouTube channel, shown as a small card with a Chinese caption. */
export interface CiaShortVideo {
  title: string;
  text: string;
  src: string;
  poster: string;
  duration: string;
  /** Most CIA clips are vertical phone videos; 'wide' is 16:9 and 'square' about 9:10. */
  shape?: 'wide' | 'square';
}

const buildCiaRoomGallery = (folder: string, count: number): string[] =>
  Array.from(
    { length: count },
    (_, index) =>
      `/assets/cia/rooms-2026/gallery/${folder}/${folder}-${String(index + 1).padStart(2, '0')}.webp?v=20260901`,
  );

const ciaRoomGalleries = {
  premium: buildCiaRoomGallery('premium', 6),
  pinnacle: buildCiaRoomGallery('pinnacle', 8),
  standard: buildCiaRoomGallery('standard', 6),
  twin: buildCiaRoomGallery('twin', 6),
  triple: buildCiaRoomGallery('triple', 6),
  quad: buildCiaRoomGallery('quad', 6),
  suite: buildCiaRoomGallery('suite', 6),
};

export interface BasicInfoRow {
  label: string;
  value: string;
}

export interface Highlight {
  image: string;
  title: string;
  text: string;
}

export interface FitItem {
  title: string;
  text: string;
}

export interface CourseItem {
  name: string;
  type: string;
  lessons: string;
  suitable: string;
  icon: string;
}

export interface CourseFee {
  id: string;
  name: string;
  tuition: number;
  tuition2027: number;
  suitable: string;
  schedule: string;
  note: string;
  highlightNote?: boolean;
}

export interface ScheduleItem {
  time: string;
  title: string;
  text: string;
}

export interface RoomFee {
  id: string;
  name: string;
  fee: number;
  note: string;
}

export interface RoomRateOption {
  id: string;
  label: string;
  code: string;
  location: '校内' | '校外';
}

export interface RoomRateGroup {
  title: string;
  rooms: RoomRateOption[];
}

export interface RoomComparisonProfile {
  id: string;
  label: string;
  englishName: string;
  bookingCode: string;
  location: '校内' | '校外';
  size: string;
  view: string;
  bed: string;
  service: string;
  suitable: string;
  highlights: string[];
  note: string;
  image: string;
  gallery: readonly string[];
  imageAlt: string;
}

export interface CampusBuildingCard {
  code: string;
  title: string;
  icon: string;
  facilities: string[];
}

export interface DailyScheduleRow {
  time: string;
  activity: string;
  kind: 'meal' | 'test' | 'class' | 'activity' | 'free';
}

export interface HolidayCalendar {
  year: number;
  label: string;
  months: Array<{
    month: number;
    holidays: Array<{ day: string; name: string; provisional?: boolean }>;
  }>;
}

export interface IeltsExamDate {
  month: number;
  academic: { day: string; weekday: string };
  general: { day: string; weekday: string };
}

export interface CampusMonthlyEvent {
  month: number;
  icon: string;
  title: string;
  text: string;
  image: string;
  imageAlt: string;
  imagePosition?: string;
}

export interface CourseDetailGuide {
  icon: string;
  title: string;
  subtitle: string;
  facts: Array<{ label: string; value: string }>;
  points: string[];
  image?: string;
  imageAlt?: string;
  imageCaption?: string;
  notice?: string;
  levels?: Array<{ code: string; name: string; score: string; cefr: string }>;
}

export interface LocalFee {
  item: string;
  amount: string;
  note: string;
}

export interface LocalFeeEstimate {
  item: string;
  unitLabel: string;
  quantity: number;
  total: number;
  note: string;
}

export interface ProcessStep {
  icon: string;
  title: string;
  text: string;
}

export interface StudentCareService {
  icon: string;
  number: string;
  title: string;
  subtitle: string;
  text: string;
  location: string;
  schedule: string;
  points: string[];
}

export interface CampusPracticalGuide {
  icon: string;
  eyebrow: string;
  title: string;
  facts: Array<{ label: string; value: string }>;
  note: string;
  points?: string[];
}

export interface FaqItem {
  question: string;
  answer: string;
  /** Local date (YYYY-MM-DD) from which the item is hidden. */
  until?: string;
}

/** From this local date every new CIA student pays 2027 tuition, so the 2026 price notes disappear. */
export const CIA_2026_PRICES_UNTIL = '2027-01-01';

function localIsoDate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function ciaShows2026Prices(today: Date = new Date()): boolean {
  return localIsoDate(today) < CIA_2026_PRICES_UNTIL;
}

export function currentCiaFaqs(today: Date = new Date()): FaqItem[] {
  const iso = localIsoDate(today);
  return CIA_FAQS.filter(faq => !faq.until || iso < faq.until);
}

export interface SideNavItem {
  label: string;
  target: string;
  icon: string;
}

export interface CtaConsultant {
  title: string;
  name: string;
  description: string;
  phone: string;
  phoneHref: string;
  avatarSrc: string;
  qrSrc: string;
  buttonLabel: string;
}

export interface SidaCiaReason {
  number: string;
  title: string;
  text: string;
  image: string;
  alt: string;
}

export interface SidaCiaTrustBadge {
  icon: string;
  label: string;
}

export const CIA_GALLERY_CATEGORIES: GalleryCategory[] = [
  '全部',
  '校园',
  '教室',
  '住宿',
  '餐厅',
  '设施',
];

export const CIA_GALLERY_ALBUM_CATEGORIES: Exclude<GalleryCategory, '全部'>[] = [
  '校园',
  '教室',
  '住宿',
  '餐厅',
  '设施',
];

export const CIA_GALLERY_IMAGES: GalleryImage[] = [
  {
    category: '校园',
    title: '校园泳池与主楼',
    description:
      'CIA 于2022年6月在麦克坦新校区正式开课，学习、住宿和生活设施集中在度假型校园内。',
    src: 'assets/cia/campus-sunset-aerial-enhanced.webp',
    details: ['半斯巴达 Plus 校区', '周末可前往周边餐厅和景点'],
  },
  {
    category: '校园',
    title: '校园地图',
    description:
      '校区分为 Building 1、Building 2 和 Building 3，餐厅、CRO、诊所、健身房、图书馆、宿舍和篮球场等分布在不同楼栋。',
    src: 'assets/cia/campus-map.webp',
    details: [
      'Building 2：餐厅、CRO、健身房、图书馆',
      'Building 3：宿舍、泳池平台、篮球场',
    ],
  },
  {
    category: '校园',
    title: '户外泳池',
    description:
      '主泳池位于校园中心，约50米宽，度假感强，是课后休息和校园活动常用区域。',
    src: 'assets/cia/campus-pool.webp',
    details: ['平日 19:00-21:00', '周末 07:00-21:00'],
  },
  {
    category: '教室',
    title: '一对一教室',
    description:
      '一对一教室配备白板和桌面空间，适合口语纠音、写作反馈和考试专项训练。',
    src: 'assets/cia/one-to-one-class.webp',
    details: ['253间一对一教室', '更容易集中注意力'],
  },
  {
    category: '教室',
    title: '小组课教室',
    description: '用于团体讨论、听说训练和课程互动。',
    src: 'assets/cia/small-group-class.webp',
    details: ['17间小组教室', '适合互动练习'],
  },
  {
    category: '教室',
    title: '中组课教室',
    description: '中组课堂适合听说互动、主题讨论和课堂发表。',
    src: 'assets/cia/medium-group-class.webp',
    details: ['24间中组教室', '练习讨论与表达'],
  },
  {
    category: '教室',
    title: '大组课教室',
    description: '大组课堂适合发表、演讲、辩论和更大型的课堂活动。',
    src: 'assets/cia/big-group-class.webp',
    details: ['7间大组教室', '适合演讲与辩论训练'],
  },
  {
    category: '住宿',
    title: '豪华单人间 P-1',
    description: '校内大尺寸单人床房型，配有独立学习位置和简易料理区。',
    src: ciaRoomGalleries.premium[0],
    gallery: ciaRoomGalleries.premium,
    details: ['约21.85㎡，泳池景观参考', '电磁炉、洗手池及迷你冰箱'],
  },
  {
    category: '住宿',
    title: '校外单人间 PN-1',
    description: '位于学校对面的校外住宿楼，适合重视独立空间及智能设备的学生。',
    src: ciaRoomGalleries.pinnacle[0],
    gallery: ciaRoomGalleries.pinnacle,
    details: ['约15.5至16㎡，城市景观参考', '具体普通房或小复式布局须确认'],
  },
  {
    category: '住宿',
    title: '标准单人间 S-1',
    description: '校内紧凑型单人间，适合希望专注学习并保留个人空间的学生。',
    src: ciaRoomGalleries.standard[0],
    gallery: ciaRoomGalleries.standard,
    details: ['约14.3㎡，泳池景观参考', '独立书桌、书架与迷你冰箱'],
  },
  {
    category: '住宿',
    title: '双人间 D-2',
    description: '适合朋友同行，或希望有室友交流又保留一定生活空间的学生。',
    src: ciaRoomGalleries.twin[0],
    gallery: ciaRoomGalleries.twin,
    details: ['约24.84㎡，两张较宽单人床', '卫浴可能为干湿分区或一体式'],
  },
  {
    category: '住宿',
    title: '三人间 D-3',
    description: '适合希望控制预算，同时多和不同国籍室友练习英语的学生。',
    src: ciaRoomGalleries.triple[0],
    gallery: ciaRoomGalleries.triple,
    details: ['约31.05㎡，每人独立学习位', '卫生间与淋浴间分开'],
  },
  {
    category: '住宿',
    title: '四人间 D-4',
    description:
      '预算压力相对低，适合愿意和多位室友共同生活、增加英语使用机会的学生。',
    src: ciaRoomGalleries.quad[0],
    gallery: ciaRoomGalleries.quad,
    details: ['约31.8㎡，普通多人间中面积最大', '卫生间与淋浴间分开'],
  },
  {
    category: '住宿',
    title: '家庭精致套房 SR',
    description: '同一套房体系按实际入住人数对应SR-1至SR-4，适合亲子和家庭。',
    src: ciaRoomGalleries.suite[0],
    gallery: ciaRoomGalleries.suite,
    details: ['约31.18㎡，海景参考', '大冰箱、电视、微波炉及料理区'],
  },
  {
    category: '餐厅',
    title: '学生餐厅',
    description:
      '位于 Building 2 一楼，空间宽敞并配有空调，学校厨房每天提供不同餐食。',
    src: 'assets/cia/dining-hall.webp',
    details: ['早餐、午餐、晚餐在校内餐厅', '周末也有用餐时段'],
  },
  {
    category: '餐厅',
    title: 'Cafe Bar',
    description: '咖啡吧提供饮品、轻食和点心，适合课后休息或和同学聊天。',
    src: 'assets/cia/cafe-bar.webp',
    details: ['Building 2 一楼', '咖啡、蛋糕、松饼等轻食'],
  },
  {
    category: '设施',
    title: '健身房',
    description:
      '位于 Building 2 四楼，提供现代化健身器材，适合课后运动和保持体能。',
    src: 'assets/cia/fitness-center.webp',
    details: ['平日 19:00-23:00', '周末 07:00-23:00'],
  },
  {
    category: '设施',
    title: '瑜伽与普拉提室',
    description:
      '配有普拉提核心床、凯迪拉克床、瑜伽垫和辅助训练器材，可用于伸展、瑜伽及普拉提活动。',
    src: 'assets/cia/yoga-pilates-room-official.webp',
    details: ['CIA官方设施实景', '课程及开放安排以校内公告为准'],
  },
  {
    category: '设施',
    title: 'IDP IELTS 官方考场',
    description:
      '校内设有雅思官方考试场地，空间安静宽敞，方便雅思学生熟悉考试环境。',
    src: 'assets/cia/idp-testing-venue.webp',
    details: ['Building 1 一楼和二楼', '适合雅思备考学生'],
  },
  {
    category: '设施',
    title: 'Recreation Room',
    description:
      '休闲娱乐室可用于活动、游戏和学生休息，帮助学生在学习之外放松。',
    src: 'assets/cia/recreation-room.webp',
    details: ['Building 2 四楼', '平日课后和周末开放'],
  },
  {
    category: '设施',
    title: '图书馆 / 自习室',
    description:
      '图书馆空间宽敞，提供 ESL 教材和不同类型读物，适合自习和课后复习。',
    src: 'assets/cia/library.webp',
    details: ['Building 2 四楼', '每天 06:00-23:00'],
  },
  {
    category: '设施',
    title: '小礼堂 / 放映空间',
    description:
      '配有阶梯座椅、投影及音响设备，可用于说明会、课程活动、演讲和校园集会。',
    src: 'assets/cia/auditorium-official.webp',
    details: ['CIA官方设施实景', '具体用途与开放安排以学校公告为准'],
  },
  {
    category: '设施',
    title: '校内诊所',
    description:
      '诊所可处理轻微不适和基础医疗咨询，校内有护士，并可按需要联系医生。',
    src: 'assets/cia/clinic.webp',
    details: ['Building 2 三楼', '平日 08:00-18:00'],
  },
  {
    category: '设施',
    title: '音乐与卡拉OK室',
    description:
      '位于 Building 2 四楼，配有点歌、音响和休息座位，适合课后与同学放松。',
    src: 'assets/cia/karaoke-room-official.webp',
    details: ['学校官方设施图片', '具体开放时间以校内公告为准'],
  },
  {
    category: '设施',
    title: 'Mini Mart 校内商店',
    description:
      '可购买日用品、零食和饮品，临时补充生活用品更方便。',
    src: 'assets/cia/mini-mart-official.webp',
    details: ['学校官方设施图片', '商品与营业时间以现场为准'],
  },
  {
    category: '设施',
    title: '户外篮球场',
    description:
      '可进行篮球、排球、羽毛球及部分团体运动，位于校园户外活动区。',
    src: 'assets/cia/activity-sportsfest-official.webp',
    details: ['CIA官方篮球活动实景', '活动安排以校内公告为准'],
  },
  {
    category: '设施',
    title: '羽毛球活动',
    description:
      '户外活动区可架设球网进行羽毛球；图为 CIA 校内 Sportsfest 羽毛球比赛实景。',
    src: 'assets/cia/badminton-sportsfest-official.webp',
    details: ['CIA官方 Sportsfest 2024 实景', '日常使用及活动安排以校内公告为准'],
  },
];

export const CIA_BASIC_INFO: BasicInfoRow[] = [
  { label: '学校名称', value: '菲律宾宿务 CIA 语言学校' },
  { label: '所在地区', value: 'Lapu-Lapu City, Mactan, Cebu' },
  { label: '创校时间', value: '2003年创校，麦克坦新校区2022年6月正式开课' },
  { label: '学生容量', value: '约600名学生' },
  { label: '教师规模', value: '约300名教师' },
  { label: '管理模式', value: '半斯巴达：每日测试、出勤、门禁和EOP管理' },
  { label: '住宿房型', value: '单人、双人、三人、四人及家庭精致套房；另有PN-1校外单人间' },
  {
    label: '核心资源',
    value: 'IDP IELTS官方考点、Cambridge ESL备考体系、24小时CRO学生支援',
  },
];

export const CIA_SUITABLE_FOR: FitItem[] = [
  {
    title: '第一次去菲律宾游学',
    text: '希望课程、住宿、餐厅、接机和校园服务集中，减少适应压力。',
  },
  {
    title: '想认真学但不想完全封闭',
    text: '能接受每日测试和门禁，也希望保留一定休息和周末生活。',
  },
  {
    title: '重视校园环境和住宿',
    text: '希望学校设施较新，宿舍、餐厅、泳池和健身房都在校内。',
  },
  {
    title: '准备 IELTS / TOEIC',
    text: '需要考试课程、模考安排和校内考点氛围。',
  },
];

export const CIA_NOT_SUITABLE_FOR: FitItem[] = [
  {
    title: '只想完全自由生活',
    text: 'CIA 仍有出勤、门禁、每日测试和校内规则，需要配合管理。',
  },
  {
    title: '预算非常紧',
    text: '环境和设施较好，单人间、旺季和当地费用会明显拉高预算。',
  },
  {
    title: '临近旺季才决定',
    text: '暑假、寒假、亲子和热门房型空房紧张，报价需要先确认。',
  },
  {
    title: '只看图片就想定校',
    text: '建议先确认课程强度、房型、到校费用和个人学习目标是否匹配。',
  },
];

export const CIA_CAMPUS_BUILDINGS: CampusBuildingCard[] = [
  {
    code: '01',
    title: '1号楼 · 考试与服务',
    icon: 'fact_check',
    facilities: ['IDP IELTS官方考场', 'Mini Mart校内商店', '旅行社服务点'],
  },
  {
    code: '02',
    title: '2号楼 · 教学与生活',
    icon: 'apartment',
    facilities: ['宿舍服务台与行政办公室', '咖啡吧、学生餐厅与护士站', '教室、健身房、图书馆与小礼堂', '瑜伽及普拉提活动空间'],
  },
  {
    code: '03',
    title: '3号楼 · 宿舍与教务',
    icon: 'bed',
    facilities: ['校内宿舍', '洗衣房', '教务处', '教学教室'],
  },
  {
    code: 'OUTDOOR',
    title: '中庭 · 户外活动',
    icon: 'pool',
    facilities: ['约50米主泳池', '户外休息区', '篮球、排球及羽毛球活动场地'],
  },
];

export const CIA_WEEKDAY_SCHEDULE: DailyScheduleRow[] = [
  { time: '06:40–08:00', activity: '早餐', kind: 'meal' },
  { time: '07:20–08:00', activity: '每日晨考', kind: 'test' },
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
  { time: '16:25–17:10', activity: '第10节', kind: 'class' },
  { time: '17:15–18:00', activity: '第11节', kind: 'class' },
  { time: '18:00–19:00', activity: '晚餐', kind: 'meal' },
  { time: '19:00–22:00', activity: '自由时间 / 保证班指定晚间学习', kind: 'free' },
];

export const CIA_FRIDAY_SCHEDULE: DailyScheduleRow[] = [
  { time: '06:40–08:00', activity: '早餐', kind: 'meal' },
  { time: '08:00–08:40', activity: '第1节', kind: 'class' },
  { time: '08:45–09:25', activity: '第2节', kind: 'class' },
  { time: '09:30–10:10', activity: '第3节', kind: 'class' },
  { time: '10:15–10:55', activity: '第4节', kind: 'class' },
  { time: '11:00–11:40', activity: '第5节', kind: 'class' },
  { time: '11:45–12:25', activity: '第6节', kind: 'class' },
  { time: '12:25–13:30', activity: '午餐', kind: 'meal' },
  { time: '13:30–14:10', activity: '第7节', kind: 'class' },
  { time: '14:15–14:55', activity: '第8节', kind: 'class' },
  { time: '15:00–15:40', activity: '第9节', kind: 'class' },
  { time: '15:45–16:25', activity: '第10节', kind: 'class' },
  { time: '16:30–17:10', activity: '第11节', kind: 'class' },
  { time: '17:10–18:00', activity: '演讲、朗读竞赛或月度活动', kind: 'activity' },
  { time: '18:00–19:00', activity: '晚餐', kind: 'meal' },
  { time: '19:00–24:00', activity: '自由时间', kind: 'free' },
];

export const CIA_HOLIDAY_CALENDARS: HolidayCalendar[] = [
  {
    year: 2027,
    label: '规划2027年入学时优先查看',
    months: [
      { month: 1, holidays: [{ day: '1日', name: '元旦' }] },
      {
        month: 3,
        holidays: [
          { day: '9日或10日', name: '开斋节', provisional: true },
          { day: '25日', name: '濯足节' },
          { day: '26日', name: '耶稣受难日' },
        ],
      },
      {
        month: 4,
        holidays: [
          { day: '9日', name: '勇士日' },
          { day: '27日', name: '拉普拉普胜利纪念日' },
        ],
      },
      {
        month: 5,
        holidays: [{ day: '16日或17日', name: '宰牲节', provisional: true }],
      },
      { month: 6, holidays: [{ day: '18日', name: '拉普拉普市宪章日' }] },
      {
        month: 8,
        holidays: [
          { day: '6日', name: '宿务省宪章日' },
          { day: '30日', name: '国家英雄日' },
        ],
      },
      { month: 9, holidays: [{ day: '10日', name: '奥斯梅尼亚日' }] },
      {
        month: 11,
        holidays: [
          { day: '1日', name: '诸圣节' },
          { day: '2日', name: '万灵节' },
        ],
      },
      {
        month: 12,
        holidays: [
          { day: '3日', name: '博尼法西奥日' },
          { day: '8日', name: '圣母无染原罪瞻礼' },
          { day: '24日', name: '平安夜' },
          { day: '30日', name: '黎刹日' },
          { day: '31日', name: '除夕' },
        ],
      },
    ],
  },
  {
    year: 2026,
    label: '2026年在读学生参考',
    months: [
      { month: 1, holidays: [{ day: '1日', name: '元旦' }] },
      { month: 2, holidays: [{ day: '17日', name: '农历新年' }] },
      {
        month: 3,
        holidays: [{ day: '20日', name: '开斋节', provisional: true }],
      },
      {
        month: 4,
        holidays: [
          { day: '2日', name: '濯足节' },
          { day: '3日', name: '耶稣受难日' },
          { day: '10日', name: '勇士日' },
          { day: '27日', name: '拉普拉普胜利纪念日' },
        ],
      },
      {
        month: 5,
        holidays: [
          { day: '1日', name: '劳动节' },
          { day: '29日', name: '宰牲节', provisional: true },
        ],
      },
      {
        month: 6,
        holidays: [
          { day: '12日', name: '独立日' },
          { day: '17日', name: '拉普拉普市宪章日' },
        ],
      },
      {
        month: 8,
        holidays: [
          { day: '7日', name: '宿务省宪章日' },
          { day: '21日', name: '尼诺·阿基诺日' },
          { day: '31日', name: '国家英雄日' },
        ],
      },
      { month: 9, holidays: [{ day: '9日', name: '奥斯梅尼亚日' }] },
      {
        month: 11,
        holidays: [
          { day: '2日', name: '万灵节' },
          { day: '30日', name: '博尼法西奥日' },
        ],
      },
      {
        month: 12,
        holidays: [
          { day: '8日', name: '圣母无染原罪瞻礼' },
          { day: '24日', name: '平安夜' },
          { day: '25日', name: '圣诞节' },
          { day: '30日', name: '黎刹日' },
          { day: '31日', name: '除夕' },
        ],
      },
    ],
  },
];

export const CIA_IELTS_COMPUTER_EXAM_DATES_2027 = [
  { month: 1, days: [2, 9, 16, 23, 30] },
  { month: 2, days: [6, 13, 20, 27] },
  { month: 3, days: [6, 13, 20, 27] },
  { month: 4, days: [3, 10, 17, 24] },
  { month: 5, days: [1, 8, 15, 22, 29] },
  { month: 6, days: [5, 12, 19, 26] },
  { month: 7, days: [3, 10, 17, 24, 31] },
  { month: 8, days: [7, 14, 21, 28] },
  { month: 9, days: [4, 11, 18, 25] },
  { month: 10, days: [2, 9, 16, 23, 30] },
  { month: 11, days: [6, 13, 20, 27] },
  { month: 12, days: [4, 11, 18, 25] },
];

export const CIA_IELTS_EXAM_DATES_2026: IeltsExamDate[] = [
  { month: 1, academic: { day: '31日', weekday: '周六' }, general: { day: '15日', weekday: '周四' } },
  { month: 2, academic: { day: '14日', weekday: '周六' }, general: { day: '21日', weekday: '周六' } },
  { month: 3, academic: { day: '14日', weekday: '周六' }, general: { day: '21日', weekday: '周六' } },
  { month: 4, academic: { day: '23日', weekday: '周四' }, general: { day: '25日', weekday: '周六' } },
  { month: 5, academic: { day: '16日', weekday: '周六' }, general: { day: '23日', weekday: '周六' } },
  { month: 6, academic: { day: '27日', weekday: '周六' }, general: { day: '20日', weekday: '周六' } },
  { month: 7, academic: { day: '18日', weekday: '周六' }, general: { day: '25日', weekday: '周六' } },
  { month: 8, academic: { day: '29日', weekday: '周六' }, general: { day: '22日', weekday: '周六' } },
  { month: 9, academic: { day: '26日', weekday: '周六' }, general: { day: '17日', weekday: '周四' } },
  { month: 10, academic: { day: '10日', weekday: '周六' }, general: { day: '17日', weekday: '周六' } },
  { month: 11, academic: { day: '14日', weekday: '周六' }, general: { day: '28日', weekday: '周六' } },
  { month: 12, academic: { day: '19日', weekday: '周六' }, general: { day: '12日', weekday: '周六' } },
];

export const CIA_COURSE_DETAIL_GUIDES: CourseDetailGuide[] = [
  {
    icon: 'record_voice_over',
    title: 'ESL一般英语与选修课',
    subtitle: '综合英语能力、强制写作与14类选修方向',
    facts: [
      { label: '团体人数', value: '小团体1–6人 / 中团体6–15人 / 大团体15–20人' },
      { label: '写作安排', value: '按程度指定题目与字数，隔日由老师批改' },
      { label: '入学分级', value: '入学测试决定L0–L10等级，并对应CEFR Pre-A1至C2' },
      { label: '程度测验', value: '通常每4周1次；仅读4周者第4周可选择不参加' },
      { label: '选修方式', value: '提交第一、第二、第三志愿，每周可申请换课' },
      { label: '晨考与写作', value: '晨考每日3分起；写作按等级约30–120词，须在图书馆完成并交老师检查' },
    ],
    points: [
      'Regular、Intensive与Power Intensive通过不同数量的一对一课，训练听、说、读、写、语法和词汇。',
      '学校按实际应上课日统计出勤；请假同样计入出勤率。总出勤低于90%可能无法取得结业证，低于50%可能被开除且不退款。',
      '一周内缺席超过5节课（请假除外），下一周末可能暂停外出；写作未达到要求也计作缺席。',
      '晨考缺考或未达当日分数要求时，当天不可外出。周累计参考门槛为24分，Novice学生为16分；学校资料注明，每天均参加晨考者，即使周累计未达门槛，仍可在周末外出，具体以教务考勤记录确认。',
      '选修方向包括IELTS / TOEIC / Business Open、Conversation Club、Public Speaking、Reel English、Movie Class、Dance、Hello Pops、Guitar、Uke ’n’ Talk、Callan训练、商务经济英语和母语外教课等；名额已满时会按后续志愿或自由时间安排。',
      '不参加选修时可选Free Time。Callan训练选修适合L2左右的学生；母语外教选修不向Regular ESL（RE）学生开放，需按实际课程资格选择。',
    ],
    levels: [
      { code: 'L0', name: 'Novice 1', score: '80–99', cefr: 'Pre-A1' },
      { code: 'L1', name: 'Novice 2', score: '100–119', cefr: 'A1' },
      { code: 'L2', name: 'KET Grade C', score: '120–132', cefr: 'A2' },
      { code: 'L3', name: 'KET Grade B', score: '133–139', cefr: 'A2' },
      { code: 'L4', name: 'PET Grade C', score: '140–152', cefr: 'B1' },
      { code: 'L5', name: 'PET Grade B', score: '153–159', cefr: 'B1' },
      { code: 'L6', name: 'FCE Grade C', score: '160–172', cefr: 'B2' },
      { code: 'L7', name: 'FCE Grade B', score: '173–179', cefr: 'B2' },
      { code: 'L8', name: 'CAE Grade C', score: '180–192', cefr: 'C1' },
      { code: 'L9', name: 'CAE Grade B', score: '193–199', cefr: 'C1' },
      { code: 'L10', name: 'CPE', score: '200+', cefr: 'C2' },
    ],
    notice: '课程、选修名额、晨考分数与外出规则可能按等级和学期调整，以入学测试、教务排课及当期校规为准。',
  },
  {
    icon: 'tune',
    title: 'Light ESL 特别申请与出勤安排',
    subtitle: '适用于需要兼顾工作的成年学生及年长学生，未成年人不可申请',
    facts: [
      { label: '申请对象', value: '商人、内容创作者、工作安排较多的成年学生及年长学生，须提前确认资格' },
      { label: '课程调整', value: '最多可申请取消4节课；连续2次无故旷课，该课程会被自动取消' },
      { label: '恢复课程', value: '向教务处申请，两周后可重新参加' },
      { label: '程度测验', value: '就读1–6周以入学测试作为毕业考；超过6周须再参加一次程度考' },
      { label: '晨考与写作', value: '可选择参加；晨考连续2次未参加会自动取消，申请后两周可恢复' },
      { label: '到校后转课', value: '既有学校资料列明转为Light ESL需另付200美元，须先确认当期条件' },
    ],
    points: [
      '出勤率仍须达到50%；低于50%会被开除且不退款，获准取消的课程也不退费。',
      'Light ESL采用警告制，不采用一般学生的禁足和扣点机制；违反门禁记1次警告，累计2次警告会被开除且不退款。',
      '周末旅行无需申请；周中旅行仍须提前申请并提供机票或船票，不能理解为可自行缺课或随时外出。',
    ],
    notice: 'Light ESL需学校审核，并非任何学生都可直接改选；取消课节、转课费用和警告处理以确认的课程安排及当期校规为准。',
  },
  {
    icon: 'workspace_premium',
    title: 'TOEIC预备、常规与保证班',
    subtitle: '明确目标分数、每周模考与12周保证班要求',
    facts: [
      { label: 'Pre-TOEIC', value: '无入学门槛；4周为单位；每2周1次模考' },
      { label: '保证目标', value: '600 / 700 / 800 / 900分' },
      { label: '入学分数', value: '分别为400 / 500 / 650 / 790分以上' },
    ],
    points: [
      '保证班需读满12周，出勤率达到95%，每周模考出勤率100%，并在读期间参加一次官方考试。',
      '周一至周三另有约1.5小时强制晚自习；校规和扣点规则与一般学生相同。',
      '符合条件但校内模考未达到目标分数时，学校资料列明可承担延长4周的课程费；住宿及学杂费由学生承担。',
      '符合保证班条件者可申请一次官方考试相关权益，需保留并提交正式考试收据。',
    ],
    notice: '保证权益须满足全部条件，并以学校审核、当期考务安排和正式说明为准。',
  },
  {
    icon: 'fact_check',
    title: 'IELTS预备、常规与保证班',
    subtitle: '校内IDP考试资源与分数分级入学',
    facts: [
      { label: 'Pre-IELTS', value: '入学测试3.0分及以下；后续模考达3.5分可转常规雅思' },
      { label: 'Regular IELTS', value: '入学测试3.5分及以上' },
      { label: '预备 / 常规模考', value: '每周四15:30–19:00；口语时间另行通知' },
      { label: '保证目标', value: '5.5 / 6.0 / 6.5 / 7.0分' },
      { label: '入学分数', value: '3.5–4.5 / 5.0–5.5 / 6.0 / 6.5分' },
    ],
    points: [
      '预备雅思晨考通常需达到4分、周累计16分，写作约80–200词；常规雅思晨考通常需达到7分、周累计26分，写作约100–250词。',
      '晨考缺考或未达到当日要求时，当天不可外出；学校资料注明，每天均参加晨考者，即使周累计分数未达标，仍可在周末外出。写作须在图书馆完成并交老师检查，未达到要求计作缺席。',
      '预备与常规雅思的小团体课分别侧重ESL对话、雅思语法与口语；中团体课用于练习与纠错，选修不包括雅思公开课。普通班出勤与结业要求同上方ESL说明，保证班另按下列条件执行。',
      '保证班需读满12周，并在读期间参加一次官方雅思机考，考试收据请自行保存。',
      '保证班按整个就读期的应上课课节累计出勤；病假也会影响出勤，低于95%即失去保分资格。每周四模考出勤率须达到100%，即使因病请假也会失去保分资格。',
      '周一至周三每晚另有1.5小时强制晚自习，并计入出勤；校规及扣点仍与一般学生相同。',
      '入学时未达保证班门槛、后续模考达标者，可申请延长相应周数以满足12周保证班就读要求，由教务确认转班及资格。',
      '符合条件者可按学校流程申请一次官方考试费权益；学校资料中的参考金额为13,660比索，需提交考试收据。',
      '符合全部条件但未达到目标分数时，学校资料列明可承担延长4周课程费及一次官方考试费；住宿与其他费用由学生承担。',
    ],
    notice: '考试费金额和保证权益会随官方考务政策调整，报名时须再次书面确认。',
  },
  {
    icon: 'business_center',
    title: '商务英语与打工度假',
    subtitle: '职场沟通、求职准备与毕业发表',
    facts: [
      { label: '商务英语门槛', value: 'CIA Level 4或TOEIC 400分以上' },
      { label: '商务英语周期', value: '4周或8周为一个单元' },
      { label: '程度测验', value: '每4周1次，缺席可能影响下一周外出' },
      { label: 'Working Holiday', value: '无入学门槛；4周为一个单元' },
    ],
    points: [
      '商务英语围绕商务词汇、对话、语法、写作和商业场景训练英文表达；课程重点是英语沟通，不是商业经营技能培训。',
      '商务英语晨考通常要求每日7分、周累计26分；出勤低于90%可能无法取得结业证，低于50%可能被开除且不退款。',
      '强制写作约120词，须在图书馆完成并交老师检查。晨考缺考或未达当日要求影响当天外出，周末外出例外按教务考勤记录确认。',
      '选修可在符合资格的学术或非学术课程中选择，但不包括雅思公开课。',
      '每4周的程度考须参加；无故缺考会影响下一周末外出，若下一周为离校前最后一周，则改为周一至周五禁足。',
      '就读4周及以上的商务英语学生，最后一周须完成自选主题的商务PPT演讲；不参加时学校资料列明罚款2,500比索，少于4周者除外。',
      'Working Holiday包含ESL听说、生存英语与求职准备，并搭配小组、中组及外教/CNN课程。',
    ],
  },
  {
    icon: 'speed',
    title: 'Callan快速口语课程',
    subtitle: '通过高频问答训练英语反应速度',
    facts: [
      { label: '对应报名课程', value: 'Callan ESL' },
      { label: '学习单位', value: '无入学门槛；4周为单位' },
    ],
    points: [
      'Callan课程以快速问答、即时纠错、自然缩略语和系统重复训练，提升英语反应速度。',
      '每日包含3节Callan一对一、2节ESL一对一，并搭配小组、中组、选修、写作和自习。',
    ],
  },
  {
    icon: 'flight_takeoff',
    title: 'IAU大学沉浸课程',
    subtitle: '想旁听Indiana Aerospace University课程，请选College Immersion',
    facts: [
      { label: '对应报名课程', value: 'College Immersion（IAU大学沉浸）' },
      { label: '基本安排', value: '4周为单位；每4周至少6小时IAU旁听' },
      { label: 'IAU注册费', value: '一次性50美元，课程费以入学年份价格表为准' },
      { label: '预约时间', value: '建议至少提前4周确认方向、课表与名额' },
    ],
    points: [
      'College Immersion是独立的CIA课程安排，不是报名Regular ESL后临时增加的一节选修课；报名时应明确备注“IAU大学沉浸”。',
      'CIA日常英语课程包括ESL一对一4节、小组1节、中组1节、大组1节、选修1节、写作1节与自习2节。',
      'IAU旁听通常分为2次、每次3小时，每次可能旁听1–3门课；CIA负责协调日期、课表和往返交通。',
      '可申请航空航天工程、飞机维修、航空公司管理、飞行方向航空技术、航空电子、旅游管理、酒店管理及教育等方向，实际以IAU当期课表为准。',
      '常规4周旁听完成后对应观察与参与类证明；如目标是60小时完成证明或大学学分，必须在报名时单独提出并确认，不可默认包含。',
    ],
    image: 'assets/cia/iau-immersion-certificate-sample.webp',
    imageAlt: 'IAU六十小时沉浸项目完成证书样式',
    imageCaption: 'IAU 60小时完成证书样式仅作类型说明；常规4周旁听不等同于默认获得该证书。',
    notice: '旁听科目、开课日期、名额、证书类型及学分认可均可能调整；最终以CIA与IAU书面确认，以及学生原就读院校的学分认定结果为准。',
  },
  {
    icon: 'nightlight_round',
    title: 'Evening Intensive 晚间强化课',
    subtitle: '两周一期的免费加课，适合希望利用晚间增加学习量的学生',
    facts: [
      { label: '上课时间', value: '周一至周四19:00–21:00' },
      { label: '课程周期', value: '每2周一期，每晚2小时集中训练' },
      { label: '课程级别', value: '可按当前水平选择初级或中级班' },
      { label: '课程费用', value: '课程本身免费；报名时需缴2,000比索押金' },
      { label: '适合人群', value: '英语基础较弱、希望系统巩固或学有余力的学生' },
    ],
    points: [
      '每期均包含听、说、读、写与语法；相邻两期使用不同课文，两个周期共4周完成一轮内容循环。',
      '报名地点为学校3号楼教务处；每期是否开班取决于报名人数，以教务处公告为准。',
      '报名确认后不可撤销；未按时上课会计入最终出勤。迟到每次扣100比索，缺席每次扣200比索。',
      '累计缺席3次或主动退出课程时，学校资料列明可能不退押金并取消课程资格。',
      '全程满足出勤要求和课程考核标准，课程结束后押金全额退还；未达要求时按教务规定扣除部分或全部押金。',
    ],
    notice: '开班人数、报名方式、押金退还与扣费规则可能调整，仅供参考，最终以到校后教务处公告和现场说明为准。',
  },
];

export const CIA_FAQS: FaqItem[] = [
  {
    question: 'CIA 适合零基础学生吗？',
    answer:
      '适合。Regular ESL 可以从基础开始，但如果目标是短期快速开口，建议让顾问比较 Intensive 或 Power Intensive 是否更合适。',
  },
  {
    until: CIA_2026_PRICES_UNTIL,
    question: 'CIA 2027年课程费从什么时候开始使用？',
    answer:
      '不是所有学生从2026年9月1日起统一涨价。只有在2026年9月1日或之后报名，并且在2027年1月1日或之后入学，才采用2027新课程费；2026年入学仍按原价。若原定2026年入学后改期到2027年，需要按改期日期再核对。',
  },
  {
    question: 'CIA 是不是斯巴达学校？',
    answer:
      'CIA 更适合按半斯巴达理解。它有每日测试、出勤和门禁管理，但不是完全封闭式学校，适合想被学习节奏推动又希望保留一定生活空间的学生。',
  },
  {
    question: '为什么要找顾问确认报价？',
    answer:
      'CIA 的空房、优惠、旺季附加费和当地费用会随时间变化。顾问可以把课程、房型、入学日期和最新优惠一起核对，给学生正式报价。',
  },
  {
    question: '报名 CIA 前还需要确认哪些信息？',
    answer:
      '建议同时确认目标课程、计划入学日期、学习周数、房型空位、是否覆盖旺季、是否需要雅思官方考试，以及到校学杂费预算。课程开班、空房、优惠、付款节点和退改政策最终以学校正式录取、账单及当期规定为准。',
  },
  {
    question: '思达启航会协助签证和入境吗？',
    answer:
      '会。通过思达启航报名 CIA，思达启航顾问会免费协助菲律宾入境及签证相关手续，学生只需要按顾问指引准备个人资料。',
  },
];

export const CIA_MOBILE_ANCHORS: SideNavItem[] = [
  { label: '概览', target: 'overview', icon: 'dashboard' },
  { label: '校园', target: 'campus-introduction', icon: 'apartment' },
  { label: '图片', target: 'gallery', icon: 'photo_library' },
  { label: '视频', target: 'videos', icon: 'smart_display' },
  { label: '课程', target: 'courses', icon: 'menu_book' },
  { label: '住宿', target: 'rooms', icon: 'bed' },
  { label: '评价', target: 'student-reviews', icon: 'rate_review' },
  { label: '报价', target: 'quote', icon: 'calculate' },
  { label: 'FAQ', target: 'faq', icon: 'help' },
];

export const CIA_SNAPSHOT_CARDS = [
  {
    icon: 'history_edu',
    title: '学校定位',
    text: '2003年创校，2022年启用宿务麦克坦岛新校区，采用半斯巴达管理',
  },
  {
    icon: 'workspace_premium',
    title: '考试资源',
    text: '具备 IDP IELTS 官方考场资源，并安排定期模考与考试支持',
  },
  {
    icon: 'menu_book',
    title: '课程覆盖',
    text: 'ESL / IELTS / TOEIC / Business / Callan / College Immersion，寒暑假另有亲子营和青少年营',
  },
  {
    icon: 'sports_basketball',
    title: '校园与生活',
    text: '教学、住宿、餐厅、泳池、健身和球场集中在同一校园',
  },
  {
    icon: 'school',
    title: '学习节奏',
    text: '一对一与团体课结合，配合晨考、写作、自习和 EOP 规则',
  },
  {
    icon: 'support_agent',
    title: '学生支持',
    text: 'CRO、学业顾问、医务室与24小时安保覆盖学习和生活问题',
  },
];

export const CIA_VIDEO_CARDS: CiaVideoCard[] = [
  {
    code: 'CAMPUS',
    label: 'CAMPUS TOUR',
    title: '校园导览视频',
    text: 'CIA官方拍摄的校园全景（2023年）',
    poster: 'assets/cia/video-posters/campus-tour-2023.webp',
    videoSrc: 'assets/cia-video/campus-tour-2023.mp4',
    contentType: 'video/mp4',
    details: [
      '跟着工作人员走一遍校园',
      '小卖部、办公区、图书馆',
      '健身房、游泳池、篮球场',
    ],
  },
  {
    code: 'DORM',
    label: 'DORMITORY',
    title: '4号楼宿舍视频',
    text: 'CIA官方2026年拍摄，学校对面的4号楼单人间',
    poster: 'assets/cia/video-posters/building-4-dormitory.webp',
    videoSrc: 'assets/cia-video/building-4-dormitory.mp4',
    contentType: 'video/mp4',
    details: [
      '床、书桌、投影与无线充电',
      '小厨房：电磁炉、油烟机、微波炉',
      '独立卫浴与保险箱',
    ],
  },
  {
    code: 'ESL',
    title: '一般英语小组课程视频',
    text: 'Regular ESL 最新课表参考',
    poster: 'assets/cia/course-video-posters/esl-course.webp',
    brandLogo: 'assets/cia/course-video-posters/cambridge-esl.webp',
    brandAlt: 'Cambridge English Qualifications 标志',
    videoSrc:
      'assets/cia-video/ESL, WORKING HOLIDAY & TESOL COURSE INTRO.mp4',
    contentType: 'video/mp4',
    details: [
      '1 对 1 课程 4 节',
      '小组 / 中组 / 大组各 1 节',
      '选修、写作、自习各 1 节',
    ],
  },
  {
    code: 'IELTS',
    title: '雅思小组课程视频',
    text: '雅思官方考试中心',
    poster: 'assets/cia/course-video-posters/ielts-course.webp',
    brandLogo: 'assets/cia/course-video-posters/idp-ielts.webp',
    brandAlt: 'IDP IELTS 标志',
    videoSrc:
      'assets/cia-video/(English School in Cebu, Philippines) Cebu International Academy - IELTS Course Introduction.mp4',
    contentType: 'video/mp4',
    details: [
      '1 对 1 课程 4 节',
      'IELTS Clinic 中组课程 2 节',
      '雅思小组 / 选修各 1 节',
      '写作 1 节 + 自习 2 节',
    ],
  },
  {
    code: 'TOEIC',
    title: '托业小组课程视频',
    text: '托业备考课程',
    poster: 'assets/cia/course-video-posters/toeic-course.webp',
    brandLogo: 'assets/cia/course-video-posters/ets-toeic.webp',
    brandAlt: 'ETS TOEIC 标志',
    videoSrc:
      'assets/cia-video/(English School in Cebu, Philippines ) Cebu International Academy - TOEIC Course Introduction.mp4',
    contentType: 'video/mp4',
    details: [
      '1 对 1 课程 4 节',
      'TOEIC Clinic 中组课程 2 节',
      '托业小组 / 选修各 1 节',
      '写作 1 节 + 自习 2 节',
    ],
  },
  {
    code: 'BUSINESS',
    title: '商务英语小组课程视频',
    text: '剑桥商务英语课程',
    poster: 'assets/cia/course-video-posters/business-course.webp',
    brandLogo: 'assets/cia/course-video-posters/cambridge-business.webp',
    brandAlt: 'Cambridge English Business 标志',
    videoSrc: 'assets/cia-video/BUSINESS GROUP VIDEO.mp4',
    contentType: 'video/mp4',
    details: [
      '商务一对一课程 5 节',
      '商务小组 / 综合中组各 1 节',
      '选修与写作各 1 节',
      '自习 2 节',
    ],
  },
];

/**
 * Official IELTS results of CIA students (August 2026), from CIA's score posters with the name, photo,
 * birth date, candidate ID/number and report number pixelated. Never add an unmasked report.
 */
export const CIA_IELTS_RESULTS: ReadonlyArray<{ image: string; title: string; entrance: string; overall: string; detail: string }> = [
  { image: 'assets/cia/ielts-results/ielts-taiwan-4w-7-5.webp', title: '台湾学员 · 4周', entrance: '5.5', overall: '7.5', detail: '学术类 · 听力8.5 阅读8.0 写作6.5 口语6.5' },
  { image: 'assets/cia/ielts-results/ielts-china-4w-7-0.webp', title: '中国学员 · 4周', entrance: '5', overall: '7.0', detail: '学术类 · 听力8.0 阅读7.0 写作6.5 口语6.5' },
  { image: 'assets/cia/ielts-results/ielts-china-4w-6-5-a.webp', title: '中国学员 · 4周', entrance: '4.5', overall: '6.5', detail: '学术类 · 听力6.5 阅读7.0 写作6.0 口语6.0' },
  { image: 'assets/cia/ielts-results/ielts-china-4w-6-5-b.webp', title: '中国学员 · 4周', entrance: '5', overall: '6.5', detail: '学术类 · 听力6.5 阅读7.0 写作6.0 口语7.0' },
  { image: 'assets/cia/ielts-results/ielts-china-10w-6-5.webp', title: '中国学员 · 10周', entrance: '4', overall: '6.5', detail: '学术类 · 听力6.0 阅读7.0 写作6.0 口语6.5' },
  { image: 'assets/cia/ielts-results/ielts-china-7w-5-5.webp', title: '中国学员 · 7周', entrance: '2.5', overall: '5.5', detail: '学术类 · 听力5.0 阅读5.5 写作5.5 口语5.5' },
];

/** Dormitory rules shown in the rooms section's rules panel (same for campus and Building 4 dorms). */
export const CIA_DORM_RULES: ReadonlyArray<{ title: string; text: string }> = [
  { title: '禁止访客：', text: '不能带任何人进自己房间（包括其他CIA学生），也不能进别人房间；第一次罚200美元或劝退不退费，第二次直接劝退不退费。' },
  { title: '禁烟：', text: '所有房间禁止吸烟，违规罚5,000比索并扣10分；只能在指定吸烟区吸烟。' },
  { title: '禁酒：', text: '不能把酒带进宿舍，保安会检查包并没收，违规扣10分。' },
  { title: '房卡：', text: '离开房间时把房卡留在房内取电槽，罚5,000比索。' },
  { title: '损坏赔偿：', text: '损坏房内物品须用比索现金照价赔偿。' },
  { title: '入住与退房：', text: '入住时和工作人员一起检查房间设施并签确认单；离校前最后一个周五申请查房，查房后凭确认单领回护照和押金。' },
];

// Vertical clips from CIA's official YouTube channel (@cebuCIA), compressed for the website.
export const CIA_CAMPUS_LIFE_VIDEOS: CiaShortVideo[] = [
  {
    title: '宿舍房型总览',
    text: '单人间到三人间，2026年拍摄',
    src: 'assets/cia-video/shorts/student-housing.mp4',
    poster: 'assets/cia/video-posters/student-housing.webp',
    duration: '1:00',
  },
  {
    title: '单人间实拍',
    text: '床、衣柜、卫生间和阳台景观',
    src: 'assets/cia-video/shorts/single-room.mp4',
    poster: 'assets/cia/video-posters/single-room.webp',
    duration: '0:55',
  },
  {
    title: '三人间实拍',
    text: '三张床、书桌、卫浴和阳台',
    src: 'assets/cia-video/shorts/triple-room.mp4',
    poster: 'assets/cia/video-posters/triple-room.webp',
    duration: '0:41',
  },
  {
    title: '食堂自助餐',
    text: '每天的自助午餐',
    src: 'assets/cia-video/shorts/daily-meals.mp4',
    poster: 'assets/cia/video-posters/daily-meals.webp',
    duration: '0:23',
  },
  {
    title: 'NUU 咖啡厅（校外）',
    text: '离学校步行3–5分钟，咖啡和烘焙',
    src: 'assets/cia-video/shorts/nuu-cafe.mp4',
    poster: 'assets/cia/video-posters/nuu-cafe.webp',
    duration: '0:42',
  },
];

export const CIA_INTERVIEW_VIDEOS: CiaShortVideo[] = [
  {
    title: '台湾学员：读了7周ESL',
    text: '两位台湾学员聊为什么选菲律宾、上课节奏和老师，以及会不会推荐给朋友。',
    src: 'assets/cia-video/shorts/taiwanese-students.mp4',
    poster: 'assets/cia/video-posters/taiwanese-students.webp',
    duration: '1:47',
  },
  {
    title: '毕业学员：最难忘的事',
    text: '毕业当天泳池边的采访：各国朋友、同学、老师和英语进步。',
    src: 'assets/cia-video/shorts/best-experience.mp4',
    poster: 'assets/cia/video-posters/best-experience.webp',
    duration: '0:57',
    shape: 'square',
  },
  {
    title: '日本学员：托业课程评价',
    text: '每周模考看得到进步，喜欢小组课和校内咖啡厅，还参加了圣婴节。',
    src: 'assets/cia-video/shorts/japanese-student-review.mp4',
    poster: 'assets/cia/video-posters/japanese-student-review.webp',
    duration: '3:26',
    shape: 'wide',
  },
];

export const CIA_COURSE_CHOICE_CARDS = [
  {
    icon: 'chat_bubble_outline',
    label: '第一次游学',
    title: 'Regular ESL',
    text: '均衡提升英语听说读写，适合打基础的学生。',
    courseIds: ['regular-esl'],
  },
  {
    icon: 'person_add',
    label: '想多上一对一',
    title: 'Intensive / Power Intensive',
    text: '增加一对一课时，适合短期快速提升英语能力。',
    courseIds: ['intensive-esl', 'power-intensive'],
  },
  {
    icon: 'track_changes',
    label: '雅思目标',
    title: 'Pre-IELTS / IELTS Regular / IELTS Guarantee',
    text: '备考全套体系，可参加模考与官方考试资源。',
    courseIds: ['pre-ielts', 'ielts-regular', 'ielts-guarantee'],
  },
  {
    icon: 'scoreboard',
    label: '托业目标',
    title: 'Pre-TOEIC / TOEIC Regular / TOEIC Guarantee',
    text: '听力、阅读强化，适合求职或升学分数目标。',
    courseIds: ['pre-toeic', 'toeic-regular', 'toeic-guarantee'],
  },
  {
    icon: 'business_center',
    label: '职场英语',
    title: 'Business English',
    text: '商务沟通、会议、邮件和面试实用训练。',
    courseIds: ['business'],
  },
  {
    icon: 'flight_takeoff',
    label: '特色项目',
    title: 'Working Holiday / Callan / College Immersion',
    text: '适合打工度假、口语训练或大学深度体验项目。',
    courseIds: ['working-holiday', 'callan-esl', 'college-immersion'],
  },
];

/** Website course list: one short line per group; each course opens to show its schedule and notes. */
export const CIA_COURSE_GROUPS: ReadonlyArray<{ icon: string; title: string; text: string; courseIds: readonly string[] }> = [
  {
    icon: 'chat_bubble_outline',
    title: '通用英语 ESL',
    text: '打基础选 Regular，想多上一对一选 Intensive',
    courseIds: ['regular-esl', 'intensive-esl', 'power-intensive'],
  },
  {
    icon: 'track_changes',
    title: '雅思 IELTS',
    text: 'IDP官方考场，保证班须读满12周',
    courseIds: ['pre-ielts', 'ielts-regular', 'ielts-guarantee'],
  },
  {
    icon: 'scoreboard',
    title: '托业 TOEIC',
    text: '求职、升学需要分数，保证班须读满12周',
    courseIds: ['pre-toeic', 'toeic-regular', 'toeic-guarantee'],
  },
  {
    icon: 'business_center',
    title: '商务与特色项目',
    text: '商务英语、打工度假、Callan、大学体验',
    courseIds: ['business', 'working-holiday', 'callan-esl', 'college-immersion'],
  },
];

export const CIA_STUDENT_CARE_SERVICES: StudentCareService[] = [
  {
    icon: 'support_agent',
    number: '01',
    title: 'CRO 客户关系办公室',
    subtitle: '24小时学生支援',
    text: '房间设施报修、物品遗失、行李称重或生活咨询可找CRO。非办公时间联系不到相关人员，或报修后仍未处理，也可到前台继续反映；紧急情况由值班人员协助处理。',
    location: '2号楼前台区域',
    schedule: '每天',
    points: ['一般学生服务', '邮局快递协助'],
  },
  {
    icon: 'school',
    number: '02',
    title: 'AA 学业顾问',
    subtitle: '课程与生活咨询',
    text: '新生会安排 Academic Advisor，协助课程、课表、学习规划和学校生活适应，也可提供保密的学习与生活咨询。',
    location: '线上 / 线下',
    schedule: '每天',
    points: ['课程、课表与课程体系建议', '学习与生活咨询'],
  },
  {
    icon: 'forum',
    number: '03',
    title: 'SNS 线上沟通服务',
    subtitle: '公告与经理联络',
    text: '学校会在线上发布校内活动、生活提醒和重要公告；在校期间遇到问题，可找国际经理沟通。',
    location: '线上 SNS',
    schedule: '每天',
    points: ['校内信息通知', '国际经理沟通'],
  },
  {
    icon: 'record_voice_over',
    number: '04',
    title: 'EOP 英语使用规则',
    subtitle: '鼓励多说英语',
    text: '教室和指定英语区域鼓励使用英语。校内会有 EOP 巡查，违规罚款会用于每月活动及公益捐赠，帮助学生增加英语输出机会。',
    location: 'A楼及指定英语区域',
    schedule: '每天',
    points: ['提高英语使用频率', '营造英语学习环境'],
  },
  {
    icon: 'airport_shuttle',
    number: '05',
    title: '接机服务与迎新包',
    subtitle: '从机场到校园',
    text: '新生抵达机场后，CIA 工作人员会在到达区迎接并安排校车前往校园；到校后会说明设施、安全须知，并提供临时学生证和迎新资料。',
    location: '机场到达区 / 校园内',
    schedule: '抵达当天',
    points: ['机场接机至宿舍', '到校基础说明与迎新资料'],
  },
  {
    icon: 'edit_note',
    number: '06',
    title: 'Daily Test 每日测试',
    subtitle: '词汇、语法与写作节奏',
    text: '新生入学说明时会收到每日测试资料。周一至周四早上安排基础词汇、语法测试，并配合自习写作练习，由一对一写作老师检查。',
    location: 'SSR / C楼',
    schedule: '周一至周四 07:20-08:00',
    points: [
      '低于要求分数会影响外出权限',
      '迟到、带手机或未写姓名可能记零分',
    ],
  },
  {
    icon: 'medical_services',
    number: '07',
    title: '医疗服务',
    subtitle: '护士与校医支援',
    text: '学校护士会照顾学生健康，校医每周到校一次，可提供医疗建议、处方建议，必要时建议就医，并在紧急情况中及时协助。',
    location: 'A楼诊所',
    schedule: '护士每天 / 医生每周一次',
    points: ['如需校医检查，早上登记申请', '紧急情况及时响应'],
  },
];

export const CIA_CAMPUS_PRACTICAL_GUIDES: CampusPracticalGuide[] = [
  {
    icon: 'confirmation_number',
    eyebrow: 'ADMIN OFFICE',
    title: '行政办事与外出申请',
    facts: [
      { label: '位置与流程', value: 'B2教学楼一楼入口处，先取号再到对应窗口办理' },
      { label: '办公时间', value: '08:00–18:00；午休11:50–13:00' },
      { label: '表格截止', value: '旅行、退房、Free Day等申请通常需在17:00前提交' },
    ],
    points: [
      '1号窗口：签证延长、取回护照、退房与押金、延长住宿及送机预约；2号窗口：晨考成绩、外出限制、Free Day、旅行及特别外出申请。',
      '3号窗口：课本选购与课表领取；4号窗口：咨询及志愿者活动；5–7号窗口：出勤确认；8号窗口：美元或日元兑换。人员与窗口安排以现场指引为准。',
      '一般课程学生工作日不能自行安排搭船或搭车的短途旅游，尤其不能在周五下午提前离校去薄荷岛。需要工作日旅行时须事先申请并按要求提供机票；Light ESL按课程区列出的单独规则执行。',
    ],
    note: '请先完成申请和校方确认，再安排出行；提交表格不等于已获准外出。',
  },
  {
    icon: 'sim_card',
    eyebrow: 'SIM & INTERNET',
    title: '校内SIM卡与充值',
    facts: [
      { label: '未注册SIM', value: '约50比索，需本人使用护照和基本信息完成注册后充值使用' },
      { label: '已注册SIM', value: '约150比索，可直接充值使用；购买时确认当前实名及使用要求' },
      { label: '充值方式', value: '校内小卖铺现场充值，或使用“菲速充”微信小程序' },
    ],
    note: '小卖铺电话卡为Smart卡；套餐、售价和注册要求可能随电信政策调整。',
  },
  {
    icon: 'restaurant_menu',
    eyebrow: 'DINING HOURS',
    title: '校内餐厅用餐时间',
    facts: [
      { label: '周一至周六 / 节假日', value: '早餐06:30–08:00；午餐11:30–13:00；晚餐17:30–19:00' },
      { label: '周五午餐', value: '11:30–13:10' },
      { label: '周日', value: '早午餐10:00–12:00；晚餐17:30–19:00' },
    ],
    note: '餐食通常会在结束前10分钟停止供应；课程表中的学生早餐安排可能从06:40开始，请按入学通知协调晨考与用餐。',
  },
  {
    icon: 'local_laundry_service',
    eyebrow: 'LAUNDRY',
    title: '免费洗衣与自助付费洗衣',
    facts: [
      { label: '服务地点', value: '一楼洗衣部，位于B2与B3之间' },
      { label: '免费送洗', value: '07:00–15:00收取脏衣，通常2–3天后领取；仅使用学校默认洗衣液' },
      { label: '干净衣物领取', value: '周一至周五10:00–20:00；周六、周日10:00–17:00' },
      { label: '付费自助', value: '洗涤及烘干200比索，可洗内衣裤并使用自己的洗衣液；较早送洗有机会当天领取' },
      { label: '付费开放', value: '周一至周五07:00–21:00；周末07:00–17:00；节假日08:00–17:00' },
    ],
    note: '送洗和领取时请检查衣物；学校不承担洗衣损坏责任。遗失赔偿参考为上衣500比索、短裤300比索、衬衫或外套200比索、毛巾100比索、其他50比索，具体认定与处理以校方规定为准。',
  },
];

export const CIA_ROOM_COMPARISON_PROFILES: RoomComparisonProfile[] = [
  {
    id: 'premium-single',
    label: '豪华单人间',
    englishName: 'Premium Single',
    bookingCode: 'P-1',
    location: '校内',
    size: '约21.85㎡',
    view: '泳池景观',
    bed: '约160 × 200cm',
    service: '免费洗衣每周2次 · 房间清洁每周1次',
    suitable: '希望住校、重视独处空间，并希望房内具备简易料理条件的学生。',
    highlights: ['大尺寸单人床', '电磁炉、洗手池与迷你冰箱', '床头灯、拖鞋及壁挂式吹风机'],
    note: '网站报价对应P-1；房间朝向、楼层和具体设备位置以入住分配为准。',
    image: ciaRoomGalleries.premium[0],
    gallery: ciaRoomGalleries.premium,
    imageAlt: 'CIA校内豪华单人间实景，配有大床、书桌及简易料理区',
  },
  {
    id: 'pinnacle-single',
    label: '校外单人间',
    englishName: 'Pinnacle Single',
    bookingCode: 'PN-1',
    location: '校外',
    size: '约15.5–16㎡',
    view: '城市景观',
    bed: '约122 × 198cm',
    service: '校外住宿服务频率须单独确认',
    suitable: '希望单人居住、能接受住在学校对面校外住宿楼，并看重智能设备的学生。',
    highlights: ['智能投影与弹出式充电口', '防雾镜与高速无刷吹风机', '洗衣机及简易料理设备'],
    note: '仅此房型属于校外住宿。学校资料包含普通房与小复式两种布局；网站当前报价对应PN-1，具体布局、价格和余房须在报名时单独确认。',
    image: ciaRoomGalleries.pinnacle[0],
    gallery: ciaRoomGalleries.pinnacle,
    imageAlt: 'CIA Pinnacle校外单人间实景，配有单人床、书桌、投影和料理区',
  },
  {
    id: 'standard-single',
    label: '标准单人间',
    englishName: 'Standard Single',
    bookingCode: 'S-1',
    location: '校内',
    size: '约14.3㎡',
    view: '泳池景观',
    bed: '约122 × 198cm',
    service: '免费洗衣每周2次 · 房间清洁每周1次',
    suitable: '希望住校、预算低于豪华单人间，同时保留独立学习和休息空间的学生。',
    highlights: ['紧凑型独立空间', '独立书桌、书架与遮光帘', '迷你冰箱、热水壶及拖鞋'],
    note: '网站报价对应S-1；泳池景观为房型资料所列参考，不能作为指定朝向承诺。',
    image: ciaRoomGalleries.standard[0],
    gallery: ciaRoomGalleries.standard,
    imageAlt: 'CIA校内标准单人间实景，配有单人床、书桌和收纳空间',
  },
  {
    id: 'twin',
    label: '双人间',
    englishName: 'Twin Room',
    bookingCode: 'D-2',
    location: '校内',
    size: '约24.84㎡',
    view: '花园 / 泳池 / 海景',
    bed: '每床约122 × 198cm',
    service: '免费洗衣每周2次 · 房间清洁每周1次',
    suitable: '结伴报名，或希望在舒适度、交流机会和预算之间取得平衡的学生。',
    highlights: ['两张较宽单人床', '每人独立书桌与收纳位', '卫浴可能为干湿分区或一体式'],
    note: '网站报价对应D-2；景观和卫浴布局会因具体房号而不同。',
    image: ciaRoomGalleries.twin[0],
    gallery: ciaRoomGalleries.twin,
    imageAlt: 'CIA校内双人间实景，配有两张单人床和独立学习位置',
  },
  {
    id: 'triple',
    label: '三人间',
    englishName: 'Triple Room',
    bookingCode: 'D-3',
    location: '校内',
    size: '约31.05㎡',
    view: '花园 / 海景',
    bed: '每床约122 × 198cm',
    service: '免费洗衣每周2次 · 房间清洁每周1次',
    suitable: '希望控制住宿预算，同时保留较宽床位和多人交流环境的学生。',
    highlights: ['三张较宽单人床', '卫生间与淋浴间分开', '每人独立书桌、插座与收纳位'],
    note: '网站报价对应D-3；花园或海景属于可能朝向，不能预先保证。',
    image: ciaRoomGalleries.triple[0],
    gallery: ciaRoomGalleries.triple,
    imageAlt: 'CIA校内三人间实景，配有三张单人床和连续学习桌',
  },
  {
    id: 'quad',
    label: '四人间',
    englishName: 'Quad Room',
    bookingCode: 'D-4',
    location: '校内',
    size: '约31.8㎡',
    view: '花园 / 海景',
    bed: '每床约99 × 190.5cm',
    service: '免费洗衣每周2次 · 房间清洁每周1次',
    suitable: '优先控制预算、喜欢同学互动，并能适应多人共同生活节奏的学生。',
    highlights: ['普通多人间中面积最大', '卫生间与淋浴间分开', '24个以上插座及独立学习位'],
    note: '网站报价对应D-4；多人间入住人数及床位安排以学校实际分配为准。',
    image: ciaRoomGalleries.quad[0],
    gallery: ciaRoomGalleries.quad,
    imageAlt: 'CIA校内四人间实景，配有四张单人床和连续学习桌',
  },
  {
    id: 'suite',
    label: '家庭精致套房',
    englishName: 'Suite Room',
    bookingCode: 'SR-1 / SR-2 / SR-3 / SR-4',
    location: '校内',
    size: '约31.18㎡',
    view: '海景',
    bed: '主床约193 × 203cm',
    service: '免费洗衣每周2次 · 房间清洁每周1次',
    suitable: '亲子、家庭或希望获得更完整起居与料理配置的学生。',
    highlights: ['电视、大冰箱、微波炉与电磁炉', '洗手池、餐具、浴袍及茶几', '阳台及更完整的起居空间'],
    note: '同一套房硬件对应SR-1至SR-4的不同入住人数报价；实际加床、床型及可住人数须按家庭人数和余房确认。',
    image: ciaRoomGalleries.suite[0],
    gallery: ciaRoomGalleries.suite,
    imageAlt: 'CIA家庭精致套房实景，配有大床、电视、餐桌及料理区',
  },
];

export const CIA_STUDENT_TRACKS = [
  {
    icon: 'business',
    title: '成人主校区',
    text: '通常15岁以上，以 ESL / IELTS / TOEIC / Business 等课程为主，适合独立学习的学生或成人。',
  },
  {
    icon: 'family_restroom',
    title: '亲子 / 青少年营',
    text: '通常7岁起参加，按假期档期开放，可随在校外照顾或独立营地进行。',
  },
  {
    icon: 'assignment',
    title: '报名提醒',
    text: '报名确认前先确认年龄要求、营地地点、开课日期、房型和监护支持与费用明细。',
  },
];

export const CIA_SIDA_REASONS: SidaCiaReason[] = [
  {
    number: '01',
    title: '正式合同与官方授权',
    text: '国内公司签约，学校报价、录取文件及收费凭证均可核验。',
    image: 'assets/cia/sida-why-action-contract.webp',
    alt: 'CIA报名合同与授权文件',
  },
  {
    number: '02',
    title: '费用提前算清，同条件保价',
    text: '0中介服务费，学费、住宿费及当地费用提前说明。',
    image: 'assets/cia/sida-why-action-fees.webp',
    alt: 'CIA费用清单与计算器',
  },
  {
    number: '03',
    title: '从所有适合的学校中帮你筛选',
    text: '根据目标、预算、基础和管理偏好，分析各校优缺点与价格。',
    image: 'assets/cia/sida-why-action-selection.webp',
    alt: '思达启航顾问协助筛选CIA方案',
  },
  {
    number: '04',
    title: '出发前每一步有人提醒',
    text: '签证、eTravel、入学文件、付款、机票、保险及接机逐项提醒。',
    image: 'assets/cia/sida-why-action-departure.webp',
    alt: '菲律宾游学出发资料与手机提醒',
  },
  {
    number: '05',
    title: '服务持续到完成学习回国',
    text: '换老师、课程、住宿、账单、续读或转校问题继续协助。',
    image: 'assets/cia/sida-why-action-followup.webp',
    alt: '思达启航顾问持续跟进学生学习',
  },
  {
    number: '06',
    title: '深圳总部 + 菲律宾·欧洲驻点支持',
    text: '国内统筹与境外工作人员协作，重要情况有人跟进。',
    image: 'assets/cia/sida-why-action-team.webp',
    alt: '思达启航菲律宾和欧洲驻点团队',
  },
];

export const CIA_SIDA_TRUST_BADGES: SidaCiaTrustBadge[] = [
  { icon: 'description', label: '国内正式公司合同' },
  { icon: 'verified_user', label: '官方授权合作' },
  { icon: 'local_offer', label: '费用透明与同条件保价' },
  { icon: 'apartment', label: '深圳总部 + 菲律宾·欧洲驻点' },
];

export const CIA_CTA_BADGES = [
  '正规签约保障',
  '费用透明无隐形消费',
  '菲律宾及多国驻点支持',
  '学习期间持续协助',
];

export const CIA_CTA_CONSULTANTS: CtaConsultant[] = SIDA_PHILIPPINES_CONSULTANTS;

/** Gallery categories whose first photos fill the hero collage (until staff upload a gallery). */
export const CIA_HERO_GALLERY_CATEGORIES: ReadonlyArray<Exclude<GalleryCategory, '全部'>> = ['校园', '教室', '设施'];

export const CIA_GALLERY_ALBUM_DESCRIPTIONS: Record<Exclude<GalleryCategory, '全部'>, string> = {
  校园: '主楼、泳池与校区分布',
  教室: '一对一、小组、中组与大组课空间',
  住宿: '7类房型、多角度实景与配置差异',
  餐厅: '学生餐厅与咖啡吧',
  设施: '运动、考试、自习、医疗与休闲空间',
};

/** Text that used to be written directly in cia-school.component.html. */
export const CIA_PAGE_COPY = {
  /** Shown above swipe rows on phones, so visitors know more cards sit to the right. */
  swipeHint: '左右滑动查看',
  hero: {
    breadcrumb: '菲律宾游学 / 宿务学校 / CIA',
    title: '菲律宾宿务 CIA 语言学校',
    lead: '宿务麦克坦岛半斯巴达英语学校，适合想兼顾学习强度、校园环境、考试资源和生活便利的学生。',
    tags: [
      { icon: 'location_on', text: '宿务麦克坦岛' },
      { icon: 'verified', text: '半斯巴达管理' },
      { icon: 'fact_check', text: 'IDP IELTS 官方考场' },
      { icon: 'family_restroom', text: '成人英语 / 雅思 / 亲子营' },
    ],
  },
  overview: { title: '30 秒看懂 CIA' },
  advisorReview: {
    title: '思达启航顾问点评',
    text: 'CIA 适合想要设施舒适、学习有强度、考试资源完善的学生。第一次去菲律宾游学，希望学习和生活都在同一校园的人，可以优先看 CIA。',
    suitableTitle: '适合优先看 CIA',
    notSuitableTitle: '不太适合的情况',
  },
  campus: {
    eyebrow: 'CAMPUS AT A GLANCE',
    title: 'CIA 校园介绍',
    intro: '麦克坦新校区把教学、考试、住宿、餐饮和运动空间集中在同一校园，日常动线更清楚。',
    studentCapacity: '600',
    teacherCount: '300',
    ruleTitle: '半斯巴达学习规则',
    ruleText: '周一至周四安排每日晨考；未通过当日晨考时，当天晚间通常不可外出。具体门禁、EOP与扣点规则以入学说明和当期校规为准。',
  },
  gallery: {
    title: '按区域查看 CIA 环境',
    intro: '“全部”先按区域进入相册；相册内用左右箭头或缩略图切换，点击主图可放大。7类房型的价格与详细对比在下方“住宿”部分。',
    photoNote: '图片与开放安排仅供参考，实际场地、使用时间及学校规则以到校时通知为准。',
    roomComparisonTitle: '7类房型快速对比',
    roomDisclaimer: '图片为学校房型资料中的代表性实景。面积、景观、房号、家具、设备、服务频率及可住人数仅供选房参考，学校规则可能调整，最终以报名时确认、实际分房和到校说明为准。',
  },
  courses: {
    title: 'CIA 课程怎么选？',
    intro: '按学习目标分成四类，每门课下面是每天的课程安排，点开可看适合人群和说明。',
    priceUnit: '/4周',
    oldPriceLabel: '2026年内入学',
    fitLabel: '适合人群',
    noteLabel: '课程说明',
    detailSummaryTitle: '查看课程细节与每日课表',
    detailSummaryHint: '分级与出勤、Light ESL、雅思保证班、晚间强化及每日作息',
    facts: [
      { icon: 'workspace_premium', title: '另有 Cambridge ESL 备考方向', text: '学校可提供 A2 Key、B1 Preliminary、B2 First、C1 Advanced 等方向的备考支持；新版通用价目表未列单独价格，需按实际开课与报价确认。' },
      { icon: 'apps', title: '选修课按兴趣与课程资格选择', text: '入学时填写选修志愿，学术与非学术方向均有选择；具体课程、名额及限制见下方“ESL一般英语与选修课”。' },
      { icon: 'verified', title: '雅思与托业保证班均为12周', text: '需达到对应入学分数，并满足95%出勤、每周模考及官方考试等要求；报名时按目标分数确认班级。' },
      { icon: 'groups', title: '亲子与青少年项目按寒暑假档期开放', text: '主校区常规成人课与假期营并非同一套固定价格，年龄、营地、课程和住宿需按当期营队方案确认。' },
    ],
    guideEyebrow: 'IMPORTANT COURSE NOTES',
    guideTitle: '报名前值得确认的课程细节',
    guideIntro: '下方每个课程组都可以点击展开；建议重点核对保证班权益、选修方向和学习安排。',
    levelTableCaption: '入学分级对照（CIA校内测试）',
    ruleNoteTitle: '学校规则参考说明',
    ruleNoteText: '课程时间、开班人数、出勤、押金、扣费、外出与活动安排仅供报名前和行前参考；校规可能随时调整，最终以报名确认、到校说明及CIA当期公告为准。',
  },
  schedule: {
    eyebrow: 'DAILY TIMETABLE',
    title: 'CIA 每日课程表',
    intro: '周一至周四每节45分钟，周五每节40分钟；实际课节内容按所选课程分配。',
    badge: '从早餐到晚间自由时间',
    weekdayCode: 'MON–THU',
    weekdayTitle: '周一至周四',
    fridayCode: 'FRIDAY',
    fridayTitle: '周五',
    note: '晨考与早餐时间有部分重叠，学生应按学校分组和入学说明安排用餐及考试；保证班晚间另有指定学习安排。',
  },
  planning: {
    summaryTitle: '2027年假期、旺季与雅思考期',
    summaryHint: '寒暑假附加费档期、学校假期与每周六雅思机考日期',
  },
  calendar: {
    eyebrow: 'ACADEMIC CALENDAR',
    title: 'CIA 2026–2027年学校假期',
    intro: '本表可用于初步规划入学日期与学习周数，但仅供参考。菲律宾国家或地方政府可能临时公布、新增或调整假期，CIA也可能相应调整停课、补课与校园安排，最终以政府公告及CIA当期正式通知为准。',
    badge: '2027年优先展示',
    peakEyebrow: '2027 PEAK SEASON',
    peakTitle: '2027年寒暑假高峰期',
    peakIntro: '课程或住宿计划覆盖以下完整学习周时，每名学生按实际重叠周数计收旺季附加费。',
    peakNote: '入学按周日、离校按周六；课程与住宿在同一周重叠只计一次，旺季附加费不参与思达启航折扣。',
    provisionalLabel: '日期待官方确认',
    footnote: '除开斋节、宰牲节等日期需按宗教历法确认外，菲律宾政府也可能临时宣布全国或地方特别假期，请勿将本表视为最终停课日历。',
  },
  ielts: {
    eyebrow: '2027 IELTS ON COMPUTER',
    title: '2027年 CIA 雅思机考日期',
    intro: '根据CIA公布的2027年雅思机考（IOC）考期整理，考试安排在每周六。报名开放情况及考位请联系顾问确认，最终以CIA和IDP当期通知为准。',
    badge: '每周六 · 全年52个考期',
    previousSummary: '查看2026年雅思考期与报名参考',
    previousTitle: '2026年 CIA Mactan 雅思官方考期',
    previousIntro: 'CIA是IDP雅思官方考场资源之一。以下日期仅供行程规划参考，报名及考试日期可能调整，最终以IDP Philippines官方开放日期和CIA当期通知为准。',
    previousFee: '2026年参考考费：13,660比索',
    academicCode: 'ACADEMIC',
    academicTitle: '学术类考期',
    generalCode: 'ACADEMIC & GENERAL',
    generalTitle: '学术类及一般培训类',
    generalHint: '学校资料推荐考期',
    notes: [
      { icon: 'location_on', title: '校内考场安排', text: '如报名人数少于10人，考场可能调整至宿务市区；建议优先选择学校资料标注的推荐日期。' },
      { icon: 'edit_calendar', title: '提前两周报名', text: '学生到校后可前往教务办公室报名，学校会提前准备参加考试所需的SSP文件。' },
      { icon: 'verified', title: '仅供参考，以IDP为准', text: '报名日期、考试日期与考费均可能调整，须以报名时IDP Philippines官方页面实际开放信息为准。' },
    ],
    officialLinkLabel: '查看 IDP Philippines 最新考试信息',
    officialUrl: 'https://ielts.idp.com/philippines',
  },
  videos: {
    eyebrow: 'SCHOOL VIDEOS',
    title: '用视频了解 CIA 校园与课程',
    intro: '校园导览、宿舍和课程介绍都来自CIA官方账号，可在线播放，帮助你更直观地了解校园与课堂。',
    badge: 'CIA 官方视频',
    lifeTitle: '宿舍与校园生活实拍',
    interviewTitle: '学员访谈（英文原声）',
  },
  rooms: {
    photoTitle: '房型实景与差异',
    photoIntro: '点选房型查看多角度实景、面积、床尺寸和房务安排；各房型价格见上方住宿费表。',
    videoLink: '看宿舍实拍视频 →',
    rulesTitle: '短期费率、入住退房与宿舍规定',
    rulesHint: '1–3周住宿费比例、入住与退房时间、额外住宿费用、宿舍规定',
    dormRulesTitle: '宿舍规定',
    dormRulesNote: '校内宿舍和4号楼宿舍规定相同；仅供参考，学校可能随时调整。',
    tableHint: '面积、景观、床尺寸与洗衣清洁，一表对比',
  },
  quote: {
    modes: { single: '单人报价', compare: '方案对比', group: '多人报价' },
    conditionsTitle: '更多条件',
    compareIntro: '同一位学生，最多3个方案并排比较。先选一种对比方式，再按需要修改每个方案。',
    compareShortcuts: [
      { focus: 'room', label: '比房型', hint: '课程和周数不变' },
      { focus: 'course', label: '比同类课程', hint: '如通用英语三档、雅思三种课程' },
      { focus: 'weeks', label: '比周数', hint: '如4周、8周、12周' },
    ],
    addPlanLabel: '＋ 添加方案',
    removePlanLabel: '删除',
    compareSaveLabel: '保存对比图片',
  },
  fees: {
    summaryTitle: '查看完整课程费、住宿费与入住规则',
    summaryHint: '适合已经初步选定课程或需要核对详细价目的学生',
    classSizeTitle: '团体课人数说明',
    shortStayTitle: '短期就读费率',
    stayPolicyEyebrow: '住宿提醒',
  },
  refund: {
    summaryTitle: 'CIA 取消与退款规定',
    summaryHint: '报名前展开确认出发前、到校后与延长课程的退款规则',
    eyebrow: 'CANCELLATION & REFUND',
    title: 'CIA退款规定',
    intro: '退款以4周为一个计算单位；即使剩余6周，也只按其中完整的4周单位核算。',
    alert: '报名前请确认',
    groups: [
      {
        title: '出发之前取消',
        note: '',
        rules: [
          { when: '提前4周通知', text: '报名预付定金不可退；其他已付费用按学校核定退还。' },
          { when: '提前2周通知', text: '扣除2周住宿费后，退还其余费用。' },
          { when: '提前1周通知', text: '扣除4周住宿费后，退还其余费用。' },
          { when: '提前3天通知', text: '扣除4周课程费及4周住宿费后，退还其余费用。' },
        ],
        footnote: '',
      },
      {
        title: '抵达学校之后',
        note: '以下均按每个完整4周单位计算：',
        rules: [
          { when: '课程进行25%', text: '退还剩余课程费及住宿费的70%。' },
          { when: '课程进行50%', text: '退还剩余课程费及住宿费的50%。' },
          { when: '课程进行75%', text: '退还剩余课程费及住宿费的30%。' },
        ],
        footnote: '',
      },
      {
        title: '延长课程学生取消延长部分',
        note: '',
        rules: [
          { when: '延长课程4周前', text: '扣除4周课程费及住宿费的50%，退还其余费用。' },
          { when: '延长课程2周前', text: '扣除4周课程费及住宿费的100%，退还其余费用。' },
        ],
        footnote: '退款金额及适用时间最终以CIA审核和正式账单为准。',
      },
    ],
  },
  studentCare: {
    eyebrow: 'STUDENT CARE SERVICES',
    title: '从抵达到课堂，7项学生关怀服务',
    intro: 'CIA把生活协调、学业咨询、线上沟通、接机、测试和医疗支援连接起来，让学生知道“遇到什么问题、该找谁”。',
    count: '7项',
    summaryTitle: '校内支持网络',
    summaryHint: '生活 · 学习 · 安全 · 医疗',
    disclosureHint: 'CRO、学业顾问、线上沟通、接机、每日测试与医疗支援',
    featureImage: 'assets/cia/student-care-cro.webp',
    featureImageAlt: 'CIA客户关系办公室学生服务人员',
  },
  practicalGuide: {
    summaryTitle: '到校后办事与生活指南',
    summaryHint: '行政与外出申请、电话卡、用餐与洗衣',
    intro: '先了解去哪里办事，再查看日常生活安排。办公窗口、服务时间及规则以到校后的最新通知为准。',
  },
  studentTracks: {
    title: '成人主校区与亲子 / 青少年营怎么区分？',
    disclosureHint: '年龄要求、开放档期与报名前需要确认的事项',
    ctaLabel: '咨询 CIA 亲子营档期',
  },
  reviews: {
    eyebrow: 'OFFICIAL STUDENT REVIEWS',
    title: '在CIA学习与生活，学生怎么说？',
    intro: '课程表告诉你每天学什么，学生的真实经历则能帮助你理解：刚到校时会遇到什么、适应以后有什么变化，以及课堂之外的宿务生活是什么样子。',
    source: 'CIA学生真实反馈整理',
    linkLabel: '查看完整反馈',
    scoresTitle: 'CIA学员官方雅思成绩（2026年8月）',
    scoresIntro: '入学测试 → 官方雅思总分。点击可查看成绩单。',
    scoresNote: '已隐藏学员姓名、照片和证件信息；成绩因个人基础和投入而异，仅供参考。',
  },
  license: {
    title: '办学资质已核验',
    items: [
      '2026年拉普拉普市营业执照（英语语言学校、学生宿舍，有效至2026年12月31日）',
      '菲律宾移民局外国学生招收资格认证（学生据此办理SSP学习许可）',
    ],
    note: '证件可向思达启航顾问索取查看',
  },
  sida: {
    eyebrow: 'SIDA SERVICE GUARANTEE',
    title: '为什么学生更放心找思达启航报名CIA？',
    intro: '不是一句“全程服务”，而是把选校判断、费用、合同和境内外支持做成看得见的保障。',
    photo: 'assets/cia/sida-why-main-branded.webp',
    photoAlt: '思达启航顾问为CIA学生讲解报名方案',
    photoCaption: '每一份 CIA 方案，都从听懂你的目标和顾虑开始',
    gratitudeEyebrow: '我们的初心 · 极致利他，成人达己',
    gratitudeTitle: '感恩每一份信任，我们会认真接住你的托付',
    quote: '我们始终相信：只有学生真正选对学校、学有所获、走得更远，思达启航才能走得长久。谢谢你把这段重要的旅程交给我们。',
    text: '我们不会用漂亮话代替服务：该说明的费用和规则提前说清楚，该落实的合同、材料与境外衔接逐项落实；报名之后，也会继续关注你的学习和生活。',
    values: [
      { icon: 'record_voice_over', text: '先认真听你说' },
      { icon: 'handshake', text: '答应你的认真做到' },
      { icon: 'volunteer_activism', text: '报名之后继续负责' },
    ],
    alumni: {
      eyebrow: '学习结束，服务继续',
      title: '老学员回国后福利',
      intro: '继续学习英语或规划下一阶段升学时，可申请思达启航老学员专属权益。',
      items: [
        { number: '01', icon: 'record_voice_over', title: '一对一线上英语', text: '老学员可享线上一对一英语课程专属优惠。' },
        { number: '02', icon: 'school', title: '爱尔兰继续深造', text: '申请爱尔兰留学，可享思达启航专属奖学金或项目优惠。' },
        { number: '03', icon: 'public', title: '欧美国家英语进修', text: '继续到欧美国家学习英语，部分合作学校可免注册费或享专属优惠。' },
      ],
      note: '具体奖学金、减免范围和适用条件，以申请时合作学校及思达启航确认的当期政策为准。',
    },
  },
  faq: { title: '常见问题 FAQ' },
  finalCta: {
    title: '想知道 CIA 当前是否有空房和优惠？',
    text: '把入学日期、学习周数、课程方向和房型偏好发给顾问，我们帮你确认正式报价、空房和入学建议。',
    primaryLabel: '获取 CIA 完整报价单',
    secondaryLabel: '咨询当前空房与优惠',
  },
};

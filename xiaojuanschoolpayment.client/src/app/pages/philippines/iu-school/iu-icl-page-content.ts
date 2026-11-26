// Text and data of the IU and ICL school pages (school pack received 2026-11-24: 2026 price lists, the joint
// low-season promotion, IU's 2026 brochure and new-student handbook, ICL's facility brochure, the shared school
// regulations, the 2026 refund policy, the 2027 holiday poster, the night-class posters and each school's own photos
// and videos). The two schools are separate: every IU item comes only from IU files and every ICL item only from ICL
// files; only the shared regulations, refund policy and holiday poster appear on both pages. The shared Philippine
// school template reads this module through iu-icl-page-profile.ts. Keep it pure data (no Angular, DOM or storage),
// so the WeChat mini program can reuse it. Never add the schools' phone, address, website, e-mail or social accounts.
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
import type { IuIclCampus } from './iu-icl-content-config';

/** Closes every content section once; the same line as on every Philippine school page. */
export const IU_ICL_REFERENCE_NOTE = SCHOOL_REFERENCE_NOTE;

export interface IuIclVideo {
  name: string;
  title: string;
  description: string;
  duration: string;
  orientation: 'landscape' | 'portrait';
  topic: '校园' | '宿舍' | '课程' | '餐厅' | '学员';
}

const folder = (campus: IuIclCampus) => campus.toLowerCase();
export const iuIclVideoSrc = (campus: IuIclCampus, video: IuIclVideo) => `/assets/${folder(campus)}/videos/${video.name}.mp4`;
export const iuIclVideoPoster = (campus: IuIclCampus, video: IuIclVideo) => `/assets/${folder(campus)}/videos/poster-${video.name}.jpg`;

/** Everything one campus page shows; IU and ICL each fill their own copy. */
export interface IuIclPageContent {
  text: {
    heroLead: string;
    heroTags: ReadonlyArray<{ icon: string; text: string }>;
    advisorText: string;
    campusIntro: string;
    galleryIntro: string;
    coursesIntro: string;
    roomsPhotoIntro: string;
    finalCtaTitle: string;
    finalCtaText: string;
  };
  quickInfo: ReadonlyArray<{ icon: string; title: string; text: string }>;
  overviewFacts: ReadonlyArray<{ icon: string; label: string; value: string }>;
  basicInfo: BasicInfoRow[];
  suitableFor: string[];
  notSuitableFor: string[];
  campusBuildings: CampusBuildingCard[];
  albumDescriptions: Readonly<Record<'校园' | '教室' | '住宿' | '餐厅' | '设施', string>>;
  gallery: GalleryImage[];
  videos: IuIclVideo[];
  /** Room id → the video that opens that room's photo album. */
  roomVideoNames: Readonly<Record<string, string>>;
  roomProfiles: PhRoomProfile[];
  dormRules: Array<{ title: string; text: string }>;
  scheduleColumns: Array<{ code: string; title: string; rows: DailyScheduleRow[] }>;
  scheduleIntro: string;
  courseGroups: ReadonlyArray<{ icon: string; title: string; text: string; courseIds: readonly string[] }>;
  courseHighlights: Readonly<Record<string, { badge: string; icon?: string }>>;
  courseDetailGuides: CourseDetailGuide[];
  practicalGuides: CampusPracticalGuide[];
  practicalGuideHint: string;
  practicalGuideIntro: string;
  faqs: FaqItem[];
  ctaBadges: string[];
}

// ---------------------------------------------------------------------------------------------------------------
// Shared by both schools: the school regulations, the 2026 refund policy and the 2027 holiday poster.
// ---------------------------------------------------------------------------------------------------------------

/** The schools' shared regulations (one rule sheet for IU and ICL). */
const SHARED_RULES = [
  { title: '警告', text: '累计3次警告会被退学，不退任何费用；未成年学生一周内收到警告，当周周末不能外出。' },
  { title: '出勤', text: '无故缺课记1次缺课，迟到2次算1次缺课；一周（周一至周五）缺课5次，警告1次。' },
  { title: '礼貌与着装', text: '对老师、同学、员工不礼貌，考试作弊，或穿着过短、露腰露胸、有不雅图案文字的衣服，各警告1次。' },
  { title: '安全检查', text: '进校要接受包检，拒绝或不配合警告1次；打架、骚扰、携带违禁品或毒品立即开除，不退任何费用。' },
  { title: '烟酒', text: '校内带酒或喝酒、在指定吸烟区以外吸烟、校内任何地方用电子烟，各警告1次并罚款10,000比索。' },
  { title: '未成年学生', text: '须有监护人陪同、先交外出单才能外出，超时回宿舍警告1次；没有家长陪同的孩子，手机按学校规定时间使用。' },
  { title: '设施与用餐', text: '泳池、视听室和露台按时间和规定使用；上课用手机、网上发不当言论、浪费食物各警告1次；学生不能进厨房。' },
  { title: '宿舍', text: '23:00后吵闹警告1次；房间内不能用任何电器做饭；不能进异性房间（家长同意的家庭房除外），也不能带外人进校，违者可能立即退学、不退费。' },
  { title: '赔偿', text: '损坏学校设施或别人的物品，警告1次并照价赔偿。' },
];

/** The schools' 2026 cancellation and refund policy, plus 思达启航's own deposit rule (all schools). */
export const IU_ICL_REFUND_COPY = (campus: IuIclCampus) => ({
  summaryTitle: `${campus} 取消、改期与退款规定`,
  summaryHint: '报名定金、入学前取消、到校后按已读比例退款',
  eyebrow: 'CANCELLATION & REFUND',
  title: `${campus} 取消与退款规定`,
  intro: '到校后按申请当天已读的比例，退剩余未读周数的学费和住宿费；注册费和已读周数不退。',
  alert: '报名前请确认',
  groups: [
    {
      title: '报名与入学前',
      note: '',
      rules: [
        { when: '报名定金', text: '通过思达启航报名时预收定金2,000元人民币，为学生向学校订位；定金交了以后不退。' },
        { when: '改期', text: '入学4周前告诉顾问，可以改入学日期，或把定金保留1年；不足4周改期可能要扣违约金，以学校确认为准。' },
        { when: '入学前取消', text: '学校扣注册费，其余已付的学费和住宿费退还（思达启航定金除外）。' },
        { when: '申请时间', text: '取消或缩短课程至少提前1周申请；紧急情况学校会尽量灵活处理。' },
      ],
      footnote: '',
    },
    {
      title: '到校以后',
      note: '按申请当天已读周数占全部周数的比例：',
      rules: [
        { when: '已读不到25%', text: '退剩余未读周数学费和住宿费的50%。' },
        { when: '已读25%–50%', text: '退剩余未读周数学费和住宿费的20%。' },
        { when: '已读50%以上', text: '不退款。' },
        { when: '剩余不足4周', text: '不退款。' },
      ],
      footnote: '退款 = 剩余未读周数的费用 × 退款比例；已读周数和注册费不退。',
    },
    {
      title: '其他情况',
      note: '',
      rules: [
        { when: '已享受的优惠', text: '缩短或取消后不再符合优惠条件，退款也不扣回优惠，按实际付款计算。' },
        { when: '退款范围', text: '只退未使用的学费和住宿费；汇率变化的差额不补。' },
        { when: '违规退学', text: '3次警告或严重违规被退学的，不退款。' },
        { when: '办理', text: '由思达启航协助向学校申请；国际汇款到账时间可能不同。' },
      ],
      footnote: IU_ICL_REFERENCE_NOTE,
    },
  ],
});

/**
 * The schools' 2027 holiday poster (one poster for IU and ICL): weekday holidays only, because the weekend ones do
 * not take a class day. EDSA Day 2/25 is a special working day with classes.
 */
export const IU_ICL_HOLIDAY_CALENDARS: HolidayCalendar[] = [
  {
    year: 2027,
    label: '规划2027年入学时优先查看',
    months: [
      { month: 1, holidays: [{ day: '1日', name: '元旦' }] },
      {
        month: 3,
        holidays: [
          { day: '10日', name: '开斋节', provisional: true },
          { day: '25日', name: '濯足节' },
          { day: '26日', name: '耶稣受难日' },
        ],
      },
      { month: 4, holidays: [{ day: '9日', name: '英勇日' }] },
      { month: 5, holidays: [{ day: '17日', name: '宰牲节', provisional: true }] },
      { month: 8, holidays: [{ day: '30日', name: '国家英雄日' }] },
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

export const IU_ICL_HOLIDAY_FOOTNOTE = '只列平日的假期；其他日子照常上课，每月保证至少19个上课日，需要时学校会安排补课。2/25 EDSA纪念日照常上课。周末的假期（春节2/6、复活节前的周六3/27、劳动节5/1、独立日6/12、尼诺伊·阿基诺日8/21、圣诞节12/25）不占上课日，政府可能调整日期。';

const COMMON_FAQS: FaqItem[] = [
  {
    question: '思达启航有什么优惠？',
    answer: '课程费和住宿费9折（学校淡季套餐部分除外），1–3周的短期课程和走读也可以；老学员回校免100美元注册费。注册费和到校学杂费不打折。',
  },
  {
    question: '页面上的报价包含全部费用吗？',
    answer: '学校费用包含注册费、课程费和住宿费，并自动扣除优惠；到校后用比索交的学杂费单独列出，两者分开显示，不相加。电费超出部分、额外住宿等按实际收取。',
  },
  { question: '思达启航会协助签证和入境吗？', answer: '会。通过思达启航报名，顾问会免费协助菲律宾入境和签证相关手续，你只需要按顾问指引准备个人资料。' },
];

const lowSeasonFaq = (campus: IuIclCampus, roomOpening: string): FaqItem => ({
  question: '2026年淡季有什么优惠？',
  answer: `在2026/09/01–2027/01/16期间，口语、轻松口语、儿童青少年、雅思、托业或雅思保分课程，配同日期的${campus}校内宿舍读满4周以上，按学校的淡季套餐价收费，并免注册费。${roomOpening}校外住宿和走读不参加套餐，但可享思达启航9折。报价器会按日期自动计算。`,
});

// ---------------------------------------------------------------------------------------------------------------
// IU English Academy (IU brochure 2026, IU new-student handbook, IU photos and videos)
// ---------------------------------------------------------------------------------------------------------------

const iu = (file: string) => `assets/iu/campus/${file}.webp`;
const iuRoom = (file: string) => `assets/iu/rooms/${file}.webp`;

const IU_GALLERY: GalleryImage[] = [
  { category: '校园', title: 'IU教学楼', description: '宿务市中心的IU教学楼。', src: iu('campus-building') },
  { category: '校园', title: '校门', description: '从校门看IU教学楼。', src: iu('campus-gate') },
  { category: '校园', title: '校园夜景', description: '晚上的IU教学楼。', src: iu('campus-night') },
  { category: '教室', title: '一对一课', description: '一对一课按学生的需要安排。', src: iu('m2m-class') },
  { category: '教室', title: '一对一课', description: '老师和学生一对一上课。', src: iu('m2m-class-2') },
  { category: '教室', title: '一对一课', description: '一对一口语练习。', src: iu('m2m-class-3') },
  { category: '教室', title: '一对一教室走廊', description: '一对一教室在走廊两侧。', src: iu('m2m-hallway') },
  { category: '教室', title: '团体课', description: '团体课练习讨论和表达。', src: iu('group-class') },
  { category: '教室', title: '团体课', description: '老师带团体课。', src: iu('group-class-2') },
  { category: '教室', title: '团体课', description: '学生在白板前练习。', src: iu('group-class-3') },
  { category: '教室', title: '儿童课堂', description: '儿童英语的团体课。', src: iu('kids-class') },
  { category: '教室', title: '儿童课堂', description: '孩子们一起上课。', src: iu('kids-class-2') },
  { category: '教室', title: '儿童课堂', description: '老师陪孩子做练习。', src: iu('kids-class-3') },
  { category: '住宿', title: '校内单人间', description: '一张床和书桌，独立卫浴。', src: iuRoom('single-01') },
  { category: '住宿', title: '校内双人间', description: '两张单人床和两张书桌。', src: iuRoom('double-01') },
  { category: '住宿', title: '校内三人间', description: '三张单人床。', src: iuRoom('triple-01') },
  { category: '住宿', title: '校内家庭四人间', description: '只接受家庭入住，在2楼亲子楼层。', src: iuRoom('quad-01') },
  { category: '住宿', title: '房间卫浴', description: '校内房间的独立卫浴。', src: iuRoom('double-bath') },
  { category: '住宿', title: '房门电子锁', description: '宿舍房门用电子密码锁。', src: iu('digital-lock') },
  { category: '住宿', title: '校外单人间', description: '校外住宿的单人间。', src: iuRoom('offcampus-single') },
  { category: '住宿', title: '校外双人间', description: '校外住宿的双人间。', src: iuRoom('offcampus-double') },
  { category: '餐厅', title: '学生餐厅', description: '1楼的学生餐厅。', src: iu('dining') },
  { category: '餐厅', title: '用餐时间', description: '学生在餐厅用餐。', src: iu('dining-2') },
  { category: '餐厅', title: '自助餐台', description: '餐厅的自助餐台。', src: iu('dining-buffet') },
  { category: '餐厅', title: '沙拉吧', description: '自助餐的沙拉和水果。', src: iu('salad-bar') },
  { category: '餐厅', title: '沙拉吧', description: '每天的配菜和沙拉。', src: iu('salad-bar-2') },
  { category: '餐厅', title: '咖啡吧', description: '校内咖啡吧。', src: iu('coffee-shop') },
  { category: '餐厅', title: '咖啡吧座位', description: '学生在咖啡吧聊天学习。', src: iu('coffee-shop-2') },
  { category: '餐厅', title: '咖啡吧', description: '咖啡吧的高脚座位。', src: iu('coffee-shop-3') },
  { category: '餐厅', title: '咖啡吧零食', description: '咖啡吧卖零食和泡面。', src: iu('coffee-shop-snacks') },
  { category: '餐厅', title: '小卖部', description: '校内小卖部。', src: iu('store') },
  { category: '餐厅', title: '小卖部', description: '零食和饮料。', src: iu('store-2') },
  { category: '设施', title: '屋顶泳池', description: '6楼的屋顶泳池。', src: iu('pool') },
  { category: '设施', title: '屋顶泳池', description: '泳池和城市景色。', src: iu('pool-2') },
  { category: '设施', title: '孩子们游泳', description: '孩子们在泳池玩水。', src: iu('pool-kids') },
  { category: '设施', title: '健身区', description: '地下室的健身区。', src: iu('gym') },
  { category: '设施', title: '重量训练器材', description: '健身区的训练器材。', src: iu('gym-machines') },
  { category: '设施', title: '跑步机', description: '健身区的跑步机。', src: iu('gym-treadmills') },
  { category: '设施', title: '飞轮', description: '飞轮课用的健身车。', src: iu('spin-bikes') },
  { category: '设施', title: '有氧拳击', description: '教练带学生练拳击。', src: iu('kickboxing') },
  { category: '设施', title: '瑜伽课', description: '地下室的瑜伽课。', src: iu('yoga') },
  { category: '设施', title: '舞蹈课', description: '学生一起上舞蹈课。', src: iu('dance-studio') },
  { category: '设施', title: '撞球', description: '地下室的撞球台。', src: iu('billiards') },
  { category: '设施', title: '桌球', description: '地下室的乒乓球桌。', src: iu('table-tennis') },
  { category: '设施', title: '篮球场', description: '户外篮球场。', src: iu('basketball-court') },
  { category: '设施', title: '视听室', description: '有沙发的视听室。', src: iu('media-room') },
  { category: '设施', title: '视听室', description: '课后休息的地方。', src: iu('media-room-2') },
  { category: '设施', title: '自习室', description: '24小时开放的自习室。', src: iu('study-room') },
  { category: '设施', title: '自习室', description: '有隔板的自习座位。', src: iu('study-room-2') },
  { category: '设施', title: '自习室', description: '自习室的大桌子。', src: iu('study-room-3') },
  { category: '设施', title: '图书角', description: '可以借阅的英文书。', src: iu('library') },
];

const IU_VIDEOS: IuIclVideo[] = [
  { name: 'iu-intro', title: '认识IU', description: 'IU的校园、教室、泳池、餐厅和学生生活。', duration: '3:12', orientation: 'landscape', topic: '校园' },
  { name: 'iu-campus', title: 'IU校园一览', description: '教学楼、草坪、图书角和舞蹈课。', duration: '0:29', orientation: 'landscape', topic: '校园' },
  { name: 'iu-meals-talk', title: '校长讲伙食', description: '校长用中文介绍学生餐：每天有米饭、两样肉菜、四样配菜，还有饮料和热汤。', duration: '1:05', orientation: 'portrait', topic: '餐厅' },
  { name: 'iu-dining', title: 'IU学生餐厅', description: '餐厅和自助餐台。', duration: '0:18', orientation: 'landscape', topic: '餐厅' },
  { name: 'iu-meals', title: 'IU自助餐菜色', description: '每天的热菜、面食和沙拉。', duration: '0:24', orientation: 'portrait', topic: '餐厅' },
  { name: 'iu-salad-bar', title: '沙拉吧', description: '餐厅的沙拉吧，蔬菜和水果自己取。', duration: '0:20', orientation: 'portrait', topic: '餐厅' },
  { name: 'iu-frontdesk', title: '前台区域', description: '一楼的前台和大厅。', duration: '0:14', orientation: 'portrait', topic: '校园' },
  { name: 'iu-lounge-court', title: '休息区和运动场', description: '休息区和户外运动场。', duration: '0:11', orientation: 'portrait', topic: '校园' },
  { name: 'iu-rooftop-pool', title: '楼顶休息区和泳池', description: '楼顶的休息区和泳池。', duration: '0:21', orientation: 'portrait', topic: '校园' },
  { name: 'iu-av-room', title: '视听活动室', description: '有大电视和沙发的活动室。', duration: '0:16', orientation: 'portrait', topic: '校园' },
  { name: 'iu-gym', title: '健身房', description: '健身器材和草坪训练区。', duration: '0:25', orientation: 'portrait', topic: '校园' },
  { name: 'iu-classrooms', title: '教室区', description: '一对一小教室和走廊。', duration: '0:26', orientation: 'portrait', topic: '课程' },
  { name: 'iu-group-class', title: '团体课教室和自习室', description: '团体课教室和自习室。', duration: '0:17', orientation: 'portrait', topic: '课程' },
  { name: 'iu-orientation', title: '新生说明会', description: '新生到校后参加的入学说明会。', duration: '0:19', orientation: 'portrait', topic: '课程' },
  { name: 'iu-teacher-training', title: '老师培训', description: '老师们集中参加学校的培训。', duration: '0:49', orientation: 'portrait', topic: '课程' },
  { name: 'iu-dorm-talk', title: '校长讲三人间', description: '校长用中文介绍三人间：吹风机、冰箱、空调、洗漱用品、密码门锁和卫浴。房间以学校安排为准。', duration: '1:52', orientation: 'portrait', topic: '宿舍' },
  { name: 'iu-double', title: '双人间', description: '学校视频号里的双人间，房间以学校安排为准。', duration: '0:27', orientation: 'portrait', topic: '宿舍' },
  { name: 'iu-triple', title: '家庭房三人间', description: '学校视频号里的家庭房三人间，房间以学校安排为准。', duration: '0:16', orientation: 'portrait', topic: '宿舍' },
  { name: 'iu-quad', title: '家庭房四人间', description: '学校视频号里的家庭房四人间，房间以学校安排为准。', duration: '0:18', orientation: 'portrait', topic: '宿舍' },
  { name: 'iu-student-day', title: '学员的一天', description: '一位俄罗斯学员拍下他在IU的一天：一对一课、餐厅、健身房和校园。英文字幕。', duration: '1:33', orientation: 'portrait', topic: '学员' },
  { name: 'iu-student-story-1', title: '学员访谈：在IU读了7个月', description: '一位沙特学员讲他在IU的学习和生活。英文字幕。', duration: '2:19', orientation: 'portrait', topic: '学员' },
  { name: 'iu-student-story-2', title: '学员访谈：课堂和周末', description: '一位沙特学员讲他的课程、住宿和周末出游。英文字幕。', duration: '2:09', orientation: 'portrait', topic: '学员' },
];

const IU_ROOM_SERVICE = '每周打扫和洗衣各2次';

const IU_ROOM_PROFILES: PhRoomProfile[] = [
  {
    id: 'campus-single', rateIds: ['campus-single'], label: '校内单人间', englishName: 'SINGLE ROOM', location: '校内',
    bed: '一张床', service: IU_ROOM_SERVICE, suitable: '想要私人空间的学生', note: '独立卫浴，私密性最好。',
    highlights: ['独立卫浴', '书桌'], image: iuRoom('single-01'), gallery: [iuRoom('single-01'), iuRoom('single-02')],
    imageAlt: 'IU校内单人间实景',
  },
  {
    id: 'campus-double', rateIds: ['campus-double'], label: '校内双人间', englishName: 'DOUBLE ROOM', location: '校内',
    bed: '两张单人床', service: IU_ROOM_SERVICE, suitable: '两位朋友或家人同住', note: '独立卫浴。',
    highlights: ['独立卫浴', '每人一张书桌'], image: iuRoom('double-01'),
    gallery: [iuRoom('double-01'), iuRoom('double-02'), iuRoom('double-03'), iuRoom('double-04'), iuRoom('double-bath')],
    imageAlt: 'IU校内双人间实景',
  },
  {
    id: 'campus-triple', rateIds: ['campus-triple'], label: '校内三人间', englishName: 'TRIPLE ROOM', location: '校内',
    bed: '三张单人床', service: IU_ROOM_SERVICE, suitable: '想省住宿费的学生', note: '独立卫浴。',
    highlights: ['独立卫浴'], image: iuRoom('triple-01'), gallery: [iuRoom('triple-01'), iuRoom('triple-02'), iuRoom('triple-03')],
    imageAlt: 'IU校内三人间实景',
  },
  {
    id: 'campus-quad', rateIds: ['campus-quad'], label: '校内家庭四人间', englishName: 'FAMILY QUAD ROOM', location: '校内',
    bed: '四张单人床', service: IU_ROOM_SERVICE, suitable: '一起来的家庭', note: '只接受家庭入住，在2楼亲子楼层。',
    highlights: ['独立卫浴', '2楼亲子楼层'], image: iuRoom('quad-01'), gallery: [iuRoom('quad-01'), iuRoom('quad-02'), iuRoom('quad-03')],
    imageAlt: 'IU校内家庭四人间实景',
  },
  {
    id: 'off-campus-single', rateIds: ['off-campus-single'], label: '校外单人间', englishName: 'OFF-CAMPUS SINGLE', location: '校外',
    suitable: '想住在校外、要更多私人空间的学生', note: '不参加淡季套餐价，可享思达启航9折。',
    image: iuRoom('offcampus-single'), gallery: [iuRoom('offcampus-single'), iuRoom('offcampus-bath')],
    imageAlt: 'IU校外单人间实景',
  },
  {
    id: 'off-campus-double', rateIds: ['off-campus-double'], label: '校外双人间', englishName: 'OFF-CAMPUS DOUBLE', location: '校外',
    suitable: '两人同行、想住在校外的学生', note: '不参加淡季套餐价，可享思达启航9折。',
    image: iuRoom('offcampus-double'), gallery: [iuRoom('offcampus-double'), iuRoom('offcampus-bath')],
    imageAlt: 'IU校外双人间实景',
  },
];

/** IU's sample day of Power Speaking 4 (brochure, class times from the new-student handbook). */
const IU_MORNING: DailyScheduleRow[] = [
  { time: '07:00–08:00', activity: '早餐', kind: 'meal' },
  { time: '08:00–08:45', activity: '一对一课', kind: 'class' },
  { time: '08:55–09:40', activity: '一对一课', kind: 'class' },
  { time: '09:50–10:35', activity: '空堂（自习）', kind: 'free' },
  { time: '10:45–11:30', activity: '一对一课', kind: 'class' },
  { time: '11:40–12:25', activity: '一对一课', kind: 'class' },
];
const IU_AFTERNOON: DailyScheduleRow[] = [
  { time: '12:30–13:30', activity: '午餐', kind: 'meal' },
  { time: '13:30–14:15', activity: '团体课', kind: 'class' },
  { time: '14:25–15:10', activity: '团体课', kind: 'class' },
  { time: '15:20–16:05', activity: '空堂（自习）', kind: 'free' },
  { time: '16:15–17:00', activity: '团体课', kind: 'class' },
  { time: '17:10–17:55', activity: '团体课', kind: 'class' },
  { time: '18:00–19:00', activity: '晚餐', kind: 'meal' },
  { time: '19:00–20:50', activity: '夜间课程（2节）', kind: 'activity' },
  { time: '23:00', activity: '门禁（周五、周六01:00）', kind: 'free' },
];

const IU_COURSE_GUIDES: CourseDetailGuide[] = [
  {
    icon: 'workspace_premium',
    title: '雅思保分班',
    subtitle: '只能读8周或12周',
    courseIds: ['ielts-guarantee-8', 'ielts-guarantee-12'],
    facts: [
      { label: '课时', value: '每天一对一6节 + 团体课2节' },
      { label: '8周保分', value: '入学3.5保5.0，4.5保5.5，5.5保6.5' },
      { label: '12周保分', value: '入学3.5保5.5，4.5保6.0，6.0保7.0' },
      { label: '模考', value: '每周二、周四' },
    ],
    points: ['没有达到保证分数时，可以免学费继续学习，具体条件报名时向学校确认。', '模考无故缺考算2次缺课。'],
  },
  {
    icon: 'school',
    title: '雅思和托业',
    subtitle: '入学有最低分数要求',
    courseIds: ['ielts', 'toeic'],
    facts: [
      { label: '课时', value: '每天一对一4节 + 团体课4节' },
      { label: '雅思', value: '入学须雅思3.0或以上；每周二、周四模考' },
      { label: '雅思官方考试', value: '模考两次达到6.5或以上，学校提供1次官方考试' },
      { label: '托业', value: '入学须托业350分或以上；每周四模考' },
    ],
    points: ['想短期冲托业目标分，一对一建议选2节听力和2节阅读。', '模考无故缺考算2次缺课。'],
  },
  {
    icon: 'child_care',
    title: '儿童和青少年',
    subtitle: 'KIDS 12岁以下 · JUNIOR 13–15岁',
    courseIds: ['kids', 'junior'],
    facts: [
      { label: 'KIDS', value: '一对一4节 + 团体课2节 + 活动课2节；团体课有STEAM和数学游戏' },
      { label: 'JUNIOR', value: '一对一4节 + 团体课4节；团体课练讨论、辩论和角色扮演' },
      { label: '运动', value: '16:00–18:00的体育活动自由参加' },
      { label: '外出', value: '未满18岁须家长或学校经理陪同才能外出，21:00前回校' },
    ],
    points: ['JUNIOR每周四参加口语测验。', 'KIDS的最小年龄报名时向学校确认。', '带孩子来的家庭可以住2楼亲子楼层的家庭四人间。'],
  },
  {
    icon: 'fitness_center',
    title: '健身英语',
    subtitle: '英语课 + 健身课 + 健身餐',
    courseIds: ['fitness'],
    facts: [
      { label: '英语课', value: '每天一对一4节：听力、阅读、口语和写作' },
      { label: '健身课', value: '每周3次，可选有氧拳击、飞轮、Zumba、重量训练、有氧和瑜伽' },
      { label: '健身餐', value: '周一至周五有营养师搭配的健身餐' },
    ],
    points: ['运动课程怎么搭配，可以和健身教练讨论。'],
  },
  {
    icon: 'rule',
    title: '上课与换课规定',
    subtitle: '所有课程',
    facts: [
      { label: '一节课', value: '45分钟，课间休息10分钟' },
      { label: '迟到', value: '迟到5分钟以上记迟到，10分钟以上记缺课；迟到2次算1次缺课' },
      { label: '请假', value: '生病缺课要在上课前告诉学生经理' },
      { label: '换课', value: '周一至周三08:30–10:00到柜台申请，下周一开始新课表' },
    ],
    points: ['未经教务处同意，不能自己换班或换老师。', '一周（周一至周五）缺课5次，警告1次。'],
  },
];

const IU_PRACTICAL_GUIDES: CampusPracticalGuide[] = [
  {
    icon: 'event',
    eyebrow: 'FIRST DAY',
    title: '入住与第一天',
    facts: [
      { label: '周日', value: '入住宿舍' },
      { label: '周一 09:00–11:30', value: '入学考试' },
      { label: '14:00–14:30', value: '学校介绍' },
      { label: '14:30–16:00', value: '拍SSP照片、换钱、买日用品' },
      { label: '16:00–17:00', value: '交到校学杂费' },
      { label: '周二 07:45', value: '领考试成绩、课表和学生证' },
    ],
    note: '入境和签证材料由思达启航顾问逐项帮你核对；eTravel入境登记也由顾问协助填写。',
  },
  {
    icon: 'restaurant',
    eyebrow: 'MEALS & HOURS',
    title: '用餐与开放时间',
    facts: [
      { label: '平日三餐', value: '07:00–08:00、11:40–13:30、17:10–19:00' },
      { label: '周末三餐', value: '08:00–09:00、12:00–13:30、18:00–19:00' },
      { label: '泳池', value: '18:00–22:00' },
      { label: '健身房', value: '05:00–08:00、18:00–23:00' },
      { label: '篮球场／羽毛球场', value: '18:00–22:00' },
      { label: '视听室', value: '18:00–23:00' },
      { label: '自习室', value: '24小时' },
    ],
    note: '可以从附近餐厅订外卖，外卖时间到22:45。',
  },
  {
    icon: 'local_laundry_service',
    eyebrow: 'LAUNDRY & CLEANING',
    title: '洗衣与打扫',
    facts: [
      { label: '2楼、3楼', value: '每周一、周四' },
      { label: '4楼、5楼', value: '每周二、周五' },
      { label: '洗衣篮', value: '当天07:00–09:00放到指定地点' },
    ],
    note: '个人物品、现金和贵重物品请自己保管；学生证丢失补办100比索。',
  },
  {
    icon: 'sports_gymnastics',
    eyebrow: 'NIGHT CLASSES',
    title: '免费夜间运动课',
    facts: [
      { label: '周一至周五', value: '15:00–22:00有专业教练在地下室健身区' },
      { label: '周一 20:00', value: '舞蹈课' },
      { label: '周四 20:00', value: '舞蹈课' },
      { label: '周五 19:00', value: '瑜伽课（每次6个名额）' },
    ],
    note: '所有IU学生都可以免费参加。',
  },
  {
    icon: 'nightlife',
    eyebrow: 'CURFEW & TRAVEL',
    title: '门禁与周末旅行',
    facts: [
      { label: '门禁', value: '周日至周四23:00，周五、周六01:00' },
      { label: '未满18岁', value: '须家长或学校经理陪同才能外出，21:00前回校' },
      { label: '晚归', value: '超过门禁1小时内回校，周末不能外出；超过1小时扣2分' },
      { label: '宿务以外过夜', value: '先填旅行申请；未满18岁须家长和学校同意' },
    ],
    note: '旅行途中的安全由学生自己负责，学校可能要求提供照片、酒店收据等旅行证明。',
  },
];

const IU_CONTENT: IuIclPageContent = {
  text: {
    heroLead: '宿务市中心的语言学校，以口语课程为主，也有雅思保分、托业、儿童青少年和健身英语；6楼有屋顶泳池，2楼是亲子楼层。',
    heroTags: [
      { icon: 'location_on', text: '宿务市中心' },
      { icon: 'record_voice_over', text: '口语课程为主' },
      { icon: 'pool', text: '屋顶泳池' },
      { icon: 'family_restroom', text: '亲子楼层' },
    ],
    advisorText: 'IU以口语课程为主，Power Speaking 4、6、8按一对一和团体课的比例分，适合想集中开口说英语的学生；雅思保分班和健身英语也是IU的特色。学校在宿务市中心，步行约12分钟到商场；宿舍按亲子、女生、男生和混合楼层分开，2楼的家庭四人间适合带孩子来的家庭。6楼屋顶泳池、地下室健身区和免费的夜间运动课让课后生活很丰富。2026/09/01–2027/01/16的淡季套餐价很划算，报价器会自动计算。',
    campusIntro: '教室、宿舍、餐厅、泳池和健身区都在同一栋教学楼里，楼层按用途分开。',
    galleryIntro: '按区域查看校园、课堂、宿舍、餐厅和设施；相册内用左右箭头或缩略图切换，点击主图可放大。',
    coursesIntro: '按学习目标分组，每门课下面是每天的课时；点开可看适合谁和课程说明。',
    roomsPhotoIntro: '点选房型查看实景；各房型价格见上方住宿费表。',
    finalCtaTitle: '想确认 IU 的空房和淡季套餐？',
    finalCtaText: '告诉顾问入学日期、周数、课程和同行的人，我们帮你确认房间并做一份完整报价。',
  },
  quickInfo: [
    { icon: 'location_on', title: '宿务市中心', text: '步行约12分钟到商场' },
    { icon: 'record_voice_over', title: '口语课程为主', text: '另有雅思保分、托业和健身英语' },
    { icon: 'pool', title: '屋顶泳池', text: '6楼泳池，地下室健身区' },
    { icon: 'family_restroom', title: '亲子楼层', text: '2楼家庭住宿，有家庭四人间' },
    { icon: 'bed', title: '校内宿舍', text: '单人间到家庭四人间，都有独立卫浴' },
    { icon: 'event_available', title: '每周日入住', text: '周一入学考试，周六13:00前退房' },
  ],
  overviewFacts: [
    { icon: 'location_on', label: '位置', value: '宿务市中心，步行约12分钟到商场' },
    { icon: 'groups', label: '学生', value: '成人、青少年、儿童和带孩子来的家庭' },
    { icon: 'menu_book', label: '课程', value: 'Power Speaking口语、轻松口语、雅思和雅思保分、托业、儿童青少年、初学者、商务和健身英语' },
    { icon: 'rule', label: '管理', value: '门禁23:00（周五、周六01:00）；未满18岁须家长或学校经理陪同外出' },
    { icon: 'bed', label: '住宿', value: '校内单人间到家庭四人间，都有独立卫浴；另有校外住宿，也可走读' },
    { icon: 'event', label: '入学', value: '每周日入住，周一入学考试；周六13:00前退房' },
  ],
  basicInfo: [
    { label: '学校', value: 'IU English Academy' },
    { label: '位置', value: '菲律宾宿务市中心' },
    { label: '学生', value: '成人、青少年、儿童和亲子家庭' },
    { label: '课程', value: '口语、雅思、托业、儿童青少年、初学者、商务和健身英语' },
    { label: '住宿', value: '校内单人间、双人间、三人间、家庭四人间；校外单人间、双人间；也可走读' },
    { label: '入学', value: '全年开班，每周日入住' },
  ],
  suitableFor: [
    '想集中练口语、敢开口说英语的成人和大学生',
    '带孩子来游学的家庭（2楼亲子楼层、家庭四人间）',
    '雅思有明确目标分、想报保分班的学生',
    '想一边学英语一边健身的学生',
  ],
  notSuitableFor: [
    '想自由晚归的学生：门禁23:00（周五、周六01:00）',
    '想自己做饭的学生：房间内不能用任何电器做饭',
    '不想被管的学生：迟到、缺课和外出都有规定，3次警告要退学',
  ],
  campusBuildings: [
    { code: '1F', title: '1楼', icon: 'meeting_room', facilities: ['大厅', '视听室和自习室', '学生餐厅', '办公室'] },
    { code: '2F–5F', title: '宿舍楼层', icon: 'bed', facilities: ['2楼亲子楼层', '3楼女生楼层', '4楼男生楼层', '5楼混合楼层'] },
    { code: '6F', title: '6楼', icon: 'school', facilities: ['一对一教室和团体教室', '屋顶泳池', '沙发区'] },
    { code: 'B1', title: '地下室与户外', icon: 'fitness_center', facilities: ['健身区、有氧区、拳击区', '撞球、桌球、卡拉OK', '户外篮球、羽毛球、足球和花园'] },
  ],
  albumDescriptions: {
    校园: '教学楼、校门和夜景',
    教室: '一对一、团体课和儿童课堂',
    住宿: '校内宿舍和校外住宿',
    餐厅: '学生餐厅、咖啡吧和小卖部',
    设施: '屋顶泳池、健身区、球场和自习室',
  },
  gallery: IU_GALLERY,
  videos: IU_VIDEOS,
  roomVideoNames: {},
  roomProfiles: IU_ROOM_PROFILES,
  dormRules: [
    { title: '门禁', text: '周日至周四23:00，周五、周六01:00；未满18岁的学生21:00前回校。' },
    ...SHARED_RULES,
  ],
  scheduleColumns: [
    { code: 'MORNING', title: '上午', rows: IU_MORNING },
    { code: 'AFTERNOON', title: '下午和晚上', rows: IU_AFTERNOON },
  ],
  scheduleIntro: 'Power Speaking 4的课表示例，每节课45分钟；实际课表按所选课程和分班安排。',
  courseGroups: [
    {
      icon: 'record_voice_over', title: 'Power Speaking 口语课程', text: '按一对一和团体课的比例选',
      courseIds: ['power-speaking-4', 'power-speaking-6', 'power-speaking-8', 'light-esl'],
    },
    {
      icon: 'workspace_premium', title: '雅思与托业', text: '保分班只能读8周或12周',
      courseIds: ['ielts-guarantee-8', 'ielts-guarantee-12', 'ielts', 'toeic'],
    },
    { icon: 'child_care', title: '儿童和青少年', text: 'KIDS 12岁以下，JUNIOR 13–15岁', courseIds: ['kids', 'junior'] },
    {
      icon: 'business_center', title: '初学者、商务和健身', text: '零基础、职场和健身英语',
      courseIds: ['beginner-4', 'beginner-6', 'business-4', 'business-6', 'fitness'],
    },
  ],
  courseHighlights: {
    'ielts-guarantee-8': { badge: '未达保证分数可免学费续读' },
    'ielts-guarantee-12': { badge: '未达保证分数可免学费续读' },
    fitness: { badge: '每周3次健身课 + 健身餐', icon: 'fitness_center' },
  },
  courseDetailGuides: IU_COURSE_GUIDES,
  practicalGuides: IU_PRACTICAL_GUIDES,
  practicalGuideHint: '第一天安排、用餐与开放时间、洗衣打扫、夜间运动课、门禁与旅行',
  practicalGuideIntro: '以下按IU新生手册整理，具体安排以学校最新通知为准。',
  faqs: [
    {
      question: 'IU和ICL是什么关系？',
      answer: '两所学校同属一个教育集团，课程和价格体系相近，但校园、宿舍和价格各自独立；本页只介绍IU。',
    },
    lowSeasonFaq('IU', 'IU双人间和三人间的淡季名额2026/11/29起开放，房间有限。'),
    {
      question: '雅思保分班怎么报？',
      answer: '只能读8周或12周整。8周：入学3.5保5.0，4.5保5.5，5.5保6.5；12周：入学3.5保5.5，4.5保6.0，6.0保7.0。没有达到保证分数时可以免学费继续学习，具体条件报名时向学校确认。',
    },
    {
      question: '可以带孩子来吗？',
      answer: '可以。KIDS课程收12岁以下的孩子，JUNIOR课程收13–15岁；2楼是亲子楼层，家庭四人间只接受家庭入住。未满18岁的学生须家长或学校经理陪同才能外出。',
    },
    { question: 'IU有寒假冬令营吗？', answer: '有。冬令营的日期、课程和价格每年不同，请联系思达启航顾问确认。' },
    ...COMMON_FAQS,
  ],
  ctaBadges: ['免费选校建议', '确认空房和淡季名额', '签证与入境协助'],
};

// ---------------------------------------------------------------------------------------------------------------
// ICL English Academy (ICL facility brochure, ICL night-class poster, ICL photos and videos)
// ---------------------------------------------------------------------------------------------------------------

const icl = (file: string) => `assets/icl/campus/${file}.webp`;
const iclRoom = (file: string) => `assets/icl/rooms/${file}.webp`;

const ICL_GALLERY: GalleryImage[] = [
  { category: '校园', title: 'ICL教学楼', description: '宿务市中心的ICL独立校园。', src: icl('campus-building') },
  { category: '校园', title: 'ICL教学楼', description: '从楼下看ICL教学楼。', src: icl('campus-building-3') },
  { category: '校园', title: 'ICL教学楼', description: 'ICL教学楼外观。', src: icl('campus-building-tall') },
  { category: '校园', title: '大厅', description: '1楼大厅的接待柜台，每天08:00–22:00有人值班。', src: icl('lobby') },
  { category: '校园', title: '走廊', description: '教学楼的走廊。', src: icl('hallway') },
  { category: '校园', title: '阅读区', description: '有书架和沙发的阅读区。', src: icl('lounge') },
  { category: '校园', title: '阅读区', description: '课后休息看书的地方。', src: icl('lounge-2') },
  { category: '校园', title: '户外休息区', description: '校内的户外草坪。', src: icl('playground') },
  { category: '校园', title: '户外休息区', description: '户外的桌椅。', src: icl('playground-2') },
  { category: '教室', title: '一对一课', description: '老师和学生一对一上课。', src: icl('m2m-class') },
  { category: '教室', title: '一对一课', description: '一对一课的练习。', src: icl('m2m-class-2') },
  { category: '教室', title: '一对一课', description: '一对一教室。', src: icl('m2m-class-3') },
  { category: '教室', title: '一对一课', description: '成人学生的一对一课。', src: icl('m2m-class-4') },
  { category: '教室', title: '一对一课', description: '一对一写作练习。', src: icl('m2m-class-5') },
  { category: '教室', title: '团体课', description: '团体课练习讨论。', src: icl('group-class') },
  { category: '教室', title: '团体课', description: '老师带团体课。', src: icl('group-class-2') },
  { category: '教室', title: '团体教室', description: '有空调的团体教室。', src: icl('group-room') },
  { category: '教室', title: '团体教室', description: '团体教室的桌椅和白板。', src: icl('group-room-2') },
  { category: '住宿', title: '校内单人间', description: '一张床，独立卫浴。', src: iclRoom('single-01') },
  { category: '住宿', title: '校内双人间', description: '两张单人床。', src: iclRoom('double-01') },
  { category: '住宿', title: '校内三人间', description: '三张单人床。', src: iclRoom('triple-01') },
  { category: '住宿', title: '校内四人间', description: '四张单人床。', src: iclRoom('quad-01') },
  { category: '住宿', title: '房间卫浴', description: '校内房间的独立卫浴。', src: iclRoom('double-bath') },
  { category: '住宿', title: '宿舍楼层', description: '宿舍楼层的走廊。', src: iclRoom('dorm-hall') },
  { category: '住宿', title: '校外双人间', description: '校外住宿的双人间。', src: iclRoom('offcampus-double-01') },
  { category: '住宿', title: '校外三人间', description: '校外住宿的三人间。', src: iclRoom('offcampus-triple-01') },
  { category: '住宿', title: '校外房间的书桌', description: '校外住宿房间的书桌和电视。', src: iclRoom('offcampus-desk') },
  { category: '住宿', title: '校外房间的卫浴', description: '校外住宿房间的卫浴。', src: iclRoom('offcampus-bath') },
  { category: '餐厅', title: '学生餐厅', description: '1楼的学生餐厅。', src: icl('dining') },
  { category: '餐厅', title: '学生餐厅', description: '周一至周日都有自助三餐。', src: icl('dining-2') },
  { category: '餐厅', title: '学生餐厅', description: '宽敞的用餐区。', src: icl('dining-3') },
  { category: '餐厅', title: '自助餐菜色', description: '每餐两道主食、五道配菜、一道汤。', src: icl('meal') },
  { category: '餐厅', title: '自助餐菜色', description: '餐厅的炒面。', src: icl('meal-2') },
  { category: '餐厅', title: '自助餐菜色', description: '餐厅的虾。', src: icl('meal-3') },
  { category: '餐厅', title: '自助餐菜色', description: '面和炸物。', src: icl('meal-4') },
  { category: '餐厅', title: '咖啡吧', description: '校内咖啡吧。', src: icl('coffee-shop') },
  { category: '餐厅', title: '小卖部', description: '饮料、零食和泡面。', src: icl('store') },
  { category: '餐厅', title: '小卖部', description: '小卖部的冰柜和货架。', src: icl('store-2') },
  { category: '设施', title: '健身房', description: '地下室的重训区。', src: icl('gym') },
  { category: '设施', title: '健身房', description: '学生在健身房运动。', src: icl('gym-2') },
  { category: '设施', title: '健身区', description: '地下室的运动空间。', src: icl('gym-3') },
  { category: '设施', title: '撞球', description: '地下室的撞球台。', src: icl('billiards') },
  { category: '设施', title: '桌球', description: '地下室的乒乓球桌。', src: icl('table-tennis') },
  { category: '设施', title: '篮球场', description: '户外篮球场。', src: icl('playground-court') },
  { category: '设施', title: '视听室', description: '有沙发和大电视的视听室。', src: icl('media-room') },
  { category: '设施', title: '视听室', description: '课后看电影、休息的地方。', src: icl('media-room-2') },
  { category: '设施', title: '自习室', description: '24小时开放的自习室。', src: icl('study-room') },
  { category: '设施', title: '自习室', description: '团体自习室。', src: icl('study-room-2') },
  { category: '设施', title: '自习室', description: '有隔板的个人自习座位。', src: icl('study-room-3') },
  { category: '设施', title: '电子琴', description: '休闲空间的电子琴。', src: icl('piano') },
];

const ICL_VIDEOS: IuIclVideo[] = [
  { name: 'icl-intro', title: '认识ICL', description: 'ICL的校园、教室、餐厅和课程。', duration: '3:06', orientation: 'landscape', topic: '校园' },
  { name: 'icl-campus', title: 'ICL校园一览', description: '大厅、走廊、休息区和户外空间。', duration: '0:32', orientation: 'landscape', topic: '校园' },
  { name: 'icl-gym', title: '地下室健身区', description: '学生在健身区练拳击。', duration: '0:12', orientation: 'portrait', topic: '校园' },
  { name: 'icl-dorm-tour', title: '中文讲解四种房型', description: '学校用中文带你看校内单人间、双人间、三人间和四人间。', duration: '3:35', orientation: 'landscape', topic: '宿舍' },
  { name: 'icl-single', title: '校内单人间', description: '单人间的床、书桌和卫浴。', duration: '0:21', orientation: 'landscape', topic: '宿舍' },
  { name: 'icl-double', title: '校内双人间', description: '双人间的床和书桌。', duration: '0:16', orientation: 'landscape', topic: '宿舍' },
  { name: 'icl-triple', title: '校内三人间', description: '三人间的床和书桌。', duration: '0:15', orientation: 'landscape', topic: '宿舍' },
  { name: 'icl-quad', title: '校内四人间', description: '四人间的床。', duration: '0:13', orientation: 'landscape', topic: '宿舍' },
  { name: 'icl-offcampus', title: '校外双人间和三人间', description: '校外住宿的双人间，再到三人间。', duration: '0:17', orientation: 'portrait', topic: '宿舍' },
  { name: 'icl-classes', title: '一对一课', description: 'ICL的一对一课堂。', duration: '0:12', orientation: 'landscape', topic: '课程' },
  { name: 'icl-entry-test', title: '入学分级测试', description: '新生到校先做分级测试，按水平开始上课。', duration: '0:12', orientation: 'portrait', topic: '课程' },
  { name: 'icl-job-interview', title: '求职面试挑战', description: '学生用英文参加模拟求职面试。', duration: '0:32', orientation: 'portrait', topic: '课程' },
  { name: 'icl-dining', title: '学生餐厅', description: '学生在餐厅用餐。', duration: '0:14', orientation: 'landscape', topic: '餐厅' },
  { name: 'icl-overview', title: 'ICL校园和课堂', description: '教室、团体课和校园各处。', duration: '0:35', orientation: 'landscape', topic: '校园' },
  { name: 'icl-floor1', title: '一楼环境', description: '一楼的大厅、会议桌和休息区。', duration: '0:46', orientation: 'portrait', topic: '校园' },
  { name: 'icl-gym-room', title: '健身房', description: '健身器材和训练区。', duration: '0:13', orientation: 'portrait', topic: '校园' },
  { name: 'icl-triple-tour', title: '三人间', description: '学校视频号里的三人间。', duration: '0:22', orientation: 'portrait', topic: '宿舍' },
  { name: 'icl-quad-tour', title: '四人间', description: '学校视频号里的四人间。', duration: '0:17', orientation: 'portrait', topic: '宿舍' },
  { name: 'icl-bbq', title: '草坪烧烤', description: '学生在校园草坪上吃烧烤。', duration: '0:30', orientation: 'portrait', topic: '餐厅' },
  { name: 'icl-ielts-story', title: '雅思学员访谈', description: '一位越南学员的经历：入学测试3.5分，在ICL读雅思课程后，官方雅思考到了目标分数。英文字幕。', duration: '3:04', orientation: 'landscape', topic: '学员' },
];

const ICL_ROOM_SERVICE = '每周洗衣和打扫各2次';

const ICL_ROOM_PROFILES: PhRoomProfile[] = [
  {
    id: 'campus-single', rateIds: ['campus-single'], label: '校内单人间', englishName: 'SINGLE ROOM', location: '校内',
    bed: '一张床', service: ICL_ROOM_SERVICE, suitable: '想要私人空间的学生', note: '独立卫浴，私密性最好。',
    highlights: ['独立卫浴'], image: iclRoom('single-01'),
    gallery: [iclRoom('single-01'), iclRoom('single-02'), iclRoom('single-03')],
    imageAlt: 'ICL校内单人间实景',
  },
  {
    id: 'campus-double', rateIds: ['campus-double'], label: '校内双人间', englishName: 'DOUBLE ROOM', location: '校内',
    bed: '两张单人床', service: ICL_ROOM_SERVICE, suitable: '两位朋友或家人同住', note: '独立卫浴。',
    highlights: ['独立卫浴'], image: iclRoom('double-01'),
    gallery: [iclRoom('double-01'), iclRoom('double-02'), iclRoom('double-03'), iclRoom('double-bath')],
    imageAlt: 'ICL校内双人间实景',
  },
  {
    id: 'campus-triple', rateIds: ['campus-triple'], label: '校内三人间', englishName: 'TRIPLE ROOM', location: '校内',
    bed: '三张单人床', service: ICL_ROOM_SERVICE, suitable: '想省住宿费的学生', note: '独立卫浴。',
    highlights: ['独立卫浴'], image: iclRoom('triple-01'),
    gallery: [
      iclRoom('triple-01'), iclRoom('triple-02'), iclRoom('triple-03'), iclRoom('triple-04'),
      iclRoom('triple-05'), iclRoom('triple-06'), iclRoom('triple-desks'),
    ],
    imageAlt: 'ICL校内三人间实景',
  },
  {
    id: 'campus-quad', rateIds: ['campus-quad'], label: '校内四人间', englishName: 'QUAD ROOM', location: '校内',
    bed: '四张单人床', service: ICL_ROOM_SERVICE, suitable: '预算有限、愿意和室友同住的学生', note: '独立卫浴。',
    highlights: ['干湿分离的独立卫浴', '变频冷气和小冰箱'], image: iclRoom('quad-01'),
    gallery: [iclRoom('quad-01'), iclRoom('quad-02'), iclRoom('quad-03'), iclRoom('quad-04'), iclRoom('quad-05')],
    imageAlt: 'ICL校内四人间实景',
  },
  {
    id: 'off-campus-double', rateIds: ['off-campus-double'], label: '校外双人间', englishName: 'OFF-CAMPUS DOUBLE', location: '校外',
    suitable: '两人同行、想住在校外的学生', note: '不参加淡季套餐价，可享思达启航9折。',
    image: iclRoom('offcampus-double-01'),
    gallery: [
      iclRoom('offcampus-double-01'), iclRoom('offcampus-double-02'), iclRoom('offcampus-double-03'),
      iclRoom('offcampus-double-04'), iclRoom('offcampus-bath'),
    ],
    imageAlt: 'ICL校外双人间实景',
  },
  {
    id: 'off-campus-triple', rateIds: ['off-campus-triple'], label: '校外三人间', englishName: 'OFF-CAMPUS TRIPLE', location: '校外',
    suitable: '三人同行、想住在校外的学生', note: '不参加淡季套餐价，可享思达启航9折。',
    image: iclRoom('offcampus-triple-01'),
    gallery: [iclRoom('offcampus-triple-01'), iclRoom('offcampus-triple-02'), iclRoom('offcampus-triple-03'), iclRoom('offcampus-bath')],
    imageAlt: 'ICL校外三人间实景',
  },
];

const ICL_COURSE_GUIDES: CourseDetailGuide[] = [
  {
    icon: 'workspace_premium',
    title: '雅思保分班',
    subtitle: '只能读8周或12周',
    courseIds: ['ielts-guarantee-8', 'ielts-guarantee-12'],
    facts: [
      { label: '课时', value: '每天一对一6节 + 团体课2节' },
      { label: '周数', value: '8周或12周，不能延长或缩短' },
    ],
    points: ['入学分数和保证分数段报名时向学校确认。', '模考无故缺考算2次缺课。'],
  },
  {
    icon: 'school',
    title: '雅思和托业',
    subtitle: '每周模考',
    courseIds: ['ielts', 'toeic'],
    facts: [{ label: '课时', value: '每天一对一4节 + 团体课4节' }],
    points: ['雅思和托业学生每周要参加模考；不能参加须提前告诉学生经理，无故缺考算2次缺课。'],
  },
  {
    icon: 'rule',
    title: '上课规定',
    subtitle: '所有课程',
    facts: [
      { label: '迟到', value: '迟到2次算1次缺课' },
      { label: '缺课', value: '一周（周一至周五）缺课5次，警告1次' },
      { label: '手机', value: '上课时不能用手机' },
    ],
    points: ['课表按入学测试和所选课程安排，具体课时以ICL课表为准。'],
  },
];

const ICL_PRACTICAL_GUIDES: CampusPracticalGuide[] = [
  {
    icon: 'restaurant',
    eyebrow: 'MEALS',
    title: '用餐',
    facts: [
      { label: '三餐', value: '周一至周日都有自助式早餐、午餐和晚餐' },
      { label: '菜色', value: '每餐两道主食、五道配菜、一道汤和两种饮料' },
      { label: '素食', value: '可以提供蛋奶素，入学前要告诉学校' },
      { label: '小卖部', value: '饮料、零食和泡面' },
    ],
    note: '入境和签证材料由思达启航顾问逐项帮你核对；eTravel入境登记也由顾问协助填写。',
  },
  {
    icon: 'local_laundry_service',
    eyebrow: 'SCHOOL SERVICES',
    title: '住宿与学校服务',
    facts: [
      { label: '房间', value: '独立卫浴，变频冷气，房内有小冰箱' },
      { label: '洗衣打扫', value: '每周2次' },
      { label: '前台', value: '每天08:00–22:00有人值班' },
      { label: '安全', value: '24小时警卫和门禁，公共区域有监控' },
    ],
    note: '房间提供个人浴巾。',
  },
  {
    icon: 'sports_esports',
    eyebrow: 'STUDY & FREE TIME',
    title: '自习与休闲',
    facts: [
      { label: '自习室', value: '24小时开放，有团体自习室和个人座位' },
      { label: '视听室', value: '24小时开放，有大电视、Switch和PS5' },
      { label: '健身区', value: '地下室，有重训区和有氧区' },
      { label: '运动', value: '篮球场、羽毛球区、桌球和撞球' },
    ],
    note: '视听室和设施按学校规定的时间和规则使用。',
  },
  {
    icon: 'nights_stay',
    eyebrow: 'NIGHT CLASSES',
    title: '夜间活动课',
    facts: [
      { label: '周一 18:30–19:30', value: '发音课' },
      { label: '周二 18:30–19:30', value: '个人品牌表达课' },
      { label: '周三 18:30–19:30', value: '国际职场口语课' },
      { label: '周五 20:30–21:30', value: '瑜伽（地下室）' },
    ],
    note: '所有ICL学生都可以参加，课程按学校当期安排。',
  },
];

const ICL_CONTENT: IuIclPageContent = {
  text: {
    heroLead: '宿务市中心的独立小校园，步行约5分钟到商场；以口语课程为主，也有雅思保分、托业、儿童青少年和商务英语，40个房间都有独立卫浴。',
    heroTags: [
      { icon: 'location_on', text: '宿务市中心' },
      { icon: 'record_voice_over', text: '口语课程为主' },
      { icon: 'shower', text: '每间独立卫浴' },
      { icon: 'restaurant', text: '每天自助三餐' },
    ],
    advisorText: 'ICL规模不大，教室、宿舍、餐厅和健身区都在同一个独立校园里，60间一对一教室、40个房间，每间都有独立卫浴。学校在宿务市中心，步行约5分钟到商场，生活方便；周一至周日都有自助三餐，自习室和视听室24小时开放。适合想在安静环境里专心练口语、准备雅思或托业的学生。2026/09/01–2027/01/16的淡季套餐价很划算，报价器会自动计算。',
    campusIntro: '独立校园，24小时警卫和门禁；教室、宿舍、餐厅和运动空间按楼层分开。',
    galleryIntro: '按区域查看校园、课堂、宿舍、餐厅和设施；相册内用左右箭头或缩略图切换，点击主图可放大。',
    coursesIntro: '按学习目标分组，每门课下面是每天的课时；点开可看适合谁和课程说明。',
    roomsPhotoIntro: '点选房型查看实景；各房型价格见上方住宿费表。',
    finalCtaTitle: '想确认 ICL 的空房和淡季套餐？',
    finalCtaText: '告诉顾问入学日期、周数、课程和同行的人，我们帮你确认房间并做一份完整报价。',
  },
  quickInfo: [
    { icon: 'location_on', title: '宿务市中心', text: '步行约5分钟到商场' },
    { icon: 'school', title: '60间一对一教室', text: '另有13间团体教室' },
    { icon: 'bed', title: '校内宿舍', text: '40个房间，每间独立卫浴，约120个床位' },
    { icon: 'restaurant', title: '每天三餐', text: '周一至周日都有自助餐' },
    { icon: 'fitness_center', title: '地下室健身区', text: '重训区、有氧区、桌球和撞球' },
    { icon: 'event_available', title: '每周日入住', text: '周六13:00前退房' },
  ],
  overviewFacts: [
    { icon: 'location_on', label: '位置', value: '宿务市中心，步行约5分钟到商场' },
    { icon: 'shield', label: '校园', value: '独立校园，24小时警卫和门禁，公共区域有监控' },
    { icon: 'menu_book', label: '课程', value: 'Power Speaking口语、轻松口语、雅思和雅思保分、托业、儿童青少年和商务英语' },
    { icon: 'school', label: '教室', value: '60间一对一教室、13间团体教室，自习室24小时开放' },
    { icon: 'bed', label: '住宿', value: '校内40个房间，都有独立卫浴，约120个床位；另有校外住宿，也可走读' },
    { icon: 'event', label: '入学', value: '每周日入住，周六13:00前退房' },
  ],
  basicInfo: [
    { label: '学校', value: 'ICL English Academy' },
    { label: '位置', value: '菲律宾宿务市中心' },
    { label: '课程', value: '口语、雅思、托业、儿童青少年和商务英语' },
    { label: '住宿', value: '校内单人间、双人间、三人间、四人间；校外单人间、双人间、三人间；也可走读' },
    { label: '入学', value: '全年开班，每周日入住' },
  ],
  suitableFor: [
    '想在安静的小校园专心学英语的学生',
    '想集中练口语的成人和大学生',
    '准备雅思、托业，或想报雅思保分班的学生',
    '想住独立卫浴房间、周边生活方便的学生',
  ],
  notSuitableFor: [
    '想自己做饭的学生：房间内不能用任何电器做饭',
    '不想被管的学生：迟到、缺课和外出都有规定，3次警告要退学',
  ],
  campusBuildings: [
    { code: '1F', title: '1楼', icon: 'meeting_room', facilities: ['大厅', '自习室和阅读区', '视听室', '学生餐厅'] },
    { code: '2F', title: '2楼', icon: 'school', facilities: ['一对一教室', '团体教室', '教材室'] },
    { code: '3F–5F', title: '宿舍楼层', icon: 'bed', facilities: ['40个房间，每间独立卫浴', '医务室'] },
    { code: 'B1', title: '地下室与户外', icon: 'fitness_center', facilities: ['健身房、桌球、撞球', '电脑教室', '户外篮球场、羽毛球区'] },
  ],
  albumDescriptions: {
    校园: '教学楼、大厅、阅读区和户外空间',
    教室: '一对一和团体课堂',
    住宿: '校内宿舍和校外住宿',
    餐厅: '学生餐厅、自助餐和小卖部',
    设施: '健身房、球场、视听室和自习室',
  },
  gallery: ICL_GALLERY,
  videos: ICL_VIDEOS,
  roomVideoNames: {
    'campus-single': 'icl-single',
    'campus-double': 'icl-double',
    'campus-triple': 'icl-triple',
    'campus-quad': 'icl-quad',
  },
  roomProfiles: ICL_ROOM_PROFILES,
  dormRules: SHARED_RULES,
  scheduleColumns: [],
  scheduleIntro: '',
  courseGroups: [
    {
      icon: 'record_voice_over', title: 'Power Speaking 口语课程', text: '按一对一和团体课的比例选',
      courseIds: ['power-speaking-4', 'power-speaking-6', 'power-speaking-8', 'light-speaking'],
    },
    {
      icon: 'workspace_premium', title: '雅思与托业', text: '保分班只能读8周或12周',
      courseIds: ['ielts-guarantee-8', 'ielts-guarantee-12', 'ielts', 'toeic'],
    },
    { icon: 'child_care', title: '儿童和青少年', text: '年龄要求报名时向学校确认', courseIds: ['kids', 'junior'] },
    { icon: 'business_center', title: '商务英语', text: '职场英语', courseIds: ['business-4', 'business-6'] },
  ],
  courseHighlights: {},
  courseDetailGuides: ICL_COURSE_GUIDES,
  practicalGuides: ICL_PRACTICAL_GUIDES,
  practicalGuideHint: '用餐、住宿服务、自习与休闲、夜间活动课',
  practicalGuideIntro: '出发前和到校后最常问到的安排。',
  faqs: [
    {
      question: 'ICL和IU是什么关系？',
      answer: '两所学校同属一个教育集团，课程和价格体系相近，但校园、宿舍和价格各自独立；本页只介绍ICL。',
    },
    lowSeasonFaq('ICL', 'ICL三人间和四人间的淡季名额2026/11/29起开放，房间有限。'),
    {
      question: '雅思保分班怎么报？',
      answer: '只能读8周或12周整，每天一对一6节、团体课2节；入学分数和保证分数段报名时向学校确认。',
    },
    {
      question: 'ICL适合带孩子来吗？',
      answer: 'ICL有KIDS和JUNIOR课程，年龄要求报名时向学校确认。未满18岁的学生须有监护人陪同、先交外出单才能外出。',
    },
    { question: 'ICL有寒假冬令营吗？', answer: '有。冬令营的日期、课程和价格每年不同，请联系思达启航顾问确认。' },
    ...COMMON_FAQS,
  ],
  ctaBadges: ['免费选校建议', '确认空房和淡季名额', '签证与入境协助'],
};

export const IU_ICL_PAGE_CONTENT: Readonly<Record<IuIclCampus, IuIclPageContent>> = {
  IU: IU_CONTENT,
  ICL: ICL_CONTENT,
};

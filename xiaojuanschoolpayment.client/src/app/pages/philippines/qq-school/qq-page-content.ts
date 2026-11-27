// Text and data of the two CampusTop（快酷英语, formerly QQEnglish）pages, from the school's material received
// 2026-11-26 (student school and course guide, course and textbook guide, pre-departure guide 2026, school and
// dormitory rules, the 2027 meal and companion policy, the notice of 2026-11-23, the 2027 holiday list, the Savoy
// and Treewoods notes and the school's quote system). IT Park（ITP）and Beach Front（BFC）are kept apart: each page
// shows only its own campus. Keep it pure data (no Angular, DOM or storage), so the WeChat mini program can reuse it.
// Never add the school's address, building, phone, e-mail, website, app accounts, QR codes or any agency term
// (commission, agency discounts, agency deadlines). Sources: docs/qq-source-2026-11-26.md.
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
import type { PhAlbumCategory, PhRoomProfile, PhScheduleColumn } from '../school-page/ph-school-profile';
import { SCHOOL_REFERENCE_NOTE } from '../school-page/school-reference-note';
import type { QqCampus } from './qq-pricing';

/** Closes every content section once; the same line as on every Philippine school page. */
export const QQ_REFERENCE_NOTE = SCHOOL_REFERENCE_NOTE;

export interface QqCampusPage {
  shortName: string;
  breadcrumb: string;
  title: string;
  heroLead: string;
  heroTags: ReadonlyArray<{ icon: string; text: string }>;
  advisorText: string;
  campusIntro: string;
  roomsPhotoIntro: string;
  finalCtaTitle: string;
  finalCtaText: string;
  quoteImageHero: string;
  overviewFacts: ReadonlyArray<{ icon: string; label: string; value: string }>;
  quickInfo: ReadonlyArray<{ icon: string; title: string; text: string }>;
  basicInfo: readonly BasicInfoRow[];
  suitableFor: readonly string[];
  notSuitableFor: readonly string[];
  campusBuildings: readonly CampusBuildingCard[];
  galleryImages: readonly GalleryImage[];
  albumCategories: readonly PhAlbumCategory[];
  heroCategories: readonly PhAlbumCategory[];
  scheduleColumns: readonly PhScheduleColumn[];
  roomProfiles: readonly PhRoomProfile[];
  practicalGuides: readonly CampusPracticalGuide[];
  faqs: readonly FaqItem[];
}

/** A video from the school's official YouTube channels; files in assets/campustop/<campus>/videos with poster-<name>.jpg. */
export interface QqVideo {
  name: string;
  title: string;
  description: string;
  duration: string;
  topic: '校园视频' | '学员访谈';
}

/**
 * Official channels: CampusTop Official (formerly QQEnglish), QQEnglish【公式】 and the school's student office QQ English
 * SAO. Each clip's campus was checked from what it shows (IT Park: the white lettered booths and IT Park streets;
 * Beach Front: the Mactan Newtown tower, wooden booths and the lobby sign). Cuts: the IT Park intro's closing card with
 * the school website; 0:40–0:54 of the IT Park day (mall shots with other shops' signs); 0:59.9–1:04.4 of Ryota's
 * video (QR codes on the canteen wall and counter). Left out: a 2024 Beach Front short (expired offer, TikTok profile),
 * a 32-minute Japanese tour (another company's sign with a phone number) and a Japanese interview whose campus is unclear.
 */
export const QQ_VIDEOS: Readonly<Record<QqCampus, readonly QqVideo[]>> = {
  itp: [
    { name: 'campustop-intro', title: 'QQ English 学校介绍', duration: '3:03', topic: '校园视频', description: '学校2024年拍的介绍片：IT Park校区的教室、休息区，老师和管理人员讲学校的教学，以及周边的IT Park。英文原声和字幕。' },
    { name: 'day-in-life', title: 'IT Park校区学生的一天', duration: '2:56', topic: '校园视频', description: '跟着一位学生过一天：IT Park商务区、一对一课、餐厅、太空舱宿舍和休息区。' },
    { name: 'angela-story', title: '中国学员Angela的游学', duration: '2:56', topic: '学员访谈', description: '学校2026年拍的中国学员Angela：在IT Park校区上课、自习、吃饭，讲第一周的感受和学习计划。英文字幕。' },
  ],
  bfc: [
    { name: 'campus-tour-2024', title: 'Beach Front校区导览', duration: '1:08', topic: '校园视频', description: '学校2024年拍的Beach Front校区：附近海边、大楼、大厅、一对一教室、太空舱宿舍、休息区和餐厅。' },
    { name: 'ryota-story', title: '日本学员Ryota在Beach Front', duration: '3:12', topic: '学员访谈', description: '学校学生事务处2025年拍的日本学员：入学、健身房、桌球和乒乓球、餐厅、一对一和小团课、毕业典礼，最后是访谈。英文原声。' },
    { name: 'jenson-story', title: '11岁中国学员Jenson', duration: '1:10', topic: '学员访谈', description: '学校学生事务处2026年拍的武汉11岁学员：一对一课、小团课、课后的桌球和乒乓球，以及餐厅。英文原声和字幕。' },
  ],
};

export const qqVideoSrc = (campus: QqCampus, video: QqVideo) => `/assets/campustop/${campus}/videos/${video.name}.mp4`;
export const qqVideoPoster = (campus: QqCampus, video: QqVideo) => `/assets/campustop/${campus}/videos/poster-${video.name}.jpg`;

export const QQ_ALBUM_DESCRIPTIONS: Record<PhAlbumCategory, string> = {
  校园: '校区大楼、大厅与周边',
  教室: '一对一和小团课教室',
  住宿: '太空舱宿舍与合作酒店',
  餐厅: '学校餐厅',
  设施: '休息区、酒店游泳池和健身房',
};

const itp = (file: string) => `assets/campustop/itp/${file}.webp`;
const bfc = (file: string) => `assets/campustop/bfc/${file}.webp`;

/** Shared course list: five packages; what each class covers is decided by the school after the level test. */
export const QQ_COURSE_GROUPS = [
  { icon: 'person', title: '纯一对一', text: '4–14岁只能报这一组', courseIds: ['one4', 'one6', 'one8'] },
  { icon: 'groups', title: '一对一 + 小团课', text: '小团课只收15岁以上学生', courseIds: ['one4-group2', 'one6-group2'] },
];

export const QQ_COURSE_DETAIL_GUIDES: readonly CourseDetailGuide[] = [
  {
    icon: 'event_available',
    title: '课时怎么约、怎么改',
    subtitle: '所有课程',
    facts: [
      { label: '每节课', value: '50分钟；一对一扣100点，小团课扣20点，学校把课程换成点数放进学生账户' },
      { label: '约课', value: '用学校的学生App约当周的课，可选老师、教材和时段（一般在09:00–18:00之间）' },
      { label: '取消', value: '开课12小时前取消退回全部点数；12小时内、1小时前退回一半；开课前1小时内不退' },
      { label: '下周调课', value: '每周三到排课办公室申请' },
      { label: '小团课', value: '固定时间，上午和下午各一堂，一般最多8人，只收15岁以上学生' },
    ],
    points: [
      '每天的课由学校按分级测试和所选课时安排，教材和老师以学校实际安排为准。',
      '点数用到合约的最后一天，课程结束后第二天失效。',
      '周末和学校停课的假期也可以加课，每天35美元，须向学校预约。',
    ],
  },
  {
    icon: 'child_care',
    title: '孩子和家长',
    subtitle: '4岁起收',
    facts: [
      { label: '4–14岁', value: '只能报一对一课程，不能住太空舱，必须有一位监护人在校陪同' },
      { label: '15–17岁', value: '可以报小团课，可以单独来读；未满18岁要签未成年协议书' },
      { label: '18岁以上', value: '学校不允许陪同人员在校' },
      { label: '家长也上课', value: '家长的课程须和孩子一致或比孩子少，午休时间一致' },
      { label: '陪同人数', value: '淡季最多2名，7–8月旺季最多1名；家长也上课时，旺季不能再有不上课的人陪同' },
    ],
    points: ['学生上课时家长不能停留在教学区；旺季12:00–14:00和17:00–19:00没订餐的人不能进餐厅。'],
  },
];

/** Closed days (no class, not charged) for 2027; other Philippine holidays are normal class days at CampusTop. */
export const QQ_CLOSED_DAYS_2027: HolidayCalendar = {
  year: 2027,
  label: '学校停课、不收课程费的日子',
  months: [
    { month: 1, holidays: [{ day: '1日', name: '元旦' }] },
    { month: 3, holidays: [{ day: '25日', name: '濯足节' }, { day: '26日', name: '耶稣受难日' }] },
    { month: 11, holidays: [{ day: '1日', name: '诸圣节' }] },
    { month: 12, holidays: [{ day: '24日', name: '平安夜' }, { day: '25日', name: '圣诞节' }, { day: '31日', name: '除夕' }] },
  ],
};

const MEAL_ROWS = {
  breakfast: { time: '07:00–09:00', activity: '早餐（学校餐厅）', kind: 'meal' },
  lunch: { time: '11:00–14:00', activity: '午餐，一般排在午休时段', kind: 'meal' },
  dinner: { time: '17:00–19:00', activity: '晚餐', kind: 'meal' },
} as const satisfies Record<string, DailyScheduleRow>;

/** A reference day for 4节一对一 + 2节小团课; students book their own times in the app. */
const scheduleColumns = (eveningGroupDay: string): PhScheduleColumn[] => [
  {
    code: 'MON-FRI',
    title: '周一至周五（参考）',
    rows: [
      MEAL_ROWS.breakfast,
      { time: '09:00–09:50', activity: '一对一（例如口语）', kind: 'class' },
      { time: '10:00–10:50', activity: '小团课（上午固定一堂）', kind: 'class' },
      { time: '11:00–11:50', activity: '一对一（例如语法）', kind: 'class' },
      MEAL_ROWS.lunch,
      { time: '13:00–13:50', activity: '一对一（例如阅读）', kind: 'class' },
      { time: '14:00–14:50', activity: '小团课（下午固定一堂）', kind: 'class' },
      { time: '15:00–15:50', activity: '一对一（例如听力）', kind: 'class' },
      { time: '16:00 起', activity: '自习或自由活动', kind: 'free' },
      MEAL_ROWS.dinner,
      { time: `${eveningGroupDay} 19:00`, activity: '晚间大团体课，自由参加，每周主题不同', kind: 'activity' },
    ],
  },
  {
    code: 'WEEKEND',
    title: '周六和周日',
    rows: [
      { time: '白天', activity: '自由活动；周六可报名学校的出游活动（费用自付）', kind: 'free' },
      { time: '周日 14:00', activity: '羽毛球活动', kind: 'activity' },
      { time: '周末', activity: '想上课可加课，每天35美元', kind: 'class' },
    ],
  },
];

const HEALTH_GUIDE = (doctor: string): CampusPracticalGuide => ({
  icon: 'medical_services',
  eyebrow: 'HEALTH & SAFETY',
  title: '看病与安全',
  facts: [
    { label: '医务室', value: `护士周一至周五09:00–18:00；医生${doctor} 13:00–15:00` },
    { label: '就医', value: '严重时学校联系家长并送医院，看病和车费由学生自付' },
    { label: '门禁', value: '进出校区和宿舍要带学生证；孩子不能独自外出' },
    { label: '保险', value: '建议出发前买境外留学或旅行保险' },
  ],
  note: '校内和宿舍禁止吸烟、饮酒；违反校规会收到警告信，严重的退学。',
});

const ARRIVAL_GUIDE: CampusPracticalGuide = {
  icon: 'flight_land',
  eyebrow: 'BEFORE YOU GO',
  title: '报名、入学与出发前准备',
  facts: [
    { label: '报名', value: '入学前7天内学校不再接受报名；学费须在入学前至少两周付清' },
    { label: '入学', value: '周日入住，周一开课；第一天护照交学校办理SSP（约1–3周）' },
    { label: '接机', value: '每人30美元，开课当天或前一天，送到学校或校区附近的酒店、公寓' },
    { label: '入境', value: '入境前72小时内填写eTravel；带好签证、往返机票和住宿订单的纸质复印件' },
    { label: '学生App', value: '出发前装好学校的学生App，课表、约课和换课都在App上；家长也能在App看孩子上课' },
  ],
  note: '入境和签证材料由思达启航顾问逐项帮你核对。',
};

const SERVICE_FACTS = {
  wifi: { label: '网络', value: '校内有Wi-Fi，人多时可能变慢；建议买当地电话卡' },
  laundry: (text: string) => ({ label: '洗衣', value: text }),
};

// Campus photos are frames of the school's official YouTube videos (1080p): IT Park from "a ONE DAY in the life of a
// student" (CampusTop Official, 2024-02), Beach Front from the Beach Front tour (QQEnglish【公式】, 2024-08). Each
// campus's frames come only from that campus's video. Hotel photos are from the school's Baidu pan library.
const ITP_GALLERY: GalleryImage[] = [
  { category: '校园', title: '校区前台', description: 'IT Park校区的前台和办公区。', src: itp('front-office') },
  { category: '校园', title: 'IT Park商务区', description: '校区所在的IT Park，周边是写字楼、商场和餐厅。', src: itp('it-park') },
  { category: '教室', title: '一对一教室', description: '一排排一对一隔间，上课用电脑看电子教材。', src: itp('classrooms') },
  { category: '教室', title: '一对一上课', description: '老师和学生在隔间里一对一上课。', src: itp('one-to-one') },
  { category: '设施', title: '休息区', description: '靠窗的休息和自习座位。', src: itp('lounge') },
  { category: '设施', title: '钢琴休息区', description: '校内的休息区。', src: itp('piano-lounge') },
  { category: '设施', title: '木质休息区', description: '下课后休息、看书的地方。', src: itp('study-area') },
  { category: '住宿', title: '太空舱宿舍', description: 'IT Park校区的太空舱床位，只收15岁以上学生。', src: itp('capsule') },
  { category: '住宿', title: '太空舱走廊', description: '太空舱宿舍的走廊，上下两层床位。', src: itp('capsule-hall') },
  { category: '住宿', title: 'Treewoods酒店', description: 'IT Park校区的合作酒店，步行到校约7–10分钟。', src: itp('treewoods-building') },
  { category: '住宿', title: 'Treewoods客房', description: '房间分配以酒店实际安排为准。', src: itp('treewoods-room') },
  { category: '住宿', title: 'Treewoods客房', description: '每间最多2人，需要单人床请提前说明。', src: itp('treewoods-room-2') },
  { category: '住宿', title: 'Treewoods客房', description: '房内有冰箱、微波炉、电磁炉和吹风机。', src: itp('treewoods-room-3') },
  { category: '住宿', title: '小厨房', description: '冰箱、微波炉和饮水机。', src: itp('treewoods-kitchenette') },
  { category: '住宿', title: '浴室', description: '房内独立浴室。', src: itp('treewoods-bathroom') },
  { category: '设施', title: '酒店游泳池', description: 'Treewoods酒店的游泳池，一般06:00–22:00开放，周一清洁关闭；未成年须监护人陪同。', src: itp('treewoods-pool') },
  { category: '设施', title: '酒店健身房', description: 'Treewoods住客刷房卡进入。', src: itp('treewoods-gym') },
  { category: '设施', title: '酒店洗衣房', description: '自助洗衣，每次最多5公斤，约180–200比索。', src: itp('treewoods-laundry') },
];

const BFC_GALLERY: GalleryImage[] = [
  { category: '校园', title: 'Beach Front校区大楼', description: '校区在Mactan Newtown的一栋14层大楼里。', src: bfc('campus-tower') },
  { category: '校园', title: 'Mactan Newtown海边', description: '学校官方视频里的校区附近海边航拍。', src: bfc('beach-aerial') },
  { category: '校园', title: '一楼大厅', description: '24小时保安查证件，进出要带学生证。', src: bfc('lobby') },
  { category: '校园', title: '一楼前台', description: '前台咨询处。', src: bfc('front-desk') },
  { category: '教室', title: '一对一教室', description: '木质一对一隔间，上课用电脑看电子教材。', src: bfc('classrooms') },
  { category: '教室', title: '一对一上课', description: '老师和学生在隔间里一对一上课。', src: bfc('one-to-one') },
  { category: '住宿', title: '太空舱宿舍', description: 'Beach Front校区的太空舱床位，只收15岁以上学生。', src: bfc('capsule') },
  { category: '住宿', title: '太空舱走廊', description: '太空舱宿舍的走廊，上下两层床位。', src: bfc('capsule-hall') },
  { category: '住宿', title: 'Savoy酒店客房', description: '离校约50米；房间分配以酒店实际安排为准。', src: bfc('savoy-room-double') },
  { category: '住宿', title: 'Savoy酒店客房', description: '两张床的客房。', src: bfc('savoy-room-twin') },
  { category: '住宿', title: '书桌与热水壶', description: '客房内的书桌和咖啡机。', src: bfc('savoy-desk') },
  { category: '住宿', title: '衣柜', description: '客房衣柜。', src: bfc('savoy-wardrobe') },
  { category: '住宿', title: '浴室', description: '淋浴间。', src: bfc('savoy-shower') },
  { category: '餐厅', title: '学校餐厅', description: '一日三餐自助，需订餐。', src: bfc('canteen') },
  { category: '餐厅', title: '学校餐厅', description: '餐厅也用来办活动和毕业典礼。', src: bfc('canteen-2') },
  { category: '设施', title: '休息区', description: '校内的休息和自习区。', src: bfc('lounge') },
  { category: '设施', title: 'Savoy酒店游泳池', description: 'Savoy住客可免费使用游泳池和健身房。', src: bfc('savoy-pool') },
  { category: '设施', title: 'Savoy酒店健身房', description: 'Savoy住客免费使用。', src: bfc('savoy-gym') },
];

const ITP_PAGE: QqCampusPage = {
  shortName: 'QQ English IT Park校区',
  breadcrumb: '菲律宾游学 / 宿务学校 / QQ English IT Park校区',
  title: '菲律宾宿务 QQ English IT Park校区',
  heroLead: 'QQ English 2009年成立，IT Park校区在宿务市的IT Park商务区，周边是商场、餐厅和夜市。课程全部按“每天几节一对一”选，4岁起收，可以带孩子一起来；住学校的太空舱宿舍或步行约7–10分钟的Treewoods酒店。',
  heroTags: [
    { icon: 'location_on', text: '宿务市 IT Park' },
    { icon: 'person', text: '每天4–8节一对一' },
    { icon: 'family_restroom', text: '4岁起收' },
    { icon: 'event_available', text: 'App自由约课' },
  ],
  advisorText: 'IT Park校区在城市商务区里，下课后吃饭、购物都方便，适合想边学边体验城市生活的成人，和带孩子来读一对一的家庭。课程只有“每天几节一对一（可加2节小团课）”的组合，老师和时段在App上自己约，比较灵活；没有斯巴达式的晚自习管理，需要自己安排学习。4–14岁只能上一对一，要有家长陪同，住合作酒店。',
  campusIntro: '校区在IT Park商务区的写字楼里，有一对一教室、小团课教室和自习室；住宿是学校的太空舱宿舍（15岁以上）或合作的Treewoods酒店。',
  roomsPhotoIntro: '点选房型查看实景；各房型价格见上方住宿费表。',
  finalCtaTitle: '想确认 QQ English IT Park校区的空房和课程？',
  finalCtaText: '告诉顾问入学日期、周数、每天几节一对一和住宿；带孩子来的请说明孩子年龄和陪同人数，我们帮你向学校确认并做一份完整报价。',
  quoteImageHero: '/assets/campustop/itp/front-office.webp',
  overviewFacts: [
    { icon: 'location_on', label: '位置', value: '宿务市IT Park商务区，步行可到商场、餐厅和夜市' },
    { icon: 'menu_book', label: '课程', value: '每天4、6或8节一对一，可加2节小团课；每节50分钟' },
    { icon: 'event_available', label: '约课', value: '在学生App约老师、教材和时段，当周可改' },
    { icon: 'cake', label: '年龄', value: '4岁起收；4–14岁只上一对一，须有监护人陪同' },
    { icon: 'bed', label: '住宿', value: '太空舱宿舍（15岁以上）、Treewoods酒店，也可以走读' },
    { icon: 'restaurant', label: '餐食', value: '学校餐厅三餐另付；2027年起必须订餐' },
  ],
  quickInfo: [
    { icon: 'person', title: '一对一为主', text: '每天4、6或8节一对一' },
    { icon: 'event_available', title: '自己约课', text: '老师、教材、时段在App上选' },
    { icon: 'family_restroom', title: '可带孩子', text: '4岁起收，家长可陪读或同上课' },
    { icon: 'location_city', title: '城市商务区', text: '下课吃饭购物方便' },
  ],
  basicInfo: [
    { label: '学校', value: 'QQ English IT Park校区' },
    { label: '创立', value: '2009年' },
    { label: '位置', value: '菲律宾宿务市IT Park' },
    { label: '管理方式', value: '自律型，没有强制晚自习' },
    { label: '课程', value: '一对一为主，可加小团课' },
    { label: '住宿', value: '太空舱宿舍、Treewoods酒店' },
  ],
  suitableFor: ['想多上一对一、自己安排时间的成人', '带4岁以上孩子来读书的家庭', '想下课后体验城市生活的学生'],
  notSuitableFor: ['需要学校严格管理、强制晚自习的学生', '想读雅思或托福备考课程的学生（请咨询顾问其他学校）'],
  campusBuildings: [
    { code: 'CLASS', title: '教学区', icon: 'school', facilities: ['一对一教室（上课用电脑看电子教材）', '小团课教室', '自习室'] },
    { code: 'DORM', title: '住宿', icon: 'bed', facilities: ['太空舱宿舍（15岁以上）', 'Treewoods酒店（步行约7–10分钟）'] },
    { code: 'FOOD', title: '餐厅', icon: 'restaurant', facilities: ['学校餐厅一日三餐（需订餐）', 'IT Park内有许多餐厅'] },
    { code: 'SPORT', title: '运动', icon: 'fitness_center', facilities: ['合作健身房和游泳池（在校内领健身券）'] },
  ],
  galleryImages: ITP_GALLERY,
  albumCategories: ['校园', '教室', '住宿', '设施'],
  heroCategories: ['校园', '教室', '住宿'],
  scheduleColumns: scheduleColumns('周二'),
  roomProfiles: [
    {
      id: 'capsule', rateIds: ['capsule'], label: '太空舱宿舍', location: '校内', bed: '单人床位（上下两层）',
      service: '按学校宿舍规定', suitable: '15岁以上、预算优先、想住得离教室近的学生',
      note: '按人收费；只收15岁以上学生；另付宿舍电费每晚110比索。床位分配以学校安排为准。',
      image: itp('capsule'), gallery: [itp('capsule'), itp('capsule-hall')], imageAlt: 'QQ English IT Park校区太空舱宿舍',
    },
    {
      id: 'treewood', rateIds: ['treewood'], label: 'Treewoods酒店客房', location: '校外', bed: '默认一张双人床，需要单人床请提前说明',
      service: '每周换床单和打扫；额外打扫另付', suitable: '带孩子来的家庭、想要独立房间和小厨房的学生',
      note: '按间收费，每间最多2人；含水电；加床每天25美元。入住15:00后，退房12:00前。',
      image: itp('treewoods-room'),
      gallery: [itp('treewoods-room'), itp('treewoods-room-2'), itp('treewoods-room-3'), itp('treewoods-kitchenette'), itp('treewoods-bathroom')],
      imageAlt: 'QQ English IT Park校区合作酒店Treewoods客房',
    },
  ],
  practicalGuides: [
    {
      icon: 'restaurant',
      eyebrow: 'MEALS & SERVICES',
      title: '用餐、洗衣与网络',
      facts: [
        { label: '学校餐厅', value: '一日三餐自助，从第一个上课日到最后一个上课日；不能按天单独购买' },
        SERVICE_FACTS.laundry('平日08:00–10:00把衣物交到宿舍柜台，每次5公斤内200比索，1–2天后取'),
        SERVICE_FACTS.wifi,
        { label: '健身', value: '合作健身房和游泳池，在校内领健身券' },
      ],
      note: '以上是学校的一般安排，以学校实际安排为准。',
    },
    {
      icon: 'celebration',
      eyebrow: 'ACTIVITIES',
      title: '每周活动',
      facts: [
        { label: '周二 19:00', value: '晚间大团体课，每周主题不同，自由参加' },
        { label: '周三 18:30', value: '语言交换餐会，约700比索' },
        { label: '周六', value: '跳岛游等出游活动，自愿报名，费用自付' },
        { label: '周日 14:00', value: '羽毛球活动' },
        { label: '毕业典礼', value: '每周二和周五18:10，约半小时' },
      ],
      note: '活动按学校当期安排，可能调整或取消。',
    },
    HEALTH_GUIDE('周一、三、五'),
    ARRIVAL_GUIDE,
  ],
  faqs: [
    { question: 'IT Park校区和Beach Front校区有什么不同？', answer: 'IT Park校区在宿务市的商务区，周边商场餐厅多，住宿是太空舱宿舍或步行约7–10分钟的Treewoods酒店。Beach Front校区在麦克坦岛的Mactan Newtown，离机场约15–20分钟车程，住宿是太空舱宿舍或离校约50米的Savoy酒店。课程和课程价格两个校区一样，但分开报价、分开收费。' },
    { question: '课程费怎么算？', answer: '学校按实际上课天数收费：4周20个上课日，4节一对一是784美元；读3–7周和8周以上每天的单价不同，学校停课的假期（如圣诞、元旦、复活节前的周四周五）不上课也不收费；其他菲律宾公众假期照常上课，每天另收35美元。报价器会按你的日期自动算。' },
    { question: '孩子可以来吗？', answer: '4岁起收。4–14岁只能报一对一课程，不能住太空舱宿舍，必须有一位监护人在校陪同；陪同家长可以不上课，也可以一起报名上课。15–17岁可以单独来读。' },
    { question: '可以不住学校安排的住宿吗？', answer: '可以走读：自己安排住宿，每天到校上课，不收住宿费。2027年起餐食照样必须订，到校学杂费照常；太空舱电费只有住太空舱的学生收。接机只送到学校或校区附近的酒店、公寓。' },
    { question: '一定要订餐吗？', answer: '2027年1月1日起，所有学生（含不上课的陪同家长）都必须订学校的三餐；7/11–8/14旺季，不上课家长陪同的15岁以下孩子和陪同家长不能订餐。2026年12月31日（含）前提交报名的，2027年入学仍可按2026年规则不订餐。' },
    { question: '到校学杂费大概多少？', answer: '30天签证读4周：SSP 12,000比索、学生证420比索；住太空舱另付电费每晚110比索。读5–8周要续签一次7,230比索；停留59天以上另付ACR I-Card 4,000比索。教材按实际课程约1,000–2,000比索。报价器会按你的周数和签证算出明细。' },
    { question: '页面上的报价包含全部费用吗？', answer: '学校费用包含注册费、课程费、住宿费、餐费和接机（如选）；到校学杂费单独列出，教材另外准备。两者分开显示，不相加。' },
    { question: '思达启航会协助签证和入境吗？', answer: '会。通过思达启航报名，顾问会免费协助菲律宾入境和签证相关手续，你只需要按顾问指引准备个人资料。' },
  ],
};

const BFC_PAGE: QqCampusPage = {
  shortName: 'QQ English Beach Front校区',
  breadcrumb: '菲律宾游学 / 宿务学校 / QQ English Beach Front校区',
  title: '菲律宾宿务 QQ English Beach Front校区',
  heroLead: 'QQ English 2009年成立，Beach Front校区（BFC）在麦克坦岛的Mactan Newtown，离宿务国际机场约15–20分钟车程。教学、宿舍、餐厅都在同一栋大楼；课程按“每天几节一对一”选，4岁起收，可以带孩子来；住学校的太空舱宿舍或离校约50米的Savoy酒店。',
  heroTags: [
    { icon: 'location_on', text: '麦克坦 Mactan Newtown' },
    { icon: 'person', text: '每天4–8节一对一' },
    { icon: 'family_restroom', text: '4岁起收' },
    { icon: 'beach_access', text: '海边新城' },
  ],
  advisorText: 'Beach Front校区在海边的Mactan Newtown，离机场近，教学、住宿、餐饮在同一栋楼，适合想边学英语边度假的家庭和成人。课程只有“每天几节一对一（可加2节小团课）”的组合，在App上自己约老师和时段，比较灵活；没有斯巴达式管理，需要自己安排学习。4–14岁只能上一对一，要有家长陪同，住Savoy酒店。',
  campusIntro: '校区在Mactan Newtown的一栋14层大楼里，集教学、住宿、餐饮和休闲于一体；4、5楼是教学区，太空舱宿舍在大楼内（15岁以上）。合作的Savoy酒店离校约50米。',
  roomsPhotoIntro: '点选房型查看实景；各房型价格见上方住宿费表。',
  finalCtaTitle: '想确认 QQ English Beach Front校区的空房和课程？',
  finalCtaText: '告诉顾问入学日期、周数、每天几节一对一和住宿；带孩子来的请说明孩子年龄和陪同人数，我们帮你向学校确认并做一份完整报价。',
  quoteImageHero: '/assets/campustop/bfc/campus-tower.webp',
  overviewFacts: [
    { icon: 'location_on', label: '位置', value: '麦克坦岛Mactan Newtown，离宿务国际机场约15–20分钟车程' },
    { icon: 'menu_book', label: '课程', value: '每天4、6或8节一对一，可加2节小团课；每节50分钟' },
    { icon: 'event_available', label: '约课', value: '在学生App约老师、教材和时段，当周可改' },
    { icon: 'cake', label: '年龄', value: '4岁起收；4–14岁只上一对一，须有监护人陪同' },
    { icon: 'bed', label: '住宿', value: '太空舱宿舍（15岁以上）、Savoy酒店标准间或高级套房，也可以走读' },
    { icon: 'restaurant', label: '餐食', value: '学校餐厅三餐另付；2027年起必须订餐' },
  ],
  quickInfo: [
    { icon: 'person', title: '一对一为主', text: '每天4、6或8节一对一' },
    { icon: 'apartment', title: '一栋楼搞定', text: '教学、宿舍、餐厅在同一栋楼' },
    { icon: 'family_restroom', title: '可带孩子', text: '4岁起收，家长可陪读或同上课' },
    { icon: 'beach_access', title: '海边新城', text: '离机场约15–20分钟车程' },
  ],
  basicInfo: [
    { label: '学校', value: 'QQ English Beach Front校区' },
    { label: '创立', value: '2009年' },
    { label: '位置', value: '菲律宾宿务麦克坦岛Mactan Newtown' },
    { label: '管理方式', value: '自律型，没有强制晚自习；午夜12点至早上5点门禁' },
    { label: '课程', value: '一对一为主，可加小团课' },
    { label: '住宿', value: '太空舱宿舍、Savoy酒店' },
  ],
  suitableFor: ['想边学英语边度假的家庭和成人', '带4岁以上孩子来读一对一的家庭', '想多上一对一、自己安排时间的学生'],
  notSuitableFor: ['需要学校严格管理、强制晚自习的学生', '想住在城市商圈的学生（请看IT Park校区）'],
  campusBuildings: [
    { code: 'CLASS', title: '教学区（4、5楼）', icon: 'school', facilities: ['一对一教室（上课用电脑看电子教材）', '小团课教室', '自习室和电话间'] },
    { code: 'DORM', title: '住宿', icon: 'bed', facilities: ['太空舱宿舍（15岁以上）', 'Savoy酒店（离校约50米）'] },
    { code: 'FOOD', title: '餐厅', icon: 'restaurant', facilities: ['学校餐厅一日三餐自助（需订餐）'] },
    { code: 'SAFE', title: '安全', icon: 'shield', facilities: ['一楼大厅24小时保安查证件', '午夜12点至早上5点门禁', '未成年须有成人陪同才能出校'] },
  ],
  galleryImages: BFC_GALLERY,
  albumCategories: ['校园', '教室', '住宿', '餐厅', '设施'],
  heroCategories: ['校园', '住宿', '教室'],
  scheduleColumns: scheduleColumns('周四'),
  roomProfiles: [
    {
      id: 'capsule', rateIds: ['capsule'], label: '太空舱宿舍', location: '校内', bed: '单人床位（上下两层）',
      service: '按学校宿舍规定', suitable: '15岁以上、预算优先、想住得离教室近的学生',
      note: '按人收费；只收15岁以上学生；另付宿舍电费每晚110比索。床位分配以学校安排为准。',
      image: bfc('capsule'), gallery: [bfc('capsule'), bfc('capsule-hall')], imageAlt: 'QQ English Beach Front校区太空舱宿舍',
    },
    {
      id: 'savoy', rateIds: ['savoy-standard', 'savoy-suite'], label: 'Savoy酒店（标准间／高级套房）', location: '校外',
      service: '每周换床单两次；客房服务应要求提供', suitable: '带孩子来的家庭、想住酒店的学生',
      note: '按间收费，标准间和高级套房价格不同（见住宿费表）；住客可免费使用游泳池、健身房和Mactan Newtown海滩。房型以预订为准，照片仅示意客房。',
      image: bfc('savoy-room-double'),
      gallery: [bfc('savoy-room-double'), bfc('savoy-room-twin'), bfc('savoy-desk'), bfc('savoy-wardrobe'), bfc('savoy-shower')],
      imageAlt: 'QQ English Beach Front校区合作酒店Savoy客房',
    },
  ],
  practicalGuides: [
    {
      icon: 'restaurant',
      eyebrow: 'MEALS & SERVICES',
      title: '用餐、洗衣与网络',
      facts: [
        { label: '学校餐厅', value: '一般早餐07:00–09:00，午餐11:00–14:00，晚餐17:00–19:00；不能按天单独购买' },
        SERVICE_FACTS.laundry('3楼洗衣服务，每次5公斤内200比索，上午送洗一般当天下午可取'),
        SERVICE_FACTS.wifi,
        { label: '门禁', value: '一楼24小时保安，午夜12点至早上5点门禁' },
      ],
      note: '以上是学校的一般安排，以学校实际安排为准。',
    },
    {
      icon: 'celebration',
      eyebrow: 'ACTIVITIES',
      title: '每周活动',
      facts: [
        { label: '周一 18:10', value: '新生欢迎会' },
        { label: '周四 19:00', value: '晚间大团体课，每周主题不同，自由参加' },
        { label: '周六', value: '跳岛游等出游活动，自愿报名，费用自付' },
        { label: '周日 14:00', value: '羽毛球活动' },
        { label: '毕业典礼', value: '每周五18:10，约半小时' },
      ],
      note: '活动按学校当期安排，可能调整或取消。',
    },
    HEALTH_GUIDE('周一至周六'),
    ARRIVAL_GUIDE,
  ],
  faqs: [
    { question: 'Beach Front校区和IT Park校区有什么不同？', answer: 'Beach Front校区在麦克坦岛的Mactan Newtown，离机场约15–20分钟车程，教学、宿舍、餐厅在同一栋楼，合作的Savoy酒店离校约50米。IT Park校区在宿务市的商务区，住宿是太空舱宿舍或Treewoods酒店。课程和课程价格两个校区一样，但分开报价、分开收费。' },
    { question: '课程费怎么算？', answer: '学校按实际上课天数收费：4周20个上课日，4节一对一是784美元；读3–7周和8周以上每天的单价不同，学校停课的假期（如圣诞、元旦、复活节前的周四周五）不上课也不收费；其他菲律宾公众假期照常上课，每天另收35美元。报价器会按你的日期自动算。' },
    { question: 'Savoy酒店多少钱？', answer: '按间按晚收费：标准间每晚55美元，1、7、8、12月60美元；高级套房每晚130美元，1、7、8、12月135美元；8月7–9日和12月31日每晚另有更高价格。周日入住、周六退房，4周共27晚。报价器会按你的日期算。' },
    { question: '孩子可以来吗？', answer: '4岁起收。4–14岁只能报一对一课程，不能住太空舱宿舍，必须有一位监护人在校陪同；陪同家长可以不上课，也可以一起报名上课。15–17岁可以单独来读。' },
    { question: '可以不住学校安排的住宿吗？', answer: '可以走读：自己安排住宿，每天到校上课，不收住宿费。2027年起餐食照样必须订，到校学杂费照常；太空舱电费只有住太空舱的学生收。接机只送到学校或校区附近的酒店、公寓。' },
    { question: '一定要订餐吗？', answer: '2027年1月1日起，所有学生（含不上课的陪同家长）都必须订学校的三餐；7/11–8/14旺季，不上课家长陪同的15岁以下孩子和陪同家长不能订餐。2026年12月31日（含）前提交报名的，2027年入学仍可按2026年规则不订餐。' },
    { question: '页面上的报价包含全部费用吗？', answer: '学校费用包含注册费、课程费、住宿费、餐费和接机（如选）；到校学杂费单独列出，教材另外准备。两者分开显示，不相加。' },
    { question: '思达启航会协助签证和入境吗？', answer: '会。通过思达启航报名，顾问会免费协助菲律宾入境和签证相关手续，你只需要按顾问指引准备个人资料。' },
  ],
};

export const QQ_PAGE_CONTENT: Readonly<Record<QqCampus, QqCampusPage>> = { itp: ITP_PAGE, bfc: BFC_PAGE };

export const QQ_FINAL_CTA_BADGES = ['免费选校建议', '确认空房和开课日', '签证与入境协助'];

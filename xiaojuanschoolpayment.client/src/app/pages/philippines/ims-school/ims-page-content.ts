// Text and data of the IMS Academy page, from IMS's IMS-CHINA Drive pack received 2026-11-25 (2026 Chinese brochure,
// stay-in and walk-in regulations, the 2026-07-01 local-fee sheet, the 2026-09-30 offer sheet, the 2026-11-19 notice on
// the 2+2 offer, the 2027 calendar, the 2026 Christmas class notice, the 2027 winter camp poster, photos and videos).
// The shared Philippine school template reads this module through ims-page-profile.ts. Keep it pure data (no Angular,
// DOM or storage), so the WeChat mini program can reuse it. Never add the school's address, phone, website or social
// accounts, its nationality list, the pre-entry cancellation rules, or any agency rule (refunds to the agency account,
// extensions only through the first agency, the penalty for sharing agency discounts).
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
import type { PhOfferCard, PhRoomProfile, PhVideoItem } from '../school-page/ph-school-profile';
import { SCHOOL_REFERENCE_NOTE } from '../school-page/school-reference-note';
import {
  IMS_CLASS_EXCHANGE_RULE_ID,
  IMS_LONG_STAY_RULE_ID,
  IMS_LOW_SEASON_RULE_ID,
  IMS_SIDA_RULE_ID,
  IMS_TWO_PLUS_TWO_RULE_ID,
  IMS_TWO_PLUS_TWO_TASKS,
} from './ims-content-config';

/** Closes every content section once; the same line as on every Philippine school page. */
export const IMS_REFERENCE_NOTE = SCHOOL_REFERENCE_NOTE;

export const IMS_PAGE_TEXT = {
  heroLead: 'IMS 2013年开办，在宿务市Banilad的Maria Luisa别墅区，步行几分钟就到商场和度假村。课程以一对一为主，ESL每天4–9节一对一可选，另有口语、商务、雅思、托业、托福、SAT、TESOL和亲子课程；校内有游泳池和24小时自习室。',
  advisorText: 'IMS 在宿务市区的别墅区里，环境安静，步行4分钟到Streetscape购物中心，周边餐厅、超市和健身房都很方便。课程以一对一为主，同一类课可以按每天想上几节一对一来选，适合想按自己节奏学的成人。管理不算斯巴达：平日下课后可以外出，23:00关楼门；5楼教学区只说英语。雅思和托业有保分班，读满12周送1次官方考试。带7–14岁孩子来的家长读家长课程，孩子读少儿课程。',
  campusIntro: '一栋教学和宿舍合在一起的大楼：1楼是大堂和行政办公室，5楼是教学区和教学办公室，6楼是学生餐厅、厨房和洗衣房；楼外有游泳池。',
  galleryIntro: '按区域查看校园、教室、住宿、餐厅和设施；相册内用左右箭头或缩略图切换，点击主图可放大。',
  coursesIntro: '按学习目标分组，每门课下面是每天的课时；点开可看适合人群和说明。每节课45分钟，课间休息10分钟。',
  roomsPhotoIntro: '点选房型查看实景；每间宿舍有一台空调和独立电表。',
  finalCtaTitle: '想确认 IMS 的空房、优惠和2+2活动？',
  finalCtaText: '告诉顾问你的入学日期、周数、课程和想住的房型，我们帮你确认空房和能用的优惠，并做一份完整报价。',
} as const;

export const IMS_QUICK_INFO = [
  { icon: 'location_on', title: '宿务市Banilad', text: 'Maria Luisa别墅区，步行4分钟到购物中心' },
  { icon: 'record_voice_over', title: '一对一为主', text: 'ESL每天4–9节一对一，按需要选' },
  { icon: 'workspace_premium', title: '雅思和托业保分', text: '读满12周送1次官方考试' },
  { icon: 'family_restroom', title: '亲子课程', text: '家长和7–14岁孩子一起读' },
  { icon: 'pool', title: '校内泳池', text: '另有24小时自习室和自助厨房' },
  { icon: 'schedule', title: '下课后可外出', text: '平日17:30–23:00，周末05:00–23:00' },
];

/** Key facts under the hero title (compact layout); what each floor has is in IMS_CAMPUS_FLOORS. */
export const IMS_OVERVIEW_FACTS: ReadonlyArray<{ icon: string; label: string; value: string }> = [
  { icon: 'location_on', label: '位置', value: '宿务市Banilad的Maria Luisa别墅区；步行4分钟到Streetscape购物中心，3分钟到Asmara城市度假村' },
  { icon: 'rule', label: '管理', value: '平日05:00–07:30和17:30–23:00、周末05:00–23:00可以外出；23:00关楼门；5楼教学区只说英语' },
  { icon: 'menu_book', label: '课程', value: 'ESL、口语、商务、雅思、托业、托福、SAT、TESOL和亲子课程' },
  { icon: 'apartment', label: '规模', value: '2013年开办，可住153人，180个上课座位' },
  { icon: 'schedule', label: '课时', value: '每节45分钟，课间休息10分钟；周一至周五上课，早课和晚课周一至周四' },
  { icon: 'bed', label: '住宿', value: '校内单人间到四人间，每天三餐（含周末）；也可以走读' },
];

export const IMS_BASIC_INFO: BasicInfoRow[] = [
  { label: '学校', value: 'IMS Academy' },
  { label: '开办', value: '2013年' },
  { label: '位置', value: '菲律宾宿务市Banilad' },
  { label: '管理方式', value: '平日下课后可以外出，23:00门禁' },
  { label: '课程', value: 'ESL、口语、商务、雅思、托业、托福、SAT、TESOL、亲子课程' },
  { label: '住宿', value: '校内单人间、双人间、三人间、四人间；也可以走读' },
  { label: '入学', value: '周日入住、周一开课，每4周为一期' },
];

export const IMS_SUITABLE_FOR = [
  '想多上一对一、按自己节奏学的成人',
  '准备雅思、托业、托福或SAT考试的学生',
  '带7–14岁孩子来读书的家长',
  '50岁以上、想学日常英语的学员',
];

export const IMS_NOT_SUITABLE_FOR = [
  '需要学校严格管着、平日完全不外出的学生',
  '未满19岁、想自己外宿或晚归的学生',
];

/** What each floor has (stay-in regulation and 2026 brochure); shown as the campus strip in the hero. */
export const IMS_CAMPUS_FLOORS: CampusBuildingCard[] = [
  { code: '1F', title: '1楼', icon: 'apartment', facilities: ['大堂和行政办公室', '领教材、毕业结算'] },
  { code: '5F', title: '5楼', icon: 'school', facilities: ['教学区，只说英语', '教学办公室（换课、换老师）'] },
  { code: '6F', title: '6楼', icon: 'restaurant', facilities: ['学生餐厅和厨房', '洗衣房'] },
  { code: 'MORE', title: '其他设施', icon: 'pool', facilities: ['游泳池', '24小时自习室', '一对一、小组和亲子教室', '自助烹饪区'] },
];

const campus = (file: string) => `assets/ims/campus/${file}.webp`;
const rooms = (file: string) => `assets/ims/rooms/${file}.webp`;
export const IMS_QUOTE_IMAGE_HERO = '/assets/ims/campus/building.webp';

export const IMS_GALLERY_IMAGES: GalleryImage[] = [
  { category: '校园', title: 'IMS 校园', description: '教学楼和楼前的游泳池。', src: campus('building') },
  { category: '校园', title: '一楼大堂', description: '办手续、领教材和毕业结算都在1楼。', src: campus('lobby') },
  { category: '校园', title: '教学区休息室', description: '下课后休息、看书的地方。', src: campus('lounge-01') },
  { category: '校园', title: '教学区休息室', description: '书架和休息座位。', src: campus('lounge-02') },
  { category: '校园', title: '教学区休息室', description: '休息室的另一侧。', src: campus('lounge-03') },
  { category: '教室', title: '一对一教室', description: '每节课45分钟。', src: campus('one-to-one-01') },
  { category: '教室', title: '一对一教室', description: '一位老师对一位学生。', src: campus('one-to-one-02') },
  { category: '教室', title: '一对一教室', description: '一对一上课。', src: campus('one-to-one-03') },
  { category: '教室', title: '一对一教室', description: '一对一上课。', src: campus('one-to-one-04') },
  { category: '教室', title: '一对一教室', description: '一对一上课。', src: campus('one-to-one-05') },
  { category: '教室', title: '一对一教室', description: '一对一上课。', src: campus('one-to-one-06') },
  { category: '教室', title: '小组课', description: '小组课上讨论和练习口语。', src: campus('group-01') },
  { category: '教室', title: '小组课', description: '小组课。', src: campus('group-02') },
  { category: '教室', title: '小组课', description: '小组课。', src: campus('group-03') },
  { category: '教室', title: '小组课', description: '小组课。', src: campus('group-04') },
  { category: '教室', title: '小组课', description: '小组课。', src: campus('group-05') },
  { category: '教室', title: '亲子教室', description: '孩子上一对一课的隔间教室。', src: campus('family-class-01') },
  { category: '教室', title: '亲子教室', description: '亲子教室。', src: campus('family-class-02') },
  { category: '教室', title: '亲子教室', description: '亲子教室。', src: campus('family-class-03') },
  { category: '住宿', title: '单人间', description: '一人一间。', src: rooms('single-01') },
  { category: '住宿', title: '双人间', description: '两人一间。', src: rooms('double-01') },
  { category: '住宿', title: '三人间', description: '三人一间。', src: rooms('triple-01') },
  { category: '住宿', title: '三人间', description: '三人一间。', src: rooms('triple-02') },
  { category: '住宿', title: '四人间', description: '四人一间。', src: rooms('quad-01') },
  { category: '住宿', title: '四人间', description: '四人一间。', src: rooms('quad-02') },
  { category: '住宿', title: '四人间', description: '四人一间。', src: rooms('quad-03') },
  { category: '住宿', title: '宿舍卫生间', description: '宿舍卫生间。', src: rooms('bathroom-01') },
  { category: '住宿', title: '宿舍卫生间', description: '宿舍卫生间。', src: rooms('bathroom-02') },
  { category: '餐厅', title: '学生餐厅', description: '每天三餐，周末也有。', src: campus('dining-01') },
  { category: '餐厅', title: '学生餐厅', description: '6楼学生餐厅。', src: campus('dining-02') },
  { category: '餐厅', title: '学生餐厅', description: '用餐区。', src: campus('dining-03') },
  { category: '餐厅', title: '自助烹饪区', description: '可以自己做饭；外卖也在这里吃。', src: campus('kitchen') },
  { category: '设施', title: '游泳池', description: '楼前的游泳池。', src: campus('pool-day') },
  { category: '设施', title: '泳池派对', description: '学校在泳池办的派对。', src: campus('pool-night-01') },
  { category: '设施', title: '泳池派对', description: '泳池派对。', src: campus('pool-night-02') },
  { category: '设施', title: '泳池派对', description: '泳池派对。', src: campus('pool-night-03') },
  { category: '设施', title: '24小时自习室', description: '全天开放，23:00后也可以来。', src: campus('study-01') },
  { category: '设施', title: '24小时自习室', description: '自习室。', src: campus('study-02') },
  { category: '设施', title: '24小时自习室', description: '自习室。', src: campus('study-03') },
  { category: '设施', title: '24小时自习室', description: '自习室。', src: campus('study-04') },
  { category: '设施', title: '24小时自习室', description: '自习室。', src: campus('study-05') },
];

export const IMS_ALBUM_DESCRIPTIONS = {
  校园: '教学楼、大堂和休息室',
  教室: '一对一教室、小组课和亲子教室',
  住宿: '单人间、双人间、三人间、四人间和卫生间',
  餐厅: '学生餐厅与自助烹饪区',
  设施: '游泳池与24小时自习室',
} as const;

const video = (name: string) => `/assets/ims/videos/${name}.mp4`;
const poster = (name: string) => `/assets/ims/videos/${name}-poster.jpg`;

/**
 * IMS's own clips (Drive pack 2026-11-25), 720p H.264 in public/assets/ims/videos/. The school film was cut before
 * its airport opening (another company's adverts), the flags and student counter, the score wall and its sign-off; the
 * pool-party clip ends before the school's website; the presentation clip lost a student's name caption. The student
 * manager's pickup video was not used (shop and advert signs at the airport). On 2026-11-25 the school film also lost
 * its study-room shot, whose wall shows the flag of the Taiwan authorities, and its ESL/IELTS/ETS TOEIC logo card.
 *
 * From IMS's official YouTube channel (@IMSAcademy, 2025–2026 uploads, user request 2026-11-25): three student
 * interviews and the Senior ESL class. The Korean interview and the Vietnamese ESL interview end before the website card;
 * the ESL interview's classroom shot under the flag row has a gray mosaic over the flags, and its sentence listing
 * "Chinese, Taiwan" among countries (with flag stickers) was cut. The Senior ESL clip keeps only its title card, group
 * class and one-to-one class: its class tables (other class counts than the 2026 price list) and every shot of a door
 * with an unknown logo sign were left out. Promo films repeating the school film, camp videos, the Ayala-campus and
 * pre-2024 uploads, a city-tour clip full of shop signs and the Working Holiday talk (Vietnamese subtitles) were not used.
 */
export const IMS_CAMPUS_VIDEOS: readonly PhVideoItem[] = [
  { title: '校园宣传片', text: '学校拍的校园、课堂和泳池。', src: video('campus-film'), poster: poster('campus-film'), duration: '1:12', shape: 'wide' },
  { title: '泳池派对', text: '学校在泳池办的派对。', src: video('pool-party'), poster: poster('pool-party'), duration: '0:59', shape: 'wide' },
];

export const IMS_INTERVIEW_VIDEOS: readonly PhVideoItem[] = [
  { title: '雅思学员访谈（韩国）', text: '读雅思8周的韩国学员，聊口语进步、老师、自习室和泳池（英文字幕）。', src: video('student-ielts-korea'), poster: poster('student-ielts-korea'), duration: '1:58', shape: 'wide' },
  { title: 'ESL学员访谈（越南）', text: '读Premium ESL 4周的越南学员，聊老师、各国同学和在学校的生活（英文字幕）。', src: video('student-esl-vietnam'), poster: poster('student-esl-vietnam'), duration: '2:56', shape: 'tall' },
  { title: '雅思学员访谈（越南）', text: '在IMS读雅思的越南学员，聊老师、课堂和一起学习的同学（英文字幕）。', src: video('student-ielts-vietnam'), poster: poster('student-ielts-vietnam'), duration: '1:31', shape: 'wide' },
];

export const IMS_COURSE_VIDEOS: readonly PhVideoItem[] = [
  { title: '商务英语课堂展示', text: '商务英语学生上台做汇报。', src: video('business-presentation'), poster: poster('business-presentation'), duration: '0:36', shape: 'wide' },
  { title: '口语课演讲', text: 'Power Speaking 学生的演讲课。', src: video('power-speaking'), poster: poster('power-speaking'), duration: '0:56', shape: 'tall' },
  { title: 'Senior ESL课堂', text: 'Senior ESL（50岁以上）的小组课角色扮演和一对一课。', src: video('senior-esl-class'), poster: poster('senior-esl-class'), duration: '0:57', shape: 'wide' },
];

const ROOM_SERVICE = '每周最多2次打扫（扫码预约），每周3次免费洗衣';
const ROOM_HIGHLIGHTS = ['一台空调，独立电表', '每天三餐，周末也有'];
const numbered = (prefix: string, count: number) => Array.from({ length: count }, (_, index) => rooms(`${prefix}-${String(index + 1).padStart(2, '0')}`));

/** Photos only from IMS's own room folders, each matching its room type. */
export const IMS_ROOM_PROFILES: PhRoomProfile[] = [
  {
    id: 'single', rateIds: ['single'], label: '单人间', location: '校内', bed: '一张单人床', service: ROOM_SERVICE,
    suitable: '想有自己空间、安静学习的学生', note: '一人一间，数量少，需尽早确认。',
    highlights: ROOM_HIGHLIGHTS, image: rooms('single-01'), gallery: numbered('single', 1), imageAlt: 'IMS单人间实景',
  },
  {
    id: 'double', rateIds: ['double'], label: '双人间', location: '校内', bed: '两张单人床', service: ROOM_SERVICE,
    suitable: '朋友或家人同行的学生', note: '两人一间。',
    highlights: ROOM_HIGHLIGHTS, image: rooms('double-01'), gallery: numbered('double', 1), imageAlt: 'IMS双人间实景',
  },
  {
    id: 'triple', rateIds: ['triple'], label: '三人间', location: '校内', bed: '三张单人床', service: ROOM_SERVICE,
    suitable: '想兼顾预算的学生', note: '三人一间。',
    highlights: ROOM_HIGHLIGHTS, image: rooms('triple-01'), gallery: numbered('triple', 2), imageAlt: 'IMS三人间实景',
  },
  {
    id: 'quadruple', rateIds: ['quadruple'], label: '四人间', location: '校内', bed: '四张单人床', service: ROOM_SERVICE,
    suitable: '预算优先、喜欢热闹的学生', note: 'IMS最省钱的房型。',
    highlights: ROOM_HIGHLIGHTS, image: rooms('quad-01'), gallery: numbered('quad', 3), imageAlt: 'IMS四人间实景',
  },
];

export const IMS_DORM_RULES = [
  { title: '外出', text: '平日05:00–07:30和17:30–23:00、周末和假日05:00–23:00可以外出；出校门时把学生证交给门卫。' },
  { title: '熄灯关门', text: '23:00公共区域熄灯、大楼关门；之后只能在自己房间或自习室。' },
  { title: '外宿', text: '只在周末和假日，满19岁并提前交外宿申请表。' },
  { title: '未满19岁', text: '外出须有家长同意书，任何时候最晚22:00回校，不能外宿。' },
  { title: '外卖', text: '22:00前下单，只能在6楼餐厅或自助烹饪区吃，23:00前吃完。' },
  { title: '禁止事项', text: '校内禁止喝酒、吸烟和在房间煮食，禁止赌博；不能进入其他学生的房间，进入异性宿舍楼层会被开除。' },
  { title: '空调电费', text: '每度30比索，退房时同房间的人平摊，从押金扣除。' },
  { title: '赔偿', text: '丢失房门钥匙500比索；损坏设施照价赔偿，从押金扣除。' },
  { title: '处罚', text: '违反规定会记警告，警告每4周清零；累计3次警告可能被开除。' },
];

/** The weekday timetable of the 2026 brochure; which classes a student has depends on the course. */
export const IMS_SCHEDULE: DailyScheduleRow[] = [
  { time: '07:00–07:45', activity: '早课（部分课程，周一至周四）', kind: 'class' },
  { time: '07:30–08:30', activity: '早餐', kind: 'meal' },
  { time: '08:30–09:15', activity: '第1节', kind: 'class' },
  { time: '09:25–10:10', activity: '第2节', kind: 'class' },
  { time: '10:20–11:05', activity: '第3节', kind: 'class' },
  { time: '11:15–12:00', activity: '第4节', kind: 'class' },
  { time: '12:00–13:00', activity: '午餐', kind: 'meal' },
  { time: '13:00–13:45', activity: '第5节', kind: 'class' },
  { time: '13:55–14:40', activity: '第6节', kind: 'class' },
  { time: '14:50–15:35', activity: '第7节', kind: 'class' },
  { time: '15:45–16:30', activity: '第8节', kind: 'class' },
  { time: '16:40–17:25', activity: '第9节：自习、模考复盘、TESOL试讲或托福／SAT课', kind: 'activity' },
  { time: '17:30–19:00', activity: '晚餐', kind: 'meal' },
  { time: '18:30–20:20', activity: '晚课：ESL晚课或模考技能练习（周一至周四）', kind: 'class' },
];

const GUARANTEE_RULES = [
  { label: '条件', value: '出勤率95%以上，模考全部参加' },
  { label: '失去资格', value: '模考两次低于上一次成绩，或收到2次警告；开课后不能换课程' },
  { label: '没到目标分', value: '条件都满足但没到目标分，可以免学费继续上课直到达标，住宿费自付' },
];

export const IMS_COURSE_DETAIL_GUIDES: CourseDetailGuide[] = [
  {
    icon: 'workspace_premium',
    title: '雅思保分班怎么读',
    subtitle: '读12、16、20或24周，入学雅思4.0',
    courseIds: ['ielts-guarantee'],
    facts: [
      { label: '目标分', value: '5.0–7.0分，按入学成绩定' },
      { label: '官方考试', value: '读12周送1次官方雅思考试，读24周送2次' },
      { label: '开课', value: '按宿务官方雅思考试日期往前排，报名时顾问帮你确认开课日' },
      ...GUARANTEE_RULES,
    ],
    points: [],
  },
  {
    icon: 'workspace_premium',
    title: '托业保分班怎么读',
    subtitle: '读12、16、20或24周',
    courseIds: ['toeic-guarantee'],
    facts: [
      { label: '目标分', value: '600、700、800或900分，入学分别要400、500、650、800分' },
      { label: '官方考试', value: '读12周送1次官方托业考试，读24周送2次' },
      ...GUARANTEE_RULES,
    ],
    points: [],
  },
  {
    icon: 'school',
    title: '托福和SAT',
    subtitle: '按目标分选班',
    courseIds: ['pre-toefl', 'intensive-toefl', 'sat'],
    facts: [
      { label: '托福预备班', value: '目标42–71分（B1），所有级别可报' },
      { label: '强化托福班', value: '目标72–94分（B2），入学须达到IMS 4级，至少读4周' },
      { label: 'SAT', value: '入学须达到IMS 4级，至少读4周；第9节和晚上另有SAT课' },
    ],
    points: [],
  },
  {
    icon: 'cast_for_education',
    title: 'TESOL 学什么',
    subtitle: '20岁以上，至少读4周',
    courseIds: ['mommy-tesol', 'tesol-light'],
    facts: [
      { label: '父母TESOL', value: '用《Mom and Dad are the Best English Teacher》：儿童怎样学语言、用儿歌和游戏练听说、设计15–20分钟的亲子课、角色扮演试讲' },
      { label: '轻量TESOL', value: '用《Streamlined Essentials for Future Teachers》：教学法、设计50分钟的课程方案、学生评估与课堂管理、试讲；入学须达到IMS 4级' },
    ],
    points: [],
  },
  {
    icon: 'family_restroom',
    title: '亲子课程怎么报',
    subtitle: '家长和7–14岁孩子一起读',
    courseIds: ['parents-esl', 'junior-esl-6', 'junior-esl-8', 'junior-esl-9'],
    facts: [
      { label: '家长', value: '陪孩子来的家长须报Parents ESL（每天3节一对一 + 1节小组课），20岁以上' },
      { label: '孩子', value: '7–14岁读Junior ESL，每天6、8或9节一对一' },
      { label: '转课', value: '家长的3节一对一可转给读Junior ESL 6的孩子，孩子每天最多9节；小组课不能转，学费不变' },
      { label: '团体游戏', value: '演讲、讲故事、绘本阅读、游戏和手工' },
      { label: '晚间看护', value: '17:30–20:30家长外出时，菲律宾老师免费照看孩子；课程表写晚间看护只在旺季提供，报名时请顾问向学校确认' },
    ],
    points: [],
  },
  {
    icon: 'rule',
    title: '分级、测试与换课',
    subtitle: '所有课程',
    facts: [
      { label: '分级', value: 'IMS共12个级别，入学后按英语水平测试（EPT）分班，对应欧洲语言共同参考框架（CEFR）' },
      { label: '进度测试', value: '按课程每周或每4周一次' },
      { label: '换课、换老师', value: '每2周可换一次：周五前到5楼教学办公室申请，有空位时下周一生效' },
      { label: '迟到', value: '迟到15分钟以上算旷课；老师迟到或缺课会补课' },
      { label: '教材', value: '入学第一周内可以换，之后不退换' },
      { label: '结业证书', value: '出勤率90%以上' },
      { label: '假期', value: '菲律宾法定假日停课，不补课也不退费' },
    ],
    points: [],
  },
  {
    icon: 'child_care',
    title: '未成年学生',
    subtitle: '15–17岁单独来读',
    facts: [
      { label: '可读课程', value: '15岁以上可读大部分成人课程；托业口语、OPIc、TESOL和家长课程须20岁以上，Senior ESL须50岁以上' },
      { label: '外出', value: '须有家长同意书，最晚22:00回校，不能外宿' },
      { label: '监护服务', value: '可选，每4周450美元，只在淡季（1、6、7、8月以外）提供' },
      { label: '国际学生管理服务', value: '可选，每4周2,100美元；服务内容请顾问向学校确认' },
    ],
    points: [],
  },
];

export const IMS_PRACTICAL_GUIDES: CampusPracticalGuide[] = [
  {
    icon: 'restaurant',
    eyebrow: 'MEALS & HOURS',
    title: '用餐与开放时间',
    facts: [
      { label: '早餐', value: '平日07:30–08:30，周末08:00–09:00' },
      { label: '午餐和晚餐', value: '午餐12:00–13:00，晚餐17:30–19:00' },
      { label: '教室', value: '08:30–17:30，有早课时07:00起' },
      { label: '自习室', value: '24小时开放' },
    ],
    note: '每天三餐，周末也有；时间以学校通知为准。',
  },
  {
    icon: 'cleaning_services',
    eyebrow: 'SCHOOL SERVICES',
    title: '打扫、洗衣与生活服务',
    facts: [
      { label: '打扫', value: '每间宿舍每周最多2次，扫码预约' },
      { label: '洗衣', value: '每周最多3次免费：男生周一、三、五，女生周二、四、六，送到6楼洗衣房' },
      { label: '报修', value: '填报修单，24小时内处理' },
      { label: '邮件包裹', value: '办公室代收代寄，小额服务费毕业时一起结算' },
      { label: 'Wi-Fi', value: '校内免费' },
      { label: '储物柜和打印', value: '储物柜押金2,000比索，每4周500比索；打印每页20比索' },
    ],
    note: '贵重衣物和贴身衣物建议自己手洗。',
  },
  {
    icon: 'badge',
    eyebrow: 'VISA & HEALTH',
    title: '签证、护照与看病',
    facts: [
      { label: '护照', value: '第一天说明会后交行政办公室，学校统一办SSP和签证续签' },
      { label: '出境旅行', value: '学习期间出境再入境，签证要从头重新办' },
      { label: '看病', value: '可到学校的合作医院看病；紧急情况可以申请学校车辆送医' },
      { label: '保险', value: '出发前在国内买好旅行保险，到期续保由学生自己负责' },
    ],
    note: '入境和签证材料由思达启航顾问逐项帮你核对；eTravel入境登记也由顾问协助填写。',
  },
  {
    icon: 'event',
    eyebrow: 'CHECK-IN & CHECK-OUT',
    title: '入住、离校与接送机',
    facts: [
      { label: '入住', value: '周日' },
      { label: '退房', value: '周六11:00前，不含午餐' },
      { label: '延住', value: '课程结束后每晚1,000比索（含餐），须提前申请' },
      { label: '毕业结算', value: '毕业当天16:30–17:30到1楼办公室结算押金、领回护照，交还钥匙和毛巾；只在工作日办理，周末离校的学生要提前结算' },
      { label: '接送机', value: '接机每人1,000比索；读完课程并填写反馈的学生，学校免费送机' },
      { label: '延长课程', value: '至少提前2周申请并付清，要看有没有空床' },
    ],
    note: '机票按周日到校、周六离校来订。',
  },
];

/** Refund rules after arrival from IMS's 2026 regulation, plus 思达启航's own deposit rule (same wording on every page). */
export const IMS_REFUND_COPY = {
  summaryTitle: 'IMS 取消与退款规定',
  summaryHint: '报名定金、到校后退款和其他费用',
  eyebrow: 'CANCELLATION & REFUND',
  title: 'IMS 取消与退款规定',
  intro: '注册费不退；到校后，读完总课程一半以前申请，剩下的课程费和住宿费退一半。',
  alert: '报名前请确认',
  groups: [
    {
      title: '报名与入学前',
      note: '',
      rules: [
        { when: '报名定金', text: '通过思达启航报名时预收定金2,000元人民币，为学生向学校订位；定金交了以后不退。' },
        { when: '改期与保留', text: '入学4周前告诉顾问，可以免费改入学日期，或申请把定金保留1年。' },
      ],
      footnote: '',
    },
    {
      title: '到校以后',
      note: '课程开始日按抵达宿务的日期算。',
      rules: [
        { when: '读完一半以前', text: '剩下的课程费和住宿费退50%。' },
        { when: '读完一半以后', text: '不退。' },
        { when: '剩下不足4周', text: '不退。' },
        { when: '晚到和缺课', text: '不补课，也不退。' },
        { when: '被学校开除', text: '不退。' },
        { when: '享受过优惠', text: '退款按原价重新计算，要补回优惠的差额。' },
      ],
      footnote: '',
    },
    {
      title: '其他费用',
      note: '',
      rules: [
        { when: '注册费', text: '不退。' },
        { when: '签证费', text: '还没办理续签的部分可以退。' },
        { when: 'SSP', text: '课程开始后不退。' },
        { when: '接机费', text: '至少提前一天取消可以退。' },
        { when: '休学', text: '学校认定有特殊情况才可以，至少4周，最长6个月；剩下的课程6个月后作废。' },
      ],
      footnote: IMS_REFERENCE_NOTE,
    },
  ],
};

/** Weekday holidays of IMS's 2027 calendar; the Saturday holidays (Feb 6, Mar 27, May 1, Jun 12, Aug 21, Dec 25) are left out. */
export const IMS_HOLIDAY_CALENDARS: HolidayCalendar[] = [
  {
    year: 2027,
    label: '规划2027年入学时优先查看',
    months: [
      { month: 1, holidays: [{ day: '1日', name: '元旦' }] },
      { month: 2, holidays: [{ day: '24日', name: '宿务市宪章日' }] },
      { month: 3, holidays: [{ day: '25日', name: '濯足节' }, { day: '26日', name: '耶稣受难日' }] },
      { month: 4, holidays: [{ day: '9日', name: '勇士日' }] },
      { month: 8, holidays: [{ day: '6日', name: '宿务省宪章日' }, { day: '30日', name: '国家英雄日' }] },
      { month: 9, holidays: [{ day: '9日', name: '奥斯梅尼亚纪念日' }] },
      { month: 11, holidays: [{ day: '1日', name: '万圣节' }, { day: '2日', name: '万灵节' }, { day: '30日', name: '博尼法西奥纪念日' }] },
      {
        month: 12,
        holidays: [
          { day: '8日', name: '圣母无染原罪节' }, { day: '24日', name: '平安夜' }, { day: '30日', name: '黎刹纪念日' }, { day: '31日', name: '除夕' },
        ],
      },
    ],
  },
];

export const IMS_HOLIDAY_FOOTNOTE = '只列周一至周五的假日；政府临时加的假日也停课，不补课也不退费。';

/**
 * Study weeks of 2027 that never count as off-season for the 2+2 and 300-dollar offers (January and June–August), as
 * the calculator counts them: a Sunday–Saturday week belongs to the month of its Wednesday. IMS charges no peak surcharge.
 */
export const IMS_PEAK_RANGES_2027 = [
  { start: '2027-01-03', end: '2027-01-30', label: '1月' },
  { start: '2027-05-30', end: '2027-08-28', label: '6–8月' },
];

export const IMS_OFFERS: PhOfferCard[] = [
  {
    icon: 'percent', title: '思达启航优惠', amount: '95折',
    text: '课程费和住宿费95折；参加2+2的前4周不再打折。注册费100美元每位学生都交，老学员也一样。',
    promotionIds: [IMS_SIDA_RULE_ID],
  },
  {
    icon: 'campaign', title: '2+2达人活动', amount: '前4周只付2周',
    text: '淡季（1、6、7、8月以外）读4周以上可以报：前4周只付2周的课程费和住宿费，每人只能用一次。不想参加的学生按淡季优惠减免。',
    detail: IMS_TWO_PLUS_TWO_TASKS.join(' · '),
    promotionIds: [IMS_TWO_PLUS_TWO_RULE_ID],
  },
  {
    icon: 'eco', title: '淡季优惠', amount: '每4周减300美元',
    text: '读4周以上，淡季的课程周每满4周减300美元，不满4周的淡季周每周减75美元；1、6、7、8月不减，参加2+2的那4周也不减。',
    promotionIds: [IMS_LOW_SEASON_RULE_ID],
  },
  {
    icon: 'calendar_month', title: '长期优惠', amount: '最高减400美元',
    text: '全年适用，按付费课程周数一次减免（2+2的4周算2周）。',
    detail: '8周减50 · 12周100 · 16周200 · 20周300 · 24周400美元',
    promotionIds: [IMS_LONG_STAY_RULE_ID],
  },
  {
    icon: 'swap_horiz', title: '小组课换一对一', amount: '2节换1节',
    text: '2026/12/31前和2027/02/01–05/30上课期间，2节小组课可以换1节一对一，学费不变。',
    until: '2027-05-31', promotionIds: [IMS_CLASS_EXCHANGE_RULE_ID],
  },
];

export const IMS_FAQS: FaqItem[] = [
  { question: 'IMS 管得严吗？', answer: '不算斯巴达。平日05:00–07:30和下课后17:30–23:00可以外出，周末和假日05:00–23:00；23:00关楼门。5楼教学区只说英语。未满19岁的学生外出要有家长同意书，最晚22:00回校。' },
  { question: '每天上几节课？', answer: '看课程：Essential ESL 4、5、6每天4–6节一对一；Premium ESL每天4节一对一加4节小组课；Intensive ESL每天6节一对一加3节小组课。每节45分钟。雅思和托业课程的晚课和自习必须参加。' },
  { question: '2+2达人活动怎么参加？', answer: `淡季（1、6、7、8月以外）读4周以上可以报，前4周只付2周的课程费和住宿费，每人只能用一次。要求：${IMS_TWO_PLUS_TWO_TASKS.join('；')}。图文和视频里可以不露脸；不想参加的学生按淡季优惠每4周减300美元。参加2+2的4周不打思达启航95折。` },
  { question: '现在报名有什么优惠？', answer: '课程费和住宿费95折；淡季（1、6、7、8月以外）课程每满4周减300美元，或前4周参加2+2只付2周；读8周以上再按付费周数减50–400美元。报价器会按你的日期自动计算。注册费100美元每位学生都交，老学员也一样。' },
  { question: '可以带孩子一起来吗？', answer: '可以。7–14岁的孩子读Junior ESL，陪同的家长须报Parents ESL；家长的3节一对一可以转给读Junior ESL 6的孩子。17:30–20:30家长外出时，学校老师可以免费照看孩子。' },
  { question: '雅思保分班怎么报？', answer: '入学须达到雅思4.0，可读12、16、20或24周，读12周送1次官方雅思考试、24周送2次。出勤率95%以上、模考全部参加，没到目标分可以免学费继续上课，住宿费自付。托业保分班规则相同。' },
  { question: '到校学杂费大概多少？', answer: '按30天签证读4周、住校，约20,300比索（SSP、E-CARD、教材、学生证、水电和空调费）；另交宿舍押金3,000比索，接机每人1,000比索。读得越久，签证续签和每周费用越多，报价器会按你的周数和签证算出明细。' },
  { question: '2026年底圣诞节怎么上课？', answer: '12月24、30、31日上午上4节特别课（写作、阅读、听力、口语各1节，08:30–12:00），下午不上课；想参加的学生12月18日前到教学办公室报名。12月25日和1月1日停课。', until: '2027-01-01' },
  { question: '2027年寒假有青少年营吗？', answer: '有。2027年1月17日至2月4日，3周，7–15岁，住四星级的One Tectona酒店，每个房间有一位菲律宾老师同住。费用是整包价，包含课程、住宿、三餐和零食、教材、活动、校服、洗衣、接送机、水电和SSP；机票、签证、续签、未成年人入境费、零花钱和保险另付。名额有限，不在下方报价器里计算，请联系顾问。', until: '2027-01-10' },
  { question: '页面上的报价包含全部费用吗？', answer: '学校费用包含注册费、课程费和住宿费，并自动扣除优惠；到校学杂费单独列出，押金、接送机和可选服务另外准备。两者分开显示，不相加。' },
  { question: '思达启航会协助签证和入境吗？', answer: '会。通过思达启航报名，顾问会免费协助菲律宾入境和签证相关手续，你只需要按顾问指引准备个人资料。' },
];

export const IMS_FINAL_CTA_BADGES = ['免费选校建议', '确认空房和优惠', '签证与入境协助'];

// Text and data of the two English Fella pages, from the school's 2026 pack received 2026-11-25 (2026 Chinese
// brochure, both campus orientations and the agency orientation of 2026-10-02, the 2026 price and local-fee sheets,
// the Christmas offer and the 2027 holiday poster). First Campus (Fella1) and Second Campus (Fella2) are kept apart:
// each page shows only its own campus. The shared Philippine school template reads this module through
// fella-page-profile.ts. Keep it pure data (no Angular, DOM or storage), so the WeChat mini program can reuse it.
// Never add the school's address, phone, LINE or social accounts, website, Wi-Fi details, staff names, QR codes or
// any agency term (commission, partner discount rules, cancellation penalties before arrival).
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
import type { PhAlbumCategory, PhRoomProfile, PhScheduleColumn, PhStudyMode } from '../school-page/ph-school-profile';
import { SCHOOL_REFERENCE_NOTE } from '../school-page/school-reference-note';
import type { FellaCampus } from './fella-pricing';

/** Closes every content section once; the same line as on every Philippine school page. */
export const FELLA_REFERENCE_NOTE = SCHOOL_REFERENCE_NOTE;

export interface FellaCampusPage {
  shortName: string;
  breadcrumb: string;
  title: string;
  heroLead: string;
  heroTags: ReadonlyArray<{ icon: string; text: string }>;
  advisorText: string;
  campusIntro: string;
  coursesIntro: string;
  courseDetailHint: string;
  scheduleIntro: string;
  scheduleBadge: string;
  scheduleNote?: string;
  studyModesTitle: string;
  studyModesIntro: string;
  studyModesNote?: string;
  roomsPhotoIntro: string;
  compareRoomHint: string;
  compareCourseHint: string;
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
  courseGroups: ReadonlyArray<{ icon: string; title: string; text: string; courseIds: readonly string[] }>;
  courseHighlights: Readonly<Record<string, { badge: string }>>;
  courseDetailGuides: readonly CourseDetailGuide[];
  scheduleColumns: readonly PhScheduleColumn[];
  studyModes: readonly PhStudyMode[];
  roomProfiles: readonly PhRoomProfile[];
  dormRules: ReadonlyArray<{ title: string; text: string }>;
  practicalGuides: readonly CampusPracticalGuide[];
  faqs: readonly FaqItem[];
}

const f1 = (file: string) => `assets/fella-1/campus/${file}.webp`;
const f2 = (file: string) => `assets/fella-2/campus/${file}.webp`;
const shared = (file: string) => `assets/fella/${file}.webp`;

export const FELLA_ALBUM_DESCRIPTIONS: Record<PhAlbumCategory, string> = {
  校园: '校门、主楼与校园',
  教室: '小组教室、自习室与电脑教室',
  住宿: '宿舍房型',
  餐厅: '学生餐厅与Cafella小卖部',
  设施: '游泳池、健身房与运动场',
};

/** Both campuses: Sunday arrival, Saturday departure; a room deposit and the pickup are paid at school. */
const ARRIVAL_GUIDE: CampusPracticalGuide = {
  icon: 'flight_land',
  eyebrow: 'BEFORE YOU GO',
  title: '入学、离校与出发前准备',
  facts: [
    { label: '入学', value: '周日入住，周一入学说明会和分级测试后开课' },
    { label: '离校', value: '课程结束后的周六12:00前退房' },
    { label: '提前入住', value: '周五14:00至周六06:00入住加2,000比索，周六06:00–14:00入住加1,000比索' },
    { label: '延后退房', value: '每晚2,000比索，须提前申请' },
    { label: '接机', value: '宿务机场接机每人1,000比索，到校后付；亲子课程的家庭成员享7折' },
    { label: '家人探访', value: '访客住校每晚3,000比索，最多2晚' },
  ],
  note: '入境和签证材料由思达启航顾问逐项帮你核对；eTravel入境登记也由顾问协助填写。',
};

const SERVICE_GUIDE: CampusPracticalGuide = {
  icon: 'cleaning_services',
  eyebrow: 'SCHOOL SERVICES',
  title: '打扫、洗衣与看病',
  facts: [
    { label: '打扫', value: '每周打扫2次，每周换床单和枕套1次；毯子可在学生系统申请更换' },
    { label: '洗衣', value: '自助洗衣房24小时开放，免费提供洗衣粉' },
    { label: '看病', value: '护士08:00–17:00在校，医生每周到校5次' },
    { label: '报修', value: '在学生系统填写报修申请，维修08:00–16:00' },
  ],
  note: '学杂费在入学当周周一缴纳，请准备比索现金。',
};

const MEALS = { weekday: '早餐06:50–08:00，午餐11:30–13:00，晚餐17:50–19:00', weekend: '早餐07:50–09:00，午餐11:50–13:00，晚餐17:50–19:00' };

/** Class rows shared by Fella1's weekday columns (the orientation's PIC-4 level-2 adult example). */
const FIRST_CLASS_ROWS: DailyScheduleRow[] = [
  { time: '07:00–08:00', activity: '早餐', kind: 'meal' },
  { time: '08:00–08:50', activity: '一对一（语法）', kind: 'class' },
  { time: '09:00–09:50', activity: '一对一（口语）', kind: 'class' },
  { time: '10:00–10:50', activity: '一对一（听力）', kind: 'class' },
  { time: '11:00–11:50', activity: '一对一（阅读）', kind: 'class' },
  { time: '12:00–12:50', activity: '午餐', kind: 'meal' },
  { time: '13:00–13:50', activity: '四人小组课（口语／听力）', kind: 'class' },
  { time: '14:00–14:50', activity: '四人小组课（口语／听力）', kind: 'class' },
  { time: '15:00–15:50', activity: '八人小组课（句型）', kind: 'class' },
  { time: '16:00–16:50', activity: '空堂或选修课', kind: 'free' },
];

const FIRST_GALLERY: GalleryImage[] = [
  { category: '校园', title: '第一校区主楼', description: '第一校区是斯巴达校区，2006年开办。', src: f1('main-building') },
  { category: '校园', title: '学校接驳车', description: '学校自己的接驳车。', src: f1('van') },
  { category: '教室', title: '小组课', description: '四人和八人小组课。', src: f1('group-class') },
  { category: '教室', title: '自习室', description: '24小时开放，每人有固定座位。', src: f1('study-room') },
  { category: '教室', title: '影视教室', description: '电影选修课在这里上。', src: f1('theatre') },
  { category: '住宿', title: '单人雅房 1B', description: '一人一间卧室，和邻房共用客厅和卫生间。', src: 'assets/fella-1/rooms/single-1b.webp' },
  { category: '餐厅', title: '学生餐厅', description: '一年365天供应一日三餐，有素食和清真餐。', src: f1('cafeteria') },
  { category: '餐厅', title: 'Cafella小卖部', description: '咖啡、饮料、零食、电话卡和日用品。', src: f1('cafe') },
  { category: '设施', title: '游泳池', description: '水深1.5米；平日15:00–22:50，周末和假日09:00–22:50开放。', src: f1('pool') },
  { category: '设施', title: '室内健身房', description: '2023年9月启用，05:00–22:50开放。', src: f1('gym') },
];

const SECOND_GALLERY: GalleryImage[] = [
  { category: '校园', title: '第二校区入口', description: '第二校区2008年开办，约5,000坪。', src: f2('entrance') },
  { category: '教室', title: '自习室', description: '24小时开放，每人有固定座位。', src: f2('study-hall') },
  { category: '教室', title: '电脑教室', description: '校内也是IDP机考雅思考场。', src: f2('computer') },
  { category: '教室', title: '儿童课', description: '亲子课程的孩子在第二校区上课。', src: shared('classroom-2') },
  { category: '餐厅', title: 'Cafella小卖部', description: '平日07:00–21:00，周末和假日08:00–17:00。', src: f2('shop') },
  { category: '设施', title: '游泳池', description: '宿舍楼围着的游泳池。', src: f2('pool') },
  { category: '设施', title: '健身房', description: '有器械和自由重量区。', src: f2('gym') },
  { category: '设施', title: '室内运动馆', description: '2024年11月启用，可以打篮球、羽毛球、匹克球和乒乓球。', src: shared('sports-1') },
  { category: '设施', title: '户外篮球场', description: '17:00–22:50开放。', src: f2('basketball') },
  { category: '设施', title: '匹克球', description: '运动馆里可以打匹克球。', src: f2('pickleball') },
  { category: '设施', title: '自助洗衣房', description: '24小时开放，免费提供洗衣粉。', src: f2('laundry') },
];

const WARNING_RULE = { title: '警告上限', text: '可累计的警告次数是就读周数的一半（8周4次、12周6次）；达到上限禁止外出，超过上限退学且不退款。超过门禁1分钟也记警告。' };
const FORBIDDEN_RULE = { title: '禁止事项', text: '邀请同学进自己宿舍、在房间煮食或存放易燃物品和刀具（只能用电热水壶烧水）、破坏设施、校内亲密举动都会记警告；校内涉及酒精的事，知情不报也一起处罚。' };
const EOP_RULE = { title: '只说英语（EOP）', text: '平日上课时间，在教学楼和办公室只能说英语；第1次口头警告，第2次配合拍学校的短视频，第3次罚款300比索。' };

/** 2027 weekday holidays from the school's poster (the grid's dates); no class on these days. */
export const FELLA_HOLIDAYS_2027: HolidayCalendar = {
  year: 2027,
  label: '规划2027年入学时优先查看',
  months: [
    { month: 1, holidays: [{ day: '1日', name: '元旦' }] },
    { month: 2, holidays: [{ day: '24日', name: '宿务市宪章日' }] },
    {
      month: 3,
      holidays: [
        { day: '10日', name: '开斋节', provisional: true },
        { day: '25日', name: '濯足节' },
        { day: '26日', name: '耶稣受难日' },
      ],
    },
    { month: 4, holidays: [{ day: '9日', name: '勇士日' }] },
    { month: 5, holidays: [{ day: '17日', name: '宰牲节', provisional: true }] },
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
        { day: '8日', name: '圣母无原罪节' },
        { day: '24日', name: '平安夜' },
        { day: '30日', name: '黎刹日' },
        { day: '31日', name: '除夕' },
      ],
    },
  ],
};

/** The school's post-arrival refund rules (both orientations), after 思达启航's own deposit rules. */
export const FELLA_REFUND_COPY = {
  summaryTitle: 'English Fella 改期、退款与保留学籍',
  summaryHint: '报名定金、到校后退款、紧急情况保留学籍',
  eyebrow: 'CANCELLATION & REFUND',
  title: 'English Fella 退款规定',
  intro: '到校后要退课，须在离校前至少4周申请；剩下的周数先扣4周，再按一半的周数退学费和住宿费。',
  alert: '报名前请确认',
  groups: [
    {
      title: '报名与入学前',
      note: '',
      rules: [
        { when: '报名定金', text: '通过思达启航报名时预收定金2,000元人民币，为学生向学校订位；定金交了以后不退。' },
        { when: '改期', text: '入学4周前告诉顾问，可以改入学日期，或把定金保留1年；不足4周改期可能要扣违约金，以学校确认为准。' },
      ],
      footnote: '',
    },
    {
      title: '到校以后',
      note: '',
      rules: [
        { when: '申请时间', text: '离校前至少4周提出，申请当周不计算。' },
        { when: '退款金额', text: '从离校日算起剩下的周数先扣4周，再除以2，按这个周数退学费和住宿费；例如剩下12周，退4周的学费和住宿费。' },
        { when: '不能退款', text: '剩下4周以内；违反校规被退学；菲律宾公众假期和天灾等不可抗力停课。' },
        { when: '到账时间', text: '课程结束后一周内转到学生账户。' },
      ],
      footnote: '',
    },
    {
      title: '保留学籍',
      note: '',
      rules: [
        { when: '可以保留', text: '二等亲以内的亲属过世（附讣闻），或在菲律宾无法得到需要的医疗。' },
        { when: '怎么办', text: '回国后一个月内决定保留学籍或退款；保留的须在离校后一年内回校读完，选了保留就不能再要求退款。' },
      ],
      footnote: FELLA_REFERENCE_NOTE,
    },
  ],
};

const FIRST: FellaCampusPage = {
  shortName: 'English Fella 第一校区',
  breadcrumb: '菲律宾游学 / 宿务学校 / English Fella 第一校区',
  title: '菲律宾宿务 English Fella 第一校区（斯巴达）',
  heroLead: 'English Fella 2006年在宿务创立，第一校区是斯巴达校区：周一至周四不外出，晚自习和单字测验必须参加，每天4–6节一对一。只收15岁以上学生，也是托业和雅思保分班开设的校区。',
  heroTags: [
    { icon: 'location_on', text: '宿务市' },
    { icon: 'verified', text: '斯巴达管理' },
    { icon: 'record_voice_over', text: '每天4–6节一对一' },
    { icon: 'workspace_premium', text: '雅思·托业保分班' },
  ],
  advisorText: '第一校区管得严：周一至周四不能外出（每两周的周三晚上可以出去一次），周一至周四和周日晚上必须上自习、考单字，平均不到70%会被禁足。适合自制力一般、想在短时间内集中提高的学生，以及冲托业、雅思目标分的学生；保分班只在这里开。校园比第二校区小，约100名学生，设施有游泳池、健身房和半场篮球场。想要更自由的生活，可以看第二校区。',
  campusIntro: '校园约1,500坪，约100名学生；教学楼、宿舍、餐厅、游泳池和健身房都在校内。',
  coursesIntro: '按学习目标分组，每门课下面是每天的课时；点开可看适合人群和说明。每节课50分钟，另有每天2节选修课。',
  courseDetailHint: '保分班条件、分级测试、选修课',
  scheduleIntro: '综合英语PIC-4、成人2级的例子；实际课表按所选课程和分班安排。',
  scheduleBadge: '晚自习必须参加',
  scheduleNote: '单字测验平均不到70%，隔周的周五和周末禁足。',
  studyModesTitle: '斯巴达管理怎么管？',
  studyModesIntro: '第一校区所有学生都按斯巴达管理。',
  studyModesNote: '15–17岁学生周五门禁22:00。违反规定会记警告或罚款。',
  roomsPhotoIntro: '目前只有单人雅房的照片，其他房型的实拍照片我们正在向学校索取。',
  compareRoomHint: '如单人间、双人间和三人间',
  compareCourseHint: '如PIC-4、PIC-5和PIC-6',
  finalCtaTitle: '想确认 English Fella 第一校区的空房和优惠？',
  finalCtaText: '告诉顾问你的入学日期、周数、课程和想住的房型，我们帮你确认房间和保分班开课日，并做一份完整报价。',
  quoteImageHero: '/assets/fella-1/campus/main-building.webp',
  overviewFacts: [
    { icon: 'location_on', label: '位置', value: '宿务市Talamban区，步行4–5分钟到购物中心；离宿务机场约30–50分钟车程' },
    { icon: 'rule', label: '管理', value: '斯巴达：周一至周四不外出，每两周的周三晚上可外出；晚自习和单字测验必须参加' },
    { icon: 'menu_book', label: '课程', value: '综合英语、托业、雅思、托福；托业和雅思保分班只在第一校区开设' },
    { icon: 'apartment', label: '规模', value: '校园约1,500坪，约100名学生' },
    { icon: 'cake', label: '年龄', value: '15岁以上；15–17岁单独就读另付未成年管理费' },
    { icon: 'bed', label: '住宿', value: '校内豪华单人间、标准单人间、单人雅房、双人间和三人间，含一日三餐' },
  ],
  quickInfo: [
    { icon: 'verified', title: '斯巴达管理', text: '周一至周四不外出，晚自习必须参加' },
    { icon: 'record_voice_over', title: '一对一多', text: '每天4–6节一对一，另有小组课和选修课' },
    { icon: 'workspace_premium', title: '保分班', text: '托业和雅思保分班，12周一期' },
    { icon: 'quiz', title: '每天单字测验', text: '平均不到70%隔周禁足' },
  ],
  basicInfo: [
    { label: '学校', value: 'English Fella 第一校区（Fella1）' },
    { label: '创立', value: '2006年创立，2026年是第20年' },
    { label: '位置', value: '菲律宾宿务市Talamban区' },
    { label: '管理方式', value: '斯巴达' },
    { label: '课程', value: '综合英语、托业、雅思、托福、托业和雅思保分班' },
    { label: '住宿', value: '校内单人间、双人间、三人间' },
    { label: '资质', value: 'TESDA注册，IDP雅思官方合作' },
  ],
  suitableFor: ['自制力一般、想被管着集中学习的学生', '冲托业或雅思目标分的学生', '想多上一对一、短期内提高口语的成人'],
  notSuitableFor: ['想平日下课后自由外出的学生', '带孩子来读书的家庭（请看第二校区）', '未满15岁的学生'],
  campusBuildings: [
    { code: 'CLASS', title: '教学楼', icon: 'school', facilities: ['一对一和小组教室', '24小时自习室（固定座位）', '影视教室', '教务处和总务处'] },
    { code: 'DORM', title: '宿舍', icon: 'bed', facilities: ['单人间、双人间和三人间', '自助洗衣房（24小时）'] },
    { code: 'FOOD', title: '餐厅', icon: 'restaurant', facilities: ['学生餐厅（365天三餐）', 'Cafella小卖部和咖啡座'] },
    { code: 'SPORT', title: '运动', icon: 'pool', facilities: ['游泳池（水深1.5米）', '室内健身房', '半场篮球场'] },
  ],
  galleryImages: FIRST_GALLERY,
  albumCategories: ['校园', '教室', '住宿', '餐厅', '设施'],
  heroCategories: ['校园', '设施', '教室'],
  courseGroups: [
    { icon: 'forum', title: '综合英语', text: '共9个级别，每4周测试一次', courseIds: ['pic-4', 'pic-5', 'pic-6'] },
    { icon: 'workspace_premium', title: '雅思', text: '按入学成绩选课；保分班12周一期', courseIds: ['pigi', 'pift-e', 'pift', 'pirc'] },
    { icon: 'fact_check', title: '托业', text: '按入学成绩选课；保分班12周一期', courseIds: ['toeic-guarantee', 'toeic-esl', 'toeic-practice'] },
    { icon: 'school', title: '托福', text: '按托福入学成绩选课', courseIds: ['ppt', 'ptft'] },
  ],
  courseHighlights: {
    pigi: { badge: '送1次雅思官方考试' },
    'toeic-guarantee': { badge: '送2次托业官方考试' },
  },
  courseDetailGuides: [
    {
      icon: 'workspace_premium',
      title: '保分班：条件与目标分',
      subtitle: '只在第一校区开设，12周一期',
      courseIds: ['pigi', 'toeic-guarantee'],
      facts: [
        { label: '雅思入学→保分', value: 'D级4.0→5.5，C级5.0→6.0，B级5.5→6.5，A级6.0→7.0' },
        { label: '托业入学→保分', value: 'D级400→提高150分，C级500→700，B级650→800，A级800以上→900' },
        { label: '官方考试', value: '雅思在读期间1次（不含UKVI），入学后第9周前后考；托业在读期间2次' },
        { label: '条件', value: '报名12周；出席率97%以上（病假和自习算在内）；每周模考全部参加；没有任何警告' },
        { label: '没达到目标分', value: '学校提供4周免费课程，住宿和到校费用自付' },
      ],
      points: [
        '雅思保分班指定日期入学；托业保分班按托业官方考试日程开课，入学日期请向顾问确认。',
        '学校帮你报名官方考试，并单程专车送到考场；托业保分班每周六上午在校模考。',
        '违反任一就学规定，保分班的保证全部取消。',
      ],
    },
    {
      icon: 'tune',
      title: '分级、测试与换课',
      subtitle: '所有课程',
      facts: [
        { label: '级别测试', value: '每4周一次；缺考罚款1,000比索' },
        { label: '单字测验', value: '周一至周四和周日晚上，20个填空和5个句子' },
        { label: '换课和换老师', value: '周三在学生系统申请，周四回复，隔周一起生效' },
        { label: '加课', value: '每4周：一对一150美元，小组课110美元，特别一对一180美元' },
      ],
      points: ['换课程要另买新教材。'],
    },
    {
      icon: 'event_note',
      title: '选修课和晚间课',
      subtitle: '第一校区每天2节选修课',
      facts: [
        { label: '白天', value: '电影课、语法、托业、雅思等，在课表的空堂时间上' },
        { label: '运动', value: 'Zumba（周一、三、五），拳击（周二、四，每节400比索，买7节送1节）' },
        { label: '晚间课', value: '周一至周四20:00–21:50，可以代替晚自习，发音、口语、语法、美剧等' },
        { label: '周六上午课', value: '09:00–11:50小组课（演讲、语法、口语）' },
      ],
      points: ['报名了选修课却缺席，每次罚款300比索。'],
    },
  ],
  scheduleColumns: [
    {
      code: 'MON-THU',
      title: '周一至周四',
      rows: [
        ...FIRST_CLASS_ROWS,
        { time: '17:00–17:50', activity: '自习或选修课（必须二选一）', kind: 'activity' },
        { time: '18:00–18:50', activity: '晚餐', kind: 'meal' },
        { time: '19:00–19:40', activity: '晚自习（必须参加）', kind: 'activity' },
        { time: '19:40–19:50', activity: '单字测验', kind: 'test' },
        { time: '20:00–21:50', activity: '晚自习或晚间课（必须二选一）', kind: 'activity' },
      ],
    },
    {
      code: 'FRI',
      title: '周五',
      rows: [
        ...FIRST_CLASS_ROWS,
        { time: '17:00 起', activity: '自由活动，可以外出（02:00前回校）', kind: 'free' },
      ],
    },
    {
      code: 'WEEKEND',
      title: '周六和周日',
      rows: [
        { time: '08:00–08:50', activity: '早餐', kind: 'meal' },
        { time: '周六 09:00–11:50', activity: '小组课（语法、口语、单词）：15–17岁必须参加，成人自由参加', kind: 'class' },
        { time: '12:00–12:50', activity: '午餐', kind: 'meal' },
        { time: '白天', activity: '自由活动，可以外出', kind: 'free' },
        { time: '18:00–18:50', activity: '晚餐', kind: 'meal' },
        { time: '周日 19:00–21:00', activity: '晚自习和单字测验（必须参加）', kind: 'activity' },
      ],
    },
  ],
  studyModes: [
    {
      code: '斯巴达',
      name: '严格管理',
      title: '适合想挑战自己、被学习节奏督促的学生',
      contrastTitle: '必须参加的学习时段',
      timeBlocks: [
        { label: '17:00时段', time: '周一至周四 17:00–17:50', text: '自习或选修课二选一', icon: 'school', type: 'required' },
        { label: '晚自习', time: '周一至周四 19:00–21:50，周日 19:00–21:00', text: '20:00后可改上晚间课', icon: 'edit_note', type: 'required' },
        { label: '单字测验', time: '周一至周四和周日晚上', text: '平均不到70%，隔周周五和周末禁足', icon: 'quiz', type: 'required' },
        { label: '周六上午课', time: '09:00–11:50', text: '15–17岁必须参加（或户外活动二选一），成人自由参加', icon: 'event', type: 'flexible' },
      ],
      curfew: [
        { day: '周一至周四', time: '不可外出；每两周的周三17:00–22:00可外出' },
        { day: '周五和假日前一天', time: '17:00–22:00出校，02:00前回校' },
        { day: '周六', time: '05:00–22:00出校，02:00前回校' },
        { day: '周日和公众假期', time: '05:00–19:00' },
      ],
    },
  ],
  roomProfiles: [
    {
      id: 'single-1b', rateIds: ['single-1b'], label: '单人雅房 1B', location: '校内', bed: '单人床',
      service: '每周打扫2次，每周换床单1次', suitable: '想要自己的房间、又想省一点的学生',
      note: '一人一间卧室，和邻房共用客厅和卫生间。',
      image: 'assets/fella-1/rooms/single-1b.webp', gallery: ['assets/fella-1/rooms/single-1b.webp'],
      imageAlt: 'English Fella第一校区单人雅房1B',
    },
  ],
  dormRules: [
    { title: '门禁', text: '周一至周四不可外出（每两周的周三17:00–22:00可外出）；周五和周六02:00前回校，周日19:00前回校；23:00熄灯。' },
    WARNING_RULE,
    FORBIDDEN_RULE,
    EOP_RULE,
    { title: '抵消罚款', text: '写200字以上英文作文每篇可抵200比索，参加校内比赛也可以抵扣。' },
  ],
  practicalGuides: [
    {
      icon: 'restaurant',
      eyebrow: 'MEALS & HOURS',
      title: '用餐与开放时间',
      facts: [
        { label: '平日三餐', value: MEALS.weekday },
        { label: '周末和假日', value: MEALS.weekend },
        { label: '游泳池', value: '平日15:00–22:50，周末和假日09:00–22:50；未成年须有大人陪同' },
        { label: '健身房', value: '05:00–22:50；篮球场17:00–22:50' },
        { label: 'Cafella小卖部', value: '平日07:30–22:30，周末和假日07:30–17:00' },
      ],
      note: '一年365天都供应三餐，有素食和清真餐；白粥须提前1小时告诉餐厅。',
    },
    SERVICE_GUIDE,
    {
      icon: 'celebration',
      eyebrow: 'ACTIVITIES',
      title: '周五活动与周末旅行',
      facts: [
        { label: '周五活动', value: '运动比赛、拼字比赛、英文游戏和英文简报' },
        { label: '周末旅行', value: '每周末3种选择，共12种路线，有老师陪同，费用自付' },
        { label: '雅思机考', value: '第二校区的IDP机考雅思考场，第一校区学生有免费接送' },
      ],
      note: '活动内容按学校当期安排。',
    },
    ARRIVAL_GUIDE,
  ],
  faqs: [
    { question: '第一校区和第二校区有什么不同？', answer: '第一校区是斯巴达校区，周一至周四不能外出，晚自习和单字测验必须参加，只收15岁以上学生，托业和雅思保分班只在这里开。第二校区可以选自律型或半斯巴达，有商务英语、40岁以上会话课和亲子课程，校园更大。两个校区步行约10分钟。' },
    { question: '保分班怎么报？', answer: '雅思和托业保分班都是12周一期，只在第一校区开设，按入学成绩分级定目标分。条件是出席率97%以上、每周模考全部参加、没有任何警告；没达到目标分，学校提供4周免费课程（住宿和到校费用自付）。雅思保分班指定日期入学，请先向顾问确认开课日。' },
    { question: '未满18岁可以来第一校区吗？', answer: '15–17岁可以单独来读，另付未成年管理费（读1–2周50美元，3–4周100美元，之后每周25美元），周六上午课必须参加，周五门禁22:00。未满15岁不收，带孩子的家庭请看第二校区的亲子课程。' },
    { question: '现在报名有什么优惠？', answer: '2026年12月21日–27日、12月28日–2027年1月3日在读，每周减100美元，最多200美元。读4周以上，课程费和住宿费扣除圣诞优惠后再享思达启航95折。老学员返校免注册费。报价器会按你的日期自动计算。', until: '2027-01-04' },
    { question: '到校学杂费大概多少？', answer: '按30天签证读4周约17,100比索（SSP、SSP E-CARD、教材、学生证和综合管理费）；读8周约30,140比索，含一次续签、ACR I-CARD和ARP；59天签证读8周不用续签。另有房间押金、挂锁押金和接机。报价器会按你的周数和签证算出明细。' },
    { question: '页面上的报价包含全部费用吗？', answer: '学校费用包含注册费、课程费和住宿费（含一日三餐），并自动扣除优惠；到校学杂费单独列出，押金和接机另外准备。两者分开显示，不相加。' },
    { question: '思达启航会协助签证和入境吗？', answer: '会。通过思达启航报名，顾问会免费协助菲律宾入境和签证相关手续，你只需要按顾问指引准备个人资料。' },
  ],
};

const SECOND: FellaCampusPage = {
  shortName: 'English Fella 第二校区',
  breadcrumb: '菲律宾游学 / 宿务学校 / English Fella 第二校区',
  title: '菲律宾宿务 English Fella 第二校区（自律型／半斯巴达）',
  heroLead: 'English Fella 第二校区2008年开办，校园约5,000坪，可以选自律型（每天可外出）或半斯巴达（周一、二、四晚自习必须参加）。除了综合英语和考试课程，还有商务英语、40岁以上会话课和亲子课程，校内有IDP机考雅思考场。',
  heroTags: [
    { icon: 'location_on', text: '宿务市' },
    { icon: 'tune', text: '自律型／半斯巴达' },
    { icon: 'family_restroom', text: '亲子课程' },
    { icon: 'computer', text: 'IDP雅思机考考场' },
  ],
  advisorText: '第二校区比第一校区自由：自律型每天17:00后可以外出，半斯巴达周一、二、四晚自习和单字测验必须参加，周三、周五和周末可以外出，是这里最多人选的模式。校园大，有4栋教学楼、游泳池、健身房、室内运动馆和篮球场，适合想兼顾学习和生活的成人、40岁以上的学生和带孩子来的家庭。想被管得更严、或要读保分班，请看第一校区。',
  campusIntro: '校园约5,000坪，4栋教学楼，约200名学生；校内有IDP机考雅思考场、游泳池、健身房、室内运动馆和篮球场。',
  coursesIntro: '按学习目标分组，每门课下面是每天的课时；点开可看适合人群和说明。每节课50分钟，另有每天1节选修课。',
  courseDetailHint: '亲子课程、分级测试、选修课、雅思机考',
  scheduleIntro: '学校按每位学生的课程排个人课表，正课在08:00–16:50之间；下面是一天的大致安排。',
  scheduleBadge: '自律型或半斯巴达',
  studyModesTitle: '自律型还是半斯巴达？',
  studyModesIntro: '入学时选一种生活模式，两种的课程和费用一样，只是外出和晚自习的规定不同。',
  studyModesNote: 'SSC乐龄会话课只有自律型。违反规定会记警告或罚款。',
  roomsPhotoIntro: '第二校区各房型的实拍照片我们正在向学校索取，请先看住宿费表或问顾问。',
  compareRoomHint: '如豪华单人间、双人间和三人间',
  compareCourseHint: '如PIC-4、PIC-5和PIC-6',
  finalCtaTitle: '想确认 English Fella 第二校区的空房和优惠？',
  finalCtaText: '告诉顾问你的入学日期、周数、课程和想住的房型（带孩子来的请说明孩子年龄），我们帮你确认房间并做一份完整报价。',
  quoteImageHero: '/assets/fella-2/campus/entrance.webp',
  overviewFacts: [
    { icon: 'location_on', label: '位置', value: '宿务市Talamban区，和第一校区步行约10分钟；离宿务机场约30–50分钟车程' },
    { icon: 'rule', label: '管理', value: '自律型（每天可外出）或半斯巴达（周一、二、四不外出，晚自习必须参加），入学时选' },
    { icon: 'menu_book', label: '课程', value: '综合英语、托业、雅思、托福、商务英语、40岁以上会话课和亲子课程' },
    { icon: 'apartment', label: '规模', value: '校园约5,000坪，4栋教学楼，约200名学生' },
    { icon: 'computer', label: '考场', value: '校内有IDP机考雅思考场（2025年6月起）' },
    { icon: 'cake', label: '年龄', value: '5岁以上；未满15岁须家长陪读，15–17岁须有家长或监护人' },
    { icon: 'bed', label: '住宿', value: '校内豪华单人间、双人间和三人间，含一日三餐' },
  ],
  quickInfo: [
    { icon: 'tune', title: '两种生活模式', text: '自律型或半斯巴达，入学时选' },
    { icon: 'family_restroom', title: '亲子课程', text: '5岁以上孩子和家长一起读' },
    { icon: 'computer', title: '雅思机考考场', text: '校内的IDP考场，每月约一次' },
    { icon: 'sports_basketball', title: '运动设施', text: '游泳池、健身房、室内运动馆和篮球场' },
  ],
  basicInfo: [
    { label: '学校', value: 'English Fella 第二校区（Fella2）' },
    { label: '创立', value: 'English Fella 2006年创立，第二校区2008年开办' },
    { label: '位置', value: '菲律宾宿务市Talamban区' },
    { label: '管理方式', value: '自律型或半斯巴达' },
    { label: '课程', value: '综合英语、托业、雅思、托福、商务英语、乐龄会话、亲子课程' },
    { label: '住宿', value: '校内豪华单人间、双人间、三人间' },
    { label: '资质', value: 'TESDA注册，IDP雅思官方合作和机考考场' },
  ],
  suitableFor: ['想兼顾学习和生活、下课后能出去走走的成人', '40岁以上、想轻松练会话的学生', '带5岁以上孩子来读书的家长', '在宿务考雅思机考的学生'],
  notSuitableFor: ['想读雅思或托业保分班的学生（只在第一校区）', '需要被严格管着学习的学生（可选半斯巴达或第一校区）'],
  campusBuildings: [
    { code: 'CLASS', title: '教学楼', icon: 'school', facilities: ['4栋教学楼', '24小时自习室（固定座位）', '电脑教室和IDP雅思考场'] },
    { code: 'DORM', title: '宿舍', icon: 'bed', facilities: ['豪华单人间、双人间和三人间', '自助洗衣房（24小时）'] },
    { code: 'FOOD', title: '餐厅', icon: 'restaurant', facilities: ['学生餐厅（365天三餐）', 'Cafella小卖部'] },
    { code: 'SPORT', title: '运动', icon: 'pool', facilities: ['游泳池', '健身房', '室内运动馆', '户外篮球场'] },
  ],
  galleryImages: SECOND_GALLERY,
  albumCategories: ['校园', '教室', '餐厅', '设施'],
  heroCategories: ['校园', '设施', '教室'],
  courseGroups: [
    { icon: 'forum', title: '综合英语', text: '共9个级别，每4周测试一次', courseIds: ['pic-4', 'pic-5', 'pic-6', 'ssc'] },
    { icon: 'workspace_premium', title: '雅思', text: '校内有IDP机考雅思考场', courseIds: ['pift-e', 'pift', 'pirc'] },
    { icon: 'fact_check', title: '托业', text: '按托业入学成绩选课', courseIds: ['toeic-esl', 'toeic-practice'] },
    { icon: 'school', title: '托福', text: '按托福入学成绩选课', courseIds: ['ppt', 'ptft'] },
    { icon: 'business_center', title: '商务英语', text: '每天5节一对一', courseIds: ['ebc'] },
    { icon: 'family_restroom', title: '亲子课程', text: '家长和5岁以上孩子一起报名', courseIds: ['gec', 'p-jec', 'jec'] },
  ],
  courseHighlights: {},
  courseDetailGuides: [
    {
      icon: 'family_restroom',
      title: '亲子课程怎么报',
      subtitle: '家长和孩子一起读',
      courseIds: ['gec', 'p-jec', 'jec'],
      facts: [
        { label: '孩子年龄', value: 'P-JEC 5–6岁，JEC 7–15岁' },
        { label: '家长', value: '未满15岁的孩子须家长陪读，陪读家长可以报GEC家长课程（每天3节一对一）' },
        { label: '生活模式', value: '按自律型或半斯巴达管理，晚自习和周六上午课不用参加' },
        { label: '接机', value: '亲子课程的家庭成员接机费享7折，每人700比索' },
      ],
      points: ['每位家庭成员单独计算课程费和住宿费；报价器的多人报价可以把一家人放在一起算。'],
    },
    {
      icon: 'tune',
      title: '分级、测试与换课',
      subtitle: '所有课程',
      facts: [
        { label: '级别测试', value: '从入学日算起每4周一次，周四08:00–11:00；缺考罚款1,000比索' },
        { label: '模考', value: '托业和雅思学生可申请两周一次模考；每人可免费申请一次其他科目模考，再多每次500比索' },
        { label: '换课和换老师', value: '周三在学生系统申请，周四回复，隔周一起生效' },
        { label: '加课', value: '每4周：一对一150美元，小组课110美元，儿童一对一150美元，特别一对一180美元' },
      ],
      points: ['成绩进步可以得到Fella T恤和1,000比索罚款抵扣。', '换课程要另买新教材。'],
    },
    {
      icon: 'event_note',
      title: '选修课和雅思机考',
      subtitle: '第二校区每天1节选修课',
      facts: [
        { label: '选修课', value: '平日17:00–17:50：语法、口语、演讲、英文歌、托业；儿童有英文歌和口语' },
        { label: 'Zumba', value: '周一、三、五，不用报名' },
        { label: '申请', value: '周三在学生系统申请，选上后可以一直上到毕业' },
        { label: '雅思机考', value: '校内的IDP机考考场每月约考一次，2027年考试日以IDP公布为准' },
      ],
      points: [],
    },
  ],
  scheduleColumns: [
    {
      code: 'WEEKDAY',
      title: '周一至周五',
      rows: [
        { time: '06:50–07:50', activity: '早餐', kind: 'meal' },
        { time: '08:00–16:50', activity: '正课（每节50分钟，按个人课表）', kind: 'class' },
        { time: '11:30–12:50', activity: '午餐（课表的空堂时用餐）', kind: 'meal' },
        { time: '17:00–17:50', activity: '选修课（自愿报名）', kind: 'class' },
        { time: '17:50–19:00', activity: '晚餐', kind: 'meal' },
        { time: '19:00–21:50', activity: '晚自习：自律型自由参加，半斯巴达周一、二、四必须参加', kind: 'activity' },
        { time: '19:30–19:50', activity: '单字测验：半斯巴达周一、二、四必须参加', kind: 'test' },
      ],
    },
    {
      code: 'WEEKEND',
      title: '周六和周日',
      rows: [
        { time: '07:50–09:00', activity: '早餐', kind: 'meal' },
        { time: '白天', activity: '自由活动，可以外出', kind: 'free' },
        { time: '11:50–13:00', activity: '午餐', kind: 'meal' },
        { time: '17:50–19:00', activity: '晚餐', kind: 'meal' },
      ],
    },
  ],
  studyModes: [
    {
      code: '自律型',
      name: '自由型',
      title: '适合追求自由的游学生活',
      contrastTitle: '自律型没有必须参加的晚间时段',
      timeBlocks: [
        { label: '晚自习', time: '19:00–21:50', text: '自由参加', icon: 'edit_note', type: 'flexible' },
        { label: '单字测验', time: '19:30–19:50', text: '自由参加', icon: 'quiz', type: 'flexible' },
        { label: '外出', time: '每天17:00后', text: '周一至周四22:00前回校', icon: 'directions_walk', type: 'flexible' },
      ],
      curfew: [
        { day: '周一至周四', time: '17:00–22:00' },
        { day: '周五和假日前一天', time: '17:00–22:00出校，02:00前回校' },
        { day: '周六', time: '05:00–22:00出校，02:00前回校' },
        { day: '周日和公众假期', time: '05:00–22:00' },
      ],
    },
    {
      code: '半斯巴达',
      name: '适度管理',
      title: '适合想适度被管的学生，最多人选',
      contrastTitle: '半斯巴达必须参加的时段',
      timeBlocks: [
        { label: '晚自习', time: '周一、二、四 19:00–21:50', text: '必须参加', icon: 'edit_note', type: 'required' },
        { label: '单字测验', time: '周一、二、四 19:30–19:50', text: '必须参加', icon: 'quiz', type: 'required' },
        { label: '外出', time: '周三、周五和周末', text: '周三17:00–22:00', icon: 'directions_walk', type: 'flexible' },
      ],
      curfew: [
        { day: '周一、二、四', time: '不可外出' },
        { day: '周三', time: '17:00–22:00' },
        { day: '周五和假日前一天', time: '17:00–22:00出校，02:00前回校' },
        { day: '周六', time: '05:00–22:00出校，02:00前回校' },
        { day: '周日和公众假期', time: '05:00–22:00' },
      ],
    },
  ],
  roomProfiles: [],
  dormRules: [
    { title: '门禁', text: '按所选生活模式；周五和周六02:00前回校，周日和公众假期22:00前回校；23:00熄灯。' },
    WARNING_RULE,
    FORBIDDEN_RULE,
    EOP_RULE,
  ],
  practicalGuides: [
    {
      icon: 'restaurant',
      eyebrow: 'MEALS & HOURS',
      title: '用餐与开放时间',
      facts: [
        { label: '平日三餐', value: '早餐06:50–07:50，午餐11:30–12:50，晚餐17:50–19:00' },
        { label: '周末和假日', value: MEALS.weekend },
        { label: '游泳池', value: '平日15:00–22:50，周末和假日09:00–22:50；未成年须有大人陪同' },
        { label: '运动场', value: '篮球场17:00–22:50' },
        { label: 'Cafella小卖部', value: '平日07:00–21:00，周末和假日08:00–17:00' },
      ],
      note: '一年365天都供应三餐，有素食和清真餐；白粥须提前1小时告诉餐厅。',
    },
    SERVICE_GUIDE,
    {
      icon: 'celebration',
      eyebrow: 'ACTIVITIES',
      title: '课后活动与接驳车',
      facts: [
        { label: '周五活动', value: '运动比赛、英文游戏和英文简报' },
        { label: '周末旅行', value: '每周末3种选择，共12种路线，有老师陪同，费用自付' },
        { label: '周三接驳车', value: '14:00开往附近商场（亲子课程和SSC学生，有回程），17:00开往SM商场（单程）' },
      ],
      note: '活动和接驳车按学校当期安排。',
    },
    ARRIVAL_GUIDE,
  ],
  faqs: [
    { question: '第二校区和第一校区有什么不同？', answer: '第二校区可以选自律型（每天可外出）或半斯巴达（周一、二、四晚自习必须参加），有商务英语、40岁以上会话课和亲子课程，校园约5,000坪，设施更多。第一校区是斯巴达校区，只收15岁以上学生，托业和雅思保分班只在第一校区开。两个校区步行约10分钟。' },
    { question: '可以带孩子一起来吗？', answer: '可以。5–6岁读P-JEC，7–15岁读JEC，未满15岁须家长陪读，家长可以报GEC家长课程。每位家庭成员单独计算课程费和住宿费，用报价器的多人报价可以一起算；亲子课程的家庭成员接机费享7折。' },
    { question: '现在报名有什么优惠？', answer: '2026年12月21日–27日、12月28日–2027年1月3日在读，每周减100美元，最多200美元。读4周以上的非亲子课程，课程费和住宿费扣除圣诞优惠后再享思达启航95折。老学员返校免注册费。报价器会按你的日期自动计算。', until: '2027-01-04' },
    { question: '可以在校内考雅思吗？', answer: '可以。第二校区是IDP机考雅思考场，每月约考一次，2027年考试日以IDP公布为准；报名可以请教务处协助。' },
    { question: '到校学杂费大概多少？', answer: '按30天签证读4周约17,100比索（SSP、SSP E-CARD、教材、学生证和综合管理费）；读8周约30,140比索，含一次续签、ACR I-CARD和ARP；59天签证读8周不用续签。另有房间押金、挂锁押金和接机。报价器会按你的周数和签证算出明细。' },
    { question: '页面上的报价包含全部费用吗？', answer: '学校费用包含注册费、课程费和住宿费（含一日三餐），并自动扣除优惠；到校学杂费单独列出，押金和接机另外准备。两者分开显示，不相加。' },
    { question: '思达启航会协助签证和入境吗？', answer: '会。通过思达启航报名，顾问会免费协助菲律宾入境和签证相关手续，你只需要按顾问指引准备个人资料。' },
  ],
};

export const FELLA_PAGE_CONTENT: Readonly<Record<FellaCampus, FellaCampusPage>> = { campus1: FIRST, campus2: SECOND };

export const FELLA_FINAL_CTA_BADGES = ['免费选校建议', '确认空房和开课日', '签证与入境协助'];

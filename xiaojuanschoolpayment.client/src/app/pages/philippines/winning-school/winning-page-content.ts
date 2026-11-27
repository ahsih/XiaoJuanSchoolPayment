// Text and data of the two Winning English Academy pages, from the school's Feishu drive (read 2026-11-26): the Ayala
// and Ocean brochures, the New City (Ayala) student handbook of 2026-10-01, the price tables of 2026-09-22 (Ayala) and
// 2026-06-03 (Ocean), the Ayala grand-opening poster and the school's photo folders. New City (Ayala) replaced the old
// City campus on 2026-10-03; Ocean is on Mactan. Each page shows only its own campus. The shared Philippine school
// template reads this module through winning-page-profile.ts. Keep it pure data (no Angular, DOM or storage).
// Never add the school's address, phone, LINE, website, QR codes, staff names, maps or any agency term (commission,
// agency deposits, net payments). The brochure's "first school founded by …" and other ranking claims are left out.
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
import type { WinningCampus } from './winning-pricing';

/** Closes every content section once; the same line as on every Philippine school page. */
export const WINNING_REFERENCE_NOTE = SCHOOL_REFERENCE_NOTE;

export interface WinningCampusPage {
  shortName: string;
  breadcrumb: string;
  title: string;
  heroLead: string;
  heroTags: ReadonlyArray<{ icon: string; text: string }>;
  advisorText: string;
  campusIntro: string;
  coursesIntro: string;
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
  roomProfiles: readonly PhRoomProfile[];
  dormRules: ReadonlyArray<{ title: string; text: string }>;
  practicalGuides: readonly CampusPracticalGuide[];
  faqs: readonly FaqItem[];
}

// Photos are the school's own, from its Feishu photo folders (the folder names the campus, hotel and room type), resized
// to 1600 px. Ayala classrooms are left out: the only classroom photos were taken during the renovation, which the
// school marks as unfinished. Ocean's world-map wall is left out (map rule). The Ocean family room has no photo: the
// folder shows the former 3–4-person family room, which the school changed in March 2026.
const ayala = (file: string) => `assets/winning/ayala/${file}.webp`;
const ocean = (file: string) => `assets/winning/ocean/${file}.webp`;

export const WINNING_ALBUM_DESCRIPTIONS: Readonly<Record<WinningCampus, Record<PhAlbumCategory, string>>> = {
  ayala: {
    校园: '校舍大楼、大厅与走廊',
    教室: '一对一与小组教室',
    住宿: '校内CQH、Hotel George和Lyf Hotel房型',
    餐厅: '学生餐厅与咖啡厅',
    设施: '合作酒店的泳池与健身房',
  },
  ocean: {
    校园: '校舍、大厅与走廊',
    教室: '一对一与小组教室',
    住宿: '校内宿舍房型',
    餐厅: '学生餐厅',
    设施: '儿童游戏室与休息区',
  },
};

/** Both campuses: Sunday arrival, Saturday departure (handbook and price tables). */
const arrivalGuide = (campus: WinningCampus): CampusPracticalGuide => ({
  icon: 'flight_land',
  eyebrow: 'BEFORE YOU GO',
  title: '入学、离校与出发前准备',
  facts: [
    { label: '入学', value: '周日14:00后入住；周一上午新生说明会，09:30起分级测试（听说读写约2小时），下午开课' },
    { label: '离校', value: '课程结束后的周六12:00前退房；押金在毕业周的周四退还' },
    { label: '提前入住和延后退房', value: '按晚另付，须提前预约，只接受短期加住' },
    { label: '接机', value: '每次1,000比索，须在报名时申请；毕业送机同为1,000比索' },
    ...(campus === 'ayala'
      ? [{ label: '打车', value: '新校区刚搬迁，打车软件上的位置可能还没更新，可搜索Cebu Quincentennial Hotel' }]
      : []),
  ],
  note: '入境和签证材料由思达启航顾问逐项帮你核对；eTravel入境登记也由顾问协助填写。',
});

/** Ayala: the New City handbook of 2026-10-01. */
const AYALA_SERVICE_GUIDE: CampusPracticalGuide = {
  icon: 'restaurant',
  eyebrow: 'MEALS & SERVICES',
  title: '用餐、洗衣与开放时间',
  facts: [
    { label: '用餐', value: '周一至周五 早餐07:00–08:00，午餐12:00–13:00，晚餐17:00–18:00；周六不供餐；周日只供晚餐（17:00–18:00，须提前登记）' },
    { label: '餐食', value: '自助餐，有清真餐；用餐须戴学生证' },
    { label: '洗衣', value: '每次200比索（洗衣加烘干，每袋最多7公斤），每周两次收衣' },
    { label: '办公室', value: '周一至周五08:00–17:00（假期除外）' },
  ],
  note: '到校学杂费在第一周用比索缴纳，请准备现金。',
};

/** Ocean: the school-wide price table and the Ocean brochure (no Ocean handbook in the drive yet). */
const OCEAN_SERVICE_GUIDE: CampusPracticalGuide = {
  icon: 'restaurant',
  eyebrow: 'MEALS & SERVICES',
  title: '用餐与洗衣',
  facts: [
    { label: '用餐', value: '周一至周五一日三餐；周六不供餐；周日只供晚餐' },
    { label: '餐食', value: '自助餐，有清真餐；特殊餐（如素食）可另付费' },
    { label: '洗衣', value: '每次200比索（洗衣加烘干，每次最多7公斤），到校后按需购买' },
  ],
  note: '用餐时间和其他校内安排以学校到校说明为准；到校学杂费用比索缴纳，请准备现金。',
};

const CLASS_RULES: CourseDetailGuide = {
  icon: 'tune',
  title: '分级、换课与加课',
  subtitle: '所有课程',
  facts: [
    { label: '上课', value: '周一至周五，每节课50分钟' },
    { label: '测试', value: '入学第一个周一分级测试；ESL每4周一次升级测试；毕业周周三结业测试；雅思和托业每周一次模考' },
    { label: '2节小组课换1节一对一', value: '淡季可以换（有空堂老师时）；寒暑假旺季不能换' },
    { label: '加课', value: '每周5节：一对一40美元，小组课20美元；雅思、托业和商务一对一75美元，小组课40美元' },
  ],
  points: ['国定假日取消的课不补课。'],
};

/** Ayala handbook only. */
const AYALA_CLASS_POINTS: CourseDetailGuide = {
  icon: 'event_note',
  title: '换课、请假与出席',
  subtitle: 'Ayala校区学生手册',
  facts: [
    { label: '换课和换老师', value: '每周三15:00前在线申请，最晚隔周一生效；旺季须看老师安排' },
    { label: '请假', value: '在学校的线上表单提交；请假、天灾或停电取消的课都不补课' },
    { label: '出席', value: '迟到超过30分钟算缺席；连续3周出席率低于50%会被退学；总出席率低于80%拿不到毕业证书' },
  ],
  points: [],
};

const BOOK_GUIDE: CourseDetailGuide = {
  icon: 'menu_book',
  title: '教材费怎么算',
  subtitle: '到校后用比索缴纳',
  facts: [
    { label: '计算方式', value: '按课程和报名周数包周计算，不按本数' },
    { label: '例子（4周）', value: 'ESL2 1,900、ESL4 2,600、Power Speaking 6 3,200、托业实战3,200、雅思实战2,850比索' },
    { label: '退费', value: '不论是否用完都要缴，不退费' },
  ],
  points: ['教材可能是正式出版的书或学校印制的版本，由学校按库存和课程决定。'],
};

/** Weekday class rows of the brochure's daily timetable (a reference; subjects are set after the level test). */
const WEEKDAY_ROWS: DailyScheduleRow[] = [
  { time: '07:00–08:00', activity: '早餐', kind: 'meal' },
  { time: '08:00–12:00', activity: '上午课：一对一或小组课（中间可能有空堂）', kind: 'class' },
  { time: '12:00–13:00', activity: '午餐', kind: 'meal' },
  { time: '13:00–17:00', activity: '下午课：一对一或小组课（中间可能有空堂）', kind: 'class' },
  { time: '17:00–18:00', activity: '晚餐', kind: 'meal' },
  { time: '18:00–20:00', activity: '选修课', kind: 'activity' },
];

const SCHEDULE: PhScheduleColumn[] = [
  { code: 'MON-FRI', title: '周一至周五（参考）', rows: WEEKDAY_ROWS },
  {
    code: 'FIRST-DAY',
    title: '入学第一天（周一）',
    rows: [
      { time: '07:00–08:00', activity: '早餐', kind: 'meal' },
      { time: '08:00–09:00', activity: '新生说明会和参观校园', kind: 'activity' },
      { time: '09:00–11:00', activity: '分级测试', kind: 'test' },
      { time: '11:00–12:00', activity: '欢迎会', kind: 'activity' },
      { time: '12:00–13:00', activity: '午餐', kind: 'meal' },
      { time: '13:00–17:00', activity: '主题小组课', kind: 'class' },
      { time: '17:00–18:00', activity: '晚餐', kind: 'meal' },
      { time: '18:00 起', activity: '采买和换钱', kind: 'free' },
    ],
  },
];

const MINOR_RULE = { title: '未成年学生', text: '18岁以上没有门禁；未满18岁没有家长允许或陪同，任何时间都不能离开校园，21:00至次日07:00不能离开房间（含大厅和餐厅），学生经理会抽查。' };
const POINT_RULE = { title: '记点与退学', text: '禁烟区吸烟、校内饮酒、上课说母语违反只说英语（EOP）规定记1点；酒后滋事、违反门禁、进入非本人住宿的房间记2点；暴力、骚扰、违法记3点。累计3点退学，不退任何费用。' };
const QUIET_RULE = { title: '宿舍规定', text: '23:00–06:00保持安静；所有住宿都禁烟，房内也不能做会产生油烟的烹饪；人不在房间时请关电器和水，否则每次罚500比索；遗失房卡300–500比索。' };

const AYALA_GALLERY: GalleryImage[] = [
  { category: '校园', title: 'Ayala校区大楼', description: '2026年10月启用的新城市校区，学习和住宿在同一栋大楼。', src: ayala('building') },
  { category: '校园', title: '校区街景', description: '楼下就是超市，步行约550米到Ayala购物中心。', src: ayala('building-street') },
  { category: '校园', title: '走廊', description: '住宿楼层的走廊。', src: ayala('corridor') },
  { category: '餐厅', title: '学生餐厅', description: '平日供应一日三餐，有清真餐。', src: ayala('dining') },
  { category: '餐厅', title: '取餐区', description: '自助餐的取餐台。', src: ayala('cafe-counter') },
  { category: '餐厅', title: '餐厅座位区', description: '校内的餐厅。', src: ayala('restaurant') },
  { category: '餐厅', title: '吧台', description: '餐厅的吧台。', src: ayala('cafe-bar') },
  { category: '住宿', title: '校内双人房 2P', description: '两张单人床。', src: ayala('2p-wide') },
  { category: '住宿', title: '校内背包客4人房', description: '两张上下铺。', src: ayala('bp4-a') },
  { category: '住宿', title: '校内背包客6人房', description: '三张上下铺。', src: ayala('bp6-a') },
  { category: '住宿', title: 'Hotel George 豪华单人房', description: '一张大床，有窗。', src: ayala('g-deluxe-a') },
  { category: '住宿', title: 'Lyf Hotel 单人房', description: '一张大床。', src: ayala('l-1p-a') },
  { category: '设施', title: 'Hotel George 泳池', description: 'Hotel George楼顶的泳池（住Hotel George的学生）。', src: ayala('g-pool') },
  { category: '设施', title: 'Lyf Hotel 泳池', description: 'Lyf Hotel的泳池（住Lyf Hotel的学生）。', src: ayala('l-pool') },
  { category: '设施', title: 'Lyf Hotel 健身房', description: 'Lyf Hotel的健身房。', src: ayala('l-gym') },
];

const OCEAN_GALLERY: GalleryImage[] = [
  { category: '校园', title: 'Ocean校区校舍', description: '麦克坦岛上的校区，2024年全新装修。', src: ocean('building') },
  { category: '校园', title: '校舍外观', description: '学习和住宿都在校内。', src: ocean('building-b') },
  { category: '校园', title: '校区航拍', description: '周边有超市、餐厅和按摩店。', src: ocean('aerial') },
  { category: '校园', title: '大厅', description: '大厅的休息区。', src: ocean('lobby') },
  { category: '校园', title: '走廊', description: '宿舍楼层的走廊。', src: ocean('corridor') },
  { category: '教室', title: '小组教室', description: '小组课的教室。', src: ocean('group') },
  { category: '教室', title: '小组教室', description: '教室有白板和电脑。', src: ocean('group-b') },
  { category: '教室', title: '一对一教室', description: '一对一课的小教室。', src: ocean('one') },
  { category: '餐厅', title: '学生餐厅', description: '落地窗的餐厅，平日供应一日三餐。', src: ocean('cafeteria') },
  { category: '餐厅', title: '餐厅座位', description: '学生用餐的地方。', src: ocean('cafeteria-b') },
  { category: '住宿', title: '单人房 1P', description: '一张单人床。', src: ocean('1p-a') },
  { category: '住宿', title: '双人房 2P', description: '两张单人床。', src: ocean('2p-a') },
  { category: '住宿', title: '女生背包客4人房', description: '上铺床下面是书桌。', src: ocean('bp4-a') },
  { category: '住宿', title: '男生背包客8人房', description: '上下铺有床帘。', src: ocean('bp8-a') },
  { category: '设施', title: '儿童游戏室', description: '给亲子学员孩子用的游戏室。', src: ocean('playroom') },
  { category: '设施', title: '休息区', description: '下课后休息的地方。', src: ocean('resting') },
];

const roomProfile = (
  campus: string, id: string, rateIds: readonly string[], label: string, location: '校内' | '校外', gallery: readonly string[],
  suitable: string, note: string, bed?: string,
): PhRoomProfile => ({
  id, rateIds: [...rateIds], label, location, ...(bed ? { bed } : {}), suitable, note,
  image: gallery[0], gallery: [...gallery], imageAlt: `Winning ${campus} ${label}`,
});

const AYALA_ROOMS: PhRoomProfile[] = [
  roomProfile('Ayala校区', 'cqh-2p', ['cqh-2p'], '校内双人房 2P', '校内', [ayala('2p-wide'), ayala('2p-a'), ayala('2p-b')], '想住在校内、有一位室友的学生', '两人一间，房内有卫生间。', '两张单人床'),
  roomProfile('Ayala校区', 'cqh-family-3p', ['cqh-family-3p'], '校内三人家庭房 Family 3P', '校内', [ayala('2p-wide'), ayala('extra-bed')], '一家三口', '双人房加一张折叠床，供一家人入住。', '两张单人床和一张加床'),
  roomProfile('Ayala校区', 'cqh-bp4', ['cqh-bp4'], '校内背包客4人房', '校内', [ayala('bp4-a'), ayala('bp4-b'), ayala('bp4-bath')], '预算有限、想多认识同学的学生', '四人一间，每人有书桌。', '两张上下铺'),
  roomProfile('Ayala校区', 'cqh-bp6', ['cqh-bp6'], '校内背包客6人房', '校内', [ayala('bp6-a'), ayala('bp6-b'), ayala('bp6-c')], '预算最优先的学生', '六人一间。', '三张上下铺'),
  roomProfile('Ayala校区', 'george-deluxe-1p', ['george-deluxe-1p'], 'Hotel George 豪华单人房', '校外', [ayala('g-deluxe-a'), ayala('g-deluxe-b')], '想要一人一间、有窗的学生', '约18平方米；步行到校区约10分钟。', '一张大床'),
  roomProfile('Ayala校区', 'george-standard-1p', ['george-standard-1p'], 'Hotel George 标准单人房', '校外', [ayala('g-standard-a'), ayala('g-standard-bath')], '想要一人一间、预算比豪华单人房低的学生', '约14平方米，没有窗；步行到校区约10分钟。', '一张单人床'),
  roomProfile('Ayala校区', 'george-family', ['george-family-2p', 'george-family-3p'], 'Hotel George 家庭房（2–3人）', '校外', [ayala('g-family-a'), ayala('g-family-b'), ayala('g-family-c')], '两三人的家庭', '双人房约18平方米，三人房约21平方米（另加床）；步行到校区约10分钟。'),
  roomProfile('Ayala校区', 'lyf-1p', ['lyf-1p'], 'Lyf Hotel 单人房', '校外', [ayala('l-1p-a'), ayala('l-1p-b')], '想住酒店、一人一间的学生', '至少住2周；淡季须自己坐车到校（Grab约10分钟），旺季有校车。', '一张大床'),
  roomProfile('Ayala校区', 'lyf-family-2p', ['lyf-family-2p'], 'Lyf Hotel 家庭双人房', '校外', [ayala('l-2p-a'), ayala('l-2p-b')], '两人的家庭', '至少住2周；淡季须自己坐车到校，旺季有校车。', '一张大床或两张单人床'),
  roomProfile('Ayala校区', 'lyf-family-56', ['lyf-family-5p', 'lyf-family-6p'], 'Lyf Hotel 家庭五／六人房', '校外', [ayala('l-56-a'), ayala('l-56-b'), ayala('l-56-c')], '多人的大家庭', '四个卧室，有客厅和小厨房；至少住2周。', '两间单人床卧室和两间大床卧室'),
];

const OCEAN_ROOMS: PhRoomProfile[] = [
  roomProfile('Ocean校区', 'ocean-1p', ['ocean-1p'], '单人房 1P', '校内', [ocean('1p-a'), ocean('1p-bath')], '想要一人一间的学生', '一人一间，房内有卫生间。', '一张单人床'),
  roomProfile('Ocean校区', 'ocean-2p', ['ocean-2p'], '双人房 2P', '校内', [ocean('2p-a'), ocean('2p-b'), ocean('2p-desk')], '想有一位室友的学生', '两人一间，有书桌和小冰箱。', '两张单人床'),
  roomProfile('Ocean校区', 'ocean-bp4', ['ocean-bp4'], '女生背包客4人房', '校内', [ocean('bp4-a'), ocean('bp4-b')], '预算有限的女生', '只收女生；2026年4月改造完成。', '上铺床，下面是书桌'),
  roomProfile('Ocean校区', 'ocean-bp8', ['ocean-bp8'], '男生背包客8人房', '校内', [ocean('bp8-a'), ocean('bp8-b')], '预算最优先的男生', '只收男生；床有床帘。', '四张上下铺'),
];

/** 2027 weekday holidays of the national proclamation (No. 1427) in the school's drive; no class on these days. */
export const WINNING_HOLIDAYS_2027: HolidayCalendar = {
  year: 2027,
  label: '规划2027年入学时优先查看',
  months: [
    { month: 1, holidays: [{ day: '1日', name: '元旦' }] },
    { month: 3, holidays: [{ day: '25日', name: '濯足节' }, { day: '26日', name: '耶稣受难日' }] },
    { month: 4, holidays: [{ day: '9日', name: '勇士日' }] },
    { month: 8, holidays: [{ day: '30日', name: '国家英雄日' }] },
    { month: 11, holidays: [{ day: '1日', name: '诸圣节' }, { day: '2日', name: '万灵节' }, { day: '30日', name: '博尼法西奥日' }] },
    { month: 12, holidays: [{ day: '8日', name: '圣母无原罪节' }, { day: '24日', name: '平安夜' }, { day: '30日', name: '黎刹日' }, { day: '31日', name: '除夕' }] },
  ],
};

export const WINNING_FINAL_CTA_BADGES = ['免费选校建议', '确认空房和开业优惠', '签证与入境协助'];

const AYALA: WinningCampusPage = {
  shortName: 'Winning Ayala校区',
  breadcrumb: '菲律宾游学 / 宿务学校 / Winning Ayala校区',
  title: '菲律宾宿务 Winning English Academy 新城市Ayala校区',
  heroLead: 'Winning English Academy 2015年创立。原City校区2026年10月3日搬到宿务市中心的新城市Ayala校区：学习和住宿在同一栋酒店式大楼，步行约550米到Ayala购物中心。有ESL、口语强化、托业、雅思、商务和旅游英语，也有亲子家庭课程。',
  heroTags: [
    { icon: 'location_city', text: '宿务市中心' },
    { icon: 'apartment', text: '学习住宿同一栋楼' },
    { icon: 'record_voice_over', text: '每天最多8节一对一' },
    { icon: 'family_restroom', text: '亲子家庭课程' },
  ],
  advisorText: 'Ayala校区在宿务市中心，楼下就是超市，Ayala购物中心和IT Park都在步行范围，生活方便。校内住宿是背包客房和双人房，不设单人房；想住单人房要选步行约10分钟的Hotel George，或坐车约10分钟的Lyf Hotel。管理上没有斯巴达式的晚自习，成人没有门禁，适合自己能安排学习、又想要市区生活的学生；考托业、雅思的课程只在这个校区开设。',
  campusIntro: '校区可住约150人，学习和住宿在同一栋大楼；有免费Wi-Fi、24小时保安、自习室、咖啡厅、健身房、祈祷室和医务室。',
  coursesIntro: '按学习目标分组，每门课下面是每天的课时；点开可看适合人群和说明。每节课50分钟，周一至周五上课。',
  roomsPhotoIntro: '点选房型查看实景；各房型价格见上方食宿费表。Hotel George和Lyf Hotel是校外合作酒店。',
  compareRoomHint: '如校内双人房、背包客房和校外单人房',
  compareCourseHint: '如ESL4、Power Speaking 6和Speaking Focus 8',
  finalCtaTitle: '想确认 Winning Ayala校区的空房和优惠？',
  finalCtaText: '告诉顾问你的入学日期、周数、课程和想住的房型，我们帮你确认房间和开业优惠，并做一份完整报价。',
  quoteImageHero: '/assets/winning/ayala/building.webp',
  overviewFacts: [
    { icon: 'location_on', label: '位置', value: '宿务市中心；步行约550米到Ayala购物中心，约1.3公里到IT Park' },
    { icon: 'rule', label: '管理', value: '非斯巴达：没有晚自习；18岁以上没有门禁' },
    { icon: 'menu_book', label: '课程', value: 'ESL、口语强化、托业、雅思、商务、旅游英语和亲子家庭课程' },
    { icon: 'apartment', label: '规模', value: '可住约150人' },
    { icon: 'cake', label: '年龄', value: 'ESL 15岁以上；托业、雅思和旅游英语12岁以上；6–17岁读JEP，须家长陪同' },
    { icon: 'bed', label: '住宿', value: '校内双人房和背包客房；单人房在校外Hotel George和Lyf Hotel；含平日三餐' },
  ],
  quickInfo: [
    { icon: 'location_city', title: '市中心', text: '购物中心和IT Park都在附近' },
    { icon: 'record_voice_over', title: '一对一多', text: '每天2–8节一对一，按课程选' },
    { icon: 'workspace_premium', title: '考试课程', text: '托业和雅思课程只在Ayala开设' },
    { icon: 'family_restroom', title: '亲子家庭', text: '儿童、青少年和监护人课程' },
  ],
  basicInfo: [
    { label: '学校', value: 'Winning English Academy 新城市Ayala校区（New City Campus）' },
    { label: '创立', value: '2015年创立；Ayala校区2026年10月启用' },
    { label: '位置', value: '菲律宾宿务市中心' },
    { label: '管理方式', value: '非斯巴达，18岁以上没有门禁' },
    { label: '课程', value: 'ESL、口语强化、托业、雅思、商务、旅游英语、亲子家庭课程' },
    { label: '住宿', value: '校内双人房、背包客4人房和6人房、三人家庭房；校外Hotel George和Lyf Hotel' },
  ],
  suitableFor: ['想要市区生活机能的成人学生', '备考托业或雅思的学生', '带孩子来读书的家庭'],
  notSuitableFor: ['想被斯巴达式管着学习的学生', '想在校内住单人房的学生（单人房在校外）', '想要海边度假氛围的学生（请看Ocean校区）'],
  campusBuildings: [
    { code: 'CLASS', title: '教学', icon: 'school', facilities: ['一对一和小组教室', '自习室（周一至周五07:00–24:00）', '办公室（周一至周五08:00–17:00）'] },
    { code: 'DORM', title: '校内住宿', icon: 'bed', facilities: ['双人房、背包客4人房和6人房', '三人家庭房'] },
    { code: 'FOOD', title: '餐厅', icon: 'restaurant', facilities: ['学生餐厅（平日三餐，有清真餐）', 'Winning咖啡厅'] },
    { code: 'LIFE', title: '生活', icon: 'fitness_center', facilities: ['健身房（每天07:00–21:00）', '祈祷室和医务室', '24小时保安'] },
  ],
  galleryImages: AYALA_GALLERY,
  albumCategories: ['校园', '餐厅', '住宿', '设施'],
  heroCategories: ['校园', '餐厅', '住宿'],
  courseGroups: [
    { icon: 'forum', title: 'ESL与口语强化', text: '入学测试后分级，每4周一次升级测试', courseIds: ['esl2', 'esl4', 'ps6', 'sf8'] },
    { icon: 'workspace_premium', title: '雅思', text: '须先通过学校的报名测试；每周模考', courseIds: ['pre-ielts', 'ielts'] },
    { icon: 'fact_check', title: '托业', text: '每周模考', courseIds: ['pre-toeic', 'toeic'] },
    { icon: 'work', title: '商务与旅游英语', text: '工作和旅行用英语', courseIds: ['business', 'travel'] },
    { icon: 'family_restroom', title: '亲子家庭英语', text: '孩子须家长陪同；家长可报监护人课程', courseIds: ['jep-kids', 'jep-junior', 'preschool', 'guardian'] },
  ],
  courseHighlights: { esl4: { badge: '最常报' } },
  courseDetailGuides: [CLASS_RULES, AYALA_CLASS_POINTS, BOOK_GUIDE],
  scheduleColumns: SCHEDULE,
  roomProfiles: AYALA_ROOMS,
  dormRules: [
    MINOR_RULE,
    POINT_RULE,
    QUIET_RULE,
    { title: '打扫', text: '校内CQH、Hotel George和Lyf Hotel每周打扫一次（向柜台询问或预约）。' },
    { title: '空床费', text: 'Lyf Hotel家庭房住不满时，每个空床每周175美元（例如2人住4人房）。' },
  ],
  practicalGuides: [arrivalGuide('ayala'), AYALA_SERVICE_GUIDE],
  faqs: [
    { question: 'Winning原来的City校区还在吗？', answer: '原City校区2026年10月3日已经整体搬到新城市Ayala校区，现在报City就是Ayala校区。' },
    { question: 'Ayala校区可以住单人房吗？', answer: '校内暂时不设单人房。想住单人房可以选校外的Hotel George（步行约10分钟，分没有窗的标准单人房和有窗、更大的豪华单人房）或Lyf Hotel（至少住2周）。' },
    { question: '住Lyf Hotel怎么到学校？', answer: '学校价格表写明：淡季要自己坐车（Grab约10分钟，步行约30分钟），旺季有校车；以学校当期安排为准。' },
    { question: 'Ayala校区开业优惠怎么算？', answer: '2026年12月31日前报名、在淡季上课的周，课程费和食宿费85折；ESL和雅思课程读4周以上，还可以按低一级课程的价格读高一级课程（如付ESL2的价格读ESL4）。2027/01/24–02/28寒假旺季和2027年暑假旺季不适用，不能和学校其他优惠同时用。报价器会按你的日期自动计算。', until: '2027-01-01' },
    { question: '2027年暑假要加钱吗？', answer: '要。宿务语言学校协会通知：2027/07/04–08/28在读的周，每周加收60美元旺季附加费，不参与任何折扣。' },
    { question: '周末有饭吃吗？', answer: '学校的食宿费含周一至周五三餐；周六不供餐，周日只供晚餐（须提前登记）。周末可以在附近的超市和餐厅解决。' },
  ],
};

const OCEAN: WinningCampusPage = {
  shortName: 'Winning Ocean校区',
  breadcrumb: '菲律宾游学 / 宿务学校 / Winning Ocean校区',
  title: '菲律宾宿务 Winning English Academy Ocean海滨校区',
  heroLead: 'Winning Ocean校区在宿务的麦克坦岛，2024年全新装修，学习和住宿都在校内，可住约50人。开设ESL、口语强化和旅游英语，以及儿童、幼儿和监护人的亲子家庭课程，校内有儿童游戏室和泳池。',
  heroTags: [
    { icon: 'beach_access', text: '麦克坦岛' },
    { icon: 'family_restroom', text: '亲子家庭课程' },
    { icon: 'record_voice_over', text: '每天最多8节一对一' },
    { icon: 'groups', text: '可住约50人' },
  ],
  advisorText: 'Ocean校区规模小（约50人），在麦克坦岛的度假区一带，周边有超市、餐厅和按摩店，学校安排学生免费用附近度假村的健身房。适合带孩子来读书的家庭和想在海岛环境里学英语的成人；校内有儿童游戏室，幼儿可加购日托。这里只开ESL、口语强化、旅游英语和亲子课程，想读托业、雅思或商务英语请看Ayala校区。',
  campusIntro: '校区可住约50人，2024年全新装修；有免费Wi-Fi、24小时保安、自习室、餐厅、儿童游戏室和泳池。',
  coursesIntro: '按学习目标分组，每门课下面是每天的课时；点开可看适合人群和说明。每节课50分钟，周一至周五上课。',
  roomsPhotoIntro: '点选房型查看实景；各房型价格见上方食宿费表。全部是校内宿舍。',
  compareRoomHint: '如单人房、双人房和背包客房',
  compareCourseHint: '如ESL4、Power Speaking 6和Speaking Focus 8',
  finalCtaTitle: '想确认 Winning Ocean校区的空房？',
  finalCtaText: '告诉顾问你的入学日期、周数、课程和想住的房型，我们帮你向学校确认空位，并做一份完整报价。',
  quoteImageHero: '/assets/winning/ocean/building.webp',
  overviewFacts: [
    { icon: 'location_on', label: '位置', value: '宿务麦克坦岛，离宿务机场不远；周边有超市、餐厅和按摩店' },
    { icon: 'rule', label: '管理', value: '非斯巴达：没有晚自习' },
    { icon: 'menu_book', label: '课程', value: 'ESL、口语强化、旅游英语和亲子家庭课程' },
    { icon: 'apartment', label: '规模', value: '可住约50人，2024年全新装修' },
    { icon: 'cake', label: '年龄', value: 'ESL 12岁以上、旅游英语16岁以上；6–17岁读JEP、6岁以下读幼儿英语，须家长陪同' },
    { icon: 'bed', label: '住宿', value: '校内单人房、双人房、家庭三人房和男女背包客房，含平日三餐' },
  ],
  quickInfo: [
    { icon: 'beach_access', title: '海岛环境', text: '在麦克坦岛的度假区一带' },
    { icon: 'family_restroom', title: '亲子家庭', text: '儿童、幼儿和监护人课程，有儿童游戏室' },
    { icon: 'child_care', title: '儿童日托', text: '幼儿可加购，每周100美元' },
    { icon: 'groups', title: '小规模', text: '可住约50人' },
  ],
  basicInfo: [
    { label: '学校', value: 'Winning English Academy Ocean校区（Ocean Campus）' },
    { label: '创立', value: '2015年创立；Ocean校区2024年全新装修' },
    { label: '位置', value: '菲律宾宿务麦克坦岛' },
    { label: '管理方式', value: '非斯巴达' },
    { label: '课程', value: 'ESL、口语强化、旅游英语、亲子家庭课程' },
    { label: '住宿', value: '校内单人房、双人房、家庭三人房、女生4人房、男生8人房' },
  ],
  suitableFor: ['带孩子来读书的家庭', '想在海岛环境学英语的成人', '想要小规模校区的学生'],
  notSuitableFor: ['想读托业、雅思或商务英语的学生（请看Ayala校区）', '想被斯巴达式管着学习的学生', '想住在市中心的学生'],
  campusBuildings: [
    { code: 'CLASS', title: '教学', icon: 'school', facilities: ['一对一和小组教室', '自习室'] },
    { code: 'DORM', title: '住宿', icon: 'bed', facilities: ['单人房、双人房、家庭三人房', '女生4人房、男生8人房'] },
    { code: 'FOOD', title: '餐厅', icon: 'restaurant', facilities: ['学生餐厅（平日三餐，有清真餐）'] },
    { code: 'LIFE', title: '生活', icon: 'pool', facilities: ['泳池', '儿童游戏室', '附近度假村健身房（学生免费）', '24小时保安'] },
  ],
  galleryImages: OCEAN_GALLERY,
  albumCategories: ['校园', '教室', '餐厅', '住宿', '设施'],
  heroCategories: ['校园', '教室', '餐厅'],
  courseGroups: [
    { icon: 'forum', title: 'ESL与口语强化', text: '入学测试后分级，每4周一次升级测试', courseIds: ['esl2', 'esl4', 'ps6', 'sf8'] },
    { icon: 'flight', title: '旅游英语', text: '旅行和日常生活英语', courseIds: ['travel'] },
    { icon: 'family_restroom', title: '亲子家庭英语', text: '孩子须家长陪同；家长可报监护人课程', courseIds: ['jep-kids', 'jep-junior', 'preschool', 'guardian'] },
  ],
  courseHighlights: { esl4: { badge: '最常报' } },
  courseDetailGuides: [
    CLASS_RULES,
    BOOK_GUIDE,
    {
      icon: 'child_care',
      title: '儿童日托',
      subtitle: '只在Ocean校区',
      facts: [
        { label: '时间', value: '08:00–17:00' },
        { label: '费用', value: '每周100美元，最少4周' },
        { label: '申请', value: '请在报名时加购；到校后再加购要看当时的名额' },
      ],
      points: ['日托费不在报价器的合计里，需要时请告诉顾问。'],
    },
  ],
  scheduleColumns: SCHEDULE,
  roomProfiles: OCEAN_ROOMS,
  dormRules: [
    { title: '校规', text: '门禁、记点和宿舍规定以Ocean校区到校说明为准；未成年学生须有家长陪同。' },
    { title: '房型安排', text: '背包客4人房只收女生，8人房只收男生；家庭三人房只接受两位成人加一个孩子。' },
  ],
  practicalGuides: [arrivalGuide('ocean'), OCEAN_SERVICE_GUIDE],
  faqs: [
    { question: 'Ocean校区现在可以报名吗？', answer: '学校通知Ocean校区暂停2026年11–12月的报名，2027年1–2月开放报名。请先请顾问向学校确认空位；报价器不接受2026年11–12月入学。', until: '2027-03-01' },
    { question: 'Ocean和Ayala校区怎么选？', answer: 'Ocean在麦克坦岛，规模小、有儿童游戏室和日托，适合亲子家庭和想要海岛环境的学生；Ayala在宿务市中心，生活方便，开设托业、雅思和商务英语。两个校区分开收费，报价也分开算。' },
    { question: '2027年暑假要加钱吗？', answer: '要。宿务语言学校协会通知：2027/07/04–08/28在读的周，每周加收60美元旺季附加费，不参与任何折扣。' },
    { question: '周末有饭吃吗？', answer: '学校的食宿费含周一至周五三餐；周六不供餐，周日只供晚餐（须提前登记）。' },
    { question: 'Ocean有4人家庭房吗？', answer: '没有了。学校2026年3月停用4人家庭房，改成女生背包客4人房；现在的家庭房是三人房，只接受两位成人加一个孩子。' },
  ],
};

export const WINNING_PAGE_CONTENT: Readonly<Record<WinningCampus, WinningCampusPage>> = { ayala: AYALA, ocean: OCEAN };

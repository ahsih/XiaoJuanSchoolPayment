// CPILS page text and data for the shared Philippine school page. Pure data (no Angular, DOM or
// storage), so the WeChat mini program can reuse it later. Prices and quote rules are not here: they
// live in the versioned content document (cpils-content-config.ts, cpils-pricing.ts).
// Never add the school's address, phone numbers, e-mail, website or social accounts.
import type {
  BasicInfoRow,
  CampusBuildingCard,
  CiaShortVideo,
  CiaVideoCard,
  CampusPracticalGuide,
  CourseDetailGuide,
  DailyScheduleRow,
  FaqItem,
  FitItem,
  GalleryImage,
} from '../cia-school/cia-page-content';
import type { PhRoomProfile, PhVideoTab } from '../school-page/ph-school-profile';

export const CPILS_PAGE_COPY = {
  heroLead: '2001年开办的宿务市区老牌英语学校，2009年起是圣何塞-雷科莱托斯大学（USJ-R）的英语中心。课程多、考试资源全，适合目标明确、想被学习节奏推动的学生。',
  overviewTitle: '30 秒看懂 CPILS',
  advisorTitle: '思达启航顾问点评',
  advisorText: 'CPILS的强项是考试和管理：雅思、托业课程每天12小时，带强制自习和每两周模考，校内就有英国文化协会雅思考场和ETS托业考场。只想轻松学口语可以选普通ESL，每天9小时、晚上自由。学校在宿务老城区，吃住学都在校内，生活方便，但校园不是度假村风格。',
  suitableTitle: '适合优先看 CPILS',
  notSuitableTitle: '不太适合的情况',
  galleryLead: '先看校园、教室、宿舍、餐厅和设施，再判断CPILS的学习与生活环境是否适合你。',
  videoLead: '学校拍摄的校园、课堂和学生生活片段。',
  campusIntro: '宿务市区校园，教学楼、宿舍、餐厅、泳池和健身房都在校内。',
  ruleTitle: '门禁与扣分',
  ruleText: '周日至周四22:00门禁，周五、周六24:00；未成年人一律22:00。迟到、上课说非英语、晚归等会扣分，累计6分起限制周末外出，10分开除。',
  finalCtaTitle: '想知道 CPILS 当前是否有空房和优惠？',
  finalCtaText: '把入学日期、学习周数、课程方向和房型偏好发给顾问，我们帮你确认2026或2027年价格、可用优惠和空房。',
} as const;

export const CPILS_FINAL_CTA_BADGES = ['快速响应', '专业顾问一对一', '方案与报价免费', '从申请到入学全程协助'];

export const CPILS_QUICK_INFO = [
  { icon: 'location_on', title: '位置', text: '宿务市区老城区，到麦克坦机场车程约40分钟' },
  { icon: 'account_balance', title: '背景', text: '2001年开办，2009年起为USJ-R大学的英语中心' },
  { icon: 'fact_check', title: '校内考场', text: '英国文化协会雅思考场（含机考）和ETS托业考场' },
  { icon: 'verified_user', title: '学习强度', text: '普通ESL每天9小时；斯巴达和考试课12小时含强制自习' },
  { icon: 'school', title: '课程方向', text: 'ESL、雅思、托业、托福、商务、职业英语和亲子课程' },
  { icon: 'bed', title: '食宿', text: '校内宿舍含自助三餐和每周清洁；可选普通房、无对外窗房和高级房' },
];

/** Key facts under the hero title (compact layout); the 门禁 line replaces the old campus section. */
export const CPILS_OVERVIEW_FACTS: ReadonlyArray<{ icon: string; label: string; value: string }> = [
  { icon: 'location_on', label: '位置', value: '宿务市区老城区，到麦克坦机场车程约40分钟' },
  { icon: 'history_edu', label: '背景', value: '2001年开办，2009年起为USJ-R大学的英语中心' },
  { icon: 'rule', label: '管理', value: '普通ESL每天9小时、晚上自由；斯巴达和考试课12小时含强制自习' },
  { icon: 'menu_book', label: '课程', value: 'ESL、雅思、托业、托福、商务、职业英语和亲子课程' },
  { icon: 'workspace_premium', label: '考试', value: '校内有英国文化协会雅思考场（含机考）和ETS托业考场' },
  { icon: 'bed', label: '住宿', value: '普通房、无对外窗房和高级房，单人到四人间；含三餐和每周清洁' },
  { icon: 'public', label: '学生', value: '日本、韩国、台湾、越南、中国学生为主' },
  { icon: 'door_front', label: '门禁', value: '周日至周四22:00，周五、周六24:00；累计扣分会限制外出' },
];

export const CPILS_BASIC_INFO: BasicInfoRow[] = [
  { label: '学校名称', value: 'CPILS（Center for Premier International Language Studies）' },
  { label: '所在地区', value: '菲律宾宿务市区（老城区）' },
  { label: '办学背景', value: '2001年开办；2009年起为圣何塞-雷科莱托斯大学（USJ-R）的英语中心' },
  { label: '学习强度', value: '普通ESL每天9小时（含2小时选修）；斯巴达、ESL Premium和考试课每天12小时' },
  { label: '学生国籍', value: '日本、韩国、台湾、越南、中国学生为主，另有泰国、俄罗斯、蒙古等' },
  { label: '分级', value: '6个大级各分低、中、高，共18级，约对应CEFR A1至C1' },
];

export const CPILS_SUITABLE_FOR: FitItem[] = [
  { title: '准备雅思、托业或托福，需要模考和强制自习', text: '' },
  { title: '自律较弱，希望学校帮你管住学习节奏', text: '' },
  { title: '想在校内参加官方雅思或托业考试', text: '' },
  { title: '家长和孩子想一起去学英语（孩子9岁及以上）', text: '' },
];

export const CPILS_NOT_SUITABLE_FOR: FitItem[] = [
  { title: '想住度假村风格的新校园', text: '' },
  { title: '完全不想接受门禁、扣分和出勤要求', text: '' },
  { title: '7、8月想报Light轻松课程（暑期不开放）', text: '' },
];

export const CPILS_CAMPUS_BUILDINGS: CampusBuildingCard[] = [
  { code: 'STUDY', title: '教学区', icon: 'school', facilities: ['一对一小隔间教室', '1:4、1:8小班教室', '雅思资源中心（报考雅思的学生免费使用）', '自习室'] },
  { code: 'EXAM', title: '官方考场', icon: 'fact_check', facilities: ['英国文化协会雅思考场，机考每周五至周一', 'ETS托业官方考场（听读说写）'] },
  { code: 'LIFE', title: '休闲设施', icon: 'pool', facilities: ['游泳池（晚上开放）', '健身房，有教练', '咖啡厅：台球、乒乓球、卡拉OK', '休息室可看Netflix'] },
  { code: 'SERVICE', title: '餐饮与服务', icon: 'restaurant', facilities: ['自助三餐，周末也有', '便利店', '诊所和护士', '24小时保安和监控'] },
];

/** Monday–Thursday and Friday timetable (45-minute classes). */
export const CPILS_SCHEDULE: { weekday: DailyScheduleRow[]; friday: DailyScheduleRow[] } = {
  weekday: [
    { time: '07:00–08:00', activity: '早餐', kind: 'meal' },
    { time: '08:00–11:30', activity: '第1–4节', kind: 'class' },
    { time: '11:30–12:30', activity: '午餐', kind: 'meal' },
    { time: '12:30–16:55', activity: '第5–9节（Light课程13:15结束）', kind: 'class' },
    { time: '16:55–17:55', activity: '晚餐', kind: 'meal' },
    { time: '17:55–20:30', activity: '第10–12节：斯巴达、Premium和考试课的晚课与强制自习', kind: 'test' },
    { time: '20:30以后', activity: '自由时间（22:00门禁）', kind: 'free' },
  ],
  friday: [
    { time: '07:00–08:00', activity: '早餐', kind: 'meal' },
    { time: '08:00–11:30', activity: '第1–4节', kind: 'class' },
    { time: '11:30–12:30', activity: '午餐', kind: 'meal' },
    { time: '12:30–16:00', activity: '第5–8节', kind: 'class' },
    { time: '16:10–16:40', activity: '毕业典礼', kind: 'activity' },
    { time: '16:10–20:30', activity: '雅思学生：自习或模考', kind: 'test' },
    { time: '晚上', activity: '自由时间（24:00门禁）', kind: 'free' },
  ],
};

/**
 * Course notes. A note with courseIds opens inside those course rows and explains only them; the note
 * without courseIds is listed once under the course list (所有课程通用说明).
 */
export const CPILS_COURSE_DETAIL_GUIDES: CourseDetailGuide[] = [
  {
    icon: 'workspace_premium',
    title: '雅思保分目标',
    subtitle: '入学分数决定保分目标',
    courseIds: ['ielts-guarantee-8-weeks', 'ielts-guarantee-12-weeks'],
    facts: [
      { label: '8周', value: '入学4.0–4.5分保5.5分；入学5.0分保6.0分' },
      { label: '12周', value: '入学5.5分保6.5分；6.0分保7.0分；6.5分保7.5分' },
      { label: '模考', value: '每月2次，周五晚；周六上午补考' },
    ],
    points: ['入学分数不够时，建议先读雅思预备课程或雅思课程。'],
    notice: '保分的出勤和模考要求以学校入学说明为准，报名前请顾问确认。',
  },
  {
    icon: 'workspace_premium',
    title: '托业保分目标',
    subtitle: '固定12周 · 入学分数决定保分目标',
    courseIds: ['toeic-guarantee'],
    facts: [
      { label: '保分目标', value: '入学400分保600分；530分保700分；670分保800分；800分保900分' },
      { label: '模考', value: '每月2次，周四晚；周六上午补考' },
    ],
    points: ['入学分数不够时，建议先读托业课程。'],
    notice: '保分的出勤和模考要求以学校入学说明为准，报名前请顾问确认。',
  },
  {
    icon: 'family_restroom',
    title: '亲子课程怎么报',
    subtitle: '家长和孩子同校学习 · 孩子9岁及以上',
    courseIds: ['pcp-intensive-parent', 'pcp-intensive-child', 'pcp-basic'],
    facts: [
      { label: '强化课程', value: '家长每天7小时（4节1:1）；孩子淡季每天7节1:1、不设团体课，旺季每天9小时（5节1:1加团体课）' },
      { label: '基础课程', value: '家长和孩子每天各5小时（3节1:1），课程费同价' },
      { label: '房型', value: '高级双人、三人或四人房，含Wi-Fi、智能电视、冰箱和翻新卫浴' },
      { label: '孩子学费', value: '旺季（2027/07/04–08/28）4周1,092美元，其余日期都是淡季，4周1,197美元；跨季按周分开算' },
    ],
    points: ['每人按自己的课程和床位报价，注册费每人125美元。'],
  },
  {
    icon: 'quiz',
    title: '分级、测试与换课',
    subtitle: '每4周进度测试 · 下周一换课生效',
    facts: [
      { label: '分级', value: '6个大级各分低、中、高，共18级' },
      { label: '进度测试', value: '每4周一次，下周三领成绩' },
      { label: '换课换老师', value: '周二至周三申请，下周一生效；第一周不能换课' },
      { label: '高峰期', value: '1、2、6、7、8月不能换课' },
      { label: '结业证书', value: '出勤95%以上并参加进度测试' },
    ],
    points: ['改读雅思、托业、托福、商务或PMC课程，须至少还剩4周。'],
  },
];

export const CPILS_DORM_RULES = [
  { title: '访客', text: '只能在大厅或便利店见面，不能进房间；平日9:00–11:00、14:00–16:00，每次30分钟。' },
  { title: '安静时段', text: '23:00至次日6:00。' },
  { title: '异性房间', text: '禁止进入异性房间，违反直接开除。' },
  { title: '酒和烟', text: '不能带酒进校；只能在4楼吸烟室或指定区域吸烟。' },
  { title: '房内电器', text: '不能在房间做饭或用大功率电器。' },
  { title: '换房', text: '向宿舍协调员申请，只能周末换；升级房型补差价，降级不退款。' },
  { title: '清洁与赔偿', text: '每周一次打扫并换床品；人为损坏从押金扣除，房卡遗失换门锁1,000比索。' },
];

export const CPILS_PRACTICAL_GUIDES: CampusPracticalGuide[] = [
  {
    icon: 'flight_land',
    eyebrow: 'ARRIVAL',
    title: '抵达与第一周',
    facts: [
      { label: '接机', value: '学校接机，须至少提前4周告知航班' },
      { label: '分班', value: '到校后分班测试，按18个等级分班' },
      { label: '换课', value: '第一周不能换课，周四可申请，下周一生效' },
      { label: '电话卡', value: 'Globe或Smart预付卡，商场里能买和充值' },
      { label: '插座', value: '220V' },
    ],
    note: '入境和签证材料由思达启航顾问逐项帮你核对。',
  },
  {
    icon: 'room_service',
    eyebrow: 'SCHOOL SERVICES',
    title: '学校服务与开放时间',
    facts: [
      { label: '用餐', value: '平日 07:00–08:45、11:15–12:45、16:30–18:00；周末 07:00–09:10、11:30–13:00、17:30–19:00' },
      { label: '洗衣', value: '周一、三、五收衣，约2天取回，30比索／公斤；内衣请自己手洗' },
      { label: '诊所', value: '平日 08:00–22:00；医生每周一 16:00–18:00 坐诊' },
      { label: '健身房', value: '平日 06:00–08:00、17:00–23:00；周末 06:00–08:00、16:00–23:00' },
      { label: '游泳池', value: '周日至周四 18:00–22:00；周五、周六 18:00–23:00' },
      { label: '便利店', value: '平日 07:00–22:00，周末分时段营业' },
    ],
    note: '',
  },
  {
    icon: 'directions_walk',
    eyebrow: 'GOING OUT',
    title: '外出与周末出行',
    facts: [
      { label: '门禁', value: '周日至周四22:00；周五、周六和次日放假时24:00' },
      { label: '外宿', value: '周五、周六晚或假期，须出示酒店预订并签外宿单' },
      { label: '周末出行', value: '周五16:50前领表签好；市区商场、超市等不需要填表' },
      { label: '未成年人', value: '门禁22:00；15岁及以下平日不能外出，周末须成年人陪同；不能外宿（父母陪同除外）' },
    ],
    note: '',
  },
  {
    icon: 'celebration',
    eyebrow: 'ACTIVITIES',
    title: '校园活动',
    facts: [
      { label: '校内', value: '英语趣味活动、团队竞赛、万圣节、圣诞晚会、校庆、每周五毕业典礼' },
      { label: '周末', value: '跳岛、海边度假村、宿务城市游、保龄球、溜冰等，自愿报名' },
    ],
    note: '',
  },
  {
    icon: 'receipt_long',
    eyebrow: 'OTHER FEES',
    title: '其他收费',
    facts: [
      { label: '延住', value: '1,200比索／天，超过2天按一周收' },
      { label: '送机', value: '1,000比索／人' },
      { label: '风扇', value: '租金200比索／4周，押金500比索' },
      { label: '保险箱', value: '押金1,000比索' },
      { label: '房卡、号码牌遗失', value: '换门锁1,000比索；号码牌300比索' },
    ],
    note: '到校后按比索在学校缴纳。',
  },
  {
    icon: 'rule',
    eyebrow: 'SCHOOL RULES',
    title: '出勤与扣分',
    facts: [
      { label: '出勤', value: '迟到10分钟以上算缺席；缺课不补' },
      { label: '英语', value: '上课说英语以外的语言扣1分' },
      { label: '扣分', value: '6–7分周五禁止外出；8–9分周五、周六禁止外出；10分开除' },
      { label: '延课', value: '须在结束前4周申请并付清' },
      { label: '公共假期', value: '菲律宾公共假期不上课，不补课不退款' },
    ],
    note: '',
  },
];

export const CPILS_FAQS: FaqItem[] = [
  {
    question: 'CPILS适合什么样的学生？',
    answer: '适合目标明确、愿意按学校节奏学习的学生，尤其是备考雅思、托业、托福的人。只想轻松练口语、喜欢自由安排的学生，可以选普通ESL，或者比较其他学校。',
  },
  {
    question: '斯巴达和普通ESL有什么区别？',
    answer: '斯巴达每天12小时：5节1:1、2节1:4、2节1:12，加选修和2小时强制自习；普通ESL每天9小时，晚上没有强制自习。两者门禁一样。',
  },
  {
    question: '2026年和2027年价格怎么算？',
    answer: '2026年内开课按2026年价格。2026/09/29起报名、2027年开课按2027年价格，可用2027年学校优惠；2026/09/28及之前报名、2027/01/01–05/29开课保留2026年价格，不享2027年学校优惠。报价器会按你填的报名日和开课日自动判断。',
  },
  {
    question: '现在报名有哪些优惠？',
    answer: '所有学生都享思达启航课程费和住宿费9折。2027年开课：学校奖学金再减5%，无对外窗单人／双人房每满4周减50美元（24周最多减300美元），雅思一次注册12周赠1次官方考试，托业课程按周数赠1至6次官方考试；2027/05/31–08/29开课不适用学校优惠。2026年内开课：淡季入学再享95折，学习期覆盖圣诞或新年另减75或150美元。',
  },
  {
    question: '暑假有附加费吗？',
    answer: '2027年7月5日至8月29日的学习周，每周加收60美元，不参与折扣。2026/12/31前报名2027年暑期的学生至少要报8周，4周名额等学校通知。',
  },
  {
    question: '亲子课程怎么报？',
    answer: '家长和孩子都要报名，孩子9岁及以上，住高级双人、三人或四人房。强化课程家长每天7小时、孩子9小时；基础课程每人每天5小时。可以在报价器里给家长和孩子分别选课程，用多人报价一起算。',
  },
  {
    question: '页面报价包含全部费用吗？',
    answer: '不包含。报价器算的是交给学校的注册费、课程费、住宿费、优惠和暑假附加费；SSP、签证续签、管理费、水电和教材等到校学杂费另外列出，用比索在学校缴纳。',
  },
  {
    question: '思达启航会协助签证和入境吗？',
    answer: '会。思达启航顾问免费协助菲律宾入境和签证相关手续，学生按顾问指引准备个人资料即可。读得较久需要续签时，学校统一带去移民局办理。',
  },
];

/** School photos by album; the first campus, classroom and facility photos open the hero and each album. */
export const CPILS_GALLERY_IMAGES: GalleryImage[] = [
  { category: '校园', title: '主楼外观（白天）', description: '晴天下沿街的米黄色多层主楼，楼前马路停着车辆。', src: 'assets/cpils/gallery/campus-building-day.webp' },
  { category: '校园', title: '主楼夜景', description: '傍晚亮灯的主楼外观，天空呈深蓝色，路面有车灯光轨。', src: 'assets/cpils/gallery/campus-building-night.webp' },
  { category: '校园', title: '学校正门', description: '正门招牌写着学校英文全称，门头有“WELCOME TO CPILS”，门边有保安值守台。', src: 'assets/cpils/gallery/campus-entrance.webp' },
  { category: '校园', title: '门口的学生', description: '四名学生背着书包在挂有CPILS字样的建筑门口交谈。', src: 'assets/cpils/gallery/campus-students-entrance.webp' },
  { category: '校园', title: '一楼大厅', description: '大厅墙上是世界地图壁画和教职员照片墙，右侧有欢迎牌与方格背景墙。', src: 'assets/cpils/gallery/campus-lobby.webp' },
  { category: '校园', title: '校内泳池', description: '椰树环绕的室外泳池，池边立着彩色CPILS字样。', src: 'assets/cpils/gallery/campus-pool-01.webp' },
  { category: '校园', title: '泳池与楼栋', description: '池底拼出CPILS字样的泳池，旁边是多层楼栋，蓝天白云。', src: 'assets/cpils/gallery/campus-pool-02.webp' },
  { category: '校园', title: '泳池夜景', description: '夜晚灯光下的泳池、树木和彩色CPILS字样。', src: 'assets/cpils/gallery/campus-pool-night.webp' },
  { category: '校园', title: '篮球场', description: '楼栋之间的空地上有篮球架和黄色涂装场地。', src: 'assets/cpils/gallery/campus-basketball-court.webp' },
  { category: '校园', title: '池边学习', description: '一群学生围坐在泳池边圆桌旁看书讨论。', src: 'assets/cpils/gallery/campus-poolside-study-01.webp' },
  { category: '校园', title: '池边讨论', description: '泳池边圆桌旁学生讨论的近景，桌上有书本和饮料。', src: 'assets/cpils/gallery/campus-poolside-study-02.webp' },
  { category: '校园', title: '新生合影', description: '新生在泳池边举着“Welcome to CPILS”横幅合影。', src: 'assets/cpils/gallery/new-students-group.webp' },
  { category: '校园', title: '结业合影', description: '学生手持证书在“25th Silver Jubilee”背景板前合影。', src: 'assets/cpils/gallery/graduation-group.webp' },
  { category: '校园', title: '外籍教师合影', description: '七位外籍教师在泳池边站成一排合影。', src: 'assets/cpils/gallery/teachers-native.webp' },
  { category: '校园', title: '教职员大合影', description: '俯拍众多教职员工聚集在CPILS字样泳池旁合影。', src: 'assets/cpils/gallery/teachers-all-staff.webp' },
  { category: '校园', title: '跳岛游合影', description: '学生在海岛沙滩边的长椅上合影，背景是椰树。', src: 'assets/cpils/gallery/activity-island-hopping-01.webp' },
  { category: '校园', title: '跳岛游乘船', description: '学生坐在海上的边架艇船舷上合影。', src: 'assets/cpils/gallery/activity-island-hopping-02.webp' },
  { category: '校园', title: '海滩度假村', description: '大批学生在白沙海滩上合影，后方是彩旗和蓝天。', src: 'assets/cpils/gallery/activity-beach-resort.webp' },
  { category: '校园', title: '利亚神庙夜游', description: '夜晚学生在利亚神庙（Temple of Leah）台阶前合影。', src: 'assets/cpils/gallery/activity-temple-of-leah.webp' },
  { category: '校园', title: '宿务道观', description: '学生在道观塔楼前合影。', src: 'assets/cpils/gallery/activity-taoist-temple.webp' },
  { category: '校园', title: 'Anjo World乐园', description: '学生乘坐游乐园旋转设施，背景是过山车轨道。', src: 'assets/cpils/gallery/activity-anjo-world.webp' },
  { category: '校园', title: '溜冰活动', description: '学生在室内溜冰场坐在海豹形辅助器上合影。', src: 'assets/cpils/gallery/activity-ice-skating.webp' },
  { category: '教室', title: '一对一教室', description: '小教室里有一张小桌、两把白椅、白板和贴满照片与便签的布告板。', src: 'assets/cpils/gallery/classroom-1on1-room.webp' },
  { category: '教室', title: '一对一课堂', description: '老师与学生隔桌面对面上课，桌上有讲义和录音笔。', src: 'assets/cpils/gallery/classroom-1on1-01.webp' },
  { category: '教室', title: '一对一口语', description: '学生坐在课桌前面带笑容地说话，桌上摊着教材。', src: 'assets/cpils/gallery/classroom-1on1-02.webp' },
  { category: '教室', title: '小组课教室', description: '小教室里有长桌和白椅，墙上贴着音标表和画作。', src: 'assets/cpils/gallery/classroom-group4-room.webp' },
  { category: '教室', title: '外教小组课', description: '外籍老师俯身指导两名学生，长桌旁另有空座。', src: 'assets/cpils/gallery/classroom-group4-01.webp' },
  { category: '教室', title: '小组课堂', description: '穿蓝色制服的老师站在白板前给学生上课。', src: 'assets/cpils/gallery/classroom-group4-02.webp' },
  { category: '教室', title: '大班教室', description: '教室里摆着多排课桌，前方有电子大屏，墙上有“Keep learning. Keep growing.”横幅。', src: 'assets/cpils/gallery/classroom-large-room.webp' },
  { category: '教室', title: '圆桌团体课', description: '外籍老师和多名学生围坐圆桌上课，白板上有板书。', src: 'assets/cpils/gallery/classroom-group-class-01.webp' },
  { category: '教室', title: '外教团体课', description: '外籍老师俯身给围坐的学生讲解教材，墙上贴满照片。', src: 'assets/cpils/gallery/classroom-group-class-02.webp' },
  { category: '教室', title: '雅思托业团体课', description: '老师在大屏前讲解阅读文章，十多名学生在长桌旁听课。', src: 'assets/cpils/gallery/classroom-ielts-toeic-group.webp' },
  { category: '教室', title: '视听室做题', description: '视听室里学生伏案做题。', src: 'assets/cpils/gallery/classroom-avr-01.webp' },
  { category: '教室', title: '视听室讲课', description: '老师在视听室大屏前讲课，学生坐在课桌后听讲。', src: 'assets/cpils/gallery/classroom-avr-02.webp' },
  { category: '教室', title: '自习室', description: '一排排带隔板的自习座位。', src: 'assets/cpils/gallery/self-study-room.webp' },
  { category: '教室', title: '教学楼走廊', description: '教室走廊两侧是木门和玻璃窗教室。', src: 'assets/cpils/gallery/classroom-hallway.webp' },
  { category: '设施', title: '雅思资源中心', description: '资源中心里有U形会议桌、绿色椅子、电子屏和摆满雅思教材的书架。', src: 'assets/cpils/gallery/ielts-resource-centre-01.webp' },
  { category: '设施', title: '资源中心学习', description: '几名学生在资源中心沙发区用平板和电脑讨论。', src: 'assets/cpils/gallery/ielts-resource-centre-02.webp' },
  { category: '设施', title: '雅思备考书架', description: '几名学生在雅思资源中心的书架前一起看备考书。', src: 'assets/cpils/gallery/ielts-resource-centre-03.webp' },
  { category: '设施', title: '雅思UKVI考场', description: '纸笔考场里整齐摆放课桌。', src: 'assets/cpils/gallery/ielts-test-ukvi-room.webp' },
  { category: '设施', title: '雅思机考考场', description: '一排带隔板的电脑座位和耳机。', src: 'assets/cpils/gallery/ielts-test-computer-room.webp' },
  { category: '设施', title: '雅思口语考室', description: '三间口语考试室的门（门牌Speaking Room 1–3）。', src: 'assets/cpils/gallery/ielts-test-speaking-rooms.webp' },
  { category: '设施', title: '雅思候考区', description: '候考区摆着长凳和彩色坐垫，墙上贴有“Silence please”标识。', src: 'assets/cpils/gallery/ielts-test-waiting-area.webp' },
  { category: '设施', title: '托业考场（考试中）', description: '大厅里众多考生正在托业考试中作答。', src: 'assets/cpils/gallery/toeic-test-centre-01.webp' },
  { category: '设施', title: '托业考场', description: '空置的考场里整齐排列着课桌。', src: 'assets/cpils/gallery/toeic-test-centre-02.webp' },
  { category: '设施', title: '健身房跑步机', description: '多人在健身房的一排跑步机上运动。', src: 'assets/cpils/gallery/gym-01.webp' },
  { category: '设施', title: '健身房器械', description: '健身房里有动感单车、跑步机和沙袋。', src: 'assets/cpils/gallery/gym-02.webp' },
  { category: '设施', title: '力量训练区', description: '力量训练区摆着哑铃、杠铃和训练凳。', src: 'assets/cpils/gallery/gym-03.webp' },
  { category: '设施', title: '瑜伽课', description: '学生在镜面舞蹈室的瑜伽垫上做拉伸动作。', src: 'assets/cpils/gallery/gym-yoga-class.webp' },
  { category: '设施', title: '学生休息室', description: '休息室有紫色灯带、皮沙发和中间的大软垫平台。', src: 'assets/cpils/gallery/lounge-01.webp' },
  { category: '设施', title: '夹层休息区', description: '夹层休息区摆着皮沙发、茶几和抱枕。', src: 'assets/cpils/gallery/lounge-02.webp' },
  { category: '设施', title: '洗衣服务台', description: '学生在洗衣房柜台交送衣物，货架上放着打包好的衣物。', src: 'assets/cpils/gallery/laundry.webp' },
  { category: '设施', title: '医务室', description: '医务室里护士与学生隔桌交谈。', src: 'assets/cpils/gallery/clinic-01.webp' },
  { category: '设施', title: '医务室病床', description: '医务室内的休息床和药品收纳盒。', src: 'assets/cpils/gallery/clinic-02.webp' },
  { category: '设施', title: '教务办公室', description: '教务办公室里多名工作人员在电脑前办公。', src: 'assets/cpils/gallery/academic-office.webp' },
  { category: '餐厅', title: '学生食堂', description: '宽敞的食堂里有长桌和黄色椅子，远处是自助餐台。', src: 'assets/cpils/gallery/dining-hall.webp' },
  { category: '餐厅', title: '早餐面包台', description: '自助台上摆着面包、点心和烤面包机，背景有“Congratulations Graduates”展板。', src: 'assets/cpils/gallery/dining-bread-corner.webp' },
  { category: '餐厅', title: '沙拉吧', description: '沙拉吧里有泡菜、黄瓜、土豆块和多种配菜。', src: 'assets/cpils/gallery/dining-salad-bar.webp' },
  { category: '餐厅', title: '自助餐台', description: '自助餐保温餐盘里盛着多种菜肴。', src: 'assets/cpils/gallery/dining-buffet.webp' },
  { category: '餐厅', title: '分格餐盘', description: '分格餐盘里有米饭、橙子、凉拌菜和鱼类菜肴。', src: 'assets/cpils/gallery/dining-meal-tray.webp' },
  { category: '餐厅', title: '水果', description: '自助台上的西瓜和苹果，旁边一盘炒蛋类菜肴。', src: 'assets/cpils/gallery/dining-fruit.webp' },
  { category: '餐厅', title: '热菜（一）', description: '保温餐盘里的炸肉块配洋葱和青椒。', src: 'assets/cpils/gallery/dining-dish-01.webp' },
  { category: '餐厅', title: '热菜（二）', description: '保温餐盘里的炒肉配洋葱和彩椒。', src: 'assets/cpils/gallery/dining-dish-02.webp' },
  { category: '餐厅', title: '咖啡厅娱乐区', description: '咖啡厅里有台球桌、乒乓球桌和黄色座椅区。', src: 'assets/cpils/gallery/cafe-01.webp' },
  { category: '餐厅', title: '咖啡厅吧台', description: '石材吧台和菜单灯箱，墙上有咖啡主题字画。', src: 'assets/cpils/gallery/cafe-counter.webp' },
  { category: '餐厅', title: '台球', description: '两人在咖啡厅打台球，旁边有乒乓球桌。', src: 'assets/cpils/gallery/cafe-billiards.webp' },
  { category: '餐厅', title: '小卖部', description: '小卖部里有零食货架和饮料冷柜。', src: 'assets/cpils/gallery/snack-bar-01.webp' },
  { category: '餐厅', title: '小卖部用餐区', description: '学生坐在小卖部用餐区的木桌旁吃东西、写作业。', src: 'assets/cpils/gallery/snack-bar-02.webp' },
  { category: '住宿', title: '带窗单人间', description: '单人间里有书桌、衣柜和穿衣镜，带独立卫浴。', src: 'assets/cpils/rooms/single-02.webp' },
  { category: '住宿', title: '双人间', description: '两张单人床、书桌和衣柜。', src: 'assets/cpils/rooms/twin-01.webp' },
  { category: '住宿', title: '三人间', description: '三张单人床和靠墙书桌。', src: 'assets/cpils/rooms/triple-01.webp' },
  { category: '住宿', title: '高级双人间', description: '高级房有壁挂电视和小冰箱。', src: 'assets/cpils/rooms/premium-01.webp' },
  { category: '住宿', title: '宿舍走廊', description: '宿舍楼走廊，每层有饮水机。', src: 'assets/cpils/rooms/hallway-01.webp' },
  { category: '住宿', title: '走廊饮水机', description: '宿舍走廊里的饮水机。', src: 'assets/cpils/rooms/hallway-03.webp' },
];

export const CPILS_VIDEO_CARDS: CiaVideoCard[] = [
  {
    code: 'CPILS',
    label: 'SCHOOL FILM',
    title: 'CPILS 学校介绍',
    text: '学校2027年介绍片：教学楼、课堂、考场、食堂、宿舍和课外活动。',
    poster: '/assets/cpils/videos/poster-cpils-intro-2027.jpg',
    videoSrc: '/assets/cpils/videos/cpils-intro-2027.mp4',
    contentType: 'video/mp4',
    details: ['一对一与团体课堂', '雅思与托业官方考场', '宿舍各房型与高级房', '时长 2:30'],
  },
];

export const CPILS_LIFE_VIDEOS: CiaShortVideo[] = [];

/** Videos of the hero album (compact layout); the school film opens it. */
export const CPILS_VIDEO_TABS: PhVideoTab[] = [
  {
    label: '校园视频',
    icon: 'videocam',
    items: CPILS_VIDEO_CARDS.map(card => ({
      title: card.title, text: card.text, src: card.videoSrc, poster: card.poster, duration: '2:30', shape: 'wide' as const,
    })),
  },
];

const roomPhotos = (...files: string[]) => files.map(file => `assets/cpils/rooms/${file}.webp`);
const SHARED_BATH = ['twin-05', 'twin-06'];
const REGULAR_HIGHLIGHTS = ['空调、独立卫浴和冷热水淋浴', '每周一次清洁并更换床品', '洗衣30比索／公斤，周一、三、五收衣'];
/** Price-list rooms whose card opens each photo set (CPILS shows no room codes). */
const RATE_ROOM_IDS: Record<string, readonly string[]> = {
  single: ['regular-single'],
  twin: ['regular-twin'],
  triple: ['regular-triple'],
  quad: ['regular-quad'],
  'no-window': ['no-window-single', 'no-window-twin'],
  premium: ['premium-single', 'premium-twin', 'premium-triple', 'premium-quad'],
};
const roomProfile = (id: string, label: string, gallery: string[], suitable: string, note: string, highlights: string[]): PhRoomProfile => ({
  id, label, location: '校内', suitable, note, highlights, image: gallery[0], gallery, imageAlt: `CPILS${label}实景`, rateIds: RATE_ROOM_IDS[id],
});

export const CPILS_ROOM_PROFILES: PhRoomProfile[] = [
  roomProfile('single', '单人房', roomPhotos('single-02', 'single-01', 'single-05'), '重视隐私、需要安静学习空间的学生', '一人一间，带独立卫浴。', REGULAR_HIGHLIGHTS),
  roomProfile('twin', '双人房', roomPhotos('twin-01', 'twin-02', 'twin-03', ...SHARED_BATH), '朋友同行或想兼顾预算的学生', '两人一间，合住时浴室每次一人使用。', REGULAR_HIGHLIGHTS),
  roomProfile('triple', '三人房', roomPhotos('triple-01', 'triple-02', 'triple-03', ...SHARED_BATH), '想控制预算的学生', '三人一间，不同楼层布置可能不同。', REGULAR_HIGHLIGHTS),
  roomProfile('quad', '四人房', roomPhotos('quad-02', 'quad-01', ...SHARED_BATH), '预算优先的学生', '四人一间，费用最低。', REGULAR_HIGHLIGHTS),
  roomProfile('no-window', '无对外窗房', roomPhotos('single-03', 'single-04', 'twin-04'), '想省住宿费、对采光要求不高的学生', '单人或双人，窗户面向走廊；2027年开课每满4周减50美元。', REGULAR_HIGHLIGHTS),
  roomProfile(
    'premium', '高级房', roomPhotos('premium-01', 'premium-02', 'premium-03', 'premium-04', 'premium-05', 'premium-06', 'premium-07', 'premium-08'),
    '重视住宿舒适度的学生和亲子家庭', '单人、双人、三人、四人四种；亲子课程须住高级双人、三人或四人房。',
    ['Wi-Fi和智能电视', '冰箱和更舒适的被子枕头', '翻新过的卫生间和淋浴', '每周一次清洁并更换床品'],
  ),
];

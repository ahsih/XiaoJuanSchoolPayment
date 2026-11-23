// Text and data of the B'Cebu school page, from B'Cebu's 2026 price list, the 2026-10-19 Chinese orientation,
// the 2027 holiday poster, the 2027 off-season and summer notices, the 2026 Lapu-Lapu City business permit and
// the school's SSP accreditation (all received 2026-11-23). The shared Philippine school template reads it
// through bcebu-page-profile.ts. Keep it pure data (no Angular, DOM or storage), so the WeChat mini program can
// reuse it. Never add the school's phone, email, address, website, chat groups or social accounts.
import type {
  BasicInfoRow,
  CampusBuildingCard,
  CampusPracticalGuide,
  CourseDetailGuide,
  DailyScheduleRow,
  FaqItem,
  HolidayCalendar,
} from '../cia-school/cia-page-content';
import { SCHOOL_REFERENCE_NOTE } from '../school-page/school-reference-note';
import {
  BCEBU_IELTS_GUARANTEE_ID,
  BCEBU_JUNIOR_COURSE_ID,
  BCEBU_KIDS_COURSE_ID,
  BCEBU_LITE_40_COURSE_ID,
} from './bcebu-pricing';

/** Closes every content section once; the same line as on every Philippine school page. */
export const BCEBU_REFERENCE_NOTE = SCHOOL_REFERENCE_NOTE;

export const BCEBU_PAGE_TEXT = {
  heroLead: '宿务麦克坦岛上的一对一为主的语言学校，课程从4岁幼儿到40岁以上都有，半斯巴达管理，也可选斯巴达。',
  advisorText: "B'Cebu 在宿务麦克坦岛的拉普拉普市，校内有泳池、健身房和泳池酒吧，平日晚上有校车去 Mactan Newtown 和 LG Garden Walk 商场。默认半斯巴达：白天没课可以外出，有课的前一晚23:00前回校；想更专心可以报 B'Sparta 斯巴达课程。课程选择多，4–6岁幼儿、小学和初中生、想慢慢学的40岁以上学员和雅思考生都有合适的课程，适合成人、亲子家庭和长期学生。",
  campusIntro: '教室、宿舍、餐厅、泳池和健身房都在同一个校园，宿舍按人数分单人间到三人间，另有亲子可住的双人间+客厅。',
  coursesIntro: '按学习目标分组，每门课下面是每天的课时；点开可看适合人群和说明。每节课45分钟。',
  roomsPhotoIntro: '点选房型查看实景；各房型价格见上方住宿费表。',
  finalCtaTitle: "想确认 B'Cebu 的空房和最新优惠？",
  finalCtaText: '告诉顾问你的入学日期、周数和想住的房型，我们帮你确认房间并做一份完整报价。',
} as const;

export const BCEBU_QUICK_INFO = [
  { icon: 'location_on', title: '麦克坦岛', text: '拉普拉普市；平日晚上校车去 Mactan Newtown 和 LG Garden Walk' },
  { icon: 'verified', title: '半斯巴达', text: "可选 B'Sparta 斯巴达；有课的前一晚23:00前回校" },
  { icon: 'school', title: '一对一为主', text: '每节45分钟；小组课每班最多6人' },
  { icon: 'pool', title: '校内设施', text: '泳池、健身房、台球、乒乓球和篮球场' },
  { icon: 'family_restroom', title: '亲子友好', text: '4–6岁幼儿课程、小学和初中生课程' },
  { icon: 'psychology', title: "B'AI 辅导", text: '按一对一课堂内容生成每日学习重点' },
];

/** Key facts under the hero title (compact layout); what each area has is in BCEBU_CAMPUS_BUILDINGS. */
export const BCEBU_OVERVIEW_FACTS: ReadonlyArray<{ icon: string; label: string; value: string }> = [
  { icon: 'location_on', label: '位置', value: '宿务麦克坦岛拉普拉普市；平日晚上有校车去 Mactan Newtown 和 LG Garden Walk 商场' },
  { icon: 'rule', label: '管理', value: "半斯巴达，可报 B'Sparta 斯巴达；有课的前一晚23:00前回校，其他日子01:00前" },
  { icon: 'menu_book', label: '课程', value: 'ESL、斯巴达、商务英语、雅思（含保证班）；青少年、4–6岁幼儿和40岁以上轻松课程' },
  { icon: 'schedule', label: '上课', value: '每节45分钟，一对一为主；小组课每班最多6人，每月至少18个上课日' },
  { icon: 'event', label: '入学', value: '周六或周日入住，周一分级测试和新生说明会，周二开课' },
  { icon: 'bed', label: '住宿', value: '单人间、双人间、双人间+客厅、三人间，另有女生2+1宿舍（淡季开放）' },
  { icon: 'event_available', label: '暑假', value: '每周加收40美元：2026/7/5–8/15、2027/6/27–8/21' },
];

export const BCEBU_BASIC_INFO: BasicInfoRow[] = [
  { label: '学校', value: "B'Cebu 语言学校" },
  { label: '位置', value: '菲律宾宿务麦克坦岛（拉普拉普市）' },
  { label: '管理方式', value: "半斯巴达（可报 B'Sparta 斯巴达）" },
  { label: '课程', value: 'ESL、斯巴达、商务英语、雅思、青少年、幼儿和40岁以上轻松课程' },
  { label: '住宿', value: '单人间、双人间、双人间+客厅、三人间、女生2+1宿舍' },
  { label: '入学', value: '周六或周日入住，周一分级测试，周二开课' },
];

export const BCEBU_SUITABLE_FOR = [
  '想以一对一为主、课程选择多的成人',
  '带孩子的家庭：4–6岁幼儿、小学和初中生都有课程',
  '40岁以上、想放慢节奏学习的学员',
  '准备雅思、想要斯巴达管理的学生',
];

export const BCEBU_NOT_SUITABLE_FOR = [
  '想走读或住校外的学生（学校不接受走读）',
  '暑假（7–8月）才临时报名的学生：每周加收40美元，房间紧张，2+1宿舍不开放',
  '想要学校帮忙洗衣的学生（学校不提供，一楼有付费洗衣房）',
];

export const BCEBU_CAMPUS_BUILDINGS: CampusBuildingCard[] = [
  { code: 'STUDY', title: '教学与服务', icon: 'school', facilities: ['一对一和小组教室', '图书馆', '二楼信息台：换课、换老师、报活动', '演示厅：新生说明会和每周五毕业典礼'] },
  { code: 'DORM', title: '宿舍', icon: 'bed', facilities: ['单人间、双人间、双人间+客厅、三人间', '女生2+1宿舍（和伙伴老师同住）', '一楼接待处24小时（用餐和凌晨休息时段除外）', '每周打扫2次；一楼有付费洗衣房'] },
  { code: 'LIFE', title: '休闲设施', icon: 'pool', facilities: ['游泳池（未成年须监护人陪同）', '泳池酒吧 17:00–23:00', '健身房（15岁以下不能用）', '台球、乒乓球和篮球场'] },
  { code: 'DINING', title: '餐厅与医务室', icon: 'restaurant', facilities: ['一楼餐厅，一日三餐', '医务室周一至周五 09:00–18:00', '医生 10:00–11:00 看诊，每次500比索'] },
];

/** One weekday; each student takes some of these periods, as the timetable handed out on the first day says. */
export const BCEBU_SCHEDULE: DailyScheduleRow[] = [
  { time: '07:00–08:00', activity: '早餐', kind: 'meal' },
  { time: '07:25–07:55', activity: '早间选修课（自愿报名）', kind: 'activity' },
  { time: '08:00–08:45', activity: '第0节（斯巴达早间词汇课）', kind: 'class' },
  { time: '08:55–09:40', activity: '第1节', kind: 'class' },
  { time: '09:50–10:35', activity: '第2节', kind: 'class' },
  { time: '10:45–11:30', activity: '第3节', kind: 'class' },
  { time: '11:40–12:25', activity: '第4节', kind: 'class' },
  { time: '11:45–13:30', activity: '午餐（按个人课表错开）', kind: 'meal' },
  { time: '13:30–14:15', activity: '第5节', kind: 'class' },
  { time: '14:25–15:10', activity: '第6节', kind: 'class' },
  { time: '15:20–16:05', activity: '第7节', kind: 'class' },
  { time: '16:15–17:00', activity: '第8节', kind: 'class' },
  { time: '17:10–17:55', activity: '傍晚选修课（斯巴达必上）', kind: 'activity' },
  { time: '17:30–19:00', activity: '晚餐', kind: 'meal' },
  { time: '19:00–19:45', activity: '斯巴达词汇测验', kind: 'test' },
  { time: '19:55–22:00', activity: '斯巴达晚自习（中间休息10分钟）', kind: 'free' },
];

export const BCEBU_COURSE_DETAIL_GUIDES: CourseDetailGuide[] = [
  {
    icon: 'military_tech',
    title: "B'Sparta 斯巴达管理",
    subtitle: '必修词汇课、晚自习和外出限制',
    courseIds: ['b-sparta'],
    facts: [
      { label: '必修词汇课', value: '08:00–08:45、17:10–17:55、19:00–19:45' },
      { label: '晚自习', value: '19:55–20:40、20:50–22:00' },
      { label: '周一至周四', value: '不能外出（看病除外）' },
      { label: '周五外出', value: '本周全勤，且周二至周五的每日词汇测试至少通过3次' },
    ],
    points: ['周末和假日可以外出，门禁和其他学生一样。', '没达到条件就外出，按违反门禁处理。'],
  },
  {
    icon: 'workspace_premium',
    title: '雅思课程怎么选',
    subtitle: '常规、斯巴达和12周保证班',
    courseIds: ['ielts', 'ielts-sparta', BCEBU_IELTS_GUARANTEE_ID],
    facts: [
      { label: '每天', value: '4节一对一 + 2节团体课 + 1节早间词汇／测试 + 2节模拟考试' },
      { label: '雅思斯巴达', value: '另加2节晚自习，按斯巴达规定管理' },
      { label: '保证班', value: '每期12周，报名时需提供雅思官方成绩' },
    ],
    points: ['雅思常规课也可以加选斯巴达管理，每4周另付3,000比索（到校缴纳）。'],
    notice: '保证班的目标分和保证条件以学校当期规定为准，报名前顾问会和你逐项确认。',
  },
  {
    icon: 'child_care',
    title: '亲子与青少年',
    subtitle: '幼儿、小学和初中生、高中生',
    courseIds: [BCEBU_KIDS_COURSE_ID, BCEBU_JUNIOR_COURSE_ID],
    facts: [
      { label: '幼儿课程', value: '4–6岁、还没上小学；08:30–12:20、13:30–17:00，须家长陪同' },
      { label: '青少年英语', value: '小学和初中生，每天6节一对一，不能参加选修课' },
      { label: '高中生', value: '可报青少年英语以外的课程，学费按青少年英语计算' },
      { label: '无家长陪同', value: '高中生每周50美元，小学和初中生每周100美元管理费（含毕业送机）' },
    ],
    points: [
      '家长的课不能转给孩子上；学校不提供保姆服务，孩子由家长照顾。',
      '孩子用泳池时家长必须陪同，并穿戴救生衣等装备；15岁以下不能用健身房。',
      '孩子或家长违反规定被退学时，全家都要离校。',
    ],
  },
  {
    icon: 'elderly',
    title: '40岁以上轻松课程',
    subtitle: 'Lite ESL 2',
    courseIds: [BCEBU_LITE_40_COURSE_ID, 'lite-esl4'],
    facts: [
      { label: 'Lite ESL 2', value: '每天2节一对一，只限40岁以上' },
      { label: 'Lite ESL 4', value: '每天4节一对一，不限年龄' },
      { label: '月考和选修课', value: '都不用参加，也不能报选修课' },
    ],
    points: ['50岁以上只可住单人间。'],
  },
  {
    icon: 'rule',
    title: '上课与换课规定',
    subtitle: '所有课程',
    facts: [
      { label: '每节课', value: '45分钟，课间休息10分钟' },
      { label: '上课天数', value: '每月至少18天，不足时补课；国定假日停课不补课' },
      { label: '小组课', value: '4周一期，每班最多6人；初、中级可换成外教课（12周一期）' },
      { label: '选修课', value: "词汇、听力、俚语、演讲和辩论，每天最多2节，每周三16:00前报名；Lite 和青少年英语不能报，B'Sparta 必上" },
      { label: '换课换老师', value: '每周三16:00前在二楼信息台申请，下周一生效；老师由学校安排，不能指定' },
      { label: '月考', value: '每月一次（Lite 课程除外），周五公布成绩' },
    ],
    points: [
      '迟到超过10分钟算缺课，当节取消；个人原因或生病缺的课不补。',
      '换成价格较低的课程，差价不退。',
      "B'AI 智能辅导会根据一对一课堂上你说的话，每天生成学习重点，并定期发送学习报告。",
    ],
  },
];

const FIRST_DAY = [
  { label: '07:00–08:00', value: '早餐' },
  { label: '08:40–12:00', value: '分级测试、登记、拍学生证照片' },
  { label: '13:30–15:30', value: '新生欢迎会' },
  { label: '15:30–17:10', value: '参观 Mactan Newtown、换钱' },
  { label: '17:10–18:00', value: '领教材和课表' },
];

export const BCEBU_PRACTICAL_GUIDES: CampusPracticalGuide[] = [
  {
    icon: 'event', eyebrow: 'FIRST DAY', title: '到校第一天（周一）', facts: FIRST_DAY,
    note: '周二正式上课；第一周周二至周五16:00前，到二楼行政办公室缴纳到校学杂费。入境和签证材料由思达启航顾问逐项帮你核对；eTravel入境登记也由顾问协助填写。',
  },
  {
    icon: 'restaurant',
    eyebrow: 'MEALS & HOURS',
    title: '用餐与开放时间',
    facts: [
      { label: '平日三餐', value: '07:00–08:00 / 11:45–13:30 / 17:30–19:00' },
      { label: '周末与假日', value: '08:00–09:00 / 11:45–13:30 / 17:30–19:00' },
      { label: '泳池酒吧', value: '17:00–23:00，凭学生证购买，只能在酒吧里喝' },
      { label: '行政办公室', value: '平日 08:00–17:00' },
      { label: '接待处', value: '24小时（午餐、晚餐时段和凌晨1–2点休息）' },
    ],
    note: '用餐时间外不提供餐点，餐厅食物不能带回房间。',
  },
  {
    icon: 'cleaning_services',
    eyebrow: 'SCHOOL SERVICES',
    title: '打扫、洗衣与看病',
    facts: [
      { label: '打扫', value: '每周2次，前一天在一楼接待处预约，打扫时房间里要有人；可每周换一次床单被罩' },
      { label: '洗衣', value: '学校不提供；一楼有付费洗衣房，一般1–2天' },
      { label: '医务室', value: '周一至周五 09:00–18:00；医生10:00–11:00看诊，每次500比索' },
      { label: '保险箱', value: '房间里没有，可在接待处借用，押金1,000比索' },
    ],
    note: '贵重物品请自己保管好。',
  },
  {
    icon: 'directions_bus',
    eyebrow: 'SHUTTLE',
    title: '校车',
    facts: [
      { label: '班次', value: '周一至周五 18:30、21:00' },
      { label: '路线', value: '学校 → Mactan Newtown → LG Garden Walk' },
    ],
    note: '周末和假日没有校车；先到先得，上车出示学生证。',
  },
  {
    icon: 'badge',
    eyebrow: 'PASSPORT & VISA',
    title: '护照与签证',
    facts: [
      { label: '护照', value: '由学校保管；需要用时至少提前一周申请，借出时交3,000比索（4周内）或5,000比索（4周以上）保证金，按时归还就退' },
      { label: '移民局', value: '办ARP和ACR当天，学校安排车辆和老师陪同；当天算缺课，不补课' },
      { label: '回程机票', value: '学习超过9周须提供' },
      { label: '超过24周', value: '须办理ECC离境清关证明' },
    ],
    note: '签证延期等费用见报价中的到校学杂费明细。',
  },
  {
    icon: 'receipt_long',
    eyebrow: 'OTHER FEES',
    title: '其他收费',
    facts: [
      { label: '额外住宿', value: '单人间、双人间+客厅2,500，双人间、2+1宿舍2,000，三人间1,500比索／晚（含三餐和水电）' },
      { label: '送机', value: '1,000比索（周五至周日），毕业周周三16:00前申请' },
      { label: '补办', value: '学生证、房卡各500比索' },
      { label: '其他', value: '床品严重弄脏无法清洗1,000比索' },
    ],
    note: '到校后用比索在学校缴纳。',
  },
];

export const BCEBU_DORM_RULES = [
  { title: '门禁', text: '第二天有课（周日至周四）23:00前回校，第二天没课（周五、周六、假日前一天）01:00前；白天08:00–17:00可以外出（斯巴达学生除外），出门向保安出示学生证并登记。' },
  { title: '外宿', text: '只能在周末和假日，当周周四16:00前到接待处申请（不能提前一周申请）；平日外出旅行要先获批准。学校不接受走读。' },
  { title: '未成年学生', text: '不能单独或结伴外出；须由家长、18岁以上家人、监护人授权的人或学校职员陪同，平日08:00–21:00、只限买生活用品；和签字负责的成年学生外出须21:00前回校。' },
  { title: '酒和烟', text: '不能带酒进校，只能在泳池酒吧喝；房间、卫生间和阳台禁止吸烟（含电子烟），未成年人校内一律禁烟；喝酒后不能游泳。' },
  { title: '房间', text: '不能进别人的房间，进入异性房间两人都会被开除；宿舍内禁止做饭和用明火；换房每周三16:00前申请，降级换房不退差价。' },
  { title: '访客', text: '至少提前一周问经理，未经允许不能进校。' },
  { title: '毕业与退房', text: '毕业典礼每周五17:00；毕业周周六13:00前退房，护照和押金在最后一周周五13:30–17:00归还；毕业后不能再进校园。' },
  { title: '违规', text: '违规会收到警告并扣押金（如违反门禁第一次1,000、第二次2,000比索），第三次开除，开除不退费。' },
];

/**
 * B'Cebu's 2027 holiday poster: weekday holidays only, because the weekend ones (Labor Day 5/1, Independence
 * Day 6/12, Ninoy Aquino Day 8/21, Christmas 12/25) do not take a class day. Dates follow the poster's month
 * grid (its side list says 4/2 for the Day of Valor; the grid marks 4/9).
 */
export const BCEBU_HOLIDAY_CALENDARS: HolidayCalendar[] = [
  {
    year: 2027,
    label: '规划2027年入学时优先查看',
    months: [
      { month: 1, holidays: [{ day: '1日', name: '元旦' }] },
      { month: 2, holidays: [{ day: '17日', name: '农历新年' }] },
      {
        month: 3,
        holidays: [
          { day: '25日', name: '濯足节', provisional: true },
          { day: '26日', name: '耶稣受难日', provisional: true },
        ],
      },
      { month: 4, holidays: [{ day: '9日', name: '勇士日' }] },
      { month: 6, holidays: [{ day: '17日', name: '拉普拉普市宪章日' }] },
      {
        month: 8,
        holidays: [
          { day: '6日', name: '宿务省宪章日' },
          { day: '31日', name: '国家英雄日' },
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
          { day: '8日', name: '圣母无染原罪瞻礼' },
          { day: '24日', name: '平安夜' },
          { day: '30日', name: '黎刹日' },
          { day: '31日', name: '除夕' },
        ],
      },
    ],
  },
];
export const BCEBU_HOLIDAY_FOOTNOTE = "只列平日的假期，周末的节日不影响上课；濯足节、耶稣受难日日期待官方确认，政府可能临时增加或调整假期，以B'Cebu当期通知为准。";

export const BCEBU_LICENSE = {
  title: '办学资质已核验',
  items: [
    '2026年度拉普拉普市营业执照（有效期至2026年12月31日）',
    '菲律宾移民局外国学生招收资格认证（学生据此办理SSP学习许可）',
  ],
  note: '证件可向思达启航顾问索取查看',
};

export const BCEBU_FAQS: FaqItem[] = [
  { question: "B'Cebu有暑假附加费吗？", answer: '有。2026/7/5–8/15和2027/6/27–8/21，每个学习周加收40美元；课程和住宿在同一周只算一次，附加费不打折。暑假2+1宿舍不开放，双人间+客厅只接受家庭；16岁以下不单独接收（须参加夏令营），亲子家庭至少报4周。' },
  { question: '2027年有什么优惠？', answer: '2027/2/15–6/21、2027/8/23–12/27入学（周一），成人课程和住宿9折，亲子同样9折；8周起另有长期优惠（8周减50美元，最高28周起减500美元）；再加思达启航9折，并免注册费。报价器会按你的日期自动计算。' },
  { question: "B'Cebu是斯巴达还是半斯巴达？", answer: "默认半斯巴达：白天08:00–17:00可以外出，有课的前一晚23:00前回校。报 B'Sparta 斯巴达课程的学生周一至周四不能外出，周五要全勤并通过词汇测试才能外出，每天还有必修词汇课和晚自习。" },
  { question: "B'Cebu适合带孩子去吗？", answer: '适合。4–6岁可读幼儿课程（须家长陪同），小学和初中生读青少年英语，高中生可报其他课程（学费按青少年英语计算）。亲子可住双人间+客厅、双人间或三人间；学校不提供保姆服务，孩子由家长照顾。' },
  { question: '40岁以上、50岁以上有什么限制？', answer: 'Lite ESL 2（每天2节一对一）只限40岁以上报名；50岁以上只可住单人间。' },
  { question: '学校提供洗衣服务吗？', answer: '不提供。一楼有付费洗衣房，一般1–2天洗好。宿舍每周打扫2次，需要前一天在接待处预约。' },
  { question: '页面上的报价包含全部费用吗？', answer: '学校费用包含注册费、课程费和住宿费，并自动扣除优惠；到校学杂费单独列出，接机和押金另外准备。两者分开显示，不相加。' },
  { question: '思达启航会协助签证和入境吗？', answer: '会。通过思达启航报名，顾问会免费协助菲律宾入境和签证相关手续，你只需要按顾问指引准备个人资料。' },
];

export const BCEBU_FINAL_CTA_BADGES = ['免费选校建议', '确认空房和优惠', '签证与入境协助'];

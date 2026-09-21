import { CiaContentConfig, CiaLocalFeeRule } from '../cia-school/cia-content-config';
import { LaMerFamilyPrice, LaMerFamilyVersion, LaMerPageContent } from './la-mer-types';

export const LA_MER_SCHOOL_ID = '578d438f-2974-4cf9-872c-e67e8253e8da';
export const LA_MER_SCHOOL_NAME = 'EV Academy La Mer';
export const LA_MER_PATH = '/philippines-study/cebu/ev-la-mer';
export const LA_MER_HERO = '/assets/la-mer/campus-sunset.webp';
export const LA_MER_FAMILY_WEEKS = [1, 2, 3, 4, 6, 8];
export const isLaMerSchool = (name: string): boolean => /\bev\b.*la\s*mer/i.test(name);

const familyPrice = (id: string, name: string, people: number, season: LaMerFamilyPrice['season'], values: number[]): LaMerFamilyPrice => ({
  id, name, people, season, enabled: true, prices: Object.fromEntries(LA_MER_FAMILY_WEEKS.map((weeks, i) => [String(weeks), values[i]])),
});

export const laMerFamilyVersions = (): LaMerFamilyVersion[] => [
  {
    id: 'family-2026', name: '2026亲子方案', start: '2026-01-25', end: '2026-12-31', priority: 1, enabled: true,
    exclusions: [{ start: '2026-06-14', end: '2026-08-09' }], peakRanges: [],
    packages: [
      familyPrice('pool-double', '直通泳池双人间', 2, 'all', [2280, 3575, 4675, 5500, 8050, 10600]),
      familyPrice('double', '标准双人间', 2, 'all', [2040, 3315, 4335, 5100, 7450, 9800]),
      familyPrice('pool-triple', '直通泳池三人间', 3, 'all', [3160, 5135, 6715, 7900, 11650, 15400]),
      familyPrice('triple', '标准三人间', 3, 'all', [2920, 4745, 6205, 7300, 10750, 14200]),
    ],
  },
  {
    id: 'family-2027', name: '2026–2027亲子方案', start: '2026-08-23', end: '2027-12-18', priority: 2, enabled: true,
    exclusions: [], peakRanges: [{ start: '2027-01-03', end: '2027-02-27' }, { start: '2027-06-27', end: '2027-08-28' }],
    packages: [
      familyPrice('pool-double', '直通泳池双人间', 2, 'off', [1960, 3185, 4165, 4900, 7150, 9400]),
      familyPrice('double', '标准双人间', 2, 'off', [1760, 2860, 3740, 4400, 6400, 8400]),
      familyPrice('pool-triple', '直通泳池三人间', 3, 'off', [2840, 4615, 6035, 7100, 10450, 13800]),
      familyPrice('triple', '标准三人间', 3, 'off', [2560, 4160, 5440, 6400, 9400, 12400]),
      familyPrice('quad', '标准四人间', 4, 'off', [3280, 5330, 6970, 8200, 12100, 16000]),
      familyPrice('pool-double', '直通泳池双人间', 2, 'peak', [2320, 3770, 4930, 5800, 8500, 11200]),
      familyPrice('double', '标准双人间', 2, 'peak', [2080, 3380, 4420, 5200, 7600, 10000]),
      familyPrice('pool-triple', '直通泳池三人间', 3, 'peak', [3360, 5460, 7140, 8400, 12400, 16400]),
      familyPrice('triple', '标准三人间', 3, 'peak', [3000, 4875, 6375, 7500, 11050, 14600]),
      familyPrice('quad', '标准四人间', 4, 'peak', [3840, 6240, 8160, 9600, 14200, 18800]),
    ],
  },
];

export const createLaMerPage = (): LaMerPageContent => ({
  title: 'EV Academy La Mer 校区',
  lead: '在麦克坦的泳池花园里，把英语学习与自在生活安排在一起。成人、熟龄与亲子家庭，都有各自的课堂节奏。',
  tags: ['宿务 · 麦克坦岛', '度假式校园', '成人 / 熟龄 / 亲子', '一对一英语'],
  familyChildSchedule: '5节一对一',
  familyGuardianSchedule: '3节一对一，可选2节团体课',
  videos: [{ title: 'La Mer学生与校园活动影片', url: '/assets/la-mer/student-campus-film.mp4', poster: '/assets/la-mer/campus-pool.webp', enabled: true }],
  intro: 'La Mer于2025年开放，是EV Academy的独立校区，位于麦克坦岛Cordova的Gabi区域。白色建筑围绕泳池与花园，教室、宿舍、餐厅及休闲设施集中在校内。校区提供综合英语、强化口语、熟龄课程和亲子家庭课程，学习之余可以使用泳池、健身房及公共活动空间。',
  advisor: '如果你希望兼顾英语练习与校园生活，La Mer值得重点了解。成人可以按一对一课时选择学习强度；50岁以上学习者可了解Senior课程；家庭则可让孩子与监护人分别上课、共同住宿。选校时也应考虑外出门禁、孩子照护责任及旺季家庭名额。',
  fit: ['想加强日常沟通与口语练习的成人', '希望学习、交友与休闲兼顾的熟龄学生', '愿意陪同孩子、共同安排课余生活的家庭'],
  considerations: ['亲子课程不提供保姆服务，课余照护由监护人负责', '宿舍、课程与校园生活仍有管理规则，非自由入住酒店', '校外活动和超额使用项目可能另外收费'],
  familyIntro: '儿童每天5节一对一，覆盖阅读、写作、听力、口语和词汇；监护人每天3节一对一，并可选择2节团体课。每节45分钟，可按学校安排参加选修活动。儿童须符合7岁及以上的入学要求，外出由监护人陪同；学校不提供保姆服务。',
  facts: [
    { label: '校区位置', value: '宿务麦克坦岛', note: 'Gabi, Cordova；学校资料参考距机场约25分钟，实际视路况而定。' },
    { label: '开设时间', value: '2025年', note: 'La Mer为EV Academy独立校区，课程与住宿以本校区安排为准。' },
    { label: '课程选择', value: '4类普通课程＋亲子', note: '综合英语、熟龄课程、强化口语6/8及家庭课程。' },
    { label: '学习方式', value: '一对一＋团体课', note: '每节45分钟；普通课程按所选类型安排，教学区执行英语政策。' },
    { label: '校内生活', value: '住宿含每日三餐', note: '平日和周末均供三餐，另有泳池、咖啡厅及休闲设施。' },
    { label: '家庭课程', value: '监护人与孩子分别上课', note: '家庭同住对应人数房型；名额及最终房间由学校确认。' },
  ],
  schedule: [
    { time: '07:00–08:00', title: '早餐', text: '一楼学生餐厅用餐。' },
    { time: '08:00–12:05', title: '上午课堂', text: '第1–5节时段，实际课程及空堂按个人课表安排。' },
    { time: '12:05–13:05', title: '午餐', text: '固定用餐时间，课间回到校内餐厅。' },
    { time: '13:05–17:10', title: '下午课堂与选修', text: '按所选课程安排一对一、团体课、选修或自由时间。' },
    { time: '17:15–18:00', title: '活动与自由时间', text: '选修、尊巴等活动视当期安排及参与人数开放。' },
    { time: '18:00–19:00', title: '晚餐', text: '晚餐后按校规安排自习、休息或外出。' },
  ],
  services: [
    { title: '泳池与休闲', text: '学校资料列有泳池、儿童泳池、健身房、娱乐室、咖啡厅及花园区域；开放时间以校内公告为准。' },
    { title: '餐食与清洁', text: '普通住宿费含每日三餐及房间清洁。手册列明每周两次房间清洁、每周一次床单更换。' },
    { title: '活动与班车', text: '校内有尊巴、瑜伽等活动。商场班车须提前预约；校外行程按报名与实际收费参加，不包含在全部套餐中。' },
    { title: '入学与学习支持', text: '新生完成分级测试及入学指导。学校按阶段进行水平测试，换课或换老师按指定日期提交申请。' },
  ],
  rules: [
    { title: '入住与离校', text: '本报价按周日入住、最后一周周六中午12点前退房。学校亲子资料也接受周六15点后入住，如需提前抵达请先确认安排。' },
    { title: '亲子付款与取消', text: '报名订金为500美元/人，计入总价；余款须在出发前四周付清。家庭报名不能改期或转让，出发前取消退还除订金外的剩余费用。抵达后取消须另行确认亲子条款。' },
    { title: '孩子照护与门禁', text: '监护人负责儿童课余照护及外出陪同，学校不提供保姆服务。亲子方案列明周日至周四22:00、周五周六24:00门禁；未成年个人学员有更严格限制，以适用项目和入学说明为准。' },
    { title: '教学与校园规则', text: '教学区域使用英语，遵守出勤、佩戴学生证和设施使用规范。节假日停课；教师培训日课时与活动安排依学校通知调整。' },
    { title: '在校变更费用', text: '手册列明在校课程体制转换每次1,000比索并补课程差价；换房每次1,000比索并确认空房。已预先安排的分段方案是否涉及这类现场变更，以学校确认为准，不自动重复收取。' },
    { title: '普通课程退款', text: '注册费不退，不足四周不接受退款申请。手册列明入学四周内与四周后的剩余学费住宿费退还比例分别为50%和25%，并有剩余周数限制。退款须书面申请，节假日、缺勤与违规开除不退款；具体适用条件由学校核定。' },
  ],
  faq: [
    { title: 'La Mer和EV主校区是同一套课程与价格吗？', text: '不是。La Mer是独立校区，本页使用La Mer自己的课程、房型、亲子套餐和费用。EV主校区可通过学校目录单独查看。' },
    { title: 'Senior课程适合什么人？', text: '学校将Senior定位为50岁以上学习者的综合英语课程，结合核心语言能力与适合熟龄学生的休闲活动。具体活动以学校安排为准。' },
    { title: '亲子家庭中可以有两位监护人吗？', text: '可以。至少一位监护人与一位儿童同行，按2、3或4人的实际总人数匹配家庭套餐和房型，儿童年龄须符合入学要求。' },
    { title: '亲子套餐还需要准备哪些现金费用？', text: '套餐已包含列明的学习及生活项目。旅游签证续签按每位成员的签证和停留时间另付，可退住宿押金也按人另付；超额用电及自选服务按实际发生结算。' },
    { title: '照片里的房间一定可以预订吗？', text: '照片用于了解校园和住宿环境，具体楼层、床位及房型须由学校确认。提交申请前，思达启航会协助核对空房和课程安排。' },
    { title: '可以先保存报价再咨询吗？', text: '可以。选择课程或家庭套餐后，可预览并保存详细报价图片，再联系思达启航核对入学、空房和付款安排。' },
  ],
  gallery: [
    ['campus-sunset', '泳池与校园全景', '校园与泳池'], ['campus-pool', '日间泳池庭院', '校园与泳池'], ['campus-bridge', '连接校园的泳池小桥', '校园与泳池'],
    ['classroom-one', '一对一教室', '教室'], ['classroom-group', '团体教室', '教室'], ['conference-room', '会议与教学空间', '教室'], ['teaching-corridor', '教学走廊', '教室'],
    ['pool-access-room', '直通泳池住宿实景', '住宿'], ['room-interior', '宿舍空间参考', '住宿'], ['room-beds', '床位布置参考', '住宿'], ['study-desks', '宿舍学习区域', '住宿'], ['bathroom', '浴室设施', '住宿'], ['wardrobe', '收纳空间', '住宿'],
    ['restaurant', '校内餐厅', '餐饮与设施'], ['cafe', '校园咖啡厅', '餐饮与设施'], ['reception', '校区接待处', '餐饮与设施'], ['garden-seating', '户外休息区域', '餐饮与设施'], ['children-pool', '儿童泳池', '餐饮与设施'], ['gym', '健身房', '餐饮与设施'], ['recreation', '娱乐室', '餐饮与设施'], ['table-tennis', '乒乓球活动', '餐饮与设施'],
    ['family-learning', '亲子学习活动', '学习与活动'], ['promotion-2026', '2026下半年官方优惠海报', '宣传资料'],
  ].map(([id, title, category]) => ({ id, title, category, url: `/assets/la-mer/${id}.webp`, caption: category === '宣传资料' ? '学校提供的官方优惠资料。' : '来自学校提供的La Mer资料，实际安排及房型以学校确认为准。', enabled: true })),
});

const fee = (id: string, name: string, amount: number, note: string, sortOrder: number, extra: Partial<CiaLocalFeeRule> = {}): CiaLocalFeeRule => ({
  id, name, currency: 'PHP', amount, note, sortOrder, enabled: true, billingRule: 'once', includeInTotal: true, ...extra,
});

export function createDefaultLaMerContentConfig(): CiaContentConfig {
  return {
    schemaVersion: 1, schoolCode: 'EV-LAMER', laMerPage: createLaMerPage(),
    courses: [
      ['esl-classic', 'ESL Classic｜综合英语', 930, '4节一对一＋2节小组课＋2节大组课', '希望均衡提升听说读写', '一对一覆盖听力、口语、阅读、写作；团课含语法、听力、发表与口语。'],
      ['senior', 'Senior｜熟龄英语', 1120, '4节一对一＋2节小组课＋2节大组课', '面向50岁以上的英语学习者', '综合语言能力结合休闲体验，活动按学校当期安排。'],
      ['power-speaking-6', 'Power Speaking 6｜强化口语', 1120, '6节一对一＋1节小组课＋1节大组课', '希望增加开口机会的学生与职场人士', '侧重日常对话、沟通表达和即时反馈。'],
      ['power-speaking-8', 'Power Speaking 8｜密集口语', 1300, '8节一对一', '希望集中进行个性化口语训练', '以一对一训练沟通、表达及口语流利度。'],
    ].map(([id, name, tuition, schedule, suitable, note], sortOrder) => ({ id: String(id), name: String(name), tuition: Number(tuition), tuition2027: Number(tuition), schedule: String(schedule), suitable: String(suitable), note: String(note), sortOrder, enabled: true })),
    rooms: [
      ['single', '单人间', 1750, '独立居住空间，学校资料标注单人房浴缸。'],
      ['pool-double', '直通泳池双人间', 1150, 'Double A；直通泳池房型，按每人计价。'],
      ['double', '标准双人间', 1050, 'Double B；两人共住房型，按每人计价。'],
      ['triple', '三人间', 910, '三人共住房型，按每人计价。'],
      ['quad', '四人间', 860, '四人共住房型，按每人计价。'],
    ].map(([id, name, amount, note], sortOrder) => ({ id: String(id), name: String(name), label: String(name), code: String(id), location: '校内', group: '校内住宿', fee: Number(amount), note: String(note), sortOrder, enabled: true })),
    localFees: [
      fee('ssp', 'SSP特殊学习许可证', 7800, '一次办理；学习延期时重新办理要求以学校确认为准。', 0),
      fee('ssp-e-card', 'SSP E-CARD', 4500, '学校费用表列为一次性费用。', 1),
      fee('acr-i-card', 'ACR I-CARD', 4000, '学校表格从9周起计入一次。', 2, { billingRule: 'first-visa-extension' }),
      fee('student-id', '学生证', 500, '一次性费用。', 3),
      fee('electricity', '基础电费', 500, '每人每周包含15千瓦时，超额每千瓦时20比索另付。', 4, { billingRule: 'per-accommodation-period', periodWeeks: 1, rounding: 'proportional' }),
      fee('management', '管理费', 500, '按每人住宿周数收取。', 5, { billingRule: 'per-accommodation-period', periodWeeks: 1, rounding: 'proportional' }),
      fee('water', '水费', 300, '按每人住宿周数收取。', 6, { billingRule: 'per-accommodation-period', periodWeeks: 1, rounding: 'proportional' }),
      fee('visa-30', '签证续签', 5430, '使用学校费用表的累计金额，按所选初始签证及完整住宿周数判断。', 7, { billingRule: 'visa-extension-schedule', rates: [5430, 11830, 16260, 20690, 25120] }),
      fee('visa-59', '59天签证续签', 6700, '59天旅游签证从9周起按学校表格累计。', 8, { billingRule: 'visa-extension-schedule', rates: [6700, 11130, 15560, 19990] }),
      fee('books', '教材费', 0, '入学测试后按书单实购，手册参考每本150–500比索；不含在普通固定费用合计中。', 9, { billingRule: 'optional', includeInTotal: false }),
      fee('deposit', '住宿押金（可退）', 2000, '按人另付：1–3周2,000比索，4–8周3,000比索，9–24周5,000比索；扣除欠费或损坏后退还。', 10, { rates: [2000, 3000, 5000], billingRule: 'optional', includeInTotal: false, multiplyByStudents: true }),
      fee('pickup', '机场接机', 1200, '学校表列参考金额；多人共车的实际收费单位须确认，家庭套餐已含接机。', 11, { billingRule: 'optional', includeInTotal: false }),
    ],
    quoteSettings: {
      registrationFee: 100, futurePriceRegistrationStart: '', futurePriceArrivalStart: '', shortStayRatios: { '1': 0.4, '2': 0.65, '3': 0.85 },
      peakSeasonFeePerWeek: 40,
      peakSeasonRanges: [{ id: 'summer-2026', label: '2026普通课程暑期', start: '2026-07-05', end: '2026-08-29', enabled: true }],
      promotions: [
        { id: 'lamer-school-2026', name: '学校优惠', description: '2026年8月24日至12月31日期间开课，每位学员每周减50美元；所有课程和住宿适用。', enabled: true, sortOrder: 0, priority: 1, stackable: true, newStudentsOnly: false, discountType: 'per-course-week', discountValue: 50, appliesTo: 'tuition-and-accommodation', waiveRegistration: false, minimumCourseWeeks: 1, minimumAccommodationWeeks: 1, arrivalStart: '2026-08-24', arrivalEnd: '2026-12-31', coverageTarget: 'course-and-accommodation', ruleKind: 'lamer-course-start' },
        { id: 'lamer-sida', name: '思达95折优惠', description: '普通课程住宿在学校优惠后享95折；亲子套餐在学校优惠后整体享95折。注册费及套餐外另付项目不参与。', enabled: true, sortOrder: 1, priority: 2, stackable: true, newStudentsOnly: false, discountType: 'percentage', discountValue: 5, appliesTo: 'tuition-and-accommodation', waiveRegistration: false, minimumCourseWeeks: 1, minimumAccommodationWeeks: 1, coverageTarget: 'none', ruleKind: 'lamer-after-school' },
      ],
      localFeeIntro: '以下为学校及相关部门收取的到校费用参考。普通教材按书单实购；机场接机与可退住宿押金另列，不计入固定学杂费合计。亲子已含项目不重复收费，续签及住宿押金按每位成员另付。',
      courseTableTitle: '普通课程费用 / 每人4周', courseTableNote: '以下为学校课程原价，住宿、注册费和当地费用另列。', groupClassNote: '每节45分钟，具体课表和选修开放情况以入学安排为准。',
      roomTableTitle: '普通住宿费用 / 每人4周', roomTableNote: '校内住宿含每日三餐和房间清洁；亲子家庭使用独立整包价。',
      stayPolicyTitle: '入住与退房', stayPolicies: [{ label: '入住', value: '周日', note: '非标准抵达时间请提前确认。' }, { label: '退房', value: '最后一周周六12:00前', note: '亲子提前周六15点后入住可另行向学校确认。' }], extraNightRates: [],
      laMer: { familyDepositPerPerson: 500, minimumChildAge: 7, familyComposition: 'any-guardian-child', familyExtras: 'separate', familyIncludedFeeIds: ['ssp', 'ssp-e-card', 'student-id', 'electricity', 'management', 'water', 'books', 'pickup'], familyVersions: laMerFamilyVersions() },
    },
    quoteImageSettings: {
      paymentSectionTitle: '学校费用明细', paymentNotes: { registration: '报名时按人一次收取。', course: '', accommodation: '含每日三餐和房间清洁', promotion: '' },
      promotionNotes: {}, supplementalFeeNotes: {}, localFeeSectionTitle: '到校后学杂费明细', localFeeIntro: '', localFeeNotes: {},
      serviceSectionTitle: '为什么选择思达启航？', benefits: [{ title: '0中介费', text: '课程与住宿按确认价格安排' }, { title: '报名协助', text: '选课、空房、付款与行前准备' }, { title: '费用核对', text: '学校费用与到校费用分项说明' }, { title: '学习期间支持', text: '协助沟通学校与住宿安排' }],
      serviceLocations: ['深圳总部', '菲律宾驻点', '欧洲驻点'], alumniBenefitTitle: '持续学习支持', alumniBenefitText: '结业后可继续咨询英语学习及海外升学规划。',
      noteSectionTitle: '报价说明', footerNotes: ['周日入住，最后一周周六中午12点前退房；房型与名额以学校确认为准。', '亲子报名订金500美元／人计入总价，余款于出发前四周付清。'],
    },
    media: [],
  };
}

export function cloneLaMerContentConfig(value: CiaContentConfig): CiaContentConfig {
  const defaults = createDefaultLaMerContentConfig();
  if (value?.schemaVersion !== 1 || value.schoolCode !== 'EV-LAMER') return defaults;
  const copy = JSON.parse(JSON.stringify(value)) as CiaContentConfig;
  return {
    ...defaults, ...copy,
    laMerPage: { ...defaults.laMerPage!, ...copy.laMerPage },
    quoteSettings: { ...defaults.quoteSettings, ...copy.quoteSettings, laMer: { ...defaults.quoteSettings.laMer!, ...copy.quoteSettings?.laMer } },
    quoteImageSettings: { ...defaults.quoteImageSettings, ...copy.quoteImageSettings, paymentNotes: { ...defaults.quoteImageSettings.paymentNotes, ...copy.quoteImageSettings?.paymentNotes } },
  };
}

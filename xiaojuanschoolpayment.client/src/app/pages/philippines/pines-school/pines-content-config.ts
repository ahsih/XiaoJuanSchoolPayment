import {
  CiaContentConfig,
  CiaCourseContent,
  CiaLocalFeeRule,
  CiaQuoteImageSettings,
  CiaRoomContent,
} from '../cia-school/cia-content-config';

const course = (
  id: string,
  name: string,
  tuition: number,
  schedule: string,
  suitable: string,
  note: string,
  sortOrder: number,
): CiaCourseContent => ({
  id,
  name,
  tuition,
  tuition2027: tuition,
  schedule,
  suitable,
  note,
  enabled: true,
  sortOrder,
});

const room = (
  id: string,
  name: string,
  label: string,
  code: string,
  group: string,
  fee: number,
  note: string,
  sortOrder: number,
): CiaRoomContent => ({
  id,
  name,
  label,
  code,
  location: '校内',
  group,
  fee,
  note,
  enabled: true,
  sortOrder,
});

const localFee = (value: CiaLocalFeeRule): CiaLocalFeeRule => value;

const quoteImageSettings = (): CiaQuoteImageSettings => ({
  paymentSectionTitle: '学校费用明细',
  paymentNotes: {
    registration: '一次性费用；所有通过思达报名的学生均免收',
    course: '课程所属校区、日期与课表以学生当前选择为准',
    accommodation: '房型须与课程校区一致，最终以学校空房确认为准',
    promotion: '系统按报名日期、学习日期、周数及叠加条件自动计算',
  },
  localFeeSectionTitle: '到校后学杂费明细',
  localFeeIntro: '学杂费由学生抵达菲律宾后直接向学校缴纳；本报价按当前方案预估，最终以学校实际收取为准。',
  localFeeNotes: {},
  serviceSectionTitle: '为什么选择思达启航？',
  benefits: [
    { title: '0中介费', text: '学校合作价格，不额外加收服务费' },
    { title: '价格保护', text: '同条件可比价，核实更低价退差价' },
    { title: '全程报名协助', text: '选校、签证、付款及行前指导' },
    { title: '海外驻点售后', text: '学习期间持续跟进，问题有人协助' },
  ],
  serviceLocations: ['深圳总部', '菲律宾驻点', '欧洲驻点'],
  alumniBenefitTitle: '老学员专属优惠',
  alumniBenefitText: '老学员结业后可享线上一对一英语课程专属优惠，留学爱尔兰及欧美英语学校专属奖学金和优惠。',
  noteSectionTitle: '报价说明',
  footerNotes: [
    '课程和住宿按周日入住、周六离校计算；不同校区的课程与房型不可混选。',
    '最终以学校价格、空房、房态及优惠资格确认为准。',
  ],
});

export const createDefaultPinesContentConfig = (): CiaContentConfig => {
  const config: CiaContentConfig = {
    schemaVersion: 1,
    schoolCode: 'PINES',
    courses: [
      course('light-esl-4', 'Light ESL 4', 850, '每天4节一对一', '主校区｜基础与预算优先', '适合先建立英语基础和学习节奏的学生。', 0),
      course('power-speaking', 'Power Speaking', 930, '4节一对一 + 4节小团体', '主校区｜口语强化', '集中提升开口量、表达流利度和综合沟通。', 1),
      course('intensive-esl', 'Intensive ESL', 1020, '5节一对一 + 2节4:1小组课', '主校区｜密集综合英语', '适合短中期增加纠错和输出训练。', 2),
      course('power-esl-5', 'Power ESL 5', 980, '每天5节一对一', '主校区｜高一对一比例', '适合目标明确、希望集中训练个人弱项的学生。', 3),
      course('power-esl-7', 'Power ESL 7', 1220, '每天7节一对一', '主校区｜高强度一对一', '适合短期高强度学习和个性化课程安排。', 4),
      course('toeic-toeic-speaking', 'TOEIC / TOEIC Speaking', 980, '4节一对一 + 4节小组课 + 选修课', '主校区｜TOEIC方向', '适合求职、升学或企业英语需求学生。', 5),
      course('business-english-practical', 'Business English Practical', 1080, '4节一对一 + 3节小组课', '主校区｜初中级商务英语', '适合职场沟通、会议和演示基础训练。', 6),
      course('business-english-executive', 'Business English Executive', 1080, '每天5节一对一', '主校区｜中高级商务英语', '适合需要个性化商务表达与专业沟通的学生。', 7),
      course('parents-course', 'Family Junior 家长课程', 750, '3节一对一 + 2节选修课', '主校区｜亲子家长课程', '家长与孩子课程分开安排，需提前确认同行方案。', 8),
      course('junior-family-course', 'Family Junior 青少年课程', 1500, '5节一对一 + 2节小组课 + 2节选修课', '主校区｜青少年课程', '需提前确认年龄、监护与同行房型要求。', 9),
      course('pre-ielts', 'Pre-IELTS', 1050, '4节一对一 + 4节小组课', '雅思校区｜雅思预备', '适合先建立雅思题型和基础能力。', 10),
      course('ielts-regular', 'IELTS', 1100, '4节一对一 + 3节小组课', '雅思校区｜常规雅思', '适合已有雅思目标、需要系统备考的学生。', 11),
      course('ielts-intensive', 'IELTS Intensive', 1200, '每天6节一对一', '雅思校区｜密集雅思', '适合希望集中补强雅思个人弱项的学生。', 12),
      course('ielts-guarantee-8-weeks-5-5-6-0', 'IELTS 保证班8周（5.5/6.0）', 1450, '5节一对一 + 2节小组课；8周起报', '雅思校区｜目标5.5/6.0', '有入学分数、出勤、模考和官方考试要求。', 13),
      course('ielts-guarantee-8-weeks-6-5-7-0', 'IELTS 保证班8周（6.5/7.0）', 1450, '每天6节一对一；8周起报', '雅思校区｜目标6.5/7.0', '有入学分数、出勤、模考和官方考试要求。', 14),
      course('ielts-guarantee-12-weeks-5-5-6-0', 'IELTS 保证班12周（5.5/6.0）', 1350, '5节一对一 + 2节小组课；12周起报', '雅思校区｜目标5.5/6.0', '12周方案，有入学分数、出勤和模考要求。', 15),
      course('ielts-guarantee-12-weeks-6-5-7-0', 'IELTS 保证班12周（6.5/7.0）', 1350, '每天6节一对一；12周起报', '雅思校区｜目标6.5/7.0', '12周方案，有入学分数、出勤和模考要求。', 16),
    ],
    rooms: [
      room('main-single-a', '主校区单人房A', '单人房A', 'MAIN-1A', '主校区 Main Campus', 1250, '主校区标准单人房。', 0),
      room('main-single-b', '主校区单人房B', '单人房B', 'MAIN-1B', '主校区 Main Campus', 1150, '套间房型；两房共用客厅，B房内有独立卫生间。', 1),
      room('main-single-c', '主校区单人房C', '单人房C', 'MAIN-1C', '主校区 Main Campus', 970, '主校区单人房入门选择。', 2),
      room('main-twin-a', '主校区双人房A', '双人房A', 'MAIN-2A', '主校区 Main Campus', 870, '主校区双人房选择。', 3),
      room('main-twin-b', '主校区双人房B', '双人房B', 'MAIN-2B', '主校区 Main Campus', 840, '主校区双人房选择。', 4),
      room('main-family-2-3', '主校区亲子2–3人房', '亲子2–3人房', 'MAIN-FAMILY', '主校区 Main Campus', 780, '双人间／加床；价格按每位学生计算。', 5),
      room('main-quad', '主校区四人房（上下床）', '四人房', 'MAIN-4', '主校区 Main Campus', 700, '主校区多人房。', 6),
      room('main-5b-solo', '主校区5B Solo', '5B Solo', 'MAIN-5B', '主校区 Main Campus', 650, '舒适多人房，需确认空房。', 7),
      room('main-sextuple', '主校区六人房（上下床）', '六人房', 'MAIN-6', '主校区 Main Campus', 570, '主校区预算房型。', 8),
      room('ielts-single-a', '雅思校区单人房A', '单人房A', 'IELTS-1A', '雅思校区 IELTS Campus', 1250, '雅思校区标准单人房。', 9),
      room('ielts-single-b', '雅思校区单人房B', '单人房B', 'IELTS-1B', '雅思校区 IELTS Campus', 1150, '套间房型；两房共用客厅，B房内有独立卫生间。', 10),
      room('ielts-single-c', '雅思校区单人房C', '单人房C', 'IELTS-1C', '雅思校区 IELTS Campus', 970, '雅思校区单人房入门选择。', 11),
      room('ielts-twin-a', '雅思校区双人房A', '双人房A', 'IELTS-2A', '雅思校区 IELTS Campus', 870, '雅思校区双人房选择。', 12),
      room('ielts-twin-b', '雅思校区双人房B', '双人房B', 'IELTS-2B', '雅思校区 IELTS Campus', 840, '雅思校区双人房选择。', 13),
      room('ielts-family-2-3', '雅思校区亲子2–3人房', '亲子2–3人房', 'IELTS-FAMILY', '雅思校区 IELTS Campus', 780, '双人间／加床；价格按每位学生计算。', 14),
      room('ielts-quad', '雅思校区四人房（上下床）', '四人房', 'IELTS-4', '雅思校区 IELTS Campus', 700, '雅思校区多人房。', 15),
      room('ielts-5b-solo', '雅思校区5B Solo', '5B Solo', 'IELTS-5B', '雅思校区 IELTS Campus', 650, '舒适多人房，需确认空房。', 16),
      room('ielts-sextuple', '雅思校区六人房（上下床）', '六人房', 'IELTS-6', '雅思校区 IELTS Campus', 570, '雅思校区预算房型。', 17),
    ],
    localFees: [
      localFee({ id: 'ssp', name: 'SSP特殊学习许可证', currency: 'PHP', amount: 7800, billingRule: 'once', includeInTotal: true, note: '移民局收取，通常有效6个月；更换学校需重新办理。', enabled: true, sortOrder: 0 }),
      localFee({ id: 'ssp-e-card', name: 'SSP-E Card', currency: 'PHP', amount: 4500, billingRule: 'once', includeInTotal: true, note: '入学时与SSP同时办理，只收一次。', enabled: true, sortOrder: 1 }),
      localFee({ id: 'acr-i-card', name: 'ACR-I Card 外国人身份证', currency: 'PHP', amount: 4000, billingRule: 'first-visa-extension', includeInTotal: true, note: '第一次签证续签时办理；以学校及移民局要求为准。', enabled: true, sortOrder: 2 }),
      localFee({ id: 'utilities', name: '水电费', currency: 'PHP', amount: 3000, billingRule: 'per-accommodation-period', periodWeeks: 4, rounding: 'proportional', includeInTotal: true, note: '按住宿周数计算；超额用电另收25比索／kW。', enabled: true, sortOrder: 3 }),
      localFee({ id: 'visa-extension', name: '签证续签', currency: 'PHP', amount: 6210, rates: [6210], billingRule: 'visa-extension-schedule', includeInTotal: true, note: '按所选签证及完整停留跨度预估；实际以移民局及学校办理为准。', enabled: true, sortOrder: 4 }),
      localFee({ id: 'student-id', name: '学生证', currency: 'PHP', amount: 200, billingRule: 'once', includeInTotal: true, note: '一次性费用。', enabled: true, sortOrder: 5 }),
      localFee({ id: 'manila-pickup', name: '马尼拉机场接机', currency: 'PHP', amount: 3000, billingRule: 'optional', includeInTotal: true, note: '由学生自由选择；指定周日团体接机。', enabled: true, sortOrder: 6 }),
      localFee({ id: 'clark-pickup', name: '克拉克机场接机', currency: 'PHP', amount: 3000, billingRule: 'optional', includeInTotal: true, note: '由学生自由选择；指定周日团体接机。', enabled: true, sortOrder: 7 }),
      localFee({ id: 'campus-deposit', name: '校内预存款', currency: 'PHP', amount: 4000, billingRule: 'per-accommodation-period', periodWeeks: 4, rounding: 'proportional', includeInTotal: false, note: '用于教材、洗衣、复印、选修课和周末餐食等，按实际扣费；不计入学杂费合计。', enabled: true, sortOrder: 8 }),
      localFee({ id: 'room-deposit', name: '房间押金（可退）', currency: 'PHP', amount: 4000, billingRule: 'once', includeInTotal: false, multiplyByStudents: true, note: '无损坏且无欠费时按学校规定退还；不计入学杂费合计。', enabled: true, sortOrder: 9 }),
      localFee({ id: 'laundry', name: '洗衣服务', currency: 'PHP', amount: 1200, billingRule: 'optional', includeInTotal: false, note: '参考金额；按实际使用，不计入学杂费合计。', enabled: true, sortOrder: 10 }),
    ],
    quoteSettings: {
      registrationFee: 100,
      futurePriceRegistrationStart: '',
      futurePriceArrivalStart: '',
      shortStayRatios: { '2': 0.65, '3': 0.85 },
      peakSeasonFeePerWeek: 40,
      peakSeasonRanges: [
        { id: 'pines-peak-2026', label: '2026旺季', start: '2026-06-28', end: '2026-08-22', enabled: true },
        { id: 'pines-peak-2027', label: '2027旺季（按2026年8周档期推算）', start: '2027-06-27', end: '2027-08-21', enabled: true },
      ],
      promotions: [
        { id: 'pines-registration-waiver', name: '思达免注册费', description: '所有通过思达报名的学生免收100美元注册费', enabled: true, sortOrder: 0, priority: 10, stackable: true, newStudentsOnly: false, discountType: 'none', discountValue: 0, appliesTo: 'school-total', waiveRegistration: true, minimumCourseWeeks: 0, minimumAccommodationWeeks: 0, coverageTarget: 'none' },
        { id: 'pines-off-season', name: '常规淡季优惠', description: '2026年12月31日前注册，未覆盖旺季的课程每满4周减150美元', enabled: true, sortOrder: 1, priority: 20, stackable: true, newStudentsOnly: false, discountType: 'fixed', discountValue: 150, appliesTo: 'tuition', waiveRegistration: false, minimumCourseWeeks: 4, minimumAccommodationWeeks: 0, registrationEnd: '2026-12-31', coverageTarget: 'none' },
        { id: 'pines-twelve-week', name: '12周以上额外优惠', description: '累计课程达到12周，一次减100美元', enabled: true, sortOrder: 2, priority: 30, stackable: true, newStudentsOnly: false, discountType: 'fixed', discountValue: 100, appliesTo: 'tuition', waiveRegistration: false, minimumCourseWeeks: 12, minimumAccommodationWeeks: 0, coverageTarget: 'none' },
        { id: 'pines-long-stay', name: '长期优惠', description: '16周减100美元，之后每增加2周叠加25美元', enabled: true, sortOrder: 3, priority: 40, stackable: true, newStudentsOnly: false, discountType: 'fixed', discountValue: 100, incrementWeeks: 2, incrementValue: 25, appliesTo: 'tuition', waiveRegistration: false, minimumCourseWeeks: 16, minimumAccommodationWeeks: 0, coverageTarget: 'none' },
        { id: 'pines-sida-discount', name: '思达95折', description: '课程和住宿先减固定优惠，再按95折计算', enabled: true, sortOrder: 4, priority: 50, stackable: true, newStudentsOnly: false, discountType: 'percentage', discountValue: 5, appliesTo: 'tuition-and-accommodation', waiveRegistration: false, minimumCourseWeeks: 0, minimumAccommodationWeeks: 0, coverageTarget: 'none' },
      ],
      localFeeIntro: '说明：学杂费是学生抵达菲律宾后直接向学校缴纳的当地费用。本页及报价单仅提供预估参考，具体收费项目和金额以学校实际收取为准；校内预存款、房间押金和洗衣服务另列，不计入学杂费及人民币预估合计。',
      courseTableTitle: 'PINES 2026课程费 / 4周',
      courseTableNote: 'Main Campus和IELTS Campus课程分开显示；保证班须满足最低周数、入学分数、出勤和模考要求。',
      groupClassNote: '课程节数及团体课人数以学校最终课表与分班结果为准。',
      roomTableTitle: 'PINES住宿费 / 4周',
      roomTableNote: '主校区和雅思校区房型价格相同，但课程与住宿必须选择同一校区；最终以学校实时空房为准。',
      stayPolicyTitle: 'PINES入住与离校提醒',
      stayPolicies: [
        { label: '入住日期', value: '周日入住', note: '按学校公布的周日入学档期入住，并提前确认接机与空房。' },
        { label: '离校日期', value: '课程结束后的周六', note: '每个完整学习周按周日至周六计算。' },
        { label: '跨校区限制', value: '课程和住宿须同校区', note: '主校区课程搭配主校区房型，雅思校区课程搭配雅思校区房型。' },
      ],
      extraNightRates: [],
    },
    quoteImageSettings: quoteImageSettings(),
  };

  config.quoteImageSettings.localFeeNotes = Object.fromEntries(
    config.localFees.map(fee => [fee.id, fee.note]),
  );
  return config;
};

export const clonePinesContentConfig = (value: CiaContentConfig): CiaContentConfig => {
  const clone = JSON.parse(JSON.stringify(value)) as CiaContentConfig;
  const defaults = createDefaultPinesContentConfig();
  const savedSettings = clone.quoteImageSettings;
  clone.quoteImageSettings = {
    ...defaults.quoteImageSettings,
    ...(savedSettings ?? {}),
    paymentNotes: {
      ...defaults.quoteImageSettings.paymentNotes,
      ...(savedSettings?.paymentNotes ?? {}),
    },
    localFeeNotes: {
      ...defaults.quoteImageSettings.localFeeNotes,
      ...Object.fromEntries((clone.localFees ?? []).map(fee => [fee.id, fee.note])),
      ...(savedSettings?.localFeeNotes ?? {}),
    },
  };
  return clone;
};

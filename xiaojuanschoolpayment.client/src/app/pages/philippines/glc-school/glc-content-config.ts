import {
  CiaContentConfig,
  CiaCourseContent,
  CiaLocalFeeRule,
  CiaPromotionRule,
  CiaRoomContent,
} from '../cia-school/cia-content-config';
import {
  GLC_COURSES,
  GLC_LOCAL_FEE_INTRO,
  GLC_REGISTRATION_NOTE,
  GLC_ROOMS,
} from './glc-pricing';

const course = (item: typeof GLC_COURSES[number], sortOrder: number): CiaCourseContent => ({
  id: item.id,
  name: item.name,
  englishName: item.englishName ?? item.name,
  chineseName: item.chineseName,
  group: item.type,
  offSeasonEligible: item.offSeasonEligible,
  annexOnly: item.annexOnly,
  family: item.family,
  textbook: item.textbook,
  tuition: item.weeklyTuition,
  tuition2027: item.weeklyTuition,
  schedule: item.lessons,
  suitable: item.suitable,
  note: item.suitable || '住宿费与到校学杂费另计，具体入学条件请向学校确认。',
  enabled: true,
  sortOrder,
});

const room = (item: typeof GLC_ROOMS[number], sortOrder: number): CiaRoomContent => ({
  id: item.id,
  name: item.name,
  label: item.name,
  code: item.id,
  location: '校内',
  group: item.id.startsWith('annex-') ? '副楼宿舍' : '主楼宿舍',
  fee: item.weeklyAccommodation,
  note: item.note,
  enabled: true,
  sortOrder,
});

const fee = (value: Omit<CiaLocalFeeRule, 'currency' | 'enabled'>): CiaLocalFeeRule => ({
  ...value,
  currency: 'PHP',
  enabled: true,
});

const promotion = (value: Omit<CiaPromotionRule, 'enabled' | 'stackable' | 'newStudentsOnly' | 'waiveRegistration' | 'minimumAccommodationWeeks'> & Partial<Pick<CiaPromotionRule, 'waiveRegistration' | 'minimumAccommodationWeeks'>>): CiaPromotionRule => ({
  ...value,
  enabled: true,
  stackable: true,
  newStudentsOnly: false,
  waiveRegistration: value.waiveRegistration ?? false,
  minimumAccommodationWeeks: value.minimumAccommodationWeeks ?? 0,
});

export const createDefaultGlcContentConfig = (): CiaContentConfig => {
  const eligibleCourseIds = GLC_COURSES.filter(item => item.offSeasonEligible).map(item => item.id);
  const allCourseIds = GLC_COURSES.map(item => item.id);
  const config: CiaContentConfig = {
    schemaVersion: 1,
    schoolCode: 'GLC',
    courses: GLC_COURSES.map(course),
    rooms: GLC_ROOMS.map(room),
    localFees: [
      fee({ id: 'ssp', name: 'SSP特殊学习许可证', amount: 8000, billingRule: 'once', waiveForLongTermVisa: true, includeInTotal: true, multiplyByStudents: true, note: '移民局收取，按报名学习时长办理；续费及换校需要重新办理。', sortOrder: 0 }),
      fee({ id: 'ssp-e-card', name: 'SSP-E CARD', amount: 4500, billingRule: 'once', waiveForLongTermVisa: true, includeInTotal: true, multiplyByStudents: true, note: '移民局收取，入学和SSP同时办理，每人收一次。', sortOrder: 1 }),
      fee({ id: 'acr-i-card', name: 'ACR-I CARD 外国人身份证', amount: 4000, billingRule: 'first-visa-extension', waiveForLongTermVisa: true, includeInTotal: true, multiplyByStudents: true, note: '按所选签证预估，第一次续签时每人计入一次，实际以办理要求为准。', sortOrder: 2 }),
      fee({ id: 'arp', name: 'ARP外国人登记', amount: 300, billingRule: 'long-term-or-first-extension', includeInTotal: true, multiplyByStudents: true, note: '旅游签证首次续签或长期签证时每人计入一次，须由顾问确认学校最新政策。', sortOrder: 3 }),
      fee({ id: 'management', name: '管理费', amount: 6000, billingRule: 'per-accommodation-period', periodWeeks: 4, rounding: 'ceil', includeInTotal: true, note: 'ID、餐食、洗衣、房间清洁等；按住宿周数，每4周预估1份，不足4周先按1份预估。', sortOrder: 4 }),
      fee({ id: 'water', name: '水费', amount: 2000, billingRule: 'per-accommodation-period', periodWeeks: 4, rounding: 'ceil', includeInTotal: true, note: '按住宿周数，每4周预估1份，不足4周先按1份预估，实际以学校收费为准。', sortOrder: 5 }),
      fee({ id: 'electricity', name: '电费', amount: 2000, billingRule: 'per-accommodation-period', periodWeeks: 4, rounding: 'ceil', includeInTotal: true, note: '预估金额；实际按20比索／度／人结算，不足4周先按1份预估。', sortOrder: 6 }),
      fee({ id: 'visa-extension', name: '签证续签', amount: 4670, rates: [4670, 4670, 4670, 4670, 4670], billingRule: 'visa-extension-schedule', waiveForLongTermVisa: true, includeInTotal: true, multiplyByStudents: true, note: '按所选30天或59天旅游签证及完整停留时间计算，每次增加30天；最终以学校及移民局办理为准。', sortOrder: 7 }),
      fee({ id: 'books-esl', name: '教材费（英语课程）', amount: 3000, billingRule: 'per-course-period', periodWeeks: 8, rounding: 'ceil', includeInTotal: true, multiplyByStudents: true, note: 'ESL课程1–8周约3,000比索／人；不同课程、换课及学习进度可能需另购教材，以实际购买为准。', sortOrder: 8 }),
      fee({ id: 'books-ielts', name: '教材费（雅思）', amount: 5000, billingRule: 'per-course-period', periodWeeks: 4, rounding: 'ceil', includeInTotal: true, multiplyByStudents: true, note: '雅思课程1–4周约5,000比索／人，不同课程及学习进度可能需另购教材，以到校后实际购买为准。', sortOrder: 9 }),
      fee({ id: 'pickup', name: '宿务马克坦机场团体接机', amount: 1750, billingRule: 'optional', includeInTotal: false, multiplyByStudents: true, note: '报名期或就读期优惠满足条件时可赠送一次周日接机；非周日或不符合优惠时按1,750比索／人预估。', sortOrder: 10 }),
      fee({ id: 'deposit', name: '房间押金', amount: 3000, billingRule: 'optional', includeInTotal: false, multiplyByStudents: true, note: '3,000比索／人；可抵扣电费，离校按学校实际结算；不计入学杂费合计。', sortOrder: 11 }),
    ],
    quoteSettings: {
      registrationFee: 120,
      futurePriceRegistrationStart: '',
      futurePriceArrivalStart: '',
      shortStayRatios: {},
      peakSeasonFeePerWeek: 0,
      peakSeasonRanges: [],
      promotions: [
        promotion({ id: 'glc-school-window-1', name: '学校年度优惠（第一阶段）', description: '就读期间在2026/06/01–2027/07/03，适用课程每满连续4周优惠150美元；轻量口语、亲子、儿童及青少年课程不适用。', sortOrder: 0, priority: 10, discountType: 'fixed', discountValue: 150, appliesTo: 'tuition', minimumCourseWeeks: 4, incrementWeeks: 4, incrementValue: 150, eligibleCourseIds, coverageStart: '2026-06-01', coverageEnd: '2027-07-03', coverageTarget: 'course' }),
        promotion({ id: 'glc-school-window-2', name: '学校年度优惠（第二阶段）', description: '就读期间在2027/08/29–2028/01/01，适用课程每满连续4周优惠150美元；轻量口语、亲子、儿童及青少年课程不适用。', sortOrder: 1, priority: 11, discountType: 'fixed', discountValue: 150, appliesTo: 'tuition', minimumCourseWeeks: 4, incrementWeeks: 4, incrementValue: 150, eligibleCourseIds, coverageStart: '2027-08-29', coverageEnd: '2028-01-01', coverageTarget: 'course' }),
        promotion({ id: 'glc-sida', name: '思达启航专属优惠', description: '课程每满连续4周减50美元，可与适用的学校优惠叠加。', sortOrder: 2, priority: 20, discountType: 'fixed', discountValue: 50, appliesTo: 'tuition', minimumCourseWeeks: 4, incrementWeeks: 4, incrementValue: 50, eligibleCourseIds: allCourseIds, coverageTarget: 'none' }),
        promotion({ id: 'glc-registration-pickup', name: '报名期周日接机优惠', description: '2026/04/05–2027/01/02期间报名且课程满4周，所有课程均可享一次周日免费接机；非周日接机仍收费。', sortOrder: 3, priority: 30, discountType: 'none', discountValue: 0, appliesTo: 'school-total', minimumCourseWeeks: 4, eligibleCourseIds: allCourseIds, registrationStart: '2026-04-05', registrationEnd: '2027-01-02', coverageTarget: 'none' }),
        promotion({ id: 'glc-returning-registration', name: '老学员返校', description: '老学员返校免收一次性注册费。', sortOrder: 4, priority: 40, discountType: 'none', discountValue: 0, appliesTo: 'school-total', minimumCourseWeeks: 0, waiveRegistration: true, coverageTarget: 'none' }),
      ],
      localFeeIntro: GLC_LOCAL_FEE_INTRO,
      courseTableTitle: 'GLC 2026年每周课程费与课程安排',
      courseTableNote: '以下为每周课程费，不含住宿；亲子课程由2人共享一份课程套餐，住宿、注册费和学杂费仍按人数另计。',
      groupClassNote: '轻量口语、亲子、儿童及青少年课程不参加学校年度150美元优惠；所有课程仍可参加符合条件的报名期周日接机优惠。',
      roomTableTitle: 'GLC 2026年每周住宿费与房型',
      roomTableNote: '以下为每人每周住宿费，课程费另计；斯巴达管理课程仅可选择副楼住宿。',
      stayPolicyTitle: 'GLC 入住与课程日期提醒',
      stayPolicies: [
        { label: '入住日期', value: '周日入住', note: '课程与住宿按周日至周六的完整周计算。' },
        { label: '退房日期', value: '课程结束后的周六', note: '前后泊或延住需由学校确认空房和费用。' },
        { label: '斯巴达住宿', value: '仅限副楼', note: '选择Ultra Sparta ESL或Ultra IELTS Sparta时，对应期间只能选择副楼住宿。' },
      ],
      extraNightRates: [],
    },
    quoteImageSettings: {
      paymentSectionTitle: '学校费用明细',
      paymentNotes: {
        registration: GLC_REGISTRATION_NOTE,
        course: '按所选课程的每周价格、周数及日期计算。',
        accommodation: '按每位学生所选房型的每周价格、周数及日期计算。',
        promotion: '按当前有效日期、课程资格与连续周数自动计算。',
      },
      localFeeSectionTitle: '到校后学杂费明细',
      localFeeIntro: GLC_LOCAL_FEE_INTRO,
      localFeeNotes: {},
      serviceSectionTitle: '为什么选择思达启航？',
      benefits: [
        { title: '0中介费', text: '学校合作价格，不额外加收服务费' },
        { title: '价格保护', text: '同条件可比价，核实更低价退差价' },
        { title: '全程报名协助', text: '选校、签证、付款及行前指导' },
        { title: '海外驻点售后', text: '学习期间持续跟进，问题有人协助' },
      ],
      serviceLocations: ['深圳总部', '宿务驻点', '欧洲驻点'],
      alumniBenefitTitle: '老学员专属优惠',
      alumniBenefitText: '老学员结业后可享线上课程及后续留学服务相关优惠。',
      noteSectionTitle: '报价说明',
      footerNotes: [
        '学费需到校前2周交齐，可由思达代收或自行转美元给学校。',
        '所有学生不收取寒暑假附加费。',
        '课程与住宿按周日入学、周六离校计算，最终以学校价格、空房及优惠确认为准。',
      ],
    },
    media: [],
  };
  config.quoteImageSettings.localFeeNotes = Object.fromEntries(config.localFees.map(item => [item.id, item.note]));
  return config;
};

export const cloneGlcContentConfig = (value: CiaContentConfig): CiaContentConfig => {
  const defaults = createDefaultGlcContentConfig();
  const clone = structuredClone(value);
  clone.localFees ??= structuredClone(defaults.localFees);
  clone.quoteSettings ??= structuredClone(defaults.quoteSettings);
  clone.quoteSettings.shortStayRatios ??= {};
  clone.quoteSettings.peakSeasonRanges ??= [];
  clone.quoteSettings.promotions ??= structuredClone(defaults.quoteSettings.promotions);
  clone.quoteSettings.stayPolicies ??= structuredClone(defaults.quoteSettings.stayPolicies);
  clone.quoteSettings.extraNightRates ??= [];
  clone.quoteImageSettings ??= structuredClone(defaults.quoteImageSettings);
  clone.quoteImageSettings.paymentNotes ??= structuredClone(defaults.quoteImageSettings.paymentNotes);
  clone.quoteImageSettings.localFeeNotes = {
    ...defaults.quoteImageSettings.localFeeNotes,
    ...Object.fromEntries((clone.localFees ?? []).map(item => [item.id, item.note])),
    ...(clone.quoteImageSettings.localFeeNotes ?? {}),
  };
  clone.quoteImageSettings.benefits ??= structuredClone(defaults.quoteImageSettings.benefits);
  clone.quoteImageSettings.footerNotes ??= structuredClone(defaults.quoteImageSettings.footerNotes);
  clone.media ??= [];
  return clone;
};

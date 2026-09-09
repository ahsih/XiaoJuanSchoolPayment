import { SchoolLocalFee, SchoolPaymentLine, SchoolVisaType } from '../../../components/school-group-quote';
import { SchoolQuotePlan } from '../../../components/school-quote-plan';
import {
  FELLA_CAMPUS_OPTIONS,
  FELLA_DEFAULT_START_DATE,
  FELLA_FAMILY_COURSE_IDS,
  FELLA_WEEK_OPTIONS,
  FellaAirportPickup,
  FellaCampus,
  FellaCourseFee,
  FellaRoomFee,
} from './fella-pricing';

interface FellaQuotePrices {
  courseFees: FellaCourseFee[];
  roomFees: FellaRoomFee[];
  registrationFee: number;
}

const money = (value: number) => value.toLocaleString('en-US', { maximumFractionDigits: 2 });
const today = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

/** English Fella pricing is calculated once here and reused by the webpage and image. */
export class FellaStudentQuote {
  campus: FellaCampus = 'campus1';
  selectedRegistrationDate = today();
  returningStudent = false;
  isMinor = false;
  private selectedVisaType: SchoolVisaType | null = null;
  airportPickup: FellaAirportPickup = 'none';

  readonly airportPickupOptions = [
    { value: 'none' as const, label: '不需要接机' },
    { value: 'sunday' as const, label: '周日宿务机场接机（1,000比索／人）' },
    { value: 'other' as const, label: '其他时间宿务机场接机（1,500比索／人）' },
  ];

  readonly quotePlan = new SchoolQuotePlan(
    'pic-4',
    'triple-3a',
    FELLA_DEFAULT_START_DATE,
    FELLA_WEEK_OPTIONS,
    (kind) => kind === 'course'
      ? this.prices.courseFees
        .filter((course) => course.campuses.includes(this.campus))
        .map((course) => ({ id: course.id, name: course.name, details: `${course.schedule}；${course.requirement}` }))
      : this.prices.roomFees
        .filter((room) => room.campuses.includes(this.campus))
        .map((room) => ({ id: room.id, name: room.name, details: room.note })),
    (kind, row) => {
      const fourWeekPrice = kind === 'course'
        ? this.prices.courseFees.find((course) => course.id === row.optionId)?.tuition
        : this.prices.roomFees.find((room) => room.id === row.optionId)?.fee;
      return (fourWeekPrice ?? 0) * row.weeks / 4;
    },
  );

  constructor(private readonly prices: FellaQuotePrices) {}

  setCampus(campus: FellaCampus): void {
    this.campus = campus;
    const defaultCourse = 'pic-4';
    const defaultRoom = 'triple-3a';
    for (const row of this.quotePlan.courses) {
      if (!this.prices.courseFees.some((course) => course.id === row.optionId && course.campuses.includes(campus))) row.optionId = defaultCourse;
    }
    for (const row of this.quotePlan.rooms) {
      if (!this.prices.roomFees.some((room) => room.id === row.optionId && room.campuses.includes(campus))) row.optionId = defaultRoom;
    }
  }

  get campusLabel(): string { return FELLA_CAMPUS_OPTIONS.find((option) => option.value === this.campus)?.label ?? '请选择校区'; }
  get arrivalDate(): string { return this.quotePlan.startDate; }
  get courseWeeks(): number { return this.quotePlan.courseWeeks; }
  get roomWeeks(): number { return this.quotePlan.roomWeeks; }
  get tuition(): number { return this.quotePlan.total('course'); }
  get accommodation(): number { return this.quotePlan.total('room'); }

  get recommendedVisaType(): SchoolVisaType { return this.quotePlan.stayWeeks >= 8 ? 'tourist59' : 'tourist30'; }
  get visaType(): SchoolVisaType { return this.selectedVisaType ?? this.recommendedVisaType; }
  set visaType(value: SchoolVisaType) { this.selectedVisaType = value; }
  get visaWasManuallySelected(): boolean { return this.selectedVisaType !== null; }
  get visaLabel(): string {
    const labels: Record<SchoolVisaType, string> = {
      tourist30: '30天旅游签证', tourist59: '59天旅游签证', student: '学生签证',
      work: '工作签证', srrv: 'SRRV绿卡', sirv: 'SIRV卡',
    };
    return labels[this.visaType];
  }
  get isLongTermVisa(): boolean { return !['tourist30', 'tourist59'].includes(this.visaType); }

  get containsFamilyCourse(): boolean {
    return this.quotePlan.courses.some((row) => FELLA_FAMILY_COURSE_IDS.has(row.optionId));
  }
  get registrationCharge(): number { return this.returningStudent ? 0 : this.prices.registrationFee; }
  get minorServiceFee(): number { return this.isMinor ? this.courseWeeks * 25 : 0; }

  get registrationPromotionEligible(): boolean {
    return !this.containsFamilyCourse && this.selectedRegistrationDate >= '2026-07-01' && this.selectedRegistrationDate <= '2026-07-31';
  }
  get registrationPromotionDiscount(): number {
    if (!this.registrationPromotionEligible || !FELLA_WEEK_OPTIONS.includes(this.courseWeeks as typeof FELLA_WEEK_OPTIONS[number])) return 0;
    return Math.min(300, this.courseWeeks / 4 * 50);
  }
  get registrationPromotionNote(): string {
    if (this.containsFamilyCourse) return '亲子课程不参加2026年7月报名优惠。';
    if (!this.registrationPromotionEligible) return '报名日须为2026/07/01–07/31；4／8／12／16／20／24周分别减50／100／150／200／250／300美元。';
    return `报名日期符合条件，${this.courseWeeks}周减${money(this.registrationPromotionDiscount)}美元。`;
  }

  get sidaDiscount(): number {
    if (this.containsFamilyCourse) return 0;
    const base = Math.max(0, this.tuition + this.accommodation - this.registrationPromotionDiscount);
    return Math.round(base * 0.05 * 100) / 100;
  }
  get sidaDiscountNote(): string {
    if (this.containsFamilyCourse) return '亲子课程不参加思达启航95折。';
    return `先扣报名优惠，再对剩余课程费和住宿费计算95折，本次减${money(this.sidaDiscount)}美元。`;
  }

  get christmasWeeks(): number {
    return [
      ['2026-12-21', '2026-12-27'],
      ['2026-12-28', '2027-01-03'],
    ].filter(([start, end]) => this.quotePlan.overlapWeeks(start, end) > 0).length;
  }
  get christmasDiscount(): number { return this.christmasWeeks * 100; }
  get christmasDiscountNote(): string {
    return this.christmasWeeks
      ? `课程就读日期覆盖${this.christmasWeeks}个指定圣诞周，每周减100美元；可与报名优惠和95折叠加。`
      : '课程就读日期未覆盖2026/12/21–12/27或2026/12/28–2027/01/03。';
  }

  get paymentLines(): SchoolPaymentLine[] {
    const lines: SchoolPaymentLine[] = [
      { icon: '注', label: '注册费', value: this.registrationCharge, note: this.returningStudent ? '老生返校免收注册费。' : '新生一次性收取100美元。' },
    ];
    if (this.isMinor) lines.push({ icon: '未', label: '未成年学生单独到校服务费', value: this.minorServiceFee, note: `18岁以下由用户勾选，按${this.courseWeeks}个课程周 × 25美元计算。` });
    if (this.registrationPromotionDiscount) lines.push({ icon: '报', label: '7月报名优惠', value: -this.registrationPromotionDiscount, note: this.registrationPromotionNote, promotionKey: 'fella-july-registration' });
    if (this.sidaDiscount) lines.push({ icon: '思', label: '思达启航95折', value: -this.sidaDiscount, note: this.sidaDiscountNote, promotionKey: 'fella-sida-95' });
    if (this.christmasDiscount) lines.push({ icon: '圣', label: '圣诞优惠', value: -this.christmasDiscount, note: this.christmasDiscountNote, promotionKey: 'fella-christmas' });
    return lines;
  }

  get quoteUsd(): number {
    return Math.max(0, this.tuition + this.accommodation + this.paymentLines.reduce((sum, line) => sum + line.value, 0));
  }

  get touristExtensionCount(): number {
    if (this.isLongTermVisa) return 0;
    const firstExtensionWeek = this.visaType === 'tourist30' ? 4 : 8;
    return this.quotePlan.stayWeeks < firstExtensionWeek ? 0 : Math.floor((this.quotePlan.stayWeeks - firstExtensionWeek) / 4) + 1;
  }

  get localFees(): SchoolLocalFee[] {
    const longTermNote = `已选${this.visaLabel}；相关证件及续签暂按0比索占位，不代表法定豁免，必须由顾问向学校确认。`;
    const extensions = this.touristExtensionCount;
    const touristExtensionNote = `按${this.visaLabel}和${this.quotePlan.stayWeeks}周完整停留跨度预估；首次续签增加30天，实际以移民局发放与学校收取为准。`;
    const managementFee = this.roomWeeks > 0 ? 1000 + Math.max(0, this.roomWeeks - 1) * 500 : 0;
    const bookSets = this.courseWeeks > 0 ? Math.ceil(this.courseWeeks / 8) : 0;
    const visaRows: SchoolLocalFee[] = this.isLongTermVisa
      ? [
          { item: 'SSP特殊学习许可证', unitLabel: '金额待确认', quantity: 0, total: 0, note: longTermNote },
          { item: 'SSP E-CARD', unitLabel: '金额待确认', quantity: 0, total: 0, note: longTermNote },
          { item: 'ACR I-CARD 外国人身份证', unitLabel: '金额待确认', quantity: 0, total: 0, note: longTermNote },
          { item: 'ARP外国人登记', unitLabel: '金额待确认', quantity: 0, total: 0, note: longTermNote },
          { item: '签证续签', unitLabel: '金额待确认', quantity: 0, total: 0, note: longTermNote },
        ]
      : [
          { item: 'SSP特殊学习许可证', unitLabel: '7,800 比索／次', quantity: 1, total: 7800, note: '入学时支付，移民局收取，按报名学习时长办理；续费及换校需要重新办理。' },
          { item: 'SSP E-CARD', unitLabel: '4,100 比索／次', quantity: 1, total: 4100, note: '移民局收取，入学时与SSP同时办理，只收一次。' },
          { item: 'ACR I-CARD 外国人身份证', unitLabel: '4,100 比索／次', quantity: extensions > 0 ? 1 : 0, total: extensions > 0 ? 4100 : 0, note: `移民局收取，第一次续签时办理；30天签证学习4周及以上、59天签证学习8周及以上需要。当前按${this.visaLabel}预估。` },
          { item: 'ARP外国人登记', unitLabel: '300 比索／次', quantity: extensions > 0 ? 1 : 0, total: extensions > 0 ? 300 : 0, note: '移民局收取，跟随第一次续签办理；学校统一带队拍摄照片及指纹录制。' },
          { item: '首次签证续签', unitLabel: '6,440 比索／次', quantity: extensions > 0 ? 1 : 0, total: extensions > 0 ? 6440 : 0, note: touristExtensionNote },
          ...(extensions > 1 ? [{ item: '第2次及以后签证续签（待确认）', unitLabel: '金额待移民局确认', quantity: extensions - 1, total: 0, note: `预计还需${extensions - 1}次续签；附件未提供金额，未计入合计，不自行估价。${touristExtensionNote}` }] : []),
        ];
    return [
      ...visaRows,
      { item: '管理费', unitLabel: '首周1,000；以后500比索／周', quantity: this.roomWeeks, total: managementFee, note: `校内教学楼及其他设施管理费；按住宿周数计算，${this.roomWeeks}周合计${money(managementFee)}比索。` },
      { item: '教材费', unitLabel: '2,500 比索／每开始8周', quantity: bookSets, total: bookSets * 2500, note: '暂估；1–8周2,500比索，9–16周5,000比索，17–24周7,500比索；教材不同，以实际购买为准。' },
      { item: '学生证', unitLabel: '200 比索／次', quantity: 1, total: 200, note: '一次性费用。' },
    ];
  }

  get roomDeposit(): number { return this.roomWeeks >= 12 ? 4000 : 3000; }
  get pickupFee(): number { return this.airportPickup === 'sunday' ? 1000 : this.airportPickup === 'other' ? 1500 : 0; }

  get quoteError(): string {
    if (!FELLA_CAMPUS_OPTIONS.some((option) => option.value === this.campus)) return '请选择有效的English Fella校区。';
    if (this.quotePlan.error) return this.quotePlan.error;
    if (this.quotePlan.date(this.selectedRegistrationDate) === null) return '请选择有效的报名日期。';
    return '';
  }
}


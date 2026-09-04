import { QuotePlanRow, presentSchoolQuote, quoteMoney } from '../../../components/school-quote-plan';
import { GlcQuotePlan } from './glc-quote-plan';
import { buildPhilippinesDetailedQuote } from '../../../components/philippines-quote-image-data';
import { QuoteImagePaymentItem } from '../../../components/quote-image-download-button.component';
import { GlcCourse, GlcRoom, glcCourseName, GLC_LOCAL_FEE_INTRO, GLC_REGISTRATION_NOTE } from './glc-pricing';
import { SchoolVisaType } from '../../../components/school-group-quote';

const DAY = 86400000;
const WEEK = 7 * DAY;
export const GLC_PROMOTION_WINDOWS = [
  ['2026-06-01', '2027-07-03'], ['2027-08-29', '2028-01-01'],
] as const;
export const GLC_PROMOTION_NOTE = '就读期间在2026/6/1–2027/7/3或2027/8/29–2028/1/1，符合条件的课程每满4周优惠150美元；轻量口语、亲子、儿童及青少年课程不适用。';
export const GLC_PICKUP_REGISTRATION_WINDOW = ['2026-04-05', '2027-01-02'] as const;
export const GLC_PICKUP_NOTE = '报名期接机优惠适用于所有课程，免费接机仅限周日；具体日期及收费见下方“另行准备”。';
export const GLC_PICKUP_FEE_NOTE = '2026年4月5日至2027年1月2日期间报名满4周，所有课程均可享周日免费接机一次；非周日接机仍收1,750比索/次。';
export const GLC_SIDA_NOTE = '思达启航专属优惠：课程每满4周减50美元，可与适用的学校优惠叠加。';

export interface GlcLocalFee {
  item: string; unit: string; quantity: number; total: number; note: string;
}

export class GlcQuoteCalculator {
  readonly weeks = Array.from({ length: 24 }, (_, index) => index + 1);
  readonly localFeeIntro = GLC_LOCAL_FEE_INTRO;
  readonly promotionNote = GLC_PROMOTION_NOTE;
  readonly pickupNote = GLC_PICKUP_NOTE;
  readonly sidaNote = GLC_SIDA_NOTE;
  returningStudents = 0;
  peopleOverride: number | null = null;
  registrationDate = (() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  })();
  pickup: 'sunday' | 'weekday' | 'none' = 'sunday';
  visaType: SchoolVisaType = 'tourist59';
  get initialVisaDays(): 30 | 59 { return this.visaType === 'tourist30' ? 30 : 59; }
  set initialVisaDays(value: 30 | 59) { this.visaType = value === 30 ? 'tourist30' : 'tourist59'; }
  readonly plan: GlcQuotePlan;

  constructor(
    readonly courses: () => GlcCourse[],
    readonly rooms: () => GlcRoom[],
    readonly registrationRate: () => number,
  ) {
    this.plan = new GlcQuotePlan('power-speaking', 'annex-double', '2026-09-06', this.weeks,
      kind => kind === 'course'
        ? this.courses().map(course => ({ id: course.id, name: glcCourseName(course), details: [course.lessons, course.suitable].filter(Boolean).join('；') }))
        : this.rooms().map(room => ({ id: room.id, name: room.name, details: '按每人床位计费' })),
      (kind, row) => row.weeks * (kind === 'course'
        ? this.courses().find(course => course.id === row.optionId)?.weeklyTuition ?? 0
        : this.rooms().find(room => room.id === row.optionId)?.weeklyAccommodation ?? 0));
    this.plan.travellers = () => this.people;
  }

  course(row: QuotePlanRow) { return this.courses().find(course => course.id === row.optionId); }
  get family() { return this.plan.courses.some(row => this.course(row)?.family); }
  get people() { return this.peopleOverride ?? (this.family ? 2 : 1); }
  get returningStudentOptions() { return Array.from({ length: this.people + 1 }, (_, index) => index); }
  get registration() { return (this.people - Math.min(this.people, Math.max(0, this.returningStudents))) * this.registrationRate(); }
  get tuition() { return this.plan.total('course'); }
  get accommodation() { return this.plan.total('room'); }

  /** Count complete four-week blocks of consecutive eligible study weeks, across row boundaries. */
  blocks(weekStarts: number[]) {
    let previous = -Infinity, run = 0, blocks = 0;
    for (const start of [...new Set(weekStarts)].sort((a, b) => a - b)) {
      if (start !== previous + WEEK) { blocks += Math.floor(run / 4); run = 0; }
      run++; previous = start;
    }
    return blocks + Math.floor(run / 4);
  }

  get schoolDiscountBlocks() {
    const eligible = this.plan.courses.filter(row => this.course(row)?.offSeasonEligible);
    return this.blocks(this.plan.weekStarts(eligible).filter(start => GLC_PROMOTION_WINDOWS.some(([from, to]) =>
      start >= this.plan.date(from)! && start + 6 * DAY <= this.plan.date(to)!)));
  }
  get schoolDiscount() { return this.schoolDiscountBlocks * 150; }
  get sidaDiscount() { return this.blocks(this.plan.weekStarts()) * 50; }
  get totalUsd() { return Math.max(0, this.registration + this.tuition + this.accommodation - this.schoolDiscount - this.sidaDiscount); }
  get registrationPickupEligible() {
    return this.plan.date(this.registrationDate) !== null && this.plan.courseWeeks >= 4
      && this.registrationDate >= GLC_PICKUP_REGISTRATION_WINDOW[0]
      && this.registrationDate <= GLC_PICKUP_REGISTRATION_WINDOW[1];
  }
  get studyPickupEligible() {
    const firstCourse = [...this.plan.courses].sort((a, b) => a.startDate.localeCompare(b.startDate))[0];
    return this.schoolDiscountBlocks > 0 && !!firstCourse && !!this.course(firstCourse)?.offSeasonEligible
      && GLC_PROMOTION_WINDOWS.some(([from, to]) => this.plan.startDate >= from && this.plan.startDate <= to);
  }
  get freePickup() { return this.pickup === 'sunday' && (this.registrationPickupEligible || this.studyPickupEligible); }
  get pickupAmount() { return this.pickup === 'none' || this.freePickup ? 0 : 1750 * this.people; }
  get longTermVisa() { return !['tourist30', 'tourist59'].includes(this.visaType); }
  get visaCount() { return this.longTermVisa ? 0 : Math.max(0, Math.ceil((this.plan.stayWeeks * 7 - this.initialVisaDays) / 30)); }

  get error(): string {
    if (this.plan.error) return this.plan.error;
    if (this.plan.date(this.registrationDate) === null) return '请选择有效的报名日期，用于核对接机优惠。';
    if (!['tourist30', 'tourist59', 'student', 'work', 'srrv', 'sirv'].includes(this.visaType)) return '请选择有效的签证类型。';
    if (!this.returningStudentOptions.includes(this.returningStudents)) return '请重新选择返校老学员人数。';
    for (const courseRow of this.plan.courses.filter(row => this.course(row)?.annexOnly)) {
      if (this.plan.rooms.some(room => !room.optionId.startsWith('annex-') && room.startDate <= this.plan.end(courseRow) && this.plan.end(room) >= courseRow.startDate)) {
        return '斯巴达课程期间只能选择副楼住宿，请调整对应房型。';
      }
    }
    if (this.family && this.plan.courses.some(row => !this.course(row)?.family)) return '亲子共享套餐与单人课程请分别报价，以免混淆两位学员的课程和费用。';
    return '';
  }

  get visaNote() {
    if (this.longTermVisa) return '长期签证相关费用暂按0估算，是否免收请由顾问向学校确认，以学校最新政策为准。';
    return `按${this.initialVisaDays}天签证预估，每次续签30天；本次每人预计续签${this.visaCount}次，每次预估4,670比索。${this.initialVisaDays === 59 ? '若持30天签证，超过4周可能提前续签。' : ''}实际以学校及移民局办理为准。`;
  }

  get localFees(): GlcLocalFee[] {
    const periods = Array.from({ length: this.people }, (_, index) => Math.ceil(this.plan.roomsFor(index + 1).reduce((sum, row) => sum + row.weeks, 0) / 4)).reduce((sum, count) => sum + count, 0);
    const textbook = (kind: 'esl' | 'ielts') => this.plan.courses.filter(row => this.course(row)?.textbook === kind).reduce((sum, row) => sum + row.weeks, 0);
    const eslWeeks = textbook('esl'), ieltsWeeks = textbook('ielts');
    const fees: GlcLocalFee[] = [
      { item: 'SSP特殊学习许可证', unit: '8,000 比索 / 人', quantity: this.longTermVisa ? 0 : this.people, total: this.longTermVisa ? 0 : 8000 * this.people, note: this.longTermVisa ? this.visaNote : '移民局收取，按报名学习时长办理；续费及换校需要重新办理' },
      { item: 'SSP-E CARD', unit: '4,500 比索 / 人', quantity: this.longTermVisa ? 0 : this.people, total: this.longTermVisa ? 0 : 4500 * this.people, note: this.longTermVisa ? this.visaNote : '移民局收取，入学和SSP同时办理，每人收一次' },
      { item: 'ACR-I CARD 外国人身份证', unit: '4,000 比索 / 人', quantity: this.longTermVisa ? 0 : this.visaCount ? this.people : 0, total: this.longTermVisa ? 0 : this.visaCount ? 4000 * this.people : 0, note: this.longTermVisa ? this.visaNote : `按${this.initialVisaDays}天签证预估，第一次续签时每人计入一次，实际以办理要求为准` },
      { item: 'ARP外国人登记', unit: '300 比索 / 人', quantity: this.longTermVisa || this.visaCount ? this.people : 0, total: (this.longTermVisa || this.visaCount ? this.people : 0) * 300, note: this.longTermVisa ? '长期签证仍计收一次，暂按300比索预估；须由顾问确认学校最新政策。' : '旅游签证首次续签时计入一次，暂按300比索预估；须由顾问确认学校最新政策。' },
      { item: '管理费', unit: '6,000 比索 / 4周', quantity: periods, total: 6000 * periods, note: 'ID、餐食、洗衣、房间清洁等；按住宿周数，每4周预估1份，不足4周先按1份预估' },
      { item: '水费', unit: '2,000 比索 / 4周', quantity: periods, total: 2000 * periods, note: '按住宿周数，每4周预估1份，不足4周先按1份预估，实际以学校收费为准' },
      { item: '电费', unit: '2,000 比索 / 4周', quantity: periods, total: 2000 * periods, note: '预估金额；实际按20比索/度/人结算，不足4周先按1份预估' },
      { item: '签证续签', unit: '4,670 比索 / 次 / 人', quantity: this.visaCount * this.people, total: this.visaCount * 4670 * this.people, note: this.visaNote },
    ];
    if (eslWeeks) fees.push({ item: '教材费（英语课程）', unit: '3,000 比索 / 8周 / 人预估', quantity: Math.ceil(eslWeeks / 8) * this.people, total: 3000 * Math.ceil(eslWeeks / 8) * this.people, note: 'ESL课程1–8周约3,000比索/人；其他英语课程暂作同额预估，不同课程、换课及学习进度可能需另购教材，以实际购买为准' });
    if (ieltsWeeks) fees.push({ item: '教材费（雅思）', unit: '5,000 比索 / 4周 / 人预估', quantity: Math.ceil(ieltsWeeks / 4) * this.people, total: 5000 * Math.ceil(ieltsWeeks / 4) * this.people, note: '雅思课程1–4周约5,000比索/人，不同课程及学习进度可能需另购教材，以到校后实际购买为准' });
    return fees;
  }

  get localTotal() { return this.localFees.reduce((sum, fee) => sum + fee.total, 0); }
  get pickupFeeNote() {
    const registration = this.plan.date(this.registrationDate) !== null ? `报名日期：${this.registrationDate.replace(/-/g, '/')}。` : '';
    const status = this.pickup === 'none' ? '本次不选接机，可自行前往学校。'
      : this.freePickup && !this.registrationPickupEligible ? '本次按就读期间的学校年度优惠赠送周日接机一次。'
      : this.pickup === 'sunday' && !this.freePickup ? '本次不符合免费条件，周日接机按1,750比索/次预估。' : '';
    return `${registration}${GLC_PICKUP_FEE_NOTE}${status}`;
  }
  get optionalFees() {
    return [
      { item: '宿务马克坦机场团体接机', total: this.pickupAmount, note: `${this.pickupFeeNote} 学校团体接机，按实际选择接机的人数计费；可能需在机场等候同批其他学生。` },
      { item: '房间押金', total: 3000 * this.people, note: `3,000比索/人${this.people > 1 ? `，共${this.people}人` : ''}；可抵扣电费，离校按学校实际结算；不计入学杂费合计` },
    ];
  }

  imageData(usdToCny: number, phpPerCny: number, exchangeNote: string, heroSrc: string) {
    const paymentItems: QuoteImagePaymentItem[] = [
      { icon: '注', label: `注册费${this.people > 1 ? `（${this.people}人）` : ''}`, amount: `${quoteMoney(this.registration)} 美元`, note: GLC_REGISTRATION_NOTE },
    ];
    if (this.schoolDiscount) paymentItems.push({ icon: '惠', label: '学校优惠', amount: `− ${quoteMoney(this.schoolDiscount)} 美元`, note: this.promotionNote, accent: true });
    if (this.sidaDiscount) paymentItems.push({ icon: '惠', label: '思达启航专属优惠', amount: `− ${quoteMoney(this.sidaDiscount)} 美元`, note: this.sidaNote, accent: true });
    const quote = buildPhilippinesDetailedQuote({
      schoolCode: 'GLC', schoolName: 'GLC', filePrefix: 'GLC', heroSrc,
      weeks: this.plan.courseWeeks, startDate: this.plan.startDate, usdToCny, totalUsd: this.totalUsd,
      fullFeeDetails: true, localFeeTableLayout: 'web', paymentItems,
      localFeeItems: this.localFees.map(fee => ({ label: fee.item, unit: fee.unit, quantity: String(fee.quantity), amount: `${quoteMoney(fee.total)} 比索`, note: fee.note })),
      localFeeTotal: this.localTotal, localCurrencyName: '比索', localFeeCny: Math.round(this.localTotal / phpPerCny), localFeeNote: this.localFeeIntro,
      optionalFeeItems: this.optionalFees.map(fee => ({ label: fee.item, amount: `${quoteMoney(fee.total)} 比索`, cnyAmount: `人民币约 ${Math.round(fee.total / phpPerCny).toLocaleString('zh-CN')} 元`, note: fee.note })),
      ruleNotes: ['学费需到校前2周交齐，可由思达代收或自行转美元给学校。', '所有学生不收取寒暑假附加费。', exchangeNote],
    });
    return presentSchoolQuote({ ...quote, totalNote: '学费需到校前2周交齐，可由思达代收或自行转美元给学校。', importantNotes: ['所有学生不收取寒暑假附加费。', exchangeNote, '最终以学校价格、空房及优惠确认为准。'] }, this.plan, 'GLC', this.totalUsd, usdToCny);
  }
}

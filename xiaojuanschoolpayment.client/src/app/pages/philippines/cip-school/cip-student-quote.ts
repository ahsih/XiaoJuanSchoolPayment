import { QuotePlanKind, QuotePlanRow, SchoolQuotePlan, quoteMoney } from '../../../components/school-quote-plan';
import { SCHOOL_VISA_OPTIONS, SchoolVisaType } from '../../../components/school-group-quote';
import { CIP_COURSES, CIP_REGISTRATION, CIP_ROOMS, CIP_WEEKS, cipDate, cipLocalFees, cipNextSunday } from './cip-pricing';

export interface CipEstimateFee { key: string; label: string; amount: number; note: string; }
export interface CipStudentLocalEstimate { rows: CipEstimateFee[]; subtotal: number | null; deposit: number | null; issues: string[]; }
const round = (amount: number) => Math.round((amount + Number.EPSILON) * 100) / 100;
const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };

/** Independent CIP student. User-confirmed returning/visa rules: 2026-09-20.
 * Prices, short stays and source conflicts remain CIP-specific, never CIA rates.
 */
export class CipStudentQuote {
  age = 18;
  returningStudent = false;
  familyStay = false;
  registrationDate = today();
  visaType: SchoolVisaType = 'tourist30';
  readonly visaOptions = SCHOOL_VISA_OPTIONS;
  readonly plan = new SchoolQuotePlan('light-esl', 'in-campus-triple', cipNextSunday(), CIP_WEEKS,
    kind => kind === 'course'
      ? CIP_COURSES.map(c => ({ id: c.id, name: c.name, details: `${c.schedule}；${c.note}`, group: c.group }))
      : CIP_ROOMS.map(r => ({ id: r.id, name: r.name, details: r.detail, group: r.hotel ? '校外酒店' : '校内宿舍' })),
    (kind, row) => {
      const rate = kind === 'course' ? CIP_COURSES.find(c => c.id === row.optionId)?.tuition : CIP_ROOMS.find(r => r.id === row.optionId)?.fee;
      return (rate ?? 0) * (row.weeks < 4 ? [0, .4, .65, .85][row.weeks] : row.weeks / 4);
    });

  get visaLabel(): string { return this.visaOptions.find(v => v.value === this.visaType)?.label ?? ''; }
  get isLongTermVisa(): boolean { return ['student', 'work', 'srrv', 'sirv'].includes(this.visaType); }
  get visaNote(): string {
    return this.isLongTermVisa
      ? `${this.visaLabel}：SSP、SSP I-Card、ACR I-Card及续签暂按免收预估；是否适用须由顾问向学校核实。`
      : `${this.visaLabel}：学习超过${this.visaType === 'tourist30' ? 4 : 8}周计续签，并计收一次ACR I-Card；金额按CIP费用资料预估。`;
  }
  get registration(): number { return this.returningStudent ? 0 : CIP_REGISTRATION; }
  get registrationNote(): string { return this.returningStudent ? '老学员返校，免注册费。' : '新学员一次性注册费600元，每位只收一次。'; }
  get hasFamilyRoom(): boolean { return this.plan.rooms.some(row => CIP_ROOMS.find(r => r.id === row.optionId)?.familyOnly); }
  get campusWeeks(): number { return this.plan.rooms.filter(row => !CIP_ROOMS.find(r => r.id === row.optionId)?.hotel).reduce((sum, row) => sum + row.weeks, 0); }
  get hotelWeeks(): number { return this.plan.roomWeeks - this.campusWeeks; }

  readonly allowedWeeks = (kind: QuotePlanKind, row: QuotePlanRow): readonly number[] => {
    if (kind === 'room') return this.plan.segmentWeeks;
    const c = CIP_COURSES.find(c => c.id === row.optionId);
    if (!c) return this.plan.segmentWeeks;
    // A complete fixed project has a single-duration selector; split identical rows
    // remain supported and are validated after merging contiguous selections.
    if (c.fixedWeeks && this.plan.courses.length === 1) return [c.fixedWeeks];
    return this.plan.segmentWeeks.filter(w => w <= c.maxWeeks);
  };
  onOptionChange({ kind, row }: { kind: QuotePlanKind; row: QuotePlanRow }): void {
    const options = this.allowedWeeks(kind, row);
    if (!options.includes(row.weeks)) this.plan.updateWeeks(kind, row.id, options.includes(4) ? 4 : options.at(-1)!);
  }

  get issues(): string[] {
    const issues: string[] = [];
    if (this.plan.error) issues.push(this.plan.error);
    if (!cipDate(this.registrationDate) || this.registrationDate > this.plan.startDate) issues.push('报名注册日须为有效日期，且不能晚于抵达日期。');
    if (!Number.isInteger(this.age) || this.age < 7 || this.age > 99) issues.push('请填写7—99岁的抵达时年龄；其他年龄请咨询。');
    if (!this.visaLabel) issues.push('请选择有效的签证类型。');
    const courses = this.plan.mergedRows('course'), rooms = this.plan.mergedRows('room');
    for (const row of courses) {
      const c = CIP_COURSES.find(c => c.id === row.optionId);
      if (!c) continue;
      const sameWeeks = courses.filter(r => r.optionId === row.optionId).reduce((sum, r) => sum + r.weeks, 0);
      if (sameWeeks > c.maxWeeks || (c.fixedWeeks && row.weeks !== c.fixedWeeks)) issues.push(`${c.name}仅接受${c.fixedWeeks ? c.fixedWeeks : `1—${c.maxWeeks}`}周，请检查课程安排。`);
      if (c.ages && (this.age < c.ages[0] || this.age > c.ages[1])) issues.push(`${c.name}适合${c.ages[0]}—${c.ages[1]}岁学生。`);
      if (this.age < 16 && !c.ages) issues.push('未满16岁请选择适龄青少年课程；其他课程须学校单独评估。');
      if (c.confirmation) issues.push(c.confirmation);
      if (c.id === 'speak-up' && (courses.length !== 1 || this.plan.courseWeeks > 2)) issues.push('Speak Up仅提供独立的1—2周项目，混合课程需顾问确认。');
      if (c.id.startsWith('ielts-guarantee') && (courses.length !== 1 || rooms.length !== 1)) issues.push('保分项目请按完整课程及同一房型报价；混合方案需顾问确认。');
      for (const roomRow of rooms) {
        if (!this.overlaps(row, roomRow)) continue;
        const r = CIP_ROOMS.find(r => r.id === roomRow.optionId);
        if (c.mode === '斯巴达' && r?.hotel) issues.push('本期斯巴达课程未提供酒店组合，请选择校内住宿。');
        if (c.id === 'regular-esl' && r?.hotel && sameWeeks === 12) issues.push('Regular ESL的12周酒店组合价格须向学校确认。');
        if (c.id === 'regular-esl' && r?.id === 'in-campus-single-b' && this.plan.courseWeeks === 2) issues.push('此两周短期组合金额须向学校确认。');
      }
    }
    for (const row of rooms) {
      const r = CIP_ROOMS.find(r => r.id === row.optionId);
      if (r?.familyOnly && !this.familyStay) issues.push('家庭四人间仅限家庭，须确认按家庭入住。');
      if (r?.sharedHotel) issues.push('酒店多人入住的每人费用及整房分摊须确认，暂不提供确定总价。');
      if (r?.hotel && this.plan.courseWeeks < 4) issues.push('酒店短住价格须顾问确认。');
    }
    return [...new Set(issues)];
  }
  private overlaps(a: QuotePlanRow, b: QuotePlanRow): boolean { return a.startDate <= this.plan.end(b) && b.startDate <= this.plan.end(a); }
  get tuition(): number { return round(this.plan.total('course')); }
  get accommodation(): number { return round(this.plan.total('room')); }
  get discount(): number { return ({ 16: 300, 20: 600, 24: 900 } as Record<number, number>)[this.plan.courseWeeks] || 0; }
  get total(): number | null { return this.issues.length ? null : round(this.tuition + this.accommodation + this.registration - this.discount); }
  readonly amountLabel = (kind: QuotePlanKind, row: QuotePlanRow): string => this.issues.length ? '需确认' : `${quoteMoney(this.plan.price(kind, row))} 元`;

  get local(): CipStudentLocalEstimate {
    if (this.issues.length) return { rows: [], subtotal: null, deposit: null, issues: ['请先完成有效的课程、住宿及个人信息。'] };
    const base = cipLocalFees(this.plan.stayWeeks, true);
    if (!base) return { rows: [], subtotal: null, deposit: null, issues: [`学校未提供${this.plan.stayWeeks}周当地费完整表，须顾问确认；暂不输出完整预算或报价图片。`] };
    // Cumulative amounts are the CIP source table, shifted by the user's confirmed
    // first-extension threshold. Do not use CIA's monetary schedule.
    const count = this.isLongTermVisa ? 0 : Math.max(0, Math.ceil((this.plan.stayWeeks * 7 - (this.visaType === 'tourist30' ? 30 : 59)) / 30));
    const extensions = [0, 5640, 13060, 18000, 23450, 29400][count];
    const keys = ['visa', 'ssp', 'ssp-card', 'acr', 'utility', 'id'];
    const rows = base.rows.map((row, index): CipEstimateFee => ({ key: keys[index], label: row.label, amount: row.amount, note: 'CIP 2026年6月当地费用参考。' }));
    for (const row of rows) {
      if (this.isLongTermVisa && ['visa', 'ssp', 'ssp-card', 'acr'].includes(row.key)) {
        row.amount = 0;
        row.note = `${this.visaLabel}：暂按免收预估，是否适用须由顾问向学校核实。`;
      } else if (row.key === 'visa') row.note = `${this.visaLabel}；学习超过${this.visaType === 'tourist30' ? 4 : 8}周需续签。`;
      else if (row.key === 'acr') row.note = `${this.visaLabel}；需续签时计收一次。`;
      if (row.key === 'visa') row.amount = extensions;
      if (row.key === 'acr') row.amount = count > 0 ? 4000 : 0;
    }
    if (this.campusWeeks) rows.splice(4, 0, { key: 'electricity', label: '宿舍基础电费', amount: this.campusWeeks * 600, note: `校内住宿${this.campusWeeks}周；酒店住宿期间不收此项。` });
    const deposit = this.campusWeeks ? cipLocalFees(this.campusWeeks, false)?.deposit ?? null : 0;
    const issues = deposit === null ? [`校内住宿${this.campusWeeks}周的押金须确认，不推算缺失档位。`] : [];
    return { rows, subtotal: round(rows.reduce((sum, row) => sum + row.amount, 0)), deposit, issues };
  }
}

export interface CipGroupedFee extends CipEstimateFee { students: number[]; }
export function cipGroupLocalFees(students: readonly CipStudentQuote[]): CipGroupedFee[] {
  const groups = new Map<string, CipGroupedFee>();
  students.forEach((student, index) => student.local.rows.forEach(row => {
    const key = JSON.stringify([row.key, row.note, row.amount]);
    const existing = groups.get(key);
    if (existing) { existing.amount = round(existing.amount + row.amount); existing.students.push(index + 1); }
    else groups.set(key, { ...row, students: [index + 1] });
  }));
  const order = ['visa', 'ssp', 'ssp-card', 'acr', 'electricity', 'utility', 'id'];
  return [...groups.values()].sort((a, b) => order.indexOf(a.key) - order.indexOf(b.key));
}

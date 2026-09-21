import { CiaContentConfig } from '../cia-school/cia-content-config';
import { SchoolQuotePlan } from '../../../components/school-quote-plan';
import { SchoolLocalFee, SchoolPaymentLine } from '../../../components/school-group-quote';
import { LaMerFamilyPrice, LaMerFamilyVersion } from './la-mer-types';

export type LaMerVisa = '30' | '59';
export const laMerMoney = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;
export const dateAfter = (date: string, days: number): string => {
  const time = Date.parse(`${date}T00:00:00Z`);
  return Number.isFinite(time) ? new Date(time + days * 86400000).toISOString().slice(0, 10) : '';
};
export interface LaMerLocalResult { localFees: SchoolLocalFee[]; included: string[]; deposit: number; pickup: number; references: string[]; }
export interface LaMerResult extends LaMerLocalResult {
  error: string; weeks: number; start: string; end: string; courseStart: string; people: number;
  original: number; schoolDiscount: number; sidaDiscount: number; total: number;
  paymentLines: SchoolPaymentLine[]; bookingDeposit: number; balance: number; paymentDue: string;
}
const enabledFees = (c: CiaContentConfig) => c.localFees.filter(f => f.enabled).sort((a, b) => a.sortOrder - b.sortOrder);
function configError(c: CiaContentConfig): string {
  const q = c.quoteSettings, policy = q.laMer!;
  const amounts = [q.registrationFee, q.peakSeasonFeePerWeek, policy.familyDepositPerPerson,
    ...Object.values(q.shortStayRatios), ...q.promotions.filter(p => p.enabled).map(p => p.discountValue)];
  return amounts.some(v => typeof v !== 'number' || !Number.isFinite(v) || v < 0)
    || q.promotions.some(p => p.enabled && p.ruleKind === 'lamer-after-school' && p.discountValue > 100)
    ? '报价价格配置尚未完整，请联系顾问核对后再保存。' : '';
}
export function laMerLocalFees(c: CiaContentConfig, weeks: number, visa: LaMerVisa, family = false): LaMerLocalResult {
  const result: LaMerLocalResult = { localFees: [], included: [], deposit: 0, pickup: 0, references: [] };
  for (const f of enabledFees(c)) {
    if (family && c.quoteSettings.laMer!.familyIncludedFeeIds.includes(f.id)) { result.included.push(f.name); continue; }
    if (f.id === 'deposit') { result.deposit = f.rates?.[weeks < 4 ? 0 : weeks <= 8 ? 1 : 2] ?? f.amount; continue; }
    if (f.id === 'pickup') { result.pickup = f.amount; continue; }
    if (f.id === 'books' || !f.includeInTotal || f.billingRule === 'optional') { result.references.push(`${f.name}：${f.amount > 0 ? `${f.amount}比索参考；` : ''}${f.note}`); continue; }
    if (f.id === 'visa-30' && visa !== '30' || f.id === 'visa-59' && visa !== '59') continue;
    let amount = typeof f.amount === 'number' ? f.amount : NaN, quantity = 1, unit = `${amount.toLocaleString('en-US')}比索／人`;
    if (f.billingRule === 'visa-extension-schedule') {
      const index = Math.ceil(weeks / 4) - (visa === '30' ? 2 : 3);
      amount = index < 0 ? 0 : f.rates?.[index] ?? NaN;
      unit = `${visa}天旅游签证 · ${weeks}周累计`;
    } else if (f.id === 'acr-i-card') {
      amount = weeks >= 9 ? f.amount : 0;
    } else if (f.billingRule === 'per-accommodation-period' || f.billingRule === 'per-course-period') {
      quantity = f.rounding === 'ceil' ? Math.ceil(weeks / (f.periodWeeks || 1)) : weeks / (f.periodWeeks || 1);
      amount = laMerMoney(amount * quantity); unit = `${String(f.amount)}比索／${f.periodWeeks || 1}周`;
    }
    result.localFees.push({ item: f.name, unitLabel: unit, quantity, total: amount, note: f.billingRule === 'visa-extension-schedule' ? `${visa}天旅游签证；${f.note}` : f.note });
  }
  return result;
}
function discounts(c: CiaContentConfig, start: string, weeks: number, people: number, original: number) {
  const monday = dateAfter(start, 1);
  const school = c.quoteSettings.promotions.find(p => p.enabled && p.ruleKind === 'lamer-course-start');
  const sida = c.quoteSettings.promotions.find(p => p.enabled && p.ruleKind === 'lamer-after-school');
  const eligible = !!school && (!school.arrivalStart || monday >= school.arrivalStart) && (!school.arrivalEnd || monday <= school.arrivalEnd)
    && weeks >= school.minimumCourseWeeks && weeks >= school.minimumAccommodationWeeks;
  const schoolDiscount = eligible ? laMerMoney(Math.min(original, people * weeks * school!.discountValue)) : 0;
  const sidaDiscount = sida ? laMerMoney((original - schoolDiscount) * sida.discountValue / 100) : 0;
  const lines: SchoolPaymentLine[] = [];
  if (schoolDiscount) lines.push({ icon: '惠', label: school!.name, value: -schoolDiscount, note: `${monday}开课；${people > 1 ? `${people}人适用。` : ''}${school!.description}`, promotionKey: school!.id });
  if (sidaDiscount) lines.push({ icon: '惠', label: sida!.name, value: -sidaDiscount, note: sida!.description, promotionKey: sida!.id });
  return { schoolDiscount, sidaDiscount, lines };
}
export class LaMerStudentQuote {
  visa: LaMerVisa = '30';
  readonly plan: SchoolQuotePlan;
  constructor(readonly config: () => CiaContentConfig, start = '2026-09-20') {
    this.plan = new SchoolQuotePlan('esl-classic', 'double', start, Array.from({ length: 24 }, (_, i) => i + 1),
      kind => kind === 'course' ? this.config().courses.filter(c => c.enabled).map(c => ({ id: c.id, name: c.name, details: c.schedule }))
        : this.config().rooms.filter(r => r.enabled).map(r => ({ id: r.id, name: r.name, details: r.note })),
      (kind, row) => {
        const c = this.config(), price = kind === 'course' ? c.courses.find(x => x.id === row.optionId)?.tuition : c.rooms.find(x => x.id === row.optionId)?.fee;
        return (price ?? NaN) * (row.weeks >= 4 ? 1 : c.quoteSettings.shortStayRatios[String(row.weeks) as '1' | '2' | '3'] ?? NaN);
      });
  }
  get result(): LaMerResult {
    const c = this.config(), p = this.plan, original = laMerMoney(p.total('course') + p.total('room'));
    const discount = discounts(c, p.startDate, p.courseWeeks, 1, original);
    const peakWeeks = new Set<number>();
    c.quoteSettings.peakSeasonRanges.filter(r => r.enabled).forEach(r => p.weekStarts().forEach(w => {
      if (w <= (p.date(r.end) ?? -Infinity) && w + 6 * 86400000 >= (p.date(r.start) ?? Infinity)) peakWeeks.add(w);
    }));
    const peak = peakWeeks.size * c.quoteSettings.peakSeasonFeePerWeek;
    const local = laMerLocalFees(c, p.stayWeeks, this.visa);
    const total = laMerMoney(original - discount.schoolDiscount - discount.sidaDiscount + c.quoteSettings.registrationFee + peak);
    return { ...local, error: p.error || configError(c) || (![original, total, local.deposit, local.pickup, ...local.localFees.map(f => f.total)].every(v => Number.isFinite(v) && v >= 0) ? '当前价格配置不完整，请联系顾问核对。' : ''),
      weeks: p.courseWeeks, start: p.startDate, end: p.endDate, courseStart: dateAfter(p.startDate, 1), people: 1,
      original, schoolDiscount: discount.schoolDiscount, sidaDiscount: discount.sidaDiscount, total,
      paymentLines: [{ icon: '注', label: '注册费', value: c.quoteSettings.registrationFee, note: '每位学员一次。' }, ...discount.lines,
        ...(peak ? [{ icon: '季', label: '旺季附加费', value: peak, note: `${peakWeeks.size}周适用，不参与课程住宿折扣。` }] : [])],
      bookingDeposit: 0, balance: total, paymentDue: '',
    };
  }
}
export class LaMerFamilyQuote {
  people = 2; guardians = 1; childAges = [8, 8, 8]; visas: LaMerVisa[] = ['30', '30', '30', '30'];
  roomId = 'double'; start = '2026-09-20'; weeks = 4;
  constructor(readonly config: () => CiaContentConfig) {}
  get children() { return this.people - this.guardians; }
  get end() { return dateAfter(this.start, this.weeks * 7 - 1); }
  versionAt(date: string): LaMerFamilyVersion | undefined { return this.config().quoteSettings.laMer!.familyVersions.filter(v => v.enabled && date >= v.start && date <= v.end).sort((a, b) => b.priority - a.priority)[0]; }
  get version() { return this.versionAt(this.start); }
  seasonAt(date: string, version = this.version) { return version?.peakRanges.some(r => date >= r.start && date <= r.end) ? 'peak' : 'off'; }
  get packages(): LaMerFamilyPrice[] { return this.version?.packages.filter(p => p.enabled && p.people === this.people && (p.season === 'all' || p.season === this.seasonAt(this.start))) ?? []; }
  get selected() { return this.packages.find(p => p.id === this.roomId); }
  setPeople(people: number) {
    this.people = people; this.guardians = Math.min(this.guardians, people - 1);
    if (!this.packages.some(p => p.id === this.roomId)) this.roomId = this.packages[0]?.id ?? '';
  }
  get error(): string {
    const time = Date.parse(`${this.start}T00:00:00Z`), policy = this.config().quoteSettings.laMer!;
    if (configError(this.config())) return configError(this.config());
    if (!Number.isFinite(time) || new Date(time).toISOString().slice(0, 10) !== this.start || new Date(time).getUTCDay() !== 0) return '入住日期请选择有效的周日。';
    if (![2, 3, 4].includes(this.people) || !Number.isInteger(this.guardians) || this.guardians < 1 || this.children < 1) return '每个家庭至少需要1名监护人和1名儿童，支持2–4人。';
    if (this.childAges.slice(0, this.children).some(a => !Number.isInteger(a) || a < policy.minimumChildAge || a > 17)) return `儿童年龄请选择${policy.minimumChildAge}–17岁。`;
    if (!this.version || !this.selected || !Number.isInteger(this.weeks) || !Number.isFinite(this.selected.prices[String(this.weeks)]) || !(this.selected.prices[String(this.weeks)] > 0)) return '该日期、人数、房型或周数未公布对应套餐，请联系顾问核价。';
    const days = Array.from({ length: this.weeks * 7 }, (_, i) => dateAfter(this.start, i));
    if (days.some(d => this.versionAt(d)?.id !== this.version!.id)) return '此方案跨越亲子价格版本或超出有效期，请联系顾问核价。';
    if (days.some(d => this.version!.exclusions.some(r => d >= r.start && d <= r.end))) return '此方案包含学校未开放的套餐日期，请调整入住日期。';
    if (days.some(d => this.seasonAt(d) !== this.seasonAt(this.start))) return '此方案跨淡旺季，学校未提供混合套餐价格，请联系顾问核价。';
    if (policy.familyComposition === 'one-guardian' && this.guardians !== 1) return '当前套餐需要1名监护人陪同儿童。';
    if (this.memberFees.some(m => ![m.deposit, ...m.localFees.map(f => f.total)].every(v => Number.isFinite(v) && v >= 0))) return '套餐外费用配置不完整，请联系顾问核对。';
    return '';
  }
  get memberFees() { return this.visas.slice(0, this.people).map(v => laMerLocalFees(this.config(), this.weeks, v, true)); }
  get result(): LaMerResult {
    const c = this.config(), original = this.selected?.prices[String(this.weeks)] ?? 0;
    const discount = discounts(c, this.start, this.weeks, this.people, original);
    const total = laMerMoney(original - discount.schoolDiscount - discount.sidaDiscount);
    const bookingDeposit = this.people * c.quoteSettings.laMer!.familyDepositPerPerson;
    const members = this.memberFees;
    return { error: this.error, weeks: this.weeks, start: this.start, end: this.end, courseStart: dateAfter(this.start, 1), people: this.people,
      original, schoolDiscount: discount.schoolDiscount, sidaDiscount: discount.sidaDiscount, total,
      paymentLines: [{ icon: '套', label: '亲子套餐原价', value: original, note: `${this.version?.name ?? ''} · ${this.selected?.name ?? ''} · ${this.guardians}名监护人＋${this.children}名儿童 · ${this.weeks}周` }, ...discount.lines],
      bookingDeposit, balance: laMerMoney(total - bookingDeposit), paymentDue: dateAfter(this.start, -28),
      localFees: members.flatMap((m, i) => m.localFees.map(f => ({ ...f, item: `成员${i + 1} · ${f.item}` }))),
      included: members[0]?.included ?? [], deposit: members.reduce((sum, m) => sum + m.deposit, 0), pickup: members[0]?.pickup ?? 0,
      references: [...new Set(members.flatMap(m => m.references))],
    };
  }
}

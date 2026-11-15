import { ExchangeRateService } from '../../../../services/exchange-rate.service';
import { connectQuoteRates, quoteCurrencyText } from '../../../../services/quote-exchange-rates';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SchoolQuotePlanComponent } from '../../../components/school-quote-plan.component';
import { QuoteImageCardData, QuoteImageDownloadButtonComponent, QuoteImagePaymentItem } from '../../../components/quote-image-download-button.component';
import { CIEC_CAMPAIGNS, CIEC_COURSES, CIEC_ROOMS, CIEC_POLICY_NOTES, CiecPerson, ciecMoney, ciecResult } from './ciec-quote';

@Component({
  selector: 'app-ciec-quote-calculator', standalone: true,
  imports: [CommonModule, FormsModule, SchoolQuotePlanComponent, QuoteImageDownloadButtonComponent],
  templateUrl: './ciec-quote-calculator.component.html',
  styleUrls: ['../cip-school/cip-quote-calculator.component.css', './ciec-quote-calculator.component.css'],
})
export class CiecQuoteCalculatorComponent {
  usdToCny = Number.NaN;
  phpPerCny = Number.NaN;
  exchangeRateDate = '';
  private readonly quoteRateSync = connectQuoteRates(this, inject(ExchangeRateService));

  mode: 'single' | 'family' | 'group' = 'single';
  count = 2;
  readonly people = [new CiecPerson()];
  readonly counts = Array.from({ length: 19 }, (_, i) => i + 2);
  readonly campaigns = CIEC_CAMPAIGNS;
  readonly policies = CIEC_POLICY_NOTES;
  readonly money = (amount: number) => amount.toLocaleString('zh-CN', { maximumFractionDigits: 2 });
  private readonly confirmations = new WeakMap<CiecPerson, { school?: string; local?: string }>();
  get active() { return this.people.slice(0, this.mode === 'single' ? 1 : this.count); }
  changeMode(value: 'single' | 'family' | 'group') {
    this.mode = value;
    this.ensurePeople();
  }
  changeCount(value: number) {
    if (Number.isInteger(value) && value >= 2 && value <= 20) { this.count = value; this.ensurePeople(); }
  }
  private ensurePeople() {
    while (this.people.length < this.count) this.people.push(new CiecPerson());
  }
  label(index: number) { return this.mode === 'single' ? '学员' : `成员${index + 1}`; }
  private signature(person: CiecPerson): string {
    return JSON.stringify({ mode: this.mode, people: this.active.map(row => ({ role: row.role, age: row.ageMonths,
      courses: row.plan.courses, rooms: row.plan.rooms })), age: person.ageMonths, role: person.role,
      visa: person.visa, care: person.guardianCare, eligibility: person.eligibilityConfirmed, stationery: person.stationery,
      books: [person.bookCount, person.bookPrice], school: person.schoolAmount, schoolNote: person.schoolConfirmation, careAmount: person.confirmedCare,
      local: person.localAmount, localNote: person.localConfirmation });
  }
  confirm(person: CiecPerson, kind: 'school' | 'local') {
    const record = this.confirmations.get(person) ?? {};
    record[kind] = this.signature(person);
    this.confirmations.set(person, record);
  }
  private current(person: CiecPerson, kind: 'school' | 'local') {
    return this.confirmations.get(person)?.[kind] === this.signature(person);
  }
  result(person: CiecPerson) {
    // Ignore stale adviser amounts after changing the scenario, without destroying entered drafts.
    const copy = Object.assign(Object.create(Object.getPrototypeOf(person)), person) as CiecPerson;
    if (!this.current(person, 'school')) copy.schoolConfirmation = '';
    return ciecResult(copy, this.active, this.mode === 'family');
  }
  local(person: CiecPerson): number | null {
    return person.localIssues.length && !this.current(person, 'local') ? null : person.localTotal;
  }
  get total() {
    const amounts = this.active.map(row => this.result(row).total);
    return amounts.some(row => row === null) ? null : ciecMoney(amounts.reduce<number>((sum, row) => sum + row!, 0));
  }
  get localTotal() {
    const amounts = this.active.map(row => this.local(row));
    return amounts.some(row => row === null) ? null : ciecMoney(amounts.reduce<number>((sum, row) => sum + row!, 0));
  }
  get canExport() { return this.total !== null && this.localTotal !== null; }
  get paymentItems(): QuoteImagePaymentItem[] {
    return this.active.flatMap((person, index) => {
      const result = this.result(person), prefix = `${this.label(index)} · `;
      const items: QuoteImagePaymentItem[] = [
        ...(['course', 'room'] as const).flatMap(kind => person.plan.rows(kind).map(row => {
          const option = (kind === 'course' ? CIEC_COURSES : CIEC_ROOMS).find(item => item.id === row.optionId)!;
          const amount = person.plan.price(kind, row);
          return { icon: kind === 'course' ? '课' : '宿', label: prefix + (kind === 'course' ? '课程名称' : '住宿名称'),
            amount: `${this.money(amount)}美元`, detailTitle: option.name, detailSubtitle: `${row.startDate} 至 ${person.plan.end(row)} · ${row.weeks}周`,
            note: option.details + (kind === 'room' && person.ageMonths < 48 ? '；婴幼儿住宿适用减免。' : '') };
        })),
        { icon: '注', label: prefix + '注册费', amount: `${person.registration}美元`, note: '一次性费用，老学员返校免费' },
      ];
      if (person.annualFee) items.push({ icon: '课', label: prefix + 'CIDEC年级学费', amount: '3000美元', note: '一次；包含项目物料及课程模块费用，不按四周重复收取。' });
      if (result.schoolDiscount || result.confirmed) items.push({ icon: '惠', label: prefix + (result.confirmed ? '学校费用确认调整' : '学校淡季优惠'),
        amount: `${result.schoolDiscount >= 0 ? '−' : '+'}${this.money(Math.abs(result.schoolDiscount))}美元`, note: result.confirmed ? person.schoolConfirmation : result.promotionNotes.join('；') });
      items.push({ icon: '惠', label: prefix + '思达95折优惠', amount: `−${this.money(result.sidaDiscount)}美元`, note: `学校优惠后的课程及住宿适用${person.annualFee ? '，含一次CIDEC年级学费' : ''}。` });
      if (person.guardianCare) {
        items.push({ icon: '护', label: prefix + '学校监护费', amount: `${this.money(result.originalCare)}美元`, note: '与家长课程、食宿分别列示。' });
        if (result.care !== result.originalCare) items.push({ icon: '惠', label: prefix + (result.waivedCare ? '淡季免监护费' : '学校监护费确认调整'),
          amount: `${result.originalCare >= result.care ? '−' : '+'}${this.money(Math.abs(result.originalCare - result.care))}美元`,
          note: result.waivedCare ? '9岁及以上无监护人陪同的斯巴达学生。' : person.schoolConfirmation });
      }
      if (person.pickup) items.push({ icon: '接', label: prefix + '宿务机场接机', amount: '20美元', note: '已选，一次。' });
      return items;
    });
  }
  get quoteImage(): QuoteImageCardData {
    const single = this.active.length === 1;
    const title = single ? `CIEC${this.active[0].plan.courseWeeks}周报价` : `CIEC${this.active.length}人报价`;
    return {
      layout: 'cia-detailed', fullFeeDetails: true, compactDetailedSections: true, localFeeTableLayout: 'web',
      fileName: 'CIEC报价.png', schoolCode: 'CIEC', title, headingText: title, subtitle: '',
      logoSrc: '/assets/sida-qihang-quote-header-logo-transparent.webp', heroSrc: '/assets/ciec/quote-banner.svg',
      quoteDateText: new Date().toLocaleDateString('zh-CN'), updatedAtText: '价格与政策：用户确认资料；2026／2027淡季政策分别适用',
      studentItems: this.active.flatMap((person, index) => [
        { icon: '人', label: this.label(index), value: `${person.role === 'student' ? '' : ({ guardian: '监护人', child: '子女' })[person.role] + ' · '}${person.ageMonths < 48 ? person.ageMonths + '个月' : this.money(person.age) + '岁'} · ${person.returning ? '老学员' : '新学员'} · ${person.visaLabel}` },
        { icon: '日', label: `${this.label(index)}日期`, value: `${person.plan.startDate} 至 ${person.plan.endDate} · ${person.plan.courseWeeks}周` },
      ]),
      paymentItems: this.canExport ? this.paymentItems : [], paymentSectionTitle: '学校费用明细', paymentCurrencyLabel: '美元',
      totalLabel: '美元费用合计', totalUsd: this.total === null ? '待顾问确认' : `${this.money(this.total)}美元`, totalCny: this.total === null ? '' : '人民币预计金额：约 ' + quoteCurrencyText(Math.round(this.total * this.usdToCny)) + ' 元',
      totalNote: '含所列课程、住宿、注册费及已选接机／监护费；比索费用另计。',
      conversionRates: { usdToCny: this.usdToCny, phpPerCny: this.phpPerCny, date: this.exchangeRateDate },
      localFeeCny: this.localTotal === null ? '' : '人民币预计金额：约 ' + quoteCurrencyText(Math.round(this.localTotal / this.phpPerCny)) + ' 元',
      localFeeTitle: '到校后学杂费明细', localFeeAmount: this.localTotal === null ? '待顾问确认' : `${this.money(this.localTotal)}比索`,
      localFeeDescription: '按各成员分别核算；不含电费、可退押金与个人消费。', localFeeNote: '教材按实际购买、电费按实际用量结算。',
      localFeeItems: this.active.flatMap((person, index) => person.localIssues.length ? [{
        label: `${this.label(index)}学校确认本地费用`, unit: '学校确认', quantity: '1人', amount: `${this.money(this.local(person) ?? 0)}比索`, note: person.localConfirmation,
      }] : person.localRows.map(row => ({ label: `${this.label(index)} · ${row.label}`, unit: `${this.money(row.amount)}比索`, quantity: '1人', amount: `${this.money(row.amount)}比索`, note: row.note }))),
      optionalFeeItems: [
        ...this.active.map((person, index) => ({ label: `${this.label(index)}可退押金`, amount: person.deposit === 'php' ? '5000比索' : '100美元', note: '已选择一种币种，不计入合计；收取单位以学校确认为准。' })),
        { label: '电费', amount: '约23比索／kWh', note: '按实际用量结算；婴幼儿仍须付水电费。' },
      ],
      benefitItems: [
        { title: '课程与住宿安排', text: '协助确认课程资格、学习日期和房型空位。' },
        { title: '费用核对', text: '美元主费与到校后比索费用分别列明。' },
        { title: '亲子游学支持', text: '协助核对监护人课程及儿童住宿安排。' },
        { title: '出发准备', text: '协助核对入学资料、接机和学校要求。' },
      ],
      hideAlumniBenefit: true, appendExchangeRateNote: false, appendFinalConfirmationNote: false, footerNotesVerbatim: true,
      importantNotes: ['课程、床位及费用以学校最终确认和正式账单为准。',
        ...(this.active.some(person => this.result(person).craft) ? ['符合条件的小学生享2026免费一小时手作体验课，非现金权益。'] : []),
        ...(this.mode === 'family' ? [CIEC_POLICY_NOTES[5]] : [])],
      note: '', contact: { name: '思达启航教育', phone: '', avatarSrc: '', qrSrc: '', placeholder: true },
    };
  }
}


import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SchoolQuotePlanComponent } from '../../../components/school-quote-plan.component';
import { QuoteImageCardData, QuoteImageDownloadButtonComponent, QuoteImagePaymentItem } from '../../../components/quote-image-download-button.component';
import { quoteMoney } from '../../../components/school-quote-plan';
import { CIP_COURSES, CIP_ROOMS, cipPickup } from './cip-pricing';
import { CipStudentQuote, cipGroupLocalFees } from './cip-student-quote';

@Component({
  selector: 'app-cip-quote-calculator', standalone: true,
  imports: [CommonModule, FormsModule, SchoolQuotePlanComponent, QuoteImageDownloadButtonComponent],
  templateUrl: './cip-quote-calculator.component.html', styleUrl: './cip-quote-calculator.component.css',
})
export class CipQuoteCalculatorComponent {
  quoteMode: 'single' | 'group' = 'single';
  studentCount = 2;
  readonly counts = Array.from({ length: 19 }, (_, i) => i + 2);
  readonly students = [new CipStudentQuote()];
  pickupAirport: 'none' | 'clark' | 'manila' = 'none';
  pickupPeople = 1;
  readonly money = quoteMoney;
  readonly budgetNote = '人民币合计包含所列课程、住宿及注册费；当地比索费用另付。教材、接机、可退押金及个人消费不计入上述合计。';
  readonly seasonalNote = '淡季现金优惠、外教升级及免接机的适用条件尚待确认，本报价未自动计入。';
  readonly depositNote = '押金结清实际费用后按学校规定退还；家庭合住房的押金收取单位须确认，不按人数重复相乘。';
  readonly extras = [
    '教材每人每4周参考1,500—2,500比索，按实际购买。',
    '宿舍每周超过16kWh的部分按25比索/kWh加收，室友分摊，以学校结算为准。',
    '超住校内参考3,000比索/日，家庭2—4人按家庭单位；酒店另询。',
  ];
  get activeStudents(): CipStudentQuote[] { return this.students.slice(0, this.quoteMode === 'single' ? 1 : this.studentCount); }
  changeMode(mode: 'single' | 'group'): void { this.quoteMode = mode; this.ensureStudents(); }
  changeCount(count: number): void {
    if (!Number.isInteger(count) || count < 2 || count > 20) return;
    this.studentCount = count; this.ensureStudents();
  }
  private ensureStudents(): void {
    while (this.students.length < this.studentCount) this.students.push(new CipStudentQuote());
    this.pickupPeople = this.activeStudents.length;
  }
  get title(): string { return this.quoteMode === 'group' ? `CIP ${this.activeStudents.length}人报价` : `CIP ${this.students[0].plan.courseWeeks}周报价`; }
  person(index: number): string { return this.quoteMode === 'group' ? `学生${index + 1}` : '学员'; }
  get total(): number | null {
    const totals = this.activeStudents.map(student => student.total);
    return totals.some(total => total === null) ? null : Math.round(totals.reduce<number>((sum, total) => sum + total!, 0) * 100) / 100;
  }
  get localRows() { return cipGroupLocalFees(this.activeStudents); }
  get localTotal(): number | null {
    const totals = this.activeStudents.map(student => student.local.subtotal);
    return totals.some(total => total === null) ? null : totals.reduce<number>((sum, total) => sum + total!, 0);
  }
  get pickup(): number | null { return this.pickupAirport === 'none' ? null : cipPickup(this.pickupAirport, this.pickupPeople); }
  get pickupNote(): string { return `${this.pickupPeople}人同一航班同行的一组参考费用；航班、行李及车辆须确认。淡季免接机需先确认。`; }
  get canExport(): boolean {
    return this.total !== null && this.localTotal !== null && this.activeStudents.every(student => !student.local.issues.length)
      && (this.pickupAirport === 'none' || this.pickup !== null);
  }
  feeScope(students: number[]): string { return this.quoteMode === 'single' ? '本学员' : `学生${students.join('、')}`; }
  get paymentItems(): QuoteImagePaymentItem[] {
    return this.activeStudents.flatMap((student, i) => {
      const prefix = this.quoteMode === 'group' ? `学生${i + 1} · ` : '';
      const rows: QuoteImagePaymentItem[] = [{ icon: '注', label: `${prefix}注册费`, amount: `${this.money(student.registration)}元`, note: `${student.registrationNote} ${student.age}岁 · ${student.visaLabel}；报名日 ${student.registrationDate}。` }];
      for (const kind of ['course', 'room'] as const) {
        for (const row of student.plan.rows(kind)) {
          const name = (kind === 'course' ? CIP_COURSES : CIP_ROOMS).find(item => item.id === row.optionId)?.name ?? '';
          rows.push({ icon: kind === 'course' ? '课' : '宿', label: `${prefix}${kind === 'course' ? '课程名称' : '住宿名称'}`,
            amount: `${this.money(student.plan.price(kind, row))}元`, detailTitle: name,
            detailSubtitle: `${row.startDate} 至 ${student.plan.end(row)} · ${row.weeks}周`,
            note: kind === 'room' && row.optionId === 'd4' ? '仅限家庭入住；此项为该就读成员的参考费用。' : '' });
        }
      }
      if (student.discount) rows.push({ icon: '惠', label: `${prefix}长期学习优惠`, amount: `−${this.money(student.discount)}元`, note: `${student.plan.courseWeeks}周适用，已扣除一次。` });
      return rows;
    });
  }
  get quoteImage(): QuoteImageCardData {
    return {
      layout: 'cia-detailed', fullFeeDetails: true, compactDetailedSections: true, localFeeTableLayout: 'web',
      fileName: 'cip-quote.png', logoSrc: '/assets/sida-qihang-quote-header-logo-transparent.webp', heroSrc: '/assets/philippines/cip-campus-intro.webp',
      schoolCode: 'CIP', title: this.title, headingText: this.title, subtitle: '克拉克 · 学习与住宿参考报价',
      quoteDateText: new Date().toLocaleDateString('zh-CN'), updatedAtText: '学费：2026年9月；当地费：2026年6月',
      studentItems: [{ icon: '日', label: '报价日期', value: new Date().toLocaleDateString('zh-CN') }, ...this.activeStudents.flatMap((student, i) => [
        { icon: '人', label: this.person(i), value: `${student.age}岁 · ${student.returningStudent ? '老学员返校' : '新学员'} · ${student.visaLabel}` },
        { icon: '日', label: `${this.person(i)}日期`, value: `${student.plan.startDate} 至 ${student.plan.endDate} · ${student.plan.courseWeeks}周；报名日 ${student.registrationDate}` },
      ])],
      paymentSectionTitle: '课程、住宿及注册费', paymentCurrencyLabel: '人民币', paymentItems: this.canExport ? this.paymentItems : [],
      totalLabel: '人民币主费合计', totalUsd: this.total === null ? '需顾问确认' : `${this.money(this.total)}元`, totalCny: '',
      totalIncludedLabel: '含所列课程、住宿及注册费', totalNote: this.budgetNote, expandTotalNote: true,
      localFeeTitle: '当地费用参考', localFeeAmount: this.localTotal === null ? '需顾问确认' : `${this.money(this.localTotal)}比索`,
      localFeeDescription: '按每位学员的签证、周数与住宿分别核算，不含可退押金、教材及接机。', localFeeNote: '实际费用按护照、签证及在菲停留情况由学校确认。',
      localFeeItems: this.localRows.map(row => ({ label: row.label, unit: `${this.money(row.amount / row.students.length)}比索／人`, quantity: `${row.students.length}人`, amount: `${this.money(row.amount)}比索`, note: `${this.feeScope(row.students)}；${row.note}` })),
      optionalFeeItems: [
        ...this.activeStudents.map((student, i) => ({ label: `${this.person(i)}可退宿舍押金`, amount: student.local.deposit === null ? '需确认' : student.local.deposit === 0 ? '酒店不收此项' : `${this.money(student.local.deposit!)}比索`, note: this.depositNote })),
        ...(this.pickup !== null ? [{ label: `${this.pickupAirport === 'clark' ? '克拉克' : '马尼拉'}接机`, amount: `${this.money(this.pickup!)}比索／组`, note: this.pickupNote }] : []),
        { label: '教材参考', amount: '1,500—2,500比索／人／4周', note: '按实际购买，未计入上述合计。' },
      ],
      hideAlumniBenefit: true, appendExchangeRateNote: false, appendFinalConfirmationNote: false, footerNotesVerbatim: true,
      serviceSectionTitle: '学习与生活支持', serviceLocations: [], benefitItems: [
        { title: '学习跟进', text: '每4周进度测试，了解当前学习情况。' },
        { title: '导师支持', text: '生活导师协助适应校园和学习安排。' },
        { title: '自助洗衣', text: '提供免费自助洗衣设备，洗涤剂自备。' },
        { title: '课余活动', text: '体育、阅读、音乐社团及英语主题活动。' },
      ],
      importantNotes: [this.seasonalNote, ...this.extras.slice(1), '课程、床位及费用以学校最终确认和正式账单为准。'], note: '',
      contact: { name: '思达启航教育', phone: '', avatarSrc: '', qrSrc: '', placeholder: true },
    };
  }
}

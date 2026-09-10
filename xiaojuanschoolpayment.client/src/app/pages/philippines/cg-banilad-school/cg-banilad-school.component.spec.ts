import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, of } from 'rxjs';
import { ExchangeRateService } from '../../../../services/exchange-rate.service';
import { SchoolContentService } from '../../../../services/school-content.service';
import { SchoolService } from '../../../../services/school.service';
import { QuoteImageDownloadButtonComponent, QuoteImageLocalFeeItem } from '../../../components/quote-image-download-button.component';
import { CgBaniladSchoolComponent } from './cg-banilad-school.component';
import { cloneCgBaniladContentConfig, createDefaultCgBaniladContentConfig } from './cg-banilad-content-config';

describe('CG Banilad verified quote', () => {
  let component: CgBaniladSchoolComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: SchoolService, useValue: { getSchools: () => of([]) } },
        { provide: ExchangeRateService, useValue: { getLatestCnyRates: () => EMPTY } },
        { provide: SchoolContentService, useValue: { getPublished: () => of(null) } },
        { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: { get: () => null } } } },
        { provide: ElementRef, useValue: new ElementRef(document.createElement('div')) },
      ],
    });
    component = TestBed.runInInjectionContext(() => new CgBaniladSchoolComponent());
  });

  it('matches every supplied four-week course price', () => {
    expect(Object.fromEntries(component.courses.map(course => [course.id, course.tuitionUsd]))).toEqual({
      'light-esl': 650, 'general-esl': 700, 'intensive-esl': 750, 'power-esl': 800,
      'semi-sparta': 800, 'premier-semi-sparta': 850, 'ielts-basic': 850,
      toeic: 850, business: 850, guardian: 750, junior: 1150,
    });
  });

  it('matches all twelve supplied room types and prices', () => {
    expect(Object.fromEntries(component.roomOptions.map(room => [room.id, room.feeUsd]))).toEqual({
      quad: 650, triple: 700, twin: 750, single: 1000,
      'alicia-quad': 850, 'alicia-triple': 900, 'alicia-twin': 1000, 'alicia-single': 1500,
      '88th-quad': 1000, '88th-triple': 1100, '88th-twin': 1200, '88th-single': 1700,
    });
    expect(component.roomOptions.find(room => room.id === 'alicia-twin')?.note).toContain('步行约3分钟');
    expect(component.roomOptions.find(room => room.id === '88th-twin')?.note).toContain('IT Park');
  });

  it('includes supplied electives and the corrected TOEIC split in both page data and image', () => {
    for (const id of ['light-esl', 'general-esl', 'intensive-esl', 'power-esl']) {
      expect(component.courses.find(course => course.id === id)?.lessons).toContain('选修2节');
    }
    component.selectedCourseId = 'toeic';
    expect(component.selectedCourse.lessons).toContain('托业 3节 + ESL 1节');
    expect(component.selectedCourse.lessons).toContain('选修1节（强制）');
    expect(component.quoteImageData.paymentItems.find(row => row.icon === '课')?.note).toContain(component.selectedCourse.lessons);
  });

  it('uses Chinese exam names consistently in course data and exported quotes', () => {
    for (const [id, name] of [['ielts-basic', '雅思基础'], ['toeic', '托业基础']] as const) {
      component.selectedCourseId = id;
      expect(component.selectedCourse.name).toBe(name);
      expect(component.selectedCourse.lessons).not.toMatch(/IELTS|TOEIC/);
      expect(component.selectedCourse.type).not.toContain('多益');
      const courseItem = component.quoteImageData.paymentItems.find(row => row.icon === '课');
      expect(courseItem?.detailTitle).toContain(name);
      expect(courseItem?.note).not.toMatch(/IELTS|TOEIC/);
      expect(component.selectedCourse.tuitionUsd).toBe(850);
    }
  });

  it('keeps the default four-week quote at USD 1165', () => {
    expect(component.tuitionForSelectedWeeks).toBe(700);
    expect(component.roomFeeForSelectedWeeks).toBe(650);
    expect(component.sidaDiscountAmount).toBeCloseTo(135);
    expect(component.offSeasonDiscount).toBe(150);
    expect(component.quoteUsd).toBe(1165);
    expect(component.localFeesTotal).toBe(16800);
  });

  it('uses the latest non-utility fees in 2026 and switches only the three weekly utilities in 2027', () => {
    component.selectedStartDate = '2026-12-27';
    expect(component.localFees.find(row => row.item === '水费')?.total).toBe(500);
    expect(component.localFees.find(row => row.item === '维护管理费')?.total).toBe(2000);
    expect(component.localFees.find(row => row.item === 'ACR E-CARD（SSP）')?.total).toBe(4500);
    expect(component.localFees.find(row => row.item === '教材费')?.amount).toBe('250–450 比索 / 本');
    expect(component.excludedLocalFees.find(row => row.item === '住宿押金（可退）')?.total).toBe(1000);
    expect(component.localFeeEstimateNote).toContain('证件、签证、教材、接机和按周押金已按学校最新明细');

    component.selectedStartDate = '2027-01-03';
    for (const [weeks, includedTotal, publishedTotal] of [
      [4, 18500, 20700], [8, 24700, 27900], [12, 42090, 46290],
      [16, 52750, 57950], [20, 63410, 69610], [24, 74070, 81270],
    ] as const) {
      component.selectedWeeks = weeks;
      expect(component.localFeePeriods).withContext(`${weeks} weeks`).toBe(weeks);
      expect(component.localFees.find(row => row.item === '综合管理费')?.total).toBe(750 * weeks);
      expect(component.localFees.find(row => row.item === '基础电费（不含空调）')?.total).toBe(500 * weeks);
      expect(component.localFees.find(row => row.item === '水费')?.total).toBe(300 * weeks);
      expect(component.localFeesTotal).withContext(`${weeks} weeks`).toBe(includedTotal);
      const deposit = component.excludedLocalFees.find(row => row.item === '住宿押金（可退）')!;
      expect(deposit.total).toBe(250 * weeks);
      expect(component.localFeesTotal + deposit.total + 1200).toBe(publishedTotal);
      expect(component.quoteImageData.localFeeAmount).toBe(component.formatPhp(includedTotal));
      expect(component.quoteImageData.localFeeItems?.find(row => row.label === '综合管理费')?.amount).toBe(component.formatPhp(750 * weeks));
    }
    expect(component.quoteImageData.localFeeNote).toContain('2027年1月4日起入学新生标准');
    expect(component.quoteImageData.localFeeItems?.find(row => row.label === '教材费')?.unit).toBe('250–450 比索 / 本');
    expect(component.quoteImageData.optionalFeeItems?.find(row => row.label === '住宿押金（可退）')?.amount).toBe('6,000 比索');
  });

  it('migrates an existing published fee document to the immediate 2026 rules without advancing the three utilities', () => {
    const legacy = createDefaultCgBaniladContentConfig();
    Object.assign(legacy.localFees.find(row => row.id === 'ssp-i-card')!, { name: 'SSP E-CARD' });
    Object.assign(legacy.localFees.find(row => row.id === 'visa-extension')!, {
      amount: 5160, rates: [5160, 6390, 4460, 4460, 4460], futureEffectiveStart: '2027-01-03', futureAmount: 6390,
    });
    Object.assign(legacy.localFees.find(row => row.id === 'books')!, { name: '书本教材费', amount: 2000, includeInTotal: true });
    Object.assign(legacy.localFees.find(row => row.id === 'deposit')!, { name: '押金（可退）', amount: 1000 });

    const migrated = cloneCgBaniladContentConfig(legacy);
    expect(migrated.localFees.find(row => row.id === 'ssp-i-card')?.name).toBe('ACR E-CARD（SSP）');
    expect(migrated.localFees.find(row => row.id === 'visa-extension')?.rates).toEqual([6390, 4460, 4460, 4460, 4460]);
    expect(migrated.localFees.find(row => row.id === 'books')?.secondaryAmount).toBe(450);
    expect(migrated.localFees.find(row => row.id === 'deposit')?.periodWeeks).toBe(1);
    expect(migrated.localFees.find(row => row.id === 'management')?.amount).toBe(2000);
    expect(migrated.localFees.find(row => row.id === 'management')?.futureAmount).toBe(750);
  });

  it('paints the 2027 fee names and values into the downloadable image', async () => {
    component.selectedStartDate = '2027-01-03';
    component.selectedWeeks = 12;
    const renderer = new QuoteImageDownloadButtonComponent();
    renderer.quote = component.quoteImageData;
    const painted = spyOn(CanvasRenderingContext2D.prototype, 'fillText').and.callThrough();
    const blob = await (renderer as unknown as { createQuoteImageBlob(scale: number): Promise<Blob> }).createQuoteImageBlob(1);
    const text = painted.calls.allArgs().map(args => args[0]).join('');
    expect(blob.type).toBe('image/png');
    expect(text).toContain('综合管理费');
    expect(text).toContain('水费');
    expect(text).toContain('旅游签证续签');
    expect(text).toContain('42,090 比索');
    expect(text).toContain('2027年1月4日起入学新生标准');
  });

  it('uses correct fee periods, including the explicitly requested three-week estimate', () => {
    for (const [weeks, periods] of [[3, 1], [4, 1], [8, 2], [12, 3], [24, 6]] as const) {
      component.selectedWeeks = weeks;
      expect(component.localFeePeriods).withContext(`${weeks} weeks`).toBe(periods);
      for (const [label, price] of [['维护管理费', 2000], ['电费', 2000], ['水费', 500]] as const) {
        const fee = component.localFees.find(row => row.item === label)!;
        expect(fee.quantity).toBe(periods);
        expect(fee.total).toBe(price * periods);
      }
    }
    component.selectedWeeks = 3;
    expect(component.localFeeEstimateNote).toContain('3周管理费、电费和水费按4周预估');
  });

  it('uses the public fee tiers by 30-day extension count after an initial 59-day visa', () => {
    for (const [weeks, count, total] of [[3, 0, 0], [4, 0, 0], [8, 0, 0], [12, 1, 6390], [16, 2, 10850], [20, 3, 15310], [24, 4, 19770]] as const) {
      component.selectedWeeks = weeks;
      const fee = component.localFees.find(row => row.item === '旅游签证续签')!;
      expect(fee.quantity).toBe(count);
      expect(fee.total).withContext(`${weeks} weeks`).toBe(total);
      expect(fee.amount.includes('第2次')).toBe(count >= 2);
      expect(fee.amount.includes('其余')).toBe(count >= 3);
      expect(fee.note.includes('本次无需续签')).toBe(count === 0);
      expect(fee.note).toContain('按持59天签证');
      expect(fee.note).toContain('若持30天签证，需另行核算');
      expect(fee.note).not.toContain('12/16/20/24');
      expect(fee.note).not.toContain('第6次');
      const imageFee = component.quoteImageData.localFeeItems?.find(row => row.label === fee.item);
      expect(imageFee?.quantity).toBe(String(count));
      expect(imageFee?.amount).toBe(component.formatPhp(total));
      expect(imageFee?.note).toBe(fee.note);
    }
  });

  it('does not confuse the eight-week example with four-week management fees', () => {
    component.selectedWeeks = 8;
    expect(component.localFees.find(row => row.item === '维护管理费')?.total).toBe(4000);
    expect(component.localFees.find(row => row.item === '教材费')?.total).toBe(0);
    // Eight weeks are covered by the default 59-day visa; no extension or ACR fee yet.
    expect(component.localFeesTotal).toBe(21300);
    component.selectedWeeks = 12;
    expect(component.localFeesTotal).toBe(36990);
    expect(component.localFees.find(row => row.item === 'ACR I-CARD（旅游签证）')?.quantity).toBe(1);
  });

  it('shows the three-week rule only when a selected course or room actually uses it', () => {
    component.quotePlan.add('course');
    component.quotePlan.add('room');
    expect(component.quoteImageData.importantNotes?.join('')).not.toContain('85%');
    component.quotePlan.courses[0].weeks = 3;
    expect(component.quoteImageData.importantNotes?.join('')).toContain('85%');
    component.quotePlan.courses[0].weeks = 4;
    component.quotePlan.rooms[1].weeks = 3;
    expect(component.quoteImageData.importantNotes?.join('')).toContain('85%');
  });

  it('updates all local-fee and image totals for the 59-day visa estimate', () => {
    for (const [weeks, total] of [[3, 16800], [4, 16800], [8, 21300], [12, 36990], [16, 45950], [20, 54910], [24, 63870]] as const) {
      component.selectedWeeks = weeks;
      expect(component.localFeesTotal).withContext(`${weeks} weeks`).toBe(total);
      expect(component.quoteImageData.localFeeAmount).toBe(component.formatPhp(total));
    }
  });

  it('estimates ACR once only after eight weeks with the same 59-day visa note in the image', () => {
    const note = '旅游签证首次续签时计入一次；59天签证按9周起预估，30天签证按首次续签时预估。';
    for (const [weeks, quantity] of [[3, 0], [4, 0], [8, 0], [12, 1], [16, 1], [20, 1], [24, 1]] as const) {
      component.selectedWeeks = weeks;
      const fee = component.localFees.find(row => row.item === 'ACR I-CARD（旅游签证）')!;
      expect(fee.quantity).withContext(`${weeks} weeks`).toBe(quantity);
      expect(fee.total).toBe(quantity * 4500);
      expect(fee.note).toBe(note);
      const imageFee = component.quoteImageData.localFeeItems?.find(row => row.label === fee.item);
      expect(imageFee?.quantity).toBe(String(quantity));
      expect(imageFee?.amount).toBe(quantity ? '4,500 比索' : '0 比索');
      expect(imageFee?.note).toBe(note);
      expect(component.quoteImageData.fullFeeDetails).toBeTrue();
    }
  });

  it('includes the ACR E-CARD school-transfer proof note on the page and in the image', () => {
    const note = '校方最新明细列4,500比索，与SSP同时办理；换学校需携带证明，否则需要重新办理。';
    const fee = component.localFees.find(row => row.item === 'ACR E-CARD（SSP）')!;
    expect(fee.note).toBe(note);
    expect(fee.quantity).toBe(1);
    expect(fee.total).toBe(4500);
    expect(component.quoteImageData.localFeeItems?.find(row => row.label === fee.item)?.note).toBe(note);
  });

  it('scales tuition and every accommodation choice consistently', () => {
    component.selectedStartDate = '2027-01-04';
    for (const course of component.courses) {
      component.selectedCourseId = course.id;
      for (const room of component.roomOptions) {
        component.selectedRoomId = room.id;
        for (const weeks of component.weekOptions) {
          component.selectedWeeks = weeks;
          const multiplier = weeks === 3 ? 0.85 : weeks / 4;
          const longDiscount = ({ 12: 50, 16: 100, 20: 150, 24: 200 } as Record<number, number>)[weeks] ?? 0;
          expect(component.quoteUsd).withContext(`${course.id}/${room.id}/${weeks}`).toBeCloseTo(100 + (course.tuitionUsd + room.feeUsd) * multiplier * 0.9 - longDiscount);
        }
      }
    }
  });

  it('charges summer fees only for overlapping study weeks without discounting them', () => {
    component.selectedStartDate = '2026-07-05';
    expect(component.summerWeeks).toBe(4);
    expect(component.summerSurcharge).toBe(160);
    expect(component.quoteUsd).toBe(1475);
    component.selectedStartDate = '2026-06-07';
    expect(component.summerWeeks).toBe(0);
    component.selectedStartDate = '2026-06-08';
    expect(component.summerWeeks).toBe(1);
    component.selectedStartDate = '2026-08-31';
    expect(component.summerWeeks).toBe(0);
  });

  it('includes the stated August 30 boundary in summer and off-season rules', () => {
    component.selectedWeeks = 12;
    component.selectedStartDate = '2026-08-30';
    expect(component.summerSurcharge).toBe(40);
    expect(component.offSeasonDiscount).toBe(450);
    expect(component.longStayDiscount).toBe(50);
    expect(component.quoteUsd).toBe(3285);
    expect(component.quoteImageData.paymentItems.length).toBe(7);
    expect(component.quoteImageData.paymentItems.some(row => row.label === '暑假附加费')).toBeTrue();
  });

  it('applies off-season entry dates inclusively and only to full four-week periods', () => {
    component.selectedStartDate = '2026-12-27';
    expect(component.offSeasonDiscount).toBe(150);
    component.selectedWeeks = 3;
    expect(component.offSeasonDiscount).toBe(0);
    expect(component.quoteUsd).toBeCloseTo(1132.75);
    expect(component.quoteUsdText).toBe('1,132.75 美元');
    expect(component.quoteImageData.totalUsd).toBe('1,132.75 美元');
    component.selectedWeeks = 4;
    component.selectedStartDate = '2026-12-28';
    expect(component.offSeasonDiscount).toBe(0);
  });

  it('does not apply date-based adjustments to invalid dates', () => {
    for (const date of ['', 'invalid', '2026-02-30', '2026-09-31']) {
      component.selectedStartDate = date;
      expect(component.summerWeeks).toBe(0);
      expect(component.offSeasonDiscount).toBe(0);
    }
  });

  it('omits unapplied discounts and surcharges from image payment rows', () => {
    const labels = () => component.quoteImageData.paymentItems.map(row => row.label);
    expect(labels()).toEqual(['注册费', '课程名称', '住宿名称', '思达折扣', '淡季优惠']);
    component.selectedStartDate = '2027-01-04';
    expect(labels()).toEqual(['注册费', '课程名称', '住宿名称', '思达折扣']);
    component.selectedStartDate = '2026-07-05';
    expect(labels()).toEqual(['注册费', '课程名称', '住宿名称', '思达折扣', '暑假附加费']);
  });

  it('preserves all ten local fee details, including zero amounts, and the estimate disclaimer', () => {
    const quote = component.quoteImageData;
    expect(quote.layout).toBe('cia-detailed');
    expect(quote.fullFeeDetails).toBeTrue();
    expect(quote.localFeeTableLayout).toBe('web');
    expect(quote.localFeeItems?.length).toBe(9);
    expect(quote.optionalFeeItems?.length).toBe(2);
    expect(quote.localFeeItems?.find(row => row.label === '旅游签证续签')?.amount).toBe('0 比索');
    expect(quote.localFeeItems?.find(row => row.label === 'ACR I-CARD（旅游签证）')?.amount).toBe('0 比索');
    expect(quote.optionalFeeItems?.find(row => row.label.includes('接机'))?.amount).toBe('1,200 比索');
    expect(quote.optionalFeeItems?.find(row => row.label.includes('押金'))?.amount).toBe('1,000 比索');
    expect(quote.importantNotes).not.toContain(component.localFeeEstimateNote);
    expect(quote.localFeeNote).toContain('具体以学校');
  });

  it('keeps image fee columns synchronized while allowing image-only notes and disclaimer copy', () => {
    for (const weeks of component.weekOptions) {
      component.selectedWeeks = weeks;
      const quote = component.quoteImageData;
      expect(quote.localFeeNote).toBe(component.localFeeEstimateNote);
      expect(quote.localFeeItems).toEqual(component.includedLocalFees.map(fee => ({
        label: fee.item, unit: fee.amount, quantity: String(fee.quantity),
        amount: component.formatPhp(fee.total), note: fee.note,
      })));
      expect(quote.optionalFeeItems).toEqual(component.optionalFeeItems);
    }
  });

  it('shows optional pickup without adding it or the deposit to either total', () => {
    const tuition = component.quoteUsd;
    const locals = component.localFeesTotal;
    component.includeAirportPickup = true;
    expect(component.excludedLocalFees[0].quantity).toBe(1);
    expect(component.excludedLocalFees[0].total).toBe(1200);
    expect(component.quoteImageData.optionalFeeItems?.[0].amount).toBe('1,200 比索');
    expect(component.localFeesTotal).toBe(locals);
    expect(component.quoteUsd).toBe(tuition);
  });

  it('calculates a mixed two-person quote per student and charges registration by new-student count', () => {
    component.setQuoteMode('group');
    component.studentCount = 2;
    const [adult, minor] = component.activeStudents;
    adult.quotePlan.courses[0].startDate = '2027-01-03';
    adult.quotePlan.rooms[0].startDate = '2027-01-03';
    minor.selectedAgeGroup = 'minor';
    minor.returningStudent = true;
    minor.visaType = 'student';
    minor.quotePlan.courses[0].optionId = 'junior';

    expect(component.payableRegistrationFee).toBe(100);
    expect(component.schoolPaymentItems[0].amount).toBe('100 美元');
    expect(component.quoteUsd).toBeCloseTo(adult.quoteUsd + minor.quoteUsd);
    expect(component.localFeesTotal).toBe(component.includedLocalFees.reduce((sum, fee) => sum + fee.total, 0));
    expect(component.quoteImageData.totalUsd).toBe(component.quoteUsdText);
    expect(component.quoteImageData.paymentItems.filter(row => row.icon === '课').map(row => row.label)).toEqual([
      '学生1 · 课程名称', '学生2 · 课程名称',
    ]);
    expect(component.quoteImageData.paymentItems.filter(row => row.label === '思达折扣').length).toBe(1);
    expect(component.quoteImageData.paymentItems.find(row => row.label === '思达折扣')?.note).toContain('2人适用');
  });

  it('zeros the four provisional long-term-visa fees but keeps one ARP fee and adviser reminders', () => {
    for (const visa of ['student', 'work', 'srrv', 'sirv'] as const) {
      component.activeStudents[0].visaType = visa;
      component.selectedWeeks = 12;
      for (const label of ['SSP特殊学习许可证', 'ACR E-CARD（SSP）', 'ACR I-CARD（旅游签证）', '旅游签证续签']) {
        const fee = component.includedLocalFees.find(row => row.item === label)!;
        expect(fee.total).withContext(`${visa}/${label}`).toBe(0);
        expect(fee.note).withContext(`${visa}/${label}`).toContain('顾问');
        expect(fee.note).withContext(`${visa}/${label}`).toContain('学校确认');
      }
      const arp = component.includedLocalFees.find(row => row.item === '生物识别申请费')!;
      expect(arp.total).withContext(visa).toBe(300);
      expect(arp.note).withContext(visa).toContain('长期签证仍计收一次');
      expect(arp.note).withContext(visa).toContain('顾问');
    }
  });

  it('keeps age informational and prices the course actually selected', () => {
    const student = component.activeStudents[0];
    student.selectedAgeGroup = 'minor';
    student.quotePlan.courses[0].optionId = 'general-esl';
    expect(student.tuition).toBe(700);
    student.quotePlan.courses[0].optionId = 'junior';
    expect(student.tuition).toBe(1150);
  });

  it('merges only identical promotion types and preserves partial eligibility in the image', () => {
    component.setQuoteMode('group');
    component.studentCount = 2;
    const [first, second] = component.activeStudents;
    first.quotePlan.courses[0].startDate = '2027-01-03';
    first.quotePlan.rooms[0].startDate = '2027-01-03';
    second.quotePlan.courses[0].startDate = '2026-09-06';
    second.quotePlan.rooms[0].startDate = '2026-09-06';
    const lines = component.quoteImageData.paymentItems;
    expect(lines.filter(row => row.label === '思达折扣').length).toBe(1);
    expect(lines.find(row => row.label === '学生2 · 淡季优惠')?.amount).toBe('− 150 美元');
    expect(lines.some(row => row.label === '学生1 · 淡季优惠')).toBeFalse();
  });

  it('renders one to four independent course and accommodation rows without changing the template', () => {
    const plan = component.activeStudents[0].quotePlan;
    const starts = ['2026-09-06', '2026-10-04', '2026-11-01', '2026-11-29'];
    for (let count = 1; count <= 4; count++) {
      while (plan.courses.length < count) plan.add('course');
      while (plan.rooms.length < count) plan.add('room');
      plan.courses.forEach((row, index) => row.startDate = starts[index]);
      plan.rooms.forEach((row, index) => row.startDate = starts[index]);
      const rows = component.quoteImageData.paymentItems;
      expect(rows.filter(row => row.icon === '课').length).withContext(`${count} course rows`).toBe(count);
      expect(rows.filter(row => row.icon === '宿').length).withContext(`${count} room rows`).toBe(count);
      expect(component.quoteError).toBe('');
    }
    expect(plan.maxWeeks).toBe(24);
  });

  it('allows the same dates for different students but blocks overlaps and totals beyond 24 weeks within one student', () => {
    component.setQuoteMode('group');
    component.studentCount = 2;
    const [first, second] = component.activeStudents;
    expect(first.quotePlan.courses[0].startDate).toBe(second.quotePlan.courses[0].startDate);
    expect(component.quoteError).toBe('');
    first.quotePlan.add('course');
    first.quotePlan.courses[1].startDate = first.quotePlan.courses[0].startDate;
    expect(component.quoteError).toContain('学生1');
    expect(component.quoteError).toContain('日期有重叠');
    first.quotePlan.courses[1].startDate = '2026-10-04';
    first.quotePlan.courses[0].weeks = 24;
    expect(component.quoteError).toContain('24周');
  });

  it('uses Chinese currencies across webpage fee data and every exported fee', () => {
    expect(component.formatUsd(1234.56)).toBe('1,234.56 美元');
    expect(component.formatPhp(4500)).toBe('4,500 比索');
    component.selectedWeeks = 12;
    component.selectedStartDate = '2026-08-30';
    component.includeAirportPickup = true;
    const quote = component.quoteImageData;
    expect(quote.paymentItems.length).toBe(7);
    expect(JSON.stringify(quote)).not.toMatch(/\b(?:USD|PHP|CNY)\b/);
    expect(JSON.stringify(component.localFees)).not.toMatch(/\b(?:USD|PHP|CNY)\b/);
    expect(quote.localFeeAmount).toBe('36,990 比索');
    expect(quote.totalUsd).toBe('3,285 美元');
    expect(quote.paymentItems.some(row => /美元\s*美元/.test(`${row.amount} ${row.note}`))).toBeFalse();
    const visa = quote.localFeeItems?.find(row => row.label === '旅游签证续签');
    expect(visa?.unit).toBe('首次6,390 比索');
    expect(visa?.unit).not.toContain('第2次');
  });

  it('renders the estimate disclaimer above separate fee columns and preserves original notes', async () => {
    component.selectedWeeks = 3;
    const renderer = new QuoteImageDownloadButtonComponent();
    renderer.quote = component.quoteImageData;
    const renderApi = renderer as unknown as {
      createQuoteImageBlob(scale: number): Promise<Blob>;
      detailedLocalNote(row: QuoteImageLocalFeeItem): string;
      drawWrappedText(...args: unknown[]): void;
    };
    const wrapped = spyOn(renderApi, 'drawWrappedText').and.callThrough();
    const painted = spyOn(CanvasRenderingContext2D.prototype, 'fillText').and.callThrough();
    const blob = await renderApi.createQuoteImageBlob(1);
    expect(blob.type).toBe('image/png');
    expect(blob.size).toBeGreaterThan(10000);
    const disclaimerCall = wrapped.calls.allArgs().find(args => args[1] === component.quoteImageData.localFeeNote)!;
    expect(disclaimerCall).toBeDefined();
    const header = painted.calls.allArgs().find(args => args[0] === '计费参考')!;
    expect(Number(disclaimerCall[3])).toBeLessThan(header[2]);
    for (const text of ['费用明细', '计费参考', '数量', '预估小计', '备注']) {
      expect(painted.calls.allArgs().some(args => args[0] === text)).toBeTrue();
    }
    for (const fee of renderer.quote.localFeeItems ?? []) {
      expect(renderApi.detailedLocalNote(fee)).toBe(fee.note);
    }
  });

  it('keeps the existing image note format for schools not using the webpage table layout', () => {
    const renderer = new QuoteImageDownloadButtonComponent();
    renderer.quote = { ...component.quoteImageData, localFeeTableLayout: undefined };
    const renderApi = renderer as unknown as { detailedLocalNote(row: QuoteImageLocalFeeItem): string };
    const fee = renderer.quote.localFeeItems![0];
    expect(renderApi.detailedLocalNote(fee)).toBe(`计费：${fee.unit} × ${fee.quantity}；${fee.note}`);
  });

  it('applies employee-edited prices, fee rules and quote-image copy without changing the layout', () => {
    const edited = createDefaultCgBaniladContentConfig();
    edited.courses.find(course => course.id === 'general-esl')!.tuition = 800;
    edited.rooms.find(room => room.id === 'quad')!.fee = 700;
    edited.quoteSettings.registrationFee = 120;
    edited.quoteSettings.promotions.find(rule => rule.id === 'cg-banilad-sida-90')!.discountValue = 5;
    edited.localFees.find(rule => rule.id === 'management')!.amount = 3000;
    edited.quoteImageSettings.paymentSectionTitle = '自定义学校费用';
    edited.quoteImageSettings.footerNotes = ['自定义报价备注'];

    (component as unknown as { applyContentConfig(value: typeof edited): void }).applyContentConfig(edited);

    expect(component.tuitionForSelectedWeeks).toBe(800);
    expect(component.roomFeeForSelectedWeeks).toBe(700);
    expect(component.quoteUsd).toBe(1395);
    expect(component.includedLocalFees.find(fee => fee.item === '维护管理费')?.total).toBe(3000);
    expect(component.quoteImageData.paymentSectionTitle).toBe('自定义学校费用');
    expect(component.quoteImageData.importantNotes).toContain('自定义报价备注');
    expect(component.quoteImageData.layout).toBe('cia-detailed');
  });
});

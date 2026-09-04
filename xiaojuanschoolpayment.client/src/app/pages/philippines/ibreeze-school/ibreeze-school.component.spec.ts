import { TestBed } from '@angular/core/testing';
import { EMPTY, of } from 'rxjs';
import { SchoolService } from '../../../../services/school.service';
import { ExchangeRateService } from '../../../../services/exchange-rate.service';
import { IbreezeSchoolComponent } from './ibreeze-school.component';
import { QuoteImageDownloadButtonComponent } from '../../../components/quote-image-download-button.component';

describe('I.BREEZE confirmed pricing and shared quote presentation', () => {
  let c: IbreezeSchoolComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [
      { provide: SchoolService, useValue: { getSchools: () => of([]) } },
      { provide: ExchangeRateService, useValue: { getLatestCnyRates: () => EMPTY } },
    ] });
    c = TestBed.runInInjectionContext(() => new IbreezeSchoolComponent());
  });
  const start = (component: IbreezeSchoolComponent, date: string) => {
    component.quotePlan.courses[0].startDate = date;
    component.quotePlan.rooms[0].startDate = date;
  };
  it('matches all nine tuition and twelve accommodation prices in the supplied tables', () => {
    expect(c.courseOptions.map(row => row.tuition)).toEqual([770,840,890,990,990,990,1190,1020,1290]);
    expect(c.roomOptions.map(row => row.fee)).toEqual([720,790,900,1270,750,950,1320,1420,1390,1050,1070,890]);
    expect(c.courseOptions.find(row => row.id === 'ielts-starter')!.lessons).toContain('4节一对一');
    expect(c.courseOptions.find(row => row.id === 'ielts-target')!.lessons).toContain('周三解析');
    expect(c.courseOptions.find(row => row.id === 'intensive-beginner')!.lessons).toContain('词汇测试');
  });
  it('totals the four-week campus local fees at 21,700 pesos, excluding optional costs', () => {
    expect(c.localFees.map(row => row.total)).toEqual([7800,4500,0,4000,2000,1000,0,2000,400]);
    expect(c.localFeesTotal).toBe(21700);
    expect(c.quoteUsd).toBe(1291);
    expect(c.quoteError).toBe('');
  });
  it('does not charge water or electricity for off-campus rooms and bills only campus weeks in mixed plans', () => {
    c.quotePlan.rooms[0].optionId = 'off-campus-standard-twin';
    expect(c.localFeesTotal).toBe(18700);
    expect(c.localFees.find(row => row.item === '水费')!.quantity).toBe(0);
    c.quotePlan.add('room'); c.quotePlan.rooms[1].optionId = 'quad-main';
    c.quotePlan.add('course');
    expect(c.localFees.find(row => row.item === '校内电费')!.total).toBe(2000);
    expect(c.localFees.find(row => row.item === '维护管理费')!.total).toBe(8000);
    expect(c.localFees.find(row => row.item === '教材费')!.total).toBe(4000);
  });
  it('charges minors the family tuition, and guardian fees only when unaccompanied', () => {
    c.selectedAgeGroup = '16-17';
    expect(c.tuitionForSelectedWeeks).toBe(1290);
    expect(c.minorManagementFee).toBe(0);
    c.minorWithoutParent = true;
    expect(c.minorManagementFee).toBe(100);
    expect(c.optionalFeeItems[0].amount).toBe('已含');
    expect(c.optionalFeeItems[0].note).toContain('不重复收费');
    expect(c.schoolPaymentItems.find(row => row.label === '未成年管理费')!.note).toContain('跳岛');
    c.quotePlan.add('course'); c.quotePlan.add('room');
    expect(c.minorManagementFee).toBe(200);
    c.selectedAgeGroup = 'adult';
    expect(c.minorManagementFee).toBe(0);
    expect(c.tuitionForSelectedWeeks).toBe(1540);
  });
  it('uses teen tuition and clears management fees when switching to adult', () => {
    c.selectedAgeGroup = '16-17';
    c.quotePlan.courses[0].optionId = 'power-esl';
    expect(c.quoteError).toBe('');
    expect(c.tuitionForSelectedWeeks).toBe(1290);
    c.minorWithoutParent = true;
    expect(c.minorManagementFee).toBe(100);
    expect(c.quoteImageData.paymentItems.find(row => row.label === '未成年管理费')!.amount).toBe('100 美元');
    c.selectedAgeGroup = 'adult';
    expect(c.minorWithoutParent).toBeFalse();
    expect(c.minorManagementFee).toBe(0);
    expect(c.tuitionForSelectedWeeks).toBe(990);
    expect(c.quoteImageData.paymentItems.some(row => row.label === '未成年管理费')).toBeFalse();
    c.selectedAgeGroup = '16-17';
    expect(c.minorManagementFee).toBe(0);
    expect(c.optionalFeeItems[0].amount).toContain('30美元');
  });
  it('enforces under-16 course selection for every row without silently changing the plan', () => {
    c.quotePlan.add('course'); c.quotePlan.add('room');
    c.selectedAgeGroup = 'under-16';
    expect(c.quoteError).toContain('未满16岁');
    expect(c.tuitionForSelectedWeeks).toBe(2580);
    expect(c.quotePlan.courses[0].optionId).toBe('intensive-speaking');
    c.quotePlan.courses[0].optionId = 'junior-english';
    expect(c.quoteError).toContain('未满16岁');
    c.quotePlan.courses[1].optionId = 'junior-english';
    expect(c.quoteError).toBe('');
    expect(c.minorManagementFee).toBe(0);
    expect(c.quoteImageData.importantNotes!.join('')).toContain('未满16岁');
    c.selectedAgeGroup = '16-17';
    c.quotePlan.courses[0].optionId = 'power-esl';
    expect(c.quoteError).toBe('');
    expect(c.quoteImageData.importantNotes!.join('')).toContain('16–17岁');
    c.selectedAgeGroup = 'adult';
    expect(c.tuitionForSelectedWeeks).toBe(2280);
  });
  it('charges registration once, waives it for returning students, and never adds an advance course-change fee', () => {
    c.quotePlan.add('course'); c.quotePlan.add('room');
    c.quotePlan.courses[1].optionId = 'power-esl';
    expect(c.registrationAmount).toBe(150);
    expect(c.quoteImageData.paymentItems.filter(row => row.label === '注册费').length).toBe(1);
    expect(c.quoteImageData.paymentItems.some(row => row.label.includes('换课'))).toBeFalse();
    const total = c.quoteUsd;
    c.returningStudent = true;
    expect(c.quoteUsd).toBe(total - 150);
    expect(c.quoteImageData.paymentItems[0].note).toBe('一次性费用，老学员返校免费');
  });
  it('uses the 2026 summer dates and the user-requested matching 2027 dates', () => {
    start(c, '2026-06-28'); expect(c.peakSeasonWeeks).toBe(4); expect(c.seasonalSurcharge).toBe(160);
    start(c, '2026-08-16'); expect(c.seasonalSurcharge).toBe(0);
    start(c, '2027-06-27'); expect(c.peakSeasonWeeks).toBe(4);
    expect(c.schoolPaymentItems.find(row => row.label === '暑期附加费')!.note).toContain('2027/06/27–08/14');
    start(c, '2027-08-08'); expect(c.peakSeasonWeeks).toBe(1);
    start(c, '2027-08-15'); expect(c.peakSeasonWeeks).toBe(0);
    start(c, '2027-08-22'); expect(c.seasonalSurcharge).toBe(0);
    start(c, '2027-06-27'); c.quotePlan.courses[0].weeks = 8;
    expect(c.peakSeasonWeeks).toBe(7); expect(c.seasonalSurcharge).toBe(280);
    expect(new Date('2027-06-27T00:00:00Z').getUTCDay()).toBe(0);
    expect(new Date('2027-08-14T00:00:00Z').getUTCDay()).toBe(6);
  });
  it('applies Christmas once to study coverage, including an earlier arrival and course switch', () => {
    start(c, '2026-12-27'); expect(c.christmasPromotionDiscount).toBe(100);
    start(c, '2027-01-03'); expect(c.christmasPromotionDiscount).toBe(0);
    start(c, '2026-11-29'); c.quotePlan.add('course'); c.quotePlan.add('room');
    expect(c.quotePlan.courses[1].startDate).toBe('2026-12-27');
    expect(c.christmasPromotionDiscount).toBe(100);
  });
  it('does not award Christmas for accommodation only or a gap between study periods', () => {
    start(c, '2026-11-29');
    c.quotePlan.rooms[0].weeks = 12;
    expect(c.christmasPromotionDiscount).toBe(0);
    c.quotePlan.add('course');
    c.quotePlan.courses[1].startDate = '2027-01-03';
    expect(c.christmasPromotionDiscount).toBe(0);
    c.quotePlan.courses[1].startDate = '2026-12-27';
    expect(c.christmasPromotionDiscount).toBe(100);
    expect(c.quoteImageData.paymentItems.filter(row => row.label === '圣诞特别优惠').length).toBe(1);
    expect(c.quoteImageData.paymentItems.find(row => row.label === '圣诞特别优惠')!.note).toContain('期间在读');
    c.quotePlan.courses[0].weeks = 8; c.quotePlan.courses.splice(1);
    expect(c.christmasPromotionDiscount).toBe(100);
  });
  it('stacks September and Christmas only for each qualifying student', () => {
    c.setQuoteMode('group');
    const [first, second] = c.activeStudents;
    first.selectedRegistrationDate = '2026-09-30';
    first.quotePlan.courses[0].startDate = first.quotePlan.rooms[0].startDate = '2026-12-20';
    second.selectedRegistrationDate = '2026-10-01';
    second.quotePlan.courses[0].startDate = second.quotePlan.rooms[0].startDate = '2026-11-29';
    expect(first.septemberPromotionDiscount).toBe(200);
    expect(first.christmasPromotionDiscount).toBe(100);
    expect(first.quoteUsd).toBe(1191);
    expect(second.septemberPromotionDiscount).toBe(0);
    expect(second.christmasPromotionDiscount).toBe(0);
    expect(c.quoteUsd).toBe(2682);
    const rows = c.quoteImageData.paymentItems.filter(row => row.label.includes('优惠'));
    expect(rows.map(row => row.label)).toEqual(['学生1 · 9月住宿优惠', '学生1 · 圣诞特别优惠']);
    expect(rows.map(row => row.amount)).toEqual(['− 200 美元', '− 100 美元']);
    expect(JSON.stringify(c.quoteImageData)).not.toContain('8月住宿优惠');
  });
  it('enables the confirmed September promotion in both webpage totals and image rows', () => {
    c.selectedRegistrationDate = '2026-09-20';
    expect(c.septemberPromotionDiscount).toBe(200);
    expect(c.quoteUsd).toBe(1291);
    expect(c.quoteError).toBe('');
    expect(c.quoteImageData.paymentItems.find(row => row.label === '9月住宿优惠')!.amount).toBe('− 200 美元');
  });
  it('applies confirmed promotion dates per eligible room without discounting ineligible rooms', () => {
    for (const date of ['2026-09-01', '2026-09-30']) { c.selectedRegistrationDate = date; expect(c.septemberPromotionDiscount).toBe(200); }
    for (const date of ['2026-08-31', '2026-10-01']) { c.selectedRegistrationDate = date; expect(c.septemberPromotionDiscount).toBe(0); }
    c.selectedRegistrationDate = '2026-09-20'; c.quotePlan.rooms[0].optionId = 'twin-ib2';
    c.quotePlan.add('room'); c.quotePlan.rooms[1].optionId = 'off-campus-standard-twin';
    expect(c.septemberPromotionDiscount).toBe(120);
    start(c, '2026-12-27'); c.quotePlan.rooms[1].startDate = '2027-01-24';
    expect(c.septemberPromotionDiscount).toBe(0);
  });
  it('shows actual-rate renminbi estimates for pickup and deposit, including the eight-week threshold', () => {
    c.usdToCny = 7; c.phpPerCny = 9;
    expect(c.optionalFeeItems[0].cnyAmount).toBe('约人民币 210／350 元');
    expect(c.optionalFeeItems[1].cnyAmount).toBe('约人民币 333 元');
    c.quotePlan.rooms[0].weeks = 8;
    expect(c.depositAmount).toBe(5000);
    expect(c.optionalFeeItems[1].cnyAmount).toBe('约人民币 556 元');
    expect(c.quoteImageData.optionalFeeItems).toEqual(c.optionalFeeItems);
  });
  it('preserves all rows and the approved full template for 1, 2, 3 and 4 course/room periods', () => {
    for (let count = 1; count <= 4; count++) {
      const q = c.quoteImageData;
      expect(q.fullFeeDetails).toBeTrue(); expect(q.layout).toBe('cia-detailed'); expect(q.localFeeTableLayout).toBe('web');
      expect(q.headingText).toBe(`I.BREEZE${count * 4}周报价`);
      const courses = q.paymentItems.filter(row => row.label.startsWith('课程名称'));
      const rooms = q.paymentItems.filter(row => row.label.startsWith('住宿名称'));
      expect(courses.length).toBe(count); expect(rooms.length).toBe(count);
      expect(courses[0].label).toBe(count === 1 ? '课程名称' : '课程名称1');
      expect(courses[0].detailTitle).toContain('Intensive Speaking');
      expect(q.localFeeNote).toBe(c.localFeeIntro);
      expect(q.localFeeItems!.map(row => row.note)).toEqual(c.localFees.map(row => row.note));
      expect(q.benefitItems!.length).toBe(4); expect(q.alumniBenefitItems!.length).toBe(1);
      if (count < 4) { c.quotePlan.add('course'); c.quotePlan.add('room'); }
    }
  });
  it('does not shift other rows, blocks overlaps, and warns on date mismatches', () => {
    c.quotePlan.add('course'); const second = c.quotePlan.courses[1].startDate;
    c.quotePlan.courses[0].startDate = '2026-09-13';
    expect(c.quotePlan.courses[1].startDate).toBe(second);
    expect(c.quoteError).toContain('重叠');
    c.quotePlan.courses[0].startDate = '2026-09-06';
    expect(c.quotePlan.warning).toContain('日期不一致');
    expect(c.quoteImageData.importantNotes![0]).toBe(c.quotePlan.warning);
  });
  it('keeps simultaneous students independent and charges registration by people, not periods', () => {
    c.setQuoteMode('group');
    expect(c.activeStudents.length).toBe(2);
    expect(c.quoteError).toBe('');
    expect(c.registrationAmount).toBe(300);
    expect(c.quoteUsd).toBe(2582);
    expect(c.localFeesTotal).toBe(43400);
    c.students[0].quotePlan.add('course'); c.students[0].quotePlan.add('room');
    expect(c.registrationAmount).toBe(300);
    expect(c.students[1].quotePlan.courseWeeks).toBe(4);
    c.students[1].returningStudent = true;
    expect(c.registrationAmount).toBe(150);
    expect(c.schoolPaymentItems[0].note).toContain('新生1人');
    c.students[0].returningStudent = true;
    expect(c.registrationAmount).toBe(0);
  });
  it('prices parent and child separately, including every teen course period', () => {
    c.setQuoteMode('group');
    const child = c.students[1];
    child.selectedAgeGroup = '16-17';
    child.quotePlan.add('course'); child.quotePlan.add('room');
    child.quotePlan.courses[1].optionId = 'power-esl';
    expect(child.tuitionForSelectedWeeks).toBe(2580);
    expect(c.students[0].tuitionForSelectedWeeks).toBe(770);
    expect(c.minorManagementFee).toBe(0);
    child.minorWithoutParent = true;
    expect(c.minorManagementFee).toBe(200);
    expect(c.quoteUsd).toBe(c.activeStudents.reduce((sum, student) => sum + student.quoteUsd, 0));
    child.selectedAgeGroup = 'under-16';
    expect(c.quoteError).toContain('学生2：未满16岁');
    child.quotePlan.courses.forEach(row => row.optionId = 'junior-english');
    expect(c.quoteError).toBe('');
    child.selectedAgeGroup = 'adult';
    expect(child.minorWithoutParent).toBeFalse();
    expect(c.minorManagementFee).toBe(0);
  });
  it('aggregates individual local fees without charging off-campus utilities', () => {
    c.setQuoteMode('group');
    c.students[1].quotePlan.rooms[0].optionId = 'off-campus-standard-twin';
    expect(c.localFeesTotal).toBe(40400);
    expect(c.localFees.find(row => row.item === '校内电费')!.total).toBe(2000);
    expect(c.localFees.find(row => row.item === '水费')!.total).toBe(1000);
    expect(c.localFees.find(row => row.item === 'SSP特殊学习许可证')!.quantity).toBe(2);
    c.students[1].quotePlan.courses[0].weeks = 12;
    c.students[1].quotePlan.rooms[0].weeks = 12;
    expect(c.localFees.filter(row => row.item.includes('签证续签')).map(row => row.total)).toEqual([0,11550]);
    expect(c.localFees.reduce((sum, row) => sum + row.total, 0)).toBe(c.localFeesTotal);
    expect(c.quoteImageData.localFeeItems!.map(row => row.note)).toEqual(c.localFees.map(row => row.note));
  });
  it('evaluates discounts, arrival windows and summers for each person', () => {
    c.setQuoteMode('group');
    const [parent, child] = c.activeStudents;
    parent.selectedRegistrationDate = '2026-09-30';
    child.selectedRegistrationDate = '2026-10-01';
    expect(parent.septemberPromotionDiscount).toBe(200);
    expect(child.septemberPromotionDiscount).toBe(0);
    child.quotePlan.courses[0].startDate = child.quotePlan.rooms[0].startDate = '2026-12-27';
    expect(child.christmasPromotionDiscount).toBe(100);
    expect(parent.christmasPromotionDiscount).toBe(0);
    child.quotePlan.courses[0].startDate = child.quotePlan.rooms[0].startDate = '2027-06-27';
    expect(child.seasonalSurcharge).toBe(160);
    expect(parent.seasonalSurcharge).toBe(0);
  });
  it('preserves inactive student edits when changing modes or headcount', () => {
    c.setQuoteMode('group'); c.studentCount = 3;
    c.students[2].selectedAgeGroup = '16-17';
    c.students[2].quotePlan.courses[0].optionId = 'power-esl';
    c.studentCount = 2;
    expect(c.activeStudents.length).toBe(2);
    c.setQuoteMode('single');
    expect(c.registrationAmount).toBe(150);
    expect(c.quoteUsd).toBe(1291);
    expect(c.quoteImageData.headingText).toBe('I.BREEZE4周报价');
    expect(c.quoteImageData.paymentItems.some(row => row.label.includes('学生'))).toBeFalse();
    c.setQuoteMode('group'); c.studentCount = 3;
    expect(c.registrationAmount).toBe(450);
    expect(c.students[2].selectedAgeGroup).toBe('16-17');
    expect(c.students[2].quotePlan.courses[0].optionId).toBe('power-esl');
    for (const invalid of [0, 1, 2.5, 21, NaN]) { c.studentCount = invalid; expect(c.quoteError).toContain('人数'); }
    c.studentCount = 3; expect(c.quoteError).toBe('');
  });
  it('labels every person in the same image template without adding their weeks together', () => {
    c.setQuoteMode('group'); c.studentCount = 3;
    c.students[1].quotePlan.add('course'); c.students[1].quotePlan.add('room');
    const q = c.quoteImageData;
    expect(q.headingText).toBe('I.BREEZE 3人报价');
    expect(q.layout).toBe('cia-detailed');
    expect(q.paymentItems.filter(row => row.detailTitle).length).toBe(8);
    expect(q.paymentItems.filter(row => row.label === '注册费').length).toBe(1);
    expect(q.paymentItems.filter(row => row.label.includes('学生2') && row.detailTitle).length).toBe(4);
    expect(q.paymentItems.filter(row => row.detailTitle).map(row => row.icon)).toEqual(['课','课','课','课','宿','宿','宿','宿']);
    expect(q.optionalFeeItems!.length).toBe(2);
    expect(q.optionalFeeItems![0].note).toContain('不按人数累加');
    expect(q.optionalFeeItems![1].note).toContain('共住房间');
    c.students[1].quotePlan.rooms[0].startDate = '2026-08-30';
    expect(c.quoteImageData.importantNotes![0]).toContain('学生2：课程与住宿日期不一致');
    c.students[2].quotePlan.add('course');
    c.students[2].quotePlan.courses[1].startDate = c.students[2].quotePlan.courses[0].startDate;
    expect(c.quoteError).toContain('学生3：课程日期有重叠');
  });
  it('does not repeat included pickup or multiply reference deposits for a group', () => {
    c.setQuoteMode('group');
    c.activeStudents.forEach(student => { student.selectedAgeGroup = '16-17'; student.minorWithoutParent = true; });
    expect(c.optionalFeeItems[0].amount).toBe('已含');
    expect(c.optionalFeeItems[0].cnyAmount).toBe('');
    expect(c.optionalFeeItems[1].amount).toBe('3,000 比索');
    c.students[1].quotePlan.rooms[0].weeks = 8;
    expect(c.optionalFeeItems[1].amount).toBe('3,000／5,000 比索');
    c.students[1].minorWithoutParent = false;
    expect(c.optionalFeeItems[0].amount).toContain('30美元');
    expect(c.optionalFeeItems[0].note).toContain('不重复收费');
  });
  it('estimates extensions for both initial visa durations across all supported stays', () => {
    const student = c.students[0];
    const counts = { 30: [0,1,2,3,4,5], 59: [0,0,1,2,3,4] };
    for (const days of [30,59] as const) {
      student.initialVisaDays = days;
      [4,8,12,16,20,24].forEach((weeks, index) => {
        student.quotePlan.courses[0].weeks = student.quotePlan.rooms[0].weeks = weeks;
        expect(student.visaExtensionCount).toBe(counts[days][index]);
        expect(student.visaExtensionTotal).toBe([5140,6410,4440,5040,4440].slice(0,counts[days][index]).reduce((sum, value) => sum + value, 0));
        expect(student.localFees.find(row => row.item.startsWith('ACR'))!.quantity).toBe(counts[days][index] ? 1 : 0);
        expect(c.quoteImageData.localFeeItems!.find(row => row.label === '签证续签')!.note).toContain(`按${days}天旅游签证`);
      });
    }
  });
  it('updates visa and ACR fees together without changing school payment or other local fees', () => {
    const student = c.students[0];
    student.quotePlan.courses[0].weeks = student.quotePlan.rooms[0].weeks = 8;
    const payment = c.quoteUsd, original = c.localFeesTotal;
    student.initialVisaDays = 59;
    expect(c.quoteUsd).toBe(payment);
    expect(c.localFeesTotal).toBe(original - 5140 - 4000);
    expect(c.localFees.find(row => row.item === '签证续签')!.quantity).toBe(0);
    expect(c.quoteImageData.localFeeItems!.map(row => row.note)).toEqual(c.localFees.map(row => row.note));
    student.quotePlan.add('course'); student.quotePlan.add('room');
    student.quotePlan.courses[1].startDate = student.quotePlan.rooms[1].startDate = '2026-11-15';
    expect(student.quotePlan.stayWeeks).toBe(14);
    expect(student.visaExtensionCount).toBe(2);
  });
  it('keeps mixed group visa selections independent and identifies their fee rows', () => {
    c.setQuoteMode('group');
    c.activeStudents.forEach(student => { student.quotePlan.courses[0].weeks = student.quotePlan.rooms[0].weeks = 8; });
    c.students[1].initialVisaDays = 59;
    const rows = c.quoteImageData.localFeeItems!.filter(row => row.label.includes('签证续签'));
    expect(rows.map(row => row.quantity)).toEqual(['1','0']);
    expect(rows.map(row => row.label)).toEqual(['学生1 · 签证续签','学生2 · 签证续签']);
    expect(rows[0].note).toContain('30天'); expect(rows[1].note).toContain('59天');
    c.setQuoteMode('single'); c.setQuoteMode('group');
    expect(c.students[1].initialVisaDays).toBe(59);
    (c.students[1] as any).initialVisaDays = 60;
    expect(c.quoteError).toContain('学生2：请选择有效的签证类型');
  });
  it('estimates four permit fees as zero for every long-term visa, retaining confirmation notes', () => {
    const student = c.students[0];
    for (const type of ['student', 'work', 'srrv', 'sirv'] as const) {
      for (const weeks of [4,8,12,16,20,24]) {
        student.visaType = 30;
        student.quotePlan.courses[0].weeks = student.quotePlan.rooms[0].weeks = weeks;
        const payment = c.quoteUsd;
        const otherFees = c.localFees.filter(row => !/SSP|ACR|签证续签/.test(row.item));
        student.visaType = type;
        expect(c.quoteError).toBe(''); expect(c.quoteUsd).toBe(payment);
        expect(student.visaExtensionCount).toBe(0); expect(student.visaExtensionTotal).toBe(0);
        const permits = c.localFees.filter(row => /SSP|ACR|签证续签/.test(row.item));
        expect(permits.length).toBe(4);
        permits.forEach(row => {
          expect(row.total).toBe(0); expect(row.quantity).toBe(0);
          expect(row.note).toContain(student.visaLabel);
          expect(row.note).toContain('暂按免收预估'); expect(row.note).toContain('须由顾问向学校确认');
        });
        expect(c.localFeesTotal).toBe(otherFees.reduce((sum,row)=>sum+row.total,0));
        expect(c.quoteImageData.localFeeItems!.map(row=>row.note)).toEqual(c.localFees.map(row=>row.note));
      }
    }
  });
  it('restores tourist fees on switching back and isolates exemptions in mixed groups', () => {
    c.setQuoteMode('group');
    c.activeStudents.forEach(s=>{s.quotePlan.courses[0].weeks=s.quotePlan.rooms[0].weeks=8;});
    const before = c.localFeesTotal;
    c.students[1].visaType = 'srrv';
    expect(c.localFeesTotal).toBe(before - 7800 - 4500 - 4000 - 5140);
    const rows = c.quoteImageData.localFeeItems!.filter(row=>row.label.includes('SSP特殊'));
    expect(rows.map(row=>row.label)).toEqual(['学生1 · SSP特殊学习许可证','学生2 · SSP特殊学习许可证']);
    expect(rows.map(row=>row.amount)).toEqual(['7,800 比索','0 比索']);
    c.setQuoteMode('single'); c.setQuoteMode('group');
    expect(c.students[1].visaType).toBe('srrv');
    c.students[1].visaType = 59;
    expect(c.localFeesTotal).toBe(before - 4000 - 5140);
    c.students[1].visaType = 30;
    expect(c.localFeesTotal).toBe(before);
    expect(c.localFees.some(row=>row.note.includes('暂按免收'))).toBeFalse();
  });
  it('labels course and accommodation names separately from amounts in single and group images', () => {
    for (const mode of ['single', 'group'] as const) {
      c.setQuoteMode(mode);
      for (const count of [1, 2, 3]) {
        c.activeStudents.forEach(student => {
          while (student.quotePlan.courses.length < count) student.quotePlan.add('course');
          while (student.quotePlan.rooms.length < count) student.quotePlan.add('room');
        });
        const rows = c.quoteImageData.paymentItems.filter(row => row.detailTitle);
        const expected = (['课', '宿'] as const).flatMap(icon => c.activeStudents.flatMap((student, index) =>
          student.quotePlan.paymentItems().filter(row => row.icon === icon).map((row, period) => ({
            ...row, label: `${mode === 'group' ? '学生' + (index + 1) + ' · ' : ''}${icon === '课' ? '课程名称' : '住宿名称'}${count > 1 ? period + 1 : ''}`,
          }))));
        expect(rows).toEqual(expected);
        expect(rows.some(row => /课程费|住宿费/.test(row.label))).toBeFalse();
      }
      // Restore a single period before testing the next mode.
      c.activeStudents.forEach(student => { student.quotePlan.courses.splice(1); student.quotePlan.rooms.splice(1); });
    }
  });
  it('merges matching image discounts for 2, 3 and 20 people without changing individual calculations', () => {
    c.setQuoteMode('group');
    for (const count of [2, 3, 20]) {
      c.studentCount = count;
      c.activeStudents.forEach(student => {
        student.selectedRegistrationDate = '2026-09-10';
        student.quotePlan.courses[0].startDate = student.quotePlan.rooms[0].startDate = '2026-12-20';
      });
      const before = c.quoteUsd;
      const rows = c.quoteImageData.paymentItems;
      const promos = rows.filter(row => row.icon === '折' || row.icon === '惠');
      expect(promos.map(row => row.label)).toEqual(['思达折扣', '9月住宿优惠', '圣诞特别优惠']);
      expect(promos.map(row => row.amount)).toEqual([`− ${c.formatUsd(149 * count)} 美元`, `− ${c.formatUsd(200 * count)} 美元`, `− ${c.formatUsd(100 * count)} 美元`]);
      promos.forEach(row => expect(row.note).toContain(`${count}人适用`));
      expect(rows.filter(row => row.detailTitle).length).toBe(count * 2);
      expect(c.schoolPaymentItems.filter(row => row.icon === '惠').length).toBe(count * 2);
      expect(c.quoteUsd).toBe(before);
      expect(c.quoteUsd).toBe(c.activeStudents.reduce((sum, student) => sum + student.quoteUsd, 0));
    }
    c.setQuoteMode('single');
    expect(c.quoteImageData.paymentItems.filter(row => row.icon === '折' || row.icon === '惠'))
      .toEqual(c.students[0].schoolPaymentItems.filter(row => row.icon === '折' || row.icon === '惠'));
  });
  it('sums different eligible room discounts and identifies only participating students', () => {
    c.setQuoteMode('group'); c.studentCount = 3;
    c.students[1].quotePlan.rooms[0].optionId = 'off-campus-standard-twin';
    c.students[2].quotePlan.rooms[0].optionId = 'twin-main';
    const row = c.quoteImageData.paymentItems.find(row => row.label === '9月住宿优惠')!;
    expect(row.amount).toBe('− 320 美元');
    expect(row.note).toContain('学生1、3适用');
    expect(row.note).not.toContain('学生2');
  });
  it('keeps differing conditions when merging and does not merge additional charges', () => {
    c.setQuoteMode('group');
    spyOnProperty(c.students[1], 'septemberPromotionText', 'get').and.returnValue('此学生的单独适用条件');
    c.activeStudents.forEach(student => { student.selectedAgeGroup = '16-17'; student.minorWithoutParent = true; });
    const rows = c.quoteImageData.paymentItems;
    const promo = rows.find(row => row.label === '9月住宿优惠')!;
    expect(promo.note).toContain('学生1：');
    expect(promo.note).toContain('学生2：此学生的单独适用条件');
    expect(rows.filter(row => row.label.includes('未成年管理费')).map(row => row.label))
      .toEqual(['学生1 · 未成年管理费', '学生2 · 未成年管理费']);
  });
  it('renders pickup and deposit estimates in gray beneath neutral right-aligned amounts', async () => {
    const renderer = new QuoteImageDownloadButtonComponent();
    renderer.quote = c.quoteImageData;
    const paint: { text: string; x: number; y: number; color: string | CanvasGradient | CanvasPattern; font: string; align: string }[] = [];
    const original = CanvasRenderingContext2D.prototype.fillText;
    spyOn(CanvasRenderingContext2D.prototype, 'fillText').and.callFake(function(this: CanvasRenderingContext2D, text, x, y) {
      paint.push({text,x,y,color:this.fillStyle,font:this.font,align:this.textAlign}); original.call(this,text,x,y);
    });
    const blob = await renderer['createQuoteImageBlob'](2);
    expect(blob.size).toBeGreaterThan(50000);
    for (const fee of c.optionalFeeItems) {
      const amount = paint.find(row => row.text === fee.amount && row.x === 546)!;
      const cny = paint.find(row => row.text === fee.cnyAmount && row.x === 546)!;
      expect(amount.color).toBe('#14233e'); expect(amount.align).toBe('right');
      expect(cny.color).toBe('#64748b'); expect(cny.font).toContain('12px'); expect(cny.align).toBe('right');
      expect(cny.y).toBeGreaterThan(amount.y);
    }
    expect(paint.some(row => row.text === '为什么选择思达启航？')).toBeTrue();
    expect(paint.some(row => row.text.includes('报价说明'))).toBeTrue();
  }, 30000);
});

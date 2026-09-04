import { TestBed } from '@angular/core/testing';
import { EMPTY, of } from 'rxjs';
import { SchoolService } from '../../../../services/school.service';
import { ExchangeRateService } from '../../../../services/exchange-rate.service';
import { PhilinterSchoolDetailComponent } from './philinter-school-detail.component';
import { PHILINTER_SUMMER_PERIODS } from './philinter-quote';

describe('PHILINTER supplied catalog and quote rules', () => {
  let c: PhilinterSchoolDetailComponent;
  const setPlan = (weeks: number, start = '2026-08-16') => {
    c.quotePlan.courses[0].weeks = c.quotePlan.rooms[0].weeks = weeks;
    c.quotePlan.courses[0].startDate = c.quotePlan.rooms[0].startDate = start;
  };
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [
      { provide: SchoolService, useValue: { getSchools: () => of([]) } },
      { provide: ExchangeRateService, useValue: { getLatestCnyRates: () => EMPTY } },
    ] });
    c = TestBed.runInInjectionContext(() => new PhilinterSchoolDetailComponent());
    setPlan(4, '2026-09-06');
  });
  it('matches the 15 course and six room prices without unsupported legacy courses', () => {
    expect(c.courseFees.map(row => row.tuition)).toEqual([790,900,1030,1170,1200,1580,1420,1100,1280,1150,1200,1340,1490,1400,1400]);
    expect(c.roomFees.map(row => row.fee)).toEqual([810,970,1400,890,1100,1690]);
    (c as any).applyPricingData([{ name: 'Primary English（7–11岁）', week: 4, price: 1 }, { name: 'Junior ESL（12–17岁）', week: 4, price: 1350 }], [], []);
    expect(c.courseFees.length).toBe(15);
    expect(c.courseFees.find(row => row.id === 'junior-esl-12-17-years')!.tuition).toBe(1350);
    (c as any).applyPricingData([], [], [{ name: '注册费', fee: 220 }]);
    expect(c.registrationFee).toBe(120);
    expect(c.quoteUsd).toBe(1560);
    expect(c.quoteImageData.paymentItems[0].amount).toBe('120 美元');
  });
  it('charges both lists at 45/65/85 percent with registration once', () => {
    [0.45,0.65,0.85].forEach((ratio, index) => {
      setPlan(index + 1, '2026-09-06');
      expect(c.courseAndRoomBase).toBeCloseTo(1600 * ratio, 2);
      expect(c.quoteUsd).toBeCloseTo(120 + 1600 * ratio * 0.9, 2);
    });
  });
  it('matches the eight-week 26,700 peso example and separates optional payments', () => {
    setPlan(8, '2026-09-06');
    expect(c.localFeesTotal).toBe(26700);
    expect(c.visaExtensionCount).toBe(0);
    c.initialVisaDays = 30;
    expect(c.visaExtensionCount).toBe(1);
    expect(c.localFeesTotal).toBe(37920);
    expect(c.localFees.filter(row => row.item.endsWith('ARP外国人登记')).reduce((sum, row) => sum + row.total, 0)).toBe(300);
    expect(c.optionalFeeItems[2].amount).toBe('3,000 比索');
    expect(c.optionalFeeItems[0].amount).toBe('0 比索');
    expect(c.optionalFeeItems[0].note).toContain('学校团体接机');
    c.calculator.pickup = 'other';
    expect(c.optionalFeeItems[0].amount).toBe('1,500 比索');
  });
  it('counts complete eligible study weeks and rejects excluded rooms, guarantee courses and gaps', () => {
    setPlan(16); expect(c.offSeasonDiscountAmount).toBe(600);
    setPlan(8, '2026-11-01'); expect(c.offSeasonDiscountAmount).toBe(0);
    setPlan(8); c.quotePlan.rooms[0].optionId = 'azon-triple'; expect(c.offSeasonDiscountAmount).toBe(0);
    c.quotePlan.rooms[0].optionId = 'azon-twin'; expect(c.offSeasonDiscountAmount).toBe(300);
    c.quotePlan.courses[0].optionId = 'ielts-guarantee-8-weeks'; expect(c.offSeasonDiscountAmount).toBe(0);
    c.quotePlan.courses[0].optionId = 'light-esl'; setPlan(4);
    c.quotePlan.add('course'); c.quotePlan.add('room');
    expect(c.offSeasonDiscountAmount).toBe(300);
    c.quotePlan.courses[1].startDate = c.quotePlan.rooms[1].startDate = '2026-09-20';
    expect(c.offSeasonDiscountAmount).toBe(0);
  });
  it('blocks under-age, adult-course and separate-room Junior quotes', () => {
    c.selectedAgeGroup = 'under12'; expect(c.quoteError).toContain('12岁');
    c.selectedAgeGroup = 'junior'; expect(c.quoteError).toContain('Junior');
    c.quotePlan.courses[0].optionId = 'junior-esl-12-17-years'; expect(c.quoteError).toContain('监护人');
    c.guardianSameRoom = true; expect(c.quoteError).toBe('');
    c.quotePlan.rooms[0].optionId = 'azon-single'; expect(c.quoteError).toContain('监护人');
    c.quotePlan.rooms[0].optionId = 'azon-twin'; expect(c.quoteError).toBe('');
    expect(c.policyNotes).toContain(c.familyRule);
  });
  it('calculates mixed returning, visa and pickup choices per student', () => {
    c.setQuoteMode('group');
    const second = c.activeStudents[1].calculator;
    second.returningStudent = true;
    second.visaType = 'work';
    c.calculator.pickup = 'weekend'; second.pickup = 'other';
    expect(c.schoolPaymentItems[0].amount).toBe('120 美元');
    expect(c.localFees.filter(row => row.item.endsWith('ARP外国人登记')).reduce((sum, row) => sum + row.total, 0)).toBe(300);
    expect(c.localFees.filter(row => ['SSP特殊学习许可证', 'SSP I-CARD', 'ACR-I CARD 外国人身份证', '旅游签续签'].includes(row.item)).some(row => row.item.startsWith('学生2') && row.total > 0)).toBeFalse();
    expect(c.optionalFeeItems[0].amount).toBe('2,700 比索');
    expect(c.optionalFeeItems[0].note).toContain('2人选择接机');
  });
  it('keeps summer surcharges without blocking short stays', () => {
    expect(c.quoteError).toBe('');
    expect(c.policyNotes.join(' ')).not.toContain('至少8周');
    setPlan(4, '2027-07-04'); expect(c.quoteError).toBe(''); expect(c.seasonalSurcharge).toBe(160);
    c.quotePlan.rooms[0].optionId = 'azon-twin'; expect(c.quoteError).toBe('');
    setPlan(3, '2027-07-04'); expect(c.quoteError).toBe(''); expect(c.seasonalSurcharge).toBe(120);
  });
  it('keeps both summer seasons at eight weeks from Sunday through Saturday', () => {
    for (const period of PHILINTER_SUMMER_PERIODS) {
      const start = Date.parse(`${period.start}T00:00:00Z`), end = Date.parse(`${period.end}T00:00:00Z`);
      expect(new Date(start).getUTCDay()).toBe(0);
      expect(new Date(end).getUTCDay()).toBe(6);
      expect((end - start) / 86400000 + 1).toBe(56);
      setPlan(8, period.start);
      expect(c.peakSeasonWeeks).toBe(8);
      expect(c.seasonalSurcharge).toBe(320);
      expect(c.quoteUsd).toBe(120 + 3200 * 0.9 + 320);
    }
  });
  it('charges only overlapping course weeks at summer boundaries and across separate rows', () => {
    for (const [start, weeks] of [['2027-06-27', 0], ['2027-07-04', 1], ['2027-08-22', 1], ['2027-08-29', 0]] as const) {
      setPlan(1, start); expect(c.peakSeasonWeeks).toBe(weeks);
    }
    setPlan(10, '2027-06-27'); expect(c.peakSeasonWeeks).toBe(8);
    setPlan(4, '2027-06-27'); c.quotePlan.add('course');
    c.quotePlan.courses[1].startDate = '2027-08-08';
    expect(c.peakSeasonWeeks).toBe(6);
    expect(c.seasonalSurcharge).toBe(240);
    expect(c.quoteImageData.paymentItems.find(row => row.label === '暑期附加费')?.note).toContain('实际覆盖暑期周数');
    c.quotePlan.courses = [{ id: 1, optionId: 'light-esl', weeks: 4, startDate: '2027-05-30' }];
    c.quotePlan.rooms[0].startDate = '2027-07-04';
    expect(c.seasonalSurcharge).toBe(0);
    expect(c.quoteImageData.paymentItems.some(row => row.label === '暑期附加费')).toBeFalse();
  });
  it('keeps every image row, dates, local fee note and optional renminbi amount', () => {
    for (let i = 0; i < 3; i++) { c.quotePlan.add('course'); c.quotePlan.add('room'); }
    const q = c.quoteImageData;
    expect(q.headingText).toBe('PHILINTER16周报价');
    expect(q.fullFeeDetails).toBeTrue();
    expect(q.paymentItems.filter(row => row.label === '注册费').map(row => row.amount)).toEqual(['120 美元']);
    expect(q.paymentItems.filter(row => row.detailTitle).length).toBe(8);
    expect(q.localFeeItems!.map(row => row.note)).toEqual(c.localFees.map(row => row.note));
    expect(q.optionalFeeItems!.length).toBe(3);
    expect(q.optionalFeeItems!.every(row => !!row.cnyAmount)).toBeTrue();
    expect(JSON.stringify(q)).not.toMatch(/\bUSD\b|\bPHP\b|\bCNY\b/);
    c.quotePlan.courses[1].startDate = c.quotePlan.courses[0].startDate;
    expect(c.quoteError).toContain('重叠');
  });
});

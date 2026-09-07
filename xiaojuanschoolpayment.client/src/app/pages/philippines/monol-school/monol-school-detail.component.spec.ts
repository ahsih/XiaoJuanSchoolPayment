import { TestBed } from '@angular/core/testing';
import { EMPTY, of } from 'rxjs';
import { ExchangeRateService } from '../../../../services/exchange-rate.service';
import { SchoolService } from '../../../../services/school.service';
import { MonolSchoolDetailComponent } from './monol-school-detail.component';

describe('MONOL 2026 pricing and quote', () => {
  let component: MonolSchoolDetailComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [
      { provide: SchoolService, useValue: { getSchools: () => of([]) } },
      { provide: ExchangeRateService, useValue: { getLatestCnyRates: () => EMPTY } },
    ] });
    component = TestBed.runInInjectionContext(() => new MonolSchoolDetailComponent());
  });

  it('keeps the supplied course and accommodation catalog in display order', () => {
    expect(component.courseFees.map(item => [item.name, item.tuition])).toEqual([
      ['ESL 4', 750], ['General ESL', 900], ['IELTS', 1000], ['LEAP English', 1150],
    ]);
    expect(component.roomFees.map(item => [item.name, item.fee])).toEqual([
      ['高级单人间', 1100], ['标准单人间', 750], ['小单间', 650], ['三人间', 500], ['四人间（胶囊式上下铺）', 400],
    ]);
    expect(component.courseFees.find(item => item.id === 'ielts')?.note).toBe('每周五模拟考试');
  });

  it('applies the Sida registration waiver and both low-season deductions', () => {
    expect(component.isOffSeasonPromotionEligible).toBeTrue();
    expect(component.registrationDiscountAmount).toBe(100);
    expect(component.offSeasonCourseDiscountAmount).toBe(100);
    expect(component.offSeasonRoomDiscountAmount).toBe(100);
    expect(component.quoteUsd).toBe(950);
    expect(component.quoteUsdText).toBe('950 美元');
  });

  it('uses the chosen initial visa and pickup for local fees', () => {
    expect(component.localFeeTotal).toBe(17430);
    expect(component.localFeeCny).toBe(1937);
    component.selectedWeeks = 8;
    expect(component.visaExtensionCount).toBe(0);
    component.selectedVisaInitialDays = 30;
    expect(component.visaExtensionCount).toBe(1);
    expect(component.localFees.find(item => item.item.startsWith('ACR-I'))?.quantity).toBe(1);
    expect(component.localFeeTotal).toBe(28370);
    component.selectedPickupAirport = 'none';
    expect(component.localFeeTotal).toBe(25370);
  });

  it('calculates SNS benefits only for fully covered eligible blocks and rooms', () => {
    component.selectedWeeks = 8;
    component.selectedStartDate = '2026-05-03';
    component.selectedRoomId = 'small-single-room';
    component.applySnsPromotion = true;
    expect(component.snsEligibleBlocks).toBe(2);
    expect(component.snsDiscountAmount).toBe(200);
    expect(component.quoteUsd).toBe(2200);
    component.selectedRoomId = 'triple-room';
    expect(component.snsEligibleBlocks).toBe(0);
    expect(component.snsDiscountAmount).toBe(0);
  });

  it('uses the CIA full-detail image layout without CIA content', () => {
    const quote = component.quoteImageData;
    expect(quote.layout).toBe('cia-detailed');
    expect(quote.headingText).toBe('MONOL 4周报价');
    expect(quote.fullFeeDetails).toBeTrue();
    expect(quote.localFeeTableLayout).toBe('web');
    expect(quote.localFeeAmount).toBe('17,430 比索');
    expect(quote.localFeeCny).toBe('人民币预计金额：约 1,937 元');
    expect(quote.totalUsd).toBe(component.quoteUsdText);
    expect(quote.totalCny).toBe(component.quoteCnyText);
    expect(quote.optionalFeeItems?.map(item => item.label)).toEqual(['房间押金', '餐费']);
    expect(JSON.stringify(quote)).not.toContain('CIA');
  });

  it('supports independent multi-period courses and accommodation', () => {
    const student = component.students[0];
    student.quotePlan.add('course');
    student.quotePlan.courses[1].optionId = 'general-esl';
    student.quotePlan.add('room');
    student.quotePlan.rooms[1].optionId = 'triple-room';

    expect(student.quotePlan.courses.map(row => row.optionId)).toEqual(['esl-4', 'general-esl']);
    expect(student.quotePlan.rooms.map(row => row.optionId)).toEqual(['quad-room', 'triple-room']);
    expect(student.tuition).toBe(1650);
    expect(student.accommodation).toBe(900);
    expect(student.offSeasonCourseDiscount).toBe(200);
    expect(student.offSeasonRoomDiscount).toBe(200);
    expect(component.quoteUsd).toBe(2150);
    expect(component.schoolPaymentItems.filter(item => item.label.startsWith('课程名称')).length).toBe(2);
    expect(component.schoolPaymentItems.filter(item => item.label.startsWith('住宿名称')).length).toBe(2);
  });

  it('supports 2–20-person quotes with per-student plans and grouped image totals', () => {
    component.setQuoteMode('group');
    component.studentCount = 2;
    component.students[1].quotePlan.courses[0].optionId = 'ielts';
    component.students[1].quotePlan.rooms[0].optionId = 'standard-single-room';
    component.students[1].pickupAirport = 'clark';

    expect(component.activeStudents.length).toBe(2);
    expect(component.quoteUsd).toBe(2500);
    expect(component.quoteImageData.headingText).toBe('MONOL 2人报价');
    expect(component.schoolPaymentItems.some(item => item.label === '学生2 · 课程名称')).toBeTrue();
    expect(component.schoolPaymentItems.find(item => item.label === '思达注册费优惠（2人合计）')?.amount).toBe('− 200 美元');
    expect(component.schoolPaymentItems.filter(item => item.label.includes('SNS特别活动')).length).toBe(1);
    expect(component.estimatedLocalFees.find(item => item.item === 'SSP特殊学习许可证')?.quantity).toBe(2);
    expect(component.quoteImageData.paymentItems?.some(item => item.amount === '未适用')).toBeFalse();
    expect(component.quoteImageData.paymentItems?.filter(item => item.label.includes('淡季工作日免费早餐')).length).toBe(1);
    expect(component.quoteImageData.importantNotes).toEqual(component.quoteGeneralNotes);
    expect(component.quoteImageData.importantNotes?.join('')).not.toContain('淡季');
    expect(component.quoteImageData.importantNotes?.join('')).not.toContain('SNS');
    expect(JSON.stringify(component.quoteImageData)).not.toContain('CIA');
  });
});

import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, of } from 'rxjs';
import { ExchangeRateService } from '../../../../services/exchange-rate.service';
import { SchoolContentService } from '../../../../services/school-content.service';
import { SchoolService } from '../../../../services/school.service';
import { CpilsSchoolDetailComponent } from './cpils-school-detail.component';
import { createDefaultCpilsContentConfig } from './cpils-content-config';

describe('CPILS group quote', () => {
  let component: CpilsSchoolDetailComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [
      { provide: SchoolService, useValue: { getSchools: () => of([]) } },
      { provide: ExchangeRateService, useValue: { getLatestCnyRates: () => EMPTY } },
      { provide: SchoolContentService, useValue: { getPublished: () => of(null) } },
      { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: { get: () => null } } } },
      { provide: ElementRef, useValue: new ElementRef(document.createElement('div')) },
    ] });
    component = TestBed.runInInjectionContext(() => new CpilsSchoolDetailComponent());
  });

  it('calculates a mixed two-student quote per person and keeps the image synchronized', () => {
    component.setQuoteMode('group');
    component.studentCount = 2;
    component.students[0].pickupSelected = true;
    component.students[1].returningStudent = true;
    component.students[1].visaType = 'work';
    component.students[1].selectedAgeGroup = 'minor';

    expect(component.payableRegistrationFee).toBe(125);
    expect(component.excludedLocalFees[0].quantity).toBe(1);
    expect(component.excludedLocalFees[0].total).toBe(1000);
    expect(component.excludedLocalFees[0].note).toContain('学校团体接机');
    expect(component.includedLocalFees.find(row => row.item === '学生2 · SSP特殊学习许可证')?.total).toBe(0);
    expect(component.includedLocalFees.find(row => row.item === '学生2 · ARP外国人登记')?.total).toBe(300);
    expect(component.quoteImageData.paymentItems.filter(row => row.label === '注册费').length).toBe(1);
    expect(component.quoteImageData.paymentItems.some(row => row.label.startsWith('学生2 · 课程'))).toBeTrue();
    expect(component.quoteImageData.totalUsd).toBe(component.quoteUsdText);
  });

  it('shows exam benefits only for a currently selected qualifying course', () => {
    expect(component.applicableExamBenefits.length).toBe(0);
    expect(component.quoteImageData.paymentItems.some(row => row.label.includes('考试'))).toBeFalse();
    component.selectedCourseId = 'ielts-course';
    component.selectedWeeks = 12;
    expect(component.applicableExamBenefitText).toContain('雅思课程12周及以上');
    expect(component.quoteImageData.paymentItems.find(row => row.label.includes('考试'))?.amount).toBe('按课程适用');
  });

  it('uses independently editable CPILS course, room and fee data', () => {
    const content = createDefaultCpilsContentConfig();
    content.courses[0].tuition = 999;
    content.rooms.find(room => room.id === 'regular-quad')!.fee = 777;
    content.localFees.find(fee => fee.id === 'management')!.amount = 2222;
    component['applyContentConfig'](content);
    expect(component.courseFees[0].tuition).toBe(999);
    expect(component.selectedRoom.fee).toBe(777);
    expect(component.includedLocalFees.find(row => row.item === '管理费')?.total).toBe(2222);
  });

  it('keeps CPILS quote-image copy editable without changing calculator-owned amounts', () => {
    const content = createDefaultCpilsContentConfig();
    const total = component.quoteUsd;
    content.quoteImageSettings.paymentSectionTitle = '员工修改后的学校费用';
    content.quoteImageSettings.localFeeNotes['ssp'] = '员工修改后的SSP备注';
    content.quoteImageSettings.footerNotes = ['员工修改后的报价说明'];
    component['applyContentConfig'](content);
    expect(component.quoteImageData.paymentSectionTitle).toBe('员工修改后的学校费用');
    expect(component.quoteImageData.localFeeItems?.find(row => row.label.includes('SSP特殊'))?.note).toBe('员工修改后的SSP备注');
    expect(component.quoteImageData.importantNotes).toContain('员工修改后的报价说明');
    expect(component.quoteUsd).toBe(total);
  });

  it('applies the published Sida and off-season rules to the default September plan', () => {
    expect(component.sidaDiscountAmount).toBe(163.5);
    expect(component.offSeasonDiscountAmount).toBe(73.6);
    expect(component.quoteUsd).toBe(1522.9);
    expect(component.schoolPaymentItems.map(item => item.label)).toContain('下半年淡季优惠');
  });

  it('applies the no-window discount once per complete four-week room block', () => {
    component.selectedRoomId = 'no-window-twin';
    expect(component.noWindowDiscountAmount).toBe(50);
    component.selectedWeeks = 8;
    expect(component.noWindowDiscountAmount).toBe(100);
    expect(component.schoolPaymentItems.find(item => item.label === '无对外窗房优惠')?.note).toContain('每满4周优惠50美元');
  });

  it('uses the editable peak-season dates and rate without double-charging matched course and room weeks', () => {
    component.selectedStartDate = '2026-07-05';
    expect(component.peakSeasonWeeks).toBe(4);
    expect(component.seasonalSurcharge).toBe(160);
    const content = createDefaultCpilsContentConfig();
    content.quoteSettings.peakSeasonFeePerWeek = 45;
    component['applyContentConfig'](content);
    expect(component.seasonalSurcharge).toBe(180);
  });

  it('selects only the highest matching Christmas or New Year benefit', () => {
    component.selectedRegistrationDate = '2026-09-01';
    component.selectedStartDate = '2026-12-20';
    expect(component.holidayDiscountAmount).toBe(150);
    expect(component.schoolPaymentItems.find(item => item.label === '圣诞／新年优惠')?.amount).toBe('− 150 美元');
  });

  it('keeps all ten calculated local rows and three optional references in the image', () => {
    expect(component.includedLocalFees.length).toBe(10);
    expect(component.excludedLocalFees.length).toBe(3);
    expect(component.quoteImageData.localFeeItems?.length).toBe(10);
    expect(component.quoteImageData.optionalFeeItems?.length).toBe(3);
    expect(component.quoteImageData.localFeeItems?.every(row => !!row.note)).toBeTrue();
  });
});

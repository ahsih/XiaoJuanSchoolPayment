import { TestBed } from '@angular/core/testing';
import { EMPTY, of } from 'rxjs';
import { ExchangeRateService } from '../../../../services/exchange-rate.service';
import { SchoolService } from '../../../../services/school.service';
import { CpilsSchoolDetailComponent } from './cpils-school-detail.component';

describe('CPILS group quote', () => {
  let component: CpilsSchoolDetailComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [
      { provide: SchoolService, useValue: { getSchools: () => of([]) } },
      { provide: ExchangeRateService, useValue: { getLatestCnyRates: () => EMPTY } },
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
    expect(component.quoteImageData.paymentItems.some(row => row.label === '考试赠送')).toBeFalse();
    component.selectedCourseId = 'ielts-course';
    component.selectedWeeks = 12;
    expect(component.applicableExamBenefitText).toContain('雅思课程12周及以上');
    expect(component.quoteImageData.paymentItems.find(row => row.label === '考试赠送')?.amount).toBe('课程权益');
  });
});

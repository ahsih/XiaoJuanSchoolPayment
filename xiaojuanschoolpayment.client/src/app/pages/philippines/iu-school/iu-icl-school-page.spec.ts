import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { chinaToday, ExchangeRateService } from '../../../../services/exchange-rate.service';
import { SchoolContentService } from '../../../../services/school-content.service';
import { SchoolService } from '../../../../services/school.service';
import { IclSchoolComponent } from '../icl-school/icl-school.component';
import { createDefaultIuIclContentConfig, isIuIclContentConfig } from './iu-icl-content-config';
import type { IuIclSchoolPageComponent } from './iu-icl-school-page';
import { IuSchoolComponent } from './iu-school.component';

// IU and ICL on the shared Philippine school template: the 2026 price lists and the joint 2026 low-season
// package poster. The two campuses keep their own prices, rooms and courses.
function createPage<T extends IuIclSchoolPageComponent>(create: () => T): T {
  TestBed.configureTestingModule({ providers: [
    { provide: SchoolService, useValue: { getSchools: () => of([]) } },
    { provide: SchoolContentService, useValue: { getPublished: () => of(null) } },
    { provide: ExchangeRateService, useValue: { getLatestCnyRates: () => of({ date: chinaToday(), usdToCny: 7, phpPerCny: 8.2 }) } },
    { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: { get: () => null } } } },
    { provide: ElementRef, useValue: new ElementRef(document.createElement('div')) },
  ] });
  return TestBed.runInInjectionContext(create);
}

describe('IU page on the shared template', () => {
  let page: IuSchoolComponent;

  beforeEach(() => {
    page = createPage(() => new IuSchoolComponent());
    // Outside the low-season package window.
    page.selectedStartDate = '2027-02-07';
  });

  const student = () => page.students[0];
  const payment = (label: string) => page.schoolPaymentItems.find(row => row.label === label);
  const localFee = (item: string) => page.estimatedLocalFees.find(fee => fee.item.startsWith(item));

  it('prices the default Power Speaking 4 + campus triple with the Sida 10% outside the package window', () => {
    expect(page.selectedCourseId).toBe('power-speaking-4');
    expect(page.selectedRoomId).toBe('campus-triple');
    // 100 registration + 850 + 700 − 155 (10%)
    expect(page.quote.quoteUsd).toBe(1495);
    expect(payment('思达启航9折')?.amount).toBe('− 155 美元');
    expect(page.quoteImageData.headingText).toBe('IU 4周报价');
  });

  it('uses the school package price and waives registration inside the low-season window', () => {
    page.selectedStartDate = '2026-12-06';
    expect(page.quote.quoteUsd).toBe(1150);
    expect(payment('校方淡季套餐价')).toBeDefined();
    expect(payment('思达启航9折')).toBeUndefined();
  });

  it('does not package a plan that leaves after 2027/01/16', () => {
    page.selectedStartDate = '2026-12-27';
    // 4 weeks end 2027/01/23
    expect(page.quote.quoteUsd).toBe(1495);
  });

  it('keeps off-campus rooms out of the package and gives them the Sida 10%', () => {
    page.selectedStartDate = '2026-12-06';
    page.selectedRoomId = 'off-campus-single';
    // 100 + 850 + 1,400 − 225
    expect(page.quote.quoteUsd).toBe(2125);
  });

  it('runs the IELTS Guarantee only as a whole 8-week block', () => {
    page.selectedCourseId = 'ielts-guarantee-8';
    expect(student().quoteError).toContain('只能读8周');
    page.selectedStartDate = '2026-11-08';
    page.selectedWeeks = 8;
    expect(student().quoteError).toBe('');
    expect(page.quote.quoteUsd).toBe(2900);
  });

  it('prices 1–3 weeks at 40/60/80% and waives registration for returning students', () => {
    page.selectedWeeks = 2;
    // 100 + 1,550 × 60% − 93
    expect(page.quote.quoteUsd).toBe(937);
    page.selectedWeeks = 4;
    student().returningStudent = true;
    expect(page.quote.quoteUsd).toBe(1395);
  });

  it('estimates local fees per accommodation week and visa', () => {
    expect(localFee('SSP 特别学习许可')?.total).toBe(7800);
    expect(localFee('SSP E-Card')?.total).toBe(4500);
    expect(localFee('维护费')?.total).toBe(1600);
    expect(localFee('电费')?.total).toBe(2000);
    expect(localFee('洗衣费')?.total).toBe(1200);
    expect(localFee('签证延期')?.quantity).toBe(0);
    student().visaType = 'tourist30';
    page.selectedWeeks = 12;
    expect(localFee('签证延期')?.total).toBe(12000);
    expect(localFee('ACR I-Card')?.total).toBe(4500);
    student().visaType = 'tourist59';
    expect(localFee('签证延期')?.total).toBe(6500);
  });

  it('charges no dormitory fees to walk-in students', () => {
    page.selectedRoomId = 'walk-in';
    expect(localFee('维护费')?.quantity).toBe(0);
    expect(localFee('宿舍押金')?.quantity).toBe(0);
    // 100 + 850 − 85
    expect(page.quote.quoteUsd).toBe(865);
  });

  it('lists only IU courses and rooms', () => {
    expect(page.courseFees.map(item => item.id)).toContain('fitness');
    expect(page.roomFees.map(item => item.id)).not.toContain('off-campus-triple');
  });
});

describe('ICL page on the shared template', () => {
  let page: IclSchoolComponent;

  beforeEach(() => {
    page = createPage(() => new IclSchoolComponent());
    page.selectedStartDate = '2027-02-07';
  });

  it('uses ICL room prices, not IU ones', () => {
    page.selectedRoomId = 'campus-single';
    // 100 + 850 + 850 − 170 (IU's campus single is 950)
    expect(page.quote.quoteUsd).toBe(1630);
    expect(page.quoteImageData.headingText).toBe('ICL 4周报价');
  });

  it('uses the same package table inside the window', () => {
    page.selectedStartDate = '2026-12-06';
    page.selectedRoomId = 'campus-quad';
    expect(page.quote.quoteUsd).toBe(1050);
  });

  it('lists only ICL courses and rooms', () => {
    expect(page.courseFees.map(item => item.id)).not.toContain('fitness');
    expect(page.roomFees.map(item => item.id)).toContain('off-campus-triple');
  });

  it('never takes an IU content document', () => {
    const iu = createDefaultIuIclContentConfig('IU');
    expect(isIuIclContentConfig(iu, 'IU')).toBeTrue();
    expect(isIuIclContentConfig(iu, 'ICL')).toBeFalse();
  });
});

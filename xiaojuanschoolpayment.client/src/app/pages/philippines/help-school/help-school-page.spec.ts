import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { chinaToday, ExchangeRateService } from '../../../../services/exchange-rate.service';
import { SchoolContentService } from '../../../../services/school-content.service';
import { SchoolService } from '../../../../services/school.service';
import { cloneHelpContentConfig, createDefaultHelpContentConfig, HELP_ARRIVAL_DATES_2026 } from './help-content-config';
import { helpDefaultStart, helpPickupRate } from './help-page-quote';
import { HELP_PAGE_PROFILE } from './help-page-profile';
import { HelpSchoolPageComponent } from './help-school-page.component';

// HELP Clark on the shared Philippine school template: the 2026 price list, the 2026 second-half off-season offer
// and the Clark local-fee sheet from HELP's 2026-11-24 Google Drive pack.
describe('HELP Clark page on the shared template', () => {
  let page: HelpSchoolPageComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [
      { provide: SchoolService, useValue: { getSchools: () => of([]) } },
      { provide: SchoolContentService, useValue: { getPublished: () => of(null) } },
      { provide: ExchangeRateService, useValue: { getLatestCnyRates: () => of({ date: chinaToday(), usdToCny: 7, phpPerCny: 8.2 }) } },
      { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: { get: () => null } } } },
      { provide: ElementRef, useValue: new ElementRef(document.createElement('div')) },
    ] });
    page = TestBed.runInInjectionContext(() => new HelpSchoolPageComponent());
    page.selectedStartDate = '2026-12-06';
  });

  const student = () => page.students[0];
  const payment = (label: string) => page.schoolPaymentItems.find(row => row.label === label);
  const localFee = (item: string) => page.estimatedLocalFees.find(fee => fee.item.startsWith(item));
  const localTotal = () => page.estimatedLocalFees.reduce((sum, fee) => sum + fee.total, 0);

  it('starts on a 2026 admission Sunday every two weeks', () => {
    expect(HELP_ARRIVAL_DATES_2026[0]).toBe('2026-01-04');
    expect(HELP_ARRIVAL_DATES_2026).toContain('2026-08-16');
    expect(HELP_ARRIVAL_DATES_2026.at(-1)).toBe('2026-12-20');
    expect(helpDefaultStart(new Date(2026, 10, 24))).toBe('2026-12-06');
    expect(helpDefaultStart(new Date(2026, 11, 21))).toBe('2026-12-27');
  });

  it('takes the off-season and SNS offers first, then the Sida 5%', () => {
    expect(page.selectedCourseId).toBe('esl');
    expect(page.selectedRoomId).toBe('room-4');
    // 100 registration + 900 + 600 − 100 off-season − 200 SNS − 5% of 1,200
    expect(page.quote.quoteUsd).toBe(1240);
    expect(payment('思达启航折扣')?.amount).toBe('− 60 美元');
    expect(payment('SNS优惠')).toBeDefined();
    expect(page.quoteImageData.headingText).toContain('HELP 克拉克 4周报价');
  });

  it('waives registration from eight weeks inside the offer window', () => {
    page.selectedWeeks = 8;
    // 1,800 + 1,200 − 2 × 300 − 5% of 2,400
    expect(page.quote.quoteUsd).toBe(2280);
    expect(student().registration).toBe(0);
    expect(payment('注册费')?.note).toContain('淡季优惠免收注册费');
  });

  it('gives only the Sida 5% outside the window', () => {
    page.selectedStartDate = '2027-03-07';
    expect(page.quote.quoteUsd).toBe(1525);
    expect(payment('SNS优惠')).toBeUndefined();
    student().returningStudent = true;
    expect(page.quote.quoteUsd).toBe(1425);
  });

  it('prices one to three weeks at 40/65/80% of four weeks', () => {
    page.selectedWeeks = 2;
    expect(student().tuition).toBe(585);
    expect(student().accommodation).toBe(390);
    page.selectedWeeks = 3;
    expect(student().tuition).toBe(720);
  });

  it('blocks adult courses for minors in the peak months and charges the off-season management fee', () => {
    student().selectedAgeGroup = 'minor';
    // Four weeks from 12/06 run into January.
    expect(page.quote.quoteError).toContain('旺季');
    page.selectedWeeks = 2;
    expect(page.quote.quoteError).toBe('');
    // 100 + 585 + 390 + 200 management − 5% of 975
    expect(page.quote.quoteUsd).toBe(1226.25);
    expect(payment('未成年特殊管理费')?.amount).toBe('200 美元');
    page.quotePlan.courses[0].optionId = 'family-kid-1';
    page.selectedWeeks = 4;
    expect(page.quote.quoteError).toBe('');
    expect(payment('未成年特殊管理费')).toBeUndefined();
  });

  it('estimates local fees like the school sheet, without the deposit', () => {
    student().visaType = 'tourist30';
    expect(localTotal()).toBe(21200 - 3000);
    page.selectedWeeks = 12;
    expect(localFee('签证续签')?.total).toBe(11150);
    expect(localFee('ACR I-CARD')?.total).toBe(4000);
    expect(localFee('教材费')?.total).toBe(5100);
    expect(localTotal()).toBe(47750 - 3000);
    page.selectedWeeks = 24;
    expect(localTotal()).toBe(77570 - 3000);
    student().visaType = 'tourist59';
    expect(localTotal()).toBe(72540 - 3000);
    page.selectedWeeks = 8;
    expect(localFee('ACR I-CARD')?.quantity).toBe(0);
    expect(localTotal()).toBe(26900 - 3000);
  });

  it('charges kindergarten materials instead of books for the GIS kindergarten', () => {
    page.quotePlan.courses[0].optionId = 'family-kindergarten';
    expect(localFee('教材费')?.quantity).toBe(0);
    expect(localFee('幼儿园活动材料费')?.total).toBe(500);
  });

  it('shows the deposit and pickups at the group rate outside the total', () => {
    expect(page.optionalFeeItems.map(item => item.amount)).toEqual(['3,000 比索', '5,500 比索', '1,000 比索']);
    expect(helpPickupRate('manila', 3)).toBe(2800);
    expect(helpPickupRate('manila', 4)).toBe(1700);
    page.quote.setQuoteMode('group');
    page.studentCount = 3;
    expect(page.optionalFeeItems.map(item => item.amount)).toEqual(['9,000 比索', '8,400 比索', '1,800 比索']);
  });

  it('links every room profile and room video to a priced room', () => {
    const ids = new Set(createDefaultHelpContentConfig().rooms.map(room => room.id));
    for (const profile of HELP_PAGE_PROFILE.roomProfiles) {
      for (const id of profile.rateIds ?? []) expect(ids.has(id)).withContext(profile.id).toBeTrue();
    }
    for (const id of Object.keys(HELP_PAGE_PROFILE.roomVideos ?? {})) expect(ids.has(id)).withContext(id).toBeTrue();
  });

  it('keeps a saved document unchanged when cloned', () => {
    const saved = createDefaultHelpContentConfig();
    expect(cloneHelpContentConfig(saved)).toEqual(saved);
  });
});

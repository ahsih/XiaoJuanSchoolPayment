import { TestBed } from '@angular/core/testing';
import { EMPTY } from 'rxjs';
import { ExchangeRateService } from '../../../../services/exchange-rate.service';
import { QuoteImageDownloadButtonComponent } from '../../../components/quote-image-download-button.component';
import { TARGET_COURSES, targetOfficialPackagePrice } from './target-pricing';
import { TargetSchoolComponent } from './target-school.component';
import { TargetStudentQuote } from './target-student-quote';

describe('TARGET 2026 package quote', () => {
  const quote = (weeks: number, startDate = '2026-08-23') => {
    const student = new TargetStudentQuote();
    student.packages[0].weeks = weeks;
    student.packages[0].startDate = startDate;
    return student;
  };

  it('keeps same-price course categories separate while sharing their official price grids', () => {
    expect(TARGET_COURSES.map((course) => course.id)).toEqual([
      'lite4', 'target4', 'target5', 'working-holiday', 'target6', 'ultimate8', 'ielts-regular', 'ielts-guarantee',
    ]);
    expect(targetOfficialPackagePrice('target5', 'single', 4)).toBe(1900);
    expect(targetOfficialPackagePrice('working-holiday', 'single', 4)).toBe(1900);
    expect(targetOfficialPackagePrice('ultimate8', 'six', 12)).toBe(5040);
    expect(targetOfficialPackagePrice('ielts-regular', 'six', 12)).toBe(5040);
    expect(targetOfficialPackagePrice('ielts-guarantee', 'six', 12)).toBe(5040);
  });

  it('uses the school price tier when course or room changes within one stay', () => {
    const student = quote(1);
    student.packages[0].startDate = '2026-09-06';
    student.addPackage();
    student.packages[1].courseId = 'target5';
    student.packages[1].weeks = 3;

    expect(student.packageWeeks).toBe(4);
    expect(student.packagePrice(student.packages[0])).toBe(335);
    expect(student.packagePrice(student.packages[1])).toBe(1050);
    expect(student.packageTotal).toBe(1385);
  });

  it('automatically applies the complete cash promotion and excludes peak weeks', () => {
    expect(quote(3).campaignDiscount).toBe(60);
    expect(quote(4).campaignDiscount).toBe(120);
    expect(quote(6).campaignDiscount).toBe(180);
    expect(quote(8).campaignDiscount).toBe(240);
    expect(quote(12).campaignDiscount).toBe(420);
    expect(quote(16).campaignDiscount).toBe(560);
    expect(quote(20).campaignDiscount).toBe(700);
    expect(quote(24).campaignDiscount).toBe(840);

    expect(quote(8, '2026-06-28').campaignDiscount).toBe(0);
    const partial = quote(12, '2026-06-28');
    expect(partial.peakWeeks).toBe(8);
    expect(partial.campaignEligibleWeeks).toBe(4);
    expect(partial.campaignDiscount).toBe(140);
  });

  it('allows study plans longer than 24 weeks without changing package pricing rules', () => {
    const student = quote(28, '2026-09-06');
    expect(student.weekOptions.at(-1)).toBe(52);
    expect(student.quoteError).toBe('');
    expect(student.packageTotal).toBe(9380);
    expect(student.campaignDiscount).toBe(980);

    student.addPackage();
    student.packages[1].weeks = 28;
    expect(student.packageWeeks).toBe(56);
    expect(student.quoteError).toBe('');
    expect(student.visaExtensionCount).toBeGreaterThan(5);
    expect(student.visaExtensionTotal).toBeGreaterThan(24870);
  });

  it('applies the authorized Sida 90% rate after the school cash discount', () => {
    const student = quote(4);
    expect(student.packageTotal).toBe(1340);
    expect(student.campaignDiscount).toBe(120);
    expect(student.sidaDiscountBase).toBe(1220);
    expect(student.sidaDiscount).toBe(122);
    expect(student.quoteUsd).toBe(1248);
  });

  it('evaluates the limited upgrade activity separately from cash discounts', () => {
    const student = quote(8);
    student.selectedRegistrationDate = '2026-11-30';
    student.packages[0].courseId = 'target4';
    expect(student.upgradeEligible).toBeTrue();
    expect(student.upgradeBenefitText).toContain('TARGET 4 → TARGET 5');
    expect(student.upgradeBenefitText).toContain('六人房 → 四人房');
    expect(student.campaignDiscount).toBe(240);

    student.selectedRegistrationDate = '2026-12-01';
    expect(student.upgradeEligible).toBeFalse();
  });

  it('calculates local fees from the selected 30-day or 59-day initial tourist visa', () => {
    const student = quote(8);
    student.visaType = 'tourist59';
    expect(student.visaExtensionCount).toBe(0);
    expect(student.visaExtensionTotal).toBe(0);
    expect(student.textbookTotal).toBe(3000);

    student.visaType = 'tourist30';
    expect(student.visaExtensionCount).toBe(1);
    expect(student.visaExtensionTotal).toBe(5140);

    const nineWeeks = quote(9);
    nineWeeks.visaType = 'tourist59';
    expect(nineWeeks.visaExtensionCount).toBe(1);
    expect(nineWeeks.localFees.find((fee) => fee.item.startsWith('ACR'))?.total).toBe(4300);
    expect(nineWeeks.textbookTotal).toBe(4000);
  });

  it('uses the CIA detailed image layout with TARGET content and complete footer notes', () => {
    TestBed.configureTestingModule({ providers: [
      { provide: ExchangeRateService, useValue: { getLatestCnyRates: () => EMPTY } },
    ] });
    const component = TestBed.runInInjectionContext(() => new TargetSchoolComponent());
    const image = component.quoteImageData;

    expect(image.layout).toBe('cia-detailed');
    expect(image.fullFeeDetails).toBeTrue();
    expect(image.localFeeTableLayout).toBe('web');
    expect(image.headingText).toBe('TARGET 4周报价');
    expect(image.paymentItems.some((item) => item.detailTitle === 'TARGET 4｜六人房（上下铺）')).toBeTrue();
    expect(image.paymentItems.some((item) => item.label === '思达启航9折')).toBeTrue();
    expect(image.importantNotes).toContain(component.quoteGeneralNotes[0]);
    expect(image.importantNotes).toContain(component.quoteGeneralNotes[1]);
    expect(image.importantNotes).not.toContain(component.quoteGeneralNotes[2]);
    expect(image.importantNotes).not.toContain(component.quoteGeneralNotes[3]);
    expect(image.noteTitle).toBe('报价说明');
    expect(image.finalConfirmationText).toBe('最终以学校价格、空房及优惠确认为准。');
    const renderer = new QuoteImageDownloadButtonComponent();
    renderer.quote = image;
    expect(renderer['quoteFooterNotes']()).toEqual([
      component.quoteGeneralNotes[0],
      component.quoteGeneralNotes[1],
      '本次采用备用汇率；人民币金额按参考汇率估算，最终以实际兑换或支付汇率为准。',
      '最终以学校价格、空房及优惠确认为准。',
    ]);
    expect(JSON.stringify(image)).not.toContain('CIA');
  });

  it('hides an inapplicable cash discount from the image but keeps every zero-value local-fee detail', () => {
    TestBed.configureTestingModule({ providers: [
      { provide: ExchangeRateService, useValue: { getLatestCnyRates: () => EMPTY } },
    ] });
    const component = TestBed.runInInjectionContext(() => new TargetSchoolComponent());
    component.activeStudents[0].packages[0].weeks = 8;
    component.activeStudents[0].packages[0].startDate = '2026-06-28';

    const image = component.quoteImageData;
    expect(component.activeStudents[0].campaignDiscount).toBe(0);
    expect(image.paymentItems.some((item) => item.label.includes('学校现金优惠'))).toBeFalse();

    const acr = image.localFeeItems?.find((item) => item.label.startsWith('ACR I-CARD'));
    const visa = image.localFeeItems?.find((item) => item.label === '签证续签');
    expect(acr?.quantity).toBe('0');
    expect(acr?.amount).toBe('0比索');
    expect(acr?.note).toContain('9周及以上');
    expect(visa?.quantity).toBe('0');
    expect(visa?.amount).toBe('0比索');
    expect(visa?.note).toContain('学校当前档位');
  });

  it('renders the complete TARGET quote image as a valid dynamic-height PNG', async () => {
    TestBed.configureTestingModule({
      imports: [QuoteImageDownloadButtonComponent],
      providers: [{ provide: ExchangeRateService, useValue: { getLatestCnyRates: () => EMPTY } }],
    });
    const school = TestBed.runInInjectionContext(() => new TargetSchoolComponent());
    const renderer = TestBed.createComponent(QuoteImageDownloadButtonComponent).componentInstance;
    renderer.quote = school.quoteImageData;

    const dataUrl = await renderer.createPreviewDataUrl(0.5);
    const rendered = new Image();
    rendered.src = dataUrl;
    await new Promise<void>((resolve, reject) => {
      rendered.onload = () => resolve();
      rendered.onerror = () => reject(new Error('TARGET quote image did not decode'));
    });

    expect(dataUrl.startsWith('data:image/png;base64,')).toBeTrue();
    expect(rendered.naturalWidth).toBe(516);
    expect(rendered.naturalHeight).toBeGreaterThan(882);
  });

  it('supports 2–20 students, retains inactive edits and renders the full group image', async () => {
    TestBed.configureTestingModule({
      imports: [QuoteImageDownloadButtonComponent],
      providers: [{ provide: ExchangeRateService, useValue: { getLatestCnyRates: () => EMPTY } }],
    });
    const component = TestBed.runInInjectionContext(() => new TargetSchoolComponent());
    component.setQuoteMode('group');
    component.studentCount = 20;
    component.activeStudents[19].packages[0].courseId = 'working-holiday';
    expect(component.activeStudents.length).toBe(20);

    component.studentCount = 2;
    component.studentCount = 20;
    expect(component.activeStudents[19].packages[0].courseId).toBe('working-holiday');
    expect(component.quoteImageData.headingText).toBe('TARGET 20人报价');
    expect(component.quoteImageData.paymentItems.filter((item) => !!item.detailTitle).length).toBe(20);
    expect(component.quoteImageData.localFeeItems?.find((item) => item.label === 'SSP特殊学习许可证')?.quantity).toBe('20');

    const renderer = TestBed.createComponent(QuoteImageDownloadButtonComponent).componentInstance;
    renderer.quote = component.quoteImageData;
    const dataUrl = await renderer.createPreviewDataUrl(0.35);
    expect(dataUrl.startsWith('data:image/png;base64,')).toBeTrue();
  });
});

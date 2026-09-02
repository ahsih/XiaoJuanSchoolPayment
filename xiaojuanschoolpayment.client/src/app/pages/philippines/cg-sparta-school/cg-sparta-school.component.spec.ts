import { TestBed } from '@angular/core/testing';
import { EMPTY } from 'rxjs';
import { ExchangeRateService } from '../../../../services/exchange-rate.service';
import { CgSpartaSchoolComponent } from './cg-sparta-school.component';

describe('CG Sparta quote adjustments', () => {
  let component: CgSpartaSchoolComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: ExchangeRateService, useValue: { getLatestCnyRates: () => EMPTY } }],
    });
    component = TestBed.runInInjectionContext(() => new CgSpartaSchoolComponent());
  });

  it('keeps the default off-season four-week quote and all local-fee rows', () => {
    expect(component.summerSurcharge).toBe(0);
    expect(component.offSeasonDiscount).toBe(150);
    expect(component.quoteUsd).toBe(1255);
    expect(component.localFeesTotal).toBe(23300);
    expect(component.quoteImageData.paymentItems?.some(item => item.label === '暑假附加费')).toBeFalse();
    expect(component.quoteImageData.paymentItems?.some(item => item.label === '长期优惠')).toBeFalse();
    expect(component.quoteImageData.paymentItems?.find(item => item.label === '住宿费')?.note).toBe('Sparta 4人房');
    expect(component.quoteImageData.paymentItems?.find(item => item.label === '思达折扣')?.note).toBe('优惠145美元');
    expect(component.quoteImageData.localFeeItems?.find(item => item.label === 'ACR-I CARD 外国人身份证')?.amount).toBe('0 比索');
    expect(component.quoteImageData.localFeeItems?.find(item => item.label === '旅游签证续签')?.amount).toBe('0 比索');
  });

  it('charges 40 dollars for each overlapping learning week, without discounting it', () => {
    component.selectedStartDate = '2026-07-05';
    expect(component.summerWeeks).toBe(4);
    expect(component.summerSurcharge).toBe(160);
    expect(component.offSeasonDiscount).toBe(0);
    expect(component.quoteUsd).toBe(1565);
  });

  it('counts partial overlapping weeks but not a stay ending before summer begins', () => {
    component.selectedStartDate = '2026-06-07';
    expect(component.summerWeeks).toBe(0);
    component.selectedStartDate = '2026-06-08';
    expect(component.summerWeeks).toBe(1);
    component.selectedStartDate = '2026-08-31';
    expect(component.summerWeeks).toBe(0);
  });

  it('includes August 30 in both the supplied summer and off-season windows', () => {
    component.selectedStartDate = '2026-08-30';
    component.selectedWeeks = 12;
    expect(component.summerWeeks).toBe(1);
    expect(component.offSeasonDiscount).toBe(450);
    expect(component.longStayDiscount).toBe(50);
    expect(component.quoteUsd).toBe(3555);
    expect(component.quoteImageData.paymentItems?.length).toBe(7);
    expect(component.quoteImageData.paymentItems?.find(item => item.label === '思达折扣')?.note).toBe('优惠435美元');
    expect(component.quoteImageData.paymentItems?.find(item => item.label === '暑假附加费')?.amount).toBe('40 美元');
    expect(component.quoteImageData.totalUsd).toBe('3,555 美元');
  });

  it('includes the final off-season entry date and excludes dates outside the window', () => {
    component.selectedStartDate = '2026-08-29';
    expect(component.offSeasonDiscount).toBe(0);
    component.selectedStartDate = '2026-12-27';
    expect(component.offSeasonDiscount).toBe(150);
    component.selectedStartDate = '2026-12-28';
    expect(component.offSeasonDiscount).toBe(0);
  });

  it('uses the supplied long-stay tiers from exactly twelve weeks', () => {
    const tiers = [{ weeks: 8, discount: 0 }, { weeks: 12, discount: 50 }, { weeks: 16, discount: 100 }, { weeks: 20, discount: 150 }, { weeks: 24, discount: 200 }] as const;
    for (const tier of tiers) {
      component.selectedWeeks = tier.weeks;
      expect(component.longStayDiscount).withContext(`${tier.weeks} weeks`).toBe(tier.discount);
    }
  });

  it('does not apply an entire four-week promotion to a three-week stay', () => {
    component.selectedWeeks = 3;
    expect(component.offSeasonDiscount).toBe(0);
    expect(component.longStayDiscount).toBe(0);
  });

  it('does not charge summer fees for missing or invalid dates', () => {
    for (const date of ['', 'invalid', '2026-02-30']) {
      component.selectedStartDate = date;
      expect(component.summerWeeks).withContext(date).toBe(0);
    }
  });
});

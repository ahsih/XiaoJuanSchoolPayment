import {
  isSunday,
  MINT_COURSES,
  MINT_FAMILY_PRICES,
  MINT_LOCAL_TOTALS,
  MINT_ROOMS,
  MINT_WEEK_OPTIONS,
  mintEndDate,
  mintFamilyNoCourseDeduction,
  mintLowSeasonCashDiscount,
} from './mint-pricing';

describe('English MINT confirmed pricing', () => {
  it('includes the user-approved 20-week four-week-average estimate', () => {
    expect(MINT_WEEK_OPTIONS).toEqual([4, 8, 12, 16, 20, 24]);
    expect(MINT_COURSES.find(item => item.id === 'lite-esl')?.prices[4]).toBe(850);
    expect(MINT_COURSES.find(item => item.id === 'lite-esl')?.prices[20]).toBe(4250);
    expect(MINT_ROOMS.find(item => item.id === 'deluxe-twin')?.prices[20]).toBe(4750);
    expect(MINT_ROOMS.find(item => item.id === 'deluxe-twin')?.prices[24]).toBe(5700);
    expect(MINT_LOCAL_TOTALS[4]).toBe(22800);
    expect(MINT_LOCAL_TOTALS[20]).toBe(75830);
  });

  it('uses the published low-season discount tiers without interpolation', () => {
    expect(mintLowSeasonCashDiscount(4)).toBe(150);
    expect(mintLowSeasonCashDiscount(8)).toBe(350);
    expect(mintLowSeasonCashDiscount(12)).toBe(600);
    expect(mintLowSeasonCashDiscount(16)).toBe(900);
    expect(mintLowSeasonCashDiscount(24)).toBe(1250);
  });

  it('keeps family totals and guardian deductions exact', () => {
    expect(MINT_FAMILY_PRICES['one-two'][10]).toBe(16250);
    expect(mintFamilyNoCourseDeduction(4)).toBe(250);
    expect(mintFamilyNoCourseDeduction(8)).toBe(375);
    expect(mintFamilyNoCourseDeduction(12)).toBe(500);
  });

  it('normalizes Sunday arrival to Saturday departure', () => {
    expect(isSunday('2026-09-20')).toBeTrue();
    expect(isSunday('2026-09-21')).toBeFalse();
    expect(mintEndDate('2026-09-20', 4)).toBe('2026-10-17');
  });
});

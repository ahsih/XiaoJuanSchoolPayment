import {
  isSunday,
  MINT_COURSES,
  MINT_FAMILY_PRICES,
  MINT_LOCAL_FEES,
  MINT_LOCAL_TOTALS,
  MINT_ROOMS,
  MINT_WEEK_OPTIONS,
  mintEndDate,
  mintFamilyNoCourseDeduction,
} from './mint-pricing';
import { cloneMintContentConfig, createDefaultMintContentConfig } from './mint-content-config';

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

  it('charges ACR I-Card with the first visa extension at 8 weeks (user rule 2026-11-24)', () => {
    const acr = MINT_LOCAL_FEES.find(row => row.id === 'acr')!;
    expect(acr.amounts[4]).toBe(0);
    expect(acr.amounts[8]).toBe(4000);
    for (const weeks of MINT_WEEK_OPTIONS) {
      expect(MINT_LOCAL_FEES.reduce((sum, row) => sum + row.amounts[weeks], 0)).withContext(`${weeks}`).toBe(MINT_LOCAL_TOTALS[weeks]);
    }
    const old = createDefaultMintContentConfig();
    old.localFees.find(item => item.id === 'acr')!.note = '12周及以上按学校表格计入。';
    old.quoteImageSettings.localFeeNotes!['acr'] = '12周及以上按学校表格计入。';
    const migrated = cloneMintContentConfig(old);
    expect(migrated.localFees.find(item => item.id === 'acr')?.note).toBe(acr.note);
    expect(migrated.quoteImageSettings.localFeeNotes!['acr']).toBe(acr.note);
  });

  it('drops the retired 2026 low-season offer from older published content', () => {
    const old = createDefaultMintContentConfig();
    old.quoteSettings.promotions = [
      { id: 'mint-low-season', name: '2026下半年淡季现金优惠' },
      { id: 'mint-ssp-benefit', name: '5周起二选一权益' },
    ] as typeof old.quoteSettings.promotions;
    expect(cloneMintContentConfig(old).quoteSettings.promotions).toEqual([]);
  });

  it('keeps the 2026-11-25 family package totals and guardian deductions exact', () => {
    expect(MINT_FAMILY_PRICES['one-one'][2]).toBe(3000);
    expect(MINT_FAMILY_PRICES['one-one'][3]).toBe(4000);
    expect(MINT_FAMILY_PRICES['one-two'][3]).toBe(5200);
    expect(MINT_FAMILY_PRICES['one-two'][10]).toBe(16250);
    expect(MINT_FAMILY_PRICES['two-two'][2]).toBe(6000);
    expect(MINT_FAMILY_PRICES['two-one']).toEqual({ 2: 3720, 3: 4960, 4: 6200 });
    expect(MINT_FAMILY_PRICES['two-one'][6]).toBeUndefined();
    expect(mintFamilyNoCourseDeduction(2)).toBe(150);
    expect(mintFamilyNoCourseDeduction(3)).toBe(150);
    expect(mintFamilyNoCourseDeduction(4)).toBe(250);
    expect(mintFamilyNoCourseDeduction(6)).toBe(250);
    expect(mintFamilyNoCourseDeduction(8)).toBe(350);
    expect(mintFamilyNoCourseDeduction(10)).toBe(350);
    expect(mintFamilyNoCourseDeduction(12)).toBe(500);
  });

  it('normalizes Sunday arrival to Saturday departure', () => {
    expect(isSunday('2026-09-20')).toBeTrue();
    expect(isSunday('2026-09-21')).toBeFalse();
    expect(mintEndDate('2026-09-20', 4)).toBe('2026-10-17');
  });
});

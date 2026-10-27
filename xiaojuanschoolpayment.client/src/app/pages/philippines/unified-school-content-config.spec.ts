import { cloneCellaContentConfig, createDefaultCellaContentConfig } from './cella-quote/cella-content-config';
import { cloneCgSpartaContentConfig, createDefaultCgSpartaContentConfig } from './cg-sparta-school/cg-sparta-content-config';
import { cloneJicContentConfig, createDefaultJicContentConfig } from './jic-school/jic-content-config';
import { cloneAnjContentConfig, createDefaultAnjContentConfig } from './anj-school/anj-content-config';
import { cloneBeciContentConfig, createDefaultBeciContentConfig } from './beci-school/beci-content-config';
import { clonePinesContentConfig, createDefaultPinesContentConfig } from './pines-school/pines-content-config';
import { clonePhilinterContentConfig, createDefaultPhilinterContentConfig } from './philinter-school/philinter-content-config';
import { cloneEvContentConfig, createDefaultEvContentConfig } from './ev-school/ev-content-config';
import { cloneFellaContentConfig, createDefaultFellaContentConfig, fellaQuoteImageSettings } from './fella-school/fella-content-config';
import {
  cloneBtesContentConfig,
  cloneBlueOceanContentConfig,
  cloneTargetContentConfig,
  cloneWalesContentConfig,
  createDefaultBtesContentConfig,
  createDefaultBlueOceanContentConfig,
  createDefaultTargetContentConfig,
  createDefaultWalesContentConfig,
} from './remaining-content-config';

describe('new unified employee school content configs', () => {
  it('removes the old per-row short-stay explanation from published CG Sparta content', () => {
    const config = createDefaultCgSpartaContentConfig();
    config.quoteSettings.courseTableNote = '每行1/2/3周分别按4周价的40%/60%/85%预估；4周及以上按4周单价按周折算。';
    expect(cloneCgSpartaContentConfig(config).quoteSettings.courseTableNote).toBe('');
  });
  it('removes only the legacy JIC image formula and preserves independent campus copy', () => {
    const config = createDefaultJicContentConfig();
    config.campusQuoteImageSettings!['challenger'].footerNotes = ['1／2／3周按4周价的40%／65%／85%；周日入住、周六退房。', '付款需提前确认。'];
    config.campusQuoteImageSettings!['premium'].footerNotes = [];
    const migrated = cloneJicContentConfig(config);
    expect(migrated.campusQuoteImageSettings!['challenger'].footerNotes).toEqual(['付款需提前确认。']);
    expect(migrated.campusQuoteImageSettings!['premium'].footerNotes).toEqual([]);
  });
  it('keeps CELLA campuses in independent versioned documents', () => {
    const uni = createDefaultCellaContentConfig('uni');
    const premium = createDefaultCellaContentConfig('premium');
    uni.quoteImageSettings.paymentNotes.course = 'Uni说明';
    expect(uni.schoolCode).toBe('CELLA-UNI');
    expect(premium.schoolCode).toBe('CELLA-PREMIUM');
    expect(premium.quoteImageSettings.paymentNotes.course).not.toBe('Uni说明');
    expect(Object.keys(uni.quoteImageSettings.promotionNotes ?? {}).length).toBeGreaterThan(1);
  });

  it('keeps both Fella campus image settings separate and preserves cleared copy', () => {
    const config = createDefaultFellaContentConfig();
    fellaQuoteImageSettings(config, 'campus1').paymentNotes.course = '';
    fellaQuoteImageSettings(config, 'campus2').paymentNotes.course = '第二校区说明';
    const cloned = cloneFellaContentConfig(config);
    expect(fellaQuoteImageSettings(cloned, 'campus1').paymentNotes.course).toBe('');
    expect(fellaQuoteImageSettings(cloned, 'campus2').paymentNotes.course).toBe('第二校区说明');
  });

  it('provides independent promotion fields for every remaining school', () => {
    const configs = [createDefaultBtesContentConfig(), createDefaultBlueOceanContentConfig(), createDefaultTargetContentConfig(), createDefaultWalesContentConfig()];
    for (const config of configs) {
      for (const promotion of config.quoteSettings.promotions) {
        expect(Object.prototype.hasOwnProperty.call(config.quoteImageSettings.promotionNotes, promotion.id)).toBeTrue();
      }
    }
  });

  it('treats saved empty strings as valid content during legacy upgrade', () => {
    const pairs = [
      [createDefaultBtesContentConfig, cloneBtesContentConfig],
      [createDefaultBlueOceanContentConfig, cloneBlueOceanContentConfig],
      [createDefaultTargetContentConfig, cloneTargetContentConfig],
      [createDefaultWalesContentConfig, cloneWalesContentConfig],
    ] as const;
    for (const [create, clone] of pairs) {
      const config = create();
      config.quoteImageSettings.paymentNotes.registration = '';
      config.quoteImageSettings.footerNotes = [];
      const restored = clone(config);
      expect(restored.quoteImageSettings.paymentNotes.registration).toBe('');
      expect(restored.quoteImageSettings.footerNotes).toEqual([]);
    }
  });

  it('upgrades older CELLA content without overwriting explicit empty text', () => {
    const config = createDefaultCellaContentConfig('uni');
    config.quoteImageSettings.alumniBenefitText = '';
    expect(cloneCellaContentConfig(config, 'uni').quoteImageSettings.alumniBenefitText).toBe('');
  });

  it('disables only historical unconfirmed 2027 peak dates in old published content', () => {
    const anj = createDefaultAnjContentConfig(); delete anj.quoteSettings.peakSeasonPolicyVersion; Object.assign(anj.quoteSettings.peakSeasonRanges.at(-1)!, { id: 'anj-peak-2', label: '2027旺季（按相同8周星期推算）', enabled: true });
    const beci = createDefaultBeciContentConfig(); delete beci.quoteSettings.peakSeasonPolicyVersion; beci.quoteSettings.peakSeasonRanges.at(-1)!.enabled = true;
    const pines = createDefaultPinesContentConfig(); delete pines.quoteSettings.peakSeasonPolicyVersion; pines.quoteSettings.peakSeasonRanges.at(-1)!.enabled = true;
    const philinter = createDefaultPhilinterContentConfig(); delete philinter.quoteSettings.peakSeasonPolicyVersion; philinter.quoteSettings.peakSeasonRanges.at(-1)!.enabled = true;
    expect(cloneAnjContentConfig(anj).quoteSettings.peakSeasonRanges.at(-1)!.enabled).toBeFalse();
    expect(cloneBeciContentConfig(beci).quoteSettings.peakSeasonRanges.at(-1)!.enabled).toBeFalse();
    expect(clonePinesContentConfig(pines).quoteSettings.peakSeasonRanges.at(-1)!.enabled).toBeFalse();
    expect(clonePhilinterContentConfig(philinter).quoteSettings.peakSeasonRanges.at(-1)!.enabled).toBeFalse();
  });

  it('upgrades EV published discount scope without changing unrelated copy', () => {
    const config = createDefaultEvContentConfig();
    const rule = config.quoteSettings.promotions.find(item => item.id === 'ev-sida-95')!;
    rule.appliesTo = 'school-total'; rule.description = '员工自定义说明';
    const migrated = cloneEvContentConfig(config);
    const result = migrated.quoteSettings.promotions.find(item => item.id === 'ev-sida-95')!;
    expect(result.appliesTo).toBe('tuition-and-accommodation');
    expect(result.description).toBe('员工自定义说明');
  });

  it('restores confirmed 2027 peak ranges in older published content', () => {
    const blue = createDefaultBlueOceanContentConfig();
    delete blue.quoteSettings.peakSeasonPolicyVersion;
    blue.quoteSettings.peakSeasonRanges = blue.quoteSettings.peakSeasonRanges.filter(range => range.id !== '2027');
    const cella = createDefaultCellaContentConfig('premium');
    delete cella.quoteSettings.peakSeasonPolicyVersion;
    cella.quoteSettings.peakSeasonRanges = cella.quoteSettings.peakSeasonRanges.filter(range => range.id !== 'cella-peak-2027');
    const ev = createDefaultEvContentConfig();
    delete ev.quoteSettings.peakSeasonPolicyVersion;
    ev.quoteSettings.peakSeasonRanges = [];

    expect(cloneBlueOceanContentConfig(blue).quoteSettings.peakSeasonRanges.find(range => range.id === '2027')).toEqual(
      jasmine.objectContaining({ start: '2027-06-27', end: '2027-08-21', enabled: true }),
    );
    expect(cloneCellaContentConfig(cella, 'premium').quoteSettings.peakSeasonRanges.find(range => range.id === 'cella-peak-2027')).toEqual(
      jasmine.objectContaining({ start: '2027-07-04', end: '2027-08-28', enabled: true }),
    );
    expect(cloneEvContentConfig(ev).quoteSettings.peakSeasonRanges.find(range => range.id === 'ev-peak-2027')).toEqual(
      jasmine.objectContaining({ start: '2027-07-04', end: '2027-08-28', enabled: true }),
    );
  });

  it('preserves later employee edits after the one-time association migration', () => {
    const config = createDefaultEvContentConfig();
    const range = config.quoteSettings.peakSeasonRanges.find(item => item.id === 'ev-peak-2027')!;
    Object.assign(range, { start: '2027-07-11', end: '2027-08-21', enabled: false });
    expect(cloneEvContentConfig(config).quoteSettings.peakSeasonRanges.find(item => item.id === 'ev-peak-2027')).toEqual(
      jasmine.objectContaining({ start: '2027-07-11', end: '2027-08-21', enabled: false }),
    );
  });
});

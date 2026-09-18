import { cloneCellaContentConfig, createDefaultCellaContentConfig } from './cella-quote/cella-content-config';
import { cloneCgSpartaContentConfig, createDefaultCgSpartaContentConfig } from './cg-sparta-school/cg-sparta-content-config';
import { cloneJicContentConfig, createDefaultJicContentConfig } from './jic-school/jic-content-config';
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
});

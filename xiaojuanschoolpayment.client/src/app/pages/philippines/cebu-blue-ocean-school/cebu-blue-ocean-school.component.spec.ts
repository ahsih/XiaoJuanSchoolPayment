import { CebuBlueOceanSchoolComponent } from './cebu-blue-ocean-school.component';

describe('CebuBlueOceanSchoolComponent pricing', () => {
  let component: CebuBlueOceanSchoolComponent;

  beforeEach(() => {
    component = new CebuBlueOceanSchoolComponent();
  });

  it('calculates short stays from the four-week price', () => {
    expect(component.tuitionFor('light-esl', 1)).toBe(348);
    expect(component.tuitionFor('light-esl', 2)).toBe(565.5);
    expect(component.tuitionFor('light-esl', 3)).toBe(739.5);

    expect(component.dormFeeFor('egi-triple-ocean', 1)).toBe(340);
    expect(component.dormFeeFor('egi-triple-ocean', 2)).toBe(552.5);
    expect(component.dormFeeFor('egi-triple-ocean', 3)).toBe(722.5);
  });

  it('uses the supplied registration fee and Senior Course price', () => {
    expect(component.registrationFee).toBe(100);
    expect(component.tuitionFor('senior', 4)).toBe(1050);
    expect(component.quoteUsd).toBe(1820);
  });
});

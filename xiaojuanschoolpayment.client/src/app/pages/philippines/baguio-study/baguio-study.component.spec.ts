import { getBaguioSchoolShortName } from './baguio-study.component';

describe('Baguio school directory labels', () => {
  it('keeps the two JIC campuses distinct from HELP English', () => {
    expect(getBaguioSchoolShortName('菲律宾碧瑶JIC挑战校区')).toBe('Baguio JIC 挑战校区');
    expect(getBaguioSchoolShortName('菲律宾碧瑶JIC高级校区')).toBe('Baguio JIC 高级校区');
    expect(getBaguioSchoolShortName('HELP English（Longlong Campus）')).toBe('HELP English');
  });

  it('does not mislabel an unknown school as HELP English', () => {
    expect(getBaguioSchoolShortName('新的碧瑶学校')).toBe('新的碧瑶学校');
  });
});

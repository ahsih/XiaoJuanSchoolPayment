// La Mer quote on the shared Philippine school page: the same amounts the earlier La Mer calculator produced
// (ordinary courses, the Monday-start school offer, the Sida rate, local fees and the exact family packages).
import { TestBed } from '@angular/core/testing';
import { SchoolQuotePlanComponent } from '../../../components/school-quote-plan.component';
import type { CiaContentConfig } from '../cia-school/cia-content-config';
import { createCiaQuotePricing } from '../cia-school/cia-quote-engine';
import { cloneLaMerContentConfig, createDefaultLaMerContentConfig, isLaMerSchool, LA_MER_POLICY_VERSION } from './la-mer-content-config';
import { buildLaMerPreviewQuote, LA_MER_FAMILY_ROOM_ID, LaMerPageStudent, LaMerQuote, LaMerQuotePricing } from './la-mer-page-quote';
import { laMerCourseId, laMerRoomId } from './la-mer-school-page.component';

function pricingFor(content: CiaContentConfig = createDefaultLaMerContentConfig()): LaMerQuotePricing {
  return {
    ...createCiaQuotePricing(content),
    laMerPolicy: content.quoteSettings.laMer!,
    usdToCny: 7, phpPerCny: 8, exchangeRateDate: '2026-11-20', usingLiveExchangeRates: true,
  };
}

function ordinary(start: string, weeks: number, pricing = pricingFor()): LaMerPageStudent {
  const student = new LaMerPageStudent(pricing);
  student.quotePlan.setStayStart(start);
  student.quotePlan.setStayWeeks(weeks);
  return student;
}

function family(start: string, weeks: number, packageId = 'family-double-2', pricing = pricingFor()): LaMerPageStudent {
  const student = ordinary(start, weeks, pricing);
  student.quotePlan.courses[0].optionId = packageId;
  student.planOptionChanged();
  student.quotePlan.setStayWeeks(weeks);
  return student;
}

const sum = (student: LaMerPageStudent, item?: string) =>
  student.localFees.filter(fee => !item || fee.item === item).reduce((total, fee) => total + fee.total, 0);

describe('La Mer page quote', () => {
  it('keeps the campus separate from the EV main campus', () => {
    expect(isLaMerSchool('EV Academy La Mer')).toBeTrue();
    expect(isLaMerSchool('EV Academy')).toBeFalse();
    expect(laMerCourseId('ESL Classic｜综合英语')).toBe('esl-classic');
    expect(laMerCourseId('Power Speaking 6｜强化口语')).toBe('power-speaking-6');
    expect(laMerCourseId('Power Speaking 8｜密集口语')).toBe('power-speaking-8');
    expect(laMerCourseId('Senior｜熟龄英语')).toBe('senior');
    expect(laMerRoomId('直通泳池双人间')).toBe('pool-double');
    expect(laMerRoomId('标准双人间')).toBe('double');
  });

  ([[1, 792, 804.9], [2, 1287, 1227.65], [3, 1683, 1556.35], [4, 1980, 1791], [8, 3960, 3482]] as const).forEach(([weeks, gross, total]) => {
    it(`prices ${weeks} ordinary weeks with one registration fee`, () => {
      const student = ordinary('2026-09-20', weeks);
      expect(student.quoteError).toBe('');
      expect(student.tuition + student.accommodation).toBe(gross);
      expect(student.quoteUsd).toBeCloseTo(total, 2);
      expect(student.registration).toBe(100);
    });
  });

  it('prices short split course periods at the four-week tier', () => {
    const student = ordinary('2026-09-20', 4);
    student.quotePlan.splitStay('course');
    student.quotePlan.courses[1].optionId = 'power-speaking-8';
    expect(student.quotePlan.error).toBe('');
    expect(student.tuition).toBe(1115);
    expect(student.accommodation).toBe(1050);
  });

  ([['2026-08-16', 0], ['2026-08-23', 200], ['2026-12-27', 200], ['2027-01-03', 0]] as const).forEach(([start, discount]) => {
    it(`uses the first Monday for the school offer (${start})`, () => {
      expect(ordinary(start, 4).schoolDiscount).toBe(discount);
    });
  });

  it('waives registration for returning students only', () => {
    const student = ordinary('2026-09-20', 4);
    student.returningStudent = true;
    expect(student.registration).toBe(0);
    expect(student.quoteUsd).toBe(1691);
  });

  it('reconciles the four-week local fees and keeps deposit and pickup outside', () => {
    const student = ordinary('2026-09-20', 4);
    expect(sum(student)).toBe(18000);
    expect(student.roomDeposit).toBe(3000);
    expect(sum(student, 'ARP外国人登记')).toBe(0);
  });

  it('uses the cumulative visa columns, with ACR and ARP at the first extension', () => {
    expect(sum(ordinary('2026-09-20', 8), '签证续签')).toBe(5430);
    expect(sum(ordinary('2026-09-20', 12), '签证续签')).toBe(11830);
    expect(sum(ordinary('2026-09-20', 8), 'ARP外国人登记')).toBe(300);
    // ACR I-CARD comes with the first extension (user rule 2026-11-24), so a 30-day visa pays it from week 5.
    expect(sum(ordinary('2026-09-20', 8), 'ACR I-CARD')).toBe(4000);
    expect(sum(ordinary('2026-09-20', 4), 'ACR I-CARD')).toBe(0);
    const longer = ordinary('2026-09-20', 12);
    longer.visaType = 'tourist59';
    expect(sum(longer, '59天签证续签')).toBe(6700);
    expect(sum(longer, 'ACR I-CARD')).toBe(4000);
    const eight59 = ordinary('2026-09-20', 8);
    eight59.visaType = 'tourist59';
    expect(sum(eight59)).toBe(23200);
  });

  it('notes the unpublished 2027 ordinary summer surcharge instead of charging it', () => {
    const student = ordinary('2027-06-27', 4);
    expect(student.seasonalSurcharge).toBe(0);
    expect(student.extraPaymentNote).toContain('2027年暑期');
    expect(ordinary('2026-09-20', 4).extraPaymentNote).toBe('');
  });

  it('prices the newer family package without any discount, with the included fees', () => {
    const student = family('2026-09-20', 4);
    expect(student.quoteError).toBe('');
    expect(student.quotePlan.rooms.map(row => row.optionId)).toEqual([LA_MER_FAMILY_ROOM_ID]);
    expect(student.tuition).toBe(4400);
    expect(student.accommodation).toBe(0);
    expect(student.registration).toBe(0);
    expect(student.schoolDiscount).toBe(0);
    expect(student.sidaDiscount).toBe(0);
    expect(student.seasonalSurcharge).toBe(0);
    expect(student.quoteUsd).toBe(4400);
    expect(student.paymentLines).toEqual([]);
    expect(student.roomDeposit).toBe(6000);
    expect(sum(student)).toBe(0);
    expect(student.registrationNote).toContain('1000美元');
  });

  ([[1, 1760], [2, 2860], [3, 3740], [4, 4400], [6, 6400], [8, 8400]] as const).forEach(([weeks, price]) => {
    it(`keeps the exact ${weeks}-week whole-family price`, () => {
      const student = family('2026-09-20', weeks);
      expect(student.quoteError).toBe('');
      expect(student.tuition).toBe(price);
    });
  });

  it('counts every family member in the deposit, and none in a discount', () => {
    const three = family('2026-09-20', 4, 'family-triple-3');
    expect(three.quoteError).toBe('');
    expect(three.promotionDiscountTotal).toBe(0);
    expect(three.roomDeposit).toBe(9000);
    const four = family('2026-09-20', 4, 'family-quad-4');
    expect(four.promotionDiscountTotal).toBe(0);
    expect(four.roomDeposit).toBe(12000);
  });

  it('charges the peak family price as it is, with no surcharge', () => {
    const student = family('2027-01-03', 4);
    expect(student.tuition).toBe(5200);
    expect(student.promotionDiscountTotal).toBe(0);
    expect(student.quoteUsd).toBe(5200);
  });

  it('uses the older family version before the newer one starts', () => {
    const student = family('2026-05-03', 4);
    expect(student.quoteError).toBe('');
    expect(student.tuition).toBe(5100);
    expect(student.quoteUsd).toBe(5100);
  });

  it('takes the season of the arrival date for a stay across seasons', () => {
    const intoPeak = family('2026-12-20', 4);
    expect(intoPeak.quoteError).toBe('');
    expect(intoPeak.tuition).toBe(4400);
    const outOfPeak = family('2027-02-14', 4);
    expect(outOfPeak.quoteError).toBe('');
    expect(outOfPeak.tuition).toBe(5200);
  });

  it('blocks family weeks and dates without a published price', () => {
    const five = family('2026-09-20', 4);
    five.quotePlan.setStayWeeks(5);
    expect(five.quoteError).toContain('整包价');
    expect(family('2026-08-16', 4).quoteError).toContain('价格期');
    expect(family('2027-12-12', 4).quoteError).not.toBe('');
    expect(family('2026-06-21', 1).quoteError).toContain('不开放');
  });

  it('adds family visa extensions per member outside the package', () => {
    const student = family('2026-09-20', 8);
    expect(sum(student, '签证续签')).toBe(10860);
    expect(student.tuition).toBe(8400);
    expect(student.quoteUsd).toBe(8400);
    expect(student.registrationNote).toContain('余款在出发前4周付清');
    expect(student.localFees.some(fee => fee.note.includes('。；'))).toBeFalse();
  });

  it('keeps peak family prices at exact Sunday and Saturday boundaries', () => {
    expect(family('2027-02-21', 1).tuition).toBe(2080);
    expect(family('2027-02-28', 1).tuition).toBe(1760);
    expect(family('2027-06-27', 1).tuition).toBe(2080);
  });

  it('switches back to an ordinary room when the family package is removed', () => {
    const student = family('2026-09-20', 4);
    student.quotePlan.courses[0].optionId = 'esl-classic';
    student.planOptionChanged();
    expect(student.quotePlan.rooms[0].optionId).toBe('double');
    expect(student.quoteError).toBe('');
  });

  it('reads published prices and offers', () => {
    const content = createDefaultLaMerContentConfig();
    content.courses[0].tuition = 1000;
    content.courses[0].tuition2027 = 1000;
    content.quoteSettings.promotions[1].discountValue = 10;
    content.quoteSettings.laMer!.familyVersions[1].packages.find(item => item.id === 'double' && item.season === 'off')!.prices['4'] = 4600;
    const pricing = pricingFor(cloneLaMerContentConfig(content));
    expect(ordinary('2026-09-20', 4, pricing).quoteUsd).toBe(1765);
    expect(family('2026-09-20', 4, 'family-double-2', pricing).quoteUsd).toBe(4600);
  });

  it('builds a v2 quote image with the family registration note', () => {
    const quote = new LaMerQuote(pricingFor());
    quote.students[0].quotePlan.setStayStart('2026-09-20');
    expect(quote.quoteImageData.headingText).toBe('EV La Mer 4周报价');
    const image = buildLaMerPreviewQuote(createDefaultLaMerContentConfig(), 'family', { usdToCny: 7, phpPerCny: 8, exchangeRateDate: '2026-11-20' });
    expect(JSON.stringify(image.paymentItems)).toContain('亲子套餐');
  });
});

describe('La Mer content upgrade', () => {
  function oldDocument(): CiaContentConfig {
    const content = createDefaultLaMerContentConfig();
    const settings = content.quoteSettings as CiaContentConfig['quoteSettings'] & { laMerPolicyVersion?: number };
    delete settings.laMerPolicyVersion;
    content.courses[0].name = 'ESL Classic｜综合英语';
    content.courses[0].note = '一对一覆盖听力、口语、阅读、写作；团课含语法、听力、发表与口语。';
    content.courses[1].name = '我们自己改的名字';
    content.rooms.forEach(room => { room.group = '校内住宿'; room.label = room.name; });
    content.localFees = content.localFees.filter(fee => fee.id !== 'arp');
    content.quoteImageSettings.benefits = ['0中介费', '报名协助', '费用核对', '学习期间支持'].map(title => ({ title, text: '' }));
    content.quoteSettings.promotions[1].name = '思达启航95折优惠';
    return content;
  }

  it('moves untouched old defaults onto the new wording once and keeps edits', () => {
    const upgraded = cloneLaMerContentConfig(oldDocument());
    expect(upgraded.courses[0].name).toBe('经典ESL');
    expect(upgraded.courses[0].note).toContain('一对一：听力');
    expect(upgraded.courses[1].name).toBe('我们自己改的名字');
    expect(upgraded.rooms.map(room => room.group)).toEqual(['单人间', '多人间', '多人间', '多人间', '多人间']);
    expect(upgraded.rooms[1].label).toBe('泳池双人间');
    expect(upgraded.localFees.some(fee => fee.id === 'arp')).toBeTrue();
    expect(upgraded.quoteImageSettings.benefits[1].title).toBe('价格保护');
    expect(upgraded.quoteSettings.promotions[1].name).toBe('思达启航折扣');
    expect((upgraded.quoteSettings as { laMerPolicyVersion?: number }).laMerPolicyVersion).toBe(LA_MER_POLICY_VERSION);
    const again = cloneLaMerContentConfig({ ...upgraded, rooms: upgraded.rooms.map(room => ({ ...room, group: '校内住宿' })) });
    expect(again.rooms[0].group).toBe('校内住宿');
  });

  it('moves untouched version-1 offer wording, which still discounted family packages, onto version 2', () => {
    const saved = createDefaultLaMerContentConfig();
    (saved.quoteSettings as { laMerPolicyVersion?: number }).laMerPolicyVersion = 1;
    saved.quoteSettings.promotions[0].description = '我们自己写的学校优惠说明';
    saved.quoteSettings.promotions[1].description = '课程和住宿在学校优惠后享95折；亲子套餐在学校优惠后整包享95折。注册费、旺季附加费和到校学杂费不参与。';
    saved.courses[1].name = '我们自己改的名字';
    const upgraded = cloneLaMerContentConfig(saved);
    expect(upgraded.quoteSettings.promotions[0].description).toBe('我们自己写的学校优惠说明');
    expect(upgraded.quoteSettings.promotions[1].description).toContain('亲子套餐、注册费');
    expect(upgraded.courses[1].name).toBe('我们自己改的名字');
    expect((upgraded.quoteSettings as { laMerPolicyVersion?: number }).laMerPolicyVersion).toBe(2);
  });

  it('moves an untouched week-9 ACR note to the first-extension wording once', () => {
    const saved = createDefaultLaMerContentConfig();
    const oldNote = '停留满9周（超过59天）时办理一次。';
    saved.localFees.find(fee => fee.id === 'acr-i-card')!.note = oldNote;
    saved.quoteImageSettings.localFeeNotes['acr-i-card'] = oldNote;
    const upgraded = cloneLaMerContentConfig(saved);
    expect(upgraded.localFees.find(fee => fee.id === 'acr-i-card')!.note).toContain('第一次签证续签时办理');
    expect(upgraded.quoteImageSettings.localFeeNotes['acr-i-card']).toContain('第一次签证续签时办理');
    const edited = cloneLaMerContentConfig(upgraded);
    edited.localFees.find(fee => fee.id === 'acr-i-card')!.note = oldNote;
    expect(cloneLaMerContentConfig(edited).localFees.find(fee => fee.id === 'acr-i-card')!.note).toBe(oldNote);
  });

  it('ignores documents of other schools', () => {
    const other = createDefaultLaMerContentConfig();
    other.schoolCode = 'EV';
    expect(cloneLaMerContentConfig(other).schoolCode).toBe('EV-LAMER');
  });
});

describe('La Mer course list on desktop', () => {
  beforeEach(() => TestBed.configureTestingModule({ imports: [SchoolQuotePlanComponent] }));

  // Rebuilding the <option> elements on every check closed an open course list in desktop WeChat at once.
  it('keeps the same option elements when the page checks again', () => {
    const fixture = TestBed.createComponent(SchoolQuotePlanComponent);
    fixture.componentInstance.plan = ordinary('2026-09-20', 4).quotePlan;
    fixture.componentInstance.singleStay = true;
    fixture.detectChanges();
    const options = () => Array.from(fixture.nativeElement.querySelectorAll('label.type select option')) as HTMLOptionElement[];
    const before = options();
    expect(before.length).toBeGreaterThan(5);
    fixture.detectChanges();
    expect(options().every((option, index) => option === before[index])).toBeTrue();
  });
});

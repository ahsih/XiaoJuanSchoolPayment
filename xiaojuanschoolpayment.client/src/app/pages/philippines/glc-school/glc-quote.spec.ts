import { GlcQuoteCalculator, GLC_PICKUP_FEE_NOTE } from './glc-quote';
import { GLC_COURSES, GLC_ROOMS, GLC_REGISTRATION_NOTE } from './glc-pricing';
import { QuoteImageDownloadButtonComponent } from '../../../components/quote-image-download-button.component';

describe('GLC weekly, promotion and family quotes', () => {
  const create = () => {
    const quote = new GlcQuoteCalculator(() => GLC_COURSES.map(course => ({ ...course })), () => GLC_ROOMS.map(room => ({ ...room })), () => 120);
    quote.registrationDate = '2026-09-04';
    return quote;
  };
  const dates = (quote: GlcQuoteCalculator, start: string, weeks: number) => {
    for (const row of [...quote.plan.courses, ...quote.plan.rooms]) { row.startDate = start; row.weeks = weeks; }
  };
  const imageData = (quote: GlcQuoteCalculator) => quote.imageData(7.2, 9, '人民币按备用汇率预估，以付款当日汇率为准。', '/assets/glc/campus-main.jpg');

  it('uses weekly prices, exactly three benefits and the supplied 4-week local total', () => {
    const q = create();
    expect(q.tuition).toBe(860); expect(q.accommodation).toBe(1000); expect(q.registration).toBe(120);
    expect(q.schoolDiscount).toBe(150); expect(q.sidaDiscount).toBe(50); expect(q.freePickup).toBeTrue();
    expect(q.totalUsd).toBe(1780); expect(q.localTotal).toBe(25500); expect(q.error).toBe('');
    expect(q.optionalFees.map(fee => fee.total)).toEqual([0, 3000]);
  });

  it('does not divide one-week prices by four or apply other schools short-stay multipliers', () => {
    const q = create(); dates(q, '2026-09-06', 1);
    expect(q.tuition).toBe(215); expect(q.accommodation).toBe(250);
    expect(q.schoolDiscount).toBe(0); expect(q.sidaDiscount).toBe(0); expect(q.totalUsd).toBe(585);
  });

  it('uses both study windows and excludes the intervening summer period without a surcharge', () => {
    const q = create();
    q.registrationDate = '2027-01-03';
    for (const start of ['2026-06-07', '2027-06-06', '2027-08-29', '2027-12-05']) {
      dates(q, start, 4); expect(q.schoolDiscount).withContext(start).toBe(150);
    }
    for (const start of ['2026-05-03', '2027-07-04', '2028-01-02']) {
      dates(q, start, 4); expect(q.schoolDiscount).withContext(start).toBe(0);
      expect(q.totalUsd).toBe(1930); expect(q.freePickup).toBeFalse();
    }
  });

  it('counts only complete eligible weeks on a window boundary', () => {
    const q = create(); dates(q, '2027-06-06', 8);
    expect(q.schoolDiscount).toBe(150); expect(q.sidaDiscount).toBe(100);
    dates(q, '2026-05-31', 4); expect(q.schoolDiscount).toBe(0);
  });

  it('joins consecutive qualifying course rows but not gaps or ineligible courses', () => {
    const q = create(); q.plan.courses[0].weeks = 2; q.plan.add('course');
    q.plan.courses[1].weeks = 2; q.plan.courses[1].optionId = 'general-ielts';
    expect(q.schoolDiscount).toBe(150); expect(q.sidaDiscount).toBe(50);
    q.plan.courses[1].optionId = 'light-power-speaking'; expect(q.schoolDiscount).toBe(0);
    q.plan.courses[1].optionId = 'general-ielts'; q.plan.courses[1].startDate = '2026-10-04';
    expect(q.schoolDiscount).toBe(0); expect(q.sidaDiscount).toBe(0);
  });

  it('excludes listed courses from study-period cash and pickup benefits, retaining Sida separately', () => {
    const q = create();
    q.registrationDate = '2027-01-03';
    for (const course of GLC_COURSES.filter(course => !course.offSeasonEligible)) {
      q.plan.courses[0].optionId = course.id;
      expect(q.schoolDiscount).withContext(course.id).toBe(0);
      expect(q.freePickup).withContext(course.id).toBeFalse();
      expect(q.sidaDiscount).toBe(50);
    }
  });

  it('gives the separate registration-period Sunday pickup to every course including family and juniors', () => {
    for (const course of GLC_COURSES) {
      const q = create(); q.plan.courses[0].optionId = course.id;
      if (course.family) q.plan.add('room');
      expect(q.error).withContext(course.id).toBe('');
      expect(q.registrationPickupEligible).withContext(course.id).toBeTrue();
      expect(q.freePickup).withContext(course.id).toBeTrue();
      expect(q.pickupAmount).toBe(0);
      expect(q.schoolDiscount).toBe(course.offSeasonEligible ? 150 : 0);
      expect(q.sidaDiscount).toBe(50);
      q.pickup = 'weekday'; expect(q.pickupAmount).toBe(1750);
    }
  });

  it('uses inclusive registration boundaries independently of study dates and allows weekday registration', () => {
    const q = create(); q.plan.courses[0].optionId = 'light-power-speaking';
    for (const [date, free] of [['2026-04-04', false], ['2026-04-05', true], ['2027-01-02', true], ['2027-01-03', false]] as const) {
      q.registrationDate = date;
      expect(q.error).toBe('');
      expect(q.freePickup).withContext(date).toBe(free);
      expect(q.pickupAmount).toBe(free ? 0 : 1750);
    }
    q.registrationDate = '2026-09-04'; dates(q, '2027-07-04', 4);
    expect(q.freePickup).toBeTrue(); expect(q.schoolDiscount).toBe(0);
    for (const weeks of [1, 2, 3]) { dates(q, '2026-09-06', weeks); expect(q.freePickup).toBeFalse(); }
    dates(q, '2026-09-06', 4); expect(q.freePickup).toBeTrue();
    q.registrationDate = ''; expect(q.error).toContain('报名日期');
    q.registrationDate = '2026-02-30'; expect(q.error).toContain('报名日期');
  });

  it('retains annual study-period pickup outside the separate registration offer', () => {
    const q = create(); q.registrationDate = '2027-08-01'; dates(q, '2027-08-29', 4);
    expect(q.registrationPickupEligible).toBeFalse();
    expect(q.studyPickupEligible).toBeTrue(); expect(q.freePickup).toBeTrue();
    expect(q.pickupFeeNote).toContain('按就读期间的学校年度优惠');
  });

  it('charges full pickup for non-Sunday flights and zero when not selected', () => {
    const q = create(); q.pickup = 'weekday';
    expect(q.pickupAmount).toBe(1750); expect(q.freePickup).toBeFalse(); expect(q.schoolDiscount).toBe(150);
    q.peopleOverride = 2; expect(q.pickupAmount).toBe(3500);
    q.pickup = 'none'; expect(q.pickupAmount).toBe(0); expect(q.optionalFees[0].note).toContain('不选接机');
  });

  it('keeps the registration window and full non-Sunday fee in optional pickup notes and images', () => {
    const q = create();
    for (const pickup of ['sunday', 'weekday', 'none'] as const) {
      q.pickup = pickup;
      const row = q.optionalFees[0];
      expect(row.note).toContain(GLC_PICKUP_FEE_NOTE);
      expect(row.note).toContain('2026年4月5日至2027年1月2日期间报名');
      expect(row.note).toContain('非周日接机仍收1,750比索/次');
      expect(imageData(q).optionalFeeItems![0].note).toBe(row.note);
      expect(imageData(q).optionalFeeItems![0].cnyAmount).toBe(`人民币约 ${Math.round(row.total / 9).toLocaleString('zh-CN')} 元`);
    }
  });

  it('uses 59 days and repeated 30-day extensions at 4,670 pesos, or the chosen 30-day visa', () => {
    const q = create();
    for (const [weeks, count] of [[4, 0], [8, 0], [9, 1], [12, 1], [13, 2], [24, 4]]) {
      dates(q, '2026-09-06', weeks);
      expect(q.visaCount).withContext(String(weeks)).toBe(count);
      expect(q.localFees.find(fee => fee.item === '签证续签')!.total).toBe(count * 4670);
      expect(q.error).toBe('');
    }
    q.initialVisaDays = 30; dates(q, '2026-09-06', 8); expect(q.visaCount).toBe(1);
    expect(q.localFees.find(fee => fee.item === 'ARP外国人登记')!.total).toBe(300);
    q.visaType = 'student';
    expect(q.localFees.filter(fee => ['SSP特殊学习许可证', 'SSP-E CARD', 'ACR-I CARD 外国人身份证', '签证续签'].includes(fee.item)).every(fee => fee.total === 0)).toBeTrue();
    expect(q.localFees.find(fee => fee.item === 'ARP外国人登记')!.total).toBe(300);
  });

  it('uses accommodation weeks for utilities, course groups for books and the stay span for visas', () => {
    const q = create(); q.plan.courses[0].weeks = 8;
    expect(q.localFees.find(fee => fee.item === '管理费')!.total).toBe(6000);
    expect(q.localFees.find(fee => fee.item.startsWith('教材费'))!.total).toBe(3000);
    q.plan.add('course'); q.plan.courses[1].optionId = 'general-ielts'; q.plan.courses[1].startDate = '2026-12-06';
    expect(q.visaCount).toBe(2);
    expect(q.localFees.filter(fee => fee.item.startsWith('教材费')).map(fee => fee.total)).toEqual([3000, 5000]);
    expect(q.plan.warning).toContain('日期不一致');
  });

  it('blocks main-building rooms overlapping a Sparta course, but permits nonoverlapping periods', () => {
    const q = create(); q.plan.courses[0].optionId = 'ultra-sparta-esl'; q.plan.rooms[0].optionId = 'main-double';
    expect(q.error).toContain('副楼');
    q.plan.rooms[0].startDate = '2026-10-04'; expect(q.error).toBe('');
    q.plan.rooms[0].startDate = '2026-09-06'; q.plan.rooms[0].optionId = 'annex-single'; expect(q.error).toBe('');
  });

  it('shares one family course and charges two independent beds and local fees per person', () => {
    const q = create(); q.plan.courses[0].optionId = 'family-package-2';
    expect(q.error).toContain('学员2');
    q.plan.add('room');
    expect(q.plan.rooms[1].occupant).toBe(2); expect(q.plan.rooms[1].startDate).toBe('2026-09-06');
    expect(q.error).toBe(''); expect(q.plan.mismatch).toBeFalse();
    expect(q.tuition).toBe(1640); expect(q.accommodation).toBe(2000); expect(q.registration).toBe(240);
    expect(q.localTotal).toBe(51000); expect(q.schoolDiscount).toBe(0); expect(q.sidaDiscount).toBe(50);
    expect(q.totalUsd).toBe(3830); expect(q.optionalFees[1].total).toBe(6000);
    const image = imageData(q);
    expect(image.paymentItems.filter(item => item.label.startsWith('课程费')).length).toBe(1);
    expect(image.paymentItems.filter(item => item.label.startsWith('住宿费')).map(item => item.label)).toEqual(['住宿费 · 学员1', '住宿费 · 学员2']);
  });

  it('caps each family member at 24 weeks, not their combined bed-weeks', () => {
    const q = create(); q.plan.courses[0].optionId = 'family-package-4'; q.plan.add('room');
    dates(q, '2026-09-06', 24);
    expect(q.plan.roomWeeks).toBe(48); expect(q.error).toBe(''); expect(q.plan.canAdd('room')).toBeFalse();
    expect(q.localFees.find(fee => fee.item === '签证续签')!.total).toBe(8 * 4670);
  });

  it('blocks same-person overlapping rooms and retains unique row IDs when switching family mode', () => {
    const q = create(); q.plan.courses[0].optionId = 'family-package-2'; q.plan.add('room');
    q.plan.add('room'); q.plan.rooms[2].startDate = q.plan.rooms[0].startDate;
    expect(q.error).toContain('重叠');
    q.plan.courses[0].optionId = 'power-speaking'; q.plan.add('room');
    expect(new Set(q.plan.rooms.map(row => row.id)).size).toBe(q.plan.rooms.length);
  });

  it('waives registration for the specified returning students while preserving its exact image note', () => {
    const q = create(); q.returningStudents = 1; expect(q.registration).toBe(0);
    q.plan.courses[0].optionId = 'family-package-2'; q.plan.add('room');
    expect(q.registration).toBe(120); q.returningStudents = 2; expect(q.registration).toBe(0);
    expect(imageData(q).paymentItems[0].note).toBe(GLC_REGISTRATION_NOTE);
  });

  it('reuses every local note verbatim in images and displays both optional RMB estimates', () => {
    const q = create(); const image = imageData(q);
    expect(image.localFeeNote).toBe(q.localFeeIntro);
    expect(image.localFeeItems!.map(item => item.note)).toEqual(q.localFees.map(fee => fee.note));
    expect(image.optionalFeeItems!.map(item => item.note)).toEqual(q.optionalFees.map(fee => fee.note));
    expect(image.optionalFeeItems!.map(item => item.cnyAmount)).toEqual(q.optionalFees.map(fee => `人民币约 ${Math.round(fee.total / 9).toLocaleString('zh-CN')} 元`));
    expect(image.layout).toBe('cia-detailed'); expect(image.fullFeeDetails).toBeTrue();
    expect(image.headingText).toBe('GLC4周报价'); expect(image.paymentSectionTitle).toBe('学校费用明细');
    expect(JSON.stringify(image)).not.toMatch(/\b(USD|PHP|CNY)\b/);
  });

  for (const scenario of ['single', 'multi', 'family'] as const) {
    it(`renders the complete ${scenario} image including course schedules, optional RMB and footer`, async () => {
      const q = create();
      if (scenario === 'multi') for (let i = 0; i < 2; i++) { q.plan.add('course'); q.plan.add('room'); }
      if (scenario === 'family') { q.plan.courses[0].optionId = 'family-package-2'; q.plan.add('room'); }
      const renderer = new QuoteImageDownloadButtonComponent(); renderer.quote = imageData(q);
      const original = CanvasRenderingContext2D.prototype.fillText;
      const paint: { text: string; x: number; y: number; align: string }[] = [];
      spyOn(CanvasRenderingContext2D.prototype, 'fillText').and.callFake(function(this: CanvasRenderingContext2D, text, x, y) { paint.push({ text, x, y, align: this.textAlign }); original.call(this, text, x, y); });
      const blob = await (renderer as any).createQuoteImageBlob();
      expect(blob.size).toBeGreaterThan(10000); expect(blob.type).toBe('image/png');
      const text = paint.map(item => item.text).join('');
      expect(text).toContain('老学员返校免费'); expect(text).toContain('人民币约');
      expect(text).toContain('房间押金'); expect(text).toContain('报价说明');
      expect(text).toContain('2026年4月5日至2027年1月2日期间报名');
      expect(text).toContain('非周日接机仍收1,750比索/次');
      expect(text).toContain('小组'); expect(text).not.toContain('安排及金额见上表');
      for (const item of renderer.quote.paymentItems.filter(item => item.detailTitle)) {
        expect(text).toContain(item.detailTitle!.slice(0, 5));
      }
      const money = paint.filter(item => /\d.*美元/.test(item.text));
      expect(money.filter(item => item.align === 'right').length).toBeGreaterThanOrEqual(q.plan.courses.length + q.plan.rooms.length);
      const bitmap = await createImageBitmap(blob);
      expect(bitmap.height).toBeGreaterThan(1500); bitmap.close(); renderer.ngOnDestroy();
    }, 30000);
  }
});

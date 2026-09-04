import { TestBed } from '@angular/core/testing';
import { EMPTY, of } from 'rxjs';
import { SchoolService } from '../../../../services/school.service';
import { ExchangeRateService } from '../../../../services/exchange-rate.service';
import { BCebuSchoolComponent } from './bcebu-school.component';
import { BCebuQuote } from './bcebu-quote';
import { BCEBU_COURSES, BCEBU_ROOMS, BCEBU_REGISTRATION_NOTE, bcebuLongStay, bcebuOffSeason } from './bcebu-pricing';
import { QuoteImageDownloadButtonComponent } from '../../../components/quote-image-download-button.component';

const calculator = () => new BCebuQuote(() => BCEBU_COURSES, () => BCEBU_ROOMS, () => 100, '2026-09-06');
const duration = (quote: BCebuQuote, weeks: number) => { quote.plan.courses[0].weeks = weeks; quote.plan.rooms[0].weeks = weeks; };

describe("B'Cebu confirmed 2026 pricing", () => {
  it('includes all eleven course and seven room prices and full schedules', () => {
    expect(BCEBU_COURSES.map(row => row.tuition)).toEqual([900,1050,1000,1050,1150,1050,1050,1250,750,400,950]);
    expect(BCEBU_ROOMS.map(row => row.fee)).toEqual([1400,1350,950,1250,1000,900,750]);
    expect(BCEBU_COURSES[3].suitable).toContain('4节一对一');
    expect(BCEBU_COURSES[4].note).toContain('20:40');
    expect(BCEBU_COURSES[5].suitable).toContain('2节强制自习');
  });

  it('honors both promotion windows inclusively, using Monday admission', () => {
    for (const entry of ['2026-02-16','2026-06-29','2026-08-17','2026-12-28']) expect(bcebuOffSeason(entry)).toBeTrue();
    for (const entry of ['2026-02-15','2026-06-30','2026-08-16','2026-12-29']) expect(bcebuOffSeason(entry)).toBeFalse();
    const quote = calculator();
    quote.plan.courses[0].startDate = '2026-02-15';
    expect(quote.entryDate).toBe('2026-02-16');
    expect(quote.reporterEligible).toBeTrue();
  });

  it('stacks the five benefits and separates prepayment from actual refund', () => {
    const quote = calculator(); duration(quote, 8); quote.reporter = true;
    expect(quote.reporterDiscount).toBe(200);
    expect(quote.offSeasonDiscount).toBe(465);
    expect(quote.sidaDiscount).toBe(263.5);
    expect(quote.longStayDiscount).toBe(50);
    expect(quote.total).toBe(2321.5);
    expect(quote.prepaid).toBe(2474.5);
    expect(quote.refund).toBe(153);
    expect(quote.total + quote.refund).toBe(quote.prepaid);
    expect(quote.paymentItems[0].amount).toBe('100 美元');
    expect(quote.paymentItems[1].amount).toBe('− 100 美元');
    expect(quote.paymentItems[0].note).toBe(BCEBU_REGISTRATION_NOTE);
  });

  it('uses family 10% off with any room and excludes the reporter activity', () => {
    const quote = calculator(); quote.family = true; quote.reporter = true;
    expect(quote.reporterDiscount).toBe(0);
    expect(quote.total).toBe(1336.5);
    quote.plan.rooms[0].optionId = 'single-newtown-view';
    expect(quote.total).toBe(1863);
    expect(quote.minorFee).toBe(0);
  });

  it('applies only full long-stay tiers, including durations beyond 24 weeks', () => {
    expect([4,7,8,9,11,12,15,16,20,24,28,52].map(bcebuLongStay)).toEqual([0,0,50,50,50,100,100,200,300,400,500,1100]);
  });

  it('uses optional minor care without granting adult benefits or charging families', () => {
    const quote = calculator(); quote.reporter = true; quote.minorCare = '15to17';
    expect(quote.reporterDiscount).toBe(0);
    expect(quote.offSeasonDiscount).toBe(0);
    expect(quote.minorFee).toBe(200);
    expect(quote.imageData(7.2, 9, '备用汇率估算').paymentItems.find(row => row.label === '未成年单独在校管理费')!.amount).toBe('200 美元');
    quote.family = true;
    expect(quote.minorFee).toBe(0);
    expect(quote.total).toBe(1336.5);
    quote.family = false; quote.minorCare = 'none';
    expect(quote.reporterDiscount).toBe(100);
    quote.plan.courses[0].optionId = 'junior-esl';
    expect(quote.adultEligible).toBeFalse();
    expect(quote.reporterDiscount).toBe(0);
  });

  it('retains 40/60/80 percent short stays independently for courses and rooms', () => {
    const quote = calculator();
    for (const [weeks, tuition, room] of [[1,360,300],[2,540,450],[3,720,600]]) {
      duration(quote, weeks);
      expect(quote.plan.total('course')).toBe(tuition);
      expect(quote.plan.total('room')).toBe(room);
      expect(quote.reporterEligible).toBeFalse();
    }
  });

  it('charges peak and minor fees outside discounts and respects season boundaries', () => {
    const quote = calculator(); quote.minorCare = '15to17';
    quote.plan.courses[0].startDate = quote.plan.rooms[0].startDate = '2026-07-05';
    expect(quote.peakFee).toBe(160);
    expect(quote.minorFee).toBe(200);
    expect(quote.total).toBe(1845);
    quote.plan.courses[0].startDate = '2026-08-09';
    expect(quote.peakFee).toBe(40);
    quote.plan.courses[0].startDate = '2026-08-16';
    expect(quote.peakFee).toBe(0);
    quote.minorCare = 'under15';
    expect(quote.minorFee).toBe(400);
    quote.family = true;
    expect(quote.minorFee).toBe(0);
  });

  it('matches the supplied four-week local total and uses the chosen initial visa', () => {
    const quote = calculator();
    expect(quote.localTotal).toBe(20500);
    expect(quote.optionalFees[1].total).toBe(3000);
    duration(quote, 8);
    expect(quote.visaCount).toBe(1);
    expect(quote.localTotal).toBe(37930);
    expect(quote.optionalFees[1].total).toBe(5000);
    quote.initialVisaDays = 59;
    expect(quote.visaCount).toBe(0);
    expect(quote.localTotal).toBe(28500);
    quote.visaType = 'work';
    expect(quote.localFees.filter(row => ['SSP特殊学习许可证', 'SSP-E CARD', 'ACR-I CARD 外国人身份证', '签证续签'].includes(row.item)).every(row => row.total === 0)).toBeTrue();
    expect(quote.localFees.find(row => row.item === 'ARP外国人登记')!.total).toBe(300);
  });

  it('keeps course/room billing independent and uses gaps for visa estimates', () => {
    const quote = calculator(); quote.plan.add('course');
    quote.plan.courses[1].startDate = '2026-11-01';
    expect(quote.plan.warning).toContain('日期不一致');
    expect(quote.plan.total('course')).toBe(1800);
    expect(quote.plan.total('room')).toBe(750);
    expect(quote.localFees.find(row => row.item === '水电费')!.quantity).toBe(1);
    expect(quote.localFees.find(row => row.item === '教材费')!.quantity).toBe(2);
    expect(quote.visaCount).toBe(2);
    quote.plan.courses[1].startDate = quote.plan.courses[0].startDate;
    expect(quote.error).toContain('重叠');
    quote.plan.courses[1].startDate = '2026-09-08';
    expect(quote.error).toContain('周日');
  });

  it('validates the guarantee minimum and keeps age conditions as course/room notes', () => {
    const quote = calculator(); quote.plan.courses[0].optionId = 'ielts-guarantee';
    expect(quote.error).toContain('12周');
    duration(quote, 12); expect(quote.error).toBe('');
    quote.plan.courses[0].optionId = 'lite-esl2-40-plus';
    expect(quote.error).toBe('');
    expect(quote.plan.options('course').find(row => row.id === 'lite-esl2-40-plus')!.details).toContain('40岁以上');
    expect(quote.plan.options('room').find(row => row.id === 'single-garden-view')!.details).toContain('50岁以上');
  });

  it('preserves confirmed catalog notes and missing rows after a partial API response', () => {
    TestBed.configureTestingModule({ providers: [
      { provide: SchoolService, useValue: { getSchools: () => of([]) } },
      { provide: ExchangeRateService, useValue: { getLatestCnyRates: () => EMPTY } },
    ] });
    const component = TestBed.runInInjectionContext(() => new BCebuSchoolComponent());
    component['applyPricingData']([{ name: 'Speed ESL', week: 4, price: 950, description: '旧课表' } as any], [], []);
    expect(component.courseFees.length).toBe(11);
    expect(component.courseFees[0].tuition).toBe(950);
    expect(component.courseFees[0].suitable).toBe(BCEBU_COURSES[0].suitable);
    expect(component.roomFees.length).toBe(7);
  });

  it('shares all webpage/image notes and adds both optional renminbi estimates', () => {
    const quote = calculator(); quote.pickup = 'weekday'; quote.reporter = true;
    const image = quote.imageData(7.2, 9, '备用汇率估算');
    expect(image.headingText).toBe("B'Cebu4周报价");
    expect(image.fullFeeDetails).toBeTrue();
    expect(image.localFeeTableLayout).toBe('web');
    expect(image.localFeeItems!.map(row => row.note)).toEqual(quote.localFees.map(row => row.note));
    expect(image.optionalFeeItems![0].cnyAmount).toBe('人民币预计约 167 元');
    expect(image.optionalFeeItems![1].cnyAmount).toBe('人民币预计约 333 元');
    expect(image.totalNote).toBe(quote.settlementNote);
    expect(JSON.stringify(image)).not.toMatch(/USD|PHP|CNY|实时/);
  });

  for (const [courseCount, roomCount] of [[1,1],[3,3],[4,4],[1,3],[3,1]]) {
    it(`renders complete ${courseCount}-course/${roomCount}-room PNGs through the footer`, async () => {
      const quote = calculator();
      for (let i = 1; i < courseCount; i++) quote.plan.add('course');
      for (let i = 1; i < roomCount; i++) quote.plan.add('room');
      quote.reporter = courseCount === 4;
      const image = quote.imageData(7.2, 9, '备用汇率估算：1美元≈7.2人民币，1人民币≈9比索');
      const renderer = new QuoteImageDownloadButtonComponent(); renderer.quote = image;
      const draw = spyOn(CanvasRenderingContext2D.prototype, 'fillText').and.callThrough();
      const blob = await renderer['createQuoteImageBlob'](1);
      const bitmap = await createImageBitmap(blob);
      expect(blob.size).toBeGreaterThan(50000); expect(bitmap.height).toBeGreaterThan(1700); bitmap.close();
      const text = draw.calls.allArgs().map(args => String(args[0])).join('').replace(/\s/g, '');
      for (const row of image.paymentItems) {
        expect(text).toContain((row.detailTitle ?? row.label).replace(/\s/g, ''));
        expect(text).toContain((row.note ?? '').replace(/\s/g, ''));
      }
      expect(image.paymentItems.filter(row => row.detailTitle).length).toBe(courseCount + roomCount);
      expect(text).toContain('一次性费用，老学员返校免费');
      if (quote.reporter) expect(text).toContain(quote.settlementNote.replace(/\s/g, ''));
      for (const fee of image.optionalFeeItems ?? []) expect(text).toContain(fee.cnyAmount!.replace(/\s/g, ''));
      expect(text).toContain('老学员专属优惠'); expect(text).toContain('报价说明');
      renderer.ngOnDestroy();
    }, 30000);
  }
});

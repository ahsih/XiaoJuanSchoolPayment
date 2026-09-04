import { TestBed } from '@angular/core/testing';
import { EMPTY } from 'rxjs';
import { ExchangeRateService } from '../../../../services/exchange-rate.service';
import { CgSpartaSchoolComponent } from './cg-sparta-school.component';
import { CgBaniladSchoolComponent } from '../cg-banilad-school/cg-banilad-school.component';
import { QuoteImageDownloadButtonComponent, QuoteImageLocalFeeItem } from '../../../components/quote-image-download-button.component';

describe('CG斯巴达校区 quote adjustments', () => {
  let component: CgSpartaSchoolComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: ExchangeRateService, useValue: { getLatestCnyRates: () => EMPTY } }],
    });
    component = TestBed.runInInjectionContext(() => new CgSpartaSchoolComponent());
  });

  it('uses the approved shared image layout for single and multiple periods', () => {
    for (let count = 1; count <= 4; count++) {
      if (count > 1) { component.addSelection('course'); component.addSelection('room'); }
      const quote = component.quoteImageData;
      expect(quote.headingText).toBe(`CG斯巴达校区${count * 4}周报价`);
      expect(quote.headingText).toBe(component.quoteHeading);
      expect(quote.subtitle).toBe('');
      expect(quote.layout).toBe('cia-detailed');
      expect(quote.paymentSectionTitle).toBe('学校费用明细');
      expect(quote.localFeeTitle).toBe('到校后学杂费明细');
      expect(quote.totalCny).toBe(`人民币预计金额：${component.quoteCnyText}`);
      expect(quote.paymentItems.filter(item => item.detailTitle).length).toBe(count * 2);
      expect(quote.paymentItems.filter(item => item.label === '注册费').length).toBe(1);
      expect(quote.paymentItems[1].label).toBe(count === 1 ? '课程名称' : '课程名称1');
      expect(quote.importantNotes!.join('')).not.toContain('85%');
      expect(component.applicablePriceNote).toBe('');
    }
  });

  it('orders image periods without reordering the editable lists', () => {
    component.addSelection('course'); component.addSelection('room');
    component.courseSelections.reverse(); component.roomSelections.reverse();
    const firstId = component.courseSelections[0].id;
    const rows = component.quoteImageData.paymentItems.filter(item => item.detailTitle);
    expect(rows.map(row => row.label)).toEqual(['课程名称1', '课程名称2', '住宿名称1', '住宿名称2']);
    expect(rows[0].detailSubtitle).toContain('2026/09/06');
    expect(rows[2].detailSubtitle).toContain('2026/09/06');
    expect(component.courseSelections[0].id).toBe(firstId);
  });

  it('keeps the default off-season four-week quote and all local-fee rows', () => {
    expect(component.summerSurcharge).toBe(0);
    expect(component.offSeasonDiscount).toBe(150);
    expect(component.quoteUsd).toBe(1255);
    expect(component.localFeesTotal).toBe(18800);
    expect(component.quoteImageData.paymentItems?.some(item => item.label === '暑假附加费')).toBeFalse();
    expect(component.quoteImageData.paymentItems?.some(item => item.label === '长期优惠')).toBeFalse();
    expect(component.quoteImageData.paymentItems?.find(item => item.icon === '宿')?.detailTitle).toBe('斯巴达 4人房');
    expect(component.quoteImageData.paymentItems?.find(item => item.label === '思达折扣')?.note).toBe('课程费和住宿费享9折');
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
    expect(component.quoteImageData.paymentItems?.find(item => item.label === '思达折扣')?.note).toBe('课程费和住宿费享9折');
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

  it('uses CG斯巴达校区 in exported school names and Chinese course and room labels', () => {
    expect(component.quoteImageData.schoolCode).toBe('CG斯巴达校区');
    expect(component.quoteImageData.fileName).toMatch(/^CG斯巴达校区4周报价-/);
    expect(component.selectedCourse.name).toBe('斯巴达课程（Sparta Course）');
    expect(component.courseOptions.find(course => course.id === 'premier-sparta')?.name).toBe('高阶斯巴达（Premier Sparta）');
    expect(component.selectedRoom.name).toBe('斯巴达 4人房');
    for (const course of component.courseOptions) {
      component.selectedCourseId = course.id;
      for (const room of component.roomOptions) {
        component.selectedRoomId = room.id;
        const quote = component.quoteImageData;
        const visible = [quote.schoolCode, quote.title];
        expect(JSON.stringify(visible)).withContext(`${course.id}/${room.id}`).not.toMatch(/sparta/i);
        expect(quote.paymentItems.find(row => row.icon === '课')?.detailTitle).toBe(course.name);
        expect(quote.paymentItems.find(row => row.icon === '宿')?.detailTitle).toBe(room.name);
      }
    }
    expect(JSON.stringify([component.quickInfo, component.basicInfo, component.highlights.map(({ title, text }) => ({ title, text })), component.faqs])).not.toMatch(/sparta/i);
  });

  it('keeps every local fee and note identical to Banilad for all supported weeks', () => {
    const banilad = TestBed.runInInjectionContext(() => new CgBaniladSchoolComponent());
    for (const weeks of banilad.weekOptions) {
      component.selectedWeeks = banilad.selectedWeeks = weeks;
      for (const pickup of [false, true]) {
        component.includeAirportPickup = banilad.includeAirportPickup = pickup;
        expect(component.localFees).withContext(`${weeks} weeks, pickup ${pickup}`).toEqual(banilad.localFees);
        expect(component.localFeesTotal).toBe(banilad.localFeesTotal);
        expect(component.quoteImageData.localFeeNote).toBe(component.localFeeEstimateNote);
        expect(component.quoteImageData.localFeeItems).toEqual(banilad.quoteImageData.localFeeItems);
        expect(component.quoteImageData.optionalFeeItems).toEqual(banilad.quoteImageData.optionalFeeItems);
      }
    }
  });

  it('uses one four-week fee period for three or four weeks, not the eight-week example', () => {
    for (const [weeks, periods] of [[3, 1], [4, 1], [8, 2], [12, 3], [16, 4], [20, 5], [24, 6]] as const) {
      component.selectedWeeks = weeks;
      expect(component.localFeePeriods).toBe(periods);
      for (const [item, unit] of [['维护管理费', 2000], ['电费', 2000], ['水费', 500]] as const) {
        const fee = component.localFees.find(row => row.item === item)!;
        expect(fee.quantity).toBe(periods);
        expect(fee.total).toBe(periods * unit);
        expect(fee.amount).toContain('/ 4周');
      }
      expect(component.localFees.find(row => row.item === '书本教材费')?.total).toBe(2000);
    }
    component.selectedWeeks = 3;
    expect(component.localFeeEstimateNote).toContain('3周管理费、电费和水费按4周预估。');
  });

  it('uses 30-day extensions after a 59-day visa and the public cumulative fee tiers', () => {
    for (const [weeks, count, visaFee, total] of [[3, 0, 0, 18800], [4, 0, 0, 18800], [8, 0, 0, 23300], [12, 1, 5160, 37760], [16, 2, 11550, 48650], [20, 3, 16010, 57610], [24, 4, 20470, 66570]] as const) {
      component.selectedWeeks = weeks;
      const visa = component.localFees.find(row => row.item === '旅游签证续签')!;
      expect(component.visaExtensionCount).toBe(count);
      expect(component.visaExtensionFee).toBe(visaFee);
      expect(visa.quantity).toBe(count);
      expect(visa.total).toBe(visaFee);
      expect(visa.amount.includes('第2次')).toBe(count >= 2);
      expect(visa.amount.includes('其余')).toBe(count >= 3);
      expect(visa.note.includes('本次无需续签')).toBe(count === 0);
      expect(visa.note).toContain('按持59天签证');
      expect(visa.note).toContain('若持30天签证，需另行核算');
      expect(visa.note).not.toContain('12/16/20/24');
      expect(component.localFeesTotal).withContext(`${weeks} weeks`).toBe(total);
      expect(component.quoteImageData.localFeeAmount).toBe(component.formatPhp(total));
      expect(component.localFees.find(row => row.item === 'ACR-I CARD 外国人身份证')?.quantity).toBe(weeks > 8 ? 1 : 0);
    }
  });

  it('includes the transfer-proof reminder and keeps all zero fees in the image', () => {
    const quote = component.quoteImageData;
    expect(quote.fullFeeDetails).toBeTrue();
    expect(quote.localFeeTableLayout).toBe('web');
    expect(quote.localFeeItems?.length).toBe(9);
    expect(quote.optionalFeeItems?.length).toBe(2);
    expect(quote.localFeeItems?.find(row => row.label === 'SSP E-CARD')?.note)
      .toBe('入学时与SSP同时办理，本次按一次预估；换学校需要携带证明，否则需要重新办理');
    expect(quote.optionalFeeItems?.[0].amount).toBe('1,200 比索');
    expect(quote.optionalFeeItems?.[1].amount).toBe('1,000 比索');
    expect(JSON.stringify(quote)).not.toMatch(/\b(?:USD|PHP|CNY)\b/);
  });

  it('passes exact webpage notes, amounts and the disclaimer to the image for every duration', () => {
    for (const weeks of component.weekOptions) {
      component.selectedWeeks = weeks;
      const quote = component.quoteImageData;
      expect(quote.localFeeNote).toBe(component.localFeeEstimateNote);
      expect(quote.localFeeItems).toEqual(component.includedLocalFees.map(fee => ({
        label: fee.item, unit: fee.amount, quantity: String(fee.quantity),
        amount: component.formatPhp(fee.total), note: fee.note,
      })));
      expect(quote.optionalFeeItems).toEqual(component.excludedLocalFees.map(fee => ({
        label: fee.item,
        amount: fee.item.includes('接机') ? '1,200 比索' : component.formatPhp(fee.total),
        cnyAmount: `约人民币 ${Math.round((fee.item.includes('接机') ? 1200 : fee.total) / component.phpPerCny).toLocaleString('zh-CN')} 元`,
        note: fee.item.includes('接机') ? '可选，也可自行前往。' : '预估1,000比索，具体以学校为准；无损坏及无欠费时可退。',
      })));
    }
  });

  it('lists optional pickup separately without increasing either main total', () => {
    const localTotal = component.localFeesTotal;
    const schoolTotal = component.quoteUsd;
    component.includeAirportPickup = true;
    expect(component.excludedLocalFees[0].quantity).toBe(1);
    expect(component.quoteImageData.optionalFeeItems?.[0].amount).toBe('1,200 比索');
    expect(component.localFeesTotal).toBe(localTotal);
    expect(component.quoteUsd).toBe(schoolTotal);
  });

  it('renders the disclaimer above the five-column fee table without truncating notes', async () => {
    component.selectedWeeks = 3;
    const renderer = new QuoteImageDownloadButtonComponent();
    renderer.quote = component.quoteImageData;
    const renderApi = renderer as unknown as {
      createQuoteImageBlob(scale: number): Promise<Blob>;
      detailedLocalNote(row: QuoteImageLocalFeeItem): string;
      drawWrappedText(...args: unknown[]): void;
    };
    const wrapped = spyOn(renderApi, 'drawWrappedText').and.callThrough();
    const painted = spyOn(CanvasRenderingContext2D.prototype, 'fillText').and.callThrough();
    const blob = await renderApi.createQuoteImageBlob(1);
    expect(blob.type).toBe('image/png');
    expect(blob.size).toBeGreaterThan(10000);
    expect(painted.calls.allArgs().some(args => args[0] === 'CG斯巴达校区3周报价')).toBeTrue();
    expect(painted.calls.allArgs().map(args => args[0]).join('').replace(/\s/g, '')).toContain('SpartaCourse');
    const disclaimerCall = wrapped.calls.allArgs().find(args => args[1] === component.localFeeEstimateNote)!;
    const header = painted.calls.allArgs().find(args => args[0] === '计费参考')!;
    expect(disclaimerCall).toBeDefined();
    expect(Number(disclaimerCall[3])).toBeLessThan(header[2]);
    for (const text of ['费用明细', '计费参考', '数量', '预估小计', '备注']) {
      expect(painted.calls.allArgs().some(args => args[0] === text)).toBeTrue();
    }
    const paintedNotes = painted.calls.allArgs().filter(args => args[1] === 566).map(args => args[0]).join('');
    for (const fee of renderer.quote.localFeeItems ?? []) {
      expect(renderApi.detailedLocalNote(fee)).toBe(fee.note);
      expect(paintedNotes).toContain(fee.note);
    }
  });

  it('supports two courses and one room covering the whole stay without duplicate fixed fees', () => {
    component.addSelection('course');
    component.updateSelection('course', component.courseSelections[1].id, { optionId: 'ielts-basic' });
    component.updateSelection('room', component.roomSelections[0].id, { weeks: 8 });
    expect(component.totalWeeks).toBe(8);
    expect(component.roomTotalWeeks).toBe(8);
    expect(component.canExportQuote).toBeTrue();
    expect(component.tuitionForSelectedWeeks).toBe(1650);
    expect(component.roomFeeForSelectedWeeks).toBe(1300);
    expect(component.quoteUsd).toBe(2455);
    expect(component.localFeesTotal).toBe(23300);
    expect(component.quoteImageData.paymentItems.filter(row => row.label === '注册费').length).toBe(1);
    const items = component.quoteImageData.paymentItems.filter(row => row.detailTitle);
    expect(items.map(row => row.label)).toEqual(['课程名称1', '课程名称2', '住宿名称']);
    expect(items.map(row => row.detailSubtitle?.split(' · ')[1])).toEqual(['4周', '4周', '8周']);
    expect(items.map(row => row.amount)).toEqual(['800 美元', '850 美元', '1,300 美元']);
    expect(component.quoteImageData.importantNotes?.length).toBe(1);
  });

  it('supports one course and two room types independently', () => {
    component.updateSelection('course', component.courseSelections[0].id, { weeks: 8 });
    component.addSelection('room');
    component.updateSelection('room', component.roomSelections[1].id, { optionId: 'twin' });
    expect(component.tuitionForSelectedWeeks).toBe(1600);
    expect(component.roomFeeForSelectedWeeks).toBe(1400);
    expect(component.quoteUsd).toBe(2500);
    expect(component.canExportQuote).toBeTrue();
    expect(component.quoteImageData.paymentItems.filter(row => row.detailTitle).map(row => row.label)).toEqual(['课程名称', '住宿名称1', '住宿名称2']);
  });

  it('allows independent accommodation dates and flags uncovered periods', () => {
    component.addSelection('course');
    expect(component.durationMismatch).toBeTrue();
    expect(component.dateCoverageMismatch).toBeTrue();
    expect(component.canExportQuote).toBeTrue();
    component.addSelection('room');
    expect(component.canExportQuote).toBeTrue();
    component.removeSelection('room', component.roomSelections[1].id);
    expect(component.canExportQuote).toBeTrue();
    expect(component.quoteImageData.importantNotes?.join('')).toContain('课程与住宿日期不一致');
  });

  it('keeps every generated start on Sunday and ending on Saturday across years and deletion', () => {
    component.selectedStartDate = '2026-12-20';
    component.addSelection('course');
    component.addSelection('course');
    const ids = component.courseSelections.map(row => row.id);
    expect(component.courseQuoteRows[0].dateRange).toBe('2026/12/20–2027/01/16');
    expect(component.courseQuoteRows[1].dateRange).toBe('2027/01/17–2027/02/13');
    component.updateSelection('course', ids[0], { weeks: 3 });
    expect(component.courseQuoteRows[1].dateRange).toBe('2027/01/17–2027/02/13');
    component.removeSelection('course', ids[1]);
    expect(component.courseSelections.map(row => row.id)).toEqual([ids[0], ids[2]]);
    expect(component.courseQuoteRows[1].dateRange).toBe('2027/02/14–2027/03/13');
    for (const row of [...component.courseQuoteRows, ...component.roomQuoteRows]) {
      expect(new Date(row.startDate.replace(/\//g, '-') + 'T00:00:00Z').getUTCDay()).toBe(0);
      expect(new Date(row.endDate.replace(/\//g, '-') + 'T00:00:00Z').getUTCDay()).toBe(6);
    }
    component.removeSelection('course', ids[0]);
    component.removeSelection('course', ids[2]);
    expect(component.courseSelections.length).toBe(1);
  });

  it('disables all non-Sundays and rejects invalid or manually supplied non-Sunday dates', () => {
    for (let day = 6; day <= 12; day++) expect(component.sundayFilter(new Date(2026, 8, day))).toBe(day === 6);
    expect(component.sundayFilter(null)).toBeFalse();
    expect(component.sundayFilter(new Date('invalid'))).toBeFalse();
    component.setRowStartDate('course', component.courseSelections[0].id, new Date(2026, 8, 7));
    expect(component.selectedStartDate).toBe('2026-09-06');
    expect(component.dateErrors.get(component.courseSelections[0].id)).toContain('只能选择周日');
    component.setRowStartDate('course', component.courseSelections[0].id, new Date(2026, 8, 13));
    expect(component.selectedStartDate).toBe('2026-09-13');
    expect(component.dateErrors.size).toBe(0);
    component.selectedStartDate = '2026-09-14';
    expect(component.canExportQuote).toBeFalse();
    component.selectedStartDate = '2026-02-30';
    expect(component.validStartDate).toBeFalse();
    expect(component.canExportQuote).toBeFalse();
  });

  it('keeps date and option bindings stable across repeated change detection', () => {
    const date = component.rowStartDate(component.courseSelections[0]);
    expect(component.rowStartDate(component.courseSelections[0])).toBe(date);
    expect(component.quoteLists[0].options).toBe(component.quoteLists[0].options);
    expect(component.quoteLists[1].options).toBe(component.quoteLists[1].options);
    component.setRowStartDate('course', component.courseSelections[0].id, new Date(2026, 8, 13));
    const newDate = component.rowStartDate(component.courseSelections[0]);
    expect(newDate).not.toBe(date);
    expect(newDate?.getDay()).toBe(0);
    expect(component.rowStartDate(component.courseSelections[0])).toBe(newDate);
  });

  it('uses individual pricing with total weeks for visas, local fees and promotions', () => {
    component.selectedWeeks = 3;
    component.addSelection('course');
    component.addSelection('room');
    expect(component.totalWeeks).toBe(7);
    expect(component.selectedPackageFee).toBe(1450 * 1.85);
    expect(component.localFeePeriods).toBe(2);
    component.updateSelection('course', component.courseSelections[1].id, { weeks: 12 });
    component.updateSelection('room', component.roomSelections[1].id, { weeks: 12 });
    expect(component.totalWeeks).toBe(15);
    expect(component.longStayDiscount).toBe(50);
    expect(component.visaExtensionCount).toBe(2);
    expect(component.visaExtensionFee).toBe(11550);
    expect(component.localFeePeriods).toBe(4);
    component.selectedWeeks = 4;
    expect(component.totalWeeks).toBe(16);
  });

  it('limits each independent list to 52 weeks and rejects unknown choices', () => {
    component.selectedWeeks = 1;
    for (const kind of ['course', 'room'] as const) {
      for (let index = 1; index < 52; index++) {
        component.addSelection(kind);
        const rows = kind === 'course' ? component.courseSelections : component.roomSelections;
        component.updateSelection(kind, rows[index].id, { weeks: 1 });
      }
      expect(component.canAddSelection(kind)).toBeFalse();
      component.addSelection(kind);
    }
    expect(component.totalWeeks).toBe(52);
    expect(component.roomTotalWeeks).toBe(52);
    expect(component.courseSelections.length).toBe(52);
    component.updateSelection('course', component.courseSelections[0].id, { weeks: 24 });
    component.updateSelection('course', component.courseSelections[0].id, { optionId: 'invalid' });
    expect(component.selectedWeeks).toBe(1);
    expect(component.selectedCourseId).toBe('sparta');
    expect(component.quoteImageData.paymentItems.filter(row => row.detailTitle).length).toBe(104);
  });

  it('keeps short-stay money precision identical on the webpage and image', () => {
    component.selectedWeeks = 3;
    expect(component.quoteUsdText).toBe(component.quoteImageData.totalUsd);
    expect(component.formatUsd(component.sidaDiscountAmount)).toBe('123.25');
    component.selectedCourseId = 'ielts-intensive';
    expect(component.courseQuoteRows[0].warning).toContain('12周起报');
  });

  it('offers every whole week from 1 to 52 with short-stay percentages and safe numeric totals', () => {
    expect(component.weekOptions).toEqual(Array.from({ length: 52 }, (_, index) => index + 1));
    for (const weeks of component.weekOptions) {
      component.selectedWeeks = weeks;
      const multiplier = weeks === 1 ? .4 : weeks === 2 ? .6 : weeks === 3 ? .85 : weeks / 4;
      expect(component.tuitionForSelectedWeeks).withContext(`${weeks} weeks`).toBe(800 * multiplier);
      expect(component.roomFeeForSelectedWeeks).toBe(650 * multiplier);
      expect(Number.isFinite(component.quoteUsd)).toBeTrue();
      expect(component.canExportQuote).toBeTrue();
      expect(component.courseQuoteRows[0].startDate).toBe('2026-09-06');
      expect(new Date(component.courseQuoteRows[0].endDate.replace(/\//g, '-') + 'T00:00:00Z').getUTCDay()).toBe(6);
      expect(component.quoteImageData.totalUsd).toBe(component.quoteUsdText);
    }
    component.selectedWeeks = 53;
    expect(component.selectedWeeks).toBe(52);
    for (const weeks of [0, -1, 1.5, NaN]) {
      component.updateSelection('course', component.courseSelections[0].id, { weeks });
      expect(component.selectedWeeks).toBe(52);
    }
  });

  it('extends later visas at 4460 pesos per 30 days without reverting to zero', () => {
    for (const [weeks, count, fee] of [[29, 5, 24930], [30, 6, 29390], [52, 11, 51690]]) {
      component.selectedWeeks = weeks;
      expect(component.visaExtensionCount).toBe(count);
      expect(component.visaExtensionFee).toBe(fee);
      const visa = component.quoteImageData.localFeeItems!.find(item => item.label === '旅游签证续签')!;
      expect(visa.amount).toBe(component.formatPhp(fee));
      expect(visa.note.includes('第6次起沿用第5次费用估算')).toBe(count > 5);
    }
    expect(component.localFeesTotal).toBe(129290);
    expect(component.longStayDiscount).toBe(200);
    expect(component.courseQuoteRows[0].endDate).toBe('2027/09/04');
  });

  it('changes only the chosen row date and warns about overlaps and spans over a year', () => {
    component.addSelection('course');
    component.addSelection('room');
    const second = component.courseSelections[1];
    component.setRowStartDate('course', second.id, new Date(2026, 10, 1));
    expect(component.courseQuoteRows[1].dateRange).toBe('2026/11/01–2026/11/28');
    expect(component.courseSelections[0].startDate).toBe('2026-09-06');
    expect(component.roomSelections[1].startDate).toBe('2026-10-04');
    expect(component.stayWeeks).toBe(12);
    expect(component.visaExtensionFee).toBe(5160);
    expect(component.localFeeEstimateNote).toContain('12周停留跨度（含间隔）');
    expect(component.quoteImageData.paymentItems.find(row => row.label === '课程名称2')?.detailSubtitle).toBe('2026/11/01–2026/11/28 · 4周');
    component.setRowStartDate('course', second.id, new Date(2026, 8, 13));
    expect(component.planError).toContain('日期重叠');
    expect(component.canExportQuote).toBeFalse();
    component.setRowStartDate('course', second.id, new Date(2027, 8, 5));
    expect(component.planError).toContain('不能超过52周');
    expect(component.canExportQuote).toBeFalse();
  });

  it('uses actual row dates for summer fees and avoids charging the same stay week twice', () => {
    component.selectedStartDate = '2026-06-07';
    component.selectedWeeks = 1;
    component.addSelection('course');
    const second = component.courseSelections[1];
    component.updateSelection('course', second.id, { weeks: 1 });
    component.setRowStartDate('course', second.id, new Date(2026, 6, 5));
    expect(component.summerWeeks).toBe(1);
    component.addSelection('room');
    const room = component.roomSelections[1];
    component.updateSelection('room', room.id, { weeks: 1 });
    component.setRowStartDate('room', room.id, new Date(2026, 6, 5));
    expect(component.summerWeeks).toBe(1);
    expect(component.summerSurcharge).toBe(40);
    expect(component.offSeasonDiscount).toBe(0);
  });

  it('exports bilingual names, dates and the complete course schedule without repeating other descriptions', () => {
    for (const course of component.courseOptions) {
      component.selectedCourseId = course.id;
      expect(course.name).toMatch(/[\u4e00-\u9fff]+.*（[A-Za-z ]+）/);
      expect(component.courseQuoteRows[0].lessonMain).toContain('一对一');
      expect(component.courseQuoteRows[0].lessonExtra).toContain('自习');
      const item = component.quoteImageData.paymentItems.find(item => item.icon === '课')!;
      expect(item.detailTitle).toBe(course.name);
      expect(item.detailSubtitle).toBe('2026/09/06–2026/10/03 · 4周');
      expect(item.note?.startsWith(course.lessons)).toBeTrue();
      expect(item.note).toBe(`${course.lessons}${component.courseQuoteRows[0].warning ? `；${component.courseQuoteRows[0].warning}` : ''}`);
      expect(item.note).toContain(component.courseQuoteRows[0].lessonExtra.replace(/ · /g, ' + '));
    }
  });

  it('renders all independent course and room rows without clipping the fee sections', async () => {
    component.selectedWeeks = 3;
    for (const kind of ['course', 'room'] as const) {
      for (let index = 1; index < 8; index++) {
        component.addSelection(kind);
        const rows = kind === 'course' ? component.courseSelections : component.roomSelections;
        component.updateSelection(kind, rows[index].id, { weeks: 3, optionId: kind === 'course' ? 'ielts-guarantee' : 'single' });
      }
    }
    const renderer = new QuoteImageDownloadButtonComponent();
    renderer.quote = component.quoteImageData;
    const painted = spyOn(CanvasRenderingContext2D.prototype, 'fillText').and.callThrough();
    const blob = await (renderer as unknown as { createQuoteImageBlob(scale: number): Promise<Blob> }).createQuoteImageBlob(1);
    const text = painted.calls.allArgs().map(args => args[0]).join('');
    expect(blob.type).toBe('image/png');
    expect(text).toContain('CG斯巴达校区24周报价');
    expect(text).not.toContain('课程与住宿安排');
    expect(text).not.toContain('见上表');
    for (const row of renderer.quote.paymentItems.filter(item => item.detailTitle)) {
      expect(painted.calls.allArgs().filter(args => args[0] === row.label).length).toBe(1);
      expect(text).toContain(row.detailSubtitle!);
    }
    expect(text).toContain('课程名称8');
    expect(text).toContain('住宿名称8');
    expect(text).toContain('到校后学杂费明细');
    expect(text).toContain('报价说明');
    expect(text).not.toMatch(/\b(?:USD|PHP|CNY)\b/);
  });

  it('keeps every fee and applicable adjustment after merging more than seven payment rows', async () => {
    component.selectedStartDate = '2026-08-30';
    component.addSelection('course');
    component.addSelection('course');
    component.addSelection('room');
    component.addSelection('room');
    const quote = component.quoteImageData;
    expect(quote.paymentItems.length).toBe(11);
    expect(quote.paymentItems.map(row => row.label)).toEqual([
      '注册费', '课程名称1', '课程名称2', '课程名称3', '住宿名称1', '住宿名称2', '住宿名称3',
      '思达折扣', '淡季优惠', '长期优惠', '暑假附加费',
    ]);
    expect(quote.totalUsd).toBe('3,555 美元');
    expect(JSON.stringify(quote)).not.toContain('见上表');
    expect('studyPlanItems' in quote).toBeFalse();
    const renderer = new QuoteImageDownloadButtonComponent();
    renderer.quote = quote;
    const painted = spyOn(CanvasRenderingContext2D.prototype, 'fillText').and.callThrough();
    const blob = await (renderer as unknown as { createQuoteImageBlob(scale: number): Promise<Blob> }).createQuoteImageBlob(1);
    const bitmap = await createImageBitmap(blob);
    const calls = painted.calls.allArgs();
    const schoolTitleY = calls.find(args => args[0] === quote.paymentSectionTitle)![2];
    const totalY = calls.find(args => args[0] === quote.totalUsd)![2];
    const localTitleY = calls.find(args => args[0] === quote.localFeeTitle)![2];
    for (const row of quote.paymentItems) {
      const labels = calls.filter(args => args[0] === row.label);
      expect(labels.length).withContext(row.label).toBe(1);
      expect(labels[0][2]).toBeGreaterThan(schoolTitleY);
      expect(labels[0][2]).toBeLessThan(totalY);
    }
    // Local section uses a translated canvas origin; the allocated bitmap must fit all sections.
    expect(localTitleY).toBeGreaterThan(700);
    expect(bitmap.height).toBeGreaterThan(1764);
    bitmap.close();
  });

  it('shows only relevant pricing caveats while leaving detailed local-fee notes unchanged', () => {
    expect(component.quoteImageData.importantNotes?.length).toBe(1);
    expect(component.quoteImageData.importantNotes?.join('')).not.toContain('40%');
    component.selectedWeeks = 3;
    let notes = component.quoteImageData.importantNotes!.join('');
    expect(notes).toContain('3周课程或住宿按对应4周价格的85%');
    expect(notes).not.toMatch(/40%|60%/);
    component.selectedWeeks = 5;
    notes = component.quoteImageData.importantNotes!.join('');
    expect(notes).toContain('非4周整期的费用按周折算');
    component.selectedWeeks = 52;
    notes = component.quoteImageData.importantNotes!.join('');
    expect(notes).toContain('许可续办');
    expect(component.quoteImageData.localFeeNote).toContain('SSP等许可');
    expect(notes).toContain('4,460');
    expect(component.quoteImageData.localFeeNote).toBe(component.localFeeEstimateNote);
  });

  it('calculates mixed group plans per student and charges registration only for new students', () => {
    component.setQuoteMode('group');
    component.studentCount = 2;
    const [adult, minor] = component.activeStudents;
    adult.quotePlan.courses[0].startDate = '2027-01-03';
    adult.quotePlan.rooms[0].startDate = '2027-01-03';
    minor.selectedAgeGroup = 'minor';
    minor.returningStudent = true;
    minor.quotePlan.courses[0].optionId = 'ielts-basic';
    expect(component.payableRegistrationFee).toBe(100);
    expect(component.schoolPaymentItems[0].amount).toBe('100 美元');
    expect(component.quoteUsd).toBeCloseTo(adult.quoteUsd + minor.quoteUsd);
    expect(component.quoteImageData.totalUsd).toBe(component.quoteUsdText);
    expect(component.quoteImageData.paymentItems.filter(row => row.icon === '课').map(row => row.label)).toEqual([
      '学生1 · 课程名称', '学生2 · 课程名称',
    ]);
    expect(component.quoteImageData.paymentItems.filter(row => row.label === '思达折扣').length).toBe(1);
    expect(component.quoteImageData.paymentItems.find(row => row.label === '思达折扣')?.note).toContain('2人适用');
  });

  it('applies visa rules per person, including ARP for first tourist renewal and long-term visas', () => {
    component.setQuoteMode('group');
    component.studentCount = 2;
    const [tourist, longTerm] = component.activeStudents;
    tourist.visaType = 'tourist30';
    tourist.quotePlan.courses[0].weeks = 8;
    tourist.quotePlan.rooms[0].weeks = 8;
    longTerm.visaType = 'srrv';
    for (const student of [tourist, longTerm]) {
      expect(student.localFees.find(fee => fee.item === 'ARP外国人登记')?.total).toBe(300);
    }
    for (const label of ['SSP特殊学习许可证', 'SSP E-CARD', 'ACR-I CARD 外国人身份证', '旅游签证续签']) {
      const fee = longTerm.localFees.find(row => row.item === label)!;
      expect(fee.total).withContext(label).toBe(0);
      expect(fee.note).withContext(label).toContain('顾问');
      expect(fee.note).withContext(label).toContain('学校确认');
    }
    expect(component.localFeesTotal).toBe(component.activeStudents.flatMap(student => student.localFees).filter(fee => !fee.excluded).reduce((sum, fee) => sum + fee.total, 0));
  });

  it('keeps age informational and charges the selected course price', () => {
    const student = component.activeStudents[0];
    student.selectedAgeGroup = 'minor';
    student.quotePlan.courses[0].optionId = 'sparta';
    expect(student.tuition).toBe(800);
    student.quotePlan.courses[0].optionId = 'ielts-basic';
    expect(student.tuition).toBe(850);
  });

  it('merges identical promotions while preserving partial student eligibility', () => {
    component.setQuoteMode('group');
    component.studentCount = 2;
    const [first, second] = component.activeStudents;
    first.quotePlan.courses[0].startDate = '2027-01-03';
    first.quotePlan.rooms[0].startDate = '2027-01-03';
    second.quotePlan.courses[0].startDate = '2026-09-06';
    second.quotePlan.rooms[0].startDate = '2026-09-06';
    const lines = component.quoteImageData.paymentItems;
    expect(lines.filter(row => row.label === '思达折扣').length).toBe(1);
    expect(lines.find(row => row.label === '学生2 · 淡季优惠')?.amount).toBe('− 150 美元');
    expect(lines.some(row => row.label === '学生1 · 淡季优惠')).toBeFalse();
  });

  it('keeps the 52-week model and renders one to four rows with the shared image template', () => {
    const plan = component.activeStudents[0].quotePlan;
    const starts = ['2026-09-06', '2026-10-04', '2026-11-01', '2026-11-29'];
    for (let count = 1; count <= 4; count++) {
      while (plan.courses.length < count) plan.add('course');
      while (plan.rooms.length < count) plan.add('room');
      plan.courses.forEach((row, index) => row.startDate = starts[index]);
      plan.rooms.forEach((row, index) => row.startDate = starts[index]);
      expect(component.quoteImageData.paymentItems.filter(row => row.icon === '课').length).toBe(count);
      expect(component.quoteImageData.paymentItems.filter(row => row.icon === '宿').length).toBe(count);
      expect(component.quoteError).toBe('');
    }
    plan.courses.splice(1); plan.rooms.splice(1);
    plan.courses[0].weeks = 52; plan.rooms[0].weeks = 52;
    expect(plan.maxWeeks).toBe(52);
    expect(component.longStayDiscount).toBe(200);
    expect(component.quoteImageData.importantNotes?.join('')).toContain('超过24周');
    expect(component.quoteImageData.importantNotes?.join('')).toContain('4,460比索');
  });
});

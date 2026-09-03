import { TestBed } from '@angular/core/testing';
import { EMPTY, of } from 'rxjs';
import { ExchangeRateService } from '../../../../services/exchange-rate.service';
import { SchoolService } from '../../../../services/school.service';
import { QuoteImageDownloadButtonComponent } from '../../../components/quote-image-download-button.component';
import { EvSchoolDetailComponent } from './ev-school-detail.component';

describe('EV accommodation management fees', () => {
  let component: EvSchoolDetailComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [
      { provide: SchoolService, useValue: { getSchools: () => of([]) } },
      { provide: ExchangeRateService, useValue: { getLatestCnyRates: () => EMPTY } },
    ] });
    component = TestBed.runInInjectionContext(() => new EvSchoolDetailComponent());
  });

  it('always displays both management rows, charging only the applicable room type', () => {
    for (const room of component.roomFees) {
      component.selectedRoomId = room.id;
      for (const weeks of component.weekOptions) {
        component.selectedWeeks = weeks;
        const periods = Math.ceil(weeks / 4);
        const offCampus = room.id.startsWith('off-campus');
        const onCampusFee = component.includedLocalFees.find(fee => fee.item === '校内管理费')!;
        const offCampusFee = component.includedLocalFees.find(fee => fee.item === '校外宿舍管理费')!;
        expect(onCampusFee.quantity).toBe(offCampus ? 0 : periods);
        expect(onCampusFee.total).toBe(offCampus ? 0 : 2000 * periods);
        expect(offCampusFee.quantity).toBe(offCampus ? periods : 0);
        expect(offCampusFee.total).toBe(offCampus ? 4000 * periods : 0);
        expect(offCampusFee.amount).toBe('4,000 比索 / 4周');
        expect(component.includedLocalFees.length).toBe(10);
        const otherFees = component.includedLocalFees.filter(fee => !fee.item.includes('管理费'));
        expect(component.localFeesTotal).toBe(otherFees.reduce((sum, fee) => sum + fee.total, 0) + (offCampus ? 4000 : 2000) * periods);
      }
    }
  });

  it('updates totals when switching back from off-campus without double charging', () => {
    const onCampusTotal = component.localFeesTotal;
    expect(onCampusTotal).toBe(20000);
    component.selectedRoomId = 'off-campus-single';
    expect(component.localFeesTotal).toBe(22000);
    expect(component.quoteImageData.localFeeAmount).toBe('22,000 比索');
    component.selectedRoomId = 'off-campus-double';
    expect(component.localFeesTotal).toBe(22000);
    component.selectedRoomId = 'quad-bunk';
    expect(component.localFeesTotal).toBe(onCampusTotal);
    expect(component.quoteImageData.localFeeAmount).toBe('20,000 比索');
  });

  it('keeps every fee amount, quantity and note in sync with the generated quote', () => {
    for (const room of component.roomFees) {
      component.selectedRoomId = room.id;
      const quote = component.quoteImageData;
      expect(quote.fullFeeDetails).toBeTrue();
      expect(quote.localFeeNote).toBe(component.localFeeEstimateNote);
      expect(quote.localFeeItems).toEqual(component.includedLocalFees.map(fee => ({
        label: fee.item, unit: fee.amount, quantity: String(fee.quantity), amount: component.formatPhp(fee.total), note: fee.note,
      })));
      expect(JSON.stringify(quote)).not.toMatch(/\bPHP\b|\bUSD\b|\bCNY\b/);
    }
  });

  it('renders all ten fees including the zero-amount off-campus row without clipping', async () => {
    const renderer = new QuoteImageDownloadButtonComponent();
    const drawnText = spyOn(CanvasRenderingContext2D.prototype, 'fillText').and.callThrough();
    for (const roomId of ['quad-bunk', 'off-campus-single']) {
      component.selectedRoomId = roomId;
      renderer.quote = component.quoteImageData;
      drawnText.calls.reset();
      const blob = await renderer['createQuoteImageBlob'](1);
      const text = drawnText.calls.allArgs().map(args => args[0]).join('').replace(/\s/g, '');
      expect(text).toContain('校外宿舍管理费');
      expect(text).toContain('校内管理费');
      expect(text).toContain('学生证');
      expect(text).toContain(component.formatPhp(component.localFeesTotal).replace(/\s/g, ''));
      expect(text).toContain('4,000比索/4周');
      expect(blob.type).toBe('image/png');
      const layout = renderer['measureFullFeeLayout'](document.createElement('canvas').getContext('2d')!);
      expect(layout.localHeights.length).toBe(10);
      expect(820 + layout.localHeights.reduce((sum, value) => sum + value, 0) + 70 + layout.optionalHeights.reduce((sum, value) => sum + value, 0))
        .toBeLessThanOrEqual(1442 + layout.localExtra - 14);
    }
  }, 30000);

  it('adds independent consecutive course and accommodation rows and totals each selection', () => {
    const firstCourseAmount = component.courseQuoteRows[0].amount;
    const firstRoomAmount = component.roomQuoteRows[0].amount;
    component.addSelection('course');
    component.addSelection('room');
    expect(component.courseSelections[1].startDate).toBe('2026-10-04');
    expect(component.roomSelections[1].startDate).toBe('2026-10-04');
    component.updateSelection('course', component.courseSelections[1].id, { optionId: 'sparta-intensive-esl', weeks: 2 });
    component.updateSelection('room', component.roomSelections[1].id, { optionId: 'off-campus-single', weeks: 2 });
    expect(component.totalWeeks).toBe(6);
    expect(component.roomTotalWeeks).toBe(6);
    expect(component.tuitionForSelectedWeeks).toBe(firstCourseAmount + component.courseFees.find(course => course.id === 'sparta-intensive-esl')!.tuition * .65);
    expect(component.roomFeeForSelectedWeeks).toBe(firstRoomAmount + component.roomFees.find(room => room.id === 'off-campus-single')!.fee * .65);
    expect(component.quoteImageData.paymentItems.filter(item => item.label.startsWith('课程费')).length).toBe(2);
    expect(component.quoteImageData.paymentItems.filter(item => item.label.startsWith('住宿费')).length).toBe(2);
    expect(component.quoteImageData.paymentItems.filter(item => item.label === '注册费').length).toBe(1);
    expect(component.canExportQuote).toBeTrue();
  });

  it('charges both management rows for mixed campus and off-campus stays', () => {
    component.updateSelection('room', component.roomSelections[0].id, { weeks: 2 });
    component.addSelection('room');
    component.updateSelection('room', component.roomSelections[1].id, { optionId: 'off-campus-double', weeks: 2 });
    expect(component.onCampusRoomWeeks).toBe(2);
    expect(component.offCampusRoomWeeks).toBe(2);
    expect(component.includedLocalFees.find(fee => fee.item === '校内管理费')?.total).toBe(2000);
    expect(component.includedLocalFees.find(fee => fee.item === '校外宿舍管理费')?.total).toBe(4000);
  });

  it('renders every course and accommodation row with dates in a combined quote image', async () => {
    component.addSelection('course');
    component.addSelection('room');
    component.updateSelection('course', component.courseSelections[1].id, { optionId: 'sparta-intensive-esl', weeks: 2 });
    component.updateSelection('room', component.roomSelections[1].id, { optionId: 'off-campus-single', weeks: 2 });
    const renderer = new QuoteImageDownloadButtonComponent();
    renderer.quote = component.quoteImageData;
    const drawnText = spyOn(CanvasRenderingContext2D.prototype, 'fillText').and.callThrough();
    const blob = await renderer['createQuoteImageBlob'](1);
    const text = drawnText.calls.allArgs().map(args => args[0]).join('').replace(/\s/g, '');
    for (const row of [...component.courseQuoteRows, ...component.roomQuoteRows]) {
      expect(text).toContain(row.name.replace(/\s/g, ''));
      expect(text).toContain(row.dateRange);
    }
    expect(text).toContain('课程费2');
    expect(text).toContain('住宿费2');
    expect(text).toContain('EV主校区6周报价');
    expect(text).not.toContain('停留跨度');
    expect(text).not.toContain('默认报价参考房型');
    expect(renderer.quote.paymentItems.filter(item => item.label === '注册费').length).toBe(1);
    expect(blob.type).toBe('image/png');
  }, 30000);

  it('uses the full stay span for visas and blocks overlapping rows', () => {
    component.addSelection('course');
    component.updateSelection('course', component.courseSelections[1].id, { startDate: '2026-11-01' });
    expect(component.totalWeeks).toBe(8);
    expect(component.stayWeeks).toBe(12);
    expect(component.visaExtensionCount).toBe(1);
    expect(component.canExportQuote).toBeTrue();
    component.updateSelection('course', component.courseSelections[1].id, { startDate: '2026-09-20' });
    expect(component.hasOverlappingRows).toBeTrue();
    expect(component.canExportQuote).toBeFalse();
    expect(component.planError).toContain('日期重叠');
  });

  it('keeps the image heading concise while preserving necessary rules and the webpage amounts', () => {
    component.updateSelection('course', component.courseSelections[0].id, { weeks: 3 });
    component.updateSelection('room', component.roomSelections[0].id, { weeks: 2 });
    const quote = component.quoteImageData;
    expect(quote.title).toBe('3周');
    expect(quote.headingText).toBe('EV主校区3周报价');
    expect(quote.subtitle).toBe('');
    expect(quote.localFeeTitle).toBe('到校后学杂费明细');
    expect(quote.fileName).toContain('EV主校区3周报价');
    expect(quote.importantNotes?.join('')).toContain('2周按4周价的65%，3周按4周价的85%');
    expect(quote.importantNotes?.join('')).toContain('课程与住宿日期不完全一致');
    expect(quote.importantNotes?.join('')).not.toContain('旺季附加费');
    expect(quote.importantNotes?.join('')).not.toContain('未成年管理费');
    expect(quote.totalUsd).toBe(component.quoteUsdText.replace(/起$/, ''));
    expect(quote.totalCny).toBe(`人民币预计金额：${component.quoteCnyText.replace(/起$/, '')}`);
    expect(component.formatUsd(1234.25)).toBe('1,234.25');
  });

  it('preserves more than seven payment rows and renders peak and minor fees only when applicable', async () => {
    component.selectedStartDate = '2026-07-05';
    component.isMinorStudent = true;
    component.selectedWeeks = 2;
    for (let index = 0; index < 2; index++) {
      component.addSelection('course');
      component.addSelection('room');
    }
    component.updateSelection('room', component.roomSelections[2].id, { optionId: 'off-campus-single' });
    const renderer = new QuoteImageDownloadButtonComponent();
    renderer.quote = component.quoteImageData;
    expect(renderer.quote.paymentItems.length).toBe(10);
    expect(renderer.quote.paymentItems.find(row => row.label === '旺季附加费')?.amount).toBe('320 美元');
    expect(renderer.quote.paymentItems.find(row => row.label === '未成年管理费')?.amount).toBe('300 美元');
    const draw = spyOn(CanvasRenderingContext2D.prototype, 'fillText').and.callThrough();
    const blob = await renderer['createQuoteImageBlob'](1);
    const text = draw.calls.allArgs().map(args => args[0]).join('').replace(/\s/g, '');
    expect(text).toContain('课程费3');
    expect(text).toContain('住宿费3');
    expect(text).toContain('EV主校区10周报价');
    expect(text).toContain('旺季附加费');
    expect(text).toContain('未成年管理费');
    const layout = renderer['measureFullFeeLayout'](document.createElement('canvas').getContext('2d')!);
    expect(layout.paymentHeights.length).toBe(10);
    expect(layout.paymentExtra).toBeGreaterThan(0);
    const bitmap = await createImageBitmap(blob);
    expect(bitmap.height).toBe(1764 + layout.paymentExtra + layout.localExtra + layout.notesExtra);
    bitmap.close();
  }, 30000);

  it('requires Sunday starts and leaves other rows unchanged when editing or deleting', () => {
    component.addSelection('course');
    const second = component.courseSelections[1];
    component.updateSelection('course', component.courseSelections[0].id, { startDate: '2026-09-13' });
    expect(component.courseSelections[1].startDate).toBe(second.startDate);
    component.updateSelection('course', second.id, { startDate: '2026-10-05' });
    expect(component.validSundayStart).toBeFalse();
    expect(component.canExportQuote).toBeFalse();
    component.removeSelection('course', second.id);
    expect(component.courseSelections.length).toBe(1);
    expect(component.courseSelections[0].startDate).toBe('2026-09-13');
  });

  it('keeps the highest 24-week total inside the quote amount column', async () => {
    component.selectedCourseId = [...component.courseFees].sort((a, b) => b.tuition - a.tuition)[0].id;
    component.selectedRoomId = [...component.roomFees].sort((a, b) => b.fee - a.fee)[0].id;
    component.selectedWeeks = 24;
    component.isMinorStudent = true;
    const renderer = new QuoteImageDownloadButtonComponent();
    renderer.quote = component.quoteImageData;
    const original = CanvasRenderingContext2D.prototype.fillText;
    let totalWidth = 0;
    spyOn(CanvasRenderingContext2D.prototype, 'fillText').and.callFake(function(this: CanvasRenderingContext2D, text: string, x: number, y: number) {
      if (text === renderer.quote.totalUsd) totalWidth = this.measureText(text).width;
      original.call(this, text, x, y);
    });
    await renderer['createQuoteImageBlob'](1);
    expect(totalWidth).toBeGreaterThan(0);
    expect(totalWidth).toBeLessThanOrEqual(160);
  }, 30000);

  it('uses the requested eight-week title without restating durations or calculations', async () => {
    component.addSelection('course');
    component.addSelection('room');
    component.updateSelection('course', component.courseSelections[1].id, { optionId: 'sparta-power-speaking-6' });
    component.updateSelection('room', component.roomSelections[1].id, { optionId: 'off-campus-single' });
    const renderer = new QuoteImageDownloadButtonComponent();
    renderer.quote = component.quoteImageData;
    const draw = spyOn(CanvasRenderingContext2D.prototype, 'fillText').and.callThrough();
    await renderer['createQuoteImageBlob'](1);
    const text = draw.calls.allArgs().map(args => args[0]).join('');
    expect(draw.calls.allArgs().filter(args => args[0] === 'EV主校区8周报价').length).toBe(1);
    expect(text).not.toMatch(/组合报价|停留跨度|课程共8周|住宿共8周|默认报价参考房型|每行课程与住宿分别计费|不随课程或住宿行数增加/);
    expect(renderer.quote.paymentItems.filter(item => item.detailTitle).length).toBe(4);
    expect(renderer.quote.localFeeItems?.length).toBe(10);
    expect(renderer.quote.importantNotes?.length).toBe(1);
    expect(renderer.quote.totalUsd).toBe('4,527 美元');
  }, 30000);
});

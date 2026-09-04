import { TestBed } from '@angular/core/testing';
import { EMPTY, of } from 'rxjs';
import { ExchangeRateService } from '../../../services/exchange-rate.service';
import { SchoolService } from '../../../services/school.service';
import { CiaSchoolComponent } from './cia-school/cia-school.component';
import { CgBaniladSchoolComponent } from './cg-banilad-school/cg-banilad-school.component';
import { SmeagCapitalSchoolComponent } from './smeag-capital-school/smeag-capital-school.component';
import { CpiSchoolDetailComponent } from './cpi-school/cpi-school-detail.component';
import { CpilsSchoolDetailComponent } from './cpils-school/cpils-school-detail.component';
import { SchoolQuotePlan } from '../../components/school-quote-plan';
import { SchoolQuotePlanComponent } from '../../components/school-quote-plan.component';
import { QuoteImageDownloadButtonComponent } from '../../components/quote-image-download-button.component';

describe('five-school multi-row quote rollout', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [
    { provide: SchoolService, useValue: { getSchools: () => of([]) } },
    { provide: ExchangeRateService, useValue: { getLatestCnyRates: () => EMPTY } },
  ] }));

  it('exports every course and room with registration charged once', () => {
    const schools = [
      TestBed.runInInjectionContext(() => new CiaSchoolComponent()),
      TestBed.runInInjectionContext(() => new CgBaniladSchoolComponent()),
      TestBed.runInInjectionContext(() => new SmeagCapitalSchoolComponent()),
      TestBed.runInInjectionContext(() => new CpiSchoolDetailComponent()),
      TestBed.runInInjectionContext(() => new CpilsSchoolDetailComponent()),
    ];
    for (const component of schools) {
      component.quotePlan.add('course');
      component.quotePlan.add('room');
      const quote = component.quoteImageData;
      expect(component.quotePlan.error).toBe('');
      expect(quote.headingText).toContain('8周报价');
      expect(quote.paymentItems.filter(row => row.icon === '课').length).toBe(2);
      expect(quote.paymentItems.filter(row => row.icon === '宿').length).toBe(2);
      expect(quote.paymentItems.filter(row => row.label === '注册费').length).toBe(1);
      expect(quote.localFeeTableLayout).toBe('web');
      expect(quote.fullFeeDetails).toBeTrue();
    }
  });

  it('keeps school-specific fee behavior with multiple rows', () => {
    const cia = TestBed.runInInjectionContext(() => new CiaSchoolComponent());
    cia.quotePlan.add('course'); cia.quotePlan.courses[1].optionId = 'college-immersion';
    expect(cia.quoteImageData.totalNote).toContain('IAU一次性注册费50美元');

    const smeag = TestBed.runInInjectionContext(() => new SmeagCapitalSchoolComponent());
    smeag.quotePlan.add('course');
    expect(smeag.localFees.filter(row => row.item.startsWith('教材费')).length).toBe(1);
    smeag.quotePlan.courses[1].optionId = 'business';
    expect(smeag.localFees.filter(row => row.item.startsWith('教材费')).length).toBe(2);

    const cpi = TestBed.runInInjectionContext(() => new CpiSchoolDetailComponent());
    cpi.selectedRegistrationDate = '2026-09-03'; cpi.quotePlan.add('course'); cpi.quotePlan.add('room');
    expect(cpi.quoteUsd).toBe(2906);

    const cpils = TestBed.runInInjectionContext(() => new CpilsSchoolDetailComponent());
    const firstPeriodDiscount = cpils.offSeasonDiscountAmount;
    cpils.quotePlan.add('course');
    cpils.quotePlan.courses[1].startDate = '2027-01-03';
    expect(cpils.offSeasonDiscountAmount).toBe(firstPeriodDiscount);
  });

  it('warns on gaps and blocks overlaps', () => {
    const cpi = TestBed.runInInjectionContext(() => new CpiSchoolDetailComponent());
    cpi.quotePlan.add('course'); cpi.quotePlan.add('room');
    cpi.quotePlan.rooms[1].startDate = '2026-11-01';
    expect(cpi.quotePlan.warning).toContain('日期不一致');
    cpi.quotePlan.courses[1].startDate = cpi.quotePlan.courses[0].startDate;
    expect(cpi.quotePlan.error).toContain('重叠');
  });

  it('shows only the selected short-stay rules, using each school’s own ratios', () => {
    const schools = [
      { school: TestBed.runInInjectionContext(() => new CiaSchoolComponent()), ratio: '80%' },
      { school: TestBed.runInInjectionContext(() => new CgBaniladSchoolComponent()), ratio: '85%' },
      { school: TestBed.runInInjectionContext(() => new SmeagCapitalSchoolComponent()), ratio: '85%' },
      { school: TestBed.runInInjectionContext(() => new CpiSchoolDetailComponent()), ratio: '90%' },
    ];
    for (const { school, ratio } of schools) {
      school.quotePlan.rooms[0].weeks = 3;
      const quote = school.quoteImageData;
      expect(quote.importantNotes!.filter(note => note.includes('4周价格')).length).toBe(1);
      expect(quote.importantNotes!.join('')).toContain(ratio);
      expect(quote.importantNotes!.join('')).not.toContain('1周课程');
      school.quotePlan.rooms[0].weeks = 4;
      expect(school.quoteImageData.importantNotes!.join('')).not.toContain('4周价格');
    }
  });

  it('sorts image periods by date without moving the editable rows', () => {
    const school = TestBed.runInInjectionContext(() => new CgBaniladSchoolComponent());
    school.quotePlan.add('course'); school.quotePlan.add('room');
    school.quotePlan.courses.reverse(); school.quotePlan.rooms.reverse();
    const firstEditableId = school.quotePlan.courses[0].id;
    const items = school.quotePlan.paymentItems();
    expect(items[0].detailSubtitle).toContain('2026/09/06');
    expect(items[2].detailSubtitle).toContain('2026/09/06');
    expect(school.quotePlan.courses[0].id).toBe(firstEditableId);
  });

  for (const [courseCount, roomCount] of [[1, 1], [3, 3], [4, 4], [1, 3], [3, 1]]) {
    const scenario = courseCount === roomCount ? String(courseCount) : `${courseCount}c-${roomCount}r`;
    it(`renders the approved complete layout for all five schools with ${courseCount} course and ${roomCount} room periods`, async () => {
      const factories = [
        { key: 'cia', create: () => new CiaSchoolComponent() },
        { key: 'cg-banilad', create: () => new CgBaniladSchoolComponent() },
        { key: 'smeag-capital', create: () => new SmeagCapitalSchoolComponent() },
        { key: 'cpi', create: () => new CpiSchoolDetailComponent() },
        { key: 'cpils', create: () => new CpilsSchoolDetailComponent() },
      ];
      const paint: { text: string; x: number; y: number; color: string; align: string; font: string }[] = [];
      const originalText = CanvasRenderingContext2D.prototype.fillText;
      const textSpy = spyOn(CanvasRenderingContext2D.prototype, 'fillText').and.callFake(function(this: CanvasRenderingContext2D, text, x, y) {
        paint.push({ text, x, y, color: String(this.fillStyle), align: this.textAlign, font: this.font });
        originalText.call(this, text, x, y);
      });
      for (const { key, create } of factories) {
        const school = TestBed.runInInjectionContext(() => create());
        const plan = school.quotePlan;
        for (const kind of ['course', 'room'] as const) {
          const count = kind === 'course' ? courseCount : roomCount;
          for (let index = 1; index < count; index++) {
            plan.add(kind);
            plan.rows(kind)[index].optionId = plan.options(kind)[index].id;
          }
        }
        // Keep the same total dates when one side has a single row.
        if (courseCount === 1) plan.courses[0].weeks = roomCount * 4;
        if (roomCount === 1) plan.rooms[0].weeks = courseCount * 4;
        if (key === 'cia' && courseCount === 4) plan.courses[3].optionId = 'college-immersion';
        if (key === 'smeag-capital' && courseCount === 4) plan.courses[3].optionId = 'business';
        expect(plan.error).withContext(key).toBe('');
        const renderer = new QuoteImageDownloadButtonComponent();
        renderer.quote = school.quoteImageData;
        const quote = renderer.quote;
        expect(quote.layout).toBe('cia-detailed');
        expect(quote.paymentSectionTitle).toBe('学校费用明细');
        expect(quote.localFeeTitle).toBe('到校后学杂费明细');
        expect(quote.fullFeeDetails).toBeTrue();
        expect(quote.localFeeTableLayout).toBe('web');
        expect(quote.headingText).toContain(`${Math.max(courseCount, roomCount) * 4}周报价`);
        expect(quote.subtitle).toBe('');
        const periods = quote.paymentItems.filter(row => row.detailTitle);
        expect(periods.length).toBe(courseCount + roomCount);
        const courseLabel = key === 'cia' ? '课程名称' : '课程费';
        const roomLabel = key === 'cia' ? '住宿名称' : '住宿费';
        expect(periods[0].label).toBe(courseCount === 1 ? courseLabel : courseLabel + '1');
        expect(periods[courseCount].label).toBe(roomCount === 1 ? roomLabel : roomLabel + '1');
        expect(quote.paymentItems.filter(row => row.label === '注册费').length).toBe(1);
        const context = document.createElement('canvas').getContext('2d')!;
        const layout = renderer['measureFullFeeLayout'](context);
        expect(layout.paymentHeights.length).toBe(quote.paymentItems.length);
        expect(layout.localHeights.length).toBe(quote.localFeeItems!.length);
        expect(layout.importantNotes.filter(note => note.includes('人民币金额按参考汇率估算')).length).toBe(1);
        expect(layout.importantNotes.filter(note => note.includes('最终以学校价格')).length).toBe(1);
        expect(layout.importantNotes.join('')).not.toContain('日期不一致');
        textSpy.calls.reset();
        paint.length = 0;
        const lines = spyOn<any>(renderer, 'drawSolidLine').and.callThrough();
        const blob = await renderer['createQuoteImageBlob'](2);
        const bitmap = await createImageBitmap(blob);
        expect(bitmap.width).toBe(2064);
        expect(bitmap.height).toBe((1764 + layout.paymentExtra + layout.localExtra + layout.notesExtra) * 2);
        bitmap.close();
        const drawn = textSpy.calls.allArgs().map(args => String(args[0])).join('').replace(/\s/g, '');
        expect(drawn).not.toContain('到校前支付给学校');
        // Both tables, both totals and optional fees share their main column edges.
        for (const boundary of [236, 556]) {
          expect(lines.calls.allArgs().filter(args => args[1] === boundary && args[3] === boundary).length).toBe(5);
        }
        let paymentTop = 298;
        const paymentPaint = paint.slice(0, paint.findIndex(item => item.text === '到校后学杂费明细'));
        quote.paymentItems.forEach((row, index) => {
          const bottom = paymentTop + layout.paymentHeights[index];
          const inRow = paymentPaint.filter(item => item.y > paymentTop && item.y < bottom);
          const discount = /^[-−]\s*\d/.test(row.amount.trim()) || /^\d+(?:\.\d+)?折$/.test(row.amount.trim());
          expect(inRow.some(item => item.text === row.amount && item.x === 546 && item.align === 'right' && item.color === (discount ? '#f25518' : '#14233e'))).withContext(`${key} ${row.label} amount`).toBeTrue();
          expect(inRow.filter(item => item.x === 136).every(item => item.color !== '#f25518')).toBeTrue();
          expect(inRow.filter(item => item.x === 566).every(item => item.color !== '#f25518' && !/bold|[56789]00/.test(item.font))).withContext(`${key} ${row.label} regular notes`).toBeTrue();
          paymentTop = bottom;
        });
        for (const row of periods) {
          expect(drawn).withContext(`${key} ${row.label}`).toContain(row.detailTitle!.replace(/\s/g, ''));
          expect(drawn).toContain(row.detailSubtitle!.replace(/\s/g, ''));
          expect(drawn).toContain((row.note ?? '').replace(/\s/g, ''));
        }
        for (const row of quote.localFeeItems ?? []) expect(drawn).withContext(`${key} ${row.label}`).toContain(row.note.replace(/\s/g, ''));
        expect(drawn).toContain(quote.localFeeNote.replace(/\s/g, ''));
        expect(drawn).toContain('老学员专属优惠');
        expect(drawn).toContain('报价说明');
        for (const row of quote.optionalFeeItems ?? []) {
          expect(paint.some(item => item.text === row.amount && item.x === 546 && item.color === '#14233e')).withContext(`${key} ${row.label}`).toBeTrue();
          expect(drawn).toContain(row.note.replace(/\s/g, ''));
        }
        if (key === 'cia' && courseCount === 4) expect(drawn).toContain('IAU一次性注册费50美元另计（未计入上述合计）。');
        const capture = (window as unknown as { __karma__: { config: { args?: string[] } } }).__karma__.config.args?.includes('capture-rollout');
        if (capture) expect((await fetch(`/quote-rollout/${key}-${scenario}.png`, { method: 'POST', body: blob })).ok).toBeTrue();
      }
    }, 60000);
  }

  it('stacks the row fields within a narrow quote panel', () => {
    const fixture = TestBed.createComponent(SchoolQuotePlanComponent);
    fixture.componentInstance.plan = new SchoolQuotePlan('course', 'room', '2026-09-06', [4],
      kind => [{ id: kind, name: kind, details: '课程与房型说明' }], () => 1000);
    fixture.nativeElement.style.display = 'block';
    fixture.nativeElement.style.width = '390px';
    document.body.appendChild(fixture.nativeElement);
    fixture.detectChanges();
    const columns = fixture.nativeElement.querySelector('.columns') as HTMLElement;
    const row = fixture.nativeElement.querySelector('.plan-row') as HTMLElement;
    expect(getComputedStyle(columns).display).toBe('none');
    expect(row.scrollWidth).toBeLessThanOrEqual(row.clientWidth);
    fixture.destroy();
  });

  it('renders every multi-row payment and local-fee row into complete PNG images', async () => {
    const schools = [
      TestBed.runInInjectionContext(() => new CiaSchoolComponent()),
      TestBed.runInInjectionContext(() => new CgBaniladSchoolComponent()),
      TestBed.runInInjectionContext(() => new SmeagCapitalSchoolComponent()),
      TestBed.runInInjectionContext(() => new CpiSchoolDetailComponent()),
      TestBed.runInInjectionContext(() => new CpilsSchoolDetailComponent()),
    ];
    for (const component of schools) {
      component.quotePlan.add('course'); component.quotePlan.add('room');
      const renderer = new QuoteImageDownloadButtonComponent();
      renderer.quote = component.quoteImageData;
      const context = document.createElement('canvas').getContext('2d')!;
      const layout = renderer['measureFullFeeLayout'](context);
      expect(layout.paymentHeights.length).toBe(renderer.quote.paymentItems.length);
      expect(layout.localHeights.length).toBe(renderer.quote.localFeeItems!.length);
      expect(1764 + layout.paymentExtra + layout.localExtra + layout.notesExtra).toBeGreaterThan(1700);
      const blob = await renderer['createQuoteImageBlob'](1);
      expect(blob.type).toBe('image/png');
      expect(blob.size).toBeGreaterThan(50_000);
    }
  });
});

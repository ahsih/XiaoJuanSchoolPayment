import { QuoteImageDownloadButtonComponent } from '../../components/quote-image-download-button.component';
import { CiaSchoolComponent } from './cia-school/cia-school.component';
import { CgBaniladSchoolComponent } from './cg-banilad-school/cg-banilad-school.component';
import { CgSpartaSchoolComponent } from './cg-sparta-school/cg-sparta-school.component';
import { SmeagCapitalSchoolComponent } from './smeag-capital-school/smeag-capital-school.component';
import { CpiSchoolDetailComponent } from './cpi-school/cpi-school-detail.component';
import { CpilsSchoolDetailComponent } from './cpils-school/cpils-school-detail.component';
import { EvSchoolDetailComponent } from './ev-school/ev-school-detail.component';
import { PinesSchoolDetailComponent } from './pines-school/pines-school-detail.component';
import { MonolSchoolDetailComponent } from './monol-school/monol-school-detail.component';
import { MonolSpartaSchoolDetailComponent } from './monol-sparta-school/monol-sparta-school-detail.component';
import { PhilinterSchoolDetailComponent } from './philinter-school/philinter-school-detail.component';
import { BCebuSchoolComponent } from './bcebu-school/bcebu-school.component';
import { GlcSchoolComponent } from './glc-school/glc-school.component';
import { IbreezeSchoolComponent } from './ibreeze-school/ibreeze-school.component';
import { AnjSchoolComponent } from './anj-school/anj-school.component';
import { ImsSchoolComponent } from './ims-school/ims-school.component';
import { BeciQuoteCalculatorComponent } from './beci-quote/beci-quote-calculator.component';
import { JicSchoolDetailComponent } from './jic-school/jic-school-detail.component';
import { IuSchoolComponent } from './iu-school/iu-school.component';
import { IclSchoolComponent } from './icl-school/icl-school.component';
import { CellaQuoteCalculatorComponent } from './cella-quote/cella-quote-calculator.component';
import { FellaSchoolDetailComponent } from './fella-school/fella-school-detail.component';
import { BtesSchoolComponent } from './btes-school/btes-school.component';
import { CebuBlueOceanSchoolComponent } from './cebu-blue-ocean-school/cebu-blue-ocean-school.component';
import { WalesSchoolDetailComponent } from './wales-school/wales-school-detail.component';
import { EnglishMintSchoolComponent } from './english-mint-school/english-mint-school.component';
import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { EMPTY, of } from 'rxjs';
import { SchoolContentService } from '../../../services/school-content.service';
import { SchoolService } from '../../../services/school.service';
import { ExchangeRateService } from '../../../services/exchange-rate.service';
import { SchoolQuotePlan, QuotePlanKind, quoteMoney } from '../../components/school-quote-plan';
import { SchoolQuotePlanComponent } from '../../components/school-quote-plan.component';
import { TargetStudentQuote } from './target-school/target-student-quote';
const schools = [
  { name: 'PINES IELTS', create: () => { const p = new PinesSchoolDetailComponent(); p.quotePlan.courses[0].optionId = 'pre-ielts'; p.quotePlan.rooms[0].optionId = 'ielts-quad'; return p; } },
  { name: 'BECI Sparta', create: () => { const p = new BeciQuoteCalculatorComponent(); p.campus = 'sparta'; return p; } },
  { name: 'BECI City', create: () => { const p = new BeciQuoteCalculatorComponent(); p.campus = 'city'; return p; } },
  { name: 'JIC Premium', create: () => { const p = new JicSchoolDetailComponent(); p.students[0].setCampus('premium'); return p; } },
  { name: 'Fella Second', create: () => { const p = new FellaSchoolDetailComponent(); p.students[0].setCampus('campus2'); return p; } },
  { name: 'CELLA Premium', create: () => { const p = new CellaQuoteCalculatorComponent(); p.initialCampus = 'premium'; return p; } },
  { name: "CIA", create: () => new CiaSchoolComponent() },
  { name: "CG Banilad", create: () => new CgBaniladSchoolComponent() },
  { name: "CG Sparta", create: () => new CgSpartaSchoolComponent() },
  { name: "SMEAG", create: () => new SmeagCapitalSchoolComponent() },
  { name: "CPI", create: () => new CpiSchoolDetailComponent() },
  { name: "CPILS", create: () => new CpilsSchoolDetailComponent() },
  { name: "EV", create: () => new EvSchoolDetailComponent() },
  { name: "PINES", create: () => new PinesSchoolDetailComponent() },
  { name: "MONOL", create: () => new MonolSchoolDetailComponent() },
  { name: "MONOL Sparta", create: () => new MonolSpartaSchoolDetailComponent() },
  { name: "PHILINTER", create: () => new PhilinterSchoolDetailComponent() },
  { name: "B'Cebu", create: () => new BCebuSchoolComponent() },
  { name: "GLC", create: () => new GlcSchoolComponent() },
  { name: "I.BREEZE", create: () => new IbreezeSchoolComponent() },
  { name: "A&J", create: () => new AnjSchoolComponent() },
  { name: "IMS", create: () => new ImsSchoolComponent() },
  { name: "BECI", create: () => new BeciQuoteCalculatorComponent() },
  { name: "JIC", create: () => new JicSchoolDetailComponent() },
  { name: "IU", create: () => new IuSchoolComponent() },
  { name: "ICL", create: () => new IclSchoolComponent() },
  { name: "CELLA", create: () => new CellaQuoteCalculatorComponent() },
  { name: "Fella", create: () => new FellaSchoolDetailComponent() },
  { name: "BTES", create: () => new BtesSchoolComponent() },
  { name: "Blue Ocean", create: () => new CebuBlueOceanSchoolComponent() },
  { name: "WALES", create: () => new WalesSchoolDetailComponent() },
  { name: "MINT", create: () => new EnglishMintSchoolComponent() },
];
const planOf = (value: any): SchoolQuotePlan => value.quotePlan ?? value.calculator?.plan ?? value.plan ?? value.quoteCalculator?.plan ?? planOf(value.activeStudents?.[0] ?? value.students?.[0]);
const split = (plan: SchoolQuotePlan, kind: QuotePlanKind, weeks: number[]) => {
  const original = plan.rows(kind)[0];
  let offset = 0;
  const rows = weeks.map((week, index) => {
    const row = { ...original, id: (kind === 'course' ? 100 : 200) + index, weeks: week,
      startDate: new Date(Date.parse('2026-11-08T00:00:00Z') + offset * 7 * 86400000).toISOString().slice(0, 10) };
    offset += week;
    return row;
  });
  plan.rows(kind).splice(0, plan.rows(kind).length, ...rows);
};
function initialize(create: () => any): any {
  const page = TestBed.runInInjectionContext(create);
  if (page instanceof CellaQuoteCalculatorComponent) page.ngOnInit();
  const students = page.activeStudents ?? [];
  for (const student of students) {
    student.selectedRegistrationDate = '2026-09-01';
    if (student.calculator) student.calculator.selectedRegistrationDate = '2026-09-01';
  }
  return page;
}
describe('confirmed common quote rules across completed routes', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [
    provideRouter([]), provideHttpClient(), provideHttpClientTesting(),
    { provide: SchoolService, useValue: { getSchools: () => of([]) } },
    { provide: SchoolContentService, useValue: { getPublished: () => of(null) } },
    { provide: ExchangeRateService, useValue: { getLatestCnyRates: () => EMPTY } },
    { provide: ActivatedRoute, useValue: { snapshot: { data: {}, queryParamMap: { get: () => null }, paramMap: { get: () => null } }, data: of({}), queryParams: of({}) } },
    { provide: ElementRef, useValue: new ElementRef(document.createElement('div')) },
  ] }));
  for (const school of schools) {
    it(school.name + ': prorates 1+3, 2+2 and >4 weeks; image rows use the same amounts', () => {
      const page = initialize(school.create), plan = planOf(page);
      const course4 = plan.price('course', plan.courses[0]), room4 = plan.price('room', plan.rooms[0]);
      for (const weeks of [[1, 3], [2, 2], [1, 5]]) {
        split(plan, 'course', weeks); split(plan, 'room', weeks);
        expect(plan.error).toBe('');
        if (!(school.name === 'MINT' && plan.courseWeeks === 6)) expect(page.quoteError ?? page.planError).withContext(school.name + ' export').toBe('');
        expect(plan.total('course')).toBeCloseTo(course4 * plan.courseWeeks / 4, 2);
        expect(plan.total('room')).toBeCloseTo(room4 * plan.courseWeeks / 4, 2);
        const quote = page.quoteImageData;
        expect((quote.importantNotes ?? []).join('')).not.toMatch(/均价|自动同步|4周价格的|4周价的|÷4/);
        for (const item of plan.paymentItems()) expect(quote.paymentItems.some((row: any) => row.icon === item.icon && row.amount.replace(/\s/g, '') === item.amount.replace(/\s/g, ''))).withContext(item.label).toBeTrue();
      }
    });
    it(school.name + ': different course and room types use their own catalogue rates', () => {
      const page = initialize(school.create), plan = planOf(page);
      const course = plan.options('course').find(option => option.id !== plan.courses[0].optionId)!;
      const room = plan.options('room').find(option => option.id !== plan.rooms[0].optionId)!;
      const course4 = plan.price('course', { ...plan.courses[0], optionId: course.id });
      const room4 = plan.price('room', { ...plan.rooms[0], optionId: room.id });
      split(plan,'course',[1,3]); split(plan,'room',[2,2]);
      plan.courses[1].optionId=course.id; plan.rooms[1].optionId=room.id;
      expect(plan.price('course',plan.courses[1])).toBeCloseTo(course4*3/4,1);
      expect(plan.price('room',plan.rooms[1])).toBeCloseTo(room4/2,1);
    });
    it(school.name + ': edits dates/weeks bidirectionally and blocks invalid exports', () => {
      const page = initialize(school.create), plan = planOf(page);
      split(plan, 'course', [4]); split(plan, 'room', [1, 3]);
      plan.updateStartDate('room', plan.rooms[0].id, '2027-01-10');
      expect(plan.courses[0].startDate).toBe('2027-01-10');
      expect(plan.rooms[1].startDate).toBe('2027-01-17');
      plan.updateWeeks('course', plan.courses[0].id, 8);
      expect(plan.rooms.map(row => row.weeks)).toEqual([1, 7]);
      plan.updateWeeks('room', plan.rooms[1].id, 3);
      expect(plan.courseWeeks).toBe(4);
      plan.add('course');
      expect(plan.roomWeeks).toBe(8);
      plan.remove('course', plan.courses[0].id);
      expect(plan.courseWeeks).toBe(4);
      expect(plan.startDate).toBe('2027-01-10');
      expect(plan.mismatch).toBeFalse();
      plan.rooms[0].startDate = '2027-01-11';
      expect(plan.error).toContain('周日');
      if ('quoteError' in page) expect(page.quoteError).not.toBe('');
      plan.rooms[0].startDate = '2027-02-30';
      expect(plan.error).not.toBe('');
    });
    if (school.name !== 'MINT') it(school.name + ': different students retain independent duration tiers', () => {
      const page = initialize(school.create);
      page.setQuoteMode('group');
      const active = page.activeStudents;
      expect(active.length).toBe(2);
      const first = planOf(active[0]), second = planOf(active[1]);
      const base = second.price('room', second.rooms[0]);
      split(first, 'course', [1, 3]); split(first, 'room', [2, 2]);
      split(second, 'course', [3]); split(second, 'room', [3]);
      const short = second.total('room');
      first.updateWeeks('course', first.courses[1].id, 7);
      expect(second.courseWeeks).toBe(3);
      expect(second.total('room')).toBe(short);
      expect(first.total('room')).toBeCloseTo(first.price('room', { ...first.rooms[0], weeks: 4 }) * 2, 2);
      if (second.allowedWeeks.includes(3)) expect(second.error).toBe('');
      else expect(second.error).toContain('暂不支持');
      expect(base).toBeGreaterThan(0);
    });
  }
  it('EV: 4-week student changes courses/rooms while a second 3-week student uses 85%', () => {
    const page = initialize(() => new EvSchoolDetailComponent()); page.setQuoteMode('group');
    const first = planOf(page.activeStudents[0]), second = planOf(page.activeStudents[1]);
    split(first, 'course', [2, 2]); first.courses[1].optionId = 'sparta-intensive-esl';
    split(first, 'room', [1, 3]); first.rooms[0].optionId = 'triple';
    split(second, 'course', [3]); split(second, 'room', [3]);
    expect(first.total('course')).toBe(490 + 515);
    expect(first.total('room')).toBe(237.5 + 675);
    expect(second.total('course')).toBe(833);
    expect(second.total('room')).toBe(765);
    expect(page.quoteImageData.totalUsd).toBe(page.quoteUsdText.replace(/起$/, ''));
    expect(page.quoteImageData.importantNotes.join('')).not.toMatch(/均价|自动同步|4周价的|÷4/);
  });
  it('MINT keeps its form usable while adding segments before reaching a published local-fee duration', () => {
    const fixture = TestBed.createComponent(EnglishMintSchoolComponent);
    const page = fixture.componentInstance;
    spyOn(page, 'ngOnInit').and.stub();
    page.quotePlan.updateWeeks('room', page.quotePlan.rooms[0].id, 1);
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(fixture.nativeElement.querySelector('.quote-local-fees')).toBeNull();
    page.quotePlan.add('room');
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(page.quoteError).toContain('学杂费尚未确认');
    page.quotePlan.updateWeeks('room', page.quotePlan.rooms[1].id, 3);
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(fixture.nativeElement.querySelector('.quote-local-fees')).not.toBeNull();
    expect(page.quoteError).toBe('');
    fixture.destroy();
  });
  it('GLC synchronizes members explicitly sharing a family course while leaving another student independent', () => {
    const page = initialize(() => new GlcSchoolComponent()); page.setQuoteMode('group'); page.studentCount = 3;
    page.students[0].calculator.plan.courses[0].optionId = 'family-package-2';
    page.students[1].sharedCourseOwner = 1;
    const [owner, member, other] = page.activeStudents.map((student: any) => student.calculator.plan);
    owner.updateWeeks('course', owner.courses[0].id, 8);
    expect(member.roomWeeks).toBe(8);
    member.updateStartDate('room', member.rooms[0].id, '2026-11-08');
    expect(owner.rooms[0].startDate).toBe('2026-11-08');
    expect(other.courseWeeks).toBe(4);
    expect(other.startDate).not.toBe('2026-11-08');
    expect(page.quoteError).toBe('');
  });
  for (const factory of [() => new CellaQuoteCalculatorComponent(), () => new EnglishMintSchoolComponent()]) it('renders split course/room amounts into a real PNG without internal algorithms', async () => {
    const page = initialize(factory), plan = planOf(page);
    split(plan, 'course', [4]); split(plan, 'room', [1,3]);
    const quote = page.quoteImageData, renderer = new QuoteImageDownloadButtonComponent(); renderer.quote = quote;
    const drawn = spyOn(CanvasRenderingContext2D.prototype,'fillText').and.callThrough();
    const blob = await renderer['createQuoteImageBlob'](1);
    expect(blob.type).toBe('image/png'); expect(blob.size).toBeGreaterThan(10000);
    const text = drawn.calls.allArgs().map(args=>String(args[0])).join('').replace(/\s/g,'');
    for (const row of plan.paymentItems()) { expect(text).toContain(row.amount.replace(/\s/g,'')); expect(text).toContain(row.detailSubtitle!.replace(/\s/g,'')); }
    expect(text).not.toMatch(/均价|自动同步|4周价格的|4周价的|÷4/);
  }, 30000);
  it('TARGET preserves package prices and reflows dates after edits/removals', () => {
    const student = new TargetStudentQuote(); student.addPackage();
    student.updateWeeks(student.packages[0], 1);
    expect(student.packages[1].startDate).toBe(new Date(student.date(student.startDate)! + 7*86400000).toISOString().slice(0,10));
    student.removePackage(student.packages[0].id);
    student.packages[0].startDate = '2026-11-09';
    expect(student.quoteError).toContain('周日');
  });
  it('shared controls prevent invalid Sundays and keep long-quote segment choices available', () => {
    const plan = new SchoolQuotePlan('course','room','2026-11-08',[4,8,12], kind => [{id:kind,name:kind,details:''}], (_,row)=>1000*row.weeks/4);
    const editor = new SchoolQuotePlanComponent(); editor.plan=plan;
    expect(editor.weekOptions('room',4,2)).toContain(1);
    const input=document.createElement('input');
    editor.updateStartDate('room',0,'2026-11-09',input);
    expect(plan.startDate).toBe('2026-11-08');
    expect(input.value).toBe('2026-11-08');
  });
});

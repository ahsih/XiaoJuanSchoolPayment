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
import { TargetSchoolComponent } from './target-school/target-school.component';
import { CipQuoteCalculatorComponent } from './cip-school/cip-quote-calculator.component';
import { CiecQuoteCalculatorComponent } from './ciec-school/ciec-quote-calculator.component';
import { LaMerSchoolComponent } from './la-mer-school/la-mer-school.component';
import { PhilippinesQuoteImageExporterComponent } from '../../components/philippines-quote-image-exporter.component';
const imageAlias = (page: any) => { Object.defineProperty(page, 'quoteImageData', { get: () => page.quoteImage }); return page; };
const schools = [
  { name: 'TARGET', create: () => new TargetSchoolComponent() },
  { name: 'CIP', create: () => imageAlias(new CipQuoteCalculatorComponent()) },
  { name: 'CIEC', create: () => imageAlias(new CiecQuoteCalculatorComponent()) },
  { name: 'EV La Mer', create: () => imageAlias(new LaMerSchoolComponent()) },
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
const planOf = (value: any): SchoolQuotePlan => value.quotePlan ?? value.calculator?.plan ?? value.plan ?? value.quoteCalculator?.plan ?? planOf(value.activeStudents?.[0] ?? value.students?.[0] ?? value.active?.[0]);
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
function setPeriods(page: any, weeks: number[]) {
  if (page instanceof TargetSchoolComponent) {
    const student=page.students[0], original=student.packages[0]; let offset=0;
    student.packages=weeks.map((week,index)=>{
      const row={...original,id: index+1,weeks:week,startDate:new Date(Date.parse('2026-11-08T00:00:00Z')+offset*7*86400000).toISOString().slice(0,10)};
      offset+=week; return row;
    });
  } else { const plan=planOf(page); split(plan,'course',weeks);split(plan,'room',weeks); }
}

describe('Textbook webpage and exported image audit', () => {
  it('legacy exporter keeps unknown textbook quantities pending and preserves explicit totals', () => {
    const grid=document.createElement('div'); grid.className='local-fee-grid';
    grid.innerHTML='<article><span>教材费</span><strong>2000比索</strong><p>实际购买</p></article>';
    document.body.appendChild(grid);
    try {
      const exporter=new PhilippinesQuoteImageExporterComponent({} as any,{} as any,{} as any,'browser' as any);
      const result=(exporter as any).extractLocalFees(12);
      expect(result.items[0].amount).toBe('待确认'); expect(result.total).toBe(0);
      grid.querySelector('article')!.dataset['total']='6000';
      expect((exporter as any).extractLocalFees(12).total).toBe(6000);
    } finally { grid.remove(); }
  });
  beforeEach(() => TestBed.configureTestingModule({ providers: [
    provideRouter([]), provideHttpClient(), provideHttpClientTesting(),
    { provide: SchoolService, useValue: { getSchools: () => of([]) } },
    { provide: SchoolContentService, useValue: { getPublished: () => of(null) } },
    { provide: ExchangeRateService, useValue: { getLatestCnyRates: () => EMPTY } },
    { provide: ActivatedRoute, useValue: { snapshot: { data: {}, queryParamMap: { get: () => null }, paramMap: { get: () => null } }, data: of({}), queryParams: of({}) } },
    { provide: ElementRef, useValue: new ElementRef(document.createElement('div')) },
  ] }));

  const money = (value: string) => Number(value.replace(/,/g,'').match(/-?[0-9]+(?:[.][0-9]+)?/)?.[0] ?? 0);
  const imageBooks = (page: any) => (page.quoteImageData.localFeeItems ?? []).filter((row: any) => /教材|书本/.test(row.label));
  const imageBookTotal = (page: any) => imageBooks(page).reduce((sum: number,row:any)=>sum+money(row.amount),0);
  const webBooks = (page: any) => (page.estimatedLocalFees ?? page.includedLocalFees ?? page.localFees ?? []).filter((row:any)=>/教材|书本/.test(row.item));
  for (const school of schools) {
    it(school.name + ': same course split keeps textbook total and image matches webpage', () => {
      const page=initialize(school.create);
      setPeriods(page,[8]);
      const original=imageBookTotal(page);
      setPeriods(page,[4,4]);
      expect(imageBookTotal(page)).withContext(school.name+' duplicate segments').toBe(original);
      const fees=webBooks(page);
      if(fees.length)expect(imageBookTotal(page)).withContext(school.name+' image vs webpage').toBeCloseTo(fees.reduce((sum:number,row:any)=>sum+row.total,0),2);
      expect((page.quoteImageData.localFeeItems ?? []).every((row:any)=>Number.isFinite(money(row.amount)))).toBeTrue();
    });
  }
  for(const school of schools.filter(x=>['CIA','CG Banilad','CG Sparta','CPI','BECI','BECI Sparta','Fella','Fella Second','IMS','IU','ICL','CELLA','CELLA Premium'].includes(x.name))) {
    it(school.name+': different material types are not merged into a single fee',()=>{
      const page=initialize(school.create);
      setPeriods(page,[4,4]);
      const plan=planOf(page);
      const same=imageBookTotal(page);
      const exam=plan.options('course').find((x:any)=>/ielts|雅思|business|商务/.test(x.name.toLowerCase())&&!/guarantee|保证/.test(x.name.toLowerCase()));
      expect(exam).withContext(school.name+' exam catalog').toBeDefined();
      if(!exam)return;
      plan.courses[1].optionId=exam.id;
      expect(imageBookTotal(page)).withContext(school.name+' mixed-course textbook budget').toBeGreaterThan(same);
    });
  }
  for (const school of schools) {
    it(school.name + ': production PNG renderer paints each textbook amount', async () => {
      const page=initialize(school.create);
      setPeriods(page,[4,4]);
      const quote=page.quoteImageData, renderer=new QuoteImageDownloadButtonComponent();
      renderer.quote=quote;
      const paints: string[]=[];
      const original=CanvasRenderingContext2D.prototype.fillText;
      spyOn(CanvasRenderingContext2D.prototype,'fillText').and.callFake(function(this:CanvasRenderingContext2D,text:string,x:number,y:number){paints.push(text);original.call(this,text,x,y);});
      const blob=await (renderer as any).createQuoteImageBlob(0.35);
      expect(blob.type).toBe('image/png');expect(blob.size).toBeGreaterThan(1000);
      const text=paints.join('').replace(/\s/g,'');
      for(const row of imageBooks(page))expect(text).withContext(school.name+' exported textbook amount').toContain(row.amount.replace(/\s/g,''));
      const bitmap=await createImageBitmap(blob);expect(bitmap.height).toBeGreaterThan(150);bitmap.close();
      await fetch('/textbook-audit-artifact?name='+encodeURIComponent(school.name.replace(/[^a-zA-Z0-9]/g,'_')+'.png'),{method:'POST',body:blob});
      renderer.ngOnDestroy();
    },30000);
  }

});

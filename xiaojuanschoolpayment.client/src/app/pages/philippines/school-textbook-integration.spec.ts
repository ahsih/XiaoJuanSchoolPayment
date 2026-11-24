import { QuoteImageDownloadButtonComponent } from '../../components/quote-image-download-button.component';
import { CiaSchoolComponent } from './cia-school/cia-school.component';
import { CgBaniladSchoolPageComponent } from './cg-banilad-school/cg-banilad-school-page.component';
import { CgSpartaSchoolPageComponent } from './cg-sparta-school/cg-sparta-school-page.component';
import { SmeagCapitalSchoolPageComponent } from './smeag-capital-school/smeag-capital-school-page.component';
import { CpiSchoolPageComponent } from './cpi-school/cpi-school-page.component';
import { CpilsSchoolPageComponent } from './cpils-school/cpils-school-page.component';
import { EvSchoolPageComponent } from './ev-school/ev-school-page.component';
import { PinesSchoolPageComponent } from './pines-school/pines-school-page.component';
import { MonolSchoolDetailComponent } from './monol-school/monol-school-detail.component';
import { MonolSpartaSchoolPageComponent } from './monol-sparta-school/monol-sparta-school-page.component';
import { PhilinterSchoolDetailComponent } from './philinter-school/philinter-school-detail.component';
import { BCebuSchoolPageComponent } from './bcebu-school/bcebu-school-page.component';
import { GlcSchoolComponent } from './glc-school/glc-school.component';
import { IbreezeSchoolComponent } from './ibreeze-school/ibreeze-school.component';
import { AnjSchoolComponent } from './anj-school/anj-school.component';
import { ImsSchoolComponent } from './ims-school/ims-school.component';
import { BeciQuoteCalculatorComponent } from './beci-quote/beci-quote-calculator.component';
import { JicChallengerSchoolComponent } from './jic-school/jic-challenger-school.component';
import { JicPremiumSchoolComponent } from './jic-school/jic-premium-school.component';
import { IuSchoolComponent } from './iu-school/iu-school.component';
import { IclSchoolComponent } from './icl-school/icl-school.component';
import { CellaQuoteCalculatorComponent } from './cella-quote/cella-quote-calculator.component';
import { FellaSchoolDetailComponent } from './fella-school/fella-school-detail.component';
import { BtesSchoolComponent } from './btes-school/btes-school.component';
import { CboaSchoolPageComponent } from './cebu-blue-ocean-school/cboa-school-page.component';
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
import { LaMerSchoolPageComponent } from './la-mer-school/la-mer-school-page.component';
import { PhilippinesQuoteImageExporterComponent } from '../../components/philippines-quote-image-exporter.component';
const imageAlias = (page: any) => { Object.defineProperty(page, 'quoteImageData', { get: () => page.quoteImage }); return page; };
const schools = [
  { name: 'TARGET', create: () => new TargetSchoolComponent() },
  { name: 'CIP', create: () => imageAlias(new CipQuoteCalculatorComponent()) },
  { name: 'EV La Mer', create: () => new LaMerSchoolPageComponent() },
  { name: 'PINES IELTS', create: () => { const p = new PinesSchoolPageComponent(); p.students[0].quotePlan.courses[0].optionId = 'pre-ielts'; return p; } },
  { name: 'BECI Sparta', create: () => { const p = new BeciQuoteCalculatorComponent(); p.campus = 'sparta'; return p; } },
  { name: 'BECI City', create: () => { const p = new BeciQuoteCalculatorComponent(); p.campus = 'city'; return p; } },
  { name: 'JIC Premium', create: () => new JicPremiumSchoolComponent() },
  { name: 'Fella Second', create: () => { const p = new FellaSchoolDetailComponent(); p.students[0].setCampus('campus2'); return p; } },
  { name: 'CELLA Premium', create: () => { const p = new CellaQuoteCalculatorComponent(); p.initialCampus = 'premium'; return p; } },
  { name: "CIA", create: () => new CiaSchoolComponent() },
  { name: "CG Banilad", create: () => new CgBaniladSchoolPageComponent() },
  { name: "CG Sparta", create: () => new CgSpartaSchoolPageComponent() },
  { name: "SMEAG", create: () => new SmeagCapitalSchoolPageComponent() },
  { name: "CPI", create: () => new CpiSchoolPageComponent() },
  { name: "CPILS", create: () => new CpilsSchoolPageComponent() },
  { name: "EV", create: () => new EvSchoolPageComponent() },
  { name: "PINES", create: () => new PinesSchoolPageComponent() },
  { name: "MONOL", create: () => new MonolSchoolDetailComponent() },
  { name: "MONOL Sparta", create: () => new MonolSpartaSchoolPageComponent() },
  { name: "PHILINTER", create: () => new PhilinterSchoolDetailComponent() },
  { name: "B'Cebu", create: () => new BCebuSchoolPageComponent() },
  { name: "GLC", create: () => new GlcSchoolComponent() },
  { name: "I.BREEZE", create: () => new IbreezeSchoolComponent() },
  { name: "A&J", create: () => new AnjSchoolComponent() },
  { name: "IMS", create: () => new ImsSchoolComponent() },
  { name: "BECI", create: () => new BeciQuoteCalculatorComponent() },
  { name: "JIC", create: () => new JicChallengerSchoolComponent() },
  { name: "IU", create: () => new IuSchoolComponent() },
  { name: "ICL", create: () => new IclSchoolComponent() },
  { name: "CELLA", create: () => new CellaQuoteCalculatorComponent() },
  { name: "Fella", create: () => new FellaSchoolDetailComponent() },
  { name: "BTES", create: () => new BtesSchoolComponent() },
  { name: "Blue Ocean", create: () => new CboaSchoolPageComponent() },
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

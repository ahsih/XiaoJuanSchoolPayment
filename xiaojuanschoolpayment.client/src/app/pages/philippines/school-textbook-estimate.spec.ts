import { CellaStudentQuote } from './cella-quote/cella-student-quote';
import { CELLA_COURSES, CELLA_ROOMS } from './cella-quote/cella-pricing';
import { ImsPageStudent } from './ims-school/ims-page-quote';
import { createDefaultImsContentConfig } from './ims-school/ims-content-config';
import { textbookGroups, textbookPeriods } from './school-textbook-estimate';
import { CgPageStudent } from './cg-page-quote';
import { CG_BANILAD_RULES } from './cg-banilad-school/cg-banilad-page-quote';
import { CG_SPARTA_RULES } from './cg-sparta-school/cg-sparta-page-quote';
import { createCiaQuotePricing } from './cia-school/cia-quote-engine';
import { createDefaultCgBaniladContentConfig, cloneCgBaniladContentConfig } from './cg-banilad-school/cg-banilad-content-config';
import { createDefaultCgSpartaContentConfig, cloneCgSpartaContentConfig } from './cg-sparta-school/cg-sparta-content-config';
import { FellaPageStudent } from './fella-school/fella-page-quote';
import { createDefaultFellaContentConfig, fellaCampusContent } from './fella-school/fella-content-config';
const fellaStudent = (campus: 'campus1' | 'campus2' = 'campus2', edit?: (books: { amount: number; secondaryAmount?: number }) => void) => {
  const content = fellaCampusContent(createDefaultFellaContentConfig(), campus);
  if (edit) edit(content.localFees.find(x => x.id === 'books')!);
  return new FellaPageStudent(createCiaQuotePricing(content), campus);
};
const row = (id: number, optionId: string, weeks: number, startDate = '2027-02-14') => ({id, optionId, weeks, startDate});
describe('Course-type textbook budgets', () => {
  it('combines same-type rows but separates IELTS and business', () => {
    const rows = [row(1,'light-esl',4),row(2,'general-esl',4),row(3,'ielts',4),row(4,'business',4)];
    expect(textbookPeriods(rows,8)).toBe(3);
    expect(textbookPeriods([row(1,'general-esl',9)],8)).toBe(2);
    expect(textbookPeriods([row(1,'general-esl',1),row(2,'general-esl',3)],4)).toBe(1);
    expect(textbookGroups([row(1,'business',0)]).length).toBe(0);
  });
  for (const campus of ['banilad','sparta'] as const) {
    const config = () => campus === 'banilad' ? createDefaultCgBaniladContentConfig() : createDefaultCgSpartaContentConfig();
    const quote = () => new CgPageStudent(createCiaQuotePricing(config()), campus === 'banilad' ? CG_BANILAD_RULES : CG_SPARTA_RULES);
    it(campus + ' estimates each course type independently', () => {
      const q = quote();
      q.quotePlan.courses = [row(1,campus==='banilad'?'general-esl':'sparta',8),row(2,'ielts-basic',4,'2027-04-11'),row(3,campus==='banilad'?'business':'business-english',4,'2027-05-09')];
      expect(q.localFees.find(x=>x.item==='教材费')!.total).toBe(6000);
      const separate = quote(); expect(separate.localFees.find(x=>x.item==='教材费')!.total).toBe(2000);
    });
    it(campus + ' does not lose a discount when a four-week course is split into 1+3 weeks', () => {
      const q=quote(); const id=campus==='banilad'?'general-esl':'sparta';
      q.quotePlan.courses=[row(1,id,1),row(2,id,3,'2027-02-21')];
      expect(q.offSeasonDiscount).toBe(150);
      expect(q.localFees.find(x=>x.item==='教材费')!.total).toBe(2000);
    });
    for (const [date,discount] of [['2027-02-07',0],['2027-02-14',450],['2027-05-23',450],['2027-05-30',0],['2026-08-30',450]] as const) {
      it(campus + ' discount boundary ' + date, () => {
        const q=quote(); q.quotePlan.courses[0].startDate=date; q.quotePlan.courses[0].weeks=12;
        expect(q.offSeasonDiscount).toBe(discount);
      });
    }
    it(campus + ' upgrades older published defaults without resetting a disabled new promotion', () => {
      const c=config(); c.quoteSettings.promotions=c.quoteSettings.promotions.filter(x=>!x.id.endsWith('-2027'));
      const clone=campus==='banilad'?cloneCgBaniladContentConfig:cloneCgSpartaContentConfig;
      const upgraded=clone(c); const rule=upgraded.quoteSettings.promotions.find(x=>x.id.endsWith('-2027'))!;
      expect(rule.coverageEnd).toBe('2027-05-23'); rule.enabled=false;
      expect(clone(upgraded).quoteSettings.promotions.find(x=>x.id===rule.id)!.enabled).toBeFalse();
    });
  }
  it('charges Fella one set per course and does not repeat it for split rows',()=>{
    const q=fellaStudent();
    q.quotePlan.courses=[row(1,'pic-4',4),row(2,'pic-4',4)];
    expect(q.localFees.find(x=>x.item==='教材费')!.total).toBe(2500);
    q.quotePlan.courses[1].optionId='pift';
    expect(q.localFees.find(x=>x.item==='教材费')!.total).toBe(5000);
    q.quotePlan.courses=[row(1,'pic-4',6),row(2,'ebc',2,'2027-03-28')];
    expect(q.localFees.find(x=>x.item==='教材费')!.total).toBe(4000);
  });
});

describe('IMS textbook course switches',()=>{
  it('retains its own 3000-peso price for each type and combines repeated rows',()=>{
    const q=new ImsPageStudent(createCiaQuotePricing(createDefaultImsContentConfig()) as any);
    q.quotePlan.courses=[row(1,'essential-esl-4',4),row(2,'premium-esl',4)];
    expect(q.localFees.find(x=>x.item==='教材费')!.total).toBe(3000);
    q.quotePlan.courses[1].optionId='business-english';
    expect(q.localFees.find(x=>x.item==='教材费')!.total).toBe(6000);
  });
});

describe('Published textbook price overrides',()=>{
  it('CELLA reads the employee textbook amount without inventing an unspecified cycle',()=>{
    const fee={id:'books',name:'教材费',amount:2300,currency:'PHP' as const,billingRule:'per-course-period' as const,enabled:true,includeInTotal:true,sortOrder:0,note:'实购'};
    const q=new CellaStudentQuote({courses:[...CELLA_COURSES],rooms:[...CELLA_ROOMS],registrationFee:100,peakSeasonWeeklyFee:40,localFeeRules:[fee]},'uni');
    q.quotePlan.courses=[row(1,'uni-power-speaking-1',8),row(2,'uni-ielts-pre',4)];
    expect(q.localFees.find(x=>x.item===fee.name)!.total).toBe(4600);
    fee.includeInTotal=false;expect(q.localFees.some(x=>x.item===fee.name)).toBeFalse();
  });
  it('Fella reads the published textbook amounts',()=>{
    const q=fellaStudent('campus2',books=>{books.amount=1800;books.secondaryAmount=1200;});
    q.quotePlan.courses=[row(1,'pic-4',4),row(2,'pic-5',4)];expect(q.localFees.find(x=>x.item==='教材费')!.total).toBe(3600);
    q.quotePlan.courses=[row(1,'gec',8)];expect(q.localFees.find(x=>x.item==='教材费')!.total).toBe(1200);
  });
});

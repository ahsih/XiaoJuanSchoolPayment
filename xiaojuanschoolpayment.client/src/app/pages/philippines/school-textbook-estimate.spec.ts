import { BeciStudentQuote } from './beci-quote/beci-student-quote';
import { BECI_CAMPUS_PRICING } from './beci-quote/beci-pricing';
import { createDefaultBeciContentConfig } from './beci-school/beci-content-config';
import { CellaStudentQuote } from './cella-quote/cella-student-quote';
import { CELLA_COURSES, CELLA_ROOMS } from './cella-quote/cella-pricing';
import { ImsStudentQuote } from './ims-school/ims-student-quote';
import { textbookGroups, textbookPeriods } from './school-textbook-estimate';
import { CgBaniladStudentQuote } from './cg-banilad-school/cg-banilad-student-quote';
import { CgSpartaStudentQuote } from './cg-sparta-school/cg-sparta-student-quote';
import { createDefaultCgBaniladContentConfig, cloneCgBaniladContentConfig } from './cg-banilad-school/cg-banilad-content-config';
import { createDefaultCgSpartaContentConfig, cloneCgSpartaContentConfig } from './cg-sparta-school/cg-sparta-content-config';
import { FellaStudentQuote } from './fella-school/fella-student-quote';
import { FELLA_COURSE_FEES, FELLA_ROOM_FEES } from './fella-school/fella-pricing';
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
    const quote = () => {
      const c = config();
      const courses = c.courses.map(x => ({id:x.id,name:x.name,lessons:x.schedule,tuitionUsd:x.tuition}));
      const common = {roomOptions:c.rooms.map(x=>({id:x.id,name:x.name,feeUsd:x.fee})),weekOptions:[1,2,3,4,8,12,16,20,24],shortTermRatios:{1:.4,2:.6,3:.85},registrationFee:100,registrationFeeUsd:100,sidaDiscountRate:.9,offSeasonDiscountPerFourWeeks:150,summerFeePerWeek:40,promotionRules:c.quoteSettings.promotions,peakSeasonRanges:c.quoteSettings.peakSeasonRanges,localFeeRules:c.localFees};
      return campus === 'banilad' ? new CgBaniladStudentQuote({...common,courses}) : new CgSpartaStudentQuote({...common,courseOptions:courses});
    };
    it(campus + ' estimates each course type independently and supports manual correction', () => {
      const q = quote();
      q.quotePlan.courses = [row(1,campus==='banilad'?'general-esl':'sparta',8),row(2,'ielts-basic',4,'2027-04-11'),row(3,campus==='banilad'?'business':'business-english',4,'2027-05-09')];
      expect(q.localFees.find(x=>x.id==='books')!.total).toBe(6000);
      q.textbookCount=0; expect(q.localFees.find(x=>x.id==='books')!.total).toBe(0);
      q.resetTextbookCount(); expect(q.localFees.find(x=>x.id==='books')!.total).toBe(6000);
      const separate = quote(); expect(separate.localFees.find(x=>x.id==='books')!.total).toBe(2000);
    });
    it(campus + ' does not lose a discount when a four-week course is split into 1+3 weeks', () => {
      const q=quote(); const id=campus==='banilad'?'general-esl':'sparta';
      q.quotePlan.courses=[row(1,id,1),row(2,id,3,'2027-02-21')];
      expect(q.offSeasonDiscount).toBe(150);
      expect(q.localFees.find(x=>x.id==='books')!.total).toBe(2000);
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
  it('preserves Fella prices and charges separate types rather than duplicate segments',()=>{
    const q=new FellaStudentQuote({courseFees:FELLA_COURSE_FEES.map(x=>({...x})),roomFees:FELLA_ROOM_FEES.map(x=>({...x})),registrationFee:100});
    q.quotePlan.courses=[row(1,'esl',4),row(2,'esl',4)];
    expect(q.localFees.find(x=>x.item==='教材费')!.total).toBe(2500);
    q.quotePlan.courses[1].optionId='ielts';
    expect(q.localFees.find(x=>x.item==='教材费')!.total).toBe(5000);
  });
});

describe('IMS textbook course switches',()=>{
  it('retains its own 3000-peso price for each type and combines repeated rows',()=>{
    const q=new ImsStudentQuote();
    q.quotePlan.courses=[row(1,'esl',4),row(2,'esl',4)];
    expect(q.localFees.find(x=>x.item==='教材费')!.total).toBe(3000);
    q.quotePlan.courses[1].optionId='business';
    expect(q.localFees.find(x=>x.item==='教材费')!.total).toBe(6000);
  });
});

describe('Published textbook price overrides',()=>{
  it('BECI uses separate types with the published unit price and cycle',()=>{
    const c=createDefaultBeciContentConfig();const fee=c.localFees.find(x=>x.id==='books')!;
    fee.amount=1700;fee.periodWeeks=8;
    const q=new BeciStudentQuote(BECI_CAMPUS_PRICING.eop,{registrationFee:100,shortStayRatios:c.quoteSettings.shortStayRatios,peakSeasonFeePerWeek:40,peakSeasonRanges:c.quoteSettings.peakSeasonRanges,promotions:c.quoteSettings.promotions,localFees:c.localFees});
    q.quotePlan.courses=[row(1,'esl',4),row(2,'ielts',4)];
    expect(q.localFees.find(x=>x.item===fee.name)!.total).toBe(3400);
    q.quotePlan.courses[1].optionId='esl';expect(q.localFees.find(x=>x.item===fee.name)!.total).toBe(1700);
    fee.enabled=false;expect(q.localFees.some(x=>x.item===fee.name)).toBeFalse();
  });
  it('CELLA reads the employee textbook amount without inventing an unspecified cycle',()=>{
    const fee={id:'books',name:'教材费',amount:2300,currency:'PHP' as const,billingRule:'per-course-period' as const,enabled:true,includeInTotal:true,sortOrder:0,note:'实购'};
    const q=new CellaStudentQuote({courses:[...CELLA_COURSES],rooms:[...CELLA_ROOMS],registrationFee:100,peakSeasonWeeklyFee:40,localFeeRules:[fee]},'uni');
    q.quotePlan.courses=[row(1,'uni-power-speaking-1',8),row(2,'uni-ielts-pre',4)];
    expect(q.localFees.find(x=>x.item===fee.name)!.total).toBe(4600);
    fee.includeInTotal=false;expect(q.localFees.some(x=>x.item===fee.name)).toBeFalse();
  });
  it('Fella groups PIC and IELTS aliases from its real catalog',()=>{
    const rules=[{id:'books',name:'教材费',amount:1800,currency:'PHP' as const,billingRule:'per-course-period' as const,periodWeeks:8,enabled:true,includeInTotal:true,sortOrder:0,note:'实购'}];
    const q=new FellaStudentQuote({courseFees:FELLA_COURSE_FEES,roomFees:FELLA_ROOM_FEES,registrationFee:100,localFeeRules:rules});
    q.quotePlan.courses=[row(1,'pic-4',4),row(2,'pic-5',4)];expect(q.localFees.find(x=>x.item==='教材费')!.total).toBe(1800);
    q.quotePlan.courses=[row(1,'pift',4),row(2,'pirc',4)];expect(q.localFees.find(x=>x.item==='教材费')!.total).toBe(1800);
    q.quotePlan.courses[1].optionId='ebc';expect(q.localFees.find(x=>x.item==='教材费')!.total).toBe(3600);
  });
});

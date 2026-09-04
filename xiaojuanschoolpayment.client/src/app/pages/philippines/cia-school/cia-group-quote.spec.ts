import { TestBed } from '@angular/core/testing';
import { EMPTY, of } from 'rxjs';
import { ExchangeRateService } from '../../../../services/exchange-rate.service';
import { SchoolService } from '../../../../services/school.service';
import { CiaSchoolComponent } from './cia-school.component';
import { CiaStudentQuote } from './cia-student-quote';
import { groupPaymentLines } from '../../../components/school-group-quote';

describe('CIA per-person quote pilot', () => {
  let c: CiaSchoolComponent;
  const configure = (s: CiaStudentQuote, weeks = 4, start = '2026-09-06') => {
    s.selectedRegistrationDate = '2026-09-05';
    s.quotePlan.courses = [{id:1,optionId:'regular-esl',weeks,startDate:start}];
    s.quotePlan.rooms = [{id:2,optionId:'d4',weeks,startDate:start}];
  };
  const fee = (s: CiaStudentQuote, name: string) => s.localFees.find(f=>f.item.includes(name))!;
  beforeEach(() => {
    TestBed.configureTestingModule({providers:[
      {provide:SchoolService,useValue:{getSchools:()=>of([])}},
      {provide:ExchangeRateService,useValue:{getLatestCnyRates:()=>EMPTY}},
    ]});
    c = TestBed.runInInjectionContext(()=>new CiaSchoolComponent());
    configure(c.students[0]);
  });
  it('preserves CIA prices and short-stay ratios, not IBREEZE prices', () => {
    const course = c.courseFees.find(x=>x.id==='regular-esl')!, room=c.roomFees.find(x=>x.id==='d4')!;
    for (const [weeks, ratio] of [[1,.4],[2,.6],[3,.8],[4,1],[8,2],[24,6]]) {
      configure(c.students[0],weeks);
      expect(c.tuitionForSelectedWeeks).toBe(course.tuition*ratio);
      expect(c.roomFeeForSelectedWeeks).toBe(room.fee*ratio);
      expect(c.payableRegistrationFee).toBe(c.students[0].christmasEligible ? 0 : c.registrationFee);
    }
  });
  it('does not override selected tuition for minors', () => {
    for (const course of c.courseFees) {
      c.selectedCourseId=course.id;
      const adult=c.quoteUsd;
      c.students[0].selectedAgeGroup='minor';
      expect(c.quoteUsd).toBe(adult);
      c.students[0].selectedAgeGroup='adult';
    }
  });
  it('uses each registration date and course period for 2027 pricing', () => {
    c.setQuoteMode('group');
    c.students.forEach(s=>configure(s,4,'2027-01-03'));
    c.students[0].selectedRegistrationDate='2026-08-31';
    const course=c.courseFees.find(x=>x.id==='regular-esl')!;
    expect(c.students[0].tuition).toBe(course.tuition);
    expect(c.students[1].tuition).toBe(course.tuition2027);
  });
  it('charges registration per new student, never per course or room', () => {
    c.setQuoteMode('group');
    c.students.forEach(s=>configure(s));
    c.quotePlan.add('course'); c.quotePlan.add('room');
    expect(c.payableRegistrationFee).toBe(2*c.registrationFee);
    c.students[1].returningStudent=true;
    expect(c.payableRegistrationFee).toBe(c.registrationFee);
    c.students[0].returningStudent=true;
    expect(c.payableRegistrationFee).toBe(0);
    expect(c.registrationNote).toContain('老学员返校免费');
  });
  it('requires complete Christmas course AND room coverage per student', () => {
    c.setQuoteMode('group');
    configure(c.students[0],2,'2026-12-20');
    configure(c.students[1],1,'2026-12-20');
    expect(c.students[0].christmasDiscount).toBe(200);
    expect(c.students[0].registration).toBe(0);
    expect(c.students[1].christmasDiscount).toBe(0);
    expect(c.payableRegistrationFee).toBe(c.registrationFee);
    const promo=c.quoteImageData.paymentItems!.find(x=>x.label.includes('圣诞'))!;
    expect(promo.label).toContain('学生1');
    c.students[0].returningStudent=true;
    expect(c.students[0].registration).toBe(0);
    c.students[0].quotePlan.rooms[0].weeks=1;
    expect(c.students[0].christmasDiscount).toBe(0);
  });
  it('merges equal discounts in images but retains per-person webpage deductions', () => {
    c.setQuoteMode('group'); c.students.forEach(s=>configure(s));
    expect(c.schoolPaymentItems.filter(x=>x.label.includes('思达折扣')).length).toBe(2);
    const discounts=c.quoteImageData.paymentItems!.filter(x=>x.label.includes('思达折扣'));
    expect(discounts.length).toBe(1);
    expect(discounts[0].note).toBe('2人适用；课程费和住宿费享95折');
    expect(discounts[0].amount).toBe('− '+c.formatUsd(c.sidaDiscountAmount)+' 美元');
  });
  it('retains distinct conditions and partial eligibility when merging', () => {
    const line=(note:string)=>({icon:'惠',label:'优惠',value:-100,note,promotionKey:'promo'});
    const grouped=groupPaymentLines([{paymentLines:[line('条件A')]},{paymentLines:[]},{paymentLines:[line('条件B')]}],true);
    expect(grouped[0].amount).toBe('− 200 美元');
    expect(grouped[0].note).toContain('学生1：条件A');
    expect(grouped[0].note).toContain('学生3：条件B');
  });
  for (const visa of ['student','work','srrv','sirv'] as const) {
    it(visa+' zeroes only four fees and still charges ARP', () => {
      const s=c.students[0]; configure(s,24); s.visaType=visa;
      for (const name of ['SSP特殊','SSP-E','ACR-I','签证续签']) {
        expect(fee(s,name).quantity).toBe(0); expect(fee(s,name).total).toBe(0);
        expect(fee(s,name).note).toContain('须由顾问向学校确认政策是否调整及是否免收');
      }
      expect(fee(s,'ARP').total).toBe(300);
      expect(fee(s,'ARP').note).toContain('长期签证仍计收');
    });
  }
  it('uses 30/59 initial days and adds ARP only on first tourist extension', () => {
    const s=c.students[0];
    for (const [weeks,thirty,fiftyNine] of [[4,0,0],[6,1,0],[8,1,0],[12,2,1],[24,5,4]]) {
      configure(s,weeks);
      s.visaType='tourist30'; expect(s.visaExtensionCount).toBe(thirty);
      expect(fee(s,'ARP').total).toBe(thirty?300:0);
      s.visaType='tourist59'; expect(s.visaExtensionCount).toBe(fiftyNine);
      expect(fee(s,'ARP').total).toBe(fiftyNine?300:0);
    }
    expect(fee(s,'签证续签').total).toBe(6410+4540*3);
    expect(fee(s,'签证续签').note).not.toContain('12周');
  });
  it('sums each student local fees and retains different visa conditions', () => {
    c.setQuoteMode('group'); configure(c.students[0],8); configure(c.students[1],12);
    c.students[0].visaType='tourist30'; c.students[1].visaType='sirv';
    expect(c.estimatedLocalFeeTotal).toBe(c.students.reduce((sum,s)=>sum+s.localFees.reduce((a,f)=>a+f.total,0),0));
    expect(c.estimatedLocalFees.filter(x=>x.item.includes('SSP特殊')).length).toBe(2);
    expect(c.estimatedLocalFees.find(x=>x.item.includes('学生2')&&x.item.includes('SSP特殊'))!.total).toBe(0);
    expect(c.quoteImageData.localFeeItems!.map(x=>x.note)).toEqual(c.estimatedLocalFees.map(x=>x.note));
  });
  it('counts accommodation and textbooks from their own periods; visas include gaps', () => {
    const s=c.students[0]; configure(s,4);
    s.quotePlan.courses.push({id:3,optionId:'regular-esl',weeks:4,startDate:'2026-11-01'});
    expect(fee(s,'综合管理').total).toBe(4000);
    expect(fee(s,'教材').total).toBe(2000);
    expect(s.visaExtensionCount).toBe(1);
    expect(s.quotePlan.warning).toBeTruthy();
  });
  it('allows equal dates across people but blocks overlaps within a person', () => {
    c.setQuoteMode('group'); c.students.forEach(s=>configure(s));
    expect(c.quoteError).toBe('');
    c.students[1].quotePlan.courses.push({...c.students[1].quotePlan.courses[0],id:3});
    expect(c.quoteError).toContain('学生2');
  });
  it('retains inactive student choices and validates person counts', () => {
    c.setQuoteMode('group'); c.studentCount=3; c.students[2].returningStudent=true;
    c.studentCount=2; expect(c.activeStudents.length).toBe(2);
    c.studentCount=3; expect(c.students[2].returningStudent).toBeTrue();
    c.setQuoteMode('single'); expect(c.activeStudents.length).toBe(1);
    c.setQuoteMode('group'); expect(c.activeStudents.length).toBe(3);
    for(const count of [0,1,2.5,21,NaN]) {c.studentCount=count;expect(c.quoteError).toBeTruthy();}
  });
  it('shows IAU once per student and does not silently include it in totals', () => {
    c.setQuoteMode('group'); c.students.forEach(s=>{configure(s);s.quotePlan.courses[0].optionId='college-immersion';s.quotePlan.add('course');s.quotePlan.courses[1].optionId='college-immersion';});
    expect(c.iauRegistrationFeeNote.match(/50美元/g)!.length).toBe(2);
    expect(c.iauRegistrationFeeNote).toContain('学生1');
    expect(c.iauRegistrationFeeNote).toContain('学生2');
    expect(c.quoteImageData.totalNote).toBe(c.iauRegistrationFeeNote);
  });
  it('charges known per-person deposits but keeps pickup as a reference', () => {
    c.setQuoteMode('group'); c.studentCount=3;
    expect(c.optionalFeeItems[1].amount).toBe('7,500 比索');
    expect(c.optionalFeeItems[0].amount).toBe('周末1,000比索／工作日1,500比索');
    expect(c.optionalFeeItems.every(f=>f.cnyAmount.includes('人民币'))).toBeTrue();
  });
  it('keeps names ahead of prices and one common template for 1/3/4 periods', () => {
    for(const count of [1,3,4]) {
      configure(c.students[0]);
      while(c.quotePlan.courses.length<count){c.quotePlan.add('course');c.quotePlan.add('room');}
      const image=c.quoteImageData, rows=image.paymentItems!.filter(x=>x.icon==='课'||x.icon==='宿');
      expect(rows.length).toBe(count*2);
      expect(rows.every(x=>!!x.detailTitle&&!!x.detailSubtitle)).toBeTrue();
      expect(rows.every(x=>/名称/.test(x.label))).toBeTrue();
      if(count===1)expect(rows.map(x=>x.label)).toEqual(['课程名称','住宿名称']);
      expect(image.headingText).toBe('CIA'+(count*4)+'周报价');
      expect(image.conversionRates!.usdToCny).toBe(c.usdToCny);
    }
  });
});

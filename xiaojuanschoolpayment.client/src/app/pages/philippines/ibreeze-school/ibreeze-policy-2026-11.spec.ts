import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { SchoolService } from '../../../../services/school.service';
import { SchoolContentService } from '../../../../services/school-content.service';
import { ExchangeRateService, chinaToday } from '../../../../services/exchange-rate.service';
import { IbreezeSchoolComponent } from './ibreeze-school.component';
import { IbreezeStudentQuote } from './ibreeze-student-quote';
import { createDefaultIbreezeContentConfig, cloneIbreezeContentConfig } from './ibreeze-content-config';
import { IBREEZE_COURSES, IBREEZE_ROOMS } from './ibreeze-catalog';
import { QuoteImageDownloadButtonComponent } from '../../../components/quote-image-download-button.component';

describe('I.BREEZE November 2026 policy and 2027 registration prices', () => {
  const make = (registration = '2026-11-10', arrival = '2026-11-15', weeks = 4, course = 'power-esl', room = 'twin-main') => {
    const config = createDefaultIbreezeContentConfig();
    const q = new IbreezeStudentQuote({ courseOptions: IBREEZE_COURSES, roomOptions: IBREEZE_ROOMS,
      registrationFee: 150, seasonalFeePerWeek: 40, usdToCny: 7, phpPerCny: 9, exchangeRateDate: '2026-11-10', exchangeRateLive: true,
      contentConfig: () => config });
    q.selectedRegistrationDate = registration;
    q.quotePlan.courses[0] = { id: 1, optionId: course, startDate: arrival, weeks };
    q.quotePlan.rooms[0] = { id: 2, optionId: room, startDate: arrival, weeks };
    return { q, config };
  };
  it('switches the entire student catalogue by registration date, including old registrations arriving in 2027', () => {
    const {q} = make('2026-12-31', '2027-02-07');
    expect(q.tuitionForSelectedWeeks).toBe(990); expect(q.roomFeeForSelectedWeeks).toBe(900);
    expect(q.novemberPromotionDiscount).toBe(100);
    q.selectedRegistrationDate = '2027-01-01';
    expect(q.tuitionForSelectedWeeks).toBe(1040); expect(q.roomFeeForSelectedWeeks).toBe(950);
    expect(q.novemberPromotionDiscount).toBe(0); expect(q.quoteUsd).toBe(2040.5);
  });
  it('matches the official four-week course and room rows, including unchanged prices', () => {
    const {q} = make('2027-01-01', '2027-02-07');
    expect(IBREEZE_COURSES.map(c => { q.quotePlan.courses[0].optionId = c.id; return q.tuitionForSelectedWeeks; }))
      .toEqual([770,890,890,1040,1040,1040,1190,1020,1290]);
    expect(IBREEZE_ROOMS.map(r => { q.quotePlan.rooms[0].optionId = r.id; return q.roomFeeForSelectedWeeks; }))
      .toEqual([720,790,950,1350,750,990,1390,1490,1450,1050,1100,890]);
  });
  it('uses exact short-stay tuition and room amounts instead of invented ratios', () => {
    const {q} = make('2027-01-01', '2027-02-07', 1, 'power-esl', 'single-main');
    expect(q.tuitionForSelectedWeeks).toBe(400); expect(q.roomFeeForSelectedWeeks).toBe(550);
    expect(q.quoteUsd).toBe(1052.5); expect(q.quoteError).toBe('');
    q.quotePlan.updateWeeks('course', 1, 2); q.quotePlan.rooms[0].optionId = 'twin-main';
    expect(q.tuitionForSelectedWeeks).toBe(650); expect(q.roomFeeForSelectedWeeks).toBe(595);
    q.quotePlan.updateWeeks('course', 1, 3); q.quotePlan.courses[0].optionId = 'ielts-starter'; q.quotePlan.rooms[0].optionId = 'twin-ib2';
    expect(q.tuitionForSelectedWeeks).toBe(890); expect(q.roomFeeForSelectedWeeks).toBe(810);
    expect(q.quoteUsd).toBe(1765); expect(q.quoteError).toBe('');
  });
  it('blocks unpublished short stays and unlisted long specialised courses', () => {
    const {q} = make('2027-01-01', '2027-02-07', 2, 'ielts-starter');
    expect(q.quoteError).toContain('未公布');
    q.quotePlan.updateWeeks('course', 1, 3); q.quotePlan.courses[0].optionId = 'ielts-target'; expect(q.quoteError).toContain('未公布');
    q.quotePlan.updateWeeks('course', 1, 12); q.quotePlan.courses[0].optionId = 'ielts-starter'; expect(q.quoteError).toContain('仅列至8周');
    q.quotePlan.courses[0].optionId = 'general-business-and-bec'; expect(q.quoteError).toContain('仅列至4周');
    q.selectedRegistrationDate = '2026-12-31'; q.quotePlan.updateWeeks('course', 1, 2); expect(q.quoteError).toContain('2026价目表');
  });
  it('prices one-week segments within a longer plan using the student total-course tier', () => {
    const {q} = make('2027-01-01', '2027-02-07');
    q.quotePlan.courses = [{id:1, optionId:'power-esl',startDate:'2027-02-07',weeks:1}, {id:3,optionId:'light-esl',startDate:'2027-02-14',weeks:3}];
    expect(q.tuitionForSelectedWeeks).toBe(927.5); expect(q.roomFeeForSelectedWeeks).toBe(950);
    expect(q.quoteError).toBe('');
    q.quotePlan.courses = [{id:1,optionId:'power-esl',startDate:'2027-02-07',weeks:20}]; q.quotePlan.rooms[0].weeks=20;
    expect(q.tuitionForSelectedWeeks).toBe(5200); expect(q.roomFeeForSelectedWeeks).toBe(4750);
  });
  it('limits the agency deduction to 5% of tuition and rooms before school offers, without other fees', () => {
    const {q,config} = make();
    expect(q.sidaDiscountAmount).toBe(94.5); expect(q.novemberPromotionDiscount).toBe(100); expect(q.quoteUsd).toBe(1845.5);
    config.quoteSettings.promotions.find(p=>p.id==='sida-discount')!.discountValue=10;
    expect(q.sidaDiscountAmount).toBe(94.5);
    q.returningStudent=true; expect(q.sidaDiscountAmount).toBe(94.5); expect(q.quoteUsd).toBe(1695.5);
  });
  it('honours both registration endpoints and the inclusive last arrival date', () => {
    const {q} = make('2026-11-01','2027-05-02'); expect(q.novemberPromotionDiscount).toBe(100);
    q.selectedRegistrationDate='2026-12-31'; expect(q.novemberPromotionDiscount).toBe(100);
    q.selectedRegistrationDate='2026-10-31'; expect(q.novemberPromotionDiscount).toBe(0);
    q.selectedRegistrationDate='2027-01-01'; expect(q.novemberPromotionDiscount).toBe(0);
    q.selectedRegistrationDate='2026-11-10'; q.quotePlan.updateStartDate('course',1,'2027-05-09'); expect(q.novemberPromotionDiscount).toBe(0);
  });
  it('removes only the three blackout weeks and stacks Christmas once', () => {
    const {q} = make('2026-11-10','2026-12-20',8);
    expect(q.novemberPromotionDiscount).toBe(125); expect(q.christmasPromotionDiscount).toBe(100); expect(q.quoteUsd).toBe(3516);
    expect(q.schoolPaymentItems.find(item=>item.label==='11月住宿优惠')!.note).not.toContain('三人间');
    q.quotePlan.updateStartDate('course',1,'2027-01-03'); q.quotePlan.updateWeeks('course',1,4);
    expect(q.novemberPromotionDiscount).toBe(25); expect(q.christmasPromotionDiscount).toBe(0);
    q.quotePlan.rooms[0].optionId='quad-main'; expect(q.novemberPromotionDiscount).toBe(50);
    q.quotePlan.updateStartDate('course',1,'2027-01-24'); expect(q.novemberPromotionDiscount).toBe(200);
  });
  it('does not change accommodation savings when an identical room is split into segments', () => {
    const {q} = make('2026-11-10','2026-12-20',8); const discount=q.novemberPromotionDiscount;
    q.quotePlan.rooms=[{id:2,optionId:'twin-main',startDate:'2026-12-20',weeks:1},{id:4,optionId:'twin-main',startDate:'2026-12-27',weeks:7}];
    expect(q.novemberPromotionDiscount).toBe(discount);
    q.quotePlan.rooms[1].optionId='off-campus-family'; expect(q.novemberPromotionDiscount).toBe(25);
  });
  it('confirms the school-specific 40-dollar summer rate, minimum stay and family-only condo restriction', () => {
    const {q} = make('2027-01-01','2027-06-27',8,'power-esl','off-campus-standard-single');
    expect(q.seasonalSurcharge).toBe(280); expect(q.quoteError).toContain('仅接受家庭');
    q.familyTravel=true; expect(q.quoteError).toBe('');
    q.quotePlan.updateWeeks('course',1,3); expect(q.quoteError).toContain('最短报名4周');
    q.quotePlan.updateWeeks('course',1,4); q.quotePlan.updateStartDate('course',1,'2027-08-08'); expect(q.seasonalSurcharge).toBe(40);
    q.quotePlan.updateStartDate('course',1,'2027-08-15'); expect(q.seasonalSurcharge).toBe(0);
  });
  it('upgrades a legacy publication once while keeping employee notes, 2026 rates and unrelated fees', () => {
    const old=createDefaultIbreezeContentConfig(); delete old.quoteSettings.ibreezePolicyVersion;
    old.courses[0].tuition=777; old.courses[0].tuition2027=777; old.courses[0].note='员工课程说明';
    old.rooms[0].fee2027=123; old.localFees[0].amount=8001;
    old.quoteSettings.promotions=old.quoteSettings.promotions.filter(p=>!p.id.startsWith('november-'));
    old.quoteSettings.promotions.find(p=>p.id==='sida-discount')!.discountValue=10;
    old.quoteImageSettings.benefits[1]={title:'价格保护',text:'更低价退差价'};
    const next=cloneIbreezeContentConfig(old);
    expect(next.courses[0].tuition).toBe(777); expect(next.courses[0].tuition2027).toBe(770); expect(next.courses[0].note).toBe('员工课程说明');
    expect(next.localFees[0].amount).toBe(8001); expect(next.quoteSettings.promotions.filter(p=>p.id.startsWith('november-')).length).toBe(2);
    expect(next.quoteSettings.promotions.find(p=>p.id==='sida-discount')!.discountValue).toBe(5);
    expect(JSON.stringify(next.quoteImageSettings.benefits)).not.toContain('退差价');
    next.courses[0].tuition2027=780; expect(cloneIbreezeContentConfig(next).courses[0].tuition2027).toBe(780);
    expect(old.courses[0].tuition2027).toBe(777);
  });
  it('uses Junior tuition for minors in each price year and keeps guardian fees outside discounts', () => {
    const {q}=make('2027-01-01','2027-02-07'); q.selectedAgeGroup='16-17'; q.minorWithoutParent=true;
    expect(q.tuitionForSelectedWeeks).toBe(1290); expect(q.minorManagementFee).toBe(100);
    expect(q.sidaDiscountAmount).toBe(112); expect(q.optionalFeeItems[0].amount).toBe('已含');
    q.selectedAgeGroup='adult'; expect(q.minorManagementFee).toBe(0);
  });

  describe('shared webpage and quote image', () => {
    let c: IbreezeSchoolComponent;
    beforeEach(()=>{
      TestBed.configureTestingModule({providers:[
        {provide:SchoolService,useValue:{getSchools:()=>of([])}}, {provide:SchoolContentService,useValue:{getPublished:()=>of(null)}},
        {provide:ExchangeRateService,useValue:{getLatestCnyRates:()=>of({usdToCny:7,phpPerCny:9,date:chinaToday()})}},
        {provide:ActivatedRoute,useValue:{snapshot:{queryParamMap:{get:()=>null}}}}, {provide:ElementRef,useValue:new ElementRef(document.createElement('div'))},
      ]});
      c=TestBed.runInInjectionContext(()=>new IbreezeSchoolComponent()); c.usdToCny=7; c.phpPerCny=9;
    });
    it('keeps mixed-year students independent and aggregates school offers from their numeric deductions',()=>{
      c.setQuoteMode('group');
      c.activeStudents.forEach((s,i)=>{s.selectedRegistrationDate=i?'2027-01-01':'2026-12-31';s.quotePlan.updateStartDate('course',1,'2027-02-07');s.quotePlan.courses[0].optionId='power-esl';s.quotePlan.rooms[0].optionId='twin-main';});
      expect(c.activeStudents.map(s=>s.quoteUsd)).toEqual([1845.5,2040.5]); expect(c.quoteUsd).toBe(3886);
      const image=c.quoteImageData;
      expect(image.paymentItems.find(row=>row.label==='思达折扣')!.amount).toBe('− 194 美元');
      expect(image.paymentItems.find(row=>row.label==='学生1 · 11月住宿优惠')!.amount).toBe('− 100 美元');
      expect(image.paymentItems.filter(row=>row.icon==='课').map(row=>row.amount)).toEqual(['990 美元','1,040 美元']);
      expect(JSON.stringify(image)).not.toContain('9折'); expect(JSON.stringify(image)).not.toContain('退差价');
    });
    it('renders a complete quote image with the current deduction and footer',async()=>{
      const s=c.students[0];s.selectedRegistrationDate='2026-11-10';s.quotePlan.updateStartDate('course',1,'2026-12-20');s.quotePlan.updateWeeks('course',1,8);
      const renderer=TestBed.runInInjectionContext(()=>new QuoteImageDownloadButtonComponent());renderer.quote=c.quoteImageData;
      const paint:string[]=[];const original=CanvasRenderingContext2D.prototype.fillText;
      spyOn(CanvasRenderingContext2D.prototype,'fillText').and.callFake(function(this:CanvasRenderingContext2D,text,x,y){paint.push(text);original.call(this,text,x,y);});
      const blob=await renderer['createQuoteImageBlob'](1);
      expect(blob.type).toBe('image/png');expect(blob.size).toBeGreaterThan(30000);
      expect(paint).toContain('11月住宿优惠');expect(paint.some(text=>text.includes('报价说明'))).toBeTrue();
      expect(paint.some(text=>text.includes('退差价'))).toBeFalse();
    },30000);
  });
});

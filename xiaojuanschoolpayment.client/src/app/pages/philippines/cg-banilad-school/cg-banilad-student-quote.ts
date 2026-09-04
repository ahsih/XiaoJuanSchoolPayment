import { SchoolQuotePlan } from '../../../components/school-quote-plan';
import { SCHOOL_VISA_OPTIONS, SchoolPaymentLine } from '../../../components/school-group-quote';
import { CgVisaType, estimateCgLocalFees } from '../cg-local-fees';

interface BaniladPrices {
  courses: {id:string;name:string;lessons:string;tuitionUsd:number}[];
  roomOptions: {id:string;name:string;feeUsd:number}[];
  weekOptions: number[];
  shortTermRatios: Partial<Record<number,number>>;
  registrationFeeUsd:number; sidaDiscountRate:number; offSeasonDiscountPerFourWeeks:number;
  summerFeePerWeek:number;
}
const rounded=(value:number)=>Math.round((value+Number.EPSILON)*100)/100;
export class CgBaniladStudentQuote {
  selectedAgeGroup:'adult'|'minor'='adult';
  returningStudent=false;
  selectedRegistrationDate=new Date().toLocaleDateString('en-CA');
  readonly visaOptions=SCHOOL_VISA_OPTIONS;
  visaType:CgVisaType='tourist59';
  readonly quotePlan:SchoolQuotePlan;
  constructor(private readonly prices:BaniladPrices) {
    this.quotePlan=new SchoolQuotePlan('general-esl','quad','2026-09-06',prices.weekOptions,
      kind=>kind==='course'?prices.courses.map(x=>({id:x.id,name:x.name,details:x.lessons})):prices.roomOptions.map(x=>({id:x.id,name:x.name,details:''})),
      (kind,row)=>{
        const base=kind==='course'?prices.courses.find(x=>x.id===row.optionId)?.tuitionUsd:prices.roomOptions.find(x=>x.id===row.optionId)?.feeUsd;
        return (base??0)*(prices.shortTermRatios[row.weeks]??row.weeks/4);
      });
  }
  get error(){
    if(this.quotePlan.error)return this.quotePlan.error;
    if(this.quotePlan.date(this.selectedRegistrationDate)===null)return '请选择有效的报名注册日期。';
    if(!['adult','minor'].includes(this.selectedAgeGroup))return '请选择抵达时年龄段。';
    return this.visaOptions.some(x=>x.value===this.visaType)?'':'请选择有效的签证类型。';
  }
  get registration(){return this.returningStudent?0:this.prices.registrationFeeUsd;}
  get tuition(){return this.quotePlan.total('course');}
  get accommodation(){return this.quotePlan.total('room');}
  get studyStay(){return this.tuition+this.accommodation;}
  get sidaDiscount(){return rounded(this.studyStay*(1-this.prices.sidaDiscountRate));}
  get offSeasonDiscount(){return this.quotePlan.courses.filter(r=>this.quotePlan.date(r.startDate)!==null&&r.startDate>='2026-08-30'&&r.startDate<='2026-12-27').reduce((s,r)=>s+Math.floor(r.weeks/4)*this.prices.offSeasonDiscountPerFourWeeks,0);}
  get longStayDiscount(){return ({12:50,16:100,20:150,24:200} as Record<number,number>)[this.quotePlan.courseWeeks]??0;}
  get summerWeeks(){return this.quotePlan.overlapWeeks('2026-07-05','2026-08-30',[...this.quotePlan.courses,...this.quotePlan.rooms]);}
  get summerSurcharge(){return this.summerWeeks*this.prices.summerFeePerWeek;}
  get quoteUsd(){return Math.max(0,rounded(this.registration+this.studyStay-this.sidaDiscount-this.offSeasonDiscount-this.longStayDiscount+this.summerSurcharge));}
  get paymentLines():SchoolPaymentLine[]{return [
    {icon:'折',label:'思达折扣',value:-this.sidaDiscount,note:'课程费和住宿费享9折',promotionKey:'sida'},
    ...(this.offSeasonDiscount?[{icon:'淡',label:'淡季优惠',value:-this.offSeasonDiscount,note:'2026/08/30–2026/12/27入学，每满4周优惠150美元',promotionKey:'offseason'}]:[]),
    ...(this.longStayDiscount?[{icon:'长',label:'长期优惠',value:-this.longStayDiscount,note:`本次${this.quotePlan.courseWeeks}周，按已公布档位优惠`,promotionKey:'longstay'}]:[]),
    ...(this.summerSurcharge?[{icon:'暑',label:'暑假附加费',value:this.summerSurcharge,note:`2026/07/05–2026/08/30；40美元／周／人 × ${this.summerWeeks}周`}]:[]),
  ];}
  get localFees(){return estimateCgLocalFees(this.quotePlan.stayWeeks,false,this.quotePlan.roomWeeks,this.visaType).fees;}
}

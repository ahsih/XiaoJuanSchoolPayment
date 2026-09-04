import { SchoolQuotePlan, QuotePlanRow } from '../../../components/school-quote-plan';
import { SCHOOL_VISA_OPTIONS, SchoolPaymentLine } from '../../../components/school-group-quote';
import { CgVisaType, estimateCgLocalFees } from '../cg-local-fees';

interface SpartaPrices {
  courseOptions:{id:string;name:string;lessons:string;tuitionUsd:number}[];
  roomOptions:{id:string;name:string;feeUsd:number}[];
  weekOptions:number[];registrationFee:number;sidaDiscountRate:number;
  offSeasonDiscountPerFourWeeks:number;summerFeePerWeek:number;
}
const DAY=86400000;
const rounded=(v:number)=>Math.round((v+Number.EPSILON)*100)/100;
export class CgSpartaStudentQuote {
  selectedAgeGroup:'adult'|'minor'='adult';
  returningStudent=false;
  selectedRegistrationDate=new Date().toLocaleDateString('en-CA');
  readonly visaOptions=SCHOOL_VISA_OPTIONS;
  visaType:CgVisaType='tourist59';
  readonly quotePlan:SchoolQuotePlan;
  constructor(private readonly p:SpartaPrices){
    this.quotePlan=new SchoolQuotePlan('sparta','quad','2026-09-06',p.weekOptions,
      kind=>kind==='course'?p.courseOptions.map(x=>({id:x.id,name:x.name,details:x.lessons})):p.roomOptions.map(x=>({id:x.id,name:x.name,details:''})),
      (kind,row)=>{
        const base=kind==='course'?p.courseOptions.find(x=>x.id===row.optionId)?.tuitionUsd:p.roomOptions.find(x=>x.id===row.optionId)?.feeUsd;
        return (base??0)*this.multiplier(row.weeks);
      },52);
  }
  multiplier(w:number){return w===1?.4:w===2?.6:w===3?.85:w/4;}
  get error(){
    if(this.quotePlan.error)return this.quotePlan.error;
    if(this.quotePlan.date(this.selectedRegistrationDate)===null)return '请选择有效的报名注册日期。';
    if(!['adult','minor'].includes(this.selectedAgeGroup))return '请选择抵达时年龄段。';
    return this.visaOptions.some(x=>x.value===this.visaType)?'':'请选择有效的签证类型。';
  }
  get registration(){return this.returningStudent?0:this.p.registrationFee;}
  get tuition(){return this.quotePlan.total('course');}
  get accommodation(){return this.quotePlan.total('room');}
  get packageFee(){return this.tuition+this.accommodation;}
  get sidaDiscount(){return rounded(this.packageFee*(1-this.p.sidaDiscountRate));}
  private dateAt(date:string,weeks:number){const d=this.quotePlan.date(date);return d===null?'':new Date(d+weeks*7*DAY).toISOString().slice(0,10);}
  get coursePeriods(){
    const dates=this.quotePlan.weekStarts().map(x=>new Date(x).toISOString().slice(0,10)),out:{startDate:string;weeks:number}[]=[];
    for(const date of dates){const last=out.at(-1);if(last&&this.dateAt(last.startDate,last.weeks)===date)last.weeks++;else out.push({startDate:date,weeks:1});}return out;
  }
  get offSeasonDiscount(){return this.coursePeriods.filter(x=>x.startDate>='2026-08-30'&&x.startDate<='2026-12-27').reduce((s,x)=>s+Math.floor(x.weeks/4)*this.p.offSeasonDiscountPerFourWeeks,0);}
  get longStayDiscount(){return this.coursePeriods.reduce((s,x)=>s+Math.max(0,Math.min(200,(Math.floor(x.weeks/4)-2)*50)),0);}
  get summerWeeks(){return this.quotePlan.overlapWeeks('2026-07-05','2026-08-30',[...this.quotePlan.courses,...this.quotePlan.rooms]);}
  get summerSurcharge(){return this.summerWeeks*this.p.summerFeePerWeek;}
  get quoteUsd(){return Math.max(0,rounded(this.registration+this.packageFee-this.sidaDiscount+this.summerSurcharge-this.offSeasonDiscount-this.longStayDiscount));}
  get paymentLines():SchoolPaymentLine[]{return [
    {icon:'折',label:'思达折扣',value:-this.sidaDiscount,note:'课程费和住宿费享9折',promotionKey:'sida'},
    ...(this.offSeasonDiscount?[{icon:'淡',label:'淡季优惠',value:-this.offSeasonDiscount,note:'符合淡季条件的课程，每满4周优惠150美元',promotionKey:'offseason'}]:[]),
    ...(this.longStayDiscount?[{icon:'长',label:'长期优惠',value:-this.longStayDiscount,note:'按每段连续课程时长及最高200美元档位计算',promotionKey:'longstay'}]:[]),
    ...(this.summerSurcharge?[{icon:'暑',label:'暑假附加费',value:this.summerSurcharge,note:`40美元／周／人 × ${this.summerWeeks}周；不参与9折`}]:[]),
  ];}
  get localFees(){return estimateCgLocalFees(this.quotePlan.stayWeeks,false,this.quotePlan.roomWeeks,this.visaType).fees;}
  warning(row:QuotePlanRow){
    return row.optionId==='ielts-intensive'&&row.weeks<12?'雅思密集课程12周起报，当前安排需学校确认。':row.optionId==='business-english'&&row.weeks<4?'商务英语4周起报，当前安排需学校确认。':row.optionId==='ielts-guarantee'?'保证班入学分数、周期及转课规则需学校确认。':'';
  }
}

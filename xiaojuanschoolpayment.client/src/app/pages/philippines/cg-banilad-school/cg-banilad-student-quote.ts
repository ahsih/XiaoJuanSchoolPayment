import { SchoolQuotePlan } from '../../../components/school-quote-plan';
import { SCHOOL_VISA_OPTIONS, SchoolPaymentLine } from '../../../components/school-group-quote';
import { CgVisaType, estimateCgLocalFees } from '../cg-local-fees';
import { CiaLocalFeeRule, CiaPeakSeasonRange, CiaPromotionRule } from '../cia-school/cia-content-config';

interface BaniladPrices {
  courses: {id:string;name:string;lessons:string;tuitionUsd:number}[];
  roomOptions: {id:string;name:string;feeUsd:number}[];
  weekOptions: number[];
  shortTermRatios: Partial<Record<number,number>>;
  registrationFeeUsd:number; sidaDiscountRate:number; offSeasonDiscountPerFourWeeks:number;
  summerFeePerWeek:number;
  promotionRules: CiaPromotionRule[];
  peakSeasonRanges: CiaPeakSeasonRange[];
  localFeeRules: CiaLocalFeeRule[];
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
  private promotion(id:string){return this.prices.promotionRules.find(rule=>rule.id===id&&rule.enabled);}
  get registration(){return this.returningStudent&&this.promotion('cg-banilad-returning-registration')?.waiveRegistration?0:this.prices.registrationFeeUsd;}
  get tuition(){return this.quotePlan.total('course');}
  get accommodation(){return this.quotePlan.total('room');}
  get studyStay(){return this.tuition+this.accommodation;}
  get sidaDiscount(){const rule=this.promotion('cg-banilad-sida-90');return rule?.discountType==='percentage'?rounded(this.studyStay*rule.discountValue/100):0;}
  get offSeasonDiscount(){const rule=this.promotion('cg-banilad-off-season');if(!rule)return 0;return this.quotePlan.courses.filter(r=>this.quotePlan.date(r.startDate)!==null&&(!rule.coverageStart||r.startDate>=rule.coverageStart)&&(!rule.coverageEnd||r.startDate<=rule.coverageEnd)).reduce((sum,row)=>sum+Math.floor(row.weeks/Math.max(1,rule.incrementWeeks??rule.minimumCourseWeeks??4))*(rule.incrementValue??rule.discountValue),0);}
  get longStayDiscount(){const rule=this.promotion('cg-banilad-long-stay');if(!rule||this.quotePlan.courseWeeks<rule.minimumCourseWeeks)return 0;const tiers=Math.floor((this.quotePlan.courseWeeks-rule.minimumCourseWeeks)/Math.max(1,rule.incrementWeeks??4));return rule.discountValue+tiers*(rule.incrementValue??0);}
  get summerWeeks(){return this.prices.peakSeasonRanges.filter(range=>range.enabled).reduce((sum,range)=>sum+this.quotePlan.overlapWeeks(range.start,range.end,[...this.quotePlan.courses,...this.quotePlan.rooms]),0);}
  get summerSurcharge(){return this.summerWeeks*this.prices.summerFeePerWeek;}
  get quoteUsd(){return Math.max(0,rounded(this.registration+this.studyStay-this.sidaDiscount-this.offSeasonDiscount-this.longStayDiscount+this.summerSurcharge));}
  get paymentLines():SchoolPaymentLine[]{return [
    ...(this.sidaDiscount?[{icon:'折',label:this.promotion('cg-banilad-sida-90')?.name??'思达折扣',value:-this.sidaDiscount,note:this.promotion('cg-banilad-sida-90')?.description??'课程费和住宿费享9折',promotionKey:'sida'}]:[]),
    ...(this.offSeasonDiscount?[{icon:'淡',label:this.promotion('cg-banilad-off-season')?.name??'淡季优惠',value:-this.offSeasonDiscount,note:this.promotion('cg-banilad-off-season')?.description??'',promotionKey:'offseason'}]:[]),
    ...(this.longStayDiscount?[{icon:'长',label:this.promotion('cg-banilad-long-stay')?.name??'长期优惠',value:-this.longStayDiscount,note:this.promotion('cg-banilad-long-stay')?.description??`本次${this.quotePlan.courseWeeks}周，按已公布档位优惠`,promotionKey:'longstay'}]:[]),
    ...(this.summerSurcharge?[{icon:'暑',label:'暑假附加费',value:this.summerSurcharge,note:`${this.prices.peakSeasonRanges.filter(range=>range.enabled).map(range=>range.label).join('、')}；${this.prices.summerFeePerWeek}美元／周／人 × ${this.summerWeeks}周`}]:[]),
  ];}
  get localFees(){return estimateCgLocalFees(this.quotePlan.stayWeeks,false,this.quotePlan.roomWeeks,this.visaType,this.prices.localFeeRules,this.quotePlan.startDate).fees;}
}

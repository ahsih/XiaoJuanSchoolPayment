import { cgTextbookPeriods } from '../cg-textbook-estimate';
import { SchoolQuotePlan, QuotePlanRow } from '../../../components/school-quote-plan';
import { SCHOOL_VISA_OPTIONS, SchoolPaymentLine } from '../../../components/school-group-quote';
import { CgVisaType, estimateCgLocalFees } from '../cg-local-fees';
import { CiaLocalFeeRule, CiaPeakSeasonRange, CiaPromotionRule } from '../cia-school/cia-content-config';
import { associationPeakBreakdownText, calculateAssociationPeakSurcharge } from '../association-peak-surcharge';

interface SpartaPrices {
  courseOptions:{id:string;name:string;lessons:string;tuitionUsd:number}[];
  roomOptions:{id:string;name:string;feeUsd:number}[];
  weekOptions:number[];shortTermRatios:Partial<Record<number,number>>;registrationFee:number;sidaDiscountRate:number;
  offSeasonDiscountPerFourWeeks:number;summerFeePerWeek:number;
  promotionRules:CiaPromotionRule[];peakSeasonRanges:CiaPeakSeasonRange[];localFeeRules:CiaLocalFeeRule[];
}
const DAY=86400000;
const rounded=(v:number)=>Math.round((v+Number.EPSILON)*100)/100;
export class CgSpartaStudentQuote {
  selectedAgeGroup:'adult'|'minor'='adult';
  returningStudent=false;
  selectedRegistrationDate=new Date().toLocaleDateString('en-CA');
  readonly visaOptions=SCHOOL_VISA_OPTIONS;
  visaType:CgVisaType='tourist59';
  private textbookCountOverride: number | null = null;
  get textbookCount() { return this.textbookCountOverride ?? cgTextbookPeriods(this.quotePlan.courses); }
  set textbookCount(value: number) { this.textbookCountOverride = value; }
  resetTextbookCount() { this.textbookCountOverride = null; }
  textbookUnitPrice=2000;
  readonly quotePlan:SchoolQuotePlan;
  constructor(private readonly p:SpartaPrices){
    this.textbookUnitPrice=2000;
    this.quotePlan=new SchoolQuotePlan('sparta','quad','2026-09-06',p.weekOptions,
      kind=>kind==='course'?p.courseOptions.map(x=>({id:x.id,name:x.name,details:x.lessons})):p.roomOptions.map(x=>({id:x.id,name:x.name,details:''})),
      (kind,row)=>{
        const base=kind==='course'?p.courseOptions.find(x=>x.id===row.optionId)?.tuitionUsd:p.roomOptions.find(x=>x.id===row.optionId)?.feeUsd;
        return (base??0)*this.multiplier(row.weeks);
      },52);
  }
  multiplier(w:number){return this.p.shortTermRatios[w]??w/4;}
  get error(){
    if(this.quotePlan.error)return this.quotePlan.error;
    if(this.quotePlan.date(this.selectedRegistrationDate)===null)return '请选择有效的报名注册日期。';
    if(!['adult','minor'].includes(this.selectedAgeGroup))return '请选择抵达时年龄段。';
    if(!Number.isInteger(this.textbookCount)||this.textbookCount<0||this.textbookCount>50)return '教材数量请输入0–50个教材计费周期的整数。';
    if(!Number.isFinite(this.textbookUnitPrice)||this.textbookUnitPrice<this.textbookMinimumPrice||this.textbookUnitPrice>this.textbookMaximumPrice)return `教材单价请输入${this.textbookMinimumPrice}–${this.textbookMaximumPrice}比索。`;
    return this.visaOptions.some(x=>x.value===this.visaType)?'':'请选择有效的签证类型。';
  }
  get textbookMinimumPrice(){return 0;}
  get textbookMaximumPrice(){return 50000;}
  private promotion(id:string){return this.p.promotionRules.find(rule=>rule.id===id&&rule.enabled);}
  get registration(){return this.returningStudent&&this.promotion('cg-sparta-returning-registration')?.waiveRegistration?0:this.p.registrationFee;}
  get tuition(){return this.quotePlan.total('course');}
  get accommodation(){return this.quotePlan.total('room');}
  get packageFee(){return this.tuition+this.accommodation;}
  get sidaDiscount(){const rule=this.promotion('cg-sparta-sida-90');return rule?.discountType==='percentage'?rounded(this.packageFee*rule.discountValue/100):0;}
  private dateAt(date:string,weeks:number){const d=this.quotePlan.date(date);return d===null?'':new Date(d+weeks*7*DAY).toISOString().slice(0,10);}
  get coursePeriods(){
    const dates=this.quotePlan.weekStarts().map(x=>new Date(x).toISOString().slice(0,10)),out:{startDate:string;weeks:number}[]=[];
    for(const date of dates){const last=out.at(-1);if(last&&this.dateAt(last.startDate,last.weeks)===date)last.weeks++;else out.push({startDate:date,weeks:1});}return out;
  }
  get offSeasonDiscount(){return this.p.promotionRules.filter(rule=>rule.enabled&&(rule.id==='cg-sparta-off-season'||rule.id==='cg-sparta-off-season-2027')).reduce((total,rule)=>total+this.coursePeriods.filter(x=>(!rule.coverageStart||x.startDate>=rule.coverageStart)&&(!rule.coverageEnd||x.startDate<=rule.coverageEnd)).reduce((s,x)=>s+Math.floor(x.weeks/Math.max(1,rule.incrementWeeks??rule.minimumCourseWeeks??4))*(rule.incrementValue??rule.discountValue),0),0);}
  get longStayDiscount(){const rule=this.promotion('cg-sparta-long-stay');if(!rule)return 0;const step=Math.max(1,rule.incrementWeeks??4),increment=rule.incrementValue??0,cap=rule.discountValue+3*increment;return this.coursePeriods.reduce((sum,period)=>period.weeks<rule.minimumCourseWeeks?sum:sum+Math.min(cap,rule.discountValue+Math.floor((period.weeks-rule.minimumCourseWeeks)/step)*increment),0);}
  get summerCalculation(){return calculateAssociationPeakSurcharge('CG-SPARTA',this.quotePlan.weekStarts([...this.quotePlan.courses,...this.quotePlan.rooms]),this.p.peakSeasonRanges.filter(range=>range.enabled),this.p.summerFeePerWeek);}
  get summerWeeks(){return this.summerCalculation.weeks;}
  get summerSurcharge(){return this.summerCalculation.total;}
  get quoteUsd(){return Math.max(0,rounded(this.registration+this.packageFee-this.sidaDiscount+this.summerSurcharge-this.offSeasonDiscount-this.longStayDiscount));}
  get paymentLines():SchoolPaymentLine[]{return [
    ...(this.sidaDiscount?[{icon:'折',label:this.promotion('cg-sparta-sida-90')?.name??'思达折扣',value:-this.sidaDiscount,note:this.promotion('cg-sparta-sida-90')?.description??'课程费和住宿费享9折',promotionKey:'sida'}]:[]),
    ...(this.offSeasonDiscount?[{icon:'淡',label:this.promotion('cg-sparta-off-season')?.name??'淡季优惠',value:-this.offSeasonDiscount,note:this.p.promotionRules.filter(rule=>rule.enabled&&(rule.id==='cg-sparta-off-season'||rule.id==='cg-sparta-off-season-2027')).map(rule=>rule.description).join('；'),promotionKey:'offseason'}]:[]),
    ...(this.longStayDiscount?[{icon:'长',label:this.promotion('cg-sparta-long-stay')?.name??'长期优惠',value:-this.longStayDiscount,note:this.promotion('cg-sparta-long-stay')?.description??'',promotionKey:'longstay'}]:[]),
    ...(this.summerSurcharge?[{icon:'暑',label:'暑假附加费',value:this.summerSurcharge,note:`${this.p.peakSeasonRanges.filter(range=>range.enabled).map(range=>range.label).join('、')}；${associationPeakBreakdownText(this.summerCalculation)}；同一周课程与住宿只计一次，不参与优惠`}]:[]),
  ];}
  get localFees(){return estimateCgLocalFees(this.quotePlan.stayWeeks,false,this.quotePlan.roomWeeks,this.visaType,this.p.localFeeRules,this.quotePlan.startDate,this.textbookCount,this.textbookUnitPrice).fees;}
  warning(row:QuotePlanRow){
    return row.optionId==='ielts-intensive'&&row.weeks<12?'雅思密集课程12周起报，当前安排需学校确认。':row.optionId==='business-english'&&row.weeks<4?'商务英语4周起报，当前安排需学校确认。':row.optionId==='ielts-guarantee'?'保证班入学分数、周期及转课规则需学校确认。':'';
  }
}

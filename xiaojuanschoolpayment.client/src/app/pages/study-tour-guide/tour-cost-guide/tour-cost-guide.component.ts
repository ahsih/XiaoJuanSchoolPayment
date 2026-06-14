import { Component } from '@angular/core';
import { StudyTourPageContentComponent } from '../../overseas-study-tour/page-content/study-tour-page-content.component';

@Component({
  selector: 'app-tour-cost-guide',
  standalone: true,
  imports: [StudyTourPageContentComponent],
  templateUrl: './tour-cost-guide.component.html',
})
export class TourCostGuideComponent {
  readonly page = {
    title: '游学费用指南',
    englishTitle: 'Study Tour Cost Guide',
    positioning: 'SEO指南页，费用是用户第一关心点',
    keywords: '游学费用、学费、住宿、机票、签证、当地费用、总预算',
    heroImage:
      'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80',
    intro:
      '游学费用不能只看课程报价。完整预算通常包含学费、住宿、餐食、教材、当地活动、接送、签证、保险、机票和个人生活费。不同国家、城市、学校和出发季节会让总费用差异很大。',
    highlights: [
      { value: '总价', label: '看总预算，而不是只看学费' },
      { value: '季节', label: '寒暑假旺季价格和名额变化明显' },
      { value: '透明', label: '报价需拆清包含项和不包含项' },
    ],
    cardsTitle: '费用通常由哪些部分组成',
    cards: [
      {
        icon: 'school',
        title: '课程费用',
        text: '包括英语课、主题课、材料费或营地课程费。不同课程强度、师资和班型价格差异明显。',
      },
      {
        icon: 'home',
        title: '住宿餐食',
        text: '寄宿家庭、学生宿舍、酒店或营地住宿费用不同，也要确认餐食包含几餐。',
      },
      {
        icon: 'flight',
        title: '出行和签证',
        text: '机票、签证、保险、接送和当地交通经常不在基础课程报价里，需要单独核算。',
      },
      {
        icon: 'receipt_long',
        title: '当地杂费',
        text: '活动门票、教材、洗衣、电话卡、零花钱和备用金都应提前预留。',
      },
    ],
    checklistTitle: '询价前先准备',
    checklist: [
      '确认国家、城市、出发月份、课程周数和住宿方式。',
      '要求报价明确包含项、不包含项、退款规则和付款节点。',
      '亲子、低龄和寒暑假项目要额外确认监护、接送和活动费用。',
      '比较多个国家时，用“总费用+课程强度+照顾服务”一起判断。',
    ],
    sources: [
      { label: 'Study UK - Costs', url: 'https://study-uk.britishcouncil.org/moving-uk/cost-studying' },
      { label: 'EduCanada - Find study costs', url: 'https://www.educanada.ca/study-plan-etudes/budget.aspx?lang=eng' },
      { label: 'Study Australia', url: 'https://www.studyinaustralia.gov.au/en' },
    ],
  };
}

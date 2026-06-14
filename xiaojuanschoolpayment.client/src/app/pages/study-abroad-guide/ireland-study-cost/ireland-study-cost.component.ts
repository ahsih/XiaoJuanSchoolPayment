import { Component } from '@angular/core';
import { IrelandPageContentComponent } from '../../ireland/page-content/ireland-page-content.component';

@Component({
  selector: 'app-ireland-study-cost',
  standalone: true,
  imports: [IrelandPageContentComponent],
  templateUrl: './ireland-study-cost.component.html',
})
export class IrelandStudyCostComponent {
  readonly page = {
    title: '爱尔兰留学费用',
    englishTitle: 'Ireland Study Cost Guide',
    audience: 'SEO指南页，爱尔兰留学核心关键词',
    keywords: '爱尔兰留学费用、学费、生活费、住宿、签证资金、奖学金',
    heroImage:
      'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80',
    summary:
      '爱尔兰留学费用要按“学费+住宿+生活费+保险+签证+机票+备用金”整体规划。不同院校、专业、城市和住宿方式会让预算差异很大，尤其都柏林住宿成本通常需要提前重点核算。',
    metrics: [
      { value: '学费', label: '本科、硕士、预科和语言课程费用结构不同' },
      { value: '住宿', label: '通常是生活预算里波动最大的部分' },
      { value: '资金', label: '签证和入境规划需预留充足证明与备用金' },
    ],
    cardsTitle: '费用拆解',
    cards: [
      {
        icon: 'school',
        title: '课程学费',
        text: '商科、工程、计算机、医学相关、艺术设计等专业费用不同，本科和硕士也要分开估算。',
      },
      {
        icon: 'home',
        title: '住宿生活',
        text: '校内宿舍、学生公寓、寄宿家庭和校外租房费用不同，还要考虑水电网、通勤和餐食。',
      },
      {
        icon: 'verified_user',
        title: '签证保险',
        text: '学生需要按官方要求准备签证材料、保险和资金证明，具体金额以最新政策为准。',
      },
      {
        icon: 'savings',
        title: '奖学金与备用金',
        text: '奖学金可降低部分学费压力，但不应作为唯一预算来源，建议准备紧急备用金。',
      },
    ],
    guideTitle: '预算规划建议',
    guideText:
      '费用页适合承接用户第一轮搜索意图。内容应帮助用户先判断大致预算区间，再引导顾问按专业、院校、城市和住宿方式做精确报价。',
    checklist: [
      '确认课程层级：语言、预科、本科、硕士或博士。',
      '确认目标城市和住宿方式，都柏林预算需单独评估。',
      '把学费押金、住宿押金、保险、签证、机票和生活费分项列出。',
      '如需奖学金，提前确认申请条件、截止日期和是否自动评审。',
    ],
    sources: [
      { label: 'Education in Ireland - Plan your study abroad', url: 'https://www.educationinireland.com/en/plan-your-study-abroad/' },
      { label: 'Education in Ireland - Undergraduate tuition fees', url: 'https://www.educationinireland.com/en/plan-your-study-abroad/undergraduate-tuition-fees/' },
      { label: 'Education in Ireland - Postgraduate tuition fees', url: 'https://www.educationinireland.com/en/plan-your-study-abroad/postgraduate-tuition-fees/' },
    ],
  };
}

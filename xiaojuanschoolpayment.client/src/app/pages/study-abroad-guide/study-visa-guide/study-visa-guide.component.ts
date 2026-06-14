import { Component } from '@angular/core';
import { IrelandPageContentComponent } from '../../ireland/page-content/ireland-page-content.component';

@Component({
  selector: 'app-study-visa-guide',
  standalone: true,
  imports: [IrelandPageContentComponent],
  templateUrl: './study-visa-guide.component.html',
})
export class StudyVisaGuideComponent {
  readonly page = {
    title: '签证申请指南',
    englishTitle: 'Ireland Student Visa Guide',
    audience: 'SEO指南页',
    keywords: '爱尔兰学生签证、AVATS、资金证明、保险、入境注册、IRP',
    heroImage:
      'https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?auto=format&fit=crop&w=1200&q=80',
    summary:
      '爱尔兰学生签证申请要按课程类型、学习时长、国籍和官方要求准备材料。签证政策会变化，页面内容应作为准备逻辑，最终以 Irish Immigration 最新说明为准。',
    metrics: [
      { value: '录取', label: '通常先接受录取再进入签证准备' },
      { value: '资金', label: '资金证明和付款证明要按官方要求准备' },
      { value: '注册', label: '长期学习抵达后通常还涉及移民注册' },
    ],
    cardsTitle: '签证准备重点',
    cards: [
      {
        icon: 'assignment',
        title: '确认签证类型',
        text: '根据学习时长和课程类型确认签证路径，短期与长期学习要求不同。',
      },
      {
        icon: 'receipt_long',
        title: '材料准备',
        text: '常见材料包括录取信、学费付款、资金证明、保险、护照和学习计划。',
      },
      {
        icon: 'schedule',
        title: '时间预留',
        text: '签证申请、补件、住宿确认和机票安排需要留足时间。',
      },
      {
        icon: 'how_to_reg',
        title: '抵达后注册',
        text: '学习超过一定时长的非欧盟学生通常需要在抵达后按要求完成注册。',
      },
    ],
    guideTitle: '合规提示',
    guideText:
      '签证页必须避免绝对化承诺。更好的写法是帮助用户提前准备材料和时间线，并强调官方规则优先。',
    checklist: [
      '确认课程、开学日期、学习时长和签证要求。',
      '准备录取信、付款证明、资金证明、保险和护照。',
      '确认是否需要体检、翻译、公证或额外补充说明。',
      '抵达后按官方要求办理注册和居留许可。',
    ],
    sources: [
      { label: 'Education in Ireland - Student Visas', url: 'https://www.educationinireland.com/en/plan-your-study-abroad/student-visas/' },
      { label: 'Irish Immigration - Coming to Study in Ireland', url: 'https://www.irishimmigration.ie/coming-to-study-in-ireland/' },
      { label: 'Irish Immigration - Study Options', url: 'https://www.irishimmigration.ie/coming-to-study-in-ireland/what-are-my-study-options/a-third-level-course-or-a-language-course/' },
    ],
  };
}

import { Component } from '@angular/core';
import { IrelandPageContentComponent } from '../page-content/ireland-page-content.component';

@Component({
  selector: 'app-visa-guide',
  standalone: true,
  imports: [IrelandPageContentComponent],
  templateUrl: './visa-guide.component.html',
})
export class VisaGuideComponent {
  readonly page = {
    title: '签证指南',
    englishTitle: 'Ireland Student Visa Guide',
    audience: '指南页',
    keywords: '学生签证、AVATS、录取信、学费支付、资金证明、入境注册',
    heroImage:
      'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
    summary:
      '签证指南页面用于提醒学生按官方要求核对签证、入境和注册步骤。爱尔兰学生签证规则会变化，页面内容应以流程说明和材料提醒为主，具体条件以 Irish Immigration 最新要求为准。',
    metrics: [
      { value: '90天', label: '学习超过90天通常还涉及抵达后注册要求' },
      { value: 'AVATS', label: '签证申请需按官方在线系统流程操作' },
      { value: '官方', label: '签证材料和资金要求必须以最新官方说明为准' },
    ],
    cardsTitle: '签证准备重点',
    cards: [
      {
        icon: 'verified_user',
        title: '确认是否需要签证',
        text: '学生应先按国籍、课程长度和学习类型确认是否需要申请签证，以及是否需要入境后注册。',
      },
      {
        icon: 'receipt_long',
        title: '准备核心材料',
        text: '常见材料包括录取信、学费支付证明、资金证明、护照、保险、学习计划和既往学习记录。',
      },
      {
        icon: 'laptop_mac',
        title: '完成在线申请',
        text: '签证所需在线表格、预约和递交方式要按官方系统及当地使领馆要求执行。',
      },
      {
        icon: 'how_to_reg',
        title: '抵达后注册',
        text: '非欧盟/非欧洲经济区等学生若学习超过90天，通常需要按要求注册居留许可。',
      },
    ],
    guideTitle: '页面写法建议',
    guideText:
      '这一页不要写成固定承诺清单。更适合做成“签证前先确认”的顾问型页面，提醒学生按课程、国籍、资金和时间节点核对最新官方要求。',
    checklist: [
      '先确认学生国籍、课程长度、课程类型和入境时间。',
      '核对录取信、学费付款、资金证明、保险和护照有效期。',
      '预留签证审理、补件、住宿确认和机票安排时间。',
      '页面显眼位置提醒最终要求以 Irish Immigration 最新政策为准。',
    ],
    sources: [
      {
        label: 'Irish Immigration - Coming to Study in Ireland',
        url: 'https://www.irishimmigration.ie/coming-to-study-in-ireland/',
      },
      {
        label: 'Education in Ireland - Student Visa Requirements',
        url: 'https://www.educationinireland.com/en/how-do-i-apply-/get-your-student-visa/',
      },
      {
        label: 'Irish Immigration - Eligible Study Programmes',
        url: 'https://www.irishimmigration.ie/coming-to-study-in-ireland/what-are-my-study-options/a-third-level-course-or-a-language-course/',
      },
    ],
  };
}

import { Component } from '@angular/core';
import { IrelandPageContentComponent } from '../../ireland/page-content/ireland-page-content.component';

@Component({
  selector: 'app-study-faq',
  standalone: true,
  imports: [IrelandPageContentComponent],
  templateUrl: './study-faq.component.html',
})
export class StudyFaqComponent {
  readonly page = {
    title: '留学常见问题',
    englishTitle: 'Ireland Study FAQ',
    audience: 'FAQ页',
    keywords: '爱尔兰留学常见问题、费用、签证、住宿、申请条件、打工、毕业工签',
    heroImage:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    summary:
      '留学常见问题页面集中回答用户咨询前的高频疑虑：费用多少、能否打工、申请难不难、是否需要雅思、住宿怎么找、签证多久办、毕业后能否留在爱尔兰。',
    metrics: [
      { value: '费用', label: '先解释学费、住宿和生活费结构' },
      { value: '申请', label: '按本科、硕士、预科和语言课程拆解条件' },
      { value: '签证', label: '政策性问题以官方最新要求为准' },
    ],
    cardsTitle: '高频问题方向',
    cards: [
      {
        icon: 'payments',
        title: '爱尔兰留学贵吗？',
        text: '费用取决于课程、学校、城市和住宿方式，建议按完整年度预算评估。',
      },
      {
        icon: 'language',
        title: '一定要雅思吗？',
        text: '多数英语授课课程有语言要求，部分学校也可能接受其他认可英语测试或语言衔接。',
      },
      {
        icon: 'work',
        title: '可以兼职吗？',
        text: '是否能工作取决于签证、课程和官方规则，不能把兼职收入当作主要资金来源。',
      },
      {
        icon: 'home',
        title: '住宿怎么安排？',
        text: '学校宿舍、学生公寓、寄宿家庭和租房都可能可选，但开学季需要尽早申请。',
      },
    ],
    guideTitle: 'FAQ后续扩展',
    guideText:
      '这页后续可以扩展成结构化FAQ，按费用、申请、签证、住宿、就业和适合人群分组，并连接到更详细的指南页。',
    checklist: [
      '每个答案给判断标准，不做绝对承诺。',
      '费用和签证类问题注明以学校和官方最新要求为准。',
      'FAQ里加入内部链接，引导到费用、签证、院校选择和申请材料页。',
      '常见问题末尾放咨询入口，方便用户提交具体背景。',
    ],
    sources: [
      { label: 'Education in Ireland', url: 'https://www.educationinireland.com/en/' },
      { label: 'Education in Ireland - Plan your study abroad', url: 'https://www.educationinireland.com/en/plan-your-study-abroad/' },
      { label: 'Irish Immigration', url: 'https://www.irishimmigration.ie/' },
    ],
  };
}

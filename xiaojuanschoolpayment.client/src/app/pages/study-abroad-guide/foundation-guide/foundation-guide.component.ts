import { Component } from '@angular/core';
import { IrelandPageContentComponent } from '../../ireland/page-content/ireland-page-content.component';

@Component({
  selector: 'app-foundation-guide',
  standalone: true,
  imports: [IrelandPageContentComponent],
  templateUrl: './foundation-guide.component.html',
})
export class FoundationGuideComponent {
  readonly page = {
    title: '预科申请指南',
    englishTitle: 'Foundation Application Guide',
    audience: 'SEO指南页',
    keywords: '爱尔兰预科、国际预科、桥梁课程、本科衔接、语言要求',
    heroImage:
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80',
    summary:
      '预科适合学术背景、语言成绩或课程体系暂时无法直接进入本科/硕士的学生。它的价值在于补足学术英语、学习方法和专业基础，但必须确认后续升读路径。',
    metrics: [
      { value: '衔接', label: '帮助学生过渡到正式学位课程' },
      { value: '语言', label: '强化学术英语和课堂表达' },
      { value: '路径', label: '必须确认升读条件和对应院校' },
    ],
    cardsTitle: '预科选择重点',
    cards: [
      {
        icon: 'route',
        title: '升读路径',
        text: '确认预科完成后能衔接哪些本科或硕士课程，升读条件是什么。',
      },
      {
        icon: 'language',
        title: '英语要求',
        text: '预科通常也有最低英语要求，不能把它理解为完全无门槛课程。',
      },
      {
        icon: 'menu_book',
        title: '专业基础',
        text: '商科、工程、计算机、艺术等方向预科模块不同，要和目标专业匹配。',
      },
      {
        icon: 'payments',
        title: '总预算',
        text: '预科会增加学习时间和费用，需要把后续学位课程一起计算。',
      },
    ],
    guideTitle: '适合什么学生',
    guideText:
      '预科指南要帮助学生理解它是衔接路径，不是简单“低分进名校”。页面重点应放在匹配、升读和风险提示。',
    checklist: [
      '确认当前成绩和英语是否达不到直入要求。',
      '确认预科衔接的目标院校、专业和升读条件。',
      '确认预科开课时间、课程长度、学费和住宿安排。',
      '评估预科后总学习周期和整体预算。',
    ],
    sources: [
      { label: 'Education in Ireland - The Application Process', url: 'https://www.educationinireland.com/en/plan-your-study-abroad/the-application-process/' },
      { label: '爱尔兰本科申请 - IESC', url: 'https://www.irelandeducation.cn/undergraduate-application/' },
      { label: 'Education in Ireland - English language requirements', url: 'https://www.educationinireland.com/en/plan-your-study-abroad/english-language-requirements/' },
    ],
  };
}

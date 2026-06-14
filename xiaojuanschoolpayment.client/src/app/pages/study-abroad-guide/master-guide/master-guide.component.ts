import { Component } from '@angular/core';
import { IrelandPageContentComponent } from '../../ireland/page-content/ireland-page-content.component';

@Component({
  selector: 'app-master-guide',
  standalone: true,
  imports: [IrelandPageContentComponent],
  templateUrl: './master-guide.component.html',
})
export class MasterGuideComponent {
  readonly page = {
    title: '硕士申请指南',
    englishTitle: 'Master Application Guide',
    audience: 'SEO指南页',
    keywords: '爱尔兰硕士申请、一年制硕士、跨专业、文书、推荐信',
    heroImage:
      'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80',
    summary:
      '爱尔兰硕士申请通常关注本科背景、均分、英语成绩、专业匹配、文书和职业目标。热门课程建议提前准备，避免错过申请和住宿节点。',
    metrics: [
      { value: '背景', label: '本科专业和均分决定申请范围' },
      { value: '文书', label: '个人陈述和简历要解释申请逻辑' },
      { value: '就业', label: '专业选择要和毕业后方向一起考虑' },
    ],
    cardsTitle: '硕士申请重点',
    cards: [
      {
        icon: 'analytics',
        title: '背景评估',
        text: '评估本科院校、专业、均分、实习、科研和英语水平。',
      },
      {
        icon: 'sync_alt',
        title: '跨专业判断',
        text: '商科、数据、计算机、教育等方向对跨专业接受度不同，要逐项确认。',
      },
      {
        icon: 'edit_document',
        title: '文书准备',
        text: '个人陈述、简历和推荐信要体现课程匹配、经历和职业目标。',
      },
      {
        icon: 'event_available',
        title: '申请节点',
        text: '录取、押金、补语言、住宿和签证会连续发生，需要按时间线推进。',
      },
    ],
    guideTitle: '适合什么申请者',
    guideText:
      '硕士页面适合承接学历提升、转专业和就业导向用户。内容要帮助用户判断“我能申请什么”和“为什么这个方向适合我”。',
    checklist: [
      '确认本科专业、均分、毕业时间和语言成绩。',
      '判断目标专业是否接受跨专业或要求工作经验。',
      '准备简历、个人陈述、推荐信、成绩单和学历证明。',
      '同步规划押金、住宿、签证和毕业后就业方向。',
    ],
    sources: [
      { label: 'Education in Ireland - The Application Process', url: 'https://www.educationinireland.com/en/plan-your-study-abroad/the-application-process/' },
      { label: '爱尔兰研究生课程申请 - IESC', url: 'https://www.irelandeducation.cn/postgraduate-application/' },
      { label: 'Education in Ireland - Where can I study', url: 'https://www.educationinireland.com/en/where-can-i-study/' },
    ],
  };
}

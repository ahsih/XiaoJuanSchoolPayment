import { Component } from '@angular/core';
import { IrelandPageContentComponent } from '../../ireland/page-content/ireland-page-content.component';

@Component({
  selector: 'app-undergraduate-guide',
  standalone: true,
  imports: [IrelandPageContentComponent],
  templateUrl: './undergraduate-guide.component.html',
})
export class UndergraduateGuideComponent {
  readonly page = {
    title: '本科申请指南',
    englishTitle: 'Undergraduate Application Guide',
    audience: 'SEO指南页',
    keywords: '爱尔兰本科申请、高中成绩、预科、直入本科、转学分',
    heroImage:
      'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80',
    summary:
      '爱尔兰本科申请适合高中毕业生、国际课程学生、大专或本科在读转学学生。申请路径通常包括直入本科、预科衔接、语言课程或转学分评估。',
    metrics: [
      { value: '直入', label: '成绩和英语达标时可评估本科直录' },
      { value: '预科', label: '学术或语言基础不足时可先衔接' },
      { value: '转学', label: '已有高等教育经历可评估转学分' },
    ],
    cardsTitle: '本科申请重点',
    cards: [
      {
        icon: 'fact_check',
        title: '入学条件',
        text: '核对高中成绩、国际课程成绩、英语成绩和专业特定科目要求。',
      },
      {
        icon: 'route',
        title: '路径选择',
        text: '根据学生背景判断直录、预科、语言班、桥梁课程或转学分路径。',
      },
      {
        icon: 'description',
        title: '材料清单',
        text: '准备成绩单、毕业证明、语言成绩、护照、申请表和必要文书。',
      },
      {
        icon: 'family_restroom',
        title: '家庭规划',
        text: '本科周期较长，家长需一起评估预算、住宿、签证和未来升学就业。',
      },
    ],
    guideTitle: '适合什么学生',
    guideText:
      '本科申请指南应帮助家庭看懂路径，不只是列学校。核心是判断当前学历背景和目标课程之间差多少。',
    checklist: [
      '确认学生当前课程体系和预计毕业时间。',
      '确认目标专业是否要求数学、作品集或面试。',
      '准备成绩单、毕业证明、语言成绩和护照。',
      '如条件未达标，提前评估预科或语言衔接。',
    ],
    sources: [
      { label: 'Education in Ireland - The Application Process', url: 'https://www.educationinireland.com/en/plan-your-study-abroad/the-application-process/' },
      { label: '爱尔兰本科申请 - IESC', url: 'https://www.irelandeducation.cn/undergraduate-application/' },
      { label: 'Education in Ireland - English language requirements', url: 'https://www.educationinireland.com/en/plan-your-study-abroad/english-language-requirements/' },
    ],
  };
}

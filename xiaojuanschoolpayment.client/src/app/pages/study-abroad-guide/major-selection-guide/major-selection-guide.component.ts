import { Component } from '@angular/core';
import { IrelandPageContentComponent } from '../../ireland/page-content/ireland-page-content.component';

@Component({
  selector: 'app-major-selection-guide',
  standalone: true,
  imports: [IrelandPageContentComponent],
  templateUrl: './major-selection-guide.component.html',
})
export class MajorSelectionGuideComponent {
  readonly page = {
    title: '专业选择指南',
    englishTitle: 'Major Selection Guide',
    audience: 'SEO指南页',
    keywords: '爱尔兰专业选择、商科、计算机、工程、教育、就业方向',
    heroImage:
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
    summary:
      '专业选择要把兴趣、背景、录取可能性、课程模块、就业方向和签证规划一起看。爱尔兰在商科、计算机、数据、工程、制药、教育和酒店管理等方向有较强辨识度。',
    metrics: [
      { value: '背景', label: '本科或高中科目影响可申请范围' },
      { value: '就业', label: '专业选择要反推目标岗位能力' },
      { value: '城市', label: '产业机会和城市选择有关' },
    ],
    cardsTitle: '专业选择维度',
    cards: [
      {
        icon: 'psychology',
        title: '兴趣与能力',
        text: '先判断学生真正愿意长期学习什么，以及数学、写作、编程或作品集能力是否匹配。',
      },
      {
        icon: 'fact_check',
        title: '录取要求',
        text: '不同专业对先修课程、均分、英语、作品集和工作经验要求不同。',
      },
      {
        icon: 'work',
        title: '就业路径',
        text: '从目标岗位反推专业模块、实习机会、项目经验和城市资源。',
      },
      {
        icon: 'sync_alt',
        title: '转专业风险',
        text: '跨专业申请要看课程是否接受，以及是否需要补背景或选择桥梁课程。',
      },
    ],
    guideTitle: '不要只按热门选专业',
    guideText:
      '热门专业不一定适合每个学生。页面应帮助用户把“能申请、能学下去、毕业后能用上”三件事放在一起判断。',
    checklist: [
      '列出学生优势科目、经历和不擅长的能力点。',
      '比较目标专业课程模块，而不是只看专业名称。',
      '确认是否需要作品集、数学、编程、实习或工作经验。',
      '把就业城市、行业机会和毕业后规划一起考虑。',
    ],
    sources: [
      { label: 'Education in Ireland - Where can I study', url: 'https://www.educationinireland.com/en/where-can-i-study/' },
      { label: 'DARE/QQI Qualifications Information', url: 'https://www.qqi.ie/' },
      { label: 'Education in Ireland', url: 'https://www.educationinireland.com/en/' },
    ],
  };
}

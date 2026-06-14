import { Component } from '@angular/core';
import { StudyTourPageContentComponent } from '../../overseas-study-tour/page-content/study-tour-page-content.component';

@Component({
  selector: 'app-gap-year-guide',
  standalone: true,
  imports: [StudyTourPageContentComponent],
  templateUrl: './gap-year-guide.component.html',
})
export class GapYearGuideComponent {
  readonly page = {
    title: 'Gap Year 游学指南',
    englishTitle: 'Gap Year Study Tour Guide',
    positioning: 'SEO指南页，长期学习用户入口',
    keywords: 'Gap Year、长期游学、语言提升、海外体验、升学规划',
    heroImage:
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
    intro:
      'Gap Year 游学适合希望用较长时间提升语言、体验海外生活、准备申请或重新规划方向的学生。关键是把时间拆成语言学习、考试准备、体验活动和下一步申请计划。',
    highlights: [
      { value: '长期', label: '通常比短期营更重视规划和阶段目标' },
      { value: '探索', label: '适合申请前、转专业前或毕业后过渡' },
      { value: '节奏', label: '需要学习、生活和预算管理能力' },
    ],
    cardsTitle: 'Gap Year 怎么规划',
    cards: [
      {
        icon: 'route',
        title: '阶段目标',
        text: '先设定语言提升、考试、作品集、实习体验或申请准备等阶段目标。',
      },
      {
        icon: 'savings',
        title: '预算管理',
        text: '长期项目要计算学费、住宿、签证、保险、生活费和旅行备用金。',
      },
      {
        icon: 'school',
        title: '升学衔接',
        text: '如果最终目标是本科或硕士申请，课程选择要服务于后续申请材料。',
      },
      {
        icon: 'psychology',
        title: '自我管理',
        text: '长期海外学习需要出勤、自习、生活规律和心理适应能力。',
      },
    ],
    checklistTitle: '适合人群',
    checklist: [
      '高中毕业、本科前、硕士前或毕业后需要过渡期的学生。',
      '希望用数月时间提升英语并探索未来方向。',
      '需要准备雅思、作品集、申请材料或面试表达。',
      '家庭能接受长期预算，并希望有阶段性反馈和规划。',
    ],
    sources: [
      { label: 'EducationUSA - Your 5 Steps', url: 'https://educationusa.state.gov/your-5-steps-us-study' },
      { label: 'Study UK - Plan your studies', url: 'https://study-uk.britishcouncil.org/plan-studies' },
      { label: 'Education in Ireland - Plan your study abroad', url: 'https://www.educationinireland.com/en/plan-your-study-abroad/' },
    ],
  };
}

import { Component } from '@angular/core';
import { StudyTourPageContentComponent } from '../../overseas-study-tour/page-content/study-tour-page-content.component';

@Component({
  selector: 'app-ielts-tour-guide',
  standalone: true,
  imports: [StudyTourPageContentComponent],
  templateUrl: './ielts-tour-guide.component.html',
})
export class IeltsTourGuideComponent {
  readonly page = {
    title: '雅思备考游学指南',
    englishTitle: 'IELTS Study Tour Guide',
    positioning: 'SEO指南页，考试用户入口',
    keywords: '雅思游学、雅思备考、菲律宾雅思、口语写作、保分班',
    heroImage:
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80',
    intro:
      '雅思备考游学适合目标明确、希望集中提高口语写作和考试节奏的学生。选择项目时要看入学测试、目标分数、模考频率、师资反馈、课程强度和住宿自习环境。',
    highlights: [
      { value: '目标分', label: '先确认当前分数和目标分数差距' },
      { value: '模考', label: '模考频率和反馈质量很关键' },
      { value: '强度', label: '雅思游学通常比口语体验更高压' },
    ],
    cardsTitle: '雅思游学筛选重点',
    cards: [
      {
        icon: 'analytics',
        title: '入学测评',
        text: '先确认听说读写当前水平，再决定是否适合普通雅思班、强化班或保证班。',
      },
      {
        icon: 'edit_note',
        title: '口语写作反馈',
        text: '雅思提升离不开高质量批改、表达纠错、范文拆解和口语追问训练。',
      },
      {
        icon: 'quiz',
        title: '模考体系',
        text: '定期全真模考能帮助学生适应考试节奏，也方便判断是否需要调整课程。',
      },
      {
        icon: 'nightlight',
        title: '学习管理',
        text: '住宿安静度、晚自习、手机管理和学习氛围会影响备考效率。',
      },
    ],
    checklistTitle: '适合什么学生',
    checklist: [
      '已有明确考试时间和目标分数。',
      '口语和写作需要高频输出与反馈。',
      '能接受密集课程、自习和阶段测评。',
      '报名保证班前要确认入班门槛、保分条件和退款规则。',
    ],
    sources: [
      { label: 'IELTS Official', url: 'https://ielts.org/' },
      { label: 'British Council IELTS', url: 'https://takeielts.britishcouncil.org/' },
      { label: 'Cambridge English IELTS', url: 'https://www.cambridgeenglish.org/exams-and-tests/ielts/' },
    ],
  };
}

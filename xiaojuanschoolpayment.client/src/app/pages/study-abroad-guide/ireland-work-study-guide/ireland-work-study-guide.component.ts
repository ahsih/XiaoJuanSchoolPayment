import { Component } from '@angular/core';
import { IrelandPageContentComponent } from '../../ireland/page-content/ireland-page-content.component';

@Component({
  selector: 'app-ireland-work-study-guide',
  standalone: true,
  imports: [IrelandPageContentComponent],
  templateUrl: './ireland-work-study-guide.component.html',
})
export class IrelandWorkStudyGuideComponent {
  readonly page = {
    title: '爱尔兰半工半读指南',
    englishTitle: 'Ireland Work And Study Guide',
    audience: 'SEO指南页，支撑半工半读落地页',
    keywords: '爱尔兰半工半读、学生兼职、语言学校、Stamp 2、毕业工签',
    heroImage:
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80',
    summary:
      '爱尔兰半工半读要同时考虑课程合规、签证规则、英语能力、城市机会和预算安全。兼职不能作为唯一资金来源，所有工作权限都必须以 Irish Immigration 最新规定为准。',
    metrics: [
      { value: '合规', label: '课程和签证类型必须匹配官方要求' },
      { value: '英语', label: '找工作和课堂学习都依赖沟通能力' },
      { value: '预算', label: '不能把兼职收入当作主要学费来源' },
    ],
    cardsTitle: '半工半读落地重点',
    cards: [
      {
        icon: 'gavel',
        title: '签证和课程合规',
        text: '需要确认课程是否符合学生签证要求，以及学习期间是否具备相应工作权限。',
      },
      {
        icon: 'work',
        title: '兼职机会',
        text: '常见兼职和城市机会有关，英语表达、时间安排和履历准备会影响求职。',
      },
      {
        icon: 'school',
        title: '学习优先',
        text: '半工半读不是只打工，出勤、考试、课程进度和签证续签都与学习表现相关。',
      },
      {
        icon: 'account_balance_wallet',
        title: '资金安全',
        text: '出发前仍需准备足够学费和生活费，避免因找工作不顺影响学习和签证。',
      },
    ],
    guideTitle: '页面提示',
    guideText:
      '半工半读页面要讲清楚机会和边界。它可以吸引预算敏感用户，但必须避免暗示“打工可覆盖全部费用”。',
    checklist: [
      '确认课程是否符合学生签证和工作权限要求。',
      '确认城市、住宿、交通和兼职机会是否匹配。',
      '出发前准备英文简历、面试表达和基础生活预算。',
      '签证和工作时长规则以官方最新政策为准。',
    ],
    sources: [
      { label: 'Irish Immigration - Study Options', url: 'https://www.irishimmigration.ie/coming-to-study-in-ireland/what-are-my-study-options/a-third-level-course-or-a-language-course/' },
      { label: 'Irish Immigration', url: 'https://www.irishimmigration.ie/' },
      { label: 'Education in Ireland - Living in Ireland', url: 'https://www.educationinireland.com/en/living-in-ireland/' },
    ],
  };
}

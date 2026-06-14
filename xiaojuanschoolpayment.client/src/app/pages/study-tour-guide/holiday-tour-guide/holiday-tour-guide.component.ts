import { Component } from '@angular/core';
import { StudyTourPageContentComponent } from '../../overseas-study-tour/page-content/study-tour-page-content.component';

@Component({
  selector: 'app-holiday-tour-guide',
  standalone: true,
  imports: [StudyTourPageContentComponent],
  templateUrl: './holiday-tour-guide.component.html',
})
export class HolidayTourGuideComponent {
  readonly page = {
    title: '寒暑假游学指南',
    englishTitle: 'Holiday Study Tour Guide',
    positioning: 'SEO指南页，季节性强需求',
    keywords: '寒假游学、暑假游学、夏令营、冬令营、短期英语营',
    heroImage:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    intro:
      '寒暑假游学是最常见的短期项目类型，适合青少年利用假期集中体验英语课堂、海外生活和文化活动。热门项目名额、住宿和机票都会受季节影响，需要尽早规划。',
    highlights: [
      { value: '旺季', label: '暑假和寒假名额更紧张' },
      { value: '短期', label: '常见周期为1到4周' },
      { value: '营地', label: '夏校、冬令营和语言营选择多' },
    ],
    cardsTitle: '寒暑假项目怎么选',
    cards: [
      {
        icon: 'calendar_month',
        title: '提前锁定时间',
        text: '学校假期、开营日期、签证和机票要一起看，热门营地建议提前报名。',
      },
      {
        icon: 'groups',
        title: '年龄分组',
        text: '青少年项目要确认年龄段、英语分级、住宿楼层和老师学生比例。',
      },
      {
        icon: 'sports_soccer',
        title: '活动主题',
        text: '可选择英语+运动、英语+艺术、英语+STEM、名校参访或纯语言训练。',
      },
      {
        icon: 'security',
        title: '安全管理',
        text: '寒暑假低龄学生集中出行，接送、门禁、保险和带队安排必须明确。',
      },
    ],
    checklistTitle: '报名时间线',
    checklist: [
      '提前3到6个月确认国家、项目周期、预算和护照有效期。',
      '热门夏令营先锁定名额和住宿，再安排签证和机票。',
      '确认课程、活动、餐食、接送、监护和退款规则。',
      '出发前准备行李清单、紧急联系人和学生行为规则。',
    ],
    sources: [
      { label: 'Study UK - Short flexible courses', url: 'https://study-uk.britishcouncil.org/why-study/short-flexible-courses' },
      { label: 'EducationUSA - Short-Term Study', url: 'https://educationusa.state.gov/your-5-steps-us-study/research-your-options/short-term' },
      { label: 'Study Australia', url: 'https://www.studyinaustralia.gov.au/en' },
    ],
  };
}

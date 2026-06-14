import { Component } from '@angular/core';
import { StudyTourPageContentComponent } from '../../overseas-study-tour/page-content/study-tour-page-content.component';

@Component({
  selector: 'app-choose-language-school',
  standalone: true,
  imports: [StudyTourPageContentComponent],
  templateUrl: './choose-language-school.component.html',
})
export class ChooseLanguageSchoolComponent {
  readonly page = {
    title: '如何选择语言学校',
    englishTitle: 'How To Choose A Language School',
    positioning: 'SEO指南页，承接选校疑虑',
    keywords: '语言学校、课程强度、认证、住宿、师资、班级规模',
    heroImage:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
    intro:
      '选择语言学校时，不能只看国家和价格。更重要的是课程目标、班级人数、师资背景、学校认证、住宿安全、学生照顾和课后活动是否符合学生的年龄与学习目标。',
    highlights: [
      { value: '目标', label: '先确认口语、考试、亲子还是升学衔接' },
      { value: '资质', label: '优先查看学校认证和课程体系' },
      { value: '照顾', label: '低龄学生重点看监护和住宿安全' },
    ],
    cardsTitle: '选校核心维度',
    cards: [
      {
        icon: 'verified',
        title: '学校资质',
        text: '优先查看学校是否有当地认可、行业协会或质量认证，避免只看营销图片。',
      },
      {
        icon: 'groups',
        title: '班型和师资',
        text: '确认一对一、小班、大班、外教比例、分级测试和老师反馈机制。',
      },
      {
        icon: 'hotel',
        title: '住宿和生活',
        text: '比较宿舍、寄宿家庭或酒店安排，重点看通勤、安全、餐食和管理。',
      },
      {
        icon: 'event_available',
        title: '活动和支持',
        text: '好的游学项目不只是上课，还要有课后练习、文化活动和紧急支持。',
      },
    ],
    checklistTitle: '咨询顾问时问这些',
    checklist: [
      '学生年龄、英语水平、目标和可接受课程强度是什么。',
      '学校是否有分级测试、学习反馈和结业证明。',
      '住宿距离、房型、餐食、门禁和接送安排是否清楚。',
      '如果是考试或升学目标，确认课程是否真正对应目标分数或路径。',
    ],
    sources: [
      { label: 'English UK', url: 'https://www.englishuk.com/' },
      { label: 'English Australia', url: 'https://www.englishaustralia.com.au/' },
      { label: 'EducationUSA - English Language', url: 'https://educationusa.state.gov/your-5-steps-us-study/research-your-options/english-language' },
    ],
  };
}

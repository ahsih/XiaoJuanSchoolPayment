import { Component } from '@angular/core';
import { StudyTourPageContentComponent } from '../../overseas-study-tour/page-content/study-tour-page-content.component';

@Component({
  selector: 'app-family-tour-guide',
  standalone: true,
  imports: [StudyTourPageContentComponent],
  templateUrl: './family-tour-guide.component.html',
})
export class FamilyTourGuideComponent {
  readonly page = {
    title: '亲子游学指南',
    englishTitle: 'Family Study Tour Guide',
    positioning: 'SEO指南页，家庭用户入口',
    keywords: '亲子游学、低龄游学、家长陪读、住宿、安全、课堂体验',
    heroImage:
      'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=1200&q=80',
    intro:
      '亲子游学的重点不是把课程排满，而是让孩子在安全、可适应的环境中接触英语课堂和海外生活。家长需要重点关注住宿、照顾、接送、餐食、课堂适配和活动安全。',
    highlights: [
      { value: '安全', label: '低龄项目第一优先级' },
      { value: '陪同', label: '家长同住、陪读或分开上课需提前确认' },
      { value: '体验', label: '英语课堂和生活体验要平衡' },
    ],
    cardsTitle: '亲子游学关注点',
    cards: [
      {
        icon: 'family_restroom',
        title: '家长角色',
        text: '确认家长是陪读、同住、参与活动，还是有单独成人课程安排。',
      },
      {
        icon: 'child_care',
        title: '孩子适应',
        text: '低龄孩子要看年龄分班、课堂节奏、午休、餐食和是否有中文支持。',
      },
      {
        icon: 'shield',
        title: '安全照顾',
        text: '接送、门禁、紧急联系人、医疗保险和活动监管必须提前确认。',
      },
      {
        icon: 'hotel',
        title: '住宿舒适度',
        text: '亲子项目住宿比单人学生项目更重要，要看房型、距离、餐食和洗衣便利。',
      },
    ],
    checklistTitle: '亲子项目咨询清单',
    checklist: [
      '孩子年龄、英语基础、是否第一次出国和是否能独立上课。',
      '家长是否需要陪读课程、自由活动时间或同住安排。',
      '住宿、餐食、接送、保险、医疗和紧急联系人是否清楚。',
      '课程和活动比例是否符合孩子精力，避免行程过满。',
    ],
    sources: [
      { label: 'British Council - LearnEnglish Kids', url: 'https://learnenglishkids.britishcouncil.org/' },
      { label: 'Study UK - Support while you study', url: 'https://study-uk.britishcouncil.org/moving-uk/support-while-you-study' },
      { label: 'EduCanada - Plan your studies', url: 'https://www.educanada.ca/study-plan-etudes/index.aspx?lang=eng' },
    ],
  };
}

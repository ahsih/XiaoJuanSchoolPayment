import { Component } from '@angular/core';
import { StudyTourPageContentComponent } from '../../overseas-study-tour/page-content/study-tour-page-content.component';

@Component({
  selector: 'app-tour-accommodation-guide',
  standalone: true,
  imports: [StudyTourPageContentComponent],
  templateUrl: './tour-accommodation-guide.component.html',
})
export class TourAccommodationGuideComponent {
  readonly page = {
    title: '游学住宿指南',
    englishTitle: 'Study Tour Accommodation Guide',
    positioning: 'SEO指南页，解决安全与生活疑虑',
    keywords: '游学住宿、寄宿家庭、学生宿舍、酒店、房型、安全',
    heroImage:
      'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?auto=format&fit=crop&w=1200&q=80',
    intro:
      '住宿会直接影响游学体验。不同国家和项目常见住宿包括寄宿家庭、学生宿舍、校内公寓、酒店或营地住宿。选择时要关注安全、距离、餐食、房型、管理和紧急支持。',
    highlights: [
      { value: '安全', label: '低龄和亲子项目尤其重要' },
      { value: '距离', label: '通勤时间会影响学习状态' },
      { value: '规则', label: '门禁、餐食和洗衣要提前确认' },
    ],
    cardsTitle: '常见住宿类型',
    cards: [
      {
        icon: 'home',
        title: '寄宿家庭',
        text: '适合希望体验当地生活和日常英语的学生，要确认餐食、通勤和家庭规则。',
      },
      {
        icon: 'apartment',
        title: '学生宿舍',
        text: '适合同龄学生集中管理，重点看房型、卫浴、门禁、洗衣和校区距离。',
      },
      {
        icon: 'hotel',
        title: '酒店或公寓',
        text: '常见于亲子或短期项目，舒适度高，但要看是否有学习和社交氛围。',
      },
      {
        icon: 'supervisor_account',
        title: '营地住宿',
        text: '适合夏令营和冬令营，要确认辅导员比例、夜间管理和活动安全。',
      },
    ],
    checklistTitle: '住宿确认清单',
    checklist: [
      '确认房型、是否独卫、餐食包含几餐、洗衣和网络情况。',
      '确认从住宿到学校的距离、交通方式和接送安排。',
      '低龄学生确认门禁、夜间管理、紧急联系人和医疗支持。',
      '提前了解押金、损坏赔偿、入住退房和特殊饮食规则。',
    ],
    sources: [
      { label: 'Study UK - Finding somewhere to live', url: 'https://study-uk.britishcouncil.org/moving-uk/finding-somewhere-live' },
      { label: 'Education in Ireland - Student Accommodation', url: 'https://www.educationinireland.com/en/plan-your-study-abroad/student-accommodation/' },
      { label: 'EduCanada - Plan your studies', url: 'https://www.educanada.ca/study-plan-etudes/index.aspx?lang=eng' },
    ],
  };
}

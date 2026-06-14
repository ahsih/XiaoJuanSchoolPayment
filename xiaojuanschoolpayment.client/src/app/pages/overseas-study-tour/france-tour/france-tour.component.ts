import { Component } from '@angular/core';
import { StudyTourPageContentComponent } from '../page-content/study-tour-page-content.component';

@Component({
  selector: 'app-france-tour',
  standalone: true,
  imports: [StudyTourPageContentComponent],
  templateUrl: './france-tour.component.html',
})
export class FranceTourComponent {
  readonly page = {
    title: '法国游学',
    englishTitle: 'France Study Tour',
    positioning: '国家页，补充欧洲目的地',
    keywords: '法语、艺术文化、欧洲课堂、巴黎、设计',
    heroImage:
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
    intro:
      '法国游学适合对法语、艺术、设计、时尚、历史和欧洲文化感兴趣的学生。Campus France 提供法国学习、生活、签证、住宿和法语学习等官方信息。',
    highlights: [
      { value: '法语', label: '适合法语启蒙和欧洲语言体验' },
      { value: '艺术', label: '艺术、设计、时尚和博物馆资源突出' },
      { value: '欧洲', label: '可补充英语目的地之外的欧洲路线' },
    ],
    cardsTitle: '法国游学重点',
    cards: [
      {
        icon: 'palette',
        title: '艺术文化强',
        text: '适合安排博物馆、建筑、设计、时尚和艺术工作坊主题。',
      },
      {
        icon: 'translate',
        title: '法语体验',
        text: '可设计入门法语、法式生活表达和跨文化沟通课程。',
      },
      {
        icon: 'location_city',
        title: '城市资源丰富',
        text: '巴黎、里昂、尼斯等城市适合不同主题的文化和学习体验。',
      },
      {
        icon: 'school',
        title: '升学延展',
        text: '对艺术、设计、商科或法语区留学感兴趣的学生，可继续了解法国高等教育。',
      },
    ],
    checklistTitle: '选项目建议',
    checklist: [
      '明确学生更重视法语、艺术文化、设计体验还是欧洲旅行。',
      '如果是低龄项目，确认住宿、陪同、接送和安全管理。',
      '注意法国游学不一定以英语提升为核心，定位要讲清楚。',
      '对长期法国留学感兴趣的学生，可同步了解法语学习路径。',
    ],
    sources: [
      { label: 'Campus France', url: 'https://www.campusfrance.org/en' },
      { label: 'Campus France - Learning French', url: 'https://www.campusfrance.org/en/learning-French-France' },
      { label: 'France.fr', url: 'https://www.france.fr/en/' },
    ],
  };
}

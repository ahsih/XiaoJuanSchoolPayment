import { Component } from '@angular/core';
import { StudyTourPageContentComponent } from '../page-content/study-tour-page-content.component';

@Component({
  selector: 'app-australia-tour',
  standalone: true,
  imports: [StudyTourPageContentComponent],
  templateUrl: './australia-tour.component.html',
})
export class AustraliaTourComponent {
  readonly page = {
    title: '澳大利亚游学',
    englishTitle: 'Australia Study Tour',
    positioning: '国家页，适合长期规划和生活体验',
    keywords: '澳洲英语、ELICOS、自然课堂、亲子、升学体验',
    heroImage:
      'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1200&q=80',
    intro:
      '澳大利亚游学适合希望体验英语课堂、阳光海岸、多元城市和未来升学环境的学生。Study Australia 提供官方国际学生信息，澳洲也有面向海外学生的 ELICOS 英语课程体系。',
    highlights: [
      { value: 'ELICOS', label: '澳洲英语课程体系成熟' },
      { value: '生活', label: '城市、海岸和自然体验丰富' },
      { value: '升学', label: '可衔接中学、本科和语言课程咨询' },
    ],
    cardsTitle: '澳大利亚游学重点',
    cards: [
      {
        icon: 'wb_sunny',
        title: '生活体验强',
        text: '适合结合海岸、城市、校园和户外活动，体验澳洲学习生活节奏。',
      },
      {
        icon: 'record_voice_over',
        title: '英语课程成熟',
        text: '澳洲 ELICOS 体系面向国际学生，适合通用英语、学术英语和升学前语言准备。',
      },
      {
        icon: 'family_restroom',
        title: '亲子项目友好',
        text: '适合家庭希望孩子短期体验英语课堂，同时安排亲子陪同和城市生活。',
      },
      {
        icon: 'flight',
        title: '行程距离较远',
        text: '飞行距离和预算较高，建议选择时间更充足的寒暑假项目。',
      },
    ],
    checklistTitle: '项目筛选重点',
    checklist: [
      '确认项目是英语学校课程、夏令营、插班体验还是亲子项目。',
      '比较城市：悉尼、墨尔本、布里斯班、黄金海岸等风格不同。',
      '核对住宿、接送、保险、监护和活动安全安排。',
      '后续如考虑长期留学，可同步了解语言衔接和升学路径。',
    ],
    sources: [
      { label: 'Study Australia', url: 'https://www.studyinaustralia.gov.au/en' },
      { label: 'Australian Government - ELICOS Standards', url: 'https://www.education.gov.au/esos-framework/elicos-standards' },
      { label: 'Tourism Australia', url: 'https://www.australia.com/' },
    ],
  };
}

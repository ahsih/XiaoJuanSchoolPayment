import { Component } from '@angular/core';
import { StudyTourPageContentComponent } from '../page-content/study-tour-page-content.component';

@Component({
  selector: 'app-canada-tour',
  standalone: true,
  imports: [StudyTourPageContentComponent],
  templateUrl: './canada-tour.component.html',
})
export class CanadaTourComponent {
  readonly page = {
    title: '加拿大游学',
    englishTitle: 'Canada Study Tour',
    positioning: '国家页，北美英语环境',
    keywords: '加拿大英语、冬夏令营、校园体验、多元文化、自然体验',
    heroImage:
      'https://images.unsplash.com/photo-1517935706615-2717063c2225?auto=format&fit=crop&w=1200&q=80',
    intro:
      '加拿大游学适合希望体验北美英语环境、多元文化和自然户外活动的学生。EduCanada 是加拿大政府面向国际学生的官方学习信息来源，涵盖教育体系、费用、签证和生活规划。',
    highlights: [
      { value: '北美', label: '英语环境和校园文化适合长期升学启蒙' },
      { value: '多元', label: '社区和课堂国际化程度较高' },
      { value: '自然', label: '适合结合户外、城市和校园体验' },
    ],
    cardsTitle: '加拿大游学重点',
    cards: [
      {
        icon: 'diversity_3',
        title: '多元文化',
        text: '适合希望在包容环境中练习英语、适应海外课堂和了解北美生活的学生。',
      },
      {
        icon: 'landscape',
        title: '自然活动丰富',
        text: '可以结合湖区、山地、博物馆、城市探索和户外活动，体验感强。',
      },
      {
        icon: 'school',
        title: '升学认知',
        text: '适合加入中学、学院或大学参访，为未来加拿大留学做初步了解。',
      },
      {
        icon: 'ac_unit',
        title: '季节差异明显',
        text: '寒假和暑假体验差异较大，冬季项目需重点考虑衣物、天气和活动安排。',
      },
    ],
    checklistTitle: '适合什么学生',
    checklist: [
      '希望了解北美教育和加拿大生活环境。',
      '重视安全、多元文化和户外活动体验。',
      '后续可能考虑加拿大中学、本科、学院或语言课程。',
      '能接受较长飞行距离和较高整体预算。',
    ],
    sources: [
      { label: 'EduCanada', url: 'https://www.educanada.ca/index.aspx?lang=eng' },
      { label: 'Government of Canada - Study in Canada', url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada.html' },
      { label: 'Destination Canada', url: 'https://travel.destinationcanada.com/' },
    ],
  };
}

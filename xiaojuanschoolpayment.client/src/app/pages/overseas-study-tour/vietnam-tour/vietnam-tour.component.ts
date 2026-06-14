import { Component } from '@angular/core';
import { StudyTourPageContentComponent } from '../page-content/study-tour-page-content.component';

@Component({
  selector: 'app-vietnam-tour',
  standalone: true,
  imports: [StudyTourPageContentComponent],
  templateUrl: './vietnam-tour.component.html',
})
export class VietnamTourComponent {
  readonly page = {
    title: '越南游学',
    englishTitle: 'Vietnam Study Tour',
    positioning: '国家页，补充亚洲目的地',
    keywords: '东南亚文化、低成本、短期体验、城市探索、亲子',
    heroImage:
      'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
    intro:
      '越南游学适合希望用较低预算体验东南亚文化、城市探索和跨文化交流的学生。越南国家旅游官方信息可作为文化和目的地内容参考，项目可围绕河内、胡志明市、岘港等城市设计。',
    highlights: [
      { value: '成本', label: '适合预算友好的短期体验' },
      { value: '亚洲', label: '补充菲律宾、新加坡、马来西亚之外的目的地' },
      { value: '文化', label: '城市、历史、饮食和社区体验丰富' },
    ],
    cardsTitle: '越南游学重点',
    cards: [
      {
        icon: 'travel_explore',
        title: '文化体验强',
        text: '适合安排历史街区、博物馆、饮食文化、手作体验和城市探索。',
      },
      {
        icon: 'payments',
        title: '预算友好',
        text: '相比欧美目的地，总体费用更容易控制，适合短期体验和亲子项目。',
      },
      {
        icon: 'groups',
        title: '跨文化交流',
        text: '可以设计与本地学生交流、志愿活动或社区体验，提升国际视野。',
      },
      {
        icon: 'map',
        title: '城市选择灵活',
        text: '河内偏历史文化，胡志明市偏都市体验，岘港适合海滨和轻松短期项目。',
      },
    ],
    checklistTitle: '项目定位要讲清楚',
    checklist: [
      '越南项目更适合文化体验和短期拓展，不应包装成强英语提升项目。',
      '确认学生年龄、餐食适应、住宿标准和交通安全安排。',
      '适合与东南亚多国游学、亲子短期体验或研学旅行组合。',
      '明确学习内容、交流对象和每天活动比例，避免只有观光。',
    ],
    sources: [
      { label: 'Vietnam National Authority of Tourism', url: 'https://vietnamtourism.gov.vn/en' },
      { label: 'Vietnam Travel', url: 'https://vietnam.travel/' },
      { label: 'Hanoikids', url: 'https://hanoikids.org/' },
    ],
  };
}

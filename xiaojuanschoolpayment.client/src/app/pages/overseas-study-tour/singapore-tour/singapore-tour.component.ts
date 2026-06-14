import { Component } from '@angular/core';
import { StudyTourPageContentComponent } from '../page-content/study-tour-page-content.component';

@Component({
  selector: 'app-singapore-tour',
  standalone: true,
  imports: [StudyTourPageContentComponent],
  templateUrl: './singapore-tour.component.html',
})
export class SingaporeTourComponent {
  readonly page = {
    title: '新加坡游学',
    englishTitle: 'Singapore Study Tour',
    positioning: '国家页，距离近，适合短期项目',
    keywords: '双语环境、亚洲教育、短期营、亲子、低龄体验',
    heroImage:
      'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80',
    intro:
      '新加坡游学适合希望距离近、行程短、管理清晰的家庭和青少年。新加坡教育体系强调英语学习、双语环境和高效城市体验，适合做低龄启蒙或短期营项目。',
    highlights: [
      { value: '近', label: '飞行距离和时差压力相对低' },
      { value: '双语', label: '英语环境结合华语沟通便利' },
      { value: '短期', label: '适合寒暑假、亲子和低龄体验' },
    ],
    cardsTitle: '新加坡游学重点',
    cards: [
      {
        icon: 'translate',
        title: '双语环境',
        text: '英语学习环境清晰，同时华语沟通便利，适合第一次海外项目的学生和家长。',
      },
      {
        icon: 'schedule',
        title: '短期友好',
        text: '适合一到两周的城市营、学校体验、STEM活动或亲子游学安排。',
      },
      {
        icon: 'security',
        title: '管理便利',
        text: '城市基础设施成熟，交通便利，适合重视安全、秩序和照顾服务的家庭。',
      },
      {
        icon: 'science',
        title: '主题项目丰富',
        text: '可结合英语、科技、城市探索、名校参访和文化体验设计行程。',
      },
    ],
    checklistTitle: '选项目看这些',
    checklist: [
      '确认项目是英语营、学校插班、亲子活动还是主题营。',
      '低龄学生要重点确认住宿、接送、陪同和紧急联系。',
      '比较课程时间和观光时间比例，避免只有旅游没有学习。',
      '根据学生年龄确认签证、保险和监护要求。',
    ],
    sources: [
      { label: 'Singapore Ministry of Education', url: 'https://www.moe.gov.sg/' },
      { label: 'Visit Singapore', url: 'https://www.visitsingapore.com/' },
      { label: 'SkillsFuture Singapore', url: 'https://www.skillsfuture.gov.sg/' },
    ],
  };
}

import { Component } from '@angular/core';
import { StudyTourPageContentComponent } from '../page-content/study-tour-page-content.component';

@Component({
  selector: 'app-ireland-tour',
  standalone: true,
  imports: [StudyTourPageContentComponent],
  templateUrl: './ireland-tour.component.html',
})
export class IrelandTourComponent {
  readonly page = {
    title: '爱尔兰游学',
    englishTitle: 'Ireland Study Tour',
    positioning: '国家页，可与爱尔兰留学业务形成衔接',
    keywords: '英语环境、欧洲文化、大学参访、短期体验、后续留学',
    heroImage:
      'https://images.unsplash.com/photo-1590089415225-401ed6f9db8e?auto=format&fit=crop&w=1200&q=80',
    intro:
      '爱尔兰游学适合希望体验欧洲英语环境、建立爱尔兰留学兴趣，并为后续本科、硕士或语言课程做铺垫的学生。Education in Ireland 强调爱尔兰兼具教育、职业机会和生活体验。',
    highlights: [
      { value: '英语', label: '欧洲英语国家，适合语言和文化体验' },
      { value: '衔接', label: '可自然连接爱尔兰本科、硕士和语言课程咨询' },
      { value: '体验', label: '城市、校园和自然文化内容丰富' },
    ],
    cardsTitle: '爱尔兰游学重点',
    cards: [
      {
        icon: 'language',
        title: '真实英语环境',
        text: '课堂、住宿、城市活动和校园参访都围绕英语沟通展开，适合提升开口信心。',
      },
      {
        icon: 'school',
        title: '留学认知铺垫',
        text: '可加入大学参访、专业介绍和学生生活体验，帮助学生判断是否适合长期留学。',
      },
      {
        icon: 'travel_explore',
        title: '欧洲文化体验',
        text: '适合安排都柏林、科克、高威等城市内容，结合历史、文学、音乐和自然景观。',
      },
      {
        icon: 'route',
        title: '后续转化自然',
        text: '对爱尔兰感兴趣的学生可继续咨询语言课程、本科申请、硕士申请或半工半读方向。',
      },
    ],
    checklistTitle: '适合什么学生',
    checklist: [
      '希望先短期体验爱尔兰，再决定是否长期留学。',
      '重视英语环境，同时希望感受欧洲生活和文化。',
      '家长希望通过游学观察孩子海外适应能力。',
      '后续可能衔接爱尔兰院校申请、语言课程或夏校项目。',
    ],
    sources: [
      { label: 'Education in Ireland', url: 'https://www.educationinireland.com/en/' },
      { label: 'Education in Ireland - Living in Ireland', url: 'https://www.educationinireland.com/en/living-in-ireland/' },
      { label: 'Irish Immigration', url: 'https://www.irishimmigration.ie/coming-to-study-in-ireland/' },
    ],
  };
}

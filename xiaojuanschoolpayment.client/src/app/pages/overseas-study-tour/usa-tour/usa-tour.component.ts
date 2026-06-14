import { Component } from '@angular/core';
import { StudyTourPageContentComponent } from '../page-content/study-tour-page-content.component';

@Component({
  selector: 'app-usa-tour',
  standalone: true,
  imports: [StudyTourPageContentComponent],
  templateUrl: './usa-tour.component.html',
})
export class UsaTourComponent {
  readonly page = {
    title: '美国游学',
    englishTitle: 'USA Study Tour',
    positioning: '国家页，预算高，后期拓展空间大',
    keywords: '美国英语、校园参访、夏校、STEM、名校体验',
    heroImage:
      'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?auto=format&fit=crop&w=1200&q=80',
    intro:
      '美国游学适合希望体验北美课堂、大学校园、STEM项目和多元文化的学生。EducationUSA 是美国国务院支持的官方留学信息网络，提供关于美国教育体系、短期学习、英语语言和申请步骤的信息。',
    highlights: [
      { value: '资源', label: '学校、营地和主题项目选择丰富' },
      { value: 'STEM', label: '适合科技、创新和名校体验项目' },
      { value: '预算', label: '整体费用较高，需要提前规划' },
    ],
    cardsTitle: '美国游学重点',
    cards: [
      {
        icon: 'science',
        title: '主题项目丰富',
        text: '可围绕英语、STEM、领导力、艺术、体育或大学体验做项目选择。',
      },
      {
        icon: 'account_balance',
        title: '校园参访吸引力强',
        text: '适合加入大学参访和升学讲座，帮助学生理解美国教育和专业选择。',
      },
      {
        icon: 'public',
        title: '多元文化课堂',
        text: '美国项目适合希望开阔视野、提升表达和参与课堂讨论的学生。',
      },
      {
        icon: 'payments',
        title: '费用和签证要早规划',
        text: '美国项目预算较高，签证、机票、保险和营地名额都建议提前确认。',
      },
    ],
    checklistTitle: '适合什么规划',
    checklist: [
      '学生对美国大学、STEM、艺术、体育或领导力主题感兴趣。',
      '希望通过短期项目判断是否适合未来美国留学。',
      '家庭可以接受较高预算和较长飞行距离。',
      '需要提前确认签证类型、项目资质、住宿和安全照顾。',
    ],
    sources: [
      { label: 'EducationUSA', url: 'https://educationusa.state.gov/' },
      { label: 'EducationUSA - Short-Term Study', url: 'https://educationusa.state.gov/your-5-steps-us-study/research-your-options/short-term' },
      { label: 'Visit The USA', url: 'https://www.visittheusa.com/' },
    ],
  };
}

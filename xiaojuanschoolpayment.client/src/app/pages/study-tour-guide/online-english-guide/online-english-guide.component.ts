import { Component } from '@angular/core';
import { StudyTourPageContentComponent } from '../../overseas-study-tour/page-content/study-tour-page-content.component';

@Component({
  selector: 'app-online-english-guide',
  standalone: true,
  imports: [StudyTourPageContentComponent],
  templateUrl: './online-english-guide.component.html',
})
export class OnlineEnglishGuideComponent {
  readonly page = {
    title: '线上英语怎么选',
    englishTitle: 'How To Choose Online English',
    positioning: 'SEO指南页，承接线上英语引流',
    keywords: '线上英语、一对一外教、雅思口语、青少年英语、体验课',
    heroImage:
      'https://images.unsplash.com/photo-1584697964358-3e14ca57658b?auto=format&fit=crop&w=1200&q=80',
    intro:
      '线上英语适合低门槛开始练习口语、补充线下游学前准备，或在游学后保持英语输出。选择时要重点看老师稳定性、课程目标、上课频率、反馈机制和是否适合学生年龄。',
    highlights: [
      { value: '低门槛', label: '适合先体验再决定长期规划' },
      { value: '衔接', label: '可连接菲律宾游学和雅思口语需求' },
      { value: '频率', label: '坚持上课频率比单节课更重要' },
    ],
    cardsTitle: '线上英语选择重点',
    cards: [
      {
        icon: 'record_voice_over',
        title: '老师稳定性',
        text: '一对一课程要看是否能固定老师、固定时间，以及老师是否了解学生目标。',
      },
      {
        icon: 'track_changes',
        title: '目标清晰',
        text: '口语启蒙、日常会话、雅思口语、写作批改和青少年课程的设计不同。',
      },
      {
        icon: 'event_repeat',
        title: '上课频率',
        text: '每周一到三次更容易形成连续输出，短期冲刺则需要更高频率。',
      },
      {
        icon: 'feedback',
        title: '课后反馈',
        text: '好的线上课程应提供错题、表达建议、发音反馈和下节课目标。',
      },
    ],
    checklistTitle: '体验课看什么',
    checklist: [
      '老师是否能引导学生开口，而不是一直讲解。',
      '课程内容是否符合年龄、水平和目标。',
      '是否有课后反馈、学习记录和阶段规划。',
      '网络、平台、排课、请假和退款规则是否清楚。',
    ],
    sources: [
      { label: 'British Council LearnEnglish', url: 'https://learnenglish.britishcouncil.org/' },
      { label: 'Cambridge English', url: 'https://www.cambridgeenglish.org/' },
      { label: 'EducationUSA - Online Learning', url: 'https://educationusa.state.gov/your-5-steps-us-study/research-your-options/online-learning' },
    ],
  };
}

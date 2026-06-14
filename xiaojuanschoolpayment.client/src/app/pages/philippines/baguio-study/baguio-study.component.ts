import { Component } from '@angular/core';

interface HighlightCard {
  icon: string;
  title: string;
  text: string;
}

interface SchoolType {
  title: string;
  tag: string;
  text: string;
}

@Component({
  selector: 'app-baguio-study',
  standalone: false,
  templateUrl: './baguio-study.component.html',
  styleUrl: './baguio-study.component.css',
})
export class BaguioStudyComponent {
  readonly highlights: HighlightCard[] = [
    {
      icon: 'terrain',
      title: '学习氛围更集中',
      text: '碧瑶位于菲律宾北部山城，气候凉爽、娱乐干扰较少，整体更适合专注学习和长期备考。',
    },
    {
      icon: 'school',
      title: '斯巴达学校集中',
      text: '许多碧瑶学校以高强度管理、固定自习、单词测试和晚间课程见长，适合需要外部节奏推动的学生。',
    },
    {
      icon: 'edit_note',
      title: '适合考试冲刺',
      text: '雅思、多益和升学英语需求较强的学生，可以优先关注模考体系、课程强度和老师反馈机制。',
    },
    {
      icon: 'savings',
      title: '生活成本相对友好',
      text: '相比热门海岛城市，碧瑶整体生活节奏更朴素，适合希望把预算更多投入学习本身的学生。',
    },
  ];

  readonly schoolTypes: SchoolType[] = [
    {
      title: '斯巴达冲刺型',
      tag: 'Sparta / Intensive',
      text: '适合自律较弱、想快速进入学习状态、需要每天固定学习安排的学生。',
    },
    {
      title: '雅思备考型',
      tag: 'IELTS / Mock Test',
      text: '适合有明确分数目标，需要模考、写作批改、口语反馈和阶段复盘的学生。',
    },
    {
      title: '基础强化型',
      tag: 'ESL / Foundation',
      text: '适合英语基础薄弱，想先补词汇、语法、听力和开口表达的学生。',
    },
    {
      title: '长期学习型',
      tag: '8 weeks+',
      text: '适合计划学习两个月以上，希望在稳定环境中逐步提升英语能力的人群。',
    },
  ];

  readonly compareRows = [
    { label: '城市定位', baguio: '山城、凉爽、安静、学习导向', cebu: '海岛城市、生活便利、体验感强' },
    { label: '学习强度', baguio: '更适合斯巴达和考试冲刺', cebu: '更适合多样课程和学习生活平衡' },
    { label: '适合人群', baguio: '雅思、多益、长期学习、自律较弱', cebu: '初次游学、亲子、短期体验、口语提升' },
    { label: '选校重点', baguio: '管理制度、模考体系、自习安排、学习时长', cebu: '住宿环境、课程比例、校区位置、活动便利' },
  ];
}

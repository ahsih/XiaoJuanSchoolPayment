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
  selector: 'app-bacolod-study',
  standalone: false,
  templateUrl: './bacolod-study.component.html',
  styleUrl: './bacolod-study.component.css',
})
export class BacolodStudyComponent {
  readonly highlights: HighlightCard[] = [
    {
      icon: 'savings',
      title: '整体成本更友好',
      text: '巴科洛德生活节奏平稳，住宿、餐饮和日常开销通常更容易控制，适合预算敏感型学生。',
    },
    {
      icon: 'spa',
      title: '城市环境更安静',
      text: '相比热门海岛或大城市，巴科洛德更适合想减少干扰、稳定上课和规律生活的学生。',
    },
    {
      icon: 'record_voice_over',
      title: '适合基础口语强化',
      text: '如果目标是从敢开口、打基础开始，选择低压力城市能帮助学生更自然地坚持学习。',
    },
    {
      icon: 'restaurant',
      title: '生活便利又不拥挤',
      text: '巴科洛德有城市生活配套，也保留较轻松的日常氛围，适合长期停留和慢节奏学习。',
    },
  ];

  readonly schoolTypes: SchoolType[] = [
    {
      title: '低预算强化型',
      tag: 'Budget ESL',
      text: '适合希望控制整体花费，同时保证一对一课程和稳定学习时间的学生。',
    },
    {
      title: '安静城市型',
      tag: 'Quiet City',
      text: '适合不喜欢太热闹环境，希望在更规律的城市节奏中学习英语的人群。',
    },
    {
      title: '长期基础型',
      tag: 'Long Stay',
      text: '适合需要几个月打基础、培养学习习惯、逐步提升口语和听力的学生。',
    },
    {
      title: '生活适应型',
      tag: 'Easy Living',
      text: '适合第一次出国游学，想要城市便利、生活压力较低和性价比更高的选择。',
    },
  ];

  readonly compareRows = [
    { label: '城市定位', bacolod: '低成本、安静城市、慢节奏学习', cebu: '学校多、海岛体验丰富', baguio: '学习氛围强、考试导向' },
    { label: '学习重点', bacolod: '基础口语、长期ESL、预算控制', cebu: '口语、亲子、短期体验、综合选择', baguio: '雅思、多益、斯巴达冲刺' },
    { label: '适合人群', bacolod: '预算敏感、想安静学习、长期停留', cebu: '第一次游学、想平衡学习和生活', baguio: '自律较弱、想专心备考' },
    { label: '选校重点', bacolod: '费用结构、课程时数、住宿和生活便利', cebu: '课程比例、校区位置、住宿和活动', baguio: '管理制度、模考体系、学习强度' },
  ];
}

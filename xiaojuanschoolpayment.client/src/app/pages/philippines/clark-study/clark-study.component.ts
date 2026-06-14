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
  selector: 'app-clark-study',
  standalone: false,
  templateUrl: './clark-study.component.html',
  styleUrl: './clark-study.component.css',
})
export class ClarkStudyComponent {
  readonly highlights: HighlightCard[] = [
    {
      icon: 'public',
      title: '外教资源更突出',
      text: '克拉克有较强的国际社区背景，部分学校强调欧美外教、发音训练和真实英语沟通环境。',
    },
    {
      icon: 'family_restroom',
      title: '适合亲子和青少年',
      text: '城市节奏相对舒适，课程和生活环境对家庭用户更友好，适合亲子陪读和青少年短期项目。',
    },
    {
      icon: 'villa',
      title: '生活环境较舒适',
      text: '克拉克城市规划较清晰，生活便利度和居住舒适度较高，适合重视环境与安全感的学生。',
    },
    {
      icon: 'record_voice_over',
      title: '重视口语表达',
      text: '如果目标是改善口音、提升开口表达和适应外教沟通，克拉克可以作为优先考虑城市。',
    },
  ];

  readonly schoolTypes: SchoolType[] = [
    {
      title: '外教口语型',
      tag: 'Native / Speaking',
      text: '适合希望接触更多外教课程、改善发音、提升真实沟通能力的学生。',
    },
    {
      title: '亲子陪读型',
      tag: 'Family / Guardian',
      text: '适合家长陪读、孩子短期英语体验、重视住宿环境和生活便利度的家庭。',
    },
    {
      title: '青少年营队型',
      tag: 'Junior / Camp',
      text: '适合寒暑假短期项目，需要课程、活动、照顾和安全管理同时兼顾。',
    },
    {
      title: '舒适强化型',
      tag: 'Comfort / ESL',
      text: '适合想提升英语，但不希望学习和生活节奏过度高压的学生。',
    },
  ];

  readonly compareRows = [
    { label: '城市定位', clark: '国际社区感更强，环境舒适', cebu: '学校多、海岛体验丰富', baguio: '学习氛围强、考试导向' },
    { label: '学习重点', clark: '外教口语、亲子、青少年项目', cebu: '口语、亲子、短期体验、综合选择', baguio: '雅思、多益、斯巴达冲刺' },
    { label: '适合人群', clark: '家庭用户、重视环境、外教偏好', cebu: '第一次游学、想平衡学习和生活', baguio: '自律较弱、想专心备考' },
    { label: '选校重点', clark: '外教比例、住宿环境、接送和安全', cebu: '课程比例、校区位置、住宿和活动', baguio: '管理制度、模考体系、学习强度' },
  ];
}

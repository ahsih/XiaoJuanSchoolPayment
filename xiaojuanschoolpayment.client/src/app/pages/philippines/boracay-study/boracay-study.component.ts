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
  selector: 'app-boracay-study',
  standalone: false,
  templateUrl: './boracay-study.component.html',
  styleUrl: './boracay-study.component.css',
})
export class BoracayStudyComponent {
  readonly heroImage =
    'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Boracay_White_Beach.png/960px-Boracay_White_Beach.png';

  readonly highlights: HighlightCard[] = [
    {
      icon: 'beach_access',
      title: '度假感最强',
      text: '长滩岛以白沙滩和海岛度假氛围闻名，适合希望把英语学习和轻松旅行结合起来的学生。',
    },
    {
      icon: 'family_restroom',
      title: '适合亲子体验',
      text: '如果目标不是高压备考，而是孩子开口、家长陪读和轻松体验英语环境，长滩岛会更友好。',
    },
    {
      icon: 'schedule',
      title: '适合短期安排',
      text: '长滩岛更适合一到数周的短期英语体验、假期营队或学习加旅行的组合方案。',
    },
    {
      icon: 'sailing',
      title: '活动体验丰富',
      text: '学习之外可以结合海滩、跳岛、水上活动和亲子行程，让游学更有记忆点。',
    },
  ];

  readonly schoolTypes: SchoolType[] = [
    {
      title: '亲子度假型',
      tag: 'Family Vacation',
      text: '适合家长陪读、孩子轻松接触英语，同时希望兼顾海岛体验和家庭休闲。',
    },
    {
      title: '短期体验型',
      tag: 'Short Stay',
      text: '适合假期时间有限，想用轻量课程加旅行体验了解菲律宾英语学习的人群。',
    },
    {
      title: '青少年营队型',
      tag: 'Junior Camp',
      text: '适合寒暑假营队、英语活动课和海岛主题体验相结合的学生。',
    },
    {
      title: '轻松口语型',
      tag: 'Easy Speaking',
      text: '适合想练开口表达，但不希望采用斯巴达式高强度管理的学生。',
    },
  ];

  readonly compareRows = [
    { label: '城市定位', boracay: '海岛度假、亲子、短期体验', cebu: '学校多、海岛体验丰富', baguio: '学习氛围强、考试导向' },
    { label: '学习重点', boracay: '轻松口语、活动体验、假期营队', cebu: '口语、亲子、短期体验、综合选择', baguio: '雅思、多益、斯巴达冲刺' },
    { label: '适合人群', boracay: '家庭用户、低龄学生、假期短期', cebu: '第一次游学、想平衡学习和生活', baguio: '自律较弱、想专心备考' },
    { label: '选校重点', boracay: '课程轻重、住宿位置、活动安排和接送', cebu: '课程比例、校区位置、住宿和活动', baguio: '管理制度、模考体系、学习强度' },
  ];
}

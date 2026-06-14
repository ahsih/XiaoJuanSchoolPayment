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
  selector: 'app-manila-study',
  standalone: false,
  templateUrl: './manila-study.component.html',
  styleUrl: './manila-study.component.css',
})
export class ManilaStudyComponent {
  readonly highlights: HighlightCard[] = [
    {
      icon: 'flight_takeoff',
      title: '交通与转机方便',
      text: '马尼拉航班选择多，适合需要灵活出入境、短期停留或搭配其他城市游学行程的学生。',
    },
    {
      icon: 'location_city',
      title: '城市资源集中',
      text: '作为首都圈，马尼拉商业、生活、医疗和购物资源更集中，适合重视城市便利度的人群。',
    },
    {
      icon: 'groups',
      title: '适合成人与商务英语',
      text: '如果学习目标偏职场沟通、商务表达、面试准备或日常社交英语，马尼拉更容易结合真实城市场景。',
    },
    {
      icon: 'route',
      title: '适合过渡和组合方案',
      text: '马尼拉可以作为菲律宾游学的第一站、转机停留点，或与宿务、碧瑶等城市搭配成分阶段学习计划。',
    },
  ];

  readonly schoolTypes: SchoolType[] = [
    {
      title: '成人口语型',
      tag: 'Adult / Speaking',
      text: '适合想提升日常沟通、社交表达和城市生活英语的成人学生。',
    },
    {
      title: '商务英语型',
      tag: 'Business English',
      text: '适合职场人士准备会议表达、面试沟通、邮件写作和跨文化交流。',
    },
    {
      title: '短期体验型',
      tag: 'Short Stay',
      text: '适合假期时间有限、希望用一到数周体验菲律宾英语学习的学生。',
    },
    {
      title: '转机组合型',
      tag: 'Transit / Combo',
      text: '适合计划先适应城市环境，再转往宿务、碧瑶或克拉克强化学习的人群。',
    },
  ];

  readonly compareRows = [
    { label: '城市定位', manila: '首都圈资源集中，交通便利', cebu: '学校多、海岛体验丰富', baguio: '学习氛围强、考试导向' },
    { label: '学习重点', manila: '成人口语、商务英语、短期体验', cebu: '口语、亲子、短期体验、综合选择', baguio: '雅思、多益、斯巴达冲刺' },
    { label: '适合人群', manila: '职场人士、短期学生、转机组合', cebu: '第一次游学、想平衡学习和生活', baguio: '自律较弱、想专心备考' },
    { label: '选校重点', manila: '校区位置、通勤安全、课程实用度', cebu: '课程比例、校区位置、住宿和活动', baguio: '管理制度、模考体系、学习强度' },
  ];
}

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

interface SourceLink {
  label: string;
  url: string;
}

@Component({
  selector: 'app-cebu-study',
  standalone: false,
  templateUrl: './cebu-study.component.html',
  styleUrl: './cebu-study.component.css',
})
export class CebuStudyComponent {
  readonly highlights: HighlightCard[] = [
    {
      icon: 'location_city',
      title: '学校选择多',
      text: '宿务是菲律宾游学最热门城市之一，语言学校集中，课程、住宿和管理模式选择更丰富。',
    },
    {
      icon: 'beach_access',
      title: '学习与生活平衡',
      text: '相比纯考试型城市，宿务更适合希望平日密集学习、周末体验海岛生活的学生。',
    },
    {
      icon: 'flight',
      title: '交通便利',
      text: '宿务有国际机场，接机、入学和短期停留安排较成熟，适合第一次去菲律宾游学的人。',
    },
    {
      icon: 'groups',
      title: '适合人群广',
      text: '从成人口语、雅思备考、亲子游学到青少年短期营，宿务都有对应学校和课程。',
    },
  ];

  readonly schoolTypes: SchoolType[] = [
    {
      title: '口语强化型',
      tag: '日常英语 / 一对一',
      text: '适合想快速开口、改善听说能力、建立英语表达信心的学生。',
    },
    {
      title: '雅思备考型',
      tag: 'IELTS / 考试冲刺',
      text: '适合有明确分数目标，需要课程管理、模考和弱项训练的学生。',
    },
    {
      title: '亲子游学型',
      tag: 'Family / Junior',
      text: '适合家长陪读、寒暑假短期体验、希望孩子在英语环境中适应学习的人群。',
    },
    {
      title: '度假舒适型',
      tag: 'Resort / Balance',
      text: '适合希望住宿环境更舒适、学习节奏不那么高压、兼顾体验感的学生。',
    },
  ];

  readonly compareRows = [
    { label: '学习氛围', cebu: '选择多，学习与生活更平衡', baguio: '更偏考试和斯巴达管理' },
    { label: '城市环境', cebu: '海岛城市，生活便利，活动丰富', baguio: '山城气候凉爽，娱乐较少' },
    { label: '适合人群', cebu: '初次游学、亲子、口语、短期体验', baguio: '考试冲刺、自律较弱、想高强度学习' },
    { label: '选校重点', cebu: '住宿、课程比例、校区环境、交通', baguio: '管理强度、模考体系、学习时长' },
  ];

  readonly sources: SourceLink[] = [
    { label: '玩美游学宿务学校页', url: 'https://www.studytoura.com/cebu-schools/' },
    { label: 'iOutback 澳贝客', url: 'https://www.ioutback.com/' },
    { label: '非凡游学', url: 'https://feifanstudy.com/' },
    { label: '南崎游学', url: 'https://www.nanqi.org/' },
    { label: '格仲游学', url: 'https://gezhong.com.tw/' },
    { label: '大洋游学', url: 'http://www.dayang101.com/' },
  ];
}

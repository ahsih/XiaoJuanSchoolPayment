import { Component } from '@angular/core';

interface CityStudyLink {
  name: string;
  englishName: string;
  route: string;
  summary: string;
  bestFor: string;
  icon: string;
  group: 'popular' | 'quiet' | 'comingSoon';
}

interface CityStudyGroup {
  id: CityStudyLink['group'];
  title: string;
  description: string;
}

@Component({
  selector: 'app-city-schools',
  standalone: false,
  templateUrl: './city-schools.component.html',
  styleUrl: './city-schools.component.css',
})
export class CitySchoolsComponent {
  readonly groups: CityStudyGroup[] = [
    {
      id: 'popular',
      title: '热门城市',
      description: '适合大多数学生先了解，学校选择、课程类型和生活配套更成熟。',
    },
    {
      id: 'quiet',
      title: '小众与低成本城市',
      description: '适合想控制预算、减少干扰，或计划长期基础提升的学生。',
    },
    {
      id: 'comingSoon',
      title: '特色城市',
      description: '适合有更明确学习偏好，例如想减少干扰、寻找外教口语或体验不同城市氛围。',
    },
  ];

  readonly cities: CityStudyLink[] = [
    {
      name: '宿务',
      englishName: 'Cebu',
      route: '/philippines-study/cebu',
      summary: '学校选择多，课程、海岛生活和亲子项目都比较成熟。',
      bestFor: '首次游学 / 亲子 / 综合英语',
      icon: 'beach_access',
      group: 'popular',
    },
    {
      name: '碧瑶',
      englishName: 'Baguio',
      route: '/philippines-study/baguio',
      summary: '学习氛围强，气候凉爽，适合想专心备考和高强度提升的学生。',
      bestFor: '雅思备考 / 斯巴达 / 长期强化',
      icon: 'landscape',
      group: 'popular',
    },
    {
      name: '克拉克',
      englishName: 'Clark',
      route: '/philippines-study/clark',
      summary: '国际社区感更强，外教资源、居住环境和家庭友好度更突出。',
      bestFor: '外教口语 / 亲子 / 青少年营队',
      icon: 'public',
      group: 'popular',
    },
    {
      name: '马尼拉',
      englishName: 'Manila',
      route: '/philippines-study/manila',
      summary: '首都圈资源集中，航班便利，适合成人、商务和短期组合行程。',
      bestFor: '商务英语 / 短期体验 / 转机组合',
      icon: 'flight_takeoff',
      group: 'popular',
    },
    {
      name: '长滩岛',
      englishName: 'Boracay',
      route: '/philippines-study/boracay',
      summary: '度假氛围强，适合亲子、假期营队和短期英语体验。',
      bestFor: '度假游学 / 亲子 / 短期体验',
      icon: 'sailing',
      group: 'popular',
    },
    {
      name: '巴科洛德',
      englishName: 'Bacolod',
      route: '/philippines-study/bacolod',
      summary: '生活成本友好、节奏安静，适合长期ESL和基础口语提升。',
      bestFor: '低成本 / 安静城市 / 长期基础',
      icon: 'savings',
      group: 'quiet',
    },
    {
      name: '怡朗',
      englishName: 'Iloilo',
      route: '/philippines-study/iloilo',
      summary: '小众安静、成本友好，适合长期ESL和低压力学习。',
      bestFor: '小众 / 安静 / 成本友好',
      icon: 'spa',
      group: 'quiet',
    },
    {
      name: '达沃',
      englishName: 'Davao',
      route: '/philippines-study/davao',
      summary: '华人比例和娱乐干扰较少，适合想在生活中更多使用英语、专心学习的学生。',
      bestFor: '少干扰 / 华人较少 / 半斯巴达',
      icon: 'visibility',
      group: 'comingSoon',
    },
    {
      name: '苏比克',
      englishName: 'Subic',
      route: '/philippines-study/subic',
      summary: '带美式港湾氛围，治安和环境管理较好，适合外教口语和舒适型学习。',
      bestFor: '外教口语 / 美式氛围 / 安全环境',
      icon: 'anchor',
      group: 'comingSoon',
    },
  ];

  readonly stats = [
    { value: '9', label: '城市入口' },
    { value: '9', label: '已定位' },
    { value: '0', label: '待补充' },
  ];

  citiesByGroup(group: CityStudyLink['group']): CityStudyLink[] {
    return this.cities.filter((city) => city.group === group);
  }
}

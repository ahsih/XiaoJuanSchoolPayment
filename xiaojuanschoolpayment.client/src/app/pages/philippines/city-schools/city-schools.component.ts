import { Component } from '@angular/core';

interface CityStudyLink {
  name: string;
  englishName: string;
  route: string;
  summary: string;
  bestFor: string;
  icon: string;
}

@Component({
  selector: 'app-city-schools',
  standalone: false,
  templateUrl: './city-schools.component.html',
  styleUrl: './city-schools.component.css',
})
export class CitySchoolsComponent {
  readonly cities: CityStudyLink[] = [
    {
      name: '宿务',
      englishName: 'Cebu',
      route: '/philippines-study/cebu',
      summary: '学校选择多，课程、海岛生活和亲子项目都比较成熟。',
      bestFor: '首次游学 / 亲子 / 综合英语',
      icon: 'beach_access',
    },
    {
      name: '碧瑶',
      englishName: 'Baguio',
      route: '/philippines-study/baguio',
      summary: '学习氛围强，气候凉爽，适合想专心备考和高强度提升的学生。',
      bestFor: '雅思备考 / 斯巴达 / 长期强化',
      icon: 'landscape',
    },
    {
      name: '克拉克',
      englishName: 'Clark',
      route: '/philippines-study/clark',
      summary: '国际社区感更强，外教资源、居住环境和家庭友好度更突出。',
      bestFor: '外教口语 / 亲子 / 青少年营队',
      icon: 'public',
    },
    {
      name: '马尼拉',
      englishName: 'Manila',
      route: '/philippines-study/manila',
      summary: '首都圈资源集中，航班便利，适合成人、商务和短期组合行程。',
      bestFor: '商务英语 / 短期体验 / 转机组合',
      icon: 'flight_takeoff',
    },
  ];
}

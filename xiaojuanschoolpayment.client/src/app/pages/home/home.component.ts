import { Component } from '@angular/core';

interface ServiceCard {
  icon: string;
  title: string;
  description: string;
  tone: 'green' | 'teal' | 'blue';
}

interface DestinationCard {
  code: string;
  title: string;
  description: string;
  imageClass: string;
}

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  readonly services: ServiceCard[] = [
    {
      icon: 'school',
      title: '爱尔兰留学申请',
      description: '本科、硕士、半工半读申请院校与专业选择、文书指导签证办理全程支持',
      tone: 'green',
    },
    {
      icon: 'beach_access',
      title: '菲律宾英语游学',
      description: '精选语言学校、灵活课程组合 ESL / 雅思 / 商务英语课程沉浸式学习，快速提升英语',
      tone: 'teal',
    },
    {
      icon: 'desktop_windows',
      title: '线上英语体验课',
      description: '外教1对1互动课程灵活预约，个性化学习方案在家也能高效提升英语',
      tone: 'blue',
    },
    {
      icon: 'public',
      title: '海外游学项目',
      description: '多国家游学项目丰富主题课程与文化体验开阔视野，提升综合能力',
      tone: 'green',
    },
  ];

  readonly destinations: DestinationCard[] = [
    {
      code: 'UK',
      title: '英国',
      description: '历史名校 · 纯正英音 · 文化体验',
      imageClass: 'destination-uk',
    },
    {
      code: 'IE',
      title: '爱尔兰',
      description: '安全友好 · 高性价比 · 工签机会',
      imageClass: 'destination-ireland',
    },
    {
      code: 'SG',
      title: '新加坡',
      description: '双语环境 · 安全高效 · 交通便利',
      imageClass: 'destination-singapore',
    },
    {
      code: 'MY',
      title: '马来西亚',
      description: '高性价比 · 多元文化 · 热带风情',
      imageClass: 'destination-malaysia',
    },
    {
      code: 'CA',
      title: '加拿大',
      description: '优质教育 · 自然环境 · 文化多元',
      imageClass: 'destination-canada',
    },
    {
      code: 'AU',
      title: '澳大利亚',
      description: '阳光海岸 · 多元文化 · 实用英语',
      imageClass: 'destination-australia',
    },
  ];
}

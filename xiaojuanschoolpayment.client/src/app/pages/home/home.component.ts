import { Component } from '@angular/core';

interface ServiceCard {
  icon: string;
  title: string;
  description: string;
  tone: 'green' | 'teal' | 'blue';
}

interface PhilippinesSchoolCard {
  name: string;
  city: string;
  tag: string;
  description: string;
  image: string;
  route: string;
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

  readonly philippinesSchools: PhilippinesSchoolCard[] = [
    {
      name: 'PINES International Academy',
      city: 'Baguio',
      tag: 'Sparta / IELTS / Speaking',
      description: '碧瑶老牌高强度学校，适合目标明确、想被学习节奏推动的学生。',
      image: '/assets/philippines/home-school-pines.jpg',
      route: '/philippines-study/baguio/pines-international-academy',
    },
    {
      name: 'BECI International Language Academy',
      city: 'Baguio',
      tag: 'EOP / Sparta / City',
      description: '多校区设计，适合按口说反馈、强度和生活节奏细分选择。',
      image: '/assets/philippines/home-school-beci.jpg',
      route: '/philippines-study/baguio/beci-international-language-academy',
    },
    {
      name: 'Baguio JIC Academy',
      city: 'Baguio',
      tag: 'IELTS / Speaking / Working Holiday',
      description: 'Challenger 与 Premium 双校区，适合想在备考与生活舒适度之间取舍的人。',
      image: '/assets/philippines/home-school-jic.jpg',
      route: '/philippines-study/baguio/baguio-jic-academy',
    },
    {
      name: 'MONOL',
      city: 'Baguio',
      tag: 'ESL / IELTS / Comfortable Stay',
      description: '学习与住宿舒适度平衡，适合想稳定提升又重视生活品质的学生。',
      image: '/assets/philippines/home-school-monol.png',
      route: '/philippines-study/baguio/monol',
    },
    {
      name: 'WALES Academy',
      city: 'Baguio',
      tag: 'ESL / IELTS / Business',
      description: '小规模市中心学校，适合喜欢安静管理、生活机能方便的成人学生。',
      image: '/assets/philippines/home-school-wales.jpg',
      route: '/philippines-study/baguio/wales-academy',
    },
    {
      name: 'EV Academy',
      city: 'Cebu',
      tag: 'Semi-Sparta / IELTS / Family',
      description: '宿务现代校园，适合兼顾学习强度、校园设施和海岛城市体验的人。',
      image: '/assets/philippines/home-school-ev.jpg',
      route: '/philippines-study/cebu/ev-academy',
    },
  ];
}

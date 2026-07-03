import { Component } from '@angular/core';

interface ServiceCard {
  icon: string;
  title: string;
  description: string;
  route: string;
  tone: 'orange' | 'purple' | 'gold' | 'green';
}

interface SchoolCard {
  name: string;
  city: string;
  tag: string;
  description: string;
  image: string;
  route: string;
}

interface ProcessStep {
  marker: string;
  title: string;
  description: string;
}

interface Statistic {
  value: string;
  label: string;
}

interface ProjectCard {
  image: string;
  title: string;
  description: string;
  route: string;
}

interface JourneyStep {
  icon: string;
  title: string;
  description: string;
}

interface Partner {
  initials: string;
  name: string;
  color: string;
}

interface FooterColumn {
  title: string;
  links: string[];
}

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.host.css',
})
export class HomeComponent {
  readonly services: ServiceCard[] = [
    {
      icon: 'school',
      title: '爱尔兰留学申请',
      description: '本科、硕士、半工半读申请规划与院校匹配，文书指导到签证跟进。',
      route: '/ireland-study/undergraduate-application',
      tone: 'orange',
    },
    {
      icon: 'beach_access',
      title: '菲律宾英语游学',
      description: '精选语言学校、沉浸式课程与住宿方案，按目标和预算定制路线。',
      route: '/philippines-study/schools/by-city',
      tone: 'purple',
    },
    {
      icon: 'desktop_windows',
      title: '线上英语体验课',
      description: '外教一对一与口语写作课程，灵活预约，高效补齐英语短板。',
      route: '/online-english/free-english-test',
      tone: 'gold',
    },
    {
      icon: 'public',
      title: '海外游学项目',
      description: '多国文化体验与主题课程，帮助学生拓展视野与综合能力。',
      route: '/overseas-study-tour/ireland',
      tone: 'green',
    },
  ];

  readonly recommendedSchools: SchoolCard[] = [
    {
      name: 'CIA Cebu',
      city: '菲律宾 · 宿务',
      tag: 'IELTS / TOEIC / Family',
      description: 'Mactan 度假型新校区，适合雅思、亲子和第一次菲律宾游学。',
      image: '/assets/cia/campus-building.png',
      route: '/philippines-study/cebu/cia-cebu-international-academy',
    },
    {
      name: 'EV Academy',
      city: '菲律宾 · 宿务',
      tag: 'Sparta / IELTS / Speaking',
      description: '宿务市区现代校园，斯巴达和半斯巴达强度可选。',
      image: '/assets/ev/campus-exterior.jpg',
      route: '/philippines-study/cebu/ev-academy',
    },
    {
      name: 'CPI Cebu Pelis Institute',
      city: '菲律宾 · 宿务',
      tag: 'Resort / ESL / Family',
      description: 'Nivel Hills 度假村式校园，适合重视住宿、设施和舒适度的学生。',
      image: '/assets/cpi/campus-pool.jpg',
      route: '/philippines-study/cebu/cpi-cebu-pelis-institute',
    },
  ];

  readonly whyPoints = [
    '深耕留学与语言培训领域，经验扎实',
    '个性化定制方案，兼顾预算和目标',
    '专业团队全程陪伴，服务透明安心',
    '真实案例与院校资源，申请路径清晰',
  ];

  readonly processSteps: ProcessStep[] = [
    {
      marker: '01',
      title: '免费评估',
      description: '了解英语水平与留学需求',
    },
    {
      marker: '02',
      title: '定制方案',
      description: '匹配学校与课程规划',
    },
    {
      marker: '03',
      title: '申请指导',
      description: '材料准备与申请递交',
    },
    {
      marker: '04',
      title: '进度跟进',
      description: '录取、签证与住宿协调',
    },
    {
      marker: '30+',
      title: '后续确认',
      description: '行前提醒与入学支持',
    },
  ];

  readonly stats: Statistic[] = [
    { value: '12+', label: '行业经验' },
    { value: '5000+', label: '成功案例' },
    { value: '98%', label: '申请成功率' },
    { value: '30+', label: '合作院校' },
  ];

  readonly projects: ProjectCard[] = [
    {
      image: '/assets/study-hero-collage.png',
      title: '爱尔兰留学申请',
      description: '本科、硕士、预科和半工半读申请，覆盖选校、材料、签证与行前准备。',
      route: '/ireland-study/undergraduate-application',
    },
    {
      image: '/assets/philippines/baguio-study-hero.jpg',
      title: '菲律宾英语游学',
      description: 'ESL、雅思、商务英语等课程规划，适合短期突破与长期沉浸学习。',
      route: '/philippines-study/schools/by-city',
    },
    {
      image: '/assets/philinter/group-classroom.png',
      title: '线上英语课程',
      description: '外教一对一和专项口语写作训练，在家也能稳定提升英语能力。',
      route: '/online-english/courses',
    },
    {
      image: '/assets/philippines/manila-study-hero.jpg',
      title: '海外游学项目',
      description: '多国文化体验与主题课程，帮助学生提前适应海外学习环境。',
      route: '/overseas-study-tour/ireland',
    },
  ];

  readonly journeySteps: JourneyStep[] = [
    {
      icon: 'support_agent',
      title: '咨询评估',
      description: '专业顾问一对一沟通，评估背景与需求',
    },
    {
      icon: 'assignment',
      title: '定制规划',
      description: '量身定制留学方案，确定目标院校与专业',
    },
    {
      icon: 'menu_book',
      title: '背景提升',
      description: '提升语言成绩与背景，增强竞争力',
    },
    {
      icon: 'description',
      title: '申请递交',
      description: '准备申请材料，递交院校并跟进进度',
    },
    {
      icon: 'card_travel',
      title: '录取入学',
      description: '获得录取通知，办理签证与行前辅导',
    },
  ];

  readonly partners: Partner[] = [
    { initials: 'TCD', name: '圣三一大学', color: '#2f80c1' },
    { initials: 'ED', name: '爱丁堡大学', color: '#9c1e2d' },
    { initials: 'UCD', name: '都柏林大学', color: '#23834d' },
    { initials: 'UCC', name: '科克大学', color: '#c67a19' },
    { initials: 'GU', name: '高威大学', color: '#a32664' },
    { initials: 'DCU', name: '都柏林城市大学', color: '#0b79bd' },
  ];

  readonly footerColumns: FooterColumn[] = [
    {
      title: '爱尔兰留学',
      links: ['本科申请', '硕士申请', '半工半读', '院校推荐'],
    },
    {
      title: '菲律宾游学',
      links: ['语言学校', '课程介绍', '游学攻略', '学员分享'],
    },
    {
      title: '线上英语',
      links: ['课程介绍', '学习模式', '师资介绍', '常见问题'],
    },
    {
      title: '关于我们',
      links: ['公司简介', '服务流程', '学员案例', '联系我们'],
    },
  ];
}

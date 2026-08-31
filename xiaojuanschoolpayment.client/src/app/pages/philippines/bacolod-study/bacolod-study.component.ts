import { Component } from '@angular/core';
import {
  createCityStudyPage,
  PhilippinesCityStudyLayoutComponent,
} from '../../../components/philippines-city-study-layout/philippines-city-study-layout.component';

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

interface SchoolCard {
  image: string;
  title: string;
  tag: string;
  text: string;
  route: string;
  highlights: string[];
}

@Component({
  selector: 'app-bacolod-study',
  standalone: true,
  imports: [PhilippinesCityStudyLayoutComponent],
  templateUrl: './bacolod-study.component.html',
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

  readonly featuredSchools: SchoolCard[] = [
    {
      image: 'https://www.cebu-55.com/common/img/detail/eroom/04.jpg',
      title: '菲律宾巴科洛德E-Room Language Center',
      tag: 'Classic / Semi-Sparta / ESL / IELTS / TOEIC',
      text: '适合想在Bacolod控制预算、选择校内住宿生活一体，并比较ESL、考试、Guardian和Junior路线的学生。',
      route: '/philippines-study/bacolod/e-room-language-center',
      highlights: ['KRW课程住宿费', 'PHP当地费用', '校内住宿三餐', '半斯巴达可选'],
    },
  ];

  readonly compareRows = [
    { label: '城市定位', bacolod: '低成本、安静城市、慢节奏学习', cebu: '学校多、海岛体验丰富', baguio: '学习氛围强、考试导向' },
    { label: '学习重点', bacolod: '基础口语、长期ESL、预算控制', cebu: '口语、亲子、短期体验、综合选择', baguio: '雅思、多益、斯巴达冲刺' },
    { label: '适合人群', bacolod: '预算敏感、想安静学习、长期停留', cebu: '第一次游学、想平衡学习和生活', baguio: '自律较弱、想专心备考' },
    { label: '选校重点', bacolod: '费用结构、课程时数、住宿和生活便利', cebu: '课程比例、校区位置、住宿和活动', baguio: '管理制度、模考体系、学习强度' },
  ];

  readonly faqs = [
    { question: '巴科洛德适合第一次菲律宾游学吗？', answer: '适合重视预算、安静环境和规律生活的学生。学校数量较少，选校重点应放在课程强度、住宿和生活适应，而不是追求热门城市体验。' },
    { question: '巴科洛德适合长期学习吗？', answer: '生活节奏和总体成本相对友好，适合用较长周期打基础、练口语；具体仍要按房型、课程时数和当地费用核算。' },
    { question: '这里适合考试备考吗？', answer: '有 IELTS、TOEIC 等课程，但选择没有宿务或碧瑶多；有明确高分目标的学生应先核对师资、模考和开班情况。' },
    { question: '报名前应该确认什么？', answer: '确认入学日期、课程课表、管理模式、房型空位、餐食、接送、当地费用和最新优惠。' },
  ];

  readonly page = createCityStudyPage({
    cityName: '巴科洛德',
    englishName: 'Bacolod',
    heroKicker: '安静、友好、预算可控的学习城市',
    heroKickerIcon: 'savings',
    heroSubtitle: '成本友好 × 安静学习 × 长期提升',
    heroDescription: '巴科洛德生活节奏平稳、日常成本相对容易控制，适合想减少干扰、规律上课和用较长周期打好英语基础的学生。学校选择不算多，但更适合把预算和时间集中在课程本身。',
    heroImage: this.featuredSchools[0].image,
    heroImageAlt: '菲律宾巴科洛德语言学校与城市环境',
    heroStudyImage: '/assets/philippines/pines-one-to-one-classroom.jpg',
    heroLessonImage: '/assets/philippines/monol-classroom-group.jpg',
    heroVisualLabel: '巴科洛德城市、语言学校与学习生活场景',
    benefitChips: [
      { icon: 'savings', label: '总体成本友好' },
      { icon: 'spa', label: '城市安静少干扰' },
      { icon: 'record_voice_over', label: '适合基础口语' },
      { icon: 'schedule', label: '适合长期学习' },
    ],
    stats: [
      { value: '小众城市', label: '学习环境更安静', icon: 'workspace_premium' },
      { value: 'ESL为主', label: '基础与口语提升' },
      { value: '预算友好', label: '适合长期规划' },
      { value: '生活平稳', label: '城市压力较低' },
    ],
    schoolTypes: this.schoolTypes.map((type, index) => ({ ...type, examples: 'E-Room', icon: ['savings', 'spa', 'schedule', 'location_city'][index] })),
    schoolProfiles: this.featuredSchools.map((school) => ({
      name: school.title,
      shortName: 'E-Room Language Center',
      image: school.image,
      location: 'Bacolod City',
      style: school.tag,
      route: school.route,
      courses: ['ESL', 'IELTS', 'TOEIC', 'Guardian', 'Junior'],
      bestFor: school.text,
      categories: this.schoolTypes.map((type) => type.title),
    })),
    highlights: this.highlights,
    selectionImages: [
      '/assets/philippines/monol-classroom.jpg',
      '/assets/philippines/wales-school-building.jpg',
      '/assets/philippines/pines-library.jpg',
      '/assets/philippines/cebu-city-view.jpg',
    ],
    lifestyleImages: [
      '/assets/philippines/monol-food-service.jpg',
      '/assets/philippines/monol-rooftop-lounge.jpg',
      '/assets/philippines/pines-one-to-one-classroom.jpg',
      '/assets/philippines/cebu-city-view.jpg',
    ],
    faqs: this.faqs,
    featuredTitle: '巴科洛德语言学校推荐',
    featuredSubtitle: '学校数量不多，更要把课程、住宿与总预算一次比较清楚',
    lifestyleTitle: '在巴科洛德，用更稳定的节奏长期学习',
    lifestyleSubtitle: '安静、成本友好与生活压力较低，是小众城市的真实优势',
  });
}

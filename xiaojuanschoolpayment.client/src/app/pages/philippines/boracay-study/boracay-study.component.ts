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

interface FeaturedSchool {
  icon: string;
  image: string;
  title: string;
  tag: string;
  text: string;
  route: string;
}

@Component({
  selector: 'app-boracay-study',
  standalone: true,
  imports: [PhilippinesCityStudyLayoutComponent],
  templateUrl: './boracay-study.component.html',
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

  readonly featuredSchools: FeaturedSchool[] = [
    {
      icon: 'pool',
      image: 'https://www.iss-ryugakulife.com/wp-content/uploads/school/Boracay-4.jpg',
      title: 'Boracay Coco English Academy',
      tag: 'Resort-style / Family / ESL',
      text: '适合想在长滩岛度假型校园中学习ESL、商务英语、IELTS、亲子和低龄儿童课程，并清楚比较2026课程与食宿费用的学生。',
      route: '/philippines-study/boracay/boracay-coco-english-academy',
    },
    {
      icon: 'record_voice_over',
      image: 'https://www.esl.co.uk/sites/default/files/school/hero/esl-language-courses-abroad-english-philippines-boracay-paradise-english.jpg',
      title: 'Paradise English Boracay Language Institute',
      tag: 'Canadian-owned / Multi-national ESL',
      text: '适合想在长滩岛多国籍环境中学习Budget、General、Intensive、True Beginner或IELTS/TOEIC/Business课程的学生。',
      route:
        '/philippines-study/boracay/paradise-english-boracay-language-institute',
    },
  ];

  readonly compareRows = [
    { label: '城市定位', boracay: '海岛度假、亲子、短期体验', cebu: '学校多、海岛体验丰富', baguio: '学习氛围强、考试导向' },
    { label: '学习重点', boracay: '轻松口语、活动体验、假期营队', cebu: '口语、亲子、短期体验、综合选择', baguio: '雅思、多益、斯巴达冲刺' },
    { label: '适合人群', boracay: '家庭用户、低龄学生、假期短期', cebu: '第一次游学、想平衡学习和生活', baguio: '自律较弱、想专心备考' },
    { label: '选校重点', boracay: '课程轻重、住宿位置、活动安排和接送', cebu: '课程比例、校区位置、住宿和活动', baguio: '管理制度、模考体系、学习强度' },
  ];

  readonly faqs = [
    { question: '长滩岛适合第一次菲律宾游学吗？', answer: '适合想把短期英语体验、海岛生活和旅行结合的学生；如果目标是高强度备考，碧瑶或宿务的学校选择会更多。' },
    { question: '长滩岛更适合亲子家庭吗？', answer: '亲子和青少年是长滩岛的优势方向，但仍需确认最低年龄、家长课程、家庭房、接送和活动期间的监护安排。' },
    { question: '学习会不会被度假活动影响？', answer: '关键在课程强度与个人目标。短期体验可安排半天课程；想稳定提升，则要预留固定上课、自习和休息时间。' },
    { question: '报名前应该确认哪些费用？', answer: '确认课程、住宿、餐食、接送、教材、当地费用和海岛活动是否包含，旺季房型与附加费也要提前核对。' },
  ];

  readonly page = createCityStudyPage({
    cityName: '长滩岛',
    englishName: 'Boracay',
    heroKicker: '海岛度假与短期英语体验',
    heroKickerIcon: 'beach_access',
    heroSubtitle: '白沙海岛 × 亲子度假 × 轻松开口',
    heroDescription: '长滩岛适合把英语学习、亲子陪伴与海岛旅行放在同一段假期里。这里不是高压备考型城市，更适合短期体验、青少年营队和希望在轻松环境中增加开口机会的学生。',
    heroImage: this.heroImage,
    heroImageAlt: '菲律宾长滩岛白沙滩与海岛环境',
    heroStudyImage: 'https://www.iss-ryugakulife.com/wp-content/uploads/school/Boracay-4.jpg',
    heroLessonImage: 'https://www.esl.co.uk/sites/default/files/school/hero/esl-language-courses-abroad-english-philippines-boracay-paradise-english.jpg',
    heroVisualLabel: '长滩岛白沙滩、语言学校与英语体验场景',
    benefitChips: [
      { icon: 'beach_access', label: '白沙海岛环境' },
      { icon: 'family_restroom', label: '亲子体验友好' },
      { icon: 'schedule', label: '适合短期安排' },
      { icon: 'sailing', label: '活动体验丰富' },
    ],
    stats: [
      { value: '2所', label: '重点学校资料', icon: 'workspace_premium' },
      { value: '短期友好', label: '假期英语体验' },
      { value: '亲子课程', label: '家庭与青少年方向' },
      { value: '海岛生活', label: '学习与旅行结合' },
    ],
    schoolTypes: this.schoolTypes.map((type, index) => ({
      ...type,
      examples: index < 3 ? 'Boracay Coco、Paradise English' : 'Paradise English、Boracay Coco',
      icon: ['family_restroom', 'schedule', 'groups', 'record_voice_over'][index],
    })),
    schoolProfiles: this.featuredSchools.map((school) => ({
      name: school.title,
      shortName: school.title === 'Boracay Coco English Academy' ? 'Boracay Coco' : 'Paradise English',
      image: school.image,
      location: 'Boracay Island',
      style: school.tag,
      route: school.route,
      courses: school.title.includes('Coco') ? ['ESL', 'Family', 'Junior', 'IELTS', 'Business'] : ['General ESL', 'Intensive', 'IELTS / TOEIC', 'Business'],
      bestFor: school.text,
      categories: this.schoolTypes.map((type) => type.title),
    })),
    highlights: this.highlights,
    selectionImages: [
      'https://www.iss-ryugakulife.com/wp-content/uploads/school/Boracay-4.jpg',
      '/assets/philippines/cebu-weekend-ocean.png',
      '/assets/philippines/we-family-program.jpg',
      '/assets/philippines/ev-la-mer-campus.jpg',
    ],
    lifestyleImages: [
      this.heroImage,
      '/assets/philippines/we-family-program.jpg',
      '/assets/philippines/cebu-lifestyle-dining.jpg',
      '/assets/philippines/cebu-weekend-ocean.png',
    ],
    faqs: this.faqs,
    featuredTitle: '长滩岛英语学校推荐',
    featuredSubtitle: '重点比较课程轻重、亲子安排、住宿位置和海岛活动',
    lifestyleTitle: '在长滩岛，让英语成为假期的一部分',
    lifestyleSubtitle: '轻松开口、亲子陪伴与海岛体验，是这里最鲜明的学习方式',
  });
}

import { Component } from '@angular/core';
import {
  createCityStudyPage,
  PhilippinesCityStudyLayoutComponent,
} from '../../../components/philippines-city-study-layout/philippines-city-study-layout.component';

interface StatItem {
  value: string;
  label: string;
}

interface HighlightCard {
  icon: string;
  title: string;
  text: string;
}

interface SchoolType {
  title: string;
  tag: string;
  text: string;
  examples: string;
}

interface SchoolProfile {
  name: string;
  image: string;
  location: string;
  style: string;
  route?: string;
  startingPrice?: string;
  courses: string[];
  accommodation: string;
  facilities: string;
  bestFor: string;
  consultantNote: string;
}

interface DecisionPoint {
  icon: string;
  label: string;
  text: string;
}

interface CostNote {
  title: string;
  text: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

interface SourceLink {
  label: string;
  url: string;
}

@Component({
  selector: 'app-manila-study',
  standalone: true,
  imports: [PhilippinesCityStudyLayoutComponent],
  templateUrl: './manila-study.component.html',
})
export class ManilaStudyComponent {
  readonly stats: StatItem[] = [
    { value: '首都圈资源', label: '交通、商务与生活便利' },
    { value: 'Adult / Business / Academic', label: '核心课程方向' },
    { value: '短期 / 衔接 / 组合', label: '主流学习节奏' },
  ];

  readonly highlights: HighlightCard[] = [
    {
      icon: 'flight_takeoff',
      title: '交通和转机最方便',
      text: '马尼拉航班选择多，适合短期停留、商务行程、先适应菲律宾城市环境，或再转往宿务、碧瑶、Clark 学习。',
    },
    {
      icon: 'business_center',
      title: '商务英语场景更自然',
      text: '首都圈聚集企业、酒店、大学和国际机构，更适合职场沟通、会议表达、简历面试和跨文化沟通训练。',
    },
    {
      icon: 'school',
      title: '适合学术和城市短课',
      text: '马尼拉更常见的是学院、培训中心、企业课程和短期英文课，不一定是宿舍制 ESL 学校。',
    },
    {
      icon: 'route',
      title: '适合作为组合站点',
      text: '如果学生还不确定城市，可把马尼拉作为第一站，再根据学习目标转入宿务综合型、碧瑶备考型或 Clark 亲子型。',
    },
  ];

  readonly schoolTypes: SchoolType[] = [
    {
      title: '成人口语型',
      tag: 'Adult / Speaking',
      text: '适合提升日常沟通、社交表达、发音、演讲和城市生活英语的成人学生。',
      examples: '菲律宾马尼拉American-English-Skill语言学校、菲律宾马尼拉Berlitz语言学校、菲律宾马尼拉Enderun语言学校',
    },
    {
      title: '商务职场型',
      tag: 'Business / Corporate',
      text: '适合会议表达、商务写作、客户沟通、领导力表达、跨文化沟通和企业内训需求。',
      examples: '菲律宾马尼拉Enderun语言学校、菲律宾马尼拉American-English-Skill语言学校、菲律宾马尼拉Berlitz语言学校',
    },
    {
      title: '学术英语与升学衔接',
      tag: 'Academic / Pathway',
      text: '适合想在首都圈体验大学或学院环境，并考虑商务、酒店、管理等后续学习的人群。',
      examples: '菲律宾马尼拉Enderun语言学校、菲律宾马尼拉Business College学校',
    },
    {
      title: '短期转机组合型',
      tag: 'Short Stay / Combo',
      text: '适合只有 1-2 周、需要面试培训、企业拜访、转机停留，或想先了解菲律宾再转城市的学生。',
      examples: '马尼拉 + 宿务 / 碧瑶 / Clark 组合',
    },
  ];

  readonly schoolProfiles: SchoolProfile[] = [
    {
      name: '菲律宾马尼拉Enderun语言学校',
      image: '/assets/philippines/enderun-extension-socials.jpg',
      location: 'Taguig / Enderun Colleges 体系',
      style: '学术英语、商务英语与短课型',
      route: '/philippines-study/manila/enderun-extension',
      startingPrice: 'PHP 40,000 / 月起参考',
      courses: [
        'General English',
        'Business English',
        'Academic English',
        'IELTS Test Preparation',
        'One-on-One Top-Up',
        'Corporate / Short Courses',
      ],
      accommodation:
        '非寄宿制城市课程，酒店、公寓、亲友住宿或公司住宿需自行安排，并提前核对通勤时间。',
      facilities:
        '官网BLP说明包含社交团体课、每周一对一Validation、线上coursework；较长周期可核对额外一对一、gym与合作餐厅/酒店折扣。',
      bestFor:
        '成人、职场人士、学术英语衔接、短期课程，以及希望结合城市资源的人群。',
      consultantNote:
        '官方公开General/Business月费为PHP40,000/30,000/25,000/20,000档，Book Fee约PHP6,000-8,700；SSP由学校Visa Team按护照和签证状态确认。',
    },
    {
      name: '菲律宾马尼拉American-English-Skill语言学校',
      image: '/assets/philippines/american-english-training-room.jpg',
      location: 'Makati / Metro Manila',
      style: '成人口语与企业沟通训练',
      route: '/philippines-study/manila/american-english-skills-development-center',
      startingPrice: 'PHP 14,800 / 40小时起参考',
      courses: [
        'Online Business Conversational English',
        'Basic Conversational English',
        'Business Conversational English',
        'One-on-One Training',
        'Business Writing',
        'Corporate Training',
      ],
      accommodation:
        '非寄宿制城市培训中心；酒店、公寓、亲友住宿、餐食、通勤、签证停留和保险需学生自行安排。',
      facilities:
        '官网强调线上与面对面课程、团体课、一对一、企业培训、TNA需求分析、沟通表达和真实场景练习；上课点位于Makati。',
      bestFor:
        '成人、职场人士、商务英语、短期马尼拉停留、企业培训、面试准备、商务写作、客服沟通和公开表达。',
      consultantNote:
        '官网公开Online Business Conversational English为PHP14,800/40小时；团体课常见区间PHP19,700-48,000，一对一公开区间PHP12,800-98,800。适合已能自行安排马尼拉住宿和通勤的人。',
    },
    {
      name: '菲律宾马尼拉Berlitz语言学校',
      image: '/assets/philippines/berlitz-hero.webp',
      location: 'Makati / Metro Manila',
      style: '国际语言培训与企业服务型',
      route: '/philippines-study/manila/berlitz-philippines',
      startingPrice: 'PHP 3,200 Starter Course公告价；常规课需核价',
      courses: [
        'Private Language Classes',
        'Group Language Classes',
        'Self-paced Berlitz Connect',
        'Kids & Teens',
        'Corporate Language Training',
        'Business Communication',
        'Language Testing / TELC',
      ],
      accommodation: '非住校制语言中心；酒店、公寓、亲友住宿、餐食、通勤、签证停留和保险需学生自行安排。',
      facilities:
        '官网列出成人私教、小组课、自学平台、儿童青少年、企业语言培训、商务沟通、语言测评、TELC和Makati学习中心。',
      bestFor: '商务人士、企业培训、家庭城市课程、需要国际品牌、多语言、测评或TELC服务的人群。',
      consultantNote:
        '官网2025 Starter Course公告公开Php 3,200；常规私教、小组、企业、测评和TELC多为询价制。顾问会重点核对语言、级别、排课、Makati通勤和是否适合短期访客。',
    },
    {
      name: '菲律宾马尼拉Business College学校',
      image: '/assets/philippines/mbc-slider-1.jpg',
      location: 'Manila City',
      style: '商科院校与国际学生衔接候选',
      route: '/philippines-study/manila/manila-business-college',
      startingPrice: '常规学费需当期确认；奖学金金额仅作官方公开参考',
      courses: [
        'Senior High School ABM',
        'BSBA Marketing / Management',
        'B.S. Accountancy',
        'B.S. Hospitality Management',
        'B.S. Information Systems',
        'Night / Weekend / TESDA Courses',
      ],
      accommodation:
        '官网介绍提到 dormitories，但未公开房型、费用、餐食、押金、门禁和空位；需要按国际学生身份单独确认。',
      facilities:
        '官网说明学校获得 CHED、DepEd、TESDA 相关认可，并展示 classroom、library、mock hotel、laboratories、canteens 和 dormitories 等设施线索。',
      bestFor: '想了解马尼拉商科院校环境、后续学历路径或城市型学习资源的学生。',
      consultantNote:
        '适合作为“英语能力 + 商科/学院/城市体验”的候选，不应与菲律宾语言学校寄宿套餐直接类比；需先确认当期费用、国际学生材料、签证协助和住宿条件。',
    },
  ];

  readonly decisionPoints: DecisionPoint[] = [
    {
      icon: 'hotel',
      label: '先确认是否需要宿舍',
      text: '马尼拉很多是城市培训中心，不含校内住宿。需要宿舍和三餐管理的学生，应优先比较宿务、碧瑶或 Clark。',
    },
    {
      icon: 'location_on',
      label: '校区位置比城市名重要',
      text: 'Metro Manila 很大，Makati、Ortigas、Taguig、Quezon City 的通勤和安全感差异明显。',
    },
    {
      icon: 'work',
      label: '课程要贴近使用场景',
      text: '商务会议、面试、客户沟通、学术写作、日常口语和 IELTS 准备，对应的学校类型不同。',
    },
    {
      icon: 'flight',
      label: '行程衔接要算时间',
      text: '马尼拉适合转机和短住，但机场、酒店和上课点之间的交通时间要提前预估。',
    },
    {
      icon: 'receipt_long',
      label: '费用不能只看学费',
      text: '城市住宿、通勤、餐食、保险、教材、签证停留和个人生活费都要一起算。',
    },
  ];

  readonly costNotes: CostNote[] = [
    {
      title: '课程费',
      text: '马尼拉常见为短课、企业培训、一对一或团体课报价，未必按“学费 + 住宿 + 三餐”套餐销售。',
    },
    {
      title: '住宿与通勤',
      text: '多数城市课程需要自行安排酒店、公寓或亲友住宿。预算要加入交通时间和打车费用。',
    },
    {
      title: '优惠与活动',
      text: '培训中心和学院课程会有开课日期、企业价、短课优惠或名额限制，需以当期官网和回函为准。',
    },
  ];

  readonly compareRows = [
    {
      label: '城市定位',
      manila: '首都圈资源集中，交通便利，偏城市短课',
      cebu: '学校多、海岛体验丰富、综合选择多',
      baguio: '学习氛围强、凉爽安静、考试导向',
    },
    {
      label: '学习重点',
      manila: '成人口语、商务英语、学术衔接、短期体验',
      cebu: '口语、亲子、短期体验、综合课程',
      baguio: '雅思、多益、斯巴达冲刺、长期备考',
    },
    {
      label: '适合人群',
      manila: '职场人士、短期学生、转机组合、城市资源需求',
      cebu: '第一次游学、想平衡学习和生活',
      baguio: '自律较弱、想专心备考、能接受高强度',
    },
    {
      label: '选校重点',
      manila: '校区位置、住宿自理、通勤安全、课程实用度',
      cebu: '课程比例、校区位置、住宿和活动',
      baguio: '管理制度、模考体系、自习安排和学习强度',
    },
  ];

  readonly faqs: FaqItem[] = [
    {
      question: '马尼拉适合传统菲律宾游学吗？',
      answer:
        '如果你期待校内宿舍、三餐、门禁和全天课程，马尼拉不是最典型选择；宿务、碧瑶和 Clark 更容易找到这种模式。',
    },
    {
      question: '什么人适合选马尼拉？',
      answer:
        '适合成人、职场人士、短期停留者、需要商务英语或想把英语课和城市资源、转机、面试行程结合的人。',
    },
    {
      question: '马尼拉可以安排 IELTS 或商务英语吗？',
      answer:
        '可以，但要确认课程形式是培训中心短课、一对一、企业课还是学院课程。若目标是长期备考，可同时比较碧瑶。',
    },
    {
      question: '报名前最该确认什么？',
      answer:
        '确认上课点、课程日期、授课方式、住宿是否自理、通勤时间、签证停留和退款/改期规则。',
    },
  ];

  readonly page = createCityStudyPage({
    cityName: '马尼拉',
    englishName: 'Manila',
    heroKicker: '首都圈商务与短期英语学习',
    heroKickerIcon: 'business_center',
    heroSubtitle: '首都资源 × 商务英语 × 城市短课',
    heroDescription:
      '马尼拉适合成人、职场人士与短期停留者。这里航班和城市资源集中，商务沟通、学术衔接与企业课程更有优势；多数课程不是传统寄宿制，选校时要把上课地点、住宿和通勤一起安排。',
    heroImage: '/assets/philippines/manila-study-hero.jpg',
    heroImageAlt: '菲律宾马尼拉城市与英语学习环境',
    heroStudyImage: '/assets/philippines/american-english-training-room.jpg',
    heroLessonImage: '/assets/philippines/enderun-general-english.jpg',
    heroVisualLabel: '马尼拉城市、商务与英语课堂场景',
    benefitChips: [
      { icon: 'flight_takeoff', label: '国际航班集中' },
      { icon: 'business_center', label: '商务英语场景' },
      { icon: 'school', label: '学术衔接资源' },
      { icon: 'schedule', label: '适合城市短课' },
    ],
    stats: [
      { value: '4所', label: '重点学校与中心', icon: 'workspace_premium' },
      { value: '成人为主', label: '口语 / 商务 / 学术' },
      { value: '短期灵活', label: '城市课与企业课' },
      { value: '交通集中', label: '转机与组合行程' },
    ],
    schoolTypes: this.schoolTypes.map((type, index) => ({
      ...type,
      icon: ['record_voice_over', 'business_center', 'school', 'route'][index],
    })),
    schoolProfiles: this.schoolProfiles,
    highlights: this.highlights,
    selectionImages: [
      '/assets/philippines/american-english-training-room.jpg',
      '/assets/philippines/enderun-business-english.jpg',
      '/assets/philippines/mbc-classroom.jpg',
      '/assets/philippines/manila-study-hero.jpg',
    ],
    lifestyleImages: [
      '/assets/philippines/manila-study-hero.jpg',
      '/assets/philippines/american-english-presentation-skills.jpg',
      '/assets/philippines/enderun-academic-english.jpg',
      '/assets/philippines/berlitz-adults.webp',
    ],
    faqs: this.faqs,
    featuredTitle: '马尼拉英语学校与培训中心',
    featuredSubtitle: '城市型课程差异较大，先确认场景、地点与授课方式',
    lifestyleTitle: '在马尼拉，把英语直接放进真实城市场景',
    lifestyleSubtitle: '商务、学术、面试与短期停留，都能找到更贴近使用需求的课程',
  });
}

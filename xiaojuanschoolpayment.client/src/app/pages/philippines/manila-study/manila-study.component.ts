import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ScrollToDirective } from '../../../directives/scroll-to.directive';

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
  location: string;
  style: string;
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
  imports: [CommonModule, RouterModule, MatIconModule, ScrollToDirective],
  templateUrl: './manila-study.component.html',
  styleUrl: './manila-study.component.css',
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
      examples: 'American English、Berlitz Philippines、Enderun Extension',
    },
    {
      title: '商务职场型',
      tag: 'Business / Corporate',
      text: '适合会议表达、商务写作、客户沟通、领导力表达、跨文化沟通和企业内训需求。',
      examples: 'Enderun Extension、American English、Berlitz Philippines',
    },
    {
      title: '学术英语与升学衔接',
      tag: 'Academic / Pathway',
      text: '适合想在首都圈体验大学或学院环境，并考虑商务、酒店、管理等后续学习的人群。',
      examples: 'Enderun Colleges、Manila Business College',
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
      name: 'Enderun Extension',
      location: 'Taguig / Enderun Colleges 体系',
      style: '学术英语、商务英语与短课型',
      courses: [
        'Academic English',
        'Business English',
        'General English',
        'Camps',
        'Foreign Languages',
        'Corporate / Pearson VUE',
      ],
      accommodation:
        '不是传统寄宿制 ESL 学校，住宿通常需要另行安排酒店、公寓或亲友住宿。',
      facilities:
        '官网列有语言课程、短课、证书课程、企业培训和 Pearson Vue 等资源，适合城市型学习。',
      bestFor:
        '成人、职场人士、学术英语衔接、短期课程，以及希望结合城市资源的人群。',
      consultantNote:
        'Enderun 更像“城市学院短课/英语能力补强”，不是碧瑶或宿务那种高密度宿舍制游学。',
    },
    {
      name: 'American English Skills Development Center',
      location: 'Makati / Metro Manila',
      style: '成人口语与企业沟通训练',
      courses: [
        'Conversational English',
        'Business English',
        'IELTS Prep',
        'Business Writing',
        'Assertive Communication',
        'One-on-One / Group / Corporate',
      ],
      accommodation:
        '官网定位为线上或线下面授培训中心，住宿和接送需学生自行安排。',
      facilities:
        '官网强调线上与面对面课程、团体课、一对一、企业培训、沟通表达和真实场景练习。',
      bestFor:
        '在职人士、面试准备、商务写作、客服沟通、公开表达和短期口语强化。',
      consultantNote:
        '适合已经在马尼拉或计划短住的人；如果需要校内宿舍和每日管理，应转看宿务、碧瑶或 Clark。',
    },
    {
      name: 'Berlitz Philippines',
      location: 'Metro Manila / Ortigas、Greenhills、Makati 等城市点位',
      style: '国际语言培训与企业服务型',
      courses: [
        'Adults',
        'Kids & Teens',
        'Private / Groups',
        'Corporate Language Training',
        'Business Communication',
        'Language Testing',
      ],
      accommodation: '非住宿制语言中心，适合自行安排城市住宿或公司派训。',
      facilities:
        '官网列出成人、儿童青少年、企业语言培训、语言测评、TELC 备考和跨文化训练等方向。',
      bestFor: '商务人士、企业培训、家庭城市课程、需要国际品牌语言服务的人群。',
      consultantNote:
        '课程更偏培训中心逻辑，顾问会重点核对上课点、排课方式、授课语言和是否适合短期访客。',
    },
    {
      name: 'Manila Business College',
      location: 'Manila City',
      style: '商科院校与国际学生衔接候选',
      courses: [
        'Business / Management',
        'Finance',
        'Economics',
        'Hospitality',
        'Foreign Student Admission',
      ],
      accommodation:
        '官网主要是学院型信息，不是 ESL 宿舍制学校；住宿、签证和语言补强需单独核对。',
      facilities:
        '官网说明学校获 CHED、DepEd、TESDA 相关认可，并接收本地与外国学生。',
      bestFor: '想了解马尼拉商科院校环境、后续学历路径或城市型学习资源的学生。',
      consultantNote:
        '适合作为“英语 + 商科/城市体验”的候选，不应与菲律宾语言学校宿舍套餐直接类比。',
    },
    {
      name: 'CNN / C21 / PICO 等旧马尼拉 ESL 候选',
      location: 'Quezon City / Metro Manila 历史候选',
      style: '传统 ESL 学校复核池',
      courses: [
        'General ESL',
        'TOEIC / TOEFL / IELTS',
        'Business English',
        'Junior',
        'Dormitory',
      ],
      accommodation:
        '旧资料常提到宿舍或校内管理，但当前官网解析和资料稳定性不足，需逐项复核。',
      facilities:
        '不以本页作为当前运营证明，需确认学校是否仍招生、校区地址、课程表、宿舍和费用。',
      bestFor: '只适合作为顾问进一步查证的候选，不建议学生直接凭旧网文报名。',
      consultantNote:
        '思达教育会先向学校或可靠合作方确认当期运营状态，再决定是否推荐。',
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
    {
      icon: 'fact_check',
      label: '旧校名必须复核',
      text: 'CNN、C21、PICO 等旧资料里的学校，需要确认官网、校区、课程和宿舍是否仍有效。',
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
}

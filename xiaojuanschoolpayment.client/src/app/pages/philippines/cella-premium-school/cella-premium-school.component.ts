import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

type GalleryCategory = '全部' | '校园' | '教室' | '住宿' | '餐厅' | '设施';
type WeekOption = 1 | 2 | 3 | 4 | 8 | 12;

interface QuickInfo {
  icon: string;
  label: string;
  value: string;
  note: string;
}

interface GalleryImage {
  category: Exclude<GalleryCategory, '全部'>;
  title: string;
  description: string;
  src: string;
}

interface BasicInfoRow {
  label: string;
  value: string;
}

interface Highlight {
  image: string;
  title: string;
  text: string;
}

interface FitItem {
  title: string;
  text: string;
}

interface RoomOption {
  id: string;
  name: string;
  note: string;
}

interface CourseOption {
  id: string;
  name: string;
  type: string;
  lessons: string;
  suitable: string;
  fourWeekFees: Record<string, number>;
}

interface ScheduleItem {
  time: string;
  title: string;
  text: string;
}

interface LocalFee {
  item: string;
  amount: string;
  note: string;
}

interface ProcessStep {
  icon: string;
  title: string;
  text: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

interface SideNavItem {
  label: string;
  target: string;
  icon: string;
}

interface SidaReason {
  number: string;
  title: string;
  text: string;
  image: string;
  alt: string;
}

interface SidaTrustBadge {
  icon: string;
  label: string;
}

interface SourceLink {
  label: string;
  url: string;
}

@Component({
  selector: 'app-cella-premium-school',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './cella-premium-school.component.html',
  styleUrls: [
    '../cebu-school-detail-layout.css',
    '../cebu-school-detail-content.css',
    '../cebu-school-detail-responsive.css',
    '../ev-school/ev-school-detail.component.css',
    './cella-premium-school.component.css',
  ],
})
export class CellaPremiumSchoolComponent {
  readonly galleryCategories: GalleryCategory[] = [
    '全部',
    '校园',
    '教室',
    '住宿',
    '餐厅',
    '设施',
  ];
  selectedGalleryCategory: GalleryCategory = '全部';

  readonly registrationFee = 150;
  readonly usdToCny = 7.2;
  readonly weekOptions: WeekOption[] = [1, 2, 3, 4, 8, 12];

  selectedCourseId = 'light-esl';
  selectedRoomId = 'six';
  selectedWeeks: WeekOption = 4;
  selectedStartDate = '2026-09-07';
  quoteCalculated = false;

  readonly quickInfo: QuickInfo[] = [
    {
      icon: 'apartment',
      label: '学校类型',
      value: '宿务市区Premium型校区',
      note: '位于Banilad / A.S. Fortuna生活圈，适合重视住宿品质和便利生活的学生',
    },
    {
      icon: 'history_edu',
      label: '学校背景',
      value: '2006年创立，韩资学校',
      note: 'Premium Campus以现代化宿舍、口语课程、商务和短期密集课程为卖点',
    },
    {
      icon: 'record_voice_over',
      label: '课程特色',
      value: '口语强化 + 商务 + 短期Expresser',
      note: 'Light ESL、Power Speaking、BPE、Working Holiday、ACE和Family均可比较',
    },
    {
      icon: 'bed',
      label: '住宿房型',
      value: '校内1/半单/2/4/6人房 + Alicia外部寮',
      note: '价格随房型差异明显，6人房最低，单人房和Alicia房型更舒适',
    },
    {
      icon: 'restaurant',
      label: '餐食安排',
      value: '平日3餐，周末/假日2餐',
      note: '公开资料列套餐含餐食、住宿、清扫和洗衣，最终以当期说明为准',
    },
    {
      icon: 'pool',
      label: '校区设施',
      value: '泳池 / 食堂 / 自习室 / 卖店 / Wi-Fi',
      note: '改装酒店风格，适合想兼顾学习和生活舒适度的人',
    },
  ];

  readonly galleryImages: GalleryImage[] = [
    {
      category: '校园',
      title: 'CELLA Premium校区外观',
      description:
        'Premium Campus位于宿务市区便利生活圈，现代化外观和酒店式设施是主要卖点。',
      src: 'https://languverseofficial.com/wp-content/uploads/2024/08/IMG_4505-1024x812.jpg',
    },
    {
      category: '设施',
      title: 'CELLA Premium泳池',
      description:
        '校区内泳池和公共休息空间，让CELLA Premium更适合学习生活平衡型学生。',
      src: 'https://www.fujiyama-international.com/archives/004/202411/939d57f667d55f4236cbfbdeb029226f7e43986b16a29c5196ace3e74d5e480f.jpg',
    },
    {
      category: '设施',
      title: 'CELLA Premium学习休息区',
      description:
        '明亮的CELLA休息区适合课后自习、线上沟通和同学交流。',
      src: 'https://global-click.jp/contents/wp-content/uploads/2023/01/DSC07220.jpg',
    },
    {
      category: '教室',
      title: '一对一教室与学习隔间',
      description:
        'CELLA以高比例一对一课程和可客制化学习内容为核心。',
      src: 'https://www.philippine-ryugaku.com/wp-content/uploads/2023/03/cella_premium-classroom01-1600x1200.jpg',
    },
    {
      category: '住宿',
      title: 'CELLA Premium双人房参考',
      description:
        '改装酒店式房间，房型包含单人、半单人、双人、四人、六人和Alicia外部寮。',
      src: 'https://storage.googleapis.com/outto-strapi-cms-gcp/cms/large_ROOM_06_e5031fa13c/large_ROOM_06_e5031fa13c.jpeg',
    },
    {
      category: '住宿',
      title: 'CELLA Premium多人房参考',
      description:
        '多人房适合控制预算，正式报价需按性别、空房和入学日期确认。',
      src: 'https://www.fujiyama-international.com/archives/004/202408/5ca9079e8300cc6666235b5474f5f073.jpg',
    },
    {
      category: '餐厅',
      title: 'CELLA Premium学习餐厅空间',
      description:
        '公开资料列平日三餐、周末和假日两餐；具体菜单与供应以学校现场为准。',
      src: 'https://www.easy-go.mn/uploads/school-photo/middle/easy-go-school-photo-16735103864.jpg',
    },
  ];

  readonly basicInfo: BasicInfoRow[] = [
    { label: '学校名称', value: '菲律宾宿务CELLA Premium Campus' },
    { label: '英文名称', value: 'Cebu English Language Learning Academy Premium Campus' },
    {
      label: '地址',
      value: 'One Paseo Compound, Ma. Paseo Saturnino, Cebu City, Cebu, Philippines',
    },
    { label: '学校定位', value: '宿务市区Premium型英语学校，强调口语强化、短期密集、商务英语和亲子课程' },
    { label: '学生规模', value: '公开资料显示约100-180名，国籍比例每月变化，日本比例约20-40%参考' },
    { label: '课程方向', value: 'Light ESL、Power Speaking 1/2、BPE、Working Holiday、ACE、Expresser、Family Package' },
    { label: '住宿房型', value: '校内1人房、半单人房、2人房、4人房、6人房；Alicia外部寮1人/2人房' },
    { label: '4周起价', value: 'USD 1,580起：Light ESL + 6人房 + 注册费' },
  ];

  readonly highlights: Highlight[] = [
    {
      image:
        'https://www.fujiyama-international.com/archives/004/202411/5f64e04fe453bb41c982f55aea5fe6319214c07691020fabf5b161f38fb1891d.jpg',
      title: '市区便利位置',
      text: '位于Banilad / A.S. Fortuna生活圈，周边餐厅、咖啡、商场和生活机能较方便。',
    },
    {
      image:
        'https://www.philippine-ryugaku.com/wp-content/uploads/2023/03/cella_premium-classroom01-1600x1200.jpg',
      title: '一对一课程强',
      text: 'Power Speaking、Expresser和商务课程都强调大量一对一课，适合想快速开口的人。',
    },
    {
      image:
        'https://www.fujiyama-international.com/archives/004/202408/5ca9079e8300cc6666235b5474f5f073.jpg',
      title: '房型预算弹性大',
      text: '6人房控制预算，半单人/单人房和Alicia外部寮更舒适，适合不同预算层级。',
    },
    {
      image:
        'https://studyin-prod-images.s3.ap-northeast-1.amazonaws.com/images/2023/05/af194836b4ffba531a3bba750685a090bd8ff23f/detail-card.jpg',
      title: '泳池与酒店式设施',
      text: '改装酒店风格让CELLA Premium比传统宿舍型学校更有生活舒适感。',
    },
  ];

  readonly suitableFor: FitItem[] = [
    {
      title: '想在宿务市区读口语强化',
      text: 'Power Speaking 1/2和Light ESL适合想增加开口机会、又保留市区生活便利的人。',
    },
    {
      title: '社会人或短期学生',
      text: 'Expresser 1周/2周课程强调初日上课、假日补课和高密度一对一，适合假期短的人。',
    },
    {
      title: '想准备商务或工作假期',
      text: 'BPE、Working Holiday和ACE课程适合英文履历、面试、职场沟通或航空服务方向。',
    },
    {
      title: '重视住宿舒适度和房型选择',
      text: '校内房型和Alicia外部寮选择较多，适合从预算型到舒适型不同需求。',
    },
  ];

  readonly notSuitableFor: FitItem[] = [
    {
      title: '只想要海边度假校区',
      text: 'CELLA Premium在宿务市区生活圈，不是Mactan海边路线；海边可比较CIA、Genius或CBOA。',
    },
    {
      title: '目标是强制高压斯巴达备考',
      text: 'Premium Campus更偏便利、舒适和口语/商务路线；高压备考可同步看SMEAG、EV、CPILS或碧瑶学校。',
    },
    {
      title: '只看最低套餐价',
      text: '注册费、SSP、签证、押金、水电、教材、管理费和接机等仍需另行确认。',
    },
    {
      title: '旺季临时指定单人房',
      text: '热门房型和暑假/寒假档期需要提前查空位，不能只看公开价格。',
    },
  ];

  readonly roomOptions: RoomOption[] = [
    { id: 'six', name: '6人房', note: '公开表最低房型，适合控制预算。' },
    { id: 'quad', name: '4人房', note: '比6人房舒适，仍相对经济。' },
    { id: 'twin', name: '2人房', note: '预算与隐私较平衡。' },
    { id: 'semi', name: '半单人房', note: '独立空间更好，卫浴通常需共享。' },
    { id: 'single', name: '1人房', note: '隐私最好，热门档期需尽早确认。' },
    { id: 'alicia-twin', name: 'Alicia外部寮2人房', note: '外部寮选择，适合想住Alicia的学生。' },
  ];

  readonly courseOptions: CourseOption[] = [
    {
      id: 'light-esl',
      name: 'Light ESL',
      type: '轻量ESL',
      lessons: '1:1三节 + 小组一节，自习可选',
      suitable: '适合想保留下午/上午自由时间、轻量提升英语的人。',
      fourWeekFees: { single: 2430, semi: 2030, twin: 1830, quad: 1630, six: 1430, 'alicia-twin': 1830 },
    },
    {
      id: 'power-speaking-1',
      name: 'Power Speaking 1',
      type: '口语综合强化',
      lessons: '1:1四节 + 小组四节',
      suitable: '适合想兼顾一对一和小组输出、稳步提升会话的人。',
      fourWeekFees: { single: 2530, semi: 2130, twin: 1930, quad: 1730, six: 1530, 'alicia-twin': 1930 },
    },
    {
      id: 'power-speaking-2',
      name: 'Power Speaking 2',
      type: '高比例1:1',
      lessons: '1:1六节 + 小组两节',
      suitable: '适合想短期增加一对一纠音、表达和反馈密度的人。',
      fourWeekFees: { single: 2680, semi: 2280, twin: 2080, quad: 1880, six: 1680, 'alicia-twin': 2080 },
    },
    {
      id: 'business-prep',
      name: 'BPE Preparation',
      type: '商务英语基础',
      lessons: '商务1:1四节 + ESL小组四节',
      suitable: '适合想先建立商务英语基础，同时保留一般英语训练的人。',
      fourWeekFees: { single: 2680, semi: 2280, twin: 2080, quad: 1880, six: 1680, 'alicia-twin': 2080 },
    },
    {
      id: 'business-intensive',
      name: 'BPE Intensive',
      type: '商务英语强化',
      lessons: '商务1:1四节 + 商务小组四节',
      suitable: '适合中级以上、想集中练会议、邮件、演示和职场沟通的人。',
      fourWeekFees: { single: 2780, semi: 2380, twin: 2180, quad: 1980, six: 1780, 'alicia-twin': 2180 },
    },
    {
      id: 'working-holiday',
      name: 'Working Holiday',
      type: '打工度假准备',
      lessons: '1:1三节 + 小组四节 + OJT可选',
      suitable: '适合之后计划澳洲、加拿大等打工度假的学生。',
      fourWeekFees: { single: 2530, semi: 2130, twin: 1930, quad: 1730, six: 1530, 'alicia-twin': 1930 },
    },
    {
      id: 'ace',
      name: 'Airline Cabin Crew English',
      type: '航空服务英语',
      lessons: '1:1四节 + 小组三节 + Native小组一节',
      suitable: '适合航空业、客舱服务和英文面试方向，通常4周/8周规划。',
      fourWeekFees: { single: 2600, semi: 2200, twin: 2200, quad: 1800, six: 1600, 'alicia-twin': 2000 },
    },
  ];

  readonly expresserFees = [
    { label: 'Expresser 1周', lessons: '1:1九节 + 小组一节', four: '1周限定：USD 900起 / 4人房', note: '初日下午开始上课，适合超短期社会人' },
    { label: 'Expresser 2周', lessons: '1:1九节 + 小组一节', four: '2周限定：USD 1,350起 / 4人房', note: '含第一周周六上午课程，需按学校规则确认' },
    { label: 'Family Package家长', lessons: '1:1两节 + 小组一节', four: '需按家庭组合确认', note: '适合亲子同行家长轻量学习' },
    { label: 'Family Package儿童', lessons: '1:1四节 + 小组四节', four: '需按年龄与房型确认', note: '儿童课程与暑期Junior Camp需单独核价' },
  ];

  readonly schedule: ScheduleItem[] = [
    {
      time: '07:00 - 08:00',
      title: '早餐 / 课前准备',
      text: '平日三餐公开包含，具体时段以学校到校说明为准。',
    },
    {
      time: '08:00 - 12:00',
      title: '上午1:1 / 小组课',
      text: 'Light ESL可选择上午或下午集中上课，Power Speaking和商务课程课量更满。',
    },
    {
      time: '12:00 - 13:00',
      title: '午餐',
      text: '校内食堂用餐，公开资料列周末和假日提供两餐。',
    },
    {
      time: '13:00 - 17:00',
      title: '下午课程 / 自习',
      text: '按课程进入一对一、小组、商务、Working Holiday或自习时段。',
    },
    {
      time: '17:30 - 18:30',
      title: '晚餐 / 休息',
      text: '课后可使用自习室、公共空间或周边生活机能。',
    },
    {
      time: '19:00后',
      title: '自习 / 生活管理',
      text: '公开资料列门禁规则，实际校规、外宿和出入管理以到校说明为准。',
    },
  ];

  readonly localFees: LocalFee[] = [
    { item: '注册费', amount: 'USD 150', note: '出发前支付，不含在课程住宿套餐内' },
    { item: '高峰期加价', amount: 'USD 40 / 周', note: '公开资料列2026年夏季旺季加价，日期需按学校当期确认' },
    { item: 'SSP + SSP I-Card', amount: 'PHP 12,300', note: 'SSP PHP 7,800 + SSP I-Card PHP 4,500参考' },
    { item: '签证延长', amount: 'PHP 5,140起', note: '30天内通常无需延签，5-8周起产生费用' },
    { item: 'ACR I-Card', amount: 'PHP 4,000', note: '长周期学习通常需要确认' },
    { item: '宿舍押金', amount: 'PHP 2,000-10,000', note: '按周数变化，退房结算水电/洗衣/损坏后返还' },
    { item: '管理费', amount: 'PHP 800-1,000 / 周', note: '不同公开表口径略有差异，以学校正式报价为准' },
    { item: '电费', amount: 'PHP 500 / 周起', note: '公开资料列超出额度另收超额电费' },
    { item: '水费', amount: 'PHP 300 / 周', note: '按周计算参考' },
    { item: '教材费', amount: 'PHP 200-600 / 册', note: '或约PHP 2,000 / 4周，按课程和级别变化' },
    { item: 'ID Card', amount: 'PHP 200', note: '学生证费用参考' },
    { item: '机场接机', amount: 'PHP 1,200', note: '亲子或多人接机需单独确认' },
  ];

  readonly serviceSteps: ProcessStep[] = [
    {
      icon: 'person_search',
      title: '先判断CELLA是否适合',
      text: '根据口语、短期密集、商务、亲子、住宿预算和市区便利度做初筛。',
    },
    {
      icon: 'fact_check',
      title: '确认课程和房型',
      text: '核对Light、Power Speaking、BPE、WH、ACE、Expresser和内部/外部寮空位。',
    },
    {
      icon: 'payments',
      title: '拆清套餐和当地费用',
      text: '把套餐价、注册费、旺季费、SSP、押金、水电、教材、接机和签证延长分开列清。',
    },
    {
      icon: 'assignment_turned_in',
      title: '准备入学文件',
      text: '协助整理护照、保险、eTravel、接机、现金清单和到校注意事项。',
    },
    {
      icon: 'support_agent',
      title: '到校后继续跟进',
      text: '课程、老师、宿舍、账单或校规沟通问题，都可以继续联系顾问协助。',
    },
    {
      icon: 'location_on',
      title: '宿务当地支持',
      text: '思达在宿务有工作人员驻点，可按情况提供当地沟通支持。',
    },
  ];

  readonly sidaReasons: SidaReason[] = [
    {
      number: '01',
      title: '先看市区Premium定位是否适合',
      text: 'CELLA适合便利位置和舒适住宿；如果你更想海边，顾问会同步比较CIA、Genius、CBOA。',
      image: 'assets/cia/sida-why-action-selection.jpg',
      alt: '思达启航顾问帮助学生选择菲律宾宿务语言学校',
    },
    {
      number: '02',
      title: '课程和房型逐项核价',
      text: 'Light、Power、BPE、WH、ACE、Expresser和不同房型价格差异明显，需按日期确认。',
      image: 'assets/cia/sida-why-action-fees.jpg',
      alt: '思达启航顾问核算菲律宾语言学校费用',
    },
    {
      number: '03',
      title: '当地费用提前说清楚',
      text: 'SSP、签证、押金、教材、水电、管理费和接机不能只看套餐价。',
      image: 'assets/cia/sida-why-action-contract.jpg',
      alt: '思达启航顾问核验菲律宾游学课程和合同文件',
    },
    {
      number: '04',
      title: '行前清单更完整',
      text: '接机、现金、保险、入境文件、住宿用品和到校费用会提前整理给学生。',
      image: 'assets/cia/sida-why-action-departure.jpg',
      alt: '菲律宾游学出发前文件和行李准备',
    },
    {
      number: '05',
      title: '学习中仍可继续沟通',
      text: '遇到课程、老师、住宿或账单疑问时，可让顾问帮忙梳理沟通重点。',
      image: 'assets/cia/sida-why-action-followup.jpg',
      alt: '思达启航顾问持续跟进学生学习情况',
    },
    {
      number: '06',
      title: '国内顾问 + 宿务驻点',
      text: '国内咨询和宿务当地支持配合，适合第一次去菲律宾游学的学生和家庭。',
      image: 'assets/cia/sida-why-action-team.jpg',
      alt: '思达启航宿务和深圳服务团队',
    },
  ];

  readonly sidaTrustBadges: SidaTrustBadge[] = [
    { icon: 'description', label: '正式报价逐项核验' },
    { icon: 'verified_user', label: '课程与房型提前确认' },
    { icon: 'payments', label: '套餐与当地费分开算' },
    { icon: 'apartment', label: '深圳总部 + 宿务驻点' },
  ];

  readonly schoolServices = [
    '机场接机',
    '入学测试',
    '一对一课程',
    '小组课',
    'Native Group',
    '食堂',
    '校内宿舍',
    'Alicia外部寮',
    '泳池',
    '自习室',
    '卖店',
    'Wi-Fi',
  ];
  readonly campusActivities = [
    '新生说明会',
    '口语输出训练',
    '商务模拟',
    'Working Holiday OJT',
    '亲子活动',
    '月末活动/志愿活动',
  ];
  readonly weekendActivities = [
    'A.S. Fortuna周边餐厅',
    'Country Mall',
    'Banilad / IT Park',
    '咖啡厅和按摩',
    '宿务市区商场',
    'Mactan一日游',
  ];
  readonly notes = [
    '本页费用使用2026公开参考价；正式报价会按学校当期价格、入学日期、房型和优惠调整。',
    '套餐价通常含授课、住宿、餐食、清扫和洗衣；注册费、旺季费和当地费用仍需分开确认。',
    'Expresser为1周/2周短期密集路线，课程规则和可报名日期需单独核对。',
    'Family Package、Junior Camp和儿童课程需要按年龄、监护人、房型和档期确认。',
    '如果目标是强备考或海边度假，应同步比较SMEAG/EV/CPILS或CIA/Genius/CBOA。',
  ];
  readonly faqs: FaqItem[] = [
    {
      question: 'CELLA Premium和CIA最大的区别是什么？',
      answer:
        'CIA更偏Mactan半斯巴达综合型新校区；CELLA Premium位于宿务市区便利生活圈，更强调口语一对一、商务/短期密集课程和酒店式住宿舒适度。',
    },
    {
      question: '页面上的报价包含全部费用吗？',
      answer:
        '不包含全部。报价器主要估算课程住宿套餐和注册费；SSP、签证、押金、水电、教材、管理费、ID、接机和旺季加价仍需另行确认。',
    },
    {
      question: 'CELLA Premium适合短期一两周吗？',
      answer:
        '适合列入候选。Expresser 1周/2周主打一对一高密度和初日开课，适合假期短的社会人，但具体入学日和假期授课规则要报名前确认。',
    },
    {
      question: 'CELLA Premium适合亲子吗？',
      answer:
        '可以比较。公开资料列Family Package家长与儿童课程，但需要按孩子年龄、监护人、房型、学校规则和旺季名额确认。',
    },
    {
      question: 'CELLA Premium适合商务英语吗？',
      answer:
        '适合。BPE Preparation和BPE Intensive都偏商务场景，涵盖邮件、会议、演示、面试等方向；若需要航空服务英语，也可看ACE路线。',
    },
  ];
  readonly sideNav: SideNavItem[] = [
    { label: '学校环境', target: 'gallery', icon: 'image' },
    { label: '课程与费用', target: 'course-fees', icon: 'menu_book' },
    { label: '费用快速报价', target: 'quote', icon: 'calculate' },
    { label: '短期/亲子课程', target: 'special-fees', icon: 'bolt' },
    { label: '到校费用', target: 'local-fees', icon: 'payments' },
    { label: '常见问题', target: 'faq', icon: 'help' },
  ];
  readonly mobileAnchors: SideNavItem[] = [
    { label: '概览', target: 'top', icon: 'dashboard' },
    { label: '环境', target: 'gallery', icon: 'image' },
    { label: '课程', target: 'courses', icon: 'menu_book' },
    { label: '费用', target: 'quote', icon: 'calculate' },
    { label: '服务', target: 'service-process', icon: 'support_agent' },
    { label: 'FAQ', target: 'faq', icon: 'help' },
  ];

  readonly sources: SourceLink[] = [
    { label: 'CELLA官网', url: 'https://www.cellaenglish.com/?ckattempt=1' },
    { label: 'Cebu English CELLA Premium资料与费用', url: 'https://cebu-english.com/school/cella-premium/' },
    { label: 'Global Click CELLA Premium 2026费用', url: 'https://global-click.jp/contents/school/cella-premium-campus/' },
    { label: '菲律宾留学中心 CELLA Premium 2026费用', url: 'https://www.ph-ryugaku.com/school/cella/' },
    { label: 'CEBU21 CELLA Premium学校信息', url: 'https://cebu21.jp/cella' },
    { label: 'Wego CELLA Premium当地费用说明', url: 'https://www.wegoedu.com.tw/school/cebu-cella-premium-2/' },
  ];

  setGalleryCategory(category: GalleryCategory): void {
    this.selectedGalleryCategory = category;
  }

  calculateQuote(): void {
    this.quoteCalculated = true;
  }

  scrollToSection(target: string, event?: Event): void {
    event?.preventDefault();
    const targetElement = document.getElementById(target);

    if (!targetElement) {
      return;
    }

    const headerOffset = window.innerWidth <= 680 ? 132 : 92;
    const targetTop =
      targetElement.getBoundingClientRect().top + window.scrollY - headerOffset;

    window.scrollTo({ top: Math.max(targetTop, 0), behavior: 'smooth' });
    window.history.replaceState(
      null,
      '',
      `${window.location.pathname}${window.location.search}#${target}`,
    );
  }

  feeFor(courseId: string, roomId: string, weeks: WeekOption = 4): number {
    const course = this.courseOptions.find((item) => item.id === courseId);
    const fourWeekFee = course?.fourWeekFees[roomId] ?? 0;

    return Math.round(fourWeekFee * this.durationMultiplier(weeks));
  }

  get filteredGalleryImages(): GalleryImage[] {
    return this.selectedGalleryCategory === '全部'
      ? this.galleryImages
      : this.galleryImages.filter(
          (image) => image.category === this.selectedGalleryCategory,
        );
  }

  get selectedCourse(): CourseOption {
    return (
      this.courseOptions.find((course) => course.id === this.selectedCourseId) ??
      this.courseOptions[0]
    );
  }

  get selectedRoom(): RoomOption {
    return (
      this.roomOptions.find((room) => room.id === this.selectedRoomId) ??
      this.roomOptions[0]
    );
  }

  get selectedPackageFee(): number {
    return this.feeFor(this.selectedCourseId, this.selectedRoomId, this.selectedWeeks);
  }

  get quoteUsd(): number {
    return this.registrationFee + this.selectedPackageFee;
  }

  get quoteUsdText(): string {
    return `USD ${this.formatUsd(this.quoteUsd)} 起`;
  }

  get quoteCnyText(): string {
    const rounded = Math.round((this.quoteUsd * this.usdToCny) / 100) * 100;

    return `约 ${rounded.toLocaleString('zh-CN')} 元起`;
  }

  get seasonalNote(): string {
    return '公开资料列2026年夏季旺季可能加收USD 40/周，正式以学校报价为准';
  }

  formatUsd(value: number): string {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: Number.isInteger(value) ? 0 : 1,
      maximumFractionDigits: 1,
    });
  }

  private durationMultiplier(weeks: WeekOption): number {
    const multiplier: Record<WeekOption, number> = {
      1: 0.4,
      2: 0.65,
      3: 0.85,
      4: 1,
      8: 2,
      12: 3,
    };

    return multiplier[weeks];
  }
}

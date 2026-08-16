import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

type GalleryCategory = '全部' | '校区' | '教室' | '住宿' | '生活';
type WeekOption = 1 | 2 | 3 | 4 | 8 | 12 | 16 | 20;
type ProgramId = 'group-4' | 'group-5';
type HousingId = 'tuition-only' | 'dormitory' | 'homestay' | 'outside-stay';

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

interface TextCard {
  title: string;
  text: string;
}

interface ProgramOption {
  id: ProgramId;
  name: string;
  type: string;
  lessons: string;
  suitable: string;
}

interface HousingOption {
  id: HousingId;
  name: string;
  shortName: string;
  note: string;
  pricesUsd: Record<ProgramId, Record<WeekOption, number>>;
}

interface LocalFee {
  item: string;
  amount: string;
  note: string;
}

interface ScheduleItem {
  time: string;
  title: string;
  text: string;
}

interface SideNavItem {
  label: string;
  target: string;
  icon: string;
}

interface SourceLink {
  label: string;
  url: string;
}

@Component({
  selector: 'app-ethos-school',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './ethos-school.component.html',
  styleUrls: [
    '../cebu-school-detail-layout.css',
    '../cebu-school-detail-content.css',
    '../cebu-school-detail-responsive.css',
    '../ev-school/ev-school-detail.component.css',
    './ethos-school.component.css',
  ],
})
export class EthosSchoolComponent {
  readonly galleryCategories: GalleryCategory[] = ['全部', '校区', '教室', '住宿', '生活'];
  selectedGalleryCategory: GalleryCategory = '全部';

  readonly weekOptions: WeekOption[] = [1, 2, 3, 4, 8, 12, 16, 20];
  selectedProgramId: ProgramId = 'group-4';
  selectedHousingId: HousingId = 'dormitory';
  selectedWeeks: WeekOption = 4;
  selectedStartDate = '2026-09-07';
  includeThreeMealPlan = false;
  quoteCalculated = false;

  readonly quickInfo: QuickInfo[] = [
    {
      icon: 'record_voice_over',
      label: '学校定位',
      value: '美国老师小班英文学校',
      note: 'ETHOS主打American English，由美国籍老师授课，适合想练美式发音、会话和英文表达的学生。',
    },
    {
      icon: 'groups',
      label: '班级人数',
      value: 'Group最多6人',
      note: '官方资料显示Group Class每班最多6名学生；Man-to-Man名额有限，通常需单独确认。',
    },
    {
      icon: 'schedule',
      label: '课程时间',
      value: '4小时或5小时/天',
      note: '周一至周五9:00开始，4小时包含Pronunciation、Grammar、Conversation、Reading，5小时加Writing。',
    },
    {
      icon: 'location_city',
      label: '所在区域',
      value: 'Basak San Nicolas / Cebu City',
      note: '学校在Cebu South Road与Eucalyptus Street转角，靠近Shopwise、McDonald’s South和SM Seaside生活圈。',
    },
    {
      icon: 'home_work',
      label: '住宿',
      value: 'Dormitory / Home Stay / 自住',
      note: 'ETHOS可安排宿舍或美国老师家庭Homestay，也允许学生自行安排宿务市区住宿。',
    },
    {
      icon: 'paid',
      label: '公开价格',
      value: 'USD套餐价',
      note: '公开价格表列出1-20周、4小时/5小时、Tuition only、Dormitory、Home Stay和Outside Stay套餐。',
    },
  ];

  readonly galleryImages: GalleryImage[] = [
    {
      category: '教室',
      title: 'ETHOS美国老师团队',
      description: 'ETHOS强调由American native-speaker teachers教授American English。',
      src: 'https://www.ethos.ph/images/ETHOS%20US%20Teachers.jpg',
    },
    {
      category: '校区',
      title: 'ETHOS学校入口',
      description: '学校位于Cebu City Basak San Nicolas，靠近主路和日常生活设施。',
      src: 'https://www.ethos.ph/images/S01.jpg',
    },
    {
      category: '教室',
      title: '现代化学习设施',
      description: '学校空间小而集中，适合想要老师反馈密度更高的学生。',
      src: 'https://www.ethos.ph/images/S02.jpg',
    },
    {
      category: '教室',
      title: '小班课堂',
      description: 'Group Class公开上限为6人，适合在同伴互动中练习输出。',
      src: 'https://www.ethos.ph/images/S04.jpg',
    },
    {
      category: '生活',
      title: '图书馆与学生休息区',
      description: '课堂之外可使用学生休息空间，适合课后复习和同学交流。',
      src: 'https://www.ethos.ph/images/S06.jpg',
    },
    {
      category: '住宿',
      title: 'ETHOS宿舍参考',
      description: '宿舍为预算较低的校方住宿选择，通常步行几分钟可到学校。',
      src: 'https://www.ethos.ph/images/S09.jpg',
    },
    {
      category: '住宿',
      title: '宿舍厨房参考',
      description: '宿舍公开资料列出完整厨房、Wi-Fi、空调、清洁和水电等支持。',
      src: 'https://www.ethos.ph/images/S10.jpg',
    },
    {
      category: '生活',
      title: 'Home Stay家庭环境',
      description: 'Home Stay让学生住进美国老师家庭，工作日早餐包含在住宿方案内。',
      src: 'https://www.ethos.ph/images/S14.jpg',
    },
  ];

  readonly basicInfo: BasicInfoRow[] = [
    { label: '学校名称', value: '菲律宾宿务ETHOS Language School' },
    { label: '英文名称', value: 'ETHOS Language School / Ethics To Help Others Succeed Corp.' },
    {
      label: '地址',
      value: 'C.C. Regis Building, Corner Cebu South Road & Eucalyptus Street, Basak San Nicolas, 6000 Cebu City',
    },
    {
      label: '学校定位',
      value: '宿务市区小规模American English学校，强调美国籍老师、小班、每日反馈和Homestay体验。',
    },
    { label: '公开规模', value: '官方FAQ列当前最大容量约30名；Kids Camp需至少6名学生成团。' },
    { label: '开校时间', value: '官方FAQ显示2012年4月开校。' },
    {
      label: '4周起价',
      value: 'USD 1,438起：4小时/天Group Class Tuition only；Dormitory住宿套餐4周USD 1,781起。',
    },
  ];

  readonly highlights: TextCard[] = [
    {
      title: 'American English特色非常明确',
      text: 'ETHOS不是普通菲律宾老师ESL学校，核心卖点是美国老师、美式发音、会话、语法、阅读和写作训练。',
    },
    {
      title: '小班最多6人，适合互动输出',
      text: '官方更推荐Group Class，因为同伴互动、老师纠错和课后共同复习能降低开口压力。',
    },
    {
      title: 'Home Stay是它很特别的住宿体验',
      text: '学生可住在美国老师家庭里，想在课堂外继续接触英文和美式家庭文化的人会更有感。',
    },
  ];

  readonly suitableFor: TextCard[] = [
    {
      title: '想被美国老师纠音和训练表达',
      text: '如果你特别在意美式发音、自然表达、会话反馈和老师邮件反馈，ETHOS会比普通大校更有辨识度。',
    },
    {
      title: '喜欢小规模、熟人感强的学校',
      text: 'ETHOS公开容量不大，适合不想进几百人大校、希望老师和学生之间更熟悉的人。',
    },
    {
      title: '亲子或家庭想一起上课',
      text: 'Family English允许家长和孩子一起学习；10岁以上进入常规Group，6-9岁走50/50，5岁以下有Day Care口径。',
    },
  ];

  readonly lessSuitableFor: TextCard[] = [
    {
      title: '想要度假村型大校园',
      text: 'ETHOS是宿务市区小学校，不是CIA、ELSA、Cebu Blue Ocean那类大型或度假式校园。',
    },
    {
      title: '需要雅思、多益保证班体系',
      text: 'ETHOS更像American English沟通训练；如果目标是考试分数和模考体系，可同步比较CIA、EV、CPILS或SMEAG。',
    },
    {
      title: '只想全一对一且立刻锁定',
      text: 'ETHOS公开说明Man-to-Man名额有限且费用更高，页面报价器先按公开Group套餐估算。',
    },
  ];

  readonly programs: ProgramOption[] = [
    {
      id: 'group-4',
      name: 'Classroom English 4 Hours',
      type: 'Group / 标准',
      lessons: 'American Pronunciation + Grammar + Conversation + Reading',
      suitable: '想提升美式发音、口语、语法和阅读，预算也想控制得更稳的学生。',
    },
    {
      id: 'group-5',
      name: 'Classroom English 5 Hours',
      type: 'Group / 强化',
      lessons: '4小时课程 + Writing',
      suitable: '需要写作、职业英文、留学准备或想把每天学习密度再提高的人。',
    },
  ];

  readonly housingOptions: HousingOption[] = [
    {
      id: 'tuition-only',
      name: 'Tuition Only',
      shortName: '只读课程',
      note: '不含住宿，适合已在宿务有住处或想自行订酒店/公寓的人。',
      pricesUsd: {
        'group-4': { 1: 361, 2: 721, 3: 1079, 4: 1438, 8: 2729, 12: 4095, 16: 5315, 20: 6643 },
        'group-5': { 1: 451, 2: 902, 3: 1350, 4: 1801, 8: 3417, 12: 5127, 16: 6653, 20: 8319 },
      },
    },
    {
      id: 'dormitory',
      name: 'Dormitory Housing',
      shortName: '宿舍',
      note: '校方宿舍预算较低，公开资料显示离学校很近，含Wi-Fi、空调、清洁、厨房和基础水电。',
      pricesUsd: {
        'group-4': { 1: 447, 2: 891, 3: 1337, 4: 1781, 8: 3417, 12: 5127, 16: 6690, 20: 8363 },
        'group-5': { 1: 537, 2: 1072, 3: 1608, 4: 2143, 8: 4104, 12: 6800, 16: 8031, 20: 10037 },
      },
    },
    {
      id: 'homestay',
      name: 'Home Stay Housing',
      shortName: '美国家庭',
      note: '住在美国老师家庭，工作日早餐包含；宠物、家庭成员和空位需报名前确认。',
      pricesUsd: {
        'group-4': { 1: 505, 2: 1007, 3: 1508, 4: 2011, 8: 3875, 12: 5815, 16: 7608, 20: 9510 },
        'group-5': { 1: 595, 2: 1188, 3: 1779, 4: 2374, 8: 4563, 12: 6845, 16: 8946, 20: 11184 },
      },
    },
    {
      id: 'outside-stay',
      name: 'Outside Stay Housing',
      shortName: '自住通学',
      note: '学生自行安排住宿，但需要自行承担市内交通并保证每天9:00前到校。',
      pricesUsd: {
        'group-4': { 1: 535, 2: 1069, 3: 1601, 4: 2135, 8: 4122, 12: 6183, 16: 8100, 20: 10124 },
        'group-5': { 1: 625, 2: 1250, 3: 1873, 4: 2497, 8: 4810, 12: 7215, 16: 9437, 20: 11800 },
      },
    },
  ];

  readonly localFees: LocalFee[] = [
    { item: 'Immigration首月预算', amount: 'PHP 11,190', note: '官方移民页列示SSP、ACR-I Card、Express fee和交通费等首月费用。' },
    { item: '2个月累计移民费用', amount: 'PHP 16,850', note: '含第一次签证延长等公开参考费用。' },
    { item: '3个月累计移民费用', amount: 'PHP 27,700', note: '长期学习会增加签证延长、ACR-I Card等费用。' },
    { item: '餐食加购', amount: 'PHP 1,500 / 3,000 / 4,500 每周', note: '工作日1/2/3餐；Home Stay工作日早餐已含，周末和假日餐食不含。' },
    { item: '注册费 / 订金', amount: '总价15%', note: 'Payment Policy说明这是非退款Registration Fee，属于总报价的一部分，不是额外费用。' },
    { item: 'Kids Camp订金', amount: '总价25%', note: 'Kids Camp使用更高订金比例，团体安排需另行报价。' },
    { item: '不含项目', amount: '按实际', note: '餐食、洗衣、市内交通、手机、医疗、旅游活动和购物等不在学习报价内。' },
    { item: '额外住宿日', amount: '按比例', note: '若航班需要提前到或延后离开，ETHOS可按情况加收额外住宿。' },
  ];

  readonly scheduleItems: ScheduleItem[] = [
    {
      time: '08:30',
      title: '学校开放，准备上课',
      text: '学生需在9:00前到校。自住通学学生要特别预留宿务市区交通时间。',
    },
    {
      time: '09:00',
      title: '上午课程开始',
      text: '4小时课程覆盖Pronunciation、Grammar、Conversation和Reading；每节55分钟，中间5分钟休息。',
    },
    {
      time: '12:00',
      title: '午餐时间',
      text: '中午休息1小时。ETHOS提供工作日餐食加购，也可步行到附近餐厅或使用外卖。',
    },
    {
      time: 'After Class',
      title: 'Group学生可预约免费短时辅导',
      text: '官方课程页提到Group Class学生可预约每日课后15分钟Man-to-Man辅导，用来问问题或练习弱项。',
    },
  ];

  readonly faqs: TextCard[] = [
    {
      title: 'ETHOS和CIA怎么选？',
      text: 'CIA是大型综合半斯巴达校区，课程和国籍更多元；ETHOS是小规模American English学校，适合更在意美国老师、小班和Homestay的人。',
    },
    {
      title: '页面报价是否包含所有费用？',
      text: '不是。报价器按ETHOS公开USD套餐价估算课程和所选住宿；菲律宾移民费用、餐食加购、洗衣、市内交通、医疗、活动、机票和保险另计。',
    },
    {
      title: 'Man-to-Man可以报价吗？',
      text: '可以让顾问确认，但ETHOS公开说明Man-to-Man名额有限且费用更高。本页面先用公开Group价格计算，避免把未确认的一对一费用写死。',
    },
    {
      title: '亲子家庭适合ETHOS吗？',
      text: '适合想让家长和孩子一起学习、并接受小规模学校环境的家庭。ETHOS Family English有10岁以上、6-9岁和5岁以下不同安排，但必须按家庭人数确认正式报价。',
    },
  ];

  readonly sideNavItems: SideNavItem[] = [
    { label: '校区亮点', target: 'highlights', icon: 'stars' },
    { label: '课程费用', target: 'courses', icon: 'payments' },
    { label: '快速报价', target: 'quote', icon: 'calculate' },
    { label: '当地费用', target: 'local-fees', icon: 'receipt' },
    { label: '资料来源', target: 'sources', icon: 'link' },
  ];

  readonly mobileAnchors: SideNavItem[] = [
    { label: '图片', target: 'gallery', icon: 'photo_library' },
    { label: '课程', target: 'courses', icon: 'menu_book' },
    { label: '报价', target: 'quote', icon: 'calculate' },
    { label: '费用', target: 'local-fees', icon: 'receipt_long' },
  ];

  readonly sourceLinks: SourceLink[] = [
    { label: 'ETHOS官方首页', url: 'https://ethos.ph/' },
    { label: 'ETHOS Classroom English课程页', url: 'https://ethos.ph/ethos-eng1.html' },
    { label: 'ETHOS当前公开价格页', url: 'https://ethos.ph/prices/ethos-english-with-housing-price.html' },
    { label: 'ETHOS住宿说明', url: 'https://ethos.ph/ethos-eng-house1.html' },
    { label: 'ETHOS移民费用说明', url: 'https://ethos.ph/ethos-imm1.html' },
    { label: 'ETHOS付款政策', url: 'https://ethos.ph/ethos-payments.php' },
    { label: 'ETHOS Family English', url: 'https://ethos.ph/ethos-eng2.html' },
    { label: 'ETHOS Kids Camp FAQ', url: 'https://ethos.ph/ethos-faq-ENG5.html' },
  ];

  get filteredGalleryImages(): GalleryImage[] {
    if (this.selectedGalleryCategory === '全部') {
      return this.galleryImages;
    }

    return this.galleryImages.filter((image) => image.category === this.selectedGalleryCategory);
  }

  get selectedProgram(): ProgramOption {
    return this.programs.find((program) => program.id === this.selectedProgramId) ?? this.programs[0];
  }

  get selectedHousing(): HousingOption {
    return this.housingOptions.find((housing) => housing.id === this.selectedHousingId) ?? this.housingOptions[0];
  }

  get packageUsd(): number {
    return this.selectedHousing.pricesUsd[this.selectedProgramId][this.selectedWeeks];
  }

  get mealPlanPhp(): number {
    return this.includeThreeMealPlan ? this.selectedWeeks * 4500 : 0;
  }

  get quoteUsdText(): string {
    return this.formatUsd(this.packageUsd);
  }

  get mealPlanPhpText(): string {
    return this.formatPhp(this.mealPlanPhp);
  }

  get fourWeekTuitionOnlyText(): string {
    return this.formatUsd(this.housingOptions[0].pricesUsd['group-4'][4]);
  }

  get fourWeekDormText(): string {
    return this.formatUsd(this.housingOptions[1].pricesUsd['group-4'][4]);
  }

  get weeklyAverageText(): string {
    return this.formatUsd(Math.round(this.packageUsd / this.selectedWeeks));
  }

  get quoteNote(): string {
    return 'USD套餐价按ETHOS公开价格表估算；Immigration、餐食加购、洗衣、市内交通、医疗、活动、机票和保险另计。';
  }

  get packageFeeRows() {
    return this.housingOptions.map((housing) => ({
      housing: housing.name,
      note: housing.note,
      group4: this.formatUsd(housing.pricesUsd['group-4'][4]),
      group5: this.formatUsd(housing.pricesUsd['group-5'][4]),
    }));
  }

  setGalleryCategory(category: GalleryCategory): void {
    this.selectedGalleryCategory = category;
  }

  calculateQuote(): void {
    this.quoteCalculated = true;
  }

  scrollToSection(id: string, event?: Event): void {
    event?.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  formatUsd(value: number): string {
    return `USD ${value.toLocaleString('en-US')}`;
  }

  formatPhp(value: number): string {
    return `PHP ${value.toLocaleString('en-US')}`;
  }
}

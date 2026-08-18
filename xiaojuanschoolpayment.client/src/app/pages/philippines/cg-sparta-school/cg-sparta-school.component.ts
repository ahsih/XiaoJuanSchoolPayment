import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

type GalleryCategory = '全部' | '校园' | '教室' | '住宿' | '餐厅' | '设施';
type WeekOption = 3 | 4 | 8 | 12;

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

interface SpecialCourseFee {
  label: string;
  lessons: string;
  four: string;
  note: string;
}

@Component({
  selector: 'app-cg-sparta-school',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './cg-sparta-school.component.html',
  styleUrls: [
    '../cebu-school-detail-layout.css',
    '../cebu-school-detail-content.css',
    '../cebu-school-detail-responsive.css',
    '../ev-school/ev-school-detail.component.css',
    './cg-sparta-school.component.css',
  ],
})
export class CgSpartaSchoolComponent {
  readonly galleryCategories: GalleryCategory[] = [
    '全部',
    '校园',
    '教室',
    '住宿',
    '餐厅',
    '设施',
  ];
  selectedGalleryCategory: GalleryCategory = '全部';

  readonly registrationFee = 100;
  readonly usdToCny = 7.2;
  readonly weekOptions: WeekOption[] = [3, 4, 8, 12];

  selectedCourseId = 'sparta';
  selectedRoomId = 'quad';
  selectedWeeks: WeekOption = 4;
  selectedStartDate = '2026-09-07';
  quoteCalculated = false;

  readonly quickInfo: QuickInfo[] = [
    {
      icon: 'lock_clock',
      label: '学校类型',
      value: '宿务Talisay斯巴达校区',
      note: '平日外出限制、EOP、单词测试、作文和晚自习，适合想被制度推着学的学生',
    },
    {
      icon: 'history_edu',
      label: '学校背景',
      value: '2004年创立，韩资老牌学校',
      note: 'CG Academy有Sparta和Banilad两个校区，本页为Sparta Campus',
    },
    {
      icon: 'schedule',
      label: '学习强度',
      value: '每日最多约12小时学习安排',
      note: '正课、夜间课、词汇/作文和强制自习组成完整学习节奏',
    },
    {
      icon: 'menu_book',
      label: '课程方向',
      value: 'ESL / TOEIC / IELTS / Business / Short-Term',
      note: '普通口语强化、考试备考和1-2周Short-Term ESL都可比较',
    },
    {
      icon: 'bed',
      label: '住宿房型',
      value: '校内1/2/3/4人房 + 外部寮1人房',
      note: '4人房预算最低，外部寮更自由但校规和通勤需单独确认',
    },
    {
      icon: 'pool',
      label: '校区设施',
      value: '泳池 / 健身房 / 篮球场 / 自习室',
      note: '虽然是高强度管理型学校，校内生活设施仍比较完整',
    },
  ];

  readonly galleryImages: GalleryImage[] = [
    {
      category: '校园',
      title: 'CG Sparta校区与泳池',
      description:
        '紫色低层校舍围绕泳池展开，是CG Sparta Campus最有辨识度的校区画面。',
      src: 'https://phl-ryugaku-apa.com/wp-content/uploads/2023/04/School-view-2-scaled-e1685250113690.jpg',
    },
    {
      category: '设施',
      title: '夜间泳池与CG Sparta标识',
      description:
        '平日学习强度高，校内泳池、篮球场、健身房和休息空间成为学生课后放松重点。',
      src: 'https://cebu21.jp/include/schoolno5/cgcebu/Swimming%20pool/008.jpg',
    },
    {
      category: '教室',
      title: '小组教室参考',
      description:
        'Sparta课程包含1:1与1:4小组课，EOP时段帮助学生增加英语输出机会。',
      src: 'https://www.worldplus.com.tw/upload/school/photo/20250626222819175.jpg',
    },
    {
      category: '住宿',
      title: '校内3人房参考',
      description:
        '校内宿舍以学习和生活一体化为主，房内配置床、书桌、收纳和空调。',
      src: 'https://cebu-navi.com/photo/school/132/3cb0d67b0327b4d573d332f7d99ba5a5.jpg',
    },
    {
      category: '住宿',
      title: '校内4人房参考',
      description:
        '4人房是预算型选择，适合希望把费用压低、并接受集体宿舍生活的学生。',
      src: 'https://www.fujiyama-international.com/archives/004/202408/29706f438a34bbf9cff51d7dcd1660c2.jpg',
    },
    {
      category: '餐厅',
      title: 'CG Academy自助餐食',
      description:
        '公开资料列三餐提供，餐食以自助形式为主，最终菜单以学校现场安排为准。',
      src: 'https://cebu21.jp/include/schoolno2/cgcebu/Dining%20room/Dining%20room_4.jpg',
    },
    {
      category: '校园',
      title: 'CG Sparta日间校区',
      description:
        'Talisay校区比市中心更安静，适合想减少外界干扰、集中学习的学生。',
      src: 'https://www.academicworld.co.th/images/2024/12/12/1.jpg',
    },
  ];

  readonly basicInfo: BasicInfoRow[] = [
    { label: '学校名称', value: '菲律宾宿务CG Academy（Sparta Campus）' },
    { label: '英文名称', value: 'CG Academy Sparta Campus / Cebu Globalization Academy' },
    {
      label: '地址',
      value: '1951-A-1 Uldog, Cansojong, Talisay City, Cebu, Philippines',
    },
    { label: '学校定位', value: '宿务斯巴达型英语学校，主打高强度ESL、TOEIC、IELTS和商务英语' },
    { label: '学生规模', value: '公开资料显示约150-152名学生容量，国籍比例按月份变化' },
    { label: '课程方向', value: 'Sparta、Premier Sparta、TOEIC、IELTS Basic / Intensive / Guarantee、Business、Short-Term ESL' },
    { label: '住宿房型', value: '校内1人房、2人房、3人房、4人房；另有M&J Pension外部寮1人房参考' },
    { label: '4周起价', value: 'USD 1,550起：Sparta Course + 校内4人房 + 注册费；3周按4周主费的85%计算' },
  ];

  readonly highlights: Highlight[] = [
    {
      image:
        'https://phl-ryugaku-apa.com/wp-content/uploads/2023/04/School-view-2-scaled-e1685250113690.jpg',
      title: '宿务少见的斯巴达专门校',
      text: '平日外出限制、EOP、单词测试、作文和强制自习，适合目标明确、需要环境约束的人。',
    },
    {
      image:
        'https://www.worldplus.com.tw/upload/school/photo/20250626222819175.jpg',
      title: '1:1与1:4小班结合',
      text: '标准Sparta为1:1四节加1:4四节，Premier Sparta则把一节小组课换成一对一。',
    },
    {
      image:
        'https://cebu21.jp/include/schoolno5/cgcebu/Swimming%20pool/008.jpg',
      title: '学习之外有校内设施',
      text: '泳池、健身房、篮球场、桌球室、卖店、自习室等设施，补足平日不能外出的生活需求。',
    },
    {
      image:
        'https://cebu21.jp/include/schoolno2/cgcebu/Dining%20room/Dining%20room_4.jpg',
      title: '三餐与宿舍一体',
      text: '课程、住宿、三餐都在校区内完成，减少通勤和生活分心，更适合集中式学习。',
    },
  ];

  readonly suitableFor: FitItem[] = [
    {
      title: '自律不足但目标明确',
      text: '如果你知道自己想提高英语，却担心在宿务容易玩散，CG Sparta的制度会更有推动力。',
    },
    {
      title: '想做TOEIC或IELTS备考',
      text: 'TOEIC、IELTS Basic、IELTS Intensive和IELTS Guarantee都有明确课表和模考安排。',
    },
    {
      title: '中长期3-6个月学习',
      text: '公开资料中CG Sparta常被定位为适合认真长期学习的校区，长周期也有公开长期折扣。',
    },
    {
      title: '想要校内设施完整的管理型学校',
      text: '虽然管理严格，但泳池、健身房、篮球场、卖店、自习室和三餐配置完整。',
    },
  ];

  readonly notSuitableFor: FitItem[] = [
    {
      title: '想平日自由外出',
      text: 'Sparta Campus平日外出限制严格；如果想更多自由，可比较CG Banilad、CELLA Premium或I.BREEZE。',
    },
    {
      title: '只想度假式轻松学习',
      text: 'CG Sparta主轴是高强度学习，不适合只想轻量课程、海边环境或每天外出体验的人。',
    },
    {
      title: '无法接受晚间测试和自习',
      text: '单词测试、作文和强制自习是学校学习节奏的重要部分，报名之前要先确认自己能配合。',
    },
    {
      title: '未成年学生单独行动需求高',
      text: '未成年学生外出和门禁限制更严格，家庭需要提前确认校规、监护安排和活动范围。',
    },
  ];

  readonly roomOptions: RoomOption[] = [
    { id: 'quad', name: '校内4人房', note: '预算最低，适合能接受集体住宿的人。' },
    { id: 'triple', name: '校内3人房', note: '比4人房更舒适，费用仍相对可控。' },
    { id: 'twin', name: '校内2人房', note: '隐私和预算较平衡。' },
    { id: 'single', name: '校内1人房', note: '最安静，但热门档期需尽早确认。' },
    { id: 'external-single', name: '外部寮1人房', note: 'M&J Pension参考，通勤、空房和校规需单独确认。' },
  ];

  readonly courseOptions: CourseOption[] = [
    {
      id: 'sparta',
      name: 'Sparta Course',
      type: '标准斯巴达ESL',
      lessons: '1:1四节 + 1:4四节 + 夜间课/自习 + 单词作文 + 强制自习',
      suitable: '适合想用高强度课表提升口语、听力、阅读和写作基础的学生。',
      fourWeekFees: { quad: 1450, triple: 1500, twin: 1550, single: 1700, 'external-single': 2000 },
    },
    {
      id: 'premier-sparta',
      name: 'Premier Sparta Course',
      type: '一对一加量ESL',
      lessons: '1:1五节 + 1:4三节 + 夜间课/自习 + 单词作文 + 强制自习',
      suitable: '适合想比标准Sparta多一节一对一反馈的人。',
      fourWeekFees: { quad: 1500, triple: 1550, twin: 1600, single: 1750, 'external-single': 2050 },
    },
    {
      id: 'toeic-sparta',
      name: 'TOEIC Sparta Course',
      type: 'TOEIC备考',
      lessons: 'TOEIC 1:1二节 + ESL 1:1二节 + TOEIC/ESL小组四节',
      suitable: '适合想兼顾TOEIC分数和一般英语基础的学生。',
      fourWeekFees: { quad: 1500, triple: 1550, twin: 1600, single: 1750, 'external-single': 2050 },
    },
    {
      id: 'toeic-premier',
      name: 'TOEIC Premier Sparta',
      type: 'TOEIC强化',
      lessons: 'TOEIC 1:1三节 + ESL 1:1二节 + 小组三节 + 双周模考',
      suitable: '适合TOEIC目标更明确、希望增加一对一备考比例的人。',
      fourWeekFees: { quad: 1550, triple: 1600, twin: 1650, single: 1800, 'external-single': 2100 },
    },
    {
      id: 'ielts-basic',
      name: 'IELTS Basic Course',
      type: 'IELTS入门',
      lessons: 'IELTS/ESL 1:1四节 + 1:4四节 + IELTS词汇 + 强制自习',
      suitable: '适合未达到保证班门槛、想先熟悉IELTS题型的人。',
      fourWeekFees: { quad: 1500, triple: 1550, twin: 1600, single: 1750, 'external-single': 2050 },
    },
    {
      id: 'ielts-guarantee',
      name: 'IELTS Guarantee',
      type: 'IELTS保证班',
      lessons: 'IELTS 1:1四节 + IELTS小组四节 + IELTS思维课 + 词汇 + 自习',
      suitable: '适合达到入学门槛、需要保证班学习规则推动的学生。',
      fourWeekFees: { quad: 1750, triple: 1800, twin: 1850, single: 2000, 'external-single': 2300 },
    },
    {
      id: 'ielts-intensive',
      name: 'IELTS Intensive Course',
      type: 'IELTS密集',
      lessons: 'IELTS 1:1四节 + IELTS小组四节 + 每周模考 + 强制自习',
      suitable: '适合有明确IELTS分数需求、想集中冲刺听说读写的人。',
      fourWeekFees: { quad: 1600, triple: 1650, twin: 1700, single: 1850, 'external-single': 2150 },
    },
    {
      id: 'business-english',
      name: 'Business English',
      type: '商务英语',
      lessons: '1:1四节 + 1:4四节 + 夜间课/自习 + 单词测试 + 自习',
      suitable: '适合需要会议、简报、面试和职场沟通英语的学生，4周起报。',
      fourWeekFees: { quad: 1500, triple: 1550, twin: 1600, single: 1750, 'external-single': 2050 },
    },
  ];

  readonly specialFees: SpecialCourseFee[] = [
    { label: 'Short-Term ESL', lessons: 'Sparta与Banilad两校区均适用，短期课表需按校区确认', four: '1周学费USD 370 / 2周学费USD 640', note: '注册费、住宿费和当地费用另计；普通课程3周按4周主费的85%计算' },
  ];

  readonly schedule: ScheduleItem[] = [
    {
      time: '07:00 - 08:00',
      title: '早餐 / 课前准备',
      text: '住校学生在校内用餐，周末和假日早餐时间可能调整。',
    },
    {
      time: '08:00 - 16:55',
      title: '正课时段 + EOP',
      text: '一对一、小组课或空堂穿插进行，公开资料列8:00-17:00适用英语限定政策。',
    },
    {
      time: '17:05 - 17:50',
      title: 'Evening Class',
      text: '可安排Grammar、TOEIC Listening、IELTS Listening或Self Study等内容。',
    },
    {
      time: '17:50 - 19:00',
      title: '晚餐 / 短暂休息',
      text: '平日通常不能自由外出，校内设施和卖店会成为主要生活补给。',
    },
    {
      time: '19:00 - 20:00',
      title: 'Vocabulary Test & Essay',
      text: '词汇测试与作文训练帮助学生形成每日复习和输出习惯。',
    },
    {
      time: '20:10 - 22:00',
      title: 'Mandatory Self Study',
      text: '在指定座位自习，复习当天课程并准备次日内容。',
    },
  ];

  readonly localFees: LocalFee[] = [
    { item: '注册费', amount: 'USD 100', note: '出发前支付，不退费，通常不含在课程住宿套餐内' },
    { item: '高峰期加价', amount: 'USD 40 / 周', note: '公开资料列2026年7月4日-8月28日旺季加价参考' },
    { item: 'SSP', amount: 'PHP 7,800', note: 'Special Study Permit，所有学习周期均需确认' },
    { item: 'SSP E-Card', amount: 'PHP 4,500', note: '公开当地费用表列为ACR E-Card(SSP)' },
    { item: '签证延长', amount: 'PHP 5,160起', note: '5-8周起产生延签；9-12周约PHP 11,550参考' },
    { item: 'ACR I-Card', amount: 'PHP 4,500', note: '长周期学习通常需确认，费用以当地政策为准' },
    { item: '宿舍押金', amount: 'PHP 250 / 周', note: '4周约PHP 1,000，离校结算后按规则退还' },
    { item: '维护费', amount: 'PHP 500 / 周', note: '4周约PHP 2,000' },
    { item: '公共电费', amount: 'PHP 500 / 周', note: '不含冷气；A/C用量公开参考PHP 25/KWH' },
    { item: '水费', amount: 'PHP 125 / 周', note: '4周约PHP 500' },
    { item: '教材费', amount: 'PHP 250-450 / 册', note: '按课程、级别和用书数量变化' },
    { item: '机场接机', amount: 'PHP 1,200', note: '机场送机公开参考PHP 2,000，需按学校安排确认' },
  ];

  readonly serviceSteps: ProcessStep[] = [
    {
      icon: 'person_search',
      title: '先判断能否接受斯巴达',
      text: '确认平日外出限制、晚间测试、自习、EOP和门禁是否符合你的学习状态。',
    },
    {
      icon: 'school',
      title: '匹配课程和周期',
      text: '根据ESL、TOEIC、IELTS、Business或Short-Term目标，确认适合的课程和最短周期。',
    },
    {
      icon: 'bed',
      title: '确认房型和空位',
      text: '按性别、入学日、房型和预算核对校内1/2/3/4人房或外部寮。',
    },
    {
      icon: 'payments',
      title: '拆清前期与当地费用',
      text: '把课程住宿、注册费、旺季费、SSP、签证、押金、水电和教材逐项列清。',
    },
    {
      icon: 'assignment_turned_in',
      title: '整理出发前资料',
      text: '协助准备护照、保险、eTravel、接机、现金和到校费用清单。',
    },
    {
      icon: 'support_agent',
      title: '到校后持续跟进',
      text: '如遇课程、宿舍、校规或账单疑问，可继续联系顾问协助沟通。',
    },
  ];

  readonly sidaReasons: SidaReason[] = [
    {
      number: '01',
      title: '先确认你是否适合高强度',
      text: 'CG Sparta不是轻松度假型学校，顾问会先帮你判断学习目标和可承受度。',
      image: 'assets/cia/sida-why-action-selection.jpg',
      alt: '思达启航顾问帮助学生选择菲律宾宿务语言学校',
    },
    {
      number: '02',
      title: '课程差异逐项讲清',
      text: 'Sparta、Premier、TOEIC、IELTS、Business和Short-Term ESL的课表不同，不能只看价格。',
      image: 'assets/cia/sida-why-action-fees.jpg',
      alt: '思达启航顾问核算菲律宾语言学校费用',
    },
    {
      number: '03',
      title: '当地费用提前算清',
      text: 'SSP、签证、押金、水电、教材、接机和冷气电费需要提前准备现金。',
      image: 'assets/cia/sida-why-action-contract.jpg',
      alt: '思达启航顾问核验菲律宾游学课程和合同文件',
    },
    {
      number: '04',
      title: '校规与行前提醒',
      text: '平日外出、门禁、EOP、旅行保险、周末外宿规则会在出发前提醒学生。',
      image: 'assets/cia/sida-why-action-departure.jpg',
      alt: '菲律宾游学出发前文件和行李准备',
    },
    {
      number: '05',
      title: '学习中仍可沟通',
      text: '如果课程强度、老师、宿舍或费用结算有疑问，可让顾问协助梳理重点。',
      image: 'assets/cia/sida-why-action-followup.jpg',
      alt: '思达启航顾问持续跟进学生学习情况',
    },
    {
      number: '06',
      title: '国内顾问 + 宿务驻点',
      text: '国内咨询和宿务当地支持配合，适合第一次去菲律宾游学的学生。',
      image: 'assets/cia/sida-why-action-team.jpg',
      alt: '思达启航宿务和深圳服务团队',
    },
  ];

  readonly sidaTrustBadges: SidaTrustBadge[] = [
    { icon: 'rule', label: '斯巴达校规先确认' },
    { icon: 'description', label: '正式报价逐项核验' },
    { icon: 'payments', label: '当地费用分开算' },
    { icon: 'apartment', label: '深圳总部 + 宿务驻点' },
  ];

  readonly schoolServices = [
    '机场接机',
    '入学测试',
    '一对一课程',
    '1:4小组课',
    'Evening Class',
    '单词测试',
    '作文训练',
    '强制自习',
    '三餐',
    '校内宿舍',
    '泳池',
    '健身房',
    '篮球场',
    '自习室',
    '卖店',
    'Wi-Fi',
  ];
  readonly campusActivities = [
    '月度水平测试',
    'TOEIC / IELTS模拟考',
    'Vocabulary Test',
    'Essay Correction',
    'EOP训练',
    '毕业式与校内活动',
  ];
  readonly weekendActivities = [
    'SM Seaside',
    'Ayala Mall',
    'Bohol',
    'Moalboal',
    'Kawasan Falls',
    'Island Hopping',
  ];
  readonly notes = [
    '本页费用使用2026公开参考价；正式报价会按学校当期价格、入学日期、房型和优惠调整。',
    '课程住宿套餐通常不含注册费、旺季费、SSP、签证、押金、教材、水电、接机和个人生活费。',
    'Sparta Campus平日外出限制严格，报名之前一定要确认自己是否能接受校规。',
    'IELTS Guarantee、Business和Short-Term ESL有周期、入学门槛或开课规则限制，需要单独确认。',
    '如果想要市区自由生活，可同步比较CG Banilad、CELLA Premium、I.BREEZE或其他半斯巴达学校。',
  ];
  readonly faqs: FaqItem[] = [
    {
      question: 'CG Sparta和CIA最大的区别是什么？',
      answer:
        'CIA更偏Mactan综合型半斯巴达新校区；CG Sparta在Talisay，重点是严格管理、平日外出限制、EOP、单词作文和强制自习，更适合想集中学习的人。',
    },
    {
      question: '页面上的报价包含全部费用吗？',
      answer:
        '不包含全部。报价器主要估算课程住宿套餐和注册费；SSP、签证、押金、公共电费、冷气电费、教材、接机、旺季加价和个人生活费仍需另行确认。',
    },
    {
      question: 'CG Sparta适合短期一两周吗？',
      answer:
        '可以考虑Short-Term ESL：1周学费USD 370，2周学费USD 640；注册费、住宿、开课规则和假日安排要报名前确认。',
    },
    {
      question: 'CG Sparta适合IELTS吗？',
      answer:
        '适合列入候选。IELTS Basic适合入门，IELTS Intensive适合密集备考，IELTS Guarantee通常为12周并有入学分数门槛。',
    },
    {
      question: '平日真的不能外出吗？',
      answer:
        '公开资料列Sparta Campus平日外出限制严格，通常周五课后和周末才可外出，门禁和外宿规则以学校当期说明为准。',
    },
  ];
  readonly sideNav: SideNavItem[] = [
    { label: '学校环境', target: 'gallery', icon: 'image' },
    { label: '课程与费用', target: 'course-fees', icon: 'menu_book' },
    { label: '费用快速报价', target: 'quote', icon: 'calculate' },
    { label: '特殊课程', target: 'special-fees', icon: 'bolt' },
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
    { label: 'CG Academy官网', url: 'https://www.cebucg.com/en/' },
    { label: 'CG Academy 2026英文宣传册', url: 'https://www.cebucg.com/en/pdf/01.pdf' },
    { label: 'CG Sparta 2026官方价格表', url: 'https://cebucg.com/kr/pdf/07.pdf' },
    { label: 'CG Academy官方当地费用表', url: 'https://cebucg.com/kr/pdf/06.pdf' },
    { label: 'Fujiyama CG Sparta 2026费用', url: 'https://www.fujiyama-international.com/philippines/cg-esl-center.html' },
    { label: '澳贝客CG Sparta中文费用', url: 'https://www.ioutback.com/study-abroad/philippines/SCHOOL/cg_detail' },
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

    return fourWeekFee * this.durationMultiplier(weeks);
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
    return '公开资料列2026年7月4日-8月28日可能加收USD 40/周，正式以学校报价为准';
  }

  formatUsd(value: number): string {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: Number.isInteger(value) ? 0 : 1,
      maximumFractionDigits: 1,
    });
  }

  private durationMultiplier(weeks: WeekOption): number {
    const multiplier: Record<WeekOption, number> = {
      3: 0.85,
      4: 1,
      8: 2,
      12: 3,
    };

    return multiplier[weeks];
  }
}

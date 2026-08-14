import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

type GalleryCategory = '全部' | '校园' | '教室' | '住宿' | '餐厅' | '设施';

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

interface CourseItem {
  name: string;
  type: string;
  lessons: string;
  suitable: string;
}

interface CourseOption {
  id: string;
  name: string;
  lessons: string;
  suitable: string;
}

interface RoomOption {
  id: string;
  name: string;
  note: string;
}

interface PackageFee {
  courseId: string;
  roomId: string;
  fee: number;
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

@Component({
  selector: 'app-genius-school',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './genius-school.component.html',
  styleUrls: [
    '../cebu-school-detail-layout.css',
    '../cebu-school-detail-content.css',
    '../cebu-school-detail-responsive.css',
    '../ev-school/ev-school-detail.component.css',
  ],
})
export class GeniusSchoolComponent {
  readonly galleryCategories: GalleryCategory[] = [
    '全部',
    '校园',
    '教室',
    '住宿',
    '餐厅',
    '设施',
  ];
  selectedGalleryCategory: GalleryCategory = '全部';

  readonly registrationFee = 125;
  readonly discount = 1;
  readonly usdToCny = 7.2;
  readonly weekOptions = [4, 8, 12, 16, 20, 24];

  selectedCourseId = 'general-english-a';
  selectedRoomId = 'triple';
  selectedWeeks = 4;
  selectedStartDate = '2026-09-07';
  quoteCalculated = false;

  readonly quickInfo: QuickInfo[] = [
    {
      icon: 'beach_access',
      label: '学校类型',
      value: 'Mactan海边度假型语言学校',
      note: '位于EGI Hotel / Resort区域，学习、住宿和海边生活在同一区域',
    },
    {
      icon: 'groups',
      label: '适合人群',
      value: '成人 / 亲子 / 口语 / 考试 / 商务',
      note: '适合想要多国籍环境、Native group class和舒适住宿的学生',
    },
    {
      icon: 'rule',
      label: '管理模式',
      value: 'Non-Sparta / Semi-Sparta / Sparta',
      note: '可按自律程度选择学习管理强度，Sparta规则需报名前确认',
    },
    {
      icon: 'school',
      label: '课程方向',
      value: 'ESL / IELTS / TOEIC / TOEFL / Business',
      note: '另有Power Speaking、Survival English、Family和IELTS Guarantee',
    },
    {
      icon: 'bed',
      label: '住宿房型',
      value: '单人 / 双人 / 三人 / 家庭房',
      note: '房间通常带厨房、冰箱、空调、Wi-Fi、阳台和冷热水淋浴',
    },
    {
      icon: 'public',
      label: '学生氛围',
      value: '国际化学生比例',
      note: '公开资料强调亚洲、中东、欧洲等多国籍学生环境',
    },
  ];

  readonly galleryImages: GalleryImage[] = [
    {
      category: '校园',
      title: 'EGI度假区泳池',
      description:
        'Genius位于Mactan海边度假区，泳池和海边设施是学校生活的重要卖点。',
      src: 'https://cebu-navi.com/photo/school/24/c0db828e2ab95ccc3199fa2614e5fa9f.jpg',
    },
    {
      category: '校园',
      title: 'EGI Hotel海边环境',
      description:
        '学校位于Lapu-Lapu City Maribago一带，适合想兼顾海边生活和学习的人。',
      src: 'https://cebu-navi.com/photo/school/24/2205c86f6ae1a6aa3b1051a9fa9222a6.jpg',
    },
    {
      category: '住宿',
      title: '海景宿舍房间',
      description:
        'Sea View / Deluxe房型需额外确认费用和空房，热门档期建议提前锁定。',
      src: 'https://cebu-navi.com/photo/school/24/8f81027c4a546db86daa59542946bd9b.jpg',
    },
    {
      category: '住宿',
      title: '双人房参考',
      description:
        '公开资料显示住宿有Regular、Sea View和Deluxe等选择，房型会直接影响预算。',
      src: 'https://cebu-navi.com/photo/school/24/f8cf63f6c9a67610704e621b3dff0430.jpg',
    },
    {
      category: '教室',
      title: '小组课教室',
      description:
        'Genius课程常见配置为菲律宾老师一对一课加Native group class。',
      src: 'https://cebu-navi.com/photo/school/24/bf8be56869efc6f38f9e922620c2aef7.JPG',
    },
    {
      category: '教室',
      title: '一对一教室参考',
      description:
        '官方资料强调教室干净、明亮、宽敞，并配有独立空调。',
      src: 'https://cebu-navi.com/photo/school/24/74afb08cb43a371acbcb743f87b54a43.jpg',
    },
    {
      category: '餐厅',
      title: '餐厅与三餐',
      description:
        '公开资料列出每日三餐，适合希望长期生活安排稳定的学生和家庭。',
      src: 'https://cebu-navi.com/photo/school/24/9c0db8a7ed504426ec9fbf060effed4b.jpg',
    },
    {
      category: '设施',
      title: '泳池与公共设施',
      description:
        '学生可使用度假区相关设施，包含泳池、海边、健身和休闲空间。',
      src: 'https://cebu-navi.com/photo/school/24/5e15d49dd0d2c26a1ccdae658231bf48.jpg',
    },
  ];

  readonly basicInfo: BasicInfoRow[] = [
    { label: '学校名称', value: '菲律宾宿务Genius English Academy语言学校' },
    {
      label: '英文名称',
      value: 'Genius English Proficiency Academy',
    },
    {
      label: '所在地区',
      value: 'EGI Hotel Bldg. 1, Looc, Maribago, Lapu-Lapu City, Cebu',
    },
    { label: '创校时间', value: '公开资料列出为2013年' },
    { label: '学生规模', value: '公开资料参考约150名学生' },
    {
      label: '学校定位',
      value: 'Mactan海边度假型、多国籍、综合英语与考试/商务/亲子课程学校',
    },
    {
      label: '管理模式',
      value: 'Non-Sparta、Semi-Sparta、Sparta可比较，平日外出和自习规则不同',
    },
    {
      label: '费用参考',
      value: '2026公开淡季参考：General English A三人房USD 1,400/4周起，注册费USD 125',
    },
  ];

  readonly highlights: Highlight[] = [
    {
      image:
        'https://cebu-navi.com/photo/school/24/c0db828e2ab95ccc3199fa2614e5fa9f.jpg',
      title: '海边度假感强，生活舒适度高',
      text: '学校位于Mactan海边EGI度假区，适合希望住宿、泳池、海边和学习放在同一生活圈里的学生。',
    },
    {
      image:
        'https://cebu-navi.com/photo/school/24/bf8be56869efc6f38f9e922620c2aef7.JPG',
      title: '一对一 + Native group class',
      text: '常见课程将菲律宾老师一对一课与外籍老师小组课结合，适合想提升口语自然度和跨文化表达的人。',
    },
    {
      image:
        'https://cebu-navi.com/photo/school/24/8f81027c4a546db86daa59542946bd9b.jpg',
      title: '酒店式房间，适合成人和家庭',
      text: '房间带阳台、厨房、冰箱、空调和Wi-Fi的配置，对亲子、长期和重视住宿体验的学生更友好。',
    },
    {
      image:
        'https://cebu-navi.com/photo/school/24/5e15d49dd0d2c26a1ccdae658231bf48.jpg',
      title: '学习强度可按目标调整',
      text: '从Non-Sparta到Sparta都可讨论，想自由一点或想要更多监督的学生可以分别匹配不同规则。',
    },
  ];

  readonly suitableFor: FitItem[] = [
    {
      title: '想在海边度假环境里认真学英语',
      text: 'Genius不是纯市区楼宇型学校，海边、泳池和酒店式住宿会让整体体验更轻松。',
    },
    {
      title: '重视多国籍学生环境',
      text: '公开资料强调学生来源较国际化，适合希望练习跨文化沟通和英文社交的人。',
    },
    {
      title: '想要Native group class',
      text: '常规课程通常包含外籍老师小组课，适合想改善表达自然度、发音和讨论能力的成人学生。',
    },
    {
      title: '成人、亲子或商务/考试方向都想保留弹性',
      text: 'ESL、Power Speaking、Survival、IELTS、TOEIC、TOEFL、Business和Family都可以作为比较方向。',
    },
  ];

  readonly notSuitableFor: FitItem[] = [
    {
      title: '只想找最低预算学校',
      text: 'Genius的住宿和度假区配置是卖点之一，若预算优先，建议同时比较宿务市区或碧瑶学校。',
    },
    {
      title: '需要极强封闭式学习氛围',
      text: '虽然可选Sparta规则，但学校整体仍偏海边度假型；若目标是高压备考，可同时比较CIA、SMEAG、EV、CPILS。',
    },
    {
      title: '临近出发才指定Sea View或单人房',
      text: '海景、Deluxe和单人房容易受档期影响，旺季和家庭房建议提前确认空房。',
    },
    {
      title: '费用只看4周学费住宿套餐',
      text: 'SSP、SSP E-Card、管理费、教材费、押金、签证延长、接机和洗衣等到校费用也要一起预算。',
    },
  ];

  readonly courses: CourseItem[] = [
    {
      name: 'General English A / B',
      type: '综合英语',
      lessons: 'A：4节菲律宾老师1:1 + 2节小组；B：6节菲律宾老师1:1 + 2节小组',
      suitable: '适合日常口语、听力、阅读、写作和语法整体提升，B更适合短期高密度学习。',
    },
    {
      name: 'Power Speaking A / B',
      type: '口语强化',
      lessons: '按A/B强度增加输出训练，重点放在表达、演讲、面试和实际沟通。',
      suitable: '适合以开口表达、发音、反应速度和自信心为第一目标的成人学生。',
    },
    {
      name: 'Survival English A / B',
      type: '生活场景英语',
      lessons: '除校内课程外，公开资料提到会结合超市、咖啡厅、药店等真实场景练习。',
      suitable: '适合出国生活、旅行、打工度假或想把英语用于具体场景的人。',
    },
    {
      name: 'IELTS / IELTS Guarantee',
      type: '雅思备考',
      lessons: '常规IELTS A/B可选；IELTS Guarantee公开资料列为12周起。',
      suitable: '适合有目标分数、升学或移民规划，并愿意接受更明确学习节奏的学生。',
    },
    {
      name: 'TOEIC / TOEFL',
      type: '考试英语',
      lessons: '按A/B强度匹配一对一和小组课，重点训练题型、词汇、听读写说。',
      suitable: '适合求职、升学、交换、海外课程准备或需要考试成绩证明的人。',
    },
    {
      name: 'Business English',
      type: '商务英语',
      lessons: '会议、邮件、演示、面试和职场沟通等方向可按需求调整。',
      suitable: '适合职场人士、企业培训、转岗面试和商务交流需求。',
    },
    {
      name: 'Family Program',
      type: '亲子课程',
      lessons: 'Family Kids和Parents课程分开设计，儿童课可包含英语、艺术或音乐方向。',
      suitable: '适合家长陪读、亲子游学和希望住得更舒适的家庭。',
    },
  ];

  readonly courseOptions: CourseOption[] = [
    {
      id: 'general-english-a',
      name: 'General English A / Power Speaking A',
      lessons: '4节1:1 + 2节小组课',
      suitable: '淡季公开参考价最低的主线课程，适合稳步提升。',
    },
    {
      id: 'general-english-b',
      name: 'General English B / Power Speaking B',
      lessons: '6节1:1 + 2节小组课',
      suitable: '适合短期想增加一对一课量的学生。',
    },
    {
      id: 'survival-english-a',
      name: 'Survival English A',
      lessons: '场景英语A强度',
      suitable: '适合旅行、生活和真实场景表达。',
    },
    {
      id: 'survival-english-b',
      name: 'Survival English B',
      lessons: '场景英语B强度',
      suitable: '适合想把场景练习和高课量结合的人。',
    },
    {
      id: 'business-exam-a',
      name: 'Business / IELTS / TOEIC / TOEFL A',
      lessons: '考试或商务A强度',
      suitable: '适合考试入门、商务英语和目标导向学习。',
    },
    {
      id: 'business-exam-b',
      name: 'Business / IELTS / TOEIC / TOEFL B',
      lessons: '考试或商务B强度',
      suitable: '适合更高强度考试或商务训练。',
    },
  ];

  readonly roomOptions: RoomOption[] = [
    {
      id: 'triple',
      name: '三人房',
      note: '淡季参考价最低，适合控制预算。',
    },
    {
      id: 'twin',
      name: '双人房',
      note: '预算和生活空间比较平衡。',
    },
    {
      id: 'single',
      name: '单人房',
      note: '隐私最好，长期学习或热门档期需尽早确认。',
    },
  ];

  readonly packageFees: PackageFee[] = [
    { courseId: 'general-english-a', roomId: 'single', fee: 1750 },
    { courseId: 'general-english-a', roomId: 'twin', fee: 1550 },
    { courseId: 'general-english-a', roomId: 'triple', fee: 1400 },
    { courseId: 'general-english-b', roomId: 'single', fee: 2000 },
    { courseId: 'general-english-b', roomId: 'twin', fee: 1800 },
    { courseId: 'general-english-b', roomId: 'triple', fee: 1650 },
    { courseId: 'survival-english-a', roomId: 'single', fee: 1800 },
    { courseId: 'survival-english-a', roomId: 'twin', fee: 1600 },
    { courseId: 'survival-english-a', roomId: 'triple', fee: 1450 },
    { courseId: 'survival-english-b', roomId: 'single', fee: 2050 },
    { courseId: 'survival-english-b', roomId: 'twin', fee: 1850 },
    { courseId: 'survival-english-b', roomId: 'triple', fee: 1700 },
    { courseId: 'business-exam-a', roomId: 'single', fee: 2050 },
    { courseId: 'business-exam-a', roomId: 'twin', fee: 1850 },
    { courseId: 'business-exam-a', roomId: 'triple', fee: 1700 },
    { courseId: 'business-exam-b', roomId: 'single', fee: 2300 },
    { courseId: 'business-exam-b', roomId: 'twin', fee: 2100 },
    { courseId: 'business-exam-b', roomId: 'triple', fee: 1950 },
  ];

  readonly schedule: ScheduleItem[] = [
    {
      time: '07:00 - 09:00',
      title: '早餐 / 单词测试',
      text: '公开日程参考中早餐约7:00-9:00，Semi-Sparta或Sparta学生可能有早间单词测试。',
    },
    {
      time: '08:00 - 12:00',
      title: '上午一对一与小组课',
      text: '按课程安排进入菲律宾老师一对一课、Native group class或科目训练。',
    },
    {
      time: '12:00 - 13:00',
      title: '午餐与短休',
      text: '长期学习时，三餐和休息节奏会明显影响状态。',
    },
    {
      time: '13:00 - 16:50',
      title: '下午课程 / 额外小组课',
      text: '下午继续课程、强化训练或按课程安排进行场景英语、考试和商务任务。',
    },
    {
      time: '17:00 - 18:00',
      title: '晚餐',
      text: '校内/度假区生活安排相对集中，适合不想每天外出解决餐食的学生。',
    },
    {
      time: '18:00以后',
      title: '自由时间或强制自习',
      text: 'Non-Sparta更自由；Semi-Sparta和Sparta会有外出、自习、测试和门禁规则。',
    },
  ];

  readonly localFees: LocalFee[] = [
    { item: '注册费', amount: 'USD 125', note: '通常为报名时前期支付' },
    { item: 'SSP', amount: 'PHP 7,800', note: '特别学习许可，到校后按学校规则支付' },
    { item: 'SSP E-Card', amount: 'PHP 4,000', note: '菲律宾学习许可相关卡费' },
    { item: 'ACR I-Card', amount: 'PHP 4,000', note: '超过8周等长周期学习通常需要确认' },
    { item: '管理费', amount: 'USD 40 / 4周', note: '按学习周数计算' },
    { item: '教材费', amount: 'USD 40 / 4周', note: '实际教材以课程和级别为准' },
    { item: 'Sea View / Deluxe加价', amount: 'USD 125 / 4周', note: '仅选择对应房型时适用' },
    { item: 'Semi-Sparta附加费', amount: 'USD 50 / 4周', note: '选择Semi-Sparta规则时适用' },
    { item: 'Sparta附加费', amount: 'USD 70 / 4周', note: '选择Sparta规则时适用' },
    { item: '机场接机', amount: 'PHP 1,000', note: '宿务机场接机参考' },
    { item: '洗衣费', amount: 'PHP 1,200', note: '公开资料参考，实际以学校为准' },
    { item: '宿舍押金', amount: 'USD 100', note: '退房检查后按规则退还' },
    { item: '电费', amount: 'PHP 18 / kWh', note: '按实际使用量计算' },
    { item: '签证延长', amount: '按周数', note: '5周以上通常需要按停留时间确认' },
  ];

  readonly serviceSteps: ProcessStep[] = [
    {
      icon: 'person_search',
      title: '先判断Genius是否适合',
      text: '根据目标、预算、房型、管理强度、是否需要海边住宿和Native group class做初筛。',
    },
    {
      icon: 'fact_check',
      title: '确认课程与档期',
      text: '免费协助核对General、Power Speaking、Survival、IELTS、Business或Family课程空位。',
    },
    {
      icon: 'payments',
      title: '拆清前期和到校费用',
      text: '把课程住宿套餐、注册费、SSP、教材、管理费、押金、接机和签证延长分开列清。',
    },
    {
      icon: 'assignment_turned_in',
      title: '准备入学和出发文件',
      text: '按顾问指引准备护照、入学文件、eTravel、接机、保险和到校现金清单。',
    },
    {
      icon: 'support_agent',
      title: '到校后继续跟进',
      text: '如需沟通课程、老师、宿舍或账单问题，可继续联系顾问协助整理重点。',
    },
    {
      icon: 'location_on',
      title: '宿务当地支持',
      text: '思达在宿务有工作人员驻点，可按情况提供当地支持和沟通协助。',
    },
  ];

  readonly sidaReasons: SidaReason[] = [
    {
      number: '01',
      title: '先判断度假型学校是否匹配',
      text: 'Genius优势在海边住宿、多国籍和课程弹性，先看它是否真的符合你的目标。',
      image: 'assets/cia/sida-why-action-selection.jpg',
      alt: '思达启航顾问帮助学生选择适合的菲律宾宿务语言学校',
    },
    {
      number: '02',
      title: '费用按淡旺季和房型拆开',
      text: '淡季、旺季、Sea View、Deluxe、Sparta附加费和当地费用需要逐项核对。',
      image: 'assets/cia/sida-why-action-fees.jpg',
      alt: '思达启航顾问为学生核算菲律宾语言学校费用',
    },
    {
      number: '03',
      title: '课程强度提前说清楚',
      text: 'A/B课程、考试课程、Family课程和Sparta规则都会影响每天学习节奏。',
      image: 'assets/cia/sida-why-action-contract.jpg',
      alt: '思达启航顾问核验菲律宾游学课程和合同文件',
    },
    {
      number: '04',
      title: '出发前清单更完整',
      text: '接机、现金、签证延长、住宿用品、保险和到校费用会提前整理给学生。',
      image: 'assets/cia/sida-why-action-departure.jpg',
      alt: '菲律宾游学出发前文件和行李准备',
    },
    {
      number: '05',
      title: '学习中仍可继续沟通',
      text: '遇到课程、老师、宿舍、账单或规则疑问时，可让顾问帮忙梳理沟通方式。',
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
    { icon: 'verified_user', label: '课程规则提前确认' },
    { icon: 'payments', label: '费用透明无隐藏项' },
    { icon: 'apartment', label: '深圳总部 + 宿务驻点' },
  ];

  readonly schoolServices = [
    '机场接机',
    '入学分级测试',
    '课程咨询',
    '三餐',
    '宿舍',
    '自习空间',
    '泳池',
    '健身设施',
    '海边活动',
    '学生服务',
    '医生咨询',
    '签证延长协助',
  ];
  readonly campusActivities = [
    '新生说明会',
    'Native group class',
    '场景英语练习',
    '泳池与海边休息',
    '自习和单词测试',
    '多国籍学生活动',
  ];
  readonly weekendActivities = [
    'Mactan海边活动',
    'Island Hopping',
    '商场与餐厅',
    '咖啡厅和SPA',
    '潜水店和水上活动',
    '宿务城市短途旅行',
  ];
  readonly notes = [
    '本页费用使用2026公开淡季参考价，旺季、促销、房型和汇率可能改变最终报价。',
    'General / Power Speaking / Survival / Business / IELTS / TOEIC / TOEFL的A/B强度不同，报名前需确认每天课程数量。',
    'Semi-Sparta与Sparta会影响平日外出、晚间自习、测试和门禁，建议按自律程度选择。',
    'Sea View、Deluxe、单人房和家庭房需要提前确认空位及附加费。',
    '亲子和低龄学生需提前确认年龄、监护、房型、接送、课程和校规。',
  ];
  readonly faqs: FaqItem[] = [
    {
      question: 'Genius和CIA最大的区别是什么？',
      answer:
        'CIA是Mactan新校区的半斯巴达综合型学校，校园、考试资源和管理体系更标准化；Genius更强调海边度假区住宿、多国籍环境、Native group class和课程弹性。两者都适合宿务学习生活平衡型学生，但体验重点不同。',
    },
    {
      question: '页面上的价格包含全部费用吗？',
      answer:
        '不包含全部。报价器主要估算4周课程住宿套餐和注册费；到校后还要准备SSP、SSP E-Card、管理费、教材费、押金、签证延长、接机、洗衣、电费等费用。',
    },
    {
      question: 'Genius适合雅思学生吗？',
      answer:
        '可以列入候选。公开资料列出IELTS和IELTS Guarantee课程，但如果目标是高压备考和严格模考，也建议同时比较CIA、SMEAG、EV、CPILS等考试资源更强的学校。',
    },
    {
      question: 'Genius适合亲子游学吗？',
      answer:
        '适合比较，尤其是重视住宿舒适度、海边环境和家庭房的家庭。但需要提前确认孩子年龄、课程安排、家长课程、房型、监护和外出规则。',
    },
    {
      question: '为什么不同网站的Genius价格不一样？',
      answer:
        '不同市场、币种、旺季、淡季、优惠、更新时间和房型口径都会造成差异。本页使用公开2026参考价搭建页面，正式报名仍以学校当期确认报价为准。',
    },
  ];
  readonly sideNav: SideNavItem[] = [
    { label: '学校环境', target: 'gallery', icon: 'image' },
    { label: '课程与费用', target: 'course-fees', icon: 'menu_book' },
    { label: '费用快速报价', target: 'quote', icon: 'calculate' },
    { label: '到校费用', target: 'local-fees', icon: 'payments' },
    { label: '报名流程', target: 'service-process', icon: 'task_alt' },
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

  feeFor(courseId: string, roomId: string): number {
    return (
      this.packageFees.find(
        (item) => item.courseId === courseId && item.roomId === roomId,
      )?.fee ?? 0
    );
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

  get selectedPackage(): PackageFee {
    return (
      this.packageFees.find(
        (item) =>
          item.courseId === this.selectedCourseId &&
          item.roomId === this.selectedRoomId,
      ) ?? this.packageFees[0]
    );
  }

  get packageFeeForSelectedWeeks(): number {
    return this.selectedPackage.fee * (this.selectedWeeks / 4);
  }

  get isPeakSeason(): boolean {
    const month = new Date(this.selectedStartDate).getMonth() + 1;

    return [1, 2, 6, 7, 8].includes(month);
  }

  get quoteUsd(): number {
    return this.registrationFee + this.packageFeeForSelectedWeeks * this.discount;
  }

  get quoteUsdText(): string {
    return `USD ${this.formatUsd(this.quoteUsd)} 起`;
  }

  get quoteCnyText(): string {
    const rounded = Math.round((this.quoteUsd * this.usdToCny) / 100) * 100;

    return `约 ${rounded.toLocaleString('zh-CN')} 元起`;
  }

  get discountText(): string {
    return this.discount === 1
      ? '公开参考价，优惠需顾问确认'
      : `${Math.round(this.discount * 100)} 折扣范围`;
  }

  get seasonNote(): string {
    return this.isPeakSeason
      ? '当前日期落在公开资料定义的旺季月份，正式报价可能需要按旺季表重新确认。'
      : '当前日期按淡季公开参考价估算，正式报价仍需确认优惠和空房。';
  }

  formatUsd(value: number): string {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: Number.isInteger(value) ? 0 : 1,
      maximumFractionDigits: 1,
    });
  }
}

import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

type GalleryCategory = '全部' | '校园' | '教室' | '住宿' | '餐饮' | '设施';

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
  weeks: number;
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
  selector: 'app-howdy-school',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './howdy-school.component.html',
  styleUrls: [
    '../cebu-school-detail-layout.css',
    '../cebu-school-detail-content.css',
    '../cebu-school-detail-responsive.css',
    '../ev-school/ev-school-detail.component.css',
  ],
})
export class HowdySchoolComponent {
  readonly galleryCategories: GalleryCategory[] = [
    '全部',
    '校园',
    '教室',
    '住宿',
    '餐饮',
    '设施',
  ];
  selectedGalleryCategory: GalleryCategory = '全部';

  readonly registrationFee = 120;
  readonly discount = 1;
  readonly usdToCny = 7.2;
  readonly weekOptions = [1, 2, 3, 4, 8];

  selectedCourseId = 'general5';
  selectedRoomId = 'hotel-solo';
  selectedWeeks = 4;
  selectedStartDate = '2026-09-07';
  quoteCalculated = false;

  readonly quickInfo: QuickInfo[] = [
    {
      icon: 'hotel',
      label: '学校类型',
      value: 'Maayo Hotel 4星酒店型校区',
      note: '学习空间位于Mandaue的Maayo Hotel / Northpark区域',
    },
    {
      icon: 'record_voice_over',
      label: '课程特色',
      value: '一对一课程为主',
      note: '官方课程列出General 5、General 7、Family、Online和STEP',
    },
    {
      icon: 'verified_user',
      label: '安心程度',
      value: 'TESDA认证 / 24小时安保',
      note: '官方资料强调4星酒店环境、机场约15分钟和安全社区',
    },
    {
      icon: 'groups',
      label: '适合人群',
      value: '成人 / 亲子 / 初学者 / 日本学生',
      note: '官方资料显示12年办学、4,000+日本学生学习记录',
    },
    {
      icon: 'restaurant',
      label: '餐食',
      value: '早餐 + 午餐为主',
      note: '官方FAQ列出早餐、午餐、住宿、教材、机场接机和Wi-Fi包含在费用中',
    },
    {
      icon: 'location_on',
      label: '位置',
      value: 'Mandaue City / 近机场',
      note: '校区地址：168 Plaridel St, Alang-Alang, Mandaue City',
    },
  ];

  readonly galleryImages: GalleryImage[] = [
    {
      category: '校园',
      title: 'Maayo Hotel / Northpark校区',
      description:
        'Howdy现行宣传主打4星级Maayo Hotel环境，适合重视安全、住宿和生活便利度的学生。',
      src: 'https://www.howdyenglishacademy.com/images/hero/building-exterior.png',
    },
    {
      category: '设施',
      title: 'Maayo Hotel屋顶泳池',
      description:
        '酒店型住宿的优势在于公共设施完整，学习之外也有稳定的休息空间。',
      src: 'https://images.trvl-media.com/lodging/20000000/19920000/19916900/19916802/ffd7223b.jpg?impolicy=resizecrop&ra=fill&rh=575&rw=575',
    },
    {
      category: '餐饮',
      title: 'Maayo Hotel餐厅参考',
      description:
        'Howdy公开资料强调早餐和午餐安排，晚餐通常需自行安排或使用酒店餐厅。',
      src: 'https://pix10.agoda.net/hotelImages/2816781/-1/3fd4427f1b5a55deccf48d4d07e6abd1.jpg?ca=9&ce=1&s=1024x768',
    },
    {
      category: '教室',
      title: '小班课堂参考',
      description:
        '课程以一对一为核心，顾问会按General 5、General 7或Family方向核对最新课表。',
      src: 'https://www.study-philippines.com/assets/img/school/10/main04.jpg',
    },
    {
      category: '教室',
      title: 'Howdy课堂互动参考',
      description:
        'Howdy长期服务日本学生，课程设计强调开口表达、反馈和学习顾问跟进。',
      src: 'https://www.osaka-c.ed.jp/blog/nagano/nakata/FB64603E-A249-4770-9185-3464B4AEA0E0.jpeg',
    },
    {
      category: '餐饮',
      title: '学生餐厅参考',
      description:
        '公开代理资料提到Howdy午餐品质和日式餐食体验是学校卖点之一。',
      src: 'https://www.ioutback.com/images/school/howdy/copyright/4.jpg',
    },
    {
      category: '住宿',
      title: '酒店住宿房间参考',
      description:
        'Maayo Hotel住宿通常关注空调、电视、保险箱、冰箱、浴室、Wi-Fi和酒店清洁服务。',
      src: 'https://images.trvl-media.com/lodging/20000000/19920000/19916900/19916802/d681a1b1.jpg?impolicy=resizecrop&ra=fill&rh=575&rw=575',
    },
    {
      category: '校园',
      title: '日本学生支持环境',
      description:
        'Howdy是日系背景浓厚的学校，适合第一次菲律宾游学、亲子和重视日语支持的人。',
      src: 'https://cebu-sakura.com/uploads/shop/405ef258a08498628d165a9f9851299b.jpg',
    },
  ];

  readonly basicInfo: BasicInfoRow[] = [
    { label: '学校名称', value: '菲律宾宿务Howdy English Academy语言学校' },
    { label: '英文名称', value: 'Howdy English Academy' },
    {
      label: '现行校区',
      value: '168 Plaridel St, Alang-Alang, Mandaue City, 6014 Cebu, Philippines (Maayo Hotel)',
    },
    { label: '创校时间', value: '公开资料列出为2014年，2023年迁入现行Maayo Hotel/Northpark环境' },
    { label: '认证与记录', value: '官方资料标注TESDA Certified、12 Years、4,000+ Japanese students' },
    {
      label: '学校定位',
      value: '日系支持强、酒店住宿型、以一对一课程为核心的宿务Mandaue语言学校',
    },
    {
      label: '课程方向',
      value: 'General 5、General 7、Family Course、Online Lessons、Specialized Training English Program',
    },
    {
      label: '费用参考',
      value: '2026公开参考：General 5 Maayo Hotel单人房USD 874/1周起，USD 3,721/4周；入学金USD 120',
    },
  ];

  readonly highlights: Highlight[] = [
    {
      image:
        'https://www.howdyenglishacademy.com/images/hero/building-exterior.png',
      title: '4星级酒店环境，安全感更强',
      text: 'Howdy现行资料主打Maayo Hotel环境，适合第一次去菲律宾、亲子、短期成人和重视住宿的人。',
    },
    {
      image:
        'https://www.study-philippines.com/assets/img/school/10/main04.jpg',
      title: '一对一课程比例高',
      text: 'General 5和General 7都以一对一课为核心，更适合想增加开口时间和老师反馈的人。',
    },
    {
      image:
        'https://pix10.agoda.net/hotelImages/2816781/-1/3fd4427f1b5a55deccf48d4d07e6abd1.jpg?ca=9&ce=1&s=1024x768',
      title: '生活安排更接近酒店住宿',
      text: '住宿、早餐、午餐、Wi-Fi、接机等项目在官方FAQ中列入费用包含范围，预算更容易先估算。',
    },
    {
      image:
        'https://cebu-sakura.com/uploads/shop/405ef258a08498628d165a9f9851299b.jpg',
      title: '日系支持和初学者友好',
      text: '学校长期服务日本学生，适合英语初学者、亲子和希望有日语沟通支持的学生。',
    },
  ];

  readonly suitableFor: FitItem[] = [
    {
      title: '第一次菲律宾游学，想住得更安心',
      text: 'Maayo Hotel环境、24小时安保和近机场位置，对第一次出行的学生和家庭更友好。',
    },
    {
      title: '想要大量一对一开口练习',
      text: 'General 5和General 7都把核心放在一对一课，适合想提升口语反应和表达自信的人。',
    },
    {
      title: '亲子或短期成人学习',
      text: 'Family Course可按家庭人数确认，短期1-4周也能用官方价格快速估算。',
    },
    {
      title: '重视日系服务和生活细节',
      text: '公开资料强调日本学生服务经验、日语支持和适合日本人口味的餐食安排。',
    },
  ];

  readonly notSuitableFor: FitItem[] = [
    {
      title: '想要多国籍环境',
      text: 'Howdy更偏日本学生市场，如果你想要明显多国籍氛围，可同时比较CIA、Genius、Philinter等学校。',
    },
    {
      title: '目标是雅思或多益高压备考',
      text: 'Howdy主线更偏一对一口语和生活体验；考试冲刺建议同时比较CIA、SMEAG、EV、CPILS。',
    },
    {
      title: '预算优先且不需要酒店住宿',
      text: 'Maayo Hotel方案舒适但价格不低，如预算优先，可比较宿务市区普通宿舍型或碧瑶学校。',
    },
    {
      title: '希望每天三餐都由学校完整提供',
      text: '官方FAQ列出的标准费用包含早餐和午餐，晚餐通常不含，需提前确认晚餐方案。',
    },
  ];

  readonly courses: CourseItem[] = [
    {
      name: 'General Course - 5',
      type: '成人综合口语',
      lessons: '每天5节50分钟一对一课 + 15分钟学习顾问沟通',
      suitable: '适合想稳步提升口语、听力、阅读、写作和表达自信的成人学生。',
    },
    {
      name: 'General Course - 7',
      type: '高强度一对一',
      lessons: '每天7节50分钟一对一课 + 15分钟学习顾问沟通',
      suitable: '适合短期想增加课量、集中练习口语输出和老师反馈的学生。',
    },
    {
      name: 'Family Course',
      type: '亲子课程',
      lessons: '官方资料列出每天6节课，父母与孩子可一起学习',
      suitable: '适合亲子游学、学校假期和希望住在酒店环境里的家庭。',
    },
    {
      name: 'Online Lessons',
      type: '线上课程',
      lessons: '25分钟一对一Zoom课程，3个月60节参考',
      suitable: '适合出发前热身、回国后延续学习或预算较轻的学生。',
    },
    {
      name: 'STEP',
      type: '职场英语 + 实习',
      lessons: '上午英语，下午OJT/实习方向，Casa Mira月度方案',
      suitable: '适合想把英语学习和海外职场体验结合的人，需确认开放档期和条件。',
    },
  ];

  readonly courseOptions: CourseOption[] = [
    {
      id: 'general5',
      name: 'General 5',
      lessons: '5节一对一/天',
      suitable: '成人主线课程，适合第一次游学和稳步提升。',
    },
    {
      id: 'general7',
      name: 'General 7',
      lessons: '7节一对一/天',
      suitable: '课量更高，适合短期集中训练。',
    },
  ];

  readonly roomOptions: RoomOption[] = [
    {
      id: 'hotel-solo',
      name: 'Maayo Hotel 1人房',
      note: '酒店单人住宿，安全舒适，预算较高。',
    },
    {
      id: 'hotel-twin',
      name: 'Maayo Hotel 2人同室',
      note: '适合亲友、夫妻或同行者，两人总价口径。',
    },
    {
      id: 'condo-solo',
      name: 'Casa/Amaia公寓1人房',
      note: '更生活化，有厨房或公寓式配置，需确认具体住宿。',
    },
    {
      id: 'condo-twin',
      name: 'Casa/Amaia公寓2人同室',
      note: '两人总价口径，适合同步入退房的同行者。',
    },
  ];

  readonly packageFees: PackageFee[] = [
    { courseId: 'general5', roomId: 'hotel-solo', weeks: 1, fee: 874 },
    { courseId: 'general5', roomId: 'hotel-solo', weeks: 2, fee: 1823 },
    { courseId: 'general5', roomId: 'hotel-solo', weeks: 3, fee: 2772 },
    { courseId: 'general5', roomId: 'hotel-solo', weeks: 4, fee: 3721 },
    { courseId: 'general5', roomId: 'hotel-solo', weeks: 8, fee: 7518 },
    { courseId: 'general5', roomId: 'hotel-twin', weeks: 1, fee: 1431 },
    { courseId: 'general5', roomId: 'hotel-twin', weeks: 2, fee: 2960 },
    { courseId: 'general5', roomId: 'hotel-twin', weeks: 3, fee: 4488 },
    { courseId: 'general5', roomId: 'hotel-twin', weeks: 4, fee: 6016 },
    { courseId: 'general5', roomId: 'hotel-twin', weeks: 8, fee: 12130 },
    { courseId: 'general5', roomId: 'condo-solo', weeks: 1, fee: 752 },
    { courseId: 'general5', roomId: 'condo-solo', weeks: 2, fee: 1555 },
    { courseId: 'general5', roomId: 'condo-solo', weeks: 3, fee: 2358 },
    { courseId: 'general5', roomId: 'condo-solo', weeks: 4, fee: 3162 },
    { courseId: 'general5', roomId: 'condo-solo', weeks: 8, fee: 6376 },
    { courseId: 'general5', roomId: 'condo-twin', weeks: 1, fee: 1126 },
    { courseId: 'general5', roomId: 'condo-twin', weeks: 2, fee: 2293 },
    { courseId: 'general5', roomId: 'condo-twin', weeks: 3, fee: 3459 },
    { courseId: 'general5', roomId: 'condo-twin', weeks: 4, fee: 4626 },
    { courseId: 'general5', roomId: 'condo-twin', weeks: 8, fee: 9292 },
    { courseId: 'general7', roomId: 'hotel-solo', weeks: 1, fee: 930 },
    { courseId: 'general7', roomId: 'hotel-solo', weeks: 2, fee: 1935 },
    { courseId: 'general7', roomId: 'hotel-solo', weeks: 3, fee: 2940 },
    { courseId: 'general7', roomId: 'hotel-solo', weeks: 4, fee: 3944 },
    { courseId: 'general7', roomId: 'hotel-solo', weeks: 8, fee: 7964 },
    { courseId: 'general7', roomId: 'hotel-twin', weeks: 1, fee: 1543 },
    { courseId: 'general7', roomId: 'hotel-twin', weeks: 2, fee: 3183 },
    { courseId: 'general7', roomId: 'hotel-twin', weeks: 3, fee: 4822 },
    { courseId: 'general7', roomId: 'hotel-twin', weeks: 4, fee: 6462 },
    { courseId: 'general7', roomId: 'hotel-twin', weeks: 8, fee: 13022 },
    { courseId: 'general7', roomId: 'condo-solo', weeks: 1, fee: 807 },
    { courseId: 'general7', roomId: 'condo-solo', weeks: 2, fee: 1667 },
    { courseId: 'general7', roomId: 'condo-solo', weeks: 3, fee: 2526 },
    { courseId: 'general7', roomId: 'condo-solo', weeks: 4, fee: 3385 },
    { courseId: 'general7', roomId: 'condo-solo', weeks: 8, fee: 6822 },
    { courseId: 'general7', roomId: 'condo-twin', weeks: 1, fee: 1237 },
    { courseId: 'general7', roomId: 'condo-twin', weeks: 2, fee: 2516 },
    { courseId: 'general7', roomId: 'condo-twin', weeks: 3, fee: 3794 },
    { courseId: 'general7', roomId: 'condo-twin', weeks: 4, fee: 5072 },
    { courseId: 'general7', roomId: 'condo-twin', weeks: 8, fee: 10184 },
  ];

  readonly familyFees = [
    { label: 'Family 2人 / Maayo Hotel', one: 1487, four: 6239, eight: 12576 },
    { label: 'Family 3人 / Hotel无加床', one: 1970, four: 8187, eight: 16477 },
    { label: 'Family 3人 / Hotel加床', one: 2219, four: 9308, eight: 18760 },
    { label: 'Family 2人 / 公寓', one: 1182, four: 4849, eight: 9738 },
  ];

  readonly schedule: ScheduleItem[] = [
    {
      time: '07:00',
      title: '早餐',
      text: 'Maayo Hotel住宿通常在酒店餐厅用早餐；公寓住宿需确认早餐安排。',
    },
    {
      time: '08:15',
      title: 'A&AP学习顾问时间',
      text: '公开资料列出Advisor & Advisee Program，用于学习和生活沟通。',
    },
    {
      time: '08:30 - 12:20',
      title: '上午课程',
      text: '按General 5或General 7进入一对一课程，重点增加开口和老师反馈。',
    },
    {
      time: '12:30 - 13:30',
      title: '午餐',
      text: 'Howdy午餐通常以学校安排的便当或校内餐食为主，周末和休校日需确认。',
    },
    {
      time: '13:30 - 16:20',
      title: '下午课程',
      text: '课程结束时间按课程不同而变化，General 7通常比General 5更满。',
    },
    {
      time: '课后',
      title: '晚餐 / 自习 / 周边生活',
      text: '晚餐通常自行安排，可使用酒店餐厅或周边商场餐饮。',
    },
  ];

  readonly localFees: LocalFee[] = [
    { item: '入学金', amount: 'USD 120', note: '公开代理资料列出，通常前期支付' },
    { item: 'SSP申请费', amount: 'PHP 6,800', note: '特别学习许可，到校后或按学校规则支付' },
    { item: 'ACR I-Card', amount: 'PHP 3,500', note: '60天以上等长周期通常需要确认' },
    { item: '签证延长', amount: 'PHP 4,000起', note: '5-8周公开参考为PHP 4,000；9-12周参考为PHP 9,000' },
    { item: '晚餐选项', amount: 'PHP 400起', note: 'Maayo Hotel餐厅等自费选择，标准报价通常不含晚餐' },
    { item: '学生证/证件照', amount: 'PHP 350 / PHP 100', note: '公开代理资料参考，实际按学校现场为准' },
    { item: '生活用品', amount: 'PHP 1,000起 / 4周', note: '按住宿类型和个人使用情况变化' },
    { item: '活动费用', amount: 'PHP 3,000起', note: '周末活动和个人行程另计' },
    { item: '公寓水电Wi-Fi', amount: 'PHP 1,300 / 周', note: 'Amaia/Casa Mira等公寓住宿需确认是否另计' },
    { item: '周六追加课', amount: 'USD 45-90', note: '公开资料列出3-6节追加课参考' },
    { item: '前泊/延泊', amount: 'USD 48-66', note: '按1人房或2人房参考，需确认空房' },
    { item: '额外机场接送', amount: 'USD 30-40', note: '非标准接机或额外服务需另行确认' },
  ];

  readonly serviceSteps: ProcessStep[] = [
    {
      icon: 'person_search',
      title: '先判断Howdy是否适合',
      text: '根据预算、住宿偏好、是否亲子、是否需要日语支持和一对一课量做初筛。',
    },
    {
      icon: 'fact_check',
      title: '确认课程和住宿',
      text: '核对General 5、General 7、Family、Maayo Hotel或公寓方案的空位。',
    },
    {
      icon: 'payments',
      title: '拆清套餐与当地费用',
      text: '把课程住宿套餐、入学金、SSP、签证、晚餐和公寓水电等费用分开列清。',
    },
    {
      icon: 'assignment_turned_in',
      title: '准备行前文件',
      text: '协助整理护照、入学文件、eTravel、保险、接机和到校现金清单。',
    },
    {
      icon: 'support_agent',
      title: '到校后继续跟进',
      text: '如需沟通课程、老师、住宿、账单或生活问题，可继续联系顾问协助。',
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
      title: '先看酒店型学校是否匹配',
      text: 'Howdy适合重视安全、住宿、日语支持和一对一课程的人，先判断方向再报价。',
      image: 'assets/cia/sida-why-action-selection.jpg',
      alt: '思达启航顾问帮助学生选择适合的菲律宾宿务语言学校',
    },
    {
      number: '02',
      title: '把住宿和费用口径说清',
      text: 'Maayo Hotel、公寓、单人、双人和Family方案都是不同价格口径，需要逐项核对。',
      image: 'assets/cia/sida-why-action-fees.jpg',
      alt: '思达启航顾问为学生核算菲律宾语言学校费用',
    },
    {
      number: '03',
      title: '确认是否符合年龄和同行规则',
      text: '亲子、未成年、双人房和同行入住都有条件，报名之前要先确认。',
      image: 'assets/cia/sida-why-action-contract.jpg',
      alt: '思达启航顾问核验菲律宾游学课程和合同文件',
    },
    {
      number: '04',
      title: '行前清单更稳',
      text: '接机、保险、现金、晚餐、周边生活和到校费用会提前整理给学生。',
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
    { icon: 'verified_user', label: '年龄与房型规则确认' },
    { icon: 'payments', label: '费用透明无隐藏项' },
    { icon: 'apartment', label: '深圳总部 + 宿务驻点' },
  ];

  readonly schoolServices = [
    '机场接机',
    '分级测试',
    '一对一课程',
    '学习顾问沟通',
    '早餐',
    '午餐',
    '酒店住宿',
    'Wi-Fi',
    '洗衣',
    '清洁',
    '酒店健身房',
    '泳池',
  ];
  readonly campusActivities = [
    '新生说明会',
    '一对一口语课',
    'A&AP学习顾问沟通',
    '午餐交流',
    '修了式',
    '可选周六追加课',
  ];
  readonly weekendActivities = [
    'Pacific Mall',
    'Park Mall',
    '咖啡厅和餐厅',
    '宿务城市生活',
    '酒店泳池',
    '自费周末活动',
  ];
  readonly notes = [
    '本页费用使用2026公开参考价，正式报价仍需按入学日期、住宿、人数和空房确认。',
    '官方FAQ列出标准费用包含课程、教材、酒店住宿、早餐、午餐、机场接机和Wi-Fi；晚餐通常不含。',
    '双人房和家庭房通常要求同行者同步入退房，单独学生是否可选需提前确认。',
    '亲子、未成年和高中生课程规则不同，年龄、同意书、外出和接送规则需逐项确认。',
    '如果目标是强考试备考或多国籍环境，建议把Howdy与CIA、SMEAG、EV、Genius等学校一起比较。',
  ];
  readonly faqs: FaqItem[] = [
    {
      question: 'Howdy和CIA最大的区别是什么？',
      answer:
        'CIA更像综合型半斯巴达新校区，课程和考试资源覆盖更广；Howdy更偏日系支持、酒店住宿和高比例一对一口语课程。若你重视安全、住宿、日语沟通和短期口语，Howdy值得比较。',
    },
    {
      question: '页面上的报价包含全部费用吗？',
      answer:
        '不包含全部。报价器主要估算课程住宿套餐和入学金；SSP、ACR I-Card、签证延长、晚餐、活动、公寓水电或额外接送等仍需按学校规则确认。',
    },
    {
      question: 'Howdy适合亲子吗？',
      answer:
        '适合列入候选。官方课程中有Family Course，公开资料也强调酒店环境和安全性。报名前需确认孩子年龄、家长课程、房型、餐食、接送和外出规则。',
    },
    {
      question: 'Howdy适合雅思备考吗？',
      answer:
        '如果重点是口语表达和基础英语，可以比较；如果目标是雅思、多益或托福分数冲刺，建议同时比较CIA、SMEAG、EV、CPILS等考试型学校。',
    },
    {
      question: '为什么不同网站价格有差异？',
      answer:
        '不同网站会因更新时间、住宿口径、币种、包含项目、旺季和促销不同而出现差异。本页用官方2026起价和公开代理4周价格建立参考，最终以学校确认报价为准。',
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

  feeFor(courseId: string, roomId: string, weeks = 4): number {
    return (
      this.packageFees.find(
        (item) =>
          item.courseId === courseId &&
          item.roomId === roomId &&
          item.weeks === weeks,
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

  get selectedPackageFee(): number {
    return this.feeFor(
      this.selectedCourseId,
      this.selectedRoomId,
      this.selectedWeeks,
    );
  }

  get quoteUsd(): number {
    return this.registrationFee + this.selectedPackageFee * this.discount;
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

  formatUsd(value: number): string {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: Number.isInteger(value) ? 0 : 1,
      maximumFractionDigits: 1,
    });
  }
}

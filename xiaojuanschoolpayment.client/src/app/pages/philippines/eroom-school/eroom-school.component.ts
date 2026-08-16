import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

type GalleryCategory = '全部' | '校园' | '课堂' | '住宿' | '生活';
type WeekOption = 4 | 8 | 12 | 16 | 20 | 24;
type CourseId =
  | 'guardian'
  | 'flexible'
  | 'light'
  | 'regular'
  | 'intensive'
  | 'power-speaking'
  | 'ielts-toeic-light'
  | 'ielts-toeic-regular'
  | 'ielts-toeic-intensive'
  | 'ielts-toeic-power';
type RoomId = 'quad' | 'triple' | 'double' | 'single';

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

interface CourseOption {
  id: CourseId;
  name: string;
  type: string;
  lessons: string;
  suitable: string;
  fees: Record<WeekOption, number>;
}

interface RoomOption {
  id: RoomId;
  name: string;
  fee4w: number;
  note: string;
}

interface LocalFee {
  item: string;
  amount: string;
  note: string;
}

interface LocalFeeGuide {
  weeks: WeekOption;
  title: string;
  text: string;
}

interface JuniorFee {
  room: string;
  fee4w: number;
  note: string;
}

interface ScheduleItem {
  time: string;
  title: string;
  text: string;
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

interface SourceLink {
  label: string;
  url: string;
}

@Component({
  selector: 'app-eroom-school',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './eroom-school.component.html',
  styleUrls: [
    '../cebu-school-detail-layout.css',
    '../cebu-school-detail-content.css',
    '../cebu-school-detail-responsive.css',
    '../ev-school/ev-school-detail.component.css',
    './eroom-school.component.css',
  ],
})
export class EroomSchoolComponent {
  readonly galleryCategories: GalleryCategory[] = ['全部', '校园', '课堂', '住宿', '生活'];
  selectedGalleryCategory: GalleryCategory = '全部';
  selectedCourseId: CourseId = 'flexible';
  selectedRoomId: RoomId = 'quad';
  selectedWeeks: WeekOption = 4;
  selectedStartDate = '2026-09-07';
  quoteCalculated = false;

  readonly registrationFeeKrw = 100000;
  readonly pickupFeeKrw = 30000;
  readonly weekOptions: WeekOption[] = [4, 8, 12, 16, 20, 24];

  readonly quickInfo: QuickInfo[] = [
    {
      icon: 'location_on',
      label: '城市',
      value: 'Bacolod / Magsaysay Ave',
      note: '官方地址位于Bacolod, Negros Occidental的Magsaysay Ave一带，城市节奏比宿务更安静。',
    },
    {
      icon: 'school',
      label: '学习模式',
      value: 'Classic 或 Semi-Sparta',
      note: '官方费用表把Classic和Semi-Sparta列为同价，学生报名时需确认管理模式。',
    },
    {
      icon: 'menu_book',
      label: '课程方向',
      value: 'ESL / Business / IELTS / TOEIC / Junior',
      note: '成人和家庭课程覆盖ESL、Business、IELTS、TOEIC；另有管理型Junior路线。',
    },
    {
      icon: 'home_work',
      label: '住宿餐食',
      value: '校内住宿 + 三餐',
      note: '官方费用说明列住宿含平日和周末三餐、每周3次清洁与洗衣服务。',
    },
    {
      icon: 'sports_basketball',
      label: '校园设施',
      value: '泳池 / 篮球场 / 24小时警卫',
      note: '学校介绍提到宿舍型校园、活动设施、校内管理和24小时警卫。',
    },
    {
      icon: 'payments',
      label: '4周常见起步',
      value: 'KRW 1,370,000 + PHP当地费',
      note: '按Flexible + 4人房 + 注册费KRW100,000 + 巴科洛德接机KRW30,000估算。',
    },
  ];

  readonly galleryImages: GalleryImage[] = [
    {
      category: '校园',
      title: 'E-Room Bacolod校园外观',
      description: 'Bacolod安静城市里的校内住宿型语言学校，适合预算友好型长期学习。',
      src: 'https://www.cebu-55.com/common/img/detail/eroom/04.jpg',
    },
    {
      category: '课堂',
      title: '一对一学习环境',
      description: '课程以一对一课时为核心，ESL、IELTS和TOEIC可按课量选择。',
      src: 'https://www.cebu-55.com/common/img/detail/eroom/02.jpg',
    },
    {
      category: '住宿',
      title: '单人房住宿参考',
      description: '公开住宿图片用于初步判断房间氛围，实际楼栋和房型以学校确认空房为准。',
      src: 'https://www.eslpass.com/userfiles/images/Bacolod/E-ROOM/single.jpg',
    },
    {
      category: '生活',
      title: '校内学习与接待空间',
      description: '适合想把课堂、住宿、餐食和日常管理集中在同一校园内的学生。',
      src: 'https://storage.googleapis.com/world-study-prod/media/school_photo/831/ff012031-abbc-4c47-9002-741f4d098f74.jpg',
    },
    {
      category: '校园',
      title: '宿舍与泳池设施',
      description: '学校亮点包含宿舍型校园、泳池、篮球场、洗衣清洁和生活支持。',
      src: 'https://www.philja.com/school/sch_img/eroom/main4.jpg',
    },
  ];

  readonly basicInfo: BasicInfoRow[] = [
    { label: '学校名称', value: '菲律宾巴科洛德E-Room Language Center' },
    { label: '英文名称', value: 'E-Room Language Center / EROOM / 이룸어학원' },
    { label: '城市区域', value: 'Bacolod City, Negros Occidental' },
    { label: '官方地址', value: 'Lot 1, Block 3 Magsaysay Ave, Bacolod, 6100 Negros Occidental, Philippines' },
    { label: '联系方式参考', value: 'Tel: +63-34-703-1377 / Email: malkim78@gmail.com' },
    { label: '学校历史', value: '公开历史页显示学校2005年开办，2022年完成专用校舍。' },
    { label: '课程方向', value: 'ESL/Business Classic & Semi-Sparta、IELTS/TOEIC、Guardian、管理型Junior课程。' },
    { label: '费用币种', value: '课程费、住宿费、注册费和接机费以KRW列示；SSP、I-Card、电水、押金、教材和签证等以PHP列示。' },
  ];

  readonly highlights: Highlight[] = [
    {
      image: this.galleryImages[0].src,
      title: 'Bacolod低干扰城市',
      text: 'E-Room适合想避开大城市和海岛热闹环境，在更安静节奏中稳定上课的学生。',
    },
    {
      image: this.galleryImages[1].src,
      title: 'Classic与Semi-Sparta可选',
      text: '官方费用表把两种管理模式放在同一价格体系，适合先按学习自律度选择强度。',
    },
    {
      image: this.galleryImages[4].src,
      title: '校内住宿生活一体',
      text: '住宿费包含三餐、清洁和洗衣基础服务，校内还有泳池、篮球场和24小时警卫。',
    },
    {
      image: this.galleryImages[3].src,
      title: '成人、家庭、青少年都能看',
      text: '除成人ESL和考试课程外，E-Room也列出Guardian和管理型Junior费用，适合家庭一起比较。',
    },
  ];

  readonly suitableFor: FitItem[] = [
    { title: '想控制预算读ESL', text: 'Bacolod生活成本通常更温和，E-Room 4人房和Flexible/Light等课程适合预算型成人。' },
    { title: '想在安静城市长期学习', text: '不追求海边度假或大城市夜生活，更适合8到24周稳定打基础。' },
    { title: '需要一点管理推动', text: 'Semi-Sparta、门禁、测试和出勤规则适合需要学校帮忙维持节奏的学生。' },
    { title: '家庭或青少年路线比较', text: 'Guardian、Family和Junior费用在官方表中单独列出，适合亲子或未成年路线初筛。' },
  ];

  readonly notSuitableFor: FitItem[] = [
    { title: '想要海岛度假感', text: 'E-Room是Bacolod市区学习型校园，不是宿务Mactan或长滩岛的海边体验。' },
    { title: '只接受USD报价', text: '官方价格以韩元和菲律宾披索拆分，需要一起看汇率和到校费用。' },
    { title: '希望全外教或美式小班', text: '这页重点不是Native-only路线，外教比例和老师安排需当期确认。' },
    { title: '不想遵守门禁和测试', text: '学校规则列出门禁、出勤和测试要求，不适合完全自由型学习期待。' },
  ];

  readonly courses: CourseOption[] = [
    {
      id: 'guardian',
      name: 'Guardian',
      type: 'Parent / Guardian',
      lessons: '3节1:1 + 1节Option',
      suitable: '适合陪读家长或想轻量上课的学生。',
      fees: { 4: 580000, 8: 1160000, 12: 1700000, 16: 2260000, 20: 2820000, 24: 3380000 },
    },
    {
      id: 'flexible',
      name: 'Flexible',
      type: 'Budget ESL',
      lessons: '3节1:1 + 1节1:4 + 1节Option',
      suitable: '适合预算优先，但想保留小组互动和可选课。',
      fees: { 4: 620000, 8: 1240000, 12: 1820000, 16: 2420000, 20: 3020000, 24: 3620000 },
    },
    {
      id: 'light',
      name: 'Light',
      type: 'Standard ESL',
      lessons: '4节1:1 + 1节1:4 + 1节Option',
      suitable: '适合一般成人口语、听力和基础语法提升。',
      fees: { 4: 720000, 8: 1440000, 12: 2120000, 16: 2820000, 20: 3520000, 24: 4220000 },
    },
    {
      id: 'regular',
      name: 'Regular',
      type: 'Balanced ESL',
      lessons: '5节1:1 + 1节1:4 + 1节Option',
      suitable: '适合想增加一对一纠正，又希望课表不过度压迫的学生。',
      fees: { 4: 820000, 8: 1640000, 12: 2420000, 16: 3220000, 20: 4020000, 24: 4820000 },
    },
    {
      id: 'intensive',
      name: 'Intensive',
      type: 'High 1:1',
      lessons: '6节1:1 + 1节1:4 + 1节Option',
      suitable: '适合短期集中输出和需要更多个别纠正的人。',
      fees: { 4: 920000, 8: 1840000, 12: 2720000, 16: 3620000, 20: 4520000, 24: 5420000 },
    },
    {
      id: 'power-speaking',
      name: 'Power Speaking',
      type: 'Speaking Intensive',
      lessons: '7节1:1 + 1节1:4 + 1节Option',
      suitable: '适合短期高密度口语训练和想把一对一拉满的学生。',
      fees: { 4: 1020000, 8: 2040000, 12: 3020000, 16: 4020000, 20: 5020000, 24: 6020000 },
    },
    {
      id: 'ielts-toeic-light',
      name: 'IELTS / TOEIC Light',
      type: 'Exam Prep',
      lessons: '4节1:1 + 1节1:4 + 1节Option',
      suitable: '适合刚进入考试准备，想兼顾基础和题型熟悉。',
      fees: { 4: 860000, 8: 1720000, 12: 2540000, 16: 3380000, 20: 4220000, 24: 5060000 },
    },
    {
      id: 'ielts-toeic-regular',
      name: 'IELTS / TOEIC Regular',
      type: 'Exam Prep',
      lessons: '5节1:1 + 1节1:4 + 1节Option',
      suitable: '适合有考试目标，想增加一对一练习和反馈。',
      fees: { 4: 960000, 8: 1920000, 12: 2840000, 16: 3780000, 20: 4720000, 24: 5660000 },
    },
    {
      id: 'ielts-toeic-intensive',
      name: 'IELTS / TOEIC Intensive',
      type: 'Exam Intensive',
      lessons: '6节1:1 + 1节1:4 + 1节Option',
      suitable: '适合分数压力更明确，想提高备考课量的学生。',
      fees: { 4: 1060000, 8: 2120000, 12: 3140000, 16: 4180000, 20: 5220000, 24: 6260000 },
    },
    {
      id: 'ielts-toeic-power',
      name: 'IELTS / TOEIC Power',
      type: 'Exam Power',
      lessons: '7节1:1 + 1节1:4 + 1节Option',
      suitable: '适合短期考试冲刺和更高密度一对一反馈。',
      fees: { 4: 1160000, 8: 2320000, 12: 3440000, 16: 4580000, 20: 5720000, 24: 6860000 },
    },
  ];

  readonly roomOptions: RoomOption[] = [
    { id: 'quad', name: '4人房 / Quad', fee4w: 620000, note: '预算最低，适合长期学习和能接受共享空间的学生。' },
    { id: 'triple', name: '3人房 / Triple', fee4w: 720000, note: '费用和舒适度平衡，是预算型成人常见选择。' },
    { id: 'double', name: '2人房 / Double', fee4w: 820000, note: '更适合朋友同行或希望休息质量更稳定的学生。' },
    { id: 'single', name: '1人房 / Single', fee4w: 970000, note: '隐私最高，适合备考、工作人士或对睡眠要求高的人。' },
  ];

  readonly localFeeGuides: LocalFeeGuide[] = [
    { weeks: 4, title: '4周', text: '通常重点准备SSP、ID、宿舍押金、电水、教材和个人消费；签证延期通常从4周后开始。' },
    { weeks: 8, title: '8周', text: '需预留第一次签证延期PHP4,360，长期学习通常还要看ACR I-Card是否适用。' },
    { weeks: 12, title: '12周', text: '在8周基础上增加第二次签证延期PHP5,630，电水和教材也会随周数增加。' },
    { weeks: 16, title: '16周', text: '继续增加签证延期PHP3,660，并按每周PHP500估算水费和管理费。' },
    { weeks: 20, title: '20周', text: '继续增加签证延期PHP3,660，建议报名时请学校列正式当地费用清单。' },
    { weeks: 24, title: '24周', text: '继续增加签证延期PHP3,660，长期学生需特别核对I-Card、签证和房型空位。' },
  ];

  readonly localFees: LocalFee[] = [
    { item: 'Registration', amount: 'KRW 100,000', note: '入学金，官方说明为一次性且不退。' },
    { item: 'Bacolod Pickup', amount: 'KRW 30,000', note: '巴科洛德机场接机参考费用。' },
    { item: 'SSP', amount: 'PHP 7,200', note: 'Special Study Permit，官方列6个月有效。' },
    { item: 'ACR I-Card', amount: 'PHP 4,060', note: '官方列1年有效，通常长期学习需确认。' },
    { item: 'Student ID', amount: 'PHP 200', note: '学生证发行费。' },
    { item: 'Electricity', amount: '约PHP 500-1,000 / 4周', note: '按实际用量收取，官方列PHP20/kW参考。' },
    { item: 'Water & Management', amount: 'PHP 500 / 周', note: '水费及管理费按周计算。' },
    { item: 'Books', amount: 'PHP 250-450 / 本', note: '按课程实际教材购买。' },
    { item: 'Dorm Deposit', amount: 'PHP 3,000', note: '宿舍押金，退房检查后按规则退还。' },
    { item: 'Visa Extension', amount: 'PHP 4,360起', note: '官方列4周后4,360，8周后5,630，后续每阶段3,660。' },
    { item: 'Extra 1:1', amount: 'KRW 150,000 / 4周', note: '加一对一课的官方参考费用。' },
    { item: 'Extra 1:4 Group', amount: 'KRW 60,000 / 4周', note: '加1:4小组课的官方参考费用。' },
  ];

  readonly juniorFees: JuniorFee[] = [
    { room: 'Junior 1人房', fee4w: 2400000, note: '含课程、住宿、Bacolod接机、SSP、I-Card、签证、教材、公证、活动和水费等官方列示项目。' },
    { room: 'Junior 2人房', fee4w: 2220000, note: '适合希望费用和舒适度平衡的管理型青少年路线。' },
    { room: 'Junior 3人房', fee4w: 2170000, note: '官方4周表中最低Junior房型参考，电费和注册费等仍需另看。' },
  ];

  readonly schedule: ScheduleItem[] = [
    { time: '07:30 - 08:50', title: 'Semi-Sparta早间词汇测试', text: '选择Semi-Sparta的学生通常会有更明确的早间学习节奏。' },
    { time: '08:00 - 12:00', title: '上午一对一 / 小组课', text: '按ESL、Business、IELTS或TOEIC安排口语、语法、听力、阅读和考试技巧。' },
    { time: '12:00 - 13:00', title: '午餐与休息', text: '住宿费包含平日和周末三餐，适合想省去通勤和餐食安排的学生。' },
    { time: '13:00 - 17:00', title: '下午课程与补强', text: 'Regular以上课程会有更高比例一对一课时，适合加强输出和老师反馈。' },
    { time: '晚上', title: '免费夜间选修课', text: '公开教育系统资料提到周一到周五可选TOEIC/IELTS、发音、语法、会话等夜间课。' },
    { time: '周末', title: 'Bacolod生活与活动', text: 'Junior项目含活动和文化体验；成人周末安排需遵守门禁和校规。' },
  ];

  readonly serviceSteps: ProcessStep[] = [
    { icon: 'location_city', title: '先确认是否适合Bacolod', text: '如果你想低预算、安静、长期学习，E-Room更对题；想海岛和大城市则同步比较宿务。' },
    { icon: 'rule', title: '选择Classic或Semi-Sparta', text: '先判断自律度和门禁接受度，再决定管理模式，费用表目前列为同价。' },
    { icon: 'menu_book', title: '按课量选课程', text: 'Flexible、Light、Regular、Intensive和Power Speaking主要差在一对一课时。' },
    { icon: 'hotel', title: '锁定房型与周数', text: '4人房到1人房价格差明显，长期学习先看预算和睡眠需求。' },
    { icon: 'receipt_long', title: '拆分KRW和PHP', text: '课程住宿、注册和接机按KRW看；SSP、签证、电水、押金和教材按PHP看。' },
    { icon: 'verified', title: '核对正式Invoice', text: '报名前确认当期费用、优惠、空房、接机、门禁、测试和退费规则。' },
  ];

  readonly notes = [
    '官方规则说明在线或线下申请后，注册费需在3天内缴纳，课程费用需至少在入境菲律宾4周前付清。',
    '家庭课程学生官方费用页注明只能申请Classic过程，不能默认套用Semi-Sparta。',
    '官方规则列每周二申请换课或换老师，周四生效；结课前2周通常不可更换。',
    '官方规则列证书最低出勤率75%，缺勤、迟到、门禁和测试违反可能影响证书或押金。',
    '宿舍规则列洗衣和清洁每周3次，床单每2周更换，安静时间为22:00到07:00。',
    '费用、校规、假期无课和签证政策可能变化，正式报名要以学校当期invoice和学生手册为准。',
  ];

  readonly faqs: FaqItem[] = [
    {
      question: 'E-Room Language Center在哪里？',
      answer:
        '官方地址是Lot 1, Block 3 Magsaysay Ave, Bacolod, 6100 Negros Occidental, Philippines，属于巴科洛德市区学习型校园。',
    },
    {
      question: 'E-Room 4周大概多少钱？',
      answer:
        '按官方费用表，Flexible课程KRW620,000，4人房KRW620,000，注册费KRW100,000，Bacolod接机KRW30,000，4周常见起步参考KRW1,370,000，另有PHP当地费用。',
    },
    {
      question: 'Classic和Semi-Sparta费用一样吗？',
      answer:
        '官方2026费用页把ESL/Business和IELTS/TOEIC都标为Classic & Semi-Sparta同一价格体系，但报名时仍要确认当期管理规则和可选模式。',
    },
    {
      question: 'E-Room适合亲子或青少年吗？',
      answer:
        '可以作为候选。官方费用页列Guardian、成人/家庭课程，以及管理型Junior 4周费用。未成年学生需要逐项确认年龄、监护、活动、门禁和入住规则。',
    },
    {
      question: '为什么费用同时有KRW和PHP？',
      answer:
        'E-Room官方页面以KRW列课程费、住宿费、注册费和接机费，以PHP列SSP、I-Card、签证、电水、教材、押金等当地费用。',
    },
  ];

  readonly sideNav: SideNavItem[] = [
    { label: '学校环境', target: 'gallery', icon: 'image' },
    { label: '课程费用', target: 'course-fees', icon: 'menu_book' },
    { label: '费用估算', target: 'quote', icon: 'calculate' },
    { label: '当地费用', target: 'local-fees', icon: 'payments' },
    { label: '服务流程', target: 'service-process', icon: 'task_alt' },
    { label: '资料来源', target: 'sources', icon: 'link' },
    { label: 'FAQ', target: 'faq', icon: 'help' },
  ];

  readonly mobileAnchors: SideNavItem[] = [
    { label: '概览', target: 'top', icon: 'dashboard' },
    { label: '环境', target: 'gallery', icon: 'image' },
    { label: '课程', target: 'course-fees', icon: 'menu_book' },
    { label: '报价', target: 'quote', icon: 'calculate' },
    { label: '费用', target: 'local-fees', icon: 'receipt_long' },
    { label: 'FAQ', target: 'faq', icon: 'help' },
  ];

  readonly sources: SourceLink[] = [
    { label: 'E-Room官方首页', url: 'https://www.e-room.org/' },
    { label: 'E-Room官方课程与费用页', url: 'https://www.e-room.org/theme/sample135/html/sub05.php' },
    { label: 'E-Room官方位置页', url: 'https://www.e-room.org/theme/sample135/html/location.php' },
    { label: 'E-Room官方校规页', url: 'https://www.e-room.org/theme/sample135/html/law.php' },
    { label: 'E-Room官方优势介绍', url: 'https://www.e-room.org/theme/sample135/html/company_intro.php' },
    { label: 'E-Room官方教育系统', url: 'https://www.e-room.org/theme/sample135/html/sub01.php' },
    { label: 'E-Room官方历史页', url: 'https://www.e-room.org/theme/sample135/html/history.php' },
  ];

  get filteredGalleryImages(): GalleryImage[] {
    return this.selectedGalleryCategory === '全部'
      ? this.galleryImages
      : this.galleryImages.filter((image) => image.category === this.selectedGalleryCategory);
  }

  get selectedCourse(): CourseOption {
    return this.courses.find((course) => course.id === this.selectedCourseId) ?? this.courses[1];
  }

  get selectedRoom(): RoomOption {
    return this.roomOptions.find((room) => room.id === this.selectedRoomId) ?? this.roomOptions[0];
  }

  get selectedLocalFeeGuide(): LocalFeeGuide {
    return this.localFeeGuides.find((fee) => fee.weeks === this.selectedWeeks) ?? this.localFeeGuides[0];
  }

  get tuitionForSelectedWeeks(): number {
    return this.selectedCourse.fees[this.selectedWeeks];
  }

  get roomFeeForSelectedWeeks(): number {
    return this.selectedRoom.fee4w * (this.selectedWeeks / 4);
  }

  get quoteKrw(): number {
    return this.registrationFeeKrw + this.pickupFeeKrw + this.tuitionForSelectedWeeks + this.roomFeeForSelectedWeeks;
  }

  get quoteText(): string {
    return `${this.formatKrw(this.quoteKrw)} 起`;
  }

  get fourWeekStartingText(): string {
    const flexible = this.courses.find((course) => course.id === 'flexible') ?? this.courses[1];
    return this.formatKrw(this.registrationFeeKrw + this.pickupFeeKrw + flexible.fees[4] + this.roomOptions[0].fee4w);
  }

  get formulaText(): string {
    return `${this.selectedCourse.name} ${this.selectedWeeks}周课程费 + ${this.selectedRoom.name}住宿费 + 注册费 + 接机费`;
  }

  get courseFeeRows() {
    return this.courses.map((course) => ({
      course: course.name,
      tuition: this.formatKrw(course.fees[4]),
      quad: this.formatKrw(course.fees[4] + this.roomOptions[0].fee4w),
      triple: this.formatKrw(course.fees[4] + this.roomOptions[1].fee4w),
      double: this.formatKrw(course.fees[4] + this.roomOptions[2].fee4w),
      single: this.formatKrw(course.fees[4] + this.roomOptions[3].fee4w),
      suitable: course.suitable,
    }));
  }

  setGalleryCategory(category: GalleryCategory): void {
    this.selectedGalleryCategory = category;
  }

  calculateQuote(): void {
    this.quoteCalculated = true;
  }

  scrollToSection(target: string, event?: Event): void {
    event?.preventDefault();
    const targetElement = document.getElementById(target);
    if (!targetElement) return;
    const headerOffset = window.innerWidth <= 680 ? 132 : 92;
    const targetTop = targetElement.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({ top: Math.max(targetTop, 0), behavior: 'smooth' });
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#${target}`);
  }

  formatKrw(value: number): string {
    return `KRW ${value.toLocaleString('ko-KR', { maximumFractionDigits: 0 })}`;
  }

  formatPhp(value: number): string {
    return `PHP ${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  }
}

import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

type GalleryCategory = '全部' | '校园' | '课堂' | '住宿' | '生活';
type WeekOption = 1 | 2 | 3 | 4 | 8 | 12 | 16 | 20;
type CourseId = 'regular' | 'intensive' | 'exam-business';
type RoomId = 'triple' | 'double' | 'single' | 'hotelDouble' | 'hotelSingle';

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
  fees: Record<RoomId, Record<WeekOption, number>>;
}

interface RoomOption {
  id: RoomId;
  name: string;
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
  selector: 'app-lslc-school',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './lslc-school.component.html',
  styleUrls: [
    '../cebu-school-detail-layout.css',
    '../cebu-school-detail-content.css',
    '../cebu-school-detail-responsive.css',
    '../ev-school/ev-school-detail.component.css',
    './lslc-school.component.css',
  ],
})
export class LslcSchoolComponent {
  readonly galleryCategories: GalleryCategory[] = ['全部', '校园', '课堂', '住宿', '生活'];
  selectedGalleryCategory: GalleryCategory = '全部';
  selectedCourseId: CourseId = 'regular';
  selectedRoomId: RoomId = 'triple';
  selectedWeeks: WeekOption = 4;
  selectedStartDate = '2026-09-07';
  quoteCalculated = false;

  readonly registrationFeeUsd = 100;
  readonly pickupFeeUsd = 30;
  readonly weekOptions: WeekOption[] = [1, 2, 3, 4, 8, 12, 16, 20];
  readonly includedItems = ['学费', '住宿', '三餐', '洗衣', '清洁'];

  readonly quickInfo: QuickInfo[] = [
    {
      icon: 'account_balance',
      label: '城市与校区',
      value: 'Bacolod / University of St. La Salle',
      note: 'LSLC位于巴科洛德的University of St. La Salle校园内，可使用大学设施和本地学生交流资源。',
    },
    {
      icon: 'school',
      label: '学校背景',
      value: '1997年成立',
      note: '官方介绍列LSLC为大学认可的附属语言中心，校区内学习环境更接近大学型语言学校。',
    },
    {
      icon: 'menu_book',
      label: '课程方向',
      value: 'ESL / TOEIC / TOEFL / IELTS / Business',
      note: '官方费用表列Regular、Intensive、TOEIC/TOEFL/IELTS/Business等课程价格。',
    },
    {
      icon: 'schedule',
      label: '课时提醒',
      value: '2026年3月起45分钟/课',
      note: '官方2025年12月公告说明，2026年3月起每节课由50分钟改为45分钟。',
    },
    {
      icon: 'hotel',
      label: '住宿选择',
      value: '学生宿舍 / Hotel One',
      note: '官方费用表同时列学生宿舍1-3人房，以及2026年6月28日以后的Hotel One住宿价格。',
    },
    {
      icon: 'payments',
      label: '4周常见起步',
      value: 'USD 1,490 + PHP当地费',
      note: '按Regular + 学生宿舍3人房 + 注册费USD100 + Bacolod接机USD30估算。',
    },
  ];

  readonly galleryImages: GalleryImage[] = [
    {
      category: '校园',
      title: 'LSLC校园与学生活动空间',
      description: 'LSLC位于University of St. La Salle校园内，适合想要大学环境和本地学生交流的学生。',
      src: 'https://cebu21.jp/2017/assets/img/school/lslc/5-06b.jpg',
    },
    {
      category: '住宿',
      title: 'LSLC宿舍房间参考',
      description: '公开宿舍图片用于判断基础房型氛围，正式房型、楼栋和空房以学校确认资料为准。',
      src: 'https://www.philja.com/school/sch_img/lslc/domi/1-1.jpg',
    },
    {
      category: '课堂',
      title: 'Bacolod学习型课堂参考',
      description: 'LSLC课程覆盖ESL、考试和商务方向，适合中长期基础提升和大学校园体验。',
      src: 'https://image.slidesharecdn.com/lslc-brochure-161206103953/75/Lslc-Tr-ng-Anh-ng-LSLC-Philippines-15-2048.jpg',
    },
    {
      category: '生活',
      title: '大学校园生活',
      description: '官方介绍强调可使用大学设施、加入大学课堂和参与本地学生交流活动。',
      src: 'https://cebu21.jp/2017/assets/img/school/lslc/5-06b.jpg',
    },
  ];

  readonly basicInfo: BasicInfoRow[] = [
    { label: '学校名称', value: '菲律宾巴科洛德LSLC语言学校' },
    { label: '英文名称', value: 'LSLC - Language Skills Learning Center' },
    { label: '城市区域', value: 'Bacolod City, Negros Occidental' },
    { label: '校区位置', value: 'University of St. La Salle校园内' },
    { label: '成立时间', value: '1997年' },
    { label: '住宿选择', value: '学生宿舍1人房、2人房、3人房，以及Hotel One 1人房、2人房。' },
    { label: '课程方向', value: 'Regular ESL、Intensive ESL、TOEIC、TOEFL、IELTS、Business课程。' },
    { label: '费用币种', value: '官方2026费用表以USD列课程住宿套餐费、注册费和接机费；SSP、签证、水电、教材等以PHP列示。' },
  ];

  readonly highlights: Highlight[] = [
    {
      image: this.galleryImages[0].src,
      title: '大学校园型语言学校',
      text: 'LSLC在University of St. La Salle校园内，适合想体验大学设施、本地学生交流和更安静学习城市的学生。',
    },
    {
      image: this.galleryImages[2].src,
      title: 'ESL、考试、商务路线清楚',
      text: '官方价格把Regular、Intensive、TOEIC/TOEFL/IELTS/Business分开列价，适合按目标快速核预算。',
    },
    {
      image: this.galleryImages[1].src,
      title: '套餐费包含生活基础项',
      text: '官方费用表说明课程住宿套餐包含学费、住宿、餐食、洗衣和房间清洁，便于做初步预算。',
    },
    {
      image: this.galleryImages[3].src,
      title: 'Bacolod低成本城市',
      text: '官方首页强调Bacolod生活费相对Cebu和Manila更低，适合预算敏感和中长期学习。',
    },
  ];

  readonly suitableFor: FitItem[] = [
    { title: '想要大学校园环境', text: '适合希望在La Salle校园里学习、使用设施并接触菲律宾大学生的学生。' },
    { title: '预算友好的长期ESL', text: 'Bacolod生活成本较温和，LSLC的3人房Regular套餐适合先做低预算测算。' },
    { title: '想比较考试或商务课程', text: 'TOEIC、TOEFL、IELTS和Business在官方费用表中同一栏列价，方便和ESL比较。' },
    { title: '希望费用包含项目清楚', text: '学费、住宿、餐食、洗衣和清洁已在套餐中，前期报价结构比拆项学校更直观。' },
  ];

  readonly notSuitableFor: FitItem[] = [
    { title: '想要海边度假型学校', text: 'LSLC是巴科洛德大学校园型学校，不是Mactan海边度假或长滩岛体验。' },
    { title: '只想高压Sparta管理', text: 'LSLC更偏大学环境和常规学习型，若目标是强制管理可同时比较碧瑶学校。' },
    { title: '需要全新豪华校舍', text: '住宿有学生宿舍和Hotel One选项，舒适度要按当期房型图片和空房单独确认。' },
    { title: '不想拆USD和PHP', text: '套餐费以USD报价，当地SSP、签证、水电、教材和押金仍需PHP另备。' },
  ];

  readonly courses: CourseOption[] = [
    {
      id: 'regular',
      name: 'Regular ESL',
      type: 'Standard ESL',
      lessons: '4节1:1 + 2节小组课',
      suitable: '适合一般口语、听力、语法和中长期基础提升。',
      fees: {
        triple: { 1: 540, 2: 815, 3: 1080, 4: 1360, 8: 2720, 12: 4080, 16: 5440, 20: 6800 },
        double: { 1: 580, 2: 875, 3: 1160, 4: 1460, 8: 2920, 12: 4380, 16: 5840, 20: 7300 },
        single: { 1: 655, 2: 980, 3: 1310, 4: 1640, 8: 3280, 12: 4920, 16: 6560, 20: 8200 },
        hotelDouble: { 1: 600, 2: 940, 3: 1280, 4: 1590, 8: 3180, 12: 4770, 16: 6360, 20: 7950 },
        hotelSingle: { 1: 830, 2: 1370, 3: 1910, 4: 2390, 8: 4780, 12: 7170, 16: 9590, 20: 11950 },
      },
    },
    {
      id: 'intensive',
      name: 'Intensive ESL',
      type: 'High 1:1',
      lessons: '5节1:1 + 2节小组课',
      suitable: '适合想增加一对一课时、短期集中提升输出的学生。',
      fees: {
        triple: { 1: 560, 2: 845, 3: 1120, 4: 1410, 8: 2820, 12: 4230, 16: 5640, 20: 7050 },
        double: { 1: 600, 2: 905, 3: 1200, 4: 1510, 8: 3020, 12: 4530, 16: 6040, 20: 7550 },
        single: { 1: 675, 2: 1010, 3: 1350, 4: 1690, 8: 3380, 12: 5070, 16: 6760, 20: 8450 },
        hotelDouble: { 1: 620, 2: 970, 3: 1320, 4: 1640, 8: 3280, 12: 4920, 16: 6560, 20: 8200 },
        hotelSingle: { 1: 850, 2: 1400, 3: 1950, 4: 2440, 8: 4880, 12: 7320, 16: 9760, 20: 12200 },
      },
    },
    {
      id: 'exam-business',
      name: 'TOEIC / TOEFL / IELTS / Business',
      type: 'Exam & Business',
      lessons: '4节1:1 + 2节小组课',
      suitable: '适合考试准备、商务沟通和有明确输出目标的学生。',
      fees: {
        triple: { 1: 580, 2: 875, 3: 1160, 4: 1460, 8: 2920, 12: 4380, 16: 5840, 20: 7300 },
        double: { 1: 620, 2: 935, 3: 1240, 4: 1560, 8: 3120, 12: 4680, 16: 6420, 20: 7800 },
        single: { 1: 695, 2: 1040, 3: 1390, 4: 1740, 8: 3480, 12: 5220, 16: 6960, 20: 8700 },
        hotelDouble: { 1: 640, 2: 1000, 3: 1360, 4: 1690, 8: 3380, 12: 5070, 16: 6760, 20: 8450 },
        hotelSingle: { 1: 870, 2: 1430, 3: 1990, 4: 2490, 8: 4980, 12: 7470, 16: 9960, 20: 12450 },
      },
    },
  ];

  readonly roomOptions: RoomOption[] = [
    { id: 'triple', name: '学生宿舍3人房', note: '标准宿舍最低预算组合，适合长期学习和能接受共享空间的人。' },
    { id: 'double', name: '学生宿舍2人房', note: '费用和舒适度平衡，适合朋友同行或想降低干扰的学生。' },
    { id: 'single', name: '学生宿舍1人房', note: '隐私较好，适合备考、工作人士或休息要求较高的人。' },
    { id: 'hotelDouble', name: 'Hotel One 2人房', note: '官方列2026年6月28日以后Hotel One住宿参考价，水电包含。' },
    { id: 'hotelSingle', name: 'Hotel One 1人房', note: '舒适度更高，预算也明显上升，适合重视住宿的人。' },
  ];

  readonly localFeeGuides: LocalFeeGuide[] = [
    { weeks: 1, title: '1周', text: '短期重点准备SSP、学生证、教材、电水或押金等当地费用；签证延期通常无需。' },
    { weeks: 2, title: '2周', text: '通常仍以SSP、教材、电水、押金和个人消费为主，正式金额以到校说明为准。' },
    { weeks: 3, title: '3周', text: '短期项目仍需核对SSP、教材、押金和水电；Hotel One水电通常包含。' },
    { weeks: 4, title: '4周', text: '4周通常无需签证延期；需准备SSP、ID、教材、水电、押金和个人消费。' },
    { weeks: 8, title: '8周', text: '官方表列第一次签证延期PHP4,360；长期学生还要确认SSP I-Card。' },
    { weeks: 12, title: '12周', text: '官方表列第二次签证延期累计PHP9,990，并需预留教材、水电和生活费。' },
    { weeks: 16, title: '16周', text: '官方表列第三次签证延期累计PHP10,690，建议让学校列完整当地费用清单。' },
    { weeks: 20, title: '20周', text: '官方表列第四次签证延期累计PHP14,350，长期学习需特别确认签证和I-Card。' },
  ];

  readonly localFees: LocalFee[] = [
    { item: 'Registration', amount: 'USD 100', note: '报名注册费，官方费用表列为另计。' },
    { item: 'Bacolod Pickup', amount: 'USD 30', note: '巴科洛德机场接机参考费用。' },
    { item: 'SSP', amount: 'PHP 7,800', note: 'Special Study Permit，官方当地费用表列示。' },
    { item: 'SSP I-Card', amount: 'PHP 4,500', note: '官方当地费用表列示，长期学习需确认适用条件。' },
    { item: 'Student ID', amount: 'PHP 200', note: '学生证发行费用。' },
    { item: 'Textbooks', amount: 'PHP 200-400 / 本', note: '按实际课程和教材购买。' },
    { item: 'Electricity', amount: 'PHP 500-2,000 / 月', note: '学生宿舍水电另计；Hotel One住宿官方说明水电包含。' },
    { item: 'Water', amount: 'PHP 200 / 周', note: '学生宿舍水费参考。' },
    { item: 'Dorm Deposit', amount: 'USD 50 或 PHP 2,500', note: '宿舍押金，退房检查后按规则退还或抵扣。' },
    { item: 'Visa Extension', amount: 'PHP 4,360起', note: '8周起通常需要延期；官方表列到20周/24周阶段费用。' },
    { item: 'Extra 1:1', amount: 'USD 140 / 4周', note: '官方表列追加一对一课参考费用。' },
  ];

  readonly schedule: ScheduleItem[] = [
    { time: '07:00 - 08:00', title: '早餐与上课准备', text: '套餐费包含餐食，日常动线以宿舍、校园和教室为主。' },
    { time: '08:00 - 12:00', title: '上午一对一 / 小组课', text: 'Regular和考试/商务课程为4节一对一，Intensive为5节一对一。' },
    { time: '12:00 - 13:00', title: '午餐与休息', text: '大学校园环境适合规律生活，也可使用校内设施和公共区域。' },
    { time: '13:00 - 16:00', title: '下午课程与复习', text: '小组课和一对一搭配，适合补强表达、听力、语法和考试技能。' },
    { time: '课后', title: '大学交流与自习', text: '官方介绍列大学课堂、Buddy、志愿活动和设施使用等体验，需要按当期安排确认。' },
    { time: '周末', title: 'Bacolod生活与短途活动', text: '巴科洛德生活成本友好，适合中长期学习期间安排低压力城市生活。' },
  ];

  readonly serviceSteps: ProcessStep[] = [
    { icon: 'account_balance', title: '先确认是否适合大学校园', text: 'LSLC的核心差异是La Salle校园环境，如果你想海边度假则先比较宿务。' },
    { icon: 'menu_book', title: '按目标选Regular或Intensive', text: '一般口语基础可先看Regular，短期强化和考试商务可看更高课量。' },
    { icon: 'hotel', title: '学生宿舍或Hotel One', text: '2026费用表有两套住宿价格，预算和舒适度差异明显，需要先选房型。' },
    { icon: 'receipt_long', title: '拆分USD和PHP', text: '前期套餐费、注册费、接机费以USD估算，当地费用以PHP另列。' },
    { icon: 'calendar_month', title: '确认2026课时制度', text: '2026年3月起每节课45分钟，报名时需按新课表确认上课节数。' },
    { icon: 'verified', title: '核对正式Invoice', text: '最终按学校当期费用、空房、优惠、接机和校规确认。' },
  ];

  readonly notes = [
    '官方费用表说明课程住宿套餐包含学费、住宿、餐食、洗衣和清洁，不含注册费、接机费、当地费用、保险和个人消费。',
    '官方价格表列2026年6月28日以后Hotel One住宿选项，水电包含；学生宿舍水电需另计。',
    '2026年3月起每节课从50分钟改为45分钟，课程节数和作息以学校当期课表为准。',
    '9周以上费用官方说明可按4周价格叠加估算，长期学习仍需向学校确认正式invoice。',
    'University of St. La Salle的大学课堂、Buddy、志愿活动和设施使用需按当期安排与可参加条件确认。',
    '签证、SSP、I-Card和当地费用可能随菲律宾政府或学校政策调整，正式报名要以学校最新说明为准。',
  ];

  readonly faqs: FaqItem[] = [
    {
      question: 'LSLC语言学校在哪里？',
      answer:
        'LSLC位于菲律宾Bacolod的University of St. La Salle校园内，是大学校园型语言学校，适合想要安静学习城市和大学资源的学生。',
    },
    {
      question: 'LSLC 4周最低大概多少钱？',
      answer:
        '按官方2026费用表，Regular ESL学生宿舍3人房4周为USD1,360，加注册费USD100和Bacolod接机USD30，前期参考约USD1,490，另有PHP当地费用。',
    },
    {
      question: 'LSLC套餐费用包含什么？',
      answer:
        '官方费用表说明课程住宿套餐包含学费、住宿、餐食、洗衣和清洁；SSP、签证、水电、教材、押金、保险和个人消费另计。',
    },
    {
      question: 'LSLC适合考试课程吗？',
      answer:
        '可以放进候选。官方费用表列TOEIC、TOEFL、IELTS和Business课程，课程为5节一对一加2节小组课的方向。',
    },
    {
      question: 'Hotel One价格是什么意思？',
      answer:
        'LSLC官方费用表列出2026年6月28日以后Hotel One住宿的1人房和2人房价格，通常比学生宿舍更舒适，也更贵，水电包含。',
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
    { label: 'LSLC官方首页', url: 'https://lslc.jp/' },
    { label: 'LSLC官方学校介绍', url: 'https://lslc.jp/about-school/about-lslc/' },
    { label: 'LSLC官方2026课程费用表', url: 'https://lslc.jp/course/fee-table/' },
    { label: 'LSLC官方ESL课程说明', url: 'https://lslc.jp/course/esl/' },
    { label: 'LSLC官方TOEIC/TOEFL/IELTS课程说明', url: 'https://lslc.jp/course/exam/' },
    { label: 'LSLC官方Business课程说明', url: 'https://lslc.jp/course/business/' },
    { label: 'LSLC官方2026课时公告', url: 'https://lslc.jp/news/time-schedule/' },
    { label: 'LSLC官方报名流程', url: 'https://lslc.jp/inquiry/process/' },
  ];

  get filteredGalleryImages(): GalleryImage[] {
    return this.selectedGalleryCategory === '全部'
      ? this.galleryImages
      : this.galleryImages.filter((image) => image.category === this.selectedGalleryCategory);
  }

  get selectedCourse(): CourseOption {
    return this.courses.find((course) => course.id === this.selectedCourseId) ?? this.courses[0];
  }

  get selectedRoom(): RoomOption {
    return this.roomOptions.find((room) => room.id === this.selectedRoomId) ?? this.roomOptions[0];
  }

  get selectedLocalFeeGuide(): LocalFeeGuide {
    return this.localFeeGuides.find((fee) => fee.weeks === this.selectedWeeks) ?? this.localFeeGuides[3];
  }

  get programFeeForSelectedWeeks(): number {
    return this.selectedCourse.fees[this.selectedRoomId][this.selectedWeeks];
  }

  get quoteUsd(): number {
    return this.registrationFeeUsd + this.pickupFeeUsd + this.programFeeForSelectedWeeks;
  }

  get quoteText(): string {
    return `${this.formatUsd(this.quoteUsd)} 起`;
  }

  get fourWeekStartingText(): string {
    const regular = this.courses.find((course) => course.id === 'regular') ?? this.courses[0];
    return this.formatUsd(this.registrationFeeUsd + this.pickupFeeUsd + regular.fees.triple[4]);
  }

  get formulaText(): string {
    return `${this.selectedCourse.name} ${this.selectedWeeks}周${this.selectedRoom.name}套餐 + 注册费 + 接机费`;
  }

  get courseFeeRows() {
    return this.courses.map((course) => ({
      course: course.name,
      lessons: course.lessons,
      triple: this.formatUsd(course.fees.triple[4]),
      double: this.formatUsd(course.fees.double[4]),
      single: this.formatUsd(course.fees.single[4]),
      hotelDouble: this.formatUsd(course.fees.hotelDouble[4]),
      hotelSingle: this.formatUsd(course.fees.hotelSingle[4]),
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

  formatUsd(value: number): string {
    return `USD ${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  }
}

import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

type GalleryCategory = '全部' | '校园' | '课堂' | '住宿' | '生活';
type ShortWeekOption = 1 | 2 | 3;
type WeekOption = ShortWeekOption | 4 | 8 | 12 | 16 | 20 | 24;
type CourseId =
  | 'esl-basic'
  | 'esl-standard'
  | 'esl-premium'
  | 'esl-intensive'
  | 'ielts'
  | 'ielts-guarantee'
  | 'tesol'
  | 'business'
  | 'working-holiday'
  | 'guardian'
  | 'junior-basic'
  | 'junior-premium'
  | 'internship-first'
  | 'internship-later';
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
  tuition4w: number;
  tuitionLabel?: string;
  note?: string;
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

interface LocalFeeSummary {
  weeks: WeekOption;
  totalPhp: number;
  visa: string;
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
  selector: 'app-mk-school',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './mk-school.component.html',
  styleUrls: [
    '../cebu-school-detail-layout.css',
    '../cebu-school-detail-content.css',
    '../cebu-school-detail-responsive.css',
    '../ev-school/ev-school-detail.component.css',
    './mk-school.component.css',
  ],
})
export class MkSchoolComponent {
  readonly galleryCategories: GalleryCategory[] = ['全部', '校园', '课堂', '住宿', '生活'];
  selectedGalleryCategory: GalleryCategory = '全部';
  selectedCourseId: CourseId = 'esl-basic';
  selectedRoomId: RoomId = 'quad';
  selectedWeeks: WeekOption = 4;
  selectedStartDate = '2026-09-07';
  quoteCalculated = false;

  readonly registrationFeeUsd = 100;
  readonly weekOptions: WeekOption[] = [1, 2, 3, 4, 8, 12, 16, 20, 24];
  readonly shortStayRates: Readonly<Record<ShortWeekOption, number>> = {
    1: 0.4,
    2: 0.65,
    3: 0.85,
  };

  readonly quickInfo: QuickInfo[] = [
    {
      icon: 'location_on',
      label: '城市',
      value: 'Iloilo / Westwoods',
      note: '公开资料显示MK位于Iloilo City Mandurriao一带，校区在Westwoods Subdivision内。',
    },
    {
      icon: 'school',
      label: '学校定位',
      value: 'Semi-Sparta + 校内住宿',
      note: '公开价格表列晚间自习20:00-22:00，Sparta学生需参加；实际管理规则以当期学生手册为准。',
    },
    {
      icon: 'menu_book',
      label: '课程方向',
      value: 'ESL / IELTS / TESOL / Junior',
      note: '课程包括ESL Basic至Intensive、IELTS、TESOL附加、Business、Working Holiday、Junior和Internship。',
    },
    {
      icon: 'home_work',
      label: '校园生活',
      value: '独立Compound',
      note: 'CPU 2026年文章提到MK在Westwoods有自己的compound，含宿舍、篮球场、咖啡/餐厅和健身房等设施。',
    },
    {
      icon: 'flight_land',
      label: '交通',
      value: 'Iloilo Airport约20分钟',
      note: 'Study Philippines公开页面列Iloilo机场车程约20分钟，周末接机费需另算。',
    },
    {
      icon: 'payments',
      label: '4周起价',
      value: 'USD 1,270 + PHP当地费起',
      note: '按ESL Basic + 4人亲子房 + 注册费USD100估算；4人房仅限亲子或团体，当地PHP费用参考4周PHP15,050。',
    },
  ];

  readonly galleryImages: GalleryImage[] = [
    {
      category: '校园',
      title: 'MK Iloilo校园入口',
      description: '公开学校图片中的MK Academy校区外观，适合先判断Iloilo校区氛围。',
      src: 'https://philenglish.net/upload/product/review-mk-academy-moi-truong-hoc-tap-an-toan-chuan-quoc-te-tai-iloilo-24.jpg',
    },
    {
      category: '课堂',
      title: '一对一课堂',
      description: 'MK课程重点是一对一课时组合，ESL、IELTS和亲子课程可按目标调整强度。',
      src: 'https://philenglish.net/upload/userfiles/images/Review-du-hoc/review-mk-academy-moi-truong-hoc-tap-an-toan-chuan-quoc-te-tai-iloilo-7.jpg',
    },
    {
      category: '生活',
      title: '自习与图书空间',
      description: '公开图片展示MK自习/图书区域；晚间自习规则需按课程和管理模式确认。',
      src: 'https://www.philippine-ryugaku.com/wp-content/uploads/2023/03/mk-library-1600x1200.jpg',
    },
    {
      category: '校园',
      title: 'Westwoods校区入口参考',
      description: 'MK位于Iloilo较安静生活区，适合想避开宿务热闹环境的学生。',
      src: 'https://www.oxbridge.com.tw/assets/images/language-school/mk-iloilo_001.jpg',
    },
    {
      category: '住宿',
      title: '校内宿舍参考',
      description: '公开住宿图片用于判断基础房型氛围；实际楼栋、房型和空房以学校回复为准。',
      src: 'https://www.ceburyugaku-master.com/school/img/mk/dormitory_03.webp',
    },
  ];

  readonly basicInfo: BasicInfoRow[] = [
    { label: '学校名称', value: '菲律宾伊洛伊洛MK Language Training Center' },
    { label: '英文名称', value: 'MK Language Training Center / MK Education / Metro Korea Language Training Center' },
    { label: '城市区域', value: 'Iloilo City, Mandurriao, Westwoods Subdivision / Barangay Dungon-C一带' },
    { label: '参考地址', value: 'Lot 43, 44, 45 Block 44, Barangay Dungon-C, Mandurriao, Iloilo City, Philippines' },
    { label: '课程方向', value: 'ESL Basic、ESL Standard、ESL Premium、ESL Intensive、IELTS、TESOL、Business、Working Holiday、Guardian、Junior和Internship。' },
    { label: '学习模式', value: '公开资料以Semi-Sparta、英语环境、晚间自习和校内住宿一体管理为主；具体门禁和处罚规则需当期确认。' },
    { label: '设施参考', value: '校内宿舍、教室、餐厅/咖啡、篮球场、健身房、自习室、洗衣与清洁服务等。' },
    { label: '资料提醒', value: '官方域名mk-edu.net在本次整理时无法稳定抓取；页面费用按公开学校资料页汇总，正式报名仍以学校invoice为准。' },
  ];

  readonly highlights: Highlight[] = [
    {
      image: this.galleryImages[0].src,
      title: 'Iloilo安静学习城市',
      text: 'MK适合想避开宿务热闹生活圈、在较低干扰城市做长期ESL或亲子学习的人。',
    },
    {
      image: this.galleryImages[1].src,
      title: 'ESL一对一课时选择多',
      text: 'ESL Basic到ESL Intensive按一对一和小组课比例调整，从预算型到高密度口语训练都能放进报价比较。',
    },
    {
      image: this.galleryImages[2].src,
      title: '晚自习和英语环境推动',
      text: '公开资料列English Zone Policy和晚间自习安排，适合需要一点外部节奏推动的学生。',
    },
    {
      image: this.galleryImages[4].src,
      title: '成人、考试、青少年都可看',
      text: '除成人ESL外，MK还可比较IELTS、TESOL、Business、Working Holiday、Junior和Internship路线。',
    },
  ];

  readonly suitableFor: FitItem[] = [
    { title: '想控制预算长期读ESL', text: '4人房和ESL低阶课程组合门槛较友好，适合8-24周打基础。' },
    { title: '喜欢小众安静城市', text: 'Iloilo生活节奏比宿务和马尼拉更平稳，适合少干扰学习。' },
    { title: '想要校内住宿一体管理', text: '课堂、宿舍和生活设施集中，日常动线简单，第一次菲律宾游学也容易适应。' },
    { title: '亲子或考试路线一起比较', text: 'Junior、Guardian、IELTS和TESOL等课程可和成人ESL一起核价。' },
  ];

  readonly notSuitableFor: FitItem[] = [
    { title: '想要海边或大城市热闹生活', text: 'MK在Iloilo住宅/学习区，不是Mactan海边度假型，也不是马尼拉商务城市体验。' },
    { title: '只接受最新官方网页价格', text: 'mk-edu.net本次抓取不稳定，报名前必须由顾问向学校确认正式invoice。' },
    { title: '一定要高压Sparta封闭管理', text: '公开资料更适合按Semi-Sparta理解，若要极强管理可同步比较碧瑶Sparta学校。' },
    { title: '不想拆分USD和PHP费用', text: 'MK报价需要拆课程、住宿、注册费和当地PHP费用，长期学习还会有签证延期与I-Card。' },
  ];

  readonly courses: CourseOption[] = [
    { id: 'esl-basic', name: 'ESL Basic', type: 'Budget ESL', lessons: '3节1:1 + 2节1:5 + 2节自习', suitable: '适合预算优先、基础口语和长期适应。', tuition4w: 650 },
    { id: 'esl-standard', name: 'ESL Standard', type: 'Standard ESL', lessons: '4节1:1 + 2节1:5 + 2节自习', suitable: '适合一般成人口语、听力和表达强化。', tuition4w: 730 },
    { id: 'esl-premium', name: 'ESL Premium', type: 'Premium ESL', lessons: '5节1:1 + 2节1:5 + 2节自习', suitable: '适合想增加个别纠正和输出练习。', tuition4w: 820 },
    { id: 'esl-intensive', name: 'ESL Intensive', type: '1:1 Intensive', lessons: '7节1:1 + 2节自习', suitable: '适合不想上小组课、想集中一对一训练的人。', tuition4w: 930 },
    { id: 'ielts', name: 'IELTS', type: 'Exam Prep', lessons: '4节1:1 + 2节1:5 + 2节自习', suitable: '适合雅思基础提升、题型熟悉和听说读写训练。', tuition4w: 880 },
    { id: 'ielts-guarantee', name: 'IELTS Guarantee', type: 'Score Goal', lessons: '6节1:1 + 2节1:5 + 2节强制自习', suitable: '适合有分数目标且能配合出勤、模考和规则的学生。', tuition4w: 1050 },
    {
      id: 'tesol',
      name: 'TESOL Add-on',
      type: 'WVSU Add-on',
      lessons: '任一MK课程 + 周六WVSU 8小时TESOL课',
      suitable: '适合想把ESL和TESOL证书方向组合的学生。',
      tuition4w: 1000,
      tuitionLabel: 'USD 350 + WVSU SSP（附加）',
      note: '估算按ESL Basic USD650 + TESOL附加USD350计算，WVSU SSP另计。',
    },
    { id: 'business', name: 'Business Course', type: 'Business English', lessons: '4节1:1 + 2节1:5 + 2节自习', suitable: '适合工作沟通、商务表达和职场英语提升。', tuition4w: 880 },
    { id: 'working-holiday', name: 'Working Holiday', type: 'Work English', lessons: '4节1:1 + 2节1:5 + 2节自习', suitable: '适合为海外工作与生活场景准备英语。', tuition4w: 800 },
    { id: 'guardian', name: 'Guardian 监护人', type: 'Parent', lessons: '4节1:1 + 2节自习', suitable: '适合陪读家长同步学习。', tuition4w: 570 },
    { id: 'junior-basic', name: 'Junior Basic 青少年', type: 'Junior', lessons: '4节1:1 + 1节1:5 + 2节自习', suitable: '适合青少年基础英文提升。', tuition4w: 770 },
    { id: 'junior-premium', name: 'Junior Premium 青少年', type: 'Junior', lessons: '6节1:1 + 3节1:5 + 2节自习', suitable: '适合青少年高密度短期强化。', tuition4w: 990, note: '最低入学年龄5周岁。' },
    { id: 'internship-first', name: 'Internship Course 前4周', type: 'Practicum', lessons: '4节1:1 + 3节1:5 + 2节自习', suitable: '实习课程第一阶段的英语准备。', tuition4w: 860, note: '完整课程最少报名8周。' },
    { id: 'internship-later', name: 'Internship Course 后续4周', type: 'Practicum', lessons: '4节1:1 + 3小时实习 + 2节自习', suitable: '完成前4周后进入英语与实习结合阶段。', tuition4w: 860, note: '须与前4周组合，完整课程最少报名8周。' },
  ];

  readonly roomOptions: RoomOption[] = [
    { id: 'quad', name: '4人亲子房 / Quad Family', fee4w: 520, note: '仅限亲子或团体，普通成人报名需先确认是否可选。' },
    { id: 'triple', name: '3人房 / Triple', fee4w: 600, note: '费用和舒适度平衡，适合成人或朋友同行。' },
    { id: 'double', name: '2人房 / Double', fee4w: 700, note: '更容易休息和整理学习节奏，预算中等。' },
    { id: 'single', name: '1人房 / Single', fee4w: 990, note: '隐私最高，适合工作人士、考试备考或对休息要求高的人。' },
  ];

  readonly localFeeSummaries: LocalFeeSummary[] = [
    { weeks: 4, totalPhp: 15050, visa: '4周签证延期参考为PHP 0' },
    { weeks: 8, totalPhp: 21180, visa: '8周签证延期参考PHP 3,230' },
    { weeks: 12, totalPhp: 31880, visa: '12周签证延期参考PHP 7,730，通常需I-Card' },
    { weeks: 16, totalPhp: 37310, visa: '16周签证延期参考PHP 10,260，通常需I-Card' },
    { weeks: 20, totalPhp: 42740, visa: '20周签证延期参考PHP 12,790，通常需I-Card' },
    { weeks: 24, totalPhp: 48170, visa: '24周签证延期参考PHP 15,320，通常需I-Card' },
  ];

  readonly localFees: LocalFee[] = [
    { item: 'Entry / Registration', amount: 'USD 100', note: '报名注册费；前期USD费用中单独计算。' },
    { item: 'SSP', amount: 'PHP 6,000', note: 'Special Study Permit，当地支付，金额以学校和移民局当期为准。' },
    { item: 'Visa Extension', amount: 'PHP 0 - 15,320', note: '按4-24周递增；4周参考无需延期，长期需续签。' },
    { item: 'I-Card', amount: 'PHP 3,300', note: '公开表列8周以上/长期学习通常需要。' },
    { item: 'Iloilo Pickup', amount: 'PHP 1,000', note: '周末Iloilo接机参考；抵达日期和机场需确认。' },
    { item: 'Electricity', amount: 'PHP 1,000 / 4周', note: '电费参考，超额或政策调整以学校为准。' },
    { item: 'Water', amount: 'PHP 500 / 4周', note: '水费参考。' },
    { item: 'Deposit', amount: 'PHP 5,000', note: '押金，退房检查后按规则退还或抵扣。' },
    { item: 'Management Fee', amount: 'PHP 400 / 4周', note: '校内管理/服务费用参考。' },
    { item: 'Books', amount: '约PHP 200 / book', note: '教材按实际购买；公开表按约PHP1,000/4周估算。' },
    { item: 'Photo / ID', amount: 'PHP 150', note: '照片/学生证参考费用。' },
  ];

  readonly schedule: ScheduleItem[] = [
    { time: '07:00 - 08:00', title: '早餐与上课准备', text: '校内住宿和三餐一体，适合规律学习生活。' },
    { time: '08:00 - 12:00', title: '上午一对一 / 小组课', text: '按ESL、IELTS或Family课程安排听说读写、语法、词汇和表达训练。' },
    { time: '12:00 - 13:00', title: '午餐与休息', text: '公开费用说明列三餐包含在住宿服务中，菜单和餐食规则以学校为准。' },
    { time: '13:00 - 17:00', title: '下午课程与补强', text: 'ESL高阶和IELTS课程会有更高密度一对一或小组课安排。' },
    { time: '20:00 - 22:00', title: '晚间自习', text: '公开资料列Sparta学生晚间自习为强制，实际适用范围需按课程和校规确认。' },
    { time: '周末', title: 'Iloilo生活与短途旅行', text: '可安排Iloilo市区、Guimaras或周边活动，未成年和门禁规则要提前确认。' },
  ];

  readonly serviceSteps: ProcessStep[] = [
    { icon: 'location_city', title: '先确认是否适合Iloilo', text: '如果你要安静、预算友好和长期ESL，MK更对题；想要海边热闹则先比较宿务。' },
    { icon: 'menu_book', title: '按课量选ESL级别', text: 'ESL Basic、Standard、Premium和Intensive差别主要在一对一、小组课和总课量。' },
    { icon: 'hotel', title: '锁定房型与周数', text: '4人房、3人房、2人房、1人房会明显影响总价和舒适度。' },
    { icon: 'receipt_long', title: '拆分USD和PHP', text: '课程住宿注册费按USD估算，SSP、签证、电水、押金、教材和接机按PHP另列。' },
    { icon: 'verified', title: '向学校核正式报价', text: 'mk-edu.net抓取不稳定，正式报名必须核对学校当期invoice、空房和优惠。' },
    { icon: 'support_agent', title: '出发前后持续跟进', text: '协助接机、到校费用、教材、换课、住宿问题和续读/转校沟通。' },
  ];

  readonly notes = [
    '本页费用按公开学校资料整理；过去促销有效期已经过期，不纳入当前估算。',
    '公开资料列宿舍费通常包含三餐、洗衣、房间清洁和校内设施使用，但实际包含项目以学校当期说明为准。',
    'TESOL属于USD350附加路线，需叠加任一MK课程，并另付WVSU SSP等学校/大学费用。',
    '短期价格按4周课程费和住宿费换算：1周40%、2周65%、3周85%；注册费不参与换算。',
    'Iloilo机场接机、到校时间、周末入住和退房规则需要随航班确认。',
    '长期学习会产生签证延期、I-Card和更多教材费用，页面估算只作为初筛预算。',
  ];

  readonly faqs: FaqItem[] = [
    {
      question: 'MK Language Training Center在哪里？',
      answer:
        'MK位于菲律宾Iloilo City的Westwoods Subdivision / Mandurriao一带。公开资料列Iloilo机场约20分钟车程，适合想选择安静小众城市的学生。',
    },
    {
      question: 'MK 4周最低大概多少钱？',
      answer:
        '按2025费用表，ESL Basic课程费USD650，4人亲子房USD520，注册费USD100，4周前期USD参考约USD1,270；4人房仅限亲子或团体，当地PHP费用4周参考约PHP15,050。',
    },
    {
      question: 'MK是Sparta学校吗？',
      answer:
        '更适合先按Semi-Sparta理解。公开资料列English Zone Policy和20:00-22:00晚间自习，且说明Sparta学生强制参加；具体门禁、外出和处罚规则要以当期学生手册为准。',
    },
    {
      question: 'MK适合亲子吗？',
      answer:
        '可以放进亲子候选，因为费用表有Junior Basic/Premium、Guardian和4人亲子房。低龄年龄、监护、房型、活动和陪读规则需要报名时逐项确认。',
    },
    {
      question: '为什么页面没有直接引用mk-edu.net价格？',
      answer:
        '本次整理时mk-edu.net无法稳定抓取内容，所以页面使用其他公开学校资料页、Iloilo相关公开报道和学校介绍资料交叉整理。正式价格仍需由顾问向学校确认。',
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
    { label: 'MK官方域名', url: 'http://mk-edu.net/' },
    { label: 'MK Iloilo公开课程与费用表', url: 'https://tienganhtaiphi.com/truong-anh-ngu-mk-iloilo/' },
    { label: 'Study Philippines MK学校资料', url: 'https://www.study-philippines.com/school/1.html' },
    {
      label: 'Central Philippine University 2026年MK访问报道',
      url: 'https://cpu.edu.ph/news/cpu-cas-dlmch-visits-mk-language-learning-center-in-preparation-for-practicum-on-the-job-training/',
    },
    { label: 'Uhakfinder MK费用与住宿资料', url: 'https://www.uhakfinder.com/bbs/board.php?bo_table=school_fee&wr_id=242' },
    { label: '菲律宾留学资料站MK页面', url: 'https://www.ph-ryugaku.com/school/mk-education/' },
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

  get selectedLocalFeeSummary(): LocalFeeSummary {
    if (this.selectedWeeks < 4) {
      return {
        weeks: this.selectedWeeks,
        totalPhp: this.localFeeSummaries[0].totalPhp,
        visa: `${this.selectedWeeks}周无需签证延期；当地费暂按4周档参考`,
      };
    }
    return this.localFeeSummaries.find((fee) => fee.weeks === this.selectedWeeks) ?? this.localFeeSummaries[0];
  }

  get durationMultiplier(): number {
    if (this.selectedWeeks < 4) {
      return this.shortStayRates[this.selectedWeeks as ShortWeekOption];
    }
    return this.selectedWeeks / 4;
  }

  get tuitionForSelectedWeeks(): number {
    return this.selectedCourse.tuition4w * this.durationMultiplier;
  }

  get roomFeeForSelectedWeeks(): number {
    return this.selectedRoom.fee4w * this.durationMultiplier;
  }

  get quoteUsd(): number {
    return this.registrationFeeUsd + this.tuitionForSelectedWeeks + this.roomFeeForSelectedWeeks;
  }

  get quoteText(): string {
    return `${this.formatUsd(this.quoteUsd)} 起`;
  }

  get fourWeekStartingText(): string {
    return this.formatUsd(this.registrationFeeUsd + this.courses[0].tuition4w + this.roomOptions[0].fee4w);
  }

  get localFeeText(): string {
    return this.formatPhp(this.selectedLocalFeeSummary.totalPhp);
  }

  get formulaText(): string {
    if (this.selectedWeeks < 4) {
      return `(${this.selectedCourse.name} + ${this.selectedRoom.name}) 4周价 x ${this.durationMultiplier * 100}% + 注册费`;
    }
    return `(${this.selectedCourse.name} + ${this.selectedRoom.name}) x ${this.selectedWeeks}周 / 4 + 注册费`;
  }

  get courseFeeRows() {
    return this.courses.map((course) => ({
      course: course.name,
      tuition: course.tuitionLabel ?? this.formatUsd(course.tuition4w),
      quad: this.formatUsd(course.tuition4w + this.roomOptions[0].fee4w),
      triple: this.formatUsd(course.tuition4w + this.roomOptions[1].fee4w),
      double: this.formatUsd(course.tuition4w + this.roomOptions[2].fee4w),
      single: this.formatUsd(course.tuition4w + this.roomOptions[3].fee4w),
      suitable: course.note ? `${course.suitable} ${course.note}` : course.suitable,
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
    return `USD ${value.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
  }

  formatPhp(value: number): string {
    return `PHP ${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  }
}

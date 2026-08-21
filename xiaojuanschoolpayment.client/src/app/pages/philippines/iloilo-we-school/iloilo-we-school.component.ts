import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

type GalleryCategory = '全部' | '校园' | '教室' | '住宿' | '餐厅' | '设施';
type WeekOption = 4 | 8 | 12 | 16 | 20 | 24;

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
  shortName: string;
  price4Weeks: number;
  note: string;
}

interface CourseOption {
  id: string;
  name: string;
  type: string;
  lessons: string;
  suitable: string;
  tuition4Weeks: number;
  note: string;
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

interface SourceLink {
  label: string;
  url: string;
}

interface SpecialCourseFee {
  label: string;
  lessons: string;
  reference: string;
  note: string;
}

@Component({
  selector: 'app-iloilo-we-school',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './iloilo-we-school.component.html',
  styleUrls: [
    '../cebu-school-detail-layout.css',
    '../cebu-school-detail-content.css',
    '../cebu-school-detail-responsive.css',
    '../ev-school/ev-school-detail.component.css',
    './iloilo-we-school.component.css',
  ],
})
export class IloiloWeSchoolComponent {
  readonly galleryCategories: GalleryCategory[] = [
    '全部',
    '校园',
    '教室',
    '住宿',
    '餐厅',
    '设施',
  ];
  readonly weekOptions: WeekOption[] = [4, 8, 12, 16, 20, 24];
  readonly registrationFee = 100;
  readonly usdToCny = 7.2;

  selectedGalleryCategory: GalleryCategory = '全部';
  selectedCourseId = 'esl-a';
  selectedRoomId = 'triple';
  selectedWeeks: WeekOption = 4;
  selectedStartDate = '2026-09-07';
  quoteCalculated = false;

  readonly quickInfo: QuickInfo[] = [
    {
      icon: 'location_on',
      label: '位置',
      value: 'E. Lopez St, Jaro, Iloilo',
      note: '官网页脚和课程页列地址为E. Lopez St, San Vicente Jaro, Iloilo City 5000。',
    },
    {
      icon: 'history_edu',
      label: '学校历史',
      value: '2003年成立',
      note: '官网写明学校2003年创立，2019年迁至Iloilo City更便利的新位置。',
    },
    {
      icon: 'assignment',
      label: '课程重点',
      value: 'ESL / TOEIC / Business / IELTS',
      note: '官方课程页列ESL A-D、TOEIC、Business、IELTS、Junior和Guardian课程。',
    },
    {
      icon: 'verified',
      label: '考试资源',
      value: 'Computer-based IDP IELTS Center',
      note: '官方费用页写明WE Academy为电脑化IDP官方IELTS考点，并列IELTS官方考试安排。',
    },
    {
      icon: 'hotel',
      label: '住宿',
      value: '1人 / 2人 / 3人 / Family',
      note: '官方住宿费列Single、Double、Triple和Family房型，三餐、清洁和押金规则另列。',
    },
    {
      icon: 'payments',
      label: '4周参考',
      value: 'USD 1,100起 + 注册费',
      note: '官方费用页ESL A + 三人房4周USD1,100；注册费USD100和当地PHP费用另算。',
    },
  ];

  readonly galleryImages: GalleryImage[] = [
    {
      category: '校园',
      title: 'WE Academy宿舍与校区建筑',
      description:
        'Iloilo市区公寓型校园，适合想在小众城市中兼顾学习、住宿和生活便利的学生。',
      src: 'https://www.philja.com/school/sch_img/we_i/main4.jpg',
    },
    {
      category: '住宿',
      title: '三人房宿舍参考',
      description:
        '三人房是官方费用表中最低的宿舍房型口径，正式安排需按性别和空房确认。',
      src: 'https://cebu21.jp/include/schoolno2/weacademy/Room/20200513_150028.jpg',
    },
    {
      category: '设施',
      title: '自习室',
      description:
        '官方图库中的自习空间，适合晚上复习、考试备考和长期学生使用。',
      src: 'https://weacademy-iloilo.com/data/file/gallery/1025532504_tj7NFG4S_87c96ecc977e12feed22f038cca6869b655ae5ba.jpg',
    },
    {
      category: '住宿',
      title: '单人房参考',
      description:
        '适合重视隐私或长期学习的成人学生；水电、洗衣和押金需另行预算。',
      src: 'https://cebu21.jp/include/schoolno2/weacademy/Room/_DSC1274.jpg',
    },
    {
      category: '校园',
      title: '新校园走廊',
      description:
        'WE Academy 2019年迁入更便利的新位置，官网强调设施新、费用低和教师经验。',
      src: 'https://weacademy-iloilo.com/data/file/gallery/1025532504_9YHVXTpW_ee5f263fbf759d1fb07c110c8d9c9f37caff8bea.jpg',
    },
    {
      category: '餐厅',
      title: 'Dining Room / Meal',
      description:
        '官方页面写明提供每日三餐、每周两次房间清洁和一次免费洗衣券。',
      src: 'https://weacademy-iloilo.com/data/file/dormitory/1025532504_IlNsCm1d_a04eab9289f3f8d85ee71ecc6f836a14cdfebcd4.jpg',
    },
  ];

  readonly basicInfo: BasicInfoRow[] = [
    { label: '学校名称', value: '菲律宾伊洛伊洛WE Academy' },
    { label: '英文名称', value: 'We Academy / WE Academy Iloilo' },
    { label: '地址', value: 'E. Lopez St, San Vicente Jaro, Iloilo City 5000, Philippines' },
    { label: '成立时间', value: 'Since 2003；官网写明2019年5月迁至Iloilo City更便利的位置' },
    { label: '容量', value: '官方列Capacity 150，Dorm rooms 74' },
    { label: '教师', value: '官方列Teachers 50-75' },
    { label: '设施', value: 'Café、Swimming pool、Basketball court、Gym、Library、Lobby' },
    { label: '主要课程', value: 'ESL A/B/C/D、TOEIC、Business、IELTS、Junior、Guardian' },
    { label: '住宿', value: 'Single、Double、Triple、Family room' },
    { label: '本页费用口径', value: '按官网英文课程费用页USD表整理，入学金和当地PHP费用另计' },
  ];

  readonly highlights: Highlight[] = [
    {
      image: 'https://www.philja.com/school/sch_img/we_i/main4.jpg',
      title: 'Iloilo低干扰学习城市',
      text: '官网介绍Iloilo为教育城市，生活节奏安静，适合长期ESL、考试准备和预算控制。',
    },
    {
      image: 'https://weacademy-iloilo.com/data/file/gallery/1025532504_tj7NFG4S_87c96ecc977e12feed22f038cca6869b655ae5ba.jpg',
      title: '半斯巴达与晚间免费课',
      text: 'ESL和考试课程通常搭配周一至周四晚间免费课，适合想保留学习推动的人。',
    },
    {
      image: 'https://cebu21.jp/include/schoolno2/weacademy/Room/20200513_150028.jpg',
      title: '费用透明、住宿口径清楚',
      text: '官网直接列课程费、住宿费、套餐价和当地费用，适合先做预算比较。',
    },
  ];

  readonly suitableFor: FitItem[] = [
    {
      title: '想要Iloilo安静城市和预算控制',
      text: 'WE适合想避开宿务和马尼拉热闹环境，稳定学习并清楚拆分预算的人。',
    },
    {
      title: 'ESL口语和长期基础提升',
      text: 'ESL A-D按一对一和小组课比例逐步加强，可按英文程度和周数选择。',
    },
    {
      title: 'TOEIC、Business或IELTS目标',
      text: '官方列TOEIC、Business和IELTS课程，IELTS方向还列模考和官方考试安排。',
    },
    {
      title: '亲子、Junior或Guardian同行',
      text: '官方费用页列Junior和Guardian课程，适合亲子或青少年路线先放入候选。',
    },
  ];

  readonly notSuitableFor: FitItem[] = [
    {
      title: '只想要海边度假型校区',
      text: 'WE在Iloilo市区，不是Mactan海边或Boracay度假型学校。',
    },
    {
      title: '只想完全自由型学习',
      text: 'WE有半斯巴达、晚间课和自习安排，适合需要学习推动的人。',
    },
    {
      title: '想要Native外教比例很高',
      text: 'WE的核心优势是费用、Iloilo环境和菲律宾老师一对一，不是Clark/Subic那类Native口语定位。',
    },
  ];

  readonly roomOptions: RoomOption[] = [
    { id: 'single', name: 'Single room', shortName: '1人房', price4Weeks: 820, note: '适合长期成人和重视隐私的学生。' },
    { id: 'double', name: 'Double room', shortName: '2人房', price4Weeks: 580, note: '适合朋友同行、亲子或愿意合住的人。' },
    { id: 'triple', name: 'Triple room', shortName: '3人房', price4Weeks: 530, note: '2026价目表中住宿费最低的房型，空房和性别安排需确认。' },
    { id: 'family', name: 'Family room', shortName: '家庭房', price4Weeks: 580, note: '仅2间；两房一厅，适合3至4人家庭，需优先确认空房。' },
  ];

  readonly courseOptions: CourseOption[] = [
    {
      id: 'esl-a',
      name: 'ESL A',
      type: '轻量ESL',
      lessons: '一对一3节 + 团体课2节 + 选修课2节（周五除外）',
      suitable: '适合慢节奏打基础、第一次游学或长期适应。',
      tuition4Weeks: 570,
      note: '2026价目表4周课程费USD570。',
    },
    {
      id: 'esl-b',
      name: 'ESL B',
      type: '标准ESL',
      lessons: '一对一4节 + 团体课1节 + 选修课2节（周五除外）',
      suitable: '适合想增加一对一比例，同时保留自由复习时间的人。',
      tuition4Weeks: 660,
      note: '2026价目表4周课程费USD660。',
    },
    {
      id: 'esl-c',
      name: 'ESL C',
      type: '均衡ESL',
      lessons: '一对一4节 + 团体课2节 + 选修课2节（周五除外）',
      suitable: '适合多数成人ESL学生，听说读写和小组互动更平衡。',
      tuition4Weeks: 710,
      note: '2026价目表4周课程费USD710。',
    },
    {
      id: 'esl-d',
      name: 'ESL D',
      type: '强化ESL',
      lessons: '一对一5节 + 团体课2节 + 选修课2节（周五除外）',
      suitable: '适合12周以内想加强学习密度和自习推动的人。',
      tuition4Weeks: 860,
      note: '2026价目表4周课程费USD860。',
    },
    {
      id: 'toeic',
      name: 'TOEIC',
      type: '多益',
      lessons: '一对一4节 + 团体课2节 + 选修课2节（周五除外）',
      suitable: '适合求职、升学或企业英语证明需求。',
      tuition4Weeks: 820,
      note: '2026价目表4周课程费USD820。',
    },
    {
      id: 'business',
      name: 'Business',
      type: '商务英语',
      lessons: '一对一4节 + 团体课2节 + 选修课2节（周五除外）',
      suitable: '适合会议、简报、邮件、面试和职场英语。',
      tuition4Weeks: 820,
      note: '2026价目表4周课程费USD820。',
    },
    {
      id: 'ielts',
      name: 'IELTS',
      type: '雅思',
      lessons: '一对一4节 + 团体课2节 + 选修课2节（周五除外）',
      suitable: '适合雅思入门到5.5左右水平，需要模考和官方考试资源的人。',
      tuition4Weeks: 980,
      note: '2026价目表4周课程费USD980；每4周一次模考。',
    },
    {
      id: 'junior',
      name: 'Junior',
      type: '青少年英语',
      lessons: '一对一6节',
      suitable: '适合青少年和亲子路线，需确认监护、房型和年龄规则。',
      tuition4Weeks: 840,
      note: '2026价目表4周课程费USD840；低龄安排需另行确认。',
    },
    {
      id: 'guardian',
      name: 'Guardian',
      type: '监护人课程',
      lessons: '一对一3节',
      suitable: '适合陪同Junior学生入学的家长或监护人。',
      tuition4Weeks: 460,
      note: '2026价目表4周课程费USD460。',
    },
  ];

  readonly specialFees: SpecialCourseFee[] = [
    {
      label: '额外1:1课程',
      lessons: 'Add 1:1 Class',
      reference: 'PHP 7,000 / 4周',
      note: '官方追加课程表列当地PHP支付。',
    },
    {
      label: '额外小组课',
      lessons: 'Add group class',
      reference: 'PHP 5,000 / 4周',
      note: '也可将1小时小组课转换为1小时一对一，参考PHP5,000/4周。',
    },
    {
      label: 'IELTS官方考试',
      lessons: 'Computer-based IDP Official IELTS Center',
      reference: '每8周提供官方考试参考',
      note: '考试日期、报名费和名额以学校与考场确认结果为准。',
    },
  ];

  readonly schedule: ScheduleItem[] = [
    { time: '07:00 - 08:00', title: '早餐', text: '官方日程列早餐时段，住宿套餐提供每日三餐。' },
    { time: '08:00 - 11:50', title: '上午课程', text: '一对一Conversation、Grammar、Vocabulary、Writing或Reading等。' },
    { time: '12:00 - 13:00', title: '午餐', text: '校内用餐；Junior和未成年学生需按学校规则行动。' },
    { time: '13:00 - 16:50', title: '下午课程', text: '按课程安排一对一、小组Debate、IELTS Listening或Pronunciation。' },
    { time: '17:30 - 19:00', title: '免费晚间课', text: '周一至周四开设，TOEIC、IELTS Writing和Conversation按需求安排。' },
    { time: '19:00 - 21:00', title: '自习时间', text: '适合考试学生整理单词、订正模考和复盘写作。' },
  ];

  readonly localFees: LocalFee[] = [
    { item: 'Registration fee', amount: 'USD 100', note: '官网列一次性注册费，本页报价器已计入。' },
    { item: 'SSP', amount: 'PHP 6,500', note: '特别学习许可，每6个月更新一次。' },
    { item: 'SSP E-Card', amount: 'PHP 4,500', note: '官网列2024-07-01起实行，1年有效。' },
    { item: 'Deposit', amount: 'PHP 2,000', note: '退房检查后按学校规则退还。' },
    { item: 'Book fee', amount: 'PHP 180-450 / 本', note: '按课程、等级和实际教材使用计算。' },
    { item: 'Laundry', amount: 'PHP 150 / 5kg', note: '超出部分PHP30/kg；官网估算约PHP600/月。' },
    { item: 'Electricity', amount: 'PHP 1,000-1,500 / 4周', note: '基本费PHP500 + 电表用量，官网列1kw PHP22。' },
    { item: 'Water', amount: 'PHP 500 / 4周', note: '5CB后按每CB PHP120计。' },
    { item: 'Maintenance Fee', amount: 'PHP 1,000 / 4周', note: '到校一次性支付对应周数。' },
    { item: 'Iloilo Airport pickup', amount: '免费参考', note: '官网列Iloilo机场接机免费。' },
    { item: 'Kalibo pickup', amount: 'PHP 4,000 / 1人起', note: '2人PHP2,000/人；3人PHP1,500/人；4人以上PHP1,000/人。' },
    { item: 'Visa extension', amount: 'PHP 5,130起', note: '第一次延签29天；后续按停留周数逐段办理。' },
  ];

  readonly serviceSteps: ProcessStep[] = [
    { icon: 'location_on', title: '确认Iloilo是否适合', text: '先判断学生是否接受小众安静城市、低干扰学习和非海边校区。' },
    { icon: 'menu_book', title: '匹配课程强度', text: '按ESL A-D、TOEIC、Business、IELTS、Junior或Guardian选择课时密度。' },
    { icon: 'hotel', title: '确认房型空位', text: '核对1人、2人、3人和Family房，以及性别、同行人数和未成年规则。' },
    { icon: 'payments', title: '拆清费用', text: '把套餐主费、注册费、当地PHP费用、接机和签证延长分开列预算。' },
    { icon: 'description', title: '准备报名资料', text: '协助整理护照、保险、eTravel、接机资料、现金清单和亲子材料。' },
    { icon: 'support_agent', title: '到校后继续协助', text: '课程、宿舍、账单、考试报名或当地生活问题，都可以继续联系顾问。' },
  ];

  readonly trustBadges = [
    { icon: 'verified_user', label: '官网费用表整理' },
    { icon: 'assignment', label: 'IDP IELTS资源确认' },
    { icon: 'hotel', label: '课程住宿合并核价' },
    { icon: 'apartment', label: '深圳总部 + 菲律宾支持' },
  ];

  readonly schoolServices = [
    '一对一课程',
    '小组课',
    '免费晚间课',
    'ESL A-D',
    'TOEIC',
    'Business',
    'IELTS',
    'Junior',
    'Guardian',
    '三餐',
    '每周两次清洁',
    '洗衣服务',
    '自习室',
    '泳池',
    '篮球场',
    '健身房',
  ];
  readonly campusActivities = ['晚间免费课', '自习', 'IELTS模考', 'Presentation', 'English Diary', 'Vocabulary Review'];
  readonly weekendActivities = ['Iloilo市区', 'SM City Iloilo', 'Guimaras Island', 'Boracay延伸', 'Santa Barbara Golf Course', '咖啡厅'];
  readonly notes = [
    '本页按WE Academy英文官网课程费用页整理，价格、住宿空位、活动和校规仍需以学校invoice为准。',
    '套餐价通常包含课程、住宿和三餐；水电、洗衣、教材、SSP、SSP E-Card、押金、维护费和签证另计。',
    'IELTS课程官方列4周起报、每4周模考、每8周官方考试，考试报名费和名额需单独确认。',
    'Junior和Guardian课程涉及年龄、监护、房型和接送安排，不建议只按成人ESL价格判断。',
    'Kalibo机场接送另收费，Iloilo机场接机按官网为免费参考，仍需按航班和入学日确认。',
  ];

  readonly faqs: FaqItem[] = [
    {
      question: '菲律宾伊洛伊洛WE Academy适合什么学生？',
      answer:
        '适合想在Iloilo安静城市中学习ESL、TOEIC、Business或IELTS的人，也适合预算敏感、想要半斯巴达学习推动和住宿费用清楚的学生。',
    },
    {
      question: '页面上的费用包含全部费用吗？',
      answer:
        '不包含全部。报价器估算官网课程住宿套餐价加注册费；SSP、SSP E-Card、教材、押金、水电、洗衣、维护费、签证延长和个人生活费需另算。',
    },
    {
      question: 'WE Academy和MK/GITC怎么比较？',
      answer:
        'WE适合费用透明、半斯巴达和IELTS官方考点资源；MK可作为同城安静长期ESL候选；GITC偏大学附属与交流体验。三所都要按课程目标和房型空位比较。',
    },
    {
      question: 'WE Academy适合雅思吗？',
      answer:
        '适合列入候选。官网写明IELTS课程适合初学者到5.5水平，并列每4周模考、每8周官方考试和Computer-based IDP Official IELTS Center。',
    },
  ];

  readonly sideNav: SideNavItem[] = [
    { label: '学校环境', target: 'gallery', icon: 'image' },
    { label: '课程与费用', target: 'course-fees', icon: 'menu_book' },
    { label: '费用快速报价', target: 'quote', icon: 'calculate' },
    { label: '特色费用', target: 'special-fees', icon: 'bolt' },
    { label: '当地费用', target: 'local-fees', icon: 'payments' },
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
    { label: 'WE Academy官方英文Program与费用页', url: 'https://www.weacademy-iloilo.com/en/program/program.php' },
    { label: 'WE Academy官方Iloilo City介绍', url: 'https://www.weacademy-iloilo.com/en/company/iloilo.php' },
    { label: 'WE Academy官方Dormitory图库', url: 'https://www.weacademy-iloilo.com/bbs/board.php?bo_table=dormitory_en' },
    { label: 'WE Academy官方How to come', url: 'https://www.weacademy-iloilo.com/en/guide/immigration.php' },
    { label: 'BNW WE Academy学校资料', url: 'https://www.bnwjp.com/school/philippines/iloilo/weacademy.html' },
    { label: 'Philja WE Academy校园资料', url: 'https://www.philja.com/school/we_i.php' },
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
    const room = this.roomOptions.find((item) => item.id === roomId);

    if (!course || !room) {
      return 0;
    }

    return (course.tuition4Weeks + room.price4Weeks) * (weeks / 4);
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

  get packageFeeText(): string {
    return `USD ${this.formatUsd(this.selectedPackageFee)} 起`;
  }

  get quoteUsdText(): string {
    return `USD ${this.formatUsd(this.quoteUsd)} 起`;
  }

  get quoteCnyText(): string {
    const rounded = Math.round((this.quoteUsd * this.usdToCny) / 100) * 100;

    return `约 ${rounded.toLocaleString('zh-CN')} 元起`;
  }

  formatUsd(amount: number): string {
    return amount.toLocaleString('en-US');
  }
}

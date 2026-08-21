import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

type GalleryCategory = '全部' | '校园' | '教室' | '住宿' | '生活';
type WeekOption = 4 | 8 | 12 | 16 | 20 | 24;
type CourseId =
  | 'esl'
  | 'esl-intensive'
  | 'business-english'
  | 'ielts-basic-intermediate'
  | 'ielts-advanced'
  | 'ielts-guaranteed';
type RoomId = 'single' | 'double' | 'two-plus-one';

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

interface LocalFeeTotal {
  weeks: WeekOption;
  amount: number;
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
  selector: 'app-help-longlong-school',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './help-longlong-school.component.html',
  styleUrls: [
    '../cebu-school-detail-layout.css',
    '../cebu-school-detail-content.css',
    '../cebu-school-detail-responsive.css',
    '../ev-school/ev-school-detail.component.css',
    './help-longlong-school.component.css',
  ],
})
export class HelpLonglongSchoolComponent {
  readonly registrationFee = 100;
  readonly galleryCategories: GalleryCategory[] = ['全部', '校园', '教室', '住宿', '生活'];
  selectedGalleryCategory: GalleryCategory = '全部';
  selectedCourseId: CourseId = 'esl';
  selectedRoomId: RoomId = 'double';
  selectedWeeks: WeekOption = 4;
  selectedStartDate = '2026-09-07';
  quoteCalculated = false;

  readonly weekOptions: WeekOption[] = [4, 8, 12, 16, 20, 24];

  readonly quickInfo: QuickInfo[] = [
    {
      icon: 'terrain',
      label: '校区',
      value: 'Longlong / La Trinidad',
      note: 'HELP Baguio Longlong位于Benguet山城区域，官方介绍约20分钟到Baguio市区。',
    },
    {
      icon: 'history_edu',
      label: '学校体系',
      value: 'HELP Sparta传统',
      note: 'HELP创立于1996年，Longlong校区是其Sparta英语教育的重要校区。',
    },
    {
      icon: 'notification_important',
      label: '当前状态',
      value: '需确认开放情况',
      note: '官网提示Longlong设施升级期间，活跃Sparta课程与资深教师目前整合在HELP Clark。',
    },
    {
      icon: 'school',
      label: '课程方向',
      value: 'ESL / IELTS / Business',
      note: '所附2025年费用表列ESL、ESL Intensive、Business English和三个IELTS级别。',
    },
    {
      icon: 'apartment',
      label: '校园设施',
      value: '7层山景校园',
      note: '官方列100间1:1教室、22间小组教室、5间大讲堂和宿舍生活设施。',
    },
    {
      icon: 'payments',
      label: '4周起价',
      value: 'USD 1,580 起',
      note: 'ESL USD800 + Double双人房USD780；注册费USD100及当地PHP费用另算。',
    },
  ];

  readonly galleryImages: GalleryImage[] = [
    {
      category: '校园',
      title: 'HELP Longlong Campus',
      description: 'HELP官方页面展示的Longlong校区外观，适合先核对校区环境。',
      src: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi6LE8_JDlB6gSNbSxoYGetj453IHeFSWyLesYQTq5FCQw5DjciM_jV3Z9c5953t645VM5P4ShDgK5nOza5LQSAqdER26ZVcWhNHl6U5Q-LYlZQrJz-aQCx23GL9qCgQJaCRL0MO_M1XAC948HIGpxzyBkVkqGZev3ix4hfYacFy2Sg8xLXRTEq3PPFpjk/s600/LONGLONG.jpg',
    },
    {
      category: '校园',
      title: 'Longlong山城校区',
      description: '官方资料强调Longlong安静、凉爽、学习干扰少，适合斯巴达学习节奏。',
      src: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhivXecVdMpffDby-ACqb2QKoVa7-YCn1m47q_NuYHT6xuc_N3w043fxcTE0KQJVBNKv1cu9RTz6gtW8VQG1_ZXG3suZr5xK3mOb1FNDrKA_GTqYwWB2XIRRULY9Mvc4arh8wJ-LCvlTmepEvnoIL2LRVoPxQAWlSryIN_VWD66MLLFIWpmYeQUGFaJ/s1600-rw/HELP_LongLong.jpg',
    },
    {
      category: '教室',
      title: '1:1与小组课配置',
      description: '官网列100间一对一教室、22间小组教室和5间大讲堂。',
      src: 'https://helpenglish.net/wp-content/uploads/2024/09/longlong43.jpg',
    },
    {
      category: '住宿',
      title: '校内宿舍方向',
      description: '所附2025年费用表列Single、Double与2+1三种4周住宿价格。',
      src: 'assets/philippines/baguio-study-hero.jpg',
    },
    {
      category: '生活',
      title: 'Baguio学习生活环境',
      description: 'Longlong位于Benguet山城区域，凉爽安静但交通与当前开放状态需提前确认。',
      src: 'assets/philippines/baguio-study-hero.jpg',
    },
  ];

  readonly basicInfo: BasicInfoRow[] = [
    { label: '学校名称', value: 'HELP English（Longlong Campus）' },
    { label: '中文定位', value: '菲律宾碧瑶HELP English Longlong校区' },
    { label: '地址', value: 'Lamtang Road, La Trinidad, Benguet, Philippines' },
    { label: '品牌历史', value: 'HELP English创立于1996年，Longlong校区于2007年开放，官方历史页列容量约400人。' },
    { label: '当前状态提示', value: '官网Baguio页面提示：Longlong设施升级期间，活跃Sparta训练项目与资深教师目前整合在HELP Clark Campus。' },
    { label: '课程方向', value: 'ESL、ESL Intensive、Business English、IELTS Basic & Intermediate、IELTS Advanced、IELTS Guaranteed。' },
    { label: '设施', value: '100间1:1教室、22间1:5小组教室、5间大讲堂、宿舍、餐厅、健身房、休息区、便利店、医务室和洗衣服务。' },
    { label: '4周费用', value: '2025年课程住宿USD 1,580起，注册费USD 100另计；Baguio 4周当地费用参考PHP 21,700。' },
  ];

  readonly highlights: Highlight[] = [
    {
      image: this.galleryImages[0].src,
      title: '老牌Sparta学习体系',
      text: 'HELP是菲律宾英语游学中较早建立斯巴达制度的学校之一，适合需要固定作息、晚自习和测试推动的人。',
    },
    {
      image: this.galleryImages[1].src,
      title: 'Longlong山城学习环境',
      text: '官方介绍Longlong位于Benguet安静区域，气候凉爽，适合把生活半径和学习节奏收得更集中。',
    },
    {
      image: this.galleryImages[2].src,
      title: '考试与综合英语都能衔接',
      text: '所附2025年课程费覆盖ESL、ESL Intensive、Business与IELTS不同级别，适合做4-24周预算初筛。',
    },
    {
      image: 'assets/philippines/help-clark-local-fee.jpeg',
      title: '必须确认当期校区安排',
      text: '由于官网明确提示Longlong升级期间课程与教师整合至Clark，报名前要先核对是否能入住Longlong或由Clark承接。',
    },
  ];

  readonly suitableFor: FitItem[] = [
    { title: '想要碧瑶山城和严格学习节奏', text: 'Longlong传统定位偏Sparta，适合想减少外部干扰、每天稳定上课和自习的人。' },
    { title: 'ESL打底后转考试或商务方向', text: '2025年费用表覆盖ESL、IELTS和Business，可按英语基础逐步规划。' },
    { title: '想先用USD表做预算', text: '所附费用表列出4周课程费、住宿费和注册费，适合先估算课程住宿大头。' },
    { title: '愿意等学校确认当前开放安排', text: '如果你可以接受先核实Longlong重开、空房或Clark承接方案，HELP仍值得列入候选。' },
  ];

  readonly notSuitableFor: FitItem[] = [
    { title: '必须马上锁定Longlong入学', text: '官网提示Longlong设施升级期间课程整合在Clark，因此不能只按校名假设一定住读Longlong。' },
    { title: '不接受严格门禁和晚自习', text: 'HELP的Sparta传统包含平日外出限制、EOP、晚自习、词汇测试等，报名应先确认能否适应。' },
    { title: '只想要海岛城市或轻松体验', text: 'Longlong不是宿务海边路线，优势是山城学习环境，不是度假感。' },
    { title: '预算只看USD起价', text: '课程住宿之外还有SSP、签证、教材、水电、维护、洗衣、押金等PHP当地费用。' },
  ];

  readonly courses: CourseOption[] = [
    {
      id: 'esl',
      name: 'ESL',
      type: 'General English',
      lessons: '每日4节一对一 + 2节小团体 + 2节大团体 + 1节词汇考试 + 晚自习',
      suitable: '费用表备注：每4周一次月考。',
      tuition4w: 800,
    },
    {
      id: 'esl-intensive',
      name: 'ESL Intensive',
      type: 'Intensive ESL',
      lessons: '每日5节一对一 + 2节小团体 + 2节大团体 + 1节词汇考试 + 晚自习',
      suitable: '费用表备注：每4周一次月考。',
      tuition4w: 940,
    },
    {
      id: 'business-english',
      name: 'Business English',
      type: 'Business',
      lessons: '每日5节一对一 + 2节大团体 + 1节词汇考试 + 晚自习',
      suitable: '适合会议、表达和职场沟通需求，入学基础要求以学校回复为准。',
      tuition4w: 900,
    },
    {
      id: 'ielts-basic-intermediate',
      name: 'IELTS - Basic & Intermediate',
      type: 'IELTS Exam Prep',
      lessons: '每日4节一对一 + 2节小团体 + 2节大团体 + 1节词汇考试 + 晚自习',
      suitable: '费用表备注：每4周一次模拟考；5分以上每2周一次。',
      tuition4w: 900,
    },
    {
      id: 'ielts-advanced',
      name: 'IELTS - Advanced',
      type: 'IELTS Exam Prep',
      lessons: '每日4节一对一 + 2节小团体 + 2节大团体 + 1节词汇考试 + 晚自习',
      suitable: '费用表备注：每4周一次模拟考；5分以上每2周一次。',
      tuition4w: 940,
    },
    {
      id: 'ielts-guaranteed',
      name: 'IELTS - Guaranteed',
      type: 'IELTS Guaranteed',
      lessons: '每日4节一对一 + 2节小团体 + 2节大团体 + 1节词汇考试 + 晚自习',
      suitable: '费用表备注：保分班每周一次模拟考，周四考试。',
      tuition4w: 940,
    },
  ];

  readonly roomOptions: RoomOption[] = [
    { id: 'single', name: 'Single Room / 单人间', fee4w: 1030, note: '所附2025年费用表列示的4周住宿费。' },
    { id: 'double', name: 'Double Room / 双人间', fee4w: 780, note: '所附2025年费用表列示的4周住宿费，也是表内最低房价。' },
    {
      id: 'two-plus-one',
      name: '2+1 Room',
      fee4w: 850,
      note: '2+1 Room student安排：每日4–5节一对一 + 3节小团体 + 2节大团体 + 1节词汇考试 + 晚自习；表内未列单独课程费。',
    },
  ];

  readonly localFeeTotals: LocalFeeTotal[] = [
    { weeks: 4, amount: 21700 },
    { weeks: 8, amount: 32840 },
    { weeks: 12, amount: 49250 },
    { weeks: 16, amount: 59690 },
    { weeks: 20, amount: 70130 },
    { weeks: 24, amount: 80570 },
  ];

  readonly localFees: LocalFee[] = [
    { item: 'Baguio当地费用总额 / 4周', amount: 'PHP 21,700', note: 'HELP官方Tuition and Fees页面列示的Baguio 4周Local Fee Total。' },
    { item: 'Baguio当地费用总额 / 8周', amount: 'PHP 32,840', note: '包含押金、延签、SSP&E-Card、水电、维护、洗衣、教材、ID等官方表项目。' },
    { item: 'Baguio当地费用总额 / 12周', amount: 'PHP 49,250', note: '12周会增加签证与长期停留相关项目，正式以学校账单为准。' },
    { item: 'Baguio当地费用总额 / 24周', amount: 'PHP 80,570', note: '长期学习还需关注ACR、CRTV/ECC等可能项目。' },
    { item: 'Room Deposit', amount: 'PHP 3,000', note: '退房时按罚款、损坏或超额费用扣除后退还。' },
    { item: 'SSP & E-Card', amount: 'PHP 12,300', note: '官方费用表列SSP&ECard，通常有效期6个月。' },
    { item: 'Utilities', amount: 'PHP 2,500 / 4周', note: '官方说明不含空调用电，实际规则需按学校当期确认。' },
    { item: 'Maintenance', amount: 'PHP 1,000 / 4周', note: '设施维护费用，随学习周数递增。' },
    { item: 'Laundry', amount: 'PHP 1,000 / 4周', note: '官方规则列每期洗衣额度16kg，超额另计。' },
    { item: 'Learning Materials', amount: 'PHP 1,700 / 4周', note: '教材或学习材料费，会随课程和周数调整。' },
    { item: 'ID', amount: 'PHP 200', note: '学生证办理参考。' },
    { item: 'Dorm Extension', amount: 'PHP 2,000 / 天', note: '官方学生规则列延住参考费用，需提前确认可否安排。' },
  ];

  readonly schedule: ScheduleItem[] = [
    { time: '07:20', title: '早餐', text: '校内用餐后开始晨间阅读和正式课程准备。' },
    { time: '08:00', title: 'Morning Reading', text: '官方日程列晨读，帮助学生进入Sparta学习节奏。' },
    { time: '08:50 - 15:05', title: '一对一与小组课程', text: '一对一、小组课和自习穿插安排，课程内容按ESL、IELTS或Business目标分配。' },
    { time: '15:50', title: 'Special Optional Class', text: '可选特别课或额外学习安排，以当期开课为准。' },
    { time: '19:00 - 21:00', title: '晚自习与词汇测试', text: '官方日程列19:00自习、20:00词汇测试、21:00继续自习，适合需要外部推动的人。' },
    { time: 'Weekend', title: '周末与外出', text: '官方规则列平日外出限制，周末外出、旅行和返校时间需按学校规定申请和遵守。' },
  ];

  readonly serviceSteps: ProcessStep[] = [
    { icon: 'fact_check', title: '先确认Longlong状态', text: '向学校核对Longlong当前是否开放、是否可住宿、课程和教师是否仍由Clark承接。' },
    { icon: 'school', title: '匹配课程级别', text: '按英语基础、IELTS目标或商务需求确认课程方向。' },
    { icon: 'hotel', title: '锁定房型与入学日', text: '确认Single、Double或2+1房型空位，特别是长期和旺季档期。' },
    { icon: 'payments', title: '拆分USD与PHP预算', text: '课程住宿按USD公式估算，当地费用按Baguio Local Fee表另列。' },
    { icon: 'flight_takeoff', title: '安排接机与交通', text: '马尼拉到碧瑶车程较长，需确认指定接机日、抵达机场和到校方式。' },
    { icon: 'support_agent', title: '报名后继续跟进', text: '如校区、住宿、课程或费用有变化，顾问协助与学校复核。' },
  ];

  readonly notes = [
    'HELP官网Baguio页面明确提示：Longlong设施升级期间，活跃Sparta课程与资深教师目前整合在HELP Clark Campus。',
    '本页仍保留Longlong校区资料，是为了帮助学生了解HELP Baguio传统校区与费用结构；正式报名必须先确认当前是否开放。',
    '课程费与宿舍费按所附HELP 2025年费用表更新；一次性注册费USD 100，当地PHP费用、机票、保险、接机和个人消费另计。',
    '2025年费用表只列Single、Double与2+1房型；房型空位、餐食范围与实际住宿楼栋需按学校回复确认。',
    '平日外出、EOP、晚自习、词汇测试和周末旅行规则较严格，适合目标明确并能接受纪律的人。',
  ];

  readonly faqs: FaqItem[] = [
    {
      question: 'HELP English Longlong现在一定可以报名入住吗？',
      answer:
        '不能直接假设。HELP官网Baguio页面提示Longlong设施升级期间，活跃Sparta训练项目和资深教师目前整合在Clark Campus；报名前必须先让学校确认当期Longlong开放、住宿和课程安排。',
    },
    {
      question: 'HELP Longlong 4周最低多少钱？',
      answer:
        '按所附HELP 2025年费用表，ESL课程USD800 + Double双人间USD780，4周课程住宿合计USD1,580起；再加一次性注册费USD100，前期USD参考为USD1,680。Baguio当地PHP费用、机票、保险、接机和个人消费另算。',
    },
    {
      question: 'HELP Longlong适合雅思吗？',
      answer:
        '适合作为候选。2025年费用表列IELTS Basic & Intermediate、IELTS Advanced和IELTS Guaranteed；备注列每4周一次模拟考、5分以上每2周一次、保分班每周一次并在周四考试。具体开课校区、分班和教师安排仍要按学校当期回复确认。',
    },
    {
      question: 'Longlong和HELP Clark怎么比较？',
      answer:
        'Longlong传统上更像碧瑶山城Sparta环境，Clark更偏交通便利和当前整合承接。由于官网已有合并提示，实际可报名校区要以学校最新回复为准。',
    },
    {
      question: '页面报价包含全部费用吗？',
      answer:
        '不包含全部。报价器只估算USD课程住宿费用；菲律宾当地费用、签证延长、SSP&E-Card、ACR、教材、水电、押金、接机、机票和保险需另算。',
    },
  ];

  readonly sideNav: SideNavItem[] = [
    { label: '当前状态', target: 'current-status', icon: 'notification_important' },
    { label: '校园环境', target: 'gallery', icon: 'image' },
    { label: '课程费用', target: 'course-fees', icon: 'menu_book' },
    { label: '费用计算', target: 'quote', icon: 'calculate' },
    { label: '当地费用', target: 'local-fees', icon: 'payments' },
    { label: '资料来源', target: 'sources', icon: 'link' },
    { label: 'FAQ', target: 'faq', icon: 'help' },
  ];

  readonly mobileAnchors: SideNavItem[] = [
    { label: '状态', target: 'current-status', icon: 'priority_high' },
    { label: '环境', target: 'gallery', icon: 'image' },
    { label: '课程', target: 'course-fees', icon: 'menu_book' },
    { label: '报价', target: 'quote', icon: 'calculate' },
    { label: '费用', target: 'local-fees', icon: 'receipt_long' },
    { label: 'FAQ', target: 'faq', icon: 'help' },
  ];

  readonly sources: SourceLink[] = [
    { label: 'HELP English官网', url: 'https://www.helpenglish.org/' },
    { label: 'HELP Baguio / Longlong官方页面', url: 'https://www.helpenglish.org/p/baguio-campus.html' },
    { label: 'HELP Tuition and Fees官方页面', url: 'https://www.helpenglish.org/p/tuition-and-fees.html' },
    { label: 'HELP Student Regulations官方页面', url: 'https://www.helpenglish.org/p/student-regulations.html' },
    { label: 'HELP About / History官方页面', url: 'https://www.helpenglish.org/p/about-us.html' },
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

  get tuitionForSelectedWeeks(): number {
    return this.selectedCourse.tuition4w * (this.selectedWeeks / 4);
  }

  get roomFeeForSelectedWeeks(): number {
    return this.selectedRoom.fee4w * (this.selectedWeeks / 4);
  }

  get quoteUsd(): number {
    return this.registrationFee + this.tuitionForSelectedWeeks + this.roomFeeForSelectedWeeks;
  }

  get quoteText(): string {
    return `${this.formatMoney(this.quoteUsd, 'USD')} 起`;
  }

  get fourWeekStartingText(): string {
    const lowestTuition = Math.min(...this.courses.map((course) => course.tuition4w));
    const lowestRoomFee = Math.min(...this.roomOptions.map((room) => room.fee4w));
    return this.formatMoney(lowestTuition + lowestRoomFee, 'USD');
  }

  get selectedLocalFeeText(): string {
    const total = this.localFeeTotals.find((item) => item.weeks === this.selectedWeeks)?.amount ?? this.localFeeTotals[0].amount;
    return this.formatMoney(total, 'PHP');
  }

  get formulaText(): string {
    return `注册费 + (${this.selectedCourse.name} + ${this.selectedRoom.name}) x ${this.selectedWeeks}周 / 4`;
  }

  get courseFeeRows() {
    const roomFee = (id: RoomId) => this.roomOptions.find((room) => room.id === id)?.fee4w ?? 0;

    return this.courses.map((course) => ({
      course: course.name,
      tuition: this.formatMoney(course.tuition4w, 'USD'),
      single: this.formatMoney(course.tuition4w + roomFee('single'), 'USD'),
      double: this.formatMoney(course.tuition4w + roomFee('double'), 'USD'),
      twoPlusOne: this.formatMoney(course.tuition4w + roomFee('two-plus-one'), 'USD'),
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

  formatMoney(value: number, currencyCode: 'USD' | 'PHP'): string {
    return `${currencyCode} ${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  }
}

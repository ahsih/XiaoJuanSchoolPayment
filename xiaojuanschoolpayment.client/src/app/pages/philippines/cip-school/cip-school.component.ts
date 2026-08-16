import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ExpandableImageComponent } from '../../../components/expandable-image.component';
import { SidaWhySectionComponent } from '../../../components/sida-why-section.component';

type GalleryCategory = '全部' | '校园' | '教室' | '住宿' | '餐厅' | '设施';

interface GalleryImage {
  category: Exclude<GalleryCategory, '全部'>;
  title: string;
  description: string;
  src: string;
  details?: string[];
}

interface CourseFee {
  id: string;
  name: string;
  tuition: number;
  suitable: string;
  schedule: string;
  note: string;
}

interface RoomFee {
  id: string;
  name: string;
  fee: number;
  note: string;
}

interface LocalFee {
  item: string;
  amount: string;
  note: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-cia-school',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatIconModule,
    ExpandableImageComponent,
    SidaWhySectionComponent,
  ],
  templateUrl: './cip-school.component.html',
  styleUrls: ['../cia-school/cia-school.component.css', './cip-school.component.css'],
})
export class CipSchoolComponent {
  readonly galleryCategories: GalleryCategory[] = [
    '全部',
    '校园',
    '教室',
    '住宿',
    '餐厅',
    '设施',
  ];
  readonly weekOptions = [1, 2, 3, 4, 8, 12];
  readonly discount = 0.95;
  readonly usdToCny = 7.2;

  selectedGalleryCategory: GalleryCategory = '全部';
  selectedCourseId = 'regular-esl';
  selectedRoomId = 'd4';
  selectedWeeks = 4;
  selectedStartDate = '2026-09-06';
  registrationFee = 100;
  seasonalFeePerWeek = 40;

  readonly mobileAnchors = [
    { label: '概览', target: 'advisor-review', icon: 'dashboard' },
    { label: '环境', target: 'gallery', icon: 'image' },
    { label: '课程', target: 'courses', icon: 'menu_book' },
    { label: '报价', target: 'quote', icon: 'calculate' },
    { label: '费用', target: 'fee-structure', icon: 'receipt_long' },
    { label: 'FAQ', target: 'faq', icon: 'help' },
  ];

  readonly snapshotCards = [
    {
      icon: 'record_voice_over',
      title: 'Native 1:1 是核心卖点',
      text: 'CIP 官方强调美国、英国等 Native speaker 一对一和小组课，适合重视发音和自然表达的学生。',
    },
    {
      icon: 'event_available',
      title: '6-day classes a week',
      text: '学校官方资料写明保持周六课程，重视学习连续性，Sparta方向管理更紧。',
    },
    {
      icon: 'park',
      title: 'Kepos = Garden',
      text: 'Kepos 代表安静、自然、花园式校园氛围，适合想避开过度喧闹环境的学生。',
    },
    {
      icon: 'hotel',
      title: '宿舍 + 校外Hotel',
      text: '官方资料列出校内宿舍和校外Hotel住宿，家庭、陪读和成人可按需求比较。',
    },
  ];

  readonly suitableFor = [
    { title: '想把外教一对一、发音纠正和口语自然度放在第一位' },
    { title: '希望在Clark安静生活环境里学习，不想去过度高压城市' },
    { title: '需要ESL、IELTS、TOEIC、Business之间灵活比较' },
    { title: '亲子、青少年或陪读家庭，想同时看宿舍和Hotel住宿' },
  ];

  readonly notSuitableFor = [
    { title: '只追求最新大型度假型校区和很强硬件质感' },
    { title: '想要碧瑶式极高压封闭备考管理' },
    { title: '预算已经非常紧，需要先逐项核对当地费用和房型' },
    { title: '不需要外教课，只想找最低价普通ESL' },
  ];

  readonly coreHighlights = [
    {
      icon: 'record_voice_over',
      image: 'assets/philippines/cip-campus-hero.jpg',
      title: 'Native Speaker 1:1',
      text: 'CIP 官网强调Native speaker一对一课程，适合需要发音、表达和英美文化语感输入的学生。',
    },
    {
      icon: 'calendar_month',
      image: 'assets/philippines/cip-program-curriculum-a.jpg',
      title: 'Light / Semi-Sparta / Sparta',
      text: '学习强度可以按课程方向选择，成人、考试、商务和青少年路线都能放进同一张选校表比较。',
    },
    {
      icon: 'local_florist',
      image: 'assets/philippines/cip-campus-intro.jpg',
      title: '安静花园式Kepos校区',
      text: '官方介绍将Kepos解释为Garden，强调自然、舒适、安静的学习氛围。',
    },
    {
      icon: 'bed',
      image: 'assets/philippines/cip-stay-hotel.jpg',
      title: '宿舍与Hotel双住宿',
      text: '校内宿舍适合集中学习，校外Hotel适合更重视隐私、陪读或住宿舒适度的学生。',
    },
  ];

  readonly galleryImages: GalleryImage[] = [
    {
      category: '教室',
      title: 'Native一对一课堂',
      description: 'CIP 官方学校页展示的Native teacher课堂画面。',
      src: 'assets/philippines/cip-campus-hero.jpg',
      details: ['Native speaker 1:1', '发音纠正与自然表达训练'],
    },
    {
      category: '校园',
      title: 'Kepos校区庭院',
      description: '官方学校页展示的CIP Kepos校区外观与庭院环境。',
      src: 'assets/philippines/cip-campus-intro.jpg',
      details: ['Clark / Angeles', '安静花园式校园'],
    },
    {
      category: '教室',
      title: '一对一教室',
      description: '官方学校页展示的一对一教室空间。',
      src: 'assets/philippines/cip-classroom-one-to-one.jpg',
      details: ['独立教室', '适合口语、写作和考试反馈'],
    },
    {
      category: '教室',
      title: '小组课教室',
      description: '官方学校页展示的小组课堂空间。',
      src: 'assets/philippines/cip-classroom-small-group.jpg',
      details: ['Native小组课', '讨论与表达训练'],
    },
    {
      category: '教室',
      title: 'Academic Office',
      description: '官方学校页展示的学术办公室，用于课程、进度和学习咨询。',
      src: 'assets/philippines/cip-academic-office.jpg',
      details: ['课程调整', '学习咨询与等级管理'],
    },
    {
      category: '住宿',
      title: '校内宿舍房间',
      description: '官方Dormitory页展示的校内宿舍房间。',
      src: 'assets/philippines/cip-dormitory-intro.jpg',
      details: ['校内住宿', '减少通勤时间'],
    },
    {
      category: '住宿',
      title: '宿舍单人房',
      description: '官方Dormitory页展示的宿舍房型照片。',
      src: 'assets/philippines/cip-dormitory-room-a.jpg',
      details: ['单人房参考', '实际以空房和当期安排为准'],
    },
    {
      category: '住宿',
      title: '校外Hotel住宿',
      description: '官方Hotel页展示的校外住宿房间。',
      src: 'assets/philippines/cip-hotel-room-a.jpg',
      details: ['校外Hotel', '适合家庭、陪读或更重视隐私的学生'],
    },
    {
      category: '设施',
      title: '学生休息与公共空间',
      description: '官方Features页展示的CIP校园生活与公共设施。',
      src: 'assets/philippines/cip-stay-amenities.jpg',
      details: ['学生交流', '课后休息与自习'],
    },
    {
      category: '餐厅',
      title: '住宿与生活支持',
      description: '官方Features页展示的住宿与校园生活配套。',
      src: 'assets/philippines/cip-stay-dormitory.jpg',
      details: ['校内生活支持', '实际餐食以学校当期安排为准'],
    },
  ];

  readonly courseChoiceCards = [
    {
      icon: 'forum',
      label: '口语',
      title: 'Light / Regular ESL',
      text: '适合想稳步提升口语、听力、词汇和表达自然度的学生。',
    },
    {
      icon: 'bolt',
      label: '强化',
      title: 'Power / Intensive ESL',
      text: '适合短期冲刺、希望增加一对一比例和学习推动力的学生。',
    },
    {
      icon: 'fact_check',
      label: '考试',
      title: 'IELTS / TOEIC',
      text: '适合有目标分、升学、工作或签证需求的学生，需核对模考和保证班规则。',
    },
    {
      icon: 'family_restroom',
      label: '家庭',
      title: 'Primary / Junior',
      text: '适合亲子陪读和青少年课程，但年龄、监护、房型与接送必须提前确认。',
    },
  ];

  courseFees: CourseFee[] = [
    {
      id: 'regular-esl',
      name: 'Regular ESL',
      tuition: 900,
      suitable: '基础综合提升',
      schedule: 'CIP课程名，价格临时沿用CIA Regular ESL 4周课程费',
      note: '临时价格，之后请替换为CIP正式价目表。',
    },
    {
      id: 'native-esl',
      name: 'Native ESL',
      tuition: 1000,
      suitable: 'Native口语强化',
      schedule: '价格临时沿用CIA Intensive ESL 4周课程费',
      note: '适合重视外教口语与发音纠正的学生。',
    },
    {
      id: 'power-esl',
      name: 'Power ESL',
      tuition: 1100,
      suitable: '高强度口语',
      schedule: '价格临时沿用CIA Power Intensive 4周课程费',
      note: '最终需按CIP课程表与Native课比例确认。',
    },
    {
      id: 'toeic-regular',
      name: 'TOEIC Regular',
      tuition: 1000,
      suitable: '托业备考',
      schedule: '价格临时沿用CIA TOEIC Regular 4周课程费',
      note: '需确认模考、教材和入学程度要求。',
    },
    {
      id: 'ielts-intensive',
      name: 'IELTS Intensive',
      tuition: 1050,
      suitable: '雅思强化',
      schedule: '价格临时沿用CIA IELTS Regular 4周课程费',
      note: '保证班需另行确认入学分数、规则和官方考试安排。',
    },
    {
      id: 'advanced-business',
      name: 'Advanced Business',
      tuition: 1050,
      suitable: '商务与职场沟通',
      schedule: '价格临时沿用CIA Business 4周课程费',
      note: '适合面试、工作表达和商务场景训练。',
    },
    {
      id: 'junior',
      name: 'Primary / Junior',
      tuition: 1300,
      suitable: '亲子青少年',
      schedule: '价格临时沿用CIA Junior 4周课程费',
      note: '年龄、监护和住宿规则需报名前确认。',
    },
    {
      id: 'guardian',
      name: 'Parent / Guardian',
      tuition: 1300,
      suitable: '陪读家长',
      schedule: '价格临时沿用CIA Guardian 4周课程费',
      note: '家长是否上课、课程数量和房型需单独确认。',
    },
  ];

  roomFees: RoomFee[] = [
    { id: 's1', name: '校内单人间', fee: 1500, note: '价格临时沿用CIA S-1。' },
    { id: 'p1', name: '校内高级单人间', fee: 1700, note: '价格临时沿用CIA P-1。' },
    { id: 'd2', name: '校内双人间', fee: 1100, note: '价格临时沿用CIA D-2。' },
    { id: 'd3', name: '校内三人间', fee: 850, note: '价格临时沿用CIA D-3。' },
    {
      id: 'd4',
      name: '校内四人间',
      fee: 750,
      note: '价格临时沿用CIA D-4，默认报价参考。',
    },
    {
      id: 'hotel4',
      name: '校外Hotel四人间',
      fee: 1100,
      note: '临时沿用CIA SR-4价格，之后请替换为CIP Hotel报价。',
    },
    {
      id: 'family',
      name: '家庭/陪读房',
      fee: 1400,
      note: '临时沿用CIA SR-2价格，需按CIP空房确认。',
    },
  ];

  localFees: LocalFee[] = [
    { item: 'SSP', amount: 'PHP 8,000', note: '临时沿用CIA当地费用参考' },
    { item: 'SSP E-card', amount: 'PHP 4,000', note: '以学校现场收费为准' },
    { item: '管理费', amount: 'PHP 4,000', note: '4周参考' },
    { item: '水电费', amount: 'PHP 2,000', note: '按周期或实际使用调整' },
    { item: '教材费', amount: 'PHP 2,000', note: '按课程和实际购买教材调整' },
    { item: '学生证', amount: 'PHP 200', note: '一次性费用参考' },
    { item: '押金', amount: 'PHP 2,500', note: '退房检查后按学校规则退还' },
    {
      item: '接机费',
      amount: 'PHP 1,000',
      note: '临时沿用CIA参考，CIP需重新确认Clark/Manila接机',
    },
    { item: 'ACR I-card', amount: 'PHP 4,500', note: '长期学习或延签时可能需要' },
  ];

  readonly feeStructureCards = [
    {
      icon: 'school',
      title: '前期学费',
      rows: [
        { label: '课程费', value: '按所选CIP课程，价格临时沿用CIA数值' },
        { label: '住宿费', value: '按校内宿舍或Hotel房型，价格临时沿用CIA数值' },
        { label: '注册费', value: 'USD 100 临时参考' },
      ],
      note: '用户后续可手动替换为CIP正式报价。',
    },
    {
      icon: 'payments',
      title: '到校费用',
      rows: this.localFees.slice(0, 5).map((fee) => ({
        label: fee.item,
        value: fee.amount,
      })),
      note: '当地费用暂按CIA页面一致处理。',
    },
    {
      icon: 'hotel',
      title: '住宿提醒',
      rows: [
        { label: '校内宿舍', value: '单人、双人、三人、四人等房型需按空房确认' },
        { label: '校外Hotel', value: '官方说明为距离学校约5分钟车程' },
        { label: '家庭报名', value: '需额外核对年龄、监护、餐食和接送' },
      ],
      note: 'CIP实际房型和收费之后请以当期价目表替换。',
    },
  ];

  readonly lifeCards = [
    {
      icon: 'park',
      image: 'assets/philippines/cip-campus-intro.jpg',
      title: 'Kepos校园环境',
      text: '校区强调安静、自然和学习氛围，适合不想过度喧闹的Clark学生。',
    },
    {
      icon: 'bed',
      image: 'assets/philippines/cip-dormitory-intro.jpg',
      title: '校内宿舍',
      text: '住校更方便使用课程、餐食和学习设施，适合想把生活集中在学校内的学生。',
    },
    {
      icon: 'hotel',
      image: 'assets/philippines/cip-hotel-room-a.jpg',
      title: '校外Hotel',
      text: '官方说明校外Hotel适合重视住宿舒适度、自由度和家庭同行的学生。',
    },
  ];

  readonly enrollmentChecks = [
    {
      icon: 'record_voice_over',
      title: '确认Native课比例',
      text: 'CIP核心卖点是Native课程，但不同课程Native课数量不同，报名前要逐项确认。',
    },
    {
      icon: 'calendar_month',
      title: '确认6天课和Sparta规则',
      text: 'Semi-Sparta和Sparta的周六课、晚间项目、门禁和出勤要求不同。',
    },
    {
      icon: 'bed',
      title: '确认宿舍或Hotel',
      text: '校内宿舍和校外Hotel的规则、餐食、接送和费用需要分开核对。',
    },
    {
      icon: 'payments',
      title: '替换正式价格',
      text: '当前页面费用按CIA硬编码临时值展示，后续需要替换为CIP价目表。',
    },
  ];

  readonly faqs: FaqItem[] = [
    {
      question: 'CIP和Clark其他学校最大差别是什么？',
      answer:
        'CIP更强调Native speaker一对一和外教口语训练，同时覆盖ESL、IELTS、TOEIC、Business和Junior路线，适合把口语自然度和课程组合放在重点的人。',
    },
    {
      question: '页面价格是CIP最终报价吗？',
      answer:
        '不是。你要求先沿用CIA价格，所以本页课程费、住宿费和到校费用都是临时参考。正式报价需要之后按CIP当期价目表、房型、周数和优惠替换。',
    },
    {
      question: 'CIP适合亲子或未成年学生吗？',
      answer:
        '可以列入候选。CIP官方课程包含Primary和Junior方向，但报名前必须确认监护规则、住宿安排、接送、年龄限制和课后管理。',
    },
    {
      question: 'CIP的照片来源是什么？',
      answer:
        '本页照片来自CIP官方School、Dormitory、Hotel、Features和Programs页面下载的公开图片。',
    },
  ];

  readonly ctaBadges = [
    '免费确认CIP空房和课程',
    '价格当前为CIA临时参考',
    '可协助替换正式CIP价目表',
    '按成人、考试、亲子目标重新匹配',
  ];

  setGalleryCategory(category: GalleryCategory): void {
    this.selectedGalleryCategory = category;
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

    window.scrollTo({
      top: Math.max(targetTop, 0),
      behavior: 'smooth',
    });

    window.history.replaceState(
      null,
      '',
      `${window.location.pathname}${window.location.search}#${target}`,
    );
  }

  get filteredGalleryImages(): GalleryImage[] {
    if (this.selectedGalleryCategory === '全部') {
      return this.galleryImages;
    }

    return this.galleryImages.filter(
      (image) => image.category === this.selectedGalleryCategory,
    );
  }

  get heroGalleryPreviewImages(): GalleryImage[] {
    return this.galleryImages.slice(0, 4);
  }

  get selectedCourse(): CourseFee {
    return (
      this.courseFees.find((course) => course.id === this.selectedCourseId) ??
      this.courseFees[0]
    );
  }

  get selectedRoom(): RoomFee {
    return (
      this.roomFees.find((room) => room.id === this.selectedRoomId) ??
      this.roomFees[this.roomFees.length - 1]
    );
  }

  get tuitionForSelectedWeeks(): number {
    return this.selectedCourse.tuition * (this.selectedWeeks / 4);
  }

  get roomFeeForSelectedWeeks(): number {
    return this.selectedRoom.fee * (this.selectedWeeks / 4);
  }

  get isPeakSeason(): boolean {
    const startDate = this.parseDate(this.selectedStartDate);

    return [
      ['2026-06-14', '2026-08-08'],
      ['2027-01-17', '2027-02-14'],
    ].some(
      ([start, end]) =>
        startDate >= this.parseDate(start) && startDate <= this.parseDate(end),
    );
  }

  get seasonalSurcharge(): number {
    return this.isPeakSeason ? this.selectedWeeks * this.seasonalFeePerWeek : 0;
  }

  get quoteUsd(): number {
    return (
      this.registrationFee +
      (this.tuitionForSelectedWeeks + this.roomFeeForSelectedWeeks) *
        this.discount +
      this.seasonalSurcharge
    );
  }

  get quoteUsdText(): string {
    return `USD ${this.formatUsd(this.quoteUsd)} 起`;
  }

  get quoteCnyText(): string {
    const rounded = Math.round((this.quoteUsd * this.usdToCny) / 100) * 100;

    return `约 ${rounded.toLocaleString('zh-CN')} 元起`;
  }

  get discountText(): string {
    return `${Math.round(this.discount * 100)} 折`;
  }

  formatUsd(value: number): string {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: Number.isInteger(value) ? 0 : 1,
      maximumFractionDigits: 1,
    });
  }

  private parseDate(value: string): Date {
    return new Date(`${value}T00:00:00`);
  }
}

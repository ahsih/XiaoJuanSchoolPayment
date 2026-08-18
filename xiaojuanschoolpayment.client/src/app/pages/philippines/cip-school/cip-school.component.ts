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
  maxWeeks?: number;
}

interface RoomFee {
  id: string;
  name: string;
  englishName: string;
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
  readonly weekOptions = [1, 2, 3, 4, 8, 12, 16, 20, 24];

  selectedGalleryCategory: GalleryCategory = '全部';
  selectedCourseId = 'regular-esl';
  selectedRoomId = 'd4';
  selectedWeeks = 4;
  selectedStartDate = '2026-09-06';
  readonly courseRegistrationFee = 600;
  readonly accommodationRegistrationFee = 500;

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
      title: 'Speaking Master / Intensive ESL',
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
      id: 'light-esl',
      name: '自由 Light ESL',
      tuition: 4320,
      suitable: '自由型轻量综合英语',
      schedule: '4节菲师一对一 + 1节大团体课（1:12）',
      note: '小团体课最多6人，大团体课最多15人。',
    },
    {
      id: 'native-light',
      name: '自由外教 NL-Premium Native Light',
      tuition: 8220,
      suitable: '自由型外教口语',
      schedule: '4节外教一对一 + 1节大团体课（1:12）',
      note: '适合希望提高Native一对一比例的学生。',
    },
    {
      id: 'regular-esl',
      name: '半斯巴达 Regular ESL',
      tuition: 4920,
      suitable: '半斯巴达综合英语',
      schedule: '3节菲师一对一 + 3节小团体（1:5）+ 2节大团体（1:12）',
      note: '综合课程与团体表达并重。',
    },
    {
      id: 'native-esl',
      name: '半斯巴达外教 Native ESL',
      tuition: 6420,
      suitable: '半斯巴达Native口语',
      schedule: '3节菲师一对一 + 1节外教一对一 + 3节小团体（1:5）+ 1节大团体（1:12）',
      note: '适合重视外教口语与发音纠正的学生。',
    },
    {
      id: 'speaking-master',
      name: '半斯巴达 Speaking Master',
      tuition: 7200,
      suitable: '口语强化',
      schedule: '5节菲师一对一 + 1节外教一对一 + 1节小团体（1:5）+ 1节大团体（1:12）',
      note: '最多报名8周。',
      maxWeeks: 8,
    },
    {
      id: 'native-master',
      name: '半斯巴达 Native Master',
      tuition: 8200,
      suitable: 'Native高密度口语',
      schedule: '4节菲师一对一 + 2节外教一对一 + 1节小团体（1:5）+ 1节大团体（1:12）',
      note: '最多报名8周。',
      maxWeeks: 8,
    },
    {
      id: 'advanced-business',
      name: '半斯巴达商务英语 Advanced Business',
      tuition: 6960,
      suitable: '商务与职场沟通',
      schedule: '3节菲师一对一 + 1节外教一对一 + 2节小团体（1:5）+ 1节大团体（1:12）',
      note: '适合面试、工作表达和商务场景训练。',
    },
    {
      id: 'toeic-regular',
      name: '半斯巴达 TOEIC Regular',
      tuition: 5280,
      suitable: '托业备考',
      schedule: '5节菲师一对一 + 2节小团体（1:5）+ 1节大团体（1:12）',
      note: '需确认模考、教材和入学程度要求。',
    },
    {
      id: 'intensive-esl',
      name: '斯巴达 Intensive ESL',
      tuition: 5640,
      suitable: '斯巴达综合英语',
      schedule: '5节菲师一对一 + 2节小团体（1:5）+ 1节大团体（1:12）+ 2节晚课',
      note: '周一至周四晚课1小时，另有咨询或自学安排；每周三下午约5点安排单词和文法小考，每4周等级测试。',
    },
    {
      id: 'ielts-intensive',
      name: '斯巴达 IELTS Intensive',
      tuition: 6180,
      suitable: '雅思强化',
      schedule: '4节菲师一对一 + 4节小团体（1:5）+ 3节晚课',
      note: '入学雅思3.5分；周一至周四每天3小时晚课（雅思课2小时、自学1小时），每周三下午口语测试。',
    },
    {
      id: 'ielts-basic',
      name: '斯巴达 IELTS Basic',
      tuition: 5820,
      suitable: '雅思基础',
      schedule: '4节菲师一对一 + 3节小团体（1:5）+ 1节大团体（1:12）+ 3节晚课',
      note: '入学雅思2.5至3分；周一至周四每天3小时晚课，每周三下午口语测试。',
    },
    {
      id: 'ielts-native',
      name: '斯巴达 IELTS Native',
      tuition: 7200,
      suitable: 'Native雅思强化',
      schedule: '3节菲师一对一 + 1节外教一对一 + 4节小团体（1:5）+ 3节晚课',
      note: '入学雅思3.5分；周一至周四每天3小时晚课，每周三下午口语测试。',
    },
    {
      id: 'ielts-guarantee-8',
      name: '斯巴达雅思8周保分班 IELTS Score Guarantee',
      tuition: 7920,
      suitable: '8周雅思保分',
      schedule: '4节菲师一对一 + 4节小团体（1:5）+ 3节晚课',
      note: '注册后需通过线上测试；周一至周四每天3小时晚课，每周三下午口语测试，成绩下降可能触发管理规定。',
    },
    {
      id: 'ielts-guarantee-12',
      name: '斯巴达雅思12周保分班 IELTS Score Guarantee',
      tuition: 7200,
      suitable: '12周雅思保分',
      schedule: '4节菲师一对一 + 4节小团体（1:5）+ 3节晚课',
      note: '注册后需通过线上测试；周一至周四每天3小时晚课，每周三下午口语测试，成绩下降可能触发管理规定。',
    },
    {
      id: 'primary-english',
      name: '半斯巴达7–11岁 Primary English',
      tuition: 7380,
      suitable: '7–11岁儿童英语',
      schedule: '5节菲师一对一 + 1节小团体（1:5）+ 2节晚课（选修）',
      note: '晚课为晚班学生辅导家庭作业或补课时间，不是强制安排。',
    },
    {
      id: 'junior-esl',
      name: '半斯巴达12–15岁 Junior ESL',
      tuition: 7920,
      suitable: '12–15岁青少年英语',
      schedule: '5节菲师一对一 + 2节小团体（1:5）+ 2节晚课（选修）',
      note: '年龄、监护和住宿规则需报名前确认。',
    },
    {
      id: 'junior-native',
      name: '半斯巴达12–15岁外教 Junior Native',
      tuition: 8940,
      suitable: '12–15岁Native英语',
      schedule: '4节菲师一对一 + 1节外教一对一 + 2节小团体（1:5）+ 2节晚课（选修）',
      note: '年龄、监护和住宿规则需报名前确认。',
    },
    {
      id: 'speak-up',
      name: '短期训练 Speak Up',
      tuition: 7620,
      suitable: '1–2周短期口语冲刺',
      schedule: '7节菲师一对一 + 1节外教一对一',
      note: '最多报名2周。',
      maxWeeks: 2,
    },
  ];

  roomFees: RoomFee[] = [
    {
      id: 'in-campus-single-a',
      name: '校内单人间A',
      englishName: 'Single A',
      fee: 6480,
      note: '分离式冷气，房内空间较大。',
    },
    {
      id: 'in-campus-single-b',
      name: '校内单人间B',
      englishName: 'Single B',
      fee: 5580,
      note: '窗型冷气，房内空间较小。',
    },
    {
      id: 'in-campus-double',
      name: '校内双人间',
      englishName: 'Double',
      fee: 4680,
      note: '适合同伴同行。',
    },
    {
      id: 'in-campus-triple',
      name: '校内三人间',
      englishName: 'Triple',
      fee: 4020,
      note: '适合兼顾预算与入住人数。',
    },
    {
      id: 'd4',
      name: '校内四人间（有1床在地板）',
      englishName: 'Quadruple',
      fee: 3420,
      note: '仅限亲子；默认报价参考。',
    },
    {
      id: 'deluxe-king-single',
      name: '校外豪华大床房（单人）',
      englishName: 'Deluxe King (Single)',
      fee: 11564,
      note: '1张大号床，适合单人、情侣或1–2人家庭。',
    },
    {
      id: 'deluxe-king-double',
      name: '校外豪华大床房（双人）',
      englishName: 'Deluxe King (Double)',
      fee: 6874,
      note: '1张大号床，适合情侣或2人家庭。',
    },
    {
      id: 'deluxe-twin-double',
      name: '校外豪华双人间',
      englishName: 'Deluxe Twin (Double)',
      fee: 7571,
      note: '1张大床 + 1张单人床，适合家庭或情侣2–3人。',
    },
    {
      id: 'deluxe-twin-triple',
      name: '校外豪华三人间',
      englishName: 'Deluxe Twin (Triple)',
      fee: 5688,
      note: '1张大床 + 1张单人床，适合家庭或朋友2–3人。',
    },
    {
      id: 'executive-suite-triple',
      name: '校外行政套房三人',
      englishName: 'Executive Suite (Triple)',
      fee: 8275,
      note: '2个卧室大床 + 客厅沙发床，适合朋友或家庭3–5人。',
    },
    {
      id: 'executive-suite-quad',
      name: '校外行政套房四人',
      englishName: 'Executive Suite (Quad)',
      fee: 6626,
      note: '2个卧室大床 + 客厅沙发床，适合朋友或家庭3–5人。',
    },
  ];

  localFees: LocalFee[] = [
    { item: 'SSP / SSP E-card', amount: '报名时确认', note: '未列在本次课程与住宿价目截图中' },
    { item: '管理费', amount: '报名时确认', note: '按学习周数和学校当期收费确认' },
    { item: '水电费', amount: '报名时确认', note: '按周期或实际使用调整' },
    { item: '教材费', amount: '报名时确认', note: '按课程和实际购买教材调整' },
    { item: '押金', amount: '报名时确认', note: '退房检查后按学校规则退还' },
    { item: '接机费', amount: '报名时确认', note: '需区分Clark或Manila机场及同行人数' },
    { item: '签证延签 / ACR I-card', amount: '按周数确认', note: '长期学习时可能需要' },
  ];

  readonly feeStructureCards = [
    {
      icon: 'school',
      title: '前期学费',
      rows: [
        { label: '课程费', value: '按所选CIP课程，以人民币4周价为基准' },
        { label: '住宿费', value: '按校内宿舍或校外房型，以人民币4周价为基准' },
        { label: '课程注册费', value: 'RMB 600' },
        { label: '住宿注册费', value: 'RMB 500' },
      ],
      note: '两项注册费合计RMB 1,100，为一次性费用。',
    },
    {
      icon: 'payments',
      title: '到校费用',
      rows: this.localFees.slice(0, 5).map((fee) => ({
        label: fee.item,
        value: fee.amount,
      })),
      note: '当地费用不在本次课程与住宿价目截图中，需报名时确认。',
    },
    {
      icon: 'hotel',
      title: '住宿提醒',
      rows: [
        { label: '校内宿舍', value: '单人、双人、三人、四人等房型需按空房确认' },
        { label: '校外Hotel', value: '官方说明为距离学校约5分钟车程' },
        { label: '家庭报名', value: '需额外核对年龄、监护、餐食和接送' },
      ],
      note: '房型空位、入住人数和亲子限制需以学校确认结果为准。',
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
      title: '确认价格适用期',
      text: '本页已按提供的2026 CIP人民币价目表更新，报名时仍需确认价格适用期、空房和优惠。',
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
        '本页已按提供的2026 CIP人民币价目表更新课程费、住宿费和注册费；学校价格、空房、入住规则和当地费用仍需在报名时确认。',
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
    '2026人民币课程与住宿价已更新',
    '1/2/3周按40%/65%/85%计算',
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

  get availableWeekOptions(): number[] {
    const maxWeeks = this.selectedCourse.maxWeeks;
    return maxWeeks
      ? this.weekOptions.filter((weeks) => weeks <= maxWeeks)
      : this.weekOptions;
  }

  ensureValidWeeks(): void {
    if (!this.availableWeekOptions.includes(this.selectedWeeks)) {
      this.selectedWeeks = this.availableWeekOptions[this.availableWeekOptions.length - 1];
    }
  }

  get selectedWeekMultiplier(): number {
    if (this.selectedWeeks === 1) return 0.4;
    if (this.selectedWeeks === 2) return 0.65;
    if (this.selectedWeeks === 3) return 0.85;
    return this.selectedWeeks / 4;
  }

  get tuitionForSelectedWeeks(): number {
    return this.selectedCourse.tuition * this.selectedWeekMultiplier;
  }

  get roomFeeForSelectedWeeks(): number {
    return this.selectedRoom.fee * this.selectedWeekMultiplier;
  }

  get registrationFee(): number {
    return this.courseRegistrationFee + this.accommodationRegistrationFee;
  }

  get longTermDiscount(): number {
    return ({ 16: 300, 20: 600, 24: 900 } as Record<number, number>)[
      this.selectedWeeks
    ] ?? 0;
  }

  get quoteCny(): number {
    return (
      this.registrationFee +
      this.tuitionForSelectedWeeks +
      this.roomFeeForSelectedWeeks -
      this.longTermDiscount
    );
  }

  get quoteCnyText(): string {
    return `RMB ${this.formatCny(this.quoteCny)} 起`;
  }

  get durationRuleText(): string {
    if (this.selectedWeeks === 1) return '4周价的40%';
    if (this.selectedWeeks === 2) return '4周价的65%';
    if (this.selectedWeeks === 3) return '4周价的85%';
    if (this.longTermDiscount > 0) return `长期优惠RMB ${this.longTermDiscount}`;
    return '按4周价格成倍计算';
  }

  formatCny(value: number): string {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  }
}

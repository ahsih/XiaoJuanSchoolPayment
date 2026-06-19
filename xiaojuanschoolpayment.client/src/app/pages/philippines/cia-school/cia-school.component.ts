import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { catchError, EMPTY, forkJoin, switchMap } from 'rxjs';
import { SchoolFeeDTO } from '../../../../interfaces/school-fees.dto';
import { SchoolLessonDTO } from '../../../../interfaces/school-lessons.dto';
import { SchoolRoomDTO } from '../../../../interfaces/school-rooms.dto';
import { SchoolService } from '../../../../services/school.service';

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
  icon: string;
}

interface CourseFee {
  id: string;
  name: string;
  tuition: number;
  suitable: string;
  schedule: string;
  note: string;
  highlightNote?: boolean;
}

interface ScheduleItem {
  time: string;
  title: string;
  text: string;
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

@Component({
  selector: 'app-cia-school',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule],
  templateUrl: './cia-school.component.html',
  styleUrl: './cia-school.component.css',
})
export class CiaSchoolComponent implements OnInit {
  @ViewChild('gallerySlider') private gallerySlider?: ElementRef<HTMLElement>;

  private readonly schoolService = inject(SchoolService);
  private readonly ciaPricingSchoolName = 'CIA Cebu International Academy';
  private readonly courseFeeOrder = [
    'regular-esl',
    'intensive-esl',
    'power-intensive',
    'pre-toeic',
    'toeic-regular',
    'toeic-guarantee',
    'pre-ielts',
    'ielts-regular',
    'ielts-guarantee',
    'business',
    'working-holiday',
    'certified-university',
    'callan',
    'junior',
    'guardian',
    'immersion',
  ];
  private readonly roomFeeOrder = ['p1', 's1', 'pn1', 'd2', 'd3', 'd4', 'sr1', 'sr2', 'sr3', 'sr4'];
  private readonly featuredGalleryCategories: ReadonlyArray<Exclude<GalleryCategory, '全部'>> = ['校园', '教室', '设施'];
  private readonly courseFeeDetails: Record<string, Pick<CourseFee, 'schedule' | 'note' | 'suitable' | 'highlightNote'>> = {
    'regular-esl': {
      suitable: '基础综合提升',
      schedule: '一对一4课时 + 团体3课时（小1、中1、大1）+ 选修课1节',
      note: 'ESL 可在报名时提前申请不参加晨测。',
    },
    'intensive-esl': {
      suitable: '想增加一对一课时',
      schedule: '一对一5课时 + 团体2课时（小1、中1）+ 选修课1节',
      note: '更适合短期加强口语和老师纠音。',
    },
    'power-intensive': {
      suitable: '短期高强度口语突破',
      schedule: '一对一6课时 + 团体1课时（小1）+ 选修课1节',
      note: '课时强度最高，建议能接受密集学习。',
    },
    'pre-toeic': {
      suitable: '托业预备',
      schedule: '一对一4课时 + 团体3课时（小1、中2）+ 选修课1节',
      note: '托业方向需参加晨考词汇测试。',
    },
    'toeic-regular': {
      suitable: '托业常规备考',
      schedule: '一对一4课时 + 团体3课时（小1、中2）+ 选修课1节',
      note: '必须参加晨考词汇测试，不参加当天不可以出校。',
    },
    'toeic-guarantee': {
      suitable: '托业保分',
      schedule: '一对一4课时 + 团体3课时（小1、中2）+ 选修课1节',
      note: '保分班通常有入学分数、出勤和模考要求。',
    },
    'pre-ielts': {
      suitable: '雅思预备',
      schedule: '一对一4课时 + 团体3课时（小1、中2）+ 选修课1节',
      note: '适合还需要先打基础的雅思学生。',
    },
    'ielts-regular': {
      suitable: '雅思常规备考',
      schedule: '一对一4课时 + 团体3课时（小1、中2）+ 选修课1节',
      note: '适合已有目标分数，至少学习4周。',
    },
    'ielts-guarantee': {
      suitable: '雅思保分',
      schedule: '一对一4课时 + 团体3课时（小1、中2）',
      note: '保分班需确认入学分数、出勤率和官方考试安排。',
    },
    business: {
      suitable: '商务沟通与面试表达',
      schedule: '一对一5课时 + 团体2课时（小1、中1）+ 选修课1节',
      note: '适合职场沟通、邮件、会议和面试场景。',
    },
    'working-holiday': {
      suitable: '海外生活与面试沟通',
      schedule: '一对一4课时 + 团体3课时（小1、中1、大1）+ 选修课1节',
      note: '适合准备打工度假或长期海外生活。',
    },
    'certified-university': {
      suitable: '大学衔接英语',
      schedule: '一对一4课时 + 团体3课时（小1、中1、大1）+ 选修课1节',
      note: '建议先确认合作大学和证书要求。',
    },
    callan: {
      suitable: '快速口语反应训练',
      schedule: '一对一5课时 + 团体2课时（小1、中1）+ 选修课1节',
      note: '适合想用高频问答提升口语反应的学生。',
    },
    junior: {
      suitable: '15岁以下青少年',
      schedule: '青少年：6节一对一',
      note: '满15周岁可选择 ESL，未满15周岁通常选择青少年课程。',
      highlightNote: true,
    },
    guardian: {
      suitable: '亲子监护人',
      schedule: '监护人：4节一对一 + 团体2课时（小1、中1）',
      note: '适合陪读家长同步学习。',
    },
    immersion: {
      suitable: '大学沉浸体验',
      schedule: '一对一4课时 + 团体3课时 + 每4周6小时大学旁听课程',
      note: 'IAU大学需单独再付注册金50美元，航校另计。',
    },
  };

  readonly galleryCategories: GalleryCategory[] = ['全部', '校园', '教室', '住宿', '餐厅', '设施'];
  selectedGalleryCategory: GalleryCategory = '全部';

  registrationFee = 100;
  readonly discount = 0.95;
  seasonalFeePerWeek = 40;
  readonly usdToCny = 7.2;
  readonly weekOptions = [1, 2, 3, 4, 8, 12];

  selectedCourseId = 'regular-esl';
  selectedRoomId = 'd4';
  selectedWeeks = 4;
  selectedStartDate = '2026-05-18';
  quoteCalculated = false;

  readonly quickInfo: QuickInfo[] = [
    {
      icon: 'apartment',
      label: '学校类型',
      value: '宿务麦克坦度假型校区',
      note: '半斯巴达管理',
    },
    {
      icon: 'groups',
      label: '适合人群',
      value: '15岁以上学生',
      note: '短期游学、备考、亲子和成人',
    },
    {
      icon: 'verified_user',
      label: '管理模式',
      value: '半斯巴达',
      note: '每日测试、门禁、出勤管理',
    },
    {
      icon: 'school',
      label: '课程选项',
      value: 'ESL / IELTS / TOEIC',
      note: '另有商务英语与假期项目',
    },
    {
      icon: 'bed',
      label: '住宿房型',
      value: '单人到四人间',
      note: '校内住宿，热门房型需早确认',
    },
    {
      icon: 'event_available',
      label: '年龄要求',
      value: '15岁以上',
      note: '未成年学生建议提前确认监护安排',
    },
  ];

  readonly galleryImages: GalleryImage[] = [
    {
      category: '校园',
      title: '校园泳池与主楼',
      description: '麦克坦校区主楼、宿舍楼和泳池区域。',
      src: 'assets/cia/campus-building.png',
    },
    {
      category: '校园',
      title: '户外泳池',
      description: '课后休息和校园活动常用区域。',
      src: 'assets/cia/campus-pool.jpg',
    },
    {
      category: '教室',
      title: '一对一教室',
      description: '适合口语纠音、写作反馈和考试专项训练。',
      src: 'assets/cia/one-to-one-class.png',
    },
    {
      category: '教室',
      title: '小组课教室',
      description: '用于团体讨论、听说训练和课程互动。',
      src: 'assets/cia/small-group-class.jpg',
    },
    {
      category: '住宿',
      title: '单人间',
      description: '预算较高但隐私和安静度更好。',
      src: 'assets/cia/single-room.jpg',
    },
    {
      category: '住宿',
      title: '双人间',
      description: '适合朋友同行或希望兼顾预算与隐私的学生。',
      src: 'assets/cia/twin-room.jpg',
    },
    {
      category: '住宿',
      title: '四人间 D-4',
      description: '默认报价参考房型，预算压力相对低。',
      src: 'assets/cia/quad-room.jpg',
    },
    {
      category: '餐厅',
      title: '学生餐厅',
      description: '三餐与自助餐台，适合关注日常饮食的学生查看。',
      src: 'assets/cia/dining-hall.jpg',
    },
    {
      category: '设施',
      title: '健身房',
      description: '课后运动、体能恢复和休闲区域。',
      src: 'assets/cia/fitness-center.jpg',
    },
  ];

  readonly basicInfo: BasicInfoRow[] = [
    { label: '学校名称', value: 'CIA Cebu International Academy' },
    { label: '所在地区', value: 'Lapu-Lapu City, Mactan, Cebu' },
    { label: '创校时间', value: '2003年创校，麦克坦校区2020年启用' },
    { label: '学生容量', value: '约600名学生' },
    { label: '教师规模', value: '约300名教师' },
    { label: '管理模式', value: '半斯巴达：每日测试、出勤、门禁和EOP管理' },
    { label: '住宿房型', value: '校内单人间、双人间、三人间、四人间、套房' },
    { label: '核心资源', value: 'IDP IELTS官方考点、Cambridge认证、校内餐厅与设施' },
  ];

  readonly highlights: Highlight[] = [
    {
      image: 'assets/cia/quad-room.jpg',
      title: '预算房型清楚',
      text: '四人间 D-4 是默认预算参考，适合先估算总费用。',
    },
    {
      image: 'assets/cia/campus-building.png',
      title: '校内生活集中',
      text: '上课、住宿、餐厅和设施都在同一校区，适合第一次游学。',
    },
    {
      image: 'assets/cia/one-to-one-class.png',
      title: '一对一比例高',
      text: 'ESL、考试和商务方向都能搭配一对一课程。',
    },
    {
      image: 'assets/cia/dining-hall.jpg',
      title: '生活配套成熟',
      text: '餐厅、健身房、泳池、医务和学生服务都比较完整。',
    },
  ];

  readonly suitableFor: FitItem[] = [
    {
      title: '第一次去菲律宾游学',
      text: '希望课程、住宿、餐厅、接机和校园服务集中，减少适应压力。',
    },
    {
      title: '想认真学但不想完全封闭',
      text: '能接受每日测试和门禁，也希望保留一定休息和周末生活。',
    },
    {
      title: '重视校园环境和住宿',
      text: '希望学校设施较新，宿舍、餐厅、泳池和健身房都在校内。',
    },
    {
      title: '准备 IELTS / TOEIC',
      text: '需要考试课程、模考安排和校内考点氛围。',
    },
  ];

  readonly notSuitableFor: FitItem[] = [
    {
      title: '只想完全自由生活',
      text: 'CIA 仍有出勤、门禁、每日测试和校内规则，需要配合管理。',
    },
    {
      title: '预算非常紧',
      text: '环境和设施较好，单人间、旺季和当地费用会明显拉高预算。',
    },
    {
      title: '临近旺季才决定',
      text: '暑假、寒假、亲子和热门房型空房紧张，报价需要先确认。',
    },
    {
      title: '只看图片就想定校',
      text: '建议先确认课程强度、房型、到校费用和个人学习目标是否匹配。',
    },
  ];

  readonly courses: CourseItem[] = [
    {
      name: 'Regular ESL',
      type: '基础综合英语',
      lessons: '4节一对一 + 小组课 + 选修/自习',
      suitable: '适合第一次游学、希望稳步提升听说读写的学生。',
      icon: 'school',
    },
    {
      name: 'Intensive ESL',
      type: '强化英语',
      lessons: '增加一对一比例，搭配小组课',
      suitable: '适合短期想加强口语表达和老师纠音的学生。',
      icon: 'menu_book',
    },
    {
      name: 'Power Intensive',
      type: '高强度一对一',
      lessons: '更多一对一课程，学习节奏更紧',
      suitable: '适合4周左右集中突破口语、听力和表达的学生。',
      icon: 'psychology',
    },
    {
      name: 'IELTS Regular',
      type: '雅思备考',
      lessons: '听说读写专项 + 模考 + 语法词汇',
      suitable: '适合已有分数目标，至少学习4周的学生。',
      icon: 'edit_note',
    },
    {
      name: 'IELTS Guarantee',
      type: '雅思保证班',
      lessons: '12周起，需达到入学分数与出勤要求',
      suitable: '适合目标明确、能接受严格出勤和模考要求的学生。',
      icon: 'workspace_premium',
    },
    {
      name: 'TOEIC Regular',
      type: '托业备考',
      lessons: '听力、阅读、语法和考试技巧',
      suitable: '适合求职、升学或企业英语能力证明需求。',
      icon: 'verified',
    },
    {
      name: 'Business',
      type: '商务英语',
      lessons: '会议、演示、邮件、面试与商务表达',
      suitable: '适合职场人士或准备英文工作场景的学生。',
      icon: 'business_center',
    },
    {
      name: 'Working Holiday',
      type: '打工度假英语',
      lessons: '生活英语、面试表达和场景沟通',
      suitable: '适合准备海外生活、打工度假或长线旅行的人群。',
      icon: 'travel_explore',
    },
    {
      name: 'Immersion',
      type: '沉浸体验',
      lessons: '校内课程搭配校外或大学相关体验',
      suitable: '适合想把学习和当地文化体验结合的学生。',
      icon: 'forum',
    },
  ];

  courseFees: CourseFee[] = [
    { id: 'regular-esl', name: 'Regular ESL', tuition: 900, ...this.courseFeeDetails['regular-esl'] },
    { id: 'intensive-esl', name: 'Intensive ESL', tuition: 1000, ...this.courseFeeDetails['intensive-esl'] },
    { id: 'power-intensive', name: 'Power Intensive', tuition: 1100, ...this.courseFeeDetails['power-intensive'] },
    { id: 'pre-toeic', name: 'Pre-TOEIC', tuition: 1000, ...this.courseFeeDetails['pre-toeic'] },
    { id: 'toeic-regular', name: 'TOEIC Regular', tuition: 1000, ...this.courseFeeDetails['toeic-regular'] },
    { id: 'toeic-guarantee', name: 'TOEIC Guarantee', tuition: 1000, ...this.courseFeeDetails['toeic-guarantee'] },
    { id: 'pre-ielts', name: 'Pre-IELTS', tuition: 1050, ...this.courseFeeDetails['pre-ielts'] },
    { id: 'ielts-regular', name: 'IELTS Regular', tuition: 1050, ...this.courseFeeDetails['ielts-regular'] },
    { id: 'ielts-guarantee', name: 'IELTS Guarantee', tuition: 1050, ...this.courseFeeDetails['ielts-guarantee'] },
    { id: 'business', name: 'Business', tuition: 1050, ...this.courseFeeDetails['business'] },
    { id: 'working-holiday', name: 'Working Holiday', tuition: 950, ...this.courseFeeDetails['working-holiday'] },
    { id: 'certified-university', name: 'CERTIFIED UNIVERSITY', tuition: 1000, ...this.courseFeeDetails['certified-university'] },
    { id: 'callan', name: 'CALLAN', tuition: 1050, ...this.courseFeeDetails['callan'] },
    { id: 'junior', name: '亲子青少年', tuition: 1300, ...this.courseFeeDetails['junior'] },
    { id: 'guardian', name: '亲子监护人', tuition: 1300, ...this.courseFeeDetails['guardian'] },
    { id: 'immersion', name: 'Immersion 大学沉浸式课程', tuition: 1000, ...this.courseFeeDetails['immersion'] },
  ];

  readonly schedule: ScheduleItem[] = [
    { time: '07:20 - 08:00', title: '每日测试', text: '词汇或课程相关测试，影响当天外出资格。' },
    { time: '08:00 - 12:05', title: '上午课程', text: '一对一、小组课或考试专项课，按课程表安排。' },
    { time: '12:05 - 13:05', title: '午餐与休息', text: '校内餐厅用餐，下午课程前整理学习资料。' },
    { time: '13:05 - 15:30', title: '下午课程', text: '小组课、专项训练、口语或语法词汇课程。' },
    { time: '15:35 - 17:10', title: '自习 / 阅读 / 写作', text: '用于完成作业、复盘一对一反馈或准备模考。' },
    { time: '17:15 - 20:10', title: '选修或晚间课程', text: '按课程和个人选择安排，具体以到校课表为准。' },
  ];

  roomFees: RoomFee[] = [
    { id: 'p1', name: '豪华单人间 P-1', fee: 1700, note: '豪华单人间多了一个电磁炉，可以简单加热食物' },
    { id: 's1', name: '标准单人间 S-1', fee: 1500, note: '标准单人间，适合重视独立空间的学生' },
    { id: 'pn1', name: '校外单人间 PN-1', fee: 1700, note: '在学校对面的4号楼' },
    { id: 'd2', name: '双人间 D-2', fee: 1100, note: '双人间，适合朋友同行或希望平衡预算' },
    { id: 'd3', name: '三人间 D-3', fee: 850, note: '预算比双人间更低' },
    { id: 'd4', name: '四人间 D-4', fee: 750, note: '默认报价参考，预算压力较低' },
    { id: 'sr1', name: '单人套房 SR-1', fee: 2500, note: '套房房型，空间更完整' },
    { id: 'sr2', name: '双人套房 SR-2', fee: 1400, note: '套房房型，适合两人入住' },
    { id: 'sr3', name: '三人套房 SR-3', fee: 1200, note: '套房房型，适合小组同行' },
    { id: 'sr4', name: '四人套房 SR-4', fee: 1100, note: '套房房型，预算和空间较平衡' },
  ];

  localFees: LocalFee[] = [
    { item: 'SSP', amount: 'PHP 8,000', note: '特别学习许可，通常到校支付' },
    { item: 'SSP E-card', amount: 'PHP 4,000', note: '以学校现场收费为准' },
    { item: '管理费', amount: 'PHP 4,000', note: '4周参考' },
    { item: '水电费', amount: 'PHP 2,000', note: '按周期或实际使用调整' },
    { item: '教材费', amount: 'PHP 2,000', note: '按课程和实际购买教材调整' },
    { item: '学生证', amount: 'PHP 200', note: '一次性费用参考' },
    { item: '押金', amount: 'PHP 2,500', note: '退房检查后按学校规则退还' },
    { item: '接机费', amount: 'PHP 1,000', note: '宿务机场接机参考' },
    { item: 'ACR I-card', amount: 'PHP 4,500', note: '长期学习或延签时可能需要' },
  ];

  readonly serviceSteps: ProcessStep[] = [
    {
      icon: 'person_search',
      title: '确认是否适合',
      text: '先了解学习目标、预算、房型偏好、年龄和入学时间，判断 CIA 是否匹配。',
    },
    {
      icon: 'fact_check',
      title: '确认课程、空房和优惠',
      text: '免费协助确认课程、房型、空房、优惠和正式报价，避免只按网页价格做决定。',
    },
    {
      icon: 'assignment_turned_in',
      title: '协助入境和签证手续',
      text: '思达免费协助办理菲律宾入境及签证相关手续，学生只需按顾问指引准备个人资料。',
    },
    {
      icon: 'inventory',
      title: '发送学习资料和行前清单',
      text: '入学前免费发送学习资料、行李清单、费用清单和到校注意事项。',
    },
    {
      icon: 'support_agent',
      title: '到校后继续跟进',
      text: '遇到换老师、调课、学习方法、宿舍生活或学校沟通问题，也可以继续联系思达协助。',
    },
    {
      icon: 'location_on',
      title: '宿务当地支持',
      text: '思达在宿务有工作人员驻点，可提供当地支持，直到学生完成学习并顺利回国。',
    },
  ];

  readonly schoolServices = [
    '机场接机',
    '入学说明',
    '分级测试',
    '课程咨询',
    '学生经理',
    '宿舍清洁',
    '洗衣服务',
    '医务室',
    '24小时保安',
    '证件协助',
  ];

  readonly campusActivities = [
    '新生说明会',
    '文化交流',
    '体育活动',
    '节日活动',
    '校内比赛与趣味活动',
  ];

  readonly weekendActivities = [
    '跳岛游',
    '海边活动',
    '商场购物',
    '城市观光',
    '学生自发聚会',
  ];

  readonly notes = [
    '热门房型、暑假和寒假档期建议尽早确认空房。',
    '菲律宾公共假期可能影响课程安排，通常不补课。',
    '到校支付费用会随学校政策、汇率和个人情况变化。',
    '未成年学生、亲子学生和长期学习学生，需要提前确认额外规则。',
    '最终报名以学校正式录取、付款节点和顾问确认报价为准。',
  ];

  readonly faqs: FaqItem[] = [
    {
      question: 'CIA 适合零基础学生吗？',
      answer: '适合。Regular ESL 可以从基础开始，但如果目标是短期快速开口，建议让顾问比较 Intensive 或 Power Intensive 是否更合适。',
    },
    {
      question: '页面上的 USD 1,667.5 是全部费用吗？',
      answer: '不是。它是默认4周 Regular ESL + 四人间 D-4 的前期支付参考，不包含到校后通常需要支付的 SSP、SSP E-card、管理费、水电费、教材费、学生证、押金等当地费用。',
    },
    {
      question: 'CIA 是不是斯巴达学校？',
      answer: 'CIA 更适合按半斯巴达理解。它有每日测试、出勤和门禁管理，但不是完全封闭式学校，适合想被学习节奏推动又希望保留一定生活空间的学生。',
    },
    {
      question: '为什么要找顾问确认报价？',
      answer: 'CIA 的空房、优惠、旺季附加费和当地费用会随时间变化。顾问可以把课程、房型、入学日期和最新优惠一起核对，给学生正式报价。',
    },
    {
      question: '思达会协助签证和入境吗？',
      answer: '会。通过思达报名 CIA，思达顾问会免费协助菲律宾入境及签证相关手续，学生只需要按顾问指引准备个人资料。',
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

  ngOnInit(): void {
    this.loadPricingFromDatabase();
  }

  private loadPricingFromDatabase(): void {
    this.schoolService
      .getSchools({ name: this.ciaPricingSchoolName })
      .pipe(
        switchMap((schools) => {
          const ciaSchool =
            schools.find((school) => school.name === this.ciaPricingSchoolName) ??
            schools.find((school) => school.name.toLowerCase().includes('cia')) ??
            schools[0];

          if (!ciaSchool?.id) {
            return EMPTY;
          }

          return forkJoin({
            lessons: this.schoolService.getSchoolLessons({ schoolId: ciaSchool.id, week: 4 }),
            rooms: this.schoolService.getSchoolRooms({ schoolId: ciaSchool.id, week: 4 }),
            fees: this.schoolService.getSchoolFees({ schoolId: ciaSchool.id }),
          });
        }),
        catchError(() => EMPTY),
      )
      .subscribe(({ lessons, rooms, fees }) => this.applyPricingData(lessons, rooms, fees));
  }

  private applyPricingData(lessons: SchoolLessonDTO[], rooms: SchoolRoomDTO[], fees: SchoolFeeDTO[]): void {
    const databaseCourseFees = lessons
      .filter((lesson) => lesson.week === 4)
      .map((lesson) => {
        const id = this.slugifyPriceKey(lesson.name);
        const details = this.courseFeeDetails[id];

        return {
          id,
          name: lesson.name,
          tuition: lesson.price,
          suitable: lesson.description || details?.suitable || lesson.note || '请联系顾问确认适合人群',
          schedule: details?.schedule || lesson.note || '请联系顾问确认课表安排',
          note: details?.note || '最终以学校当期报价和课程安排为准。',
          highlightNote: details?.highlightNote,
        };
      })
      .sort((a, b) => this.orderIndex(this.courseFeeOrder, a.id) - this.orderIndex(this.courseFeeOrder, b.id));

    if (databaseCourseFees.length > 0) {
      const mergedCourseFees = this.courseFees.map((course) => {
        const databaseCourse = databaseCourseFees.find((item) => item.id === course.id);

        return databaseCourse
          ? {
              ...course,
              name: databaseCourse.name,
              tuition: databaseCourse.tuition,
              suitable: databaseCourse.suitable || course.suitable,
            }
          : course;
      });
      const extraDatabaseCourseFees = databaseCourseFees.filter((course) => !this.courseFees.some((item) => item.id === course.id));

      this.courseFees = [...mergedCourseFees, ...extraDatabaseCourseFees].sort(
        (a, b) => this.orderIndex(this.courseFeeOrder, a.id) - this.orderIndex(this.courseFeeOrder, b.id)
      );
      if (!this.courseFees.some((course) => course.id === this.selectedCourseId)) {
        this.selectedCourseId = this.courseFees[0].id;
      }
    }

    const databaseRoomFees = rooms
      .filter((room) => room.week === 4)
      .map((room) => ({
        id: this.createRoomId(room.name),
        name: room.name,
        fee: room.price,
        note: room.description || '请联系顾问确认空房',
      }))
      .sort((a, b) => this.orderIndex(this.roomFeeOrder, a.id) - this.orderIndex(this.roomFeeOrder, b.id));

    if (databaseRoomFees.length > 0) {
      const hasCompleteDatabaseRoomFees = this.roomFeeOrder.every((roomId) => databaseRoomFees.some((room) => room.id === roomId));
      const mergedRoomFees = this.roomFees.map((room) => {
        const databaseRoom = hasCompleteDatabaseRoomFees
          ? databaseRoomFees.find((item) => item.id === room.id && item.name === room.name) ??
            databaseRoomFees.find((item) => item.id === room.id)
          : undefined;

        return databaseRoom
          ? {
              ...room,
              name: databaseRoom.name,
              fee: databaseRoom.fee,
              note: databaseRoom.note || room.note,
            }
          : room;
      });
      const extraDatabaseRoomFees = databaseRoomFees.filter((room) => !this.roomFees.some((item) => item.id === room.id));

      this.roomFees = [...mergedRoomFees, ...extraDatabaseRoomFees].sort(
        (a, b) => this.orderIndex(this.roomFeeOrder, a.id) - this.orderIndex(this.roomFeeOrder, b.id)
      );
      if (!this.roomFees.some((room) => room.id === this.selectedRoomId)) {
        this.selectedRoomId = this.roomFees[this.roomFees.length - 1].id;
      }
    }

    const registrationFee = fees.find((fee) => fee.name === '注册费');
    if (registrationFee) {
      this.registrationFee = registrationFee.fee;
    }

    const peakSeasonFee = fees.find((fee) => fee.name === '旺季附加费');
    if (peakSeasonFee) {
      this.seasonalFeePerWeek = peakSeasonFee.fee;
    }

    const databaseLocalFees = fees
      .filter((fee) => this.currencyCodeForDisplay(fee.currencyCode) === 'PHP')
      .map((fee) => ({
        item: fee.name,
        amount: this.formatCurrencyAmount(fee),
        note: this.cleanFeeDescription(fee.description),
      }));

    if (databaseLocalFees.length > 0) {
      this.localFees = databaseLocalFees;
    }
  }

  setGalleryCategory(category: GalleryCategory): void {
    this.selectedGalleryCategory = category;
    window.setTimeout(() => this.gallerySlider?.nativeElement.scrollTo({ left: 0, behavior: 'smooth' }));
  }

  scrollGallery(direction: -1 | 1): void {
    const slider = this.gallerySlider?.nativeElement;

    if (!slider) {
      return;
    }

    const firstSlide = slider.querySelector('figure');
    const slideWidth = firstSlide?.getBoundingClientRect().width ?? slider.clientWidth;

    slider.scrollBy({
      left: direction * (slideWidth + 12),
      behavior: 'smooth',
    });
  }

  openGalleryFromPreview(event?: Event): void {
    this.setGalleryCategory('全部');
    this.scrollToSection('gallery', event);
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
    const targetTop = targetElement.getBoundingClientRect().top + window.scrollY - headerOffset;

    window.scrollTo({
      top: Math.max(targetTop, 0),
      behavior: 'smooth',
    });

    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#${target}`);
  }

  get filteredGalleryImages(): GalleryImage[] {
    if (this.selectedGalleryCategory === '全部') {
      return this.galleryImages.filter((image) => this.featuredGalleryCategories.includes(image.category));
    }

    return this.galleryImages.filter((image) => image.category === this.selectedGalleryCategory);
  }

  get heroGalleryPreviewImages(): GalleryImage[] {
    return this.galleryImages.filter((image) => this.featuredGalleryCategories.includes(image.category)).slice(0, 4);
  }

  get selectedCourse(): CourseFee {
    return this.courseFees.find((course) => course.id === this.selectedCourseId) ?? this.courseFees[0];
  }

  get selectedRoom(): RoomFee {
    return this.roomFees.find((room) => room.id === this.selectedRoomId) ?? this.roomFees[this.roomFees.length - 1];
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
    ].some(([start, end]) => startDate >= this.parseDate(start) && startDate <= this.parseDate(end));
  }

  get seasonalSurcharge(): number {
    return this.isPeakSeason ? this.selectedWeeks * this.seasonalFeePerWeek : 0;
  }

  get quoteUsd(): number {
    return this.registrationFee + (this.tuitionForSelectedWeeks + this.roomFeeForSelectedWeeks) * this.discount + this.seasonalSurcharge;
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

  private slugifyPriceKey(value: string): string {
    return value
      .toLowerCase()
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  private orderIndex(order: string[], value: string): number {
    const index = order.indexOf(value);

    return index === -1 ? Number.MAX_SAFE_INTEGER : index;
  }

  private createRoomId(name: string): string {
    const roomCode = name.match(/\b((?:pn|sr)|[psd])\s*-?\s*(\d)\b/i);

    if (roomCode) {
      return `${roomCode[1].toLowerCase()}${roomCode[2]}`;
    }

    return this.slugifyPriceKey(name);
  }

  private currencyCodeForDisplay(code?: string): string {
    if (!code) {
      return 'USD';
    }

    return code.toUpperCase() === 'PESO' ? 'PHP' : code.toUpperCase();
  }

  private formatCurrencyAmount(fee: SchoolFeeDTO): string {
    const currencyCode = this.currencyCodeForDisplay(fee.currencyCode);

    return `${currencyCode} ${fee.fee.toLocaleString('en-US', {
      minimumFractionDigits: Number.isInteger(fee.fee) ? 0 : 1,
      maximumFractionDigits: 1,
    })}`;
  }

  private cleanFeeDescription(description?: string): string {
    if (!description) {
      return '以学校现场收费为准';
    }

    return description.replace(/^到校支付费用；/, '').replace(/^前期支付费用；/, '');
  }

  private parseDate(value: string): Date {
    return new Date(`${value}T00:00:00`);
  }
}

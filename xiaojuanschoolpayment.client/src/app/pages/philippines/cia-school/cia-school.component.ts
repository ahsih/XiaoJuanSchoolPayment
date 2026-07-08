import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { catchError, EMPTY, forkJoin, switchMap } from 'rxjs';
import { ExpandableImageComponent } from '../../../components/expandable-image.component';
import { QuoteImageCardData, QuoteImageDownloadButtonComponent } from '../../../components/quote-image-download-button.component';
import { SchoolFeeDTO } from '../../../../interfaces/school-fees.dto';
import { SchoolLessonDTO } from '../../../../interfaces/school-lessons.dto';
import { SchoolPhotoDTO } from '../../../../interfaces/school-photo.dto';
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
  details?: string[];
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

interface StudentCareService {
  icon: string;
  number: string;
  title: string;
  subtitle: string;
  text: string;
  location: string;
  schedule: string;
  points: string[];
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

interface CtaConsultant {
  title: string;
  name: string;
  description: string;
  phone: string;
  phoneHref: string;
  avatarSrc: string;
  qrSrc: string;
  buttonLabel: string;
}

interface CourseMatchAdvisor {
  icon: string;
  title: string;
  name: string;
  text: string;
}

@Component({
  selector: 'app-cia-school',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule, ExpandableImageComponent, QuoteImageDownloadButtonComponent],
  templateUrl: './cia-school.component.html',
  styleUrl: './cia-school.component.css',
})
export class CiaSchoolComponent implements OnInit {
  @ViewChild('gallerySlider') private gallerySlider?: ElementRef<HTMLElement>;

  private readonly schoolService = inject(SchoolService);
  private readonly ciaPricingSchoolName = 'CIA Cebu International Academy';
  private readonly quoteImageAssets = {
    logo: '/assets/sida-qihang-quote-header-logo-transparent.png',
    hero: '/assets/cia/campus-building.png',
    jennyAvatar: '/assets/contact/jenny-avatar.jpg',
    jennyQr: '/assets/contact/jenny-wechat-qr.png',
    lemonAvatar: '/assets/contact/lemon-avatar.jpg',
    lemonQr: '/assets/contact/lemon-wechat-qr.png',
    peninAvatar: '/assets/contact/penin-avatar.jpg',
    peninQr: '/assets/contact/penin-wechat-qr.png',
  };
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
  private readonly uploadedPhotoCategoryIndexes: Record<string, number> = {
    campus: 1,
    classroom: 2,
    accommodation: 3,
    dining: 4,
    facility: 5,
  };
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
  usingUploadedGallery = false;

  registrationFee = 100;
  readonly discount = 0.95;
  seasonalFeePerWeek = 40;
  readonly usdToCny = 7.2;
  readonly weekOptions = [1, 2, 3, 4, 8, 12];

  selectedCourseId = 'regular-esl';
  selectedRoomId = 'd4';
  selectedWeeks = 4;
  selectedStartDate = '2026-07-05';
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

  galleryImages: GalleryImage[] = [
    {
      category: '校园',
      title: '校园泳池与主楼',
      description: '麦克坦校区第二栋于2022年完成，整体是度假型校园氛围，学习、住宿和生活设施集中。',
      src: 'assets/cia/campus-building.png',
      details: ['半斯巴达 Plus 校区', '周末可前往周边餐厅和景点'],
    },
    {
      category: '校园',
      title: '校园地图',
      description: '校区分为 Building 1、Building 2 和 Building 3，餐厅、CRO、诊所、健身房、图书馆、宿舍和篮球场等分布在不同楼栋。',
      src: 'assets/cia/campus-map.png',
      details: ['Building 2：餐厅、CRO、健身房、图书馆', 'Building 3：宿舍、泳池平台、篮球场'],
    },
    {
      category: '校园',
      title: '户外泳池',
      description: '主泳池位于校园中心，约50米宽，度假感强，是课后休息和校园活动常用区域。',
      src: 'assets/cia/campus-pool.jpg',
      details: ['平日 19:00-21:00', '周末 07:00-21:00'],
    },
    {
      category: '教室',
      title: '一对一教室',
      description: '一对一教室配备白板和桌面空间，适合口语纠音、写作反馈和考试专项训练。',
      src: 'assets/cia/one-to-one-class.png',
      details: ['253间一对一教室', '更容易集中注意力'],
    },
    {
      category: '教室',
      title: '小组课教室',
      description: '用于团体讨论、听说训练和课程互动。',
      src: 'assets/cia/small-group-class.jpg',
      details: ['17间小组教室', '适合互动练习'],
    },
    {
      category: '教室',
      title: '中组课教室',
      description: '中组课堂适合听说互动、主题讨论和课堂发表。',
      src: 'assets/cia/medium-group-class.jpg',
      details: ['24间中组教室', '练习讨论与表达'],
    },
    {
      category: '教室',
      title: '大组课教室',
      description: '大组课堂适合发表、演讲、辩论和更大型的课堂活动。',
      src: 'assets/cia/big-group-class.jpg',
      details: ['7间大组教室', '适合演讲与辩论训练'],
    },
    {
      category: '教室',
      title: '教室楼层环境',
      description: 'CIA 教室配备多用途教学设备，课程包含一对一、小组、中组和大组不同形式。',
      src: 'assets/cia/classroom-overview.png',
      details: ['多屏幕教学环境', '按课程目标安排不同班型'],
    },
    {
      category: '住宿',
      title: '校内宿舍概览',
      description: '宿舍紧邻 Building 2，减少通勤时间，方便学生把更多时间留给学习和休息。',
      src: 'assets/cia/dormitory-overview.jpg',
      details: ['单人、双人、三人、四人间可选', '每周清洁一次，洗衣每周两次'],
    },
    {
      category: '住宿',
      title: '单人间',
      description: '适合希望专注学习、重视个人空间和安静度的学生。',
      src: 'assets/cia/single-room.jpg',
      details: ['床、桌子、衣柜、保险箱', '洗手盆、热水淋浴、冰箱、Wi-Fi'],
    },
    {
      category: '住宿',
      title: '双人间',
      description: '适合朋友同行，或希望有室友交流又保留一定生活空间的学生。',
      src: 'assets/cia/twin-room.jpg',
      details: ['床、桌子、衣柜、保险箱', '空调、冰箱、独立卫浴、Wi-Fi'],
    },
    {
      category: '住宿',
      title: '三人间',
      description: '适合希望控制预算，同时多和不同国籍室友练习英语的学生。',
      src: 'assets/cia/triple-room.jpg',
      details: ['更容易练习日常英语', '清洁每周一次，洗衣每周两次'],
    },
    {
      category: '住宿',
      title: '四人间 D-4',
      description: '预算压力相对低，适合愿意和多位室友共同生活、增加英语使用机会的学生。',
      src: 'assets/cia/quad-room.jpg',
      details: ['默认报价常用参考房型', '适合预算优先学生'],
    },
    {
      category: '餐厅',
      title: '学生餐厅',
      description: '位于 Building 2 一楼，空间宽敞并配有空调，学校厨房每天提供不同餐食。',
      src: 'assets/cia/dining-hall.jpg',
      details: ['早餐、午餐、晚餐在校内餐厅', '周末也有用餐时段'],
    },
    {
      category: '餐厅',
      title: 'Cafe Bar',
      description: '咖啡吧提供饮品、轻食和点心，适合课后休息或和同学聊天。',
      src: 'assets/cia/cafe-bar.jpg',
      details: ['Building 2 一楼', '咖啡、蛋糕、松饼等轻食'],
    },
    {
      category: '设施',
      title: '健身房',
      description: '位于 Building 2 四楼，提供现代化健身器材，适合课后运动和保持体能。',
      src: 'assets/cia/fitness-center.jpg',
      details: ['平日 19:00-23:00', '周末 07:00-23:00'],
    },
    {
      category: '设施',
      title: 'IDP IELTS 官方考场',
      description: '校内设有雅思官方考试场地，空间安静宽敞，方便雅思学生熟悉考试环境。',
      src: 'assets/cia/idp-testing-venue.jpg',
      details: ['Building 1 一楼和二楼', '适合雅思备考学生'],
    },
    {
      category: '设施',
      title: 'Recreation Room',
      description: '休闲娱乐室可用于活动、游戏和学生休息，帮助学生在学习之外放松。',
      src: 'assets/cia/recreation-room.jpg',
      details: ['Building 2 四楼', '平日课后和周末开放'],
    },
    {
      category: '设施',
      title: '图书馆 / 自习室',
      description: '图书馆空间宽敞，提供 ESL 教材和不同类型读物，适合自习和课后复习。',
      src: 'assets/cia/library.jpg',
      details: ['Building 2 四楼', '每天 06:00-23:00'],
    },
    {
      category: '设施',
      title: '校内诊所',
      description: '诊所可处理轻微不适和基础医疗咨询，校内有护士，并可按需要联系医生。',
      src: 'assets/cia/clinic.jpg',
      details: ['Building 2 三楼', '平日 08:00-18:00'],
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
    { label: '亮点', target: 'highlights', icon: 'star' },
    { label: '视频', target: 'videos', icon: 'play_circle' },
    { label: '环境', target: 'gallery', icon: 'image' },
    { label: '课程', target: 'courses', icon: 'menu_book' },
    { label: '费用', target: 'quote', icon: 'calculate' },
    { label: '服务', target: 'service-process', icon: 'support_agent' },
    { label: 'FAQ', target: 'faq', icon: 'help' },
  ];

  readonly snapshotCards = [
    {
      icon: 'apartment',
      title: '学校定位',
      text: '宿务麦克坦岛半斯巴达英语学校',
    },
    {
      icon: 'workspace_premium',
      title: '考试资源',
      text: 'IDP IELTS 官方考场，定期考试，成绩更快',
    },
    {
      icon: 'menu_book',
      title: '课程覆盖',
      text: 'ESL / IELTS / TOEIC / Business / Working Holiday',
    },
    {
      icon: 'bed',
      title: '住宿生活',
      text: '校内宿舍、餐厅、泳池、健身房等',
    },
    {
      icon: 'person',
      title: '适合人群',
      text: '成人英语、雅思备考、职场提升、亲子营',
    },
    {
      icon: 'support_agent',
      title: '顾问提醒',
      text: '更适合看重综合体验、课程和生活便利的学生',
    },
  ];

  readonly coreHighlights = [
    {
      icon: 'domain',
      image: 'assets/cia/campus-building.png',
      title: '新麦克坦校区',
      text: '校区空间较新，学习、住宿、餐厅和设施集中，生活更便利。',
    },
    {
      icon: 'fact_check',
      image: 'assets/cia/one-to-one-class.png',
      title: 'IDP IELTS 官方考场',
      text: '拥有 IDP IELTS 官方考点，适合雅思目标学生熟悉考试环境。',
    },
    {
      icon: 'auto_stories',
      image: 'assets/cia/small-group-class.jpg',
      title: '课程体系完整',
      text: 'ESL、IELTS、TOEIC、Business、Working Holiday、CALLAN 等方向可选。',
    },
    {
      icon: 'shield',
      image: 'assets/cia/quad-room.jpg',
      title: '半斯巴达管理',
      text: '有学习节奏与监督，也保留一定自由度，适合多数学生。',
    },
    {
      icon: 'favorite',
      image: 'assets/cia/campus-pool.jpg',
      title: '校园设施丰富',
      text: '泳池、健身房、自习室、餐厅等一体配套，课后生活更完整。',
    },
    {
      icon: 'groups',
      image: 'assets/cia/dining-hall.jpg',
      title: '国际学生氛围',
      text: '来自韩国、日本、台湾、越南、中国等国家和地区的学生较多。',
    },
  ];

  readonly videoCards = [
    {
      title: '一般英语小组课程视频',
      text: '剑桥英语资格课程',
      videoSrc: 'assets/cia-video/ESL, WORKING HOLIDAY & TESOL COURSE INTRO.mp4',
      details: ['1 对 1 课程 4 节', '小组课程 2 节', '中组课程 1 节', '大组课程 1 节'],
    },
    {
      title: '雅思小组课程视频',
      text: '雅思官方考试中心',
      videoSrc: 'assets/cia-video/(English School in Cebu, Philippines) Cebu International Academy - IELTS Course Introduction.mp4',
      details: ['1 对 1 课程 4 节', '雅思专项辅导课 2 节', '雅思语法课 1 节', '雅思词汇课 1 节'],
    },
    {
      title: '托业小组课程视频',
      text: '托业备考课程',
      videoSrc: 'assets/cia-video/(English School in Cebu, Philippines ) Cebu International Academy - TOEIC Course Introduction.mp4',
      details: ['1 对 1 课程 4 节', '小组课程 2 节', '中组课程 1 节', '大组课程 1 节'],
    },
    {
      title: '商务英语小组课程视频',
      text: '剑桥商务英语课程',
      videoSrc: 'assets/cia-video/BUSINESS GROUP VIDEO.mp4',
      details: ['1 对 1 课程 4 节', '小组课程 2 节', '中组课程 1 节', '大组课程 1 节'],
    },
  ];

  readonly courseChoiceCards = [
    {
      icon: 'chat_bubble_outline',
      label: '第一次游学',
      title: 'Regular ESL',
      text: '均衡提升英语听说读写，适合打基础的学生。',
    },
    {
      icon: 'person_add',
      label: '想多上一对一',
      title: 'Intensive / Power Intensive',
      text: '增加一对一课时，适合短期快速提升英语能力。',
    },
    {
      icon: 'track_changes',
      label: '雅思目标',
      title: 'Pre-IELTS / IELTS Regular / IELTS Guarantee',
      text: '备考全套体系，可参加模考与官方考试资源。',
    },
    {
      icon: 'scoreboard',
      label: '托业目标',
      title: 'TOEIC Regular / TOEIC Guarantee',
      text: '听力、阅读强化，适合求职或升学分数目标。',
    },
    {
      icon: 'business_center',
      label: '职场英语',
      title: 'Business English',
      text: '商务沟通、会议、邮件和面试实用训练。',
    },
    {
      icon: 'flight_takeoff',
      label: '特色项目',
      title: 'Working Holiday / CALLAN / Immersion',
      text: '适合打工度假、口语训练或大学深度体验项目。',
    },
  ];

  readonly studentCareServices: StudentCareService[] = [
    {
      icon: 'support_agent',
      number: '01',
      title: 'CRO 客户关系办公室',
      subtitle: '24小时学生支援',
      text: '学生在校期间遇到生活不便、突发状况或一般咨询时，可由 CRO 团队协调处理；紧急情况可联系对应国家经理并协助安排救护车等支援。',
      location: '2号楼前台区域',
      schedule: '每天',
      points: ['一般学生服务', '邮局快递协助'],
    },
    {
      icon: 'school',
      number: '02',
      title: 'AA 学业顾问',
      subtitle: '课程与生活咨询',
      text: '新生会安排 Academic Advisor，协助课程、课表、学习规划和学校生活适应，也可提供保密的学习与生活咨询。',
      location: '线上 / 线下',
      schedule: '每天',
      points: ['课程、课表与课程体系建议', '学习与生活咨询'],
    },
    {
      icon: 'forum',
      number: '03',
      title: 'SNS 线上沟通服务',
      subtitle: '公告与经理联络',
      text: '学校会通过线上渠道发布校内活动、生活提醒和重要公告；学生出发前及到校后，也可通过对应国家常用通讯软件联系国际经理。',
      location: '线上 SNS',
      schedule: '每天',
      points: ['校内信息通知', '国际经理沟通'],
    },
    {
      icon: 'record_voice_over',
      number: '04',
      title: 'EOP 英语使用规则',
      subtitle: '鼓励多说英语',
      text: '教室和指定英语区域鼓励使用英语。校内会有 EOP 巡查，违规罚款会用于每月活动及公益捐赠，帮助学生增加英语输出机会。',
      location: 'A楼及指定英语区域',
      schedule: '每天',
      points: ['提高英语使用频率', '营造英语学习环境'],
    },
    {
      icon: 'airport_shuttle',
      number: '05',
      title: '接机服务与迎新包',
      subtitle: '从机场到校园',
      text: '新生抵达机场后，CIA 工作人员会在到达区迎接并安排校车前往校园；到校后会说明设施、安全须知，并提供临时学生证和迎新资料。',
      location: '机场到达区 / 校园内',
      schedule: '抵达当天',
      points: ['机场接机至宿舍', '到校基础说明与迎新资料'],
    },
    {
      icon: 'edit_note',
      number: '06',
      title: 'Daily Test 每日测试',
      subtitle: '词汇、语法与写作节奏',
      text: '新生入学说明时会收到每日测试资料。周一至周四早上安排基础词汇、语法测试，并配合自习写作练习，由一对一写作老师检查。',
      location: 'SSR / C楼',
      schedule: '周一至周四 07:20-07:54',
      points: ['低于要求分数会影响外出权限', '迟到、带手机或未写姓名可能记零分'],
    },
    {
      icon: 'medical_services',
      number: '07',
      title: '医疗服务',
      subtitle: '护士与校医支援',
      text: '学校护士会照顾学生健康，校医每周到校一次，可提供医疗建议、处方建议，必要时建议就医，并在紧急情况中及时协助。',
      location: 'A楼诊所',
      schedule: '护士每天 / 医生每周一次',
      points: ['如需校医检查，早上登记申请', '紧急情况及时响应'],
    },
  ];

  readonly feeStructureCards = [
    {
      icon: 'account_balance_wallet',
      title: '前期支付费用（到校前）',
      rows: [
        { label: '注册费', value: 'USD 100' },
        { label: '课程费（含折扣）', value: 'USD 855' },
        { label: '住宿费（含折扣）', value: 'USD 712.5' },
        { label: '旺季附加费', value: 'USD 160' },
      ],
      note: '合计约 USD 1,827.5',
    },
    {
      icon: 'celebration',
      title: '到校支付学杂费（到校后）',
      rows: [
        { label: 'SSP 特殊学习许可证', value: 'PHP 8,000' },
        { label: 'SSP E-card', value: 'PHP 4,500' },
        { label: '水电费（预估）', value: 'PHP 3,000' },
        { label: '教材费（预估）', value: 'PHP 2,000' },
      ],
      note: '预计人民币 2,500+',
    },
    {
      icon: 'receipt_long',
      title: '可能产生费用（按需支付）',
      rows: [
        { label: 'ACR I-card 外国人身份证', value: 'PHP 4,500' },
        { label: '签证延期（按月）', value: 'PHP 5,130+' },
        { label: '换机票（周日接机）', value: 'PHP 1,000' },
        { label: '额外考试费', value: 'USD 250' },
      ],
      note: '按实际发生金额支付',
    },
  ];

  readonly lifeCards = [
    {
      icon: 'home',
      image: 'assets/cia/campus-building.png',
      title: '宿舍',
      text: '多种房型可选，独立卫浴、空调、热水、WiFi 全覆盖。',
    },
    {
      icon: 'restaurant',
      image: 'assets/cia/dining-hall.jpg',
      title: '餐食',
      text: '三餐营养搭配，兼顾亚洲口味与不同学生需求。',
    },
    {
      icon: 'local_laundry_service',
      image: 'assets/cia/twin-room.jpg',
      title: '洗衣打扫',
      text: '定期打扫公共区域，学生可使用校内洗衣服务。',
    },
    {
      icon: 'fitness_center',
      image: 'assets/cia/fitness-center.jpg',
      title: '校园设施',
      text: '泳池、健身房、篮球场、自习室和休闲空间齐全。',
    },
    {
      icon: 'location_on',
      image: 'assets/cia/campus-pool.jpg',
      title: '周边生活',
      text: '超市、餐厅、商场、银行和机场等生活资源较便利。',
    },
  ];

  readonly studentTracks = [
    {
      icon: 'business',
      title: '成人主校区',
      text: '通常15岁以上，以 ESL / IELTS / TOEIC / Business 等课程为主，适合独立学习的学生或成人。',
    },
    {
      icon: 'family_restroom',
      title: '亲子 / 青少年营',
      text: '通常7岁起参加，按假期档期开放，可随在校外照顾或独立营地进行。',
    },
    {
      icon: 'assignment',
      title: '报名提醒',
      text: '报名确认前先确认年龄要求、营地地点、开课日期、房型和监护支持与费用明细。',
    },
  ];

  readonly serviceCards = [
    {
      icon: 'card_travel',
      title: '免费协助办理菲律宾签证',
      text: '资深团队指导，材料清单清晰，出签更高效。',
    },
    {
      icon: 'public',
      title: '菲律宾及多国驻点支持',
      text: '当地团队7×24小时响应，遇到问题第一时间解决。',
    },
    {
      icon: 'apartment',
      title: '真实确认空房优惠和入学档期',
      text: '实时核查学校可用名额，帮你锁定合适档期。',
    },
    {
      icon: 'price_check',
      title: '费用拆分透明无隐形消费',
      text: '学费、住宿、杂费清晰拆分，每一项都明白自由。',
    },
    {
      icon: 'inventory',
      title: '行前学习资料与准备清单',
      text: '提供英语预习资料、行前指南和生活须知，让你更快适应。',
    },
    {
      icon: 'support_agent',
      title: '到校后继续协助',
      text: '接机、入学协助、生活支持、课程与学习跟进。',
    },
    {
      icon: 'school',
      title: '游学 + 留学一起规划',
      text: '未来升学、转校、续读，我们为你提前布局。',
    },
    {
      icon: 'redeem',
      title: '老学员后续专属优惠',
      text: '续学、转课程、推荐好友，可享受思达专属回馈。',
    },
  ];

  readonly processTimeline = [
    { icon: 'chat', title: '告诉顾问目标 / 周数 / 预算', text: '明确需求与期望' },
    { icon: 'fact_check', title: '确认课程和房型', text: '匹配最优方案' },
    { icon: 'apartment', title: '查询空房和优惠', text: '锁定档期名额' },
    { icon: 'description', title: '获取正式报价', text: '费用透明无隐藏' },
    { icon: 'check_circle', title: '完成报名付款', text: '保留名额' },
    { icon: 'badge', title: '免费协助签证和行前资料', text: '材料指导更省心' },
    { icon: 'flight_takeoff', title: '抵达菲律宾并入学', text: '接机入学无忧' },
    { icon: 'school', title: '学习期间持续协助至完成学习回国', text: '全程陪伴更安心' },
  ];

  readonly enrollmentChecks = [
    { icon: 'flag', title: '目标课程', text: 'ESL / IELTS / TOEIC / Business 或其他课程' },
    { icon: 'event', title: '入学日期', text: '确定计划入学的具体日期' },
    { icon: 'bed', title: '房型', text: '选择适合的房型（单人 / 双人 / 多人 / 套房）' },
    { icon: 'trending_up', title: '是否旺季', text: '旺季名额紧张，建议提前报名' },
    { icon: 'quiz', title: '是否需要雅思官方考试', text: '如需确认考试日期与考位安排' },
    { icon: 'payments', title: '到校学杂费预算', text: '确认额外费用预算（学杂费 / 电费等）' },
    { icon: 'sync_alt', title: '是否考虑续读或转校', text: '如有长期规划，建议提前准备' },
  ];

  readonly ctaBadges = ['正规签约保障', '费用透明无隐形消费', '菲律宾及多国驻点支持', '学习期间持续协助'];

  readonly courseMatchAdvisors: CourseMatchAdvisor[] = [
    {
      icon: 'school',
      title: '英爱留学规划',
      name: 'Jenny',
      text: '后续帮衔接爱尔兰/英国留学',
    },
    {
      icon: 'public',
      title: '多国家方案比较',
      name: 'Lemon',
      text: '还没确定国家，想比较费用和路线',
    },
    {
      icon: 'travel_explore',
      title: '菲律宾与东南亚游学',
      name: 'Penin',
      text: 'CIA、菲律宾学校、马来/新加坡/越南短期英语',
    },
  ];

  readonly ctaConsultants: CtaConsultant[] = [
    {
      title: '英爱留学规划',
      name: 'Jenny',
      description: '适合爱尔兰/英国本科、硕士、预科、半工半读，以及后续升学规划。',
      phone: '132 4982 7686',
      phoneHref: 'tel:13249827686',
      avatarSrc: this.quoteImageAssets.jennyAvatar,
      qrSrc: this.quoteImageAssets.jennyQr,
      buttonLabel: '咨询英爱留学',
    },
    {
      title: '多国家方案规划',
      name: 'Lemon',
      description: '适合还没确定国家，想比较费用、时间、路线和升学路径。',
      phone: '132 9852 9856',
      phoneHref: 'tel:13298529856',
      avatarSrc: this.quoteImageAssets.lemonAvatar,
      qrSrc: this.quoteImageAssets.lemonQr,
      buttonLabel: '咨询多国方案',
    },
    {
      title: '菲律宾与东南亚游学',
      name: 'Penin',
      description: '适合 CIA 菲律宾游学、马来西亚、新加坡、越南短期英语课程。',
      phone: '153 6765 9331',
      phoneHref: 'tel:15367659331',
      avatarSrc: this.quoteImageAssets.peninAvatar,
      qrSrc: this.quoteImageAssets.peninQr,
      buttonLabel: '咨询游学方案',
    },
  ];

  ngOnInit(): void {
    this.loadPricingFromDatabase();
    this.loadGalleryFromDatabase();
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

  private loadGalleryFromDatabase(): void {
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

          return this.schoolService.getSchoolPhotos({ schoolId: ciaSchool.id, isActive: true });
        }),
        catchError(() => EMPTY),
      )
      .subscribe((photos) => this.applyGalleryPhotos(photos));
  }

  private applyGalleryPhotos(photos: SchoolPhotoDTO[]): void {
    const uploadedPhotos = (photos ?? [])
      .filter((photo) => Boolean(photo.url))
      .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));

    if (uploadedPhotos.length === 0) {
      return;
    }

    const existingSources = new Set(this.galleryImages.map((image) => image.src));
    const uploadedGalleryImages = uploadedPhotos.map((photo) => ({
      category: this.resolveUploadedPhotoCategory(photo.category),
      title: photo.caption || photo.altText || photo.originalFileName || 'CIA Cebu photo',
      description: photo.altText || photo.caption || 'CIA Cebu school photo',
      src: photo.url ?? '',
    })).filter((image) => !existingSources.has(image.src));

    this.usingUploadedGallery = true;
    this.galleryImages = [...this.galleryImages, ...uploadedGalleryImages];
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
    this.setGalleryCategory(this.galleryCategories[0]);
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
    if (this.selectedGalleryCategory === this.galleryCategories[0]) {
      return this.galleryImages;
    }

    return this.galleryImages.filter((image) => image.category === this.selectedGalleryCategory);
  }

  get heroGalleryPreviewImages(): GalleryImage[] {
    if (this.usingUploadedGallery) {
      return this.galleryImages.slice(0, 4);
    }

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

  get quoteImageData(): QuoteImageCardData {
    const now = new Date();
    const quoteMonth = `${now.getFullYear()}年${now.getMonth() + 1}月`;
    const quoteCnyAmount = Math.round((this.quoteUsd * this.usdToCny) / 100) * 100;
    const discountUsd = (this.tuitionForSelectedWeeks + this.roomFeeForSelectedWeeks) * (1 - this.discount);
    const roomCapacityMatch = this.selectedRoom.name.match(/([1-9])\s*人/) ?? this.selectedRoom.id.match(/(\d)/);
    const roomCapacity = roomCapacityMatch?.[1] ? `${roomCapacityMatch[1]}人` : '按房型确认';
    const fileDate = this.selectedStartDate.replace(/[^0-9]/g, '') || 'quote';

    return {
      fileName: `CIA-${this.selectedWeeks}周报价单-${fileDate}.png`,
      logoSrc: this.quoteImageAssets.logo,
      heroSrc: this.quoteImageAssets.hero,
      schoolCode: 'CIA',
      title: `${this.selectedWeeks}周菲律宾游学`,
      subtitle: 'Cebu International Academy / 宿务麦克坦岛 / 半斯巴达英语学校',
      quoteDateText: quoteMonth,
      updatedAtText: quoteMonth,
      studentItems: [
        { icon: '周', label: '学习周数', value: `${this.selectedWeeks}周` },
        { icon: '日', label: '入学日期', value: this.selectedStartDate.replace(/-/g, '/') },
        { icon: '课', label: '课程', value: this.selectedCourse.name },
        { icon: '排', label: '课程安排', value: this.selectedCourse.schedule },
        { icon: '房', label: '房型', value: this.selectedRoom.name },
        { icon: '人', label: '入住人数', value: roomCapacity },
      ],
      paymentItems: [
        { icon: '注', label: '注册费', amount: `USD ${this.formatUsd(this.registrationFee)}` },
        {
          icon: '课',
          label: `课程费（${this.selectedCourse.name} ${this.selectedWeeks}周）`,
          amount: `USD ${this.formatUsd(this.tuitionForSelectedWeeks)}`,
        },
        {
          icon: '宿',
          label: `住宿费（${this.selectedRoom.name} ${this.selectedWeeks}周）`,
          amount: `USD ${this.formatUsd(this.roomFeeForSelectedWeeks)}`,
        },
        {
          icon: '旺',
          label: '旺季附加费',
          note: `USD ${this.formatUsd(this.seasonalFeePerWeek)}/周 x ${this.selectedWeeks}周`,
          amount: `USD ${this.formatUsd(this.seasonalSurcharge)}`,
        },
        {
          icon: '折',
          label: '思达折扣',
          note: `(${this.discountText}，仅课程费和住宿费)`,
          amount: `- USD ${this.formatUsd(discountUsd)}`,
          accent: true,
        },
      ],
      totalLabel: '前期支付参考合计',
      totalUsd: `USD ${this.formatUsd(this.quoteUsd)}`,
      totalCny: `约 RMB ${quoteCnyAmount.toLocaleString('zh-CN')}`,
      totalNote: '（按参考汇率估算）',
      localFeeAmount: '人民币 2500+',
      localFeeDescription: '包括 SSP、SSP E-card、水电费、管理费、教材费、学生证、房间押金等。',
      localFeeNote: '实际以到校后学校收取为准。',
      note: '本报价为参考估算，最终以 CIA 学校最新报价、空房、优惠及思达启航顾问确认为准。',
      contact: {
        name: 'Jenny',
        phone: '132 4982 7686',
        avatarSrc: this.quoteImageAssets.jennyAvatar,
        qrSrc: this.quoteImageAssets.jennyQr,
        wechatLabel: '微信二维码占位',
        footerText: '获取正式报价与空房确认',
      },
      consultants: [
        {
          title: '英爱留学',
          name: 'Jenny',
          description: '爱尔兰/英国本科、硕士、预科、半工半读',
          phone: '132 4982 7686',
          avatarSrc: this.quoteImageAssets.jennyAvatar,
          qrSrc: this.quoteImageAssets.jennyQr,
          buttonLabel: '咨询英爱留学',
        },
        {
          title: '多国方案',
          name: 'Lemon',
          description: '还没确定国家、想比较费用/时间/路径',
          phone: '132 9852 9856',
          avatarSrc: this.quoteImageAssets.lemonAvatar,
          qrSrc: this.quoteImageAssets.lemonQr,
          buttonLabel: '咨询多国方案',
        },
        {
          title: '菲律宾与东南亚',
          name: 'Penin',
          description: '菲律宾游学、马来/新加坡/越南短期英语',
          phone: '153 6765 9331',
          avatarSrc: this.quoteImageAssets.peninAvatar,
          qrSrc: this.quoteImageAssets.peninQr,
          buttonLabel: '咨询游学方案',
        },
      ],
    };
  }

  private resolveUploadedPhotoCategory(category?: string): Exclude<GalleryCategory, '全部'> {
    const normalizedCategory = (category ?? '').trim().toLowerCase();
    const categoryIndex = this.uploadedPhotoCategoryIndexes[normalizedCategory] ?? 1;

    return this.galleryCategories[categoryIndex] as Exclude<GalleryCategory, '全部'>;
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

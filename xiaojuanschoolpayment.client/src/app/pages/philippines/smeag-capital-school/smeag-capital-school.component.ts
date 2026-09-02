import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  OnInit,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { catchError, EMPTY, forkJoin, switchMap } from 'rxjs';
import { SchoolFeeDTO } from '../../../../interfaces/school-fees.dto';
import { SchoolLessonDTO } from '../../../../interfaces/school-lessons.dto';
import { SchoolRoomDTO } from '../../../../interfaces/school-rooms.dto';
import { ExchangeRateService } from '../../../../services/exchange-rate.service';
import { SchoolService } from '../../../../services/school.service';
import { buildPhilippinesDetailedQuote } from '../../../components/philippines-quote-image-data';
import { QuoteImageDownloadButtonComponent } from '../../../components/quote-image-download-button.component';

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
}

interface CourseFee {
  id: string;
  name: string;
  tuition: number;
  suitable: string;
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
  quantity: number;
  total: number;
  excluded?: boolean;
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
  selector: 'app-smeag-capital-school',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule, QuoteImageDownloadButtonComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './smeag-capital-school.component.html',
  styleUrls: [
    '../cebu-school-detail-layout.css',
    '../cebu-school-detail-content.css',
    '../cebu-school-detail-responsive.css',
    '../philippines-local-fee-table.css',
    '../ev-school/ev-school-detail.component.css',
    './smeag-capital-school.component.css',
  ],
})
export class SmeagCapitalSchoolComponent implements OnInit {
  private readonly schoolService = inject(SchoolService);
  private readonly exchangeRateService = inject(ExchangeRateService);
  private readonly pricingSchoolSearchName = 'SMEAG Capital';
  private readonly pricingSchoolNames = [
    '菲律宾宿务SMEAG Capital语言学校',
    'SMEAG Capital Campus',
    'SMEAG Capital',
    'SMEAG Global Education',
  ];
  private readonly courseFeeOrder = [
    'esl-regular-ket-pet-fce',
    'esl-cae',
    'speaking-master-ket-pet-fce',
    'speaking-master-cae',
    'esl-junior-2',
    'toefl-ielts-pre',
    'toefl-ielts-regular-guarantee',
    'toeic-pre',
    'toeic-regular-guarantee',
    'business',
    'esl-junior',
    'children',
    'guardian',
  ];
  private readonly roomFeeOrder = ['campus-single', 'campus-twin', 'campus-triple', 'campus-quad', 'campus-five', 'hotel-single', 'hotel-twin', 'hotel-triple', 'hotel-quad'];

  readonly galleryCategories: GalleryCategory[] = [
    '全部',
    '校园',
    '教室',
    '住宿',
    '餐厅',
    '设施',
  ];
  selectedGalleryCategory: GalleryCategory = '全部';

  registrationFee = 100;
  readonly discount = 0.9;
  lowSeasonDiscountPerWeek = 25;
  usdToCny = 7.2;
  phpPerCny = 7.75;
  exchangeRateDate = '';
  exchangeRateLive = false;
  readonly weekOptions = [1, 2, 3, 4, 8, 12, 16, 20, 24];

  selectedCourseId = 'esl-regular-ket-pet-fce';
  selectedRoomId = 'campus-quad';
  selectedWeeks = 4;
  selectedStartDate = '2026-09-07';
  quoteCalculated = false;

  readonly quickInfo: QuickInfo[] = [
    {
      icon: 'apartment',
      label: '学校类型',
      value: '宿务市区考试与综合英语校区',
      note: 'Capital Campus / SMEAG核心校区',
    },
    {
      icon: 'groups',
      label: '适合人群',
      value: '成人 / 考试 / 商务 / 亲子',
      note: '适合目标明确、能接受学习管理的学生',
    },
    {
      icon: 'verified_user',
      label: '管理模式',
      value: 'Sparta / Semi-Sparta',
      note: '前4周晨间与晚间Sparta课程需重点确认',
    },
    {
      icon: 'school',
      label: '课程选项',
      value: 'ESL / IELTS / TOEIC / TOEFL',
      note: '另有Speaking Master、Business和Family课程',
    },
    {
      icon: 'bed',
      label: '住宿房型',
      value: '单人 / 双人 / 三人 / 四人',
      note: '宿舍与教室在同一栋楼，通勤压力低',
    },
    {
      icon: 'workspace_premium',
      label: '考试资源',
      value: 'TOEFL ETS授权考点',
      note: 'IELTS、TOEIC、TOEFL方向都有模考与规则',
    },
  ];

  readonly galleryImages: GalleryImage[] = [
    {
      category: '校园',
      title: 'SMEAG Capital 校园入口',
      description:
        'SMEAG标识明显，适合作为学生到校后的第一印象和集合识别点。',
      src: 'https://www.ryugaku-onebridge.com/api/pict/7138?s=750x500',
    },
    {
      category: '校园',
      title: '咖啡与自习空间',
      description:
        'Capital校区公共空间兼顾学习、休息与同学交流，适合课后复习。',
      src: 'https://www.outtostudy.com/_next/image?q=75&url=https%3A%2F%2Fstorage.googleapis.com%2Foutto-strapi-cms-gcp%2Fcms%2F_a310e373a0%2F_a310e373a0.jpg&w=3840',
    },
    {
      category: '餐厅',
      title: '学生餐厅',
      description:
        '公开资料显示SMEAG Capital提供周末和假日餐食，长期学习更稳定。',
      src: 'https://storage.googleapis.com/world-study-prod/media/school_photo/866/57f253cf-ef5e-44c0-b52a-ec8c466147a4.jpg',
    },
    {
      category: '住宿',
      title: '多人宿舍参考',
      description:
        '宿舍房型按单人、双人、三人、四人区分，预算与隐私度差异明显。',
      src: 'https://www.ceburyugaku-master.com/school/img/smeag3/dormitory_09.jpg',
    },
    {
      category: '住宿',
      title: '宿舍学习区参考',
      description:
        '房间内配备基础学习空间，适合课后完成作业、背词和复习。',
      src: 'https://www.ioutback.com/getImage/school/main/4644.jpg',
    },
    {
      category: '住宿',
      title: '单人房参考',
      description:
        '单人房预算最高，适合重视隐私、睡眠和长期备考稳定性的学生。',
      src: 'https://www.hub1234.com/wp-content/uploads/2025/04/off-campus.jpg',
    },
    {
      category: '设施',
      title: '健身设施参考',
      description:
        '校内运动空间适合课后维持体能，尤其适合长周期考试备考学生。',
      src: 'https://www.geteducation.co.th/wp-content/uploads/2019/11/SMEAG-GYM-970x647.jpg',
    },
  ];

  readonly basicInfo: BasicInfoRow[] = [
    { label: '学校名称', value: '菲律宾宿务SMEAG Capital语言学校' },
    {
      label: '英文名称',
      value: 'SMEAG Global Education - Capital Campus',
    },
    {
      label: '所在地区',
      value: 'Emilio Osmeña cor. Bataan St., Guadalupe, Cebu City',
    },
    { label: '创校时间', value: '公开资料列出SMEAG成立于2006年' },
    { label: '学生规模', value: 'Capital校区公开资料约350名学生规模' },
    {
      label: '学校定位',
      value: '宿务市区型英语学校，重点是ESL、考试课程、商务英语和Family项目',
    },
    {
      label: '管理模式',
      value: 'Sparta与Semi-Sparta并行，前4周晨间/晚间Sparta课程需按规则参加',
    },
    {
      label: '费用参考',
      value: '2026价目表参考：ESL常规USD 840/4周，校内四人房USD 780/4周，注册费USD 100',
    },
  ];

  readonly highlights: Highlight[] = [
    {
      image:
        'https://www.outtostudy.com/_next/image?q=75&url=https%3A%2F%2Fstorage.googleapis.com%2Foutto-strapi-cms-gcp%2Fcms%2F_a310e373a0%2F_a310e373a0.jpg&w=3840',
      title: '考试与综合英语路线清楚',
      text: 'ESL、IELTS、TOEIC、TOEFL、Business和Family课程都能按目标拆开比较。',
    },
    {
      image:
        'https://storage.googleapis.com/world-study-prod/media/school_photo/866/57f253cf-ef5e-44c0-b52a-ec8c466147a4.jpg',
      title: '宿舍、餐厅、教室集中',
      text: 'Capital是市区楼宇型校区，减少在宿务城市内通勤的时间损耗。',
    },
    {
      image: 'https://www.ryugaku-onebridge.com/api/pict/7138?s=750x500',
      title: 'Sparta / Semi-Sparta可比较',
      text: '适合想认真学习，但需要根据生活自由度选择管理强度的成人学生。',
    },
    {
      image:
        'https://www.ceburyugaku-master.com/school/img/smeag3/dormitory_09.jpg',
      title: '房型影响预算明显',
      text: '四人房适合控制预算，单人房适合长期备考和重视安静的学生。',
    },
  ];

  readonly suitableFor: FitItem[] = [
    {
      title: '想在宿务市区集中学习',
      text: '校区位置在Cebu City，学习、住宿和基础生活集中，适合不想每天通勤的学生。',
    },
    {
      title: '需要考试课程或模考体系',
      text: 'IELTS、TOEIC、TOEFL方向都有明确课程和测试规则，适合目标分学生。',
    },
    {
      title: '想比较斯巴达和半斯巴达',
      text: '同一校区可按学习纪律和生活自由度选择节奏，报名前要确认最新规则。',
    },
    {
      title: '成人、商务或家庭同行',
      text: 'Business和Family Program可作为备选，但年龄、房型和监护规则需提前确认。',
    },
  ];

  readonly notSuitableFor: FitItem[] = [
    {
      title: '只想要海边度假型校园',
      text: 'Capital是市区楼宇型校区，若追求泳池度假感，可同时比较CIA、CPI或SMEAG Encanto。',
    },
    {
      title: '完全不想接受早晚学习安排',
      text: 'SMEAG规则强调前4周晨间与晚间Sparta课程，需提前确认自己能否配合。',
    },
    {
      title: '预算只看学费住宿，不看当地费用',
      text: 'SSP、SSP-I Card、押金、水电、管理费、接机和签证延长都要另算。',
    },
    {
      title: '临近开学才指定单人房',
      text: '单人房和热门档期房型容易紧张，建议至少提前确认空房和正式报价。',
    },
  ];

  readonly courses: CourseItem[] = [
    {
      name: 'ESL by Cambridge',
      type: '综合英语',
      lessons: '一对一 + 小组课 + 选修/Sparta课程',
      suitable: '适合基础提升、第一次游学和想按CEFR体系学习的学生。',
    },
    {
      name: 'Speaking Master',
      type: '口语强化',
      lessons: '提高一对一输出与反应训练',
      suitable: '适合想把开口、发音、表达组织能力放在优先级的学生。',
    },
    {
      name: 'Pre-IELTS / IELTS / Guarantee',
      type: '雅思备考',
      lessons: '听说读写专项 + 模考 + Sparta学习节奏',
      suitable: '适合有升学、移民或目标分需求，能接受考试规则的学生。',
    },
    {
      name: 'Pre-TOEIC / TOEIC',
      type: '多益备考',
      lessons: '听力、阅读、词汇、语法和每周测试',
      suitable: '适合求职、毕业门槛、企业英语和分数证明需求。',
    },
    {
      name: 'Pre-TOEFL / TOEFL',
      type: '托福备考',
      lessons: '学术英语与iBT考试专项训练',
      suitable: '适合北美升学、学术英语和官方考试目标学生。',
    },
    {
      name: 'Business English',
      type: '商务英语',
      lessons: '商务听说读写、演讲、会议与职场任务',
      suitable: '适合职场人士、面试准备、企业培训和商务沟通需求。',
    },
    {
      name: 'Family Program',
      type: '亲子课程',
      lessons: 'Child与Parents课程分开核对',
      suitable: '适合家长同行，但年龄、住宿、监护和课程强度要提前确认。',
    },
  ];

  courseFees: CourseFee[] = [
    { id: 'esl-regular-ket-pet-fce', name: 'ESL常规（KET/PET/FCE）', tuition: 840, suitable: '4节一对一 + 2节小组课 + 3小时选修 + 早晚斯巴达课' },
    { id: 'esl-cae', name: 'ESL（CAE）', tuition: 1320, suitable: '4节一对一 + 2节小组课 + 3小时选修 + 早晚斯巴达课' },
    { id: 'speaking-master-ket-pet-fce', name: 'ESL / Speaking Master（KET/PET/FCE）', tuition: 1140, suitable: '4节一对一 + 2节四人小组 + 2节选修（演讲/口语/商务）+ 早晚斯巴达课' },
    { id: 'speaking-master-cae', name: 'ESL / Speaking Master（CAE）', tuition: 1620, suitable: '4节一对一 + 2节四人小组 + 2节特殊课（演讲/口语/商务）+ 早晚斯巴达课' },
    { id: 'esl-junior-2', name: 'ESL Junior 2', tuition: 1140, suitable: '5节一对一 + 2节讨论团体课 + 电影团体课 + 团体作业辅导' },
    { id: 'toefl-ielts-pre', name: 'TOEFL / IELTS（预备班）', tuition: 1140, suitable: '4节一对一 + 2节四人小组 + 2节八人小组 + 早晚斯巴达课' },
    { id: 'toefl-ielts-regular-guarantee', name: 'TOEFL / IELTS（常规/12周保分）', tuition: 1260, suitable: '4节一对一 + 2节四人小组 + 2节八人小组 + 早晚斯巴达课；保分班须满足入学与模考要求' },
    { id: 'toeic-pre', name: 'TOEIC（预备班）', tuition: 1080, suitable: '4节一对一 + 2节小组课 + 2节选修 + 早晚斯巴达课' },
    { id: 'toeic-regular-guarantee', name: 'TOEIC（常规/保分）', tuition: 1140, suitable: '4节一对一 + 2节小组课 + 2节选修 + 早晚斯巴达课' },
    { id: 'business', name: 'Business', tuition: 1660, suitable: '8节一对一 + 选修课 + 早晚斯巴达课' },
    { id: 'esl-junior', name: 'ESL Junior', tuition: 840, suitable: '4节一对一 + 2节讨论团体课 + 电影团体课 + 团体作业辅导；6至14岁' },
    { id: 'children', name: '儿童课程', tuition: 1540, suitable: '4节一对一 + 4节团体课 + 2.5小时活动课（比如故事、游泳、跳舞、烹饪、艺术绘画等）；2至12岁（2至4岁Busybee，5至12岁Family Program）' },
    { id: 'guardian', name: '监护人课程', tuition: 840, suitable: '4节一对一 + 2节小组课' },
  ];

  roomFees: RoomFee[] = [
    { id: 'campus-single', name: '校内单人间', fee: 1180, note: '数量有限，热门档期需尽早确认' },
    { id: 'campus-twin', name: '校内双人间', fee: 1020, note: '适合同伴同行或希望减少室友人数' },
    { id: 'campus-triple', name: '校内三人间', fee: 880, note: '预算与生活空间比较平衡' },
    { id: 'campus-quad', name: '校内四人间', fee: 780, note: '默认报价参考房型' },
    { id: 'campus-five', name: '校内五人间', fee: 720, note: '校内住宿中预算最低' },
    { id: 'hotel-single', name: '校外酒店单人间', fee: 1420, note: '学校合作的校外酒店；校外住宿无折扣' },
    { id: 'hotel-twin', name: '校外酒店双人间', fee: 1260, note: '学校合作的校外酒店；校外住宿无折扣' },
    { id: 'hotel-triple', name: '校外酒店三人间', fee: 1120, note: '学校合作的校外酒店；校外住宿无折扣' },
    { id: 'hotel-quad', name: '校外酒店四人间', fee: 1020, note: '学校合作的校外酒店；校外住宿无折扣' },
  ];

  readonly schedule: ScheduleItem[] = [
    {
      time: '06:40 - 08:00',
      title: 'Morning Sparta',
      text: '官方资料列出晨间Sparta课程，方向可能包含语法、词汇、IELTS、TOEIC、TOEFL等。',
    },
    {
      time: '08:20 - 09:00',
      title: '早餐与课程准备',
      text: '校内用餐后按课表进入一对一、小组或考试专项课程。',
    },
    {
      time: '08:40 - 12:00',
      title: '上午正式课程',
      text: '一对一听说读写或商务/考试专项，具体课表以入学分班后为准。',
    },
    {
      time: '12:00 - 13:30',
      title: '午餐与短休',
      text: '长期学习时餐食稳定性和休息节奏很重要。',
    },
    {
      time: '13:00 - 18:05',
      title: '下午课程与选修',
      text: '按课程安排小组课、选修课、考试训练或自习任务。',
    },
    {
      time: '19:00 - 20:35',
      title: 'Evening Sparta / 模考',
      text: '考试课程和前4周规则更严格，报名时建议让顾问核对最新细则。',
    },
  ];

  readonly serviceSteps: ProcessStep[] = [
    {
      icon: 'person_search',
      title: '先判断SMEAG是否适合',
      text: '根据目标分、学习周数、预算、房型、管理强度和城市偏好做初筛。',
    },
    {
      icon: 'fact_check',
      title: '确认课程和房型',
      text: '免费协助核对ESL、考试、Business、Family课程与当前空房。',
    },
    {
      icon: 'payments',
      title: '算清前期和当地费用',
      text: '把注册费、课程费、住宿费、SSP、押金、水电、接机和延签分开列清。',
    },
    {
      icon: 'assignment_turned_in',
      title: '协助入境和文件',
      text: '按顾问指引准备护照、入学文件、eTravel、接机和到校清单。',
    },
    {
      icon: 'support_agent',
      title: '到校后继续跟进',
      text: '如需换老师、问课程、处理宿舍或费用沟通，可继续联系顾问协助。',
    },
    {
      icon: 'location_on',
      title: '宿务当地支持',
      text: '思达在宿务有工作人员驻点，可按情况提供当地支持和沟通协助。',
    },
  ];

  readonly sidaReasons: SidaReason[] = [
    {
      number: '01',
      title: '先判断校区是否匹配',
      text: 'SMEAG有不同校区，Capital更偏市区学习与考试路线，先看目标再定校。',
      image: 'assets/cia/sida-why-action-selection.jpg',
      alt: '思达启航顾问帮助学生选择适合的菲律宾语言学校',
    },
    {
      number: '02',
      title: '费用逐项拆开说明',
      text: '课程费、住宿费、注册费、到校费用和签证延长分开核对，避免只看总价。',
      image: 'assets/cia/sida-why-action-fees.jpg',
      alt: '思达启航顾问为学生核算菲律宾语言学校费用',
    },
    {
      number: '03',
      title: '课程规则提前确认',
      text: '雅思、多益、托福、Sparta和保证班规则会影响日程与学习压力。',
      image: 'assets/cia/sida-why-action-contract.jpg',
      alt: '思达启航正式合同与学校文件核验',
    },
    {
      number: '04',
      title: '出发前清单更完整',
      text: '付款节点、接机、入境文件、当地现金、教材和宿舍用品都会提前提醒。',
      image: 'assets/cia/sida-why-action-departure.jpg',
      alt: '菲律宾游学出发前文件和行李准备',
    },
    {
      number: '05',
      title: '学习中仍可继续沟通',
      text: '遇到课程节奏、老师、宿舍或费用问题，可让顾问帮你整理沟通重点。',
      image: 'assets/cia/sida-why-action-followup.jpg',
      alt: '思达启航顾问持续跟进学生学习情况',
    },
    {
      number: '06',
      title: '国内顾问 + 宿务驻点',
      text: '国内咨询和宿务当地支持配合，适合第一次去菲律宾游学的学生。',
      image: 'assets/cia/sida-why-action-team.jpg',
      alt: '思达启航宿务和深圳服务团队',
    },
  ];

  readonly sidaTrustBadges: SidaTrustBadge[] = [
    { icon: 'description', label: '正式报价逐项核验' },
    { icon: 'verified_user', label: '课程规则提前确认' },
    { icon: 'payments', label: '费用透明无隐藏项' },
    { icon: 'apartment', label: '深圳总部 + 宿务驻点' },
  ];

  readonly schoolServices = [
    '机场接机',
    '入学分级测试',
    '课程咨询',
    '每周/定期模考',
    '餐厅',
    '宿舍',
    '自习空间',
    '健身设施',
    '学生管理',
    '签证延长协助',
    '校内服务窗口',
    '周末/假日餐食',
  ];
  readonly campusActivities = [
    '新生说明会',
    '自习与模考',
    '咖啡区交流',
    '健身房运动',
    '商务演讲练习',
    '考试目标跟进',
  ];
  readonly weekendActivities = [
    '宿务市区生活',
    '商场与餐厅',
    '咖啡厅',
    '跳岛游',
    '短途旅行',
    '同学聚餐',
  ];
  readonly notes = [
    'SMEAG Capital更适合看重市区便利、考试课程和明确学习规则的学生。',
    'Sparta / Semi-Sparta、门禁、早晚课、模考和保证班规则需以学校当期说明为准。',
    '本页费用使用公开2026参考价：Alpha Edu列出的4周学费、宿舍费和当地费用；正式报名仍需顾问向学校确认。',
    '不同代理、币种、优惠和更新时间可能导致报价不同，最终以学校正式报价单、空房和付款节点为准。',
    '如果是亲子或低龄学生，必须提前确认年龄、监护、房型、接送和校规。',
  ];
  readonly faqs: FaqItem[] = [
    {
      question: 'SMEAG Capital和CIA最大差别是什么？',
      answer:
        'CIA更偏麦克坦度假型新校区和半斯巴达舒适校园，SMEAG Capital更偏宿务市区、考试路线和Sparta/Semi-Sparta学习管理。两者都适合认真学习，但选校重点不同。',
    },
    {
      question: '页面上的报价包含全部费用吗？',
      answer:
        '不包含全部。快速报价主要估算注册费、课程费和住宿费；到校后还要准备SSP、SSP-I Card、押金、水电、管理费、教材、接机和可能的签证延长费用。',
    },
    {
      question: 'SMEAG Capital适合雅思学生吗？',
      answer:
        '适合列入候选。公开资料列出IELTS、IELTS Guarantee、TOEIC、TOEFL等考试课程，但是否适合还要看当前分数、目标分、学习周数和能否接受规则。',
    },
    {
      question: 'SMEAG Capital适合亲子吗？',
      answer:
        '可以比较Family Program，但Capital不是纯度假型亲子校区。低龄、家庭房、监护和外出规则需要提前确认，也可以同时比较SMEAG Encanto、CIA、CPI等学校。',
    },
    {
      question: '为什么不同网站价格不一样？',
      answer:
        '学校费用会受年份、国籍市场、汇率、优惠、房型和代理更新时间影响。本页使用2026公开参考信息建立报价逻辑，正式价格以学校确认报价为准。',
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
    this.loadExchangeRates();
  }

  private loadExchangeRates(): void {
    this.exchangeRateService.getLatestCnyRates().pipe(catchError(() => EMPTY)).subscribe((snapshot) => {
      this.usdToCny = snapshot.usdToCny;
      this.phpPerCny = snapshot.phpPerCny;
      this.exchangeRateDate = snapshot.date;
      this.exchangeRateLive = true;
    });
  }

  private loadPricingFromDatabase(): void {
    this.schoolService
      .getSchools({ name: this.pricingSchoolSearchName })
      .pipe(
        switchMap((schools) => {
          const school =
            this.pricingSchoolNames
              .map((name) => schools.find((item) => item.name === name))
              .find(Boolean) ??
            schools.find((item) =>
              item.name.toLowerCase().includes('smeag'),
            ) ??
            schools[0];

          if (!school?.id) {
            return EMPTY;
          }

          return forkJoin({
            lessons: this.schoolService.getSchoolLessons({
              schoolId: school.id,
              week: 4,
            }),
            rooms: this.schoolService.getSchoolRooms({
              schoolId: school.id,
              week: 4,
            }),
            fees: this.schoolService.getSchoolFees({ schoolId: school.id }),
          });
        }),
        catchError(() => EMPTY),
      )
      .subscribe(({ lessons, rooms, fees }) =>
        this.applyPricingData(lessons, rooms, fees),
      );
  }

  private applyPricingData(
    lessons: SchoolLessonDTO[],
    rooms: SchoolRoomDTO[],
    fees: SchoolFeeDTO[],
  ): void {
    const databaseCourseFees = lessons
      .filter((lesson) => lesson.week === 4)
      .map((lesson) => ({
        id: this.createCourseId(lesson.name),
        name: lesson.name,
        tuition: lesson.price,
        suitable: lesson.name === '儿童课程'
          ? '4节一对一 + 4节团体课 + 2.5小时活动课（比如故事、游泳、跳舞、烹饪、艺术绘画等）；2至12岁（2至4岁Busybee，5至12岁Family Program）'
          : (lesson.description || lesson.note || '请联系顾问确认适合人群')
              .replace(/[；;]\s*成人课程通常10岁起/g, '')
              .trim(),
      }))
      .filter((lesson) => this.courseFeeOrder.includes(lesson.id))
      .sort(
        (a, b) =>
          this.orderIndex(this.courseFeeOrder, a.id) -
          this.orderIndex(this.courseFeeOrder, b.id),
      );

    if (databaseCourseFees.length === this.courseFeeOrder.length) {
      this.courseFees = databaseCourseFees;
      if (
        !this.courseFees.some((course) => course.id === this.selectedCourseId)
      ) {
        this.selectedCourseId = this.courseFees[0].id;
      }
    }

    const databaseRoomFees = rooms
      .filter((room) => room.week === 4)
      .map((room) => ({
        id: this.createRoomId(room.name),
        name: room.name,
        fee: room.price,
        note: this.createRoomId(room.name).startsWith('hotel-')
          ? '学校合作的校外酒店；校外住宿无折扣'
          : room.description || '请联系顾问确认空房',
      }))
      .sort(
        (a, b) =>
          this.orderIndex(this.roomFeeOrder, a.id) -
          this.orderIndex(this.roomFeeOrder, b.id),
      );

    if (databaseRoomFees.length === this.roomFeeOrder.length) {
      this.roomFees = databaseRoomFees;
      if (!this.roomFees.some((room) => room.id === this.selectedRoomId)) {
        this.selectedRoomId =
          this.roomFees.find((room) => room.id === 'campus-quad')?.id ??
          this.roomFees[0].id;
      }
    }

    const registrationFee = fees.find((fee) => fee.name === '注册费');
    if (registrationFee) {
      this.registrationFee = registrationFee.fee;
    }

    const lowSeasonDiscount = fees.find((fee) => fee.name === '淡季优惠');
    if (lowSeasonDiscount && lowSeasonDiscount.fee > 0) {
      this.lowSeasonDiscountPerWeek = lowSeasonDiscount.fee;
    }
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

  get filteredGalleryImages(): GalleryImage[] {
    return this.selectedGalleryCategory === '全部'
      ? this.galleryImages
      : this.galleryImages.filter(
          (image) => image.category === this.selectedGalleryCategory,
        );
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
      this.roomFees[0]
    );
  }

  get tuitionForSelectedWeeks(): number {
    return this.selectedCourse.tuition * this.durationPriceMultiplier(this.selectedWeeks);
  }

  get roomFeeForSelectedWeeks(): number {
    return this.selectedRoom.fee * this.durationPriceMultiplier(this.selectedWeeks);
  }

  get usesHotelRoom(): boolean {
    return this.selectedRoomId.startsWith('hotel-');
  }

  get tuitionDiscountAmount(): number {
    return this.tuitionForSelectedWeeks * (1 - this.discount);
  }

  get roomDiscountAmount(): number {
    return this.usesHotelRoom ? 0 : this.roomFeeForSelectedWeeks * (1 - this.discount);
  }

  get sidaDiscountAmount(): number {
    return this.tuitionDiscountAmount + this.roomDiscountAmount;
  }

  get lowSeasonWeeks(): number {
    return this.countOverlappingStudyWeeks('2026-08-23', '2027-01-01');
  }

  get lowSeasonDiscount(): number {
    return this.lowSeasonWeeks * this.lowSeasonDiscountPerWeek;
  }

  get quoteUsd(): number {
    return Math.max(0, this.registrationFee + this.tuitionForSelectedWeeks + this.roomFeeForSelectedWeeks - this.sidaDiscountAmount - this.lowSeasonDiscount);
  }

  get quoteUsdText(): string {
    return `USD ${this.formatUsd(this.quoteUsd)} 起`;
  }

  get quoteCnyText(): string {
    const rounded = Math.round(this.quoteUsd * this.usdToCny);

    return `约 ${rounded.toLocaleString('zh-CN')} 元起`;
  }

  get discountText(): string {
    return this.usesHotelRoom ? '课程费9折，校外住宿无折扣' : '课程费和校内住宿费9折';
  }

  get exchangeRateText(): string {
    return this.exchangeRateLive && this.exchangeRateDate ? `参考汇率日期 ${this.exchangeRateDate}` : '暂按备用汇率估算';
  }

  get localFeePeriods(): number {
    return Math.max(1, Math.ceil(this.selectedWeeks / 4));
  }

  get visaFeeTotal(): number {
    if (this.selectedWeeks <= 4) return 0;
    if (this.selectedWeeks <= 8) return 5130;
    if (this.selectedWeeks <= 12) return 11530;
    if (this.selectedWeeks <= 16) return 15960;
    if (this.selectedWeeks <= 20) return 20390;
    return 24820;
  }

  get visaExtensionCount(): number {
    return Math.max(0, Math.ceil((this.selectedWeeks - 4) / 4));
  }

  get textbookFee(): number {
    const courseName = this.selectedCourse.name.toLowerCase();
    if (courseName.includes('儿童课程')) return 2500;
    if (courseName.includes('toefl') || courseName.includes('ielts')) return 2500;
    if (courseName.includes('toeic')) return 1300;
    if (courseName.includes('business') || courseName.includes('商务')) return 400;
    if (courseName.includes('speaking master')) return 1500;
    return 700;
  }

  get textbookFeeNote(): string {
    const courseName = this.selectedCourse.name.toLowerCase();
    if (courseName.includes('toefl') || courseName.includes('ielts')) {
      return 'TOEFL教材约PHP 1,500，IELTS教材约PHP 2,500；当前合并课程选项暂按IELTS上限列示';
    }
    return '教材费按课程参考：Family Program PHP 2,500、TOEIC PHP 1,300、Business English PHP 400、ESL PHP 700、Speaking Master PHP 1,500';
  }

  get localFees(): LocalFee[] {
    const periods = this.localFeePeriods;
    const acrQuantity = this.selectedWeeks > 8 ? 1 : 0;
    return [
      { item: '旅游签证续签', amount: '按学习周数累计', quantity: this.visaExtensionCount, total: this.visaFeeTotal, note: '数量为预计续签次数；4周无续签费，8/12/16/20/24周累计分别为PHP 5,130/11,530/15,960/20,390/24,820' },
      { item: 'SSP特殊学习许可证', amount: 'PHP 7,800 / 次', quantity: 1, total: 7800, note: '特殊学习许可；续期时可能需要重新缴纳SSP' },
      { item: 'SSP I-CARD', amount: 'PHP 4,500 / 次', quantity: 1, total: 4500, note: '入学时与SSP一并办理' },
      { item: 'VISA I-CARD', amount: 'PHP 4,500 / 次', quantity: acrQuantity, total: 4500 * acrQuantity, note: '在菲停留60天及以上需要办理' },
      { item: '设施使用费（Utilities）', amount: 'PHP 3,000 / 4周', quantity: periods, total: 3000 * periods, note: '按每4周计算' },
      { item: '电费及水费', amount: 'PHP 2,400 / 4周', quantity: periods, total: 2400 * periods, note: '按每4周计算，超额使用另行收费' },
      { item: '宿务马克坦机场接机（可选）', amount: 'PHP 1,200 / 次', quantity: 0, total: 0, note: '可自由选择，也可自行打车；不计入学杂费合计', excluded: true },
      { item: '押金（可退）', amount: 'PHP 2,000 / 次', quantity: 1, total: 2000, note: '含房间押金PHP 1,500、钥匙PHP 300、电子钱包卡PHP 200；无欠费及损坏时按学校规定退还', excluded: true },
      { item: '2×2英寸照片', amount: '自备', quantity: this.selectedWeeks >= 24 ? 4 : 1, total: 0, note: this.selectedWeeks >= 24 ? '24周学生为ECC准备4张（5.08cm × 5.08cm）' : '入学时准备1张（5.08cm × 5.08cm）' },
      { item: '护照照片', amount: '自备', quantity: 1, total: 0, note: '用于学生档案' },
      { item: '教材费', amount: `PHP ${this.textbookFee.toLocaleString('en-US')} / 套`, quantity: 1, total: this.textbookFee, note: this.textbookFeeNote, excluded: true },
    ];
  }

  get includedLocalFees(): LocalFee[] { return this.localFees.filter((fee) => !fee.excluded); }
  get excludedLocalFees(): LocalFee[] { return this.localFees.filter((fee) => fee.excluded); }

  get localFeesTotal(): number {
    return this.localFees.filter((fee) => !fee.excluded).reduce((sum, fee) => sum + fee.total, 0);
  }

  get localFeesCnyText(): string {
    return `约 ${Math.round(this.localFeesTotal / this.phpPerCny).toLocaleString('zh-CN')} 元`;
  }

  get quoteImageData() {
    const includedFees = this.localFees.filter((fee) => !fee.excluded || fee.item === '教材费');
    const optionalFees = [
      this.localFees.find((fee) => fee.item.includes('机场接机')),
      this.localFees.find((fee) => fee.item.includes('押金')),
    ].filter((fee): fee is LocalFee => Boolean(fee));
    const paymentItems = [
      { icon: '注', label: '注册费', amount: `${this.formatUsd(this.registrationFee)} 美元`, note: '一次性学校注册费，不参与折扣' },
      { icon: '课', label: '课程费', amount: `${this.formatUsd(this.tuitionForSelectedWeeks)} 美元`, note: `${this.selectedCourse.name}；${this.selectedCourse.suitable}` },
      { icon: '宿', label: '住宿费', amount: `${this.formatUsd(this.roomFeeForSelectedWeeks)} 美元`, note: this.selectedRoom.name },
      { icon: '折', label: '思达折扣', amount: '9折', note: `优惠金额：${this.formatUsd(this.sidaDiscountAmount)}美元`, accent: true },
      ...(this.lowSeasonDiscount > 0
        ? [{
            icon: '淡',
            label: '淡季优惠',
            amount: `- ${this.formatUsd(this.lowSeasonDiscount)} 美元`,
            note: `适用期：2026/08/23–2027/01/01；USD 25/周 × 重叠${this.lowSeasonWeeks}周`,
            accent: true,
          }]
        : []),
    ];

    return buildPhilippinesDetailedQuote({
      schoolCode: 'SMEAG',
      schoolName: '菲律宾宿务SMEAG Capital语言学校',
      filePrefix: 'SMEAG-Capital',
      heroSrc: '/assets/philippines/smeag-capital-building.png',
      weeks: this.selectedWeeks,
      startDate: this.selectedStartDate,
      usdToCny: this.usdToCny,
      totalUsd: this.quoteUsd,
      paymentItems,
      localFeeItems: includedFees.map((fee) => ({ label: fee.item, unit: fee.amount, quantity: String(fee.quantity), amount: this.formatPhp(fee.total), note: fee.note })),
      localFeeTotal: this.localFeesTotal,
      localFeeCny: Math.round(this.localFeesTotal / this.phpPerCny),
      localFeeNote: '接机费和可退押金单独列示，不计入学杂费合计；教材费按所选课程另行准备。24周需为ECC准备4张2×2照片；费用可因移民政策调整。',
      optionalFeeItems: optionalFees.slice(0, 2).map((fee) => ({ label: fee.item, amount: fee.amount, note: fee.note })),
      ruleNotes: [
        '校内住宿按课程费＋住宿费9折；选择校外酒店时只折课程费，校外住宿无折扣。',
        '2026/08/23—2027/01/01在校期间，每个重叠学习周再减25美元。',
      ],
    });
  }

  formatUsd(value: number): string {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: Number.isInteger(value) ? 0 : 1,
      maximumFractionDigits: 1,
    });
  }

  formatPhp(value: number): string {
    return `PHP ${value.toLocaleString('en-US')}`;
  }

  formatFeeQuantity(value: number): string {
    return value.toLocaleString('zh-CN', { maximumFractionDigits: 2 });
  }

  private durationPriceMultiplier(weeks: number): number {
    if (weeks === 1) return 0.45;
    if (weeks === 2) return 0.65;
    if (weeks === 3) return 0.85;
    return weeks / 4;
  }

  private countOverlappingStudyWeeks(rangeStartValue: string, rangeEndValue: string): number {
    const studyStart = this.parseLocalDate(this.selectedStartDate);
    const rangeStart = this.parseLocalDate(rangeStartValue);
    const rangeEnd = this.parseLocalDate(rangeEndValue);
    if (!studyStart || !rangeStart || !rangeEnd) return 0;
    let count = 0;
    for (let week = 0; week < this.selectedWeeks; week += 1) {
      const weekStart = new Date(studyStart);
      weekStart.setDate(studyStart.getDate() + week * 7);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      if (weekStart <= rangeEnd && weekEnd >= rangeStart) count += 1;
    }
    return count;
  }

  private parseLocalDate(value: string): Date | null {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    return match ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3])) : null;
  }

  private createCourseId(name: string): string {
    const normalized = name.toLowerCase();
    if (name.includes('常规') && /ket|pet|fce/i.test(name)) return 'esl-regular-ket-pet-fce';
    if (normalized.includes('speaking master') && normalized.includes('cae')) return 'speaking-master-cae';
    if (normalized.includes('speaking master')) return 'speaking-master-ket-pet-fce';
    if (normalized.includes('esl') && normalized.includes('cae')) return 'esl-cae';
    if (normalized.includes('junior 2')) return 'esl-junior-2';
    if (name.includes('TOEFL') && name.includes('IELTS') && name.includes('预备')) return 'toefl-ielts-pre';
    if (name.includes('TOEFL') && name.includes('IELTS')) return 'toefl-ielts-regular-guarantee';
    if (normalized.includes('toeic') && name.includes('预备')) return 'toeic-pre';
    if (normalized.includes('toeic')) return 'toeic-regular-guarantee';
    if (normalized.includes('business')) return 'business';
    if (normalized.includes('esl junior')) return 'esl-junior';
    if (name.includes('儿童')) return 'children';
    if (name.includes('监护人')) return 'guardian';
    return this.slugifyPriceKey(name);
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
    const prefix = name.includes('酒店') ? 'hotel' : 'campus';
    if (name.includes('五人')) return `${prefix}-five`;
    if (name.includes('四人')) return `${prefix}-quad`;
    if (name.includes('三人')) return `${prefix}-triple`;
    if (name.includes('双人') || name.includes('二人')) return `${prefix}-twin`;
    if (name.includes('单人')) return `${prefix}-single`;

    return this.slugifyPriceKey(name);
  }
}

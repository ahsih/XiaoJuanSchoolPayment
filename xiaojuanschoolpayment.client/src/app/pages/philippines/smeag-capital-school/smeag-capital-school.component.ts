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
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './smeag-capital-school.component.html',
  styleUrls: [
    '../cebu-school-detail-layout.css',
    '../cebu-school-detail-content.css',
    '../cebu-school-detail-responsive.css',
    '../ev-school/ev-school-detail.component.css',
  ],
})
export class SmeagCapitalSchoolComponent implements OnInit {
  private readonly schoolService = inject(SchoolService);
  private readonly pricingSchoolSearchName = 'SMEAG';
  private readonly pricingSchoolNames = [
    '菲律宾宿务SMEAG Capital语言学校',
    'SMEAG Capital Campus',
    'SMEAG Capital',
    'SMEAG Global Education',
  ];
  private readonly courseFeeOrder = [
    'esl',
    'speaking-master',
    'business',
    'pre-ielts',
    'ielts',
    'ielts-guarantee',
    'pre-toeic',
    'toeic',
    'pre-toefl',
    'toefl',
    'family-program-child',
    'family-program-parents',
  ];
  private readonly roomFeeOrder = ['quad', 'triple', 'twin', 'single'];

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
  readonly discount = 1;
  seasonalFeePerWeek = 0;
  readonly usdToCny = 7.2;
  readonly weekOptions = [1, 2, 3, 4, 8, 12];

  selectedCourseId = 'esl';
  selectedRoomId = 'quad';
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
      value: '2026公开参考：ESL学费USD 820/4周，四人房USD 760/4周，注册费USD 100',
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
      text: 'SSP、SSP E-card、押金、水电、管理费、接机和签证延长都要另算。',
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
    {
      id: 'esl',
      name: 'ESL',
      tuition: 820,
      suitable: '基础综合英语，适合第一次游学和稳步提升',
    },
    {
      id: 'speaking-master',
      name: 'Speaking Master',
      tuition: 1100,
      suitable: '口语表达与反应训练，适合想增加开口量的学生',
    },
    {
      id: 'business',
      name: 'Business',
      tuition: 1540,
      suitable: '商务沟通、演讲、会议和职场任务',
    },
    {
      id: 'pre-ielts',
      name: 'Pre-IELTS',
      tuition: 1100,
      suitable: '雅思入门与基础过渡',
    },
    {
      id: 'ielts',
      name: 'IELTS',
      tuition: 1220,
      suitable: '雅思常规备考与分数提升',
    },
    {
      id: 'ielts-guarantee',
      name: 'IELTS Guarantee',
      tuition: 1220,
      suitable: '雅思目标分路径，需确认入学分数和保证班规则',
    },
    {
      id: 'pre-toeic',
      name: 'Pre-TOEIC',
      tuition: 960,
      suitable: '多益入门，适合先补词汇和题型基础',
    },
    {
      id: 'toeic',
      name: 'TOEIC',
      tuition: 1040,
      suitable: '多益常规备考，适合求职和分数证明',
    },
    {
      id: 'pre-toefl',
      name: 'Pre-TOEFL',
      tuition: 1040,
      suitable: '托福入门与学术英语基础',
    },
    {
      id: 'toefl',
      name: 'TOEFL',
      tuition: 1160,
      suitable: '托福备考，适合北美升学和学术英语目标',
    },
    {
      id: 'family-program-child',
      name: 'Family Program (Child)',
      tuition: 1400,
      suitable: '亲子学生课程，需按年龄和档期确认',
    },
    {
      id: 'family-program-parents',
      name: 'Family Program (Parents)',
      tuition: 780,
      suitable: '陪读家长课程，适合生活英语和基础沟通',
    },
  ];

  roomFees: RoomFee[] = [
    {
      id: 'quad',
      name: '四人房',
      fee: 760,
      note: '默认报价参考，预算压力较低',
    },
    {
      id: 'triple',
      name: '三人房',
      fee: 840,
      note: '预算与生活空间比较平衡',
    },
    {
      id: 'twin',
      name: '双人房',
      fee: 960,
      note: '适合朋友同行或希望室友数量少一点',
    },
    {
      id: 'single',
      name: '单人房',
      fee: 1140,
      note: '隐私最好，长期备考和热门档期需早确认',
    },
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

  localFees: LocalFee[] = [
    { item: 'SSP', amount: 'PHP 6,800', note: '特别学习许可，通常到校支付' },
    { item: 'SSP E-Card', amount: 'PHP 3,800', note: '以学校现场收费为准' },
    { item: 'ACR I-Card', amount: 'PHP 3,500', note: '长期学习或延签时通常需要' },
    { item: '教材费', amount: '按课程实际收取', note: '不同课程、等级和教材数量会变化' },
    { item: '宿舍押金', amount: 'PHP 3,000', note: '退房检查后按学校规则退还' },
    { item: '电费', amount: 'PHP 2,400', note: '4周参考，实际以学校规则为准' },
    { item: '水费', amount: 'PHP 2,000', note: '4周参考，实际以学校规则为准' },
    { item: '管理费', amount: 'PHP 2,000', note: '4周参考' },
    { item: '签证延长', amount: '按学习周数', note: '停留超过免签期后需按规定办理' },
    { item: '接机费', amount: 'PHP 1,200', note: '宿务机场接机参考' },
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
        '不包含全部。快速报价主要估算注册费、课程费和住宿费；到校后还要准备SSP、SSP E-card、押金、水电、管理费、教材、接机和可能的签证延长费用。',
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
        id: this.slugifyPriceKey(lesson.name),
        name: lesson.name,
        tuition: lesson.price,
        suitable: lesson.description || lesson.note || '请联系顾问确认适合人群',
      }))
      .sort(
        (a, b) =>
          this.orderIndex(this.courseFeeOrder, a.id) -
          this.orderIndex(this.courseFeeOrder, b.id),
      );

    if (databaseCourseFees.length > 0) {
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
        note: room.description || '请联系顾问确认空房',
      }))
      .sort(
        (a, b) =>
          this.orderIndex(this.roomFeeOrder, a.id) -
          this.orderIndex(this.roomFeeOrder, b.id),
      );

    if (databaseRoomFees.length > 0) {
      this.roomFees = databaseRoomFees;
      if (!this.roomFees.some((room) => room.id === this.selectedRoomId)) {
        this.selectedRoomId =
          this.roomFees.find((room) => room.id === 'quad')?.id ??
          this.roomFees[0].id;
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
    return this.selectedCourse.tuition * (this.selectedWeeks / 4);
  }

  get roomFeeForSelectedWeeks(): number {
    return this.selectedRoom.fee * (this.selectedWeeks / 4);
  }

  get isPeakSeason(): boolean {
    return false;
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
    return this.discount === 1
      ? '公开参考价，优惠需顾问确认'
      : `${Math.round(this.discount * 100)} 折扣范围`;
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
    if (name.includes('四人') || /\b4\b/.test(name)) {
      return 'quad';
    }
    if (name.includes('三人') || /\b3\b/.test(name)) {
      return 'triple';
    }
    if (name.includes('双人') || name.includes('二人') || /\b2\b/.test(name)) {
      return 'twin';
    }
    if (name.includes('单人') || /\b1\b/.test(name)) {
      return 'single';
    }

    return this.slugifyPriceKey(name);
  }

  private currencyCodeForDisplay(code?: string): string {
    return !code
      ? 'USD'
      : code.toUpperCase() === 'PESO'
        ? 'PHP'
        : code.toUpperCase();
  }

  private formatCurrencyAmount(fee: SchoolFeeDTO): string {
    return `${this.currencyCodeForDisplay(fee.currencyCode)} ${fee.fee.toLocaleString('en-US', {
      minimumFractionDigits: Number.isInteger(fee.fee) ? 0 : 1,
      maximumFractionDigits: 1,
    })}`;
  }

  private cleanFeeDescription(description?: string): string {
    return description
      ? description.replace(/^到校支付费用；/, '').replace(/^前期支付费用；/, '')
      : '以学校现场收费为准';
  }
}

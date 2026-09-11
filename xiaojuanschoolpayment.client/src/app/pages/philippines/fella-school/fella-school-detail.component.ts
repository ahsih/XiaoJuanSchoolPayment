import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, inject } from '@angular/core';
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
import { SCHOOL_VISA_OPTIONS, groupLocalFees, groupPaymentLines } from '../../../components/school-group-quote';
import { applySchoolQuoteImageLayout } from '../../../components/school-quote-plan';
import { SchoolQuotePlanComponent } from '../../../components/school-quote-plan.component';
import {
  FELLA_CAMPUS_OPTIONS,
  FELLA_COURSE_FEES,
  FELLA_ROOM_FEES,
  FellaCampus,
  FellaCourseFee,
  FellaRoomFee,
} from './fella-pricing';
import { FellaStudentQuote } from './fella-student-quote';

type GalleryCategory = '全部' | '校园' | '教室' | '住宿' | '餐厅' | '设施';

interface QuickInfo { icon: string; label: string; value: string; note: string; }
interface GalleryImage { category: Exclude<GalleryCategory, '全部'>; title: string; description: string; src: string; }
interface BasicInfoRow { label: string; value: string; }
interface Highlight { image: string; title: string; text: string; }
interface FitItem { title: string; text: string; }
interface CourseItem { name: string; type: string; lessons: string; suitable: string; }
interface ScheduleItem { time: string; title: string; text: string; }
interface ProcessStep { icon: string; title: string; text: string; }
interface FaqItem { question: string; answer: string; }
interface SideNavItem { label: string; target: string; icon: string; }
interface SidaFellaReason {
  number: string;
  title: string;
  text: string;
  image: string;
  alt: string;
}
interface SidaFellaTrustBadge { icon: string; label: string; }
interface CampusPriceGroup<T> { campus: FellaCampus; eyebrow: string; title: string; description: string; items: T[]; }

@Component({
  selector: 'app-fella-school-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule, QuoteImageDownloadButtonComponent, SchoolQuotePlanComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './fella-school-detail.component.html',
  styleUrls: [
    '../cebu-school-detail-layout.css',
    '../cebu-school-detail-content.css',
    '../cebu-school-detail-responsive.css',
    '../ev-school/ev-school-detail.component.css',
    '../school-quote-rollout.css',
    '../../../components/school-group-quote.css',
    './fella-school-detail.component.css',
  ],
})
export class FellaSchoolDetailComponent implements OnInit {
  private readonly schoolService = inject(SchoolService);
  private readonly exchangeRateService = inject(ExchangeRateService);
  private readonly pricingSchoolSearchName = 'English Fella';
  private readonly pricingSchoolNames = ['菲律宾宿务English Fella语言学校', 'English Fella'];
  private readonly courseFeeOrder = ['pic-4', 'pic-5', 'pic-6', 'toeic-esl', 'toeic-practice', 'toeic-guarantee', 'pift-e', 'pift', 'pirc', 'pigi', 'ppt', 'ptft', 'ssc', 'p-jec', 'jec', 'gec', 'ebc'];
  private readonly roomFeeOrder = ['premium-1p', 'single-1a', 'single-1b', 'twin-2a', 'triple-3a'];

  readonly galleryCategories: GalleryCategory[] = ['全部', '校园', '教室', '住宿', '餐厅', '设施'];
  selectedGalleryCategory: GalleryCategory = '全部';
  registrationFee = 100;
  usdToCny = 7.2;
  phpPerCny = 8;
  exchangeRateDate = '';
  usingLiveExchangeRate = false;
  quoteCalculated = false;
  readonly campusOptions = FELLA_CAMPUS_OPTIONS;
  readonly visaOptions = SCHOOL_VISA_OPTIONS;

  readonly quickInfo: QuickInfo[] = [
    { icon: 'park', label: '学校类型', value: '宿务老牌大校园', note: '2006年创立，官方称建有专属校园' },
    { icon: 'groups', label: '适合人群', value: '成人 / 考试 / 亲子 / 长期', note: '从5岁儿童到成人和银发课程都有方向' },
    { icon: 'verified_user', label: '管理模式', value: '斯巴达 / 半斯巴达 / 自律', note: '第一校区斯巴达；第二校区自律型／半斯巴达' },
    { icon: 'school', label: '课程选项', value: 'PIC / IELTS / TOEIC / TOEFL', note: '另有EBC商务、JEC儿童、GEC家长和SSC乐龄课程' },
    { icon: 'bed', label: '住宿房型', value: '3A三人 / 2A双人 / 三种单人房', note: '1B、1A和Premium 1P单人间需核空房' },
    { icon: 'local_activity', label: '校园资源', value: '泳池 / 运动 / CAFELLA', note: '官方设施页展示校园、餐厅、运动和休闲空间' },
  ];

  readonly galleryImages: GalleryImage[] = [
    { category: '校园', title: 'English Fella校园', description: '大校园和绿化空间，是Fella区别于市区型学校的重要特点。', src: 'assets/fella/campus-main.webp' },
    { category: '校园', title: '校园泳池区域', description: '官方设施页展示泳池和户外活动空间。', src: 'assets/fella/campus-pool.webp' },
    { category: '校园', title: '校区环境', description: '适合希望学习、住宿、运动和休息集中在校园内的学生。', src: 'assets/fella/campus-view.webp' },
    { category: '教室', title: '一对一教室', description: 'PIC、考试、商务和口语课程都会使用一对一训练。', src: 'assets/fella/classroom-1.webp' },
    { category: '教室', title: '团体教室', description: '小团体、大团体和选修课程用于讨论、表达和综合训练。', src: 'assets/fella/classroom-2.webp' },
    { category: '住宿', title: '宿舍房间', description: '房间通常配有床、桌椅、收纳和空调，具体以校区房型为准。', src: 'assets/fella/dorm-1.webp' },
    { category: '住宿', title: '住宿空间参考', description: '3A三人间、2A双人间和三种单人间会明显影响总预算。', src: 'assets/fella/dorm-2.webp' },
    { category: '餐厅', title: '学生餐厅', description: '校内餐厅适合希望学习生活集中管理的学生。', src: 'assets/fella/cafeteria-2.webp' },
    { category: '设施', title: '运动设施', description: '官方设施页展示运动空间，适合课后活动和校园交流。', src: 'assets/fella/sports-1.webp' },
    { category: '设施', title: '篮球与运动区', description: '课后运动和月度校园活动会用到这些公共空间。', src: 'assets/fella/sports-2.webp' },
    { category: '设施', title: '校内公共设施', description: 'CAFELLA、办公室、休闲和其他校内支持资源需按校区确认。', src: 'assets/fella/facility-1.webp' },
  ];

  readonly basicInfo: BasicInfoRow[] = [
    { label: '学校名称', value: '菲律宾宿务English Fella语言学校' },
    { label: '所在地区', value: 'Talamban, Cebu City；第一校区与第二校区' },
    { label: '创立时间', value: '2006年，官方资料称为菲律宾第一批建有专属校园的学校之一' },
    { label: '学校定位', value: '大校园、课程选择多、校区管理模式可选的老牌学校' },
    { label: '课程资源', value: 'PIC、PIFT/PIRC/PIGI、TOEIC、PPT/PTFT、EBC、JEC、GEC、SSC' },
    { label: '年龄要求', value: 'P-JEC为5–6岁；JEC为7–15岁；18岁以下单独到校按每周25美元计费' },
    { label: '管理模式', value: '第一校区为斯巴达；第二校区为自律型／半斯巴达' },
    { label: '设施资源', value: '校园、宿舍、教室、餐厅、办公室、运动设施、其他公共空间' },
  ];

  readonly highlights: Highlight[] = [
    { image: 'assets/fella/campus-main.webp', title: '大校园与生活支持感', text: 'Fella适合希望学校空间更完整、学习和生活都在校内解决的学生。' },
    { image: 'assets/fella/classroom-1.webp', title: '课程方向很完整', text: '从PIC综合英语到PIFT/PIRC/PIGI、TOEIC、PPT/PTFT、EBC、JEC和GEC都可比较。' },
    { image: 'assets/fella/dorm-1.webp', title: '五种房型覆盖两个校区', text: '3A三人间住宿预算最低，Premium 1P、1A、1B’、2A和3A在两个校区均可选，需提前确认空房。' },
    { image: 'assets/fella/sports-1.webp', title: '活动和运动资源多', text: '官方资料列出体育竞赛、Fun Friday、Fella Day、跳岛和城市游等活动。' },
  ];

  readonly suitableFor: FitItem[] = [
    { title: '想在宿务找老牌大校园学校', text: 'Fella比很多市区型学校更有校园空间和生活支持感。' },
    { title: '想按管理强度选择校区', text: '如果你想比较斯巴达、半斯巴达或自律型管理，Fella很适合先让顾问核校区。' },
    { title: 'ESL、考试、商务、亲子都想比较', text: '课程覆盖面广，适合目标还在细分阶段的学生。' },
    { title: '亲子、青少年或长期学习', text: 'P-JEC、JEC和GEC方向可考虑，但年龄、监护费、校区和房型必须提前确认。' },
  ];

  readonly notSuitableFor: FitItem[] = [
    { title: '只想住最新型豪华校区', text: 'Fella是成熟老牌校园，住宿质感需和CIA、CPI、EV等新型校区比较。' },
    { title: '不想被校规约束', text: '斯巴达校区和考试课程会有更明确的自习、测试、外出和出勤要求。' },
    { title: '只看低价，不准备当地费用', text: 'Fella到校后仍有SSP、SSP E-CARD、ACR I-CARD、管理费、签证续签、教材和押金等费用。' },
    { title: '不想提前确认校区和房型', text: 'Fella的关键就是校区、管理模式和房型，临近入学更容易被空房限制。' },
  ];

  readonly courses: CourseItem[] = [
    { name: 'PIC-4 / PIC-5 / PIC-6', type: '综合英语', lessons: '4-6节一对一 + 团体课 + 选修课', suitable: '适合口语、听力、阅读、文法和综合英语基础提升。' },
    { name: 'PIFT-E / PIFT / PIRC / PIGI', type: '雅思备考', lessons: '听说读写 + 文法词汇 + 模考与自习', suitable: '适合英联邦升学、移民或明确雅思分数目标学生。' },
    { name: 'TOEIC ESL / 实战 / 保证', type: '托业备考', lessons: 'TOEIC专项 + ESL基础 + 模考', suitable: '适合求职、毕业门槛或企业英语目标。' },
    { name: 'PPT / PTFT', type: '托福备考', lessons: 'TOEFL听说读写 + ESL团体课', suitable: '适合北美升学、交换项目或考试目标学生。' },
    { name: 'EBC', type: '商务英语', lessons: '商务一对一5节 + 四人团体2节 + 选修课', suitable: '适合职场人士和准备英文工作场景的人。' },
    { name: 'P-JEC / JEC / GEC', type: '亲子与青少年', lessons: '儿童一对一、团体课和家长课程', suitable: '适合亲子同行，年龄、监护和房型需提前确认。' },
    { name: 'SSC', type: '乐龄会话', lessons: '一对一6节 + 选修课', suitable: '适合银发成人提升口语信心和交流能力。' },
  ];

  courseFees: FellaCourseFee[] = FELLA_COURSE_FEES.map((course) => ({ ...course }));
  roomFees: FellaRoomFee[] = FELLA_ROOM_FEES.map((room) => ({ ...room }));

  get courseFeeGroups(): CampusPriceGroup<FellaCourseFee>[] {
    return this.campusOptions.map((campus) => ({
      campus: campus.value,
      eyebrow: campus.value === 'campus1' ? 'FELLA FIRST CAMPUS' : 'FELLA SECOND CAMPUS',
      title: campus.label,
      description: `管理模式：${campus.management}`,
      items: this.courseFees.filter((course) => course.campuses.includes(campus.value)),
    }));
  }

  get roomFeeGroups(): CampusPriceGroup<FellaRoomFee>[] {
    return this.campusOptions.map((campus) => ({
      campus: campus.value,
      eyebrow: campus.value === 'campus1' ? 'FELLA FIRST CAMPUS' : 'FELLA SECOND CAMPUS',
      title: `${campus.label}住宿`,
      description: '五种房型均适用本校区，实际空房需确认',
      items: this.roomFees.filter((room) => room.campuses.includes(campus.value)),
    }));
  }

  readonly students: FellaStudentQuote[] = [new FellaStudentQuote(this)];
  quoteMode: 'single' | 'group' = 'single';
  private requestedStudentCount = 2;

  readonly schedule: ScheduleItem[] = [
    { time: '07:00 - 08:00', title: '早餐与晨间准备', text: '校内餐厅用餐后准备课程，斯巴达校区可能有更明确早晚安排。' },
    { time: '08:00 - 12:00', title: '上午课程', text: '一对一、团体课、考试专项或商务课程，按课程类型安排。' },
    { time: '12:00 - 13:00', title: '午餐与休息', text: '校内餐厅用餐，下午课程前整理笔记。' },
    { time: '13:00 - 17:00', title: '下午课程', text: '继续口语、文法、听力、阅读、写作、考试或商务主题训练。' },
    { time: '17:00 - 19:00', title: '晚餐与自由时间', text: '可使用校园设施，外出和门禁以校区规则为准。' },
    { time: '19:00 - 21:00', title: '自习 / 测试 / 校内活动', text: '斯巴达、J-Sparta和考试课程的晚间规则需按项目确认。' },
  ];

  readonly serviceSteps: ProcessStep[] = [
    { icon: 'person_search', title: '判断Fella是否适合', text: '先了解学习目标、年龄、同行人、校区偏好、管理强度和住宿预算。' },
    { icon: 'fact_check', title: '确认课程、校区和房型', text: '免费协助确认课程、校区、房型、空房、优惠和正式报价。' },
    { icon: 'assignment_turned_in', title: '协助入境和签证手续', text: '思达免费协助办理菲律宾入境及签证相关手续，学生只需按顾问指引准备个人资料。' },
    { icon: 'inventory', title: '发送学习资料和行前清单', text: '入学前免费发送学习资料、行李清单、费用清单和到校注意事项。' },
    { icon: 'support_agent', title: '到校后继续跟进', text: '遇到换老师、调课、学习方法、宿舍生活或学校沟通问题，也可以继续联系思达协助。' },
    { icon: 'location_on', title: '宿务当地支持', text: '思达在宿务有工作人员驻点，可提供当地支持，直到学生完成学习并顺利回国。' },
  ];

  readonly sidaFellaReasons: SidaFellaReason[] = [
    {
      number: '01',
      title: '正式合同与学校文件可核验',
      text: '国内公司签约，English Fella报价、录取文件及收费凭证均可逐项核对。',
      image: 'assets/cia/sida-why-action-contract.webp',
      alt: '思达启航正式合同与学校文件核验',
    },
    {
      number: '02',
      title: '校区、课程和费用提前算清',
      text: '0中介服务费，课程费、住宿费、校区规则及English Fella到校费用逐项说明。',
      image: 'assets/cia/sida-why-action-fees.webp',
      alt: '思达启航顾问为学生核算菲律宾宿务English Fella语言学校费用',
    },
    {
      number: '03',
      title: '先判断Fella是否适合',
      text: '根据学习目标、校区偏好、管理强度、预算、房型和入学档期，帮你判断Fella是否匹配。',
      image: 'assets/cia/sida-why-action-selection.webp',
      alt: '思达启航顾问帮助学生选择适合的英语学校',
    },
    {
      number: '04',
      title: '出发前每一步有人提醒',
      text: '签证、eTravel、入学文件、付款、接机和当地费用准备都会提前提醒。',
      image: 'assets/cia/sida-why-action-departure.webp',
      alt: '菲律宾游学出发前文件和行李准备',
    },
    {
      number: '05',
      title: '服务持续到完成学习回国',
      text: '换老师、调课、住宿、账单、续读或转校问题都可以继续协助。',
      image: 'assets/cia/sida-why-action-followup.webp',
      alt: '思达启航顾问持续跟进学生学习情况',
    },
    {
      number: '06',
      title: '深圳总部 + 宿务驻点服务',
      text: '国内顾问与宿务工作人员协作，重要节点有人跟进。',
      image: 'assets/cia/sida-why-action-team.webp',
      alt: '思达启航宿务和深圳服务团队',
    },
  ];

  readonly sidaFellaTrustBadges: SidaFellaTrustBadge[] = [
    { icon: 'description', label: '国内正式公司合同' },
    { icon: 'verified_user', label: '学校合作与文件核验' },
    { icon: 'local_offer', label: '费用透明与同条件保价' },
    { icon: 'apartment', label: '深圳总部 + 宿务驻点' },
  ];

  readonly schoolServices = ['机场接机', '入学说明', '分级测试', '课程咨询', '校内餐厅', 'CAFELLA', '宿舍清洁', '洗衣服务', '医护与转诊', '校内保安', '运动设施', '华语顾问沟通'];
  readonly campusActivities = ['Sports Competition', 'Fun Friday', 'Fella Day', '英语展示', '校内运动', '校园交流'];
  readonly weekendActivities = ['跳岛活动', 'Cebu City Tour', 'Safari Park Tour', '志愿活动', '商场与餐厅', '学生自发聚会'];
  readonly notes = [
    'English Fella只有第一校区（斯巴达）和第二校区（自律型／半斯巴达）；课程和房型必须先按校区筛选。',
    '当前只开放资料已确认的4／8／12／16／20／24周报价，不推算1／2／3周价格。',
    '优惠顺序为先减7月报名优惠，再对剩余课程费和住宿费计算95折，最后再减可叠加的圣诞优惠。',
    '18岁以下单独到校由用户勾选未成年服务费，按每个课程周25美元计算。',
    '30天或59天旅游签证由学生选择；4周通常推荐30天，8周及以上通常推荐59天，最终以移民局发放为准。',
    '第二次及以后续签金额未提供，页面仅提示预计次数，不计入学杂费合计。',
    '最终报名以学校正式录取、付款节点和顾问确认报价为准。',
  ];
  readonly faqs: FaqItem[] = [
    { question: 'English Fella适合第一次菲律宾游学吗？', answer: '适合，但要先确认校区和管理强度。若你希望有校园空间、生活支持和比较完整的课程选择，Fella值得放入候选。' },
    { question: 'English Fella是斯巴达学校吗？', answer: 'Fella有两个校区：第一校区为斯巴达，第二校区为自律型／半斯巴达。报价器会按所选校区过滤课程与房型。' },
    { question: '页面上的报价包含全部费用吗？', answer: '学校费用与到校学杂费会分开计算；房间押金、接机费和挂锁押金另列且不计入学杂费合计。第二次及以后签证续签金额因资料未明确而暂不计价。' },
    { question: 'English Fella适合亲子吗？', answer: '可以考虑。课程表包含P-JEC、JEC儿童课程和GEC家长课程，但要先确认孩子年龄、陪同家长、监护规则、房型和校区。' },
    { question: '思达会协助签证和入境吗？', answer: '会。通过思达报名English Fella，思达顾问会免费协助菲律宾入境及签证相关手续，学生只需要按顾问指引准备个人资料。' },
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
    this.loadExchangeRate();
  }

  private loadExchangeRate(): void {
    this.exchangeRateService.getLatestCnyRates().pipe(catchError(() => EMPTY)).subscribe((rates) => {
      if (rates.usdToCny <= 0 || rates.phpPerCny <= 0) return;
      this.usdToCny = rates.usdToCny;
      this.phpPerCny = rates.phpPerCny;
      this.exchangeRateDate = rates.date;
      this.usingLiveExchangeRate = true;
    });
  }

  private loadPricingFromDatabase(): void {
    this.schoolService.getSchools({ name: this.pricingSchoolSearchName }).pipe(
      switchMap((schools) => {
        const school =
          this.pricingSchoolNames.map((name) => schools.find((item) => item.name === name)).find(Boolean) ??
          schools.find((item) => item.name.includes('English Fella')) ??
          schools[0];
        if (!school?.id) return EMPTY;
        return forkJoin({
          lessons: this.schoolService.getSchoolLessons({ schoolId: school.id, week: 4 }),
          rooms: this.schoolService.getSchoolRooms({ schoolId: school.id, week: 4 }),
          fees: this.schoolService.getSchoolFees({ schoolId: school.id }),
        });
      }),
      catchError(() => EMPTY),
    ).subscribe(({ lessons, rooms, fees }) => this.applyPricingData(lessons, rooms, fees));
  }

  private applyPricingData(lessons: SchoolLessonDTO[], rooms: SchoolRoomDTO[], fees: SchoolFeeDTO[]): void {
    for (const lesson of lessons.filter((item) => item.week === 4)) {
      const course = this.courseFees.find((item) => item.id === this.createCourseId(lesson.name));
      if (course) course.tuition = lesson.price;
    }
    this.courseFees.sort((a, b) => this.orderIndex(this.courseFeeOrder, a.id) - this.orderIndex(this.courseFeeOrder, b.id));

    for (const databaseRoom of rooms.filter((item) => item.week === 4)) {
      const room = this.roomFees.find((item) => item.id === this.createRoomId(databaseRoom.name));
      if (room) room.fee = databaseRoom.price;
    }
    this.roomFees.sort((a, b) => this.orderIndex(this.roomFeeOrder, a.id) - this.orderIndex(this.roomFeeOrder, b.id));

    const registrationFee = fees.find((fee) => fee.name === '注册费');
    if (registrationFee) this.registrationFee = registrationFee.fee;
  }

  setGalleryCategory(category: GalleryCategory): void { this.selectedGalleryCategory = category; }
  calculateQuote(): void { this.quoteCalculated = true; }
  get studentCount(): number { return this.requestedStudentCount; }
  set studentCount(value: number) {
    this.requestedStudentCount = value;
    if (Number.isInteger(value) && value >= 2 && value <= 20) {
      while (this.students.length < value) this.students.push(new FellaStudentQuote(this));
    }
  }
  setQuoteMode(value: 'single' | 'group'): void {
    this.quoteMode = value;
    if (value === 'group') this.studentCount = this.requestedStudentCount;
  }
  setStudentCampus(student: FellaStudentQuote, campus: FellaCampus): void { student.setCampus(campus); }
  get activeStudents(): FellaStudentQuote[] {
    return this.quoteMode === 'single'
      ? this.students.slice(0, 1)
      : this.students.slice(0, Math.max(2, Math.min(20, Math.floor(this.studentCount) || 2)));
  }
  get quoteError(): string {
    if (this.quoteMode === 'group' && (!Number.isInteger(this.studentCount) || this.studentCount < 2 || this.studentCount > 20)) return '多人报价人数请选择2–20人的整数。';
    const index = this.activeStudents.findIndex((student) => !!student.quoteError);
    return index < 0 ? '' : `${this.quoteMode === 'group' ? `学生${index + 1}：` : ''}${this.activeStudents[index].quoteError}`;
  }
  get selectedWeeks(): number { return this.students[0].courseWeeks; }
  get selectedStartDate(): string { return this.students[0].arrivalDate; }
  get selectedCourse(): FellaCourseFee {
    const id = this.students[0].quotePlan.courses[0]?.optionId;
    return this.courseFees.find((course) => course.id === id) ?? this.courseFees[0];
  }
  get selectedRoom(): FellaRoomFee {
    const id = this.students[0].quotePlan.rooms[0]?.optionId;
    return this.roomFees.find((room) => room.id === id) ?? this.roomFees[0];
  }
  get earliestStartDate(): string { return this.activeStudents.map((student) => student.arrivalDate).filter(Boolean).sort()[0] ?? ''; }
  get quoteFormHeading(): string {
    return this.quoteMode === 'single' ? 'English Fella 两校区单人报价' : `English Fella ${this.activeStudents.length}人报价`;
  }
  private get weekScope(): string {
    const weeks = [...new Set(this.activeStudents.map((student) => student.courseWeeks))].sort((a, b) => a - b);
    return weeks.length === 1 ? `${weeks[0]}周` : `（${weeks.map((week) => `${week}周`).join('／')}）`;
  }
  get quoteHeading(): string {
    if (this.quoteMode === 'single') return `English Fella ${this.students[0].campus === 'campus1' ? '第一校区' : '第二校区'}${this.weekScope}报价`;
    const campuses = new Set(this.activeStudents.map((student) => student.campus));
    const campus = campuses.size === 1 ? `${this.activeStudents[0].campus === 'campus1' ? '第一校区' : '第二校区'}` : '';
    return `English Fella ${campus}${this.activeStudents.length}人${this.weekScope}报价`;
  }
  get quoteUsd(): number { return this.activeStudents.reduce((sum, student) => sum + student.quoteUsd, 0); }
  get quoteUsdText(): string { return `${this.formatUsd(this.quoteUsd)} 美元`; }
  get quoteCnyText(): string { return `人民币预计金额：约 ${Math.round(this.quoteUsd * this.usdToCny).toLocaleString('zh-CN')} 元`; }
  get exchangeRateSummary(): string {
    const source = this.usingLiveExchangeRate ? this.exchangeRateDate.replace(/-/g, '/') : '备用参考值';
    return `参考汇率：1美元≈${this.usdToCny.toLocaleString('zh-CN', { maximumFractionDigits: 6 })}元，1元≈${this.phpPerCny.toLocaleString('zh-CN', { maximumFractionDigits: 6 })}比索（${source}）`;
  }
  get estimatedLocalFees() { return groupLocalFees(this.activeStudents); }
  get estimatedLocalFeeTotal(): number { return this.estimatedLocalFees.reduce((sum, fee) => sum + fee.total, 0); }
  get estimatedLocalFeeCny(): number { return Math.round(this.estimatedLocalFeeTotal / this.phpPerCny); }
  readonly localFeeIntro = '学杂费由学校及菲律宾相关部门到校收取；页面按每名学生的课程、住宿和签证选择独立估算。';
  get optionalFeeItems() {
    return this.activeStudents.flatMap((student, index) => {
      const prefix = this.quoteMode === 'group' ? `学生${index + 1} · ` : '';
      const rows = [
        {
          label: `${prefix}房间押金（可退）`, amount: this.formatPhp(student.roomDeposit),
          cnyAmount: `约人民币 ${Math.round(student.roomDeposit / this.phpPerCny).toLocaleString('zh-CN')} 元`,
          note: `${student.roomWeeks >= 12 ? '12周及以上为4,000比索' : '12周以下为3,000比索'}；退房时扣除损坏、毕业日后空调电费后退还，超出押金需补齐，电费20比索／千瓦时。`,
        },
        {
          label: `${prefix}挂锁押金（可退）`, amount: this.formatPhp(100),
          cnyAmount: `约人民币 ${Math.round(100 / this.phpPerCny).toLocaleString('zh-CN')} 元`,
          note: '无损坏及丢失，毕业时可退。',
        },
      ];
      if (student.pickupFee) rows.splice(1, 0, {
        label: `${prefix}${student.airportPickup === 'sunday' ? '周日' : '其他时间'}宿务机场接机`,
        amount: this.formatPhp(student.pickupFee),
        cnyAmount: `约人民币 ${Math.round(student.pickupFee / this.phpPerCny).toLocaleString('zh-CN')} 元`,
        note: student.airportPickup === 'sunday' ? '周日接机1,000比索／人；也可自行打车。' : '非周日或其他时间接机1,500比索／次／人。',
      });
      return rows;
    });
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

  get filteredGalleryImages(): GalleryImage[] { return this.selectedGalleryCategory === '全部' ? this.galleryImages : this.galleryImages.filter((image) => image.category === this.selectedGalleryCategory); }

  get quoteImageData() {
    const planItems = (['课', '宿'] as const).flatMap((icon) => this.activeStudents.flatMap((student, index) => student.quotePlan.paymentItems()
      .filter((item) => item.icon === icon)
      .map((item) => ({
        ...item,
        label: `${this.quoteMode === 'group' ? `学生${index + 1} · ` : ''}${item.label.replace(/^课程费/, '课程名称').replace(/^住宿费/, '住宿名称')}`,
        detailTitle: `${student.campusLabel}｜${item.detailTitle ?? ''}`,
      }))));
    const paymentItems = [
      ...planItems,
      ...groupPaymentLines(this.activeStudents, true),
    ];
    const warnings = this.activeStudents.flatMap((student, index) => student.quotePlan.warning ? [`${this.quoteMode === 'group' ? `学生${index + 1}：` : ''}${student.quotePlan.warning}`] : []);
    const pendingVisa = this.activeStudents.flatMap((student, index) => student.touristExtensionCount > 1
      ? [`${this.quoteMode === 'group' ? `学生${index + 1}：` : ''}第2次及以后签证续签金额未提供，当前合计只包含首次续签6,440比索。`]
      : []);
    const quote = buildPhilippinesDetailedQuote({
      schoolCode: 'FELLA',
      schoolName: '菲律宾宿务English Fella语言学校',
      filePrefix: 'English-Fella',
      heroSrc: '/assets/fella/campus-main.webp',
      weeks: this.selectedWeeks,
      startDate: this.earliestStartDate,
      usdToCny: this.usdToCny,
      totalUsd: this.quoteUsd,
      fullFeeDetails: true,
      localFeeTableLayout: 'web',
      paymentItems,
      localFeeItems: this.estimatedLocalFees.map((fee) => ({ label: fee.item, unit: fee.unitLabel, quantity: this.formatFeeQuantity(fee.quantity), amount: this.formatPhp(fee.total), note: fee.note })),
      localFeeTotal: this.estimatedLocalFeeTotal,
      localCurrencyName: '比索',
      localFeeCny: this.estimatedLocalFeeCny,
      localFeeNote: '学杂费按学生独立计算；不含可退房间押金、接机费及挂锁押金。',
      optionalFeeItems: this.optionalFeeItems,
      ruleNotes: [],
    });
    const result = applySchoolQuoteImageLayout({
      ...quote,
      localFeeTitle: '到校后学杂费明细',
      importantNotes: [
        ...warnings,
        ...pendingVisa,
        '学校费用需在到校前2周交齐，可交由思达游学代收或自行转美元给学校；人民币支付按支付宝实时汇率结算。',
        '学杂费由学校及菲律宾相关部门到校收取，本报价仅供参考，具体以学校实际收取为准。',
        '课程及住宿按周日开始、周六结束；所选校区只显示该校区可选课程和房型。',
      ],
      footerNotesVerbatim: true,
    }, 'English Fella', this.selectedWeeks, this.earliestStartDate, this.quoteUsd, this.usdToCny);
    return {
      ...result,
      headingText: this.quoteHeading,
      fileName: `${this.quoteHeading}-${this.earliestStartDate.replace(/-/g, '')}.png`,
      conversionRates: { usdToCny: this.usdToCny, phpPerCny: this.phpPerCny, date: this.usingLiveExchangeRate ? this.exchangeRateDate : undefined },
    };
  }

  formatUsd(value: number): string { return value.toLocaleString('en-US', { minimumFractionDigits: Number.isInteger(value) ? 0 : 1, maximumFractionDigits: 2 }); }
  formatPhp(value: number): string { return `${Math.round(value).toLocaleString('en-US')} 比索`; }
  formatFeeQuantity(value: number): string { return value.toLocaleString('zh-CN', { maximumFractionDigits: 2 }); }
  private slugifyPriceKey(value: string): string { return value.toLowerCase().replace(/&/g, 'and').replace(/\+/g, ' ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
  private createCourseId(name: string): string {
    if (name.startsWith('PIC-6')) return 'pic-6';
    if (name.startsWith('TOEIC ESL')) return 'toeic-esl';
    if (name.startsWith('TOEIC 托业实战')) return 'toeic-practice';
    if (name.startsWith('TOEIC 托业保证')) return 'toeic-guarantee';
    return this.slugifyPriceKey(name);
  }
  private orderIndex(order: string[], value: string): number { const index = order.indexOf(value); return index === -1 ? Number.MAX_SAFE_INTEGER : index; }
  private createRoomId(name: string): string {
    if (name.includes('Premium 1P')) return 'premium-1p';
    if (name.includes('1A')) return 'single-1a';
    if (name.includes('1B')) return 'single-1b';
    if (name.includes('2A')) return 'twin-2a';
    if (name.includes('3A')) return 'triple-3a';
    if (name.includes('三人')) return 'triple-3a';
    if (name.includes('双人')) return 'twin-2a';
    if (name.includes('豪华')) return 'deluxe-single';
    if (name.includes('标准单人')) return 'standard-single';
    if (name.includes('单人')) return 'standard-single';
    return this.slugifyPriceKey(name);
  }
}

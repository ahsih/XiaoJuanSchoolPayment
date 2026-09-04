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
import { PHILINTER_COURSES, PHILINTER_ROOMS } from './philinter-catalog';
import { PHILINTER_AGE_RULE, PHILINTER_FAMILY_RULE, PHILINTER_PROMOTION, PHILINTER_SUMMER_PERIODS, PhilinterStudentCalculator, philinterMultiplier } from './philinter-quote';
import { applySchoolQuoteImageLayout, quoteMoney } from '../../../components/school-quote-plan';
import { SchoolQuotePlanComponent } from '../../../components/school-quote-plan.component';
import { buildPhilippinesDetailedQuote } from '../../../components/philippines-quote-image-data';
import { QuoteImageDownloadButtonComponent } from '../../../components/quote-image-download-button.component';
import { SCHOOL_VISA_OPTIONS, groupLocalFees } from '../../../components/school-group-quote';

type GalleryCategory = '全部' | '校园' | '教室' | '住宿' | '餐厅' | '设施';

interface QuickInfo { icon: string; label: string; value: string; note: string; }
interface GalleryImage { category: Exclude<GalleryCategory, '全部'>; title: string; description: string; src: string; }
interface BasicInfoRow { label: string; value: string; }
interface Highlight { image: string; title: string; text: string; }
interface FitItem { title: string; text: string; }
interface CourseItem { name: string; type: string; lessons: string; suitable: string; }
interface ScheduleItem { time: string; title: string; text: string; }
interface LocalFee { item: string; amount: string; note: string; quantity: number; total: number; excluded?: boolean; }
interface ProcessStep { icon: string; title: string; text: string; }
interface FaqItem { question: string; answer: string; }
interface SideNavItem { label: string; target: string; icon: string; }
interface SidaPhilinterReason {
  number: string;
  title: string;
  text: string;
  image: string;
  alt: string;
}
interface SidaPhilinterTrustBadge { icon: string; label: string; }
interface PhilinterStudentQuote { calculator: PhilinterStudentCalculator; }

@Component({
  selector: 'app-philinter-school-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule, QuoteImageDownloadButtonComponent, SchoolQuotePlanComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './philinter-school-detail.component.html',
  styleUrls: [
    '../cebu-school-detail-layout.css',
    '../cebu-school-detail-content.css',
    '../cebu-school-detail-responsive.css',
    '../ev-school/ev-school-detail.component.css',
    '../ibreeze-school/ibreeze-school.component.css',
    '../../../components/school-group-quote.css',
    './philinter-school-detail.component.css',
  ],
})
export class PhilinterSchoolDetailComponent implements OnInit {
  private readonly schoolService = inject(SchoolService);
  private readonly exchangeRateService = inject(ExchangeRateService);
  private readonly pricingSchoolSearchName = 'Philinter';
  private readonly pricingSchoolNames = ['菲律宾宿务Philinter语言学校', 'Philinter Academy'];
  readonly galleryCategories: GalleryCategory[] = ['全部', '校园', '教室', '住宿', '餐厅', '设施'];
  selectedGalleryCategory: GalleryCategory = '全部';
  readonly registrationFee = 120;
  seasonalFeePerWeek = 40;
  usdToCny = 7.2;
  phpPerCny = 7.75;
  exchangeRateDate = '';
  exchangeRateLive = false;
  readonly weekOptions = Array.from({ length: 24 }, (_, i) => i + 1);
  readonly ageRule = PHILINTER_AGE_RULE;
  readonly familyRule = PHILINTER_FAMILY_RULE;
  readonly promotionRule = PHILINTER_PROMOTION;
  readonly localFeeIntro = '学杂费为到校后由学校及相关部门收取的当地费用，与思达游学无关；以下为预估，以到校实收为准。';
  readonly visaOptions = SCHOOL_VISA_OPTIONS;
  readonly students: PhilinterStudentQuote[] = [this.createStudent()];
  quoteMode: 'single' | 'group' = 'single';
  private requestedStudentCount = 2;
  quoteCalculated = false;
  private createStudent(): PhilinterStudentQuote { return { calculator: new PhilinterStudentCalculator(() => this.courseFees, () => this.roomFees, () => this.registrationFee, () => this.seasonalFeePerWeek) }; }
  get studentCount() { return this.requestedStudentCount; }
  set studentCount(value: number) { this.requestedStudentCount = value; if (Number.isInteger(value) && value >= 2 && value <= 20) while (this.students.length < value) this.students.push(this.createStudent()); }
  setQuoteMode(value: 'single' | 'group') { this.quoteMode = value; if (value === 'group') this.studentCount = this.requestedStudentCount; }
  get activeStudents() { return this.quoteMode === 'single' ? this.students.slice(0, 1) : this.students.slice(0, Math.max(2, Math.min(20, Math.floor(this.studentCount) || 2))); }
  get calculator() { return this.students[0].calculator; }
  get quotePlan() { return this.calculator.plan; }
  get selectedAgeGroup() { return this.calculator.ageGroup; }
  set selectedAgeGroup(value: 'adult' | 'junior' | 'under12') { this.calculator.ageGroup = value; }
  get guardianSameRoom() { return this.calculator.guardianSameRoom; }
  set guardianSameRoom(value: boolean) { this.calculator.guardianSameRoom = value; }
  get initialVisaDays() { return this.calculator.initialVisaDays; }
  set initialVisaDays(value: number) { this.calculator.visaType = value === 30 ? 'tourist30' : 'tourist59'; }
  get shortStayApproved() { return true; }
  set shortStayApproved(_approved: boolean) {}

  readonly quickInfo: QuickInfo[] = [
    { icon: 'school', label: '学校类型', value: '宿务老牌半斯巴达学校', note: '2003年成立，官方定位为Cebu领先的Semi-Sparta ESL学校' },
    { icon: 'groups', label: '适合人群', value: '成人 / 口语 / IELTS / 青少年', note: '适合重视师资、学习风气和麦克坦位置的学生' },
    { icon: 'verified_user', label: '管理模式', value: '半斯巴达 / 斯巴达课程可选', note: 'General偏半斯巴达，Intensive/IELTS方向学习强度更高' },
    { icon: 'record_voice_over', label: '核心课程', value: 'ESL / IPS / IELTS / Business', note: '另有TOEIC、Junior和行业英文' },
    { icon: 'bed', label: '住宿类型', value: '校内宿舍 / 校外公寓', note: '校内单人、双人、三人；校外Azon Condo需确认接送和门禁' },
    { icon: 'flight_land', label: '位置特点', value: 'Lapu-Lapu / 近宿务机场', note: '适合重视抵达便利和麦克坦生活资源的学生' },
  ];

  readonly galleryImages: GalleryImage[] = [
    { category: '校园', title: 'Philinter校园楼体', description: '官方设施图片展示Philinter校内住宿与教学楼体。', src: 'assets/philinter/campus-main.jpeg' },
    { category: '校园', title: '校园泳池', description: '官方设施页介绍泳池位于宿舍与咖啡厅之间，可供学生课后放松。', src: 'assets/philinter/campus-pool.jpg' },
    { category: '校园', title: '学校大厅', description: '学校大厅是学生报到、公告和日常沟通的中心区域。', src: 'assets/philinter/lobby.png' },
    { category: '教室', title: '一对一/小班学习场景', description: 'Philinter课程强调个别化支持和进度追踪。', src: 'assets/philinter/one-on-one-room.jpg' },
    { category: '教室', title: '团体教室', description: '用于讨论、表达、演示和综合训练。', src: 'assets/philinter/study-hall.jpg' },
    { category: '教室', title: '讲座教室', description: '大型团体课、说明会和活动会用到的教学空间。', src: 'assets/philinter/group-classroom.png' },
    { category: '住宿', title: '校内单人房', description: '适合重视隐私和安静学习环境的学生。', src: 'assets/philinter/single-room.jpg' },
    { category: '住宿', title: '校内双人房', description: '预算与舒适度相对平衡，适合同伴同行。', src: 'assets/philinter/double-room.jpg' },
    { category: '住宿', title: '校内三人房', description: '上下铺房型，按每人床位计费。', src: 'assets/philinter/triple-room.jpg' },
    { category: '住宿', title: '校外公寓参考', description: 'Azon Condo方向更偏生活品质，需确认接送、门禁和空房。', src: 'assets/philinter/condo-room.png' },
    { category: '餐厅', title: '学生咖啡厅', description: '官方设施页展示咖啡厅与泳池相连的休息空间。', src: 'assets/philinter/cafeteria-1.jpg' },
    { category: '餐厅', title: '餐厅与用餐空间', description: '三餐和学生交流的重要生活区域。', src: 'assets/philinter/cafeteria-2.jpg' },
    { category: '设施', title: '洗衣服务', description: '日常生活服务之一，具体规则以学校现场安排为准。', src: 'assets/philinter/laundry.jpg' },
    { category: '设施', title: '学习大厅', description: '适合晚间自习、模考准备和课后复习。', src: 'assets/philinter/study-hall.jpg' },
  ];

  readonly basicInfo: BasicInfoRow[] = [
    { label: '学校名称', value: '菲律宾宿务Philinter语言学校（Philinter Center for English Language）' },
    { label: '所在地区', value: 'Lapu-Lapu City, Mactan Island, Cebu，距离宿务机场较近' },
    { label: '创立时间', value: '2003年' },
    { label: '学校定位', value: '老牌半斯巴达语言学校，重视师资、学习系统和多国籍环境' },
    { label: '官方特色', value: 'Guaranteed Progress、Buddy Teacher System、IELTS 8.0 Teachers' },
    { label: '考试资源', value: '官方资料显示Philinter是British Council IELTS官方考点' },
    { label: '课程范围', value: 'Light ESL、General ESL、Intensive ESL、IPS、IELTS、TOEIC、Business、Junior' },
    { label: '住宿选择', value: '校内单人、双人、三人房；校外Azon Condo方向需顾问确认' },
  ];

  readonly highlights: Highlight[] = [
    { image: 'assets/philinter/one-on-one-room.jpg', title: 'Buddy Teacher和进度管理', text: '官方介绍Buddy Teacher System，适合希望学习过程有人跟进的学生。' },
    { image: 'assets/philinter/group-classroom.png', title: '口语与考试课程都强', text: 'ESL、Intensive Power Speaking、IELTS、TOEIC和商务方向都可比较。' },
    { image: 'assets/philinter/campus-pool.jpg', title: '麦克坦位置与校内生活', text: '距离机场较近，校内有泳池、咖啡厅、宿舍和学习空间。' },
    { image: 'assets/philinter/single-room.jpg', title: '校内与校外住宿可选', text: '校内方便学习管理，校外公寓更适合重视生活品质的成人或家庭。' },
  ];

  readonly suitableFor: FitItem[] = [
    { title: '想在老牌学校里稳步提升英文', text: 'Philinter适合重视课程体系、师资和学习风气的成人学生。' },
    { title: '想重点提升口说', text: 'Intensive Power Speaking适合想加强流利度、准确度和实际表达的学生。' },
    { title: 'IELTS、TOEIC或商务目标明确', text: '考试与商务方向较完整，适合需要按目标倒推课程的人。' },
    { title: '想住麦克坦、靠近机场', text: '适合短期入学、抵达时间不稳定或想兼顾麦克坦生活资源的学生。' },
  ];

  readonly notSuitableFor: FitItem[] = [
    { title: '只想住最新型度假村校园', text: 'Philinter是成熟老牌学校，住宿和设施要和CIA、CPI、EV等新型校区一起比较。' },
    { title: '完全不想被学习节奏约束', text: 'Intensive和考试方向会有更明确的学习、测试和出勤要求。' },
    { title: '只看低价，不准备当地费用', text: '到校后仍需支付SSP、SSP E-card、水电、教材、押金、接机、延签等费用。' },
    { title: '不想提前确认住宿规则', text: '校内和校外住宿在预算、门禁、接送、生活便利度上差异明显。' },
  ];

  readonly courses: CourseItem[] = [
    { name: 'Light ESL / General ESL', type: '综合英语', lessons: '一对一 + 小团体 + 大团体 + 自习/选修', suitable: '适合第一次菲律宾游学、基础提升和短期体验。' },
    { name: 'Intensive ESL', type: '斯巴达综合英语', lessons: '更高密度日课 + 晚间学习安排', suitable: '适合想被学习节奏推动、短期快速提升的学生。' },
    { name: 'Intensive Power Speaking', type: '强化口说', lessons: '口说流利度、准确度、互动表达和情境沟通', suitable: '适合想集中提高开口量、自信和表达反应的人。' },
    { name: 'IELTS Intensive / Guarantee', type: '雅思备考', lessons: '雅思听说读写 + 策略训练 + 模考与进度管理', suitable: '适合目标分数明确、需要系统备考和监督的学生。' },
    { name: 'TOEIC', type: '考试英文', lessons: '考试专项 + ESL基础 + 模拟练习', suitable: '适合升学、求职、企业需求或北美考试目标。' },
    { name: 'Business / Focused Industry', type: '商务与行业英文', lessons: '会议、演示、邮件、面试、行业主题', suitable: '适合职场人士、转职或有行业英文需求的成人。' },
    { name: 'Junior', type: '青少年英语', lessons: '青少年ESL、雅思、口语课程', suitable: PHILINTER_AGE_RULE },
  ];

  courseFees = PHILINTER_COURSES.map(course => ({ ...course }));
  roomFees = PHILINTER_ROOMS.map(room => ({ ...room }));

  readonly schedule: ScheduleItem[] = [
    { time: '07:00 - 08:00', title: '早餐与晨间准备', text: '校内用餐后准备当天课程，考试或斯巴达方向需按规则执行。' },
    { time: '08:00 - 12:00', title: '上午课程', text: '一对一、小团体、大团体、考试或商务专项，按课程类型安排。' },
    { time: '12:00 - 13:00', title: '午餐与休息', text: '餐厅用餐，下午课程前整理笔记和作业。' },
    { time: '13:00 - 17:00', title: '下午课程', text: '继续口说、听力、阅读、写作、考试策略或商务主题训练。' },
    { time: '17:00 - 19:00', title: '晚餐与自由时间', text: '可使用校内设施；外出、门禁和校外住宿接送规则需提前确认。' },
    { time: '19:00 - 21:00', title: '自习 / 晚间学习 / 模考', text: 'Intensive、IELTS和保证班方向可能有更明确的晚间安排。' },
  ];

  readonly serviceSteps: ProcessStep[] = [
    { icon: 'person_search', title: '判断Philinter是否适合', text: '先了解学习目标、年龄、住宿偏好、是否接受半斯巴达管理和预算。' },
    { icon: 'fact_check', title: '确认课程、房型和空房', text: '免费协助确认课程、校内/校外住宿、空房、优惠和正式报价。' },
    { icon: 'assignment_turned_in', title: '协助入境和签证手续', text: '思达免费协助办理菲律宾入境及签证相关手续，学生只需按顾问指引准备个人资料。' },
    { icon: 'inventory', title: '发送学习资料和行前清单', text: '入学前免费发送学习资料、行李清单、费用清单和到校注意事项。' },
    { icon: 'support_agent', title: '到校后继续跟进', text: '如遇到换老师、调课、学习方法、宿舍生活或学校沟通问题，也可以继续联系思达协助。' },
    { icon: 'location_on', title: '宿务当地支持', text: '思达在宿务有工作人员驻点，可为学生提供当地支持，直到完成学习并顺利回国。' },
  ];

  readonly sidaPhilinterReasons: SidaPhilinterReason[] = [
    {
      number: '01',
      title: '正式合同与学校文件可核验',
      text: '国内公司签约，Philinter报价、录取文件及收费凭证均可逐项核对。',
      image: 'assets/cia/sida-why-action-contract.jpg',
      alt: '思达启航正式合同与学校文件核验',
    },
    {
      number: '02',
      title: '课程、住宿和费用提前算清',
      text: '0中介服务费，课程费、校内/校外住宿费、考试规则及Philinter到校费用逐项说明。',
      image: 'assets/cia/sida-why-action-fees.jpg',
      alt: '思达启航顾问为学生核算菲律宾宿务Philinter语言学校费用',
    },
    {
      number: '03',
      title: '先判断Philinter是否适合',
      text: '根据口语、IELTS、TOEIC、商务、青少年目标和预算，帮你判断Philinter是否匹配。',
      image: 'assets/cia/sida-why-action-selection.jpg',
      alt: '思达启航顾问帮助学生选择适合的英语学校',
    },
    {
      number: '04',
      title: '出发前每一步有人提醒',
      text: '签证、eTravel、入学文件、付款、接机和当地费用准备都会提前提醒。',
      image: 'assets/cia/sida-why-action-departure.jpg',
      alt: '菲律宾游学出发前文件和行李准备',
    },
    {
      number: '05',
      title: '服务持续到完成学习回国',
      text: '换老师、调课、住宿、账单、续读或转校问题都可以继续协助。',
      image: 'assets/cia/sida-why-action-followup.jpg',
      alt: '思达启航顾问持续跟进学生学习情况',
    },
    {
      number: '06',
      title: '深圳总部 + 宿务驻点服务',
      text: '国内顾问与宿务工作人员协作，重要节点有人跟进。',
      image: 'assets/cia/sida-why-action-team.jpg',
      alt: '思达启航宿务和深圳服务团队',
    },
  ];

  readonly sidaPhilinterTrustBadges: SidaPhilinterTrustBadge[] = [
    { icon: 'description', label: '国内正式公司合同' },
    { icon: 'verified_user', label: '学校合作与文件核验' },
    { icon: 'local_offer', label: '费用透明与同条件保价' },
    { icon: 'apartment', label: '深圳总部 + 宿务驻点' },
  ];

  readonly schoolServices = ['机场接机', '入学说明', '分级测试', 'Buddy Teacher', '学习进度跟进', 'IELTS模考', '学生餐厅', '洗衣服务', '宿舍清洁', '学习大厅', '医护协助', '校内保安'];
  readonly campusActivities = ['新生说明会', '毕业典礼', '商务发表', '校内交流', '泳池与运动', '学习成果展示'];
  readonly weekendActivities = ['麦克坦海岛活动', '宿务市区生活', '商场与餐厅', '度假村周末体验', '同学自发聚会', '顾问可协助确认安全建议'];
  readonly notes = [
    'Philinter报名前建议先确认General、Intensive、IPS、IELTS或Business方向，课程强度差异明显。',
    '校内宿舍和校外公寓在门禁、接送、生活便利度和预算上不同，报名时要一起确认。',
    PHILINTER_AGE_RULE, PHILINTER_FAMILY_RULE,
    '暑期和寒假最低学习周数暂不作为报价限制；暑期附加费按实际覆盖周数计收。',
    '本页课程费与住宿费为4周参考；1周、2周、3周分别按4周价格的45%、65%、85%计算。',
    PHILINTER_PROMOTION,
    '到校支付费用会随学校政策、汇率和个人情况变化，最终以学校现场收费为准。',
  ];

  readonly faqs: FaqItem[] = [
    { question: 'Philinter适合第一次菲律宾游学吗？', answer: '适合。Philinter是宿务老牌学校，课程体系完整，适合想在稳定学习风气里提升英文的学生。' },
    { question: 'Philinter是斯巴达学校吗？', answer: 'Philinter整体更常被理解为半斯巴达学校，但Intensive、IELTS和保证班方向会有更强的学习安排和规则。' },
    { question: '页面上的报价包含全部费用吗？', answer: '不包含全部。前期支付参考主要包含注册费、课程费和住宿费；到校后通常还需支付SSP、SSP E-card、水电、教材、押金、接机、延签等当地费用。' },
    { question: 'Philinter适合口说强化吗？', answer: '适合。Intensive Power Speaking是Philinter常被关注的口说方向，适合想提升流利度、准确度和表达自信的学生。' },
    { question: 'Philinter短期1至3周怎么计算？', answer: '课程费和住宿费均以4周价格为基准：1周按45%、2周按65%、3周按85%计算；注册费每人120美元另计。' },
    { question: '2026年下半年淡季优惠怎么计算？', answer: PHILINTER_PROMOTION },
    { question: '思达会协助签证和入境吗？', answer: '会。通过思达报名Philinter，思达顾问会免费协助菲律宾入境及签证相关手续，学生只需要按顾问指引准备个人资料。' },
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
    this.exchangeRateService.getLatestCnyRates().pipe(catchError(() => EMPTY)).subscribe((snapshot) => {
      this.usdToCny = snapshot.usdToCny;
      this.phpPerCny = snapshot.phpPerCny;
      this.exchangeRateDate = snapshot.date;
      this.exchangeRateLive = true;
    });
  }

  private loadPricingFromDatabase(): void {
    this.schoolService.getSchools({ name: this.pricingSchoolSearchName }).pipe(
      switchMap((schools) => {
        const school =
          this.pricingSchoolNames.map((name) => schools.find((item) => item.name === name)).find(Boolean) ??
          schools.find((item) => item.name.includes('Philinter')) ??
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
    // Keep the confirmed catalog and stable IDs; old database-only courses must not reappear.
    this.courseFees = PHILINTER_COURSES.map(course => ({ ...course,
      tuition: lessons.find(lesson => lesson.week === 4 && lesson.name === course.lookupName)?.price ?? course.tuition }));
    this.roomFees = PHILINTER_ROOMS.map(room => ({ ...room,
      fee: rooms.find(item => item.week === 4 && item.name === room.name)?.price ?? room.fee }));
    const peak = fees.find(fee => fee.name === '旺季附加费');
    if (peak) this.seasonalFeePerWeek = peak.fee;
  }

  setGalleryCategory(category: GalleryCategory): void { this.selectedGalleryCategory = category; }
  calculateQuote(): void { this.quoteCalculated = true; }

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
  get selectedWeeks() { return this.activeStudents.reduce((sum, student) => sum + student.calculator.plan.courseWeeks, 0); }
  get isMinor() { return this.selectedAgeGroup === 'junior'; }
  get courseAndRoomBase() { return this.activeStudents.reduce((sum, student) => sum + student.calculator.base, 0); }
  get sidaDiscountAmount() { return this.activeStudents.reduce((sum, student) => sum + student.calculator.sidaDiscount, 0); }
  get offSeasonDiscountAmount() { return this.activeStudents.reduce((sum, student) => sum + student.calculator.schoolDiscount, 0); }
  get offSeasonEligibilityText() {
    return `${this.promotionRule}${this.offSeasonDiscountAmount ? '' : '当前所选期间未满8个连续合资格周。'}`;
  }
  get summerPeriods() {
    return PHILINTER_SUMMER_PERIODS.map(period => ({ ...period,
      weeks: this.quotePlan.overlapWeeks(period.start, period.end) }));
  }
  private summerPeriodLabel(period: typeof PHILINTER_SUMMER_PERIODS[number]) {
    return `${period.start.replace(/-/g, '/')}（周日）–${period.end.replace(/-/g, '/')}（周六）${period.estimated ? '，参照2026年同为8周预估' : ''}`;
  }
  get summerSurchargeRule() {
    return `暑期附加费${this.seasonalFeePerWeek}美元／周，按课程覆盖周数计收。${PHILINTER_SUMMER_PERIODS.map(period => this.summerPeriodLabel(period)).join('；')}。`;
  }
  get peakSeasonWeeks() { return this.activeStudents.reduce((sum, student) => sum + student.calculator.summerWeeks, 0); }
  get summerSurchargeNote() {
    return `${this.summerPeriods.filter(period => period.weeks > 0).map(period => this.summerPeriodLabel(period)).join('；')}；${this.peakSeasonWeeks}周×${this.seasonalFeePerWeek}美元。`;
  }
  get seasonalSurcharge() { return this.activeStudents.reduce((sum, student) => sum + student.calculator.summerSurcharge, 0); }
  get quoteUsd() { return this.activeStudents.reduce((sum, student) => sum + student.calculator.totalUsd, 0); }
  get quoteUsdText() { return `${this.formatUsd(this.quoteUsd)} 美元`; }
  get quoteCnyText() { return `约 ${Math.round(this.quoteUsd * this.usdToCny).toLocaleString('zh-CN')} 元人民币`; }
  get exchangeRateText() { return this.exchangeRateLive && this.exchangeRateDate ? `汇率日期 ${this.exchangeRateDate}` : '暂按备用汇率估算'; }
  get minimumStayWarning() { return ''; }
  get quoteError(): string {
    if (this.quoteMode === 'group' && (!Number.isInteger(this.studentCount) || this.studentCount < 2 || this.studentCount > 20)) return '多人报价人数请选择2–20人的整数。';
    const index = this.activeStudents.findIndex(student => !!student.calculator.error);
    return index < 0 ? '' : `${this.quoteMode === 'group' ? `学生${index + 1}：` : ''}${this.activeStudents[index].calculator.error}`;
  }
  get policyNotes(): string[] {
    return [
      ...(this.activeStudents.some(student => student.calculator.isMinor) ? [this.ageRule, this.familyRule] : []),
    ];
  }
  get schoolPaymentItems() {
    const newStudents = this.activeStudents.filter(student => !student.calculator.returningStudent).length;
    const discountedStudents = this.activeStudents.map((student, index) => student.calculator.schoolDiscount ? index + 1 : 0).filter(Boolean);
    const schoolDiscountNote = `${this.quoteMode === 'group' && discountedStudents.length ? `学生${discountedStudents.join('、')}适用；` : ''}${this.promotionRule}${this.offSeasonDiscountAmount ? '' : '当前所选期间未满8个连续合资格周。'}`;
    return [
      { icon: '注', label: '注册费', amount: `${this.formatUsd(this.activeStudents.reduce((sum, student) => sum + student.calculator.registration, 0))} 美元`, note: `一次性费用，老学员返校免费；本次计收${newStudents}人${newStudents < this.activeStudents.length ? `，${this.activeStudents.length - newStudents}人免收` : ''}。` },
      { icon: '折', label: '思达启航折扣', amount: `− ${this.formatUsd(this.sidaDiscountAmount)} 美元`, note: '课程费及住宿费9折；注册费、附加费不打折。', accent: true },
      { icon: '淡', label: '淡季优惠', amount: `${this.offSeasonDiscountAmount ? '− ' : ''}${this.formatUsd(this.offSeasonDiscountAmount)} 美元`, note: schoolDiscountNote, accent: this.offSeasonDiscountAmount > 0 },
      ...(this.seasonalSurcharge ? [{ icon: '旺', label: '暑期附加费', amount: `${this.formatUsd(this.seasonalSurcharge)} 美元`, note: `按各学生实际覆盖暑期周数计收，共${this.peakSeasonWeeks}人周；不限制最低学习周数。` }] : []),
    ];
  }
  get visaExtensionCount() { return this.calculator.visaExtensions; }
  get roomDeposit() { return this.calculator.roomDeposit; }
  get localFees(): LocalFee[] {
    return groupLocalFees(this.activeStudents.map(student => ({ localFees: student.calculator.localFees })))
      .map(fee => ({ item: fee.item, amount: fee.unitLabel, quantity: fee.quantity, total: fee.total, note: fee.note }));
  }
  get localFeesTotal() { return this.localFees.reduce((sum, fee) => sum + fee.total, 0); }
  get localFeesCnyText() { return `约 ${Math.round(this.localFeesTotal / this.phpPerCny).toLocaleString('zh-CN')} 元人民币`; }
  get optionalFeeItems() {
    const pickupCount = this.activeStudents.filter(student => student.calculator.pickup !== 'none').length;
    const pickup = this.activeStudents.reduce((sum, student) => sum + student.calculator.pickupAmount, 0);
    const deposit = this.activeStudents.reduce((sum, student) => sum + student.calculator.roomDeposit, 0);
    return [
      { label: '宿务马克坦机场团体接机', value: pickup, note: `${pickupCount ? `本次${pickupCount}人选择接机` : '本次无人选择接机'}；周末06:00–24:00为1,200比索／人，其他时间1,500比索／人。学校团体接机，可能需在机场等候同批其他学生。` },
      { label: '宿舍押金', value: deposit, note: '按每位学生停留周数计收：1–2周2,000比索，3–7周3,000比索，8–11周4,000比索，12–24周5,000比索；退房检查后可退。' },
      { label: '额外住宿', value: 3000, note: '3,000比索／晚参考；按实际额外入住晚数另付，须确认空房及入住安排，不自动乘人数。' },
    ].map(item => ({ label: item.label, amount: this.formatPhp(item.value), note: item.note,
      cnyAmount: `人民币预计约 ${Math.round(item.value / this.phpPerCny).toLocaleString('zh-CN')} 元` }));
  }
  get quoteImageData() {
    const items = this.schoolPaymentItems;
    const courseItems: any[] = [], roomItems: any[] = [];
    this.activeStudents.forEach((student, index) => {
      const prefix = this.quoteMode === 'group' ? `学生${index + 1} · ` : '';
      const rows = student.calculator.plan.paymentItems();
      courseItems.push(...rows.filter(row => row.icon === '课').map(row => ({ ...row, label: `${prefix}${row.label}` })));
      roomItems.push(...rows.filter(row => row.icon === '宿').map(row => ({ ...row, label: `${prefix}${row.label}` })));
    });
    const startDate = this.activeStudents.map(student => student.calculator.plan.startDate).filter(Boolean).sort()[0] ?? '';
    const quote = buildPhilippinesDetailedQuote({
      schoolCode: 'PHILINTER', schoolName: 'PHILINTER', filePrefix: 'PHILINTER', heroSrc: '/assets/philinter/campus-main.jpeg',
      weeks: this.selectedWeeks, startDate, usdToCny: this.usdToCny, totalUsd: this.quoteUsd,
      fullFeeDetails: true, localFeeTableLayout: 'web', localCurrencyName: '比索',
      paymentItems: [items[0], ...courseItems, ...roomItems, ...items.slice(1)],
      localFeeItems: this.localFees.map(fee => ({ label: fee.item, unit: fee.amount, quantity: String(fee.quantity), amount: this.formatPhp(fee.total), note: fee.note })),
      localFeeTotal: this.localFeesTotal, localFeeCny: Math.round(this.localFeesTotal / this.phpPerCny), localFeeNote: this.localFeeIntro,
      optionalFeeItems: this.optionalFeeItems,
      ruleNotes: [],
    });
    const warnings = this.activeStudents.flatMap((student, index) => [
      ...(student.calculator.plan.warning ? [`${this.quoteMode === 'group' ? `学生${index + 1}：` : ''}${student.calculator.plan.warning}`] : []),
      ...student.calculator.plan.shortStayNotes(philinterMultiplier),
    ]);
    const result = applySchoolQuoteImageLayout({ ...quote, totalNote: '', exchangeRateText: '', importantNotes: [...new Set([...warnings, ...this.policyNotes]), '最终以学校价格、空房及优惠确认为准。'] }, 'PHILINTER', this.selectedWeeks, startDate, this.quoteUsd, this.usdToCny);
    return { ...result, headingText: `PHILINTER${this.selectedWeeks}周报价`, fileName: `PHILINTER${this.selectedWeeks}周报价-${startDate.replace(/-/g, '')}.png`, conversionRates: { usdToCny: this.usdToCny, phpPerCny: this.phpPerCny, date: this.exchangeRateDate || undefined } };
  }
  formatUsd(value: number) { return quoteMoney(value); }
  formatPhp(value: number) { return `${quoteMoney(value)} 比索`; }

}

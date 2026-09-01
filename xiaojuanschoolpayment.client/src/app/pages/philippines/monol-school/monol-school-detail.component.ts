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

type GalleryCategory = '全部' | '校区' | '教室' | '住宿' | '餐厅' | '设施';

interface QuickInfo { icon: string; label: string; value: string; note: string; }
interface GalleryImage { category: Exclude<GalleryCategory, '全部'>; title: string; description: string; src: string; }
interface BasicInfoRow { label: string; value: string; }
interface Highlight { image: string; title: string; text: string; }
interface FitItem { title: string; text: string; }
interface CourseItem { name: string; type: string; lessons: string; suitable: string; }
interface CourseFee { id: string; name: string; tuition: number; suitable: string; }
interface ScheduleItem { time: string; title: string; text: string; }
interface RoomFee { id: string; name: string; fee: number; note: string; }
interface LocalFee { item: string; amount: string; note: string; quantity: number; total: number; optional?: boolean; }
interface ProcessStep { icon: string; title: string; text: string; }
interface FaqItem { question: string; answer: string; }
interface SideNavItem { label: string; target: string; icon: string; }
interface SidaMonolReason { number: string; title: string; text: string; image: string; alt: string; }
interface SidaMonolTrustBadge { icon: string; label: string; }

@Component({
  selector: 'app-monol-school-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './monol-school-detail.component.html',
  styleUrls: [
    '../cebu-school-detail-layout.css',
    '../cebu-school-detail-content.css',
    '../cebu-school-detail-responsive.css',
    '../ev-school/ev-school-detail.component.css',
    './monol-school-detail.component.css',
  ],
})
export class MonolSchoolDetailComponent implements OnInit {
  private readonly schoolService = inject(SchoolService);
  private readonly exchangeRateService = inject(ExchangeRateService);
  private readonly pricingSchoolSearchName = 'MONOL';
  private readonly pricingSchoolNames = ['菲律宾碧瑶MONOL语言学校', 'MONOL', 'Models of Nonpareil and Outstanding Learning'];
  private readonly courseFeeOrder = ['esl-4', 'general-esl', 'ielts', 'leap-english'];
  private readonly roomFeeOrder = ['premium-single-room', 'standard-single-room', 'small-single-room', 'triple-room', 'quad-room'];

  readonly galleryCategories: GalleryCategory[] = ['全部', '校区', '教室', '住宿', '餐厅', '设施'];
  selectedGalleryCategory: GalleryCategory = '全部';
  registrationFee = 100;
  readonly registrationDiscount = 100;
  readonly offSeasonCourseDiscountPerBlock = 100;
  readonly offSeasonRoomDiscountPerBlock = 100;
  readonly snsDiscountPerBlock = 100;
  usdToCny = 7.2;
  phpPerCny = 7.75;
  exchangeRateDate = '';
  usingLiveExchangeRate = false;
  readonly weekOptions = [2, 3, 4, 8, 12, 16, 20, 24];
  selectedCourseId = 'esl-4';
  selectedRoomId = 'quad-room';
  selectedWeeks = 4;
  selectedStartDate = '2026-09-06';
  selectedPickupAirport: 'manila' | 'clark' = 'manila';
  applySnsPromotion = false;
  quoteCalculated = false;

  readonly quickInfo: QuickInfo[] = [
    { icon: 'terrain', label: '城市', value: '碧瑶 Baguio', note: 'Pinsao Proper山城环境，适合稳定学习和长期生活。' },
    { icon: 'apartment', label: '学校定位', value: '半斯巴达 / 舒适住宿', note: '比传统高压斯巴达更弹性，住宿生活配套是重要卖点。' },
    { icon: 'school', label: '课程方向', value: 'ESL 4 / General ESL / IELTS / LEAP', note: '从轻量ESL到考试和客制课程，按一对一课时和学习目标选择。' },
    { icon: 'bed', label: '住宿', value: 'Hotel-style dormitory', note: '2025价目表房型从四人胶囊式上下铺到Premium Single。' },
    { icon: 'restaurant', label: '餐食', value: '餐费另计', note: 'Meal allowance separate，适合需要饮食弹性或长期控制预算的学生。' },
    { icon: 'payments', label: '费用表', value: 'MONOL 2025年价目表', note: '注册费、4周课程费和不含餐费的4周住宿费均按价目表更新。' },
  ];

  readonly galleryImages: GalleryImage[] = [
    { category: '校区', title: 'MONOL校舍外观', description: 'MONOL官网首页展示的Baguio校区建筑与山城环境。', src: 'assets/philippines/monol-campus-building.jpg' },
    { category: '教室', title: 'MONOL官方课堂品牌照', description: '官网首页展示的MONOL教师与学生课堂场景。', src: 'assets/philippines/home-school-monol.png' },
    { category: '教室', title: 'MONOL一对一课堂', description: 'Facility页面Classrooms照片展示的一对一辅导空间。', src: 'assets/philippines/monol-classroom.jpg' },
    { category: '教室', title: 'MONOL独立教室区', description: 'Facility页面展示的玻璃隔间教室，适合一对一和集中学习。', src: 'assets/philippines/monol-classroom-group.jpg' },
    { category: '住宿', title: 'Single Room私密房型', description: '官方房型照片展示的单人房，含书桌、冰箱、微波炉等生活设备。', src: 'assets/philippines/monol-private-room.jpg' },
    { category: '住宿', title: 'MONOL住宿空间', description: '官方照片展示的住宿空间；实际房型、床位和设备需按当期空房确认。', src: 'assets/philippines/monol-dormitory-room.jpg' },
    { category: '住宿', title: 'Triple Room多人房', description: '官方照片展示的多人住宿空间，报价时需同步确认房型与空位。', src: 'assets/philippines/monol-dormitory-beds.jpg' },
    { category: '餐厅', title: 'Aqua Garden Cafe餐食', description: 'Facility页面Aqua Garden Cafe照片展示的校内餐饮选择。', src: 'assets/philippines/monol-aqua-garden-cafe.jpg' },
    { category: '餐厅', title: 'MONOL餐点参考', description: '官方照片展示的餐点，餐食预算需在总价外单独估算。', src: 'assets/philippines/monol-food-service.jpg' },
    { category: '设施', title: 'Lounge学习休息区', description: 'Facility页面Lounge照片展示的自习、工作与交流空间。', src: 'assets/philippines/monol-lounge.jpg' },
    { category: '设施', title: 'Rooftop Gym', description: 'Facility页面Rooftop Gym照片展示可看山景的健身空间。', src: 'assets/philippines/monol-rooftop-gym.jpg' },
    { category: '设施', title: 'Golf Driving Range', description: 'Facility页面Golf Driving Range照片展示的校内高尔夫练习区。', src: 'assets/philippines/monol-golf-range.jpg' },
    { category: '设施', title: 'Rooftop Lounge', description: 'Facility页面屋顶休息区照片展示的夜间开放空间。', src: 'assets/philippines/monol-rooftop-lounge.jpg' },
  ];

  readonly basicInfo: BasicInfoRow[] = [
    { label: '学校名称', value: '菲律宾碧瑶MONOL语言学校' },
    { label: '英文名称', value: 'MONOL / Models of Nonpareil and Outstanding Learning' },
    { label: '创校时间', value: '2003年' },
    { label: '地址', value: '20-B Purok 9, Tacay Road, Pinsao Proper, Baguio City, Benguet' },
    { label: '课程方向', value: 'ESL 4、General ESL、IELTS、LEAP English' },
    { label: '房型方向', value: 'Premium Single、Standard Single、Small Single、Triple、Quad（胶囊式上下铺）' },
    { label: '住宿服务', value: '与Misty Hills Hotel合作，提供24小时接待、每日房务、毛巾床品和房间清洁' },
    { label: '报价说明', value: '2025年价目表除注册费外，课程费和住宿费以4周为单位；住宿不含餐费，到校费用多以PHP支付' },
  ];

  readonly highlights: Highlight[] = [
    { image: 'assets/philippines/monol-campus-building.jpg', title: '稳定学习，不是过度高压', text: 'MONOL适合认真学、但不想被全斯巴达制度压满日程的学生。学习效率更多来自课程结构、复习和学生自律。' },
    { image: 'assets/philippines/monol-private-room.jpg', title: 'Hotel-style宿舍管理', text: '官方资料强调Misty Hills Hotel合作、24小时接待、每日房务、床品毛巾和房间清洁，适合长期住得稳定的人。' },
    { image: 'assets/philippines/monol-classroom.jpg', title: '课程线清楚', text: 'ESL 4和General ESL按课时与预算补基础，IELTS面向考试目标，LEAP提供更客制化的学习安排。' },
    { image: 'assets/philippines/monol-rooftop-gym.jpg', title: '生活设施更完整', text: '屋顶健身房、桑拿、高尔夫练习区、Lounge、咖啡厅和厨房让MONOL更像“学习生活型”学校。' },
  ];

  readonly suitableFor: FitItem[] = [
    { title: '计划8周以上稳定学习', text: 'MONOL的住宿、设施和半斯巴达节奏更适合中长期学习者，而不是只追求短期高压冲刺。' },
    { title: '重视住宿舒适度和生活配套', text: 'Premium Single、Standard Single和Small Single适合重视隐私或希望住得稳定的人。' },
    { title: '想学ESL或IELTS但不想过度高压', text: 'General ESL和IELTS都有9节日课结构，但晚间生活更需要学生自己安排复习。' },
    { title: '需要课程客制化', text: 'LEAP适合有职业、TOEIC、Business、IELTS或其他具体目标，需要先做学习者画像的人。' },
  ];

  readonly notSuitableFor: FitItem[] = [
    { title: '需要强制自习和严格门禁推动', text: '如果学生自律弱，只靠制度推进，建议同步比较PINES、JIC Challenger或BECI Sparta。' },
    { title: '只看最低价格', text: 'MONOL餐费另计，房型差距明显，必须把注册费、房费、当地费、餐食和接机一起核算。' },
    { title: '想住市中心最便利区域', text: 'MONOL位于Pinsao Proper，外出和市区交通要提前确认接受度。' },
    { title: '目标是极短期轻松体验', text: 'MONOL可以2周起报，但真正优势更适合有稳定学习和住宿需求的学生。' },
  ];

  readonly courses: CourseItem[] = [
    { name: 'ESL 4', type: '轻量综合英文', lessons: '4节一对一 + 4节团体选修课 + 健身选修课', suitable: '适合预算优先、希望保留复习和生活弹性，同时维持一对一训练的学生。' },
    { name: 'General ESL', type: '基础与综合英文', lessons: '5节一对一 + 4节团体选修课 + 健身选修课', suitable: '覆盖听说读写、语法和发音，适合打基础和系统提升。' },
    { name: 'IELTS', type: '雅思备考', lessons: '5节一对一 + 4节团体选修课 + 健身选修课', suitable: '面向升学、海外就业或移民方向；代理价表注明每周五模拟考试，学校公开课程页按每期安排模拟考试。' },
    { name: 'LEAP English', type: '客制化英文', lessons: '5节一对一 + 4节团体选修课 + 健身选修课', suitable: '先做学习者画像和目标分析，再按General ESL、IELTS、TOEIC、Business或其他科目组合课程。' },
    { name: 'Junior ESL', type: '亲子与青少年规则', lessons: '支持5—15岁学生与父母同行学习', suitable: '寒暑假不接受Junior ESL单独报名；16—18岁可选成人课程，5—18岁独自在校学习另收USD 100/4周管理费。课程价格需单独确认。' },
    { name: 'Additional One-on-One', type: '追加一对一', lessons: '按ESL / IELTS / LEAP不同价格追加', suitable: '适合到校后发现某一科目需要更多纠错或强化时再单独确认。' },
  ];

  courseFees: CourseFee[] = [
    { id: 'esl-4', name: 'ESL 4', tuition: 750, suitable: '4节一对一 + 4节团体选修课 + 健身选修课' },
    { id: 'general-esl', name: 'General ESL', tuition: 900, suitable: '5节一对一 + 4节团体选修课 + 健身选修课' },
    { id: 'ielts', name: 'IELTS', tuition: 1000, suitable: '5节一对一 + 4节团体选修课 + 健身选修课；每周五模拟考试' },
    { id: 'leap-english', name: 'LEAP English', tuition: 1150, suitable: '5节一对一 + 4节团体选修课 + 健身选修课' },
  ];

  roomFees: RoomFee[] = [
    { id: 'premium-single-room', name: 'Premium Single Room', fee: 1100, note: '高级单人间，适合长期学习和重视隐私的人' },
    { id: 'standard-single-room', name: 'Standard Single Room', fee: 750, note: '标准单人间，隐私与价格较平衡' },
    { id: 'small-single-room', name: 'Small Single Room', fee: 650, note: '大单间改为两个小房间，两人共用一个洗手间' },
    { id: 'triple-room', name: 'Triple Room', fee: 500, note: '三人间，适合控制住宿预算' },
    { id: 'quad-room', name: 'Quad Room (Capsule Bunks)', fee: 400, note: '四人间，使用胶囊式上下铺' },
  ];

  readonly schedule: ScheduleItem[] = [
    { time: '07:00 - 08:00', title: '早餐 / 个人准备', text: '淡季符合条件的学生，2026年12月31日前工作日提供免费早餐；其他餐食按个人选择另计。' },
    { time: '08:00 - 12:00', title: '上午一对一与团体课', text: 'ESL 4安排4节一对一；General ESL、IELTS和LEAP安排5节一对一，并搭配团体选修课。' },
    { time: '12:00 - 13:00', title: '午餐与短休', text: '可结合餐盒、咖啡厅、外送或共享厨房安排午餐。' },
    { time: '13:00 - 17:00', title: '下午课程与团体选修', text: '团体选修包含写作、讨论、语法和发音；IELTS关注考试科目训练，LEAP按个人目标调整。' },
    { time: '17:00 - 22:00', title: '健身选修 / 复习', text: '17:00—19:00健身训练，19:00—20:00拳击，20:00—21:00泰拳，21:00—22:00瑜伽；具体开放以校方当期安排为准。' },
    { time: '周末', title: '碧瑶生活与休息', text: '适合安排市区采购、咖啡厅、Burnham Park、Camp John Hay或自然景点。' },
  ];

  readonly serviceSteps: ProcessStep[] = [
    { icon: 'person_search', title: '先判断是否适合MONOL', text: '确认学生是否需要舒适住宿、长期稳定学习、饮食弹性和半斯巴达节奏。' },
    { icon: 'fact_check', title: '确认课程和房型', text: '免费协助确认ESL 4、General ESL、IELTS或LEAP，房型、空房、餐食预算和正式报价。' },
    { icon: 'assignment_turned_in', title: '协助入境和签证', text: '思达免费协助菲律宾入境及签证相关手续，学生按顾问指引准备资料。' },
    { icon: 'inventory', title: '发送行前清单', text: '出发前提供学习资料、费用清单、行李清单、接机和到校注意事项。' },
    { icon: 'support_agent', title: '到校后继续跟进', text: '如遇到调课、住宿、费用、生活适应或学校沟通问题，可继续联系思达协助。' },
    { icon: 'location_on', title: '国内顾问与当地协作', text: '国内顾问与菲律宾当地工作人员协作，重要节点持续跟进。' },
  ];

  readonly sidaMonolReasons: SidaMonolReason[] = [
    { number: '01', title: '先判断MONOL是否真的适合', text: '会把学习强度、住宿期待、餐食弹性、交通位置和学生自律程度一起评估。', image: 'assets/cia/sida-why-action-selection.jpg', alt: '思达启航顾问帮助学生判断MONOL是否适合' },
    { number: '02', title: '课程、房型、餐费和当地费用提前算清', text: '0中介服务费，课程费、住宿费、餐食另计、签证和到校PHP费用逐项说明。', image: 'assets/cia/sida-why-action-fees.jpg', alt: '思达启航顾问核算菲律宾碧瑶MONOL语言学校费用' },
    { number: '03', title: '正式文件与收费可核对', text: '国内公司签约，报价、录取、付款节点和学校文件都可逐项核验。', image: 'assets/cia/sida-why-action-contract.jpg', alt: '思达启航正式合同与学校文件核验' },
    { number: '04', title: '出发前每一步有人提醒', text: '签证、eTravel、入学文件、付款、接机、换汇和当地费用准备都会提前提醒。', image: 'assets/cia/sida-why-action-departure.jpg', alt: '菲律宾游学出发前文件和行李准备' },
    { number: '05', title: '服务持续到完成学习回国', text: '换老师、调课、住宿、账单、续读或转校问题都可以继续协助。', image: 'assets/cia/sida-why-action-followup.jpg', alt: '思达启航顾问持续跟进学生学习情况' },
    { number: '06', title: '深圳总部 + 菲律宾当地支持', text: '国内顾问与菲律宾当地工作人员协作，遇到重要节点有人跟进。', image: 'assets/cia/sida-why-action-team.jpg', alt: '思达启航菲律宾和深圳服务团队' },
  ];

  readonly sidaMonolTrustBadges: SidaMonolTrustBadge[] = [
    { icon: 'description', label: '国内正式公司合同' },
    { icon: 'verified_user', label: '学校合作与文件核验' },
    { icon: 'local_offer', label: '费用透明与同条件保价' },
    { icon: 'apartment', label: '深圳总部 + 菲律宾支持' },
  ];

  readonly schoolServices = ['机场接机', '入学说明', '分级测试', '课程咨询', '学习监测', '房务清洁', '自助洗衣', '共享厨房', '健身房', '证件协助'];
  readonly campusActivities = ['新生说明会', 'Fitness Classes', '英语口语活动', 'IELTS模拟考试', '学生交流活动'];
  readonly weekendActivities = ['SM Baguio', 'Burnham Park', 'Baguio夜市', 'Camp John Hay', 'Mines View Park'];
  readonly notes = [
    'MONOL 2025年价目表说明除注册费外，课程费和住宿费以4周为单位列示。',
    '通过思达报名免USD 100注册费；符合淡季条件时，每满4周课程费减USD 100、住宿费减USD 100。',
    'SNS活动仅限符合日期且选择单人房或小单间的学生；每4周发布一篇小红书及抖音在校故事，可再减USD 100，活动可能随时结束。',
    '餐费约PHP 14,000/4周，房间押金PHP 4,000，均不计入学杂费合计。',
    '本页课程费按2025年价目表直接列示：ESL 4 / General ESL / IELTS / LEAP分别为USD 750 / 900 / 1,000 / 1,150。',
    '课程结构已与学校公开Program页核对；报价采用思达收到的2025代理价目表，个别房型名称与学校当前公开页面不同。',
    '最终报名以学校正式录取、付款节点和顾问确认报价为准。',
  ];
  readonly faqs: FaqItem[] = [
    { question: '菲律宾碧瑶MONOL语言学校是斯巴达学校吗？', answer: '更适合归类为半斯巴达或自律弹性型。它有高课时日课和学习支持，但不像典型高压斯巴达学校主要靠强制自习和门禁推动。' },
    { question: 'MONOL适合零基础学生吗？', answer: '可以优先比较ESL 4和General ESL。若目标是IELTS，建议先确认入学测验、英语基础和是否需要先读ESL过渡。' },
    { question: '页面报价包含餐费吗？', answer: '不包含。餐费按约PHP 14,000/4周单独准备，房间押金也单列且不计入学杂费合计。淡季符合条件时，2026年12月31日前工作日提供免费早餐。' },
    { question: 'MONOL淡季优惠如何自动计算？', answer: '课程在2026年6月28日前结束，或于2026年8月23日后开始且在2026年内入学，每满4周自动减课程费USD 100和住宿费USD 100；旺季期间不适用。' },
    { question: 'SNS活动优惠会自动计算吗？', answer: '选择参加活动且日期、房型符合时才计算。活动期为2026年1月1日至6月27日，仅限单人房和小单间；每4周需在小红书及抖音发布一篇在校故事，可再减USD 100，最终需顾问确认活动仍开放。' },
    { question: '页面的课程和住宿价格按什么周期计算？', answer: '注册费为一次性USD 100；课程费和不含餐费的住宿费均按4周列示，其他周数由计算器按比例提供预算参考。' },
    { question: '思达会协助签证和入境吗？', answer: '会。通过思达报名MONOL，思达顾问会免费协助菲律宾入境及签证相关手续，并在出发前发送行前清单和费用提醒。' },
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
          schools.find((item) => item.name.toUpperCase().includes('MONOL')) ??
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
    const databaseCourseFees = lessons
      .filter((lesson) => lesson.week === 4)
      .map((lesson) => ({
        id: this.slugifyPriceKey(lesson.name),
        name: lesson.name,
        tuition: lesson.price,
        suitable: lesson.description || lesson.note || '请联系顾问确认适合人群',
      }))
      .sort((a, b) => this.orderIndex(this.courseFeeOrder, a.id) - this.orderIndex(this.courseFeeOrder, b.id));
    if (this.courseFeeOrder.every((id) => databaseCourseFees.some((course) => course.id === id))) {
      this.courseFees = databaseCourseFees.filter((course) => this.courseFeeOrder.includes(course.id));
      if (!this.courseFees.some((course) => course.id === this.selectedCourseId)) {
        this.selectedCourseId = this.courseFees.find((course) => course.id === 'esl-4')?.id ?? this.courseFees[0].id;
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
    if (this.roomFeeOrder.every((id) => databaseRoomFees.some((room) => room.id === id))) {
      this.roomFees = databaseRoomFees.filter((room) => this.roomFeeOrder.includes(room.id));
      if (!this.roomFees.some((room) => room.id === this.selectedRoomId)) {
        this.selectedRoomId = this.roomFees.find((room) => room.id === 'quad-room')?.id ?? this.roomFees[0].id;
      }
    }

    const registrationFee = fees.find((fee) => fee.name === '注册费');
    if (registrationFee) this.registrationFee = registrationFee.fee;
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

  get filteredGalleryImages(): GalleryImage[] {
    return this.selectedGalleryCategory === '全部'
      ? this.galleryImages
      : this.galleryImages.filter((image) => image.category === this.selectedGalleryCategory);
  }
  get selectedCourse(): CourseFee { return this.courseFees.find((course) => course.id === this.selectedCourseId) ?? this.courseFees[0]; }
  get selectedRoom(): RoomFee { return this.roomFees.find((room) => room.id === this.selectedRoomId) ?? this.roomFees[0]; }
  get tuitionForSelectedWeeks(): number { return this.selectedCourse.tuition * (this.selectedWeeks / 4); }
  get roomFeeForSelectedWeeks(): number { return this.selectedRoom.fee * (this.selectedWeeks / 4); }
  get fullFourWeekBlocks(): number { return Math.floor(this.selectedWeeks / 4); }
  get studyEndDate(): Date | null {
    const start = this.parseDate(this.selectedStartDate);
    if (!start) return null;
    const end = new Date(start);
    end.setDate(end.getDate() + this.selectedWeeks * 7 - 1);
    return end;
  }
  get registrationDiscountAmount(): number { return Math.min(this.registrationFee, this.registrationDiscount); }
  get isOffSeasonPromotionEligible(): boolean {
    const start = this.parseDate(this.selectedStartDate);
    const end = this.studyEndDate;
    const firstPeriodEnd = this.parseDate('2026-06-27');
    const secondPeriodStart = this.parseDate('2026-08-23');
    const promotionEnd = this.parseDate('2026-12-31');
    if (!start || !end || !firstPeriodEnd || !secondPeriodStart || !promotionEnd) return false;
    if (start.getFullYear() !== 2026) return false;
    return end <= firstPeriodEnd || (start >= secondPeriodStart && start <= promotionEnd);
  }
  get offSeasonCourseDiscountAmount(): number {
    return this.isOffSeasonPromotionEligible ? this.fullFourWeekBlocks * this.offSeasonCourseDiscountPerBlock : 0;
  }
  get offSeasonRoomDiscountAmount(): number {
    return this.isOffSeasonPromotionEligible ? this.fullFourWeekBlocks * this.offSeasonRoomDiscountPerBlock : 0;
  }
  get isSnsPromotionEligible(): boolean {
    const start = this.parseDate(this.selectedStartDate);
    const from = this.parseDate('2026-01-01');
    const to = this.parseDate('2026-06-27');
    const eligibleRoom = ['premium-single-room', 'standard-single-room', 'small-single-room'].includes(this.selectedRoomId);
    return !!start && !!from && !!to && start >= from && start <= to && eligibleRoom && this.fullFourWeekBlocks > 0;
  }
  get snsDiscountAmount(): number {
    return this.applySnsPromotion && this.isSnsPromotionEligible ? this.fullFourWeekBlocks * this.snsDiscountPerBlock : 0;
  }
  get totalDiscountAmount(): number {
    return this.registrationDiscountAmount + this.offSeasonCourseDiscountAmount + this.offSeasonRoomDiscountAmount + this.snsDiscountAmount;
  }
  get quoteBeforeDiscounts(): number { return this.registrationFee + this.tuitionForSelectedWeeks + this.roomFeeForSelectedWeeks; }
  get quoteUsd(): number { return Math.max(0, this.quoteBeforeDiscounts - this.totalDiscountAmount); }
  get quoteUsdText(): string { return `USD ${this.formatUsd(this.quoteUsd)} 起`; }
  get quoteCnyText(): string {
    const rounded = Math.round((this.quoteUsd * this.usdToCny) / 100) * 100;
    return `人民币预计金额：约 ${rounded.toLocaleString('zh-CN')} 元`;
  }
  get exchangeRateSummary(): string {
    if (!this.usingLiveExchangeRate) return '人民币金额正在按最新参考汇率更新';
    return `人民币金额按最新参考汇率预估（${this.exchangeRateDate.replace(/-/g, '/')}），最终以支付当日汇率为准`;
  }

  get localFeePeriods(): number { return Math.max(1, Math.ceil(this.selectedWeeks / 4)); }
  get visaExtensionCount(): number { return Math.max(0, Math.ceil((this.selectedWeeks - 8) / 4)); }
  get textbookQuantity(): number { return this.localFeePeriods; }
  get localFees(): LocalFee[] {
    const acrQuantity = this.selectedWeeks > 8 ? 1 : 0;
    const visaExtensionTotal = this.visaExtensionCount * 4940;
    const manilaQuantity = this.selectedPickupAirport === 'manila' ? 1 : 0;
    const clarkQuantity = this.selectedPickupAirport === 'clark' ? 1 : 0;
    return [
      { item: 'SSP特殊学习许可证', amount: 'PHP 7,800', quantity: 1, total: 7800, note: '有效期6个月；换校通常需重新办理' },
      { item: 'SSP-I Card', amount: 'PHP 4,500', quantity: 1, total: 4500, note: '入学时与SSP同时办理，只收一次' },
      { item: 'ACR-I Card 外国人身份证', amount: this.localFeeAmount(4000, acrQuantity), quantity: acrQuantity, total: 4000 * acrQuantity, note: '学习超过8周、首次续签时预计办理' },
      { item: '签证续签', amount: `PHP ${visaExtensionTotal.toLocaleString('en-US')}`, quantity: this.visaExtensionCount, total: visaExtensionTotal, note: this.visaExtensionCount > 0 ? `按首次续签PHP 4,940/次估算，共${this.visaExtensionCount}次；最终以移民局实收为准` : '8周内暂不计；超过8周后按续签次数估算' },
      { item: '教材费', amount: this.localFeeAmount(2000, this.textbookQuantity), quantity: this.textbookQuantity, total: 2000 * this.textbookQuantity, note: `PHP 2,000/4周 × ${this.textbookQuantity}；使用电子教材可免费，需自带电子设备` },
      { item: '学生证', amount: 'PHP 130', quantity: 1, total: 130, note: '一次性费用' },
      { item: '马尼拉机场接机', amount: this.localFeeAmount(3000, manilaQuantity), quantity: manilaQuantity, total: 3000 * manilaQuantity, optional: manilaQuantity === 0, note: '与克拉克接机二选一；周日固定时间团体接机' },
      { item: '克拉克机场接机', amount: this.localFeeAmount(3000, clarkQuantity), quantity: clarkQuantity, total: 3000 * clarkQuantity, optional: clarkQuantity === 0, note: '与马尼拉接机二选一；周日固定时间团体接机' },
      { item: '房间押金', amount: 'PHP 4,000', quantity: 1, total: 4000, optional: true, note: '不计入学杂费合计；无损坏及欠费，毕业时退还' },
      { item: '餐费', amount: this.localFeeAmount(14000, this.localFeePeriods), quantity: this.localFeePeriods, total: 14000 * this.localFeePeriods, optional: true, note: `约PHP 14,000/4周 × ${this.localFeePeriods}；按实际点餐支付，不计入学杂费合计` },
    ];
  }
  get localFeeTotal(): number { return this.localFees.filter((fee) => !fee.optional).reduce((total, fee) => total + fee.total, 0); }
  get localFeeCnyText(): string {
    if (this.phpPerCny <= 0) return '人民币金额正在按最新参考汇率更新';
    return `人民币预计金额：约 ${Math.round(this.localFeeTotal / this.phpPerCny).toLocaleString('zh-CN')} 元`;
  }

  formatUsd(value: number): string {
    return value.toLocaleString('en-US', { minimumFractionDigits: Number.isInteger(value) ? 0 : 1, maximumFractionDigits: 1 });
  }
  private localFeeAmount(unit: number, quantity: number): string { return `PHP ${(unit * quantity).toLocaleString('en-US')}`; }
  private parseDate(value: string): Date | null { const date = new Date(`${value}T12:00:00`); return Number.isNaN(date.getTime()) ? null : date; }
  private slugifyPriceKey(value: string): string {
    return value.toLowerCase().replace(/&/g, 'and').replace(/\+/g, ' plus ').replace(/\//g, ' ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }
  private orderIndex(order: string[], value: string): number {
    const index = order.indexOf(value);
    return index === -1 ? Number.MAX_SAFE_INTEGER : index;
  }
  private createRoomId(name: string): string {
    if (name.includes('Premium Single')) return 'premium-single-room';
    if (name.includes('Standard Single')) return 'standard-single-room';
    if (name.includes('Small Single')) return 'small-single-room';
    if (name.includes('Triple')) return 'triple-room';
    if (name.includes('Quad')) return 'quad-room';
    return this.slugifyPriceKey(name);
  }
}

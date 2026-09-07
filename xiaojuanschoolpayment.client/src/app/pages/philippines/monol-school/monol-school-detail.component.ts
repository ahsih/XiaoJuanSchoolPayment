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
import { QuoteImageDownloadButtonComponent, QuoteImageOptionalFeeItem, QuoteImagePaymentItem } from '../../../components/quote-image-download-button.component';
import { applySchoolQuoteImageLayout } from '../../../components/school-quote-plan';
import { SchoolQuotePlanComponent } from '../../../components/school-quote-plan.component';
import { groupLocalFees, groupPaymentLines } from '../../../components/school-group-quote';
import { MonolStudentQuote } from './monol-student-quote';

type GalleryCategory = '全部' | '校区' | '教室' | '住宿' | '餐厅' | '设施';

interface QuickInfo { icon: string; label: string; value: string; note: string; }
interface GalleryImage { category: Exclude<GalleryCategory, '全部'>; title: string; description: string; src: string; }
interface BasicInfoRow { label: string; value: string; }
interface Highlight { image: string; title: string; text: string; }
interface FitItem { title: string; text: string; }
interface CourseItem { name: string; type: string; lessons: string; suitable: string; }
interface CourseFee { id: string; name: string; tuition: number; suitable: string; note: string; }
interface ScheduleItem { time: string; title: string; text: string; }
interface RoomFee { id: string; name: string; fee: number; note: string; }
interface ProcessStep { icon: string; title: string; text: string; }
interface FaqItem { question: string; answer: string; }
interface SideNavItem { label: string; target: string; icon: string; }
interface SidaMonolReason { number: string; title: string; text: string; image: string; alt: string; }
interface SidaMonolTrustBadge { icon: string; label: string; }

@Component({
  selector: 'app-monol-school-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule, SchoolQuotePlanComponent, QuoteImageDownloadButtonComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './monol-school-detail.component.html',
  styleUrls: [
    '../cebu-school-detail-layout.css',
    '../cebu-school-detail-content.css',
    '../cebu-school-detail-responsive.css',
    '../ev-school/ev-school-detail.component.css',
    '../school-quote-rollout.css',
    '../../../components/school-group-quote.css',
    '../philippines-local-fee-table.css',
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
  readonly phpPerCny = 9;
  readonly quoteGeneralNotes = [
    '学校付款部分须在到校前2周交齐，可由思达代收或由学生直接向MONOL支付；人民币结算按支付当日汇率换算。',
    '到校后学杂费由学校或相关部门直接收取，本报价仅作预算参考，具体以实际收取为准。',
    '课程与住宿日期按周日入住、周六离校计算；房型、名额及住宿安排需由学校最终确认。',
    '本报价根据当前选择生成，最终以MONOL正式账单及思达启航顾问确认为准。',
  ];
  exchangeRateDate = '';
  usingLiveExchangeRate = false;
  quoteCalculated = false;

  readonly quickInfo: QuickInfo[] = [
    { icon: 'terrain', label: '城市', value: '碧瑶 Baguio', note: 'Pinsao Proper山城环境，适合稳定学习和长期生活。' },
    { icon: 'apartment', label: '学校定位', value: '半斯巴达 / 舒适住宿', note: '比传统高压斯巴达更弹性，住宿生活配套是重要卖点。' },
    { icon: 'school', label: '课程方向', value: 'ESL 4 / General ESL / IELTS / LEAP', note: '从轻量ESL到考试和客制课程，按一对一课时和学习目标选择。' },
    { icon: 'bed', label: '住宿', value: 'Hotel-style dormitory', note: '2026价目表房型从四人胶囊式上下铺到高级单人间。' },
    { icon: 'restaurant', label: '餐食', value: '餐费另计', note: 'Meal allowance separate，适合需要饮食弹性或长期控制预算的学生。' },
    { icon: 'payments', label: '费用表', value: 'MONOL 2026年价目表', note: '注册费、4周课程费和不含餐费的4周住宿费均按价目表更新。' },
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
    { label: '房型方向', value: '高级单人间、标准单人间、小单间、三人间、四人间（胶囊式上下铺）' },
    { label: '住宿服务', value: '与Misty Hills Hotel合作，提供24小时接待、每日房务、毛巾床品和房间清洁' },
    { label: '报价说明', value: '2026年价目表除注册费外，课程费和住宿费以4周为单位；住宿不含餐费，到校费用多以比索支付' },
  ];

  readonly highlights: Highlight[] = [
    { image: 'assets/philippines/monol-campus-building.jpg', title: '稳定学习，不是过度高压', text: 'MONOL适合认真学、但不想被全斯巴达制度压满日程的学生。学习效率更多来自课程结构、复习和学生自律。' },
    { image: 'assets/philippines/monol-private-room.jpg', title: 'Hotel-style宿舍管理', text: '官方资料强调Misty Hills Hotel合作、24小时接待、每日房务、床品毛巾和房间清洁，适合长期住得稳定的人。' },
    { image: 'assets/philippines/monol-classroom.jpg', title: '课程线清楚', text: 'ESL 4和General ESL按课时与预算补基础，IELTS面向考试目标，LEAP提供更客制化的学习安排。' },
    { image: 'assets/philippines/monol-rooftop-gym.jpg', title: '生活设施更完整', text: '屋顶健身房、桑拿、高尔夫练习区、Lounge、咖啡厅和厨房让MONOL更像“学习生活型”学校。' },
  ];

  readonly suitableFor: FitItem[] = [
    { title: '计划8周以上稳定学习', text: 'MONOL的住宿、设施和半斯巴达节奏更适合中长期学习者，而不是只追求短期高压冲刺。' },
    { title: '重视住宿舒适度和生活配套', text: '高级单人间、标准单人间和小单间适合重视隐私或希望住得稳定的人。' },
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
    { name: 'Junior ESL', type: '亲子与青少年规则', lessons: '支持5—15岁学生与父母同行学习', suitable: '寒暑假不接受Junior ESL单独报名；16—18岁可选成人课程，5—18岁独自在校学习另收100美元/4周管理费。课程价格需单独确认。' },
    { name: 'Additional One-on-One', type: '追加一对一', lessons: '按ESL / IELTS / LEAP不同价格追加', suitable: '适合到校后发现某一科目需要更多纠错或强化时再单独确认。' },
  ];

  courseFees: CourseFee[] = [
    { id: 'esl-4', name: 'ESL 4', tuition: 750, suitable: '4节一对一 + 4节团体选修课 + 健身选修课', note: '' },
    { id: 'general-esl', name: 'General ESL', tuition: 900, suitable: '5节一对一 + 4节团体选修课 + 健身选修课', note: '' },
    { id: 'ielts', name: 'IELTS', tuition: 1000, suitable: '5节一对一 + 4节团体选修课 + 健身选修课', note: '每周五模拟考试' },
    { id: 'leap-english', name: 'LEAP English', tuition: 1150, suitable: '5节一对一 + 4节团体选修课 + 健身选修课', note: '' },
  ];

  roomFees: RoomFee[] = [
    { id: 'premium-single-room', name: '高级单人间', fee: 1100, note: '' },
    { id: 'standard-single-room', name: '标准单人间', fee: 750, note: '' },
    { id: 'small-single-room', name: '小单间', fee: 650, note: '大单间改造为两个小房间，两人共用一个洗手间' },
    { id: 'triple-room', name: '三人间', fee: 500, note: '' },
    { id: 'quad-room', name: '四人间（胶囊式上下铺）', fee: 400, note: '胶囊房' },
  ];

  readonly students: MonolStudentQuote[] = [new MonolStudentQuote(this)];
  quoteMode: 'single' | 'group' = 'single';
  private requestedStudentCount = 2;

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
    { number: '02', title: '课程、房型、餐费和当地费用提前算清', text: '0中介服务费，课程费、住宿费、餐食另计、签证和到校比索费用逐项说明。', image: 'assets/cia/sida-why-action-fees.jpg', alt: '思达启航顾问核算菲律宾碧瑶MONOL语言学校费用' },
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
    'MONOL 2026年价目表说明除注册费外，课程费和住宿费以4周为单位列示。',
    '通过思达报名免100美元注册费；符合淡季条件时，每满4周课程费减100美元、住宿费减100美元。',
    'SNS活动仅限符合日期且选择单人房或小单间的学生；每4周发布一篇小红书及抖音在校故事，可再减100美元，活动可能随时结束。',
    '餐费约14,000比索/4周，房间押金4,000比索，均不计入学杂费合计。',
    '本页课程费按2026年价目表列示：ESL 4 / General ESL / IELTS / LEAP分别为750 / 900 / 1,000 / 1,150美元。',
    '课程结构已与学校公开Program页核对；报价采用思达收到的2026价目表。',
    '最终报名以学校正式录取、付款节点和顾问确认报价为准。',
  ];
  readonly faqs: FaqItem[] = [
    { question: '菲律宾碧瑶MONOL语言学校是斯巴达学校吗？', answer: '更适合归类为半斯巴达或自律弹性型。它有高课时日课和学习支持，但不像典型高压斯巴达学校主要靠强制自习和门禁推动。' },
    { question: 'MONOL适合零基础学生吗？', answer: '可以优先比较ESL 4和General ESL。若目标是IELTS，建议先确认入学测验、英语基础和是否需要先读ESL过渡。' },
    { question: '页面报价包含餐费吗？', answer: '不包含。餐费按约14,000比索/4周单独准备，房间押金也单列且不计入学杂费合计。淡季符合条件时，2026年12月31日前工作日提供免费早餐。' },
    { question: 'MONOL淡季优惠如何自动计算？', answer: '课程在2026年6月28日前结束，或于2026年8月23日后开始且在2026年内入学，每满4周自动减课程费100美元和住宿费100美元；旺季期间不适用。' },
    { question: 'SNS活动优惠会自动计算吗？', answer: '选择参加活动且日期、房型符合时才计算。活动期为2026年1月1日至6月27日，仅限单人房和小单间；每4周需在小红书及抖音发布一篇在校故事，可再减100美元，最终需顾问确认活动仍开放。' },
    { question: '页面的课程和住宿价格按什么周期计算？', answer: '注册费为一次性100美元；课程费和不含餐费的住宿费均按4周列示，其他周数由计算器按比例提供预算参考。' },
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
      if (rates.usdToCny <= 0) return;
      this.usdToCny = rates.usdToCny;
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
      .map((lesson) => {
        const id = this.slugifyPriceKey(lesson.name);
        const catalog = this.courseFees.find((course) => course.id === id);
        return {
          id,
          name: catalog?.name ?? lesson.name,
          tuition: lesson.price,
          suitable: catalog?.suitable ?? lesson.description ?? '请联系顾问确认课程安排',
          note: catalog?.note ?? '',
        };
      })
      .sort((a, b) => this.orderIndex(this.courseFeeOrder, a.id) - this.orderIndex(this.courseFeeOrder, b.id));
    if (this.courseFeeOrder.every((id) => databaseCourseFees.some((course) => course.id === id))) {
      this.courseFees = databaseCourseFees.filter((course) => this.courseFeeOrder.includes(course.id));
      if (!this.courseFees.some((course) => course.id === this.selectedCourseId)) {
        this.selectedCourseId = this.courseFees.find((course) => course.id === 'esl-4')?.id ?? this.courseFees[0].id;
      }
    }

    const databaseRoomFees = rooms
      .filter((room) => room.week === 4)
      .map((room) => {
        const id = this.createRoomId(room.name);
        const catalog = this.roomFees.find((item) => item.id === id);
        return {
          id,
          name: catalog?.name ?? room.name,
          fee: room.price,
          note: catalog?.note ?? room.description ?? '',
        };
      })
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
  get studentCount() { return this.requestedStudentCount; }
  set studentCount(value: number) {
    this.requestedStudentCount = value;
    if (Number.isInteger(value) && value >= 2 && value <= 20) {
      while (this.students.length < value) this.students.push(new MonolStudentQuote(this));
    }
  }
  setQuoteMode(value: 'single' | 'group') {
    this.quoteMode = value;
    if (value === 'group') this.studentCount = this.requestedStudentCount;
  }
  get activeStudents() {
    return this.quoteMode === 'single'
      ? this.students.slice(0, 1)
      : this.students.slice(0, Math.max(2, Math.min(20, Math.floor(this.studentCount) || 2)));
  }
  get quotePlan() { return this.students[0].quotePlan; }
  get selectedCourseId() { return this.quotePlan.courses[0].optionId; }
  set selectedCourseId(value: string) { this.quotePlan.courses[0].optionId = value; }
  get selectedRoomId() { return this.quotePlan.rooms[0].optionId; }
  set selectedRoomId(value: string) { this.quotePlan.rooms[0].optionId = value; }
  get selectedWeeks() { return this.quotePlan.courseWeeks; }
  set selectedWeeks(value: number) {
    this.quotePlan.courses[0].weeks = value;
    this.quotePlan.rooms[0].weeks = value;
  }
  get selectedStartDate() { return this.quotePlan.startDate; }
  set selectedStartDate(value: string) {
    this.quotePlan.courses[0].startDate = value;
    this.quotePlan.rooms[0].startDate = value;
  }
  get selectedVisaInitialDays(): 30 | 59 { return this.students[0].visaType === 'tourist30' ? 30 : 59; }
  set selectedVisaInitialDays(value: 30 | 59) { this.students[0].visaType = value === 30 ? 'tourist30' : 'tourist59'; }
  get selectedPickupAirport() { return this.students[0].pickupAirport; }
  set selectedPickupAirport(value: 'none' | 'manila' | 'clark') { this.students[0].pickupAirport = value; }
  get applySnsPromotion() { return this.students[0].applySnsPromotion; }
  set applySnsPromotion(value: boolean) { this.students[0].applySnsPromotion = value; }
  get selectedCourse(): CourseFee { return this.courseFees.find((course) => course.id === this.selectedCourseId) ?? this.courseFees[0]; }
  get selectedRoom(): RoomFee { return this.roomFees.find((room) => room.id === this.selectedRoomId) ?? this.roomFees[0]; }
  get tuitionForSelectedWeeks(): number { return this.students[0].tuition; }
  get roomFeeForSelectedWeeks(): number { return this.students[0].accommodation; }
  get quoteError(): string {
    if (this.quoteMode === 'group' && (!Number.isInteger(this.studentCount) || this.studentCount < 2 || this.studentCount > 20)) return '多人报价人数请选择2–20人的整数。';
    const index = this.activeStudents.findIndex((student) => !!student.quoteError);
    return index < 0 ? '' : `${this.quoteMode === 'group' ? `学生${index + 1}：` : ''}${this.activeStudents[index].quoteError}`;
  }
  get registrationDiscountAmount() { return this.activeStudents.reduce((sum, student) => sum + student.registrationDiscount, 0); }
  get offSeasonCourseDiscountAmount() { return this.activeStudents.reduce((sum, student) => sum + student.offSeasonCourseDiscount, 0); }
  get offSeasonRoomDiscountAmount() { return this.activeStudents.reduce((sum, student) => sum + student.offSeasonRoomDiscount, 0); }
  get snsEligibleBlocks() { return this.students[0].snsEligibleBlocks; }
  get isSnsPromotionEligible() { return this.snsEligibleBlocks > 0; }
  get snsDiscountAmount() { return this.activeStudents.reduce((sum, student) => sum + student.snsDiscount, 0); }
  get isOffSeasonPromotionEligible() { return this.students[0].offSeasonCourseBlocks > 0; }
  get isBreakfastEligible() { return this.students[0].isBreakfastEligible; }
  get totalDiscountAmount() { return this.registrationDiscountAmount + this.offSeasonCourseDiscountAmount + this.offSeasonRoomDiscountAmount + this.snsDiscountAmount; }
  get quoteBeforeDiscounts() { return this.activeStudents.reduce((sum, student) => sum + student.quoteBeforeDiscounts, 0); }
  get quoteUsd() { return this.activeStudents.reduce((sum, student) => sum + student.quoteUsd, 0); }
  get quoteUsdText(): string { return `${this.formatUsd(this.quoteUsd)} 美元`; }
  get quoteCnyText(): string {
    const rounded = Math.round(this.quoteUsd * this.usdToCny);
    return `人民币预计金额：约 ${rounded.toLocaleString('zh-CN')} 元`;
  }
  get exchangeRateSummary(): string {
    if (!this.usingLiveExchangeRate) return `美元金额暂按1美元≈${this.usdToCny}元人民币估算，最终以支付当日汇率为准`;
    return `人民币金额按最新参考汇率预估（${this.exchangeRateDate.replace(/-/g, '/')}），最终以支付当日汇率为准`;
  }

  get visaExtensionCount() { return this.students[0].visaExtensionCount; }
  get textbookQuantity() { return this.students[0].textbookQuantity; }
  get estimatedLocalFees() { return groupLocalFees(this.activeStudents); }
  get includedLocalFees() { return this.estimatedLocalFees; }
  get localFees() { return this.estimatedLocalFees; }
  get localFeeTotal() { return this.estimatedLocalFees.reduce((total, fee) => total + fee.total, 0); }
  get localFeeCny(): number { return Math.round(this.localFeeTotal / this.phpPerCny); }
  get localFeeCnyText(): string {
    return `人民币预计金额：约 ${this.localFeeCny.toLocaleString('zh-CN')} 元`;
  }

  private studentPlanPaymentItems(): QuoteImagePaymentItem[] {
    return this.activeStudents.flatMap((student, studentIndex) => student.quotePlan.paymentItems().map((item) => ({
      ...item,
      label: `${this.quoteMode === 'group' ? `学生${studentIndex + 1} · ` : ''}${item.icon === '课' ? item.label.replace('课程费', '课程名称') : item.label.replace('住宿费', '住宿名称')}`,
    })));
  }
  private groupedPromotionItems(): QuoteImagePaymentItem[] {
    const items = groupPaymentLines(this.activeStudents, true);
    if (this.quoteMode === 'single') return items;
    const participantCountByLabel = new Map<string, number>();
    this.activeStudents.forEach((student) => student.paymentLines.forEach((line) => {
      participantCountByLabel.set(line.label, (participantCountByLabel.get(line.label) ?? 0) + 1);
    }));
    return items.map((item) => {
      const baseLabel = item.label.replace(/^学生\d+\s*·\s*/, '');
      const participantCount = participantCountByLabel.get(baseLabel) ?? 1;
      return participantCount > 1 ? { ...item, label: `${baseLabel}（${participantCount}人合计）` } : item;
    });
  }
  private groupedStatusItems(includeInapplicable: boolean): QuoteImagePaymentItem[] {
    const entries = this.activeStudents.flatMap((student, studentIndex) => student.statusLines
      .filter((item) => includeInapplicable || item.amount !== '未适用')
      .map((item) => ({ item, studentNumber: studentIndex + 1 })));
    if (this.quoteMode === 'single') return entries.map(({ item }) => item);
    const groups = new Map<string, { item: QuoteImagePaymentItem; students: number[] }>();
    entries.forEach(({ item, studentNumber }) => {
      const key = JSON.stringify([item.label, item.amount, item.note]);
      const existing = groups.get(key);
      if (existing) existing.students.push(studentNumber);
      else groups.set(key, { item: { ...item }, students: [studentNumber] });
    });
    return [...groups.values()].map(({ item, students }) => {
      const allStudents = students.length === this.activeStudents.length;
      return {
        ...item,
        label: allStudents ? `${item.label}（${students.length}人）` : `学生${students.join('、')} · ${item.label}`,
        note: `${allStudents ? `${students.length}人均${item.amount}` : `学生${students.join('、')}${item.amount}`}；${item.note}`,
      };
    });
  }
  get schoolPaymentItems(): QuoteImagePaymentItem[] {
    return [
      { icon: '注', label: '注册费', amount: `${this.formatUsd(this.registrationFee * this.activeStudents.length)} 美元`, note: `100美元／人，一次性费用；本次共${this.activeStudents.length}人。` },
      ...this.studentPlanPaymentItems(),
      ...this.groupedPromotionItems(),
      ...this.groupedStatusItems(true),
    ];
  }

  get optionalFeeItems(): QuoteImageOptionalFeeItem[] {
    const roomDeposit = this.activeStudents.reduce((sum, student) => sum + student.roomDeposit, 0);
    const mealQuantity = this.activeStudents.reduce((sum, student) => sum + student.mealQuantity, 0);
    const meals = this.activeStudents.reduce((sum, student) => sum + student.mealEstimate, 0);
    return [
      { label: '房间押金', amount: this.formatPhp(roomDeposit), cnyAmount: `约 ${Math.round(roomDeposit / this.phpPerCny).toLocaleString('zh-CN')} 元`, note: `4,000比索／人 × ${this.activeStudents.length}；无损坏及欠费时毕业可退，不计入学杂费合计。` },
      { label: '餐费', amount: this.formatPhp(meals), cnyAmount: `约 ${Math.round(meals / this.phpPerCny).toLocaleString('zh-CN')} 元`, note: `14,000比索／4周 × ${this.formatFeeQuantity(mealQuantity)}；约150–250比索／餐，按实际点餐付费，不计入学杂费合计。` },
    ];
  }

  get quoteHeading() { return this.quoteMode === 'single' ? `MONOL ${this.selectedWeeks}周报价` : `MONOL ${this.activeStudents.length}人报价`; }
  get quoteStartDate() { return this.activeStudents.map((student) => student.quotePlan.startDate).filter(Boolean).sort()[0] ?? this.selectedStartDate; }

  get quoteImageData() {
    const quote = buildPhilippinesDetailedQuote({
      schoolCode: 'MONOL',
      schoolName: '菲律宾碧瑶MONOL语言学校',
      filePrefix: 'MONOL',
      heroSrc: '/assets/philippines/monol-campus-building.jpg',
      weeks: this.selectedWeeks,
      startDate: this.quoteStartDate,
      usdToCny: this.usdToCny,
      totalUsd: this.quoteUsd,
      paymentItems: [
        this.schoolPaymentItems[0],
        ...this.studentPlanPaymentItems(),
        ...this.groupedPromotionItems(),
        ...this.groupedStatusItems(false),
      ],
      localFeeItems: this.estimatedLocalFees.map((fee) => ({
        label: fee.item,
        unit: fee.unitLabel,
        quantity: this.formatFeeQuantity(fee.quantity),
        amount: this.formatPhp(fee.total),
        note: fee.note,
      })),
      localFeeTotal: this.localFeeTotal,
      localCurrencyName: '比索',
      localFeeCny: this.localFeeCny,
      localFeeNote: '房间押金与餐费另行准备，不计入学杂费及人民币预估合计。',
      optionalFeeItems: this.optionalFeeItems,
      ruleNotes: this.quoteGeneralNotes,
      fullFeeDetails: true,
      localFeeTableLayout: 'web',
    });
    return {
      ...applySchoolQuoteImageLayout(quote, 'MONOL', this.selectedWeeks, this.quoteStartDate, this.quoteUsd, this.usdToCny),
      headingText: this.quoteHeading,
      fileName: `${this.quoteHeading.replace(/\s+/g, '')}-${this.quoteStartDate.replace(/-/g, '')}.png`,
      importantNotes: this.quoteGeneralNotes,
      conversionRates: { usdToCny: this.usdToCny, phpPerCny: this.phpPerCny, date: this.exchangeRateDate || undefined },
      exchangeRateText: `学杂费按1元人民币≈${this.phpPerCny}比索估算`,
    };
  }

  formatUsd(value: number): string {
    return value.toLocaleString('en-US', { minimumFractionDigits: Number.isInteger(value) ? 0 : 1, maximumFractionDigits: 1 });
  }
  formatPhp(value: number): string { return `${value.toLocaleString('en-US', { maximumFractionDigits: 0 })} 比索`; }
  formatFeeQuantity(value: number): string {
    return value.toLocaleString('zh-CN', { minimumFractionDigits: Number.isInteger(value) ? 0 : 1, maximumFractionDigits: 2 });
  }
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

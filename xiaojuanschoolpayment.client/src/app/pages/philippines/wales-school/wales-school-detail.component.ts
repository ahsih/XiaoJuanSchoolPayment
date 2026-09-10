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
import { groupLocalFees, groupPaymentLines } from '../../../components/school-group-quote';
import {
  QuoteImageDownloadButtonComponent,
  QuoteImageOptionalFeeItem,
  QuoteImagePaymentItem,
} from '../../../components/quote-image-download-button.component';
import { applySchoolQuoteImageLayout } from '../../../components/school-quote-plan';
import { SchoolQuotePlanComponent } from '../../../components/school-quote-plan.component';
import { WalesCoursePrice, WalesQuotePrices, WalesRoomPrice, WalesStudentQuote } from './wales-student-quote';

type GalleryCategory = '全部' | '校区' | '教室' | '住宿' | '餐厅' | '设施';

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
interface SidaWalesReason { number: string; title: string; text: string; image: string; alt: string; }
interface SidaWalesTrustBadge { icon: string; label: string; }

@Component({
  selector: 'app-wales-school-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule, QuoteImageDownloadButtonComponent, SchoolQuotePlanComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './wales-school-detail.component.html',
  styleUrls: [
    '../cebu-school-detail-layout.css',
    '../cebu-school-detail-content.css',
    '../cebu-school-detail-responsive.css',
    '../ev-school/ev-school-detail.component.css',
    '../school-quote-rollout.css',
    '../philippines-local-fee-table.css',
    '../../../components/school-group-quote.css',
    './wales-school-detail.component.css',
  ],
})
export class WalesSchoolDetailComponent implements OnInit, WalesQuotePrices {
  private readonly schoolService = inject(SchoolService);
  private readonly exchangeRateService = inject(ExchangeRateService);
  private readonly pricingSchoolSearchName = 'WALES';
  private readonly pricingSchoolNames = ['菲律宾碧瑶WALES语言学校', 'WALES Academy', 'Widest Asian Learners English School Inc.', 'WALES'];
  private readonly courseFeeOrder = [
    'eep-lite',
    'eep',
    'infinity-lite',
    'infinity-standard',
    'infinity-intensive',
    'infinity-pro',
    'pte',
    'ielts',
    'ielts-guarantee',
    'junior-esl',
    'junior-ielts',
  ];
  private readonly roomFeeOrder = [
    'lower-studio-single',
    'lower-studio-family-2',
    'upper-studio-single',
    'upper-studio-family-2',
    'upper-premium-studio-single',
    'upper-premium-studio-double',
    'upper-premium-studio-family-3',
    'condo-type-semi-single',
    'condo-type-family-3',
    'condo-type-family-4',
    'share-type-single-veranda',
    'share-type-single',
    'share-type-double',
    'lower-premium-studio-single',
    'lower-premium-studio-double',
    'lower-premium-studio-family-3',
  ];

  readonly galleryCategories: GalleryCategory[] = ['全部', '校区', '教室', '住宿', '餐厅', '设施'];
  selectedGalleryCategory: GalleryCategory = '全部';
  registrationFee = 100;
  usdToCny = 7.2;
  phpPerCny = 9;
  exchangeRateDate = '';
  usingLiveExchangeRate = false;
  readonly weekOptions = [4, 6, 8, 12, 16, 20, 24];
  quoteCalculated = false;
  quoteMode: 'single' | 'group' = 'single';
  private requestedStudentCount = 2;

  readonly quickInfo: QuickInfo[] = [
    { icon: 'terrain', label: '城市', value: '碧瑶 Baguio', note: 'Legarda Road市区生活圈，步行可到餐厅、商场、ATM等生活机能。' },
    { icon: 'groups', label: '学校规模', value: '约80名学生', note: '小校容量让老师与学校人员更容易照顾个别需求。' },
    { icon: 'school', label: '课程方向', value: 'EEP / Infinity / PTE / IELTS / Junior', note: '2026价表共列11门课程，从轻量英文到考试与青少年方向。' },
    { icon: 'bed', label: '住宿', value: '16种房型', note: 'Lower/Upper Studio、Premium Studio、Condo与Share Type按每人计价。' },
    { icon: 'local_offer', label: '年末优惠', value: '指定入学日住宿六折', note: '2026/11/29入学4或6周、12/13入学4周；限10名，须确认名额。' },
    { icon: 'payments', label: '费用参考', value: 'WALES 2026价表', note: '课程、住宿、报名费与到校比索费用已按本次学校资料同步。' },
  ];

  readonly galleryImages: GalleryImage[] = [
    { category: '校区', title: 'WALES校舍外观', description: 'WALES官方网站展示的Baguio校舍，学校位于Legarda Road生活圈。', src: 'assets/philippines/wales-school-building.webp' },
    { category: '设施', title: 'WALES校内设施', description: '官方Facility页面展示的校内学习与生活空间，学校楼层内集中安排教室、办公室和餐厅。', src: 'assets/philippines/wales-facility-main.webp' },
    { category: '教室', title: '一对一玻璃隔间教室', description: 'WALES官方Classrooms页面展示的一对一教室，隔间式空间利于集中上课。', src: 'assets/philippines/wales-classroom.webp' },
    { category: '教室', title: '团体与功能教室', description: '团体课用于讨论、听力、发音、商务表达和考试技能训练。', src: 'assets/philippines/wales-classroom-group.webp' },
    { category: '住宿', title: 'Studio房型', description: 'WALES官方Studio Type页面展示的单人房型，适合重视隐私和学习空间的学生。', src: 'assets/philippines/wales-studio-room.webp' },
    { category: '住宿', title: 'Premium Studio房型', description: 'Premium Studio配有更完整的生活设备，适合成人、家庭或长期学习需求。', src: 'assets/philippines/wales-premium-studio-room.webp' },
    { category: '住宿', title: 'Condo房型', description: 'Condo Type适合希望有公寓式生活空间、厨房设备和更强生活机能的学生。', src: 'assets/philippines/wales-condo-room.webp' },
    { category: '住宿', title: 'Share Type房型', description: 'Share Type适合想兼顾预算、室友互动和生活设备的学生。', src: 'assets/philippines/wales-share-room.webp' },
    { category: '餐厅', title: 'WALES Cafeteria', description: '官方Facility页面展示的餐厅空间，正式报价时需把餐费和饮食需求一起确认。', src: 'assets/philippines/wales-cafeteria.webp' },
  ];

  readonly basicInfo: BasicInfoRow[] = [
    { label: '学校名称', value: '菲律宾碧瑶WALES语言学校' },
    { label: '英文名称', value: 'WALES Academy / Widest Asian Learners English School Inc.' },
    { label: '创校时间', value: '2006年从青少年学院起步，之后扩展ESL、TOEIC、TOEFL、IELTS等课程' },
    { label: '地址', value: '#4 Bukaneg St., Legarda Rd., Baguio City, the Philippines' },
    { label: '学校容量', value: '约80名学生' },
    { label: '课程方向', value: 'EEP、Infinity、PTE、IELTS、IELTS Guarantee、Junior ESL、Junior IELTS' },
    { label: '房型方向', value: 'Lower/Upper Studio、Upper/Lower Premium Studio、Condo Type、Share Type，共16种' },
    { label: '报价说明', value: '课程费、住宿费、100美元报名费和到校比索费用均按2026年9月收到的学校价表更新' },
  ];

  readonly highlights: Highlight[] = [
    { image: 'assets/philippines/wales-school-building.webp', title: '小校容量，照顾更细', text: 'WALES容量约80名学生，适合希望学校人员更容易认识学生、学习和生活问题能快速沟通的人。' },
    { image: 'assets/philippines/wales-classroom.webp', title: '一对一隔间教室', text: '官方Classrooms页面展示的一对一玻璃隔间，让学生能在较安静的环境里集中练习与纠错。' },
    { image: 'assets/philippines/wales-cafeteria.webp', title: '餐厅空间清楚可见', text: '报名时要把meal fee和饮食需求一起确认，官方餐厅照片能帮助学生先判断日常用餐环境。' },
    { image: 'assets/philippines/wales-condo-room.webp', title: '房型选择生活化', text: 'Studio、Premium Studio、Share和Condo房型让WALES更适合重视隐私、厨房设备、网络和生活机能的学生。' },
  ];

  readonly suitableFor: FitItem[] = [
    { title: '成人、工作者或打工度假准备', text: 'EEP和Infinity方向适合把英文用在旅行、工作、生活沟通和综合能力提升上。' },
    { title: '想在碧瑶但不想过强斯巴达', text: 'WALES更偏小校、便利和弹性节奏，适合能自律复习、但不想被高压制度推满一天的人。' },
    { title: '重视房型隐私和生活机能', text: 'Studio、Premium Studio与Condo房型适合长期学习、家庭同行或希望住宿更像生活空间的人。' },
    { title: '亲子或青少年方向', text: 'Junior ESL、Junior IELTS和家庭同行需要先确认年龄、监护、房型和入学日期。' },
  ];

  readonly notSuitableFor: FitItem[] = [
    { title: '需要强制自习和严格门禁推动', text: '如果学习动力主要靠制度，建议同步比较PINES、JIC Challenger或BECI Sparta。' },
    { title: '只看最低价格', text: 'WALES房型差距明显，且meal fee、报名费、当地费用和空房都需要单独确认，不能只看课程费。' },
    { title: '想要大型校园和丰富校内活动', text: 'WALES是小型学校，优势在便利和个别照顾，不是大型度假校园。' },
    { title: '无法接受市区生活诱惑', text: '市区便利也意味着外出选择更多，学生需要能管理好学习和生活边界。' },
  ];

  readonly courses: CourseItem[] = [
    { name: 'EEP Lite / EEP', type: '生活沟通英文', lessons: 'EEP Lite：3节一对一；EEP：4节一对一 + 1节团体课', suitable: '适合生活口语、旅行、工作及日常沟通基础提升。' },
    { name: 'Infinity Lite / Standard', type: '综合ESL', lessons: 'Lite：3节一对一 + 1节团体课；Standard：4节一对一 + 2节团体课', suitable: '按学习基础与每日课量选择，兼顾听说读写。' },
    { name: 'Infinity Intensive / Pro', type: '高强度综合英文', lessons: 'Intensive：5节一对一 + 3节团体课；Pro：4节一对一 + 3节团体课', suitable: '适合希望增加训练密度或有明确进阶目标的学生。' },
    { name: 'PTE / IELTS', type: '考试准备', lessons: 'PTE与IELTS：5节一对一 + 2节团体课', suitable: 'PTE仅列4、8、12周；IELTS词汇课周一至周四进行，周五安排文章练习。' },
    { name: 'IELTS Guarantee', type: '雅思保证班', lessons: '6节一对一 + 2节团体课，8周起', suitable: '另计18,000比索IELTS考试及当地费用；保证条件以学校书面规则为准。' },
    { name: 'Junior ESL / Junior IELTS', type: '青少年课程', lessons: 'Junior ESL：5节一对一 + 3节团体课；Junior IELTS：5节一对一 + 2节团体课', suitable: '须同步确认年龄、监护规则、房型和入学日。' },
  ];

  courseFees: WalesCoursePrice[] = [
    { id: 'eep-lite', name: 'EEP Lite', tuition: 650, suitable: '3节一对一', note: '轻量生活沟通英文' },
    { id: 'eep', name: 'EEP', tuition: 800, suitable: '4节一对一 + 1节团体课', note: '生活口语与基础沟通' },
    { id: 'infinity-lite', name: 'Infinity Lite', tuition: 750, suitable: '3节一对一 + 1节团体课', note: '听说读写基础提升' },
    { id: 'infinity-standard', name: 'Infinity Standard', tuition: 880, suitable: '4节一对一 + 2节团体课', note: '综合英文标准强度' },
    { id: 'infinity-intensive', name: 'Infinity Intensive', tuition: 1000, suitable: '5节一对一 + 3节团体课', note: '综合英文高强度训练' },
    { id: 'infinity-pro', name: 'Infinity Pro', tuition: 1200, suitable: '4节一对一 + 3节团体课', note: '高阶目标导向课程' },
    { id: 'pte', name: 'Pearson Test of English (PTE)', tuition: 1200, suitable: '5节一对一 + 2节团体课', note: '仅开放4、8、12周；另有PTE模拟考试及当地费用', maxWeeks: 12 },
    { id: 'ielts', name: 'IELTS', tuition: 1200, suitable: '5节一对一 + 2节团体课', note: '雅思词汇课为周一至周四，周五安排文章练习' },
    { id: 'ielts-guarantee', name: 'IELTS Guarantee', tuition: 1300, suitable: '6节一对一 + 2节团体课', note: '8周起；雅思词汇课为周一至周四，周五安排文章练习', minWeeks: 8 },
    { id: 'junior-esl', name: 'Junior ESL', tuition: 1300, suitable: '5节一对一 + 3节团体课', note: '青少年ESL课程，年龄及监护要求须确认' },
    { id: 'junior-ielts', name: 'Junior IELTS', tuition: 1400, suitable: '5节一对一 + 2节团体课', note: '青少年IELTS课程，目标分数及监护要求须确认' },
  ];

  roomFees: WalesRoomPrice[] = [
    { id: 'lower-studio-single', name: 'Lower Studio｜单人房', fee: 1200, note: '书桌、衣柜、冰箱、保险箱及独立卫浴；无厨房且不可烹饪' },
    { id: 'lower-studio-family-2', name: 'Lower Studio｜家庭2人房', fee: 900, note: '按每人4周计价；书桌、衣柜、冰箱、保险箱及独立卫浴；无厨房' },
    { id: 'upper-studio-single', name: 'Upper Studio｜单人房', fee: 1300, note: '书桌、衣柜、冰箱、保险箱及独立卫浴；无厨房且不可烹饪' },
    { id: 'upper-studio-family-2', name: 'Upper Studio｜家庭2人房', fee: 1000, note: '按每人4周计价；书桌、衣柜、冰箱、保险箱及独立卫浴；无厨房' },
    { id: 'upper-premium-studio-single', name: 'Upper Premium Studio｜单人房', fee: 1700, note: '一房一厅，配简易厨房、基本餐具、小冰箱、微波炉、热水壶、电视及保险箱' },
    { id: 'upper-premium-studio-double', name: 'Upper Premium Studio｜双人房', fee: 1200, note: '按每人4周计价；一房一厅并配简易厨房及生活设备' },
    { id: 'upper-premium-studio-family-3', name: 'Upper Premium Studio｜家庭3人房', fee: 1030, note: '按每人4周计价；一房一厅并配简易厨房及生活设备' },
    { id: 'condo-type-semi-single', name: 'Condo Type｜半单人房', fee: 1400, note: '公寓式房型；具体卫浴、厨房及床位安排以校方确认房间为准' },
    { id: 'condo-type-family-3', name: 'Condo Type｜家庭3人房', fee: 1080, note: '按每人4周计价；公寓式房型，具体设施以校方确认为准' },
    { id: 'condo-type-family-4', name: 'Condo Type｜家庭4人房', fee: 1075, note: '按每人4周计价；公寓式房型，具体设施以校方确认为准' },
    { id: 'share-type-single-veranda', name: 'Share Type｜单人房（露台）', fee: 1150, note: '顶层复式共享住宅，共4至5间卧室、2间卫浴，共用餐厅、客厅及厨房' },
    { id: 'share-type-single', name: 'Share Type｜单人房', fee: 1050, note: '顶层复式共享住宅，共4至5间卧室、2间卫浴，共用餐厅、客厅及厨房' },
    { id: 'share-type-double', name: 'Share Type｜双人房', fee: 950, note: '按每人4周计价；顶层复式共享住宅，共用卫浴、餐厅、客厅及厨房' },
    { id: 'lower-premium-studio-single', name: 'Lower Premium Studio｜单人房', fee: 1600, note: '一房一厅，配简易厨房、基本餐具、小冰箱、微波炉、热水壶、电视及保险箱' },
    { id: 'lower-premium-studio-double', name: 'Lower Premium Studio｜双人房', fee: 1100, note: '按每人4周计价；一房一厅并配简易厨房及生活设备' },
    { id: 'lower-premium-studio-family-3', name: 'Lower Premium Studio｜家庭3人房', fee: 930, note: '按每人4周计价；一房一厅并配简易厨房及生活设备' },
  ];

  readonly students: WalesStudentQuote[] = [new WalesStudentQuote(this)];

  readonly schedule: ScheduleItem[] = [
    { time: '07:00 - 08:00', title: '早餐 / 个人准备', text: '实际餐食安排和费用需按当期报价确认，建议把饮食需求提前告诉顾问。' },
    { time: '08:00 - 12:00', title: '上午一对一与团体课', text: '按EEP、Infinity、IELTS或Junior课程安排听说读写、发音、语法和考试训练。' },
    { time: '12:00 - 13:00', title: '午餐与短休', text: 'WALES位于市区生活圈，周边用餐和生活采购便利度较高。' },
    { time: '13:00 - 17:00', title: '下午课程与反馈', text: 'Infinity和IELTS课程会按目标调整一对一科目和团体课重点。' },
    { time: '17:00 - 22:00', title: '复习 / 生活安排', text: 'WALES不是典型高压斯巴达，晚间学习效率更依赖学生自律和顾问前期匹配。' },
    { time: '周末', title: '碧瑶市区生活', text: '可安排Burnham Park、SM Baguio、夜市、咖啡厅或短途活动，仍需遵守学校规定。' },
  ];

  readonly serviceSteps: ProcessStep[] = [
    { icon: 'person_search', title: '先判断是否适合WALES', text: '确认学生是否适合小校、市区、弹性节奏和生活化房型，而不是只按热门校名推荐。' },
    { icon: 'fact_check', title: '确认课程与房型', text: '免费协助核对EEP、Infinity、IELTS、Junior课程，房型空位、餐费、优惠和正式报价。' },
    { icon: 'assignment_turned_in', title: '协助报名文件', text: '按学校流程准备报名信息、入学日期、护照资料、航班和付款节点。' },
    { icon: 'inventory', title: '发送行前清单', text: '出发前提醒菲律宾入境、签证、行李、换汇、接机、到校费用和学习准备。' },
    { icon: 'support_agent', title: '到校后继续跟进', text: '如遇到调课、房间、费用或生活适应问题，可继续联系思达协助沟通。' },
    { icon: 'location_on', title: '国内顾问与当地协作', text: '国内顾问与菲律宾当地工作人员协作，重要节点持续跟进。' },
  ];

  readonly sidaWalesReasons: SidaWalesReason[] = [
    { number: '01', title: '先把WALES放进正确比较组', text: '会把它和MONOL、BECI City、JIC Premium等更弹性的碧瑶学校一起比较，而不是只看城市。', image: 'assets/cia/sida-why-action-selection.webp', alt: '思达顾问帮助学生判断WALES是否适合' },
    { number: '02', title: '课程、房型、餐费和当地费用一次算清', text: 'WALES费用需要拆成课程、住宿、meal fee、当地PHP费用和优惠，顾问会逐项列明。', image: 'assets/cia/sida-why-action-fees.webp', alt: '思达顾问核算菲律宾碧瑶WALES语言学校费用' },
    { number: '03', title: '正式文件与收费节点可核对', text: '报价、录取、付款节点和学校确认文件都按流程核验，避免只靠网页价格做决定。', image: 'assets/cia/sida-why-action-contract.webp', alt: '思达正式合同与学校文件核验' },
    { number: '04', title: '出发前每一步有人提醒', text: '签证、eTravel、入学文件、航班、接机、换汇和到校PHP费用都会提前提醒。', image: 'assets/cia/sida-why-action-departure.webp', alt: '菲律宾游学出发前文件和行李准备' },
    { number: '05', title: '服务持续到完成学习', text: '换老师、调课、住宿、账单、续读或转校问题都可以继续协助沟通。', image: 'assets/cia/sida-why-action-followup.webp', alt: '思达顾问持续跟进学生学习情况' },
    { number: '06', title: '深圳总部 + 菲律宾当地支持', text: '国内顾问与菲律宾当地工作人员协作，遇到重要节点有人跟进。', image: 'assets/cia/sida-why-action-team.webp', alt: '思达启航菲律宾和深圳服务团队' },
  ];

  readonly sidaWalesTrustBadges: SidaWalesTrustBadge[] = [
    { icon: 'description', label: '国内正式公司合同' },
    { icon: 'verified_user', label: '学校合作与文件核验' },
    { icon: 'local_offer', label: '费用透明与同条件保价' },
    { icon: 'apartment', label: '深圳总部 + 菲律宾支持' },
  ];

  readonly schoolServices = ['机场接送确认', '入学说明', '分级测试', '课程咨询', '学习跟进', '房型确认', '生活适应', '签证协助', '费用核对', '顾问跟进'];
  readonly campusActivities = ['新生说明会', '英语口语活动', 'IELTS阶段训练', '生活英文实践', '学生交流活动'];
  readonly weekendActivities = ['SM Baguio', 'Burnham Park', 'Baguio夜市', 'Session Road咖啡厅', 'Camp John Hay'];
  readonly notes = [
    'WALES课程费和住宿费分开列示，本页默认按4周 EEP Lite + Share Type双人房估算。',
    '2026价表列示一次性报名费100美元；课程与住宿通常以4周价格为基础。',
    'PTE仅开放4、8、12周；IELTS Guarantee从8周起，计算器会阻止不适用的周数。',
    '2026/11/29入学4或6周、2026/12/13入学4周可申请住宿费六折；所有房型适用，但限10名、在校生不适用且不得与其他优惠叠加。',
    '长周数优惠为8/12/16/20/24周分别减200/300/400/550/700美元；旺季每重叠2周减少50美元优惠。',
    '到校费用以比索支付，教材、接机和PTE/IELTS Guarantee课程专属费用需在基础学杂费外按实际选择计入。',
    '最终报名以学校正式录取、付款节点、优惠有效期和顾问确认报价为准。',
  ];
  readonly faqs: FaqItem[] = [
    { question: '菲律宾碧瑶WALES语言学校是斯巴达学校吗？', answer: '不是典型高压斯巴达。WALES更适合小校、市区便利、成人友好和相对弹性的学习节奏；如果需要强制自习和严格门禁，应同步比较PINES、JIC Challenger或BECI Sparta。' },
    { question: 'WALES适合零基础学生吗？', answer: '可以优先看EEP、EEP Lite或Infinity Lite。报名时建议先说明英文基础、学习周数和目标，顾问会帮你判断是否需要更高课时的Infinity路线。' },
    { question: '页面报价包含哪些费用？', answer: '学校付款金额包含100美元报名费、所选课程、住宿及适用优惠；到校学杂费按课程、周数和接机选择另表估算。餐费未列入本次学校2026价表，须另行确认。' },
    { question: 'WALES年末住宿六折如何计算？', answer: '2026年11月29日入学的4或6周，或12月13日入学的4周，所有房型可申请住宿费六折；限10名，在校生不适用，不与其他优惠叠加，最终须由学校确认名额。' },
    { question: 'WALES长周数优惠如何计算？', answer: '注册日在2025年8月1日或之后，并选择公告列明的BESA四周一期开学日（网页按前一天周日抵达）时，8/12/16/20/24周分别减200/300/400/550/700美元；若与2026年6月28日至8月8日旺季重叠，每满2周减少50美元优惠。' },
    { question: 'WALES的房型怎么选？', answer: '预算优先可先看Share Type双人房或家庭房；重视隐私可看Studio单人房，重视生活设备可看Premium Studio。热门档期须尽早确认空房。' },
    { question: 'WALES适合亲子吗？', answer: '可以进入候选，尤其是重视房型和市区便利的家庭。但要先确认儿童年龄、家长课程、监护规则、房型和餐费。' },
    { question: '思达会怎么建议WALES？', answer: '如果学生是成人、工作者、家庭或想在市中心附近轻松但认真地学英文，WALES值得比较；若目标是短期高压冲刺分数，则建议同时看更强管理的碧瑶学校。' },
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
          schools.find((item) => item.name.toUpperCase().includes('WALES')) ??
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
        const id = this.courseIdFromName(lesson.name);
        const catalog = this.courseFees.find((course) => course.id === id);
        return {
          id,
          name: catalog?.name ?? lesson.name,
          tuition: lesson.price,
          suitable: catalog?.suitable ?? lesson.description ?? '请联系顾问确认课程安排',
          note: catalog?.note ?? lesson.note ?? '',
          minWeeks: catalog?.minWeeks,
          maxWeeks: catalog?.maxWeeks,
        };
      })
      .sort((a, b) => this.orderIndex(this.courseFeeOrder, a.id) - this.orderIndex(this.courseFeeOrder, b.id));
    if (this.courseFeeOrder.every((id) => databaseCourseFees.some((course) => course.id === id))) {
      this.courseFees = databaseCourseFees.filter((course) => this.courseFeeOrder.includes(course.id));
    }

    const databaseRoomFees = rooms
      .filter((room) => room.week === 4)
      .map((room) => {
        const id = this.slugifyPriceKey(room.name);
        const catalog = this.roomFees.find((item) => item.id === id);
        return { id, name: catalog?.name ?? room.name, fee: room.price, note: catalog?.note ?? room.description ?? '' };
      })
      .sort((a, b) => this.orderIndex(this.roomFeeOrder, a.id) - this.orderIndex(this.roomFeeOrder, b.id));
    if (this.roomFeeOrder.every((id) => databaseRoomFees.some((room) => room.id === id))) {
      this.roomFees = databaseRoomFees.filter((room) => this.roomFeeOrder.includes(room.id));
    }

    const registrationFee = fees.find((fee) => (fee.name === '注册费' || fee.name === '报名费') && fee.fee > 0);
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
  get studentCount(): number { return this.requestedStudentCount; }
  set studentCount(value: number) {
    this.requestedStudentCount = value;
    if (Number.isInteger(value) && value >= 2 && value <= 20) {
      while (this.students.length < value) this.students.push(new WalesStudentQuote(this));
    }
  }
  setQuoteMode(value: 'single' | 'group'): void {
    this.quoteMode = value;
    if (value === 'group') this.studentCount = this.requestedStudentCount;
  }
  get activeStudents(): WalesStudentQuote[] {
    return this.quoteMode === 'single'
      ? this.students.slice(0, 1)
      : this.students.slice(0, Math.max(2, Math.min(20, Math.floor(this.studentCount) || 2)));
  }
  get quotePlan() { return this.students[0].quotePlan; }
  get selectedWeeks(): number { return this.quotePlan.courseWeeks; }
  get selectedStartDate(): string { return this.quotePlan.startDate; }
  get quoteHeading(): string {
    return this.quoteMode === 'single' ? `WALES ${this.selectedWeeks}周报价` : `WALES ${this.activeStudents.length}人报价`;
  }
  get startingQuoteUsd(): number {
    const tuition = this.courseFees.find((course) => course.id === 'eep-lite')?.tuition ?? 650;
    const room = this.roomFees.find((item) => item.id === 'share-type-double')?.fee ?? 950;
    return this.registrationFee + tuition + room;
  }
  get startingQuoteCnyText(): string {
    const rounded = Math.round((this.startingQuoteUsd * this.usdToCny) / 100) * 100;
    return `人民币预计金额：约 ${rounded.toLocaleString('zh-CN')} 元`;
  }
  get quoteError(): string {
    if (this.quoteMode === 'group' && (!Number.isInteger(this.studentCount) || this.studentCount < 2 || this.studentCount > 20)) {
      return '多人报价人数请选择2–20人的整数。';
    }
    const index = this.activeStudents.findIndex((student) => !!student.quoteError);
    return index < 0 ? '' : `${this.quoteMode === 'group' ? `学生${index + 1}：` : ''}${this.activeStudents[index].quoteError}`;
  }
  get quoteUsd(): number {
    return this.activeStudents.reduce((sum, student) => sum + student.quoteUsd, 0);
  }
  get quoteUsdText(): string { return `${this.formatUsd(this.quoteUsd)} 美元`; }
  get quoteCnyText(): string {
    const rounded = Math.round((this.quoteUsd * this.usdToCny) / 100) * 100;
    return `人民币预计金额：约 ${rounded.toLocaleString('zh-CN')} 元`;
  }
  get exchangeRateSummary(): string {
    return `${this.usingLiveExchangeRate ? `参考汇率日期 ${this.exchangeRateDate}` : '备用汇率估算'}：1美元≈${this.usdToCny.toLocaleString('zh-CN', { maximumFractionDigits: 6 })}元人民币，1元人民币≈${this.phpPerCny.toLocaleString('zh-CN', { maximumFractionDigits: 6 })}比索；以支付当日汇率为准。`;
  }
  get localFees() {
    const grouped = groupLocalFees(this.activeStudents);
    if (this.quoteMode === 'single') return grouped;
    const everyone = `学生${this.activeStudents.map((_, index) => index + 1).join('、')} · `;
    return grouped.map((fee) => ({
      ...fee,
      item: /^学生[\d、]+ · /.test(fee.item) ? fee.item : `${everyone}${fee.item}`,
    }));
  }
  get localFeeTotal(): number { return this.localFees.reduce((sum, fee) => sum + fee.total, 0); }
  get localFeeCny(): number { return Math.round(this.localFeeTotal / this.phpPerCny); }
  get optionalFeeItems(): QuoteImageOptionalFeeItem[] {
    return [
      { label: '追加一对一（EEP / Infinity）', amount: '7,000 比索／4周', cnyAmount: `约人民币 ${Math.round(7000 / this.phpPerCny).toLocaleString('zh-CN')} 元`, note: '按需申请；是否有名额及具体课程安排以学校为准。' },
      { label: '追加一对一（IELTS）', amount: '8,000 比索／4周', cnyAmount: `约人民币 ${Math.round(8000 / this.phpPerCny).toLocaleString('zh-CN')} 元`, note: '按需申请；是否有名额及具体课程安排以学校为准。' },
      { label: '追加一对一（Junior）', amount: '9,000 比索／4周', cnyAmount: `约人民币 ${Math.round(9000 / this.phpPerCny).toLocaleString('zh-CN')} 元`, note: '按需申请；年龄及课程安排须由学校确认。' },
      { label: '追加团体课（EEP / Infinity）', amount: '5,000 比索／4周', cnyAmount: `约人民币 ${Math.round(5000 / this.phpPerCny).toLocaleString('zh-CN')} 元`, note: '按需申请；是否开班以学校为准。' },
      { label: '延住宿参考', amount: 'Share 1,000／其他2,000 比索／晚', cnyAmount: `约人民币 ${Math.round(1000 / this.phpPerCny).toLocaleString('zh-CN')}／${Math.round(2000 / this.phpPerCny).toLocaleString('zh-CN')} 元`, note: '均不含餐；须确认延住空房。' },
    ];
  }

  get schoolPaymentItems(): QuoteImagePaymentItem[] {
    return [
      {
        icon: '注', label: '报名费', amount: `${this.formatUsd(this.registrationFee * this.activeStudents.length)} 美元`,
        note: `${this.registrationFee}美元／人；本次${this.activeStudents.length}人均计收。\n${this.studentProfileNotes.join('\n')}`,
      },
      ...(['课', '宿'] as const).flatMap((icon) => this.activeStudents.flatMap((student, studentIndex) =>
        student.quotePlan.paymentItems().filter((item) => item.icon === icon).map((item) => ({
          ...item,
          label: `${this.quoteMode === 'group' ? `学生${studentIndex + 1} · ` : ''}${item.label.replace(/^课程费/, '课程名称').replace(/^住宿费/, '住宿名称')}`,
        })))),
      ...groupPaymentLines(this.activeStudents, true),
    ];
  }
  get studentProfileNotes(): string[] {
    return this.activeStudents.map((student, index) =>
      `${this.quoteMode === 'group' ? `学生${index + 1}：` : ''}${student.age}岁｜${this.statusLabel(student)}｜报名日${student.selectedRegistrationDate.replace(/-/g, '/')}｜${student.visaLabel}｜${student.pickupLabel}`);
  }
  get localFeeIntro(): string {
    return this.quoteMode === 'single'
      ? `按本学生${this.quotePlan.stayWeeks}周完整停留跨度、${this.students[0].visaLabel}、全部课程与住宿行分别计算；含教材、所选接机、课程专属费用及可退宿舍保证金。`
      : `先按${this.activeStudents.length}名学生各自的停留跨度、签证、课程、住宿和接机分别计算，再按相同规则汇总；不同规则会保留学生编号。`;
  }

  get quoteImageData() {
    const quote = buildPhilippinesDetailedQuote({
      schoolCode: 'WALES',
      schoolName: '菲律宾碧瑶WALES语言学校',
      filePrefix: 'WALES',
      heroSrc: '/assets/philippines/wales-school-building.webp',
      weeks: this.selectedWeeks,
      startDate: this.selectedStartDate,
      usdToCny: this.usdToCny,
      totalUsd: this.quoteUsd,
      paymentItems: this.schoolPaymentItems,
      localFeeItems: this.localFees.map((fee) => ({ label: fee.item, unit: fee.unitLabel, quantity: this.formatFeeQuantity(fee.quantity), amount: this.formatPhp(fee.total), note: fee.note })),
      localFeeTotal: this.localFeeTotal,
      localCurrencyName: '比索',
      localFeeCny: this.localFeeCny,
      localFeeNote: this.localFeeIntro,
      optionalFeeItems: this.optionalFeeItems,
      ruleNotes: [],
      fullFeeDetails: true,
      localFeeTableLayout: 'web',
    });
    const result = applySchoolQuoteImageLayout({
      ...quote,
      importantNotes: this.quoteImageNotes,
    }, 'WALES', this.selectedWeeks, this.selectedStartDate, this.quoteUsd, this.usdToCny);
    return {
      ...result,
      headingText: this.quoteHeading,
      fileName: `${this.quoteHeading}-${this.selectedStartDate.replace(/-/g, '')}.png`,
      conversionRates: { usdToCny: this.usdToCny, phpPerCny: this.phpPerCny, date: this.usingLiveExchangeRate ? this.exchangeRateDate : undefined },
      exchangeRateText: `${this.usingLiveExchangeRate ? `参考汇率日期${this.exchangeRateDate}` : '备用汇率估算'}：1元人民币≈${this.phpPerCny.toLocaleString('zh-CN', { maximumFractionDigits: 6 })}比索`,
    };
  }

  get quoteImageNotes(): string[] {
    const notes = this.activeStudents.flatMap((student, index) => {
      const prefix = this.quoteMode === 'group' ? `学生${index + 1}：` : '';
      return [
        ...(student.quotePlan.warning ? [`${prefix}${student.quotePlan.warning}`] : []),
        ...(student.promotionWarning ? [`${prefix}${student.promotionWarning}`] : []),
      ];
    });
    if (this.activeStudents.some((student) => student.hasSixWeekPeriod)) {
      notes.push('当前方案含6周课程或住宿，按对应4周价格的1.5倍估算。');
    }
    notes.push('价格、优惠名额、房型空位、实际上课天数和当地费用以WALES正式账单为准。');
    return [...new Set(notes)];
  }

  private statusLabel(student: WalesStudentQuote): string {
    return ({ new: '新生', current: 'WALES在校生', returning: 'WALES返校生' } as const)[student.studentStatus];
  }

  formatUsd(value: number): string {
    return value.toLocaleString('en-US', { minimumFractionDigits: Number.isInteger(value) ? 0 : 1, maximumFractionDigits: 2 });
  }
  formatPhp(value: number): string { return `${value.toLocaleString('en-US', { maximumFractionDigits: 0 })} 比索`; }
  formatFeeQuantity(value: number): string { return value.toLocaleString('zh-CN', { maximumFractionDigits: 2 }); }
  private courseIdFromName(name: string): string {
    const value = name.toLowerCase();
    if (value.includes('pearson') || value.includes('pte')) return 'pte';
    if (value.includes('guarantee')) return 'ielts-guarantee';
    return this.slugifyPriceKey(name);
  }

  private slugifyPriceKey(value: string): string {
    return value.toLowerCase().replace(/&/g, 'and').replace(/\+/g, ' plus ').replace(/\//g, ' ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  private orderIndex(order: string[], value: string): number {
    const index = order.indexOf(value);
    return index === -1 ? Number.MAX_SAFE_INTEGER : index;
  }

}

import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { catchError, EMPTY, forkJoin, switchMap } from 'rxjs';
import { SchoolFeeDTO } from '../../../../interfaces/school-fees.dto';
import { SchoolLessonDTO } from '../../../../interfaces/school-lessons.dto';
import { SchoolRoomDTO } from '../../../../interfaces/school-rooms.dto';
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
interface RoomFee { id: string; name: string; fee: number; note: string; addOn?: boolean; }
interface LocalFee { item: string; amount: string; note: string; }
interface ProcessStep { icon: string; title: string; text: string; }
interface FaqItem { question: string; answer: string; }
interface SideNavItem { label: string; target: string; icon: string; }
interface SidaWalesReason { number: string; title: string; text: string; image: string; alt: string; }
interface SidaWalesTrustBadge { icon: string; label: string; }

@Component({
  selector: 'app-wales-school-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './wales-school-detail.component.html',
  styleUrls: [
    '../cebu-school-detail-layout.css',
    '../cebu-school-detail-content.css',
    '../cebu-school-detail-responsive.css',
    '../ev-school/ev-school-detail.component.css',
    './wales-school-detail.component.css',
  ],
})
export class WalesSchoolDetailComponent implements OnInit {
  private readonly schoolService = inject(SchoolService);
  private readonly pricingSchoolSearchName = 'WALES';
  private readonly pricingSchoolNames = ['菲律宾碧瑶WALES语言学校', 'WALES Academy', 'Widest Asian Learners English School Inc.', 'WALES'];
  private readonly courseFeeOrder = [
    'eep-lite',
    'eep',
    'infinity-lite',
    'infinity-standard',
    'infinity-intensive',
    'infinity-pro',
    'ielts-intro',
    'ielts-standard',
    'junior-esl',
    'junior-ielts',
  ];
  private readonly roomFeeOrder = [
    'lower-studio-single',
    'lower-studio-extra-bed',
    'upper-studio-single',
    'upper-studio-extra-bed',
    'premium-studio-single',
    'premium-studio-twin-share',
    'premium-studio-extra-bed',
    'upper-premium-studio-single',
    'upper-premium-studio-twin',
    'upper-premium-studio-parent-and-child-triple',
    'share-type-single-with-window',
    'share-type-single-without-window',
    'share-type-twin',
    'condo-type-small-single',
    'condo-type-parent-and-child-twin',
  ];

  readonly galleryCategories: GalleryCategory[] = ['全部', '校区', '教室', '住宿', '餐厅', '设施'];
  selectedGalleryCategory: GalleryCategory = '全部';
  registrationFee = 100;
  readonly discount = 1;
  seasonalFeePerWeek = 0;
  readonly usdToCny = 7.2;
  readonly weekOptions = [2, 3, 4, 8, 12, 16, 20, 24];
  selectedCourseId = 'eep-lite';
  selectedRoomId = 'share-type-twin';
  selectedWeeks = 4;
  selectedStartDate = '2026-09-06';
  quoteCalculated = false;

  readonly quickInfo: QuickInfo[] = [
    { icon: 'terrain', label: '城市', value: '碧瑶 Baguio', note: 'Legarda Road市区生活圈，步行可到餐厅、商场、ATM等生活机能。' },
    { icon: 'groups', label: '学校规模', value: '约80名学生', note: '小校容量让老师与学校人员更容易照顾个别需求。' },
    { icon: 'school', label: '课程方向', value: 'EEP / Infinity / IELTS / Junior', note: '从轻量生活英文到综合强化、雅思与青少年课程都有对应路线。' },
    { icon: 'bed', label: '住宿', value: 'Studio / Premium / Share / Condo', note: '房型选择比一般宿舍更生活化，适合成人、亲子或重视隐私的学生。' },
    { icon: 'restaurant', label: '餐食', value: '餐费需确认', note: '报名报价要把meal fee、房型空位和当地PHP费用一起核算。' },
    { icon: 'payments', label: '费用参考', value: '课程+住宿拆分', note: '4周USD课程费与住宿费分开列示，附件价目表列示报名费USD 100。' },
  ];

  readonly galleryImages: GalleryImage[] = [
    { category: '校区', title: 'WALES校舍外观', description: 'WALES官方网站展示的Baguio校舍，学校位于Legarda Road生活圈。', src: 'assets/philippines/wales-school-building.jpg' },
    { category: '设施', title: 'WALES校内设施', description: '官方Facility页面展示的校内学习与生活空间，学校楼层内集中安排教室、办公室和餐厅。', src: 'assets/philippines/wales-facility-main.jpg' },
    { category: '教室', title: '一对一玻璃隔间教室', description: 'WALES官方Classrooms页面展示的一对一教室，隔间式空间利于集中上课。', src: 'assets/philippines/wales-classroom.jpg' },
    { category: '教室', title: '团体与功能教室', description: '团体课用于讨论、听力、发音、商务表达和考试技能训练。', src: 'assets/philippines/wales-classroom-group.jpg' },
    { category: '住宿', title: 'Studio房型', description: 'WALES官方Studio Type页面展示的单人房型，适合重视隐私和学习空间的学生。', src: 'assets/philippines/wales-studio-room.jpg' },
    { category: '住宿', title: 'Premium Studio房型', description: 'Premium Studio配有更完整的生活设备，适合成人、家庭或长期学习需求。', src: 'assets/philippines/wales-premium-studio-room.jpg' },
    { category: '住宿', title: 'Condo房型', description: 'Condo Type适合希望有公寓式生活空间、厨房设备和更强生活机能的学生。', src: 'assets/philippines/wales-condo-room.jpg' },
    { category: '住宿', title: 'Share Type房型', description: 'Share Type适合想兼顾预算、室友互动和生活设备的学生。', src: 'assets/philippines/wales-share-room.jpg' },
    { category: '餐厅', title: 'WALES Cafeteria', description: '官方Facility页面展示的餐厅空间，正式报价时需把餐费和饮食需求一起确认。', src: 'assets/philippines/wales-cafeteria.jpg' },
  ];

  readonly basicInfo: BasicInfoRow[] = [
    { label: '学校名称', value: '菲律宾碧瑶WALES语言学校' },
    { label: '英文名称', value: 'WALES Academy / Widest Asian Learners English School Inc.' },
    { label: '创校时间', value: '2006年从青少年学院起步，之后扩展ESL、TOEIC、TOEFL、IELTS等课程' },
    { label: '地址', value: '#4 Bukaneg St., Legarda Rd., Baguio City, the Philippines' },
    { label: '学校容量', value: '约80名学生' },
    { label: '课程方向', value: 'EEP、ESL/Infinity、Business English、IELTS、Junior ESL、Junior IELTS、Family方向' },
    { label: '房型方向', value: 'Lower/Upper Studio、Premium Studio、Share、Condo等' },
    { label: '报价说明', value: '课程费采用2026年4周公开参考；住宿费与USD 100报名费按用户提供的2025价目表更新' },
  ];

  readonly highlights: Highlight[] = [
    { image: 'assets/philippines/wales-school-building.jpg', title: '小校容量，照顾更细', text: 'WALES容量约80名学生，适合希望学校人员更容易认识学生、学习和生活问题能快速沟通的人。' },
    { image: 'assets/philippines/wales-classroom.jpg', title: '一对一隔间教室', text: '官方Classrooms页面展示的一对一玻璃隔间，让学生能在较安静的环境里集中练习与纠错。' },
    { image: 'assets/philippines/wales-cafeteria.jpg', title: '餐厅空间清楚可见', text: '报名时要把meal fee和饮食需求一起确认，官方餐厅照片能帮助学生先判断日常用餐环境。' },
    { image: 'assets/philippines/wales-condo-room.jpg', title: '房型选择生活化', text: 'Studio、Premium Studio、Share和Condo房型让WALES更适合重视隐私、厨房设备、网络和生活机能的学生。' },
  ];

  readonly suitableFor: FitItem[] = [
    { title: '成人、工作者或打工度假准备', text: 'EEP和Business方向适合把英文用在旅行、工作、生活沟通和跨文化商务场景的人。' },
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
    { name: 'EEP Lite / EEP', type: '生活沟通英文', lessons: 'EEP Lite：1:1×3；EEP：1:1×4 + Group×1', suitable: '面向旅行、工作、打工度假、移民准备、家长陪读或想轻量提升听说沟通的人。' },
    { name: 'Infinity Lite / Standard / Intensive / Pro', type: '综合ESL强化', lessons: '从1:1×3 + Group×1到1:1×5 + Group×3', suitable: '适合听说读写四项基础提升，按一对一课时和团体课数量选择强度。' },
    { name: 'Business English', type: '商务沟通', lessons: '官方课程页列为7节课 / 天', suitable: '训练商务邮件、合约、文章阅读、听力、pitch、商务会话和词汇，适合职场英文需求。' },
    { name: 'IELTS Intro / Standard / Guarantee', type: '雅思备考', lessons: 'Intro/Standard可4周估算；Guarantee通常8周以上', suitable: 'Academic或General Training方向，适合升学、就业、移民或专业注册目标。' },
    { name: 'Junior ESL / Junior IELTS', type: '青少年课程', lessons: '按学生年龄、英文基础和监护安排确认', suitable: '适合青少年英语基础提升或雅思准备，需同时确认家长/监护规则和房型。' },
    { name: 'Family Program', type: '家庭同行', lessons: '儿童与家长课程需分开核价', suitable: '适合亲子同行或家长陪读，优先确认房型、餐费、年龄限制和安全安排。' },
  ];

  courseFees: CourseFee[] = [
    { id: 'eep-lite', name: 'EEP Lite', tuition: 650, suitable: '1:1×3，适合轻量沟通和生活英文' },
    { id: 'eep', name: 'EEP', tuition: 800, suitable: '1:1×4 + Group×1，适合生活口语与基础沟通' },
    { id: 'infinity-lite', name: 'Infinity Lite', tuition: 750, suitable: '1:1×3 + Group×1，适合四项基础提升' },
    { id: 'infinity-standard', name: 'Infinity Standard', tuition: 880, suitable: '1:1×4 + Group×2，适合多数综合英文学习' },
    { id: 'infinity-intensive', name: 'Infinity Intensive', tuition: 1000, suitable: '1:1×5 + Group×3，适合高课时综合强化' },
    { id: 'infinity-pro', name: 'Infinity Pro', tuition: 1200, suitable: '1:1×4 + Group×3，适合更高强度和目标导向学习' },
    { id: 'ielts-intro', name: 'IELTS Intro', tuition: 880, suitable: '1:1×3 + Group×3，适合IELTS Starter阶段' },
    { id: 'ielts-standard', name: 'IELTS Standard', tuition: 880, suitable: '1:1×2 + Group×4，适合IELTS Academic或General Training' },
    { id: 'junior-esl', name: 'Junior ESL', tuition: 1300, suitable: '青少年ESL课程，需确认年龄和监护规则' },
    { id: 'junior-ielts', name: 'Junior IELTS', tuition: 1400, suitable: '青少年IELTS课程，需确认目标分数和基础' },
  ];

  roomFees: RoomFee[] = [
    { id: 'lower-studio-single', name: 'Lower Studio Single（单人套房）', fee: 1200, note: '房内有书桌、椅子、柜子、冰箱、保险箱和完整卫浴；无厨房且禁止烹饪' },
    { id: 'lower-studio-extra-bed', name: 'Lower Studio Extra Bed（额外加床）', fee: 600, note: '加床补充费用，须与Lower Studio主房搭配', addOn: true },
    { id: 'upper-studio-single', name: 'Upper Studio Single（单人套房）', fee: 1300, note: '房内有书桌、椅子、柜子、冰箱、保险箱和完整卫浴；无厨房且禁止烹饪' },
    { id: 'upper-studio-extra-bed', name: 'Upper Studio Extra Bed（额外加床）', fee: 700, note: '加床补充费用，须与Upper Studio主房搭配', addOn: true },
    { id: 'premium-studio-single', name: 'Premium Studio Single（高级单人套房）', fee: 1600, note: '两间房（卧室与客厅），配简易厨房、基本餐具、小冰箱、微波炉和热水壶' },
    { id: 'premium-studio-twin-share', name: 'Premium Studio Twin Share（高级双人套房）', fee: 1100, note: '两间房（卧室与客厅），配简易厨房、基本餐具、小冰箱、微波炉和热水壶' },
    { id: 'premium-studio-extra-bed', name: 'Premium Studio Extra Bed（额外加床）', fee: 600, note: '加床补充费用，须与Premium Studio主房搭配', addOn: true },
    { id: 'upper-premium-studio-single', name: 'Upper Premium Studio Single（单人间）', fee: 1700, note: 'Upper Premium Studio单人间' },
    { id: 'upper-premium-studio-twin', name: 'Upper Premium Studio Twin（双人间）', fee: 1200, note: 'Upper Premium Studio双人间' },
    { id: 'upper-premium-studio-parent-and-child-triple', name: 'Upper Premium Studio Parent & Child Triple（亲子三人间）', fee: 1030, note: 'Upper Premium Studio亲子三人间' },
    { id: 'share-type-single-with-window', name: 'Share Type Single with Window（单人间有窗）', fee: 1150, note: '顶层复式共享住宅，共4至5间卧室、2间卫浴，并共用餐厅、客厅和厨房' },
    { id: 'share-type-single-without-window', name: 'Share Type Single without Window（单人间无窗）', fee: 1050, note: '顶层复式共享住宅，共4至5间卧室、2间卫浴，并共用餐厅、客厅和厨房' },
    { id: 'share-type-twin', name: 'Share Type Twin（双人间）', fee: 950, note: '顶层复式共享住宅，共4至5间卧室、2间卫浴，并共用餐厅、客厅和厨房' },
    { id: 'condo-type-small-single', name: 'Condo Type Small Single（小单人间）', fee: 1300, note: 'Condo Type小单人间' },
    { id: 'condo-type-parent-and-child-twin', name: 'Condo Type Parent & Child Twin（亲子双人间）', fee: 1000, note: 'Condo Type亲子双人间' },
  ];

  readonly schedule: ScheduleItem[] = [
    { time: '07:00 - 08:00', title: '早餐 / 个人准备', text: '实际餐食安排和费用需按当期报价确认，建议把饮食需求提前告诉顾问。' },
    { time: '08:00 - 12:00', title: '上午一对一与团体课', text: '按EEP、Infinity、IELTS或Junior课程安排听说读写、发音、语法和考试训练。' },
    { time: '12:00 - 13:00', title: '午餐与短休', text: 'WALES位于市区生活圈，周边用餐和生活采购便利度较高。' },
    { time: '13:00 - 17:00', title: '下午课程与反馈', text: 'Infinity和IELTS课程会按目标调整一对一科目和团体课重点。' },
    { time: '17:00 - 22:00', title: '复习 / 生活安排', text: 'WALES不是典型高压斯巴达，晚间学习效率更依赖学生自律和顾问前期匹配。' },
    { time: '周末', title: '碧瑶市区生活', text: '可安排Burnham Park、SM Baguio、夜市、咖啡厅或短途活动，仍需遵守学校规定。' },
  ];

  localFees: LocalFee[] = [
    { item: 'SSP', amount: 'PHP 12,300', note: '特别学习许可，4周也需准备' },
    { item: 'ACR I-Card', amount: 'PHP 4,000', note: '12周及以上通常需要，短期学生以学校确认规则为准' },
    { item: '签证延签8周', amount: 'PHP 4,940', note: '8周首次延签参考' },
    { item: '签证延签12周', amount: 'PHP 11,150', note: '12周延签参考，通常叠加ACR I-Card' },
    { item: '签证延签16周', amount: 'PHP 15,300', note: '16周延签参考' },
    { item: '签证延签20周', amount: 'PHP 19,630', note: '20周延签参考' },
    { item: '签证延签24周', amount: 'PHP 24,140', note: '24周延签参考' },
    { item: '水电费', amount: 'PHP 3,500', note: '4周参考，周数越长按学校规则递增' },
    { item: '维护费', amount: 'PHP 1,000', note: '4周参考' },
    { item: '宿舍保证金', amount: 'PHP 5,000', note: '退房检查后按学校规则退还' },
    { item: 'School ID', amount: 'PHP 300', note: '学生证或校内识别费用参考' },
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
    { number: '01', title: '先把WALES放进正确比较组', text: '会把它和MONOL、BECI City、JIC Premium等更弹性的碧瑶学校一起比较，而不是只看城市。', image: 'assets/cia/sida-why-action-selection.jpg', alt: '思达顾问帮助学生判断WALES是否适合' },
    { number: '02', title: '课程、房型、餐费和当地费用一次算清', text: 'WALES费用需要拆成课程、住宿、meal fee、当地PHP费用和优惠，顾问会逐项列明。', image: 'assets/cia/sida-why-action-fees.jpg', alt: '思达顾问核算菲律宾碧瑶WALES语言学校费用' },
    { number: '03', title: '正式文件与收费节点可核对', text: '报价、录取、付款节点和学校确认文件都按流程核验，避免只靠网页价格做决定。', image: 'assets/cia/sida-why-action-contract.jpg', alt: '思达正式合同与学校文件核验' },
    { number: '04', title: '出发前每一步有人提醒', text: '签证、eTravel、入学文件、航班、接机、换汇和到校PHP费用都会提前提醒。', image: 'assets/cia/sida-why-action-departure.jpg', alt: '菲律宾游学出发前文件和行李准备' },
    { number: '05', title: '服务持续到完成学习', text: '换老师、调课、住宿、账单、续读或转校问题都可以继续协助沟通。', image: 'assets/cia/sida-why-action-followup.jpg', alt: '思达顾问持续跟进学生学习情况' },
    { number: '06', title: '深圳总部 + 菲律宾当地支持', text: '国内顾问与菲律宾当地工作人员协作，遇到重要节点有人跟进。', image: 'assets/cia/sida-why-action-team.jpg', alt: '思达启航菲律宾和深圳服务团队' },
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
    'WALES课程费和住宿费分开列示，本页默认按4周 EEP Lite + Share Type Twin估算。',
    '用户提供的WALES 2025价目表列示USD 100报名费，本页已计入快速报价。',
    'IELTS Guarantee通常为8周以上方向，本页4周课程费表只列可用于4周估算的公开项目。',
    '到校费用多以PHP支付，SSP、水电、维护、保证金、学生证、签证延签和ACR I-Card按学习周数不同而变化。',
    'WALES住宿空房变化快，Studio、Premium Studio、Share和Condo都需要先确认入学日可用房型。',
    '最终报名以学校正式录取、付款节点、优惠有效期和顾问确认报价为准。',
  ];
  readonly faqs: FaqItem[] = [
    { question: '菲律宾碧瑶WALES语言学校是斯巴达学校吗？', answer: '不是典型高压斯巴达。WALES更适合小校、市区便利、成人友好和相对弹性的学习节奏；如果需要强制自习和严格门禁，应同步比较PINES、JIC Challenger或BECI Sparta。' },
    { question: 'WALES适合零基础学生吗？', answer: '可以优先看EEP、EEP Lite或Infinity Lite。报名时建议先说明英文基础、学习周数和目标，顾问会帮你判断是否需要更高课时的Infinity路线。' },
    { question: '页面报价包含报名费和餐费吗？', answer: '快速报价已计入用户提供价目表中的USD 100报名费，但不含餐费。餐费仍需按当期方案核价；到校PHP费用另列。' },
    { question: 'WALES的房型怎么选？', answer: '预算优先可先看Share Type Twin或Condo Type Parent & Child Twin；重视隐私和设备可看Studio或Premium Studio。热门档期建议尽早确认空房。' },
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

  ngOnInit(): void { this.loadPricingFromDatabase(); }

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
      .map((lesson) => ({
        id: this.slugifyPriceKey(lesson.name),
        name: lesson.name,
        tuition: lesson.price,
        suitable: lesson.description || lesson.note || '请联系顾问确认适合人群',
      }))
      .sort((a, b) => this.orderIndex(this.courseFeeOrder, a.id) - this.orderIndex(this.courseFeeOrder, b.id));
    if (databaseCourseFees.length > 0) {
      this.courseFees = databaseCourseFees;
      if (!this.courseFees.some((course) => course.id === this.selectedCourseId)) {
        this.selectedCourseId = this.courseFees.find((course) => course.id === 'eep-lite')?.id ?? this.courseFees[0].id;
      }
    }

    const databaseRoomFees = rooms
      .filter((room) => room.week === 4)
      .map((room) => ({
        id: this.slugifyPriceKey(room.name),
        name: room.name,
        fee: room.price,
        note: room.description || '请联系顾问确认空房',
        addOn: room.name.toLowerCase().includes('extra bed'),
      }))
      .sort((a, b) => this.orderIndex(this.roomFeeOrder, a.id) - this.orderIndex(this.roomFeeOrder, b.id));
    if (databaseRoomFees.length > 0) {
      this.roomFees = databaseRoomFees;
      if (!this.roomFees.some((room) => room.id === this.selectedRoomId)) {
        this.selectedRoomId = this.roomFees.find((room) => room.id === 'share-type-twin')?.id ?? this.quoteRoomFees[0]?.id ?? this.roomFees[0].id;
      }
    }

    const registrationFee = fees.find((fee) => (fee.name === '注册费' || fee.name === '报名费') && fee.fee > 0);
    if (registrationFee) this.registrationFee = registrationFee.fee;
    const peakSeasonFee = fees.find((fee) => fee.name === '旺季附加费' && fee.fee > 0);
    if (peakSeasonFee) this.seasonalFeePerWeek = peakSeasonFee.fee;
    const databaseLocalFees = fees
      .filter((fee) => this.currencyCodeForDisplay(fee.currencyCode) === 'PHP')
      .map((fee) => ({ item: fee.name, amount: this.formatCurrencyAmount(fee), note: this.cleanFeeDescription(fee.description) }));
    if (databaseLocalFees.length > 0) this.localFees = databaseLocalFees;
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
  get quoteRoomFees(): RoomFee[] { return this.roomFees.filter((room) => !room.addOn); }
  get tuitionForSelectedWeeks(): number { return this.selectedCourse.tuition * (this.selectedWeeks / 4); }
  get roomFeeForSelectedWeeks(): number { return this.selectedRoom.fee * (this.selectedWeeks / 4); }
  get isPeakSeason(): boolean { return false; }
  get seasonalSurcharge(): number { return this.isPeakSeason ? this.selectedWeeks * this.seasonalFeePerWeek : 0; }
  get quoteUsd(): number { return this.registrationFee + (this.tuitionForSelectedWeeks + this.roomFeeForSelectedWeeks) * this.discount + this.seasonalSurcharge; }
  get quoteUsdText(): string { return `USD ${this.formatUsd(this.quoteUsd)} 起`; }
  get quoteCnyText(): string {
    const rounded = Math.round((this.quoteUsd * this.usdToCny) / 100) * 100;
    return `约 ${rounded.toLocaleString('zh-CN')} 元起`;
  }
  get discountText(): string {
    return this.discount === 1 ? '公开折扣需顾问确认' : `${Math.round(this.discount * 100)} 折扣范围`;
  }

  formatUsd(value: number): string {
    return value.toLocaleString('en-US', { minimumFractionDigits: Number.isInteger(value) ? 0 : 1, maximumFractionDigits: 1 });
  }

  private slugifyPriceKey(value: string): string {
    return value.toLowerCase().replace(/&/g, 'and').replace(/\+/g, ' plus ').replace(/\//g, ' ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  private orderIndex(order: string[], value: string): number {
    const index = order.indexOf(value);
    return index === -1 ? Number.MAX_SAFE_INTEGER : index;
  }

  private currencyCodeForDisplay(code?: string): string {
    return !code ? 'USD' : code.toUpperCase() === 'PESO' ? 'PHP' : code.toUpperCase();
  }

  private formatCurrencyAmount(fee: SchoolFeeDTO): string {
    return `${this.currencyCodeForDisplay(fee.currencyCode)} ${fee.fee.toLocaleString('en-US', { minimumFractionDigits: Number.isInteger(fee.fee) ? 0 : 1, maximumFractionDigits: 1 })}`;
  }

  private cleanFeeDescription(description?: string): string {
    return description ? description.replace(/^到校支付费用；/, '').replace(/^前期支付费用；/, '') : '以学校现场收费为准';
  }
}

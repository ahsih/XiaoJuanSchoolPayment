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
interface RoomFee { id: string; name: string; fee: number; note: string; }
interface LocalFee { item: string; amount: string; note: string; }
interface ProcessStep { icon: string; title: string; text: string; }
interface FaqItem { question: string; answer: string; }
interface SideNavItem { label: string; target: string; icon: string; }
interface SidaBeciReason { number: string; title: string; text: string; image: string; alt: string; }
interface SidaBeciTrustBadge { icon: string; label: string; }

@Component({
  selector: 'app-beci-school-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './beci-school-detail.component.html',
  styleUrls: [
    '../cebu-school-detail-layout.css',
    '../cebu-school-detail-content.css',
    '../cebu-school-detail-responsive.css',
    '../ev-school/ev-school-detail.component.css',
    './beci-school-detail.component.css',
  ],
})
export class BeciSchoolDetailComponent implements OnInit {
  private readonly schoolService = inject(SchoolService);
  private readonly pricingSchoolSearchName = 'BECI';
  private readonly pricingSchoolNames = ['菲律宾碧瑶BECI语言学校', 'BECI International Language Academy', 'API BECI'];
  private readonly courseFeeOrder = [
    'eop-lite-esl',
    'eop-speed-esl',
    'eop-sparta-esl',
    'eop-working-holiday',
    'sparta-24-esl',
    'sparta-toeic',
    'sparta-ielts',
    'city-lite-esl',
    'city-speed-esl',
    'city-flexi-lite-esl',
    'city-flexi-speed-esl',
    'city-bizspeak',
    'city-native-esl',
    'city-unlimited-esl',
    'city-ielts',
  ];
  private readonly roomFeeOrder = [
    'eop-quad',
    'eop-triple',
    'eop-twin',
    'eop-single',
    'eop-regular-single',
    'eop-master-single',
    'sparta-quad',
    'sparta-3-plus-1',
    'city-studio-quad',
    'city-studio-twin',
    'city-semi-single',
    'city-semi-master-single',
    'city-studio-single',
  ];

  readonly galleryCategories: GalleryCategory[] = ['全部', '校区', '教室', '住宿', '餐厅', '设施'];
  selectedGalleryCategory: GalleryCategory = '全部';
  registrationFee = 100;
  readonly discount = 1;
  seasonalFeePerWeek = 40;
  readonly usdToCny = 7.2;
  readonly weekOptions = [1, 2, 3, 4, 8, 12, 16, 24];
  selectedCourseId = 'eop-lite-esl';
  selectedRoomId = 'eop-quad';
  selectedWeeks = 4;
  selectedStartDate = '2026-08-23';
  quoteCalculated = false;

  readonly quickInfo: QuickInfo[] = [
    { icon: 'terrain', label: '城市', value: '碧瑶 Baguio', note: '凉爽山城，适合长期学习和备考' },
    { icon: 'apartment', label: '校区', value: 'EOP / Sparta / City', note: '按英语基础、自律程度和生活节奏分校区' },
    { icon: 'record_voice_over', label: '核心特色', value: 'Speaking Prescription', note: '用录像和反馈追踪口语弱点' },
    { icon: 'school', label: '课程方向', value: 'ESL / IELTS / TOEIC / ESP', note: '覆盖沉浸口语、考试和成人商务英文' },
    { icon: 'bed', label: '住宿', value: '校内宿舍 / Mansion / Studio', note: '不同校区房型差异很大，需先确认校区' },
    { icon: 'event_available', label: '学习节奏', value: '弹性到强管理', note: 'City无宵禁，Sparta晚间学习和测试更严格' },
  ];

  readonly galleryImages: GalleryImage[] = [
    { category: '校区', title: 'BECI EOP Campus航拍环境', description: 'APIBECI官网展示的EOP Campus自然校区环境。', src: 'assets/philippines/beci-eop-campus.jpg' },
    { category: '校区', title: 'BECI校区建筑外观', description: '官方首页展示的BECI碧瑶校区建筑，用于比较不同校区氛围。', src: 'assets/philippines/beci-campus-building.png' },
    { category: '校区', title: 'BECI碧瑶校区大楼', description: '官方首页展示的碧瑶校区大楼，适合了解住宿与学习空间距离。', src: 'assets/philippines/beci-campus-blue-roof.png' },
    { category: '教室', title: 'EOP户外一对一学习区', description: 'EOP Campus页面展示的户外学习空间，体现English Only环境。', src: 'assets/philippines/beci-eop-outdoor-class.jpg' },
    { category: '教室', title: 'Sparta一对一课堂', description: 'Sparta Campus页面展示的一对一课堂，用于口语、考试和SP反馈训练。', src: 'assets/philippines/beci-one-to-one-class.jpg' },
    { category: '教室', title: 'Speaking Prescription辅导场景', description: '官方Sparta照片展示老师与学生进行针对性口语反馈。', src: 'assets/philippines/beci-speaking-prescription.jpg' },
    { category: '住宿', title: 'EOP Mansion单人房', description: 'EOP Campus Mansion页面展示的单人房型，适合重视隐私的学生。', src: 'assets/philippines/beci-eop-single-room.png' },
    { category: '住宿', title: 'EOP Mansion多人房', description: '官方Mansion房型照片展示多人房空间，报名需同步确认性别与空房。', src: 'assets/philippines/beci-eop-shared-room.png' },
    { category: '餐厅', title: 'EOP户外交流桌区', description: '官方EOP照片中的户外桌区，餐饮和活动安排以当期校区说明为准。', src: 'assets/philippines/beci-eop-outdoor-study.jpg' },
    { category: '设施', title: 'City Campus学习休息区', description: 'City Campus页面展示的成人学习空间，适合工作者与弹性学习。', src: 'assets/philippines/beci-city-study-lounge.png' },
    { category: '设施', title: 'City Campus自习工作区', description: '官方City Campus页面展示的安静工作与自习座位。', src: 'assets/philippines/beci-city-workspace.png' },
  ];

  readonly basicInfo: BasicInfoRow[] = [
    { label: '学校名称', value: '菲律宾碧瑶BECI语言学校' },
    { label: '英文名称', value: 'BECI International Language Academy / API BECI' },
    { label: '发展时间', value: '官方资料显示学校自2002年起在碧瑶发展ESL教育' },
    { label: '碧瑶校区', value: 'EOP Campus、Sparta Campus、City Campus' },
    { label: '课程方向', value: 'Lite ESL、Speed ESL、Sparta ESL、24 ESL、IELTS、TOEIC、ESP、BizSpeak、Native ESL、Unlimited ESL' },
    { label: '核心系统', value: 'Educare System、Speaking Prescription、EOP English Only Policy、3+1 Buddy System' },
    { label: '适合人群', value: '需要沉浸口语、强管理冲刺、雅思/多益备考、成人商务英文或远程办公弹性学习的学生' },
    { label: '报价币种', value: '公开2026费用表以USD列课程和住宿，菲律宾当地费用以PHP支付' },
  ];

  readonly highlights: Highlight[] = [
    { image: 'assets/philippines/beci-eop-campus.jpg', title: '三个校区定位清楚', text: 'EOP适合英语沉浸和口语输出，Sparta适合强管理冲刺，City适合成人、工作者和更弹性的学习节奏。' },
    { image: 'assets/philippines/beci-speaking-prescription.jpg', title: '口语处方反馈机制', text: 'Speaking Prescription会用录影和维度评估追踪发音、语调、词汇和语法等口语弱点。' },
    { image: 'assets/philippines/beci-one-to-one-class.jpg', title: 'Sparta冲刺型学习', text: '24 ESL包含白天密集课堂、晚间学习和每周SP测试，适合需要制度推动的学生。' },
    { image: 'assets/philippines/beci-city-study-lounge.png', title: 'City成人弹性学习', text: 'City Campus面向成人和工作者，主打弹性、无宵禁、商务和ESP方向，也有Unlimited ESL选择。' },
  ];

  readonly suitableFor: FitItem[] = [
    { title: '想在碧瑶全英文环境练口语', text: 'EOP Campus强调English Only Policy，适合怕开口、想建立英语思维的学生。' },
    { title: '需要强管理和高学习量', text: 'Sparta Campus适合自律弱、想短期冲刺、能接受晚间学习和测试的人。' },
    { title: '成人、工作者或商务英文需求', text: 'City Campus更适合需要弹性时间、无宵禁、工作空间和ESP/商务表达训练的学生。' },
    { title: '想把ESL、IELTS、TOEIC放在同一校系比较', text: 'BECI三校区课程线完整，适合先做校区匹配再算总预算。' },
  ];

  readonly notSuitableFor: FitItem[] = [
    { title: '只想按学校名报名', text: 'BECI各校区差异很大，必须先确认EOP、Sparta或City，否则课程强度和生活规则可能不匹配。' },
    { title: '不想遵守英语环境或晚间要求', text: 'EOP和Sparta有更明确的学习纪律，喜欢完全自由生活的人要谨慎。' },
    { title: '只想海边度假体验', text: 'BECI位于碧瑶，优势在学习氛围和凉爽气候，不是海岛度假型学校。' },
    { title: '临近旺季才锁热门房型', text: '单人房、3+1房和Studio房型在热门档期需要提前确认空房。' },
  ];

  readonly courses: CourseItem[] = [
    { name: 'EOP Lite ESL', type: '沉浸式轻量ESL', lessons: '2节一对一 + 2节团体 + 2节免费团体', suitable: '适合想保留复习时间、基础较弱或需要慢节奏适应英语环境的学生。' },
    { name: 'EOP SPEED ESL', type: '半斯巴达旗舰ESL', lessons: '4节一对一 + 2节团体 + 2节免费团体', suitable: '适合多数初中级学生，学习量和生活弹性相对平衡。' },
    { name: 'EOP Sparta ESL', type: 'EOP强化版', lessons: '5节一对一 + 2节团体 + 2节晚间必修', suitable: '适合想保留EOP环境，又希望增加一对一和晚间学习的人。' },
    { name: 'Sparta 24 ESL', type: '强管理口语冲刺', lessons: '5节一对一 + 2节团体 + 3节晚间义务学习/测试', suitable: '适合自律弱、短期想明显增加输出量和反馈密度的学生。' },
    { name: 'Sparta IELTS / TOEIC', type: '考试基础与强化', lessons: '4节一对一 + 2节团体 + 3节晚间义务学习/测试', suitable: '适合想在强管理环境中准备雅思或多益基础的学生。' },
    { name: 'City LITE / SPEED ESL', type: '成人弹性ESL', lessons: 'Lite为2节一对一 + 2节团体；Speed为4节一对一 + 2节团体', suitable: '适合成人、工作者和不想要高压门禁的学生。' },
    { name: 'City BizSpeak / ESP', type: '职场与特定目标英文', lessons: '以一对一和项目式任务为主', suitable: '适合商务沟通、演示、旅行英文、公众表达等具体需求。' },
    { name: 'City Unlimited ESL', type: '高弹性一对一', lessons: '固定价格下最多8节一对一 + 2节免费团体', suitable: '适合想自由组合ESL、IELTS、TOEIC或Business科目的学生。' },
    { name: 'City Native ESL', type: '外教口语方向', lessons: '4节一对一 + 2节团体 + 2节免费团体', suitable: '适合希望加入外教发音和表达反馈的成人学生。' },
  ];

  courseFees: CourseFee[] = [
    { id: 'eop-lite-esl', name: 'EOP Lite ESL', tuition: 670, suitable: 'EOP轻量课程，适合基础弱、想保留复习时间' },
    { id: 'eop-speed-esl', name: 'EOP SPEED ESL', tuition: 870, suitable: 'EOP半斯巴达旗舰课程，适合多数综合提升学生' },
    { id: 'eop-sparta-esl', name: 'EOP Sparta ESL', tuition: 900, suitable: 'EOP强度更高，含SP和晚间学习' },
    { id: 'eop-working-holiday', name: 'EOP Working Holiday', tuition: 1000, suitable: '工作假期准备方向，适合海外打工度假规划' },
    { id: 'sparta-24-esl', name: 'Sparta 24 ESL', tuition: 900, suitable: 'Sparta强管理口语冲刺，含晚间义务学习与测试' },
    { id: 'sparta-toeic', name: 'Sparta TOEIC', tuition: 850, suitable: '多益基础与刷题方向，适合考试目标学生' },
    { id: 'sparta-ielts', name: 'Sparta IELTS', tuition: 900, suitable: '雅思基础与考试策略，适合强管理备考' },
    { id: 'city-lite-esl', name: 'City LITE ESL', tuition: 670, suitable: 'City轻量成人ESL，适合弹性学习' },
    { id: 'city-speed-esl', name: 'City SPEED ESL', tuition: 870, suitable: 'City综合ESL，适合成人系统提升' },
    { id: 'city-flexi-lite-esl', name: 'City FLEXI LITE ESL', tuition: 670, suitable: '夜间一对一 + 团体，适合工作者' },
    { id: 'city-flexi-speed-esl', name: 'City FLEXI SPEED ESL', tuition: 870, suitable: '夜间课时更多，适合边工作边学习' },
    { id: 'city-bizspeak', name: 'City BizSpeak', tuition: 800, suitable: '商务表达、演示和职场沟通方向' },
    { id: 'city-native-esl', name: 'City Native ESL', tuition: 950, suitable: '含外教方向，适合发音与表达反馈' },
    { id: 'city-unlimited-esl', name: 'City Unlimited ESL', tuition: 950, suitable: '最多8节一对一，科目组合弹性高' },
    { id: 'city-ielts', name: 'City IELTS', tuition: 900, suitable: 'City成人雅思方向，适合弹性备考' },
  ];

  roomFees: RoomFee[] = [
    { id: 'eop-quad', name: 'EOP 校内四人房', fee: 570, note: '默认预算参考，适合控制总价' },
    { id: 'eop-triple', name: 'EOP 校内三人房', fee: 670, note: '预算与室友数量较平衡' },
    { id: 'eop-twin', name: 'EOP 校内双人房', fee: 750, note: '公开表标注男性房型，需按档期确认' },
    { id: 'eop-single', name: 'EOP 校内单人房', fee: 950, note: '公开表标注女性房型，热门档期需早确认' },
    { id: 'eop-regular-single', name: 'EOP Mansion Regular Single', fee: 950, note: 'Mansion房型，公开表标注男性方向' },
    { id: 'eop-master-single', name: 'EOP Mansion Master Single', fee: 1100, note: 'Mansion更高规格单人房，需确认性别与空房' },
    { id: 'sparta-quad', name: 'Sparta 四人房', fee: 700, note: 'Sparta预算入口，仍需遵守校区强管理规则' },
    { id: 'sparta-3-plus-1', name: 'Sparta 3+1 Buddy 房', fee: 800, note: '3名学生 + 1名老师同住，英语环境更强' },
    { id: 'city-studio-quad', name: 'City Studio 四人房', fee: 600, note: 'City预算入口，适合成人弹性学习' },
    { id: 'city-studio-twin', name: 'City Studio 双人房', fee: 800, note: '仅限兄弟姐妹、同性朋友或夫妻等条件使用' },
    { id: 'city-semi-single', name: 'City Semi Single', fee: 900, note: '兼顾隐私与预算的City房型' },
    { id: 'city-semi-master-single', name: 'City Semi Master Single', fee: 1050, note: 'City更高规格单人方向' },
    { id: 'city-studio-single', name: 'City Studio 单人房', fee: 1250, note: 'City独立空间最高，预算较高' },
  ];

  readonly schedule: ScheduleItem[] = [
    { time: '07:00 - 08:00', title: '早餐 / 早间准备', text: '不同校区生活规则不同，Sparta通常更强调准时、测试和学习纪律。' },
    { time: '08:00 - 12:00', title: '上午一对一和团体课', text: 'ESL、IELTS、TOEIC或ESP课程按校区和个人课表安排。' },
    { time: '12:00 - 13:00', title: '午餐与短休', text: '校内用餐后整理课堂笔记，City学生也可能根据工作节奏调整时间。' },
    { time: '13:00 - 17:00', title: '下午课程与口语反馈', text: 'EOP强调持续开口，Sparta强化输出和测试，City偏成人应用和任务型学习。' },
    { time: '18:00 - 19:00', title: '晚餐 / 个人时间', text: 'EOP和Sparta需要留意校区规则；City则更强调成人弹性和无宵禁。' },
    { time: '19:00 - 22:00', title: '晚间学习 / 自习 / 选修', text: 'Sparta 24 ESL与考试课通常包含晚间义务学习和测试，EOP Sparta也有晚间必修。' },
  ];

  localFees: LocalFee[] = [
    { item: 'SSP', amount: 'PHP 7,800', note: '特别学习许可，到校后办理' },
    { item: 'SSP E-Card', amount: 'PHP 4,500', note: '与SSP相关的电子卡申请费用' },
    { item: 'ACR I-Card', amount: 'PHP 4,000', note: '长期学习或延签时通常需要' },
    { item: '签证延签', amount: 'PHP 4,940 起', note: '8周首次延签参考，周数越长费用越高' },
    { item: 'ID Card', amount: 'PHP 200', note: '学生证或校内识别费用参考' },
    { item: '教材费', amount: 'PHP 1,000 - 2,000', note: '按课程不同每4周收取，考试和高强度课程通常更高' },
    { item: '宿舍保证金', amount: 'PHP 3,000', note: '退房检查后按学校规则退还' },
    { item: '水电费', amount: 'PHP 3,000', note: '4周参考，按学校规则或实际使用调整' },
    { item: '维护费', amount: 'PHP 1,000', note: '4周参考' },
    { item: '洗衣费', amount: 'PHP 1,500 - 1,600', note: 'EOP/Sparta参考PHP 1,500，City参考PHP 1,600' },
    { item: '指定接机', amount: 'PHP 3,000', note: '马尼拉或克拉克指定接机日参考' },
    { item: '个别接机', amount: 'PHP 12,000 起', note: '非指定日或个人接机需单独确认' },
  ];

  readonly serviceSteps: ProcessStep[] = [
    { icon: 'person_search', title: '先做校区匹配', text: '根据英语基础、自律程度、目标课程、年龄、是否工作和生活偏好，先判断EOP、Sparta或City。' },
    { icon: 'fact_check', title: '确认课程和房型', text: '免费协助确认BECI课程、房型、空房、入学日、校区规则、旺季附加费和正式报价。' },
    { icon: 'assignment_turned_in', title: '协助入境和签证', text: '思达免费协助菲律宾入境及签证相关手续，学生按顾问指引准备资料。' },
    { icon: 'inventory', title: '发送行前清单', text: '出发前提供学习资料、费用清单、行李清单、接机和到校注意事项。' },
    { icon: 'support_agent', title: '到校后继续跟进', text: '如遇到调课、住宿、学习方法或学校沟通问题，可继续联系思达协助。' },
    { icon: 'location_on', title: '国内顾问与当地协作', text: '国内顾问与菲律宾当地工作人员协作，重要节点持续跟进。' },
  ];

  readonly sidaBeciReasons: SidaBeciReason[] = [
    { number: '01', title: '先判断BECI哪个校区适合', text: '不会只按学校名推荐，会把EOP、Sparta、City的管理强度、年龄层和课程目标分开比较。', image: 'assets/cia/sida-why-action-selection.jpg', alt: '思达启航顾问帮助学生选择BECI校区' },
    { number: '02', title: '课程、住宿和当地费用提前算清', text: '0中介服务费，课程费、住宿费、旺季附加费和到校PHP费用逐项说明。', image: 'assets/cia/sida-why-action-fees.jpg', alt: '思达启航顾问核算菲律宾碧瑶BECI语言学校费用' },
    { number: '03', title: '正式文件与收费可核对', text: '国内公司签约，报价、录取、付款节点和学校文件都可逐项核验。', image: 'assets/cia/sida-why-action-contract.jpg', alt: '思达启航正式合同与学校文件核验' },
    { number: '04', title: '出发前每一步有人提醒', text: '签证、eTravel、入学文件、付款、接机、换汇和当地费用准备都会提前提醒。', image: 'assets/cia/sida-why-action-departure.jpg', alt: '菲律宾游学出发前文件和行李准备' },
    { number: '05', title: '服务持续到完成学习回国', text: '换老师、调课、住宿、账单、续读或转校问题都可以继续协助。', image: 'assets/cia/sida-why-action-followup.jpg', alt: '思达启航顾问持续跟进学生学习情况' },
    { number: '06', title: '深圳总部 + 菲律宾当地支持', text: '国内顾问与菲律宾工作人员协作，重要节点有人跟进。', image: 'assets/cia/sida-why-action-team.jpg', alt: '思达启航菲律宾和深圳服务团队' },
  ];

  readonly sidaBeciTrustBadges: SidaBeciTrustBadge[] = [
    { icon: 'description', label: '国内正式公司合同' },
    { icon: 'verified_user', label: '学校合作与文件核验' },
    { icon: 'local_offer', label: '费用透明与同条件保价' },
    { icon: 'apartment', label: '深圳总部 + 菲律宾支持' },
  ];

  readonly schoolServices = ['机场接机', '入学说明', '分级测试', '课程咨询', 'SP测试', '晚间学习', '宿舍清洁', '洗衣服务', '证件协助', '活动安排'];
  readonly campusActivities = ['新生说明会', '三校区联合活动', '英语口语活动', 'SP测试反馈', '城市生活体验'];
  readonly weekendActivities = ['SM Baguio', 'Burnham Park', 'Baguio夜市', 'San Fernando海边', 'Hundred Islands'];
  readonly notes = [
    'BECI必须先分EOP、Sparta、City校区，再决定课程和房型。',
    'Sparta校区有更强的晚间学习和测试要求，报名前要确认学生能否接受。',
    'City校区更适合成人和工作者，但热门Studio、单人房仍需提前确认空房。',
    '页面价格为2026年公开费用表参考，最终会随学校政策、优惠、房型空位和汇率变化。',
    '最终报名以学校正式录取、付款节点和顾问确认报价为准。',
  ];
  readonly faqs: FaqItem[] = [
    { question: '菲律宾碧瑶BECI语言学校适合零基础吗？', answer: '可以。零基础或怕开口的学生优先看EOP Lite ESL或EOP SPEED ESL，先用全英文环境建立开口习惯；如果自律弱，也可以让顾问评估是否适合Sparta。' },
    { question: 'BECI的EOP、Sparta、City怎么选？', answer: '想沉浸式口语和英语环境看EOP；想强管理、高学习量、短期冲刺看Sparta；成人、工作者、需要弹性和无宵禁看City。' },
    { question: '页面报价包含全部费用吗？', answer: '不包含全部。前期支付参考主要包含注册费、课程费、住宿费和旺季附加费；到校后还需准备SSP、SSP E-Card、签证延签、ACR I-Card、教材、水电、押金、洗衣和接机等PHP费用。' },
    { question: 'BECI City Campus适合边工作边学习吗？', answer: '更适合。City Campus面向成人与工作者，有弹性安排、无宵禁和工作空间，但仍建议先按工作时间确认可选课程。' },
    { question: '思达会协助签证和入境吗？', answer: '会。通过思达报名BECI，思达顾问会免费协助菲律宾入境及签证相关手续，并在出发前发送行前清单和费用提醒。' },
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
          schools.find((item) => item.name.toUpperCase().includes('BECI')) ??
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
        this.selectedCourseId = this.courseFees.find((course) => course.id === 'eop-lite-esl')?.id ?? this.courseFees[0].id;
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
      this.roomFees = databaseRoomFees;
      if (!this.roomFees.some((room) => room.id === this.selectedRoomId)) {
        this.selectedRoomId = this.roomFees.find((room) => room.id === 'eop-quad')?.id ?? this.roomFees[0].id;
      }
    }

    const registrationFee = fees.find((fee) => fee.name === '注册费');
    if (registrationFee) this.registrationFee = registrationFee.fee;
    const peakSeasonFee = fees.find((fee) => fee.name === '旺季附加费');
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
  get tuitionForSelectedWeeks(): number { return this.selectedCourse.tuition * (this.selectedWeeks / 4); }
  get roomFeeForSelectedWeeks(): number { return this.selectedRoom.fee * (this.selectedWeeks / 4); }
  get isPeakSeason(): boolean {
    const start = new Date(`${this.selectedStartDate}T00:00:00`);
    const ranges = [
      [new Date('2026-06-28T00:00:00'), new Date('2026-08-22T23:59:59')],
      [new Date('2027-06-27T00:00:00'), new Date('2027-08-22T23:59:59')],
    ];
    return ranges.some(([from, to]) => start >= from && start <= to);
  }
  get seasonalSurcharge(): number { return this.isPeakSeason ? this.selectedWeeks * this.seasonalFeePerWeek : 0; }
  get quoteUsd(): number { return this.registrationFee + (this.tuitionForSelectedWeeks + this.roomFeeForSelectedWeeks) * this.discount + this.seasonalSurcharge; }
  get quoteUsdText(): string { return `USD ${this.formatUsd(this.quoteUsd)} 起`; }
  get quoteCnyText(): string {
    const rounded = Math.round((this.quoteUsd * this.usdToCny) / 100) * 100;
    return `约 ${rounded.toLocaleString('zh-CN')} 元起`;
  }
  get discountText(): string {
    return this.discount === 1 ? '优惠需顾问确认，参考范围' : `${Math.round(this.discount * 100)} 折扣范围`;
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
  private createRoomId(name: string): string {
    if (name.includes('EOP') && name.includes('四人')) return 'eop-quad';
    if (name.includes('EOP') && name.includes('三人')) return 'eop-triple';
    if (name.includes('EOP') && name.includes('双人')) return 'eop-twin';
    if (name.includes('EOP') && name.includes('校内单人')) return 'eop-single';
    if (name.includes('Regular Single')) return 'eop-regular-single';
    if (name.includes('Master Single')) return 'eop-master-single';
    if (name.includes('Sparta') && name.includes('四人')) return 'sparta-quad';
    if (name.includes('3+1')) return 'sparta-3-plus-1';
    if (name.includes('City') && name.includes('四人')) return 'city-studio-quad';
    if (name.includes('City') && name.includes('双人')) return 'city-studio-twin';
    if (name.includes('Semi Master')) return 'city-semi-master-single';
    if (name.includes('Semi Single')) return 'city-semi-single';
    if (name.includes('City') && name.includes('单人')) return 'city-studio-single';
    return this.slugifyPriceKey(name);
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

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
interface SidaJicReason { number: string; title: string; text: string; image: string; alt: string; }
interface SidaJicTrustBadge { icon: string; label: string; }

@Component({
  selector: 'app-jic-school-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './jic-school-detail.component.html',
  styleUrls: [
    '../cebu-school-detail-layout.css',
    '../cebu-school-detail-content.css',
    '../cebu-school-detail-responsive.css',
    '../ev-school/ev-school-detail.component.css',
    './jic-school-detail.component.css',
  ],
})
export class JicSchoolDetailComponent implements OnInit {
  private readonly schoolService = inject(SchoolService);
  private readonly pricingSchoolSearchName = 'JIC';
  private readonly pricingSchoolNames = ['菲律宾碧瑶JIC语言学校', 'Baguio JIC Academy', 'JIC Academy Baguio'];
  private readonly courseFeeOrder = [
    'challenger-esl-flex',
    'challenger-esl-lite',
    'challenger-esl-core',
    'challenger-esl-standard',
    'challenger-ielts-lite',
    'challenger-ielts-core',
    'challenger-ielts-standard',
    'challenger-ielts-guarantee',
    'premium-speaking-starter',
    'premium-speaking-pro',
    'premium-speaking-master',
    'premium-tep-esl-8',
    'premium-tep-esl-9',
    'premium-tep-esl-10',
    'premium-working-holiday',
    'premium-toeic',
    'premium-business-master',
  ];
  private readonly roomFeeOrder = [
    'challenger-single',
    'challenger-twin',
    'challenger-quad-loft',
    'challenger-quad-studio',
    'premium-single-a-balcony',
    'premium-semi-single',
    'premium-twin-a-balcony',
    'premium-twin-b-no-balcony',
    'premium-quad-a-balcony',
    'premium-quad-b-no-balcony',
  ];

  readonly galleryCategories: GalleryCategory[] = ['全部', '校区', '教室', '住宿', '餐厅', '设施'];
  selectedGalleryCategory: GalleryCategory = '全部';
  registrationFee = 100;
  readonly discount = 1;
  seasonalFeePerWeek = 34.5;
  readonly usdToCny = 7.2;
  readonly weekOptions = [1, 2, 3, 4, 8, 12, 16, 24];
  selectedCourseId = 'challenger-esl-lite';
  selectedRoomId = 'challenger-quad-studio';
  selectedWeeks = 4;
  selectedStartDate = '2026-09-06';
  quoteCalculated = false;

  readonly quickInfo: QuickInfo[] = [
    { icon: 'terrain', label: '城市', value: '碧瑶 Baguio', note: '凉爽山城，适合把注意力放在长期学习和备考上。' },
    { icon: 'apartment', label: '校区', value: 'Challenger / Premium', note: 'Challenger偏ESL与IELTS，Premium偏口语、职业英语和舒适生活。' },
    { icon: 'assignment', label: '重点方向', value: 'ESL / IELTS / Speaking / Career', note: '从基础英文、雅思保证班到TOEIC、商务和打工度假都有对应路线。' },
    { icon: 'school', label: '学习风格', value: '目标导向分校区', note: '先按目标选校区，再按课时量、管理强度和房型做报价。' },
    { icon: 'bed', label: '住宿', value: '单人 / 双人 / 四人房', note: 'Challenger和Premium房型不同，热门档期要提前确认空位。' },
    { icon: 'payments', label: '费用表', value: '2026公开费用整理', note: '课程住宿以USD计算，当地费用多以PHP到校支付。' },
  ];

  readonly galleryImages: GalleryImage[] = [
    { category: '校区', title: 'JIC Challenger校园航拍', description: 'Baguio JIC官方首页展示的碧瑶Challenger / Main校区环境。', src: 'assets/philippines/jic-campus-hero.jpg' },
    { category: '校区', title: 'JIC Main Campus全景', description: 'Main Photos页面展示的Challenger / Main校区整体视角。', src: 'assets/philippines/jic-main-campus-overview.png' },
    { category: '校区', title: 'JIC Premium Campus环境', description: 'Premium Photos页面展示的Premium校区学习生活环境。', src: 'assets/philippines/jic-premium-campus-overview.jpg' },
    { category: '教室', title: 'Challenger IELTS一对一课堂', description: 'Main Campus Classes照片展示的IELTS备考与一对一辅导场景。', src: 'assets/philippines/jic-main-ielts-class.png' },
    { category: '教室', title: 'Premium小组互动课堂', description: 'Premium Campus Classes照片展示的Active Learning小组课堂。', src: 'assets/philippines/jic-premium-group-class.png' },
    { category: '住宿', title: 'Challenger Loft房型', description: 'Main Campus Rooms照片展示的loft住宿空间，适合先比较预算与生活习惯。', src: 'assets/philippines/jic-main-room-loft.jpg' },
    { category: '住宿', title: 'Premium四人房', description: 'Premium Campus Rooms照片展示的四人房，报名需同步确认校区、性别与空房。', src: 'assets/philippines/jic-premium-quad-room.png' },
    { category: '餐厅', title: 'Premium校区餐食', description: 'Premium Photos的Cafeteria & Meals照片展示学校餐食，菜单以当期安排为准。', src: 'assets/philippines/jic-premium-meal.png' },
    { category: '餐厅', title: 'Premium Cafe', description: 'Premium Photos展示的校内Cafe空间，适合课后休息和交流。', src: 'assets/philippines/jic-premium-cafe.png' },
    { category: '设施', title: 'Main Campus自习与Library', description: 'Main Photos页面展示的Library学习空间，适合IELTS与长期备考学生。', src: 'assets/philippines/jic-main-library.jpg' },
    { category: '设施', title: 'Premium Student Center', description: 'Premium Photos展示的学生中心与休息空间，体现更舒适的生活配套。', src: 'assets/philippines/jic-premium-student-center.png' },
  ];

  readonly basicInfo: BasicInfoRow[] = [
    { label: '学校名称', value: '菲律宾碧瑶JIC语言学校' },
    { label: '英文名称', value: 'Baguio JIC Academy / JIC Academy Baguio' },
    { label: '所在城市', value: '菲律宾碧瑶 Baguio City' },
    { label: '主要校区', value: 'Challenger Campus（ESL / IELTS）与 Premium Campus（Speaking / Career）' },
    { label: '课程方向', value: 'ESL Flex、ESL Lite/Core/Standard、IELTS Lite/Core/Standard/Guarantee、Speaking Starter/Pro/Master、TEP ESL、TOEIC、Business Master、Working Holiday' },
    { label: '住宿方向', value: 'Challenger单人、双人、四人Loft、四人Studio；Premium单人、Semi Single、双人A/B、四人A/B' },
    { label: '学习制度', value: 'Challenger更重视词汇测试、自习、IELTS和ESL体系；Premium更重视主题式学习、口语输出和职业场景' },
    { label: '报价说明', value: '2026公开费用按4周整理；JIC日元表按公开固定汇率JPY145/USD折算，最终以学校正式报价为准' },
  ];

  readonly highlights: Highlight[] = [
    { image: 'assets/philippines/jic-campus-hero.jpg', title: '两个校区定位很清楚', text: 'Challenger适合想要ESL强化、IELTS备考和更明确学习制度的学生；Premium适合口语、职业英语、成人和更重视生活舒适度的学生。' },
    { image: 'assets/philippines/jic-main-ielts-class.png', title: 'IELTS与备考资源突出', text: 'JIC公开资料强调IELTS师资、模拟考试、词汇测试和自习制度，适合目标分数明确的学生。' },
    { image: 'assets/philippines/jic-premium-group-class.png', title: 'Premium主打Active Learning', text: 'Premium课程覆盖Speaking、TEP ESL、TOEIC、Working Holiday和Business Master，适合想把英语用在真实表达与职业场景的人。' },
    { image: 'assets/philippines/jic-premium-quad-room.png', title: '房型差异直接影响预算', text: '从Challenger四人Studio到Premium单人阳台房，4周住宿差距很大，建议报价时同步确认学习目标与生活期待。' },
  ];

  readonly suitableFor: FitItem[] = [
    { title: '想在碧瑶系统冲ESL或IELTS', text: '优先看Challenger校区，课程量、测试和自习制度更适合目标明确的学习节奏。' },
    { title: '想加强口语、表达或职场英文', text: 'Premium的Speaking、TEP ESL、Business Master、Working Holiday和TOEIC路线更容易匹配应用型目标。' },
    { title: '需要先控制预算再选校区', text: 'Challenger四人Studio或四人Loft常是预算入口，适合先用费用表做总价范围。' },
    { title: '成人、工作者或希望住得舒服', text: 'Premium校区房型和设施选择更丰富，适合重视舒适度、安静环境和交流空间的人。' },
  ];

  readonly notSuitableFor: FitItem[] = [
    { title: '只想看一个统一报价', text: 'JIC必须先分Challenger和Premium，再看课程、房型和旺季档期，不适合只凭学校名做决定。' },
    { title: '不想接受测试或晚间自习', text: 'Challenger的ESL/IELTS路线会更强调词汇测试、自习和课堂纪律，报名应先确认能否适应。' },
    { title: '旺季临近才想锁定单人房', text: 'Premium单人房、Semi Single和热门Challenger房型容易紧张，建议提前核空房。' },
    { title: '只想要海边度假感', text: 'JIC在碧瑶，优势是学习氛围、凉爽气候和长期投入，不是海岛度假型学校。' },
  ];

  readonly courses: CourseItem[] = [
    { name: 'Challenger ESL Flex / Lite / Core / Standard', type: 'Challenger 基础与综合ESL', lessons: '3-6节一对一 + 2节团体 + 2节Special Class', suitable: 'Flex适合轻量入门；Lite/Core/Standard按一对一课时递增，适合从基础到密集提升的学生。' },
    { name: 'Challenger IELTS Lite / Core / Standard', type: 'IELTS备考', lessons: '4-6节一对一 + 2节团体 + 2节Special Class', suitable: '适合有雅思分数目标、需要听说读写分科训练、模考复盘和晚间自习的人。' },
    { name: 'Challenger IELTS Guarantee', type: 'IELTS保证班', lessons: '6节一对一 + 2节团体 + 2节Special Class', suitable: '适合目标分数明确、可接受出勤与学习规则，并愿意额外支付保证班参加费的学生。' },
    { name: 'Premium Speaking Starter / Pro / Master', type: '口语强化', lessons: '4-6节一对一 + 1节团体 + 2节Special Class', suitable: 'Starter适合初学者；Pro/Master适合想提升流利度、逻辑表达、演讲和讨论的人。' },
    { name: 'Premium TEP ESL 8 / 9 / 10', type: '主题式ESL', lessons: '3-5节一对一 + 3节团体 + 2节Special Class', suitable: '通过旅行、艺术、音乐、烹饪等主题进行沉浸式表达训练，适合喜欢生活化学习的人。' },
    { name: 'Premium TOEIC / Working Holiday', type: '职业与考试方向', lessons: '3节一对一 + 3节团体 + 2节Special Class', suitable: '适合求职、打工度假、面试、简历、职场沟通或多益成绩目标。' },
    { name: 'Premium Business Master', type: '商务英语', lessons: '6节一对一 + 2节Special Class', suitable: '适合商务邮件、演示、会议、谈判和跨文化职场表达需求。' },
  ];

  courseFees: CourseFee[] = [
    { id: 'challenger-esl-flex', name: 'Challenger ESL Flex', tuition: 580, suitable: 'Challenger轻量ESL，适合低预算或先适应校区节奏' },
    { id: 'challenger-esl-lite', name: 'Challenger ESL Lite', tuition: 760, suitable: 'Challenger基础综合ESL，适合多数入门和稳步提升学生' },
    { id: 'challenger-esl-core', name: 'Challenger ESL Core', tuition: 860, suitable: '一对一课时更多，适合想加强输出和纠错的人' },
    { id: 'challenger-esl-standard', name: 'Challenger ESL Standard', tuition: 960, suitable: '高课时ESL，适合短期集中提升' },
    { id: 'challenger-ielts-lite', name: 'Challenger IELTS Lite', tuition: 960, suitable: 'IELTS入门或基础备考路线' },
    { id: 'challenger-ielts-core', name: 'Challenger IELTS Core', tuition: 1010, suitable: 'IELTS课时更密集，适合阶段性冲分' },
    { id: 'challenger-ielts-standard', name: 'Challenger IELTS Standard', tuition: 1060, suitable: '标准IELTS备考路线，适合明确分数目标' },
    { id: 'challenger-ielts-guarantee', name: 'Challenger IELTS Guarantee', tuition: 1060, suitable: 'IELTS保证班，另需确认保证班规则与参加费' },
    { id: 'premium-speaking-starter', name: 'Premium Speaking Starter', tuition: 800, suitable: '初学者友好口语课程，适合建立开口信心' },
    { id: 'premium-speaking-pro', name: 'Premium Speaking Pro', tuition: 975, suitable: '口语输出量更高，适合提升流利度与表达结构' },
    { id: 'premium-speaking-master', name: 'Premium Speaking Master', tuition: 1150, suitable: '高密度口语与表达训练，适合演讲、讨论和流利度目标' },
    { id: 'premium-tep-esl-8', name: 'Premium TEP ESL 8', tuition: 800, suitable: '主题式ESL入门，适合生活化英语学习' },
    { id: 'premium-tep-esl-9', name: 'Premium TEP ESL 9', tuition: 900, suitable: '主题式ESL进阶，团体互动比重高' },
    { id: 'premium-tep-esl-10', name: 'Premium TEP ESL 10', tuition: 1000, suitable: '主题式ESL高课时，适合想增加一对一训练的人' },
    { id: 'premium-working-holiday', name: 'Premium Working Holiday', tuition: 900, suitable: '打工度假、面试和工作场景英语准备' },
    { id: 'premium-toeic', name: 'Premium TOEIC', tuition: 900, suitable: '多益考试与职场英语基础' },
    { id: 'premium-business-master', name: 'Premium Business Master', tuition: 1150, suitable: '商务会议、邮件、演示和职场表达强化' },
  ];

  roomFees: RoomFee[] = [
    { id: 'challenger-single', name: 'Challenger 单人房', fee: 1300, note: '隐私最高，热门档期需提前确认' },
    { id: 'challenger-twin', name: 'Challenger 双人房', fee: 800, note: '预算与隐私较平衡的Challenger房型' },
    { id: 'challenger-quad-loft', name: 'Challenger 四人房Loft', fee: 750, note: 'Loft房型，适合控制总价' },
    { id: 'challenger-quad-studio', name: 'Challenger 四人房Studio', fee: 600, note: '默认预算参考，适合先做总价估算' },
    { id: 'premium-single-a-balcony', name: 'Premium 单人房A Balcony', fee: 1450, note: 'Premium高规格单人房，舒适度和预算都最高' },
    { id: 'premium-semi-single', name: 'Premium Semi Single / 1F Single Use', fee: 1250, note: '兼顾隐私与预算的Premium单人方向' },
    { id: 'premium-twin-a-balcony', name: 'Premium 双人房A Balcony', fee: 950, note: '带阳台双人房，适合重视生活舒适度' },
    { id: 'premium-twin-b-no-balcony', name: 'Premium 双人房B No Balcony', fee: 850, note: '无阳台双人房，价格比A房型低' },
    { id: 'premium-quad-a-balcony', name: 'Premium 四人房A Balcony', fee: 750, note: 'Premium预算与设施平衡，带阳台' },
    { id: 'premium-quad-b-no-balcony', name: 'Premium 四人房B No Balcony', fee: 650, note: 'Premium预算入口，无阳台房型' },
  ];

  readonly schedule: ScheduleItem[] = [
    { time: '07:00 - 08:00', title: '早餐 / 晨间准备', text: 'Challenger学生通常需要为词汇测试、课堂和自习安排预留稳定节奏。' },
    { time: '08:00 - 12:00', title: '上午一对一与团体课', text: 'ESL、IELTS、Speaking或Career课程会按校区和学生水平安排科目。' },
    { time: '12:00 - 13:00', title: '午餐与短休', text: '学校餐厅与宿舍都在校区生活圈内，适合把通勤时间压到最低。' },
    { time: '13:00 - 17:00', title: '下午课程与输出训练', text: 'Challenger偏备考与基础强化，Premium偏主题、口语和职业场景应用。' },
    { time: '18:00 - 19:00', title: '晚餐 / 个人时间', text: '不同校区门禁和生活规则不同，报名时应按当期规定确认。' },
    { time: '19:30 - 22:00', title: '词汇测试 / 自习 / 选修', text: 'Challenger公开资料中有晚间词汇测试和自习安排，适合需要制度推动的人。' },
  ];

  localFees: LocalFee[] = [
    { item: 'SSP', amount: 'PHP 7,800', note: '特别学习许可，通常到校支付' },
    { item: 'SSP I-Card', amount: 'PHP 4,500', note: '与SSP相关的I-Card申请费用' },
    { item: 'ACR I-Card', amount: 'PHP 4,000', note: '长期学习或延签时通常需要' },
    { item: '签证延签', amount: 'PHP 4,940 起', note: '8周首次延签参考，后续按周数递增' },
    { item: 'ID Card', amount: 'PHP 200', note: '学生证或校内识别费用' },
    { item: '宿舍保证金', amount: 'PHP 3,000', note: '退房检查后按学校规则退还' },
    { item: '水电费', amount: 'PHP 3,000', note: '4周参考，按学校规则或实际使用调整' },
    { item: '洗衣费', amount: 'PHP 1,200', note: '4周参考' },
    { item: '管理费', amount: 'PHP 1,000', note: '4周参考' },
    { item: '教材费', amount: 'PHP 1,500 - 1,900', note: '按ESL、TOEIC、IELTS等课程不同收取' },
    { item: 'IELTS保证班参加费', amount: 'PHP 18,000', note: '仅IELTS Guarantee相关，报名前需确认规则' },
    { item: '指定接机', amount: 'PHP 3,000', note: '马尼拉或克拉克指定接机日参考' },
  ];

  readonly serviceSteps: ProcessStep[] = [
    { icon: 'person_search', title: '先做校区匹配', text: '根据英语基础、目标分数、口语需求、职业规划、预算和房型偏好，先判断Challenger还是Premium。' },
    { icon: 'fact_check', title: '确认课程和房型', text: '免费协助确认JIC课程、房型、空房、入学日、旺季附加费、保证班规则和正式报价。' },
    { icon: 'assignment_turned_in', title: '协助入境和签证', text: '思达免费协助菲律宾入境及签证相关手续，学生按顾问指引准备资料。' },
    { icon: 'inventory', title: '发送行前清单', text: '出发前提供学习资料、费用清单、行李清单、接机和到校注意事项。' },
    { icon: 'support_agent', title: '到校后继续跟进', text: '如遇到调课、住宿、学习方法或学校沟通问题，可继续联系思达协助。' },
    { icon: 'location_on', title: '国内顾问与当地协作', text: '国内顾问与菲律宾当地工作人员协作，重要节点持续跟进。' },
  ];

  readonly sidaJicReasons: SidaJicReason[] = [
    { number: '01', title: '先判断JIC哪个校区适合', text: '不会只按学校名推荐，会把Challenger和Premium的学习强度、课程目标、生活舒适度和预算拆开比较。', image: 'assets/cia/sida-why-action-selection.jpg', alt: '思达启航顾问帮助学生选择JIC校区' },
    { number: '02', title: '课程、住宿和当地费用提前算清', text: '0中介服务费，课程费、住宿费、旺季附加费、保证班费用和到校PHP费用逐项说明。', image: 'assets/cia/sida-why-action-fees.jpg', alt: '思达启航顾问核算菲律宾碧瑶JIC语言学校费用' },
    { number: '03', title: '正式文件与收费可核对', text: '国内公司签约，报价、录取、付款节点和学校文件都可逐项核验。', image: 'assets/cia/sida-why-action-contract.jpg', alt: '思达启航正式合同与学校文件核验' },
    { number: '04', title: '出发前每一步有人提醒', text: '签证、eTravel、入学文件、付款、接机、换汇和当地费用准备都会提前提醒。', image: 'assets/cia/sida-why-action-departure.jpg', alt: '菲律宾游学出发前文件和行李准备' },
    { number: '05', title: '服务持续到完成学习回国', text: '换老师、调课、住宿、账单、续读或转校问题都可以继续协助。', image: 'assets/cia/sida-why-action-followup.jpg', alt: '思达启航顾问持续跟进学生学习情况' },
    { number: '06', title: '深圳总部 + 菲律宾当地支持', text: '国内顾问与菲律宾当地工作人员协作，遇到重要节点有人跟进。', image: 'assets/cia/sida-why-action-team.jpg', alt: '思达启航菲律宾和深圳服务团队' },
  ];

  readonly sidaJicTrustBadges: SidaJicTrustBadge[] = [
    { icon: 'description', label: '国内正式公司合同' },
    { icon: 'verified_user', label: '学校合作与文件核验' },
    { icon: 'local_offer', label: '费用透明与同条件保价' },
    { icon: 'apartment', label: '深圳总部 + 菲律宾支持' },
  ];

  readonly schoolServices = ['机场接机', '入学说明', '分级测试', '课程咨询', '词汇测试', '晚间自习', '宿舍清洁', '洗衣服务', '证件协助', '校区活动'];
  readonly campusActivities = ['新生说明会', '英语口语活动', 'IELTS模拟考试', '职业主题活动', '跨国学生交流'];
  readonly weekendActivities = ['SM Baguio', 'Burnham Park', 'Baguio夜市', 'Mines View Park', 'Camp John Hay'];
  readonly notes = [
    'JIC必须先分Challenger和Premium校区，再决定课程、房型和费用。',
    'Challenger ESL / IELTS更适合需要测试、自习和明确学习制度的学生。',
    'Premium更适合口语、职业英文、成人学习和更舒适住宿需求。',
    '页面价格为2026年公开费用参考，最终会随学校政策、优惠、房型空位和汇率变化。',
    '旺季附加费按JIC公开JPY 5,000/周折算为USD 34.5/周，正式报价需按学校当期账单确认。',
    '最终报名以学校正式录取、付款节点和顾问确认报价为准。',
  ];
  readonly faqs: FaqItem[] = [
    { question: '菲律宾碧瑶JIC语言学校的Challenger和Premium怎么选？', answer: '目标是ESL基础强化、IELTS备考或需要更强制度，优先看Challenger；目标是口语、职场英文、打工度假、多益或更舒适生活，优先看Premium。' },
    { question: 'JIC适合零基础学生吗？', answer: '可以。Challenger ESL Flex / Lite适合基础弱的学生，Premium Speaking Starter也适合初学者；具体要按自律程度和生活偏好判断校区。' },
    { question: '页面报价包含全部费用吗？', answer: '不包含全部。前期支付参考主要包含注册费、课程费、住宿费和旺季附加费；到校后还需准备SSP、SSP I-Card、签证延签、ACR I-Card、教材、水电、押金、洗衣和接机等PHP费用。' },
    { question: 'IELTS Guarantee是不是只付课程费就可以？', answer: '不是。IELTS Guarantee除4周课程费外，还需确认保证班参加费、出勤和分数保证规则，页面按公开资料列出PHP 18,000参加费参考。' },
    { question: '思达会协助签证和入境吗？', answer: '会。通过思达报名JIC，思达顾问会免费协助菲律宾入境及签证相关手续，并在出发前发送行前清单和费用提醒。' },
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
          schools.find((item) => item.name.toUpperCase().includes('JIC')) ??
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
        this.selectedCourseId = this.courseFees.find((course) => course.id === 'challenger-esl-lite')?.id ?? this.courseFees[0].id;
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
        this.selectedRoomId = this.roomFees.find((room) => room.id === 'challenger-quad-studio')?.id ?? this.roomFees[0].id;
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
    if (name.includes('Challenger') && name.includes('单人')) return 'challenger-single';
    if (name.includes('Challenger') && name.includes('双人')) return 'challenger-twin';
    if (name.includes('Challenger') && name.includes('Loft')) return 'challenger-quad-loft';
    if (name.includes('Challenger') && name.includes('Studio')) return 'challenger-quad-studio';
    if (name.includes('Premium') && name.includes('单人房A')) return 'premium-single-a-balcony';
    if (name.includes('Premium') && name.includes('Semi')) return 'premium-semi-single';
    if (name.includes('Premium') && name.includes('双人房A')) return 'premium-twin-a-balcony';
    if (name.includes('Premium') && name.includes('双人房B')) return 'premium-twin-b-no-balcony';
    if (name.includes('Premium') && name.includes('四人房A')) return 'premium-quad-a-balcony';
    if (name.includes('Premium') && name.includes('四人房B')) return 'premium-quad-b-no-balcony';
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

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

type GalleryCategory = '全部' | '校园' | '教室' | '住宿' | '餐厅' | '设施';

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
interface SidaPinesReason { number: string; title: string; text: string; image: string; alt: string; }
interface SidaPinesTrustBadge { icon: string; label: string; }

@Component({
  selector: 'app-pines-school-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './pines-school-detail.component.html',
  styleUrls: [
    '../cebu-school-detail-layout.css',
    '../cebu-school-detail-content.css',
    '../cebu-school-detail-responsive.css',
    '../ev-school/ev-school-detail.component.css',
    './pines-school-detail.component.css',
  ],
})
export class PinesSchoolDetailComponent implements OnInit {
  private readonly schoolService = inject(SchoolService);
  private readonly pricingSchoolSearchName = 'PINES';
  private readonly pricingSchoolNames = ['菲律宾碧瑶PINES语言学校', 'PINES International Academy'];
  private readonly courseFeeOrder = [
    'light-esl-4',
    'power-speaking',
    'intensive-esl',
    'power-esl-5',
    'power-esl-7',
    'toeic-toeic-speaking',
    'business-english-practical',
    'business-english-executive',
    'parents-course',
    'junior-family-course',
    'pre-ielts',
    'ielts-regular',
    'ielts-speaking-and-writing-intensive',
    'ielts-guarantee-8-weeks',
    'ielts-guarantee-12-weeks',
  ];
  private readonly roomFeeOrder = ['sextuple', '5b-solo', 'quad', 'twin-b', 'twin-a', 'single-c', 'single-b', 'single-a'];

  readonly galleryCategories: GalleryCategory[] = ['全部', '校园', '教室', '住宿', '餐厅', '设施'];
  selectedGalleryCategory: GalleryCategory = '全部';
  registrationFee = 130;
  readonly discount = 1;
  seasonalFeePerWeek = 40;
  readonly usdToCny = 7.2;
  readonly weekOptions = [1, 2, 3, 4, 8, 12, 16, 24];
  selectedCourseId = 'light-esl-4';
  selectedRoomId = 'sextuple';
  selectedWeeks = 4;
  selectedStartDate = '2026-08-23';
  quoteCalculated = false;

  readonly quickInfo: QuickInfo[] = [
    { icon: 'terrain', label: '城市', value: '碧瑶 Baguio', note: '凉爽山城，学习氛围集中' },
    { icon: 'apartment', label: '校区', value: 'Main / IELTS Campus', note: '按ESL、TOEIC、雅思目标分校区' },
    { icon: 'verified_user', label: '管理模式', value: '半斯巴达 / 强化可选', note: '可叠加EB PRO、晨间与晚间学习' },
    { icon: 'school', label: '课程选项', value: 'ESL / IELTS / TOEIC', note: '另有商务、亲子、青少年方向' },
    { icon: 'bed', label: '住宿房型', value: '单人到六人房', note: '5B Solo和热门房型需提前核房' },
    { icon: 'event_available', label: '入学节奏', value: '双周入学为主', note: '官方表单列出2026-2028入学日' },
  ];

  readonly galleryImages: GalleryImage[] = [
    { category: '校园', title: 'PINES Main Campus外观', description: 'PINES官方Facilities页面展示的Main Campus校区外观。', src: 'assets/philippines/pines-campus-hero.jpg' },
    { category: '校园', title: 'PINES主校区楼体', description: '官方首页设施区展示的Main Campus Building，适合先判断校区环境。', src: 'assets/philippines/pines-campus-building.jpg' },
    { category: '教室', title: '一对一教室', description: 'PINES官方Main Campus Facilities页面展示的一对一教室，用于口语和个别纠错。', src: 'assets/philippines/pines-one-to-one-classroom.jpg' },
    { category: '教室', title: '4:1小团体教室', description: '官方教室照片展示的小团体课程空间，适合讨论、表达和综合训练。', src: 'assets/philippines/pines-group-classroom.jpg' },
    { category: '住宿', title: 'Main Campus单人房', description: 'PINES官方住宿页面展示的单人房型，适合重视隐私和学习空间的学生。', src: 'assets/philippines/pines-dormitory-single.jpg' },
    { category: '住宿', title: 'Main Campus六人房', description: '官方多人房照片展示六人房空间，适合控制预算但需提前确认空房。', src: 'assets/philippines/pines-dormitory-sextuple.jpg' },
    { category: '餐厅', title: 'PINES Cafeteria', description: 'PINES官方2026餐厅照片，展示校内自助取餐和厨房区域。', src: 'assets/philippines/pines-cafeteria.jpg' },
    { category: '设施', title: 'Library Main', description: '官方Facilities页面展示的图书与学习资源空间。', src: 'assets/philippines/pines-library.jpg' },
    { category: '设施', title: 'Front Desk', description: '官方Facilities页面展示的前台与学生支持空间。', src: 'assets/philippines/pines-front-desk.jpg' },
  ];

  readonly basicInfo: BasicInfoRow[] = [
    { label: '学校名称', value: '菲律宾碧瑶PINES语言学校' },
    { label: '英文名称', value: 'PINES International Academy' },
    { label: '创校时间', value: '2001年' },
    { label: 'Main Campus地址', value: '#3 Rommel Mansion Building Ignacio Villamor St., Lualhati, Baguio City' },
    { label: 'IELTS Campus地址', value: '#49 Chapis Village, Marcos Highway, Baguio City' },
    { label: '课程方向', value: 'Power Speaking、Intensive ESL、Power ESL、TOEIC、Family、Pre-IELTS、IELTS、IELTS Guarantee' },
    { label: '住宿房型', value: '单人房、双人房、三人房、四人房、五人Solo、六人房；不同校区可选不同' },
    { label: '官方资质', value: 'TESDA、Bureau of Immigration、Department of Tourism、SEC、Baguio City Hall等登记' },
  ];

  readonly highlights: Highlight[] = [
    { image: 'assets/philippines/pines-campus-hero.jpg', title: '碧瑶老牌学习型学校', text: 'PINES自2001年创立，是碧瑶代表性英语学校之一，适合把学习放在第一位的学生。' },
    { image: 'assets/philippines/pines-campus-building.jpg', title: 'Main与IELTS校区分流', text: 'Main Campus更适合ESL、口语、TOEIC和亲子方向；IELTS Campus更适合雅思目标和保证班。' },
    { image: 'assets/philippines/pines-one-to-one-classroom.jpg', title: '课程强度选择细', text: '从Light ESL 4到Power ESL 7、Intensive ESL和EB PRO，可按自律程度和目标调整强度。' },
    { image: 'assets/philippines/pines-library.jpg', title: '雅思保证班规则清晰', text: '官方雅思保证班强调每周六模考、咨询、入学分数门槛、95%出勤和官方考试安排。' },
  ];

  readonly suitableFor: FitItem[] = [
    { title: '想在碧瑶专心学习', text: '碧瑶比海岛城市更安静，PINES适合能接受学习型生活节奏的学生。' },
    { title: '需要从ESL过渡到考试目标', text: '可以先在Main Campus打基础，再按程度考虑IELTS Campus或考试课程。' },
    { title: '雅思、TOEIC或口语目标明确', text: 'PINES课程线细，适合按分数目标、开口量或一对一比例做方案。' },
    { title: '长期学习或预算控制型学生', text: '多人房、Light ESL和Power ESL组合适合做4-24周预算规划。' },
  ];

  readonly notSuitableFor: FitItem[] = [
    { title: '只想轻松度假和海边活动', text: 'PINES和碧瑶定位更偏学习，不适合把周末海岛体验放在第一位。' },
    { title: '无法接受较强规则', text: 'EB PRO、晚自习、模考和保证班要求需要提前确认并遵守。' },
    { title: '完全零基础直接冲保证班', text: '雅思保证班有入学分数门槛，未达标可能需降级到Pre-IELTS或IELTS Regular。' },
    { title: '临近旺季才锁房型', text: '六人房、5B Solo、单人房和寒暑假档期容易紧张，需要提前核空房。' },
  ];

  readonly courses: CourseItem[] = [
    { name: 'Light ESL 4', type: '轻量综合英语', lessons: '每天4节一对一', suitable: '适合预算优先、先建立基础和学习节奏的学生。' },
    { name: 'Power Speaking', type: '口语强化', lessons: '4节一对一 + 4节小团体', suitable: '适合想集中提升开口量、表达流利度和综合沟通的学生。' },
    { name: 'Intensive ESL', type: '密集综合英语', lessons: '5节一对一 + 2节4:1小组课', suitable: '适合短中期希望增加纠错和输出训练的学生。' },
    { name: 'Power ESL 5 / 7', type: '高一对一比例', lessons: '每天5或7节一对一', suitable: '适合目标明确、希望把课程集中在一对一训练的人。' },
    { name: 'TOEIC / TOEIC Speaking', type: '多益方向', lessons: '考试科目训练 + 实战练习', suitable: '适合求职、升学或企业英语需求学生。' },
    { name: 'Pre-IELTS / IELTS Regular', type: '雅思备考', lessons: '雅思阅读、写作、听力、口语专项', suitable: '适合已有雅思目标，需先建立题型和解题体系的学生。' },
    { name: 'IELTS Guarantee', type: '雅思保证班', lessons: '8或12周，周六模考与监督晚自习', suitable: '适合已有入学分数、目标5.5-7.0并能遵守出勤和模考要求的学生。' },
    { name: 'Parents / Junior Family', type: '亲子与青少年', lessons: '家长与孩子课程分开安排', suitable: '适合家庭同行，需提前确认年龄、房型和监护规则。' },
    { name: 'Business English', type: '商务英语', lessons: 'Practical / Executive方向', suitable: '适合职场沟通、会议、演示和专业表达需求。' },
  ];

  courseFees: CourseFee[] = [
    { id: 'light-esl-4', name: 'Light ESL 4', tuition: 850, suitable: '轻量一对一ESL，适合预算优先和基础提升' },
    { id: 'power-speaking', name: 'Power Speaking', tuition: 930, suitable: '口语强化，适合开口量和表达训练' },
    { id: 'intensive-esl', name: 'Intensive ESL', tuition: 1020, suitable: '5节一对一，短期强化更合适' },
    { id: 'power-esl-5', name: 'Power ESL 5', tuition: 980, suitable: '一对一比例更高，适合目标明确学生' },
    { id: 'power-esl-7', name: 'Power ESL 7', tuition: 1220, suitable: '高强度一对一，适合集中突破' },
    { id: 'toeic-toeic-speaking', name: 'TOEIC / TOEIC Speaking', tuition: 980, suitable: '多益方向，适合求职或升学需求' },
    { id: 'parents-course', name: 'Parents Course', tuition: 750, suitable: '亲子同行家长课程' },
    { id: 'junior-family-course', name: 'Junior Family Course', tuition: 1500, suitable: '青少年亲子课程，规则需提前确认' },
    { id: 'pre-ielts', name: 'Pre-IELTS', tuition: 1100, suitable: '雅思入门，适合还未直接进入Regular的学生' },
    { id: 'ielts-regular', name: 'IELTS Regular', tuition: 1100, suitable: '雅思常规备考' },
    { id: 'ielts-speaking-and-writing-intensive', name: 'IELTS Speaking & Writing Intensive', tuition: 1200, suitable: '雅思口写强化' },
    { id: 'ielts-guarantee-8-weeks', name: 'IELTS Guarantee 8 Weeks', tuition: 1450, suitable: '8周USD 2,900折算4周；需符合入学与出勤规则' },
    { id: 'ielts-guarantee-12-weeks', name: 'IELTS Guarantee 12 Weeks', tuition: 1350, suitable: '12周USD 4,050折算4周；需符合入学与出勤规则' },
  ];

  roomFees: RoomFee[] = [
    { id: 'sextuple', name: '六人房', fee: 570, note: 'Main Campus可选，预算压力最低，需确认空房' },
    { id: '5b-solo', name: '5B Solo', fee: 650, note: '2026年8月23日起Main可选，兼顾预算和相对私密' },
    { id: 'quad', name: '四人房', fee: 700, note: '多人房中预算与舒适度较平衡' },
    { id: 'twin-b', name: '双人房B', fee: 840, note: '适合同伴同行或希望更少室友' },
    { id: 'twin-a', name: '双人房A', fee: 870, note: '双人房更舒适，热门档期需早确认' },
    { id: 'single-c', name: '单人房C', fee: 970, note: '单人房入门选择，适合重视隐私' },
    { id: 'single-b', name: '单人房B', fee: 1150, note: '男性限定资料较常见，需按校区和档期确认' },
    { id: 'single-a', name: '单人房A', fee: 1250, note: '隐私和舒适度最高，预算较高' },
  ];

  readonly schedule: ScheduleItem[] = [
    { time: '07:00 - 08:00', title: '早餐 / 可选晨间学习', text: 'Main Campus可按课程和EB PRO安排晨间学习或单词测试。' },
    { time: '08:10 - 12:00', title: '上午课程', text: '一对一、小团体、ESL或考试专项课程，具体按课程表安排。' },
    { time: '12:00 - 13:00', title: '午餐与短休', text: '校内用餐后整理学习资料，下午继续课程。' },
    { time: '13:00 - 17:05', title: '下午课程', text: '继续一对一、团体课、雅思口写或听读专项训练。' },
    { time: '17:05 - 19:00', title: '晚餐与休息', text: '是否外出、门禁和自习安排需按校区与管理模式确认。' },
    { time: '19:00 - 22:00', title: '选修 / EB PRO / 监督晚自习', text: '雅思保证班和强化项目通常对晚自习、模考和出勤要求更严格。' },
  ];

  localFees: LocalFee[] = [
    { item: 'SSP', amount: 'PHP 7,800', note: '特别学习许可，通常到校支付' },
    { item: 'SSP I-Card', amount: 'PHP 4,500', note: '以学校现场收费为准' },
    { item: 'ACR I-Card', amount: 'PHP 4,000', note: '长期学习或延签时通常需要' },
    { item: '签证延签', amount: 'PHP 4,940 起', note: '8周首次延签参考，周数越长金额越高' },
    { item: '教材费', amount: 'PHP 1,100', note: '4周5本以下参考' },
    { item: '教材费（6册以上）', amount: 'PHP 1,500', note: '4周6本以上参考' },
    { item: '水电费', amount: 'PHP 3,000', note: '4周参考，按学校规则调整' },
    { item: '宿舍保证金', amount: 'PHP 4,000', note: '退房检查后按学校规则退还' },
    { item: '洗衣费', amount: 'PHP 150 / 次', note: '单次7kg以内参考' },
    { item: '指定接机', amount: 'PHP 3,000', note: '马尼拉或克拉克指定接机日参考' },
  ];

  readonly serviceSteps: ProcessStep[] = [
    { icon: 'person_search', title: '判断Main或IELTS校区', text: '先了解英语基础、雅思目标、预算、入学日期和能接受的管理强度。' },
    { icon: 'fact_check', title: '确认课程、房型和费用', text: '免费协助确认PINES课程、房型、校区、空房、优惠和正式报价。' },
    { icon: 'assignment_turned_in', title: '协助入境和签证手续', text: '思达免费协助办理菲律宾入境及签证相关手续，学生只需按顾问指引准备资料。' },
    { icon: 'inventory', title: '发送学习资料和行前清单', text: '入学前发送学习资料、行李清单、费用清单、接机和到校注意事项。' },
    { icon: 'support_agent', title: '到校后继续跟进', text: '遇到换老师、调课、学习方法、宿舍生活或学校沟通问题，可继续联系思达协助。' },
    { icon: 'location_on', title: '菲律宾当地支持', text: '国内顾问与菲律宾当地工作人员协作，重要节点持续跟进。' },
  ];

  readonly sidaPinesReasons: SidaPinesReason[] = [
    { number: '01', title: '正式合同与学校文件可核验', text: '国内公司签约，PINES报价、录取文件及收费凭证均可逐项核对。', image: 'assets/cia/sida-why-action-contract.jpg', alt: '思达启航正式合同与学校文件核验' },
    { number: '02', title: '校区、课程和费用提前算清', text: '0中介服务费，课程费、住宿费、旺季附加费和到校费用逐项说明。', image: 'assets/cia/sida-why-action-fees.jpg', alt: '思达启航顾问为学生核算菲律宾碧瑶PINES语言学校费用' },
    { number: '03', title: '先判断PINES是否适合', text: '根据雅思目标、英语基础、自律程度和预算，帮你判断Main或IELTS校区是否匹配。', image: 'assets/cia/sida-why-action-selection.jpg', alt: '思达启航顾问帮助学生选择适合的英语学校' },
    { number: '04', title: '出发前每一步有人提醒', text: '签证、eTravel、入学文件、付款、接机和当地费用准备都会提前提醒。', image: 'assets/cia/sida-why-action-departure.jpg', alt: '菲律宾游学出发前文件和行李准备' },
    { number: '05', title: '服务持续到完成学习回国', text: '换老师、调课、住宿、账单、续读或转校问题都可以继续协助。', image: 'assets/cia/sida-why-action-followup.jpg', alt: '思达启航顾问持续跟进学生学习情况' },
    { number: '06', title: '深圳总部 + 菲律宾当地协作', text: '国内顾问与菲律宾工作人员协作，重要节点有人跟进。', image: 'assets/cia/sida-why-action-team.jpg', alt: '思达启航菲律宾和深圳服务团队' },
  ];

  readonly sidaPinesTrustBadges: SidaPinesTrustBadge[] = [
    { icon: 'description', label: '国内正式公司合同' },
    { icon: 'verified_user', label: '学校合作与文件核验' },
    { icon: 'local_offer', label: '费用透明与同条件保价' },
    { icon: 'apartment', label: '深圳总部 + 菲律宾支持' },
  ];

  readonly schoolServices = ['机场接机', '入学说明', '分级测试', '课程咨询', '模考安排', '晚间自习', '宿舍清洁', '洗衣服务', '证件协助', '学习咨询'];
  readonly campusActivities = ['新生说明会', '英语活动', '体育活动', '单词测试', '雅思模考'];
  readonly weekendActivities = ['SM Baguio', '市区咖啡厅', 'Baguio夜市', 'Burnham Park', '周末短途旅行'];
  readonly notes = [
    'PINES要先分Main Campus和IELTS Campus，再决定课程，不建议只按学校名报名。',
    '雅思保证班有入学分数、出勤率、模考和校规要求，需逐项确认。',
    '5B Solo、六人房、单人房和寒暑假档期建议尽早确认空房。',
    '费用表为2026年公开参考，最终会随学校政策、优惠、汇率和个人情况变化。',
    '最终报名以学校正式录取、付款节点和顾问确认报价为准。',
  ];
  readonly faqs: FaqItem[] = [
    { question: '菲律宾碧瑶PINES语言学校适合零基础吗？', answer: '可以先看Main Campus的Light ESL、Power Speaking或Intensive ESL。完全零基础不建议直接报名雅思保证班，因为保证班有入学分数门槛。' },
    { question: 'Main Campus和IELTS Campus怎么选？', answer: '想提升基础口语、综合英语、TOEIC或亲子方向，优先看Main Campus；已有雅思目标和一定基础，再考虑IELTS Campus。' },
    { question: '页面上的报价包含全部费用吗？', answer: '不包含全部。前期支付参考主要包含注册费、课程费、住宿费和旺季附加费；到校后仍需支付SSP、SSP I-Card、ACR I-Card、签证延签、教材、水电、押金等当地费用。' },
    { question: 'PINES雅思保证班有什么要求？', answer: '官方资料列出8或12周、5.5到7.0目标分数、入学分数门槛、每周六模考、95%出勤、100%参加模考等规则，报名时需按目标分数逐项确认。' },
    { question: '思达会协助签证和入境吗？', answer: '会。通过思达报名PINES，思达顾问会免费协助菲律宾入境及签证相关手续，并在出发前发送行前清单和费用提醒。' },
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
          schools.find((item) => item.name.toUpperCase().includes('PINES')) ??
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
      .map((lesson) => ({ id: this.slugifyPriceKey(lesson.name), name: lesson.name, tuition: lesson.price, suitable: lesson.description || lesson.note || '请联系顾问确认适合人群' }))
      .sort((a, b) => this.orderIndex(this.courseFeeOrder, a.id) - this.orderIndex(this.courseFeeOrder, b.id));
    if (databaseCourseFees.length > 0) {
      this.courseFees = databaseCourseFees;
      if (!this.courseFees.some((course) => course.id === this.selectedCourseId)) this.selectedCourseId = this.courseFees.find((course) => course.id === 'light-esl-4')?.id ?? this.courseFees[0].id;
    }

    const databaseRoomFees = rooms
      .filter((room) => room.week === 4)
      .map((room) => ({ id: this.createRoomId(room.name), name: room.name, fee: room.price, note: room.description || '请联系顾问确认空房' }))
      .sort((a, b) => this.orderIndex(this.roomFeeOrder, a.id) - this.orderIndex(this.roomFeeOrder, b.id));
    if (databaseRoomFees.length > 0) {
      this.roomFees = databaseRoomFees;
      if (!this.roomFees.some((room) => room.id === this.selectedRoomId)) this.selectedRoomId = this.roomFees.find((room) => room.id === 'sextuple')?.id ?? this.roomFees[0].id;
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

  get filteredGalleryImages(): GalleryImage[] { return this.selectedGalleryCategory === '全部' ? this.galleryImages : this.galleryImages.filter((image) => image.category === this.selectedGalleryCategory); }
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
  get quoteCnyText(): string { const rounded = Math.round((this.quoteUsd * this.usdToCny) / 100) * 100; return `约 ${rounded.toLocaleString('zh-CN')} 元起`; }
  get discountText(): string { return this.discount === 1 ? '优惠需顾问确认，参考范围' : `${Math.round(this.discount * 100)} 折扣范围`; }

  formatUsd(value: number): string { return value.toLocaleString('en-US', { minimumFractionDigits: Number.isInteger(value) ? 0 : 1, maximumFractionDigits: 1 }); }
  private slugifyPriceKey(value: string): string { return value.toLowerCase().replace(/&/g, 'and').replace(/\//g, ' ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
  private orderIndex(order: string[], value: string): number { const index = order.indexOf(value); return index === -1 ? Number.MAX_SAFE_INTEGER : index; }
  private createRoomId(name: string): string {
    if (name.includes('六人')) return 'sextuple';
    if (name.includes('5B') || name.includes('5人')) return '5b-solo';
    if (name.includes('四人')) return 'quad';
    if (name.includes('双人房B')) return 'twin-b';
    if (name.includes('双人房A')) return 'twin-a';
    if (name.includes('单人房C')) return 'single-c';
    if (name.includes('单人房B')) return 'single-b';
    if (name.includes('单人房A')) return 'single-a';
    return this.slugifyPriceKey(name);
  }
  private currencyCodeForDisplay(code?: string): string { return !code ? 'USD' : code.toUpperCase() === 'PESO' ? 'PHP' : code.toUpperCase(); }
  private formatCurrencyAmount(fee: SchoolFeeDTO): string { return `${this.currencyCodeForDisplay(fee.currencyCode)} ${fee.fee.toLocaleString('en-US', { minimumFractionDigits: Number.isInteger(fee.fee) ? 0 : 1, maximumFractionDigits: 1 })}`; }
  private cleanFeeDescription(description?: string): string { return description ? description.replace(/^到校支付费用；/, '').replace(/^前期支付费用；/, '') : '以学校现场收费为准'; }
}

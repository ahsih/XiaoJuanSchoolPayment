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
interface SidaCpiReason {
  number: string;
  title: string;
  text: string;
  image: string;
  alt: string;
}
interface SidaCpiTrustBadge { icon: string; label: string; }

@Component({
  selector: 'app-cpi-school-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './cpi-school-detail.component.html',
  styleUrls: [
    '../cebu-school-detail-layout.css',
    '../cebu-school-detail-content.css',
    '../cebu-school-detail-responsive.css',
    '../ev-school/ev-school-detail.component.css',
  ],
})
export class CpiSchoolDetailComponent implements OnInit {
  private readonly schoolService = inject(SchoolService);
  private readonly pricingSchoolSearchName = 'CPI';
  private readonly pricingSchoolNames = ['菲律宾宿务CPI语言学校', 'CPI Cebu Pelis Institute'];
  private readonly courseFeeOrder = ['esl-general-15', 'esl-intensive', 'toeic-preparatory', 'toefl-preparatory', 'ielts-preparatory', 'toeic-general', 'toefl-general', 'ielts-general', 'toeic-intensive', 'toefl-intensive', 'ielts-intensive', 'ielts-guarantee', 'toefl-guarantee', 'toeic-guarantee', 'junior-6-15', 'parents', 'esp-bridge', 'esp-general'];
  private readonly roomFeeOrder = ['building-a-single', 'building-a-double', 'building-a-triple', 'building-a-quad', 'building-b-single', 'building-b-double-a', 'building-b-double-b', 'building-b-triple', 'building-b-quad', 'building-b-six'];
  private readonly shortTermRatios: Record<number, number> = { 1: 0.375, 2: 0.65, 3: 0.9 };

  readonly galleryCategories: GalleryCategory[] = ['全部', '校园', '教室', '住宿', '餐厅', '设施'];
  selectedGalleryCategory: GalleryCategory = '全部';
  registrationFee = 100;
  readonly discount = 1;
  seasonalFeePerWeek = 30;
  readonly usdToCny = 7.2;
  readonly weekOptions = [1, 2, 3, 4, 8, 12];
  selectedCourseId = 'esl-general-15';
  selectedRoomId = 'building-a-quad';
  selectedWeeks = 4;
  selectedStartDate = '2026-05-18';
  quoteCalculated = false;

  readonly quickInfo: QuickInfo[] = [
    { icon: 'villa', label: '学校类型', value: '度假村型半斯巴达', note: 'Nivel Hills 校园型学校' },
    { icon: 'groups', label: '适合人群', value: '成人 / 青少年 / 亲子', note: '低龄和亲子需提前确认规则' },
    { icon: 'verified_user', label: '管理模式', value: '半斯巴达管理', note: '学习管理与生活舒适度并重' },
    { icon: 'school', label: '课程选项', value: 'ESL / IELTS / TOEIC', note: '另有口语、商务、青少年和家长课程' },
    { icon: 'bed', label: '住宿房型', value: 'A栋 / B栋', note: '热门房型和家庭房需早确认' },
    { icon: 'event_available', label: '校区位置', value: 'Nivel Hills, Lahug', note: '宿务半山安静校园环境' },
  ];

  readonly galleryImages: GalleryImage[] = [
    { category: '校园', title: 'CPI泳池校园', description: '度假村式校园氛围，是CPI最明显的环境卖点。', src: 'assets/cpi/campus-pool.jpg' },
    { category: '校园', title: 'CPI校园外观', description: '位于Nivel Hills / Lahug，校园、住宿和设施集中。', src: 'assets/cpi/campus-exterior.jpg' },
    { category: '教室', title: '一对一教室', description: '用于综合英语、口语、考试专项和商务课程。', src: 'assets/cpi/classroom.jpg' },
    { category: '教室', title: '团体教室', description: '小团体和大团体课程用于讨论、表达和综合训练。', src: 'assets/cpi/group-classroom.jpg' },
    { category: '住宿', title: 'Superior房型', description: '默认报价参考房型，预算压力相对低。', src: 'assets/cpi/dorm-room.jpg' },
    { category: '餐厅', title: '学生餐厅', description: '校内用餐，适合希望学习生活集中管理的学生。', src: 'assets/cpi/dining-hall.jpg' },
    { category: '设施', title: '健身房', description: '课后运动和体能恢复使用。', src: 'assets/cpi/gym.jpg' },
    { category: '设施', title: '校内咖啡区', description: '课后休息、交流和轻松学习空间。', src: 'assets/cpi/cafe.jpg' },
    { category: '设施', title: '运动空间', description: '校园活动和周末校内生活更丰富。', src: 'assets/cpi/badminton.jpg' },
  ];

  readonly basicInfo: BasicInfoRow[] = [
    { label: '学校名称', value: '菲律宾宿务CPI语言学校' },
    { label: '所在地区', value: 'Holy Family Road, Nivel Hills, Lahug, Cebu City' },
    { label: '校区时间', value: '2015年启用Nivel Hills新校区' },
    { label: '学生容量', value: '约250名学生' },
    { label: '管理模式', value: '半斯巴达，结合晚间学习、选修和校园管理' },
    { label: '年龄要求', value: '成人、青少年和亲子可考虑；低龄学生需按课程规则确认' },
    { label: '住宿房型', value: 'A栋、B栋单人至多人校内房型' },
    { label: '核心资源', value: '泳池、健身房、餐厅、咖啡区、自习空间、运动设施' },
  ];

  readonly highlights: Highlight[] = [
    { image: 'assets/cpi/campus-pool.jpg', title: '度假村式校园环境', text: 'CPI适合重视住宿、餐厅、泳池和校内生活舒适度的学生。' },
    { image: 'assets/cpi/classroom.jpg', title: '课程方向覆盖广', text: 'ESL、考试、口语、商务、青少年和家长课程都可以纳入比较。' },
    { image: 'assets/cpi/dorm-room.jpg', title: '房型选择影响预算', text: 'A栋四人间适合先估算预算，B栋和家庭房型需单独核房。' },
    { image: 'assets/cpi/dining-hall.jpg', title: '学习生活集中管理', text: '适合第一次游学、亲子或想降低适应成本的学生。' },
  ];

  readonly suitableFor: FitItem[] = [
    { title: '第一次菲律宾游学，想降低适应压力', text: 'CPI环境舒适，校园生活完整，比纯市区型学校更容易适应。' },
    { title: '想认真学习，但不想选择高压斯巴达', text: '半斯巴达管理保留学习节奏，也给学生一定生活弹性。' },
    { title: '重视住宿、餐厅、泳池和校内设施', text: '如果学校环境是选校重点，CPI很值得放入候选。' },
    { title: '亲子、青少年或家庭同行', text: 'CPI有青少年和家长课程方向，但要先确认年龄、房型和监护规则。' },
  ];

  readonly notSuitableFor: FitItem[] = [
    { title: '预算非常紧，只追求最低总价', text: 'CPI的环境和房型会影响总预算，单人房和B栋高阶房型会明显拉高费用。' },
    { title: '只想要强制高压斯巴达', text: 'CPI更偏半斯巴达和舒适校园，若要更强纪律，可同时比较CIA、EV或CPILS。' },
    { title: '临近旺季才确认房型', text: '暑假、寒假、亲子档期和热门房型容易紧张，建议提前核空房。' },
    { title: '只看前期学费，不准备当地费用', text: 'CPI到校后仍需支付SSP、管理费、水电、教材、押金等当地费用。' },
  ];

  readonly courses: CourseItem[] = [
    { name: 'ESL GENERAL', type: '基础综合英语', lessons: '4节一对一 + 2节小组课 + 1节小团体课', suitable: '适合15岁以上、第一次游学和稳步提升的学生。' },
    { name: 'ESL INTENSIVE', type: '密集综合英语', lessons: '5节一对一 + 2节小组课 + 1节小团体课', suitable: '适合短期强化，希望增加开口和纠错时间的学生。' },
    { name: 'PREPARATORY', type: '考试预备英语', lessons: 'TOEIC / TOEFL / IELTS预备课程', suitable: '适合先建立考试基础和题型认识的学生。' },
    { name: 'GENERAL / INTENSIVE', type: '考试英语', lessons: '考试专项 + 模考 + 学习管理', suitable: '适合有TOEIC、TOEFL或IELTS分数目标的学生。' },
    { name: 'GUARANTEE', type: '考试保证班', lessons: '强化课表 + 入学门槛与最低周数', suitable: '适合目标明确并符合保证班要求的学生。' },
    { name: 'ESP BRIDGE / GENERAL', type: '商务英语', lessons: 'ESL与商务英语衔接或常规商务课', suitable: '适合职场人士或准备英文工作场景的学生。' },
    { name: 'JUNIOR / PARENTS', type: '青少年与家长课程', lessons: '按年龄、同行和房型确认', suitable: '适合6–15岁学生和亲子同行家庭。' },
  ];

  courseFees: CourseFee[] = [
    { id: 'esl-general-15', name: 'ESL GENERAL（15岁以上）', tuition: 900, suitable: '4节一对一 + 2节小组课 + 1节小团体课' },
    { id: 'esl-intensive', name: 'ESL INTENSIVE', tuition: 1020, suitable: '5节一对一 + 2节小组课 + 1节小团体课' },
    { id: 'toeic-preparatory', name: 'TOEIC PREPARATORY', tuition: 950, suitable: '托业预备课程' },
    { id: 'toefl-preparatory', name: 'TOEFL PREPARATORY', tuition: 950, suitable: '托福预备课程' },
    { id: 'ielts-preparatory', name: 'IELTS PREPARATORY', tuition: 950, suitable: '雅思预备课程' },
    { id: 'toeic-general', name: 'TOEIC GENERAL', tuition: 1020, suitable: '托业常规课程' },
    { id: 'toefl-general', name: 'TOEFL GENERAL', tuition: 1020, suitable: '托福常规课程' },
    { id: 'ielts-general', name: 'IELTS GENERAL', tuition: 1020, suitable: '雅思常规课程' },
    { id: 'toeic-intensive', name: 'TOEIC INTENSIVE', tuition: 1070, suitable: '托业强化课程' },
    { id: 'toefl-intensive', name: 'TOEFL INTENSIVE', tuition: 1070, suitable: '托福强化课程' },
    { id: 'ielts-intensive', name: 'IELTS INTENSIVE', tuition: 1070, suitable: '雅思强化课程' },
    { id: 'ielts-guarantee', name: 'IELTS GUARANTEE', tuition: 1120, suitable: '雅思保证班；门槛和最低周数需确认' },
    { id: 'toefl-guarantee', name: 'TOEFL GUARANTEE', tuition: 1120, suitable: '托福保证班；门槛和最低周数需确认' },
    { id: 'toeic-guarantee', name: 'TOEIC GUARANTEE', tuition: 1120, suitable: '托业保证班；门槛和最低周数需确认' },
    { id: 'junior-6-15', name: 'JUNIOR（6-15岁）', tuition: 1320, suitable: '青少年课程；可申请将1节一对一转给家长' },
    { id: 'parents', name: 'PARENTS', tuition: 780, suitable: '亲子同行家长课程' },
    { id: 'esp-bridge', name: 'ESP BRIDGE', tuition: 950, suitable: 'ESL与商务英语衔接课程' },
    { id: 'esp-general', name: 'ESP GENERAL', tuition: 1020, suitable: '商务英语常规课程' },
  ];

  roomFees: RoomFee[] = [
    { id: 'building-a-single', name: 'A栋单人间', fee: 1445, note: '隐私较高，热门档期需尽早确认' },
    { id: 'building-a-double', name: 'A栋双人间', fee: 960, note: '适合朋友同行或兼顾预算与舒适度' },
    { id: 'building-a-triple', name: 'A栋三人间', fee: 840, note: '多人房中预算较平衡' },
    { id: 'building-a-quad', name: 'A栋四人间（上下铺）', fee: 770, note: '默认报价参考房型' },
    { id: 'building-b-single', name: 'B栋单人间', fee: 1595, note: '隐私较高，热门档期需尽早确认' },
    { id: 'building-b-double-a', name: 'B栋双人间A', fee: 1160, note: 'B栋双人房A' },
    { id: 'building-b-double-b', name: 'B栋双人间B', fee: 1110, note: 'B栋双人房B' },
    { id: 'building-b-triple', name: 'B栋三人间', fee: 950, note: 'B栋三人房' },
    { id: 'building-b-quad', name: 'B栋四人间（3张床）', fee: 890, note: '家庭房型；四人入住、3张床' },
    { id: 'building-b-six', name: 'B栋六人间', fee: 770, note: '仅限女生' },
  ];

  readonly schedule: ScheduleItem[] = [
    { time: '07:00 - 08:00', title: '早餐与晨间准备', text: '校内用餐后准备当天课程，亲子和青少年学生按学校安排执行。' },
    { time: '08:00 - 12:00', title: '上午课程', text: '一对一、小团体、大团体或考试专项课程，按课程类型安排。' },
    { time: '12:00 - 13:00', title: '午餐与休息', text: '校内餐厅用餐，下午课程前整理笔记和学习资料。' },
    { time: '13:00 - 17:00', title: '下午课程', text: '继续一对一、团体课、口语训练或考试练习。' },
    { time: '17:00 - 19:00', title: '晚餐与自由时间', text: '可使用校园设施，实际外出和门禁以学校规则为准。' },
    { time: '19:00 - 21:00', title: '选修 / 自习 / 校内活动', text: '晚间安排按课程、年龄和管理规则调整。' },
  ];

  localFees: LocalFee[] = [
    { item: 'SSP', amount: 'PHP 6,800', note: '特别学习许可，通常到校支付' },
    { item: 'SSP E-card', amount: 'PHP 4,000', note: '以学校现场收费为准' },
    { item: '管理费', amount: 'PHP 7,000', note: '4周参考' },
    { item: '水电费', amount: 'PHP 2,000', note: '4周参考，按实际或学校规则调整' },
    { item: '教材费', amount: 'PHP 1,000', note: '按课程和实际购买教材调整' },
    { item: '学生证', amount: 'PHP 200', note: '一次性费用参考' },
    { item: '设施维护费', amount: 'PHP 1,000', note: '4周参考' },
    { item: '接机费', amount: 'PHP 1,000', note: '团体接机参考，个人接机可能不同' },
    { item: '保证金', amount: 'PHP 3,000', note: '退房检查后按学校规则退还' },
    { item: 'ACR I-card', amount: 'PHP 3,500', note: '长期学习或延签时通常需要' },
  ];

  readonly serviceSteps: ProcessStep[] = [
    { icon: 'person_search', title: '判断CPI是否适合', text: '先了解学习目标、预算、年龄、同行人和对住宿环境的要求。' },
    { icon: 'fact_check', title: '确认课程、房型和优惠', text: '免费协助确认课程、房型、空房、优惠和正式报价。' },
    { icon: 'assignment_turned_in', title: '协助入境和签证手续', text: '思达免费协助办理菲律宾入境及签证相关手续，学生只需按顾问指引准备个人资料。' },
    { icon: 'inventory', title: '发送学习资料和行前清单', text: '入学前免费发送学习资料、行李清单、费用清单和到校注意事项。' },
    { icon: 'support_agent', title: '到校后继续跟进', text: '遇到换老师、调课、学习方法、宿舍生活或学校沟通问题，也可以继续联系思达协助。' },
    { icon: 'location_on', title: '宿务当地支持', text: '思达在宿务有工作人员驻点，可提供当地支持，直到学生完成学习并顺利回国。' },
  ];

  readonly sidaCpiReasons: SidaCpiReason[] = [
    {
      number: '01',
      title: '正式合同与学校文件可核验',
      text: '国内公司签约，CPI报价、录取文件及收费凭证均可逐项核对。',
      image: 'assets/cia/sida-why-action-contract.jpg',
      alt: '思达启航正式合同与学校文件核验',
    },
    {
      number: '02',
      title: '房型和费用提前算清',
      text: '0中介服务费，课程费、住宿费、旺季附加费及CPI到校费用逐项说明。',
      image: 'assets/cia/sida-why-action-fees.jpg',
      alt: '思达启航顾问为学生核算菲律宾宿务CPI语言学校费用',
    },
    {
      number: '03',
      title: '先判断CPI是否适合',
      text: '根据预算、房型偏好、亲子需求、课程目标和入学档期，帮你判断CPI是否匹配。',
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

  readonly sidaCpiTrustBadges: SidaCpiTrustBadge[] = [
    { icon: 'description', label: '国内正式公司合同' },
    { icon: 'verified_user', label: '学校合作与文件核验' },
    { icon: 'local_offer', label: '费用透明与同条件保价' },
    { icon: 'apartment', label: '深圳总部 + 宿务驻点' },
  ];

  readonly schoolServices = ['机场接机', '入学说明', '分级测试', '课程咨询', '自习安排', '宿舍清洁', '洗衣服务', '医护室', '校内保安', '证件协助'];
  readonly campusActivities = ['新生说明会', '文化交流', '体育活动', '泳池休闲', '校内活动'];
  readonly weekendActivities = ['市区商场', '咖啡厅与餐厅', '跳岛游', '海边活动', '学生自发聚会'];
  readonly notes = [
    'CPI房型选择较多，报价前建议先确认可接受房型和预算上限。',
    '暑假、寒假、亲子档期和热门房型建议尽早确认空房。',
    '青少年和亲子学生要提前确认年龄、监护、家庭房、门禁和晚间活动规则。',
    '到校支付费用会随学校政策、汇率和个人情况变化。',
    '最终报名以学校正式录取、付款节点和顾问确认报价为准。',
  ];
  readonly faqs: FaqItem[] = [
    { question: 'CPI适合第一次菲律宾游学吗？', answer: '适合。CPI环境舒适、住宿和设施较完整，半斯巴达管理也能给第一次游学的学生一定学习节奏。' },
    { question: 'CPI是斯巴达还是半斯巴达？', answer: 'CPI通常按半斯巴达或度假村型半斯巴达理解。它保留学习管理和晚间安排，但整体氛围比高压斯巴达更偏舒适。' },
    { question: '页面上的报价包含全部费用吗？', answer: '不包含全部。前期支付参考主要包含注册费、课程费、住宿费和可能的旺季附加费；到校后仍需支付SSP、SSP E-card、管理费、水电费、教材费、学生证、维护费、接机费、押金等当地费用。' },
    { question: 'CPI适合亲子或青少年吗？', answer: '可以考虑，但要先确认年龄、同行家长、家庭房、门禁、晚间安排和照顾规则。' },
    { question: '思达会协助签证和入境吗？', answer: '会。通过思达报名CPI，思达顾问会免费协助菲律宾入境及签证相关手续，学生只需要按顾问指引准备个人资料。' },
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
          schools.find((item) => item.name.includes('CPI')) ??
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
      if (!this.courseFees.some((course) => course.id === this.selectedCourseId)) this.selectedCourseId = this.courseFees[0].id;
    }

    const databaseRoomFees = rooms
      .filter((room) => room.week === 4)
      .map((room) => ({ id: this.createRoomId(room.name), name: room.name, fee: room.price, note: room.description || '请联系顾问确认空房' }))
      .sort((a, b) => this.orderIndex(this.roomFeeOrder, a.id) - this.orderIndex(this.roomFeeOrder, b.id));
    if (databaseRoomFees.length > 0) {
      this.roomFees = databaseRoomFees;
      if (!this.roomFees.some((room) => room.id === this.selectedRoomId)) this.selectedRoomId = this.roomFees.find((room) => room.id === 'building-a-quad')?.id ?? this.roomFees[0].id;
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
  get billingMultiplier(): number { return this.shortTermRatios[this.selectedWeeks] ?? (this.selectedWeeks / 4); }
  get tuitionForSelectedWeeks(): number { return this.selectedCourse.tuition * this.billingMultiplier; }
  get roomFeeForSelectedWeeks(): number { return this.selectedRoom.fee * this.billingMultiplier; }
  get billingRuleText(): string {
    const percentage = this.shortTermRatios[this.selectedWeeks];
    return percentage
      ? `${this.selectedWeeks}周按4周课程费和住宿费的${percentage * 100}%计算`
      : `${this.selectedWeeks}周按4周价格的${this.billingMultiplier}倍计算`;
  }
  get isPeakSeason(): boolean {
    const start = new Date(`${this.selectedStartDate}T00:00:00`);
    const ranges = [
      [new Date('2026-07-06T00:00:00'), new Date('2026-08-23T23:59:59')],
      [new Date('2027-01-25T00:00:00'), new Date('2027-02-21T23:59:59')],
    ];
    return ranges.some(([from, to]) => start >= from && start <= to);
  }
  get seasonalSurcharge(): number { return this.isPeakSeason ? this.selectedWeeks * this.seasonalFeePerWeek : 0; }
  get quoteUsd(): number { return this.registrationFee + (this.tuitionForSelectedWeeks + this.roomFeeForSelectedWeeks) * this.discount + this.seasonalSurcharge; }
  get quoteUsdText(): string { return `USD ${this.formatUsd(this.quoteUsd)} 起`; }
  get quoteCnyText(): string { const rounded = Math.round((this.quoteUsd * this.usdToCny) / 100) * 100; return `约 ${rounded.toLocaleString('zh-CN')} 元起`; }
  get discountText(): string { return this.discount === 1 ? '优惠需顾问确认，参考范围' : `${Math.round(this.discount * 100)} 折扣范围`; }

  formatUsd(value: number): string { return value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 }); }
  private slugifyPriceKey(value: string): string { return value.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
  private orderIndex(order: string[], value: string): number { const index = order.indexOf(value); return index === -1 ? Number.MAX_SAFE_INTEGER : index; }
  private createRoomId(name: string): string {
    if (name.includes('A栋单人')) return 'building-a-single';
    if (name.includes('A栋双人')) return 'building-a-double';
    if (name.includes('A栋三人')) return 'building-a-triple';
    if (name.includes('A栋四人')) return 'building-a-quad';
    if (name.includes('B栋单人')) return 'building-b-single';
    if (name.includes('B栋双人间A')) return 'building-b-double-a';
    if (name.includes('B栋双人间B')) return 'building-b-double-b';
    if (name.includes('B栋三人')) return 'building-b-triple';
    if (name.includes('B栋四人')) return 'building-b-quad';
    if (name.includes('B栋六人')) return 'building-b-six';
    return this.slugifyPriceKey(name);
  }
  private currencyCodeForDisplay(code?: string): string { return !code ? 'USD' : code.toUpperCase() === 'PESO' ? 'PHP' : code.toUpperCase(); }
  private formatCurrencyAmount(fee: SchoolFeeDTO): string { return `${this.currencyCodeForDisplay(fee.currencyCode)} ${fee.fee.toLocaleString('en-US', { minimumFractionDigits: Number.isInteger(fee.fee) ? 0 : 1, maximumFractionDigits: 1 })}`; }
  private cleanFeeDescription(description?: string): string { return description ? description.replace(/^到校支付费用；/, '').replace(/^前期支付费用；/, '') : '以学校现场收费为准'; }
}

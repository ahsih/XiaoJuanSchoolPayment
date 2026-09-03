import { CommonModule } from '@angular/common';
import { SchoolQuotePlan, QuotePlanRow, presentSchoolQuote } from '../../../components/school-quote-plan';
import { SchoolQuotePlanComponent } from '../../../components/school-quote-plan.component';
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
import { ExpandableImageComponent } from '../../../components/expandable-image.component';
import { CPI_DORMITORY_PROFILES } from './cpi-dormitory-photos.data';

type GalleryCategory = '全部' | '校园' | '教室' | '住宿' | '餐厅' | '设施';

interface QuickInfo { icon: string; label: string; value: string; note: string; }
interface GalleryImage { category: Exclude<GalleryCategory, '全部'>; title: string; description: string; src: string; }
interface BasicInfoRow { label: string; value: string; }
interface Highlight { image: string; title: string; text: string; }
interface FitItem { title: string; text: string; }
interface CourseFee { id: string; name: string; tuition: number; suitable: string; }
interface ScheduleItem { time: string; title: string; text: string; }
interface RoomFee { id: string; name: string; fee: number; note: string; }
interface LocalFee { item: string; amount: string; note: string; quantity: number; total: number; excluded?: boolean; }
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
  imports: [SchoolQuotePlanComponent,CommonModule, FormsModule, RouterModule, MatIconModule, QuoteImageDownloadButtonComponent, ExpandableImageComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './cpi-school-detail.component.html',
  styleUrls: [
    '../school-quote-rollout.css',
    '../cebu-school-detail-layout.css',
    '../cebu-school-detail-content.css',
    '../cebu-school-detail-responsive.css',
    '../ev-school/ev-school-detail.component.css',
    './cpi-school-detail.component.css',
  ],
})
export class CpiSchoolDetailComponent implements OnInit {
  private readonly schoolService = inject(SchoolService);
  private readonly exchangeRateService = inject(ExchangeRateService);
  private readonly pricingSchoolSearchName = 'CPI';
  private readonly pricingSchoolNames = ['菲律宾宿务CPI语言学校', 'CPI Cebu Pelis Institute'];
  private readonly courseFeeOrder = ['esl-general-15', 'esl-intensive', 'toeic-preparatory', 'toefl-preparatory', 'ielts-preparatory', 'toeic-general', 'toefl-general', 'ielts-general', 'toeic-intensive', 'toefl-intensive', 'ielts-intensive', 'ielts-guarantee', 'toefl-guarantee', 'toeic-guarantee', 'junior-6-15', 'parents', 'esp-bridge', 'esp-general'];
  private readonly roomFeeOrder = ['building-a-single', 'building-a-double', 'building-a-triple', 'building-a-quad', 'building-b-single', 'building-b-double-a', 'building-b-double-b', 'building-b-triple', 'building-b-quad', 'building-b-six'];
  private readonly shortTermRatios: Record<number, number> = { 1: 0.375, 2: 0.65, 3: 0.9 };

  readonly galleryCategories: GalleryCategory[] = ['全部', '校园', '教室', '住宿', '餐厅', '设施'];
  selectedGalleryCategory: GalleryCategory = '全部';
  readonly dormitoryProfiles = CPI_DORMITORY_PROFILES;
  selectedDormitoryId = 'quad-a';
  selectedDormitoryImageIndex = 0;
  registrationFee = 100;
  readonly sidaDiscountRate = 0.9;
  readonly offSeasonDiscountPerWeek = 25;
  readonly decemberDiscountPerWeek = 25;
  readonly offSeasonRuleText = '2026/08/24–2027/01/01期间注册，每周优惠25美元';
  readonly decemberRuleText = '学习期包含2026年12月，12月期间每周额外优惠25美元';
  readonly extraClassRuleText = '2026/08/24–2026/09/28入学，额外加一节一对一课程；限20个名额，先到先得，须学校确认剩余名额';
  usdToCny = 7.2;
  phpPerCny = 7.75;
  exchangeRateDate = '';
  exchangeRateLive = false;
  readonly weekOptions = [1, 2, 3, 4, 8, 12, 16, 20, 24];
  readonly juniorCourseNote = '可将1节一对一转给家长，可部分周期转课';
  readonly localFeeIntro = '以下费用由学校、移民局及相关部门收取，仅供准备比索现金参考，最终以到校缴费为准。签证相关费用按持59天签证预估；教材按每次约用8周预估；水费不足4周按4周计算。';
  readonly quotePlan = new SchoolQuotePlan('esl-general-15', 'building-a-quad', '2026-09-06', this.weekOptions,
    kind => kind === 'course'
      ? this.courseFees.map(option => ({ id: option.id, name: this.courseDisplayName(option.name), details: option.suitable }))
      : this.roomFees.map(option => ({ id: option.id, name: option.name, details: option.name.includes('六人') ? '仅限女生' : option.name.includes('3张床') ? '家庭房型，3张床' : '' })),
    (kind, row) => {
      if (kind === 'course') {
        const option = this.courseFees.find(option => option.id === row.optionId);
        return option ? option.tuition * (this.shortTermRatios[row.weeks] ?? row.weeks / 4) : 0;
      }
      const option = this.roomFees.find(option => option.id === row.optionId);
      return option ? option.fee * (this.shortTermRatios[row.weeks] ?? row.weeks / 4) : 0;
    });
  get selectedCourseId() { return this.quotePlan.courses[0].optionId; }
  set selectedCourseId(value: string) { this.quotePlan.courses[0].optionId = value; }
  get selectedRoomId() { return this.quotePlan.rooms[0].optionId; }
  set selectedRoomId(value: string) { this.quotePlan.rooms[0].optionId = value; }
  get selectedWeeks() { return this.quotePlan.courseWeeks; }
  set selectedWeeks(value: number) { this.quotePlan.courses[0].weeks = value; this.quotePlan.rooms[0].weeks = value; }
  get selectedStartDate() { return this.quotePlan.startDate; }
  set selectedStartDate(value: string) { this.quotePlan.courses[0].startDate = value; this.quotePlan.rooms[0].startDate = value; }
  selectedRegistrationDate = this.currentDateKey;
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
    { category: '校园', title: 'CPI校区主景', description: '位于Nivel Hills / Lahug，校园、泳池、住宿和设施集中。', src: 'assets/cpi/campus-exterior.jpg' },
    { category: '教室', title: '一对一教室', description: '用于综合英语、口语、考试专项和商务课程。', src: 'assets/cpi/group-classroom.jpg' },
    { category: '教室', title: '团体教室', description: '小团体和大团体课程用于讨论、表达和综合训练。', src: 'assets/cpi/classroom.jpg' },
    { category: '住宿', title: 'CPI宿舍房型', description: '', src: '/assets/cpi/dorm-photos/quad-a-01.jpg' },
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
    { image: 'assets/cpi/campus-exterior.jpg', title: '度假村式校园环境', text: 'CPI适合重视住宿、餐厅、泳池和校内生活舒适度的学生。' },
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

  courseFees: CourseFee[] = [
    { id: 'esl-general-15', name: 'ESL GENERAL（15岁以上）', tuition: 900, suitable: '4节一对一 + 2节小组课 + 1节小团体课' },
    { id: 'esl-intensive', name: 'ESL INTENSIVE', tuition: 1020, suitable: '5节一对一 + 2节小组课 + 1节小团体课' },
    { id: 'toeic-preparatory', name: 'TOEIC PREPARATORY', tuition: 950, suitable: '4节一对一 + 2节小组课 + 1节小团体课' },
    { id: 'toefl-preparatory', name: 'TOEFL PREPARATORY', tuition: 950, suitable: '4节一对一 + 2节小组课 + 1节小团体课' },
    { id: 'ielts-preparatory', name: 'IELTS PREPARATORY', tuition: 950, suitable: '2节ESL一对一 + 2节雅思一对一 + 2节ESL团体课 + 1节雅思团体课' },
    { id: 'toeic-general', name: 'TOEIC GENERAL', tuition: 1020, suitable: '4节一对一 + 2节小组课 + 2节考试课程' },
    { id: 'toefl-general', name: 'TOEFL GENERAL', tuition: 1020, suitable: '4节一对一 + 2节小组课 + 2节考试课程' },
    { id: 'ielts-general', name: 'IELTS GENERAL', tuition: 1020, suitable: '4节一对一 + 2节小组课 + 2节考试课程' },
    { id: 'toeic-intensive', name: 'TOEIC INTENSIVE', tuition: 1070, suitable: '5节一对一 + 2节小组课 + 2节考试课程' },
    { id: 'toefl-intensive', name: 'TOEFL INTENSIVE', tuition: 1070, suitable: '5节一对一 + 2节小组课 + 2节考试课程' },
    { id: 'ielts-intensive', name: 'IELTS INTENSIVE', tuition: 1070, suitable: '5节一对一 + 2节小组课 + 2节考试课程' },
    { id: 'ielts-guarantee', name: 'IELTS GUARANTEE', tuition: 1120, suitable: '5节一对一 + 2节小组课 + 2节考试课程' },
    { id: 'toefl-guarantee', name: 'TOEFL GUARANTEE', tuition: 1120, suitable: '5节一对一 + 2节小组课 + 2节考试课程' },
    { id: 'toeic-guarantee', name: 'TOEIC GUARANTEE', tuition: 1120, suitable: '5节一对一 + 2节小组课 + 2节考试课程' },
    { id: 'junior-6-15', name: 'JUNIOR（6-15岁）', tuition: 1320, suitable: '5节一对一 + 1节小组课 + 1节小团体课' },
    { id: 'parents', name: 'PARENTS', tuition: 780, suitable: '2节一对一 + 1节小组课 + 1节小团体课' },
    { id: 'esp-bridge', name: 'ESP BRIDGE', tuition: 950, suitable: '2节ESL一对一 + 2节商务英语一对一 + 1节1:2课程 + 2节小组课' },
    { id: 'esp-general', name: 'ESP GENERAL', tuition: 1020, suitable: '4节一对一 + 1节1:2课程 + 2节小组课' },
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
    { id: 'building-b-quad', name: 'B栋四人间（3张床）', fee: 890, note: '家庭房型；3张床' },
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
      text: '0中介服务费，课程费、住宿费、折扣优惠及CPI到校费用逐项说明。',
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
    { question: '页面上的报价包含全部费用吗？', answer: '学校金额包含注册费、折扣后课程费和住宿费，并按条件计入淡季优惠；到校学杂费另行自动估算，接机、可退押金和洗衣服务单独列示。' },
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
    { label: '课程', target: 'course-fees', icon: 'menu_book' },
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
      .map((lesson) => ({ id: this.slugifyPriceKey(lesson.name), name: lesson.name, tuition: lesson.price, suitable: this.correctLegacyCourseSchedule(lesson) }))
      .sort((a, b) => this.orderIndex(this.courseFeeOrder, a.id) - this.orderIndex(this.courseFeeOrder, b.id));
    if (databaseCourseFees.length > 0) {
      this.courseFees = databaseCourseFees;
      if (!this.courseFees.some((course) => course.id === this.selectedCourseId)) this.selectedCourseId = this.courseFees[0].id;
    }

    const databaseRoomFees = rooms
      .filter((room) => room.week === 4)
      .map((room) => ({ id: this.createRoomId(room.name), name: room.name, fee: room.price, note: this.roomDisplayNote(room) }))
      .sort((a, b) => this.orderIndex(this.roomFeeOrder, a.id) - this.orderIndex(this.roomFeeOrder, b.id));
    if (databaseRoomFees.length > 0) {
      this.roomFees = databaseRoomFees;
      if (!this.roomFees.some((room) => room.id === this.selectedRoomId)) this.selectedRoomId = this.roomFees.find((room) => room.id === 'building-a-quad')?.id ?? this.roomFees[0].id;
    }

    const registrationFee = fees.find((fee) => fee.name === '注册费');
    if (registrationFee) this.registrationFee = registrationFee.fee;
  }

  setGalleryCategory(category: GalleryCategory): void { this.selectedGalleryCategory = category; }
  get selectedDormitory() { return this.dormitoryProfiles.find(profile => profile.id === this.selectedDormitoryId) ?? this.dormitoryProfiles[0]; }
  get selectedDormitoryImage(): string { return this.selectedDormitory.gallery[this.selectedDormitoryImageIndex] ?? this.selectedDormitory.gallery[0]; }
  get dormitoryImageTitles(): string[] { return this.selectedDormitory.gallery.map((_, index) => `${this.selectedDormitory.label} · 实景${index + 1}`); }
  selectDormitory(id: string): void {
    if (!this.dormitoryProfiles.some(profile => profile.id === id)) return;
    this.selectedDormitoryId = id;
    this.selectedDormitoryImageIndex = 0;
  }
  selectDormitoryPhoto(index: number): void {
    if (index >= 0 && index < this.selectedDormitory.gallery.length) this.selectedDormitoryImageIndex = index;
  }
  openDormitoryGallery(event?: Event): void {
    this.selectedGalleryCategory = '住宿';
    this.scrollToSection('gallery', event);
  }
  handleDormitoryKey(event: KeyboardEvent, index: number): void {
    const lastIndex = this.dormitoryProfiles.length - 1;
    const target = event.key === 'ArrowRight' ? (index + 1) % (lastIndex + 1)
      : event.key === 'ArrowLeft' ? (index + lastIndex) % (lastIndex + 1)
      : event.key === 'Home' ? 0 : event.key === 'End' ? lastIndex : null;
    if (target === null) return;
    event.preventDefault();
    const profile = this.dormitoryProfiles[target];
    this.selectDormitory(profile.id);
    document.getElementById(`cpi-dorm-tab-${profile.id}`)?.focus();
  }
  calculateQuote(): void { this.quoteCalculated = true; }
  scrollToSection(target: string, event?: Event): void {
    event?.preventDefault();
    const targetElement = document.getElementById(target);
    if (!targetElement) return;
    const headerOffset = window.innerWidth <= 680 ? 132 : 156;
    const targetTop = targetElement.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({ top: Math.max(targetTop, 0), behavior: 'smooth' });
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#${target}`);
  }

  get filteredGalleryImages(): GalleryImage[] { return this.selectedGalleryCategory === '全部' ? this.galleryImages : this.galleryImages.filter((image) => image.category === this.selectedGalleryCategory); }
  get selectedCourse(): CourseFee { return this.courseFees.find((course) => course.id === this.selectedCourseId) ?? this.courseFees[0]; }
  get selectedRoom(): RoomFee { return this.roomFees.find((room) => room.id === this.selectedRoomId) ?? this.roomFees[0]; }
  get billingMultiplier(): number { return this.shortTermRatios[this.selectedWeeks] ?? (this.selectedWeeks / 4); }
  get tuitionForSelectedWeeks(): number { return this.quotePlan.total('course'); }
  get roomFeeForSelectedWeeks(): number { return this.quotePlan.total('room'); }
  get courseAndRoomBase(): number { return this.tuitionForSelectedWeeks + this.roomFeeForSelectedWeeks; }
  get billingRuleText(): string {
    const percentage = this.shortTermRatios[this.selectedWeeks];
    return percentage
      ? `${this.selectedWeeks}周按4周课程费和住宿费的${percentage * 100}%计算`
      : `${this.selectedWeeks}周按4周价格的${this.billingMultiplier}倍计算`;
  }
  get sidaDiscountAmount(): number {
    const discountPercent = Math.round((1 - this.sidaDiscountRate) * 100);
    return Math.round(this.courseAndRoomBase * discountPercent) / 100;
  }
  get offSeasonEligible(): boolean { return this.isDateBetween(this.selectedRegistrationDate, '2026-08-24', '2027-01-01'); }
  get offSeasonDiscountAmount(): number { return this.offSeasonEligible ? this.selectedWeeks * this.offSeasonDiscountPerWeek : 0; }
  get extraClassEligible(): boolean { return this.isDateBetween(this.selectedStartDate, '2026-08-24', '2026-09-28'); }
  get decemberStay(): { fullWeeks: number; partialWeeks: number } {
    const fullWeeks = this.quotePlan.weekStarts().filter(start => start >= Date.UTC(2026, 11, 1) && start + 7 * 86400000 <= Date.UTC(2027, 0, 1)).length;
    return { fullWeeks, partialWeeks: this.quotePlan.overlapWeeks('2026-12-01', '2026-12-31') - fullWeeks };
  }
  get decemberDiscountAmount(): number { return this.decemberStay.fullWeeks * this.decemberDiscountPerWeek; }
  get decemberCalculationText(): string {
    const { fullWeeks, partialWeeks } = this.decemberStay;
    return `本次已计入完整${fullWeeks}周` + (partialWeeks ? `；另有${partialWeeks}个跨月学习周，不足一周的优惠待学校确认，暂未计入` : '');
  }
  get quoteUsd(): number {
    const total = this.registrationFee + this.courseAndRoomBase - this.sidaDiscountAmount - this.offSeasonDiscountAmount - this.decemberDiscountAmount;
    return Math.max(0, Math.round(total * 100) / 100);
  }
  get quoteUsdText(): string { return `${this.formatUsd(this.quoteUsd)} 美元`; }
  get quoteCnyText(): string {
    const rounded = Math.round(this.quoteUsd * this.usdToCny);
    return `约 ${rounded.toLocaleString('zh-CN')} 元`;
  }
  get exchangeRateText(): string {
    return this.exchangeRateLive && this.exchangeRateDate ? `汇率日期 ${this.exchangeRateDate}` : '暂按备用汇率估算';
  }

  get localFeeFourWeekPeriods(): number { return Math.max(1, Math.ceil(this.quotePlan.roomWeeks / 4)); }
  get visaExtensionCount(): number { return Math.max(0, Math.ceil((this.quotePlan.stayWeeks * 7 - 59) / 30)); }
  get textbookPurchaseCount(): number { return Math.max(1, Math.ceil(this.selectedWeeks / 8)); }
  get localFees(): LocalFee[] {
    const fourWeekPeriods = this.localFeeFourWeekPeriods;
    const extensionQuantity = this.visaExtensionCount;
    const acrQuantity = this.quotePlan.stayWeeks > 8 ? 1 : 0;
    return [
      { item: 'SSP特殊学习许可证', amount: '7,800 比索 / 次', quantity: 1, total: 7800, note: '移民局收取；按报名学习时长办理，续费及换校需重新办理' },
      { item: 'SSP E-CARD', amount: '4,500 比索 / 次', quantity: 1, total: 4500, note: '移民局收取；入学时与SSP同时办理，只收一次' },
      { item: 'ACR-I CARD 外国人身份证', amount: '4,500 比索 / 次', quantity: acrQuantity, total: 4500 * acrQuantity, note: '按持59天签证预估，学习超过8周计入一次；若持30天签证，约第4周首次续签时可能提前产生，以实际办理为准' },
      { item: 'ARP外国人登记', amount: '300 比索 / 次', quantity: acrQuantity, total: 300 * acrQuantity, note: '按持59天签证预估，学习超过8周计入一次；首次续签时学校带队办理拍照及指纹录制' },
      { item: '管理费', amount: '1,000 比索 / 4周', quantity: fourWeekPeriods, total: 1000 * fourWeekPeriods, note: '校内教学楼及其他设施维护费' },
      { item: '水费', amount: '1,500 比索 / 4周', quantity: fourWeekPeriods, total: 1500 * fourWeekPeriods, note: '每4周计费，不足4周按4周计算' },
      { item: '电费', amount: '2,000 比索 / 4周', quantity: fourWeekPeriods, total: 2000 * fourWeekPeriods, note: '预估；超出固定用量按房型另收6–20比索/千瓦时' },
      { item: '签证续签', amount: '5,140 比索 / 次', quantity: extensionQuantity, total: 5140 * extensionQuantity, note: `${extensionQuantity === 0 ? '按持59天签证预估，本次无需续签' : '按持59天签证预估，超出天数每30天计一次'}；持30天签证需更早续签，最终以实际签证、停留天数和收费为准` },
      { item: '教材费', amount: '2,000 比索 / 8周', quantity: this.textbookPurchaseCount, total: 2000 * this.textbookPurchaseCount, note: '按每次购买教材约可使用8周预估，不足8周按一次计；具体依个人学习进度和实际购买教材情况结算' },
      { item: '学生证', amount: '350 比索 / 次', quantity: 1, total: 350, note: '可自备白底证件照5×5厘米' },
      { item: '宿务马克坦机场周日接机', amount: '1,000 比索 / 次', quantity: 0, total: 0, note: '可选，也可自行打车；其他时间1,500比索/次/人；不计入学杂费合计', excluded: true },
      { item: '房间押金', amount: '3,000 比索 / 次', quantity: 1, total: 3000, note: '收一次；无损坏及额外扣费时毕业可退；不计入学杂费合计', excluded: true },
      { item: '洗衣服务', amount: '200 比索 / 5公斤 / 次', quantity: 0, total: 0, note: '根据实际需要使用和付费；不计入学杂费合计', excluded: true },
    ];
  }
  get localFeesTotal(): number {
    return this.localFees.filter((fee) => !fee.excluded).reduce((sum, fee) => sum + fee.total, 0);
  }
  get localFeesCnyText(): string { return `约 ${Math.round(this.localFeesTotal / this.phpPerCny).toLocaleString('zh-CN')} 元`; }
  get includedLocalFees(): LocalFee[] { return this.localFees.filter(fee => !fee.excluded); }
  get excludedLocalFees(): LocalFee[] { return this.localFees.filter(fee => fee.excluded); }

  get quoteImageData() {
    const base = this.baseQuoteImageData;
    return presentSchoolQuote({
      ...base,
      importantNotes: [...this.quotePlan.shortStayNotes(weeks => this.shortTermRatios[weeks]), ...(this.quotePlan.courses.some(row => this.courseFees.find(course => course.id === row.optionId)?.name.startsWith('JUNIOR')) ? [`青少年课程说明：${this.juniorCourseNote}。`] : []), '最终以学校价格、空房及优惠确认为准。'],
      totalNote: '人民币按参考汇率预估，最终以支付当日汇率为准',
    }, this.quotePlan, 'CPI', this.quoteUsd, this.usdToCny);
  }

  private get baseQuoteImageData() {
    const includedFees = this.localFees.filter((fee) => !fee.excluded);
    const optionalFees = this.localFees.filter((fee) => fee.excluded);
    return buildPhilippinesDetailedQuote({
      schoolCode: 'CPI',
      schoolName: '菲律宾宿务CPI语言学校',
      filePrefix: 'CPI',
      heroSrc: '/assets/cpi/campus-exterior.jpg',
      weeks: this.selectedWeeks,
      startDate: this.selectedStartDate,
      usdToCny: this.usdToCny,
      totalUsd: this.quoteUsd,
      fullFeeDetails: true,
      localFeeTableLayout: 'web',
      paymentItems: [
        { icon: '注', label: '注册费', amount: `${this.formatUsd(this.registrationFee)} 美元`, note: '一次性学校注册费，不参与折扣' },
        { icon: '课', label: '课程费', amount: `${this.formatUsd(this.tuitionForSelectedWeeks)} 美元`, note: `${this.courseDisplayName(this.selectedCourse.name)}；周一至周五每日：${this.selectedCourse.suitable}` },
        { icon: '宿', label: '住宿费', amount: `${this.formatUsd(this.roomFeeForSelectedWeeks)} 美元`, note: this.selectedRoom.name },
        ...(this.sidaDiscountAmount > 0 ? [{ icon: '折', label: '思达折扣', amount: '9折', note: `优惠${this.formatUsd(this.sidaDiscountAmount)}美元`, accent: true }] : []),
        ...(this.offSeasonDiscountAmount > 0 ? [{ icon: '淡', label: '淡季优惠', amount: `- ${this.formatUsd(this.offSeasonDiscountAmount)} 美元`, note: `${this.offSeasonRuleText}；本次注册日${this.selectedRegistrationDate.replace(/-/g, '/')}，共${this.selectedWeeks}周`, accent: true }] : []),
        ...(this.decemberDiscountAmount > 0 ? [{ icon: '冬', label: '12月额外优惠', amount: `- ${this.formatUsd(this.decemberDiscountAmount)} 美元`, note: `${this.decemberRuleText}；${this.decemberCalculationText}`, accent: true }] : []),
        { icon: '赠', label: '限量一对一加课', amount: this.extraClassEligible ? '名额待确认' : '活动信息', note: `${this.extraClassRuleText}。${this.extraClassEligible ? '符合日期，名额待确认。' : '当前入学日期不适用；活动期内入学可申请，名额待确认。'}非现金优惠，不抵扣费用。`, accent: true },
      ],
      localFeeItems: includedFees.map((fee) => ({ label: fee.item, unit: fee.amount, quantity: String(fee.quantity), amount: this.formatPhp(fee.total), note: fee.note })),
      localFeeTotal: this.localFeesTotal,
      localCurrencyName: '比索',
      localFeeCny: Math.round(this.localFeesTotal / this.phpPerCny),
      localFeeNote: this.localFeeIntro,
      optionalFeeItems: optionalFees.map((fee) => ({ label: fee.item, amount: fee.amount, note: fee.note })),
      ruleNotes: [
        `1周、2周、3周的课程费与住宿费分别按4周价的37.5%、65%、90%计算；注册费${this.formatUsd(this.registrationFee)}美元，只收一次，不随学习周数变化。`,
        '课程费和住宿费享思达9折；注册费不打折，符合条件的淡季及12月优惠额外扣减。',
        ...(this.selectedCourse.name === 'JUNIOR（6-15岁）' ? [`青少年课程说明：${this.juniorCourseNote}。`] : []),
        ...(this.decemberStay.partialWeeks > 0 ? [`12月优惠：${this.decemberCalculationText}。`] : []),
      ],
    });
  }

  formatUsd(value: number): string { return value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 }); }
  formatPhp(value: number): string { return `${value.toLocaleString('en-US')} 比索`; }
  courseDisplayName(name: string): string {
    if (name === 'JUNIOR（6-15岁）') return '青少年 JUNIOR（6–15岁）';
    if (name === 'PARENTS') return '家长 PARENTS';
    if (name === 'ESP BRIDGE') return '初级商务英语 ESP BRIDGE';
    if (name === 'ESP GENERAL') return '常规商务英语 ESP GENERAL';
    const match = /^(TOEIC|TOEFL|IELTS) (PREPARATORY|GENERAL|INTENSIVE|GUARANTEE)$/.exec(name);
    if (!match) return name;
    const exams: Record<string, string> = { TOEIC: '托业', TOEFL: '托福', IELTS: '雅思' };
    const levels: Record<string, string> = { PREPARATORY: '预备', GENERAL: '常规', INTENSIVE: '强化', GUARANTEE: '保证班' };
    return `${exams[match[1]]}${levels[match[2]]} ${name}`;
  }
  private roomDisplayNote(room: SchoolRoomDTO): string {
    const note = room.description || '请联系顾问确认空房';
    return room.name === 'B栋四人间（3张床）'
      ? note.replace('家庭房型；四人入住、3张床', '家庭房型；3张床')
      : note;
  }
  private correctLegacyCourseSchedule(lesson: SchoolLessonDTO): string {
    // Keep this known legacy seed from restoring omitted lessons before the server is restarted.
    // Other administrator-authored descriptions continue to come from the database.
    if (['IELTS GUARANTEE', 'TOEIC GUARANTEE'].includes(lesson.name) && [
      '5节一对一 + 2节小组课 + 2节考试课程；入学门槛与最低周数需确认',
      '5节一对一 + 2节小组课 + 2节考试课程；入学门槛、目标分数和最低周数需确认',
    ].includes(lesson.description ?? '')) {
      return '5节一对一 + 2节小组课 + 2节考试课程';
    }
    if (lesson.name === 'TOEFL GUARANTEE' && lesson.description === '5节一对一 + 2节小组课 + 2节考试课程；公开2026课程表未列，待校方确认') {
      return '5节一对一 + 2节小组课 + 2节考试课程';
    }
    if (lesson.name === 'JUNIOR（6-15岁）' && [
      '5节一对一 + 1节小组课 + 1节小团体课；可申请将1节一对一转给家长',
      '5节一对一 + 1节小组课 + 1节小团体课；可将1节一对一转给家长，可部分周期转课',
    ].includes(lesson.description ?? '')) {
      return '5节一对一 + 1节小组课 + 1节小团体课';
    }
    if (lesson.name === 'ESP BRIDGE' && lesson.description === '2节ESL一对一 + 2节商务一对一 + 2节小组课') {
      return '2节ESL一对一 + 2节商务英语一对一 + 1节1:2课程 + 2节小组课';
    }
    if (lesson.name === 'ESP GENERAL' && lesson.description === '4节一对一 + 2节小组课') {
      return '4节一对一 + 1节1:2课程 + 2节小组课';
    }
    return lesson.description || lesson.note || '课程安排请向顾问确认';
  }
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
  private parseDate(value: string): number | null {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
    const parsed = Date.parse(`${value}T00:00:00Z`);
    return Number.isFinite(parsed) && new Date(parsed).toISOString().slice(0, 10) === value ? parsed : null;
  }
  private isDateBetween(value: string, start: string, end: string): boolean { return this.parseDate(value) !== null && value >= start && value <= end; }
  private get currentDateKey(): string {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  }
}

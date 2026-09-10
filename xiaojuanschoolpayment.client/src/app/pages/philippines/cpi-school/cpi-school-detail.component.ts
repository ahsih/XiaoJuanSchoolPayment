import { CommonModule } from '@angular/common';
import { SchoolQuotePlan, QuotePlanRow, applySchoolQuoteImageLayout } from '../../../components/school-quote-plan';
import { SCHOOL_VISA_OPTIONS, SchoolLocalFee, SchoolPaymentLine, SchoolVisaType, groupLocalFees, groupPaymentLines } from '../../../components/school-group-quote';
import { SchoolQuotePlanComponent } from '../../../components/school-quote-plan.component';
import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, HostListener, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { catchError, EMPTY, forkJoin, of, switchMap } from 'rxjs';
import { SchoolFeeDTO } from '../../../../interfaces/school-fees.dto';
import { SchoolLessonDTO } from '../../../../interfaces/school-lessons.dto';
import { SchoolRoomDTO } from '../../../../interfaces/school-rooms.dto';
import { SchoolPhotoDTO } from '../../../../interfaces/school-photo.dto';
import { ExchangeRateService } from '../../../../services/exchange-rate.service';
import { SchoolContentService } from '../../../../services/school-content.service';
import { SchoolService } from '../../../../services/school.service';
import { buildPhilippinesDetailedQuote } from '../../../components/philippines-quote-image-data';
import { QuoteImageDownloadButtonComponent } from '../../../components/quote-image-download-button.component';
import { ExpandableImageComponent } from '../../../components/expandable-image.component';
import { CPI_DORMITORY_PROFILES } from './cpi-dormitory-photos.data';
import { CiaContentConfig, CiaLocalFeeRule, CiaPromotionRule, CiaQuoteImageSettings } from '../cia-school/cia-content-config';
import { CiaPreviewTarget, isCiaPreviewTarget, resolveCiaPreviewTarget, revealCiaPreviewElement, scrollCiaPreviewElement } from '../cia-school/cia-content-preview';
import { cloneCpiContentConfig, createDefaultCpiContentConfig } from './cpi-content-config';

type GalleryCategory = '全部' | '校园' | '教室' | '住宿' | '餐厅' | '设施';

interface QuickInfo { icon: string; label: string; value: string; note: string; }
interface GalleryImage { category: Exclude<GalleryCategory, '全部'>; title: string; description: string; src: string; contentType?: string; }
interface BasicInfoRow { label: string; value: string; }
interface Highlight { image: string; title: string; text: string; }
interface FitItem { title: string; text: string; }
interface CourseFee { id: string; name: string; tuition: number; suitable: string; }
interface ScheduleItem { time: string; title: string; text: string; }
interface RoomFee { id: string; name: string; fee: number; note: string; }
interface LocalFee { item: string; amount: string; note: string; quantity: number; total: number; excluded?: boolean; }
interface CpiStudentQuote {
  quotePlan: SchoolQuotePlan;
  selectedAgeGroup: 'adult' | 'minor16' | 'junior';
  visaType: SchoolVisaType;
  returningStudent: boolean;
  pickupSelected: boolean;
  selectedRegistrationDate: string;
}
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
    '../../../components/school-group-quote.css',
    './cpi-school-detail.component.css',
  ],
})
export class CpiSchoolDetailComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly schoolService = inject(SchoolService);
  private readonly schoolContentService = inject(SchoolContentService);
  private readonly exchangeRateService = inject(ExchangeRateService);
  private readonly route = inject(ActivatedRoute);
  private readonly previewHost = inject(ElementRef<HTMLElement>);
  private readonly initialContent = createDefaultCpiContentConfig();
  readonly isEditorPreview = typeof window !== 'undefined' && window.parent !== window
    && this.route.snapshot.queryParamMap.get('contentPreview') === '1';
  private previewTarget?: CiaPreviewTarget;
  private previewHighlightTarget?: CiaPreviewTarget;
  private previewFocusTimer?: ReturnType<typeof setTimeout>;
  private previewContent?: CiaContentConfig;
  private readonly pricingSchoolSearchName = 'CPI';
  private readonly pricingSchoolNames = ['菲律宾宿务CPI语言学校', 'CPI Cebu Pelis Institute'];
  private readonly courseFeeOrder = ['esl-general-15', 'esl-intensive', 'toeic-preparatory', 'toefl-preparatory', 'ielts-preparatory', 'toeic-general', 'toefl-general', 'ielts-general', 'toeic-intensive', 'toefl-intensive', 'ielts-intensive', 'ielts-guarantee', 'toefl-guarantee', 'toeic-guarantee', 'junior-6-15', 'parents', 'esp-bridge', 'esp-general'];
  private readonly roomFeeOrder = ['building-a-single', 'building-a-double', 'building-a-triple', 'building-a-quad', 'building-b-single', 'building-b-double-a', 'building-b-double-b', 'building-b-triple', 'building-b-quad', 'building-b-six'];
  private shortTermRatios: Record<number, number> = { 1: 0.375, 2: 0.65, 3: 0.9 };

  readonly galleryCategories: GalleryCategory[] = ['全部', '校园', '教室', '住宿', '餐厅', '设施'];
  selectedGalleryCategory: GalleryCategory = '全部';
  readonly dormitoryProfiles = CPI_DORMITORY_PROFILES;
  selectedDormitoryId = 'quad-a';
  selectedDormitoryImageIndex = 0;
  registrationFee = this.initialContent.quoteSettings.registrationFee;
  promotionRules: CiaPromotionRule[] = structuredClone(this.initialContent.quoteSettings.promotions);
  localFeeRules: CiaLocalFeeRule[] = structuredClone(this.initialContent.localFees);
  quoteImageSettings: CiaQuoteImageSettings = structuredClone(this.initialContent.quoteImageSettings);
  courseTableTitle = this.initialContent.quoteSettings.courseTableTitle;
  courseTableNote = this.initialContent.quoteSettings.courseTableNote;
  groupClassNote = this.initialContent.quoteSettings.groupClassNote;
  roomTableTitle = this.initialContent.quoteSettings.roomTableTitle;
  roomTableNote = this.initialContent.quoteSettings.roomTableNote;
  stayPolicyTitle = this.initialContent.quoteSettings.stayPolicyTitle;
  stayPolicies = structuredClone(this.initialContent.quoteSettings.stayPolicies);
  extraNightRates = structuredClone(this.initialContent.quoteSettings.extraNightRates);
  get sidaDiscountRate() { return 1 - (this.promotionRule('cpi-sida-90')?.discountValue ?? 0) / 100; }
  get offSeasonDiscountPerWeek() { return this.promotionRule('cpi-off-season')?.discountValue ?? 0; }
  get decemberDiscountPerWeek() { return this.promotionRule('cpi-december')?.discountValue ?? 0; }
  get offSeasonRuleText() { return this.promotionRule('cpi-off-season')?.description ?? '当前未启用淡季优惠'; }
  get decemberRuleText() { return this.promotionRule('cpi-december')?.description ?? '当前未启用12月优惠'; }
  get extraClassRuleText() { return this.promotionRule('cpi-extra-class')?.description ?? '当前未启用加课优惠'; }
  usdToCny = 7.2;
  phpPerCny = 7.75;
  exchangeRateDate = '';
  exchangeRateLive = false;
  readonly weekOptions = [1, 2, 3, 4, 8, 12, 16, 20, 24];
  get juniorCourseNote() { return this.groupClassNote.replace(/^青少年课程（6–15岁）/, '').replace(/^[：:]/, '').replace(/。$/, ''); }
  localFeeIntro = this.initialContent.quoteSettings.localFeeIntro;
  readonly visaOptions = SCHOOL_VISA_OPTIONS;
  readonly students: CpiStudentQuote[] = [this.createStudent()];
  quoteMode: 'single' | 'group' = 'single';
  private requestedStudentCount = 2;
  get studentCount() { return this.requestedStudentCount; }
  set studentCount(value: number) {
    this.requestedStudentCount = value;
    if (Number.isInteger(value) && value >= 2 && value <= 20) while (this.students.length < value) this.students.push(this.createStudent());
  }
  setQuoteMode(value: 'single' | 'group') { this.quoteMode = value; if (value === 'group') this.studentCount = this.requestedStudentCount; }
  get activeStudents() { return this.quoteMode === 'single' ? this.students.slice(0, 1) : this.students.slice(0, Math.max(2, Math.min(20, Math.floor(this.studentCount) || 2))); }
  get quotePlan() { return this.students[0].quotePlan; }
  private createStudent(): CpiStudentQuote {
    return {
      quotePlan: new SchoolQuotePlan('esl-general-15', 'building-a-quad', '2026-09-06', this.weekOptions,
        kind => kind === 'course'
          ? this.courseFees.map(option => ({ id: option.id, name: this.courseDisplayName(option.name), details: option.suitable }))
          : this.roomFees.map(option => ({ id: option.id, name: option.name, details: option.name.includes('六人') ? '仅限女生' : option.name.includes('3张床') ? '家庭房型，3张床' : '' })),
        (kind, row) => {
          const option = kind === 'course' ? this.courseFees.find(item => item.id === row.optionId) : this.roomFees.find(item => item.id === row.optionId);
          return option ? ('tuition' in option ? option.tuition : option.fee) * (this.shortTermRatios[row.weeks] ?? row.weeks / 4) : 0;
        }),
      selectedAgeGroup: 'adult', visaType: 'tourist59', returningStudent: false, pickupSelected: false,
      selectedRegistrationDate: this.currentDateKey,
    };
  }
  get selectedCourseId() { return this.quotePlan.courses[0].optionId; }
  set selectedCourseId(value: string) { this.quotePlan.courses[0].optionId = value; }
  get selectedRoomId() { return this.quotePlan.rooms[0].optionId; }
  set selectedRoomId(value: string) { this.quotePlan.rooms[0].optionId = value; }
  get selectedWeeks() { return this.quotePlan.courseWeeks; }
  set selectedWeeks(value: number) { this.quotePlan.courses[0].weeks = value; this.quotePlan.rooms[0].weeks = value; }
  get selectedStartDate() { return this.quotePlan.startDate; }
  set selectedStartDate(value: string) { this.quotePlan.courses[0].startDate = value; this.quotePlan.rooms[0].startDate = value; }
  get selectedRegistrationDate() { return this.students[0].selectedRegistrationDate; }
  set selectedRegistrationDate(value: string) { this.students[0].selectedRegistrationDate = value; }
  quoteCalculated = false;

  readonly quickInfo: QuickInfo[] = [
    { icon: 'villa', label: '学校类型', value: '度假村型半斯巴达', note: 'Nivel Hills 校园型学校' },
    { icon: 'groups', label: '适合人群', value: '成人 / 青少年 / 亲子', note: '低龄和亲子需提前确认规则' },
    { icon: 'verified_user', label: '管理模式', value: '半斯巴达管理', note: '学习管理与生活舒适度并重' },
    { icon: 'school', label: '课程选项', value: 'ESL / IELTS / TOEIC', note: '另有口语、商务、青少年和家长课程' },
    { icon: 'bed', label: '住宿房型', value: 'A栋 / B栋', note: '热门房型和家庭房需早确认' },
    { icon: 'event_available', label: '校区位置', value: 'Nivel Hills, Lahug', note: '宿务半山安静校园环境' },
  ];

  galleryImages: GalleryImage[] = [
    { category: '校园', title: 'CPI校区主景', description: '位于Nivel Hills / Lahug，校园、泳池、住宿和设施集中。', src: 'assets/cpi/campus-exterior.webp' },
    { category: '教室', title: '一对一教室', description: '用于综合英语、口语、考试专项和商务课程。', src: 'assets/cpi/group-classroom.webp' },
    { category: '教室', title: '团体教室', description: '小团体和大团体课程用于讨论、表达和综合训练。', src: 'assets/cpi/classroom.webp' },
    { category: '住宿', title: 'CPI宿舍房型', description: '', src: '/assets/cpi/dorm-photos/quad-a-01.webp' },
    { category: '餐厅', title: '学生餐厅', description: '校内用餐，适合希望学习生活集中管理的学生。', src: 'assets/cpi/dining-hall.webp' },
    { category: '设施', title: '健身房', description: '课后运动和体能恢复使用。', src: 'assets/cpi/gym.webp' },
    { category: '设施', title: '校内咖啡区', description: '课后休息、交流和轻松学习空间。', src: 'assets/cpi/cafe.webp' },
    { category: '设施', title: '运动空间', description: '校园活动和周末校内生活更丰富。', src: 'assets/cpi/badminton.webp' },
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
    { image: 'assets/cpi/campus-exterior.webp', title: '度假村式校园环境', text: 'CPI适合重视住宿、餐厅、泳池和校内生活舒适度的学生。' },
    { image: 'assets/cpi/classroom.webp', title: '课程方向覆盖广', text: 'ESL、考试、口语、商务、青少年和家长课程都可以纳入比较。' },
    { image: 'assets/cpi/dorm-room.webp', title: '房型选择影响预算', text: 'A栋四人间适合先估算预算，B栋和家庭房型需单独核房。' },
    { image: 'assets/cpi/dining-hall.webp', title: '学习生活集中管理', text: '适合第一次游学、亲子或想降低适应成本的学生。' },
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
      image: 'assets/cia/sida-why-action-contract.webp',
      alt: '思达启航正式合同与学校文件核验',
    },
    {
      number: '02',
      title: '房型和费用提前算清',
      text: '0中介服务费，课程费、住宿费、折扣优惠及CPI到校费用逐项说明。',
      image: 'assets/cia/sida-why-action-fees.webp',
      alt: '思达启航顾问为学生核算菲律宾宿务CPI语言学校费用',
    },
    {
      number: '03',
      title: '先判断CPI是否适合',
      text: '根据预算、房型偏好、亲子需求、课程目标和入学档期，帮你判断CPI是否匹配。',
      image: 'assets/cia/sida-why-action-selection.webp',
      alt: '思达启航顾问帮助学生选择适合的英语学校',
    },
    {
      number: '04',
      title: '出发前每一步有人提醒',
      text: '签证、eTravel、入学文件、付款、接机和当地费用准备都会提前提醒。',
      image: 'assets/cia/sida-why-action-departure.webp',
      alt: '菲律宾游学出发前文件和行李准备',
    },
    {
      number: '05',
      title: '服务持续到完成学习回国',
      text: '换老师、调课、住宿、账单、续读或转校问题都可以继续协助。',
      image: 'assets/cia/sida-why-action-followup.webp',
      alt: '思达启航顾问持续跟进学生学习情况',
    },
    {
      number: '06',
      title: '深圳总部 + 宿务驻点服务',
      text: '国内顾问与宿务工作人员协作，重要节点有人跟进。',
      image: 'assets/cia/sida-why-action-team.webp',
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
    this.applyContentConfig(this.readSessionPreview() ?? this.initialContent);
    this.loadSchoolContent();
    this.exchangeRateService.getLatestCnyRates().pipe(catchError(() => EMPTY)).subscribe((snapshot) => {
      this.usdToCny = snapshot.usdToCny;
      this.phpPerCny = snapshot.phpPerCny;
      this.exchangeRateDate = snapshot.date;
      this.exchangeRateLive = true;
    });
  }

  ngAfterViewInit(): void {
    if (!this.isEditorPreview) return;
    this.previewHost.nativeElement.classList.add('cpi-editor-preview');
    window.parent.postMessage({ type: 'cpi-content-ready' }, window.location.origin);
  }

  ngOnDestroy(): void { clearTimeout(this.previewFocusTimer); }

  @HostListener('window:message', ['$event'])
  applyEditorPreview(event: MessageEvent): void {
    if (!this.isEditorPreview || event.origin !== window.location.origin || event.source !== window.parent) return;
    const message = event.data as { type?: string; content?: CiaContentConfig; target?: CiaPreviewTarget; scroll?: boolean };
    if (message?.type !== 'cpi-content-preview' || !message.content) return;
    this.applyContentConfig(message.content);
    if (isCiaPreviewTarget(message.target)) this.previewTarget = message.target;
    this.queuePreviewFocus(message.scroll === true);
  }

  @HostListener('click', ['$event'])
  selectPreviewEditorItem(event: MouseEvent): void {
    if (!this.isEditorPreview || !(event.target instanceof Element)) return;
    const element = event.target.closest<HTMLElement>('[data-cia-preview-kind]');
    const target = { kind: element?.dataset['ciaPreviewKind'], id: element?.dataset['ciaPreviewId'] };
    if (!isCiaPreviewTarget(target)) return;
    this.previewTarget = target;
    this.queuePreviewFocus(false);
    window.parent.postMessage({ type: 'cpi-content-select', ...target }, window.location.origin);
  }

  isPreviewHighlighted(kind: string | undefined, id: string | undefined): boolean {
    return this.isEditorPreview && !!kind && !!id
      && this.previewHighlightTarget?.kind === kind && this.previewHighlightTarget?.id === id;
  }

  private queuePreviewFocus(scroll: boolean): void {
    if (!this.isEditorPreview || !this.previewTarget) return;
    clearTimeout(this.previewFocusTimer);
    this.previewFocusTimer = setTimeout(() => {
      const target = this.previewTarget!;
      const result = resolveCiaPreviewTarget(this.previewHost.nativeElement, target);
      const fallback = result.elements[0]?.dataset;
      this.previewHighlightTarget = result.exact ? target : fallback
        ? { kind: 'section', id: fallback['ciaPreviewId'] ?? '' } : undefined;
      for (const element of result.elements) if (scroll) revealCiaPreviewElement(element);
      if (scroll && result.elements[0]) scrollCiaPreviewElement(result.elements[0]);
      const item = target.kind === 'course' ? this.previewContent?.courses.find(entry => entry.id === target.id)
        : target.kind === 'room' ? this.previewContent?.rooms.find(entry => entry.id === target.id)
          : target.kind === 'fee' ? this.previewContent?.localFees.find(entry => entry.id === target.id)
            : target.kind === 'promotion' ? this.previewContent?.quoteSettings.promotions.find(entry => entry.id === target.id) : undefined;
      const status = item?.enabled === false ? '此项已隐藏或停用，官网不会显示；已定位到所属板块。'
        : !result.exact && target.kind === 'promotion' ? '当前试算未产生此优惠；已定位到优惠显示区域。'
          : result.exact ? '橙色框内就是对应的官网内容，修改会在这里即时显示。'
            : '当前试算未显示此项，已定位到所属板块。';
      window.parent.postMessage({ type: 'cpi-content-located', target, status }, window.location.origin);
    }, 80);
  }

  private readSessionPreview(): CiaContentConfig | null {
    if (typeof sessionStorage === 'undefined' || !this.isEditorPreview) return null;
    try {
      const raw = sessionStorage.getItem('cpi-content-preview');
      if (!raw) return null;
      const value = JSON.parse(raw) as CiaContentConfig;
      return value?.schemaVersion === 1 && value.schoolCode === 'CPI' ? value : null;
    } catch { return null; }
  }

  private applyContentConfig(value: CiaContentConfig): void {
    if (value?.schemaVersion !== 1 || value.schoolCode !== 'CPI') return;
    const content = cloneCpiContentConfig(value);
    this.previewContent = content;
    const courses = content.courses.filter(item => item.enabled).sort((a, b) => a.sortOrder - b.sortOrder);
    const rooms = content.rooms.filter(item => item.enabled).sort((a, b) => a.sortOrder - b.sortOrder);
    if (courses.length) this.courseFees = courses.map(item => ({ id: item.id, name: item.name, tuition: item.tuition, suitable: item.schedule || item.suitable }));
    if (rooms.length) this.roomFees = rooms.map(item => ({ id: item.id, name: item.name, fee: item.fee, note: item.note }));
    const settings = content.quoteSettings;
    this.registrationFee = settings.registrationFee;
    this.shortTermRatios = Object.fromEntries(Object.entries(settings.shortStayRatios).map(([weeks, ratio]) => [Number(weeks), ratio]));
    this.promotionRules = structuredClone(settings.promotions);
    this.localFeeRules = structuredClone(content.localFees);
    this.quoteImageSettings = structuredClone(content.quoteImageSettings);
    this.courseTableTitle = settings.courseTableTitle;
    this.courseTableNote = settings.courseTableNote;
    this.groupClassNote = settings.groupClassNote;
    this.roomTableTitle = settings.roomTableTitle;
    this.roomTableNote = settings.roomTableNote;
    this.stayPolicyTitle = settings.stayPolicyTitle;
    this.stayPolicies = structuredClone(settings.stayPolicies);
    this.extraNightRates = structuredClone(settings.extraNightRates);
    this.localFeeIntro = settings.localFeeIntro;
    for (const student of this.students) {
      for (const row of student.quotePlan.courses) if (!this.courseFees.some(item => item.id === row.optionId)) row.optionId = this.courseFees[0]?.id ?? '';
      for (const row of student.quotePlan.rooms) if (!this.roomFees.some(item => item.id === row.optionId)) row.optionId = this.roomFees[0]?.id ?? '';
    }
  }

  private loadSchoolContent(): void {
    this.schoolService.getSchools({ name: this.pricingSchoolSearchName }).pipe(
      switchMap(schools => {
        const school = this.pricingSchoolNames.map(name => schools.find(item => item.name === name)).find(Boolean)
          ?? schools.find(item => item.name.toLowerCase().includes('cpi') && !item.name.toLowerCase().includes('cpils'));
        if (!school?.id) return EMPTY;
        return forkJoin({
          published: this.schoolContentService.getPublished<CiaContentConfig>(school.id).pipe(catchError(() => of(null))),
          photos: this.schoolService.getSchoolPhotos({ schoolId: school.id, isActive: true }).pipe(catchError(() => of([]))),
        });
      }),
      catchError(() => EMPTY),
    ).subscribe(({ published, photos }) => {
      const preview = this.readSessionPreview();
      if (preview) this.applyContentConfig(preview);
      else if (published?.content) this.applyContentConfig(published.content);
      this.applyGalleryPhotos(photos);
    });
  }

  private applyGalleryPhotos(photos: SchoolPhotoDTO[]): void {
    const existing = new Set(this.galleryImages.map(item => item.src));
    const uploaded = (photos ?? []).filter(photo => !!photo.url && !existing.has(photo.url))
      .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
      .map(photo => ({
        category: this.resolveMediaCategory(photo.category),
        title: photo.caption || photo.altText || photo.originalFileName || 'CPI 学校媒体',
        description: photo.altText || photo.caption || 'CPI 学校实景内容',
        src: photo.url ?? '', contentType: photo.contentType,
      }));
    if (uploaded.length) this.galleryImages = [...this.galleryImages, ...uploaded];
  }

  private resolveMediaCategory(category?: string): Exclude<GalleryCategory, '全部'> {
    const value = (category ?? '').toLowerCase();
    if (value.includes('class') || value.includes('教室')) return '教室';
    if (value.includes('room') || value.includes('dorm') || value.includes('住宿')) return '住宿';
    if (value.includes('food') || value.includes('dining') || value.includes('餐')) return '餐厅';
    if (value.includes('facility') || value.includes('设施')) return '设施';
    return '校园';
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
  get tuitionForSelectedWeeks(): number { return this.activeStudents.reduce((sum, student) => sum + student.quotePlan.total('course'), 0); }
  get roomFeeForSelectedWeeks(): number { return this.activeStudents.reduce((sum, student) => sum + student.quotePlan.total('room'), 0); }
  get courseAndRoomBase(): number { return this.tuitionForSelectedWeeks + this.roomFeeForSelectedWeeks; }
  get billingRuleText(): string {
    const percentage = this.shortTermRatios[this.selectedWeeks];
    return percentage
      ? `${this.selectedWeeks}周按4周课程费和住宿费的${percentage * 100}%计算`
      : `${this.selectedWeeks}周按4周价格的${this.billingMultiplier}倍计算`;
  }
  get billingRuleSummary(): string {
    const rows = Object.entries(this.shortTermRatios).sort(([a], [b]) => Number(a) - Number(b));
    return rows.length ? `${rows.map(([weeks, ratio]) => `${weeks}周按4周价格的${Number(ratio) * 100}%`).join('、')}计算` : '4周以上按周折算';
  }
  promotionRule(id: string): CiaPromotionRule | undefined { return this.promotionRules.find(item => item.id === id && item.enabled); }
  private promotionEligible(rule: CiaPromotionRule, student: CpiStudentQuote): boolean {
    if (!rule.enabled || (rule.newStudentsOnly && student.returningStudent)) return false;
    if (student.quotePlan.courseWeeks < rule.minimumCourseWeeks || student.quotePlan.roomWeeks < rule.minimumAccommodationWeeks) return false;
    if (rule.registrationStart && !this.isDateBetween(student.selectedRegistrationDate, rule.registrationStart, rule.registrationEnd || rule.registrationStart)) return false;
    if (rule.registrationEnd && !rule.registrationStart && student.selectedRegistrationDate > rule.registrationEnd) return false;
    if (rule.arrivalStart && student.quotePlan.startDate < rule.arrivalStart) return false;
    if (rule.arrivalEnd && student.quotePlan.startDate > rule.arrivalEnd) return false;
    return true;
  }
  private promotionCourseWeeks(rule: CiaPromotionRule, student: CpiStudentQuote): number {
    if (!rule.coverageStart || !rule.coverageEnd || rule.coverageTarget === 'none') return student.quotePlan.courseWeeks;
    const from = Date.parse(`${rule.coverageStart}T00:00:00Z`);
    const through = Date.parse(`${rule.coverageEnd}T00:00:00Z`);
    return student.quotePlan.weekStarts(student.quotePlan.courses).filter(start => start >= from && start + 6 * 86400000 <= through).length;
  }
  private studentPromotionAmount(rule: CiaPromotionRule, student: CpiStudentQuote): number {
    if (!this.promotionEligible(rule, student) || rule.discountType === 'none') return 0;
    const tuition = student.quotePlan.total('course');
    const accommodation = student.quotePlan.total('room');
    const base = rule.appliesTo === 'tuition' ? tuition : rule.appliesTo === 'accommodation' ? accommodation
      : rule.appliesTo === 'school-total' ? tuition + accommodation + this.registrationFee : tuition + accommodation;
    if (rule.discountType === 'percentage') return Math.round(base * rule.discountValue) / 100;
    if (rule.discountType === 'per-course-week') return this.promotionCourseWeeks(rule, student) * rule.discountValue;
    const repetitions = rule.incrementWeeks && rule.incrementValue && student.quotePlan.courseWeeks >= rule.minimumCourseWeeks
      ? Math.floor((student.quotePlan.courseWeeks - rule.minimumCourseWeeks) / rule.incrementWeeks) : 0;
    return rule.discountValue + repetitions * (rule.incrementValue ?? 0);
  }
  private studentSidaDiscount(student: CpiStudentQuote): number { const rule = this.promotionRule('cpi-sida-90'); return rule ? this.studentPromotionAmount(rule, student) : 0; }
  get sidaDiscountAmount(): number { return this.activeStudents.reduce((sum, student) => sum + this.studentSidaDiscount(student), 0); }
  private studentOffSeasonDiscount(student: CpiStudentQuote): number { const rule = this.promotionRule('cpi-off-season'); return rule ? this.studentPromotionAmount(rule, student) : 0; }
  get offSeasonEligible(): boolean { return this.activeStudents.some(student => this.studentOffSeasonDiscount(student) > 0); }
  get offSeasonDiscountAmount(): number { return this.activeStudents.reduce((sum, student) => sum + this.studentOffSeasonDiscount(student), 0); }
  private studentExtraClassEligible(student: CpiStudentQuote): boolean { const rule = this.promotionRule('cpi-extra-class'); return !!rule && this.promotionEligible(rule, student); }
  get extraClassEligible(): boolean { return this.activeStudents.some(student => this.studentExtraClassEligible(student)); }
  private studentDecemberStay(student: CpiStudentQuote): { fullWeeks: number; partialWeeks: number } {
    const rule = this.promotionRule('cpi-december');
    if (!rule?.coverageStart || !rule.coverageEnd || !this.promotionEligible(rule, student)) return { fullWeeks: 0, partialWeeks: 0 };
    const fullWeeks = this.promotionCourseWeeks(rule, student);
    return { fullWeeks, partialWeeks: student.quotePlan.overlapWeeks(rule.coverageStart, rule.coverageEnd) - fullWeeks };
  }
  get decemberStay(): { fullWeeks: number; partialWeeks: number } {
    return this.activeStudents.reduce((total, student) => { const value = this.studentDecemberStay(student); return { fullWeeks: total.fullWeeks + value.fullWeeks, partialWeeks: total.partialWeeks + value.partialWeeks }; }, { fullWeeks: 0, partialWeeks: 0 });
  }
  get decemberDiscountAmount(): number { return this.decemberStay.fullWeeks * this.decemberDiscountPerWeek; }
  get decemberCalculationText(): string {
    const { fullWeeks, partialWeeks } = this.decemberStay;
    return `本次已计入完整${fullWeeks}周` + (partialWeeks ? `；另有${partialWeeks}个跨月学习周，不足一周的优惠待学校确认，暂未计入` : '');
  }
  private studentRegistration(student: CpiStudentQuote): number {
    const returningWaiver = student.returningStudent && !!this.promotionRule('cpi-returning-registration');
    const ruleWaiver = this.promotionRules.some(rule => rule.id !== 'cpi-returning-registration' && rule.waiveRegistration && this.promotionEligible(rule, student));
    return returningWaiver || ruleWaiver ? 0 : this.registrationFee;
  }
  get payableRegistrationFee(): number { return this.activeStudents.reduce((sum, student) => sum + this.studentRegistration(student), 0); }
  studentQuoteUsd(student: CpiStudentQuote): number {
    const discounts = this.promotionRules.reduce((sum, rule) => sum + this.studentPromotionAmount(rule, student), 0);
    const total = this.studentRegistration(student) + student.quotePlan.total('course') + student.quotePlan.total('room') - discounts;
    return Math.max(0, Math.round(total * 100) / 100);
  }
  get quoteUsd(): number { return this.activeStudents.reduce((sum, student) => sum + this.studentQuoteUsd(student), 0); }
  get totalCourseWeeks(): number { return this.activeStudents.reduce((sum, student) => sum + student.quotePlan.courseWeeks, 0); }
  get localFeePeriodLabel(): string { return this.quoteMode === 'single' ? `${this.quotePlan.stayWeeks}周` : `${this.activeStudents.length}人`; }
  get quoteUsdText(): string { return `${this.formatUsd(this.quoteUsd)} 美元`; }
  get quoteCnyText(): string {
    const rounded = Math.round(this.quoteUsd * this.usdToCny);
    return `约 ${rounded.toLocaleString('zh-CN')} 元`;
  }
  get exchangeRateText(): string {
    return this.exchangeRateLive && this.exchangeRateDate ? `汇率日期 ${this.exchangeRateDate}` : '暂按备用汇率估算';
  }

  get quoteHeading(): string { return `CPI${this.totalCourseWeeks}周报价`; }
  get quoteError(): string {
    if (this.quoteMode === 'group' && (!Number.isInteger(this.studentCount) || this.studentCount < 2 || this.studentCount > 20)) return '多人报价人数请选择2–20人的整数。';
    const index = this.activeStudents.findIndex(student => !!student.quotePlan.error || !this.visaOptions.some(option => option.value === student.visaType));
    return index < 0 ? '' : `${this.quoteMode === 'group' ? `学生${index + 1}：` : ''}${this.activeStudents[index].quotePlan.error || '请选择有效的签证类型。'}`;
  }
  studentAgeNote(student: CpiStudentQuote): string {
    const junior = student.quotePlan.courses.some(row => row.optionId === 'junior-6-15');
    if (student.selectedAgeGroup === 'junior' && !junior) return '6–15岁学生当前选择非Junior课程，请由顾问确认课程适用要求。';
    if (student.selectedAgeGroup !== 'junior' && junior) return 'Junior课程适用于6–15岁，当前年龄段与课程不一致，请由顾问确认。';
    return student.selectedAgeGroup === 'adult' ? '' : '未成年学生按所选课程收费，监护及入学安排须顾问确认。';
  }
  private isLongTermVisa(student: CpiStudentQuote) { return !['tourist30', 'tourist59'].includes(student.visaType); }
  private visaLabel(student: CpiStudentQuote) { return this.visaOptions.find(option => option.value === student.visaType)?.label ?? ''; }
  private visaExtensionCountFor(student: CpiStudentQuote) { return this.isLongTermVisa(student) ? 0 : Math.max(0, Math.ceil((student.quotePlan.stayWeeks * 7 - (student.visaType === 'tourist30' ? 30 : 59)) / 30)); }
  private localFeeRule(id: string): CiaLocalFeeRule | undefined { return this.localFeeRules.find(item => item.id === id && item.enabled); }
  get visaExtensionCount(): number { return this.activeStudents.reduce((sum, student) => sum + this.visaExtensionCountFor(student), 0); }
  get textbookPurchaseCount(): number { return Math.max(1, Math.ceil(this.selectedWeeks / 8)); }
  private studentLocalFees(student: CpiStudentQuote): SchoolLocalFee[] {
    const fourWeekPeriods = Math.max(1, Math.ceil(student.quotePlan.roomWeeks / 4));
    const extensionQuantity = this.visaExtensionCountFor(student);
    const longTerm = this.isLongTermVisa(student);
    const acrQuantity = longTerm ? 0 : extensionQuantity > 0 ? 1 : 0;
    const arpQuantity = longTerm || extensionQuantity > 0 ? 1 : 0;
    const visaNote = `${this.visaLabel(student)}相关费用暂按0估算，是否免收请由顾问向学校确认，以学校最新政策为准。`;
    const books = Math.max(1, Math.ceil(student.quotePlan.courseWeeks / 8));
    return [
      { item: 'SSP特殊学习许可证', unitLabel: '7,800 比索／次', quantity: longTerm ? 0 : 1, total: longTerm ? 0 : 7800, note: longTerm ? visaNote : '移民局收取；按报名学习时长办理，续费及换校需重新办理。' },
      { item: 'SSP E-CARD', unitLabel: '4,500 比索／次', quantity: longTerm ? 0 : 1, total: longTerm ? 0 : 4500, note: longTerm ? visaNote : '入学时与SSP同时办理，只收一次。' },
      { item: 'ACR-I CARD 外国人身份证', unitLabel: '4,500 比索／次', quantity: acrQuantity, total: 4500 * acrQuantity, note: longTerm ? visaNote : `按${this.visaLabel(student)}预估，首次续签时计入一次；以实际办理为准。` },
      { item: 'ARP外国人登记', unitLabel: '300 比索／次', quantity: arpQuantity, total: 300 * arpQuantity, note: longTerm ? '长期签证仍计收一次，暂按300比索预估；须由顾问确认学校最新政策。' : '旅游签证首次续签时计入一次，暂按300比索预估；须由顾问确认学校最新政策。' },
      { item: '管理费', unitLabel: '1,000 比索／4周', quantity: fourWeekPeriods, total: 1000 * fourWeekPeriods, note: '校内教学楼及其他设施维护费。' },
      { item: '水费', unitLabel: '1,500 比索／4周', quantity: fourWeekPeriods, total: 1500 * fourWeekPeriods, note: '每4周计费，不足4周按4周计算。' },
      { item: '电费', unitLabel: '2,000 比索／4周', quantity: fourWeekPeriods, total: 2000 * fourWeekPeriods, note: '预估；超出固定用量按房型另收6–20比索／千瓦时。' },
      { item: '签证续签', unitLabel: '5,140 比索／次', quantity: extensionQuantity, total: 5140 * extensionQuantity, note: longTerm ? visaNote : `${extensionQuantity ? `按${this.visaLabel(student)}预估，本次${extensionQuantity}次` : `按${this.visaLabel(student)}预估，本次无需续签`}；最终以实际办理为准。` },
      { item: '教材费', unitLabel: '2,000 比索／8周', quantity: books, total: 2000 * books, note: '按每次购买教材约可使用8周预估，不足8周按一次计；按实际购买结算。' },
      { item: '学生证', unitLabel: '350 比索／次', quantity: 1, total: 350, note: '一次性费用。' },
    ];
  }
  private configuredStudentLocalFees(student: CpiStudentQuote): SchoolLocalFee[] {
    const fourWeekPeriods = Math.max(1, Math.ceil(student.quotePlan.roomWeeks / 4));
    const extensionQuantity = this.visaExtensionCountFor(student);
    const longTerm = this.isLongTermVisa(student);
    const acrQuantity = longTerm ? 0 : extensionQuantity > 0 ? 1 : 0;
    const arpQuantity = longTerm || extensionQuantity > 0 ? 1 : 0;
    const visaNote = `${this.visaLabel(student)}相关费用暂按0估算，是否免收请由顾问向学校确认，以学校最新政策为准。`;
    const books = Math.max(1, Math.ceil(student.quotePlan.courseWeeks / 8));
    const create = (id: string, quantity: number, note?: string, total?: number): SchoolLocalFee[] => {
      const rule = this.localFeeRule(id);
      if (!rule) return [];
      const period = rule.periodWeeks ?? (id === 'books' ? 8 : 4);
      const unitLabel = ['management', 'water', 'electricity', 'books'].includes(id)
        ? `${this.formatPhp(rule.amount)}／${period}周` : `${this.formatPhp(rule.amount)}／次`;
      return [{ item: rule.name, unitLabel, quantity, total: total ?? rule.amount * quantity, note: note ?? rule.note }];
    };
    const visaRule = this.localFeeRule('visa-extension');
    const visaTotal = visaRule ? Array.from({ length: extensionQuantity }, (_, index) => visaRule.rates?.[index] ?? visaRule.rates?.at(-1) ?? visaRule.amount).reduce((sum, amount) => sum + amount, 0) : 0;
    return [
      ...create('ssp', longTerm ? 0 : 1, longTerm ? visaNote : undefined),
      ...create('ssp-e-card', longTerm ? 0 : 1, longTerm ? visaNote : undefined),
      ...create('acr-i-card', acrQuantity, longTerm ? visaNote : undefined),
      ...create('arp', arpQuantity, longTerm ? `长期签证仍计收一次；${this.localFeeRule('arp')?.note ?? ''}` : undefined),
      ...create('management', fourWeekPeriods),
      ...create('water', fourWeekPeriods),
      ...create('electricity', fourWeekPeriods),
      ...create('visa-extension', extensionQuantity, longTerm ? visaNote : `${extensionQuantity ? `按${this.visaLabel(student)}预估，本次${extensionQuantity}次` : `按${this.visaLabel(student)}预估，本次无需续签`}；${visaRule?.note ?? ''}`, visaTotal),
      ...create('books', books),
      ...create('student-id', 1),
    ];
  }
  get localFees(): LocalFee[] { return this.includedLocalFees; }
  get includedLocalFees(): LocalFee[] { return groupLocalFees(this.activeStudents.map(student => ({ localFees: this.configuredStudentLocalFees(student) }))).map(fee => ({ item: fee.item, amount: fee.unitLabel, quantity: fee.quantity, total: fee.total, note: fee.note })); }
  get localFeesTotal(): number { return this.includedLocalFees.reduce((sum, fee) => sum + fee.total, 0); }
  get localFeesCnyText(): string { return `约 ${Math.round(this.localFeesTotal / this.phpPerCny).toLocaleString('zh-CN')} 元`; }
  get excludedLocalFees(): LocalFee[] {
    const pickupCount = this.activeStudents.filter(student => student.pickupSelected).length;
    const count = this.activeStudents.length;
    return this.localFeeRules.filter(rule => rule.enabled && !rule.includeInTotal).map(rule => {
      if (rule.id === 'pickup') {
        const total = rule.amount * pickupCount;
        return { item: rule.name, amount: pickupCount ? this.formatPhp(total) : `${this.formatPhp(rule.amount)}／人`, quantity: pickupCount, total, note: `${rule.note}${rule.secondaryAmount ? `其他时间${this.formatPhp(rule.secondaryAmount)}／人；` : ''}不计入学杂费合计。`, excluded: true };
      }
      if (rule.id === 'deposit') {
        const total = rule.amount * count;
        return { item: rule.name, amount: this.formatPhp(total), quantity: count, total, note: `${rule.note}不计入学杂费合计。`, excluded: true };
      }
      const suffix = rule.secondaryLabel ? ` / ${rule.secondaryLabel.replace(/／/g, ' / ')}` : '';
      return { item: rule.name, amount: `${this.formatPhp(rule.amount).replace(' 比索', ' 比索')}${suffix}`, quantity: 0, total: 0, note: `${rule.note}不计入学杂费合计。`, excluded: true };
    });
  }

  private studentPaymentLines(student: CpiStudentQuote): SchoolPaymentLine[] {
    return this.promotionRules
      .filter(rule => rule.discountType !== 'none')
      .map(rule => ({ rule, amount: this.studentPromotionAmount(rule, student) }))
      .filter(item => item.amount > 0)
      .map(({ rule, amount }) => ({
        icon: rule.id === 'cpi-sida-90' ? '折' : rule.id === 'cpi-december' ? '冬' : '惠',
        label: rule.name,
        value: -amount,
        note: `${this.quoteMode === 'single' ? '1人适用；' : ''}${rule.description}${rule.discountType === 'per-course-week' ? '；按符合条件的课程周数计算' : ''}`,
        promotionKey: rule.id,
      }));
  }
  get schoolPaymentItems() {
    const returning = this.activeStudents.length - this.activeStudents.filter(student => this.studentRegistration(student) > 0).length;
    return [
      { label: '注册费', amount: `${this.formatUsd(this.payableRegistrationFee)} 美元`, note: `一次性费用，老学员返校免费；本次计收${this.activeStudents.length - returning}人${returning ? `，${returning}人免收` : ''}` },
      { label: '课程费合计', amount: `${this.formatUsd(this.tuitionForSelectedWeeks)} 美元`, note: '按每位学生实际选择的课程和日期计算' },
      { label: '住宿费合计', amount: `${this.formatUsd(this.roomFeeForSelectedWeeks)} 美元`, note: '按每位学生实际选择的房型和日期计算' },
      ...groupPaymentLines(this.activeStudents.map(student => ({ paymentLines: this.studentPaymentLines(student) })), true),
    ];
  }

  get quoteImageData() {
    const settings = this.quoteImageSettings;
    const extraClassRule = this.promotionRule('cpi-extra-class');
    const paymentItems = [
      { icon: '注', label: '注册费', amount: `${this.formatUsd(this.payableRegistrationFee)} 美元`, note: settings.paymentNotes.registration || this.schoolPaymentItems[0].note },
      ...(['课', '宿'] as const).flatMap(icon => this.activeStudents.flatMap((student, index) => student.quotePlan.paymentItems().filter(item => item.icon === icon).map(item => ({
        ...item,
        label: `${this.quoteMode === 'group' ? `学生${index + 1} · ` : ''}${item.label.replace(/^课程费/, '课程').replace(/^住宿费/, '住宿')}`,
        note: [item.note, icon === '课' ? settings.paymentNotes.course : settings.paymentNotes.accommodation].filter(Boolean).join('；'),
      })))),
      ...groupPaymentLines(this.activeStudents.map(student => ({ paymentLines: this.studentPaymentLines(student) })), true),
      ...(this.extraClassEligible ? [{ icon: '赠', label: extraClassRule?.name ?? '限量一对一加课', amount: '名额待确认', note: `${extraClassRule?.description ?? ''}；${this.quoteMode === 'group' ? this.activeStudents.map((student, index) => this.studentExtraClassEligible(student) ? index + 1 : 0).filter(Boolean).map(index => `学生${index}`).join('、') : '当前方案'}符合；非现金优惠，不抵扣费用。` }] : []),
    ];
    const quote = buildPhilippinesDetailedQuote({
      schoolCode: 'CPI',
      schoolName: '菲律宾宿务CPI语言学校',
      filePrefix: 'CPI',
      heroSrc: '/assets/cpi/campus-exterior.webp',
      weeks: this.selectedWeeks,
      startDate: this.selectedStartDate,
      usdToCny: this.usdToCny,
      totalUsd: this.quoteUsd,
      fullFeeDetails: true,
      localFeeTableLayout: 'web',
      paymentItems,
      localFeeItems: this.includedLocalFees.map((fee) => { const id = this.localFeeRules.find(rule => rule.name === fee.item)?.id ?? ''; return { label: fee.item, unit: fee.amount, quantity: String(fee.quantity), amount: this.formatPhp(fee.total), note: settings.localFeeNotes[id] || fee.note }; }),
      localFeeTotal: this.localFeesTotal,
      localCurrencyName: '比索',
      localFeeCny: Math.round(this.localFeesTotal / this.phpPerCny),
      localFeeNote: settings.localFeeIntro,
      optionalFeeItems: this.excludedLocalFees.map(fee => { const id = this.localFeeRules.find(rule => rule.name === fee.item)?.id ?? ''; return { label: fee.item, amount: fee.amount, cnyAmount: fee.total ? `约人民币 ${Math.round(fee.total / this.phpPerCny).toLocaleString('zh-CN')} 元` : '', note: settings.localFeeNotes[id] || fee.note }; }),
      ruleNotes: settings.footerNotes,
    });
    const mismatchNotes = this.activeStudents.map((student, index) => student.quotePlan.warning ? `${this.quoteMode === 'group' ? `学生${index + 1}：` : ''}${student.quotePlan.warning}` : '').filter(Boolean);
    const ageNotes = this.activeStudents.map((student, index) => this.studentAgeNote(student) ? `${this.quoteMode === 'group' ? `学生${index + 1}：` : ''}${this.studentAgeNote(student)}` : '').filter(Boolean);
    const juniorNotes = this.activeStudents.flatMap((student, index) => student.quotePlan.courses.some(row => row.optionId === 'junior-6-15') ? [`${this.quoteMode === 'group' ? `学生${index + 1}：` : ''}青少年课程说明：${this.juniorCourseNote}。`] : []);
    const shortNotes = [...new Set(this.activeStudents.flatMap(student => student.quotePlan.shortStayNotes(weeks => this.shortTermRatios[weeks])))];
    const importantNotes = [...mismatchNotes, ...ageNotes, ...juniorNotes, ...shortNotes, ...settings.footerNotes];
    const result = applySchoolQuoteImageLayout({ ...quote, importantNotes }, 'CPI', this.totalCourseWeeks, this.selectedStartDate, this.quoteUsd, this.usdToCny);
    return {
      ...result, headingText: this.quoteHeading, fileName: `${this.quoteHeading}-${this.selectedStartDate.replace(/-/g, '')}.png`,
      paymentSectionTitle: settings.paymentSectionTitle, localFeeTitle: settings.localFeeSectionTitle,
      serviceSectionTitle: settings.serviceSectionTitle, benefitItems: settings.benefits, serviceLocations: settings.serviceLocations,
      alumniBenefitTitle: settings.alumniBenefitTitle, alumniBenefitItems: [{ title: settings.alumniBenefitTitle, subtitle: '', text: settings.alumniBenefitText }],
      noteTitle: settings.noteSectionTitle, importantNotes,
      conversionRates: { usdToCny: this.usdToCny, phpPerCny: this.phpPerCny, date: this.exchangeRateLive ? this.exchangeRateDate : undefined },
    };
  }

  previewFeeId(name: string) { return this.localFeeRules.find(item => item.name === name)?.id ?? 'local-fees'; }
  previewPaymentTarget(item: { label: string; note?: string }): CiaPreviewTarget {
    if (item.label === '注册费') return { kind: 'section', id: 'quote-registration' };
    const promotion = this.promotionRules.find(rule => item.label.includes(rule.name) || (item.note ?? '').includes(rule.description));
    return promotion ? { kind: 'promotion', id: promotion.id } : { kind: 'section', id: 'quote-breakdown' };
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

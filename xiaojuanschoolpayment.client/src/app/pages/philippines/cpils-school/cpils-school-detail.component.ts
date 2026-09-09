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
import { QuoteImageDownloadButtonComponent, QuoteImagePaymentItem } from '../../../components/quote-image-download-button.component';
import { CiaContentConfig, CiaLocalFeeRule, CiaPromotionRule, CiaQuoteImageSettings } from '../cia-school/cia-content-config';
import { CiaPreviewTarget, isCiaPreviewTarget, resolveCiaPreviewTarget, revealCiaPreviewElement, scrollCiaPreviewElement } from '../cia-school/cia-content-preview';
import { cloneCpilsContentConfig, createDefaultCpilsContentConfig } from './cpils-content-config';

type GalleryCategory = '全部' | '校园' | '教室' | '住宿' | '餐厅' | '设施';

interface QuickInfo { icon: string; label: string; value: string; note: string; }
interface GalleryImage { category: Exclude<GalleryCategory, '全部'>; title: string; description: string; src: string; contentType?: string; }
interface BasicInfoRow { label: string; value: string; }
interface Highlight { image: string; title: string; text: string; }
interface FitItem { title: string; text: string; }
interface CourseItem { name: string; type: string; lessons: string; suitable: string; }
interface CourseFee { id: string; name: string; tuition: number; suitable: string; }
interface ScheduleItem { time: string; title: string; text: string; }
interface RoomFee { id: string; name: string; fee: number; note: string; }
interface LocalFee { item: string; amount: string; note: string; quantity: number; total: number; excluded?: boolean; }
interface CpilsStudentQuote { quotePlan: SchoolQuotePlan; selectedAgeGroup: 'adult' | 'minor'; visaType: SchoolVisaType; returningStudent: boolean; pickupSelected: boolean; selectedRegistrationDate: string; }
interface ProcessStep { icon: string; title: string; text: string; }
interface FaqItem { question: string; answer: string; }
interface SideNavItem { label: string; target: string; icon: string; }
interface SidaCpilsReason {
  number: string;
  title: string;
  text: string;
  image: string;
  alt: string;
}
interface SidaCpilsTrustBadge { icon: string; label: string; }

@Component({
  selector: 'app-cpils-school-detail',
  standalone: true,
  imports: [SchoolQuotePlanComponent,CommonModule, FormsModule, RouterModule, MatIconModule, QuoteImageDownloadButtonComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './cpils-school-detail.component.html',
  styleUrls: [
    '../school-quote-rollout.css',
    '../cebu-school-detail-layout.css',
    '../cebu-school-detail-content.css',
    '../cebu-school-detail-responsive.css',
    '../ev-school/ev-school-detail.component.css',
    '../philippines-local-fee-table.css',
    '../../../components/school-group-quote.css',
    './cpils-school-detail.component.css',
  ],
})
export class CpilsSchoolDetailComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly schoolService = inject(SchoolService);
  private readonly schoolContentService = inject(SchoolContentService);
  private readonly exchangeRateService = inject(ExchangeRateService);
  private readonly route = inject(ActivatedRoute);
  private readonly previewHost = inject(ElementRef<HTMLElement>);
  private readonly initialContent = createDefaultCpilsContentConfig();
  private contentConfig = cloneCpilsContentConfig(this.initialContent);
  private previewContent?: CiaContentConfig;
  readonly isEditorPreview = typeof window !== 'undefined' && window.parent !== window
    && this.route.snapshot.queryParamMap.get('contentPreview') === '1';
  private previewTarget?: CiaPreviewTarget;
  private previewHighlightTarget?: CiaPreviewTarget;
  private previewFocusTimer?: ReturnType<typeof setTimeout>;
  private readonly pricingSchoolSearchName = 'CPILS';
  private readonly pricingSchoolNames = ['菲律宾宿务CPILS语言学校', 'CPILS'];
  private readonly courseFeeOrder = ['general-esl', 'general-esl-light', 'general-esl-plus', 'premier-sparta', 'toeic-course', 'toeic-guarantee', 'pre-ielts-course', 'ielts-course', 'ielts-guarantee-8-weeks', 'ielts-guarantee-12-weeks', 'toefl-course', 'business-english', 'power-speaking-and-modern-communication'];
  private readonly roomFeeOrder = ['regular-single', 'regular-twin', 'regular-triple', 'regular-quad', 'no-window-single', 'no-window-twin', 'premium-single', 'premium-twin', 'premium-triple', 'premium-quad'];

  readonly galleryCategories: GalleryCategory[] = ['全部', '校园', '教室', '住宿', '餐厅', '设施'];
  selectedGalleryCategory: GalleryCategory = '全部';
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
  get sidaDiscountRate() { return 1 - (this.promotionRule('cpils-sida')?.discountValue ?? 0) / 100; }
  get offSeasonDiscountRate() {
    const rule = this.promotionRule('cpils-off-season-spring') ?? this.promotionRule('cpils-off-season-fall');
    return 1 - (rule?.discountValue ?? 0) / 100;
  }
  seasonalFeePerWeek = this.initialContent.quoteSettings.peakSeasonFeePerWeek;
  usdToCny = 7.2;
  phpPerCny = 7.75;
  exchangeRateDate = '';
  exchangeRateLive = false;
  readonly weekOptions = [4, 8, 12, 16, 20, 24];
  localFeeIntro = this.initialContent.quoteSettings.localFeeIntro;
  readonly visaOptions = SCHOOL_VISA_OPTIONS;
  readonly students: CpilsStudentQuote[] = [this.createStudent()];
  quoteMode: 'single' | 'group' = 'single';
  private requestedStudentCount = 2;
  get studentCount() { return this.requestedStudentCount; }
  set studentCount(value: number) { this.requestedStudentCount = value; if (Number.isInteger(value) && value >= 2 && value <= 20) while (this.students.length < value) this.students.push(this.createStudent()); }
  setQuoteMode(value: 'single' | 'group') { this.quoteMode = value; if (value === 'group') this.studentCount = this.requestedStudentCount; }
  get activeStudents() { return this.quoteMode === 'single' ? this.students.slice(0, 1) : this.students.slice(0, Math.max(2, Math.min(20, Math.floor(this.studentCount) || 2))); }
  get quotePlan() { return this.students[0].quotePlan; }
  private createStudent(): CpilsStudentQuote {
    return { quotePlan: new SchoolQuotePlan('general-esl', 'regular-quad', '2026-09-06', this.weekOptions,
      kind => kind === 'course' ? this.courseFees.map(option => ({ id: option.id, name: option.name, details: option.suitable })) : this.roomFees.map(option => ({ id: option.id, name: option.name, details: '' })),
      (kind, row) => { const option = kind === 'course' ? this.courseFees.find(item => item.id === row.optionId) : this.roomFees.find(item => item.id === row.optionId); return option ? ('tuition' in option ? option.tuition : option.fee) * (row.weeks / 4) : 0; }),
      selectedAgeGroup: 'adult', visaType: 'tourist59', returningStudent: false, pickupSelected: false, selectedRegistrationDate: '2026-09-01' };
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
    { icon: 'apartment', label: '学校类型', value: '宿务老牌考试强化型', note: '2001年创立，宿务较早ESL学校之一' },
    { icon: 'groups', label: '适合人群', value: '成人 / 考试 / 亲子', note: '目标导向、可接受管理节奏的学生' },
    { icon: 'verified_user', label: '管理模式', value: '半斯巴达 / 斯巴达选择', note: '课程强度和校规需按项目确认' },
    { icon: 'school', label: '课程选项', value: 'ESL / 雅思 / 托业 / 托福', note: '另有商务、口语和亲子课程' },
    { icon: 'bed', label: '住宿房型', value: '单人 / 双人 / 三人 / 四人', note: '校内宿舍，Premium房型需另核' },
    { icon: 'workspace_premium', label: '考试资源', value: '雅思 / 托业官方资源', note: '官方资料列出雅思与托业考点资源' },
  ];

  galleryImages: GalleryImage[] = [
    { category: '校园', title: 'CPILS主楼外观', description: '宿务市区型校园，学习、住宿和服务集中在校内。', src: 'assets/cpils/campus-main.jpg' },
    { category: '校园', title: 'CPILS校园入口', description: '老牌市区学校，适合重视学习管理和生活机能的学生。', src: 'assets/cpils/campus-front.jpg' },
    { category: '教室', title: '课程体系展示', description: '官方课程页列出ESL、斯巴达ESL、雅思、托业、托福等方向。', src: 'assets/cpils/classroom-header.jpg' },
    { category: '教室', title: '课程负责人展示', description: '官方课程页展示不同课程负责人，适合按目标选择课程。', src: 'assets/cpils/classroom-teacher.jpg' },
    { category: '住宿', title: '宿舍楼与住宿区', description: '官方资料显示CPILS有180间以上宿舍房间。', src: 'assets/cpils/dormitory-building.jpg' },
    { category: '住宿', title: '校内双人房参考', description: '房内通常配备床具、桌椅、冰箱、独立卫浴和Wi-Fi。', src: 'assets/cpils/regular-room-3.jpg' },
    { category: '住宿', title: 'Premium房型参考', description: 'Premium房型费用更高，亲子、青少年和高楼层房型需提前确认。', src: 'assets/cpils/premium-room-2.jpg' },
    { category: '餐厅', title: 'Dining Area餐饮区', description: '官方服务设施列出Dining Area和Snack Bar。', src: 'assets/cpils/service-12.png' },
    { category: '设施', title: 'Fitness Gym健身房', description: '官方休闲设施页列出健身房，适合课后运动。', src: 'assets/cpils/gym.jpg' },
    { category: '设施', title: 'Outdoor Swimming Pool', description: '泳池是CPILS官方介绍中的主要休闲设施之一。', src: 'assets/cpils/leisure-pool.jpg' },
    { category: '设施', title: '学生服务柜台', description: '到校后费用、证件、宿舍和日常问题可通过学校窗口处理。', src: 'assets/cpils/service-2.png' },
  ];

  readonly basicInfo: BasicInfoRow[] = [
    { label: '学校名称', value: '菲律宾宿务CPILS语言学校（Center for Premier International Language Studies）' },
    { label: '所在地区', value: 'Benedicto Bldg., M.J. Cuenco Ave., Cebu City' },
    { label: '创立时间', value: '2001年，官方资料称为宿务第一所ESL Center' },
    { label: '学校定位', value: '老牌ESL、考试英语、斯巴达/半斯巴达管理型学校' },
    { label: '课程资源', value: 'General ESL、斯巴达ESL、雅思、托业、托福、Business、PMC演讲、Parent-Child' },
    { label: '住宿资源', value: '180间以上宿舍房间，单人、双人、三人和四人房' },
    { label: '考试资源', value: '官方历史资料列出托业官方考点、雅思相关资源和考场历史' },
    { label: '服务设施', value: 'Dining Area、Snack Bar、Clinic、Laundry、Security、Gym、Pool、Cafe、Lounge' },
  ];

  readonly highlights: Highlight[] = [
    { image: 'assets/cpils/campus-main.jpg', title: '宿务老牌语言学校', text: '2001年创立，适合看重学校经验、管理体系和考试资源的学生。' },
    { image: 'assets/cpils/classroom-header.jpg', title: '课程覆盖完整', text: 'ESL、斯巴达、雅思、托业、托福、商务、口语和亲子课程都可比较。' },
    { image: 'assets/cpils/regular-room-3.jpg', title: '校内住宿集中管理', text: '宿舍、课程、餐饮和服务都在校内，适合想降低通勤和适应压力的人。' },
    { image: 'assets/cpils/gym.jpg', title: '学习之外也有设施', text: '泳池、健身房、咖啡娱乐区和休息区能支持课后放松。' },
  ];

  readonly suitableFor: FitItem[] = [
    { title: '目标很清楚，想要被学习节奏推动', text: 'CPILS更适合想通过课程安排、校规和模考推进英语或考试目标的学生。' },
    { title: '准备雅思、托业或托福', text: '官方资料显示CPILS长期发展考试课程，并有托业与雅思相关资源。' },
    { title: '希望住校内、学习生活集中管理', text: '宿舍、餐厅、服务窗口、洗衣、诊所和保安都在学校系统内。' },
    { title: '成人、职场或亲子学生需要课程比较', text: '商务、PMC演讲课程和Parent-Child Program都适合让顾问按目标细分。' },
  ];

  readonly notSuitableFor: FitItem[] = [
    { title: '只想要度假村感和新校区环境', text: 'CPILS是市区老牌学校，环境重点不在度假风格，若重视校园质感可比较CPI、CIA、EV。' },
    { title: '完全不想接受校规或学习管理', text: '考试、斯巴达和保证班方向会有更明确的出勤、测试和纪律要求。' },
    { title: '只看网页价格，不准备当地费用', text: '除前期费用外，到校还会有SSP、SSP I-CARD、管理、水电、教材、押金等当地费用。' },
    { title: '热门档期才临时确认单人房', text: '考试课程、亲子档期、Premium或单人房都建议提前确认空房。' },
  ];

  readonly courses: CourseItem[] = [
    { name: 'General ESL / Plus / Light', type: '综合英语', lessons: 'General为3堂1:1 + 2堂1:4 + 2堂1:12；Plus增加为4堂1:1；Light为4节1:1 + 1节团体课', suitable: 'Light仅限淡季入学；其余适合基础到进阶综合提升。' },
    { name: '斯巴达ESL', type: '斯巴达强化', lessons: '5堂1:1 + 2堂1:4 + 2堂1:12 + 2堂强制自修 + 选修课', suitable: '适合需要明确管理和高强度学习节奏的学生。' },
    { name: '雅思课程 / 雅思预备课程 / 雅思保证班', type: '雅思备考', lessons: '雅思预备课程以1:1为主；雅思课程为4堂1:1 + 5堂大团体 + 3堂强制自修', suitable: '雅思保证班按8周或12周方案起报。' },
    { name: '托业课程 / 托业保证班', type: '托业备考', lessons: '4堂1:1 + 2堂1:4 + 2堂大团体 + 3堂强制自修 + 选修课', suitable: '听力与阅读训练，每月2次模拟考试。' },
    { name: 'TOEFL Course', type: '托福备考', lessons: '3堂1:1 + 2堂1:4 + 2堂1:12 + 2堂大团体 + 3堂强制自修', suitable: '每月1次模拟考试，适合有北美升学或托福分数目标的学生。' },
    { name: 'Business / PMC演讲课程', type: '商务与演讲', lessons: 'Business为4堂1:1 + 2堂1:4 + 1堂1:12 + 2堂大团体；PMC增加口语与强制自修', suitable: '两类课程均4周起报。' },
  ];

  courseFees: CourseFee[] = [
    { id: 'general-esl', name: 'General ESL', tuition: 935, suitable: '3堂1:1 + 2堂1:4 + 2堂1:12 + 选修课' },
    { id: 'general-esl-light', name: 'General ESL Light', tuition: 600, suitable: '4节1:1 + 1节团体课；仅限淡季入学' },
    { id: 'general-esl-plus', name: 'General ESL Plus', tuition: 935, suitable: '4堂1:1 + 2堂1:4 + 1堂1:12 + 选修课' },
    { id: 'premier-sparta', name: '斯巴达ESL', tuition: 1040, suitable: '5堂1:1 + 2堂1:4 + 2堂1:12 + 2堂强制自修 + 选修课' },
    { id: 'toeic-course', name: '托业课程', tuition: 1040, suitable: '4堂1:1 + 2堂1:4 + 2堂大团体 + 3堂强制自修 + 选修；每月2次模考' },
    { id: 'toeic-guarantee', name: '托业保证班', tuition: 1132, suitable: '4堂1:1 + 2堂1:4 + 2堂大团体 + 3堂强制自修 + 选修；每月2次模考' },
    { id: 'pre-ielts-course', name: '雅思预备课程', tuition: 1097, suitable: '5堂1:1 + 1堂1:4 + 1堂1:8 + 2堂大团体 + 3堂强制自修；雅思3分以下，4周起报' },
    { id: 'ielts-course', name: '雅思课程', tuition: 1097, suitable: '4堂1:1 + 5堂大团体 + 3堂强制自修；每月2次模考，4周起报' },
    { id: 'ielts-guarantee-8-weeks', name: '雅思保证班（8周）', tuition: 1247.5, suitable: '4堂1:1 + 5堂大团体 + 3堂强制自修；8周起报，赠机考' },
    { id: 'ielts-guarantee-12-weeks', name: '雅思保证班（12周）', tuition: 1189.7, suitable: '4堂1:1 + 5堂大团体 + 3堂强制自修；12周起报，赠机考' },
    { id: 'toefl-course', name: 'TOEFL Course', tuition: 1040, suitable: '3堂1:1 + 2堂1:4 + 2堂1:12 + 2堂大团体 + 3堂强制自修；每月1次模考' },
    { id: 'business-english', name: 'Business English', tuition: 1040, suitable: '4堂1:1 + 2堂1:4 + 1堂1:12 + 2堂大团体；4周起报' },
    { id: 'power-speaking-and-modern-communication', name: 'PMC演讲课程', tuition: 1040, suitable: '4堂1:1 + 3堂1:4 + 1堂1:12 + 2堂大团体 + 2堂强制自修；4周起报' },
  ];

  roomFees: RoomFee[] = [
    { id: 'regular-single', name: '单人房', fee: 995, note: '隐私最好，预算较高，热门档期需早确认' },
    { id: 'regular-twin', name: '双人房', fee: 840, note: '适合朋友同行或希望兼顾预算与舒适度' },
    { id: 'regular-triple', name: '三人房', fee: 775, note: '多人房中预算较平衡' },
    { id: 'regular-quad', name: '四人房', fee: 700, note: '默认报价参考，预算压力较低' },
    { id: 'no-window-single', name: '无对外窗单人房', fee: 995, note: '无对外窗房型，空房和采光条件需提前确认' },
    { id: 'no-window-twin', name: '无对外窗双人房', fee: 840, note: '无对外窗房型，适合两人同行' },
    { id: 'premium-single', name: '高级单人房', fee: 1085, note: '高级房型，隐私和住宿规格更高' },
    { id: 'premium-twin', name: '高级双人房', fee: 910, note: '高级双人房，适合重视住宿舒适度的学生' },
    { id: 'premium-triple', name: '高级三人房', fee: 850, note: '高级多人房，兼顾预算与住宿规格' },
    { id: 'premium-quad', name: '高级四人房', fee: 780, note: '高级多人房中预算压力较低' },
  ];

  readonly schedule: ScheduleItem[] = [
    { time: '07:00 - 08:00', title: '早餐与晨间准备', text: '校内用餐后准备当天课程，具体时间以学校课表为准。' },
    { time: '08:00 - 12:00', title: '上午课程', text: '一对一、小团体、大团体或考试专项课程，按课程强度安排。' },
    { time: '12:00 - 13:00', title: '午餐与休息', text: '校内餐饮区用餐，可整理笔记或短暂休息。' },
    { time: '13:00 - 17:00', title: '下午课程', text: '继续口语、听力、阅读、写作、考试技巧或商务表达训练。' },
    { time: '17:00 - 19:00', title: '晚餐与自由时间', text: '可使用学校服务窗口、宿舍、洗衣或休闲设施。' },
    { time: '19:00 - 21:00', title: '自习 / 选修 / 校内安排', text: '斯巴达、考试和亲子课程的晚间规则需按项目确认。' },
  ];

  readonly serviceSteps: ProcessStep[] = [
    { icon: 'person_search', title: '判断CPILS是否适合', text: '先了解学习目标、当前程度、考试分数、预算、房型和可接受管理强度。' },
    { icon: 'fact_check', title: '确认课程、房型和优惠', text: '免费协助确认课程、房型、空房、优惠和正式报价。' },
    { icon: 'assignment_turned_in', title: '协助入境和签证手续', text: '思达免费协助办理菲律宾入境及签证相关手续，学生只需按顾问指引准备个人资料。' },
    { icon: 'inventory', title: '发送学习资料和行前清单', text: '入学前免费发送学习资料、行李清单、费用清单和到校注意事项。' },
    { icon: 'support_agent', title: '到校后继续跟进', text: '遇到换老师、调课、学习方法、宿舍生活或学校沟通问题，也可以继续联系思达协助。' },
    { icon: 'location_on', title: '宿务当地支持', text: '思达在宿务有工作人员驻点，可提供当地支持，直到学生完成学习并顺利回国。' },
  ];

  readonly sidaCpilsReasons: SidaCpilsReason[] = [
    {
      number: '01',
      title: '正式合同与学校文件可核验',
      text: '国内公司签约，CPILS报价、录取文件及收费凭证均可逐项核对。',
      image: 'assets/cia/sida-why-action-contract.jpg',
      alt: '思达启航正式合同与学校文件核验',
    },
    {
      number: '02',
      title: '考试目标和费用提前算清',
      text: '0中介服务费，课程费、住宿费、考试课程规则及CPILS到校费用逐项说明。',
      image: 'assets/cia/sida-why-action-fees.jpg',
      alt: '思达启航顾问为学生核算菲律宾宿务CPILS语言学校费用',
    },
    {
      number: '03',
      title: '先判断CPILS是否适合',
      text: '根据目标分数、管理强度、预算、房型和入学档期，帮你判断CPILS是否匹配。',
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

  readonly sidaCpilsTrustBadges: SidaCpilsTrustBadge[] = [
    { icon: 'description', label: '国内正式公司合同' },
    { icon: 'verified_user', label: '学校合作与文件核验' },
    { icon: 'local_offer', label: '费用透明与同条件保价' },
    { icon: 'apartment', label: '深圳总部 + 宿务驻点' },
  ];

  readonly schoolServices = ['机场接机', '入学说明', '分级测试', '课程咨询', 'Dining Area', 'Snack Bar', '洗衣服务', 'Housekeeping', 'School Clinic', 'Security', '学习室', '学生服务窗口'];
  readonly campusActivities = ['新生说明会', '英语交流', '泳池休闲', '健身房运动', '咖啡娱乐区', 'Mezzanine Lounge休息'];
  readonly weekendActivities = ['宿务市区生活', '商场与餐厅', '咖啡厅', '跳岛游', '海边活动', '学生自发聚会'];
  readonly notes = [
    'CPILS课程选择较多，建议先确认你是要综合英语、考试分数、斯巴达管理、商务还是亲子方向。',
    '考试课程、亲子档期、单人房和Premium房型建议尽早确认空房。',
    '本页课程费与住宿费拆分用于报价逻辑，正式报价仍需按学校费用表、优惠和房型确认。',
    '到校支付费用会随学校政策、汇率和个人情况变化。',
    '最终报名以学校正式录取、付款节点和顾问确认报价为准。',
  ];
  readonly faqs: FaqItem[] = [
    { question: 'CPILS适合第一次菲律宾游学吗？', answer: '适合目标清楚、可以接受一定学习管理的学生。若第一次游学但希望有人督促学习，CPILS会比自由型学校更有节奏。' },
    { question: 'CPILS更适合考试还是口语？', answer: '两者都有，但CPILS的老牌考试资源和管理体系更突出。若目标是雅思、托业或托福，建议优先核对当前分数、目标分数和可读周数。' },
    { question: '页面上的报价包含全部费用吗？', answer: '不包含全部。前期支付包含注册费、课程费、住宿费、已计入优惠和可能的暑假附加费；到校学杂费会按周数另行计算。' },
    { question: 'CPILS优惠怎么计算？', answer: '课程费与住宿费先按思达9折计算；符合2026淡季条件时再享95折。无对外窗单/双人房每4周另减50美元，符合学习期覆盖条件时圣诞/新年再减75或150美元；注册费不打折。' },
    { question: 'CPILS住宿有哪些房型？', answer: '官方资料列出单人、双人、三人和四人房，也有Main Building Regular、Premium和Extension等住宿方向。具体空房需按入学日期确认。' },
    { question: '思达会协助签证和入境吗？', answer: '会。通过思达报名CPILS，思达顾问会免费协助菲律宾入境及签证相关手续，学生只需要按顾问指引准备个人资料。' },
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
    this.previewHost.nativeElement.classList.add('cpils-editor-preview');
    window.parent.postMessage({ type: 'cpils-content-ready' }, window.location.origin);
  }

  ngOnDestroy(): void { clearTimeout(this.previewFocusTimer); }

  @HostListener('window:message', ['$event'])
  applyEditorPreview(event: MessageEvent): void {
    if (!this.isEditorPreview || event.origin !== window.location.origin || event.source !== window.parent) return;
    const message = event.data as { type?: string; content?: CiaContentConfig; target?: CiaPreviewTarget; scroll?: boolean };
    if (message?.type !== 'cpils-content-preview' || !message.content) return;
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
    window.parent.postMessage({ type: 'cpils-content-select', ...target }, window.location.origin);
  }

  isPreviewHighlighted(kind: string | undefined, id: string | undefined): boolean {
    return this.isEditorPreview && !!kind && !!id && this.previewHighlightTarget?.kind === kind && this.previewHighlightTarget?.id === id;
  }

  private queuePreviewFocus(scroll: boolean): void {
    if (!this.isEditorPreview || !this.previewTarget) return;
    clearTimeout(this.previewFocusTimer);
    this.previewFocusTimer = setTimeout(() => {
      const target = this.previewTarget!;
      const result = resolveCiaPreviewTarget(this.previewHost.nativeElement, target);
      const fallback = result.elements[0]?.dataset;
      this.previewHighlightTarget = result.exact ? target : fallback ? { kind: 'section', id: fallback['ciaPreviewId'] ?? '' } : undefined;
      for (const element of result.elements) if (scroll) revealCiaPreviewElement(element);
      if (scroll && result.elements[0]) scrollCiaPreviewElement(result.elements[0]);
      const item = target.kind === 'course' ? this.previewContent?.courses.find(entry => entry.id === target.id)
        : target.kind === 'room' ? this.previewContent?.rooms.find(entry => entry.id === target.id)
          : target.kind === 'fee' ? this.previewContent?.localFees.find(entry => entry.id === target.id)
            : target.kind === 'promotion' ? this.previewContent?.quoteSettings.promotions.find(entry => entry.id === target.id) : undefined;
      const status = item?.enabled === false ? '此项已隐藏或停用，官网不会显示；已定位到所属板块。'
        : !result.exact && target.kind === 'promotion' ? '当前试算未产生此优惠；已定位到优惠显示区域。'
          : result.exact ? '橙色框内就是对应的官网内容，修改会在这里即时显示。' : '当前试算未显示此项，已定位到所属板块。';
      window.parent.postMessage({ type: 'cpils-content-located', target, status }, window.location.origin);
    }, 80);
  }

  private readSessionPreview(): CiaContentConfig | null {
    if (typeof sessionStorage === 'undefined' || !this.isEditorPreview) return null;
    try {
      const raw = sessionStorage.getItem('cpils-content-preview');
      if (!raw) return null;
      const value = JSON.parse(raw) as CiaContentConfig;
      return value?.schemaVersion === 1 && value.schoolCode === 'CPILS' ? value : null;
    } catch { return null; }
  }

  private applyContentConfig(value: CiaContentConfig): void {
    if (value?.schemaVersion !== 1 || value.schoolCode !== 'CPILS') return;
    const content = cloneCpilsContentConfig(value);
    this.contentConfig = content;
    this.previewContent = content;
    const courses = content.courses.filter(item => item.enabled).sort((a, b) => a.sortOrder - b.sortOrder);
    const rooms = content.rooms.filter(item => item.enabled).sort((a, b) => a.sortOrder - b.sortOrder);
    if (courses.length) this.courseFees = courses.map(item => ({ id: item.id, name: item.name, tuition: item.tuition, suitable: [item.schedule, item.suitable].filter(Boolean).join('；') }));
    if (rooms.length) this.roomFees = rooms.map(item => ({ id: item.id, name: item.name, fee: item.fee, note: item.note }));
    const settings = content.quoteSettings;
    this.registrationFee = settings.registrationFee;
    this.seasonalFeePerWeek = settings.peakSeasonFeePerWeek;
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
          ?? schools.find(item => item.name.toLowerCase().includes('cpils')) ?? schools[0];
        if (!school?.id) return EMPTY;
        return forkJoin({
          lessons: this.schoolService.getSchoolLessons({ schoolId: school.id, week: 4 }),
          rooms: this.schoolService.getSchoolRooms({ schoolId: school.id, week: 4 }),
          fees: this.schoolService.getSchoolFees({ schoolId: school.id }),
          published: this.schoolContentService.getPublished<CiaContentConfig>(school.id).pipe(catchError(() => of(null))),
          photos: this.schoolService.getSchoolPhotos({ schoolId: school.id, isActive: true }).pipe(catchError(() => of([]))),
        });
      }),
      catchError(() => EMPTY),
    ).subscribe(({ lessons, rooms, fees, published, photos }) => {
      const preview = this.readSessionPreview();
      if (preview) this.applyContentConfig(preview);
      else if (published?.content) this.applyContentConfig(published.content);
      else this.applyPricingData(lessons, rooms, fees);
      this.applyGalleryPhotos(photos);
    });
  }

  private applyGalleryPhotos(photos: SchoolPhotoDTO[]): void {
    const existing = new Set(this.galleryImages.map(item => item.src));
    const uploaded = (photos ?? []).filter(photo => !!photo.url && !existing.has(photo.url))
      .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
      .map(photo => ({ category: this.resolveMediaCategory(photo.category), title: photo.caption || photo.altText || photo.originalFileName || 'CPILS 学校媒体', description: photo.altText || photo.caption || 'CPILS 学校实景内容', src: photo.url ?? '', contentType: photo.contentType }));
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
          schools.find((item) => item.name.includes('CPILS')) ??
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
      .map((lesson) => ({ id: this.slugifyPriceKey(lesson.name), name: this.courseDisplayName(lesson.name), tuition: lesson.price, suitable: lesson.description || lesson.note || '请联系顾问确认适合人群' }))
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
      if (!this.roomFees.some((room) => room.id === this.selectedRoomId)) this.selectedRoomId = this.roomFees.find((room) => room.id === 'regular-quad')?.id ?? this.roomFees[0].id;
    }

    const registrationFee = fees.find((fee) => fee.name === '注册费');
    if (registrationFee) this.registrationFee = registrationFee.fee;
    const peakSeasonFee = fees.find((fee) => fee.name === '旺季附加费');
    if (peakSeasonFee) this.seasonalFeePerWeek = peakSeasonFee.fee;
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
  promotionRule(id: string): CiaPromotionRule | undefined { return this.promotionRules.find(rule => rule.id === id && rule.enabled); }
  private localFeeRule(id: string): CiaLocalFeeRule | undefined { return this.localFeeRules.find(rule => rule.id === id && rule.enabled); }
  get selectedCourse(): CourseFee { return this.courseFees.find((course) => course.id === this.selectedCourseId) ?? this.courseFees[0]; }
  get selectedRoom(): RoomFee { return this.roomFees.find((room) => room.id === this.selectedRoomId) ?? this.roomFees[0]; }
  get tuitionForSelectedWeeks(): number { return this.activeStudents.reduce((sum, student) => sum + student.quotePlan.total('course'), 0); }
  get roomFeeForSelectedWeeks(): number { return this.activeStudents.reduce((sum, student) => sum + student.quotePlan.total('room'), 0); }
  get courseAndRoomBase(): number { return this.tuitionForSelectedWeeks + this.roomFeeForSelectedWeeks; }
  private studentBase(student: CpilsStudentQuote) { return student.quotePlan.total('course') + student.quotePlan.total('room'); }
  private studentSidaDiscount(student: CpilsStudentQuote) { return this.roundMoney(this.studentBase(student) * (1 - this.sidaDiscountRate)); }
  get sidaDiscountAmount(): number { return this.activeStudents.reduce((sum, student) => sum + this.studentSidaDiscount(student), 0); }
  get afterSidaDiscount(): number { return this.courseAndRoomBase - this.sidaDiscountAmount; }
  get isSummerBlackout(): boolean { return this.isDateBetween(this.selectedStartDate, '2026-06-01', '2026-08-26'); }
  private offSeasonRule(row: QuotePlanRow): CiaPromotionRule | undefined {
    return ['cpils-off-season-spring', 'cpils-off-season-fall'].map(id => this.promotionRule(id)).find(rule => !!rule
      && row.weeks >= Math.max(rule.minimumCourseWeeks, rule.minimumAccommodationWeeks)
      && (!rule.arrivalStart || row.startDate >= rule.arrivalStart)
      && (!rule.arrivalEnd || row.startDate <= rule.arrivalEnd));
  }
  private isOffSeasonRow(row: QuotePlanRow): boolean { return !!this.offSeasonRule(row); }
  private studentOffSeasonEligibleBase(student: CpilsStudentQuote): number {
    return [...student.quotePlan.courses, ...student.quotePlan.rooms]
      .filter(row => row.weeks >= 4 && this.isOffSeasonRow(row))
      .reduce((sum, row) => sum + student.quotePlan.price(student.quotePlan.courses.includes(row) ? 'course' : 'room', row) * this.sidaDiscountRate, 0);
  }
  get isOffSeasonEntry(): boolean { return this.activeStudents.some(student => [...student.quotePlan.courses, ...student.quotePlan.rooms].some(row => this.isOffSeasonRow(row))); }
  get offSeasonEligibleBase(): number { return this.activeStudents.reduce((sum, student) => sum + this.studentOffSeasonEligibleBase(student), 0); }
  get offSeasonEligible(): boolean { return this.offSeasonEligibleBase > 0; }
  private studentOffSeasonDiscount(student: CpilsStudentQuote): number {
    return this.roundMoney([...student.quotePlan.courses, ...student.quotePlan.rooms].reduce((sum, row) => {
      const rule = this.offSeasonRule(row);
      if (!rule) return sum;
      const kind = student.quotePlan.courses.includes(row) ? 'course' : 'room';
      return sum + student.quotePlan.price(kind, row) * this.sidaDiscountRate * rule.discountValue / 100;
    }, 0));
  }
  get offSeasonDiscountAmount(): number { return this.activeStudents.reduce((sum, student) => sum + this.studentOffSeasonDiscount(student), 0); }
  private studentNoWindowDiscount(student: CpilsStudentQuote): number {
    return student.quotePlan.rooms
      .filter(row => this.isOffSeasonRow(row) && ['no-window-single', 'no-window-twin'].includes(row.optionId))
      .reduce((sum, row) => sum + Math.floor(row.weeks / Math.max(1, this.promotionRule('cpils-no-window')?.incrementWeeks ?? 4)) * (this.promotionRule('cpils-no-window')?.discountValue ?? 0), 0);
  }
  get noWindowDiscountAmount(): number { return this.activeStudents.reduce((sum, student) => sum + this.studentNoWindowDiscount(student), 0); }
  get noWindowDiscountEligible(): boolean { return this.noWindowDiscountAmount > 0; }
  private studentHolidayDiscount(student: CpilsStudentQuote): number {
    const rules = ['cpils-holiday-new-year', 'cpils-holiday-christmas'].map(id => this.promotionRule(id)).filter((rule): rule is CiaPromotionRule => !!rule);
    for (const rule of rules) {
      if (rule.registrationStart && !this.isDateBetween(student.selectedRegistrationDate, rule.registrationStart, rule.registrationEnd || rule.registrationStart)) continue;
      if (rule.coverageStart && rule.coverageEnd && student.quotePlan.covers(rule.coverageStart, rule.coverageEnd)) return rule.discountValue;
    }
    return 0;
  }
  get holidayDiscountAmount(): number { return this.activeStudents.reduce((sum, student) => sum + this.studentHolidayDiscount(student), 0); }
  get holidayDiscountText(): string {
    const full = this.promotionRule('cpils-holiday-new-year'), short = this.promotionRule('cpils-holiday-christmas');
    const registrationStart = short?.registrationStart ?? full?.registrationStart, registrationEnd = short?.registrationEnd ?? full?.registrationEnd;
    if (registrationStart && registrationEnd && !this.isDateBetween(this.selectedRegistrationDate, registrationStart, registrationEnd)) return `注册日需在${registrationStart}–${registrationEnd}之间`;
    if (full && this.holidayDiscountAmount === full.discountValue) return `${full.description}`;
    if (short && this.holidayDiscountAmount === short.discountValue) return `${short.description}`;
    return '学习期未完整覆盖圣诞/新年指定日期';
  }
  private studentPeakWeeks(student: CpilsStudentQuote) { return this.contentConfig.quoteSettings.peakSeasonRanges.filter(range => range.enabled).reduce((sum, range) => sum + student.quotePlan.overlapWeeks(range.start, range.end, [...student.quotePlan.courses, ...student.quotePlan.rooms]), 0); }
  get peakSeasonWeeks(): number { return this.activeStudents.reduce((sum, student) => sum + this.studentPeakWeeks(student), 0); }
  get seasonalSurcharge(): number { return this.peakSeasonWeeks * this.seasonalFeePerWeek; }
  private studentRegistration(student: CpilsStudentQuote) { return student.returningStudent && this.promotionRule('cpils-returning-registration') ? 0 : this.registrationFee; }
  get payableRegistrationFee() { return this.activeStudents.reduce((sum, student) => sum + this.studentRegistration(student), 0); }
  studentQuoteUsd(student: CpilsStudentQuote): number { return Math.max(0, this.roundMoney(this.studentRegistration(student) + this.studentBase(student) - this.studentSidaDiscount(student) - this.studentOffSeasonDiscount(student) + this.studentPeakWeeks(student) * this.seasonalFeePerWeek - this.studentNoWindowDiscount(student) - this.studentHolidayDiscount(student))); }
  get quoteUsd(): number { return this.activeStudents.reduce((sum, student) => sum + this.studentQuoteUsd(student), 0); }
  get totalCourseWeeks(): number { return this.activeStudents.reduce((sum, student) => sum + student.quotePlan.courseWeeks, 0); }
  get localFeePeriodLabel(): string { return this.quoteMode === 'single' ? `${this.quotePlan.stayWeeks}周` : `${this.activeStudents.length}人`; }
  get quoteUsdText(): string { return `${this.formatUsd(this.quoteUsd)} 美元`; }
  get quoteCnyText(): string { const rounded = Math.round(this.quoteUsd * this.usdToCny); return `约 ${rounded.toLocaleString('zh-CN')} 元`; }
  get exchangeRateText(): string { return this.exchangeRateLive && this.exchangeRateDate ? `汇率日期 ${this.exchangeRateDate}` : '暂按备用汇率估算'; }
  get studyEndDate(): string { return this.quotePlan.endDate; }
  get examBenefitText(): string {
    return '雅思课程报名12周赠1次雅思官方考试；雅思保证班赠机考；托业课程/保证班4–7周赠1次，每增加4周再赠1次（最多6次）';
  }

  private studentExamBenefits(student: CpilsStudentQuote): string[] {
    return student.quotePlan.courses.flatMap(row => {
      if (row.optionId === 'ielts-course' && row.weeks >= 12) return ['雅思课程12周及以上：赠1次雅思官方考试'];
      if (row.optionId.startsWith('ielts-guarantee-')) return ['雅思保证班：赠1次雅思机考'];
      if (['toeic-course', 'toeic-guarantee'].includes(row.optionId) && row.weeks >= 4) {
        return [`${this.courseFees.find(course => course.id === row.optionId)?.name ?? '托业课程'}：赠${Math.min(6, 1 + Math.floor((row.weeks - 4) / 4))}次官方考试`];
      }
      return [];
    });
  }
  get applicableExamBenefits(): string[] {
    return this.activeStudents.flatMap((student, index) => this.studentExamBenefits(student).map(note => this.quoteMode === 'group' ? `学生${index + 1}：${note}` : note));
  }
  get applicableExamBenefitText(): string { return this.applicableExamBenefits.join('；'); }

  get quoteHeading() { return `CPILS${this.totalCourseWeeks}周报价`; }
  get quoteError(): string {
    if (this.quoteMode === 'group' && (!Number.isInteger(this.studentCount) || this.studentCount < 2 || this.studentCount > 20)) return '多人报价人数请选择2–20人的整数。';
    const index = this.activeStudents.findIndex(student => !!student.quotePlan.error || !this.visaOptions.some(option => option.value === student.visaType));
    return index < 0 ? '' : `${this.quoteMode === 'group' ? `学生${index + 1}：` : ''}${this.activeStudents[index].quotePlan.error || '请选择有效的签证类型。'}`;
  }
  private isLongTermVisa(student: CpilsStudentQuote) { return !['tourist30', 'tourist59'].includes(student.visaType); }
  private visaLabel(student: CpilsStudentQuote) { return this.visaOptions.find(option => option.value === student.visaType)?.label ?? ''; }
  private visaExtensionCountFor(student: CpilsStudentQuote) { return this.isLongTermVisa(student) ? 0 : Math.max(0, Math.ceil((student.quotePlan.stayWeeks * 7 - (student.visaType === 'tourist30' ? 30 : 59)) / 30)); }
  private visaExtensionTotalFor(student: CpilsStudentQuote) {
    const rule = this.localFeeRule('visa-extension'), count = this.visaExtensionCountFor(student);
    return rule ? Array.from({ length: count }, (_, index) => rule.rates?.[index] ?? rule.rates?.at(-1) ?? rule.amount).reduce((sum, value) => sum + value, 0) : 0;
  }
  get visaExtensionCount(): number { return this.activeStudents.reduce((sum, student) => sum + this.visaExtensionCountFor(student), 0); }
  get visaExtensionTotal(): number { return this.activeStudents.reduce((sum, student) => sum + this.visaExtensionTotalFor(student), 0); }
  private studentLocalFees(student: CpilsStudentQuote): SchoolLocalFee[] {
    const fourWeekPeriods = Math.max(1, Math.ceil(student.quotePlan.roomWeeks / 4));
    const extensions = this.visaExtensionCountFor(student);
    const longTerm = this.isLongTermVisa(student);
    const acrQuantity = longTerm ? 0 : extensions > 0 ? 1 : 0;
    const arpQuantity = longTerm || extensions > 0 ? 1 : 0;
    const visaNote = `${this.visaLabel(student)}相关费用暂按0估算，是否免收请由顾问向学校确认，以学校最新政策为准。`;
    const books = Math.max(1, Math.ceil(student.quotePlan.courseWeeks / 4));
    const create = (id: string, quantity: number, note?: string, total?: number): SchoolLocalFee[] => {
      const rule = this.localFeeRule(id);
      if (!rule) return [];
      const period = rule.periodWeeks ?? 4;
      const unitLabel = ['management', 'water', 'electricity', 'books'].includes(id)
        ? `${this.formatPhp(rule.amount)}／${period}周` : id === 'visa-extension' ? '按学习周数阶梯计算' : `${this.formatPhp(rule.amount)}／次`;
      return [{ item: rule.name, unitLabel, quantity, total: total ?? rule.amount * quantity, note: note ?? rule.note }];
    };
    const visaRule = this.localFeeRule('visa-extension');
    const visaTotal = visaRule ? Array.from({ length: extensions }, (_, index) => visaRule.rates?.[index] ?? visaRule.rates?.at(-1) ?? visaRule.amount).reduce((sum, amount) => sum + amount, 0) : 0;
    return [
      ...create('ssp', longTerm ? 0 : 1, longTerm ? visaNote : undefined),
      ...create('ssp-i-card', longTerm ? 0 : 1, longTerm ? visaNote : undefined),
      ...create('acr-i-card', acrQuantity, longTerm ? visaNote : `按${this.visaLabel(student)}预估；${this.localFeeRule('acr-i-card')?.note ?? ''}`),
      ...create('arp', arpQuantity, longTerm ? `长期签证仍计收一次；${this.localFeeRule('arp')?.note ?? ''}` : undefined),
      ...create('management', fourWeekPeriods),
      ...create('water', fourWeekPeriods),
      ...create('electricity', fourWeekPeriods),
      ...create('visa-extension', extensions, longTerm ? visaNote : extensions ? `按${this.visaLabel(student)}预估，本次${extensions}次；${visaRule?.note ?? ''}` : `按${this.visaLabel(student)}预估，本次无需续签。`, visaTotal),
      ...create('books', books),
      ...create('student-id', 1),
    ];
  }
  get localFees(): LocalFee[] { return this.includedLocalFees; }
  get includedLocalFees(): LocalFee[] { return groupLocalFees(this.activeStudents.map(student => ({ localFees: this.studentLocalFees(student) }))).map(fee => ({ item: fee.item, amount: fee.unitLabel, quantity: fee.quantity, total: fee.total, note: fee.note })); }
  get excludedLocalFees(): LocalFee[] {
    const pickupCount = this.activeStudents.filter(student => student.pickupSelected).length, count = this.activeStudents.length;
    return this.localFeeRules.filter(rule => rule.enabled && !rule.includeInTotal).map(rule => {
      const quantity = rule.id === 'pickup' ? pickupCount : rule.id === 'deposit' ? count : 0;
      const total = rule.amount * quantity;
      return { item: rule.name, amount: quantity ? this.formatPhp(total) : `${this.formatPhp(rule.amount)}${rule.id === 'pickup' || rule.id === 'deposit' ? '／人' : ''}`, quantity, total, note: `${rule.note}不计入学杂费合计。`, excluded: true };
    });
  }
  get localFeesTotal(): number { return this.includedLocalFees.reduce((sum, fee) => sum + fee.total, 0); }
  get localFeesCnyText(): string { return `约 ${Math.round(this.localFeesTotal / this.phpPerCny).toLocaleString('zh-CN')} 元`; }

  private studentPaymentLines(student: CpilsStudentQuote): SchoolPaymentLine[] {
    const sidaRule = this.promotionRule('cpils-sida');
    const offSeasonRule = [...student.quotePlan.courses, ...student.quotePlan.rooms].map(row => this.offSeasonRule(row)).find((rule): rule is CiaPromotionRule => !!rule);
    const noWindowRule = this.promotionRule('cpils-no-window');
    const holidayRule = this.studentHolidayDiscount(student) === (this.promotionRule('cpils-holiday-new-year')?.discountValue ?? -1)
      ? this.promotionRule('cpils-holiday-new-year') : this.promotionRule('cpils-holiday-christmas');
    const offSeason = this.studentOffSeasonDiscount(student);
    const noWindow = this.studentNoWindowDiscount(student), holiday = this.studentHolidayDiscount(student), peak = this.studentPeakWeeks(student) * this.seasonalFeePerWeek;
    return [
      ...(sidaRule ? [{ icon: '折', label: sidaRule.name, value: -this.studentSidaDiscount(student), note: sidaRule.description, promotionKey: sidaRule.id }] : []),
      ...(offSeason && offSeasonRule ? [{ icon: '淡', label: offSeasonRule.name, value: -offSeason, note: offSeasonRule.description, promotionKey: offSeasonRule.id }] : []),
      ...(noWindow && noWindowRule ? [{ icon: '房', label: noWindowRule.name, value: -noWindow, note: noWindowRule.description, promotionKey: noWindowRule.id }] : []),
      ...(holiday && holidayRule ? [{ icon: '节', label: holidayRule.name, value: -holiday, note: holidayRule.description, promotionKey: holidayRule.id }] : []),
      ...(peak ? [{ icon: '旺', label: '暑假附加费', value: peak, note: `按已发布旺季日期计算：重叠${this.studentPeakWeeks(student)}周 × ${this.formatUsd(this.seasonalFeePerWeek)}美元／周`, promotionKey: 'cpils-summer' }] : []),
    ];
  }
  get schoolPaymentItems() {
    const paid = this.activeStudents.filter(student => this.studentRegistration(student) > 0).length;
    return [
      { label: '注册费', amount: `${this.formatUsd(this.payableRegistrationFee)} 美元`, note: `一次性费用，老学员返校免费；本次计收${paid}人${paid < this.activeStudents.length ? `，${this.activeStudents.length - paid}人免收` : ''}` },
      { label: '课程费合计', amount: `${this.formatUsd(this.tuitionForSelectedWeeks)} 美元`, note: '按每位学生实际选择的课程和日期计算' },
      { label: '住宿费合计', amount: `${this.formatUsd(this.roomFeeForSelectedWeeks)} 美元`, note: '按每位学生实际选择的房型和日期计算' },
      ...groupPaymentLines(this.activeStudents.map(student => ({ paymentLines: this.studentPaymentLines(student) })), true),
    ];
  }

  get quoteImageData() {
    const settings = this.quoteImageSettings;
    const paymentItems: QuoteImagePaymentItem[] = [
      { icon: '注', label: '注册费', amount: `${this.formatUsd(this.payableRegistrationFee)} 美元`, note: settings.paymentNotes.registration || this.schoolPaymentItems[0].note },
      ...(['课', '宿'] as const).flatMap(icon => this.activeStudents.flatMap((student, index) => student.quotePlan.paymentItems().filter(item => item.icon === icon).map(item => ({
        ...item,
        label: `${this.quoteMode === 'group' ? `学生${index + 1} · ` : ''}${item.label.replace(/^课程费/, '课程').replace(/^住宿费/, '住宿')}`,
        note: [item.note, icon === '课' ? settings.paymentNotes.course : settings.paymentNotes.accommodation].filter(Boolean).join('；'),
      })))),
      ...groupPaymentLines(this.activeStudents.map(student => ({ paymentLines: this.studentPaymentLines(student) })), true),
      ...(this.applicableExamBenefits.length ? [{ icon: '赠', label: '官方考试赠送', amount: '按课程适用', note: this.applicableExamBenefitText }] : []),
    ];
    const quote = buildPhilippinesDetailedQuote({
      fullFeeDetails: true,
      localFeeTableLayout: 'web',
      schoolCode: 'CPILS',
      schoolName: '菲律宾宿务CPILS语言学校',
      filePrefix: 'CPILS',
      heroSrc: '/assets/cpils/campus-main.jpg',
      weeks: this.selectedWeeks,
      startDate: this.selectedStartDate,
      usdToCny: this.usdToCny,
      totalUsd: this.quoteUsd,
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
    const ageNotes = this.activeStudents.map((student, index) => student.selectedAgeGroup === 'minor' ? `${this.quoteMode === 'group' ? `学生${index + 1}：` : ''}未成年学生按所选课程收费，入学及监护要求须顾问确认。` : '').filter(Boolean);
    const importantNotes = [...mismatchNotes, ...ageNotes, ...settings.footerNotes];
    const result = applySchoolQuoteImageLayout({ ...quote, importantNotes }, 'CPILS', this.totalCourseWeeks, this.selectedStartDate, this.quoteUsd, this.usdToCny);
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

  formatUsd(value: number): string { return value.toLocaleString('en-US', { minimumFractionDigits: Number.isInteger(value) ? 0 : 1, maximumFractionDigits: 2 }); }
  formatPhp(value: number): string { return `${value.toLocaleString('en-US')} 比索`; }
  private slugifyPriceKey(value: string): string { return value.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
  private courseDisplayName(value: string): string {
    const displayNames: Record<string, string> = {
      'Premier Sparta': '斯巴达ESL',
      'TOEIC Course': '托业课程',
      'TOEIC Guarantee': '托业保证班',
      'Pre-IELTS Course': '雅思预备课程',
      'IELTS Course': '雅思课程',
      'IELTS Guarantee 8 Weeks': '雅思保证班（8周）',
      'IELTS Guarantee 12 Weeks': '雅思保证班（12周）',
      'Power Speaking and Modern Communication': 'PMC演讲课程',
    };
    return displayNames[value] ?? value;
  }
  private orderIndex(order: string[], value: string): number { const index = order.indexOf(value); return index === -1 ? Number.MAX_SAFE_INTEGER : index; }
  private createRoomId(name: string): string {
    const roomType = name.includes('高级') ? 'premium' : name.includes('无对外窗') ? 'no-window' : 'regular';
    if (name.includes('四人')) return `${roomType}-quad`;
    if (name.includes('三人')) return `${roomType}-triple`;
    if (name.includes('双人')) return `${roomType}-twin`;
    if (name.includes('单人')) return `${roomType}-single`;
    return this.slugifyPriceKey(name);
  }
  private roundMoney(value: number): number { return Math.round(value * 10) / 10; }
  private isDateBetween(value: string, start: string, end: string): boolean { return value >= start && value <= end; }
  private parseDate(value: string): Date | null {
    const parsed = new Date(`${value}T00:00:00Z`);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
}

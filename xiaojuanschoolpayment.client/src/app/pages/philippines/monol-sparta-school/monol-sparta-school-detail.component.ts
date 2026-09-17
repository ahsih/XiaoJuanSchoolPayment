import { CommonModule } from '@angular/common';
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
import { QuoteImageDownloadButtonComponent, QuoteImageOptionalFeeItem, QuoteImagePaymentItem } from '../../../components/quote-image-download-button.component';
import { applyEditableQuoteImageCopy, applySchoolQuoteImageLayout } from '../../../components/school-quote-plan';
import { SchoolQuotePlanComponent } from '../../../components/school-quote-plan.component';
import { ExpandableImageComponent } from '../../../components/expandable-image.component';
import { SidaWhySectionComponent } from '../../../components/sida-why-section.component';
import { groupLocalFees, groupPaymentLines } from '../../../components/school-group-quote';
import { MonolSpartaStudentQuote } from './monol-sparta-student-quote';
import { CiaContentConfig, CiaLocalFeeRule, CiaPromotionRule, CiaQuoteImageSettings } from '../cia-school/cia-content-config';
import { CiaPreviewTarget, isCiaPreviewTarget, resolveCiaPreviewTarget, revealCiaPreviewElement, scrollCiaPreviewElement } from '../cia-school/cia-content-preview';
import { cloneMonolSpartaContentConfig, createDefaultMonolSpartaContentConfig } from './monol-sparta-content-config';

type GalleryCategory = '全部' | '校区' | '教室' | '高级单人间' | '标准单人间' | '单人雅房' | '双人间' | '三人间' | '餐厅与餐食' | '屋顶与运动场' | '纪律管理';

interface QuickInfo { icon: string; label: string; value: string; note: string; }
interface GalleryImage { category: Exclude<GalleryCategory, '全部'>; title: string; description: string; src: string; contentType?: string; poster?: string; }
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

const galleryImageSeries = (
  category: Exclude<GalleryCategory, '全部'>,
  filePrefix: string,
  count: number,
  title: string,
  description: string,
): GalleryImage[] => Array.from({ length: count }, (_, index) => ({
  category,
  title: `${title} ${index + 1}`,
  description,
  src: `assets/philippines/monol-sparta/gallery/${filePrefix}-${String(index + 1).padStart(2, '0')}.webp`,
}));

@Component({
  selector: 'app-monol-sparta-school-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule, SchoolQuotePlanComponent, QuoteImageDownloadButtonComponent, ExpandableImageComponent, SidaWhySectionComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './monol-sparta-school-detail.component.html',
  styleUrls: [
    '../cebu-school-detail-layout.css',
    '../cebu-school-detail-content.css',
    '../cebu-school-detail-responsive.css',
    '../ev-school/ev-school-detail.component.css',
    '../school-quote-rollout.css',
    '../../../components/school-group-quote.css',
    '../philippines-local-fee-table.css',
    '../monol-school/monol-school-detail.component.css',
    './monol-sparta-school-detail.component.css',
  ],
})
export class MonolSpartaSchoolDetailComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly schoolService = inject(SchoolService);
  private readonly schoolContentService = inject(SchoolContentService);
  private readonly exchangeRateService = inject(ExchangeRateService);
  private readonly route = inject(ActivatedRoute);
  private readonly previewHost = inject(ElementRef<HTMLElement>);
  private readonly pricingSchoolSearchName = 'MONOL斯巴达';
  private readonly pricingSchoolNames = ['菲律宾碧瑶MONOL斯巴达校区', 'MONOL Sparta Campus', 'MONOL Sparta'];
  private readonly initialContent = createDefaultMonolSpartaContentConfig();
  readonly isEditorPreview = typeof window !== 'undefined' && window.parent !== window
    && this.route.snapshot.queryParamMap.get('contentPreview') === '1';
  private previewTarget?: CiaPreviewTarget;
  private previewHighlightTarget?: CiaPreviewTarget;
  private previewFocusTimer?: ReturnType<typeof setTimeout>;
  private previewContent?: CiaContentConfig;
  private readonly courseFeeOrder = ['booster-esl', 'master-ielts'];
  private readonly roomFeeOrder = ['premium-single-room', 'standard-single-room', 'semi-single-room', 'double-room', 'triple-room'];

  readonly galleryCategories: GalleryCategory[] = ['全部', '校区', '教室', '高级单人间', '标准单人间', '单人雅房', '双人间', '三人间', '餐厅与餐食', '屋顶与运动场', '纪律管理'];
  selectedGalleryCategory: GalleryCategory = '全部';
  selectedGalleryImageIndex = 0;
  registrationFee = this.initialContent.quoteSettings.registrationFee;
  shortStayRatios = { ...this.initialContent.quoteSettings.shortStayRatios };
  promotionRules: CiaPromotionRule[] = this.initialContent.quoteSettings.promotions.map(item => ({ ...item }));
  localFeeRules: CiaLocalFeeRule[] = this.initialContent.localFees.map(item => ({ ...item }));
  quoteImageSettings: CiaQuoteImageSettings = this.initialContent.quoteImageSettings;
  courseTableTitle = this.initialContent.quoteSettings.courseTableTitle;
  courseTableNote = this.initialContent.quoteSettings.courseTableNote;
  groupClassNote = this.initialContent.quoteSettings.groupClassNote;
  roomTableTitle = this.initialContent.quoteSettings.roomTableTitle;
  roomTableNote = this.initialContent.quoteSettings.roomTableNote;
  stayPolicyTitle = this.initialContent.quoteSettings.stayPolicyTitle;
  stayPolicies = this.initialContent.quoteSettings.stayPolicies.map(item => ({ ...item }));
  localFeeIntro = this.initialContent.quoteSettings.localFeeIntro;
  usdToCny = 7.2;
  readonly phpPerCny = 9;
  readonly quoteGeneralNotes = [
    '通过思达启航报名的学生全部免除学校原价100美元／人的注册费。',
    '学校付款时间与收款方式须以MONOL斯巴达校区正式账单为准；人民币结算按支付当日汇率换算。',
    '到校后学杂费由学校或相关部门直接收取，本报价仅作预算参考，具体以实际收取为准。',
    '课程与住宿日期按周日入住、周六离校计算；房型、名额及住宿安排需由学校最终确认。',
    'SNS活动要求每完整4周在指定SNS发布1条在校故事；活动会按报名人数随时结束，是否仍开放及能否叠加须由学校确认。',
    '学校资料没有列出水电费、教材费与Academic Admin Fee的金额或计费方式，页面标为待确认且不计入合计。',
    '本报价根据当前选择生成，最终以MONOL斯巴达校区正式账单及思达启航顾问确认为准。',
  ];
  exchangeRateDate = '';
  usingLiveExchangeRate = false;
  quoteCalculated = false;

  readonly quickInfo: QuickInfo[] = [
    { icon: 'terrain', label: '城市', value: '碧瑶 Baguio', note: '校区位于Naguilian Road，乘公共交通到市中心约3–5分钟。' },
    { icon: 'lock_clock', label: '管理模式', value: '全斯巴达', note: '未参加选修团体课时须在固定座位强制自习，并有现场巡查。' },
    { icon: 'school', label: '课程方向', value: 'Booster ESL / Master IELTS', note: '每天至少10节学习安排，结合一对一、团体课、自习和测试。' },
    { icon: 'bed', label: '住宿', value: '5种校内房型', note: '高级单人间、标准单人间、单人雅房、双人间和三人间。' },
    { icon: 'restaurant', label: '餐食', value: '住宿费含餐', note: '包含平日三餐，以及周末和节假日一餐。' },
    { icon: 'payments', label: '费用资料', value: '2026年9月最新资料', note: '课程、住宿、签证和活动分别来自校区费用表、签证表及活动海报。' },
  ];

  private readonly builtInGalleryImages: GalleryImage[] = [
    { category: '校区', title: '校园生活完整导览', description: 'MONOL斯巴达校区校园、设施与在校生活视频，播放器支持原声。', src: 'assets/philippines/monol-sparta/campus-life.mp4', contentType: 'video/mp4', poster: 'assets/philippines/monol-sparta/gallery/campus-01.webp' },
    ...galleryImageSeries('校区', 'campus', 1, '斯巴达校区建筑', 'MONOL斯巴达校区建筑外观实景。'),
    { category: '教室', title: '校内设施与教室导览', description: '校内教室及公共设施完整导览视频，播放器支持原声。', src: 'assets/philippines/monol-sparta/facilities-tour.mp4', contentType: 'video/mp4', poster: 'assets/philippines/monol-sparta/gallery/classroom-group-01.webp' },
    ...galleryImageSeries('教室', 'classroom-one-to-one', 10, '一对一教室', '一对一课程使用的独立教学空间。'),
    ...galleryImageSeries('教室', 'classroom-group', 7, '团体教室', '选修团体课与IELTS团体课使用的教室。'),
    { category: '高级单人间', title: '高级单人间视频', description: 'Premium Single Room完整房间导览，播放器支持原声。', src: 'assets/philippines/monol-sparta/premium-single-room-tour.mp4', contentType: 'video/mp4', poster: 'assets/philippines/monol-sparta/gallery/premium-single-01.webp' },
    ...galleryImageSeries('高级单人间', 'premium-single', 11, '高级单人间', 'Premium Single Room空间与设备实景。'),
    { category: '标准单人间', title: '标准单人间视频', description: 'Standard Single Room完整房间导览，播放器支持原声。', src: 'assets/philippines/monol-sparta/standard-single-room-tour.mp4', contentType: 'video/mp4', poster: 'assets/philippines/monol-sparta/gallery/standard-single-01.webp' },
    ...galleryImageSeries('标准单人间', 'standard-single', 15, '标准单人间', 'Standard Single Room空间与设备实景。'),
    { category: '单人雅房', title: '单人雅房视频', description: 'Semi Single Room完整房间导览，播放器支持原声。', src: 'assets/philippines/monol-sparta/semi-single-room-tour.mp4', contentType: 'video/mp4', poster: 'assets/philippines/monol-sparta/gallery/semi-single-01.webp' },
    ...galleryImageSeries('单人雅房', 'semi-single', 10, '单人雅房', 'Semi Single Room空间与设备实景。'),
    { category: '双人间', title: '双人间视频', description: 'Double Room完整房间导览，播放器支持原声。', src: 'assets/philippines/monol-sparta/double-room-tour.mp4', contentType: 'video/mp4', poster: 'assets/philippines/monol-sparta/gallery/double-room-01.webp' },
    ...galleryImageSeries('双人间', 'double-room', 12, '双人间', 'Double Room空间与设备实景。'),
    { category: '三人间', title: '三人间视频 1', description: 'Triple Room第一段完整房间导览，播放器支持原声。', src: 'assets/philippines/monol-sparta/triple-room-tour-01.mp4', contentType: 'video/mp4', poster: 'assets/philippines/monol-sparta/gallery/triple-room-01.webp' },
    { category: '三人间', title: '三人间视频 2', description: 'Triple Room第二段空间细节视频，播放器支持原声。', src: 'assets/philippines/monol-sparta/triple-room-tour-02.mp4', contentType: 'video/mp4', poster: 'assets/philippines/monol-sparta/gallery/triple-room-02.webp' },
    ...galleryImageSeries('三人间', 'triple-room', 9, '三人间', 'Triple Room空间与设备实景。'),
    { category: '餐厅与餐食', title: '校内餐厅视频', description: '餐厅与用餐空间视频，播放器支持原声。', src: 'assets/philippines/monol-sparta/cafeteria-tour.mp4', contentType: 'video/mp4', poster: 'assets/philippines/monol-sparta/gallery/cafeteria-01.webp' },
    ...galleryImageSeries('餐厅与餐食', 'cafeteria', 13, '校内餐厅', '位于6楼的餐厅与学生休息区实景。'),
    ...galleryImageSeries('餐厅与餐食', 'food', 80, '餐食参考', '校区实际餐食照片；每天菜单以学校当日安排为准。'),
    { category: '屋顶与运动场', title: '屋顶花园视频 1', description: '屋顶花园第一段导览，播放器支持原声。', src: 'assets/philippines/monol-sparta/rooftop-tour-01.mp4', contentType: 'video/mp4', poster: 'assets/philippines/monol-sparta/gallery/rooftop-01.webp' },
    { category: '屋顶与运动场', title: '屋顶花园视频 2', description: '屋顶花园第二段导览，播放器支持原声。', src: 'assets/philippines/monol-sparta/rooftop-tour-02.mp4', contentType: 'video/mp4', poster: 'assets/philippines/monol-sparta/gallery/rooftop-02.webp' },
    ...galleryImageSeries('屋顶与运动场', 'rooftop', 18, '屋顶花园', '校区屋顶花园与休息空间实景。'),
    ...galleryImageSeries('屋顶与运动场', 'sports-field', 4, '运动场', '一楼运动场与活动空间实景。'),
    { category: '纪律管理', title: '纪律检查视频', description: '校方纪律与自习检查片段，播放器支持原声。', src: 'assets/philippines/monol-sparta/discipline-check.mp4', contentType: 'video/mp4', poster: 'assets/philippines/monol-sparta/gallery/discipline-01.webp' },
    ...galleryImageSeries('纪律管理', 'discipline', 3, '纪律检查', '校方执行固定座位自习和纪律检查的现场记录。'),
  ];

  readonly heroGalleryPreviewImages = [
    { title: '一对一教室', src: 'assets/philippines/monol-sparta/one-to-one-classroom.webp' },
    { title: '团体教室', src: 'assets/philippines/monol-sparta/group-classroom.webp' },
    { title: '高级单人间', src: 'assets/philippines/monol-sparta/premium-single-room.webp' },
  ];

  readonly basicInfo: BasicInfoRow[] = [
    { label: '学校名称', value: '菲律宾碧瑶MONOL斯巴达校区' },
    { label: '英文名称', value: 'MONOL Sparta Campus' },
    { label: '地址', value: '187 Naguilian Road, Baguio City, Philippines' },
    { label: '管理模式', value: '全斯巴达：固定座位强制自习、现场巡查、EOP英语政策与每日测试' },
    { label: '课程方向', value: 'Booster ESL、Master IELTS' },
    { label: '房型方向', value: '高级单人间、标准单人间、单人雅房、双人间、三人间' },
    { label: '校内设施', value: '一对一教室、团体教室、ESL/IELTS自习室、运动场、健身房、屋顶花园、餐厅与学生休息区' },
    { label: '餐食', value: '住宿费包含平日三餐，以及周末和节假日一餐' },
  ];

  readonly highlights: Highlight[] = [
    { image: 'assets/philippines/monol-sparta/one-to-one-classroom.webp', title: '每天至少10节学习安排', text: 'Booster ESL与Master IELTS都把一对一、团体课、固定座位自习和晚间测试排进完整学习日。' },
    { image: 'assets/philippines/monol-sparta/discipline-check.webp', title: '强制自习与现场巡查', text: '没有参加选修团体课的时段须在指定座位自习，迟到、缺席、违反EOP或做非学习活动均会增加补自习时间。' },
    { image: 'assets/philippines/monol-sparta/group-classroom.webp', title: 'ESL与IELTS分线清楚', text: 'Booster ESL强化综合英语；Master IELTS安排五科一对一、IELTS团体课及周一至周五轮换模拟考试。' },
    { image: 'assets/philippines/monol-sparta/rooftop-garden.webp', title: '学习与生活集中在校内', text: '教室、自习室、宿舍、餐厅、运动场、健身房和屋顶花园集中在同一校区，减少通勤分心。' },
  ];

  readonly suitableFor: FitItem[] = [
    { title: '需要纪律推动学习', text: '适合希望由固定座位、现场巡查、补自习和每日测试帮助建立节奏的学生。' },
    { title: '能接受每天至少10节安排', text: '课程、自习与晚间测试密度高，适合短期集中强化或需要明确日程的人。' },
    { title: '目标为综合英语或雅思', text: '当前资料只确认Booster ESL与Master IELTS两条课程线。' },
    { title: '希望校内解决住宿与餐食', text: '五种房型与餐厅、运动设施集中在校内，住宿费已包含规定餐次。' },
  ];

  readonly notSuitableFor: FitItem[] = [
    { title: '需要自由安排大量私人时间', text: '周一至周四仅17:00–19:00可外出，选修课空档也必须强制自习。' },
    { title: '不接受补自习和纪律扣时', text: '迟到、缺席、违反EOP与非学习活动会产生25或50分钟补自习，严重违规可增加8小时或退学。' },
    { title: '希望选择更多课程类型', text: '资料只确认Booster ESL与Master IELTS，其他课程不会从主校区复制。' },
  ];

  readonly courses: CourseItem[] = [
    { name: 'Booster ESL', type: '密集综合英语', lessons: '6节一对一 + 2节选修团体课 + 1节晚间选修团体课 + 1节单词与句子测试', suitable: '一对一包括口语2、听力2、阅读1、讨论1；团体选修含写作与语法，晚间选修为商务英语或发音。每4周评估一次。' },
    { name: 'Master IELTS', type: '密集雅思备考', lessons: '5节一对一 + 3节团体课 + 1节晚间选修团体课 + 1节单词与句子测试', suitable: '一对一覆盖口语、听力、阅读、写作Task 1与Task 2；团体课含IELTS口语、语法和必修模拟考试。每2周评估一次。' },
  ];

  courseFees: CourseFee[] = [
    { id: 'booster-esl', name: 'Booster ESL', tuition: 950, suitable: '每天至少10节学习安排', note: '每4周评估一次' },
    { id: 'master-ielts', name: 'Master IELTS', tuition: 950, suitable: '每天至少10节学习安排', note: '每2周评估一次；含每日轮换模拟考试' },
  ];

  roomFees: RoomFee[] = [
    { id: 'premium-single-room', name: '高级单人间', fee: 1200, note: 'Premium Single Room' },
    { id: 'standard-single-room', name: '标准单人间', fee: 1050, note: 'Standard Single Room' },
    { id: 'semi-single-room', name: '单人雅房', fee: 900, note: 'Semi Single Room' },
    { id: 'double-room', name: '双人间', fee: 800, note: 'Double Room' },
    { id: 'triple-room', name: '三人间', fee: 700, note: 'Triple Room' },
  ];
  galleryImages: GalleryImage[] = this.builtInGalleryImages.map(item => ({ ...item }));

  readonly students: MonolSpartaStudentQuote[] = [new MonolSpartaStudentQuote(this)];
  quoteMode: 'single' | 'group' = 'single';
  private requestedStudentCount = 2;

  readonly schedule: ScheduleItem[] = [
    { time: '07:00–08:00', title: '早餐与准备', text: '早餐后准备当天课程。' },
    { time: '08:00–09:40', title: '第1–2节课', text: '按所选课程安排一对一或团体训练。' },
    { time: '09:50–11:30', title: '第3–4节课', text: '课程之间保留10分钟换课时间。' },
    { time: '11:40–12:25', title: '固定座位自习／休息', text: '按个人课表完成自习与复习。' },
    { time: '12:25–13:30', title: '午餐与休息', text: '住宿费包含平日午餐。' },
    { time: '13:30–17:00', title: '第5–8节课', text: '继续一对一课程；选修团体课未参加时须强制自习。' },
    { time: '17:00–19:00', title: '晚餐与平日外出时段', text: '周一至周四可在此时段外出并按门禁返校。' },
    { time: '19:00–19:45', title: '晚间选修／自习', text: '商务英语或发音选修；未参加则在固定座位自习。' },
    { time: '20:00–21:00', title: '单词与句子测试', text: 'Booster ESL为30个单词与10个句子；Master IELTS为20个IELTS单词与10个句子。' },
    { time: '21:00以后', title: '自习与休息', text: '按个人学习任务继续复习或休息。' },
  ];

  readonly serviceSteps: ProcessStep[] = [
    { icon: 'person_search', title: '确认学习强度', text: '先判断能否接受强制自习、EOP、每日测试、门禁与纪律管理。' },
    { icon: 'fact_check', title: '确认课程和房型', text: '从两类课程与五种房型中选择，并核实空房、活动和正式账单。' },
    { icon: 'assignment_turned_in', title: '办理报名与签证', text: '协助准备报名文件、付款和菲律宾入境签证资料。' },
    { icon: 'inventory', title: '发送行前清单', text: '出发前核对接机、比索费用、押金、行李和校规。' },
    { icon: 'support_agent', title: '在校持续跟进', text: '学习、宿舍、费用或校方沟通问题可继续联系顾问。' },
    { icon: 'location_on', title: '国内与菲律宾协作', text: '国内顾问与菲律宾当地工作人员协同处理重要节点。' },
  ];

  readonly schoolServices = ['机场接机', '新生说明', '课程与级别评估', '固定座位自习管理', 'EOP管理', '学习评估', '签证办理协助', '餐饮', '运动场与健身房', '屋顶花园'];
  readonly campusActivities = ['Booster ESL每4周评估', 'Master IELTS每2周评估', 'IELTS每日科目模拟考试', '晚间单词与句子测试', '周末补自习'];
  readonly weekendActivities = ['第1、3周San Juan冲浪', '第2、4周Vigan、Hundred Islands等一日游', '周末活动交通费约350–1,200比索', '实际行程以学校当期安排为准'];
  readonly notes = [
    '课程与住宿资料只列完整4周价格；1–3周可由顾问向学校单独询价，页面不自动套用未公布的短期比例。',
    '平日选修团体课未参加时必须在固定座位自习；迟到、缺席、违反EOP或做非学习活动会增加补自习时间。',
    '离校前仍未完成的补自习按每25分钟25比索从押金扣除，未结清前不发结业证书。',
    '住宿费包含平日三餐，以及周末和节假日一餐。',
    '马尼拉与克拉克常规团体接机均为3,000比索；特别个人接机为整车价，须确认分摊与班次。',
    '2026课程及住宿活动的报名截止日为2026年12月31日；SNS活动每完整4周须在指定平台发布1条在校故事，活动可能随报名人数提前结束，叠加资格须由学校确认。',
    '本次费用表与手册未列水电费、教材费和Academic Admin Fee金额，页面仅作待确认提示，不计入学杂费合计。',
    '最终报名以MONOL斯巴达校区正式录取、空房、账单、校规和移民局实收为准。',
  ];
  readonly faqs: FaqItem[] = [
    { question: 'MONOL斯巴达校区与MONOL主校区相同吗？', answer: '不同。本页只介绍187 Naguilian Road的斯巴达校区，课程、房型、费用、优惠、签证计算和媒体均独立，不使用主校区资料。' },
    { question: '每天必须上满10节课吗？', answer: '学校保证每天至少10节学习安排。选修团体课可不参加，但对应时段必须在固定座位强制自习。' },
    { question: '课程和住宿费包含餐食吗？', answer: '住宿费包含平日三餐，以及周末和节假日一餐。课程费与住宿费分别计算。' },
    { question: '可以只报1–3周吗？', answer: '可以联系思达顾问向学校单独询问可报名日期、课程、房型和短期价格。因资料没有公布1–3周比例，页面不自动估算，以学校书面回复为准。' },
    { question: '2026课程与住宿优惠如何计算？', answer: '在2026年12月31日或之前报名，并在斯巴达校区同时学习与住宿时，每完整4周课程费减100美元、住宿费减100美元。' },
    { question: 'SNS活动的具体要求是什么？', answer: '须在2026年12月31日或之前报名并在MONOL斯巴达校区学习、住宿；每完整4周在小红书、TikTok、Facebook、Messenger、Instagram、Google Map、Threads等SNS发布1条在校故事，可减100美元，所有房型适用。活动会按报名人数随时结束且不另行通知；是否仍开放及能否与课程、住宿优惠叠加须学校确认。' },
    { question: '签证延签为什么按护照地区不同？', answer: '中国护照可选择办理30天或59天旅游签证；香港特区护照按14天、澳门特区护照按7天入境停留参考。页面按选择与住宿周数套用学校签证表，最终以实际获签和移民局收费为准。' },
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
    this.ensureCiaExtendedStylesheet();
    const preview = this.readSessionPreview();
    this.applyContentConfig(preview ?? this.initialContent);
    this.loadPricingFromDatabase();
    this.loadExchangeRate();
  }

  ngAfterViewInit(): void {
    if (!this.isEditorPreview) return;
    this.previewHost.nativeElement.classList.add('monol-editor-preview');
    window.parent.postMessage({ type: 'monol-sparta-content-ready' }, window.location.origin);
  }

  ngOnDestroy(): void { clearTimeout(this.previewFocusTimer); }

  private ensureCiaExtendedStylesheet(): void {
    if (typeof document === 'undefined' || document.getElementById('cia-page-extended-styles')) return;
    const stylesheet = document.createElement('link');
    stylesheet.id = 'cia-page-extended-styles';
    stylesheet.rel = 'stylesheet';
    stylesheet.href = 'assets/cia/cia-page-extended.css';
    document.head.appendChild(stylesheet);
  }

  @HostListener('window:message', ['$event'])
  applyEditorPreview(event: MessageEvent): void {
    if (!this.isEditorPreview || event.origin !== window.location.origin || event.source !== window.parent) return;
    const message = event.data as { type?: string; content?: CiaContentConfig; target?: CiaPreviewTarget; scroll?: boolean };
    if (message?.type !== 'monol-sparta-content-preview' || !message.content) return;
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
    window.parent.postMessage({ type: 'monol-sparta-content-select', ...target }, window.location.origin);
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
      window.parent.postMessage({ type: 'monol-sparta-content-located', target, status }, window.location.origin);
    }, 80);
  }

  private loadExchangeRate(): void {
    this.exchangeRateService.getLatestCnyRates().pipe(catchError(() => EMPTY)).subscribe((rates) => {
      if (rates.usdToCny <= 0) return;
      this.usdToCny = rates.usdToCny;
      this.exchangeRateDate = rates.date;
      this.usingLiveExchangeRate = true;
    });
  }

  private readSessionPreview(): CiaContentConfig | null {
    if (typeof sessionStorage === 'undefined' || !this.isEditorPreview) return null;
    try {
      const raw = sessionStorage.getItem('monol-sparta-content-preview');
      if (!raw) return null;
      const value = JSON.parse(raw) as CiaContentConfig;
      return value?.schemaVersion === 1 && value.schoolCode === 'MONOL-SPARTA' ? value : null;
    } catch {
      return null;
    }
  }

  private applyContentConfig(value: CiaContentConfig): void {
    if (value?.schemaVersion !== 1 || value.schoolCode !== 'MONOL-SPARTA') return;
    const content = cloneMonolSpartaContentConfig(value);
    this.previewContent = content;
    const courses = content.courses.filter(item => item.enabled).sort((a, b) => a.sortOrder - b.sortOrder);
    const rooms = content.rooms.filter(item => item.enabled).sort((a, b) => a.sortOrder - b.sortOrder);
    if (courses.length) {
      this.courseFees = courses.map(item => ({
        id: item.id,
        name: item.name,
        tuition: item.tuition,
        suitable: item.schedule,
        note: [item.suitable, item.note].filter(Boolean).join('；'),
      }));
    }
    if (rooms.length) {
      this.roomFees = rooms.map(item => ({ id: item.id, name: item.name, fee: item.fee, note: item.note }));
    }
    const settings = content.quoteSettings;
    this.registrationFee = settings.registrationFee;
    this.shortStayRatios = { ...settings.shortStayRatios };
    this.promotionRules = settings.promotions.map(item => ({ ...item, eligibleRoomIds: item.eligibleRoomIds ? [...item.eligibleRoomIds] : undefined }));
    this.localFeeRules = content.localFees.map(item => ({ ...item }));
    this.courseTableTitle = settings.courseTableTitle;
    this.courseTableNote = settings.courseTableNote;
    this.groupClassNote = settings.groupClassNote;
    this.roomTableTitle = settings.roomTableTitle;
    this.roomTableNote = settings.roomTableNote;
    this.stayPolicyTitle = settings.stayPolicyTitle;
    this.stayPolicies = settings.stayPolicies.map(item => ({ ...item }));
    this.localFeeIntro = settings.localFeeIntro;
    this.quoteImageSettings = content.quoteImageSettings;
    this.galleryImages = [
      ...this.builtInGalleryImages.map(item => ({ ...item })),
      ...(content.media ?? [])
        .filter(item => item.isActive && !!item.url)
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .map(item => ({
          category: this.resolveMediaCategory(item.category),
          title: item.caption || item.altText || item.originalFileName || 'MONOL斯巴达校区媒体',
          description: item.altText || item.caption || 'MONOL斯巴达校区实景内容',
          src: item.url,
          contentType: item.contentType,
        })),
    ];
    for (const student of this.students) {
      for (const row of student.quotePlan.courses) {
        if (!this.courseFees.some(item => item.id === row.optionId)) row.optionId = this.courseFees[0]?.id ?? row.optionId;
      }
      for (const row of student.quotePlan.rooms) {
        if (!this.roomFees.some(item => item.id === row.optionId)) row.optionId = this.roomFees[0]?.id ?? row.optionId;
      }
    }
    this.queuePreviewFocus(false);
  }

  private loadPricingFromDatabase(): void {
    this.schoolService.getSchools({ name: this.pricingSchoolSearchName }).pipe(
      switchMap((schools) => {
        const school = this.pricingSchoolNames
          .map((name) => schools.find((item) => item.name.toLowerCase() === name.toLowerCase()))
          .find(Boolean);
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
      this.applyPricingData(lessons, rooms, fees);
      const preview = this.readSessionPreview();
      if (preview) this.applyContentConfig(preview);
      else if (published?.content) this.applyContentConfig(published.content);
      else this.applyGalleryPhotos(photos);
    });
  }

  private applyGalleryPhotos(photos: SchoolPhotoDTO[]): void {
    const existingSources = new Set(this.galleryImages.map(item => item.src));
    const uploaded = (photos ?? [])
      .filter(photo => !!photo.url && !existingSources.has(photo.url))
      .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
      .map(photo => ({
        category: this.resolveMediaCategory(photo.category),
        title: photo.caption || photo.altText || photo.originalFileName || 'MONOL斯巴达校区媒体',
        description: photo.altText || photo.caption || 'MONOL斯巴达校区实景内容',
        src: photo.url ?? '',
        contentType: photo.contentType,
      }));
    if (uploaded.length) this.galleryImages = [...this.galleryImages, ...uploaded];
  }

  private resolveMediaCategory(category?: string): Exclude<GalleryCategory, '全部'> {
    const value = (category ?? '').toLowerCase();
    if (value.includes('video') || value.includes('视频')) return '校区';
    if (value.includes('class') || value.includes('教室')) return '教室';
    if (value.includes('premium')) return '高级单人间';
    if (value.includes('standard')) return '标准单人间';
    if (value.includes('semi')) return '单人雅房';
    if (value.includes('double') || value.includes('twin') || value.includes('双人')) return '双人间';
    if (value.includes('triple') || value.includes('三人')) return '三人间';
    if (value.includes('food') || value.includes('dining') || value.includes('餐')) return '餐厅与餐食';
    if (value.includes('roof') || value.includes('sport') || value.includes('屋顶') || value.includes('运动')) return '屋顶与运动场';
    if (value.includes('discipline') || value.includes('penalty') || value.includes('纪律')) return '纪律管理';
    if (value.includes('campus') || value.includes('校园') || value.includes('校区')) return '校区';
    return '校区';
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
        this.selectedCourseId = this.courseFees.find((course) => course.id === 'booster-esl')?.id ?? this.courseFees[0].id;
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
        this.selectedRoomId = this.roomFees.find((room) => room.id === 'triple-room')?.id ?? this.roomFees[0].id;
      }
    }

    const registrationFee = fees.find((fee) => fee.name === '注册费');
    if (registrationFee) this.registrationFee = registrationFee.fee;
  }

  setGalleryCategory(category: GalleryCategory): void {
    this.selectedGalleryCategory = category;
    this.selectedGalleryImageIndex = 0;
  }
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
      : this.galleryImagesForCategory(this.selectedGalleryCategory);
  }

  get galleryAlbumCategories(): Exclude<GalleryCategory, '全部'>[] {
    return this.galleryCategories
      .filter((category): category is Exclude<GalleryCategory, '全部'> => category !== '全部')
      .filter((category) => this.galleryImagesForCategory(category).length > 0);
  }

  galleryImagesForCategory(category: Exclude<GalleryCategory, '全部'>): GalleryImage[] {
    return this.galleryImages.filter((image) => image.category === category);
  }

  galleryAlbumDescription(category: Exclude<GalleryCategory, '全部'>): string {
    const descriptions: Record<Exclude<GalleryCategory, '全部'>, string> = {
      校区: '校园建筑、设施与在校生活导览',
      教室: '一对一教室、团体教室与设施视频',
      高级单人间: 'Premium Single Room多角度照片与视频',
      标准单人间: 'Standard Single Room多角度照片与视频',
      单人雅房: 'Semi Single Room多角度照片与视频',
      双人间: 'Double Room多角度照片与视频',
      三人间: 'Triple Room多角度照片与两段视频',
      餐厅与餐食: '餐厅空间、餐厅视频与校区餐食记录',
      屋顶与运动场: '屋顶花园、运动场照片与视频',
      纪律管理: '固定座位自习与纪律检查记录',
    };
    return descriptions[category];
  }

  get displayedGalleryImages(): GalleryImage[] {
    return this.selectedGalleryCategory === '全部' ? [] : this.galleryImagesForCategory(this.selectedGalleryCategory);
  }

  get selectedGalleryImage(): GalleryImage {
    return this.displayedGalleryImages[this.selectedGalleryImageIndex]
      ?? this.displayedGalleryImages[0]
      ?? this.galleryImages[0];
  }

  get displayedGalleryPhotos(): GalleryImage[] {
    return this.displayedGalleryImages.filter((image) => !image.contentType?.startsWith('video/'));
  }

  get displayedGalleryImageSources(): string[] { return this.displayedGalleryPhotos.map((image) => image.src); }
  get displayedGalleryImageTitles(): string[] { return this.displayedGalleryPhotos.map((image) => image.title); }
  get displayedGalleryImageCaptions(): string[] { return this.displayedGalleryPhotos.map((image) => image.description); }
  get displayedGalleryImageAlts(): string[] { return this.displayedGalleryPhotos.map((image) => `${image.category}实景：${image.title}`); }

  selectGalleryImage(index: number): void {
    this.selectedGalleryImageIndex = Math.min(Math.max(index, 0), Math.max(this.displayedGalleryImages.length - 1, 0));
  }

  previousGalleryImage(): void {
    const length = this.displayedGalleryImages.length;
    if (length) this.selectedGalleryImageIndex = (this.selectedGalleryImageIndex - 1 + length) % length;
  }

  nextGalleryImage(): void {
    const length = this.displayedGalleryImages.length;
    if (length) this.selectedGalleryImageIndex = (this.selectedGalleryImageIndex + 1) % length;
  }
  get studentCount() { return this.requestedStudentCount; }
  set studentCount(value: number) {
    this.requestedStudentCount = value;
    if (Number.isInteger(value) && value >= 2 && value <= 20) {
      while (this.students.length < value) this.students.push(new MonolSpartaStudentQuote(this));
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
  get coursePromotionDiscountAmount() { return this.activeStudents.reduce((sum, student) => sum + student.coursePromotionDiscount, 0); }
  get roomPromotionDiscountAmount() { return this.activeStudents.reduce((sum, student) => sum + student.roomPromotionDiscount, 0); }
  get snsEligibleBlocks() { return this.students[0].snsEligibleBlocks; }
  get isSnsPromotionEligible() { return this.snsEligibleBlocks > 0; }
  get snsDiscountAmount() { return this.activeStudents.reduce((sum, student) => sum + student.snsDiscount, 0); }
  get totalDiscountAmount() { return this.coursePromotionDiscountAmount + this.roomPromotionDiscountAmount + this.snsDiscountAmount; }
  get quoteBeforeDiscounts() { return this.activeStudents.reduce((sum, student) => sum + student.registration + student.tuition + student.accommodation, 0); }
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

  get visaExtensionFee() { return this.students[0].visaExtensionFee; }
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
      note: [item.note, item.icon === '课' ? this.quoteImageSettings.paymentNotes.course : this.quoteImageSettings.paymentNotes.accommodation]
        .filter(Boolean).join('；'),
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
    const waivedRegistration = this.registrationFee * this.activeStudents.length;
    return [
      { icon: '惠', label: '注册费（思达启航减免）', amount: '0 美元', note: `${this.quoteImageSettings.paymentNotes.registration}；本次共${this.activeStudents.length}人，合计减免${this.formatUsd(waivedRegistration)}美元。` },
      ...this.studentPlanPaymentItems(),
      ...this.groupedPromotionItems(),
      ...this.groupedStatusItems(true),
    ];
  }

  get optionalFeeItems(): QuoteImageOptionalFeeItem[] {
    const depositRule = this.localFeeRules.find(item => item.id === 'security-deposit' && item.enabled);
    const tvvRule = this.localFeeRules.find(item => item.id === 'tvv-acr' && item.enabled);
    const referenceRules = this.localFeeRules
      .filter(item => ['water-electricity', 'textbook-materials', 'academic-admin-fee', 'unfinished-penalty-study', 'weekend-trip-transport'].includes(item.id) && item.enabled)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((rule): QuoteImageOptionalFeeItem => {
        if (rule.id === 'unfinished-penalty-study') {
          return { label: rule.name, amount: `${this.formatPhp(rule.amount)}／25分钟`, cnyAmount: '仅在实际发生时从押金扣除', note: this.quoteImageSettings.localFeeNotes[rule.id] || rule.note };
        }
        if (rule.id === 'weekend-trip-transport') {
          const high = rule.secondaryAmount ?? rule.amount;
          return { label: rule.name, amount: `${rule.amount.toLocaleString('zh-CN')}–${high.toLocaleString('zh-CN')} 比索／次`, cnyAmount: `约 ${Math.round(rule.amount / this.phpPerCny)}–${Math.round(high / this.phpPerCny)} 元／次`, note: this.quoteImageSettings.localFeeNotes[rule.id] || rule.note };
        }
        return { label: rule.name, amount: '待学校确认', cnyAmount: '确认金额后再换算', note: this.quoteImageSettings.localFeeNotes[rule.id] || rule.note };
      });
    const deposit = this.activeStudents.reduce((sum, student) => sum + student.securityDeposit, 0);
    const specialPickups = this.activeStudents.flatMap((student, index) => student.selectedSpecialPickup ? [{
      label: `${this.quoteMode === 'group' ? `学生${index + 1} · ` : ''}${student.selectedSpecialPickup.name}`,
      amount: this.formatPhp(student.selectedSpecialPickup.amount),
      cnyAmount: `约 ${Math.round(student.selectedSpecialPickup.amount / this.phpPerCny).toLocaleString('zh-CN')} 元／车`,
      note: this.quoteImageSettings.localFeeNotes[student.selectedSpecialPickup.id] || student.selectedSpecialPickup.note,
    }] : []);
    return [
      ...(depositRule ? [{ label: depositRule.name, amount: `${this.formatUsd(deposit)} 美元`, cnyAmount: `约 ${Math.round(deposit * this.usdToCny).toLocaleString('zh-CN')} 元`, note: `${depositRule.amount.toLocaleString()}美元／人 × ${this.activeStudents.length}；${this.quoteImageSettings.localFeeNotes[depositRule.id] || depositRule.note}` }] : []),
      ...(tvvRule ? [{ label: tvvRule.name, amount: `${this.formatPhp(tvvRule.amount * this.activeStudents.length)}（条件恢复时）`, cnyAmount: `约 ${Math.round(tvvRule.amount * this.activeStudents.length / this.phpPerCny).toLocaleString('zh-CN')} 元`, note: this.quoteImageSettings.localFeeNotes[tvvRule.id] || tvvRule.note }] : []),
      ...referenceRules,
      ...specialPickups,
    ];
  }

  get quoteHeading() { return this.quoteMode === 'single' ? `MONOL斯巴达校区 ${this.selectedWeeks}周报价` : `MONOL斯巴达校区 ${this.activeStudents.length}人报价`; }
  get quoteStartDate() { return this.activeStudents.map((student) => student.quotePlan.startDate).filter(Boolean).sort()[0] ?? this.selectedStartDate; }

  get quoteImageData() {
    const quote = buildPhilippinesDetailedQuote({
      schoolCode: 'MONOL-SPARTA',
      schoolName: '菲律宾碧瑶MONOL斯巴达校区',
      filePrefix: 'MONOL-SPARTA',
      heroSrc: '/assets/philippines/monol-sparta/campus-building.webp',
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
      localFeeItems: this.estimatedLocalFees.map((fee) => {
        const id = this.localFeeRules.find(item => item.name === fee.item)?.id ?? '';
        return {
          label: fee.item,
          unit: fee.unitLabel,
          quantity: this.formatFeeQuantity(fee.quantity),
          amount: this.formatPhp(fee.total),
          note: this.quoteImageSettings.localFeeNotes[id] || fee.note,
        };
      }),
      localFeeTotal: this.localFeeTotal,
      localCurrencyName: '比索',
      localFeeCny: this.localFeeCny,
      localFeeNote: this.quoteImageSettings.localFeeIntro,
      optionalFeeItems: this.optionalFeeItems,
      ruleNotes: this.quoteImageSettings.footerNotes,
      fullFeeDetails: true,
      localFeeTableLayout: 'web',
    });
    const editedQuote = applyEditableQuoteImageCopy(quote, this.quoteImageSettings, this.promotionRules, this.localFeeRules);
    return {
      ...applySchoolQuoteImageLayout(editedQuote, 'MONOL-SPARTA', this.selectedWeeks, this.quoteStartDate, this.quoteUsd, this.usdToCny),
      headingText: this.quoteHeading,
      fileName: `${this.quoteHeading.replace(/\s+/g, '')}-${this.quoteStartDate.replace(/-/g, '')}.png`,
      paymentSectionTitle: this.quoteImageSettings.paymentSectionTitle,
      localFeeTitle: this.quoteImageSettings.localFeeSectionTitle,
      serviceSectionTitle: this.quoteImageSettings.serviceSectionTitle,
      benefitItems: this.quoteImageSettings.benefits,
      serviceLocations: this.quoteImageSettings.serviceLocations,
      alumniBenefitTitle: this.quoteImageSettings.alumniBenefitTitle,
      alumniBenefitItems: [{ title: this.quoteImageSettings.alumniBenefitTitle, subtitle: '', text: this.quoteImageSettings.alumniBenefitText }],
      noteTitle: this.quoteImageSettings.noteSectionTitle,
      importantNotes: this.quoteImageSettings.footerNotes,
      conversionRates: { usdToCny: this.usdToCny, phpPerCny: this.phpPerCny, date: this.exchangeRateDate || undefined },
      exchangeRateText: `学杂费按1元人民币≈${this.phpPerCny}比索估算`,
    };
  }

  previewFeeId(name: string): string {
    return this.localFeeRules.find(item => item.name === name)?.id ?? 'local-fees';
  }

  previewPaymentTarget(item: QuoteImagePaymentItem): CiaPreviewTarget {
    if (item.icon === '课') {
      const id = this.courseFees.find(course => item.detailTitle?.includes(course.name))?.id ?? this.selectedCourseId;
      return { kind: 'course', id };
    }
    if (item.icon === '宿') {
      const id = this.roomFees.find(room => item.detailTitle?.includes(room.name))?.id ?? this.selectedRoomId;
      return { kind: 'room', id };
    }
    if (item.label.includes('注册费') && !item.amount.startsWith('−')) return { kind: 'section', id: 'quote-registration' };
    const normalizedLabel = item.label.replace(/（.*?）/g, '');
    const promotion = this.promotionRules.find(rule => (item.note ?? '').includes(rule.description))
      ?? this.promotionRules.find(rule => normalizedLabel.includes(rule.name)
      || normalizedLabel.includes(rule.name));
    return promotion ? { kind: 'promotion', id: promotion.id } : { kind: 'section', id: 'quote-breakdown' };
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
    if (name.includes('Semi Single')) return 'semi-single-room';
    if (name.includes('Double')) return 'double-room';
    if (name.includes('Triple')) return 'triple-room';
    return this.slugifyPriceKey(name);
  }
}

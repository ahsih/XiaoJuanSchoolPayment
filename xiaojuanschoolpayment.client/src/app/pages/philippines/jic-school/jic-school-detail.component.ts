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
import { QuoteImageDownloadButtonComponent } from '../../../components/quote-image-download-button.component';
import { groupLocalFees, groupPaymentLines } from '../../../components/school-group-quote';
import { applySchoolQuoteImageLayout } from '../../../components/school-quote-plan';
import { SchoolQuotePlanComponent } from '../../../components/school-quote-plan.component';
import { CiaContentConfig } from '../cia-school/cia-content-config';
import { CiaPreviewTarget, isCiaPreviewTarget, resolveCiaPreviewTarget, revealCiaPreviewElement, scrollCiaPreviewElement } from '../cia-school/cia-content-preview';
import { cloneJicContentConfig, createDefaultJicContentConfig } from './jic-content-config';
import {
  JIC_COURSE_FEES,
  JIC_LOCAL_FEE_COPY,
  JIC_PEAK_FEE_PER_WEEK,
  JIC_REGISTRATION_FEE,
  JIC_ROOM_FEES,
  JicCampus,
  JicCourseFee,
  JicRoomFee,
} from './jic-pricing';
import { JicQuoteRules, JicStudentQuote } from './jic-student-quote';

type GalleryCategory = '全部' | '校区' | '教室' | '住宿' | '餐厅' | '设施';

interface QuickInfo { icon: string; label: string; value: string; note: string; }
interface GalleryImage { category: Exclude<GalleryCategory, '全部'>; title: string; description: string; src: string; contentType?: string; }
interface BasicInfoRow { label: string; value: string; }
interface Highlight { image: string; title: string; text: string; }
interface FitItem { title: string; text: string; }
interface CourseItem { name: string; type: string; lessons: string; suitable: string; }
interface ScheduleItem { time: string; title: string; text: string; }
interface ProcessStep { icon: string; title: string; text: string; }
interface FaqItem { question: string; answer: string; }
interface SideNavItem { label: string; target: string; icon: string; }
interface SourceLink { label: string; url: string; }
interface SidaJicReason { number: string; title: string; text: string; image: string; alt: string; }
interface SidaJicTrustBadge { icon: string; label: string; }
interface CampusPriceGroup<T> { campus: JicCampus; eyebrow: string; title: string; description: string; items: T[]; }

@Component({
  selector: 'app-jic-school-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule, QuoteImageDownloadButtonComponent, SchoolQuotePlanComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './jic-school-detail.component.html',
  styleUrls: [
    '../cebu-school-detail-layout.css',
    '../cebu-school-detail-content.css',
    '../cebu-school-detail-responsive.css',
    '../ev-school/ev-school-detail.component.css',
    '../school-quote-rollout.css',
    '../../../components/school-group-quote.css',
    './jic-school-detail.component.css',
  ],
})
export class JicSchoolDetailComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly schoolService = inject(SchoolService);
  private readonly schoolContentService = inject(SchoolContentService);
  private readonly exchangeRateService = inject(ExchangeRateService);
  private readonly route = inject(ActivatedRoute);
  private readonly previewHost = inject(ElementRef) as ElementRef<HTMLElement>;
  private readonly initialContent = createDefaultJicContentConfig();
  private currentContentConfig = cloneJicContentConfig(this.initialContent);
  private versionedContentApplied = false;
  private previewContent?: CiaContentConfig;
  private previewTarget?: CiaPreviewTarget;
  private previewHighlightTarget?: CiaPreviewTarget;
  private previewFocusTimer?: ReturnType<typeof setTimeout>;
  readonly contentConfig = () => this.currentContentConfig;
  get rules(): JicQuoteRules {
    return {
      localFees: this.currentContentConfig.localFees,
      promotions: this.currentContentConfig.quoteSettings.promotions,
      peakSeasonRanges: this.currentContentConfig.quoteSettings.peakSeasonRanges,
    };
  }
  readonly isEditorPreview = typeof window !== 'undefined' && window.parent !== window && this.route.snapshot.queryParamMap.get('contentPreview') === '1';
  private readonly pricingSchoolSearchName = 'JIC';
  private readonly pricingSchoolNames = ['Baguio JIC', '菲律宾碧瑶JIC语言学校', 'Baguio JIC Academy', 'JIC Academy Baguio'];
  private readonly courseFeeOrder = [
    'challenger-esl-lite',
    'challenger-esl-core',
    'challenger-esl-standard',
    'challenger-ielts-lite',
    'challenger-ielts-core',
    'challenger-ielts-standard',
    'challenger-ielts-guarantee',
    'premium-speaking-starter-7',
    'premium-speaking-pro-8',
    'premium-speaking-master-8',
    'premium-tep-8',
    'premium-tep-9',
    'premium-tep-10',
    'premium-active-senior-5',
    'premium-active-senior-6',
    'premium-working-holiday-8',
    'premium-toeic',
    'premium-business-master-8',
    'premium-junior',
    'premium-guardian',
  ];
  private readonly roomFeeOrder = [
    'challenger-single',
    'challenger-twin',
    'challenger-quad-duplex',
    'challenger-quad-bunk',
    'premium-single-no-balcony',
    'premium-single-balcony',
    'premium-twin-no-balcony',
    'premium-twin-balcony',
    'premium-quad-no-balcony',
    'premium-quad-balcony',
  ];

  readonly galleryCategories: GalleryCategory[] = ['全部', '校区', '教室', '住宿', '餐厅', '设施'];
  selectedGalleryCategory: GalleryCategory = '全部';
  registrationFee = JIC_REGISTRATION_FEE;
  seasonalFeePerWeek = JIC_PEAK_FEE_PER_WEEK;
  usdToCny = 7.2;
  phpPerCny = 7.75;
  exchangeRateDate = '';
  usingLiveExchangeRate = false;
  quoteCalculated = false;
  get localFeeIntro(): string { return this.currentContentConfig.quoteSettings.localFeeIntro || JIC_LOCAL_FEE_COPY.intro; }

  readonly quickInfo: QuickInfo[] = [
    { icon: 'terrain', label: '城市', value: '碧瑶 Baguio', note: '凉爽山城，适合把注意力放在长期学习和备考上。' },
    { icon: 'apartment', label: '校区', value: 'Challenger / Premium', note: '官方Main Campus页面现称Baguio JIC Challenger Campus；Premium偏口语、职业英语和舒适生活。' },
    { icon: 'assignment', label: '重点方向', value: 'ESL / IELTS / Speaking / Career', note: '从基础英文、雅思保证班到TOEIC、商务和打工度假都有对应路线。' },
    { icon: 'school', label: '学习风格', value: '目标导向分校区', note: '先按目标选校区，再按课时量、管理强度和房型做报价。' },
    { icon: 'bed', label: '住宿', value: '单人 / 双人 / 四人房', note: 'Challenger和Premium房型不同，热门档期要提前确认空位。' },
    { icon: 'payments', label: '费用表', value: 'JIC 2026价格', note: '课程住宿以USD计算，特别选修课和保证班费用以PHP另计。' },
  ];

  private readonly builtInGalleryImages: GalleryImage[] = [
    { category: '校区', title: '菲律宾碧瑶JIC语言学校Challenger校园航拍', description: '菲律宾碧瑶JIC语言学校官方Challenger Campus页面展示的碧瑶Main / Challenger校区环境。', src: 'assets/philippines/jic-campus-hero.jpg' },
    { category: '校区', title: 'Baguio JIC Main Campus全景', description: 'Main Photos页面展示的Challenger / Main校区整体视角。', src: 'assets/philippines/jic-main-campus-overview.png' },
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
    { label: '英文名称', value: 'Baguio JIC / Baguio JIC Challenger Campus / JIC Premium Campus' },
    { label: '所在城市', value: '菲律宾碧瑶 Baguio City' },
    { label: 'Challenger地址', value: '73 Del Nacia Apt, Upper West Camp 7, Baguio City, Philippines' },
    { label: '主要校区', value: 'Challenger Campus（ESL / IELTS，官方main-campus页面）与 Premium Campus（Speaking / Career）' },
    { label: 'Challenger概况', value: '官方页面列容量约130人、2006年设立、最低年龄18岁。' },
    { label: '课程方向', value: 'ESL Lite/Core/Standard、IELTS Lite/Core/Standard/Guarantee、Speaking、TEP、Active Senior、TOEIC、Business、Working Holiday、青少年与监护人课程' },
    { label: '住宿方向', value: 'Challenger标准单人/双人、复式或上下铺四人间；Premium无阳台/带阳台单人、双人及四人间' },
    { label: '学习制度', value: 'Challenger更重视词汇测试、自习、IELTS和ESL体系；Premium更重视主题式学习、口语输出和职业场景' },
    { label: '报价说明', value: '课程费与住宿费按JIC 2026价格逐项核对；最终以学校正式报价为准' },
  ];

  readonly highlights: Highlight[] = [
    { image: 'assets/philippines/jic-campus-hero.jpg', title: '两个校区定位很清楚', text: 'Challenger适合想要ESL强化、IELTS备考和更明确学习制度的学生；Premium适合口语、职业英语、成人和更重视生活舒适度的学生。' },
    { image: 'assets/philippines/jic-main-ielts-class.png', title: 'IELTS与备考资源突出', text: 'JIC公开资料强调IELTS师资、模拟考试、词汇测试和自习制度，适合目标分数明确的学生。' },
    { image: 'assets/philippines/jic-premium-group-class.png', title: 'Premium主打Active Learning', text: 'Premium课程覆盖Speaking、TEP ESL、TOEIC、Working Holiday和Business Master，适合想把英语用在真实表达与职业场景的人。' },
    { image: 'assets/philippines/jic-premium-quad-room.png', title: '房型差异直接影响预算', text: '从Challenger上下铺四人间到Premium带阳台单人间，4周住宿差距很大，建议报价时同步确认学习目标与生活期待。' },
  ];

  readonly suitableFor: FitItem[] = [
    { title: '想在碧瑶系统冲ESL或IELTS', text: '优先看Challenger校区，课程量、测试和自习制度更适合目标明确的学习节奏。' },
    { title: '想加强口语、表达或职场英文', text: 'Premium的Speaking、TEP ESL、Business Master、Working Holiday和TOEIC路线更容易匹配应用型目标。' },
    { title: '需要先控制预算再选校区', text: 'Challenger上下铺或复式四人间常是预算入口，适合先用费用表做总价范围。' },
    { title: '成人、工作者或希望住得舒服', text: 'Premium校区房型和设施选择更丰富，适合重视舒适度、安静环境和交流空间的人。' },
  ];

  readonly notSuitableFor: FitItem[] = [
    { title: '只想看一个统一报价', text: 'JIC必须先分Challenger和Premium，再看课程、房型和旺季档期，不适合只凭学校名做决定。' },
    { title: '不想接受测试或晚间自习', text: 'Challenger的ESL/IELTS路线会更强调词汇测试、自习和课堂纪律，报名应先确认能否适应。' },
    { title: '旺季临近才想锁定单人房', text: 'Premium单人间和热门Challenger房型容易紧张，建议提前核空房。' },
    { title: '只想要海边度假感', text: 'JIC在碧瑶，优势是学习氛围、凉爽气候和长期投入，不是海岛度假型学校。' },
  ];

  readonly courses: CourseItem[] = [
    { name: 'ESL Lite / Core / Standard · 轻量 / 核心 / 标准英语课程', type: 'Challenger 挑战校区（主校区）', lessons: '4-6节一对一 + 2节小组课', suitable: 'Lite/Core/Standard按一对一课时递增，适合从基础到密集提升的学生。' },
    { name: 'IELTS Lite / Core / Standard · 雅思轻量 / 核心 / 标准课程', type: 'Challenger 挑战校区（主校区）', lessons: '4-6节一对一 + 2节小组课', suitable: '雅思课程每周六安排模拟考试；Standard另含强制自习和30分钟词汇测试。' },
    { name: 'IELTS Guarantee · 雅思保分班', type: 'Challenger 挑战校区（主校区）', lessons: '6节一对一 + 2节小组课 + 强制自习及词汇测试', suitable: '每周六模拟测试；保证班参加费另付PHP 18,000。' },
    { name: 'Speaking Starter / Pro / Master · 口语入门 / 进阶 / 大师课程', type: 'Premium 高级校区', lessons: '4-6节一对一 + 1节团体课 + 2节选修课', suitable: 'Starter适合初学者；Pro/Master适合想提升流利度、逻辑表达、演讲和讨论的人。' },
    { name: 'TEP 8 / 9 / 10 · 主题英语课程', type: 'Premium 高级校区', lessons: '3-5节一对一 + 3节团体课 + 2节选修课', suitable: '适合喜欢通过生活主题练习英文表达的学生。' },
    { name: 'Active Senior 5 / 6 · 活力银发课程', type: 'Premium 高级校区', lessons: '3-4节一对一 + 2节选修课', suitable: '适合40岁以上学生，兼顾英语学习、旅游与休闲。' },
    { name: 'TOEIC / Working Holiday 8 · 托业 / 打工度假英语课程', type: 'Premium 高级校区', lessons: '3节一对一 + 3节团体课 + 2节选修课', suitable: '适合求职、打工度假、职场沟通或托业成绩目标。' },
    { name: 'Business Master 8 · 商务英语大师课程', type: 'Premium 高级校区', lessons: '6节一对一 + 2节选修课', suitable: '适合商务邮件、演示、会议、谈判和跨文化职场表达需求。' },
    { name: 'Junior / Guardian · 青少年 / 监护人课程', type: 'Premium 高级校区', lessons: '青少年4节一对一 + 2节团体课；监护人2节一对一', suitable: '青少年课程另含1小时写作活动和2小时监控晚自习。' },
  ];
  galleryImages: GalleryImage[] = this.builtInGalleryImages.map(item => ({ ...item }));

  courseFees: JicCourseFee[] = JIC_COURSE_FEES.map((course) => ({ ...course }));
  roomFees: JicRoomFee[] = JIC_ROOM_FEES.map((room) => ({ ...room }));

  get courseFeeGroups(): CampusPriceGroup<JicCourseFee>[] {
    return [
      {
        campus: 'challenger',
        eyebrow: 'CHALLENGER CAMPUS',
        title: '挑战校区（主校区）课程',
        description: 'ESL综合英语与IELTS雅思强化课程',
        items: this.courseFees.filter((course) => course.campus === 'challenger'),
      },
      {
        campus: 'premium',
        eyebrow: 'PREMIUM CAMPUS',
        title: '高级校区课程',
        description: '口语、主题英语、职业英语、成人及亲子课程',
        items: this.courseFees.filter((course) => course.campus === 'premium'),
      },
    ];
  }

  get roomFeeGroups(): CampusPriceGroup<JicRoomFee>[] {
    return [
      {
        campus: 'challenger',
        eyebrow: 'CHALLENGER CAMPUS',
        title: '挑战校区（主校区）住宿',
        description: '标准单人、双人及两种四人房',
        items: this.roomFees.filter((room) => room.campus === 'challenger'),
      },
      {
        campus: 'premium',
        eyebrow: 'PREMIUM CAMPUS',
        title: '高级校区住宿',
        description: '单人、双人及四人房均分无阳台与带阳台房型',
        items: this.roomFees.filter((room) => room.campus === 'premium'),
      },
    ];
  }

  readonly students: JicStudentQuote[] = [new JicStudentQuote(this)];
  quoteMode: 'single' | 'group' = 'single';
  private requestedStudentCount = 2;

  readonly schedule: ScheduleItem[] = [
    { time: '07:00 - 08:00', title: '早餐 / 晨间准备', text: 'Challenger学生通常需要为词汇测试、课堂和自习安排预留稳定节奏。' },
    { time: '08:00 - 12:00', title: '上午一对一与团体课', text: 'ESL、IELTS、Speaking或Career课程会按校区和学生水平安排科目。' },
    { time: '12:00 - 13:00', title: '午餐与短休', text: '学校餐厅与宿舍都在校区生活圈内，适合把通勤时间压到最低。' },
    { time: '13:00 - 17:00', title: '下午课程与输出训练', text: 'Challenger偏备考与基础强化，Premium偏主题、口语和职业场景应用。' },
    { time: '18:00 - 19:00', title: '晚餐 / 个人时间', text: '不同校区门禁和生活规则不同，报名时应按当期规定确认。' },
    { time: '19:30 - 22:00', title: '词汇测试 / 自习 / 选修', text: 'Challenger公开资料中有晚间词汇测试和自习安排，适合需要制度推动的人。' },
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
    { number: '01', title: '先判断菲律宾碧瑶JIC语言学校哪个校区适合', text: '不会只按学校名推荐，会把Challenger和Premium的学习强度、课程目标、生活舒适度和预算拆开比较。', image: 'assets/cia/sida-why-action-selection.jpg', alt: '思达启航顾问帮助学生选择菲律宾碧瑶JIC语言学校校区' },
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
    '菲律宾碧瑶JIC语言学校必须先分Challenger和Premium校区，再决定课程、房型和费用。',
    'Challenger ESL / IELTS更适合需要测试、自习和明确学习制度的学生。',
    'Premium更适合口语、职业英文、成人学习和更舒适住宿需求。',
    '课程费与住宿费按JIC 2026价格逐项核对，最终会随学校政策、优惠和房型空位变化。',
    '斯巴达课程每周强制模拟考；半斯巴达课程双周强制模拟考。',
    'Challenger校区特别选修课每4周另付PHP 2,000。',
    '2026旺季附加费为USD 40/周，适用期间为2026/6/28—8/22；页面按实际覆盖旺季的学习周数自动计算。',
    '淡季优惠按入学日期、房型和每满4周自动计算；长期优惠、圣诞及节日优惠可按规则叠加，校内延长不适用淡季优惠。',
    '最终报名以学校正式录取、付款节点和顾问确认报价为准。',
  ];
  readonly faqs: FaqItem[] = [
    { question: '菲律宾碧瑶JIC语言学校的Challenger和Premium怎么选？', answer: '目标是ESL基础强化、IELTS备考或需要更强制度，优先看Challenger；目标是口语、职场英文、打工度假、多益或更舒适生活，优先看Premium。' },
    { question: '菲律宾碧瑶JIC语言学校适合零基础学生吗？', answer: '可以。Challenger ESL Lite适合从基础开始系统提升，Premium Speaking Starter 7也适合初学者；具体要按自律程度和生活偏好判断校区。' },
    { question: '页面报价包含全部费用吗？', answer: '不包含全部。前期支付参考主要包含注册费、课程费、住宿费和旺季附加费；到校后还需准备SSP、SSP I-Card、签证延签、ACR I-Card、教材、水电、押金、洗衣和接机等PHP费用。' },
    { question: 'IELTS Guarantee是不是只付课程费就可以？', answer: '不是。IELTS Guarantee除4周课程费外，还需确认保证班参加费、出勤和分数保证规则，页面按公开资料列出PHP 18,000参加费参考。' },
    { question: '思达会协助签证和入境吗？', answer: '会。通过思达报名菲律宾碧瑶JIC语言学校，思达顾问会免费协助菲律宾入境及签证相关手续，并在出发前发送行前清单和费用提醒。' },
  ];
  readonly sideNav: SideNavItem[] = [
    { label: '学校环境', target: 'gallery', icon: 'image' },
    { label: '课程与费用', target: 'course-fees', icon: 'menu_book' },
    { label: '费用快速报价', target: 'quote', icon: 'calculate' },
    { label: '到校费用', target: 'local-fees', icon: 'payments' },
    { label: '报名流程', target: 'service-process', icon: 'task_alt' },
    { label: '资料来源', target: 'sources', icon: 'link' },
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

  readonly sourceLinks: SourceLink[] = [
    { label: '菲律宾碧瑶JIC语言学校 官方首页', url: 'https://baguio-jic.com/' },
    { label: 'Baguio JIC Challenger Campus 官方页', url: 'https://baguio-jic.com/campuses/main-campus/' },
    { label: 'Baguio JIC Premium Campus 官方页', url: 'https://baguio-jic.com/campuses/premium-campus/' },
    { label: '菲律宾碧瑶JIC语言学校 官方费用页', url: 'https://baguio-jic.com/ja/price/' },
    { label: 'Fujiyama JIC Challenger Campus费用参考', url: 'https://www.fujiyama-international.com/philippines/jic-baguio.html' },
  ];

  ngOnInit(): void {
    this.applyContentConfig(this.readSessionPreview() ?? this.initialContent, this.isEditorPreview);
    this.loadPricingFromDatabase();
    this.loadPublishedContent();
    this.loadExchangeRate();
  }

  ngAfterViewInit(): void {
    if (!this.isEditorPreview) return;
    this.previewHost.nativeElement.classList.add('jic-editor-preview');
    window.parent.postMessage({ type: 'jic-content-ready' }, window.location.origin);
  }

  ngOnDestroy(): void { clearTimeout(this.previewFocusTimer); }

  @HostListener('window:message', ['$event'])
  applyEditorPreview(event: MessageEvent): void {
    if (!this.isEditorPreview || event.origin !== window.location.origin || event.source !== window.parent) return;
    const message = event.data as { type?: string; content?: CiaContentConfig; target?: CiaPreviewTarget; scroll?: boolean };
    if (message?.type !== 'jic-content-preview' || !message.content) return;
    this.applyContentConfig(message.content, true);
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
    window.parent.postMessage({ type: 'jic-content-select', ...target }, window.location.origin);
  }

  isPreviewHighlighted(kind: string | undefined, id: string | undefined): boolean {
    return this.isEditorPreview && !!kind && !!id && this.previewHighlightTarget?.kind === kind && this.previewHighlightTarget?.id === id;
  }

  private loadExchangeRate(): void {
    this.exchangeRateService
      .getLatestCnyRates()
      .pipe(catchError(() => EMPTY))
      .subscribe((rates) => {
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
    ).subscribe(({ lessons, rooms, fees }) => {
      if (!this.versionedContentApplied) this.applyPricingData(lessons, rooms, fees);
    });
  }

  private loadPublishedContent(): void {
    this.schoolService.getSchools({ name: this.pricingSchoolSearchName }).pipe(
      switchMap((schools) => {
        const school = this.pricingSchoolNames.map(name => schools.find(item => item.name === name)).find(Boolean)
          ?? schools.find(item => item.name.toUpperCase().includes('JIC')) ?? schools[0];
        if (!school?.id) return EMPTY;
        return forkJoin({
          published: this.schoolContentService.getPublished<CiaContentConfig>(school.id).pipe(catchError(() => of(null))),
          photos: this.schoolService.getSchoolPhotos({ schoolId: school.id, isActive: true }).pipe(catchError(() => of([]))),
        });
      }),
      catchError(() => EMPTY),
    ).subscribe(({ published, photos }) => {
      const preview = this.readSessionPreview();
      if (preview) this.applyContentConfig(preview, true);
      else if (published?.content) this.applyContentConfig(published.content, true);
      if (!this.versionedContentApplied) this.applyGalleryPhotos(photos);
    });
  }

  private applyContentConfig(value: CiaContentConfig, authoritative = false): void {
    if (value?.schemaVersion !== 1 || value.schoolCode !== 'JIC') return;
    const content = cloneJicContentConfig(value);
    this.currentContentConfig = content;
    this.previewContent = content;
    if (authoritative) this.versionedContentApplied = true;
    this.courseFees = content.courses.filter(item => item.enabled).sort((a, b) => a.sortOrder - b.sortOrder).map(item => ({
      id: item.id,
      campus: item.campus === 'premium' ? 'premium' : 'challenger',
      displayName: item.name,
      name: item.englishName || item.name,
      tuition: item.tuition,
      suitable: item.schedule || item.suitable || item.note,
    }));
    this.roomFees = content.rooms.filter(item => item.enabled).sort((a, b) => a.sortOrder - b.sortOrder).map(item => ({
      id: item.id,
      campus: item.campus === 'premium' ? 'premium' : 'challenger',
      category: item.single ? 'single' : item.code === 'twin' ? 'twin' : 'quad',
      name: item.label || item.name,
      fee: item.fee,
      note: item.note,
      premium2027SingleEligible: item.id === 'premium-single-no-balcony',
    }));
    this.registrationFee = content.quoteSettings.registrationFee;
    this.seasonalFeePerWeek = content.quoteSettings.peakSeasonFeePerWeek;
    for (const student of this.students) student.setCampus(student.campus);
    this.galleryImages = [
      ...this.builtInGalleryImages.map(item => ({ ...item })),
      ...(content.media ?? []).filter(item => item.isActive && !!item.url).sort((a, b) => a.displayOrder - b.displayOrder).map(item => ({
        category: this.resolveMediaCategory(item.category),
        title: item.caption || item.altText || item.originalFileName || 'JIC学校媒体',
        description: item.altText || item.caption || 'JIC学校实景内容',
        src: item.url,
        contentType: item.contentType,
      })),
    ];
    this.queuePreviewFocus(false);
  }

  private applyGalleryPhotos(photos: SchoolPhotoDTO[]): void {
    const existing = new Set(this.galleryImages.map(item => item.src));
    const uploaded = photos.filter(photo => !!photo.url && !existing.has(photo.url)).sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)).map(photo => ({
      category: this.resolveMediaCategory(photo.category),
      title: photo.caption || photo.altText || photo.originalFileName || 'JIC学校媒体',
      description: photo.altText || photo.caption || 'JIC学校实景内容',
      src: photo.url ?? '',
      contentType: photo.contentType,
    }));
    if (uploaded.length) this.galleryImages = [...this.galleryImages, ...uploaded];
  }

  private resolveMediaCategory(category?: string): Exclude<GalleryCategory, '全部'> {
    const value = (category ?? '').toLowerCase();
    if (value.includes('class') || value.includes('教室')) return '教室';
    if (value.includes('room') || value.includes('dorm') || value.includes('住宿')) return '住宿';
    if (value.includes('餐')) return '餐厅';
    if (value.includes('facility') || value.includes('设施')) return '设施';
    return '校区';
  }

  private readSessionPreview(): CiaContentConfig | null {
    if (typeof sessionStorage === 'undefined' || !this.isEditorPreview) return null;
    try {
      const raw = sessionStorage.getItem('jic-content-preview');
      if (!raw) return null;
      const value = JSON.parse(raw) as CiaContentConfig;
      return value?.schemaVersion === 1 && value.schoolCode === 'JIC' ? value : null;
    } catch { return null; }
  }

  private queuePreviewFocus(scroll: boolean): void {
    if (!this.isEditorPreview || !this.previewTarget) return;
    clearTimeout(this.previewFocusTimer);
    this.previewFocusTimer = setTimeout(() => {
      const target = this.previewTarget!;
      const result = resolveCiaPreviewTarget(this.previewHost.nativeElement, target);
      const fallback = result.elements[0]?.dataset;
      this.previewHighlightTarget = result.exact ? target : fallback ? { kind: 'section', id: fallback['ciaPreviewId'] ?? '' } : undefined;
      this.previewHost.nativeElement.querySelectorAll<HTMLElement>('.cia-preview-highlight').forEach(element => element.classList.remove('cia-preview-highlight'));
      result.elements.forEach(element => element.classList.add('cia-preview-highlight'));
      for (const element of result.elements) if (scroll) revealCiaPreviewElement(element);
      if (scroll && result.elements[0]) scrollCiaPreviewElement(result.elements[0]);
      const item = target.kind === 'course' ? this.previewContent?.courses.find(entry => entry.id === target.id)
        : target.kind === 'room' ? this.previewContent?.rooms.find(entry => entry.id === target.id)
          : target.kind === 'fee' ? this.previewContent?.localFees.find(entry => entry.id === target.id)
            : target.kind === 'promotion' ? this.previewContent?.quoteSettings.promotions.find(entry => entry.id === target.id) : undefined;
      const status = item?.enabled === false ? '此项已隐藏或停用，官网不会显示；已定位到所属板块。'
        : !result.exact && target.kind === 'promotion' ? '当前试算未产生此优惠；已定位到优惠核算区域。'
          : result.exact ? '橙色框内就是 JIC 对应内容。' : '当前试算未显示此项，已定位到所属板块。';
      window.parent.postMessage({ type: 'jic-content-located', target, status }, window.location.origin);
    }, 80);
  }

  private applyPricingData(lessons: SchoolLessonDTO[], rooms: SchoolRoomDTO[], fees: SchoolFeeDTO[]): void {
    const databaseCourseFees = lessons
      .filter((lesson) => lesson.week === 4)
      .map((lesson) => {
        const id = this.createCourseId(lesson.name);
        const catalogCourse = this.courseFees.find((course) => course.id === id);
        if (!catalogCourse) return null;
        return {
          ...catalogCourse,
          name: lesson.name,
          tuition: lesson.price,
          suitable: catalogCourse.suitable || lesson.description || lesson.note || '请联系顾问确认课程安排',
        };
      })
      .filter((course): course is JicCourseFee => !!course)
      .sort((a, b) => this.orderIndex(this.courseFeeOrder, a.id) - this.orderIndex(this.courseFeeOrder, b.id));
    if (databaseCourseFees.length > 0) {
      this.courseFees = databaseCourseFees;
    }

    const databaseRoomFees = rooms
      .filter((room) => room.week === 4)
      .map((room) => {
        const id = this.createRoomId(room.name);
        const catalogRoom = this.roomFees.find((item) => item.id === id);
        return catalogRoom ? { ...catalogRoom, name: room.name, fee: room.price, note: catalogRoom.note || room.description || '请联系顾问确认空房' } : null;
      })
      .filter((room): room is JicRoomFee => !!room)
      .sort((a, b) => this.orderIndex(this.roomFeeOrder, a.id) - this.orderIndex(this.roomFeeOrder, b.id));
    if (databaseRoomFees.length > 0) {
      this.roomFees = databaseRoomFees;
    }

    const registrationFee = fees.find((fee) => fee.name === '注册费');
    if (registrationFee) this.registrationFee = registrationFee.fee;
    // The supplied JIC sheet is authoritative for this fixed surcharge.
    this.seasonalFeePerWeek = JIC_PEAK_FEE_PER_WEEK;
  }

  setGalleryCategory(category: GalleryCategory): void { this.selectedGalleryCategory = category; }
  calculateQuote(): void { this.quoteCalculated = true; }
  get studentCount(): number { return this.requestedStudentCount; }
  set studentCount(value: number) {
    this.requestedStudentCount = value;
    if (Number.isInteger(value) && value >= 2 && value <= 20) {
      while (this.students.length < value) this.students.push(new JicStudentQuote(this));
    }
  }
  setQuoteMode(value: 'single' | 'group'): void {
    this.quoteMode = value;
    if (value === 'group') this.studentCount = this.requestedStudentCount;
  }
  setStudentCampus(student: JicStudentQuote, campus: JicCampus): void { student.setCampus(campus); }
  get activeStudents(): JicStudentQuote[] {
    return this.quoteMode === 'single'
      ? this.students.slice(0, 1)
      : this.students.slice(0, Math.max(2, Math.min(20, Math.floor(this.studentCount) || 2)));
  }
  get quoteHeading(): string {
    return this.quoteMode === 'single' ? `JIC ${this.students[0].campus === 'challenger' ? '挑战校区' : '高级校区'}${this.selectedWeeks}周报价` : `JIC ${this.activeStudents.length}人报价`;
  }
  get quoteFormHeading(): string {
    return this.quoteMode === 'single'
      ? 'JIC Challenger / Premium 两校区报价'
      : `JIC Challenger / Premium ${this.activeStudents.length}人报价`;
  }
  get quoteError(): string {
    if (this.quoteMode === 'group' && (!Number.isInteger(this.studentCount) || this.studentCount < 2 || this.studentCount > 20)) return '多人报价人数请选择2–20人的整数。';
    const index = this.activeStudents.findIndex((student) => !!student.quoteError);
    return index < 0 ? '' : `${this.quoteMode === 'group' ? `学生${index + 1}：` : ''}${this.activeStudents[index].quoteError}`;
  }
  get selectedWeeks(): number { return this.students[0].courseWeeks; }
  get selectedStartDate(): string { return this.students[0].arrivalDate; }
  get earliestStartDate(): string { return this.activeStudents.map((student) => student.arrivalDate).filter(Boolean).sort()[0] ?? ''; }
  get quoteImageHeroSrc(): string {
    const campuses = new Set(this.activeStudents.map((student) => student.campus));
    if (campuses.size === 1 && campuses.has('premium')) {
      return '/assets/philippines/jic-premium-campus-overview.jpg';
    }
    if (campuses.size === 1 && campuses.has('challenger')) {
      return '/assets/philippines/jic-main-campus-overview.png';
    }
    return '/assets/philippines/jic-campus-hero.jpg';
  }
  get schoolPaymentItems() {
    const imageSettings = this.currentContentConfig.quoteImageSettings;
    return [
      {
        icon: '注',
        label: '注册费',
        amount: `${this.formatUsd(this.registrationFee * this.activeStudents.length)} 美元`,
        note: imageSettings.paymentNotes.registration || `${this.formatUsd(this.registrationFee)}美元／人且每人只收一次；符合条件时在“注册费优惠”行抵扣。`,
      },
      ...groupPaymentLines(this.activeStudents, false),
    ];
  }
  get quoteUsd(): number { return this.activeStudents.reduce((sum, student) => sum + student.quoteUsd, 0); }
  get quoteUsdText(): string { return `${this.formatUsd(this.quoteUsd)} 美元`; }
  get quoteCnyText(): string { return `人民币预计金额：约 ${Math.round(this.quoteUsd * this.usdToCny).toLocaleString('zh-CN')} 元`; }
  get exchangeRateSummary(): string {
    const source = this.usingLiveExchangeRate ? this.exchangeRateDate.replace(/-/g, '/') : '备用参考值';
    return `参考汇率：1美元≈${this.usdToCny.toLocaleString('zh-CN', { maximumFractionDigits: 6 })}元，1元≈${this.phpPerCny.toLocaleString('zh-CN', { maximumFractionDigits: 6 })}比索（${source}）`;
  }
  get estimatedLocalFees() { return groupLocalFees(this.activeStudents); }
  get estimatedLocalFeeTotal(): number { return this.estimatedLocalFees.reduce((sum, fee) => sum + fee.total, 0); }
  get estimatedLocalFeeCny(): number { return Math.round(this.estimatedLocalFeeTotal / this.phpPerCny); }
  get optionalFeeItems() {
    const count = this.activeStudents.length;
    const deposit = this.currentContentConfig.localFees.find(fee => fee.enabled && !fee.includeInTotal && fee.id === 'room-deposit');
    if (!deposit) return [];
    const total = deposit.amount * (deposit.multiplyByStudents === false ? 1 : count);
    return [{
      label: deposit.name,
      amount: `${this.formatPhp(total)}${count > 1 && deposit.multiplyByStudents !== false ? `（${this.formatPhp(deposit.amount)}／人 × ${count}人）` : ''}`,
      cnyAmount: `约人民币 ${Math.round(total / this.phpPerCny).toLocaleString('zh-CN')} 元`,
      note: this.currentContentConfig.quoteImageSettings.localFeeNotes[deposit.id] || deposit.note,
    }];
  }
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
  get quoteImageData() {
    const imageSettings = this.currentContentConfig.quoteImageSettings;
    const paymentItems = [
      this.schoolPaymentItems[0],
      ...(['课', '宿'] as const).flatMap((icon) => this.activeStudents.flatMap((student, index) => student.quotePlan.paymentItems()
        .filter((item) => item.icon === icon)
        .map((item) => ({
          ...item,
          label: `${this.quoteMode === 'group' ? `学生${index + 1} · ` : ''}${item.label.replace(/^课程费/, '课程名称').replace(/^住宿费/, '住宿名称')}`,
        })))),
      ...groupPaymentLines(this.activeStudents.map((student) => ({ paymentLines: student.paymentLines.filter((line) => line.value !== 0) })), true),
    ];
    const warnings = this.activeStudents.flatMap((student, index) => student.quotePlan.warning ? [`${this.quoteMode === 'group' ? `学生${index + 1}：` : ''}${student.quotePlan.warning}`] : []);
    const quote = buildPhilippinesDetailedQuote({
      schoolCode: 'JIC',
      schoolName: '菲律宾碧瑶JIC语言学校',
      filePrefix: 'JIC',
      heroSrc: this.quoteImageHeroSrc,
      weeks: this.selectedWeeks,
      startDate: this.earliestStartDate,
      usdToCny: this.usdToCny,
      totalUsd: this.quoteUsd,
      fullFeeDetails: true,
      localFeeTableLayout: 'web',
      paymentItems,
      localFeeItems: this.estimatedLocalFees.map((fee) => ({ label: fee.item, unit: fee.unitLabel, quantity: this.formatFeeQuantity(fee.quantity), amount: this.formatPhp(fee.total), note: this.quoteImageFeeNote(fee.item, fee.note) })),
      localFeeTotal: this.estimatedLocalFeeTotal,
      localCurrencyName: '比索',
      localFeeCny: this.estimatedLocalFeeCny,
      localFeeNote: imageSettings.localFeeIntro || this.localFeeIntro,
      optionalFeeItems: this.optionalFeeItems,
      // As with CIA, applied promotions and surcharges belong beside their amounts
      // in the school-payment table instead of being repeated in the footer.
      ruleNotes: [],
    });
    const result = applySchoolQuoteImageLayout({
      ...quote,
      paymentSectionTitle: imageSettings.paymentSectionTitle,
      localFeeTitle: imageSettings.localFeeSectionTitle,
      serviceSectionTitle: imageSettings.serviceSectionTitle,
      benefitItems: imageSettings.benefits,
      serviceLocations: imageSettings.serviceLocations,
      alumniBenefitTitle: imageSettings.alumniBenefitTitle,
      alumniBenefitItems: [{ title: imageSettings.alumniBenefitTitle, subtitle: '', text: imageSettings.alumniBenefitText }],
      importantNotes: [
        ...warnings,
        ...imageSettings.footerNotes,
      ],
    }, 'JIC', this.selectedWeeks, this.earliestStartDate, this.quoteUsd, this.usdToCny);
    return {
      ...result,
      headingText: this.quoteHeading,
      fileName: `${this.quoteHeading}-${this.earliestStartDate.replace(/-/g, '')}.png`,
      conversionRates: { usdToCny: this.usdToCny, phpPerCny: this.phpPerCny, date: this.usingLiveExchangeRate ? this.exchangeRateDate : undefined },
    };
  }

  feePreviewId(itemName: string): string {
    return this.currentContentConfig.localFees.find(fee => fee.name === itemName)?.id ?? 'local-fee-intro';
  }

  private quoteImageFeeNote(itemName: string, fallback: string): string {
    const fee = this.currentContentConfig.localFees.find(item => item.name === itemName);
    return fee ? this.currentContentConfig.quoteImageSettings.localFeeNotes[fee.id] || fee.note : fallback;
  }

  formatUsd(value: number): string {
    return value.toLocaleString('en-US', { minimumFractionDigits: Number.isInteger(value) ? 0 : 1, maximumFractionDigits: 2 });
  }
  formatPhp(value: number): string { return `${Math.round(value).toLocaleString('en-US')} 比索`; }
  formatFeeQuantity(value: number): string { return value.toLocaleString('zh-CN', { maximumFractionDigits: 2 }); }
  private slugifyPriceKey(value: string): string {
    return value.toLowerCase().replace(/&/g, 'and').replace(/\+/g, ' plus ').replace(/\//g, ' ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }
  private orderIndex(order: string[], value: string): number {
    const index = order.indexOf(value);
    return index === -1 ? Number.MAX_SAFE_INTEGER : index;
  }
  private createCourseId(name: string): string {
    if (name.includes('托业')) return 'premium-toeic';
    if (name.includes('青少年')) return 'premium-junior';
    if (name.includes('监护人')) return 'premium-guardian';
    return this.slugifyPriceKey(name);
  }
  private createRoomId(name: string): string {
    if (name.includes('Challenger') && name.includes('单人')) return 'challenger-single';
    if (name.includes('Challenger') && name.includes('双人')) return 'challenger-twin';
    if (name.includes('Challenger') && name.includes('四人') && name.includes('复式')) return 'challenger-quad-duplex';
    if (name.includes('Challenger') && name.includes('四人') && name.includes('上下铺')) return 'challenger-quad-bunk';
    if (name.includes('Premium') && name.includes('单人') && name.includes('无阳台')) return 'premium-single-no-balcony';
    if (name.includes('Premium') && name.includes('单人') && name.includes('带阳台')) return 'premium-single-balcony';
    if (name.includes('Premium') && name.includes('双人') && name.includes('无阳台')) return 'premium-twin-no-balcony';
    if (name.includes('Premium') && name.includes('双人') && name.includes('带阳台')) return 'premium-twin-balcony';
    if (name.includes('Premium') && name.includes('四人') && name.includes('无阳台')) return 'premium-quad-no-balcony';
    if (name.includes('Premium') && name.includes('四人') && name.includes('带阳台')) return 'premium-quad-balcony';
    return this.slugifyPriceKey(name);
  }
}

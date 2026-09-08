import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { catchError, EMPTY, forkJoin, of, switchMap } from 'rxjs';
import { SchoolFeeDTO } from '../../../../interfaces/school-fees.dto';
import { SchoolLessonDTO } from '../../../../interfaces/school-lessons.dto';
import { SchoolRoomDTO } from '../../../../interfaces/school-rooms.dto';
import { ExchangeRateService } from '../../../../services/exchange-rate.service';
import { SchoolService } from '../../../../services/school.service';
import { applySchoolQuoteImageLayout } from '../../../components/school-quote-plan';
import { groupLocalFees, groupPaymentLines } from '../../../components/school-group-quote';
import { buildPhilippinesDetailedQuote } from '../../../components/philippines-quote-image-data';
import { QuoteImageDownloadButtonComponent, QuoteImagePaymentItem } from '../../../components/quote-image-download-button.component';
import { SchoolQuotePlanComponent } from '../../../components/school-quote-plan.component';
import { PinesStudentQuote, pinesPriceMultiplier } from './pines-student-quote';

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
type PinesCampusCode = 'main' | 'ielts';
interface CampusCatalogGroup<T> { code: PinesCampusCode; title: string; description: string; items: T[]; }
interface ProcessStep { icon: string; title: string; text: string; }
interface FaqItem { question: string; answer: string; }
interface SideNavItem { label: string; target: string; icon: string; }
interface SidaPinesReason { number: string; title: string; text: string; image: string; alt: string; }
interface SidaPinesTrustBadge { icon: string; label: string; }
type PinesRoomAvailabilityStatus = 'open' | 'limited' | 'stay-only' | 'closed';
type PinesStudentGender = 'male' | 'female';
interface PinesGenderAvailability { status: PinesRoomAvailabilityStatus; vacancies: number | null; }
interface PinesRoomAvailabilityRoom { name: string; male: PinesGenderAvailability; female: PinesGenderAvailability; }
interface PinesRoomAvailabilityDate { date: string; rooms: PinesRoomAvailabilityRoom[]; }
interface PinesRoomAvailabilityCampus { code: string; name: string; dates: PinesRoomAvailabilityDate[]; }
interface PinesRoomAvailabilityResponse { updatedAt: string; isCached: boolean; campuses: PinesRoomAvailabilityCampus[]; }
interface PinesStayPeriod { weeks: number; date: string; available: boolean; vacancies: number | null; mustMoveAfter: boolean; }
interface PinesStayRoom { name: string; male: PinesStayPeriod[]; female: PinesStayPeriod[]; }
interface PinesStayAvailabilityResponse { updatedAt: string; isCached: boolean; campus: string; startDate: string; maxWeeks: number; rooms: PinesStayRoom[]; }
interface PinesRoomPlanSegment { room: string; startDate: string; endDate: string; weeks: number; vacancies: number | null; }
interface PinesRoomPlan { title: string; description: string; segments: PinesRoomPlanSegment[]; }

@Component({
  selector: 'app-pines-school-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule, SchoolQuotePlanComponent, QuoteImageDownloadButtonComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './pines-school-detail.component.html',
  styleUrls: [
    '../cebu-school-detail-layout.css',
    '../cebu-school-detail-content.css',
    '../cebu-school-detail-responsive.css',
    '../ev-school/ev-school-detail.component.css',
    '../school-quote-rollout.css',
    '../philippines-local-fee-table.css',
    '../../../components/school-group-quote.css',
    './pines-school-detail.component.css',
  ],
})
export class PinesSchoolDetailComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly schoolService = inject(SchoolService);
  private readonly exchangeRateService = inject(ExchangeRateService);
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
    'ielts-intensive',
    'ielts-guarantee-8-weeks-5-5-6-0',
    'ielts-guarantee-8-weeks-6-5-7-0',
    'ielts-guarantee-12-weeks-5-5-6-0',
    'ielts-guarantee-12-weeks-6-5-7-0',
  ];
  private readonly roomFeeOrder = [
    'main-single-a', 'main-single-b', 'main-single-c', 'main-twin-a', 'main-twin-b', 'main-family-2-3', 'main-quad', 'main-5b-solo', 'main-sextuple',
    'ielts-single-a', 'ielts-single-b', 'ielts-single-c', 'ielts-twin-a', 'ielts-twin-b', 'ielts-family-2-3', 'ielts-quad', 'ielts-5b-solo', 'ielts-sextuple',
  ];

  readonly galleryCategories: GalleryCategory[] = ['全部', '校园', '教室', '住宿', '餐厅', '设施'];
  selectedGalleryCategory: GalleryCategory = '全部';
  registrationFee = 100;
  readonly sidaDiscountRate = 0.95;
  readonly offSeasonDiscountPerFourWeeks = 150;
  readonly twelveWeekDiscount = 100;
  readonly longStayMinimumWeeks = 16;
  readonly longStayBaseDiscount = 100;
  readonly longStayIncrementWeeks = 2;
  readonly longStayIncrementDiscount = 25;
  seasonalFeePerWeek = 40;
  readonly peakSeasonRanges = [
    { label: '2026旺季', start: '2026-06-28', end: '2026-08-22' },
    { label: '2027旺季（按2026年8周档期推算）', start: '2027-06-27', end: '2027-08-21' },
  ] as const;
  usdToCny = 7.2;
  phpPerCny = 9;
  exchangeRateDate = '';
  usingLiveExchangeRate = false;
  quoteCalculated = false;
  roomAvailabilityLoading = false;
  roomAvailabilityError = '';
  roomAvailability: PinesRoomAvailabilityResponse | null = null;
  selectedAvailabilityCampusCode = 'MAIN';
  selectedAvailabilityDate = '';
  selectedAvailabilityGender: PinesStudentGender = 'male';
  readonly availabilityWeekOptions = [4, 8, 12, 16, 20];
  selectedAvailabilityWeeks = 12;
  selectedPreferredRoom = '';
  stayOptionsLoading = false;
  stayOptionsError = '';
  stayOptions: PinesStayAvailabilityResponse | null = null;
  roomPlanLoading = false;
  roomPlanError = '';
  roomPlans: PinesRoomPlan[] = [];

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
    { label: '住宿房型', value: '主校区与雅思校区的房型及价格相同；可选单人房、双人房、四人房、5B Solo、六人房及亲子房' },
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
    { id: 'light-esl-4', name: 'Light ESL 4', tuition: 850, suitable: '主校区｜4节一对一' },
    { id: 'power-speaking', name: 'Power Speaking', tuition: 930, suitable: '主校区｜4节一对一 + 4节小组课' },
    { id: 'intensive-esl', name: 'Intensive ESL', tuition: 1020, suitable: '主校区｜5节一对一 + 2节小组课' },
    { id: 'power-esl-5', name: 'Power ESL 5', tuition: 980, suitable: '主校区｜5节一对一' },
    { id: 'power-esl-7', name: 'Power ESL 7', tuition: 1220, suitable: '主校区｜7节一对一' },
    { id: 'toeic-toeic-speaking', name: 'TOEIC / TOEIC Speaking', tuition: 980, suitable: '主校区｜4节一对一 + 4节小组课 + 选修课' },
    { id: 'business-english-practical', name: 'Business English Practical', tuition: 1080, suitable: '主校区｜初中级：4节一对一 + 3节小组课' },
    { id: 'business-english-executive', name: 'Business English Executive', tuition: 1080, suitable: '主校区｜中高级：5节一对一' },
    { id: 'parents-course', name: 'Family Junior 家长课程', tuition: 750, suitable: '主校区｜3节一对一 + 2节选修课' },
    { id: 'junior-family-course', name: 'Family Junior 青少年课程', tuition: 1500, suitable: '主校区｜5节一对一 + 2节小组课 + 2节选修课' },
    { id: 'pre-ielts', name: 'Pre-IELTS', tuition: 1050, suitable: '雅思校区｜4节一对一 + 4节小组课' },
    { id: 'ielts-regular', name: 'IELTS', tuition: 1100, suitable: '雅思校区｜4节一对一 + 3节小组课' },
    { id: 'ielts-intensive', name: 'IELTS Intensive', tuition: 1200, suitable: '雅思校区｜6节一对一' },
    { id: 'ielts-guarantee-8-weeks-5-5-6-0', name: 'IELTS 保证班8周（5.5/6.0）', tuition: 1450, suitable: '雅思校区｜5节一对一 + 2节小组课；8周起报' },
    { id: 'ielts-guarantee-8-weeks-6-5-7-0', name: 'IELTS 保证班8周（6.5/7.0）', tuition: 1450, suitable: '雅思校区｜6节一对一；8周起报' },
    { id: 'ielts-guarantee-12-weeks-5-5-6-0', name: 'IELTS 保证班12周（5.5/6.0）', tuition: 1350, suitable: '雅思校区｜5节一对一 + 2节小组课；12周起报' },
    { id: 'ielts-guarantee-12-weeks-6-5-7-0', name: 'IELTS 保证班12周（6.5/7.0）', tuition: 1350, suitable: '雅思校区｜6节一对一；12周起报' },
  ];

  roomFees: RoomFee[] = [
    { id: 'main-single-a', name: '主校区单人房A', fee: 1250, note: '主校区标准单人房' },
    { id: 'main-single-b', name: '主校区单人房B', fee: 1150, note: '套间房型；两房共用客厅，B房内有独立卫生间' },
    { id: 'main-single-c', name: '主校区单人房C', fee: 970, note: '主校区单人房入门选择' },
    { id: 'main-twin-a', name: '主校区双人房A', fee: 870, note: '双人房选择' },
    { id: 'main-twin-b', name: '主校区双人房B', fee: 840, note: '双人房选择' },
    { id: 'main-family-2-3', name: '主校区亲子2–3人房', fee: 780, note: '双人间／加床；价格按每位学生计算' },
    { id: 'main-quad', name: '主校区四人房（上下床）', fee: 700, note: '主校区多人房' },
    { id: 'main-5b-solo', name: '主校区5B Solo', fee: 650, note: '舒适多人房，需确认空房' },
    { id: 'main-sextuple', name: '主校区六人房（上下床）', fee: 570, note: '主校区预算房型' },
    { id: 'ielts-single-a', name: '雅思校区单人房A', fee: 1250, note: '主校区标准单人房' },
    { id: 'ielts-single-b', name: '雅思校区单人房B', fee: 1150, note: '套间房型；两房共用客厅，B房内有独立卫生间' },
    { id: 'ielts-single-c', name: '雅思校区单人房C', fee: 970, note: '主校区单人房入门选择' },
    { id: 'ielts-twin-a', name: '雅思校区双人房A', fee: 870, note: '双人房选择' },
    { id: 'ielts-twin-b', name: '雅思校区双人房B', fee: 840, note: '双人房选择' },
    { id: 'ielts-family-2-3', name: '雅思校区亲子2–3人房', fee: 780, note: '双人间／加床；价格按每位学生计算' },
    { id: 'ielts-quad', name: '雅思校区四人房（上下床）', fee: 700, note: '主校区多人房' },
    { id: 'ielts-5b-solo', name: '雅思校区5B Solo', fee: 650, note: '舒适多人房，需确认空房' },
    { id: 'ielts-sextuple', name: '雅思校区六人房（上下床）', fee: 570, note: '主校区预算房型' },
  ];

  get courseFeeGroups(): CampusCatalogGroup<CourseFee>[] {
    return [
      {
        code: 'main',
        title: '主校区 Main Campus',
        description: '综合英语、口语、TOEIC、商务英语及亲子课程',
        items: this.courseFees.filter((course) => this.campusCode(course.id) === 'main'),
      },
      {
        code: 'ielts',
        title: '雅思校区 IELTS Campus',
        description: 'Pre-IELTS、IELTS、IELTS Intensive及雅思保证班',
        items: this.courseFees.filter((course) => this.campusCode(course.id) === 'ielts'),
      },
    ];
  }

  get roomFeeGroups(): CampusCatalogGroup<RoomFee>[] {
    return [
      {
        code: 'main',
        title: '主校区 Main Campus',
        description: '主校区住宿，仅与主校区课程组合',
        items: this.roomFees.filter((room) => this.campusCode(room.id) === 'main'),
      },
      {
        code: 'ielts',
        title: '雅思校区 IELTS Campus',
        description: '雅思校区住宿，仅与雅思校区课程组合',
        items: this.roomFees.filter((room) => this.campusCode(room.id) === 'ielts'),
      },
    ];
  }

  catalogCourseDetails(value: string): string { return value.replace(/^(主校区|雅思校区)｜/u, ''); }
  catalogRoomName(value: string): string { return value.replace(/^(主校区|雅思校区)/u, ''); }

  readonly students: PinesStudentQuote[] = [new PinesStudentQuote(this)];
  quoteMode: 'single' | 'group' = 'single';
  private requestedStudentCount = 2;
  readonly localFeeIntro = '以下费用以比索计价，由学校及相关部门收取；校内预存款、房间押金和洗衣服务另列，不计入学杂费及人民币预估合计。';

  readonly schedule: ScheduleItem[] = [
    { time: '07:00 - 08:00', title: '早餐 / 可选晨间学习', text: 'Main Campus可按课程和EB PRO安排晨间学习或单词测试。' },
    { time: '08:10 - 12:00', title: '上午课程', text: '一对一、小团体、ESL或考试专项课程，具体按课程表安排。' },
    { time: '12:00 - 13:00', title: '午餐与短休', text: '校内用餐后整理学习资料，下午继续课程。' },
    { time: '13:00 - 17:05', title: '下午课程', text: '继续一对一、团体课、雅思口写或听读专项训练。' },
    { time: '17:05 - 19:00', title: '晚餐与休息', text: '是否外出、门禁和自习安排需按校区与管理模式确认。' },
    { time: '19:00 - 22:00', title: '选修 / EB PRO / 监督晚自习', text: '雅思保证班和强化项目通常对晚自习、模考和出勤要求更严格。' },
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
    { question: '页面上的报价包含全部费用吗？', answer: '不包含全部。学校付款部分显示课程、住宿、附加费和优惠；到校后学杂费另列SSP、SSP-E Card、ACR-I Card、签证续签、水电和学生证，可选接机也会按当前选择计入。校内预存款、房间押金和洗衣服务需另行准备，不计入学杂费合计。' },
    { question: 'PINES雅思保证班有什么要求？', answer: '官方资料列出8或12周、5.5到7.0目标分数、入学分数门槛、每周六模考、95%出勤、100%参加模考等规则，报名时需按目标分数逐项确认。' },
    { question: '思达会协助签证和入境吗？', answer: '会。通过思达报名PINES，思达顾问会免费协助菲律宾入境及签证相关手续，并在出发前发送行前清单和费用提醒。' },
  ];
  readonly sideNav: SideNavItem[] = [
    { label: '学校环境', target: 'gallery', icon: 'image' },
    { label: '课程与费用', target: 'course-fees', icon: 'menu_book' },
    { label: '费用快速报价', target: 'quote', icon: 'calculate' },
    { label: '实时房态', target: 'room-availability', icon: 'event_available' },
    { label: '到校费用', target: 'local-fees', icon: 'payments' },
    { label: '报名流程', target: 'service-process', icon: 'task_alt' },
    { label: '常见问题', target: 'faq', icon: 'help' },
  ];
  readonly mobileAnchors: SideNavItem[] = [
    { label: '概览', target: 'top', icon: 'dashboard' },
    { label: '环境', target: 'gallery', icon: 'image' },
    { label: '课程', target: 'courses', icon: 'menu_book' },
    { label: '费用', target: 'quote', icon: 'calculate' },
    { label: '房态', target: 'room-availability', icon: 'event_available' },
    { label: '服务', target: 'service-process', icon: 'support_agent' },
    { label: 'FAQ', target: 'faq', icon: 'help' },
  ];

  ngOnInit(): void {
    this.loadPricingFromDatabase();
    this.loadExchangeRate();
    this.loadRoomAvailability();
  }

  loadRoomAvailability(forceRefresh = false): void {
    this.roomAvailabilityLoading = true;
    this.roomAvailabilityError = '';
    const url = forceRefresh ? '/pines-room-availability?refresh=true' : '/pines-room-availability';
    this.http.get<PinesRoomAvailabilityResponse>(url).pipe(
      catchError(() => {
        this.roomAvailabilityLoading = false;
        this.roomAvailabilityError = '学校公开房态暂时无法读取，请稍后再试或联系顾问确认。';
        return EMPTY;
      }),
    ).subscribe((availability) => {
      this.roomAvailability = availability;
      this.roomAvailabilityLoading = false;
      const currentCampus = availability.campuses.find((campus) => campus.code === this.selectedAvailabilityCampusCode) ?? availability.campuses[0];
      this.selectedAvailabilityCampusCode = currentCampus?.code ?? '';
      this.selectedAvailabilityDate = currentCampus?.dates[0]?.date ?? '';
      if (availability.isCached) {
        this.resetStayOptions();
      } else {
        this.loadStayOptions();
      }
    });
  }

  selectAvailabilityCampus(code: string): void {
    this.selectedAvailabilityCampusCode = code;
    this.selectedAvailabilityDate = this.selectedAvailabilityCampus?.dates[0]?.date ?? '';
    this.selectedPreferredRoom = '';
    if (this.roomAvailability?.isCached) {
      this.resetStayOptions();
    } else {
      this.loadStayOptions();
    }
  }

  onAvailabilityDateChange(): void {
    if (this.roomAvailability?.isCached) {
      this.resetStayOptions();
    } else {
      this.loadStayOptions();
    }
  }

  loadStayOptions(): void {
    if (this.roomAvailability?.isCached) {
      this.resetStayOptions();
      return;
    }
    if (!this.selectedAvailabilityCampusCode || !this.selectedAvailabilityDate) return;
    this.stayOptionsLoading = true;
    this.stayOptionsError = '';
    this.roomPlans = [];
    this.roomPlanError = '';
    this.getStayOptions(this.selectedAvailabilityCampusCode, this.selectedAvailabilityDate).pipe(
      catchError(() => {
        this.stayOptionsLoading = false;
        this.stayOptionsError = '连续住宿周期暂时无法读取，请稍后重试。';
        return EMPTY;
      }),
    ).subscribe((options) => {
      this.stayOptions = options;
      this.stayOptionsLoading = false;
      if (!options.rooms.some((room) => room.name === this.selectedPreferredRoom)) {
        this.selectedPreferredRoom = options.rooms.find((room) => /6B|六人/iu.test(room.name))?.name ?? options.rooms[0]?.name ?? '';
      }
    });
  }

  private resetStayOptions(): void {
    this.stayOptions = null;
    this.stayOptionsLoading = false;
    this.stayOptionsError = '';
    this.selectedPreferredRoom = '';
    this.roomPlans = [];
    this.roomPlanError = '';
  }

  generateRoomPlan(): void {
    const campusDates = this.selectedAvailabilityCampus?.dates.map((row) => row.date) ?? [];
    const start = this.parseDate(this.selectedAvailabilityDate);
    if (!start || !this.selectedAvailabilityCampusCode) return;
    const planDates = campusDates.filter((date) => {
      const value = this.parseDate(date);
      if (!value) return false;
      const weeksFromStart = Math.round((value.getTime() - start.getTime()) / 604800000);
      return weeksFromStart >= 0 && weeksFromStart < this.selectedAvailabilityWeeks && weeksFromStart % 2 === 0;
    });
    if (!planDates.length) return;

    this.roomPlanLoading = true;
    this.roomPlanError = '';
    const requests = planDates.map((date) =>
      date === this.stayOptions?.startDate
        ? this.getStayOptions(this.selectedAvailabilityCampusCode, date, this.stayOptions)
        : this.getStayOptions(this.selectedAvailabilityCampusCode, date));
    forkJoin(requests).pipe(
      catchError(() => {
        this.roomPlanLoading = false;
        this.roomPlanError = '学校房态正在变化，暂时无法完成分段住宿计算，请稍后重试。';
        return EMPTY;
      }),
    ).subscribe((responses) => {
      this.roomPlanLoading = false;
      const stablePlan = this.buildRoomPlan(responses, 'stable');
      const preferredPlan = this.buildRoomPlan(responses, 'preferred');
      this.roomPlans = [stablePlan, preferredPlan].filter((plan, index, all): plan is PinesRoomPlan =>
        !!plan && all.findIndex((item) => item && this.planKey(item) === this.planKey(plan)) === index);
      if (!this.roomPlans.length) {
        this.roomPlanError = `当前公开房态暂时找不到覆盖${this.selectedAvailabilityWeeks}周的完整组合，建议调整入学日期或联系顾问向学校人工确认。`;
      }
    });
  }

  get selectedAvailabilityCampus(): PinesRoomAvailabilityCampus | null {
    return this.roomAvailability?.campuses.find((campus) => campus.code === this.selectedAvailabilityCampusCode) ?? null;
  }

  get selectedAvailabilityRow(): PinesRoomAvailabilityDate | null {
    return this.selectedAvailabilityCampus?.dates.find((row) => row.date === this.selectedAvailabilityDate) ?? null;
  }

  get availabilityLastDate(): string {
    const dates = this.selectedAvailabilityCampus?.dates ?? [];
    return dates[dates.length - 1]?.date ?? '';
  }

  get selectedGenderLabel(): string { return this.selectedAvailabilityGender === 'male' ? '男生' : '女生'; }

  roomGenderAvailability(room: PinesRoomAvailabilityRoom, gender = this.selectedAvailabilityGender): PinesGenderAvailability {
    return room[gender];
  }

  roomAvailabilityStatusText(availability: PinesGenderAvailability): string {
    switch (availability.status) {
      case 'open': return '可报名（学校未公开数量）';
      case 'limited': return availability.vacancies === null ? '可报名，名额较少' : `可报名 · 剩余 ${availability.vacancies} 个名额`;
      case 'stay-only': return '不可从当天入住（仅可续住）';
      default: return '不可报名';
    }
  }

  selectAvailabilityDate(date: string): void {
    if (date === this.selectedAvailabilityDate) return;
    this.selectedAvailabilityDate = date;
    this.onAvailabilityDateChange();
  }

  bookableRooms(row: PinesRoomAvailabilityDate | null, gender: PinesStudentGender = this.selectedAvailabilityGender): PinesRoomAvailabilityRoom[] {
    return row?.rooms.filter((room) => ['open', 'limited'].includes(this.roomGenderAvailability(room, gender).status)) ?? [];
  }

  stayOnlyRooms(row: PinesRoomAvailabilityDate | null, gender: PinesStudentGender = this.selectedAvailabilityGender): PinesRoomAvailabilityRoom[] {
    return row?.rooms.filter((room) => this.roomGenderAvailability(room, gender).status === 'stay-only') ?? [];
  }

  closedRooms(row: PinesRoomAvailabilityDate | null, gender: PinesStudentGender = this.selectedAvailabilityGender): PinesRoomAvailabilityRoom[] {
    return row?.rooms.filter((room) => this.roomGenderAvailability(room, gender).status === 'closed') ?? [];
  }

  dateAvailabilityText(row: PinesRoomAvailabilityDate, gender: PinesStudentGender): string {
    const rooms = this.bookableRooms(row, gender);
    if (!rooms.length) return '暂无可报名房型';
    const knownVacancies = this.knownVacancyTotal(row, gender);
    return knownVacancies > 0 ? `${rooms.length}种可报 · 至少${knownVacancies}个名额` : `${rooms.length}种房型可报名`;
  }

  knownVacancyTotal(row: PinesRoomAvailabilityDate | null, gender: PinesStudentGender = this.selectedAvailabilityGender): number {
    return this.bookableRooms(row, gender).reduce((total, room) => total + (this.roomGenderAvailability(room, gender).vacancies ?? 0), 0);
  }

  roomVacancyBadgeText(room: PinesRoomAvailabilityRoom): string {
    const availability = this.roomGenderAvailability(room);
    if (availability.vacancies !== null) return `仅剩 ${availability.vacancies} 个名额`;
    return availability.status === 'limited' ? '名额紧张，数量未公开' : '可报名，数量未公开';
  }

  get selectedDateBookableRooms(): PinesRoomAvailabilityRoom[] { return this.bookableRooms(this.selectedAvailabilityRow); }
  get selectedDateStayOnlyRooms(): PinesRoomAvailabilityRoom[] { return this.stayOnlyRooms(this.selectedAvailabilityRow); }
  get selectedDateClosedRooms(): PinesRoomAvailabilityRoom[] { return this.closedRooms(this.selectedAvailabilityRow); }
  get nextAvailableDates(): PinesRoomAvailabilityDate[] {
    const dates = this.selectedAvailabilityCampus?.dates ?? [];
    const selectedIndex = dates.findIndex((row) => row.date === this.selectedAvailabilityDate);
    return dates.slice(Math.max(0, selectedIndex + 1)).filter((row) => this.bookableRooms(row).length > 0).slice(0, 3);
  }

  formatAvailabilityRoomName(name: string): string {
    const genderSuffix = /\bFemale\b|女生/iu.test(name) ? '（女生）' : /\bMale\b|男生/iu.test(name) ? '（男生）' : '';
    return name
      .replace(/\s*(Male|Female|男生|女生)\s*$/iu, '')
      .replace(/Single\s*A\s*\(2\s*beds?\)/iu, '单人房A（双床）')
      .replace(/Single\s*A/iu, '单人房A')
      .replace(/Single\s*B/iu, '单人房B')
      .replace(/Single\s*C/iu, '单人房C')
      .replace(/Twin\s*A/iu, '双人房A')
      .replace(/Twin\s*B/iu, '双人房B')
      .replace(/5B\s*Solo/iu, '5B Solo房')
      .replace(/^3B$/iu, '三人房')
      .replace(/^4B$/iu, '四人房')
      .replace(/^6B$/iu, '六人房')
      + genderSuffix;
  }

  get preferredStayRoom(): PinesStayRoom | null {
    return this.stayOptions?.rooms.find((room) => room.name === this.selectedPreferredRoom) ?? null;
  }

  stayRoomByName(name: string): PinesStayRoom | null {
    return this.stayOptions?.rooms.find((room) => room.name === name) ?? null;
  }

  get sameRoomOptions(): PinesStayRoom[] {
    if (!this.stayOptions) return [];
    return this.stayOptions.rooms
      .filter((room) => this.stayPeriod(room, this.selectedAvailabilityWeeks)?.available)
      .sort((a, b) => this.roomPreferenceRank(a.name) - this.roomPreferenceRank(b.name));
  }

  get preferredRoomTargetPeriod(): PinesStayPeriod | null {
    return this.preferredStayRoom ? this.stayPeriod(this.preferredStayRoom, this.selectedAvailabilityWeeks) : null;
  }

  get preferredRoomAvailableDurations(): PinesStayPeriod[] {
    if (!this.preferredStayRoom) return [];
    return this.genderStayPeriods(this.preferredStayRoom).filter((period) => period.available && period.weeks <= this.selectedAvailabilityWeeks);
  }

  stayPeriod(room: PinesStayRoom, weeks: number): PinesStayPeriod | null {
    return this.genderStayPeriods(room).find((period) => period.weeks === weeks) ?? null;
  }

  genderStayPeriods(room: PinesStayRoom): PinesStayPeriod[] {
    return room[this.selectedAvailabilityGender];
  }

  stayDurationSummary(room: PinesStayRoom): string {
    const availableWeeks = this.genderStayPeriods(room)
      .filter((period) => period.available && this.availabilityWeekOptions.includes(period.weeks))
      .map((period) => period.weeks);
    return availableWeeks.length ? `${availableWeeks.join('、')}周` : '暂无完整4周周期';
  }

  stayVacancyText(period: PinesStayPeriod | null): string {
    if (!period?.available) return '不可连续入住';
    return period.vacancies === null ? '可申请，名额未公开' : `剩余 ${period.vacancies} 个名额`;
  }

  formatPlanDate(value: string): string {
    const date = this.parseDate(value);
    if (!date) return value;
    return new Intl.DateTimeFormat('zh-CN', { month: 'numeric', day: 'numeric' }).format(date);
  }

  formatAvailabilityDate(value: string): string {
    const date = this.parseDate(value);
    if (!date) return value;
    return new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' }).format(date);
  }

  get roomAvailabilityUpdatedText(): string {
    if (!this.roomAvailability?.updatedAt) return '';
    const date = new Date(this.roomAvailability.updatedAt);
    if (Number.isNaN(date.getTime())) return '';
    return new Intl.DateTimeFormat('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).format(date);
  }

  private getStayOptions(campus: string, date: string, cached?: PinesStayAvailabilityResponse) {
    if (cached) return of(cached);
    const url = `/pines-room-availability/stay-options?campus=${encodeURIComponent(campus)}&startDate=${encodeURIComponent(date)}`;
    return this.http.get<PinesStayAvailabilityResponse>(url);
  }

  private buildRoomPlan(responses: PinesStayAvailabilityResponse[], strategy: 'stable' | 'preferred'): PinesRoomPlan | null {
    const start = this.parseDate(this.selectedAvailabilityDate);
    if (!start) return null;
    const byOffset = new Map<number, PinesStayAvailabilityResponse>();
    responses.forEach((response) => {
      const date = this.parseDate(response.startDate);
      if (!date) return;
      byOffset.set(Math.round((date.getTime() - start.getTime()) / 604800000), response);
    });

    const memo = new Map<string, { cost: number; segments: PinesRoomPlanSegment[] } | null>();
    const search = (offset: number, previousRoom: string): { cost: number; segments: PinesRoomPlanSegment[] } | null => {
      if (offset === this.selectedAvailabilityWeeks) return { cost: 0, segments: [] };
      const key = `${offset}|${previousRoom}`;
      if (memo.has(key)) return memo.get(key) ?? null;
      const response = byOffset.get(offset);
      if (!response) { memo.set(key, null); return null; }
      let best: { cost: number; segments: PinesRoomPlanSegment[] } | null = null;
      for (const room of response.rooms) {
        const periods = room[this.selectedAvailabilityGender];
        for (const period of periods) {
          if (!period.available || period.weeks <= 0 || offset + period.weeks > this.selectedAvailabilityWeeks) continue;
          const next = search(offset + period.weeks, room.name);
          if (!next) continue;
          const changed = previousRoom.length > 0 && previousRoom !== room.name;
          const rank = this.roomPreferenceRank(room.name);
          const segmentCost = strategy === 'stable'
            ? 1000 + (changed ? 700 : 0) + rank * period.weeks
            : 40 + (changed ? 80 : 0) + rank * period.weeks * 100;
          const end = new Date(start);
          end.setDate(start.getDate() + (offset + period.weeks) * 7);
          const segment: PinesRoomPlanSegment = {
            room: room.name,
            startDate: response.startDate,
            endDate: end.toISOString().slice(0, 10),
            weeks: period.weeks,
            vacancies: period.vacancies,
          };
          const candidate = { cost: segmentCost + next.cost, segments: [segment, ...next.segments] };
          if (!best || candidate.cost < best.cost) best = candidate;
        }
      }
      memo.set(key, best);
      return best;
    };

    const result = search(0, '');
    if (!result) return null;
    return {
      title: strategy === 'stable' ? '稳定优先方案' : '首选房型优先方案',
      description: strategy === 'stable' ? '优先减少换房次数，再尽量接近首选房型。' : '优先接近首选房型，必要时接受分段换房。',
      segments: result.segments,
    };
  }

  private roomPreferenceRank(roomName: string): number {
    const preferredCapacity = this.roomCapacity(this.selectedPreferredRoom);
    const capacity = this.roomCapacity(roomName);
    if (roomName === this.selectedPreferredRoom) return 0;
    if (preferredCapacity && capacity) return Math.abs(preferredCapacity - capacity) + 1;
    return 8;
  }

  private roomCapacity(roomName: string): number | null {
    if (/single|单人/iu.test(roomName)) return 1;
    if (/twin|双人/iu.test(roomName)) return 2;
    const match = roomName.match(/([3-6])\s*B|([3-6])人/iu);
    return match ? Number(match[1] ?? match[2]) : null;
  }

  private planKey(plan: PinesRoomPlan): string {
    return plan.segments.map((segment) => `${segment.room}:${segment.startDate}:${segment.weeks}`).join('|');
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
      .map((lesson) => {
        const id = this.createCourseId(lesson.name);
        const verifiedSchedule = this.courseFees.find((course) => course.id === id)?.suitable;
        return {
          id,
          name: lesson.name,
          tuition: lesson.price,
          suitable: verifiedSchedule || lesson.description || lesson.note || '请联系顾问确认课程安排',
        };
      })
      .sort((a, b) => this.orderIndex(this.courseFeeOrder, a.id) - this.orderIndex(this.courseFeeOrder, b.id));
    if (this.courseFeeOrder.every((id) => databaseCourseFees.some((course) => course.id === id))) {
      this.courseFees = databaseCourseFees.filter((course) => this.courseFeeOrder.includes(course.id));
      if (!this.courseFees.some((course) => course.id === this.selectedCourseId)) this.selectedCourseId = this.courseFees.find((course) => course.id === 'light-esl-4')?.id ?? this.courseFees[0].id;
    }

    const databaseRoomFees = rooms
      .filter((room) => room.week === 4)
      .map((room) => {
        const id = this.createRoomId(room.name);
        return { id, name: room.name, fee: room.price, note: this.roomNote(id, room.description) };
      })
      .sort((a, b) => this.orderIndex(this.roomFeeOrder, a.id) - this.orderIndex(this.roomFeeOrder, b.id));
    if (this.roomFeeOrder.every((id) => databaseRoomFees.some((room) => room.id === id))) {
      this.roomFees = databaseRoomFees.filter((room) => this.roomFeeOrder.includes(room.id));
      if (!this.roomFees.some((room) => room.id === this.selectedRoomId)) this.selectedRoomId = this.roomFees.find((room) => room.id === 'main-sextuple')?.id ?? this.roomFees[0].id;
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
  get studentCount() { return this.requestedStudentCount; }
  set studentCount(value: number) {
    this.requestedStudentCount = value;
    if (Number.isInteger(value) && value >= 2 && value <= 20) {
      while (this.students.length < value) this.students.push(new PinesStudentQuote(this));
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
  get selectedCourse(): CourseFee { return this.courseFees.find((course) => course.id === this.selectedCourseId) ?? this.courseFees[0]; }
  get selectedCourseCampus(): PinesCampusCode { return this.campusCode(this.selectedCourseId); }
  get availableRoomFees(): RoomFee[] { return this.roomFees.filter((room) => room.id.startsWith(`${this.selectedCourseCampus}-`)); }
  get selectedRoom(): RoomFee { return this.availableRoomFees.find((room) => room.id === this.selectedRoomId) ?? this.availableRoomFees[0] ?? this.roomFees[0]; }
  get selectedWeekMultiplier(): number { return pinesPriceMultiplier(this.quotePlan.courses[0].weeks); }
  get tuitionForSelectedWeeks(): number { return this.students[0].tuition; }
  get roomFeeForSelectedWeeks(): number { return this.students[0].accommodation; }
  get peakSeasonWeeks(): number { return this.activeStudents.reduce((sum, student) => sum + student.peakWeeks, 0); }
  get seasonalSurcharge(): number { return this.activeStudents.reduce((sum, student) => sum + student.seasonalSurcharge, 0); }
  get registrationDiscountAmount(): number { return this.activeStudents.reduce((sum, student) => sum + student.registrationDiscount, 0); }
  get sidaDiscountAmount(): number { return this.activeStudents.reduce((sum, student) => sum + student.sidaDiscount, 0); }
  get offSeasonDiscountAmount(): number { return this.activeStudents.reduce((sum, student) => sum + student.offSeasonDiscount, 0); }
  get twelveWeekDiscountAmount(): number { return this.activeStudents.reduce((sum, student) => sum + student.twelveWeekDiscount, 0); }
  get longStayDiscountAmount(): number { return this.activeStudents.reduce((sum, student) => sum + student.longStayDiscount, 0); }
  get totalDiscountAmount(): number {
    return this.registrationDiscountAmount + this.offSeasonDiscountAmount + this.twelveWeekDiscountAmount + this.longStayDiscountAmount + this.sidaDiscountAmount;
  }
  get quoteBeforeDiscounts(): number {
    return this.activeStudents.reduce((sum, student) => sum + student.registration + student.tuition + student.accommodation + student.seasonalSurcharge, 0);
  }
  get quoteUsd(): number { return this.activeStudents.reduce((sum, student) => sum + student.quoteUsd, 0); }
  get quoteUsdText(): string { return `${this.formatUsd(this.quoteUsd)} 美元`; }
  get quoteCnyText(): string { return `人民币预计金额：约 ${Math.round(this.quoteUsd * this.usdToCny).toLocaleString('zh-CN')} 元`; }
  get exchangeRateSummary(): string {
    return `参考汇率：1美元 ≈ ${this.usdToCny.toLocaleString('zh-CN', { maximumFractionDigits: 6 })}元人民币；1元人民币 ≈ ${this.phpPerCny.toLocaleString('zh-CN', { maximumFractionDigits: 6 })}比索（${this.usingLiveExchangeRate && this.exchangeRateDate ? this.exchangeRateDate.replace(/-/g, '/') : '备用参考值'}）`;
  }
  get registrationNote(): string {
    return `一次性费用，100美元／人；所有通过思达报名的学生均免收，本次原价共${this.formatUsd(this.activeStudents.length * this.registrationFee)}美元。`;
  }
  get campusPlanPaymentItems(): QuoteImagePaymentItem[] {
    const entries = this.activeStudents.flatMap((student, studentIndex) =>
      student.quotePlan.paymentItems().map((item, rowIndex) => {
        const detailParts = (item.detailTitle ?? '').split('｜');
        const campus = detailParts.length > 1 ? detailParts[0] : (item.icon === '课' && (item.detailTitle ?? '').includes('IELTS') ? '雅思校区 IELTS Campus' : '主校区 Main Campus');
        const suffix = item.label.match(/\d+$/)?.[0] ?? '';
        const kindLabel = item.icon === '课' ? `课程名称${suffix}` : `住宿名称${suffix}`;
        return {
          campusRank: campus.startsWith('雅思校区') ? 1 : 0,
          studentIndex,
          kindRank: item.icon === '课' ? 0 : 1,
          rowIndex,
          item: {
            ...item,
            label: `${this.quoteMode === 'group' ? `学生${studentIndex + 1} · ` : ''}${campus} · ${kindLabel}`,
            detailTitle: detailParts.length > 1 ? detailParts.slice(1).join('｜') : item.detailTitle,
          },
        };
      }),
    );
    return entries
      .sort((a, b) => a.campusRank - b.campusRank || a.studentIndex - b.studentIndex || a.kindRank - b.kindRank || a.rowIndex - b.rowIndex)
      .map((entry) => entry.item);
  }
  get schoolPaymentItems(): QuoteImagePaymentItem[] {
    return [
      { icon: '注', label: '注册费', amount: `${this.formatUsd(this.activeStudents.length * this.registrationFee)} 美元`, note: this.registrationNote },
      ...this.campusPlanPaymentItems,
      ...groupPaymentLines(this.activeStudents, false),
    ];
  }
  get quoteError(): string {
    if (this.quoteMode === 'group' && (!Number.isInteger(this.studentCount) || this.studentCount < 2 || this.studentCount > 20)) return '多人报价人数请选择2–20人的整数。';
    const index = this.activeStudents.findIndex((student) => !!student.quoteError);
    return index < 0 ? '' : `${this.quoteMode === 'group' ? `学生${index + 1}：` : ''}${this.activeStudents[index].quoteError}`;
  }
  get quoteHeading(): string {
    if (this.quoteMode === 'single') return `PINES ${this.students[0].quotePlan.courseWeeks}周报价`;
    const weeks = [...new Set(this.activeStudents.map((student) => student.quotePlan.courseWeeks))];
    const weekLabel = weeks.length === 1 ? `${weeks[0]}` : weeks.join('/');
    return `PINES ${this.activeStudents.length}人${weekLabel}周报价`;
  }
  get quoteStartDate(): string {
    return this.activeStudents.map((student) => student.quotePlan.startDate).filter(Boolean).sort()[0] ?? this.selectedStartDate;
  }
  get estimatedLocalFees() { return groupLocalFees(this.activeStudents); }
  get estimatedLocalFeeTotal(): number { return this.estimatedLocalFees.reduce((sum, fee) => sum + fee.total, 0); }
  get estimatedLocalFeeCny(): number { return this.phpPerCny > 0 ? Math.round(this.estimatedLocalFeeTotal / this.phpPerCny) : 0; }
  get localFeeTotal(): number { return this.estimatedLocalFeeTotal; }
  get localFeeCnyText(): string { return `人民币预计金额：约 ${this.estimatedLocalFeeCny.toLocaleString('zh-CN')} 元`; }
  get optionalFeeItems() {
    const campusDepositQuantity = this.activeStudents.reduce((sum, student) => sum + student.campusDeposit.quantity, 0);
    const campusDepositTotal = this.activeStudents.reduce((sum, student) => sum + student.campusDeposit.total, 0);
    const roomDepositTotal = 4000 * this.activeStudents.length;
    const cny = (value: number) => `约人民币 ${Math.round(value / this.phpPerCny).toLocaleString('zh-CN')} 元`;
    return [
      {
        label: '校内预存款', amount: this.formatPhp(campusDepositTotal), cnyAmount: cny(campusDepositTotal),
        note: `4,000比索／4周 × ${this.formatFeeQuantity(campusDepositQuantity)}；用于教材、洗衣、复印、选修课和周末餐食等，按实际扣费；不计入学杂费及人民币预估合计。`,
      },
      {
        label: '房间押金（可退）', amount: this.formatPhp(roomDepositTotal), cnyAmount: cny(roomDepositTotal),
        note: `4,000比索／人${this.activeStudents.length > 1 ? ` × ${this.activeStudents.length}人` : ''}；无损坏且无欠费时按学校规定退还；不计入学杂费合计。`,
      },
      {
        label: '洗衣服务', amount: '1,200 比索参考', cnyAmount: cny(1200),
        note: '按实际使用，不计入学杂费合计；洗烘150比索／7kg，单洗或单烘100比索／7kg。',
      },
    ];
  }
  formatPhp(value: number): string { return `${Math.round(value).toLocaleString('en-US')} 比索`; }
  formatFeeQuantity(value: number): string { return value.toLocaleString('zh-CN', { maximumFractionDigits: 2 }); }

  get quoteImageData() {
    const paymentItems = [
      this.schoolPaymentItems[0],
      ...this.campusPlanPaymentItems,
      ...groupPaymentLines(this.activeStudents, true),
    ];
    const warnings = this.activeStudents.flatMap((student, index) => student.quotePlan.warning
      ? [`${this.quoteMode === 'group' ? `学生${index + 1}：` : ''}${student.quotePlan.warning}`]
      : []);
    const shortStayNotes = [...new Set(this.activeStudents.flatMap((student) => student.shortStayNotes))];
    const quote = buildPhilippinesDetailedQuote({
      schoolCode: 'PINES',
      schoolName: '菲律宾碧瑶PINES语言学校',
      filePrefix: 'PINES',
      heroSrc: '/assets/philippines/pines-campus-hero.jpg',
      weeks: this.selectedWeeks,
      startDate: this.quoteStartDate,
      usdToCny: this.usdToCny,
      totalUsd: this.quoteUsd,
      fullFeeDetails: true,
      localFeeTableLayout: 'web',
      paymentItems,
      localFeeItems: this.estimatedLocalFees.map((fee) => ({ label: fee.item, unit: fee.unitLabel, quantity: this.formatFeeQuantity(fee.quantity), amount: this.formatPhp(fee.total), note: fee.note })),
      localFeeTotal: this.estimatedLocalFeeTotal,
      localCurrencyName: '比索',
      localFeeCny: this.estimatedLocalFeeCny,
      localFeeNote: this.localFeeIntro,
      optionalFeeItems: this.optionalFeeItems,
      ruleNotes: [],
    });
    const result = applySchoolQuoteImageLayout({
      ...quote,
      importantNotes: [
        ...warnings,
        ...shortStayNotes,
        '4周以上按对应4周价格和实际周数等比例计算；每段课程及住宿最多24周。',
        '2026旺季为2026/06/28–08/22；2027旺季按相同8周档期推算为2027/06/27–08/21，开始均为周日、结束均为周六。',
        '固定优惠先扣减，课程费和住宿费的剩余金额再享思达95折；最终以学校价格、空房及优惠确认为准。',
      ],
    }, 'PINES', this.selectedWeeks, this.quoteStartDate, this.quoteUsd, this.usdToCny);
    return {
      ...result,
      headingText: this.quoteHeading,
      fileName: `${this.quoteHeading}-${this.quoteStartDate.replace(/-/g, '')}.png`,
      conversionRates: {
        usdToCny: this.usdToCny,
        phpPerCny: this.phpPerCny,
        date: this.usingLiveExchangeRate ? this.exchangeRateDate : undefined,
      },
    };
  }

  formatUsd(value: number): string { return value.toLocaleString('en-US', { minimumFractionDigits: Number.isInteger(value) ? 0 : 1, maximumFractionDigits: 1 }); }
  campusCode(id: string): PinesCampusCode { return id.includes('ielts') ? 'ielts' : 'main'; }
  private slugifyPriceKey(value: string): string { return value.toLowerCase().replace(/&/g, 'and').replace(/\//g, ' ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
  private orderIndex(order: string[], value: string): number { const index = order.indexOf(value); return index === -1 ? Number.MAX_SAFE_INTEGER : index; }
  private parseDate(value: string): Date | null { const date = new Date(`${value}T12:00:00`); return Number.isNaN(date.getTime()) ? null : date; }
  private createCourseId(name: string): string {
    if (/Family Junior.*家长|Parents Course/iu.test(name)) return 'parents-course';
    if (/Family Junior.*青少年|Junior Family Course/iu.test(name)) return 'junior-family-course';
    if (/IELTS.*保证班.*8.*5\.5|IELTS Guarantee 8 Weeks.*5\.5/iu.test(name)) return 'ielts-guarantee-8-weeks-5-5-6-0';
    if (/IELTS.*保证班.*8.*6\.5|IELTS Guarantee 8 Weeks.*6\.5/iu.test(name)) return 'ielts-guarantee-8-weeks-6-5-7-0';
    if (/IELTS.*保证班.*12.*5\.5|IELTS Guarantee 12 Weeks.*5\.5/iu.test(name)) return 'ielts-guarantee-12-weeks-5-5-6-0';
    if (/IELTS.*保证班.*12.*6\.5|IELTS Guarantee 12 Weeks.*6\.5/iu.test(name)) return 'ielts-guarantee-12-weeks-6-5-7-0';
    if (name === 'IELTS') return 'ielts-regular';
    return this.slugifyPriceKey(name);
  }
  private createRoomId(name: string): string {
    const campus = name.includes('雅思') || /IELTS/iu.test(name) ? 'ielts' : 'main';
    if (/亲子.*2.*3人/iu.test(name)) return `${campus}-family-2-3`;
    if (name.includes('六人')) return `${campus}-sextuple`;
    if (name.includes('5B') || name.includes('5人')) return `${campus}-5b-solo`;
    if (name.includes('四人')) return `${campus}-quad`;
    if (name.includes('三人')) return `${campus}-triple`;
    if (name.includes('双人房B')) return `${campus}-twin-b`;
    if (name.includes('双人房A')) return `${campus}-twin-a`;
    if (name.includes('双人')) return `${campus}-twin`;
    if (name.includes('单人房C')) return `${campus}-single-c`;
    if (name.includes('单人房B')) return `${campus}-single-b`;
    if (name.includes('单人房A')) return `${campus}-single-a`;
    return this.slugifyPriceKey(name);
  }
  private roomNote(_id: string, description?: string): string {
    return description || '请联系顾问确认空房';
  }
  private currencyCodeForDisplay(code?: string): string { return !code ? 'USD' : code.toUpperCase() === 'PESO' ? 'PHP' : code.toUpperCase(); }
  private formatCurrencyAmount(fee: SchoolFeeDTO): string { return `${this.currencyCodeForDisplay(fee.currencyCode)} ${fee.fee.toLocaleString('en-US', { minimumFractionDigits: Number.isInteger(fee.fee) ? 0 : 1, maximumFractionDigits: 1 })}`; }
  private cleanFeeDescription(description?: string): string { return description ? description.replace(/^到校支付费用；/, '').replace(/^前期支付费用；/, '') : '以学校现场收费为准'; }
}

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
import { QuoteImageDownloadButtonComponent, QuoteImagePaymentItem } from '../../../components/quote-image-download-button.component';

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
interface LocalFee { item: string; amount: string; note: string; quantity: number; total: number; excluded?: boolean; }
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
    './cpils-school-detail.component.css',
  ],
})
export class CpilsSchoolDetailComponent implements OnInit {
  private readonly schoolService = inject(SchoolService);
  private readonly exchangeRateService = inject(ExchangeRateService);
  private readonly pricingSchoolSearchName = 'CPILS';
  private readonly pricingSchoolNames = ['菲律宾宿务CPILS语言学校', 'CPILS'];
  private readonly courseFeeOrder = ['general-esl', 'general-esl-light', 'general-esl-plus', 'premier-sparta', 'toeic-course', 'toeic-guarantee', 'pre-ielts-course', 'ielts-course', 'ielts-guarantee-8-weeks', 'ielts-guarantee-12-weeks', 'toefl-course', 'business-english', 'power-speaking-and-modern-communication'];
  private readonly roomFeeOrder = ['regular-single', 'regular-twin', 'regular-triple', 'regular-quad', 'no-window-single', 'no-window-twin', 'premium-single', 'premium-twin', 'premium-triple', 'premium-quad'];

  readonly galleryCategories: GalleryCategory[] = ['全部', '校园', '教室', '住宿', '餐厅', '设施'];
  selectedGalleryCategory: GalleryCategory = '全部';
  registrationFee = 125;
  readonly sidaDiscountRate = 0.9;
  readonly offSeasonDiscountRate = 0.95;
  seasonalFeePerWeek = 40;
  usdToCny = 7.2;
  phpPerCny = 7.75;
  exchangeRateDate = '';
  exchangeRateLive = false;
  readonly weekOptions = [4, 8, 12, 16, 20, 24];
  readonly localFeeIntro = '以下费用以比索计价，数量随学习周数自动更新。费用由学校及相关部门收取，仅供准备现金时参考，最终以到校缴费为准。';
  readonly quotePlan = new SchoolQuotePlan('general-esl', 'regular-quad', '2026-09-06', this.weekOptions,
    kind => kind === 'course'
      ? this.courseFees.map(option => ({ id: option.id, name: option.name, details: option.suitable }))
      : this.roomFees.map(option => ({ id: option.id, name: option.name, details: '' })),
    (kind, row) => {
      if (kind === 'course') {
        const option = this.courseFees.find(option => option.id === row.optionId);
        return option ? option.tuition * (row.weeks / 4) : 0;
      }
      const option = this.roomFees.find(option => option.id === row.optionId);
      return option ? option.fee * (row.weeks / 4) : 0;
    });
  get selectedCourseId() { return this.quotePlan.courses[0].optionId; }
  set selectedCourseId(value: string) { this.quotePlan.courses[0].optionId = value; }
  get selectedRoomId() { return this.quotePlan.rooms[0].optionId; }
  set selectedRoomId(value: string) { this.quotePlan.rooms[0].optionId = value; }
  get selectedWeeks() { return this.quotePlan.courseWeeks; }
  set selectedWeeks(value: number) { this.quotePlan.courses[0].weeks = value; this.quotePlan.rooms[0].weeks = value; }
  get selectedStartDate() { return this.quotePlan.startDate; }
  set selectedStartDate(value: string) { this.quotePlan.courses[0].startDate = value; this.quotePlan.rooms[0].startDate = value; }
  selectedRegistrationDate = '2026-09-01';
  quoteCalculated = false;

  readonly quickInfo: QuickInfo[] = [
    { icon: 'apartment', label: '学校类型', value: '宿务老牌考试强化型', note: '2001年创立，宿务较早ESL学校之一' },
    { icon: 'groups', label: '适合人群', value: '成人 / 考试 / 亲子', note: '目标导向、可接受管理节奏的学生' },
    { icon: 'verified_user', label: '管理模式', value: '半斯巴达 / 斯巴达选择', note: '课程强度和校规需按项目确认' },
    { icon: 'school', label: '课程选项', value: 'ESL / 雅思 / 托业 / 托福', note: '另有商务、口语和亲子课程' },
    { icon: 'bed', label: '住宿房型', value: '单人 / 双人 / 三人 / 四人', note: '校内宿舍，Premium房型需另核' },
    { icon: 'workspace_premium', label: '考试资源', value: '雅思 / 托业官方资源', note: '官方资料列出雅思与托业考点资源' },
  ];

  readonly galleryImages: GalleryImage[] = [
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
    { question: 'CPILS优惠怎么计算？', answer: '课程费与住宿费先按思达9折计算；符合2026淡季条件时再享95折。无对外窗单/双人房每4周另减USD50，符合学习期覆盖条件时圣诞/新年再减USD75或150；注册费不打折。' },
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
  get selectedCourse(): CourseFee { return this.courseFees.find((course) => course.id === this.selectedCourseId) ?? this.courseFees[0]; }
  get selectedRoom(): RoomFee { return this.roomFees.find((room) => room.id === this.selectedRoomId) ?? this.roomFees[0]; }
  get tuitionForSelectedWeeks(): number { return this.quotePlan.total('course'); }
  get roomFeeForSelectedWeeks(): number { return this.quotePlan.total('room'); }
  get courseAndRoomBase(): number { return this.tuitionForSelectedWeeks + this.roomFeeForSelectedWeeks; }
  get sidaDiscountAmount(): number { return this.roundMoney(this.courseAndRoomBase * (1 - this.sidaDiscountRate)); }
  get afterSidaDiscount(): number { return this.courseAndRoomBase * this.sidaDiscountRate; }
  get isSummerBlackout(): boolean { return this.isDateBetween(this.selectedStartDate, '2026-06-01', '2026-08-26'); }
  private isOffSeasonRow(row: QuotePlanRow): boolean {
    return row.startDate.startsWith('2026-')
      && row.startDate <= '2026-12-27'
      && !this.isDateBetween(row.startDate, '2026-06-01', '2026-08-26');
  }
  get isOffSeasonEntry(): boolean { return [...this.quotePlan.courses, ...this.quotePlan.rooms].some(row => this.isOffSeasonRow(row)); }
  get offSeasonEligibleBase(): number {
    return [...this.quotePlan.courses, ...this.quotePlan.rooms]
      .filter(row => row.weeks >= 4 && this.isOffSeasonRow(row))
      .reduce((sum, row) => sum + this.quotePlan.price(this.quotePlan.courses.includes(row) ? 'course' : 'room', row) * this.sidaDiscountRate, 0);
  }
  get offSeasonEligible(): boolean { return this.offSeasonEligibleBase > 0; }
  get offSeasonDiscountAmount(): number { return this.roundMoney(this.offSeasonEligibleBase * (1 - this.offSeasonDiscountRate)); }
  get noWindowDiscountAmount(): number {
    return this.quotePlan.rooms
      .filter(row => this.isOffSeasonRow(row) && ['no-window-single', 'no-window-twin'].includes(row.optionId))
      .reduce((sum, row) => sum + Math.floor(row.weeks / 4) * 50, 0);
  }
  get noWindowDiscountEligible(): boolean { return this.noWindowDiscountAmount > 0; }
  get holidayDiscountAmount(): number {
    if (!this.isDateBetween(this.selectedRegistrationDate, '2026-06-29', '2026-12-31')) return 0;
    const studyEnd = this.studyEndDate;
    if (!studyEnd) return 0;
    if (this.quotePlan.covers('2026-12-21', '2027-01-01')) return 150;
    if (this.quotePlan.covers('2026-12-21', '2026-12-26')) return 75;
    return 0;
  }
  get holidayDiscountText(): string {
    if (!this.isDateBetween(this.selectedRegistrationDate, '2026-06-29', '2026-12-31')) return '注册日需在2026/06/29–12/31之间';
    if (this.holidayDiscountAmount === 150) return '学习期覆盖2026/12/21–2027/01/01，减150美元';
    if (this.holidayDiscountAmount === 75) return '学习期覆盖2026/12/21–12/26，减75美元';
    return '学习期未完整覆盖圣诞/新年指定日期';
  }
  get peakSeasonWeeks(): number { return this.quotePlan.overlapWeeks('2026-07-05', '2026-08-29', [...this.quotePlan.courses, ...this.quotePlan.rooms]); }
  get seasonalSurcharge(): number { return this.peakSeasonWeeks * this.seasonalFeePerWeek; }
  get quoteUsd(): number {
    return Math.max(0, this.roundMoney(this.registrationFee + this.afterSidaDiscount - this.offSeasonDiscountAmount + this.seasonalSurcharge - this.noWindowDiscountAmount - this.holidayDiscountAmount));
  }
  get quoteUsdText(): string { return `${this.formatUsd(this.quoteUsd)} 美元`; }
  get quoteCnyText(): string { const rounded = Math.round(this.quoteUsd * this.usdToCny); return `约 ${rounded.toLocaleString('zh-CN')} 元`; }
  get exchangeRateText(): string { return this.exchangeRateLive && this.exchangeRateDate ? `汇率日期 ${this.exchangeRateDate}` : '暂按备用汇率估算'; }
  get studyEndDate(): string { return this.quotePlan.endDate; }
  get examBenefitText(): string {
    return '雅思课程报名12周赠1次雅思官方考试；雅思保证班赠机考；托业课程/保证班4–7周赠1次，每增加4周再赠1次（最多6次）';
  }

  get localFeeFourWeekPeriods(): number { return Math.max(1, Math.ceil(this.quotePlan.roomWeeks / 4)); }
  get visaExtensionCount(): number { return Math.max(0, Math.ceil((this.quotePlan.stayWeeks - 4) / 4)); }
  get visaExtensionTotal(): number {
    if (this.quotePlan.stayWeeks <= 4) return 0;
    let total = 5130;
    if (this.quotePlan.stayWeeks > 8) total += 6400;
    if (this.quotePlan.stayWeeks > 12) total += 4440;
    if (this.quotePlan.stayWeeks > 16) total += 4440;
    if (this.quotePlan.stayWeeks > 20) total += 4440;
    return total;
  }
  get localFees(): LocalFee[] {
    const fourWeekPeriods = this.localFeeFourWeekPeriods;
    const acrQuantity = this.quotePlan.stayWeeks > 4 ? 1 : 0;
    return [
      { item: 'SSP特殊学习许可证', amount: '7,800 比索 / 次', quantity: 1, total: 7800, note: '移民局收取；按报名学习时长办理，续费及换校需重新办理' },
      { item: 'SSP I-CARD', amount: '4,000 比索 / 次', quantity: 1, total: 4000, note: '入学时与SSP同时办理，只收一次' },
      { item: 'ACR-I CARD 外国人身份证', amount: '4,000 比索 / 次', quantity: acrQuantity, total: 4000 * acrQuantity, note: '首次续签时办理，学校统一带队到移民局' },
      { item: '管理费', amount: '2,000 比索 / 4周', quantity: fourWeekPeriods, total: 2000 * fourWeekPeriods, note: '每4周2,000比索' },
      { item: '水费', amount: '800 比索 / 4周', quantity: fourWeekPeriods, total: 800 * fourWeekPeriods, note: '每4周800比索' },
      { item: '电费', amount: '2,000 比索 / 4周', quantity: fourWeekPeriods, total: 2000 * fourWeekPeriods, note: '预估每4周2,000比索；实际按用电量结算，参考22比索/kW' },
      { item: '续签费用', amount: '按学习周数阶梯计算', quantity: this.visaExtensionCount, total: this.visaExtensionTotal, note: this.visaExtensionCount === 0 ? '本次暂未计入续签费，实际依签证及停留天数，以移民局收费为准' : `首次5,130比索${this.visaExtensionCount > 1 ? '，第2次6,400比索' : ''}${this.visaExtensionCount > 2 ? '，其余每次4,440比索' : ''}；最终以移民局收费为准` },
      { item: '书本教材费', amount: '2,500 比索 / 4周', quantity: Math.ceil(this.selectedWeeks / 4), total: 2500 * Math.ceil(this.selectedWeeks / 4), note: '预估；不同课程教材不同，按实际购买结算' },
      { item: '学生证', amount: '100 比索 / 次', quantity: 1, total: 100, note: '含ID照片，一次性费用' },
      { item: '宿务麦克坦机场接机', amount: '1,000 比索 / 次', quantity: 1, total: 1000, note: '可选；可自行打车，不计入学杂费合计', excluded: true },
      { item: '宿舍押金', amount: '2,000 比索 / 次', quantity: 1, total: 2000, note: '无损坏及无额外扣费时，毕业退还', excluded: true },
      { item: '风扇/学生证预存', amount: '1,000 比索 / 次', quantity: 0, total: 0, note: '可选；资料备注含风扇租借200比索/4周及风扇押金500比索，未使用部分可退', excluded: true },
    ];
  }
  get includedLocalFees(): LocalFee[] { return this.localFees.filter((fee) => !fee.excluded); }
  get excludedLocalFees(): LocalFee[] { return this.localFees.filter((fee) => fee.excluded); }
  get localFeesTotal(): number { return this.localFees.filter((fee) => !fee.excluded).reduce((sum, fee) => sum + fee.total, 0); }
  get localFeesCnyText(): string { return `约 ${Math.round(this.localFeesTotal / this.phpPerCny).toLocaleString('zh-CN')} 元`; }

  get quoteImageData() {
    const base = this.baseQuoteImageData;
    return presentSchoolQuote({
      ...base,
      importantNotes: ['最终以学校价格、空房及优惠确认为准。'],
      totalNote: '人民币按参考汇率预估，最终以支付当日汇率为准',
    }, this.quotePlan, 'CPILS', this.quoteUsd, this.usdToCny);
  }

  private get baseQuoteImageData() {
    const includedFees = this.localFees.filter((fee) => !fee.excluded);
    const optionalFees = this.localFees.filter((fee) => fee.excluded);
    const paymentItems: QuoteImagePaymentItem[] = [
      { icon: '注', label: '注册费', amount: `${this.formatUsd(this.registrationFee)} 美元`, note: '一次性学校注册费，不参与折扣' },
      { icon: '课', label: '课程费', amount: `${this.formatUsd(this.tuitionForSelectedWeeks)} 美元`, note: `课程安排：${this.selectedCourse.suitable}` },
      { icon: '宿', label: '住宿费', amount: `${this.formatUsd(this.roomFeeForSelectedWeeks)} 美元`, note: `${this.selectedRoom.name}；4周单价×${this.selectedWeeks / 4}` },
      { icon: '折', label: '思达折扣', amount: `- ${this.formatUsd(this.sidaDiscountAmount)} 美元`, note: '课程费和住宿费9折', accent: true },
    ];
    if (this.offSeasonDiscountAmount > 0) {
      paymentItems.push({ icon: '淡', label: '淡季入学优惠', amount: `- ${this.formatUsd(this.offSeasonDiscountAmount)} 美元`, note: '思达9折后再享95折' });
    }
    if (this.noWindowDiscountAmount > 0) {
      paymentItems.push({ icon: '房', label: '无对外窗房优惠', amount: `- ${this.formatUsd(this.noWindowDiscountAmount)} 美元`, note: '无对外窗单人间/双人间每4周优惠50美元' });
    }
    if (this.holidayDiscountAmount > 0) {
      paymentItems.push({ icon: '节', label: '圣诞/新年优惠', amount: `- ${this.formatUsd(this.holidayDiscountAmount)} 美元`, note: this.holidayDiscountText });
    }
    if (this.seasonalSurcharge > 0) {
      paymentItems.push({ icon: '旺', label: '暑假附加费', amount: `${this.formatUsd(this.seasonalSurcharge)} 美元`, note: `暑假期间重叠${this.peakSeasonWeeks}周 × ${this.formatUsd(this.seasonalFeePerWeek)}美元/周` });
    }
    return buildPhilippinesDetailedQuote({
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
      localFeeItems: includedFees.map((fee) => ({ label: fee.item, unit: fee.amount, quantity: String(fee.quantity), amount: this.formatPhp(fee.total), note: fee.note })),
      localFeeTotal: this.localFeesTotal,
      localCurrencyName: '比索',
      localFeeCny: Math.round(this.localFeesTotal / this.phpPerCny),
      localFeeNote: this.localFeeIntro,
      optionalFeeItems: optionalFees.map((fee) => ({ label: fee.item, amount: fee.amount, note: fee.note })),
      ruleNotes: [
        '报价单仅列出当前选择实际产生的优惠和附加费；未适用项目不显示。',
        '优惠与附加费按预计报名日、预计入学日、房型及学习周数自动判断，最终以学校确认账单为准。',
      ],
    });
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

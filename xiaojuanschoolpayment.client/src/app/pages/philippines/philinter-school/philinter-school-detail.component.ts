import { CommonModule } from '@angular/common';
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
interface SidaPhilinterReason {
  number: string;
  title: string;
  text: string;
  image: string;
  alt: string;
}
interface SidaPhilinterTrustBadge { icon: string; label: string; }

@Component({
  selector: 'app-philinter-school-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule, QuoteImageDownloadButtonComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './philinter-school-detail.component.html',
  styleUrls: [
    '../cebu-school-detail-layout.css',
    '../cebu-school-detail-content.css',
    '../cebu-school-detail-responsive.css',
    '../ev-school/ev-school-detail.component.css',
    './philinter-school-detail.component.css',
  ],
})
export class PhilinterSchoolDetailComponent implements OnInit {
  private readonly schoolService = inject(SchoolService);
  private readonly exchangeRateService = inject(ExchangeRateService);
  private readonly pricingSchoolSearchName = 'Philinter';
  private readonly pricingSchoolNames = ['菲律宾宿务Philinter语言学校', 'Philinter Academy'];
  private readonly courseFeeOrder = ['light-esl', 'general-esl', 'intensive-esl', 'intensive-power-speaking', 'ielts-intensive', 'ielts-guarantee-8-weeks', 'ielts-guarantee-12-weeks', 'toeic-regular', 'toeic-guarantee-12-weeks', 'focus-industry', 'basic-business', 'advanced-business', 'primary-english-7-11-years', 'junior-esl-12-17-years', 'junior-ielts-12-17-years', 'speaking', 'junior-speaking'];
  private readonly roomFeeOrder = ['in-campus-triple', 'in-campus-twin', 'in-campus-single', 'azon-triple', 'azon-twin', 'azon-single'];
  private readonly shortTermRatios: Record<number, number> = { 1: 0.45, 2: 0.65, 3: 0.85 };

  readonly galleryCategories: GalleryCategory[] = ['全部', '校园', '教室', '住宿', '餐厅', '设施'];
  selectedGalleryCategory: GalleryCategory = '全部';
  registrationFee = 220;
  readonly sidaDiscountRate = 0.9;
  seasonalFeePerWeek = 40;
  usdToCny = 7.2;
  phpPerCny = 7.75;
  exchangeRateDate = '';
  exchangeRateLive = false;
  readonly weekOptions = [1, 2, 3, 4, 8, 12, 16, 20, 24];
  selectedCourseId = 'light-esl';
  selectedRoomId = 'in-campus-triple';
  selectedWeeks = 4;
  selectedStartDate = '2026-09-07';
  includeAirportPickup = true;
  quoteCalculated = false;

  readonly quickInfo: QuickInfo[] = [
    { icon: 'school', label: '学校类型', value: '宿务老牌半斯巴达学校', note: '2003年成立，官方定位为Cebu领先的Semi-Sparta ESL学校' },
    { icon: 'groups', label: '适合人群', value: '成人 / 口语 / IELTS / 青少年', note: '适合重视师资、学习风气和麦克坦位置的学生' },
    { icon: 'verified_user', label: '管理模式', value: '半斯巴达 / 斯巴达课程可选', note: 'General偏半斯巴达，Intensive/IELTS方向学习强度更高' },
    { icon: 'record_voice_over', label: '核心课程', value: 'ESL / IPS / IELTS / Business', note: '另有TOEIC、TOEFL、Primary、Junior和行业英文' },
    { icon: 'bed', label: '住宿类型', value: '校内宿舍 / 校外公寓', note: '校内单人、双人、三人；校外Azon Condo需确认接送和门禁' },
    { icon: 'flight_land', label: '位置特点', value: 'Lapu-Lapu / 近宿务机场', note: '适合重视抵达便利和麦克坦生活资源的学生' },
  ];

  readonly galleryImages: GalleryImage[] = [
    { category: '校园', title: 'Philinter校园楼体', description: '官方设施图片展示Philinter校内住宿与教学楼体。', src: 'assets/philinter/campus-main.jpeg' },
    { category: '校园', title: '校园泳池', description: '官方设施页介绍泳池位于宿舍与咖啡厅之间，可供学生课后放松。', src: 'assets/philinter/campus-pool.jpg' },
    { category: '校园', title: '学校大厅', description: '学校大厅是学生报到、公告和日常沟通的中心区域。', src: 'assets/philinter/lobby.png' },
    { category: '教室', title: '一对一/小班学习场景', description: 'Philinter课程强调个别化支持和进度追踪。', src: 'assets/philinter/one-on-one-room.jpg' },
    { category: '教室', title: '团体教室', description: '用于讨论、表达、演示和综合训练。', src: 'assets/philinter/study-hall.jpg' },
    { category: '教室', title: '讲座教室', description: '大型团体课、说明会和活动会用到的教学空间。', src: 'assets/philinter/group-classroom.png' },
    { category: '住宿', title: '校内单人房', description: '适合重视隐私和安静学习环境的学生。', src: 'assets/philinter/single-room.jpg' },
    { category: '住宿', title: '校内双人房', description: '预算与舒适度相对平衡，适合同伴同行。', src: 'assets/philinter/double-room.jpg' },
    { category: '住宿', title: '校内三人房', description: '默认报价参考房型，预算压力较低。', src: 'assets/philinter/triple-room.jpg' },
    { category: '住宿', title: '校外公寓参考', description: 'Azon Condo方向更偏生活品质，需确认接送、门禁和空房。', src: 'assets/philinter/condo-room.png' },
    { category: '餐厅', title: '学生咖啡厅', description: '官方设施页展示咖啡厅与泳池相连的休息空间。', src: 'assets/philinter/cafeteria-1.jpg' },
    { category: '餐厅', title: '餐厅与用餐空间', description: '三餐和学生交流的重要生活区域。', src: 'assets/philinter/cafeteria-2.jpg' },
    { category: '设施', title: '洗衣服务', description: '日常生活服务之一，具体规则以学校现场安排为准。', src: 'assets/philinter/laundry.jpg' },
    { category: '设施', title: '学习大厅', description: '适合晚间自习、模考准备和课后复习。', src: 'assets/philinter/study-hall.jpg' },
  ];

  readonly basicInfo: BasicInfoRow[] = [
    { label: '学校名称', value: '菲律宾宿务Philinter语言学校（Philinter Center for English Language）' },
    { label: '所在地区', value: 'Lapu-Lapu City, Mactan Island, Cebu，距离宿务机场较近' },
    { label: '创立时间', value: '2003年' },
    { label: '学校定位', value: '老牌半斯巴达语言学校，重视师资、学习系统和多国籍环境' },
    { label: '官方特色', value: 'Guaranteed Progress、Buddy Teacher System、IELTS 8.0 Teachers' },
    { label: '考试资源', value: '官方资料显示Philinter是British Council IELTS官方考点' },
    { label: '课程范围', value: 'Light ESL、General ESL、Intensive ESL、IPS、IELTS、TOEIC、TOEFL、Business、Junior、Primary' },
    { label: '住宿选择', value: '校内单人、双人、三人房；校外Azon Condo方向需顾问确认' },
  ];

  readonly highlights: Highlight[] = [
    { image: 'assets/philinter/one-on-one-room.jpg', title: 'Buddy Teacher和进度管理', text: '官方介绍Buddy Teacher System，适合希望学习过程有人跟进的学生。' },
    { image: 'assets/philinter/group-classroom.png', title: '口语与考试课程都强', text: 'ESL、Intensive Power Speaking、IELTS、TOEIC和商务方向都可比较。' },
    { image: 'assets/philinter/campus-pool.jpg', title: '麦克坦位置与校内生活', text: '距离机场较近，校内有泳池、咖啡厅、宿舍和学习空间。' },
    { image: 'assets/philinter/single-room.jpg', title: '校内与校外住宿可选', text: '校内方便学习管理，校外公寓更适合重视生活品质的成人或家庭。' },
  ];

  readonly suitableFor: FitItem[] = [
    { title: '想在老牌学校里稳步提升英文', text: 'Philinter适合重视课程体系、师资和学习风气的成人学生。' },
    { title: '想重点提升口说', text: 'Intensive Power Speaking适合想加强流利度、准确度和实际表达的学生。' },
    { title: 'IELTS、TOEIC或商务目标明确', text: '考试与商务方向较完整，适合需要按目标倒推课程的人。' },
    { title: '想住麦克坦、靠近机场', text: '适合短期入学、抵达时间不稳定或想兼顾麦克坦生活资源的学生。' },
  ];

  readonly notSuitableFor: FitItem[] = [
    { title: '只想住最新型度假村校园', text: 'Philinter是成熟老牌学校，住宿和设施要和CIA、CPI、EV等新型校区一起比较。' },
    { title: '完全不想被学习节奏约束', text: 'Intensive和考试方向会有更明确的学习、测试和出勤要求。' },
    { title: '只看低价，不准备当地费用', text: '到校后仍需支付SSP、SSP E-card、水电、教材、押金、接机、延签等费用。' },
    { title: '不想提前确认住宿规则', text: '校内和校外住宿在预算、门禁、接送、生活便利度上差异明显。' },
  ];

  readonly courses: CourseItem[] = [
    { name: 'Light ESL / General ESL', type: '综合英语', lessons: '一对一 + 小团体 + 大团体 + 自习/选修', suitable: '适合第一次菲律宾游学、基础提升和短期体验。' },
    { name: 'Intensive ESL', type: '斯巴达综合英语', lessons: '更高密度日课 + 晚间学习安排', suitable: '适合想被学习节奏推动、短期快速提升的学生。' },
    { name: 'Intensive Power Speaking', type: '强化口说', lessons: '口说流利度、准确度、互动表达和情境沟通', suitable: '适合想集中提高开口量、自信和表达反应的人。' },
    { name: 'IELTS Intensive / Guarantee', type: '雅思备考', lessons: '雅思听说读写 + 策略训练 + 模考与进度管理', suitable: '适合目标分数明确、需要系统备考和监督的学生。' },
    { name: 'TOEIC / TOEFL', type: '考试英文', lessons: '考试专项 + ESL基础 + 模拟练习', suitable: '适合升学、求职、企业需求或北美考试目标。' },
    { name: 'Business / Focused Industry', type: '商务与行业英文', lessons: '会议、演示、邮件、面试、行业主题', suitable: '适合职场人士、转职或有行业英文需求的成人。' },
    { name: 'Primary / Junior', type: '儿童与青少年', lessons: '儿童英文、青少年ESL、青少年雅思方向', suitable: '适合7-17岁学生，但年龄、陪同和监护规则需提前确认。' },
  ];

  courseFees: CourseFee[] = [
    { id: 'light-esl', name: 'Light ESL', tuition: 790, suitable: '2节一对一 + 2节小团体 + 2节大团体选修 + 选修活动' },
    { id: 'general-esl', name: 'General ESL', tuition: 900, suitable: '3节一对一 + 1节小团体 + 2节精品小团体 + 2节大团体选修 + 选修活动' },
    { id: 'intensive-esl', name: 'Intensive ESL', tuition: 1030, suitable: '4节一对一 + 1节小团体 + 2节精品团体 + 1节大团体 + 2节夜间辅导选修 + 选修活动' },
    { id: 'intensive-power-speaking', name: 'Intensive Power Speaking', tuition: 1170, suitable: '4节一对一 + 2节小团体 + 2节精品小团体 + 2节夜间自习选修 + 选修活动' },
    { id: 'ielts-intensive', name: 'IELTS Intensive', tuition: 1200, suitable: '4节一对一 + 4节小团体 + 2节强制夜间辅导 + 每周六上午模考' },
    { id: 'ielts-guarantee-8-weeks', name: 'IELTS Guarantee 8 Weeks', tuition: 1580, suitable: '4节一对一 + 4节小团体 + 2节强制夜间辅导 + 每周六上午模考；8周保证班' },
    { id: 'ielts-guarantee-12-weeks', name: 'IELTS Guarantee 12 Weeks', tuition: 1420, suitable: '4节一对一 + 4节小团体 + 2节强制夜间辅导 + 每周六上午模考；12周保证班' },
    { id: 'toeic-regular', name: 'TOEIC Regular', tuition: 1100, suitable: '4节一对一 + 2节小团体 + 2节大团体 + 选修活动 + 每周五模考' },
    { id: 'toeic-guarantee-12-weeks', name: 'TOEIC Guarantee 12 Weeks', tuition: 1260, suitable: '托业保证班12周；入学分数、出勤、模考和校规需确认' },
    { id: 'focus-industry', name: 'Focus Industry（可定制）', tuition: 1280, suitable: '3节一对一 + 2节小团体 + 2节精品小团体 + 1节大团体选修 + 选修活动' },
    { id: 'basic-business', name: 'Basic Business', tuition: 1150, suitable: '3节一对一 + 2节小团体 + 2节精品小团体 + 1节大团体选修 + 选修活动；雅思3分起' },
    { id: 'advanced-business', name: 'Advanced Business', tuition: 1200, suitable: '3节一对一 + 2节小团体 + 2节精品小团体 + 1节大团体选修 + 选修活动；雅思3.5–4分起' },
    { id: 'primary-english-7-11-years', name: 'Primary English（7–11岁）', tuition: 1340, suitable: '儿童英语课程；年龄、陪同及监护规则需提前确认' },
    { id: 'junior-esl-12-17-years', name: 'Junior ESL（12–17岁）', tuition: 1340, suitable: '3节一对一 + 2节小团体 + 2节选修自习课' },
    { id: 'junior-ielts-12-17-years', name: 'Junior IELTS（12–17岁）', tuition: 1490, suitable: '4节一对一 + 4节小团体 + 2节雅思强制自习 + 每周六上午模考；雅思3分起' },
    { id: 'speaking', name: 'Speaking', tuition: 1400, suitable: '8节口语团体课 + 2节晚课 + 2节选修课；最长8周' },
    { id: 'junior-speaking', name: 'Junior Speaking', tuition: 1400, suitable: '7节口语团体课 + 2节晚课 + 2节选修课；最长8周' },
  ];

  roomFees: RoomFee[] = [
    { id: 'in-campus-triple', name: '校内三人房', fee: 810, note: '上下铺三人房；默认报价参考，预算压力较低' },
    { id: 'in-campus-twin', name: '校内双人房', fee: 970, note: '适合朋友同行或希望兼顾预算与舒适度' },
    { id: 'in-campus-single', name: '校内单人房', fee: 1400, note: '隐私最好，预算较高，热门档期需早确认' },
    { id: 'azon-triple', name: '校外公寓三人房', fee: 890, note: 'Azon Condo三人房；接送、门禁和空房需顾问确认' },
    { id: 'azon-twin', name: '校外公寓双人房', fee: 1100, note: 'Azon Condo双人房；适合重视生活品质的成人或家庭' },
    { id: 'azon-single', name: '校外公寓单人房', fee: 1690, note: 'Azon Condo单人房；接送、门禁和空房需顾问确认' },
  ];

  readonly schedule: ScheduleItem[] = [
    { time: '07:00 - 08:00', title: '早餐与晨间准备', text: '校内用餐后准备当天课程，考试或斯巴达方向需按规则执行。' },
    { time: '08:00 - 12:00', title: '上午课程', text: '一对一、小团体、大团体、考试或商务专项，按课程类型安排。' },
    { time: '12:00 - 13:00', title: '午餐与休息', text: '餐厅用餐，下午课程前整理笔记和作业。' },
    { time: '13:00 - 17:00', title: '下午课程', text: '继续口说、听力、阅读、写作、考试策略或商务主题训练。' },
    { time: '17:00 - 19:00', title: '晚餐与自由时间', text: '可使用校内设施；外出、门禁和校外住宿接送规则需提前确认。' },
    { time: '19:00 - 21:00', title: '自习 / 晚间学习 / 模考', text: 'Intensive、IELTS和保证班方向可能有更明确的晚间安排。' },
  ];

  readonly serviceSteps: ProcessStep[] = [
    { icon: 'person_search', title: '判断Philinter是否适合', text: '先了解学习目标、年龄、住宿偏好、是否接受半斯巴达管理和预算。' },
    { icon: 'fact_check', title: '确认课程、房型和空房', text: '免费协助确认课程、校内/校外住宿、空房、优惠和正式报价。' },
    { icon: 'assignment_turned_in', title: '协助入境和签证手续', text: '思达免费协助办理菲律宾入境及签证相关手续，学生只需按顾问指引准备个人资料。' },
    { icon: 'inventory', title: '发送学习资料和行前清单', text: '入学前免费发送学习资料、行李清单、费用清单和到校注意事项。' },
    { icon: 'support_agent', title: '到校后继续跟进', text: '如遇到换老师、调课、学习方法、宿舍生活或学校沟通问题，也可以继续联系思达协助。' },
    { icon: 'location_on', title: '宿务当地支持', text: '思达在宿务有工作人员驻点，可为学生提供当地支持，直到完成学习并顺利回国。' },
  ];

  readonly sidaPhilinterReasons: SidaPhilinterReason[] = [
    {
      number: '01',
      title: '正式合同与学校文件可核验',
      text: '国内公司签约，Philinter报价、录取文件及收费凭证均可逐项核对。',
      image: 'assets/cia/sida-why-action-contract.jpg',
      alt: '思达启航正式合同与学校文件核验',
    },
    {
      number: '02',
      title: '课程、住宿和费用提前算清',
      text: '0中介服务费，课程费、校内/校外住宿费、考试规则及Philinter到校费用逐项说明。',
      image: 'assets/cia/sida-why-action-fees.jpg',
      alt: '思达启航顾问为学生核算菲律宾宿务Philinter语言学校费用',
    },
    {
      number: '03',
      title: '先判断Philinter是否适合',
      text: '根据口语、IELTS、TOEIC、商务、青少年目标和预算，帮你判断Philinter是否匹配。',
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

  readonly sidaPhilinterTrustBadges: SidaPhilinterTrustBadge[] = [
    { icon: 'description', label: '国内正式公司合同' },
    { icon: 'verified_user', label: '学校合作与文件核验' },
    { icon: 'local_offer', label: '费用透明与同条件保价' },
    { icon: 'apartment', label: '深圳总部 + 宿务驻点' },
  ];

  readonly schoolServices = ['机场接机', '入学说明', '分级测试', 'Buddy Teacher', '学习进度跟进', 'IELTS模考', '学生餐厅', '洗衣服务', '宿舍清洁', '学习大厅', '医护协助', '校内保安'];
  readonly campusActivities = ['新生说明会', '毕业典礼', '商务发表', '校内交流', '泳池与运动', '学习成果展示'];
  readonly weekendActivities = ['麦克坦海岛活动', '宿务市区生活', '商场与餐厅', '度假村周末体验', '同学自发聚会', '顾问可协助确认安全建议'];
  readonly notes = [
    'Philinter报名前建议先确认General、Intensive、IPS、IELTS或Business方向，课程强度差异明显。',
    '校内宿舍和校外公寓在门禁、接送、生活便利度和预算上不同，报名时要一起确认。',
    '儿童和青少年课程需先确认年龄、陪同家长、监护规则、开课档期和房型。',
    '本页课程费与住宿费为4周参考；1周、2周、3周分别按4周价格的45%、65%、85%计算。',
    '2026年8月16日至12月25日入学，指定课程与房型每满8周优惠USD 300；不得与校方其他优惠或Voucher并用。',
    '到校支付费用会随学校政策、汇率和个人情况变化，最终以学校现场收费为准。',
  ];

  readonly faqs: FaqItem[] = [
    { question: 'Philinter适合第一次菲律宾游学吗？', answer: '适合。Philinter是宿务老牌学校，课程体系完整，适合想在稳定学习风气里提升英文的学生。' },
    { question: 'Philinter是斯巴达学校吗？', answer: 'Philinter整体更常被理解为半斯巴达学校，但Intensive、IELTS和保证班方向会有更强的学习安排和规则。' },
    { question: '页面上的报价包含全部费用吗？', answer: '不包含全部。前期支付参考主要包含注册费、课程费和住宿费；到校后通常还需支付SSP、SSP E-card、水电、教材、押金、接机、延签等当地费用。' },
    { question: 'Philinter适合口说强化吗？', answer: '适合。Intensive Power Speaking是Philinter常被关注的口说方向，适合想提升流利度、准确度和表达自信的学生。' },
    { question: 'Philinter短期1至3周怎么计算？', answer: '课程费和住宿费均以4周价格为基准：1周按45%、2周按65%、3周按85%计算；课程与住宿注册费另计。' },
    { question: '2026年下半年淡季优惠怎么计算？', answer: '2026年8月16日至12月25日入学，报名至少8周且选择校内三人房、Azon单人房或Azon双人房时，每满8周优惠USD 300；IELTS及TOEIC保证班、走读、校内单人或双人房不参加，且不得与校方其他优惠或Voucher并用。页面按条件初筛，最终以学校确认为准。' },
    { question: '思达会协助签证和入境吗？', answer: '会。通过思达报名Philinter，思达顾问会免费协助菲律宾入境及签证相关手续，学生只需要按顾问指引准备个人资料。' },
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
          schools.find((item) => item.name.includes('Philinter')) ??
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
      if (!this.courseFees.some((course) => course.id === this.selectedCourseId)) this.selectedCourseId = this.courseFees.find((course) => course.id === 'light-esl')?.id ?? this.courseFees[0].id;
    }

    const databaseRoomFees = rooms
      .filter((room) => room.week === 4)
      .map((room) => ({ id: this.createRoomId(room.name), name: room.name, fee: room.price, note: room.description || '请联系顾问确认空房' }))
      .sort((a, b) => this.orderIndex(this.roomFeeOrder, a.id) - this.orderIndex(this.roomFeeOrder, b.id));
    if (databaseRoomFees.length > 0) {
      this.roomFees = databaseRoomFees;
      if (!this.roomFees.some((room) => room.id === this.selectedRoomId)) this.selectedRoomId = this.roomFees.find((room) => room.id === 'in-campus-triple')?.id ?? this.roomFees[0].id;
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
  get tuitionForSelectedWeeks(): number { return this.selectedCourse.tuition * this.selectedWeekMultiplier; }
  get roomFeeForSelectedWeeks(): number { return this.selectedRoom.fee * this.selectedWeekMultiplier; }
  get courseAndRoomBase(): number { return this.tuitionForSelectedWeeks + this.roomFeeForSelectedWeeks; }
  get selectedWeekMultiplier(): number {
    return this.shortTermRatios[this.selectedWeeks] ?? (this.selectedWeeks / 4);
  }
  get billingRuleText(): string {
    const percentage = this.shortTermRatios[this.selectedWeeks];
    return percentage ? `${this.selectedWeeks}周按4周课程费和住宿费的${percentage * 100}%计算` : `${this.selectedWeeks}周按4周价格的${this.selectedWeekMultiplier}倍计算`;
  }
  get sidaDiscountAmount(): number { return Math.round(this.courseAndRoomBase * (1 - this.sidaDiscountRate) * 100) / 100; }
  get isOffSeasonEntry(): boolean { return this.isDateBetween(this.selectedStartDate, '2026-08-16', '2026-12-25'); }
  get isOffSeasonRoomEligible(): boolean { return ['in-campus-triple', 'azon-single', 'azon-twin'].includes(this.selectedRoomId); }
  get isGuaranteeCourse(): boolean { return ['ielts-guarantee-8-weeks', 'ielts-guarantee-12-weeks', 'toeic-guarantee-12-weeks'].includes(this.selectedCourseId); }
  get offSeasonEligible(): boolean { return this.isOffSeasonEntry && this.selectedWeeks >= 8 && this.isOffSeasonRoomEligible && !this.isGuaranteeCourse; }
  get offSeasonDiscountAmount(): number { return this.offSeasonEligible ? Math.floor(this.selectedWeeks / 8) * 300 : 0; }
  get offSeasonEligibilityText(): string {
    if (!this.isOffSeasonEntry) return '入学日期不在2026/08/16–12/25活动期';
    if (this.selectedWeeks < 8) return '最低需报名8周';
    if (this.isGuaranteeCourse) return 'IELTS/TOEIC保证班不参加';
    if (!this.isOffSeasonRoomEligible) return '仅校内三人房、Azon单人房或双人房参加';
    return `符合条件，每满8周减USD 300，已优惠USD ${this.formatUsd(this.offSeasonDiscountAmount)}`;
  }
  get peakSeasonWeeks(): number {
    const start = this.parseDate(this.selectedStartDate);
    if (!start) return 0;
    const peakStart = this.parseDate('2026-07-05')!;
    const peakEnd = this.parseDate('2026-08-29')!;
    let count = 0;
    for (let index = 0; index < this.selectedWeeks; index += 1) {
      const studyWeek = new Date(start.getTime());
      studyWeek.setUTCDate(studyWeek.getUTCDate() + index * 7);
      if (studyWeek >= peakStart && studyWeek <= peakEnd) count += 1;
    }
    return count;
  }
  get seasonalSurcharge(): number { return this.peakSeasonWeeks * this.seasonalFeePerWeek; }
  get quoteUsd(): number { return Math.max(0, this.registrationFee + this.courseAndRoomBase * this.sidaDiscountRate + this.seasonalSurcharge - this.offSeasonDiscountAmount); }
  get quoteUsdText(): string { return `USD ${this.formatUsd(this.quoteUsd)}`; }
  get quoteCnyText(): string { const rounded = Math.round((this.quoteUsd * this.usdToCny) / 100) * 100; return `约 ${rounded.toLocaleString('zh-CN')} 元`; }
  get exchangeRateText(): string { return this.exchangeRateLive && this.exchangeRateDate ? `汇率日期 ${this.exchangeRateDate}` : '暂按备用汇率估算'; }

  get localFeeBiweeklyPeriods(): number { return Math.max(1, Math.ceil(this.selectedWeeks / 2)); }
  get localFeeFourWeekPeriods(): number { return Math.max(1, Math.ceil(this.selectedWeeks / 4)); }
  get visaExtensionCount(): number { return this.selectedWeeks > 4 ? 1 : 0; }
  get visaExtensionTotal(): number {
    if (this.selectedWeeks <= 4) return 0;
    let total = 5140;
    if (this.selectedWeeks > 8) total += 6920;
    if (this.selectedWeeks > 12) total += 4440;
    if (this.selectedWeeks > 16) total += 4950;
    if (this.selectedWeeks > 20) total += 5450;
    return total;
  }
  get roomDeposit(): number {
    if (this.selectedWeeks <= 2) return 2000;
    if (this.selectedWeeks <= 7) return 3000;
    if (this.selectedWeeks <= 11) return 4000;
    return 5000;
  }
  get localFees(): LocalFee[] {
    const biweeklyPeriods = this.localFeeBiweeklyPeriods;
    const fourWeekPeriods = this.localFeeFourWeekPeriods;
    const extensionQuantity = this.visaExtensionCount;
    const acrQuantity = extensionQuantity > 0 ? 1 : 0;
    return [
      { item: 'SSP特殊学习许可证', amount: 'PHP 7,800 / 次', quantity: 1, total: 7800, note: '移民局收取；按报名学习时长办理，续费及换校需重新办理' },
      { item: 'SSP I-CARD', amount: 'PHP 4,500 / 次', quantity: 1, total: 4500, note: '入学时与SSP同时办理，只收一次' },
      { item: 'ACR-I CARD 外国人身份证', amount: 'PHP 4,000 / 次', quantity: acrQuantity, total: 4000 * acrQuantity, note: '首次续签时办理，只收一次' },
      { item: '管理费', amount: 'PHP 2,200 / 2周', quantity: biweeklyPeriods, total: 2200 * biweeklyPeriods, note: '按每2周计算' },
      { item: '电费', amount: 'PHP 2,800 / 2周', quantity: biweeklyPeriods, total: 2800 * biweeklyPeriods, note: '预估；含公共用电及房间基础用电16kW/周，超出按PHP25/kW/人收取' },
      { item: '水费', amount: 'PHP 1,000 / 2周', quantity: biweeklyPeriods, total: 1000 * biweeklyPeriods, note: '按每2周计算' },
      { item: '旅游签续签', amount: '按学习周数阶梯计算', quantity: extensionQuantity, total: this.visaExtensionTotal, note: '5–8周PHP5,140；9–12周再加PHP6,920；13–16周再加PHP4,440；17–20周再加PHP4,950；21–24周再加PHP5,450；国籍不同可能调整' },
      { item: '书本教材费', amount: 'PHP 2,000 / 4周', quantity: fourWeekPeriods, total: 2000 * fourWeekPeriods, note: '预估；按课程和实际购买教材调整' },
      { item: '学生证', amount: 'PHP 400 / 次', quantity: 1, total: 400, note: '一次性费用' },
      { item: '宿务麦克坦机场接机', amount: 'PHP 1,200 / 次', quantity: this.includeAirportPickup ? 1 : 0, total: this.includeAirportPickup ? 1200 : 0, note: '可选；周六、周日06:00–24:00参考，其他时间PHP1,500，默认不计入学杂费合计', excluded: true },
      { item: '宿舍押金', amount: `PHP ${this.roomDeposit.toLocaleString('en-US')} / 次`, quantity: 1, total: this.roomDeposit, note: '1–2周PHP2,000；3–7周PHP3,000；8–11周PHP4,000；12–24周PHP5,000；可退', excluded: true },
      { item: '额外住宿', amount: 'PHP 3,000 / 晚', quantity: 0, total: 0, note: '按实际额外入住晚数计算，默认不计入合计', excluded: true },
    ];
  }
  get localFeesTotal(): number { return this.localFees.filter((fee) => !fee.excluded).reduce((sum, fee) => sum + fee.total, 0); }
  get localFeesCnyText(): string { return `约 ${Math.round(this.localFeesTotal / this.phpPerCny).toLocaleString('zh-CN')} 元`; }

  get quoteImageData() {
    const includedFees = this.localFees.filter((fee) => !fee.excluded);
    const optionalFees = this.localFees.filter((fee) => fee.excluded);
    return buildPhilippinesDetailedQuote({
      schoolCode: 'PHILINTER',
      schoolName: '菲律宾宿务Philinter语言学校',
      filePrefix: 'PHILINTER',
      heroSrc: '/assets/philinter/campus-main.jpeg',
      weeks: this.selectedWeeks,
      startDate: this.selectedStartDate,
      usdToCny: this.usdToCny,
      totalUsd: this.quoteUsd,
      paymentItems: [
        { icon: '注', label: '注册费', amount: `${this.formatUsd(this.registrationFee)} 美元`, note: '课程注册费USD120 + 住宿注册费USD100' },
        { icon: '课', label: '课程费', amount: `${this.formatUsd(this.tuitionForSelectedWeeks)} 美元`, note: `${this.selectedCourse.name}；以上单价以4周为基准` },
        { icon: '宿', label: '住宿费', amount: `${this.formatUsd(this.roomFeeForSelectedWeeks)} 美元`, note: this.selectedRoom.name },
        { icon: '折', label: '思达折扣', amount: '9折', note: `仅课程费和住宿费，已优惠USD ${this.formatUsd(this.sidaDiscountAmount)}`, accent: true },
        { icon: '淡', label: '淡季优惠', amount: `- ${this.formatUsd(this.offSeasonDiscountAmount)} 美元`, note: this.offSeasonEligibilityText },
        { icon: '旺', label: '暑期附加费', amount: `${this.formatUsd(this.seasonalSurcharge)} 美元`, note: `${this.peakSeasonWeeks}周 × USD ${this.formatUsd(this.seasonalFeePerWeek)}` },
      ],
      localFeeItems: includedFees.map((fee) => ({ label: fee.item, unit: fee.amount, quantity: String(fee.quantity), amount: this.formatPhp(fee.total), note: fee.note })),
      localFeeTotal: this.localFeesTotal,
      localFeeCny: Math.round(this.localFeesTotal / this.phpPerCny),
      localFeeNote: '接机、可退宿舍押金及额外住宿单独列示，不计入学杂费合计。',
      optionalFeeItems: optionalFees.map((fee) => ({ label: fee.item, amount: this.formatPhp(fee.total), note: fee.note })),
      ruleNotes: [
        '计算规则：注册费 +（课程费 + 住宿费）× 思达9折 + 暑期附加费 − 符合条件的淡季优惠。',
        '淡季活动每满8周减USD300；仅校内三人房、Azon单人/双人房，IELTS及TOEIC保证班除外。',
      ],
    });
  }

  formatUsd(value: number): string { return value.toLocaleString('en-US', { minimumFractionDigits: Number.isInteger(value) ? 0 : 1, maximumFractionDigits: 1 }); }
  formatPhp(value: number): string { return `PHP ${value.toLocaleString('en-US')}`; }
  private slugifyPriceKey(value: string): string { return value.toLowerCase().replace(/&/g, 'and').replace(/\+/g, ' ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
  private orderIndex(order: string[], value: string): number { const index = order.indexOf(value); return index === -1 ? Number.MAX_SAFE_INTEGER : index; }
  private createRoomId(name: string): string {
    if (name.includes('校外') && name.includes('单人')) return 'azon-single';
    if (name.includes('校外') && name.includes('双人')) return 'azon-twin';
    if (name.includes('校外') && name.includes('三人')) return 'azon-triple';
    if (name.includes('三人')) return 'in-campus-triple';
    if (name.includes('双人')) return 'in-campus-twin';
    if (name.includes('单人')) return 'in-campus-single';
    return this.slugifyPriceKey(name);
  }
  private isDateBetween(value: string, start: string, end: string): boolean { return value >= start && value <= end; }
  private parseDate(value: string): Date | null {
    const parsed = new Date(`${value}T00:00:00Z`);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
}

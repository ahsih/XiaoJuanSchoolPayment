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
interface StudyPlanCurfew { day: string; time: string; }
interface StudyPlanTimeBlock { label: string; time: string; text: string; icon: string; type: 'required' | 'flexible'; }
interface StudyPlan { code: string; name: string; title: string; text: string; routine: string; contrastTitle: string; timeBlocks: StudyPlanTimeBlock[]; curfew: StudyPlanCurfew[]; }
interface ScheduleItem { time: string; title: string; text: string; appliesTo: string; icon: string; highlighted?: boolean; }
interface ElectiveCourseGroup { period: string; level: string; courses: string[]; }
interface RoomFee { id: string; name: string; fee: number; note: string; }
interface LocalFee { item: string; amount: string; note: string; quantity: number; total: number; excluded?: boolean; }
interface ProcessStep { icon: string; title: string; text: string; }
interface FaqItem { question: string; answer: string; }
interface SideNavItem { label: string; target: string; icon: string; }
interface SidaEvReason {
  number: string;
  title: string;
  text: string;
  image: string;
  alt: string;
}
interface SidaEvTrustBadge { icon: string; label: string; }

@Component({
  selector: 'app-ev-school-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule, QuoteImageDownloadButtonComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './ev-school-detail.component.html',
  styleUrls: [
    '../cebu-school-detail-layout.css',
    '../cebu-school-detail-content.css',
    '../cebu-school-detail-responsive.css',
    './ev-school-detail.component.css',
  ],
})
export class EvSchoolDetailComponent implements OnInit {
  private readonly schoolService = inject(SchoolService);
  private readonly exchangeRateService = inject(ExchangeRateService);
  private readonly pricingSchoolName = 'EV Academy';
  private readonly courseFeeOrder = [
    'sparta-intensive-esl',
    'sparta-power-speaking-6',
    'sparta-power-speaking-8',
    'sparta-ielts-regular',
    'sparta-ielts-guarantee',
    'sparta-toeic',
    'sparta-social-media-english',
    'sparta-business',
    'semi-sparta-esl',
    'semi-sparta-power-speaking-6',
    'semi-sparta-power-speaking-8',
    'semi-sparta-toeic',
    'semi-sparta-business',
    'semi-sparta-social-media-english',
  ];
  private readonly roomFeeOrder = ['single', 'double', 'triple', 'quad-bunk', 'off-campus-single', 'off-campus-double'];

  readonly galleryCategories: GalleryCategory[] = ['全部', '校园', '教室', '住宿', '餐厅', '设施'];
  selectedGalleryCategory: GalleryCategory = '全部';
  registrationFee = 100;
  readonly discount = 0.95;
  seasonalFeePerWeek = 40;
  readonly peakSeasonDateRange = '2026/07/05–2026/08/29';
  private readonly peakSeasonStartDate = '2026-07-05';
  private readonly peakSeasonEndDate = '2026-08-29';
  minorManagementFeePerPeriod = 100;
  usdToCny = 7.2;
  phpPerCny = 7.75;
  exchangeRateDate = '';
  exchangeRateLive = false;
  readonly weekOptions = [1, 2, 3, 4, 8, 12, 16, 20, 24];
  selectedCourseId = 'semi-sparta-esl';
  selectedRoomId = 'quad-bunk';
  selectedWeeks = 4;
  selectedStartDate = '2026-09-07';
  isMinorStudent = false;
  quoteCalculated = false;

  readonly quickInfo: QuickInfo[] = [
    { icon: 'apartment', label: '学校类型', value: '宿务斯巴达 / 半斯巴达', note: '可选择严格或弹性管理模式' },
    { icon: 'groups', label: '适合人群', value: '7岁以上学生', note: '15岁以下通常需父母陪同' },
    { icon: 'verified_user', label: '管理模式', value: '斯巴达或半斯巴达', note: '按学习目标选择强度' },
    { icon: 'school', label: '课程选项', value: '斯巴达 / 半斯巴达', note: '含综合英语、口语、雅思、多益、商务与社交媒体英语' },
    { icon: 'bed', label: '食宿房型', value: '校内房 / 校外公寓', note: '热门房型建议提前确认' },
    { icon: 'event_available', label: '校区位置', value: 'Nasipit, Cebu City', note: '宿务市区校园型学校，生活机能方便' },
  ];

  readonly galleryImages: GalleryImage[] = [
    { category: '校园', title: 'EV校园外观', description: '2017年迁入的新校区，主打度假村式校园体验。', src: 'assets/ev/campus-exterior.jpg' },
    { category: '校园', title: '校园草坪', description: '开放式校园空间，适合课后活动和学生交流。', src: 'assets/ev/campus-lawn.jpg' },
    { category: '教室', title: '一对一教室', description: '用于口语、写作、考试专项和强化口说课程。', src: 'assets/ev/mtm-classroom.jpg' },
    { category: '住宿', title: '单人房', description: '适合重视隐私和安静学习环境的学生。', src: 'assets/ev/single-room.jpg' },
    { category: '住宿', title: '双人房', description: '适合朋友同行或希望兼顾预算与舒适度。', src: 'assets/ev/double-room.jpg' },
    { category: '住宿', title: '四人房', description: '默认报价参考房型，预算压力相对低。', src: 'assets/ev/quad-room.jpg' },
    { category: '设施', title: '健身房', description: '课后运动和体能恢复使用。', src: 'assets/ev/gym.jpg' },
    { category: '设施', title: '游泳池', description: 'EV度假型校园的重要生活设施。', src: 'assets/ev/swimming-pool.jpg' },
  ];

  readonly basicInfo: BasicInfoRow[] = [
    { label: '学校名称', value: '菲律宾宿务EV语言学校' },
    { label: '所在地区', value: 'Nasipit, Cebu City, Cebu' },
    { label: '创校时间', value: '2004年起办学，2017年迁入新校区' },
    { label: '学生容量', value: '约300名学生' },
    { label: '管理模式', value: '斯巴达 / 半斯巴达，可按学习目标选择' },
    { label: '年龄要求', value: '7岁以上；15岁以下通常需要父母陪同' },
    { label: '食宿房型', value: '校内单人间、双人间、三人间、四人间；校外公寓需确认' },
    { label: '核心资源', value: 'IDP雅思官方考点、24小时自习室、校内泳池与运动设施' },
  ];

  readonly highlights: Highlight[] = [
    { image: 'assets/ev/campus-exterior.jpg', title: '2004年起深耕宿务英语教育', text: 'EV长期服务亚洲学生，官方介绍中强调其Intensive English Program与学生导向课程研发。' },
    { image: 'assets/ev/mtm-classroom.jpg', title: '斯巴达 / 半斯巴达管理模式可选', text: '斯巴达偏冲刺和严格管理，半斯巴达偏学习与生活平衡，适合先按自律程度和学习目标做选择。' },
    { image: 'assets/ev/swimming-pool.jpg', title: '度假村式校园定位', text: 'EV强调现代化设施、开放式环境和校园生活完整度，不只是单纯上课。' },
    { image: 'assets/ev/quad-room.jpg', title: 'IDP雅思官方考点资源', text: '雅思学生可把课程、模考和正式考试环境一起纳入考虑，减少考试场地陌生感。' },
  ];

  readonly suitableFor: FitItem[] = [
    { title: '目标清楚、想被学习节奏推动', text: '斯巴达管理模式适合想提高自律、冲刺考试或短期高强度学习的学生。' },
    { title: '想留在宿务市区校园', text: 'EV在Cebu City，适合希望兼顾校园环境和市区便利度的人。' },
    { title: '重视一对一口语训练', text: '强化口说6 / 8适合口语目标明确、想提高开口量的学生。' },
    { title: '准备雅思、托业或商务英语', text: '课程覆盖综合英语、考试英语和特定目的英语，方便按目标选择。' },
  ];

  readonly notSuitableFor: FitItem[] = [
    { title: '只想轻松度假式游学', text: 'EV仍有清晰管理制度，尤其斯巴达模式不适合只想自由体验宿务生活的学生。' },
    { title: '预算非常紧', text: '现代校园、设施和热门房型会拉高预算，到校费用也需要单独准备。' },
    { title: '临近旺季才决定', text: 'EV热门房型和课程容易满位，暑假、寒假建议提前确认空房。' },
    { title: '未成年学生未确认陪同规则', text: '15岁以下、亲子或未成年学生要先确认年龄、陪同、门禁和管理费。' },
  ];

  readonly courses: CourseItem[] = [
    { name: '半斯巴达 ESL', type: '半斯巴达综合英语', lessons: '4节一对一 + 2节小团体 + 2节大团体 + 选修课', suitable: '适合希望学习与宿务生活保持平衡的学生。' },
    { name: '斯巴达 Intensive ESL', type: '斯巴达综合英语', lessons: '4节一对一 + 2节小团体 + 2节大团体 + 选修课', suitable: '适合想用更强纪律快速进入学习状态的学生。' },
    { name: '强化口说6', type: '斯巴达 / 半斯巴达均可选', lessons: '6节一对一 + 1节小团体 + 1节大团体 + 选修课', suitable: '适合短期集中提升开口量、纠音和表达反应。' },
    { name: '强化口说8', type: '斯巴达 / 半斯巴达均可选', lessons: '8节一对一 + 选修课；斯巴达另有自习', suitable: '适合目标非常明确、能承受高一对一强度的学生。' },
    { name: '常规雅思 / 雅思保证班', type: '斯巴达考试课程', lessons: '常规班4节一对一 + 4节团体；保证班另有早晚课', suitable: '保证班入学需提交雅思官方成绩，适合有明确目标分数的学生。' },
    { name: '多益', type: '斯巴达 / 半斯巴达均可选', lessons: '4节一对一 + 4节团体 + 选修课；斯巴达另有自习', suitable: '适合求职、升学或企业英语能力证明需求。' },
    { name: '商务英语', type: '斯巴达 / 半斯巴达均可选', lessons: '4节一对一 + 4节团体 + 选修课；斯巴达另有自习', suitable: '适合职场人士或准备英文工作场景的学生。' },
    { name: '社交媒体英语', type: '斯巴达 / 半斯巴达均可选', lessons: '4节一对一 + 4节团体 + 选修课；斯巴达另有自习', suitable: '适合想提升数字沟通、内容表达和实际应用英语的学生。' },
  ];

  courseFees: CourseFee[] = [
    { id: 'sparta-intensive-esl', name: '斯巴达 Intensive ESL', tuition: 1030, suitable: '4节一对一 + 2节小团体课 + 2节大团体课 + 选修课' },
    { id: 'sparta-power-speaking-6', name: '强化口说6（斯巴达）', tuition: 1230, suitable: '6节一对一 + 1节小团体课 + 1节大团体课 + 选修课' },
    { id: 'sparta-power-speaking-8', name: '强化口说8（斯巴达）', tuition: 1410, suitable: '8节一对一 + 自习 + 选修课' },
    { id: 'sparta-ielts-regular', name: '常规雅思（斯巴达）', tuition: 1150, suitable: '4节一对一 + 2节小团体课 + 2节大团体课 + 选修课' },
    { id: 'sparta-ielts-guarantee', name: '雅思保证班（斯巴达）', tuition: 1290, suitable: '1节早课 + 4节一对一 + 4节团体课 + 1节晚课 + 选修课；入学需提交雅思官方成绩' },
    { id: 'sparta-toeic', name: '多益（斯巴达）', tuition: 1150, suitable: '4节一对一 + 4节团体课 + 自习 + 选修课' },
    { id: 'sparta-social-media-english', name: '社交媒体英语（斯巴达）', tuition: 1150, suitable: '4节一对一 + 4节团体课 + 自习 + 选修课' },
    { id: 'sparta-business', name: '商务英语（斯巴达）', tuition: 1150, suitable: '4节一对一 + 4节团体课 + 自习 + 选修课' },
    { id: 'semi-sparta-esl', name: '半斯巴达 ESL', tuition: 980, suitable: '4节一对一 + 2节小团体课 + 2节大团体课 + 选修课' },
    { id: 'semi-sparta-power-speaking-6', name: '强化口说6（半斯巴达）', tuition: 1180, suitable: '6节一对一 + 1节小团体课 + 1节大团体课 + 选修课' },
    { id: 'semi-sparta-power-speaking-8', name: '强化口说8（半斯巴达）', tuition: 1360, suitable: '8节一对一 + 选修课' },
    { id: 'semi-sparta-toeic', name: '多益（半斯巴达）', tuition: 1100, suitable: '4节一对一 + 4节团体课 + 选修课' },
    { id: 'semi-sparta-business', name: '商务英语（半斯巴达）', tuition: 1100, suitable: '4节一对一 + 4节团体课 + 选修课' },
    { id: 'semi-sparta-social-media-english', name: '社交媒体英语（半斯巴达）', tuition: 1100, suitable: '4节一对一 + 4节团体课 + 选修课' },
  ];

  readonly studyPlans: StudyPlan[] = [
    {
      code: '斯巴达',
      name: '严格管理',
      title: '适合目标明确、想被学习节奏督促的学生',
      text: '每天有词汇早课和句型晚课（每节约25分钟）以及晚间自习。早课会占用早餐时段中的约25分钟，用制度帮助学生保持学习进度。',
      routine: '周一至周四不可外出，晚间安排更固定。',
      contrastTitle: '斯巴达多出的强制学习时段',
      timeBlocks: [
        { label: '强制早课', time: '07:00-08:00内25分钟', text: '词汇课程，占用早餐时段一部分', icon: 'wb_sunny', type: 'required' },
        { label: '强制晚课', time: '19:00-20:00内25分钟', text: '句型课程，晚饭后执行', icon: 'school', type: 'required' },
        { label: '强制自习', time: '20:00 - 22:00', text: '晚间自习，按制度完成', icon: 'edit_note', type: 'required' },
      ],
      curfew: [
        { day: '周一 - 周四', time: '不可外出' },
        { day: '周五', time: '17:00 - 24:00' },
        { day: '周六', time: '05:00 - 24:00' },
        { day: '周日', time: '05:00 - 22:00' },
      ],
    },
    {
      code: '半斯巴达',
      name: '弹性管理',
      title: '适合想学习英语，同时享受宿务生活的学生',
      text: '不强制每日词汇早课、句型晚课和晚间自习，学习之外保留更多外出和生活弹性。',
      routine: '周一至周四17:00后可外出，仍需遵守门禁时间。',
      contrastTitle: '半斯巴达不强制这些早晚时段',
      timeBlocks: [
        { label: '早上安排', time: '无强制早课', text: '正常早餐与晨间准备', icon: 'free_breakfast', type: 'flexible' },
        { label: '晚间安排', time: '无强制晚课', text: '晚饭后时间更弹性', icon: 'event_available', type: 'flexible' },
        { label: '外出规则', time: '17:00 后可外出', text: '周一至周四仍需22:00前返校', icon: 'directions_walk', type: 'flexible' },
      ],
      curfew: [
        { day: '周一 - 周四', time: '17:00 - 22:00' },
        { day: '周五', time: '17:00 - 24:00' },
        { day: '周六', time: '05:00 - 24:00' },
        { day: '周日', time: '05:00 - 22:00' },
      ],
    },
  ];

  readonly schedule: ScheduleItem[] = [
    { time: '06:30 - 07:30', title: '免费选修课', text: '斯巴达和半斯巴达学生都可以按兴趣参加。', appliesTo: '所有学生', icon: 'edit' },
    { time: '07:00 - 08:00', title: '斯巴达强制早课 / 词汇课程', text: '早课约25分钟，会占用早餐时段的一部分；半斯巴达学生正常早餐。', appliesTo: '斯巴达学生', icon: 'wb_sunny', highlighted: true },
    { time: '08:00 - 12:05', title: '上午课程', text: '一对一、小组课和团体课，共5节。', appliesTo: '所有学生', icon: 'menu_book' },
    { time: '12:05 - 13:05', title: '午餐', text: '校内餐厅用餐。', appliesTo: '所有学生', icon: 'restaurant' },
    { time: '13:05 - 17:10', title: '下午课程', text: '继续一对一、小组课和团体课，共5节。', appliesTo: '所有学生', icon: 'menu_book' },
    { time: '17:10 - 18:00', title: '自由时间 / 免费选修课', text: '可休息、运动或参加学校开放的免费选修课。', appliesTo: '所有学生', icon: 'self_improvement' },
    { time: '18:00 - 19:00', title: '晚饭 / 晚间活动', text: '晚间活动常见为健身、瑜伽等，具体以学校安排为准。', appliesTo: '所有学生', icon: 'nightlife' },
    { time: '19:00 - 20:00', title: '斯巴达强制晚课 / 句型课程', text: '句型课程约25分钟，安排在晚饭后；半斯巴达不强制。', appliesTo: '斯巴达学生', icon: 'school', highlighted: true },
    { time: '20:00 - 22:00', title: '斯巴达强制晚间自习', text: '斯巴达学生按要求完成晚间自习。', appliesTo: '斯巴达学生', icon: 'edit_note', highlighted: true },
  ];

  readonly electiveCourseGroups: ElectiveCourseGroup[] = [
    { period: '上午课程', level: '初级学生', courses: ['语法课程', '流利发音课', '成语&短语动词'] },
    { period: '下午课程', level: '中级学生', courses: ['CNN听力', '电影课', '讨论与辩论', '健身课', '瑜伽课', '商务演讲口语课', '外教口语课'] },
  ];

  roomFees: RoomFee[] = [
    { id: 'single', name: '单人间', fee: 1400, note: '热门房型建议提前6个月预定' },
    { id: 'double', name: '双人间', fee: 1030, note: '热门房型建议提前6个月预定' },
    { id: 'triple', name: '三人间', fee: 950, note: '校内住宿' },
    { id: 'quad-bunk', name: '四人间（上下铺）', fee: 900, note: '默认报价参考房型' },
    { id: 'off-campus-single', name: '校外公寓单人间', fee: 1550, note: '校外公寓，另计校外公寓管理费' },
    { id: 'off-campus-double', name: '校外公寓双人间', fee: 1150, note: '仅限两人同时预定，另计校外公寓管理费' },
  ];

  readonly serviceSteps: ProcessStep[] = [
    { icon: 'person_search', title: '判断斯巴达 / 半斯巴达是否适合', text: '先了解学习目标、自律程度、预算、年龄和入学时间，判断EV制度是否匹配。' },
    { icon: 'fact_check', title: '确认课程、空房和优惠', text: '免费协助确认课程、房型、空房、优惠和正式报价，避免只按网页价格做决定。' },
    { icon: 'assignment_turned_in', title: '协助入境和签证手续', text: '思达免费协助办理菲律宾入境及签证相关手续，学生只需按顾问指引准备个人资料。' },
    { icon: 'inventory', title: '发送学习资料和行前清单', text: '入学前免费发送学习资料、行李清单、费用清单和到校注意事项。' },
    { icon: 'support_agent', title: '到校后继续跟进', text: '遇到换老师、调课、学习方法、宿舍生活或学校沟通问题，也可以继续联系思达协助。' },
    { icon: 'location_on', title: '宿务当地支持', text: '思达在宿务有工作人员驻点，可提供当地支持，直到学生完成学习并顺利回国。' },
  ];

  readonly sidaEvReasons: SidaEvReason[] = [
    {
      number: '01',
      title: '正式合同与官方授权',
      text: '国内公司签约，EV报价、录取文件及收费凭证均可核验。',
      image: 'assets/cia/sida-why-action-contract.jpg',
      alt: '思达启航正式合同与学校文件核验',
    },
    {
      number: '02',
      title: '费用提前算清，同条件保价',
      text: '0中介服务费，学费、食宿费及EV到校费用逐项说明。',
      image: 'assets/cia/sida-why-action-fees.jpg',
      alt: '思达启航顾问为学生核算菲律宾游学费用',
    },
    {
      number: '03',
      title: '先判断斯巴达或半斯巴达是否适合',
      text: '根据目标、预算、自律程度和房型偏好，帮你判断EV是否匹配。',
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
      text: '换老师、课程、住宿、账单、续读或转校问题继续协助。',
      image: 'assets/cia/sida-why-action-followup.jpg',
      alt: '思达启航顾问持续跟进学生学习情况',
    },
    {
      number: '06',
      title: '深圳总部 + 菲律宾驻点服务',
      text: '国内顾问与宿务工作人员协作，重要节点有人跟进。',
      image: 'assets/cia/sida-why-action-team.jpg',
      alt: '思达启航菲律宾和深圳服务团队',
    },
  ];

  readonly sidaEvTrustBadges: SidaEvTrustBadge[] = [
    { icon: 'description', label: '国内正式公司合同' },
    { icon: 'verified_user', label: '学校合作与文件核验' },
    { icon: 'local_offer', label: '费用透明与同条件保价' },
    { icon: 'apartment', label: '深圳总部 + 菲律宾驻点' },
  ];

  readonly schoolServices = ['机场接机', '入学说明', '分级测试', '课程咨询', '24小时自习室', '宿舍清洁', '洗衣服务', '医护室', '校内保安', '证件协助'];
  readonly campusActivities = ['新生说明会', '文化交流', '体育活动', '校内比赛', '校园休闲活动'];
  readonly weekendActivities = ['市区商场', '咖啡厅与餐厅', '跳岛游', '海边活动', '学生自发聚会'];
  readonly notes = ['斯巴达和半斯巴达管理强度不同，报名之前要先确认自己能接受的学习纪律。', '热门房型、暑假和寒假档期建议尽早确认空房。', '未成年学生、亲子学生和长期学习学生，需要提前确认额外管理规则。', '到校支付费用会随学校政策、汇率和个人情况变化。', '最终报名以学校正式录取、付款节点和顾问确认报价为准。'];
  readonly faqs: FaqItem[] = [
    { question: '菲律宾宿务EV语言学校适合第一次菲律宾游学吗？', answer: '适合目标明确、能接受一定管理的学生。如果更想轻松体验宿务生活，可优先考虑半斯巴达或半斯巴达综合英语。' },
    { question: 'EV的斯巴达和半斯巴达怎么选？', answer: '斯巴达更适合冲刺型学生，日程、自习和门禁要求更强；半斯巴达适合想学习但也希望保留一定外出和生活弹性的学生。' },
    { question: '页面上的报价包含全部费用吗？', answer: '不包含全部。前期支付参考包含注册费、95折后的课程与住宿费，以及适用的未成年管理费和旺季附加费；到校后仍需支付SSP、SSP E-card、管理费、水电、教材、学生证及适用的签证费用。接机和可退押金单独列示。' },
    { question: 'EV适合亲子或未成年学生吗？', answer: '可以考虑，但15岁以下通常需父母陪同。报价器会为未满18岁学生按每4周100美元自动计入管理费，具体陪同、住宿和门禁规则仍需报名时确认。' },
    { question: '思达会协助签证和入境吗？', answer: '会。通过思达报名EV，思达顾问会免费协助菲律宾入境及签证相关手续，学生只需要按顾问指引准备个人资料。' },
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
    this.loadExchangeRates();
  }

  private loadExchangeRates(): void {
    this.exchangeRateService.getLatestCnyRates().pipe(catchError(() => EMPTY)).subscribe((snapshot) => {
      this.usdToCny = snapshot.usdToCny;
      this.phpPerCny = snapshot.phpPerCny;
      this.exchangeRateDate = snapshot.date;
      this.exchangeRateLive = true;
    });
  }

  private loadPricingFromDatabase(): void {
    this.schoolService.getSchools({ name: this.pricingSchoolName }).pipe(
      switchMap((schools) => {
        const school = schools.find((item) => item.name === this.pricingSchoolName) ?? schools[0];
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
    const databaseCourseFees = lessons.filter((lesson) => lesson.week === 4).map((lesson) => ({ id: this.createCourseId(lesson.name), name: lesson.name, tuition: lesson.price, suitable: lesson.description || lesson.note || '请联系顾问确认课程安排' })).filter((lesson) => this.courseFeeOrder.includes(lesson.id)).sort((a, b) => this.orderIndex(this.courseFeeOrder, a.id) - this.orderIndex(this.courseFeeOrder, b.id));
    if (databaseCourseFees.length === this.courseFeeOrder.length) { this.courseFees = databaseCourseFees; if (!this.courseFees.some((course) => course.id === this.selectedCourseId)) this.selectedCourseId = this.courseFees[0].id; }
    const databaseRoomFees = rooms.filter((room) => room.week === 4).map((room) => ({ id: this.createRoomId(room.name), name: room.name, fee: room.price, note: room.description || '请联系顾问确认空房' })).filter((room) => this.roomFeeOrder.includes(room.id)).sort((a, b) => this.orderIndex(this.roomFeeOrder, a.id) - this.orderIndex(this.roomFeeOrder, b.id));
    if (databaseRoomFees.length === this.roomFeeOrder.length) { this.roomFees = databaseRoomFees; if (!this.roomFees.some((room) => room.id === this.selectedRoomId)) this.selectedRoomId = this.roomFees.find((room) => room.id === 'quad-bunk')?.id ?? this.roomFees[this.roomFees.length - 1].id; }
    const registrationFee = fees.find((fee) => fee.name === '注册费'); if (registrationFee) this.registrationFee = registrationFee.fee;
    const peakSeasonFee = fees.find((fee) => fee.name === '旺季附加费'); if (peakSeasonFee && peakSeasonFee.fee > 0) this.seasonalFeePerWeek = peakSeasonFee.fee;
    const minorManagementFee = fees.find((fee) => fee.name === '未成年管理费'); if (minorManagementFee && minorManagementFee.fee > 0) this.minorManagementFeePerPeriod = minorManagementFee.fee;
  }

  setGalleryCategory(category: GalleryCategory): void { this.selectedGalleryCategory = category; }
  calculateQuote(): void { this.quoteCalculated = true; }
  openDatePicker(event: Event): void {
    const input = event.currentTarget as HTMLInputElement | null;
    if (!input || typeof input.showPicker !== 'function') return;
    try {
      input.showPicker();
    } catch {
      input.focus();
    }
  }
  scrollToSection(target: string, event?: Event): void { event?.preventDefault(); const targetElement = document.getElementById(target); if (!targetElement) return; const headerOffset = window.innerWidth <= 680 ? 132 : 92; const targetTop = targetElement.getBoundingClientRect().top + window.scrollY - headerOffset; window.scrollTo({ top: Math.max(targetTop, 0), behavior: 'smooth' }); window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#${target}`); }
  get filteredGalleryImages(): GalleryImage[] { return this.selectedGalleryCategory === '全部' ? this.galleryImages : this.galleryImages.filter((image) => image.category === this.selectedGalleryCategory); }
  get spartaCourseFees(): CourseFee[] { return this.courseFees.filter((course) => course.id.startsWith('sparta-')); }
  get semiSpartaCourseFees(): CourseFee[] { return this.courseFees.filter((course) => course.id.startsWith('semi-sparta-')); }
  get selectedCourse(): CourseFee { return this.courseFees.find((course) => course.id === this.selectedCourseId) ?? this.courseFees[0]; }
  get selectedRoom(): RoomFee { return this.roomFees.find((room) => room.id === this.selectedRoomId) ?? this.roomFees[this.roomFees.length - 1]; }
  get tuitionForSelectedWeeks(): number { return this.selectedCourse.tuition * this.durationPriceMultiplier(this.selectedWeeks); }
  get roomFeeForSelectedWeeks(): number { return this.selectedRoom.fee * this.durationPriceMultiplier(this.selectedWeeks); }
  get discountBase(): number { return this.tuitionForSelectedWeeks + this.roomFeeForSelectedWeeks; }
  get discountAmount(): number { return this.discountBase * (1 - this.discount); }
  get discountedCourseAndRoom(): number { return this.discountBase * this.discount; }
  get peakSeasonWeeks(): number {
    const startDate = this.parseLocalDate(this.selectedStartDate);
    const peakStart = this.parseLocalDate(this.peakSeasonStartDate);
    const peakEnd = this.parseLocalDate(this.peakSeasonEndDate);
    if (!startDate || !peakStart || !peakEnd) return 0;
    let overlappingWeeks = 0;
    for (let week = 0; week < this.selectedWeeks; week += 1) {
      const weekStart = new Date(startDate);
      weekStart.setDate(startDate.getDate() + week * 7);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      if (weekStart <= peakEnd && weekEnd >= peakStart) overlappingWeeks += 1;
    }
    return overlappingWeeks;
  }
  get isPeakSeason(): boolean { return this.peakSeasonWeeks > 0; }
  get seasonalSurcharge(): number { return this.peakSeasonWeeks * this.seasonalFeePerWeek; }
  get seasonalFeePerFourWeeks(): number { return this.seasonalFeePerWeek * 4; }
  get minorManagementPeriods(): number { return this.isMinorStudent ? Math.ceil(this.selectedWeeks / 4) : 0; }
  get minorManagementFee(): number { return this.minorManagementPeriods * this.minorManagementFeePerPeriod; }
  get quoteUsd(): number { return this.registrationFee + this.discountedCourseAndRoom + this.seasonalSurcharge + this.minorManagementFee; }
  get quoteUsdText(): string { return `${this.formatUsd(this.quoteUsd)} 美元起`; }
  get quoteCnyText(): string { const rounded = Math.round(this.quoteUsd * this.usdToCny); return `约 ${rounded.toLocaleString('zh-CN')} 元起`; }
  get exchangeRateText(): string { return this.exchangeRateLive && this.exchangeRateDate ? `参考汇率日期 ${this.exchangeRateDate}` : '暂按备用汇率估算'; }
  get discountText(): string { return '课程费和住宿费95折'; }
  get localFeePeriods(): number { return Math.max(1, Math.ceil(this.selectedWeeks / 4)); }
  get visaExtensionCount(): number { return Math.max(0, Math.ceil((this.selectedWeeks - 8) / 4)); }
  get visaExtensionFeeTotal(): number { return this.visaExtensionCount === 0 ? 0 : 5430 + (this.visaExtensionCount - 1) * 4700; }
  get usesOffCampusRoom(): boolean { return this.selectedRoomId.startsWith('off-campus'); }
  get roomDeposit(): number { return this.selectedWeeks <= 8 ? 3000 : 5000; }
  get localFees(): LocalFee[] {
    const periods = this.localFeePeriods;
    const acrQuantity = this.visaExtensionCount > 0 ? 1 : 0;
    const managementFee = this.usesOffCampusRoom ? 4000 : 2000;
    return [
      { item: 'SSP特殊学习许可证', amount: '7,800 比索 / 次', quantity: 1, total: 7800, note: '移民局收取，按报名学习时长办理；续费或换校需重新办理' },
      { item: 'SSP E-CARD', amount: '4,500 比索 / 次', quantity: 1, total: 4500, note: '入学时与SSP同时办理，只收一次' },
      { item: 'ACR-I Card 外国人身份证', amount: '4,000 比索 / 次', quantity: acrQuantity, total: 4000 * acrQuantity, note: '只要办理签证续签就需支付，由学校统一办理' },
      { item: this.usesOffCampusRoom ? '校外公寓管理费' : '校内管理费', amount: `${managementFee.toLocaleString('en-US')} 比索 / 4周`, quantity: periods, total: managementFee * periods, note: '设施维护费用，按每4周计算' },
      { item: '电费', amount: '2,000 比索 / 4周', quantity: periods, total: 2000 * periods, note: '每周超过15kW用电量，超出部分另收20比索/kW' },
      { item: '水费', amount: '1,200 比索 / 4周', quantity: periods, total: 1200 * periods, note: '公共用水和房间用水' },
      { item: '签证续签', amount: '5,430 比索 / 次', quantity: this.visaExtensionCount, total: this.visaExtensionFeeTotal, note: '首次续签约5,430比索，后续续签预计4,700比索/次；以移民局实收为准' },
      { item: '教材费', amount: '2,000 比索 / 4周', quantity: periods, total: 2000 * periods, note: '按不同课程和实际购买教材调整' },
      { item: '学生证', amount: '500 比索 / 次', quantity: 1, total: 500, note: '一次性费用' },
      { item: '宿务马克坦机场周日接机', amount: '1,200 比索 / 次', quantity: 0, total: 0, note: '可选，也可自行打车；默认不计入学杂费合计', excluded: true },
      { item: '房间押金', amount: `${this.roomDeposit.toLocaleString('en-US')} 比索 / 次`, quantity: 1, total: this.roomDeposit, note: '1至8周3,000比索，9至24周5,000比索；无损坏及欠费时可退', excluded: true },
    ];
  }
  get includedLocalFees(): LocalFee[] { return this.localFees.filter((fee) => !fee.excluded); }
  get excludedLocalFees(): LocalFee[] { return this.localFees.filter((fee) => fee.excluded); }
  get localFeesTotal(): number { return this.localFees.filter((fee) => !fee.excluded).reduce((sum, fee) => sum + fee.total, 0); }
  get localFeesCnyText(): string { return `约 ${Math.round(this.localFeesTotal / this.phpPerCny).toLocaleString('zh-CN')} 元`; }
  get quoteImageData() {
    const includedFees = this.localFees.filter((fee) => !fee.excluded);
    const optionalFees = this.localFees.filter((fee) => fee.excluded);

    return buildPhilippinesDetailedQuote({
      schoolCode: 'EV',
      schoolName: '菲律宾宿务EV Academy',
      filePrefix: 'EV',
      heroSrc: '/assets/ev/campus-exterior.jpg',
      weeks: this.selectedWeeks,
      startDate: this.selectedStartDate,
      usdToCny: this.usdToCny,
      totalUsd: this.quoteUsd,
      paymentItems: [
        { icon: '注', label: '注册费', amount: `${this.formatUsd(this.registrationFee)} 美元`, note: '一次性学校注册费' },
        { icon: '课', label: '课程费', amount: `${this.formatUsd(this.tuitionForSelectedWeeks)} 美元`, note: `${this.selectedCourse.name}；${this.selectedCourse.suitable}` },
        { icon: '宿', label: '住宿费', amount: `${this.formatUsd(this.roomFeeForSelectedWeeks)} 美元`, note: this.selectedRoom.name },
        ...(this.discountAmount > 0 ? [{ icon: '折', label: '思达折扣', amount: '95折', note: `优惠金额：${this.formatUsd(this.discountAmount)}美元`, accent: true }] : []),
        ...(this.seasonalSurcharge > 0 ? [{ icon: '旺', label: '旺季附加费', amount: `${this.formatUsd(this.seasonalSurcharge)} 美元`, note: `${this.formatUsd(this.seasonalFeePerWeek)}美元/周（每4周${this.formatUsd(this.seasonalFeePerFourWeeks)}美元）；${this.peakSeasonDateRange}覆盖${this.peakSeasonWeeks}周；不参与95折` }] : []),
        ...(this.minorManagementFee > 0 ? [{ icon: '未', label: '未成年管理费', amount: `${this.formatUsd(this.minorManagementFee)} 美元`, note: '未满18岁学生每4周100美元，按学习周数自动计算' }] : []),
      ],
      localFeeItems: includedFees.map((fee) => ({ label: fee.item, unit: fee.amount, quantity: String(fee.quantity), amount: this.formatPhp(fee.total), note: fee.note })),
      localFeeTotal: this.localFeesTotal,
      localFeeCny: Math.round(this.localFeesTotal / this.phpPerCny),
      localFeeNote: '接机和可退房间押金单独列示，实际以到校缴费为准。',
      optionalFeeItems: optionalFees.slice(0, 2).map((fee) => ({ label: fee.item, amount: this.formatPhp(fee.total || Number.parseFloat(fee.amount.replace(/[^0-9.]/g, '')) || 0), note: fee.note })),
      ruleNotes: [
        '课程费和住宿费按95折计算；注册费、旺季附加费和未成年管理费不参与折扣。',
        `旺季附加费为${this.formatUsd(this.seasonalFeePerWeek)}美元/周（每4周${this.formatUsd(this.seasonalFeePerFourWeeks)}美元），按${this.peakSeasonDateRange}的实际覆盖周数计算；未成年管理费按每4周自动计算。`,
      ],
    });
  }
  formatUsd(value: number): string { const roundedValue = Math.round((value + Number.EPSILON) * 10) / 10; return roundedValue.toLocaleString('en-US', { minimumFractionDigits: Number.isInteger(roundedValue) ? 0 : 1, maximumFractionDigits: 1 }); }
  formatPhp(value: number): string { return `${value.toLocaleString('en-US')} 比索`; }
  formatFeeQuantity(value: number): string { return value.toLocaleString('zh-CN', { maximumFractionDigits: 2 }); }
  private durationPriceMultiplier(weeks: number): number { if (weeks === 1) return 0.4; if (weeks === 2) return 0.65; if (weeks === 3) return 0.85; return weeks / 4; }
  private parseLocalDate(value: string): Date | null { const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value); return match ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3])) : null; }
  private createCourseId(name: string): string {
    const normalizedName = name.toLowerCase();
    if (name.includes('半斯巴达')) {
      if (name.includes('强化口说6')) return 'semi-sparta-power-speaking-6';
      if (name.includes('强化口说8')) return 'semi-sparta-power-speaking-8';
      if (name.includes('多益') || name.toLowerCase().includes('toeic')) return 'semi-sparta-toeic';
      if (name.includes('商务') || name.toLowerCase().includes('business')) return 'semi-sparta-business';
      if (name.includes('社交媒体')) return 'semi-sparta-social-media-english';
      if (name.includes('综合英语') || name.toLowerCase().includes('esl')) return 'semi-sparta-esl';
    }
    if (name.includes('斯巴达') || name.toLowerCase().includes('sparta')) {
      if (name.includes('Intensive ESL') || name.includes('强化英语')) return 'sparta-intensive-esl';
      if (name.includes('强化口说6') || name.includes('Power Speaking 6')) return 'sparta-power-speaking-6';
      if (name.includes('强化口说8') || name.includes('Power Speaking 8')) return 'sparta-power-speaking-8';
      if (name.includes('雅思保证')) return 'sparta-ielts-guarantee';
      if (name.includes('雅思') || name.toLowerCase().includes('ielts')) return 'sparta-ielts-regular';
      if (name.includes('多益') || name.toLowerCase().includes('toeic')) return 'sparta-toeic';
      if (name.includes('社交媒体')) return 'sparta-social-media-english';
      if (name.includes('商务') || name.toLowerCase().includes('business')) return 'sparta-business';
    }
    return this.slugifyPriceKey(name);
  }
  private slugifyPriceKey(value: string): string { return value.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
  private orderIndex(order: string[], value: string): number { const index = order.indexOf(value); return index === -1 ? Number.MAX_SAFE_INTEGER : index; }
  private createRoomId(name: string): string { if (name.includes('四人间（上下铺）')) return 'quad-bunk'; if (name.includes('校外公寓单')) return 'off-campus-single'; if (name.includes('校外公寓双')) return 'off-campus-double'; if (name.includes('单人') || name.includes('单间')) return 'single'; if (name.includes('双人')) return 'double'; if (name.includes('三人')) return 'triple'; if (name.includes('四人')) return 'quad-bunk'; return this.slugifyPriceKey(name); }
}

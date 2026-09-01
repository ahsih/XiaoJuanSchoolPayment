import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { catchError, EMPTY, forkJoin, switchMap } from 'rxjs';
import { ExpandableImageComponent } from '../../../components/expandable-image.component';
import {
  QuoteImageCardData,
  QuoteImageDownloadButtonComponent,
} from '../../../components/quote-image-download-button.component';
import { SchoolFeeDTO } from '../../../../interfaces/school-fees.dto';
import { SchoolLessonDTO } from '../../../../interfaces/school-lessons.dto';
import { SchoolPhotoDTO } from '../../../../interfaces/school-photo.dto';
import { SchoolRoomDTO } from '../../../../interfaces/school-rooms.dto';
import { ExchangeRateService } from '../../../../services/exchange-rate.service';
import { SchoolService } from '../../../../services/school.service';
import { CIA_STUDENT_REVIEWS } from './cia-student-reviews.data';

type GalleryCategory = '全部' | '校园' | '教室' | '住宿' | '餐厅' | '设施';

interface QuickInfo {
  icon: string;
  label: string;
  value: string;
  note: string;
}

interface GalleryImage {
  category: Exclude<GalleryCategory, '全部'>;
  title: string;
  description: string;
  src: string;
  gallery?: readonly string[];
  details?: string[];
}

const buildCiaRoomGallery = (folder: string, count: number): string[] =>
  Array.from(
    { length: count },
    (_, index) =>
      `/assets/cia/rooms-2026/gallery/${folder}/${folder}-${String(index + 1).padStart(2, '0')}.jpg?v=20260901`,
  );

const ciaRoomGalleries = {
  premium: buildCiaRoomGallery('premium', 6),
  pinnacle: buildCiaRoomGallery('pinnacle', 8),
  standard: buildCiaRoomGallery('standard', 6),
  twin: buildCiaRoomGallery('twin', 6),
  triple: buildCiaRoomGallery('triple', 6),
  quad: buildCiaRoomGallery('quad', 6),
  suite: buildCiaRoomGallery('suite', 6),
};

interface BasicInfoRow {
  label: string;
  value: string;
}

interface Highlight {
  image: string;
  title: string;
  text: string;
}

interface FitItem {
  title: string;
  text: string;
}

interface CourseItem {
  name: string;
  type: string;
  lessons: string;
  suitable: string;
  icon: string;
}

interface CourseFee {
  id: string;
  name: string;
  tuition: number;
  tuition2027: number;
  suitable: string;
  schedule: string;
  note: string;
  highlightNote?: boolean;
}

interface ScheduleItem {
  time: string;
  title: string;
  text: string;
}

interface RoomFee {
  id: string;
  name: string;
  fee: number;
  note: string;
}

interface RoomRateOption {
  id: string;
  label: string;
  code: string;
  location: '校内' | '校外';
}

interface RoomRateGroup {
  title: string;
  rooms: RoomRateOption[];
}

interface RoomComparisonProfile {
  id: string;
  label: string;
  englishName: string;
  bookingCode: string;
  location: '校内' | '校外';
  size: string;
  view: string;
  bed: string;
  service: string;
  suitable: string;
  highlights: string[];
  note: string;
  image: string;
  gallery: readonly string[];
  imageAlt: string;
}

interface CampusBuildingCard {
  code: string;
  title: string;
  icon: string;
  facilities: string[];
}

interface DailyScheduleRow {
  time: string;
  activity: string;
  kind: 'meal' | 'test' | 'class' | 'activity' | 'free';
}

interface HolidayCalendar {
  year: number;
  label: string;
  months: Array<{
    month: number;
    holidays: Array<{ day: string; name: string; provisional?: boolean }>;
  }>;
}

interface IeltsExamDate {
  month: number;
  academic: { day: string; weekday: string };
  general: { day: string; weekday: string };
}

interface CampusMonthlyEvent {
  month: number;
  icon: string;
  title: string;
  text: string;
  image: string;
  imageAlt: string;
  imagePosition?: string;
}

interface CourseDetailGuide {
  icon: string;
  title: string;
  subtitle: string;
  facts: Array<{ label: string; value: string }>;
  points: string[];
  image?: string;
  imageAlt?: string;
  imageCaption?: string;
  notice?: string;
}

interface LocalFee {
  item: string;
  amount: string;
  note: string;
}

interface LocalFeeEstimate {
  item: string;
  unitLabel: string;
  quantity: number;
  total: number;
  note: string;
}

interface ProcessStep {
  icon: string;
  title: string;
  text: string;
}

interface StudentCareService {
  icon: string;
  number: string;
  title: string;
  subtitle: string;
  text: string;
  location: string;
  schedule: string;
  points: string[];
}

interface CampusPracticalGuide {
  icon: string;
  eyebrow: string;
  title: string;
  facts: Array<{ label: string; value: string }>;
  note: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

interface SideNavItem {
  label: string;
  target: string;
  icon: string;
}

interface CtaConsultant {
  title: string;
  name: string;
  description: string;
  phone: string;
  phoneHref: string;
  avatarSrc: string;
  qrSrc: string;
  buttonLabel: string;
}

interface CourseMatchAdvisor {
  icon: string;
  title: string;
  name: string;
  text: string;
}

interface SidaCiaReason {
  number: string;
  title: string;
  text: string;
  image: string;
  alt: string;
}

interface SidaCiaTrustBadge {
  icon: string;
  label: string;
}

@Component({
  selector: 'app-cia-school',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatIconModule,
    ExpandableImageComponent,
    QuoteImageDownloadButtonComponent,
  ],
  templateUrl: './cia-school.component.html',
  styleUrl: './cia-school.component.css',
})
export class CiaSchoolComponent implements OnInit {
  private readonly schoolService = inject(SchoolService);
  private readonly exchangeRateService = inject(ExchangeRateService);
  private readonly ciaPricingSchoolName = 'CIA Cebu International Academy';
  private readonly shortTermPriceRatios: Readonly<Record<number, number>> = {
    1: 0.4,
    2: 0.6,
    3: 0.8,
  };
  private readonly quoteImageAssets = {
    logo: '/assets/sida-qihang-quote-header-logo-transparent.png',
    hero: '/assets/cia/campus-building.png',
    jennyAvatar: '/assets/contact/jenny-avatar.jpg',
    jennyQr: '/assets/contact/jenny-wechat-qr.png',
    lemonAvatar: '/assets/contact/lemon-avatar.jpg?v=20260901',
    lemonQr: '/assets/contact/lemon-wechat-qr.png',
    peninAvatar: '/assets/contact/penin-avatar.jpg',
    peninQr: '/assets/contact/penin-wechat-qr.png',
    lisaAvatar: '/assets/contact/lisa-avatar-cartoon.png',
    lisaQr: '/assets/contact/lisa-wechat-qr.png',
    irisAvatar: '/assets/contact/iris-avatar-cartoon.png',
    irisQr: '/assets/contact/iris-wechat-qr.png',
  };
  private readonly courseFeeOrder = [
    'regular-esl',
    'intensive-esl',
    'power-intensive',
    'pre-toeic',
    'toeic-regular',
    'toeic-guarantee',
    'pre-ielts',
    'ielts-regular',
    'ielts-guarantee',
    'business',
    'working-holiday',
    'callan-esl',
    'college-immersion',
  ];
  private readonly roomFeeOrder = [
    'p1',
    's1',
    'pn1',
    'd2',
    'd3',
    'd4',
    'sr1',
    'sr2',
    'sr3',
    'sr4',
  ];
  private readonly featuredGalleryCategories: ReadonlyArray<
    Exclude<GalleryCategory, '全部'>
  > = ['校园', '教室', '设施'];
  private readonly uploadedPhotoCategoryIndexes: Record<string, number> = {
    campus: 1,
    classroom: 2,
    accommodation: 3,
    dining: 4,
    facility: 5,
  };
  private readonly courseFeeDetails: Record<
    string,
    Pick<CourseFee, 'schedule' | 'note' | 'suitable' | 'highlightNote'>
  > = {
    'regular-esl': {
      suitable: '基础综合提升 / 可申请 Light ESL',
      schedule:
        '一对一4节 + 小组1节 + 中组1节 + 大组1节 + 选修1节 + 写作1节 + 自习1节',
      note: 'Regular ESL 均衡提升听说读写；Light ESL 需在出发前申请，可按学校规则减少部分课程。',
    },
    'intensive-esl': {
      suitable: '想增加一对一课时',
      schedule:
        '一对一5节 + 小组1节 + 中组1节 + 选修1节 + 写作1节 + 自习1节',
      note: '比 Regular ESL 多1节一对一，适合短期加强口语输出和老师纠音。',
    },
    'power-intensive': {
      suitable: '短期高强度口语突破',
      schedule:
        '一对一6节 + 小组1节 + 选修1节 + 写作1节 + 自习1节',
      note: '一对一比例最高，适合时间有限、希望集中补弱项的学生。',
    },
    'pre-toeic': {
      suitable: '托业预备 / 无入学分数要求',
      schedule:
        '托业一对一4节 + ESL小组1节 + TOEIC Clinic中组2节 + 选修1节 + 写作1节 + 自习2节',
      note: '4周为一个学习单元，每2周安排一次模拟考试，适合先建立托业基础。',
    },
    'toeic-regular': {
      suitable: '托业常规备考',
      schedule:
        '托业一对一4节 + 托业小组1节 + TOEIC Clinic中组2节 + 选修1节 + 写作1节 + 自习2节',
      note: '4周为一个学习单元，每2周安排一次模拟考试。',
    },
    'toeic-guarantee': {
      suitable: '托业600 / 700 / 800 / 900分保证班',
      schedule:
        '托业一对一4节 + 托业小组1节 + TOEIC Clinic中组2节 + 选修1节 + 写作1节 + 自习2节',
      note: '12周课程；入学参考分数为400 / 500 / 650 / 790分，并有出勤、每周模考和官方考试要求。',
    },
    'pre-ielts': {
      suitable: '雅思预备 / 无入学分数要求',
      schedule:
        '雅思一对一4节 + ESL小组1节 + IELTS Clinic中组2节 + 选修1节 + 写作1节 + 自习2节',
      note: '4周为一个学习单元，每2周安排一次模拟考试，适合先补齐雅思基础。',
    },
    'ielts-regular': {
      suitable: '雅思常规备考',
      schedule:
        '雅思一对一4节 + 雅思小组1节 + IELTS Clinic中组2节 + 选修1节 + 写作1节 + 自习2节',
      note: '建议雅思3.5分以上，4周为一个学习单元，每2周安排一次模拟考试。',
    },
    'ielts-guarantee': {
      suitable: '雅思5.5 / 6.0 / 6.5 / 7.0分保证班',
      schedule:
        '雅思一对一4节 + 雅思小组1节 + IELTS Clinic中组2节 + 选修1节 + 写作1节 + 自习2节；周一至周三另有强化晚课',
      note: '12周课程；入学参考分数为3.5–4.5 / 5.0–5.5 / 6.0 / 6.5分，并有出勤、每周四模考和官方考试要求。',
    },
    business: {
      suitable: '商务沟通、演示与职场写作',
      schedule:
        '商务一对一5节 + 商务小组1节 + 综合中组1节 + 选修1节 + 写作1节 + 自习2节',
      note: '入学参考为 CIA Level 4 或 TOEIC 400分；4或8周为一个单元，4周以上学生需完成商务PPT发表。',
    },
    'working-holiday': {
      suitable: '海外生活与面试沟通',
      schedule:
        'ESL一对一4节 + ESL小组1节 + 综合中组1节 + 外教/CNN大组1节 + 选修1节 + 写作1节 + 自习2节',
      note: '4周为一个学习单元，内容覆盖生存英语、求职准备和海外生活沟通。',
    },
    'callan-esl': {
      suitable: '高频问答与快速口语反应',
      schedule:
        'Callan一对一3节 + ESL一对一2节 + ESL小组1节 + 综合中组1节 + 选修1节 + 写作1节 + 自习2节',
      note: '4周为一个学习单元，通过快速问答、即时纠错和系统复习训练英语反应速度。',
    },
    'college-immersion': {
      suitable: '想参加IAU航空大学体验，报名时应选择此课程',
      schedule:
        'ESL一对一4节 + ESL小组1节 + 综合中组1节 + 外教/CNN大组1节 + 选修1节 + 写作1节 + 自习2节',
      note: '不是Regular ESL的临时加选课；4周为一个学习单元，另收IAU一次性注册费USD 50，详细旁听与证书说明见下方课程细节。',
    },
  };

  readonly galleryCategories: GalleryCategory[] = [
    '全部',
    '校园',
    '教室',
    '住宿',
    '餐厅',
    '设施',
  ];
  readonly galleryAlbumCategories: Exclude<GalleryCategory, '全部'>[] = [
    '校园',
    '教室',
    '住宿',
    '餐厅',
    '设施',
  ];
  selectedGalleryCategory: GalleryCategory = '全部';
  selectedGalleryImageIndex = 0;
  selectedHeroImageIndex = 0;
  usingUploadedGallery = false;

  registrationFee = 100;
  readonly discount = 0.95;
  seasonalFeePerWeek = 40;
  readonly peakSeasonRanges = [
    { label: '2026暑期', start: '2026-06-14', end: '2026-08-08' },
    { label: '2027寒假', start: '2027-01-17', end: '2027-02-13' },
    { label: '2027暑假', start: '2027-06-13', end: '2027-08-07' },
  ] as const;
  usdToCny = 7.2;
  phpPerCny = 9;
  exchangeRateDate = '';
  usingLiveExchangeRates = false;
  readonly weekOptions = [1, 2, 3, 4, 6, 8, 12, 16, 20, 24];

  selectedCourseId = 'regular-esl';
  selectedRoomId = 'd4';
  selectedRoomProfileId = 'premium-single';
  selectedWeeks = 4;
  selectedRegistrationDate = this.formatLocalDate(new Date());
  selectedStartDate = this.nextSundayDate();
  quoteCalculated = false;

  readonly quickInfo: QuickInfo[] = [
    {
      icon: 'apartment',
      label: '学校类型',
      value: '宿务麦克坦度假型校区',
      note: '半斯巴达管理',
    },
    {
      icon: 'groups',
      label: '适合人群',
      value: '15岁以上学生',
      note: '短期游学、备考、亲子和成人',
    },
    {
      icon: 'verified_user',
      label: '管理模式',
      value: '半斯巴达',
      note: '每日测试、门禁、出勤管理',
    },
    {
      icon: 'school',
      label: '课程选项',
      value: 'ESL / 考试 / 职场英语',
      note: '另有 Cambridge、Callan、大学沉浸与假期项目',
    },
    {
      icon: 'bed',
      label: '住宿房型',
      value: '单人到四人间',
      note: '校内住宿，热门房型需早确认',
    },
    {
      icon: 'event_available',
      label: '年龄要求',
      value: '15岁以上',
      note: '未成年学生建议提前确认监护安排',
    },
  ];

  galleryImages: GalleryImage[] = [
    {
      category: '校园',
      title: '校园泳池与主楼',
      description:
        'CIA 于2022年6月在麦克坦新校区正式开课，学习、住宿和生活设施集中在度假型校园内。',
      src: 'assets/cia/campus-sunset-aerial-enhanced.png',
      details: ['半斯巴达 Plus 校区', '周末可前往周边餐厅和景点'],
    },
    {
      category: '校园',
      title: '校园地图',
      description:
        '校区分为 Building 1、Building 2 和 Building 3，餐厅、CRO、诊所、健身房、图书馆、宿舍和篮球场等分布在不同楼栋。',
      src: 'assets/cia/campus-map.png',
      details: [
        'Building 2：餐厅、CRO、健身房、图书馆',
        'Building 3：宿舍、泳池平台、篮球场',
      ],
    },
    {
      category: '校园',
      title: '户外泳池',
      description:
        '主泳池位于校园中心，约50米宽，度假感强，是课后休息和校园活动常用区域。',
      src: 'assets/cia/campus-pool.jpg',
      details: ['平日 19:00-21:00', '周末 07:00-21:00'],
    },
    {
      category: '教室',
      title: '一对一教室',
      description:
        '一对一教室配备白板和桌面空间，适合口语纠音、写作反馈和考试专项训练。',
      src: 'assets/cia/one-to-one-class.png',
      details: ['253间一对一教室', '更容易集中注意力'],
    },
    {
      category: '教室',
      title: '小组课教室',
      description: '用于团体讨论、听说训练和课程互动。',
      src: 'assets/cia/small-group-class.jpg',
      details: ['17间小组教室', '适合互动练习'],
    },
    {
      category: '教室',
      title: '中组课教室',
      description: '中组课堂适合听说互动、主题讨论和课堂发表。',
      src: 'assets/cia/medium-group-class.jpg',
      details: ['24间中组教室', '练习讨论与表达'],
    },
    {
      category: '教室',
      title: '大组课教室',
      description: '大组课堂适合发表、演讲、辩论和更大型的课堂活动。',
      src: 'assets/cia/big-group-class.jpg',
      details: ['7间大组教室', '适合演讲与辩论训练'],
    },
    {
      category: '住宿',
      title: '豪华单人间 P-1',
      description: '校内大尺寸单人床房型，配有独立学习位置和简易料理区。',
      src: ciaRoomGalleries.premium[0],
      gallery: ciaRoomGalleries.premium,
      details: ['约21.85㎡，泳池景观参考', '电磁炉、洗手池及迷你冰箱'],
    },
    {
      category: '住宿',
      title: '校外单人间 PN-1',
      description: '位于学校对面的校外住宿楼，适合重视独立空间及智能设备的学生。',
      src: ciaRoomGalleries.pinnacle[0],
      gallery: ciaRoomGalleries.pinnacle,
      details: ['约15.5至16㎡，城市景观参考', '具体普通房或小复式布局须确认'],
    },
    {
      category: '住宿',
      title: '标准单人间 S-1',
      description: '校内紧凑型单人间，适合希望专注学习并保留个人空间的学生。',
      src: ciaRoomGalleries.standard[0],
      gallery: ciaRoomGalleries.standard,
      details: ['约14.3㎡，泳池景观参考', '独立书桌、书架与迷你冰箱'],
    },
    {
      category: '住宿',
      title: '双人间 D-2',
      description: '适合朋友同行，或希望有室友交流又保留一定生活空间的学生。',
      src: ciaRoomGalleries.twin[0],
      gallery: ciaRoomGalleries.twin,
      details: ['约24.84㎡，两张较宽单人床', '卫浴可能为干湿分区或一体式'],
    },
    {
      category: '住宿',
      title: '三人间 D-3',
      description: '适合希望控制预算，同时多和不同国籍室友练习英语的学生。',
      src: ciaRoomGalleries.triple[0],
      gallery: ciaRoomGalleries.triple,
      details: ['约31.05㎡，每人独立学习位', '卫生间与淋浴间分开'],
    },
    {
      category: '住宿',
      title: '四人间 D-4',
      description:
        '预算压力相对低，适合愿意和多位室友共同生活、增加英语使用机会的学生。',
      src: ciaRoomGalleries.quad[0],
      gallery: ciaRoomGalleries.quad,
      details: ['约31.8㎡，普通多人间中面积最大', '卫生间与淋浴间分开'],
    },
    {
      category: '住宿',
      title: '家庭精致套房 SR',
      description: '同一套房体系按实际入住人数对应SR-1至SR-4，适合亲子和家庭。',
      src: ciaRoomGalleries.suite[0],
      gallery: ciaRoomGalleries.suite,
      details: ['约31.18㎡，海景参考', '大冰箱、电视、微波炉及料理区'],
    },
    {
      category: '餐厅',
      title: '学生餐厅',
      description:
        '位于 Building 2 一楼，空间宽敞并配有空调，学校厨房每天提供不同餐食。',
      src: 'assets/cia/dining-hall.jpg',
      details: ['早餐、午餐、晚餐在校内餐厅', '周末也有用餐时段'],
    },
    {
      category: '餐厅',
      title: 'Cafe Bar',
      description: '咖啡吧提供饮品、轻食和点心，适合课后休息或和同学聊天。',
      src: 'assets/cia/cafe-bar.jpg',
      details: ['Building 2 一楼', '咖啡、蛋糕、松饼等轻食'],
    },
    {
      category: '设施',
      title: '健身房',
      description:
        '位于 Building 2 四楼，提供现代化健身器材，适合课后运动和保持体能。',
      src: 'assets/cia/fitness-center.jpg',
      details: ['平日 19:00-23:00', '周末 07:00-23:00'],
    },
    {
      category: '设施',
      title: '瑜伽与普拉提室',
      description:
        '配有普拉提核心床、凯迪拉克床、瑜伽垫和辅助训练器材，可用于伸展、瑜伽及普拉提活动。',
      src: 'assets/cia/yoga-pilates-room-official.jpg',
      details: ['CIA官方设施实景', '课程及开放安排以校内公告为准'],
    },
    {
      category: '设施',
      title: 'IDP IELTS 官方考场',
      description:
        '校内设有雅思官方考试场地，空间安静宽敞，方便雅思学生熟悉考试环境。',
      src: 'assets/cia/idp-testing-venue.jpg',
      details: ['Building 1 一楼和二楼', '适合雅思备考学生'],
    },
    {
      category: '设施',
      title: 'Recreation Room',
      description:
        '休闲娱乐室可用于活动、游戏和学生休息，帮助学生在学习之外放松。',
      src: 'assets/cia/recreation-room.jpg',
      details: ['Building 2 四楼', '平日课后和周末开放'],
    },
    {
      category: '设施',
      title: '图书馆 / 自习室',
      description:
        '图书馆空间宽敞，提供 ESL 教材和不同类型读物，适合自习和课后复习。',
      src: 'assets/cia/library.jpg',
      details: ['Building 2 四楼', '每天 06:00-23:00'],
    },
    {
      category: '设施',
      title: '小礼堂 / 放映空间',
      description:
        '配有阶梯座椅、投影及音响设备，可用于说明会、课程活动、演讲和校园集会。',
      src: 'assets/cia/auditorium-official.jpg',
      details: ['CIA官方设施实景', '具体用途与开放安排以学校公告为准'],
    },
    {
      category: '设施',
      title: '校内诊所',
      description:
        '诊所可处理轻微不适和基础医疗咨询，校内有护士，并可按需要联系医生。',
      src: 'assets/cia/clinic.jpg',
      details: ['Building 2 三楼', '平日 08:00-18:00'],
    },
    {
      category: '设施',
      title: '音乐与卡拉OK室',
      description:
        '位于 Building 2 四楼，配有点歌、音响和休息座位，适合课后与同学放松。',
      src: 'assets/cia/karaoke-room-official.jpg',
      details: ['学校官方设施图片', '具体开放时间以校内公告为准'],
    },
    {
      category: '设施',
      title: 'Mini Mart 校内商店',
      description:
        '可购买日用品、零食和饮品，临时补充生活用品更方便。',
      src: 'assets/cia/mini-mart-official.jpg',
      details: ['学校官方设施图片', '商品与营业时间以现场为准'],
    },
    {
      category: '设施',
      title: '户外篮球场',
      description:
        '可进行篮球、排球、羽毛球及部分团体运动，位于校园户外活动区。',
      src: 'assets/cia/activity-sportsfest-official.jpg',
      details: ['CIA官方篮球活动实景', '活动安排以校内公告为准'],
    },
    {
      category: '设施',
      title: '羽毛球活动',
      description:
        '户外活动区可架设球网进行羽毛球；图为 CIA 校内 Sportsfest 羽毛球比赛实景。',
      src: 'assets/cia/badminton-sportsfest-official.jpg',
      details: ['CIA官方 Sportsfest 2024 实景', '日常使用及活动安排以校内公告为准'],
    },
  ];

  readonly basicInfo: BasicInfoRow[] = [
    { label: '学校名称', value: '菲律宾宿务 CIA 语言学校' },
    { label: '所在地区', value: 'Lapu-Lapu City, Mactan, Cebu' },
    { label: '创校时间', value: '2003年创校，麦克坦新校区2022年6月正式开课' },
    { label: '学生容量', value: '约600名学生' },
    { label: '教师规模', value: '约300名教师' },
    { label: '管理模式', value: '半斯巴达：每日测试、出勤、门禁和EOP管理' },
    { label: '住宿房型', value: '单人、双人、三人、四人及家庭精致套房；另有PN-1校外单人间' },
    {
      label: '核心资源',
      value: 'IDP IELTS官方考点、Cambridge ESL备考体系、24小时CRO学生支援',
    },
  ];

  readonly highlights: Highlight[] = [
    {
      image: 'assets/cia/quad-room.jpg',
      title: '预算房型清楚',
      text: '四人间 D-4 是默认预算参考，适合先估算总费用。',
    },
    {
      image: 'assets/cia/campus-building.png',
      title: '校内生活集中',
      text: '上课、住宿、餐厅和设施都在同一校区，适合第一次游学。',
    },
    {
      image: 'assets/cia/one-to-one-class.png',
      title: '一对一比例高',
      text: 'ESL、考试和商务方向都能搭配一对一课程。',
    },
    {
      image: 'assets/cia/dining-hall.jpg',
      title: '生活配套成熟',
      text: '餐厅、健身房、泳池、医务和学生服务都比较完整。',
    },
  ];

  readonly suitableFor: FitItem[] = [
    {
      title: '第一次去菲律宾游学',
      text: '希望课程、住宿、餐厅、接机和校园服务集中，减少适应压力。',
    },
    {
      title: '想认真学但不想完全封闭',
      text: '能接受每日测试和门禁，也希望保留一定休息和周末生活。',
    },
    {
      title: '重视校园环境和住宿',
      text: '希望学校设施较新，宿舍、餐厅、泳池和健身房都在校内。',
    },
    {
      title: '准备 IELTS / TOEIC',
      text: '需要考试课程、模考安排和校内考点氛围。',
    },
  ];

  readonly notSuitableFor: FitItem[] = [
    {
      title: '只想完全自由生活',
      text: 'CIA 仍有出勤、门禁、每日测试和校内规则，需要配合管理。',
    },
    {
      title: '预算非常紧',
      text: '环境和设施较好，单人间、旺季和当地费用会明显拉高预算。',
    },
    {
      title: '临近旺季才决定',
      text: '暑假、寒假、亲子和热门房型空房紧张，报价需要先确认。',
    },
    {
      title: '只看图片就想定校',
      text: '建议先确认课程强度、房型、到校费用和个人学习目标是否匹配。',
    },
  ];

  readonly courses: CourseItem[] = [
    {
      name: 'Regular ESL / Light ESL',
      type: '综合英语 / 可申请轻量课表',
      lessons: '4节一对一 + 小组、中组、大组、选修、写作与自习',
      suitable: '适合第一次游学、希望稳步提升听说读写，或需要较灵活课表的学生。',
      icon: 'school',
    },
    {
      name: 'Intensive ESL',
      type: '强化英语',
      lessons: '5节一对一 + 小组、中组、选修、写作与自习',
      suitable: '适合短期想加强口语表达和老师纠音的学生。',
      icon: 'menu_book',
    },
    {
      name: 'Power Intensive',
      type: '高强度一对一',
      lessons: '6节一对一 + 小组、选修、写作与自习',
      suitable: '适合4周左右集中突破口语、听力和表达的学生。',
      icon: 'psychology',
    },
    {
      name: 'Pre / Regular IELTS',
      type: '雅思预备与常规备考',
      lessons: '雅思一对一4节 + Clinic中组2节 + 小组、选修、写作与自习',
      suitable: 'Pre 无入学分数要求；Regular 建议雅思3.5分以上。',
      icon: 'edit_note',
    },
    {
      name: 'IELTS Guarantee',
      type: '雅思保证班',
      lessons: '12周课程 + 周一至周三强化晚课 + 每周四模考',
      suitable: '适合目标明确、能接受严格出勤和模考要求的学生。',
      icon: 'workspace_premium',
    },
    {
      name: 'Pre / Regular / Guarantee TOEIC',
      type: '托业预备、常规与保证班',
      lessons: '托业一对一4节 + Clinic中组2节 + 小组、选修、写作与自习',
      suitable: '适合求职、升学或有600–900分目标的学生。',
      icon: 'verified',
    },
    {
      name: 'Business',
      type: '商务英语',
      lessons: '商务一对一5节 + 商务小组、综合中组、选修、写作与自习',
      suitable: '适合职场人士或准备英文工作场景的学生。',
      icon: 'business_center',
    },
    {
      name: 'Working Holiday',
      type: '打工度假英语',
      lessons: '生存英语、求职准备、面试表达和海外生活沟通',
      suitable: '适合准备海外生活、打工度假或长线旅行的人群。',
      icon: 'travel_explore',
    },
    {
      name: 'Callan ESL',
      type: '快速口语反应训练',
      lessons: '3节Callan一对一 + 2节ESL一对一 + 小组、选修、写作与自习',
      suitable: '适合想通过高频问答、即时纠错和重复训练加快英语反应的学生。',
      icon: 'record_voice_over',
    },
    {
      name: 'College Immersion（IAU）',
      type: 'IAU航空大学沉浸课程',
      lessons: 'ESL一对一4节 + 小组、中组、大组、选修、写作与自习',
      suitable: '想旁听IAU航空大学课程的学生应选择这一项；不是在Regular ESL上另加一节选修课。',
      icon: 'account_balance',
    },
  ];

  readonly campusBuildings: CampusBuildingCard[] = [
    {
      code: '01',
      title: '1号楼 · 考试与服务',
      icon: 'fact_check',
      facilities: ['IDP IELTS官方考场', 'Mini Mart校内商店', '旅行社服务点'],
    },
    {
      code: '02',
      title: '2号楼 · 教学与生活',
      icon: 'apartment',
      facilities: ['宿舍服务台与行政办公室', '咖啡吧、学生餐厅与护士站', '教室、健身房、图书馆与小礼堂', '瑜伽及普拉提活动空间'],
    },
    {
      code: '03',
      title: '3号楼 · 宿舍与教务',
      icon: 'bed',
      facilities: ['校内宿舍', '洗衣房', '教务处', '教学教室'],
    },
    {
      code: 'OUTDOOR',
      title: '中庭 · 户外活动',
      icon: 'pool',
      facilities: ['约50米主泳池', '户外休息区', '篮球、排球及羽毛球活动场地'],
    },
  ];

  readonly weekdaySchedule: DailyScheduleRow[] = [
    { time: '06:40–08:00', activity: '早餐', kind: 'meal' },
    { time: '07:20–08:00', activity: '每日晨考', kind: 'test' },
    { time: '08:00–08:45', activity: '第1节', kind: 'class' },
    { time: '08:50–09:35', activity: '第2节', kind: 'class' },
    { time: '09:40–10:25', activity: '第3节', kind: 'class' },
    { time: '10:30–11:15', activity: '第4节', kind: 'class' },
    { time: '11:20–12:05', activity: '第5节', kind: 'class' },
    { time: '12:05–13:05', activity: '午餐', kind: 'meal' },
    { time: '13:05–13:50', activity: '第6节', kind: 'class' },
    { time: '13:55–14:40', activity: '第7节', kind: 'class' },
    { time: '14:45–15:30', activity: '第8节', kind: 'class' },
    { time: '15:35–16:20', activity: '第9节', kind: 'class' },
    { time: '16:25–17:10', activity: '第10节', kind: 'class' },
    { time: '17:15–18:00', activity: '第11节', kind: 'class' },
    { time: '18:00–19:00', activity: '晚餐', kind: 'meal' },
    { time: '19:00–22:00', activity: '自由时间 / 保证班指定晚间学习', kind: 'free' },
  ];

  readonly fridaySchedule: DailyScheduleRow[] = [
    { time: '06:40–08:00', activity: '早餐', kind: 'meal' },
    { time: '08:00–08:40', activity: '第1节', kind: 'class' },
    { time: '08:45–09:25', activity: '第2节', kind: 'class' },
    { time: '09:30–10:10', activity: '第3节', kind: 'class' },
    { time: '10:15–10:55', activity: '第4节', kind: 'class' },
    { time: '11:00–11:40', activity: '第5节', kind: 'class' },
    { time: '11:45–12:25', activity: '第6节', kind: 'class' },
    { time: '12:25–13:30', activity: '午餐', kind: 'meal' },
    { time: '13:30–14:10', activity: '第7节', kind: 'class' },
    { time: '14:15–14:55', activity: '第8节', kind: 'class' },
    { time: '15:00–15:40', activity: '第9节', kind: 'class' },
    { time: '15:45–16:25', activity: '第10节', kind: 'class' },
    { time: '16:30–17:10', activity: '第11节', kind: 'class' },
    { time: '17:10–18:00', activity: '演讲、朗读竞赛或月度活动', kind: 'activity' },
    { time: '18:00–19:00', activity: '晚餐', kind: 'meal' },
    { time: '19:00–24:00', activity: '自由时间', kind: 'free' },
  ];

  readonly holidayCalendars: HolidayCalendar[] = [
    {
      year: 2027,
      label: '规划2027年入学时优先查看',
      months: [
        { month: 1, holidays: [{ day: '1日', name: '元旦' }] },
        {
          month: 3,
          holidays: [
            { day: '9日或10日', name: '开斋节', provisional: true },
            { day: '25日', name: '濯足节' },
            { day: '26日', name: '耶稣受难日' },
          ],
        },
        {
          month: 4,
          holidays: [
            { day: '9日', name: '勇士日' },
            { day: '27日', name: '拉普拉普胜利纪念日' },
          ],
        },
        {
          month: 5,
          holidays: [{ day: '16日或17日', name: '宰牲节', provisional: true }],
        },
        { month: 6, holidays: [{ day: '18日', name: '拉普拉普市宪章日' }] },
        {
          month: 8,
          holidays: [
            { day: '6日', name: '宿务省宪章日' },
            { day: '30日', name: '国家英雄日' },
          ],
        },
        { month: 9, holidays: [{ day: '10日', name: '奥斯梅尼亚日' }] },
        {
          month: 11,
          holidays: [
            { day: '1日', name: '诸圣节' },
            { day: '2日', name: '万灵节' },
          ],
        },
        {
          month: 12,
          holidays: [
            { day: '3日', name: '博尼法西奥日' },
            { day: '8日', name: '圣母无染原罪瞻礼' },
            { day: '24日', name: '平安夜' },
            { day: '30日', name: '黎刹日' },
            { day: '31日', name: '除夕' },
          ],
        },
      ],
    },
    {
      year: 2026,
      label: '2026年在读学生参考',
      months: [
        { month: 1, holidays: [{ day: '1日', name: '元旦' }] },
        { month: 2, holidays: [{ day: '17日', name: '农历新年' }] },
        {
          month: 3,
          holidays: [{ day: '20日', name: '开斋节', provisional: true }],
        },
        {
          month: 4,
          holidays: [
            { day: '2日', name: '濯足节' },
            { day: '3日', name: '耶稣受难日' },
            { day: '10日', name: '勇士日' },
            { day: '27日', name: '拉普拉普胜利纪念日' },
          ],
        },
        {
          month: 5,
          holidays: [
            { day: '1日', name: '劳动节' },
            { day: '29日', name: '宰牲节', provisional: true },
          ],
        },
        {
          month: 6,
          holidays: [
            { day: '12日', name: '独立日' },
            { day: '17日', name: '拉普拉普市宪章日' },
          ],
        },
        {
          month: 8,
          holidays: [
            { day: '7日', name: '宿务省宪章日' },
            { day: '21日', name: '尼诺·阿基诺日' },
            { day: '31日', name: '国家英雄日' },
          ],
        },
        { month: 9, holidays: [{ day: '9日', name: '奥斯梅尼亚日' }] },
        {
          month: 11,
          holidays: [
            { day: '2日', name: '万灵节' },
            { day: '30日', name: '博尼法西奥日' },
          ],
        },
        {
          month: 12,
          holidays: [
            { day: '8日', name: '圣母无染原罪瞻礼' },
            { day: '24日', name: '平安夜' },
            { day: '25日', name: '圣诞节' },
            { day: '30日', name: '黎刹日' },
            { day: '31日', name: '除夕' },
          ],
        },
      ],
    },
  ];

  readonly ieltsExamDates2026: IeltsExamDate[] = [
    { month: 1, academic: { day: '31日', weekday: '周六' }, general: { day: '15日', weekday: '周四' } },
    { month: 2, academic: { day: '14日', weekday: '周六' }, general: { day: '21日', weekday: '周六' } },
    { month: 3, academic: { day: '14日', weekday: '周六' }, general: { day: '21日', weekday: '周六' } },
    { month: 4, academic: { day: '23日', weekday: '周四' }, general: { day: '25日', weekday: '周六' } },
    { month: 5, academic: { day: '16日', weekday: '周六' }, general: { day: '23日', weekday: '周六' } },
    { month: 6, academic: { day: '27日', weekday: '周六' }, general: { day: '20日', weekday: '周六' } },
    { month: 7, academic: { day: '18日', weekday: '周六' }, general: { day: '25日', weekday: '周六' } },
    { month: 8, academic: { day: '29日', weekday: '周六' }, general: { day: '22日', weekday: '周六' } },
    { month: 9, academic: { day: '26日', weekday: '周六' }, general: { day: '17日', weekday: '周四' } },
    { month: 10, academic: { day: '10日', weekday: '周六' }, general: { day: '17日', weekday: '周六' } },
    { month: 11, academic: { day: '14日', weekday: '周六' }, general: { day: '28日', weekday: '周六' } },
    { month: 12, academic: { day: '19日', weekday: '周六' }, general: { day: '12日', weekday: '周六' } },
  ];

  readonly campusMonthlyEvents2026: CampusMonthlyEvent[] = [
    { month: 1, icon: 'festival', title: '菲律宾文化节', text: '通过节庆主题活动认识菲律宾文化。', image: 'assets/cia/events-2026/01-cultural-festival.jpg', imageAlt: 'CIA菲律宾文化节传统服饰表演', imagePosition: 'center 24%' },
    { month: 2, icon: 'favorite', title: '情人节特别活动', text: '校园主题互动与水果派对。', image: 'assets/cia/events-2026/02-valentine-fruit-party.jpg', imageAlt: 'CIA情人节特别活动现场互动', imagePosition: 'center 30%' },
    { month: 3, icon: 'notifications_active', title: '金铃挑战赛', text: '结合各国文化服饰的趣味竞赛。', image: 'assets/cia/events-2026/03-golden-bell.jpg', imageAlt: 'CIA金铃挑战赛参赛学生', imagePosition: 'center 28%' },
    { month: 4, icon: 'water', title: '夏日泡沫派对', text: '融入宋干节元素的夏日水上活动。', image: 'assets/cia/events-2026/04-summer-splash.jpg', imageAlt: 'CIA夏日泡沫派对合影', imagePosition: 'center 34%' },
    { month: 5, icon: 'sports_basketball', title: 'CIA篮球赛', text: '在真实篮球比赛中以团队协作增进交流。', image: 'assets/cia/activity-sportsfest-official.jpg', imageAlt: 'CIA校园篮球比赛实景', imagePosition: 'center 34%' },
    { month: 6, icon: 'mic', title: '开放麦克风与校庆', text: '开放舞台，并庆祝CIA创校周年。', image: 'assets/cia/events-2026/06-open-mic.jpg', imageAlt: 'CIA开放麦克风比赛现场' },
    { month: 7, icon: 'music_note', title: 'CIA达人秀', text: '学生展示音乐、舞蹈与个人才艺。', image: 'assets/cia/events-2026/07-got-talent.jpg', imageAlt: 'CIA达人秀学生舞台表演' },
    { month: 8, icon: 'styler', title: 'CIA校园风采活动', text: 'Mr. & Ms. CIA主题校园活动。', image: 'assets/cia/events-2026/08-mr-ms-cia.jpg', imageAlt: 'Mr. and Ms. CIA校园风采活动合影' },
    { month: 9, icon: 'diversity_3', title: '世界文化舞蹈', text: '用舞蹈认识不同国家与文化。', image: 'assets/cia/events-2026/09-dances-around-world.jpg', imageAlt: 'CIA世界文化舞蹈表演' },
    { month: 10, icon: 'celebration', title: '万圣节派对与员工日', text: '节日装扮、互动游戏与校园庆祝。', image: 'assets/cia/events-2026/10-halloween.jpg', imageAlt: 'CIA万圣节服装活动舞台现场' },
    { month: 11, icon: 'public', title: 'CIA国际文化日', text: '各国学生参与文化展示与美食节。', image: 'assets/cia/events-2026/11-national-day.jpg', imageAlt: 'CIA国际文化日学生展示现场' },
    { month: 12, icon: 'card_giftcard', title: 'CIA圣诞派对', text: '以圣诞主题活动为全年校园生活收尾。', image: 'assets/cia/events-2026/12-white-christmas.jpg', imageAlt: 'CIA白色圣诞主题舞台活动' },
  ];

  readonly courseDetailGuides: CourseDetailGuide[] = [
    {
      icon: 'record_voice_over',
      title: 'ESL一般英语与选修课',
      subtitle: '综合英语能力、强制写作与14类选修方向',
      facts: [
        { label: '团体人数', value: '小团体1–6人 / 中团体6–15人 / 大团体15–20人' },
        { label: '写作安排', value: '按程度指定题目与字数，隔日由老师批改' },
        { label: '入学分级', value: '入学测试决定L0–L10等级，并对应CEFR Pre-A1至C2' },
        { label: '程度测验', value: '通常每4周1次；仅读4周者第4周可选择不参加' },
        { label: '选修方式', value: '提交第一、第二、第三志愿，每周可申请换课' },
      ],
      points: [
        'Regular、Intensive与Power Intensive通过不同数量的一对一课，训练听、说、读、写、语法和词汇。',
        '学校按实际应上课日统计出勤；请假同样计入出勤率。总出勤低于90%可能无法取得结业证，低于50%可能被开除且不退款。',
        '一周内缺席超过5节课（请假除外），学校资料列明下一周末可能暂停外出。晨考、写作字数与合格分数会随课程和级别不同。',
        'Light ESL需提前特别申请；可申请放弃不超过50%的课程，但不退被放弃课程费用。',
        'Light ESL的晨考和写作可选择参加；连续两次未参加会自动取消，需向教务申请并在两周后恢复。到校后改为Light ESL，学校资料列明需另付200美元。',
        '选修方向包括IELTS / TOEIC / Business Open、Conversation Club、Public Speaking、Reel English、Movie Class、Dance、Hello Pops、Guitar、Uke ’n’ Talk、Callan训练、商务经济英语和母语外教课等；名额已满时会按后续志愿或自由时间安排。',
      ],
      notice: '课程、选修名额、晨考分数与外出规则可能按等级和学期调整，以入学测试、教务排课及当期校规为准。',
    },
    {
      icon: 'workspace_premium',
      title: 'TOEIC预备、常规与保证班',
      subtitle: '明确目标分数、每周模考与12周保证班要求',
      facts: [
        { label: 'Pre-TOEIC', value: '无入学门槛；4周为单位；每2周1次模考' },
        { label: '保证目标', value: '600 / 700 / 800 / 900分' },
        { label: '入学分数', value: '分别为400 / 500 / 650 / 790分以上' },
      ],
      points: [
        '保证班需读满12周，出勤率达到95%，每周模考出勤率100%，并在读期间参加一次官方考试。',
        '周一至周三另有约1.5小时强制晚自习；校规和扣点规则与一般学生相同。',
        '符合条件但校内模考未达到目标分数时，学校资料列明可承担延长4周的课程费；住宿及学杂费由学生承担。',
        '符合保证班条件者可申请一次官方考试相关权益，需保留并提交正式考试收据。',
      ],
      notice: '保证权益须满足全部条件，并以学校审核、当期考务安排和正式说明为准。',
    },
    {
      icon: 'fact_check',
      title: 'IELTS预备、常规与保证班',
      subtitle: '校内IDP考试资源与分数分级入学',
      facts: [
        { label: 'Pre-IELTS', value: '入学测试3.0分及以下；后续模考达3.5分可转常规雅思' },
        { label: 'Regular IELTS', value: '入学测试3.5分及以上' },
        { label: '常规模考', value: '通常每周四15:30–19:00；口语时间另行通知' },
        { label: '保证目标', value: '5.5 / 6.0 / 6.5 / 7.0分' },
        { label: '入学分数', value: '3.5–4.5 / 5.0–5.5 / 6.0 / 6.5分' },
      ],
      points: [
        '预备雅思晨考通常需达到4分、周累计16分，写作约80–200词；常规雅思晨考通常需达到7分、周累计26分，写作约100–250词。',
        '保证班需读满12周，出勤率达到95%，每周四模考出勤率100%，并在读期间参加一次官方考试。',
        '符合条件者可按学校流程申请一次官方考试费权益；学校资料中的参考金额为₱13,660，需提交考试收据。',
        '符合全部条件但未达到目标分数时，学校资料列明可承担延长4周课程费及一次官方考试费；住宿与其他费用由学生承担。',
      ],
      notice: '考试费金额和保证权益会随官方考务政策调整，报名时须再次书面确认。',
    },
    {
      icon: 'business_center',
      title: '商务英语与打工度假',
      subtitle: '职场沟通、求职准备与毕业发表',
      facts: [
        { label: '商务英语门槛', value: 'CIA Level 4或TOEIC 400分以上' },
        { label: '商务英语周期', value: '4周或8周为一个单元' },
        { label: '程度测验', value: '每4周1次，缺席可能影响下一周外出' },
        { label: 'Working Holiday', value: '无入学门槛；4周为一个单元' },
      ],
      points: [
        '商务英语覆盖英文简报、谈判、商务书写、主持英文会议与商业咨询等实用场景。',
        '商务英语晨考通常要求每日7分、周累计26分；出勤低于90%可能无法取得结业证，低于50%可能被开除且不退款。',
        '商务英语学生毕业周需在小礼堂完成商务主题PPT发表；不参加时学校资料列明可能收取₱2,500。',
        'Working Holiday包含ESL听说、生存英语与求职准备，并搭配小组、中组及外教/CNN课程。',
      ],
    },
    {
      icon: 'speed',
      title: 'Callan快速口语课程',
      subtitle: '通过高频问答训练英语反应速度',
      facts: [
        { label: '对应报名课程', value: 'Callan ESL' },
        { label: '学习单位', value: '无入学门槛；4周为单位' },
      ],
      points: [
        'Callan课程以快速问答、即时纠错、自然缩略语和系统重复训练，提升英语反应速度。',
        '每日包含3节Callan一对一、2节ESL一对一，并搭配小组、中组、选修、写作和自习。',
      ],
    },
    {
      icon: 'flight_takeoff',
      title: 'IAU大学沉浸课程',
      subtitle: '想旁听Indiana Aerospace University课程，请选College Immersion',
      facts: [
        { label: '对应报名课程', value: 'College Immersion（IAU大学沉浸）' },
        { label: '基本安排', value: '4周为单位；每4周至少6小时IAU旁听' },
        { label: 'IAU注册费', value: '一次性USD 50，课程费以入学年份价格表为准' },
        { label: '预约时间', value: '建议至少提前4周确认方向、课表与名额' },
      ],
      points: [
        'College Immersion是独立的CIA课程安排，不是报名Regular ESL后临时增加的一节选修课；报名时应明确备注“IAU大学沉浸”。',
        'CIA日常英语课程包括ESL一对一4节、小组1节、中组1节、大组1节、选修1节、写作1节与自习2节。',
        'IAU旁听通常分为2次、每次3小时，每次可能旁听1–3门课；CIA负责协调日期、课表和往返交通。',
        '可申请航空航天工程、飞机维修、航空公司管理、飞行方向航空技术、航空电子、旅游管理、酒店管理及教育等方向，实际以IAU当期课表为准。',
        '常规4周旁听完成后对应观察与参与类证明；如目标是60小时完成证明或大学学分，必须在报名时单独提出并确认，不可默认包含。',
      ],
      image: 'assets/cia/iau-immersion-certificate-sample.png',
      imageAlt: 'IAU六十小时沉浸项目完成证书样式',
      imageCaption: 'IAU 60小时完成证书样式仅作类型说明；常规4周旁听不等同于默认获得该证书。',
      notice: '旁听科目、开课日期、名额、证书类型及学分认可均可能调整；最终以CIA与IAU书面确认，以及学生原就读院校的学分认定结果为准。',
    },
    {
      icon: 'nightlight_round',
      title: 'Evening Intensive 晚间强化课',
      subtitle: '两周一期的免费加课，适合希望利用晚间增加学习量的学生',
      facts: [
        { label: '上课时间', value: '周一至周四19:00–21:00' },
        { label: '课程周期', value: '每2周一期，每晚2小时集中训练' },
        { label: '课程级别', value: '可按当前水平选择初级或中级班' },
        { label: '课程费用', value: '课程本身免费；报名时需缴₱2,000可退押金' },
        { label: '适合人群', value: '英语基础较弱、希望系统巩固或学有余力的学生' },
      ],
      points: [
        '课程通过集中的晚间训练进一步巩固英语；学生可根据自身水平选择对应班级。',
        '报名地点为学校3号楼教务处；每期是否开班取决于报名人数，以教务处公告为准。',
        '报名确认后通常不可撤销；未按时上课会计入最终出勤。迟到每次可能扣₱100，缺席每次可能扣₱200。',
        '累计缺席3次或主动退出课程时，学校资料列明可能不退押金并取消课程资格。',
      ],
      notice: '开班人数、报名方式、押金退还与扣费规则可能调整，仅供参考，最终以到校后教务处公告和现场说明为准。',
    },
  ];

  courseFees: CourseFee[] = [
    {
      id: 'regular-esl',
      name: 'Regular ESL',
      tuition: 900,
      tuition2027: 1000,
      ...this.courseFeeDetails['regular-esl'],
    },
    {
      id: 'intensive-esl',
      name: 'Intensive ESL',
      tuition: 1000,
      tuition2027: 1100,
      ...this.courseFeeDetails['intensive-esl'],
    },
    {
      id: 'power-intensive',
      name: 'Power Intensive',
      tuition: 1100,
      tuition2027: 1200,
      ...this.courseFeeDetails['power-intensive'],
    },
    {
      id: 'pre-toeic',
      name: 'Pre-TOEIC',
      tuition: 1000,
      tuition2027: 1100,
      ...this.courseFeeDetails['pre-toeic'],
    },
    {
      id: 'toeic-regular',
      name: 'TOEIC Regular',
      tuition: 1000,
      tuition2027: 1100,
      ...this.courseFeeDetails['toeic-regular'],
    },
    {
      id: 'toeic-guarantee',
      name: 'TOEIC Guarantee',
      tuition: 1000,
      tuition2027: 1100,
      ...this.courseFeeDetails['toeic-guarantee'],
    },
    {
      id: 'pre-ielts',
      name: 'Pre-IELTS',
      tuition: 1050,
      tuition2027: 1150,
      ...this.courseFeeDetails['pre-ielts'],
    },
    {
      id: 'ielts-regular',
      name: 'IELTS Regular',
      tuition: 1050,
      tuition2027: 1150,
      ...this.courseFeeDetails['ielts-regular'],
    },
    {
      id: 'ielts-guarantee',
      name: 'IELTS Guarantee',
      tuition: 1050,
      tuition2027: 1150,
      ...this.courseFeeDetails['ielts-guarantee'],
    },
    {
      id: 'business',
      name: 'Business',
      tuition: 1050,
      tuition2027: 1150,
      ...this.courseFeeDetails['business'],
    },
    {
      id: 'working-holiday',
      name: 'Working Holiday',
      tuition: 950,
      tuition2027: 1050,
      ...this.courseFeeDetails['working-holiday'],
    },
    {
      id: 'callan-esl',
      name: 'Callan ESL',
      tuition: 1050,
      tuition2027: 1050,
      ...this.courseFeeDetails['callan-esl'],
    },
    {
      id: 'college-immersion',
      name: 'College Immersion（IAU大学沉浸）',
      tuition: 1000,
      tuition2027: 1100,
      ...this.courseFeeDetails['college-immersion'],
    },
  ];

  readonly schedule: ScheduleItem[] = [
    {
      time: '06:40 - 08:00',
      title: '早餐与晨间测试',
      text: '早餐时段为06:40–08:00；周一至周四07:20–08:00进行单词或课程测试。',
    },
    {
      time: '08:00 - 12:05',
      title: '上午课程',
      text: '一对一、小组课或考试专项课，按课程表安排。',
    },
    {
      time: '12:05 - 13:05',
      title: '午餐与休息',
      text: '校内餐厅用餐，下午课程前整理学习资料。',
    },
    {
      time: '13:05 - 15:30',
      title: '下午课程',
      text: '小组课、专项训练、口语或语法词汇课程。',
    },
    {
      time: '15:35 - 18:00',
      title: '下午课程、写作与自习',
      text: '继续一对一、团体或选修课程，并按所选课程完成写作和自习。',
    },
    {
      time: '18:00 - 22:00',
      title: '晚餐与自由时间',
      text: '18:00–19:00晚餐，19:00–22:00自由活动；保证班另有指定晚间学习安排。',
    },
    {
      time: '周五 17:10 - 18:00',
      title: '演讲、朗读或月度活动',
      text: '周五采用40分钟课节，下午安排演讲/朗读比赛或每月大型活动。',
    },
  ];

  roomFees: RoomFee[] = [
    {
      id: 'p1',
      name: '豪华单人间 P-1',
      fee: 1700,
      note: '豪华单人间多了一个电磁炉，可以简单加热食物',
    },
    {
      id: 's1',
      name: '标准单人间 S-1',
      fee: 1500,
      note: '标准单人间，适合重视独立空间的学生',
    },
    {
      id: 'pn1',
      name: '校外单人间 PN-1',
      fee: 1700,
      note: '在学校对面的4号楼',
    },
    {
      id: 'd2',
      name: '双人间 D-2',
      fee: 1100,
      note: '双人间，适合朋友同行或希望平衡预算',
    },
    { id: 'd3', name: '三人间 D-3', fee: 850, note: '预算比双人间更低' },
    {
      id: 'd4',
      name: '四人间 D-4',
      fee: 750,
      note: '默认报价参考，预算压力较低',
    },
    {
      id: 'sr1',
      name: '单人套房 SR-1',
      fee: 2500,
      note: '套房房型，空间更完整',
    },
    {
      id: 'sr2',
      name: '双人套房 SR-2',
      fee: 1400,
      note: '套房房型，适合两人入住',
    },
    {
      id: 'sr3',
      name: '三人套房 SR-3',
      fee: 1200,
      note: '套房房型，适合小组同行',
    },
    {
      id: 'sr4',
      name: '四人套房 SR-4',
      fee: 1100,
      note: '套房房型，预算和空间较平衡',
    },
  ];

  localFees: LocalFee[] = [
    { item: 'SSP', amount: '8,000比索', note: '无菲律宾长期签证者需办理' },
    { item: 'SSP E-card', amount: '4,500比索', note: '办理SSP时同时办理' },
    { item: '综合管理费', amount: '4,000比索', note: '每4周 / 人' },
    { item: '水费', amount: '1,000比索', note: '每4周参考' },
    { item: '电费', amount: '2,000比索', note: '每4周基础额度，超额按当地电价另计' },
    { item: '教材费', amount: '2,000比索', note: '每套约使用8周，按课程及进度调整' },
    { item: '照片费', amount: '200比索', note: '一次性费用' },
    { item: '房间押金', amount: '2,500比索', note: '退房检查后按学校规定退还' },
    { item: '周末接机', amount: '1,000比索', note: '宿务机场接机' },
    { item: '工作日接机', amount: '1,500比索', note: '宿务机场接机' },
    {
      item: 'ACR I-card',
      amount: '4,500比索',
      note: '长期学习或延签时可能需要',
    },
  ];

  readonly serviceSteps: ProcessStep[] = [
    {
      icon: 'person_search',
      title: '确认是否适合',
      text: '先了解学习目标、预算、房型偏好、年龄和入学时间，判断 CIA 是否匹配。',
    },
    {
      icon: 'fact_check',
      title: '确认课程、空房和优惠',
      text: '免费协助确认课程、房型、空房、优惠和正式报价，避免只按网页价格做决定。',
    },
    {
      icon: 'assignment_turned_in',
      title: '协助入境和签证手续',
      text: '思达免费协助办理菲律宾入境及签证相关手续，学生只需按顾问指引准备个人资料。',
    },
    {
      icon: 'inventory',
      title: '发送学习资料和行前清单',
      text: '入学前免费发送学习资料、行李清单、费用清单和到校注意事项。',
    },
    {
      icon: 'support_agent',
      title: '到校后继续跟进',
      text: '遇到换老师、调课、学习方法、宿舍生活或学校沟通问题，也可以继续联系思达协助。',
    },
    {
      icon: 'location_on',
      title: '宿务当地支持',
      text: '思达在宿务有工作人员驻点，可提供当地支持，直到学生完成学习并顺利回国。',
    },
  ];

  readonly schoolServices = [
    '机场接机',
    '入学说明',
    '分级测试',
    '课程咨询',
    '学生经理',
    '宿舍清洁',
    '洗衣服务',
    '医务室',
    '24小时保安',
    '证件协助',
  ];

  readonly campusActivities = [
    '新生说明会',
    '文化交流',
    '体育活动',
    '节日活动',
    '校内比赛与趣味活动',
  ];

  readonly weekendActivities = [
    '跳岛游',
    '海边活动',
    '商场购物',
    '城市观光',
    '学生自发聚会',
  ];

  readonly notes = [
    '热门房型、暑假和寒假档期建议尽早确认空房。',
    '菲律宾公共假期可能影响课程安排，通常不补课。',
    '到校支付费用会随学校政策、汇率和个人情况变化。',
    '未成年学生、亲子学生和长期学习学生，需要提前确认额外规则。',
    '最终报名以学校正式录取、付款节点和顾问确认报价为准。',
  ];

  readonly faqs: FaqItem[] = [
    {
      question: 'CIA 适合零基础学生吗？',
      answer:
        '适合。Regular ESL 可以从基础开始，但如果目标是短期快速开口，建议让顾问比较 Intensive 或 Power Intensive 是否更合适。',
    },
    {
      question: 'CIA 2027年课程费从什么时候开始使用？',
      answer:
        '不是所有学生从2026年9月1日起统一涨价。只有在2026年9月1日或之后报名，并且在2027年1月1日或之后入学，才采用2027新课程费；2026年入学仍按原价。若原定2026年入学后改期到2027年，需要按改期日期再核对。',
    },
    {
      question: 'CIA 是不是斯巴达学校？',
      answer:
        'CIA 更适合按半斯巴达理解。它有每日测试、出勤和门禁管理，但不是完全封闭式学校，适合想被学习节奏推动又希望保留一定生活空间的学生。',
    },
    {
      question: '为什么要找顾问确认报价？',
      answer:
        'CIA 的空房、优惠、旺季附加费和当地费用会随时间变化。顾问可以把课程、房型、入学日期和最新优惠一起核对，给学生正式报价。',
    },
    {
      question: '思达会协助签证和入境吗？',
      answer:
        '会。通过思达报名 CIA，思达顾问会免费协助菲律宾入境及签证相关手续，学生只需要按顾问指引准备个人资料。',
    },
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
    { label: '亮点', target: 'highlights', icon: 'star' },
    { label: '校园', target: 'campus-introduction', icon: 'apartment' },
    { label: '课程', target: 'courses', icon: 'menu_book' },
    { label: '费用', target: 'quote', icon: 'calculate' },
    { label: '生活', target: 'campus-life', icon: 'bed' },
    { label: '服务', target: 'student-care-services', icon: 'support_agent' },
    { label: 'FAQ', target: 'faq', icon: 'help' },
  ];

  readonly snapshotCards = [
    {
      icon: 'apartment',
      title: '学校定位',
      text: '宿务麦克坦岛半斯巴达英语学校',
    },
    {
      icon: 'workspace_premium',
      title: '考试资源',
      text: 'IDP IELTS 官方考场，定期考试，成绩更快',
    },
    {
      icon: 'menu_book',
      title: '课程覆盖',
      text: 'ESL / IELTS / TOEIC / Business / Callan / College Immersion',
    },
    {
      icon: 'bed',
      title: '住宿生活',
      text: '校内宿舍、餐厅、泳池、健身房等',
    },
    {
      icon: 'person',
      title: '适合人群',
      text: '成人英语、雅思备考、职场提升、亲子营',
    },
    {
      icon: 'support_agent',
      title: '顾问提醒',
      text: '更适合看重综合体验、课程和生活便利的学生',
    },
  ];

  readonly coreHighlights = [
    {
      icon: 'history_edu',
      image: 'assets/cia/campus-sunset-aerial-enhanced.png',
      title: '2003年创校经验',
      text: '长期服务来自不同国家和地区的学生，课程、住宿与学生支援体系较完整。',
    },
    {
      icon: 'location_on',
      image: 'assets/cia/campus-building.png',
      title: '麦克坦新校区位置便利',
      text: '学习、住宿、餐厅与生活设施集中，前往机场、餐厅和麦克坦休闲区域相对方便。',
    },
    {
      icon: 'sports_basketball',
      image: 'assets/cia/recreation-room.jpg',
      title: '课后活动选择较多',
      text: '健身、游泳、篮球、排球、卡拉OK与休闲室等活动，让学习与生活更平衡。',
    },
    {
      icon: 'auto_stories',
      image: 'assets/cia/course-learning.jpg',
      title: '课程选择范围广',
      text: 'ESL、IELTS、TOEIC、Business、Working Holiday、Callan 与大学沉浸式课程均可选择。',
    },
    {
      icon: 'support_agent',
      image: 'assets/cia/student-care-cro.jpg',
      title: '学生支援响应及时',
      text: 'CRO与学业顾问覆盖住宿、生活和学习问题，帮助学生减少适应期中的阻碍。',
    },
    {
      icon: 'restaurant',
      image: 'assets/cia/dining-hall.jpg',
      title: '三餐兼顾多国口味',
      text: '校内餐厅每日供应不同餐食，并尽量兼顾多国学生的饮食习惯与营养需要。',
    },
    {
      icon: 'school',
      image: 'assets/cia/one-to-one-class.png',
      title: '专注英语的学习环境',
      text: '一对一与不同规模团体课结合，配合晨考、写作和自习，形成清晰的学习节奏。',
    },
    {
      icon: 'public',
      image: 'assets/cia/international-students.jpg',
      title: '真实的跨文化交流',
      text: '国际学生共同学习与生活，配合EOP英语使用规则，增加课外自然使用英语的机会。',
    },
  ];

  readonly videoCards = [
    {
      code: 'ESL',
      title: '一般英语小组课程视频',
      text: 'Regular ESL 最新课表参考',
      poster: 'assets/cia/course-video-posters/esl-course.jpg',
      brandLogo: 'assets/cia/course-video-posters/cambridge-esl.png',
      brandAlt: 'Cambridge English Qualifications 标志',
      videoSrc:
        'assets/cia-video/ESL, WORKING HOLIDAY & TESOL COURSE INTRO.mp4',
      details: [
        '1 对 1 课程 4 节',
        '小组 / 中组 / 大组各 1 节',
        '选修、写作、自习各 1 节',
      ],
    },
    {
      code: 'IELTS',
      title: '雅思小组课程视频',
      text: '雅思官方考试中心',
      poster: 'assets/cia/course-video-posters/ielts-course.jpg',
      brandLogo: 'assets/cia/course-video-posters/idp-ielts.png',
      brandAlt: 'IDP IELTS 标志',
      videoSrc:
        'assets/cia-video/(English School in Cebu, Philippines) Cebu International Academy - IELTS Course Introduction.mp4',
      details: [
        '1 对 1 课程 4 节',
        'IELTS Clinic 中组课程 2 节',
        '雅思小组 / 选修各 1 节',
        '写作 1 节 + 自习 2 节',
      ],
    },
    {
      code: 'TOEIC',
      title: '托业小组课程视频',
      text: '托业备考课程',
      poster: 'assets/cia/course-video-posters/toeic-course.jpg',
      brandLogo: 'assets/cia/course-video-posters/ets-toeic.png',
      brandAlt: 'ETS TOEIC 标志',
      videoSrc:
        'assets/cia-video/(English School in Cebu, Philippines ) Cebu International Academy - TOEIC Course Introduction.mp4',
      details: [
        '1 对 1 课程 4 节',
        'TOEIC Clinic 中组课程 2 节',
        '托业小组 / 选修各 1 节',
        '写作 1 节 + 自习 2 节',
      ],
    },
    {
      code: 'BUSINESS',
      title: '商务英语小组课程视频',
      text: '剑桥商务英语课程',
      poster: 'assets/cia/course-video-posters/business-course.jpg',
      brandLogo: 'assets/cia/course-video-posters/cambridge-business.png',
      brandAlt: 'Cambridge English Business 标志',
      videoSrc: 'assets/cia-video/BUSINESS GROUP VIDEO.mp4',
      details: [
        '商务一对一课程 5 节',
        '商务小组 / 综合中组各 1 节',
        '选修与写作各 1 节',
        '自习 2 节',
      ],
    },
  ];

  readonly courseChoiceCards = [
    {
      icon: 'chat_bubble_outline',
      label: '第一次游学',
      title: 'Regular ESL',
      text: '均衡提升英语听说读写，适合打基础的学生。',
    },
    {
      icon: 'person_add',
      label: '想多上一对一',
      title: 'Intensive / Power Intensive',
      text: '增加一对一课时，适合短期快速提升英语能力。',
    },
    {
      icon: 'track_changes',
      label: '雅思目标',
      title: 'Pre-IELTS / IELTS Regular / IELTS Guarantee',
      text: '备考全套体系，可参加模考与官方考试资源。',
    },
    {
      icon: 'scoreboard',
      label: '托业目标',
      title: 'Pre-TOEIC / TOEIC Regular / TOEIC Guarantee',
      text: '听力、阅读强化，适合求职或升学分数目标。',
    },
    {
      icon: 'business_center',
      label: '职场英语',
      title: 'Business English',
      text: '商务沟通、会议、邮件和面试实用训练。',
    },
    {
      icon: 'flight_takeoff',
      label: '特色项目',
      title: 'Working Holiday / Callan / College Immersion',
      text: '适合打工度假、口语训练或大学深度体验项目。',
    },
  ];

  readonly studentCareServices: StudentCareService[] = [
    {
      icon: 'support_agent',
      number: '01',
      title: 'CRO 客户关系办公室',
      subtitle: '24小时学生支援',
      text: '学生在校期间遇到生活不便、突发状况或一般咨询时，可由 CRO 团队协调处理；紧急情况可联系对应国家经理并协助安排救护车等支援。',
      location: '2号楼前台区域',
      schedule: '每天',
      points: ['一般学生服务', '邮局快递协助'],
    },
    {
      icon: 'school',
      number: '02',
      title: 'AA 学业顾问',
      subtitle: '课程与生活咨询',
      text: '新生会安排 Academic Advisor，协助课程、课表、学习规划和学校生活适应，也可提供保密的学习与生活咨询。',
      location: '线上 / 线下',
      schedule: '每天',
      points: ['课程、课表与课程体系建议', '学习与生活咨询'],
    },
    {
      icon: 'forum',
      number: '03',
      title: 'SNS 线上沟通服务',
      subtitle: '公告与经理联络',
      text: '学校会通过线上渠道发布校内活动、生活提醒和重要公告；学生出发前及到校后，也可通过对应国家常用通讯软件联系国际经理。',
      location: '线上 SNS',
      schedule: '每天',
      points: ['校内信息通知', '国际经理沟通'],
    },
    {
      icon: 'record_voice_over',
      number: '04',
      title: 'EOP 英语使用规则',
      subtitle: '鼓励多说英语',
      text: '教室和指定英语区域鼓励使用英语。校内会有 EOP 巡查，违规罚款会用于每月活动及公益捐赠，帮助学生增加英语输出机会。',
      location: 'A楼及指定英语区域',
      schedule: '每天',
      points: ['提高英语使用频率', '营造英语学习环境'],
    },
    {
      icon: 'airport_shuttle',
      number: '05',
      title: '接机服务与迎新包',
      subtitle: '从机场到校园',
      text: '新生抵达机场后，CIA 工作人员会在到达区迎接并安排校车前往校园；到校后会说明设施、安全须知，并提供临时学生证和迎新资料。',
      location: '机场到达区 / 校园内',
      schedule: '抵达当天',
      points: ['机场接机至宿舍', '到校基础说明与迎新资料'],
    },
    {
      icon: 'edit_note',
      number: '06',
      title: 'Daily Test 每日测试',
      subtitle: '词汇、语法与写作节奏',
      text: '新生入学说明时会收到每日测试资料。周一至周四早上安排基础词汇、语法测试，并配合自习写作练习，由一对一写作老师检查。',
      location: 'SSR / C楼',
      schedule: '周一至周四 07:20-08:00',
      points: [
        '低于要求分数会影响外出权限',
        '迟到、带手机或未写姓名可能记零分',
      ],
    },
    {
      icon: 'medical_services',
      number: '07',
      title: '医疗服务',
      subtitle: '护士与校医支援',
      text: '学校护士会照顾学生健康，校医每周到校一次，可提供医疗建议、处方建议，必要时建议就医，并在紧急情况中及时协助。',
      location: 'A楼诊所',
      schedule: '护士每天 / 医生每周一次',
      points: ['如需校医检查，早上登记申请', '紧急情况及时响应'],
    },
  ];

  readonly lifeCards = [
    {
      icon: 'home',
      image: 'assets/cia/dormitory-service-official.jpg',
      badge: '',
      title: '宿舍',
      text: '多种房型可选，独立卫浴、空调、热水、WiFi 全覆盖。',
    },
    {
      icon: 'restaurant',
      image: 'assets/cia/dining-hall.jpg',
      badge: '',
      title: '餐食',
      text: '三餐营养搭配，兼顾亚洲口味与不同学生需求。',
    },
    {
      icon: 'local_laundry_service',
      image: 'assets/cia/laundry-service-illustration.png',
      badge: '洗衣服务示意图',
      title: '保洁与洗衣',
      text: '学校提供免费洗衣服务，每周可送洗2次，通常2–3天后领取；宿舍房间原则上每周清洁1次。',
    },
    {
      icon: 'fitness_center',
      image: 'assets/cia/fitness-center.jpg',
      badge: '',
      title: '校园设施',
      text: '泳池、健身房、篮球场、自习室和休闲空间齐全。',
    },
    {
      icon: 'location_on',
      image: 'assets/cia/mactan-airport-official.png',
      badge: '',
      title: '麦克坦周边',
      text: '位于麦克坦岛，前往机场、餐厅及周末活动地点较方便；实际车程会受交通情况影响。',
    },
  ];

  readonly campusPracticalGuides: CampusPracticalGuide[] = [
    {
      icon: 'confirmation_number',
      eyebrow: 'ADMIN OFFICE',
      title: '行政办公室办事指引',
      facts: [
        { label: '位置', value: '1号楼入口处，先取号再到对应窗口办理' },
        { label: '办公时间', value: '08:00–18:00；午休11:50–13:00' },
        { label: '表格截止', value: '旅行、退房、Free Day等申请通常需在17:00前提交' },
      ],
      note: '签证延长、护照、退款与押金、延长住宿、旅行申请、课本领取、志愿者活动及出勤确认等业务由不同窗口负责。',
    },
    {
      icon: 'sim_card',
      eyebrow: 'SIM & INTERNET',
      title: '校内SIM卡与充值',
      facts: [
        { label: '未注册SIM', value: '约₱50，需本人使用护照和基本信息完成注册' },
        { label: '已注册SIM', value: '约₱150，可直接充值使用，通常无需再次注册' },
        { label: '充值方式', value: '校内小卖铺现场充值，或使用“菲速充”微信小程序' },
      ],
      note: '学校资料显示小卖铺电话卡为Smart卡；套餐、售价和注册要求可能随电信政策调整。',
    },
    {
      icon: 'restaurant_menu',
      eyebrow: 'DINING HOURS',
      title: '校内餐厅用餐时间',
      facts: [
        { label: '周一至周六 / 节假日', value: '早餐06:30–08:00；午餐11:30–13:00；晚餐17:30–19:00' },
        { label: '周五午餐', value: '11:30–13:10' },
        { label: '周日', value: '早午餐10:00–12:00；晚餐17:30–19:00' },
      ],
      note: '餐食通常会在结束前10分钟停止供应；课程表中的学生早餐安排可能从06:40开始，请按入学通知协调晨考与用餐。',
    },
    {
      icon: 'local_laundry_service',
      eyebrow: 'LAUNDRY',
      title: '免费洗衣与自助付费洗衣',
      facts: [
        { label: '免费洗衣', value: '每周可送洗2次；通常在07:00–15:00收取脏衣，约2–3天后领取' },
        { label: '付费自助', value: '洗涤及烘干约₱200；可洗内衣裤并使用自己的洗衣液' },
        { label: '付费开放', value: '周一至周五07:00–21:00；周末07:00–17:00；节假日08:00–17:00' },
      ],
      note: '学校资料另列遗失物品赔偿参考标准（约₱50–₱500）；送洗前后请自行核对衣物，最终处理以校方规定为准。',
    },
  ];

  readonly roomRateGroups: RoomRateGroup[] = [
    {
      title: '单人间',
      rooms: [
        { id: 'p1', label: '豪华单人间', code: 'P-1', location: '校内' },
        { id: 'pn1', label: '校外单人间', code: 'PN-1', location: '校外' },
        { id: 's1', label: '标准单人间', code: 'S-1', location: '校内' },
      ],
    },
    {
      title: '普通多人间',
      rooms: [
        { id: 'd2', label: '双人间', code: 'D-2', location: '校内' },
        { id: 'd3', label: '三人间', code: 'D-3', location: '校内' },
        { id: 'd4', label: '四人间', code: 'D-4', location: '校内' },
      ],
    },
    {
      title: '家庭精致套房',
      rooms: [
        { id: 'sr1', label: '单人套房', code: 'SR-1', location: '校内' },
        { id: 'sr2', label: '双人套房', code: 'SR-2', location: '校内' },
        { id: 'sr3', label: '三人套房', code: 'SR-3', location: '校内' },
        { id: 'sr4', label: '四人套房', code: 'SR-4', location: '校内' },
      ],
    },
  ];

  readonly roomComparisonProfiles: RoomComparisonProfile[] = [
    {
      id: 'premium-single',
      label: '豪华单人间',
      englishName: 'Premium Single',
      bookingCode: 'P-1',
      location: '校内',
      size: '约21.85㎡',
      view: '泳池景观',
      bed: '约160 × 200cm',
      service: '免费洗衣每周2次 · 房间清洁每周1次',
      suitable: '希望住校、重视独处空间，并希望房内具备简易料理条件的学生。',
      highlights: ['大尺寸单人床', '电磁炉、洗手池与迷你冰箱', '床头灯、拖鞋及壁挂式吹风机'],
      note: '网站报价对应P-1；房间朝向、楼层和具体设备位置以入住分配为准。',
      image: ciaRoomGalleries.premium[0],
      gallery: ciaRoomGalleries.premium,
      imageAlt: 'CIA校内豪华单人间实景，配有大床、书桌及简易料理区',
    },
    {
      id: 'pinnacle-single',
      label: '校外单人间',
      englishName: 'Pinnacle Single',
      bookingCode: 'PN-1',
      location: '校外',
      size: '约15.5–16㎡',
      view: '城市景观',
      bed: '约122 × 198cm',
      service: '校外住宿服务频率须单独确认',
      suitable: '希望单人居住、能接受住在学校对面校外住宿楼，并看重智能设备的学生。',
      highlights: ['智能投影与弹出式充电口', '防雾镜与高速无刷吹风机', '洗衣机及简易料理设备'],
      note: '仅此房型属于校外住宿。学校资料包含普通房与小复式两种布局；网站当前报价对应PN-1，具体布局、价格和余房须在报名时单独确认。',
      image: ciaRoomGalleries.pinnacle[0],
      gallery: ciaRoomGalleries.pinnacle,
      imageAlt: 'CIA Pinnacle校外单人间实景，配有单人床、书桌、投影和料理区',
    },
    {
      id: 'standard-single',
      label: '标准单人间',
      englishName: 'Standard Single',
      bookingCode: 'S-1',
      location: '校内',
      size: '约14.3㎡',
      view: '泳池景观',
      bed: '约122 × 198cm',
      service: '免费洗衣每周2次 · 房间清洁每周1次',
      suitable: '希望住校、预算低于豪华单人间，同时保留独立学习和休息空间的学生。',
      highlights: ['紧凑型独立空间', '独立书桌、书架与遮光帘', '迷你冰箱、热水壶及拖鞋'],
      note: '网站报价对应S-1；泳池景观为房型资料所列参考，不能作为指定朝向承诺。',
      image: ciaRoomGalleries.standard[0],
      gallery: ciaRoomGalleries.standard,
      imageAlt: 'CIA校内标准单人间实景，配有单人床、书桌和收纳空间',
    },
    {
      id: 'twin',
      label: '双人间',
      englishName: 'Twin Room',
      bookingCode: 'D-2',
      location: '校内',
      size: '约24.84㎡',
      view: '花园 / 泳池 / 海景',
      bed: '每床约122 × 198cm',
      service: '免费洗衣每周2次 · 房间清洁每周1次',
      suitable: '结伴报名，或希望在舒适度、交流机会和预算之间取得平衡的学生。',
      highlights: ['两张较宽单人床', '每人独立书桌与收纳位', '卫浴可能为干湿分区或一体式'],
      note: '网站报价对应D-2；景观和卫浴布局会因具体房号而不同。',
      image: ciaRoomGalleries.twin[0],
      gallery: ciaRoomGalleries.twin,
      imageAlt: 'CIA校内双人间实景，配有两张单人床和独立学习位置',
    },
    {
      id: 'triple',
      label: '三人间',
      englishName: 'Triple Room',
      bookingCode: 'D-3',
      location: '校内',
      size: '约31.05㎡',
      view: '花园 / 海景',
      bed: '每床约122 × 198cm',
      service: '免费洗衣每周2次 · 房间清洁每周1次',
      suitable: '希望控制住宿预算，同时保留较宽床位和多人交流环境的学生。',
      highlights: ['三张较宽单人床', '卫生间与淋浴间分开', '每人独立书桌、插座与收纳位'],
      note: '网站报价对应D-3；花园或海景属于可能朝向，不能预先保证。',
      image: ciaRoomGalleries.triple[0],
      gallery: ciaRoomGalleries.triple,
      imageAlt: 'CIA校内三人间实景，配有三张单人床和连续学习桌',
    },
    {
      id: 'quad',
      label: '四人间',
      englishName: 'Quad Room',
      bookingCode: 'D-4',
      location: '校内',
      size: '约31.8㎡',
      view: '花园 / 海景',
      bed: '每床约99 × 190.5cm',
      service: '免费洗衣每周2次 · 房间清洁每周1次',
      suitable: '优先控制预算、喜欢同学互动，并能适应多人共同生活节奏的学生。',
      highlights: ['普通多人间中面积最大', '卫生间与淋浴间分开', '24个以上插座及独立学习位'],
      note: '网站报价对应D-4；多人间入住人数及床位安排以学校实际分配为准。',
      image: ciaRoomGalleries.quad[0],
      gallery: ciaRoomGalleries.quad,
      imageAlt: 'CIA校内四人间实景，配有四张单人床和连续学习桌',
    },
    {
      id: 'suite',
      label: '家庭精致套房',
      englishName: 'Suite Room',
      bookingCode: 'SR-1 / SR-2 / SR-3 / SR-4',
      location: '校内',
      size: '约31.18㎡',
      view: '海景',
      bed: '主床约193 × 203cm',
      service: '免费洗衣每周2次 · 房间清洁每周1次',
      suitable: '亲子、家庭或希望获得更完整起居与料理配置的学生。',
      highlights: ['电视、大冰箱、微波炉与电磁炉', '洗手池、餐具、浴袍及茶几', '阳台及更完整的起居空间'],
      note: '同一套房硬件对应SR-1至SR-4的不同入住人数报价；实际加床、床型及可住人数须按家庭人数和余房确认。',
      image: ciaRoomGalleries.suite[0],
      gallery: ciaRoomGalleries.suite,
      imageAlt: 'CIA家庭精致套房实景，配有大床、电视、餐桌及料理区',
    },
  ];

  readonly studentTracks = [
    {
      icon: 'business',
      title: '成人主校区',
      text: '通常15岁以上，以 ESL / IELTS / TOEIC / Business 等课程为主，适合独立学习的学生或成人。',
    },
    {
      icon: 'family_restroom',
      title: '亲子 / 青少年营',
      text: '通常7岁起参加，按假期档期开放，可随在校外照顾或独立营地进行。',
    },
    {
      icon: 'assignment',
      title: '报名提醒',
      text: '报名确认前先确认年龄要求、营地地点、开课日期、房型和监护支持与费用明细。',
    },
  ];

  readonly officialStudentReviews = CIA_STUDENT_REVIEWS;

  readonly sidaCiaReasons: SidaCiaReason[] = [
    {
      number: '01',
      title: '正式合同与官方授权',
      text: '国内公司签约，学校报价、录取文件及收费凭证均可核验。',
      image: 'assets/cia/sida-why-action-contract.jpg',
      alt: 'CIA报名合同与授权文件',
    },
    {
      number: '02',
      title: '费用提前算清，同条件保价',
      text: '0中介服务费，学费、住宿费及当地费用提前说明。',
      image: 'assets/cia/sida-why-action-fees.jpg',
      alt: 'CIA费用清单与计算器',
    },
    {
      number: '03',
      title: '从所有适合的学校中帮你筛选',
      text: '根据目标、预算、基础和管理偏好，分析各校优缺点与价格。',
      image: 'assets/cia/sida-why-action-selection.jpg',
      alt: '思达启航顾问协助筛选CIA方案',
    },
    {
      number: '04',
      title: '出发前每一步有人提醒',
      text: '签证、eTravel、入学文件、付款、机票、保险及接机逐项提醒。',
      image: 'assets/cia/sida-why-action-departure.jpg',
      alt: '菲律宾游学出发资料与手机提醒',
    },
    {
      number: '05',
      title: '服务持续到完成学习回国',
      text: '换老师、课程、住宿、账单、续读或转校问题继续协助。',
      image: 'assets/cia/sida-why-action-followup.jpg',
      alt: '思达启航顾问持续跟进学生学习',
    },
    {
      number: '06',
      title: '深圳总部 + 菲律宾·欧洲驻点支持',
      text: '国内统筹与境外工作人员协作，重要情况有人跟进。',
      image: 'assets/cia/sida-why-action-team.jpg',
      alt: '思达启航菲律宾和欧洲驻点团队',
    },
  ];

  readonly sidaCiaTrustBadges: SidaCiaTrustBadge[] = [
    { icon: 'description', label: '国内正式公司合同' },
    { icon: 'verified_user', label: '官方授权合作' },
    { icon: 'local_offer', label: '费用透明与同条件保价' },
    { icon: 'apartment', label: '深圳总部 + 菲律宾·欧洲驻点' },
  ];

  readonly enrollmentChecks = [
    {
      icon: 'flag',
      title: '目标课程',
      text: 'ESL / IELTS / TOEIC / Business 或其他课程',
    },
    { icon: 'event', title: '入学日期', text: '确定计划入学的具体日期' },
    {
      icon: 'bed',
      title: '房型',
      text: '选择适合的房型（单人 / 双人 / 多人 / 套房）',
    },
    {
      icon: 'trending_up',
      title: '是否旺季',
      text: '旺季名额紧张，建议提前报名',
    },
    {
      icon: 'quiz',
      title: '是否需要雅思官方考试',
      text: '如需确认考试日期与考位安排',
    },
    {
      icon: 'payments',
      title: '到校学杂费预算',
      text: '确认额外费用预算（学杂费 / 电费等）',
    },
    {
      icon: 'sync_alt',
      title: '是否考虑续读或转校',
      text: '如有长期规划，建议提前准备',
    },
  ];

  readonly ctaBadges = [
    '正规签约保障',
    '费用透明无隐形消费',
    '菲律宾及多国驻点支持',
    '学习期间持续协助',
  ];

  readonly courseMatchAdvisors: CourseMatchAdvisor[] = [
    {
      icon: 'school',
      title: '英爱留学规划',
      name: 'Jenny',
      text: '后续帮衔接爱尔兰/英国留学',
    },
    {
      icon: 'public',
      title: '多国家方案比较',
      name: 'Lemon',
      text: '还没确定国家，想比较费用和路线',
    },
    {
      icon: 'travel_explore',
      title: '菲律宾与东南亚游学',
      name: 'Penin',
      text: 'CIA、菲律宾学校、马来/新加坡/越南短期英语',
    },
  ];

  readonly ctaConsultants: CtaConsultant[] = [
    {
      title: '英爱留学规划',
      name: 'Jenny',
      description:
        '适合爱尔兰/英国本科、硕士、预科、半工半读，以及后续升学规划。',
      phone: '132 4982 7686',
      phoneHref: 'tel:13249827686',
      avatarSrc: this.quoteImageAssets.jennyAvatar,
      qrSrc: this.quoteImageAssets.jennyQr,
      buttonLabel: '咨询英爱留学',
    },
    {
      title: '多国家方案规划',
      name: 'Lemon',
      description: '适合还没确定国家，想比较费用、时间、路线和升学路径。',
      phone: '132 9852 9856',
      phoneHref: 'tel:13298529856',
      avatarSrc: this.quoteImageAssets.lemonAvatar,
      qrSrc: this.quoteImageAssets.lemonQr,
      buttonLabel: '咨询多国方案',
    },
    {
      title: '菲律宾与东南亚游学',
      name: 'Penin',
      description: '适合 CIA 菲律宾游学、马来西亚、新加坡、越南短期英语课程。',
      phone: '153 6765 9331',
      phoneHref: 'tel:15367659331',
      avatarSrc: this.quoteImageAssets.peninAvatar,
      qrSrc: this.quoteImageAssets.peninQr,
      buttonLabel: '咨询游学方案',
    },
  ];

  ngOnInit(): void {
    this.loadExtendedPageStyles();
    this.loadExchangeRates();
    this.loadPricingFromDatabase();
    this.loadGalleryFromDatabase();
  }

  private loadExtendedPageStyles(): void {
    if (typeof document === 'undefined' || document.getElementById('cia-page-extended-styles')) {
      return;
    }

    const stylesheet = document.createElement('link');
    stylesheet.id = 'cia-page-extended-styles';
    stylesheet.rel = 'stylesheet';
    stylesheet.href = 'assets/cia/cia-page-extended.css';
    document.head.appendChild(stylesheet);
  }

  private loadExchangeRates(): void {
    this.exchangeRateService
      .getLatestCnyRates()
      .pipe(catchError(() => EMPTY))
      .subscribe((rates) => {
        if (rates.usdToCny <= 0 || rates.phpPerCny <= 0) {
          return;
        }

        this.usdToCny = rates.usdToCny;
        this.phpPerCny = rates.phpPerCny;
        this.exchangeRateDate = rates.date;
        this.usingLiveExchangeRates = true;
      });
  }

  private loadPricingFromDatabase(): void {
    this.schoolService
      .getSchools({ name: this.ciaPricingSchoolName })
      .pipe(
        switchMap((schools) => {
          const ciaSchool =
            schools.find(
              (school) => school.name === this.ciaPricingSchoolName,
            ) ??
            schools.find((school) =>
              school.name.toLowerCase().includes('cia'),
            ) ??
            schools[0];

          if (!ciaSchool?.id) {
            return EMPTY;
          }

          return forkJoin({
            lessons: this.schoolService.getSchoolLessons({
              schoolId: ciaSchool.id,
              week: 4,
            }),
            rooms: this.schoolService.getSchoolRooms({
              schoolId: ciaSchool.id,
              week: 4,
            }),
            fees: this.schoolService.getSchoolFees({ schoolId: ciaSchool.id }),
          });
        }),
        catchError(() => EMPTY),
      )
      .subscribe(({ lessons, rooms, fees }) =>
        this.applyPricingData(lessons, rooms, fees),
      );
  }

  private loadGalleryFromDatabase(): void {
    this.schoolService
      .getSchools({ name: this.ciaPricingSchoolName })
      .pipe(
        switchMap((schools) => {
          const ciaSchool =
            schools.find(
              (school) => school.name === this.ciaPricingSchoolName,
            ) ??
            schools.find((school) =>
              school.name.toLowerCase().includes('cia'),
            ) ??
            schools[0];

          if (!ciaSchool?.id) {
            return EMPTY;
          }

          return this.schoolService.getSchoolPhotos({
            schoolId: ciaSchool.id,
            isActive: true,
          });
        }),
        catchError(() => EMPTY),
      )
      .subscribe((photos) => this.applyGalleryPhotos(photos));
  }

  private applyGalleryPhotos(photos: SchoolPhotoDTO[]): void {
    const uploadedPhotos = (photos ?? [])
      .filter((photo) => Boolean(photo.url))
      .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));

    if (uploadedPhotos.length === 0) {
      return;
    }

    const existingSources = new Set(
      this.galleryImages.map((image) => image.src),
    );
    const uploadedGalleryImages = uploadedPhotos
      .map((photo) => ({
        category: this.resolveUploadedPhotoCategory(photo.category),
        title:
          photo.caption ||
          photo.altText ||
          photo.originalFileName ||
          'CIA Cebu photo',
        description: photo.altText || photo.caption || 'CIA Cebu school photo',
        src: photo.url ?? '',
      }))
      .filter((image) => !existingSources.has(image.src));

    this.usingUploadedGallery = true;
    this.galleryImages = [...this.galleryImages, ...uploadedGalleryImages];
  }

  private applyPricingData(
    lessons: SchoolLessonDTO[],
    rooms: SchoolRoomDTO[],
    fees: SchoolFeeDTO[],
  ): void {
    const databaseCourseFees = lessons
      .filter((lesson) => lesson.week === 4)
      .map((lesson) => {
        const id = this.slugifyPriceKey(lesson.name);
        const details = this.courseFeeDetails[id];

        return {
          id,
          name: lesson.name,
          tuition: lesson.price,
          tuition2027:
            this.courseFees.find((course) => course.id === id)?.tuition2027 ??
            lesson.price,
          suitable:
            lesson.description ||
            details?.suitable ||
            lesson.note ||
            '请联系顾问确认适合人群',
          schedule:
            details?.schedule || lesson.note || '请联系顾问确认课表安排',
          note: details?.note || '最终以学校当期报价和课程安排为准。',
          highlightNote: details?.highlightNote,
        };
      })
      .sort(
        (a, b) =>
          this.orderIndex(this.courseFeeOrder, a.id) -
          this.orderIndex(this.courseFeeOrder, b.id),
      );

    if (databaseCourseFees.length > 0) {
      const mergedCourseFees = this.courseFees.map((course) => {
        const databaseCourse = databaseCourseFees.find(
          (item) => item.id === course.id,
        );

        return databaseCourse
          ? {
              ...course,
              name: databaseCourse.name,
              tuition: databaseCourse.tuition,
              suitable: databaseCourse.suitable || course.suitable,
            }
          : course;
      });
      const extraDatabaseCourseFees = databaseCourseFees.filter(
        (course) => !this.courseFees.some((item) => item.id === course.id),
      );

      this.courseFees = [...mergedCourseFees, ...extraDatabaseCourseFees].sort(
        (a, b) =>
          this.orderIndex(this.courseFeeOrder, a.id) -
          this.orderIndex(this.courseFeeOrder, b.id),
      );
      if (
        !this.courseFees.some((course) => course.id === this.selectedCourseId)
      ) {
        this.selectedCourseId = this.courseFees[0].id;
      }
    }

    const databaseRoomFees = rooms
      .filter((room) => room.week === 4)
      .map((room) => ({
        id: this.createRoomId(room.name),
        name: room.name,
        fee: room.price,
        note: room.description || '请联系顾问确认空房',
      }))
      .sort(
        (a, b) =>
          this.orderIndex(this.roomFeeOrder, a.id) -
          this.orderIndex(this.roomFeeOrder, b.id),
      );

    if (databaseRoomFees.length > 0) {
      const hasCompleteDatabaseRoomFees = this.roomFeeOrder.every((roomId) =>
        databaseRoomFees.some((room) => room.id === roomId),
      );
      const mergedRoomFees = this.roomFees.map((room) => {
        const databaseRoom = hasCompleteDatabaseRoomFees
          ? (databaseRoomFees.find(
              (item) => item.id === room.id && item.name === room.name,
            ) ?? databaseRoomFees.find((item) => item.id === room.id))
          : undefined;

        return databaseRoom
          ? {
              ...room,
              name: databaseRoom.name,
              fee: databaseRoom.fee,
              note: databaseRoom.note || room.note,
            }
          : room;
      });
      const extraDatabaseRoomFees = databaseRoomFees.filter(
        (room) => !this.roomFees.some((item) => item.id === room.id),
      );

      this.roomFees = [...mergedRoomFees, ...extraDatabaseRoomFees].sort(
        (a, b) =>
          this.orderIndex(this.roomFeeOrder, a.id) -
          this.orderIndex(this.roomFeeOrder, b.id),
      );
      if (!this.roomFees.some((room) => room.id === this.selectedRoomId)) {
        this.selectedRoomId = this.roomFees[this.roomFees.length - 1].id;
      }
    }

    const registrationFee = fees.find((fee) => fee.name === '注册费');
    if (registrationFee) {
      this.registrationFee = registrationFee.fee;
    }

    const peakSeasonFee = fees.find((fee) => fee.name === '旺季附加费');
    if (peakSeasonFee) {
      this.seasonalFeePerWeek = peakSeasonFee.fee;
    }

    const databaseLocalFees = fees
      .filter((fee) => this.currencyCodeForDisplay(fee.currencyCode) === '比索')
      .map((fee) => ({
        item: fee.name,
        amount: this.formatCurrencyAmount(fee),
        note: this.cleanFeeDescription(fee.description),
      }));

    if (databaseLocalFees.length > 0) {
      this.localFees = databaseLocalFees;
    }
  }

  setGalleryCategory(category: GalleryCategory): void {
    this.selectedGalleryCategory = category;
    this.selectedGalleryImageIndex = 0;
  }

  selectGalleryImage(index: number): void {
    const lastIndex = Math.max(this.displayedGalleryImages.length - 1, 0);
    this.selectedGalleryImageIndex = Math.min(Math.max(index, 0), lastIndex);
  }

  previousGalleryImage(): void {
    const length = this.displayedGalleryImages.length;
    if (length > 0) {
      this.selectedGalleryImageIndex =
        (this.selectedGalleryImageIndex - 1 + length) % length;
    }
  }

  nextGalleryImage(): void {
    const length = this.displayedGalleryImages.length;
    if (length > 0) {
      this.selectedGalleryImageIndex =
        (this.selectedGalleryImageIndex + 1) % length;
    }
  }

  openGalleryFromPreview(event?: Event): void {
    this.setGalleryCategory(this.galleryCategories[0]);
    this.scrollToSection('gallery', event);
  }

  calculateQuote(): void {
    this.quoteCalculated = true;
  }

  scrollToSection(target: string, event?: Event): void {
    event?.preventDefault();

    const targetElement = document.getElementById(target);

    if (!targetElement) {
      return;
    }

    const headerOffset = window.innerWidth <= 680 ? 132 : 92;
    const targetTop =
      targetElement.getBoundingClientRect().top + window.scrollY - headerOffset;

    window.scrollTo({
      top: Math.max(targetTop, 0),
      behavior: 'smooth',
    });

    window.history.replaceState(
      null,
      '',
      `${window.location.pathname}${window.location.search}#${target}`,
    );
  }

  get filteredGalleryImages(): GalleryImage[] {
    if (this.selectedGalleryCategory === this.galleryCategories[0]) {
      return this.galleryImages;
    }

    return this.galleryImages.filter(
      (image) => image.category === this.selectedGalleryCategory,
    );
  }

  selectHeroGalleryImage(index: number): void {
    const lastIndex = Math.max(this.heroGalleryPreviewImages.length - 1, 0);
    this.selectedHeroImageIndex = Math.min(Math.max(index, 0), lastIndex);
  }

  get displayedGalleryImages(): GalleryImage[] {
    return this.filteredGalleryImages;
  }

  get selectedGalleryImage(): GalleryImage {
    return (
      this.displayedGalleryImages[this.selectedGalleryImageIndex] ??
      this.displayedGalleryImages[0] ??
      this.galleryImages[0]
    );
  }

  get displayedGalleryImageSources(): string[] {
    return this.displayedGalleryImages.map((image) => image.src);
  }

  get displayedGalleryImageTitles(): string[] {
    return this.displayedGalleryImages.map((image) => image.title);
  }

  get displayedGalleryImageCaptions(): string[] {
    return this.displayedGalleryImages.map((image) => image.description);
  }

  get displayedGalleryImageAlts(): string[] {
    return this.displayedGalleryImages.map(
      (image) => `${image.category}实景：${image.title}`,
    );
  }

  get selectedRoomGalleryTitles(): string[] {
    return this.selectedRoomProfile.gallery.map(
      (_, index) =>
        `${this.selectedRoomProfile.label} · ${index === 0 ? '主要空间' : `细节实景 ${index + 1}`}`,
    );
  }

  get selectedRoomGalleryCaptions(): string[] {
    return this.selectedRoomProfile.gallery.map(
      (_, index) =>
        `${this.selectedRoomProfile.bookingCode} ${this.selectedRoomProfile.location}房型 · 第${index + 1}张实景`,
    );
  }

  get selectedRoomGalleryAlts(): string[] {
    return this.selectedRoomGalleryTitles.map((title) => `${title}照片`);
  }

  galleryImagesForCategory(
    category: Exclude<GalleryCategory, '全部'>,
  ): GalleryImage[] {
    return this.galleryImages.filter((image) => image.category === category);
  }

  galleryAlbumDescription(
    category: Exclude<GalleryCategory, '全部'>,
  ): string {
    const descriptions: Record<Exclude<GalleryCategory, '全部'>, string> = {
      校园: '主楼、泳池与校区分布',
      教室: '一对一、小组、中组与大组课空间',
      住宿: '7类房型、多角度实景与配置差异',
      餐厅: '学生餐厅与咖啡吧',
      设施: '运动、考试、自习、医疗与休闲空间',
    };

    return descriptions[category];
  }

  get heroGalleryPreviewImages(): GalleryImage[] {
    if (this.usingUploadedGallery) {
      return this.galleryImages.slice(0, 4);
    }

    return this.galleryImages
      .filter((image) =>
        this.featuredGalleryCategories.includes(image.category),
      )
      .slice(0, 4);
  }

  get selectedHeroGalleryImage(): GalleryImage {
    return (
      this.heroGalleryPreviewImages[this.selectedHeroImageIndex] ??
      this.heroGalleryPreviewImages[0] ??
      this.galleryImages[0]
    );
  }

  get selectedHeroGalleryImages(): GalleryImage[] {
    const images = this.heroGalleryPreviewImages;
    const selected = images[this.selectedHeroImageIndex] ?? images[0];

    if (!selected) {
      return [];
    }

    return [selected, ...images.filter((image) => image !== selected)];
  }

  get selectedHeroGallerySources(): string[] {
    return this.selectedHeroGalleryImages.map((image) => image.src);
  }

  get selectedHeroGalleryTitles(): string[] {
    return this.selectedHeroGalleryImages.map((image) => image.title);
  }

  get selectedHeroGalleryCaptions(): string[] {
    return this.selectedHeroGalleryImages.map((image) => image.description);
  }

  get selectedHeroGalleryAlts(): string[] {
    return this.selectedHeroGalleryImages.map(
      (image) => `${image.category}实景：${image.title}`,
    );
  }

  get selectedCourse(): CourseFee {
    return (
      this.courseFees.find((course) => course.id === this.selectedCourseId) ??
      this.courseFees[0]
    );
  }

  get selectedRoom(): RoomFee {
    return (
      this.roomFees.find((room) => room.id === this.selectedRoomId) ??
      this.roomFees[this.roomFees.length - 1]
    );
  }

  get tuitionForSelectedWeeks(): number {
    return this.selectedCourseBaseTuition * this.priceRatioForSelectedWeeks;
  }

  get uses2027Tuition(): boolean {
    return (
      this.parseDate(this.selectedRegistrationDate) >=
        this.parseDate('2026-09-01') &&
      this.parseDate(this.selectedStartDate) >= this.parseDate('2027-01-01')
    );
  }

  get selectedCourseBaseTuition(): number {
    return this.uses2027Tuition
      ? this.selectedCourse.tuition2027
      : this.selectedCourse.tuition;
  }

  get appliedTuitionLabel(): string {
    return this.uses2027Tuition ? '2027新价格' : '2026原价格';
  }

  get tuitionRuleSummary(): string {
    return this.uses2027Tuition
      ? '按当前报价日期与预计入学日期估算为2027新课程费；最终以学校实际收到报名及确认入学日期为准。'
      : '按当前报价日期与预计入学日期估算为2026原价格；最终以学校实际收到报名及确认入学日期为准。';
  }

  get roomFeeForSelectedWeeks(): number {
    return this.selectedRoom.fee * this.priceRatioForSelectedWeeks;
  }

  private get priceRatioForSelectedWeeks(): number {
    return (
      this.shortTermPriceRatios[this.selectedWeeks] ?? this.selectedWeeks / 4
    );
  }

  get peakSeasonWeeks(): number {
    const studyStart = this.parseDate(this.selectedStartDate);

    return Array.from({ length: this.selectedWeeks }, (_, index) => {
      const weekStart = this.addDays(studyStart, index * 7);
      const weekEnd = this.addDays(weekStart, 6);

      return this.peakSeasonRanges.some(({ start, end }) =>
        this.dateRangesOverlap(
          weekStart,
          weekEnd,
          this.parseDate(start),
          this.parseDate(end),
        ),
      );
    }).filter(Boolean).length;
  }

  get isPeakSeason(): boolean {
    return this.peakSeasonWeeks > 0;
  }

  get seasonalSurcharge(): number {
    return this.peakSeasonWeeks * this.seasonalFeePerWeek;
  }

  get coveredPeakSeasonLabels(): string {
    const studyStart = this.parseDate(this.selectedStartDate);
    const studyEnd = this.addDays(studyStart, this.selectedWeeks * 7 - 1);

    return this.peakSeasonRanges
      .filter(({ start, end }) =>
        this.dateRangesOverlap(
          studyStart,
          studyEnd,
          this.parseDate(start),
          this.parseDate(end),
        ),
      )
      .map(({ label }) => label)
      .join('、');
  }

  get peakSeasonStatusText(): string {
    if (!this.isPeakSeason) {
      return '当前选择的入学日期与学习周数未覆盖旺季，附加费为0美元。';
    }

    return `当前方案覆盖${this.coveredPeakSeasonLabels}共${this.peakSeasonWeeks}周，已自动计入${this.formatUsd(this.seasonalSurcharge)}美元。`;
  }

  get peakSeasonRangeText(): string {
    return this.peakSeasonRanges
      .map(({ label, start, end }) =>
        `${label} ${start.replace(/-/g, '/')}–${end.replace(/-/g, '/')}`,
      )
      .join('；');
  }

  get isChristmasPromotionEligible(): boolean {
    const studyStart = this.parseDate(this.selectedStartDate);
    const studyEnd = this.addDays(studyStart, this.selectedWeeks * 7 - 1);

    return (
      studyStart <= this.parseDate('2026-12-20') &&
      studyEnd >= this.parseDate('2027-01-02')
    );
  }

  get payableRegistrationFee(): number {
    return this.isChristmasPromotionEligible ? 0 : this.registrationFee;
  }

  get sidaDiscountAmount(): number {
    return (
      (this.tuitionForSelectedWeeks + this.roomFeeForSelectedWeeks) *
      (1 - this.discount)
    );
  }

  get christmasDiscountAmount(): number {
    return this.isChristmasPromotionEligible ? 200 : 0;
  }

  get totalDiscountAmount(): number {
    return (
      this.sidaDiscountAmount +
      this.christmasDiscountAmount +
      (this.isChristmasPromotionEligible ? this.registrationFee : 0)
    );
  }

  get quoteUsd(): number {
    return Math.max(
      0,
      this.payableRegistrationFee +
        this.tuitionForSelectedWeeks +
        this.roomFeeForSelectedWeeks +
        this.seasonalSurcharge -
        this.sidaDiscountAmount -
        this.christmasDiscountAmount,
    );
  }

  get quoteUsdText(): string {
    return `${this.formatUsd(this.quoteUsd)} 美元起`;
  }

  get quoteCnyText(): string {
    const rounded = Math.round((this.quoteUsd * this.usdToCny) / 100) * 100;
    return `人民币预计金额：约 ${rounded.toLocaleString('zh-CN')} 元`;
  }

  get exchangeRateDateText(): string {
    if (!this.exchangeRateDate) {
      return '备用参考值';
    }

    return this.exchangeRateDate.replace(/-/g, '/');
  }

  get exchangeRateSummary(): string {
    if (!this.usingLiveExchangeRates) {
      return '正在获取最新参考汇率，请稍候';
    }

    return `人民币金额按最新权威参考汇率预估（${this.exchangeRateDateText}），最终以支付当日汇率为准`;
  }

  get estimatedLocalFees(): LocalFeeEstimate[] {
    const fourWeekCycles = this.selectedWeeks / 4;
    const needsLongStayDocuments = this.selectedWeeks > 8;
    const visaExtensionCount = needsLongStayDocuments
      ? Math.ceil((this.selectedWeeks - 8) / 4)
      : 0;
    const visaExtensionFees = [6410, 4540, 4540, 4540, 5650];
    const visaExtensionTotal = visaExtensionFees
      .slice(0, visaExtensionCount)
      .reduce((total, fee) => total + fee, 0);
    const textbookSets = Math.ceil(this.selectedWeeks / 8);

    return [
      {
        item: 'SSP特殊学习许可证',
        unitLabel: '₱8,000 / 次',
        quantity: 1,
        total: 8000,
        note: '没有菲律宾学生签证、工签或退休签等长期签证的学生需办理；持有效长期签证者可按学校审核免办。',
      },
      {
        item: 'SSP-E Card',
        unitLabel: '₱4,500 / 次',
        quantity: 1,
        total: 4500,
        note: '入学时与SSP同时办理，按一次性费用估算。',
      },
      {
        item: 'ACR-I Card 外国人身份证',
        unitLabel: '₱4,500 / 次',
        quantity: needsLongStayDocuments ? 1 : 0,
        total: needsLongStayDocuments ? 4500 : 0,
        note: '持30天旅游签证者在第一次延签时须办理；持59天旅游签证者学习超过8周须办理，参考费₱4,500。',
      },
      {
        item: '综合管理费',
        unitLabel: '₱4,000 / 4周',
        quantity: fourWeekCycles,
        total: 4000 * fourWeekCycles,
        note: '按每4周₱4,000 / 人计算。',
      },
      {
        item: '电费',
        unitLabel: '₱2,000 / 4周',
        quantity: fourWeekCycles,
        total: 2000 * fourWeekCycles,
        note: '以菲律宾当地电价为准；超过基本用电额度时另行收费，单价可能按当地电力公司调整。',
      },
      {
        item: '水费',
        unitLabel: '₱1,000 / 4周',
        quantity: fourWeekCycles,
        total: 1000 * fourWeekCycles,
        note: '按每4周₱1,000 / 人计算。',
      },
      {
        item: '签证续签',
        unitLabel: '首续₱6,410',
        quantity: visaExtensionCount,
        total: visaExtensionTotal,
        note: '以59天旅游签证为例：12周首次延签₱6,410；16、20、24周分别再加₱4,540，28周第5次为₱5,650。',
      },
      {
        item: '教材费（第一套）',
        unitLabel: '₱2,000 / 套',
        quantity: textbookSets,
        total: 2000 * textbookSets,
        note: '每套₱2,000，约使用8周；ESL、IELTS、Business、ESP通常9本，TOEIC通常7本，实际按课程与学习进度发放。',
      },
      {
        item: '照片费',
        unitLabel: '₱200 / 次',
        quantity: 1,
        total: 200,
        note: '一次性费用。',
      },
    ];
  }

  readonly excludedLocalFees: LocalFeeEstimate[] = [
    {
      item: '宿务马克坦机场周末接机',
      unitLabel: '₱1,000 / 次',
      quantity: 0,
      total: 0,
      note: '可自由选择，也可自行打车；不计入学杂费合计。',
    },
    {
      item: '宿务马克坦机场工作日接机',
      unitLabel: '₱1,500 / 次',
      quantity: 0,
      total: 0,
      note: '可自由选择，也可自行打车；不计入学杂费合计。',
    },
    {
      item: '房间押金',
      unitLabel: '₱2,500 / 次',
      quantity: 1,
      total: 2500,
      note: '₱2,500 / 人，完成退房及房间检查后按学校规定退还；不计入学杂费合计。',
    },
  ];

  get estimatedLocalFeeTotal(): number {
    return this.estimatedLocalFees.reduce((total, fee) => total + fee.total, 0);
  }

  get estimatedLocalFeeCny(): number {
    return Math.round(this.estimatedLocalFeeTotal / this.phpPerCny);
  }

  formatPhp(value: number): string {
    return `₱${Math.round(value).toLocaleString('en-US')}`;
  }

  formatFeeQuantity(value: number): string {
    return value.toLocaleString('zh-CN', { maximumFractionDigits: 2 });
  }

  get discountText(): string {
    return `${Math.round(this.discount * 100)} 折`;
  }

  formatUsd(value: number): string {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: Number.isInteger(value) ? 0 : 1,
      maximumFractionDigits: 1,
    });
  }

  get quoteImageData(): QuoteImageCardData {
    const now = new Date();
    const validUntil = this.addDays(now, 30);
    const formatChineseDate = (date: Date) =>
      `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
    const quoteDate = formatChineseDate(now);
    const quoteDateShort = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}`;
    const quoteCnyAmount =
      Math.round((this.quoteUsd * this.usdToCny) / 100) * 100;
    const fileDate = this.selectedStartDate.replace(/[^0-9]/g, '') || 'quote';
    const localFeeShortNotes: Record<string, string> = {
      SSP特殊学习许可证: '一次办理通常6个月有效；续费或换校时可能需要重新办理。',
      'SSP-E Card': '入学时与SSP同时办理，按一次性费用估算。',
      'ACR-I Card 外国人身份证': '30天签证超过4周、59天签证超过8周需办理；一次有效1年。',
      综合管理费: '每4周₱4,000 / 人。',
      电费: '按基础用电量估算，超额可能另行收费。',
      水费: '按基础用水量估算，超额可能另行收费。',
      签证续签: '按59天签证估算；12周首续₱6,410，16–24周每4周再加₱4,540。',
      '教材费（第一套）': '每套₱2,000，约使用8周，最终以学校实际发放为准。',
      照片费: '一次性费用。',
    };

    return {
      layout: 'cia-detailed',
      fileName: `CIA-${this.selectedWeeks}周报价单-${fileDate}.png`,
      logoSrc: this.quoteImageAssets.logo,
      heroSrc: this.quoteImageAssets.hero,
      schoolCode: 'CIA',
      title: `${this.selectedWeeks}周`,
      subtitle: '',
      quoteDateText: quoteDate,
      updatedAtText: quoteDate,
      quoteNumber: `SQ-CIA-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-001`,
      validUntilText: formatChineseDate(validUntil),
      studentItems: [
        {
          icon: '价',
          label: '报价日期',
          value: quoteDateShort,
        },
        {
          icon: '日',
          label: '入学日期',
          value: this.selectedStartDate.replace(/-/g, '/'),
        },
      ],
      paymentSectionTitle: '学校费用明细（到校前支付给学校的费用）',
      paymentItems: [
        {
          icon: '注',
          label: '注册费',
          amount: `${this.formatUsd(this.payableRegistrationFee)} 美元`,
          note: this.isChristmasPromotionEligible
            ? `圣诞新年优惠已免除${this.registrationFee}美元`
            : '一次性学校注册费',
        },
        {
          icon: '课',
          label: '课程费',
          amount: `${this.formatUsd(this.tuitionForSelectedWeeks)} 美元`,
          note: `${this.appliedTuitionLabel}；${this.selectedCourse.name}；${this.selectedCourse.schedule}`,
        },
        {
          icon: '宿',
          label: '住宿费',
          amount: `${this.formatUsd(this.roomFeeForSelectedWeeks)} 美元`,
          note: this.selectedRoom.name,
        },
        {
          icon: '旺',
          label: '旺季附加费',
          note: `${this.formatUsd(this.seasonalFeePerWeek)}美元/周 × 覆盖${this.peakSeasonWeeks}周；${this.peakSeasonRangeText}`,
          amount: `${this.formatUsd(this.seasonalSurcharge)} 美元`,
        },
        {
          icon: '折',
          label: '思达折扣',
          note: `优惠金额：${this.formatUsd(this.sidaDiscountAmount)}美元`,
          amount: '95折',
          accent: true,
        },
        {
          icon: '惠',
          label: '圣诞新年优惠',
          note: '须完整覆盖2026/12/20–2027/1/2；符合时减200美元且免注册费',
          amount: this.isChristmasPromotionEligible ? '- 200 美元' : '未适用',
          accent: this.isChristmasPromotionEligible,
        },
      ],
      totalLabel: '最终应付学校金额',
      totalUsd: `${this.formatUsd(this.quoteUsd)} 美元`,
      totalCny: `人民币预计金额：约 ${quoteCnyAmount.toLocaleString('zh-CN')} 元`,
      totalNote: '按实时汇率预估，最终以支付当日汇率为准',
      localFeeTitle: `到校后${this.selectedWeeks}周学杂费明细参考（学校及政府相关部门收取）`,
      localFeeAmount: this.formatPhp(this.estimatedLocalFeeTotal),
      localFeeDescription:
        `约人民币${this.estimatedLocalFeeCny.toLocaleString('zh-CN')}元；含SSP、证件、管理、水电、签证及教材等预估。`,
      localFeeNote: '不含接机及房间押金，实际以到校缴费为准。',
      localFeeItems: this.estimatedLocalFees.map((fee) => ({
        label: fee.item,
        unit: fee.unitLabel,
        quantity: this.formatFeeQuantity(fee.quantity),
        amount: this.formatPhp(fee.total),
        note: localFeeShortNotes[fee.item] ?? fee.note,
      })),
      localFeeCny: `人民币预计金额：约 ${this.estimatedLocalFeeCny.toLocaleString('zh-CN')} 元`,
      exchangeRateText: '按实时汇率预估',
      optionalFeeItems: this.excludedLocalFees
        .filter((fee) => !fee.item.includes('工作日接机'))
        .map((fee) => ({
          label: fee.item.includes('周末接机')
            ? '周末接机'
            : fee.item,
          amount: fee.unitLabel,
          note: fee.item.includes('接机')
            ? '按需选择，也可自行前往；不计入学杂费合计。'
            : fee.note,
        })),
      benefitItems: [
        { title: '0中介费', text: '学校合作价格，不额外加收服务费' },
        { title: '价格保护', text: '同条件可比价，核实更低价退差价' },
        { title: '全程报名协助', text: '选校、签证、付款及行前指导' },
        { title: '海外驻点售后', text: '学习期间持续跟进，问题有人协助' },
      ],
      serviceLocations: ['深圳总部', '菲律宾驻点', '欧洲驻点'],
      alumniBenefitItems: [
        {
          title: '老学员权益',
          subtitle: '',
          text: '老学员结业后可享线上一对一英语课程专属优惠，留学爱尔兰及欧美英语学校专属奖学金和优惠。',
        },
      ],
      importantNotes: [
        this.tuitionRuleSummary,
        '若原定2026年入学后改期到2027年，课程费还要按改期日期单独核对。',
        '人民币金额按实时汇率预估，最终以支付当日汇率为准。',
        '学杂费为到校后比索现金预估，实际以学校及相关部门收费为准。',
        '本报价最终以 CIA 最新价格、空房、优惠及思达启航顾问确认为准。',
      ],
      note: '人民币金额为网络参考汇率估算，实际以支付当日汇率为准；学杂费为到校后比索现金预估；本报价最终以 CIA 最新价格、空房、优惠及思达启航顾问确认为准。',
      contact: {
        name: 'Jenny',
        phone: '132 4982 7686',
        avatarSrc: this.quoteImageAssets.jennyAvatar,
        qrSrc: this.quoteImageAssets.jennyQr,
        wechatLabel: '微信二维码占位',
        footerText: '获取正式报价与空房确认',
      },
    };
  }

  private resolveUploadedPhotoCategory(
    category?: string,
  ): Exclude<GalleryCategory, '全部'> {
    const normalizedCategory = (category ?? '').trim().toLowerCase();
    const categoryIndex =
      this.uploadedPhotoCategoryIndexes[normalizedCategory] ?? 1;

    return this.galleryCategories[categoryIndex] as Exclude<
      GalleryCategory,
      '全部'
    >;
  }

  private slugifyPriceKey(value: string): string {
    return value
      .toLowerCase()
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  private orderIndex(order: string[], value: string): number {
    const index = order.indexOf(value);

    return index === -1 ? Number.MAX_SAFE_INTEGER : index;
  }

  private createRoomId(name: string): string {
    const roomCode = name.match(/\b((?:pn|sr)|[psd])\s*-?\s*(\d)\b/i);

    if (roomCode) {
      return `${roomCode[1].toLowerCase()}${roomCode[2]}`;
    }

    return this.slugifyPriceKey(name);
  }

  private currencyCodeForDisplay(code?: string): string {
    if (!code) {
      return '美元';
    }

    const normalizedCode = code.toUpperCase() === 'PESO' ? 'PHP' : code.toUpperCase();

    if (normalizedCode === 'USD') {
      return '美元';
    }

    return normalizedCode === 'PHP' ? '比索' : normalizedCode;
  }

  private formatCurrencyAmount(fee: SchoolFeeDTO): string {
    const currencyCode = this.currencyCodeForDisplay(fee.currencyCode);

    return `${currencyCode} ${fee.fee.toLocaleString('en-US', {
      minimumFractionDigits: Number.isInteger(fee.fee) ? 0 : 1,
      maximumFractionDigits: 1,
    })}`;
  }

  private cleanFeeDescription(description?: string): string {
    if (!description) {
      return '以学校现场收费为准';
    }

    return description
      .replace(/^到校支付费用；/, '')
      .replace(/^前期支付费用；/, '');
  }

  roomFeeFor(id: string): number {
    return this.roomFees.find((room) => room.id === id)?.fee ?? 0;
  }

  roomsForRateGroup(group: RoomRateGroup): RoomRateOption[] {
    return group.rooms;
  }

  setRoomProfile(profileId: string): void {
    this.selectedRoomProfileId = profileId;
  }

  get selectedRoomProfile(): RoomComparisonProfile {
    return (
      this.roomComparisonProfiles.find((profile) => profile.id === this.selectedRoomProfileId) ??
      this.roomComparisonProfiles[0]
    );
  }

  private nextSundayDate(): string {
    const date = new Date();
    const daysUntilSunday = (7 - date.getDay()) % 7;
    date.setDate(date.getDate() + daysUntilSunday);
    return this.formatLocalDate(date);
  }

  private formatLocalDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private parseDate(value: string): Date {
    return new Date(`${value}T00:00:00`);
  }

  private addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  private dateRangesOverlap(
    firstStart: Date,
    firstEnd: Date,
    secondStart: Date,
    secondEnd: Date,
  ): boolean {
    return firstStart <= secondEnd && firstEnd >= secondStart;
  }
}

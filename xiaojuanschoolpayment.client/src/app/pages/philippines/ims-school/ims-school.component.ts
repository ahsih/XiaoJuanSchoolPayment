import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

type GalleryCategory = '全部' | '校区' | '教室' | '住宿' | '生活';
type WeekOption = 1 | 2 | 3 | 4 | 8 | 12 | 16 | 20 | 24;
type CourseId =
  | 'essential-esl-4'
  | 'premium-esl'
  | 'intensive-esl'
  | 'senior-esl'
  | 'exam-business'
  | 'working-holiday'
  | 'junior-esl-6'
  | 'parents-esl';
type RoomId = 'quad' | 'triple' | 'twin' | 'single';

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
}

interface BasicInfoRow {
  label: string;
  value: string;
}

interface TextCard {
  title: string;
  text: string;
}

interface CourseOption {
  id: CourseId;
  name: string;
  type: string;
  lessons: string;
  suitable: string;
  fourWeekFeesUsd: Record<RoomId, number>;
}

interface RoomOption {
  id: RoomId;
  name: string;
  shortName: string;
  note: string;
}

interface FeeRow {
  item: string;
  amount: string;
  note: string;
}

interface ScheduleItem {
  time: string;
  title: string;
  text: string;
}

interface SideNavItem {
  label: string;
  target: string;
  icon: string;
}

interface SourceLink {
  label: string;
  url: string;
}

@Component({
  selector: 'app-ims-school',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './ims-school.component.html',
  styleUrls: [
    '../cebu-school-detail-layout.css',
    '../cebu-school-detail-content.css',
    '../cebu-school-detail-responsive.css',
    '../ev-school/ev-school-detail.component.css',
    './ims-school.component.css',
  ],
})
export class ImsSchoolComponent {
  readonly galleryCategories: GalleryCategory[] = ['全部', '校区', '教室', '住宿', '生活'];
  selectedGalleryCategory: GalleryCategory = '全部';

  readonly weekOptions: WeekOption[] = [1, 2, 3, 4, 8, 12, 16, 20, 24];
  selectedCourseId: CourseId = 'essential-esl-4';
  selectedRoomId: RoomId = 'quad';
  selectedWeeks: WeekOption = 4;
  selectedStartDate = '2026-09-07';
  includeGuardianService = false;
  quoteCalculated = false;

  readonly registrationFeeUsd = 100;
  readonly guardianServiceFourWeeksUsd = 450;
  readonly shortTermRatios: Partial<Record<WeekOption, number>> = {
    1: 0.3,
    2: 0.6,
    3: 0.8,
  };

  readonly quickInfo: QuickInfo[] = [
    {
      icon: 'location_city',
      label: '所在区域',
      value: 'Banilad / Ma. Luisa',
      note: 'Banilad校区位于宿务市区北部生活圈，公开资料强调Maria Luisa周边安全与便利性。',
    },
    {
      icon: 'groups',
      label: '学校定位',
      value: '韩资多国籍综合校',
      note: '课程覆盖ESL、IELTS、TOEIC、Business、Working Holiday、Senior、Junior和Parents ESL。',
    },
    {
      icon: 'school',
      label: '学习体系',
      value: '12阶段水平管理',
      note: '公开资料提到入学分级、定期测试和按水平配置教材与老师，适合中长期稳定学习。',
    },
    {
      icon: 'home_work',
      label: '住宿',
      value: '校内1-4人房',
      note: '公开2026价格表按1人、2人、3人、4人房计算，套餐价含学费和住宿。',
    },
    {
      icon: 'menu_book',
      label: '主力课程',
      value: 'ESL + 考试 + 亲子',
      note: '成人ESL、雅思/多益、商务、Senior、Junior、Parents ESL都能在同一校区内比较。',
    },
    {
      icon: 'paid',
      label: '公开价格',
      value: 'USD套餐价',
      note: '本页报价器按近期公开2026美元套餐表估算；学校官方费用页另有韩元口径，报名时需核对正式报价。',
    },
  ];

  readonly galleryImages: GalleryImage[] = [
    {
      category: '校区',
      title: 'IMS Banilad校园外观',
      description: 'Banilad / Ma. Luisa生活圈，适合想住宿务市区又重视安全感的学生。',
      src: 'https://www.ausbiznet.com/wp/wp-content/uploads/2018/09/cebu_ims-banilad00.jpg',
    },
    {
      category: '生活',
      title: 'IMS校园与泳池参考',
      description: '校内学习、住宿和公共空间集中，适合成人、亲子和青少年中长期学习。',
      src: 'https://www.eslpass.com/upload/tw/products/PIC_thumb_20241212231744.webp',
    },
    {
      category: '教室',
      title: '一对一与小组教室',
      description: 'IMS课程以Man-to-Man和Group组合为主，ESL、IELTS、TOEIC等方向都有对应课表。',
      src: 'https://cdn-ak.f.st-hatena.com/images/fotolife/g/goryugaku/20191030/20191030024300.jpg',
    },
    {
      category: '校区',
      title: '学生服务与接待空间',
      description: '适合需要学校统一管理、生活支持和多课程路线选择的学生。',
      src: 'https://cebu-sakura.com/uploads/shop/7f6fe82003d9408eeea67c46502faf3b.jpg',
    },
    {
      category: '住宿',
      title: '校内宿舍参考',
      description: '公开资料列1人、2人、3人、4人房，房型需按入学日和性别空位确认。',
      src: 'https://www.ryugaku-onebridge.com/api/pict/5804',
    },
    {
      category: '生活',
      title: '餐厅与自习生活',
      description: '公开资料提到3餐、学生休息区、自习空间、清洁和洗衣支持。',
      src: 'https://cebu21.jp/school_visit/ims/img/ph_ims_17.jpg',
    },
  ];

  readonly basicInfo: BasicInfoRow[] = [
    { label: '学校名称', value: '菲律宾宿务IMS Academy' },
    { label: '英文名称', value: 'IMS Academy Cebu / International Maekyung School Academy' },
    { label: '校区', value: 'Banilad Campus / Ayala Campus（本页以Banilad公开资料和费用口径整理）' },
    { label: '地址', value: 'Paseo Saturnino St, Banilad, Ma. Luisa, Cebu City, Philippines' },
    { label: '学校规模', value: '官方资料列住宿容量约153人、课堂容量约180人。' },
    { label: '设施', value: '1:1教室、小组教室、Junior教室、图书馆、自习室、食堂、休息区、宿舍和Wi-Fi。' },
    { label: '4周起价', value: 'USD 1,500起：Essential ESL 4 + 4人房 + 注册费USD 100。' },
  ];

  readonly highlights: TextCard[] = [
    {
      title: 'Banilad生活圈，城市便利度高',
      text: 'IMS Banilad靠近Ma. Luisa、Streetscape、Asmara和Gaisano Country Mall一带，适合想在市区安全生活圈学习的人。',
    },
    {
      title: '课程路线很完整',
      text: '成人ESL、IELTS、TOEIC、Business、Working Holiday、Senior、Junior和Parents ESL都能选择，适合家庭成员目标不同的报名组合。',
    },
    {
      title: '适合低日本比例和多国籍环境偏好',
      text: '第三方公开资料把IMS描述为韩国资本、多国籍学校，日本学生比例相对不高，适合想避开日系大比例环境的学生。',
    },
  ];

  readonly suitableFor: TextCard[] = [
    {
      title: '想住Banilad市区生活圈',
      text: '如果你希望平日学习、周末购物和餐饮都比较方便，IMS比偏远度假村型学校更贴近日常宿务生活。',
    },
    {
      title: '家长、孩子、成人目标不同',
      text: 'Junior、Parents、Senior、ESL和考试路线可以放在同一学校比较，亲子或多人同行更容易统一安排。',
    },
    {
      title: '想要一对一课量和考试选择',
      text: 'Premium ESL、Intensive ESL、IELTS、TOEIC和保证班等路线适合从口语到分数目标逐步升级。',
    },
  ];

  readonly lessSuitableFor: TextCard[] = [
    {
      title: '只想度假海边校园',
      text: 'IMS是Banilad市区校区，不是Mactan海边度假型学校；如果海景和度假感优先，可比较Cebu Blue Ocean或Genius。',
    },
    {
      title: '需要完全统一币种报价',
      text: '公开资料存在官方韩元表与第三方美元表两种口径，本页可做预算，但正式报名一定要拿学校当期invoice确认。',
    },
    {
      title: '想要最严格斯巴达管理',
      text: 'IMS更像综合型市区学校；若需要高度管控、强制晚自习和更严格门禁，可同步比较CG Sparta、EV SP1或CELLA Uni。',
    },
  ];

  readonly courses: CourseOption[] = [
    {
      id: 'essential-esl-4',
      name: 'Essential ESL 4',
      type: 'ESL / 轻量',
      lessons: '4节Man-to-Man + optional morning/night class',
      suitable: '想控制预算、以一对一口语基础为主的成人学生。',
      fourWeekFeesUsd: { quad: 1400, triple: 1450, twin: 1550, single: 1700 },
    },
    {
      id: 'premium-esl',
      name: 'Premium ESL',
      type: 'ESL / 标准',
      lessons: 'Morning + 4节Man-to-Man + 4节Group + Night',
      suitable: '想兼顾一对一、互动小组和全天学习节奏的学生。',
      fourWeekFeesUsd: { quad: 1700, triple: 1750, twin: 1850, single: 2000 },
    },
    {
      id: 'intensive-esl',
      name: 'Intensive ESL',
      type: 'ESL / 强化',
      lessons: 'Morning + 6节Man-to-Man + 3节Group + Night',
      suitable: '想把一对一课量拉高、短期集中提升口语输出的人。',
      fourWeekFeesUsd: { quad: 1900, triple: 1950, twin: 2050, single: 2200 },
    },
    {
      id: 'senior-esl',
      name: 'Senior ESL',
      type: 'Senior / 慢节奏',
      lessons: 'Senior 4或5：以Man-to-Man为主，节奏更柔和',
      suitable: '适合熟龄学生、退休体验、慢速口语和旅行英文需求。',
      fourWeekFeesUsd: { quad: 1500, triple: 1550, twin: 1650, single: 1800 },
    },
    {
      id: 'exam-business',
      name: 'IELTS / TOEIC / Business / Power Speaking',
      type: '考试与专项',
      lessons: '4节Man-to-Man + 4节Group（按方向配置）',
      suitable: '有考试、商务或输出训练目标，想使用更专项课表的学生。',
      fourWeekFeesUsd: { quad: 1900, triple: 1950, twin: 2050, single: 2200 },
    },
    {
      id: 'working-holiday',
      name: 'Working Holiday',
      type: '就业准备',
      lessons: '4节Man-to-Man + 4节Group',
      suitable: '准备打工度假、面试、履历和职场沟通的学生。',
      fourWeekFeesUsd: { quad: 1900, triple: 1950, twin: 2050, single: 2200 },
    },
    {
      id: 'junior-esl-6',
      name: 'Junior ESL 6',
      type: 'Junior / 青少年',
      lessons: 'Junior Man-to-Man + Group组合',
      suitable: '适合青少年英文基础、口语输出和暑寒假学习安排。',
      fourWeekFeesUsd: { quad: 2000, triple: 2050, twin: 2150, single: 2300 },
    },
    {
      id: 'parents-esl',
      name: 'Parents ESL',
      type: 'Guardian / 家长',
      lessons: '3节Man-to-Man + 1节Group',
      suitable: '陪读家长轻量学习英文，同时配合孩子在校学习生活。',
      fourWeekFeesUsd: { quad: 1500, triple: 1550, twin: 1650, single: 1800 },
    },
  ];

  readonly roomOptions: RoomOption[] = [
    { id: 'quad', name: '4人房', shortName: '4人房', note: '预算最低，适合同性同行或能接受多人房的学生。' },
    { id: 'triple', name: '3人房', shortName: '3人房', note: '兼顾价格和生活空间，常见于成人和青少年报名。' },
    { id: 'twin', name: '2人房', shortName: '2人房', note: '预算中等，适合想降低室友人数的人。' },
    { id: 'single', name: '1人房', shortName: '单人房', note: '价格最高，适合重视隐私、睡眠和长期学习稳定度的人。' },
  ];

  readonly specialPrograms: FeeRow[] = [
    {
      item: 'Junior ESL 8 / 9',
      amount: 'USD 2,400 / 2,600 起',
      note: '4周4人房参考；1人房公开价分别为USD 2,700 / 2,900，适合需要更高课量的青少年。',
    },
    {
      item: 'IELTS Guarantee 12周',
      amount: 'USD 6,000 起',
      note: '4人房12周套餐参考；公开资料列1人房USD 6,900、2人房USD 6,450、3人房USD 6,150。',
    },
    {
      item: 'TOEIC Guarantee 12周',
      amount: 'USD 5,850 起',
      note: '4人房12周套餐参考；公开资料列1人房USD 6,750、2人房USD 6,300、3人房USD 6,000。',
    },
    {
      item: 'Guardian Service',
      amount: 'USD 450 / 4周',
      note: '公开资料列未成年学生可选监护服务；实际是否必须购买需按年龄和报名条件确认。',
    },
  ];

  readonly localFees: FeeRow[] = [
    { item: '注册费', amount: 'USD 100', note: '通常报名时收取；本页报价器已加入。' },
    { item: 'SSP', amount: 'PHP 8,000', note: '菲律宾Special Study Permit，按公开2026费用资料整理。' },
    { item: 'SSP E-Card', amount: 'PHP 4,000', note: '近期公开资料列为额外政府费用，需按当期政策确认。' },
    { item: '签证延长', amount: 'PHP 5,050起', note: '5-7周约PHP 5,050；8-11周约PHP 11,850；长期继续递增。' },
    { item: 'ACR-I Card', amount: 'PHP 3,500', note: '通常9周以上需要，按公开费用资料整理。' },
    { item: '学生ID', amount: 'PHP 200', note: '到校当地费用。' },
    { item: '教材费', amount: '约PHP 3,000', note: '按课程和等级不同会变化。' },
    { item: '押金', amount: 'PHP 3,000', note: '离校时按房间检查、水电等情况结算退还。' },
    { item: '电费', amount: 'PHP 1,680 / 4周', note: '另有空调用电按表计或实际使用规则收取。' },
    { item: '水费 / 设施费', amount: 'PHP 1,400 / 4周', note: '公开2026资料列为每4周当地费用。' },
    { item: '接机 / 送机', amount: 'PHP 1,000 / 次', note: '机场接送通常按航班、抵达日和学校规则确认。' },
    { item: '提前或延后住宿', amount: 'PHP 1,000 / 晚', note: '公开资料列含餐食；是否可安排需看宿舍空位。' },
  ];

  readonly scheduleItems: ScheduleItem[] = [
    {
      time: '07:00',
      title: '早餐与晨间准备',
      text: '校内住宿和三餐让学生减少通勤压力，适合想把精力放在课程和复习上的人。',
    },
    {
      time: 'Morning',
      title: '晨间课或第一轮一对一',
      text: 'Premium / Intensive等ESL课程可搭配Morning Class，考试和专项课程则按目标配置。',
    },
    {
      time: 'Daytime',
      title: 'Man-to-Man + Group循环',
      text: 'IMS课程核心是一对一纠错与小组输出，适合先补弱项、再练表达与讨论。',
    },
    {
      time: 'Evening',
      title: 'Night Class / 自习 / 模考',
      text: '公开资料提到自习空间、定期测试和考试课程管理，适合中长期保持学习节奏。',
    },
  ];

  readonly faqs: TextCard[] = [
    {
      title: 'IMS和CIA怎么选？',
      text: 'CIA更像大型度假综合校区，设施和半斯巴达系统更强；IMS更适合想住Banilad生活圈、需要ESL/考试/亲子/Senior多路线，并接受韩资多国籍氛围的人。',
    },
    {
      title: '页面报价是否等于正式invoice？',
      text: '不是。本页按公开2026美元套餐表估算课程和住宿，加上注册费；SSP、签证、教材、水电、押金、接送、机票、保险和个人花费另计。',
    },
    {
      title: '为什么资料里有韩元和美元两种价格？',
      text: 'IMS官方费用页可见韩元口径，第三方公开2026资料给出美元套餐表。本页为了和其他宿务学校页面便于比较，先用美元表做预算，并保留官方资料链接。',
    },
    {
      title: '亲子或未成年可以报名吗？',
      text: 'IMS有Junior ESL和Parents ESL路线，公开资料也提到Guardian Service。未成年单独或亲子报名要按年龄、监护、房型和开课日正式确认。',
    },
  ];

  readonly sideNavItems: SideNavItem[] = [
    { label: '校区亮点', target: 'highlights', icon: 'stars' },
    { label: '课程费用', target: 'courses', icon: 'payments' },
    { label: '快速报价', target: 'quote', icon: 'calculate' },
    { label: '当地费用', target: 'local-fees', icon: 'receipt' },
    { label: '资料来源', target: 'sources', icon: 'link' },
  ];

  readonly mobileAnchors: SideNavItem[] = [
    { label: '图片', target: 'gallery', icon: 'photo_library' },
    { label: '课程', target: 'courses', icon: 'menu_book' },
    { label: '报价', target: 'quote', icon: 'calculate' },
    { label: '费用', target: 'local-fees', icon: 'receipt_long' },
  ];

  readonly sourceLinks: SourceLink[] = [
    { label: 'IMS Academy官方首页', url: 'https://www.ims7.com/' },
    { label: 'IMS Academy官方Banilad校区介绍', url: 'https://www.ims7.com/pp/sub/03/03_eng.php' },
    { label: 'IMS Academy官方费用页', url: 'https://www.ims7.com/pp/sub/05/01_eng.php' },
    { label: 'IMS Academy官方学校设施资料', url: 'https://www.ims7.com/1812/sub/01/01_eng.php' },
    { label: 'IMS Academy官方ESL课程资料', url: 'https://www.ims7.com/1812/sub/02/03_eng.php' },
    { label: 'IMS Academy官方IELTS课程资料', url: 'https://www.ims7.com/1812/sub/02/05_eng.php' },
    { label: 'IMS Academy 2026公开美元费用资料', url: 'https://cebu-english.com/school/ims/' },
    { label: 'BEACL IMS费用与课程参考', url: 'https://beacl.com/school/cebu/ims/' },
  ];

  get filteredGalleryImages(): GalleryImage[] {
    if (this.selectedGalleryCategory === '全部') {
      return this.galleryImages;
    }

    return this.galleryImages.filter((image) => image.category === this.selectedGalleryCategory);
  }

  get selectedCourse(): CourseOption {
    return this.courses.find((course) => course.id === this.selectedCourseId) ?? this.courses[0];
  }

  get selectedRoom(): RoomOption {
    return this.roomOptions.find((room) => room.id === this.selectedRoomId) ?? this.roomOptions[0];
  }

  get studyStayUsd(): number {
    const fourWeekFee = this.selectedCourse.fourWeekFeesUsd[this.selectedRoomId];
    const ratio = this.shortTermRatios[this.selectedWeeks];

    if (ratio) {
      return Math.round(fourWeekFee * ratio);
    }

    return Math.round((fourWeekFee / 4) * this.selectedWeeks);
  }

  get guardianServiceUsd(): number {
    if (!this.includeGuardianService) {
      return 0;
    }

    const ratio = this.shortTermRatios[this.selectedWeeks];
    if (ratio) {
      return Math.round(this.guardianServiceFourWeeksUsd * ratio);
    }

    return Math.round((this.guardianServiceFourWeeksUsd / 4) * this.selectedWeeks);
  }

  get quoteUsd(): number {
    return this.registrationFeeUsd + this.studyStayUsd + this.guardianServiceUsd;
  }

  get studyStayUsdText(): string {
    return this.formatUsd(this.studyStayUsd);
  }

  get quoteUsdText(): string {
    return this.formatUsd(this.quoteUsd);
  }

  get guardianServiceText(): string {
    return this.includeGuardianService ? this.formatUsd(this.guardianServiceUsd) : '未加入';
  }

  get fourWeekStartingText(): string {
    return this.formatUsd(this.registrationFeeUsd + this.courses[0].fourWeekFeesUsd.quad);
  }

  get premiumFourWeekText(): string {
    return this.formatUsd(this.registrationFeeUsd + this.courses[1].fourWeekFeesUsd.quad);
  }

  get weeklyAverageText(): string {
    return this.formatUsd(Math.round(this.quoteUsd / this.selectedWeeks));
  }

  get courseFeeRows() {
    return this.courses.map((course) => ({
      course: course.name,
      lessons: course.lessons,
      quad: this.formatUsd(course.fourWeekFeesUsd.quad),
      triple: this.formatUsd(course.fourWeekFeesUsd.triple),
      twin: this.formatUsd(course.fourWeekFeesUsd.twin),
      single: this.formatUsd(course.fourWeekFeesUsd.single),
    }));
  }

  setGalleryCategory(category: GalleryCategory): void {
    this.selectedGalleryCategory = category;
  }

  calculateQuote(): void {
    this.quoteCalculated = true;
  }

  scrollToSection(id: string, event?: Event): void {
    event?.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  formatUsd(value: number): string {
    return `USD ${value.toLocaleString('en-US')}`;
  }
}

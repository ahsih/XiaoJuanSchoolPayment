import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { SidaWhySectionComponent } from '../../../components/sida-why-section.component';

type GalleryCategory = '全部' | '校区' | '教室' | '住宿' | '生活';
type WeekOption = 4;
type RoomId = 'five' | 'quad' | 'triple' | 'twin' | 'single';

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
  id: string;
  name: string;
  type: string;
  lessons: string;
  suitable: string;
  fourWeekFeesUsd: Partial<Record<RoomId, number>>;
  priceIncludesRegistration?: boolean;
}

interface RoomOption {
  id: RoomId;
  name: string;
  note: string;
}

interface LocalFee {
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
  selector: 'app-elsa-school',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule, SidaWhySectionComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './elsa-school.component.html',
  styleUrls: [
    '../cebu-school-detail-layout.css',
    '../cebu-school-detail-content.css',
    '../cebu-school-detail-responsive.css',
    '../ev-school/ev-school-detail.component.css',
    './elsa-school.component.css',
  ],
})
export class ElsaSchoolComponent {
  readonly galleryCategories: GalleryCategory[] = ['全部', '校区', '教室', '住宿', '生活'];
  selectedGalleryCategory: GalleryCategory = '全部';

  readonly registrationFeeUsd = 100;
  readonly weekOptions: WeekOption[] = [4];

  selectedCourseId = 'super-basic';
  selectedRoomId: RoomId = 'five';
  selectedWeeks: WeekOption = 4;
  selectedStartDate = '2026-09-07';
  quoteCalculated = false;

  readonly quickInfo: QuickInfo[] = [
    {
      icon: 'park',
      label: '学校定位',
      value: '宿务郊区自然度假型亲子校',
      note: 'Compostela大型自然校区，适合亲子、Junior、幼儿园和想避开市区节奏的家庭。',
    },
    {
      icon: 'family_restroom',
      label: '亲子优势',
      value: '幼儿园3-6岁，青少年7-14岁',
      note: '2026-2027价目表列出Kindergarten、Junior ESL、全天/半天学校和陪读家长课程。',
    },
    {
      icon: 'groups',
      label: '公开规模',
      value: '定员约170名',
      note: '资料显示韩国资本运营，学生宿舍A/B/C栋，家庭和低龄学生接待经验较多。',
    },
    {
      icon: 'menu_book',
      label: '课程结构',
      value: '45-50分钟课节，一对一+小班',
      note: '2026-2027价目表包含Guardian、成人ESL、青少年、学校衔接、幼儿园和Golf课程。',
    },
    {
      icon: 'bed',
      label: '住宿',
      value: '校内1/2/3/4/5人向房',
      note: '单独留学通常按1人或2人房计算；3-5人向房更偏家庭或多人同行。',
    },
    {
      icon: 'pool',
      label: '设施',
      value: '泳池 / 草地 / 操场 / 食堂 / 小卖部',
      note: '公开资料提到泳池、宽阔户外空间、散步路线、三餐、JC Mart和校内护士等支持。',
    },
  ];

  readonly galleryImages: GalleryImage[] = [
    {
      category: '校区',
      title: 'ELSA泳池与低层校舍',
      description: 'Compostela自然校区以泳池、草地和低层建筑为核心，不是市区高楼型学校。',
      src: 'https://www.fujiyama-international.com/archives/004/202505/414b2d68d20185f1c1ee5eb61c16eefeada06d16b761aeb08d33328ed32ae346.jpg',
    },
    {
      category: '校区',
      title: '自然感校园步道',
      description: '公开资料将ELSA描述为度假村式自然校区，适合孩子活动量较高的家庭。',
      src: 'https://www.fujiyama-international.com/archives/004/202210/ae1a462216924c428ba9fca7c1cac9b7.jpg',
    },
    {
      category: '生活',
      title: '亲子与低龄学生生活场景',
      description: '亲子家庭可把孩子英文学习、户外活动、住宿和餐食集中在同一校区安排。',
      src: 'https://cebu-navi.com/photo/school/135/f0fc353079a46fbf7b5c0768f8fc2505.jpg',
    },
    {
      category: '住宿',
      title: '学生宿舍房间参考',
      description: '公开资料显示宿舍A/B/C栋，房型按人数、家庭结构和空房情况安排。',
      src: 'https://cebu-navi.com/photo/school/135/18f43835fe2a34a363e8834dfbd3e756.jpg',
    },
    {
      category: '住宿',
      title: 'C栋宿舍楼参考',
      description: 'C栋为较新的宿舍选择之一，公开资料显示Wi-Fi覆盖和舒适度更好。',
      src: 'https://www.ceburyugaku-master.com/school/img/elsa/dormitory-c_01.JPG',
    },
    {
      category: '教室',
      title: 'ELSA课程与户外学习环境',
      description: '课程以一对一、小班、幼儿园、Junior和陪读家长课程组合为主。',
      src: 'https://storage.googleapis.com/world-study-prod/media/school_photo/1624/6aadd266-230a-4f02-b56b-c5d24ac3c72e.jpg',
    },
  ];

  readonly basicInfo: BasicInfoRow[] = [
    { label: '学校名称', value: '菲律宾宿务ELSA International Language School' },
    { label: '英文名称', value: 'ELSA / English International Language School' },
    {
      label: '地址',
      value: 'English International Language School, 6003 Central Nautical Hwy, Compostela, Cebu',
    },
    {
      label: '学校定位',
      value: '宿务郊区自然度假型英语学校，亲子、Junior、Kindergarten、Adult ESL和Golf ESL路线明显。',
    },
    { label: '公开资料', value: '2004年设立，公开容量约170名，韩国资本，校内有A/B/C宿舍和三餐。' },
    { label: '主费币种', value: '2026-2027课程、食宿套餐费以美元USD列示，当地费用以菲律宾比索PHP支付。' },
    {
      label: '4周起价',
      value: 'USD 1,850起：Super Basic ESL + 五人间 + USD 100注册费；PHP当地费用另计。',
    },
  ];

  readonly highlights: TextCard[] = [
    {
      title: '更像“自然校区里的亲子英文营”',
      text: 'ELSA的优势不是市中心便利，而是校园范围、泳池、草地、户外活动和低龄学生生活照顾。',
    },
    {
      title: '幼儿园、Junior和家长课程能一起规划',
      text: '孩子可走Kindergarten、Junior ESL或Schooling方向，家长可选Guardian Relax、Guardian ESL或成人ESL。',
    },
    {
      title: '住宿、餐食、学习和活动集中在校内',
      text: '适合希望把孩子日常动线压缩在校园内，同时保留周末宿务亲子活动空间的家庭。',
    },
  ];

  readonly suitableFor: TextCard[] = [
    {
      title: '带低龄孩子或小学生亲子游学',
      text: '如果孩子需要更大活动空间、校内餐食、幼儿园或Junior支持，ELSA比普通成人校更贴近家庭需求。',
    },
    {
      title: '想避开宿务市区高密度环境',
      text: 'Compostela校区更安静、更自然，适合喜欢草地、泳池、户外和较慢生活节奏的家庭。',
    },
    {
      title: '家长也想安排轻量课程',
      text: 'Guardian Relax、Guardian ESL、Super Basic、Super Intensive和Golf ESL能让家长按精力选择学习强度。',
    },
  ];

  readonly lessSuitableFor: TextCard[] = [
    {
      title: '每天都想逛商场和市中心',
      text: 'ELSA在宿务郊区Compostela，到市区和机场都需要车程；重视市区便利可比较CIA、I.BREEZE或3D Academy。',
    },
    {
      title: '最在意新式酒店感',
      text: '公开顾问资料也提醒ELSA是自然/旧度假村型校区，若首要条件是硬件新、房间现代，要谨慎比较房型。',
    },
    {
      title: '成人单独短期只想社交口语',
      text: '成人可读，但ELSA的强项仍是亲子和Junior；单人成人口语可同步比较CIA、GLANT、3D或First English。',
    },
  ];

  readonly courses: CourseOption[] = [
    {
      id: 'guardian-companion',
      name: '监护人陪同课',
      type: '监护人课程',
      lessons: '团体课3节',
      suitable: '陪读家长希望参加轻量团体课，并保留较多照顾孩子和休息时间。',
      fourWeekFeesUsd: { single: 2000, twin: 1500, triple: 1450, quad: 1400, five: 1350 },
    },
    {
      id: 'guardian-relax',
      name: '监护人轻松课程',
      type: '监护人课程',
      lessons: '一对一2节',
      suitable: '陪读家长想用较轻的课量练习英文，同时兼顾孩子日程。',
      fourWeekFeesUsd: { single: 2100, twin: 1600, triple: 1550, quad: 1500, five: 1450 },
    },
    {
      id: 'guardian-esl',
      name: '监护人 ESL',
      type: '监护人课程',
      lessons: '一对一2节 + 团体课2节',
      suitable: '陪读家长想兼顾一对一输出与团体互动。',
      fourWeekFeesUsd: { single: 2150, twin: 1650, triple: 1600, quad: 1550, five: 1500 },
    },
    {
      id: 'guardian-golf',
      name: '监护人高尔夫课程',
      type: '监护人课程',
      lessons: '团体课3节 + 每周2次高尔夫实地操作',
      suitable: '希望把轻量英文课和每周高尔夫实地练习结合的陪读家长。',
      fourWeekFeesUsd: { single: 2800, twin: 2300, triple: 2250, quad: 2200, five: 2150 },
    },
    {
      id: 'super-basic',
      name: 'Super Basic ESL',
      type: '成人基础ESL',
      lessons: '1:1 5节',
      suitable: '想把学习重心放在一对一输出、基础口语和语法纠错的成人或家长。',
      fourWeekFeesUsd: { single: 2400, twin: 1900, triple: 1850, quad: 1800, five: 1750 },
    },
    {
      id: 'basic',
      name: 'Basic ESL',
      type: '成人基础ESL',
      lessons: '一对一3节 + 团体课3节',
      suitable: '想平衡一对一训练和团体互动的成人学生。',
      fourWeekFeesUsd: { single: 2300, twin: 1800, triple: 1750, quad: 1700, five: 1650 },
    },
    {
      id: 'general',
      name: 'General ESL',
      type: '成人综合ESL',
      lessons: '一对一4节 + 团体课3节',
      suitable: '希望增加一对一课量，同时保留团体会话和互动练习的成人学生。',
      fourWeekFeesUsd: { single: 2400, twin: 1900, triple: 1850, quad: 1800, five: 1750 },
    },
    {
      id: 'intensive',
      name: 'Intensive ESL',
      type: '成人强化ESL',
      lessons: '一对一5节 + 团体课2节',
      suitable: '短期想提高一对一输出密度和综合英文训练强度的成人学生。',
      fourWeekFeesUsd: { single: 2500, twin: 2000, triple: 1950, quad: 1900, five: 1850 },
    },
    {
      id: 'super-intensive',
      name: 'Super Intensive ESL',
      type: '成人强化ESL',
      lessons: '一对一6节 + 团体课1节',
      suitable: '希望把每天大部分学习时间集中在高密度一对一训练的成人学生。',
      fourWeekFeesUsd: { single: 2600, twin: 2100, triple: 2050, quad: 2000, five: 1950 },
    },
    {
      id: 'junior-esl',
      name: '青少年 ESL（7-14岁）',
      type: '青少年英文',
      lessons: '一对一4节 + 团体课3节',
      suitable: '7-14岁左右孩子建立口语、阅读、写作和课堂互动能力。',
      fourWeekFeesUsd: { single: 2500, twin: 2000, triple: 1950, quad: 1900, five: 1850 },
    },
    {
      id: 'full-day-school',
      name: '全天学校（7-14岁）',
      type: '青少年学校课程',
      lessons: '一对一1节 + 团体课6&7节',
      suitable: '7-14岁孩子需要全天学校式英文学习与集体课堂安排。',
      fourWeekFeesUsd: { single: 2500, twin: 2000, triple: 1950, quad: 1900, five: 1850 },
    },
    {
      id: 'half-day-school',
      name: '半天学校（7-14岁）',
      type: '青少年学校课程',
      lessons: '一对一3节 + 团体课4节',
      suitable: '7-14岁孩子希望把半天英文学习与家庭活动时间结合。',
      fourWeekFeesUsd: { single: 2500, twin: 2000, triple: 1950, quad: 1900, five: 1850 },
    },
    {
      id: 'kindergarten',
      name: '幼儿园课程（3-6岁）',
      type: '幼儿园英文',
      lessons: '一对一3节 + 团体课4节',
      suitable: '3-6岁低龄孩子通过一对一和幼儿园式团体课堂建立英文接触。',
      fourWeekFeesUsd: { single: 2600, twin: 2100, triple: 2050, quad: 2000, five: 1950 },
    },
    {
      id: 'kindergarten-childcare',
      name: '幼儿园保姆托管（3-6岁）',
      type: '幼儿园托管',
      lessons: '保姆照顾4课时',
      suitable: '3-6岁孩子需要以保姆照顾为主的四课时托管安排。',
      fourWeekFeesUsd: { single: 2000, twin: 1500, triple: 1450, quad: 1400, five: 1350 },
    },
    {
      id: 'guardian-no-class',
      name: '监护人不上课',
      type: '监护人住宿',
      lessons: '不上课',
      suitable: '仅陪同孩子、不参加课程；价格含注册费和旺季附加费，不打折。',
      fourWeekFeesUsd: { triple: 950, quad: 900, five: 850 },
      priceIncludesRegistration: true,
    },
  ];

  readonly roomOptions: RoomOption[] = [
    { id: 'five', name: '五人间', note: '价目表中的最低房型价格，适合家庭或多人同行，需确认房型资格和空房。' },
    { id: 'quad', name: '四人间', note: '预算型多人房，适合可接受共享空间的亲子或多人组合。' },
    { id: 'triple', name: '三人间', note: '亲子家庭常用房型，需按家庭人数和空房确认。' },
    { id: 'twin', name: '双人间', note: '适合两人同行或部分单独留学安排，需确认当期空房。' },
    { id: 'single', name: '单人间', note: '2026-2027价目表注明：在双人间价格基础上额外加USD 500。' },
  ];

  readonly localFees: LocalFee[] = [
    { item: '注册费', amount: 'USD 100', note: '2026-2027价目表列示的一次性注册费。监护人不上课套餐已含此费用。' },
    { item: 'SSP学习许可', amount: 'PHP 7,800', note: 'ESL学习许可，公开资料列示6个月内适用。' },
    { item: 'SSP E-Card', amount: 'PHP 4,500', note: '菲律宾学习许可相关卡证费用。' },
    { item: 'Facility Usage Fee', amount: 'PHP 1,500 / 人 / 周', note: '公开手册说明包含水电与维护等基础费用。' },
    { item: '空调费', amount: 'PHP 25 / KW', note: '按实际用量后付，公开资料常用约PHP 1,000/周作参考。' },
    { item: '宿舍押金', amount: 'PHP 5,000', note: '退房时按宿舍检查和学校规则结算。' },
    { item: '教材费', amount: '约PHP 1,500-2,500 / 4周', note: '按课程和教材数量不同变动。' },
    { item: '接机 / 送机', amount: 'PHP 1,000 / PHP 2,000-2,500', note: '接机按人，送机按车辆大小公开参考。' },
    { item: '签证延长', amount: 'PHP 5,160起', note: '31天以上停留按周数和延签次数递增。' },
    { item: '保姆服务', amount: 'PHP 16,000 / 4周', note: '全日制公开参考；1-3周也有对应费用。' },
    { item: 'Kindergarten Kit', amount: 'PHP 1,000', note: '幼儿园2周以下可选；3周以上公开资料显示含基本文具包。' },
  ];

  readonly scheduleItems: ScheduleItem[] = [
    {
      time: 'Morning',
      title: '三餐与一对一 / 小班课程开始',
      text: '公开资料显示校内每日三餐，课程按成人、Junior、Kindergarten或Guardian路线安排。',
    },
    {
      time: 'Afternoon',
      title: '孩子课程、户外活动和家长课程并行',
      text: 'Junior和Kindergarten强调课堂互动，也能利用泳池、草地、操场等自然校区空间。',
    },
    {
      time: 'Evening',
      title: '校内生活、陪读照顾和周末活动准备',
      text: 'ELSA不是市中心夜生活型学校，更适合以校内休息、家庭照顾和周末亲子活动为主。',
    },
  ];

  readonly faqs: TextCard[] = [
    {
      title: 'ELSA和CIA怎么选？',
      text: 'CIA更像大型综合半斯巴达新校区，成人、考试和多国籍综合性更强；ELSA更偏自然亲子、低龄孩子、Junior和家庭型住宿体验。',
    },
    {
      title: '页面报价是否包含菲律宾当地费用？',
      text: '不包含。报价器估算USD课程、食宿套餐和注册费；SSP、签证、押金、设施费、空调、教材、接送和其他PHP当地费用另计。',
    },
    {
      title: '为什么报价器只显示4周？',
      text: '本次2026-2027价目表只提供4周USD价格，没有给出短期或长期折扣规则，因此本页不自行推算其他周数。',
    },
    {
      title: '单人间如何计算？',
      text: '价目表注明单人间在对应双人间价格上额外加USD 500；监护人不上课只公布三人间、四人间和五人间价格。',
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
    { label: 'ELSA官方学校网站', url: 'https://elsaschoolcebu.com/' },
    {
      label: 'ELSA 2026英文电子手册',
      url: 'https://fliphtml5.com/sncvz/erbc/20260226_%5BENG%5D_2026_ELSA_Brochure/',
    },
    {
      label: 'Fujiyama ELSA 2026费用与学校资料',
      url: 'https://www.fujiyama-international.com/philippines/elsa-international-language-school.html',
    },
    { label: '菲律宾留学中心ELSA学校资料与2026费用', url: 'https://www.ph-ryugaku.com/school/elsa/' },
    { label: 'Cebu Navi ELSA照片与学校介绍', url: 'https://cebu-navi.com/school/index/elsa_esl' },
    { label: 'Cebu Ryugaku Master ELSA照片资料', url: 'https://www.ceburyugaku-master.com/school/elsa.html' },
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
    return this.availableRoomOptions.find((room) => room.id === this.selectedRoomId) ?? this.availableRoomOptions[0];
  }

  get availableRoomOptions(): RoomOption[] {
    return this.roomOptions.filter((room) => this.selectedCourse.fourWeekFeesUsd[room.id] !== undefined);
  }

  get fourWeekStudyStayUsd(): number {
    return this.selectedCourse.fourWeekFeesUsd[this.selectedRoom.id] ?? 0;
  }

  get registrationFeeForQuoteUsd(): number {
    return this.selectedCourse.priceIncludesRegistration ? 0 : this.registrationFeeUsd;
  }

  get quoteUsd(): number {
    return this.fourWeekStudyStayUsd + this.registrationFeeForQuoteUsd;
  }

  get quoteUsdText(): string {
    return this.formatUsd(this.quoteUsd);
  }

  get fourWeekStartingText(): string {
    return this.formatUsd(this.registrationFeeUsd + 1750);
  }

  get fourWeekJuniorFiveText(): string {
    return this.formatUsd(this.registrationFeeUsd + 1850);
  }

  get weeklyAverageText(): string {
    return this.formatUsd(Math.round(this.quoteUsd / this.selectedWeeks));
  }

  get quoteNote(): string {
    return this.selectedCourse.priceIncludesRegistration
      ? '监护人不上课价格已含注册费和旺季附加费，不打折；PHP当地费用仍需另计。'
      : '按2026-2027价目表的4周价格加USD 100注册费；PHP当地费用另计。';
  }

  get courseFeeRows() {
    return this.courses.map((course) => ({
      course: course.name,
      lessons: course.lessons,
      five: this.formatOptionalUsd(course.fourWeekFeesUsd.five),
      quad: this.formatOptionalUsd(course.fourWeekFeesUsd.quad),
      triple: this.formatOptionalUsd(course.fourWeekFeesUsd.triple),
      twin: this.formatOptionalUsd(course.fourWeekFeesUsd.twin),
      single: this.formatOptionalUsd(course.fourWeekFeesUsd.single),
    }));
  }

  setGalleryCategory(category: GalleryCategory): void {
    this.selectedGalleryCategory = category;
  }

  calculateQuote(): void {
    this.quoteCalculated = true;
  }

  normalizeSelectedRoom(): void {
    if (this.selectedCourse.fourWeekFeesUsd[this.selectedRoomId] === undefined) {
      this.selectedRoomId = this.availableRoomOptions[0].id;
    }
  }

  scrollToSection(id: string, event?: Event): void {
    event?.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  formatUsd(value: number): string {
    return `USD ${value.toLocaleString('en-US')}`;
  }

  formatOptionalUsd(value: number | undefined): string {
    return value === undefined ? '—' : this.formatUsd(value);
  }
}

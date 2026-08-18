import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

type GalleryCategory = '全部' | '校园' | '课堂' | '住宿' | '生活';
type WeekOption = 4 | 8 | 12 | 16 | 20 | 24;
type CourseId =
  | 'light-esl'
  | 'general-esl'
  | 'native-esl'
  | 'native-only'
  | 'toeic'
  | 'ielts'
  | 'guardian'
  | 'junior-a'
  | 'junior-b'
  | 'kindergarten-half'
  | 'kindergarten-full'
  | 'summer-camp';
type RoomId = 'one-bed' | 'two-bed' | 'three-bed';

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

interface Highlight {
  image: string;
  title: string;
  text: string;
}

interface FitItem {
  title: string;
  text: string;
}

interface CourseOption {
  id: CourseId;
  name: string;
  type: string;
  lessons: string;
  suitable: string;
  tuition4w: number;
}

interface RoomOption {
  id: RoomId;
  name: string;
  fee4w: number;
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

interface ProcessStep {
  icon: string;
  title: string;
  text: string;
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

interface SourceLink {
  label: string;
  url: string;
}

@Component({
  selector: 'app-hana-school',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './hana-school.component.html',
  styleUrls: [
    '../cebu-school-detail-layout.css',
    '../cebu-school-detail-content.css',
    '../cebu-school-detail-responsive.css',
    '../ev-school/ev-school-detail.component.css',
    './hana-school.component.css',
  ],
})
export class HanaSchoolComponent {
  readonly galleryCategories: GalleryCategory[] = ['全部', '校园', '课堂', '住宿', '生活'];
  selectedGalleryCategory: GalleryCategory = '全部';
  selectedCourseId: CourseId = 'light-esl';
  selectedRoomId: RoomId = 'two-bed';
  selectedWeeks: WeekOption = 4;
  selectedStartDate = '2026-09-07';
  quoteCalculated = false;

  readonly registrationFeeUsd = 0;
  readonly weekOptions: WeekOption[] = [4, 8, 12, 16, 20, 24];

  readonly quickInfo: QuickInfo[] = [
    {
      icon: 'location_on',
      label: '城市',
      value: 'Clark / Angeles City',
      note: 'HANA Academy位于Angeles City, Pampanga，官网列地址为Lot 3-2a Cutcut, Friendship Highway。',
    },
    {
      icon: 'record_voice_over',
      label: '课程特色',
      value: 'Native + 1:1',
      note: '官网强调Native 1:1、菲律宾老师一对一、小组课和灵活课程组合。',
    },
    {
      icon: 'family_restroom',
      label: '适合年龄',
      value: 'Kindergarten to Senior',
      note: '覆盖幼儿园、Junior、成人、亲子、Golf English和Senior课程。',
    },
    {
      icon: 'golf_course',
      label: '特色项目',
      value: 'English + Golf',
      note: '官网列高尔夫练习场约50米，Golf Intensive包含16次一对一高尔夫课。',
    },
    {
      icon: 'hotel',
      label: '住宿',
      value: '校内 / Hotel Dormitory',
      note: '官网列普通宿舍和距离学校约3km、平日每日6班接驳的Hotel Dormitory。',
    },
    {
      icon: 'payments',
      label: '4周起价',
      value: 'USD 1,430 / 4周起',
      note: '2026价目表：Light ESL + 双人房4周课程住宿USD1,430，原注册费USD100当前减免。',
    },
  ];

  readonly galleryImages: GalleryImage[] = [
    {
      category: '校园',
      title: 'HANA Academy校园泳池',
      description: 'HANA Academy公开图片中的校区泳池与热带庭院，体现Clark舒适型学习环境。',
      src: 'https://media.loveitopcdn.com/29958/campus-hana-min.jpg',
    },
    {
      category: '课堂',
      title: 'HANA Academy课堂走廊',
      description: 'HANA官网图片展示的明亮教学空间走廊，适合核对1:1教室氛围。',
      src: 'https://static.readdy.ai/image/d000806ada85d387ffa3466a860b2591/57d72d54ebdb3ac912a1e0988751a611.png',
    },
    {
      category: '生活',
      title: 'Clark泳池休闲区',
      description: 'HANA Hotel Dormitory相关页面展示的泳池休闲空间，住宿类型和接驳需按当期确认。',
      src: 'https://images.oyoroomscdn.com/uploads/hotel_image/249957/large/udtufewmbldj.jpg',
    },
    {
      category: '住宿',
      title: 'Clark住宿舒适度参考',
      description: 'HANA公开资料列校内宿舍与Hotel Dormitory，房型空位、楼栋和接驳以学校回复为准。',
      src: 'assets/philippines/clark-study-hero.jpg',
    },
    {
      category: '生活',
      title: 'Clark-Angeles生活圈',
      description: '官网列学校周边100米内有咖啡、餐厅、超市、ATM等生活资源。',
      src: 'assets/philippines/clark-study-hero.jpg',
    },
  ];

  readonly basicInfo: BasicInfoRow[] = [
    { label: '学校名称', value: 'HANA Academy' },
    { label: '公司名称', value: 'HARA AND HANAH INTERNATIONAL ACADEMY INC' },
    { label: '地址', value: 'Lot 3-2a Cutcut, Friendship Highway, Angeles City, Pampanga, Philippines' },
    { label: '官方定位', value: 'Clark-Angeles City英语学校，主打Native teachers、1-on-1 classes、family和senior友好路线。' },
    { label: '课程方向', value: 'Light ESL、General ESL、Native ESL、Native Only、TOEIC、IELTS、Guardian、Junior、Kindergarten、夏令营、Golf、Senior。' },
    { label: '认证参考', value: '官网About页列DepEd、TESDA、DOT、Immigration Permit等；多语言页也提到CAESA正式会员。' },
    { label: '位置与交通', value: '官网写Clark International Airport约25分钟，SM Telabastagan约10分钟车程。' },
    { label: '设施', value: '宿舍、Hotel Dormitory、1:1教室、自习空间、餐厅、泳池、50米内Golf/Badminton、1km内健身房、周边咖啡餐厅超市。' },
  ];

  readonly highlights: Highlight[] = [
    {
      image: this.galleryImages[0].src,
      title: 'Clark舒适生活圈',
      text: 'HANA把校区放在Clark-Angeles生活便利区域，适合重视机场、餐厅、超市、医疗与周边设施的学生和家庭。',
    },
    {
      image: this.galleryImages[1].src,
      title: 'Native 1:1与菲律宾老师组合',
      text: '成人课程从Light ESL到Native Only，区别在菲律宾老师一对一、Native一对一和团体课比例。',
    },
    {
      image: this.galleryImages[2].src,
      title: '亲子、幼儿园和Senior路线完整',
      text: '官网覆盖3-6岁Kindergarten、7-17岁Junior、Guardian家长课程和50+ Senior课程，适合家庭一站式比较。',
    },
    {
      image: 'assets/philippines/clark-study-hero.jpg',
      title: 'English + Golf是明显特色',
      text: 'Golf Intensive和Golf Leisure把英语课与高尔夫练习结合，适合想把学习和运动放在同一行程的人。',
    },
  ];

  readonly suitableFor: FitItem[] = [
    { title: '想在Clark练Native口语', text: 'Native ESL、Native Only、IELTS/TOEIC中的Native 1:1都适合重视发音、自然表达和口语纠正的人。' },
    { title: '亲子或多年龄同行', text: '幼儿园、Junior、Guardian、成人和Senior路线都能同时比较，适合家庭成员学习目标不同的情况。' },
    { title: '想要学习+高尔夫/生活体验', text: 'English + Golf、泳池、周边咖啡餐厅和Clark交通便利，让行程更像学习生活结合。' },
    { title: '想看费用透明的官方表', text: '官网课程页公开4周课程费、住宿费、套餐价和PHP当地费用，适合先做预算初筛。' },
  ];

  readonly notSuitableFor: FitItem[] = [
    { title: '目标是严格Sparta冲刺', text: 'HANA更偏Clark舒适和灵活路线；若要高压晚自习和强制管理，可同步比较HELP Clark或碧瑶学校。' },
    { title: '只看最低价成人ESL', text: 'HANA的优势包含Native课、生活圈和设施，不一定是Clark最低预算选项。' },
    { title: '不想做房型核价', text: '单人、双人、三人、家庭房和Hotel Dormitory会影响总价，报名时必须按当期空房确认。' },
    { title: '低龄学生无人陪同', text: 'Junior和Kindergarten适合家庭规划，但年龄、监护、接送、课后照顾和活动规则要提前逐项确认。' },
  ];

  readonly courses: CourseOption[] = [
    {
      id: 'light-esl',
      name: 'Light ESL',
      type: 'Adult ESL',
      lessons: '4P 1:1 + 1PH Group + 1Native Group',
      suitable: '适合成人初学、轻量学习和想保留更多自由时间的学生。',
      tuition4w: 730,
    },
    {
      id: 'general-esl',
      name: 'General ESL',
      type: 'Adult ESL',
      lessons: '5P 1:1 + 1PH Group + 1Native Group',
      suitable: '官网标注为Most Popular，适合想提高一对一课时和稳定输出的人。',
      tuition4w: 860,
    },
    {
      id: 'native-esl',
      name: 'Native ESL',
      type: 'Native Speaking',
      lessons: '2P 1:1 + 2Native 1:1 + 1PH Group + 1Native Group',
      suitable: '适合已有基础、想提升自然表达、发音和英文思维的人。',
      tuition4w: 1030,
    },
    {
      id: 'native-only',
      name: 'Native Only',
      type: 'Native Intensive',
      lessons: '4Native 1:1 + 1Native Group',
      suitable: '适合中高级学生、外教适应、面试口语和自然表达强化。',
      tuition4w: 1300,
    },
    {
      id: 'toeic',
      name: 'TOEIC',
      type: 'Exam Prep',
      lessons: '3P 1:1 + 1Native 1:1 + 1PH Group + 1Native Group + weekly mock test',
      suitable: '适合求职、升学或企业英语能力证明需求。',
      tuition4w: 1025,
    },
    {
      id: 'ielts',
      name: 'IELTS',
      type: 'Exam Prep',
      lessons: '3P 1:1 + 1Native 1:1 + 1PH Group + 1Native Group + weekly mock test',
      suitable: '适合雅思听说读写备考，官网提到8周以上可关注保证项目。',
      tuition4w: 1025,
    },
    {
      id: 'guardian',
      name: 'Guardian',
      type: 'Parent Course',
      lessons: '3P 1:1 + 1PH Group',
      suitable: '适合陪读家长轻量学习，也可和孩子课程组合报价。',
      tuition4w: 570,
    },
    {
      id: 'junior-a',
      name: 'Junior Course A',
      type: 'Junior Activity',
      lessons: '4P 1:1 + 2PH Group + 2 Activity classes',
      suitable: '适合7-17岁，想兼顾英语和活动体验的青少年。',
      tuition4w: 1100,
    },
    {
      id: 'junior-b',
      name: 'Junior Course B',
      type: 'Junior Academic',
      lessons: '6P 1:1 + 1PH Group + 1Native Group',
      suitable: '适合更偏学术和语言输出的青少年学生。',
      tuition4w: 1200,
    },
    {
      id: 'kindergarten-half',
      name: 'Kindergarten Half Day',
      type: 'Kindergarten',
      lessons: '08:30 - 12:30 or 13:30 - 16:45',
      suitable: '适合3-6岁低龄儿童半日英语沉浸，住宿餐食另计。',
      tuition4w: 600,
    },
    {
      id: 'kindergarten-full',
      name: 'Kindergarten Full Day',
      type: 'Kindergarten',
      lessons: '08:30 - 12:30 / 13:30 - 16:45',
      suitable: '适合3-6岁低龄儿童全天活动、英文和蒙特梭利理念课程。',
      tuition4w: 1100,
    },
    {
      id: 'summer-camp',
      name: 'Summer Camp (7-17 years)',
      type: 'Summer Camp',
      lessons: '7-17岁夏令营，含游泳课',
      suitable: '适合7-17岁暑期集中学习与活动体验，具体营期需按学校当期安排确认。',
      tuition4w: 2800,
    },
  ];

  readonly roomOptions: RoomOption[] = [
    { id: 'one-bed', name: '1 bed / 单人房', fee4w: 900, note: '普通房型4周住宿参考，隐私最高。' },
    { id: 'two-bed', name: '2 beds / 双人房', fee4w: 700, note: '多数成人课程常用预算房型，费用较平衡。' },
    { id: 'three-bed', name: '3 beds / 三人房', fee4w: 600, note: '2026价目表备注为家庭房，需按同行人数和空房确认。' },
  ];

  readonly localFees: LocalFee[] = [
    { item: 'Registration Fee', amount: 'USD 100 / person（当前减免）', note: '2026价目表列标准注册费USD100，并注明注册费减免；最终以学校invoice为准。' },
    { item: 'Visa Extension', amount: 'PHP 4,630 起', note: '1st extension到8周；之后2nd PHP5,900，后续每次PHP4,130参考。' },
    { item: 'SSP', amount: 'PHP 7,500', note: '特别学习许可；官网表说明无ACR有效2个月，有ACR有效6个月。' },
    { item: 'SSP E-Card', amount: 'PHP 4,000', note: '官网当地费用表列示，有效期1年。' },
    { item: 'ACR I-Card', amount: 'PHP 4,000', note: '9周以上通常需要，官方表列有效期1年。' },
    { item: 'Student ID', amount: 'PHP 200', note: '学生证办理参考。' },
    { item: 'Electricity', amount: 'PHP 450-600 / week base', note: '单人房低于20kw/周PHP450；2-5人房低于20kw/周/房PHP600，超额PHP22/kw。' },
    { item: 'Utility Fee', amount: 'PHP 2,000-3,000 / 4周', note: '水、洗衣、清洁等；单人PHP3,000，双人PHP2,500/人，三人PHP2,000/人参考。' },
    { item: 'Deposit', amount: 'PHP 4,000 / person', note: '家庭为PHP5,000/Family，退房检查后按规则处理。' },
    { item: 'Pickup Fee', amount: 'Clark PHP1,000 / Manila PHP5,500', note: '个人接机参考；家庭Clark PHP1,500、Manila PHP6,500。' },
    { item: 'Textbook', amount: 'PHP 300-400 / book', note: '按实际教材数量购买。' },
    { item: 'Extra 1:1', amount: 'PHP 7,000 / 14,000', note: '菲律宾老师PHP7,000/4周，Native老师PHP14,000/4周。' },
  ];

  readonly schedule: ScheduleItem[] = [
    { time: '07:00 - 08:30', title: '起床与早餐', text: '官网General ESL和Golf样例日程均从早餐后进入上午课程。' },
    { time: '08:30 - 12:35', title: '上午一对一课程', text: 'Adult General ESL通常安排Speaking、Reading、Writing、Grammar、Vocabulary等菲律宾老师一对一课程。' },
    { time: '12:40 - 13:25', title: '午餐', text: '学校餐厅用餐；Kindergarten半日课程通常到12:35结束。' },
    { time: '13:30 - 15:05', title: '团体课 / Native课 / Golf', text: '成人课程进入菲律宾团体课与Native团体课；Golf Intensive下午可能安排一对一高尔夫课和练习。' },
    { time: '15:10 - 16:45', title: '自习 / 活动 / Full Day Kindergarten', text: '成人课程可自习或自由安排；Kindergarten Full Day包含游泳、艺术、烹饪等活动。' },
    { time: '17:35 - 18:20', title: '晚餐与自由时间', text: 'HANA更偏舒适生活型，晚间管理和门禁规则需按当期学生手册确认。' },
  ];

  readonly serviceSteps: ProcessStep[] = [
    { icon: 'family_restroom', title: '先确认学习对象', text: '成人、亲子、Junior、Kindergarten、Senior和Golf路线的课程与住宿规则不同。' },
    { icon: 'record_voice_over', title: '核对Native课比例', text: '按目标确认菲律宾老师一对一、Native一对一、Native团体课和模拟考试安排。' },
    { icon: 'hotel', title: '确认房型与住宿', text: '普通宿舍、家庭房和Hotel Dormitory价格、空房与接驳安排要分开确认。' },
    { icon: 'payments', title: '拆分USD与PHP费用', text: '课程住宿按USD估算，SSP、签证、教材、电费、Utility和接机按PHP另列。' },
    { icon: 'flight_takeoff', title: '安排Clark或Manila接机', text: 'Clark机场和Manila机场接机价格不同，家庭同行需提前确认车辆和抵达时间。' },
    { icon: 'support_agent', title: '报名后持续跟进', text: '入学、分级测试、教材、当地费用和日程调整由顾问继续协助沟通。' },
  ];

  readonly notes = [
    'HANA 2026价目表价格为USD；课程费与住宿费分列，当地PHP费用另计。',
    '2026价目表列标准注册费USD100，并注明注册费减免；本页估算器按减免后的USD0计算，最终以学校invoice为准。',
    'Clark与Manila接机费不同；如自行前往，官网建议Grab搜索HARA AND HANAH INTERNATIONAL ACADEMY。',
    'Kindergarten、Junior和Senior课程有各自规则，年龄、监护、活动、接送和医疗支持要按当期确认。',
    '官网列低季优惠、早鸟、团报和长期优惠，但是否适用要按入学日期、房型和学校回函确认。',
  ];

  readonly faqs: FaqItem[] = [
    {
      question: 'HANA Academy在哪里？',
      answer:
        'HANA Academy位于Lot 3-2a Cutcut, Friendship Highway, Angeles City, Pampanga，属于Clark/Angeles生活圈。官网写Clark机场约25分钟，SM Telabastagan约10分钟车程。',
    },
    {
      question: 'HANA 4周最低大概多少钱？',
      answer:
        '按2026价目表，Light ESL课程费USD730，双人房住宿USD700，4周课程住宿合计USD1,430；价目表注明原注册费USD100当前减免，PHP当地费用另算。',
    },
    {
      question: 'HANA适合亲子吗？',
      answer:
        '适合放进亲子候选。官网覆盖3-6岁Kindergarten、7-17岁Junior、Guardian家长课程、家庭房率和校内/周边设施。具体年龄、监护和空房需当期确认。',
    },
    {
      question: 'HANA和HELP Clark、CIP、EG怎么比较？',
      answer:
        'HANA更偏Native口语、家庭、Senior、Golf和Clark生活便利；HELP更偏Sparta强管理；CIP和EG更适合综合ESL、考试和外教比例比较。',
    },
    {
      question: '页面报价包含所有费用吗？',
      answer:
        '不包含全部。报价器只估算USD课程费和住宿费，并按2026价目表应用注册费减免；SSP、签证、SSP E-Card、ACR、教材、电费、Utility、押金、接机、机票、保险和个人消费另算。',
    },
  ];

  readonly sideNav: SideNavItem[] = [
    { label: '学校环境', target: 'gallery', icon: 'image' },
    { label: '课程费用', target: 'course-fees', icon: 'menu_book' },
    { label: '费用估算', target: 'quote', icon: 'calculate' },
    { label: '当地费用', target: 'local-fees', icon: 'payments' },
    { label: '服务流程', target: 'service-process', icon: 'task_alt' },
    { label: '资料来源', target: 'sources', icon: 'link' },
    { label: 'FAQ', target: 'faq', icon: 'help' },
  ];

  readonly mobileAnchors: SideNavItem[] = [
    { label: '概览', target: 'top', icon: 'dashboard' },
    { label: '环境', target: 'gallery', icon: 'image' },
    { label: '课程', target: 'course-fees', icon: 'menu_book' },
    { label: '报价', target: 'quote', icon: 'calculate' },
    { label: '费用', target: 'local-fees', icon: 'receipt_long' },
    { label: 'FAQ', target: 'faq', icon: 'help' },
  ];

  readonly sources: SourceLink[] = [
    { label: 'HANA Academy官网', url: 'https://clarkhana.com/' },
    { label: 'HANA课程与费用', url: 'https://clarkhana.com/courses' },
    { label: 'HANA Adult Courses', url: 'https://clarkhana.com/courses/adult' },
    { label: 'HANA Kindergarten', url: 'https://clarkhana.com/courses/kindergarten' },
    { label: 'HANA Golf English', url: 'https://clarkhana.com/courses/golf' },
    { label: 'HANA Senior Course', url: 'https://clarkhana.com/courses/senior' },
    { label: 'HANA Admission Guide', url: 'https://clarkhana.com/admission' },
    { label: 'HANA About / Accreditation', url: 'https://clarkhana.com/about-us' },
    { label: 'HANA Gallery', url: 'https://clarkhana.com/gallery' },
  ];

  get filteredGalleryImages(): GalleryImage[] {
    return this.selectedGalleryCategory === '全部'
      ? this.galleryImages
      : this.galleryImages.filter((image) => image.category === this.selectedGalleryCategory);
  }

  get selectedCourse(): CourseOption {
    return this.courses.find((course) => course.id === this.selectedCourseId) ?? this.courses[0];
  }

  get selectedRoom(): RoomOption {
    return this.roomOptions.find((room) => room.id === this.selectedRoomId) ?? this.roomOptions[0];
  }

  get tuitionForSelectedWeeks(): number {
    return this.selectedCourse.tuition4w * (this.selectedWeeks / 4);
  }

  get roomFeeForSelectedWeeks(): number {
    return this.selectedRoom.fee4w * (this.selectedWeeks / 4);
  }

  get quoteUsd(): number {
    return this.registrationFeeUsd + this.tuitionForSelectedWeeks + this.roomFeeForSelectedWeeks;
  }

  get quoteText(): string {
    return `${this.formatUsd(this.quoteUsd)} 起`;
  }

  get fourWeekStartingText(): string {
    return this.formatUsd(this.courses[0].tuition4w + this.roomOptions[1].fee4w);
  }

  get formulaText(): string {
    return `(${this.selectedCourse.name} + ${this.selectedRoom.name}) x ${this.selectedWeeks}周 / 4（2026注册费减免）`;
  }

  get courseFeeRows() {
    return this.courses.map((course) => ({
      course: course.name,
      tuition: this.formatUsd(course.tuition4w),
      oneBed: this.formatUsd(course.tuition4w + this.roomOptions[0].fee4w),
      twoBed: this.formatUsd(course.tuition4w + this.roomOptions[1].fee4w),
      threeBed: this.formatUsd(course.tuition4w + this.roomOptions[2].fee4w),
      suitable: course.suitable,
    }));
  }

  setGalleryCategory(category: GalleryCategory): void {
    this.selectedGalleryCategory = category;
  }

  calculateQuote(): void {
    this.quoteCalculated = true;
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

  formatUsd(value: number): string {
    return `USD ${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  }
}

import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

type GalleryCategory = '全部' | '校园' | '教室' | '住宿' | '活动';
type PricingMode = 'promo' | 'standard';
type BaseWeek = 1 | 2 | 3 | 4;
type WeekOption = BaseWeek | 8 | 12 | 16 | 20 | 24;

interface PricePlan {
  priceByWeek: Record<BaseWeek, number>;
  additionalWeek: number;
}

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
  id: string;
  name: string;
  type: string;
  lessons: string;
  suitable: string;
  prices: Record<PricingMode, PricePlan>;
  note: string;
}

interface RoomOption {
  id: string;
  name: string;
  shortName: string;
  category: string;
  inclusion: string;
  prices: Record<PricingMode, PricePlan>;
  note: string;
}

interface LocalFee {
  item: string;
  amount: string;
  note: string;
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
  selector: 'app-paradise-english-school',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './paradise-english-school.component.html',
  styleUrls: [
    '../cebu-school-detail-layout.css',
    '../cebu-school-detail-content.css',
    '../cebu-school-detail-responsive.css',
    '../ev-school/ev-school-detail.component.css',
    './paradise-english-school.component.css',
  ],
})
export class ParadiseEnglishSchoolComponent {
  readonly galleryCategories: GalleryCategory[] = ['全部', '校园', '教室', '住宿', '活动'];
  readonly weekOptions: WeekOption[] = [1, 2, 3, 4, 8, 12, 16, 20, 24];
  readonly registrationFee = 130;
  readonly usdToCny = 7.2;

  selectedGalleryCategory: GalleryCategory = '全部';
  selectedPricingMode: PricingMode = 'promo';
  selectedCourseId = 'budget';
  selectedRoomId = 'shared-standard-dorm';
  selectedWeeks: WeekOption = 4;
  selectedStartDate = '2026-09-07';
  quoteCalculated = false;

  readonly pricingModes = [
    {
      id: 'promo' as const,
      label: '官网显示优惠价',
      note: '2026价格页显示1-4周按10%-40%优惠，Additional Week也有优惠价。',
    },
    {
      id: 'standard' as const,
      label: '官网原价',
      note: '用于促销结束、旺季或学校重新核价时做保守预算。',
    },
  ];

  readonly quickInfo: QuickInfo[] = [
    {
      icon: 'location_on',
      label: '位置',
      value: 'Cagban / Manoc-Manoc, Boracay',
      note: '官网Contact与FAQ列地址为Cagban, Manoc-Manoc, Boracay Island, Malay, Aklan。',
    },
    {
      icon: 'flag',
      label: '学校背景',
      value: 'Canadian family-owned',
      note: '官网写明Paradise English为加拿大人家庭经营的长滩岛英语学校，2005年创立。',
    },
    {
      icon: 'groups',
      label: '学生多样性',
      value: '70+国家学生',
      note: '官网About页写明学生来自70多个国家，首页与教师页也强调国际化学习环境。',
    },
    {
      icon: 'menu_book',
      label: '课程',
      value: 'Budget / General / Intensive / IELTS',
      note: '官网课程页列ESL、True Beginner、IELTS/TOEIC/Business、Junior Camp和Bildungsurlaub。',
    },
    {
      icon: 'hotel',
      label: '住宿',
      value: 'Dorm / Homestay / Annex Hotel / Resort',
      note: '住宿页列校外宿舍、寄宿家庭、Annex Hotel和4星度假村等选择。',
    },
    {
      icon: 'payments',
      label: '4周参考',
      value: 'USD 1,072起含注册费',
      note: '按官网优惠价Budget 4周USD591 + Shared Standard Dorm 4周USD351 + 注册费USD130估算。',
    },
  ];

  readonly galleryImages: GalleryImage[] = [
    {
      category: '校园',
      title: 'Paradise English校园外观',
      description:
        '长滩岛热带绿植中的小型校园，适合想要轻松海岛环境和国际化课堂的人。',
      src: 'https://www.esl.co.uk/sites/default/files/school/hero/esl-language-courses-abroad-english-philippines-boracay-paradise-english.jpg',
    },
    {
      category: '校园',
      title: 'Paradise English校园鸟瞰',
      description:
        '校园规模不大，核心卖点是多国籍、小班互动、长滩岛生活和老师支持。',
      src: 'https://storage.googleapis.com/world-study-prod/media/858/aac6e10c-c603-458d-b02d-c7242621fa98.jpg',
    },
    {
      category: '教室',
      title: '小组课堂参考',
      description:
        '课程页说明小组课和一对一由American、Canadian、British和Filipino老师授课。',
      src: 'https://www.esl.ch/sites/default/files/styles/image_gallery/public/school/gallery/school/Philippines/Paradise-English-Language-Institute-School-Gallery-990-7.jpg?itok=CaI2joiu',
    },
    {
      category: '教室',
      title: 'Group Classroom',
      description:
        'Budget、General和Intensive课程都包含不同数量的小组课，适合练表达和互动。',
      src: 'https://www.fujiyama-international.com/archives/004/202504/45de9567c496d3088786257fecf6048fa5380efb1215f827eb6df20eb03d6f84.jpg',
    },
    {
      category: '住宿',
      title: '宿舍房间参考',
      description:
        '住宿页列宿舍房有空调、独立卫浴、热冷水、公共厨房和距离学校约3分钟步行。',
      src: 'https://storage.googleapis.com/world-study-prod/media/school_photo/858/b912f7b4-a73b-4192-8e96-835e410987a5.jpg',
    },
    {
      category: '住宿',
      title: 'Paradise English Dormitory入口',
      description:
        '宿舍为gated entrance和fenced perimeter，适合预算型学生和长期停留学生。',
      src: 'https://media.vrbo.com/lodging/114000000/113320000/113315200/113315173/aabf7660.jpg?impolicy=resizecrop&ra=fill&rh=575&rw=575',
    },
  ];

  readonly basicInfo: BasicInfoRow[] = [
    { label: '学校名称', value: '菲律宾长滩岛Paradise English Boracay Language Institute' },
    { label: '英文名称', value: 'Paradise English Boracay / Paradise English Language Institute' },
    { label: '地址', value: 'Cagban, Manoc-Manoc, Boracay Island, Malay, Aklan 5608, Philippines' },
    { label: '创立时间', value: '官网About页写明Established in 2005' },
    { label: '学校背景', value: 'Canadian family-owned English Language center' },
    { label: '主要课程', value: 'Budget、General、Intensive、True Beginner、IELTS/TOEIC/Business、Bildungsurlaub、Junior Camp' },
    { label: '授课老师', value: '官网课程页列American、Canadian、British和Filipino teachers' },
    { label: '认证与合作', value: 'Bureau of Immigration、Association of Accredited Schools in the Philippines；官网列British Council和Ascentis关联' },
    { label: '开放时间', value: '周一至周五8:30AM-5:30PM，节假日除外' },
    { label: '本页费用口径', value: '按官网2026课程价格与Accommodation页面整理，正式以学校invoice为准' },
  ];

  readonly highlights: Highlight[] = [
    {
      image: 'https://storage.googleapis.com/world-study-prod/media/858/aac6e10c-c603-458d-b02d-c7242621fa98.jpg',
      title: '长滩岛老牌加拿大背景学校',
      text: '官网写明学校2005年创立，加拿大人家庭经营，适合想要多国籍、轻松但有课堂推动的学生。',
    },
    {
      image: 'https://www.esl.ch/sites/default/files/styles/image_gallery/public/school/gallery/school/Philippines/Paradise-English-Language-Institute-School-Gallery-990-7.jpg?itok=CaI2joiu',
      title: '小组课 + 一对一组合',
      text: '从Budget到Intensive，课程按小组课和一对一比例分层，成人短期和长期都能选择。',
    },
    {
      image: 'https://storage.googleapis.com/world-study-prod/media/school_photo/858/b912f7b4-a73b-4192-8e96-835e410987a5.jpg',
      title: '住宿选择比一般学校更灵活',
      text: '可比较Dorm Stay、Home Stay、Annex Hotel和4 Star Resort，适合个人、朋友同行或想体验寄宿家庭的人。',
    },
  ];

  readonly suitableFor: FitItem[] = [
    {
      title: '想在长滩岛练口语和体验国际氛围',
      text: '学校强调学生来自多国，适合想在课堂和生活中更多使用英语的成人学生。',
    },
    {
      title: '成人短期、数字游民或半天学习',
      text: 'Budget Program可选择上午或下午上课，更适合想保留海岛生活和远程工作时间的人。',
    },
    {
      title: 'True Beginner或需要更多一对一',
      text: 'True Beginner每天2节小组 + 3节一对一，适合基础弱、希望更密集纠音和建立表达的人。',
    },
    {
      title: '想比较宿舍、寄宿家庭和酒店住宿',
      text: '住宿页直接列多种住宿价格与包含项目，适合先把预算拆清楚。',
    },
  ];

  readonly notSuitableFor: FitItem[] = [
    {
      title: '想要封闭式斯巴达备考',
      text: 'Paradise English更偏多国籍口语、短期和海岛体验，不是碧瑶高压考试型学校。',
    },
    {
      title: '需要学校套餐含全部餐食',
      text: '多数住宿不默认含三餐，Lunch、酒店餐食和度假村餐食可能需要另付。',
    },
    {
      title: '只按最低价选择学校',
      text: '长滩岛生活和住宿选择会拉开总费用，最低预算也应比较伊洛伊洛、巴科洛德或碧瑶。',
    },
  ];

  readonly courseOptions: CourseOption[] = [
    {
      id: 'budget',
      name: 'Budget Study Program',
      type: '轻量ESL',
      lessons: '每日2节Group + 1节1:1；每周15节',
      suitable: '适合想半天学习、半天海岛生活或远程工作的人。',
      prices: {
        standard: { priceByWeek: { 1: 295, 2: 565, 3: 820, 4: 985 }, additionalWeek: 245 },
        promo: { priceByWeek: { 1: 266, 2: 452, 3: 574, 4: 591 }, additionalWeek: 150 },
      },
      note: '官网课程页写明可选上午或下午学习。',
    },
    {
      id: 'general',
      name: 'General Study Program',
      type: '标准ESL',
      lessons: '每日4节Group + 1节1:1；每周25节',
      suitable: '适合多数成人口语、听说读写综合提升。',
      prices: {
        standard: { priceByWeek: { 1: 395, 2: 770, 3: 1095, 4: 1335 }, additionalWeek: 335 },
        promo: { priceByWeek: { 1: 355, 2: 616, 3: 767, 4: 801 }, additionalWeek: 205 },
      },
      note: '官网课程页写明每天5节课，含4节小组和1节一对一。',
    },
    {
      id: 'intensive',
      name: 'Intensive Study Program',
      type: '强化ESL',
      lessons: '每日5节Group + 2节1:1；每周35节',
      suitable: '适合想在较短时间内增加学习密度的人。',
      prices: {
        standard: { priceByWeek: { 1: 505, 2: 975, 3: 1395, 4: 1695 }, additionalWeek: 420 },
        promo: { priceByWeek: { 1: 455, 2: 780, 3: 977, 4: 1017 }, additionalWeek: 255 },
      },
      note: '官网写明该课程常见于就业或学术目的学生。',
    },
    {
      id: 'true-beginner',
      name: "True Beginner's Study Program",
      type: '零基础强化',
      lessons: '每日2节Group + 3节1:1；每周25节',
      suitable: '适合英语基础很弱、需要更多一对一建立表达的人。',
      prices: {
        standard: { priceByWeek: { 1: 490, 2: 920, 3: 1315, 4: 1595 }, additionalWeek: 395 },
        promo: { priceByWeek: { 1: 441, 2: 736, 3: 921, 4: 957 }, additionalWeek: 245 },
      },
      note: '官网课程页强调基础词汇、表达、语法、口语、阅读和写作。',
    },
    {
      id: 'ielts-toeic-business',
      name: 'IELTS / TOEIC / Business Program',
      type: '考试与商务',
      lessons: '每日2节Group + 2节1:1；每周20节',
      suitable: '适合Business、FCE、CAE、TOEIC、IELTS和TOEFL方向。',
      prices: {
        standard: { priceByWeek: { 1: 395, 2: 765, 3: 1090, 4: 1325 }, additionalWeek: 330 },
        promo: { priceByWeek: { 1: 356, 2: 612, 3: 763, 4: 795 }, additionalWeek: 199 },
      },
      note: '官网说明一对一会按目的主题安排。',
    },
  ];

  readonly roomOptions: RoomOption[] = [
    {
      id: 'shared-standard-dorm',
      name: 'Shared Standard Room',
      shortName: '宿舍标准合住房',
      category: 'Dorm Stay',
      inclusion: '空调、独立卫浴、公共厨房；午餐另购',
      prices: {
        standard: { priceByWeek: { 1: 185, 2: 345, 3: 485, 4: 585 }, additionalWeek: 150 },
        promo: { priceByWeek: { 1: 167, 2: 276, 3: 340, 4: 351 }, additionalWeek: 90 },
      },
      note: '官网住宿页低价房型，距离学校约3分钟步行。',
    },
    {
      id: 'single-standard-dorm',
      name: 'Single Standard Room',
      shortName: '宿舍标准单人房',
      category: 'Dorm Stay',
      inclusion: '空调、独立卫浴、公共厨房；午餐另购',
      prices: {
        standard: { priceByWeek: { 1: 295, 2: 570, 3: 795, 4: 955 }, additionalWeek: 250 },
        promo: { priceByWeek: { 1: 266, 2: 456, 3: 557, 4: 573 }, additionalWeek: 150 },
      },
      note: '适合重视隐私的成人学生。',
    },
    {
      id: 'deluxe-dorm',
      name: 'Deluxe Room',
      shortName: '宿舍Deluxe房',
      category: 'Dorm Stay',
      inclusion: '最多2人，含冰箱；午餐另购',
      prices: {
        standard: { priceByWeek: { 1: 395, 2: 745, 3: 1050, 4: 1285 }, additionalWeek: 315 },
        promo: { priceByWeek: { 1: 356, 2: 596, 3: 735, 4: 771 }, additionalWeek: 193 },
      },
      note: '官网写明Deluxe rooms have own refrigerator。',
    },
    {
      id: 'homestay-shared',
      name: 'Home Stay Shared Room',
      shortName: '寄宿家庭合住房',
      category: 'Home Stay',
      inclusion: '每日早餐、平日午餐和晚餐、每日清洁',
      prices: {
        standard: { priceByWeek: { 1: 285, 2: 535, 3: 760, 4: 895 }, additionalWeek: 240 },
        promo: { priceByWeek: { 1: 285, 2: 535, 3: 760, 4: 895 }, additionalWeek: 240 },
      },
      note: '寄宿家庭距离学校最多约20分钟车程。',
    },
    {
      id: 'homestay-single',
      name: 'Home Stay Single Room',
      shortName: '寄宿家庭单人房',
      category: 'Home Stay',
      inclusion: '每日早餐、平日午餐和晚餐、每日清洁',
      prices: {
        standard: { priceByWeek: { 1: 330, 2: 635, 3: 885, 4: 1050 }, additionalWeek: 275 },
        promo: { priceByWeek: { 1: 330, 2: 635, 3: 885, 4: 1050 }, additionalWeek: 275 },
      },
      note: '适合想要英文寄宿家庭和更多生活互动的学生。',
    },
    {
      id: 'annex-hotel',
      name: 'Paradise English Annex Hotel',
      shortName: 'Annex Hotel',
      category: 'Hotel',
      inclusion: '每日清洁、泳池、冰箱；餐食自费',
      prices: {
        standard: { priceByWeek: { 1: 295, 2: 495, 3: 650, 4: 850 }, additionalWeek: 295 },
        promo: { priceByWeek: { 1: 295, 2: 495, 3: 650, 4: 850 }, additionalWeek: 295 },
      },
      note: '官网写明步行到学校约1分钟，价格为starting rates。',
    },
  ];

  readonly localFees: LocalFee[] = [
    { item: 'Registration Fee', amount: 'USD 130', note: '一次性注册费；报价器已计入。' },
    { item: 'Special Study Permit', amount: 'USD 200', note: '官网价格页列Required；FAQ说明所有菲律宾学生都需办理SSP。' },
    { item: 'Textbooks', amount: 'USD 16 / 本', note: '按课程和实际教材数量计算。' },
    { item: 'Airport Pickup', amount: 'USD 24 / 单程', note: '官网英文价格页列one-way；往返需另算。' },
    { item: 'Lunch', amount: 'USD 50 / 1周平日5次', note: '一个月平日午餐参考USD185。' },
    { item: 'Visa Extension', amount: '约USD 85起', note: 'FAQ写明首次延签约USD85，后续按停留时间办理。' },
    { item: 'Additional Group Class', amount: 'USD 40 / 周起', note: '5节小组课官网优惠价USD40；20节月度优惠价USD119。' },
    { item: 'Additional 1:1 Class', amount: 'USD 59 / 周起', note: '5节一对一官网优惠价USD59；20节月度优惠价USD198。' },
    { item: 'Deposit', amount: '20% non-refundable', note: '官网课程和住宿页均说明至少开课前4周需20%不可退订金。' },
  ];

  readonly serviceSteps: ProcessStep[] = [
    { icon: 'beach_access', title: '确认长滩岛目的', text: '先判断学生要短期口语、轻松学习、数字游民，还是亲子/青少年营队。' },
    { icon: 'menu_book', title: '匹配课程密度', text: '按Budget、General、Intensive、True Beginner或IELTS/TOEIC/Business确认课时。' },
    { icon: 'hotel', title: '选择住宿', text: '比较Dorm Stay、Home Stay、Annex Hotel和度假村，尤其确认是否含餐。' },
    { icon: 'payments', title: '拆清促销价和原价', text: '把课程费、住宿费、注册费、SSP、教材、午餐和签证分开预算。' },
    { icon: 'flight_land', title: '安排到校', text: '确认Caticlan或Kalibo路线、接机需求、入住日期和押金规则。' },
    { icon: 'support_agent', title: '入学后支持', text: '课程调整、住宿沟通、签证/SSP和当地生活问题，都可以继续联系顾问。' },
  ];

  readonly trustBadges = [
    { icon: 'verified_user', label: '官网2026价格整理' },
    { icon: 'groups', label: '多国籍学习环境' },
    { icon: 'hotel', label: '住宿与餐食拆分核对' },
    { icon: 'apartment', label: '深圳总部 + 菲律宾支持' },
  ];

  readonly schoolServices = [
    'Budget ESL',
    'General ESL',
    'Intensive ESL',
    'True Beginner',
    'IELTS',
    'TOEIC',
    'Business',
    'Junior Camp',
    'Bildungsurlaub',
    '一对一课程',
    '小组课',
    'Dorm Stay',
    'Home Stay',
    'Annex Hotel',
    'Airport Pickup',
    'Lunch Option',
  ];
  readonly campusActivities = ['多国籍交流', '小组讨论', '一对一辅导', '文化活动', '课堂外练习', '岛上社群'];
  readonly weekendActivities = ['White Beach', 'Station 1/2/3', '跳岛', '水上活动', '日落', '咖啡厅'];
  readonly notes = [
    '本页按Paradise English官网2026课程价格页、Accommodation页、Courses页、About页、FAQ和Contact页整理。',
    '官网显示课程和Dorm Stay住宿有优惠价；促销、旺季和空位可能变动，正式报价以学校invoice为准。',
    '报价器估算课程费、住宿费和注册费；SSP、教材、午餐、签证延长、机票保险和个人生活费另算。',
    '寄宿家庭、Annex Hotel和4 Star Resort住宿页面没有显示同样的优惠价，本页按官网列价估算。',
    '学校课程页提到Junior Camp，但青少年营队有独立价格和押金规则，亲子/低龄学生需单独核价。',
  ];

  readonly faqs: FaqItem[] = [
    {
      question: 'Paradise English适合什么学生？',
      answer:
        '适合想在长滩岛轻松环境中学习英语的成人、短期体验学生、数字游民、True Beginner学生，以及想要多国籍课堂和一对一组合课程的人。',
    },
    {
      question: '页面费用包含全部费用吗？',
      answer:
        '不包含全部。报价器估算课程费、住宿费和注册费；SSP、教材、午餐、机场接送、签证延长、机票保险和个人消费需要另算。',
    },
    {
      question: 'Paradise English和Boracay Coco怎么选？',
      answer:
        'Paradise English更偏加拿大背景、多国籍成人口语和灵活住宿；Boracay Coco更偏度假型校园、亲子和低龄课程。可以按学生年龄、同行人数、是否需要家庭房和课程密度来比较。',
    },
    {
      question: 'Paradise English适合考试课程吗？',
      answer:
        '官网列IELTS/TOEIC/Business Program，每周20节课，含2节小组和2节一对一。若目标是高压冲分，也建议同步比较碧瑶考试型学校。',
    },
  ];

  readonly sideNav: SideNavItem[] = [
    { label: '学校环境', target: 'gallery', icon: 'image' },
    { label: '课程费用', target: 'course-fees', icon: 'menu_book' },
    { label: '住宿费用', target: 'room-fees', icon: 'hotel' },
    { label: '费用试算', target: 'quote', icon: 'calculate' },
    { label: '当地费用', target: 'local-fees', icon: 'payments' },
    { label: '常见问题', target: 'faq', icon: 'help' },
  ];
  readonly mobileAnchors: SideNavItem[] = [
    { label: '概览', target: 'top', icon: 'dashboard' },
    { label: '环境', target: 'gallery', icon: 'image' },
    { label: '课程', target: 'course-fees', icon: 'menu_book' },
    { label: '住宿', target: 'room-fees', icon: 'hotel' },
    { label: '费用', target: 'quote', icon: 'calculate' },
    { label: 'FAQ', target: 'faq', icon: 'help' },
  ];

  readonly sources: SourceLink[] = [
    { label: 'Paradise English官方首页', url: 'https://paradiseenglish.com/' },
    { label: '官方2026 Course Pricing', url: 'https://paradiseenglish.com/course-pricing-2026/' },
    { label: '官方Accommodation', url: 'https://paradiseenglish.com/accommodation/' },
    { label: '官方Courses', url: 'https://paradiseenglish.com/courses/' },
    { label: '官方About Us', url: 'https://paradiseenglish.com/about-us/' },
    { label: '官方FAQ', url: 'https://paradiseenglish.com/faq/' },
    { label: '官方Contact Us', url: 'https://paradiseenglish.com/contact-us/' },
  ];

  setGalleryCategory(category: GalleryCategory): void {
    this.selectedGalleryCategory = category;
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

    window.scrollTo({ top: Math.max(targetTop, 0), behavior: 'smooth' });
    window.history.replaceState(
      null,
      '',
      `${window.location.pathname}${window.location.search}#${target}`,
    );
  }

  priceFor(plan: PricePlan, weeks: WeekOption): number {
    if (weeks <= 4) {
      return plan.priceByWeek[weeks as BaseWeek];
    }

    return plan.priceByWeek[4] + plan.additionalWeek * (weeks - 4);
  }

  coursePrice(course: CourseOption, weeks: WeekOption = 4): number {
    return this.priceFor(course.prices[this.selectedPricingMode], weeks);
  }

  roomPrice(room: RoomOption, weeks: WeekOption = 4): number {
    return this.priceFor(room.prices[this.selectedPricingMode], weeks);
  }

  get filteredGalleryImages(): GalleryImage[] {
    return this.selectedGalleryCategory === '全部'
      ? this.galleryImages
      : this.galleryImages.filter(
          (image) => image.category === this.selectedGalleryCategory,
        );
  }

  get selectedMode() {
    return (
      this.pricingModes.find((mode) => mode.id === this.selectedPricingMode) ??
      this.pricingModes[0]
    );
  }

  get selectedCourse(): CourseOption {
    return (
      this.courseOptions.find((course) => course.id === this.selectedCourseId) ??
      this.courseOptions[0]
    );
  }

  get selectedRoom(): RoomOption {
    return (
      this.roomOptions.find((room) => room.id === this.selectedRoomId) ??
      this.roomOptions[0]
    );
  }

  get selectedCoursePrice(): number {
    return this.coursePrice(this.selectedCourse, this.selectedWeeks);
  }

  get selectedRoomPrice(): number {
    return this.roomPrice(this.selectedRoom, this.selectedWeeks);
  }

  get quoteUsd(): number {
    return this.registrationFee + this.selectedCoursePrice + this.selectedRoomPrice;
  }

  get quoteUsdText(): string {
    return `USD ${this.formatUsd(this.quoteUsd)} 起`;
  }

  get quoteCnyText(): string {
    const rounded = Math.round((this.quoteUsd * this.usdToCny) / 100) * 100;

    return `约 ${rounded.toLocaleString('zh-CN')} 元起`;
  }

  formatUsd(amount: number): string {
    return amount.toLocaleString('en-US');
  }
}

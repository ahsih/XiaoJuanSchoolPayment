import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

type GalleryCategory = '全部' | '校园' | '教室' | '住宿' | '餐饮' | '费用';
type SeasonId = 'low' | 'regular';
type WeekOption = 4 | 8 | 12 | 16 | 20 | 24;

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

interface SeasonOption {
  id: SeasonId;
  label: string;
  note: string;
}

interface CourseOption {
  id: string;
  name: string;
  type: string;
  lessons: string;
  age: string;
  suitable: string;
  tuition: Record<SeasonId, number>;
  note: string;
}

interface RoomOption {
  id: string;
  name: string;
  shortName: string;
  category: string;
  occupancy: string;
  rates: Record<SeasonId, number>;
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
  selector: 'app-boracay-coco-school',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './boracay-coco-school.component.html',
  styleUrls: [
    '../cebu-school-detail-layout.css',
    '../cebu-school-detail-content.css',
    '../cebu-school-detail-responsive.css',
    '../ev-school/ev-school-detail.component.css',
    './boracay-coco-school.component.css',
  ],
})
export class BoracayCocoSchoolComponent {
  readonly galleryCategories: GalleryCategory[] = [
    '全部',
    '校园',
    '教室',
    '住宿',
    '餐饮',
    '费用',
  ];
  readonly weekOptions: WeekOption[] = [4, 8, 12, 16, 20, 24];
  readonly registrationFee = 100;
  readonly usdToCny = 7.2;

  selectedGalleryCategory: GalleryCategory = '全部';
  selectedSeasonId: SeasonId = 'low';
  selectedCourseId = 'general-esl';
  selectedRoomId = 'dorm-deluxe-twin';
  selectedWeeks: WeekOption = 4;
  selectedStartDate = '2026-09-07';
  quoteCalculated = false;

  readonly seasons: SeasonOption[] = [
    {
      id: 'low',
      label: '2026 Low Season',
      note: '官网2026价格表写明低季促销适用于2026-03-01至06-27，以及2026-08-23至2027-01-02。',
    },
    {
      id: 'regular',
      label: 'Regular / High Season',
      note: '其他日期按官网Regular Price口径粗估，正式费用以学校invoice确认。',
    },
  ];

  readonly quickInfo: QuickInfo[] = [
    {
      icon: 'location_on',
      label: '位置',
      value: 'Boracay / Manoc-Manoc',
      note: '官网页脚列地址为Bantud, Manoc-Manoc, Boracay, Malay, Aklan 5608。',
    },
    {
      icon: 'beach_access',
      label: '学校定位',
      value: 'Resort-style campus',
      note: '官网强调在长滩岛度假型校园学习，适合把课程和海岛生活结合。',
    },
    {
      icon: 'menu_book',
      label: '课程',
      value: 'ESL / IELTS / Junior / Kinder',
      note: '官网课程页列General、Power、Intensive、Super Intensive、IELTS、Lite和儿童课程。',
    },
    {
      icon: 'verified',
      label: '认证',
      value: 'TESDA / BI / IDP partner',
      note: '官网About页写明学校受TESDA和移民局认证，并为IDP IELTS合作伙伴。',
    },
    {
      icon: 'hotel',
      label: '住宿',
      value: '校内宿舍 / 校外宿舍 / 酒店 / 度假村',
      note: '官网2026住宿表按Dormitory、Off-campus Dormitory、Partner Hotel和Partner Resort列价。',
    },
    {
      icon: 'payments',
      label: '4周参考',
      value: 'USD 1,300起含注册费',
      note: '低季Lite ESL + 校内Deluxe Twin四周USD525 + USD675 + 注册费USD100。',
    },
  ];

  readonly galleryImages: GalleryImage[] = [
    {
      category: '校园',
      title: 'Boracay Coco English Academy校园',
      description:
        '度假型校园、泳池和白色建筑是这所学校的第一印象，适合想要海岛环境的学生。',
      src: 'https://www.iss-ryugakulife.com/wp-content/uploads/school/Boracay-4.jpg',
    },
    {
      category: '校园',
      title: '长滩岛度假型校园',
      description:
        '校园以泳池、花园和热带景观为主，比传统市区校区更接近度假学习体验。',
      src: 'https://www.fujiyama-international.com/archives/004/202403/664ae5b29724da127bc48367f0943cca.jpg',
    },
    {
      category: '教室',
      title: '小组教室参考',
      description:
        '课程以一对一和小组课组合为核心，成人ESL与儿童课程课时比例不同。',
      src: 'https://media.loveitopcdn.com/39882/classroom.jpg',
    },
    {
      category: '住宿',
      title: '家庭房参考',
      description:
        '官网住宿页列校内宿舍单人、双人、家庭房，并说明房内设施和清洁安排。',
      src: 'https://www.fujiyama-international.com/archives/004/202504/0ca9df0150ddc1d895b20790339c39f4389b778d6704dad57fa7e7369614e18b.jpg',
    },
    {
      category: '费用',
      title: '2026低季课程费用',
      description:
        '官网公开低季课程费，成人ESL、IELTS和儿童课程按4周USD列示。',
      src: 'https://boracayenglish.com/wp-content/uploads/2026/05/Low-Season-Tuition.png',
    },
    {
      category: '费用',
      title: '2026当地费用',
      description:
        'SSP、SSP E-Card、水电服务费、接送、押金、教材和签证延长需到校另付。',
      src: 'https://boracayenglish.com/wp-content/uploads/2026/05/Local-Fees.png',
    },
  ];

  readonly basicInfo: BasicInfoRow[] = [
    { label: '学校名称', value: '菲律宾长滩岛Boracay Coco English Academy' },
    { label: '英文名称', value: 'Boracay Coco English Academy' },
    { label: '地址', value: 'Bantud, Manoc-Manoc, Boracay, Malay, Aklan 5608, Philippines' },
    { label: '成立时间', value: '官网About页写明Established in 2018' },
    { label: '学校类型', value: '长滩岛度假型英语学校，主打学习 + 住宿 + 海岛生活' },
    { label: '主要课程', value: 'General ESL、Power ESL、Intensive ESL、Super Intensive ESL、IELTS、Lite ESL、Junior、Kinder、Nursery' },
    { label: '认证与合作', value: 'TESDA、Bureau of Immigration认证；IDP IELTS合作伙伴' },
    { label: '住宿选择', value: '校内宿舍、校外宿舍、Partner Hotel、Partner Resort' },
    { label: '餐食', value: '官网住宿表写明平日三餐，周末brunch' },
    { label: '本页费用口径', value: '按官网2026课程、住宿和当地费用表整理，正式以学校invoice为准' },
  ];

  readonly highlights: Highlight[] = [
    {
      image: 'https://www.fujiyama-international.com/archives/004/202403/664ae5b29724da127bc48367f0943cca.jpg',
      title: '长滩岛度假型校园',
      text: '官网把学校定位为resort-style campus，适合想把英语课程、泳池、海滩和家庭假期组合起来的学生。',
    },
    {
      image: 'https://media.loveitopcdn.com/39882/classroom.jpg',
      title: '成人ESL到儿童课程',
      text: '课程从General ESL、Power ESL到Junior、Kinder、Nursery，适合成人短期、亲子和低龄体验路线。',
    },
    {
      image: 'https://boracayenglish.com/wp-content/uploads/2026/06/Low-Season-Accommodation.png',
      title: '2026费用表清楚',
      text: '官网公开低季和Regular价格，可拆分课程费、住宿费、注册费与到校PHP费用。',
    },
  ];

  readonly suitableFor: FitItem[] = [
    {
      title: '想要海岛环境和轻松口语',
      text: '长滩岛比碧瑶、伊洛伊洛更有度假感，适合想把英语学习和生活体验结合的学生。',
    },
    {
      title: '亲子、低龄或假期短期',
      text: '官网列Junior、Kinder、Nursery课程，且住宿表有家庭房口径，适合家庭先放入候选。',
    },
    {
      title: '成人短期ESL或雅思入门',
      text: 'General、Power、Intensive和IELTS课程都按每周一开课、1-24周课程周期说明。',
    },
    {
      title: '想提前拆清预算',
      text: '课程费、住宿费、注册费和当地费用在官网2026表中分开列示，适合先做预算试算。',
    },
  ];

  readonly notSuitableFor: FitItem[] = [
    {
      title: '想要高压斯巴达备考',
      text: 'Boracay Coco更偏度假型和综合口语，不是碧瑶那种高压封闭式备考学校。',
    },
    {
      title: '只想找最低总预算',
      text: '长滩岛住宿和旅游属性更强，若只看低成本长期学习，也应比较巴科洛德、伊洛伊洛或碧瑶。',
    },
    {
      title: '不想住学校指定住宿',
      text: '官网报名页写明学校政策只接受study-and-stay学生，需住指定住宿。',
    },
  ];

  readonly courseOptions: CourseOption[] = [
    {
      id: 'general-esl',
      name: 'General ESL',
      type: '标准口语ESL',
      lessons: '1:1四节 + 小组两节 + 自习/晚间/课后活动参考',
      age: '15岁以上',
      suitable: '适合第一次游学、日常口语和综合基础。',
      tuition: { low: 600, regular: 800 },
      note: '官网课程页列一对一4次、小组2次；2026低季4周USD600。',
    },
    {
      id: 'power-esl',
      name: 'Power ESL',
      type: '一对一强化',
      lessons: '1:1五节 + 自习/晚间/课后活动参考',
      age: '15岁以上',
      suitable: '适合想提高一对一比例、快速练开口的人。',
      tuition: { low: 645, regular: 860 },
      note: '2026价格表低季4周USD645，Regular USD860。',
    },
    {
      id: 'intensive-esl',
      name: 'Intensive ESL',
      type: '密集ESL',
      lessons: '1:1五节 + 小组两节 + 自习/晚间/课后活动参考',
      age: '15岁以上',
      suitable: '适合想同时保留小组互动和高一对一密度的成人学生。',
      tuition: { low: 675, regular: 900 },
      note: '课程页说明以口语、发音、语法、讨论、演讲和写作为核心。',
    },
    {
      id: 'super-intensive-esl',
      name: 'Super Intensive ESL',
      type: '最高密度ESL',
      lessons: '1:1六节 + 小组两节 + 自习/晚间/课后活动参考',
      age: '15岁以上',
      suitable: '适合短期内想最大化课时密度的人。',
      tuition: { low: 750, regular: 1000 },
      note: '2026价格表低季4周USD750，Regular USD1,000。',
    },
    {
      id: 'ielts',
      name: 'IELTS Course',
      type: '雅思准备',
      lessons: '1:1四节 + 小组三节 + 自习/晚间/课后活动参考',
      age: '15岁以上',
      suitable: '适合IELTS 3.0-6.0或同等水平，想在海岛环境中备考。',
      tuition: { low: 750, regular: 1000 },
      note: '官网课程页列IELTS入学水平为3.0-6.0或相近英语水平。',
    },
    {
      id: 'lite-esl',
      name: 'Lite ESL',
      type: '轻量ESL',
      lessons: '1:1三节 + 晚间/课后活动参考',
      age: '20岁以上',
      suitable: '适合家长陪读、成人轻松口语和希望留更多自由时间的人。',
      tuition: { low: 525, regular: 700 },
      note: '官网课程页写明Lite ESL适合陪读家长或想兼顾户外活动的学生。',
    },
    {
      id: 'junior',
      name: 'Junior Course',
      type: '青少年英语',
      lessons: '1:1三节 + 小组三节 + 活动两节 + 课后活动参考',
      age: '7-14岁',
      suitable: '适合青少年英语、假期体验和亲子路线。',
      tuition: { low: 1035, regular: 1380 },
      note: '官网课程页说明通过小组课和活动课帮助孩子自然使用英语。',
    },
    {
      id: 'kinder',
      name: 'Kinder Course',
      type: '儿童英语',
      lessons: '1:1两节 + 活动五节 + 课后活动参考',
      age: '5-6岁参考',
      suitable: '适合低龄儿童启蒙，年龄口径需按生日和学校确认。',
      tuition: { low: 900, regular: 1200 },
      note: '2026价格表按Age 5-6列示；课程页年龄说明可能因语言版本不同，报名前需确认。',
    },
    {
      id: 'nursery',
      name: 'Nursery Course',
      type: '幼儿启蒙',
      lessons: '1:1两节 + 活动五节 + 课后活动参考',
      age: '3-4岁',
      suitable: '适合幼儿英语启蒙和亲子陪读家庭。',
      tuition: { low: 900, regular: 1200 },
      note: '官网说明以游戏式学习帮助低龄孩子建立英语熟悉度和自信。',
    },
  ];

  readonly roomOptions: RoomOption[] = [
    {
      id: 'dorm-deluxe-twin',
      name: 'Dormitory Deluxe Shared Twin',
      shortName: '校内Deluxe双人',
      category: '校内宿舍',
      occupancy: '个人学生 / 家庭2人',
      rates: { low: 675, regular: 900 },
      note: '适合个人学生合住或两人家庭，价格按每人4周。',
    },
    {
      id: 'dorm-deluxe-single',
      name: 'Dormitory Deluxe Single',
      shortName: '校内Deluxe单人',
      category: '校内宿舍',
      occupancy: '个人学生',
      rates: { low: 975, regular: 1300 },
      note: '适合成人重视隐私；水电按单人房当地费口径更高。',
    },
    {
      id: 'dorm-deluxe-family3',
      name: 'Dormitory Deluxe Family of 3',
      shortName: '校内Deluxe家庭3人',
      category: '校内宿舍',
      occupancy: '家庭3人',
      rates: { low: 570, regular: 760 },
      note: '适合三人家庭，按每人4周列价。',
    },
    {
      id: 'dorm-premier-family4',
      name: 'Dormitory Premier Family of 4',
      shortName: '校内Premier家庭4人',
      category: '校内宿舍',
      occupancy: '家庭4人',
      rates: { low: 600, regular: 800 },
      note: '官网注明Premier房比Deluxe约大50%，适合家庭。',
    },
    {
      id: 'dorm-premier-family5',
      name: 'Dormitory Premier Family of 5',
      shortName: '校内Premier家庭5人',
      category: '校内宿舍',
      occupancy: '家庭5人',
      rates: { low: 525, regular: 700 },
      note: '适合五人家庭按每人4周试算，空房需单独确认。',
    },
    {
      id: 'off-campus-single',
      name: 'Off-campus Dormitory Single',
      shortName: '校外宿舍单人',
      category: '校外宿舍',
      occupancy: '个人学生',
      rates: { low: 1200, regular: 1200 },
      note: '官网住宿表列校外宿舍价格不分低季/Regular。',
    },
    {
      id: 'partner-hotel-family4',
      name: 'Partner Hotel Family of 4',
      shortName: '合作酒店家庭4人',
      category: 'Partner Hotel',
      occupancy: '家庭4人',
      rates: { low: 800, regular: 800 },
      note: '适合更重视酒店住宿的家庭，最终以学校合作库存为准。',
    },
  ];

  readonly localFees: LocalFee[] = [
    { item: 'Registration fee', amount: 'USD 100', note: '一次性注册费；报价器已计入。' },
    { item: 'SSP', amount: 'PHP 7,800', note: 'Special Study Permit，到校支付。' },
    { item: 'SSP E-Card', amount: 'PHP 4,500', note: '菲律宾移民局签发，适用于在菲律宾学习的学生。' },
    { item: 'Service Fee', amount: 'PHP 800 / 周', note: '官网说明含一般水电、维护、房间清洁和Wi-Fi。' },
    { item: 'Electricity & Water Bill', amount: 'PHP 1,200 / 周单人房；PHP 800 / 周其他房', note: '超额用电另收PHP20/kwh。' },
    { item: 'Airport Pick-up', amount: 'PHP 1,200', note: 'Kalibo或Caticlan机场到学校接机。' },
    { item: 'Airport Drop-off', amount: 'PHP 1,000', note: '学校到Kalibo或Caticlan机场送机。' },
    { item: 'Deposit', amount: 'PHP 3,000', note: '退房无损坏时按学校规则退还。' },
    { item: 'Textbooks', amount: 'PHP 300-500 / 本', note: '官网估算4周约PHP1,000-2,500。' },
    { item: 'Student ID Card', amount: 'PHP 200', note: '学生证费用。' },
    { item: 'Laundry', amount: 'PHP 350 / 次', note: '每次最多8kg。' },
    { item: 'Visa Extension', amount: 'PHP 5,100 / 8周起', note: '12周PHP11,500；16周PHP15,900；20周PHP20,300；24周PHP24,700。' },
    { item: 'Additional 1:1 Class', amount: 'PHP 1,500 / 周', note: '每周5次，至少2周。' },
    { item: 'Additional Stay', amount: 'PHP 1,250-2,500 / 晚', note: '含宿舍餐食，按房型和空位确认。' },
    { item: 'Baby Sitter Service', amount: 'PHP 1,500 / 天', note: '0-3岁儿童，至少每周5天、每天8小时。' },
  ];

  readonly serviceSteps: ProcessStep[] = [
    { icon: 'beach_access', title: '确认长滩岛是否适合', text: '先判断学生是否想要海岛度假型环境，而不是斯巴达备考城市。' },
    { icon: 'menu_book', title: '匹配课程强度', text: '按General、Power、Intensive、IELTS或Junior/Kinder/Nursery确定课时比例。' },
    { icon: 'hotel', title: '核对住宿类型', text: '根据个人、朋友同行或家庭人数，确认校内/校外宿舍、酒店或度假村空位。' },
    { icon: 'payments', title: '拆分低季与Regular价格', text: '把课程费、住宿费、注册费和PHP当地费用拆开，避免只看单项学费。' },
    { icon: 'flight_land', title: '安排接送和到校资料', text: '确认Kalibo或Caticlan机场、周日入住、周六退房和到校付款清单。' },
    { icon: 'support_agent', title: '入学后继续协助', text: '课程调整、住宿沟通、当地费用或亲子安排，都可以继续找顾问协助。' },
  ];

  readonly trustBadges = [
    { icon: 'verified_user', label: '官网2026费用整理' },
    { icon: 'family_restroom', label: '亲子房型一起核对' },
    { icon: 'beach_access', label: '长滩岛行程提醒' },
    { icon: 'apartment', label: '深圳总部 + 菲律宾支持' },
  ];

  readonly schoolServices = [
    '一对一课程',
    '小组课',
    '自习参考',
    '晚间免费小组课',
    '课后活动',
    'General ESL',
    'Power ESL',
    'Intensive ESL',
    'IELTS',
    'Lite ESL',
    'Junior',
    'Kinder',
    'Nursery',
    '校内住宿',
    '合作酒店',
    '平日三餐',
  ];
  readonly campusActivities = ['泳池', '花园', '健身房', '海滩', '英语活动', '周边探索'];
  readonly weekendActivities = ['White Beach', 'Angol Beach', '跳岛', '水上活动', '咖啡厅', '日落沙滩'];
  readonly notes = [
    '本页按Boracay Coco English Academy官网2026价格图、课程页、About页和住宿页整理，正式报名仍以学校invoice为准。',
    '报价器只按同一季节的4周倍数做粗估；如果学习跨越低季和Regular日期，需要顾问按实际周数重新拆分。',
    '官网报名页写明只接受study-and-stay学生，住宿需从学校指定住宿中选择。',
    '低龄课程涉及生日、监护、保姆服务、家庭房和接送安排，报名前要逐项确认。',
    'SSP、SSP E-Card、服务费、水电、押金、教材、洗衣、签证延长和个人生活费不包含在课程住宿主费中。',
  ];

  readonly faqs: FaqItem[] = [
    {
      question: '菲律宾长滩岛Boracay Coco English Academy适合什么学生？',
      answer:
        '适合想在长滩岛度假型环境中学习英语的成人、亲子家庭、青少年和低龄学生。它更偏轻松口语、短期体验和家庭游学，不是高压斯巴达备考型学校。',
    },
    {
      question: '页面费用包含全部费用吗？',
      answer:
        '不包含全部。报价器估算课程费、住宿费和注册费；SSP、SSP E-Card、服务费、水电、押金、教材、洗衣、签证延长、接送和生活费需另算。',
    },
    {
      question: '低季价格适用于哪些日期？',
      answer:
        '官网2026低季促销表写明适用于2026年3月1日至6月27日，以及2026年8月23日至2027年1月2日。其他日期按Regular Price确认。',
    },
    {
      question: 'Boracay Coco适合雅思吗？',
      answer:
        '可以作为雅思入门或综合提升候选。官网课程页列IELTS Course，适合IELTS 3.0-6.0或相近水平；如果目标是高压冲分，也建议同步比较碧瑶学校。',
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
    { label: 'Boracay Coco English Academy官网首页', url: 'https://boracayenglish.com/' },
    { label: '官方2026价格页', url: 'https://boracayenglish.com/zh/2026-pricing-tw/' },
    { label: '官方课程页', url: 'https://boracayenglish.com/courses/' },
    { label: '官方About / Profile页', url: 'https://boracayenglish.com/profile/' },
    { label: '官方Campus图库', url: 'https://boracayenglish.com/campus/' },
    { label: '官方Dormitory图库', url: 'https://boracayenglish.com/dormitory/' },
    { label: '官方报名页', url: 'https://boracayenglish.com/online-inquiry/' },
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

  tuitionFor(course: CourseOption, weeks: WeekOption = 4): number {
    return course.tuition[this.selectedSeasonId] * (weeks / 4);
  }

  accommodationFor(room: RoomOption, weeks: WeekOption = 4): number {
    return room.rates[this.selectedSeasonId] * (weeks / 4);
  }

  get filteredGalleryImages(): GalleryImage[] {
    return this.selectedGalleryCategory === '全部'
      ? this.galleryImages
      : this.galleryImages.filter(
          (image) => image.category === this.selectedGalleryCategory,
        );
  }

  get selectedSeason(): SeasonOption {
    return (
      this.seasons.find((season) => season.id === this.selectedSeasonId) ??
      this.seasons[0]
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

  get selectedTuition(): number {
    return this.tuitionFor(this.selectedCourse, this.selectedWeeks);
  }

  get selectedAccommodation(): number {
    return this.accommodationFor(this.selectedRoom, this.selectedWeeks);
  }

  get quoteUsd(): number {
    return this.registrationFee + this.selectedTuition + this.selectedAccommodation;
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

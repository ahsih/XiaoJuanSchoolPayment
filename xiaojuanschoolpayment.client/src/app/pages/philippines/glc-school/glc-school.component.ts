import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

type GalleryCategory = '全部' | '校园' | '教室' | '住宿' | '餐厅' | '设施';
type WeekOption = 1 | 2 | 3 | 4 | 8 | 12 | 16 | 20 | 24;

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

interface RoomOption {
  id: string;
  name: string;
  note: string;
}

interface CourseOption {
  id: string;
  name: string;
  type: string;
  lessons: string;
  suitable: string;
  pricesByRoom: Record<string, Record<WeekOption, number>>;
}

interface ScheduleItem {
  time: string;
  title: string;
  text: string;
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

interface SpecialCourseFee {
  label: string;
  lessons: string;
  four: string;
  note: string;
}

@Component({
  selector: 'app-glc-school',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './glc-school.component.html',
  styleUrls: [
    '../cebu-school-detail-layout.css',
    '../cebu-school-detail-content.css',
    '../cebu-school-detail-responsive.css',
    '../ev-school/ev-school-detail.component.css',
    './glc-school.component.css',
  ],
})
export class GlcSchoolComponent {
  readonly galleryCategories: GalleryCategory[] = [
    '全部',
    '校园',
    '教室',
    '住宿',
    '餐厅',
    '设施',
  ];
  selectedGalleryCategory: GalleryCategory = '全部';

  readonly registrationFee = 120;
  readonly usdToCny = 7.2;
  readonly weekOptions: WeekOption[] = [1, 2, 3, 4, 8, 12, 16, 20, 24];

  selectedCourseId = 'power-speaking';
  selectedRoomId = 'annex-double';
  selectedWeeks: WeekOption = 4;
  selectedStartDate = '2026-09-07';
  quoteCalculated = false;

  readonly quickInfo: QuickInfo[] = [
    {
      icon: 'location_city',
      label: '学校类型',
      value: '日系运营 / 宿务Mabolo大型综合校',
      note: 'GLC前身为IDEA CEBU，2022年迁入现校区并更名，公开资料列定员约400人。',
    },
    {
      icon: 'record_voice_over',
      label: '课程重点',
      value: 'Power Speaking / IELTS / TOEIC / Family',
      note: '一般英语以Power Speaking为核心，也有亲子、儿童青少年、商务和实习英语方向。',
    },
    {
      icon: 'hotel',
      label: '住宿选择',
      value: 'Main / Annex2校内宿舍',
      note: '公开价格按Main与Annex2单人、双人、三人等房型列示，酒店住宿需另行确认。',
    },
    {
      icon: 'groups',
      label: '学生组成',
      value: '日本学生比例较高，多国籍环境',
      note: '官方资料列日本、台湾、韩国、泰国、俄罗斯等学生来源，适合想要日系支持的人群。',
    },
    {
      icon: 'restaurant',
      label: '费用包含',
      value: '学费 + 住宿 + 每日三餐',
      note: '官方课程页说明套餐价包含授课、住宿和每日三餐；当地费用需另行准备。',
    },
    {
      icon: 'pool',
      label: '校园设施',
      value: '泳池 / 健身房 / 自习区 / 活动',
      note: '公开资料列泳池、健身房、游戏室、桌球/乒乓、自习区、餐厅和高速Wi-Fi。',
    },
  ];

  readonly galleryImages: GalleryImage[] = [
    {
      category: '校园',
      title: 'GLC Mabolo校区',
      description:
        'GLC位于Cebu City Mabolo生活圈，周边有商场、餐厅、超市和医疗资源。',
      src: 'https://cdn.prod.website-files.com/61ffd9e1fcfb7e4bbc331940/6516b82f95b2c14f958198a6__D431020.webp',
    },
    {
      category: '教室',
      title: '一对一学习空间',
      description:
        'Power Speaking以一对一输出训练为核心，按课程强度增加每日一对一节数。',
      src: 'https://cdn.prod.website-files.com/61ffd9e1fcfb7e4bbc331940/6516b7f6af1e5a6d0af8e8dd__D430813.webp',
    },
    {
      category: '教室',
      title: '小组课教室',
      description:
        '一般英语、考试、商务和亲子路线可搭配小组课，增加讨论和表达练习。',
      src: 'https://cdn.prod.website-files.com/61ffd9e1fcfb7e4bbc331940/6516b7ecbc33712e35c95969__D430782.webp',
    },
    {
      category: '设施',
      title: '泳池与公共区域',
      description:
        '校内有泳池、休息区和活动空间，适合想兼顾学习与生活体验的学生。',
      src: 'https://cdn.prod.website-files.com/61ffd9e1fcfb7e4bbc331940/6516b7e35ca95fda3290edfb__D430518.webp',
    },
    {
      category: '餐厅',
      title: '校内餐食',
      description:
        '公开课程页说明套餐价含每日三餐，特殊餐食或过敏需求需提前确认。',
      src: 'https://cdn.prod.website-files.com/61ffd9e1fcfb7e4bbc331940/6516b823f1f8e88374dd30d2__D430834.webp',
    },
    {
      category: '住宿',
      title: 'Main / Annex2宿舍参考',
      description:
        'Main与Annex2校内宿舍通常按单人、双人、三人房报价，热门档期需提前查房。',
      src: 'https://cdn.prod.website-files.com/61ffd9e1fcfb7e4bbc331940/6516b8b2c9416ac1b74d3789_DSC03460.webp',
    },
  ];

  readonly basicInfo: BasicInfoRow[] = [
    { label: '学校名称', value: '菲律宾宿务Global Language Cebu' },
    { label: '英文名称', value: 'Global Language Cebu（GLC）' },
    { label: '前身', value: 'IDEA CEBU，2022年11月迁入现校区并更名GLC' },
    { label: '位置', value: '2815 New Frontier St, Mabolo, Cebu City, Cebu 6000' },
    { label: '学校规模', value: '公开资料列定员约400人' },
    { label: '学校定位', value: '日系运营、Mabolo市区大型综合型、半斯巴达/自律平衡' },
    { label: '主要课程', value: 'Power Speaking、IELTS、TOEIC、Business、Family、Kids / Junior、English + Internship' },
    { label: '房型', value: 'Main / Annex2校内宿舍单人、双人、三人房；酒店住宿需另行确认' },
  ];

  readonly highlights: Highlight[] = [
    {
      image: 'https://cdn.prod.website-files.com/61ffd9e1fcfb7e4bbc331940/6516b82f95b2c14f958198a6__D431020.webp',
      title: 'Mabolo市区生活圈',
      text: '校区在Cebu City Mabolo，官方资料提到Ayala、SM Cebu、超市、餐厅和医院等周边资源。',
    },
    {
      image: 'https://cdn.prod.website-files.com/61ffd9e1fcfb7e4bbc331940/6516b7f6af1e5a6d0af8e8dd__D430813.webp',
      title: 'Power Speaking课量清楚',
      text: '一般英语从4节一对一+2节小组开始，也可选5节一对一或7节一对一的高输出路线。',
    },
    {
      image: 'https://cdn.prod.website-files.com/61ffd9e1fcfb7e4bbc331940/6516b7e35ca95fda3290edfb__D430518.webp',
      title: '课程类型覆盖面广',
      text: '除了成人ESL，也能比较亲子、儿童青少年、TOEIC、IELTS、商务和English + Internship方向。',
    },
  ];

  readonly suitableFor: FitItem[] = [
    {
      title: '第一次宿务游学',
      text: 'Mabolo生活圈、校内住宿和清楚的课程套餐，适合希望流程好理解的学生。',
    },
    {
      title: '想提高口语输出',
      text: 'Power Speaking、Intensive和Ultra7能按一对一课量调强度，短期学习也容易安排。',
    },
    {
      title: '亲子或青少年英语',
      text: '官方课程覆盖Family Package、Kids和Junior English，适合把GLC放进亲子候选名单。',
    },
    {
      title: '想住市区且要设施完整',
      text: '泳池、健身房、自习区、游戏室和周边商场资源，让学习和生活比较平衡。',
    },
  ];

  readonly notSuitableFor: FitItem[] = [
    {
      title: '只想海边度假校区',
      text: 'GLC在Cebu City Mabolo，不是Mactan海边校区；海边感可比较Genius或Cebu Blue Ocean。',
    },
    {
      title: '需要超严格斯巴达管理',
      text: 'GLC更适合半斯巴达/自律平衡型；强制学习管理可同步比较CG Sparta、EV或SMEAG。',
    },
    {
      title: '只看最低总价',
      text: '短期加价、注册费、SSP、签证、管理费、教材、水电和接送都会影响最终预算。',
    },
  ];

  readonly roomOptions: RoomOption[] = [
    { id: 'main-triple', name: 'Main学生寮3人房', note: '官方Power Speaking公开4周USD 1,600起，适合控制预算。' },
    { id: 'main-double', name: 'Main学生寮2人房', note: '比3人房更安静，热门档期需提前查房。' },
    { id: 'main-single', name: 'Main学生寮1人房', note: '隐私最好，预算最高，通常最需要提前锁房。' },
    { id: 'annex-double', name: 'Annex2学生寮2人房', note: '本页默认报价房型，公开4周Power Speaking为USD 1,720。' },
    { id: 'annex-single', name: 'Annex2学生寮1人房', note: '兼顾独立空间和Annex2房型，需按性别与日期确认。' },
  ];

  readonly courseOptions: CourseOption[] = [
    {
      id: 'power-speaking',
      name: 'Power Speaking',
      type: '一般英语',
      lessons: '1:1四节 + 小组两节',
      suitable: '适合第一次游学、基础听说训练和想平衡学习与自由时间的学生。',
      pricesByRoom: {
        'main-triple': { 1: 460, 2: 920, 3: 1380, 4: 1600, 8: 3080, 12: 4560, 16: 6040, 20: 7520, 24: 9000 },
        'main-double': { 1: 510, 2: 1020, 3: 1530, 4: 1800, 8: 3480, 12: 5160, 16: 6840, 20: 8520, 24: 10200 },
        'main-single': { 1: 610, 2: 1220, 3: 1830, 4: 2200, 8: 4280, 12: 6360, 16: 8440, 20: 10520, 24: 12600 },
        'annex-double': { 1: 490, 2: 980, 3: 1470, 4: 1720, 8: 3320, 12: 4920, 16: 6520, 20: 8120, 24: 9720 },
        'annex-single': { 1: 590, 2: 1180, 3: 1770, 4: 2120, 8: 4120, 12: 6120, 16: 8120, 20: 10120, 24: 12120 },
      },
    },
    {
      id: 'intensive-power-speaking',
      name: 'Intensive Power Speaking',
      type: '口语强化',
      lessons: '1:1五节 + 小组两节',
      suitable: '适合想增加一对一比例、短期集中补弱项和提高输出频率的学生。',
      pricesByRoom: {
        'main-triple': { 1: 510, 2: 1020, 3: 1530, 4: 1800, 8: 3480, 12: 5160, 16: 6840, 20: 8520, 24: 10200 },
        'main-double': { 1: 560, 2: 1120, 3: 1680, 4: 2000, 8: 3880, 12: 5760, 16: 7640, 20: 9520, 24: 11400 },
        'main-single': { 1: 660, 2: 1320, 3: 1980, 4: 2400, 8: 4680, 12: 6960, 16: 9240, 20: 11520, 24: 13800 },
        'annex-double': { 1: 540, 2: 1080, 3: 1620, 4: 1920, 8: 3720, 12: 5520, 16: 7320, 20: 9120, 24: 10920 },
        'annex-single': { 1: 640, 2: 1280, 3: 1920, 4: 2320, 8: 4520, 12: 6720, 16: 8920, 20: 11120, 24: 13320 },
      },
    },
    {
      id: 'ultra7-power-speaking',
      name: 'Ultra7 Power Speaking',
      type: '高密度一对一',
      lessons: '1:1七节',
      suitable: '适合时间有限、想让课程几乎全部围绕个人弱点安排的学生。',
      pricesByRoom: {
        'main-triple': { 1: 610, 2: 1220, 3: 1830, 4: 2200, 8: 4280, 12: 6360, 16: 8440, 20: 10520, 24: 12600 },
        'main-double': { 1: 660, 2: 1320, 3: 1980, 4: 2400, 8: 4680, 12: 6960, 16: 9240, 20: 11520, 24: 13800 },
        'main-single': { 1: 760, 2: 1520, 3: 2280, 4: 2800, 8: 5480, 12: 8160, 16: 10840, 20: 13520, 24: 16200 },
        'annex-double': { 1: 640, 2: 1280, 3: 1920, 4: 2320, 8: 4520, 12: 6720, 16: 8920, 20: 11120, 24: 13320 },
        'annex-single': { 1: 740, 2: 1480, 3: 2220, 4: 2720, 8: 5320, 12: 7920, 16: 10520, 20: 13120, 24: 15720 },
      },
    },
  ];

  readonly specialFees: SpecialCourseFee[] = [
    {
      label: 'Light Power Speaking',
      lessons: '公开资料列USD 165 / 周学费',
      four: '住宿费另加，适合轻量学习',
      note: '正式套餐需按房型、周数和短期附加费确认。',
    },
    {
      label: 'Family Package',
      lessons: 'Package 2 / 3 / 4',
      four: 'USD 410 / 590 / 775 每周学费参考',
      note: '亲子家庭需确认儿童年龄、家长课程、房型和保姆/监护规则。',
    },
    {
      label: 'Kids / Junior English',
      lessons: 'Kids 6/7/8 或 Junior 6/7/8',
      four: 'USD 325-465 / 周学费参考',
      note: '适合儿童青少年路线，正式费用要加住宿与当地费用。',
    },
    {
      label: 'TOEIC / IELTS',
      lessons: 'General / Intensive / Ultra 8',
      four: 'USD 240-430 / 周学费参考',
      note: '考试路线需确认英文程度、教材、模考和开课安排。',
    },
    {
      label: 'Business / Internship',
      lessons: 'Business English / English + Internship',
      four: '按当期课程表核价',
      note: '商务和实习方向报名条件、周期与名额需提前确认。',
    },
  ];

  readonly schedule: ScheduleItem[] = [
    {
      time: '07:00 - 08:00',
      title: '早餐 / 课前准备',
      text: '公开资料列套餐含每日三餐，实际时段以到校说明为准。',
    },
    {
      time: '08:00 - 11:50',
      title: '上午一对一 / 小组课',
      text: 'Power Speaking一般从一对一和小组课组合开始，按课程强度调整节数。',
    },
    {
      time: '12:00 - 13:00',
      title: '午餐',
      text: '校内餐厅用餐，特殊餐食、过敏或宗教饮食需提前申请并确认费用。',
    },
    {
      time: '13:00 - 17:00',
      title: '下午课程 / 复习',
      text: 'ESL、TOEIC、IELTS、Business、Family或Kids路线按等级与目标安排。',
    },
    {
      time: '17:00 - 19:00',
      title: '晚餐 / 运动 / 休息',
      text: '可使用泳池、健身房、自习区或参加校内活动，以现场开放规则为准。',
    },
    {
      time: '19:00以后',
      title: '自习 / 外出管理',
      text: '18岁以上官方FAQ口径较自由，但建议23:00前返校；未成年规则更严格。',
    },
  ];

  readonly localFees: LocalFee[] = [
    { item: '入学金', amount: 'USD 120', note: '本页报价器按公开参考注册费计算' },
    { item: '机场接机', amount: 'USD 30起', note: '周日/平日或接送组合价格不同，需按航班确认' },
    { item: 'SSP', amount: 'PHP 8,000', note: '特别学习许可，通常所有学生需办理' },
    { item: 'SSP I-Card', amount: 'PHP 4,500', note: '公开费用表列与SSP分开支付' },
    { item: 'ACR I-Card', amount: 'PHP 4,000', note: '通常9周以上需确认' },
    { item: '签证延长', amount: 'PHP 4,670起', note: '8周及以上常见，随周数增加' },
    { item: '管理费', amount: 'PHP 3,000-6,000', note: '公开表按1-4周区间列示，长周数需累计确认' },
    { item: '电费', amount: 'PHP 500 / 周', note: '学生宿舍参考，酒店或特殊房型另行确认' },
    { item: '教材费', amount: 'PHP 3,000起', note: 'ESL、考试、商务教材区间不同' },
    { item: '宿舍押金', amount: 'PHP 3,000或USD 50', note: '退房时按实际扣费结算' },
    { item: '特殊餐食', amount: 'USD 70 / 周参考', note: '过敏或特殊餐食需提前申请' },
    { item: '追加一对一', amount: 'PHP 3,000 / 周', note: '是否可加课取决于老师和课表空位' },
  ];

  readonly serviceSteps: ProcessStep[] = [
    {
      icon: 'person_search',
      title: '先判断GLC是否适合',
      text: '根据市区位置、课程强度、亲子需求、考试目标和预算做初筛。',
    },
    {
      icon: 'fact_check',
      title: '确认课程与房型',
      text: '核对Power Speaking、考试、Family/Kids路线、Main/Annex2空房和入学日。',
    },
    {
      icon: 'payments',
      title: '拆清前期和当地费用',
      text: '把套餐价、注册费、SSP、签证、管理费、水电、教材、接机和押金分开列清。',
    },
    {
      icon: 'assignment_turned_in',
      title: '准备入学文件',
      text: '协助整理护照、保险、eTravel、接机表、现金清单和到校注意事项。',
    },
    {
      icon: 'support_agent',
      title: '到校后继续跟进',
      text: '课程、老师、宿舍、账单或校规沟通问题，都可以继续联系顾问协助。',
    },
    {
      icon: 'location_on',
      title: '宿务当地支持',
      text: '思达在宿务有工作人员驻点，可按情况提供当地沟通支持。',
    },
  ];

  readonly trustBadges = [
    { icon: 'description', label: '公开费用逐项核验' },
    { icon: 'verified_user', label: '课程与房型提前确认' },
    { icon: 'payments', label: '套餐与当地费分开算' },
    { icon: 'apartment', label: '深圳总部 + 宿务驻点' },
  ];

  readonly schoolServices = [
    '一对一课程',
    '小组课',
    'Power Speaking',
    'TOEIC / IELTS',
    'Business English',
    'Family Package',
    'Kids / Junior',
    '校内宿舍',
    '三餐',
    '泳池',
    '健身房',
    '高速Wi-Fi',
    '自习区',
    '商店',
  ];
  readonly campusActivities = [
    '校内交流活动',
    'Every other week活动',
    '周末Oslob等活动参考',
    '志愿者活动参考',
    '泳池和健身房',
    '桌球 / 乒乓',
  ];
  readonly weekendActivities = [
    'SM City Cebu',
    'Ayala Center Cebu',
    'Mabolo餐厅',
    'IT Park',
    '超市和咖啡厅',
    'Mactan周末行程',
  ];
  readonly notes = [
    '本页Power Speaking费用按GLC官方公开美元套餐价整理，通常含学费、住宿和每日三餐。',
    '1-3周短期课程公开资料说明有USD 60 / 周短期附加费，官方套餐价页面通常已列出短期价；正式报价仍需核对。',
    '8周以上公开资料列长期优惠，学校报价单口径可能会把优惠独立显示或合并显示。',
    '酒店住宿、亲子、Kids/Junior、TOEIC、IELTS、Business和Internship路线需要按当期报价单另核。',
    'SSP、SSP I-Card、签证、ACR、管理费、电费、教材、接机和押金通常不包含在课程住宿套餐内。',
  ];
  readonly faqs: FaqItem[] = [
    {
      question: 'GLC和CIA最大的区别是什么？',
      answer:
        'CIA更偏Mactan大型半斯巴达度假型校区；GLC更偏Cebu City Mabolo市区生活圈、日系运营、Power Speaking和亲子/考试多路线综合型。',
    },
    {
      question: '页面上的费用包含全部费用吗？',
      answer:
        '不包含全部。报价器主要估算课程住宿套餐和入学金；SSP、SSP I-Card、签证、ACR、管理费、电费、教材、接机、押金和个人生活费需另行准备。',
    },
    {
      question: 'GLC适合英语初学者吗？',
      answer:
        '适合列入候选。Power Speaking是一般英语路线，可按4节、5节或7节一对一强度选择，适合基础重建和口语输出。',
    },
    {
      question: 'GLC适合亲子或孩子游学吗？',
      answer:
        '可以比较。官方公开课程包含Family Package、Kids English和Junior English，但需确认孩子年龄、课程、住宿、监护和当地费用。',
    },
    {
      question: 'GLC住宿有什么要确认？',
      answer:
        '需确认Main/Annex2/酒店房型、性别空位、同住规则、清扫洗衣、Wi-Fi、门禁、餐食和前后泊安排。',
    },
  ];
  readonly sideNav: SideNavItem[] = [
    { label: '学校环境', target: 'gallery', icon: 'image' },
    { label: '课程与费用', target: 'course-fees', icon: 'menu_book' },
    { label: '费用快速报价', target: 'quote', icon: 'calculate' },
    { label: '特殊课程', target: 'special-fees', icon: 'bolt' },
    { label: '到校费用', target: 'local-fees', icon: 'payments' },
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

  readonly sources: SourceLink[] = [
    { label: 'Global Language Cebu官方英文网站', url: 'https://www.glcenglish.com/' },
    { label: 'GLC官方学校资料', url: 'https://www.glcenglish.com/about/school' },
    { label: 'GLC Power Speaking官方费用', url: 'https://www.glcenglish.com/program/power-speaking' },
    { label: 'GLC 2026费用与当地费用参考', url: 'https://www.fujiyama-international.com/philippines/idea-cebu.html' },
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

  feeFor(courseId: string, roomId: string, weeks: WeekOption = 4): number {
    const course = this.courseOptions.find((item) => item.id === courseId);

    return course?.pricesByRoom[roomId]?.[weeks] ?? 0;
  }

  get filteredGalleryImages(): GalleryImage[] {
    return this.selectedGalleryCategory === '全部'
      ? this.galleryImages
      : this.galleryImages.filter(
          (image) => image.category === this.selectedGalleryCategory,
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

  get selectedPackageFee(): number {
    return this.feeFor(this.selectedCourseId, this.selectedRoomId, this.selectedWeeks);
  }

  get quoteUsd(): number {
    return this.registrationFee + this.selectedPackageFee;
  }

  get packageFeeText(): string {
    return `USD ${this.formatUsd(this.selectedPackageFee)} 起`;
  }

  get quoteUsdText(): string {
    return `USD ${this.formatUsd(this.quoteUsd)} 起`;
  }

  get quoteCnyText(): string {
    const rounded = Math.round((this.quoteUsd * this.usdToCny) / 100) * 100;

    return `约 ${rounded.toLocaleString('zh-CN')} 元起`;
  }

  get seasonalNote(): string {
    const start = new Date(`${this.selectedStartDate}T00:00:00`);

    if (Number.isNaN(start.getTime())) {
      return '入学日期需要和学校确认，短期附加费、长期优惠、房型空位和当地费用会影响最终报价。';
    }

    return this.selectedWeeks <= 3
      ? '当前选择为1-3周短期课程，需确认官方短期附加费是否已包含在学校正式报价中。'
      : 'GLC公开资料列有长期周数优惠与短期附加费口径，最终仍需按学校当期报价单确认。';
  }

  formatUsd(amount: number): string {
    return amount.toLocaleString('en-US');
  }
}

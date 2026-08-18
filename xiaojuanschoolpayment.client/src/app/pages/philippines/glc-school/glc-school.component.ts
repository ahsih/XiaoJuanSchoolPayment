import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { catchError, EMPTY, forkJoin, switchMap } from 'rxjs';
import { SchoolFeeDTO } from '../../../../interfaces/school-fees.dto';
import { SchoolLessonDTO } from '../../../../interfaces/school-lessons.dto';
import { SchoolRoomDTO } from '../../../../interfaces/school-rooms.dto';
import { SchoolService } from '../../../../services/school.service';

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
  weeklyAccommodation: number;
}

interface CourseOption {
  id: string;
  name: string;
  type: string;
  lessons: string;
  suitable: string;
  weeklyTuition: number;
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
  weeklyTuition: number;
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
export class GlcSchoolComponent implements OnInit {
  private readonly schoolService = inject(SchoolService);
  private readonly pricingSchoolName = '菲律宾宿务Global Language Cebu';
  private readonly specialFeeOrder = [
    'Light Power Speaking',
    'Ultra Sparta ESL',
    'Family Package 2',
    'Family Package 3',
    'Family Package 4',
    'Kids English 6',
    'Kids English 7',
    'Kids English 8',
    'Junior Power Speaking 6',
    'Junior Power Speaking 7',
    'Junior Power Speaking 8',
    'General IELTS',
    'Intensive IELTS',
    'Ultra8 IELTS',
    'Ultra IELTS斯巴达',
    'Business course',
    'Ultra7 Business',
  ];
  private readonly roomOrder = [
    '主楼豪华单人间',
    '主楼单人间',
    '主楼双人间',
    '主楼三人间',
    '副楼双人间',
    '副楼单人间',
  ];
  readonly galleryCategories: GalleryCategory[] = [
    '全部',
    '校园',
    '教室',
    '住宿',
    '餐厅',
    '设施',
  ];
  selectedGalleryCategory: GalleryCategory = '全部';

  registrationFee = 120;
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
      value: '主楼 / 副楼校内宿舍',
      note: '2026年价目表列主楼豪华单人、单人、双人、三人房及副楼单人、双人房。',
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
      title: '主楼 / 副楼宿舍参考',
      description:
        '校内宿舍按房型列每周住宿费，斯巴达管理学生只能选择副楼住宿。',
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
    { label: '房型', value: '主楼豪华单人、单人、双人、三人房；副楼单人、双人房' },
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
      text: '注册费、SSP、签证、管理费、教材、水电和接送都会影响最终预算。',
    },
  ];

  roomOptions: RoomOption[] = [
    { id: 'main-deluxe-single', name: '主楼豪华单人间', note: '2026年住宿费为USD 645 / 周。', weeklyAccommodation: 645 },
    { id: 'main-single', name: '主楼单人间', note: '2026年住宿费为USD 385 / 周。', weeklyAccommodation: 385 },
    { id: 'main-double', name: '主楼双人间', note: '2026年住宿费为USD 270 / 周。', weeklyAccommodation: 270 },
    { id: 'main-triple', name: '主楼三人间', note: '2026年住宿费为USD 220 / 周，适合控制预算。', weeklyAccommodation: 220 },
    { id: 'annex-double', name: '副楼双人间', note: '2026年住宿费为USD 250 / 周；斯巴达管理学生只能选择副楼住宿。', weeklyAccommodation: 250 },
    { id: 'annex-single', name: '副楼单人间', note: '2026年住宿费为USD 360 / 周；斯巴达管理学生只能选择副楼住宿。', weeklyAccommodation: 360 },
  ];

  courseOptions: CourseOption[] = [
    {
      id: 'power-speaking',
      name: 'Power Speaking',
      type: '一般英语',
      lessons: '1:1四节 + 小组两节（选修课）',
      suitable: '适合第一次游学、基础听说训练和想平衡学习与自由时间的学生。',
      weeklyTuition: 215,
    },
    {
      id: 'intensive-power-speaking',
      name: 'Intensive Power Speaking',
      type: '口语强化',
      lessons: '1:1五节 + 小组两节（选修课）',
      suitable: '适合想增加一对一比例、短期集中补弱项和提高输出频率的学生。',
      weeklyTuition: 270,
    },
    {
      id: 'ultra7-power-speaking',
      name: 'Ultra7 Power Speaking',
      type: '高密度一对一',
      lessons: '1:1七节 + 小组一节（选修课）',
      suitable: '适合时间有限、想让课程几乎全部围绕个人弱点安排的学生。',
      weeklyTuition: 375,
    },
  ];

  specialFees: SpecialCourseFee[] = [
    {
      label: 'Light Power Speaking',
      lessons: '1:1三节 + 小组两节（选修课）',
      weeklyTuition: 165,
      note: '15岁以上；住宿费另加。',
    },
    {
      label: 'Ultra Sparta ESL',
      lessons: '1:1五节 + 小组三节 + 词汇/写作测试 + 晚课两节 + 自习一节',
      weeklyTuition: 280,
      note: '含周六上午课程；斯巴达管理学生只能选择副楼住宿。',
    },
    {
      label: 'Family Package 2',
      lessons: '1:1八节（青少年与监护人共享）+ 监护人小组两节',
      weeklyTuition: 410,
      note: '小孩5-11岁，青少年12-14岁。',
    },
    {
      label: 'Family Package 3',
      lessons: '1:1十二节（青少年与监护人共享）+ 监护人小组两节',
      weeklyTuition: 590,
      note: '小孩5-11岁，青少年12-14岁。',
    },
    {
      label: 'Family Package 4',
      lessons: '1:1十六节（青少年与监护人共享）+ 监护人小组两节',
      weeklyTuition: 775,
      note: '小孩5-11岁，青少年12-14岁。',
    },
    {
      label: 'Kids English 6',
      lessons: '1:1六节',
      weeklyTuition: 335,
      note: '适合5-11岁儿童。',
    },
    {
      label: 'Kids English 7',
      lessons: '1:1七节',
      weeklyTuition: 400,
      note: '适合5-11岁儿童。',
    },
    {
      label: 'Kids English 8',
      lessons: '1:1八节',
      weeklyTuition: 465,
      note: '适合5-11岁儿童。',
    },
    {
      label: 'Junior Power Speaking 6',
      lessons: '1:1六节',
      weeklyTuition: 325,
      note: '适合12-14岁青少年。',
    },
    {
      label: 'Junior Power Speaking 7',
      lessons: '1:1七节',
      weeklyTuition: 375,
      note: '适合12-14岁青少年。',
    },
    {
      label: 'Junior Power Speaking 8',
      lessons: '1:1八节',
      weeklyTuition: 430,
      note: '适合12-14岁青少年。',
    },
    {
      label: 'General IELTS',
      lessons: '1:1四节 + 小组两节 + 选修课',
      weeklyTuition: 240,
      note: '需确认英文程度、教材和开课安排。',
    },
    {
      label: 'Intensive IELTS',
      lessons: '1:1五节 + 小组两节 + 选修课',
      weeklyTuition: 300,
      note: '需确认英文程度、教材和开课安排。',
    },
    {
      label: 'Ultra8 IELTS',
      lessons: '1:1八节 + 选修课',
      weeklyTuition: 430,
      note: '需确认英文程度、教材和开课安排。',
    },
    {
      label: 'Ultra IELTS斯巴达',
      lessons: '1:1五节 + 强制小组三节 + 测试、晚课与自习',
      weeklyTuition: 355,
      note: '含周六上午模考；斯巴达管理学生只能选择副楼住宿。',
    },
    {
      label: 'Business course',
      lessons: '1:1四节 + 小组两节（选修课）',
      weeklyTuition: 300,
      note: '住宿费与当地费用另加。',
    },
    {
      label: 'Ultra7 Business',
      lessons: '1:1七节 + 小组一节（选修课）',
      weeklyTuition: 465,
      note: '住宿费与当地费用另加。',
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
      text: '核对Power Speaking、考试、Family/Kids路线、主楼/副楼空房和入学日。',
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
    '本页2026年课程和住宿价格按GLC美元周价表整理，报价器按“每周学费 + 每周住宿费”乘以周数计算。',
    '价格表未列短期附加费或长期优惠，因此报价器不自行增加或扣减；正式报价仍需按入学日期与学校确认。',
    '亲子、Kids/Junior、IELTS、Business和斯巴达路线的年龄、入学条件、宿舍限制与开课安排需另行确认。',
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
        '需确认主楼/副楼房型、性别空位、同住规则、清扫洗衣、Wi-Fi、门禁、餐食和前后泊安排；斯巴达管理学生只能选择副楼住宿。',
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
    { label: 'GLC Power Speaking官方课程资料', url: 'https://www.glcenglish.com/program/power-speaking' },
  ];

  ngOnInit(): void {
    this.loadPricingFromDatabase();
  }

  private loadPricingFromDatabase(): void {
    this.schoolService.getSchools({ name: 'Global Language Cebu' }).pipe(
      switchMap((schools) => {
        const school =
          schools.find((item) => item.name === this.pricingSchoolName) ??
          schools.find((item) => item.name.includes('Global Language Cebu')) ??
          schools[0];

        if (!school?.id) {
          return EMPTY;
        }

        return forkJoin({
          lessons: this.schoolService.getSchoolLessons({ schoolId: school.id, week: 1 }),
          rooms: this.schoolService.getSchoolRooms({ schoolId: school.id, week: 1 }),
          fees: this.schoolService.getSchoolFees({ schoolId: school.id }),
        });
      }),
      catchError(() => EMPTY),
    ).subscribe(({ lessons, rooms, fees }) => {
      this.applyPricingData(lessons, rooms, fees);
    });
  }

  private applyPricingData(
    lessons: SchoolLessonDTO[],
    rooms: SchoolRoomDTO[],
    fees: SchoolFeeDTO[],
  ): void {
    const weeklyLessons = lessons.filter((lesson) => lesson.week === 1);
    const primaryCourseNames = new Set(this.courseOptions.map((course) => course.name));

    this.courseOptions = this.courseOptions.map((course) => {
      const databaseLesson = weeklyLessons.find((lesson) => lesson.name === course.name);

      return databaseLesson
        ? {
            ...course,
            lessons: databaseLesson.description || course.lessons,
            suitable: databaseLesson.note || course.suitable,
            weeklyTuition: databaseLesson.price,
          }
        : course;
    });

    const databaseSpecialFees = weeklyLessons
      .filter((lesson) => !primaryCourseNames.has(lesson.name))
      .map((lesson) => ({
        label: lesson.name,
        lessons: lesson.description || '课程安排请向学校确认',
        weeklyTuition: lesson.price,
        note: lesson.note || '住宿费与当地费用另加。',
      }))
      .sort(
        (left, right) =>
          this.orderIndex(this.specialFeeOrder, left.label) -
          this.orderIndex(this.specialFeeOrder, right.label),
      );

    if (databaseSpecialFees.length > 0) {
      this.specialFees = databaseSpecialFees;
    }

    const databaseRooms = rooms
      .filter((room) => room.week === 1)
      .map((room) => ({
        id: this.createRoomId(room),
        name: room.name,
        note: room.description || '请联系顾问确认空房和住宿规则。',
        weeklyAccommodation: room.price,
      }))
      .sort(
        (left, right) =>
          this.orderIndex(this.roomOrder, left.name) -
          this.orderIndex(this.roomOrder, right.name),
      );

    if (databaseRooms.length > 0) {
      this.roomOptions = databaseRooms;
      if (!this.roomOptions.some((room) => room.id === this.selectedRoomId)) {
        this.selectedRoomId =
          this.roomOptions.find((room) => room.id === 'annex-double')?.id ??
          this.roomOptions[0].id;
      }
    }

    const registrationFee = fees.find((fee) => fee.name === '注册费');
    if (registrationFee) {
      this.registrationFee = registrationFee.fee;
      const localRegistrationFee = this.localFees.find((fee) => fee.item === '入学金');
      if (localRegistrationFee) {
        localRegistrationFee.amount = `USD ${this.formatUsd(registrationFee.fee)}`;
      }
    }
  }

  private createRoomId(room: SchoolRoomDTO): string {
    if (room.name === '主楼豪华单人间') return 'main-deluxe-single';
    if (room.name === '主楼单人间') return 'main-single';
    if (room.name === '主楼双人间') return 'main-double';
    if (room.name === '主楼三人间') return 'main-triple';
    if (room.name === '副楼双人间') return 'annex-double';
    if (room.name === '副楼单人间') return 'annex-single';
    return `database-${room.id}`;
  }

  private orderIndex(order: string[], value: string): number {
    const index = order.indexOf(value);
    return index === -1 ? Number.MAX_SAFE_INTEGER : index;
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
    const room = this.roomOptions.find((item) => item.id === roomId);

    return course && room
      ? (course.weeklyTuition + room.weeklyAccommodation) * weeks
      : 0;
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
      return '入学日期需要和学校确认，房型空位、学校优惠和当地费用会影响最终报价。';
    }

    return this.selectedWeeks <= 3
      ? '当前选择为1-3周课程，报价器按2026年周价直接计算；是否另有短期规则需向学校确认。'
      : '报价器按2026年周价直接计算，未自行加入长期优惠；最终仍需按学校当期报价单确认。';
  }

  formatUsd(amount: number): string {
    return amount.toLocaleString('en-US');
  }
}

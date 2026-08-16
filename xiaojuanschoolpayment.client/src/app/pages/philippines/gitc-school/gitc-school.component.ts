import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

type GalleryCategory = '全部' | '校园' | '教室' | '住宿' | '餐厅' | '设施';
type WeekOption = 1 | 2 | 3 | 4 | 8 | 12;

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
  shortName: string;
  note: string;
}

interface CourseOption {
  id: string;
  name: string;
  type: string;
  lessons: string;
  suitable: string;
  pricesByRoom: Record<string, Record<WeekOption, number>>;
  note: string;
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
  reference: string;
  note: string;
}

@Component({
  selector: 'app-gitc-school',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './gitc-school.component.html',
  styleUrls: [
    '../cebu-school-detail-layout.css',
    '../cebu-school-detail-content.css',
    '../cebu-school-detail-responsive.css',
    '../ev-school/ev-school-detail.component.css',
    './gitc-school.component.css',
  ],
})
export class GitcSchoolComponent {
  readonly galleryCategories: GalleryCategory[] = [
    '全部',
    '校园',
    '教室',
    '住宿',
    '餐厅',
    '设施',
  ];
  readonly weekOptions: WeekOption[] = [1, 2, 3, 4, 8, 12];
  readonly registrationFee = 100;
  readonly usdToCny = 7.2;

  selectedGalleryCategory: GalleryCategory = '全部';
  selectedCourseId = 'regular';
  selectedRoomId = 'triple';
  selectedWeeks: WeekOption = 4;
  selectedStartDate = '2026-09-07';
  quoteCalculated = false;

  readonly quickInfo: QuickInfo[] = [
    {
      icon: 'location_on',
      label: '城市校正',
      value: 'Iloilo / Cebu，不是Clark',
      note: '官方学校概要列Iloilo校址；官网首页另写明2025年7月开放Cebu Mactan新校区。',
    },
    {
      icon: 'account_balance',
      label: '学校类型',
      value: '大学附属语言中心',
      note: '2003年以C&C起源，2017年更名为Green International Technological College Language Center。',
    },
    {
      icon: 'assignment',
      label: '课程重点',
      value: 'ESL / TOEIC / IELTS / Junior',
      note: '官方费用页列Basic、Regular、Power Speaking、Junior、TOEIC/IELTS入门和点数保证课程。',
    },
    {
      icon: 'groups',
      label: '国际交流',
      value: '大学课程 / SDGs / 文化交流',
      note: '官方介绍强调可与当地大学生交流，并有英语结合SDGs/NGO学习内容。',
    },
    {
      icon: 'hotel',
      label: '住宿',
      value: 'One Spatial Iloilo公寓宿舍',
      note: '官方学校概要列学生寮地址为One Spatial Iloilo，房型为1人、2人、3人房。',
    },
    {
      icon: 'payments',
      label: '4周参考',
      value: 'USD 930起 + 注册费',
      note: '官方费用页Basic + 学生寮3人房4周USD930；当地PHP费用另算。',
    },
  ];

  readonly galleryImages: GalleryImage[] = [
    {
      category: '校园',
      title: 'GITC Iloilo校舍入口',
      description:
        '官方图库中的Green International Technological College校舍入口，可用于核对学校品牌和校园外观。',
      src: 'https://gitc-jp.com/wp-content/uploads/2018/06/Schoolbuilding1-e1529989504687.jpg',
    },
    {
      category: '校园',
      title: 'GITC新校园建筑',
      description:
        '公开视察资料显示GITC在疫情后迁至Iloilo新校园，并恢复接收学生。',
      src: 'https://www.fujiyama-international.com/archives/006/202303/ab2ba3580eeabd921f353e254be53993.jpg',
    },
    {
      category: '设施',
      title: '校园庭院与休息区',
      description:
        'Iloilo校区周边安静，适合想在小众城市里专心学习并保留大学氛围的人。',
      src: 'https://www.global-study.jp/philippines/image/iloilo_gitc_img14.jpg',
    },
    {
      category: '校园',
      title: 'GITC校园外观参考',
      description:
        'GITC长期以大学附属、考试课程和多国籍交流作为主要定位。',
      src: 'https://www.fujiyama-international.com/archives/004/202302/627a53bcf449ae9ee1c4fd39f938b463.jpg',
    },
    {
      category: '教室',
      title: '大学附属学习环境',
      description:
        '官方资料强调语言中心位于大学体系内，适合想结合ESL、考试和大学交流体验的学生。',
      src: 'https://gitc-jp.com/wp-content/uploads/2018/06/Schoolbuilding1-e1529989504687.jpg',
    },
    {
      category: '住宿',
      title: 'One Spatial Iloilo住宿口径',
      description:
        '官方学校概要列学生宿舍位于One Spatial Iloilo，实际房间照片、床型和空房需报名时确认。',
      src: 'https://www.fujiyama-international.com/archives/006/202303/ab2ba3580eeabd921f353e254be53993.jpg',
    },
  ];

  readonly basicInfo: BasicInfoRow[] = [
    { label: '页面名称', value: '菲律宾怡朗GITC College International Language Center' },
    { label: '英文名称', value: 'Green International Technological College Language Center' },
    { label: '城市校正', value: '公开资料显示GITC位于Iloilo，并有Cebu Mactan新校区；未找到Clark校区公开资料' },
    { label: '学校地址', value: 'Green International Technological College BLD, St. Clement Church, Luna St. La Paz, Iloilo City' },
    { label: '学生寮地址', value: 'One Spatial Iloilo, Mandurriao, Iloilo' },
    { label: '设立年度', value: '2003年C&C Language Academy起源；2017年更名为GITC Language Center' },
    { label: '课程', value: 'Basic、Regular、Power Speaking、Junior、TOEIC/IELTS入门、TOEIC/IELTS点数保证' },
    { label: '住宿房型', value: '通学、学生寮1人房、2人房、3人房' },
    { label: '课堂长度', value: '官方费用页列1课时45分钟' },
    { label: '本页费用口径', value: '按GITC官方费用页美元表整理；注册费和当地PHP费用另计' },
  ];

  readonly highlights: Highlight[] = [
    {
      image: 'https://gitc-jp.com/wp-content/uploads/2018/06/Schoolbuilding1-e1529989504687.jpg',
      title: '大学附属语言中心',
      text: 'GITC不是普通独立语言学校，它依托Green International Technological College，适合想要大学氛围和交流体验的人。',
    },
    {
      image: 'https://www.global-study.jp/philippines/image/iloilo_gitc_img14.jpg',
      title: 'TOEIC / IELTS方向清楚',
      text: '官方费用页列TOEIC/IELTS入门和点数保证课程，适合想在安静城市备考的人。',
    },
    {
      image: 'https://www.fujiyama-international.com/archives/006/202303/ab2ba3580eeabd921f353e254be53993.jpg',
      title: 'Iloilo安静学习环境',
      text: 'Iloilo比宿务、马尼拉和Clark更低干扰，适合长期ESL、考试准备和预算控制。',
    },
  ];

  readonly suitableFor: FitItem[] = [
    {
      title: '想要大学附属和当地学生交流',
      text: '官方资料强调可参与当地大学生课程、文化交流和校内活动，适合想要英语之外体验的人。',
    },
    {
      title: '想在Iloilo安静学习',
      text: 'Iloilo城市节奏更稳定，适合基础ESL、长期学习和需要减少娱乐干扰的人。',
    },
    {
      title: 'TOEIC / IELTS目标明确',
      text: 'GITC公开课程包含TOEIC/IELTS入门和点数保证方向，报价时要同步确认入学程度和目标分数。',
    },
    {
      title: '亲子或Junior方向',
      text: '官方价格表列Junior课程，低龄和亲子学生需要额外确认监护、房型和陪读规则。',
    },
  ];

  readonly notSuitableFor: FitItem[] = [
    {
      title: '只想找Clark学校',
      text: '公开资料未显示GITC在Clark运营。如果目标是Clark，应优先看CIP、EG、WE、TALK、HELP、HANA等学校。',
    },
    {
      title: '想要海边度假型校区',
      text: 'Iloilo更偏安静和大学城市，不是Mactan或Boracay那种海边度假氛围。',
    },
    {
      title: '不想坐校车通勤',
      text: '官方资料列学校和One Spatial Iloilo学生寮为不同地址，实际通勤、接驳和餐食需先确认。',
    },
  ];

  readonly roomOptions: RoomOption[] = [
    { id: 'commute', name: '通学', shortName: '通学', note: '适合自行安排住宿或团体项目，住宿不包含在报价中。' },
    { id: 'single', name: '学生寮1人房', shortName: '1人房', note: '适合重视隐私和长期住宿舒适度的成人学生。' },
    { id: 'double', name: '学生寮2人房', shortName: '2人房', note: '适合朋友同行、亲子或愿意合住的人。' },
    { id: 'triple', name: '学生寮3人房', shortName: '3人房', note: '4周主费最低的宿舍房型口径，空房和组合需确认。' },
  ];

  readonly courseOptions: CourseOption[] = [
    {
      id: 'basic',
      name: 'Basic',
      type: '一般英语',
      lessons: '1:1三节 + Group两节',
      suitable: '适合初学者、低压力打基础和长期ESL。',
      pricesByRoom: {
        commute: { 1: 315, 2: 525, 3: 630, 4: 700, 8: 1400, 12: 2100 },
        single: { 1: 815, 2: 1025, 3: 1130, 4: 1200, 8: 2400, 12: 3600 },
        double: { 1: 635, 2: 845, 3: 950, 4: 1020, 8: 2040, 12: 3060 },
        triple: { 1: 545, 2: 755, 3: 860, 4: 930, 8: 1860, 12: 2790 },
      },
      note: '官方费用页列Basic为1:1三节+小组两节。',
    },
    {
      id: 'regular',
      name: 'Regular',
      type: '标准ESL',
      lessons: '1:1四节 + Group三节',
      suitable: '适合大多数成人ESL学生，一对一和小组比例较均衡。',
      pricesByRoom: {
        commute: { 1: 360, 2: 600, 3: 720, 4: 800, 8: 1600, 12: 2400 },
        single: { 1: 860, 2: 1100, 3: 1220, 4: 1300, 8: 2600, 12: 3900 },
        double: { 1: 680, 2: 920, 3: 1040, 4: 1120, 8: 2240, 12: 3360 },
        triple: { 1: 590, 2: 830, 3: 950, 4: 1030, 8: 2060, 12: 3090 },
      },
      note: '本页报价器默认Regular + 3人房。',
    },
    {
      id: 'power-speaking',
      name: 'Power Speaking',
      type: '口语强化',
      lessons: '1:1七节',
      suitable: '适合短期提高输出密度、想减少小组课的人。',
      pricesByRoom: {
        commute: { 1: 405, 2: 675, 3: 810, 4: 900, 8: 1800, 12: 2700 },
        single: { 1: 905, 2: 1175, 3: 1310, 4: 1400, 8: 2800, 12: 4200 },
        double: { 1: 725, 2: 995, 3: 1130, 4: 1220, 8: 2440, 12: 3660 },
        triple: { 1: 635, 2: 905, 3: 1040, 4: 1130, 8: 2260, 12: 3390 },
      },
      note: '官方费用页列Power Speaking为一对一7节。',
    },
    {
      id: 'junior',
      name: 'Junior',
      type: '青少年英语',
      lessons: '1:1四节 + Group两节',
      suitable: '适合青少年、亲子或低龄方向，但监护与房型需先确认。',
      pricesByRoom: {
        commute: { 1: 383, 2: 638, 3: 765, 4: 850, 8: 1700, 12: 2550 },
        single: { 1: 883, 2: 1138, 3: 1265, 4: 1350, 8: 2700, 12: 4050 },
        double: { 1: 703, 2: 958, 3: 1085, 4: 1170, 8: 2340, 12: 3510 },
        triple: { 1: 613, 2: 868, 3: 995, 4: 1080, 8: 2160, 12: 3240 },
      },
      note: 'Junior涉及年龄、监护和家长同行规则。',
    },
    {
      id: 'exam-intro',
      name: 'TOEIC / IELTS 入门',
      type: '考试入门',
      lessons: '1:1三节 + Group四节',
      suitable: '适合第一次准备TOEIC或IELTS，还需要打基础的人。',
      pricesByRoom: {
        commute: { 1: 360, 2: 600, 3: 720, 4: 800, 8: 1600, 12: 2400 },
        single: { 1: 860, 2: 1100, 3: 1220, 4: 1300, 8: 2600, 12: 3900 },
        double: { 1: 680, 2: 920, 3: 1040, 4: 1120, 8: 2240, 12: 3360 },
        triple: { 1: 590, 2: 830, 3: 950, 4: 1030, 8: 2060, 12: 3090 },
      },
      note: '考试入门价目与Regular同口径。',
    },
    {
      id: 'exam-guarantee',
      name: 'TOEIC / IELTS 点数保证',
      type: '考试保证',
      lessons: '1:1三节 + Group四节',
      suitable: '适合有明确分数目标、可接受保证班规则的人。',
      pricesByRoom: {
        commute: { 1: 405, 2: 675, 3: 810, 4: 900, 8: 1800, 12: 2700 },
        single: { 1: 905, 2: 1175, 3: 1310, 4: 1400, 8: 2800, 12: 4200 },
        double: { 1: 725, 2: 995, 3: 1130, 4: 1220, 8: 2440, 12: 3660 },
        triple: { 1: 635, 2: 905, 3: 1040, 4: 1130, 8: 2260, 12: 3390 },
      },
      note: '保证班需确认入学分数、出勤、模考和未达标规则。',
    },
  ];

  readonly specialFees: SpecialCourseFee[] = [
    {
      label: '额外一对一',
      lessons: '平日每日1节',
      reference: 'USD 250 / 4周',
      note: '官方费用页列可追加一对一课程，需按老师和课表确认。',
    },
    {
      label: 'Babysitter',
      lessons: '亲子/低龄辅助',
      reference: 'USD 250 / 周',
      note: '低龄亲子或陪读安排需提前确认是否适用。',
    },
    {
      label: 'Guardian',
      lessons: '高中以下单独渡航',
      reference: 'USD 200 / 周',
      note: '官方费用页列高中生以下单独渡航时Guardian同房滞在。',
    },
    {
      label: 'Cebu新校区',
      lessons: '2025年7月开放',
      reference: '需另行核价',
      note: '官网首页写明Cebu Mactan新校区开放，本页主要按Iloilo官方费用页整理。',
    },
  ];

  readonly schedule: ScheduleItem[] = [
    { time: '08:00 - 11:50', title: '上午课程', text: '按课程安排一对一、小组课或考试科目，第一天通常有分级与说明。' },
    { time: '12:00 - 13:00', title: '午餐 / 休息', text: '餐食口径和是否含餐需按住宿、校区和当期安排确认。' },
    { time: '13:00 - 16:50', title: '下午课程', text: 'Regular、Junior和考试方向会继续安排小组课、写作或考试技巧训练。' },
    { time: '17:00 - 18:00', title: '晚餐 / 通勤', text: 'One Spatial Iloilo宿舍与校区分开，校车或接送安排需报名时确认。' },
    { time: '晚间', title: '自习 / 复习', text: '考试学生建议安排词汇、模考订正和写作复盘，顾问可协助做学习计划。' },
  ];

  readonly localFees: LocalFee[] = [
    { item: '入学金', amount: 'USD 100', note: '官方费用页列不包含在Program费用内，本页报价器已计入。' },
    { item: 'Iloilo机场接送', amount: '免费参考', note: '官方费用页列Iloilo机场往返免费，团体研修可能另算。' },
    { item: 'Kalibo机场接送', amount: 'PHP 2,500 / 单程', note: '按抵达机场和航班确认。' },
    { item: 'SSP', amount: 'PHP 7,000', note: '特别学习许可，金额以学校最新账单为准。' },
    { item: 'SSP I-Card', amount: 'PHP 4,000', note: '官方费用页列当地支付项目。' },
    { item: 'ACR I-Card', amount: 'PHP 4,000', note: '60天以上停留通常需要办理。' },
    { item: '设施管理费', amount: 'PHP 2,000 / 4周', note: '按周数累加，最终以学校账单为准。' },
    { item: '教材费', amount: 'PHP 300起 / 册', note: '按课程、等级和实际教材使用计算。' },
    { item: '学生证', amount: 'PHP 500', note: '到校后办理。' },
    { item: '综合管理费/光热费', amount: 'PHP 1,500起', note: '官方费用页写明依使用量。' },
    { item: '宿舍押金', amount: 'PHP 2,000', note: '遵守学校规则并无扣款时毕业返还。' },
    { item: '洗衣/清扫', amount: 'PHP 180 / 次；PHP 300 / 次', note: '外部洗衣和清扫服务按次计算。' },
  ];

  readonly serviceSteps: ProcessStep[] = [
    { icon: 'location_on', title: '先校正城市', text: '确认学生是否要GITC的Iloilo/Cebu路线，还是其实想找Clark学校。' },
    { icon: 'menu_book', title: '匹配课程', text: '按ESL、Power Speaking、Junior、TOEIC或IELTS目标选择课程强度。' },
    { icon: 'hotel', title: '确认住宿', text: '核对One Spatial Iloilo房型、校车、餐食、自炊、同行人和空房。' },
    { icon: 'payments', title: '拆清费用', text: '把Program主费、入学金、当地PHP费用、监护和额外课程分开列预算。' },
    { icon: 'description', title: '准备材料', text: '整理护照、保险、eTravel、接机资料、现金清单和未成年资料。' },
    { icon: 'support_agent', title: '到校跟进', text: '课程、宿舍、账单、考试或当地生活问题，顾问可继续协助沟通。' },
  ];

  readonly trustBadges = [
    { icon: 'verified_user', label: '城市资料先校正' },
    { icon: 'payments', label: '官方费用页整理' },
    { icon: 'school', label: '大学附属路线' },
    { icon: 'apartment', label: '深圳总部 + 菲律宾支持' },
  ];

  readonly schoolServices = [
    '1:1课程',
    '小组课',
    'Basic ESL',
    'Regular ESL',
    'Power Speaking',
    'Junior',
    'TOEIC / IELTS入门',
    'TOEIC / IELTS保证',
    '大学交流',
    'SDGs课程',
    'One Spatial宿舍',
    '校车通勤',
    '自习',
    '额外一对一',
  ];
  readonly campusActivities = ['大学交流', '文化交流', 'SDGs学习', '自习', '考试备考', '校内活动'];
  readonly weekendActivities = ['Iloilo Museum', 'Iloilo River', 'SM City Iloilo', '咖啡厅', '城市散步', 'Boracay延伸行程'];
  readonly notes = [
    'GITC公开资料显示校区在Iloilo，并有Cebu Mactan新校区；未找到GITC Clark校区资料，因此本页放在Iloilo而不是Clark。',
    '官方Program费用包含授课费、住宿费、车⇆学校移动费用、宿舍泳池和健身房使用费；入学金和当地费用另计。',
    'Junior、低龄、亲子和高中以下单独渡航涉及Guardian、Babysitter、房型和监护规则，不能只按成人ESL费用判断。',
    'TOEIC/IELTS保证课程需确认入学分数、目标分数、模考、出勤要求和未达标规则。',
    'Cebu新校区价格、住宿和活动可能采用不同资料，需另行确认。',
  ];

  readonly faqs: FaqItem[] = [
    {
      question: 'GITC College International Language Center是在Clark吗？',
      answer:
        '公开资料没有显示GITC在Clark运营。GITC官方学校概要列Iloilo校址和One Spatial Iloilo宿舍；官网首页另写明2025年7月开放Cebu Mactan新校区。因此本页按Iloilo学校整理。',
    },
    {
      question: '页面上的费用包含全部费用吗？',
      answer:
        '不包含全部。报价器主要估算Program主费和入学金；SSP、SSP I-Card、ACR、设施管理费、教材、光热、押金、洗衣、清扫和个人生活费另算。',
    },
    {
      question: 'GITC适合考试备考吗？',
      answer:
        '适合列入候选。官方费用页列TOEIC/IELTS入门和点数保证课程，但最终要按当前分数、目标分数、周数和保证班规则确认。',
    },
    {
      question: '如果我真的想选Clark学校，应该看什么？',
      answer:
        '可以优先比较CIP、EG、WE Academy、TALK Academy、HELP Clark和HANA Academy，再按外教比例、考试路线、住宿和亲子需求筛选。',
    },
  ];

  readonly sideNav: SideNavItem[] = [
    { label: '学校环境', target: 'gallery', icon: 'image' },
    { label: '课程与费用', target: 'course-fees', icon: 'menu_book' },
    { label: '费用快速报价', target: 'quote', icon: 'calculate' },
    { label: '特色费用', target: 'special-fees', icon: 'bolt' },
    { label: '当地费用', target: 'local-fees', icon: 'payments' },
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
    { label: 'GITC官方首页', url: 'https://gitc-jp.com/' },
    { label: 'GITC官方学校概要', url: 'https://gitc-jp.com/schooldetail/' },
    { label: 'GITC官方费用表', url: 'https://gitc-jp.com/cost/' },
    { label: 'TESDA Green International Technological College登记资料', url: 'https://www.tesda.gov.ph/Tvi/Result?currentFilter=English+Language&page=1' },
    { label: 'DEOW GITC College城市与4周参考', url: 'https://philippines-study.tw/features/one-on-one/' },
    { label: 'Fujiyama GITC复课与新校园资讯', url: 'https://www.fujiyama-international.com/blog/entry-3052.html' },
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

  get cityNote(): string {
    return '城市校正：GITC官方资料列Iloilo校址，并提到Cebu新校区；未找到Clark校区公开资料。';
  }

  formatUsd(amount: number): string {
    return amount.toLocaleString('en-US');
  }
}

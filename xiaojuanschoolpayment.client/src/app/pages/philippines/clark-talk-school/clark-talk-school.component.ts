import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

type GalleryCategory = '全部' | '校园' | '教室' | '住宿' | '餐厅' | '设施';
type WeekOption = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 12 | 24;

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

interface PriceMap {
  1?: number;
  2?: number;
  3?: number;
  4?: number;
  5?: number;
  6?: number;
  7?: number;
  8?: number;
  12?: number;
  24?: number;
}

interface RoomOption {
  id: string;
  name: string;
  shortName: string;
  note: string;
  prices: PriceMap;
}

interface CourseOption {
  id: string;
  name: string;
  type: string;
  lessons: string;
  suitable: string;
  tuition: PriceMap;
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
  selector: 'app-clark-talk-school',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './clark-talk-school.component.html',
  styleUrls: [
    '../cebu-school-detail-layout.css',
    '../cebu-school-detail-content.css',
    '../cebu-school-detail-responsive.css',
    '../ev-school/ev-school-detail.component.css',
    './clark-talk-school.component.css',
  ],
})
export class ClarkTalkSchoolComponent {
  readonly galleryCategories: GalleryCategory[] = [
    '全部',
    '校园',
    '教室',
    '住宿',
    '餐厅',
    '设施',
  ];
  readonly priceWeeksForTable: WeekOption[] = [1, 4, 8, 12];
  readonly weekOptions: WeekOption[] = [1, 2, 3, 4, 5, 6, 7, 8, 12, 24];
  readonly registrationFee = 100;
  readonly usdToCny = 7.2;

  selectedGalleryCategory: GalleryCategory = '全部';
  selectedCourseId = 'talk4';
  selectedRoomId = 'quad';
  selectedWeeks: WeekOption = 4;
  selectedStartDate = '2026-09-07';
  quoteCalculated = false;

  readonly quickInfo: QuickInfo[] = [
    {
      icon: 'location_on',
      label: '位置',
      value: 'Clark Freeport Zone',
      note: '官方页面写明位于Pampanga的Clark Freeport Zone，距离Clark机场约10分钟。',
    },
    {
      icon: 'record_voice_over',
      label: '课程重点',
      value: 'TALK4 / TALK6 / Hybrid',
      note: '官方列出13个项目，包含ESL、Hybrid、Senior、Golf、Business、Internship、Barista、TOEIC和IELTS。',
    },
    {
      icon: 'hotel',
      label: '住宿',
      value: '校内宿舍 / 单人至家庭房',
      note: '官方FAQ写明提供Single、Twin、Triple、Quad和Family房型；2026公开表另列3+1老师房。',
    },
    {
      icon: 'groups',
      label: '适合人群',
      value: '成人 / 熟龄 / 亲子 / 高尔夫',
      note: '适合想在Clark舒适环境里做一对一口语、实用英语、家庭游学或高尔夫英语组合的人。',
    },
    {
      icon: 'schedule',
      label: '课堂长度',
      value: '40分钟 / 节',
      note: '公开费用页列课程为40分钟一节，日程可从上午排到下午第10节。',
    },
    {
      icon: 'payments',
      label: '费用口径',
      value: '2026年9月后USD参考',
      note: '本页报价器按公开2026年9月1日起表格整理；8月31日前或优惠期需单独核价。',
    },
  ];

  readonly galleryImages: GalleryImage[] = [
    {
      category: '校园',
      title: 'TALK Academy Clark校舍外观',
      description:
        '官方主图展示Clark Freeport Zone内的校园与宿舍楼，适合先判断学校环境和抵达动线。',
      src: 'https://clarktalkacademy.com/assets/campus.jpg',
    },
    {
      category: '住宿',
      title: 'Dormitory房间参考',
      description:
        '官方图库展示宿舍空间，公开资料强调房内生活设施和宿舍舒适度。',
      src: 'https://clarktalkacademy.com/assets/blog/talk/dorm-room.jpg',
    },
    {
      category: '教室',
      title: '一对一课堂环境',
      description:
        'TALK课程以一对一为主，TALK4和TALK6按每日一对一节数区分学习强度。',
      src: 'https://clarktalkacademy.com/assets/blog/talk/class-1to1.jpg',
    },
    {
      category: '教室',
      title: 'Group Class参考',
      description:
        'Hybrid、TOEIC和IELTS方向会搭配团体课，正式报名需确认当期老师和课程开放。',
      src: 'https://clarktalkacademy.com/assets/blog/talk/class-group.jpg',
    },
    {
      category: '设施',
      title: 'Library / Study Lounge',
      description:
        '官方页面列出学习休息区、图书馆、餐厅和学生支持服务，适合长期学生使用。',
      src: 'https://clarktalkacademy.com/assets/blog/talk/library-books.jpg',
    },
    {
      category: '餐厅',
      title: 'Dining Hall与日常餐食',
      description:
        '2026年9月后的费用资料把餐食/清洁口径拆得更细，报价前要确认房型与餐食包含范围。',
      src: 'https://clarktalkacademy.com/assets/blog/talk/dining-hall.jpg',
    },
  ];

  readonly basicInfo: BasicInfoRow[] = [
    { label: '学校名称', value: '菲律宾克拉克TALK Academy' },
    { label: '英文名称', value: 'Talk Academy Clark / Clark Talk Academy' },
    { label: '城市', value: 'Clark Freeport Zone, Pampanga' },
    { label: '学校背景', value: '公开资料列2008年起源于Baguio，2023年在Clark重新开校；官方页面写明新校区2023年开放' },
    { label: '学校类型', value: '韩资、小规模、非斯巴达、实用英语与舒适住宿型' },
    { label: '学生容量', value: '公开资料列最大约65名' },
    { label: '最低年龄', value: '公开资料列7岁以上可上课；单独住宿、低龄儿童需另行确认' },
    { label: '主要课程', value: 'TALK4、TALK6、Hybrid A/J、Senior、Golf、Business、Internship、Barista、TOEIC、IELTS' },
    { label: '住宿房型', value: 'Single、Twin、Triple、Quad、Family；2026表另列3+1老师房和4人房' },
    { label: '本页费用口径', value: '按2026年9月1日后公开美元表整理；学校政策、优惠和房型空位会变动' },
  ];

  readonly highlights: Highlight[] = [
    {
      image: 'https://clarktalkacademy.com/assets/campus.jpg',
      title: 'Clark Freeport Zone生活便利',
      text: '官方强调机场、商场、医院、诊所和高尔夫资源都在较短车程内，适合重视抵达效率和生活舒适度的学生。',
    },
    {
      image: 'https://clarktalkacademy.com/assets/blog/talk/dorm-room.jpg',
      title: '住宿舒适度是核心卖点',
      text: '公开资料多次提到宿舍清洁、房内设施和校内住宿，适合亲子、成人长期和熟龄学生优先比较。',
    },
    {
      image: 'https://clarktalkacademy.com/assets/blog/talk/class-1to1.jpg',
      title: 'TALK4到TALK6按一对一强度选择',
      text: '想轻松打底可看TALK4，想提高输出密度可看TALK6；Hybrid、考试和商务方向需确认当期师资。',
    },
  ];

  readonly suitableFor: FitItem[] = [
    {
      title: '想要Clark舒适环境和机场便利',
      text: 'Clark机场、SM City Clark、医院和高尔夫资源离校区较近，适合短期、家庭和不想长途转车的人。',
    },
    {
      title: '想用一对一课稳定提升口语',
      text: 'TALK4、TALK6和Senior都偏一对一实用英语，适合基础到中阶学生按节数增加强度。',
    },
    {
      title: '亲子、熟龄或高尔夫英语',
      text: '学校公开列Family房型、Senior、Golf和多种实践课程，适合不只追求考试分数的人。',
    },
    {
      title: '希望小规模学校更容易照顾',
      text: '公开资料列最大65名，整体更像小规模舒适型学校，适合偏好安静和沟通效率的人。',
    },
  ];

  readonly notSuitableFor: FitItem[] = [
    {
      title: '只想强斯巴达备考冲刺',
      text: 'TALK整体更偏实用英语和舒适环境，若目标是高压雅思/多益冲刺，建议同步比较碧瑶或Clark考试型学校。',
    },
    {
      title: '只按最低价选校',
      text: '2026年9月后费用需拆课程、房型、注册费、接机和当地费用；Clark生活成本也不一定比其他城市低。',
    },
    {
      title: '需要明确Native课保证',
      text: '官方有Hybrid方向，但第三方资料曾提醒Native师资状态会变动，报名时必须确认当前课程是否开放。',
    },
  ];

  readonly roomOptions: RoomOption[] = [
    {
      id: 'single',
      name: '1人房（食事なし）',
      shortName: '1人房',
      note: '适合成人单独住宿；餐食、清洁和床单规则需按当期表确认。',
      prices: { 1: 427.5, 2: 617.5, 3: 807.5, 4: 950, 5: 1187.5, 6: 1425, 7: 1662.5, 8: 1900, 12: 2850, 24: 5700 },
    },
    {
      id: 'double',
      name: '2人房',
      shortName: '2人房',
      note: '适合朋友、家人或愿意合住的成人学生，需按性别和空房确认。',
      prices: { 1: 450, 2: 650, 3: 850, 4: 1000, 5: 1250, 6: 1500, 7: 1750, 8: 2000, 12: 3000, 24: 6000 },
    },
    {
      id: 'three-plus-teacher',
      name: '3人+1老师房',
      shortName: '3+1房',
      note: '2026年9月后公开表列出的预算型房型之一，1周是否开放需确认。',
      prices: { 2: 487.5, 3: 637.5, 4: 750, 5: 937.5, 6: 1125, 7: 1312.5, 8: 1500, 12: 2250, 24: 4500 },
    },
    {
      id: 'quad',
      name: '4人房',
      shortName: '4人房',
      note: '4周费用最低的公开房型口径，实际空房、性别和年龄限制需确认。',
      prices: { 1: 270, 2: 390, 3: 510, 4: 600, 5: 750, 6: 900, 7: 1050, 8: 1200, 12: 1800, 24: 3600 },
    },
    {
      id: 'family-two',
      name: '2人家庭房',
      shortName: '2人家庭',
      note: '适合家长同行、夫妻或亲子组合，需按年龄和床型确认。',
      prices: { 1: 855, 2: 1235, 3: 1615, 4: 1900, 5: 2375, 6: 2850, 7: 3325, 8: 3800, 12: 5700, 24: 11400 },
    },
  ];

  readonly courseOptions: CourseOption[] = [
    {
      id: 'talk4',
      name: 'TALK4',
      type: '标准ESL',
      lessons: '1:1四节',
      suitable: '适合第一次Clark游学、基础口语、轻中强度学习和亲子家长。',
      tuition: { 1: 170, 2: 340, 3: 510, 4: 680, 5: 850, 6: 1020, 7: 1190, 8: 1360, 12: 2040, 24: 4080 },
      note: '2026公开表列4周授课费USD680，房费另加。',
    },
    {
      id: 'talk6',
      name: 'TALK6',
      type: '一对一强化',
      lessons: '1:1六节',
      suitable: '适合想增加输出密度，重点补写作、词汇、听力和口语的人。',
      tuition: { 1: 255, 2: 510, 3: 765, 4: 1020, 5: 1275, 6: 1530, 7: 1785, 8: 2040, 12: 3060, 24: 6120 },
      note: '课程密度高于TALK4，短期提升更明显。',
    },
    {
      id: 'talk4-hybrid',
      name: 'TALK4 Hybrid A/J',
      type: 'Hybrid',
      lessons: '1:1四节 + Group两节',
      suitable: '适合想兼顾一对一和小组互动、发音或文法细节的学生。',
      tuition: { 2: 425, 3: 637.5, 4: 850, 5: 1062.5, 6: 1275, 7: 1487.5, 8: 1700, 12: 2550, 24: 5100 },
      note: '1周未列公开价格，Hybrid课程需确认师资和开课状态。',
    },
    {
      id: 'talk6-hybrid',
      name: 'TALK6 Hybrid A/J',
      type: '高强度Hybrid',
      lessons: '1:1六节 + Group两节',
      suitable: '适合想把一对一强度和互动课同时拉高的学生。',
      tuition: { 2: 595, 3: 892.5, 4: 1190, 5: 1487.5, 6: 1785, 7: 2082.5, 8: 2380, 12: 3570, 24: 7140 },
      note: '公开表未列1周价格，需确认能否短期报名。',
    },
    {
      id: 'senior',
      name: 'TALK SENIOR',
      type: '熟龄/旅行英语',
      lessons: '1:1四节',
      suitable: '适合熟龄学习者、旅游英语、日常场景表达和轻压力学习。',
      tuition: { 1: 180, 2: 360, 3: 540, 4: 720, 5: 900, 6: 1080, 7: 1260, 8: 1440, 12: 2160, 24: 4320 },
      note: '公开说明写明7岁以上均可报名，但实际适配要看年龄和目标。',
    },
    {
      id: 'business',
      name: 'BUSINESS',
      type: '商务英语',
      lessons: '1:1六节',
      suitable: '适合工作、面试、邮件、会议、简报和海外职场准备。',
      tuition: { 1: 255, 2: 510, 3: 765, 4: 1020, 5: 1275, 6: 1530, 7: 1785, 8: 2040, 12: 3060, 24: 6120 },
      note: '商务课程需按程度、教材和目标确认。',
    },
    {
      id: 'toeic',
      name: 'TOEIC',
      type: '多益',
      lessons: '1:1六节 + Group一节',
      suitable: '适合需要TOEIC提分、求职或升学英语证明的人。',
      tuition: { 1: 305, 2: 610, 3: 915, 4: 1220, 5: 1525, 6: 1830, 7: 2135, 8: 2440, 12: 3660, 24: 7320 },
      note: '考试方向需确认模考、教材、开课日和入学程度。',
    },
    {
      id: 'ielts',
      name: 'IELTS',
      type: '雅思',
      lessons: '1:1六节 + Group一节',
      suitable: '适合雅思基础备考、四科弱项补强和需要小规模照顾的学生。',
      tuition: { 2: 660, 3: 990, 4: 1320, 5: 1650, 6: 1980, 7: 2310, 8: 2640, 12: 3960, 24: 7920 },
      note: '公开表未列1周价格，考试目标需先评估当前分数。',
    },
  ];

  readonly specialFees: SpecialCourseFee[] = [
    {
      label: 'TALK GOLF',
      lessons: '1:1两节 + 高尔夫',
      reference: '授课费4周USD340 + 房费',
      note: '官方页面另列高尔夫课程、练习场和球具租赁参考，需按教练、场地和时段确认。',
    },
    {
      label: 'TALK INTERNSHIP',
      lessons: '5节1:1 + 3小时OJT',
      reference: '8周授课费USD2,650 + 房费',
      note: '适合酒店/HRM相关实践，报名前要确认OJT安排、英语程度和年龄规则。',
    },
    {
      label: 'BARISTA',
      lessons: '5节1:1 + 3小时OJT',
      reference: '8周授课费USD2,900 + 房费',
      note: '咖啡实作与英语结合，需确认当期合作点位、材料费和开课条件。',
    },
    {
      label: 'Low Season Promo',
      lessons: '4周以上 + 学校宿舍',
      reference: '需当期确认',
      note: '公开页面列有低旺季促销，但有效期、折扣金额和条件会变化，不直接写入报价器。',
    },
  ];

  readonly schedule: ScheduleItem[] = [
    { time: '07:15 - 08:00', title: '早餐', text: '官方日程列早餐时段；餐食口径需按房型和2026费用规则确认。' },
    { time: '08:50 - 12:00', title: '上午课程', text: 'Class 1-4，可安排一对一、Hybrid小组或考试课程内容。' },
    { time: '12:00 - 13:00', title: '午餐', text: '午餐后进入下午课程，亲子和未成年学生需按学校规则行动。' },
    { time: '13:00 - 15:20', title: '下午前段', text: 'Class 5-7，TALK6和考试课程通常会使用更多下午时段。' },
    { time: '15:30 - 17:50', title: '下午后段', text: 'Class 8-10，实际节数取决于TALK4、TALK6、Hybrid、TOEIC或IELTS。' },
    { time: '17:50 - 18:50', title: '晚餐 / 复习', text: '下课后可复习、休息或安排校内活动，外出规则报名时确认。' },
  ];

  readonly localFees: LocalFee[] = [
    { item: '注册费', amount: 'USD 100', note: '2026公开表列出发前费用，本页报价器已计入。' },
    { item: '机场接机', amount: 'Clark PHP1,000；Manila PHP5,500-7,000', note: '按机场、个人/家庭、抵达日和航班时间确认。' },
    { item: 'SSP申请费', amount: 'PHP 7,800', note: '到校当地费用，金额可能随政策调整。' },
    { item: '签证延长', amount: '5-8周PHP5,130起', note: '31天以上停留需办理，长周数费用逐段增加。' },
    { item: 'ACR I-Card', amount: 'PHP 4,500', note: '59天以上停留通常需要办理。' },
    { item: '宿舍管理费&光热费', amount: 'PHP 4,000-5,500 / 4周参考', note: '按房型和周数不同而变动，2026表列每人计费。' },
    { item: '押金', amount: 'PHP 5,000-10,000', note: '退房时扣除教材/损坏等费用后按学校规则退还。' },
    { item: '学生证', amount: 'PHP 500', note: '到校办理。' },
    { item: '餐食选项', amount: 'PHP 10,000-15,000 / 4周参考', note: '公开表列1人房平日1餐或3餐选项；其他房型和9月后口径需确认。' },
  ];

  readonly serviceSteps: ProcessStep[] = [
    { icon: 'person_search', title: '先判断是否适合Clark', text: '比较TALK、CIP、EG、WE和HELP，先看学习目标、住宿偏好、外教需求和机场动线。' },
    { icon: 'menu_book', title: '确认课程强度', text: '按TALK4、TALK6、Hybrid、Senior、Golf、Business或考试方向确认每日课表。' },
    { icon: 'hotel', title: '锁定房型空位', text: '2026年9月后房型口径变化较多，需先确认单人、双人、3+1、4人或家庭房是否可订。' },
    { icon: 'payments', title: '拆清主费和当地费', text: '把授课费、房费、注册费、接机、SSP、签证、押金、水电管理费和餐食分开列预算。' },
    { icon: 'description', title: '准备报名和入境资料', text: '协助整理护照、保险、eTravel、航班接机、现金清单和未成年/亲子资料。' },
    { icon: 'support_agent', title: '到校后继续协助', text: '课程、宿舍、账单、当地费用或生活问题，顾问可继续协助和学校沟通。' },
  ];

  readonly trustBadges = [
    { icon: 'verified_user', label: '官方课程资料复核' },
    { icon: 'payments', label: '2026公开费用整理' },
    { icon: 'hotel', label: '房型与餐食分开确认' },
    { icon: 'apartment', label: '深圳总部 + 菲律宾支持' },
  ];

  readonly schoolServices = [
    '一对一课程',
    '小组课程',
    'TALK4 / TALK6',
    'Hybrid A/J',
    'Senior',
    'Golf',
    'Business',
    'Internship',
    'Barista',
    'TOEIC',
    'IELTS',
    '校内宿舍',
    'Family房',
    'Dining Hall',
    'Library',
    'Study Lounge',
  ];
  readonly campusActivities = [
    '分级测试',
    '一对一复习',
    '自习室',
    '校内交流',
    '毕业式',
    '高尔夫练习',
  ];
  readonly weekendActivities = [
    'SM City Clark',
    'Clark机场周边',
    '高尔夫球场',
    '咖啡厅和餐厅',
    '医疗诊所',
    '周边短途活动',
  ];
  readonly notes = [
    '本页报价器按公开2026年9月1日后美元费用表整理，8月31日前、促销期或学校更新价目时需重新核对。',
    '公开表把授课费和房费拆开；注册费、接机和到校PHP当地费用另计。',
    'Hybrid、IELTS等部分课程未列1周价格，短期报名需先确认是否开放。',
    '官方官网写明TALK4、TALK6、Hybrid、Senior、Golf、Business、Internship、Barista、TOEIC、IELTS等项目；具体老师、分班和开课日以学校回函为准。',
    '亲子、未成年、家庭房和Golf/OJT课程涉及年龄、监护、保险、空位和活动规则，不能只按成人ESL报价判断。',
  ];

  readonly faqs: FaqItem[] = [
    {
      question: '菲律宾克拉克TALK Academy适合什么学生？',
      answer:
        '适合想在Clark舒适环境里学一对一英语、熟龄日常英语、亲子游学、高尔夫英语或实用商务英语的人。若目标是强制自习和考试冲刺，需要同步比较HELP、CIP或碧瑶学校。',
    },
    {
      question: '页面上的费用包含全部费用吗？',
      answer:
        '不包含全部。报价器估算2026年9月后公开授课费+房费+注册费；SSP、签证、ACR、押金、宿舍管理费、光热费、餐食选项、接机和个人生活费另算。',
    },
    {
      question: 'TALK4和TALK6怎么选？',
      answer:
        'TALK4是一对一4节，适合基础打底和轻中强度；TALK6是一对一6节，适合想短期增加输出密度的人。基础弱或亲子家长可先从TALK4/Senior看起。',
    },
    {
      question: 'Hybrid、TOEIC、IELTS都能报名吗？',
      answer:
        '可以放入候选，但要先确认当期开课、老师、程度要求和短期是否接受。公开表里Hybrid和IELTS未列1周价格，短期报名尤其要核实。',
    },
    {
      question: '为什么TALK页面强调费用确认？',
      answer:
        '因为2026年9月后公开资料显示房型、餐食、管理费和当地费用有新口径；同时促销、空房和课程开放会变动，正式报价必须由学校确认。',
    },
  ];

  readonly sideNav: SideNavItem[] = [
    { label: '学校环境', target: 'gallery', icon: 'image' },
    { label: '课程与费用', target: 'course-fees', icon: 'menu_book' },
    { label: '费用快速报价', target: 'quote', icon: 'calculate' },
    { label: '特色课程', target: 'special-fees', icon: 'golf_course' },
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
    { label: 'TALK Academy Clark官方网站', url: 'https://clarktalkacademy.com/' },
    { label: 'TALK Academy中文官方页面', url: 'https://clarktalkacademy.com/tw/' },
    { label: '菲律宾留学中心TALK Academy 2026费用表', url: 'https://www.ph-ryugaku.com/school/clark-talk-academy/' },
    { label: 'Matching English Clark Talk Academy学校资料', url: 'https://matchingenglish.com/ph/clark-talk-academy' },
    { label: '菲律宾留学中心最新学校介绍PDF', url: 'https://www.ph-ryugaku.com/school/clark-talk-academy/' },
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
    const room = this.roomOptions.find((item) => item.id === roomId);
    const tuition = course?.tuition[weeks];
    const roomFee = room?.prices[weeks];

    if (tuition === undefined || roomFee === undefined) {
      return 0;
    }

    return tuition + roomFee;
  }

  formatFee(courseId: string, roomId: string, weeks: WeekOption): string {
    const amount = this.feeFor(courseId, roomId, weeks);

    return amount > 0 ? `USD ${this.formatUsd(amount)}` : '需确认';
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

  get hasSelectedFee(): boolean {
    return this.selectedPackageFee > 0;
  }

  get quoteUsd(): number {
    return this.hasSelectedFee ? this.registrationFee + this.selectedPackageFee : 0;
  }

  get packageFeeText(): string {
    return this.hasSelectedFee ? `USD ${this.formatUsd(this.selectedPackageFee)} 起` : '需确认';
  }

  get quoteUsdText(): string {
    return this.quoteUsd > 0 ? `USD ${this.formatUsd(this.quoteUsd)} 起` : '需确认';
  }

  get quoteCnyText(): string {
    if (this.quoteUsd <= 0) {
      return '汇率与课程开放需确认';
    }

    const rounded = Math.round((this.quoteUsd * this.usdToCny) / 100) * 100;

    return `约 ${rounded.toLocaleString('zh-CN')} 元起`;
  }

  get seasonalNote(): string {
    const start = new Date(`${this.selectedStartDate}T00:00:00`);

    if (Number.isNaN(start.getTime())) {
      return '入学日期需要和学校确认，适用价格、促销、房型空位和当地费用会影响最终报价。';
    }

    const newPriceStart = new Date('2026-09-01T00:00:00');

    if (start < newPriceStart) {
      return '当前日期早于2026年9月1日，公开页面另有8月31日前费用口径和促销，需由顾问单独核价。';
    }

    return this.selectedWeeks >= 12
      ? '当前选择为12周以上，需确认长期签证、ACR、房型、餐食、管理费和促销是否适用。'
      : '当前选择按2026年9月后公开表估算，正式报名仍需确认课程开放、房型空位、餐食和到校PHP费用。';
  }

  formatUsd(amount: number): string {
    return amount.toLocaleString('en-US', {
      maximumFractionDigits: amount % 1 === 0 ? 0 : 1,
    });
  }
}

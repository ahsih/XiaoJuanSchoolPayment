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
  note: string;
}

interface CourseOption {
  id: string;
  name: string;
  type: string;
  lessons: string;
  suitable: string;
  fourWeekFees: Record<string, number>;
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

interface SidaReason {
  number: string;
  title: string;
  text: string;
  image: string;
  alt: string;
}

interface SidaTrustBadge {
  icon: string;
  label: string;
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
  selector: 'app-cij-premium-school',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './cij-premium-school.component.html',
  styleUrls: [
    '../cebu-school-detail-layout.css',
    '../cebu-school-detail-content.css',
    '../cebu-school-detail-responsive.css',
    '../ev-school/ev-school-detail.component.css',
    './cij-premium-school.component.css',
  ],
})
export class CijPremiumSchoolComponent {
  readonly galleryCategories: GalleryCategory[] = [
    '全部',
    '校园',
    '教室',
    '住宿',
    '餐厅',
    '设施',
  ];
  selectedGalleryCategory: GalleryCategory = '全部';

  readonly registrationFee = 150;
  readonly usdToCny = 7.2;
  readonly weekOptions: WeekOption[] = [1, 2, 3, 4, 8, 12];

  selectedCourseId = 'esl4';
  selectedRoomId = 'quad';
  selectedWeeks: WeekOption = 4;
  selectedStartDate = '2026-09-07';
  quoteCalculated = false;

  readonly quickInfo: QuickInfo[] = [
    {
      icon: 'apartment',
      label: '学校类型',
      value: 'Premium舒适型口语学校',
      note: '公开资料定位为宿务市区Premium校区，强调1:1口语、住宿设施和多国籍环境',
    },
    {
      icon: 'record_voice_over',
      label: '课程重点',
      value: 'ESL / Speaking / Native / Business / TOEIC',
      note: 'ESL4、Premium、Basic Speaking、Power Speaking、Native、Business和TOEIC方向可比较',
    },
    {
      icon: 'groups',
      label: '学生容量',
      value: '约100名学生参考',
      note: '公开资料列1:1教室55间、1:4教室5间、1:8教室6间，适合小中型校区',
    },
    {
      icon: 'bed',
      label: '住宿房型',
      value: 'Superior / Premium / 2-4人房',
      note: '旧版公开费用表按Superior单人、Premium单人、双人、三人、四人房区分',
    },
    {
      icon: 'location_on',
      label: '位置提醒',
      value: 'Mabolo / Kasambagan资料口径',
      note: '近年CIJ资料也出现Liloan与Premium Dormitory口径，正式报名需向学校确认',
    },
    {
      icon: 'pool',
      label: '设施特色',
      value: '泳池 / 健身房 / 桑拿 / 厨房 / 洗衣',
      note: 'Premium资料强调宿舍设施、泳池、健身房、桑拿、舞蹈厅和桌球等生活配置',
    },
  ];

  readonly galleryImages: GalleryImage[] = [
    {
      category: '设施',
      title: 'CIJ Premium公共大厅',
      description:
        '宽敞大厅可用于用餐、说明会、自习或团体活动，是Premium Campus常见公共空间画面。',
      src: 'https://cebu-cij.com/english/wp-content/uploads/sites/7/2019/05/PREMIUM-8.jpg',
    },
    {
      category: '住宿',
      title: 'CIJ外部宿舍双床房参考',
      description:
        '公开近年宿舍资料显示CIJ有酒店式外部宿舍房型，实际使用校区与房型需按当期确认。',
      src: 'https://www.fujiyama-international.com/archives/006/202410/a9ae42074be0473b.jpg',
    },
    {
      category: '住宿',
      title: 'CIJ Weber Hotel宿舍参考',
      description:
        '近年公开资料中常见Weber Hotel / Premium Dormitory口径，适合重视住宿舒适度的学生。',
      src: 'https://www.philja.com/data/editor/2504/120b765c36358fc5ea0fdc020500ce1c_1745805738_1734.jpg',
    },
    {
      category: '住宿',
      title: 'CIJ单人房参考',
      description:
        '单人房适合想要安静自习和较高隐私的成人学生，热门档期需要提前查空位。',
      src: 'https://storage.googleapis.com/world-study-prod/media/school_photo/813/ca44aa0e-38f2-46c2-bdb9-ecc8f4604385.jpg',
    },
    {
      category: '设施',
      title: 'Premium住宿与生活空间',
      description:
        'Premium公开资料强调住宿设施、洗衣、厨房、泳池、健身房和桑拿等舒适配置。',
      src: 'https://cebu-cij.com/english/wp-content/uploads/sites/7/2019/05/PREMIUM-3.jpg',
    },
    {
      category: '教室',
      title: 'CIJ一对一学习环境',
      description:
        'CIJ课程以一对一教学为核心，搭配小组、Native、词汇和商务/TOEIC课程。',
      src: 'https://cebu-cij.com/english/wp-content/uploads/sites/7/2019/05/PREMIUM-2.jpg',
    },
    {
      category: '校园',
      title: 'CIJ Academy学习生活环境',
      description:
        'CIJ公开资料强调多国籍学生共同学习生活，在日常环境中增加英语使用机会。',
      src: 'https://cebu-cij.com/english/wp-content/uploads/sites/7/2019/05/PREMIUM-1.jpg',
    },
  ];

  readonly basicInfo: BasicInfoRow[] = [
    { label: '学校名称', value: '菲律宾宿务CIJ Academy（Premium Campus）' },
    { label: '英文名称', value: 'CIJ Academy & School Premium Campus' },
    {
      label: '地址口径',
      value: '旧版Premium资料：Tancor1 Residential Suites, Abad Santos St., Villa Aurora Village, Kasambagan, Cebu City；近年资料需再次确认',
    },
    { label: '学校定位', value: '宿务Premium舒适型英语学校，强调1:1口语、Native课程、商务与TOEIC方向' },
    { label: '学生规模', value: '公开Premium资料列容量约100名，教师约54名菲律宾教师 + 3名Native教师参考' },
    { label: '课程方向', value: 'ESL4、Premium、Basic Speaking、Power Speaking、Power Native、Intensive Native、Basic Business、Power TOEIC' },
    { label: '住宿房型', value: 'Superior单人、Premium单人、2人房、3人房、4人房；近年外部宿舍/Weber Hotel口径需确认' },
    { label: '4周起价', value: 'USD 1,300起：ESL4 + 4人房 + 注册费' },
  ];

  readonly highlights: Highlight[] = [
    {
      image:
        'https://cebu-cij.com/english/wp-content/uploads/sites/7/2019/05/PREMIUM-8.jpg',
      title: 'Premium舒适型定位',
      text: '公开资料强调宿舍设施、泳池、健身房、桑拿、厨房和洗衣配置，适合重视生活品质的学生。',
    },
    {
      image:
        'https://cebu-cij.com/english/wp-content/uploads/sites/7/2019/05/PREMIUM-2.jpg',
      title: '一对一课程比例高',
      text: 'ESL4主打每日4小时一对一，Premium和Power Speaking可增加一对一、Native和词汇训练。',
    },
    {
      image:
        'https://www.fujiyama-international.com/archives/006/202410/a9ae42074be0473b.jpg',
      title: '成人与社会人友好',
      text: '市区/酒店式住宿口径更适合想要舒适环境、兼顾自学和课后生活的成人学生。',
    },
    {
      image:
        'https://storage.googleapis.com/world-study-prod/media/school_photo/813/ca44aa0e-38f2-46c2-bdb9-ecc8f4604385.jpg',
      title: '多课程可横向比较',
      text: '口语、Native、商务和TOEIC路线都在公开课程体系中，方便按目标筛选。',
    },
  ];

  readonly suitableFor: FitItem[] = [
    {
      title: '想要舒适住宿和口语课量',
      text: 'Premium Campus适合想把住宿、生活设施和1:1口语课量一起看的学生。',
    },
    {
      title: '初中级成人口语提升',
      text: 'ESL4、Premium、Basic Speaking和Power Speaking都适合想补基础、纠音和提升表达的人。',
    },
    {
      title: '想加入Native或商务元素',
      text: 'Power Native、Intensive Native、Basic Business和Power TOEIC适合更明确的升学、工作或考试目标。',
    },
    {
      title: '希望半自由而不是高压斯巴达',
      text: 'Premium公开资料列平日与周末可外出但有限制，适合比斯巴达更自由的学习节奏。',
    },
  ];

  readonly notSuitableFor: FitItem[] = [
    {
      title: '完全不能接受资料口径变化',
      text: 'CIJ公开资料中Premium Campus、Premium Dormitory、Liloan和Mabolo/Kasambagan存在不同年份口径，报名必须核对最新校区。',
    },
    {
      title: '目标是强制高压备考',
      text: 'Premium更偏舒适与口语沟通；如果要严格管理，可比较CG斯巴达校区、EV、SMEAG或CIJ Sparta/Liloan路线。',
    },
    {
      title: '只看最低公开价',
      text: '公开费用表之外，注册费、SSP、签证、押金、教材、管理费、水电和接机都要另算。',
    },
    {
      title: '指定热门单人房且临时报名',
      text: 'Superior/Premium单人房和外部宿舍房型需要按性别、日期和空房实时确认。',
    },
  ];

  readonly roomOptions: RoomOption[] = [
    { id: 'quad', name: '4人房', note: '公开Premium费用表最低房型，适合控制预算。' },
    { id: 'triple', name: '3人房', note: '比4人房更舒适，费用仍相对可控。' },
    { id: 'double', name: '2人房', note: '预算与隐私较平衡。' },
    { id: 'premium-single', name: 'Premium单人房', note: '独立空间更好，正式空房需按日期确认。' },
    { id: 'superior-single', name: 'Superior单人房', note: '公开表最高房型，适合重视舒适度的人。' },
  ];

  readonly courseOptions: CourseOption[] = [
    {
      id: 'esl4',
      name: 'ESL 4',
      type: '基础一对一ESL',
      lessons: '1:1四节，Reading / Writing / Speaking / Grammar / Listening',
      suitable: '适合不想上太多团体课、先用一对一打基础的学生。',
      fourWeekFees: { quad: 1150, triple: 1250, double: 1350, 'premium-single': 1650, 'superior-single': 1850 },
    },
    {
      id: 'basic-speaking',
      name: 'Basic Speaking',
      type: '基础口语',
      lessons: '1:1四节 + 1:4小组两节 + 1:8 Native大班一节',
      suitable: '适合初级学生从基础会话、发表和发音开始提升。',
      fourWeekFees: { quad: 1500, triple: 1600, double: 1700, 'premium-single': 2000, 'superior-single': 2200 },
    },
    {
      id: 'premium',
      name: 'Premium Course',
      type: '综合强化',
      lessons: '1:1七节 + Vocabulary一节',
      suitable: '适合想把一对一课量拉高、集中补听说读写弱项的人。',
      fourWeekFees: { quad: 1500, triple: 1600, double: 1700, 'premium-single': 2000, 'superior-single': 2200 },
    },
    {
      id: 'power-speaking',
      name: 'Power Speaking',
      type: '口语强化',
      lessons: '1:1六节 + Native大班一节 + Vocabulary一节',
      suitable: '适合想明显增加开口、发音和表达反馈的人。',
      fourWeekFees: { quad: 1500, triple: 1600, double: 1700, 'premium-single': 2000, 'superior-single': 2200 },
    },
    {
      id: 'basic-business',
      name: 'Basic Business',
      type: '商务英语',
      lessons: '商务1:1四节 + ESL 1:1一节 + Business/Native小组',
      suitable: '适合英文履历、面试、商务邮件、会议和演示方向。',
      fourWeekFees: { quad: 1500, triple: 1600, double: 1700, 'premium-single': 2000, 'superior-single': 2200 },
    },
    {
      id: 'intensive-native',
      name: 'Intensive Native',
      type: 'Native强化',
      lessons: 'ESL 1:1五节 + Native小组两节 + Vocabulary一节',
      suitable: '适合中高阶学生、准备留学或工作假期前强化Native沟通。',
      fourWeekFees: { quad: 1620, triple: 1720, double: 1820, 'premium-single': 2120, 'superior-single': 2320 },
    },
  ];

  readonly specialFees: SpecialCourseFee[] = [
    { label: 'Power Native', lessons: 'ESL 1:1五节 + Native小组两节 + 词汇课', four: 'USD 1,500起 / 4周4人房', note: '适合需要外师发音、听力和沟通经验的人' },
    { label: 'Power TOEIC Bridge', lessons: 'ESL 1:1二节 + TOEIC 1:1四节 + Native小组一节', four: 'USD 1,500起 / 4周4人房', note: '适合TOEIC入门与一般英语同步提升' },
    { label: 'Power TOEIC Guarantee', lessons: 'TOEIC 1:1为主 + Native/词汇训练', four: 'USD 1,620起 / 4周4人房', note: '保证班规则、入学门槛和考试安排需单独确认' },
    { label: '追加课程', lessons: '1:1 / 菲籍团体 / 外师团体 / 外师1:1', four: 'USD 150-320 / 4周', note: '公开表列可加课，实际开放状况以学校确认为准' },
  ];

  readonly schedule: ScheduleItem[] = [
    {
      time: '07:00 - 07:50',
      title: '早餐 / 课前准备',
      text: 'Premium公开课表以三餐住校为基础，实际餐食和时段以学校到校说明为准。',
    },
    {
      time: '08:00 - 12:30',
      title: '上午1:1 / 小组 / Native课',
      text: '按课程进入一对一、基础口语、商务、TOEIC或Native课程。',
    },
    {
      time: '12:30 - 13:30',
      title: '午餐',
      text: '校内用餐，学生也可按校规安排课后外出和周边生活。',
    },
    {
      time: '13:30 - 16:10',
      title: '下午课程 / 词汇课',
      text: 'Premium、Power Speaking、Native和TOEIC课程会使用不同的一对一与团体课组合。',
    },
    {
      time: '16:15 - 18:00',
      title: '空堂 / 特别课 / 自习',
      text: '公开资料提到晚间Special Class和Saturday Special Class，需按当期安排确认。',
    },
    {
      time: '18:00 - 19:00',
      title: '晚餐 / 课后生活',
      text: '公开资料列门禁与外出限制；具体校规、外宿和门禁以当期学生手册为准。',
    },
  ];

  readonly localFees: LocalFee[] = [
    { item: '注册费', amount: 'USD 150', note: '公开规则列为不退还入学费，通常出发前支付' },
    { item: 'SSP', amount: 'PHP 6,800', note: 'Special Study Permit，所有学习周期需确认' },
    { item: '签证延长', amount: 'PHP 4,130起', note: '8周起通常需第一次延签，12周另加第二次延签' },
    { item: 'ACR I-Card', amount: 'PHP 3,500', note: '公开资料列停留超过8周需办理参考' },
    { item: '宿舍押金', amount: 'PHP 4,000-14,000', note: '按周数递增，离校扣除教材、水电等后退还余额' },
    { item: '管理费', amount: 'PHP 1,200 / 4周', note: '按人计算参考' },
    { item: '教材费', amount: '约PHP 2,000 / 4周', note: '按课程、级别和实际用书调整' },
    { item: '学生ID', amount: 'PHP 250', note: '学生证费用参考' },
    { item: '电费/水费', amount: '按实际使用', note: '公开资料列从押金中扣除' },
    { item: '接机费', amount: '定期接机免费 / 其他日期PHP 1,000', note: '近年规则可能调整，需按到达日确认' },
    { item: '换校区费', amount: 'PHP 1,000 / 次', note: '旧公开表列校区转换费用，且通常仅周日转换' },
    { item: '名称/校区核对', amount: '需确认', note: 'CIEC、CIJ、Premium Dormitory等口径需报名时核实' },
  ];

  readonly serviceSteps: ProcessStep[] = [
    {
      icon: 'person_search',
      title: '先核对学校名称和校区',
      text: '确认是CIJ Academy Premium Campus、Premium Dormitory还是CIEC Global相关项目。',
    },
    {
      icon: 'school',
      title: '匹配课程路线',
      text: '根据口语、Native、商务、TOEIC或轻量ESL目标选择合适课程。',
    },
    {
      icon: 'bed',
      title: '确认房型和住宿口径',
      text: '核对Superior/Premium单人、多人房、外部宿舍和实际入住地址。',
    },
    {
      icon: 'payments',
      title: '拆清前期与到校费用',
      text: '把课程住宿、注册费、SSP、签证、押金、水电、教材和接机逐项列清。',
    },
    {
      icon: 'assignment_turned_in',
      title: '准备出发资料',
      text: '协助整理护照、保险、eTravel、现金、接机和到校注意事项。',
    },
    {
      icon: 'support_agent',
      title: '到校后继续跟进',
      text: '课程、宿舍、校规或账单沟通问题，都可以继续联系顾问协助。',
    },
  ];

  readonly sidaReasons: SidaReason[] = [
    {
      number: '01',
      title: '先把CIJ / CIEC名称核清',
      text: '公开资料有不同域名与校区口径，顾问会先向学校确认当前招生名称、校区和住宿。',
      image: 'assets/cia/sida-why-action-selection.jpg',
      alt: '思达启航顾问帮助学生选择菲律宾宿务语言学校',
    },
    {
      number: '02',
      title: '课程和房型逐项核价',
      text: 'ESL4、Premium、Speaking、Native、Business、TOEIC和不同房型费用差异明显。',
      image: 'assets/cia/sida-why-action-fees.jpg',
      alt: '思达启航顾问核算菲律宾语言学校费用',
    },
    {
      number: '03',
      title: '当地费用提前说清楚',
      text: 'SSP、签证、押金、教材、水电、管理费和接机不能只看套餐价。',
      image: 'assets/cia/sida-why-action-contract.jpg',
      alt: '思达启航顾问核验菲律宾游学课程和合同文件',
    },
    {
      number: '04',
      title: '行前清单更完整',
      text: '接机、现金、保险、入境文件、住宿用品和到校费用会提前整理给学生。',
      image: 'assets/cia/sida-why-action-departure.jpg',
      alt: '菲律宾游学出发前文件和行李准备',
    },
    {
      number: '05',
      title: '学习中仍可继续沟通',
      text: '遇到课程、老师、住宿或账单疑问时，可让顾问帮忙梳理沟通重点。',
      image: 'assets/cia/sida-why-action-followup.jpg',
      alt: '思达启航顾问持续跟进学生学习情况',
    },
    {
      number: '06',
      title: '国内顾问 + 宿务驻点',
      text: '国内咨询和宿务当地支持配合，适合第一次去菲律宾游学的学生和家庭。',
      image: 'assets/cia/sida-why-action-team.jpg',
      alt: '思达启航宿务和深圳服务团队',
    },
  ];

  readonly sidaTrustBadges: SidaTrustBadge[] = [
    { icon: 'verified_user', label: '名称与校区先核验' },
    { icon: 'description', label: '正式报价逐项确认' },
    { icon: 'payments', label: '套餐与当地费分开算' },
    { icon: 'apartment', label: '深圳总部 + 宿务驻点' },
  ];

  readonly schoolServices = [
    '机场接机',
    '入学测试',
    '一对一课程',
    '小组课',
    'Native课程',
    '词汇课',
    'Saturday Special Class',
    '晚间Special Class',
    '三餐',
    '宿舍',
    '泳池',
    '健身房',
    '桑拿',
    '厨房',
    '洗衣',
    'Wi-Fi',
  ];
  readonly campusActivities = [
    '月度水平测试',
    'Vocabulary Class',
    'Native Conversation',
    'Presentation',
    'Business Role Play',
    'Saturday Special Class',
  ];
  readonly weekendActivities = [
    'Ayala / SM City',
    'Mabolo周边餐厅',
    'IT Park',
    '按摩与咖啡厅',
    'Mactan一日游',
    '宿务市区观光',
  ];
  readonly notes = [
    '本页费用使用公开Premium Campus美元费用表；正式报价会按学校当期价格、入学日期、房型和优惠调整。',
    '你提供的CIEC Global网址与CIJ Premium Campus公开资料名称不同，报名之前必须确认学校主体、校区和住宿地址。',
    '课程住宿套餐不含注册费、SSP、签证、押金、教材、水电、管理费、接机和个人生活费。',
    'Power TOEIC Guarantee、Native课程和追加课程的开课规则、级别门槛和老师配置需单独确认。',
    '如果目标是严格斯巴达或低龄营队，应同步比较CIJ Sparta/Liloan、CG斯巴达校区、EV、SMEAG或CIEC相关项目。',
  ];
  readonly faqs: FaqItem[] = [
    {
      question: 'CIJ Premium和CIA最大的区别是什么？',
      answer:
        'CIA是Mactan大型半斯巴达综合型新校区；CIJ Premium公开资料更偏小中型Premium舒适住宿、一对一口语、Native/商务/TOEIC课程。两者正式空房和校区要按当期确认。',
    },
    {
      question: '用户给的CIEC Global网址和CIJ是同一个学校吗？',
      answer:
        '公开搜索资料显示CIEC Global和CIJ Academy的域名、项目说明不同。为了避免误报，本页以“CIJ Academy Premium Campus”公开资料整理，并建议报名前由顾问向学校核验。',
    },
    {
      question: '页面上的报价包含全部费用吗？',
      answer:
        '不包含全部。报价器主要估算课程住宿套餐和注册费；SSP、签证、押金、水电、教材、管理费、学生ID、接机和个人生活费仍需另行确认。',
    },
    {
      question: 'CIJ Premium适合成人短期吗？',
      answer:
        '适合列入候选。ESL4和Power Speaking适合短期一对一口语，Premium Course适合想提高一对一密度的人；最低周数和开课日以当期说明为准。',
    },
    {
      question: 'CIJ Premium适合商务或TOEIC吗？',
      answer:
        '可以比较。Basic Business覆盖履历、面试、邮件、会议和演示；Power TOEIC路线适合TOEIC方向，但保证班规则需单独确认。',
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
    { label: '用户提供：CIEC Global官网', url: 'https://ciecglobal.com/' },
    { label: 'CIJ Premium Campus介绍与特色', url: 'https://cebu-cij.com/english/premium/english-school/' },
    { label: 'CIJ Premium Campus课程列表', url: 'https://cebu-cij.com/english/premium/english-course/' },
    { label: 'CIJ Premium Campus公开费用表', url: 'https://cebu-cij.com/chinese/cost/premium-campus/' },
    { label: 'CIJ Academy 2026新版About页面', url: 'https://cebu-cij-academy.hsweb.pics/about' },
    { label: 'CIJ Academy韩文费用/当地费用页', url: 'https://cijschool.com/academy/?pCode=1406253419' },
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
    const fourWeekFee = course?.fourWeekFees[roomId] ?? 0;

    return Math.round(fourWeekFee * this.durationMultiplier(weeks));
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

  get quoteUsdText(): string {
    return `USD ${this.formatUsd(this.quoteUsd)} 起`;
  }

  get quoteCnyText(): string {
    const rounded = Math.round((this.quoteUsd * this.usdToCny) / 100) * 100;

    return `约 ${rounded.toLocaleString('zh-CN')} 元起`;
  }

  get seasonalNote(): string {
    return 'CIJ公开资料存在不同年份和域名口径，房型、校区和正式价格请以学校当期确认书为准';
  }

  formatUsd(value: number): string {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: Number.isInteger(value) ? 0 : 1,
      maximumFractionDigits: 1,
    });
  }

  private durationMultiplier(weeks: WeekOption): number {
    const multiplier: Record<WeekOption, number> = {
      1: 0.325,
      2: 0.6,
      3: 0.825,
      4: 1,
      8: 2,
      12: 3,
    };

    return multiplier[weeks];
  }
}

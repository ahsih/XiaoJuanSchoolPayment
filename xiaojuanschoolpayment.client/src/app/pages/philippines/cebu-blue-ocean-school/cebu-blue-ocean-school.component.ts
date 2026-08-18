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

interface CourseOption {
  id: string;
  name: string;
  type: string;
  lessons: string;
  suitable: string;
}

interface DormOption {
  id: string;
  name: string;
  baseFourWeek: number;
  note: string;
}

interface TuitionFee {
  courseId: string;
  weeks: WeekOption;
  fee: number;
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

@Component({
  selector: 'app-cebu-blue-ocean-school',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './cebu-blue-ocean-school.component.html',
  styleUrls: [
    '../cebu-school-detail-layout.css',
    '../cebu-school-detail-content.css',
    '../cebu-school-detail-responsive.css',
    '../ev-school/ev-school-detail.component.css',
    './cebu-blue-ocean-school.component.css',
  ],
})
export class CebuBlueOceanSchoolComponent {
  readonly galleryCategories: GalleryCategory[] = [
    '全部',
    '校园',
    '教室',
    '住宿',
    '餐厅',
    '设施',
  ];
  selectedGalleryCategory: GalleryCategory = '全部';

  readonly registrationFee = 100;
  readonly usdToCny = 7.2;
  readonly weekOptions: WeekOption[] = [1, 2, 3, 4, 8, 12];

  selectedCourseId = 'light-esl';
  selectedRoomId = 'egi-triple-ocean';
  selectedWeeks: WeekOption = 4;
  selectedStartDate = '2026-09-07';
  quoteCalculated = false;

  readonly quickInfo: QuickInfo[] = [
    {
      icon: 'beach_access',
      label: '学校类型',
      value: 'Mactan海边度假型校区',
      note: '位于EGI Hotel & Resort，适合想兼顾学习和海边环境的学生',
    },
    {
      icon: 'history_edu',
      label: '学校背景',
      value: 'PINES姊妹校，2015年开校',
      note: '公开资料强调沿用PINES教学体系、教材和师资管理经验',
    },
    {
      icon: 'record_voice_over',
      label: '课程特色',
      value: '1:1口语 + 小组课 + Option',
      note: 'Light ESL、Intensive ESL、Power ESL、IELTS、TOEIC、Business和Family均可比较',
    },
    {
      icon: 'hotel',
      label: '住宿房型',
      value: 'EGI双人/三人 + Ocean Suites单人',
      note: '2人房可分海景/市景，Ocean Suites单人房适合18岁以上或60岁以上学生',
    },
    {
      icon: 'restaurant',
      label: '餐食安排',
      value: '公开资料列三餐包含',
      note: '平日、周末和节假日均按学校规则提供餐食，最终以当期说明为准',
    },
    {
      icon: 'pool',
      label: '校区设施',
      value: '泳池 / 健身房 / 自习室 / 商务休息室',
      note: '海边度假环境、学校设施和住宿集中，是它和市区学校的主要差异',
    },
  ];

  readonly galleryImages: GalleryImage[] = [
    {
      category: '校园',
      title: 'CBOA EGI海边度假校区',
      description:
        'Cebu Blue Ocean Academy位于Mactan岛EGI Hotel & Resort，校区环境是它最鲜明的卖点。',
      src: 'https://www.firstenglish.jp/wp-content/uploads/2019/03/0d7cfbb129cc04c095aefddee46d8a3d.jpg',
    },
    {
      category: '设施',
      title: 'CBOA学习休息区',
      description:
        '明亮的学习休息区适合课后自习、线上沟通和同学交流。',
      src: 'https://storage.googleapis.com/studio-cms-assets/projects/JgqeXQQ9Ok/s-1200x800_v-fms_webp_b05503a5-81cb-4119-afec-e61f287a5ffe_middle.webp',
    },
    {
      category: '教室',
      title: 'CBOA小组课堂',
      description:
        '公开课程结构以一对一课为核心，并搭配小组课和选修/大团体课。',
      src: 'https://oecglobal.com/images/stories/PDF/CEBU_Blue_Ocean_Academy_2.jpg',
    },
    {
      category: '住宿',
      title: 'EGI Hotel三人房参考',
      description:
        'EGI校内住宿公开房型包含海景双人房、市景双人房和海景三人房。',
      src: 'https://ryugaku-hikaku-style.com/wp-content/uploads/pic_3-beds-EGI.jpg',
    },
    {
      category: '餐厅',
      title: 'CBOA餐厅参考',
      description:
        '公开费用说明列课程住宿包含餐食，餐厅也是学生日常交流空间。',
      src: 'https://eas-ryugaku.com/wp/wp-content/uploads/2023/09/cafeteria-2.jpg',
    },
    {
      category: '设施',
      title: 'EGI泳池与海景',
      description:
        '泳池、海边和度假设施让CBOA更适合想要Mactan生活体验的学生。',
      src: 'https://philenglish.net/upload/userfiles/images/Review-du-hoc/review-truong-cebu-blue-ocean-thien-duong-hoc-tap-tai-cebu-10.jpg',
    },
    {
      category: '校园',
      title: 'CBOA前台与办公室',
      description:
        '学校公开资料列有多国籍经理、Pines Portal和学生支持服务。',
      src: 'https://michi-sensei.com/home/wp-content/uploads/2024/03/429667981_18388092922073318_6138110158565193426_n-1024x768.jpg',
    },
  ];

  readonly basicInfo: BasicInfoRow[] = [
    { label: '学校名称', value: '菲律宾宿务Cebu Blue Ocean Academy' },
    { label: '英文简称', value: 'CBOA / Cebu Blue Ocean Academy' },
    {
      label: '地址',
      value: 'EGI Hotel Bldg 5, Looc Maribago, Lapu-Lapu City, Cebu 6015, Philippines',
    },
    { label: '学校定位', value: 'Mactan岛海边度假型英语学校，PINES姊妹校，强调教学稳定和度假设施' },
    { label: '课程方向', value: 'Light ESL、Intensive ESL、Survival ESL、Power ESL 5/7、Business、TOEIC、IELTS、Junior、Parents 3H、Senior Course' },
    { label: '住宿房型', value: 'Ocean Suites单人房；EGI Hotel海景/市景双人房、海景三人房' },
    { label: '4周起价', value: 'USD 1,820起：Light ESL学费 + EGI三人海景住宿 + 注册费' },
    { label: '当地费用', value: 'SSP、SSP I-Card、ACR、签证延长、押金、教材、水电、管理费、洗衣和接机另算' },
  ];

  readonly highlights: Highlight[] = [
    {
      image:
        'https://www.firstenglish.jp/wp-content/uploads/2019/03/0d7cfbb129cc04c095aefddee46d8a3d.jpg',
      title: 'Mactan海边度假环境',
      text: '比市区学校更有度假感，适合想要泳池、海景和周末跳岛便利度的学生。',
    },
    {
      image:
        'https://storage.googleapis.com/studio-cms-assets/projects/JgqeXQQ9Ok/s-1200x800_v-fms_webp_b05503a5-81cb-4119-afec-e61f287a5ffe_middle.webp',
      title: 'PINES系统和学生Portal',
      text: '官方页面强调Pines Portal、English Only Policy和国际经理协助管理校园生活。',
    },
    {
      image:
        'https://oecglobal.com/images/stories/PDF/CEBU_Blue_Ocean_Academy_2.jpg',
      title: '一对一课比例高',
      text: 'Light ESL、Power ESL、IELTS、TOEIC和Business都以一对一课程为核心，适合口语和目标型学习。',
    },
    {
      image:
        'https://ryugaku-hikaku-style.com/wp-content/uploads/pic_3-beds-EGI.jpg',
      title: '房型直接影响预算',
      text: 'EGI三人房最省预算，双人海景更舒适，Ocean Suites单人房价格和规则要单独确认。',
    },
  ];

  readonly suitableFor: FitItem[] = [
    {
      title: '想住在Mactan海边环境',
      text: 'CBOA适合想把学习和海边度假氛围结合的人，不是纯市区通勤型学校。',
    },
    {
      title: '重视PINES体系和师资稳定度',
      text: '公开资料强调PINES姊妹校背景、教材体系和教师训练管理。',
    },
    {
      title: '想要高比例一对一课程',
      text: 'Light ESL、Power ESL 5/7、TOEIC、IELTS和Business都有清晰的一对一课结构。',
    },
    {
      title: '亲子或青少年想看海边校区',
      text: 'Family Course和Junior Course可列入候选，暑假旺季和年龄/住宿规则需提前确认。',
    },
  ];

  readonly notSuitableFor: FitItem[] = [
    {
      title: '只想住在Cebu City市中心',
      text: 'CBOA在Lapu-Lapu / Mactan，去Ayala、IT Park等市区商圈需要交通时间。',
    },
    {
      title: '追求最强高压斯巴达备考',
      text: 'CBOA偏度假设施和学习平衡；若想封闭高压备考，可同时比较SMEAG、EV、CPILS或碧瑶学校。',
    },
    {
      title: '预算只看学费',
      text: 'CBOA公开价格把学费和住宿分开列，注册费和到校费用也要另外算清。',
    },
    {
      title: '旺季才临时指定海景房',
      text: 'Mactan热门季节和亲子档期容易紧张，海景/单人/家庭安排都需要提前确认空房。',
    },
  ];

  readonly courseOptions: CourseOption[] = [
    {
      id: 'light-esl',
      name: 'Light ESL 4',
      type: '轻量口语综合',
      lessons: '1:1 4小时 + Big Group Option 2小时',
      suitable: '适合希望平衡上课、休息、工作和Mactan生活体验的学生。',
    },
    {
      id: 'intensive-esl',
      name: 'Intensive ESL',
      type: '标准综合英语',
      lessons: '1:1 5小时 + 4:1小组2小时 + Big Group Option 2小时',
      suitable: '适合想要一对一和小组课都具备的标准强度学生。',
    },
    {
      id: 'survival-esl',
      name: 'Survival ESL',
      type: '初学者生活英语',
      lessons: '公开表：1:1 4节 + 小组2节',
      suitable: '适合零基础或初级学生，公开资料提示入学级别较高会转普通Intensive ESL。',
    },
    {
      id: 'power-esl-5',
      name: 'Power ESL 5',
      type: '一对一强化',
      lessons: '公开表：1:1 5节',
      suitable: '适合想增加一对一开口、反馈和教材定制空间的学生。',
    },
    {
      id: 'power-esl-7',
      name: 'Power ESL 7',
      type: '高密度一对一',
      lessons: '公开表：1:1 7节 + Option 2节',
      suitable: '适合短期集中练口语、听力、词汇、阅读和基础写作的学生。',
    },
    {
      id: 'business',
      name: 'Business English',
      type: '商务英语',
      lessons: '1:1 5小时 + Group 2小时 + Big Group Option 2小时',
      suitable: '适合准备英文面试、简历、会议、演示和国际职场沟通的人。',
    },
    {
      id: 'toeic',
      name: 'TOEIC',
      type: '多益备考',
      lessons: '公开表：1:1 5节 + 小组2节',
      suitable: '适合有求职、毕业门槛或职业英语成绩需求的学生。',
    },
    {
      id: 'ielts',
      name: 'IELTS',
      type: '雅思备考',
      lessons: '1:1 5小时 + Group 2小时 + Big Group Option 2小时',
      suitable: '适合有留学、移民或就业目标分数，需要系统备考的学生。',
    },
    {
      id: 'junior',
      name: 'Junior Course',
      type: '青少年英语',
      lessons: '公开表：1:1 5节 + 小组2节',
      suitable: '适合青少年/亲子方向，旺季Family Camp规则需单独确认。',
    },
    {
      id: 'parents',
      name: 'Parents 3H',
      type: '家长课程',
      lessons: '公开表：1:1 3节',
      suitable: '适合亲子同行家长保留较多陪伴和休息时间。',
    },
    {
      id: 'senior',
      name: 'Senior Course',
      type: '40岁以上特色课程',
      lessons: '公开表：1:1 4节 + 特色小组课',
      suitable: '适合40岁以上、希望兼顾一对一学习与特色小组互动的学生。',
    },
  ];

  readonly dormOptions: DormOption[] = [
    {
      id: 'egi-triple-ocean',
      name: 'EGI海景三人房',
      baseFourWeek: 850,
      note: '4周住宿费最低，适合控制预算。',
    },
    {
      id: 'egi-twin-city',
      name: 'EGI市景双人房',
      baseFourWeek: 900,
      note: '预算和空间平衡，市景房通常比海景房低。',
    },
    {
      id: 'egi-twin-ocean',
      name: 'EGI海景双人房',
      baseFourWeek: 1120,
      note: '更有Mactan度假感，热门季节需提前确认。',
    },
    {
      id: 'ocean-suite-superior',
      name: 'Ocean Suites单人Superior',
      baseFourWeek: 1250,
      note: '外部单人住宿，公开资料提示18岁以上、60岁以上学生需选Ocean Suites。',
    },
    {
      id: 'ocean-suite-deluxe',
      name: 'Ocean Suites单人Deluxe',
      baseFourWeek: 1400,
      note: '单人房舒适度更高，往返校区需按学校安排。',
    },
    {
      id: 'ocean-suite-ocean',
      name: 'Ocean Suites单人Ocean View',
      baseFourWeek: 1600,
      note: '单人海景房预算最高，适合重视隐私和住宿品质的人。',
    },
  ];

  readonly tuitionFees: TuitionFee[] = [
    { courseId: 'light-esl', weeks: 4, fee: 870 },
    { courseId: 'light-esl', weeks: 8, fee: 1740 },
    { courseId: 'light-esl', weeks: 12, fee: 2510 },
    { courseId: 'intensive-esl', weeks: 4, fee: 970 },
    { courseId: 'intensive-esl', weeks: 8, fee: 1940 },
    { courseId: 'intensive-esl', weeks: 12, fee: 2810 },
    { courseId: 'survival-esl', weeks: 4, fee: 1050 },
    { courseId: 'survival-esl', weeks: 8, fee: 2100 },
    { courseId: 'survival-esl', weeks: 12, fee: 3050 },
    { courseId: 'power-esl-5', weeks: 4, fee: 930 },
    { courseId: 'power-esl-5', weeks: 8, fee: 1860 },
    { courseId: 'power-esl-5', weeks: 12, fee: 2690 },
    { courseId: 'power-esl-7', weeks: 4, fee: 1170 },
    { courseId: 'power-esl-7', weeks: 8, fee: 2340 },
    { courseId: 'power-esl-7', weeks: 12, fee: 3410 },
    { courseId: 'business', weeks: 4, fee: 1200 },
    { courseId: 'business', weeks: 8, fee: 2400 },
    { courseId: 'business', weeks: 12, fee: 3500 },
    { courseId: 'toeic', weeks: 4, fee: 1050 },
    { courseId: 'toeic', weeks: 8, fee: 2100 },
    { courseId: 'toeic', weeks: 12, fee: 3050 },
    { courseId: 'ielts', weeks: 4, fee: 1130 },
    { courseId: 'ielts', weeks: 8, fee: 2260 },
    { courseId: 'ielts', weeks: 12, fee: 3290 },
    { courseId: 'junior', weeks: 4, fee: 1500 },
    { courseId: 'junior', weeks: 8, fee: 3000 },
    { courseId: 'junior', weeks: 12, fee: 4400 },
    { courseId: 'parents', weeks: 4, fee: 750 },
    { courseId: 'parents', weeks: 8, fee: 1500 },
    { courseId: 'parents', weeks: 12, fee: 2150 },
    { courseId: 'senior', weeks: 4, fee: 1050 },
    { courseId: 'senior', weeks: 8, fee: 2100 },
    { courseId: 'senior', weeks: 12, fee: 3050 },
  ];

  readonly schedule: ScheduleItem[] = [
    {
      time: '07:00 - 07:50',
      title: '早餐 / 早间Option',
      text: '公开资料列有Morning Listening、Vocabulary等选修课，实际开课按学校安排。',
    },
    {
      time: '08:00 - 12:00',
      title: '上午一对一 / 小组课',
      text: 'Light、Power、IELTS、TOEIC等课程会按学习目标分配一对一和小组课。',
    },
    {
      time: '12:00 - 13:00',
      title: '午餐',
      text: '公开费用说明列三餐包含，餐食安排以当期校规为准。',
    },
    {
      time: '13:00 - 17:00',
      title: '下午课程 / 自习',
      text: 'Intensive、Business和考试课程下午会继续安排一对一、小组或选修课。',
    },
    {
      time: '17:30 - 18:30',
      title: '晚餐 / 课后休息',
      text: 'Mactan海边环境适合课后放松，也要遵守学校门禁与校规。',
    },
    {
      time: '19:00 - 19:50',
      title: '夜间Option / 自习',
      text: '公开资料列有发音、语法、就业准备、吉他、Zumba等选项，是否开课需到校确认。',
    },
  ];

  readonly localFees: LocalFee[] = [
    { item: '注册费', amount: 'USD 100', note: '出发前支付，不含在学费和住宿费中' },
    { item: '高峰期加价', amount: 'USD 40 / 周', note: '公开表列2026/6/28-8/22高峰季加价；正式以学校报价为准' },
    { item: '机场接机', amount: 'PHP 1,200 / 1,500', note: '指定时间团体接机PHP 1,200，个别接机通常PHP 1,500' },
    { item: 'SSP', amount: 'PHP 7,800', note: '特别学习许可，金额可能按政策更新' },
    { item: 'SSP I-Card', amount: 'PHP 4,500', note: '公开表列SSP I-Card费用' },
    { item: 'ACR I-Card', amount: 'PHP 4,000', note: '60天以上或长周期学习通常需要确认' },
    { item: '签证延长', amount: 'PHP 5,140起', note: '5-8周PHP 5,140，周数越长费用越高' },
    { item: '酒店押金', amount: 'PHP 1,000 / 周', note: '毕业退房时按水电等费用结算' },
    { item: '综合管理费', amount: 'PHP 500 / 周', note: '到校后按学习周数支付' },
    { item: '教材费', amount: 'PHP 1,100-2,500 / 4周', note: '5册以下PHP 1,100；IELTS教材通常更高' },
    { item: '水电费', amount: '实费结算', note: 'EGI按实际用量结算；Ocean Suites公开表列PHP 1,000/周' },
    { item: '洗衣服务', amount: 'PHP 150-200 / 次', note: '洗衣+烘干按住宿类型和服务项目变化' },
  ];

  readonly serviceSteps: ProcessStep[] = [
    {
      icon: 'person_search',
      title: '先判断CBOA是否适合',
      text: '根据你想要海边环境、学习强度、是否亲子、预算和房型偏好做初筛。',
    },
    {
      icon: 'fact_check',
      title: '确认课程和住宿',
      text: '逐项核对Light ESL、Power ESL、IELTS、TOEIC、Business、Junior和EGI/Ocean Suites空房。',
    },
    {
      icon: 'payments',
      title: '拆清美元和披索费用',
      text: '把学费、住宿、注册费、接机、SSP、签证、押金、教材和水电分开列清。',
    },
    {
      icon: 'assignment_turned_in',
      title: '准备入学与行前资料',
      text: '协助整理护照、保险、eTravel、接机信息、现金清单和到校注意事项。',
    },
    {
      icon: 'support_agent',
      title: '学习期间继续协助',
      text: '如有课程、老师、住宿、账单或校规沟通问题，可继续联系顾问协助。',
    },
    {
      icon: 'location_on',
      title: '宿务当地支持',
      text: '思达在宿务有工作人员驻点，可按情况提供当地沟通支持。',
    },
  ];

  readonly sidaReasons: SidaReason[] = [
    {
      number: '01',
      title: '先判断海边校区是否合适',
      text: 'CBOA强项是Mactan海边环境；如果你更想住市区，顾问会同步比较CIA、I.BREEZE、IU等学校。',
      image: 'assets/cia/sida-why-action-selection.jpg',
      alt: '思达启航顾问帮助学生选择菲律宾宿务语言学校',
    },
    {
      number: '02',
      title: '学费和住宿分开核算',
      text: 'CBOA公开价格不是单一套餐价，顾问会按课程、周数、EGI或Ocean Suites房型逐项算清。',
      image: 'assets/cia/sida-why-action-fees.jpg',
      alt: '思达启航顾问核算菲律宾语言学校费用',
    },
    {
      number: '03',
      title: '旺季和亲子规则提前确认',
      text: '暑假、寒假、Family Camp和海景房需求容易变化，报名之前需要确认空房和当期规则。',
      image: 'assets/cia/sida-why-action-contract.jpg',
      alt: '思达启航顾问核验菲律宾游学课程和合同文件',
    },
    {
      number: '04',
      title: '行前清单更完整',
      text: '接机时间、现金准备、保险、eTravel、宿舍用品和到校费用会提前整理给学生。',
      image: 'assets/cia/sida-why-action-departure.jpg',
      alt: '菲律宾游学出发前文件和行李准备',
    },
    {
      number: '05',
      title: '到校后仍可沟通',
      text: '遇到课程、老师、住宿、账单或校规疑问时，可让顾问帮忙梳理沟通重点。',
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
    { icon: 'description', label: '正式报价逐项核验' },
    { icon: 'verified_user', label: '房型与旺季规则确认' },
    { icon: 'payments', label: '学费住宿当地费分开算' },
    { icon: 'apartment', label: '深圳总部 + 宿务驻点' },
  ];

  readonly schoolServices = [
    '机场接机',
    '入学测试',
    '一对一课程',
    '小组课',
    'Option Class',
    'Pines Portal',
    '餐厅三餐',
    'EGI宿舍',
    'Ocean Suites',
    '泳池',
    '健身房',
    '自习室',
  ];
  readonly campusActivities = [
    'English Only Policy',
    'Morning Listening',
    'Vocabulary',
    'Basic Pronunciation',
    'Zumba',
    'Guitar Class',
  ];
  readonly weekendActivities = [
    'Mactan海边',
    '跳岛游',
    '潜水体验',
    'Maribago周边餐厅',
    'Cebu City商场',
    '按摩和咖啡厅',
  ];
  readonly notes = [
    '4周课程与住宿基准使用学校2025美元价目表；实际金额会按学校当期报价、汇率和政策调整。',
    'CBOA公开价格中，学费和住宿费分开列出，报价器会把注册费、学费、住宿费相加。',
    '课程与住宿的1周、2周、3周费用分别按4周价格的40%、65%、85%计算。',
    '暑假旺季、Family Camp、海景房和Ocean Suites单人房需要提前确认空房和规则。',
    '到校后SSP、签证、押金、教材、水电、管理费和洗衣等费用需以学校Orientation说明为准。',
  ];
  readonly faqs: FaqItem[] = [
    {
      question: 'Cebu Blue Ocean Academy和CIA最大的区别是什么？',
      answer:
        'CIA是Mactan半斯巴达综合型新校区，校区设施和考试资源都强；CBOA更偏EGI海边度假环境和PINES教学体系，适合想要海边、泳池、三餐和一对一课平衡的人。',
    },
    {
      question: '页面上的CBOA报价包含全部费用吗？',
      answer:
        '不包含全部。报价器主要估算注册费、学费和住宿费；到校后还要准备SSP、SSP I-Card、ACR、签证延长、押金、教材、水电、管理费、洗衣等当地费用。',
    },
    {
      question: 'CBOA适合亲子游学吗？',
      answer:
        '可以列入候选。CBOA有Junior Course和Parents 3H，但暑假亲子旺季、Family Camp、年龄、房型和名额规则变化较多，建议先让顾问确认当期招生口径。',
    },
    {
      question: 'CBOA适合雅思或多益备考吗？',
      answer:
        'CBOA官方课程包含IELTS和TOEIC，适合想在海边环境中进行目标型备考的学生。如果目标是高压保证班或更强封闭式备考，也建议同步比较SMEAG、EV、CPILS或碧瑶学校。',
    },
    {
      question: 'Ocean Suites和EGI住宿怎么选？',
      answer:
        'EGI更靠校区，双人/三人房预算较低；Ocean Suites是外部单人住宿，舒适度和隐私更高，公开资料提示18岁以上可选，60岁以上需选Ocean Suites，正式仍要按学校规则确认。',
    },
  ];
  readonly sideNav: SideNavItem[] = [
    { label: '学校环境', target: 'gallery', icon: 'image' },
    { label: '课程与学费', target: 'course-fees', icon: 'menu_book' },
    { label: '费用快速报价', target: 'quote', icon: 'calculate' },
    { label: '住宿费用', target: 'room-fees', icon: 'hotel' },
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
    { label: 'CBOA官网首页', url: 'https://www.cebublueocean.com/eng/index' },
    { label: 'CBOA官方Light ESL课程', url: 'https://www.cebublueocean.com/eng/program_light_esl' },
    { label: 'CBOA官方Intensive ESL课程', url: 'https://www.cebublueocean.com/eng/program_intensive_esl' },
    { label: 'CBOA官方IELTS课程', url: 'https://www.cebublueocean.com/eng/program_ielts' },
    { label: 'CBOA官方宿舍说明', url: 'https://www.cebublueocean.com/eng/campus_dorms' },
    { label: 'CBOA官方设施图库', url: 'https://www.cebublueocean.com/eng/campus_facilities?nav=all' },
    { label: '留学Thank You 2026费用表', url: 'https://world-study.com/school/804/charge/' },
    { label: 'Fujiyama CBOA费用与当地费用', url: 'https://www.fujiyama-international.com/philippines/cebu-blue-ocean-academy.html' },
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

  tuitionFor(courseId: string, weeks: WeekOption = this.selectedWeeks): number {
    const listedFee = this.tuitionFees.find(
      (item) => item.courseId === courseId && item.weeks === weeks,
    )?.fee;

    if (listedFee !== undefined) {
      return listedFee;
    }

    const fourWeekFee = this.tuitionFees.find(
      (item) => item.courseId === courseId && item.weeks === 4,
    )?.fee;

    return fourWeekFee && weeks < 4
      ? fourWeekFee * this.durationMultiplier(weeks)
      : 0;
  }

  dormFeeFor(roomId: string, weeks: WeekOption = this.selectedWeeks): number {
    const room = this.dormOptions.find((item) => item.id === roomId);

    return room ? room.baseFourWeek * this.durationMultiplier(weeks) : 0;
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

  get selectedRoom(): DormOption {
    return (
      this.dormOptions.find((room) => room.id === this.selectedRoomId) ??
      this.dormOptions[0]
    );
  }

  get selectedTuitionFee(): number {
    return this.tuitionFor(this.selectedCourseId, this.selectedWeeks);
  }

  get selectedDormFee(): number {
    return this.dormFeeFor(this.selectedRoomId, this.selectedWeeks);
  }

  get quoteUsd(): number {
    return this.registrationFee + this.selectedTuitionFee + this.selectedDormFee;
  }

  get quoteUsdText(): string {
    return `USD ${this.formatUsd(this.quoteUsd)} 起`;
  }

  get quoteCnyText(): string {
    const rounded = Math.round((this.quoteUsd * this.usdToCny) / 100) * 100;

    return `约 ${rounded.toLocaleString('zh-CN')} 元起`;
  }

  get seasonalNote(): string {
    return '公开表列2026/6/28-8/22旺季可能加收USD 40/周，正式以学校报价为准';
  }

  formatUsd(value: number): string {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: Number.isInteger(value) ? 0 : 1,
      maximumFractionDigits: 1,
    });
  }

  private durationMultiplier(weeks: WeekOption): number {
    const multiplier: Record<WeekOption, number> = {
      1: 0.4,
      2: 0.65,
      3: 0.85,
      4: 1,
      8: 2,
      12: 3,
    };

    return multiplier[weeks];
  }
}

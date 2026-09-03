import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

type GalleryCategory = '全部' | '校园' | '教室' | '住宿' | '餐厅' | '设施';
type WeekOption = 1 | 2 | 3 | 4 | 8 | 12 | 16 | 20 | 24;
type ShortStayWeek = 1 | 2 | 3;

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
  selector: 'app-winning-school',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './winning-school.component.html',
  styleUrls: [
    '../cebu-school-detail-layout.css',
    '../cebu-school-detail-content.css',
    '../cebu-school-detail-responsive.css',
    '../ev-school/ev-school-detail.component.css',
    './winning-school.component.css',
  ],
})
export class WinningSchoolComponent {
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
  readonly weekOptions: WeekOption[] = [1, 2, 3, 4, 8, 12, 16, 20, 24];
  readonly shortStayMultipliers: Record<ShortStayWeek, number> = {
    1: 0.4,
    2: 0.6,
    3: 0.8,
  };

  selectedCourseId = 'cambridge-esl4';
  selectedRoomId = 'standard-double';
  selectedWeeks: WeekOption = 4;
  selectedStartDate = '2026-09-07';
  quoteCalculated = false;

  readonly quickInfo: QuickInfo[] = [
    {
      icon: 'location_city',
      label: '学校类型',
      value: '台资多校区 / City + Ocean',
      note: 'Winning在宿务公开运营City、Ocean和Lyf等校区，本页费用以Ocean Campus 2026公开表为参考。',
    },
    {
      icon: 'record_voice_over',
      label: '课程重点',
      value: 'Cambridge ESL / Speaking / Travel',
      note: 'Ocean Campus主打Cambridge ESL2/4、Power Speaking6、Speaking Focus8、Travel English和亲子路线。',
    },
    {
      icon: 'groups',
      label: '学生类型',
      value: '成人 / 家庭 / 青少年',
      note: '公开资料列Family、Kids、Junior和菲律宾营队，也有Business、TOEIC、IELTS等成人方向。',
    },
    {
      icon: 'hotel',
      label: '住宿',
      value: 'Standard Hotel / Backpacker / Family',
      note: 'Ocean公开房型包括Standard Hotel 1/2人房、Backpacker 4/8人房和Family 3人房。',
    },
    {
      icon: 'restaurant',
      label: '餐食',
      value: '平日3餐为主',
      note: '公开资料对周末餐食口径略有差异，报名时需确认当前校区、周数和营队安排。',
    },
    {
      icon: 'pool',
      label: '设施',
      value: 'Mactan Ocean校区 / 泳池 / 教室',
      note: 'Ocean Campus位于Mactan度假生活圈，适合想把学习和海岛生活感结合的学生。',
    },
  ];

  readonly galleryImages: GalleryImage[] = [
    {
      category: '校园',
      title: 'Ocean Campus外观',
      description:
        'Mactan Island度假型校区，适合想在更轻松环境中安排ESL、Travel或亲子课程的学生。',
      src: 'https://tabiken-ryugaku.co.jp/ph/wp-content/uploads/sites/3/2023/08/6-2-1024x576.jpg',
    },
    {
      category: '设施',
      title: 'Ocean Campus泳池',
      description:
        '公开资料显示Ocean Campus有度假型公共设施，适合家庭和短中期学生比较。',
      src: 'https://estatic.languagecourse.net/images/schools/thumbs_school_page_slider/winning-english-academy-ocean-campus-cebu-city_1711989939336.jpg',
    },
    {
      category: '校园',
      title: 'City Campus外观',
      description:
        'City Campus位于Cebu City市区，适合重视生活机能、考试商务课程和市区便利的人。',
      src: 'https://englishincebu.ru/wp-content/uploads/2023/06/WEA-Building-1-scaled.jpg',
    },
    {
      category: '住宿',
      title: 'Ocean宿舍双人房参考',
      description:
        'Standard Hotel 2人房是本页默认报价房型之一，正式安排需按性别和空房确认。',
      src: 'https://cebu21.jp/include/schoolno2/winningocean/Domitory/IMG_20241211_111245.jpg',
    },
    {
      category: '餐厅',
      title: 'Ocean校内餐厅',
      description:
        '公开资料列课程费用通常含餐食，周末和节假日餐食规则需按当期校区说明确认。',
      src: 'https://cebu21.jp/include/schoolno2/winningocean/Cafeteria/Cafeteria_%287%29.jpg',
    },
    {
      category: '校园',
      title: 'Ocean校区航拍参考',
      description:
        'Ocean Campus更偏海岛生活氛围，适合和CIA、QQEnglish Beachfront、CBOA一起比较。',
      src: 'https://cebu21.jp/include/schoolno5/winningocean/Campus/Building%281%29.jpg',
    },
  ];

  readonly basicInfo: BasicInfoRow[] = [
    { label: '学校名称', value: '菲律宾宿务Winning English Academy' },
    { label: '英文名称', value: 'Winning English Academy' },
    { label: '主要校区', value: 'City Campus / Cebu City；Ocean Campus / Mactan Island；Lyf Family Campus' },
    { label: '学校定位', value: '台资多校区、多国籍、EOP、非斯巴达到营队型弹性学习' },
    { label: 'Ocean住宿', value: 'Standard Hotel 1/2人房、Backpacker 4/8人房、Family 3人房' },
    { label: '主要课程', value: 'Cambridge ESL、Power Speaking、Speaking Focus、Travel English、Business、TOEIC、IELTS、Family/Kids/Junior' },
    { label: '本页费用口径', value: '2026 Ocean Campus公开美元表；入学金和当地费用另列' },
    { label: '适合人群', value: '想在City市区便利和Ocean海岛舒适之间选择的成人、家庭和青少年学生' },
  ];

  readonly highlights: Highlight[] = [
    {
      image: 'https://tabiken-ryugaku.co.jp/ph/wp-content/uploads/sites/3/2023/08/6-2-1024x576.jpg',
      title: 'City和Ocean两种宿务生活方式',
      text: 'City Campus更市区便利，Ocean Campus更度假舒适，适合先按学习目的和生活偏好做校区选择。',
    },
    {
      image: 'https://estatic.languagecourse.net/images/schools/thumbs_school_page_slider/winning-english-academy-ocean-campus-cebu-city_1711989939336.jpg',
      title: 'ESL、旅行英语和亲子路线清楚',
      text: 'Ocean公开课程从Cambridge ESL2/4到Power Speaking、Speaking Focus、Travel English和Family/Kids/Junior都有。',
    },
    {
      image: 'https://englishincebu.ru/wp-content/uploads/2023/06/WEA-Building-1-scaled.jpg',
      title: '台资多语支持和多国籍环境',
      text: 'Winning官方强调全球学生社群和多语言站点，适合希望降低沟通压力但仍接触国际环境的学生。',
    },
  ];

  readonly suitableFor: FitItem[] = [
    {
      title: '想在市区和海岛之间选择',
      text: 'City Campus适合生活机能和考试商务方向；Ocean Campus适合度假型、亲子和轻松学习生活。',
    },
    {
      title: '想要口语输出和一对一课量',
      text: 'Cambridge ESL4、Power Speaking6和Speaking Focus8能按每日一对一节数拉开强度。',
    },
    {
      title: '亲子、儿童或青少年短期体验',
      text: '公开资料列Guardian、Kids、Junior、Family和菲律宾营队方向，可按年龄和季节确认。',
    },
    {
      title: '想要台资学校的沟通支持',
      text: '学校提供繁中、简中、日文、韩文等多语言站点，适合希望报名和到校沟通更顺的人。',
    },
  ];

  readonly notSuitableFor: FitItem[] = [
    {
      title: '只想强斯巴达管理',
      text: 'Winning整体更偏弹性和营队/综合型路线，强管理考试冲刺可同步比较CG斯巴达校区、EV或SMEAG。',
    },
    {
      title: '需要成人完全安静型校区',
      text: 'Ocean Campus公开资料强调儿童、家庭和营队，若排斥低龄学生环境，要先确认入学季和校区安排。',
    },
    {
      title: '不想处理校区差异',
      text: 'Winning有City、Ocean、Lyf等校区，不同课程、住宿、餐食和费用口径不同，报名前必须逐项核对。',
    },
  ];

  readonly roomOptions: RoomOption[] = [
    {
      id: 'standard-single',
      name: 'Ocean Standard Hotel 1人房',
      note: '适合成人个人住宿；公开2026 Cambridge ESL4 4周USD 1,977。',
    },
    {
      id: 'standard-double',
      name: 'Ocean Standard Hotel 2人房',
      note: '本页默认参考房型，适合同行或愿意合住房的成人学生。',
    },
    {
      id: 'backpacker-four',
      name: 'Ocean Backpacker 4人房（女性）',
      note: '女性多人房，预算较低；空房和适用对象需确认。',
    },
    {
      id: 'backpacker-eight',
      name: 'Ocean Backpacker 8人房（男性）',
      note: '男性预算房型，公开Cambridge ESL2 4周约USD 1,095起。',
    },
    {
      id: 'family-three',
      name: 'Ocean Family 3人房',
      note: '亲子家庭房，常按家长和孩子组合核价，最终以学校确认书为准。',
    },
  ];

  readonly courseOptions: CourseOption[] = [
    {
      id: 'cambridge-esl2',
      name: 'Cambridge ESL2',
      type: '轻量ESL',
      lessons: '1:1两节 + 小组两节 + Option两节',
      suitable: '适合想保留自由时间、基础口语和亲子家长轻量学习的学生。',
      pricesByRoom: {
        'standard-single': { 1: 749, 2: 1123, 3: 1498, 4: 1872, 8: 3744, 12: 5616, 16: 7488, 20: 9360, 24: 11232 },
        'standard-double': { 1: 629, 2: 943, 3: 1258, 4: 1572, 8: 3144, 12: 4716, 16: 6288, 20: 7860, 24: 9432 },
        'backpacker-four': { 1: 489, 2: 733, 3: 978, 4: 1222, 8: 2444, 12: 3666, 16: 4888, 20: 6110, 24: 7332 },
        'backpacker-eight': { 1: 438, 2: 657, 3: 876, 4: 1095, 8: 2190, 12: 3285, 16: 4380, 20: 5475, 24: 6570 },
        'family-three': { 1: 569, 2: 853, 3: 1138, 4: 1422, 8: 2844, 12: 4266, 16: 5688, 20: 7110, 24: 8532 },
      },
    },
    {
      id: 'cambridge-esl4',
      name: 'Cambridge ESL4',
      type: '标准ESL',
      lessons: '1:1四节 + 小组两节 + Option两节',
      suitable: '适合大多数成人ESL学生，兼顾一对一口语、小组互动和自选课程。',
      pricesByRoom: {
        'standard-single': { 1: 791, 2: 1187, 3: 1582, 4: 1977, 8: 3954, 12: 5931, 16: 7908, 20: 9885, 24: 11862 },
        'standard-double': { 1: 671, 2: 1007, 3: 1342, 4: 1677, 8: 3354, 12: 5031, 16: 6708, 20: 8385, 24: 10062 },
        'backpacker-four': { 1: 531, 2: 797, 3: 1062, 4: 1327, 8: 2654, 12: 3981, 16: 5308, 20: 6635, 24: 7962 },
        'backpacker-eight': { 1: 480, 2: 720, 3: 960, 4: 1200, 8: 2400, 12: 3600, 16: 4800, 20: 6000, 24: 7200 },
        'family-three': { 1: 611, 2: 917, 3: 1222, 4: 1527, 8: 3054, 12: 4581, 16: 6108, 20: 7635, 24: 9162 },
      },
    },
    {
      id: 'power-speaking6',
      name: 'Power Speaking6',
      type: '口语强化',
      lessons: '1:1六节 + 小组两节 + Option两节',
      suitable: '适合想把主要预算投在一对一输出、短期内提高口语密度的学生。',
      pricesByRoom: {
        'standard-single': { 1: 854, 2: 1281, 3: 1708, 4: 2135, 8: 4270, 12: 6405, 16: 8540, 20: 10675, 24: 12810 },
        'standard-double': { 1: 734, 2: 1101, 3: 1468, 4: 1835, 8: 3670, 12: 5505, 16: 7340, 20: 9175, 24: 11010 },
        'backpacker-four': { 1: 594, 2: 891, 3: 1188, 4: 1485, 8: 2970, 12: 4455, 16: 5940, 20: 7425, 24: 8910 },
        'backpacker-eight': { 1: 544, 2: 815, 3: 1087, 4: 1358, 8: 2716, 12: 4074, 16: 5432, 20: 6790, 24: 8148 },
        'family-three': { 1: 674, 2: 1011, 3: 1348, 4: 1685, 8: 3370, 12: 5055, 16: 6740, 20: 8425, 24: 10110 },
      },
    },
    {
      id: 'speaking-focus8',
      name: 'Speaking Focus8',
      type: '高强度一对一',
      lessons: '1:1八节 + Option两节',
      suitable: '适合短期冲刺、想最大化一对一课量并减少一般小组课比例的学生。',
      pricesByRoom: {
        'standard-single': { 1: 918, 2: 1377, 3: 1836, 4: 2295, 8: 4590, 12: 6885, 16: 9180, 20: 11475, 24: 13770 },
        'standard-double': { 1: 798, 2: 1197, 3: 1596, 4: 1995, 8: 3990, 12: 5985, 16: 7980, 20: 9975, 24: 11970 },
        'backpacker-four': { 1: 658, 2: 987, 3: 1316, 4: 1645, 8: 3290, 12: 4935, 16: 6580, 20: 8225, 24: 9870 },
        'backpacker-eight': { 1: 608, 2: 911, 3: 1215, 4: 1518, 8: 3036, 12: 4554, 16: 6072, 20: 7590, 24: 9108 },
        'family-three': { 1: 738, 2: 1107, 3: 1476, 4: 1845, 8: 3690, 12: 5535, 16: 7380, 20: 9225, 24: 11070 },
      },
    },
    {
      id: 'travel-english',
      name: 'Travel English',
      type: '旅行英语',
      lessons: '1:1四节 + 小组两节 + Option两节',
      suitable: '适合短期游学、旅行场景表达、生活英语和轻考试压力的学生。',
      pricesByRoom: {
        'standard-single': { 1: 854, 2: 1281, 3: 1708, 4: 2135, 8: 4270, 12: 6405, 16: 8540, 20: 10675, 24: 12810 },
        'standard-double': { 1: 734, 2: 1101, 3: 1468, 4: 1835, 8: 3670, 12: 5505, 16: 7340, 20: 9175, 24: 11010 },
        'backpacker-four': { 1: 594, 2: 891, 3: 1188, 4: 1485, 8: 2970, 12: 4455, 16: 5940, 20: 7425, 24: 8910 },
        'backpacker-eight': { 1: 544, 2: 815, 3: 1087, 4: 1358, 8: 2716, 12: 4074, 16: 5432, 20: 6790, 24: 8148 },
        'family-three': { 1: 674, 2: 1011, 3: 1348, 4: 1685, 8: 3370, 12: 5055, 16: 6740, 20: 8425, 24: 10110 },
      },
    },
  ];

  readonly specialFees: SpecialCourseFee[] = [
    {
      label: 'Business English',
      lessons: '1:1四节 + 小组两节 + Option两节',
      four: '需按City / Ocean校区核价',
      note: '官方课程页列商务英语方向，通常建议18岁以上且按英语程度确认。',
    },
    {
      label: 'TOEIC / IELTS',
      lessons: '考试方向',
      four: '需按校区和当期开课核价',
      note: 'City Campus继续适合考试备考需求；正式报名需确认校区、老师和模考安排。',
    },
    {
      label: 'Guardian ESL / Kids / Junior',
      lessons: '亲子和青少年路线',
      four: 'Guardian 4周USD 1,160起；Kids/Junior 4周USD 1,685起',
      note: '亲子、儿童和青少年课程需按年龄、校区、监护人和季节空位确认。',
    },
    {
      label: 'Peak Season Surcharge',
      lessons: '2026-07-05至2026-08-29',
      four: 'USD 40 / 周',
      note: '暑期旺季附加费不包含在本页报价器中，需报名时单独加总。',
    },
    {
      label: 'Daycare',
      lessons: '5岁以下 / 8:00-17:00',
      four: 'USD 100 / 周',
      note: '低龄儿童照护服务需提前确认名额和适用校区。',
    },
  ];

  readonly schedule: ScheduleItem[] = [
    {
      time: '07:00 - 08:30',
      title: '早餐',
      text: '按校区餐食安排用餐；周末和节假日餐食口径需确认最新规则。',
    },
    {
      time: '08:00 - 11:50',
      title: '上午课程',
      text: '按所选课程安排一对一、小组课或选修课，第一天通常有分级和说明。',
    },
    {
      time: '12:00 - 12:50',
      title: '午餐',
      text: '校内餐厅用餐，亲子和青少年学生需按校区管理安排行动。',
    },
    {
      time: '13:00 - 16:50',
      title: '下午课程',
      text: 'Power Speaking和Speaking Focus会有更高一对一密度，适合口语输出训练。',
    },
    {
      time: '17:00 - 17:50',
      title: '晚餐',
      text: '下课后可安排复习、休息或外出，未成年学生需遵守学校规则。',
    },
    {
      time: '18:00 - 19:50',
      title: 'Optional Classes / 自习',
      text: '可按当期课程表参加选修课、复习或顾问建议的自学任务。',
    },
  ];

  readonly localFees: LocalFee[] = [
    { item: '入学金', amount: 'USD 100', note: '本页报价器已计入；官方费用计算页列Registration Fee 100 USD' },
    { item: 'SSP', amount: 'PHP 7,800', note: '特别学习许可，通常所有线下学生需办理' },
    { item: 'SSP E-Card', amount: 'PHP 4,500', note: '按菲律宾当地政策和学校代办规则确认' },
    { item: 'ACR I-Card', amount: 'PHP 4,500', note: '通常59天以上学生需办理，短期学生以学校说明为准' },
    { item: '水电费', amount: 'PHP 900 / 周', note: '2026公开表常见口径；实际按校区和房型确认' },
    { item: '管理费', amount: 'PHP 500 / 周', note: '学校设备和管理相关费用，需按周数计入当地费' },
    { item: '学生证', amount: 'PHP 200', note: '到校后办理，金额以学校最新账单为准' },
    { item: '教材费', amount: 'PHP 1,000-3,000', note: '按课程、等级和实际教材使用计算' },
    { item: '机场接机', amount: 'PHP 1,000', note: '按抵达时间、校区和是否团体接机确认' },
    { item: '宿舍押金', amount: 'PHP 3,500', note: '退房检查无损坏后按学校规则退还' },
    { item: '洗衣', amount: 'PHP 200 / 次', note: '如使用校内或合作洗衣服务，按次收费' },
    { item: '签证延长', amount: 'PHP 5,140起', note: '30天免签后按停留周数逐次办理，长周数需另外预算' },
  ];

  readonly serviceSteps: ProcessStep[] = [
    {
      icon: 'person_search',
      title: '先选City还是Ocean',
      text: '根据年龄、课程目标、是否亲子、住宿偏好和生活机能，先把校区方向定清楚。',
    },
    {
      icon: 'fact_check',
      title: '确认课程和房型',
      text: '核对Cambridge ESL2/4、Power Speaking、Speaking Focus、Travel、考试或亲子课程，以及性别空房。',
    },
    {
      icon: 'payments',
      title: '拆清主费和当地费',
      text: '把课程住宿餐食、入学金、SSP、签证、押金、水电、教材、管理费和接机分开列清。',
    },
    {
      icon: 'assignment_turned_in',
      title: '准备报名资料',
      text: '协助整理护照、保险、eTravel、接机资料、现金清单和未成年/亲子所需信息。',
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
    { icon: 'description', label: '2026 Ocean费用整理' },
    { icon: 'verified_user', label: '校区与房型先确认' },
    { icon: 'payments', label: '主费与当地费分开算' },
    { icon: 'apartment', label: '深圳总部 + 宿务驻点' },
  ];

  readonly schoolServices = [
    '一对一课程',
    '小组课',
    'Optional Class',
    'Cambridge ESL',
    'Power Speaking',
    'Speaking Focus',
    'Travel English',
    'Business English',
    'TOEIC / IELTS',
    'Guardian ESL',
    'Kids / Junior',
    'Family住宿',
    '泳池',
    '学生餐厅',
    'EOP环境',
  ];
  readonly campusActivities = [
    'Ocean泳池',
    '自习',
    '亲子活动',
    '营队活动',
    '校内交流',
    '毕业式',
  ];
  readonly weekendActivities = [
    'Mactan海边',
    'Jpark周边',
    'Cebu City商场',
    '咖啡厅和餐厅',
    'Island Hopping',
    '薄荷岛短途',
  ];
  readonly notes = [
    '本页课程费用按公开2026 Ocean Campus美元表整理，主要用于初步估算课程、住宿和餐食主费。',
    'City Campus、Lyf Family Campus、商务、TOEIC、IELTS和营队项目可能采用不同费用表，需逐项确认。',
    'Family 3人房、Guardian、Kids和Junior涉及年龄、监护、房型和季节名额，不能只按成人ESL价格判断。',
    'SSP、SSP E-Card、签证、ACR、押金、水电、教材、管理费、接机、旺季费和洗衣通常另计。',
    '公开资料对周末餐食和部分当地费口径可能随年份更新，报名前以学校正式报价单和确认书为准。',
  ];
  readonly faqs: FaqItem[] = [
    {
      question: 'Winning和CIA最大的区别是什么？',
      answer:
        'CIA是Mactan大型半斯巴达综合校区；Winning更像多校区弹性选择，City偏市区便利和考试商务，Ocean偏海岛舒适、ESL和亲子/青少年路线。',
    },
    {
      question: '页面上的费用包含全部费用吗？',
      answer:
        '不包含全部。报价器主要估算Ocean Campus课程住宿餐食主费和入学金；SSP、签证、ACR、押金、水电、教材、管理费、接机、旺季费和个人生活费需另行准备。',
    },
    {
      question: 'Winning适合亲子游学吗？',
      answer:
        '适合列入候选。公开资料列Guardian、Kids、Junior、Family和营队路线，但需要按孩子年龄、家长是否同行、校区、季节和空房确认。',
    },
    {
      question: '想备考IELTS或TOEIC可以选Winning吗？',
      answer:
        '可以咨询，但要先确认校区和当期开课。Winning官方有TOEIC和IELTS课程信息，City Campus通常更适合成人考试或商务需求。',
    },
    {
      question: '应该选City Campus还是Ocean Campus？',
      answer:
        '想要市区生活、考试商务和更强生活机能可先看City；想要Mactan度假感、亲子/青少年、ESL和Travel English可先看Ocean。',
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
    { label: 'Winning English Academy官方网站', url: 'https://winningenglishschool.com/' },
    { label: 'Winning官方费用计算页', url: 'https://winningenglishschool.com/school-fee/' },
    { label: 'Winning Ocean Campus官方介绍', url: 'https://winningenglishschool.com/campuses/ocean-campus/' },
    { label: 'Winning City Campus官方介绍', url: 'https://winningenglishschool.com/campuses/city-campus/' },
    { label: 'Winning Cambridge ESL官方课程', url: 'https://winningenglishschool.com/courses/cambridge-esl/' },
    { label: 'Winning FAQ官方费用与校规', url: 'https://winningenglishschool.com/faq/' },
    { label: 'Winning Ocean Campus 2026费用参考', url: 'https://www.pro-japan.jp/school/138/course/' },
    { label: 'Winning Ocean Campus公开学校资料', url: 'https://global-click.jp/contents/school/winning-english-academy-ocean-campus/' },
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
    const prices = course?.pricesByRoom[roomId];

    if (!prices) {
      return 0;
    }

    const shortStayMultiplier = this.shortStayMultipliers[weeks as ShortStayWeek];

    if (shortStayMultiplier) {
      return Math.round(prices[4] * shortStayMultiplier);
    }

    return prices[weeks] ?? 0;
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
      return '入学日期需要和学校确认，适用校区、价格、促销、房型空位和当地费用会影响最终报价。';
    }

    const peakStart = new Date('2026-07-05T00:00:00');
    const peakEnd = new Date('2026-08-29T23:59:59');

    if (start >= peakStart && start <= peakEnd) {
      return '当前入学日期落在2026暑期旺季区间，公开表列Peak Season Surcharge USD 40/周，本页报价器未自动加总。';
    }

    return this.selectedWeeks >= 12
      ? '当前选择为12周以上，需确认长期价格、签证延长、ACR I-Card、校区和房型空位。'
      : '当前选择为短中期课程，需确认2026价格、校区、促销、房型空位、接机和当地费用。';
  }

  formatUsd(amount: number): string {
    return amount.toLocaleString('en-US');
  }
}

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ScrollToDirective } from '../../../directives/scroll-to.directive';

interface HighlightCard {
  icon: string;
  title: string;
  text: string;
}

interface SchoolType {
  title: string;
  tag: string;
  text: string;
  examples: string;
}

interface SchoolProfile {
  name: string;
  location: string;
  style: string;
  route?: string;
  startingPrice?: string;
  courses: string[];
  accommodation: string;
  facilities: string;
  bestFor: string;
  note: string;
}

interface DecisionPoint {
  label: string;
  text: string;
}

interface SourceLink {
  label: string;
  url: string;
}

@Component({
  selector: 'app-cebu-study',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, ScrollToDirective],
  templateUrl: './cebu-study.component.html',
  styleUrl: './cebu-study.component.css',
})
export class CebuStudyComponent {
  readonly highlights: HighlightCard[] = [
    {
      icon: 'location_city',
      title: '学校选择最多',
      text: '宿务是菲律宾语言学校最集中的城市之一，学校风格从斯巴达、半斯巴达到自律型都有，适合先做大范围筛选。',
    },
    {
      icon: 'flight',
      title: '入学衔接方便',
      text: '麦克坦-宿务国际机场距离主要校区较近，接机、周末抵达、短期入学和亲子同行的安排更成熟。',
    },
    {
      icon: 'beach_access',
      title: '学习与生活平衡',
      text: '平日密集上课，周末可安排海岛、薄荷岛、商场和城市生活体验，适合第一次菲律宾游学的学生。',
    },
    {
      icon: 'groups',
      title: '课程覆盖完整',
      text: 'ESL、雅思、多益、商务英语、亲子、青少年营队和短期强化课程都能在宿务找到对应学校。',
    },
  ];

  readonly schoolTypes: SchoolType[] = [
    {
      title: '口语强化型',
      tag: 'ESL / Power Speaking',
      text: '适合想增加一对一开口时间、改善听说基础、建立英语表达信心的学生。',
      examples: '菲律宾宿务EV语言学校、菲律宾宿务First English Global College、菲律宾宿务CPI语言学校、菲律宾宿务I.BREEZE语言学校、菲律宾宿务Cebu Blue Ocean Academy、菲律宾宿务CELLA Premium Campus、菲律宾宿务QQEnglish（Beachfront Campus）、菲律宾宿务STARGATE Global Education、菲律宾宿务Winning English Academy、菲律宾宿务Global Language Cebu、菲律宾宿务Curious World Academy、菲律宾宿务CIJ Academy（Premium Campus）、菲律宾宿务CG Academy（Sparta Campus）、菲律宾宿务IU English Academy、菲律宾宿务Lapulapu、菲律宾宿务Philinter语言学校、Howdy English Academy、Genius English Academy',
    },
    {
      title: '考试备考型',
      tag: 'IELTS / TOEIC / TOEFL',
      text: '适合有明确分数目标，需要模考、写作批改、口语反馈和保证班规则的学生。',
      examples: 'CIA、SMEAG Capital、菲律宾宿务CG Academy（Sparta Campus）、菲律宾宿务QQEnglish（Beachfront Campus）、菲律宾宿务STARGATE Global Education、菲律宾宿务Winning English Academy、菲律宾宿务Global Language Cebu、菲律宾宿务Curious World Academy、菲律宾宿务CIJ Academy（Premium Campus）、菲律宾宿务Cebu Blue Ocean Academy、菲律宾宿务EV语言学校、菲律宾宿务CPILS语言学校、菲律宾宿务English Fella语言学校',
    },
    {
      title: '亲子青少年型',
      tag: 'Family / Junior Camp',
      text: '适合家长陪读、寒暑假短期体验、孩子先适应英语环境和海外课堂的家庭。',
      examples: 'CIA、菲律宾宿务First English Global College、菲律宾宿务QQEnglish（Beachfront Campus）、菲律宾宿务STARGATE Global Education、菲律宾宿务Winning English Academy、菲律宾宿务Global Language Cebu、菲律宾宿务IU English Academy、菲律宾宿务Cebu Blue Ocean Academy、菲律宾宿务CELLA Premium Campus、菲律宾宿务Lapulapu、Howdy English Academy、Genius English Academy、菲律宾宿务CPI语言学校、EV Academy La Mer',
    },
    {
      title: '度假舒适型',
      tag: 'Resort / Balanced',
      text: '适合重视住宿、餐食、泳池、校园环境和周末体验，同时希望保持稳定课程强度的人群。',
      examples: 'CIA Mactan、菲律宾宿务QQEnglish（Beachfront Campus）、菲律宾宿务Cebu Blue Ocean Academy、菲律宾宿务CELLA Premium Campus、菲律宾宿务STARGATE Global Education、菲律宾宿务Winning English Academy、菲律宾宿务Global Language Cebu、菲律宾宿务Curious World Academy、菲律宾宿务CIJ Academy（Premium Campus）、菲律宾宿务I.BREEZE语言学校、Howdy English Academy、Genius English Academy、菲律宾宿务CPI语言学校',
    },
  ];

  readonly schoolProfiles: SchoolProfile[] = [
    {
      name: '菲律宾宿务 CIA 语言学校',
      location: '麦克坦岛 / Lapu-Lapu City',
      style: '半斯巴达+，度假型新校区',
      route: '/philippines-study/cebu/cia-cebu-international-academy',
      startingPrice: 'USD 660 / 1周起',
      courses: [
        'Cambridge ESL',
        'IELTS / IDP 考点',
        'TOEIC',
        'Business English',
        'Immersion',
        'Family & Junior',
      ],
      accommodation: '校内宿舍，常见房型包括单人、双人、三人、四人和套房。',
      facilities:
        '泳池、餐厅、图书馆、健身房、医务室、迷你商店、篮球/排球场、祈祷室、卡拉 OK 和 IDP IELTS 考场。',
      bestFor: '想兼顾校园设施、考试资源、生活便利和国际学生氛围的学生。',
      note: '适合第一次宿务游学、雅思备考、亲子/青少年项目，但旺季房型和入学日要提前确认。',
    },
    {
      name: '菲律宾宿务First English Global College',
      location: '麦克坦新城 / Lapu-Lapu City',
      style: '日系运营，高比例一对一与亲子友好',
      route: '/philippines-study/cebu/first-english-global-college',
      startingPrice: 'JPY 198,000 / 4周起',
      courses: [
        'GENERAL ESL',
        '6 Man-to-Man',
        '7 Man-to-Man',
        'Perfect Man to Man',
        'Kids ESL / Eiken',
        'Business / TOEIC / IELTS',
        '通学课程',
      ],
      accommodation: '麦克坦新城公寓或车程约5分钟的Share House；亲子家庭通常使用公寓方案。',
      facilities:
        '一对一教室、小组课教室、儿童空间、自习座位、Wi-Fi；周边有咖啡厅、麦当劳、便利店和餐厅。',
      bestFor:
        '亲子游学、第一次宿务游学、想住在麦克坦并提高一对一口语课比例的学生。',
      note: '官方2025年11月后费用以日元列示；入学金、SSP、SSP E-Card、签证、教材、水电、餐食、机票和保险需要另行确认。',
    },
    {
      name: '菲律宾宿务CIEC',
      location: 'Talamban / Cebu City',
      style: '亲子与青少年专门校，Junior / Family / School Preparation',
      route: '/philippines-study/cebu/ciec',
      startingPrice: 'USD 1,650 / 4周起',
      courses: [
        'Kindergarten',
        'Junior Academic',
        'Junior Sparta',
        'Junior IELTS / TOEFL',
        'School Preparation',
        'Overseas School',
        'Guardian ESL',
        'Guardian Business / IELTS',
      ],
      accommodation:
        '校内或外部宿舍以2人房、3人房为主；公开2026价目表列出4周住宿费USD 930 / 850。',
      facilities:
        '低层校区、学生宿舍、食堂、泳池、自习室、便利生活支持、24小时安全与青少年管理。',
      bestFor:
        '亲子游学、低龄英文、青少年单独游学、国际学校入学准备、以及家长陪读同时学习英文的家庭。',
      note:
        '公开费用以USD列示；SSP、SSP E-Card、签证、押金、教材、水电管理、活动、保险和机票等另计。',
    },
    {
      name: '菲律宾宿务ELSA International Language School',
      location: 'Compostela / Cebu',
      style: '自然度假型亲子校，Kindergarten / Junior / Guardian / Adult ESL',
      route: '/philippines-study/cebu/elsa-international-language-school',
      startingPrice: 'USD 1,850 / 4周起（Super Basic ESL + 五人间 + 注册费）',
      courses: [
        'Super Basic ESL',
        'Basic / General / Intensive ESL',
        'Super Intensive ESL',
        'Guardian / Guardian ESL / Guardian Golf',
        'Junior ESL（7-14岁）',
        '全天 / 半天学校（7-14岁）',
        'Kindergarten（3-6岁）',
        '幼儿园保姆托管',
      ],
      accommodation:
        '2026-2027价目表列2/3/4/5人间套餐；单人间在双人间价格上加USD 500。监护人不上课只公布3/4/5人间价格。',
      facilities:
        '大型自然校区、泳池、草地、操场、散步路线、食堂、JC Mart、教室、幼儿园和校内护士等亲子支持。',
      bestFor:
        '想让孩子在自然环境中学习、亲子陪读、幼儿园或Junior ESL、家长也想轻量学习英文的家庭。',
      note:
        '2026-2027课程食宿主费以USD计价，注册费USD 100另计；SSP、签证、押金、设施费、空调、教材、接送和活动等PHP当地费用另计。',
    },
    {
      name: '菲律宾宿务ETHOS Language School',
      location: 'Basak San Nicolas / Cebu City',
      style: '美国老师小班型，American English / Group / Home Stay / Family',
      route: '/philippines-study/cebu/ethos-language-school',
      startingPrice: 'USD 1,438 / 4周起',
      courses: [
        'Classroom English 4 Hours',
        'Classroom English 5 Hours',
        'Group Class',
        'Man-to-Man（需确认）',
        'Family English',
        'Kids Camp',
      ],
      accommodation:
        '公开资料列Dormitory、Home Stay和自行住宿；Dormitory 4小时Group 4周USD 1,781起，Home Stay 4周USD 2,011起。',
      facilities:
        '小规模教室、学生休息/图书空间、宿舍、公用厨房、Homestay家庭环境；学校靠近Shopwise、McDonald’s South和SM Seaside生活圈。',
      bestFor:
        '想由美国籍老师训练美式发音、会话、阅读、语法和写作，喜欢小班互动、Home Stay或家庭式学习氛围的学生。',
      note:
        '公开价格表为USD套餐价；Immigration、餐食加购、洗衣、市内交通、医疗、活动、机票和保险等另计。',
    },
    {
      name: '菲律宾宿务IMS Academy',
      location: 'Banilad / Ma. Luisa, Cebu City',
      style: '韩资多国籍，ESL / IELTS / TOEIC / Senior / Junior / Family',
      route: '/philippines-study/cebu/ims-academy',
      startingPrice: 'USD 1,500 / 4周起',
      courses: [
        'Essential ESL 4',
        'Premium ESL',
        'Intensive ESL',
        'Senior ESL',
        'IELTS / TOEIC',
        'Business / Power Speaking',
        'Junior ESL',
        'Parents ESL',
      ],
      accommodation:
        '校内1/2/3/4人房；2026公开USD套餐价含学费+宿舍，Essential ESL 4 + 4人房4周USD 1,400起，注册费USD 100另计。',
      facilities:
        '1:1/Group/Junior教室、24小时自习室、学生休息区、食堂、自炊厨房、宿舍、Wi-Fi、CCTV/警卫、清洁和洗衣服务。',
      bestFor:
        '想住宿务Banilad安全生活圈、需要ESL/考试/亲子/青少年/Senior多路线、又想要日本人比例较低和多国籍环境的学生。',
      note:
        '公开资料对币种/年份口径存在差异；本页以近期公开2026美元套餐表做预算，并附官方IMS资料用于校区和课程核对。',
    },
    {
      name: '菲律宾宿务TARGET Global English Academy',
      location: 'Tigbao / Talamban, Cebu City',
      style: '日系成人友好，高性价比1:1 / Lite 4 / TARGET 4 / 5 / 6 / IELTS',
      route: '/philippines-study/cebu/target-global-english-academy',
      startingPrice: 'USD 1,430 / 4周起',
      courses: [
        'Lite 4',
        'TARGET 4',
        'TARGET 5',
        'TARGET 6',
        'TARGET ULTIMATE 8',
        'IELTS',
        'Working Holiday',
        'TOEIC / Business elective',
      ],
      accommodation:
        '校内1/2/3/4/6人房；官方2026年价格表中Lite 4 + 6人房4周USD 1,280起，入学金USD 150另计。',
      facilities:
        '一对一教室、小组教室、自习室、多功能室、餐厅、泳池、户外休息区、篮球、台球、乒乓、Wi-Fi、饮水机和24小时警卫。',
      bestFor:
        '想控制预算、提高一对一课量、喜欢日系支持和安静Talamban学习环境的成人、初学者、TOEIC或打工度假准备学生。',
      note:
        '当前活动折扣参考为3周减USD 60、4周减USD 120、6周减USD 180、12周减USD 420；申请时间和旺季限制需确认，SSP、签证、教材、水电、共益费、押金、接机和洗衣等另计。',
    },
    {
      name: '菲律宾宿务CIJ Academy（Premium Campus）',
      location: 'Mabolo / Kasambagan, Cebu City（当前校区与住宿地址需按当期确认）',
      style: 'Premium舒适型，1:1口语 / Native / Business / TOEIC',
      route: '/philippines-study/cebu/cij-academy-premium-campus',
      startingPrice: 'USD 1,300 / 4周起',
      courses: [
        'ESL 4',
        'Premium Course',
        'Basic Speaking',
        'Power Speaking',
        'Power Native',
        'Intensive Native',
        'Basic Business',
        'Power TOEIC',
      ],
      accommodation:
        '公开Premium费用表按Superior单人、Premium单人、2人房、3人房、4人房区分；近年资料也出现Premium Dormitory / Weber Hotel口径，需按当期确认。',
      facilities:
        '公开资料列泳池、健身房、桑拿、舞蹈厅、桌球、厨房、洗衣、LCD TV、1:1教室、小组教室和Native教室等。',
      bestFor:
        '想兼顾舒适住宿、高比例一对一口语、Native课程、商务英语或TOEIC方向的成人学生。',
      note:
        '用户提供的CIEC Global网址与CIJ Premium公开资料名称不同；报名时需先核对学校主体、实际校区、住宿地址、费用表和当前招生规则。',
    },
    {
      name: '菲律宾宿务Curious World Academy',
      location: 'Mabolo / Cebu City',
      style: '日系运营，市区半斯巴达 / ESL / TEST / Business / Working Holiday',
      route: '/philippines-study/cebu/curious-world-academy',
      startingPrice: 'USD 1,550 / 4周起',
      courses: [
        'ESL Standard',
        'ESL Intensive',
        'ESL Super Intensive',
        'TEST Standard',
        'TEST Intensive',
        'TEST Super Intensive',
        'Business English',
        'Workcation Light',
      ],
      accommodation:
        '原酒店改造的同楼学习住宿环境，公开2026费用表按1人房、2人房、3人房、4人房计算；房型和性别空位需当期确认。',
      facilities:
        '公开资料列一对一教室、小组教室、自习室、学生休息区、食堂、泳池、健身房、Wi-Fi和冷气宿舍等。',
      bestFor:
        '想住宿务市区、重视日系支持、出发前学习规划、一对一课量和预算控制的成人学生。',
      note:
        '公开来源对注册费和餐食口径存在差异；报名时需确认CWA当期正式报价、住宿空位、SSP/签证/押金/水电/教材等当地费用。',
    },
    {
      name: '菲律宾宿务Global Language Cebu',
      location: 'Mabolo / Cebu City',
      style: '日系运营大型综合校，Power Speaking / Family / TOEIC / IELTS / Business',
      route: '/philippines-study/cebu/global-language-cebu',
      startingPrice: 'USD 1,720 / 4周起',
      courses: [
        'Power Speaking',
        'Intensive Power Speaking',
        'Ultra7 Power Speaking',
        'Family Package',
        'Kids / Junior English',
        'TOEIC',
        'IELTS',
        'Business English',
        'English + Internship',
      ],
      accommodation:
        'Main / Annex2校内宿舍单人、双人、三人房为主，另有酒店住宿口径需另行核价；官方公开Power Speaking套餐通常含学费、住宿和每日三餐。',
      facilities:
        'Mabolo大型校区，公开资料列一对一教室、小组教室、餐厅、泳池、健身房、游戏室、桌球/乒乓、自习区、商店和高速Wi-Fi。',
      bestFor:
        '想住宿务市区Mabolo、兼顾课程选择、设施、活动、多国籍环境和高性价比的一般英语、考试或亲子学生。',
      note:
        '前身为IDEA CEBU，2022年11月迁入现校区并更名GLC；正式报名需确认房型、短期附加费、长期优惠、入学金、接机和当地费用。',
    },
    {
      name: '菲律宾宿务QQEnglish（Beachfront Campus）',
      location: 'Mactan Newtown / Lapu-Lapu City',
      style: '海滨新校区，菲律宾外教一对一 / Group / 胶囊学生寮 / 自理住宿弹性',
      route: '/philippines-study/cebu/qqenglish-beachfront-campus',
      startingPrice: 'USD 1,395 / 4周起（胶囊学生寮+餐食套餐）',
      courses: [
        '4 Man-to-Man',
        '4 Man-to-Man + 2 Group',
        '6 Man-to-Man',
        '6 Man-to-Man + 2 Group',
        '8 Man-to-Man',
        'Callan Method',
        'R.E.M.S.',
        'Business English',
        'TOEIC / IELTS',
        'Kids English',
      ],
      accommodation:
        'Beachfront公开住宿以胶囊学生寮为主，官方也列只上课方案，适合自行安排酒店、公寓或外部住宿的学生。',
      facilities:
        'Mactan Newtown海滨校区，公开资料列Beach、Rooftop、Gym、Recreational Area、Cafeteria、Capsule Dormitory和学习区。',
      bestFor:
        '想在麦克坦海边新校区学习、重视一对一课量、短期弹性、能接受胶囊宿舍或愿意自理住宿的成人或亲子学生。',
      note:
        '官方英文表列只上课价格，日文Beachfront表列含学生寮与餐食套餐；报名时需确认住宿餐食、注册费、SSP、签证、教材、电费、假日费和接机。',
    },
    {
      name: '菲律宾宿务STARGATE Global Education',
      location: 'Kasambagan / Cebu City',
      style: '日本资本小规模全寮制，初学者友好 / Man-to-Man / TOEIC / Business',
      route: '/philippines-study/cebu/stargate-global-education',
      startingPrice: 'USD 1,350 / 4周起',
      courses: [
        'Standard Course',
        'Power Speaking Course',
        'Man-to-Man Course',
        'Enjoy Course',
        'TOEIC Course',
        'TOEIC Mix Course',
        'Business Course',
        'Junior 4 / 5 / 6',
      ],
      accommodation:
        '学校和宿舍在Tancor 5同一栋建筑内，公开房型包括Premium 1/2人房、Study Focus 1/2/4人房，大部屋需按需求确认。',
      facilities:
        'Tancor 5公寓式校舍，公开资料列24小时安保、学生休息区、食堂、屋顶泳池、健身房、Wi-Fi、热水、阳台和洗衣区域。',
      bestFor:
        '英语初学者、第一次海外游学、想要日本职员支持、小规模学校、同楼住宿和预算可控的成人或亲子学生。',
      note:
        '官方2026美元主费通常含授课、宿舍、平日三餐、周末节假日Brunch和清扫；SSP、签证、押金、水电、教材、管理费和接机另计。',
    },
    {
      name: '菲律宾宿务Winning English Academy',
      location: 'City Campus / Cebu City；Ocean Campus / Mactan Island',
      style: '台资多校区，City市区综合型 / Ocean海岛度假亲子型 / Cambridge ESL / IELTS / TOEIC / Business',
      route: '/philippines-study/cebu/winning-english-academy',
      startingPrice: 'USD 1,095 / 4周起（Ocean Cambridge ESL2 Backpacker 8人房）',
      courses: [
        'Cambridge ESL2',
        'Cambridge ESL4',
        'Power Speaking6',
        'Speaking Focus8',
        'Travel English',
        'Business English',
        'TOEIC',
        'IELTS',
        'Guardian / Kids / Junior',
      ],
      accommodation:
        'Ocean Campus公开房型包括Standard Hotel 1/2人房、Backpacker 4人房（女性）、Backpacker 8人房（男性）和Family 3人房；City Campus另有Premium Hotel、Diplomat/ABC合作住宿和Backpacker房型。',
      facilities:
        'Ocean Campus位于Mactan度假生活圈，公开资料列泳池、1:1与小组教室、自习室、学生餐厅、学生经理、Wi-Fi；City Campus位于Ramos市区，生活机能和外部宿舍选择更强。',
      bestFor:
        '想在台资多国籍环境中学习、选择City或Ocean校区、兼顾口语、考试、商务、亲子/青少年和短期活动的学生。',
      note:
        '本页报价器以公开2026 Ocean Campus价格表为参考；City / Lyf / Camp、促销、旺季费、当地费用和房型空位需报名时确认。',
    },
    {
      name: '菲律宾宿务GLANT English Academy语言学校',
      location: 'Kasambagan / Old Banilad, Cebu City',
      style: '小规模自由型，Native Speaker课程',
      route: '/philippines-study/cebu/glant',
      startingPrice: 'USD 303 / 1周起',
      courses: [
        'Mini ESL',
        'Regular ESL',
        'Intensive ESL',
        'Premium ESL',
        'IELTS',
        'Native Speaker Class',
      ],
      accommodation: '校内或同楼住宿，公开费用表按单人、双人、三人房区分，三人房预算最低。',
      facilities:
        '一对一教室、办公室、餐厅、公共休息区、宿舍；周边有商场、咖啡厅、餐厅、银行和日常生活设施。',
      bestFor:
        '预算敏感、喜欢自由度、不需要斯巴达管理、想在宿务市区小规模学校学习的成人学生。',
      note: '课程食宿费以美元公布；注册费、接机费、SSP、教材、水电、押金、洗衣和签证延长等另计。',
    },
    {
      name: '菲律宾宿务ICL English Academy',
      location: '110 Gorordo Avenue, Cebu City',
      style: '市区半斯巴达，Power Speaking与考试课程',
      route: '/philippines-study/cebu/icl',
      startingPrice: 'USD 1,350 / 4周起',
      courses: [
        'Light Speaking',
        'Power Speaking 4 / 6 / 8',
        'IELTS / IELTS Guarantee',
        'TOEIC',
        'Junior',
        'Parents Course',
      ],
      accommodation:
        '校内1/2/3/4人房，另有步行约2分钟的Goldberry Suites外部宿舍选择，费用按课程和房型分开公布。',
      facilities:
        '一对一教室、小组教室、食堂、健身房、桌球/台球、儿童活动区、Wi-Fi、洗衣区、饮水机和校内医务室。',
      bestFor:
        '想在宿务市区读半斯巴达、提高一对一口语课时，或选择雅思、多益、亲子/青少年课程的学生。',
      note: '课程食宿费以美元公布；入学金、SSP、签证、教材、水电维护、押金、洗衣、接机和个人生活费另计。',
    },
    {
      name: '菲律宾宿务3D Academy',
      location: 'JY Square, Lahug / Cebu City',
      style: '日系老牌高性价比，市中心生活便利',
      route: '/philippines-study/cebu/3d-academy',
      startingPrice: 'USD 1,189 / 4周起（课程 + 住宿）',
      courses: [
        'General ESL',
        'Intensive ESL',
        'Power MTM',
        'TOEFL / TOEIC / IELTS及预备课程',
        'Business English',
        'Junior ESL',
        'Sparta Management / Guardian',
      ],
      accommodation:
        '校内1/2/3/4/6人房，另有MIT / Yello Hotel校外酒店房及Prestigio单人、双人和亲子房。',
      facilities:
        '一对一教室、小组教室、自习室、EOP Room、餐厅、校内诊所、儿童房、祈祷室、Wi-Fi、JY Square健身房使用、24小时商业楼保安。',
      bestFor:
        '预算敏感、想住在宿务市中心、第一次菲律宾游学、想提高一对一口语课时，或想用Walk-in方案自理住宿的学生。',
      note: '课程食宿费以美元公布；入学金、SSP、签证、教材、电费、维护费、押金、接机和个人生活费另计。官方2026说明提到10月计划搬迁至MIT Building，报名时需确认实际校区。',
    },
    {
      name: '菲律宾宿务CELLA Uni Sparta Campus',
      location: 'Talamban / Cebu City',
      style: '斯巴达管理，Power Speaking / IELTS / TOEIC / TESOL',
      route: '/philippines-study/cebu/cella-uni-sparta-campus',
      startingPrice: 'USD 1,630 / 4周起（食宿主价）',
      courses: [
        'Power Speaking 1 / 2',
        'TOEIC Preparation / Intensive',
        'IELTS Preparation / Intensive',
        'IELTS Guarantee',
        'TESOL',
        'Expresser 1 / 2',
      ],
      accommodation:
        'Uni校内1/2/3/4人房，以及JDN外部寮1/2/3人房；费用按4周学费加宿舍费计算，短期按公开比例折算。',
      facilities:
        '一对一教室、小组教室、自习室、食堂、泳池、健身房、咖啡区、诊所、学生支持办公室、校内住宿和JDN外部寮接驳安排。',
      bestFor:
        '目标明确、想要斯巴达学习节奏、希望强化口语或IELTS/TOEIC考试，也想考虑TESOL或1-2周密集课程的学生。',
      note: '课程和宿舍主价以美元公布；入学金USD 150、旺季加价USD 40/周、SSP、签证、教材、水电管理、押金、接机和个人生活费另计。',
    },
    {
      name: '菲律宾宿务CG Academy（Sparta Campus）',
      location: '1951-A-1 Uldog, Cansojong, Talisay City, Cebu',
      style: '宿务斯巴达专门校，ESL / TOEIC / IELTS / Business / Short-Term ESL',
      route: '/philippines-study/cebu/cg-academy-sparta-campus',
      startingPrice: 'USD 1,550 / 4周起',
      courses: [
        'Sparta Course',
        'Premier Sparta Course',
        'TOEIC Sparta / Premier',
        'IELTS Basic / Intensive',
        'IELTS Guarantee',
        'Business English',
        'Short-Term ESL 1 / 2 weeks',
      ],
      accommodation:
        '校内1人房、2人房、3人房、4人房，以及M&J Pension外部寮1人房参考；课程、住宿和三餐集中在校区内完成。',
      facilities:
        'Talisay安静校区、泳池、健身房、篮球场、桌球室、食堂、自习室、卖店、校内宿舍和EOP/晚自习学习管理。',
      bestFor:
        '自律不足但目标明确、想要高强度管理、TOEIC/IELTS备考或中长期集中学习的学生。',
      note: '平日外出、门禁、EOP、单词测试、作文和强制自习需提前确认；注册费、旺季费、SSP、签证、押金、水电、冷气电费、教材和接机另计。',
    },
    {
      name: '菲律宾宿务CG Academy（Banilad Campus）',
      location: 'Base Camp, Maria Luisa Road, Banilad, Cebu City',
      style: '市区半斯巴达，ESL / IELTS / TOEIC / Business / Family',
      route: '/philippines-study/cebu/cg-academy-banilad-campus',
      startingPrice: 'USD 1,400 / 4周起（含注册费）',
      courses: [
        'Light ESL',
        'General ESL',
        'Intensive ESL',
        'Power ESL',
        'Semi-Sparta',
        'IELTS Basic',
        'TOEIC Basic',
        'Business English',
        'Family Junior / Guardian',
      ],
      accommodation:
        'Banilad校内1/2/3/4人房，以及Alicia和88th Avenue校外1/2/3/4人房；4周住宿费USD 650-1,700。',
      facilities:
        '泳池、自习室、Dining Area、Cafe、Gym、办公室和Banilad生活圈；官方资料提到餐厅、超市、按摩等生活资源便利。',
      bestFor:
        '想在宿务市区兼顾半斯巴达学习推动、生活便利、预算控制和亲子/ESL/考试路线的学生。',
      note:
        'Banilad 2026课程与住宿主费以USD公布；SSP、SSP E-Card、签证、教材、水电、管理费、押金和接机等PHP当地费用另计。',
    },
    {
      name: '菲律宾宿务SMEAG Capital语言学校',
      location: 'Guadalupe, Cebu City',
      style: 'Sparta / Semi-Sparta，市区考试型校区',
      route: '/philippines-study/cebu/smeag-capital',
      startingPrice: 'USD 1,580 / 4周起',
      courses: [
        'ESL by Cambridge',
        'Speaking Master',
        'IELTS / IELTS Guarantee',
        'TOEIC',
        'TOEFL',
        'Business English',
        'Family Program',
      ],
      accommodation:
        '宿舍与教室集中在同一校区，公开参考房型包括单人、双人、三人和四人房。',
      facilities:
        '餐厅、自习空间、咖啡区、健身设施、学生服务窗口和考试/模考相关资源，适合市区集中学习。',
      bestFor:
        '想在宿务市区读ESL、雅思、多益、托福或商务英语，并能接受学习管理规则的学生。',
      note: '前4周早晚Sparta课程、门禁、保证班规则、当地费用和房型空位建议报名前逐项确认。',
    },
    {
      name: '菲律宾宿务Genius English Academy语言学校',
      location: 'Maribago, Lapu-Lapu City / Mactan',
      style: '海边度假型，多国籍，Non-Sparta / Semi-Sparta / Sparta',
      route: '/philippines-study/cebu/genius-english-academy',
      startingPrice: 'USD 1,400 / 4周起',
      courses: [
        'General English A/B',
        'Power Speaking',
        'Survival English',
        'IELTS / IELTS Guarantee',
        'TOEIC',
        'TOEFL',
        'Business English',
        'Family Program',
      ],
      accommodation:
        'EGI酒店式宿舍，常见单人、双人、三人和家庭安排，另有Regular、Sea View、Deluxe等房型。',
      facilities:
        '泳池、海边、健身房、餐厅、24小时前台、学习室、咖啡/酒吧、便利店和酒店式公共设施。',
      bestFor:
        '想兼顾海边生活、国际学生环境、Native group class、成人口语、商务/考试或亲子课程的学生。',
      note: '旺季、Sea View/Deluxe房型、Sparta附加费和当地费用需报名前确认。',
    },
    {
      name: '菲律宾宿务Howdy English Academy语言学校',
      location: 'Mandaue City / Maayo Hotel',
      style: '日系酒店型，一对一课程为主，亲子与成人短期友好',
      route: '/philippines-study/cebu/howdy-english-academy',
      startingPrice: 'USD 874 / 1周起',
      courses: [
        'General Course - 5',
        'General Course - 7',
        'Family Course',
        'Online Lessons',
        'STEP',
      ],
      accommodation:
        'Maayo Hotel 4星酒店住宿为主，公开资料也列出公寓型住宿方案；房型需按单人、双人、亲子和同行规则确认。',
      facilities:
        '酒店住宿、早餐、午餐、Wi-Fi、学习空间、健身房、泳池、餐厅、咖啡厅、近医院和周边商场生活配套。',
      bestFor:
        '想要安全舒适酒店环境、日系支持、大量一对一口语课、第一次游学或亲子短期项目的学生。',
      note: '晚餐、SSP、签证延长、公寓水电、亲子/未成年规则和正式空房需报名前确认。',
    },
    {
      name: '菲律宾宿务I.BREEZE语言学校',
      location: 'Mabolo, Cebu City',
      style: '市区度假式综合校区，口语强化，多国籍',
      route: '/philippines-study/cebu/ibreeze',
      startingPrice: 'USD 1,490 / 4周起',
      courses: [
        'Power ESL',
        'Intensive Beginner',
        'Light ESL',
        'Intensive Speaking',
        'IELTS Target',
        'TOEIC Target',
        'General Business & BEC',
        'Junior ESL & YLE',
      ],
      accommodation:
        'IB1 / IB2校内宿舍提供单人、双人、三人和四人房；另有校外公寓单人、双人及3-5人家庭房。',
      facilities:
        '泳池、餐厅、宿舍、自习空间、活动课、洗衣和市区生活配套，适合学习与生活平衡。',
      bestFor:
        '想在宿务市区兼顾口语课量、多国籍环境、校区舒适度、商务/考试或Junior课程的学生。',
      note: '注册费、接机费、SSP、E-Card、押金、教材、水电、签证延长和房型空位需报名前确认。',
    },
    {
      name: '菲律宾宿务IU English Academy',
      location: 'General Maxilom Ave, Cebu City',
      style: '市区独立校区，Power Speaking / Fitness / IELTS / TOEIC / 亲子',
      route: '/philippines-study/cebu/iu-english-academy',
      startingPrice: 'USD 1,350 / 4周起',
      courses: [
        'Light Speaking',
        'Beginner 4 / 6',
        'Power Speaking 4 / 6 / 8',
        'IELTS / IELTS Guarantee',
        'TOEIC',
        'Business English',
        'Fitness English',
        'Kids / Teenagers / Parents',
      ],
      accommodation:
        '校内单人、双人、三人、四人房，另有Soleil Suites外部宿舍参考；房型和促销价需按日期确认。',
      facilities:
        '70间一对一教室、15间小组教室、餐厅、咖啡区、自习室、屋顶泳池、健身房、台球、儿童游戏区和球场。',
      bestFor:
        '想在宿务市区兼顾口语、考试、商务、Fitness、亲子课程和运动设施的学生。',
      note: '促销价、注册费、SSP/E-Card、押金、水电、维护费、洗衣、签证延长和房型空位需报名前确认。',
    },
    {
      name: '菲律宾宿务Lapulapu',
      location: 'Ticgahon 1 Road, Bankal, Lapu-Lapu City',
      style: 'LCIC大学型英语项目，固定4/14/18周档期，Buddy System',
      route: '/philippines-study/cebu/lapulapu',
      startingPrice: 'USD 2,080 / 4周起',
      courses: [
        'Short-Term Study Abroad',
        'Mid-Term Study Abroad 14 / 18 weeks',
        'English Communication Skills',
        'Presentation Skills',
        'TOEIC S&W',
        'SDGs / Philippine Culture',
        'Buddy System',
        'Optional 1-on-1',
      ],
      accommodation:
        '校内share-house式宿舍，国际学生通常住私人房，公共客厅、学习室、活动室、浴场、桑拿和洗衣区共享。',
      facilities:
        '大学型校园、宿舍楼、餐厅、学习室、活动室、大浴场、露天浴、桑拿、24小时宿舍管理、安保、医护支持和Buddy交流环境。',
      bestFor:
        '想体验大学校园、固定短中期游学、私人房住宿、菲律宾本地学生交流和跨文化课程的学生。',
      note: '固定档期和报名截止日需提前确认；主费用含课程、宿舍、三餐和水电，入学金、教材、机票保险、可选1:1和个人消费另行核对。',
    },
    {
      name: '菲律宾宿务Cebu Blue Ocean Academy',
      location: 'EGI Hotel Bldg 5, Looc Maribago, Lapu-Lapu City',
      style: 'Mactan海边度假型，PINES姊妹校，ESL / IELTS / TOEIC / Business / Junior',
      route: '/philippines-study/cebu/cebu-blue-ocean-academy',
      startingPrice: 'USD 1,820 / 4周起',
      courses: [
        'Light ESL 4',
        'Intensive ESL',
        'Survival ESL',
        'Power ESL 5 / 7',
        'Business English',
        'TOEIC / IELTS',
        'Junior / Parents 3H / Senior Course',
      ],
      accommodation:
        'EGI Hotel海景/市景双人房、海景三人房，以及Ocean Suites单人房；公开价格中学费和住宿费分开计算。',
      facilities:
        'Mactan海边环境、泳池、健身房、餐厅、自习室、商务休息室、洗衣服务、Pines Portal和多国籍学生支持。',
      bestFor:
        '想在Mactan海边校区学习，重视一对一课程、PINES教学体系、三餐住宿和度假生活体验的学生或家庭。',
      note: '注册费、学费、住宿费、旺季加价和当地费用需分开核算；SSP、签证、押金、教材、水电、管理费、接机和洗衣另行确认。',
    },
    {
      name: '菲律宾宿务CELLA Premium Campus',
      location: 'One Paseo Compound, Ma. Paseo Saturnino, Cebu City',
      style: '宿务市区Premium型，口语强化 / 商务 / Working Holiday / ACE / 亲子 / 短期密集',
      route: '/philippines-study/cebu/cella-premium-campus',
      startingPrice: 'USD 1,580 / 4周起',
      courses: [
        'Light ESL',
        'Power Speaking 1 / 2',
        'BPE Preparation / Intensive',
        'Working Holiday',
        'Airline Cabin Crew English',
        'Expresser 1 / 2 weeks',
        'Family Package',
      ],
      accommodation:
        '校内1人房、半单人房、2人房、4人房、6人房，以及Alicia外部寮1人/2人房；套餐价通常含课程、住宿、餐食、清扫和洗衣。',
      facilities:
        '市区酒店式校区、泳池、食堂、自习室、卖店、Wi-Fi、校内宿舍、外部寮和Banilad / A.S. Fortuna生活圈。',
      bestFor:
        '想在宿务市区住得更舒适、重视一对一口语、商务英语、短期密集或亲子课程的学生。',
      note: '注册费、旺季加价、SSP、签证、ACR、押金、水电、教材、管理费、ID、接机和个人生活费需分开确认。',
    },
    {
      name: '菲律宾宿务EV语言学校',
      location: 'Nasipit, Cebu City',
      style: 'SP1 斯巴达 / SP2 半斯巴达',
      route: '/philippines-study/cebu/ev-academy',
      startingPrice: 'USD 716 / 1周起',
      courses: [
        'ESL',
        'Power Speaking',
        'IELTS / IELTS Guarantee',
        'TOEIC',
        'Business English',
        'Family Course',
        'Digital English',
      ],
      accommodation: '校内住宿，配合严格门禁与学习计划管理。',
      facilities:
        '官方页面列有校园、宿舍、教学楼和设施图库，课程与住宿在同一校园内完成。',
      bestFor:
        '目标清晰、能接受管理制度、想在宿务进行高密度学习或考试冲刺的学生。',
      note: 'SP1 更适合强目标和自律需求；SP2 适合想保留部分宿务生活体验的学生。',
    },
    {
      name: '菲律宾宿务CPI语言学校',
      location: 'Cebu City / Nivel Hills',
      style: '半斯巴达，度假村式校园',
      route: '/philippines-study/cebu/cpi-cebu-pelis-institute',
      startingPrice: 'USD 1,670 / 4周起（ESL GENERAL + A栋四人间）',
      courses: [
        'General ESL',
        'Intensive ESL',
        'IELTS',
        'TOEIC',
        'TOEFL',
        'Business English',
        'Junior / Parent',
      ],
      accommodation: '校内宿舍，常见从单人到多人房，并有家庭或高阶房型选择。',
      facilities:
        '以度假型环境、泳池、健身设施和餐食评价见长，适合重视生活品质的学生。',
      bestFor:
        '口语提升、亲子家庭、短期强化，以及想降低第一次游学不适感的人群。',
      note: '校区位置相对安静，通勤和外出便利度需要结合个人生活习惯评估。',
    },
    {
      name: "菲律宾宿务B'Cebu语言学校",
      location: '宿务 / 麦克坦生活圈',
      style: 'ESL / IELTS / Sparta / 亲子与青少年',
      route: '/philippines-study/cebu/bcebu',
      startingPrice: 'USD 1,650 / 4周起（Speed ESL + 三人间）',
      courses: [
        'Speed ESL',
        'Intensive ESL',
        'IELTS / IELTS Guarantee',
        "B'SPARTA",
        'Business English',
        'Junior / Kindergarten',
      ],
      accommodation: '单人、双人、双人客厅套房、亲子加床、2+1与三人上下铺房型。',
      facilities: '课程与住宿集中安排，部分房型位于马克坦新城或面向校内花园。',
      bestFor: '成人ESL、雅思备考、需要斯巴达管理、40岁以上轻量课程或亲子青少年学生。',
      note: '1/2/3周按4周课程与住宿价格的40%/60%/80%计算；特殊房型需确认入住资格和淡旺季。',
    },
    {
      name: '菲律宾宿务CPILS语言学校',
      location: 'Cebu City',
      style: '斯巴达 / 半斯巴达，老牌考试型学校',
      route: '/philippines-study/cebu/cpils',
      startingPrice: 'USD 1,590 / 4周起',
      courses: [
        'ESL',
        'IELTS',
        'TOEIC',
        'TOEFL',
        'Business English',
        'PMC speaking',
      ],
      accommodation:
        '校内住宿为主，适合希望学习、住宿、管理集中在同一系统内的学生。',
      facilities:
        '以长期办学、考试课程和强化听说训练见长，部分资料特别提到健身设施。',
      bestFor: '想短期集中学习、能承受较高课程压力、需要雅思或多益路径的学生。',
      note: '课程强度和校规较明确，报名前应确认当前宿舍状态、门禁和保证班细则。',
    },
    {
      name: '菲律宾宿务English Fella语言学校',
      location: 'Cebu City / Talamban',
      style: '斯巴达与半斯巴达校区',
      route: '/philippines-study/cebu/english-fella',
      startingPrice: 'USD 1,550 / 4周起',
      courses: [
        'ESL',
        'IELTS',
        'TOEIC',
        'TOEFL',
        'IELTS Guarantee',
        'Business English',
      ],
      accommodation:
        '校内住宿，校园面积较大，适合想在稳定环境里长期学习的学生。',
      facilities: '以宽敞校园、泳池、运动设施和考试备考体系作为主要卖点。',
      bestFor: '雅思、多益、托福备考，以及希望在宿务保持较强学习纪律的学生。',
      note: '不同校区管理强度不同，需要按目标分数、外出自由度和预算分开比较。',
    },
    {
      name: '菲律宾宿务Philinter语言学校',
      location: '麦克坦岛 / Lapu-Lapu City',
      style: '半斯巴达，老牌综合型学校',
      route: '/philippines-study/cebu/philinter-academy',
      startingPrice: 'USD 1,600 / 4周主费起（注册费另计）',
      courses: [
        'General ESL',
        'Intensive Power Speaking',
        'IELTS',
        'Business English',
      ],
      accommodation:
        '校内宿舍与部分外部住宿选择，适合希望生活机能更便利的学生。',
      facilities: '以课程分科、学生关怀和多国籍环境为主要参考点。',
      bestFor:
        '成人口语、商务沟通、短中期 ESL，以及想住在机场和海岛资源附近的人群。',
      note: '适合学习生活平衡型学生；考试冲刺则建议和 CIA、EV、CPILS 同时比较。',
    },
  ];

  readonly decisionPoints: DecisionPoint[] = [
    {
      label: '课程目标',
      text: '先确定是口语开口、雅思/多益分数、商务场景、亲子陪读，还是青少年营队。',
    },
    {
      label: '管理强度',
      text: '斯巴达适合需要外部节奏推动的人；半斯巴达适合想学习和生活平衡；自律型适合成熟成人学生。',
    },
    {
      label: '住宿与餐食',
      text: '宿务热门学校房型差异明显，单人房、家庭房和海景/高阶房通常更早满房。',
    },
    {
      label: '总费用',
      text: '预算要同时看学费、住宿、当地费用、SSP、ACR、教材、水电、接机、机票和个人生活费。',
    },
    {
      label: '年龄与入学日',
      text: '亲子、青少年、保证班和短期强化课常有年龄、英文程度、报名周数或指定入学日要求。',
    },
    {
      label: '优惠与空房',
      text: '学校优惠会随淡旺季、周数、房型和国籍比例变化，报名之前需要以学校当期回复为准。',
    },
  ];

  readonly compareRows = [
    {
      label: '城市定位',
      cebu: '海岛城市，学校多，生活便利，体验感强',
      baguio: '山城凉爽，娱乐较少，学习氛围更集中',
    },
    {
      label: '学习强度',
      cebu: '从自律型到斯巴达都有，选择弹性大',
      baguio: '斯巴达和考试型学校更集中',
    },
    {
      label: '适合人群',
      cebu: '第一次游学、亲子、短期体验、口语和综合课程',
      baguio: '雅思/多益冲刺、长期学习、自律较弱的学生',
    },
    {
      label: '选校重点',
      cebu: '课程比例、住宿环境、校区位置、机场和活动便利度',
      baguio: '管理制度、模考体系、自习安排、学习时长',
    },
  ];

  readonly sources: SourceLink[] = [
    {
      label: 'CIA 官方学校信息',
      url: 'https://www.cebucia.com/en/about_us/about_us.php',
    },
    {
      label: 'First English Global College官方学校与费用信息',
      url: 'https://www.firstcebu.com/',
    },
    {
      label: 'CIEC官方学校信息',
      url: 'https://ciecglobal.com/',
    },
    {
      label: 'CIEC 2026费用与学校资料',
      url: 'https://www.fujiyama-international.com/philippines/ciec.html',
    },
    {
      label: 'ELSA官方学校网站',
      url: 'https://elsaschoolcebu.com/',
    },
    {
      label: 'ELSA 2026英文电子手册',
      url: 'https://fliphtml5.com/sncvz/erbc/20260226_%5BENG%5D_2026_ELSA_Brochure/',
    },
    {
      label: 'ELSA 2026费用与学校资料',
      url: 'https://www.fujiyama-international.com/philippines/elsa-international-language-school.html',
    },
    {
      label: 'ETHOS官方学校网站',
      url: 'https://ethos.ph/',
    },
    {
      label: 'ETHOS课程与公开价格',
      url: 'https://ethos.ph/prices/ethos-english-with-housing-price.html',
    },
    {
      label: 'ETHOS移民费用说明',
      url: 'https://ethos.ph/ethos-imm1.html',
    },
    {
      label: 'IMS Academy官方学校网站',
      url: 'https://www.ims7.com/',
    },
    {
      label: 'IMS Academy官方费用页',
      url: 'https://www.ims7.com/pp/sub/05/01_eng.php',
    },
    {
      label: 'IMS Academy 2026公开费用资料',
      url: 'https://cebu-english.com/school/ims/',
    },
    {
      label: 'TARGET官方学校网站',
      url: 'https://target-english.org/',
    },
    {
      label: 'TARGET官方2026费用页',
      url: 'https://target-english.org/tuition/',
    },
    {
      label: 'TARGET官方课程页',
      url: 'https://target-english.org/academic/course/',
    },
    {
      label: 'TARGET 2026费用参考',
      url: 'https://cebu-english.com/school/target/',
    },
    {
      label: 'CIJ Premium Campus学校与课程资料',
      url: 'https://cebu-cij.com/english/premium/english-school/',
    },
    {
      label: 'CIJ Premium Campus公开费用表',
      url: 'https://cebu-cij.com/chinese/cost/premium-campus/',
    },
    {
      label: 'Curious World Academy官方英文网站',
      url: 'https://curious-world-academy.com/en/',
    },
    {
      label: 'Curious World Academy 2026费用与课程',
      url: 'https://cebu-english.com/school/curiousworld-academy/',
    },
    {
      label: 'Global Language Cebu官方英文网站',
      url: 'https://www.glcenglish.com/',
    },
    {
      label: 'GLC官方学校资料',
      url: 'https://www.glcenglish.com/about/school',
    },
    {
      label: 'GLC Power Speaking官方费用',
      url: 'https://www.glcenglish.com/program/power-speaking',
    },
    {
      label: 'GLC 2026费用与当地费用参考',
      url: 'https://www.fujiyama-international.com/philippines/idea-cebu.html',
    },
    {
      label: 'QQEnglish官方英文网站',
      url: 'https://qqeng.net/',
    },
    {
      label: 'QQEnglish Beach Front Campus官方介绍',
      url: 'https://qqeng.net/study-english-abroad/beach-front-campus/',
    },
    {
      label: 'QQEnglish官方课程与价格',
      url: 'https://qqeng.net/study-english-abroad/plan-price/',
    },
    {
      label: 'QQEnglish日文Beachfront费用表',
      url: 'https://qqenglish.jp/school/beachfront/',
    },
    {
      label: 'QQEnglish Beachfront住宿说明',
      url: 'https://qqenglish.jp/school/beachfront/stay.html',
    },
    {
      label: 'STARGATE官方网站',
      url: 'https://stargate-cebu.com/',
    },
    {
      label: 'STARGATE官方料金一覧',
      url: 'https://stargate-cebu.com/course/table/',
    },
    {
      label: 'STARGATE官方料金シミュレーション',
      url: 'https://stargate-cebu.com/course/simulation/',
    },
    {
      label: 'STARGATE官方设施与周边',
      url: 'https://stargate-cebu.com/facilities/',
    },
    {
      label: 'STARGATE 2026新料金说明',
      url: 'https://stargate-cebu.com/news/pricetable2026/',
    },
    {
      label: 'Winning English Academy官方网站',
      url: 'https://winningenglishschool.com/',
    },
    {
      label: 'Winning官方费用计算页',
      url: 'https://winningenglishschool.com/school-fee/',
    },
    {
      label: 'Winning Ocean Campus官方介绍',
      url: 'https://winningenglishschool.com/campuses/ocean-campus/',
    },
    {
      label: 'Winning City Campus官方介绍',
      url: 'https://winningenglishschool.com/campuses/city-campus/',
    },
    {
      label: 'Winning Cambridge ESL官方课程',
      url: 'https://winningenglishschool.com/courses/cambridge-esl/',
    },
    {
      label: 'Winning Ocean Campus 2026费用参考',
      url: 'https://www.pro-japan.jp/school/138/course/',
    },
    {
      label: 'GLANT English Academy官方学校信息',
      url: 'https://eduglantcebu.wixsite.com/language-school',
    },
    {
      label: 'ICL English Academy官方学校与课程信息',
      url: 'https://icrazy-english.com.tw/en/',
    },
    {
      label: 'ICL English Academy公开费用表',
      url: 'https://cebu-english.com/school/icrazy/',
    },
    {
      label: 'IU English Academy官方学校网站',
      url: 'https://iuenglishacademy.org/',
    },
    {
      label: 'IU English Academy官方报名与当地费用',
      url: 'https://iuenglishacademy.org/enroll/',
    },
    {
      label: 'IU English Academy 2026公开费用参考',
      url: 'https://asiabysaudi.com/en/packages/iu',
    },
    {
      label: '3D Academy官方学校与课程信息',
      url: 'https://3d-universal.com/en/',
    },
    {
      label: '3D Academy官方ESL费用表',
      url: 'https://3d-universal.com/en/generalenglish.com',
    },
    {
      label: '3D Academy官方Walk-in费用表',
      url: 'https://3d-universal.com/en/course/walk-in-course',
    },
    {
      label: 'CELLA官方Facebook',
      url: 'https://www.facebook.com/bestcella',
    },
    {
      label: 'CELLA Uni 2026费用与学校资料',
      url: 'https://www.fujiyama-international.com/philippines/cella.html',
    },
    {
      label: 'CEBU English CELLA Uni费用表',
      url: 'https://cebu-english.com/school/cella-uni/',
    },
    {
      label: '菲律宾宿务EV语言学校官方课程',
      url: 'https://www.evenglish.net/page/page36',
    },
    {
      label: 'StudyTourA 宿务学校结构',
      url: 'https://www.studytoura.com/cebu-schools/',
    },
    {
      label: '非凡游学宿务学校筛选',
      url: 'https://feifanstudy.com/city/%E5%AE%BF%E9%9C%A7',
    },
    { label: '格仲游学菲律宾学校比较', url: 'https://gezhong.com.tw/' },
    { label: 'iOutback 菲律宾游学说明', url: 'https://www.ioutback.com/' },
    { label: '南崎菲律宾游学城市入口', url: 'https://www.nanqi.org/' },
    { label: '大洋游学', url: 'http://www.dayang101.com/' },
  ];
}

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
      examples: '菲律宾宿务EV语言学校、菲律宾宿务CPI语言学校、菲律宾宿务I.BREEZE语言学校、菲律宾宿务IU English Academy、菲律宾宿务Philinter语言学校、Howdy English Academy、Genius English Academy',
    },
    {
      title: '考试备考型',
      tag: 'IELTS / TOEIC / TOEFL',
      text: '适合有明确分数目标，需要模考、写作批改、口语反馈和保证班规则的学生。',
      examples: 'CIA、SMEAG Capital、菲律宾宿务EV语言学校、菲律宾宿务CPILS语言学校、菲律宾宿务English Fella语言学校',
    },
    {
      title: '亲子青少年型',
      tag: 'Family / Junior Camp',
      text: '适合家长陪读、寒暑假短期体验、孩子先适应英语环境和海外课堂的家庭。',
      examples: 'CIA、菲律宾宿务IU English Academy、Howdy English Academy、Genius English Academy、菲律宾宿务CPI语言学校、CBOA、EV Academy La Mer',
    },
    {
      title: '度假舒适型',
      tag: 'Resort / Balanced',
      text: '适合重视住宿、餐食、泳池、校园环境和周末体验，同时希望保持稳定课程强度的人群。',
      examples: 'CIA Mactan、菲律宾宿务I.BREEZE语言学校、Howdy English Academy、Genius English Academy、菲律宾宿务CPI语言学校、Cebu Blue Ocean Academy',
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
      name: '菲律宾宿务First English Global College语言学校',
      location: '麦克坦新城 / Lapu-Lapu City',
      style: '日系运营，高比例一对一与亲子友好',
      route: '/philippines-study/cebu/first-english-global-college',
      startingPrice: 'USD 488 / 1周起',
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
      note: '官网基础费用已按参考汇率换算为美元；入学金、当地费用、餐食、机票和保险需要另行确认。',
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
      startingPrice: 'USD 620 / 1周起',
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
        'IB1 / IB2校内宿舍，公开房型包括单人、双人、三人和四人房；IB2 Prime价格通常略高。',
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
      name: '菲律宾宿务EV语言学校',
      location: 'Nasipit, Cebu City',
      style: 'SP1 斯巴达 / SP2 半斯巴达',
      route: '/philippines-study/cebu/ev-academy',
      startingPrice: 'USD 752 / 1周起',
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
      startingPrice: 'NTD 12,820 / 周起',
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
      startingPrice: 'USD 1,390 / 4周起',
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

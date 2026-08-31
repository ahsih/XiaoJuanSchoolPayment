import { Component } from '@angular/core';
import {
  createCityStudyPage,
  PhilippinesCityStudyLayoutComponent,
} from '../../../components/philippines-city-study-layout/philippines-city-study-layout.component';

interface StatItem {
  value: string;
  label: string;
}

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
  image: string;
  location: string;
  style: string;
  route?: string;
  startingPrice?: string;
  courses: string[];
  accommodation: string;
  facilities: string;
  bestFor: string;
  consultantNote: string;
}

interface DecisionPoint {
  icon: string;
  label: string;
  text: string;
}

interface CostNote {
  title: string;
  text: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

interface SourceLink {
  label: string;
  url: string;
}

@Component({
  selector: 'app-baguio-study',
  standalone: true,
  imports: [PhilippinesCityStudyLayoutComponent],
  templateUrl: './baguio-study.component.html',
})
export class BaguioStudyComponent {
  readonly stats: StatItem[] = [
    { value: '4-24周', label: '常见学习周期' },
    { value: 'ESL / IELTS / TOEIC', label: '核心课程方向' },
    { value: '斯巴达 / 半斯巴达', label: '主流管理模式' },
  ];

  readonly highlights: HighlightCard[] = [
    {
      icon: 'account_balance',
      title: '大学城学习氛围浓',
      text: '碧瑶高校和学院集中，学生人口多，城市日常围绕学习与校园生活展开，更容易进入规律的学习状态。',
    },
    {
      icon: 'ac_unit',
      title: '全年凉爽，适合专注',
      text: '山城气候比菲律宾多数城市凉爽，生活节奏安静，更适合上课、自习、模考复盘和长期学习。',
    },
    {
      icon: 'verified_user',
      title: '治安口碑好，民风朴实',
      text: '碧瑶整体节奏安静，居民友善，大学城氛围让学生更容易适应；日常仍需遵守学校规定并保持基本安全意识。',
    },
    {
      icon: 'home',
      title: '学习生活集中稳定',
      text: '多数学校把课程、住宿、餐食与自习安排在同一生活圈，适合需要规律作息和长期学习的学生。',
    },
  ];

  readonly schoolTypes: SchoolType[] = [
    {
      title: '强化管理型',
      tag: 'Intensive / Managed',
      text: '适合需要更明确课表、晚自习和学习检查，也希望在严格安排与半斯巴达之间选择的学生。',
      examples: 'PINES、JIC、BECI 斯巴达校区、HELP',
    },
    {
      title: '考试备考型',
      tag: 'IELTS / TOEIC',
      text: '适合有明确分数目标，需要模考、写作批改、口说反馈和阶段复盘的人群。',
      examples: 'PINES、JIC、BECI 斯巴达校区',
    },
    {
      title: '高性价比学校',
      tag: 'Value / Long Stay',
      text: '适合重视课程时数、住宿与长期预算，希望把更多费用真正用在学习周期上的学生。',
      examples: 'MONOL、WALES、A&J',
    },
    {
      title: '亲子与青少年型',
      tag: 'Family / Junior',
      text: '适合寒暑假、家长陪读或低龄学生短期适应英语环境，需特别确认年龄、监护和房型。',
      examples: 'PINES、JIC、MONOL、BECI、WALES、HELP、A&J',
    },
  ];

  readonly schoolProfiles: SchoolProfile[] = [
    {
      name: '菲律宾碧瑶PINES语言学校',
      image: '/assets/philippines/pines-campus-hero.jpg',
      location: '碧瑶市 / 多校区体系',
      style: '半斯巴达为主 / 可选强化管理',
      route: '/philippines-study/baguio/pines-international-academy',
      startingPrice: '课程+住宿4周USD 1,420起',
      courses: ['ESL', 'Power Speaking', 'IELTS', 'TOEIC', 'Junior / Family'],
      accommodation: '以学校宿舍为主，房型和校区安排需按入学日期确认。',
      facilities: '学习楼、宿舍、餐厅、自习空间和考试备考环境是主要核对点。',
      bestFor: '想要强管理、明确学习节奏、以雅思或口语强化为目标的学生。',
      consultantNote: '优先确认校区、课程强度和门禁制度；如果目标是短期体验，需评估能否适应密集日程。',
    },
    {
      name: '菲律宾碧瑶JIC语言学校',
      image: '/assets/philippines/jic-campus-hero.jpg',
      location: 'Challenger / Premium Campus',
      style: '斯巴达 / 半斯巴达可选',
      route: '/philippines-study/baguio/baguio-jic',
      startingPrice: 'Challenger 4周约USD 1,460起',
      courses: ['ESL', 'IELTS', 'Speaking Focused', 'TOEIC', 'Business Master', 'Working Holiday Prep'],
      accommodation: '不同校区对应不同学习强度和住宿环境，适合按目标分流。',
      facilities: '官网列有 Challenger 与 Premium 两个校区，报名时应确认具体地址、房型和课程。',
      bestFor: '需要雅思冲刺、口语训练、打工度假准备或希望学习强度与舒适度平衡的学生。',
      consultantNote: 'JIC 很适合做“目标导向选校”：先定分数/口语/打工度假，再选校区。',
    },
    {
      name: '菲律宾碧瑶BECI斯巴达校区',
      image: '/assets/philippines/beci-campus-blue-roof.png',
      location: '碧瑶市 / Sparta Campus',
      style: '斯巴达管理 / 口语与考试强化',
      route: '/philippines-study/baguio/beci-international-language-academy',
      startingPrice: '报名按当期校区报价单与自动报价为准',
      courses: ['ESL', 'IELTS', 'TOEIC', 'Business English', 'Speaking Clinic'],
      accommodation: '课程、住宿、餐食和晚间学习集中在校内，具体房型与管理规则以当期校区资料为准。',
      facilities: '校区式学习环境、宿舍、餐厅、自习区和口语反馈系统是主要关注点。',
      bestFor: '想要严格管理、口语诊断、考试训练或更高强度学习节奏的学生。',
      consultantNote: '报名时要明确选择 BECI Sparta Campus；它与更弹性的 API BECI City Campus 定位不同。',
    },
    {
      name: '菲律宾碧瑶BECI EOP校区',
      image: '/assets/philippines/beci-eop-campus.jpg',
      location: '碧瑶市 / EOP Campus',
      style: '半斯巴达 / 全英文口语沉浸',
      route: '/philippines-study/baguio/beci-international-language-academy',
      startingPrice: '报名按当期校区报价单与自动报价为准',
      courses: ['Lite ESL', 'Speed ESL', 'Speaking Prescription', 'IELTS', 'TOEIC'],
      accommodation: '绿色安静的校区环境，课程、住宿、餐食和口语活动集中在同一校园内。',
      facilities: '校内宿舍、餐厅、自习空间、花园露台和口语诊断反馈是主要特色。',
      bestFor: '怕开口、想建立英语思维，或希望在半斯巴达节奏中强化日常口语输出的学生。',
      consultantNote: 'EOP Campus 更强调全英文环境和持续开口；如果需要更严格的晚间学习与测试，应比较 BECI Sparta Campus。',
    },
    {
      name: '菲律宾碧瑶API BECI（City Campus）',
      image: '/assets/philippines/beci-city-workspace.png',
      location: 'Baguio City / City Campus',
      style: 'BECI成人弹性校区，Workcation / Non-Sparta / Coworking / Lite / Native / Unlimited / Junior ESL',
      route: '/philippines-study/baguio/api-beci-city-campus',
      startingPrice: 'USD 1,270 / 4周起（Lite ESL + Studio Quad，中介优惠免注册费）',
      courses: [
        'Lite ESL',
        'Native ESL',
        'Unlimited ESL',
        'Junior ESL',
      ],
      accommodation:
        '公开费用表按Studio Single、Studio Double、Studio Quad、Semi Master Single、Semi Single核价；Studio Double通常需确认同性朋友、家人或夫妻等使用规则。',
      facilities:
        '公开资料列卖店、Coworking Space、Online Meeting Room、Library、自习室、每日三餐、无门禁和免费外部健身房。',
      bestFor:
        '成人、专业人士、远程工作者、想要弹性ESL/商务/IELTS并接受Baguio城市环境的学生。',
      consultantNote:
        '先确认学生要的是API BECI City Campus、BECI EOP/Sparta，还是宿务B Cebu；这三类学习节奏和城市体验不同。',
    },
    {
      name: '菲律宾碧瑶MONOL语言学校',
      image: '/assets/philippines/monol-campus-building.jpg',
      location: 'Pinsao Proper, Baguio City',
      style: '长期学习与生活配套型',
      route: '/philippines-study/baguio/monol',
      startingPrice: 'USD 1,250 / 4周起（ESL 4 + 四人胶囊式上下铺 + 注册费）',
      courses: ['ESL 4', 'General ESL', 'IELTS', 'LEAP'],
      accommodation: 'Hotel-style宿舍管理，2025价目表房型从四人胶囊式上下铺到Premium Single，餐食另计更弹性。',
      facilities: '屋顶健身房、桑拿、高尔夫练习区、咖啡厅、共享厨房、自助洗衣和自习空间。',
      bestFor: '计划 8 周以上长期学习、重视生活稳定度和住宿舒适度的成人学生。',
      consultantNote: '如果学生担心高压管理过重，MONOL 可作为“稳态学习型”候选；仍需核对房型、餐费和当地费用。',
    },
    {
      name: '菲律宾碧瑶WALES语言学校',
      image: '/assets/philippines/wales-school-building.jpg',
      location: '碧瑶市中心附近',
      style: '小型学校与市区便利',
      route: '/philippines-study/baguio/wales-academy',
      startingPrice: '4周约USD 1,400起',
      courses: ['EEP', 'ESL', 'Business', 'IELTS', 'Junior', 'Family'],
      accommodation: 'Studio、Premium Studio、Share、Condo等房型，适合重视隐私和生活机能的学生。',
      facilities: '一对一/团体教室、商务中心、餐厅、学生休息区，以及步行可达的餐厅、ATM和商场。',
      bestFor: '想要小校容量、成人学习氛围、市区便利和相对灵活节奏的人群。',
      consultantNote: 'WALES适合不想进入过强斯巴达节奏的学生；亲子或成人商务需求可优先核对房型和餐费。',
    },
    {
      name: '菲律宾碧瑶A&J e-Edu English Academy',
      image: 'https://www.anjedudc.com/assets/img/slider/Main-Building.webp',
      location: 'Irisan, Baguio / ECO Campus',
      style: '自然型一体校园与弹性ESL',
      route: '/philippines-study/baguio/anj-e-edu-english-academy',
      startingPrice: '4周USD 1,550起（Eco Relax Lite + Deluxe Triple + 入学金）',
      courses: ['Eco Relax Lite', 'Eco Relax Plus', 'Eco Hub ESL', 'Eco Sparta', 'IELTS / TOEIC', 'Junior'],
      accommodation: 'Deluxe、Premium、Premium Studio、Suite、Eco Villa等住宿线，房型差价明显，需按预算确认。',
      facilities: 'Admin/Main Building、Dining Hall、Cafe、Eco Mart、Fitness Gym、Golf Driving Range、Indoor Gymnasium、BBQ/Camping Zone。',
      bestFor: '想在碧瑶自然校园长期学习，重视一体式生活、住宿舒适度和ESL强度弹性的学生或家庭。',
      consultantNote: 'A&J适合放进“碧瑶自然校园 + ESL/考试/Junior”候选组；报价时要把房型、旺季附加费和当地PHP费用拆开算。',
    },
    {
      name: 'HELP English（Longlong Campus）',
      image: 'https://helpenglish.net/wp-content/uploads/2024/09/longlong43.jpg',
      location: 'Longlong / La Trinidad, Benguet',
      style: '老牌Sparta与考试强化',
      route: '/philippines-study/baguio/help-english-longlong-campus',
      startingPrice: '4周USD 1,580起（ESL + 双人间；注册费USD 100另计）',
      courses: ['ESL', 'ESL Intensive', 'Business English', 'IELTS Basic & Intermediate', 'IELTS Advanced', 'IELTS Guaranteed'],
      accommodation: '2025年费用表列Single、Double与2+1房型；4周住宿费分别为USD 1,030、780与850。',
      facilities: '7层山景校园、1:1教室、小组教室、大讲堂、宿舍、餐厅、健身房、学生休息区、便利店、医务室和洗衣服务。',
      bestFor: '想要碧瑶安静山城、高强度Sparta、IELTS备考和严格日程的学生。',
      consultantNote: 'HELP官网提示Longlong设施升级期间，活跃Sparta课程和资深教师目前整合在Clark；报名前必须先确认Longlong当期是否开放、是否由Clark承接。',
    },
  ];

  readonly decisionPoints: DecisionPoint[] = [
    {
      icon: 'flag',
      label: '先定目标',
      text: '口语开口、雅思分数、多益求职、商务沟通、亲子陪读和青少年营队，对应的学校完全不同。',
    },
    {
      icon: 'lock_clock',
      label: '确认管理强度',
      text: '碧瑶不等于全部斯巴达。门禁、自习、晚课、请假、单词测试和周末外出规则都要逐项确认。',
    },
    {
      icon: 'hotel',
      label: '房型比价格更关键',
      text: '单人房、多人房、家庭房和公寓型房间的空位变化快，旺季尤其要先锁定可接受房型。',
    },
    {
      icon: 'receipt_long',
      label: '费用看总额',
      text: '学费、住宿、当地费用、教材、SSP、ACR-I Card、接送、机票和生活费要一起核算。',
    },
    {
      icon: 'verified',
      label: '优惠要看当期',
      text: '学校优惠会随淡旺季、周数、国籍比例和房型改变，页面只做选校参考，报价需二次确认。',
    },
    {
      icon: 'support_agent',
      label: '用顾问做排除法',
      text: '思达教育会先排除不适合的学校，再给出 2-3 个可比较方案，避免只看热门校名报名。',
    },
  ];

  readonly costNotes: CostNote[] = [
    {
      title: '学费和住宿费',
      text: '菲律宾学校通常按课程、周数和房型报价。碧瑶长期学习常见 8-12 周以上方案，单人房会明显拉高总预算。',
    },
    {
      title: '当地必要费用',
      text: '报名后仍需预留注册、SSP、ACR-I Card、教材、管理、水电、押金、接送等费用，项目会因学校而异。',
    },
    {
      title: '最新优惠',
      text: '优惠需以学校当期邮件、价目表或代理通知为准。建议在确认入学日、周数和房型后再判断是否真的省钱。',
    },
  ];

  readonly compareRows = [
    { label: '城市定位', baguio: '山城、凉爽、学习导向、娱乐干扰较少', cebu: '海岛城市、学校多、生活便利、体验感强' },
    { label: '学习强度', baguio: '斯巴达、半斯巴达和考试型学校更集中', cebu: '从自律型到强管理都有，选择弹性更大' },
    { label: '适合人群', baguio: '雅思、多益、长期学习、自律较弱或目标明确的学生', cebu: '第一次游学、亲子、短期体验、口语和综合课程' },
    { label: '选校重点', baguio: '管理制度、模考体系、自习安排、住宿舒适度', cebu: '课程比例、校区位置、机场便利、活动资源' },
  ];

  readonly faqs: FaqItem[] = [
    {
      question: '碧瑶适合第一次去菲律宾游学吗？',
      answer: '适合目标明确、能接受山城交通和较强学习节奏的学生。如果更想要海岛体验或周末活动，宿务可能更容易适应。',
    },
    {
      question: '亲子家庭能不能选碧瑶？',
      answer: '可以，但要优先确认年龄限制、家长课程、家庭房、接送方式和医疗便利度。不是所有碧瑶学校都适合低龄儿童。',
    },
    {
      question: '碧瑶学校一定比宿务便宜吗？',
      answer: '不一定。总费用取决于学校、课程、房型、周数和当地费用。碧瑶的优势更多在学习集中度和长期预算可控。',
    },
    {
      question: '报名前最应该核对什么？',
      answer: '先核对入学日、课程可开课状态、房型空位、校区、退改规则、优惠有效期和当地费用明细。',
    },
  ];

  readonly sources: SourceLink[] = [
    { label: '菲律宾碧瑶PINES语言学校 官方网站', url: 'https://pinesacademy.com/' },
    { label: '菲律宾碧瑶BECI斯巴达校区 官方网站', url: 'https://beciedu.com/sparta-campus/' },
    { label: 'APIBECI City Campus官方介绍', url: 'https://beciedu.com/city-campus/' },
    { label: 'API BECI City Campus公开费用与学校资料', url: 'https://global-click.jp/contents/school/api-beci-city-campus/' },
    { label: 'API BECI City Campus 2026学校资料', url: 'https://www.fujiyama-international.com/philippines/beci-city.html' },
    { label: '菲律宾碧瑶JIC语言学校 官方网站', url: 'https://baguio-jic.com/' },
    { label: '菲律宾碧瑶MONOL语言学校 官方网站', url: 'https://mymonol.com/en/' },
    { label: '菲律宾碧瑶WALES语言学校 官方网站', url: 'https://walesph.com/' },
    { label: '菲律宾碧瑶A&J e-Edu语言学校 官方网站', url: 'https://www.anjedudc.com/' },
    { label: 'HELP English Baguio / Longlong官方页面', url: 'https://www.helpenglish.org/p/baguio-campus.html' },
    { label: 'iOutback 菲律宾游学结构参考', url: 'https://www.ioutback.com/' },
    { label: 'StudyTourA 菲律宾学校分类参考', url: 'https://www.studytoura.com/cebu-schools/' },
    { label: '格仲游学菲律宾学校比较参考', url: 'https://gezhong.com.tw/' },
  ];

  readonly page = createCityStudyPage({
    cityName: '碧瑶',
    englishName: 'Baguio',
    heroKicker: '菲律宾专注学习代表城市',
    heroKickerIcon: 'terrain',
    heroSubtitle: '凉爽山城，把时间真正留给学习',
    heroDescription:
      '碧瑶是菲律宾北部山城，没有国际直达航班，通常需从马尼拉或克拉克转车前往，交通不如宿务便利。但这里全年凉爽、城市节奏安静，半斯巴达、强化管理和考试课程集中，适合把学习放在第一位、愿意规律作息的学生。',
    heroImage: '/assets/philippines/baguio-study-hero.jpg',
    heroImageAlt: '菲律宾碧瑶山城与学习环境',
    heroStudyImage: '/assets/philippines/pines-one-to-one-classroom.jpg',
    heroLessonImage: '/assets/philippines/jic-main-ielts-class.png',
    heroVisualLabel: '碧瑶山城、语言学校与学习生活场景',
    benefitChips: [
      { icon: 'ac_unit', label: '全年凉爽' },
      { icon: 'menu_book', label: '专注学习' },
      { icon: 'workspace_premium', label: '考试课程' },
      { icon: 'schedule', label: '长期友好' },
    ],
    stats: [
      { value: '8所+', label: '学校资料', icon: 'workspace_premium' },
      { value: '课程丰富', label: '口语 · 考试 · 商务' },
      { value: '双模式', label: '管理可选' },
      { value: '4-24周', label: '常见周期' },
    ],
    schoolTypes: this.schoolTypes.map((type, index) => ({
      ...type,
      icon: ['shield', 'workspace_premium', 'savings', 'family_restroom'][index],
    })),
    schoolProfiles: this.schoolProfiles.map((school) => ({
      ...school,
      shortName:
        school.name === '菲律宾碧瑶PINES语言学校' ? 'PINES' :
        school.name === '菲律宾碧瑶BECI斯巴达校区' ? 'BECI 斯巴达校区' :
        school.name === '菲律宾碧瑶BECI EOP校区' ? 'BECI EOP校区' :
        school.name === '菲律宾碧瑶API BECI（City Campus）' ? 'API BECI City Campus' :
        school.name === '菲律宾碧瑶JIC语言学校' ? 'JIC' :
        school.name === '菲律宾碧瑶MONOL语言学校' ? 'MONOL' :
        school.name === '菲律宾碧瑶WALES语言学校' ? 'WALES' :
        school.name === '菲律宾碧瑶A&J e-Edu English Academy' ? 'A&J e-Edu' : 'HELP English',
      categories:
        school.name.includes('PINES') ? ['强化管理型', '考试备考型', '亲子与青少年型'] :
        school.name.includes('JIC') ? ['强化管理型', '考试备考型', '亲子与青少年型'] :
        school.name.includes('API BECI') ? ['高性价比学校'] :
        school.name.includes('BECI EOP') ? ['强化管理型'] :
        school.name.includes('BECI') ? ['强化管理型', '考试备考型', '亲子与青少年型'] :
        school.name.includes('MONOL') || school.name.includes('WALES') || school.name.includes('A&J')
          ? ['高性价比学校', '亲子与青少年型']
          : ['强化管理型', '亲子与青少年型'],
    })),
    highlights: this.highlights,
    selectionImages: [
      '/assets/philippines/pines-campus-hero.jpg',
      '/assets/philippines/jic-main-ielts-class.png',
      '/assets/philippines/monol-campus-building.jpg',
      '/assets/philippines/wales-classroom-group.jpg',
    ],
    lifestyleImages: [
      '/assets/philippines/baguio-university-town-upb.jpg',
      '/assets/philippines/baguio-cool-city.jpg',
      '/assets/philippines/baguio-panagbenga-festival-clear.jpg',
      '/assets/philippines/beci-city-study-lounge.png',
    ],
    faqs: this.faqs,
    featuredTitle: '碧瑶热门语言学校推荐',
    featuredSubtitle: '先看学习目标与管理方式，再比较校区、课程和住宿',
    lifestyleTitle: '在碧瑶，大学城的节奏更适合安心学习',
    lifestyleSubtitle: '全年凉爽、学校集中、整体治安口碑较好，民风朴实友善',
  });
}

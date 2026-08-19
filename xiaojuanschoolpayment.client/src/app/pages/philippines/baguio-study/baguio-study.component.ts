import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ScrollToDirective } from '../../../directives/scroll-to.directive';

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
  imports: [CommonModule, RouterModule, MatIconModule, ScrollToDirective],
  templateUrl: './baguio-study.component.html',
  styleUrl: './baguio-study.component.css',
})
export class BaguioStudyComponent {
  readonly stats: StatItem[] = [
    { value: '4-24周', label: '常见学习周期' },
    { value: 'ESL / IELTS / TOEIC', label: '核心课程方向' },
    { value: '斯巴达 / 半斯巴达', label: '主流管理模式' },
  ];

  readonly highlights: HighlightCard[] = [
    {
      icon: 'terrain',
      title: '学习氛围更集中',
      text: '碧瑶是菲律宾北部山城，气候凉爽、娱乐干扰较少，更适合把时间放在课程、自习和模考复盘上。',
    },
    {
      icon: 'assignment',
      title: '考试型学校密度高',
      text: '雅思、多益和长期英语强化选择丰富，很多学校会把晚自习、单词测试、模拟考试和学习进度管理放进日程。',
    },
    {
      icon: 'night_shelter',
      title: '住宿与学习一体',
      text: '多数学校以校内或步行可达宿舍为主，学生每天的上课、用餐、住宿和管理集中在同一个生活圈。',
    },
    {
      icon: 'savings',
      title: '适合长期预算规划',
      text: '如果不追求海岛体验，碧瑶通常更适合把预算投入课程时数、房型和学习周期，而不是周末活动。',
    },
  ];

  readonly schoolTypes: SchoolType[] = [
    {
      title: '斯巴达冲刺型',
      tag: 'Sparta / Intensive',
      text: '适合自律较弱、需要外部节奏推动、希望每天固定学习时段更长的学生。',
      examples: 'PINES、HELP、BECI Sparta、JIC Challenger',
    },
    {
      title: '雅思多益备考型',
      tag: 'IELTS / TOEIC',
      text: '适合有明确分数目标，需要模考、写作批改、口说反馈和阶段复盘的人群。',
      examples: 'PINES、JIC、MONOL、WALES、API BECI City Campus',
    },
    {
      title: '口语基础强化型',
      tag: 'ESL / Speaking',
      text: '适合词汇、语法和开口信心薄弱，想先建立听说基础再进入考试课程的学生。',
      examples: 'BECI、API BECI City Campus、MONOL、WALES、A&J、PINES',
    },
    {
      title: '亲子与青少年型',
      tag: 'Family / Junior',
      text: '适合寒暑假、家长陪读或低龄学生短期适应英语环境，需特别确认年龄、监护和房型。',
      examples: 'WALES、PINES、JIC、BECI、A&J',
    },
  ];

  readonly schoolProfiles: SchoolProfile[] = [
    {
      name: '菲律宾碧瑶PINES语言学校',
      location: '碧瑶市 / 多校区体系',
      style: '斯巴达与考试导向',
      route: '/philippines-study/baguio/pines-international-academy',
      startingPrice: '课程+住宿4周USD 1,420起',
      courses: ['ESL', 'Power Speaking', 'IELTS', 'TOEIC', 'Junior / Family'],
      accommodation: '以学校宿舍为主，房型和校区安排需按入学日期确认。',
      facilities: '学习楼、宿舍、餐厅、自习空间和考试备考环境是主要核对点。',
      bestFor: '想要强管理、明确学习节奏、以雅思或口语强化为目标的学生。',
      consultantNote: '优先确认校区、课程强度和门禁制度；如果目标是短期体验，需评估能否适应密集日程。',
    },
    {
      name: '菲律宾碧瑶BECI语言学校',
      location: '碧瑶市 / 多校区',
      style: '口语诊断与多样管理模式',
      route: '/philippines-study/baguio/beci-international-language-academy',
      startingPrice: 'EOP 4周约USD 1,240起（中介优惠免注册费）',
      courses: ['ESL', 'IELTS', 'TOEIC', 'Business English', 'Speaking Clinic'],
      accommodation: '不同校区房型、管理强度和生活氛围差异明显，报名前需逐一比对。',
      facilities: '校区式学习环境、宿舍、餐厅、自习区和口语反馈系统是常见关注点。',
      bestFor: '想改善发音、口说表达、面试沟通，或希望在斯巴达与半斯巴达之间选择的人。',
      consultantNote: 'BECI 的优势不只在课程名称，而在诊断与反馈机制；建议按校区而不是只按学校名比较。',
    },
    {
      name: '菲律宾碧瑶API BECI（City Campus）',
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
      name: '菲律宾碧瑶JIC语言学校',
      location: 'Challenger / Premium Campus',
      style: '考试、口语与生活舒适度分校区',
      route: '/philippines-study/baguio/baguio-jic',
      startingPrice: 'Challenger 4周约USD 1,460起',
      courses: ['ESL', 'IELTS', 'Speaking Focused', 'TOEIC', 'Business Master', 'Working Holiday Prep'],
      accommodation: '不同校区对应不同学习强度和住宿环境，适合按目标分流。',
      facilities: '官网列有 Challenger 与 Premium 两个校区，报名时应确认具体地址、房型和课程。',
      bestFor: '需要雅思冲刺、口语训练、打工度假准备或希望学习强度与舒适度平衡的学生。',
      consultantNote: 'JIC 很适合做“目标导向选校”：先定分数/口语/打工度假，再选校区。',
    },
    {
      name: '菲律宾碧瑶MONOL语言学校',
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
      location: 'Longlong / La Trinidad, Benguet',
      style: '老牌Sparta与考试强化',
      route: '/philippines-study/baguio/help-english-longlong-campus',
      startingPrice: '4周USD 1,500起',
      courses: ['ESL', 'ESL Intensive', 'IELTS / TOEIC', 'Business English', 'Family Program'],
      accommodation: 'Single、Double、Triple、Quad房型；官方Dormitory Fee按4周计价，并说明含每日餐食和饮用水。',
      facilities: '7层山景校园、1:1教室、小组教室、大讲堂、宿舍、餐厅、健身房、学生休息区、便利店、医务室和洗衣服务。',
      bestFor: '想要碧瑶安静山城、高强度Sparta、IELTS/TOEIC备考和严格日程的学生。',
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
    { label: '菲律宾碧瑶BECI语言学校 官方网站', url: 'https://beciedu.com/' },
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
}

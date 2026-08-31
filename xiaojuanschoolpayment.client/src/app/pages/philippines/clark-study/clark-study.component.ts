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
  selector: 'app-clark-study',
  standalone: true,
  imports: [PhilippinesCityStudyLayoutComponent],
  templateUrl: './clark-study.component.html',
})
export class ClarkStudyComponent {
  readonly stats: StatItem[] = [
    { value: '机场便利', label: '适合短期与家庭行程' },
    { value: 'Native / ESL / Family', label: '核心课程方向' },
    { value: '舒适型 / 半斯巴达', label: '主流学习节奏' },
  ];

  readonly highlights: HighlightCard[] = [
    {
      icon: 'record_voice_over',
      title: '外教与口语环境突出',
      text: 'Clark 曾是美军基地区域，国际社区感更明显。部分学校会强调欧美外教、发音训练和真实沟通场景。',
    },
    {
      icon: 'family_restroom',
      title: '亲子与青少年更友好',
      text: '城市节奏比宿务海岛旅游区安静，也比碧瑶交通更轻松，适合家长陪读、低龄学生和短期家庭项目。',
    },
    {
      icon: 'flight_takeoff',
      title: '行程衔接更省心',
      text: 'Clark International Airport 周边学校接送更方便，适合不想把大量时间花在跨城交通上的学生和家庭。',
    },
    {
      icon: 'villa',
      title: '住宿舒适度可优先比较',
      text: 'Clark 学校常被拿来和宿务、碧瑶比较生活环境。选校时应把房型、校区安全、网络和餐食放进核心清单。',
    },
  ];

  readonly schoolTypes: SchoolType[] = [
    {
      title: '外教口语强化型',
      tag: 'Native / Speaking',
      text: '适合希望提高发音、自然表达、面试沟通和欧美课堂适应度的成人或青少年学生。',
      examples: 'CIP、菲律宾克拉克AELC语言学校、菲律宾克拉克WE Academy语言学校',
    },
    {
      title: '亲子陪读与低龄型',
      tag: 'Family / Junior',
      text: '适合家长同行、4-15 岁阶段学生、寒暑假短期体验，以及需要学习和照顾同步安排的家庭。',
      examples: '菲律宾克拉克WE Academy语言学校、CIP、菲律宾克拉克EG语言学校',
    },
    {
      title: '综合 ESL 舒适型',
      tag: 'ESL / Comfort',
      text: '适合想稳步提升英语，但不想进入碧瑶高压斯巴达节奏的人群。',
      examples: '菲律宾克拉克EG语言学校、菲律宾克拉克WE Academy语言学校、菲律宾克拉克TALK Academy语言学校、CIP',
    },
    {
      title: '考试与商务沟通型',
      tag: 'IELTS / TOEIC / Business',
      text: '适合需要雅思、多益、商务英语或求职英语路径的人，需要特别核对模考、保证班和外教课比例。',
      examples: 'CIP、菲律宾克拉克EG语言学校、菲律宾克拉克HELP English语言学校',
    },
  ];

  readonly schoolProfiles: SchoolProfile[] = [
    {
      name: '菲律宾克拉克 CIP语言学校',
      image: '/assets/philippines/cip-campus-hero.jpg',
      location: 'Clark / Angeles, Pampanga',
      style: '外教、考试、亲子综合型',
      route: '/philippines-study/clark/cip-english-kepos',
      startingPrice: 'RMB 7,740 + 注册费 / 4周起参考',
      courses: [
        'Light ESL',
        'Regular ESL / Native ESL',
        'Intensive ESL',
        'Advanced Business',
        'TOEIC',
        'IELTS / IELTS Guarantee',
        'Primary / Junior',
      ],
      accommodation:
        '官网列有校内宿舍，常见单人、双人、三四人房；另有距离学校约 5 分钟车程的校外 Hotel 住宿选项。',
      facilities:
        '官网可确认一对一教室、小组教室、Academic Office、宿舍、Hotel、餐食服务和学习支持体系。',
      bestFor:
        '想要外教课、考试备考、商务英语或亲子青少年课程，同时重视住宿选择的人群。',
      consultantNote:
        'CIP 是 Clark 选校时优先核对的综合型学校。低龄学生可关注官网列出的 Primary English 7-11 岁与 Junior 12-15 岁课程。',
    },
    {
      name: '菲律宾克拉克EG语言学校',
      image: '/assets/philippines/eg-campus-building.jpg',
      location: 'Lot 2-B Friendship Highway, Cutcut, Angeles City',
      style: 'ESL、Native、考试与Golf体验型',
      route: '/philippines-study/clark/eg-academy',
      startingPrice: 'USD 1,540 / 4周起（ESL 4 + 宿舍1&2四人间 + 注册费）',
      courses: [
        'ESL 4 / ESL 6',
        'ESL Native Plus / Complete',
        'Pre-IELTS / IELTS + Native',
        'TOEIC / TOEFL + Native',
        'Business + Native',
        'Golf + ESL / Golf Special',
        'Junior / Guardian',
      ],
      accommodation:
        '2025年价目表列出宿舍1&2及宿舍3的单人、双人、三人和四人房；三人房仅限家庭，空房需按入学日确认。',
      facilities:
        '官网概况列出1:1教室50间、团体教室20间、TOEIC考场、自习室、视听室、250码高尔夫练习场、咖啡厅和旅行社。',
      bestFor:
        '想在Clark做一般英语、Native口语、考试基础、商务英语、亲子陪读或高尔夫英语组合的人群。',
      consultantNote:
        'EG 2025年价目表以USD列出课程和住宿，注册费USD100另计；教材、SSP、接机、延签和Golf追加费用多以PHP到校支付。',
    },
    {
      name: '菲律宾克拉克WE Academy语言学校',
      image: '/assets/philippines/we-hero.jpg',
      location: 'Fil-Am Friendship Highway, Angeles City',
      style: '度假式校区与亲子友好型',
      route: '/philippines-study/clark/clark-we-academy',
      startingPrice: 'USD 1,500 / 4周起（ESL 4 + 四人间 + 注册费）',
      courses: [
        'ESL',
        'Native Mix',
        'Family Program',
        'Kinder Course',
        'Golf Lesson',
        'Swimming',
      ],
      accommodation:
        '学校位于 farm resort 式环境，官网强调宿舍、教室、健身房、大型泳池和便利店集中在校园内。',
      facilities:
        '官网介绍从 Clark International Airport 到学校约 25 分钟，并强调舒适、安全、自由的校园生活。',
      bestFor:
        '亲子家庭、低龄学生、希望学习节奏较自由、也看重校内活动和生活舒适度的人群。',
      consultantNote:
        '2026年价目表已列出4周USD课程与住宿费，注册费USD100另计。学校适合“学习 + 陪读 + 生活体验”组合；到校费用和其他周数仍需确认。',
    },
    {
      name: '菲律宾克拉克TALK Academy语言学校',
      image: 'https://clarktalkacademy.com/assets/campus.jpg',
      location: 'Clark Freeport Zone, Pampanga',
      style: '一对一口语、舒适住宿与Golf/Senior方向',
      route: '/philippines-study/clark/talk-academy',
      startingPrice: 'USD 1,280 / 4周主费起参考',
      courses: [
        'TALK4 / TALK6',
        'TALK4 Hybrid A/J',
        'TALK6 Hybrid A/J',
        'Senior',
        'TALK Golf',
        'Business',
        'Internship / Barista',
        'TOEIC / IELTS',
      ],
      accommodation:
        '官方FAQ写明有Single、Twin、Triple、Quad和Family房型；2026公开价目另列1人、2人、3+1老师、4人和家庭房口径。',
      facilities:
        '官方页面列出校内宿舍、学习休息区、餐厅、学生支持服务，并强调Clark机场、SM City Clark和高尔夫资源距离较近。',
      bestFor:
        '想在Clark舒适环境里用一对一课程提升口语，同时考虑熟龄英语、亲子、商务或高尔夫英语组合的人群。',
      consultantNote:
        'TALK更像小规模舒适型Clark学校。报价时要特别确认2026年9月后房型、餐食、当地费用、促销和Hybrid/考试课程开放状态。',
    },
    {
      name: '菲律宾克拉克HELP English语言学校',
      image: '/assets/philippines/help-clark-main-building.jpg',
      location: 'Clark / Pampanga',
      style: 'Sparta强管理与考试路线候选',
      route: '/philippines-study/clark/help-english-clark',
      startingPrice: 'USD 1,500 / 4周课程住宿起，注册费USD 100另计',
      courses: ['ESL', 'ESL Intensive', 'IELTS / TOEIC', 'Business English', 'Family / Junior'],
      accommodation:
        '2026年价目表列出Quadra、Triple、Double、Single房型；宿舍费按4周计算，含校内餐食和饮用水，空房需按入学日确认。',
      facilities: '官方Clark页面列出1:1教室、小组教室、大讲堂、宿舍、泳池、运动场、餐厅、便利店和Clinic等设施。',
      bestFor:
        '偏好老牌HELP体系、Sparta节奏、EOP、IELTS/TOEIC考试路线和Clark机场便利的学生。',
      consultantNote:
        'HELP Clark公开了USD课程住宿价目和PHP当地费用表，报价时要把课程住宿、当地费用、EOP规则、晚自习和接机分开核对。',
    },
    {
      name: '菲律宾克拉克AELC语言学校',
      image: '/assets/philippines/aelc-campus.jpg',
      location: 'Clark / Angeles City',
      style: 'Native口语、TOEIC与IELTS候选',
      route: '/philippines-study/clark/aelc-native-focused-clark-schools',
      startingPrice: 'USD 1,387 / 4周起历史参考',
      courses: [
        'LITE / ESL',
        'Native Speaking / AELC Intensive',
        'TOEIC',
        'IELTS',
        'Business English',
        'Family / Junior',
      ],
      accommodation:
        '公开资料按Center 1二人房、Center 2四人房列出课程住宿套餐；单人、双人、三人房差额和空房需当期确认。',
      facilities:
        '资料页列出TOEIC考试中心、食堂、泳池、宿舍和生活设施；旧官方域名目前无法解析，当前招生需复核。',
      bestFor:
        '明确想要更多Native外教口语、发音纠正、TOEIC/IELTS或商务表达训练，同时接受先复核学校当前状态的人群。',
      consultantNote:
        '菲律宾克拉克AELC语言学校适合放入Clark外教型候选清单，但不建议只凭旧资料直接报名；需先确认校区、招生、房型、课表和最新报价。',
    },
    {
      name: '菲律宾克拉克HANA Academy',
      image: 'https://media.loveitopcdn.com/29958/campus-hana-min.jpg',
      location: 'Lot 3-2a Cutcut, Friendship Highway, Angeles City',
      style: 'Native口语、亲子、Golf与Senior舒适型',
      route: '/philippines-study/clark/hana-academy',
      startingPrice: 'USD 1,430 / 4周起（Light ESL + 双人房，2026注册费减免）',
      courses: [
        'Light ESL / General ESL',
        'Native ESL / Native Only',
        'IELTS / TOEIC',
        'Junior / Kindergarten',
        'Guardian / Family',
        'Golf Intensive / Leisure',
        'Senior Course',
      ],
      accommodation:
        '官网列普通宿舍与Hotel Dormitory；普通房型有1 bed、2 beds、3 beds和Family room，Hotel Dormitory距学校约3km并有接驳安排。',
      facilities:
        '官网列宿舍、教室与自习区、餐厅、泳池、50米内Golf和Badminton、1km内健身房，周边100米内有咖啡、餐厅、超市和ATM。',
      bestFor:
        '想在Clark兼顾Native口语、亲子低龄、Senior、Golf English和生活便利的学生或家庭。',
      consultantNote:
        'HANA不是高压Sparta路线，适合舒适生活和多年龄课程组合；2026价目表注明注册费减免，报价时仍要把Native课比例、房型和PHP当地费用拆开核对。',
    },
  ];

  readonly decisionPoints: DecisionPoint[] = [
    {
      icon: 'groups',
      label: '先分成人与亲子',
      text: '成人口语、低龄亲子、青少年营队和商务英语的选校逻辑不同，不能只看“外教多”一个指标。',
    },
    {
      icon: 'person_search',
      label: '核对外教比例',
      text: '确认是欧美外教课、Native Mix、外教小组课，还是只有部分课程由外教负责。',
    },
    {
      icon: 'child_care',
      label: '年龄和监护规则',
      text: '低龄学生要确认最低年龄、是否必须家长同行、课后照顾、医疗支援和周末活动安排。',
    },
    {
      icon: 'hotel',
      label: '住宿舒适度',
      text: 'Clark 的优势常在生活环境，因此房型、浴室、网络、清洁、洗衣、餐食和校园距离都要看清楚。',
    },
    {
      icon: 'flight',
      label: '接送与航班',
      text: '优先确认 Clark 机场接机、马尼拉机场接送、抵达时间和额外费用，家庭同行尤其要提前规划。',
    },
    {
      icon: 'verified',
      label: '优惠和空房',
      text: '优惠常随周数、房型、国籍比例和旺季变化。确认入学日之后，再判断优惠是否真的适用。',
    },
  ];

  readonly costNotes: CostNote[] = [
    {
      title: '学费与外教课比例',
      text: 'Clark 学校常见价格差异来自外教课比例、课程密度和房型。外教课越多，不一定越适合初学者，需按目标搭配。',
    },
    {
      title: '住宿与家庭成本',
      text: '亲子家庭要把家长课程、儿童课程、家庭房、接送、周末活动、保险和个人生活费一起核算。',
    },
    {
      title: '最新优惠和活动',
      text: 'CIP、菲律宾克拉克EG语言学校、菲律宾克拉克WE Academy语言学校、菲律宾克拉克TALK Academy语言学校等学校会不定期更新优惠、学生比例、接送费或宿舍资讯，最终以学校当期报价和回函为准。',
    },
  ];

  readonly compareRows = [
    {
      label: '城市定位',
      clark: '国际社区感强、机场便利、生活舒适',
      cebu: '学校多、海岛体验丰富、短期选择多',
      baguio: '凉爽安静、学习氛围强、考试导向',
    },
    {
      label: '学习重点',
      clark: '外教口语、亲子、青少年、舒适型 ESL',
      cebu: '口语、亲子、短期体验、综合课程',
      baguio: '雅思、多益、斯巴达冲刺、长期备考',
    },
    {
      label: '适合人群',
      clark: '家庭用户、外教偏好、重视环境和机场便利',
      cebu: '第一次游学、想平衡学习和生活',
      baguio: '自律较弱、想专心备考、能接受高强度',
    },
    {
      label: '选校重点',
      clark: '外教比例、房型、接送、安全和年龄规则',
      cebu: '课程比例、校区位置、住宿和活动',
      baguio: '管理制度、模考体系、自习安排和学习强度',
    },
  ];

  readonly faqs: FaqItem[] = [
    {
      question: 'Clark 比宿务更适合亲子吗？',
      answer:
        '如果家庭更重视机场便利、住宿舒适度、安静环境和外教沟通，Clark 通常更容易筛选；如果想要更多海岛活动和学校选择，宿务更丰富。',
    },
    {
      question: '外教课越多越好吗？',
      answer:
        '不一定。基础薄弱的学生需要菲律宾老师一对一打底，再搭配外教发音和表达课；高级学生或商务目标才更适合提高外教比例。',
    },
    {
      question: 'Clark 适合雅思冲刺吗？',
      answer:
        '可以看 CIP、菲律宾克拉克EG语言学校 等有考试课程的学校，但如果目标是高强度模考和自习制度，碧瑶学校也应一起比较。',
    },
    {
      question: '报名 Clark 学校前最该确认什么？',
      answer:
        '确认校区、课程开放、外教课比例、房型空位、接送机场、年龄限制、当地费用和优惠有效期。',
    },
  ];

  readonly sources: SourceLink[] = [
    { label: 'CIP English 官方网站', url: 'https://cipenglish.com/' },
    {
      label: 'CIP Dormitory 官方说明',
      url: 'https://cipenglish.com/dormitory/',
    },
    { label: 'CIP Hotel 官方说明', url: 'https://cipenglish.com/hotel/' },
    { label: 'EG Academy 官方网站', url: 'https://egesl.com/' },
    {
      label: 'EG Academy 官方概况',
      url: 'https://egesl.com/bbs/board.php?bo_table=overview',
    },
    {
      label: 'EG Academy 官方费用PDF',
      url: 'https://www.egesl.com/study/cost/cost_2025.pdf',
    },
    {
      label: 'EG Academy 官方Golf页面',
      url: 'https://www.egesl.com/study/golf/',
    },
    { label: '菲律宾克拉克WE Academy语言学校官方网站', url: 'https://clarkweacademy.com/' },
    { label: '菲律宾克拉克TALK Academy语言学校官方网站', url: 'https://clarktalkacademy.com/' },
    { label: 'TALK Academy 2026费用表公开资料', url: 'https://www.ph-ryugaku.com/school/clark-talk-academy/' },
    { label: '菲律宾克拉克HELP English语言学校官方Clark页面', url: 'https://www.helpenglish.org/p/clark-campus.html' },
    { label: '菲律宾克拉克AELC语言学校资料页', url: 'https://philippine-english.jp/clark/aelc.php' },
    { label: 'AELC旧域名与位置记录', url: 'https://philippines.worldplaces.me/view-place/42879050-aelc-american-english-learning-center.html' },
    { label: 'HANA Academy 官方网站', url: 'https://clarkhana.com/' },
    { label: 'iOutback 菲律宾游学结构参考', url: 'https://www.ioutback.com/' },
    {
      label: 'StudyTourA 菲律宾学校分类参考',
      url: 'https://www.studytoura.com/cebu-schools/',
    },
    { label: '格仲游学菲律宾学校比较参考', url: 'https://gezhong.com.tw/' },
  ];

  readonly page = createCityStudyPage({
    cityName: '克拉克',
    englishName: 'Clark',
    heroKicker: '机场便利与亲子友好的学习城市',
    heroKickerIcon: 'flight_takeoff',
    heroSubtitle: '国际社区 × 外教口语 × 亲子友好',
    heroDescription:
      '克拉克拥有国际机场与成熟生活配套，外教口语、亲子和青少年课程选择突出。这里比海岛旅游区安静，交通又比山城更轻松，适合重视接送便利、住宿舒适与家庭学习安排的学生。',
    heroImage: '/assets/philippines/clark-study-hero.jpg',
    heroImageAlt: '菲律宾克拉克城市与语言学校环境',
    heroStudyImage: '/assets/philippines/cip-classroom-one-to-one.jpg',
    heroLessonImage: '/assets/philippines/we-native-teacher.jpg',
    heroVisualLabel: '克拉克城市、外教课堂与亲子学习场景',
    benefitChips: [
      { icon: 'flight_takeoff', label: '国际机场便利' },
      { icon: 'record_voice_over', label: '外教口语突出' },
      { icon: 'family_restroom', label: '亲子课程丰富' },
      { icon: 'villa', label: '住宿环境舒适' },
    ],
    stats: [
      { value: '7所', label: '克拉克学校资料', icon: 'workspace_premium' },
      { value: '外教课', label: 'Native Mix' },
      { value: '亲子友好', label: '儿童与陪读' },
      { value: '机场直达', label: '行程衔接更省心' },
    ],
    schoolTypes: this.schoolTypes.map((type, index) => ({
      ...type,
      icon: ['record_voice_over', 'family_restroom', 'school', 'business_center'][index],
    })),
    schoolProfiles: this.schoolProfiles,
    highlights: this.highlights,
    selectionImages: [
      '/assets/philippines/cip-campus-hero.jpg',
      '/assets/philippines/we-family-program.jpg',
      '/assets/philippines/eg-campus-building.jpg',
      '/assets/philippines/help-clark-main-building.jpg',
    ],
    lifestyleImages: [
      '/assets/philippines/we-native-teacher.jpg',
      '/assets/philippines/we-campus-life.jpg',
      '/assets/philippines/clark-study-hero.jpg',
      '/assets/philippines/cip-stay-amenities.jpg',
    ],
    faqs: this.faqs,
    featuredTitle: '克拉克热门语言学校推荐',
    featuredSubtitle: '重点比较外教比例、亲子安排、住宿和机场接送',
    lifestyleTitle: '在克拉克，学习和家庭生活都更从容',
    lifestyleSubtitle: '国际社区、机场与成熟生活配套，让短期和亲子行程更好安排',
  });
}

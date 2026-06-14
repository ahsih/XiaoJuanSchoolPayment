import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

interface IrelandInfoPage {
  title: string;
  englishTitle: string;
  summary: string;
  audience: string;
  keywords: string;
  heroImage: string;
  metrics: { value: string; label: string }[];
  cardsTitle: string;
  cards: { icon: string; title: string; text: string }[];
  guideTitle: string;
  guideText: string;
  checklist: string[];
  sources: { label: string; url: string }[];
}

const irelandSources = [
  {
    label: '爱尔兰教育服务中心 IESC',
    url: 'https://www.irelandeducation.cn/chinese-partner-school/',
  },
  {
    label: 'Education in Ireland',
    url: 'https://www.educationinireland.com/',
  },
];

const irelandInfoPages: Record<string, IrelandInfoPage> = {
  experience: {
    title: '体验爱尔兰',
    englishTitle: 'Experience Ireland',
    audience: '建立兴趣和国家认知',
    keywords: '英语环境、欧洲文化、安全友好、校园体验、城市生活',
    heroImage:
      'https://images.unsplash.com/photo-1590089415225-401ed6f9db8e?auto=format&fit=crop&w=1200&q=80',
    summary:
      '爱尔兰适合先从“国家体验”建立留学兴趣：它是英语国家，也是欧盟成员国，学生可以在英语课堂、欧洲文化、自然景观和国际化城市之间形成比较完整的海外学习认知。',
    metrics: [
      { value: '英语', label: '主要学习与生活语言' },
      { value: '欧盟', label: '连接欧洲学习与职业机会' },
      { value: '文化', label: '文学、音乐、历史与自然体验丰富' },
    ],
    cardsTitle: '为什么适合做留学认知入口',
    cards: [
      {
        icon: 'language',
        title: '英语环境自然',
        text: '课堂、生活、社交和实习场景都以英语为主，适合希望把英语能力放进真实环境中提升的学生。',
      },
      {
        icon: 'public',
        title: '欧洲视野清晰',
        text: '爱尔兰连接英国、欧洲大陆和跨国企业网络，适合对欧洲学习、交流和未来就业有兴趣的家庭。',
      },
      {
        icon: 'museum',
        title: '文化辨识度高',
        text: '文学、音乐、历史建筑和自然风景都很有代表性，能帮助学生更快形成对目的国的真实印象。',
      },
      {
        icon: 'groups',
        title: '国际学生友好',
        text: '高校和语言环境相对国际化，适合第一次考虑欧洲留学、希望先了解生活节奏和学习方式的学生。',
      },
    ],
    guideTitle: '页面可以怎么承接咨询',
    guideText:
      '这一页更适合作为爱尔兰留学入口页，先回答“爱尔兰是什么样的国家、适不适合我”，再把用户引导到教育系统、工作机会、本科或硕士申请页面。',
    checklist: [
      '适合放在“为何选择爱尔兰”菜单下，作为用户第一次了解爱尔兰的起点。',
      '重点突出英语国家、欧盟背景、文化体验和安全友好，不需要一开始堆申请细节。',
      '可以引导用户继续查看教育体系、毕业后工作和经济就业页面。',
    ],
    sources: irelandSources,
  },
  educationSystem: {
    title: '爱尔兰教育系统',
    englishTitle: 'Ireland Education System',
    audience: '解释本科、硕士、预科、语言等体系',
    keywords: '本科、硕士、预科、语言课程、综合大学、理工大学、私立学院',
    heroImage:
      'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1200&q=80',
    summary:
      '爱尔兰教育体系可以按中学、语言与预科、本科、硕士和研究型课程来理解。对中国学生来说，关键是先确认学历阶段、英语要求、专业方向和院校类型，再匹配申请路径。',
    metrics: [
      { value: '本科', label: '通常围绕专业方向和入学要求规划' },
      { value: '硕士', label: '常见一年制授课型课程选择多' },
      { value: '预科', label: '适合衔接语言、学术和专业基础' },
    ],
    cardsTitle: '体系拆解',
    cards: [
      {
        icon: 'school',
        title: '综合大学',
        text: '适合追求学术声誉、研究资源和完整专业体系的学生，常见方向包括商科、工程、计算机、医学相关和人文社科。',
      },
      {
        icon: 'engineering',
        title: '理工大学与技术类院校',
        text: '更强调应用型学习、行业连接和实践能力，适合看重就业导向、项目经验和技术能力的学生。',
      },
      {
        icon: 'business_center',
        title: '私立学院与专业学院',
        text: '部分院校在商科、会计、管理、酒店、语言和职业导向课程上更灵活，适合关注入学节奏和实践应用的学生。',
      },
      {
        icon: 'record_voice_over',
        title: '语言与桥梁课程',
        text: '语言课、预科或桥梁课程可帮助学生补足英语、学术写作和专业基础，再进入正式学位课程。',
      },
    ],
    guideTitle: '选校时先看这几个维度',
    guideText:
      '不要只看学校名字。更建议先确定目标专业、当前成绩、英语水平、预算、城市偏好和未来就业方向，再判断综合大学、理工大学、私立学院或预科路径哪个更稳。',
    checklist: [
      '确认当前学历能衔接本科、硕士、预科还是语言课程。',
      '确认目标专业是否需要作品集、面试、数学背景或相关本科背景。',
      '确认雅思或同等英语要求，以及是否接受语言班或预科衔接。',
      '把学术匹配、预算、城市、住宿和毕业后规划一起考虑。',
    ],
    sources: irelandSources,
  },
  working: {
    title: '在爱尔兰工作',
    englishTitle: 'Working In Ireland',
    audience: '承接毕业后工作兴趣',
    keywords: '学生兼职、实习、毕业后工作、Stamp 1G、就业规划',
    heroImage:
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80',
    summary:
      '很多学生关注爱尔兰，是因为学习期间可以积累英语环境中的工作认知，毕业后也可能根据课程级别和签证条件评估留爱工作路径。具体工时和签证规则要以爱尔兰官方最新政策为准。',
    metrics: [
      { value: '兼职', label: '学习期间需按签证规则安排' },
      { value: '实习', label: '部分课程可结合行业项目或实习' },
      { value: '毕业后', label: '可评估毕业生工作许可路径' },
    ],
    cardsTitle: '学生最关心的工作问题',
    cards: [
      {
        icon: 'schedule',
        title: '学习期间兼职',
        text: '是否能兼职、可工作时长和假期安排，取决于签证类型、课程类型和官方规则。页面上适合提醒学生不要把兼职收入当作主要预算来源。',
      },
      {
        icon: 'work',
        title: '实习与行业项目',
        text: '商科、计算机、工程、数据、制药和酒店管理等方向，常见课程会强调项目经验、企业连接或职业能力训练。',
      },
      {
        icon: 'badge',
        title: '毕业后工作路径',
        text: '本科、硕士或更高阶段毕业后，学生通常会关注爱尔兰毕业生计划、Stamp 1G 和后续工作许可，具体资格需逐案确认。',
      },
      {
        icon: 'psychology',
        title: '提前做职业准备',
        text: '英文简历、LinkedIn、面试表达、专业技能证据和实习经历，比“到了当地再说”更能影响就业结果。',
      },
    ],
    guideTitle: '内容定位建议',
    guideText:
      '这一页适合把“能不能工作”讲清楚，但不要承诺结果。更好的转化方式是把工作机会拆成学习期间兼职、课程实习、毕业后签证和长期职业规划四个层次。',
    checklist: [
      '申请前确认课程是否符合学生签证和毕业后工作路径要求。',
      '预算规划不要依赖兼职收入，生活费和学费应先准备充足。',
      '选择专业时同步考虑目标行业、城市机会和技能积累。',
      '签证、工时和毕业后政策可能变化，最终以官方最新要求为准。',
    ],
    sources: [
      ...irelandSources,
      {
        label: 'Irish Immigration Service Delivery',
        url: 'https://www.irishimmigration.ie/',
      },
    ],
  },
  economyCareers: {
    title: '爱尔兰经济与就业',
    englishTitle: 'Ireland Economy And Careers',
    audience: '增强就业与未来发展吸引力',
    keywords: '科技、制药、金融、工程、跨国公司、欧洲总部',
    heroImage:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    summary:
      '爱尔兰的就业吸引力来自英语环境、欧盟市场、跨国企业集群和科技制药等产业优势。对留学生来说，选择专业时要把行业需求、城市机会和个人技能放在一起判断。',
    metrics: [
      { value: '科技', label: '计算机、数据、软件和数字业务机会集中' },
      { value: '制药', label: '生命科学和医药制造是重要产业' },
      { value: '金融', label: '都柏林有金融、会计和商业服务机会' },
    ],
    cardsTitle: '常见就业方向',
    cards: [
      {
        icon: 'computer',
        title: '科技与数据',
        text: '软件开发、数据分析、网络安全、云服务和产品运营，是国际学生常关注的方向，要求项目能力和英文沟通并重。',
      },
      {
        icon: 'biotech',
        title: '制药与生命科学',
        text: '爱尔兰在医药、医疗器械和生命科学制造方面有产业基础，适合化学、生物、工程和质量管理相关背景的学生关注。',
      },
      {
        icon: 'account_balance',
        title: '金融与商业服务',
        text: '会计、金融、商业分析、供应链和管理类岗位集中在城市区域，院校项目、实习和职业服务会影响求职节奏。',
      },
      {
        icon: 'hotel',
        title: '酒店与服务管理',
        text: '旅游、酒店和服务业也有课程与就业连接，适合希望走实践路线、客户服务或管理方向的学生。',
      },
    ],
    guideTitle: '专业选择要反推就业',
    guideText:
      '对于重视就业的学生，选专业时要反推目标岗位：它需要什么学历、技能、作品或项目经历，所在城市是否有岗位，毕业后签证时间是否足够完成求职。',
    checklist: [
      '优先选择和目标行业高度相关的课程，而不是只看专业名称是否热门。',
      '查看课程是否包含项目、实习、职业服务、企业合作或毕业生去向。',
      '关注都柏林、科克、高威、利默里克等城市的行业分布。',
      '把英语表达、作品集、项目经历和面试准备作为就业竞争力的一部分。',
    ],
    sources: [
      ...irelandSources,
      {
        label: 'IDA Ireland',
        url: 'https://www.idaireland.com/',
      },
    ],
  },
  workStudy: {
    title: '爱尔兰半工半读',
    englishTitle: 'Study And Work In Ireland',
    audience: '吸引预算敏感、希望合法兼职的用户',
    keywords: '半工半读、学生兼职、语言提升、预算规划、毕业后工作',
    heroImage:
      'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80',
    summary:
      '爱尔兰半工半读页面适合承接预算敏感、希望在英语环境中边学习边积累工作认知的用户。页面重点不是承诺“靠打工覆盖全部费用”，而是帮助学生理解学习、兼职、签证规则、预算和长期就业规划之间的关系。',
    metrics: [
      { value: '学习', label: '先确保课程、出勤和签证合规' },
      { value: '兼职', label: '按官方工时和课程规则安排' },
      { value: '预算', label: '用总预算评估，不依赖兼职兜底' },
    ],
    cardsTitle: '半工半读要讲清楚的重点',
    cards: [
      {
        icon: 'school',
        title: '课程是核心',
        text: '用户虽然关注兼职，但页面需要先说明课程类型、学习目标、出勤要求和英语提升路径。学习合规是后续兼职和签证稳定的基础。',
      },
      {
        icon: 'schedule',
        title: '兼职要看规则',
        text: '是否可以兼职、可工作时段和时长，应以爱尔兰官方和签证条件为准。适合提醒学生提前确认课程是否满足相关要求。',
      },
      {
        icon: 'payments',
        title: '预算不能只靠打工',
        text: '半工半读可以减轻部分生活压力，但不应把兼职收入作为学费和生活费的唯一来源。申请前仍需准备足够资金。',
      },
      {
        icon: 'work_history',
        title: '连接长期规划',
        text: '如果学生未来考虑毕业后留爱工作，专业选择、英语表达、实习经历和简历准备要从入学前就开始规划。',
      },
    ],
    guideTitle: '适合哪些学生',
    guideText:
      '这个页面适合给预算敏感但目标清晰的学生：他们希望控制成本，也愿意接受真实英语环境训练。页面语气要稳，不夸大兼职收入，把“合法合规、总预算、学习优先”放在前面。',
    checklist: [
      '先确认目标课程、学习周期、城市和住宿预算。',
      '确认签证与课程规则是否允许兼职，以及可工作的时间范围。',
      '把学费、住宿、生活费、保险、签证、机票和备用金一起计算。',
      '如果目标是毕业后就业，同步准备英文简历、面试表达和专业技能。',
    ],
    sources: [
      ...irelandSources,
      {
        label: 'Irish Immigration Service Delivery',
        url: 'https://www.irishimmigration.ie/',
      },
    ],
  },
  admissionInfo: {
    title: '爱尔兰院校招生信息',
    englishTitle: 'Ireland Admission Information',
    audience: '参考爱尔兰教育官网的招生信息结构',
    keywords: '招生信息、入学要求、申请材料、截止日期、英语要求',
    heroImage:
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
    summary:
      '院校招生信息页用于集中解释不同爱尔兰院校的申请入口、入学要求和材料逻辑。对用户来说，它比单独查看学校新闻更自然，可以先建立“怎么筛招生信息”的方法，再进入具体学校咨询。',
    metrics: [
      { value: '要求', label: '学历、成绩、语言和背景匹配' },
      { value: '材料', label: '成绩单、文书、推荐和补充材料' },
      { value: '时间', label: '截止日期和热门专业名额节奏' },
    ],
    cardsTitle: '招生信息怎么筛',
    cards: [
      {
        icon: 'assignment',
        title: '入学要求',
        text: '先看学历阶段、均分或成绩要求、英语要求、专业背景限制，以及是否需要作品集、面试或额外测试。',
      },
      {
        icon: 'description',
        title: '申请材料',
        text: '常见材料包括成绩单、在读或毕业证明、语言成绩、个人陈述、推荐信、简历和护照信息。不同专业会有补充要求。',
      },
      {
        icon: 'event',
        title: '申请时间',
        text: '热门专业和热门学校通常需要更早准备。招生信息页应提醒用户关注开放时间、截止日期和补件周期。',
      },
      {
        icon: 'rule',
        title: '录取判断',
        text: '不要只看最低要求。真实录取还会受专业竞争、申请批次、材料完整度和学生背景匹配度影响。',
      },
    ],
    guideTitle: '更适合做成院校聚合页',
    guideText:
      '这一页可以作为“院校库”的招生入口：先解释如何读懂招生信息，再引导用户按学校、专业、申请阶段或预算继续筛选。',
    checklist: [
      '先确认申请本科、硕士、预科、语言课程还是中学项目。',
      '把学校要求和目标专业要求分开看，专业要求通常更关键。',
      '提前整理中英文成绩单、学历证明、文书和推荐人信息。',
      '热门课程建议提前规划，避免等到截止前才准备材料。',
    ],
    sources: [
      ...irelandSources,
      {
        label: '爱尔兰院校招生信息 - IESC',
        url: 'https://www.irelandeducation.cn/university-news/',
      },
    ],
  },
  scholarships: {
    title: '爱尔兰院校奖学金信息',
    englishTitle: 'Ireland Scholarships',
    audience: '比单独放“奖学金”更自然',
    keywords: '奖学金、学费减免、申请条件、优秀学生、院校资助',
    heroImage:
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80',
    summary:
      '爱尔兰院校奖学金信息页适合解释奖学金类型、申请条件和准备方式。页面重点应放在“如何判断自己能不能争取”，而不是简单罗列金额。',
    metrics: [
      { value: '成绩', label: '多数奖学金看重学术表现' },
      { value: '材料', label: '文书、简历和推荐可增强竞争力' },
      { value: '时效', label: '奖学金名额和截止时间需要早确认' },
    ],
    cardsTitle: '奖学金信息怎么讲',
    cards: [
      {
        icon: 'workspace_premium',
        title: '院校奖学金',
        text: '部分学校会针对国际学生、本科生、硕士生或特定学院提供学费减免。金额、条件和自动评估方式因学校而异。',
      },
      {
        icon: 'stars',
        title: '优秀学生奖励',
        text: '成绩、语言分数、竞赛、实习、科研或作品集都可能影响竞争力。页面可以引导用户先做背景评估。',
      },
      {
        icon: 'edit_note',
        title: '申请材料表达',
        text: '即使奖学金金额固定，文书质量、简历结构和推荐信也会影响学校对学生潜力和匹配度的判断。',
      },
      {
        icon: 'calendar_month',
        title: '截止日期',
        text: '奖学金常有独立截止日期，或随课程录取自动审核。建议在确定学校清单时同步确认奖学金规则。',
      },
    ],
    guideTitle: '别把奖学金当成唯一预算方案',
    guideText:
      '奖学金可以降低总费用，但不适合作为唯一资金来源。页面应帮助用户建立合理预期：先确认总预算，再评估可以争取哪些学校和专业的奖学金。',
    checklist: [
      '确认奖学金是否需要单独申请，还是随课程申请自动评估。',
      '确认奖学金适用本科、硕士、预科还是特定学院或专业。',
      '准备能体现学术能力、实践经历和未来规划的材料。',
      '把奖学金结果作为加分项，同时保留稳妥的资金预算。',
    ],
    sources: [
      ...irelandSources,
      {
        label: '爱尔兰院校奖学金信息 - IESC',
        url: 'https://www.irelandeducation.cn/university-scholarship/',
      },
    ],
  },
  universities: {
    title: '爱尔兰综合性大学',
    englishTitle: 'Irish Universities',
    audience: '院校分类页',
    keywords: '综合性大学、TCD、UCD、高威大学、科克大学、都柏林城市大学',
    heroImage:
      'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80',
    summary:
      '爱尔兰综合性大学页面用于把重点大学集中放在一起，帮助用户理解大学类型、学位层级、专业覆盖和申请难度。相比单个学校页面，这一页更适合作为院校库的分类入口。',
    metrics: [
      { value: 'NFQ', label: '爱尔兰国家资格框架帮助理解学位等级' },
      { value: 'Level 8', label: '荣誉学士通常用于衔接硕士申请' },
      { value: '硕博', label: '综合大学覆盖授课型和研究型课程' },
    ],
    cardsTitle: '综合性大学怎么选',
    cards: [
      {
        icon: 'account_balance',
        title: '学术与排名',
        text: '综合性大学通常专业覆盖更完整，学术资源和研究机会更强。适合重视学校声誉、升学深造和综合资源的学生。',
      },
      {
        icon: 'hub',
        title: '专业覆盖',
        text: '常见方向包括商科、计算机、工程、医学相关、生命科学、人文社科、教育和法律等。不同大学优势专业差异明显。',
      },
      {
        icon: 'location_city',
        title: '城市与资源',
        text: '都柏林、科克、高威、利默里克等城市的产业环境、住宿成本和生活节奏不同，选校时要和预算及就业方向一起判断。',
      },
      {
        icon: 'fact_check',
        title: '申请难度',
        text: '综合大学通常对成绩、语言和专业背景要求更清晰，热门课程竞争更强，需要提前准备材料和备选方案。',
      },
    ],
    guideTitle: '适合作为院校库分类页',
    guideText:
      '这一页不需要替代单校详情页，而是作为“综合性大学”入口，让用户先理解大学类别和筛选逻辑，再进入TCD、UCD、高威大学、科克大学、DCU等单校页面。',
    checklist: [
      '先按专业方向筛学校，再看排名和城市偏好。',
      '确认课程对应的学位等级、授予机构和后续升学路径。',
      '热门大学和热门专业建议准备冲刺、匹配和保底组合。',
      '把学费、住宿、奖学金机会和毕业后就业城市一起比较。',
    ],
    sources: [
      ...irelandSources,
      {
        label: '爱尔兰高等教育机构 - IESC',
        url: 'https://www.irelandeducation.cn/introduction-institutions/',
      },
    ],
  },
};

@Component({
  selector: 'app-ireland-info-page',
  standalone: false,
  templateUrl: './ireland-info-page.component.html',
  styleUrl: './ireland-info-page.component.css',
})
export class IrelandInfoPageComponent {
  private readonly route = inject(ActivatedRoute);

  readonly page$ = this.route.data.pipe(
    map((data) => irelandInfoPages[data['infoKey'] as string] ?? irelandInfoPages['experience']),
  );
}

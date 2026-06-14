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
  technologyUniversities: {
    title: '爱尔兰理工大学/理工学院',
    englishTitle: 'Irish Technological Universities',
    audience: '兼容爱尔兰院校名称变化',
    keywords: '理工大学、理工学院、应用型课程、TUD、TUS、SETU、MTU、ATU',
    heroImage:
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
    summary:
      '爱尔兰理工大学和理工学院适合重视应用型学习、实践项目和就业衔接的学生。随着院校整合升级，很多原理工学院已发展为Technological University，因此页面需要同时兼容“理工大学”和“理工学院”的叫法。',
    metrics: [
      { value: '应用型', label: '课程更强调项目、实验和职业能力' },
      { value: '多校区', label: '不少理工大学覆盖多个城市校区' },
      { value: '就业导向', label: '适合关注技能落地和行业连接的学生' },
    ],
    cardsTitle: '理工类院校怎么理解',
    cards: [
      {
        icon: 'engineering',
        title: '名称正在变化',
        text: '爱尔兰院校体系中，一些原Institute of Technology已经整合或升级为Technological University，中文页面应同时保留理工大学和理工学院两种表达。',
      },
      {
        icon: 'science',
        title: '不只工程技术',
        text: '理工类院校虽然强调应用，但专业并不只限工程，也常覆盖商科、计算机、设计、酒店、健康、人文和社会科学等方向。',
      },
      {
        icon: 'work',
        title: '实践比例更高',
        text: '课程通常更注重项目、实验、行业案例和就业技能，适合希望把学习结果直接连接到岗位能力的学生。',
      },
      {
        icon: 'map',
        title: '城市选择更多',
        text: '理工大学常分布在不同区域和城市，学生可以结合预算、住宿、专业资源和就业区域来筛选校区。',
      },
    ],
    guideTitle: '适合什么学生',
    guideText:
      '如果学生预算敏感、成绩不是特别冲刺型，或者更重视实践能力和毕业就业，理工大学/理工学院通常比单纯追综合排名更值得认真比较。',
    checklist: [
      '确认学校当前英文名称和授予学位的机构，避免旧名称造成误解。',
      '查看课程是否包含实习、行业项目、实验室、作品集或职业模块。',
      '比较不同校区的城市成本、住宿资源和交通便利度。',
      '不要只按“理工”判断专业范围，商科、计算机、设计和酒店等也可能很强。',
    ],
    sources: [
      ...irelandSources,
      {
        label: '爱尔兰高等教育机构 - IESC',
        url: 'https://www.irelandeducation.cn/introduction-institutions/',
      },
    ],
  },
  privateSchools: {
    title: '爱尔兰私立院校',
    englishTitle: 'Irish Private Colleges',
    audience: '比“私立学院”覆盖更宽',
    keywords: '私立院校、独立学院、DBS、GCD、商科、会计、职业课程',
    heroImage:
      'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1200&q=80',
    summary:
      '爱尔兰私立院校适合需要更灵活课程选择、职业导向更明确或想关注特定专业领域的学生。页面使用“私立院校”比“私立学院”更包容，能覆盖商学院、专业学院、预科学院和职业导向机构。',
    metrics: [
      { value: '灵活', label: '课程设置和入学节奏通常更细分' },
      { value: '职业', label: '商科、会计、法律、IT等方向常见' },
      { value: '衔接', label: '部分院校适合背景转换或升学过渡' },
    ],
    cardsTitle: '私立院校页面重点',
    cards: [
      {
        icon: 'business_center',
        title: '专业方向集中',
        text: '私立院校常在商科、会计、金融、法律、IT、媒体、心理、预科或职业课程上有更集中的产品线。',
      },
      {
        icon: 'verified',
        title: '资质要确认',
        text: '需要确认课程认证、授予学位机构、专业豁免、升学路径和毕业后签证适配情况，避免只看学校名称。',
      },
      {
        icon: 'event_available',
        title: '入学可能更灵活',
        text: '部分私立院校会有更灵活的开课时间、转专业路径或桥梁课程，适合背景需要补强的学生。',
      },
      {
        icon: 'groups',
        title: '服务导向明显',
        text: '很多私立院校更强调就业办公室、职业指导、实践机会和小班支持，适合目标明确的申请者。',
      },
    ],
    guideTitle: '怎么避免误选',
    guideText:
      '私立院校不是“低一档”的简单标签。关键是课程是否被认可、是否适合学生背景、是否能支持后续升学或就业，以及预算是否匹配。',
    checklist: [
      '确认课程授予学位的主体、认证机构和NFQ等级。',
      '查看是否适合中国学生当前学历背景和英语水平。',
      '比较课程内容、实习支持、就业服务和毕业生方向。',
      '把学费、城市成本、住宿和奖学金机会一起算总预算。',
    ],
    sources: [
      ...irelandSources,
      {
        label: 'DBS 都柏林商学院 - IESC',
        url: 'https://www.irelandeducation.cn/dublin-business-school/',
      },
    ],
  },
  languageSchools: {
    title: '爱尔兰语言学校',
    englishTitle: 'Ireland Language Schools',
    audience: '连接爱尔兰游学和半工半读',
    keywords: '语言学校、英语课程、短期游学、半工半读、住宿、活动',
    heroImage:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
    summary:
      '爱尔兰语言学校页面可以承接短期英语提升、长期语言课程、半工半读和留学前语言衔接需求。它和菲律宾游学不同，更适合强调欧洲英语环境、签证合规、住宿选择和后续升学规划。',
    metrics: [
      { value: '短期', label: '适合体验英语环境和欧洲生活' },
      { value: '长期', label: '可衔接半工半读或升学准备' },
      { value: '住宿', label: '寄宿家庭、学生公寓和校外住宿需提前比较' },
    ],
    cardsTitle: '语言学校怎么选',
    cards: [
      {
        icon: 'record_voice_over',
        title: '课程目标',
        text: '先区分一般英语、雅思备考、商务英语、升学英语或长期语言课程。目标不同，课程强度和学校选择会不同。',
      },
      {
        icon: 'home_work',
        title: '住宿安排',
        text: '语言学校常涉及寄宿家庭、学生公寓或自理住宿。预算、通勤、安全和生活习惯都要提前确认。',
      },
      {
        icon: 'event',
        title: '活动与体验',
        text: '短期语言项目可以结合城市探索、文化活动和社交练习，适合作为爱尔兰体验或留学前适应。',
      },
      {
        icon: 'rule',
        title: '签证与合规',
        text: '长期语言课程、出勤要求、保险、续签和兼职安排需要严格按官方规则确认，尤其适合半工半读用户重点阅读。',
      },
    ],
    guideTitle: '和菲律宾游学怎么区分',
    guideText:
      '菲律宾游学强调高密度一对一和性价比，爱尔兰语言学校更适合欧洲英语环境、长期适应、升学衔接和合法兼职规划。页面要把这两类需求清楚分开。',
    checklist: [
      '确认学习周期：2-4周体验、8-12周提升，还是半年以上长期课程。',
      '确认学校资质、课程强度、班级人数、国籍比例和出勤要求。',
      '同步比较住宿方式、通勤时间、生活费和当地支持服务。',
      '如果计划半工半读，先确认课程和签证规则是否匹配。',
    ],
    sources: [
      ...irelandSources,
      {
        label: '爱尔兰语言学校 - IESC',
        url: 'https://www.irelandeducation.cn/language-course/',
      },
    ],
  },
  nci: {
    title: 'NCI 爱尔兰国家学院',
    englishTitle: 'National College Of Ireland',
    audience: '重点合作/推荐院校',
    keywords: 'NCI、爱尔兰国家学院、都柏林、商科、计算机、金融服务、数据分析',
    heroImage:
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80',
    summary:
      'NCI 爱尔兰国家学院适合作为重点合作/推荐院校页。它位于都柏林核心商业和金融区域，专业方向集中在商科、金融、人力资源、计算机、云计算、网络安全和数据分析等就业导向领域。',
    metrics: [
      { value: '1951', label: 'IESC资料显示学院成立年份' },
      { value: '都柏林', label: '位于国际金融服务中心区域' },
      { value: '商科+IT', label: '商学院与计算机方向适合就业导向学生' },
    ],
    cardsTitle: 'NCI 适合重点推荐的原因',
    cards: [
      {
        icon: 'location_city',
        title: '都柏林核心位置',
        text: 'IESC资料显示，NCI位于都柏林国际金融服务中心区域，靠近多家跨国公司和金融服务机构，适合看重城市资源的学生。',
      },
      {
        icon: 'business',
        title: '商科方向集中',
        text: '会计、商科、金融服务、人力资源管理、管理学和市场营销等方向适合希望连接商业岗位的学生。',
      },
      {
        icon: 'computer',
        title: '计算机与数据方向',
        text: 'NCI相关课程包含云计算、移动技术、网络安全、数据分析、计算机科学和商务信息系统等应用型方向。',
      },
      {
        icon: 'school',
        title: '预科与衔接',
        text: 'IESC页面提到NCI有本科预科和硕士预科安排，可帮助部分国际学生补足英语、商务、数学和信息技术等基础。',
      },
    ],
    guideTitle: '适合什么申请者',
    guideText:
      'NCI更适合目标明确、希望留在都柏林、关注商科或计算机就业方向的学生。申请时要重点核对课程级别、开学季、英语要求、学费、住宿和实习/就业支持。',
    checklist: [
      '适合关注商科、金融、人力资源、管理、云计算、网络安全和数据分析的学生。',
      '确认课程是否有9月或1月开学，以及本科、硕士或预科路径。',
      '都柏林生活成本较高，住宿和生活费要提前纳入预算。',
      '官方课程信息可能更新，最终以NCI和学校最新书面确认为准。',
    ],
    sources: [
      ...irelandSources,
      {
        label: 'NCI 爱尔兰国家学院 - IESC',
        url: 'https://www.irelandeducation.cn/national-college-of-ireland/',
      },
      {
        label: 'National College of Ireland',
        url: 'https://www.ncirl.ie/',
      },
    ],
  },
  schm: {
    title: 'SCHM 爱尔兰香农酒店管理学院',
    englishTitle: 'Shannon College Of Hotel Management',
    audience: '院校详情页，中英文并列',
    keywords: 'SCHM、Shannon College、酒店管理、University of Galway、带薪实习、国际酒店',
    heroImage:
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    summary:
      'SCHM 爱尔兰香农酒店管理学院（Shannon College of Hotel Management）适合希望走酒店管理、全球服务业、奢华体验管理和国际商务方向的学生。页面重点应突出它与University of Galway的联系、酒店管理专精、实习安排和全球校友网络。',
    metrics: [
      { value: '1951', label: 'University of Galway资料显示学院创立年份' },
      { value: '21个月', label: '本科阶段强调带薪实习与行业体验' },
      { value: '3,000+', label: '官方页面提到全球校友网络持续增长' },
    ],
    cardsTitle: 'SCHM 页面重点',
    cards: [
      {
        icon: 'hotel',
        title: '酒店管理专精',
        text: 'Shannon College定位为爱尔兰专门的酒店管理学院，适合对酒店、服务、旅游、奢华体验和国际运营有兴趣的学生。',
      },
      {
        icon: 'school',
        title: 'University of Galway体系',
        text: '官方页面显示Shannon College作为University of Galway的一部分，课程和学生体验与大学资源相连接。',
      },
      {
        icon: 'work',
        title: '实习与就业导向',
        text: '页面应强调工作实习、职业发展和国际酒店网络，帮助学生理解酒店管理不是单纯课堂专业，而是强实践路径。',
      },
      {
        icon: 'public',
        title: '全球化行业',
        text: '酒店与奢华体验管理适合愿意跨文化沟通、具备服务意识，并希望未来进入国际酒店集团或旅游服务行业的学生。',
      },
    ],
    guideTitle: '适合什么申请者',
    guideText:
      'SCHM适合目标明确、愿意接受实习强度、喜欢与人沟通并希望进入国际酒店或服务管理行业的学生。页面中英文并列更利于用户识别英文校名和后续申请材料。',
    checklist: [
      '确认目标课程是本科、硕士、预科还是短期/继续教育方向。',
      '重点核对实习周期、实习地点、行业合作和就业支持。',
      '酒店管理专业更看重沟通、服务意识、英语表达和职业形象。',
      '最终课程、学费和录取要求以学校最新官方说明为准。',
    ],
    sources: [
      ...irelandSources,
      {
        label: 'SCHM 爱尔兰香农酒店管理学院 - IESC',
        url: 'https://www.irelandeducation.cn/shannon-college-of-hotel-management/',
      },
      {
        label: 'Shannon College of Hotel Management',
        url: 'https://www.universityofgalway.ie/shannoncollege/',
      },
    ],
  },
  mic: {
    title: 'MIC 爱尔兰伊玛克特教育学院',
    englishTitle: 'Mary Immaculate College',
    audience: '院校详情页，补充英文 Mary Immaculate College',
    keywords: 'MIC、Mary Immaculate College、教育、Limerick、Thurles、文学、人文、教师教育',
    heroImage:
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80',
    summary:
      'MIC 爱尔兰伊玛克特教育学院（Mary Immaculate College）适合关注教育、教师培养、文学、人文社科和儿童/青少年发展方向的学生。页面需要明确补充英文校名 Mary Immaculate College，方便用户后续查校和准备申请材料。',
    metrics: [
      { value: '1898', label: '公开资料显示学院创立年份' },
      { value: 'Limerick', label: '主校区位于利默里克' },
      { value: 'Education', label: '教育与人文方向辨识度高' },
    ],
    cardsTitle: 'MIC 页面重点',
    cards: [
      {
        icon: 'menu_book',
        title: '教育方向鲜明',
        text: 'Mary Immaculate College以教育和教师培养见长，适合未来考虑教育、儿童发展、教学或教育研究的学生。',
      },
      {
        icon: 'history_edu',
        title: '人文与文学基础',
        text: '除教育外，MIC也覆盖文学、人文、社会科学和相关跨学科方向，适合希望在小而专的院校环境中学习的学生。',
      },
      {
        icon: 'location_city',
        title: 'Limerick 学习生活',
        text: '利默里克是爱尔兰重要学生城市之一，相比都柏林通常更适合关注生活节奏、社区感和成本平衡的学生。',
      },
      {
        icon: 'school',
        title: 'University of Limerick联系',
        text: '公开资料显示MIC与University of Limerick有学术联系，申请时要核对具体课程授予、校区和专业归属。',
      },
    ],
    guideTitle: '适合什么申请者',
    guideText:
      'MIC适合目标专业集中在教育、文学、人文社科、心理或儿童相关方向的学生。它不是大而全的综合大学页面，更适合以“专业匹配”和“学习环境”作为核心卖点。',
    checklist: [
      '页面和申请材料中同时写清 MIC 与 Mary Immaculate College。',
      '确认课程属于教育、文学、人文、心理还是Thurles校区相关方向。',
      '教育类专业可能涉及实践、实习或职业资格路径，需逐项确认。',
      '比较Limerick生活成本、住宿、交通和未来就业/升学路径。',
    ],
    sources: [
      ...irelandSources,
      {
        label: 'MIC 爱尔兰伊玛克特教育学院 - IESC',
        url: 'https://www.irelandeducation.cn/mary-immaculate-college/',
      },
      {
        label: 'Mary Immaculate College',
        url: 'https://www.mic.ul.ie/',
      },
    ],
  },
};

@Component({
  selector: 'app-ireland-info-page',
  standalone: false,
  templateUrl: './ireland-info-page.component.html',
})
export class IrelandInfoPageComponent {
  private readonly route = inject(ActivatedRoute);

  readonly page$ = this.route.data.pipe(
    map((data) => irelandInfoPages[data['infoKey'] as string] ?? irelandInfoPages['experience']),
  );
}

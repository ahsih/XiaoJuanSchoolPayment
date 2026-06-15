import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

interface QuickFact {
  label: string;
  value: string;
}

interface CourseItem {
  title: string;
  lessons: string;
  text: string;
}

interface PriceRow {
  item: string;
  campus: string;
  reference: string;
  note: string;
}

interface CampusItem {
  title: string;
  tag: string;
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
  selector: 'app-jic-school',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './jic-school.component.html',
  styleUrls: ['../cia-school/cia-school.component.css', './jic-school.component.css'],
})
export class JicSchoolComponent {
  readonly quickFacts: QuickFact[] = [
    { label: '学校名称', value: 'Baguio JIC Academy' },
    { label: '城市', value: '菲律宾碧瑶 Baguio' },
    { label: '品牌历史', value: 'English Academy since 2002' },
    { label: '主要校区', value: 'Main / Challenger Campus 与 Premium Campus' },
    { label: '学习风格', value: 'Main 偏严谨备考，Premium 偏主动交流与舒适生活' },
    { label: '适合方向', value: 'ESL、IELTS、Speaking、TOEIC、Business、Working Holiday' },
  ];

  readonly campuses: CampusItem[] = [
    {
      title: 'Main / Challenger Campus',
      tag: 'IELTS / ESL / Intensive',
      text: '推荐给想在更严谨环境下准备 IELTS、强化 ESL，或需要清晰学习指引的学生。官网列出校区容量约 130 人，最低年龄 18 岁，距离市区约 10 分钟车程。',
    },
    {
      title: 'Premium Campus',
      tag: 'Speaking / Career / Active Learning',
      text: '定位为主动学习与跨文化交流校区，环境更宽敞安静，适合口语、打工度假、商务英语、TOEIC、银发族或希望兼顾远程工作的成人学生。',
    },
  ];

  readonly courses: CourseItem[] = [
    {
      title: 'IELTS Lite / Standard',
      lessons: 'Main / Challenger Campus',
      text: '面向雅思备考学生，适合需要写作批改、口说训练、模考复盘和阶段性目标管理的人。JIC FAQ 提到雅思教师具备较高资格门槛。',
    },
    {
      title: 'IB / IA ESL',
      lessons: 'Main / Challenger Campus',
      text: '适合想从听说读写基础开始系统提升的学生。Main 校区强调按学生水平给出学习内容，减少学生自己选课的困扰。',
    },
    {
      title: 'ESL Starter 7',
      lessons: '4节一对一 + 1节团体 + 2节选修',
      text: 'Premium 校区的初学者友好课程，适合零基础或基础薄弱学生先建立发音、听力、阅读、写作和开口信心。',
    },
    {
      title: 'TEP ESL 8 / 9 / 10',
      lessons: '3-5节一对一 + 3节团体 + 2节选修',
      text: '主题英语课程，围绕旅行、艺术、音乐、烹饪等主题进行沉浸式学习，适合想用更生活化方式提升表达的人。',
    },
    {
      title: 'Speaking Master 8',
      lessons: '6节一对一 + 2节选修',
      text: '高口语密度课程，包含演讲、讨论、朗读和表达训练，适合目标是明显提升流利度、逻辑表达和开口自信的学生。',
    },
    {
      title: 'TOEIC / Working Holiday / Business Master',
      lessons: 'Career 方向课程',
      text: '适合求职、打工度假、商业沟通或希望把英语用于职场场景的人。Business Master 偏商务听说读写，Working Holiday 偏面试与工作场景。',
    },
  ];

  readonly priceRows: PriceRow[] = [
    {
      item: 'Premium Campus 起价',
      campus: 'Premium',
      reference: '约 NTD 11,711 / 周起',
      note: 'Feifan 碧瑶学校列表公开参考价，按周显示，最终以学校账单为准。',
    },
    {
      item: 'Challenger Campus 起价',
      campus: 'Challenger',
      reference: '约 NTD 11,031 / 周起',
      note: 'Feifan 碧瑶学校列表公开参考价，按周显示，适合先做预算初筛。',
    },
    {
      item: '注册费',
      campus: '两个校区',
      reference: '常见为 USD 100',
      note: 'iOutback JIC 费用计算器页面显示注册费项目；当地费用另计。',
    },
    {
      item: '当地费用',
      campus: '两个校区',
      reference: 'SSP、延签、教材、水电、押金等',
      note: '公开页面说明学费住宿不含披索当地费用，实际金额按周数、房型和当期学校规则确认。',
    },
    {
      item: '2026 淡季优惠',
      campus: '两个校区',
      reference: '每4周 USD 50-150 折扣',
      note: 'Feifan 页面列出 2026 JIC 淡季优惠，单/双人房与四人房折扣不同，需核对入学日期。',
    },
    {
      item: '长周数优惠',
      campus: '两个校区',
      reference: '12-24周约 USD 300-600 折扣',
      note: '长周数优惠会随学校政策更新，适合 12 周以上学生重点核对。',
    },
  ];

  readonly accommodation = [
    'Main / Challenger 校区有 West Garden 与 East Field 宿舍方向，包含单人、双人、三人、四人或阁楼式房型。',
    'Premium 校区提供单人、双人和四人房，并区分有阳台 A 房与无阳台 B 房，房型会影响价格。',
    '官网说明住宿与校内生活环境重视清洁维护，通常提供每周洗衣与房间清洁服务。',
    '两个校区都要在报名时确认房型空位、是否可接受多人房，以及入学日是否对应可入住房间。',
  ];

  readonly facilities = [
    '学生宿舍',
    '校内餐厅',
    '咖啡馆 / Cafe',
    'Kmart 小超市',
    '健身房',
    '自习空间',
    '共享工作空间',
    '学生休息室',
    '按摩 / 桑拿等舒缓设施',
    '共用厨房',
    '24小时保安',
    '多国籍学生支持人员',
  ];

  readonly audiences = [
    '需要 IELTS 分数目标、模考复盘和更严谨学习节奏的学生',
    '想先把听说读写基础补起来，但又希望校方给清楚路线的人',
    '重视口语表达、演讲、讨论、工作沟通和面试英语的人',
    '准备打工度假、海外求职或未来进入外企工作的学生',
    '喜欢碧瑶凉爽气候，希望在安静环境长期学习 8-12 周以上的人',
    '成人、夫妻或银发族学生，想要更舒适住宿和校内设施的人',
  ];

  readonly pros = [
    '两校区定位清楚：Main / Challenger 偏备考与严谨，Premium 偏口语、职业和舒适生活。',
    '课程覆盖面广，从 IELTS、ESL 到 TOEIC、Business、Working Holiday 和 Senior ESL 都可比较。',
    'Premium 校区设施丰富，适合希望学习之外也有休息、咖啡、健身或远程工作空间的人。',
    'JIC 官方资料强调自研教材和教师培训体系，对考试与主题课程的连续性有帮助。',
    '校区都在碧瑶，适合喜欢凉爽气候、减少外部干扰、把预算更多放在课程时数上的学生。',
  ];

  readonly cons = [
    'JIC 必须按校区比较，不能只看学校名称；Main 和 Premium 的学习节奏、适合人群和住宿体验不同。',
    'Premium 距离市区仍需车程，喜欢每天自由逛市区的学生要确认交通接受度。',
    'Main / Challenger 更适合目标明确的人，若只是轻松体验，学习制度可能显得偏紧。',
    '公开价格多为参考起价或计算器，最终报价会受房型、汇率、优惠、周数和当地费用影响。',
    '旺季、单人房、特定课程和长期住宿空位变化快，需要尽早核对。',
  ];

  readonly faqs: FaqItem[] = [
    {
      question: 'Baguio JIC 的 Main / Challenger 和 Premium 怎么选？',
      answer: '目标是 IELTS、ESL 基础强化或需要更严谨节奏，优先看 Main / Challenger；目标是口语、商务、打工度假、TOEIC、舒适住宿或成人学习体验，优先看 Premium。',
    },
    {
      question: 'JIC 适合零基础学生吗？',
      answer: '可以。Premium 的 ESL Starter 7 明确面向基础薄弱或零基础学生；如果学生更需要强约束，也可以让顾问比较 Main 校区 ESL 与 Premium 初学课程。',
    },
    {
      question: '18 岁以下学生可以读 JIC 吗？',
      answer: '官网 FAQ 显示 UPC 青少年项目可接受 15-17 岁学生，但会有额外规则，例如活动、外出、自习和手机使用限制；普通课程年龄限制仍需按校区确认。',
    },
    {
      question: '页面价格包含所有费用吗？',
      answer: '不包含。起价通常只适合做学费住宿初筛，报名还要核对注册费、SSP、签证延签、ACR I-Card、教材、水电、押金、接机、机票和个人生活费。',
    },
    {
      question: '顾问会怎么建议 JIC？',
      answer: '先问目标：分数、口语、商务、打工度假还是长期生活舒适度；再按校区、课程强度、房型和总预算筛选。JIC 最适合目标明确后做校区匹配。',
    },
  ];

  readonly sources: SourceLink[] = [
    { label: 'Baguio JIC 官方网站', url: 'https://baguio-jic.com/zh-hant/' },
    { label: 'Baguio JIC 关于 JIC', url: 'https://baguio-jic.com/zh-hant/about/' },
    { label: 'Baguio JIC Main Campus', url: 'https://baguio-jic.com/zh-hant/main-campus/' },
    { label: 'Baguio JIC Premium Campus', url: 'https://baguio-jic.com/zh-hant/premium-campus/' },
    { label: 'Baguio JIC FAQ', url: 'https://baguio-jic.com/zh-hant/faq/' },
    { label: 'iOutback - JIC Premium', url: 'https://www.ioutback.com/study-abroad/philippines/SCHOOL/jic_premium_detail' },
    { label: 'iOutback - JIC Challenger', url: 'https://www.ioutback.com/study-abroad/philippines/SCHOOL/jic_detail' },
    { label: 'Feifan - JIC Premium Campus', url: 'https://feifanstudy.com/schools/18-jic-premium--campus' },
    { label: 'Feifan - JIC Challenger Campus', url: 'https://feifanstudy.com/schools/62-jic-challenger-campus' },
    { label: 'Nanqi 菲律宾游学学校目录', url: 'https://www.nanqi.org/' },
  ];
}

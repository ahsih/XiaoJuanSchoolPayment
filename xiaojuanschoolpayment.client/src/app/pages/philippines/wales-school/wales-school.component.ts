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
  reference: string;
  quoteCheck: string;
  note: string;
  basis: string;
}

interface LocalFee {
  item: string;
  amount: string;
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
  selector: 'app-wales-school',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './wales-school.component.html',
  styleUrls: ['../school-detail-layout.css', './wales-school.component.css'],
})
export class WalesSchoolComponent {
  readonly quickFacts: QuickFact[] = [
    { label: '学校名称', value: 'WALES Academy / Widest Asian Learners English School Inc.' },
    { label: '城市', value: '菲律宾碧瑶 Baguio' },
    { label: '创校时间', value: '2006年' },
    { label: '地址', value: '#4 Bukaneg St., Legarda Rd., Baguio City' },
    { label: '学校容量', value: '官方资料约80名学生' },
    { label: '适合方向', value: 'EEP、ESL、Business、IELTS、Junior、Family' },
  ];

  readonly courses: CourseItem[] = [
    {
      title: 'EEP 1 / EEP 2',
      lessons: 'EEP 1：3节课 / 天；EEP 2：5节课 / 天',
      text: 'English Enhancement Program偏生活沟通、听说能力和真实场景英文，适合旅行者、工作者、打工度假、家长或想轻量学习的人。',
    },
    {
      title: 'ESL / ESL Lite',
      lessons: 'ESL一般7-8节课 / 天；Lite按技能聚焦',
      text: 'ESL是WALES的基础课程方向，覆盖听说读写和发音；ESL Lite适合想保留更多复习或生活时间的学生。',
    },
    {
      title: 'Business English',
      lessons: '官方列为7节课 / 天',
      text: '面向多文化商务场景，训练商务写作、商务阅读、词汇、语气和跨文化沟通，官方标注入门基础约Elementary B。',
    },
    {
      title: 'IELTS',
      lessons: 'Academic / General Training方向',
      text: '适合升学、工作、移民或专业注册需求。WALES官网说明雅思分Academic和General Training，报名时要先确认目标模块。',
    },
    {
      title: 'Junior ESL',
      lessons: '8节课 / 天',
      text: '面向青少年学术英语发展，包含听力、语法、发音、一对一口说、写作、阅读和词汇等模块。',
    },
    {
      title: 'Family Program',
      lessons: '家长与孩子按1:1或团体课安排',
      text: '适合亲子一起学习英语并体验菲律宾文化和自然环境，周末活动与家庭房型需要按当期安排确认。',
    },
  ];

  readonly priceRows: PriceRow[] = [
    {
      item: '报名 / Enrollment fee',
      reference: '官方流程要求先支付报名相关费用',
      quoteCheck: '确认金额、退改规则与锁房条件',
      note: 'WALES流程说明：提交课程、房型、日程后，支付enrollment fee以确保注册和房间。',
      basis: '官方Admissions',
    },
    {
      item: '课程学费',
      reference: 'EEP、ESL、Business、IELTS、Junior、Family分开报价',
      quoteCheck: '确认课时、课程版本、周数和淡旺季优惠',
      note: '官网课程页列出每日课时和课程方向，但正式金额需以当期price list或学校回信为准。',
      basis: '官方Program',
    },
    {
      item: '宿舍费',
      reference: 'Studio、Premium Studio、Share、Condo等房型',
      quoteCheck: '确认单人、双人、Semi Single、上下层与空位',
      note: '官网提醒房间空位会变动，建议尽早询问；不同房型设备和Wi-Fi速度也不同。',
      basis: '官方Room',
    },
    {
      item: '餐费',
      reference: '官方流程列为需支付项目',
      quoteCheck: '确认是否含三餐、餐费周期和特殊饮食',
      note: '报名报价不能只看学费住宿，WALES官方流程明确提到tuition、dormitory和meal fee。',
      basis: '官方Admissions',
    },
    {
      item: '当地费用',
      reference: 'SSP、签证延签、ACR、教材、押金、水电等',
      quoteCheck: '按周数和签证状态核算',
      note: '这些项目通常不应并入“低起价”判断，适合在报价单中单独列行。',
      basis: '顾问核价',
    },
    {
      item: '机场接送',
      reference: '出发前至少10天提供航班信息',
      quoteCheck: '确认马尼拉或克拉克、团体或个人接送',
      note: '官网流程要求学生至少出发前10天告知航班日程，便于安排抵达和接机。',
      basis: '官方Admissions',
    },
    {
      item: '房型加价',
      reference: '双人共享同床等特殊使用需确认额外费用',
      quoteCheck: '确认朋友、情侣、家庭是否可同住',
      note: '官网Room页提到家人、朋友、伴侣等共享床位情形可能可加价使用双人房。',
      basis: '官方Room',
    },
  ];

  readonly localFees: LocalFee[] = [
    { item: 'SSP特别学习许可', amount: '按学习周数和学校当期标准确认' },
    { item: '签证延签', amount: '长期学习需按菲律宾移民规则计算' },
    { item: 'ACR I-Card', amount: '按停留周期和签证状态确认' },
    { item: '教材费', amount: '按课程教材实际购买计算' },
    { item: '押金 / 水电', amount: '按学校当期宿舍规则结算' },
    { item: '餐费', amount: '确认是否含餐、餐数和特殊饮食安排' },
    { item: '机场接送', amount: '按机场、团体/个人接送和日期确认' },
    { item: '房型差价', amount: 'Studio、Premium、Share、Condo差异需逐项报价' },
  ];

  readonly accommodation = [
    'WALES官方Room页列出Studio、Premium Studio、Share和Condo等房型，适合按生活习惯和预算细分。',
    'Studio为单人方向，配备冰箱、电热水壶、微波炉、吹风机、Bidet和60Mbps Wi-Fi。',
    'Premium Studio可单人或双人共享，增加电磁炉、LED TV with Netflix等设备。',
    'Share Type有带窗单人、单人或双人共享方向，常见设备包含冰箱、微波炉、瓦斯炉和LED TV。',
    'Condo Type偏Semi Single，官方列出300Mbps Wi-Fi、Gas range和电视等设备，适合更重视生活机能的人。',
  ];

  readonly facilities = [
    '一对一教室',
    '团体课教室',
    'Business Center & Lounge',
    'Cafeteria',
    'Student Lounge & Reception',
    '校内宿舍',
    '周边餐厅与咖啡店',
    '周边ATM与银行',
    '便利购物与Public Market',
    'Burnham Park生活半径',
    '市区健身房与生活设施',
    '多语种学生支持与小校氛围',
  ];

  readonly audiences = [
    '希望在碧瑶市中心附近生活，重视餐厅、咖啡店、ATM和商场便利的成人学生',
    '不想进入大型学校，偏好小型、老师和工作人员更容易认识学生的学习环境',
    '想学生活口语、工作英文、打工度假英文或轻量英文课程的人',
    '年龄层较成熟、希望学习节奏更弹性、社交压力较低的学生',
    '亲子、青少年或家庭学生，但需要提前核对房型、监护和活动安排',
  ];

  readonly pros = [
    '小型学校容量约80人，官方强调老师和工作人员能更聚焦每位学生需求',
    'Legarda Rd.位置便利，官网列出餐厅、咖啡店、超市、ATM、健身房等多项资源步行可达',
    '房型选择比传统宿舍更生活化，Studio、Premium Studio、Share、Condo可按隐私和预算比较',
    '课程覆盖生活口语、ESL、商务、IELTS、Junior和Family，适合成人与家庭需求',
    '学生年龄和国籍较多样，官网提到6个国籍、14-70岁年龄层，氛围不只面向年轻学生',
  ];

  readonly cons = [
    'WALES不是典型强斯巴达学校，自律弱、需要高压制度推动的人要谨慎比较',
    '小型学校意味着容量有限，热门房型或指定入学日需要更早确认空位',
    '市区生活便利也代表外部诱惑更多，学生要能管理外出和复习节奏',
    '官网公开页没有完整当前价目表，报价必须按课程、房型、餐费和当地费用重新核算',
    '亲子和Junior需求要额外确认年龄、监护、活动、房型和周末安排，不宜只看课程名报名',
  ];

  readonly faqs: FaqItem[] = [
    {
      question: 'WALES适合想要强管理的学生吗？',
      answer: '不算最优先。WALES更偏小型、弹性、市区生活便利和成人友好。如果学生需要严格门禁、自习和高压推动，应同时比较PINES、JIC Challenger或BECI Sparta。',
    },
    {
      question: 'WALES最突出的优势是什么？',
      answer: '小校容量、市区位置和房型生活感。官方强调80人左右容量、5分钟生活半径、Studio/Share/Condo等房型，适合重视舒适度和便利性的学生。',
    },
    {
      question: 'WALES适合零基础吗？',
      answer: '可以先看EEP或ESL方向。EEP更偏听说和真实生活场景，ESL则是进一步学习Business、IELTS等课程前的基础。',
    },
    {
      question: '页面为什么没有写固定起价？',
      answer: 'WALES官网公开页提供课程、房型和流程信息，但当前价目需要从学校或授权顾问确认。为避免误导，本页用报价项目清单帮助核算总成本。',
    },
    {
      question: '顾问会怎么建议WALES？',
      answer: '如果学生是成人、工作者、家庭或想在市中心附近轻松但认真地学英文，WALES值得比较；如果目标是短期高压冲刺分数，则建议同时看更强管理的碧瑶学校。',
    },
  ];

  readonly sources: SourceLink[] = [
    { label: 'WALES官方网站', url: 'https://walesph.com/' },
    { label: 'WALES School Profile', url: 'https://walesph.com/aboutus/school-profile/' },
    { label: 'WALES Why WALES', url: 'https://walesph.com/aboutus/choose/' },
    { label: 'WALES Program', url: 'https://walesph.com/curriculum/' },
    { label: 'WALES EEP', url: 'https://walesph.com/curriculum/eep/' },
    { label: 'WALES ESL', url: 'https://walesph.com/curriculum/esl/' },
    { label: 'WALES Business', url: 'https://walesph.com/curriculum/business/' },
    { label: 'WALES IELTS', url: 'https://walesph.com/curriculum/ielts/' },
    { label: 'WALES Room', url: 'https://walesph.com/room/' },
    { label: 'WALES Facility', url: 'https://walesph.com/facility/' },
    { label: 'WALES Location', url: 'https://walesph.com/facility/location/' },
    { label: 'WALES Admissions', url: 'https://walesph.com/admissions/process/' },
  ];
}

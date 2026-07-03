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
  estimate: string;
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
  selector: 'app-monol-school',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './monol-school.component.html',
  styleUrls: ['../school-detail-layout.css', './monol-school.component.css'],
})
export class MonolSchoolComponent {
  readonly quickFacts: QuickFact[] = [
    { label: '学校名称', value: 'MONOL / Models of Nonpareil and Outstanding Learning' },
    { label: '城市', value: '菲律宾碧瑶 Baguio' },
    { label: '创校时间', value: '2003年' },
    { label: '地址', value: '20-B Purok 9, Tacay Road, Pinsao Proper' },
    { label: '学校类型', value: '半斯巴达、弹性自律、住宿生活配套型' },
    { label: '适合方向', value: 'General ESL、IELTS、LEAP客制化英文、长期学习' },
  ];

  readonly courses: CourseItem[] = [
    {
      title: 'General ESL',
      lessons: '5节一对一 + 4节团体课 / 天',
      text: '官方课程强调螺旋式复习和沟通法，覆盖听说读写、语法和发音，适合想系统补基础并保持足够一对一密度的学生。',
    },
    {
      title: 'Flexible ESL / Light ESL',
      lessons: '4节左右一对一 + 可选团体课',
      text: '适合不想每天被课表塞满，或希望把复习、运动、生活适应一起放进日程的成人学生和长期学习者。',
    },
    {
      title: 'IELTS',
      lessons: '5节一对一 + 4节团体课 / 天',
      text: '面向升学、就业或移民方向的雅思学生，官方建议中级以上基础；公开资料提到定期模考和考试科目训练。',
    },
    {
      title: 'LEAP English',
      lessons: '客制化课程 + 学习监测 + 阶段评估',
      text: 'LEAP强调学习者画像、课程客制和进度追踪，可把General ESL、IELTS、TOEIC、Business等方向组合起来。',
    },
    {
      title: 'Business / TOEIC / Cabin Crew',
      lessons: '以LEAP或客制课程方式安排',
      text: '适合已有明确职业场景的人，例如职场沟通、面试、多益、商务英文或航空服务英文，需在报价前确认当期开课与老师配置。',
    },
    {
      title: 'Fitness / Golf / Senior / Family',
      lessons: '课程之外的生活与休闲配套',
      text: 'MONOL的强项不只在课表，也在住宿、健身、桑拿、高尔夫练习区和家庭/银发族友好房型，适合把学习和生活舒适度一起评估。',
    },
  ];

  readonly priceRows: PriceRow[] = [
    {
      item: '注册费',
      reference: 'USD 100',
      estimate: '报名确认时支付',
      note: '官方Admission页面列出的一次性费用。',
      basis: '官方',
    },
    {
      item: 'General ESL学费',
      reference: 'USD 900 / 4周',
      estimate: '加房型后约USD 1,200起 / 4周',
      note: '若搭配Capsule Six Room，公开价可做最低预算初筛；实际以房型空位为准。',
      basis: '官方',
    },
    {
      item: 'IELTS学费',
      reference: 'USD 900 + USD 100学术管理费 / 4周',
      estimate: '加房型后约USD 1,300起 / 4周',
      note: '适合已有基础和分数目标者，需确认入学测验与模考安排。',
      basis: '官方',
    },
    {
      item: 'LEAP English学费',
      reference: 'USD 900 + USD 250学术管理费 / 4周',
      estimate: '加房型后约USD 1,450起 / 4周',
      note: '客制化程度较高，报价前要先确认学习目标和科目组合。',
      basis: '官方',
    },
    {
      item: '宿舍房型',
      reference: 'USD 300-1,100 / 4周',
      estimate: '六人胶囊房至Premium Single',
      note: '官方列出Capsule Six、Triple、Semi-Single、Deluxe、Single、Premium Single等房型。',
      basis: '官方',
    },
    {
      item: '2026套装参考',
      reference: '约USD 1,540-1,850 / 4周',
      estimate: '按课程与房型组合变化',
      note: 'iOutback公开页展示General English、IELTS、Customized English不同房型套装价，可做市场比价。',
      basis: 'iOutback',
    },
    {
      item: '餐食与生活费',
      reference: '餐食另计',
      estimate: '按学生实际选择预算',
      note: 'MONOL的餐食模式较弹性，可用学校餐盒、咖啡厅、外送或厨房，但总预算要额外估算。',
      basis: '官方 / iOutback',
    },
  ];

  readonly localFees: LocalFee[] = [
    { item: 'SSP特别学习许可', amount: '官方参考PHP 7,800' },
    { item: 'SSP ACR I-Card', amount: '官方参考PHP 4,500' },
    { item: 'TVV ACR I-Card', amount: '官方参考PHP 3,500，依周数和签证状况确认' },
    { item: '保证金', amount: 'USD 100或PHP 4,000，按学校规则退还' },
    { item: '马尼拉团体接机', amount: '官方参考PHP 3,000' },
    { item: '克拉克团体接机', amount: '官方参考PHP 2,500' },
    { item: '签证延签', amount: '按4周以上学习周数递增，需以当期移民局规则确认' },
    { item: '教材 / 洗衣 / 个人消费', amount: '依课程教材、生活习惯和房型实际计算' },
  ];

  readonly accommodation = [
    '官方资料显示，MONOL与Misty Hills Hotel合作提供住宿管理，强调24小时接待、每日房务、毛巾床品和清洁服务。',
    '公开房型包括Premium Single、Single、Semi-Single、Deluxe、Triple和Capsule Six；Deluxe带厨房，更适合家庭或想自理餐食的人。',
    '房间设备常见包含冰箱、微波炉、电热水壶、除湿机、保险箱、书桌、衣柜和干湿分离卫浴，细节需按实际房型核对。',
    '餐食不强制打包在学费住宿内，适合想控制饮食、素食或长期学习的人，但也代表学生需要自己规划餐费和日常采购。',
  ];

  readonly facilities = [
    '校内教室与一对一教室',
    'Misty Hills Hotel住宿管理',
    '屋顶健身房',
    '桑拿',
    '高尔夫练习区',
    'Aqua Garden Cafe',
    '共享厨房',
    '自助洗衣',
    '学生休息区',
    '便利店 / 小卖部',
    '自习空间',
    '篮球、台球、乒乓球等休闲设施',
  ];

  readonly audiences = [
    '想在碧瑶安静环境长期学习8周以上，同时重视住宿舒适度的成人学生',
    '需要ESL或IELTS，但不想进入过度高压斯巴达制度的人',
    '喜欢有健身、桑拿、高尔夫、咖啡厅和厨房等生活配套的人',
    '希望餐食安排更弹性，或有素食、饮食控制、家庭住宿需求的学生',
    '银发族、短期职业人士、家庭学生，或想把英语学习和生活品质一起考虑的人',
  ];

  readonly pros = [
    '创校时间长，官方资料显示自2003年起运营，是碧瑶较有历史的语言学校之一',
    '课程选择不复杂，General ESL、IELTS和LEAP三条线便于按目标筛选',
    '住宿舒适度和生活设施是明显卖点，适合不想牺牲居住品质的成人或长期学生',
    '餐食弹性高，学生可以用学校餐盒、外送、咖啡厅或共享厨房控制预算和饮食',
    '半斯巴达属性比全斯巴达更有弹性，适合自律尚可、但仍想要学习环境的人',
  ];

  readonly cons = [
    '如果学生需要强制自习、严格门禁和高压推动，MONOL可能不如典型斯巴达学校直接',
    '餐食另计虽然弹性高，但总预算更容易被低估，报名时要把餐费和生活费单独列出',
    '位置在Pinsao Proper，日常外出和市区交通要提前确认接受度',
    '公开价格有官方拆分价和代理套装价两种看法，必须按课程、房型、周数重新核总价',
    'IELTS和LEAP更需要先确认英文程度、目标分数、老师配置和当期开课状态',
  ];

  readonly faqs: FaqItem[] = [
    {
      question: 'MONOL是斯巴达学校吗？',
      answer: '更适合归类为半斯巴达或自律弹性型。公开资料强调一对一密度、可选团体课和学习支持，但不是只靠高压制度推动的学校。',
    },
    {
      question: 'MONOL适合零基础学生吗？',
      answer: '可以优先看General ESL或Light ESL方向。若目标是IELTS，建议先确认入学测验、基础程度和是否需要先补ESL。',
    },
    {
      question: '费用为什么看起来有不同版本？',
      answer: '官方页面把课程费、房费和当地费用拆开列；代理页面常用课程+房型套装价展示。实际报价要把注册费、学费、房费、当地费、餐费和接机一起核算。',
    },
    {
      question: 'MONOL住宿是不是它的主要优势？',
      answer: '是。公开资料反复强调Hotel-style住宿、房务、房内设备、健身房、桑拿、厨房和咖啡厅，适合重视长期生活稳定度的人。',
    },
    {
      question: '顾问会怎么建议MONOL？',
      answer: '如果学生目标是稳定提升英文、想住得舒服、能自己管理学习节奏，MONOL值得优先比较；如果自律弱或只靠制度推动，建议同时比较PINES、JIC或BECI Sparta。',
    },
  ];

  readonly sources: SourceLink[] = [
    { label: 'MONOL官方网站', url: 'https://mymonol.com/en/' },
    { label: 'MONOL About', url: 'https://mymonol.com/en/about-monol/' },
    { label: 'MONOL Why MONOL', url: 'https://mymonol.com/en/why-monol-2/' },
    { label: 'MONOL Program', url: 'https://mymonol.com/en/program/' },
    { label: 'MONOL Facility', url: 'https://mymonol.com/en/facility/' },
    { label: 'MONOL Admission', url: 'https://mymonol.com/en/admission-2/' },
    { label: 'iOutback - MONOL', url: 'https://www.ioutback.com/study-abroad/philippines/SCHOOL/monol_detail' },
    { label: 'Feifan - MONOL', url: 'https://feifanstudy.com/schools/30-monol' },
    { label: 'Feifan - 碧瑶学校列表', url: 'https://feifanstudy.com/city/%E7%A2%A7%E7%91%A4' },
    { label: 'Nanqi - MONOL', url: 'https://www.nanqi.org/school/monol.html' },
  ];
}

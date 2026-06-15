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
  amount: string;
  note: string;
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
  selector: 'app-american-english-school',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './american-english-school.component.html',
  styleUrl: '../cia-school/cia-school.component.css',
})
export class AmericanEnglishSchoolComponent {
  readonly quickFacts: QuickFact[] = [
    { label: '学校名称', value: 'American English Skills Development Center' },
    { label: '城市', value: 'Makati / Metro Manila' },
    { label: '学校定位', value: '成人英语、商务沟通、一对一、团体课与企业培训中心' },
    { label: '上课形式', value: 'Online、Face to Face、One-on-One、Group、Corporate' },
    { label: '住宿', value: '非寄宿制，住宿与通勤需另行安排' },
    { label: '参考费用', value: '公开课程页可见约₱24,000-₱98,000区间，最终需按课程核价' },
  ];

  readonly courses: CourseItem[] = [
    {
      title: 'Conversational English',
      lessons: '成人口语、日常沟通与自信表达',
      text: '适合想补强日常对话、小谈话、旅行、生活和跨文化沟通的成人学生。',
    },
    {
      title: 'Business English',
      lessons: '职场沟通、会议表达与商务场景英语',
      text: '适合上班族、管理者、求职者和需要客户沟通、展示、邮件或商务表达的人。',
    },
    {
      title: 'Group English Class',
      lessons: '官网列出40小时课程，2小时/次，周一至周五',
      text: '适合想用固定节奏训练口语、语法、词汇和沟通策略的学生，具体开课日需确认。',
    },
    {
      title: 'One-on-One Customized Training',
      lessons: '按个人目标定制，线上或面对面',
      text: '适合目标明确、时间不固定或希望针对面试、发音、商务写作、演讲等需求集中训练的人。',
    },
    {
      title: 'IELTS Preparation',
      lessons: '雅思方向与考试英语补强',
      text: '适合需要考试英语基础和表达训练的学生，但若目标是长期高压冲分，也应比较碧瑶或宿务考试型学校。',
    },
    {
      title: 'Corporate Training',
      lessons: '企业英语、领导力沟通、客服、商务写作与跨文化培训',
      text: '适合公司团队和企业派训，通常需要先做需求分析，再按人数、时长和目标报价。',
    },
  ];

  readonly priceRows: PriceRow[] = [
    {
      item: 'One-on-One / 专项课程',
      amount: '约₱24,000-₱98,000',
      note: '官网课程页可见多个项目在此区间；最终按课程、课时、线上/面授和排课确认。',
    },
    {
      item: 'Group English Class',
      amount: '需当期确认',
      note: '官网说明为40小时、2小时/次，价格和开班日期需以报名页或学校回函为准。',
    },
    {
      item: 'Corporate Training',
      amount: '报价制 / 需核价',
      note: '企业课程通常先做Training Needs Analysis，再按人数、模块、时长和交付方式报价。',
    },
    {
      item: '优惠 / 折扣码',
      amount: '需当期确认',
      note: '官网可能出现限时优惠，报名时需确认优惠是否仍有效，不能按旧活动自动计算。',
    },
  ];

  readonly localFees: LocalFee[] = [
    { item: '课程费', amount: '按课程、课时、班型和排课方式确认' },
    { item: '测评 / 需求分析', amount: '部分课程会先做英语水平或培训需求评估' },
    { item: '教材 / 资料', amount: '按实际课程材料确认' },
    { item: '住宿', amount: '酒店、公寓或亲友住宿另行安排' },
    { item: '通勤交通', amount: '按Makati上课点或线上课程安排核算' },
    { item: '签证 / 保险', amount: '国际学生按停留时间与行程另行规划' },
  ];

  readonly facilities = [
    '线上与面对面课程选择',
    '一对一、团体课和企业培训三种主要学习形式',
    '成人口语、商务英语、IELTS、商务写作、发音和演讲方向',
    '企业培训可围绕需求分析、课程设计、交付和课后评估安排',
    'Makati / Metro Manila城市学习环境，适合短住、出差和职场组合',
    '非寄宿制培训中心，住宿、餐食、接送和门禁管理不包含在课程内',
  ];

  readonly audiences = [
    '已经在马尼拉或计划短住马尼拉的成人学生',
    '需要职场英语、商务写作、客户沟通、演讲或面试训练的人',
    '想用线上或面对面方式安排一对一课程的人',
    '企业团队、HR培训负责人或需要公司内训的客户',
    '不需要宿舍制管理，能自行安排住宿和通勤的人',
  ];

  readonly pros = [
    '课程形式灵活，可选线上、面授、一对一、团体或企业培训',
    '官网强调真实沟通、职场表达和成人学习场景，适合商务目标',
    'Makati位置适合与商务行程、短住或城市生活体验结合',
    '公开页面能看到部分课程价位区间，预算初筛比完全无价学校更清晰',
  ];

  readonly cons = [
    '不是传统宿舍制ESL学校，不提供校内住宿、三餐和全天管理',
    '不同课程、课时和班型价差较大，不能只看起价决定',
    '团体课开课日期、人数和优惠会变化，必须当期确认',
    '若目标是雅思高压冲刺或长期封闭学习，应同步比较碧瑶、宿务或Clark学校',
  ];

  readonly faqs: FaqItem[] = [
    {
      question: 'American English适合传统菲律宾游学吗？',
      answer:
        '如果你想要宿舍、三餐、门禁和全天课程，它不是最典型选择。它更适合马尼拉城市短课、成人口语、商务英语、一对一和企业培训。',
    },
    {
      question: '费用可以直接按₱24,000起计算吗？',
      answer:
        '只能作为初筛参考。官网课程页可见部分项目约₱24,000-₱98,000，但最终要按课程类型、课时、线上/面授、是否一对一和当期优惠重新核价。',
    },
    {
      question: '它适合IELTS备考吗？',
      answer:
        '可以作为IELTS表达、基础英语和一对一补强候选；如果目标是高强度刷题、模考和分数管理，建议同时比较碧瑶或宿务考试型学校。',
    },
    {
      question: '住宿怎么安排？',
      answer:
        '住宿通常需要学生自行安排酒店、公寓或亲友住宿。顾问会把住宿点、通勤时间、课程时间和预算放在一起核算。',
    },
  ];

  readonly sources: SourceLink[] = [
    { label: 'American English 官方网站', url: 'https://americanenglish.ph/' },
    { label: 'American English Group Class', url: 'https://americanenglish.ph/english-class/' },
    { label: 'American English One-on-One Training', url: 'https://americanenglish.ph/private-and-personalize-english-training/' },
    { label: 'American English Corporate Training', url: 'https://americanenglish.ph/corporate-training/' },
    {
      label: 'One-on-One Business English课程页',
      url: 'https://americanenglish.ph/program/one-on-one/one-on-one-business-english-and-communication-skills/',
    },
  ];
}

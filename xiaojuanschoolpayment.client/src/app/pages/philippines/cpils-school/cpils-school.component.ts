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
  course: string;
  quad: string;
  triple: string;
  twin: string;
  single: string;
}

interface LocalFee {
  item: string;
  amount: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-cpils-school',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './cpils-school.component.html',
  styleUrl: '../cia-school/cia-school.component.css',
})
export class CpilsSchoolComponent {
  readonly quickFacts: QuickFact[] = [
    { label: '学校名称', value: '菲律宾宿务CPILS语言学校' },
    { label: '学校类型', value: '斯巴达 / 半斯巴达，考试与强化型老牌学校' },
    { label: '位置', value: 'Cebu City 旧城区，近 SM、Ayala 与 Robinson Galleria' },
    { label: '学生容量', value: '约350-400名学生' },
    { label: '最低年龄', value: '8岁起；14岁以下未陪同需确认监护安排' },
    { label: '考试资源', value: 'British Council IELTS 考场、ETS TOEIC 考场' },
  ];

  readonly courses: CourseItem[] = [
    {
      title: 'General ESL / Plus / Light',
      lessons: 'General为3堂1:1 + 2堂1:4 + 2堂1:12；Plus为4堂1:1 + 2堂1:4 + 1堂1:12；Light为4节1:1 + 1节团体课',
      text: 'General ESL Light仅限淡季入学；其余适合基础到进阶综合提升。',
    },
    {
      title: 'Premier Sparta',
      lessons: '5堂1:1 + 2堂1:4 + 2堂1:12 + 2堂强制自修 + 选修课',
      text: '适合想用更高纪律和更长学习时间推进听说读写的学生，周一至周四会有更明确的自习和管理安排。',
    },
    {
      title: 'IELTS / IELTS Guarantee',
      lessons: '雅思口说、写作、阅读、听力、词汇文法与定期模拟考',
      text: '适合有英联邦升学、移民或分数目标的学生。保证班通常要求12周以上、指定入学日、出席率和校规达标。',
    },
    {
      title: 'TOEIC / TOEIC Guarantee / TOEFL',
      lessons: '多益听力阅读、托福四科、考试技巧与定期模考',
      text: '适合求职、毕业门槛、留学申请或分数冲刺学生。CPILS 的 TOEIC 与 IELTS 考试资源是主要卖点。',
    },
    {
      title: 'Business / PMC Speaking',
      lessons: '口语强化、简报、媒体英文、商务会议、谈判与书信',
      text: '适合想强化职场表达、面试、会议简报和听说流利度的成人或职场学生。',
    },
  ];

  readonly priceRows: PriceRow[] = [
    { course: 'General ESL / General ESL Plus', quad: 'USD 1,635', triple: 'USD 1,710', twin: 'USD 1,775', single: 'USD 1,930' },
    { course: 'General ESL Light', quad: 'USD 1,300', triple: 'USD 1,375', twin: 'USD 1,440', single: 'USD 1,595' },
    { course: 'Premier Sparta / Business / TOEIC / TOEFL / PMC', quad: 'USD 1,740', triple: 'USD 1,815', twin: 'USD 1,880', single: 'USD 2,035' },
    { course: 'TOEIC Guarantee', quad: 'USD 1,832', triple: 'USD 1,907', twin: 'USD 1,972', single: 'USD 2,127' },
    { course: 'Pre-IELTS / IELTS', quad: 'USD 1,797', triple: 'USD 1,872', twin: 'USD 1,937', single: 'USD 2,092' },
    { course: 'IELTS Guarantee 8 Weeks（4周费率）', quad: 'USD 1,947.5', triple: 'USD 2,022.5', twin: 'USD 2,087.5', single: 'USD 2,242.5' },
    { course: 'IELTS Guarantee 12 Weeks（4周费率）', quad: 'USD 1,889.7', triple: 'USD 1,964.7', twin: 'USD 2,029.7', single: 'USD 2,184.7' },
  ];

  readonly localFees: LocalFee[] = [
    { item: '注册费', amount: 'USD 125' },
    { item: 'SSP / SSP I-CARD', amount: 'PHP 7,800 + PHP 4,000（一次）' },
    { item: '管理费 / 水费 / 电费', amount: '每2周 PHP 2,000 + 800 + 2,000；电费按实际用量结算' },
    { item: '书本教材费 / 学生证', amount: '每4周预估 PHP 2,500 + 一次性 PHP 100' },
    { item: '签证续签 / ACR I-CARD', amount: '5–8周首次续签 PHP 5,130；ACR I-CARD PHP 4,000' },
    { item: '宿舍押金 / 机场接机', amount: 'PHP 2,000（可退）/ PHP 1,000（可选）' },
    { item: '4周学杂费预估', amount: 'PHP 24,000（不含接机和可退押金）' },
  ];

  readonly facilities = [
    '校内宿舍',
    '无线网络',
    '学生餐厅',
    '台湾 / 华语经理支持',
    '外籍教师课程',
    '医护室与每周医生问诊安排',
    '自修教室与视听室',
    '付费健身房、泳池、贩卖部',
    'TOEIC 与 IELTS 考试资源',
    '周房间清扫、床单更换与洗衣服务',
  ];

  readonly audiences = [
    '希望在宿务选择老牌学校，重视稳定师资和成熟管理的学生',
    '有 IELTS、TOEIC、TOEFL 分数目标，想要定期模考和清楚学习节奏的人',
    '可以接受斯巴达或半斯巴达纪律，希望短期集中提高听说读写的学生',
    '想加强商务简报、会议表达、面试或口语输出的成人学生',
    '想住在市区生活机能较方便区域，同时把学习和住宿集中在校内的人',
  ];

  readonly pros = [
    '宿务历史很久的语言学校之一，课程和管理体系成熟',
    'IELTS 与 TOEIC 考试资源突出，适合考试导向学生',
    '课程选择完整，ESL、斯巴达、考试、商务和口语强化都能覆盖',
    '市区生活机能相对方便，资料显示离主要购物中心车程约10分钟',
    '健身房、泳池、医护室、自修室等基本生活学习设施完整',
  ];

  readonly cons = [
    '设施卖点不如新型度假村学校，选择前要看自己更重视学习还是住宿质感',
    '斯巴达与保证班规则较严格，不适合只想轻松体验宿务生活的学生',
    '公开报价为原价参考，季节、优惠、周数和房型会影响最终价格',
    '热门考试课程和单人房需要尽早确认空位',
  ];

  readonly faqs: FaqItem[] = [
    {
      question: 'CPILS 适合第一次去菲律宾游学吗？',
      answer: '适合目标清楚、能接受管理制度的学生。如果第一次游学但希望有人督促学习，CPILS 会比自由型学校更有节奏；如果更看重度假感，可以同时比较 CIA、CPI 或 EV。',
    },
    {
      question: 'CPILS 的起价是多少？',
      answer: '2026原价表中，General ESL四人房4周课程费与住宿费合计USD1,635，另收USD125注册费。当符合思达9折与淡季95折时，页面报价为USD1,522.9。',
    },
    {
      question: 'CPILS 的 IELTS / TOEIC 优势是什么？',
      answer: '资料显示 CPILS 与 IELTS、TOEIC 考试资源关联强，提供定期模拟考和保证班规则，适合有明确考试分数目标的学生。',
    },
    {
      question: 'CPILS 住宿有哪些房型？',
      answer: '公开资料列出单人、双人、三人和四人房，均为套房型式，配有独立卫浴、个人桌椅、柜子、电视和镜子。',
    },
  ];
}

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
    { label: '学校全名', value: 'Cebu Pacific International Language School' },
    { label: '学校类型', value: '斯巴达 / 半斯巴达，考试与强化型老牌学校' },
    { label: '位置', value: 'Cebu City 旧城区，近 SM、Ayala 与 Robinson Galleria' },
    { label: '学生容量', value: '约350-400名学生' },
    { label: '最低年龄', value: '8岁起；14岁以下未陪同需确认监护安排' },
    { label: '考试资源', value: 'British Council IELTS 考场、ETS TOEIC 考场' },
  ];

  readonly courses: CourseItem[] = [
    {
      title: 'General ESL / Intensive ESL',
      lessons: '一般英文 3节一对一 + 2节1:4 + 2节1:8；强化英文增加一对一比例',
      text: '适合初学到中级学生，先打稳生活英语、发音、阅读、词汇和听力基础，也可参加定期 TOEIC 模考。',
    },
    {
      title: 'Premier Sparta',
      lessons: '5节一对一 + 2节1:4 + 2节1:8 + 强制课程 + 晚自习',
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
    { course: 'General ESL / Intensive ESL', quad: 'USD 1,590', triple: 'USD 1,665', twin: 'USD 1,730', single: 'USD 1,885' },
    { course: 'Premier Sparta / Business / TOEIC / TOEFL', quad: 'USD 1,690', triple: 'USD 1,765', twin: 'USD 1,830', single: 'USD 1,985' },
    { course: 'IELTS', quad: 'USD 1,745', triple: 'USD 1,820', twin: 'USD 1,885', single: 'USD 2,040' },
    { course: 'TOEIC Guarantee 12周', quad: 'USD 3,934', triple: 'USD 4,009', twin: 'USD 4,074', single: 'USD 4,229' },
    { course: 'IELTS Guarantee 12周', quad: 'USD 4,099', triple: 'USD 4,174', twin: 'USD 4,239', single: 'USD 4,394' },
  ];

  readonly localFees: LocalFee[] = [
    { item: '注册费', amount: 'USD 125' },
    { item: 'SSP学习许可', amount: '当地披索缴费，按学校当期标准确认' },
    { item: '宿舍押金', amount: '当地缴纳，退房结算' },
    { item: '水电费', amount: '公开资料示例为每周预收 PHP 500，4周 PHP 2,000，多退少补' },
    { item: '教材费 / 管理费', amount: '按课程与实际使用教材计算' },
    { item: '签证延签 / ACR I-Card', amount: '按学习周数与菲律宾签证规则确认' },
    { item: '机场接送', amount: '公开价格通常未包含，按抵达时间与学校安排确认' },
    { item: '健身房', amount: '部分资料显示需另付月费，报名前确认最新规则' },
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
      answer: '公开2026美金原价表显示，General ESL / Intensive ESL 四人房4周为 USD 1,590 起；iOutback 列表也显示约 NTD 49,249 起。最终价格要按汇率、优惠、课程和房型确认。',
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

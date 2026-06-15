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
  room: string;
  oneWeek: string;
  fourWeeks: string;
  twelveWeeks: string;
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

@Component({
  selector: 'app-cia-school',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './cia-school.component.html',
  styleUrl: './cia-school.component.css',
})
export class CiaSchoolComponent {
  readonly quickFacts: QuickFact[] = [
    { label: '学校类型', value: '宿务麦克坦半斯巴达度假型校区' },
    { label: '成立时间', value: '2003年创校，2020年麦克坦校区' },
    { label: '学生容量', value: '约600-700名学生' },
    { label: '最低年龄', value: '16岁以上可独立上课' },
    { label: '住宿', value: '校内单人、双人、三人、四人及套房' },
    { label: '考试资源', value: 'IDP IELTS官方考点 / Cambridge认证' },
  ];

  readonly courses: CourseItem[] = [
    {
      title: 'ESL Regular',
      lessons: '4节一对一 + 3节团体 + 1节选修/天',
      text: '适合第一次菲律宾游学、想稳步提升听说读写基础，并希望保留一定休息时间的学生。',
    },
    {
      title: 'ESL Intensive / Power Intensive',
      lessons: '5-6节一对一为主，搭配团体与选修课',
      text: '适合短期冲刺口语、需要更多一对一纠音和表达训练的学生。',
    },
    {
      title: 'IELTS / TOEIC',
      lessons: '考试科目一对一 + 小组课 + 模考与自习',
      text: '适合有分数目标的学生。IELTS保证班通常要求12周，并需要达到入学分数门槛。',
    },
    {
      title: 'Business English',
      lessons: '商务沟通、会议、表达与实用英语训练',
      text: '适合职场人士、准备英文面试或希望提升商务场景沟通能力的学生。',
    },
  ];

  readonly priceRows: PriceRow[] = [
    { room: '四人房', oneWeek: 'USD 660', fourWeeks: 'USD 1,650', twelveWeeks: 'USD 4,950', note: 'ESL Regular最低价房型' },
    { room: '三人房', oneWeek: 'USD 700', fourWeeks: 'USD 1,750', twelveWeeks: 'USD 5,250', note: '预算与舒适度较平衡' },
    { room: '双人房', oneWeek: 'USD 800', fourWeeks: 'USD 2,000', twelveWeeks: 'USD 6,000', note: '适合朋友同行或重视隐私' },
    { room: '标准单人房', oneWeek: 'USD 960', fourWeeks: 'USD 2,400', twelveWeeks: 'USD 7,200', note: '安静独立，旺季较容易满房' },
  ];

  readonly localFees: LocalFee[] = [
    { item: '注册费', amount: 'USD 100' },
    { item: 'SSP特别学习许可', amount: 'PHP 8,000' },
    { item: 'SSP E-card', amount: 'PHP 4,500' },
    { item: '教材费', amount: '约PHP 2,000，按实际购买' },
    { item: '水电费', amount: '约PHP 3,000' },
    { item: '设施维护费', amount: 'PHP 4,000' },
    { item: '接机费', amount: 'PHP 1,000' },
    { item: '保证金', amount: 'PHP 2,500' },
    { item: 'ACR I-Card', amount: 'PHP 4,500，长期学习通常需要' },
  ];

  readonly facilities = [
    '户外泳池与屋顶泳池',
    '健身房、瑜伽区、篮球/排球场',
    '学生餐厅、咖啡区、迷你超市',
    '图书馆、自习室、会议厅',
    '医疗室与护士支持',
    '卡拉OK、娱乐室、祈祷室',
    'IDP IELTS官方考试中心',
    '宿舍阳台、保险柜、洗衣与打扫服务',
  ];

  readonly audiences = [
    '第一次去菲律宾游学，希望学校环境成熟、生活支持完整的学生',
    '想兼顾课程强度、校园设施和周末海岛体验的成人学生',
    '准备IELTS或TOEIC，需要模考与考试氛围的学生',
    '计划4-12周短中期提升口语、听力和综合英语能力的人群',
    '希望住校、三餐、课程、活动都在同一校区内完成的学生',
  ];

  readonly pros = [
    '麦克坦新校区设施新，度假型校园辨识度高',
    '课程覆盖ESL、IELTS、TOEIC、商务英语与青少年方向',
    '校内就是IDP IELTS考点，备考学生更容易熟悉考场节奏',
    '宿舍、餐厅、学习楼和生活设施集中，第一次游学适应成本较低',
  ];

  readonly cons = [
    '热门房型和暑假/寒假档期紧张，需要较早确认空位',
    '半斯巴达管理仍有词汇测试、门禁、EOP等规则，不适合完全自由型学生',
    '单人房费用明显高于多人房，总预算会被房型拉开',
    '费用以学校当期报价为准，促销和当地费用可能随时间调整',
  ];

  readonly faqs: FaqItem[] = [
    {
      question: 'CIA适合零基础学生吗？',
      answer: '可以。ESL课程适合从基础开始，但如果学生目标是短期快速开口，建议选择一对一更多的Intensive或Power Intensive方向。',
    },
    {
      question: '页面上的价格包含所有费用吗？',
      answer: '不包含全部。表格主要是学费和住宿费，还需要加注册费、SSP、教材、水电、设施维护、接机、保证金、签证延签和个人生活费等。',
    },
    {
      question: 'CIA是不是斯巴达学校？',
      answer: 'CIA通常按半斯巴达理解，但规则比轻松型学校严格，例如门禁、词汇测试、EOP和出勤要求。它适合想被节奏推动，但又不想完全封闭管理的学生。',
    },
    {
      question: '什么时候报名比较合适？',
      answer: '如果目标是单人房、暑假、寒假、亲子或12周以上课程，建议尽早锁定。淡季通常更容易确认房型，也更可能遇到优惠。',
    },
  ];
}

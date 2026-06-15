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
  selector: 'app-philinter-school',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './philinter-school.component.html',
  styleUrl: '../cia-school/cia-school.component.css',
})
export class PhilinterSchoolComponent {
  readonly quickFacts: QuickFact[] = [
    { label: '学校全名', value: 'Philinter Center for English Language' },
    { label: '创校年份', value: '2003年' },
    { label: '学校类型', value: '半斯巴达 / 斯巴达管理模式' },
    { label: '位置', value: '麦克坦岛 / Lapu-Lapu City，距离机场较近' },
    { label: '最低年龄', value: '7岁起需父母陪同；15岁以上可免家长陪同' },
    { label: '考试资源', value: '2024年成为 British Council IELTS 官方考场' },
  ];

  readonly courses: CourseItem[] = [
    {
      title: 'General ESL / Intensive ESL',
      lessons: 'General ESL 3节一对一 + 3节小团体 + 2节大团体；Intensive ESL 5节一对一 + 2节小团体',
      text: '适合初学到中级学生，想系统提升阅读、词汇、发音、听说、文法与写作基础。',
    },
    {
      title: 'IPS 强化口说',
      lessons: '5节一对一 + 3节小团体',
      text: '适合想集中提高表达、自信、发音和实际沟通能力的学生，是 Philinter 的常见亮点课程。',
    },
    {
      title: 'IELTS / TOEIC / Guarantee',
      lessons: '考试科目一对一 + 模考 + 晚自习 / 保证班规则',
      text: '适合有明确分数目标的学生。保证班需满足入学成绩、出席率、模考、校规等条件。',
    },
    {
      title: 'Business / Focus Industry',
      lessons: '商务沟通、履历面试、会议谈判、邮件写作与行业主题',
      text: '适合职场学生、求职者和需要特定行业英文的人，例如医疗、营销、饭店管理、教育、会计、工程等方向。',
    },
    {
      title: 'Primary / Junior',
      lessons: '儿童英文、青少年ESL、青少年雅思',
      text: '适合7-15岁学生，但通常需要成年人陪同，并按年龄、面试和程度确认课程开放规则。',
    },
  ];

  readonly priceRows: PriceRow[] = [
    { course: 'Light ESL', triple: 'USD 1,580', twin: 'USD 1,690', single: 'USD 2,020' },
    { course: 'General ESL', triple: 'USD 1,680', twin: 'USD 1,790', single: 'USD 2,120' },
    { course: 'Intensive ESL', triple: 'USD 1,800', twin: 'USD 1,910', single: 'USD 2,240' },
    { course: 'IPS / Advanced Business', triple: 'USD 1,930', twin: 'USD 2,040', single: 'USD 2,370' },
    { course: 'IELTS / TOEFL', triple: 'USD 1,890', twin: 'USD 2,000', single: 'USD 2,330' },
    { course: 'IELTS Guarantee 8周', triple: 'USD 4,480', twin: 'USD 4,700', single: 'USD 5,360' },
    { course: 'IELTS Guarantee 12周', triple: 'USD 6,120', twin: 'USD 6,450', single: 'USD 7,440' },
    { course: 'Junior ESL / Junior IELTS', triple: 'USD 2,130 / 2,190', twin: 'USD 2,240 / 2,300', single: 'USD 2,570 / 2,630' },
  ];

  readonly localFees: LocalFee[] = [
    { item: '注册费', amount: 'USD 100' },
    { item: '周末接机', amount: 'PHP 1,200' },
    { item: '平日接机', amount: 'PHP 1,500' },
    { item: 'SSP学习许可', amount: '当地披索缴费，按学校最新标准确认' },
    { item: '宿舍押金', amount: '当地缴纳，退房结算' },
    { item: '水电 / 管理费', amount: '按校内或校外住宿规则确认' },
    { item: '教材费 / 材料费', amount: '按课程和实际教材计算' },
    { item: '签证延签 / ACR I-Card', amount: '按学习周数和菲律宾签证规则确认' },
  ];

  readonly facilities = [
    '校内宿舍与校外公寓宿舍',
    '无线网络',
    '学生餐厅',
    '台湾 / 华语经理支持',
    '自修教室与视听教室',
    '咖啡厅',
    '游泳池',
    '医护协助',
    '校外宿舍接送安排',
    'IELTS 考试与多国籍学习环境',
  ];

  readonly audiences = [
    '想住在麦克坦岛、靠近机场区域的成人学生',
    '重视师资、学习风气和 Buddy teacher 制度的学生',
    '希望提升口说表达，尤其适合比较 IPS 强化口说课程的人',
    '有 IELTS、TOEIC 或商务英文目标，需要清楚课程体系的人',
    '青少年或亲子家庭，但要先核对年龄、陪同和校外住宿规则',
  ];

  readonly pros = [
    '2003年创校，属于宿务成熟老牌学校',
    '距离机场较近，麦克坦岛生活和交通安排相对方便',
    '课程体系完整，ESL、IPS、考试、商务、青少年课程覆盖广',
    '2024年成为 British Council IELTS 官方考场，考试方向更有优势',
    '提供校内宿舍和校外公寓宿舍，适合不同生活品质偏好',
  ];

  readonly cons = [
    '校内与校外住宿规则不同，报名前要确认门禁、接送和房型',
    '部分课程有年龄、程度或面试要求，不是所有学生都能直接报名',
    '价格会因房型、课程、周数、季节优惠和校外住宿选择变化',
    '如果更重视度假村式新校区外观，可能需要同时比较 CIA、CPI、EV 或 English Fella',
  ];

  readonly faqs: FaqItem[] = [
    {
      question: 'Philinter Academy 的起价是多少？',
      answer: 'iOutback比较表显示 Philinter 为 USD 1,390 起；详细2026费用表中，Light ESL 校内三人房4周为 USD 1,580，General ESL 校内三人房4周为 USD 1,680。',
    },
    {
      question: 'Philinter 适合口说强化吗？',
      answer: '适合。Philinter 的 IPS 强化口说课程是常被提到的亮点，适合想集中提升表达、发音、听说互动和自信的学生。',
    },
    {
      question: 'Philinter 有考试课程吗？',
      answer: '有 IELTS、TOEIC、保证班和青少年雅思等方向。保证班通常要求入学成绩、出席率、模考、晚自习和校规达标。',
    },
    {
      question: 'Philinter 住宿怎么选？',
      answer: '校内宿舍更方便管理和上课，校外公寓更适合追求生活品质的成人或家庭；校外宿舍通常需要确认接送、门禁和生活成本。',
    },
  ];
}

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
    { label: '学校名称', value: '菲律宾宿务Philinter语言学校' },
    { label: '创校年份', value: '2003年' },
    { label: '学校类型', value: '半斯巴达 / 斯巴达管理模式' },
    { label: '位置', value: '麦克坦岛 / Lapu-Lapu City，距离机场较近' },
    { label: '最低年龄', value: '12岁起；12–17岁须与年满18岁的监护人同住一间房' },
    { label: '考试资源', value: '2024年成为 British Council IELTS 官方考场' },
  ];

  readonly courses: CourseItem[] = [
    {
      title: 'General ESL / Intensive ESL',
      lessons: 'General：3节一对一 + 1节小团体 + 2节精品小团体 + 2节大团体选修；Intensive：4节一对一 + 1节小团体 + 2节精品团体 + 1节大团体 + 2节夜间辅导选修',
      text: '适合初学到中级学生，想系统提升阅读、词汇、发音、听说、文法与写作基础。',
    },
    {
      title: 'IPS 强化口说',
      lessons: '4节一对一 + 2节小团体 + 2节精品小团体 + 2节夜间自习选修 + 选修活动',
      text: '适合想集中提高表达、自信、发音和实际沟通能力的学生，是 Philinter 的常见亮点课程。',
    },
    {
      title: 'IELTS / TOEIC / Guarantee',
      lessons: 'IELTS：4节一对一 + 4节小团体 + 2节强制夜间辅导 + 周六模考；TOEIC：4节一对一 + 2节小团体 + 2节大团体 + 周五模考',
      text: '适合有明确分数目标的学生。保证班需满足入学成绩、出席率、模考、校规等条件。',
    },
    {
      title: 'Business / Focus Industry',
      lessons: '商务沟通、履历面试、会议谈判、邮件写作与行业主题',
      text: '适合职场学生、求职者和需要特定行业英文的人，例如医疗、营销、饭店管理、教育、会计、工程等方向。',
    },
    {
      title: 'Junior',
      lessons: 'Junior ESL / IELTS 12–17岁；另有最长8周的Junior Speaking',
      text: '仅限12–17岁，须与成年监护人同房；成人课程以当年度满18岁判断。',
    },
  ];

  readonly priceRows: PriceRow[] = [
    { course: 'Light ESL', triple: '1,600 美元', twin: '1,760 美元', single: '2,190 美元' },
    { course: 'General ESL', triple: '1,710 美元', twin: '1,870 美元', single: '2,300 美元' },
    { course: 'Intensive ESL', triple: '1,840 美元', twin: '2,000 美元', single: '2,430 美元' },
    { course: 'Intensive Power Speaking', triple: '1,980 美元', twin: '2,140 美元', single: '2,570 美元' },
    { course: 'IELTS Intensive / Advanced Business', triple: '2,010 美元', twin: '2,170 美元', single: '2,600 美元' },
    { course: 'IELTS Guarantee 8周', triple: '4,780 美元', twin: '5,100 美元', single: '5,960 美元' },
    { course: 'IELTS Guarantee 12周', triple: '6,690 美元', twin: '7,170 美元', single: '8,460 美元' },
    { course: 'Speaking / Junior Speaking', triple: '2,210 美元', twin: '2,370 美元', single: '2,800 美元' },
  ];

  readonly localFees: LocalFee[] = [
    { item: '注册费', amount: '每人120美元，一次性收取' },
    { item: '周末接机', amount: '比索 1,200' },
    { item: '平日接机', amount: '比索 1,500' },
    { item: 'SSP + SSP I-CARD', amount: '比索 7,800 + 4,500' },
    { item: '管理费', amount: '比索 2,200 / 4周' },
    { item: '电费 / 水费', amount: '比索 2,800 + 1,000 / 4周' },
    { item: '教材费', amount: '约比索 2,000 / 4周' },
    { item: '学生证', amount: '比索 400' },
    { item: '宿舍押金', amount: '比索 2,000–5,000，可退' },
    { item: '签证延签 / ACR I-Card', amount: '按学习周数计算' },
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
      question: '菲律宾宿务Philinter语言学校的起价是多少？',
      answer: '2026费用表中，Light ESL加校内三人房4周原价为1,600 美元；通过思达报名，课程及住宿9折后为1,440 美元，再加每人120美元注册费，4周参考合计1,560美元。',
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

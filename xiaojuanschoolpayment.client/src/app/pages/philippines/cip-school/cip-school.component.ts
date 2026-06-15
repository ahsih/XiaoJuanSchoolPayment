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

interface SourceLink {
  label: string;
  url: string;
}

@Component({
  selector: 'app-cip-school',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './cip-school.component.html',
  styleUrl: '../cia-school/cia-school.component.css',
})
export class CipSchoolComponent {
  readonly quickFacts: QuickFact[] = [
    { label: '学校名称', value: 'CIP English Kepos' },
    { label: '城市', value: 'Clark / Angeles, Pampanga' },
    {
      label: '学校定位',
      value: '外教一对一、ESL、IELTS、TOEIC、商务与亲子综合型',
    },
    { label: '学习模式', value: 'Light / Semi-Sparta / Sparta 可按课程选择' },
    { label: '住宿', value: '校内宿舍 + 校外 Hotel 住宿选项' },
    { label: '年龄方向', value: '成人、Primary 7-11岁、Junior 12-15岁' },
  ];

  readonly courses: CourseItem[] = [
    {
      title: 'Light ESL / Premium Native Light',
      lessons: '每日约5节课，适合轻量学习与弹性安排',
      text: '适合想要保留个人时间、远程工作、亲子家长或第一次到Clark适应环境的学生。',
    },
    {
      title: 'Regular ESL / Native ESL',
      lessons: 'Semi-Sparta节奏，菲律宾老师与Native课程可组合',
      text: '适合希望稳步提高口语、听力、词汇和表达自然度，同时不想进入过强管理的学生。',
    },
    {
      title: 'Intensive ESL',
      lessons: 'Sparta方向，课程密度更高',
      text: '适合短期冲刺、需要更多一对一纠正和学习节奏推动的成人或青少年学生。',
    },
    {
      title: 'IELTS / IELTS Guarantee',
      lessons: 'IELTS Basic、Intensive、Native、Guarantee',
      text: '适合有分数目标的学生，需按入学英文程度、保证班条件和模考安排逐项确认。',
    },
    {
      title: 'TOEIC / Advanced Business',
      lessons: '考试与职场沟通方向',
      text: '适合升学、求职、企业沟通、面试表达和商务场景需要更具体输出训练的人群。',
    },
    {
      title: 'Primary / Junior',
      lessons: 'Primary English 7-11岁；Junior 12-15岁',
      text: '适合亲子陪读或青少年独立学习规划，但监护、房型和年龄规则必须报名前确认。',
    },
  ];

  readonly priceRows: PriceRow[] = [
    {
      room: 'Light ESL 共享宿舍',
      oneWeek: '约 USD 568 起',
      fourWeeks: '约 USD 1,420 起',
      twelveWeeks: '约 USD 4,260 起',
      note: '作为页面起价参考，实际按房型和国籍价目表确认',
    },
    {
      room: 'Regular ESL 共享宿舍',
      oneWeek: '约 USD 608 起',
      fourWeeks: '约 USD 1,520 起',
      twelveWeeks: '约 USD 4,560 起',
      note: 'Semi-Sparta常规ESL方向',
    },
    {
      room: 'Intensive ESL 共享宿舍',
      oneWeek: '约 USD 672 起',
      fourWeeks: '约 USD 1,680 起',
      twelveWeeks: '约 USD 5,040 起',
      note: '课程密度更高，适合短期冲刺',
    },
    {
      room: 'IELTS Intensive 共享宿舍',
      oneWeek: '约 USD 720 起',
      fourWeeks: '约 USD 1,800 起',
      twelveWeeks: '约 USD 5,400 起',
      note: '需按目标分、保证班规则和开课条件确认',
    },
  ];

  readonly localFees: LocalFee[] = [
    { item: '注册费', amount: '通常约 USD 100-150，按当期价目表确认' },
    { item: 'SSP / SSP E-card', amount: '以菲律宾当期移民局与学校收费为准' },
    { item: '教材 / E-book', amount: '按课程和实际使用教材收取' },
    { item: '水电与设施费', amount: '按周数、房型或实际使用规则确认' },
    { item: '接机费', amount: 'Clark或Manila机场接送需分开确认' },
    { item: '押金 / 洗衣 / 签证延签', amount: '属于当地费用，报名预算需另列' },
  ];

  readonly facilities = [
    '校内宿舍与校外Hotel住宿选项',
    '一对一教室、小组课教室和Academic Office',
    'Native speaker 1:1课程体系',
    '周六课程与晚间学习项目',
    '餐食服务、宿舍管理和学生支持',
    '亲子与青少年课程支持',
    'Quiet and nature-friendly学习环境',
    '可按课程方向安排IELTS、TOEIC、Business训练',
  ];

  readonly audiences = [
    '想在Clark选择外教一对一比例更高的学生',
    '成人口语、发音、商务沟通或面试表达目标明确的人',
    '需要IELTS、TOEIC或短期英语冲刺的学生',
    '亲子陪读、Primary或Junior年龄段家庭',
    '希望住宿选择比单一校内宿舍更弹性的学生',
  ];

  readonly pros = [
    'CIP官方强调Native 1:1课程体系，适合重视发音和自然表达的学生',
    '课程线完整，从Light ESL到IELTS Guarantee、TOEIC和Business都有覆盖',
    'Clark位置对部分航班和家庭行程更方便，生活节奏比宿务海岛区更安静',
    '官方资料列出校内宿舍与校外Hotel，住宿选择较灵活',
  ];

  readonly cons = [
    '费用和优惠会按国籍价目表、房型、周数和入学日变化，不能只看起价',
    'Native课程不等于全部课程都是外教，需要确认每门课的老师配置',
    '青少年或亲子报名要特别确认年龄、监护、门禁、餐食和医疗支持',
    '如果目标是高压封闭备考，也应同时比较碧瑶或更强Sparta学校',
  ];

  readonly faqs: FaqItem[] = [
    {
      question: 'CIP English Kepos和一般Clark学校最大差别是什么？',
      answer:
        'CIP更强调Native speaker一对一与外教口语训练，同时保留ESL、IELTS、TOEIC、Business和Junior课程线，适合把口语自然度和课程组合放在重点的人。',
    },
    {
      question: '页面价格是最终报价吗？',
      answer:
        '不是。这里是参考起价，用于让学生先判断预算级别；最终仍需按2026-2027官方价目表、国籍报价、房型、周数、优惠和当地费用重新核算。',
    },
    {
      question: 'CIP适合亲子或未成年学生吗？',
      answer:
        '可以列入候选，官方课程包含Primary 7-11岁和Junior 12-15岁方向；但报名前必须确认监护规则、住宿安排、接送、年龄限制和课后管理。',
    },
    {
      question: 'Light ESL适合什么人？',
      answer:
        '适合想保留较多个人时间、需要远程办公、陪读家长、初次适应海外课堂，或不想一开始进入高强度Sparta节奏的学生。',
    },
  ];
}

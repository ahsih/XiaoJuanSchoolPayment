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
  deluxeSingle: string;
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
  selector: 'app-fella-school',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './fella-school.component.html',
  styleUrl: '../cia-school/cia-school.component.css',
})
export class FellaSchoolComponent {
  readonly quickFacts: QuickFact[] = [
    { label: '学校名称', value: 'English Fella' },
    { label: '创校 / 运营', value: '2006年开始运营' },
    { label: '学校类型', value: '第一校区斯巴达；第二校区自律 / 半斯巴达' },
    { label: '位置', value: 'Talamban, Cebu City' },
    { label: '最低年龄', value: '5岁起需父母陪同；15岁以上可免家长陪同' },
    { label: '适合方向', value: 'ESL、IELTS、TOEIC、TOEFL、商务、亲子' },
  ];

  readonly courses: CourseItem[] = [
    {
      title: 'PIC-4 / PIC-5 / PIC-6',
      lessons: '4-6节一对一 + 小团体 / 大团体 + 选修课',
      text: '适合想提高口说、听力、阅读和文法基础的学生；PIC-5 与 PIC-6 会增加一对一与口说时间。',
    },
    {
      title: 'IELTS / IELTS Guarantee',
      lessons: '雅思口说、写作、阅读、听力、文法与密集自习',
      text: '适合英联邦升学、移民或分数目标学生。保证班通常有指定入学日、最低程度和出席率要求。',
    },
    {
      title: 'TOEIC / TOEIC Guarantee / TOEFL',
      lessons: '考试科目一对一 + 团体课 + 模考与自习安排',
      text: '适合求职、毕业门槛、留学申请或希望用考试目标推动学习节奏的学生。',
    },
    {
      title: 'Business English',
      lessons: '商务沟通、简报、会议、写作与职场主题课程',
      text: '适合成人与职场学生，尤其是需要把英文用于会议、报告和跨文化沟通的人。',
    },
    {
      title: 'Junior / Guardian',
      lessons: '儿童课程与监护人课程',
      text: '适合亲子同行或低龄学生，但要先确认校区、住宿、监护费、年龄限制和门禁规则。',
    },
  ];

  readonly priceRows: PriceRow[] = [
    { course: 'Guardian / 监护人课程', triple: 'USD 1,550', twin: 'USD 1,650', single: 'USD 1,850', deluxeSingle: 'USD 1,950' },
    { course: 'PIC-4', triple: 'USD 1,700', twin: 'USD 1,800', single: 'USD 2,000', deluxeSingle: 'USD 2,100' },
    { course: 'PIC-5 / TOEIC / TOEFL / Junior', triple: 'USD 1,800', twin: 'USD 1,900', single: 'USD 2,100', deluxeSingle: 'USD 2,200' },
    { course: 'PIC-6 / Business', triple: 'USD 1,900', twin: 'USD 2,000', single: 'USD 2,200', deluxeSingle: 'USD 2,300' },
    { course: 'IELTS / TOEIC Guarantee 12周', triple: 'USD 5,700', twin: 'USD 6,000', single: 'USD 6,600', deluxeSingle: 'USD 6,900' },
    { course: 'IELTS Guarantee 12周', triple: 'USD 6,000', twin: 'USD 6,300', single: 'USD 6,900', deluxeSingle: 'USD 7,200' },
  ];

  readonly localFees: LocalFee[] = [
    { item: '注册费', amount: 'USD 100' },
    { item: 'SSP学习许可', amount: '当地披索缴费，按学校最新标准确认' },
    { item: '宿舍押金', amount: '当地缴纳，退房结算' },
    { item: '水电 / 管理费', amount: '按校区、房型和实际使用确认' },
    { item: '教材费 / 材料费', amount: '按课程和实际教材计算' },
    { item: '签证延签 / ACR I-Card', amount: '按学习周数和签证规则确认' },
    { item: '机场接送', amount: '按抵达时间与学校安排确认' },
    { item: '监护费', amount: '15-17岁独自就读需确认监管费' },
  ];

  readonly facilities = [
    '校内宿舍',
    '全校区无线网络',
    '学生餐厅',
    '台湾 / 华语经理支持',
    'CAFELLA 咖啡厅与福利社',
    '自修教室与电脑教室',
    '健身房、篮球场、游泳池',
    '医护室与校外转诊协助',
    '亲子同行支持',
    '校内活动、烤肉派对、体育竞赛与跳岛活动',
  ];

  readonly audiences = [
    '想在宿务找老牌学校，同时重视老师管理、校区空间和人情味的学生',
    '希望可以选择斯巴达、半斯巴达或自律型管理强度的人',
    'ESL、IELTS、TOEIC、TOEFL、商务英文都可能需要比较的学生',
    '想要较大校园、泳池、运动设施和校内咖啡厅生活感的人',
    '亲子同行、青少年或长期学习学生，但需先核对年龄和监护规则',
  ];

  readonly pros = [
    '2006年起运营，属于宿务成熟老牌学校',
    '两校区可对应不同管理强度，选校弹性较好',
    '课程覆盖 ESL、考试、商务、儿童和监护人课程',
    '校园空间较大，运动设施、泳池和咖啡厅生活感强',
    '资料强调台湾经理照顾与固定校内活动，适合重视支持感的学生',
  ];

  readonly cons = [
    '校区与管理模式不同，报名前必须确认自己会入住哪个校区',
    '校园不是最新型豪华校区，住宿质感需和新校比较后判断',
    '斯巴达校区有自习、单字测试和外出规则，不适合只想轻松体验的人',
    '公开价格为原价参考，最终仍要看汇率、优惠、房型和周数',
  ];

  readonly faqs: FaqItem[] = [
    {
      question: 'English Fella 的起价是多少？',
      answer: 'iOutback列表显示 FELLA 为 USD 1,550 起。详细表中 Guardian / 监护人课程三人房4周为 USD 1,550；成人 PIC-4 三人房4周为 USD 1,700 起。',
    },
    {
      question: 'English Fella 是斯巴达学校吗？',
      answer: '资料显示第一校区为斯巴达，第二校区为自律型或半斯巴达。报名时要按目标、年龄、房型和校区空位确认具体管理模式。',
    },
    {
      question: 'English Fella 适合亲子吗？',
      answer: '可以考虑。公开资料列出儿童课程和监护人课程，最低年龄信息也显示低龄学生需父母陪同；未成年独自就读要确认监管费用和校规。',
    },
    {
      question: '如果目标是 IELTS，English Fella 和 CPILS 怎么选？',
      answer: 'Fella 更偏大校园、照顾感和校区选择弹性；CPILS 更偏考试资源和老牌考试型管理。建议按当前分数、目标分数、可读周数和可接受校规来比较。',
    },
  ];
}

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
  selector: 'app-ev-school',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './ev-school.component.html',
  styleUrl: '../cia-school/cia-school.component.css',
})
export class EvSchoolComponent {
  readonly quickFacts: QuickFact[] = [
    { label: '学校类型', value: '宿务斯巴达 / 半斯巴达双模式名校' },
    { label: '成立时间', value: '2002年创校，2017年迁入新校区' },
    { label: '位置', value: 'Nasipit, Cebu City, Cebu' },
    { label: '学生容量', value: '约300名学生' },
    { label: '最低年龄', value: '7岁起；15岁以下需父母陪同' },
    { label: '住宿', value: '校内单人、双人、三人、四人房' },
  ];

  readonly courses: CourseItem[] = [
    {
      title: 'Intensive ESL',
      lessons: '4节一对一 + 4节团体 + 2节选修/天',
      text: 'EV的经典斯巴达强度课程，适合想在短时间内把学习节奏拉满的学生。',
    },
    {
      title: 'ESL Classic',
      lessons: '4节一对一 + 4节团体 + 2节选修/天',
      text: '适合想平衡学习与宿务生活体验的学生，是页面起价参考使用的课程。',
    },
    {
      title: 'Power Speaking 6 / 8',
      lessons: '每天6或8节一对一口语训练',
      text: '适合明确想加强开口、表达流利度、纠音和口语反应速度的学生。',
    },
    {
      title: 'IELTS / TOEIC / Business',
      lessons: '考试或特定目的英语课程，搭配斯巴达或半斯巴达制度',
      text: '适合有分数目标、职场英语目标，或需要更清晰学习管理的学生。',
    },
  ];

  readonly priceRows: PriceRow[] = [
    { room: '四人房', oneWeek: 'USD 752', fourWeeks: 'USD 1,880', twelveWeeks: 'USD 5,640', note: 'ESL Classic最低价房型' },
    { room: '三人房', oneWeek: 'USD 772', fourWeeks: 'USD 1,930', twelveWeeks: 'USD 5,790', note: '多人房中较平衡' },
    { room: '双人房', oneWeek: 'USD 804', fourWeeks: 'USD 2,010', twelveWeeks: 'USD 6,030', note: '适合朋友同行' },
    { room: '单人房', oneWeek: 'USD 952', fourWeeks: 'USD 2,380', twelveWeeks: 'USD 7,140', note: '隐私最好，预算较高' },
  ];

  readonly localFees: LocalFee[] = [
    { item: '注册费', amount: 'USD 100' },
    { item: 'SSP特别学习许可', amount: 'PHP 7,800' },
    { item: 'SSP E-card', amount: 'PHP 4,500' },
    { item: '教材费', amount: '约PHP 2,000，按实际购买' },
    { item: '水电费', amount: '约PHP 3,200' },
    { item: 'ACR I-Card', amount: 'PHP 4,000，长期学习通常需要' },
    { item: '学生证', amount: 'PHP 500' },
    { item: '设施维护费', amount: 'PHP 2,000' },
    { item: '接机费', amount: 'PHP 1,200' },
    { item: '保证金', amount: 'PHP 3,000' },
    { item: '洗衣费', amount: 'PHP 600，约150P/5kg/次' },
  ];

  readonly facilities = [
    '游泳池与大草坪校园',
    '24小时自习室',
    'IDP IELTS官方考试教室',
    '健身房、桌球、乒乓球、室内篮球',
    '医护室、图书馆、学生餐厅',
    '咖啡厅、贩卖部、无线网络',
    '单人到四人校内宿舍',
    '每周打扫与洗衣服务',
  ];

  readonly audiences = [
    '目标清楚、希望用斯巴达节奏推动自己的学生',
    '想在宿务市区学习，同时住在设施完整校园里的学生',
    '准备IELTS、TOEIC、TOEFL或商务英语的成人学生',
    '希望加强口语，愿意选择Power Speaking高一对一课时的人群',
    '亲子或未成年学生，但需要先确认年龄、陪同和管理规则',
  ];

  readonly pros = [
    '宿务较早导入斯巴达管理模式的学校之一，学习纪律清晰',
    'SP1斯巴达与SP2半斯巴达可按学习目标选择',
    '新校区环境现代，住宿、课程、设施都在同一校园内',
    '课程覆盖ESL、Power Speaking、IELTS、TOEIC、商务与家庭课程',
  ];

  readonly cons = [
    '热门课程和房型容易满位，旺季建议提前2-3个月确认',
    '斯巴达课程限制更多，不适合只想轻松体验宿务生活的学生',
    '未成年学生有额外管理费和更严格门禁，需要提前核对',
    '本地费用、洗衣、签证延签和个人生活费需要单独预算',
  ];

  readonly faqs: FaqItem[] = [
    {
      question: 'EV Academy适合第一次菲律宾游学吗？',
      answer: '适合目标明确、能接受一定管理的学生。如果更想轻松体验宿务生活，可优先考虑SP2半斯巴达或ESL Classic。',
    },
    {
      question: 'EV的SP1和SP2怎么选？',
      answer: 'SP1更适合冲刺型学生，日程和自习要求更强；SP2适合想学习但也希望保留一定外出和生活弹性的学生。',
    },
    {
      question: '页面费用包含所有支出吗？',
      answer: '不包含全部。表格主要是学费住宿费，还需要加注册费、SSP、教材、水电、设施费、接机、保证金、洗衣、签证延签和个人生活费等。',
    },
    {
      question: 'EV适合亲子或未成年学生吗？',
      answer: '可以考虑，但15岁以下需父母陪同，未满18岁通常有额外管理费和更严格门禁，报名之前要按年龄和课程逐项确认。',
    },
  ];
}

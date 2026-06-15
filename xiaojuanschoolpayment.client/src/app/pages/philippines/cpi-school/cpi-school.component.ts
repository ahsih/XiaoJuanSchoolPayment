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
  selector: 'app-cpi-school',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './cpi-school.component.html',
  styleUrl: '../cia-school/cia-school.component.css',
})
export class CpiSchoolComponent {
  readonly quickFacts: QuickFact[] = [
    { label: '学校类型', value: '宿务半斯巴达 / 度假村型校园' },
    { label: '创校年度', value: '2015年新校区启用' },
    { label: '位置', value: 'Holy Family Road, Nivel Hills, Lahug, Cebu' },
    { label: '学生容量', value: '约250名学生' },
    { label: '最低年龄', value: '6岁起，青少年需按课程规则确认' },
    { label: '教学配置', value: '约130间一对一教室，34间团体教室' },
  ];

  readonly courses: CourseItem[] = [
    {
      title: '一般英语课程',
      lessons: '4节一对一 + 2节小团体 + 1节大团体',
      text: '适合第一次菲律宾游学、基础口语提升和想在舒适校园里稳定学习的学生。',
    },
    {
      title: '密集英语课程',
      lessons: '5节一对一 + 2节小团体 + 1节大团体',
      text: '适合短中期强化，想增加一对一时间、补听说读写短板的学生。',
    },
    {
      title: 'IELTS / TOEIC / TOEFL',
      lessons: '考试科目一对一 + 小团体 + 模考安排',
      text: '适合有考试目标的学生。保证班通常有最低周数、模考与官方考试相关规则。',
    },
    {
      title: 'Junior / Parent / Business',
      lessons: '青少年、家长英语、商务英语等专项课程',
      text: '适合家庭同行、青少年游学或职场英语需求，但需先确认年龄、房型和课程开放状态。',
    },
  ];

  readonly priceRows: PriceRow[] = [
    { item: '页面起价参考', reference: 'NTD 12,820 / 周起', note: '非凡游学宿务学校列表显示的CPI起价' },
    { item: '4周预算', reference: '需按课程与房型报价', note: 'CPI公开页未给出完整房型价目表，建议以当期报价单为准' },
    { item: '12周预算', reference: '需按课程与房型报价', note: '考试保证班、家庭房、豪华房型会明显影响总价' },
    { item: '额外费用', reference: '当地费用另计', note: 'SSP、教材、水电、押金、接送、签证延签等通常不含在起价内' },
  ];

  readonly localFees: LocalFee[] = [
    { item: '注册费', amount: '以学校当期报价为准' },
    { item: 'SSP学习许可', amount: '当地缴费，需确认最新金额' },
    { item: '教材费', amount: '按课程与实际使用教材计算' },
    { item: '水电/管理费', amount: '按学校当期标准收取' },
    { item: '接机/送机', amount: '按抵达日期与学校安排确认' },
    { item: '保证金', amount: '通常当地缴纳，退房结算' },
    { item: '签证延签/ACR I-Card', amount: '按学习周数和签证规则确认' },
    { item: '个人生活费', amount: '外食、周末活动、SIM卡、洗衣等另计' },
  ];

  readonly facilities = [
    '度假村式校园与半山环境',
    '游泳池、健身房、蒸气浴室',
    '学生餐厅、咖啡吧、小商店',
    '图书馆、自修教室、电影室',
    '篮球场、高尔夫练习场、交谊休息厅',
    '医务室、公用电脑、Wi-Fi',
    '校内高级与豪华房型',
    '每周打扫与洗衣服务',
  ];

  readonly audiences = [
    '第一次游学，担心纯斯巴达压力太大，但仍想有学习管理的学生',
    '重视住宿、餐食、泳池和校园环境的成人学生',
    '想在Cebu City学习，但不想住在太商业化市区环境的人群',
    'ESL、IELTS、TOEIC、TOEFL或商务英语都有可能需要的学生',
    '亲子或青少年学生，但要先核对年龄、房型和监护规则',
  ];

  readonly pros = [
    '校园和住宿辨识度高，度假型环境适应门槛较低',
    '课程覆盖ESL、考试、商务、青少年和家长课程',
    '放学后有选修课、晚自习、运动与活动安排',
    '适合想兼顾学习效率和生活舒适度的学生',
  ];

  readonly cons = [
    '热门房型和亲子档期需要提前确认',
    '房型选择多，最终预算会因高级/豪华房型差异拉开',
    '公开资料显示起价，但完整价目需要当期报价单确认',
    '半山环境空气好，但外出和市区便利度要按个人习惯评估',
  ];

  readonly faqs: FaqItem[] = [
    {
      question: 'CPI适合第一次去菲律宾游学吗？',
      answer: '适合。CPI环境舒适、住宿和设施较完整，半斯巴达管理也能给第一次游学的学生一定学习节奏。',
    },
    {
      question: 'CPI是斯巴达还是半斯巴达？',
      answer: '资料中常以半斯巴达或度假型半斯巴达理解。它保留学习管理和晚间安排，但整体氛围比高压斯巴达更偏舒适。',
    },
    {
      question: '为什么费用页没有完整房型表？',
      answer: '我能查到的公开页显示CPI起价为NTD 12,820/周起，但完整房型和课程价目需按学校当期报价单确认，避免把不确定价格写死。',
    },
    {
      question: 'CPI适合亲子吗？',
      answer: '可以考虑，CPI有青少年和家长课程方向，但低龄学生要先确认年龄、同行家长、家庭房、门禁和照顾安排。',
    },
  ];
}

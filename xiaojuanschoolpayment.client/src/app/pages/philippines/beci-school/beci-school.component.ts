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
  campus: string;
  course: string;
  fourWeeks: string;
  room: string;
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
  selector: 'app-beci-school',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './beci-school.component.html',
  styleUrls: ['../cia-school/cia-school.component.css', './beci-school.component.css'],
})
export class BeciSchoolComponent {
  readonly quickFacts: QuickFact[] = [
    { label: '学校名称', value: 'BECI International Language Academy / API BECI' },
    { label: '城市', value: '菲律宾碧瑶 Baguio' },
    { label: '创校时间', value: '约2002-2003年开始运营' },
    { label: '主要校区', value: 'EOP Campus / Sparta Campus / City Campus' },
    { label: '学校类型', value: '自律、半斯巴达、斯巴达多校区体系' },
    { label: '适合方向', value: 'ESL、口语诊断、IELTS、TOEIC、商务/工作者英文' },
  ];

  readonly courses: CourseItem[] = [
    {
      title: 'Lite ESL',
      lessons: '2节一对一 + 2节团体课 / 天',
      text: '适合想保留复习时间、学习节奏不要太满的学生，常作为成人或长期学习的轻量选择。',
    },
    {
      title: 'Speed ESL',
      lessons: '4节一对一 + 2节团体课 / 天',
      text: 'BECI代表性半斯巴达课程，平衡口说、听力、阅读、写作，适合多数初中级学生。',
    },
    {
      title: 'Sparta ESL / 24 ESL',
      lessons: '5-7小时正课 + 夜间学习 / 天',
      text: '适合短期冲刺、需要外部纪律推动、想把平日时间集中投入英语的人。',
    },
    {
      title: 'TOEIC / IELTS',
      lessons: '考试科目一对一 + 团体课 + 模考',
      text: 'Sparta校区更适合多益和雅思目标；保证班通常有入学分数、出勤率和模考要求。',
    },
    {
      title: 'ESP / Business English',
      lessons: '商务、简报、面试、旅行或工作场景主题课',
      text: 'City Campus方向更适合上班族、自由职业者、创业者或需要职业英语的人。',
    },
    {
      title: 'SP / SC / REHAB Speaking',
      lessons: '口语诊断、口语教练、发音纠正附加训练',
      text: 'BECI的特色之一是用口语处方诊断发音、重音、语调、词汇和语法弱点，再做针对性反馈。',
    },
  ];

  readonly priceRows: PriceRow[] = [
    {
      campus: 'EOP / Cafe',
      course: 'Lite ESL',
      fourWeeks: 'USD 1,170-1,550',
      room: '四人房至单人房',
      note: '2026公开原价参考，适合轻量ESL。',
    },
    {
      campus: 'EOP / Cafe',
      course: 'Speed ESL',
      fourWeeks: 'USD 1,370-1,750',
      room: '四人房至单人房',
      note: '口说强化与半斯巴达代表课程。',
    },
    {
      campus: 'EOP / Cafe',
      course: 'Sparta ESL / Working Holiday',
      fourWeeks: 'USD 1,470-1,950',
      room: '四人房至单人房',
      note: '强度更高，适合短期集中训练。',
    },
    {
      campus: 'Sparta',
      course: '24小时ESL / TOEIC / IELTS',
      fourWeeks: 'USD 1,650-1,700',
      room: '四人房',
      note: '2025公开原价参考，宿舍为3+1沉浸式系统。',
    },
    {
      campus: 'Sparta',
      course: '12周IELTS保证班',
      fourWeeks: 'USD 5,700 / 12周',
      room: '四人房',
      note: '需符合入学分数、出勤和模考规则。',
    },
    {
      campus: 'City',
      course: 'Lite / Speed / ESP / IELTS',
      fourWeeks: 'USD 1,200-2,100',
      room: 'Quad、Studio、Semi等房型',
      note: '成人工作者导向，房型和课程价差较大。',
    },
  ];

  readonly localFees: LocalFee[] = [
    { item: '注册费', amount: '通常约USD 100，依校区和当期报价确认' },
    { item: '接机费', amount: '马尼拉约PHP 3,000；克拉克约PHP 2,500；EOP页面显示依距离/人数可变' },
    { item: 'SSP / 学习许可', amount: '当地披索缴费，按学习周数和学校当期标准确认' },
    { item: '签证延签 / ACR I-Card', amount: '长期学习通常需要，依菲律宾移民规则确认' },
    { item: '教材 / 材料费', amount: '按课程和实际教材购买计算' },
    { item: '水电 / 押金', amount: '未含在公开学费住宿价中，退房时按学校规则结算' },
    { item: '洗衣 / 打扫', amount: '部分校区有固定洗衣、清扫或床品更换安排' },
    { item: '附加课程', amount: 'SP、SC、REHAB等口语附加项目需确认是否另计' },
  ];

  readonly facilities = [
    '校内宿舍',
    '全校区无线网络',
    '学生餐厅与点心吧',
    '自修教室与视听教室',
    '华语经理或学生支持',
    'EOP校区按摩间、自助厨房、花园露台',
    'City校区周边餐厅、公园、商场与工作者生活机能',
    'Sparta校区3+1宿舍沉浸式英文环境',
  ];

  readonly audiences = [
    '想改善发音、口语流利度和开口信心的学生',
    '想在自律、半斯巴达、斯巴达之间按强度选择的人',
    '准备TOEIC或IELTS，需要模考和考试策略训练的学生',
    '30岁以上工作者、自由职业者、创业者或需要商务/职场英文的人',
    '喜欢小而有交流感的校区，愿意参与EOP英文环境的人',
  ];

  readonly pros = [
    '多校区定位清楚：EOP偏英语沉浸，Sparta偏强管理，City偏成人和工作者',
    '口语诊断、Speaking Prescription、Speaking Coach和发音纠正是辨识度高的特色',
    'City Campus位置便利，适合成人学生兼顾学习、生活和远程工作',
    'Sparta Campus有3+1宿舍安排，老师与学生同住更强调沉浸式英文环境',
    'EOP Campus规模较小，更容易形成互相认识、愿意开口的学习氛围',
  ];

  readonly cons = [
    'BECI不同校区差异很大，报名前必须先确认校区，不宜只看学校名报名',
    'Sparta校区四人房和3+1安排不一定适合重视隐私或安静休息的人',
    'City Campus更自由，若学生自律弱，可能不如Sparta或EOP有推动力',
    '公开价格按校区、年份、房型和优惠变化，最终报价要重新核对',
    '碧瑶交通比宿务周折，从马尼拉或克拉克转车时间需要提前规划',
  ];

  readonly faqs: FaqItem[] = [
    {
      question: 'BECI的EOP、Sparta、City怎么选？',
      answer: '想练口语和英语思维，看EOP；需要强管理和短期冲刺，看Sparta；成人、工作者、远程办公或商务英文需求，看City。',
    },
    {
      question: 'BECI适合零基础吗？',
      answer: '可以先看EOP或City的Lite ESL、Speed ESL。若自律较弱也可考虑Sparta ESL，但要确认能否接受更密集的作息。',
    },
    {
      question: 'BECI最突出的特色是什么？',
      answer: '它不只是课程名多，而是口语诊断和反馈机制明显，例如SP、SC、REHAB等项目，适合想精准改善发音和表达的人。',
    },
    {
      question: '页面价格包含全部费用吗？',
      answer: '不包含。学费住宿之外，还需要另算注册费、接机、SSP、签证延签、ACR I-Card、教材、水电、押金和个人生活费。',
    },
  ];

  readonly sources: SourceLink[] = [
    { label: 'APIBECI 官方网站', url: 'https://beciedu.com/' },
    { label: 'APIBECI EOP Campus', url: 'https://beciedu.com/eop-campus/' },
    { label: 'APIBECI Sparta Campus', url: 'https://beciedu.com/sparta-campus/' },
    { label: 'APIBECI City Campus', url: 'https://beciedu.com/city-campus/' },
    { label: 'iOutback - BECI EOP/Cafe', url: 'https://www.ioutback.com/study-abroad/philippines/SCHOOL/beci_cafe_detail' },
    { label: 'iOutback - BECI Sparta', url: 'https://www.ioutback.com/study-abroad/philippines/SCHOOL/beci_sparta_detail' },
    { label: 'iOutback - BECI City', url: 'https://www.ioutback.com/study-abroad/philippines/SCHOOL/beci_city_detail' },
    { label: '大洋游学', url: 'http://www.dayang101.com/' },
  ];
}

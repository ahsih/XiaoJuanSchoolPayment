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
  amount: string;
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
  selector: 'app-aelc-school',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './aelc-school.component.html',
  styleUrl: '../cia-school/cia-school.component.css',
})
export class AelcSchoolComponent {
  readonly quickFacts: QuickFact[] = [
    { label: '页面定位', value: 'AELC / Native-focused Clark Schools 候选池' },
    { label: '城市', value: 'Clark / Angeles, Pampanga' },
    { label: '适合方向', value: 'Native口语、发音、家庭项目、商务沟通候选' },
    { label: '资料状态', value: 'AELC与同类外教型学校需逐校复核当前招生资料' },
    { label: '选校重点', value: '外教比例、实际授课老师、住宿、年龄规则、费用和接送' },
    { label: '费用', value: '需以当期学校报价和房型空位确认' },
  ];

  readonly courses: CourseItem[] = [
    {
      title: 'Native Speaking',
      lessons: 'Native teacher口语、发音、表达和互动训练',
      text: '适合想要更多欧美外教输入、改善发音语调、提升自然表达和真实沟通反应的人。',
    },
    {
      title: 'ESL',
      lessons: '基础英语与一对一训练',
      text: '适合先建立听说读写框架，再逐步加入Native口语课的初中级学生。',
    },
    {
      title: 'Family Program',
      lessons: '儿童课程 + 家长课程或陪读安排',
      text: '适合亲子家庭，但必须确认年龄、监护、房型、餐食、接送和课后管理。',
    },
    {
      title: 'Junior',
      lessons: '青少年英语和口语训练',
      text: '适合希望孩子在Clark较舒适环境中接触外教课堂的家庭。',
    },
    {
      title: 'Business English',
      lessons: '职场表达、会议、面试和商务场景沟通',
      text: '适合成人学生、职场人士和需要提高英文沟通自然度的人。',
    },
  ];

  readonly priceRows: PriceRow[] = [
    {
      item: 'Native-focused课程 + 住宿',
      amount: '需当期确认',
      note: '需逐校确认AELC或同类Clark外教型学校当前是否招生、课程是否开放、房型是否有空位。',
    },
    {
      item: 'Native课比例差价',
      amount: '需当期确认',
      note: '外教课比例越高，价格通常越高；需确认是1:1、团课，还是特定课程才有外教。',
    },
    {
      item: 'Family / Junior项目',
      amount: '需当期确认',
      note: '亲子费用会受儿童年龄、家长是否上课、房型和监护规则影响。',
    },
  ];

  readonly localFees: LocalFee[] = [
    { item: '注册费', amount: '按学校当期报价确认' },
    { item: 'SSP / SSP E-card', amount: '按菲律宾当地规定和学校说明缴纳' },
    { item: '教材费', amount: '按课程和实际教材收取' },
    { item: '水电 / 设施 / 押金', amount: '按房型、周数和学校规则确认' },
    { item: '接机费', amount: 'Clark或Manila机场需分开确认' },
    { item: '签证延签 / ACR I-Card', amount: '按停留周数和当地规定确认' },
  ];

  readonly facilities = [
    '外教比例和实际授课老师需逐校确认',
    '校内或校外住宿房型需按当期空位确认',
    '亲子、Junior和成人课程是否同期开课需确认',
    '门禁、课后照看和未成年管理规则需复核',
    '机场接送、医疗支持和周边生活便利度需列入比较',
    '餐食、洗衣、清洁、网络和押金规则需在报价前确认',
  ];

  readonly audiences = [
    '明确想要Native speaker口语课或发音纠正的人',
    '希望孩子接触外教课堂、但不想去高压备考城市的家庭',
    '需要商务沟通、面试表达和真实对话训练的成人学生',
    '还没有锁定具体学校，想先把Clark外教型学校列入候选的人',
  ];

  readonly pros = [
    'Clark有外教口语和家庭项目的学校候选，适合重视自然表达的人',
    '适合和CIP、EG、WE一起比较Native课比例、住宿和家庭友好度',
    '比直接定校更安全，可以先按课程目标建立候选池再核价',
  ];

  readonly cons = [
    'AELC相关公开资料不够稳定，不能只凭旧介绍或二手资料报名',
    'Native-focused不等于所有课程都是外教授课，必须确认具体课表',
    '费用、房型和年龄规则差异较大，报价前需要逐校复核',
    '如果目标是IELTS高压冲刺，可能不如考试型或Sparta学校直接',
  ];

  readonly faqs: FaqItem[] = [
    {
      question: 'AELC / Native-focused Clark Schools 是一所学校还是候选池？',
      answer:
        '这里按候选池处理。由于AELC和同类Clark外教型学校的公开资料不够稳定，建议先作为“外教口语方向”候选，再由顾问逐校确认当前招生状态。',
    },
    {
      question: '为什么不直接写具体学费？',
      answer:
        '因为费用会随具体学校、Native课比例、房型、周数和入学日变化，而且公开资料不足以可靠确认。页面保留费用模块，但标注为当期确认。',
    },
    {
      question: 'Native-focused学校一定比一般ESL好吗？',
      answer:
        '不一定。基础较弱的学生需要菲律宾老师一对一打底，再搭配Native课更稳；中高级学生或商务目标学生才更容易从高比例外教课受益。',
    },
    {
      question: '如果我想选Clark外教型学校，应该比较哪些学校？',
      answer:
        '建议同时比较CIP、EG、WE，以及AELC或其他Native-focused候选，重点看Native 1:1比例、实际老师、住宿、家庭规则、接机和总费用。',
    },
  ];

  readonly sources: SourceLink[] = [
    { label: 'iOutback 菲律宾游学资料参考', url: 'https://www.ioutback.com/' },
    { label: 'StudyTourA 菲律宾学校分类参考', url: 'https://www.studytoura.com/cebu-schools/' },
    { label: '格仲游学菲律宾学校比较参考', url: 'https://gezhong.com.tw/' },
    { label: '南崎菲律宾游学参考入口', url: 'https://www.nanqi.org/' },
    { label: '非凡游学菲律宾学校参考', url: 'https://feifanstudy.com/' },
  ];
}

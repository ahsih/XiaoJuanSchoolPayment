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
  selector: 'app-we-school',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './we-school.component.html',
  styleUrl: '../cia-school/cia-school.component.css',
})
export class WeSchoolComponent {
  readonly quickFacts: QuickFact[] = [
    { label: '学校名称', value: 'Clark WE Academy' },
    { label: '城市', value: 'Clark / Angeles City, Pampanga' },
    { label: '地址', value: 'Block 7 Lot 8 Fil-Am Friendship Highway, Angeles City' },
    { label: '创校与重启', value: '2016年创校，2022年6月新管理团队重启' },
    { label: '学校定位', value: 'Farm resort式校园、亲子友好、Native Mix、Golf / Swimming' },
    { label: '机场距离', value: '官网说明从Clark International Airport到学校约25分钟' },
  ];

  readonly courses: CourseItem[] = [
    {
      title: 'ESL Course',
      lessons: '菲律宾老师一对一与常规课程组合',
      text: '适合基础英语、口语开口、亲子家庭和第一次到Clark适应学习生活的学生。',
    },
    {
      title: 'Native Mix',
      lessons: '每日1-3节Native一对一，可搭配菲律宾老师课程',
      text: '官网强调由美国、加拿大等Native老师帮助发音、语调和自然表达，适合想学真实沟通英语的人。',
    },
    {
      title: 'Junior ESL',
      lessons: '面向小学到初中学生的青少年课程',
      text: '适合需要一对一基础训练、英语演讲展示和安全校园支持的学生。',
    },
    {
      title: 'Junior ESL Native',
      lessons: '青少年课程中加入Native一对一',
      text: '适合希望孩子体验自然发音和外教沟通的家庭，需按年龄和英文程度确认课程安排。',
    },
    {
      title: 'Guardian ESL',
      lessons: '陪读家长课程，官网说明每日3节菲律宾老师一对一',
      text: '适合家长陪同孩子学习，同时希望自己也保持英语输入和练习。',
    },
    {
      title: 'Golf / Swimming Add-on',
      lessons: '英语课程搭配高尔夫或游泳训练',
      text: '适合想把学习和活动体验结合的家庭或成人学生，附加费用需和课程报价分开核算。',
    },
  ];

  readonly priceRows: PriceRow[] = [
    {
      item: '英语课程 + 住宿',
      amount: '需按当期价目表确认',
      note: '官网公开页面未直接列出完整学费住宿表，建议按入学日、周数、房型和课程询价。',
    },
    {
      item: 'Golf私教课',
      amount: 'PHP 750 / session',
      note: '官网Golf页面列出Private Class价格；果岭费、球童费、球车费等现场另付。',
    },
    {
      item: 'Swimming私教课',
      amount: 'PHP 700 / session',
      note: '官网Swimming页面列出Private Class价格。',
    },
    {
      item: 'Swimming小组课',
      amount: 'PHP 600 / small group；PHP 500 / 3-5人',
      note: '适合亲子或多人同行，具体开课和人数需当期确认。',
    },
  ];

  readonly localFees: LocalFee[] = [
    { item: '注册费', amount: '需按当期报价确认' },
    { item: 'SSP / SSP E-card', amount: '菲律宾当地学习许可费用，按学校当期说明缴纳' },
    { item: '教材费', amount: '按课程和实际教材收取' },
    { item: '水电 / 设施 / 押金', amount: '按房型、周数和学校规则确认' },
    { item: '接机费', amount: 'Clark或Manila机场接送需分开确认' },
    { item: '活动附加费', amount: 'Golf、Swimming、外出活动需按项目确认' },
  ];

  readonly facilities = [
    'Farm resort式宽敞校园',
    '宿舍、教室、健身房、大型泳池和便利店集中在校园内',
    '校园内Kindergarten，面向4岁到学龄前儿童',
    'Native English teachers一对一课程',
    '大型户外泳池与运动设施',
    '校内高尔夫练习场',
    '高速Wi-Fi与较自由的成人外出规则',
    '未成年学生支持与家庭陪读体系',
  ];

  readonly audiences = [
    '亲子家庭、低龄儿童和第一次海外学习的学生',
    '想在更自由舒适的Clark环境里学习英语的人',
    '希望孩子有Kindergarten、Junior或Native课程选择的家庭',
    '想把英语学习和游泳、高尔夫、校园活动结合的人',
    '不适合高压Sparta，但仍希望保持规律课程的人',
  ];

  readonly pros = [
    '官网明确强调自由舒适、校园空间大、住宿和活动资源集中',
    'Native Mix可提供每日1-3节Native一对一课程',
    '亲子与低龄课程资料较完整，含校内Kindergarten和陪读家长课程',
    'Clark机场到校约25分钟，家庭和短期行程更方便',
    'Golf和Swimming附加项目价格在官网有公开参考',
  ];

  readonly cons = [
    '官网公开页面未直接列出完整学费住宿表，必须以当期报价确认',
    '成人自由度较高，不适合需要强制门禁和高压自习管理的学生',
    '亲子课程要逐项确认年龄、监护、房型、餐食、接送和医疗支持',
    'Golf和Swimming等活动费用需单独列预算，不能只看英语课程价',
  ];

  readonly faqs: FaqItem[] = [
    {
      question: 'Clark WE Academy适合亲子吗？',
      answer:
        '适合列入重点候选。官网特别强调Family Program、校内Kindergarten、家长课程和儿童安全支持，适合希望学习与生活体验结合的家庭。',
    },
    {
      question: 'Clark WE和EG、CIP怎么选？',
      answer:
        'WE更偏家庭、自由舒适和活动体验；CIP更强调Native一对一和口语纠音；EG更适合ESL、考试、Native和Golf组合一起比较。',
    },
    {
      question: 'WE适合高压备考吗？',
      answer:
        '如果目标是短期高压IELTS冲分，WE不是第一优先。它更适合亲子、口语、轻中强度学习和活动型体验。',
    },
    {
      question: '为什么费用表没有直接写学费？',
      answer:
        '因为官网公开页面没有直接露出完整学费住宿表。为避免误导，页面只列公开可确认的活动附加价，并提示英语课程和住宿需按当期报价核算。',
    },
  ];

  readonly sources: SourceLink[] = [
    { label: 'Clark WE Academy 官方网站', url: 'https://clarkweacademy.com/' },
    { label: 'Clark WE Academy Program', url: 'https://clarkweacademy.com/program.php' },
    { label: 'Clark WE Academy Curriculum', url: 'https://clarkweacademy.com/curriculum.php' },
    { label: 'Clark WE Academy Golf', url: 'https://clarkweacademy.com/golf.php' },
    { label: 'Clark WE Academy Swimming', url: 'https://clarkweacademy.com/swimming.php' },
    { label: 'iOutback 菲律宾游学资料参考', url: 'https://www.ioutback.com/' },
    { label: 'StudyTourA 菲律宾学校分类参考', url: 'https://www.studytoura.com/cebu-schools/' },
  ];
}

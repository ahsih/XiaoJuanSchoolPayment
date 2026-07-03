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
  selector: 'app-eg-school',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './eg-school.component.html',
  styleUrls: ['../school-detail-layout.css', './eg-school.component.css'],
})
export class EgSchoolComponent {
  readonly quickFacts: QuickFact[] = [
    { label: '学校名称', value: 'EG Academy' },
    { label: '城市', value: 'Clark / Angeles City, Pampanga' },
    { label: '地址', value: 'Lot 3 Friendship Highway, Cutcut, Angeles City' },
    { label: '学校定位', value: 'ESL、考试英语、Native课程、Golf & ESL综合型' },
    { label: '适合方向', value: '成人口语、考试基础、亲子家庭、高尔夫英语组合' },
    { label: '住宿', value: '校内宿舍为主，房型和空位按当期价目表确认' },
  ];

  readonly courses: CourseItem[] = [
    {
      title: 'ESL General',
      lessons: '常规ESL课程，适合稳步提升',
      text: '适合第一次到Clark学习、希望平衡课程强度和生活适应度的学生。',
    },
    {
      title: 'ESL Intensive',
      lessons: '更高密度的一对一和小组课组合',
      text: '适合短期希望提高口语、听力、阅读和写作基础的人。',
    },
    {
      title: 'ESL Sparta',
      lessons: '更强管理和学习节奏',
      text: '适合自律较弱、希望用校规和日程推动学习进度的学生。',
    },
    {
      title: 'TOEIC / TOEFL / IELTS + ESL',
      lessons: '考试英语搭配ESL基础训练',
      text: '适合需要先补基础，再进入分数目标或考试技巧训练的人。',
    },
    {
      title: 'Native Course',
      lessons: '外教口语、发音和表达训练',
      text: '适合重视自然表达、发音纠正和欧美沟通场景的学生。',
    },
    {
      title: 'Golf & ESL',
      lessons: '英语课程搭配高尔夫练习',
      text: '适合希望在Clark把语言学习和高尔夫体验一起安排的成人或家庭。',
    },
  ];

  readonly priceRows: PriceRow[] = [
    {
      room: 'ESL General 共享宿舍',
      oneWeek: '约 USD 556 起',
      fourWeeks: '约 USD 1,390 起',
      twelveWeeks: '约 USD 4,170 起',
      note: '页面起价参考，按房型、周数和优惠确认',
    },
    {
      room: 'ESL Intensive 共享宿舍',
      oneWeek: '约 USD 596 起',
      fourWeeks: '约 USD 1,490 起',
      twelveWeeks: '约 USD 4,470 起',
      note: '课程密度更高，适合短期强化',
    },
    {
      room: 'ESL Sparta 共享宿舍',
      oneWeek: '约 USD 636 起',
      fourWeeks: '约 USD 1,590 起',
      twelveWeeks: '约 USD 4,770 起',
      note: '管理更强，适合需要外部节奏的学生',
    },
    {
      room: 'IELTS / TOEIC + ESL',
      oneWeek: '约 USD 636 起',
      fourWeeks: '约 USD 1,590 起',
      twelveWeeks: '约 USD 4,770 起',
      note: '考试方向需确认开课、教材、模考和目标分',
    },
  ];

  readonly localFees: LocalFee[] = [
    { item: '注册费', amount: '通常约 USD 100-150，按当期价目表确认' },
    { item: 'SSP / SSP E-card', amount: '菲律宾当地学习许可费用，按学校当期说明缴纳' },
    { item: '教材费', amount: '按课程与实际教材收取' },
    { item: '水电 / 设施 / 管理费', amount: '按房型、周数和学校规则确认' },
    { item: '接机费', amount: 'Clark或Manila机场需分开确认' },
    { item: '押金 / 洗衣 / 签证延签', amount: '属于当地费用，预算需另列' },
  ];

  readonly facilities = [
    '校内宿舍和学习楼',
    '一对一教室与小组课教室',
    'ESL、考试、Native与Golf课程线',
    'EG Golf相关资源',
    '学生餐厅与生活支持',
    '周边生活环境和交通便利度适合家庭复核',
    '学校规则、日程和费用资料可按当期文件确认',
    'Clark机场和Angeles生活圈衔接方便',
  ];

  readonly audiences = [
    '想在Clark学习一般英语并保持舒适生活节奏的学生',
    '需要ESL基础搭配IELTS、TOEIC或TOEFL考试方向的人',
    '希望加入Native口语课、纠音或欧美表达训练的人',
    '亲子家庭或想要比碧瑶更轻松环境的学生',
    '希望英语课程搭配高尔夫体验的成人或家庭',
  ];

  readonly pros = [
    '课程类型较完整，ESL、考试、Native和Golf & ESL都能纳入比较',
    'Clark位置对家庭、短期学习和机场衔接比较友好',
    '学习强度选择比单一Sparta学校更弹性',
    '适合把生活便利度、课程组合和预算放在一起评估',
  ];

  readonly cons = [
    '具体房型、价格和优惠需按当期价目表确认，不能只看起价',
    '如果目标是高压IELTS冲刺，应同时比较碧瑶或更强考试型学校',
    'Native课程比例、授课老师和课程开放状态要逐项确认',
    'Golf & ESL属于组合型需求，需额外核对场地、交通、费用和日程',
  ];

  readonly faqs: FaqItem[] = [
    {
      question: 'EG Academy适合第一次去菲律宾游学吗？',
      answer:
        '适合列入候选。EG的课程强度选择比较弹性，Clark生活节奏也相对舒适，适合第一次游学、亲子家庭或不想一开始进入高压管理的人。',
    },
    {
      question: 'EG和CIP怎么选？',
      answer:
        '如果重点是Native一对一和外教口语，可以优先比较CIP；如果想要ESL、考试、Native和Golf组合，同时看生活便利度，可以把EG放进重点候选。',
    },
    {
      question: '页面费用是最终报价吗？',
      answer:
        '不是。这里是页面起价参考，最终要按入学日、周数、课程、房型、汇率、优惠、当地费用和学校当期回函重新计算。',
    },
    {
      question: 'EG适合雅思冲刺吗？',
      answer:
        '可以看考试+ESL方向，但如果目标是短期高压冲分，要同步比较更偏考试和Sparta管理的学校，并确认模考、保证班和老师配置。',
    },
  ];

  readonly sources: SourceLink[] = [
    { label: 'EG Academy 官方网站', url: 'https://egesl.com/' },
    { label: 'EG Academy 课程页面', url: 'https://egesl.com/curriculum/course/' },
    { label: 'iOutback 菲律宾游学资料参考', url: 'https://www.ioutback.com/' },
    { label: 'StudyTourA 菲律宾学校分类参考', url: 'https://www.studytoura.com/cebu-schools/' },
    { label: '格仲游学菲律宾学校比较参考', url: 'https://gezhong.com.tw/' },
  ];
}

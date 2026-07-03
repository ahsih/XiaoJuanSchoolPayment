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
  selector: 'app-help-school',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './help-school.component.html',
  styleUrls: ['../school-detail-layout.css', './help-school.component.css'],
})
export class HelpSchoolComponent {
  readonly quickFacts: QuickFact[] = [
    { label: '学校名称', value: 'HELP English Clark' },
    { label: '城市', value: 'Clark / Pampanga' },
    { label: '学校定位', value: '老牌HELP体系、ESL、IELTS、TOEIC、Business、Junior候选' },
    { label: '资料状态', value: 'Clark校区当前资料、价目表和开放状态需当期确认' },
    { label: '适合方向', value: '系统学习、考试路线、希望比较HELP体系管理风格的学生' },
    { label: '关键提醒', value: '不要只凭旧资料报名，需以学校回函和顾问复核为准' },
  ];

  readonly courses: CourseItem[] = [
    {
      title: 'ESL',
      lessons: '基础英语与口语综合训练',
      text: '适合希望建立听说读写基础、先适应菲律宾一对一教学模式的学生。',
    },
    {
      title: 'IELTS',
      lessons: '雅思备考方向，需确认模考和保证班规则',
      text: '适合有分数目标的学生，但必须核对当前Clark校区是否开放对应课程、入学门槛和考试安排。',
    },
    {
      title: 'TOEIC',
      lessons: '多益考试与职场英语基础',
      text: '适合求职、毕业门槛、企业内部测评或商务沟通基础需求。',
    },
    {
      title: 'Business English',
      lessons: '商务沟通、表达和场景英语',
      text: '适合职场人士、面试准备和需要会议、邮件、展示表达的人。',
    },
    {
      title: 'Junior',
      lessons: '青少年英语候选方向',
      text: '适合低龄或青少年家庭做候选，但年龄、监护、住宿和课后管理必须单独确认。',
    },
  ];

  readonly priceRows: PriceRow[] = [
    {
      item: '学费 + 住宿',
      amount: '需当期确认',
      note: '公开资料不足以写死价格，需按课程、房型、周数和入学日期向学校确认。',
    },
    {
      item: 'ESL / IELTS / TOEIC课程差价',
      amount: '需当期确认',
      note: '考试课程通常会因课程密度、模考和教材不同产生差异。',
    },
    {
      item: '当地费用',
      amount: '需当期确认',
      note: 'SSP、教材、水电、押金、接机、签证延签等需单独列预算。',
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
    '校区开放状态需当期确认',
    '住宿房型与宿舍规则需当期确认',
    'ESL、IELTS、TOEIC、Business、Junior课程需确认开课状态',
    '学习强度、门禁、自习和考勤规则需复核',
    '机场接送与抵达安排需按入学日确认',
    '未成年学生监护和医疗支持需重点确认',
  ];

  readonly audiences = [
    '偏好老牌学校体系、想比较HELP管理风格的学生',
    '希望在Clark候选池里加入考试路线学校的人',
    '需要ESL、IELTS、TOEIC或商务英语方向的人',
    '愿意先让顾问复核校区和价目表，再决定是否报名的人',
  ];

  readonly pros = [
    'HELP是菲律宾语言学校里较有历史的品牌体系，适合做老牌学校候选',
    '课程方向覆盖ESL、考试、商务和青少年需求',
    '适合和CIP、EG、WE以及碧瑶考试型学校做横向比较',
  ];

  readonly cons = [
    'Clark校区公开资料不够稳定，不能只凭旧页面或二手资料报名',
    '费用、房型、课程和校区开放状态必须当期确认',
    '如果目标是亲子舒适体验，WE或EG可能更容易先比较；如果目标是Native口语，CIP也应同时比较',
    '如果目标是高压备考，需把碧瑶学校一并纳入比较',
  ];

  readonly faqs: FaqItem[] = [
    {
      question: 'HELP English Clark现在可以直接报名吗？',
      answer:
        '不建议只看旧资料直接报名。应先确认当前Clark校区开放状态、价目表、课程、房型、接机和年龄规则，再决定是否报名。',
    },
    {
      question: 'HELP适合什么学生？',
      answer:
        '适合偏好老牌学校体系、想比较系统管理和考试路线的学生。若目标是亲子舒适或Native口语，应同时比较WE、EG和CIP。',
    },
    {
      question: '为什么页面没有写具体学费？',
      answer:
        '因为当前公开可读资料不足以可靠确认价格。为了避免误导，页面保留费用模块，但明确标注需以学校当期回函和顾问核价为准。',
    },
    {
      question: 'HELP Clark和碧瑶HELP怎么比较？',
      answer:
        '重点看校区是否开放、课程强度、考试资源、住宿规则和交通成本。若想要更强学习氛围或考试管理，也应把碧瑶学校一起比较。',
    },
  ];

  readonly sources: SourceLink[] = [
    { label: 'HELP English 官方入口', url: 'https://helpenglish.net/' },
    { label: 'iOutback 菲律宾游学资料参考', url: 'https://www.ioutback.com/' },
    { label: 'StudyTourA 菲律宾学校分类参考', url: 'https://www.studytoura.com/cebu-schools/' },
    { label: '格仲游学菲律宾学校比较参考', url: 'https://gezhong.com.tw/' },
  ];
}

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
  selector: 'app-enderun-school',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './enderun-school.component.html',
  styleUrl: '../cia-school/cia-school.component.css',
})
export class EnderunSchoolComponent {
  readonly quickFacts: QuickFact[] = [
    { label: '学校名称', value: 'Enderun Extension' },
    { label: '城市', value: 'Taguig / Metro Manila' },
    { label: '学校体系', value: 'Enderun Colleges continuing education / extension arm' },
    { label: '学习定位', value: 'Academic English、Business English、General English、短课与企业培训' },
    { label: '住宿', value: '非寄宿制，酒店、公寓或亲友住宿需另行安排' },
    { label: '费用', value: '课程费用、开课日期和名额需当期确认' },
  ];

  readonly courses: CourseItem[] = [
    {
      title: 'Academic English',
      lessons: '学术英语、课堂表达与升学衔接能力',
      text: '适合想在马尼拉体验学院环境，并为后续大学、商科、酒店管理或国际课程做英语补强的学生。',
    },
    {
      title: 'Business English',
      lessons: '商务沟通、会议表达与职场英文',
      text: '适合职场人士、企业派训、面试准备和希望把英语学习放进真实商务场景的人。',
    },
    {
      title: 'General English',
      lessons: '日常口语、听说读写基础和表达训练',
      text: '适合短期停留马尼拉、希望补强日常沟通和城市生活英语的成人学生。',
    },
    {
      title: 'Camps / Short Courses',
      lessons: '短课、营队和主题式课程',
      text: '适合假期、转机组合或只有短时间可学习的学生，需按当期日程确认是否开班。',
    },
    {
      title: 'Foreign Languages',
      lessons: '多语种或主题语言课程候选',
      text: '适合已经在马尼拉生活或工作，并希望选择更灵活语言培训的人群。',
    },
    {
      title: 'Corporate Training / Pearson VUE',
      lessons: '企业培训、证书或考试服务方向',
      text: '适合公司培训、职业能力提升或需要考试/证书服务的人，具体项目需逐项确认。',
    },
  ];

  readonly priceRows: PriceRow[] = [
    {
      item: '英语课程 / Short Courses',
      amount: '需当期确认',
      note: '公开资料没有稳定完整的英语课程价目表，需按课程、开课日、课时和班型确认。',
    },
    {
      item: '企业培训 / Corporate Training',
      amount: '需当期确认',
      note: '企业或团体项目通常按人数、目标、时长和定制内容报价。',
    },
    {
      item: '考试 / 证书服务',
      amount: '按项目确认',
      note: 'Pearson VUE或证书类服务需按考试项目、日期和报名规则确认费用。',
    },
  ];

  readonly localFees: LocalFee[] = [
    { item: '课程费', amount: '以Enderun当期回函为准' },
    { item: '教材 / 资料费', amount: '按课程和实际材料确认' },
    { item: '住宿', amount: '酒店、公寓或亲友住宿另行安排' },
    { item: '通勤交通', amount: '按住宿点到Taguig校区距离估算' },
    { item: '保险 / 签证停留', amount: '按学生国籍、停留周数和行程确认' },
    { item: '考试 / 证书费', amount: '如选择相关服务需单独确认' },
  ];

  readonly facilities = [
    'Enderun Colleges / Taguig学院环境与城市资源',
    '适合短课、继续教育、企业培训和成人学习的课程设置',
    '可围绕Academic English、Business English和General English做学习目标匹配',
    '非传统宿舍制ESL学校，住宿、餐食和通勤需另行规划',
    'Taguig / McKinley Hill一带适合商务、酒店、餐饮和城市体验组合',
    '考试、证书或Pearson VUE相关服务需按当期开放项目确认',
  ];

  readonly audiences = [
    '希望在马尼拉首都圈安排短期英语或商务英语的成人学生',
    '重视学院环境、城市资源、企业培训或学术衔接的人',
    '已经在马尼拉生活、出差或转机，想插入短课的人',
    '不需要校内宿舍和三餐管理，能自行安排住宿与通勤的人',
    '想把英语学习和酒店、商科、职场或城市体验结合的学生',
  ];

  readonly pros = [
    '位于Metro Manila / Taguig，城市资源、商务场景和交通衔接较强',
    'Enderun Colleges体系辨识度高，适合做学术、商务和短课方向候选',
    '课程逻辑更接近成人继续教育，适合短期和定制化需求',
    '适合与马尼拉住宿、实习、企业拜访或转机行程组合',
  ];

  readonly cons = [
    '不是宿舍制菲律宾语言学校，不适合想要校内住宿、三餐和全天管理的学生',
    '公开可读价目表不完整，费用不能像宿务/碧瑶ESL套餐那样直接估算',
    '开课日期、班型、课时和名额需要逐项确认',
    '如果目标是高压雅思冲刺或斯巴达管理，碧瑶或宿务考试型学校通常更适合优先比较',
  ];

  readonly faqs: FaqItem[] = [
    {
      question: 'Enderun Extension是传统菲律宾宿舍制ESL学校吗？',
      answer:
        '不是。它更适合归类为Enderun Colleges体系下的城市短课、继续教育和培训项目，住宿、餐食和通勤需要另行安排。',
    },
    {
      question: '页面为什么没有写固定学费？',
      answer:
        '因为公开资料没有稳定完整的英语课程价目表。为了避免误导，费用模块保留为“需当期确认”，报名时按课程、日期、课时和班型重新核价。',
    },
    {
      question: 'Enderun Extension适合什么学生？',
      answer:
        '适合成人、职场人士、企业培训、学术英语衔接、短期城市课程，以及希望把马尼拉商务或学院资源一起纳入行程的人。',
    },
    {
      question: 'Enderun和宿务、碧瑶学校怎么选？',
      answer:
        '如果想要城市短课、商务场景或马尼拉行程组合，可以看Enderun；如果想要住宿制、全天课程和学习管理，优先比较宿务、碧瑶或Clark。',
    },
  ];

  readonly sources: SourceLink[] = [
    { label: 'Enderun Extension 官方入口', url: 'http://www.enderunextension.com/' },
    { label: 'Enderun Colleges 官方网站', url: 'https://www.enderuncolleges.com/' },
    { label: 'Enderun Colleges 背景资料', url: 'https://en.wikipedia.org/wiki/Enderun_Colleges' },
    { label: 'StudyTourA 菲律宾学校分类参考', url: 'https://www.studytoura.com/cebu-schools/' },
  ];
}

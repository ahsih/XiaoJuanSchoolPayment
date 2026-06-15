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
  selector: 'app-berlitz-school',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './berlitz-school.component.html',
  styleUrl: '../cia-school/cia-school.component.css',
})
export class BerlitzSchoolComponent {
  readonly quickFacts: QuickFact[] = [
    { label: '学校名称', value: 'Berlitz Philippines' },
    { label: '城市', value: 'Makati / Metro Manila' },
    { label: '学校定位', value: '国际语言培训品牌、成人课程、少儿课程、企业培训与测评服务' },
    { label: '课程形式', value: 'Private、Group、Self-paced、Kids & Teens、Business Services' },
    { label: '住宿', value: '非寄宿制，住宿、餐食和通勤需另行安排' },
    { label: '费用', value: '官网未公开固定价目表，需按课程、级别、班型和当期排课报价' },
  ];

  readonly courses: CourseItem[] = [
    {
      title: 'Private Language Classes',
      lessons: '一对一课程，可线上或到学习中心上课',
      text: '适合希望快速提升、需要按个人目标定制内容的成人学生，例如商务沟通、旅行、面试或特定技能。',
    },
    {
      title: 'Group Language Classes',
      lessons: '小组课，固定节奏，成本更可控',
      text: '适合想要与同学互动、按固定课表推进，并用Berlitz Method从第一堂课开始练习表达的人。',
    },
    {
      title: 'Self-paced Online',
      lessons: '自学平台搭配线上练习',
      text: '适合时间不固定、希望用6个月或12个月订阅式学习节奏推进的人，需确认当前开放语言与辅导安排。',
    },
    {
      title: 'Kids & Teens',
      lessons: '儿童青少年线上或面授课程',
      text: '适合家庭在马尼拉安排课后或假期语言学习，年龄、时间、语言和班型需当期确认。',
    },
    {
      title: 'Corporate Language Training',
      lessons: '企业语言培训、线上/面授/混合模式',
      text: '适合公司为员工、管理层或外派人员安排语言和文化培训，可按行业、岗位和预算定制。',
    },
    {
      title: 'Testing / TELC / Business Communication',
      lessons: '语言测评、TELC备考考试、商务沟通训练',
      text: '适合需要语言能力评估、欧洲语言证书或组织沟通能力提升的人和企业客户。',
    },
  ];

  readonly priceRows: PriceRow[] = [
    {
      item: 'Private / One-on-One',
      amount: '需当期确认',
      note: '官网说明可线上或面授、按目标定制，最终按语言、级别、课时包和排课方式报价。',
    },
    {
      item: 'Group Classes',
      amount: '需当期确认',
      note: '小组课通常比一对一更经济，但需确认开课日期、人数、级别、语言和学习中心安排。',
    },
    {
      item: 'Kids & Teens',
      amount: '需当期确认',
      note: '儿童青少年课程需按年龄、线上/面授、私教/小组和课后时间确认。',
    },
    {
      item: 'Corporate Training',
      amount: '报价制 / 需核价',
      note: '企业培训按员工人数、岗位目标、行业词汇、线上/面授/混合交付和预算定制。',
    },
    {
      item: 'Testing / TELC',
      amount: '按项目确认',
      note: '语言测评、TELC备考和考试日期需分别确认报名费、材料费、考试费和名额。',
    },
  ];

  readonly localFees: LocalFee[] = [
    { item: '课程费', amount: '按课程、课时、级别、语言和班型确认' },
    { item: '测评 / 分级', amount: '入学前可能需要口语或水平测试' },
    { item: '教材 / 练习平台', amount: '按课程材料和学生门户使用规则确认' },
    { item: '住宿', amount: '酒店、公寓或亲友住宿另行安排' },
    { item: '通勤', amount: '按Makati学习中心或线上课程安排核算' },
    { item: '考试 / 证书', amount: 'TELC、测评或证书项目需单独报价' },
  ];

  readonly facilities = [
    'Makati学习中心与线上课程入口',
    'Berlitz Method沉浸式语言学习体系',
    '成人私教、小组课和自学线上课程',
    'Kids & Teens儿童青少年课程',
    '企业语言培训、商务沟通和跨文化训练',
    '语言测评、TELC考试准备和测试服务',
    '学生门户用于查看课程安排、线上课程和学习进度',
    '非寄宿制语言中心，住宿、接送和日常管理需自行规划',
  ];

  readonly audiences = [
    '想选择国际品牌语言培训中心的成人或家庭',
    '需要私教、小组课或线上自学组合的人',
    '在马尼拉短住、工作、出差或长期生活的人',
    '企业HR、培训负责人和需要员工语言/文化培训的公司',
    '需要TELC、语言测评或商务沟通训练的人',
  ];

  readonly pros = [
    '国际品牌辨识度高，课程体系和学习方法清晰',
    '成人、少儿、企业、测评和TELC方向覆盖面广',
    '可选线上、面授、私教、小组和自学组合，灵活度高',
    'Makati位置适合商务人士和城市型学习安排',
  ];

  readonly cons = [
    '不是宿舍制ESL学校，不适合想要校内住宿、三餐和全天管理的人',
    '官网未公开固定完整价目表，费用必须按课程方案核价',
    '若目标是高强度雅思、多益或斯巴达管理，宿务/碧瑶考试型学校通常更适合优先比较',
    '多人小组课是否合适取决于级别匹配、开课日期和同班人数',
  ];

  readonly faqs: FaqItem[] = [
    {
      question: 'Berlitz Philippines是传统菲律宾游学学校吗？',
      answer:
        '不是。它更像马尼拉城市语言培训中心，适合成人、少儿、企业培训、语言测评和证书方向；住宿、餐食和通勤需要另行安排。',
    },
    {
      question: '为什么没有写固定学费？',
      answer:
        'Berlitz Philippines官网没有公开完整固定价目表。不同语言、级别、课时、私教/小组、线上/面授和企业定制都会影响费用，所以必须当期核价。',
    },
    {
      question: 'Berlitz适合孩子吗？',
      answer:
        '可以作为儿童青少年语言课程候选。需要确认年龄、语言、线上或面授、私教或小组、课后时间和家长接送安排。',
    },
    {
      question: 'Berlitz和American English怎么选？',
      answer:
        'Berlitz更偏国际品牌、课程体系、测评和多语言服务；American English更偏成人口语、商务沟通和定制训练。最终看学习目标、预算、上课位置和排课。',
    },
  ];

  readonly sources: SourceLink[] = [
    { label: 'Berlitz Philippines 官方网站', url: 'https://www.berlitzph.com/' },
    { label: 'Berlitz Adults课程', url: 'https://www.berlitzph.com/adults/' },
    { label: 'Berlitz Private课程', url: 'https://www.berlitzph.com/adults/private/' },
    { label: 'Berlitz Group课程', url: 'https://www.berlitzph.com/adults/groups/' },
    { label: 'Berlitz Kids & Teens', url: 'https://www.berlitzph.com/kids-teens/' },
    { label: 'Berlitz Corporate Language Training', url: 'https://www.berlitzph.com/business-services/language-training/' },
    { label: 'Berlitz Testing and Assessment', url: 'https://www.berlitzph.com/business-services/testing-and-assessment/' },
    { label: 'Berlitz Philippines Contact / Makati', url: 'https://www.berlitzph.com/contact/' },
  ];
}

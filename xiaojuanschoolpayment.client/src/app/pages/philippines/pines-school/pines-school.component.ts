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
  mainCampus: string;
  ieltsCampus: string;
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
  selector: 'app-pines-school',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './pines-school.component.html',
  styleUrls: [
    '../cia-school/cia-school.component.css',
    './pines-school.component.css',
  ],
})
export class PinesSchoolComponent {
  readonly quickFacts: QuickFact[] = [
    { label: '学校名称', value: 'PINES International Academy' },
    { label: '城市', value: '菲律宾碧瑶 Baguio' },
    { label: '创校时间', value: '2001年' },
    { label: '校区', value: 'Main Campus / IELTS Campus' },
    { label: '学校类型', value: '半斯巴达，可按课程选择更强管理' },
    { label: '适合方向', value: 'ESL、口语强化、IELTS、TOEIC、亲子/青少年' },
  ];

  readonly courses: CourseItem[] = [
    {
      title: 'Power Speaking',
      lessons: '4节一对一 + 4节小组课 / 天',
      text: 'Main Campus代表课程，适合想把口语、听力、写作和讨论能力一起拉起来的初中级学生。',
    },
    {
      title: 'Intensive ESL',
      lessons: '5节一对一 + 2节小组课 / 天',
      text: '适合短中期想增加一对一纠音、表达训练和学习反馈的学生，强度比基础ESL更高。',
    },
    {
      title: 'Power ESL 4 / 5 / 7',
      lessons: '每天4-7节一对一，按强度选择',
      text: '适合目标明确、希望把课程集中在一对一训练的人。数字越高，一对一比例和学习负荷越重。',
    },
    {
      title: 'TOEIC / IELTS',
      lessons: '考试科目一对一 + 小组课 + 模考复盘',
      text: 'TOEIC可在Main Campus衔接；IELTS Campus更适合中高级学生、升学或技术移民分数目标。',
    },
    {
      title: 'IELTS Guarantee',
      lessons: '保证班通常8周起，含严格出勤与模考要求',
      text: '适合已有基础分、目标分数明确、能接受高强度自习和周测的人。需以当期入学门槛为准。',
    },
    {
      title: 'Junior / Parents',
      lessons: '青少年5节一对一+2节特殊课；家长课约3节一对一',
      text: '适合亲子或青少年短中期学习，但要先确认年龄、房型、监护与具体开课日期。',
    },
  ];

  readonly priceRows: PriceRow[] = [
    {
      item: 'Main Campus 4周成人ESL参考',
      mainCampus: '约USD 1,420-2,470',
      ieltsCampus: '-',
      note: '按Light ESL到Power ESL 7、六人房到单人房A估算区间。',
    },
    {
      item: 'Power Speaking 4周',
      mainCampus: 'USD 1,500-2,180',
      ieltsCampus: '-',
      note: '六人房至单人房A；适合口语强化。',
    },
    {
      item: 'Parents Course 4周',
      mainCampus: 'USD 1,450-1,620',
      ieltsCampus: '-',
      note: '四人房、双人房B、双人房A参考。',
    },
    {
      item: 'Junior Family Course 4周',
      mainCampus: 'USD 2,200-2,370',
      ieltsCampus: '-',
      note: '四人房至双人房A参考，需确认年龄与家庭房安排。',
    },
    {
      item: 'IELTS入门 / IELTS课程 4周',
      mainCampus: '-',
      ieltsCampus: 'USD 1,680-2,300',
      note: '四人房至单人房B，按入门或一般IELTS课程区间。',
    },
    {
      item: 'IELTS保证班',
      mainCampus: '-',
      ieltsCampus: '8周USD 4,160-5,200；12周USD 5,940-7,500',
      note: '需满足入学分数、出勤率、模考与校规要求。',
    },
  ];

  readonly localFees: LocalFee[] = [
    {
      item: '注册费',
      amount: 'Main Campus约USD 100；部分报价源显示USD 150，需按当期确认',
    },
    { item: 'SSP特别学习许可', amount: '约PHP 7,800' },
    { item: 'SSP E-card', amount: '约PHP 4,500' },
    { item: '教材费', amount: '约PHP 1,100-1,500起，按课程和教材购买' },
    { item: '水电费', amount: '约PHP 3,000起，按学校当期规则' },
    { item: 'ACR I-Card', amount: '长期学习通常约PHP 3,500起' },
    { item: '接机费', amount: '约PHP 2,500-3,000起，按机场与日期确认' },
    { item: '保证金 / 洗衣', amount: '保证金约PHP 4,000；洗衣约PHP 150 / 7KG' },
  ];

  readonly facilities = [
    '校内宿舍与学习楼',
    '全校区无线网络',
    '学生餐厅与咖啡/小商店',
    '自习教室、图书馆、视听教室',
    '医护室与学生支持',
    '健身设备与乒乓球等休闲空间',
    'TOEIC / IELTS考试与备考资源',
    'Main Campus周边餐厅、ATM、便利店与市区交通',
  ];

  readonly audiences = [
    '想在碧瑶高学习氛围里专心提高英文的学生',
    '英文初级到中级，想先用ESL或口语课程建立开口信心的人',
    '目标是IELTS、TOEIC、升学、移民或毕业门槛的备考学生',
    '可以接受门禁、自习、测试和较密集作息的人',
    '亲子或青少年学生，但需要提前核对年龄、房型和入学日',
  ];

  readonly pros = [
    '碧瑶代表性学校，中文游学平台普遍把PINES列为热门备考与口语学校',
    'Main Campus适合初中级学生，IELTS Campus适合中高级考试目标，分流清楚',
    '课程强度可从轻量ESL到一对一更高的Power ESL 7逐步选择',
    'Main Campus生活机能相对方便，附近有餐厅、ATM和便利店，距离市区约10分钟车程',
    '有明确测试、自习和管理制度，适合需要外部节奏推动的学生',
  ];

  readonly cons = [
    '碧瑶从马尼拉机场转车通常需要约6小时以上，抵达疲劳度高于宿务',
    '学校节奏偏学习导向，不适合只想轻松度假或周末活动很多的人',
    'IELTS Campus对英文基础、出勤、模考和校规要求更明确，报名门槛需逐项确认',
    '热门房型、寒暑假和保证班名额可能紧张，价格与优惠要以当期报价为准',
    'Main Campus和IELTS Campus定位不同，不能只看PINES校名就决定课程',
  ];

  readonly faqs: FaqItem[] = [
    {
      question: 'PINES适合零基础学生吗？',
      answer:
        '适合先看Main Campus的ESL或口语方向。IELTS Campus更偏中高级和考试目标，不建议完全零基础直接进入保证班。',
    },
    {
      question: 'Main Campus和IELTS Campus怎么选？',
      answer:
        '想提升基础口语、听说读写和学习习惯，优先看Main Campus；已有雅思目标分或升学/移民分数压力，再看IELTS Campus。',
    },
    {
      question: '页面价格是最终价格吗？',
      answer:
        '不是。这里是公开来源整理的参考价，最终仍要按入学日、课程、房型、周数、汇率、优惠和当地费用重新核算。',
    },
    {
      question: 'PINES和宿务学校相比，最大差别是什么？',
      answer:
        'PINES更偏学习集中和考试/口语强化；宿务学校通常生活体验和海岛活动更丰富。自律较弱或目标分明确的人更适合优先看PINES。',
    },
  ];
}

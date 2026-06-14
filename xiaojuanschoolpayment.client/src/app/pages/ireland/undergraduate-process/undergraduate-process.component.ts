import { Component } from '@angular/core';
import { IrelandPageContentComponent } from '../page-content/ireland-page-content.component';

@Component({
  selector: 'app-undergraduate-process',
  standalone: true,
  imports: [IrelandPageContentComponent],
  templateUrl: './undergraduate-process.component.html',
})
export class UndergraduateProcessComponent {
  readonly page = {
    title: '本科课程申请',
    englishTitle: 'Undergraduate Course Application',
    audience: '流程页',
    keywords: '本科申请、课程筛选、入学要求、申请材料、录取确认、签证准备',
    heroImage:
      'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1200&q=80',
    summary:
      '本科课程申请页面用于把学生从“想去爱尔兰读本科”带到可执行的申请流程。重点是先确认课程方向、入学要求和英语要求，再整理材料、递交申请、跟进录取、安排住宿和签证。',
    metrics: [
      { value: '选课', label: '先确认专业方向、院校类型和城市偏好' },
      { value: '材料', label: '成绩单、毕业证明、语言成绩和护照信息要提前准备' },
      { value: '录取', label: '收到 offer 后再推进押金、住宿和签证节点' },
    ],
    cardsTitle: '本科申请流程',
    cards: [
      {
        icon: 'explore',
        title: '明确目标课程',
        text: '先判断学生适合直入本科、预科衔接还是转学分路径，再根据专业、预算和城市筛选院校。',
      },
      {
        icon: 'fact_check',
        title: '核对入学条件',
        text: '不同院校和专业对成绩、英语、数学、作品集或面试要求不同，申请前要逐项核对。',
      },
      {
        icon: 'description',
        title: '整理申请材料',
        text: '常见材料包括成绩单、在读或毕业证明、语言成绩、护照、申请表和必要的个人陈述。',
      },
      {
        icon: 'task_alt',
        title: '跟进录取后事项',
        text: '拿到录取后要确认接受期限、押金、学费支付、住宿申请、保险、签证和行前安排。',
      },
    ],
    guideTitle: '适合放在申请菜单下',
    guideText:
      '这个页面比“爱尔兰本科申请”服务页更偏流程说明，适合用户已经有本科意向后，用来理解从选课到入学之间每一步该准备什么。',
    checklist: [
      '确认学生目前是普高、A-Level、IB、预科、大专还是本科在读。',
      '确认目标专业是否有作品集、数学、面试或特定科目要求。',
      '把申请截止日期、补件日期、押金日期和签证时间线放在同一张表里。',
      '录取后同步规划住宿、保险、学费支付和行前准备。',
    ],
    sources: [
      {
        label: 'Education in Ireland - How Do I Apply',
        url: 'https://www.educationinireland.com/en/how-do-i-apply-/',
      },
      {
        label: 'Irish Immigration - Coming to Study in Ireland',
        url: 'https://www.irishimmigration.ie/coming-to-study-in-ireland/',
      },
      {
        label: '爱尔兰教育服务中心 IESC',
        url: 'https://www.irelandeducation.cn/chinese-partner-school/',
      },
    ],
  };
}

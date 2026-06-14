import { Component } from '@angular/core';
import { IrelandPageContentComponent } from '../../ireland/page-content/ireland-page-content.component';

@Component({
  selector: 'app-ireland-application-timeline',
  standalone: true,
  imports: [IrelandPageContentComponent],
  templateUrl: './ireland-application-timeline.component.html',
})
export class IrelandApplicationTimelineComponent {
  readonly page = {
    title: '爱尔兰申请时间线',
    englishTitle: 'Ireland Application Timeline',
    audience: 'SEO指南页，强决策内容',
    keywords: '爱尔兰申请时间、申请截止、offer、押金、住宿、签证、入学季',
    heroImage:
      'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=1200&q=80',
    summary:
      '爱尔兰申请时间线需要把选校、材料、递交、录取、押金、住宿、签证和行前准备放在同一个节奏里。热门专业和热门学校建议尽早准备，避免后期补件和住宿紧张。',
    metrics: [
      { value: '提前', label: '建议至少提前6到12个月规划正式申请' },
      { value: 'Offer', label: '收到录取后要按期限确认和支付押金' },
      { value: '签证', label: '接受录取后尽快进入签证和住宿准备' },
    ],
    cardsTitle: '申请时间线关键节点',
    cards: [
      {
        icon: 'search',
        title: '选校选专业',
        text: '先确认课程层级、专业方向、入学要求、英语要求和预算范围。',
      },
      {
        icon: 'description',
        title: '材料准备',
        text: '成绩单、在读/毕业证明、语言成绩、简历、推荐信和个人陈述需要提前整理。',
      },
      {
        icon: 'mark_email_read',
        title: '录取确认',
        text: '收到有条件或无条件录取后，按学校要求补件、接受offer并支付押金。',
      },
      {
        icon: 'flight_takeoff',
        title: '签证与行前',
        text: '住宿、保险、签证、机票和抵达注册要在入学前连续推进。',
      },
    ],
    guideTitle: '为什么时间线很重要',
    guideText:
      '很多申请问题不是条件不够，而是开始太晚。时间线页面能帮助用户判断现在处于哪个阶段，以及下一步该补什么。',
    checklist: [
      '确认目标入学季和课程截止日期。',
      '准备中英文成绩单、学历证明、语言成绩和文书材料。',
      '收到offer后记录押金、补件、住宿和签证时间节点。',
      '签证和住宿不要等到临近开学才开始处理。',
    ],
    sources: [
      { label: 'Education in Ireland - The Application Process', url: 'https://www.educationinireland.com/en/plan-your-study-abroad/the-application-process/' },
      { label: 'Irish Immigration - Coming to Study in Ireland', url: 'https://www.irishimmigration.ie/coming-to-study-in-ireland/' },
      { label: 'Education in Ireland - Student Accommodation', url: 'https://www.educationinireland.com/en/plan-your-study-abroad/student-accommodation/' },
    ],
  };
}

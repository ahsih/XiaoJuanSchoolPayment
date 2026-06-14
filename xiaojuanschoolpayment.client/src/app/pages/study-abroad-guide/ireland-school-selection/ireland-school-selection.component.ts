import { Component } from '@angular/core';
import { IrelandPageContentComponent } from '../../ireland/page-content/ireland-page-content.component';

@Component({
  selector: 'app-ireland-school-selection',
  standalone: true,
  imports: [IrelandPageContentComponent],
  templateUrl: './ireland-school-selection.component.html',
})
export class IrelandSchoolSelectionComponent {
  readonly page = {
    title: '爱尔兰院校选择指南',
    englishTitle: 'Ireland School Selection Guide',
    audience: 'SEO指南页，连接院校库',
    keywords: '爱尔兰院校、综合大学、理工大学、私立学院、语言学校、NCI',
    heroImage:
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80',
    summary:
      '选择爱尔兰院校时，不应只看排名。更重要的是专业匹配、入学要求、城市成本、实习就业资源、奖学金、住宿和未来签证/就业规划。',
    metrics: [
      { value: '类型', label: '综合大学、理工大学、私立学院和语言学校定位不同' },
      { value: '专业', label: '专业匹配比单纯排名更影响录取和就业' },
      { value: '城市', label: '都柏林、科克、高威等城市成本和机会不同' },
    ],
    cardsTitle: '院校选择维度',
    cards: [
      {
        icon: 'account_balance',
        title: '院校类型',
        text: '综合大学偏学术与研究，理工大学偏应用和行业连接，私立学院常见商科和职业导向课程。',
      },
      {
        icon: 'hub',
        title: '专业匹配',
        text: '先看课程模块、入学背景、是否接受跨专业、是否需要作品集或相关经验。',
      },
      {
        icon: 'location_city',
        title: '城市和预算',
        text: '城市会影响住宿、生活成本、兼职机会、实习机会和毕业后求职方向。',
      },
      {
        icon: 'workspace_premium',
        title: '奖学金和就业',
        text: '奖学金、职业服务、企业连接和毕业生去向都可以作为比较维度。',
      },
    ],
    guideTitle: '如何连接院校库',
    guideText:
      '这个页面适合作为院校库前置页，先教用户判断“怎样的院校适合我”，再引导到具体综合大学、理工大学、私立学院或推荐院校页面。',
    checklist: [
      '先确定专业方向和申请层级，再筛选院校。',
      '不要只看排名，要看课程模块、录取要求和就业方向。',
      '同时比较城市成本、住宿便利和生活适应度。',
      '把冲刺、匹配和保底院校分层规划。',
    ],
    sources: [
      { label: 'Education in Ireland - Where can I study', url: 'https://www.educationinireland.com/en/where-can-i-study/' },
      { label: 'Education in Ireland - Introduction to Institutions', url: 'https://www.irelandeducation.cn/introduction-institutions/' },
      { label: 'Quality and Qualifications Ireland', url: 'https://www.qqi.ie/' },
    ],
  };
}

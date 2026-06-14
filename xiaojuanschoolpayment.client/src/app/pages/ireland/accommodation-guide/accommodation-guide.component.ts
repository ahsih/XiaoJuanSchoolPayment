import { Component } from '@angular/core';
import { IrelandPageContentComponent } from '../page-content/ireland-page-content.component';

@Component({
  selector: 'app-accommodation-guide',
  standalone: true,
  imports: [IrelandPageContentComponent],
  templateUrl: './accommodation-guide.component.html',
})
export class AccommodationGuideComponent {
  readonly page = {
    title: '住宿指南',
    englishTitle: 'Ireland Accommodation Guide',
    audience: '指南页',
    keywords: '学生宿舍、寄宿家庭、校外租房、住宿预算、通勤、安全',
    heroImage:
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
    summary:
      '住宿指南页面帮助学生理解爱尔兰常见住宿方式和筛选重点。不同城市和学校住宿紧张程度不同，建议学生尽早确认校内宿舍、寄宿家庭或校外租房方案。',
    metrics: [
      { value: '宿舍', label: '适合希望通勤简单和校园支持更集中的学生' },
      { value: '寄宿', label: '适合低龄、短期或希望提高生活英语的学生' },
      { value: '租房', label: '需要重点核对合同、押金、安全和交通' },
    ],
    cardsTitle: '住宿方式怎么选',
    cards: [
      {
        icon: 'apartment',
        title: '校内或学生公寓',
        text: '适合优先考虑通勤、同学社交和管理便利的学生，但名额通常需要尽早申请。',
      },
      {
        icon: 'home',
        title: '寄宿家庭',
        text: '适合短期课程、低龄学生或希望融入英语生活环境的学生，要确认餐食、距离和家庭规则。',
      },
      {
        icon: 'location_on',
        title: '校外租房',
        text: '校外租房选择更灵活，但要谨慎核对房源真实性、合同、押金、交通和周边安全。',
      },
      {
        icon: 'payments',
        title: '总预算核算',
        text: '住宿预算不只是月租，还要考虑押金、水电网、交通、床品、餐食和入住前临时住宿。',
      },
    ],
    guideTitle: '咨询时要先问清楚',
    guideText:
      '住宿是爱尔兰留学体验里非常关键的一环。页面需要帮助学生把预算、城市、通勤、安全、生活习惯和开学时间一起考虑。',
    checklist: [
      '确认学校是否提供住宿申请入口和申请截止日期。',
      '比较宿舍、寄宿家庭、学生公寓和校外租房的总成本。',
      '校外租房不要在未核实房源前匆忙转账或支付大额押金。',
      '提前准备到达初期的临时住宿和交通安排。',
    ],
    sources: [
      {
        label: 'Education in Ireland - Living in Ireland',
        url: 'https://www.educationinireland.com/en/living-in-ireland/',
      },
      {
        label: 'Irish Council for International Students',
        url: 'https://www.internationalstudents.ie/',
      },
      {
        label: '爱尔兰教育服务中心 IESC',
        url: 'https://www.irelandeducation.cn/chinese-partner-school/',
      },
    ],
  };
}

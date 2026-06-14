import { Component } from '@angular/core';
import { IrelandPageContentComponent } from '../page-content/ireland-page-content.component';

@Component({
  selector: 'app-health-safety',
  standalone: true,
  imports: [IrelandPageContentComponent],
  templateUrl: './health-safety.component.html',
})
export class HealthSafetyComponent {
  readonly page = {
    title: '健康与安全',
    englishTitle: 'Health And Safety In Ireland',
    audience: '指南页',
    keywords: '健康保险、GP、紧急电话、安全、心理支持、学生服务',
    heroImage:
      'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80',
    summary:
      '健康与安全页面用于提醒学生在出发前安排保险、常用药、紧急联系人和学校支持资源。医疗制度、保险要求和签证要求可能变化，具体以学校和官方说明为准。',
    metrics: [
      { value: '保险', label: '国际学生应提前确认医疗保险要求' },
      { value: 'GP', label: '抵达后了解当地医生和校内健康服务' },
      { value: '112/999', label: '紧急情况可使用爱尔兰紧急电话' },
    ],
    cardsTitle: '健康与安全准备',
    cards: [
      {
        icon: 'health_and_safety',
        title: '医疗保险',
        text: '申请和入学前要确认学校、签证和个人需求对应的保险要求与保障范围。',
      },
      {
        icon: 'local_hospital',
        title: '就医路径',
        text: '抵达后了解校内健康中心、当地GP、药房和紧急医疗服务的位置与联系方式。',
      },
      {
        icon: 'support_agent',
        title: '心理与学习支持',
        text: '遇到压力、适应困难或学习问题时，优先联系学校学生支持、导师或国际学生办公室。',
      },
      {
        icon: 'shield',
        title: '日常安全',
        text: '外出、夜间通勤、租房、转账和社交活动都要保持基本安全意识，保存紧急联系人。',
      },
    ],
    guideTitle: '适合家长关注',
    guideText:
      '这一页可以让家长看到你们不仅做申请，也关注学生抵达后的健康、安全和适应支持。内容要务实，不要制造恐慌。',
    checklist: [
      '确认学生医疗保险、常用药、过敏史和英文医疗说明。',
      '保存学校紧急电话、住宿联系人、当地报警急救电话和顾问联系方式。',
      '抵达后尽早熟悉校内健康中心、药房和附近医院位置。',
      '提醒学生遇到诈骗、租房纠纷或安全问题时及时求助。',
    ],
    sources: [
      {
        label: 'Education in Ireland - Living in Ireland',
        url: 'https://www.educationinireland.com/en/living-in-ireland/',
      },
      {
        label: 'Health Service Executive',
        url: 'https://www.hse.ie/',
      },
      {
        label: 'Irish Council for International Students',
        url: 'https://www.internationalstudents.ie/',
      },
    ],
  };
}

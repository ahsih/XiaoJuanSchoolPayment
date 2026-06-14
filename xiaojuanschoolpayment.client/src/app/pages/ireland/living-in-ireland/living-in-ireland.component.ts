import { Component } from '@angular/core';
import { IrelandPageContentComponent } from '../page-content/ireland-page-content.component';

@Component({
  selector: 'app-living-in-ireland',
  standalone: true,
  imports: [IrelandPageContentComponent],
  templateUrl: './living-in-ireland.component.html',
})
export class LivingInIrelandComponent {
  readonly page = {
    title: '住在爱尔兰',
    englishTitle: 'Living In Ireland',
    audience: '指南页',
    keywords: '爱尔兰生活、城市选择、生活成本、交通、住宿、学生适应',
    heroImage:
      'https://images.unsplash.com/photo-1549918864-48ac978761a4?auto=format&fit=crop&w=1200&q=80',
    summary:
      '住在爱尔兰页面用于帮助学生建立真实生活预期：城市节奏、住宿、交通、生活成本、天气、社交和校园支持都会影响留学体验。',
    metrics: [
      { value: '城市', label: '都柏林、科克、高威等城市生活节奏不同' },
      { value: '预算', label: '住宿通常是生活预算中最需要提前规划的部分' },
      { value: '适应', label: '语言、天气、交通和社交都需要过渡期' },
    ],
    cardsTitle: '生活适应重点',
    cards: [
      {
        icon: 'map',
        title: '城市与通勤',
        text: '选校时要把校区位置、住宿区域、公交通勤和日常购物一起考虑。',
      },
      {
        icon: 'cloud',
        title: '天气与日常',
        text: '爱尔兰气候温和但多雨，学生要准备适合步行、通勤和多变天气的衣物。',
      },
      {
        icon: 'groups',
        title: '校园支持',
        text: '学校通常会提供国际学生办公室、迎新活动、社团和学习支持，适合新生主动使用。',
      },
      {
        icon: 'savings',
        title: '生活成本',
        text: '预算应覆盖住宿、餐食、交通、手机、保险、教材、社交和紧急备用金。',
      },
    ],
    guideTitle: '适合承接生活疑虑',
    guideText:
      '这一页可以降低学生和家长对海外生活的焦虑。与其只说“安全友好”，更应具体说明到达前后要准备什么、怎么适应、哪里能获得帮助。',
    checklist: [
      '确认目标城市的住宿、交通和生活成本是否适合预算。',
      '提前了解学校迎新、国际学生支持和紧急联系方式。',
      '准备银行卡、手机卡、保险、交通卡和基础生活用品。',
      '抵达初期先熟悉校区、住处、超市、医院和交通路线。',
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

import { Component } from '@angular/core';
import { StudyTourPageContentComponent } from '../page-content/study-tour-page-content.component';

@Component({
  selector: 'app-exclusive-offers',
  standalone: true,
  imports: [StudyTourPageContentComponent],
  templateUrl: './exclusive-offers.component.html',
})
export class ExclusiveOffersComponent {
  readonly page = {
    title: '思达启航独家最新优惠',
    englishTitle: 'STAR Exclusive Offers',
    keywords: '限时优惠、学校活动、游学套餐、奖学金、早鸟价',
    heroImage:
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
    intro:
      '海外游学的优惠和限时活动会随学校、开课日期、住宿房型、报名周期和名额变化。告诉顾问你的目标和出发时间，我们帮你匹配当期有效的优惠，并确认有效期。',
    highlights: [
      { value: '限时', label: '活动价格和名额需要按报名日期确认' },
      { value: '匹配', label: '优惠要和学生目标、课程长度和住宿条件一起看' },
      { value: '确认', label: '以学校最终确认和书面报价为准' },
    ],
    cardsTitle: '常见的优惠类型',
    cards: [
      {
        icon: 'campaign',
        title: '限时活动',
        text: '学校或项目的阶段性优惠，例如注册费减免、课程折扣、住宿升级或早鸟价。',
      },
      {
        icon: 'fact_check',
        title: '有效期确认',
        text: '游学优惠通常受开课日期、课程周数、房型和名额影响，建议以顾问确认后的书面报价为准。',
      },
      {
        icon: 'compare_arrows',
        title: '多国对比',
        text: '可以先看优惠，再按国家、预算、英语环境和签证难度筛选适合的项目。',
      },
      {
        icon: 'support_agent',
        title: '顾问帮你做方案',
        text: '告诉顾问出发时间、年龄、目标和预算，我们帮你挑出适合的项目和优惠。',
      },
    ],
    checklistTitle: '看优惠时注意',
    checklist: [
      '确认优惠适用的国家、学校、课程、报名截止日期和开课日期。',
      '优惠都有有效期，最终以学校确认为准。',
      '把优惠和自己是否适合一起看，不要只按最低价选择。',
      '名额有限的活动，建议尽早咨询确认。',
    ],
    sources: [
      { label: 'Education in Ireland', url: 'https://www.educationinireland.com/en/' },
      { label: 'Study UK', url: 'https://study-uk.britishcouncil.org/' },
      { label: 'EduCanada', url: 'https://www.educanada.ca/index.aspx?lang=eng' },
    ],
  };
}

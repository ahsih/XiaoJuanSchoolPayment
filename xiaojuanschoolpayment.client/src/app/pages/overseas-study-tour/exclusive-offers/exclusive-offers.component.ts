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
    title: '思达独家最新优惠',
    englishTitle: 'STAR Exclusive Offers',
    positioning: '活动页，适合作为放第一的转化入口',
    keywords: '限时优惠、学校活动、游学套餐、奖学金、早鸟价',
    heroImage:
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
    intro:
      '这个页面用于承接所有海外游学的最新优惠和限时活动。优惠通常会随学校、开课日期、住宿房型、报名周期和名额变化，页面重点应放在“先咨询、再匹配、确认有效期”。',
    highlights: [
      { value: '限时', label: '活动价格和名额需要按报名日期确认' },
      { value: '匹配', label: '优惠要和学生目标、课程长度和住宿条件一起看' },
      { value: '转化', label: '适合作为海外游学菜单第一入口' },
    ],
    cardsTitle: '优惠页可以承接什么',
    cards: [
      {
        icon: 'campaign',
        title: '限时活动',
        text: '用于展示学校或项目阶段性优惠，例如注册费减免、课程折扣、住宿升级或早鸟价。',
      },
      {
        icon: 'fact_check',
        title: '有效期确认',
        text: '游学优惠通常受开课日期、课程周数、房型和名额影响，建议以顾问确认后的书面报价为准。',
      },
      {
        icon: 'compare_arrows',
        title: '多国对比',
        text: '用户可以先从优惠入口进来，再按国家、预算、英语环境和签证难度筛选适合项目。',
      },
      {
        icon: 'support_agent',
        title: '强 CTA 转化',
        text: '页面应引导用户提交咨询，便于顾问按出发时间、年龄、目标和预算做方案。',
      },
    ],
    checklistTitle: '上线前建议准备',
    checklist: [
      '每条优惠注明适用国家、学校、课程、报名截止日期和开课日期。',
      '避免写永久有效价格，所有活动需保留“以学校最终确认为准”。',
      '把优惠和适合人群一起写，避免用户只按最低价选择。',
      '后续可扩展成可筛选活动列表，支持国家、课程和出发时间筛选。',
    ],
    sources: [
      { label: 'Education in Ireland', url: 'https://www.educationinireland.com/en/' },
      { label: 'Study UK', url: 'https://study-uk.britishcouncil.org/' },
      { label: 'EduCanada', url: 'https://www.educanada.ca/index.aspx?lang=eng' },
    ],
  };
}

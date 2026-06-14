import { Component } from '@angular/core';
import { IrelandPageContentComponent } from '../page-content/ireland-page-content.component';

@Component({
  selector: 'app-banking',
  standalone: true,
  imports: [IrelandPageContentComponent],
  templateUrl: './banking.component.html',
})
export class BankingComponent {
  readonly page = {
    title: '货币和银行服务',
    englishTitle: 'Money And Banking In Ireland',
    audience: '指南页',
    keywords: '欧元、银行卡、开户、生活费、转账、预算管理',
    heroImage:
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80',
    summary:
      '货币和银行服务页面帮助学生理解抵达爱尔兰后的日常用钱场景。核心不是推荐某一家银行，而是提醒学生准备欧元预算、支付方式、开户资料和费用记录习惯。',
    metrics: [
      { value: 'EUR', label: '爱尔兰使用欧元，预算要按汇率波动预留空间' },
      { value: '开户', label: '通常需要身份证明、地址证明和学生身份信息' },
      { value: '预算', label: '学费、房租、押金和日常消费要分开管理' },
    ],
    cardsTitle: '到达后怎么管理钱',
    cards: [
      {
        icon: 'euro',
        title: '欧元预算',
        text: '出发前先把学费、住宿押金、首月生活费和备用金换算成欧元预算。',
      },
      {
        icon: 'account_balance',
        title: '银行开户',
        text: '开户要求会因银行和账户类型不同而变化，通常要准备护照、地址证明和学校相关文件。',
      },
      {
        icon: 'credit_card',
        title: '日常支付',
        text: '银行卡、手机支付和国际卡可作为过渡方案，但手续费和汇率成本要提前了解。',
      },
      {
        icon: 'receipt',
        title: '费用记录',
        text: '建议学生把房租、交通、餐食、电话、保险和教材分项记录，避免预算失控。',
      },
    ],
    guideTitle: '页面定位',
    guideText:
      '这个页面适合放在生活指南下，帮助学生和家长把“到当地怎么花钱、怎么收付款、怎么控制预算”讲清楚。',
    checklist: [
      '出发前准备可覆盖抵达初期的银行卡、现金或备用支付方式。',
      '确认住宿押金、首月房租和学费支付方式。',
      '开户前准备护照、学校证明、地址证明和当地手机号等材料。',
      '提醒学生保留付款记录，谨慎处理陌生转账和押金支付。',
    ],
    sources: [
      {
        label: 'Education in Ireland - Living in Ireland',
        url: 'https://www.educationinireland.com/en/living-in-ireland/',
      },
      {
        label: 'Citizens Information',
        url: 'https://www.citizensinformation.ie/',
      },
      {
        label: 'Competition and Consumer Protection Commission',
        url: 'https://www.ccpc.ie/consumers/money/banking/',
      },
    ],
  };
}

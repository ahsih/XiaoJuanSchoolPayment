import { Component } from '@angular/core';
import { IrelandPageContentComponent } from '../page-content/ireland-page-content.component';

@Component({
  selector: 'app-pre-departure',
  standalone: true,
  imports: [IrelandPageContentComponent],
  templateUrl: './pre-departure.component.html',
})
export class PreDepartureComponent {
  readonly page = {
    title: '行前准备清单',
    englishTitle: 'Pre Departure Checklist',
    audience: '工具页',
    keywords: '行前准备、机票、住宿、签证、保险、文件、到达安排',
    heroImage:
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
    summary:
      '行前准备清单页面适合做成学生出发前的实用工具页。它把签证、住宿、机票、保险、文件、资金、手机、接机和抵达后报到安排放在同一个清单里。',
    metrics: [
      { value: '文件', label: '护照、录取信、签证、保险和付款记录要备份' },
      { value: '抵达', label: '住宿地址、交通路线和接机安排提前确认' },
      { value: '备用', label: '资金、药品、联系人和电子备份都要预留' },
    ],
    cardsTitle: '出发前逐项确认',
    cards: [
      {
        icon: 'folder_copy',
        title: '重要文件',
        text: '护照、签证、录取信、学费收据、住宿确认、保险、成绩材料和紧急联系人建议同时准备纸质和电子版。',
      },
      {
        icon: 'flight_takeoff',
        title: '行程与抵达',
        text: '确认航班、入境口岸、学校报到时间、住宿入住时间、接机或公共交通路线。',
      },
      {
        icon: 'inventory_2',
        title: '生活物品',
        text: '准备适合多雨天气的衣物、常用药、转换插头、学习用品和抵达初期必需品。',
      },
      {
        icon: 'phone_iphone',
        title: '通讯与支付',
        text: '安排国际漫游或临时网络方案，准备可用的银行卡、少量现金和备用支付方式。',
      },
    ],
    guideTitle: '可以做成下载型工具',
    guideText:
      '未来这页很适合扩展成可勾选清单或下载PDF。当前先作为内容页承接导航，后续可以把每项拆成可交互任务。',
    checklist: [
      '确认签证、护照、录取信、住宿、保险和学费付款记录。',
      '确认航班、接机、住宿入住、学校报到和第一周行程。',
      '准备抵达初期资金、通讯、交通、常用药和紧急联系人。',
      '把所有重要文件上传云端，并给家人保留一份备份。',
    ],
    sources: [
      {
        label: 'Education in Ireland - Living in Ireland',
        url: 'https://www.educationinireland.com/en/living-in-ireland/',
      },
      {
        label: 'Irish Immigration - Before and After You Arrive',
        url: 'https://www.irishimmigration.ie/coming-to-study-in-ireland/',
      },
      {
        label: '爱尔兰教育服务中心 IESC',
        url: 'https://www.irelandeducation.cn/chinese-partner-school/',
      },
    ],
  };
}

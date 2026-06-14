import { Component } from '@angular/core';
import { IrelandPageContentComponent } from '../../ireland/page-content/ireland-page-content.component';

@Component({
  selector: 'app-study-pre-departure',
  standalone: true,
  imports: [IrelandPageContentComponent],
  templateUrl: './study-pre-departure.component.html',
})
export class StudyPreDepartureComponent {
  readonly page = {
    title: '住宿与行前准备',
    englishTitle: 'Accommodation And Pre Departure',
    audience: 'SEO指南页',
    keywords: '爱尔兰住宿、学生宿舍、租房、行前准备、接机、保险、银行卡',
    heroImage:
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
    summary:
      '爱尔兰住宿与行前准备要尽早启动。住宿选择会影响预算、通勤和生活适应；行前准备则包括文件、保险、机票、接机、银行卡、手机卡和抵达后注册。',
    metrics: [
      { value: '住宿', label: '校内宿舍、学生公寓、寄宿家庭和租房各有取舍' },
      { value: '行前', label: '证件、保险、资金和抵达安排要逐项核对' },
      { value: '适应', label: '到达前了解城市、交通和学校支持服务' },
    ],
    cardsTitle: '准备重点',
    cards: [
      {
        icon: 'apartment',
        title: '住宿选择',
        text: '确认预算、房型、距离、合同、押金、入住时间和是否适合新生。',
      },
      {
        icon: 'folder_copy',
        title: '重要文件',
        text: '护照、签证、录取信、付款证明、保险、住宿确认和紧急联系人要备份。',
      },
      {
        icon: 'flight_takeoff',
        title: '抵达安排',
        text: '确认机票、接机、住宿入住、学校报到和抵达后注册时间线。',
      },
      {
        icon: 'phone_iphone',
        title: '生活启动',
        text: '提前准备银行卡方案、手机卡、交通、常用药和适合爱尔兰天气的衣物。',
      },
    ],
    guideTitle: '为什么要提前准备住宿',
    guideText:
      '爱尔兰部分城市住宿紧张，尤其开学季更需要提前行动。页面应提醒用户不要把住宿留到最后。',
    checklist: [
      '确认住宿申请渠道、合同、押金、入住日期和通勤方式。',
      '准备护照、签证、录取信、保险和付款证明的电子/纸质备份。',
      '确认接机、报到、注册和第一周生活安排。',
      '保存学校国际办公室、住宿方、顾问和紧急电话。',
    ],
    sources: [
      { label: 'Education in Ireland - Student Accommodation', url: 'https://www.educationinireland.com/en/plan-your-study-abroad/student-accommodation/' },
      { label: 'Education in Ireland - Living in Ireland', url: 'https://www.educationinireland.com/en/living-in-ireland/' },
      { label: 'Education in Ireland - The Application Process', url: 'https://www.educationinireland.com/en/plan-your-study-abroad/the-application-process/' },
    ],
  };
}

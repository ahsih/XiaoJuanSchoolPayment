import { Component } from '@angular/core';
import { StudyTourPageContentComponent } from '../../overseas-study-tour/page-content/study-tour-page-content.component';

@Component({
  selector: 'app-tour-visa-guide',
  standalone: true,
  imports: [StudyTourPageContentComponent],
  templateUrl: './tour-visa-guide.component.html',
})
export class TourVisaGuideComponent {
  readonly page = {
    title: '游学签证指南',
    englishTitle: 'Study Tour Visa Guide',
    positioning: 'SEO指南页，按国家补充签证内容',
    keywords: '游学签证、短期学习、学生签证、旅游签证、材料清单',
    heroImage:
      'https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?auto=format&fit=crop&w=1200&q=80',
    intro:
      '游学签证要按国家、课程长度、学生年龄、是否有正式课程、是否带家长和停留时间判断。签证政策经常变化，本页面用于说明准备逻辑，最终必须以对应国家官方要求为准。',
    highlights: [
      { value: '国家', label: '不同目的地签证规则不同' },
      { value: '时长', label: '短期营和长期语言课程要求不同' },
      { value: '官方', label: '最终以使馆或移民局最新规则为准' },
    ],
    cardsTitle: '签证判断维度',
    cards: [
      {
        icon: 'public',
        title: '目的地国家',
        text: '英国、美国、加拿大、澳洲、爱尔兰和申根国家签证逻辑不同，不能套用同一套材料。',
      },
      {
        icon: 'schedule',
        title: '学习时长',
        text: '短期语言营、夏校、长期语言课程和正式学历课程可能对应不同签证类别。',
      },
      {
        icon: 'description',
        title: '材料准备',
        text: '常见材料包括护照、录取或邀请文件、资金证明、住宿、行程、保险和亲属关系材料。',
      },
      {
        icon: 'family_restroom',
        title: '未成年人出行',
        text: '低龄学生和亲子项目可能涉及监护、同意书、出生证明或家长材料。',
      },
    ],
    checklistTitle: '签证前先确认',
    checklist: [
      '确认国家、课程长度、出发日期、学生年龄和是否有家长同行。',
      '尽早核对护照有效期、签证预约、材料翻译和资金证明周期。',
      '不要在签证未稳定前购买不可退改的大额产品。',
      '页面和报价中保留“签证要求以官方最新政策为准”。',
    ],
    sources: [
      { label: 'UK Visas and Immigration', url: 'https://www.gov.uk/browse/visas-immigration/student-visas' },
      { label: 'U.S. Travel - Student Visa', url: 'https://travel.state.gov/content/travel/en/us-visas/study/student-visa.html' },
      { label: 'Australian Immigration - Study visas', url: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500' },
    ],
  };
}

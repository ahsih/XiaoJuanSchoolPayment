import { Component } from '@angular/core';
import { StudyTourPageContentComponent } from '../page-content/study-tour-page-content.component';

@Component({
  selector: 'app-germany-tour',
  standalone: true,
  imports: [StudyTourPageContentComponent],
  templateUrl: './germany-tour.component.html',
})
export class GermanyTourComponent {
  readonly page = {
    title: '德国游学',
    englishTitle: 'Germany Study Tour',
    positioning: '国家页，补充欧洲目的地',
    keywords: '德语、工程、职业教育、欧洲文化、大学参访',
    heroImage:
      'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1200&q=80',
    intro:
      '德国游学适合对德语、工程、工业设计、职业教育和欧洲大学体系感兴趣的学生。DAAD 提供德国学习、院校项目、申请要求和生活信息。',
    highlights: [
      { value: '德语', label: '适合德语启蒙和欧洲语言体验' },
      { value: '工程', label: '工程、制造和应用型教育辨识度高' },
      { value: '理性', label: '适合目标明确、关注专业路径的学生' },
    ],
    cardsTitle: '德国游学重点',
    cards: [
      {
        icon: 'engineering',
        title: '工程和应用导向',
        text: '适合结合大学参访、企业参访、科技馆和工程主题工作坊。',
      },
      {
        icon: 'translate',
        title: '德语体验',
        text: '可以加入德语入门、日常表达和德国课堂文化体验。',
      },
      {
        icon: 'precision_manufacturing',
        title: '职业教育认知',
        text: '德国职业教育和应用型学习特色明显，适合做升学和职业启蒙。',
      },
      {
        icon: 'account_balance',
        title: '欧洲大学体系',
        text: '对德国本科、硕士或英语授课项目感兴趣的学生，可通过游学建立初步认知。',
      },
    ],
    checklistTitle: '适合什么学生',
    checklist: [
      '对德语、工程、汽车、制造、工业设计或应用科学感兴趣。',
      '希望了解德国大学、应用科学大学和职业教育路径。',
      '能接受非英语目的地，愿意体验第二外语环境。',
      '希望补充欧洲游学目的地，而不是只看英国和爱尔兰。',
    ],
    sources: [
      { label: 'DAAD - Study and Research in Germany', url: 'https://www.daad.de/en/studying-in-germany/' },
      { label: 'Study in Germany', url: 'https://www.study-in-germany.de/en/' },
      { label: 'Goethe-Institut', url: 'https://www.goethe.de/en/index.html' },
    ],
  };
}

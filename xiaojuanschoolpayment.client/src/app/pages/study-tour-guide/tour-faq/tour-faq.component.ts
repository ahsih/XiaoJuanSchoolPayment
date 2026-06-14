import { Component } from '@angular/core';
import { StudyTourPageContentComponent } from '../../overseas-study-tour/page-content/study-tour-page-content.component';

@Component({
  selector: 'app-tour-faq',
  standalone: true,
  imports: [StudyTourPageContentComponent],
  templateUrl: './tour-faq.component.html',
})
export class TourFaqComponent {
  readonly page = {
    title: '游学常见问题',
    englishTitle: 'Study Tour FAQ',
    positioning: 'FAQ页，适合结构化FAQ',
    keywords: '游学常见问题、安全吗、费用、签证、住宿、效果、适合年龄',
    heroImage:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    intro:
      '游学常见问题页面集中回答用户报名之前最容易犹豫的问题：是否安全、费用怎么算、签证怎么办、住宿如何、孩子能否适应、短期游学有没有效果。',
    highlights: [
      { value: '安全', label: '低龄和亲子用户最关心' },
      { value: '费用', label: '需要解释总预算和包含项' },
      { value: '效果', label: '短期游学要设定合理目标' },
    ],
    cardsTitle: 'FAQ 核心问题',
    cards: [
      {
        icon: 'shield',
        title: '游学安全吗？',
        text: '安全取决于目的地、学校管理、住宿、接送、保险和学生年龄。低龄项目要重点看监护和紧急支持。',
      },
      {
        icon: 'payments',
        title: '费用包含什么？',
        text: '常见包含课程和住宿，机票、签证、保险、接送、活动或当地杂费需按具体项目确认。',
      },
      {
        icon: 'school',
        title: '短期有效果吗？',
        text: '短期游学更适合建立兴趣、提高开口频率和体验海外课堂，不应承诺短期大幅提分。',
      },
      {
        icon: 'assignment',
        title: '签证怎么办？',
        text: '签证按国家、时长、年龄和课程性质判断，最终以对应国家官方要求为准。',
      },
    ],
    checklistTitle: 'FAQ页后续可扩展',
    checklist: [
      '按安全、费用、签证、住宿、课程效果、适合年龄做分类。',
      '每个答案尽量给出判断标准，而不是绝对承诺。',
      '可加入结构化FAQ数据，后续用于SEO增强。',
      '把FAQ末尾引导到免费咨询或项目匹配表单。',
    ],
    sources: [
      { label: 'Study UK', url: 'https://study-uk.britishcouncil.org/' },
      { label: 'EducationUSA', url: 'https://educationusa.state.gov/' },
      { label: 'EduCanada', url: 'https://www.educanada.ca/index.aspx?lang=eng' },
    ],
  };
}

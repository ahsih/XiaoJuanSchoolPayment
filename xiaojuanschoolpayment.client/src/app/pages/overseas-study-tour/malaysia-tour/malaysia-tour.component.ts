import { Component } from '@angular/core';
import { StudyTourPageContentComponent } from '../page-content/study-tour-page-content.component';

@Component({
  selector: 'app-malaysia-tour',
  standalone: true,
  imports: [StudyTourPageContentComponent],
  templateUrl: './malaysia-tour.component.html',
})
export class MalaysiaTourComponent {
  readonly page = {
    title: '马来西亚游学',
    englishTitle: 'Malaysia Study Tour',
    positioning: '国家页，成本适中，可与菲律宾做对比',
    keywords: '英语环境、低成本、亚洲多元文化、亲子、短期营',
    heroImage:
      'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1200&q=80',
    intro:
      '马来西亚游学适合希望控制预算、体验多元文化和英语学习环境的学生。Education Malaysia Global Services 提供面向国际学生的马来西亚学习信息，适合做项目背景参考。',
    highlights: [
      { value: '成本', label: '通常比欧美目的地更容易控制预算' },
      { value: '多元', label: '马来、华人、印度等文化并存' },
      { value: '对比', label: '可与菲律宾游学形成价格和体验对比' },
    ],
    cardsTitle: '马来西亚游学重点',
    cards: [
      {
        icon: 'payments',
        title: '预算友好',
        text: '课程、住宿和生活成本通常比欧美低，适合预算敏感或亲子短期体验。',
      },
      {
        icon: 'public',
        title: '多元文化',
        text: '学生可在英语学习之外体验多民族文化、饮食和城市生活。',
      },
      {
        icon: 'school',
        title: '国际教育资源',
        text: '马来西亚有国际学校、私立院校和海外大学分校资源，适合做升学启蒙。',
      },
      {
        icon: 'compare',
        title: '与菲律宾对比',
        text: '菲律宾更突出密集英语和一对一课程，马来西亚更适合综合文化和城市体验。',
      },
    ],
    checklistTitle: '适合什么需求',
    checklist: [
      '希望费用低于欧美，同时保留英语学习和海外体验。',
      '亲子家庭希望行程舒适、饮食适应度高、文化冲击较小。',
      '对国际学校、英联邦体系或亚洲升学路径感兴趣。',
      '需要和菲律宾、新加坡项目做预算和课程强度对比。',
    ],
    sources: [
      { label: 'Education Malaysia Global Services', url: 'https://educationmalaysia.gov.my/' },
      { label: 'Malaysia Truly Asia', url: 'https://www.malaysia.travel/' },
      { label: 'Study Malaysia', url: 'https://studymalaysia.com/' },
    ],
  };
}

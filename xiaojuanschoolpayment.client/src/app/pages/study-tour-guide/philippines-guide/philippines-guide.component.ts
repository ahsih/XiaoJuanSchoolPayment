import { Component } from '@angular/core';
import { StudyTourPageContentComponent } from '../../overseas-study-tour/page-content/study-tour-page-content.component';

@Component({
  selector: 'app-philippines-guide',
  standalone: true,
  imports: [StudyTourPageContentComponent],
  templateUrl: './philippines-guide.component.html',
})
export class PhilippinesGuideComponent {
  readonly page = {
    title: '菲律宾游学指南',
    englishTitle: 'Philippines Study Tour Guide',
    positioning: 'SEO指南页，与收入主业务关联',
    keywords: '菲律宾游学、一对一英语、宿务、碧瑶、雅思、亲子',
    heroImage:
      'https://images.unsplash.com/photo-1542213493895-edf5b94f5a96?auto=format&fit=crop&w=1200&q=80',
    intro:
      '菲律宾游学的核心优势是高频英语练习、课程密度高、预算相对可控，并常把课程、住宿、餐食和校内管理放在同一个校园环境里。选择时要按城市、学校风格、课程强度和住宿条件筛选。',
    highlights: [
      { value: '一对一', label: '菲律宾英语学校常见优势' },
      { value: '城市', label: '宿务、碧瑶、克拉克等定位不同' },
      { value: '预算', label: '适合重视学习密度和总费用的学生' },
    ],
    cardsTitle: '菲律宾游学怎么选',
    cards: [
      {
        icon: 'location_city',
        title: '先选城市',
        text: '宿务生活便利，碧瑶学习氛围强，克拉克适合亲子和舒适环境，巴科洛德更安静。',
      },
      {
        icon: 'psychology',
        title: '再选课程强度',
        text: '从轻松口语到斯巴达雅思，课程强度差异很大，要和学生承受力匹配。',
      },
      {
        icon: 'home_work',
        title: '看住宿管理',
        text: '房型、餐食、门禁、自习、洗衣、网络和校医支持都会影响实际体验。',
      },
      {
        icon: 'receipt',
        title: '算完整费用',
        text: '除学费住宿外，还要看SSP、签证延签、教材、水电、接机和当地杂费。',
      },
    ],
    checklistTitle: '适合人群',
    checklist: [
      '想在短期内提高口语输出频率和英语自信。',
      '备考雅思、多邻国或需要密集英语训练。',
      '预算比欧美低，但希望有海外住宿和课堂环境。',
      '亲子或青少年项目要优先确认安全照顾和住宿条件。',
    ],
    sources: [
      { label: '菲律宾游学 - 思达页面', url: '/philippines-study/why-philippines' },
      { label: 'iOutback 澳贝客', url: 'https://www.ioutback.com/' },
      { label: 'StudyTourA Cebu Schools', url: 'https://www.studytoura.com/cebu-schools/' },
    ],
  };
}

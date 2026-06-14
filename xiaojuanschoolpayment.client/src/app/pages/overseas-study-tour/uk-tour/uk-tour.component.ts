import { Component } from '@angular/core';
import { StudyTourPageContentComponent } from '../page-content/study-tour-page-content.component';

@Component({
  selector: 'app-uk-tour',
  standalone: true,
  imports: [StudyTourPageContentComponent],
  templateUrl: './uk-tour.component.html',
})
export class UkTourComponent {
  readonly page = {
    title: '英国游学',
    englishTitle: 'UK Study Tour',
    positioning: '国家页，传统强需求目的地',
    keywords: '英国英语、名校参访、夏校、文化体验、升学认知',
    heroImage:
      'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80',
    intro:
      '英国游学适合希望体验传统英语教育、名校文化和英式课堂的学生。Study UK 提供关于课程选择、住宿、签证、费用和学生支持的官方信息，可作为项目规划参考。',
    highlights: [
      { value: '名校', label: '适合加入校园参访和升学启蒙' },
      { value: '英式', label: '课堂、文化和城市体验辨识度高' },
      { value: '夏校', label: '寒暑假短期项目选择丰富' },
    ],
    cardsTitle: '英国游学重点',
    cards: [
      {
        icon: 'account_balance',
        title: '名校文化强',
        text: '适合围绕牛津、剑桥、伦敦等城市设计名校参访、博物馆和学术体验。',
      },
      {
        icon: 'menu_book',
        title: '课程类型丰富',
        text: '可选择通用英语、青少年夏校、学术英语、雅思准备或兴趣主题课程。',
      },
      {
        icon: 'home',
        title: '住宿需早定',
        text: '英国热门暑期项目住宿紧张，寄宿家庭、宿舍和营地住宿要提前比较。',
      },
      {
        icon: 'payments',
        title: '预算较高',
        text: '英国项目通常费用较高，需把课程、住宿、交通、活动、签证和机票一起核算。',
      },
    ],
    checklistTitle: '咨询前先确认',
    checklist: [
      '学生年龄、英语水平和是否适合集体营地生活。',
      '是否偏向名校参访、语言提升、雅思备考或兴趣主题。',
      '住宿方式、监护安排、接送范围和周末活动是否清楚。',
      '签证、保险、机票和开课日期要提前规划。',
    ],
    sources: [
      { label: 'Study UK', url: 'https://study-uk.britishcouncil.org/' },
      { label: 'Study UK - Student Visas', url: 'https://study-uk.britishcouncil.org/moving-uk/student-visas' },
      { label: 'English UK', url: 'https://www.englishuk.com/' },
    ],
  };
}

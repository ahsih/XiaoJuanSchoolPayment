import { Component } from '@angular/core';
import { StudyTourPageContentComponent } from '../../overseas-study-tour/page-content/study-tour-page-content.component';

@Component({
  selector: 'app-tour-pre-departure',
  standalone: true,
  imports: [StudyTourPageContentComponent],
  templateUrl: './tour-pre-departure.component.html',
})
export class TourPreDepartureComponent {
  readonly page = {
    title: '行前准备清单',
    englishTitle: 'Study Tour Pre Departure Checklist',
    positioning: '工具页，适合下载/收藏',
    keywords: '行前准备、游学清单、护照、签证、保险、行李、接机',
    heroImage:
      'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
    intro:
      '行前准备清单适合学生和家长在出发前逐项核对。重点包括证件、签证、保险、住宿、接送、行李、药品、支付方式、通讯和紧急联系人。',
    highlights: [
      { value: '证件', label: '护照、签证、录取文件和保险必须备份' },
      { value: '抵达', label: '接机、住宿地址和联系人提前确认' },
      { value: '备用', label: '资金、药品和电子文件都要有备份' },
    ],
    cardsTitle: '出发前分四类准备',
    cards: [
      {
        icon: 'folder_copy',
        title: '证件文件',
        text: '护照、签证、录取信、住宿确认、保险、机票和紧急联系人建议纸质和电子版都准备。',
      },
      {
        icon: 'luggage',
        title: '行李物品',
        text: '按目的地天气准备衣物、转换插头、常用药、学习用品和少量备用现金。',
      },
      {
        icon: 'phone_iphone',
        title: '通讯支付',
        text: '确认国际漫游、当地电话卡、银行卡、支付手续费和家长联系机制。',
      },
      {
        icon: 'support_agent',
        title: '抵达安排',
        text: '保存接机人、住宿地址、学校地址、顾问和紧急电话，抵达后及时报平安。',
      },
    ],
    checklistTitle: '可直接核对',
    checklist: [
      '护照有效期、签证状态、机票、保险和学校文件已确认。',
      '住宿地址、接机安排、联系人电话和报到时间已保存。',
      '常用药、处方说明、转换插头、适季衣物和学习用品已准备。',
      '家长和学生都保存电子文件备份、紧急联系人和当地求助电话。',
    ],
    sources: [
      { label: 'EducationUSA - Prepare for your departure', url: 'https://educationusa.state.gov/your-5-steps-us-study/prepare-your-departure' },
      { label: 'EduCanada - Plan your studies', url: 'https://www.educanada.ca/study-plan-etudes/index.aspx?lang=eng' },
      { label: 'Campus France - Checklist', url: 'https://www.campusfrance.org/en/checklist-prepare-your-arrival-france' },
    ],
  };
}

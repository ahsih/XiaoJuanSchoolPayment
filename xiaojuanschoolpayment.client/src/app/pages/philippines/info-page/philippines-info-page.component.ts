import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

interface InfoPage {
  title: string;
  englishTitle: string;
  audience: string;
  intro: string;
  keywords: string;
  selectionFocus: string;
  cardsTitle: string;
  cards: {
    icon: string;
    title: string;
    text: string;
  }[];
  checklistTitle: string;
  checklist: string[];
}

const infoPages: Record<string, InfoPage> = {
  offers: {
    title: '菲律宾游学最新优惠',
    englishTitle: 'Philippines Study Offers',
    audience: '转化入口、可关联学校优惠',
    intro:
      '菲律宾语言学校的优惠会随学校、房型、课程、报名周数和淡旺季变化。这里先整理常见优惠类型，具体折扣、空房和截止日期以学校当期回复为准。',
    keywords: '早鸟优惠、长期报名优惠、淡季折扣、房型优惠、学校活动',
    selectionFocus: '入学日期、报名周数、房型、课程类型、学校库存和优惠截止时间',
    cardsTitle: '常见优惠类型',
    cards: [
      {
        icon: 'calendar_month',
        title: '早鸟报名优惠',
        text: '提前锁定开课日期和房型时，部分学校会提供早鸟折扣或注册费减免。',
      },
      {
        icon: 'schedule',
        title: '长期学习优惠',
        text: '8周、12周或更长期报名更容易获得学费优惠，也能摊薄接机、签证等固定成本。',
      },
      {
        icon: 'hotel',
        title: '房型与淡季优惠',
        text: '多人房、淡季入学或学校空房较多时，通常更容易争取到价格优势。',
      },
      {
        icon: 'school',
        title: '指定学校活动',
        text: '热门学校会不定期推出课程、住宿或注册费优惠，需要按具体学校和日期确认。',
      },
    ],
    checklistTitle: '咨询优惠前准备',
    checklist: [
      '准备好预计入学日期、学习周数和目标课程。',
      '确认可接受房型：单人、双人、三人或四人房。',
      '优惠要同时比较总费用，不要只看学费折扣。',
      '学校优惠可能随时结束，最终以学校书面确认为准。',
    ],
  },
  faq: {
    title: '菲律宾游学常见问题',
    englishTitle: 'Philippines Study FAQ',
    audience: '解除安全、费用、签证、住宿、效果等疑虑',
    intro:
      '第一次了解菲律宾游学时，用户通常最关心安全、总费用、签证、住宿、课程效果和适合人群。这个页面集中回答报名之前最常见的问题。',
    keywords: '安全、费用、签证、住宿、课程效果、适合人群',
    selectionFocus: '总预算、城市安全、学校管理、签证周期、住宿餐食和学习目标',
    cardsTitle: '常见问题',
    cards: [
      {
        icon: 'verified_user',
        title: '菲律宾游学安全吗？',
        text: '安全感取决于城市、校区位置、学校门禁、接送和学生自身外出习惯。亲子和青少年项目要重点看照顾和门禁。',
      },
      {
        icon: 'payments',
        title: '费用要怎么算？',
        text: '总费用通常包括学费、住宿、餐食、当地费用、签证延签、教材、水电、接机、机票和生活费。',
      },
      {
        icon: 'flight_takeoff',
        title: '签证复杂吗？',
        text: '短期入境和后续延签要根据停留时间安排。学校通常会协助处理当地学习许可和延签材料。',
      },
      {
        icon: 'hotel',
        title: '住宿和餐食如何？',
        text: '多数语言学校提供宿舍和三餐，房型从单人到多人房不等。预算、安静度和隐私需求会影响选择。',
      },
      {
        icon: 'record_voice_over',
        title: '学习效果怎么样？',
        text: '菲律宾游学优势是一对一课程密度高、开口机会多。效果取决于目标、学习周期、老师反馈和课后执行。',
      },
      {
        icon: 'groups',
        title: '适合哪些学生？',
        text: '适合口语提升、雅思/多益备考、亲子游学、青少年营队、商务英语和长期留学前衔接。',
      },
    ],
    checklistTitle: '报名之前先确认',
    checklist: [
      '先确认学习目标和预计学习周期。',
      '按城市、课程和管理模式筛选学校，不要只看价格。',
      '亲子和青少年项目优先确认安全、照顾和住宿。',
      '所有费用、优惠、签证和接机安排都建议书面确认。',
    ],
  },
};

@Component({
  selector: 'app-philippines-info-page',
  standalone: false,
  templateUrl: './philippines-info-page.component.html',
  styleUrl: './philippines-info-page.component.css',
})
export class PhilippinesInfoPageComponent {
  private readonly route = inject(ActivatedRoute);

  readonly page$ = this.route.data.pipe(
    map((data) => infoPages[data['infoKey'] as string] ?? infoPages['faq']),
  );
}

import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

interface LibraryCard {
  icon: string;
  title: string;
  tag: string;
  text: string;
  route?: string;
}

interface LibraryPage {
  title: string;
  englishTitle: string;
  intro: string;
  audience: string;
  keywords: string;
  selectionFocus: string;
  cardsTitle: string;
  cards: LibraryCard[];
  checklist: string[];
}

const libraryPages: Record<string, LibraryPage> = {
  course: {
    title: '按课程找学校',
    englishTitle: 'Find Schools By Course',
    intro:
      '菲律宾语言学校通常按学习目标设计课程。先确认你要提升口语、备考雅思/多益、学习商务英语，还是安排亲子或青少年项目，再筛选城市和学校会更有效。',
    audience: '学校库筛选',
    keywords: '一般英语、雅思、多益、商务、亲子、青少年',
    selectionFocus: '课程目标、课时比例、一对一数量、老师反馈、模考体系和适合城市',
    cardsTitle: '常见课程类型',
    cards: [
      {
        icon: 'record_voice_over',
        title: '一般英语 ESL',
        tag: 'Speaking / Listening',
        text: '适合想提升日常口语、听力、词汇和开口自信的学生。第一次游学通常可以先从ESL开始。',
        route: '/philippines-study/cebu',
      },
      {
        icon: 'assignment',
        title: '雅思备考 IELTS',
        tag: 'Exam Prep',
        text: '适合有明确分数目标的学生。重点看模考频率、写作批改、口语反馈和保证班规则。',
        route: '/philippines-study/recommendations/ielts-schools',
      },
      {
        icon: 'fact_check',
        title: '多益 TOEIC',
        tag: 'Career English',
        text: '适合求职、升学或企业内部英语能力证明需求。可优先考虑碧瑶和管理较强的学校。',
        route: '/philippines-study/baguio',
      },
      {
        icon: 'business_center',
        title: '商务英语',
        tag: 'Business',
        text: '适合职场人士准备会议、面试、邮件和跨文化沟通。马尼拉、宿务可作为优先城市。',
        route: '/philippines-study/manila',
      },
      {
        icon: 'family_restroom',
        title: '亲子课程',
        tag: 'Family',
        text: '适合家长陪读、孩子短期英语体验或低龄适应。重点看家庭房、安全照顾和活动安排。',
        route: '/philippines-study/recommendations/family-schools',
      },
      {
        icon: 'groups',
        title: '青少年营队',
        tag: 'Junior Camp',
        text: '适合寒暑假集中学习和海外体验。重点看年龄分班、住宿照顾、门禁和接送安全。',
        route: '/philippines-study/recommendations/junior-camp',
      },
    ],
    checklist: [
      '先确认学习目标：口语、考试、商务、亲子还是青少年营队。',
      '比较一对一、小班、大班和自习时间比例。',
      '考试课程要确认模考、批改、反馈和保证班规则。',
      '亲子和青少年课程要优先看安全照顾、住宿和活动安排。',
    ],
  },
  style: {
    title: '按管理模式找学校',
    englishTitle: 'Find Schools By Management Style',
    intro:
      '菲律宾学校差异很大，管理模式会直接影响学习强度和生活自由度。自律较弱或冲刺考试可以选斯巴达，想兼顾学习和生活则更适合半斯巴达或自律型学校。',
    audience: '学校库筛选',
    keywords: '斯巴达、半斯巴达、自律型、度假型、亲子管理',
    selectionFocus: '门禁时间、晚自习、单词测试、出勤规则、外出限制和宿舍管理',
    cardsTitle: '常见管理模式',
    cards: [
      {
        icon: 'lock_clock',
        title: '斯巴达学校',
        tag: 'Sparta',
        text: '适合冲刺雅思、多益或自律较弱的学生。通常有门禁、晚自习、每日测试和严格出勤要求。',
        route: '/philippines-study/recommendations/ielts-schools',
      },
      {
        icon: 'rule',
        title: '半斯巴达学校',
        tag: 'Semi-Sparta',
        text: '适合想要学习推动，但又希望保留一定生活自由度的学生，是多数成人学生的平衡选择。',
        route: '/philippines-study/davao',
      },
      {
        icon: 'person_check',
        title: '自律型学校',
        tag: 'Self-Study',
        text: '适合目标清楚、能自主安排学习的人。课程灵活，外出和生活安排通常更宽松。',
        route: '/philippines-study/cebu',
      },
      {
        icon: 'beach_access',
        title: '度假型学校',
        tag: 'Resort Style',
        text: '适合短期体验、亲子或轻松口语学习。重点看校区环境、住宿和活动体验。',
        route: '/philippines-study/boracay',
      },
      {
        icon: 'family_restroom',
        title: '亲子管理型',
        tag: 'Family Care',
        text: '适合低龄孩子或家庭陪读。重点看照顾人员、家庭房、接送、安全和周末活动。',
        route: '/philippines-study/recommendations/family-schools',
      },
      {
        icon: 'verified_user',
        title: '舒适安全型',
        tag: 'Comfort',
        text: '适合重视居住环境、安全管理和外教口语的学生，可重点关注克拉克和苏比克。',
        route: '/philippines-study/clark',
      },
    ],
    checklist: [
      '冲刺考试或自律较弱，优先看斯巴达或半斯巴达。',
      '成人短期口语提升，可以选择自律型或半斯巴达。',
      '亲子和青少年项目要把安全照顾放在课程数量前面。',
      '确认门禁、晚自习、缺勤扣分、外出申请和宿舍规则。',
    ],
  },
  popular: {
    title: '热门学校合集',
    englishTitle: 'Popular School Collection',
    intro:
      '这里整理适合放进学校列表页的热门学校方向，方便用户先快速扫一遍。具体学校是否适合，还要结合城市、预算、课程目标、房型和开课日期来判断。',
    audience: '学校库筛选',
    keywords: '具体学校列表放页面内、不全部塞进顶部导航',
    selectionFocus: '城市、课程强度、住宿环境、预算、开课日期和适合人群',
    cardsTitle: '热门学校方向',
    cards: [
      {
        icon: 'school',
        title: 'CIA',
        tag: '宿务 / 综合型',
        text: '适合想兼顾校区环境、课程体系和学习生活平衡度的学生。',
        route: '/philippines-study/cebu',
      },
      {
        icon: 'assignment',
        title: 'CG Sparta / CG Banilad',
        tag: '宿务 / 管理型',
        text: '适合想要更强学习管理、雅思冲刺或半斯巴达节奏的学生。',
        route: '/philippines-study/recommendations/ielts-schools',
      },
      {
        icon: 'business_center',
        title: 'SMEAG',
        tag: '宿务 / 考试与营队',
        text: '适合关注雅思、多益、亲子和青少年项目体系的学生。',
        route: '/philippines-study/recommendations/junior-camp',
      },
      {
        icon: 'landscape',
        title: 'PINES / MONOL / JIC',
        tag: '碧瑶 / 备考型',
        text: '适合想在安静城市中长期学习、备考雅思或接受高强度管理的学生。',
        route: '/philippines-study/baguio',
      },
      {
        icon: 'family_restroom',
        title: 'B Cebu / Joyful Education',
        tag: '亲子 / 低龄',
        text: '适合家庭用户、低龄孩子和第一次亲子游学体验。',
        route: '/philippines-study/recommendations/family-schools',
      },
      {
        icon: 'public',
        title: 'Clark / Subic Options',
        tag: '外教口语 / 舒适环境',
        text: '适合重视外教口语、安全感、美式氛围和较舒适生活环境的学生。',
        route: '/philippines-study/subic',
      },
    ],
    checklist: [
      '热门学校不一定适合每个人，先确认学习目标和预算。',
      '具体报价、空房和优惠要以学校当期回复为准。',
      '如果用户还没方向，先引导到按城市、按课程或按管理模式筛选。',
      '页面内保留学校清单，不要把所有学校塞进顶部导航。',
    ],
  },
};

@Component({
  selector: 'app-school-library',
  standalone: false,
  templateUrl: './school-library.component.html',
  styleUrl: './school-library.component.css',
})
export class SchoolLibraryComponent {
  private readonly route = inject(ActivatedRoute);

  readonly page$ = this.route.data.pipe(
    map((data) => libraryPages[data['libraryKey'] as string] ?? libraryPages['course']),
  );
}

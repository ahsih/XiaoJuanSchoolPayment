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
        icon: 'family_restroom',
        title: 'CIEC',
        tag: '宿务 / 亲子青少年',
        text: '适合亲子游学、低龄英文、青少年单独游学和国际学校准备方向的家庭。',
        route: '/philippines-study/cebu/ciec',
      },
      {
        icon: 'park',
        title: 'ELSA International Language School',
        tag: '宿务 / 自然亲子度假型',
        text: '适合想要自然校区、幼儿园、Junior课程和陪读家长课程的亲子家庭。',
        route: '/philippines-study/cebu/elsa-international-language-school',
      },
      {
        icon: 'record_voice_over',
        title: 'ETHOS Language School',
        tag: '宿务 / 美国老师小班',
        text: '适合想练American English、美式发音、小班互动和Home Stay体验的学生。',
        route: '/philippines-study/cebu/ethos-language-school',
      },
      {
        icon: 'school',
        title: 'IMS Academy',
        tag: '宿务 / 多国籍亲子与考试',
        text: '适合ESL、IELTS/TOEIC、Junior、Parents ESL、Senior和想住宿务Banilad生活圈的学生。',
        route: '/philippines-study/cebu/ims-academy',
      },
      {
        icon: 'sports_gymnastics',
        title: 'IU English Academy',
        tag: '宿务 / 口语考试与Fitness',
        text: '适合Power Speaking、IELTS/TOEIC、Business、Fitness English和亲子青少年课程一起比较的学生。',
        route: '/philippines-study/cebu/iu-english-academy',
      },
      {
        icon: 'record_voice_over',
        title: 'TARGET Global English Academy',
        tag: '宿务 / 日系高性价比1:1',
        text: '适合成人初学者、预算控制、Lite 4及TARGET 4/5/6一对一口语、TOEIC、IELTS和Working Holiday准备。',
        route: '/philippines-study/cebu/target-global-english-academy',
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
        icon: 'park',
        title: 'ELSA International Language School',
        tag: '宿务 / 自然亲子度假型',
        text: '适合亲子游学、低龄英文、Junior ESL、Kindergarten和陪读家长轻量课程。',
        route: '/philippines-study/cebu/elsa-international-language-school',
      },
      {
        icon: 'record_voice_over',
        title: 'ETHOS Language School',
        tag: '宿务 / 美国老师小班',
        text: '适合想由美国老师训练美式发音、会话、阅读、语法和写作的成人或亲子家庭。',
        route: '/philippines-study/cebu/ethos-language-school',
      },
      {
        icon: 'school',
        title: 'IMS Academy',
        tag: '宿务 / Banilad多路线',
        text: '适合想住宿务Banilad生活圈，并同时比较ESL、IELTS/TOEIC、Junior、Parents ESL和Senior课程的学生。',
        route: '/philippines-study/cebu/ims-academy',
      },
      {
        icon: 'family_restroom',
        title: 'First English Global College',
        tag: '宿务 / 麦克坦亲子与一对一',
        text: '适合亲子游学、低龄儿童、成人高比例一对一，以及想住Mactan Newtown或Share House的学生。',
        route: '/philippines-study/cebu/first-english-global-college',
      },
      {
        icon: 'assignment',
        title: 'CG Academy Sparta Campus',
        tag: '宿务 / 管理型',
        text: '适合想要平日外出限制、EOP、单词作文、强制自习和TOEIC/IELTS备考节奏的学生。',
        route: '/philippines-study/cebu/cg-academy-sparta-campus',
      },
      {
        icon: 'location_city',
        title: 'CG Academy Banilad Campus',
        tag: '宿务 / 市区半斯巴达',
        text: '适合想住Banilad市区生活圈、兼顾半斯巴达学习推动、课程选择和费用控制的学生。',
        route: '/philippines-study/cebu/cg-academy-banilad-campus',
      },
      {
        icon: 'business_center',
        title: 'SMEAG',
        tag: '宿务 / 考试与营队',
        text: '适合关注雅思、多益、亲子和青少年项目体系的学生。',
        route: '/philippines-study/cebu/smeag-capital',
      },
      {
        icon: 'beach_access',
        title: 'Genius English Academy',
        tag: '宿务 / 海边度假型',
        text: '适合想住在Mactan海边度假区、重视多国籍环境、Native group class和亲子/成人口语课程的学生。',
        route: '/philippines-study/cebu/genius-english-academy',
      },
      {
        icon: 'hotel',
        title: 'Howdy English Academy',
        tag: '宿务 / 酒店型一对一',
        text: '适合想住Maayo Hotel、重视日系支持、安全住宿、亲子和短期一对一口语课程的学生。',
        route: '/philippines-study/cebu/howdy-english-academy',
      },
      {
        icon: 'pool',
        title: 'I.BREEZE',
        tag: '宿务 / 市区度假型',
        text: '适合想在Mabolo市区兼顾泳池校区、多国籍环境、口语强化和ESL/考试/商务课程的学生。',
        route: '/philippines-study/cebu/ibreeze',
      },
      {
        icon: 'sports_gymnastics',
        title: 'IU English Academy',
        tag: '宿务 / 市区运动型',
        text: '适合想在General Maxilom市区校区兼顾Power Speaking、Fitness、IELTS/TOEIC和亲子课程的学生。',
        route: '/philippines-study/cebu/iu-english-academy',
      },
      {
        icon: 'record_voice_over',
        title: 'TARGET Global English Academy',
        tag: '宿务 / Talamban日系1:1',
        text: '适合想控制费用、保留高比例一对一、住校内多人房，并在安静Talamban环境学习的成人学生。',
        route: '/philippines-study/cebu/target-global-english-academy',
      },
      {
        icon: 'account_balance',
        title: 'Lapulapu / LCIC',
        tag: '宿务 / 大学型校园',
        text: '适合想体验LCIC大学校园、4/14/18周固定档期、私人房宿舍和菲律宾学生Buddy交流的学生。',
        route: '/philippines-study/cebu/lapulapu',
      },
      {
        icon: 'waves',
        title: 'Cebu Blue Ocean Academy',
        tag: '宿务 / Mactan海边度假型',
        text: '适合想住在Mactan海边EGI度假环境、重视PINES教学体系、一对一ESL和亲子/考试课程的学生。',
        route: '/philippines-study/cebu/cebu-blue-ocean-academy',
      },
      {
        icon: 'apartment',
        title: 'CELLA Premium Campus',
        tag: '宿务 / 市区Premium型',
        text: '适合想住在Banilad/A.S. Fortuna生活圈、重视酒店式住宿、一对一口语、商务和短期密集课程的学生。',
        route: '/philippines-study/cebu/cella-premium-campus',
      },
      {
        icon: 'hotel',
        title: 'CIJ Academy Premium Campus',
        tag: '宿务 / Premium舒适型',
        text: '适合想兼顾舒适住宿、高比例一对一口语、Native、商务和TOEIC方向的成人学生。',
        route: '/philippines-study/cebu/cij-academy-premium-campus',
      },
      {
        icon: 'psychology',
        title: 'Curious World Academy',
        tag: '宿务 / 市区高性价比',
        text: '适合想住Mabolo市区、重视日系支持、出发前学习规划、一对一课量和预算控制的学生。',
        route: '/philippines-study/cebu/curious-world-academy',
      },
      {
        icon: 'groups',
        title: 'Global Language Cebu',
        tag: '宿务 / Mabolo大型综合型',
        text: '适合想住宿务市区Mabolo，兼顾Power Speaking、亲子、TOEIC/IELTS、商务、活动和设施的学生。',
        route: '/philippines-study/cebu/global-language-cebu',
      },
      {
        icon: 'beach_access',
        title: 'QQEnglish Beachfront Campus',
        tag: '宿务 / Mactan海边一对一',
        text: '适合想在Mactan Newtown海边新校区学习，重视一对一课量、短期弹性和自理住宿选择的学生。',
        route: '/philippines-study/cebu/qqenglish-beachfront-campus',
      },
      {
        icon: 'support_agent',
        title: 'STARGATE Global Education',
        tag: '宿务 / 小规模初学者友好',
        text: '适合想住宿务市区、重视日本职员支持、一对一课程、同楼住宿和预算控制的初学者。',
        route: '/philippines-study/cebu/stargate-global-education',
      },
      {
        icon: 'school',
        title: 'Winning English Academy',
        tag: '宿务 / City与Ocean多校区',
        text: '适合想在台资多国籍环境中选择City市区或Ocean海岛校区，兼顾ESL、考试、商务和亲子课程的学生。',
        route: '/philippines-study/cebu/winning-english-academy',
      },
      {
        icon: 'landscape',
        title: 'PINES / MONOL / JIC',
        tag: '碧瑶 / 备考型',
        text: '适合想在安静城市中长期学习、备考雅思或接受高强度管理的学生。',
        route: '/philippines-study/baguio',
      },
      {
        icon: 'work',
        title: 'API BECI City Campus',
        tag: '碧瑶 / 成人Workcation',
        text: '适合成人、专业人士和Workcation学生；City Campus在Baguio，需和宿务B Cebu区分。',
        route: '/philippines-study/baguio/api-beci-city-campus',
      },
      {
        icon: 'forest',
        title: 'A&J e-Edu English Academy',
        tag: '碧瑶 / Eco Campus',
        text: '适合想在碧瑶自然型一体校园学习，重视ESL强度弹性、住宿选择和校内生活配套的学生。',
        route: '/philippines-study/baguio/anj-e-edu-english-academy',
      },
      {
        icon: 'terrain',
        title: 'HELP English（Longlong Campus）',
        tag: '碧瑶 / Sparta',
        text: '适合想比较HELP老牌Sparta、ESL、IELTS/TOEIC和碧瑶山城学习环境的学生；需先确认Longlong当前开放状态。',
        route: '/philippines-study/baguio/help-english-longlong-campus',
      },
      {
        icon: 'account_balance',
        title: 'GITC College International Language Center',
        tag: '伊洛伊洛 / 大学附属',
        text: '适合想在Iloilo安静城市里结合ESL、TOEIC/IELTS、大学交流和SDGs体验的学生；不是Clark学校。',
        route: '/philippines-study/iloilo/gitc-college-international-language-center',
      },
      {
        icon: 'verified',
        title: 'WE Academy Iloilo',
        tag: '伊洛伊洛 / Semi-Sparta IELTS',
        text: '适合想在Iloilo安静环境中学习ESL、TOEIC、Business、IELTS或Junior，并清楚比较住宿套餐费用的学生。',
        route: '/philippines-study/iloilo/we-academy',
      },
      {
        icon: 'record_voice_over',
        title: 'PIA · Polyglot International Academy',
        tag: '伊洛伊洛 / ESL / Power Speaking',
        text: '适合想住Iloilo Business Park生活圈，比较一对一口语、考试、青少年课程和合作酒店费用的学生。',
        route: '/philippines-study/iloilo/polyglot-international-academy',
      },
      {
        icon: 'school',
        title: 'MK Language Training Center',
        tag: '伊洛伊洛 / Semi-Sparta',
        text: '适合想在Iloilo安静环境中控制预算，比较ESL、IELTS、TESOL、Internship和亲子课程的学生。',
        route: '/philippines-study/iloilo/mk-language-training-center',
      },
      {
        icon: 'savings',
        title: 'E-Room Language Center',
        tag: '巴科洛德 / Classic或Semi-Sparta',
        text: '适合想在Bacolod低干扰城市控制预算，比较ESL/Business、IELTS/TOEIC、Guardian和Junior路线的学生。',
        route: '/philippines-study/bacolod/e-room-language-center',
      },
      {
        icon: 'pool',
        title: 'Boracay Coco English Academy',
        tag: '长滩岛 / Resort-style Family',
        text: '适合想在长滩岛度假型校园中学习ESL、商务英语、IELTS、亲子和低龄课程，并比较2026课程与食宿费用的学生。',
        route: '/philippines-study/boracay/boracay-coco-english-academy',
      },
      {
        icon: 'record_voice_over',
        title: 'Paradise English Boracay Language Institute',
        tag: '长滩岛 / Canadian-owned ESL',
        text: '适合想在长滩岛多国籍环境中选择Budget、General、Intensive、True Beginner或IELTS/TOEIC/Business课程的学生。',
        route:
          '/philippines-study/boracay/paradise-english-boracay-language-institute',
      },
      {
        icon: 'family_restroom',
        title: 'B Cebu',
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
      {
        icon: 'golf_course',
        title: 'HANA Academy',
        tag: '克拉克 / Native亲子Golf',
        text: '适合想在Clark兼顾Native口语、亲子低龄、Golf English、Senior课程和舒适生活环境的学生。',
        route: '/philippines-study/clark/hana-academy',
      },
      {
        icon: 'record_voice_over',
        title: 'TALK Academy Clark',
        tag: '克拉克 / 舒适一对一',
        text: '适合想在Clark Freeport Zone学习TALK4/TALK6、一对一口语、Senior、Golf、Business或考试方向的学生。',
        route: '/philippines-study/clark/talk-academy',
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

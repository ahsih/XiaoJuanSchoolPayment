import { Component } from '@angular/core';

@Component({
  selector: 'app-master-application',
  standalone: false,
  templateUrl: './master-application.component.html',
})
export class MasterApplicationComponent {
  readonly page = {
    title: '爱尔兰硕士申请',
    englishTitle: 'Ireland Master Application',
    audience: '服务页，转化价值较高',
    keywords: '硕士申请、一年制硕士、专业背景、均分、雅思、文书、就业',
    heroImage:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
    summary:
      '爱尔兰硕士申请是转化价值较高的服务页，适合本科毕业生、应届生、工作后回炉提升以及希望通过一年制硕士连接欧洲就业机会的申请者。核心是专业匹配、背景评估、材料质量和时间规划。',
    metrics: [
      { value: '1年', label: '许多授课型硕士周期紧凑，适合效率型升学' },
      { value: '背景', label: '专业相关性和均分会直接影响申请梯度' },
      { value: '就业', label: '商科、计算机、制药、工程等方向关注度高' },
    ],
    cardsTitle: '硕士申请服务重点',
    cards: [
      {
        icon: 'analytics',
        title: '背景评估',
        text: '先看本科院校、专业、均分、核心课程、实习科研、语言水平和目标行业，判断冲刺、匹配和保底学校组合。',
      },
      {
        icon: 'hub',
        title: '专业匹配',
        text: '爱尔兰硕士常见方向包括商科、金融、数据、计算机、工程、制药、教育和人文社科。跨专业申请要特别确认先修要求。',
      },
      {
        icon: 'edit_note',
        title: '文书与材料',
        text: '个人陈述、简历、推荐信和课程解释要围绕申请逻辑展开，突出为什么适合该课程以及未来职业规划。',
      },
      {
        icon: 'event_available',
        title: '时间线管理',
        text: '热门专业建议提前准备。语言成绩、补件、押金、住宿和签证会连续发生，需要按节点推进。',
      },
    ],
    guideTitle: '为什么这页转化价值高',
    guideText:
      '硕士用户通常目标更明确、决策周期更短，也更关注录取概率、专业就业、毕业后工作路径和预算回报。页面应清楚展示顾问能提供的评估、选校、文书和节点管理价值。',
    checklist: [
      '整理本科成绩单、在读/毕业证明、语言成绩、简历和推荐人信息。',
      '确认目标专业是否接受跨专业，以及是否要求数学、编程、商科或工作经验背景。',
      '按冲刺、匹配、稳妥组合建立学校清单，避免只盯一两所热门院校。',
      '同步规划押金、住宿、签证和毕业后就业方向。',
    ],
    sources: [
      {
        label: '爱尔兰教育服务中心 IESC',
        url: 'https://www.irelandeducation.cn/chinese-partner-school/',
      },
      {
        label: '爱尔兰研究生课程申请 - IESC',
        url: 'https://www.irelandeducation.cn/postgraduate-application/',
      },
      {
        label: '爱尔兰高等教育机构 - IESC',
        url: 'https://www.irelandeducation.cn/introduction-institutions/',
      },
      {
        label: 'Education in Ireland',
        url: 'https://www.educationinireland.com/',
      },
    ],
  };
}

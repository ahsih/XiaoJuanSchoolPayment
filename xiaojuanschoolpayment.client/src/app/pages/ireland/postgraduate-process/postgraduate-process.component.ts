import { Component } from '@angular/core';
import { IrelandPageContentComponent } from '../page-content/ireland-page-content.component';

@Component({
  selector: 'app-postgraduate-process',
  standalone: true,
  imports: [IrelandPageContentComponent],
  templateUrl: './postgraduate-process.component.html',
})
export class PostgraduateProcessComponent {
  readonly page = {
    title: '研究生课程申请',
    englishTitle: 'Postgraduate Course Application',
    audience: '流程页',
    keywords: '研究生申请、硕士申请、专业匹配、文书材料、录取押金、签证准备',
    heroImage:
      'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80',
    summary:
      '研究生课程申请更看重专业匹配、学术背景、成绩、英语水平和职业目标。页面应帮助学生先判断能申请什么层级与方向，再安排文书、推荐、递交、录取确认和签证准备。',
    metrics: [
      { value: '背景', label: '本科专业、均分和相关经历决定匹配范围' },
      { value: '文书', label: '个人陈述和简历要围绕申请逻辑展开' },
      { value: '节点', label: '热门课程建议提前准备和递交' },
    ],
    cardsTitle: '研究生申请流程',
    cards: [
      {
        icon: 'analytics',
        title: '背景评估',
        text: '先看本科专业、成绩、院校背景、实习经历和英语水平，再判断可申请范围。',
      },
      {
        icon: 'hub',
        title: '课程匹配',
        text: '硕士课程需要核对是否接受跨专业、是否要求作品集、工作经验、数学或编程背景。',
      },
      {
        icon: 'edit_document',
        title: '文书准备',
        text: '个人陈述、简历、推荐信和补充说明应体现学术动机、职业目标和课程匹配度。',
      },
      {
        icon: 'event_available',
        title: '录取后规划',
        text: '收到录取后要关注接受期限、押金、语言补件、住宿申请和签证排期。',
      },
    ],
    guideTitle: '转化重点',
    guideText:
      '研究生页面适合承接希望提升学历、转专业或规划就业的学生。页面要帮用户理解“为什么这个课程适合我”，而不是只罗列学校名称。',
    checklist: [
      '确认本科专业和目标硕士是否属于同方向、相关方向或跨专业申请。',
      '准备成绩单、在读或毕业证明、简历、推荐信、个人陈述和语言成绩。',
      '对热门课程提前确认开放时间、截止时间和押金节点。',
      '同步规划签证、住宿、预算和毕业后就业方向。',
    ],
    sources: [
      {
        label: 'Education in Ireland - How Do I Apply',
        url: 'https://www.educationinireland.com/en/how-do-i-apply-/',
      },
      {
        label: 'Irish Immigration - Study Options',
        url: 'https://www.irishimmigration.ie/coming-to-study-in-ireland/what-are-my-study-options/a-third-level-course-or-a-language-course/',
      },
      {
        label: '爱尔兰教育服务中心 IESC',
        url: 'https://www.irelandeducation.cn/chinese-partner-school/',
      },
    ],
  };
}

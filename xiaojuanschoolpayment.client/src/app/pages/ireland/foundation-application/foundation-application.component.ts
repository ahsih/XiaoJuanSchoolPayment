import { Component } from '@angular/core';
import { IrelandPageContentComponent } from '../page-content/ireland-page-content.component';

@Component({
  selector: 'app-foundation-application',
  standalone: true,
  imports: [IrelandPageContentComponent],
  templateUrl: './foundation-application.component.html',
})
export class FoundationApplicationComponent {
  readonly page = {
    title: '爱尔兰预科申请',
    englishTitle: 'Ireland Foundation Application',
    audience: '服务页，适合条件暂未达标的学生',
    keywords: '预科申请、Foundation、桥梁课程、语言衔接、本科预科、硕士预科',
    heroImage:
      'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1200&q=80',
    summary:
      '爱尔兰预科申请适合暂时达不到直录要求、需要补足英语、学术写作、数学、商务或专业基础的学生。它不是“退而求其次”，而是把学生带到更稳妥的本科或硕士衔接路径上。',
    metrics: [
      { value: '桥梁', label: '连接语言、学术能力和正式学位课程' },
      { value: '本科', label: '高中毕业后可评估本科预科路径' },
      { value: '硕士', label: '背景或语言不足时可评估硕士预科' },
    ],
    cardsTitle: '预科申请服务重点',
    cards: [
      {
        icon: 'route',
        title: '路径判断',
        text: '先判断学生是需要语言班、本科预科、国际大一、硕士预科，还是可以通过补语言后直接申请正式课程。',
      },
      {
        icon: 'language',
        title: '英语衔接',
        text: '预科通常帮助学生补足英语、学术写作、课堂表达和考试能力，但具体要求和升读条件需按院校确认。',
      },
      {
        icon: 'calculate',
        title: '学术基础',
        text: '部分路径会补数学、商务、信息技术、科学或专业基础，适合成绩、课程体系或专业背景暂不完全匹配的学生。',
      },
      {
        icon: 'verified_user',
        title: '升读条件',
        text: '选择预科时必须看清升读目标、通过标准、可衔接专业、是否保录以及失败后的备选方案。',
      },
    ],
    guideTitle: '适合什么学生',
    guideText:
      '预科页适合条件暂未达标但有明确升学目标的学生。页面要帮助用户看到“通过桥梁课程进入更合适学位”的价值，同时把升读要求和风险讲清楚。',
    checklist: [
      '确认学生当前成绩、学历阶段、英语水平和目标学位课程。',
      '比较预科长度、开学时间、课程内容、升读标准和可衔接院校。',
      '确认是否需要重新考雅思，或可通过内部测试/预科成绩升读。',
      '把预科费用、后续学位费用、住宿和签证周期一起规划。',
    ],
    sources: [
      {
        label: '爱尔兰教育服务中心 IESC',
        url: 'https://www.irelandeducation.cn/chinese-partner-school/',
      },
      {
        label: '本科课程申请 - IESC',
        url: 'https://www.irelandeducation.cn/undergraduate-application/',
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

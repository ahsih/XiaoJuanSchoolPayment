import { Component } from '@angular/core';
import { IrelandPageContentComponent } from '../../ireland/page-content/ireland-page-content.component';

@Component({
  selector: 'app-application-materials',
  standalone: true,
  imports: [IrelandPageContentComponent],
  templateUrl: './application-materials.component.html',
})
export class ApplicationMaterialsComponent {
  readonly page = {
    title: '申请材料清单',
    englishTitle: 'Application Materials Checklist',
    audience: '工具页，适合做下载资料',
    keywords: '申请材料、成绩单、毕业证明、推荐信、个人陈述、护照、语言成绩',
    heroImage:
      'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80',
    summary:
      '申请材料清单适合做成可下载工具。不同院校和专业要求不同，但常见材料包括成绩单、学历证明、语言成绩、护照、简历、个人陈述、推荐信和作品集。',
    metrics: [
      { value: '基础', label: '成绩单、学历证明、护照和语言成绩' },
      { value: '文书', label: '简历、个人陈述和推荐信' },
      { value: '补充', label: '作品集、课程描述或工作证明按专业决定' },
    ],
    cardsTitle: '材料分类',
    cards: [
      {
        icon: 'badge',
        title: '身份材料',
        text: '护照、个人信息、申请表和联系方式要保持一致，避免拼写差异。',
      },
      {
        icon: 'school',
        title: '学术材料',
        text: '成绩单、在读证明、毕业证、学位证和课程描述需按学校要求准备。',
      },
      {
        icon: 'edit_document',
        title: '文书材料',
        text: '个人陈述、简历和推荐信要围绕专业匹配和申请逻辑展开。',
      },
      {
        icon: 'palette',
        title: '专业补充',
        text: '艺术设计、建筑、教育、商科或转专业申请可能需要作品集、面试或额外说明。',
      },
    ],
    guideTitle: '工具页后续方向',
    guideText:
      '这页后续很适合扩展成下载表格或在线勾选清单，用户填写当前背景后自动生成材料准备任务。',
    checklist: [
      '确认每份材料是否需要中英文、盖章、公证或翻译。',
      '成绩单和学历证明要覆盖完整学习阶段。',
      '推荐人信息、邮箱和推荐内容要提前确认。',
      '作品集、课程描述和补充说明按专业提前准备。',
    ],
    sources: [
      { label: 'Education in Ireland - The Application Process', url: 'https://www.educationinireland.com/en/plan-your-study-abroad/the-application-process/' },
      { label: 'Education in Ireland - English language requirements', url: 'https://www.educationinireland.com/en/plan-your-study-abroad/english-language-requirements/' },
      { label: '爱尔兰教育服务中心 IESC', url: 'https://www.irelandeducation.cn/chinese-partner-school/' },
    ],
  };
}

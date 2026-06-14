import { Component } from '@angular/core';

@Component({
  selector: 'app-undergraduate-application',
  standalone: false,
  templateUrl: './undergraduate-application.component.html',
})
export class UndergraduateApplicationComponent {
  readonly page = {
    title: '爱尔兰本科申请',
    englishTitle: 'Ireland Undergraduate Application',
    audience: '服务页',
    keywords: '本科申请、高中成绩、雅思、预科、直入本科、转学分',
    heroImage:
      'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80',
    summary:
      '爱尔兰本科申请适合高中毕业生、国际课程学生，以及希望从国内本科或大专阶段转入爱尔兰本科体系的学生。页面重点是帮助用户判断能否直入本科，还是需要先通过语言、预科或转学分路径衔接。',
    metrics: [
      { value: '直入', label: '高中成绩和英语达到要求时可评估本科一年级' },
      { value: '预科', label: '英语或学术基础不足时可先做桥梁衔接' },
      { value: '转学分', label: '已有高等教育经历可评估减免或插读' },
    ],
    cardsTitle: '本科申请服务重点',
    cards: [
      {
        icon: 'fact_check',
        title: '入学资格评估',
        text: '先判断学生的高中成绩、国际课程成绩、英语水平和专业方向是否满足目标院校要求，再决定直申、预科或语言路径。',
      },
      {
        icon: 'school',
        title: '院校类型匹配',
        text: '国立大学、理工大学、私立院校和专业学院定位不同。申请时要结合成绩、预算、城市、专业和未来升学就业来筛选。',
      },
      {
        icon: 'description',
        title: '材料准备',
        text: '本科申请常见材料包括高中成绩单、毕业证明、语言成绩、申请表、护照信息，艺术类或设计类方向还可能需要作品集。',
      },
      {
        icon: 'sync_alt',
        title: '转学分与专升本',
        text: '如果学生已有大专或本科课程经历，可根据课程描述、学分、成绩和专业相关性评估减免学分或插读可能。',
      },
    ],
    guideTitle: '适合什么学生',
    guideText:
      '本科页适合作为低龄和家庭用户的主服务入口。重点不只是“能不能录取”，还要让家长看清预算、住宿、签证、专业选择和后续硕士/就业路径。',
    checklist: [
      '确认学生当前课程体系：普高、A-Level、IB、预科、大专或本科在读。',
      '确认目标专业是否需要数学、作品集、面试、特定科目或更高英语分数。',
      '准备成绩单、毕业证明、语言成绩、护照和文书材料。',
      '如果条件未达直录要求，提前评估语言班、预科或桥梁课程。',
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

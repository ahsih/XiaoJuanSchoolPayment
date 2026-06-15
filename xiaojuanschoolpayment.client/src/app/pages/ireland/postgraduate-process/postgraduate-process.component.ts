import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

interface ProcessStep {
  step: string;
  title: string;
  tag: string;
  text: string;
  checks: string[];
}

interface InfoGroup {
  icon: string;
  title: string;
  items: string[];
}

interface AdvisorNote {
  icon: string;
  title: string;
  text: string;
}

@Component({
  selector: 'app-postgraduate-process',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './postgraduate-process.component.html',
  styleUrl: '../application-process.css',
})
export class PostgraduateProcessComponent {
  readonly hero = {
    kicker: 'Ireland Postgraduate Application Process',
    title: '爱尔兰研究生课程申请流程',
    summary:
      '研究生申请的核心不是“多投几所学校”，而是把本科背景、均分、专业匹配、语言条件、文书逻辑和职业目标串起来。思达教育会先判断可冲、匹配和稳妥课程，再安排递交、补件、押金、住宿与签证节点。',
    image:
      'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80',
    imageAlt: '学生讨论爱尔兰研究生申请方案',
  };

  readonly facts = [
    { value: '背景评估', label: '本科专业、均分、院校背景和相关经历决定课程范围' },
    { value: '课程匹配', label: '逐个核对入学要求、跨专业规则和申请截止日期' },
    { value: '录取落地', label: 'offer 条件、押金、住宿、签证和行前安排同步管理' },
  ];

  readonly steps: ProcessStep[] = [
    {
      step: '01',
      title: '评估学术背景',
      tag: '本科专业 + 均分 + 经历',
      text: '先看申请人的本科专业、成绩、院校背景、实习/科研/项目经历和英语水平，再判断适合授课型硕士、研究型课程还是桥梁路径。',
      checks: [
        '确认本科是否已经完成，或预计毕业时间是否能衔接入学。',
        '确认目标课程是否要求相关本科背景、数学、编程、作品集或工作经验。',
        '把可冲、匹配、稳妥课程分层，避免只凭学校名递交。',
      ],
    },
    {
      step: '02',
      title: '锁定课程清单',
      tag: '方向清晰才能写好文书',
      text: '硕士选课要看课程模块、毕业要求、实习或项目机会、城市产业资源和毕业后规划。跨专业学生尤其要证明转向逻辑。',
      checks: [
        '对比课程模块是否覆盖目标职业技能。',
        '确认课程是否全日制，以及是否符合学习签证和后续规划要求。',
        '查看课程页面的申请费、截止日期、名额和补充材料要求。',
      ],
    },
    {
      step: '03',
      title: '准备文书与证明',
      tag: 'PS / CV / 推荐信',
      text: '研究生文书要解释“为什么这个专业、为什么这所学校、为什么现在申请”，并把经历转化成课程匹配证据。',
      checks: [
        '个人陈述围绕学术动机、专业准备和职业目标展开。',
        '简历突出课程项目、实习、科研、竞赛和技能证据。',
        '推荐信要和申请方向互相支撑，避免只写泛泛评价。',
      ],
    },
    {
      step: '04',
      title: '递交申请并跟进',
      tag: '在线系统 + 补件管理',
      text: '多数院校通过官方在线系统递交，部分课程会有独立申请链接或额外问题。递交后要持续跟进状态和补件邮件。',
      checks: [
        '按学校要求上传成绩单、学位/在读证明、语言成绩、护照和文书。',
        '同一学校多课程申请时，注意偏好顺序、申请费和材料差异。',
        '收到补件要求后，确认文件格式、翻译、公证和截止日期。',
      ],
    },
    {
      step: '05',
      title: '解析 offer 条件',
      tag: '条件录取不是最终入学',
      text: '研究生 offer 可能要求最终均分、学位证、语言成绩、押金或其他补件。每项条件都要拆成明确动作。',
      checks: [
        '确认接受 offer 的入口、押金金额、退款规则和截止日期。',
        '确认语言条件是否可通过补交成绩、语言班或其他路径满足。',
        '对多个 offer 做课程、城市、费用、住宿和就业资源比较。',
      ],
    },
    {
      step: '06',
      title: '安排签证与入学',
      tag: '住宿和签证不要后置',
      text: '确认入读课程后，要尽快准备资金、缴费证明、保险、住宿、签证材料和行前清单，避免录取已拿到但落地节奏失控。',
      checks: [
        '学习超过 90 天时，确认课程在合规清单或认可体系内。',
        '按签证要求准备录取、缴费、资金、保险和学习计划材料。',
        '抵达后按要求完成居留注册、迎新和院系报到。',
      ],
    },
  ];

  readonly documentGroups: InfoGroup[] = [
    {
      icon: 'school',
      title: '学术材料',
      items: ['本科成绩单', '在读证明或毕业证/学位证', '评分说明或均分证明', '课程描述或专业背景说明'],
    },
    {
      icon: 'edit_document',
      title: '文书材料',
      items: ['个人陈述或动机信', '英文简历', '推荐信', '跨专业或低均分补充解释'],
    },
    {
      icon: 'fact_check',
      title: '补充与落地材料',
      items: ['语言成绩', '护照信息页', '作品集或面试准备', '押金、住宿、保险和签证材料'],
    },
  ];

  readonly advisorNotes: AdvisorNote[] = [
    {
      icon: 'route',
      title: '跨专业要讲逻辑',
      text: '跨专业申请不是不能做，但要把本科课程、项目经历、技能补足和职业目标串成可信路径。',
    },
    {
      icon: 'priority_high',
      title: '热门课程要前置',
      text: '商科、计算机、数据、工程、制药和教育等方向竞争较集中，建议在开放期前完成材料和文书框架。',
    },
    {
      icon: 'task_alt',
      title: 'offer 要会比较',
      text: '不要只比较学校名。课程模块、城市成本、住宿、职业服务和后续签证规划都要一起看。',
    },
  ];
}

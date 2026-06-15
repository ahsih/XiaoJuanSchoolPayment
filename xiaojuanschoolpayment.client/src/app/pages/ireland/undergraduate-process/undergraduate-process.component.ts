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
  selector: 'app-undergraduate-process',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './undergraduate-process.component.html',
  styleUrl: '../application-process.css',
})
export class UndergraduateProcessComponent {
  readonly hero = {
    kicker: 'Ireland Undergraduate Application Process',
    title: '爱尔兰本科课程申请流程',
    summary:
      '本科申请要先判断“能不能直入本科”，再决定是否需要预科、语言课、桥梁课程或转学分路径。思达教育会把院校官网要求、英语水平、成绩背景、预算和签证时间线放在同一张规划表里，避免只看学校名就仓促递交。',
    image:
      'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1200&q=80',
    imageAlt: '学生在图书馆准备爱尔兰本科申请材料',
  };

  readonly facts = [
    { value: '路径先行', label: '直入本科、预科衔接、语言课或转学分先判断清楚' },
    { value: '官网核对', label: '每个专业的成绩、英语、作品集和截止日期都要逐项确认' },
    { value: '录取后排期', label: '押金、住宿、签证和行前准备要和 offer 条件同步推进' },
  ];

  readonly steps: ProcessStep[] = [
    {
      step: '01',
      title: '判断申请路径',
      tag: '直入 / 预科 / 语言 / 转学分',
      text: '先看学生当前课程体系和成绩：普高、A-Level、IB、国际高中、预科、大专或本科在读，对应的申请路径会不同。',
      checks: [
        '高中毕业生可评估本科一年级直入或预科衔接。',
        '英语暂未达标时，先确认学校是否接受语言课或桥梁课程。',
        '已有大学或大专经历时，准备课程描述评估转学分可能。',
      ],
    },
    {
      step: '02',
      title: '筛选院校与专业',
      tag: '专业匹配 + 城市预算',
      text: '不要只按排名选校。本科阶段更要看课程模块、城市生活成本、住宿难度、升学方向和家庭预算。',
      checks: [
        '综合大学、理工大学、私立院校和专业学院定位不同。',
        '艺术、设计、建筑等方向通常要提前准备作品集。',
        '商科、计算机、工程等方向要留意数学或相关科目要求。',
      ],
    },
    {
      step: '03',
      title: '核对入学要求',
      tag: '成绩 + 英语 + 特殊要求',
      text: '同一所学校不同专业要求也可能不同。申请前要用目标课程页面逐条确认，而不是套用统一分数线。',
      checks: [
        '确认高中均分、会考、高考或国际课程成绩是否满足要求。',
        '确认雅思、托福、PTE 或学校认可的同等英语要求。',
        '确认是否需要面试、附加测试、推荐信或补充说明。',
      ],
    },
    {
      step: '04',
      title: '整理并递交材料',
      tag: '材料完整度决定审理效率',
      text: '材料要按学校格式和截止日期整理。英文翻译、命名方式、补件说明和在线系统填写都要保持一致。',
      checks: [
        '准备成绩单、在读/毕业证明、护照、语言成绩和申请表。',
        '如需个人陈述，内容要说明专业兴趣、学习准备和未来计划。',
        '转学分申请要补充课程大纲、学分、成绩和专业相关性说明。',
      ],
    },
    {
      step: '05',
      title: '跟进 offer 与补件',
      tag: '有条件录取要拆清楚',
      text: '本科 offer 常见条件包括最终成绩、毕业证明、英语成绩或押金截止日期。每个条件都要转成可执行节点。',
      checks: [
        '确认接受 offer 的方式、押金金额和截止日期。',
        '把语言补件、最终成绩补件和住宿申请放进同一时间线。',
        '不确定条件时及时向院校招生办公室确认。',
      ],
    },
    {
      step: '06',
      title: '签证、住宿与行前',
      tag: '录取后不是结束',
      text: '确认入读课程、缴费、住宿和签证材料后，再安排机票、保险、银行、接机和到校注册。',
      checks: [
        '超过 90 天的学习计划要关注课程是否符合爱尔兰学习许可要求。',
        '热门城市住宿紧张，拿到录取后应尽早启动申请。',
        '抵达后按要求完成注册、迎新和课程报到。',
      ],
    },
  ];

  readonly documentGroups: InfoGroup[] = [
    {
      icon: 'folder_copy',
      title: '基础申请材料',
      items: ['高中成绩单或当前阶段成绩单', '在读证明或毕业证明', '护照信息页', '学校申请表或在线申请信息'],
    },
    {
      icon: 'language',
      title: '英语与学术证明',
      items: ['雅思/托福/PTE 等英语成绩', '国际课程成绩或预估成绩', '课程描述或学分说明', '学校要求的附加测试材料'],
    },
    {
      icon: 'draw',
      title: '专业补充材料',
      items: ['个人陈述或学习计划', '艺术设计类作品集', '推荐信或面试准备', '转学分/专升本补充说明'],
    },
  ];

  readonly advisorNotes: AdvisorNote[] = [
    {
      icon: 'rule',
      title: '先判断路径，再谈学校',
      text: '本科阶段最容易出错的是把直入、预科、语言和转学分混在一起。路径错了，后面的时间线和预算都会变形。',
    },
    {
      icon: 'calendar_month',
      title: '把截止日期前移',
      text: '官网截止日期不是准备材料的起点。热门课程、住宿、签证和翻译认证都需要提前预留缓冲。',
    },
    {
      icon: 'payments',
      title: '预算要按城市算',
      text: '国立大学、理工大学和私立院校学费不同，城市住宿成本也不同。选校时要同步估算总费用。',
    },
  ];
}

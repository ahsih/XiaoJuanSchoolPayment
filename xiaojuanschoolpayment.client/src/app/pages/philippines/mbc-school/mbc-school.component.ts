import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

interface QuickFact {
  label: string;
  value: string;
}

interface CourseItem {
  title: string;
  lessons: string;
  text: string;
}

interface PriceRow {
  item: string;
  amount: string;
  note: string;
}

interface LocalFee {
  item: string;
  amount: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-mbc-school',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './mbc-school.component.html',
  styleUrls: ['../school-detail-layout.css', './mbc-school.component.css'],
})
export class MbcSchoolComponent {
  readonly quickFacts: QuickFact[] = [
    { label: '学校名称', value: 'Manila Business College' },
    { label: '城市', value: 'Sta. Cruz, Manila / Metro Manila' },
    { label: '学校定位', value: '商科、酒店管理、信息系统与国际学生衔接型学院' },
    { label: '招生状态', value: 'SY 2026-2027 正在招生' },
    { label: '办学认可', value: '获CHED、DepEd、TESDA相关认可' },
    { label: '住宿', value: '设有宿舍（dormitories），房型、费用和空位需当期确认' },
  ];

  readonly courses: CourseItem[] = [
    {
      title: 'Senior High School ABM',
      lessons: 'Accountancy, Business and Management方向',
      text:
        '适合希望以商业、会计、管理和企业运营为高中阶段学习方向的学生；国际学生需先确认年龄、学历文件和签证安排。',
    },
    {
      title: 'B.S. Business Administration - Marketing',
      lessons: '产品、品牌、销售、批发、市场规划与公关方向',
      text:
        '适合想走营销、销售、品牌和商业管理路线的学生。正式申请前需确认入学批次、学制、授课语言和学费。',
    },
    {
      title: 'B.S. Business Administration - Management',
      lessons: '管理、会计、财务、市场等商科基础组合',
      text:
        'Management方向覆盖多个传统商业领域，另设夜间班，适合需要灵活上课节奏的学生进一步了解。',
    },
    {
      title: 'B.S. Accountancy',
      lessons: '会计、审计、行业与政府财务方向',
      text:
        '适合希望进入会计、审计、企业财务或相关资格路径的学生。需确认入学门槛、科目安排和菲律宾执照相关规则。',
    },
    {
      title: 'B.S. Hospitality Management',
      lessons: '酒店、旅游、餐饮和服务业管理',
      text:
        '适合想结合马尼拉城市资源、酒店餐饮实践和服务业管理方向的学生；另设周末班。',
    },
    {
      title: 'B.S. Information Systems',
      lessons: 'ICT应用设计、开发、测试、实施和维护',
      text:
        '适合希望走商业信息系统、应用技术和行业数字化方向的学生，需确认课程是否仍按当前学年开放。',
    },
    {
      title: 'Night Class',
      lessons: 'BSBA Management夜间班',
      text:
        '适合需要兼顾工作、实习或其他日程的人。上课时间为周二至周五6-9pm，报名时应确认是否仍按该时段执行。',
    },
    {
      title: 'Weekend Class / TESDA Courses',
      lessons: '周末班与技能课程需按当期开放状态确认',
      text:
        '开设Hospitality Management周末班和TESDA Courses。学生应确认课程、名额、费用、证书和实习安排。',
    },
  ];

  readonly priceRows: PriceRow[] = [
    {
      item: '学费与杂费',
      amount: '需当期确认',
      note:
        '国际学生费用需按学年、课程、学制、杂费和付款节点向学校确认。',
    },
    {
      item: '注册 / 申请费用',
      amount: '需当期确认',
      note:
        '不同学生类别可能费用不同。国际学生还需确认文件审核、认证、公证和签证相关费用。',
    },
    {
      item: '奖学金项目',
      amount: '部分本地奖学金有固定金额',
      note:
        '奖学金条件包含菲律宾公民等要求，国际学生不能自动套用；需逐项确认资格。',
    },
    {
      item: '夜间班 / 周末班',
      amount: '需按课程确认',
      note:
        '学校设有夜间班和周末班，当前开放课程、学费和名额以学校招生回复为准。',
    },
    {
      item: '住宿 / Dormitory',
      amount: '需当期确认',
      note:
        '学校设有宿舍，房型、费用、餐食、门禁、押金和空位都需要单独确认。',
    },
    {
      item: '教材 / 制服 / 实验室',
      amount: '需按课程确认',
      note:
        '商科、会计、酒店管理、信息系统和TESDA技能课可能有不同教材、制服或实验室费用。',
    },
    {
      item: '国际学生签证与文件',
      amount: '需按国籍和学历背景确认',
      note:
        '招生页列出认证学历文件、无犯罪证明、个人历史陈述、护照/签证、资金证明等要求。',
    },
  ];

  readonly localFees: LocalFee[] = [
    { item: '申请文件认证', amount: '学历、无犯罪证明等可能需认证或翻译' },
    { item: '学生签证', amount: '按国籍、停留时长和学校协助范围确认' },
    { item: '学费与杂费', amount: '按课程、学期和学生类别核价' },
    { item: '教材与制服', amount: '按专业要求确认' },
    { item: '住宿押金', amount: '若申请dormitory，需确认押金和退费规则' },
    { item: '餐食与通勤', amount: '按住宿位置和上课时间估算' },
    { item: '保险 / 医疗', amount: '国际学生建议纳入预算' },
    { item: '改期 / 退款', amount: '付款前取得书面规则' },
  ];

  readonly accommodation = [
    'MBC校内设有classrooms、laboratories、canteens和dormitories等设施。',
    '宿舍的房型、费用、性别安排、餐食、门禁和空位需在申请前向学校确认。',
    '国际学生应在申请前确认宿舍是否开放给外国学生，以及是否需要提前缴纳押金或长期住宿费用。',
    '若学生只是想要传统菲律宾ESL宿舍、三餐和每日管理，应同时比较宿务、碧瑶或Clark语言学校。',
  ];

  readonly facilities = [
    'Classroom',
    'Kitchen',
    'Gym',
    'Student Lounge',
    'Computer Lab',
    'Library',
    'Auditorium',
    'Mock Hotel',
    'Laboratories',
    'Canteen',
    'Dormitories',
    'International student admission support',
  ];

  readonly audiences = [
    '想在马尼拉读商科、会计、酒店管理或信息系统方向的学生',
    '希望以学院课程或学历衔接为主，而不是短期ESL体验的人',
    '需要确认国际学生申请材料、签证和入学资格的人',
    '想比较MBC、Enderun、LPU-PLC等马尼拉学院型选项的人',
    '能接受城市通勤和学院生活，而非封闭式语言学校管理的人',
  ];

  readonly pros = [
    'SY 2026-2027 正在招生',
    '学校定位清楚，集中在商业、管理、酒店和信息系统方向',
    '招收本地和外国学生，国际学生申请材料要求明确',
    '设施包括课堂、厨房、健身房、学生休息室、电脑实验室、图书馆、礼堂和模拟酒店',
    '夜间班和周末班给需要灵活学习节奏的学生提供核对方向',
  ];

  readonly cons = [
    '不是传统ESL语言学校，不适合只想读短期口语和住宿制课程的人',
    '国际学生学费需向学校当期核价',
    '宿舍房型和费用需单独向学校确认',
    '部分奖学金条件面向菲律宾公民，国际学生不能自动适用',
    'Sta. Cruz / Manila City交通、住宿区域和安全感需结合实际地址评估',
  ];

  readonly faqs: FaqItem[] = [
    {
      question: 'Manila Business College是ESL语言学校吗？',
      answer:
        '不是典型的菲律宾ESL寄宿学校。它更适合作为商科、酒店管理、信息系统、国际学生衔接和马尼拉学院型学习选项来评估。',
    },
    {
      question: '国际学生可以申请吗？',
      answer:
        '可以。国际学生需准备认证学历记录、无犯罪证明、个人历史陈述、护照/签证、资金证明等材料，正式申请仍需学校确认资格和签证流程。',
    },
    {
      question: 'MBC有住宿吗？',
      answer:
        '学校设有宿舍（dormitories）。顾问需要先确认宿舍是否开放、房型、费用、押金、餐食、门禁和空位。',
    },
    {
      question: '费用可以直接按奖学金金额计算吗？',
      answer:
        '不建议。奖学金含本地学生条件，例如菲律宾公民要求。国际学生应以学校当期学费、杂费和申请回复为准。',
    },
    {
      question: '什么学生更适合MBC？',
      answer:
        '适合想在马尼拉读商科、管理、会计、酒店或信息系统，并愿意按学院申请流程准备材料的人。若目标是密集英语口语，应优先比较语言学校。',
    },
  ];
}

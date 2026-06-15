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
  reference: string;
  quoteCheck: string;
  note: string;
  basis: string;
}

interface LocalFee {
  item: string;
  amount: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

interface SourceLink {
  label: string;
  url: string;
}

@Component({
  selector: 'app-talk-school',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './talk-school.component.html',
  styleUrls: ['../cia-school/cia-school.component.css', './talk-school.component.css'],
})
export class TalkSchoolComponent {
  readonly quickFacts: QuickFact[] = [
    { label: '学校名称', value: 'TALK Academy' },
    { label: '城市', value: '历史资料多与菲律宾碧瑶 Baguio 相关' },
    { label: '公开状态', value: '官网当前为登录页，需向学校确认最新校区与招生' },
    { label: '顾问定位', value: '考试、TOEIC、多益、实用英语路线' },
    { label: '管理类型', value: '常作为半斯巴达 / 目标导向型学校比较' },
    { label: '适合方向', value: 'ESL、TOEIC、IELTS、Business、Working Holiday' },
  ];

  readonly courses: CourseItem[] = [
    {
      title: 'General ESL',
      lessons: '听说读写基础强化，课时需按当期确认',
      text: '适合想先补基础、建立英文句型和沟通信心的学生。报名时要确认一对一、团体课和自习安排是否仍按当前校区执行。',
    },
    {
      title: 'Power Speaking / Speaking ESL',
      lessons: '口语输出与表达训练',
      text: '适合想把英文用在面试、旅行、工作或日常沟通的人。建议核对是否有发音、讨论、简报和情境表达训练。',
    },
    {
      title: 'TOEIC Regular / Intensive',
      lessons: '多益听读、词汇、题型和模考',
      text: 'TALK常被顾问拿来和多益路线关联比较。适合求职、毕业门槛、企业英文或需要短期提高听读分数的学生。',
    },
    {
      title: 'TOEIC Guarantee',
      lessons: '保证班规则需逐项核对',
      text: '如果学生要报保证班，应先确认入学门槛、目标分、出勤率、模考频率、退费/补课规则和当前是否开班。',
    },
    {
      title: 'IELTS',
      lessons: '雅思听说读写与模考反馈',
      text: '适合已有考试目标的学生，但TALK是否为当前最优雅思选择要和PINES、JIC、MONOL、BECI等校一起比较。',
    },
    {
      title: 'Business / Working Holiday English',
      lessons: '职场、面试、简历、工作场景英文',
      text: '适合以就业、打工度假或职场沟通为目标的人。正式报价前要确认课程是否开放、老师配置和每周可入学日期。',
    },
  ];

  readonly priceRows: PriceRow[] = [
    {
      item: '招生状态',
      reference: '官网当前为登录页，公开资料有限',
      quoteCheck: '确认当前校区、是否招生、可入学日',
      note: '公开来源不足以直接承诺TALK当前在碧瑶的课程和房型，顾问需先拿到学校当期回复。',
      basis: '官网 / 顾问核价',
    },
    {
      item: '注册费',
      reference: '需以当期invoice确认',
      quoteCheck: '金额、缴费期限、是否可退',
      note: '菲律宾语言学校常有一次性注册费，但TALK当前金额不能用旧资料代替。',
      basis: '顾问核价',
    },
    {
      item: 'ESL / Speaking学费',
      reference: '按课程和周数报价',
      quoteCheck: '一对一比例、团体课、晚自习、可选课',
      note: '适合用来和WALES、BECI City、MONOL等更弹性的学校比较学习强度。',
      basis: '课程核价',
    },
    {
      item: 'TOEIC / IELTS学费',
      reference: '考试课程通常需单独报价',
      quoteCheck: '模考、教材、保证班规则、入学门槛',
      note: '若学生目标是多益分数，TALK可进入候选，但必须确认当前考试课程是否开放。',
      basis: '课程核价',
    },
    {
      item: '宿舍费',
      reference: '房型需按当前校区确认',
      quoteCheck: '单人/双人/多人房、校内或外部宿舍',
      note: '不要只用旧房型判断预算；房型空位会直接影响总价和体验。',
      basis: '住宿核价',
    },
    {
      item: '当地费用',
      reference: 'SSP、签证、ACR、教材、水电、押金等',
      quoteCheck: '按周数、签证状态和学校规则核算',
      note: '这些费用通常不含在公开起价中，适合在报价单中单独列出。',
      basis: '当地费用',
    },
    {
      item: '接机与交通',
      reference: '马尼拉/克拉克接送需确认',
      quoteCheck: '团体接机、个人接机、抵达日和车程',
      note: '如果当前校区不是碧瑶，接送路径和费用也会随之变化。',
      basis: '行前核价',
    },
  ];

  readonly localFees: LocalFee[] = [
    { item: 'SSP特别学习许可', amount: '按学习周数和学校当期标准确认' },
    { item: '签证延签', amount: '长期学习需按菲律宾移民规则计算' },
    { item: 'ACR I-Card', amount: '按停留周期和签证状态确认' },
    { item: '教材费', amount: 'TOEIC、IELTS等考试课程通常要另算教材' },
    { item: '押金 / 水电', amount: '按宿舍房型和学校规则结算' },
    { item: '接机费', amount: '按机场、团体/个人接送和日期确认' },
    { item: '校区差异', amount: '需确认当前是在碧瑶、克拉克或其他安排' },
    { item: '保证班条件', amount: '若报TOEIC/IELTS保证班，需核对出勤和模考规则' },
  ];

  readonly accommodation = [
    'TALK的住宿资料需要按当前校区重新确认，不建议只沿用旧版碧瑶房型做报价。',
    '顾问应先确认宿舍是校内、外部公寓还是合作宿舍，再比较单人、双人或多人房。',
    '考试目标学生要特别确认自习空间、安静度、门禁、洗衣、清扫和餐食安排。',
    '如果学生想要更高住宿舒适度，也可以同步比较MONOL、WALES或JIC Premium。',
  ];

  readonly facilities = [
    '一对一教室',
    '团体课教室',
    '自习空间',
    '模考与考试复盘安排',
    '学生宿舍',
    '餐厅或餐食安排',
    'Wi-Fi',
    '洗衣与清扫服务',
    '学生支持人员',
    '课程咨询与分级测试',
    '门禁与出勤管理',
    '机场接送安排',
  ];

  readonly audiences = [
    '目标是TOEIC、多益分数、求职英文或毕业门槛的学生',
    '希望以考试和实用英文为主，不只做轻松口语体验的人',
    '能接受顾问先确认当前校区与课程状态，再决定是否报名的人',
    '想把TALK和PINES、JIC、BECI、MONOL等碧瑶学校放在同一张表里比较的人',
    '需要较明确学习目标、模考反馈和阶段成果检查的学生',
  ];

  readonly pros = [
    'TALK在中文顾问语境中常被归入TOEIC、多益和实用英文路线，适合考试目标学生进入候选名单',
    '课程方向可围绕ESL、TOEIC、IELTS和职场英文做目标化比较',
    '如果当前仍开放考试课程，适合短中期冲分、求职或毕业门槛需求',
    '页面以核价清单呈现，能帮助学生避免只看旧资料或单一低价做决定',
    '适合和PINES、JIC、BECI、MONOL、WALES做“目标导向”横向比较',
  ];

  readonly cons = [
    '当前公开官网为登录页，公开资料不如PINES、BECI、MONOL、WALES完整',
    'Nanqi公开目录目前把TALK列在Clark分类下，是否仍按碧瑶学校销售必须先确认',
    '若学生马上需要明确价格表，TALK需要先等学校或代理回传当期课程/房型报价',
    '住宿、校区、接送和当地费用都不能用旧资料直接承诺',
    '如果目标是雅思高强度冲刺，建议同时比较更透明的PINES、JIC和MONOL课程信息',
  ];

  readonly faqs: FaqItem[] = [
    {
      question: 'TALK Academy现在还在碧瑶招生吗？',
      answer: '需要向学校或授权渠道确认。当前公开官网主要是登录页，Nanqi目录把TALK列在Clark分类下，因此顾问不应直接承诺碧瑶校区状态。',
    },
    {
      question: 'TALK最适合什么目标？',
      answer: '更适合把TOEIC、多益、实用英文、求职英文或考试型学习作为目标的学生。若只是轻松生活口语，也可以比较WALES、MONOL或BECI City。',
    },
    {
      question: '为什么页面没有写固定价格？',
      answer: '因为公开来源不足以确认TALK当前课程和房型价目。为了避免误导，本页把费用拆成必须核价的项目，等学校回信后再填入正式报价。',
    },
    {
      question: 'TALK和PINES、JIC怎么比？',
      answer: '如果目标是TOEIC或职场实用英文，TALK可以进入候选；如果目标是IELTS保证班、强管理或公开资料透明度，PINES和JIC通常更容易先做报价比较。',
    },
    {
      question: '顾问会怎么建议TALK？',
      answer: '先确认当前校区和开课状态，再看学生目标。如果TALK当期考试课程和宿舍合适，就纳入比较；如果信息不完整，应优先推荐资料更透明、空位更明确的学校。',
    },
  ];

  readonly sources: SourceLink[] = [
    { label: 'TALK Academy官方登录页', url: 'https://talk-academy.com/' },
    { label: 'Feifan碧瑶学校列表', url: 'https://feifanstudy.com/city/%E7%A2%A7%E7%91%A4' },
    { label: 'Nanqi菲律宾学校目录', url: 'https://www.nanqi.org/' },
    { label: 'iOutback菲律宾游学', url: 'https://www.ioutback.com/' },
    { label: '大洋游学', url: 'http://www.dayang101.com/' },
    { label: '格仲游学', url: 'https://gezhong.com.tw/' },
  ];
}

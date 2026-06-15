import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

interface QuickFact {
  label: string;
  value: string;
}

interface CandidateItem {
  name: string;
  status: string;
  signal: string;
  check: string;
}

interface CourseItem {
  title: string;
  lessons: string;
  text: string;
}

interface PriceRow {
  item: string;
  publicSignal: string;
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
  selector: 'app-manila-legacy-esl',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './manila-legacy-esl.component.html',
  styleUrls: ['../cia-school/cia-school.component.css', './manila-legacy-esl.component.css'],
})
export class ManilaLegacyEslComponent {
  readonly quickFacts: QuickFact[] = [
    { label: '页面主题', value: 'CNN / C21 / PICO 等旧马尼拉 ESL 候选' },
    { label: '城市', value: 'Quezon City / Metro Manila 历史候选' },
    { label: '页面定位', value: '旧资料复核页，不等同于当前招生承诺' },
    { label: '可查线索', value: 'Feifan仍列CNN；C21/PICO需重新查证' },
    { label: '可能方向', value: 'General ESL、考试英语、Business、Junior、宿舍制' },
    { label: '顾问动作', value: '先确认运营、校区、课程、房型和报价，再决定是否推荐' },
  ];

  readonly candidates: CandidateItem[] = [
    {
      name: 'CNN',
      status: '可查到第三方详细页，但仍要二次核验',
      signal:
        'Feifan当前马尼拉分类列出CNN，并在学校页保留半斯巴达、Quezon City、课程、设施、宿舍和起价信息。',
      check:
        'CNN旧官网域名当前呈现内容已不是清晰学校官网，报名前必须确认官方招生窗口、付款主体和最新价目表。',
    },
    {
      name: 'C21',
      status: '旧马尼拉ESL候选名，当前公开资料不足',
      signal:
        '常见于旧选校口径或历史候选清单，但在当前可读主流目录中没有稳定学校页可直接作为招生依据。',
      check:
        '先查证是否停招、更名、迁移或转型，再确认地址、课程、住宿和费用，不能只凭旧资料报价。',
    },
    {
      name: 'PICO',
      status: '旧马尼拉ESL候选名，当前公开资料不足',
      signal:
        '当前搜索和目录线索较弱，更适合作为顾问内部复核项，而不是直接展示为可报名学校。',
      check:
        '需要确认是否仍有授权代理、实际校区、学生宿舍、招生日期和退款规则，再判断是否保留在推荐池。',
    },
  ];

  readonly courses: CourseItem[] = [
    {
      title: 'General ESL',
      lessons: '日常听说读写、一对一和团体课组合',
      text:
        'CNN第三方资料中可见一般英语课程、一对一、小团体、大团体和选修课安排。C21/PICO若要比较，也必须先确认当前是否仍开设基础ESL。',
    },
    {
      title: 'Intensive / Premium ESL',
      lessons: '更高一对一比例，适合短期强化',
      text:
        '旧马尼拉ESL资料常以密集课程和生活化练习作为卖点，但当前课时、教材、分级和开课日需要逐项向学校确认。',
    },
    {
      title: 'TOEIC',
      lessons: '多益听读、口说、词汇、语法和模考',
      text:
        'CNN公开第三方资料有TOEIC课程说明。若学生以求职或毕业门槛为目标，应确认是否仍有多益课程、模考频率和教师配置。',
    },
    {
      title: 'TOEFL / IELTS',
      lessons: '考试英语和升学英文方向',
      text:
        '旧资料提过托福和雅思方向，但马尼拉不是最典型的长期备考城市。若目标是冲分，应同步比较碧瑶PINES、JIC、MONOL和BECI。',
    },
    {
      title: 'Business English',
      lessons: '面试、会议、商业写作和职场表达',
      text:
        '马尼拉的城市资源适合商务场景。若这些旧候选无法确认，也可以转向Enderun、American English或Berlitz等城市培训选项。',
    },
    {
      title: 'Junior / Family / Short Stay',
      lessons: '青少年、亲子或短期体验需谨慎核验',
      text:
        '若学生是未成年或亲子同行，必须先确认监护、宿舍、门禁、医疗、安全区域、接送和周末活动，不建议使用旧页面直接报名。',
    },
  ];

  readonly priceRows: PriceRow[] = [
    {
      item: '当前招生状态',
      publicSignal: 'CNN有第三方页面；C21/PICO线索弱',
      quoteCheck: '学校是否仍招生、是否仍在原校区、是否有授权报名窗口',
      note:
        '这是本页最重要的第一步。状态未确认前，不应该向学生承诺空位、价格或入学日期。',
      basis: '运营核验',
    },
    {
      item: '课程学费',
      publicSignal: 'Feifan CNN卡片显示NTD$ 8,700起/周',
      quoteCheck: '按课程、周数、一对一比例、是否考试课重新核价',
      note:
        '起价只能当作旧资料线索，不能直接用于报价。正式预算应以学校当期invoice为准。',
      basis: '课程核价',
    },
    {
      item: '注册费',
      publicSignal: '旧ESL学校通常另收一次性注册费',
      quoteCheck: '金额、付款币种、是否可退、付款对象',
      note:
        '旧学校尤其要核对收款账户和合同主体，避免域名或代理资料过期造成付款风险。',
      basis: '报名核价',
    },
    {
      item: '住宿费',
      publicSignal: 'CNN第三方资料列过中央宿舍单/双/三人房',
      quoteCheck: '当前开放房型、校内或外部宿舍、空位、性别楼层',
      note:
        '房型和校区最容易随时间变化。C21/PICO不能用旧房型直接估算总价。',
      basis: '住宿核价',
    },
    {
      item: '餐食和洗衣',
      publicSignal: '旧资料常把食宿服务与课程打包介绍',
      quoteCheck: '餐数、周末餐、饮食限制、洗衣清洁频率',
      note:
        '马尼拉城市生活成本和通勤方式差异大，若不是校内宿舍，要另外计算餐食和交通。',
      basis: '生活费',
    },
    {
      item: 'SSP / 签证 / ACR',
      publicSignal: '菲律宾语言学习常见当地费用',
      quoteCheck: '按国籍、停留周数、入境状态和学校规则确认',
      note:
        '长期学习必须确认SSP、签证延签、ACR I-Card、保险和是否需要额外文件。',
      basis: '当地费用',
    },
    {
      item: '接机和交通',
      publicSignal: 'Metro Manila交通时间波动大',
      quoteCheck: '机场、抵达时间、接送方式、校区距离和安全路线',
      note:
        '不要只看地图距离。Quezon City、Makati、Taguig和Manila City通勤体验差异明显。',
      basis: '行前核价',
    },
    {
      item: '退款和改期',
      publicSignal: '旧资料通常不足以判断当前条款',
      quoteCheck: '开课前退款、到校后退款、改期、停课和转校规则',
      note:
        '旧候选学校必须先拿到书面条款，再让学生付款。',
      basis: '风险核验',
    },
  ];

  readonly localFees: LocalFee[] = [
    { item: 'SSP特别学习许可', amount: '按学校当前规则和学习周数确认' },
    { item: '签证延签', amount: '按国籍、停留天数和入境政策计算' },
    { item: 'ACR I-Card', amount: '长周期学习需确认是否适用' },
    { item: '教材费', amount: 'ESL、TOEIC、TOEFL、IELTS教材可能不同' },
    { item: '押金 / 水电', amount: '住宿制学校常见，退费规则需写清' },
    { item: '洗衣 / 清洁', amount: '校内宿舍和外部公寓规则不同' },
    { item: '机场接送', amount: '按抵达机场、时间和人数确认' },
    { item: '城市交通', amount: '若非校内住宿，需要加入每日通勤预算' },
  ];

  readonly accommodation = [
    'CNN第三方资料曾列出中央宿舍单人、双人和三人房，并提到房内设备，但这些内容仍需按当期校区和房源重新确认。',
    'C21/PICO目前不适合直接沿用旧网文中的房型或宿舍描述；应先确认学校是否仍有宿舍制安排。',
    '若学生重视安全感、门禁、餐食和清洁，顾问应要求学校提供当前宿舍照片、房型表、入住规则和退房规则。',
    '如果无法取得书面住宿确认，建议转看资料更透明的宿务、碧瑶或Clark住宿制学校。',
  ];

  readonly facilities = [
    '一对一教室',
    '团体课教室',
    '自习室',
    '学生宿舍',
    '餐厅或餐食安排',
    'Wi-Fi',
    '图书馆或学习区',
    '公用电脑或学习设备',
    '医务室或学生支持',
    '健身房 / 游泳池等休闲设施',
    '门禁与宿舍管理',
    '机场接送安排',
  ];

  readonly audiences = [
    '想了解旧马尼拉寄宿制ESL学校，但愿意先等待顾问核验的人',
    '需要把CNN与LPU-PLC、Enderun、American English、Berlitz等马尼拉选项一起比较的人',
    '短期停留马尼拉，希望确认是否还有住宿制ESL可能性的成人学生',
    '预算初筛阶段，需要知道哪些旧资料不能直接信的人',
    '不急着付款，愿意先确认官网、校区、合同和invoice的人',
  ];

  readonly pros = [
    'CNN仍能查到较完整的第三方资料，可作为核验清单的起点',
    '若学校状态确认有效，马尼拉住宿制ESL可减少从机场转往外地的交通时间',
    '旧候选适合帮助顾问排查“是否还有可用马尼拉ESL资源”',
    '课程方向覆盖基础ESL、考试英语、商务英语和短期强化，理论上可满足多种目标',
    '页面把风险点拆开，能避免学生只凭旧价格或旧照片做决定',
  ];

  readonly cons = [
    'C21/PICO当前公开资料不足，不适合直接展示为可报名学校',
    'CNN旧官网域名当前不是清晰学校官网，必须确认官方招生渠道',
    '第三方页面价格、房型、课程和设施可能已经过期',
    'Metro Manila交通拥堵和区域安全感差异大，住宿位置比学校名更重要',
    '若需要确定空位、确定价格和完整服务，通常宿务、碧瑶或Clark会更容易操作',
  ];

  readonly faqs: FaqItem[] = [
    {
      question: 'CNN、C21、PICO现在都还能报名吗？',
      answer:
        '不能这样直接假设。CNN仍能查到第三方学校页，但官网域名状态需要复核；C21和PICO目前公开线索不足，应先确认是否仍运营、是否更名、是否迁校或停招。',
    },
    {
      question: '为什么还要做这个页面？',
      answer:
        '因为学生和顾问经常会在旧资料中看到这些名字。本页的作用是把它们放进“复核池”，说明哪些信息可参考、哪些必须重新确认，而不是直接当成可报名学校销售。',
    },
    {
      question: 'CNN页面上的起价可以直接报价吗？',
      answer:
        '不建议。Feifan页面显示过CNN起价，但正式报价必须重新确认当前课程、房型、周数、当地费用、优惠和付款规则。',
    },
    {
      question: '如果我想要马尼拉住宿制ESL，顾问会怎么做？',
      answer:
        '顾问会先确认CNN/C21/PICO是否仍可招生，再同步比较LPU-PLC、Enderun、American English或其他城市课程。如果住宿制资料不透明，会建议转向宿务、碧瑶或Clark。',
    },
    {
      question: '哪些学生不适合这些旧候选？',
      answer:
        '需要马上付款、马上拿确认书、未成年亲子同行、预算不能波动，或必须要确定校内宿舍和严格管理的学生，不适合用旧候选作为第一推荐。',
    },
  ];

  readonly sources: SourceLink[] = [
    { label: 'Feifan马尼拉学校列表', url: 'https://feifanstudy.com/city/%E9%A6%AC%E5%B0%BC%E6%8B%89' },
    { label: 'Feifan CNN学校页', url: 'https://feifanstudy.com/schools/65-cnn' },
    { label: 'CNN旧官网域名当前页面', url: 'https://www.cnn-speakers.com/' },
    { label: 'Nanqi菲律宾学校目录', url: 'https://www.nanqi.org/' },
    { label: 'iOutback菲律宾游学入口', url: 'https://www.ioutback.com/' },
    { label: '大洋游学', url: 'http://www.dayang101.com/' },
    { label: '格仲游学', url: 'https://gezhong.com.tw/' },
  ];
}

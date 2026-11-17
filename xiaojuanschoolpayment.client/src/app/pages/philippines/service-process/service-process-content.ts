// Text of the public page /philippines-study/service-process (菲律宾游学报名及抵达全流程指引).
// Pure data only (no Angular, DOM or storage), so the same steps also feed the page's HowTo
// structured data and could be reused by the WeChat mini program later.

export const SERVICE_PROCESS_PATH = '/philippines-study/service-process';

export interface ServiceProcessStep {
  number: number;
  title: string;
  text: string;
  /** Optional timing label shown as a tag under the step; omitted when the step has none. */
  time?: string;
}

export interface ServiceProcessStage {
  number: string;
  title: string;
  range: string;
  /** Material icon ligature name. */
  icon: string;
  steps: ServiceProcessStep[];
}

export interface ServiceProcessMilestone {
  label: string;
  text: string;
}

export interface ServiceProcessConsultant {
  name: string;
  focus: string;
  phone: string;
  phoneDisplay: string;
}

export interface ServiceProcessChannel {
  icon: string;
  label: string;
  value: string;
}

export const SERVICE_PROCESS = {
  eyebrow: '思达启航标准',
  eyebrowEnglish: 'SIDA QIHANG STANDARD',
  titleAccent: '菲律宾游学',
  titleRest: '报名及抵达全流程指引',
  description:
    '思达启航菲律宾游学标准服务流程：报名与注册、签证与机票、行前准备冲刺、抵达到回国，4个阶段15个步骤，以入学日为基准倒推关键时间节点。',
  promises: ['0 中介费', '价格不高于学校直报', '全程保价 · 差价可退', '免费协助办签证', '赠送菲律宾电话卡', '在校全程协助'],
  stages: [
    {
      number: '01',
      title: '报名与注册',
      range: 'STEP 1–4',
      icon: 'description',
      steps: [
        { number: 1, title: '付定金 · 发护照', text: '付定金后，将护照发给思达启航' },
        { number: 2, title: '注册学位', text: '付定金后，思达启航为学生向学校注册学位' },
        { number: 3, title: '签订合同', text: '学生与思达启航签订服务合同' },
        { number: 4, title: '发入学通知书', text: '思达启航发送入学通知书（Offer）、学生报价单及假期表' },
      ],
    },
    {
      number: '02',
      title: '签证与机票',
      range: 'STEP 5–7',
      icon: 'flight',
      steps: [
        { number: 5, title: '购买机票', text: '根据开课日期，自行购买机票' },
        { number: 6, title: '办理签证', text: '思达启航免费协助办理，宜早不宜迟', time: '入学前 90 天起可办' },
        { number: 7, title: '支付尾款', text: '按学校要求时间，付清剩余费用', time: '入学前 2–4 周' },
      ],
    },
    {
      number: '03',
      title: '行前准备冲刺',
      range: 'STEP 8–11',
      icon: 'luggage',
      steps: [
        { number: 8, title: '备齐行李物品', text: '思达启航发送《游学必备清单》' },
        { number: 9, title: '领取赠送电话卡', text: '思达启航免费赠送，快递给学生', time: '入学前 1 周' },
        { number: 10, title: 'E-travel 代填', text: '思达启航代填，填好发给学生', time: '出发前 3 天内' },
        {
          number: 11,
          title: '购买境外保险',
          text: '可自行购买，也可由思达启航推荐学生常买、保障较全的方案',
          time: '入学前 2 天',
        },
      ],
    },
    {
      number: '04',
      title: '抵达到回国',
      range: 'STEP 12–15',
      icon: 'school',
      steps: [
        { number: 12, title: '出入境通关', text: '了解海关注意事项，顺利通关' },
        { number: 13, title: '到校报到', text: '了解到校后注意事项，快速适应校园生活' },
        { number: 14, title: '在校协助', text: '换老师、换宿舍、兑换菲律宾比索等日常问题，都可以找思达启航协助' },
        { number: 15, title: '平安回国', text: '学成归来，期待你分享这段旅程的收获' },
      ],
    },
  ] as ServiceProcessStage[],
  timelineTitle: '关键时间节点',
  timelineSubtitle: '以入学日为基准倒推',
  timelineNote: '* 具体时间以学校安排及签证政策为准',
  timeline: [
    { label: '报名', text: '付定金 · 发护照' },
    { label: '入学前 90 天', text: '可开始办签证' },
    { label: '入学前 2–4 周', text: '付清尾款' },
    { label: '入学前 1 周', text: '收到赠送电话卡' },
    { label: '出发前 3 天内', text: 'E-travel 代填' },
    { label: '入学前 2 天', text: '买境外保险' },
    { label: '入学日', text: '抵达学校报到' },
    { label: '平安回国', text: '开启下一站' },
  ] as ServiceProcessMilestone[],
  closingTitle: '菲律宾，只是起点',
  closingText: '线上一对一课程 · 欧美进阶学习 · 出国留学，思达启航继续陪你走下去',
  contactHeading: '联系思达启航',
  slogan: '极致利他，成人达己',
  // The official-website line of the source design is left out: visitors are already on sidaqihang.com.
  channels: [
    { icon: 'grid_view', label: '小程序', value: '思达启航留学与游学' },
    { icon: 'chat_bubble_outline', label: '公众号', value: '思达国际课堂' },
    { icon: 'place', label: '', value: '深圳总部 · 菲律宾、英国驻点' },
  ] as ServiceProcessChannel[],
  consultantsHeading: '咨询顾问 · 一对一解答',
  consultants: [
    { name: 'Perrin 李老师', focus: '菲律宾/东南亚', phone: '15367659331', phoneDisplay: '153 6765 9331' },
    { name: 'Lemon 李老师', focus: '多国规划', phone: '13298529856', phoneDisplay: '132 9852 9856' },
    { name: 'Jenny 易老师', focus: '英国/爱尔兰', phone: '13249827686', phoneDisplay: '132 4982 7686' },
  ] as ServiceProcessConsultant[],
};

/** schema.org HowTo for the page, one HowToSection per stage and one HowToStep per step. */
export function buildServiceProcessHowTo(origin: string): Record<string, unknown> {
  const url = `${origin}${SERVICE_PROCESS_PATH}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    '@id': `${url}#howto`,
    name: `${SERVICE_PROCESS.titleAccent}${SERVICE_PROCESS.titleRest}`,
    description: SERVICE_PROCESS.description,
    url,
    inLanguage: 'zh-CN',
    publisher: { '@id': `${origin}/#organization` },
    step: SERVICE_PROCESS.stages.map((stage, index) => ({
      '@type': 'HowToSection',
      position: index + 1,
      name: stage.title,
      itemListElement: stage.steps.map((step) => ({
        '@type': 'HowToStep',
        position: step.number,
        name: step.title,
        text: step.time ? `${step.text}（${step.time}）` : step.text,
        url: `${url}#step-${step.number}`,
      })),
    })),
  };
}

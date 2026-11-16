// Text of the shared "为什么通过思达启航报名…" section (SidaWhySectionComponent), parameterized by
// school. Pure data only: the website component renders it, and the WeChat mini program export
// (src/app/mini-program/shared-sections.ts) uses the same function, so every school's guarantee
// section is written once.

export interface SidaWhyOptions {
  supportTitle?: string;
  supportBadge?: string;
  /** The long variant with the gratitude panel and alumni benefits. */
  detailed?: boolean;
}

export interface SidaWhyReason {
  number: string;
  title: string;
  text: string;
  image: string;
  alt: string;
}

export interface SidaWhyContent {
  eyebrow: string;
  title: string;
  intro: string;
  mainImage: string;
  mainImageAlt: string;
  photoCaption: string;
  gratitude: {
    eyebrow: string;
    title: string;
    quote: string;
    text: string;
    values: Array<{ icon: string; text: string }>;
  };
  reasons: SidaWhyReason[];
  trustBadges: Array<{ icon: string; label: string }>;
  alumni: {
    eyebrow: string;
    title: string;
    intro: string;
    items: Array<{ number: string; icon: string; title: string; text: string }>;
    note: string;
  };
}

export function sidaWhyContent(schoolName = '菲律宾学校', options: SidaWhyOptions = {}): SidaWhyContent {
  const detailed = options.detailed === true;
  const supportTitle = options.supportTitle ?? '深圳总部 + 菲律宾当地支持';
  const supportBadge = options.supportBadge ?? '深圳总部 + 菲律宾支持';
  return {
    eyebrow: detailed ? 'SIDA SERVICE GUARANTEE' : 'WHY SIDA QIHANG',
    title: detailed ? `为什么学生更放心找思达启航报名${schoolName}？` : `为什么通过思达启航报名${schoolName}？`,
    intro: detailed
      ? '不是一句“全程服务”，而是把选校判断、费用、合同和境内外支持做成看得见的保障。'
      : '不只是提交报名，更重要的是帮你选对学校、算清费用，并持续协助到完成学习回国。',
    mainImage: 'assets/cia/sida-why-main-branded.webp',
    mainImageAlt: `思达启航顾问为${schoolName}学生讲解报名方案`,
    photoCaption: `每一份 ${schoolName} 方案，都从听懂你的目标和顾虑开始`,
    gratitude: {
      eyebrow: '我们的初心 · 极致利他，成人达己',
      title: '感恩每一份信任，我们会认真接住你的托付',
      quote: '我们始终相信：只有学生真正选对学校、学有所获、走得更远，思达启航才能走得长久。谢谢你把这段重要的旅程交给我们。',
      text: '我们不会用漂亮话代替服务：该说明的费用和规则提前说清楚，该落实的合同、材料与境外衔接逐项落实；报名之后，也会继续关注你的学习和生活。',
      values: [
        { icon: 'record_voice_over', text: '先认真听你说' },
        { icon: 'handshake', text: '答应你的认真做到' },
        { icon: 'volunteer_activism', text: '报名之后继续负责' },
      ],
    },
    reasons: [
      {
        number: '01',
        title: '正式合同与官方授权',
        text: '国内公司签约，学校报价、录取文件及收费凭证均可核验。',
        image: 'assets/cia/sida-why-action-contract.webp',
        alt: `思达启航为${schoolName}学生核验合同与授权文件`,
      },
      {
        number: '02',
        title: '费用提前算清，同条件保价',
        text: '0中介服务费，学费、住宿费及当地费用提前说明。',
        image: 'assets/cia/sida-why-action-fees.webp',
        alt: `思达启航顾问核算${schoolName}费用`,
      },
      {
        number: '03',
        title: '从所有适合的学校中帮你筛选',
        text: '根据目标、预算、基础和管理偏好，分析各校优缺点与价格。',
        image: 'assets/cia/sida-why-action-selection.webp',
        alt: `思达启航顾问协助筛选${schoolName}方案`,
      },
      {
        number: '04',
        title: '出发前每一步有人提醒',
        text: '签证、eTravel、入学文件、付款、机票、保险及接机逐项提醒。',
        image: 'assets/cia/sida-why-action-departure.webp',
        alt: '菲律宾游学出发资料与手机提醒',
      },
      {
        number: '05',
        title: '服务持续到完成学习回国',
        text: '换老师、课程、住宿、账单、续读或转校问题继续协助。',
        image: 'assets/cia/sida-why-action-followup.webp',
        alt: '思达启航顾问持续跟进学生学习',
      },
      {
        number: '06',
        title: supportTitle,
        text: detailed ? '国内统筹与境外工作人员协作，重要情况有人跟进。' : '国内顾问与菲律宾工作人员协作，重要情况有人跟进。',
        image: 'assets/cia/sida-why-action-team.webp',
        alt: detailed ? '思达启航菲律宾和欧洲驻点团队' : '思达启航菲律宾和深圳服务团队',
      },
    ],
    trustBadges: [
      { icon: 'description', label: '国内正式公司合同' },
      { icon: 'verified_user', label: '官方授权合作' },
      { icon: 'local_offer', label: '费用透明与同条件保价' },
      { icon: 'apartment', label: supportBadge },
    ],
    alumni: {
      eyebrow: '学习结束，服务继续',
      title: '老学员回国后福利',
      intro: '继续学习英语或规划下一阶段升学时，可申请思达老学员专属权益。',
      items: [
        { number: '01', icon: 'record_voice_over', title: '一对一线上英语', text: '老学员可享线上一对一英语课程专属优惠。' },
        { number: '02', icon: 'school', title: '爱尔兰继续深造', text: '申请爱尔兰留学，可享思达专属奖学金或项目优惠。' },
        { number: '03', icon: 'flight_takeoff', title: '欧美国家英语进修', text: '继续到欧美国家学习英语，部分合作学校可免注册费或享专属优惠。' },
      ],
      note: '具体奖学金、减免范围和适用条件，以申请时合作学校及思达启航确认的当期政策为准。',
    },
  };
}

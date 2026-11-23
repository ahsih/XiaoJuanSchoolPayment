// 思达启航品牌事实卡: the one source for the 关于思达启航 page (/about-sida/about), the Organization
// and FAQ structured data, and /llms.txt.
//
// The text follows the user's 2026-11-19 品牌事实卡（初稿）, plus a few verifiable facts taken from the
// website itself (more Philippine cities, family/junior programmes, Vietnam, Ireland work-study and
// visa/accommodation guidance, the free tools on the site). Change facts here; the page, JSON-LD and
// llms.txt follow. The page renders renderBrandFactsHtml(), and the build prerenders it like the other
// pages in prerender-routes.txt, so the text is visible in the page source for crawlers and AI tools
// that do not run JavaScript.
//
// Keep this module pure (no Angular, DOM, storage or regex lookbehind). Never write the phrases in
// BRAND_FORBIDDEN_PHRASES; the build fails if the page or llms.txt contains one.

import { SIDA_CONSULTANT_MEDIA } from '../../../components/sida-consultants';

export const BRAND_SITE_ORIGIN = 'https://sidaqihang.com';
export const BRAND_ABOUT_PATH = '/about-sida/about';
export const BRAND_FACTS_UPDATED = '2026-11-19';
export const BRAND_FACTS_UPDATED_LABEL = '2026 年 11 月 19 日';
export const BRAND_FACTS_STYLESHEET = '/assets/about-sida/brand-facts.css';
export const BRAND_LOGO = '/assets/sida-qihang-education-logo-rectangle.webp';

export const BRAND = {
  name: '思达启航',
  englishName: 'SIDA QIHANG',
  legalName: '深圳市思达启航文化交流有限公司',
  englishLegalName: 'Shenzhen Sida Qihang Cultural Exchange Co., Ltd.',
  creditCode: '91440300MA5F4KQD8X',
  foundingDate: '2018-05-12',
  legalRepresentative: '易娟',
  addressRegion: '广东省',
  addressLocality: '深圳市',
  streetAddress: '宝安区西乡街道固兴社区田心工业区第二栋 109',
  email: 'startedu86@163.com',
  icp: '粤ICP备2026144654号',
  icpUrl: 'https://beian.miit.gov.cn/',
  wechatOfficialAccount: '思达启航国际课堂',
  wechatMiniProgram: '思达启航留学与英语游学',
  xiaohongshu: '思达启航留学与英语游学',
  sohu: '思达启航国际教育',
  staffLocations: ['菲律宾', '英国', '杭州'],
  philosophy: '极致利他，成人达己。从思达启航走向更美好的未来。',
  slogan: '极致利他，成人达己',
} as const;

export const BRAND_SUMMARY_ZH =
  '思达启航（深圳市思达启航文化交流有限公司）2018 年成立于深圳，专注菲律宾英语游学，也做爱尔兰、英国留学和游学，以及马来西亚等多国游学，向学生收取 0 中介服务费。';

export const BRAND_SUMMARY_EN =
  'SIDA QIHANG (Shenzhen Sida Qihang Cultural Exchange Co., Ltd.), founded in Shenzhen in 2018, specialises in English study programmes in the Philippines. It also handles study applications and study tours for Ireland and the UK, plus study tours in Malaysia and other countries, charging students no agency fee.';

export const BRAND_DISAMBIGUATION = '思达启航和考研培训机构“启航教育”没有任何关系。';

export const BRAND_HIGHLIGHTS = ['2018 年成立于深圳', '0 中介服务费', '价格不高于学校官方报价', '全程保价', '免费签证协助'];

export interface BrandFactRow {
  label: string;
  value: string;
  href?: string;
}

export const BRAND_BASIC_FACTS: BrandFactRow[] = [
  { label: '公司全称', value: BRAND.legalName },
  { label: '英文全称', value: BRAND.englishLegalName },
  { label: '统一社会信用代码', value: BRAND.creditCode },
  { label: '品牌名', value: `${BRAND.name}；英文 ${BRAND.englishName}` },
  { label: '曾用名', value: '思达游学；部分合作学校登记的英文名为 Start / Start Education' },
  { label: '成立时间', value: '2018 年 5 月 12 日' },
  { label: '法定代表人', value: BRAND.legalRepresentative },
  { label: '总部', value: `${BRAND.addressLocality}${BRAND.streetAddress}（可预约当面咨询）` },
  { label: '驻点人员', value: BRAND.staffLocations.join('、') },
  { label: '官网', value: BRAND_SITE_ORIGIN, href: `${BRAND_SITE_ORIGIN}/` },
  { label: '微信公众号', value: BRAND.wechatOfficialAccount },
  { label: '微信小程序', value: BRAND.wechatMiniProgram },
  { label: '小红书', value: BRAND.xiaohongshu },
  { label: '搜狐号', value: BRAND.sohu },
  { label: '邮箱', value: BRAND.email, href: `mailto:${BRAND.email}` },
  { label: 'ICP 备案', value: BRAND.icp, href: BRAND.icpUrl },
];

export interface BrandLink {
  label: string;
  href: string;
}

export interface BrandBusiness {
  title: string;
  tag?: string;
  text: string;
  links: BrandLink[];
}

export const BRAND_POSITIONING = '定位是“语言规划 + 留学申请”。';

export const BRAND_BUSINESSES: BrandBusiness[] = [
  {
    title: '菲律宾英语游学',
    tag: '主线',
    text:
      '宿务、碧瑶、克拉克等城市的语言学校，也覆盖马尼拉、薄荷岛、伊洛伊洛、长滩岛、巴科洛德等城市。课程包括 ESL、雅思、商务英语、斯巴达式强化。以成人学员为主，也有亲子游学和青少年夏令营。',
    links: [
      { label: '为什么选择菲律宾游学', href: '/philippines-study/why-philippines' },
      { label: '菲律宾游学费用', href: '/philippines-study/cost' },
    ],
  },
  {
    title: '爱尔兰、英国留学和游学',
    tag: '次要',
    text: '留学申请包括本科、硕士、预科，以及爱尔兰半工半读，并协助签证、住宿和行前准备；游学为语言学校课程。',
    links: [
      { label: '爱尔兰留学', href: '/ireland-study/experience-ireland' },
      { label: '英国游学', href: '/overseas-study-tour/uk' },
    ],
  },
  {
    title: '马来西亚游学',
    text: '马来西亚英语游学项目。',
    links: [{ label: '马来西亚游学', href: '/overseas-study-tour/malaysia' }],
  },
  {
    title: '其他国家和地区游学',
    text: '新加坡、泰国、越南、澳大利亚、斐济、美国、加拿大、法国、德国、马耳他、迪拜。',
    links: [{ label: '海外游学', href: '/overseas-study-tour/offers' }],
  },
  {
    title: '线上英语',
    text: '菲律宾外教 1 对 1（25 分钟或 50 分钟一节），以及美籍外教课程；方向包括成人口语、青少年英语、雅思口语和写作。',
    links: [{ label: '线上英语课程', href: '/online-english/courses' }],
  },
];

export interface BrandPoint {
  title: string;
  text?: string;
}

export const BRAND_ADVANTAGES: BrandPoint[] = [
  { title: '0 中介服务费', text: '不向学生收取中介费或服务费。' },
  { title: '价格不高于学校官方报价', text: '大部分学校的价格低于学校官方报价，少部分与官方报价一致。' },
  { title: '全程保价', text: '从报名到学习结束，学生随时可以和其他同学比价；同样的条件别人拿到更低价，退还差价，入学后也适用。' },
  { title: '费用逐项说明', text: '接送机、签证、落地后续签等每一项费用，报名前都讲清楚。' },
  { title: '付款方式灵活', text: '可以直接付给学校，也可以付给思达启航，由思达启航代付。' },
  { title: '免费签证协助' },
  { title: '顾问有当地学习经历', text: '负责菲律宾的顾问都在菲律宾语言学校学习过；负责英国、爱尔兰的顾问有当地学习经历或在当地定居。' },
  { title: '当地有驻点人员', text: '菲律宾、英国、杭州都有驻点人员。' },
  { title: '深圳总部可当面咨询' },
  { title: '服务到学生回国为止', text: '到校后遇到问题随时联系顾问。' },
  { title: '老学员优惠', text: '老学员再去另一个国家学习，享受价格优惠。' },
];

export const BRAND_PROCESS: BrandPoint[] = [
  { title: '免费咨询', text: '了解学习目标、预算和英语水平。' },
  { title: '选校与方案', text: '分析学校优缺点，推荐课程，费用逐项列清。' },
  { title: '签约', text: '通过电子合同签署《报名咨询及协助服务协议》。' },
  { title: '付款', text: '可以直接付给学校，也可以付给思达启航代付；尾款按各校要求，一般在开课前 2–4 周支付。' },
  { title: '签证协助', text: '免费。' },
  {
    title: '行前准备',
    text: '提供行前指南、避坑指南、物品清单和《菲律宾游学前 60 天英语学习计划》；开课前约 1 周寄出赠送的菲律宾电话卡；出发前 3 天内代填 E-travel 二维码。',
  },
  { title: '在校期间', text: '有问题随时联系顾问，驻点人员协助。' },
  { title: '服务结束', text: '学生学完回到中国。' },
];

export const BRAND_PROCESS_NOTES = [
  '除大学课程外，语言课程每周都可以入学；入学日一般是周六或周日，结课日是周五或周六。',
  '退费按各学校的规章制度执行。',
  '境外保险可以自己买，也可以买思达启航推荐的综合方案。',
];

export interface BrandConsultant {
  name: string;
  focus: string;
  phone: string;
  avatar: string;
}

export const BRAND_CONSULTANTS: BrandConsultant[] = [
  { name: 'Perrin 李老师', focus: '菲律宾及东南亚游学', phone: '15367659331', avatar: SIDA_CONSULTANT_MEDIA.Perrin.avatarSrc },
  { name: 'Lemon 李老师', focus: '多国规划', phone: '13298529856', avatar: SIDA_CONSULTANT_MEDIA.Lemon.avatarSrc },
  { name: 'Jenny 易老师', focus: '英国、爱尔兰留学', phone: '13249827686', avatar: SIDA_CONSULTANT_MEDIA.Jenny.avatarSrc },
];

export const BRAND_CONSULTANT_NOTE =
  '对外公开的是这三位顾问，团队实际不止三人。负责菲律宾的顾问都在菲律宾学习过；负责英国、爱尔兰的顾问有当地学习经历或在当地定居。';

export const BRAND_QUALIFICATIONS: BrandFactRow[] = [
  { label: '菲律宾语言学校', value: '全部有合作' },
  { label: '英国、爱尔兰学校', value: '大部分有合作' },
  { label: '合作证书', value: '大部分合作学校已颁发' },
  { label: '出入境中介服务备案', value: '2026 年 11 月办理中，网上预申请已提交' },
  { label: '“思达启航”商标', value: '部分已注册，其余申请中' },
];

export const BRAND_QUALIFICATION_NOTE = '合作学校较多，这里不逐一列出。';

export interface BrandTool {
  label: string;
  /** Omitted for tools outside the website, such as the WeChat mini program. */
  href?: string;
  text: string;
}

export const BRAND_TOOLS: BrandTool[] = [
  {
    label: `微信小程序“${BRAND.wechatMiniProgram}”`,
    text: '在微信里搜索小程序名称，可以查看语言学校介绍和费用报价。',
  },
  {
    label: '学校费用在线报价',
    href: '/philippines-study/cebu/cia-cebu-international-academy',
    text: '多所菲律宾语言学校的页面可以在线计算学校费用和到校学杂费，并保存报价图片。',
  },
  {
    label: '《菲律宾游学前 60 天英语学习计划》',
    href: '/study60/',
    text: '网页版，免费使用，按天安排学习内容并配有音频。',
  },
  { label: '菲律宾游学指南', href: '/study-tour-guide/philippines', text: '课程、选校、城市差异、费用预算和行前准备。' },
  { label: '碧瑶接机指南', href: '/philippines-study/baguio/airport-pickup', text: '碧瑶语言学校的接机日期、机场集合点和流程。' },
  { label: '菲律宾游学常见问题', href: '/philippines-study/faq', text: '签证、费用、课程和生活的常见问题。' },
];

export interface BrandFaq {
  question: string;
  answer: string;
}

export const BRAND_FAQ: BrandFaq[] = [
  {
    question: '思达启航是什么公司？',
    answer: '深圳市思达启航文化交流有限公司，2018 年成立于深圳，专注菲律宾英语游学和爱尔兰、英国留学和游学，以及马来西亚等多国游学。',
  },
  {
    question: '思达启航收中介费吗？会比直接找学校贵吗？',
    answer: '不收中介服务费。大部分学校的价格低于学校官方报价，少部分与官方报价一致，并且全程保价：同样条件别人价格更低，退还差价。',
  },
  { question: '除了学费还有哪些费用？', answer: '接送机、签证、落地后续签等费用，报名前逐项列清。' },
  { question: '怎么付款？', answer: '可以直接付给学校，也可以付给思达启航代付。尾款按各校要求，一般在开课前 2–4 周支付。' },
  { question: '签证怎么办？', answer: '思达启航免费协助办理。' },
  {
    question: '英语零基础可以去菲律宾吗？',
    answer: '可以。思达启航提供《菲律宾游学前 60 天英语学习计划》，帮助学生应对入学测试。入学测试包括听力、写作、阅读和面对面口语。',
  },
  {
    question: '什么时候可以开学？',
    answer: '除大学课程外，语言课程每周都可以入学，入学日一般是周六或周日，结课日是周五或周六。',
  },
  { question: '到了菲律宾遇到问题找谁？', answer: '随时联系顾问，菲律宾有驻点人员协助。服务到学生回国为止。' },
  { question: '可以当面咨询吗？', answer: '可以。深圳总部在宝安区西乡，可以预约当面咨询；也可以线上咨询。' },
  {
    question: '思达启航和“启航教育”是一家吗？',
    answer: '不是。思达启航做菲律宾游学和留学申请，和考研培训机构“启航教育”没有任何关系。',
  },
  { question: '退费怎么算？', answer: '按各学校的退费规定执行。' },
];

/** Claims the fact card forbids. The build fails if the page or llms.txt contains one. */
export const BRAND_FORBIDDEN_PHRASES = [
  '98%',
  '5000+',
  '5,000+',
  '10,000+',
  '成功率',
  '录取无忧',
  '大数据',
  '分公司',
  '办公室',
  '最好',
  '第一',
  '唯一',
  '首选',
  '思达教育',
];

export function formatBrandPhone(phone: string): string {
  return phone.length === 11 ? `${phone.slice(0, 3)} ${phone.slice(3, 7)} ${phone.slice(7)}` : phone;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const ABOUT_SECTIONS = [
  { id: 'basic-info', label: '基本信息' },
  { id: 'business', label: '业务范围' },
  { id: 'advantages', label: '核心优势' },
  { id: 'process', label: '服务流程' },
  { id: 'consultants', label: '顾问团队' },
  { id: 'qualifications', label: '合作与资质' },
  { id: 'faq', label: '常见问题' },
];

function anchor(id: string): string {
  // Full path, because <base href="/"> would send a bare "#id" to the home page.
  return `${BRAND_ABOUT_PATH}#${id}`;
}

function link(item: BrandLink, className = ''): string {
  const cls = className ? ` class="${className}"` : '';
  return `<a${cls} href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a>`;
}

function factRows(rows: BrandFactRow[]): string {
  return rows
    .map((row) => {
      const external = row.href && /^https?:/.test(row.href) ? ' target="_blank" rel="noopener"' : '';
      const value = row.href
        ? `<a href="${escapeHtml(row.href)}"${external}>${escapeHtml(row.value)}</a>`
        : escapeHtml(row.value);
      return `<div class="bf-row"><dt>${escapeHtml(row.label)}</dt><dd>${value}</dd></div>`;
    })
    .join('');
}

function sectionHead(kicker: string, title: string): string {
  return `<p class="bf-kicker">${escapeHtml(kicker)}</p><h2>${escapeHtml(title)}</h2>`;
}

/**
 * The 关于思达启航 page as static HTML. The server puts it inside <app-root> for /about-sida/about, and
 * AboutComponent renders the same string, so crawlers and visitors read identical text.
 */
export function renderBrandFactsHtml(): string {
  const toc = ABOUT_SECTIONS.map((section) => `<a href="${anchor(section.id)}">${escapeHtml(section.label)}</a>`).join('');

  const businesses = BRAND_BUSINESSES.map(
    (item, index) =>
      `<li class="bf-card${index === 0 ? ' bf-card--main' : ''}"><h3>${escapeHtml(item.title)}${
        item.tag ? `<span class="bf-tag">${escapeHtml(item.tag)}</span>` : ''
      }</h3><p>${escapeHtml(item.text)}</p><p class="bf-links">${item.links.map((l) => link(l)).join('')}</p></li>`,
  ).join('');

  const advantages = BRAND_ADVANTAGES.map(
    (item) => `<li><strong>${escapeHtml(item.title)}</strong>${item.text ? `<span>${escapeHtml(item.text)}</span>` : ''}</li>`,
  ).join('');

  const process = BRAND_PROCESS.map(
    (item) => `<li><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.text ?? '')}</span></li>`,
  ).join('');

  const consultants = BRAND_CONSULTANTS.map(
    (item) =>
      `<li><img src="${escapeHtml(item.avatar)}" alt="${escapeHtml(item.name)}" width="56" height="56" loading="lazy" /><div><strong>${escapeHtml(
        item.name,
      )}</strong><span>${escapeHtml(item.focus)}</span><a href="tel:${escapeHtml(item.phone)}">${escapeHtml(formatBrandPhone(item.phone))}</a></div></li>`,
  ).join('');

  const tools = BRAND_TOOLS.map(
    (item) =>
      `<li>${item.href ? link({ label: item.label, href: item.href }) : `<strong>${escapeHtml(item.label)}</strong>`}<span>${escapeHtml(item.text)}</span></li>`,
  ).join('');

  const faq = BRAND_FAQ.map(
    (item, index) =>
      `<details${index < 2 ? ' open' : ''}><summary>${index + 1}. ${escapeHtml(item.question)}</summary><p>${escapeHtml(item.answer)}</p></details>`,
  ).join('');

  return [
    `<link rel="stylesheet" href="${BRAND_FACTS_STYLESHEET}" />`,
    '<article class="brand-facts">',
    '<header class="bf-hero"><div class="bf-wrap">',
    `<p class="bf-eyebrow">关于思达启航 · ${escapeHtml(BRAND.englishName)}</p>`,
    `<h1>关于${escapeHtml(BRAND.name)}</h1>`,
    `<p class="bf-lead">${escapeHtml(BRAND_SUMMARY_ZH)}</p>`,
    `<p class="bf-lead-en" lang="en">${escapeHtml(BRAND_SUMMARY_EN)}</p>`,
    `<ul class="bf-highlights">${BRAND_HIGHLIGHTS.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`,
    `<p class="bf-actions"><a class="bf-button" href="/about-sida/contact">联系顾问</a><a class="bf-button bf-button--ghost" href="${anchor('faq')}">常见问题</a></p>`,
    '</div></header>',
    `<nav class="bf-toc" aria-label="本页目录"><div class="bf-wrap">${toc}</div></nav>`,
    '<div class="bf-wrap bf-body">',
    `<section id="basic-info" class="bf-section">${sectionHead('BASIC INFO', '基本信息')}<dl class="bf-facts">${factRows(BRAND_BASIC_FACTS)}</dl></section>`,
    `<section id="business" class="bf-section">${sectionHead('WHAT WE DO', '业务范围')}<p class="bf-intro">${escapeHtml(
      BRAND_POSITIONING,
    )}按主次排序：</p><ol class="bf-cards">${businesses}</ol></section>`,
    `<section id="advantages" class="bf-section">${sectionHead('WHY SIDA QIHANG', '核心优势')}<ul class="bf-points">${advantages}</ul><p class="bf-motto"><span>公司理念</span>${escapeHtml(
      BRAND.philosophy,
    )}</p></section>`,
    `<section id="process" class="bf-section">${sectionHead('HOW IT WORKS', '菲律宾游学服务流程')}<ol class="bf-steps">${process}</ol><ul class="bf-notes">${BRAND_PROCESS_NOTES.map(
      (note) => `<li>${escapeHtml(note)}</li>`,
    ).join('')}</ul></section>`,
    `<section id="consultants" class="bf-section">${sectionHead('CONSULTANTS', '顾问团队')}<ul class="bf-consultants">${consultants}</ul><p class="bf-note">${escapeHtml(
      BRAND_CONSULTANT_NOTE,
    )}<a href="/about-sida/contact">扫码添加顾问微信</a></p></section>`,
    `<section id="qualifications" class="bf-section">${sectionHead('PARTNERS', '合作与资质')}<dl class="bf-facts bf-facts--compact">${factRows(
      BRAND_QUALIFICATIONS,
    )}</dl><p class="bf-note">${escapeHtml(BRAND_QUALIFICATION_NOTE)}</p></section>`,
    `<section id="tools" class="bf-section">${sectionHead('FREE TOOLS', '免费工具')}<ul class="bf-tools">${tools}</ul></section>`,
    `<aside class="bf-callout" aria-label="品牌说明"><strong>品牌说明</strong><p>${escapeHtml(BRAND_DISAMBIGUATION)}</p></aside>`,
    `<section id="faq" class="bf-section">${sectionHead('FAQ', '常见问题')}<div class="bf-faq">${faq}</div></section>`,
    `<footer class="bf-footer"><p>本页信息更新于 ${BRAND_FACTS_UPDATED_LABEL}。对外信息以本页为准。</p><p><a href="${BRAND.icpUrl}" target="_blank" rel="noopener">${escapeHtml(
      BRAND.icp,
    )}</a></p></footer>`,
    '</div>',
    '</article>',
  ].join('');
}

/** Full schema.org Organization for the home page and the about page. */
export function brandOrganizationNode(origin: string): Record<string, unknown> {
  return {
    '@type': 'EducationalOrganization',
    '@id': `${origin}/#organization`,
    name: BRAND.name,
    alternateName: [BRAND.englishName, '思达游学', 'Start Education'],
    legalName: BRAND.legalName,
    url: `${origin}/`,
    logo: { '@type': 'ImageObject', url: `${origin}${BRAND_LOGO}` },
    image: `${origin}${BRAND_LOGO}`,
    description: BRAND_SUMMARY_ZH,
    disambiguatingDescription: BRAND_DISAMBIGUATION,
    slogan: BRAND.slogan,
    foundingDate: BRAND.foundingDate,
    foundingLocation: { '@type': 'Place', name: '中国广东省深圳市' },
    taxID: BRAND.creditCode,
    identifier: { '@type': 'PropertyValue', propertyID: '统一社会信用代码', value: BRAND.creditCode },
    email: BRAND.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: BRAND.streetAddress,
      addressLocality: BRAND.addressLocality,
      addressRegion: BRAND.addressRegion,
      addressCountry: 'CN',
    },
    areaServed: { '@type': 'Country', name: '中国' },
    knowsAbout: [
      '菲律宾英语游学',
      '菲律宾语言学校',
      'ESL',
      '雅思',
      '商务英语',
      '斯巴达式英语强化',
      '爱尔兰留学',
      '英国留学',
      '英国游学',
      '马来西亚游学',
      '线上英语',
    ],
    owns: {
      '@type': 'MobileApplication',
      name: BRAND.wechatMiniProgram,
      applicationCategory: 'EducationalApplication',
      operatingSystem: '微信小程序',
      description: '思达启航的微信小程序，可以查看语言学校介绍和费用报价。',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'CNY' },
    },
    contactPoint: BRAND_CONSULTANTS.map((consultant) => ({
      '@type': 'ContactPoint',
      name: consultant.name,
      contactType: consultant.focus,
      telephone: `+86-${formatBrandPhone(consultant.phone).replace(/ /g, '-')}`,
      availableLanguage: ['zh-CN'],
      areaServed: 'CN',
    })),
  };
}

/** The about page's FAQ as schema.org FAQPage. */
export function brandFaqNode(pageUrl: string): Record<string, unknown> {
  return {
    '@type': 'FAQPage',
    '@id': `${pageUrl}#faq`,
    isPartOf: { '@id': `${pageUrl}#webpage` },
    inLanguage: 'zh-CN',
    mainEntity: BRAND_FAQ.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

const LLMS_PAGES: BrandLink[] = [
  { label: '关于思达启航', href: BRAND_ABOUT_PATH },
  { label: '联系我们', href: '/about-sida/contact' },
  { label: '为什么选择菲律宾游学', href: '/philippines-study/why-philippines' },
  { label: '菲律宾游学费用', href: '/philippines-study/cost' },
  { label: '宿务语言学校', href: '/philippines-study/cebu' },
  { label: '碧瑶语言学校', href: '/philippines-study/baguio' },
  { label: '克拉克语言学校', href: '/philippines-study/clark' },
  { label: '菲律宾游学常见问题', href: '/philippines-study/faq' },
  { label: '菲律宾游学指南', href: '/study-tour-guide/philippines' },
  { label: '菲律宾游学前 60 天英语学习计划', href: '/study60/' },
  { label: '爱尔兰留学', href: '/ireland-study/experience-ireland' },
  { label: '英国游学', href: '/overseas-study-tour/uk' },
  { label: '马来西亚游学', href: '/overseas-study-tour/malaysia' },
  { label: '线上英语课程', href: '/online-english/courses' },
];

/** /llms.txt: the fact card as Markdown for AI tools (https://llmstxt.org/). */
export function renderBrandLlmsTxt(origin: string): string {
  const url = (href: string) => (/^https?:/.test(href) ? href : `${origin}${href}`);
  const lines: string[] = [
    `# ${BRAND.name}（${BRAND.englishName}）`,
    '',
    `> ${BRAND_SUMMARY_ZH}`,
    '',
    BRAND_SUMMARY_EN,
    '',
    `完整信息见官网“关于思达启航”页面：${url(BRAND_ABOUT_PATH)}（更新于 ${BRAND_FACTS_UPDATED_LABEL}）。${BRAND_DISAMBIGUATION}`,
    '',
    '## 基本信息',
    '',
    ...BRAND_BASIC_FACTS.map((row) => `- ${row.label}：${row.value}`),
    '',
    '## 业务范围（按主次排序）',
    '',
    BRAND_POSITIONING,
    '',
    ...BRAND_BUSINESSES.map((item, index) => `${index + 1}. ${item.title}${item.tag ? `（${item.tag}）` : ''}：${item.text}`),
    '',
    '## 核心优势',
    '',
    ...BRAND_ADVANTAGES.map((item) => `- ${item.title}${item.text ? `：${item.text}` : '。'}`),
    '',
    `公司理念：${BRAND.philosophy}`,
    '',
    '## 菲律宾游学服务流程',
    '',
    ...BRAND_PROCESS.map((item, index) => `${index + 1}. ${item.title}：${item.text ?? ''}`),
    '',
    ...BRAND_PROCESS_NOTES.map((note) => `- ${note}`),
    '',
    '## 顾问团队',
    '',
    ...BRAND_CONSULTANTS.map((item) => `- ${item.name}：${item.focus}，电话 ${item.phone}`),
    '',
    BRAND_CONSULTANT_NOTE,
    '',
    '## 合作与资质',
    '',
    ...BRAND_QUALIFICATIONS.map((row) => `- ${row.label}：${row.value}`),
    '',
    BRAND_QUALIFICATION_NOTE,
    '',
    '## 常见问题',
    '',
    ...BRAND_FAQ.flatMap((item, index) => [`### ${index + 1}. ${item.question}`, '', item.answer, '']),
    '## 官网页面',
    '',
    ...LLMS_PAGES.map((page) => `- [${page.label}](${url(page.href)})`),
    ...BRAND_TOOLS.filter((tool) => tool.href && !LLMS_PAGES.some((page) => page.href === tool.href)).map(
      (tool) => `- [${tool.label}](${url(tool.href ?? '/')})：${tool.text}`,
    ),
    '',
    '## 其他渠道',
    '',
    ...BRAND_TOOLS.filter((tool) => !tool.href).map((tool) => `- ${tool.label}：${tool.text}`),
    `- 微信公众号“${BRAND.wechatOfficialAccount}”、小红书“${BRAND.xiaohongshu}”、搜狐号“${BRAND.sohu}”`,
    '',
    '## Optional',
    '',
    `- [网站地图](${origin}/sitemap.xml)`,
    '',
  ];
  return lines.join('\n');
}

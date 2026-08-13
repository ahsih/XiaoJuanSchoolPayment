import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

interface SeoPage {
  title: string;
  description: string;
  keywords: string;
  image?: string;
}

const SITE_NAME = '思达启航游学';
const DEFAULT_IMAGE = '/assets/sida-qihang-education-logo-rectangle.png';

const DEFAULT_SEO: SeoPage = {
  title: '思达启航游学 | 爱尔兰留学与菲律宾游学申请',
  description:
    '思达启航提供爱尔兰留学与菲律宾游学申请服务，覆盖语言学校选校、费用规划、雅思ESL课程和行前服务。',
  keywords: '爱尔兰留学与菲律宾游学申请, 爱尔兰留学, 菲律宾游学, 菲律宾英语游学, 菲律宾语言学校, 宿务游学, 碧瑶游学, 克拉克游学',
  image: '/assets/study-hero-collage.png',
};

const SEO_PAGES: Record<string, SeoPage> = {
  '/': DEFAULT_SEO,
  '/philippines-study/why-philippines': {
    title: '菲律宾留学为什么选择菲律宾 | 英语游学优势',
    description:
      '了解菲律宾留学和英语游学的优势：一对一课程、费用预算、语言环境、宿务/碧瑶/克拉克城市差异与适合人群。',
    keywords: '菲律宾留学优势, 菲律宾游学优势, 菲律宾英语学习, 菲律宾语言学校, 菲律宾一对一英语',
    image: '/assets/philippines/baguio-study-hero.jpg',
  },
  '/philippines-study/schools/by-city': {
    title: '菲律宾语言学校城市选择 | 宿务碧瑶克拉克马尼拉',
    description:
      '按城市比较菲律宾语言学校，覆盖宿务、碧瑶、克拉克、马尼拉、怡朗、达沃、苏比克等地区，帮助学生按预算和目标选校。',
    keywords: '菲律宾语言学校, 菲律宾游学城市, 宿务语言学校, 碧瑶语言学校, 克拉克语言学校, 马尼拉语言学校',
    image: '/assets/philippines/clark-study-hero.jpg',
  },
  '/philippines-study/cebu': {
    title: '宿务菲律宾留学与英语游学 | 宿务语言学校推荐',
    description:
      '宿务菲律宾留学和英语游学指南，比较 CIA、EV、菲律宾宿务CPI语言学校、菲律宾宿务CPILS语言学校、菲律宾宿务English Fella语言学校、菲律宾宿务Philinter语言学校 等语言学校课程、住宿和费用。',
    keywords: '宿务留学, 宿务游学, 宿务语言学校, 菲律宾宿务英语学校, CIA Cebu, EV Academy, 菲律宾宿务CPI语言学校, 菲律宾宿务CPILS语言学校, 菲律宾宿务English Fella语言学校, 菲律宾宿务Philinter语言学校',
    image: '/assets/cia/campus-building.png',
  },
  '/philippines-study/baguio': {
    title: '碧瑶菲律宾留学与英语游学 | 斯巴达语言学校推荐',
    description:
      '碧瑶菲律宾留学和英语游学指南，比较 菲律宾碧瑶PINES语言学校、BECI、JIC、MONOL、WALES 等学校，适合自律强化和雅思备考。',
    keywords: '碧瑶留学, 碧瑶游学, 碧瑶语言学校, 菲律宾斯巴达学校, 菲律宾碧瑶PINES语言学校, Pines, BECI, Baguio JIC, MONOL',
    image: '/assets/philippines/baguio-study-hero.jpg',
  },
  '/philippines-study/baguio/pines-international-academy': {
    title: '菲律宾碧瑶PINES语言学校 | 课程费用住宿与报名咨询',
    description:
      '菲律宾碧瑶PINES语言学校页面，整理Main Campus、IELTS Campus、ESL、Power Speaking、IELTS、TOEIC、住宿房型、2026费用和报名注意事项。',
    keywords: '菲律宾碧瑶PINES语言学校, PINES International Academy, 碧瑶PINES, 菲律宾雅思学校, 碧瑶语言学校',
    image: '/assets/philippines/pines-campus-hero.jpg',
  },
  '/philippines-study/baguio/beci-international-language-academy': {
    title: '菲律宾碧瑶BECI语言学校 | 校区课程费用住宿与报名咨询',
    description:
      '菲律宾碧瑶BECI语言学校页面，整理APIBECI的EOP、Sparta、City校区、ESL、24 ESL、IELTS、TOEIC、ESP、住宿房型、2026费用和报名注意事项。',
    keywords: '菲律宾碧瑶BECI语言学校, BECI International Language Academy, API BECI, 碧瑶BECI, BECI EOP, BECI Sparta, BECI City',
    image: '/assets/philippines/beci-eop-campus.jpg',
  },
  '/philippines-study/baguio/baguio-jic-academy': {
    title: '菲律宾碧瑶JIC语言学校 | Challenger与Premium校区课程费用住宿',
    description:
      '菲律宾碧瑶JIC语言学校页面，整理Baguio JIC Academy的Challenger、Premium校区、ESL、IELTS、TOEIC、TEP ESL、Speaking、Business、Working Holiday课程、住宿房型、2026费用和报名注意事项。',
    keywords: '菲律宾碧瑶JIC语言学校, Baguio JIC Academy, JIC Academy Baguio, JIC Challenger, JIC Premium, 碧瑶雅思学校, 碧瑶语言学校',
    image: '/assets/philippines/jic-campus-hero.jpg',
  },
  '/philippines-study/baguio/monol': {
    title: '菲律宾碧瑶MONOL语言学校 | 课程费用住宿与报名咨询',
    description:
      '菲律宾碧瑶MONOL语言学校页面，整理MONOL的General ESL、IELTS、LEAP课程、Hotel-style住宿房型、官方费用、餐费说明和当地费用。',
    keywords: '菲律宾碧瑶MONOL语言学校, MONOL Baguio, mymonol, 碧瑶MONOL, 菲律宾ESL学校, 碧瑶语言学校, 菲律宾雅思学校',
    image: '/assets/philippines/monol-campus-building.jpg',
  },
  '/philippines-study/baguio/wales-academy': {
    title: '菲律宾碧瑶WALES语言学校 | 课程费用住宿与报名咨询',
    description:
      '菲律宾碧瑶WALES语言学校页面，整理WALES Academy的EEP、Infinity、IELTS、Junior课程、小校环境、Legarda位置、Studio/Premium/Condo住宿、2026费用和到校费用。',
    keywords: '菲律宾碧瑶WALES语言学校, WALES Academy, Widest Asian Learners English School, 碧瑶WALES, 碧瑶语言学校, 菲律宾IELTS学校',
    image: '/assets/philippines/wales-school-building.jpg',
  },
  '/philippines-study/clark': {
    title: '克拉克菲律宾留学与英语游学 | 克拉克语言学校推荐',
    description:
      '克拉克菲律宾留学和英语游学指南，比较 CIP、菲律宾克拉克EG语言学校、WE、HELP、AELC 等学校，适合亲子、外师比例和舒适生活需求。',
    keywords: '克拉克留学, 克拉克游学, 克拉克语言学校, 菲律宾亲子游学, CIP English, 菲律宾克拉克EG语言学校, EG Academy, AELC',
    image: '/assets/philippines/clark-study-hero.jpg',
  },
  '/philippines-study/clark/cip-english-kepos': {
    title: '菲律宾克拉克 CIP语言学校 | Native一对一课程费用住宿与报名咨询',
    description:
      '菲律宾克拉克 CIP语言学校页面，整理CIP English Kepos的Native speaker一对一、ESL、IELTS、TOEIC、Business、亲子青少年课程、宿舍与Hotel住宿、临时CIA参考费用和报名注意事项。',
    keywords: '菲律宾克拉克 CIP语言学校, CIP English Kepos, 克拉克CIP, Clark CIP, 菲律宾外教一对一, 克拉克语言学校',
    image: '/assets/philippines/cip-campus-intro.jpg',
  },
  '/philippines-study/clark/eg-academy': {
    title: '菲律宾克拉克EG语言学校 | 课程费用住宿与报名咨询',
    description:
      '菲律宾克拉克EG语言学校页面，整理EG Academy的ESL、Native、IELTS、TOEIC、TOEFL、Business、Golf + ESL、Junior与Guardian课程、官方KRW费用和PHP到校费用。',
    keywords: '菲律宾克拉克EG语言学校, EG Academy, Education Group Granma, 克拉克EG, Clark EG, Golf ESL, 菲律宾亲子游学',
    image: '/assets/philippines/eg-facility-001.jpg',
  },
  '/philippines-study/manila': {
    title: '马尼拉菲律宾留学与英语游学 | 马尼拉语言学校推荐',
    description:
      '马尼拉菲律宾留学和英语游学指南，整理菲律宾马尼拉Enderun语言学校、菲律宾马尼拉American-English-Skill语言学校、马尼拉语言学校、商务英语、城市生活、课程选择和咨询规划重点。',
    keywords: '马尼拉留学, 马尼拉游学, 马尼拉语言学校, 菲律宾马尼拉Enderun语言学校, 菲律宾马尼拉American-English-Skill语言学校, 菲律宾商务英语, Enderun Extension, American English Skills Development Center, Berlitz Philippines',
    image: '/assets/philippines/manila-study-hero.jpg',
  },
  '/philippines-study/manila/enderun-extension': {
    title: '菲律宾马尼拉Enderun语言学校 | 课程费用与报名咨询',
    description:
      '菲律宾马尼拉Enderun语言学校页面，整理Enderun Extension的General English、Business English、Academic English、IELTS Test Preparation、One-on-One Top-Up、PHP课程费用、Book Fee和住宿自理说明。',
    keywords: '菲律宾马尼拉Enderun语言学校, Enderun Extension, Enderun Colleges, 马尼拉英语学校, Manila English, Business English Manila, Academic English Manila',
    image: '/assets/philippines/enderun-extension-socials.jpg',
  },
  '/philippines-study/manila/american-english-skills-development-center': {
    title: '菲律宾马尼拉American-English-Skill语言学校 | 课程费用与报名咨询',
    description:
      '菲律宾马尼拉American-English-Skill语言学校页面，整理American English Skills Development Center的团体课、一对一、商务英语、商务写作、发音、演讲、企业培训、PHP课程费用和住宿自理说明。',
    keywords: '菲律宾马尼拉American-English-Skill语言学校, American English Skills Development Center, American English Makati, 马尼拉商务英语, Makati英语培训, Business English Philippines',
    image: '/assets/philippines/american-english-brand.png',
  },
  '/philippines-study/boracay': {
    title: '长滩岛菲律宾游学 | 海岛英语课程与语言学校',
    description:
      '长滩岛菲律宾游学适合希望兼顾英语学习和海岛生活的学生，了解课程强度、住宿、预算和适合人群。',
    keywords: '长滩岛游学, Boracay游学, 菲律宾海岛游学, 菲律宾英语课程',
    image: '/assets/philippines/manila-study-hero.jpg',
  },
  '/philippines-study/bacolod': {
    title: '巴科洛德菲律宾留学与英语游学 | 语言学校选择',
    description:
      '巴科洛德菲律宾留学和英语游学指南，适合关注生活成本、学习环境和长期英语提升的学生。',
    keywords: '巴科洛德留学, 巴科洛德游学, Bacolod语言学校, 菲律宾低预算游学',
    image: '/assets/philippines/baguio-study-hero.jpg',
  },
  '/philippines-study/iloilo': {
    title: '怡朗菲律宾留学与英语游学 | Iloilo语言学校',
    description:
      '怡朗菲律宾留学和英语游学城市指南，帮助学生了解安全环境、学习氛围、生活成本和课程选择。',
    keywords: '怡朗留学, 怡朗游学, Iloilo语言学校, 菲律宾英语游学',
    image: '/assets/philippines/baguio-study-hero.jpg',
  },
  '/philippines-study/davao': {
    title: '达沃菲律宾留学与英语游学 | Davao语言学校',
    description:
      '达沃菲律宾留学和英语游学城市指南，整理城市特点、适合人群、学习环境和费用规划方向。',
    keywords: '达沃留学, 达沃游学, Davao语言学校, 菲律宾英语学校',
    image: '/assets/philippines/manila-study-hero.jpg',
  },
  '/philippines-study/subic': {
    title: '苏比克菲律宾留学与英语游学 | Subic语言学校',
    description:
      '苏比克菲律宾留学和英语游学城市指南，适合关注生活环境、亲子游学、英语课程和安全感的学生家庭。',
    keywords: '苏比克留学, 苏比克游学, Subic语言学校, 菲律宾亲子英语游学',
    image: '/assets/philippines/clark-study-hero.jpg',
  },
  '/philippines-study/cost': {
    title: '菲律宾留学费用 | 英语游学学费住宿生活费预算',
    description:
      '菲律宾留学和英语游学费用说明，拆解学费、住宿、当地费用、机票、签证、保险和不同城市学校的预算差异。',
    keywords: '菲律宾留学费用, 菲律宾游学费用, 菲律宾语言学校费用, 宿务游学费用, 菲律宾英语学校价格',
    image: '/assets/philippines/home-school-ev.jpg',
  },
  '/philippines-study/faq': {
    title: '菲律宾留学常见问题 | 英语游学报名与行前准备',
    description:
      '菲律宾留学和英语游学常见问题，覆盖课程选择、报名时间、住宿、签证、接机、费用和行前准备。',
    keywords: '菲律宾留学常见问题, 菲律宾游学FAQ, 菲律宾英语游学报名, 菲律宾游学签证',
    image: '/assets/philippines/pines-campus-hero.jpg',
  },
  '/philippines-study/offers': {
    title: '菲律宾语言学校优惠 | 英语游学最新报名方案',
    description:
      '查看菲律宾语言学校优惠和报名方案，结合开课时间、住宿房型、课程类型和预算获取适合的英语游学报价。',
    keywords: '菲律宾语言学校优惠, 菲律宾游学优惠, 菲律宾留学报价, 菲律宾英语学校报名',
    image: '/assets/philippines/jic-campus-hero.jpg',
  },
  '/philippines-study/recommendations/ielts-schools': {
    title: '菲律宾雅思学校推荐 | IELTS英语游学选校',
    description:
      '菲律宾雅思学校推荐，比较宿务、碧瑶等城市的 IELTS 课程、斯巴达强度、模考安排和适合提分目标。',
    keywords: '菲律宾雅思学校, 菲律宾IELTS, 雅思游学, 宿务雅思学校, 碧瑶雅思学校',
    image: '/assets/cia/campus-building.png',
  },
  '/philippines-study/recommendations/budget-schools': {
    title: '菲律宾低预算语言学校推荐 | 高性价比英语游学',
    description:
      '菲律宾低预算语言学校推荐，从学费、住宿、当地费用和城市生活成本比较适合长期英语游学的方案。',
    keywords: '菲律宾便宜语言学校, 菲律宾低预算游学, 菲律宾游学性价比, 菲律宾英语学校费用',
    image: '/assets/philippines/monol-campus-building.jpg',
  },
  '/philippines-study/recommendations/family-schools': {
    title: '菲律宾亲子游学学校推荐 | 家庭英语课程规划',
    description:
      '菲律宾亲子游学学校推荐，适合家长和孩子一起学习英语，关注课程安排、住宿、安全、餐食和假期时间。',
    keywords: '菲律宾亲子游学, 菲律宾家庭游学, 菲律宾儿童英语游学, 宿务亲子游学',
    image: '/assets/cpi/campus-pool.jpg',
  },
  '/philippines-study/recommendations/junior-camp': {
    title: '菲律宾青少年夏令营 | 暑假英语游学营',
    description:
      '菲律宾青少年夏令营和暑假英语游学营规划，覆盖课程强度、住宿管理、活动安排、安全照顾和报名建议。',
    keywords: '菲律宾夏令营, 菲律宾青少年游学, 菲律宾英语夏令营, 菲律宾暑假游学',
    image: '/assets/philippines/pines-campus-hero.jpg',
  },
  '/philippines-study/recommendations/sparta-schools': {
    title: '菲律宾斯巴达语言学校推荐 | 强化英语游学',
    description:
      '菲律宾斯巴达语言学校推荐，适合希望集中提升英语、雅思或口语的学生，比较管理强度、课程量和自习安排。',
    keywords: '菲律宾斯巴达学校, 菲律宾强化英语, 碧瑶斯巴达, 宿务斯巴达, 菲律宾雅思强化',
    image: '/assets/philippines/home-school-ev.jpg',
  },
  '/philippines-study/schools/by-course': {
    title: '菲律宾语言学校按课程选择 | ESL雅思商务英语',
    description:
      '按课程选择菲律宾语言学校，覆盖 ESL、雅思 IELTS、托业 TOEIC、商务英语、亲子课程和青少年课程。',
    keywords: '菲律宾ESL课程, 菲律宾雅思课程, 菲律宾商务英语, 菲律宾语言学校课程',
    image: '/assets/philinter/group-classroom.png',
  },
  '/philippines-study/schools/by-style': {
    title: '菲律宾语言学校按风格选择 | 斯巴达半斯巴达度假型',
    description:
      '按学习风格选择菲律宾语言学校，比较斯巴达、半斯巴达、度假型、亲子型和外师比例高的学校。',
    keywords: '菲律宾斯巴达, 菲律宾半斯巴达, 菲律宾度假型学校, 菲律宾亲子学校',
    image: '/assets/cia/campus-pool.jpg',
  },
  '/philippines-study/schools/popular': {
    title: '菲律宾热门语言学校 | 宿务碧瑶克拉克学校推荐',
    description:
      '菲律宾热门语言学校整理，覆盖 CIA、EV、菲律宾宿务CPI语言学校、菲律宾宿务Philinter语言学校、菲律宾碧瑶PINES语言学校、BECI、JIC 等学校的课程和适合人群。',
    keywords: '菲律宾热门语言学校, 菲律宾学校推荐, 宿务英语学校, 碧瑶英语学校, 克拉克英语学校',
    image: '/assets/philippines/beci-eop-campus.jpg',
  },
  '/study-tour-guide/philippines': {
    title: '菲律宾游学攻略 | 英语课程选校费用与行前准备',
    description:
      '菲律宾游学攻略，帮助学生和家长了解英语课程、学校选择、城市差异、费用预算、报名流程和行前准备。',
    keywords: '菲律宾游学攻略, 菲律宾留学攻略, 菲律宾英语游学攻略, 菲律宾语言学校怎么选',
    image: '/assets/philippines/wales-school-building.jpg',
  },
  '/about-sida/contact': {
    title: '联系思达启航 | 菲律宾留学英语游学咨询',
    description:
      '联系思达启航顾问，获取菲律宾留学、英语游学、语言学校选校、费用报价和行前规划建议。',
    keywords: '菲律宾留学咨询, 菲律宾游学顾问, 菲律宾语言学校报价, 思达启航联系方式',
    image: '/assets/sida-qihang-education-logo-rectangle.png',
  },
};

@Injectable({ providedIn: 'root' })
export class SeoService {
  constructor(
    private readonly router: Router,
    private readonly title: Title,
    private readonly meta: Meta,
    @Inject(DOCUMENT) private readonly document: Document,
  ) {}

  init(): void {
    this.applySeoForUrl(this.router.url);

    this.router.events.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd)).subscribe((event) => {
      this.applySeoForUrl(event.urlAfterRedirects);
    });
  }

  private applySeoForUrl(rawUrl: string): void {
    const path = this.normalizePath(rawUrl);
    const page = SEO_PAGES[path] ?? this.findSectionSeo(path) ?? DEFAULT_SEO;
    const title = page.title.includes(SITE_NAME) ? page.title : `${page.title} | ${SITE_NAME}`;
    const canonicalUrl = this.absoluteUrl(path);
    const imageUrl = this.absoluteUrl(page.image ?? DEFAULT_IMAGE);

    this.title.setTitle(title);
    this.upsertTag('name', 'description', page.description);
    this.upsertTag('name', 'keywords', page.keywords);
    this.upsertTag('name', 'robots', 'index, follow, max-image-preview:large');
    this.upsertTag('property', 'og:site_name', SITE_NAME);
    this.upsertTag('property', 'og:type', 'website');
    this.upsertTag('property', 'og:title', title);
    this.upsertTag('property', 'og:description', page.description);
    this.upsertTag('property', 'og:url', canonicalUrl);
    this.upsertTag('property', 'og:image', imageUrl);
    this.upsertTag('name', 'twitter:card', 'summary_large_image');
    this.upsertTag('name', 'twitter:title', title);
    this.upsertTag('name', 'twitter:description', page.description);
    this.upsertTag('name', 'twitter:image', imageUrl);
    this.setCanonical(canonicalUrl);
    this.setStructuredData(path, canonicalUrl, title, page.description, imageUrl);
  }

  private findSectionSeo(path: string): SeoPage | undefined {
    if (path.startsWith('/philippines-study/cebu/')) {
      return {
        title: '宿务菲律宾语言学校详情 | 课程费用住宿咨询',
        description: '查看宿务菲律宾语言学校详情，了解课程设置、住宿房型、费用组成、校园环境和适合人群。',
        keywords: '宿务语言学校详情, 菲律宾语言学校费用, 宿务英语学校, 菲律宾留学咨询',
        image: '/assets/cia/campus-building.png',
      };
    }

    if (path.startsWith('/philippines-study/baguio/')) {
      return {
        title: '碧瑶菲律宾语言学校详情 | 斯巴达英语课程咨询',
        description: '查看碧瑶菲律宾语言学校详情，了解斯巴达课程、雅思备考、住宿费用、校园管理和适合人群。',
        keywords: '碧瑶语言学校详情, 菲律宾斯巴达学校, 碧瑶雅思学校, 菲律宾英语游学',
        image: '/assets/philippines/baguio-study-hero.jpg',
      };
    }

    if (path.startsWith('/philippines-study/clark/')) {
      return {
        title: '克拉克菲律宾语言学校详情 | 外师亲子英语课程咨询',
        description: '查看克拉克菲律宾语言学校详情，了解外师比例、亲子课程、住宿环境、费用组成和适合人群。',
        keywords: '克拉克语言学校详情, 菲律宾亲子游学, 克拉克英语学校, 菲律宾外教课程',
        image: '/assets/philippines/clark-study-hero.jpg',
      };
    }

    if (path.startsWith('/philippines-study/manila/')) {
      return {
        title: '马尼拉菲律宾语言学校详情 | 商务英语课程咨询',
        description: '查看马尼拉菲律宾语言学校详情，了解商务英语、城市生活、课程设置、费用组成和申请建议。',
        keywords: '马尼拉语言学校详情, 菲律宾商务英语, 马尼拉英语学校, 菲律宾留学咨询',
        image: '/assets/philippines/manila-study-hero.jpg',
      };
    }

    return undefined;
  }

  private normalizePath(rawUrl: string): string {
    const path = rawUrl.split(/[?#]/)[0] || '/';
    return path.length > 1 ? path.replace(/\/+$/, '') : '/';
  }

  private absoluteUrl(pathOrUrl: string): string {
    if (/^https?:\/\//i.test(pathOrUrl)) {
      return pathOrUrl;
    }

    const origin = this.document.location.origin;
    const path = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
    return `${origin}${path}`;
  }

  private upsertTag(attribute: 'name' | 'property', key: string, content: string): void {
    this.meta.updateTag({ [attribute]: key, content });
  }

  private setCanonical(url: string): void {
    let link = this.document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }

    link.setAttribute('href', url);
  }

  private setStructuredData(path: string, canonicalUrl: string, title: string, description: string, imageUrl: string): void {
    let script = this.document.getElementById('seo-json-ld') as HTMLScriptElement | null;
    if (!script) {
      script = this.document.createElement('script');
      script.id = 'seo-json-ld';
      script.type = 'application/ld+json';
      this.document.head.appendChild(script);
    }

    const origin = this.document.location.origin;
    const graph: Array<Record<string, unknown>> = [
      {
        '@type': 'WebSite',
        '@id': `${origin}/#website`,
        url: origin,
        name: SITE_NAME,
        inLanguage: 'zh-CN',
      },
      {
        '@type': 'EducationalOrganization',
        '@id': `${origin}/#organization`,
        name: SITE_NAME,
        url: origin,
        logo: this.absoluteUrl('/assets/sida-qihang-education-logo-rectangle.png'),
      },
      {
        '@type': 'WebPage',
        '@id': `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: title,
        description,
        image: imageUrl,
        isPartOf: { '@id': `${origin}/#website` },
        inLanguage: 'zh-CN',
      },
    ];

    if (path !== '/') {
      graph.push({
        '@type': 'BreadcrumbList',
        '@id': `${canonicalUrl}#breadcrumb`,
        itemListElement: this.buildBreadcrumbItems(path, origin),
      });
    }

    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': graph,
    });
  }

  private buildBreadcrumbItems(path: string, origin: string): Array<Record<string, unknown>> {
    const labels: Record<string, string> = {
      'philippines-study': '菲律宾留学',
      'study-tour-guide': '游学攻略',
      recommendations: '学校推荐',
      schools: '语言学校',
      cebu: '宿务',
      baguio: '碧瑶',
      clark: '克拉克',
      'eg-academy': '菲律宾克拉克EG语言学校',
      manila: '马尼拉',
      'enderun-extension': '菲律宾马尼拉Enderun语言学校',
      'american-english-skills-development-center': '菲律宾马尼拉American-English-Skill语言学校',
      cost: '费用',
      faq: '常见问题',
      offers: '优惠',
      'by-city': '按城市选校',
      'by-course': '按课程选校',
      'by-style': '按风格选校',
      popular: '热门学校',
    };

    const segments = path.split('/').filter(Boolean);
    const items: Array<Record<string, unknown>> = [
      {
        '@type': 'ListItem',
        position: 1,
        name: '首页',
        item: `${origin}/`,
      },
    ];

    segments.reduce((currentPath, segment, index) => {
      const nextPath = `${currentPath}/${segment}`;
      items.push({
        '@type': 'ListItem',
        position: index + 2,
        name: labels[segment] ?? this.humanizeSegment(segment),
        item: `${origin}${nextPath}`,
      });

      return nextPath;
    }, '');

    return items;
  }

  private humanizeSegment(segment: string): string {
    return segment
      .split('-')
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}

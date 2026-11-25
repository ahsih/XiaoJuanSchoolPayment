import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import {
  BRAND,
  BRAND_ABOUT_PATH,
  BRAND_FACTS_UPDATED,
  BRAND_LOGO,
  BRAND_SITE_ORIGIN,
  BRAND_SUMMARY_ZH,
  brandFaqNode,
  brandOrganizationNode,
} from '../app/pages/about-sida/about/brand-facts';

// SEO data below is also exported to seo-pages.json at build time (scripts/export-seo-pages.cjs)
// so the ASP.NET server can put each page's title and description into the initial HTML for
// crawlers and link previews that do not run JavaScript. Keep the data pure: no Angular or DOM use.
export interface SeoPage {
  title: string;
  description: string;
  keywords: string;
  image?: string;
  type?: 'article';
}

export const SITE_NAME = '思达启航游学';
export const DEFAULT_IMAGE = '/assets/sida-qihang-education-logo-rectangle.webp';

export const DEFAULT_SEO: SeoPage = {
  title: '思达启航游学 | 爱尔兰留学与菲律宾游学申请',
  description:
    '思达启航提供爱尔兰留学与菲律宾游学申请服务，覆盖语言学校选校、费用规划、雅思ESL课程和行前服务。',
  keywords: '爱尔兰留学与菲律宾游学申请, 爱尔兰留学, 菲律宾游学, 菲律宾英语游学, 菲律宾语言学校, 宿务游学, 碧瑶游学, 克拉克游学',
  image: '/assets/study-hero-collage.webp',
};

export const SEO_PAGES: Record<string, SeoPage> = {
  '/': DEFAULT_SEO,
  '/student-feedback/study-tour': {
    title: '游学故事与学员反馈 | 思达启航游学',
    description: '记录思达启航学员在海外学习和生活的片段，从菲律宾英语游学的节日问候，到出发后的持续陪伴。',
    keywords: '菲律宾英语游学, 思达启航, 游学反馈, 海外学员, 学员关怀',
    image: '/assets/student-stories/mid-autumn/student-moments.png',
  },
  '/student-feedback/study-tour/philippines-study-mid-autumn': {
    title: '思达启航菲律宾英语游学中秋记录｜离家很远也有人惦记',
    description: '这个中秋，思达启航把心意送到在菲律宾学习的学生手中。从宿务、碧瑶到克拉克，记录礼物转交的细节，以及学生、家长和老师的温暖回应。愿每一位在海外学习的人，都能感受到被惦记的温暖。',
    keywords: '菲律宾英语游学, 思达启航, 海外游学, 宿务游学, 碧瑶游学, 克拉克游学, 海外学员中秋记录',
    image: '/assets/student-stories/mid-autumn/gift-bags.png',
    type: 'article',
  },
  '/overseas-study-tour/ireland/atc-language-schools': {
    title: '爱尔兰ATC语言学校｜布雷、都柏林校区课程住宿费用与在线报价',
    description: 'ATC Language Schools 1973年创办，布雷海边校区和都柏林市中心校区，成人英语课程1周起报、每周一开课；查看2027年学费、寄宿家庭和学生公寓价格、25周半工半读，在线计算费用并保存报价图片。',
    keywords: 'ATC Language Schools, ATC语言学校, 爱尔兰语言学校, 爱尔兰游学, 都柏林语言学校, 布雷语言学校, 爱尔兰半工半读, ATC报价',
    image: '/assets/atc/bray-aerial.webp',
  },
  '/overseas-study-tour/uk/burlington-school': {
    title: '英国伦敦Burlington School语言学校｜课程住宿费用与在线报价',
    description: '伦敦Burlington School介绍：青少年春夏秋冬季全包项目、成人英语课程、成人暑期公寓套餐、校内宿舍与寄宿家庭价格和巴斯城堡体验，可在线计算2027年费用并保存报价图片；思达启航提供英国游学选校与报名咨询。',
    keywords: 'Burlington School, 伦敦语言学校, 英国游学, 英国暑期游学, 伦敦青少年夏校, 英国语言学校费用, Burlington报价',
    image: '/assets/burlington/campus-courtyard.jpg',
  },
  '/philippines-study/cebu/ev-la-mer': {
    title: 'EV Academy La Mer校区 | 成人亲子课程、住宿与费用报价',
    description: '了解宿务麦克坦EV La Mer独立校区，查看ESL、Senior、强化口语及亲子课程、泳池校园实景、住宿费用与优惠，计算单人、多人或亲子家庭报价并保存图片。',
    keywords: 'EV La Mer, EV Academy La Mer, 宿务亲子游学, 麦克坦英语学校, La Mer费用, La Mer亲子套餐, 熟龄英语',
    image: '/assets/la-mer/campus-sunset.webp',
  },
  '/philippines-study/cebu/cg-academy-sparta-campus': {
    title: 'CG斯巴达校区 | 宿务课程、住宿费用与报价',
    description: '菲律宾宿务CG斯巴达校区介绍：全斯巴达管理，斯巴达、托业、雅思保分班和雅思强化课程，校内宿舍实拍、2027假期和在线报价；学杂费单独列示。',
    keywords: 'CG斯巴达校区, 宿务CG语言学校, CG雅思保分班, 斯巴达课程, CG费用, 菲律宾游学',
    image: '/assets/philippines/cg-sparta-campus-hero.webp',
  },
  '/philippines-study/cebu/smeag-capital': {
    title: '菲律宾宿务SMEAG Capital校区 | 课程、住宿与在线报价',
    description: '查看SMEAG Capital宿务市区校区的雅思、托福、托业和剑桥体系ESL课程，校内宿舍与合作酒店实拍，在线报价和2027假期；学杂费单独列示。',
    keywords: 'SMEAG Capital, SMEAG Capital假期, 宿务SMEAG, SMEAG 2027校历, 宿务雅思学校',
    image: '/assets/philippines/smeag-capital-building.webp',
  },
  '/philippines-study/cebu/smeag-encanto': {
    title: '菲律宾宿务SMEAG Encanto海滨校区 | 寒暑假亲子营与成人ESL报价',
    description: '宿务麦克坦岛SMEAG Encanto海滨校区：寒暑假全包亲子营、淡季亲子和成人ESL课程价格，每日作息、校园照片和在线报价。',
    keywords: 'SMEAG Encanto, SMEAG海滨校区, 宿务亲子游学, 菲律宾亲子营, SMEAG Family Camp, 宿务成人ESL',
    image: '/assets/philippines/smeag-encanto-campus-official.webp',
  },
  '/philippines-study/why-philippines': {
    title: '菲律宾留学为什么选择菲律宾 | 英语游学优势',
    description:
      '了解菲律宾留学和英语游学的优势：一对一课程、费用预算、语言环境、宿务/碧瑶/克拉克城市差异与适合人群。',
    keywords: '菲律宾留学优势, 菲律宾游学优势, 菲律宾英语学习, 菲律宾语言学校, 菲律宾一对一英语',
    image: '/assets/philippines/baguio-study-hero.webp',
  },
  '/philippines-study/bohol/english-mint-international-academy': {
    title: '菲律宾薄荷岛English MINT语言学校 | 课程住宿与费用报价',
    description: 'English MINT薄荷岛语言学校介绍，查看成人ESL、青少年英语、口语强化、住宿、餐食、家庭项目、当地费用和完整报价。',
    keywords: 'English MINT, 薄荷岛语言学校, 菲律宾薄荷岛游学, 邦劳英语学校, 薄荷岛亲子游学, English MINT费用',
    image: '/assets/english-mint/campus-building.webp',
  },
  '/philippines-study/bohol/english-mint-international-academy/quote': {
    title: 'English MINT费用报价 | 课程住宿家庭套餐计算',
    description: '按English MINT已公布的课程、房型、周数、当地费用、2周全包和家庭项目价格生成网页报价与可保存报价图片。',
    keywords: 'English MINT报价, English MINT学费, 薄荷岛游学费用, English MINT家庭套餐',
    image: '/assets/english-mint/deluxe-twin.webp',
  },
  '/philippines-study/schools/by-city': {
    title: '菲律宾语言学校城市选择 | 宿务碧瑶克拉克马尼拉',
    description:
      '按城市比较菲律宾语言学校，覆盖宿务、碧瑶、克拉克、马尼拉、伊洛伊洛、达沃、苏比克等地区，帮助学生按预算和目标选校。',
    keywords: '菲律宾语言学校, 菲律宾游学城市, 宿务语言学校, 碧瑶语言学校, 克拉克语言学校, 马尼拉语言学校',
    image: '/assets/philippines/clark-study-hero.webp',
  },
  '/philippines-study/cebu': {
    title: '宿务菲律宾留学与英语游学 | 宿务语言学校推荐',
    description:
      '宿务菲律宾留学和英语游学指南，比较 CIA、EV、菲律宾宿务CPI语言学校、菲律宾宿务CPILS语言学校、菲律宾宿务English Fella语言学校、菲律宾宿务Philinter语言学校 等语言学校课程、住宿和费用。',
    keywords: '宿务留学, 宿务游学, 宿务语言学校, 菲律宾宿务英语学校, CIA Cebu, EV Academy, 菲律宾宿务CPI语言学校, 菲律宾宿务CPILS语言学校, 菲律宾宿务English Fella语言学校, 菲律宾宿务Philinter语言学校',
    image: '/assets/cia/campus-building.webp',
  },
  '/philippines-study/baguio': {
    title: '碧瑶菲律宾留学与英语游学 | 斯巴达语言学校推荐',
    description:
      '碧瑶菲律宾留学和英语游学指南，比较 菲律宾碧瑶PINES语言学校、BECI、JIC、MONOL、WALES 等学校，适合自律强化和雅思备考。',
    keywords: '碧瑶留学, 碧瑶游学, 碧瑶语言学校, 菲律宾斯巴达学校, 菲律宾碧瑶PINES语言学校, Pines, BECI, 菲律宾碧瑶JIC语言学校, MONOL',
    image: '/assets/philippines/baguio-study-hero.webp',
  },
  '/philippines-study/cebu/bcebu': {
    title: "菲律宾宿务B'Cebu语言学校 | 课程住宿费用与在线报价",
    description:
      "菲律宾宿务B'Cebu语言学校（麦克坦岛拉普拉普市）：Speed ESL、B'Sparta斯巴达、雅思与雅思保证班、商务英语、青少年与幼儿课程，单人间到三人间住宿，2027淡季优惠、暑假附加费、在线报价与学杂费明细。",
    keywords: "菲律宾宿务B'Cebu语言学校, BECI B'Cebu, B Cebu, 宿务语言学校, 宿务IELTS, 宿务亲子游学",
    image: '/assets/bcebu/campus-building.webp',
  },
  '/philippines-study/cebu/btes-english-academy': {
    title: '菲律宾宿务BTES语言学校 | 课程、住宿与报名咨询',
    description:
      '菲律宾宿务BTES语言学校介绍，整理General ESL、IELTS、TOEIC、Business、Junior与Family课程、学校位置、适合人群和报名咨询。',
    keywords: '菲律宾宿务BTES语言学校, BTES English Academy, Brainy Tutelage English School, 宿务高性价比语言学校, 宿务亲子游学',
    image: 'https://www.fujiyama-international.com/archives/004/202404/b862d6cf8e313f63b336bb005f3f05e9.jpg',
  },
  '/philippines-study/cebu/elsa-international-language-school': {
    title: '菲律宾宿务ELSA语言学校 | 课程食宿费用与报价',
    description:
      '菲律宾宿务ELSA语言学校介绍：成人ESL、青少年、本地学校随班、幼儿园和家长陪读课程，课程价含食宿，可在线计算报价并保存报价图片；思达启航提供宿务游学选校与申请咨询。',
    keywords: '菲律宾宿务ELSA语言学校, ELSA International Language School, 宿务亲子游学, 宿务幼儿园英语, ELSA费用, ELSA报价',
    image: '/assets/elsa/campus/aerial-01.webp',
  },
  '/philippines-study/baguio/pines-international-academy': {
    title: '菲律宾碧瑶PINES语言学校 | 课程费用住宿与报名咨询',
    description:
      '菲律宾碧瑶PINES语言学校：口语和雅思分区上课，校内有雅思、托业官方考点；2026–2027课程费、房费、优惠和到校学杂费，支持单人、多人和方案对比报价。',
    keywords: '菲律宾碧瑶PINES语言学校, PINES International Academy, 碧瑶PINES, 菲律宾雅思学校, 碧瑶语言学校',
    image: '/assets/pines/campus/exterior.webp',
  },
  '/philippines-study/baguio/beci-eop-campus': {
    title: '菲律宾碧瑶BECI EOP校区 | 课程住宿费用与多人报价',
    description:
      '菲律宾碧瑶BECI EOP校区独立页面，整理2026课程费、住宿费、淡旺季与长期优惠、到校学杂费，并支持单人及2至20人报价。',
    keywords: '菲律宾碧瑶BECI EOP校区, BECI EOP Campus, BECI课程费用, BECI住宿费, 碧瑶语言学校',
    image: '/assets/philippines/beci-eop-campus.webp',
  },
  '/philippines-study/baguio/beci-sparta-campus': {
    title: '菲律宾碧瑶BECI斯巴达校区 | 课程住宿费用与多人报价',
    description:
      '菲律宾碧瑶BECI斯巴达校区独立页面，整理24 ESL、托业、雅思及保证班、住宿、优惠、到校学杂费和单人及多人报价。',
    keywords: '菲律宾碧瑶BECI斯巴达校区, BECI Sparta Campus, 碧瑶斯巴达学校, BECI雅思, BECI费用',
    image: '/assets/philippines/beci-campus-blue-roof.webp',
  },
  '/philippines-study/baguio/api-beci-city-campus': {
    title: '菲律宾碧瑶API BECI City校区 | 课程住宿费用与多人报价',
    description:
      '菲律宾碧瑶API BECI City校区独立页面，整理Lite、Native、Unlimited与Junior ESL课程、Studio住宿、夫妻房价、优惠、到校学杂费和多人报价。',
    keywords: '菲律宾碧瑶API BECI City校区, BECI City Campus, API BECI课程费用, BECI夫妻房, 碧瑶语言学校',
    image: '/assets/philippines/beci-city-workspace.webp',
  },
  '/philippines-study/baguio/baguio-jic-challenger': {
    title: '菲律宾碧瑶JIC挑战校区 | Challenger课程住宿费用与报价',
    description: '菲律宾碧瑶JIC Challenger挑战校区：雅思保分班和三种强度的雅思、一般英语课程，斯巴达或半斯巴达，四种住宿，2027年课程住宿费、淡季和长期优惠、到校学杂费和在线报价。',
    keywords: 'JIC挑战校区, 菲律宾碧瑶JIC语言学校, Baguio JIC Challenger Campus, JIC雅思保分班, JIC ESL, JIC IELTS, 碧瑶雅思学校, 碧瑶语言学校',
    image: '/assets/philippines/jic-main-campus-overview.webp',
  },
  '/philippines-study/baguio/baguio-jic-premium': {
    title: '菲律宾碧瑶JIC高级校区 | Premium课程住宿费用与报价',
    description: '菲律宾碧瑶JIC Premium高级校区：口语、主题英语TEP、托业、商务、打工度假和银发课程，半斯巴达管理，六种住宿，2027年课程住宿费、淡季和长期优惠、到校学杂费和在线报价。',
    keywords: 'JIC高级校区, 菲律宾碧瑶JIC语言学校, JIC Premium Campus, JIC Speaking, JIC TEP, 碧瑶语言学校',
    image: '/assets/philippines/jic-premium-campus-overview.jpg',
  },
  '/philippines-study/baguio/monol': {
    title: '菲律宾碧瑶MONOL主校区 | 课程住宿费用与在线报价',
    description:
      '菲律宾碧瑶MONOL主校区页面，整理Light ESL、General ESL、雅思和LEAP客制化课程、每天免费健身课、高级单人间到胶囊四人间六种房型、2026报名优惠、2027日历、到校学杂费、相册视频与单人多人报价。',
    keywords: '菲律宾碧瑶MONOL语言学校, MONOL主校区, MONOL Baguio, 碧瑶MONOL, LEAP English, 菲律宾ESL学校, 碧瑶语言学校, 菲律宾雅思学校',
    image: '/assets/philippines/monol-main/campus/building-aerial.webp',
  },
  '/philippines-study/baguio/monol-sparta-campus': {
    title: '菲律宾碧瑶MONOL斯巴达校区 | 2026课程住宿费用与报价',
    description:
      '菲律宾碧瑶MONOL斯巴达校区独立页面，整理Booster ESL、Master IELTS、每天至少10节学习安排、五种校内房型、2026课程住宿优惠、护照地区签证费用、接机、校规、相册视频与单人多人报价。',
    keywords: 'MONOL斯巴达校区, MONOL Sparta Campus, 碧瑶斯巴达学校, Booster ESL, Master IELTS, 菲律宾雅思学校, 碧瑶语言学校',
    image: '/assets/philippines/monol-sparta/campus-building.webp',
  },
  '/philippines-study/baguio/wales-academy': {
    title: '菲律宾碧瑶WALES语言学校 | 课程费用住宿与报名咨询',
    description:
      '菲律宾碧瑶WALES语言学校页面，整理WALES Academy的EEP、Infinity、IELTS、Junior课程、小校环境、Legarda位置、Studio/Premium/Share/Condo住宿、课程住宿费用和到校费用。',
    keywords: '菲律宾碧瑶WALES语言学校, WALES Academy, Widest Asian Learners English School, 碧瑶WALES, 碧瑶语言学校, 菲律宾IELTS学校',
    image: '/assets/philippines/wales-school-building.webp',
  },
  '/philippines-study/baguio/anj-e-edu-english-academy': {
    title: '菲律宾碧瑶A&J e-Edu语言学校 | 课程费用住宿与报名咨询',
    description:
      '菲律宾碧瑶A&J e-Edu Academy ECO校区：松林校园，Eco Relax、Eco Hub、Eco Sparta、雅思和托业保分班、雅思课程12周送官方考试、青少年课程，Deluxe到独栋别墅的住宿，2027课程住宿费用、在线报价和到校学杂费。',
    keywords:
      '菲律宾碧瑶A&J e-Edu语言学校, A&J e-Edu Academy, A&J ECO Campus, 碧瑶A&J, 菲律宾碧瑶语言学校, 菲律宾ESL学校, 菲律宾IELTS学校',
    image: '/assets/anj/campus/main-building.webp',
  },
  '/philippines-study/baguio/help-english-longlong-campus': {
    title: 'HELP English（Longlong Campus） | 碧瑶Sparta课程费用住宿',
    description:
      'HELP English Longlong Campus页面，整理HELP Baguio Longlong校区、Sparta学习制度、ESL、IELTS/TOEIC、Business、Family课程、4周USD课程住宿费、Baguio当地费用和当前开放状态确认提醒。',
    keywords:
      'HELP English Longlong Campus, HELP Baguio, HELP Longlong, 菲律宾碧瑶HELP English语言学校, 碧瑶Sparta学校, 菲律宾IELTS学校, HELP English费用',
    image: '/assets/philippines/baguio-study-hero.webp',
  },
  '/philippines-study/clark': {
    title: '克拉克菲律宾留学与英语游学 | 克拉克语言学校推荐',
    description:
      '克拉克菲律宾留学和英语游学指南，比较 CIP、菲律宾克拉克EG语言学校、菲律宾克拉克WE Academy语言学校、菲律宾克拉克HELP English语言学校、菲律宾克拉克AELC语言学校等学校，适合亲子、外师比例、Sparta考试路线和舒适生活需求。',
    keywords: '克拉克留学, 克拉克游学, 克拉克语言学校, 菲律宾亲子游学, CIP English, 菲律宾克拉克EG语言学校, 菲律宾克拉克WE Academy语言学校, 菲律宾克拉克HELP English语言学校, 菲律宾克拉克AELC语言学校, EG Academy, WE Academy Clark, HELP Clark, AELC',
    image: '/assets/philippines/clark-study-hero.webp',
  },
  '/philippines-study/clark/cip-english-kepos': {
    title: '菲律宾克拉克 CIP语言学校 | Native一对一课程费用住宿与报名咨询',
    description:
      '了解克拉克CIP的母语外教一对一、ESL、雅思及亲子课程，比较宿舍和酒店实景、2026年9月人民币价格与当地费用，查看入学测试、假期、学习管理及参考报价。',
    keywords: '菲律宾克拉克 CIP语言学校, CIP English Kepos, 克拉克CIP, Clark CIP, 菲律宾外教一对一, 克拉克语言学校',
    image: '/assets/philippines/cip-campus-intro.webp',
  },
  '/philippines-study/clark/eg-academy': {
    title: '菲律宾克拉克EG语言学校 | 课程费用住宿与报名咨询',
    description:
      '菲律宾克拉克EG语言学校页面，整理EG Academy的ESL、Native、IELTS、TOEIC、TOEFL、Business、Golf + ESL、Junior与Guardian课程、2025年USD课程住宿费和PHP到校费用。',
    keywords: '菲律宾克拉克EG语言学校, EG Academy, Education Group Granma, 克拉克EG, Clark EG, Golf ESL, 菲律宾亲子游学',
    image: '/assets/philippines/eg-facility-001.webp',
  },
  '/philippines-study/clark/clark-we-academy': {
    title: '菲律宾克拉克WE Academy语言学校 | 亲子Native Mix与活动费用咨询',
    description:
      '菲律宾克拉克WE Academy语言学校页面，整理Clark WE Academy的ESL、Native Mix、Junior ESL、Junior Native、Guardian ESL、WE Kindergarten、solo junior high support、Golf、Swimming、校内宿舍和公开PHP活动费用说明。',
    keywords: '菲律宾克拉克WE Academy语言学校, Clark WE Academy, WE Academy Clark, WE English Clark, 克拉克亲子游学, Native Mix, WE Kindergarten, Clark golf English',
    image: '/assets/philippines/we-hero.webp',
  },
  '/philippines-study/clark/help-english-clark': {
    title: '菲律宾克拉克HELP English语言学校 | 斯巴达课程、住宿与在线报价',
    description: '查看HELP克拉克校区的斯巴达管理、ESL、雅思、托业、商务英语和亲子营课程，2026年新房间实拍，开课日和淡季优惠，在线报价；学杂费单独列示。',
    keywords: 'HELP克拉克, HELP English Clark, 克拉克斯巴达学校, 菲律宾亲子游学, 克拉克雅思学校, HELP开课日',
    image: '/assets/help-clark/campus/main-building.webp',
  },
  '/philippines-study/clark/aelc-native-focused-clark-schools': {
    title: '菲律宾克拉克AELC语言学校 | Native口语课程费用住宿与报名咨询',
    description:
      '菲律宾克拉克AELC语言学校页面，整理American English Learning Center的Native口语、ESL、TOEIC、IELTS、Business、Family方向、AELC照片、4周USD课程住宿参考费用和报名注意事项。',
    keywords: '菲律宾克拉克AELC语言学校, AELC, American English Learning Center, Clark AELC, 菲律宾外教口语学校, 克拉克语言学校, Native English Clark',
    image: '/assets/philippines/aelc-main.webp',
  },
  '/philippines-study/manila': {
    title: '马尼拉菲律宾留学与英语游学 | 马尼拉语言学校推荐',
    description:
      '马尼拉菲律宾留学和英语游学指南，整理菲律宾马尼拉Enderun语言学校、菲律宾马尼拉American-English-Skill语言学校、菲律宾马尼拉Berlitz语言学校、菲律宾马尼拉Business College学校、马尼拉语言学校、商务英语、城市生活、课程选择和咨询规划重点。',
    keywords: '马尼拉留学, 马尼拉游学, 马尼拉语言学校, 菲律宾马尼拉Enderun语言学校, 菲律宾马尼拉American-English-Skill语言学校, 菲律宾马尼拉Berlitz语言学校, 菲律宾马尼拉Business College学校, 菲律宾商务英语, Enderun Extension, American English Skills Development Center, Berlitz Philippines, Manila Business College',
    image: '/assets/philippines/manila-study-hero.webp',
  },
  '/philippines-study/manila/enderun-extension': {
    title: '菲律宾马尼拉Enderun语言学校 | 课程费用与报名咨询',
    description:
      '菲律宾马尼拉Enderun语言学校页面，整理Enderun Extension的General English、Business English、Academic English、IELTS Test Preparation、One-on-One Top-Up、PHP课程费用、Book Fee和住宿自理说明。',
    keywords: '菲律宾马尼拉Enderun语言学校, Enderun Extension, Enderun Colleges, 马尼拉英语学校, Manila English, Business English Manila, Academic English Manila',
    image: '/assets/philippines/enderun-extension-socials.webp',
  },
  '/philippines-study/manila/american-english-skills-development-center': {
    title: '菲律宾马尼拉American-English-Skill语言学校 | 课程费用与报名咨询',
    description:
      '菲律宾马尼拉American-English-Skill语言学校页面，整理American English Skills Development Center的团体课、一对一、商务英语、商务写作、发音、演讲、企业培训、PHP课程费用和住宿自理说明。',
    keywords: '菲律宾马尼拉American-English-Skill语言学校, American English Skills Development Center, American English Makati, 马尼拉商务英语, Makati英语培训, Business English Philippines',
    image: '/assets/philippines/american-english-brand.webp',
  },
  '/philippines-study/manila/berlitz-philippines': {
    title: '菲律宾马尼拉Berlitz语言学校 | 课程费用与报名咨询',
    description:
      '菲律宾马尼拉Berlitz语言学校页面，整理Berlitz Philippines的成人私教、小组课、Self-paced、Kids & Teens、企业语言培训、商务沟通、语言测评、TELC、公开课排期、PHP费用和住宿自理说明。',
    keywords: '菲律宾马尼拉Berlitz语言学校, Berlitz Philippines, Berlitz Makati, 马尼拉语言培训, Manila language center, TELC Philippines, Business Communication Training',
    image: '/assets/philippines/berlitz-hero.webp',
  },
  '/philippines-study/manila/manila-business-college': {
    title: '菲律宾马尼拉Business College学校 | 课程费用与国际学生申请',
    description:
      '菲律宾马尼拉Business College学校页面，整理Manila Business College的ABM、BSBA、Accountancy、Hospitality Management、Information Systems、夜间班、周末班、TESDA、国际学生材料、奖学金公开金额和住宿需确认说明。',
    keywords: '菲律宾马尼拉Business College学校, Manila Business College, MBC Manila, 马尼拉商科学院, 菲律宾商科留学, Manila college, Sta Cruz Manila school',
    image: '/assets/philippines/mbc-about.webp',
  },
  '/philippines-study/boracay': {
    title: '长滩岛菲律宾游学 | 海岛英语课程与语言学校',
    description:
      '长滩岛菲律宾游学适合希望兼顾英语学习和海岛生活的学生，了解课程强度、住宿、预算和适合人群。',
    keywords: '长滩岛游学, Boracay游学, 菲律宾海岛游学, 菲律宾英语课程',
    image: '/assets/philippines/manila-study-hero.webp',
  },
  '/philippines-study/bacolod': {
    title: '巴科洛德菲律宾留学与英语游学 | 语言学校选择',
    description:
      '巴科洛德菲律宾留学和英语游学指南，适合关注生活成本、安静学习环境、长期英语提升和E-Room Language Center的学生。',
    keywords: '巴科洛德留学, 巴科洛德游学, Bacolod语言学校, 菲律宾低预算游学, E-Room Language Center',
    image: '/assets/philippines/baguio-study-hero.webp',
  },
  '/philippines-study/bacolod/e-room-language-center': {
    title: '菲律宾巴科洛德E-Room Language Center | 2024年USD课程住宿费用',
    description:
      '菲律宾巴科洛德E-Room Language Center页面，整理2024年ESL/青少年、IELTS/TOEIC/商务英语、监护人、幼儿园课程、USD课程住宿费、PHP当地费用和报名注意事项。',
    keywords:
      '菲律宾巴科洛德E-Room Language Center, E-Room Bacolod, EROOM, 巴科洛德语言学校, 菲律宾ESL学校, 菲律宾低预算游学, Bacolod English school',
    image: '/assets/philippines/baguio-study-hero.webp',
  },
  '/philippines-study/iloilo': {
    title: '伊洛伊洛菲律宾留学与英语游学 | Iloilo语言学校',
    description:
      '伊洛伊洛菲律宾留学和英语游学城市指南，帮助学生了解安全环境、学习氛围、生活成本、PIA、WE Academy、GITC和MK Language Training Center等课程选择。',
    keywords: '伊洛伊洛留学, 伊洛伊洛游学, Iloilo语言学校, 菲律宾英语游学, PIA Iloilo, WE Academy Iloilo, MK Language Training Center, GITC Iloilo',
    image: '/assets/philippines/baguio-study-hero.webp',
  },
  '/philippines-study/iloilo/polyglot-international-academy': {
    title: '菲律宾伊洛伊洛PIA语言学校 | ESL考试口语与2024费用',
    description:
      '菲律宾伊洛伊洛PIA语言学校页面，整理Polyglot International Academy的ESL、考试、Power Speaking、青少年和监护人课程，以及2024年4周USD课程、校外合作酒店住宿和注册费用。',
    keywords:
      '菲律宾伊洛伊洛PIA语言学校, Polyglot International Academy, PIA Iloilo, 伊洛伊洛语言学校, 怡朗PIA, 菲律宾ESL学校, Power Speaking',
    image: '/assets/philippines/baguio-study-hero.webp',
  },
  '/philippines-study/iloilo/mk-language-training-center': {
    title: '菲律宾伊洛伊洛MK Language Training Center | ESL雅思亲子课程费用',
    description:
      '菲律宾伊洛伊洛MK Language Training Center页面，整理MK Iloilo的ESL Basic至Intensive、IELTS、TESOL、Business、Working Holiday、Junior、Internship课程、短期与4周USD课程住宿费、PHP当地费用和报名注意事项。',
    keywords:
      '菲律宾伊洛伊洛MK Language Training Center, MK Iloilo, MK Education Iloilo, 伊洛伊洛语言学校, 菲律宾ESL学校, 菲律宾亲子游学, 菲律宾IELTS学校',
    image: '/assets/philippines/baguio-study-hero.webp',
  },
  '/philippines-study/davao': {
    title: '达沃菲律宾留学与英语游学 | Davao语言学校',
    description:
      '达沃菲律宾留学和英语游学城市指南，整理城市特点、适合人群、学习环境和费用规划方向。',
    keywords: '达沃留学, 达沃游学, Davao语言学校, 菲律宾英语学校',
    image: '/assets/philippines/manila-study-hero.webp',
  },
  '/philippines-study/subic': {
    title: '苏比克菲律宾留学与英语游学 | Subic语言学校',
    description:
      '苏比克菲律宾留学和英语游学城市指南，适合关注生活环境、亲子游学、英语课程和安全感的学生家庭。',
    keywords: '苏比克留学, 苏比克游学, Subic语言学校, 菲律宾亲子英语游学',
    image: '/assets/philippines/clark-study-hero.webp',
  },
  '/philippines-study/cost': {
    title: '菲律宾留学费用 | 英语游学学费住宿生活费预算',
    description:
      '菲律宾留学和英语游学费用说明，拆解学费、住宿、当地费用、机票、签证、保险和不同城市学校的预算差异。',
    keywords: '菲律宾留学费用, 菲律宾游学费用, 菲律宾语言学校费用, 宿务游学费用, 菲律宾英语学校价格',
    image: '/assets/philippines/home-school-ev.webp',
  },
  '/price-compare': {
    title: '菲律宾语言学校价格对比 | 课程住宿费用在线比较',
    description:
      '选好学习目标、房型、周数和入学日期，在线对比菲律宾宿务语言学校的课程费、住宿费、优惠和到校学杂费，可保存对比图片。',
    keywords: '菲律宾语言学校价格对比, 菲律宾游学费用对比, 宿务语言学校对比, CIA和EV对比, 菲律宾游学报价',
    image: '/assets/philippines/cebu-city-view.webp',
  },
  '/philippines-study/baguio/airport-pickup': {
    title: '2026–2027 碧瑶游学接机指南｜马尼拉、克拉克接机日期、费用与注意事项',
    description: '查看2026及2027碧瑶BESA指定接机日期、马尼拉和克拉克班次、集合点、现行3000比索费用、eTravel顾问办理及航班延误处理。',
    keywords: '碧瑶接机,BESA接机,2026碧瑶接机,2027碧瑶接机,马尼拉接机,克拉克接机',
    image: '/assets/baguio-pickup/besa-calendar-2027.png',
    type: 'article',
  },
  '/philippines-study/faq': {
    title: '菲律宾留学常见问题 | 英语游学报名与行前准备',
    description:
      '菲律宾留学和英语游学常见问题，覆盖课程选择、报名时间、住宿、签证、接机、费用和行前准备。',
    keywords: '菲律宾留学常见问题, 菲律宾游学FAQ, 菲律宾英语游学报名, 菲律宾游学签证',
    image: '/assets/philippines/pines-campus-hero.webp',
  },
  '/philippines-study/offers': {
    title: '菲律宾语言学校优惠 | 英语游学最新报名方案',
    description:
      '查看菲律宾语言学校优惠和报名方案，结合开课时间、住宿房型、课程类型和预算获取适合的英语游学报价。',
    keywords: '菲律宾语言学校优惠, 菲律宾游学优惠, 菲律宾留学报价, 菲律宾英语学校报名',
    image: '/assets/philippines/jic-campus-hero.webp',
  },
  '/philippines-study/recommendations/ielts-schools': {
    title: '菲律宾雅思学校推荐 | IELTS英语游学选校',
    description:
      '菲律宾雅思学校推荐，比较宿务、碧瑶等城市的 IELTS 课程、斯巴达强度、模考安排和适合提分目标。',
    keywords: '菲律宾雅思学校, 菲律宾IELTS, 雅思游学, 宿务雅思学校, 碧瑶雅思学校',
    image: '/assets/cia/campus-building.webp',
  },
  '/philippines-study/recommendations/budget-schools': {
    title: '菲律宾低预算语言学校推荐 | 高性价比英语游学',
    description:
      '菲律宾低预算语言学校推荐，从学费、住宿、当地费用和城市生活成本比较适合长期英语游学的方案。',
    keywords: '菲律宾便宜语言学校, 菲律宾低预算游学, 菲律宾游学性价比, 菲律宾英语学校费用',
    image: '/assets/philippines/monol-campus-building.webp',
  },
  '/philippines-study/recommendations/family-schools': {
    title: '菲律宾亲子游学学校推荐 | 家庭英语课程规划',
    description:
      '菲律宾亲子游学学校推荐，适合家长和孩子一起学习英语，关注课程安排、住宿、安全、餐食和假期时间。',
    keywords: '菲律宾亲子游学, 菲律宾家庭游学, 菲律宾儿童英语游学, 宿务亲子游学',
    image: '/assets/cpi/campus-pool.webp',
  },
  '/philippines-study/recommendations/junior-camp': {
    title: '菲律宾青少年夏令营 | 暑假英语游学营',
    description:
      '菲律宾青少年夏令营和暑假英语游学营规划，覆盖课程强度、住宿管理、活动安排、安全照顾和报名建议。',
    keywords: '菲律宾夏令营, 菲律宾青少年游学, 菲律宾英语夏令营, 菲律宾暑假游学',
    image: '/assets/philippines/pines-campus-hero.webp',
  },
  '/philippines-study/recommendations/sparta-schools': {
    title: '菲律宾斯巴达语言学校推荐 | 强化英语游学',
    description:
      '菲律宾斯巴达语言学校推荐，适合希望集中提升英语、雅思或口语的学生，比较管理强度、课程量和自习安排。',
    keywords: '菲律宾斯巴达学校, 菲律宾强化英语, 碧瑶斯巴达, 宿务斯巴达, 菲律宾雅思强化',
    image: '/assets/philippines/home-school-ev.webp',
  },
  '/philippines-study/schools/by-course': {
    title: '菲律宾语言学校按课程选择 | ESL雅思商务英语',
    description:
      '按课程选择菲律宾语言学校，覆盖 ESL、雅思 IELTS、托业 TOEIC、商务英语、亲子课程和青少年课程。',
    keywords: '菲律宾ESL课程, 菲律宾雅思课程, 菲律宾商务英语, 菲律宾语言学校课程',
    image: '/assets/philinter/group-classroom.webp',
  },
  '/philippines-study/schools/by-style': {
    title: '菲律宾语言学校按风格选择 | 斯巴达半斯巴达度假型',
    description:
      '按学习风格选择菲律宾语言学校，比较斯巴达、半斯巴达、度假型、亲子型和外师比例高的学校。',
    keywords: '菲律宾斯巴达, 菲律宾半斯巴达, 菲律宾度假型学校, 菲律宾亲子学校',
    image: '/assets/cia/campus-pool.webp',
  },
  '/philippines-study/schools/popular': {
    title: '菲律宾热门语言学校 | 宿务碧瑶克拉克学校推荐',
    description:
      '菲律宾热门语言学校整理，覆盖 CIA、EV、菲律宾宿务CPI语言学校、菲律宾宿务Philinter语言学校、菲律宾碧瑶PINES语言学校、BECI、JIC 等学校的课程和适合人群。',
    keywords: '菲律宾热门语言学校, 菲律宾学校推荐, 宿务英语学校, 碧瑶英语学校, 克拉克英语学校',
    image: '/assets/philippines/beci-eop-campus.webp',
  },
  '/study-tour-guide/philippines': {
    title: '菲律宾游学攻略 | 英语课程选校费用与行前准备',
    description:
      '菲律宾游学攻略，帮助学生和家长了解英语课程、学校选择、城市差异、费用预算、报名流程和行前准备。',
    keywords: '菲律宾游学攻略, 菲律宾留学攻略, 菲律宾英语游学攻略, 菲律宾语言学校怎么选',
    image: '/assets/philippines/wales-school-building.webp',
  },
  [BRAND_ABOUT_PATH]: {
    title: '关于思达启航 | 公司信息、服务流程与常见问题',
    description: BRAND_SUMMARY_ZH,
    keywords: '思达启航, 深圳市思达启航文化交流有限公司, SIDA QIHANG, 思达游学, 思达启航怎么样, 菲律宾英语游学, 菲律宾游学中介',
    image: BRAND_LOGO,
  },
  '/about-sida/contact': {
    title: '联系思达启航 | 菲律宾留学英语游学咨询',
    description:
      '联系思达启航顾问，获取菲律宾留学、英语游学、语言学校选校、费用报价和行前规划建议。',
    keywords: '菲律宾留学咨询, 菲律宾游学顾问, 菲律宾语言学校报价, 思达启航联系方式',
    image: '/assets/sida-qihang-education-logo-rectangle.webp',
  },
};

const SCHOOL_CITY_NAMES: Record<string, string> = {
  cebu: '宿务',
  boracay: '长滩岛',
  clark: '克拉克',
  iloilo: '伊洛伊洛',
};

/**
 * School detail pages that previously had only their city's generic title. `quote` marks pages
 * with an online quote calculator, so descriptions never promise a calculator a page lacks.
 * An explicit SEO_PAGES entry always wins over these generated ones.
 */
const SCHOOL_DETAIL_SEO: Array<{ path: string; name: string; brand: string; aliases?: string; quote: boolean; image?: string }> = [
  { path: '/philippines-study/cebu/cia-cebu-international-academy', name: '菲律宾宿务CIA语言学校', brand: 'CIA', aliases: 'CIA Cebu International Academy', quote: true, image: '/assets/cia/campus-building.webp' },
  { path: '/philippines-study/cebu/ev-academy', name: '菲律宾宿务EV语言学校', brand: 'EV Academy', quote: true },
  { path: '/philippines-study/cebu/cpi-cebu-pelis-institute', name: '菲律宾宿务CPI语言学校', brand: 'CPI', aliases: 'Cebu Pelis Institute', quote: true },
  { path: '/philippines-study/cebu/cpils', name: '菲律宾宿务CPILS语言学校', brand: 'CPILS', quote: true },
  { path: '/philippines-study/cebu/cg-academy-banilad-campus', name: '菲律宾宿务CG Academy Banilad校区', brand: 'CG Banilad', aliases: 'CG Academy', quote: true },
  { path: '/philippines-study/cebu/philinter-academy', name: '菲律宾宿务Philinter语言学校', brand: 'Philinter', quote: true },
  { path: '/philippines-study/cebu/english-fella-first-campus', name: '菲律宾宿务English Fella第一校区', brand: 'English Fella 第一校区', aliases: 'English Fella', quote: true, image: '/assets/fella-1/campus/aerial.webp' },
  { path: '/philippines-study/cebu/english-fella-second-campus', name: '菲律宾宿务English Fella第二校区', brand: 'English Fella 第二校区', aliases: 'English Fella', quote: true, image: '/assets/fella-2/campus/aerial.webp' },
  { path: '/philippines-study/cebu/ibreeze', name: '菲律宾宿务I.BREEZE语言学校', brand: 'I.BREEZE', quote: true },
  { path: '/philippines-study/cebu/iu-english-academy', name: '菲律宾宿务IU English Academy语言学校', brand: 'IU', quote: true },
  { path: '/philippines-study/cebu/icl', name: '菲律宾宿务ICL语言学校', brand: 'ICL', quote: true },
  { path: '/philippines-study/cebu/ims-academy', name: '菲律宾宿务IMS Academy语言学校', brand: 'IMS', quote: true },
  { path: '/philippines-study/cebu/cella-uni-sparta-campus', name: '菲律宾宿务CELLA Uni Sparta校区', brand: 'CELLA Uni Sparta', aliases: 'CELLA', quote: true },
  { path: '/philippines-study/cebu/cella-premium-campus', name: '菲律宾宿务CELLA Premium校区', brand: 'CELLA Premium', aliases: 'CELLA', quote: true },
  { path: '/philippines-study/cebu/cebu-blue-ocean-academy', name: '菲律宾宿务蓝海语言学校（Cebu Blue Ocean Academy）', brand: '蓝海CBOA', aliases: 'Cebu Blue Ocean', quote: true, image: '/assets/cebu-blue-ocean/suites/pool.webp' },
  { path: '/philippines-study/cebu/target-global-english-academy', name: '菲律宾宿务TARGET Global English Academy', brand: 'TARGET', quote: true },
  { path: '/philippines-study/cebu/global-language-cebu', name: '菲律宾宿务GLC语言学校（Global Language Cebu）', brand: 'GLC', aliases: 'Global Language Cebu', quote: true },
  { path: '/philippines-study/cebu/ciec', name: '菲律宾宿务CIEC语言学校', brand: 'CIEC', quote: true },
  { path: '/philippines-study/cebu/glant', name: '菲律宾宿务GLANT语言学校', brand: 'GLANT', quote: false },
  { path: '/philippines-study/cebu/cij-academy-premium-campus', name: '菲律宾宿务CIJ Academy Premium校区', brand: 'CIJ Premium', aliases: 'CIJ Academy', quote: false },
  { path: '/philippines-study/cebu/3d-academy', name: '菲律宾宿务3D Academy语言学校', brand: '3D Academy', quote: false },
  { path: '/philippines-study/cebu/curious-world-academy', name: '菲律宾宿务Curious World Academy', brand: 'Curious World', quote: false },
  { path: '/philippines-study/cebu/ethos-language-school', name: '菲律宾宿务ETHOS语言学校', brand: 'ETHOS', aliases: 'ETHOS Language School', quote: false },
  { path: '/philippines-study/cebu/first-english-global-college', name: '菲律宾宿务First English Global College', brand: 'First English', quote: false },
  { path: '/philippines-study/cebu/genius-english-academy', name: '菲律宾宿务Genius English Academy语言学校', brand: 'Genius English', quote: true },
  { path: '/philippines-study/cebu/howdy-english-academy', name: '菲律宾宿务Howdy English Academy语言学校', brand: 'Howdy', quote: false },
  { path: '/philippines-study/cebu/lapulapu', name: '菲律宾宿务LCIC大学英语项目', brand: 'LCIC', aliases: 'Lapulapu-Cebu International College', quote: false },
  { path: '/philippines-study/cebu/qqenglish-beachfront-campus', name: '菲律宾宿务QQEnglish Beachfront校区', brand: 'QQEnglish', quote: false },
  { path: '/philippines-study/cebu/stargate-global-education', name: '菲律宾宿务STARGATE Global Education', brand: 'STARGATE', quote: false },
  { path: '/philippines-study/cebu/winning-english-academy', name: '菲律宾宿务Winning English Academy', brand: 'Winning', quote: false },
  { path: '/philippines-study/boracay/boracay-coco-english-academy', name: '菲律宾长滩岛Boracay Coco English Academy', brand: 'Coco English', quote: false },
  { path: '/philippines-study/boracay/paradise-english-boracay-language-institute', name: '菲律宾长滩岛Paradise English语言学校', brand: 'Paradise English', quote: false },
  { path: '/philippines-study/clark/hana-academy', name: '菲律宾克拉克HANA语言学校', brand: 'HANA Academy', aliases: 'HANA Academy Clark', quote: true, image: '/assets/hana/campus/pool-fountain.webp' },
  { path: '/philippines-study/clark/talk-academy', name: '菲律宾克拉克TALK Academy语言学校', brand: 'TALK Academy', quote: false },
  { path: '/philippines-study/iloilo/gitc-college-international-language-center', name: '菲律宾伊洛伊洛GITC College语言学校', brand: 'GITC', quote: false },
  { path: '/philippines-study/iloilo/we-academy', name: '菲律宾伊洛伊洛WE Academy语言学校', brand: 'WE Academy', quote: false },
];

for (const school of SCHOOL_DETAIL_SEO) {
  if (SEO_PAGES[school.path]) {
    continue;
  }
  const city = SCHOOL_CITY_NAMES[school.path.split('/')[2]] ?? '菲律宾';
  SEO_PAGES[school.path] = {
    title: `${school.name} | ${school.quote ? '课程住宿费用与报价' : '课程住宿与费用参考'}`,
    description: school.quote
      ? `${school.name}介绍：课程设置、住宿房型、费用明细与校园环境，可在线计算报价并保存报价图片；思达启航提供${city}游学选校与申请咨询。`
      : `${school.name}介绍：课程设置、住宿房型、费用参考与校园环境；思达启航提供${city}游学选校与申请咨询。`,
    keywords: [
      school.brand,
      school.aliases,
      `${school.brand}费用`,
      school.quote ? `${school.brand}报价` : `${school.brand}学费`,
      `${city}语言学校`,
      `菲律宾${city}游学`,
    ]
      .filter(Boolean)
      .join(', '),
    image: school.image,
  };
}

/** City-level fallbacks for detail pages without their own entry, checked in order. */
export const SECTION_SEO: Array<{ prefix: string; page: SeoPage }> = [
  {
    prefix: '/philippines-study/cebu/cia-cebu-international-academy/student-reviews/',
    page: {
      title: 'CIA学生反馈 | 宿务英语游学真实体验',
      description: '阅读CIA学生在课堂适应、口语提升、宿务生活与文化体验方面的中文反馈整理。',
      keywords: 'CIA学生反馈, 宿务游学体验, 菲律宾英语学习体验, CIA语言学校',
      image: '/assets/cia/student-reviews/review-city-night.webp',
    },
  },
  {
    prefix: '/philippines-study/cebu/',
    page: {
      title: '宿务菲律宾语言学校详情 | 课程费用住宿咨询',
      description: '查看宿务菲律宾语言学校详情，了解课程设置、住宿房型、费用组成、校园环境和适合人群。',
      keywords: '宿务语言学校详情, 菲律宾语言学校费用, 宿务英语学校, 菲律宾留学咨询',
      image: '/assets/cia/campus-building.webp',
    },
  },
  {
    prefix: '/philippines-study/baguio/',
    page: {
      title: '碧瑶菲律宾语言学校详情 | 斯巴达英语课程咨询',
      description: '查看碧瑶菲律宾语言学校详情，了解斯巴达课程、雅思备考、住宿费用、校园管理和适合人群。',
      keywords: '碧瑶语言学校详情, 菲律宾斯巴达学校, 碧瑶雅思学校, 菲律宾英语游学',
      image: '/assets/philippines/baguio-study-hero.webp',
    },
  },
  {
    prefix: '/philippines-study/clark/',
    page: {
      title: '克拉克菲律宾语言学校详情 | 外师亲子英语课程咨询',
      description: '查看克拉克菲律宾语言学校详情，了解外师比例、亲子课程、住宿环境、费用组成和适合人群。',
      keywords: '克拉克语言学校详情, 菲律宾亲子游学, 克拉克英语学校, 菲律宾外教课程',
      image: '/assets/philippines/clark-study-hero.webp',
    },
  },
  {
    prefix: '/philippines-study/manila/',
    page: {
      title: '马尼拉菲律宾语言学校详情 | 商务英语课程咨询',
      description: '查看马尼拉菲律宾语言学校详情，了解商务英语、城市生活、课程设置、费用组成和申请建议。',
      keywords: '马尼拉语言学校详情, 菲律宾商务英语, 马尼拉英语学校, 菲律宾留学咨询',
      image: '/assets/philippines/manila-study-hero.webp',
    },
  },
  {
    prefix: '/philippines-study/iloilo/',
    page: {
      title: '伊洛伊洛菲律宾语言学校详情 | ESL课程费用住宿咨询',
      description: '查看伊洛伊洛菲律宾语言学校详情，了解ESL、考试课程、住宿费用、校园管理和适合人群。',
      keywords: '伊洛伊洛语言学校详情, Iloilo英语学校, 菲律宾ESL学校, 菲律宾英语游学',
      image: '/assets/philippines/baguio-study-hero.webp',
    },
  },
  {
    prefix: '/philippines-study/bacolod/',
    page: {
      title: '巴科洛德菲律宾语言学校详情 | 低预算ESL课程咨询',
      description: '查看巴科洛德菲律宾语言学校详情，了解ESL、考试课程、住宿费用、校园管理和适合人群。',
      keywords: '巴科洛德语言学校详情, Bacolod英语学校, 菲律宾低预算ESL学校, 菲律宾英语游学',
      image: '/assets/philippines/baguio-study-hero.webp',
    },
  },
];

/** The document title shown for a page: appends the site name unless already present or an article. */
export function seoTitle(page: SeoPage): string {
  return page.type === 'article' || page.title.includes(SITE_NAME) ? page.title : `${page.title} | ${SITE_NAME}`;
}

const BREADCRUMB_LABELS: Record<string, string> = {
  'philippines-study': '菲律宾留学',
  'study-tour-guide': '游学攻略',
  'student-feedback': '学员反馈',
  'study-tour': '游学反馈',
  'philippines-study-mid-autumn': '中秋关怀记录',
  recommendations: '学校推荐',
  schools: '语言学校',
  cebu: '宿务',
  baguio: '碧瑶',
  'airport-pickup': '碧瑶接机指南',
  clark: '克拉克',
  iloilo: '伊洛伊洛',
  bacolod: '巴科洛德',
  'eg-academy': '菲律宾克拉克EG语言学校',
  'clark-we-academy': '菲律宾克拉克WE Academy语言学校',
  'help-english-clark': '菲律宾克拉克HELP English语言学校',
  'help-english-longlong-campus': 'HELP English Longlong Campus',
  'aelc-native-focused-clark-schools': '菲律宾克拉克AELC语言学校',
  'hana-academy': '菲律宾克拉克HANA Academy',
  manila: '马尼拉',
  'enderun-extension': '菲律宾马尼拉Enderun语言学校',
  'american-english-skills-development-center': '菲律宾马尼拉American-English-Skill语言学校',
  'berlitz-philippines': '菲律宾马尼拉Berlitz语言学校',
  'manila-business-college': '菲律宾马尼拉Business College学校',
  'mk-language-training-center': '菲律宾伊洛伊洛MK Language Training Center',
  'polyglot-international-academy': '菲律宾伊洛伊洛PIA语言学校',
  'gitc-college-international-language-center': '菲律宾伊洛伊洛GITC College语言学校',
  'e-room-language-center': '菲律宾巴科洛德E-Room Language Center',
  cost: '费用',
  faq: '常见问题',
  offers: '优惠',
  'by-city': '按城市选校',
  'by-course': '按课程选校',
  'by-style': '按风格选校',
  popular: '热门学校',
  'about-sida': '关于思达启航',
  about: '关于思达启航',
  contact: '联系我们',
};

/** Breadcrumb parents that are not pages themselves link to this page instead. */
const BREADCRUMB_ROUTES: Record<string, string> = {
  '/student-feedback': '/student-feedback/study-tour',
  '/about-sida': BRAND_ABOUT_PATH,
};

function humanizeSegment(segment: string): string {
  return segment
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function breadcrumbItems(path: string, origin: string): Array<Record<string, unknown>> {
  const items: Array<{ name: string; url: string }> = [{ name: '首页', url: `${origin}/` }];
  let current = '';
  for (const segment of path.split('/').filter(Boolean)) {
    current += `/${segment}`;
    const url = `${origin}${BREADCRUMB_ROUTES[current] ?? current}`;
    const name = BREADCRUMB_LABELS[segment] ?? humanizeSegment(segment);
    // A parent that links to its child's page would list that page twice; keep one entry.
    if (items[items.length - 1].url === url) {
      items[items.length - 1] = { name, url };
    } else {
      items.push({ name, url });
    }
  }

  return items.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, item: item.url }));
}

/**
 * schema.org JSON-LD for a page. The browser SeoService and the build (which puts it in the initial
 * HTML) both call this with the canonical origin, so they produce the same data. The home page and the
 * about page carry the full Organization from the brand fact card (brand-facts.ts); other pages refer
 * to it by @id.
 */
export function buildSeoStructuredData(path: string, page: SeoPage, origin = BRAND_SITE_ORIGIN): Record<string, unknown> {
  const pageUrl = `${origin}${path}`;
  const title = seoTitle(page);
  const imagePath = page.image ?? DEFAULT_IMAGE;
  const image = /^https?:\/\//i.test(imagePath) ? imagePath : `${origin}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
  const websiteId = `${origin}/#website`;
  const organizationId = `${origin}/#organization`;
  const isAbout = path === BRAND_ABOUT_PATH;

  const graph: Array<Record<string, unknown>> = [
    {
      '@type': 'WebSite',
      '@id': websiteId,
      url: `${origin}/`,
      name: SITE_NAME,
      alternateName: BRAND.name,
      publisher: { '@id': organizationId },
      inLanguage: 'zh-CN',
    },
    path === '/' || isAbout
      ? brandOrganizationNode(origin)
      : {
          '@type': 'EducationalOrganization',
          '@id': organizationId,
          name: BRAND.name,
          url: `${origin}/`,
          logo: `${origin}${BRAND_LOGO}`,
        },
    {
      '@type': isAbout ? 'AboutPage' : 'WebPage',
      '@id': `${pageUrl}#webpage`,
      url: pageUrl,
      name: title,
      description: page.description,
      image,
      isPartOf: { '@id': websiteId },
      inLanguage: 'zh-CN',
      ...(isAbout ? { about: { '@id': organizationId }, mainEntity: { '@id': organizationId }, dateModified: BRAND_FACTS_UPDATED } : {}),
    },
  ];

  if (page.type === 'article') {
    graph.push({
      '@type': 'Article',
      '@id': `${pageUrl}#article`,
      headline: title,
      description: page.description,
      image,
      mainEntityOfPage: { '@id': `${pageUrl}#webpage` },
      author: { '@id': organizationId },
      publisher: { '@id': organizationId },
      inLanguage: 'zh-CN',
    });
  }

  if (isAbout) {
    graph.push(brandFaqNode(pageUrl));
  }

  if (path !== '/') {
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `${pageUrl}#breadcrumb`,
      itemListElement: breadcrumbItems(path, origin),
    });
  }

  return { '@context': 'https://schema.org', '@graph': graph };
}

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
    const title = seoTitle(page);
    const canonicalUrl = this.absoluteUrl(path);
    const imageUrl = this.absoluteUrl(page.image ?? DEFAULT_IMAGE);

    this.title.setTitle(title);
    this.upsertTag('name', 'description', page.description);
    this.upsertTag('name', 'keywords', page.keywords);
    this.upsertTag('name', 'robots', 'index, follow, max-image-preview:large');
    this.upsertTag('property', 'og:site_name', SITE_NAME);
    this.upsertTag('property', 'og:type', page.type ?? 'website');
    this.upsertTag('property', 'og:title', title);
    this.upsertTag('property', 'og:description', page.description);
    this.upsertTag('property', 'og:url', canonicalUrl);
    this.upsertTag('property', 'og:image', imageUrl);
    this.upsertTag('name', 'twitter:card', 'summary_large_image');
    this.upsertTag('name', 'twitter:title', title);
    this.upsertTag('name', 'twitter:description', page.description);
    this.upsertTag('name', 'twitter:image', imageUrl);
    this.setCanonical(canonicalUrl);
    this.setStructuredData(path, page);
  }

  private findSectionSeo(path: string): SeoPage | undefined {
    return SECTION_SEO.find((section) => path.startsWith(section.prefix))?.page;
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

  private setStructuredData(path: string, page: SeoPage): void {
    let script = this.document.getElementById('seo-json-ld') as HTMLScriptElement | null;
    if (!script) {
      script = this.document.createElement('script');
      script.id = 'seo-json-ld';
      script.type = 'application/ld+json';
      this.document.head.appendChild(script);
    }

    // The server already put the same JSON-LD in the initial HTML for pages listed in SEO_PAGES.
    script.textContent = JSON.stringify(buildSeoStructuredData(path, page));
  }
}

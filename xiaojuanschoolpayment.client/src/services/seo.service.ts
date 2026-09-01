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
      '按城市比较菲律宾语言学校，覆盖宿务、碧瑶、克拉克、马尼拉、伊洛伊洛、达沃、苏比克等地区，帮助学生按预算和目标选校。',
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
    keywords: '碧瑶留学, 碧瑶游学, 碧瑶语言学校, 菲律宾斯巴达学校, 菲律宾碧瑶PINES语言学校, Pines, BECI, 菲律宾碧瑶JIC语言学校, MONOL',
    image: '/assets/philippines/baguio-study-hero.jpg',
  },
  '/philippines-study/cebu/bcebu': {
    title: "菲律宾宿务B'Cebu语言学校 | 2026课程住宿费用",
    description:
      "菲律宾宿务B'Cebu语言学校2026费用页面，整理Speed ESL、Intensive ESL、IELTS、B'SPARTA、商务英语、Junior、幼儿园课程、住宿房型与1至3周短期比例。",
    keywords: "菲律宾宿务B'Cebu语言学校, BECI B'Cebu, B Cebu, 宿务语言学校, 宿务IELTS, 宿务亲子游学",
    image: '/assets/study-hero-collage.png',
  },
  '/philippines-study/cebu/btes-english-academy': {
    title: '菲律宾宿务BTES语言学校 | 课程、住宿与报名咨询',
    description:
      '菲律宾宿务BTES语言学校介绍，整理General ESL、IELTS、TOEIC、Business、Junior与Family课程、学校位置、适合人群和报名咨询。',
    keywords: '菲律宾宿务BTES语言学校, BTES English Academy, Brainy Tutelage English School, 宿务高性价比语言学校, 宿务亲子游学',
    image: 'https://www.fujiyama-international.com/archives/004/202404/b862d6cf8e313f63b336bb005f3f05e9.jpg',
  },
  '/philippines-study/cebu/elsa-international-language-school': {
    title: '菲律宾宿务ELSA语言学校 | 2026-2027课程食宿费用',
    description:
      '菲律宾宿务ELSA语言学校2026-2027费用页面，整理Guardian、成人ESL、青少年、全天/半天学校、幼儿园课程、2至5人间和单人间附加费。',
    keywords: '菲律宾宿务ELSA语言学校, ELSA International Language School, 宿务亲子游学, 宿务幼儿园英语, ELSA费用',
    image: '/assets/study-hero-collage.png',
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
  '/philippines-study/baguio/baguio-jic': {
    title: '菲律宾碧瑶JIC语言学校 | Challenger与Premium校区课程费用住宿',
    description:
      '菲律宾碧瑶JIC语言学校页面，整理Baguio JIC Challenger Campus、Premium Campus、ESL、IELTS、TOEIC、TEP、Speaking、Active Senior、Business、Working Holiday、青少年与监护人课程、2026课程费、住宿房型、优惠规则和报名注意事项。',
    keywords: '菲律宾碧瑶JIC语言学校, Baguio JIC, Baguio JIC Challenger Campus, JIC Premium Campus, JIC Academy Baguio, 碧瑶雅思学校, 碧瑶语言学校',
    image: '/assets/philippines/jic-campus-hero.jpg',
  },
  '/philippines-study/baguio/monol': {
    title: '菲律宾碧瑶MONOL语言学校 | 课程费用住宿与报名咨询',
    description:
      '菲律宾碧瑶MONOL语言学校页面，整理MONOL的ESL 4、General ESL、IELTS、LEAP课程、Hotel-style住宿房型、课程住宿费用、餐费说明和当地费用。',
    keywords: '菲律宾碧瑶MONOL语言学校, MONOL Baguio, mymonol, 碧瑶MONOL, 菲律宾ESL学校, 碧瑶语言学校, 菲律宾雅思学校',
    image: '/assets/philippines/monol-campus-building.jpg',
  },
  '/philippines-study/baguio/wales-academy': {
    title: '菲律宾碧瑶WALES语言学校 | 课程费用住宿与报名咨询',
    description:
      '菲律宾碧瑶WALES语言学校页面，整理WALES Academy的EEP、Infinity、IELTS、Junior课程、小校环境、Legarda位置、Studio/Premium/Share/Condo住宿、课程住宿费用和到校费用。',
    keywords: '菲律宾碧瑶WALES语言学校, WALES Academy, Widest Asian Learners English School, 碧瑶WALES, 碧瑶语言学校, 菲律宾IELTS学校',
    image: '/assets/philippines/wales-school-building.jpg',
  },
  '/philippines-study/baguio/anj-e-edu-english-academy': {
    title: '菲律宾碧瑶A&J e-Edu语言学校 | 课程费用住宿与报名咨询',
    description:
      '菲律宾碧瑶A&J e-Edu English Academy页面，整理A&J ECO Campus、Eco Relax Lite/Plus、Eco Hub、Eco Sparta、IELTS/TOEIC、Junior课程、Deluxe/Premium/Eco Villa住宿、2026费用和当地费用。',
    keywords:
      '菲律宾碧瑶A&J e-Edu语言学校, A&J e-Edu Academy, A&J ECO Campus, 碧瑶A&J, 菲律宾碧瑶语言学校, 菲律宾ESL学校, 菲律宾IELTS学校',
    image: '/assets/philippines/baguio-study-hero.jpg',
  },
  '/philippines-study/baguio/help-english-longlong-campus': {
    title: 'HELP English（Longlong Campus） | 碧瑶Sparta课程费用住宿',
    description:
      'HELP English Longlong Campus页面，整理HELP Baguio Longlong校区、Sparta学习制度、ESL、IELTS/TOEIC、Business、Family课程、4周USD课程住宿费、Baguio当地费用和当前开放状态确认提醒。',
    keywords:
      'HELP English Longlong Campus, HELP Baguio, HELP Longlong, 菲律宾碧瑶HELP English语言学校, 碧瑶Sparta学校, 菲律宾IELTS学校, HELP English费用',
    image: '/assets/philippines/baguio-study-hero.jpg',
  },
  '/philippines-study/clark': {
    title: '克拉克菲律宾留学与英语游学 | 克拉克语言学校推荐',
    description:
      '克拉克菲律宾留学和英语游学指南，比较 CIP、菲律宾克拉克EG语言学校、菲律宾克拉克WE Academy语言学校、菲律宾克拉克HELP English语言学校、菲律宾克拉克AELC语言学校等学校，适合亲子、外师比例、Sparta考试路线和舒适生活需求。',
    keywords: '克拉克留学, 克拉克游学, 克拉克语言学校, 菲律宾亲子游学, CIP English, 菲律宾克拉克EG语言学校, 菲律宾克拉克WE Academy语言学校, 菲律宾克拉克HELP English语言学校, 菲律宾克拉克AELC语言学校, EG Academy, WE Academy Clark, HELP Clark, AELC',
    image: '/assets/philippines/clark-study-hero.jpg',
  },
  '/philippines-study/clark/cip-english-kepos': {
    title: '菲律宾克拉克 CIP语言学校 | Native一对一课程费用住宿与报名咨询',
    description:
      '菲律宾克拉克 CIP语言学校页面，整理CIP English Kepos的Native speaker一对一、ESL、IELTS、TOEIC、Business、亲子青少年课程、2026人民币课程住宿费用和报名注意事项。',
    keywords: '菲律宾克拉克 CIP语言学校, CIP English Kepos, 克拉克CIP, Clark CIP, 菲律宾外教一对一, 克拉克语言学校',
    image: '/assets/philippines/cip-campus-intro.jpg',
  },
  '/philippines-study/clark/eg-academy': {
    title: '菲律宾克拉克EG语言学校 | 课程费用住宿与报名咨询',
    description:
      '菲律宾克拉克EG语言学校页面，整理EG Academy的ESL、Native、IELTS、TOEIC、TOEFL、Business、Golf + ESL、Junior与Guardian课程、2025年USD课程住宿费和PHP到校费用。',
    keywords: '菲律宾克拉克EG语言学校, EG Academy, Education Group Granma, 克拉克EG, Clark EG, Golf ESL, 菲律宾亲子游学',
    image: '/assets/philippines/eg-facility-001.jpg',
  },
  '/philippines-study/clark/clark-we-academy': {
    title: '菲律宾克拉克WE Academy语言学校 | 亲子Native Mix与活动费用咨询',
    description:
      '菲律宾克拉克WE Academy语言学校页面，整理Clark WE Academy的ESL、Native Mix、Junior ESL、Junior Native、Guardian ESL、WE Kindergarten、solo junior high support、Golf、Swimming、校内宿舍和公开PHP活动费用说明。',
    keywords: '菲律宾克拉克WE Academy语言学校, Clark WE Academy, WE Academy Clark, WE English Clark, 克拉克亲子游学, Native Mix, WE Kindergarten, Clark golf English',
    image: '/assets/philippines/we-hero.jpg',
  },
  '/philippines-study/clark/help-english-clark': {
    title: '菲律宾克拉克HELP English语言学校 | Sparta课程费用住宿与报名咨询',
    description:
      '菲律宾克拉克HELP English语言学校页面，整理HELP Clark Campus的Sparta管理、EOP、ESL、IELTS、TOEIC、Business、Family课程、宿舍、4周USD课程住宿费用、PHP当地费用和报名注意事项。',
    keywords: '菲律宾克拉克HELP English语言学校, HELP Clark Campus, HELP English Academy, Clark Sparta school, 菲律宾IELTS学校, 克拉克语言学校',
    image: '/assets/philippines/help-clark-main-building.jpg',
  },
  '/philippines-study/clark/aelc-native-focused-clark-schools': {
    title: '菲律宾克拉克AELC语言学校 | Native口语课程费用住宿与报名咨询',
    description:
      '菲律宾克拉克AELC语言学校页面，整理American English Learning Center的Native口语、ESL、TOEIC、IELTS、Business、Family方向、AELC照片、4周USD课程住宿参考费用和报名注意事项。',
    keywords: '菲律宾克拉克AELC语言学校, AELC, American English Learning Center, Clark AELC, 菲律宾外教口语学校, 克拉克语言学校, Native English Clark',
    image: '/assets/philippines/aelc-main.jpg',
  },
  '/philippines-study/clark/hana-academy': {
    title: '菲律宾克拉克HANA Academy | Native亲子Golf课程费用住宿',
    description:
      '菲律宾克拉克HANA Academy页面，整理HANA Academy的Light ESL、General ESL、Native ESL、IELTS、TOEIC、Junior、Kindergarten、Golf、Senior课程、住宿房型、4周USD课程住宿费和PHP当地费用。',
    keywords:
      '菲律宾克拉克HANA Academy, HANA Academy Clark, Clark HANA, HARA AND HANAH INTERNATIONAL ACADEMY, 克拉克亲子游学, 菲律宾Native口语学校, Clark Golf English',
    image: '/assets/philippines/clark-study-hero.jpg',
  },
  '/philippines-study/manila': {
    title: '马尼拉菲律宾留学与英语游学 | 马尼拉语言学校推荐',
    description:
      '马尼拉菲律宾留学和英语游学指南，整理菲律宾马尼拉Enderun语言学校、菲律宾马尼拉American-English-Skill语言学校、菲律宾马尼拉Berlitz语言学校、菲律宾马尼拉Business College学校、马尼拉语言学校、商务英语、城市生活、课程选择和咨询规划重点。',
    keywords: '马尼拉留学, 马尼拉游学, 马尼拉语言学校, 菲律宾马尼拉Enderun语言学校, 菲律宾马尼拉American-English-Skill语言学校, 菲律宾马尼拉Berlitz语言学校, 菲律宾马尼拉Business College学校, 菲律宾商务英语, Enderun Extension, American English Skills Development Center, Berlitz Philippines, Manila Business College',
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
    image: '/assets/philippines/mbc-about.jpg',
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
      '巴科洛德菲律宾留学和英语游学指南，适合关注生活成本、安静学习环境、长期英语提升和E-Room Language Center的学生。',
    keywords: '巴科洛德留学, 巴科洛德游学, Bacolod语言学校, 菲律宾低预算游学, E-Room Language Center',
    image: '/assets/philippines/baguio-study-hero.jpg',
  },
  '/philippines-study/bacolod/e-room-language-center': {
    title: '菲律宾巴科洛德E-Room Language Center | 2024年USD课程住宿费用',
    description:
      '菲律宾巴科洛德E-Room Language Center页面，整理2024年ESL/青少年、IELTS/TOEIC/商务英语、监护人、幼儿园课程、USD课程住宿费、PHP当地费用和报名注意事项。',
    keywords:
      '菲律宾巴科洛德E-Room Language Center, E-Room Bacolod, EROOM, 巴科洛德语言学校, 菲律宾ESL学校, 菲律宾低预算游学, Bacolod English school',
    image: '/assets/philippines/baguio-study-hero.jpg',
  },
  '/philippines-study/iloilo': {
    title: '伊洛伊洛菲律宾留学与英语游学 | Iloilo语言学校',
    description:
      '伊洛伊洛菲律宾留学和英语游学城市指南，帮助学生了解安全环境、学习氛围、生活成本、PIA、WE Academy、GITC和MK Language Training Center等课程选择。',
    keywords: '伊洛伊洛留学, 伊洛伊洛游学, Iloilo语言学校, 菲律宾英语游学, PIA Iloilo, WE Academy Iloilo, MK Language Training Center, GITC Iloilo',
    image: '/assets/philippines/baguio-study-hero.jpg',
  },
  '/philippines-study/iloilo/polyglot-international-academy': {
    title: '菲律宾伊洛伊洛PIA语言学校 | ESL考试口语与2024费用',
    description:
      '菲律宾伊洛伊洛PIA语言学校页面，整理Polyglot International Academy的ESL、考试、Power Speaking、青少年和监护人课程，以及2024年4周USD课程、校外合作酒店住宿和注册费用。',
    keywords:
      '菲律宾伊洛伊洛PIA语言学校, Polyglot International Academy, PIA Iloilo, 伊洛伊洛语言学校, 怡朗PIA, 菲律宾ESL学校, Power Speaking',
    image: '/assets/philippines/baguio-study-hero.jpg',
  },
  '/philippines-study/iloilo/mk-language-training-center': {
    title: '菲律宾伊洛伊洛MK Language Training Center | ESL雅思亲子课程费用',
    description:
      '菲律宾伊洛伊洛MK Language Training Center页面，整理MK Iloilo的ESL Basic至Intensive、IELTS、TESOL、Business、Working Holiday、Junior、Internship课程、短期与4周USD课程住宿费、PHP当地费用和报名注意事项。',
    keywords:
      '菲律宾伊洛伊洛MK Language Training Center, MK Iloilo, MK Education Iloilo, 伊洛伊洛语言学校, 菲律宾ESL学校, 菲律宾亲子游学, 菲律宾IELTS学校',
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
    if (path.startsWith('/philippines-study/cebu/cia-cebu-international-academy/student-reviews/')) {
      return {
        title: 'CIA学生反馈 | 宿务英语游学真实体验',
        description: '阅读CIA学生在课堂适应、口语提升、宿务生活与文化体验方面的中文反馈整理。',
        keywords: 'CIA学生反馈, 宿务游学体验, 菲律宾英语学习体验, CIA语言学校',
        image: '/assets/cia/student-reviews/review-city-night.png',
      };
    }

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

    if (path.startsWith('/philippines-study/iloilo/')) {
      return {
        title: '伊洛伊洛菲律宾语言学校详情 | ESL课程费用住宿咨询',
        description: '查看伊洛伊洛菲律宾语言学校详情，了解ESL、考试课程、住宿费用、校园管理和适合人群。',
        keywords: '伊洛伊洛语言学校详情, Iloilo英语学校, 菲律宾ESL学校, 菲律宾英语游学',
        image: '/assets/philippines/baguio-study-hero.jpg',
      };
    }

    if (path.startsWith('/philippines-study/bacolod/')) {
      return {
        title: '巴科洛德菲律宾语言学校详情 | 低预算ESL课程咨询',
        description: '查看巴科洛德菲律宾语言学校详情，了解ESL、考试课程、住宿费用、校园管理和适合人群。',
        keywords: '巴科洛德语言学校详情, Bacolod英语学校, 菲律宾低预算ESL学校, 菲律宾英语游学',
        image: '/assets/philippines/baguio-study-hero.jpg',
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

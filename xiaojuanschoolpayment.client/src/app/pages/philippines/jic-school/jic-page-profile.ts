// JIC content for the shared Philippine school page (school-page/ph-school-page.component.*), one profile per campus.
// Text and data come from jic-page-content.ts; prices and rules from jic-content-config.ts.
// Keep it pure data (no Angular, DOM or storage), like the modules it reads.
import { createCiaQuotePricing } from '../cia-school/cia-quote-engine';
import {
  CIA_CTA_CONSULTANTS,
  CIA_GALLERY_CATEGORIES,
  CIA_PAGE_COPY,
  CIA_SIDA_REASONS,
  CIA_SIDA_TRUST_BADGES,
  type RoomRateGroup,
} from '../cia-school/cia-page-content';
import type { CiaContentConfig } from '../cia-school/cia-content-config';
import type { PhPageCopy, PhSchoolProfile, PhVideoItem, PhVideoTab } from '../school-page/ph-school-profile';
import { createDefaultJicContentConfig, jicCampusContent } from './jic-content-config';
import {
  JIC_HOLIDAYS_2027,
  JIC_MONTHLY_TESTS_2027,
  JIC_PAGE_CONTENT,
  JIC_REFERENCE_NOTE,
  JIC_TERM_STARTS_2027,
  jicPracticalGuides,
} from './jic-page-content';
import type { JicCampus } from './jic-pricing';

/** Database school name; both campuses share one school record and one content document. */
export const JIC_SCHOOL_NAME = '菲律宾碧瑶JIC语言学校';

function jicCopy(campus: JicCampus): PhPageCopy {
  const page = JIC_PAGE_CONTENT[campus];
  const challenger = campus === 'challenger';
  const brand = (text: string) => text.replace(/CIA/g, page.shortName);
  return {
    swipeHint: CIA_PAGE_COPY.swipeHint,
    referenceNote: JIC_REFERENCE_NOTE,
    hero: {
      breadcrumb: page.breadcrumb,
      title: page.title,
      lead: page.heroLead,
      tags: page.heroTags.map(tag => ({ ...tag })),
      quoteLabel: '获取 JIC 最新报价',
    },
    overview: { title: page.overviewTitle },
    advisorReview: {
      title: `顾问怎么看 ${page.shortName}`,
      text: page.advisorText,
      suitableTitle: '适合谁',
      notSuitableTitle: '报名前想清楚',
    },
    campus: {
      eyebrow: 'CAMPUS AT A GLANCE',
      title: `${page.shortName} 校园介绍`,
      intro: page.campusIntro,
    },
    gallery: {
      title: `按区域查看 ${page.shortName} 环境`,
      intro: '相册内用左右箭头或缩略图切换，点击主图可放大。',
      photoNote: CIA_PAGE_COPY.gallery.photoNote,
      roomComparisonTitle: '房型对比',
      roomDisclaimer: JIC_REFERENCE_NOTE,
    },
    courses: {
      title: `${page.shortName} 课程怎么选？`,
      intro: page.coursesIntro,
      priceUnit: '/4周',
      fitLabel: '适合人群',
      noteLabel: '课程说明',
      detailSummaryTitle: '查看课程细节',
      detailSummaryHint: challenger ? '雅思保分班条件、教材分级、付费特别课' : '口语、主题英语、商务和银发课程说明',
      guideTitle: '报名前值得确认的课程细节',
    },
    ...(challenger ? {
      studyModes: {
        title: '斯巴达还是半斯巴达？',
        intro: '入学第一天自己选，斯巴达不另收费；之后每两周可以在规定时间内申请更换。',
        note: '违反斯巴达规定会按校规扣分或处罚。',
      },
    } : {}),
    schedule: {
      eyebrow: 'DAILY TIMETABLE',
      title: `${page.shortName} 每日作息`,
      intro: page.scheduleIntro,
      badge: page.scheduleBadge,
      note: '周六周日只有早午餐（09:00–12:00，自助）。',
    },
    planning: {
      summaryTitle: '2027年校历与旺季',
      summaryHint: '开学日、公众假期、月考和旺季附加费',
    },
    calendar: {
      eyebrow: 'ACADEMIC CALENDAR',
      title: 'JIC 2027年校历',
      intro: `JIC每两周的周日开学，2027年开学日：${JIC_TERM_STARTS_2027}。下表是菲律宾公众假期，当天不上课。`,
      peakEyebrow: '2027 PEAK SEASON',
      peakTitle: '2027年暑期旺季',
      peakIntro: '课程或住宿计划覆盖以下学习周时，每名学生按实际重叠周数计收旺季附加费。',
      peakNote: 'JIC是BESA会员学校；课程与住宿在同一周重叠只计一次，旺季附加费不参与任何优惠，旺季周也不计入淡季优惠。',
      footnote: `月考（当天不上课）：${JIC_MONTHLY_TESTS_2027}。政府可能临时增加或调整假期，以JIC当期通知为准。`,
    },
    videos: {
      eyebrow: 'SCHOOL VIDEOS',
      title: `用视频了解 ${page.shortName}`,
      intro: '学校官方介绍片和房型实拍。',
      badge: `${page.shortName} 视频`,
    },
    rooms: {
      photoTitle: '房型实景',
      photoIntro: '点选房型查看实景和视频；各房型价格见上方住宿费表。',
      rulesTitle: '短期费率与入住离校',
      rulesHint: '1–3周住宿费比例、入住离校时间、提前入住和延后退房',
    },
    quote: {
      ...CIA_PAGE_COPY.quote,
      compareShortcuts: [
        { focus: 'room', label: '比房型', hint: page.compareRoomHint },
        { focus: 'course', label: '比同类课程', hint: page.compareCourseHint },
        { focus: 'weeks', label: '比周数', hint: '如4周、8周、12周' },
      ],
    },
    fees: CIA_PAGE_COPY.fees,
    practicalGuide: {
      summaryTitle: '到校须知与校规',
      summaryHint: '第一天安排、接机与回程、用餐时间、2026年12月放假补课、校规要点',
      intro: '出发前和到校后最常问到的安排。',
    },
    sida: {
      ...CIA_PAGE_COPY.sida,
      title: brand(CIA_PAGE_COPY.sida.title),
      photoAlt: brand(CIA_PAGE_COPY.sida.photoAlt),
      photoCaption: brand(CIA_PAGE_COPY.sida.photoCaption),
    },
    faq: CIA_PAGE_COPY.faq,
    finalCta: {
      title: page.finalCtaTitle,
      text: page.finalCtaText,
      primaryLabel: `获取 ${page.shortName} 完整报价单`,
      secondaryLabel: '咨询当前空房',
    },
  };
}

/** The campus's own part of the shared JIC document, filled up to the current schema. */
export function jicCampusDefaults(campus: JicCampus): CiaContentConfig {
  return jicCampusContent(createDefaultJicContentConfig(), campus);
}

export function jicPageProfile(campus: JicCampus): PhSchoolProfile {
  const page = JIC_PAGE_CONTENT[campus];
  const defaultContent = () => jicCampusDefaults(campus);
  const defaults = defaultContent();
  const initialPricing = createCiaQuotePricing(defaults);
  const initialRoomRateGroups: RoomRateGroup[] = [...new Set(defaults.rooms.map(room => room.group))].map(title => ({
    title,
    rooms: defaults.rooms
      .filter(room => room.enabled && room.group === title)
      .map(room => ({ id: room.id, label: room.label, code: room.code, location: room.location })),
  }));
  const videoTabs: PhVideoTab[] = page.videoTabs.map(tab => ({
    label: tab.label,
    icon: 'videocam',
    items: tab.videos.map(name => page.videos[name]),
  }));
  const roomVideos: Record<string, PhVideoItem> = Object.fromEntries(
    Object.entries(page.roomVideos).map(([roomId, name]) => [roomId, page.videos[name]]),
  );

  return {
    code: defaults.schoolCode,
    name: page.shortName,
    previewPrefix: 'jic',
    pricingSchoolName: JIC_SCHOOL_NAME,
    copy: jicCopy(campus),
    compactLayout: true,
    overviewFacts: page.overviewFacts,
    videoTabs,
    courseHighlights: page.courseHighlights,
    roomVideos,
    gallery: {
      categories: CIA_GALLERY_CATEGORIES,
      albumCategories: ['校园', '教室', '住宿', '餐厅', '设施'],
      images: page.galleryImages.map(image => ({ ...image })),
      heroCategories: page.heroCategories,
      albumDescriptions: page.albumDescriptions,
      uploadedPhotoTitle: `${page.shortName} 学校媒体`,
      uploadedPhotoDescription: `${page.shortName} 学校实景内容`,
      uploadedVideoTitle: `${page.shortName} 学校视频`,
    },
    snapshotCards: page.quickInfo,
    basicInfo: page.basicInfo,
    suitableFor: page.suitableFor.map(title => ({ title, text: '' })),
    notSuitableFor: page.notSuitableFor.map(title => ({ title, text: '' })),
    campusBuildings: page.campusBuildings,
    videoCards: [],
    campusLifeVideos: [],
    interviewVideos: [],
    courseGroups: page.courseGroups,
    studyModes: page.studyModes,
    courseDetailGuides: page.courseDetailGuides,
    scheduleColumns: page.scheduleColumns,
    initialCourseFees: initialPricing.courseFees,
    initialRoomFees: initialPricing.roomFees,
    initialRoomRateGroups,
    showRoomCodes: false,
    dormRules: [],
    roomProfiles: page.roomProfiles,
    ieltsResults: [],
    studentReviews: [],
    reviewPath: '',
    holidayCalendars: [JIC_HOLIDAYS_2027],
    ieltsComputerExamDates2027: [],
    studentCareServices: [],
    campusPracticalGuides: jicPracticalGuides(campus),
    studentTracks: [],
    sidaReasons: CIA_SIDA_REASONS.map(reason => ({ ...reason, alt: reason.alt.replace(/CIA/g, page.shortName) })),
    sidaTrustBadges: CIA_SIDA_TRUST_BADGES,
    ctaBadges: ['2027年价格', '课程与住宿分开报价', '到校学杂费另列'],
    ctaConsultants: CIA_CTA_CONSULTANTS,
    mobileAnchors: [
      { label: '视频', target: 'gallery', icon: 'smart_display' },
      { label: '概览', target: 'overview', icon: 'dashboard' },
      { label: '课程', target: 'courses', icon: 'menu_book' },
      { label: '住宿', target: 'rooms', icon: 'bed' },
      { label: '报价', target: 'quote', icon: 'calculate' },
      { label: 'FAQ', target: 'faq', icon: 'help' },
    ],
    faqs: () => page.faqs.map(item => ({ ...item })),
    shows2026Prices: () => false,
    defaultContent,
    cloneContent: value => jicCampusContent(value, campus),
  };
}

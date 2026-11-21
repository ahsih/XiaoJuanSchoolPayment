// CELLA content for the shared Philippine school page (school-page/ph-school-page.component.*), one profile per campus.
// Text and data come from cella-page-content.ts; prices and rules from cella-content-config.ts.
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
import type { PhPageCopy, PhSchoolProfile, PhVideoItem, PhVideoTab } from '../school-page/ph-school-profile';
import { cloneCellaContentConfig, createDefaultCellaContentConfig } from './cella-content-config';
import { CELLA_PAGE_CONTENT, CELLA_REFERENCE_NOTE } from './cella-page-content';
import { isCellaFamilyPackage } from './cella-page-quote';
import type { CellaCampus } from './cella-pricing';

/** Database school names per campus, the current one first. */
export const CELLA_SCHOOL_NAMES: Record<CellaCampus, readonly string[]> = {
  uni: ['菲律宾宿务CELLA Uni Sparta Campus', 'CELLA Uni Sparta Campus', 'CELLA Uni'],
  premium: ['菲律宾宿务CELLA Premium Campus', 'CELLA Premium Campus', 'CELLA Premium'],
};

const COMPARE_HINTS: Record<CellaCampus, string> = {
  uni: '如校内四人间、双人间和 JDN 校外宿舍',
  premium: '如六人间、四人间和 STACIA HOTEL',
};

function cellaCopy(campus: CellaCampus): PhPageCopy {
  const page = CELLA_PAGE_CONTENT[campus];
  const brand = (text: string) => text.replace(/CIA/g, page.shortName);
  return {
    swipeHint: CIA_PAGE_COPY.swipeHint,
    referenceNote: CELLA_REFERENCE_NOTE,
    hero: {
      breadcrumb: page.breadcrumb,
      title: page.title,
      lead: page.heroLead,
      tags: page.heroTags.map(tag => ({ ...tag })),
      // “获取 CELLA Premium 最新报价” is cut off on a 375px phone.
      quoteLabel: '获取 CELLA 最新报价',
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
      intro: page.galleryIntro,
      photoNote: CIA_PAGE_COPY.gallery.photoNote,
      roomComparisonTitle: '房型对比',
      roomDisclaimer: CELLA_REFERENCE_NOTE,
    },
    courses: {
      title: `${page.shortName} 课程怎么选？`,
      intro: page.coursesIntro,
      priceUnit: '/4周',
      fitLabel: '适合人群',
      noteLabel: '课程说明',
      detailSummaryTitle: '查看课程细节',
      detailSummaryHint: campus === 'uni' ? '雅思保证班和TESOL的开课要求' : 'ACE空乘英语的培训和实习安排',
      guideTitle: '报名前值得确认的课程细节',
    },
    planning: {
      summaryTitle: '2027年暑期旺季',
      summaryHint: '旺季附加费档期与收费方式',
    },
    calendar: {
      eyebrow: 'PEAK SEASON',
      title: `${page.shortName} 2027年旺季附加费`,
      intro: 'CELLA是CALA会员学校，2027年暑期旺季按协会规定每周加收附加费；学校假期以CELLA当期通知为准。',
      peakEyebrow: '2027 PEAK SEASON',
      peakTitle: '2027年暑期旺季',
      peakIntro: '课程或住宿计划覆盖以下学习周时，每名学生按实际重叠周数计收旺季附加费。',
      peakNote: '入学按周日、离校按周六；课程与住宿在同一周重叠只计一次，旺季附加费不参与任何优惠。',
    },
    videos: {
      eyebrow: 'SCHOOL VIDEOS',
      title: `用视频了解 ${page.shortName}`,
      intro: '校园导览和房型实拍。',
      badge: `${page.shortName} 视频`,
    },
    rooms: {
      photoTitle: '房型实景',
      photoIntro: page.roomsPhotoIntro,
      rulesTitle: '短期费率与入住离校',
      rulesHint: '1–3周住宿费比例、入住离校时间',
    },
    quote: {
      ...CIA_PAGE_COPY.quote,
      compareShortcuts: [
        { focus: 'room', label: '比房型', hint: COMPARE_HINTS[campus] },
        { focus: 'course', label: '比同类课程', hint: page.compareShortcutCourseHint },
        { focus: 'weeks', label: '比周数', hint: '如4周、8周、12周' },
      ],
    },
    fees: CIA_PAGE_COPY.fees,
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

/** The page's course list: the content document's courses without the family packages (2027 prices pending). */
function withoutFamilyPackages<T extends { id: string }>(items: T[]): T[] {
  return items.filter(item => !isCellaFamilyPackage(item.id));
}

export function cellaPageProfile(campus: CellaCampus): PhSchoolProfile {
  const page = CELLA_PAGE_CONTENT[campus];
  const defaultContent = () => createDefaultCellaContentConfig(campus);
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
    previewPrefix: campus === 'uni' ? 'cella-uni' : 'cella-premium',
    pricingSchoolName: CELLA_SCHOOL_NAMES[campus][0],
    copy: cellaCopy(campus),
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
    studyModes: [],
    courseDetailGuides: page.courseDetailGuides,
    scheduleColumns: [],
    initialCourseFees: withoutFamilyPackages(initialPricing.courseFees),
    initialRoomFees: initialPricing.roomFees,
    initialRoomRateGroups,
    showRoomCodes: false,
    dormRules: [],
    roomProfiles: page.roomProfiles,
    ieltsResults: [],
    studentReviews: [],
    reviewPath: '',
    holidayCalendars: [],
    ieltsComputerExamDates2027: [],
    studentCareServices: [],
    campusPracticalGuides: [],
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
    cloneContent: value => cloneCellaContentConfig(value, campus),
  };
}

export { withoutFamilyPackages as cellaWithoutFamilyPackages };

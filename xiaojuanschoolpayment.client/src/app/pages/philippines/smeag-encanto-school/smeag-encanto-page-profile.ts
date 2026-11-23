// SMEAG Encanto's content for the shared Philippine school page (school-page/ph-school-page.component.*).
// Text and data come from smeag-encanto-page-content.ts; prices and rules from smeag-encanto-content-config.ts.
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
import type { PhPageCopy, PhSchoolProfile, PhVideoTab } from '../school-page/ph-school-profile';
import {
  cloneEncantoContentConfig,
  createDefaultEncantoContentConfig,
  ENCANTO_ADULT_ROOM_GROUP,
  ENCANTO_FAMILY_ROOM_ID,
} from './smeag-encanto-content-config';
import {
  ENCANTO_DORM_RULES,
  ENCANTO_HOLIDAY_CALENDARS,
  ENCANTO_PAGE,
  ENCANTO_PRACTICAL_GUIDES,
  ENCANTO_REFERENCE_NOTE,
  ENCANTO_SCHEDULE_COLUMNS,
} from './smeag-encanto-page-content';
import { ENCANTO_SCHOOL_NAME } from './smeag-encanto-pricing';

const NAME = ENCANTO_PAGE.shortName;
const brand = (text: string) => text.replace(/CIA/g, NAME);

const ENCANTO_COPY: PhPageCopy = {
  swipeHint: CIA_PAGE_COPY.swipeHint,
  referenceNote: ENCANTO_REFERENCE_NOTE,
  hero: {
    breadcrumb: ENCANTO_PAGE.breadcrumb,
    title: ENCANTO_PAGE.title,
    lead: ENCANTO_PAGE.heroLead,
    tags: ENCANTO_PAGE.heroTags.map(tag => ({ ...tag })),
    quoteLabel: '获取 Encanto 最新报价',
  },
  overview: { title: ENCANTO_PAGE.overviewTitle },
  advisorReview: {
    title: `顾问怎么看 ${NAME}`,
    text: ENCANTO_PAGE.advisorText,
    suitableTitle: '适合谁',
    notSuitableTitle: '报名前想清楚',
  },
  gallery: {
    title: `按区域查看 ${NAME} 环境`,
    intro: ENCANTO_PAGE.galleryIntro,
    photoNote: CIA_PAGE_COPY.gallery.photoNote,
    roomComparisonTitle: '房型对比',
    roomDisclaimer: ENCANTO_REFERENCE_NOTE,
  },
  courses: {
    title: `${NAME} 课程怎么选？`,
    intro: ENCANTO_PAGE.coursesIntro,
    priceUnit: '/4周',
    // The family courses show their Family Camp price in the list and this off-season price inside.
    oldPriceLabel: '淡季整家价（3–6月、9–12月）',
    fitLabel: '适合人群',
    noteLabel: '课程说明',
    detailSummaryTitle: '查看课程细节',
    detailSummaryHint: '亲子营包含什么、淡季亲子和成人ESL的安排',
    guideTitle: '报名前值得确认的课程细节',
  },
  schedule: {
    eyebrow: 'DAILY TIMETABLE',
    title: `${NAME} 每日作息`,
    intro: '周一至周五上课，每45分钟休息5分钟。课程顺序仅供参考，以学校课表为准。',
    badge: '孩子、家长、幼儿园和成人分开看',
  },
  planning: {
    summaryTitle: '2027年假期',
    summaryHint: '只有元旦全天停课，其他假日有特别课程',
  },
  calendar: {
    eyebrow: 'ACADEMIC CALENDAR',
    title: `${NAME} 2027年假期`,
    intro: '寒暑假亲子营：2027/01/03–02/27、06/27–08/28；淡季：3–6月、9–12月。Encanto 2027年只有元旦全天停课，其他列出的假日上午09:00–12:00、下午13:00–16:00有假日特别课程（Best Holiday Classes），自愿免费参加。',
    footnote: '政府可能临时增加或调整假期，以学校当期通知为准。',
    peakEyebrow: '',
    peakTitle: '',
    peakIntro: '',
    peakNote: '',
  },
  videos: {
    eyebrow: 'SCHOOL VIDEOS',
    title: `用视频了解 ${NAME}`,
    intro: '校园导览、教室和课程、设施和海景房。',
    badge: `${NAME} 视频`,
  },
  rooms: {
    photoTitle: '房型实景',
    photoIntro: ENCANTO_PAGE.roomsPhotoIntro,
    pickHint: '点三人间，看实拍照片和介绍',
    rulesTitle: '短期费率、入住离校与宿舍规定',
    rulesHint: '1–3周住宿费比例、入住离校、额外住宿、宿舍规定',
    dormRulesTitle: '宿舍与校内规定',
  },
  quote: {
    ...CIA_PAGE_COPY.quote,
    compareShortcuts: [
      { focus: 'room', label: '比房型', hint: '单人间、双人间和三人间' },
      { focus: 'course', label: '比同类课程', hint: ENCANTO_PAGE.compareShortcutCourseHint },
      { focus: 'weeks', label: '比周数', hint: '如4周、8周、12周' },
    ],
  },
  fees: CIA_PAGE_COPY.fees,
  practicalGuide: {
    summaryTitle: '到校须知与校内生活',
    summaryHint: '第一天安排、用餐与E-money卡、设施开放时间、离校、周末出行',
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
    title: ENCANTO_PAGE.finalCtaTitle,
    text: ENCANTO_PAGE.finalCtaText,
    primaryLabel: `获取 ${NAME} 完整报价单`,
    secondaryLabel: '咨询当前空房',
  },
};

/** The room price list shows the adult rooms; the family room has no price of its own. */
export function encantoRoomRateGroups(rooms: ReadonlyArray<{ id: string; label: string; code: string; location: string; group: string; enabled: boolean }>): RoomRateGroup[] {
  const shown = rooms.filter(room => room.enabled && room.id !== ENCANTO_FAMILY_ROOM_ID);
  return [...new Set(shown.map(room => room.group))].map(title => ({
    title,
    rooms: shown
      .filter(room => room.group === title)
      .map(room => ({ id: room.id, label: room.label, code: room.code, location: room.location as '校内' | '校外' })),
  }));
}

export function encantoPageProfile(): PhSchoolProfile {
  const defaultContent = createDefaultEncantoContentConfig;
  const defaults = defaultContent();
  const initialPricing = createCiaQuotePricing(defaults);
  const videoTabs: PhVideoTab[] = ENCANTO_PAGE.videoTabs.map(tab => ({
    label: tab.label,
    icon: 'videocam',
    items: tab.videos.map(name => ENCANTO_PAGE.videos[name as keyof typeof ENCANTO_PAGE.videos]),
  }));

  return {
    code: defaults.schoolCode,
    name: NAME,
    previewPrefix: 'smeag-encanto',
    pricingSchoolName: ENCANTO_SCHOOL_NAME,
    copy: ENCANTO_COPY,
    compactLayout: true,
    overviewFacts: ENCANTO_PAGE.overviewFacts,
    videoTabs,
    courseHighlights: ENCANTO_PAGE.courseHighlights,
    gallery: {
      categories: CIA_GALLERY_CATEGORIES,
      albumCategories: ['校园', '教室', '住宿', '餐厅', '设施'],
      images: ENCANTO_PAGE.galleryImages.map(image => ({ ...image })),
      heroCategories: ENCANTO_PAGE.heroCategories,
      albumDescriptions: ENCANTO_PAGE.albumDescriptions,
      uploadedPhotoTitle: `${NAME} 学校媒体`,
      uploadedPhotoDescription: `${NAME} 学校实景内容`,
      uploadedVideoTitle: `${NAME} 学校视频`,
    },
    snapshotCards: ENCANTO_PAGE.quickInfo,
    basicInfo: ENCANTO_PAGE.basicInfo,
    suitableFor: ENCANTO_PAGE.suitableFor.map(title => ({ title, text: '' })),
    notSuitableFor: ENCANTO_PAGE.notSuitableFor.map(title => ({ title, text: '' })),
    campusBuildings: ENCANTO_PAGE.campusBuildings,
    videoCards: [],
    campusLifeVideos: [],
    interviewVideos: [],
    courseGroups: ENCANTO_PAGE.courseGroups,
    studyModes: [],
    courseDetailGuides: ENCANTO_PAGE.courseDetailGuides,
    scheduleColumns: ENCANTO_SCHEDULE_COLUMNS,
    initialCourseFees: initialPricing.courseFees,
    initialRoomFees: initialPricing.roomFees,
    initialRoomRateGroups: encantoRoomRateGroups(defaults.rooms),
    roomGroupNotes: {
      [ENCANTO_ADULT_ROOM_GROUP]: '另收度假村设施费：单人间100、双人间75、三人间50美元／周，不打折。亲子课程的家庭房已含在整家价格里。',
    },
    showRoomCodes: false,
    dormRules: ENCANTO_DORM_RULES,
    roomProfiles: ENCANTO_PAGE.roomProfiles,
    ieltsResults: [],
    studentReviews: [],
    reviewPath: '',
    holidayCalendars: ENCANTO_HOLIDAY_CALENDARS,
    ieltsComputerExamDates2027: [],
    studentCareServices: [],
    campusPracticalGuides: ENCANTO_PRACTICAL_GUIDES,
    studentTracks: [],
    sidaReasons: CIA_SIDA_REASONS.map(reason => ({ ...reason, alt: brand(reason.alt) })),
    sidaTrustBadges: CIA_SIDA_TRUST_BADGES,
    ctaBadges: ['2027年价格', '亲子整家报价', '到校学杂费另列'],
    ctaConsultants: CIA_CTA_CONSULTANTS,
    mobileAnchors: [
      { label: '视频', target: 'gallery', icon: 'smart_display' },
      { label: '概览', target: 'overview', icon: 'dashboard' },
      { label: '课程', target: 'courses', icon: 'menu_book' },
      { label: '住宿', target: 'rooms', icon: 'bed' },
      { label: '报价', target: 'quote', icon: 'calculate' },
      { label: 'FAQ', target: 'faq', icon: 'help' },
    ],
    faqs: () => ENCANTO_PAGE.faqs.map(item => ({ ...item })),
    shows2026Prices: () => false,
    defaultContent,
    cloneContent: cloneEncantoContentConfig,
  };
}

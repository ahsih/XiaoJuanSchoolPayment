// Winning content for the shared Philippine school page (school-page/ph-school-page.component.*), one profile per
// campus. Text and data come from winning-page-content.ts; prices and rules from winning-content-config.ts.
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
import type { PhPageCopy, PhSchoolProfile } from '../school-page/ph-school-profile';
import { createDefaultWinningContentConfig, winningCampusContent } from './winning-content-config';
import {
  WINNING_ALBUM_DESCRIPTIONS,
  WINNING_FINAL_CTA_BADGES,
  WINNING_HOLIDAYS_2027,
  WINNING_PAGE_CONTENT,
  WINNING_REFERENCE_NOTE,
} from './winning-page-content';
import type { WinningCampus } from './winning-pricing';

/** Database school name; both campuses share one school record and one content document. */
export const WINNING_SCHOOL_NAME = '菲律宾宿务Winning English Academy';

function winningCopy(campus: WinningCampus): PhPageCopy {
  const page = WINNING_PAGE_CONTENT[campus];
  const brand = (text: string) => text.replace(/CIA/g, page.shortName);
  return {
    swipeHint: CIA_PAGE_COPY.swipeHint,
    referenceNote: WINNING_REFERENCE_NOTE,
    hero: {
      breadcrumb: page.breadcrumb,
      title: page.title,
      lead: page.heroLead,
      tags: page.heroTags.map(tag => ({ ...tag })),
      quoteLabel: '获取 Winning 最新报价',
    },
    overview: { title: `30 秒看懂 ${page.shortName}` },
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
      roomDisclaimer: WINNING_REFERENCE_NOTE,
    },
    courses: {
      title: `${page.shortName} 课程怎么选？`,
      intro: page.coursesIntro,
      priceUnit: '/4周',
      fitLabel: '适合人群',
      noteLabel: '课程说明',
      detailSummaryTitle: '查看课程细节',
      detailSummaryHint: '分级测试、换课、加课和选修课',
      guideTitle: '报名前值得确认的课程细节',
    },
    schedule: {
      eyebrow: 'DAILY TIMETABLE',
      title: `${page.shortName} 每日课程表参考`,
      intro: '学校册子里的作息；实际课表按所选课程和分级安排，以学校实际安排为准。',
      badge: '周一至周五上课',
      note: '每节课50分钟。国定假日、天灾或停电取消的课不补课。',
    },
    planning: {
      summaryTitle: '2027年公众假期',
      summaryHint: '菲律宾公众假期当天不上课，规划入学日期时参考',
    },
    calendar: {
      eyebrow: 'ACADEMIC CALENDAR',
      title: 'Winning 2027年假期',
      intro: '下表是菲律宾政府公布的2027年平日公众假期；假期取消的课不补课，也不退费。',
      peakEyebrow: '2027 PEAK SEASON',
      peakTitle: '2027年暑假旺季',
      peakIntro: '2027/07/04–08/28在读的周每周加收60美元旺季附加费（宿务语言学校协会通知），课程和住宿重叠的周只算一次。',
      peakNote: '旺季房间紧张，请尽早确认空房。',
      provisionalLabel: '日期待官方确认',
      footnote: '开斋节、宰牲节日期待政府另行公布；政府可能临时增加或调整假期，以学校当期通知为准。',
    },
    videos: {
      eyebrow: 'SCHOOL VIDEOS',
      title: `用视频了解 ${page.shortName}`,
      intro: '学校的校园视频。',
      badge: `${page.shortName} 视频`,
    },
    rooms: {
      photoTitle: '房型实景',
      photoIntro: page.roomsPhotoIntro,
      rulesTitle: '短期费率、入住离校与住宿规定',
      rulesHint: '1–3周住宿费比例、入住离校时间、住宿规定',
      dormRulesTitle: '住宿与外出规定',
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
      summaryTitle: '到校须知与学校服务',
      summaryHint: '用餐、洗衣、开放时间、入学离校和接机',
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

/** The campus's own part of the shared Winning document, filled up to the current schema. */
export function winningCampusDefaults(campus: WinningCampus): CiaContentConfig {
  return winningCampusContent(createDefaultWinningContentConfig(), campus);
}

export function winningPageProfile(campus: WinningCampus): PhSchoolProfile {
  const page = WINNING_PAGE_CONTENT[campus];
  const defaultContent = () => winningCampusDefaults(campus);
  const defaults = defaultContent();
  const initialPricing = createCiaQuotePricing(defaults);
  const initialRoomRateGroups: RoomRateGroup[] = [...new Set(defaults.rooms.map(room => room.group))].map(title => ({
    title,
    rooms: defaults.rooms
      .filter(room => room.enabled && room.group === title)
      .map(room => ({ id: room.id, label: room.label, code: room.code, location: room.location })),
  }));

  return {
    code: defaults.schoolCode,
    name: page.shortName,
    previewPrefix: 'winning',
    pricingSchoolName: WINNING_SCHOOL_NAME,
    copy: winningCopy(campus),
    compactLayout: true,
    videoTabs: [],
    overviewFacts: page.overviewFacts,
    courseHighlights: page.courseHighlights,
    gallery: {
      categories: CIA_GALLERY_CATEGORIES,
      albumCategories: [...page.albumCategories],
      images: page.galleryImages.map(image => ({ ...image })),
      heroCategories: page.heroCategories,
      albumDescriptions: WINNING_ALBUM_DESCRIPTIONS[campus],
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
    scheduleColumns: page.scheduleColumns,
    initialCourseFees: initialPricing.courseFees,
    initialRoomFees: initialPricing.roomFees,
    initialRoomRateGroups,
    showRoomCodes: false,
    dormRules: page.dormRules,
    roomProfiles: page.roomProfiles,
    ieltsResults: [],
    studentReviews: [],
    reviewPath: '',
    holidayCalendars: [WINNING_HOLIDAYS_2027],
    ieltsComputerExamDates2027: [],
    studentCareServices: [],
    campusPracticalGuides: page.practicalGuides,
    studentTracks: [],
    sidaReasons: CIA_SIDA_REASONS.map(reason => ({ ...reason, alt: reason.alt.replace(/CIA/g, page.shortName) })),
    sidaTrustBadges: CIA_SIDA_TRUST_BADGES,
    ctaBadges: WINNING_FINAL_CTA_BADGES,
    ctaConsultants: CIA_CTA_CONSULTANTS,
    mobileAnchors: [
      { label: '环境', target: 'gallery', icon: 'image' },
      { label: '概览', target: 'overview', icon: 'dashboard' },
      { label: '课程', target: 'courses', icon: 'menu_book' },
      { label: '住宿', target: 'rooms', icon: 'bed' },
      { label: '报价', target: 'quote', icon: 'calculate' },
      { label: 'FAQ', target: 'faq', icon: 'help' },
    ],
    faqs: () => {
      const today = new Date();
      const pad = (value: number) => String(value).padStart(2, '0');
      const iso = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
      return page.faqs.filter(item => !item.until || iso < item.until).map(item => ({ ...item }));
    },
    shows2026Prices: () => false,
    defaultContent,
    cloneContent: value => winningCampusContent(value, campus),
  };
}

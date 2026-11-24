// English Fella content for the shared Philippine school page (school-page/ph-school-page.component.*), one profile
// per campus. Text and data come from fella-page-content.ts; prices and rules from fella-content-config.ts.
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
import type { PhPageCopy, PhSchoolProfile, PhVideoTab } from '../school-page/ph-school-profile';
import { createDefaultFellaContentConfig, fellaCampusContent } from './fella-content-config';
import {
  FELLA_ALBUM_DESCRIPTIONS,
  FELLA_FINAL_CTA_BADGES,
  FELLA_HOLIDAYS_2027,
  FELLA_PAGE_CONTENT,
  FELLA_REFERENCE_NOTE,
  FELLA_REFUND_COPY,
  FELLA_VIDEOS,
  fellaVideoPoster,
  fellaVideoSrc,
} from './fella-page-content';
import type { FellaCampus } from './fella-pricing';

/** Database school name; both campuses share one school record and one content document. */
export const FELLA_SCHOOL_NAME = '菲律宾宿务English Fella语言学校';

function fellaCopy(campus: FellaCampus): PhPageCopy {
  const page = FELLA_PAGE_CONTENT[campus];
  const brand = (text: string) => text.replace(/CIA/g, page.shortName);
  return {
    swipeHint: CIA_PAGE_COPY.swipeHint,
    referenceNote: FELLA_REFERENCE_NOTE,
    hero: {
      breadcrumb: page.breadcrumb,
      title: page.title,
      lead: page.heroLead,
      tags: page.heroTags.map(tag => ({ ...tag })),
      // “获取 English Fella 最新报价” is cut off on a 375px phone.
      quoteLabel: '获取 Fella 最新报价',
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
      roomDisclaimer: FELLA_REFERENCE_NOTE,
    },
    courses: {
      title: `${page.shortName} 课程怎么选？`,
      intro: page.coursesIntro,
      priceUnit: '/4周',
      fitLabel: '适合人群',
      noteLabel: '课程说明',
      detailSummaryTitle: '查看课程细节',
      detailSummaryHint: page.courseDetailHint,
      guideTitle: '报名前值得确认的课程细节',
    },
    studyModes: { title: page.studyModesTitle, intro: page.studyModesIntro, note: page.studyModesNote },
    schedule: {
      eyebrow: 'DAILY TIMETABLE',
      title: `${page.shortName} 每日作息`,
      intro: page.scheduleIntro,
      badge: page.scheduleBadge,
      ...(page.scheduleNote ? { note: page.scheduleNote } : {}),
    },
    planning: {
      summaryTitle: '2027年公众假期',
      summaryHint: '菲律宾公众假期当天不上课，规划入学日期时参考',
    },
    calendar: {
      eyebrow: 'ACADEMIC CALENDAR',
      title: 'English Fella 2027年假期',
      intro: '下表是2027年平日的菲律宾公众假期，当天不上课，不补课也不退费。English Fella没有旺季附加费。',
      peakEyebrow: '2027 PEAK SEASON',
      peakTitle: '2027年旺季',
      peakIntro: 'English Fella不收旺季附加费。',
      peakNote: '旺季房间紧张，请尽早确认空房。',
      provisionalLabel: '日期待官方确认',
      footnote: '开斋节、宰牲节日期待官方确认；政府可能临时增加或调整假期，以学校当期通知为准。',
    },
    videos: {
      eyebrow: 'SCHOOL VIDEOS',
      title: `用视频了解 ${page.shortName}`,
      intro: '学校官方频道2026年的校园导览和学员访谈。',
      badge: `${page.shortName} 视频`,
    },
    rooms: {
      photoTitle: '房型实景',
      photoIntro: page.roomsPhotoIntro,
      rulesTitle: '短期费率、入住离校与宿舍规定',
      rulesHint: '1–3周住宿费比例、入住离校时间、提前入住和延后退房、宿舍规定',
      dormRulesTitle: '宿舍与外出规定',
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
    refund: FELLA_REFUND_COPY,
    practicalGuide: {
      summaryTitle: '到校须知与学校服务',
      summaryHint: '用餐与开放时间、打扫洗衣、活动、入学离校和接机',
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

/** The campus's own part of the shared English Fella document, filled up to the current schema. */
export function fellaCampusDefaults(campus: FellaCampus): CiaContentConfig {
  return fellaCampusContent(createDefaultFellaContentConfig(), campus);
}

export function fellaPageProfile(campus: FellaCampus): PhSchoolProfile {
  const page = FELLA_PAGE_CONTENT[campus];
  const defaultContent = () => fellaCampusDefaults(campus);
  const defaults = defaultContent();
  const initialPricing = createCiaQuotePricing(defaults);
  const videoTabs: PhVideoTab[] = (['校园视频', '学员访谈'] as const)
    .map(topic => ({
      label: topic,
      icon: topic === '学员访谈' ? 'record_voice_over' : 'videocam',
      items: FELLA_VIDEOS[campus]
        .filter(video => video.topic === topic)
        .map(video => ({
          title: video.title,
          text: video.description,
          src: fellaVideoSrc(campus, video),
          poster: fellaVideoPoster(campus, video),
          duration: video.duration,
          shape: 'wide' as const,
        })),
    }))
    .filter(tab => tab.items.length > 0);
  const initialRoomRateGroups: RoomRateGroup[] = [...new Set(defaults.rooms.map(room => room.group))].map(title => ({
    title,
    rooms: defaults.rooms
      .filter(room => room.enabled && room.group === title)
      .map(room => ({ id: room.id, label: room.label, code: room.code, location: room.location })),
  }));

  return {
    code: defaults.schoolCode,
    name: page.shortName,
    previewPrefix: 'fella',
    pricingSchoolName: FELLA_SCHOOL_NAME,
    copy: fellaCopy(campus),
    compactLayout: true,
    videoTabs,
    overviewFacts: page.overviewFacts,
    courseHighlights: page.courseHighlights,
    gallery: {
      categories: CIA_GALLERY_CATEGORIES,
      albumCategories: [...page.albumCategories],
      images: page.galleryImages.map(image => ({ ...image })),
      heroCategories: page.heroCategories,
      albumDescriptions: FELLA_ALBUM_DESCRIPTIONS,
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
    dormRules: page.dormRules,
    roomProfiles: page.roomProfiles,
    ieltsResults: [],
    studentReviews: [],
    reviewPath: '',
    holidayCalendars: [FELLA_HOLIDAYS_2027],
    ieltsComputerExamDates2027: [],
    studentCareServices: [],
    campusPracticalGuides: page.practicalGuides,
    studentTracks: [],
    sidaReasons: CIA_SIDA_REASONS.map(reason => ({ ...reason, alt: reason.alt.replace(/CIA/g, page.shortName) })),
    sidaTrustBadges: CIA_SIDA_TRUST_BADGES,
    ctaBadges: FELLA_FINAL_CTA_BADGES,
    ctaConsultants: CIA_CTA_CONSULTANTS,
    mobileAnchors: [
      { label: '视频', target: 'gallery', icon: 'smart_display' },
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
    cloneContent: value => fellaCampusContent(value, campus),
  };
}

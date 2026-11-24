// IU and ICL content for the shared Philippine school page (school-page/ph-school-page.component.*). Each campus
// gets its own profile: text and data come from that campus's part of iu-icl-page-content.ts, prices and rules from
// that campus's content document (iu-icl-content-config.ts). Keep it pure data (no Angular, DOM or storage).
import { createCiaQuotePricing } from '../cia-school/cia-quote-engine';
import {
  CIA_CTA_CONSULTANTS,
  CIA_GALLERY_CATEGORIES,
  CIA_PAGE_COPY,
  CIA_SIDA_REASONS,
  CIA_SIDA_TRUST_BADGES,
  type CiaShortVideo,
  type RoomRateGroup,
} from '../cia-school/cia-page-content';
import type { PhPageCopy, PhSchoolProfile, PhVideoItem, PhVideoTab } from '../school-page/ph-school-profile';
import {
  cloneIuIclContentConfig,
  createDefaultIuIclContentConfig,
  type IuIclCampus,
} from './iu-icl-content-config';
import {
  IU_ICL_HOLIDAY_CALENDARS,
  IU_ICL_HOLIDAY_FOOTNOTE,
  IU_ICL_PAGE_CONTENT,
  IU_ICL_REFERENCE_NOTE,
  IU_ICL_REFUND_COPY,
  iuIclVideoPoster,
  iuIclVideoSrc,
  type IuIclVideo,
} from './iu-icl-page-content';

/** Public route of each campus page. */
export const IU_ICL_PAGE_PATHS: Record<IuIclCampus, string> = {
  IU: '/philippines-study/cebu/iu-english-academy',
  ICL: '/philippines-study/cebu/icl',
};

/** Exact database school names; the quote never falls back to the other campus. */
export const IU_ICL_DATABASE_NAMES: Record<IuIclCampus, string> = {
  IU: '菲律宾宿务IU English Academy',
  ICL: '菲律宾宿务ICL English Academy',
};

const VIDEO_TOPICS: ReadonlyArray<IuIclVideo['topic']> = ['校园', '宿舍', '课程', '餐厅'];

function buildProfile(campus: IuIclCampus): PhSchoolProfile {
  const page = IU_ICL_PAGE_CONTENT[campus];
  const defaults = createDefaultIuIclContentConfig(campus);
  const initialPricing = createCiaQuotePricing(defaults);
  const brand = (text: string) => text.replace(/CIA/g, campus);

  const albumVideo = (item: IuIclVideo): PhVideoItem => ({
    title: item.title,
    text: item.description,
    src: iuIclVideoSrc(campus, item),
    poster: iuIclVideoPoster(campus, item),
    duration: item.duration,
    shape: item.orientation === 'landscape' ? 'wide' : 'tall',
  });
  const shortVideo = (item: IuIclVideo): CiaShortVideo => ({
    title: item.title,
    text: item.description,
    src: iuIclVideoSrc(campus, item),
    poster: iuIclVideoPoster(campus, item),
    duration: item.duration,
    ...(item.orientation === 'landscape' ? { shape: 'wide' as const } : {}),
  });
  const videoTabs: PhVideoTab[] = VIDEO_TOPICS
    .map(topic => ({
      label: `${topic}视频`,
      icon: 'videocam',
      items: page.videos.filter(item => item.topic === topic).map(albumVideo),
    }))
    .filter(tab => tab.items.length > 0);
  const roomVideos = Object.fromEntries(
    Object.entries(page.roomVideoNames)
      .map(([roomId, name]) => [roomId, page.videos.find(item => item.name === name)] as const)
      .filter((entry): entry is readonly [string, IuIclVideo] => !!entry[1])
      .map(([roomId, item]) => [roomId, albumVideo(item)]),
  );

  const copy: PhPageCopy = {
    swipeHint: CIA_PAGE_COPY.swipeHint,
    referenceNote: IU_ICL_REFERENCE_NOTE,
    hero: {
      breadcrumb: `菲律宾游学 / 宿务学校 / ${campus}`,
      title: `菲律宾宿务 ${campus} English Academy`,
      lead: page.text.heroLead,
      tags: [...page.text.heroTags],
      quoteLabel: `获取 ${campus} 最新报价`,
    },
    overview: { title: `30 秒看懂 ${campus}` },
    advisorReview: {
      title: `顾问怎么看 ${campus}`,
      text: page.text.advisorText,
      suitableTitle: '适合谁',
      notSuitableTitle: '报名前想清楚',
    },
    campus: {
      eyebrow: 'CAMPUS AT A GLANCE',
      title: `${campus} 校园介绍`,
      intro: page.text.campusIntro,
    },
    gallery: {
      title: `按区域查看 ${campus} 环境`,
      intro: page.text.galleryIntro,
      photoNote: CIA_PAGE_COPY.gallery.photoNote,
      roomComparisonTitle: '房型对比',
      roomDisclaimer: IU_ICL_REFERENCE_NOTE,
    },
    courses: {
      title: `${campus} 课程怎么选？`,
      intro: page.text.coursesIntro,
      priceUnit: '/4周',
      fitLabel: '适合人群',
      noteLabel: '课程说明',
      detailSummaryTitle: '查看课程细节与每日作息',
      detailSummaryHint: '保分班、考试课程和上课规定',
      guideTitle: '报名前值得确认的课程细节',
    },
    ...(page.scheduleColumns.length
      ? {
        schedule: {
          eyebrow: 'DAILY TIMETABLE',
          title: `${campus} 每日作息（周一至周五）`,
          intro: page.scheduleIntro,
          badge: '每节课45分钟',
        },
      }
      : {}),
    planning: {
      summaryTitle: '2027年学校假期',
      summaryHint: '公众假期停课，每月至少19个上课日',
    },
    calendar: {
      eyebrow: 'ACADEMIC CALENDAR',
      title: `${campus} 2027年假期`,
      intro: '学校假期一表看完，用于规划入学日期和周数。',
      footnote: IU_ICL_HOLIDAY_FOOTNOTE,
      peakEyebrow: '',
      peakTitle: '',
      peakIntro: '',
      peakNote: '',
    },
    videos: {
      eyebrow: 'SCHOOL VIDEOS',
      title: `用视频了解 ${campus}`,
      intro: `${campus}自己拍摄的校园、宿舍和课堂视频。`,
      badge: `${campus} 学校视频`,
      lifeTitle: '校园短片',
    },
    rooms: {
      photoTitle: '房型实景',
      photoIntro: page.text.roomsPhotoIntro,
      rulesTitle: '短期费率、入住离校与学校规定',
      rulesHint: '1–3周费率、入住离校、警告与宿舍规定',
      dormRulesTitle: '学校与宿舍规定',
    },
    quote: {
      ...CIA_PAGE_COPY.quote,
      compareShortcuts: [
        { focus: 'room', label: '比房型', hint: '如校内三人间、双人间和单人间' },
        { focus: 'course', label: '比同类课程', hint: '如Power Speaking 4、6、8' },
        { focus: 'weeks', label: '比周数', hint: '如4周、8周、12周' },
      ],
    },
    fees: CIA_PAGE_COPY.fees,
    refund: IU_ICL_REFUND_COPY(campus),
    practicalGuide: {
      summaryTitle: '到校须知与学校服务',
      summaryHint: page.practicalGuideHint,
      intro: page.practicalGuideIntro,
    },
    sida: {
      ...CIA_PAGE_COPY.sida,
      title: brand(CIA_PAGE_COPY.sida.title),
      photoAlt: brand(CIA_PAGE_COPY.sida.photoAlt),
      photoCaption: brand(CIA_PAGE_COPY.sida.photoCaption),
    },
    faq: CIA_PAGE_COPY.faq,
    finalCta: {
      title: page.text.finalCtaTitle,
      text: page.text.finalCtaText,
      primaryLabel: `获取 ${campus} 完整报价单`,
      secondaryLabel: '咨询当前空房',
    },
  };

  const initialRoomRateGroups: RoomRateGroup[] = [...new Set(defaults.rooms.map(room => room.group))].map(title => ({
    title,
    rooms: defaults.rooms
      .filter(room => room.enabled && room.group === title)
      .map(room => ({ id: room.id, label: room.label, code: room.code, location: room.location })),
  }));

  return {
    code: campus,
    name: campus,
    previewPrefix: campus.toLowerCase(),
    pricingSchoolName: IU_ICL_DATABASE_NAMES[campus],
    copy,
    compactLayout: true,
    overviewFacts: page.overviewFacts,
    videoTabs,
    courseHighlights: page.courseHighlights,
    roomVideos,
    // User request 2026-11-24: vertical videos shown whole, tried on IU before every school gets it.
    tallVideoBackdrop: campus === 'IU',
    gallery: {
      categories: CIA_GALLERY_CATEGORIES,
      albumCategories: ['校园', '教室', '住宿', '餐厅', '设施'],
      images: page.gallery,
      heroCategories: ['校园', '设施', '住宿', '教室', '餐厅'],
      albumDescriptions: page.albumDescriptions,
      uploadedPhotoTitle: `${campus} 学校媒体`,
      uploadedPhotoDescription: `${campus} 学校实景内容`,
      uploadedVideoTitle: `${campus} 学校视频`,
    },
    snapshotCards: page.quickInfo,
    basicInfo: page.basicInfo,
    suitableFor: page.suitableFor.map(title => ({ title, text: '' })),
    notSuitableFor: page.notSuitableFor.map(title => ({ title, text: '' })),
    campusBuildings: page.campusBuildings,
    videoCards: [],
    campusLifeVideos: page.videos.map(shortVideo),
    interviewVideos: [],
    courseGroups: page.courseGroups,
    studyModes: [],
    courseDetailGuides: page.courseDetailGuides,
    scheduleColumns: page.scheduleColumns,
    initialCourseFees: initialPricing.courseFees,
    initialRoomFees: initialPricing.roomFees,
    initialRoomRateGroups,
    roomGroupNotes: {
      '校外住宿': '不参加淡季套餐价，可享思达启航9折。',
      '走读': '不住宿，只收课程费；到校只交SSP、签证和教材相关费用。',
    },
    showRoomCodes: false,
    dormRules: page.dormRules,
    roomProfiles: page.roomProfiles,
    ieltsResults: [],
    studentReviews: [],
    reviewPath: '',
    holidayCalendars: IU_ICL_HOLIDAY_CALENDARS,
    ieltsComputerExamDates2027: [],
    studentCareServices: [],
    campusPracticalGuides: page.practicalGuides,
    studentTracks: [],
    sidaReasons: CIA_SIDA_REASONS.map(reason => ({ ...reason, alt: brand(reason.alt) })),
    sidaTrustBadges: CIA_SIDA_TRUST_BADGES,
    ctaBadges: page.ctaBadges,
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
    defaultContent: () => createDefaultIuIclContentConfig(campus),
    cloneContent: value => cloneIuIclContentConfig(value, campus),
  };
}

const PROFILES = new Map<IuIclCampus, PhSchoolProfile>();

/** The template profile of one campus, built once. */
export function iuIclPageProfile(campus: IuIclCampus): PhSchoolProfile {
  let profile = PROFILES.get(campus);
  if (!profile) {
    profile = buildProfile(campus);
    PROFILES.set(campus, profile);
  }
  return profile;
}

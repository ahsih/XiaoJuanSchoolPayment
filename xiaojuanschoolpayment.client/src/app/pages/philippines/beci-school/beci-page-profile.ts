// The three BECI campus pages on the shared Philippine school page (school-page/ph-school-page.component.*).
// Campus text and data come from beci-<campus>-page-content.ts and beci-shared-content.ts; prices and rules from the
// shared content document (beci-content-config.ts, one per school, filtered to the campus).
// Keep it pure data (no Angular, DOM or storage), like the modules it reads.
import type { CiaContentConfig } from '../cia-school/cia-content-config';
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
import { beciCampusContent, createDefaultBeciContentConfig, type BeciCampus } from './beci-content-config';
import { BECI_CITY_PAGE } from './beci-city-page-content';
import { BECI_EOP_PAGE } from './beci-eop-page-content';
import {
  BECI_ARRIVAL_GUIDE,
  BECI_FINAL_CTA_BADGES,
  BECI_HOLIDAY_CALENDARS,
  BECI_HOLIDAY_FOOTNOTE,
  BECI_PROGRAM_GUIDES,
  BECI_REFERENCE_NOTE,
  BECI_REFUND_COPY,
  BECI_SHARED_FAQS,
  beciOffers,
  type BeciCampusPageContent,
  type BeciVideo,
} from './beci-shared-content';
import { BECI_SPARTA_PAGE } from './beci-sparta-page-content';

/** Exact database name of the BECI record that holds the three campuses' prices, photos and content revision. */
export const BECI_SCHOOL_NAMES = ['菲律宾碧瑶BECI语言学校', 'BECI International Language Academy', 'API BECI'] as const;

export const BECI_CAMPUS_PAGES: Readonly<Record<BeciCampus, BeciCampusPageContent>> = {
  eop: BECI_EOP_PAGE,
  city: BECI_CITY_PAGE,
  sparta: BECI_SPARTA_PAGE,
};

export const beciCampusDefaults = (campus: BeciCampus): CiaContentConfig => beciCampusContent(createDefaultBeciContentConfig(), campus);

const videoSrc = (campus: BeciCampus, video: BeciVideo) => `/assets/beci-${campus}/videos/${video.name}.mp4`;
const videoPoster = (campus: BeciCampus, video: BeciVideo) => `/assets/beci-${campus}/videos/${video.name}.jpg`;

function copyFor(page: BeciCampusPageContent): PhPageCopy {
  const text = page.text;
  const brand = (value: string) => value.replace(/CIA/g, 'BECI');
  return {
    swipeHint: CIA_PAGE_COPY.swipeHint,
    referenceNote: BECI_REFERENCE_NOTE,
    hero: { breadcrumb: text.breadcrumb, title: text.heroTitle, lead: text.heroLead, tags: [...text.heroTags], quoteLabel: text.quoteLabel },
    overview: { title: text.overviewTitle },
    advisorReview: { title: text.advisorTitle, text: text.advisorText, suitableTitle: '适合谁', notSuitableTitle: '报名前想清楚' },
    campus: { eyebrow: 'CAMPUS AT A GLANCE', title: text.campusTitle, intro: text.campusIntro },
    gallery: {
      title: text.galleryTitle,
      intro: text.galleryIntro,
      photoNote: CIA_PAGE_COPY.gallery.photoNote,
      roomComparisonTitle: '房型对比',
      roomDisclaimer: BECI_REFERENCE_NOTE,
    },
    courses: {
      title: text.coursesTitle,
      intro: text.coursesIntro,
      priceUnit: '/4周',
      fitLabel: '适合人群',
      noteLabel: '课程说明',
      detailSummaryTitle: '查看课程细节与每日作息',
      detailSummaryHint: text.detailHint,
      guideTitle: '报名前值得确认的课程细节',
    },
    schedule: { eyebrow: 'DAILY TIMETABLE', title: text.scheduleTitle, intro: text.scheduleIntro, badge: text.scheduleBadge },
    planning: { summaryTitle: '2027年学校假期', summaryHint: '平日假期不上课，特别假日按政府公告调整' },
    calendar: {
      eyebrow: 'ACADEMIC CALENDAR',
      title: 'BECI 2027年日历',
      intro: '学校假期和暑期旺季一表看完，用于规划入学日期和周数。',
      footnote: BECI_HOLIDAY_FOOTNOTE,
      peakEyebrow: 'PEAK SEASON',
      peakTitle: '暑期旺季',
      peakIntro: '',
      peakNote: '',
    },
    videos: {
      eyebrow: 'SCHOOL VIDEOS',
      title: `用视频了解 ${text.heroTitle.replace('菲律宾碧瑶 ', '')}`,
      intro: '学校拍摄的校区视频。',
      badge: 'BECI 学校视频',
      lifeTitle: '校区视频',
    },
    rooms: {
      photoTitle: '房型实景',
      photoIntro: text.roomsPhotoIntro,
      rulesTitle: '短期费率、入住离校与宿舍规定',
      rulesHint: '1–3周住宿费比例、入住离校与宿舍规定',
      dormRulesTitle: '宿舍规定',
    },
    quote: {
      ...CIA_PAGE_COPY.quote,
      compareShortcuts: [
        { focus: 'room', label: '比房型', hint: text.compareRoomHint },
        { focus: 'course', label: '比同类课程', hint: text.compareCourseHint },
        { focus: 'weeks', label: '比周数', hint: '如4周、8周、12周' },
      ],
    },
    fees: CIA_PAGE_COPY.fees,
    refund: BECI_REFUND_COPY,
    practicalGuide: {
      summaryTitle: '到校须知与学校服务',
      summaryHint: '用餐与开放时间、打扫洗衣、入学与接机、其他收费',
      intro: '出发前和到校后最常问到的安排。',
    },
    sida: {
      ...CIA_PAGE_COPY.sida,
      title: brand(CIA_PAGE_COPY.sida.title),
      photoAlt: brand(CIA_PAGE_COPY.sida.photoAlt),
      photoCaption: brand(CIA_PAGE_COPY.sida.photoCaption),
    },
    offers: {
      eyebrow: 'OFFERS',
      title: 'BECI 报名优惠',
      intro: '淡季九折和长期学习优惠可以同时使用；入学日按周日到校计算，每项优惠的日期和周数条件写在卡片上。',
      note: '报价器会按报名日、入学日和课程周数自动算出能用的优惠；最终以学校确认为准。',
    },
    faq: CIA_PAGE_COPY.faq,
    finalCta: { title: text.finalCtaTitle, text: text.finalCtaText, primaryLabel: '获取 BECI 完整报价单', secondaryLabel: '咨询当前空房' },
  };
}

/** The template profile of one BECI campus page. */
export function beciPageProfile(campus: BeciCampus): PhSchoolProfile {
  const page = BECI_CAMPUS_PAGES[campus];
  const defaultContent = () => beciCampusDefaults(campus);
  const defaults = defaultContent();
  const initialPricing = createCiaQuotePricing(defaults);
  const roomRateGroups: RoomRateGroup[] = [...new Set(defaults.rooms.map(room => room.group))].map(title => ({
    title,
    rooms: defaults.rooms
      .filter(room => room.enabled && room.group === title)
      .map(room => ({ id: room.id, label: room.label, code: room.code, location: room.location })),
  }));
  const albumVideo = (video: BeciVideo): PhVideoItem => ({
    title: video.title, text: video.description, src: videoSrc(campus, video), poster: videoPoster(campus, video), duration: video.duration, shape: 'wide',
  });
  const shortVideo = (video: BeciVideo): CiaShortVideo => ({
    title: video.title, text: video.description, src: videoSrc(campus, video), poster: videoPoster(campus, video), duration: video.duration, shape: 'wide',
  });
  const topics = [...new Set(page.videos.map(video => video.topic))];
  const videoTabs: PhVideoTab[] = topics.map(topic => ({
    label: `${topic}视频`,
    icon: 'videocam',
    items: page.videos.filter(video => video.topic === topic).map(albumVideo),
  }));
  const afternoon = page.schedule.findIndex(row => row.time.startsWith(page.afternoonFrom));
  const roomVideos = Object.fromEntries(Object.entries(page.roomVideoNames)
    .map(([roomId, name]) => [roomId, page.videos.find(video => video.name === name)])
    .filter((entry): entry is [string, BeciVideo] => !!entry[1])
    .map(([roomId, video]) => [roomId, albumVideo(video)]));
  const shortName = campus === 'eop' ? 'BECI EOP' : campus === 'city' ? 'BECI City' : 'BECI Sparta';
  return {
    code: 'BECI',
    name: shortName,
    previewPrefix: 'beci',
    pricingSchoolName: BECI_SCHOOL_NAMES[0],
    copy: copyFor(page),
    compactLayout: true,
    overviewFacts: page.overviewFacts,
    videoTabs,
    courseHighlights: campus === 'sparta' ? { 'sparta-ielts-guarantee': { badge: '最低12周', icon: 'workspace_premium' } } : {},
    roomVideos,
    gallery: {
      categories: CIA_GALLERY_CATEGORIES,
      albumCategories: ['校园', '教室', '住宿', '餐厅', '设施'],
      images: page.galleryImages.map(image => ({ ...image })),
      heroCategories: ['校园', '设施', '住宿'],
      albumDescriptions: { ...page.albumDescriptions },
      uploadedPhotoTitle: `${shortName} 学校媒体`,
      uploadedPhotoDescription: `${shortName} 校区实景内容`,
      uploadedVideoTitle: `${shortName} 学校视频`,
    },
    snapshotCards: page.quickInfo,
    basicInfo: page.basicInfo,
    suitableFor: page.suitableFor.map(title => ({ title, text: '' })),
    notSuitableFor: page.notSuitableFor.map(title => ({ title, text: '' })),
    campusBuildings: page.campusAreas,
    videoCards: [],
    campusLifeVideos: page.videos.map(shortVideo),
    interviewVideos: [],
    courseGroups: page.courseGroups,
    studyModes: [],
    courseDetailGuides: [...page.courseDetailGuides, ...BECI_PROGRAM_GUIDES],
    scheduleColumns: [
      { code: 'MORNING', title: '上午', rows: page.schedule.slice(0, afternoon) },
      { code: 'AFTERNOON', title: '下午和晚上', rows: page.schedule.slice(afternoon) },
    ],
    initialCourseFees: initialPricing.courseFees,
    initialRoomFees: initialPricing.roomFees,
    initialRoomRateGroups: roomRateGroups,
    roomGroupNotes: page.roomGroupNotes,
    showRoomCodes: false,
    dormRules: page.dormRules,
    roomProfiles: page.roomProfiles,
    ieltsResults: [],
    studentReviews: [],
    reviewPath: '',
    holidayCalendars: BECI_HOLIDAY_CALENDARS,
    ieltsComputerExamDates2027: [],
    studentCareServices: [],
    campusPracticalGuides: [...page.practicalGuides.slice(0, 2), BECI_ARRIVAL_GUIDE, ...page.practicalGuides.slice(2)],
    studentTracks: [],
    sidaReasons: CIA_SIDA_REASONS.map(reason => ({ ...reason, alt: reason.alt.replace(/CIA/g, 'BECI') })),
    sidaTrustBadges: CIA_SIDA_TRUST_BADGES,
    ctaBadges: BECI_FINAL_CTA_BADGES,
    ctaConsultants: CIA_CTA_CONSULTANTS,
    offers: beciOffers(campus),
    mobileAnchors: [
      { label: '视频', target: 'gallery', icon: 'smart_display' },
      { label: '概览', target: 'overview', icon: 'dashboard' },
      { label: '课程', target: 'courses', icon: 'menu_book' },
      { label: '住宿', target: 'rooms', icon: 'bed' },
      { label: '优惠', target: 'offers', icon: 'local_offer' },
      { label: '报价', target: 'quote', icon: 'calculate' },
      { label: 'FAQ', target: 'faq', icon: 'help' },
    ],
    faqs: () => [...page.faqs, ...BECI_SHARED_FAQS].map(item => ({ ...item })),
    shows2026Prices: () => false,
    defaultContent,
    cloneContent: value => beciCampusContent(value, campus),
  };
}

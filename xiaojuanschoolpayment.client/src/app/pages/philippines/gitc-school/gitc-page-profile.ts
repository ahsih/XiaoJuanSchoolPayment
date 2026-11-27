// The two GITC campus pages on the shared Philippine school page (school-page/ph-school-page.component.*).
// Campus text and data come from gitc-<campus>-page-content.ts and gitc-shared-content.ts; prices and rules from the
// shared content document (gitc-content-config.ts, one per school, filtered to the campus).
// Keep it pure data (no Angular, DOM or storage), like the modules it reads.
import type { CiaContentConfig } from '../cia-school/cia-content-config';
import { createCiaQuotePricing } from '../cia-school/cia-quote-engine';
import {
  CIA_CTA_CONSULTANTS,
  CIA_GALLERY_CATEGORIES,
  CIA_PAGE_COPY,
  CIA_SIDA_REASONS,
  CIA_SIDA_TRUST_BADGES,
  type RoomRateGroup,
} from '../cia-school/cia-page-content';
import type { PhPageCopy, PhSchoolProfile } from '../school-page/ph-school-profile';
import { GITC_2027_ARRIVAL_START, createDefaultGitcContentConfig, gitcCampusContent, type GitcCampus } from './gitc-content-config';
import { GITC_CEBU_PAGE } from './gitc-cebu-page-content';
import { GITC_ILOILO_PAGE } from './gitc-iloilo-page-content';
import {
  GITC_CAMP_GUIDE,
  GITC_FINAL_CTA_BADGES,
  GITC_PROGRAM_GUIDES,
  GITC_REFERENCE_NOTE,
  GITC_REFUND_COPY,
  GITC_RULES_GUIDE,
  GITC_SHARED_FAQS,
  gitcOffers,
  type GitcCampusPageContent,
} from './gitc-shared-content';

/** Exact database name of the GITC record that holds both campuses' photos and content revision. */
export const GITC_SCHOOL_NAMES = [
  '菲律宾怡朗GITC College International Language Center',
  'GITC College International Language Center',
  'Green International Technological College Language Center',
] as const;

export const GITC_CAMPUS_PAGES: Readonly<Record<GitcCampus, GitcCampusPageContent>> = {
  iloilo: GITC_ILOILO_PAGE,
  cebu: GITC_CEBU_PAGE,
};

const pad = (value: number) => String(value).padStart(2, '0');
/** Today in the visitor's calendar; the course and room lists show 2026 prices until the 2027 list starts. */
export const gitcLocalToday = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
};
export const gitcListsTwoPriceYears = (): boolean => gitcLocalToday() < GITC_2027_ARRIVAL_START;

export const gitcCampusDefaults = (campus: GitcCampus): CiaContentConfig => gitcCampusContent(createDefaultGitcContentConfig(), campus);

function copyFor(page: GitcCampusPageContent): PhPageCopy {
  const text = page.text;
  const brand = (value: string) => value.replace(/CIA/g, 'GITC');
  return {
    swipeHint: CIA_PAGE_COPY.swipeHint,
    referenceNote: GITC_REFERENCE_NOTE,
    hero: { breadcrumb: text.breadcrumb, title: text.heroTitle, lead: text.heroLead, tags: [...text.heroTags], quoteLabel: text.quoteLabel },
    overview: { title: text.overviewTitle },
    advisorReview: { title: text.advisorTitle, text: text.advisorText, suitableTitle: '适合谁', notSuitableTitle: '报名前想清楚' },
    campus: { eyebrow: 'CAMPUS AT A GLANCE', title: text.campusTitle, intro: text.campusIntro },
    gallery: {
      title: text.galleryTitle,
      intro: text.galleryIntro,
      photoNote: CIA_PAGE_COPY.gallery.photoNote,
      roomComparisonTitle: '房型对比',
      roomDisclaimer: GITC_REFERENCE_NOTE,
    },
    courses: {
      title: text.coursesTitle,
      intro: text.coursesIntro,
      priceUnit: '/4周',
      oldPriceLabel: '2027/02/15起开课',
      fitLabel: '适合人群',
      noteLabel: '课程说明',
      detailSummaryTitle: '查看课程细节与每日作息',
      detailSummaryHint: text.detailHint,
      guideTitle: '报名前值得确认的课程细节',
    },
    schedule: { eyebrow: 'DAILY TIMETABLE', title: text.scheduleTitle, intro: text.scheduleIntro, badge: text.scheduleBadge },
    planning: { summaryTitle: '学校假期', summaryHint: '菲律宾公众假期不上课，以学校通知为准' },
    calendar: {
      eyebrow: 'ACADEMIC CALENDAR',
      title: 'GITC 日历',
      intro: '',
      footnote: '',
      peakEyebrow: '',
      peakTitle: '',
      peakIntro: '',
      peakNote: '',
    },
    videos: {
      eyebrow: 'SCHOOL VIDEOS',
      title: '学校视频',
      intro: '',
      badge: 'GITC 学校视频',
      lifeTitle: '校区视频',
    },
    rooms: {
      photoTitle: '房型实景',
      photoIntro: text.roomsPhotoIntro,
      rulesTitle: '短期费率、入住离校与住宿规定',
      rulesHint: '1–3周比例、入住离校与住宿规定',
      dormRulesTitle: '住宿规定',
    },
    quote: {
      ...CIA_PAGE_COPY.quote,
      compareShortcuts: [
        { focus: 'room', label: '比房型', hint: text.compareRoomHint },
        { focus: 'course', label: '比同类课程', hint: '如 Regular ESL 和 Power Speaking' },
        { focus: 'weeks', label: '比周数', hint: '如4周、8周、12周' },
      ],
    },
    fees: CIA_PAGE_COPY.fees,
    refund: GITC_REFUND_COPY,
    practicalGuide: {
      summaryTitle: '到校须知与学校规定',
      summaryHint: '接机、用餐与开放时间、学习与生活规定、周末活动',
      intro: '出发前和到校后最常问到的安排。',
    },
    sida: {
      ...CIA_PAGE_COPY.sida,
      title: brand(CIA_PAGE_COPY.sida.title),
      photoAlt: brand(CIA_PAGE_COPY.sida.photoAlt),
      photoCaption: brand(CIA_PAGE_COPY.sida.photoCaption),
    },
    offers: {
      eyebrow: 'PROGRAMS',
      title: 'GITC 学校项目',
      intro: '学校为在读学生提供的项目，条件写在卡片上。',
      note: '项目安排以学校确认为准。',
    },
    faq: CIA_PAGE_COPY.faq,
    finalCta: { title: text.finalCtaTitle, text: text.finalCtaText, primaryLabel: '获取 GITC 完整报价单', secondaryLabel: '咨询当前空房' },
  };
}

/** The template profile of one GITC campus page. */
export function gitcPageProfile(campus: GitcCampus): PhSchoolProfile {
  const page = GITC_CAMPUS_PAGES[campus];
  const defaultContent = () => gitcCampusDefaults(campus);
  const defaults = defaultContent();
  const initialPricing = createCiaQuotePricing(defaults);
  const roomRateGroups: RoomRateGroup[] = [...new Set(defaults.rooms.map(room => room.group))].map(title => ({
    title,
    rooms: defaults.rooms
      .filter(room => room.enabled && room.group === title)
      .map(room => ({ id: room.id, label: room.label, code: room.code, location: room.location })),
  }));
  const afternoon = page.schedule.findIndex(row => row.time.startsWith(page.afternoonFrom));
  const shortName = campus === 'iloilo' ? 'GITC Iloilo' : 'GITC Cebu';
  const prefix = campus === 'iloilo' ? 'il' : 'cb';
  return {
    code: 'GITC',
    name: shortName,
    previewPrefix: 'gitc',
    pricingSchoolName: GITC_SCHOOL_NAMES[0],
    copy: copyFor(page),
    compactLayout: true,
    overviewFacts: page.overviewFacts,
    videoTabs: [],
    courseHighlights: {
      [`${prefix}-ielts-guarantee`]: { badge: '最低12周', icon: 'workspace_premium' },
      [`${prefix}-toeic-guarantee`]: { badge: '最低12周', icon: 'workspace_premium' },
    },
    roomVideos: {},
    gallery: {
      categories: CIA_GALLERY_CATEGORIES,
      albumCategories: ['校园', '教室', '住宿', '餐厅', '设施'],
      images: page.galleryImages.map(image => ({ ...image })),
      heroCategories: ['校园', '住宿', '教室'],
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
    campusLifeVideos: [],
    interviewVideos: [],
    courseGroups: page.courseGroups,
    studyModes: [],
    courseDetailGuides: [...GITC_PROGRAM_GUIDES, GITC_CAMP_GUIDE],
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
    holidayCalendars: [],
    ieltsComputerExamDates2027: [],
    studentCareServices: [],
    campusPracticalGuides: [...page.practicalGuides.slice(0, 2), GITC_RULES_GUIDE, ...page.practicalGuides.slice(2)],
    studentTracks: [],
    sidaReasons: CIA_SIDA_REASONS.map(reason => ({ ...reason, alt: reason.alt.replace(/CIA/g, 'GITC') })),
    sidaTrustBadges: CIA_SIDA_TRUST_BADGES,
    ctaBadges: GITC_FINAL_CTA_BADGES,
    ctaConsultants: CIA_CTA_CONSULTANTS,
    offers: gitcOffers(campus),
    mobileAnchors: [
      { label: '概览', target: 'overview', icon: 'dashboard' },
      { label: '课程', target: 'courses', icon: 'menu_book' },
      { label: '住宿', target: 'rooms', icon: 'bed' },
      { label: '报价', target: 'quote', icon: 'calculate' },
      { label: '费用', target: 'local-fees', icon: 'payments' },
      { label: 'FAQ', target: 'faq', icon: 'help' },
    ],
    faqs: () => [...page.faqs, ...GITC_SHARED_FAQS].map(item => ({ ...item })),
    shows2026Prices: gitcListsTwoPriceYears,
    defaultContent,
    cloneContent: value => gitcCampusContent(value, campus),
  };
}

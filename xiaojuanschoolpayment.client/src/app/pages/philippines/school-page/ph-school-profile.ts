/**
 * What one Philippine school fills into the shared school page (ph-school-page.component.*).
 * The layout and design belong to the template; a school only supplies text, data and its quote.
 * A section whose data is missing (an empty list or an absent copy block) is left out of the page.
 * Keep this file free of Angular, DOM and storage access, like the content modules it describes.
 */
import type { CiaContentConfig } from '../cia-school/cia-content-config';
import type {
  BasicInfoRow,
  CampusBuildingCard,
  CampusPracticalGuide,
  CIA_PAGE_COPY,
  CiaShortVideo,
  CiaVideoCard,
  CourseDetailGuide,
  CourseFee,
  CtaConsultant,
  DailyScheduleRow,
  FaqItem,
  FitItem,
  GalleryCategory,
  GalleryImage,
  HolidayCalendar,
  IeltsExamDate,
  RoomComparisonProfile,
  RoomFee,
  RoomRateGroup,
  SidaCiaReason,
  SidaCiaTrustBadge,
  SideNavItem,
  StudentCareService,
} from '../cia-school/cia-page-content';
import type { CiaStudentReview } from '../cia-school/cia-student-reviews.data';
import type { PhCompareStudent } from './ph-plan-compare';

type CiaCopy = typeof CIA_PAGE_COPY;
type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/** Page text. Optional blocks hide their section when a school leaves them out. */
export interface PhPageCopy {
  swipeHint: string;
  hero: CiaCopy['hero'];
  overview: CiaCopy['overview'];
  advisorReview: CiaCopy['advisorReview'];
  license?: CiaCopy['license'];
  campus?: Optional<CiaCopy['campus'], 'studentCapacity' | 'teacherCount' | 'ruleTitle' | 'ruleText'>;
  gallery: CiaCopy['gallery'];
  courses: Optional<
    CiaCopy['courses'],
    'facts' | 'oldPriceLabel' | 'guideEyebrow' | 'guideTitle' | 'guideIntro' | 'levelTableCaption' | 'ruleNoteTitle' | 'ruleNoteText'
  >;
  /** A school-only block between the course list and the course details (EV: 斯巴达 / 半斯巴达). */
  studyModes?: { title: string; intro: string; note?: string };
  schedule?: Pick<CiaCopy['schedule'], 'eyebrow' | 'title' | 'intro' | 'badge' | 'note'>;
  planning?: CiaCopy['planning'];
  calendar?: Optional<CiaCopy['calendar'], 'badge' | 'provisionalLabel' | 'footnote'>;
  ielts?: CiaCopy['ielts'];
  videos: Optional<CiaCopy['videos'], 'lifeTitle' | 'interviewTitle'>;
  rooms: Optional<CiaCopy['rooms'], 'videoLink' | 'dormRulesTitle' | 'dormRulesNote' | 'tableHint'>;
  quote: CiaCopy['quote'];
  fees: CiaCopy['fees'];
  refund?: CiaCopy['refund'];
  studentCare?: CiaCopy['studentCare'];
  practicalGuide?: CiaCopy['practicalGuide'];
  studentTracks?: CiaCopy['studentTracks'];
  reviews?: Optional<CiaCopy['reviews'], 'scoresTitle' | 'scoresIntro' | 'scoresNote' | 'linkLabel'>;
  sida: CiaCopy['sida'];
  faq: CiaCopy['faq'];
  finalCta: CiaCopy['finalCta'];
}

/** One column of the daily timetable, e.g. 周一至周四 / 周五, or 半斯巴达 / 斯巴达. */
export interface PhScheduleColumn {
  code: string;
  title: string;
  rows: readonly DailyScheduleRow[];
}

/** A study-management mode (斯巴达 / 半斯巴达) with its fixed study times and going-out hours. */
export interface PhStudyMode {
  code: string;
  name: string;
  title: string;
  contrastTitle: string;
  timeBlocks: ReadonlyArray<{ label: string; time: string; text: string; icon: string; type: 'required' | 'flexible' }>;
  curfew: ReadonlyArray<{ day: string; time: string }>;
}

/** Room photos and facts; schools without measured sizes or booking codes leave those out. */
export type PhRoomProfile = Optional<
  RoomComparisonProfile,
  'englishName' | 'bookingCode' | 'size' | 'view' | 'bed' | 'service' | 'highlights'
>;

export type PhAlbumCategory = Exclude<GalleryCategory, '全部'>;

export interface PhSchoolProfile {
  /** schoolCode of the content document, e.g. 'CIA'. */
  code: string;
  /** Short school name in headings, labels and the comparison image, e.g. 'CIA'. */
  name: string;
  /** Editor preview messages are '<prefix>-content-ready', '-preview', '-select' and '-located'. */
  previewPrefix: string;
  /** Database school name for prices, photos and the published content revision. */
  pricingSchoolName: string;
  copy: PhPageCopy;
  gallery: {
    categories: GalleryCategory[];
    albumCategories: PhAlbumCategory[];
    images: GalleryImage[];
    heroCategories: readonly PhAlbumCategory[];
    albumDescriptions: Record<PhAlbumCategory, string>;
    uploadedPhotoTitle: string;
    uploadedPhotoDescription: string;
    uploadedVideoTitle: string;
  };
  snapshotCards: ReadonlyArray<{ icon: string; title: string; text: string }>;
  basicInfo: readonly BasicInfoRow[];
  suitableFor: readonly FitItem[];
  notSuitableFor: readonly FitItem[];
  campusBuildings: readonly CampusBuildingCard[];
  videoCards: readonly CiaVideoCard[];
  campusLifeVideos: readonly CiaShortVideo[];
  interviewVideos: readonly CiaShortVideo[];
  courseGroups: ReadonlyArray<{ icon: string; title: string; text: string; courseIds: readonly string[] }>;
  studyModes: readonly PhStudyMode[];
  courseDetailGuides: readonly CourseDetailGuide[];
  scheduleColumns: readonly PhScheduleColumn[];
  /** Prices shown before the database and the published revision load. */
  initialCourseFees: CourseFee[];
  initialRoomFees: RoomFee[];
  initialRoomRateGroups: RoomRateGroup[];
  /** Show room codes (CIA's P-1, D-4 …) in the room price list. */
  showRoomCodes: boolean;
  dormRules: ReadonlyArray<{ title: string; text: string }>;
  roomProfiles: readonly PhRoomProfile[];
  ieltsResults: ReadonlyArray<{ image: string; title: string; entrance: string; overall: string; detail: string }>;
  studentReviews: readonly CiaStudentReview[];
  /** Route of the full student stories; each review's slug is appended. */
  reviewPath: string;
  holidayCalendars: readonly HolidayCalendar[];
  ieltsComputerExamDates2027: ReadonlyArray<{ month: number; days: number[] }>;
  ieltsExamDates2026: readonly IeltsExamDate[];
  studentCareServices: readonly StudentCareService[];
  campusPracticalGuides: readonly CampusPracticalGuide[];
  studentTracks: ReadonlyArray<{ icon: string; title: string; text: string }>;
  sidaReasons: readonly SidaCiaReason[];
  sidaTrustBadges: readonly SidaCiaTrustBadge[];
  ctaBadges: readonly string[];
  ctaConsultants: readonly CtaConsultant[];
  mobileAnchors: readonly SideNavItem[];
  faqs(): FaqItem[];
  /** Whether the course list still shows a 2026 price beside the 2027 one. */
  shows2026Prices(): boolean;
  defaultContent(): CiaContentConfig;
  /** Fills a saved or previewed document up to the current schema; returns a copy. */
  cloneContent(value: CiaContentConfig): CiaContentConfig;
}

/** The quote student the page template binds: conditions, course-length warning and plan. */
export interface PhPageStudent extends PhCompareStudent {
  readonly courseLengthError?: string;
  readonly visaOptions: ReadonlyArray<{ value: string; label: string }>;
  visaType: string;
  readonly visaLabel: string;
  selectedAgeGroup: 'adult' | 'minor';
  /** Only schools whose prices or offers depend on it ask for the registration date. */
  selectedRegistrationDate?: string;
  /** Shown under the conditions when the student is under 18. */
  readonly minorNote: string;
}

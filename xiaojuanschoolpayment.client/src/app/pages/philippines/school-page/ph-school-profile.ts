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
  /** A school-only line closing each content section, e.g. EV: 仅供参考，实际以学校为准. CIA leaves it out (styles: ph-school-page-options.css). */
  referenceNote?: string;
  /** quoteLabel: a shorter hero quote button for a long name (CELLA Premium); default 获取 <name> 最新报价. */
  hero: CiaCopy['hero'] & { quoteLabel?: string };
  overview: CiaCopy['overview'];
  advisorReview: CiaCopy['advisorReview'];
  license?: CiaCopy['license'];
  campus?: Optional<CiaCopy['campus'], 'studentCapacity' | 'teacherCount' | 'ruleTitle' | 'ruleText'>;
  gallery: CiaCopy['gallery'];
  courses: Optional<
    CiaCopy['courses'],
    'oldPriceLabel' | 'guideEyebrow' | 'guideTitle' | 'guideIntro' | 'ruleNoteTitle' | 'ruleNoteText'
  > & {
    /** Fact cards above the course notes; CIA dropped them (2026-11-20). */
    facts?: ReadonlyArray<{ icon: string; title: string; text: string }>;
    /** Caption of a course note's level table (guide.levels). */
    levelTableCaption?: string;
  };
  /** A school-only block between the course list and the course details (EV: 斯巴达 / 半斯巴达). */
  studyModes?: { title: string; intro: string; note?: string };
  schedule?: Optional<Pick<CiaCopy['schedule'], 'eyebrow' | 'title' | 'intro' | 'badge' | 'note'>, 'note'>;
  planning?: CiaCopy['planning'];
  calendar?: Optional<CiaCopy['calendar'], 'badge' | 'provisionalLabel' | 'footnote'>;
  ielts?: CiaCopy['ielts'];
  videos: Optional<CiaCopy['videos'], 'lifeTitle' | 'interviewTitle'>;
  rooms: Optional<CiaCopy['rooms'], 'videoLink' | 'dormRulesTitle' | 'dormRulesNote' | 'tableHint'> & {
    /** Compact layout: the hint above the room price list; defaults to 点任一房型… (SMEAG Encanto has photos of one room only). */
    pickHint?: string;
  };
  /** The step and summary labels are read only by the compact layout's quote (CIA). */
  quote: Optional<CiaCopy['quote'], 'conditionsStepTitle' | 'conditionsStepHint' | 'summaryTitle' | 'localFeeLinkLabel'>;
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

/**
 * Room photos and facts; schools without measured sizes or booking codes leave those out.
 * A price card opens the profile whose bookingCode lists the card's code (CIA's P-1 …), or, for a school
 * without booking codes, the profile whose rateIds list the card's room id (EV).
 */
export type PhRoomProfile = Optional<
  RoomComparisonProfile,
  'englishName' | 'bookingCode' | 'size' | 'view' | 'bed' | 'service' | 'highlights'
> & { rateIds?: readonly string[] };

export type PhAlbumCategory = Exclude<GalleryCategory, '全部'>;

/** One video of the compact layout's hero album; 'tall' is a vertical phone clip. */
export interface PhVideoItem {
  title: string;
  text: string;
  src: string;
  poster?: string;
  duration?: string;
  shape: 'wide' | 'tall' | 'square';
}

/** A video group (one chip) of the hero album, e.g. 宿舍视频 or 课程视频. */
export interface PhVideoTab {
  label: string;
  icon: string;
  items: readonly PhVideoItem[];
}

export interface PhSchoolProfile {
  /**
   * The shorter layout first made for CIA (user request 2026-11-20): one album in the hero holding every
   * video and photo instead of separate gallery and video sections, one merged overview, course notes inside
   * each course, room photos under the room price list and a one-table 2027 calendar. It is the fixed layout
   * for every Philippine school (user decision 2026-11-21; CIA, EV, CPI and CPILS so far). Its styles are
   * ph-school-page-compact.css and ph-school-page-compact-tools.css, which each such school lists.
   */
  compactLayout?: boolean;
  /** Compact layout: the overview's key facts (location, size, management, courses …). */
  overviewFacts?: ReadonlyArray<{ icon: string; label: string; value: string }>;
  /** Compact layout: video groups, shown first in the hero album (the first video opens it). */
  videoTabs?: readonly PhVideoTab[];
  /**
   * Compact layout: a tag beside a course name, e.g. 读满12周送1次官方考试, and a line in its details when it has
   * `text`. The tag shows a gift icon unless it names another one (CIA's College Immersion uses flight_takeoff).
   */
  courseHighlights?: Readonly<Record<string, { badge: string; icon?: string; label?: string; text?: string }>>;
  /**
   * Compact layout: the first item of a room's photo album, keyed by room profile id. Only a video of exactly that room
   * type (user rule 2026-11-21); a video showing several room types stays in the hero album only.
   */
  roomVideos?: Readonly<Record<string, PhVideoItem>>;
  /** schoolCode of the content document, e.g. 'CIA'. */
  code: string;
  /** Short school name in headings, labels and the comparison image, e.g. 'CIA'. */
  name: string;
  /** Editor preview messages are '<prefix>-content-ready', '-preview', '-select' and '-located'. */
  previewPrefix: string;
  /** Database school name for prices, photos and the published content revision. */
  pricingSchoolName: string;
  /**
   * The school's id in the cross-school comparison (pages/school-compare/compare-schools.ts). When set,
   * the quote area links to /price-compare with the current plan; CIA leaves it out while locked.
   */
  schoolCompareId?: string;
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
  /**
   * School-only: list the courses in one colour-coded zone per study mode (EV: 半斯巴达 / 斯巴达), each
   * holding the course groups in order; courses match by id prefix and drop a trailing “（mode title）”.
   * Styles are in ph-school-page-options.css. CIA leaves it out.
   */
  courseModes?: ReadonlyArray<{ title: string; hint: string; idPrefix: string; strict?: boolean }>;
  studyModes: readonly PhStudyMode[];
  courseDetailGuides: readonly CourseDetailGuide[];
  scheduleColumns: readonly PhScheduleColumn[];
  /** Prices shown before the database and the published revision load. */
  initialCourseFees: CourseFee[];
  initialRoomFees: RoomFee[];
  initialRoomRateGroups: RoomRateGroup[];
  /** Optional short note under a room price group's cards, keyed by group title; a line break (\n) starts a new line (CPI: when Premium is open). */
  roomGroupNotes?: Readonly<Record<string, string>>;
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

/**
 * A school-only choice under 学生情况 that changes the price (CELLA: the 6+2／9+3 offer and the minor management fee).
 * The array and its items must stay the same objects between checks; a choice may hide itself and show a note.
 */
export interface PhExtraChoice {
  readonly label: string;
  readonly options: ReadonlyArray<{ value: unknown; label: string }>;
  readonly visible: boolean;
  readonly note: string;
  /** false: left out of 方案对比, whose plans compare standard prices (CELLA's 6+2 offer fixes the weeks). */
  readonly inComparison?: boolean;
  value: unknown;
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
  /** School-only choices after the standard conditions; CIA, EV and CPI have none. */
  readonly extraChoices?: readonly PhExtraChoice[];
  /** Called after a course or room is picked in the quote form (CELLA: a family package brings its own family room). */
  planOptionChanged?(): void;
}

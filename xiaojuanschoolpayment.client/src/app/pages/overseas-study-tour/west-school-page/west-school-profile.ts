// Content contract of the shared page template for schools outside the Philippines (Ireland, UK, ...).
// A school fills one WestSchoolProfile; WestSchoolPageComponent renders it in a fixed, sales-ordered layout:
// hero with price anchor → time-limited offers → why this school → campus choice → videos → courses and prices
// → accommodation → quote (projected by the school) → other fees → feature block (e.g. study & work) → student
// life → junior programme → calendar → who it suits → why 思达启航 → consultants → FAQ → closing call to action.
// An empty or missing optional block hides its section. Pure data: no Angular, DOM, storage or regex lookbehind.
import type { SidaConsultantName } from '../../../components/sida-consultants';

export interface WestImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface WestStat {
  value: string;
  label: string;
}

export interface WestFact {
  label: string;
  value: string;
}

export interface WestHero {
  eyebrow: string;
  title: string;
  englishName: string;
  subtitle: string;
  image: WestImage;
  /** Small photos beside the main image on wide screens. */
  photos: WestImage[];
  badges: string[];
  stats: WestStat[];
  price: { label: string; value: string; unit: string; note: string };
}

/** A time-limited offer; it disappears after `until` (YYYY-MM-DD, inclusive). */
export interface WestPromo {
  id: string;
  tag: string;
  title: string;
  text: string;
  points: string[];
  until: string;
  untilText: string;
}

export interface WestTrustItem {
  icon: string;
  title: string;
  text: string;
}

export interface WestCampus {
  id: string;
  name: string;
  englishName: string;
  tag: string;
  image: WestImage;
  photos: WestImage[];
  summary: string;
  facts: WestFact[];
  suits: string[];
  priceFrom: string;
}

export interface WestVideo {
  src: string;
  poster: string;
  title: string;
  text: string;
  duration: string;
  note?: string;
}

export interface WestCourseCard {
  id: string;
  name: string;
  englishName: string;
  badge?: string;
  text: string;
  facts: WestFact[];
  points: string[];
  priceFrom?: string;
}

export interface WestPriceRow {
  label: string;
  values: string[];
  highlight?: boolean;
}

/** A tab of the price table, e.g. one campus. */
export interface WestPriceTable {
  id: string;
  label: string;
  caption: string;
  columns: string[];
  rows: WestPriceRow[];
  note: string;
}

export interface WestFixedTable {
  title: string;
  columns: string[];
  rows: string[][];
  note: string;
}

export interface WestStayCard {
  id: string;
  campus: string;
  name: string;
  /** Leave out when no photo surely shows this accommodation; the card then shows `icon` instead. */
  image?: WestImage;
  icon?: string;
  photos: WestImage[];
  price: string;
  priceNote: string;
  tags: string[];
  points: string[];
}

export interface WestFeeRow {
  label: string;
  value: string;
  note?: string;
}

export interface WestActivity {
  title: string;
  label: string;
  text?: string;
  image?: WestImage;
  /** Material icon shown when there is no photo. */
  icon?: string;
}

export interface WestFeature {
  id: string;
  eyebrow: string;
  title: string;
  intro: string;
  points: Array<{ title: string; text: string }>;
  note: string;
  image?: WestImage;
  link?: { label: string; route: string };
}

export interface WestJunior {
  title: string;
  intro: string;
  points: string[];
  video?: WestVideo;
  note: string;
}

export interface WestCalendarRow {
  date: string;
  name: string;
  note?: string;
}

export interface WestFaq {
  q: string;
  a: string;
}

export interface WestAnchor {
  id: string;
  label: string;
  icon: string;
}

export interface WestSchoolProfile {
  /** Prefix of the page's element ids and the quote image school code. */
  schoolId: string;
  hero: WestHero;
  promos: WestPromo[];
  trust: { title: string; intro: string; items: WestTrustItem[]; badges: string[] };
  campuses?: { title: string; intro: string; items: WestCampus[] };
  videos: { title: string; intro: string; items: WestVideo[]; note: string };
  courses: {
    title: string;
    intro: string;
    items: WestCourseCard[];
    priceTitle: string;
    priceIntro: string;
    priceTables: WestPriceTable[];
    fixed?: WestFixedTable;
  };
  stay: { title: string; intro: string; items: WestStayCard[]; rules: string[] };
  quote: { title: string; intro: string; points: string[] };
  fees: { title: string; intro: string; rows: WestFeeRow[]; note: string };
  feature?: WestFeature;
  life: { title: string; intro: string; weekly: WestActivity[]; monthly: WestActivity[]; note: string };
  junior?: WestJunior;
  calendar: { title: string; intro: string; rows: WestCalendarRow[]; note: string };
  fit: { title: string; good: string[]; consider: string[] };
  why: { title: string; intro: string; items: Array<{ title: string; text?: string }> };
  consultants: { title: string; intro: string; names: SidaConsultantName[] };
  faq: WestFaq[];
  closing: { title: string; text: string };
  /** One line ending each school-content section: rules may change, the school's latest notice wins. */
  referenceNote: string;
  anchors: WestAnchor[];
}

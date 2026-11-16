// Format of /content/schools/<id>.json, which the WeChat mini program (../SiDaQiHangWeChat)
// renders as a native school page. Its docs/school-pages.md documents the same format and its
// `npm run school:check` validates a built file with the parser the mini program itself uses.
//
// Pure types only: scripts/export-mini-program-content.cjs bundles the page builders with esbuild
// and evaluates them in Node at build time.
//
// Compatibility: adding a block type, field or section is safe (older mini programs skip unknown
// block types and ignore unknown fields). Renaming or retyping a field needs a new schemaVersion.

export const SCHOOL_MINI_PAGE_SCHEMA_VERSION = 1;

export interface MiniImage {
  /** Site path such as /assets/cia/x.webp, or a full https:// URL. */
  src: string;
  title?: string;
  caption?: string;
}

export interface MiniFact {
  label: string;
  value: string;
  note?: string;
}

export interface MiniCard {
  /** Short marker shown before the title, such as "01", "B1" or "第一次游学". */
  badge?: string;
  title: string;
  subtitle?: string;
  text?: string;
  image?: string;
  /** Extra photos opened together with `image` in the full-screen viewer. */
  images?: string[];
  facts?: MiniFact[];
  points?: string[];
  note?: string;
}

/** A room type shown with its photos; the mini program adds the live price of every code in `codes`. */
export interface MiniRoomProfile extends MiniCard {
  /** Booking codes in `pricing` rooms, such as ["P-1"] or ["SR-1", "SR-2"]. */
  codes: string[];
}

export interface MiniDetailItem {
  title: string;
  subtitle?: string;
  /** Start unfolded (the website opens the same <details> by default). */
  open?: boolean;
  blocks: MiniBlock[];
}

/** Price parts are drawn by the mini program from `pricing` (live published content when available). */
export type MiniPricingPart = 'courses' | 'rooms' | 'stay' | 'promotions' | 'peakSeason' | 'localFees';

export type MiniBlock =
  | { type: 'text'; text: string; style?: 'lead' | 'note' | 'quote' }
  | { type: 'heading'; text: string; eyebrow?: string }
  | { type: 'facts'; items: MiniFact[] }
  | { type: 'list'; title?: string; style?: 'check' | 'cross' | 'dot'; items: string[] }
  | { type: 'cards'; layout?: 'grid' | 'list'; items: MiniCard[] }
  | { type: 'table'; title?: string; columns: string[]; rows: string[][] }
  | { type: 'albums'; albums: Array<{ title: string; description?: string; images: MiniImage[] }> }
  | { type: 'image'; image: MiniImage }
  | { type: 'videos'; items: Array<{ title: string; src: string; poster?: string; text?: string; points?: string[] }> }
  | { type: 'dates'; title?: string; groups: Array<{ title: string; dates: Array<{ day: string; text?: string; note?: string }> }> }
  | { type: 'details'; items: MiniDetailItem[] }
  | { type: 'link'; label: string; url: string; text?: string }
  | { type: 'consultants'; items: Array<{ name: string; title: string; text: string; phone: string; avatar: string; qr: string }> }
  | { type: 'rooms'; items: MiniRoomProfile[] }
  | { type: 'pricing'; part: MiniPricingPart };

/**
 * Standard parts of every school page. The mini program shows them in this order with fixed
 * titles, navigation labels and folding (its utils/school-template.ts), so every school looks
 * the same. Several sections may share a kind; they are merged under one heading.
 */
export type MiniSectionKind =
  | 'overview' // 30 秒看懂
  | 'fit' // 顾问点评：适合谁 / 不适合谁
  | 'courses' // 课程与价格
  | 'rooms' // 住宿与价格
  | 'fees' // 优惠与学杂费
  | 'packages' // 套餐价格（可选）
  | 'features' // 学校特色（可选）
  | 'campus' // 校园环境
  | 'videos' // 视频
  | 'calendar' // 假期、旺季与考试日期（折叠）
  | 'policies' // 学校规定（折叠）
  | 'reviews' // 学生评价
  | 'faq' // 常见问题
  | 'contact'; // 思达保障与联系顾问

export interface MiniSection {
  kind: MiniSectionKind;
  /** Optional heading inside the standard part, such as "CIA 课程怎么选？". */
  title?: string;
  eyebrow?: string;
  intro?: string;
  blocks: MiniBlock[];
}

/** Display subset of the shared school content configuration (cia-content-config.ts). */
export interface MiniPricingConfig {
  courses: Array<{ id: string; name: string; tuition: number; tuition2027?: number; schedule: string; suitable: string; note: string; enabled: boolean; sortOrder: number }>;
  rooms: Array<{ id: string; name: string; label: string; code: string; location: string; group: string; fee: number; note: string; enabled: boolean; sortOrder: number }>;
  localFees: Array<{ id: string; name: string; amount: number; secondaryAmount?: number; secondaryLabel?: string; billingRule: string; periodWeeks?: number; includeInTotal: boolean; note: string; enabled: boolean; sortOrder: number }>;
  quoteSettings: {
    registrationFee: number;
    shortStayRatios: Record<string, number>;
    peakSeasonFeePerWeek: number;
    peakSeasonRanges: Array<{ id: string; label: string; start: string; end: string; enabled?: boolean }>;
    promotions: Array<{ id: string; name: string; description: string; enabled: boolean; sortOrder: number }>;
    localFeeIntro: string;
    courseTableTitle: string;
    courseTableNote: string;
    groupClassNote: string;
    roomTableTitle: string;
    roomTableNote: string;
    stayPolicyTitle: string;
    stayPolicies: Array<{ label: string; value: string; note: string }>;
    extraNightRates: Array<{ label: string; amount: number }>;
  };
}

export interface MiniPricing {
  /** Database school name, used with /school/get-schools?name= to find the school id. */
  schoolName: string;
  /** schoolCode a published /school-content/<id>/published revision must carry to be used. */
  schoolCode: string;
  /** Column labels of the course price table; `tuition2027` is omitted for single-price schools. */
  labels: {
    tuition: string;
    tuition2027?: string;
    registrationNote: string;
    peakSeasonTitle: string;
    peakSeasonIntro: string;
    peakSeasonNote: string;
    localFeesTitle: string;
  };
  /** Published-content years the peak-season block lists, such as ["2027"]. */
  peakSeasonYears: string[];
  /** Built-in fallback, used until (or unless) a published revision is available. */
  defaults: MiniPricingConfig;
}

export interface SchoolMiniPage {
  schemaVersion: typeof SCHOOL_MINI_PAGE_SCHEMA_VERSION;
  id: string;
  /** Website page path, for "在官网查看" and sharing. */
  sitePath: string;
  navigationTitle: string;
  hero: { breadcrumb?: string; title: string; lead: string; tags: string[]; images: MiniImage[] };
  sections: MiniSection[];
  pricing?: MiniPricing;
}

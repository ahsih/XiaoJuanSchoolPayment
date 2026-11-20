// Sida Qihang consultants shown in school-page contact sections. One list for the website pages
// that use it and for every school page in the WeChat mini program
// (src/app/mini-program/shared-sections.ts). Pure data only.

import type { QuoteImageContactCard } from './quote-image-types';
export type SidaConsultantName = 'Jenny' | 'Lemon' | 'Perrin' | 'Iris' | 'Lisa';

export interface SidaConsultantMedia {
  avatarSrc: string;
  qrSrc: string;
}

/**
 * The one avatar and WeChat QR code of each consultant (user decision 2026-11-21): the user's branded
 * 思达启航 portraits and their fixed QR codes. Every page, quote image, the about page, the mini program and
 * study60 use these files; never point at another picture. `scripts/check-consultant-media.cjs` fails the
 * build when code does.
 */
export const SIDA_CONSULTANT_MEDIA: Record<SidaConsultantName, SidaConsultantMedia> = {
  Jenny: { avatarSrc: '/assets/contact/jenny-avatar.webp', qrSrc: '/assets/contact/jenny-wechat-qr.png' },
  Lemon: { avatarSrc: '/assets/contact/lemon-avatar.webp', qrSrc: '/assets/contact/lemon-wechat-qr.png' },
  Perrin: { avatarSrc: '/assets/contact/perrin-avatar.webp', qrSrc: '/assets/contact/penin-wechat-qr.png' },
  Iris: { avatarSrc: '/assets/contact/iris-portrait.webp', qrSrc: '/assets/contact/iris-wechat-qr.png' },
  Lisa: { avatarSrc: '/assets/contact/lisa-portrait.webp', qrSrc: '/assets/contact/lisa-wechat-qr.png' },
};

/**
 * Base order of the daily rotation (user decision 2026-11-21). Every list of consultant cards on the website and the
 * floating 免费咨询 panel start from it and turn by one place a day, so each consultant leads in turn.
 */
export const SIDA_CONSULTANT_DAILY_ORDER: readonly SidaConsultantName[] = ['Perrin', 'Lemon', 'Iris', 'Lisa', 'Jenny'];

/**
 * Turns a list by one place per calendar day in China time (UTC+8), so on day N the item at N mod length leads.
 * Exported for tests.
 */
export function rotateForDay<T>(items: readonly T[], timestamp: number): T[] {
  if (!items.length) return [];
  const chinaDay = Math.floor((timestamp + 8 * 60 * 60 * 1000) / (24 * 60 * 60 * 1000));
  const shift = chinaDay % items.length;
  return [...items.slice(shift), ...items.slice(0, shift)];
}

/** The given consultants in today's order: the base order (others last), turned by one place a day. */
export function consultantsInTodaysOrder<T>(items: readonly T[], nameOf: (item: T) => string, timestamp = Date.now()): T[] {
  const order: readonly string[] = SIDA_CONSULTANT_DAILY_ORDER;
  const rank = (item: T) => {
    const index = order.indexOf(nameOf(item));
    return index < 0 ? order.length : index;
  };
  return rotateForDay([...items].sort((a, b) => rank(a) - rank(b)), timestamp);
}

/** Today's place of each consultant (0 first), for a page whose cards are written out one by one (CSS order). */
export function consultantPlacesToday(timestamp = Date.now()): Record<SidaConsultantName, number> {
  const places = {} as Record<SidaConsultantName, number>;
  consultantsInTodaysOrder(SIDA_CONSULTANT_DAILY_ORDER, name => name, timestamp).forEach((name, index) => (places[name] = index));
  return places;
}

export interface SidaConsultant {
  title: string;
  name: SidaConsultantName;
  description: string;
  /** Left out for consultants who take enquiries by WeChat only (Iris and Lisa, user decision 2026-11-21). */
  phone?: string;
  phoneHref?: string;
  /** Card button: calls the consultant, or opens the floating panel on their QR code when there is no phone. */
  buttonLabel?: string;
  avatarSrc: string;
  qrSrc: string;
}

/** A consultant who also takes phone calls. */
export type CallableSidaConsultant = SidaConsultant & { phone: string; phoneHref: string; buttonLabel: string };

export const SIDA_PHILIPPINES_CONSULTANTS: SidaConsultant[] = [
  {
    title: '英爱留学规划',
    name: 'Jenny',
    description:
      '适合爱尔兰/英国本科、硕士、预科、半工半读，以及后续升学规划。',
    phone: '132 4982 7686',
    phoneHref: 'tel:13249827686',
    ...SIDA_CONSULTANT_MEDIA.Jenny,
    buttonLabel: '咨询英爱留学',
  },
  {
    title: '多国家方案规划',
    name: 'Lemon',
    description: '适合还没确定国家，想比较费用、时间、路线和升学路径。',
    phone: '132 9852 9856',
    phoneHref: 'tel:13298529856',
    ...SIDA_CONSULTANT_MEDIA.Lemon,
    buttonLabel: '咨询多国方案',
  },
  {
    title: '菲律宾与东南亚游学',
    name: 'Perrin',
    description: '适合菲律宾游学，以及马来西亚、新加坡、越南短期英语课程。',
    phone: '153 6765 9331',
    phoneHref: 'tel:15367659331',
    ...SIDA_CONSULTANT_MEDIA.Perrin,
    buttonLabel: '咨询游学方案',
  },
  {
    title: '菲律宾与东南亚游学',
    name: 'Iris',
    description: '菲律宾及东南亚游学咨询：学校匹配、课程与住宿搭配、游学报价。',
    ...SIDA_CONSULTANT_MEDIA.Iris,
    buttonLabel: '咨询游学方案',
  },
  {
    title: '菲律宾与东南亚游学',
    name: 'Lisa',
    description: '菲律宾及东南亚游学咨询：学校匹配、课程与住宿搭配、游学报价。',
    ...SIDA_CONSULTANT_MEDIA.Lisa,
    buttonLabel: '咨询游学方案',
  },
];

/**
 * Consultants with a phone number. Quote images and the mini program always print a phone line,
 * so they use this list (the mini program until its consultant card can hide the call button).
 */
export const SIDA_CALLABLE_CONSULTANTS: CallableSidaConsultant[] = SIDA_PHILIPPINES_CONSULTANTS.filter(
  (consultant): consultant is CallableSidaConsultant => !!consultant.phone && !!consultant.phoneHref && !!consultant.buttonLabel,
);

/** What a quote contact card needs from a consultant (the shared list, or a page profile's copy of it). */
export type QuoteCardConsultant = Pick<SidaConsultant, 'avatarSrc' | 'qrSrc'> & { name: string; title?: string; phone?: string };

/**
 * The contact card of a quote image (layoutVersion 2): the consultant chosen in the quote. Iris and Lisa have no
 * phone, so their card shows WeChat only.
 */
export function quoteContactCard(chosen: QuoteCardConsultant): QuoteImageContactCard {
  return {
    consultant: {
      name: chosen.name,
      title: chosen.title,
      phone: chosen.phone ?? '',
      avatarSrc: chosen.avatarSrc,
      qrSrc: chosen.qrSrc,
    },
  };
}

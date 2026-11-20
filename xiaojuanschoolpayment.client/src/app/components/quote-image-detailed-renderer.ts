// The approved full-detail ("cia-detailed") quote image, drawn on any 2D canvas context.
// QuoteImageDownloadButtonComponent uses it with a browser canvas; the WeChat mini program bundles
// it (scripts/sync-quote-engine.mjs in SiDaQiHangWeChat) and draws on a <canvas type="2d">, so the
// website and the mini program produce the same image. Keep this file free of Angular and DOM types.
import type {
  QuoteImageCardData,
  QuoteImageContact,
  QuoteImageContactCard,
  QuoteImageLocalFeeItem,
  QuoteImagePaymentItem,
} from './quote-image-types';

/** Logical width of every quote image; heights depend on the quote's contents. */
export const QUOTE_IMAGE_WIDTH = 1032;

/** An image the canvas can draw: a browser HTMLImageElement or a mini program canvas image. */
export interface QuoteCanvasImage {
  readonly width: number;
  readonly height: number;
  readonly naturalWidth?: number;
  readonly naturalHeight?: number;
}

export interface QuoteTextMetrics {
  readonly width: number;
  readonly actualBoundingBoxAscent?: number;
  readonly actualBoundingBoxDescent?: number;
}

/** The subset of CanvasRenderingContext2D the renderer uses. */
export interface QuoteCanvasContext<TImage = QuoteCanvasImage> {
  font: string;
  fillStyle: unknown;
  strokeStyle: unknown;
  lineWidth: number;
  textAlign: string;
  fillRect(x: number, y: number, width: number, height: number): void;
  fillText(text: string, x: number, y: number): void;
  measureText(text: string): QuoteTextMetrics;
  beginPath(): void;
  closePath(): void;
  moveTo(x: number, y: number): void;
  lineTo(x: number, y: number): void;
  quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void;
  arc(x: number, y: number, radius: number, startAngle: number, endAngle: number): void;
  fill(): void;
  stroke(): void;
  clip(): void;
  save(): void;
  restore(): void;
  translate(x: number, y: number): void;
  setLineDash(segments: number[]): void;
  drawImage(image: TImage, dx: number, dy: number, dw: number, dh: number): void;
  drawImage(image: TImage, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number): void;
}

type Context<TImage> = QuoteCanvasContext<TImage>;
/** Helpers that never draw images accept any context. */
type TextContext = QuoteCanvasContext<never>;
type CanvasImage = QuoteCanvasImage;

/** Mobile canvases (including iOS WKWebView and WeChat) have conservative size budgets; never crop rows. */
export function quoteCanvasScale(width: number, height: number, requested: number, mobile: boolean): number {
  const maxSide = mobile ? 4096 : 16384;
  const maxPixels = mobile ? 6_000_000 : 16_000_000;
  return Math.min(requested, mobile ? 2 : 3, maxSide / width, maxSide / height,
    Math.sqrt(maxPixels / (width * height)));
}

const imageWidth = (image: CanvasImage) => image.naturalWidth || image.width;
const imageHeight = (image: CanvasImage) => image.naturalHeight || image.height;

/** Browsers report glyph bounds; some embedded canvases report only the width. */
const fontSize = (font: string) => Number(/(\d+(?:\.\d+)?)px/.exec(font)?.[1] ?? 16);
const ascentOf = (metrics: QuoteTextMetrics, font: string) =>
  metrics.actualBoundingBoxAscent ?? fontSize(font) * 0.82;
const descentOf = (metrics: QuoteTextMetrics, font: string) =>
  metrics.actualBoundingBoxDescent ?? fontSize(font) * 0.12;

export function detailedGrid(quote: QuoteImageCardData) {
  const aligned = quote.fullFeeDetails && quote.localFeeTableLayout === 'web';
  return { noteBoundary: aligned ? 556 : 420, amountRight: aligned ? 546 : 400,
    amountWidth: aligned ? 290 : 150, noteLeft: aligned ? 566 : 438,
    noteWidth: aligned ? 416 : 532 };
}

function isMonetaryDiscount(row: QuoteImagePaymentItem): boolean {
  return /^[-−]\s*\d/.test(row.amount.trim()) || /^\d+(?:\.\d+)?折$/.test(row.amount.trim());
}

/** Full-detail images size every section to its rows; this measures those rows. */
export function measureDetailedQuoteLayout(context: TextContext, quote: QuoteImageCardData) {
  const lineCount = (text: string, width: number, font: string): number => {
    context.font = font;
    return Math.max(1, wrapCanvasText(context, text, width, 1000).length);
  };
  const font = (size: number, weight: number) => `${weight} ${size}px "Microsoft YaHei", "PingFang SC", Arial, sans-serif`;
  const grid = detailedGrid(quote);
  const payments = quote.paymentItems;
  const hasItemDetails = payments.some(row => row.detailTitle);
  const paymentDetails = payments.map(row => paymentDetailLines(context, quote, row));
  const paymentProjects = payments.map(row => paymentProjectLines(context, row));
  const paymentHeights = payments.map((row, index) => Math.max(
    hasItemDetails ? 54 : Math.floor(358 / Math.max(1, payments.length)),
    paymentDetails[index].reduce((height, line) => height + line.lineHeight, 0) + 18,
    paymentProjects[index].reduce((height, line) => height + line.lineHeight, 0) + 18,
  ));
  const locals = quote.localFeeItems ?? [];
  const webTable = quote.localFeeTableLayout === 'web';
  const localNoteHeight = webTable && (!quote.compactDetailedSections || !!quote.localFeeNote.trim())
    ? lineCount(quote.localFeeNote, 932, font(13, 400)) * 18 + 20 : 0;
  const localHeights = locals.map(row => webTable ? Math.max(54,
    lineCount(row.label, 170, font(14, 700)) * 18 + 20,
    lineCount(row.unit, 120, font(13, 400)) * 18 + 20,
    lineCount(row.quantity, 36, font(14, 700)) * 18 + 20,
    lineCount(row.amount, 104, font(15, 850)) * 18 + 20,
    lineCount(row.note, 416, font(13, 400)) * 18 + 20,
  ) : Math.max(54,
    lineCount(detailedLocalNote(quote, row), 532, font(15, 400)) * 18 + 20,
    lineCount(row.label, 174, font(16, 700)) * 19 + 18,
  ));
  const optionalHeights = (quote.optionalFeeItems ?? []).map(row => Math.max(48,
    lineCount(row.note, grid.noteWidth, font(12, 400)) * 15 + 18,
    lineCount(row.label, 186, font(14, 850)) * 17 + 18,
    lineCount(row.amount, row.cnyAmount ? grid.amountWidth : 160, font(14, 900)) * 17 + 18
      + (row.cnyAmount ? lineCount(row.cnyAmount, grid.amountWidth, font(12, 400)) * 16 : 0),
  ));
  const importantNotes = quoteFooterNotes(quote);
  const noteHeights = importantNotes.map(note => {
    const renderedNote = quote.footerNotesVerbatim ? note : `✓ ${note}`;
    return Math.max(27, lineCount(renderedNote, 820, font(13, isDateMismatchNote(note) ? 700 : 400)) * 18 + 9);
  });
  const benefitsHeight = Math.max(56, ...(quote.benefitItems?.slice(0, 4) ?? []).map(item =>
    44 + (lineCount(item.text, 206, font(12, 400)) - 1) * 15 + 8));
  const alumniHeight = quote.hideAlumniBenefit
    ? 0
    : Math.max(36, lineCount(quote.alumniBenefitItems?.[0]?.text ?? '', 770, font(16, 400)) * 20 + 16);
  const serviceHeight = 47 + benefitsHeight + (quote.hideAlumniBenefit ? 12 : 8 + alumniHeight + 12);
  const sum = (values: number[]) => values.reduce((total, value) => total + value, 0);
  const footerHeight = Math.max(56, sum(noteHeights) + 24);
  const totalNoteLines = quote.expandTotalNote ? expandedTotalNoteLines(context, quote) : [];
  const totalHeight = 64 + Math.max(0, totalNoteLines.length - 1) * 16;
  const conditionLines = quoteConditionLines(context, quote);
  return {
    totalNoteLines, totalHeight, conditionLines,
    // layoutVersion 2: the conditions band under the heading; the title card also leaves room under the QR code.
    headerExtra: headerQrOf(quote)
      ? qrTitleCardHeight(conditionLines.length) - 122
      : conditionLines.length ? 20 + conditionLines.length * 20 : 0,
    paymentHeights, paymentDetails, paymentProjects, localHeights, optionalHeights, noteHeights, localNoteHeight,
    importantNotes, footerHeight, benefitsHeight, alumniHeight, serviceHeight,
    paymentExtra: (hasItemDetails ? sum(paymentHeights) - 358 : Math.max(0, sum(paymentHeights) - 358)) + totalHeight - 64,
    localExtra: Math.max(quote.compactDetailedSections ? -622 : 0, localNoteHeight + sum(localHeights) + 64 + 6 + sum(optionalHeights) + 14 - 622),
    notesExtra: footerHeight - 106 + serviceHeight - 174,
  };
}

/** Logical height of a detailed quote image (multiply by the canvas scale for pixels). */
export function detailedQuoteImageHeight(context: TextContext, quote: QuoteImageCardData): number {
  const fullLayout = quote.fullFeeDetails ? measureDetailedQuoteLayout(context, quote) : undefined;
  return 1764 + (fullLayout?.paymentExtra ?? 0) + (fullLayout?.localExtra ?? 0) + (fullLayout?.notesExtra ?? 0)
    + (fullLayout?.headerExtra ?? 0);
}

const CONDITIONS_LABEL = '报价条件：';
const CONDITIONS_FONT = '600 13px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';

/** layoutVersion 2 with a chosen consultant: the QR code goes in the title card. */
export function headerQrOf(quote: QuoteImageCardData): QuoteImageContactCard | undefined {
  return quote.layoutVersion === 2 ? quote.contactCard : undefined;
}

/** The 报价条件 band sits in the middle column, before the QR code, when there is one. */
function conditionsBandWidth(quote: QuoteImageCardData): number {
  return headerQrOf(quote) ? HEADER_QR_LEFT - 12 - (HEADER_TEXT_LEFT - 14) : 956;
}

/** Baselines of the layoutVersion 2 title card's middle column, and the top of its 报价条件 band. */
const QR_TITLE = { heading: 128, info: 165, band: 179 };

/** Height of the layoutVersion 2 title card (it starts at y 80) for `lines` wrapped 报价条件 lines. */
function qrTitleCardHeight(lines: number): number {
  const textBottom = lines ? QR_TITLE.band + lines * 20 + 12 : QR_TITLE.info + 6;
  return Math.max(textBottom + 12 - 80, HEADER_QR_HEIGHT + 12);
}

/** layoutVersion 2: the wrapped 报价条件 lines under the heading (empty for other images). */
function quoteConditionLines(context: TextContext, quote: QuoteImageCardData): string[] {
  if (quote.layoutVersion !== 2 || !quote.quoteConditions?.length) return [];
  context.font = '800 13px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
  const width = conditionsBandWidth(quote) - 36 - context.measureText(CONDITIONS_LABEL).width;
  context.font = CONDITIONS_FONT;
  return quote.quoteConditions.flatMap(text => wrapCanvasText(context, text, width, 1000));
}

/** layoutVersion 2: `咨询顾问：Perrin · 电话/微信 153 6765 9331`; only the name for WeChat-only consultants. */
export function quoteConsultantLine(card: QuoteImageContactCard): string {
  const { name, phone } = card.consultant;
  return `咨询顾问：${name}${phone.trim() ? ` · 电话/微信 ${phone.trim()}` : ''}`;
}

/**
 * The layoutVersion 2 title card (user review 2026-11-21): the school photo on the left, the heading, date, consultant
 * and conditions in the middle, and the chosen consultant's WeChat QR code on the right with 扫码加微信咨询 under it.
 * The detailed and the plan-compare images share these columns.
 */
export const HEADER_PHOTO_LEFT = 24;
export const HEADER_PHOTO_WIDTH = 244;
export const HEADER_TEXT_LEFT = 296;
export const HEADER_QR_SIZE = 106;
export const HEADER_QR_LEFT = 902;
/** Height of the QR code plus its caption, from the top of the box. */
export const HEADER_QR_HEIGHT = HEADER_QR_SIZE + 22;

/**
 * Draws the layoutVersion 2 QR code box at (HEADER_QR_LEFT, top). `qr` may be missing (an image that did not
 * load, or a host that does not load it); the box then says 微信二维码 instead.
 */
export function drawHeaderQr<TImage extends CanvasImage>(
  context: NoInfer<Context<TImage>>,
  qr: TImage | undefined,
  top: number,
): void {
  const size = HEADER_QR_SIZE;
  const center = HEADER_QR_LEFT + size / 2;
  const font = (px: number, weight: number) => `${weight} ${px}px "Microsoft YaHei", "PingFang SC", Arial, sans-serif`;
  drawRoundedRect(context, HEADER_QR_LEFT, top, size, size, 6, '#ffffff', '#dce4e7', 1);
  context.textAlign = 'center';
  if (qr) {
    context.drawImage(qr, HEADER_QR_LEFT + 3, top + 3, size - 6, size - 6);
  } else {
    context.font = font(12, 400);
    context.fillStyle = '#64748b';
    context.fillText('微信二维码', center, top + size / 2 + 4);
  }
  context.font = font(12, 800);
  context.fillStyle = '#06422e';
  context.fillText('扫码加微信咨询', center, top + size + 16);
  context.textAlign = 'left';
}

export function detailedLocalNote(quote: QuoteImageCardData, row: QuoteImageLocalFeeItem): string {
  if (quote.localFeeTableLayout === 'web') return row.note;
  return quote.fullFeeDetails ? `计费：${row.unit} × ${row.quantity}；${row.note}` : row.note;
}

function expandedTotalNoteLines(context: TextContext, quote: QuoteImageCardData): string[] {
  const rate = quote.conversionRates
    ? `参考汇率：1美元 ≈ ${quote.conversionRates.usdToCny.toLocaleString('zh-CN', { maximumFractionDigits: 6 })}元人民币` : '';
  context.font = '400 12px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
  return [rate, ...withoutExchangeNote(quote.totalNote ?? '').split('\n')].filter(Boolean)
    .flatMap(text => wrapCanvasText(context, text, detailedGrid(quote).noteWidth, 1000));
}

function isDateMismatchNote(note: string): boolean {
  return /课程.*住宿.*日期.*不(?:完全)?一致/.test(note);
}

function isGeneralConfirmation(note: string): boolean {
  return /^(?:本报价)?最终以.*(?:价格|空房).*为准[。.]?$/.test(note.trim());
}

/** Splits after each 。 like split(/(?<=。)/), without lookbehind (older iOS WeChat cannot parse it). */
function sentences(text: string): string[] {
  const parts = text.split('。');
  return parts.map((part, index) => index < parts.length - 1 ? part + '。' : part);
}

export function withoutExchangeNote(text: string): string {
  return sentences(text).filter(sentence =>
    !(/汇率/.test(sentence) && /^(?:人民币|按最新参考汇率|参考汇率|汇率日期|暂按备用汇率|最终以支付当日汇率)/.test(sentence.trim())),
  ).join('').trim();
}

export function quoteFooterNotes(quote: QuoteImageCardData): string[] {
  const source = quote.importantNotes?.length ? quote.importantNotes : [quote.note];
  const prepared = quote.footerNotesVerbatim
    ? source.map(note => note.trim())
    : source.map(note => withoutExchangeNote(note));
  const notes = [...new Set(prepared.filter(note => note && !isGeneralConfirmation(note)))];
  const rateDate = quote.layoutVersion === 2
    ? quote.conversionRates?.date?.replace(/-/g, '/')
    : quote.conversionRates?.date;
  const exchangeNote = `${quote.conversionRates ? (rateDate ? `汇率日期：${rateDate}；` : '最新参考汇率；') : ''}人民币金额按参考汇率估算，最终以实际兑换或支付汇率为准。`;
  return [
    ...notes.filter(note => isDateMismatchNote(note)),
    ...notes.filter(note => !isDateMismatchNote(note)),
    ...(quote.appendExchangeRateNote === false ? [] : [exchangeNote]),
    ...(quote.appendFinalConfirmationNote === false
      ? []
      : [quote.finalConfirmationText ?? '最终以学校价格、空房及优惠确认为准。']),
  ];
}

function paymentDetailLines(context: TextContext, quote: QuoteImageCardData, row: QuoteImagePaymentItem) {
  const sections = row.detailTitle ? [
    { text: row.detailSubtitle, size: 13, weight: 400, lineHeight: 20, color: '#64748b' },
    { text: row.note, size: 14, weight: 400, lineHeight: 20, color: '#334155' },
  ] : [{ text: row.note ?? '—', size: 17, weight: 400, lineHeight: 20, color: '#475569' }];
  return sections.flatMap(section => {
    if (!section.text) return [];
    const font = `${section.weight} ${section.size}px "Microsoft YaHei", "PingFang SC", Arial, sans-serif`;
    context.font = font;
    return wrapCanvasText(context, section.text, detailedGrid(quote).noteWidth, 1000)
      .map(text => ({ text, font, lineHeight: section.lineHeight, color: section.color }));
  });
}

function paymentProjectLines(context: TextContext, row: QuoteImagePaymentItem) {
  const sections = row.detailTitle ? [
    { text: row.label, size: 12, weight: 600, lineHeight: 16, color: '#64748b' },
    { text: row.detailTitle, size: 15, weight: 750, lineHeight: 20, color: '#14233e' },
  ] : [{ text: row.label, size: 18, weight: 700, lineHeight: 21, color: '#14233e' }];
  return sections.flatMap(section => {
    const font = `${section.weight} ${section.size}px "Microsoft YaHei", "PingFang SC", Arial, sans-serif`;
    context.font = font;
    return wrapCanvasText(context, section.text, 170, 1000)
      .map(text => ({ text, font, lineHeight: section.lineHeight, color: section.color }));
  });
}

/**
 * Draws the full-detail quote. `logo` is the high-resolution brand artwork
 * (/assets/sida-qihang-navbar-logo.jpg) when `useHighResolutionBrandHeader(quote)` is true.
 */
export function drawDetailedQuoteImage<TImage extends CanvasImage>(
  context: NoInfer<Context<TImage>>,
  quote: QuoteImageCardData,
  assets: {
    logo: TImage;
    hero: TImage;
    consultants: Array<{
      consultant: QuoteImageContact;
    }>;
    /** QR code of `quote.contactCard.consultant` (layoutVersion 2); the card is drawn without it when missing. */
    contactQr?: TImage;
  },
  width: number,
  height: number,
): void {
  const green = '#06422e';
  const orange = '#f25518';
  const navy = '#14233e';
  const border = '#dce4e7';
  const padding = 18;
  const contentWidth = width - padding * 2;
  const fullLayout = quote.fullFeeDetails ? measureDetailedQuoteLayout(context, quote) : undefined;
  const grid = detailedGrid(quote);

  const drawSectionNumber = (number: string, title: string, y: number): void => {
    drawRoundedRect(context, 36, y - 23, 32, 28, 5, green);
    context.font = '900 17px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
    context.fillStyle = '#ffffff';
    context.textAlign = 'center';
    context.fillText(number, 52, y - 4);
    context.textAlign = 'left';
    context.font = '900 23px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
    context.fillStyle = green;
    context.fillText(title, 78, y - 3);
  };

  const drawTableText = (
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    color = navy,
    font = '600 15px "Microsoft YaHei", "PingFang SC", Arial, sans-serif',
    lines = 1,
    lineHeight = 20,
  ): void => {
    drawWrappedText(context, text, x, y, maxWidth, lineHeight, font, color, lines);
  };

  const drawCenteredTableText = (
    text: string,
    x: number,
    top: number,
    rowHeight: number,
    maxWidth: number,
    color = navy,
    font = '600 15px "Microsoft YaHei", "PingFang SC", Arial, sans-serif',
    maxLines = 1,
    lineHeight = 20,
  ): void => {
    context.font = font;
    context.fillStyle = color;
    const wrappedLines = wrapCanvasText(context, text, maxWidth, maxLines);
    if (wrappedLines.length === 0) {
      return;
    }

    const metrics = wrappedLines.map((line) => context.measureText(line));
    const ascent = Math.max(...metrics.map((metric) => ascentOf(metric, font) || 0));
    const descent = Math.max(...metrics.map((metric) => descentOf(metric, font) || 0));
    const textHeight = ascent + descent + (wrappedLines.length - 1) * lineHeight;
    const firstBaseline = top + (rowHeight - textHeight) / 2 + ascent;

    wrappedLines.forEach((line, index) => {
      context.fillText(line, x, firstBaseline + index * lineHeight);
    });
  };

  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, width, height);

  drawQuoteBrandHeader(context, quote, assets.logo, 252, 4);

  const headerExtra = fullLayout?.headerExtra ?? 0;
  const headerQr = headerQrOf(quote);
  if (headerQr) {
    const cardHeight = 122 + headerExtra;
    drawRoundedRect(context, padding, 80, contentWidth, cardHeight, 10, '#ffffff', border, 1);
    drawRoundedImageCover(context, assets.hero, HEADER_PHOTO_LEFT, 86, HEADER_PHOTO_WIDTH, cardHeight - 12, 8);
    drawHeaderQr(context, assets.contactQr, 80 + (cardHeight - HEADER_QR_HEIGHT) / 2);
    const left = HEADER_TEXT_LEFT;
    context.font = '950 31px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
    context.fillStyle = green;
    context.fillText(quote.headingText ?? `${quote.schoolCode}${quote.title}报价单`, left, QR_TITLE.heading);
    context.fillStyle = orange;
    context.fillRect(left, QR_TITLE.heading + 11, 42, 3);
    const quoteDate = quote.studentItems[0];
    context.font = '700 13px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
    context.fillStyle = '#64748b';
    context.fillText(
      [quoteDate ? `${quoteDate.label}：${quoteDate.value}` : '', quoteConsultantLine(headerQr)].filter(Boolean).join('  ·  '),
      left,
      QR_TITLE.info,
    );
    if (fullLayout?.conditionLines.length) {
      drawRoundedRect(context, left - 14, QR_TITLE.band, conditionsBandWidth(quote), fullLayout.conditionLines.length * 20 + 12, 6, '#f7faf8');
      context.font = '800 13px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
      context.fillStyle = green;
      context.fillText(CONDITIONS_LABEL, left, QR_TITLE.band + 21);
      const textLeft = left + context.measureText(CONDITIONS_LABEL).width;
      context.font = CONDITIONS_FONT;
      context.fillStyle = '#334155';
      fullLayout.conditionLines.forEach((line, index) => context.fillText(line, textLeft, QR_TITLE.band + 21 + index * 20));
    }
  } else {
    drawRoundedRect(context, padding, 80, contentWidth, 122 + headerExtra, 10, '#ffffff', border, 1);
    context.font = '950 31px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
    context.fillStyle = green;
    context.fillText(quote.headingText ?? `${quote.schoolCode}${quote.title}报价单`, 54, 140);
    if (!quote.subtitle) {
      context.fillStyle = orange;
      context.fillRect(54, 151, 42, 3);
    }
    if (quote.subtitle) {
      drawWrappedText(
        context,
        quote.subtitle,
        54,
        160,
        510,
        20,
        '650 13px "Microsoft YaHei", "PingFang SC", Arial, sans-serif',
        navy,
        1,
      );
    }
    const admissionDate = quote.studentItems[0];
    const headerContact = assets.consultants[0]?.consultant;
    context.font = '700 13px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
    context.fillStyle = '#64748b';
    if (admissionDate) {
      context.fillText(`${admissionDate.label}：${admissionDate.value}`, 54, 180);
    }
    if (headerContact?.phone.trim()) {
      context.fillText(`·  电话/微信：${headerContact.phone.replace(/\s/g, '')}`, 258, 180);
    }
    drawRoundedImageCover(context, assets.hero, 590, 86, 422, 106, 10);
    if (fullLayout?.conditionLines.length) {
      drawRoundedRect(context, 36, 200, conditionsBandWidth(quote), fullLayout.conditionLines.length * 20 + 12, 6, '#f7faf8');
      context.font = '800 13px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
      context.fillStyle = green;
      context.fillText(CONDITIONS_LABEL, 50, 221);
      const textLeft = 50 + context.measureText(CONDITIONS_LABEL).width;
      context.font = CONDITIONS_FONT;
      context.fillStyle = '#334155';
      fullLayout.conditionLines.forEach((line, index) => context.fillText(line, textLeft, 221 + index * 20));
    }
  }

  context.save();
  context.translate(0, headerExtra);

  drawRoundedRect(context, padding, 212, contentWidth, 510 + (fullLayout?.paymentExtra ?? 0), 9, '#ffffff', border, 1);
  drawSectionNumber('01', (quote.paymentSectionTitle ?? '学校费用明细').replace('（到校前支付给学校的费用）', ''), 246);
  const paymentColumns = [36, 236, grid.noteBoundary, 992];
  context.fillStyle = '#f3f6f4';
  context.fillRect(36, 262, 956, 36);
  // layoutVersion 2: every amount already names its currency, so the heading does not repeat it.
  const amountHeading = quote.layoutVersion === 2 ? '金额' : `金额（${quote.paymentCurrencyLabel ?? '美元'}）`;
  ['项目', amountHeading, '说明'].forEach((label, index) => {
    const centers = [136, (236 + grid.noteBoundary) / 2, (grid.noteBoundary + 992) / 2];
    context.font = '850 17px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
    context.fillStyle = green;
    context.textAlign = 'center';
    context.fillText(label, centers[index], 286);
  });
  context.textAlign = 'left';
  const paymentRows = fullLayout ? quote.paymentItems : quote.paymentItems.slice(0, 7);
  const paymentRowHeights = [52, 74, 52, 60, 58, 62];
  const compactPaymentRowHeight = paymentRows.length > 0 && paymentRows.length !== 6
    ? Math.min(150, Math.floor(358 / paymentRows.length))
    : 0;
  let paymentRowTop = 298;
  paymentRows.forEach((row, index) => {
    const rowHeight = fullLayout?.paymentHeights[index] ?? (compactPaymentRowHeight || paymentRowHeights[index] || 46);
    const top = paymentRowTop;
    if (row.subtotal) {
      context.fillStyle = '#f1f7f3';
      context.fillRect(36, top, 956, rowHeight);
    } else if (index % 2 === 1) {
      context.fillStyle = '#fbfcfc';
      context.fillRect(36, top, 956, rowHeight);
    }
    drawSolidLine(context, 36, top, 992, top, '#e1e6e8');
    context.textAlign = 'center';
    if (row.subtotal) {
      drawCenteredTableText(row.label, 136, top, rowHeight, 170, green, '850 17px "Microsoft YaHei", "PingFang SC", Arial, sans-serif', 2, 21);
    } else if (fullLayout && row.detailTitle) {
      const lines = fullLayout.paymentProjects[index];
      let lineTop = top + (rowHeight - lines.reduce((sum, line) => sum + line.lineHeight, 0)) / 2;
      for (const line of lines) {
        context.font = line.font;
        context.fillStyle = line.color;
        const metrics = context.measureText(line.text);
        const ascent = ascentOf(metrics, line.font);
        const descent = descentOf(metrics, line.font);
        context.fillText(line.text, 136, lineTop + (line.lineHeight - ascent - descent) / 2 + ascent);
        lineTop += line.lineHeight;
      }
    } else {
      drawCenteredTableText(row.label, 136, top, rowHeight, 170, fullLayout ? navy : row.accent ? orange : navy, '700 18px "Microsoft YaHei", "PingFang SC", Arial, sans-serif', 2, 21);
    }
    context.textAlign = 'right';
    drawCenteredTableText(row.amount, grid.amountRight, top, rowHeight, grid.amountWidth, (fullLayout ? isMonetaryDiscount(row) : row.accent) ? orange : navy, '850 19px "Microsoft YaHei", "PingFang SC", Arial, sans-serif');
    context.textAlign = 'left';
    if (fullLayout && row.detailTitle) {
      const lines = fullLayout.paymentDetails[index];
      const textHeight = lines.reduce((sum, line) => sum + line.lineHeight, 0);
      let lineTop = top + (rowHeight - textHeight) / 2;
      for (const line of lines) {
        context.font = line.font;
        context.fillStyle = line.color;
        const metrics = context.measureText(line.text);
        const ascent = ascentOf(metrics, line.font);
        const descent = descentOf(metrics, line.font);
        context.fillText(line.text, grid.noteLeft, lineTop + (line.lineHeight - ascent - descent) / 2 + ascent);
        lineTop += line.lineHeight;
      }
    } else {
      drawCenteredTableText(row.note ?? '—', grid.noteLeft, top, rowHeight, grid.noteWidth, fullLayout ? '#475569' : row.accent ? orange : '#334155', '400 17px "Microsoft YaHei", "PingFang SC", Arial, sans-serif', fullLayout ? 1000 : 3, 20);
    }
    paymentRowTop += rowHeight;
  });
  paymentColumns
    .slice(1, -1)
    .forEach((x) =>
      drawSolidLine(context, x, 262, x, paymentRowTop, '#e1e6e8'),
    );
  drawSolidLine(context, 36, paymentRowTop, 992, paymentRowTop, '#e1e6e8');
  context.fillStyle = '#fffaf5';
  const schoolTotalHeight = fullLayout?.totalHeight ?? 64;
  context.fillRect(36, paymentRowTop, 956, schoolTotalHeight);
  context.fillStyle = orange;
  context.fillRect(36, paymentRowTop, 5, schoolTotalHeight);
  drawSolidLine(context, 236, paymentRowTop, 236, paymentRowTop + schoolTotalHeight, '#eadfd6');
  drawSolidLine(context, grid.noteBoundary, paymentRowTop, grid.noteBoundary, paymentRowTop + schoolTotalHeight, '#eadfd6');
  context.textAlign = 'center';
  context.font = '900 16px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
  context.fillStyle = green;
  context.fillText(quote.totalLabel, 136, paymentRowTop + 27);
  context.font = '700 12px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
  context.fillStyle = '#64748b';
  context.fillText(quote.totalIncludedLabel ?? '优惠已计入', 136, paymentRowTop + 48);
  let totalFontSize = 27;
  context.font = `950 ${totalFontSize}px "Microsoft YaHei", "PingFang SC", Arial, sans-serif`;
  while (context.measureText(quote.totalUsd).width > grid.amountWidth && totalFontSize > 16) {
    totalFontSize -= 1;
    context.font = `950 ${totalFontSize}px "Microsoft YaHei", "PingFang SC", Arial, sans-serif`;
  }
  context.fillStyle = orange;
  context.textAlign = 'right';
  context.fillText(quote.totalUsd, grid.amountRight, paymentRowTop + 39);
  context.textAlign = 'left';
  context.font = '900 17px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
  const schoolRate = fullLayout && quote.paymentCurrencyLabel !== '人民币' && quote.conversionRates
    ? `参考汇率：1美元 ≈ ${quote.conversionRates.usdToCny.toLocaleString('zh-CN', { maximumFractionDigits: 6 })}元人民币`
    : '';
  const totalNote = [schoolRate, fullLayout ? withoutExchangeNote(quote.totalNote ?? '') : quote.totalNote ?? ''].filter(Boolean).join('；');
  context.fillText(quote.totalCny, grid.noteLeft, paymentRowTop + (totalNote ? 27 : 38));
  if (quote.expandTotalNote && fullLayout) {
    fullLayout.totalNoteLines.forEach((line, index) => drawTableText(line, grid.noteLeft, paymentRowTop + 49 + index * 16, grid.noteWidth, '#64748b', '400 12px "Microsoft YaHei", "PingFang SC", Arial, sans-serif', 1, 16));
  } else {
    drawTableText(totalNote, grid.noteLeft, paymentRowTop + 49, grid.noteWidth, '#64748b', '400 12px "Microsoft YaHei", "PingFang SC", Arial, sans-serif', 1, 16);
  }

  context.save();
  context.translate(0, fullLayout?.paymentExtra ?? 0);
  drawRoundedRect(context, padding, 734, contentWidth, 708 + (fullLayout?.localExtra ?? 0), 9, '#ffffff', border, 1);
  drawSectionNumber('02', quote.localFeeTitle ?? '到校后学杂费明细参考（学校及相关部门收取）', 768);
  const webTable = !!fullLayout && quote.localFeeTableLayout === 'web';
  const localColumns = webTable ? [36, 236, 376, 432, 556, 992] : [36, 236, 420, 992];
  const localHeaderTop = 784 + (fullLayout?.localNoteHeight ?? 0);
  if (webTable && fullLayout!.localNoteHeight > 0) {
    context.fillStyle = '#fffaf5';
    context.fillRect(36, 780, 956, fullLayout!.localNoteHeight - 8);
    drawTableText(quote.localFeeNote, 48, 799, 932, '#475569', '400 13px "Microsoft YaHei", "PingFang SC", Arial, sans-serif', 1000, 18);
  }
  context.fillStyle = '#f3f6f4';
  context.fillRect(36, localHeaderTop, 956, 36);
  const localHeaders = webTable
    ? ['费用明细', '计费参考', '数量', '预估小计', '备注']
    : ['项目', '本次预计金额（比索）', '简要说明'];
  localHeaders.forEach((label, index) => {
    context.font = '850 16px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
    context.fillStyle = green;
    context.textAlign = 'center';
    context.fillText(label, (localColumns[index] + localColumns[index + 1]) / 2, localHeaderTop + 24);
  });
  context.textAlign = 'left';
  const localRows = (fullLayout ? quote.localFeeItems : quote.localFeeItems?.slice(0, 10)) ?? [];
  const localRowHeights = [54, 50, 62, 48, 50, 50, 62, 52, 46];
  const compactLocalRowHeight = localRows.length > 0 && localRows.length < 9
    ? Math.min(118, Math.floor(474 / localRows.length))
    : 0;
  let localRowTop = localHeaderTop + 36;
  localRows.forEach((row, index) => {
    const top = localRowTop;
    const rowHeight = fullLayout?.localHeights[index] ?? (compactLocalRowHeight || localRowHeights[index] || 56);
    if (index % 2 === 1) {
      context.fillStyle = '#fbfcfc';
      context.fillRect(36, top, 956, rowHeight);
    }
    drawSolidLine(context, 36, top, 992, top, '#e1e6e8');
    if (webTable) {
      context.textAlign = 'left';
      drawCenteredTableText(row.label, 46, top, rowHeight, 170, navy, '700 14px "Microsoft YaHei", "PingFang SC", Arial, sans-serif', 1000, 18);
      drawCenteredTableText(row.unit, 246, top, rowHeight, 120, '#475569', '400 13px "Microsoft YaHei", "PingFang SC", Arial, sans-serif', 1000, 18);
      context.textAlign = 'center';
      drawCenteredTableText(row.quantity, 404, top, rowHeight, 36, navy, '700 14px "Microsoft YaHei", "PingFang SC", Arial, sans-serif', 1000, 18);
      context.textAlign = 'right';
      drawCenteredTableText(row.amount, 546, top, rowHeight, 104, navy, '850 15px "Microsoft YaHei", "PingFang SC", Arial, sans-serif', 1000, 18);
      context.textAlign = 'left';
      drawCenteredTableText(row.note, 566, top, rowHeight, 416, '#475569', '400 13px "Microsoft YaHei", "PingFang SC", Arial, sans-serif', 1000, 18);
      localRowTop += rowHeight;
      return;
    }
    context.textAlign = 'center';
    drawCenteredTableText(row.label, 136, top, rowHeight, 174, navy, '700 16px "Microsoft YaHei", "PingFang SC", Arial, sans-serif', 2, 19);
    context.textAlign = 'right';
    drawCenteredTableText(row.amount, 400, top, rowHeight, 150, navy, '850 17px "Microsoft YaHei", "PingFang SC", Arial, sans-serif');
    context.textAlign = 'left';
    drawCenteredTableText(detailedLocalNote(quote, row), 438, top, rowHeight, 532, '#475569', '400 15px "Microsoft YaHei", "PingFang SC", Arial, sans-serif', fullLayout ? 1000 : 2, 18);
    localRowTop += rowHeight;
  });
  localColumns.slice(1, -1).forEach((x) => drawSolidLine(context, x, localHeaderTop, x, localRowTop, '#e1e6e8'));
  drawSolidLine(context, 36, localRowTop, 992, localRowTop, '#e1e6e8');
  context.fillStyle = '#fffaf5';
  context.fillRect(36, localRowTop, 956, 64);
  context.fillStyle = orange;
  context.fillRect(36, localRowTop, 5, 64);
  drawSolidLine(context, 236, localRowTop, 236, localRowTop + 64, '#eadfd6');
  drawSolidLine(context, grid.noteBoundary, localRowTop, grid.noteBoundary, localRowTop + 64, '#eadfd6');
  context.textAlign = 'center';
  context.font = '900 16px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
  context.fillStyle = green;
  context.fillText('预计到校学杂费合计', 136, localRowTop + 36);
  context.font = '950 22px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
  context.fillStyle = orange;
  context.textAlign = 'right';
  context.fillText(quote.localFeeAmount, grid.amountRight, localRowTop + 38);
  context.textAlign = 'left';
  context.font = '900 17px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
  const localRate = fullLayout && quote.conversionRates
    ? `参考汇率：1元人民币 ≈ ${quote.conversionRates.phpPerCny.toLocaleString('zh-CN', { maximumFractionDigits: 6 })}比索`
    : '';
  context.fillText(quote.localFeeCny ?? '', grid.noteLeft, localRowTop + (fullLayout && !localRate ? 38 : 27));
  if (localRate) drawTableText(localRate, grid.noteLeft, localRowTop + 49, grid.noteWidth, '#64748b', '400 12px "Microsoft YaHei", "PingFang SC", Arial, sans-serif', 1, 16);
  if (!fullLayout) drawTableText('按最新参考汇率预估，实际以到校缴费为准', 438, localRowTop + 49, 530, '#64748b', '400 12px "Microsoft YaHei", "PingFang SC", Arial, sans-serif', 1, 16);

  const optionalFees = (fullLayout ? quote.optionalFeeItems : quote.optionalFeeItems?.slice(0, 2)) ?? [];
  const optionalTop = localRowTop + 70;
  const optionalHeight = fullLayout ? fullLayout.optionalHeights.reduce((sum, value) => sum + value, 0) : 64;
  drawRoundedRect(context, 36, optionalTop, 956, optionalHeight, 7, '#f8fbf9', '#d7e6dc', 1);
  drawSolidLine(context, 236, optionalTop, 236, optionalTop + optionalHeight, '#dfe8e2');
  drawSolidLine(context, grid.noteBoundary, optionalTop, grid.noteBoundary, optionalTop + optionalHeight, '#dfe8e2');
  let nextOptionalTop = optionalTop;
  optionalFees.forEach((item, index) => {
    const rowTop = nextOptionalTop;
    const rowHeight = fullLayout?.optionalHeights[index] ?? 32;
    nextOptionalTop += rowHeight;
    if (index > 0) {
      drawSolidLine(context, 36, rowTop, 992, rowTop, '#dfe8e2');
    }
    if (fullLayout) {
      context.textAlign = 'center';
      drawCenteredTableText(item.label, 136, rowTop, rowHeight, 186, green, '850 14px "Microsoft YaHei", "PingFang SC", Arial, sans-serif', 1000, 17);
      context.textAlign = 'right';
      context.font = '400 12px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
      const secondaryHeight = item.cnyAmount ? wrapCanvasText(context, item.cnyAmount, grid.amountWidth, 1000).length * 16 : 0;
      drawCenteredTableText(item.amount, grid.amountRight, rowTop, rowHeight - secondaryHeight, grid.amountWidth, navy, '900 14px "Microsoft YaHei", "PingFang SC", Arial, sans-serif', 1000, 17);
      if (item.cnyAmount) drawCenteredTableText(item.cnyAmount, grid.amountRight, rowTop + rowHeight - secondaryHeight - 6, secondaryHeight, grid.amountWidth, '#64748b', '400 12px "Microsoft YaHei", "PingFang SC", Arial, sans-serif', 1000, 16);
      context.textAlign = 'left';
      drawCenteredTableText(item.note, grid.noteLeft, rowTop, rowHeight, grid.noteWidth, '#64748b', '400 12px "Microsoft YaHei", "PingFang SC", Arial, sans-serif', 1000, 15);
      return;
    }
    context.textAlign = 'center';
    context.font = '850 14px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
    context.fillStyle = green;
    context.fillText(item.label, 136, rowTop + 21);
    context.font = '900 15px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
    context.fillStyle = navy;
    context.textAlign = 'right';
    context.fillText(item.amount, 400, rowTop + 21);
    context.textAlign = 'left';
    drawTableText(item.note, 438, rowTop + 21, 530, '#64748b', '400 12px "Microsoft YaHei", "PingFang SC", Arial, sans-serif', 1, 15);
  });

  context.translate(0, fullLayout?.localExtra ?? 0);
  const serviceHeight = fullLayout?.serviceHeight ?? 174;
  drawRoundedRect(context, padding, 1454, contentWidth, serviceHeight, 9, '#ffffff', border, 1);
  drawSectionNumber('03', quote.serviceSectionTitle ?? '为什么选择思达启航？', 1490);

  const benefits = quote.benefitItems?.slice(0, 4) ?? [];
  const benefitsTop = fullLayout ? 1501 : 1505;
  const benefitsHeight = fullLayout?.benefitsHeight ?? 68;
  drawRoundedRect(context, 36, benefitsTop, 956, benefitsHeight, 8, '#f7faf8', '#dce7e1', 1);
  benefits.forEach((item, index) => {
    const x = 36 + index * 238;
    const y = benefitsTop;
    if (index > 0) {
      drawSolidLine(context, x, y + 10, x, y + benefitsHeight - 10, '#dce7e1');
    }
    drawRoundedRect(context, x + 16, y + 16, 10, 10, 5, index === 1 ? orange : green);
    context.font = '900 16px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
    context.fillStyle = green;
    context.textAlign = 'left';
    context.fillText(item.title, x + 34, y + 27);
    drawTableText(item.text, x + 16, y + 44, 206, '#64748b', '400 12px "Microsoft YaHei", "PingFang SC", Arial, sans-serif', fullLayout ? 1000 : 2, 15);
  });

  const serviceLocations = quote.serviceLocations?.slice(0, 3) ?? [
    '深圳总部',
    '菲律宾驻点',
    '欧洲驻点',
  ];
  context.font = '400 13px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
  context.fillStyle = '#64748b';
  context.textAlign = 'right';
  context.fillText(serviceLocations.join(' · '), 984, 1487);
  context.textAlign = 'left';

  if (!quote.hideAlumniBenefit) {
    const alumniText = quote.alumniBenefitItems?.[0]?.text ?? '';
    const alumniTop = fullLayout ? benefitsTop + benefitsHeight + 8 : 1581;
    const alumniHeight = fullLayout?.alumniHeight ?? 36;
    drawRoundedRect(context, 36, alumniTop, 956, alumniHeight, 6, '#fff8f1', '#f2b38c', 1);
    context.fillStyle = orange;
    context.fillRect(36, alumniTop, 5, alumniHeight);
    context.font = '900 16px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
    context.fillStyle = orange;
    context.textAlign = 'left';
    context.fillText(quote.alumniBenefitTitle ?? '老学员专属优惠', 54, alumniTop + 24);
    drawTableText(alumniText, 206, alumniTop + 24, 770, navy, '400 16px "Microsoft YaHei", "PingFang SC", Arial, sans-serif', fullLayout ? 1000 : 1, 20);
  }

  const footerTop = fullLayout ? 1454 + serviceHeight + 12 : 1640;
  drawRoundedRect(context, padding, footerTop, contentWidth, fullLayout?.footerHeight ?? 106, 8, '#f7faf8', '#dce7e1', 1);
  context.font = '900 16px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
  context.fillStyle = green;
  context.fillText(`04  ${quote.noteTitle ?? '报价说明'}`, 38, footerTop + 32);
  const importantNotes = fullLayout?.importantNotes ?? (quote.importantNotes?.length
    ? quote.importantNotes
    : [quote.note]);
  let nextNoteTop = footerTop + 31;
  (fullLayout ? importantNotes : importantNotes.slice(0, 3)).forEach((note, index) => {
    if (fullLayout) {
      const mismatch = isDateMismatchNote(note);
      drawTableText(quote.footerNotesVerbatim ? note : `✓ ${note}`, 174, nextNoteTop, 820, mismatch ? '#9a3412' : '#475569', `${mismatch ? 700 : 400} 13px "Microsoft YaHei", "PingFang SC", Arial, sans-serif`, 1000, 18);
      nextNoteTop += fullLayout.noteHeights[index];
      return;
    }
    context.font = '650 13px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
    context.fillStyle = '#475569';
    context.fillText(`✓ ${note}`, 174, 1671 + index * 27);
  });
  context.restore();
  context.restore();
}

export function drawRoundedRect(
  context: TextContext,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  fill: string,
  stroke?: string,
  lineWidth = 1,
): void {
  roundedRectPath(context, x, y, width, height, radius);
  context.fillStyle = fill;
  context.fill();

  if (stroke) {
    context.lineWidth = lineWidth;
    context.strokeStyle = stroke;
    context.stroke();
  }
}

export function drawRoundedImageCover<TImage extends CanvasImage>(
  context: NoInfer<Context<TImage>>,
  image: TImage,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  overlay?: string,
): void {
  context.save();
  roundedRectPath(context, x, y, width, height, radius);
  context.clip();
  drawImageCover(context, image, x, y, width, height);

  if (overlay) {
    context.fillStyle = overlay;
    context.fillRect(x, y, width, height);
  }

  context.restore();
}

export function drawImageCover<TImage extends CanvasImage>(context: NoInfer<Context<TImage>>, image: TImage, x: number, y: number, width: number, height: number): void {
  const naturalWidth = imageWidth(image);
  const naturalHeight = imageHeight(image);
  const imageRatio = naturalWidth / naturalHeight;
  const boxRatio = width / height;
  const sourceWidth = imageRatio > boxRatio ? naturalHeight * boxRatio : naturalWidth;
  const sourceHeight = imageRatio > boxRatio ? naturalHeight : naturalWidth / boxRatio;
  const sourceX = (naturalWidth - sourceWidth) / 2;
  const sourceY = (naturalHeight - sourceHeight) / 2;

  context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, x, y, width, height);
}

/** The approved header samples the original high-resolution brand artwork instead of the old small PNG. */
export function useHighResolutionBrandHeader(quote: QuoteImageCardData): boolean {
  return /\/sida-qihang-quote-header-logo(?:-transparent)?\.(?:png|webp)$/.test(quote.logoSrc);
}

/** The asset the brand header draws: the high-resolution artwork or the quote's own logo. */
export function quoteBrandLogoSource(quote: QuoteImageCardData): string {
  return useHighResolutionBrandHeader(quote) ? '/assets/sida-qihang-navbar-logo.jpg' : quote.logoSrc;
}

export function drawQuoteBrandHeader<TImage extends CanvasImage>(context: NoInfer<Context<TImage>>, quote: QuoteImageCardData, logo: TImage, x: number, y: number): void {
  if (!useHighResolutionBrandHeader(quote)) {
    drawImageContain(context, logo, x, y, 520, 70);
    return;
  }
  context.save();
  // Sample the original brand artwork directly; never enlarge the old 427×54 header.
  // This crop excludes the white margins of the existing 1672×941 master asset.
  context.drawImage(logo, 247, 295, 1215, 312, x + 12, y + 9, 194, 194 * 312 / 1215);
  drawSolidLine(context, x + 251, y + 16, x + 251, y + 54, '#ead5c3');
  context.textAlign = 'left';
  context.fillStyle = '#bc9d87';
  context.font = '700 14px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
  context.fillText('留学规划 · 语言提升', x + 267, y + 31);
  context.fillText('从思达启航，走向更美好的未来', x + 267, y + 50);
  context.restore();
}

export function drawImageContain<TImage extends CanvasImage>(context: NoInfer<Context<TImage>>, image: TImage, x: number, y: number, width: number, height: number): void {
  const imageRatio = imageWidth(image) / imageHeight(image);
  const boxRatio = width / height;
  const drawWidth = imageRatio > boxRatio ? width : height * imageRatio;
  const drawHeight = imageRatio > boxRatio ? width / imageRatio : height;
  const drawX = x + (width - drawWidth) / 2;
  const drawY = y + (height - drawHeight) / 2;

  context.drawImage(image, drawX, drawY, drawWidth, drawHeight);
}

export function drawCircularImage<TImage extends CanvasImage>(context: NoInfer<Context<TImage>>, image: TImage, centerX: number, centerY: number, radius: number): void {
  context.save();
  context.beginPath();
  context.arc(centerX, centerY, radius, 0, Math.PI * 2);
  context.clip();
  drawImageCover(context, image, centerX - radius, centerY - radius, radius * 2, radius * 2);
  context.restore();
}

export function drawDashedLine(context: TextContext, fromX: number, fromY: number, toX: number, toY: number): void {
  context.save();
  context.setLineDash([4, 4]);
  context.strokeStyle = '#d6dce0';
  context.lineWidth = 1;
  context.beginPath();
  context.moveTo(fromX, fromY);
  context.lineTo(toX, toY);
  context.stroke();
  context.restore();
}

export function drawSolidLine(
  context: TextContext,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  color: string,
): void {
  context.save();
  context.setLineDash([]);
  context.strokeStyle = color;
  context.lineWidth = 1;
  context.beginPath();
  context.moveTo(fromX, fromY);
  context.lineTo(toX, toY);
  context.stroke();
  context.restore();
}

export function drawWrappedText(
  context: TextContext,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  font: string,
  color: string,
  maxLines = 3,
): number {
  context.font = font;
  context.fillStyle = color;
  const lines = wrapCanvasText(context, text, maxWidth, maxLines);
  lines.forEach((line, index) => context.fillText(line, x, y + index * lineHeight));

  return y + lines.length * lineHeight;
}

export function wrapCanvasText(context: TextContext, text: string, maxWidth: number, maxLines: number): string[] {
  // Keep opening/closing punctuation with its word so a cell never strands a bracket.
  const tokens = text.match(/[（(【「“]*[A-Za-z0-9]+(?:[./:+-][A-Za-z0-9]+)*[）)】」”，。；：！？、]*|\s+|[（(【「“]*.[）)】」”，。；：！？、]*/g) ?? [text];
  const lines: string[] = [];
  let currentLine = '';

  for (const token of tokens) {
    const candidate = currentLine + token;
    if (context.measureText(candidate).width <= maxWidth || currentLine.length === 0) {
      currentLine = candidate;
      continue;
    }

    lines.push(currentLine.trim());
    currentLine = token.trimStart();

    if (lines.length === maxLines) {
      break;
    }
  }

  if (lines.length < maxLines && currentLine.trim()) {
    lines.push(currentLine.trim());
  }

  if (lines.length === maxLines && tokens.join('').length > lines.join('').length) {
    const lastLine = lines[maxLines - 1];
    lines[maxLines - 1] = lastLine.length > 2 ? `${lastLine.slice(0, -1)}...` : lastLine;
  }

  return lines;
}

export function roundedRectPath(context: TextContext, x: number, y: number, width: number, height: number, radius: number): void {
  const safeRadius = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.moveTo(x + safeRadius, y);
  context.lineTo(x + width - safeRadius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + safeRadius);
  context.lineTo(x + width, y + height - safeRadius);
  context.quadraticCurveTo(x + width, y + height, x + width - safeRadius, y + height);
  context.lineTo(x + safeRadius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - safeRadius);
  context.lineTo(x, y + safeRadius);
  context.quadraticCurveTo(x, y, x + safeRadius, y);
  context.closePath();
}

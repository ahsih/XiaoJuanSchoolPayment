// Quote image for UK schools ("uk-package" layout), drawn on any 2D canvas context.
// Sections: brand header, title band, school/requirement/date cards, 01 fees for up to three plans,
// each row explaining what it covers (included items read 已含, ticked optional services are tagged
// 自选), with the highlighted total, 02 optional reference prices that were not ticked, 03 notes,
// the consultants with their WeChat QR codes, footer. QuoteImageDownloadButtonComponent draws it
// with a browser canvas. Keep this file free of Angular, DOM types and regex lookbehind so the
// WeChat mini program can bundle it like quote-image-detailed-renderer.ts.
import {
  QuoteCanvasContext,
  QuoteCanvasImage,
  drawImageContain,
  drawRoundedRect,
  drawSolidLine,
  roundedRectPath,
} from '../quote-image-detailed-renderer';
import { UkQuoteSheet, ukAmountText, ukEmphasisRuns, ukMoney } from './uk-quote-sheet';

type Context<TImage> = QuoteCanvasContext<TImage>;
type TextContext = QuoteCanvasContext<never>;

const FONT = '"Microsoft YaHei", "PingFang SC", Arial, sans-serif';
const font = (size: number, weight = 400) => `${weight} ${size}px ${FONT}`;
const COLORS = {
  page: '#f4f1ea', card: '#ffffff', green: '#0f4a2f', green2: '#1d6b45', greenSoft: '#eaf3ec',
  orange: '#ee7d1a', orangeDark: '#b4560a', orangeSoft: '#fff3e6', ink: '#1f2a24', muted: '#6b766f',
  line: '#dde5df', soft: '#f8faf8', gold: '#f7c873', tagline: '#bc9d87',
};
const CARD_X = 20;
const CARD_W = 992;
const X0 = 56;
const CW = 920;

interface Run { text: string; emphasis: boolean }

/** Same tokens as wrapCanvasText: keeps Latin words and attached punctuation together. */
function tokens(text: string): string[] {
  return text.match(/[（(【「“]*[A-Za-z0-9]+(?:[./:+-][A-Za-z0-9]+)*[）)】」”，。；：！？、]*|\s+|[（(【「“]*.[）)】」”，。；：！？、]*/g) ?? [text];
}

/** Wraps `{{emphasis}}` text, honouring line breaks; each line is a list of styled runs. */
function richLines(context: TextContext, text: string, maxWidth: number, size: number, weight = 400): Run[][] {
  const lines: Run[][] = [];
  for (const paragraph of text.split('\n')) {
    let line: Run[] = [];
    let width = 0;
    for (const run of ukEmphasisRuns(paragraph)) {
      for (const token of tokens(run.text)) {
        context.font = font(size, run.emphasis ? 800 : weight);
        const tokenWidth = context.measureText(token).width;
        if (line.length && width + tokenWidth > maxWidth) {
          lines.push(line);
          const trimmed = token.trimStart();
          context.font = font(size, run.emphasis ? 800 : weight);
          line = trimmed ? [{ text: trimmed, emphasis: run.emphasis }] : [];
          width = trimmed ? context.measureText(trimmed).width : 0;
          continue;
        }
        line.push({ text: token, emphasis: run.emphasis });
        width += tokenWidth;
      }
    }
    lines.push(line);
  }
  return lines;
}

function plainLines(context: TextContext, text: string, maxWidth: number, size: number, weight = 400): string[] {
  return richLines(context, text.split('{{').join('').split('}}').join(''), maxWidth, size, weight)
    .map(line => line.map(run => run.text).join(''));
}

/** Plan column headers such as 标准课程 ＋ 校内宿舍单人间 break after the plus sign, not mid-word. */
function headerTitle(title: string): string {
  return title.split(' ＋ ').join(' ＋\n');
}

class UkPainter<TImage extends QuoteCanvasImage> {
  constructor(readonly context: Context<TImage>, readonly draw: boolean) {}

  rect(x: number, y: number, width: number, height: number, color: string): void {
    if (!this.draw) return;
    this.context.fillStyle = color;
    this.context.fillRect(x, y, width, height);
  }

  rounded(x: number, y: number, width: number, height: number, radius: number, fill: string, stroke?: string): void {
    if (this.draw) drawRoundedRect(this.context, x, y, width, height, radius, fill, stroke);
  }

  line(x1: number, y1: number, x2: number, y2: number, color = COLORS.line): void {
    if (this.draw) drawSolidLine(this.context, x1, y1, x2, y2, color);
  }

  text(text: string, x: number, y: number, size: number, weight: number, color: string, align = 'left'): void {
    if (!this.draw) return;
    this.context.font = font(size, weight);
    this.context.fillStyle = color;
    this.context.textAlign = align;
    this.context.fillText(text, x, y);
    this.context.textAlign = 'left';
  }

  width(text: string, size: number, weight = 400): number {
    this.context.font = font(size, weight);
    return this.context.measureText(text).width;
  }

  /** Draws wrapped plain text and returns its height. */
  paragraph(text: string, x: number, y: number, maxWidth: number, size: number, lineHeight: number,
    color: string, weight = 400, align = 'left'): number {
    const lines = plainLines(this.context, text, maxWidth, size, weight);
    lines.forEach((line, index) => this.text(line, x, y + index * lineHeight, size, weight, color, align));
    return lines.length * lineHeight;
  }

  /** Draws wrapped text with orange emphasis runs and returns its height. */
  rich(text: string, x: number, y: number, maxWidth: number, size: number, lineHeight: number, color: string,
    weight = 400, center = false): number {
    const lines = richLines(this.context, text, maxWidth, size, weight);
    lines.forEach((line, index) => {
      let cursor = x;
      if (center) {
        const lineWidth = line.reduce((sum, run) => sum + this.width(run.text, size, run.emphasis ? 800 : weight), 0);
        cursor = x + (maxWidth - lineWidth) / 2;
      }
      line.forEach(run => {
        const runWeight = run.emphasis ? 800 : weight;
        this.text(run.text, cursor, y + index * lineHeight, size, runWeight, run.emphasis ? COLORS.orange : color);
        cursor += this.width(run.text, size, runWeight);
      });
    });
    return lines.length * lineHeight;
  }

  richHeight(text: string, maxWidth: number, size: number, lineHeight: number, weight = 400): number {
    return richLines(this.context, text, maxWidth, size, weight).length * lineHeight;
  }

  /** Horizontal two-colour gradient made of thin strips (the canvas subset has no gradients). */
  gradient(x: number, y: number, width: number, height: number, from: string, to: string): void {
    if (!this.draw) return;
    const steps = 48;
    const parse = (hex: string) => [1, 3, 5].map(index => parseInt(hex.slice(index, index + 2), 16));
    const [a, b] = [parse(from), parse(to)];
    for (let step = 0; step < steps; step += 1) {
      const t = step / (steps - 1);
      const color = `rgb(${a.map((value, index) => Math.round(value + (b[index] - value) * t)).join(',')})`;
      this.rect(x + (width * step) / steps, y, width / steps + 1, height, color);
    }
  }

  sectionHeading(number: string, title: string, unit: string, y: number): number {
    this.rounded(X0, y, 36, 26, 6, COLORS.orange);
    this.text(number, X0 + 18, y + 19, 14, 800, '#ffffff', 'center');
    this.text(title, X0 + 48, y + 21, 22, 800, COLORS.green);
    if (unit) this.text(unit, X0 + 56 + this.width(title, 22, 800), y + 20, 13, 400, COLORS.muted);
    return 40;
  }
}

export interface UkQuoteImageAssets<TImage> {
  logo?: TImage;
  /** WeChat QR codes in the order of `sheet.contacts`; a missing one leaves its frame empty. */
  qrs?: Array<TImage | undefined>;
}

function layout<TImage extends QuoteCanvasImage>(painter: UkPainter<TImage>, sheet: UkQuoteSheet,
  assets: UkQuoteImageAssets<TImage>, height: number): number {
  const p = painter;
  const plans = Math.max(1, sheet.plans.length);
  const cardTop = 20;

  if (p.draw) {
    p.rect(0, 0, 1032, height, COLORS.page);
    p.rounded(CARD_X, cardTop + 3, CARD_W, height - 40, 18, '#e7e1d4');
    p.rounded(CARD_X, cardTop, CARD_W, height - 40, 18, COLORS.card);
    p.context.save();
    roundedRectPath(p.context, CARD_X, cardTop, CARD_W, height - 40, 18);
    p.context.clip();
  }

  // Brand header.
  const logoWidth = 230;
  const logoHeight = Math.round(logoWidth * 312 / 1215);
  if (p.draw && assets.logo) {
    const logo = assets.logo;
    const natural = (logo.naturalWidth || logo.width);
    if (natural === 1672) {
      p.context.drawImage(logo, 247, 295, 1215, 312, CARD_X + 36, cardTop + 32, logoWidth, logoHeight);
    } else {
      drawImageContain(p.context, logo, CARD_X + 36, cardTop + 32, logoWidth, logoHeight);
    }
  }
  const taglineX = CARD_X + 36 + logoWidth + 22;
  p.line(taglineX - 12, cardTop + 34, taglineX - 12, cardTop + 34 + logoHeight - 4, '#ead5c3');
  p.text('留学规划 · 语言提升', taglineX, cardTop + 56, 15, 700, COLORS.tagline);
  p.text('从思达启航，走向更美好的未来', taglineX, cardTop + 80, 15, 700, COLORS.tagline);
  const right = CARD_X + CARD_W - 36;
  p.rounded(right - 92, cardTop + 26, 92, 32, 6, '#ffffff', COLORS.green);
  p.text('报 价 单', right - 46, cardTop + 48, 15, 800, COLORS.green, 'center');
  p.text(`报价日期：${sheet.quoteDate}`, right, cardTop + 80, 13, 400, COLORS.muted, 'right');
  p.text(`官网 ${sheet.website}`, right, cardTop + 100, 13, 700, COLORS.green2, 'right');

  // Title band.
  let y = cardTop + 124;
  const subtitleHeight = plainLines(p.context, sheet.subtitle, CW, 16).length * 24;
  const bandHeight = 112 + subtitleHeight + 6;
  p.gradient(CARD_X, y, CARD_W, bandHeight, COLORS.green, COLORS.green2);
  p.gradient(CARD_X, y + bandHeight - 5, CARD_W, 5, '#f05a1a', '#f7b733');
  p.text(sheet.eyebrow, X0, y + 36, 14, 700, COLORS.gold);
  p.text(sheet.title, X0, y + 82, sheet.title.length > 32 ? 28 : 33, 800, '#ffffff');
  p.paragraph(sheet.subtitle, X0, y + 114, CW, 16, 24, '#d9e9de');
  y += bandHeight + 28;

  // Info cards: two per row, wide cards span the row.
  const gap = 12;
  const half = (CW - gap) / 2;
  const cardHeight = (item: { value: string }, width: number) =>
    46 + plainLines(p.context, item.value, width - 32, 16).length * 25 + 8;
  for (let index = 0; index < sheet.info.length;) {
    const item = sheet.info[index];
    const next = sheet.info[index + 1];
    const pair = !item.wide && next && !next.wide ? [item, next] : [item];
    const width = pair.length === 2 ? half : CW;
    const rowHeight = Math.max(...pair.map(entry => cardHeight(entry, width)));
    pair.forEach((entry, column) => {
      const x = X0 + column * (half + gap);
      p.rounded(x, y, width, rowHeight, 12, COLORS.soft, COLORS.line);
      p.text(entry.label, x + 16, y + 26, 13, 700, COLORS.green2);
      p.paragraph(entry.value, x + 16, y + 52, width - 32, 16, 25, COLORS.ink);
    });
    y += rowHeight + gap;
    index += pair.length;
  }

  // 01 Required fees.
  y += 18;
  y += p.sectionHeading('01', sheet.feesTitle, `单位：${sheet.currencyLabel}`, y) + 6;
  // Amounts are short, so their columns stay narrow and what each fee covers gets the width.
  const planWidth = plans === 1 ? 190 : plans === 2 ? 170 : 152;
  const labelWidth = CW - planWidth * plans;
  const noteWidth = labelWidth - 52;
  const columnRight = (index: number) => X0 + labelWidth + planWidth * (index + 1) - 20;
  const headerHeight = Math.max(58, ...sheet.plans.map(plan =>
    (plan.tag ? 22 : 8) + plainLines(p.context, headerTitle(plan.title), planWidth - 30, 15, 700).length * 21 + 16));
  const rows = sheet.requiredRows.map(row => Math.max(60,
    (row.note ? 54 + p.richHeight(row.note, noteWidth, 14, 23) : 0)));
  const totalHeight = 88;
  const tableHeight = headerHeight + rows.reduce((sum, value) => sum + value, 0) + totalHeight;
  const tableTop = y;
  if (p.draw) {
    p.context.save();
    roundedRectPath(p.context, X0, tableTop, CW, tableHeight, 12);
    p.context.clip();
  }
  p.rect(X0, y, CW, headerHeight, COLORS.green);
  p.text('项目', X0 + 18, y + headerHeight / 2 + 6, 16, 700, '#ffffff');
  sheet.plans.forEach((plan, index) => {
    const block = (plan.tag ? 20 : 0) + plainLines(p.context, headerTitle(plan.title), planWidth - 30, 15, 700).length * 21;
    let top = y + (headerHeight - block) / 2;
    if (plan.tag) { p.text(plan.tag, columnRight(index), top + 12, 12, 400, '#bfe0c9', 'right'); top += 20; }
    p.paragraph(headerTitle(plan.title), columnRight(index), top + 16, planWidth - 30, 15, 21, '#ffffff', 700, 'right');
  });
  y += headerHeight;
  sheet.requiredRows.forEach((row, rowIndex) => {
    const rowHeight = rows[rowIndex];
    p.line(X0, y, X0 + CW, y);
    p.text(row.label, X0 + 18, y + 32, 16, 700, COLORS.ink);
    if (row.optional) {
      const tagX = X0 + 26 + p.width(row.label, 16, 700);
      p.rounded(tagX, y + 17, p.width('自选', 11) + 12, 19, 4, '#fffaf2', '#e6cfa7');
      p.text('自选', tagX + 6, y + 31, 11, 400, '#9a6b2b');
    }
    // What the fee covers, under its name; the amounts line up with the name.
    if (row.note) p.rich(row.note, X0 + 18, y + 57, noteWidth, 14, 23, '#5f6a63');
    row.amounts.forEach((amount, index) => {
      const text = ukAmountText(amount);
      const numeric = typeof amount === 'number';
      p.text(text, columnRight(index), y + 33, numeric ? 19 : 15, numeric ? 800 : 700,
        numeric ? COLORS.ink : amount === 'included' ? COLORS.green2 : '#9aa49d', 'right');
    });
    y += rowHeight;
  });
  p.rect(X0, y, CW, totalHeight, COLORS.orangeSoft);
  p.line(X0, y, X0 + CW, y, '#f2d9bf');
  p.text(sheet.totalLabel, X0 + 18, y + 40, 19, 800, COLORS.orangeDark);
  sheet.requiredTotals.forEach((total, index) => {
    p.text(total === null ? '待确认' : ukMoney(total), columnRight(index), y + 42, total === null ? 18 : plans === 3 ? 24 : 27, 800, COLORS.orange, 'right');
    const cny = sheet.requiredTotalsCny[index];
    p.text(cny === null ? '人民币待更新' : `约 ${ukMoney(cny)} 元人民币`, columnRight(index), y + 68, 13, 400, COLORS.muted, 'right');
  });
  y += totalHeight;
  if (p.draw) {
    p.context.restore();
    drawRoundedRect(p.context, X0, tableTop, CW, tableHeight, 12, 'rgba(0,0,0,0)', COLORS.line);
  }
  y += 12;
  y += p.paragraph(sheet.rateNote, X0, y + 14, CW, 13, 20, COLORS.muted);

  if (sheet.examples.length) {
    y += 14;
    const exampleRows = sheet.examples.map(example => {
      const labelWidth = p.width(`${example.label}：`, 14, 700);
      return { example, labelWidth, height: plainLines(p.context, example.text, CW - 40 - labelWidth, 14).length * 22 };
    });
    const boxHeight = 44 + exampleRows.reduce((sum, row) => sum + row.height, 0) + 12;
    p.rounded(X0, y, CW, boxHeight, 12, COLORS.soft, COLORS.line);
    p.text(sheet.examplesTitle, X0 + 20, y + 28, 14, 800, COLORS.green2);
    let top = y + 54;
    exampleRows.forEach(row => {
      p.text(`${row.example.label}：`, X0 + 20, top, 14, 700, COLORS.ink);
      p.paragraph(row.example.text, X0 + 20 + row.labelWidth, top, CW - 40 - row.labelWidth, 14, 22, '#3d4741');
      top += row.height;
    });
    y += boxHeight;
  }

  // 02 Optional (reference only).
  if (sheet.optionalRows.length) {
    y += 30;
    y += p.sectionHeading('02', '可选费用', sheet.optionalNote, y) + 6;
    const priceWidth = Math.max(...sheet.optionalRows.map(row => p.width(row.price, 14))) + 8;
    const textWidth = CW - 40 - priceWidth - 24;
    const optionalRows = sheet.optionalRows.map(row => 22 + (row.note ? plainLines(p.context, row.note, textWidth, 13).length * 20 : 0) + 14);
    const boxHeight = optionalRows.reduce((sum, value) => sum + value, 0) + 16;
    if (p.draw) {
      p.context.save();
      p.context.setLineDash([5, 4]);
      drawRoundedRect(p.context, X0, y, CW, boxHeight, 12, '#ffffff', '#cfd6d1');
      p.context.restore();
    }
    let top = y + 10;
    sheet.optionalRows.forEach((row, index) => {
      p.text(row.label, X0 + 20, top + 20, 14, 400, '#4f5953');
      if (row.tag) {
        const tagX = X0 + 26 + p.width(row.label, 14);
        const tagWidth = p.width(row.tag, 11) + 12;
        p.rounded(tagX, top + 6, tagWidth, 19, 4, '#fffaf2', '#e6cfa7');
        p.text(row.tag, tagX + 6, top + 20, 11, 400, '#9a6b2b');
      }
      p.text(row.price, X0 + CW - 20, top + 20, 14, 400, '#4f5953', 'right');
      if (row.note) p.paragraph(row.note, X0 + 20, top + 42, textWidth, 13, 20, '#8a938d');
      top += optionalRows[index];
    });
    y += boxHeight;
  }

  // 03 Notes (02 when nothing optional is left).
  y += 30;
  y += p.sectionHeading(sheet.optionalRows.length ? '03' : '02', '报价说明', '', y) + 8;
  sheet.notes.forEach((note, index) => {
    p.rounded(X0, y, 22, 22, 11, COLORS.greenSoft);
    p.text(String(index + 1), X0 + 11, y + 16, 12, 800, COLORS.green, 'center');
    const height = p.paragraph(note, X0 + 34, y + 16, CW - 34, 14, 22, '#3d4741');
    y += Math.max(26, height + 6);
  });

  // Consultants: one card each, side by side, with a scannable WeChat QR code.
  if (sheet.contacts.length) {
    y += 22;
    const count = sheet.contacts.length;
    const cardGap = 12;
    const innerX = X0 + 18;
    const innerWidth = CW - 36;
    const cardWidth = (innerWidth - cardGap * (count - 1)) / count;
    const qrSize = count >= 3 ? 112 : 126;
    const textWidth = cardWidth - qrSize - 38;
    const titleLines = sheet.contacts.map(contact => plainLines(p.context, contact.title, textWidth, 13).length);
    const cardHeight = Math.max(qrSize + 28, 28 + 26 + Math.max(...titleLines) * 19 + 58);
    const blockHeight = 52 + cardHeight + 18;
    p.rounded(X0, y, CW, blockHeight, 14, '#f6faf6', COLORS.line);
    p.text('联系思达顾问 · 预留学位', innerX, y + 34, 15, 800, COLORS.orange);
    p.text('扫码添加微信，发学生年龄、出发时间和预算', innerX + p.width('联系思达顾问 · 预留学位', 15, 800) + 14, y + 33, 13, 400, COLORS.muted);
    sheet.contacts.forEach((contact, index) => {
      const x = innerX + index * (cardWidth + cardGap);
      const top = y + 52;
      p.rounded(x, top, cardWidth, cardHeight, 12, '#ffffff', COLORS.line);
      p.rounded(x + 12, top + 14, qrSize, qrSize, 8, '#ffffff', COLORS.line);
      const qr = assets.qrs?.[index];
      if (p.draw && qr) drawImageContain(p.context, qr, x + 16, top + 18, qrSize - 8, qrSize - 8);
      const tx = x + qrSize + 26;
      p.text(contact.name, tx, top + 40, 21, 800, COLORS.green);
      const titleHeight = p.paragraph(contact.title, tx, top + 62, textWidth, 13, 19, COLORS.muted, 700);
      p.text('电话', tx, top + 62 + titleHeight + 18, 12, 400, COLORS.muted);
      p.text(contact.phone, tx, top + 62 + titleHeight + 38, 15, 800, COLORS.ink);
    });
    y += blockHeight + 28;
  } else {
    y += 28;
  }

  // Footer.
  const footerHeight = 60;
  p.rect(CARD_X, y, CARD_W, footerHeight, COLORS.green);
  p.text('思达启航教育', X0, y + 37, 16, 800, '#ffffff');
  p.text(`官网 ${sheet.website}`, X0 + 116, y + 37, 14, 400, '#d9e9de');
  p.text('从思达启航，走向更美好的未来', X0 + CW, y + 37, 14, 400, COLORS.gold, 'right');
  y += footerHeight;
  if (p.draw) p.context.restore();
  return y + 20;
}

/** Logical height of a UK quote image (multiply by the canvas scale for pixels). */
export function ukQuoteImageHeight(context: TextContext, sheet: UkQuoteSheet): number {
  return Math.ceil(layout(new UkPainter(context, false), sheet, {}, 0));
}

export function drawUkQuoteImage<TImage extends QuoteCanvasImage>(context: Context<TImage>, sheet: UkQuoteSheet,
  assets: UkQuoteImageAssets<TImage>, height: number): void {
  layout(new UkPainter(context, true), sheet, assets, height);
}

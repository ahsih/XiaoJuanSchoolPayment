// Quote image for a plan comparison ("plan-compare" layout), drawn on any 2D canvas context.
// Sections: brand header, title card with the shared conditions and campus photo, 01 the
// side-by-side comparison table, 02 notes. It uses the same header, colours and fonts as the
// full-detail image (quote-image-detailed-renderer.ts). QuoteImageDownloadButtonComponent draws
// it with a browser canvas. Keep this file free of Angular, DOM types and regex lookbehind so the
// WeChat mini program can bundle it.
import {
  HEADER_PHOTO_LEFT,
  HEADER_PHOTO_WIDTH,
  HEADER_QR_HEIGHT,
  HEADER_QR_LEFT,
  HEADER_TEXT_LEFT,
  QuoteCanvasContext,
  QuoteCanvasImage,
  drawHeaderQr,
  drawQuoteBrandHeader,
  drawRoundedImageCover,
  drawRoundedRect,
  drawSolidLine,
  headerQrOf,
  quoteConsultantLine,
  wrapCanvasText,
} from '../quote-image-detailed-renderer';
import type { QuoteImageCardData } from '../quote-image-types';
import type { PlanCompareRow, PlanCompareRowStyle, PlanCompareSheet } from './plan-compare-sheet';

type TextContext = QuoteCanvasContext<never>;

const FONT = '"Microsoft YaHei", "PingFang SC", Arial, sans-serif';
const font = (size: number, weight = 400) => `${weight} ${size}px ${FONT}`;
const COLORS = {
  green: '#06422e', orange: '#f25518', navy: '#14233e', gray: '#64748b', border: '#dce4e7',
  line: '#e1e6e8', head: '#f3f6f4', stripe: '#fbfcfc', totalBg: '#fff6f0', totalLine: '#f6c9ae',
  diff: '#c2410c', error: '#b42318', white: '#ffffff',
};
const PAD = 18;
const LEFT = 36;
const RIGHT = 992;
const LABEL_W = 168;
const CELL_PAD_Y = 12;

interface TextStyle { font: string; color: string; lineHeight: number }

const MAIN: Record<PlanCompareRowStyle, TextStyle> = {
  text: { font: font(15, 700), color: COLORS.navy, lineHeight: 20 },
  detail: { font: font(12, 400), color: COLORS.gray, lineHeight: 16 },
  money: { font: font(16, 800), color: COLORS.navy, lineHeight: 21 },
  subtotal: { font: font(17, 900), color: COLORS.navy, lineHeight: 22 },
  total: { font: font(22, 900), color: COLORS.orange, lineHeight: 28 },
  diff: { font: font(15, 800), color: COLORS.diff, lineHeight: 20 },
};
const SUB: TextStyle = { font: font(12, 400), color: COLORS.gray, lineHeight: 16 };
const LABEL: TextStyle = { font: font(14, 850), color: COLORS.green, lineHeight: 18 };

interface Block { lines: string[]; style: TextStyle }

function lines(context: TextContext, text: string, width: number, style: TextStyle): string[] {
  if (!text) return [];
  context.font = style.font;
  return text.split('\n').flatMap(part => wrapCanvasText(context, part, width, 1000));
}

function blockHeight(blocks: Block[]): number {
  return blocks.reduce((sum, block) => sum + block.lines.length * block.style.lineHeight, 0);
}

/** Draws stacked text blocks centred vertically in a cell; `x` is the anchor for `align`. */
function drawBlocks(context: TextContext, blocks: Block[], x: number, top: number, height: number, align: 'left' | 'center'): void {
  let y = top + (height - blockHeight(blocks)) / 2;
  context.textAlign = align;
  for (const block of blocks) {
    context.font = block.style.font;
    context.fillStyle = block.style.color;
    for (const line of block.lines) {
      context.fillText(line, x, y + block.style.lineHeight * 0.78);
      y += block.style.lineHeight;
    }
  }
  context.textAlign = 'left';
}

function columns(sheet: PlanCompareSheet) {
  const count = Math.max(1, sheet.plans.length);
  const width = (RIGHT - LEFT - LABEL_W) / count;
  return Array.from({ length: count }, (_, index) => {
    const x = LEFT + LABEL_W + index * width;
    return { x, width, center: x + width / 2, textWidth: width - 28 };
  });
}

function rowCells(context: TextContext, sheet: PlanCompareSheet, row: PlanCompareRow): Block[][] {
  return columns(sheet).map((column, index) => {
    const blocks: Block[] = [{ lines: lines(context, row.values[index] ?? '', column.textWidth, MAIN[row.style]), style: MAIN[row.style] }];
    const sub = row.subValues?.[index];
    if (sub) blocks.push({ lines: lines(context, sub, column.textWidth, SUB), style: SUB });
    return blocks;
  });
}

function headerCells(context: TextContext, sheet: PlanCompareSheet): Block[][] {
  const title: TextStyle = { font: font(16, 900), color: COLORS.green, lineHeight: 21 };
  const error: TextStyle = { font: font(12, 600), color: COLORS.error, lineHeight: 16 };
  return columns(sheet).map((column, index) => {
    const plan = sheet.plans[index];
    const blocks: Block[] = [{ lines: lines(context, plan.title, column.textWidth, title), style: title }];
    if (plan.error) blocks.push({ lines: lines(context, plan.error, column.textWidth, error), style: error });
    return blocks;
  });
}

const TAG_HEIGHT = 26;

interface Layout {
  titleHeight: number;
  conditionLines: string[];
  headerHeight: number;
  rowHeights: number[];
  noteLines: string[][];
  height: number;
}

function layout(context: TextContext, sheet: PlanCompareSheet, quote?: QuoteImageCardData): Layout {
  // A layoutVersion 2 quote (CIA so far) uses the three-column title card of the detailed image: school photo,
  // heading and conditions, and the consultant's QR code with its caption.
  const qr = quote ? headerQrOf(quote) : undefined;
  const conditionWidth = qr ? HEADER_QR_LEFT - 16 - HEADER_TEXT_LEFT : 520;
  const conditionLines = lines(context, sheet.conditions, conditionWidth, { font: font(15, 700), color: COLORS.navy, lineHeight: 21 }).slice(0, 3);
  const titleHeight = qr
    ? Math.max(HEADER_QR_HEIGHT + 12, 106 + conditionLines.length * 21)
    : Math.max(122, 74 + conditionLines.length * 21 + 34);
  const headerHeight = TAG_HEIGHT + 8 + Math.max(...headerCells(context, sheet).map(blockHeight)) + CELL_PAD_Y * 2;
  const rowHeights = sheet.rows.map(row => {
    const labelHeight = lines(context, row.label, LABEL_W - 28, LABEL).length * LABEL.lineHeight;
    const cellHeight = Math.max(...rowCells(context, sheet, row).map(blockHeight));
    return Math.max(row.style === 'total' ? 64 : 44, Math.max(labelHeight, cellHeight) + CELL_PAD_Y * 2);
  });
  const noteLines = sheet.notes.map(note => lines(context, `✓ ${note}`, 900, { font: font(13, 400), color: COLORS.gray, lineHeight: 19 }));
  const tableHeight = headerHeight + rowHeights.reduce((sum, height) => sum + height, 0);
  const notesHeight = 54 + noteLines.reduce((sum, item) => sum + item.length * 19, 0) + 14;
  const height = 80 + titleHeight + 10 + (68 + tableHeight) + 10 + notesHeight + PAD;
  return { titleHeight, conditionLines, headerHeight, rowHeights, noteLines, height: Math.ceil(height) };
}

/** Pass the quote too when it can carry a layoutVersion 2 consultant, whose QR code makes the title card taller. */
export function planCompareImageHeight(context: TextContext, sheet: PlanCompareSheet, quote?: QuoteImageCardData): number {
  return layout(context, sheet, quote).height;
}

export function drawPlanCompareImage<TImage extends QuoteCanvasImage>(
  context: QuoteCanvasContext<TImage>,
  quote: QuoteImageCardData,
  sheet: PlanCompareSheet,
  assets: { logo: TImage; hero: TImage; contactQr?: TImage },
  width: number,
  height: number,
): void {
  const text = context as unknown as TextContext;
  const plan = layout(text, sheet, quote);
  const contactCard = headerQrOf(quote);
  const cols = columns(sheet);

  context.fillStyle = COLORS.white;
  context.fillRect(0, 0, width, height);
  drawQuoteBrandHeader(context, quote, assets.logo, 252, 4);

  // Title card: heading, shared conditions, quote date and contact, campus photo.
  const titleTop = 80;
  drawRoundedRect(text, PAD, titleTop, width - PAD * 2, plan.titleHeight, 10, COLORS.white, COLORS.border, 1);
  const left = contactCard ? HEADER_TEXT_LEFT : 54;
  const headingTop = contactCard ? 48 : 54;
  context.font = font(31, 950);
  context.fillStyle = COLORS.green;
  context.fillText(sheet.heading, left, titleTop + headingTop);
  context.fillStyle = COLORS.orange;
  context.fillRect(left, titleTop + headingTop + 11, 42, 3);
  let y = titleTop + headingTop + 38;
  context.font = font(15, 700);
  context.fillStyle = COLORS.navy;
  for (const line of plan.conditionLines) {
    context.fillText(line, left, y);
    y += 21;
  }
  const date = quote.studentItems.find(item => item.label === '报价日期');
  const phone = quote.contact?.phone?.replace(/\s/g, '');
  context.font = font(13, 700);
  context.fillStyle = COLORS.gray;
  const contact = contactCard ? quoteConsultantLine(contactCard) : phone ? `电话/微信：${phone}` : '';
  context.fillText([date ? `${date.label}：${date.value}` : '', contact].filter(Boolean).join('  ·  '), left, y + 4);
  if (contactCard) {
    drawRoundedImageCover(context, assets.hero, HEADER_PHOTO_LEFT, titleTop + 6, HEADER_PHOTO_WIDTH, plan.titleHeight - 12, 8);
    drawHeaderQr(context, assets.contactQr, titleTop + (plan.titleHeight - HEADER_QR_HEIGHT) / 2);
  } else {
    drawRoundedImageCover(context, assets.hero, 590, titleTop + 6, 422, plan.titleHeight - 12, 10);
  }

  // 01 comparison table.
  const tableCardTop = titleTop + plan.titleHeight + 10;
  const tableHeight = plan.headerHeight + plan.rowHeights.reduce((sum, value) => sum + value, 0);
  drawRoundedRect(text, PAD, tableCardTop, width - PAD * 2, 68 + tableHeight, 9, COLORS.white, COLORS.border, 1);
  drawSectionNumber(text, '01', '方案对比', tableCardTop + 34);
  let rowTop = tableCardTop + 50;

  context.fillStyle = COLORS.head;
  context.fillRect(LEFT, rowTop, RIGHT - LEFT, plan.headerHeight);
  context.font = font(15, 850);
  context.fillStyle = COLORS.green;
  context.fillText('对比项目', LEFT + 14, rowTop + plan.headerHeight / 2 + 5);
  headerCells(text, sheet).forEach((blocks, index) => {
    const column = cols[index];
    const tag = sheet.plans[index].tag;
    context.font = font(13, 900);
    const tagWidth = context.measureText(tag).width + 22;
    const tagTop = rowTop + CELL_PAD_Y;
    drawRoundedRect(text, column.center - tagWidth / 2, tagTop, tagWidth, TAG_HEIGHT - 4, 11, COLORS.orange);
    context.fillStyle = COLORS.white;
    context.textAlign = 'center';
    context.fillText(tag, column.center, tagTop + 16);
    context.textAlign = 'left';
    drawBlocks(text, blocks, column.center, tagTop + TAG_HEIGHT + 4, blockHeight(blocks), 'center');
  });
  rowTop += plan.headerHeight;

  sheet.rows.forEach((row, rowIndex) => {
    const rowHeight = plan.rowHeights[rowIndex];
    if (row.style === 'total') {
      context.fillStyle = COLORS.totalBg;
      context.fillRect(LEFT, rowTop, RIGHT - LEFT, rowHeight);
    } else if (rowIndex % 2 === 1) {
      context.fillStyle = COLORS.stripe;
      context.fillRect(LEFT, rowTop, RIGHT - LEFT, rowHeight);
    }
    drawSolidLine(text, LEFT, rowTop, RIGHT, rowTop, row.style === 'total' ? COLORS.totalLine : COLORS.line);
    drawBlocks(text, [{ lines: lines(text, row.label, LABEL_W - 28, LABEL), style: LABEL }], LEFT + 14, rowTop, rowHeight, 'left');
    rowCells(text, sheet, row).forEach((blocks, index) => {
      const values = sheet.plans[index].error ? [{ lines: ['—'], style: MAIN.detail }] : blocks;
      drawBlocks(text, values, cols[index].center, rowTop, rowHeight, 'center');
    });
    rowTop += rowHeight;
  });
  drawSolidLine(text, LEFT, rowTop, RIGHT, rowTop, COLORS.line);
  const tableTop = tableCardTop + 50;
  for (const column of cols) drawSolidLine(text, column.x, tableTop, column.x, rowTop, COLORS.line);

  // 02 notes.
  const notesTop = tableCardTop + 68 + tableHeight + 10;
  const notesHeight = 54 + plan.noteLines.reduce((sum, item) => sum + item.length * 19, 0) + 14;
  drawRoundedRect(text, PAD, notesTop, width - PAD * 2, notesHeight, 8, '#f7faf8', '#dce7e1', 1);
  drawSectionNumber(text, '02', '报价说明', notesTop + 34);
  let noteY = notesTop + 54 + 14;
  context.font = font(13, 400);
  context.fillStyle = '#475569';
  for (const note of plan.noteLines) {
    for (const line of note) {
      context.fillText(line, 54, noteY);
      noteY += 19;
    }
  }
}

function drawSectionNumber(context: TextContext, number: string, title: string, y: number): void {
  drawRoundedRect(context, LEFT, y - 23, 32, 28, 5, COLORS.green);
  context.font = font(17, 900);
  context.fillStyle = COLORS.white;
  context.textAlign = 'center';
  context.fillText(number, LEFT + 16, y - 4);
  context.textAlign = 'left';
  context.font = font(23, 900);
  context.fillStyle = COLORS.green;
  context.fillText(title, LEFT + 42, y - 3);
}

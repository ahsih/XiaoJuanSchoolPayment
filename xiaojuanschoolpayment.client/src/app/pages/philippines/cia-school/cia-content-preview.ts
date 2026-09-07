/** Navigation metadata only: never changes the student's quote or published content. */
export type CiaPreviewKind = 'course' | 'room' | 'fee' | 'promotion' | 'section';
export interface CiaPreviewTarget { kind: CiaPreviewKind; id: string; }

export const CIA_PREVIEW_SECTIONS: Record<string, { tab: 'courses' | 'rooms' | 'fees' | 'rules'; label: string }> = {
  'course-fees': { tab: 'courses', label: '完整课程费表' },
  'course-heading': { tab: 'courses', label: '课程表标题' },
  'course-note': { tab: 'courses', label: '课程价格切换说明' },
  'class-note': { tab: 'courses', label: '团体课人数说明' },
  'room-fees': { tab: 'rooms', label: '住宿费表' },
  'room-heading': { tab: 'rooms', label: '住宿表标题' },
  'room-note': { tab: 'rooms', label: '房型说明' },
  'stay-policy': { tab: 'rooms', label: '入住与退房提醒' },
  'local-fees': { tab: 'fees', label: '到校后学杂费明细' },
  'local-fee-intro': { tab: 'fees', label: '学杂费表格说明' },
  'quote': { tab: 'rules', label: '报价计算器 · 日期与方案' },
  'quote-breakdown': { tab: 'rules', label: '报价计算器 · 费用与优惠明细' },
  'quote-registration': { tab: 'rules', label: '报价计算器 · 注册费' },
  'quote-season': { tab: 'rules', label: '报价计算器 · 旺季附加费' },
  'short-stay': { tab: 'rules', label: '短期就读费率' },
};

export function isCiaPreviewTarget(value: unknown): value is CiaPreviewTarget {
  if (!value || typeof value !== 'object') return false;
  const target = value as CiaPreviewTarget;
  return ['course', 'room', 'fee', 'promotion', 'section'].includes(target.kind)
    && typeof target.id === 'string' && !!target.id
    && (target.kind !== 'section' || Object.prototype.hasOwnProperty.call(CIA_PREVIEW_SECTIONS, target.id));
}

export function findCiaPreviewElements(root: HTMLElement, target: CiaPreviewTarget): HTMLElement[] {
  // Compare attribute values, rather than interpolating editable identifiers into selectors.
  return Array.from(root.querySelectorAll<HTMLElement>('[data-cia-preview-kind]'))
    .filter(node => node.dataset['ciaPreviewKind'] === target.kind && node.dataset['ciaPreviewId'] === target.id);
}

export function resolveCiaPreviewTarget(root: HTMLElement, target: CiaPreviewTarget): { elements: HTMLElement[]; exact: boolean } {
  const elements = findCiaPreviewElements(root, target);
  if (elements.length) return { elements, exact: true };
  const fallback = target.kind === 'course' ? 'course-fees'
    : target.kind === 'room' ? 'room-fees'
      : target.kind === 'fee' ? 'local-fees' : 'quote-breakdown';
  return { elements: findCiaPreviewElements(root, { kind: 'section', id: fallback }), exact: false };
}

export function revealCiaPreviewElement(element: HTMLElement): void {
  // Accommodation is nested inside the course-fee disclosure; a hash alone cannot reveal it.
  for (let node: HTMLElement | null = element; node; node = node.parentElement) {
    if (node.tagName === 'DETAILS') (node as HTMLDetailsElement).open = true;
  }
}

export function scrollCiaPreviewElement(element: HTMLElement): void {
  const view = element.ownerDocument.defaultView;
  if (!view) return;
  for (let parent = element.parentElement; parent; parent = parent.parentElement) {
    if (['auto', 'scroll'].includes(view.getComputedStyle(parent).overflowX) && parent.scrollWidth > parent.clientWidth) {
      const rect = element.getBoundingClientRect();
      const bounds = parent.getBoundingClientRect();
      if (rect.left < bounds.left || rect.right > bounds.right) {
        parent.scrollLeft += rect.left - bounds.left - 12;
      }
    }
  }
  // Scroll only the embedded document; scrollIntoView can also move the employee's outer form.
  view.scrollTo({ top: Math.max(0, view.scrollY + element.getBoundingClientRect().top - 144), behavior: 'instant' });
}

import { findCiaPreviewElements, isCiaPreviewTarget, resolveCiaPreviewTarget, revealCiaPreviewElement } from './cia-content-preview';

describe('CIA editor preview navigation', () => {
  let root: HTMLElement;
  beforeEach(() => {
    root = document.createElement('main');
    root.innerHTML = `<details><summary>完整费用</summary>
      <div data-cia-preview-kind="section" data-cia-preview-id="course-fees">
        <div data-cia-preview-kind="course" data-cia-preview-id="power-intensive">Power Intensive</div>
      </div>
      <details><summary>住宿</summary><article data-cia-preview-kind="room" data-cia-preview-id="sr4">四人套房</article></details>
      <div data-cia-preview-kind="section" data-cia-preview-id="room-fees"></div>
      </details>
      <h3 data-cia-preview-kind="section" data-cia-preview-id="local-fees"></h3>
      <div data-cia-preview-kind="fee" data-cia-preview-id="deposit">可退押金</div>
      <div data-cia-preview-kind="section" data-cia-preview-id="quote-breakdown"></div>
      <div data-cia-preview-kind="promotion" data-cia-preview-id="sida">学生1</div>
      <div data-cia-preview-kind="promotion" data-cia-preview-id="sida">学生2</div>`;
  });

  it('accepts known navigation targets and rejects unknown sections or malformed messages', () => {
    expect(isCiaPreviewTarget({ kind: 'course', id: 'power-intensive' })).toBeTrue();
    expect(isCiaPreviewTarget({ kind: 'section', id: 'stay-policy' })).toBeTrue();
    for (const value of [null, {}, { kind: 'course', id: '' }, { kind: 'script', id: 'x' }, { kind: 'section', id: '__proto__' }, { kind: 'section', id: 'unknown' }]) {
      expect(isCiaPreviewTarget(value)).toBeFalse();
    }
  });

  it('finds the exact course and opens its disclosure', () => {
    const result = resolveCiaPreviewTarget(root, { kind: 'course', id: 'power-intensive' });
    expect(result.exact).toBeTrue();
    expect(result.elements[0].textContent).toBe('Power Intensive');
    revealCiaPreviewElement(result.elements[0]);
    expect(root.querySelector('details')!.open).toBeTrue();
  });

  it('opens every ancestor disclosure for accommodation', () => {
    const room = resolveCiaPreviewTarget(root, { kind: 'room', id: 'sr4' }).elements[0];
    revealCiaPreviewElement(room);
    expect(Array.from(root.querySelectorAll('details')).every(item => item.open)).toBeTrue();
  });

  it('locates optional fees and every applicable student promotion row', () => {
    expect(resolveCiaPreviewTarget(root, { kind: 'fee', id: 'deposit' }).exact).toBeTrue();
    expect(resolveCiaPreviewTarget(root, { kind: 'promotion', id: 'sida' }).elements.length).toBe(2);
  });

  it('falls back to the correct section for hidden items and inactive promotions', () => {
    for (const [kind, id] of [['course', 'course-fees'], ['room', 'room-fees'], ['fee', 'local-fees'], ['promotion', 'quote-breakdown']] as const) {
      const result = resolveCiaPreviewTarget(root, { kind, id: 'hidden' });
      expect(result.exact).toBeFalse();
      expect(result.elements[0].dataset['ciaPreviewId']).toBe(id);
    }
  });

  it('matches identifiers literally without selector interpolation', () => {
    const element = root.querySelector<HTMLElement>('[data-cia-preview-kind="course"]')!;
    element.dataset['ciaPreviewId'] = 'course"] #other';
    expect(findCiaPreviewElements(root, { kind: 'course', id: 'course"] #other' })).toEqual([element]);
  });
});

import { QuoteImageCardData } from './quote-image-download-button.component';
import { applyEditableQuoteImageCopy } from './school-quote-plan';

describe('applyEditableQuoteImageCopy', () => {
  const quote = (): QuoteImageCardData => ({
    fileName: 'quote.png', logoSrc: '', heroSrc: '', schoolCode: 'TEST', title: 'Test', subtitle: '',
    quoteDateText: '', updatedAtText: '', studentItems: [],
    paymentItems: [
      { icon: '惠', label: '学生1 · 淡季优惠', amount: '− 300 美元', note: '学生1适用：旧优惠说明' },
      { icon: '旺', label: '旺季附加费', amount: '40 美元', note: '旧附加费说明' },
    ],
    totalLabel: '', totalUsd: '', totalCny: '', localFeeAmount: '', localFeeDescription: '', localFeeNote: '',
    localFeeItems: [{ label: '管理费', unit: '', quantity: '1', amount: '1 比索', note: '旧学杂费说明' }],
    optionalFeeItems: [{ label: '教材价格参考 · ESL', amount: '1 比索', note: '旧教材说明' }],
    note: '', contact: { name: '', phone: '', avatarSrc: '', qrSrc: '' },
  });

  it('keeps calculations and applies independent editable notes', () => {
    const result = applyEditableQuoteImageCopy(quote(), {
      paymentNotes: { registration: '', course: '', accommodation: '', promotion: '' },
      promotionNotes: { low: '新优惠说明' },
      supplementalFeeNotes: { 'payment:旺季附加费': '新附加费说明', 'optional:教材价格参考': '新教材说明' },
      localFeeNotes: { management: '新学杂费说明' },
    }, [{ id: 'low', name: '淡季优惠' }], [{ id: 'management', name: '管理费', note: '旧学杂费说明' }]);

    expect(result.paymentItems[0].amount).toBe('− 300 美元');
    expect(result.paymentItems[0].note).toBe('学生1适用：新优惠说明');
    expect(result.paymentItems[1].note).toBe('新附加费说明');
    expect(result.localFeeItems?.[0].note).toBe('新学杂费说明');
    expect(result.optionalFeeItems?.[0].note).toBe('新教材说明');
  });

  it('treats an explicitly empty note as intentional', () => {
    const result = applyEditableQuoteImageCopy(quote(), {
      paymentNotes: { registration: '', course: '', accommodation: '', promotion: '' },
      promotionNotes: { low: '' },
      supplementalFeeNotes: { 'payment:旺季附加费': '' },
      localFeeNotes: { management: '' },
    }, [{ id: 'low', name: '淡季优惠' }], [{ id: 'management', name: '管理费', note: '旧学杂费说明' }]);

    expect(result.paymentItems[0].note).toBe('');
    expect(result.paymentItems[1].note).toBe('');
    expect(result.localFeeItems?.[0].note).toBe('');
  });

  it('keeps separate promotion fields when one calculated row represents multiple windows', () => {
    const source = quote();
    source.paymentItems[0] = { icon: '惠', label: '学校优惠', amount: '− 300 美元', note: '第一阶段说明 第二阶段说明' };
    const result = applyEditableQuoteImageCopy(source, {
      paymentNotes: { registration: '', course: '', accommodation: '', promotion: '' },
      promotionNotes: { first: '员工第一阶段说明', second: '员工第二阶段说明' },
      localFeeNotes: {},
    }, [
      { id: 'first', name: '学校年度优惠（第一阶段）', description: '第一阶段说明' },
      { id: 'second', name: '学校年度优惠（第二阶段）', description: '第二阶段说明' },
    ]);

    expect(result.paymentItems[0].note).toBe('员工第一阶段说明；员工第二阶段说明');
  });
});

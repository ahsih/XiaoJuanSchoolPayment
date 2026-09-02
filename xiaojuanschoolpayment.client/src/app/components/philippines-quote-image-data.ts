import {
  QuoteImageCardData,
  QuoteImageLocalFeeItem,
  QuoteImageOptionalFeeItem,
  QuoteImagePaymentItem,
} from './quote-image-download-button.component';

export interface PhilippinesDetailedQuoteInput {
  schoolCode: string;
  schoolName: string;
  filePrefix: string;
  heroSrc: string;
  weeks: number;
  startDate: string;
  usdToCny: number;
  totalUsd: number;
  paymentItems: QuoteImagePaymentItem[];
  localFeeItems: QuoteImageLocalFeeItem[];
  localFeeTotal: number;
  localCurrencyName?: string;
  localFeeCny: number;
  localFeeNote: string;
  optionalFeeItems?: QuoteImageOptionalFeeItem[];
  ruleNotes: string[];
  fullFeeDetails?: boolean;
  localFeeTableLayout?: 'web';
}

const formatUsd = (value: number): string =>
  value.toLocaleString('en-US', {
    minimumFractionDigits: Number.isInteger(value) ? 0 : 1,
    maximumFractionDigits: 1,
  });

const formatPhp = (value: number): string =>
  `PHP ${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;

export function buildPhilippinesDetailedQuote(
  input: PhilippinesDetailedQuoteInput,
): QuoteImageCardData {
  const now = new Date();
  const quoteDateShort = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}`;
  const quoteDateText = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`;
  const fileDate = input.startDate.replace(/[^0-9]/g, '') || 'quote';
  const quoteCny = Math.round((input.totalUsd * input.usdToCny) / 100) * 100;

  return {
    layout: 'cia-detailed',
    fullFeeDetails: input.fullFeeDetails,
    localFeeTableLayout: input.localFeeTableLayout,
    fileName: `${input.filePrefix}-${input.weeks}周报价单-${fileDate}.png`,
    logoSrc: '/assets/sida-qihang-quote-header-logo-transparent.png',
    heroSrc: input.heroSrc,
    schoolCode: input.schoolCode,
    title: `${input.weeks}周`,
    subtitle: '',
    quoteDateText,
    updatedAtText: quoteDateText,
    studentItems: [
      { icon: '价', label: '报价日期', value: quoteDateShort },
      { icon: '日', label: '入学日期', value: input.startDate.replace(/-/g, '/') },
    ],
    paymentSectionTitle: '学校费用明细（到校前支付给学校的费用）',
    paymentItems: input.paymentItems.slice(0, 7),
    totalLabel: '最终应付学校金额',
    totalUsd: `${input.fullFeeDetails ? input.totalUsd.toLocaleString('en-US', { maximumFractionDigits: 2 }) : formatUsd(input.totalUsd)} 美元`,
    totalCny: `人民币预计金额：约 ${quoteCny.toLocaleString('zh-CN')} 元`,
    totalNote: '按实时汇率预估，最终以支付当日汇率为准',
    localFeeTitle: `到校后${input.weeks}周学杂费明细参考（学校及政府相关部门收取）`,
    localFeeAmount: input.localCurrencyName
      ? `${input.localFeeTotal.toLocaleString('en-US', { maximumFractionDigits: 0 })} ${input.localCurrencyName}`
      : formatPhp(input.localFeeTotal),
    localFeeDescription: `约人民币${input.localFeeCny.toLocaleString('zh-CN')}元；按当前周数和个人情况自动估算。`,
    localFeeNote: input.localFeeNote,
    localFeeItems: input.fullFeeDetails ? input.localFeeItems : input.localFeeItems.slice(0, 10),
    localFeeCny: `人民币预计金额：约 ${input.localFeeCny.toLocaleString('zh-CN')} 元`,
    exchangeRateText: '按实时汇率预估',
    optionalFeeItems: input.fullFeeDetails ? input.optionalFeeItems : input.optionalFeeItems?.slice(0, 2),
    benefitItems: [
      { title: '0中介费', text: '学校合作价格，不额外加收服务费' },
      { title: '价格保护', text: '同条件可比价，核实更低价退差价' },
      { title: '全程报名协助', text: '选校、签证、付款及行前指导' },
      { title: '海外驻点售后', text: '学习期间持续跟进，问题有人协助' },
    ],
    serviceLocations: ['深圳总部', '菲律宾驻点', '欧洲驻点'],
    alumniBenefitItems: [
      {
        title: '老学员权益',
        subtitle: '',
        text: '老学员结业后可享线上一对一英语课程专属优惠，留学爱尔兰及欧美英语学校专属奖学金和优惠。',
      },
    ],
    importantNotes: [
      ...(input.fullFeeDetails ? input.ruleNotes : input.ruleNotes.slice(0, 2)),
      `本报价最终以${input.schoolName}最新价格、空房、优惠及思达启航顾问确认为准。`,
    ],
    note: `人民币金额按实时汇率预估；学杂费为到校后比索现金参考；最终以${input.schoolName}及相关部门实收为准。`,
    contact: {
      name: 'Jenny',
      phone: '132 4982 7686',
      avatarSrc: '/assets/contact/jenny-avatar.jpg',
      qrSrc: '/assets/contact/jenny-wechat-qr.png',
    },
  };
}

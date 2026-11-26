/**
 * 海外手机话费充值 page text and links. Pure data (no Angular/DOM), so the WeChat mini program can
 * reuse the same links later.
 *
 * The links are 思达启航's distribution links on the 小啦全球充 top-up platform (agent backend
 * tai.95cxmd.com → 分销链接). `source=saavyo` credits each order to 思达启航; `id` opens the
 * platform on that country. Country ids were read from the platform on 2026-11-26.
 */

export const PHONE_TOP_UP_SOURCE = 'saavyo';

export function phoneTopUpLink(countryId: number): string {
  return `https://www.95cxmd.com/h5/#/home/view?source=${PHONE_TOP_UP_SOURCE}&id=${countryId}`;
}

export interface PhoneTopUpCountry {
  id: string;
  name: string;
  /** International dialling code, shown on the card. */
  dialCode: string;
  /** Currency the top-up amounts are in (Chinese currency name). */
  currency: string;
  url: string;
  /** What can be topped up for this country on the platform. */
  products: string[];
  carriers: string[];
  tip: string;
}

export const PHONE_TOP_UP_COUNTRIES: PhoneTopUpCountry[] = [
  {
    id: 'philippines',
    name: '菲律宾',
    dialCode: '+63',
    currency: '比索',
    url: phoneTopUpLink(15),
    products: ['话费', '流量', '语音套餐'],
    carriers: ['Globe', 'Smart', 'Sun', 'TM', 'TNT', 'Cherry'],
    tip: '支持预付费（prepaid）号码，输入 09 开头的手机号即可充值。',
  },
  {
    id: 'ireland',
    name: '爱尔兰',
    dialCode: '+353',
    currency: '欧元',
    url: phoneTopUpLink(164),
    products: ['话费卡密', '流量'],
    carriers: ['Lycamobile', 'Eir', 'Three'],
    tip: '话费以充值码（卡密）形式发放，购买后按运营商提示输入充值码。',
  },
  {
    id: 'uk',
    name: '英国',
    dialCode: '+44',
    currency: '英镑',
    url: phoneTopUpLink(62),
    products: ['话费', '话费卡密', '流量'],
    carriers: ['Vodafone', 'Three', 'Lebara', 'giffgaff', 'Tesco Mobile', 'Now Mobile'],
    tip: '支持英国主要运营商的预付费号码，部分运营商以充值码（卡密）发放。',
  },
];

export const PHONE_TOP_UP_PAGE = {
  eyebrow: '学员服务',
  title: '海外手机话费充值',
  lead:
    '在菲律宾、爱尔兰和英国学习期间，手机没话费、没流量了？在国内用人民币就能给当地手机号充值，家长也可以帮孩子充。',
  open: '去充值',
  copy: '复制链接',
  copied: '链接已复制',
  steps: [
    '点击下方对应国家的「去充值」，打开充值页面。',
    '输入当地手机号，选择运营商和充值面额。',
    '用人民币付款，一般很快到账，以运营商短信为准。',
  ],
  notes: [
    '充值服务由第三方平台「小啦全球充」提供，金额和到账以充值页面显示为准。',
    '请仔细核对手机号和运营商；按平台规则，充值成功后不予退款，充值失败会原路退回。',
    '到账、退款等订单问题请联系充值页面里的客服；其他问题可以联系你的思达启航顾问。',
    '部分国家的运营商可能会扣税，实际到账金额以运营商短信为准。',
  ],
  referenceNote: '以上内容仅供参考，价格、运营商和到账时间以充值平台最新页面为准。',
};

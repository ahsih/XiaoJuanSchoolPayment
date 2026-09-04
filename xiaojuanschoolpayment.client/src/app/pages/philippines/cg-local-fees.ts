export interface CgLocalFee {
  item: string;
  amount: string;
  note: string;
  quantity: number;
  total: number;
  excluded?: boolean;
}

/** Shared, user-confirmed estimates for CG Banilad and Sparta, not a final school bill. */
export type CgVisaType = 'tourist30' | 'tourist59' | 'student' | 'work' | 'srrv' | 'sirv';
const CG_VISA_LABELS: Record<CgVisaType, string> = {
  tourist30:'30天旅游签证', tourist59:'59天旅游签证', student:'学生签证',
  work:'工作签证', srrv:'SRRV绿卡', sirv:'SIRV卡',
};

export function estimateCgLocalFees(weeks: number, includeAirportPickup = false, accommodationWeeks = weeks, visaType: CgVisaType = 'tourist59') {
  const periods = accommodationWeeks > 0 && accommodationWeeks < 3 ? accommodationWeeks / 4 : Math.max(1, Math.ceil(accommodationWeeks / 4));
  // An initial 59-day visa is assumed; each extension covers another 30 days.
  const longTermVisa = !['tourist30','tourist59'].includes(visaType);
  const initialDays = visaType === 'tourist30' ? 30 : 59;
  const visaExtensionCount = longTermVisa ? 0 : Math.ceil(Math.max(0, weeks * 7 - initialDays) / 30);
  // Public fee tiers are indexed by extension count, not by four-week study periods.
  const visaExtensionFee = [0, 5160, 11550, 16010, 20470, 24930][visaExtensionCount]
    ?? 24930 + (visaExtensionCount - 5) * 4460;
  const visaRate = visaExtensionCount <= 1 ? '首次5,160 比索'
    : '首次5,160比索；第2次6,390比索' + (visaExtensionCount > 2 ? '；其余4,460比索/次' : '');
  const visaLabel = CG_VISA_LABELS[visaType];
  const confirmation = `${visaLabel}暂按免收预估；须由顾问向学校确认政策是否调整及是否免收。`;
  const visaNote = (visaExtensionCount === 0
    ? `按持${visaType==='tourist59'?'59天签证':visaLabel}预估，本次无需续签。`
    : `按持${visaType==='tourist59'?'59天签证':visaLabel}、每次续签延长30天预估。`)
    + (visaExtensionCount > 5 ? '第6次起沿用第5次费用估算。' : '')
    + (visaType==='tourist59'?'若持30天签证，需另行核算；':'') + '以实际办理及收费为准。';
  const acrQuantity = longTermVisa ? 0 : (visaExtensionCount > 0 ? 1 : 0);
  const arpQuantity = longTermVisa || visaExtensionCount > 0 ? 1 : 0;
  const note = '学杂费均为预估金额，仅供准备比索现金参考，具体以学校及相关部门到校实收为准。' +
    (accommodationWeeks === 3 ? '3周管理费、电费和水费按4周预估。' : '') +
    (weeks !== accommodationWeeks ? `签证按${weeks}周停留跨度（含间隔）预估；管理费、电费和水费按${accommodationWeeks}周住宿预估。` : '') +
    (weeks > 24 ? '超过24周仅为延伸预估：后续签证按最近一档费用计算；SSP等许可本次先计一次，续办、更新及额外教材费用以学校确认为准。' : '');
  const fees: CgLocalFee[] = [
    { item: 'SSP特殊学习许可证', amount: '7,800 比索 / 次', quantity: longTermVisa?0:1, total: longTermVisa?0:7800, note: longTermVisa?confirmation:'移民局收取，按报名学习时长办理；续费或换校需重新办理' },
    { item: 'SSP E-CARD', amount: '4,500 比索 / 次', quantity: longTermVisa?0:1, total: longTermVisa?0:4500, note: longTermVisa?confirmation:'入学时与SSP同时办理，本次按一次预估；换学校需要携带证明，否则需要重新办理' },
    { item: 'ACR-I CARD 外国人身份证', amount: '4,500 比索 / 次', quantity: acrQuantity, total: 4500 * acrQuantity, note: longTermVisa?confirmation:(visaType==='tourist59'?'按持59天签证预估，学习超过8周计入一次；若持30天签证，约第4周首次续签时可能提前产生，以实际办理为准':`按${visaLabel}预估，首次续签时计入一次；以实际办理为准`) },
    { item: 'ARP外国人登记', amount: '300 比索 / 次', quantity: arpQuantity, total: 300 * arpQuantity, note: longTermVisa?'长期签证仍计收一次，暂按300比索预估；实际政策及收费须顾问向学校确认。':'首次续签时计入一次，暂按300比索预估；实际政策及收费须顾问向学校确认。' },
    { item: '维护管理费', amount: '2,000 比索 / 4周', quantity: periods, total: 2000 * periods, note: '每4周预估1份，具体以学校实收为准' },
    { item: '电费', amount: '2,000 比索 / 4周', quantity: periods, total: 2000 * periods, note: '预估金额；空调或超额用电按学校计量另收，参考25比索/度' },
    { item: '水费', amount: '500 比索 / 4周', quantity: periods, total: 500 * periods, note: '每4周预估1份，具体以学校实收为准' },
    { item: '旅游签证续签', amount: visaRate, quantity: visaExtensionCount, total: visaExtensionFee, note: longTermVisa?confirmation:visaNote },
    { item: '书本教材费', amount: '2,000 比索 / 次预估', quantity: 1, total: 2000, note: '先预估2,000比索；不同课程教材不同，按实际购买结算，学完后另购新教材' },
    { item: '宿务马克坦机场接机（可选）', amount: '1,200 比索 / 次', quantity: includeAirportPickup ? 1 : 0, total: includeAirportPickup ? 1200 : 0, note: '可选择接机，也可自行打车；不计入学杂费合计', excluded: true },
    { item: '押金（可退）', amount: '1,000 比索 / 次预估', quantity: 1, total: 1000, note: '预估1,000比索，具体以学校为准；无损坏或额外扣费时按规定退还，不计入学杂费合计', excluded: true },
  ];
  return { periods, visaExtensionCount, visaExtensionFee, note, fees };
}

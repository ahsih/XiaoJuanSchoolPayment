import { SchoolQuotePlan } from '../../../components/school-quote-plan';

export const CIEC_COURSES = [
  { id: 'kindergarten', name: 'Kindergarten 幼儿园', price: 1050, details: '4–6岁；2节一对一＋3节小班＋1小时午休' },
  { id: 'junior-academic', name: 'Junior Academic Course', price: 1100, details: '4节一对一＋3节小组课' },
  { id: 'junior-sparta', name: 'Junior Intensive Course', price: 1400, details: '4节一对一＋4节小组课＋1节自习' },
  { id: 'junior-ielts-toefl', name: 'Junior IELTS / TOEFL', price: 1400, details: '4节一对一＋3节小组课（ESL）' },
  { id: 'school-preparation', name: 'School Preparation Course', price: 1400, details: '6节一对一＋自习' },
  { id: 'overseas-school', name: 'Overseas School Course', price: 1100, details: '名校就读＋自带午餐＋3小时课后辅导；不含国际／私立学校教育费用' },
  { id: 'guardian-esl', name: 'Guardian ESL', price: 700, details: '18岁及以上；3节一对一' },
  { id: 'guardian-business-ielts', name: 'Guardian IELTS / BUSINESS', price: 800, details: '18岁及以上；3节一对一' },
  { id: 'none', name: '家长不上课／婴幼儿不就读', price: 0, details: '家长不上课须确认适用条件；旺季家长必须上课' },
  { id: 'cidec', name: 'CIDEC', price: 1350, details: '4节一对一＋3小时小组＋1小时自习；另收年级学费3000美元一次，包含项目物料及课程模块费用' },
];
export const CIEC_ROOMS = [
  { id: 'twin', name: '双人间', price: 930, details: '工作日三餐＋周末两餐' },
  { id: 'triple', name: '三人间', price: 850, details: '工作日三餐＋周末两餐' },
];
export const CIEC_CAMPAIGNS = [
  { start: '2026-03-01', end: '2026-05-24', year: 2026, guardian: 300 },
  { start: '2026-08-31', end: '2027-01-01', year: 2026, guardian: 300 },
  { start: '2027-03-01', end: '2027-05-21', year: 2027, guardian: 400 },
  { start: '2027-08-30', end: '2027-12-31', year: 2027, guardian: 400 },
];
export const CIEC_POLICY_NOTES = [
  '优惠按学习日期判断，最少报名4周；亲子2人家庭为1位监护人＋1位子女，3人家庭为1位监护人＋2位子女。',
  '2026两人家庭监护人食宿300美元；2027为400美元。三人家庭一位监护人食宿免费；家长可不上课。',
  '淡季监护人课程：ESL 400美元、商务／IELTS 500美元；9岁及以上无监护人陪同的斯巴达学生免监护费（300美元／4周）。',
  '家长／监护人班只适用于逗留超过12周的家长／监护人；有未满48个月婴儿的家长／监护人可选择参加课程。淡季课程适用资格须学校确认。',
  '24个月及以下住宿免费但需付水电；25–47个月住宿半价，不计入房间总人数。',
  '增加家庭成员：文件中的每人追加200美元／4周须确认与新增成员课程、住宿收费的衔接，不自动加收。',
];
export const CIEC_LOCAL_REFERENCE = [
  { item: '宿务机场接机', amount: '20美元／人', note: '可选，计入美元费用一次。' },
  { item: 'SSP', amount: '8000比索', note: '续费需重新办理。' },
  { item: 'SSP E-CARD', amount: '4500比索', note: '按学校办理要求。' },
  { item: 'ACR I-CARD', amount: '4000比索', note: '旅游签证首次需要延期时收取一次。' },
  { item: '教材', amount: '600–1500比索／本', note: '按实际购买；可填写本数和参考单价。' },
  { item: '电费', amount: '约23比索／kWh', note: '按实际用量结算，不计入估算合计。' },
  { item: '签证延期', amount: '第一次5800／第二次5300／第三次5500比索', note: '逐次累加；第四次起须学校确认。' },
  { item: '管理费', amount: '2400比索／4周', note: '其他周期的收取方式须确认。' },
  { item: '学生卡', amount: '200比索', note: '一次性费用。' },
  { item: '可退宿舍押金', amount: '5000比索或100美元', note: '二选一，课程结束结算后可退；不计入合计。' },
  { item: '幼儿园教材', amount: '1000比索／4周', note: '替代普通教材估算，不重复计费。' },
  { item: '幼儿园文具套装', amount: '2000比索／4周', note: '自由选择。' },
  { item: '水费', amount: '1200比索／4周', note: '其他周期及婴幼儿适用金额须确认。' },
];
export type CiecVisa = '30' | '59' | 'student' | 'work' | 'srrv' | 'sirv';
export interface CiecFee { label: string; amount: number; note: string; }
export const ciecMoney = (amount: number) => Math.round(amount * 100) / 100;
const validAmount = (value: number | null): value is number => value !== null && Number.isFinite(value) && value >= 0;

export class CiecPerson {
  role: 'student' | 'guardian' | 'child' = 'student';
  ageMonths = 144;
  returning = false;
  visa: CiecVisa = '30';
  guardianCare = false;
  pickup = false;
  stationery = false;
  bookCount = 1;
  bookPrice = 600;
  deposit: 'php' | 'usd' = 'php';
  eligibilityConfirmed = false;
  schoolAmount: number | null = null;
  schoolConfirmation = '';
  confirmedCare: number | null = null;
  localAmount: number | null = null;
  localConfirmation = '';
  readonly plan = new SchoolQuotePlan('junior-academic', 'triple', '2026-10-11', [2, 3, 4],
    kind => (kind === 'course' ? CIEC_COURSES : CIEC_ROOMS).map(row => ({ id: row.id, name: row.name, details: row.details })),
    (kind, row) => {
      const price = (kind === 'course' ? CIEC_COURSES : CIEC_ROOMS).find(option => option.id === row.optionId)?.price ?? 0;
      const ageRate = kind === 'room' ? (this.ageMonths <= 24 ? 0 : this.ageMonths < 48 ? .5 : 1) : 1;
      return price * ageRate * (row.weeks === 2 ? .65 : row.weeks === 3 ? .85 : 1);
    });
  get age() { return this.ageMonths / 12; }
  set age(value: number) { this.ageMonths = Math.round(value * 12); }
  get visaLabel() { return ({ '30': '30天旅游签证', '59': '59天旅游签证', student: '学生签证', work: '工作签证', srrv: 'SRRV', sirv: 'SIRV' })[this.visa]; }
  get kindergarten() { return this.plan.courses.some(row => row.optionId === 'kindergarten'); }
  get annualFee() { return this.plan.courses.some(row => row.optionId === 'cidec') ? 3000 : 0; }
  get registration() { return this.returning ? 0 : 100; }
  get courses() { return this.plan.total('course'); }
  get rooms() { return this.plan.total('room'); }
  get extensionCount() { return Math.ceil(Math.max(0, this.plan.stayWeeks - (this.visa === '59' ? 8 : 4)) / 4); }
  get localIssues(): string[] {
    const issues: string[] = [];
    if (this.visa !== '30' && this.visa !== '59') issues.push(`${this.visaLabel}的证件及延期要求须学校确认。`);
    if (this.extensionCount > 3 && (this.visa === '30' || this.visa === '59')) issues.push('第四次起签证延期金额未提供。');
    if (this.plan.roomWeeks !== 4) issues.push('非四周水费、管理费及教材周期金额须确认。');
    if (this.ageMonths < 48 || this.plan.courses.some(row => row.optionId === 'none')) issues.push('婴幼儿／不就读监护人的本地费用适用项目须确认。');
    if (this.kindergarten && this.plan.courses.some(row => row.optionId !== 'kindergarten')) issues.push('幼儿园与其他课程混合时，教材项目须学校确认。');
    if (!Number.isInteger(this.bookCount) || this.bookCount < 0 || !Number.isFinite(this.bookPrice) || this.bookPrice < 600 || this.bookPrice > 1500) issues.push('教材本数须为非负整数，单价须在600–1500比索。');
    return issues;
  }
  get localRows(): CiecFee[] {
    const count = Math.min(this.extensionCount, 3);
    const rows: CiecFee[] = [
      { label: 'SSP', amount: 8000, note: '续费需重新办理。' },
      { label: 'SSP E-CARD', amount: 4500, note: '按学校办理要求。' },
      { label: 'ACR I-CARD', amount: count ? 4000 : 0, note: count ? `${this.visaLabel}首次延期，收取一次。` : `${this.visaLabel}当前无需延期。` },
      { label: '签证延期', amount: [5800, 5300, 5500].slice(0, count).reduce((a, b) => a + b, 0), note: `${this.visaLabel}；${count}次延期${this.extensionCount > 3 ? '，后续金额待确认' : ''}。` },
      { label: '管理费', amount: 2400, note: '四周参考金额。' },
      { label: '学生卡', amount: 200, note: '一次性费用。' },
      { label: '水费', amount: 1200, note: '四周参考金额；不含电费。' },
      { label: this.kindergarten ? '幼儿园教材' : '教材估算', amount: this.kindergarten ? 1000 : this.bookCount * this.bookPrice, note: this.kindergarten ? '四周参考金额。' : `${this.bookCount}本；不同课程类型教材分别购买，请填写全部课程所需教材的总本数，按实际购买结算。` },
    ];
    if (this.kindergarten && this.stationery) rows.push({ label: '幼儿园文具套装', amount: 2000, note: '可选，四周参考金额。' });
    return rows;
  }
  get localTotal(): number | null {
    if (this.localIssues.length) return validAmount(this.localAmount) && this.localConfirmation.trim() ? ciecMoney(this.localAmount) : null;
    return ciecMoney(this.localRows.reduce((sum, row) => sum + row.amount, 0));
  }
}

export function ciecResult(person: CiecPerson, people: CiecPerson[], family: boolean) {
  const issues = person.plan.error ? [person.plan.error] : [];
  if (!Number.isInteger(person.ageMonths) || person.ageMonths < 0 || person.ageMonths > 1200) issues.push('请填写有效的抵达时月龄。');
  if (person.kindergarten && (person.ageMonths < 48 || person.ageMonths >= 84)) issues.push('幼儿园课程适用于4–6岁。');
  if (person.ageMonths < 48 && person.plan.courses.some(row => row.optionId !== 'none')) issues.push('未满48个月请选择不就读，并确认儿童安排。');
  if (person.ageMonths >= 48 && person.role !== 'guardian' && person.plan.courses.some(row => row.optionId === 'none')) issues.push('不上课选项仅适用于监护人或未满48个月婴幼儿。');
  if (person.role === 'guardian' && person.age < 18) issues.push('监护人须18岁及以上。');
  const guardianCourses = person.plan.courses.some(row => row.optionId.startsWith('guardian-'));
  if (guardianCourses && (person.role !== 'guardian' || person.age < 18)) issues.push('家长课程须由18岁及以上监护人选择。');
  const pending: string[] = [];
  if (guardianCourses && person.plan.stayWeeks <= 12 && !people.some(row => family && row.role === 'child' && row.ageMonths < 48) && !person.eligibilityConfirmed)
    issues.push('本次家长课程资格与淡季优惠的关系须学校确认。');
  const first = person.plan.date(person.plan.startDate);
  const last = person.plan.date(person.plan.endDate);
  const monday = first === null ? '' : new Date(first + 86400000).toISOString().slice(0, 10);
  const friday = last === null ? '' : new Date(last - 86400000).toISOString().slice(0, 10);
  const campaign = CIEC_CAMPAIGNS.find(row => monday >= row.start && friday <= row.end);
  const overlaps = first !== null && last !== null && CIEC_CAMPAIGNS.some(row => first <= Date.parse(row.end + 'T00:00:00Z') && last >= Date.parse(row.start + 'T00:00:00Z'));
  const guardians = people.filter(row => row.role === 'guardian');
  const children = people.filter(row => row.role === 'child');
  const familyShape = family && guardians.length === 1 && (children.length === 1 || children.length === 2)
    && children.every(child => child.ageMonths >= 48 && child.ageMonths < 216)
    && guardians.length + children.length === people.length;
  const matching = people.every(row => row.plan.startDate === person.plan.startDate && row.plan.endDate === person.plan.endDate);
  const candidate = (family && person.role === 'guardian') || guardianCourses || (person.guardianCare && person.age >= 9 && person.plan.courses.every(row => row.optionId === 'junior-sparta') && !family);
  const eligible = !!campaign && person.plan.courseWeeks === 4 && (!family || (familyShape && matching));
  if (candidate && overlaps && person.plan.courseWeeks >= 4 && !eligible) pending.push('跨活动期、超过四周或家庭日期／人数不同，学校优惠金额须确认。');
  if (family && !familyShape) pending.push('标准家庭优惠要求一位监护人与一／两位就读幼儿园或青少年课程的子女；含婴幼儿等其他组合须确认。');
  if (person.plan.courses.some(row => row.optionId === 'none') && person.ageMonths >= 48 && !(eligible && familyShape && person.role === 'guardian') && !person.eligibilityConfirmed)
    issues.push('家长不上课的适用条件须学校确认。');
  if (person.guardianCare && (person.age < 9 || person.age >= 18 || guardians.length > 0 || family || person.plan.courses.some(row => row.optionId !== 'junior-sparta'))) issues.push('学校监护服务限9岁及以上未成年无监护人陪同的斯巴达学生。');
  if (person.annualFee && person.plan.courseWeeks < 4) pending.push('CIDEC短期课程费用须学校确认。');
  let remaining = person.courses + person.rooms;
  const promotionNotes: string[] = [];
  if (eligible && person.role === 'guardian' && familyShape) {
    if (familyShape) {
      const expectedRoom = children.length === 1 ? 'twin' : 'triple';
      if (people.some(row => row.plan.rooms.some(room => room.optionId !== expectedRoom))) pending.push('所选房型与家庭食宿优惠原价不对应，须确认。');
      else {
        remaining -= person.rooms;
        remaining += children.length === 1 ? campaign!.guardian : 0;
        promotionNotes.push(`${campaign!.year}淡季${children.length + 1}人家庭监护人食宿优惠`);
      }
    }
    for (const row of person.plan.courses) if (row.optionId.startsWith('guardian-')) {
      const ordinary = person.plan.price('course', row);
      remaining -= ordinary;
      remaining += (row.optionId === 'guardian-esl' ? 400 : 500) / 4 * row.weeks;
      promotionNotes.push(`${campaign!.year}淡季监护人课程优惠`);
    }
  }
  const originalCare = person.guardianCare ? 300 * person.plan.courseWeeks / 4 : 0;
  const waivedCare = originalCare > 0 && eligible && !family && guardians.length === 0 && person.age >= 9 && person.age < 18 && person.plan.courses.every(row => row.optionId === 'junior-sparta');
  let care = waivedCare ? 0 : originalCare;
  if (waivedCare) promotionNotes.push(`${campaign!.year}淡季免学校监护费`);
  const confirmed = validAmount(person.schoolAmount) && !!person.schoolConfirmation.trim();
  if (person.guardianCare && overlaps && person.plan.courseWeeks > 4) {
    if (confirmed && validAmount(person.confirmedCare)) care = person.confirmedCare;
    else issues.push('超过四周的监护费优惠须填写学校确认监护费。');
  }
  // Only unresolved school amounts can be replaced; hard age/date errors remain blocking.
  if (pending.length && confirmed) remaining = person.schoolAmount!;
  else issues.push(...pending);
  const schoolDiscount = ciecMoney(person.courses + person.rooms - remaining);
  const sidaDiscount = ciecMoney((remaining + person.annualFee) * .05);
  const total = issues.length ? null : ciecMoney(remaining - sidaDiscount + person.annualFee + person.registration + care + (person.pickup ? 20 : 0));
  return { issues, pending, confirmed: pending.length > 0 && confirmed, schoolDiscount, sidaDiscount, care, originalCare, waivedCare, total,
    promotionNotes: [...new Set(promotionNotes)], craft: eligible && campaign?.year === 2026 && person.role !== 'guardian' && person.age >= 6 && person.age < 13,
    studyStay: remaining };
}

import { buildPhilippinesDetailedQuote } from '../../../components/philippines-quote-image-data';
import { applySchoolQuoteImageLayout, quoteMoney, SchoolQuotePlan } from '../../../components/school-quote-plan';
import { QuoteImagePaymentItem } from '../../../components/quote-image-download-button.component';

export type IuIclCampus = 'IU' | 'ICL';
type PromoCourse = 'power4' | 'power6' | 'power8' | 'light' | 'junior' | 'ielts' | 'guarantee8' | 'guarantee12' | 'toeic';
type PromoRoom = 'single' | 'double' | 'triple' | 'quad';

export interface IuIclCourse {
  id: string;
  category: string;
  name: string;
  tuition: number;
  schedule: string;
  note: string;
  promoCourse?: PromoCourse;
  fixedWeeks?: 8 | 12;
}

export interface IuIclRoom {
  id: string;
  name: string;
  fee: number;
  note: string;
  promoRoom?: PromoRoom;
  accommodation?: boolean;
}

export interface IuIclLocalFee {
  item: string;
  amount: string;
  quantity: number;
  total: number;
  note: string;
}

const COMMON_COURSES: Record<string, Omit<IuIclCourse, 'id' | 'category' | 'name' | 'tuition'>> = {
  light: { schedule: '一对一4课时 + 选修课或自习', note: 'Light课程本身不参与课程优惠；淡季住宿组合仍按校方组合价表计算。', promoCourse: 'light' },
  power4: { schedule: '一对一4课时 + 团体课4课时 + 选修课或自习', note: '每周二或周四需参加口语训练。', promoCourse: 'power4' },
  power6: { schedule: '一对一6课时 + 团体课2课时 + 选修课或自习', note: '每周二或周四需参加口语训练。', promoCourse: 'power6' },
  power8: { schedule: '一对一8课时 + 选修课或自习', note: '每周二或周四需参加口语训练。', promoCourse: 'power8' },
  toeic: { schedule: '一对一4课时 + 团体课4课时', note: 'TOEIC考试训练；具体模考与晚间安排以学校课表为准。', promoCourse: 'toeic' },
  ielts: { schedule: '一对一4课时 + 团体课4课时 + 选修课或自习', note: 'IELTS训练；保证班以外不承诺目标分数。', promoCourse: 'ielts' },
  guarantee8: { schedule: '一对一6课时 + 团体课2课时 + 选修课或自习', note: '固定8周；须同时满足出勤、模考和进步要求。', promoCourse: 'guarantee8', fixedWeeks: 8 },
  guarantee12: { schedule: '一对一6课时 + 团体课2课时 + 选修课或自习', note: '固定12周；须同时满足出勤、模考和进步要求。', promoCourse: 'guarantee12', fixedWeeks: 12 },
  business4: { schedule: '一对一4课时 + 团体课4课时 + 选修课或自习', note: '商务沟通与职场表达训练。' },
  business6: { schedule: '一对一6课时 + 团体课2课时 + 选修课或自习', note: '增加一对一商务训练。' },
  kids: { schedule: '一对一4课时 + 团体课2课时 + 2节活动课（科学与数学）+ 选修体育活动', note: '7–12岁；亲子出行需确认监护与住宿安排。', promoCourse: 'junior' },
  junior: { schedule: '一对一4课时 + 团体课4课时 + 选修体育活动', note: '13–15岁；每周四需参加口语训练。', promoCourse: 'junior' },
};

const course = (
  id: string,
  category: string,
  name: string,
  tuition: number,
  common: keyof typeof COMMON_COURSES,
): IuIclCourse => ({ id, category, name, tuition, ...COMMON_COURSES[common] });

export const IU_COURSES: IuIclCourse[] = [
  course('light-esl', '轻量英语', 'Light ESL', 750, 'light'),
  course('power-speaking-4', '口语强化', 'Power Speaking 4', 850, 'power4'),
  course('power-speaking-6', '口语强化', 'Power Speaking 6', 1000, 'power6'),
  course('power-speaking-8', '口语强化', 'Power Speaking 8', 1150, 'power8'),
  course('toeic', '考试英语', 'TOEIC', 950, 'toeic'),
  course('ielts', '考试英语', 'IELTS', 1000, 'ielts'),
  course('ielts-guarantee-8', 'IELTS保证班', '8周 IELTS保证班', 1200, 'guarantee8'),
  course('ielts-guarantee-12', 'IELTS保证班', '12周 IELTS保证班', 1133, 'guarantee12'),
  course('business-4', '商务英语', '商务英语4', 950, 'business4'),
  course('business-6', '商务英语', '商务英语6', 1100, 'business6'),
  course('kids', '青少年英语', '儿童（7~12岁）', 900, 'kids'),
  course('junior', '青少年英语', '青少年（13~15岁）', 900, 'junior'),
  { id: 'beginner-4', category: '初级英语', name: 'Beginner 4', tuition: 850, schedule: '一对一4课时 + 团体课4课时', note: '适合英语初学者；不在本次淡季组合价表内。' },
  { id: 'beginner-6', category: '初级英语', name: 'Beginner 6', tuition: 1000, schedule: '一对一6课时 + 团体课2课时', note: '适合希望增加一对一课时的初学者；不在本次淡季组合价表内。' },
  { id: 'fitness', category: '健身英语', name: 'Fitness English', tuition: 1050, schedule: '一对一4课时 + 健身课3课时', note: '不在本次淡季组合价表内。' },
];

export const ICL_COURSES: IuIclCourse[] = [
  course('light-speaking', '轻量口语', 'Light Speaking', 750, 'light'),
  course('power-speaking-4', '标准口语', 'Power Speaking 4', 850, 'power4'),
  course('power-speaking-6', '强化口语', 'Power Speaking 6', 1000, 'power6'),
  course('power-speaking-8', '高一对一', 'Power Speaking 8', 1150, 'power8'),
  course('toeic', '多益方向', 'TOEIC', 950, 'toeic'),
  course('ielts', '雅思方向', 'IELTS', 1000, 'ielts'),
  course('ielts-guarantee-8', '雅思保证班', '8周 IELTS保证班', 1200, 'guarantee8'),
  course('ielts-guarantee-12', '雅思保证班', '12周 IELTS保证班', 1133, 'guarantee12'),
  course('business-4', '商务英语', '商务英语4', 950, 'business4'),
  course('business-6', '商务英语', '商务英语6', 1100, 'business6'),
  course('kids', '青少年', '青少年 7–12岁', 900, 'kids'),
  course('junior', '青少年', '青少年 13–15岁', 900, 'junior'),
];

const room = (id: string, name: string, fee: number, promoRoom: PromoRoom | undefined, note: string): IuIclRoom =>
  ({ id, name, fee, promoRoom, note, accommodation: true });

export const IU_ROOMS: IuIclRoom[] = [
  { id: 'walk-in', name: '走读（不住宿）', fee: 0, note: '只计算课程费；注册费100美元，淡季住宿组合价不适用。', accommodation: false },
  room('campus-single', '校内单人房', 950, 'single', '隐私最好；热门档期需提前确认。'),
  room('campus-double', '校内双人房', 800, 'double', '淡季海报标注2026/09/13起开放名额，实际以学校空房为准。'),
  room('campus-triple', '校内三人房', 700, 'triple', '淡季海报标注2026/09/13起开放名额，实际以学校空房为准。'),
  room('campus-quad', '校内四人房', 600, 'quad', '仅限家庭；实际入住资格与空房需确认。'),
  room('off-campus-single', '校外单人房', 1400, undefined, '不在本次淡季组合价表内；需确认交通、餐食和空房。'),
  room('off-campus-double', '校外双人房', 950, undefined, '不在本次淡季组合价表内；需确认交通、餐食和空房。'),
];

export const ICL_ROOMS: IuIclRoom[] = [
  { id: 'walk-in', name: '走读（不住宿）', fee: 0, note: '只计算课程费；注册费100美元，淡季住宿组合价不适用。', accommodation: false },
  room('campus-single', '校内单人房', 850, 'single', '隐私最好；热门档期需提前确认。'),
  room('campus-double', '校内双人房', 750, 'double', '适合同伴同行；实际以学校空房为准。'),
  room('campus-triple', '校内三人房', 700, 'triple', '淡季海报标注2026/10/04起开放名额，实际以学校空房为准。'),
  room('campus-quad', '校内四人房', 600, 'quad', '淡季海报标注2026/10/04起开放名额，实际以学校空房为准。'),
  room('off-campus-single', '校外单人房', 1450, undefined, '不在本次淡季组合价表内；需确认交通、餐食和空房。'),
  room('off-campus-double', '校外双人房', 1050, undefined, '不在本次淡季组合价表内；需确认交通、餐食和空房。'),
  room('off-campus-triple', '校外三人房', 950, undefined, '不在本次淡季组合价表内；需确认交通、餐食和空房。'),
];

const PROMO_FOUR_WEEK: Record<Exclude<PromoCourse, 'guarantee8' | 'guarantee12'>, Record<PromoRoom, number>> = {
  power4: { single: 1500, double: 1250, triple: 1150, quad: 1050 },
  power6: { single: 1650, double: 1400, triple: 1300, quad: 1200 },
  power8: { single: 1800, double: 1550, triple: 1450, quad: 1350 },
  light: { single: 1500, double: 1250, triple: 1150, quad: 1050 },
  junior: { single: 1550, double: 1300, triple: 1200, quad: 1100 },
  ielts: { single: 1650, double: 1350, triple: 1250, quad: 1150 },
  toeic: { single: 1650, double: 1350, triple: 1250, quad: 1150 },
};

const GUARANTEE_PROMO: Record<'guarantee8' | 'guarantee12', Record<PromoRoom, number>> = {
  guarantee8: { single: 3700, double: 3100, triple: 2900, quad: 2700 },
  guarantee12: { single: 5349, double: 4449, triple: 4149, quad: 3849 },
};

const multiplier = (weeks: number) => weeks === 1 ? 0.4 : weeks === 2 ? 0.6 : weeks === 3 ? 0.8 : weeks / 4;
const PROMO_START = '2026-08-23';
// The poster is valid through 2027/01/09 and separately requires graduation
// before 2027/01/16. With Sunday arrivals and Saturday departures, 01/09 is
// therefore the last eligible departure date.
const PROMO_LAST_DEPARTURE = '2027-01-09';

export const IU_ICL_GUARANTEE_RULES = [
  '出勤率须达到98%。',
  '必须完成全部模拟考试（Mock Test）。',
  '模拟考试成绩出现3次下降后，不再享有保分资格。',
  '学习期间每2周至少提高0.5 Band，否则取消保分资格。',
  '参加最终IELTS考试仍未达到目标分数时，学校最多免4周学费；住宿费、学杂费及其他费用不在保分范围内。',
];

export const IU_ICL_ADMISSION_RULES = [
  '全部费用须在抵达前28天付清；逾期未付，学校可取消报名；注册费不退。',
  '抵达前3周取消扣注册费；前2周取消扣注册费和1周住宿费；前1周取消扣注册费和2周住宿费。',
  '报名后首次变更开课日期免费，第二次起收100美元处理费；课程费和住宿费不得转给其他机构或学生。',
];

export class IuIclQuote {
  readonly courses: IuIclCourse[];
  readonly rooms: IuIclRoom[];
  readonly plan: SchoolQuotePlan;
  readonly registrationFee = 100;
  readonly admissionRules = IU_ICL_ADMISSION_RULES;

  constructor(readonly campus: IuIclCampus, courseId: string, roomId: string, startDate: string) {
    this.courses = (campus === 'IU' ? IU_COURSES : ICL_COURSES).map(item => ({ ...item }));
    this.rooms = (campus === 'IU' ? IU_ROOMS : ICL_ROOMS).map(item => ({ ...item }));
    this.plan = new SchoolQuotePlan(
      courseId,
      roomId,
      startDate,
      Array.from({ length: 24 }, (_, index) => index + 1),
      kind => (kind === 'course' ? this.courses : this.rooms).map(item => ({
        id: item.id,
        name: item.name,
        details: kind === 'course' ? (item as IuIclCourse).schedule : (item as IuIclRoom).note,
      })),
      (kind, row) => {
        const item = (kind === 'course' ? this.courses : this.rooms).find(option => option.id === row.optionId);
        const price = item ? ('tuition' in item ? item.tuition : item.fee) : 0;
        return Math.round(price * multiplier(row.weeks));
      },
      24,
    );
  }

  updatePrices(coursePrices: Map<string, number>, roomPrices: Map<string, number>): void {
    this.courses.forEach(item => { if (coursePrices.has(item.name)) item.tuition = coursePrices.get(item.name)!; });
    this.rooms.forEach(item => { if (roomPrices.has(item.name)) item.fee = roomPrices.get(item.name)!; });
  }

  get courseWeeks(): number { return this.plan.courseWeeks; }
  get accommodationWeeks(): number {
    return this.plan.rooms.reduce((sum, row) => sum + (this.rooms.find(room => room.id === row.optionId)?.accommodation ? row.weeks : 0), 0);
  }
  get regularCourseTotal(): number { return this.plan.total('course'); }
  get regularRoomTotal(): number { return this.plan.total('room'); }
  get promoPairCount(): number { return this.promoAdjustments.length; }
  get lowSeasonDiscount(): number { return this.promoAdjustments.reduce((sum, item) => sum + item.discount, 0); }
  get registrationWaiver(): number { return this.promoPairCount > 0 ? this.registrationFee : 0; }
  get total(): number { return this.registrationFee + this.regularCourseTotal + this.regularRoomTotal - this.lowSeasonDiscount - this.registrationWaiver; }
  get selectedStartDate(): string { return this.plan.startDate; }

  private get promoAdjustments(): Array<{ discount: number; course: IuIclCourse; room: IuIclRoom; weeks: number }> {
    const availableRooms = this.plan.rooms.map(row => ({ row, used: false }));
    const adjustments: Array<{ discount: number; course: IuIclCourse; room: IuIclRoom; weeks: number }> = [];
    for (const courseRow of this.plan.courses) {
      const selectedCourse = this.courses.find(courseItem => courseItem.id === courseRow.optionId);
      if (!selectedCourse?.promoCourse || courseRow.weeks < 4) continue;
      const roomMatch = availableRooms.find(item => !item.used && item.row.startDate === courseRow.startDate && item.row.weeks === courseRow.weeks);
      const selectedRoom = roomMatch && this.rooms.find(roomItem => roomItem.id === roomMatch.row.optionId);
      if (!roomMatch || !selectedRoom?.promoRoom) continue;
      const endDate = this.plan.end(courseRow);
      if (courseRow.startDate < PROMO_START || endDate > PROMO_LAST_DEPARTURE) continue;
      let promoPrice: number | undefined;
      if (selectedCourse.promoCourse === 'guarantee8' || selectedCourse.promoCourse === 'guarantee12') {
        promoPrice = selectedCourse.fixedWeeks === courseRow.weeks
          ? GUARANTEE_PROMO[selectedCourse.promoCourse][selectedRoom.promoRoom]
          : undefined;
      } else {
        promoPrice = Math.round(PROMO_FOUR_WEEK[selectedCourse.promoCourse][selectedRoom.promoRoom] * courseRow.weeks / 4);
      }
      if (promoPrice === undefined) continue;
      roomMatch.used = true;
      const regular = Math.round(selectedCourse.tuition * multiplier(courseRow.weeks)) + Math.round(selectedRoom.fee * multiplier(courseRow.weeks));
      adjustments.push({ discount: Math.max(0, regular - promoPrice), course: selectedCourse, room: selectedRoom, weeks: courseRow.weeks });
    }
    return adjustments;
  }

  get error(): string {
    if (this.plan.error) return this.plan.error;
    for (const row of this.plan.courses) {
      const selected = this.courses.find(item => item.id === row.optionId);
      if (selected?.fixedWeeks && row.weeks !== selected.fixedWeeks) return `${selected.name}为固定${selected.fixedWeeks}周课程，请把该课程周期改为${selected.fixedWeeks}周。`;
    }
    return '';
  }

  get warning(): string {
    if (this.error) return '';
    const unmatchedPromoCandidate = this.plan.courses.some(row => {
      const item = this.courses.find(courseItem => courseItem.id === row.optionId);
      return !!item?.promoCourse && row.weeks >= 4 && row.startDate >= PROMO_START && this.plan.end(row) <= PROMO_LAST_DEPARTURE;
    }) && this.promoPairCount === 0;
    if (unmatchedPromoCandidate) return '当前课程没有与同日期、同周数的淡季校内住宿配对，因此按2026常规价计算。';
    return this.plan.warning;
  }

  get promotionNote(): string {
    return this.promoPairCount
      ? `已按校方淡季组合价计算${this.promoPairCount}组同日期课程与校内住宿，并免收一次注册费；思达启航不再叠加任何额外优惠。`
      : '当前按校方2026常规价计算；思达启航不提供或叠加其它价格优惠。';
  }

  get availabilityNote(): string {
    return this.campus === 'IU'
      ? '淡季海报标注IU双人房、三人房自2026/09/13起开放名额；房间数量有限，须以学校确认为准。'
      : '淡季海报标注ICL三人房、四人房自2026/10/04起开放名额；房间数量有限，须以学校确认为准。';
  }

  get schoolPaymentItems(): QuoteImagePaymentItem[] {
    const planItems = this.plan.paymentItems().map(item => ({
      ...item,
      label: item.label.replace(/^课程费/, '课程名称').replace(/^住宿费/, '住宿名称'),
    }));
    return [
      { icon: '注', label: '注册费', amount: `${quoteMoney(this.registrationFee)} 美元`, note: '一次性、不可退；仅符合本次校方淡季住宿组合价时免收。' },
      ...planItems,
      ...(this.lowSeasonDiscount > 0 ? [{ icon: '惠', label: '校方淡季组合价调整', amount: `− ${quoteMoney(this.lowSeasonDiscount)} 美元`, note: '海报有效期为2026/08/23–2027/01/09，且须在2027/01/16前结业；同日期课程与校内住宿满4周，按校方组合价表计算；不与其它优惠叠加。', accent: true }] : []),
      ...(this.registrationWaiver > 0 ? [{ icon: '免', label: '校方免注册费', amount: `− ${quoteMoney(this.registrationWaiver)} 美元`, note: '本次淡季住宿组合价已含免注册费；不再叠加思达启航或其它中介优惠。', accent: true }] : []),
    ];
  }

  get visaExtensionCount(): number {
    return this.plan.stayWeeks <= 4 ? 0 : Math.min(5, Math.ceil((this.plan.stayWeeks - 4) / 4));
  }

  get localFees(): IuIclLocalFee[] {
    const fees: IuIclLocalFee[] = [
      { item: 'SSP特别学习许可', amount: '7,800 比索／次', quantity: 1, total: 7800, note: '一次性办理。' },
      { item: 'SSP E-Card', amount: '4,500 比索／次', quantity: 1, total: 4500, note: '一次性办理。' },
      ...(this.accommodationWeeks ? [
        { item: '机场接机', amount: '800 比索／次', quantity: 1, total: 800, note: '校方价目表的一次性接机参考。' },
        { item: '教材费预估', amount: '2,000 比索／人', quantity: 1, total: 2000, note: '按每本250–600比索估算；实际以领取教材为准。' },
        { item: '宿舍押金', amount: '3,000 比索／人', quantity: 1, total: 3000, note: '退房无损坏且无欠费时按学校规则退还；本表计入到校需准备金额。' },
        { item: '维护费', amount: '400 比索／周', quantity: this.accommodationWeeks, total: 400 * this.accommodationWeeks, note: '按实际住宿周数计算。' },
        { item: '电费', amount: '500 比索／周', quantity: this.accommodationWeeks, total: 500 * this.accommodationWeeks, note: '含每周25千瓦时；超出部分按25比索／千瓦时收取，已付电费不退。' },
        { item: '洗衣费', amount: '300 比索／周', quantity: this.accommodationWeeks, total: 300 * this.accommodationWeeks, note: '每周2次。' },
      ] : [
        { item: '教材费预估', amount: '2,000 比索／人', quantity: 1, total: 2000, note: '按每本250–600比索估算；实际以领取教材为准。' },
      ]),
    ];
    if (this.visaExtensionCount >= 1) fees.push({ item: '第1次签证延长', amount: '5,500 比索／次', quantity: 1, total: 5500, note: '5–8周参考，延长29天。' });
    if (this.visaExtensionCount >= 2) {
      fees.push({ item: '第2次签证延长', amount: '6,500 比索／次', quantity: 1, total: 6500, note: '9–12周参考，延长1个月。' });
      fees.push({ item: 'ACR I-Card', amount: '4,500 比索／次', quantity: 1, total: 4500, note: '停留超过59天时随第2次签证延长办理。' });
    }
    if (this.visaExtensionCount >= 3) {
      const quantity = this.visaExtensionCount - 2;
      fees.push({ item: '第3–5次签证延长', amount: '5,500 比索／次', quantity, total: 5500 * quantity, note: '每次延长1个月；24周内最多按3次估算。' });
    }
    return fees;
  }

  get localFeeTotal(): number { return this.localFees.reduce((sum, item) => sum + item.total, 0); }
  get optionalFees() {
    return [{ label: '额外住宿（每人）', amount: '1,300 比索／晚', note: '仅在超出标准周日入住、周六13:00退房安排时另计；需先确认空房。' }];
  }
  get localFeeIntro(): string {
    return '按校方2026价目表自动估算。4/8/12/16/24周校内住宿方案应分别为22,900/33,200/49,000/59,300/79,900比索；其中押金为可退金额，教材与签证最终以实际办理为准。';
  }

  imageData(usdToCny: number, phpPerCny: number, exchangeDate: string | undefined, heroSrc: string) {
    const schoolName = this.campus === 'IU' ? '菲律宾宿务IU English Academy' : '菲律宾宿务ICL English Academy';
    const quote = buildPhilippinesDetailedQuote({
      schoolCode: this.campus,
      schoolName,
      filePrefix: this.campus,
      heroSrc,
      weeks: this.courseWeeks,
      startDate: this.selectedStartDate,
      usdToCny,
      totalUsd: this.total,
      paymentItems: this.schoolPaymentItems,
      localFeeItems: this.localFees.map(item => ({ label: item.item, unit: item.amount, quantity: String(item.quantity), amount: `${quoteMoney(item.total)} 比索`, note: item.note })),
      localFeeTotal: this.localFeeTotal,
      localCurrencyName: '比索',
      localFeeCny: Math.round(this.localFeeTotal / phpPerCny),
      localFeeNote: this.localFeeIntro,
      optionalFeeItems: this.optionalFees,
      ruleNotes: [],
      fullFeeDetails: true,
      localFeeTableLayout: 'web',
    });
    const guaranteeSelected = this.plan.courses.some(row => this.courses.find(item => item.id === row.optionId)?.fixedWeeks);
    const importantNotes = [
      ...(this.warning ? [this.warning] : []),
      this.promotionNote,
      this.availabilityNote,
      ...(guaranteeSelected ? IU_ICL_GUARANTEE_RULES : []),
      ...this.admissionRules,
      '入学/入住按周日，结业/退房按周六；课程、住宿和当地费用最终以学校书面确认为准。',
    ];
    const result = applySchoolQuoteImageLayout({
      ...quote,
      hideAlumniBenefit: true,
      alumniBenefitItems: [],
      totalIncludedLabel: this.promoPairCount ? '校方淡季价已计入' : '按校方常规价计算',
      finalConfirmationText: '最终以学校书面确认的价格与空房为准。',
      importantNotes,
      benefitItems: [
        { title: '0中介费', text: '不额外加收报名服务费' },
        { title: '校方价格', text: '常规价或符合条件的校方淡季组合价' },
        { title: '全程报名协助', text: '选校、签证、付款及行前指导' },
        { title: '宿务驻点售后', text: '学习期间持续跟进' },
      ],
    }, this.campus, this.courseWeeks, this.selectedStartDate, this.total, usdToCny);
    return {
      ...result,
      conversionRates: { usdToCny, phpPerCny, date: exchangeDate },
    };
  }
}

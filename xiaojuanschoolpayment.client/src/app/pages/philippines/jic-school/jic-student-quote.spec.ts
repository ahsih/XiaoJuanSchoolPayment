import {
  JIC_COURSE_FEES,
  JIC_PEAK_FEE_PER_WEEK,
  JIC_REGISTRATION_FEE,
  JIC_ROOM_FEES,
} from './jic-pricing';
import { cloneJicContentConfig, createDefaultJicContentConfig } from './jic-content-config';
import { JicStudentQuote } from './jic-student-quote';
import { groupPaymentLines } from '../../../components/school-group-quote';

describe('JicStudentQuote', () => {
  const prices = () => ({
    courseFees: JIC_COURSE_FEES.map((item) => ({ ...item })),
    roomFees: JIC_ROOM_FEES.map((item) => ({ ...item })),
    registrationFee: JIC_REGISTRATION_FEE,
    seasonalFeePerWeek: JIC_PEAK_FEE_PER_WEEK,
  });
  const quote = () => new JicStudentQuote(prices());
  const setPlan = (student: JicStudentQuote, weeks: number, startDate: string, roomId?: string) => {
    student.quotePlan.courses[0].weeks = weeks;
    student.quotePlan.rooms[0].weeks = weeks;
    student.quotePlan.courses[0].startDate = startDate;
    student.quotePlan.rooms[0].startDate = startDate;
    if (roomId) student.quotePlan.rooms[0].optionId = roomId;
  };

  it('keeps the confirmed two-campus course and room catalog', () => {
    const expectedTuition: Record<string, number> = {
      'challenger-esl-lite': 760,
      'challenger-esl-core': 860,
      'challenger-esl-standard': 960,
      'challenger-ielts-lite': 960,
      'challenger-ielts-core': 1010,
      'challenger-ielts-standard': 1060,
      'challenger-ielts-guarantee': 1060,
      'premium-speaking-starter-7': 800,
      'premium-speaking-pro-8': 975,
      'premium-speaking-master-8': 1150,
      'premium-tep-8': 800,
      'premium-tep-9': 900,
      'premium-tep-10': 1000,
      'premium-active-senior-5': 600,
      'premium-active-senior-6': 700,
      'premium-working-holiday-8': 900,
      'premium-toeic': 900,
      'premium-business-master-8': 1150,
    };
    expect(JIC_COURSE_FEES.length).toBe(18);
    expect(Object.fromEntries(JIC_COURSE_FEES.map((item) => [item.id, item.tuition]))).toEqual(expectedTuition);
    expect(JIC_ROOM_FEES.length).toBe(10);
    expect(JIC_COURSE_FEES.find((item) => item.id === 'challenger-esl-lite')?.tuition).toBe(760);
    expect(JIC_COURSE_FEES.find((item) => item.id === 'premium-speaking-master-8')?.tuition).toBe(1150);
    expect(JIC_COURSE_FEES.find((item) => item.id === 'premium-junior')).toBeUndefined();
    expect(JIC_COURSE_FEES.find((item) => item.id === 'premium-guardian')).toBeUndefined();
    expect(JIC_ROOM_FEES.find((item) => item.id === 'challenger-quad-bunk')?.fee).toBe(600);
    expect(JIC_ROOM_FEES.find((item) => item.id === 'premium-single-balcony')?.fee).toBe(1450);
    expect(JIC_COURSE_FEES.every((item) => /[A-Za-z]/.test(item.displayName) && /[\u4e00-\u9fff]/.test(item.displayName))).toBeTrue();
    const student = quote();
    expect(student.quotePlan.options('course')[0].name).toBe(JIC_COURSE_FEES[0].displayName);
    expect(student.quotePlan.paymentItems().find((item) => item.icon === '课')?.detailTitle).toBe(JIC_COURSE_FEES[0].displayName);
  });

  it('keeps the latest Challenger class counts and guarantee supplement cadence', () => {
    const lite = JIC_COURSE_FEES.find((item) => item.id === 'challenger-esl-lite')!;
    const standard = JIC_COURSE_FEES.find((item) => item.id === 'challenger-ielts-standard')!;
    expect(lite.suitable).toContain('每日共8节');
    expect(standard.suitable).toContain('每日共10节');
    expect(standard.suitable).toContain('半斯巴达每两周模考');

    const student = quote();
    student.quotePlan.courses[0].optionId = 'challenger-ielts-guarantee';
    setPlan(student, 8, '2026-09-06');
    expect(student.localFees.find((item) => item.item === 'IELTS保分班额外费用')?.quantity).toBe(1);
    expect(student.localFees.find((item) => item.item === 'IELTS保分班额外费用')?.total).toBe(18000);
    setPlan(student, 12, '2026-09-06');
    expect(student.localFees.find((item) => item.item === 'IELTS保分班额外费用')?.quantity).toBe(2);
    expect(student.localFees.find((item) => item.item === 'IELTS保分班额外费用')?.total).toBe(36000);
  });

  it('uses the latest one-to-three-week ratios and prorates a six-week plan', () => {
    const student = quote();
    expect(student.quotePlan.allowedWeeks).toEqual([1, 2, 3, 4, 6, 8, 12, 16, 20, 24]);
    setPlan(student, 1, '2026-09-06');
    expect(student.tuition).toBe(304);
    expect(student.accommodation).toBe(240);
    setPlan(student, 2, '2026-09-06');
    expect(student.tuition).toBe(494);
    expect(student.accommodation).toBe(390);
    setPlan(student, 3, '2026-09-06');
    expect(student.tuition).toBe(646);
    expect(student.accommodation).toBe(510);
    setPlan(student, 6, '2026-09-06');
    expect(student.tuition).toBe(1140);
    expect(student.accommodation).toBe(900);
    expect(student.localFees.find((item) => item.item === '水电费')?.quantity).toBe(1.5);
    expect(student.localFees.find((item) => item.item === '水电费')?.total).toBe(4500);
    expect(student.localFees.find((item) => item.item === '洗衣服务')?.total).toBe(1800);
  });

  it('calculates the latest course-specific textbook amount every started four weeks', () => {
    const student = quote();
    setPlan(student, 8, '2026-09-06');
    expect(student.localFees.find((item) => item.item === '教材费')?.quantity).toBe(2);
    expect(student.localFees.find((item) => item.item === '教材费')?.total).toBe(3000);
    setPlan(student, 12, '2026-09-06');
    expect(student.localFees.find((item) => item.item === '教材费')?.quantity).toBe(3);
    expect(student.localFees.find((item) => item.item === '教材费')?.total).toBe(4500);
  });

  it('applies the confirmed 30-day and 59-day tourist visa thresholds and adds ACR only once', () => {
    const student = quote();
    setPlan(student, 4, '2026-09-06');
    expect(student.visaExtensionCount).toBe(0);
    setPlan(student, 6, '2026-09-06');
    expect(student.visaExtensionCount).toBe(1);
    setPlan(student, 8, '2026-09-06');
    expect(student.visaExtensionCount).toBe(1);
    expect(student.localFees.find((item) => item.item.startsWith('ACR-I CARD'))?.quantity).toBe(1);
    student.visaType = 'tourist59';
    setPlan(student, 6, '2026-09-06');
    expect(student.visaExtensionCount).toBe(0);
    expect(student.localFees.find((item) => item.item.startsWith('ACR-I CARD'))?.quantity).toBe(0);
    setPlan(student, 8, '2026-09-06');
    expect(student.visaExtensionCount).toBe(1);
    setPlan(student, 12, '2026-09-06');
    expect(student.visaExtensionCount).toBe(2);
    setPlan(student, 24, '2026-09-06');
    expect(student.visaExtensionCount).toBe(5);
    expect(student.localFees.find((item) => item.item.startsWith('ACR-I CARD'))?.quantity).toBe(1);
    expect(student.localFees.find((item) => item.item === '签证续签')?.total).toBe(23870);
  });

  it('charges the confirmed 2026 peak surcharge only for covered course weeks', () => {
    const student = quote();
    setPlan(student, 4, '2026-06-28');
    expect(student.peakWeeks).toBe(4);
    expect(student.seasonalSurcharge).toBe(160);
    setPlan(student, 4, '2027-06-27');
    expect(student.peakWeeks).toBe(0);
  });

  it('applies 2026 and 2027 low-season discounts by arrival date and room', () => {
    const challenger = quote();
    setPlan(challenger, 4, '2026-08-23');
    expect(challenger.offSeasonDiscount).toBe(150);
    challenger.quotePlan.rooms[0].optionId = 'challenger-single';
    expect(challenger.offSeasonDiscount).toBe(50);
    challenger.isExtensionStudent = true;
    expect(challenger.offSeasonDiscount).toBe(0);

    const premium = quote();
    premium.setCampus('premium');
    setPlan(premium, 4, '2027-02-21', 'premium-single-balcony');
    expect(premium.offSeasonDiscount).toBe(0);
    premium.quotePlan.rooms[0].optionId = 'premium-single-no-balcony';
    expect(premium.offSeasonDiscount).toBe(50);
  });

  it('applies long-term tiers while keeping the Sida registration waiver', () => {
    const student = quote();
    student.selectedRegistrationDate = '2026-03-08';
    for (const [weeks, discount] of [[12, 300], [16, 400], [20, 500], [24, 600]] as const) {
      setPlan(student, weeks, '2026-03-08');
      expect(student.longTermDiscount).toBe(discount);
      expect(student.registrationDiscount).toBe(100);
    }
  });

  it('waives registration for every Sida student and identifies returning students separately', () => {
    const student = quote();
    setPlan(student, 4, '2026-09-06');
    expect(student.registrationDiscount).toBe(100);
    expect(student.registrationDiscountNote).toContain('思达启航');
    const registrationLine = student.paymentLines.find((line) => line.promotionKey === 'jic-registration');
    expect(registrationLine?.label).toBe('思达注册费减免');
    expect(registrationLine?.value).toBe(-100);
    student.returningStudent = true;
    expect(student.registrationDiscount).toBe(100);
    expect(student.registrationDiscountNote).toContain('老学员');
  });

  it('shows the full waiver for both campuses and aggregates it in a group quote image', () => {
    const challenger = quote();
    const premium = quote();
    premium.setCampus('premium');
    premium.returningStudent = true;
    setPlan(challenger, 4, '2026-09-06');
    setPlan(premium, 4, '2026-09-06', 'premium-quad-no-balcony');

    expect(challenger.registrationDiscount).toBe(100);
    expect(premium.registrationDiscount).toBe(100);
    const imageRows = groupPaymentLines([challenger, premium], true);
    const registrationRow = imageRows.find((row) => row.promotionKey === 'jic-registration');
    expect(registrationRow?.amount).toBe('− 200 美元');
    expect(registrationRow?.note).toContain('学生1');
    expect(registrationRow?.note).toContain('学生2');
  });

  it('calculates BESA by complete four-week blocks and does not apply it to extensions', () => {
    const student = quote();
    student.selectedRegistrationDate = '2026-05-01';
    setPlan(student, 6, '2026-08-23');
    expect(student.besaDiscount).toBe(100);
    setPlan(student, 8, '2026-08-23');
    expect(student.besaDiscount).toBe(200);
    student.isExtensionStudent = true;
    expect(student.besaDiscount).toBe(0);
  });

  it('applies the holiday benefit once to twin or quad rooms and allows stacking', () => {
    const student = quote();
    student.selectedRegistrationDate = '2026-05-01';
    setPlan(student, 12, '2026-11-29', 'challenger-twin');
    expect(student.holidayDiscount).toBe(200);
    expect(student.offSeasonDiscount).toBe(150);
    expect(student.longTermDiscount).toBe(300);
    expect(student.besaDiscount).toBe(300);
  });

  it('includes only the selected airport pickup and keeps the room deposit outside local fees', () => {
    const student = quote();
    student.airportPickup = 'clark';
    const manila = student.localFees.find((item) => item.item === '马尼拉机场接机');
    const clark = student.localFees.find((item) => item.item === '克拉克机场接机');
    expect(manila?.total).toBe(0);
    expect(clark?.total).toBe(2500);
    expect(student.localFees.some((item) => item.item.includes('押金'))).toBeFalse();
  });

  it('uses the same payment lines that produce the displayed school total', () => {
    const student = quote();
    student.selectedRegistrationDate = '2026-05-01';
    setPlan(student, 12, '2026-11-29', 'challenger-twin');
    const expected = 100 + student.tuition + student.accommodation + student.paymentLines.reduce((sum, line) => sum + line.value, 0);
    expect(student.quoteUsd).toBe(expected);
  });

  it('blocks non-Sunday starts and overlapping rows', () => {
    const student = quote();
    setPlan(student, 4, '2026-09-07');
    expect(student.quoteError).toContain('周日');
    setPlan(student, 4, '2026-09-06');
    student.quotePlan.add('course');
    student.quotePlan.courses[1].startDate = '2026-09-06';
    expect(student.quoteError).toContain('重叠');
  });

  it('uses employee-edited JIC fees and promotion rules from the published content', () => {
    const config = createDefaultJicContentConfig();
    const utilities = config.localFees.find((item) => item.id === 'utilities')!;
    utilities.amount = 3600;
    const registration = config.quoteSettings.promotions.find((item) => item.ruleKind === 'jic-registration')!;
    registration.minimumCourseWeeks = 4;
    const dynamicPrices = {
      ...prices(),
      registrationFee: 125,
      rules: {
        localFees: config.localFees,
        promotions: config.quoteSettings.promotions,
        peakSeasonRanges: config.quoteSettings.peakSeasonRanges,
      },
    };
    const student = new JicStudentQuote(dynamicPrices);
    setPlan(student, 4, '2026-09-06');
    expect(student.localFees.find((item) => item.item === '水电费')?.total).toBe(3600);
    expect(student.registrationDiscount).toBe(125);
  });

  it('upgrades a published legacy registration rule to the universal Sida waiver', () => {
    const legacy = createDefaultJicContentConfig();
    const registration = legacy.quoteSettings.promotions.find((item) => item.ruleKind === 'jic-registration')!;
    registration.name = '注册费优惠';
    registration.description = '仅12周及以上学生免注册费。';
    registration.minimumCourseWeeks = 12;
    registration.enabled = false;
    legacy.quoteImageSettings.paymentNotes.registration = '每名学生一次；符合条件时在优惠行抵扣';
    legacy.campusQuoteImageSettings = undefined;

    const upgraded = cloneJicContentConfig(legacy);
    const upgradedRegistration = upgraded.quoteSettings.promotions.find((item) => item.ruleKind === 'jic-registration')!;
    expect(upgradedRegistration.enabled).toBeTrue();
    expect(upgradedRegistration.minimumCourseWeeks).toBe(0);
    expect(upgradedRegistration.description).toContain('所有通过思达启航报名');
    expect(upgraded.campusQuoteImageSettings?.['challenger']?.paymentNotes.registration).toContain('全额减免');
    expect(upgraded.campusQuoteImageSettings?.['premium']?.paymentNotes.registration).toContain('全额减免');
  });

  it('stops applying an offer after an employee disables it', () => {
    const config = createDefaultJicContentConfig();
    config.quoteSettings.promotions
      .filter((item) => item.ruleKind?.startsWith('jic-off-season'))
      .forEach((item) => item.enabled = false);
    const student = new JicStudentQuote({
      ...prices(),
      rules: {
        localFees: config.localFees,
        promotions: config.quoteSettings.promotions,
        peakSeasonRanges: config.quoteSettings.peakSeasonRanges,
      },
    });
    setPlan(student, 4, '2026-09-06');
    expect(student.offSeasonDiscount).toBe(0);
  });
});

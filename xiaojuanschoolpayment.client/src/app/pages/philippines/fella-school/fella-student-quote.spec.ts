import { FELLA_COURSE_FEES, FELLA_ROOM_FEES } from './fella-pricing';
import { FellaStudentQuote } from './fella-student-quote';

describe('FellaStudentQuote', () => {
  const prices = {
    courseFees: FELLA_COURSE_FEES.map((course) => ({ ...course })),
    roomFees: FELLA_ROOM_FEES.map((room) => ({ ...room })),
    registrationFee: 100,
  };
  const create = () => new FellaStudentQuote(prices);
  const setWeeks = (student: FellaStudentQuote, weeks: number) => {
    student.quotePlan.courses[0].weeks = weeks;
    student.quotePlan.rooms[0].weeks = weeks;
  };

  it('calculates the confirmed four-week default and 27,940-peso local-fee total', () => {
    const student = create();

    expect(student.quoteUsd).toBe(1715);
    expect(student.visaType).toBe('tourist30');
    expect(student.localFees.reduce((sum, fee) => sum + fee.total, 0)).toBe(27940);
  });

  it('recommends the 59-day visa at eight weeks and calculates each local fee rule', () => {
    const student = create();
    setWeeks(student, 8);

    expect(student.visaType).toBe('tourist59');
    expect(student.touristExtensionCount).toBe(1);
    expect(student.localFees.find((fee) => fee.item === '管理费')?.total).toBe(4500);
    expect(student.localFees.find((fee) => fee.item === '教材费')?.total).toBe(2500);
    expect(student.localFees.reduce((sum, fee) => sum + fee.total, 0)).toBe(29940);
  });

  it('applies July, then 95%, then the full Christmas deduction', () => {
    const student = create();
    student.selectedRegistrationDate = '2026-07-15';
    student.quotePlan.courses[0].startDate = '2026-12-20';
    student.quotePlan.rooms[0].startDate = '2026-12-20';

    expect(student.registrationPromotionDiscount).toBe(50);
    expect(student.sidaDiscount).toBe(82.5);
    expect(student.christmasDiscount).toBe(200);
    expect(student.quoteUsd).toBe(1467.5);
  });

  it('keeps the 24-week tier, full week label and unknown later visa renewals explicit', () => {
    const student = create();
    student.selectedRegistrationDate = '2026-07-01';
    setWeeks(student, 24);
    student.quotePlan.courses[0].startDate = '2026-02-01';
    student.quotePlan.rooms[0].startDate = '2026-02-01';

    expect(student.registrationPromotionDiscount).toBe(300);
    expect(student.sidaDiscount).toBe(495);
    expect(student.quoteUsd).toBe(9505);
    expect(student.visaType).toBe('tourist59');
    expect(student.touristExtensionCount).toBe(5);
    expect(student.localFees.find((fee) => fee.item.includes('第2次及以后'))).toEqual(jasmine.objectContaining({ quantity: 4, total: 0 }));
  });

  it('excludes the Chinese-named family courses from July and Sida discounts', () => {
    const student = create();
    student.setCampus('campus2');
    student.quotePlan.courses[0].optionId = 'p-jec';
    student.selectedRegistrationDate = '2026-07-15';

    expect(student.containsFamilyCourse).toBeTrue();
    expect(student.registrationPromotionDiscount).toBe(0);
    expect(student.sidaDiscount).toBe(0);
    expect(student.quoteUsd).toBe(1950);
  });

  it('charges an unaccompanied minor exactly 25 dollars per course week', () => {
    const student = create();
    setWeeks(student, 8);
    student.isMinor = true;

    expect(student.minorServiceFee).toBe(200);
    expect(student.quoteUsd).toBe(3530);
  });

  it('keeps students on different campus catalogs and resets unavailable courses', () => {
    const firstCampusStudent = create();
    const secondCampusStudent = create();
    firstCampusStudent.quotePlan.courses[0].optionId = 'pigi';
    secondCampusStudent.setCampus('campus2');

    expect(firstCampusStudent.quotePlan.options('course').some((course) => course.id === 'pigi')).toBeTrue();
    expect(secondCampusStudent.quotePlan.options('course').some((course) => course.id === 'pigi')).toBeFalse();
    secondCampusStudent.quotePlan.courses[0].optionId = 'jec';
    secondCampusStudent.setCampus('campus1');
    expect(secondCampusStudent.quotePlan.courses[0].optionId).toBe('pic-4');
  });

  it('blocks overlapping rows and warns when course and accommodation dates differ', () => {
    const overlapping = create();
    overlapping.quotePlan.add('course');
    overlapping.quotePlan.courses[1].startDate = overlapping.quotePlan.courses[0].startDate;
    expect(overlapping.quoteError).toContain('课程日期有重叠');

    const mismatched = create();
    mismatched.quotePlan.rooms[0].startDate = '2026-09-20';
    expect(mismatched.quoteError).toBe('');
    expect(mismatched.quotePlan.warning).toContain('课程与住宿日期不一致');
  });

  it('uses a manually selected 30-day visa for an eight-week renewal estimate', () => {
    const student = create();
    setWeeks(student, 8);
    student.visaType = 'tourist30';

    expect(student.visaWasManuallySelected).toBeTrue();
    expect(student.touristExtensionCount).toBe(2);
    expect(student.localFees.find((fee) => fee.item.includes('第2次及以后'))?.quantity).toBe(1);
  });

  it('keeps long-term visa amounts unpriced instead of inventing exemptions', () => {
    const student = create();
    student.visaType = 'student';

    const visaRows = student.localFees.filter((fee) => ['SSP特殊学习许可证', 'SSP E-CARD', 'ACR I-CARD 外国人身份证', 'ARP外国人登记', '签证续签'].includes(fee.item));
    expect(visaRows.every((fee) => fee.total === 0 && fee.note.includes('不代表法定豁免'))).toBeTrue();
  });
});

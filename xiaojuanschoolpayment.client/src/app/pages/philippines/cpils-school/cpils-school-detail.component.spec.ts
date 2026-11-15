import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, of } from 'rxjs';
import { ExchangeRateService } from '../../../../services/exchange-rate.service';
import { SchoolContentService } from '../../../../services/school-content.service';
import { SchoolService } from '../../../../services/school.service';
import { CpilsSchoolDetailComponent } from './cpils-school-detail.component';
import { cloneCpilsContentConfig, createDefaultCpilsContentConfig } from './cpils-content-config';
import { cpilsPriceYear } from './cpils-pricing';

describe('CPILS group quote', () => {
  let component: CpilsSchoolDetailComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [
      { provide: SchoolService, useValue: { getSchools: () => of([]) } },
      { provide: ExchangeRateService, useValue: { getLatestCnyRates: () => EMPTY } },
      { provide: SchoolContentService, useValue: { getPublished: () => of(null) } },
      { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: { get: () => null } } } },
      { provide: ElementRef, useValue: new ElementRef(document.createElement('div')) },
    ] });
    component = TestBed.runInInjectionContext(() => new CpilsSchoolDetailComponent());
    component.selectedRegistrationDate = '2026-09-01';
    component.selectedStartDate = '2026-09-06';
  });

  it('calculates a mixed two-student quote per person and keeps the image synchronized', () => {
    component.setQuoteMode('group');
    component.studentCount = 2;
    component.activeStudents.forEach(student => { student.selectedRegistrationDate = '2026-09-01'; student.quotePlan.updateStartDate('course', student.quotePlan.courses[0].id, '2026-09-06'); });
    component.students[0].pickupSelected = true;
    component.students[1].returningStudent = true;
    component.students[1].visaType = 'work';
    component.students[1].selectedAgeGroup = 'minor';

    expect(component.payableRegistrationFee).toBe(125);
    expect(component.excludedLocalFees[0].quantity).toBe(1);
    expect(component.excludedLocalFees[0].total).toBe(1000);
    expect(component.excludedLocalFees[0].note).toContain('学校团体接机');
    expect(component.includedLocalFees.find(row => row.item === '学生2 · SSP特殊学习许可证')?.total).toBe(0);
    expect(component.includedLocalFees.find(row => row.item === '学生2 · ARP外国人登记')?.total).toBe(300);
    expect(component.quoteImageData.paymentItems.filter(row => row.label === '注册费').length).toBe(1);
    expect(component.quoteImageData.paymentItems.some(row => row.label.startsWith('学生2 · 课程'))).toBeTrue();
    expect(component.quoteImageData.totalUsd).toBe(component.quoteUsdText);
  });

  it('keeps single-person weeks synchronized across the page and image metadata', () => {
    component.selectedWeeks = 12;
    const date = component.selectedStartDate.replace(/-/g, '');

    expect(component.quoteHeading).toBe('CPILS12周报价');
    expect(component.quoteImageData.headingText).toBe('CPILS12周报价');
    expect(component.quoteImageData.title).toBe('12周');
    expect(component.quoteImageData.fileName).toBe(`CPILS12周报价-${date}.png`);
  });

  it('describes equal and mixed two-person weeks without using person-week totals', () => {
    component.selectedWeeks = 12;
    const singleTotal = component.quoteUsd;
    component.setQuoteMode('group');
    component.studentCount = 2;
    component.activeStudents.forEach(student => { student.selectedRegistrationDate = '2026-09-01'; student.quotePlan.updateStartDate('course', student.quotePlan.courses[0].id, '2026-09-06'); });
    component.students[1].quotePlan.courses[0].weeks = 12;
    component.students[1].quotePlan.rooms[0].weeks = 12;

    expect(component.quoteHeading).toBe('CPILS 2人·每人12周报价');
    expect(component.quoteImageData.headingText).toBe(component.quoteHeading);
    expect(component.quoteImageData.title).toBe('2人·每人12周');
    expect(component.quoteImageData.fileName).toBe(`CPILS 2人·每人12周报价-${component.selectedStartDate.replace(/-/g, '')}.png`);
    expect(component.quoteImageData.headingText).not.toContain('24周报价');
    expect(component.quoteUsd).toBe(singleTotal * 2);

    component.students[1].quotePlan.courses[0].weeks = 8;
    component.students[1].quotePlan.rooms[0].weeks = 8;
    const mixedQuote = component.quoteImageData;
    expect(component.quoteHeading).toBe('CPILS 2人·不同周数报价');
    expect(mixedQuote.headingText).toBe(component.quoteHeading);
    expect(mixedQuote.title).toBe('2人·不同周数');
    expect(mixedQuote.fileName).toBe(`CPILS 2人·不同周数报价-${component.selectedStartDate.replace(/-/g, '')}.png`);
    expect(`${mixedQuote.headingText}${mixedQuote.title}`).not.toContain('20周');
    expect(JSON.stringify(mixedQuote.paymentItems)).toContain('12周');
    expect(JSON.stringify(mixedQuote.paymentItems)).toContain('8周');
    expect(component.quoteUsd).toBe(component.activeStudents.reduce((sum, student) => sum + component.studentQuoteUsd(student), 0));
  });

  it('uses the actual three-person week pattern instead of a summed duration', () => {
    component.setQuoteMode('group');
    component.studentCount = 3;
    component.activeStudents.forEach(student => { student.selectedRegistrationDate = '2026-09-01'; student.quotePlan.updateStartDate('course', student.quotePlan.courses[0].id, '2026-09-06'); });
    component.activeStudents.forEach(student => {
      student.quotePlan.courses[0].weeks = 8;
      student.quotePlan.rooms[0].weeks = 8;
    });

    expect(component.quoteHeading).toBe('CPILS 3人·每人8周报价');
    expect(component.quoteImageData.title).toBe('3人·每人8周');
    expect(component.quoteImageData.headingText).not.toContain('24周报价');

    component.students[2].quotePlan.courses[0].weeks = 12;
    component.students[2].quotePlan.rooms[0].weeks = 12;
    expect(component.quoteHeading).toBe('CPILS 3人·不同周数报价');
    expect(component.quoteImageData.headingText).toBe(component.quoteHeading);
    expect(component.quoteImageData.title).toBe('3人·不同周数');
    expect(component.quoteImageData.fileName).toBe(`CPILS 3人·不同周数报价-${component.selectedStartDate.replace(/-/g, '')}.png`);
  });

  it('shows exam benefits only for a currently selected qualifying course', () => {
    expect(component.applicableExamBenefits.length).toBe(0);
    expect(component.quoteImageData.paymentItems.some(row => row.label.includes('考试'))).toBeFalse();
    component.selectedCourseId = 'ielts-course';
    component.selectedWeeks = 12;
    expect(component.applicableExamBenefitText).toContain('雅思课程12周及以上');
    expect(component.quoteImageData.paymentItems.find(row => row.label.includes('考试'))?.amount).toBe('按课程适用');
  });

  it('uses independently editable CPILS course, room and fee data', () => {
    const content = createDefaultCpilsContentConfig();
    content.courses[0].tuition = 999;
    content.rooms.find(room => room.id === 'regular-quad')!.fee = 777;
    content.localFees.find(fee => fee.id === 'management')!.amount = 2222;
    component['applyContentConfig'](content);
    expect(component.courseFees[0].tuition).toBe(999);
    expect(component.selectedRoom?.fee).toBe(777);
    expect(component.includedLocalFees.find(row => row.item === '管理费')?.total).toBe(2222);
  });

  it('keeps CPILS quote-image copy editable without changing calculator-owned amounts', () => {
    const content = createDefaultCpilsContentConfig();
    const total = component.quoteUsd;
    content.quoteImageSettings.paymentSectionTitle = '员工修改后的学校费用';
    content.quoteImageSettings.localFeeNotes['ssp'] = '员工修改后的SSP备注';
    content.quoteImageSettings.footerNotes = ['员工修改后的报价说明'];
    component['applyContentConfig'](content);
    expect(component.quoteImageData.paymentSectionTitle).toBe('员工修改后的学校费用');
    expect(component.quoteImageData.localFeeItems?.find(row => row.label.includes('SSP特殊'))?.note).toBe('员工修改后的SSP备注');
    expect(component.quoteImageData.importantNotes).toContain('员工修改后的报价说明');
    expect(component.quoteUsd).toBe(total);
  });

  it('applies the published Sida and off-season rules to the default September plan', () => {
    expect(component.sidaDiscountAmount).toBe(163.5);
    expect(component.offSeasonDiscountAmount).toBe(73.58);
    expect(component.quoteUsd).toBe(1522.92);
    expect(component.schoolPaymentItems.map(item => item.label)).toContain('下半年淡季优惠');
  });

  it('applies the no-window discount once per complete four-week room block', () => {
    component.selectedRoomId = 'no-window-twin';
    expect(component.noWindowDiscountAmount).toBe(50);
    component.selectedWeeks = 8;
    expect(component.noWindowDiscountAmount).toBe(100);
    expect(component.schoolPaymentItems.find(item => item.label === '无对外窗房优惠')?.note).toContain('每满4周优惠50美元');
  });

  it('uses the editable peak-season dates and rate without double-charging matched course and room weeks', () => {
    component.selectedStartDate = '2026-07-05';
    expect(component.peakSeasonWeeks).toBe(4);
    expect(component.seasonalSurcharge).toBe(160);
    const content = createDefaultCpilsContentConfig();
    content.quoteSettings.peakSeasonFeePerWeek = 45;
    component['applyContentConfig'](content);
    expect(component.seasonalSurcharge).toBe(180);
  });

  it('selects only the highest matching Christmas or New Year benefit', () => {
    component.selectedRegistrationDate = '2026-09-01';
    component.selectedStartDate = '2026-12-20';
    expect(component.holidayDiscountAmount).toBe(150);
    expect(component.schoolPaymentItems.find(item => item.label === '圣诞／新年优惠')?.amount).toBe('− 150 美元');
  });

  it('keeps all ten calculated local rows and three optional references in the image', () => {
    expect(component.includedLocalFees.length).toBe(10);
    expect(component.excludedLocalFees.length).toBe(3);
    expect(component.quoteImageData.localFeeItems?.length).toBe(10);
    expect(component.quoteImageData.optionalFeeItems?.length).toBe(3);
    expect(component.quoteImageData.localFeeItems?.every(row => !!row.note)).toBeTrue();
  });
});

describe('CPILS September notice and 2027 quotes', () => {
  let component: CpilsSchoolDetailComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [
      { provide: SchoolService, useValue: { getSchools: () => of([]) } },
      { provide: ExchangeRateService, useValue: { getLatestCnyRates: () => EMPTY } },
      { provide: SchoolContentService, useValue: { getPublished: () => of(null) } },
      { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: { get: () => null } } } },
      { provide: ElementRef, useValue: new ElementRef(document.createElement('div')) },
    ] });
    component = TestBed.runInInjectionContext(() => new CpilsSchoolDetailComponent());
  });
  const split = (component: CpilsSchoolDetailComponent, kind: 'course' | 'room', weeks: number[], ids?: string[]) => {
    const plan = component.quotePlan, original = plan.rows(kind)[0];
    let offset = 0;
    plan.rows(kind).splice(0, plan.rows(kind).length, ...weeks.map((count, i) => {
      const row = { ...original, id: (kind === 'course' ? 100 : 200) + i, optionId: ids?.[i] ?? original.optionId, weeks: count,
        startDate: new Date(Date.parse(original.startDate) + offset * 7 * 86400000).toISOString().slice(0, 10) };
      offset += count; return row;
    }));
  };

  it('uses confirmed 2027 defaults and keeps local/image amounts and notes identical', () => {
    expect(component.tuitionForSelectedWeeks).toBe(982);
    expect(component.roomFeeForSelectedWeeks).toBe(735);
    expect(component.sidaDiscountAmount).toBe(171.7);
    expect(component.offSeasonDiscountAmount).toBe(77.27);
    expect(component.quoteUsd).toBe(1593.03);
    expect(component.localFeesTotal).toBe(19600);
    expect(component.quoteError).toBe('');
    expect(component.quoteImageData.totalUsd).toBe(component.quoteUsdText);
    expect(component.quoteImageData.localFeeItems?.map(row => row.note)).toEqual(component.includedLocalFees.map(row => row.note));
    expect(component.excludedLocalFees.find(row => row.item.includes('接机'))?.amount).toBe('1,200 比索');
    expect(component.excludedLocalFees.some(row => row.item === 'ID-Load预存')).toBeTrue();
  });
  it('honors September 28 old / September 29 new and grandfather expiry', () => {
    component.selectedRegistrationDate = '2026-09-28';
    expect(component.tuitionForSelectedWeeks).toBe(935);
    expect(component.roomFeeForSelectedWeeks).toBe(700);
    expect(component.offSeasonDiscountAmount).toBe(0);
    expect(component.quoteUsd).toBe(1596.5);
    component.selectedStartDate = '2027-05-23';
    expect(component.quoteError).toBe('');
    component.selectedStartDate = '2027-05-30';
    expect(component.quoteError).toContain('尚未确认');
    component.selectedRegistrationDate = '2026-09-29';
    expect(component.quoteError).toBe('');
    expect(component.tuitionForSelectedWeeks).toBe(982);
  });
  it('preserves 2026 tuition for a cross-year student but applies dated local fees', () => {
    component.selectedStartDate = '2026-12-20';
    expect(component.tuitionForSelectedWeeks).toBe(935);
    expect(component.includedLocalFees.find(row => row.item === '管理费')?.total).toBe(2228.57);
    expect(component.quoteImageData.localFeeItems?.find(row => row.label === '管理费')?.note).toContain('跨年');
  });
  for (const [arrival, expected] of [['2027-05-23', true], ['2027-05-30', false], ['2027-08-22', false], ['2027-08-29', true], ['2027-12-26', true]] as const) {
    it(`checks first Monday promotion admission for ${arrival}`, () => {
      component.selectedRegistrationDate = '2027-01-01';
      component.selectedStartDate = arrival;
      component.selectedRoomId = 'no-window-twin';
      component.selectedCourseId = 'toeic-course';
      expect(component.offSeasonDiscountAmount > 0).toBe(expected);
      expect(component.noWindowDiscountAmount > 0).toBe(expected);
      expect(component.applicableExamBenefits.length > 0).toBe(expected);
    });
  }
  it('does not award later-entry promotions to a student who first started in blackout', () => {
    component.selectedRegistrationDate = '2027-01-01';
    component.selectedStartDate = '2027-08-22';
    component.selectedWeeks = 8;
    split(component, 'course', [1, 7]);
    split(component, 'room', [1, 7], ['regular-quad', 'no-window-twin']);
    expect(component.offSeasonDiscountAmount).toBe(0);
    expect(component.noWindowDiscountAmount).toBe(0);
  });
  it('enforces early summer minimum and charges only eight confirmed study weeks', () => {
    component.selectedStartDate = '2027-07-04';
    expect(component.quoteError).toContain('至少8周');
    component.selectedWeeks = 8;
    expect(component.quoteError).toBe('');
    expect(component.peakSeasonWeeks).toBe(8);
    expect(component.seasonalSurcharge).toBe(320);
    component.selectedWeeks = 12;
    expect(component.peakSeasonWeeks).toBe(8);
    component.selectedStartDate = '2027-06-06';
    component.selectedWeeks = 4;
    expect(component.quoteError).toBe('');
    expect(component.seasonalSurcharge).toBe(0);
    expect(component.offSeasonDiscountAmount).toBe(0);
  });
  it('allows a four-week summer quote after the early registration period', () => {
    component.selectedStartDate = '2027-07-04';
    component.selectedRegistrationDate = '2027-01-01';
    expect(component.quoteError).toBe('');
    expect(component.seasonalSurcharge).toBe(160);
  });
  for (const [weeks, amount] of [[4, 50], [7, 50], [8, 100], [11, 100], [12, 150], [15, 150], [16, 200], [19, 200], [20, 250], [23, 250], [24, 300]]) {
    it(`applies no-window poster tier ${weeks} weeks / ${amount} dollars`, () => {
      component.selectedRoomId = 'no-window-single'; component.selectedWeeks = weeks;
      expect(component.noWindowDiscountAmount).toBe(amount);
    });
  }
  it('combines eligible room segments without counting ordinary-room weeks', () => {
    component.selectedWeeks = 8;
    split(component, 'room', [2, 2, 4], ['no-window-single', 'no-window-twin', 'regular-quad']);
    expect(component.noWindowDiscountAmount).toBe(50);
  });
  it('uses exact one/two/three-week school prices and blocks N/A quadruple one-week stays', () => {
    component.selectedCourseId = 'general-esl-light'; component.selectedRoomId = 'regular-twin';
    for (const [weeks, course, room] of [[1, 287, 362], [2, 455, 573], [3, 595, 750]]) {
      component.selectedWeeks = weeks;
      expect(component.quoteError).toBe('');
      expect(component.tuitionForSelectedWeeks).toBe(course);
      expect(component.roomFeeForSelectedWeeks).toBe(room);
      expect(component.offSeasonDiscountAmount).toBe(0);
    }
    component.selectedWeeks = 1; component.selectedRoomId = 'regular-quad';
    expect(component.quoteError).toContain('短住');
    component.selectedWeeks = 2;
    expect(component.roomFeeForSelectedWeeks).toBe(478);
    expect(component.quoteError).toBe('');
    component.selectedCourseId = 'ielts-course';
    expect(component.quoteError).toContain('暂无');
  });
  it('prices split ordinary rows from one student total course weeks', () => {
    split(component, 'course', [1, 3], ['general-esl-light', 'general-esl']);
    split(component, 'room', [2, 2], ['regular-twin', 'regular-quad']);
    expect(component.tuitionForSelectedWeeks).toBe(175 + 736.5);
    expect(component.roomFeeForSelectedWeeks).toBe(441 + 367.5);
    expect(component.quoteError).toBe('');
  });
  for (const [id, weeks, price] of [['toeic-guarantee', 12, 3566], ['ielts-guarantee-8-weeks', 8, 2750], ['ielts-guarantee-12-weeks', 12, 3569]] as const) {
    it(`preserves exact ${id} package and rejects wrong durations`, () => {
      component.selectedCourseId = id; component.selectedWeeks = weeks;
      expect(component.tuitionForSelectedWeeks).toBe(price);
      expect(component.quoteError).toBe('');
      if (weeks === 12) {
        split(component, 'course', [4, 4, 4]);
        expect(component.tuitionForSelectedWeeks).toBe(price);
        expect(component.quoteError).toBe('');
      }
      component.quotePlan.courses.splice(1); component.selectedWeeks = 4;
      expect(component.quoteError).toContain('须一次注册');
      expect(component.applicableExamBenefits).toEqual([]);
    });
  }
  it('honors specialty duration restrictions and avoids inventing Pre-IELTS price', () => {
    component.selectedCourseId = 'business-english'; component.selectedWeeks = 12;
    expect(component.quoteError).toContain('4／8周');
    component.selectedCourseId = 'tesol';
    expect(component.quoteError).toBe(''); expect(component.tuitionForSelectedWeeks).toBe(3276);
    component.selectedWeeks = 16;
    expect(component.quoteError).toContain('4／8／12周');
    component.selectedCourseId = 'pre-ielts-course';
    expect(component.quoteError).toContain('尚未确认');
  });
  it('never grants a 2027 school exam gift to grandfathered registrations', () => {
    component.selectedRegistrationDate = '2026-09-28'; component.selectedWeeks = 12; component.selectedCourseId = 'ielts-course';
    expect(component.applicableExamBenefits).toEqual([]);
    component.selectedRegistrationDate = '2026-09-29';
    expect(component.applicableExamBenefitText).toContain('赠1次');
    split(component, 'course', [4, 4, 4]);
    expect(component.applicableExamBenefits.length).toBe(1);
  });
  for (const [weeks, count] of [[4, 1], [7, 1], [8, 2], [12, 3], [16, 4], [20, 5], [24, 6]]) {
    it(`awards ${count} TOEIC exams for ${weeks} weeks without cash deductions`, () => {
      component.selectedWeeks = weeks; component.selectedCourseId = 'toeic-course';
      const cost = component.quoteUsd;
      expect(component.applicableExamBenefitText).toContain(`赠${count}次`);
      const content = createDefaultCpilsContentConfig(); content.quoteSettings.promotions.find(rule => rule.id === 'cpils-toeic-exam-2027')!.enabled = false;
      component['applyContentConfig'](content);
      expect(component.applicableExamBenefits).toEqual([]); expect(component.quoteUsd).toBe(cost);
    });
  }
  for (const visa of ['tourist30', 'tourist59'] as const) {
    it(`charges ACR once starting at the ${visa} threshold`, () => {
      component.students[0].visaType = visa;
      const threshold = visa === 'tourist30' ? 4 : 8;
      component.selectedWeeks = threshold;
      expect(component.visaExtensionTotal).toBe(0);
      component.selectedWeeks = threshold + 1;
      expect(component.visaExtensionTotal).toBe(5130);
      expect(component.includedLocalFees.find(row => row.item.includes('外国人身份证'))?.total).toBe(4000);
      expect(component.includedLocalFees.find(row => row.item === 'ARP外国人登记')?.total).toBe(200);
      component.selectedWeeks = threshold + 5;
      expect(component.visaExtensionTotal).toBe(11530);
      expect(component.includedLocalFees.find(row => row.item.includes('外国人身份证'))?.quantity).toBe(1);
    });
  }
  it('preserves long-term visa confirmation notes in images and group rows', () => {
    component.setQuoteMode('group'); component.students[1].visaType = 'work';
    const fees = component.quoteImageData.localFeeItems!;
    expect(fees.find(row => row.label.includes('学生2') && row.label.includes('SSP特殊'))?.note).toContain('是否免收请由顾问向学校确认');
    expect(fees.map(row => row.note)).toEqual(component.includedLocalFees.map(row => row.note));
    expect(component.localFeesTotal).toBe(19600 + 8000);
  });
  it('prices each student independently and excludes preserved inactive edits', () => {
    component.setQuoteMode('group'); component.students[1].selectedRegistrationDate = '2026-09-28'; component.students[1].returningStudent = true;
    expect(component.quoteUsd).toBe(1593.03 + 1471.5);
    expect(component.quoteImageData.paymentItems.some(row => row.note?.includes('2026年价格'))).toBeTrue();
    component.setQuoteMode('single');
    expect(component.quoteUsd).toBe(1593.03);
    component.setQuoteMode('group'); expect(component.students[1].returningStudent).toBeTrue();
  });
  it('upgrades old published content once while retaining employee copy, media and legacy rates', () => {
    const old = createDefaultCpilsContentConfig(); delete old.quoteSettings.cpilsPolicy;
    old.courses[0].tuition = 999; old.courses[0].tuition2027 = 999;
    old.quoteSettings.promotions = old.quoteSettings.promotions.filter(rule => !rule.id.endsWith('-2027'));
    old.quoteSettings.peakSeasonRanges = old.quoteSettings.peakSeasonRanges.filter(range => !range.id.endsWith('2027'));
    old.quoteImageSettings.paymentNotes.course = ''; old.quoteImageSettings.footerNotes = ['员工保留说明'];
    const migrated = cloneCpilsContentConfig(old);
    expect(migrated.courses[0].tuition).toBe(999); expect(migrated.courses[0].tuition2027).toBe(982);
    expect(migrated.quoteImageSettings.paymentNotes.course).toBe('');
    expect(migrated.quoteImageSettings.footerNotes).toEqual(['员工保留说明']);
    expect(old.courses[0].tuition2027).toBe(999);
    migrated.courses[0].tuition2027 = 1001; migrated.rooms[0].fee2027 = 1101;
    expect(cloneCpilsContentConfig(migrated)).toEqual(migrated);
    component['applyContentConfig'](migrated);
    expect(component.tuitionForSelectedWeeks).toBe(1001);
  });
  it('loads old published content even when database prices are obsolete', () => {
    const old = createDefaultCpilsContentConfig(); delete old.quoteSettings.cpilsPolicy; old.courses[0].tuition2027 = 935;
    const service = TestBed.inject(SchoolService);
    spyOn(service, 'getSchools').and.returnValue(of([{ id: 'cpils', name: 'CPILS' }]) as never);
    service.getSchoolPhotos = () => of([]);
    spyOn(TestBed.inject(SchoolContentService), 'getPublished').and.returnValue(of({ content: old }) as never);
    component.ngOnInit();
    expect(component.tuitionForSelectedWeeks).toBe(982);
    expect(cpilsPriceYear(component['contentConfig'], component.students[0])).toBe(2027);
  });
  it('upgrades inherited old electricity image copy while retaining custom fee notes', () => {
    const old = createDefaultCpilsContentConfig(); delete old.quoteSettings.cpilsPolicy;
    const electricity = old.localFees.find(row => row.id === 'electricity')!;
    electricity.note = '预估每4周2,000比索；实际按用电量结算，参考22比索／kW。';
    old.quoteImageSettings.localFeeNotes['electricity'] = electricity.note;
    old.quoteImageSettings.localFeeNotes['water'] = '员工自定义水费说明';
    component['applyContentConfig'](old);
    const rows = component.quoteImageData.localFeeItems!;
    expect(rows.find(row => row.label === '电费')?.note).toContain('22比索／千瓦时');
    expect(rows.find(row => row.label === '电费')?.note).not.toContain('／kW');
    expect(rows.find(row => row.label === '水费')?.note).toContain('员工自定义');
  });
  it('validates enrollment dates, future years and Sunday-only starts', () => {
    component.selectedRegistrationDate = '';
    expect(component.quoteError).toContain('报名日');
    component.selectedRegistrationDate = '2027-01-05'; expect(component.quoteError).toContain('不能晚于');
    component.selectedRegistrationDate = '2026-09-29'; component.selectedStartDate = '2028-01-02'; expect(component.quoteError).toContain('尚未确认');
    component.quotePlan.courses[0].startDate = '2027-01-04'; expect(component.quoteError).toContain('周日');
  });
});

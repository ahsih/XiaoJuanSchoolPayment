import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { chinaToday, ExchangeRateService } from '../../../../services/exchange-rate.service';
import { SchoolContentService } from '../../../../services/school-content.service';
import { SchoolService } from '../../../../services/school.service';
import { cloneCpilsContentConfig, createDefaultCpilsContentConfig } from './cpils-content-config';
import { cpilsPriceYear } from './cpils-pricing';
import { CpilsSchoolPageComponent } from './cpils-school-page.component';

// The CPILS page on the shared Philippine school template. The price rules are the ones the former
// CPILS page tested (September 2026 notice, 2027 prices and offers); the June 2026 handbook moved
// ACR I-CARD and ARP to the second immigration extension and made ARP 200 pesos.
describe('CPILS school page on the shared template', () => {
  let page: CpilsSchoolPageComponent;
  const schoolService = {
    getSchools: () => of([]),
    getSchoolLessons: () => of([]),
    getSchoolRooms: () => of([]),
    getSchoolFees: () => of([]),
    getSchoolPhotos: () => of([]),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [
      { provide: SchoolService, useValue: schoolService },
      { provide: SchoolContentService, useValue: { getPublished: () => of(null) } },
      { provide: ExchangeRateService, useValue: { getLatestCnyRates: () => of({ date: chinaToday(), usdToCny: 7, phpPerCny: 8.2 }) } },
      { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: { get: () => null } } } },
      { provide: ElementRef, useValue: new ElementRef(document.createElement('div')) },
    ] });
    page = TestBed.runInInjectionContext(() => new CpilsSchoolPageComponent());
    student().selectedRegistrationDate = '2026-09-29';
    page.selectedStartDate = '2027-01-03';
  });

  const student = (index = 0) => page.students[index];
  const localFee = (item: string) => page.estimatedLocalFees.find(fee => fee.item.includes(item));
  const payment = (label: string) => page.schoolPaymentItems.find(row => row.label === label);
  const course = (id: string) => page.courseFees.find(item => item.id === id)!;
  const split = (kind: 'course' | 'room', weeks: number[], ids?: string[]) => {
    const plan = page.quotePlan, original = plan.rows(kind)[0];
    let offset = 0;
    plan.rows(kind).splice(0, plan.rows(kind).length, ...weeks.map((count, i) => {
      const row = { ...original, id: (kind === 'course' ? 100 : 200) + i, optionId: ids?.[i] ?? original.optionId, weeks: count,
        startDate: new Date(Date.parse(original.startDate) + offset * 7 * 86400000).toISOString().slice(0, 10) };
      offset += count; return row;
    }));
  };
  const use2026 = () => {
    student().selectedRegistrationDate = '2026-09-01';
    page.selectedStartDate = '2026-09-06';
  };

  describe('page content', () => {
    it('lists courses with 2027 prices, guarantee packages and no add-on course', () => {
      expect(page.listPrice(course('pre-ielts-course'))).toBe(page.listPrice(course('ielts-course')));
      expect(page.listPrice(course('pre-ielts-course'))).toBe(1152);
      expect(course('pre-ielts-course').schedule).toBe('5堂1:1 + 4堂大团体 + 3堂强制自修');
      expect(page.courseFees.some(item => item.id === 'practicum')).toBeFalse();
      expect(page.listPrice(course('general-esl'))).toBe(982);
      expect(page.coursePriceUnit(course('general-esl'))).toBe('/4周');
      expect(page.listPrice(course('ielts-guarantee-8-weeks'))).toBe(2750);
      expect(page.coursePriceUnit(course('ielts-guarantee-8-weeks'))).toBe('/8周');
      expect(page.listPrice(course('toeic-guarantee'))).toBe(3566);
      expect(page.coursePriceUnit(course('toeic-guarantee'))).toBe('/12周');
      expect(course('general-esl').name).toBe('普通ESL');
      expect(course('general-esl').suitable).not.toBe(course('general-esl').note);
      expect(course('tesol').schedule).toContain('TESOL理论');
    });

    it('shows 2026 prices only where CPILS had them', () => {
      (page as unknown as { show2026Prices: boolean }).show2026Prices = true;
      expect(page.oldListPrice(course('general-esl'))).toBe(935);
      expect(page.oldListPrice(course('ielts-guarantee-8-weeks'))).toBe(2495);
      expect(page.oldListPrice(course('pcp-basic'))).toBeNull();
      (page as unknown as { show2026Prices: boolean }).show2026Prices = false;
      expect(page.oldListPrice(course('general-esl'))).toBeNull();
    });

    it('shows 2027 room prices and the exact short-stay shares', () => {
      expect(page.roomFeeFor('regular-single')).toBe(1045);
      expect(page.roomFeeFor('premium-quad')).toBe(819);
      expect(page.shortStayPercent(1)).toBe('41%');
      expect(page.shortStayPercent(2)).toBe('65%');
      expect(page.shortStayPercent(3)).toBe('85%');
      expect(page.roomRateGroups.map(group => group.title)).toEqual(['普通房', '无对外窗房', '高级房']);
    });

    it('keeps the same course list after published content is applied', () => {
      page['applyContentConfig'](createDefaultCpilsContentConfig());
      expect(page.courseFees.some(item => item.id === 'pre-ielts-course')).toBeTrue();
      expect(page.courseFees.some(item => item.id === 'practicum')).toBeFalse();
      expect(page.roomFeeFor('regular-quad')).toBe(735);
      expect(page.roomRateGroups[0].title).toBe('普通房');
    });
  });

  describe('2026 quotes', () => {
    beforeEach(use2026);

    it('applies the Sida and off-season rules to the September plan', () => {
      expect(student().sidaDiscount).toBe(163.5);
      expect(student().offSeasonDiscount).toBe(73.58);
      expect(page.quoteUsd).toBe(1522.92);
      expect(page.schoolPaymentItems.map(item => item.label)).toContain('下半年淡季优惠');
    });

    it('applies the no-window discount once per complete four-week room block', () => {
      page.selectedRoomId = 'no-window-twin';
      expect(student().noWindowDiscount).toBe(50);
      page.selectedWeeks = 8;
      expect(student().noWindowDiscount).toBe(100);
      expect(payment('无对外窗房优惠')?.note).toContain('每满4周优惠50美元');
    });

    it('charges the CALA rate of 40 dollars per study week in the 2026 summer, outside the discounts', () => {
      page.selectedStartDate = '2026-07-05';
      expect(student().peakWeeks).toBe(4);
      expect(student().seasonalSurcharge).toBe(160);
      const content = createDefaultCpilsContentConfig();
      content.quoteSettings.peakSeasonFeePerWeek = 45;
      page['applyContentConfig'](content);
      expect(student().seasonalSurcharge).toBe(160);
    });

    it('selects only the larger Christmas or New Year benefit', () => {
      page.selectedStartDate = '2026-12-20';
      expect(student().holidayDiscount).toBe(150);
      expect(payment('圣诞／新年优惠')?.amount).toBe('− 150 美元');
    });

    it('shows exam gifts only for a qualifying course', () => {
      expect(student().examBenefits).toEqual([]);
      expect(page.quoteImageData.paymentItems.some(row => row.label.includes('考试'))).toBeFalse();
      page.selectedCourseId = 'ielts-course';
      page.selectedWeeks = 12;
      expect(student().examBenefits.join('')).toContain('雅思课程12周及以上');
      expect(page.quoteImageData.paymentItems.find(row => row.label.includes('考试'))?.amount).toBe('按课程赠送');
    });

    it('keeps a 2026 student on 2026 tuition across the year end but uses dated local fees', () => {
      page.selectedStartDate = '2026-12-20';
      expect(student().tuition).toBe(935);
      expect(localFee('管理费')?.total).toBe(2228.57);
    });
  });

  describe('2027 quotes', () => {
    it('uses the 2027 defaults and keeps local fees and image notes identical', () => {
      expect(student().tuition).toBe(982);
      expect(student().accommodation).toBe(735);
      expect(student().sidaDiscount).toBe(171.7);
      expect(student().offSeasonDiscount).toBe(77.27);
      expect(page.quoteUsd).toBe(1593.03);
      expect(page.estimatedLocalFeeTotal).toBe(19600);
      expect(page.quoteError).toBe('');
      expect(page.quoteImageData.totalUsd).toBe(page.quoteUsdText);
      // Rows that do not apply (quantity 0) become one 本次不产生 row in the image; every other note is identical.
      const imageRows = page.quoteImageData.localFeeItems!;
      const applied = page.estimatedLocalFees.filter(row => row.quantity > 0 || row.total > 0);
      expect(imageRows.filter(row => row.label !== '本次不产生').map(row => row.note)).toEqual(applied.map(row => row.note));
      expect(imageRows.find(row => row.label === '本次不产生')?.note).toContain('ACR-I CARD');
      expect(page.optionalFeeItems.find(row => row.label.includes('接机'))?.amount).toBe('1,200 比索');
      expect(page.optionalFeeItems.some(row => row.label === 'ID-Load预存')).toBeTrue();
    });

    it('quotes Pre-IELTS at the IELTS course price in 2026 and 2027', () => {
      page.quotePlan.courses[0].optionId = 'ielts-course';
      const ieltsQuote = page.quoteUsd;
      page.quotePlan.courses[0].optionId = 'pre-ielts-course';
      expect(student().tuition).toBe(1152);
      expect(page.quoteUsd).toBe(ieltsQuote);
      expect(page.quoteError).toBe('');
      use2026();
      expect(student().tuition).toBe(1097);
    });

    it('honors September 28 old / September 29 new and the grandfather end', () => {
      student().selectedRegistrationDate = '2026-09-28';
      expect(student().tuition).toBe(935);
      expect(student().accommodation).toBe(700);
      expect(student().offSeasonDiscount).toBe(0);
      expect(page.quoteUsd).toBe(1596.5);
      page.selectedStartDate = '2027-05-23';
      expect(page.quoteError).toBe('');
      page.selectedStartDate = '2027-05-30';
      expect(page.quoteError).toContain('尚未确认');
      student().selectedRegistrationDate = '2026-09-29';
      expect(page.quoteError).toBe('');
      expect(student().tuition).toBe(982);
    });

    for (const [arrival, expected] of [['2027-05-23', true], ['2027-05-30', false], ['2027-08-22', false], ['2027-08-29', true], ['2027-12-26', true]] as const) {
      it(`checks first-Monday promotion admission for ${arrival}`, () => {
        student().selectedRegistrationDate = '2027-01-01';
        page.selectedStartDate = arrival;
        page.selectedRoomId = 'no-window-twin';
        page.selectedCourseId = 'toeic-course';
        expect(student().offSeasonDiscount > 0).toBe(expected);
        expect(student().noWindowDiscount > 0).toBe(expected);
        expect(student().examBenefits.length > 0).toBe(expected);
      });
    }

    it('does not give later-entry offers to a student who started in the blackout', () => {
      student().selectedRegistrationDate = '2027-01-01';
      page.selectedStartDate = '2027-08-22';
      page.selectedWeeks = 8;
      split('course', [1, 7]);
      split('room', [1, 7], ['regular-quad', 'no-window-twin']);
      expect(student().offSeasonDiscount).toBe(0);
      expect(student().noWindowDiscount).toBe(0);
    });

    it('enforces the early-summer minimum and charges only the eight summer study weeks', () => {
      page.selectedStartDate = '2027-07-04';
      expect(page.quoteError).toContain('至少8周');
      page.selectedWeeks = 8;
      expect(page.quoteError).toBe('');
      expect(student().peakWeeks).toBe(8);
      expect(student().seasonalSurcharge).toBe(480);
      expect(payment('暑假附加费')?.note).toContain('60美元／周 × 8周');
      expect(payment('暑假附加费')?.note).toContain('不参与折扣');
      expect(page.peakRate2027).toBe(60);
      page.selectedWeeks = 12;
      expect(student().peakWeeks).toBe(8);
      page.selectedStartDate = '2027-06-06';
      page.selectedWeeks = 4;
      expect(page.quoteError).toBe('');
      expect(student().seasonalSurcharge).toBe(0);
      expect(student().offSeasonDiscount).toBe(0);
    });

    it('allows a four-week summer quote after the early registration period', () => {
      page.selectedStartDate = '2027-07-04';
      student().selectedRegistrationDate = '2027-01-01';
      expect(page.quoteError).toBe('');
      expect(student().seasonalSurcharge).toBe(240);
    });

    for (const [weeks, amount] of [[4, 50], [7, 50], [8, 100], [12, 150], [16, 200], [20, 250], [24, 300]]) {
      it(`applies the no-window tier ${weeks} weeks / ${amount} dollars`, () => {
        page.selectedRoomId = 'no-window-single';
        page.selectedWeeks = weeks;
        expect(student().noWindowDiscount).toBe(amount);
      });
    }

    it('adds eligible room segments without counting ordinary-room weeks', () => {
      page.selectedWeeks = 8;
      split('room', [2, 2, 4], ['no-window-single', 'no-window-twin', 'regular-quad']);
      expect(student().noWindowDiscount).toBe(50);
    });

    it('uses the exact 1/2/3-week prices and blocks the unlisted one-week quad', () => {
      page.selectedCourseId = 'general-esl-light';
      page.selectedRoomId = 'regular-twin';
      for (const [weeks, tuition, room] of [[1, 287, 362], [2, 455, 573], [3, 595, 750]]) {
        page.selectedWeeks = weeks;
        expect(page.quoteError).toBe('');
        expect(student().tuition).toBe(tuition);
        expect(student().accommodation).toBe(room);
        expect(student().offSeasonDiscount).toBe(0);
      }
      page.selectedWeeks = 1;
      page.selectedRoomId = 'regular-quad';
      expect(page.quoteError).toContain('短住');
      page.selectedWeeks = 2;
      expect(student().accommodation).toBe(478);
      expect(page.quoteError).toBe('');
      page.selectedCourseId = 'ielts-course';
      expect(page.quoteError).toContain('暂无');
    });

    it('prices split rows from the student total course weeks', () => {
      split('course', [1, 3], ['general-esl-light', 'general-esl']);
      split('room', [2, 2], ['regular-twin', 'regular-quad']);
      expect(student().tuition).toBe(175 + 736.5);
      expect(student().accommodation).toBe(441 + 367.5);
      expect(page.quoteError).toBe('');
    });

    for (const [id, weeks, price] of [['toeic-guarantee', 12, 3566], ['ielts-guarantee-8-weeks', 8, 2750], ['ielts-guarantee-12-weeks', 12, 3569]] as const) {
      it(`keeps the exact ${id} package and rejects other lengths`, () => {
        page.selectedCourseId = id;
        page.selectedWeeks = weeks;
        expect(student().tuition).toBe(price);
        expect(page.quoteError).toBe('');
        if (weeks === 12) {
          split('course', [4, 4, 4]);
          expect(student().tuition).toBe(price);
          expect(page.quoteError).toBe('');
        }
        page.quotePlan.courses.splice(1);
        page.selectedWeeks = 4;
        expect(page.quoteError).toContain('须一次注册');
        expect(student().examBenefits).toEqual([]);
      });
    }

    it('keeps specialty course lengths', () => {
      page.selectedCourseId = 'business-english';
      page.selectedWeeks = 12;
      expect(page.quoteError).toContain('4／8周');
      page.selectedCourseId = 'tesol';
      expect(page.quoteError).toBe('');
      expect(student().tuition).toBe(3276);
      page.selectedWeeks = 16;
      expect(page.quoteError).toContain('4／8／12周');
    });

    it('prices parent-child courses only in the premium twin, triple or quad rooms', () => {
      page.selectedCourseId = 'pcp-intensive-child';
      expect(page.quoteError).toContain('高级双人');
      page.selectedRoomId = 'premium-triple';
      expect(page.quoteError).toBe('');
      expect(student().tuition).toBe(1092);
      expect(student().accommodation).toBe(893);
      page.selectedCourseId = 'pcp-basic';
      page.selectedWeeks = 2;
      expect(student().tuition).toBe(455);
      student().selectedRegistrationDate = '2026-09-01';
      page.selectedStartDate = '2026-11-01';
      expect(page.quoteError).toContain('暂无');
    });

    it('never gives a 2027 exam gift to grandfathered registrations', () => {
      student().selectedRegistrationDate = '2026-09-28';
      page.selectedWeeks = 12;
      page.selectedCourseId = 'ielts-course';
      expect(student().examBenefits).toEqual([]);
      student().selectedRegistrationDate = '2026-09-29';
      expect(student().examBenefits.join('')).toContain('赠1次');
      split('course', [4, 4, 4]);
      expect(student().examBenefits.length).toBe(1);
    });

    for (const [weeks, count] of [[4, 1], [8, 2], [12, 3], [24, 6]]) {
      it(`gives ${count} TOEIC exams for ${weeks} weeks without a cash deduction`, () => {
        page.selectedWeeks = weeks;
        page.selectedCourseId = 'toeic-course';
        const cost = page.quoteUsd;
        expect(student().examBenefits.join('')).toContain(`赠${count}次`);
        const content = createDefaultCpilsContentConfig();
        content.quoteSettings.promotions.find(rule => rule.id === 'cpils-toeic-exam-2027')!.enabled = false;
        page['applyContentConfig'](content);
        expect(student().examBenefits).toEqual([]);
        expect(page.quoteUsd).toBe(cost);
      });
    }
  });

  describe('visa fees (June 2026 handbook)', () => {
    const extension = () => localFee('续签')?.total ?? 0;
    const acr = () => localFee('外国人身份证');
    const arp = () => localFee('ARP');

    it('charges a 30-day visa 5,130 then 6,400 with ACR and ARP at the second extension', () => {
      student().visaType = 'tourist30';
      page.selectedWeeks = 4;
      expect(extension()).toBe(0);
      page.selectedWeeks = 5;
      expect(extension()).toBe(5130);
      expect(acr()?.quantity).toBe(0);
      expect(arp()?.total).toBe(0);
      page.selectedWeeks = 9;
      expect(extension()).toBe(11530);
      expect(acr()?.total).toBe(4000);
      expect(arp()?.total).toBe(200);
    });

    it('starts a 59-day visa at the second extension step', () => {
      student().visaType = 'tourist59';
      page.selectedWeeks = 8;
      expect(extension()).toBe(0);
      expect(acr()?.quantity).toBe(0);
      page.selectedWeeks = 9;
      expect(extension()).toBe(6400);
      expect(acr()?.total).toBe(4000);
      expect(arp()?.total).toBe(200);
      page.selectedWeeks = 13;
      expect(extension()).toBe(10840);
      expect(acr()?.quantity).toBe(1);
    });

    it('keeps long-term visa confirmation notes in the image and group rows', () => {
      page.setQuoteMode('group');
      student(1).selectedRegistrationDate = '2026-09-29';
      student(1).quotePlan.updateStartDate('course', student(1).quotePlan.courses[0].id, '2027-01-03');
      student(1).visaType = 'work';
      const fees = page.quoteImageData.localFeeItems!;
      expect(fees.find(row => row.label.includes('学生2') && row.label.includes('SSP特殊'))?.note).toContain('是否免收请由顾问向学校确认');
      // The image merges rows that do not apply (quantity 0) into one 本次不产生 row; rows waived for the work visa keep their own.
      const kept = page.estimatedLocalFees.filter(row => row.quantity > 0 || row.total > 0 || row.note.includes('是否免收请由顾问向学校确认'));
      expect(fees.filter(row => row.label !== '本次不产生').map(row => row.note)).toEqual(kept.map(row => row.note));
      expect(fees.filter(row => row.label === '本次不产生').length).toBe(1);
      expect(page.estimatedLocalFeeTotal).toBe(19600 + 2400 + 800 + 2000 + 2500 + 100 + 200);
    });
  });

  describe('group quotes and published content', () => {
    it('prices each student separately and keeps inactive edits out of the total', () => {
      page.setQuoteMode('group');
      student(1).selectedRegistrationDate = '2026-09-28';
      student(1).quotePlan.updateStartDate('course', student(1).quotePlan.courses[0].id, '2027-01-03');
      student(1).returningStudent = true;
      expect(page.quoteUsd).toBe(1593.03 + 1471.5);
      expect(page.quoteHeading).toBe('CPILS 2人报价');
      expect(page.quoteImageData.paymentItems.filter(row => row.label === '注册费').length).toBe(1);
      page.setQuoteMode('single');
      expect(page.quoteUsd).toBe(1593.03);
      page.setQuoteMode('group');
      expect(student(1).returningStudent).toBeTrue();
    });

    it('keeps quote-image copy editable without changing calculated amounts', () => {
      const total = page.quoteUsd;
      const content = createDefaultCpilsContentConfig();
      content.quoteImageSettings.paymentSectionTitle = '员工修改后的学校费用';
      content.quoteImageSettings.footerNotes = ['员工修改后的报价说明'];
      page['applyContentConfig'](content);
      expect(page.quoteImageData.paymentSectionTitle).toBe('员工修改后的学校费用');
      expect(page.quoteImageData.importantNotes).toContain('员工修改后的报价说明');
      expect(page.quoteUsd).toBe(total);
    });

    it('upgrades old published content once while keeping employee copy and edited prices', () => {
      const old = createDefaultCpilsContentConfig();
      delete old.quoteSettings.cpilsPolicy;
      old.courses[0].tuition = 999;
      old.courses[0].tuition2027 = 999;
      old.courses[0].note = old.courses[0].suitable = '适合基础到进阶综合提升。';
      old.courses[0].name = 'General ESL';
      old.courses = old.courses.filter(item => !item.id.startsWith('pcp-'));
      old.quoteSettings.promotions = old.quoteSettings.promotions.filter(rule => !rule.id.endsWith('-2027'));
      old.quoteImageSettings.footerNotes = ['员工保留说明'];
      const migrated = cloneCpilsContentConfig(old);
      expect(migrated.courses[0].tuition).toBe(999);
      expect(migrated.courses[0].tuition2027).toBe(982);
      expect(migrated.courses[0].name).toBe('普通ESL');
      expect(migrated.courses.filter(item => item.id.startsWith('pcp-')).length).toBe(3);
      expect(migrated.localFees.find(item => item.id === 'arp')?.amount).toBe(200);
      expect(migrated.quoteImageSettings.footerNotes).toEqual(['员工保留说明']);
      migrated.courses[0].tuition2027 = 1001;
      expect(cloneCpilsContentConfig(migrated)).toEqual(migrated);
      page['applyContentConfig'](migrated);
      expect(student().tuition).toBe(1001);
    });

    it('keeps a course an employee already edited', () => {
      const content = createDefaultCpilsContentConfig();
      content.quoteSettings.cpilsPolicy!.version = 1;
      const esl = content.courses.find(item => item.id === 'general-esl')!;
      esl.name = 'General ESL';
      esl.note = esl.suitable = '员工写的说明';
      const migrated = cloneCpilsContentConfig(content);
      const result = migrated.courses.find(item => item.id === 'general-esl')!;
      expect(result.name).toBe('General ESL');
      expect(result.note).toBe('员工写的说明');
    });

    it('loads old published content through the page start-up', () => {
      const old = createDefaultCpilsContentConfig();
      delete old.quoteSettings.cpilsPolicy;
      old.courses[0].tuition2027 = 935;
      spyOn(schoolService, 'getSchools').and.returnValue(of([{ id: 'cpils', name: 'CPILS' }]) as never);
      spyOn(TestBed.inject(SchoolContentService), 'getPublished').and.returnValue(of({ content: old }) as never);
      page.ngOnInit();
      expect(student().tuition).toBe(982);
      expect(cpilsPriceYear(page.cpilsContent, student())).toBe(2027);
    });

    it('validates registration dates, future years and Sunday starts', () => {
      student().selectedRegistrationDate = '';
      expect(page.quoteError).toContain('报名日');
      student().selectedRegistrationDate = '2027-01-05';
      expect(page.quoteError).toContain('不能晚于');
      student().selectedRegistrationDate = '2026-09-29';
      page.selectedStartDate = '2028-01-02';
      expect(page.quoteError).toContain('尚未确认');
      page.quotePlan.courses[0].startDate = '2027-01-04';
      expect(page.quoteError).toContain('周日');
    });
  });
});

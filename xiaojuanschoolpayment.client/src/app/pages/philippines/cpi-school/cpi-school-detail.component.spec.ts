import { TestBed } from '@angular/core/testing';
import { EMPTY, of } from 'rxjs';
import { ExchangeRateService } from '../../../../services/exchange-rate.service';
import { SchoolService } from '../../../../services/school.service';
import { SchoolLessonDTO } from '../../../../interfaces/school-lessons.dto';
import { SchoolRoomDTO } from '../../../../interfaces/school-rooms.dto';
import { QuoteImageDownloadButtonComponent } from '../../../components/quote-image-download-button.component';
import { CpiSchoolDetailComponent } from './cpi-school-detail.component';

describe('CPI pricing and complete quote export', () => {
  let component: CpiSchoolDetailComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [
      { provide: SchoolService, useValue: { getSchools: () => of([]) } },
      { provide: ExchangeRateService, useValue: { getLatestCnyRates: () => EMPTY } },
    ] });
    component = TestBed.runInInjectionContext(() => new CpiSchoolDetailComponent());
    component.selectedRegistrationDate = '2026-09-03';
  });

  it('matches all supplied four-week local charges and excludes optional costs', () => {
    expect(component.includedLocalFees.map(row => row.total)).toEqual([7800, 4500, 0, 0, 1000, 1500, 2000, 0, 2000, 350]);
    expect(component.localFeesTotal).toBe(19150);
    expect(component.quoteUsd).toBe(1503);
    expect(component.excludedLocalFees.length).toBe(3);
  });

  it('uses registration date rather than entry date for the off-season discount', () => {
    component.selectedStartDate = '2027-02-01';
    for (const date of ['2026-08-24', '2027-01-01']) {
      component.selectedRegistrationDate = date;
      expect(component.offSeasonDiscountAmount).withContext(date).toBe(100);
    }
    for (const date of ['2026-08-23', '2027-01-02', '', '2026-02-30']) {
      component.selectedRegistrationDate = date;
      expect(component.offSeasonDiscountAmount).withContext(date).toBe(0);
    }
  });

  it('counts December full learning weeks and flags partial weeks without granting them', () => {
    component.selectedStartDate = '2026-12-01';
    expect(component.decemberStay).toEqual({ fullWeeks: 4, partialWeeks: 0 });
    expect(component.decemberDiscountAmount).toBe(100);
    expect(component.quoteUsd).toBe(1403);
    component.selectedStartDate = '2026-12-07';
    expect(component.decemberStay).toEqual({ fullWeeks: 3, partialWeeks: 1 });
    expect(component.decemberDiscountAmount).toBe(75);
    expect(component.decemberCalculationText).toContain('暂未计入');
    component.selectedStartDate = '2027-12-01';
    expect(component.decemberDiscountAmount).toBe(0);
    component.selectedStartDate = '';
    expect(component.decemberStay).toEqual({ fullWeeks: 0, partialWeeks: 0 });
  });

  it('uses 37.5%, 65%, 90% of four-week tuition and room fees, with registration once', () => {
    for (const [weeks, ratio] of [[1, .375], [2, .65], [3, .9]]) {
      component.selectedWeeks = weeks;
      expect(component.tuitionForSelectedWeeks).toBeCloseTo(900 * ratio, 6);
      expect(component.roomFeeForSelectedWeeks).toBeCloseTo(770 * ratio, 6);
      expect(component.quoteUsd).toBeCloseTo(100 + 1670 * ratio - Math.round(1670 * ratio * 10) / 100 - weeks * 25, 6);
      expect(component.billingRuleText).toContain(`${ratio * 100}%`);
      expect(component.quoteImageData.totalUsd).toBe(component.quoteUsdText);
    }
  });

  it('scales management, water and electricity once per four-week period', () => {
    component.selectedWeeks = 8;
    expect(component.localFees.find(row => row.item === '管理费')?.total).toBe(2000);
    expect(component.localFees.find(row => row.item === '水费')?.total).toBe(3000);
    expect(component.localFees.find(row => row.item === '电费')?.total).toBe(4000);
    expect(component.localFees.find(row => row.item === '签证续签')?.total).toBe(0);
    expect(component.localFees.find(row => row.item === '教材费')?.total).toBe(2000);
  });

  it('does not promise limited gift places just because dates are eligible', () => {
    for (const date of ['2026-08-24', '2026-09-28']) {
      component.selectedStartDate = date;
      expect(component.extraClassEligible).toBeTrue();
      const gift = component.quoteImageData.paymentItems.find(row => row.label === '限量一对一加课');
      expect(gift?.amount).toBe('名额待确认');
      expect(gift?.note).toContain('限20个名额');
      expect(gift?.note).toContain('非现金优惠，不抵扣费用');
      expect(component.quoteUsd).toBe(1503);
    }
    component.selectedStartDate = '2026-09-29';
    expect(component.extraClassEligible).toBeFalse();
    expect(component.quoteImageData.paymentItems.find(row => row.label === '限量一对一加课')?.note).toContain('当前入学日期不适用');
    expect(component.quoteUsd).toBe(1503);
    component.selectedStartDate = '2026-12-01';
    expect(component.quoteImageData.paymentItems.length).toBe(7);
    expect(component.quoteImageData.paymentItems[6].label).toBe('限量一对一加课');
  });

  it('hides non-applicable school discounts but keeps every local and optional detail', () => {
    component.selectedRegistrationDate = '2027-01-02';
    component.selectedStartDate = '2027-02-01';
    const quote = component.quoteImageData;
    expect(quote.paymentItems.map(row => row.label)).toEqual(['注册费', '课程费', '住宿费', '思达折扣', '限量一对一加课']);
    expect(quote.paymentItems.find(row => row.label === '思达折扣')?.note).toBe('优惠167美元');
    expect(quote.localFeeItems?.length).toBe(10);
    expect(quote.localFeeItems?.find(row => row.label.includes('ARP'))?.amount).toBe('0 比索');
    expect(quote.optionalFeeItems?.length).toBe(3);
    expect(quote.optionalFeeItems?.[2].amount).toBe('200 比索 / 5公斤 / 次');
    expect(quote.localFeeAmount).toBe('19,150 比索');
    expect(quote.paymentItems.find(row => row.label === '课程费')?.note).toContain('4节一对一');
    expect(quote.paymentItems.find(row => row.label === '住宿费')?.detailTitle).toBe(component.selectedRoom.name);
    expect(JSON.stringify(quote)).not.toMatch(/\bUSD\b|\bPHP\b/);
  });

  it('keeps the exported introduction and every local fee remark identical to the webpage', () => {
    for (const weeks of [1, 4, 8, 12, 24]) {
      component.selectedWeeks = weeks;
      const quote = component.quoteImageData;
      expect(quote.localFeeTableLayout).toBe('web');
      expect(quote.localFeeNote).toBe(component.localFeeIntro);
      expect(quote.localFeeNote).toContain('签证相关费用按持59天签证预估');
      expect(quote.localFeeNote).toContain('教材按每次约用8周预估');
      expect(quote.localFeeNote).toContain('水费不足4周按4周计算');
      expect(quote.localFeeItems).toEqual(component.includedLocalFees.map(fee => ({
        label: fee.item, unit: fee.amount, quantity: String(fee.quantity), amount: component.formatPhp(fee.total), note: fee.note,
      })));
      expect(quote.optionalFeeItems).toEqual(component.excludedLocalFees.map(fee => ({
        label: fee.item, amount: fee.amount, note: fee.note,
      })));
    }
  });

  it('uses bilingual exam and ESP names and preserves stable course identifiers', () => {
    expect(component.courseDisplayName('TOEIC PREPARATORY')).toBe('托业预备 TOEIC PREPARATORY');
    expect(component.courseDisplayName('TOEFL GENERAL')).toBe('托福常规 TOEFL GENERAL');
    expect(component.courseDisplayName('IELTS INTENSIVE')).toBe('雅思强化 IELTS INTENSIVE');
    expect(component.courseDisplayName('ESP BRIDGE')).toBe('初级商务英语 ESP BRIDGE');
    component.selectedCourseId = 'esp-bridge';
    expect(component.selectedCourse.suitable).toBe('2节ESL一对一 + 2节商务英语一对一 + 1节1:2课程 + 2节小组课');
    expect(component.quoteImageData.paymentItems[1].note).toContain('1节1:2课程');
    component.selectedCourseId = 'esp-general';
    expect(component.selectedCourse.suitable).toBe('4节一对一 + 1节1:2课程 + 2节小组课');
  });

  it('uses bilingual junior and parent names in the page and quote image', () => {
    for (const [id, name, display] of [
      ['junior-6-15', 'JUNIOR（6-15岁）', '青少年 JUNIOR（6–15岁）'],
      ['parents', 'PARENTS', '家长 PARENTS'],
    ]) {
      component.selectedCourseId = id;
      expect(component.selectedCourse.name).toBe(name);
      expect(component.courseDisplayName(name)).toBe(display);
      expect(component.quoteImageData.paymentItems[1].detailTitle).toContain(display);
    }
  });

  it('removes the repeated occupancy from the family room note without changing its price', () => {
    expect(component.roomFees.find(room => room.id === 'building-b-quad')?.note).toBe('家庭房型；3张床');
    const room: SchoolRoomDTO = { id: 'family', schoolId: 'cpi', currencyId: 1, week: 4, price: 890, name: 'B栋四人间（3张床）', description: '家庭房型；四人入住、3张床，空房需单独确认' };
    component['applyPricingData']([], [room], []);
    expect(component.selectedRoom.note).toBe('家庭房型；3张床，空房需单独确认');
    expect(component.selectedRoom.fee).toBe(890);
    component['applyPricingData']([], [{ ...room, description: '学校新确认的房型说明' }], []);
    expect(component.selectedRoom.note).toBe('学校新确认的房型说明');
  });

  it('corrects only the known old ESP database description', () => {
    const lesson: SchoolLessonDTO = { id: 'test', schoolId: 'cpi', currencyId: 1, week: 4, price: 950, name: 'ESP BRIDGE', description: '2节ESL一对一 + 2节商务一对一 + 2节小组课' };
    component['applyPricingData']([lesson], [], []);
    expect(component.courseFees[0].suitable).toContain('1节1:2课程');
    component['applyPricingData']([{ ...lesson, description: '学校新确认的课表' }], [], []);
    expect(component.courseFees[0].suitable).toBe('学校新确认的课表');
  });

  it('keeps guarantee course schedules concise in the page and quote image', () => {
    const schedule = '5节一对一 + 2节小组课 + 2节考试课程';
    for (const id of ['ielts-guarantee', 'toeic-guarantee']) {
      component.selectedCourseId = id;
      expect(component.selectedCourse.suitable).toBe(schedule);
      expect(component.quoteImageData.paymentItems[1].note).not.toContain('最低周数');
    }
    for (const name of ['IELTS GUARANTEE', 'TOEIC GUARANTEE']) {
      for (const suffix of ['；入学门槛与最低周数需确认', '；入学门槛、目标分数和最低周数需确认']) {
        const lesson: SchoolLessonDTO = { id: 'test', schoolId: 'cpi', currencyId: 1, week: 4, price: 1120, name, description: schedule + suffix };
        component['applyPricingData']([lesson], [], []);
        expect(component.courseFees[0].suitable).toBe(schedule);
        expect(component.courseFees[0].tuition).toBe(1120);
      }
    }
  });

  it('grows the exported image for all ten local rows, three optional rows and long notes', () => {
    component.selectedCourseId = 'esp-bridge';
    const renderer = new QuoteImageDownloadButtonComponent();
    renderer.quote = component.quoteImageData;
    const context = document.createElement('canvas').getContext('2d')!;
    const layout = renderer['measureFullFeeLayout'](context);
    expect(layout.localHeights.length).toBe(10);
    expect(layout.optionalHeights.length).toBe(3);
    expect(layout.localExtra).toBeGreaterThan(0);
    expect(layout.noteHeights.length).toBe(layout.importantNotes.length);
    expect(layout.importantNotes.filter(note => note.includes('人民币金额按参考汇率估算')).length).toBe(1);
    expect(renderer['detailedLocalNote'](renderer.quote.localFeeItems![0])).toBe(component.includedLocalFees[0].note);
    expect(layout.localNoteHeight).toBeGreaterThan(0);
    expect(820 + layout.localNoteHeight + layout.localHeights.reduce((s, h) => s + h, 0) + 70 + layout.optionalHeights.reduce((s, h) => s + h, 0))
      .toBeLessThanOrEqual(1442 + layout.localExtra - 14);
  });

  it('charges registration once, without scaling or discount, for every available duration', () => {
    component.selectedRegistrationDate = '2027-02-01';
    component.selectedStartDate = '2027-02-01';
    for (const weeks of component.weekOptions) {
      component.selectedWeeks = weeks;
      expect(component.quoteUsd - component.courseAndRoomBase + component.sidaDiscountAmount).withContext(`${weeks} weeks`).toBeCloseTo(100, 6);
      expect(component.quoteImageData.paymentItems.filter(row => row.label === '注册费').length).toBe(1);
      expect(component.quoteImageData.paymentItems.find(row => row.label === '注册费')?.amount).toBe('100 美元');
      expect(component.quoteImageData.paymentItems.find(row => row.label === '注册费')?.note).toContain('一次性');
    }
  });

  it('renders a complete PNG with enough space for long course and fee notes', async () => {
    component.selectedCourseId = 'esp-bridge';
    component.selectedStartDate = '2026-12-07';
    const renderer = new QuoteImageDownloadButtonComponent();
    renderer.quote = component.quoteImageData;
    const canvasText = spyOn(CanvasRenderingContext2D.prototype, 'fillText').and.callThrough();
    const blob = await renderer['createQuoteImageBlob'](1);
    const drawnText = canvasText.calls.allArgs().map(args => args[0]).join('');
    expect(drawnText).toContain(component.localFeeIntro);
    for (const fee of component.localFees) expect(drawnText).toContain(fee.note);
    expect(blob.type).toBe('image/png');
    expect(blob.size).toBeGreaterThan(10000);
    const bitmap = await createImageBitmap(blob);
    expect(bitmap.width).toBe(1032);
    expect(bitmap.height).toBeGreaterThan(1764);
    bitmap.close();
  }, 30000);

  it('matches all course and room prices in the supplied 2026 tables', () => {
    expect(component.courseFees.map(course => course.tuition)).toEqual([900,1020,950,950,950,1020,1020,1020,1070,1070,1070,1120,1120,1120,1320,780,950,1020]);
    expect(component.roomFees.map(room => room.fee)).toEqual([1445,960,840,770,1595,1160,1110,950,890,770]);
    expect(component.juniorCourseNote).toContain('可部分周期转课');
    expect(component.courseFees.find(course => course.id === 'junior-6-15')?.suitable).not.toContain('转课');
    expect(component.courseFees.find(course => course.id === 'toefl-guarantee')?.suitable).not.toContain('未列');
    expect(component.weekOptions.every(weeks => Number.isInteger(weeks) && weeks >= 1)).toBeTrue();
    expect(component.selectedWeeks).toBe(4);
  });

  it('lists nine source-backed dormitory types with 37 original photos', () => {
    expect(component.dormitoryProfiles.length).toBe(9);
    const images = component.dormitoryProfiles.flatMap(room => room.gallery);
    expect(images.length).toBe(37);
    expect(new Set(images).size).toBe(37);
    expect(component.dormitoryProfiles.every(room => /[单双三四六]人间/.test(room.label))).toBeTrue();
    expect(component.dormitoryProfiles.find(room => room.id === 'six-female')?.label).toContain('女生专用');
  });

  it('keeps the junior transfer policy outside the course schedule', () => {
    component.selectedCourseId = 'junior-6-15';
    expect(component.quoteImageData.paymentItems[1].note).not.toContain('转给家长');
    expect(component.quoteImageData.importantNotes?.join('')).toContain(component.juniorCourseNote);
    const lesson: SchoolLessonDTO = { id: 'junior', schoolId: 'cpi', currencyId: 1, week: 4, price: 1320, name: 'JUNIOR（6-15岁）', description: '5节一对一 + 1节小组课 + 1节小团体课；可将1节一对一转给家长，可部分周期转课' };
    component['applyPricingData']([lesson], [], []);
    expect(component.selectedCourse.suitable).toBe('5节一对一 + 1节小组课 + 1节小团体课');
    expect(component.selectedCourse.tuition).toBe(1320);
  });

  it('switches dormitory photo sets without changing the quoted room or price', () => {
    const roomId = component.selectedRoomId;
    const total = component.quoteUsd;
    component.selectDormitory('six-female');
    component.selectDormitoryPhoto(5);
    expect(component.selectedDormitoryImage).toContain('six-female-06.jpg');
    component.selectDormitory('single-a');
    expect(component.selectedDormitoryImageIndex).toBe(0);
    expect(component.selectedDormitoryImage).toContain('single-a-01.jpg');
    component.selectDormitoryPhoto(5);
    component.selectDormitory('unknown');
    expect(component.selectedDormitoryId).toBe('single-a');
    expect(component.selectedDormitoryImageIndex).toBe(0);
    expect(component.selectedRoomId).toBe(roomId);
    expect(component.quoteUsd).toBe(total);
  });

  it('estimates visas using 59 days and books once per eight weeks in page and export', () => {
    for (const [weeks, renewals, books, identity] of [[1,0,1,0], [4,0,1,0], [8,0,1,0], [9,1,2,1], [12,1,2,1], [16,2,2,1], [20,3,3,1], [24,4,3,1]]) {
      component.selectedWeeks = weeks;
      expect(component.visaExtensionCount).withContext(`${weeks} weeks`).toBe(renewals);
      expect(component.textbookPurchaseCount).toBe(books);
      expect(component.localFees.find(row => row.item.startsWith('ACR'))?.quantity).toBe(identity);
      expect(component.localFees.find(row => row.item.startsWith('ARP'))?.quantity).toBe(identity);
      expect(component.quoteImageData.localFeeItems?.find(row => row.label === '签证续签')?.amount).toBe(component.formatPhp(renewals * 5140));
      expect(component.quoteImageData.localFeeItems?.find(row => row.label === '教材费')?.amount).toBe(component.formatPhp(books * 2000));
    }
    component.selectedWeeks = 12;
    expect(component.localFeesTotal).toBe(40090);
    expect(component.localFees.find(row => row.item.startsWith('ACR'))?.note).toContain('30天签证');
    component.selectedWeeks = 1;
    expect(component.localFees.find(row => row.item === '水费')?.total).toBe(1500);
    expect(component.localFees.find(row => row.item === '水费')?.note).toContain('不足4周按4周计算');
  });
});

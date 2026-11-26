import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { chinaToday, ExchangeRateService } from '../../../../services/exchange-rate.service';
import { SchoolContentService } from '../../../../services/school-content.service';
import { SchoolService } from '../../../../services/school.service';
import { QuoteImageDownloadButtonComponent } from '../../../components/quote-image-download-button.component';
import { createDefaultIbreezeContentConfig } from './ibreeze-content-config';
import { IBREEZE_PAGE_PROFILE } from './ibreeze-page-profile';
import { IbreezeSchoolPageComponent, ibreezeCourseId, ibreezeRoomId, ibreezeShortStayRatios } from './ibreeze-school-page.component';

// The I.BREEZE page on the shared Philippine school template: prices by registration date, the November and
// Christmas offers, the 思达启航 5%, the minor fee, the 2027 summer condo rule and the 2026-11 local-fee sheets.
describe('I.BREEZE school page on the shared template', () => {
  let page: IbreezeSchoolPageComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [
      { provide: SchoolService, useValue: { getSchools: () => of([]) } },
      { provide: SchoolContentService, useValue: { getPublished: () => of(null) } },
      { provide: ExchangeRateService, useValue: { getLatestCnyRates: () => of({ date: chinaToday(), usdToCny: 7, phpPerCny: 9 }) } },
      { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: { get: () => null } } } },
      { provide: ElementRef, useValue: new ElementRef(document.createElement('div')) },
    ] });
    page = TestBed.runInInjectionContext(() => new IbreezeSchoolPageComponent());
  });

  const student = () => page.students[0];
  const setPlan = (registration: string, arrival: string, weeks: number, course = 'power-esl', room = 'twin-main') => {
    const s = student();
    s.selectedRegistrationDate = registration;
    s.quotePlan.updateStartDate('course', s.quotePlan.courses[0].id, arrival);
    s.quotePlan.updateWeeks('course', s.quotePlan.courses[0].id, weeks);
    s.quotePlan.courses[0].optionId = course;
    s.quotePlan.rooms[0].optionId = room;
    return s;
  };

  it('prices a 2026 registration with the November room offer and the 5% 思达启航 discount', () => {
    const s = setPlan('2026-11-24', '2026-11-29', 4);
    expect(s.tuition).toBe(990);
    expect(s.accommodation).toBe(900);
    expect(s.quoteUsd).toBe(1845.5);
    const labels = s.paymentLines.map(line => `${line.label} ${line.value}`);
    expect(labels).toEqual(['11月住宿优惠 -100', '思达启航折扣 -94.5']);
    expect(s.promotionDiscountTotal).toBe(194.5);
    expect(s.discountNames).toBe('11月住宿优惠、思达启航折扣');
  });

  it('keeps mixed-year students independent in a group quote', () => {
    page.setQuoteMode('group');
    page.activeStudents.forEach((s, i) => {
      s.selectedRegistrationDate = i ? '2027-01-01' : '2026-12-31';
      s.quotePlan.updateStartDate('course', s.quotePlan.courses[0].id, '2027-02-07');
      s.quotePlan.courses[0].optionId = 'power-esl';
      s.quotePlan.rooms[0].optionId = 'twin-main';
    });
    expect(page.activeStudents.map(s => s.quoteUsd)).toEqual([1845.5, 2040.5]);
    expect(page.quoteUsd).toBe(3886);
    const image = page.quoteImageData;
    expect(image.headingText).toBe('I.BREEZE 2人报价');
    expect(JSON.stringify(image)).not.toContain('退差价');
  });

  it('maps the template visa choices onto I.BREEZE visas and keeps long-term rows with the adviser note', () => {
    const s = setPlan('2026-11-24', '2026-11-29', 12);
    s.visaType = 'tourist59';
    expect(s.quote.visaType).toBe(59);
    expect(s.visaLabel).toBe('59天旅游签证');
    s.visaType = 'student';
    expect(s.quote.visaType).toBe('student');
    const waived = s.localFees.filter(fee => fee.waived);
    expect(waived.length).toBeGreaterThan(0);
    expect(waived.every(fee => fee.total === 0 && fee.note.includes('须由顾问向学校确认'))).toBeTrue();
    s.visaType = 'tourist30';
    expect(s.quote.visaType).toBe(30);
  });

  // The school's sheets list 42,310 (8 weeks, 30-day visa) and 49,310 (12 weeks, 59-day visa) with the 5,000 deposit and
  // without textbooks; the quote keeps the deposit outside and adds the 2,000-peso textbook estimate per 4 course weeks.
  it('matches the 2026-11 dormitory fee sheet totals', () => {
    setPlan('2026-11-24', '2026-11-29', 8);
    expect(page.quote.estimatedLocalFeeTotal).toBe(41310);
    const s = setPlan('2026-11-24', '2026-11-29', 12);
    s.visaType = 'tourist59';
    expect(page.quote.estimatedLocalFeeTotal).toBe(50310);
    expect(page.optionalFeeItems.find(item => item.label.startsWith('房间押金'))!.amount).toBe('5,000 比索');
  });

  it('charges minors Junior tuition, offers the guardian fee only when chosen and includes pickup in it', () => {
    const s = setPlan('2027-01-01', '2027-02-07', 4);
    s.selectedAgeGroup = 'minor';
    const [ageBand, guardian] = s.extraChoices!;
    expect(ageBand.visible).toBeTrue();
    expect(ageBand.value).toBe('16-17');
    expect(s.tuition).toBe(1290);
    expect(s.paymentLines.some(line => line.label === '监护管理费')).toBeFalse();
    guardian.value = true;
    expect(s.paymentLines.find(line => line.label === '监护管理费')!.value).toBe(100);
    expect(page.optionalFeeItems[0].amount).toBe('已含');
    ageBand.value = 'under-16';
    expect(s.quote.selectedAgeGroup).toBe('under-16');
    expect(s.quoteError).toContain('未满16岁须选择青少年英语课程');
    s.quotePlan.courses[0].optionId = 'junior-english';
    expect(s.quoteError).toBe('');
    s.selectedAgeGroup = 'adult';
    expect(s.quote.minorWithoutParent).toBeFalse();
    expect(guardian.visible).toBeFalse();
  });

  it('asks about family travel only for summer condo stays and blocks single students there', () => {
    const s = setPlan('2027-01-01', '2027-06-27', 8, 'power-esl', 'off-campus-standard-twin');
    const family = s.extraChoices![2];
    expect(family.visible).toBeTrue();
    expect(s.quoteError).toContain('仅接受家庭学生');
    family.value = true;
    expect(s.quoteError).toBe('');
    expect(s.seasonalSurcharge).toBe(280);
    expect(s.paymentLines[0].label).toBe('暑期附加费');
    family.value = false;
    s.quotePlan.rooms[0].optionId = 'twin-main';
    expect(family.visible).toBeFalse();
  });

  it('lists the price year in force and the next year inside each course', () => {
    const power = page.courseFees.find(fee => fee.id === 'power-esl')!;
    if (page.show2026Prices) {
      expect(page.listPrice(power)).toBe(990);
      expect(page.oldListPrice(power)).toBe(1040);
      expect(page.roomFeeFor('twin-main')).toBe(900);
    } else {
      expect(page.listPrice(power)).toBe(1040);
      expect(page.oldListPrice(power)).toBeNull();
      expect(page.roomFeeFor('twin-main')).toBe(950);
    }
    const ratios = ibreezeShortStayRatios(createDefaultIbreezeContentConfig(), true);
    expect(ratios['1']).toBeCloseTo(400 / 990, 5);
    expect(ratios['3']).toBeCloseTo(860 / 990, 5);
  });

  it('maps database names to content ids and has photos for every room', () => {
    expect(ibreezeCourseId('Power ESL')).toBe('power-esl');
    expect(ibreezeCourseId('General Business & BEC')).toBe('general-business-and-bec');
    expect(ibreezeRoomId('IB1双人间')).toBe('twin-main');
    expect(ibreezeRoomId('校外公寓超级单人间')).toBe('off-campus-superior-single');
    const rateIds = new Set(IBREEZE_PAGE_PROFILE.roomProfiles.flatMap(profile => profile.rateIds ?? []));
    for (const room of createDefaultIbreezeContentConfig().rooms) expect(rateIds.has(room.id)).withContext(room.id).toBeTrue();
  });

  it('renders a complete quote image with the November offer', async () => {
    setPlan('2026-11-24', '2026-12-20', 8);
    const renderer = TestBed.runInInjectionContext(() => new QuoteImageDownloadButtonComponent());
    renderer.quote = page.quoteImageData;
    const paint: string[] = [];
    const original = CanvasRenderingContext2D.prototype.fillText;
    spyOn(CanvasRenderingContext2D.prototype, 'fillText').and.callFake(function (this: CanvasRenderingContext2D, text, x, y) {
      paint.push(text);
      original.call(this, text, x, y);
    });
    const blob = await renderer['createQuoteImageBlob'](1);
    expect(blob.type).toBe('image/png');
    expect(paint).toContain('11月住宿优惠');
    expect(paint).toContain('圣诞特别优惠');
    expect(paint.some(text => text.includes('退差价'))).toBeFalse();
  }, 30000);
});

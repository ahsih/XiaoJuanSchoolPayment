import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { chinaToday, ExchangeRateService } from '../../../../services/exchange-rate.service';
import { SchoolContentService } from '../../../../services/school-content.service';
import { SchoolService } from '../../../../services/school.service';
import type { CiaContentConfig } from '../cia-school/cia-content-config';
import { cloneFellaContentConfig, createDefaultFellaContentConfig, fellaCampusContent } from './fella-content-config';
import { FellaFirstCampusSchoolComponent } from './fella-first-campus-school.component';
import { FellaSecondCampusSchoolComponent } from './fella-second-campus-school.component';
import type { FellaSchoolPageComponent } from './fella-school-page';

// English Fella's two campus pages on the shared Philippine template, from the school's 2026 pack (2026 price and
// local-fee sheets, the Christmas offer, both campus orientations).
describe('English Fella campus pages on the shared template', () => {
  const providers = () => TestBed.configureTestingModule({ providers: [
    { provide: SchoolService, useValue: { getSchools: () => of([]) } },
    { provide: SchoolContentService, useValue: { getPublished: () => of(null) } },
    { provide: ExchangeRateService, useValue: { getLatestCnyRates: () => of({ date: chinaToday(), usdToCny: 7, phpPerCny: 8 }) } },
    { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: { get: () => null } } } },
    { provide: ElementRef, useValue: new ElementRef(document.createElement('div')) },
  ] });
  const create = <T extends FellaSchoolPageComponent>(factory: () => T): T => {
    const page = TestBed.runInInjectionContext(factory);
    page.selectedStartDate = '2027-02-14';
    return page;
  };
  const payment = (page: FellaSchoolPageComponent, label: string) => page.schoolPaymentItems.find(row => row.label === label);
  const localFee = (page: FellaSchoolPageComponent, item: string) => page.estimatedLocalFees.find(fee => fee.item.startsWith(item));
  const localTotal = (page: FellaSchoolPageComponent) => page.estimatedLocalFees.reduce((sum, fee) => sum + fee.total, 0);
  const optional = (page: FellaSchoolPageComponent, label: string) => page.optionalFeeItems.find(fee => fee.label === label);

  beforeEach(providers);

  describe('First Campus', () => {
    let page: FellaFirstCampusSchoolComponent;
    beforeEach(() => { page = create(() => new FellaFirstCampusSchoolComponent()); });
    const student = () => page.students[0];

    it('lists only first-campus courses and rooms', () => {
      const courses = page.quotePlan.options('course').map(option => option.id);
      const rooms = page.quotePlan.options('room').map(option => option.id);
      expect(courses).toContain('pigi');
      expect(courses).not.toContain('jec');
      expect(courses).not.toContain('ebc');
      expect(rooms).toEqual(['premium-1p', 'single-1a', 'single-1b', 'twin-2a', 'triple-3a']);
    });

    it('takes the Sida 5% from four weeks and keeps registration outside it', () => {
      expect(page.selectedCourseId).toBe('pic-4');
      expect(page.selectedRoomId).toBe('twin-2a');
      // 100 + 950 + 850 − 5% of 1,800
      expect(page.quote.quoteUsd).toBe(1810);
      expect(payment(page, '思达启航折扣')?.amount).toBe('− 90 美元');
      expect(page.quoteImageData.headingText).toContain('English Fella 第一校区 4周报价');
      student().returningStudent = true;
      expect(page.quote.quoteUsd).toBe(1710);
    });

    it('gives 100 dollars per Christmas study week, at most 200, before the Sida 5%', () => {
      page.selectedStartDate = '2026-12-13';
      // 100 + 1,800 − 200 − 5% of 1,600
      expect(student().christmasDiscount).toBe(200);
      expect(page.quote.quoteUsd).toBe(1620);
      page.selectedStartDate = '2026-12-27';
      expect(student().christmasDiscount).toBe(100);
    });

    it('prices one to three weeks at 30/60/90% without the Sida discount', () => {
      page.selectedWeeks = 2;
      expect(student().tuition).toBe(570);
      expect(student().accommodation).toBe(510);
      expect(page.quote.quoteUsd).toBe(1180);
      page.selectedWeeks = 3;
      expect(student().tuition).toBe(855);
    });

    it('matches the school sheet for local fees', () => {
      student().visaType = 'tourist30';
      expect(localTotal(page)).toBe(17100);
      expect(localFee(page, '签证续签')?.total).toBe(0);
      page.selectedWeeks = 8;
      // the school's 8-week total of 34,240 less the deposit, padlock and pickup
      expect(localTotal(page)).toBe(30140);
      expect(localFee(page, 'ACR I-CARD')?.total).toBe(4100);
      expect(localFee(page, 'ARP')?.total).toBe(500);
      student().visaType = 'tourist59';
      expect(localTotal(page)).toBe(19100);
      page.selectedWeeks = 1;
      expect(localFee(page, 'SSP E-CARD')?.total).toBe(4600);
      expect(localFee(page, '综合管理费')?.total).toBe(1000);
      expect(localFee(page, '教材费')?.total).toBe(1500);
    });

    it('zeroes the visa rows for a long-term visa', () => {
      student().visaType = 'student';
      page.selectedWeeks = 12;
      expect(localFee(page, 'SSP特别学习许可')?.total).toBe(0);
      expect(localFee(page, '签证续签')?.total).toBe(0);
      expect(localFee(page, 'SSP特别学习许可')?.note).toContain('暂按0估算');
    });

    it('adds the undiscounted guardian fee for a minor studying alone', () => {
      student().selectedAgeGroup = 'minor';
      expect(payment(page, '未成年学生单独到校服务费')?.amount).toBe('100 美元');
      expect(page.quote.quoteUsd).toBe(1910);
      page.selectedWeeks = 8;
      expect(student().guardianFee).toBe(200);
      student().extraChoices[0].value = true;
      expect(student().guardianFee).toBe(0);
    });

    it('runs the guarantee courses as one 12-week set', () => {
      page.selectedCourseId = 'pigi';
      expect(page.quote.quoteError).toContain('12周');
      page.selectedWeeks = 12;
      expect(page.quote.quoteError).toBe('');
    });

    it('lists the deposit by stay length outside the total', () => {
      expect(optional(page, '房间押金（可退）')?.amount).toBe('3,000 比索');
      page.selectedWeeks = 12;
      expect(optional(page, '房间押金（可退）')?.amount).toBe('4,000 比索');
      expect(optional(page, '宿务机场接机')?.amount).toBe('1,000 比索');
    });
  });

  describe('Second Campus', () => {
    let page: FellaSecondCampusSchoolComponent;
    beforeEach(() => { page = create(() => new FellaSecondCampusSchoolComponent()); });
    const student = () => page.students[0];

    it('lists only second-campus courses and rooms', () => {
      const courses = page.quotePlan.options('course').map(option => option.id);
      const rooms = page.quotePlan.options('room').map(option => option.id);
      expect(courses).toContain('jec');
      expect(courses).toContain('ssc');
      expect(courses).not.toContain('pigi');
      expect(rooms).toEqual(['premium-1p', 'twin-2a', 'triple-3a']);
      expect(student().extraChoices.length).toBe(0);
      expect(page.quoteImageData.headingText).toContain('English Fella 第二校区 4周报价');
    });

    it('keeps family courses out of the Sida discount and charges them the family pickup', () => {
      page.selectedCourseId = 'jec';
      expect(page.quote.quoteError).toContain('未满18岁');
      student().selectedAgeGroup = 'minor';
      expect(page.quote.quoteError).toBe('');
      // 100 + 1,100 + 850, no Sida discount on family courses
      expect(page.quote.quoteUsd).toBe(2050);
      expect(optional(page, '宿务机场接机')?.amount).toBe('700 比索');
      expect(student().guardianFee).toBe(0);
    });

    it('keeps family courses out of the plan comparison', () => {
      expect(page.comparison.courseOptions.some(option => option.id === 'gec')).toBeFalse();
      expect(page.comparison.courseOptions.some(option => option.id === 'ebc')).toBeTrue();
    });
  });

  describe('content document', () => {
    it('upgrades an older saved document once and keeps edited prices', () => {
      const saved = createDefaultFellaContentConfig() as CiaContentConfig & { quoteSettings: { fellaPolicyVersion?: number } };
      delete saved.quoteSettings.fellaPolicyVersion;
      saved.courses.find(item => item.id === 'pic-4')!.tuition = 990;
      saved.courses.find(item => item.id === 'pic-4')!.name = 'PIC-4';
      saved.localFees.find(item => item.id === 'arp')!.amount = 300;
      saved.quoteSettings.promotions.push({ ...saved.quoteSettings.promotions[0], id: 'fella-july-registration', name: '7月报名优惠' });
      const upgraded = cloneFellaContentConfig(saved);
      const course = upgraded.courses.find(item => item.id === 'pic-4')!;
      expect(course.tuition).toBe(990);
      expect(course.name).toBe('PIC-4 综合英语');
      expect(upgraded.localFees.find(item => item.id === 'arp')!.amount).toBe(500);
      expect(upgraded.quoteSettings.promotions.find(item => item.id === 'fella-july-registration')!.enabled).toBeFalse();
      // A current document is left as it is.
      upgraded.localFees.find(item => item.id === 'arp')!.amount = 450;
      expect(cloneFellaContentConfig(upgraded).localFees.find(item => item.id === 'arp')!.amount).toBe(450);
    });

    it('gives each campus only its own rooms', () => {
      const first = fellaCampusContent(createDefaultFellaContentConfig(), 'campus1');
      const second = fellaCampusContent(createDefaultFellaContentConfig(), 'campus2');
      expect(first.rooms.map(room => room.id)).toContain('single-1b');
      expect(second.rooms.map(room => room.id)).not.toContain('single-1b');
      expect(second.quoteImageSettings.footerNotes[0]).toContain('第二校区');
    });
  });
});

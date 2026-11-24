import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { chinaToday, ExchangeRateService } from '../../../../services/exchange-rate.service';
import { SchoolContentService } from '../../../../services/school-content.service';
import { SchoolService } from '../../../../services/school.service';
import type { SchoolPhotoDTO } from '../../../../interfaces/school-photo.dto';
import { JicChallengerSchoolComponent } from './jic-challenger-school.component';
import { JicPremiumSchoolComponent } from './jic-premium-school.component';

// The two JIC campus pages on the shared Philippine school template: each page quotes only its own campus, with
// JicStudentQuote's prices, offers and local fees.
describe('JIC pages on the shared template', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      { provide: SchoolService, useValue: { getSchools: () => of([]) } },
      { provide: SchoolContentService, useValue: { getPublished: () => of(null) } },
      { provide: ExchangeRateService, useValue: { getLatestCnyRates: () => of({ date: chinaToday(), usdToCny: 7, phpPerCny: 8.2 }) } },
      { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: { get: () => null } } } },
      { provide: ElementRef, useValue: new ElementRef(document.createElement('div')) },
    ],
  }));

  describe('Challenger', () => {
    let page: JicChallengerSchoolComponent;
    beforeEach(() => {
      page = TestBed.runInInjectionContext(() => new JicChallengerSchoolComponent());
      page.selectedCourseId = 'challenger-esl-lite';
      page.selectedRoomId = 'challenger-quad-bunk';
      page.selectedStartDate = '2027-01-10';
      page.selectedWeeks = 4;
    });
    const payment = (label: string) => page.schoolPaymentItems.find(row => row.label.includes(label));

    it('offers only Challenger courses and rooms, grouped by occupancy', () => {
      expect(page.courseFees.every(course => course.id.startsWith('challenger-'))).toBeTrue();
      expect(page.roomFees.every(room => room.id.startsWith('challenger-'))).toBeTrue();
      expect(page.roomRateGroups.map(group => group.title)).toEqual(['单人间', '多人间']);
    });

    it('shows registration and its equal Sida waiver, then the holiday offer on a term-start arrival', () => {
      // 760 tuition + 600 room − 200 holiday offer; registration 100 and its waiver net to zero.
      expect(page.quote.quoteUsd).toBe(1160);
      expect(payment('注册费')?.amount).toContain('100');
      expect(payment('思达启航注册费减免')?.amount).toContain('100');
      expect(payment('圣诞优惠')?.amount).toContain('200');
      expect(payment('淡季优惠')).toBeUndefined();
      expect(page.quoteImageData.headingText).toBe('JIC Challenger 4周报价');
      expect(page.quoteImageData.layoutVersion).toBe(2);
    });

    it('waives registration for returning students without a waiver line', () => {
      page.students[0].returningStudent = true;
      expect(page.students[0].registration).toBe(0);
      expect(payment('思达启航注册费减免')).toBeUndefined();
      expect(page.quote.quoteUsd).toBe(1160);
    });

    it('charges the 2027 BESA peak surcharge at 60 dollars a week', () => {
      page.selectedStartDate = '2027-06-27';
      expect(page.students[0].seasonalSurcharge).toBe(240);
    });

    it('lists the deposit always and the odd-week fee only off the term dates', () => {
      expect(page.optionalFeeItems.map(item => item.label)).toEqual(['宿舍押金（可退）']);
      page.selectedStartDate = '2027-01-17';
      const odd = page.optionalFeeItems.find(item => item.label === '非开学日入学／结业');
      expect(odd?.amount).toContain('16,000');
    });

    it('adds the chosen pickup and paid classes to the local fees', () => {
      const student = page.students[0];
      const [pickup, elective] = student.extraChoices!;
      expect(elective.visible).toBeTrue();
      pickup.value = 'clark';
      elective.value = true;
      expect(student.localFees.find(fee => fee.item === '克拉克机场接机')?.total).toBe(3000);
      expect(student.localFees.find(fee => fee.item === '付费特别课')?.total).toBe(2000);
    });

    it('blocks an IELTS Guarantee plan shorter than eight weeks', () => {
      page.selectedCourseId = 'challenger-ielts-guarantee';
      expect(page.quote.quoteError).toContain('8周');
      page.selectedWeeks = 8;
      expect(page.quote.quoteError).toBe('');
    });

    it('keeps the other campus’s uploads off this page', () => {
      const photo = (url: string): SchoolPhotoDTO => ({ schoolId: 'jic', url, displayOrder: 0, isActive: true });
      const accept = (url: string) => (page as unknown as { acceptUploadedMedia(p: SchoolPhotoDTO): boolean }).acceptUploadedMedia(photo(url));
      expect(accept('/assets/philippines/jic-premium-cafe.webp')).toBeFalse();
      expect(accept('/assets/philippines/jic-main-library.webp')).toBeTrue();
      expect(accept('/school/media-file/untagged')).toBeTrue();
    });
  });

  describe('Premium', () => {
    let page: JicPremiumSchoolComponent;
    beforeEach(() => {
      page = TestBed.runInInjectionContext(() => new JicPremiumSchoolComponent());
      page.selectedCourseId = 'premium-speaking-starter-7';
      page.selectedRoomId = 'premium-single-no-balcony';
      page.selectedStartDate = '2027-02-21';
      page.selectedWeeks = 4;
    });

    it('offers only Premium courses and rooms and no paid-class choice', () => {
      expect(page.courseFees.every(course => course.id.startsWith('premium-'))).toBeTrue();
      expect(page.roomFees.every(room => room.id.startsWith('premium-'))).toBeTrue();
      expect(page.students[0].extraChoices![1].visible).toBeFalse();
      expect(page.students[0].localFees.some(fee => fee.item === '付费特别课')).toBeFalse();
    });

    it('gives the 2027 off-season offer to the 单人雅房', () => {
      // 800 tuition + 1,250 room − 50 off-season offer.
      expect(page.quote.quoteUsd).toBe(2000);
      expect(page.schoolPaymentItems.find(row => row.label === '淡季优惠')?.amount).toContain('50');
      expect(page.quoteImageData.headingText).toBe('JIC Premium 4周报价');
    });
  });
});

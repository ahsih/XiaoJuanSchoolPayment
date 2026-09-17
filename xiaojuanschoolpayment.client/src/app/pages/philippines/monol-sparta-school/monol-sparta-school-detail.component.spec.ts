import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { EMPTY, of } from 'rxjs';
import { ExchangeRateService } from '../../../../services/exchange-rate.service';
import { SchoolContentService } from '../../../../services/school-content.service';
import { SchoolService } from '../../../../services/school.service';
import { createDefaultMonolSpartaContentConfig } from './monol-sparta-content-config';
import { MonolSpartaSchoolDetailComponent } from './monol-sparta-school-detail.component';

describe('MONOL Sparta independent pricing and quote', () => {
  let component: MonolSpartaSchoolDetailComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [
      { provide: SchoolService, useValue: { getSchools: () => of([]) } },
      { provide: SchoolContentService, useValue: { getPublished: () => of(null) } },
      { provide: ExchangeRateService, useValue: { getLatestCnyRates: () => EMPTY } },
      { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: convertToParamMap({}) } } },
      { provide: ElementRef, useValue: new ElementRef(document.createElement('div')) },
    ] });
    component = TestBed.runInInjectionContext(() => new MonolSpartaSchoolDetailComponent());
    component.students[0].selectedRegistrationDate = '2026-09-17';
    component.selectedStartDate = '2026-09-20';
  });

  it('keeps the Sparta catalog separate from the MONOL main campus', () => {
    expect(component.courseFees.map(item => [item.name, item.tuition])).toEqual([
      ['Booster ESL', 950], ['Master IELTS', 950],
    ]);
    expect(component.roomFees.map(item => [item.name, item.fee])).toEqual([
      ['高级单人间', 1200], ['标准单人间', 1050], ['单人雅房', 900], ['双人间', 800], ['三人间', 700],
    ]);
    expect(JSON.stringify(component.courseFees)).not.toContain('General ESL');
    expect(JSON.stringify(component.roomFees)).not.toContain('胶囊');
  });

  it('applies only confirmed stackable offers and keeps SNS outside the total', () => {
    expect(component.quoteUsd).toBe(1450);
    expect(component.students[0].registration).toBe(0);
    expect(component.schoolPaymentItems[0].amount).toBe('0 美元');
    expect(component.coursePromotionDiscountAmount).toBe(100);
    expect(component.roomPromotionDiscountAmount).toBe(100);
    expect(component.snsDiscountAmount).toBe(0);
    component.applySnsPromotion = true;
    expect(component.quoteUsd).toBe(1450);
    expect(component.schoolPaymentItems.find(item => item.label.includes('SNS'))?.amount).toBe('未计入');
    component.students[0].selectedRegistrationDate = '2027-01-01';
    expect(component.quoteUsd).toBe(1650);
  });

  it('uses the supplied passport-specific cumulative visa schedules', () => {
    expect(component.localFeeTotal).toBe(15300);
    component.selectedWeeks = 12;
    expect(component.visaExtensionFee).toBe(6210);
    expect(component.localFeeTotal).toBe(21510);
    component.students[0].visaType = 'china30';
    expect(component.visaExtensionFee).toBe(10450);
    component.students[0].visaType = 'hongkong14';
    expect(component.visaExtensionFee).toBe(13610);
    component.students[0].visaType = 'macau7';
    expect(component.visaExtensionFee).toBe(13610);
  });

  it('keeps special pickup, deposit and conditional TVV ACR outside the peso total', () => {
    component.students[0].pickup = 'manila-special';
    expect(component.localFeeTotal).toBe(12300);
    expect(component.optionalFeeItems.map(item => item.label)).toContain('水电费');
    expect(component.optionalFeeItems.map(item => item.label)).toContain('教材费');
    expect(component.optionalFeeItems.map(item => item.label)).toContain('Academic Admin Fee');
    expect(component.optionalFeeItems.map(item => item.label)).toContain('马尼拉机场特别个人接机');
    expect(component.optionalFeeItems[0].amount).toBe('100 美元');
    expect(component.optionalFeeItems.find(item => item.label === '马尼拉机场特别个人接机')?.amount).toBe('12,000 比索');
  });

  it('supports independent 2–20-person plans and aggregates the shared calculation', () => {
    component.setQuoteMode('group');
    component.studentCount = 2;
    component.students[1].selectedRegistrationDate = '2026-09-17';
    component.students[1].quotePlan.courses[0].optionId = 'master-ielts';
    component.students[1].quotePlan.rooms[0].optionId = 'premium-single-room';
    component.students[1].quotePlan.courses[0].startDate = '2026-09-20';
    component.students[1].quotePlan.rooms[0].startDate = '2026-09-20';
    component.students[1].pickup = 'clark-group';
    expect(component.quoteUsd).toBe(3400);
    expect(component.quoteImageData.headingText).toBe('MONOL斯巴达校区 2人报价');
    expect(component.estimatedLocalFees.find(item => item.item === 'SSP特殊学习许可证')?.quantity).toBe(2);
  });

  it('uses the full-detail quote image with Chinese currency names', () => {
    const quote = component.quoteImageData;
    expect(quote.layout).toBe('cia-detailed');
    expect(quote.headingText).toBe('MONOL斯巴达校区 4周报价');
    expect(quote.fullFeeDetails).toBeTrue();
    expect(quote.localFeeAmount).toBe('15,300 比索');
    expect(quote.totalUsd).toBe('1,450 美元');
    expect(JSON.stringify(quote)).not.toContain('General ESL');
  });

  it('uses China tourist-visa labels and exposes complete categorized media', () => {
    expect(component.students[0].visaOptions.map(option => option.label)).toEqual([
      '中国护照（59天旅游签证）',
      '中国护照（30天旅游签证）',
      '香港特区护照（14天免签停留）',
      '澳门特区护照（7天免签停留）',
    ]);
    expect(component.students[0].visaOptions.some(option => option.label.includes('台湾'))).toBeFalse();
    expect(component.galleryImagesForCategory('高级单人间').length).toBe(12);
    expect(component.galleryImagesForCategory('教室').length).toBe(18);
    expect(component.galleryCategories as string[]).not.toContain('视频');
    const albumVideoCounts = new Map([
      ['校区', 1],
      ['教室', 1],
      ['高级单人间', 1],
      ['标准单人间', 1],
      ['单人雅房', 1],
      ['双人间', 1],
      ['三人间', 2],
      ['餐厅与餐食', 1],
      ['屋顶与运动场', 2],
      ['纪律管理', 1],
    ] as const);
    for (const [category, expectedCount] of albumVideoCounts) {
      const media = component.galleryImagesForCategory(category);
      expect(media[0].contentType).toBe('video/mp4');
      expect(media.filter(item => item.contentType?.startsWith('video/')).length).toBe(expectedCount);
    }
    expect(component.galleryImages.filter(item => item.contentType?.startsWith('video/')).length).toBe(12);
  });

  it('accepts employee-published Sparta content and active media only', () => {
    const content = createDefaultMonolSpartaContentConfig();
    content.courses[0].tuition = 975;
    content.media = [
      { id: 'photo-1', schoolId: 'sparta', url: '/uploads/sparta-room.webp', contentType: 'image/webp', category: 'Premium Room', caption: '新房型照片', altText: '高级单人间', displayOrder: 1, isActive: true },
      { id: 'hidden-1', schoolId: 'sparta', url: '/uploads/hidden.webp', contentType: 'image/webp', category: 'Campus', caption: '隐藏图片', altText: '', displayOrder: 2, isActive: false },
    ];
    component['applyContentConfig'](content);
    expect(component.students[0].tuition).toBe(975);
    expect(component.galleryImages.find(item => item.src === '/uploads/sparta-room.webp')?.category).toBe('高级单人间');
    expect(component.galleryImages.some(item => item.src === '/uploads/hidden.webp')).toBeFalse();
  });
});

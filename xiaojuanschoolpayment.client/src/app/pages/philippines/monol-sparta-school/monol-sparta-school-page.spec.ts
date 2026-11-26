import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { chinaToday, ExchangeRateService } from '../../../../services/exchange-rate.service';
import { SchoolContentService } from '../../../../services/school-content.service';
import { SchoolService } from '../../../../services/school.service';
import { cloneMonolSpartaContentConfig, createDefaultMonolSpartaContentConfig, MONOL_SPARTA_POLICY_VERSION } from './monol-sparta-content-config';
import { monolSpartaVisaExtensions } from './monol-sparta-page-quote';
import { MonolSpartaSchoolPageComponent } from './monol-sparta-school-page.component';

// MONOL Sparta on the shared Philippine school template: the August 2026 fee sheet and promotion poster and the
// October 2026 student handbook from the school's Google Drive pack.
describe('MONOL Sparta page on the shared template', () => {
  let page: MonolSpartaSchoolPageComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [
      { provide: SchoolService, useValue: { getSchools: () => of([]) } },
      { provide: SchoolContentService, useValue: { getPublished: () => of(null) } },
      { provide: ExchangeRateService, useValue: { getLatestCnyRates: () => of({ date: chinaToday(), usdToCny: 7, phpPerCny: 8.2 }) } },
      { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: { get: () => null } } } },
      { provide: ElementRef, useValue: new ElementRef(document.createElement('div')) },
    ] });
    page = TestBed.runInInjectionContext(() => new MonolSpartaSchoolPageComponent());
    page.students[0].selectedRegistrationDate = '2026-11-24';
    page.selectedStartDate = '2026-11-29';
  });

  const student = () => page.students[0];
  const payment = (label: string) => page.schoolPaymentItems.find(row => row.label === label);
  const localFee = (item: string) => page.estimatedLocalFees.find(fee => fee.item.startsWith(item));
  const optional = (label: string) => page.optionalFeeItems.find(fee => fee.label === label);

  it('prices four weeks of Booster ESL in a triple room with both 2026 offers and no registration fee', () => {
    expect(page.selectedCourseId).toBe('booster-esl');
    expect(page.selectedRoomId).toBe('triple-room');
    // 950 + 700 − 100 course offer − 100 room offer; registration waived
    expect(page.quote.quoteUsd).toBe(1450);
    expect(payment('注册费')?.amount).toBe('0 美元');
    expect(payment('注册费')?.note).toContain('通过思达启航报名免收');
    expect(payment('2026学费优惠')?.amount).toBe('− 100 美元');
    expect(payment('2026住宿优惠')?.amount).toBe('− 100 美元');
    expect(page.quoteImageData.headingText).toContain('MONOL斯巴达校区 4周报价');
    expect(page.quoteImageData.compactDetailedSections).toBeTrue();
    const roomRow = page.quoteImageData.paymentItems?.find(item => item.label.startsWith('住宿名称'));
    expect(roomRow?.note).toContain('三人一间，最省预算；住宿含平日三餐');
  });

  it('deducts the SNS offer only when chosen, and drops the 2026 offers after 2026/12/31', () => {
    const sns = student().extraChoices![1];
    expect(sns.visible).toBeTrue();
    sns.value = true;
    expect(page.quote.quoteUsd).toBe(1350);
    student().selectedRegistrationDate = '2027-01-05';
    expect(sns.visible).toBeFalse();
    expect(page.quote.quoteUsd).toBe(1650);
  });

  it('counts complete four-week blocks across split courses', () => {
    page.selectedWeeks = 8;
    page.quotePlan.splitStay('course');
    const rows = page.quotePlan.courses;
    expect(rows.length).toBe(2);
    rows[1].optionId = 'master-ielts';
    // 1,900 tuition + 1,400 room − 2 × 100 − 2 × 100
    expect(page.quote.quoteUsd).toBe(2900);
  });

  it('asks the consultant for stays under four weeks', () => {
    page.selectedWeeks = 2;
    expect(page.quote.quoteError).toContain('暂不支持2周报价');
  });

  it('adds 60 dollars a week for the 2027 summer peak, outside the offers', () => {
    page.selectedStartDate = '2027-06-27';
    page.selectedWeeks = 8;
    expect(student().seasonalSurcharge).toBe(480);
    expect(payment('暑期旺季附加费')).toBeDefined();
    expect(page.quote.quoteUsd).toBe(1900 + 1400 + 480 - 400);
  });

  it('follows the handbook visa sequences by passport and stay', () => {
    expect(monolSpartaVisaExtensions('tourist59', 8)).toBe(0);
    expect(monolSpartaVisaExtensions('tourist59', 9)).toBe(1);
    expect(monolSpartaVisaExtensions('tourist30', 4)).toBe(0);
    expect(monolSpartaVisaExtensions('tourist30', 5)).toBe(1);
    expect(monolSpartaVisaExtensions('tourist30', 12)).toBe(2);
    expect(monolSpartaVisaExtensions('hongkong14', 4)).toBe(2);
    expect(monolSpartaVisaExtensions('macau7', 2)).toBe(1);

    page.selectedWeeks = 12;
    expect(localFee('签证延签')?.total).toBe(6210);
    student().visaType = 'tourist30';
    expect(localFee('签证延签')?.total).toBe(11150);
    page.selectedWeeks = 24;
    expect(localFee('签证延签')?.total).toBe(23870);
    student().visaType = 'hongkong14';
    page.selectedWeeks = 9;
    expect(localFee('签证延签')?.total).toBe(13610);
  });

  it('estimates local fees with the chosen group pickup and lists the deposit apart', () => {
    expect(localFee('SSP特殊学习许可证')?.total).toBe(7800);
    expect(localFee('SSP ACR I-CARD')?.total).toBe(4500);
    expect(localFee('马尼拉机场团体接机')?.total).toBe(3000);
    expect(page.estimatedLocalFeeTotal).toBe(15300);
    expect(optional('宿舍押金')?.amount).toBe('100 美元');
    expect(optional('TVV ACR I-CARD')).toBeUndefined();

    student().extraChoices![0].value = 'manila-special';
    expect(localFee('马尼拉机场团体接机')).toBeUndefined();
    expect(page.estimatedLocalFeeTotal).toBe(12300);
    expect(optional('马尼拉机场个人接机')?.amount).toBe('12,000 比索');

    page.selectedWeeks = 12;
    expect(optional('TVV ACR I-CARD')).toBeDefined();
  });

  it('says in a group quote that everyone is free of registration', () => {
    page.quote.setQuoteMode('group');
    page.quote.studentCount = 2;
    expect(payment('注册费')?.note).toContain('本次2人全部免收');
  });

  it('moves an older saved document onto the handbook names and visa sequence once', () => {
    const old = createDefaultMonolSpartaContentConfig();
    const settings = old.quoteSettings as typeof old.quoteSettings & { monolSpartaPolicyVersion?: number };
    delete settings.monolSpartaPolicyVersion;
    old.courses[0].name = 'Booster ESL';
    old.rooms[0].name = '高级单人间';
    old.localFees.push({ id: 'textbook-materials', name: '教材费（待确认）', currency: 'PHP', amount: 0, billingRule: 'once', includeInTotal: false, note: '', enabled: true, sortOrder: 9 });
    const upgraded = cloneMonolSpartaContentConfig(old);
    expect(upgraded.courses[0].name).toBe('Booster ESL 强化ESL');
    expect(upgraded.rooms[0].name).toBe('豪华单人间');
    expect(upgraded.localFees.find(fee => fee.id === 'textbook-materials')?.enabled).toBeFalse();
    expect((upgraded.quoteSettings as typeof settings).monolSpartaPolicyVersion).toBe(MONOL_SPARTA_POLICY_VERSION);
  });
});

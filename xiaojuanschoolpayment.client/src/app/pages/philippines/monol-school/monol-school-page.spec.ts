import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { chinaToday, ExchangeRateService } from '../../../../services/exchange-rate.service';
import { SchoolContentService } from '../../../../services/school-content.service';
import { SchoolService } from '../../../../services/school.service';
import { cloneMonolContentConfig, createDefaultMonolContentConfig, MONOL_POLICY_VERSION } from './monol-content-config';
import { monolVisaExtensions } from './monol-page-quote';
import { monolRoomGroupNotes } from './monol-page-profile';
import { MonolSchoolPageComponent } from './monol-school-page.component';

// MONOL main campus on the shared Philippine school template: the 2026-09-07 fee sheet, the October 2026 student
// handbook, the 2026-10-23 overview and the 2026 promotion poster from the school's Google Drive pack.
describe('MONOL main-campus page on the shared template', () => {
  let page: MonolSchoolPageComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [
      { provide: SchoolService, useValue: { getSchools: () => of([]) } },
      { provide: SchoolContentService, useValue: { getPublished: () => of(null) } },
      { provide: ExchangeRateService, useValue: { getLatestCnyRates: () => of({ date: chinaToday(), usdToCny: 7, phpPerCny: 8.2 }) } },
      { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: { get: () => null } } } },
      { provide: ElementRef, useValue: new ElementRef(document.createElement('div')) },
    ] });
    page = TestBed.runInInjectionContext(() => new MonolSchoolPageComponent());
    page.students[0].selectedRegistrationDate = '2026-11-25';
    page.selectedStartDate = '2026-11-29';
  });

  const student = () => page.students[0];
  const choice = (label: string) => student().extraChoices!.find(item => item.label === label)!;
  const payment = (label: string) => page.schoolPaymentItems.find(row => row.label === label);
  const localFee = (item: string) => page.estimatedLocalFees.find(fee => fee.item.startsWith(item));
  const optional = (label: string) => page.optionalFeeItems.find(fee => fee.label.startsWith(label));

  it('prices four weeks of General ESL in a triple room with the 2026 and Christmas offers and no registration fee', () => {
    expect(page.selectedCourseId).toBe('general-esl');
    expect(page.selectedRoomId).toBe('triple-room');
    // 900 + 500 − 100 course − 100 room − 100 Christmas; registration waived
    expect(page.quote.quoteUsd).toBe(1100);
    expect(payment('注册费')?.amount).toBe('0 美元');
    expect(payment('注册费')?.note).toContain('通过思达启航报名免收');
    expect(payment('2026学费优惠')?.amount).toBe('− 100 美元');
    expect(payment('2026住宿优惠')?.amount).toBe('− 100 美元');
    expect(payment('圣诞新年优惠')?.amount).toBe('− 100 美元');
    expect(page.quoteImageData.headingText).toContain('MONOL主校区 4周报价');
    expect(page.quoteImageData.compactDetailedSections).toBeTrue();
  });

  it('prices one to three weeks at 40/60/80% of the four-week price, without four-week offers', () => {
    page.selectedWeeks = 2;
    expect(page.quote.quoteError).toBe('');
    // (900 + 500) × 60%
    expect(page.quote.quoteUsd).toBe(840);
    expect(payment('圣诞新年优惠')).toBeUndefined();
  });

  it('adds the long-stay offer from 16 study-and-stay weeks', () => {
    page.selectedWeeks = 16;
    // 3,600 + 2,000 − 400 − 400 − 150 − 100
    expect(page.quote.quoteUsd).toBe(4550);
    expect(payment('长住优惠')?.amount).toBe('− 150 美元');
  });

  it('gives the SNS offer only for standard and semi-single rooms when chosen', () => {
    expect(choice('SNS活动').visible).toBeFalse();
    page.quotePlan.rooms[0].optionId = 'standard-single-room';
    expect(choice('SNS活动').visible).toBeTrue();
    choice('SNS活动').value = true;
    // 900 + 750 − 100 − 100 − 100 SNS − 100 Christmas
    expect(page.quote.quoteUsd).toBe(1250);
    student().selectedRegistrationDate = '2027-01-05';
    expect(choice('SNS活动').visible).toBeFalse();
    // 2027 registration: 900 + 800 (standard single 2027 price) − 100 Christmas
    expect(page.quote.quoteUsd).toBe(1600);
  });

  it('charges every room 50 dollars more per four weeks for registrations from 2027/01/01', () => {
    student().selectedRegistrationDate = '2026-12-31';
    page.selectedStartDate = '2027-03-07';
    // 900 + 500 − 100 course − 100 room
    expect(page.quote.quoteUsd).toBe(1200);
    student().selectedRegistrationDate = '2027-01-01';
    // 900 + 550, no 2026 offers; courses cost the same
    expect(page.quote.quoteUsd).toBe(1450);
    page.quotePlan.rooms[0].optionId = 'premium-single-b';
    expect(page.quote.quoteUsd).toBe(900 + 1150);
    choice('高级单人间同住').value = true;
    // A sharer still pays 200 per four weeks
    expect(page.quote.quoteUsd).toBe(1100);
  });

  it('lists the 2027 room prices under each room group until the switch', () => {
    const rooms = createDefaultMonolContentConfig().rooms;
    const notes = monolRoomGroupNotes(rooms, true);
    expect(notes['多人间']).toBe('2026/12/31前报名按现价；2027/01/01起报名：三人间 550、胶囊四人间 450 美元。');
    expect(notes['单人间']).toContain('同住的每人每4周加200美元。2026/12/31前报名按现价；2027/01/01起报名：高级单人间A型 1,150、高级单人间B型 1,150、标准单人间 800、单人雅房 700 美元。');
    const after = monolRoomGroupNotes(rooms, false);
    expect(after['多人间']).toBeUndefined();
    expect(after['单人间']).toBe('高级单人间A型和B型有两张大床，最多4人同住，同住的每人每4周加200美元。');
  });

  it('charges a second Premium Single sharer 200 dollars per four weeks without room offers', () => {
    expect(choice('高级单人间同住').visible).toBeFalse();
    page.quotePlan.rooms[0].optionId = 'premium-single-room';
    expect(choice('高级单人间同住').visible).toBeTrue();
    expect(page.quote.quoteUsd).toBe(900 + 1100 - 300);
    choice('高级单人间同住').value = true;
    expect(page.quote.quoteUsd).toBe(900 + 200 - 200);
    expect(payment('2026住宿优惠')).toBeUndefined();
  });

  it('leaves the 2027/06/27–08/21 weeks out of the four-week offers and adds the 60-dollar summer surcharge', () => {
    page.selectedStartDate = '2027-06-13';
    page.selectedWeeks = 12;
    expect(payment('2026学费优惠')?.amount).toBe('− 100 美元');
    expect(payment('2026住宿优惠')?.amount).toBe('− 100 美元');
    expect(payment('暑期旺季附加费')).toBeDefined();

    student().selectedRegistrationDate = '2027-01-05';
    page.selectedStartDate = '2027-06-27';
    page.selectedWeeks = 8;
    expect(student().seasonalSurcharge).toBe(480);
    // 2027 registration: the triple room is 550 per four weeks
    expect(page.quote.quoteUsd).toBe(1800 + 1100 + 480);
  });

  it('follows the fee sheet visa sequence for 30-day and 59-day visas', () => {
    expect(monolVisaExtensions('tourist59', 8)).toBe(0);
    expect(monolVisaExtensions('tourist59', 9)).toBe(1);
    expect(monolVisaExtensions('tourist30', 4)).toBe(0);
    expect(monolVisaExtensions('tourist30', 5)).toBe(1);
    expect(monolVisaExtensions('tourist30', 12)).toBe(2);

    page.selectedWeeks = 12;
    expect(localFee('签证延签')?.total).toBe(6210);
    student().visaType = 'tourist30';
    expect(localFee('签证延签')?.total).toBe(10450);
    page.selectedWeeks = 24;
    expect(localFee('签证延签')?.total).toBe(23170);
  });

  it('estimates local fees with the chosen group pickup and lists deposit, meals and TVV apart', () => {
    expect(localFee('SSP特殊学习许可证')?.total).toBe(7800);
    expect(localFee('SSP ACR I-CARD')?.total).toBe(4500);
    expect(localFee('马尼拉机场团体接机')?.total).toBe(3000);
    expect(page.estimatedLocalFeeTotal).toBe(15300);
    expect(optional('宿舍押金')?.amount).toBe('100 美元');
    expect(optional('餐费')).toBeDefined();
    expect(optional('TVV ACR I-CARD')).toBeUndefined();

    choice('接机').value = 'clark-special';
    expect(page.estimatedLocalFeeTotal).toBe(12300);
    expect(optional('克拉克机场个人接机')?.amount).toBe('7,000 比索');

    page.selectedWeeks = 12;
    expect(optional('TVV ACR I-CARD')).toBeDefined();
  });

  it('says in a group quote that everyone is free of registration', () => {
    page.quote.setQuoteMode('group');
    page.quote.studentCount = 2;
    expect(payment('注册费')?.note).toContain('本次2人全部免收');
  });

  it('moves an older saved document onto the November pack once and keeps edited prices', () => {
    const old = createDefaultMonolContentConfig();
    const settings = old.quoteSettings as typeof old.quoteSettings & { monolPolicyVersion?: number };
    delete settings.monolPolicyVersion;
    old.courses[0].name = 'ESL 4';
    old.rooms = old.rooms.filter(room => room.id !== 'premium-single-b');
    old.rooms[0].name = '高级单人间';
    old.rooms[0].fee = 1080;
    old.rooms.forEach(room => delete room.fee2027);
    old.localFees.push({ id: 'books', name: '教材费', currency: 'PHP', amount: 2000, billingRule: 'once', includeInTotal: true, note: '', enabled: true, sortOrder: 9 });
    const upgraded = cloneMonolContentConfig(old);
    expect(upgraded.courses[0].name).toBe('Light ESL 轻量ESL');
    expect(upgraded.rooms.find(room => room.id === 'premium-single-room')?.name).toBe('高级单人间A型');
    expect(upgraded.rooms.find(room => room.id === 'premium-single-b')?.fee).toBe(1080);
    expect(upgraded.rooms.find(room => room.id === 'premium-single-b')?.fee2027).toBe(1130);
    expect(upgraded.rooms.find(room => room.id === 'premium-single-room')?.fee2027).toBe(1130);
    expect(upgraded.rooms.find(room => room.id === 'triple-room')?.fee2027).toBe(550);
    expect(upgraded.localFees.some(fee => fee.id === 'books')).toBeFalse();
    expect((upgraded.quoteSettings as typeof settings).monolPolicyVersion).toBe(MONOL_POLICY_VERSION);
  });
});

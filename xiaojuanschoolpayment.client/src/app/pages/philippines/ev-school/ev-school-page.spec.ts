import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { chinaToday, ExchangeRateService } from '../../../../services/exchange-rate.service';
import { SchoolContentService } from '../../../../services/school-content.service';
import { SchoolService } from '../../../../services/school.service';
import { cloneEvContentConfig, createDefaultEvContentConfig } from './ev-content-config';
import { EV_PAGE_PROFILE } from './ev-page-profile';
import { EvSchoolPageComponent } from './ev-school-page.component';
import { rotateForDay } from '../school-page/ph-school-page.component';

// The EV page on the shared Philippine school template: amounts must match the EV price list and
// the 2026-08-10 local-fee sheets exactly as the former EV page did.
describe('EV school page on the shared template', () => {
  let page: EvSchoolPageComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [
      { provide: SchoolService, useValue: { getSchools: () => of([]) } },
      { provide: SchoolContentService, useValue: { getPublished: () => of(null) } },
      { provide: ExchangeRateService, useValue: { getLatestCnyRates: () => of({ date: chinaToday(), usdToCny: 7, phpPerCny: 8.2 }) } },
      { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: { get: () => null } } } },
      { provide: ElementRef, useValue: new ElementRef(document.createElement('div')) },
    ] });
    page = TestBed.runInInjectionContext(() => new EvSchoolPageComponent());
    page.selectedStartDate = '2026-09-13';
  });

  const student = () => page.students[0];
  const localFee = (item: string) => page.estimatedLocalFees.find(fee => fee.item === item)?.total ?? 0;
  const payment = (label: string) => page.schoolPaymentItems.find(row => row.label === label);

  it('prices the default four-week Semi-Sparta ESL plan with the Sida 95% rate', () => {
    expect(page.selectedCourseId).toBe('semi-sparta-esl');
    expect(page.selectedRoomId).toBe('quad-bunk');
    expect(page.quote.quoteUsd).toBe(1886);
    expect(page.quote.estimatedLocalFeeTotal).toBe(20000);
    expect(payment('思达启航折扣')?.amount).toBe('− 94 美元');
    expect(page.quoteImageData.headingText).toBe('EV主校区 4周报价');
  });

  it('charges the 2027 CALA peak season once per overlapping week, outside the discount', () => {
    page.selectedStartDate = '2027-07-04';
    page.selectedWeeks = 8;
    expect(student().peakWeeks).toBe(8);
    expect(student().seasonalSurcharge).toBe(480);
    expect(student().promotionDiscountTotal).toBe(188);
    expect(page.quote.quoteUsd).toBe(4152);
    const row = payment('旺季附加费');
    expect(row?.amount).toBe('480 美元');
    expect(row?.note).toContain('2027/07/04–2027/08/28');
    expect(row?.note).toContain('不参与折扣');

    page.selectedStartDate = '2027-08-29';
    expect(student().seasonalSurcharge).toBe(0);
    expect(payment('旺季附加费')).toBeUndefined();
  });

  it('starts visa extensions at week 5 or 9 and adds ACR with the first extension', () => {
    student().visaType = 'tourist30';
    page.selectedWeeks = 9;
    expect(localFee('签证续签')).toBe(11830);
    expect(localFee('ACR-I Card 外国人身份证')).toBe(4000);
    page.selectedWeeks = 5;
    expect(localFee('签证续签')).toBe(5430);
    expect(localFee('ACR-I Card 外国人身份证')).toBe(4000);
    page.selectedWeeks = 4;
    expect(localFee('ACR-I Card 外国人身份证')).toBe(0);
    student().visaType = 'tourist59';
    page.selectedWeeks = 9;
    expect(localFee('签证续签')).toBe(6700);
    expect(localFee('ACR-I Card 外国人身份证')).toBe(4000);
    page.selectedWeeks = 8;
    expect(localFee('签证续签')).toBe(0);
    expect(localFee('ACR-I Card 外国人身份证')).toBe(0);
  });

  it('matches the 2026-08-10 dormitory and condo local-fee sheets without deposit or pickup', () => {
    const cases: Array<[number, 'tourist30' | 'tourist59', string, number, number]> = [
      [4, 'tourist30', 'quad-bunk', 18000, 3000],
      [12, 'tourist30', 'quad-bunk', 44230, 5000],
      [12, 'tourist59', 'quad-bunk', 39100, 5000],
      [6, 'tourist59', 'off-campus-single', 23600, 3000],
    ];
    for (const [weeks, visa, room, local, deposit] of cases) {
      page.selectedRoomId = room;
      page.selectedWeeks = weeks;
      student().visaType = visa;
      const withoutBooks = page.estimatedLocalFees
        .filter(fee => !['教材费', 'ARP外国人登记'].includes(fee.item))
        .reduce((sum, fee) => sum + fee.total, 0);
      expect(withoutBooks).withContext(`${weeks}周 ${visa} ${room}`).toBe(local);
      expect(student().calculator.roomDeposit).withContext(`${weeks}周押金`).toBe(deposit);
    }
    expect(page.optionalFeeItems.map(item => item.label)).toEqual(jasmine.arrayContaining(['房间押金']));
  });

  it('requires at least eight weeks for the IELTS Guarantee course', () => {
    page.selectedCourseId = 'sparta-ielts-guarantee';
    page.selectedRoomId = 'single';
    page.selectedWeeks = 4;
    expect(page.quoteError).toContain('须至少就读8周');
    page.selectedWeeks = 8;
    expect(page.quoteError).toBe('');
    expect(Math.round(student().registration + student().tuition + student().accommodation)).toBe(5600);
  });

  it('keeps the off-campus condo for Semi-Sparta course students only', () => {
    page.selectedRoomId = 'off-campus-single';
    expect(page.quoteError).toBe('');
    page.selectedCourseId = 'sparta-intensive-esl';
    expect(page.quoteError).toContain('校外公寓仅限半斯巴达课程');
  });

  it('adds the under-18 management fee per started four course weeks', () => {
    const adult = page.quote.quoteUsd;
    student().selectedAgeGroup = 'minor';
    expect(page.quote.quoteUsd).toBe(adult + 100);
    expect(payment('未成年管理费')?.amount).toBe('100 美元');
    student().selectedAgeGroup = 'adult';
    expect(payment('未成年管理费')).toBeUndefined();
  });

  it('quotes groups per student and waives registration for returning students', () => {
    page.setQuoteView('group');
    expect(page.activeStudents.length).toBe(2);
    expect(page.quote.quoteUsd).toBe(3772);
    page.activeStudents[1].returningStudent = true;
    expect(page.quote.quoteUsd).toBe(3672);
    expect(page.quoteImageData.headingText).toBe('EV主校区 2人报价');
  });

  it('compares room choices with the same rules as the single quote', () => {
    page.setQuoteView('compare');
    const totals = page.compareSheet.rows.find(row => row.label === '学校费用合计')?.values ?? [];
    expect(totals[0]).toBe('1,886 美元');
    expect(totals.length).toBeGreaterThan(1);
  });

  it('writes the brand in full and upgrades saved short brand names', () => {
    const saved = createDefaultEvContentConfig();
    saved.quoteSettings.promotions.find(rule => rule.id === 'ev-sida-95')!.name = '思达折扣';
    saved.quoteImageSettings.footerNotes = ['学费可交由思达游学代收'];
    const upgraded = cloneEvContentConfig(saved);
    expect(upgraded.quoteSettings.promotions.find(rule => rule.id === 'ev-sida-95')!.name).toBe('思达启航折扣');
    expect(upgraded.quoteImageSettings.footerNotes[0]).toBe('学费可交由思达启航代收');
    expect(JSON.stringify(EV_PAGE_PROFILE.copy)).not.toMatch(/思达(?!启航)/);
  });

  it('upgrades saved content to the weekday-only condo shuttle and the agent 95% offer only', () => {
    const saved = createDefaultEvContentConfig();
    saved.quoteSettings.evPolicyVersion = 1;
    saved.rooms.find(room => room.id === 'off-campus-single')!.note = '仅限半斯巴达课程；无门禁，每天有接驳车往返学校';
    saved.quoteSettings.extraNightRates = [];
    saved.quoteSettings.promotions.push({
      ...saved.quoteSettings.promotions[0], id: 'ev-old-school-offer', name: '学校旧优惠', enabled: true,
    });
    const upgraded = cloneEvContentConfig(saved);
    expect(upgraded.rooms.find(room => room.id === 'off-campus-single')!.note).toContain('有接驳车往返学校');
    expect(upgraded.quoteSettings.extraNightRates).toEqual([{ label: '延住（所有房型）', amount: 2000 }]);
    expect(upgraded.quoteSettings.promotions.filter(rule => rule.enabled).map(rule => rule.id))
      .toEqual(['ev-sida-95', 'ev-returning-registration']);
    expect(JSON.stringify(EV_PAGE_PROFILE)).not.toContain('每天有接驳车');
  });

  it('upgrades untouched version-2 check-in, minor and electricity wording from the 2026-11 school pack', () => {
    const saved = createDefaultEvContentConfig();
    saved.quoteSettings.evPolicyVersion = 2;
    saved.quoteSettings.stayPolicies = [
      { label: '入住日期', value: '周六或周日入住', note: '校外公寓周六15:00后入住；周一上午分级测试和新生说明会。' },
      { label: '离校日期', value: '员工改过的离校说明', note: '' },
      { label: '未成年学生', value: '外出须监护人陪同', note: '平日不可外出，周末无监护人不可外出，门禁21:00。' },
    ];
    const oldNote = '每周含15度电；超出部分每度20比索，从押金中扣除。';
    saved.localFees.find(fee => fee.id === 'electricity')!.note = oldNote;
    saved.quoteImageSettings.localFeeNotes['electricity'] = oldNote;
    const upgraded = cloneEvContentConfig(saved);
    const policies = upgraded.quoteSettings.stayPolicies;
    expect(policies[0].value).toBe('周六15:00后或周日入住');
    expect(policies[1].value).toBe('员工改过的离校说明');
    expect(policies[2].note).toContain('未满15岁学校不接收');
    expect(upgraded.localFees.find(fee => fee.id === 'electricity')!.note).toContain('超过押金须补交差额');
    expect(upgraded.quoteImageSettings.localFeeNotes['electricity']).toContain('超过押金须补交差额');
    expect(upgraded.quoteSettings.evPolicyVersion).toBe(4);
  });

  it('upgrades untouched version-3 ACR and condo wording from the colleague review', () => {
    const saved = createDefaultEvContentConfig();
    saved.quoteSettings.evPolicyVersion = 3;
    const oldAcr = '在菲律宾停留超过59天（第9周起）须办理，只收一次。';
    const oldCondo = '仅限半斯巴达课程；无门禁，平日有接驳车往返学校';
    saved.localFees.find(fee => fee.id === 'acr-i-card')!.note = oldAcr;
    saved.quoteImageSettings.localFeeNotes['acr-i-card'] = oldAcr;
    saved.rooms.find(room => room.id === 'off-campus-single')!.note = oldCondo;
    saved.rooms.find(room => room.id === 'off-campus-double')!.note = '员工改过的公寓说明';
    const upgraded = cloneEvContentConfig(saved);
    expect(upgraded.localFees.find(fee => fee.id === 'acr-i-card')!.note).toContain('首次续签时办理');
    expect(upgraded.quoteImageSettings.localFeeNotes['acr-i-card']).toContain('首次续签时办理');
    expect(upgraded.rooms.find(room => room.id === 'off-campus-single')!.note).toBe('仅限半斯巴达课程；无门禁，有接驳车往返学校');
    expect(upgraded.rooms.find(room => room.id === 'off-campus-double')!.note).toBe('员工改过的公寓说明');
    expect(upgraded.quoteSettings.evPolicyVersion).toBe(4);
  });

  it('shows the colleague-review fixes: timetable, curfew, condo rules, refund rules', () => {
    const sparta = page.scheduleColumns.find(column => column.title === '斯巴达')!.rows;
    const semi = page.scheduleColumns.find(column => column.title === '半斯巴达')!.rows;
    expect(semi.map(row => row.time)).toContain('07:00–08:00');
    expect(semi.find(row => row.time === '07:00–08:00')!.kind).toBe('meal');
    expect(sparta.find(row => row.time === '07:00–08:00')!.activity).toContain('早餐');
    expect(sparta.filter(row => row.time === '07:00–08:00').length).toBe(1);
    expect(sparta.filter(row => row.activity.includes('周一至')).every(row => row.kind === 'activity')).toBeTrue();
    expect(semi.map(row => row.time)).toContain('17:10–18:00');
    const fridays = EV_PAGE_PROFILE.studyModes!.flatMap(mode => mode.curfew.filter(entry => entry.day === '周五'));
    expect(fridays.map(entry => entry.time)).toEqual(['05:00–24:00', '05:00–24:00']);
    const condoShuttle = EV_PAGE_PROFILE.dormRules.find(rule => rule.title === '公寓接驳车')!.text;
    expect(condoShuttle).toContain('07:15、14:10');
    expect(page.copy.refund!.groups[0].rules[0].text).toContain('2,000元人民币');
    const beforeEntry = page.copy.refund!.groups[0].rules.map(rule => `${rule.when} ${rule.text}`);
    expect(beforeEntry).toContain('改期与保留 入学4周前告诉顾问，可以免费改入学日期，或申请把定金保留1年。');
    expect(beforeEntry).toContain('尾款 入学前2周还没有给学校付清尾款的，学校会直接取消学位，已预付的报名定金全部扣除。');
    expect(JSON.stringify(page.copy.refund)).not.toMatch(/中介|代办|佣金/);
    expect(page.copy.campus?.ruleText).toContain('周五17:10后或周六、周日');
  });

  it('shows the 2027 holiday table and the checked licences', () => {
    const months = page.calendarMonths;
    expect(months.length).toBe(12);
    expect(months[1].holidays.map(holiday => holiday.day)).toEqual(['24日']);
    expect(months[5].holidays).toEqual([]);
    expect(months.find(month => month.month === 7)!.peak).toBeTrue();
    expect(page.copy.license!.items.length).toBe(2);
    expect(JSON.stringify(EV_PAGE_PROFILE)).not.toMatch(/Cuenco|Nasipit|85177|AFF-2004/);
  });

  it('lists courses in a 半斯巴达 zone and a 斯巴达 zone and closes sections with a reference note', () => {
    const zones = page.courseModeZones!;
    expect(zones.map(zone => `${zone.title}:${zone.count}`)).toEqual(['半斯巴达:6', '斯巴达:8']);
    const names = (zone: number, title: string) => zones[zone].groups.find(group => group.title === title)!
      .courses.map(course => page.courseLineName(course.name, zones[zone].title));
    expect(names(1, '口语强化')).toEqual(['口语强化6', '口语强化8']);
    expect(names(0, '综合英语 ESL')).toEqual(['经典ESL']);
    expect(zones[0].groups.find(group => group.title === '雅思')!.missingNote).toBe('本类课程仅开设斯巴达');
    expect(page.copy.referenceNote).toContain('最终解释权归学校');
  });

  it('uses the CIA layout: videos first in the hero album, every room card opening its photos, the v2 image', () => {
    expect(page.compactLayout).toBeTrue();
    expect(page.heroAlbumItems[0].title).toBe('主校区导览');
    expect(page.heroAlbumChipGroups.map(group => group.label)).toEqual(['视频', '照片']);
    const rooms = page.roomRateGroups.flatMap(group => group.rooms);
    expect(rooms.length).toBe(6);
    expect(rooms.every(room => !!page.roomProfileForRate(room))).toBeTrue();
    expect(page.roomProfileForRate(rooms.find(room => room.id === 'off-campus-double')!)?.id).toBe('off-campus-double');
    expect(Object.keys(EV_PAGE_PROFILE.roomVideos!)).toEqual(['off-campus-single']);
    expect(EV_PAGE_PROFILE.videoTabs!.map(tab => tab.label)).toEqual(['校园视频', '课堂视频', '宿舍视频', '生活视频', '访谈视频']);
    expect(EV_PAGE_PROFILE.videoTabs!.flatMap(tab => tab.items).length).toBe(27);
    expect(EV_PAGE_PROFILE.videoTabs![4].items[0].title).toBe('越南学员 James：雅思5.0到7.0');
    expect(page.guidesForCourse('sparta-social-media-english').map(guide => guide.title)).toEqual(['社交媒体英语']);
    expect(page.generalCourseGuides.map(guide => guide.title)).toEqual(['免费选修课', '测试、换课与教师培训日']);
    expect(page.quoteImageData.layoutVersion).toBe(2);
    page.setQuoteView('compare');
    expect(page.compareSheet.rows[0].label).toBe('注册费');
  });
});

describe('floating 免费咨询 panel order', () => {
  const consultants = ['Perrin', 'Lemon', 'Iris', 'Lisa', 'Jenny'];
  const day = 24 * 60 * 60 * 1000;

  it('puts a different consultant first on each of five days, in China time', () => {
    const start = Date.UTC(2026, 10, 20, 16, 0, 0); // 2026-11-21 00:00 in China
    const leads = [0, 1, 2, 3, 4].map(offset => rotateForDay(consultants, start + offset * day)[0]);
    expect([...leads].sort()).toEqual([...consultants].sort());
    expect(rotateForDay(consultants, start + 5 * day)[0]).toBe(leads[0]);
    // Still the same lead until midnight in China, and every list keeps all five consultants.
    expect(rotateForDay(consultants, start + day - 1)[0]).toBe(leads[0]);
    expect(rotateForDay(consultants, start + 2 * day).length).toBe(5);
  });
});

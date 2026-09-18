import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, of } from 'rxjs';
import { SchoolContentService } from '../../../../services/school-content.service';
import { SchoolService } from '../../../../services/school.service';
import { ExchangeRateService } from '../../../../services/exchange-rate.service';
import { PhilinterSchoolDetailComponent } from './philinter-school-detail.component';
import { SchoolQuotePlanComponent } from '../../../components/school-quote-plan.component';
import { QuoteImageDownloadButtonComponent } from '../../../components/quote-image-download-button.component';
import { AdminSchoolQuoteImageComponent } from '../../admin-school-quote-image/admin-school-quote-image.component';
import { createDefaultPhilinterContentConfig } from './philinter-content-config';
import { PHILINTER_SUMMER_PERIODS } from './philinter-quote';

describe('PHILINTER supplied catalog and quote rules', () => {
  let c: PhilinterSchoolDetailComponent;
  const setPlan = (weeks: number, start = '2026-08-16') => {
    c.quotePlan.courses[0].weeks = c.quotePlan.rooms[0].weeks = weeks;
    c.quotePlan.courses[0].startDate = c.quotePlan.rooms[0].startDate = start;
  };
  const setStudentWeeks = (index: number, weeks: number) => {
    const plan = c.students[index].calculator.plan;
    plan.courses[0].weeks = plan.rooms[0].weeks = weeks;
  };
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [
      { provide: SchoolService, useValue: { getSchools: () => of([]) } },
      { provide: ExchangeRateService, useValue: { getLatestCnyRates: () => EMPTY } },
      { provide: SchoolContentService, useValue: { getPublished: () => of(null) } },
      { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: { get: () => null } } } },
      { provide: ElementRef, useValue: new ElementRef(document.createElement('div')) },
    ] });
    c = TestBed.runInInjectionContext(() => new PhilinterSchoolDetailComponent());
    setPlan(4, '2026-09-06');
  });
  it('matches the 15 course and six room prices without unsupported legacy courses', () => {
    expect(c.courseFees.map(row => row.tuition)).toEqual([790,900,1030,1170,1200,1580,1420,1100,1280,1150,1200,1340,1490,1400,1400]);
    expect(c.roomFees.map(row => row.fee)).toEqual([810,970,1400,890,1100,1690]);
    (c as any).applyPricingData([{ name: 'Primary English（7–11岁）', week: 4, price: 1 }, { name: 'Junior ESL（12–17岁）', week: 4, price: 1350 }], [], []);
    expect(c.courseFees.length).toBe(15);
    expect(c.courseFees.find(row => row.id === 'junior-esl-12-17-years')!.tuition).toBe(1350);
    (c as any).applyPricingData([], [], [{ name: '注册费', fee: 220 }]);
    expect(c.registrationFee).toBe(120);
    expect(c.quoteUsd).toBe(1560);
    expect(c.quoteImageData.paymentItems[0].amount).toBe('120 美元');
  });
  it('charges both lists at 45/65/85 percent with registration once', () => {
    [0.45,0.65,0.85].forEach((ratio, index) => {
      setPlan(index + 1, '2026-09-06');
      expect(c.courseAndRoomBase).toBeCloseTo(1600 * ratio, 2);
      expect(c.quoteUsd).toBeCloseTo(120 + 1600 * ratio * 0.9, 2);
    });
  });
  it('matches the eight-week 26,700 peso example and separates optional payments', () => {
    setPlan(8, '2026-09-06');
    expect(c.localFeesTotal).toBe(26700);
    expect(c.visaExtensionCount).toBe(0);
    c.initialVisaDays = 30;
    expect(c.visaExtensionCount).toBe(1);
    expect(c.localFeesTotal).toBe(37920);
    expect(c.localFees.filter(row => row.item.endsWith('ARP外国人登记')).reduce((sum, row) => sum + row.total, 0)).toBe(300);
    expect(c.optionalFeeItems[2].amount).toBe('3,000 比索');
    expect(c.optionalFeeItems[0].amount).toBe('0 比索');
    expect(c.optionalFeeItems[0].note).toContain('学校团体接机');
    c.calculator.pickup = 'other';
    expect(c.optionalFeeItems[0].amount).toBe('1,500 比索');
  });
  it('counts complete eligible study weeks and rejects excluded rooms, guarantee courses and gaps', () => {
    setPlan(16); expect(c.offSeasonDiscountAmount).toBe(600);
    setPlan(8, '2026-11-01');
    c.quotePlan.courses[0].optionId = 'ielts-intensive';
    expect(c.offSeasonDiscountAmount).toBe(300);
    c.quotePlan.courses[0].optionId = 'light-esl';
    setPlan(8); c.quotePlan.rooms[0].optionId = 'azon-triple'; expect(c.offSeasonDiscountAmount).toBe(0);
    c.quotePlan.rooms[0].optionId = 'azon-twin'; expect(c.offSeasonDiscountAmount).toBe(300);
    c.quotePlan.courses[0].optionId = 'ielts-guarantee-8-weeks'; expect(c.offSeasonDiscountAmount).toBe(0);
    c.quotePlan.courses[0].optionId = 'light-esl'; setPlan(4);
    c.quotePlan.add('course'); c.quotePlan.add('room');
    expect(c.offSeasonDiscountAmount).toBe(300);
    c.quotePlan.courses[1].startDate = c.quotePlan.rooms[1].startDate = '2026-09-20';
    expect(c.offSeasonDiscountAmount).toBe(0);
  });
  it('keeps quote-image promotion notes concise and shows the low-season date limit', () => {
    setPlan(8, '2026-11-01');
    const sida = c.quoteImageData.paymentItems.find(item => item.label === '思达启航折扣');
    const lowSeason = c.quoteImageData.paymentItems.find(item => item.label === '淡季优惠');
    expect(sida?.note).toBe('课程费及住宿费按思达启航9折计算。');
    expect(lowSeason?.note).toBe('活动日期：2026/08/16–2026/12/25；指定课程及房型每满8周减300美元。');
    expect(lowSeason?.note).not.toContain('IELTS');
  });
  it('keeps single-person page and image titles synchronized', () => {
    setPlan(12, '2026-09-06');
    const date = c.quotePlan.startDate.replace(/-/g, '');

    expect(c.quoteHeading).toBe('PHILINTER12周报价');
    expect(c.quoteImageData.headingText).toBe(c.quoteHeading);
    expect(c.quoteImageData.title).toBe('12周');
    expect(c.quoteImageData.fileName).toBe(`PHILINTER12周报价-${date}.png`);
  });
  it('describes equal and mixed two-person weeks without using person-week totals', () => {
    setPlan(12, '2026-09-06');
    const singleTotal = c.quoteUsd;
    c.setQuoteMode('group');
    c.studentCount = 2;
    setStudentWeeks(1, 12);

    expect(c.quoteHeading).toBe('PHILINTER 2人·每人12周报价');
    expect(c.quoteImageData.headingText).toBe(c.quoteHeading);
    expect(c.quoteImageData.title).toBe('2人·每人12周');
    expect(c.quoteImageData.headingText).not.toContain('24周报价');
    expect(c.quoteUsd).toBe(singleTotal * 2);

    setStudentWeeks(1, 8);
    const mixedQuote = c.quoteImageData;
    expect(c.quoteHeading).toBe('PHILINTER 2人·不同周数报价');
    expect(mixedQuote.headingText).toBe(c.quoteHeading);
    expect(mixedQuote.title).toBe('2人·不同周数');
    expect(mixedQuote.fileName).toBe(`PHILINTER 2人·不同周数报价-${c.quotePlan.startDate.replace(/-/g, '')}.png`);
    expect(`${mixedQuote.headingText}${mixedQuote.title}`).not.toContain('20周');
    expect(JSON.stringify(mixedQuote.paymentItems)).toContain('12周');
    expect(JSON.stringify(mixedQuote.paymentItems)).toContain('8周');
    expect(c.quoteUsd).toBe(c.activeStudents.reduce((sum, student) => sum + student.calculator.totalUsd, 0));
  });
  it('uses the actual three-person week pattern instead of a summed duration', () => {
    c.setQuoteMode('group');
    c.studentCount = 3;
    c.activeStudents.forEach((_, index) => setStudentWeeks(index, 8));

    expect(c.quoteHeading).toBe('PHILINTER 3人·每人8周报价');
    expect(c.quoteImageData.title).toBe('3人·每人8周');
    expect(c.quoteImageData.headingText).not.toContain('24周报价');

    setStudentWeeks(2, 12);
    expect(c.quoteHeading).toBe('PHILINTER 3人·不同周数报价');
    expect(c.quoteImageData.headingText).toBe(c.quoteHeading);
    expect(c.quoteImageData.title).toBe('3人·不同周数');
    expect(c.quoteImageData.fileName).toBe(`PHILINTER 3人·不同周数报价-${c.quotePlan.startDate.replace(/-/g, '')}.png`);
  });
  it('synchronizes the complete stay while allowing different course and room segment counts', () => {
    const editor = new SchoolQuotePlanComponent();
    editor.plan = c.quotePlan;
    editor.lockRoomScheduleToCourses = true;
    editor.updateWeeks('course', 0, 8);
    editor.updateStartDate('course', 0, '2026-11-01', { value: '' } as HTMLInputElement);
    expect(c.quotePlan.rooms[0].weeks).toBe(8);
    expect(c.quotePlan.rooms[0].startDate).toBe('2026-11-01');
    editor.add('course');
    expect(c.quotePlan.rooms.length).toBe(1);
    expect(c.quotePlan.rooms[0].weeks).toBe(12);
    expect(c.quotePlan.end(c.quotePlan.rooms[0])).toBe(c.quotePlan.end(c.quotePlan.courses[1]));
  });
  it('blocks under-age, adult-course and separate-room Junior quotes', () => {
    c.selectedAgeGroup = 'under12'; expect(c.quoteError).toContain('12岁');
    c.selectedAgeGroup = 'junior'; expect(c.quoteError).toContain('Junior');
    c.quotePlan.courses[0].optionId = 'junior-esl-12-17-years'; expect(c.quoteError).toContain('监护人');
    c.guardianSameRoom = true; expect(c.quoteError).toBe('');
    c.quotePlan.rooms[0].optionId = 'azon-single'; expect(c.quoteError).toContain('监护人');
    c.quotePlan.rooms[0].optionId = 'azon-twin'; expect(c.quoteError).toBe('');
    expect(c.policyNotes).toContain(c.familyRule);
  });
  it('applies employee-edited prices, rules, local fees and image copy to the public calculator', () => {
    const edited = createDefaultPhilinterContentConfig();
    edited.courses.find(row => row.id === 'light-esl')!.tuition = 900;
    edited.rooms.find(row => row.id === 'in-campus-triple')!.fee = 900;
    edited.quoteSettings.registrationFee = 150;
    edited.quoteSettings.promotions.find(row => row.id === 'philinter-sida-90')!.discountValue = 5;
    edited.localFees.find(row => row.id === 'management')!.amount = 3000;
    edited.quoteImageSettings.paymentSectionTitle = '自定义学校费用说明';
    edited.quoteImageSettings.footerNotes = ['自定义报价备注'];

    (c as any).applyContentConfig(edited);

    expect(c.courseAndRoomBase).toBe(1800);
    expect(c.quoteUsd).toBe(1860);
    expect(c.localFees.find(row => row.item === '管理费')?.total).toBe(3000);
    expect(c.quoteImageData.paymentSectionTitle).toBe('自定义学校费用说明');
    expect(c.quoteImageData.importantNotes).toContain('自定义报价备注');
  });
  it('uses employee-edited image notes for every Philinter explanation area', () => {
    const edited = createDefaultPhilinterContentConfig();
    edited.quoteImageSettings.paymentNotes.registration = '自定义注册费图片说明';
    edited.quoteImageSettings.paymentNotes.course = '自定义课程图片说明';
    edited.quoteImageSettings.paymentNotes.accommodation = '自定义住宿图片说明';
    edited.quoteImageSettings.promotionNotes!['philinter-sida-90'] = '自定义思达启航优惠说明';
    edited.quoteImageSettings.promotionNotes!['philinter-low-season'] = '自定义淡季优惠说明';
    edited.quoteImageSettings.localFeeNotes['ssp'] = '自定义SSP图片备注';
    edited.quoteImageSettings.supplementalFeeNotes!['extra-night-0'] = '自定义额外住宿图片备注';
    edited.quoteImageSettings.footerNotes = ['自定义底部报价说明'];

    (c as any).applyContentConfig(edited);
    setPlan(8, '2026-11-01');

    const image = c.quoteImageData;
    expect(image.paymentItems.find(row => row.label === '注册费')?.note).toContain('自定义注册费图片说明');
    expect(image.paymentItems.find(row => row.detailTitle === '轻量综合英语 Light ESL')?.note).toContain('自定义课程图片说明');
    expect(image.paymentItems.find(row => row.detailTitle === '校内三人房')?.note).toContain('自定义住宿图片说明');
    expect(image.paymentItems.find(row => row.label === '思达启航折扣')?.note).toBe('自定义思达启航优惠说明');
    expect(image.paymentItems.find(row => row.label === '淡季优惠')?.note).toBe('自定义淡季优惠说明');
    expect(image.localFeeItems?.find(row => row.label === 'SSP特殊学习许可证')?.note).toBe('自定义SSP图片备注');
    expect(image.optionalFeeItems?.find(row => row.label === '额外住宿')?.note).toBe('自定义额外住宿图片备注');
    expect(image.importantNotes).toContain('自定义底部报价说明');
  });
  it('renders the complete Philinter quote image preview as a PNG', async () => {
    setPlan(8, '2026-11-01');
    const renderer = new QuoteImageDownloadButtonComponent();
    renderer.quote = c.quoteImageData;

    const dataUrl = await renderer.createPreviewDataUrl(0.5);

    expect(dataUrl).toMatch(/^data:image\/png;base64,/);
  });
  it('renders the Philinter employee-editor preview as a PNG', async () => {
    const editor = new AdminSchoolQuoteImageComponent({} as any, {} as any, {} as any, {} as any, {} as any);
    editor.selectedSchool = { id: 'philinter', name: '菲律宾宿务Philinter语言学校' } as any;
    editor.content = createDefaultPhilinterContentConfig();
    editor.previewQuote = (editor as any).buildPreviewQuote();
    const renderer = new QuoteImageDownloadButtonComponent();
    renderer.quote = editor.previewQuote;

    const dataUrl = await renderer.createPreviewDataUrl(0.5);

    expect(dataUrl).toMatch(/^data:image\/png;base64,/);
  });
  it('calculates mixed returning, visa and pickup choices per student', () => {
    c.setQuoteMode('group');
    const second = c.activeStudents[1].calculator;
    second.returningStudent = true;
    second.visaType = 'work';
    c.calculator.pickup = 'weekend'; second.pickup = 'other';
    expect(c.schoolPaymentItems[0].amount).toBe('120 美元');
    expect(c.localFees.filter(row => row.item.endsWith('ARP外国人登记')).reduce((sum, row) => sum + row.total, 0)).toBe(300);
    expect(c.localFees.filter(row => ['SSP特殊学习许可证', 'SSP I-CARD', 'ACR-I CARD 外国人身份证', '旅游签续签'].includes(row.item)).some(row => row.item.startsWith('学生2') && row.total > 0)).toBeFalse();
    expect(c.optionalFeeItems[0].amount).toBe('2,700 比索');
    expect(c.optionalFeeItems[0].note).toContain('2人选择接机');
  });
  it('keeps summer surcharges without blocking short stays', () => {
    expect(c.quoteError).toBe('');
    expect(c.policyNotes.join(' ')).not.toContain('至少8周');
    setPlan(4, '2027-07-04'); expect(c.quoteError).toBe(''); expect(c.seasonalSurcharge).toBe(160);
    c.quotePlan.rooms[0].optionId = 'azon-twin'; expect(c.quoteError).toBe('');
    setPlan(3, '2027-07-04'); expect(c.quoteError).toBe(''); expect(c.seasonalSurcharge).toBe(120);
  });
  it('keeps both summer seasons at eight weeks from Sunday through Saturday', () => {
    for (const period of PHILINTER_SUMMER_PERIODS) {
      const start = Date.parse(`${period.start}T00:00:00Z`), end = Date.parse(`${period.end}T00:00:00Z`);
      expect(new Date(start).getUTCDay()).toBe(0);
      expect(new Date(end).getUTCDay()).toBe(6);
      expect((end - start) / 86400000 + 1).toBe(56);
      setPlan(8, period.start);
      expect(c.peakSeasonWeeks).toBe(8);
      expect(c.seasonalSurcharge).toBe(320);
      expect(c.quoteUsd).toBe(120 + 3200 * 0.9 + 320);
    }
  });
  it('charges only overlapping course weeks at summer boundaries and across separate rows', () => {
    for (const [start, weeks] of [['2027-06-27', 0], ['2027-07-04', 1], ['2027-08-22', 1], ['2027-08-29', 0]] as const) {
      setPlan(1, start); expect(c.peakSeasonWeeks).toBe(weeks);
    }
    setPlan(10, '2027-06-27'); expect(c.peakSeasonWeeks).toBe(8);
    setPlan(4, '2027-06-27'); c.quotePlan.add('course');
    c.quotePlan.courses[1].startDate = '2027-08-08';
    expect(c.peakSeasonWeeks).toBe(6);
    expect(c.seasonalSurcharge).toBe(240);
    expect(c.quoteImageData.paymentItems.find(row => row.label === '暑期附加费')?.note).toContain('实际覆盖暑期周数');
    c.quotePlan.courses = [{ id: 1, optionId: 'light-esl', weeks: 4, startDate: '2027-05-30' }];
    c.quotePlan.rooms[0].startDate = '2027-07-04';
    expect(c.seasonalSurcharge).toBe(0);
    expect(c.quoteImageData.paymentItems.some(row => row.label === '暑期附加费')).toBeFalse();
  });
  it('keeps every image row, dates, local fee note and optional renminbi amount', () => {
    for (let i = 0; i < 3; i++) c.quotePlan.add('course');
    c.quotePlan.rooms = c.quotePlan.courses.map((row, index) => ({ ...row, id: index + 20, optionId: c.quotePlan.rooms[0].optionId }));
    const q = c.quoteImageData;
    expect(q.headingText).toBe('PHILINTER16周报价');
    expect(q.fullFeeDetails).toBeTrue();
    expect(q.paymentItems.filter(row => row.label === '注册费').map(row => row.amount)).toEqual(['120 美元']);
    expect(q.paymentItems.filter(row => row.detailTitle).length).toBe(8);
    expect(q.localFeeItems!.map(row => row.note)).toEqual(c.localFees.map(row => row.note));
    expect(q.optionalFeeItems!.length).toBe(3);
    expect(q.optionalFeeItems!.every(row => !!row.cnyAmount)).toBeTrue();
    expect(JSON.stringify(q)).not.toMatch(/\bUSD\b|\bPHP\b|\bCNY\b/);
    c.quotePlan.courses[1].startDate = c.quotePlan.courses[0].startDate;
    expect(c.quoteError).toContain('重叠');
  });
});

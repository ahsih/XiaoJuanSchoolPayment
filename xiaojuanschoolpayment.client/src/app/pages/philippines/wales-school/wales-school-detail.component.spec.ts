import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { EMPTY, of } from 'rxjs';
import { ExchangeRateService } from '../../../../services/exchange-rate.service';
import { SchoolService } from '../../../../services/school.service';
import { QuoteImageDownloadButtonComponent } from '../../../components/quote-image-download-button.component';
import { WalesSchoolDetailComponent } from './wales-school-detail.component';

describe('WalesSchoolDetailComponent shared group quote', () => {
  let component: WalesSchoolDetailComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WalesSchoolDetailComponent],
      providers: [
        provideRouter([]),
        { provide: SchoolService, useValue: { getSchools: () => of([]) } },
        { provide: ExchangeRateService, useValue: { getLatestCnyRates: () => EMPTY } },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(WalesSchoolDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('uses the complete WALES 2026 course and room catalogs', () => {
    expect(component.courseFees.length).toBe(11);
    expect(component.roomFees.length).toBe(16);
    expect(component.courseFees.find((course) => course.id === 'pte')?.tuition).toBe(1200);
    expect(component.courseFees.find((course) => course.id === 'ielts-guarantee')?.tuition).toBe(1300);
    expect(component.roomFees.find((room) => room.id === 'lower-premium-studio-family-3')?.fee).toBe(930);
  });

  it('supports multiple course and accommodation rows for one person and shares them with the image', () => {
    const student = component.students[0];
    student.quotePlan.add('course');
    student.quotePlan.courses[1].optionId = 'infinity-intensive';
    student.quotePlan.add('room');
    student.quotePlan.rooms[1].optionId = 'lower-studio-single';

    expect(student.quotePlan.courses.length).toBe(2);
    expect(student.quotePlan.rooms.length).toBe(2);
    expect(student.quoteUsd).toBe(3900);
    expect(component.quoteHeading).toBe('WALES 8周报价');
    expect(component.schoolPaymentItems.filter((row) => row.icon === '课').length).toBe(2);
    expect(component.schoolPaymentItems.filter((row) => row.icon === '宿').length).toBe(2);
    expect(component.quoteImageData.paymentItems).toEqual(component.schoolPaymentItems);
    expect(component.quoteImageData.totalUsd).toBe(component.quoteUsdText);
  });

  it('supports different group plans and retains hidden student edits when the count changes', () => {
    component.setQuoteMode('group');
    const second = component.students[1];
    second.age = 31;
    second.studentStatus = 'returning';
    second.visaType = 'tourist30';
    second.selectedPickup = 'clark-private';
    second.quotePlan.courses[0].optionId = 'pte';
    second.quotePlan.courses[0].weeks = 8;
    second.quotePlan.rooms[0].optionId = 'upper-premium-studio-single';
    second.quotePlan.rooms[0].weeks = 8;

    component.studentCount = 3;
    component.students[2].age = 47;
    component.students[2].quotePlan.courses[0].optionId = 'ielts';
    component.studentCount = 2;
    expect(component.activeStudents.length).toBe(2);
    expect(component.quoteUsd).toBe(component.students[0].quoteUsd + second.quoteUsd);
    expect(component.quoteImageData.headingText).toBe('WALES 2人报价');
    expect(component.quoteImageData.paymentItems.some((row) => row.label.startsWith('学生2 · 课程名称'))).toBeTrue();
    expect(component.quoteImageData.paymentItems.some((row) => row.label.startsWith('学生2 · 住宿名称'))).toBeTrue();
    expect(component.quoteImageData.localFeeItems?.some((row) => row.label.includes('学生2') && row.label.includes('PTE'))).toBeTrue();

    component.studentCount = 3;
    expect(component.students[2].age).toBe(47);
    expect(component.students[2].quotePlan.courses[0].optionId).toBe('ielts');
  });

  it('applies the year-end accommodation discount by student and room row only', () => {
    const student = component.students[0];
    student.quotePlan.courses[0].weeks = 6;
    student.quotePlan.rooms[0].weeks = 6;
    student.quotePlan.courses[0].startDate = '2026-11-29';
    student.quotePlan.rooms[0].startDate = '2026-11-29';
    student.studentStatus = 'returning';

    expect(student.accommodationTotal).toBe(1425);
    expect(student.yearEndAccommodationDiscount).toBe(570);
    expect(student.quoteUsd).toBe(1930);
    expect(component.quoteImageData.paymentItems.find((row) => row.label === '2026年末住宿六折优惠')?.amount).toBe('− 570 美元');
    expect(component.quoteImageData.importantNotes).toContain('当前方案含6周课程或住宿，按对应4周价格的1.5倍估算。');

    student.studentStatus = 'current';
    expect(student.yearEndAccommodationDiscount).toBe(0);
    expect(student.quoteUsd).toBe(2500);
    expect(component.quoteImageData.paymentItems.some((row) => row.label.includes('年末住宿'))).toBeFalse();
  });

  it('applies long-stay and peak-season deductions only to continuous new-student course rows', () => {
    const student = component.students[0];
    student.selectedRegistrationDate = '2026-01-01';
    student.quotePlan.courses[0].weeks = 8;
    student.quotePlan.rooms[0].weeks = 8;

    student.quotePlan.courses[0].startDate = '2026-05-17';
    student.quotePlan.rooms[0].startDate = '2026-05-17';
    expect(student.peakSeasonOverlapWeeks).toBe(2);
    expect(student.longStayDiscountAmount).toBe(150);

    student.quotePlan.courses[0].startDate = '2026-06-14';
    student.quotePlan.rooms[0].startDate = '2026-06-14';
    expect(student.peakSeasonOverlapWeeks).toBe(6);
    expect(student.longStayDiscountAmount).toBe(50);

    student.quotePlan.courses[0].weeks = 4;
    student.quotePlan.rooms[0].weeks = 8;
    student.quotePlan.courses[0].startDate = '2026-05-17';
    student.quotePlan.add('course');
    student.quotePlan.courses[1].startDate = '2026-06-21';
    expect(student.hasCourseGap).toBeTrue();
    expect(student.longStayDiscountAmount).toBe(0);
    expect(student.promotionWarning).toContain('长周数优惠未自动套用');
  });

  it('calculates local fees by each student before grouping', () => {
    component.setQuoteMode('group');
    const first = component.students[0];
    const second = component.students[1];
    first.visaType = 'tourist59';
    second.visaType = 'tourist30';
    second.selectedPickup = 'manila-private';
    second.quotePlan.courses[0].optionId = 'pte';
    second.quotePlan.courses[0].weeks = 8;
    second.quotePlan.rooms[0].weeks = 8;

    expect(first.visaExtensionCount).toBe(0);
    expect(second.visaExtensionCount).toBe(1);
    expect(second.localFees.find((row) => row.item === 'PTE模拟考试及当地费用')?.total).toBe(9000);
    expect(second.localFees.find((row) => row.item === '机场接机')?.total).toBe(12000);
    expect(component.localFeeTotal).toBe(first.localFeeTotal + second.localFeeTotal);
    expect(component.quoteImageData.localFeeItems?.length).toBe(component.localFees.length);
  });

  it('enforces course duration and unresolved long-term visa rules before export', () => {
    const student = component.students[0];
    student.quotePlan.courses[0].optionId = 'pte';
    student.quotePlan.courses[0].weeks = 6;
    expect(component.quoteError).toContain('PTE每条课程仅开放4、8或12周');

    student.quotePlan.courses[0].weeks = 4;
    student.visaType = 'student';
    expect(component.quoteError).toContain('须由顾问确认后才能生成报价图片');
    expect(student.localFees.find((row) => row.item === 'SSP特殊学习许可证')?.note).toContain('不代表免收');
  });

  it('keeps inapplicable promotions out of the image footer and payment rows', () => {
    const image = component.quoteImageData;
    expect(image.layout).toBe('cia-detailed');
    expect(image.headingText).toBe('WALES 4周报价');
    expect(image.paymentItems.some((row) => row.label.includes('优惠'))).toBeFalse();
    expect(image.importantNotes?.join('')).not.toContain('年末优惠限');
    expect(image.importantNotes?.join('')).not.toContain('长周数');
  });

  it('renders a real full-detail group PNG without clipping its payment and fee rows', async () => {
    component.setQuoteMode('group');
    const second = component.students[1];
    second.age = 26;
    second.visaType = 'tourist30';
    second.selectedPickup = 'clark-private';
    second.quotePlan.courses[0].optionId = 'pte';
    second.quotePlan.courses[0].weeks = 8;
    second.quotePlan.rooms[0].optionId = 'upper-premium-studio-single';
    second.quotePlan.rooms[0].weeks = 8;
    const renderer = new QuoteImageDownloadButtonComponent();
    renderer.quote = component.quoteImageData;
    const drawn = spyOn(CanvasRenderingContext2D.prototype, 'fillText').and.callThrough();

    const blob = await (renderer as unknown as { createQuoteImageBlob(scale: number): Promise<Blob> }).createQuoteImageBlob(1);
    const bitmap = await createImageBitmap(blob);
    const text = drawn.calls.allArgs().map((args) => String(args[0])).join('').replace(/\s/g, '');

    expect(blob.type).toBe('image/png');
    expect(blob.size).toBeGreaterThan(50_000);
    expect(bitmap.height).toBeGreaterThan(1800);
    expect(text).toContain('WALES2人报价');
    expect(text).toContain('学生2·课程名称');
    expect(text).toContain('PearsonTestofEnglish(PTE)');
    expect(text).toContain('学生2·住宿名称');
    expect(text).toContain('PTE模拟考试及当地费用');
    expect(text).toContain('价格、优惠名额、房型空位、实际上课天数和当地费用以WALES正式账单为准。'.replace(/\s/g, ''));
    bitmap.close();
    renderer.ngOnDestroy();
  }, 30000);
});

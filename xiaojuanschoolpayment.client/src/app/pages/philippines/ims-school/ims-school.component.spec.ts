import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { ExchangeRateService } from '../../../../services/exchange-rate.service';
import { SchoolContentService } from '../../../../services/school-content.service';
import { SchoolService } from '../../../../services/school.service';
import { cloneImsContentConfig, createDefaultImsContentConfig } from './ims-content-config';
import { ImsSchoolComponent } from './ims-school.component';

describe('ImsSchoolComponent', () => {
  let component: ImsSchoolComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImsSchoolComponent],
      providers: [
        provideRouter([]),
        { provide: SchoolService, useValue: { getSchools: () => of([]), getSchoolPhotos: () => of([]) } },
        { provide: SchoolContentService, useValue: { getPublished: () => of(null) } },
        { provide: ExchangeRateService, useValue: { getLatestCnyRates: () => of({ usdToCny: 7.2, phpToCny: 1 / 8, date: '2026-09-11' }) } },
      ],
    }).compileComponents();

    component = TestBed.createComponent(ImsSchoolComponent).componentInstance;
  });

  it('renders the complete 2026 course and accommodation catalog', () => {
    const fixture = TestBed.createComponent(ImsSchoolComponent);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(component.courses.length).toBe(26);
    expect(component.rooms.length).toBe(4);
    expect(element.querySelectorAll('#courses [role="row"]').length - 1).toBe(26);
    expect(element.querySelectorAll('#rooms .price-row').length - 1).toBe(4);
    expect(element.textContent).toContain('TOEIC Guarantee');
    expect(element.textContent).toContain('Junior ESL 9');
  });

  it('uses the same totals and fee rows on the webpage and quote image', () => {
    const student = component.activeStudents[0];
    student.quotePlan.courses[0].startDate = '2026-09-06';
    student.quotePlan.rooms[0].startDate = '2026-09-06';
    student.quotePlan.courses[0].weeks = 12;
    student.quotePlan.rooms[0].weeks = 12;
    student.setPromotion(student.quotePlan.courses[0].id, 0, 'two-plus-two');
    student.setPromotion(student.quotePlan.courses[0].id, 1, 'low-season-300');

    const image = component.quoteImageData;
    expect(image.totalUsd).toBe(component.formatUsd(component.quoteUsd));
    expect(image.localFeeAmount).toBe(component.formatPhp(component.estimatedLocalFeeTotal));
    expect(image.localFeeItems?.map((item) => item.label)).toEqual(component.estimatedLocalFees.map((item) => item.item));
    expect(image.paymentItems.find((item) => item.label === 'IMS 2+2达人活动')?.note).toContain('明确2周价');
    expect(image.paymentItems.find((item) => item.label === '不可减免注册费')?.amount).toBe('100 美元');
  });

  it('keeps inactive group edits but excludes them from current totals and image labels', () => {
    component.setQuoteMode('group');
    component.studentCount = 4;
    component.activeStudents[3].name = '保留内容';
    component.activeStudents[3].quotePlan.courses[0].optionId = 'sat';
    const fourPersonTotal = component.quoteUsd;

    component.studentCount = 2;
    expect(component.activeStudents.length).toBe(2);
    expect(component.quoteUsd).toBeLessThan(fourPersonTotal);
    expect(component.quoteImageData.paymentItems.some((item) => item.label.includes('学生3'))).toBeFalse();

    component.studentCount = 4;
    expect(component.activeStudents[3].name).toBe('保留内容');
    expect(component.activeStudents[3].quotePlan.courses[0].optionId).toBe('sat');
  });

  it('shows and validates the complete parent-to-Junior-6 transfer rule in the image', () => {
    component.setQuoteMode('group');
    component.studentCount = 2;
    const [parent, child] = component.activeStudents;
    parent.travelerRole = 'parent';
    parent.quotePlan.courses[0].optionId = 'parents-esl';
    parent.transferParentOneToOne = true;
    parent.linkedStudentIndex = 1;
    parent.attendParentGroupClass = false;
    child.travelerRole = 'child';
    child.quotePlan.courses[0].optionId = 'junior-esl-6';

    expect(component.quoteError).toBe('');
    expect(component.quoteImageData.importantNotes?.join('')).toContain('家长仍注册并购买Parents ESL');
    expect(component.quoteImageData.importantNotes?.join('')).toContain('家长1节团体课自行放弃');

    child.quotePlan.courses[0].optionId = 'junior-esl-9';
    expect(component.quoteError).toContain('Junior ESL 8或9不能接收');
  });

  it('keeps published content as the single source for public pricing and image copy', () => {
    const published = cloneImsContentConfig(createDefaultImsContentConfig());
    published.courses.find((item) => item.id === 'essential-esl-4')!.feeByWeeks![4] = 777;
    published.localFees.find((item) => item.id === 'additional-esl-one-to-one')!.amount = 175;
    published.localFees.find((item) => item.id === 'guardian-service')!.amount = 475;
    published.quoteImageSettings.paymentSectionTitle = 'IMS自定义费用明细';

    (component as unknown as { applyContentConfig(value: ReturnType<typeof createDefaultImsContentConfig>): void }).applyContentConfig(published);

    expect(component.courses.find((item) => item.id === 'essential-esl-4')?.prices[4]).toBe(777);
    expect(component.activeStudents[0].tuition).toBe(777);
    component.activeStudents[0].additionalClassQuantities['esl-one-to-one'] = 1;
    expect(component.activeStudents[0].additionalClassTotal).toBe(175);
    component.activeStudents[0].optionalService = 'guardian';
    expect(component.activeStudents[0].optionalServiceTotal).toBe(475);
    expect(component.quoteImageData.paymentSectionTitle).toBe('IMS自定义费用明细');
  });
});

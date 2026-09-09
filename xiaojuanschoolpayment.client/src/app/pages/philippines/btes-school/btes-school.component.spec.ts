import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { ExchangeRateService } from '../../../../services/exchange-rate.service';
import { BtesSchoolComponent } from './btes-school.component';

describe('BtesSchoolComponent', () => {
  let component: BtesSchoolComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BtesSchoolComponent],
      providers: [
        provideRouter([]),
        {
          provide: ExchangeRateService,
          useValue: { getLatestCnyRates: () => of({ usdToCny: 7.2, phpToCny: 1 / 9, date: '2026-09-09' }) },
        },
      ],
    }).compileComponents();

    component = TestBed.createComponent(BtesSchoolComponent).componentInstance;
  });

  const setPeriod = (startDate = '2026-08-23', weeks = 4) => {
    component.activeStudents.forEach((student) => {
      student.quotePlan.courses[0].startDate = startDate;
      student.quotePlan.courses[0].weeks = weeks;
      student.quotePlan.rooms[0].startDate = startDate;
      student.quotePlan.rooms[0].weeks = weeks;
    });
  };

  it('uses the group discount only for three or more matching students', () => {
    component.setQuoteMode('group');
    component.studentCount = 3;
    setPeriod();

    expect(component.quoteError).toBe('');
    expect(component.activeStudents.every((student) => student.groupDiscountRate === 0.4)).toBeTrue();
    expect(component.quoteUsd).toBe(2779.5);
    expect(component.quoteHeading).toBe('BTES 3人报价');
    expect(component.quoteImageData.headingText).toBe('BTES 3人报价');
  });

  it('keeps the post-promotion Sida discount synchronized in the webpage and quote image', () => {
    setPeriod();

    const webSidaLine = component.schoolPaymentItems.find((item) => item.label === '思达启航95折');
    const imageSidaLine = component.quoteImageData.paymentItems.find((item) => item.label === '思达启航95折');

    expect(webSidaLine?.amount).toBe('− 50.75 美元');
    expect(imageSidaLine?.amount).toBe('− 50.75 美元');
    expect(component.quoteUsd).toBe(1064.25);
  });

  it('does not give the group rate when graduation dates differ', () => {
    component.setQuoteMode('group');
    component.studentCount = 3;
    setPeriod();
    component.activeStudents[2].quotePlan.courses[0].weeks = 3;
    component.activeStudents[2].quotePlan.rooms[0].weeks = 3;

    expect(component.activeStudents.every((student) => student.groupDiscountRate === 0)).toBeTrue();
  });

  it('supports two to twenty people while retaining inactive edits', () => {
    component.setQuoteMode('group');
    component.studentCount = 20;
    component.activeStudents[19].age = 33;
    expect(component.activeStudents.length).toBe(20);

    component.studentCount = 2;
    component.studentCount = 20;
    expect(component.activeStudents[19].age).toBe(33);

    component.studentCount = 21;
    expect(component.quoteError).toContain('2-20人');
  });

  it('applies the ALL IN ONE preset as a valid single-person quote', () => {
    component.setQuoteMode('group');
    component.studentCount = 3;
    component.activeStudents[0].quotePlan.add('course');
    component.activeStudents[0].quotePlan.add('room');

    component.applyAllInOneOffer();

    const student = component.activeStudents[0];
    expect(component.quoteMode).toBe('single');
    expect(student.quotePlan.courses).toEqual([jasmine.objectContaining({ optionId: 'all-in-one', weeks: 4 })]);
    expect(student.quotePlan.rooms).toEqual([jasmine.objectContaining({ optionId: 'quad', weeks: 4 })]);
    expect(student.quoteError).toBe('');
    expect(student.quoteUsd).toBe(1000);
    expect(component.quoteImageData.paymentItems.some((item) => item.label === '思达启航95折')).toBeFalse();
    expect(component.quoteCalculated).toBeTrue();
  });

  it('keeps school contact details and QR codes out of the rendered copy', () => {
    const fixture = TestBed.createComponent(BtesSchoolComponent);
    fixture.detectChanges();
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';

    expect(text).not.toContain('contact@btes');
    expect(text).not.toContain('btes_education');
    expect(text).not.toContain('509-1835');
    expect(text).not.toContain('326-3634');
  });
});

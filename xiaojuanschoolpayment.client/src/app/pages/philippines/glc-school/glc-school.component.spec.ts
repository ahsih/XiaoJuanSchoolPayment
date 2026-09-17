import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, of } from 'rxjs';
import { ExchangeRateService } from '../../../../services/exchange-rate.service';
import { SchoolContentService } from '../../../../services/school-content.service';
import { SchoolService } from '../../../../services/school.service';
import { GlcSchoolComponent } from './glc-school.component';

describe('GLC group quote headings', () => {
  let component: GlcSchoolComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [
      { provide: SchoolService, useValue: { getSchools: () => of([]) } },
      { provide: ExchangeRateService, useValue: { getLatestCnyRates: () => EMPTY } },
      { provide: SchoolContentService, useValue: { getPublished: () => of(null) } },
      { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: { get: () => null } } } },
      { provide: ElementRef, useValue: new ElementRef(document.createElement('div')) },
    ] });
    component = TestBed.runInInjectionContext(() => new GlcSchoolComponent());
  });

  function setStudentWeeks(index: number, weeks: number): void {
    const plan = component.students[index].calculator.plan;
    plan.courses[0].weeks = weeks;
    plan.rooms[0].weeks = weeks;
  }

  it('keeps single-person weeks synchronized across the page and image metadata', () => {
    setStudentWeeks(0, 12);
    const date = component.selectedStartDate.replace(/-/g, '');

    expect(component.quoteHeading).toBe('GLC12周报价');
    expect(component.quoteImageData.headingText).toBe('GLC12周报价');
    expect(component.quoteImageData.title).toBe('12周');
    expect(component.quoteImageData.fileName).toBe(`GLC12周报价-${date}.png`);
  });

  it('describes equal and mixed two-person weeks without using person-week totals', () => {
    setStudentWeeks(0, 12);
    const singleTotal = component.quoteUsd;
    component.setQuoteMode('group');
    component.studentCount = 2;
    setStudentWeeks(1, 12);

    expect(component.quoteHeading).toBe('GLC 2人·每人12周报价');
    expect(component.quoteImageData.headingText).toBe(component.quoteHeading);
    expect(component.quoteImageData.title).toBe('2人·每人12周');
    expect(component.quoteImageData.fileName).toBe(`GLC 2人·每人12周报价-${component.selectedStartDate.replace(/-/g, '')}.png`);
    expect(component.quoteImageData.headingText).not.toContain('24周报价');
    expect(component.quoteUsd).toBeCloseTo(singleTotal * 2, 6);

    setStudentWeeks(1, 8);
    const mixedQuote = component.quoteImageData;
    expect(component.quoteHeading).toBe('GLC 2人·不同周数报价');
    expect(mixedQuote.headingText).toBe(component.quoteHeading);
    expect(mixedQuote.title).toBe('2人·不同周数');
    expect(mixedQuote.fileName).toBe(`GLC 2人·不同周数报价-${component.selectedStartDate.replace(/-/g, '')}.png`);
    expect(`${mixedQuote.headingText}${mixedQuote.title}`).not.toContain('20周');
    expect(JSON.stringify(mixedQuote.paymentItems)).toContain('12周');
    expect(JSON.stringify(mixedQuote.paymentItems)).toContain('8周');
    expect(component.quoteUsd).toBe(component.activeStudents.reduce((sum, student) => sum + component.studentSubtotal(student), 0));
  });

  it('uses the actual three-person week pattern instead of a summed duration', () => {
    component.setQuoteMode('group');
    component.studentCount = 3;
    component.activeStudents.forEach((_, index) => setStudentWeeks(index, 8));

    expect(component.quoteHeading).toBe('GLC 3人·每人8周报价');
    expect(component.quoteImageData.headingText).toBe(component.quoteHeading);
    expect(component.quoteImageData.title).toBe('3人·每人8周');
    expect(component.quoteImageData.headingText).not.toContain('24周报价');

    setStudentWeeks(2, 12);
    expect(component.quoteHeading).toBe('GLC 3人·不同周数报价');
    expect(component.quoteImageData.headingText).toBe(component.quoteHeading);
    expect(component.quoteImageData.title).toBe('3人·不同周数');
    expect(component.quoteImageData.fileName).toBe(`GLC 3人·不同周数报价-${component.selectedStartDate.replace(/-/g, '')}.png`);
  });
});

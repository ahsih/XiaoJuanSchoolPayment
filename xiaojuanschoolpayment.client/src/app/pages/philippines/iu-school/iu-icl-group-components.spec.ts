import { TestBed } from '@angular/core/testing';
import { Type } from '@angular/core';
import { provideRouter } from '@angular/router';
import { EMPTY } from 'rxjs';
import { ExchangeRateService } from '../../../../services/exchange-rate.service';
import { SchoolService } from '../../../../services/school.service';
import { IclSchoolComponent } from '../icl-school/icl-school.component';
import { IuSchoolComponent } from './iu-school.component';

describe('IU and ICL group quote pages', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IuSchoolComponent, IclSchoolComponent],
      providers: [
        provideRouter([]),
        { provide: SchoolService, useValue: { getSchools: () => EMPTY } },
        { provide: ExchangeRateService, useValue: { getLatestCnyRates: () => EMPTY } },
      ],
    }).compileComponents();
  });

  for (const [name, componentType] of [
    ['IU', IuSchoolComponent],
    ['ICL', IclSchoolComponent],
  ] as const) {
    it(`${name} switches between one-person and independent 2–20-person quotes`, () => {
      const fixture = TestBed.createComponent(
        componentType as Type<IuSchoolComponent | IclSchoolComponent>,
      );
      const component = fixture.componentInstance;
      fixture.detectChanges();
      expect(component.quoteMode).toBe('single');
      expect(component.activeStudents).toHaveSize(1);
      expect(fixture.nativeElement.querySelectorAll('.quote-mode button').length).toBe(2);

      component.setQuoteMode('group');
      component.studentCount = 3;
      fixture.detectChanges();
      expect(component.activeStudents).toHaveSize(3);
      expect(fixture.nativeElement.querySelectorAll('.student-quote').length).toBe(3);
      expect(component.quoteHeading).toContain('3人报价');
      expect(component.quoteImageData.headingText).toContain('3人报价');

      component.setQuoteMode('single');
      component.setQuoteMode('group');
      expect(component.activeStudents).toHaveSize(3);
    });
  }
});

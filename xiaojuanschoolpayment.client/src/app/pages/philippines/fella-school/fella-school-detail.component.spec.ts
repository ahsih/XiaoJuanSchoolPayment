import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { ExchangeRateService } from '../../../../services/exchange-rate.service';
import { SchoolService } from '../../../../services/school.service';
import { FellaSchoolDetailComponent } from './fella-school-detail.component';

describe('FellaSchoolDetailComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FellaSchoolDetailComponent],
      providers: [
        provideRouter([]),
        {
          provide: SchoolService,
          useValue: {
            getSchools: () => of([]),
            getSchoolLessons: () => of([]),
            getSchoolRooms: () => of([]),
            getSchoolFees: () => of([]),
          },
        },
        {
          provide: ExchangeRateService,
          useValue: { getLatestCnyRates: () => of({ usdToCny: 7.2, phpPerCny: 8, date: '2026-09-09' }) },
        },
      ],
    }).compileComponents();
  });

  it('renders the standalone quote page and preserves weeks in a mixed-campus group heading', () => {
    const fixture = TestBed.createComponent(FellaSchoolDetailComponent);
    const component = fixture.componentInstance;
    component.setQuoteMode('group');
    component.studentCount = 2;
    component.setStudentCampus(component.students[1], 'campus2');

    expect(component.quoteHeading).toBe('English Fella 2人4周报价');

    component.students[1].quotePlan.courses[0].weeks = 8;
    component.students[1].quotePlan.rooms[0].weeks = 8;

    fixture.detectChanges();

    expect(component.quoteHeading).toBe('English Fella 2人（4周／8周）报价');
    expect(component.quoteImageData.headingText).toBe(component.quoteHeading);
    expect(fixture.nativeElement.querySelectorAll('.student-quote').length).toBe(2);
    expect(component.estimatedLocalFeeTotal).toBe(57880);
  });

  it('uses one calculated total for both the page and detailed image', () => {
    const fixture = TestBed.createComponent(FellaSchoolDetailComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.quoteUsd).toBe(1715);
    expect(component.quoteImageData.totalUsd).toBe('1,715 美元');
    expect(component.quoteImageData.fullFeeDetails).toBeTrue();
    expect(component.quoteImageData.localFeeTableLayout).toBe('web');
  });
});

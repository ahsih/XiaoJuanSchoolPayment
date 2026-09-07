import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { ExchangeRateService } from '../../../../services/exchange-rate.service';
import { AnjSchoolComponent } from './anj-school.component';

describe('AnjSchoolComponent shared rooms', () => {
  let component: AnjSchoolComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnjSchoolComponent],
      providers: [
        provideRouter([]),
        {
          provide: ExchangeRateService,
          useValue: { getLatestCnyRates: () => of({ usdToCny: 7.2, phpToCny: 1 / 9, date: '2026-09-07' }) },
        },
      ],
    }).compileComponents();

    component = TestBed.createComponent(AnjSchoolComponent).componentInstance;
  });

  const selectRoomForActiveStudents = (roomId: string, startDate = '2026-09-06') => {
    component.activeStudents.forEach((student) => {
      student.quotePlan.courses[0].startDate = startDate;
      student.quotePlan.rooms[0].startDate = startDate;
      student.quotePlan.rooms[0].optionId = roomId;
    });
  };

  it('charges a three-person total-price studio only once', () => {
    component.setQuoteMode('group');
    component.studentCount = 3;
    selectRoomForActiveStudents('premium-studio-triple-use');

    expect(component.quoteError).toBe('');
    expect(component.activeStudents.reduce((sum, student) => sum + student.accommodation, 0)).toBe(3700);
    expect(component.quoteUsd).toBe(4940);
    expect(component.estimatedLocalFees.find((fee) => fee.item === '水电费（Premium / Villa）')?.total).toBeCloseTo(3500, 8);
    expect(component.planPaymentItems.filter((item) => item.icon === '宿').length).toBe(1);
    expect(component.planPaymentItems.find((item) => item.icon === '宿')?.amount).toBe('3,700 美元');
  });

  it('charges a one-to-two-person suite only once for two matching students', () => {
    component.setQuoteMode('group');
    component.studentCount = 2;
    selectRoomForActiveStudents('premium-suite');

    expect(component.quoteError).toBe('');
    expect(component.activeStudents.reduce((sum, student) => sum + student.accommodation, 0)).toBe(2100);
    expect(component.planPaymentItems.filter((item) => item.icon === '宿').length).toBe(1);
  });

  it('blocks an incomplete fixed-occupancy room group', () => {
    component.setQuoteMode('group');
    component.studentCount = 2;
    selectRoomForActiveStudents('premium-studio-triple-use');

    expect(component.quoteError).toContain('还需1名学生');
  });

  it('supports two to twenty students and retains inactive student edits', () => {
    component.setQuoteMode('group');
    component.studentCount = 20;
    component.activeStudents[19].birthMonth = 12;
    expect(component.activeStudents.length).toBe(20);

    component.studentCount = 2;
    component.studentCount = 20;
    expect(component.activeStudents[19].birthMonth).toBe(12);

    component.studentCount = 21;
    expect(component.quoteError).toContain('2–20人');
  });
});

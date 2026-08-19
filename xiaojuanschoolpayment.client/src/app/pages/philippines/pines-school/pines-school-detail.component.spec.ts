import { TestBed } from '@angular/core/testing';
import { SchoolService } from '../../../../services/school.service';
import { PinesSchoolDetailComponent } from './pines-school-detail.component';

describe('PinesSchoolDetailComponent pricing', () => {
  let component: PinesSchoolDetailComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: SchoolService, useValue: {} }],
    });
    component = TestBed.runInInjectionContext(() => new PinesSchoolDetailComponent());
    component.selectedCourseId = 'light-esl-4';
    component.selectedRoomId = 'sextuple';
  });

  it('charges two and three weeks at 65% and 85% of the four-week prices', () => {
    component.selectedWeeks = 2;
    expect(component.tuitionForSelectedWeeks).toBe(552.5);
    expect(component.roomFeeForSelectedWeeks).toBe(370.5);

    component.selectedWeeks = 3;
    expect(component.tuitionForSelectedWeeks).toBe(722.5);
    expect(component.roomFeeForSelectedWeeks).toBe(484.5);
  });

  it('keeps four-week and longer pricing proportional to the four-week prices', () => {
    component.selectedWeeks = 4;
    expect(component.tuitionForSelectedWeeks).toBe(850);
    expect(component.roomFeeForSelectedWeeks).toBe(570);

    component.selectedWeeks = 8;
    expect(component.tuitionForSelectedWeeks).toBe(1700);
    expect(component.roomFeeForSelectedWeeks).toBe(1140);
  });
});

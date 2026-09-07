import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { SchoolService } from '../../../../services/school.service';
import { PinesSchoolDetailComponent } from './pines-school-detail.component';

describe('PinesSchoolDetailComponent pricing', () => {
  let component: PinesSchoolDetailComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), { provide: SchoolService, useValue: {} }],
    });
    component = TestBed.runInInjectionContext(() => new PinesSchoolDetailComponent());
    component.selectedCourseId = 'light-esl-4';
    component.selectedRoomId = 'main-sextuple';
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

    component.selectedWeeks = 5;
    expect(component.tuitionForSelectedWeeks).toBe(1062.5);
    expect(component.roomFeeForSelectedWeeks).toBe(712.5);
  });

  it('prices the Main Campus family room per student', () => {
    component.selectedRoomId = 'main-family-2-3';
    component.selectedWeeks = 4;
    expect(component.roomFeeForSelectedWeeks).toBe(780);
  });

  it('separates the public course and accommodation catalogs by campus', () => {
    expect(component.courseFeeGroups.map((group) => [group.code, group.items.length])).toEqual([
      ['main', 10],
      ['ielts', 7],
    ]);
    expect(component.roomFeeGroups.map((group) => [group.code, group.items.length])).toEqual([
      ['main', 9],
      ['ielts', 7],
    ]);
    expect(component.roomFeeGroups[0].items.map((room) => room.id)).toEqual([
      'main-single-a', 'main-single-b', 'main-single-c', 'main-twin-a', 'main-twin-b', 'main-family-2-3', 'main-quad', 'main-5b-solo', 'main-sextuple',
    ]);
    expect(component.roomFeeGroups[1].items.map((room) => room.id)).toEqual([
      'ielts-single-a', 'ielts-single-b', 'ielts-single-c', 'ielts-twin', 'ielts-triple', 'ielts-quad', 'ielts-5b-solo',
    ]);
    expect(component.roomFeeGroups[1].items.filter((room) => room.id === 'ielts-5b-solo' || room.id === 'ielts-single-c').every((room) => room.note === '')).toBeTrue();
  });

  it('labels school payment rows with the selected campus', () => {
    component.selectedCourseId = 'ielts-regular';
    component.selectedRoomId = 'ielts-quad';
    expect(component.schoolPaymentItems.some((item) => item.label === '雅思校区 IELTS Campus · 课程名称')).toBeTrue();
    expect(component.schoolPaymentItems.some((item) => item.label === '雅思校区 IELTS Campus · 住宿名称')).toBeTrue();
  });
});

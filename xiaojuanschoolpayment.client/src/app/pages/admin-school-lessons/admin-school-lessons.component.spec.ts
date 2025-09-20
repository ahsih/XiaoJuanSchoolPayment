import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSchoolLessonsComponent } from './admin-school-lessons.component';

describe('AdminSchoolLessonsComponent', () => {
  let component: AdminSchoolLessonsComponent;
  let fixture: ComponentFixture<AdminSchoolLessonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminSchoolLessonsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminSchoolLessonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

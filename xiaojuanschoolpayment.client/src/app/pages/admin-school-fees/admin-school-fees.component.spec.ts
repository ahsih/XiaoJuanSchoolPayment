import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSchoolFeesComponent } from './admin-school-fees.component';

describe('AdminSchoolFeesComponent', () => {
  let component: AdminSchoolFeesComponent;
  let fixture: ComponentFixture<AdminSchoolFeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminSchoolFeesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminSchoolFeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

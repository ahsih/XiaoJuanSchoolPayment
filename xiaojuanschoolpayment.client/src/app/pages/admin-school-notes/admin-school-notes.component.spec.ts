import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSchoolNotesComponent } from './admin-school-notes.component';

describe('AdminSchoolNotesComponent', () => {
  let component: AdminSchoolNotesComponent;
  let fixture: ComponentFixture<AdminSchoolNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminSchoolNotesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminSchoolNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

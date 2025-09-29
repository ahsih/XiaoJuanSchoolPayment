import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSchoolRoomsComponent } from './admin-school-rooms.component';

describe('AdminSchoolRoomsComponent', () => {
  let component: AdminSchoolRoomsComponent;
  let fixture: ComponentFixture<AdminSchoolRoomsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminSchoolRoomsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminSchoolRoomsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

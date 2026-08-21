import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { PiaSchoolComponent } from './pia-school.component';

describe('PiaSchoolComponent', () => {
  let component: PiaSchoolComponent;
  let fixture: ComponentFixture<PiaSchoolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PiaSchoolComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(PiaSchoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates the PIA pricing page', () => {
    expect(component).toBeTruthy();
  });

  it('uses the supplied 2024 starting combination', () => {
    expect(component.courseOptions).toHaveSize(9);
    expect(component.roomOptions).toHaveSize(3);
    expect(component.quoteTotal).toBe(1330);
  });

  it('recalculates the total for another course and room', () => {
    component.selectedCourseId = 'power-speaking-c';
    component.selectedRoomId = 'single';

    expect(component.quoteTotal).toBe(2023);
  });
});

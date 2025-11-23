import { Component, OnInit } from '@angular/core';
import { SchoolService } from '../../../services/school.service';
import { SchoolDTO } from '../../../interfaces/school.dto';
import { SchoolLessonDTO } from '../../../interfaces/school-lessons.dto';
import { SchoolFeeDTO } from '../../../interfaces/school-fees.dto';
import { SchoolRoomDTO } from '../../../interfaces/school-rooms.dto';
import { SchoolNoteDTO } from '../../../interfaces/school-notes.dto';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  schoolForm!: FormGroup;

  public schools: SchoolDTO[] = [];
  public schoolLessons: SchoolLessonDTO[] = [];
  public schololFees: SchoolFeeDTO[] = [];
  public schoolRooms: SchoolRoomDTO[] = [];
  public schoolNotes: SchoolNoteDTO[] = [];
  constructor(private schoolService: SchoolService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildForm();
    this.loadSchools();
    this.loadSchoolLessons();
    this.loadSchoolFees();
    this.loadSchoolRooms();
    this.loadSchoolNotes();
    this.setupSchoolIdListener();
  }

  private buildForm() {
    this.schoolForm = this.fb.group({
      schoolId: ['', Validators.required],
      lessonId: [''],
      roomId: [''],
      feeId: [''],
      note: [''],
    });
  }

  private setupSchoolIdListener() {
    this.schoolForm.get('schoolId')!.valueChanges.subscribe((schoolId) => {
      // Reset dependent dropdowns when school changes
      this.schoolForm.patchValue(
        {
          lessonId: '',
          roomId: '',
          feeId: '',
          note: '',
        },
        { emitEvent: false }
      );

      // Clear arrays when no school selected
      if (!schoolId) {
        this.schoolLessons = [];
        this.schoolRooms = [];
        this.schololFees = [];
        this.schoolNotes = [];
        return;
      }

      // Convert to string if your filters use string
      const schoolIdStr = String(schoolId);

      this.loadSchoolLessons(schoolIdStr);
      this.loadSchoolFees(schoolIdStr);
      this.loadSchoolRooms(schoolIdStr);
      this.loadSchoolNotes(schoolIdStr);
    });
  }

  private loadSchools() {
    this.schoolService.getSchools().subscribe({
      next: (rows) => (this.schools = rows ?? []),
      error: (err) => console.error('Failed to load schools', err),
    });
  }

  private loadSchoolLessons(schoolId?: string) {
    this.schoolService.getSchoolLessons({ schoolId }).subscribe({
      next: (data) => (this.schoolLessons = data ?? []),
      error: (err) => console.error('Failed to load school lessons', err),
    });
  }

  private loadSchoolFees(schoolId?: string) {
    this.schoolService.getSchoolFees({ schoolId }).subscribe({
      next: (data) => (this.schololFees = data ?? []),
      error: (err) => console.error('Failed to load school fees', err),
    });
  }

  private loadSchoolRooms(schoolId?: string) {
    this.schoolService.getSchoolRooms({ schoolId }).subscribe({
      next: (data) => (this.schoolRooms = data ?? []),
      error: (err) => console.error('Failed to load school rooms', err),
    });
  }

  private loadSchoolNotes(schoolId?: string) {
    this.schoolService.getSchoolNotes({ schoolId }).subscribe({
      next: (data) => (this.schoolNotes = data ?? []),
      error: (err) => console.error('Failed to load school notes', err),
    });
  }

  submit() {
    if (this.schoolForm.invalid) return;

    const payload = this.schoolForm.value;
    console.log('Saving payload:', payload);
    // call your save endpoint here
  }

  reset() {
    this.schoolForm.reset();
    this.schoolLessons = [];
    this.schoolRooms = [];
    this.schololFees = [];
    this.schoolNotes = [];
  }
}

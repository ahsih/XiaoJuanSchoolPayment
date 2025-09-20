import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SchoolLessonDTO } from '../../../interfaces/school-lessons.dto';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SchoolService } from '../../../services/school.service';
import { MatDialog } from '@angular/material/dialog';
import { SchoolDTO } from '../../../interfaces/school.dto';

@Component({
  selector: 'app-admin-school-lessons',
  standalone: false,
  templateUrl: './admin-school-lessons.component.html',
  styleUrl: './admin-school-lessons.component.css',
})
export class AdminSchoolLessonsComponent {
  schoolLessonsForm: FormGroup;

  displayedColumns: string[] = [
    'name',
    'week',
    'price',
    'description',
    'note',
    'school',
    'actions',
  ];
  dataSource = new MatTableDataSource<SchoolLessonDTO>([]);
  schoolLessonDtos: SchoolLessonDTO[] = [];
  schoolDtos: SchoolDTO[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private fb: FormBuilder,
    private schoolService: SchoolService,
    private matDialog: MatDialog
  ) {
    this.schoolLessonsForm = this.fb.group({
      name: ['', Validators.required],
      week: ['', Validators.required],
      price: ['', Validators.required],
      description: [''],
      note: [''],
      schoolId: [''],
    });

    this.dataSource.filterPredicate = (
      data: SchoolLessonDTO,
      filter: string
    ) => {
      const term = filter.trim().toLowerCase();
      const name = (data.name ?? '').toLowerCase();
      return name.includes(term);
    };
  }

  ngOnInit(): void {
    this.loadSchools();
    this.loadSchoolLessons();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  async submit() {
    if (this.schoolLessonsForm.valid) {
      const schoolLessonDTO = {
        name: this.schoolLessonsForm.value.name,
        price: this.schoolLessonsForm.value.price,
        schoolId: this.schoolLessonsForm.value.schoolId,
        week: this.schoolLessonsForm.value.week,
        description: this.schoolLessonsForm.value.description,
        note: this.schoolLessonsForm.value.note,
      } as SchoolLessonDTO;
      await this.schoolService.saveSchoolLesson(schoolLessonDTO);
      this.schoolLessonsForm.reset();
      this.loadSchoolLessons();
    }
  }

  applyFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value || '';
    this.dataSource.filter = value.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  private loadSchools() {
    this.schoolService.getSchools().subscribe({
      next: (rows) => (this.schoolDtos = rows ?? []),
      error: (err) => console.error('Failed to load schools', err),
    });
  }

  private loadSchoolLessons() {
    this.schoolService.getSchoolLessons().subscribe({
      next: (rows) => (this.dataSource.data = rows ?? []),
      error: (err) => console.error('Failed to load schools', err),
    });
  }

  async edit(row: SchoolLessonDTO) {}
}

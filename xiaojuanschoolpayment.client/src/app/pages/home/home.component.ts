import { Component, OnInit } from '@angular/core';
import { SchoolService } from '../../../services/school.service';
import { SchoolDTO } from '../../../interfaces/school.dto';
import { SchoolLessonDTO } from '../../../interfaces/school-lessons.dto';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  public schools: SchoolDTO[] = [];
  public schoolLessons: SchoolLessonDTO[] = [];
  constructor(private schoolService: SchoolService) {}

  ngOnInit(): void {
    this.loadSchools();
    this.loadSchoolLessons();
  }

  private loadSchools() {
    this.schoolService.getSchools().subscribe({
      next: (rows) => (this.schools = rows ?? []),
      error: (err) => console.error('Failed to load schools', err),
    });
  }

  private loadSchoolLessons() {
    this.schoolService.getSchoolLessons().subscribe({
      next: (data) => (this.schoolLessons = data ?? []),
      error: (err) => console.error('Failed to load school lessons', err),
    });
  }
}

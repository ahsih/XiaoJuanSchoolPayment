import { Component, OnInit } from '@angular/core';
import { SchoolService } from '../../../services/school.service';
import { SchoolDTO } from '../../../interfaces/school.dto';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  public schools: SchoolDTO[] = [];
  constructor(private schoolService: SchoolService) {}

  ngOnInit(): void {
    this.loadSchools();
  }

  private loadSchools() {
    this.schoolService.getSchools().subscribe({
      next: (rows) => (this.schools = rows ?? []),
      error: (err) => console.error('Failed to load schools', err),
    });
  }
}

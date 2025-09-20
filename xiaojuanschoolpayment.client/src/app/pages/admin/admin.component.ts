import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SchoolService } from '../../../services/school.service';
import { SchoolDTO } from '../../../interfaces/school.dto';
import { MatDialog } from '@angular/material/dialog';
import { EditSchoolDialogComponent } from './edit-school-dialog/edit-school-dialog.component';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-admin',
  standalone: false,
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit, AfterViewInit {
  schoolForm: FormGroup;

  displayedColumns: string[] = ['name', 'createdDate', 'actions'];
  dataSource = new MatTableDataSource<SchoolDTO>([]);
  schoolDtos: SchoolDTO[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private fb: FormBuilder,
    private schoolService: SchoolService,
    private matDialog: MatDialog
  ) {
    this.schoolForm = this.fb.group({
      school: ['', Validators.required],
      date: ['', Validators.required],
    });

    this.dataSource.filterPredicate = (data: SchoolDTO, filter: string) => {
      const term = filter.trim().toLowerCase();
      const name = (data.name ?? '').toLowerCase();
      const date = data.createdDate
        ? new Date(data.createdDate).toISOString().slice(0, 10)
        : '';
      return name.includes(term) || date.includes(term);
    };
  }

  ngOnInit(): void {
    this.loadSchools();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  async submit() {
    if (this.schoolForm.valid) {
      const schoolDTO = {
        name: this.schoolForm.value.school,
        createdDate: this.schoolForm.value.date,
      } as SchoolDTO;
      await this.schoolService.saveSchool(schoolDTO);
      this.schoolForm.reset();
      this.loadSchools();
    }
  }

  applyFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value || '';
    this.dataSource.filter = value.trim().toLowerCase();

    // if using paginator, reset to first page on filter
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  private loadSchools() {
    this.schoolService.getSchools().subscribe({
      next: (rows) => (this.dataSource.data = rows ?? []),
      error: (err) => console.error('Failed to load schools', err),
    });
  }

  async edit(row: SchoolDTO) {
    const dialogRef = this.matDialog.open(EditSchoolDialogComponent, {
      width: '420px',
      data: row,
      disableClose: true,
    });

    const updated = await firstValueFrom(dialogRef.afterClosed());
    if (!updated) return;
    try {
      await this.schoolService.saveSchool(updated);
      await this.loadSchools();
    } catch (err) {
      console.error('Failed to save school', err);
    }
  }
}

import { Component, ViewChild } from '@angular/core';
import { SchoolNoteDTO } from '../../../interfaces/school-notes.dto';
import { SchoolDTO } from '../../../interfaces/school.dto';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { CurrencyDTO } from '../../../interfaces/currency.dto';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SchoolService } from '../../../services/school.service';
import { MatDialog } from '@angular/material/dialog';
import { CurrencyService } from '../../../services/currency.service';
import { EditSchoolNoteDialogComponent } from './edit-school-note-dialog/edit-school-note-dialog.component';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-admin-school-notes',
  standalone: false,
  templateUrl: './admin-school-notes.component.html',
  styleUrl: './admin-school-notes.component.css',
})
export class AdminSchoolNotesComponent {
  schoolNotesForm: FormGroup;

  displayedColumns: string[] = ['schoolName', 'note', 'actions'];
  dataSource = new MatTableDataSource<SchoolNoteDTO>([]);
  schoolFeetos: SchoolNoteDTO[] = [];
  schoolDtos: SchoolDTO[] = [];
  currencyDtos: CurrencyDTO[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private fb: FormBuilder,
    private schoolService: SchoolService,
    private matDialog: MatDialog,
    private currencyService: CurrencyService
  ) {
    this.schoolNotesForm = this.fb.group({
      note: ['', Validators.required],
      schoolId: [''],
    });

    this.dataSource.filterPredicate = (data: SchoolNoteDTO, filter: string) => {
      const term = filter.trim().toLowerCase();
      const name = (data.notes ?? '').toLowerCase();
      return name.includes(term);
    };
  }

  ngOnInit(): void {
    this.loadSchools();
    this.loadSchoolNotes();
    this.loadCurrencys();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  async submit() {
    if (this.schoolNotesForm.valid) {
      const schoolNotesDTO = {
        notes: this.schoolNotesForm.value.note,
        schoolId: this.schoolNotesForm.value.schoolId,
      } as SchoolNoteDTO;
      await this.schoolService.saveSchoolNote(schoolNotesDTO);
      this.schoolNotesForm.reset();
      this.loadSchoolNotes();
    }
  }

  applyFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value || '';
    this.dataSource.filter = value.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  private loadCurrencys() {
    this.currencyService.getCurrencies().subscribe({
      next: (rows) => (this.currencyDtos = rows ?? []),
      error: (err) => console.error('Failed to load currencys', err),
    });
  }

  private loadSchools() {
    this.schoolService.getSchools().subscribe({
      next: (rows) => (this.schoolDtos = rows ?? []),
      error: (err) => console.error('Failed to load schools', err),
    });
  }

  private loadSchoolNotes() {
    this.schoolService.getSchoolNotes().subscribe({
      next: (rows) => (this.dataSource.data = rows ?? []),
      error: (err) => console.error('Failed to load notes', err),
    });
  }

  async edit(row: SchoolNoteDTO) {
    const dialogRef = this.matDialog.open(EditSchoolNoteDialogComponent, {
      width: '560px',
      disableClose: true,
      data: {
        note: row,
        schools: this.schoolDtos,
        currencies: this.currencyDtos,
      },
    });
    const updated = await firstValueFrom(dialogRef.afterClosed());
    if (!updated) return;
    try {
      await this.schoolService.saveSchoolNote(updated);
      await this.loadSchoolNotes();
    } catch (err) {
      console.error('Failed to save note', err);
    }
  }
}

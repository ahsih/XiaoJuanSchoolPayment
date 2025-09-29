import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SchoolRoomDTO } from '../../../interfaces/school-rooms.dto';
import { MatTableDataSource } from '@angular/material/table';
import { SchoolDTO } from '../../../interfaces/school.dto';
import { CurrencyDTO } from '../../../interfaces/currency.dto';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SchoolService } from '../../../services/school.service';
import { MatDialog } from '@angular/material/dialog';
import { CurrencyService } from '../../../services/currency.service';
import { firstValueFrom } from 'rxjs';
import { EditSchoolRoomDialogComponent } from './edit-school-room-dialog/edit-school-room-dialog.component';

@Component({
  selector: 'app-admin-school-rooms',
  standalone: false,
  templateUrl: './admin-school-rooms.component.html',
  styleUrl: './admin-school-rooms.component.css',
})
export class AdminSchoolRoomsComponent {
  schoolRoomsForm: FormGroup;

  displayedColumns: string[] = [
    'schoolName',
    'name',
    'week',
    'price',
    'currencyCode',
    'description',
    'actions',
  ];
  dataSource = new MatTableDataSource<SchoolRoomDTO>([]);
  schoolRoomDtos: SchoolRoomDTO[] = [];
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
    this.schoolRoomsForm = this.fb.group({
      name: ['', Validators.required],
      week: ['', Validators.required],
      price: ['', Validators.required],
      description: [''],
      schoolId: [''],
      currencyId: [''],
    });

    this.dataSource.filterPredicate = (data: SchoolRoomDTO, filter: string) => {
      const term = filter.trim().toLowerCase();
      const name = (data.name ?? '').toLowerCase();
      return name.includes(term);
    };
  }

  ngOnInit(): void {
    this.loadSchools();
    this.loadSchoolRooms();
    this.loadCurrencys();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  async submit() {
    if (this.schoolRoomsForm.valid) {
      const schoolRoomDTO = {
        name: this.schoolRoomsForm.value.name,
        price: this.schoolRoomsForm.value.price,
        schoolId: this.schoolRoomsForm.value.schoolId,
        week: this.schoolRoomsForm.value.week,
        description: this.schoolRoomsForm.value.description,
        currencyId: this.schoolRoomsForm.value.currencyId,
      } as SchoolRoomDTO;
      await this.schoolService.saveSchoolRooms(schoolRoomDTO);
      this.schoolRoomsForm.reset();
      this.loadSchoolRooms();
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

  private loadSchoolRooms() {
    this.schoolService.getSchoolRooms().subscribe({
      next: (rows) => (this.dataSource.data = rows ?? []),
      error: (err) => console.error('Failed to load rooms', err),
    });
  }

  async edit(row: SchoolRoomDTO) {
    const dialogRef = this.matDialog.open(EditSchoolRoomDialogComponent, {
      width: '560px',
      disableClose: true,
      data: {
        lesson: row,
        schools: this.schoolDtos,
        currencies: this.currencyDtos,
      },
    });
    const updated = await firstValueFrom(dialogRef.afterClosed());
    if (!updated) return;
    try {
      await this.schoolService.saveSchoolLesson(updated);
      await this.loadSchoolRooms();
    } catch (err) {
      console.error('Failed to save lesson', err);
    }
  }
}

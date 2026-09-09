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
import { ActivatedRoute } from '@angular/router';

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
  selectedSchoolId = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private fb: FormBuilder,
    private schoolService: SchoolService,
    private matDialog: MatDialog,
    private currencyService: CurrencyService,
    private route: ActivatedRoute
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
      const schoolName = (data.schoolName ?? '').toLowerCase();
      return name.includes(term) || schoolName.includes(term);
    };
  }

  ngOnInit(): void {
    this.selectedSchoolId = this.route.snapshot.queryParamMap.get('schoolId') ?? '';
    this.loadSchools();
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
      this.schoolRoomsForm.reset({ schoolId: this.selectedSchoolId });
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

  onSchoolChanged(schoolId: string) {
    this.selectedSchoolId = schoolId;
    this.schoolRoomsForm.patchValue({ schoolId });
    this.loadSchoolRooms();
  }
  private loadCurrencys() {
    this.currencyService.getCurrencies().subscribe({
      next: (rows) => (this.currencyDtos = rows ?? []),
      error: (err) => console.error('Failed to load currencys', err),
    });
  }

  private loadSchools() {
    this.schoolService.getSchools().subscribe({
      next: (rows) => {
        this.schoolDtos = rows ?? [];
        const selected = this.schoolDtos.find(school => school.id === this.selectedSchoolId)
          ?? this.schoolDtos.find(school => school.name.toLowerCase().includes('cia'))
          ?? this.schoolDtos[0];
        if (selected) this.onSchoolChanged(selected.id);
      },
      error: (err) => console.error('Failed to load schools', err),
    });
  }

  private loadSchoolRooms() {
    if (!this.selectedSchoolId) {
      this.dataSource.data = [];
      return;
    }
    this.schoolService.getSchoolRooms({ schoolId: this.selectedSchoolId }).subscribe({
      next: (rows) => (this.dataSource.data = rows ?? []),
      error: (err) => console.error('Failed to load rooms', err),
    });
  }

  async edit(row: SchoolRoomDTO) {
    const dialogRef = this.matDialog.open(EditSchoolRoomDialogComponent, {
      width: '560px',
      disableClose: true,
      data: {
        room: row,
        schools: this.schoolDtos,
        currencies: this.currencyDtos,
      },
    });
    const updated = await firstValueFrom(dialogRef.afterClosed());
    if (!updated) return;
    try {
      await this.schoolService.saveSchoolRooms(updated);
      await this.loadSchoolRooms();
    } catch (err) {
      console.error('Failed to save rooms', err);
    }
  }
}

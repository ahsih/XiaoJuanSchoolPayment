import { Component, ViewChild } from '@angular/core';
import { SchoolFeeDTO } from '../../../interfaces/school-fees.dto';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { SchoolDTO } from '../../../interfaces/school.dto';
import { CurrencyDTO } from '../../../interfaces/currency.dto';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SchoolService } from '../../../services/school.service';
import { MatDialog } from '@angular/material/dialog';
import { CurrencyService } from '../../../services/currency.service';
import { firstValueFrom } from 'rxjs';
import { EditSchoolFeeDialogComponent } from './edit-school-fee-dialog/edit-school-fee-dialog.component';

@Component({
  selector: 'app-admin-school-fees',
  standalone: false,
  templateUrl: './admin-school-fees.component.html',
  styleUrl: './admin-school-fees.component.css',
})
export class AdminSchoolFeesComponent {
  schoolFeesForm: FormGroup;

  displayedColumns: string[] = [
    'schoolName',
    'name',
    'fee',
    'currencyCode',
    'description',
    'actions',
  ];
  dataSource = new MatTableDataSource<SchoolFeeDTO>([]);
  schoolFeetos: SchoolFeeDTO[] = [];
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
    this.schoolFeesForm = this.fb.group({
      name: ['', Validators.required],
      fee: ['', Validators.required],
      description: [''],
      schoolId: [''],
      currencyId: [''],
    });

    this.dataSource.filterPredicate = (data: SchoolFeeDTO, filter: string) => {
      const term = filter.trim().toLowerCase();
      const name = (data.name ?? '').toLowerCase();
      return name.includes(term);
    };
  }

  ngOnInit(): void {
    this.loadSchools();
    this.loadSchoolFees();
    this.loadCurrencys();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  async submit() {
    if (this.schoolFeesForm.valid) {
      const schoolFeeDTO = {
        name: this.schoolFeesForm.value.name,
        fee: this.schoolFeesForm.value.fee,
        schoolId: this.schoolFeesForm.value.schoolId,
        description: this.schoolFeesForm.value.description,
        currencyId: this.schoolFeesForm.value.currencyId,
      } as SchoolFeeDTO;
      await this.schoolService.saveSchoolFee(schoolFeeDTO);
      this.schoolFeesForm.reset();
      this.loadSchoolFees();
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

  private loadSchoolFees() {
    this.schoolService.getSchoolFees().subscribe({
      next: (rows) => (this.dataSource.data = rows ?? []),
      error: (err) => console.error('Failed to load fees', err),
    });
  }

  async edit(row: SchoolFeeDTO) {
    const dialogRef = this.matDialog.open(EditSchoolFeeDialogComponent, {
      width: '560px',
      disableClose: true,
      data: {
        fee: row,
        schools: this.schoolDtos,
        currencies: this.currencyDtos,
      },
    });
    const updated = await firstValueFrom(dialogRef.afterClosed());
    if (!updated) return;
    try {
      await this.schoolService.saveSchoolFee(updated);
      await this.loadSchoolFees();
    } catch (err) {
      console.error('Failed to save lesson', err);
    }
  }
}

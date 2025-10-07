import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SchoolDTO } from '../../../../interfaces/school.dto';
import { CurrencyDTO } from '../../../../interfaces/currency.dto';
import { SchoolFeeDTO } from '../../../../interfaces/school-fees.dto';
export interface EditSchoolFeeDialogData {
  fee: SchoolFeeDTO;
  schools: SchoolDTO[];
  currencies: CurrencyDTO[];
}

@Component({
  selector: 'app-edit-school-fee-dialog',
  templateUrl: './edit-school-fee-dialog.component.html',
  standalone: false,
})
export class EditSchoolFeeDialogComponent {
  form: FormGroup;
  schools: SchoolDTO[] = [];
  currencies: CurrencyDTO[] = [];
  saving = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<
      EditSchoolFeeDialogData,
      SchoolFeeDTO | undefined
    >,
    @Inject(MAT_DIALOG_DATA) public data: EditSchoolFeeDialogData
  ) {
    const l = data.fee || ({} as SchoolFeeDTO);
    this.schools = data.schools ?? [];
    this.currencies = data.currencies ?? [];

    this.form = this.fb.group({
      id: [l.id], // keep id for update
      schoolId: [l.schoolId ?? null, Validators.required],
      name: [l.name ?? '', Validators.required],
      fee: [l.fee ?? null, [Validators.required, Validators.min(1)]],
      currencyId: [l.currencyId ?? null, Validators.required],
      description: [l.description ?? ''],
    });
  }

  cancel() {
    this.dialogRef.close();
  }

  save() {
    if (this.form.invalid) return;
    this.saving = true;
    // Hand control back to the opener; it will call the service.
    const updated: SchoolFeeDTO = this.form.value as SchoolFeeDTO;
    this.dialogRef.close(updated);
  }
}

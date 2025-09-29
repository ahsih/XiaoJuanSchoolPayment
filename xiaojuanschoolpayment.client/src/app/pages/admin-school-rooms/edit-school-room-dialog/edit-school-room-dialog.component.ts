import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SchoolDTO } from '../../../../interfaces/school.dto';
import { CurrencyDTO } from '../../../../interfaces/currency.dto';
import { SchoolRoomDTO } from '../../../../interfaces/school-rooms.dto';
export interface EditSchoolRoomDialogData {
  room: SchoolRoomDTO;
  schools: SchoolDTO[];
  currencies: CurrencyDTO[];
}

@Component({
  selector: 'app-edit-school-room-dialog',
  templateUrl: './edit-school-room-dialog.component.html',
  standalone: false,
})
export class EditSchoolRoomDialogComponent {
  form: FormGroup;
  schools: SchoolDTO[] = [];
  currencies: CurrencyDTO[] = [];
  saving = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<
      EditSchoolRoomDialogComponent,
      SchoolRoomDTO | undefined
    >,
    @Inject(MAT_DIALOG_DATA) public data: EditSchoolRoomDialogData
  ) {
    const l = data.room || ({} as SchoolRoomDTO);
    this.schools = data.schools ?? [];
    this.currencies = data.currencies ?? [];

    this.form = this.fb.group({
      id: [l.id], // keep id for update
      schoolId: [l.schoolId ?? null, Validators.required],
      name: [l.name ?? '', Validators.required],
      week: [l.week ?? null, [Validators.required, Validators.min(1)]],
      price: [l.price ?? null, [Validators.required, Validators.min(0)]],
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
    const updated: SchoolRoomDTO = this.form.value as SchoolRoomDTO;
    this.dialogRef.close(updated);
  }
}

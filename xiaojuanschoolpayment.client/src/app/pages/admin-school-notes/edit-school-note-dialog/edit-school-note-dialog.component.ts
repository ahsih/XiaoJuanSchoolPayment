import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SchoolDTO } from '../../../../interfaces/school.dto';
import { CurrencyDTO } from '../../../../interfaces/currency.dto';
import { SchoolNoteDTO } from '../../../../interfaces/school-notes.dto';
export interface EditSchoolNoteDialogData {
  note: SchoolNoteDTO;
  schools: SchoolDTO[];
  currencies: CurrencyDTO[];
}

@Component({
  selector: 'app-edit-school-note-dialog',
  templateUrl: './edit-school-note-dialog.component.html',
  standalone: false,
})
export class EditSchoolNoteDialogComponent {
  form: FormGroup;
  schools: SchoolDTO[] = [];
  currencies: CurrencyDTO[] = [];
  saving = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<
      EditSchoolNoteDialogComponent,
      SchoolNoteDTO | undefined
    >,
    @Inject(MAT_DIALOG_DATA) public data: EditSchoolNoteDialogData
  ) {
    const l = data.note || ({} as SchoolNoteDTO);
    this.schools = data.schools ?? [];
    this.currencies = data.currencies ?? [];

    this.form = this.fb.group({
      id: [l.id], // keep id for update
      schoolId: [l.schoolId ?? null, Validators.required],
      notes: [l.notes ?? '', Validators.required],
    });
  }

  cancel() {
    this.dialogRef.close();
  }

  save() {
    if (this.form.invalid) return;
    this.saving = true;
    // Hand control back to the opener; it will call the service.
    const updated: SchoolNoteDTO = this.form.value as SchoolNoteDTO;
    this.dialogRef.close(updated);
  }
}

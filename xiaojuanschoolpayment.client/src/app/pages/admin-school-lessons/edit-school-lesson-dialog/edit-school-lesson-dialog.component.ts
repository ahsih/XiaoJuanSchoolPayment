import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SchoolLessonDTO } from '../../../../interfaces/school-lessons.dto';
import { SchoolDTO } from '../../../../interfaces/school.dto';
import { CurrencyDTO } from '../../../../interfaces/currency.dto';
export interface EditSchoolLessonDialogData {
  lesson: SchoolLessonDTO;
  schools: SchoolDTO[];
  currencies: CurrencyDTO[];
}

@Component({
  selector: 'app-edit-school-lesson-dialog',
  templateUrl: './edit-school-lesson-dialog.component.html',
  standalone: false,
})
export class EditSchoolLessonDialogComponent {
  form: FormGroup;
  schools: SchoolDTO[] = [];
  currencies: CurrencyDTO[] = [];
  saving = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<
      EditSchoolLessonDialogComponent,
      SchoolLessonDTO | undefined
    >,
    @Inject(MAT_DIALOG_DATA) public data: EditSchoolLessonDialogData
  ) {
    const l = data.lesson || ({} as SchoolLessonDTO);
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
      note: [l.note ?? ''],
    });
  }

  cancel() {
    this.dialogRef.close();
  }

  save() {
    if (this.form.invalid) return;
    this.saving = true;
    // Hand control back to the opener; it will call the service.
    const updated: SchoolLessonDTO = this.form.value as SchoolLessonDTO;
    this.dialogRef.close(updated);
  }
}

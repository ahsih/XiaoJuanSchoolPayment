import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SchoolDTO } from '../../../../interfaces/school.dto';

@Component({
  selector: 'edit-school-dialog',
  templateUrl: './edit-school-dialog.component.html',
  standalone: false,
})
export class EditSchoolDialogComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<
      EditSchoolDialogComponent,
      SchoolDTO | undefined
    >,
    @Inject(MAT_DIALOG_DATA) public data: SchoolDTO
  ) {}

  ngOnInit(): void {
    const initialDate = this.data?.createdDate
      ? new Date(this.data.createdDate)
      : null;

    this.form = this.fb.group({
      name: [
        this.data?.name ?? '',
        [Validators.required, Validators.maxLength(200)],
      ],
      createdDate: [initialDate, Validators.required],
    });
  }

  cancel(): void {
    this.dialogRef.close(undefined);
  }

  save(): void {
    const value = this.form.value;
    const updated: SchoolDTO = {
      ...this.data,
      name: value.name,
      createdDate: value.createdDate,
    };
    this.dialogRef.close(updated);
  }
}

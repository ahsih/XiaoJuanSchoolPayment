import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SchoolLessonDTO } from '../../../../interfaces/school-lessons.dto';
import { SchoolDTO } from '../../../../interfaces/school.dto';
import { CurrencyDTO } from '../../../../interfaces/currency.dto';

@Component({
  selector: 'app-edit-school-lesson-dialog',
  templateUrl: './edit-school-lesson-dialog.component.html',
  styleUrls: ['./edit-school-lesson-dialog.component.css'],
  standalone: false,
})
export class EditSchoolLessonDialogComponent implements OnChanges {
  @Input({ required: true }) lesson!: SchoolLessonDTO;
  @Input() schools: SchoolDTO[] = [];
  @Input() currencies: CurrencyDTO[] = [];
  @Input() saving = false;
  @Output() cancelled = new EventEmitter<void>();
  @Output() saved = new EventEmitter<SchoolLessonDTO>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      id: [null],
      schoolId: [null, Validators.required],
      name: ['', Validators.required],
      week: [null, [Validators.required, Validators.min(1)]],
      price: [null, [Validators.required, Validators.min(0)]],
      currencyId: [null, Validators.required],
      description: [''],
      note: [''],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['lesson']?.currentValue) return;

    const lesson = changes['lesson'].currentValue as SchoolLessonDTO;
    this.form.reset({
      id: lesson.id,
      schoolId: lesson.schoolId,
      name: lesson.name,
      week: lesson.week,
      price: lesson.price,
      currencyId: lesson.currencyId,
      description: lesson.description ?? '',
      note: lesson.note ?? '',
    });
  }

  cancel() {
    this.cancelled.emit();
  }

  save() {
    if (this.form.invalid) return;
    const updated: SchoolLessonDTO = this.form.getRawValue() as SchoolLessonDTO;
    this.saved.emit(updated);
  }
}

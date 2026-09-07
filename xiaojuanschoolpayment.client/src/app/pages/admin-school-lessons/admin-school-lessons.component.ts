import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CurrencyDTO } from '../../../interfaces/currency.dto';
import { SchoolLessonDTO } from '../../../interfaces/school-lessons.dto';
import { SchoolDTO } from '../../../interfaces/school.dto';
import { CurrencyService } from '../../../services/currency.service';
import { SchoolService } from '../../../services/school.service';

@Component({
  selector: 'app-admin-school-lessons',
  standalone: false,
  templateUrl: './admin-school-lessons.component.html',
  styleUrls: [
    './admin-school-lessons.component.css',
    './edit-school-lesson-dialog/edit-school-lesson-dialog.component.css',
  ],
})
export class AdminSchoolLessonsComponent implements OnInit {
  schoolLessonsForm: FormGroup;
  displayedColumns: string[] = ['name', 'week', 'price', 'details', 'actions'];
  dataSource = new MatTableDataSource<SchoolLessonDTO>([]);
  allLessons: SchoolLessonDTO[] = [];
  filteredLessons: SchoolLessonDTO[] = [];
  schoolDtos: SchoolDTO[] = [];
  filteredSchoolDtos: SchoolDTO[] = [];
  currencyDtos: CurrencyDTO[] = [];
  schoolSearchControl = new FormControl<string | SchoolDTO>('', { nonNullable: true });

  selectedSchoolId = '';
  isCreatePanelOpen = false;
  isLoading = false;
  isSaving = false;
  isSavingEdit = false;
  editingLesson: SchoolLessonDTO | null = null;
  loadError = '';
  pageIndex = 0;
  pageSize = 10;

  constructor(
    private fb: FormBuilder,
    private schoolService: SchoolService,
    private currencyService: CurrencyService,
    private route: ActivatedRoute
  ) {
    this.schoolLessonsForm = this.fb.group({
      name: ['', Validators.required],
      week: [4, [Validators.required, Validators.min(1)]],
      price: [null, [Validators.required, Validators.min(0)]],
      description: [''],
      note: [''],
      schoolId: ['', Validators.required],
      currencyId: [null, Validators.required],
    });
  }

  get selectedSchool(): SchoolDTO | undefined {
    return this.schoolDtos.find((school) => school.id === this.selectedSchoolId);
  }

  get lessonCount(): number {
    return this.allLessons.length;
  }

  get pricedLessonCount(): number {
    return this.allLessons.filter((lesson) => lesson.price > 0).length;
  }

  get pendingPriceCount(): number {
    return this.allLessons.filter((lesson) => lesson.price <= 0).length;
  }

  get editCurrencies(): CurrencyDTO[] {
    if (this.currencyDtos.length > 0) return this.currencyDtos;
    if (!this.editingLesson?.currencyId) return [];

    return [{
      id: this.editingLesson.currencyId,
      currencyCode: this.editingLesson.currencyCode ?? '当前币种',
      symbol: this.editingLesson.currencySymbol ?? '',
    }];
  }

  get isEditingLessonValid(): boolean {
    const lesson = this.editingLesson;
    if (!lesson) return false;

    return Boolean(
      lesson.schoolId &&
      lesson.name?.trim() &&
      Number.isFinite(Number(lesson.week)) &&
      Number(lesson.week) >= 1 &&
      Number.isFinite(Number(lesson.price)) &&
      Number(lesson.price) >= 0 &&
      lesson.currencyId
    );
  }

  ngOnInit(): void {
    this.schoolSearchControl.valueChanges.subscribe((value) => {
      const term = typeof value === 'string' ? value : value?.name ?? '';
      this.filteredSchoolDtos = this.filterSchools(term);
    });
    this.loadSchools();
    this.loadCurrencies();
  }

  displaySchoolName(value: string | SchoolDTO | null): string {
    return typeof value === 'string' ? value : value?.name ?? '';
  }

  showSchoolOptions(): void {
    this.filteredSchoolDtos = [...this.schoolDtos];
  }

  onSchoolSelected(school: SchoolDTO): void {
    if (!school?.id) return;
    this.schoolSearchControl.setValue(school, { emitEvent: false });
    this.filteredSchoolDtos = [...this.schoolDtos];
    this.onSchoolChanged(school.id);
  }

  onSchoolChanged(schoolId: string): void {
    this.selectedSchoolId = schoolId;
    this.isCreatePanelOpen = false;
    this.resetCreateForm();
    this.allLessons = [];
    this.filteredLessons = [];
    this.dataSource.data = [];
    this.pageIndex = 0;
    this.loadSchoolLessons();
  }

  openCreatePanel(): void {
    if (!this.selectedSchoolId) return;
    this.resetCreateForm();
    this.isCreatePanelOpen = true;
  }

  closeCreatePanel(): void {
    this.isCreatePanelOpen = false;
    this.resetCreateForm();
  }

  async submit(): Promise<void> {
    if (this.schoolLessonsForm.invalid || this.isSaving) return;

    this.isSaving = true;
    try {
      await this.schoolService.saveSchoolLesson(
        this.schoolLessonsForm.getRawValue() as SchoolLessonDTO
      );
      this.isCreatePanelOpen = false;
      this.resetCreateForm();
      this.loadSchoolLessons();
    } catch (err) {
      console.error('Failed to save lesson', err);
    } finally {
      this.isSaving = false;
    }
  }

  applyFilter(event: Event): void {
    const term = ((event.target as HTMLInputElement).value || '').trim().toLowerCase();
    this.filteredLessons = this.allLessons.filter((lesson) =>
      [lesson.name, lesson.description, lesson.note, lesson.currencyCode]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term))
    );
    this.pageIndex = 0;
    this.updateLessonPage();
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updateLessonPage();
  }

  edit(lessonId: string): void {
    const row = this.allLessons.find((lesson) => lesson.id === lessonId);
    if (!row) {
      this.loadError = '没有找到这条课程资料，请刷新页面后重试。';
      return;
    }

    // Copy every field explicitly so the editor never depends on the API
    // response object's property descriptors or table wrapper.
    this.editingLesson = {
      id: row.id,
      name: row.name ?? '',
      week: Number(row.week),
      price: Number(row.price),
      description: row.description ?? '',
      note: row.note ?? '',
      schoolId: row.schoolId,
      currencyId: Number(row.currencyId),
      currencyCode: row.currencyCode,
      currencySymbol: row.currencySymbol,
      schoolName: row.schoolName,
    };
  }

  cancelEdit(): void {
    if (this.isSavingEdit) return;
    this.editingLesson = null;
  }

  async saveEdit(updated: SchoolLessonDTO): Promise<void> {
    if (this.isSavingEdit) return;
    this.isSavingEdit = true;
    try {
      await this.schoolService.saveSchoolLesson(updated);
      this.editingLesson = null;
      this.loadSchoolLessons();
    } catch (err) {
      console.error('Failed to save lesson', err);
    } finally {
      this.isSavingEdit = false;
    }
  }

  private resetCreateForm(): void {
    this.schoolLessonsForm.reset({
      schoolId: this.selectedSchoolId,
      week: 4,
      price: null,
      currencyId: this.currencyDtos[0]?.id ?? null,
      name: '',
      description: '',
      note: '',
    });
  }

  private loadCurrencies(): void {
    this.currencyService.getCurrencies().subscribe({
      next: (rows) => {
        this.currencyDtos = rows ?? [];
        if (!this.schoolLessonsForm.value.currencyId && this.currencyDtos.length > 0) {
          this.schoolLessonsForm.patchValue({ currencyId: this.currencyDtos[0].id });
        }
      },
      error: (err) => console.error('Failed to load currencies', err),
    });
  }

  private loadSchools(): void {
    this.schoolService.getSchools().subscribe({
      next: (rows) => {
        this.schoolDtos = [...(rows ?? [])].sort((a, b) =>
          a.name.localeCompare(b.name, 'zh-CN')
        );
        this.filteredSchoolDtos = [...this.schoolDtos];

        const requestedSchoolId = this.route.snapshot.queryParamMap.get('schoolId') ?? '';
        const requestedSchool = this.schoolDtos.find((school) => school.id === requestedSchoolId);
        if (requestedSchool) {
          this.schoolSearchControl.setValue(requestedSchool, { emitEvent: false });
          this.onSchoolChanged(requestedSchoolId);
        }
      },
      error: (err) => console.error('Failed to load schools', err),
    });
  }

  private loadSchoolLessons(): void {
    if (!this.selectedSchoolId) {
      this.allLessons = [];
      this.filteredLessons = [];
      this.dataSource.data = [];
      return;
    }

    this.isLoading = true;
    this.loadError = '';
    this.schoolService.getSchoolLessons({ schoolId: this.selectedSchoolId }).subscribe({
      next: (rows) => {
        this.allLessons = rows ?? [];
        this.filteredLessons = [...this.allLessons];
        this.pageIndex = 0;
        this.updateLessonPage();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load lessons', err);
        this.allLessons = [];
        this.filteredLessons = [];
        this.dataSource.data = [];
        this.loadError = '课程资料加载失败，请稍后重试。';
        this.isLoading = false;
      },
    });
  }

  private updateLessonPage(): void {
    const start = this.pageIndex * this.pageSize;
    this.dataSource.data = this.filteredLessons.slice(start, start + this.pageSize);
  }

  private filterSchools(term: string): SchoolDTO[] {
    const normalizedTerm = term.trim().toLocaleLowerCase('zh-CN');
    if (!normalizedTerm) return [...this.schoolDtos];

    return this.schoolDtos.filter((school) =>
      school.name.toLocaleLowerCase('zh-CN').includes(normalizedTerm)
    );
  }
}

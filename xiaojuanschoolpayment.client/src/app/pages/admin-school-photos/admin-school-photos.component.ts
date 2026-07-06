import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SchoolDTO } from '../../../interfaces/school.dto';
import { SchoolPhotoDTO } from '../../../interfaces/school-photo.dto';
import { SchoolService } from '../../../services/school.service';

interface PhotoCategoryOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-admin-school-photos',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './admin-school-photos.component.html',
  styleUrl: './admin-school-photos.component.css',
})
export class AdminSchoolPhotosComponent implements OnInit {
  @ViewChild('fileInput') fileInput?: ElementRef<HTMLInputElement>;

  private readonly ciaSchoolName = 'CIA Cebu International Academy';

  photoForm: FormGroup;
  schoolDtos: SchoolDTO[] = [];
  photos: SchoolPhotoDTO[] = [];
  selectedFile?: File;
  isLoading = false;
  isUploading = false;

  readonly categoryOptions: PhotoCategoryOption[] = [
    { value: 'Campus', label: 'Campus' },
    { value: 'Classroom', label: 'Classroom' },
    { value: 'Accommodation', label: 'Accommodation' },
    { value: 'Dining', label: 'Dining' },
    { value: 'Facility', label: 'Facility' },
  ];

  constructor(
    private fb: FormBuilder,
    private schoolService: SchoolService,
    private snackBar: MatSnackBar
  ) {
    this.photoForm = this.fb.group({
      schoolId: ['', Validators.required],
      category: ['Campus', Validators.required],
      caption: [''],
      altText: [''],
      displayOrder: [0, [Validators.min(0)]],
      isActive: [true],
    });
  }

  ngOnInit(): void {
    this.loadSchools();

    this.photoForm.get('schoolId')?.valueChanges.subscribe((schoolId) => {
      if (schoolId) {
        this.loadPhotos(schoolId);
      } else {
        this.photos = [];
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0];
  }

  async submit(): Promise<void> {
    if (this.photoForm.invalid || !this.selectedFile || this.isUploading) {
      this.photoForm.markAllAsTouched();
      return;
    }

    this.isUploading = true;
    const formValue = this.photoForm.value;

    try {
      await this.schoolService.uploadSchoolPhoto(
        formValue.schoolId,
        this.selectedFile,
        formValue.category,
        formValue.caption,
        formValue.altText,
        Number(formValue.displayOrder ?? 0),
        Boolean(formValue.isActive)
      );
      this.snackBar.open('Photo uploaded', 'Close', { duration: 2500 });
      this.selectedFile = undefined;
      if (this.fileInput?.nativeElement) {
        this.fileInput.nativeElement.value = '';
      }
      this.photoForm.patchValue({
        caption: '',
        altText: '',
        displayOrder: this.photos.length + 1,
        isActive: true,
      });
      this.loadPhotos(formValue.schoolId);
    } catch (err) {
      console.error('Failed to upload photo', err);
      this.snackBar.open('Photo upload failed', 'Close', { duration: 3500 });
    } finally {
      this.isUploading = false;
    }
  }

  async toggleActive(photo: SchoolPhotoDTO): Promise<void> {
    if (!photo.id) {
      return;
    }

    try {
      await this.schoolService.saveSchoolPhoto({
        ...photo,
        isActive: !photo.isActive,
        displayOrder: photo.displayOrder ?? 0,
      });
      this.loadPhotos(photo.schoolId);
    } catch (err) {
      console.error('Failed to update photo', err);
      this.snackBar.open('Photo update failed', 'Close', { duration: 3500 });
    }
  }

  async deletePhoto(photo: SchoolPhotoDTO): Promise<void> {
    if (!photo.id) {
      return;
    }

    const confirmed = window.confirm('Delete this photo from the website?');
    if (!confirmed) {
      return;
    }

    try {
      await this.schoolService.deleteSchoolPhoto(photo.id);
      this.snackBar.open('Photo deleted', 'Close', { duration: 2500 });
      this.loadPhotos(photo.schoolId);
    } catch (err) {
      console.error('Failed to delete photo', err);
      this.snackBar.open('Photo delete failed', 'Close', { duration: 3500 });
    }
  }

  private loadSchools(): void {
    this.schoolService.getSchools().subscribe({
      next: (rows) => {
        this.schoolDtos = rows ?? [];
        const ciaSchool =
          this.schoolDtos.find((school) => school.name === this.ciaSchoolName) ??
          this.schoolDtos.find((school) => school.name.toLowerCase().includes('cia')) ??
          this.schoolDtos[0];

        if (ciaSchool?.id) {
          this.photoForm.patchValue({ schoolId: ciaSchool.id });
        }
      },
      error: (err) => console.error('Failed to load schools', err),
    });
  }

  private loadPhotos(schoolId: string): void {
    this.isLoading = true;
    this.schoolService.getSchoolPhotos({ schoolId }).subscribe({
      next: (rows) => {
        this.photos = rows ?? [];
        this.photoForm.patchValue({ displayOrder: this.photos.length }, { emitEvent: false });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load photos', err);
        this.photos = [];
        this.isLoading = false;
      },
    });
  }
}

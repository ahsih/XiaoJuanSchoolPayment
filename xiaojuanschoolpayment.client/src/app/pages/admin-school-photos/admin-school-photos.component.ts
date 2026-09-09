import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { SchoolDTO } from '../../../interfaces/school.dto';
import { SchoolPhotoDTO } from '../../../interfaces/school-photo.dto';
import { SchoolService } from '../../../services/school.service';
import { CiaMediaContent } from '../philippines/cia-school/cia-content-config';

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
    MatIconModule,
  ],
  templateUrl: './admin-school-photos.component.html',
  styleUrl: './admin-school-photos.component.css',
})
export class AdminSchoolPhotosComponent implements OnInit, OnChanges {
  @ViewChild('fileInput') fileInput?: ElementRef<HTMLInputElement>;
  @Input() embeddedSchoolId?: string;
  @Input() draftMedia?: CiaMediaContent[];
  @Input() mediaScope?: string;
  @Output() draftMediaChange = new EventEmitter<CiaMediaContent[]>();

  private readonly ciaSchoolName = 'CIA Cebu International Academy';

  photoForm: FormGroup;
  schoolDtos: SchoolDTO[] = [];
  photos: CiaMediaContent[] = [];
  private serverMedia: CiaMediaContent[] = [];
  selectedFile?: File;
  mediaType: 'image' | 'video' = 'image';
  isLoading = false;
  isUploading = false;

  get isEmbedded(): boolean {
    return !!this.embeddedSchoolId;
  }

  get selectedSchoolName(): string {
    return this.schoolDtos.find(school => school.id === this.photoForm.value.schoolId)?.name
      ?? '当前学校';
  }

  get acceptedFileTypes(): string {
    return this.mediaType === 'image'
      ? 'image/jpeg,image/png,image/webp,image/gif'
      : 'video/mp4,video/webm,video/quicktime,video/x-m4v';
  }

  get fileHelp(): string {
    return this.mediaType === 'image'
      ? '支持 JPG、PNG、WebP、GIF，单张不超过 10MB'
      : '支持 MP4、WebM、MOV、M4V，单个不超过 200MB';
  }

  readonly categoryOptions: PhotoCategoryOption[] = [
    { value: 'Campus', label: '校园环境' },
    { value: 'Classroom', label: '教室与课程' },
    { value: 'Accommodation', label: '宿舍与房型' },
    { value: 'Dining', label: '餐厅与餐食' },
    { value: 'Facility', label: '设施与活动' },
  ];

  constructor(
    private fb: FormBuilder,
    private schoolService: SchoolService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router
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
        void this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { schoolId },
          queryParamsHandling: 'merge',
          replaceUrl: true,
        });
        this.loadPhotos(schoolId);
      } else {
        this.photos = [];
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['draftMedia'] || changes['mediaScope']) {
      this.applyDraftMedia();
    }
  }

  openContentTab(tab: 'courses' | 'rooms' | 'fees' | 'rules'): void {
    void this.router.navigate(['/admin/school-content'], {
      queryParams: { schoolId: this.photoForm.value.schoolId, tab },
    });
  }

  openQuoteImageEditor(): void {
    void this.router.navigate(['/admin/school-quote-image'], {
      queryParams: { schoolId: this.photoForm.value.schoolId },
    });
  }

  categoryLabel(value?: string): string {
    return this.categoryOptions.find(option => option.value === value)?.label ?? '未分类';
  }

  selectMediaType(type: 'image' | 'video'): void {
    if (this.mediaType === type) return;
    this.mediaType = type;
    this.selectedFile = undefined;
    if (this.fileInput?.nativeElement) this.fileInput.nativeElement.value = '';
  }

  isVideo(media: CiaMediaContent): boolean {
    return media.contentType?.toLowerCase().startsWith('video/') ?? false;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      this.selectedFile = undefined;
      return;
    }

    const expectsVideo = this.mediaType === 'video';
    const validKind = expectsVideo ? file.type.startsWith('video/') : file.type.startsWith('image/');
    const maxBytes = expectsVideo ? 200 * 1024 * 1024 : 10 * 1024 * 1024;
    if (!validKind || file.size > maxBytes) {
      this.selectedFile = undefined;
      input.value = '';
      this.snackBar.open(expectsVideo ? '请选择不超过 200MB 的视频文件' : '请选择不超过 10MB 的照片文件', '关闭', { duration: 3500 });
      return;
    }
    this.selectedFile = file;
  }

  async submit(): Promise<void> {
    if (this.photoForm.invalid || !this.selectedFile || this.isUploading) {
      this.photoForm.markAllAsTouched();
      return;
    }

    this.isUploading = true;
    const formValue = this.photoForm.value;

    try {
      const uploaded = await this.schoolService.uploadSchoolPhoto(
        formValue.schoolId,
        this.selectedFile,
        formValue.category,
        formValue.caption,
        formValue.altText,
        Number(formValue.displayOrder ?? 0),
        false,
      );
      const media = this.toMediaContent(uploaded);
      media.isActive = Boolean(formValue.isActive);
      media.campus = this.mediaScope;
      this.photos = [...this.photos, media]
        .sort((a, b) => a.displayOrder - b.displayOrder);
      this.emitDraft();
      this.snackBar.open(`${this.mediaType === 'video' ? '视频' : '照片'}已加入草稿，请保存或提交审核`, '关闭', { duration: 3500 });
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
      this.serverMedia = [...this.serverMedia, { ...media, isActive: false }];
    } catch (err) {
      console.error('Failed to upload media', err);
      this.snackBar.open('媒体文件上传失败，请检查文件格式或大小', '关闭', { duration: 3500 });
    } finally {
      this.isUploading = false;
    }
  }

  toggleActive(photo: CiaMediaContent): void {
    photo.isActive = !photo.isActive;
    this.emitDraft();
  }

  deletePhoto(photo: CiaMediaContent): void {
    const confirmed = window.confirm(`确定把这个${this.isVideo(photo) ? '视频' : '照片'}从当前草稿中移除吗？审核发布后官网将不再显示。`);
    if (!confirmed) {
      return;
    }
    this.photos = this.photos.filter(item => item.id !== photo.id);
    this.emitDraft();
    this.snackBar.open('已从当前草稿移除，官网尚未改变', '关闭', { duration: 2500 });
  }

  private loadSchools(): void {
    this.schoolService.getSchools().subscribe({
      next: (rows) => {
        this.schoolDtos = rows ?? [];
        const requestedSchoolId = this.embeddedSchoolId
          ?? this.route.snapshot.queryParamMap.get('schoolId');
        const ciaSchool =
          this.schoolDtos.find((school) => school.id === requestedSchoolId) ??
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
        this.serverMedia = (rows ?? []).map(row => this.toMediaContent(row));
        this.applyDraftMedia();
        if (this.draftMedia === undefined) this.emitDraft();
        this.photoForm.patchValue({ displayOrder: this.photos.length }, { emitEvent: false });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load photos', err);
        this.photos = [];
        this.serverMedia = [];
        this.isLoading = false;
      },
    });
  }

  private applyDraftMedia(): void {
    this.photos = (this.draftMedia !== undefined ? this.draftMedia : this.serverMedia)
      .filter(item => this.matchesMediaScope(item))
      .map(item => ({ ...item }))
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }

  private emitDraft(): void {
    const source = this.draftMedia !== undefined ? this.draftMedia : this.serverMedia;
    const otherScopes = this.mediaScope
      ? source.filter(item => !this.matchesMediaScope(item)).map(item => ({ ...item }))
      : [];
    this.draftMediaChange.emit([...otherScopes, ...this.photos.map(item => ({ ...item }))]);
  }

  private matchesMediaScope(item: CiaMediaContent): boolean {
    if (!this.mediaScope) return true;
    if (item.campus) return item.campus === this.mediaScope;
    // Revisions created before campus media existed belong to BECI's original EOP page.
    return this.mediaScope === 'eop';
  }

  private toMediaContent(photo: SchoolPhotoDTO): CiaMediaContent {
    return {
      id: photo.id ?? '',
      schoolId: photo.schoolId,
      url: photo.url ?? '',
      originalFileName: photo.originalFileName,
      contentType: photo.contentType ?? 'application/octet-stream',
      category: photo.category,
      caption: photo.caption,
      altText: photo.altText,
      displayOrder: photo.displayOrder ?? 0,
      isActive: photo.isActive,
    };
  }
}

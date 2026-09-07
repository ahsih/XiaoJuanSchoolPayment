import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { SchoolService } from '../../../services/school.service';
import { SchoolDTO } from '../../../interfaces/school.dto';
import { MatDialog } from '@angular/material/dialog';
import { EditSchoolDialogComponent } from './edit-school-dialog/edit-school-dialog.component';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-admin',
  standalone: false,
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit {
  /**
   * Mirrors the public school directory's popularity order. The first three
   * entries also match the schools featured on the public home page.
   */
  private readonly popularityOrder: readonly (readonly string[])[] = [
    ['cia cebu international academy', '菲律宾宿务 cia 语言学校', '菲律宾宿务cia语言学校'],
    ['ev academy', '菲律宾宿务ev语言学校'],
    ['菲律宾宿务cpi语言学校', 'cpi cebu pelis institute'],
    ['菲律宾宿务cpils语言学校', 'cpils'],
    ['smeag capital', '菲律宾宿务smeag capital语言学校'],
    ['菲律宾宿务english fella语言学校', 'english fella'],
    ['菲律宾宿务philinter语言学校', 'philinter academy'],
    ["菲律宾宿务b'cebu语言学校", "beci b'cebu"],
    ['菲律宾宿务i.breeze语言学校', 'i.breeze international language center'],
    ['菲律宾宿务cebu blue ocean academy', 'cebu blue ocean academy'],
    ['菲律宾宿务cella uni sparta campus', 'cella uni sparta campus'],
    ['菲律宾宿务cg academy（sparta campus）', 'cg academy sparta campus'],
    ['菲律宾宿务global language cebu', 'global language cebu'],
    ['菲律宾宿务cella premium campus', 'cella premium campus'],
    ['菲律宾宿务cg academy（banilad campus）', 'cg academy banilad campus'],
    ['菲律宾宿务iu english academy', 'iu english academy'],
    ['菲律宾宿务winning english academy', 'winning english academy'],
    ['菲律宾宿务qqenglish（beachfront campus）', 'qqenglish beachfront campus'],
    ['菲律宾宿务elsa international language school', 'elsa international language school'],
    ['菲律宾宿务3d academy', '3d academy'],
    ['菲律宾宿务icl english academy', 'icl english academy'],
    ['菲律宾宿务ims academy', 'ims academy'],
    ['菲律宾宿务target global english academy', 'target global english academy'],
    ['菲律宾宿务first english global college', 'first english global college'],
    ['菲律宾宿务ciec', 'ciec global'],
    ['菲律宾宿务genius english academy语言学校', 'genius english academy'],
    ['菲律宾宿务stargate global education', 'stargate global education'],
    ['菲律宾宿务btes', 'btes'],
    ['菲律宾宿务cij academy（premium campus）', 'cij academy premium campus'],
    ['菲律宾宿务hla', 'hla'],
    ['菲律宾宿务emo', 'emo'],
    ['菲律宾宿务curious world academy', 'curious world academy'],
    ['菲律宾宿务ethos language school', 'ethos language school'],
    ['菲律宾宿务howdy english academy语言学校', 'howdy english academy'],
    ['菲律宾宿务glant english academy语言学校', 'glant english academy'],
    ['菲律宾宿务lapulapu', 'lapulapu'],
  ];

  schoolForm: FormGroup;
  showCreateSchool = false;
  isSaving = false;

  displayedColumns: string[] = ['name', 'createdDate', 'actions'];
  dataSource = new MatTableDataSource<SchoolDTO>([]);
  allSchools: SchoolDTO[] = [];
  filteredSchools: SchoolDTO[] = [];
  pageIndex = 0;
  pageSize = 10;

  constructor(
    private fb: FormBuilder,
    private schoolService: SchoolService,
    private matDialog: MatDialog
  ) {
    this.schoolForm = this.fb.group({
      school: ['', Validators.required],
      date: ['', Validators.required],
    });

  }

  ngOnInit(): void {
    this.loadSchools();
  }

  get schoolCount(): number {
    return this.allSchools.length;
  }

  getPopularityRank(school: SchoolDTO): number | null {
    const rank = this.getPopularityIndex(school);
    return rank >= 0 && rank < 10 ? rank + 1 : null;
  }

  openCreateSchool(): void {
    this.schoolForm.reset();
    this.showCreateSchool = true;
  }

  closeCreateSchool(): void {
    this.schoolForm.reset();
    this.showCreateSchool = false;
  }

  async submit() {
    if (this.schoolForm.valid && !this.isSaving) {
      this.isSaving = true;
      const schoolDTO = {
        name: this.schoolForm.value.school,
        createdDate: this.schoolForm.value.date,
      } as SchoolDTO;
      try {
        await this.schoolService.saveSchool(schoolDTO);
        this.closeCreateSchool();
        this.loadSchools();
      } finally {
        this.isSaving = false;
      }
    }
  }

  applyFilter(event: Event) {
    const term = ((event.target as HTMLInputElement).value || '').trim().toLowerCase();
    this.filteredSchools = this.allSchools.filter((school) => {
      const date = school.createdDate
        ? new Date(school.createdDate).toISOString().slice(0, 10)
        : '';
      return school.name.toLowerCase().includes(term) || date.includes(term);
    });
    this.pageIndex = 0;
    this.updateSchoolPage();
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updateSchoolPage();
  }

  private loadSchools() {
    this.schoolService.getSchools().subscribe({
      next: (rows) => {
        this.allSchools = this.sortSchoolsByPopularity(rows ?? []);
        this.filteredSchools = [...this.allSchools];
        this.pageIndex = 0;
        this.updateSchoolPage();
      },
      error: (err) => console.error('Failed to load schools', err),
    });
  }

  private updateSchoolPage(): void {
    const start = this.pageIndex * this.pageSize;
    this.dataSource.data = this.filteredSchools.slice(start, start + this.pageSize);
  }

  private sortSchoolsByPopularity(schools: SchoolDTO[]): SchoolDTO[] {
    return [...schools].sort((a, b) => {
      const aRank = this.getPopularityIndex(a);
      const bRank = this.getPopularityIndex(b);
      const aSortRank = aRank === -1 ? Number.MAX_SAFE_INTEGER : aRank;
      const bSortRank = bRank === -1 ? Number.MAX_SAFE_INTEGER : bRank;

      return aSortRank - bSortRank || a.name.localeCompare(b.name, 'zh-CN');
    });
  }

  private getPopularityIndex(school: SchoolDTO): number {
    const schoolName = this.normalizeSchoolName(school.name);
    return this.popularityOrder.findIndex((aliases) =>
      aliases.some((alias) => schoolName.includes(this.normalizeSchoolName(alias)))
    );
  }

  private normalizeSchoolName(value: string): string {
    return value.toLowerCase().replace(/[\s.'’·()（）\-]/g, '');
  }

  async edit(row: SchoolDTO) {
    const dialogRef = this.matDialog.open(EditSchoolDialogComponent, {
      width: '420px',
      data: row,
      disableClose: true,
    });

    const updated = await firstValueFrom(dialogRef.afterClosed());
    if (!updated) return;
    try {
      await this.schoolService.saveSchool(updated);
      await this.loadSchools();
    } catch (err) {
      console.error('Failed to save school', err);
    }
  }
}

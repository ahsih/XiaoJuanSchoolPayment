import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { SchoolService } from '../../../services/school.service';
import { SchoolDTO } from '../../../interfaces/school.dto';
import { MatDialog } from '@angular/material/dialog';
import { EditSchoolDialogComponent } from './edit-school-dialog/edit-school-dialog.component';
import { firstValueFrom } from 'rxjs';

type SchoolCity = 'all' | 'cebu' | 'baguio' | 'clark' | 'manila' | 'iloilo' | 'bacolod' | 'other';

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
  selectedCity: SchoolCity = 'all';
  searchTerm = '';
  pageIndex = 0;
  pageSize = 10;

  readonly cityOptions: Array<{ id: SchoolCity; label: string }> = [
    { id: 'all', label: '全部' },
    { id: 'cebu', label: '宿务' },
    { id: 'baguio', label: '碧瑶' },
    { id: 'clark', label: '克拉克' },
    { id: 'manila', label: '马尼拉' },
    { id: 'iloilo', label: '伊洛伊洛' },
    { id: 'bacolod', label: '巴科洛德' },
    { id: 'other', label: '长滩岛' },
  ];

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

  get ciaSchool(): SchoolDTO | undefined {
    return this.allSchools.find((school) => this.isCiaSchool(school));
  }

  isCiaSchool(school: SchoolDTO): boolean {
    return this.normalizeSchoolName(school.name).includes('ciacebuinternationalacademy');
  }

  isPinesSchool(school: SchoolDTO): boolean {
    return this.normalizeSchoolName(school.name).includes('pines');
  }

  isMonolSchool(school: SchoolDTO): boolean {
    return this.normalizeSchoolName(school.name).includes('monol');
  }

  isEvSchool(school: SchoolDTO): boolean {
    const name = this.normalizeSchoolName(school.name);
    return name === 'evacademy' || name.includes('菲律宾宿务ev语言学校');
  }

  isSmeagSchool(school: SchoolDTO): boolean {
    return this.normalizeSchoolName(school.name).includes('smeagcapital');
  }

  isPhilinterSchool(school: SchoolDTO): boolean {
    return this.normalizeSchoolName(school.name).includes('philinter');
  }

  isCgBaniladSchool(school: SchoolDTO): boolean {
    const name = this.normalizeSchoolName(school.name);
    return name.includes('cgacademy') && name.includes('banilad');
  }

  isCgSpartaSchool(school: SchoolDTO): boolean {
    const name = this.normalizeSchoolName(school.name);
    return name.includes('cgacademy') && name.includes('sparta');
  }

  isCpiSchool(school: SchoolDTO): boolean {
    const name = this.normalizeSchoolName(school.name);
    return name.includes('cpi') && !name.includes('cpils');
  }

  isBCebuSchool(school: SchoolDTO): boolean {
    const name = this.normalizeSchoolName(school.name);
    return name.includes('bcebu') || name.includes('becibcebu');
  }

  isCpilsSchool(school: SchoolDTO): boolean {
    return this.normalizeSchoolName(school.name).includes('cpils');
  }

  isGlcSchool(school: SchoolDTO): boolean {
    return this.normalizeSchoolName(school.name).includes('globallanguagecebu');
  }

  isIbreezeSchool(school: SchoolDTO): boolean {
    const name = this.normalizeSchoolName(school.name);
    return name.includes('ibreeze');
  }

  isAnjSchool(school: SchoolDTO): boolean {
    const name = this.normalizeSchoolName(school.name);
    return name.includes('a&jeedu') || name.includes('ajeedu') || name.includes('anjedu');
  }

  isBeciSchool(school: SchoolDTO): boolean {
    const name = this.normalizeSchoolName(school.name);
    return !this.isBCebuSchool(school) && name.includes('beci');
  }

  isJicSchool(school: SchoolDTO): boolean {
    return this.normalizeSchoolName(school.name).includes('jic');
  }

  isUnifiedSchool(school: SchoolDTO): boolean {
    return this.isCiaSchool(school) || this.isPinesSchool(school) || this.isMonolSchool(school) || this.isEvSchool(school) || this.isSmeagSchool(school) || this.isPhilinterSchool(school) || this.isCgBaniladSchool(school) || this.isCgSpartaSchool(school) || this.isCpiSchool(school) || this.isBCebuSchool(school) || this.isCpilsSchool(school) || this.isGlcSchool(school) || this.isIbreezeSchool(school) || this.isAnjSchool(school) || this.isBeciSchool(school) || this.isJicSchool(school);
  }

  managementRoute(school: SchoolDTO): string {
    return this.isUnifiedSchool(school) ? '/admin/school-content' : '/admin/school-lessons';
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
    this.searchTerm = (event.target as HTMLInputElement).value || '';
    this.filterSchools();
  }

  selectCity(city: SchoolCity): void {
    this.selectedCity = city;
    this.filterSchools();
  }

  cityCount(city: SchoolCity): number {
    if (city === 'all') return this.allSchools.length;
    return this.allSchools.filter(school => this.getSchoolCity(school) === city).length;
  }

  private filterSchools(): void {
    const term = this.searchTerm.trim().toLowerCase();
    this.filteredSchools = this.allSchools.filter((school) => {
      const matchesCity = this.selectedCity === 'all' || this.getSchoolCity(school) === this.selectedCity;
      const date = school.createdDate
        ? new Date(school.createdDate).toISOString().slice(0, 10)
        : '';
      return matchesCity && (!term || school.name.toLowerCase().includes(term) || date.includes(term));
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
        this.filterSchools();
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

  private getSchoolCity(school: SchoolDTO): SchoolCity {
    const name = this.normalizeSchoolName(school.name);
    if (['碧瑶', 'baguio', 'pines', 'monol', 'wales', 'ajeed', 'beciinternational', 'jicacademy', 'helpenglishlonglongcampus'].some(value => name.includes(this.normalizeSchoolName(value)))) return 'baguio';
    if (['克拉克', 'clark', 'egacademy', 'educationgroupgranma', 'aelc', 'americanenglishlearningcenter'].some(value => name.includes(this.normalizeSchoolName(value)))) return 'clark';
    if (['马尼拉', 'manila', 'enderun', 'berlitzphilippines', 'americanenglishskills', 'businesscollege'].some(value => name.includes(this.normalizeSchoolName(value)))) return 'manila';
    if (['伊洛伊洛', '怡朗', 'iloilo', 'polyglotinternationalacademy', 'gitccollegeinternationallanguagecenter'].some(value => name.includes(this.normalizeSchoolName(value)))) return 'iloilo';
    if (['巴科洛德', 'bacolod', 'eroom'].some(value => name.includes(this.normalizeSchoolName(value)))) return 'bacolod';
    if (name.includes('宿务') || name.includes('cebu') || this.getPopularityIndex(school) >= 0) return 'cebu';
    return 'other';
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

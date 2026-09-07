import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import {
  StaffPermissionUserDTO,
  StaffSchoolPermissionDTO,
} from '../../../interfaces/staff-permission.dto';
import { StaffPermissionService } from '../../../services/staff-permission.service';

@Component({
  selector: 'app-admin-staff-permissions',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, RouterLink],
  templateUrl: './admin-staff-permissions.component.html',
  styleUrl: './admin-staff-permissions.component.css',
})
export class AdminStaffPermissionsComponent implements OnInit {
  staff: StaffPermissionUserDTO[] = [];
  selected?: StaffPermissionUserDTO;
  search = '';
  isLoading = true;
  isSaving = false;
  message = '';
  messageKind: 'success' | 'error' | '' = '';

  constructor(private readonly permissions: StaffPermissionService) {}

  ngOnInit(): void { this.load(); }

  get filteredSchools(): StaffSchoolPermissionDTO[] {
    const keyword = this.search.trim().toLowerCase();
    return this.selected?.schools.filter(school => !keyword || school.schoolName.toLowerCase().includes(keyword)) ?? [];
  }

  select(user: StaffPermissionUserDTO): void {
    this.selected = this.clone(user);
    this.message = '';
  }

  rowHasAll(school: StaffSchoolPermissionDTO): boolean {
    return school.schoolContent && school.pricing && school.quoteImage && school.media && school.students;
  }

  toggleAll(school: StaffSchoolPermissionDTO, checked: boolean): void {
    school.schoolContent = checked;
    school.pricing = checked;
    school.quoteImage = checked;
    school.media = checked;
    school.students = checked;
  }

  save(): void {
    if (!this.selected || this.isSaving) return;
    this.isSaving = true;
    this.message = '';
    this.permissions.update(this.selected.userId, this.selected.schools)
      .pipe(finalize(() => this.isSaving = false))
      .subscribe({
        next: updated => {
          const index = this.staff.findIndex(item => item.userId === updated.userId);
          if (index >= 0) this.staff[index] = updated;
          this.selected = this.clone(updated);
          this.messageKind = 'success';
          this.message = `已保存 ${updated.name || updated.account} 的权限，员工下次进入后台时立即生效。`;
        },
        error: () => {
          this.messageKind = 'error';
          this.message = '权限保存失败，请稍后重试。';
        },
      });
  }

  private load(): void {
    this.permissions.getAll().pipe(finalize(() => this.isLoading = false)).subscribe({
      next: staff => {
        this.staff = staff;
        if (staff.length) this.select(staff[0]);
      },
      error: () => {
        this.messageKind = 'error';
        this.message = '员工列表加载失败。';
      },
    });
  }

  private clone(user: StaffPermissionUserDTO): StaffPermissionUserDTO {
    return { ...user, schools: user.schools.map(school => ({ ...school })) };
  }
}

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { StaffPermissionUserDTO } from '../../../interfaces/staff-permission.dto';
import { StaffPermissionService } from '../../../services/staff-permission.service';

type EmployeeType = 'Consultant' | 'Manager';

@Component({
  selector: 'app-admin-staff-permissions',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterLink],
  templateUrl: './admin-staff-permissions.component.html',
  styleUrl: './admin-staff-permissions.component.css',
})
export class AdminStaffPermissionsComponent implements OnInit {
  staff: StaffPermissionUserDTO[] = [];
  selected?: StaffPermissionUserDTO;
  activeType: EmployeeType = 'Consultant';
  isLoading = true;
  isSaving = false;
  message = '';
  messageKind: 'success' | 'error' | '' = '';

  constructor(private readonly permissions: StaffPermissionService) {}

  ngOnInit(): void { this.load(); }

  get consultants(): StaffPermissionUserDTO[] {
    return this.staff.filter(user => user.employeeType !== 'Manager');
  }

  get managers(): StaffPermissionUserDTO[] {
    return this.staff.filter(user => user.employeeType === 'Manager');
  }

  get visibleStaff(): StaffPermissionUserDTO[] {
    return this.activeType === 'Manager' ? this.managers : this.consultants;
  }

  selectType(type: EmployeeType): void {
    this.activeType = type;
    this.selected = this.visibleStaff[0];
    this.message = '';
  }

  select(user: StaffPermissionUserDTO): void {
    this.selected = user;
    this.message = '';
  }

  changeEmployeeType(employeeType: EmployeeType): void {
    if (!this.selected || this.selected.employeeType === employeeType || this.isSaving) return;
    const roleName = employeeType === 'Manager' ? '管理' : '顾问';
    const warning = employeeType === 'Manager'
      ? '管理可以编辑并直接发布，也可以审核顾问提交的修改。确定要设为管理吗？'
      : '改为顾问后，该员工将不能发布，只能提交审核。确定继续吗？';
    if (!window.confirm(warning)) return;

    this.isSaving = true;
    this.message = '';
    const userId = this.selected.userId;
    this.permissions.updateEmployeeType(userId, employeeType)
      .pipe(finalize(() => this.isSaving = false))
      .subscribe({
        next: updated => {
          const index = this.staff.findIndex(user => user.userId === userId);
          if (index >= 0) this.staff[index] = updated;
          this.selected = updated;
          this.activeType = employeeType;
          this.messageKind = 'success';
          this.message = `已将 ${updated.name || updated.account} 设为${roleName}，下次登录时按新权限生效。`;
        },
        error: error => {
          this.messageKind = 'error';
          this.message = typeof error?.error === 'string' ? error.error : '员工类型保存失败，请稍后重试。';
        },
      });
  }

  private load(): void {
    this.permissions.getAll().pipe(finalize(() => this.isLoading = false)).subscribe({
      next: staff => {
        this.staff = staff;
        if (!this.consultants.length && this.managers.length) this.activeType = 'Manager';
        this.selected = this.visibleStaff[0];
      },
      error: () => {
        this.messageKind = 'error';
        this.message = '员工列表加载失败。';
      },
    });
  }
}

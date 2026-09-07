import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { StaffPermissionScope } from '../../../interfaces/staff-permission.dto';
import { StaffPermissionService } from '../../../services/staff-permission.service';

@Component({
  selector: 'app-admin-layout',
  standalone: false,
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css',
})
export class AdminLayoutComponent {
  readonly isAdmin: boolean;
  permissionsLoaded = false;

  constructor(
    private authService: AuthService,
    private staffPermissions: StaffPermissionService,
  ) {
    this.isAdmin = this.authService.getRoles().some(role => role.toLowerCase() === 'admin');
    if (this.isAdmin) {
      this.permissionsLoaded = true;
    } else {
      this.staffPermissions.loadMine().subscribe({
        next: () => this.permissionsLoaded = true,
        error: () => this.permissionsLoaded = true,
      });
    }
  }

  canUse(scope: StaffPermissionScope): boolean {
    return this.isAdmin || (this.permissionsLoaded && this.staffPermissions.hasAny(scope));
  }
  logout() {
    this.authService.logout();
  }
}

// role.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const expectedRoles = (route.data['roles'] ?? [route.data['role']])
      .filter(Boolean)
      .map((role: string) => role.toLowerCase());
    const userRoles = this.authService.getRoles().map((role) => role.toLowerCase());

    if (!this.authService.isAuthenticated() || !expectedRoles.some((role: string) => userRoles.includes(role))) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}

import { Component } from '@angular/core';
import { mainNavigation, NavigationItem } from '../../config/navigation.config';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  mobileMenuOpen = false;
  readonly navItems = mainNavigation;

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  trackById(_: number, item: NavigationItem): string {
    return item.id;
  }
}

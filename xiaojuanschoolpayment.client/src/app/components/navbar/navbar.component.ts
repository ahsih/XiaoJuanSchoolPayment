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
  megaMenuSuppressed = false;
  readonly navItems = mainNavigation;

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  closeMenus(): void {
    this.mobileMenuOpen = false;
    this.megaMenuSuppressed = true;

    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }

  allowMegaMenu(): void {
    this.megaMenuSuppressed = false;
  }

  trackById(_: number, item: NavigationItem): string {
    return item.id;
  }
}

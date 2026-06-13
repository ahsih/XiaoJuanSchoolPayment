import { Component } from '@angular/core';

interface NavbarItem {
  label: string;
  route: string;
}

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  mobileMenuOpen = false;

  readonly navItems: NavbarItem[] = [
    { label: '爱尔兰留学', route: '/' },
    { label: '菲律宾游学', route: '/' },
    { label: '线上英语', route: '/' },
    { label: '海外游学', route: '/' },
    { label: '游学指南', route: '/' },
    { label: '留学指南', route: '/' },
    { label: '学员反馈', route: '/' },
    { label: '关于思达', route: '/' },
  ];

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }
}

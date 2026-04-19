import { Component } from '@angular/core';
import { Language, TranslationService } from '../../../services/translation.service';

@Component({
  selector: 'app-main-navbar',
  standalone: false,
  templateUrl: './main-navbar.component.html',
  styleUrl: './main-navbar.component.css',
})
export class MainNavbarComponent {
  mobileMenuOpen = false;

  readonly navItems = [
    { labelKey: 'nav.home', route: '/' },
    { labelKey: 'nav.register', route: '/register' },
    { labelKey: 'nav.login', route: '/login' },
  ];

  constructor(public translationService: TranslationService) {}

  get currentLanguage(): Language {
    return this.translationService.currentLanguage;
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  setLanguage(language: Language): void {
    this.translationService.setLanguage(language);
  }
}

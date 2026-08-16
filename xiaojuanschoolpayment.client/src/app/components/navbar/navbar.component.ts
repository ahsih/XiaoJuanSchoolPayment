import { Component } from '@angular/core';
import { mainNavigation, NavigationItem } from '../../config/navigation.config';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  private readonly thirdLevelPreviewLimit = 6;
  private readonly expandedThirdLevelGroups = new Set<string>();

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
    this.expandedThirdLevelGroups.clear();

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

  canCollapseThirdLevel(parent: NavigationItem, child: NavigationItem): boolean {
    return (
      parent.id === 'philippines-study' &&
      (child.children?.length ?? 0) > this.thirdLevelPreviewLimit
    );
  }

  isThirdLevelExpanded(parent: NavigationItem, child: NavigationItem): boolean {
    return this.expandedThirdLevelGroups.has(
      this.getThirdLevelGroupKey(parent, child)
    );
  }

  getVisibleThirdLevelItems(
    parent: NavigationItem,
    child: NavigationItem
  ): NavigationItem[] {
    const thirdLevelItems = child.children ?? [];

    if (
      !this.canCollapseThirdLevel(parent, child) ||
      this.isThirdLevelExpanded(parent, child)
    ) {
      return thirdLevelItems;
    }

    return thirdLevelItems.slice(0, this.thirdLevelPreviewLimit);
  }

  getHiddenThirdLevelCount(parent: NavigationItem, child: NavigationItem): number {
    if (!this.canCollapseThirdLevel(parent, child)) {
      return 0;
    }

    return Math.max((child.children?.length ?? 0) - this.thirdLevelPreviewLimit, 0);
  }

  getThirdLevelMenuId(parent: NavigationItem, child: NavigationItem): string {
    return `mega-subitems-${this.getThirdLevelGroupKey(parent, child)}`;
  }

  toggleThirdLevel(
    parent: NavigationItem,
    child: NavigationItem,
    event: MouseEvent
  ): void {
    event.preventDefault();
    event.stopPropagation();

    const key = this.getThirdLevelGroupKey(parent, child);

    if (this.expandedThirdLevelGroups.has(key)) {
      this.expandedThirdLevelGroups.delete(key);
      return;
    }

    this.expandedThirdLevelGroups.add(key);
  }

  private getThirdLevelGroupKey(
    parent: NavigationItem,
    child: NavigationItem
  ): string {
    return `${parent.id}-${child.id}`;
  }
}

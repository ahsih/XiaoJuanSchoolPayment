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

  isPhilippinesMenu(item: NavigationItem): boolean {
    return item.id === 'philippines-study';
  }

  getPhilippinesQuickLinks(item: NavigationItem): NavigationItem[] {
    const children = item.children ?? [];
    const schoolDirectory = children.find(child => child.id === 'philippines-schools');
    const quickLinkIds = new Set([
      'why-philippines',
      'philippines-cost',
      'philippines-offers',
    ]);
    const quickLinks = children.filter(child => quickLinkIds.has(child.id));
    const byCity = schoolDirectory?.children?.find(
      child => child.id === 'philippines-schools-by-city'
    );

    const orderedLinks = byCity
      ? [quickLinks[0], quickLinks[1], byCity, quickLinks[2]]
      : quickLinks;

    return orderedLinks.filter(
      (link): link is NavigationItem => Boolean(link)
    );
  }

  getPhilippinesQuickLinkIcon(item: NavigationItem): string {
    const icons: Record<string, string> = {
      'why-philippines': 'travel_explore',
      'philippines-cost': 'payments',
      'philippines-schools-by-city': 'location_city',
      'philippines-offers': 'local_offer',
    };

    return icons[item.id] ?? 'arrow_forward';
  }

  getPhilippinesCities(item: NavigationItem): NavigationItem[] {
    return (item.children ?? []).filter(
      child => child.type === '城市页' && child.id !== 'more-philippines-cities'
    );
  }

  getMorePhilippinesCities(item: NavigationItem): NavigationItem[] {
    return (
      (item.children ?? []).find(child => child.id === 'more-philippines-cities')
        ?.children ?? []
    );
  }

  getPhilippinesNeedLinks(item: NavigationItem): NavigationItem[] {
    return (item.children ?? []).filter(
      child => child.type === '需求页' || child.type === '项目页' || child.id === 'philippines-faq'
    );
  }

  getPhilippinesCityLabel(item: NavigationItem): string {
    return item.label.replace(/游学$/, '');
  }

  getPhilippinesCitySchoolCount(item: NavigationItem): number {
    const directoryCounts: Record<string, number> = {
      'cebu-study': 38,
      'baguio-study': 9,
      'clark-study': 7,
      'manila-study': 4,
      'iloilo-study': 4,
      'boracay-study': 2,
      'bacolod-study': 1,
    };

    return directoryCounts[item.id] ?? item.children?.length ?? 0;
  }

  getPhilippinesCityIcon(item: NavigationItem): string {
    const icons: Record<string, string> = {
      'cebu-study': 'wb_sunny',
      'baguio-study': 'landscape',
      'clark-study': 'flight_takeoff',
      'manila-study': 'location_city',
      'iloilo-study': 'park',
      'boracay-study': 'beach_access',
      'bacolod-study': 'spa',
    };

    return icons[item.id] ?? 'place';
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

import { ChangeDetectorRef, Pipe, PipeTransform } from '@angular/core';
import { Subscription } from 'rxjs';
import { TranslationService } from '../../services/translation.service';

@Pipe({
  name: 't',
  standalone: false,
  pure: false,
})
export class TranslatePipe implements PipeTransform {
  private languageSubscription?: Subscription;

  constructor(
    private readonly translationService: TranslationService,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {
    this.languageSubscription = this.translationService.language$.subscribe(() =>
      this.changeDetectorRef.markForCheck()
    );
  }

  transform(key: string): string {
    return this.translationService.instant(key);
  }

  ngOnDestroy(): void {
    this.languageSubscription?.unsubscribe();
  }
}

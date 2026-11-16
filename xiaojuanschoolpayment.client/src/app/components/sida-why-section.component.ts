import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { SidaWhyContent, sidaWhyContent } from './sida-why-content';

@Component({
  selector: 'app-sida-why-section',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './sida-why-section.component.html',
  styleUrl: './sida-why-section.component.css',
})
export class SidaWhySectionComponent {
  @Input() schoolName = '菲律宾学校';
  @Input() supportTitle = '深圳总部 + 菲律宾当地支持';
  @Input() supportBadge = '深圳总部 + 菲律宾支持';
  @Input() detailed = false;

  /** Section text, shared with the WeChat mini program; see sida-why-content.ts. */
  get content(): SidaWhyContent {
    return sidaWhyContent(this.schoolName, {
      supportTitle: this.supportTitle,
      supportBadge: this.supportBadge,
      detailed: this.detailed,
    });
  }
}

import { AfterViewInit, Component, Injector, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { BrowseAlertTracker } from '../services/browse-alert-tracker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, AfterViewInit {

  @ViewChild('quoteExporterHost', { read: ViewContainerRef })
  private quoteExporterHost?: ViewContainerRef;

  @ViewChild('browseNoticeHost', { read: ViewContainerRef })
  private browseNoticeHost?: ViewContainerRef;

  constructor(
    private readonly injector: Injector,
    private readonly browseAlerts: BrowseAlertTracker,
  ) {}

  async ngOnInit() {
    // Before the first navigation, so a personal link's ?vt= code is read and removed from the address bar.
    this.browseAlerts.start();
    this.browseAlerts.noticeRequested.subscribe((consultant) => void this.showBrowseNotice(consultant));

    const { SeoService } = await import('../services/seo.service');
    this.injector.get(SeoService).init();
  }

  async ngAfterViewInit(): Promise<void> {
    const { PhilippinesQuoteImageExporterComponent } = await import(
      './components/philippines-quote-image-exporter.component'
    );
    this.quoteExporterHost?.createComponent(PhilippinesQuoteImageExporterComponent);
  }

  private async showBrowseNotice(consultant: string): Promise<void> {
    const { BrowseAlertNoticeComponent } = await import('./components/browse-alert-notice/browse-alert-notice.component');
    const host = this.browseNoticeHost;
    if (!host || host.length > 0) {
      return;
    }
    const notice = host.createComponent(BrowseAlertNoticeComponent);
    notice.setInput('consultant', consultant);
    notice.instance.acknowledged.subscribe(() => {
      this.browseAlerts.acknowledge();
      notice.destroy();
    });
    notice.instance.optedOut.subscribe(() => {
      this.browseAlerts.optOut();
      notice.destroy();
    });
  }

  title = 'xiaojuanschoolpayment.client';
}

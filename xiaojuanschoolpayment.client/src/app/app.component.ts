import { AfterViewInit, Component, Injector, OnInit, ViewChild, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, AfterViewInit {

  @ViewChild('quoteExporterHost', { read: ViewContainerRef })
  private quoteExporterHost?: ViewContainerRef;

  constructor(private readonly injector: Injector) {}

  async ngOnInit() {
    const { SeoService } = await import('../services/seo.service');
    this.injector.get(SeoService).init();
  }

  async ngAfterViewInit(): Promise<void> {
    const { PhilippinesQuoteImageExporterComponent } = await import(
      './components/philippines-quote-image-exporter.component'
    );
    this.quoteExporterHost?.createComponent(PhilippinesQuoteImageExporterComponent);
  }

  title = 'xiaojuanschoolpayment.client';
}

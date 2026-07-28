import { Component, Injector, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  constructor(private readonly injector: Injector) {}

  async ngOnInit() {
    const { SeoService } = await import('../services/seo.service');
    this.injector.get(SeoService).init();
  }

  title = 'xiaojuanschoolpayment.client';
}

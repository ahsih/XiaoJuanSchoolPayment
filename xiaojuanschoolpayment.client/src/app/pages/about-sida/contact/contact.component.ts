import { AfterViewInit, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './contact.component.html',
})
export class ContactComponent implements AfterViewInit {
  formSubmitted = false;

  ngAfterViewInit(): void {
    if (window.location.hash === '#faq') {
      setTimeout(() => this.scrollToElement('faq', false));
    }
  }

  scrollToSection(event: Event, sectionId: string): void {
    event.preventDefault();
    window.history.pushState(null, '', `${window.location.pathname}#${sectionId}`);
    this.scrollToElement(sectionId);
  }

  submitRequest(event: SubmitEvent): void {
    event.preventDefault();

    const form = event.target as HTMLFormElement;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    this.formSubmitted = true;
    form.reset();
  }

  private scrollToElement(sectionId: string, smooth = true): void {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: smooth ? 'smooth' : 'auto',
      block: 'start',
    });
  }
}

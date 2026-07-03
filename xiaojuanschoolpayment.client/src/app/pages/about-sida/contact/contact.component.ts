import { AfterViewInit, Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { finalize } from 'rxjs';

interface ContactFormPayload {
  name: string;
  email: string;
  phone: string;
  wechat: string;
  message: string;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './contact.component.html',
})
export class ContactComponent implements AfterViewInit {
  private readonly http = inject(HttpClient);

  formSubmitted = false;
  isSubmitting = false;
  submitError = '';

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

    const payload = this.getContactFormPayload(form);

    this.formSubmitted = false;
    this.submitError = '';
    this.isSubmitting = true;

    this.http
      .post('/contact-form/send', payload)
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: () => {
          this.formSubmitted = true;
          form.reset();
        },
        error: () => {
          this.submitError = '提交失败，请稍后再试，或直接添加顾问微信联系。';
        },
      });
  }

  private scrollToElement(sectionId: string, smooth = true): void {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: smooth ? 'smooth' : 'auto',
      block: 'start',
    });
  }

  private getContactFormPayload(form: HTMLFormElement): ContactFormPayload {
    const formData = new FormData(form);

    return {
      name: String(formData.get('name') ?? '').trim(),
      email: String(formData.get('email') ?? '').trim(),
      phone: String(formData.get('phone') ?? '').trim(),
      wechat: String(formData.get('wechat') ?? '').trim(),
      message: String(formData.get('message') ?? '').trim(),
    };
  }
}

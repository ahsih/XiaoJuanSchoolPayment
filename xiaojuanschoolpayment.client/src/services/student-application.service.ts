import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CreateStudentApplicationDTO,
  StudentApplicationDTO,
  StudentApplicationDocumentDTO,
  StudentPaymentDTO,
  StudentPaymentSubmissionDTO,
  UpdateStudentApplicationDTO,
} from '../interfaces/student-application.dto';

@Injectable({ providedIn: 'root' })
export class StudentApplicationService {
  private readonly apiUrl = 'student-applications';

  constructor(private http: HttpClient) {}

  getAll(search = ''): Observable<StudentApplicationDTO[]> {
    return this.http.get<StudentApplicationDTO[]>(this.apiUrl, {
      headers: this.authHeaders(),
      params: search ? { search } : {},
    });
  }

  getMine(): Observable<StudentApplicationDTO[]> {
    return this.http.get<StudentApplicationDTO[]>(`${this.apiUrl}/me`, { headers: this.authHeaders() });
  }

  getPendingReviews(): Observable<StudentApplicationDTO[]> {
    return this.http.get<StudentApplicationDTO[]>(`${this.apiUrl}/reviews`, { headers: this.authHeaders() });
  }

  getPendingPaymentReviews(): Observable<StudentPaymentDTO[]> {
    return this.http.get<StudentPaymentDTO[]>(`${this.apiUrl}/payment-reviews`, { headers: this.authHeaders() });
  }

  create(request: CreateStudentApplicationDTO): Observable<StudentApplicationDTO> {
    return this.http.post<StudentApplicationDTO>(this.apiUrl, request, { headers: this.authHeaders() });
  }

  update(id: string, request: UpdateStudentApplicationDTO): Observable<StudentApplicationDTO> {
    return this.http.put<StudentApplicationDTO>(`${this.apiUrl}/${id}`, request, { headers: this.authHeaders() });
  }

  submitForReview(id: string, changeSummary: string): Observable<StudentApplicationDTO> {
    return this.http.post<StudentApplicationDTO>(
      `${this.apiUrl}/${id}/submit-review`,
      { changeSummary },
      { headers: this.authHeaders() },
    );
  }

  publish(id: string, changeSummary?: string): Observable<StudentApplicationDTO> {
    return this.http.post<StudentApplicationDTO>(
      `${this.apiUrl}/${id}/publish`,
      { changeSummary },
      { headers: this.authHeaders() },
    );
  }

  returnToDraft(id: string, reason: string): Observable<StudentApplicationDTO> {
    return this.http.post<StudentApplicationDTO>(
      `${this.apiUrl}/${id}/return-to-draft`,
      { reason },
      { headers: this.authHeaders() },
    );
  }

  uploadDocument(
    applicationId: string,
    file: File,
    documentType: string,
    displayName: string,
    isVisibleToStudent: boolean,
  ): Observable<StudentApplicationDocumentDTO> {
    const body = new FormData();
    body.append('file', file);
    body.append('documentType', documentType);
    body.append('displayName', displayName);
    body.append('isVisibleToStudent', String(isVisibleToStudent));
    return this.http.post<StudentApplicationDocumentDTO>(`${this.apiUrl}/${applicationId}/documents`, body, {
      headers: this.authHeaders(),
    });
  }

  deleteDocument(applicationId: string, documentId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${applicationId}/documents/${documentId}`, {
      headers: this.authHeaders(),
    });
  }

  submitPayment(
    applicationId: string,
    request: StudentPaymentSubmissionDTO,
    file: File,
  ): Observable<StudentPaymentDTO> {
    return this.http.post<StudentPaymentDTO>(
      `${this.apiUrl}/${applicationId}/payments`,
      this.paymentFormData(request, file),
      { headers: this.authHeaders() },
    );
  }

  resubmitPayment(
    applicationId: string,
    paymentId: string,
    request: StudentPaymentSubmissionDTO,
    file?: File | null,
  ): Observable<StudentPaymentDTO> {
    return this.http.put<StudentPaymentDTO>(
      `${this.apiUrl}/${applicationId}/payments/${paymentId}`,
      this.paymentFormData(request, file),
      { headers: this.authHeaders() },
    );
  }

  confirmPayment(applicationId: string, paymentId: string, note = ''): Observable<StudentPaymentDTO> {
    return this.http.post<StudentPaymentDTO>(
      `${this.apiUrl}/${applicationId}/payments/${paymentId}/confirm`,
      { note },
      { headers: this.authHeaders() },
    );
  }

  returnPayment(applicationId: string, paymentId: string, reason: string): Observable<StudentPaymentDTO> {
    return this.http.post<StudentPaymentDTO>(
      `${this.apiUrl}/${applicationId}/payments/${paymentId}/return`,
      { reason },
      { headers: this.authHeaders() },
    );
  }

  deletePayment(applicationId: string, paymentId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${applicationId}/payments/${paymentId}`, {
      headers: this.authHeaders(),
    });
  }

  downloadPaymentReceipt(applicationId: string, payment: StudentPaymentDTO): void {
    this.http
      .get(`${this.apiUrl}/${applicationId}/payments/${payment.id}/receipt`, {
        headers: this.authHeaders(),
        responseType: 'blob',
      })
      .subscribe((blob) => {
        const url = URL.createObjectURL(blob);
        const link = window.document.createElement('a');
        link.href = url;
        link.download = payment.originalFileName || `${payment.paymentType}-付款凭证`;
        link.click();
        window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
      });
  }

  downloadDocument(applicationId: string, document: StudentApplicationDocumentDTO): void {
    this.http
      .get(`${this.apiUrl}/${applicationId}/documents/${document.id}`, {
        headers: this.authHeaders(),
        responseType: 'blob',
      })
      .subscribe((blob) => {
        const url = URL.createObjectURL(blob);
        const link = window.document.createElement('a');
        link.href = url;
        link.download = document.originalFileName || document.displayName;
        link.click();
        window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
      });
  }

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders(token ? { Authorization: `Bearer ${token}` } : {});
  }

  private paymentFormData(request: StudentPaymentSubmissionDTO, file?: File | null): FormData {
    const body = new FormData();
    if (file) body.append('file', file);
    body.append('payerName', request.payerName);
    body.append('paymentType', request.paymentType);
    body.append('amount', String(request.amount));
    body.append('currencyCode', request.currencyCode);
    body.append('paidAt', request.paidAt);
    body.append('paymentMethod', request.paymentMethod);
    body.append('receivingAccount', request.receivingAccount ?? '');
    body.append('referenceNumber', request.referenceNumber ?? '');
    body.append('note', request.note ?? '');
    return body;
  }
}

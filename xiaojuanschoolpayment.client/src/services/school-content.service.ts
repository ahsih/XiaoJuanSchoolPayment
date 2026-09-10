import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  SchoolContentEditorDTO,
  SchoolContentReviewDTO,
  SchoolContentRevisionDTO,
} from '../interfaces/school-content.dto';

@Injectable({ providedIn: 'root' })
export class SchoolContentService {
  private readonly apiUrl = '/school-content';

  constructor(private readonly http: HttpClient) {}

  getPublished<TContent>(schoolId: string): Observable<SchoolContentRevisionDTO<TContent>> {
    return this.http.get<SchoolContentRevisionDTO<TContent>>(
      `${this.apiUrl}/${schoolId}/published`,
    );
  }

  getEditor<TContent>(schoolId: string): Observable<SchoolContentEditorDTO<TContent>> {
    return this.http.get<SchoolContentEditorDTO<TContent>>(
      `${this.apiUrl}/${schoolId}/editor`,
      { headers: this.authHeaders() },
    );
  }

  getPendingReviews(): Observable<SchoolContentReviewDTO[]> {
    return this.http.get<SchoolContentReviewDTO[]>(`${this.apiUrl}/reviews`, {
      headers: this.authHeaders(),
    });
  }

  saveDraft<TContent>(
    schoolId: string,
    content: TContent,
    changeSummary?: string,
  ): Observable<SchoolContentRevisionDTO<TContent>> {
    return this.http.put<SchoolContentRevisionDTO<TContent>>(
      `${this.apiUrl}/${schoolId}/draft`,
      { content, changeSummary },
      { headers: this.authHeaders() },
    );
  }

  saveQuoteImageDraft<TContent, TSettings>(
    schoolId: string,
    quoteImageSettings: TSettings,
    changeSummary?: string,
  ): Observable<SchoolContentRevisionDTO<TContent>> {
    return this.http.put<SchoolContentRevisionDTO<TContent>>(
      `${this.apiUrl}/${schoolId}/quote-image-draft`,
      { quoteImageSettings, changeSummary },
      { headers: this.authHeaders() },
    );
  }

  savePricingDraft<TContent>(
    schoolId: string,
    content: TContent,
    changeSummary?: string,
  ): Observable<SchoolContentRevisionDTO<TContent>> {
    return this.http.put<SchoolContentRevisionDTO<TContent>>(
      `${this.apiUrl}/${schoolId}/pricing-draft`,
      { content, changeSummary },
      { headers: this.authHeaders() },
    );
  }

  saveMediaDraft<TContent, TMedia>(
    schoolId: string,
    media: TMedia,
    changeSummary?: string,
  ): Observable<SchoolContentRevisionDTO<TContent>> {
    return this.http.put<SchoolContentRevisionDTO<TContent>>(
      `${this.apiUrl}/${schoolId}/media-draft`,
      { media, changeSummary },
      { headers: this.authHeaders() },
    );
  }

  publish<TContent>(schoolId: string, changeSummary?: string): Observable<SchoolContentRevisionDTO<TContent>> {
    return this.http.post<SchoolContentRevisionDTO<TContent>>(
      `${this.apiUrl}/${schoolId}/publish`,
      { changeSummary },
      { headers: this.authHeaders() },
    );
  }

  submitForReview<TContent>(
    schoolId: string,
    scope: 'SchoolContent' | 'Pricing' | 'QuoteImage' | 'Media',
  ): Observable<SchoolContentRevisionDTO<TContent>> {
    return this.http.post<SchoolContentRevisionDTO<TContent>>(
      `${this.apiUrl}/${schoolId}/submit-review?scope=${scope}`,
      {},
      { headers: this.authHeaders() },
    );
  }

  returnToDraft<TContent>(schoolId: string, reason: string): Observable<SchoolContentRevisionDTO<TContent>> {
    return this.http.post<SchoolContentRevisionDTO<TContent>>(
      `${this.apiUrl}/${schoolId}/return-to-draft`,
      JSON.stringify(reason),
      { headers: this.authHeaders().set('Content-Type', 'application/json') },
    );
  }

  restore<TContent>(
    schoolId: string,
    revisionId: string,
  ): Observable<SchoolContentRevisionDTO<TContent>> {
    return this.http.post<SchoolContentRevisionDTO<TContent>>(
      `${this.apiUrl}/${schoolId}/restore/${revisionId}`,
      {},
      { headers: this.authHeaders() },
    );
  }

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders(token ? { Authorization: `Bearer ${token}` } : {});
  }
}

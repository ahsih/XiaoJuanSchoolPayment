import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CreateStudentApplicationDTO,
  StudentApplicationDTO,
  StudentApplicationDocumentDTO,
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

  create(request: CreateStudentApplicationDTO): Observable<StudentApplicationDTO> {
    return this.http.post<StudentApplicationDTO>(this.apiUrl, request, { headers: this.authHeaders() });
  }

  update(id: string, request: UpdateStudentApplicationDTO): Observable<StudentApplicationDTO> {
    return this.http.put<StudentApplicationDTO>(`${this.apiUrl}/${id}`, request, { headers: this.authHeaders() });
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
}

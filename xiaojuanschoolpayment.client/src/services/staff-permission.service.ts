import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import {
  StaffPermissionScope,
  StaffPermissionUserDTO,
  StaffSchoolPermissionDTO,
} from '../interfaces/staff-permission.dto';

@Injectable({ providedIn: 'root' })
export class StaffPermissionService {
  private readonly apiUrl = '/staff-permissions';
  private readonly mineSubject = new BehaviorSubject<StaffPermissionUserDTO | null>(null);
  readonly mine$ = this.mineSubject.asObservable();

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<StaffPermissionUserDTO[]> {
    return this.http.get<StaffPermissionUserDTO[]>(this.apiUrl, { headers: this.authHeaders() });
  }

  loadMine(): Observable<StaffPermissionUserDTO> {
    return this.http.get<StaffPermissionUserDTO>(`${this.apiUrl}/me`, { headers: this.authHeaders() })
      .pipe(tap(value => this.mineSubject.next(value)));
  }

  update(userId: string, schools: StaffSchoolPermissionDTO[]): Observable<StaffPermissionUserDTO> {
    return this.http.put<StaffPermissionUserDTO>(
      `${this.apiUrl}/${userId}`,
      { schools },
      { headers: this.authHeaders() },
    );
  }

  hasAny(scope: StaffPermissionScope): boolean {
    return this.mineSubject.value?.schools.some(school => school[scope]) ?? false;
  }

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders(token ? { Authorization: `Bearer ${token}` } : {});
  }
}

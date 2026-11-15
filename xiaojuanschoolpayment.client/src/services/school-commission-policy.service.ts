import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SchoolCommissionPolicyDTO } from '../interfaces/school-commission-policy.dto';

@Injectable({ providedIn: 'root' })
export class SchoolCommissionPolicyService {
  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<SchoolCommissionPolicyDTO[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders(token ? { Authorization: `Bearer ${token}` } : {});
    return this.http.get<SchoolCommissionPolicyDTO[]>('/internal-commission-policies', { headers });
  }
}

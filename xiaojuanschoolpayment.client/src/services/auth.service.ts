import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map } from 'rxjs/operators';
import { SchoolUserDTO } from '../interfaces/SchoolUser.dto';
import { JWTLoginTokenDTO } from '../interfaces/JWTLoginToken.dto';
import {
  LoginRequestDTO,
  InvitationCodeDTO,
  ResetPasswordRequestDTO,
} from '../interfaces/Auth.dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'auth';
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient, private router: Router) { }

  register(user: SchoolUserDTO): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/register`, user);
  }

  requestPasswordReset(account: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/forgot-password`, { account });
  }

  resetPassword(request: ResetPasswordRequestDTO): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/reset-password`, request);
  }

  getInvitations(): Observable<InvitationCodeDTO[]> {
    return this.http.get<InvitationCodeDTO[]>(`${this.apiUrl}/invitations`, {
      headers: this.authHeaders(),
    });
  }

  createInvitation(
    expiresInDays: number,
    employeeType?: 'Consultant' | 'Manager',
  ): Observable<InvitationCodeDTO> {
    return this.http.post<InvitationCodeDTO>(
      `${this.apiUrl}/invitations`,
      { expiresInDays, employeeType },
      { headers: this.authHeaders() },
    );
  }

  revokeInvitation(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/invitations/${id}`, {
      headers: this.authHeaders(),
    });
  }

  login(request: LoginRequestDTO): Observable<JWTLoginTokenDTO> {
    return this.http.post<JWTLoginTokenDTO>(`${this.apiUrl}/login`, request).pipe(
      map((response: JWTLoginTokenDTO) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem(
          'user',
          JSON.stringify({
            account: response.account,
            email: response.email,
            phoneNumber: response.phoneNumber,
            name: response.name,
            role: response.roles,
          })
        );
        return response;
      })
    );
  }

  public isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return token != null && !this.jwtHelper.isTokenExpired(token);
  }

  public getRole(): string | null {
    return this.getRoles()[0] ?? null;
  }

  public getRoles(): string[] {
    const token = localStorage.getItem('token');
    if (!token) return [];
    const decoded = this.jwtHelper.decodeToken(token);
    const value = (
      decoded?.role ||
      decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
      []
    );
    return (Array.isArray(value) ? value : [value]).map((role) => String(role));
  }

  changePassword(currentPassword: string, newPassword: string): Observable<void> {
    const token = localStorage.getItem('token');
    return this.http.post<void>(
      `${this.apiUrl}/change-password`,
      { currentPassword, newPassword },
      { headers: token ? { Authorization: `Bearer ${token}` } : {} },
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/']);
  }

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders(token ? { Authorization: `Bearer ${token}` } : {});
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SchoolUserDTO } from '../interfaces/SchoolUser.dto';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map } from 'rxjs/operators';
import { JWTLoginTokenDTO } from '../interfaces/JWTLoginToken.dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'auth';
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient, private router: Router) { }

  register(user: SchoolUserDTO): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      map((response: JWTLoginTokenDTO) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify({ email, role: response.roles }));
        return response;
      })
    );
  }


  public isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return token != null && !this.jwtHelper.isTokenExpired(token);
  }

  public getRole(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const decoded = this.jwtHelper.decodeToken(token);
     return (
      decoded?.role || 
      decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || 
      null
    )
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }
}
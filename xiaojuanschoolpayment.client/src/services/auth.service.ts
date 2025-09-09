import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SchoolUserDTO } from '../interfaces/SchoolUser.dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/auth'; 

  constructor(private http: HttpClient) {}

  register(user: SchoolUserDTO): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }
}
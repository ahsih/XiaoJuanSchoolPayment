import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CurrencyDTO } from '../interfaces/currency.dto';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  private apiUrl = 'currency';
  constructor(private http: HttpClient) {}
  getSchoolLessons(): Observable<CurrencyDTO[]> {
    const token = localStorage.getItem('token');
    return this.http.get<CurrencyDTO[]>(`${this.apiUrl}/get-currencys`, {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    });
  }
}

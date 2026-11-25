import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  BrowseAlertChannelDTO,
  BrowseAlertLinkDTO,
  BrowseAlertPageDTO,
  BrowseAlertViewDTO,
  SaveBrowseAlertChannelDTO,
  SaveBrowseAlertLinkDTO,
  SaveWeComAppSettingDTO,
  WeComAppSettingDTO,
} from '../interfaces/browse-alert.dto';

/** Back-office API for student browse reminders (/admin/browse-alerts). */
@Injectable({ providedIn: 'root' })
export class BrowseAlertService {
  private readonly baseUrl = '/browse-alerts';

  constructor(private readonly http: HttpClient) {}

  getPages(): Observable<BrowseAlertPageDTO[]> {
    return this.http.get<BrowseAlertPageDTO[]>(`${this.baseUrl}/pages`, { headers: this.headers() });
  }

  getLinks(): Observable<BrowseAlertLinkDTO[]> {
    return this.http.get<BrowseAlertLinkDTO[]>(`${this.baseUrl}/links`, { headers: this.headers() });
  }

  createLink(request: SaveBrowseAlertLinkDTO): Observable<BrowseAlertLinkDTO> {
    return this.http.post<BrowseAlertLinkDTO>(`${this.baseUrl}/links`, request, { headers: this.headers() });
  }

  updateLink(id: string, request: SaveBrowseAlertLinkDTO): Observable<BrowseAlertLinkDTO> {
    return this.http.put<BrowseAlertLinkDTO>(`${this.baseUrl}/links/${id}`, request, { headers: this.headers() });
  }

  deleteLink(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/links/${id}`, { headers: this.headers() });
  }

  getViews(id: string): Observable<BrowseAlertViewDTO[]> {
    return this.http.get<BrowseAlertViewDTO[]>(`${this.baseUrl}/links/${id}/views`, { headers: this.headers() });
  }

  getChannels(): Observable<BrowseAlertChannelDTO[]> {
    return this.http.get<BrowseAlertChannelDTO[]>(`${this.baseUrl}/channels`, { headers: this.headers() });
  }

  saveChannel(request: SaveBrowseAlertChannelDTO): Observable<BrowseAlertChannelDTO> {
    return this.http.put<BrowseAlertChannelDTO>(`${this.baseUrl}/channels`, request, { headers: this.headers() });
  }

  testChannel(consultantName: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseUrl}/channels/test`, { consultantName }, { headers: this.headers() });
  }

  getWeComApp(): Observable<WeComAppSettingDTO> {
    return this.http.get<WeComAppSettingDTO>(`${this.baseUrl}/wecom-app`, { headers: this.headers() });
  }

  saveWeComApp(request: SaveWeComAppSettingDTO): Observable<WeComAppSettingDTO> {
    return this.http.put<WeComAppSettingDTO>(`${this.baseUrl}/wecom-app`, request, { headers: this.headers() });
  }

  private headers(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders(token ? { Authorization: `Bearer ${token}` } : {});
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SchoolDTO } from '../interfaces/school.dto';
import { firstValueFrom, Observable } from 'rxjs';
import { SchoolLessonDTO } from '../interfaces/school-lessons.dto';
import { SchoolRoomDTO } from '../interfaces/school-rooms.dto';

@Injectable({
  providedIn: 'root',
})
export class SchoolService {
  private apiUrl = '/school';
  constructor(private http: HttpClient) {}
  saveSchool(school: SchoolDTO): Promise<any> {
    const token = localStorage.getItem('token');
    return firstValueFrom(
      this.http.put<SchoolDTO>(`${this.apiUrl}/save`, school, {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
    );
  }

  getSchools(): Observable<SchoolDTO[]> {
    const token = localStorage.getItem('token');
    return this.http.get<SchoolDTO[]>(`${this.apiUrl}/get-schools`, {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    });
  }

  getSchoolLessons(): Observable<SchoolLessonDTO[]> {
    const token = localStorage.getItem('token');
    return this.http.get<SchoolLessonDTO[]>(
      `${this.apiUrl}/get-school-lessons`,
      {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      }
    );
  }

  getSchoolRooms(): Observable<SchoolRoomDTO[]> {
    const token = localStorage.getItem('token');
    return this.http.get<SchoolRoomDTO[]>(`${this.apiUrl}/get-school-rooms`, {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    });
  }

  saveSchoolLesson(schoolLesson: SchoolLessonDTO): Promise<any> {
    const token = localStorage.getItem('token');
    const body = { ...schoolLesson };

    return firstValueFrom(
      this.http.put<SchoolLessonDTO>(`/school/save-lesson`, body, {
        headers: { Authorization: `Bearer ${token}` },
      })
    ).catch((err) => {
      console.error('PUT /school/save-lesson failed:', err.status, err.error);
      throw err;
    });
  }

  saveSchoolRooms(schoolRoom: SchoolRoomDTO): Promise<any> {
    const token = localStorage.getItem('token');
    const body = { ...schoolRoom };

    return firstValueFrom(
      this.http.put<SchoolRoomDTO>(`/school/save-room`, body, {
        headers: { Authorization: `Bearer ${token}` },
      })
    ).catch((err) => {
      console.error('PUT /school/save-room failed:', err.status, err.error);
      throw err;
    });
  }
}

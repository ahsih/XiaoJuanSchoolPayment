import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SchoolDTO } from '../interfaces/school.dto';
import { firstValueFrom, Observable } from 'rxjs';
import { SchoolLessonDTO } from '../interfaces/school-lessons.dto';
import { SchoolRoomDTO } from '../interfaces/school-rooms.dto';
import { SchoolFeeDTO } from '../interfaces/school-fees.dto';
import { SchoolNoteDTO } from '../interfaces/school-notes.dto';

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

  getSchoolFees(): Observable<SchoolFeeDTO[]> {
    const token = localStorage.getItem('token');
    return this.http.get<SchoolFeeDTO[]>(`${this.apiUrl}/get-school-fees`, {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    });
  }

  getSchoolNotes(): Observable<SchoolNoteDTO[]> {
    const token = localStorage.getItem('token');
    return this.http.get<SchoolNoteDTO[]>(`${this.apiUrl}/get-school-notes`, {
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

  saveSchoolFee(schoolFee: SchoolFeeDTO): Promise<any> {
    const token = localStorage.getItem('token');
    const body = { ...schoolFee };

    return firstValueFrom(
      this.http.put<SchoolFeeDTO>(`/school/save-school-fee`, body, {
        headers: { Authorization: `Bearer ${token}` },
      })
    ).catch((err) => {
      console.error(
        'PUT /school/save-school-fee failed:',
        err.status,
        err.error
      );
      throw err;
    });
  }

  saveSchoolNote(schoolNote: SchoolNoteDTO): Promise<any> {
    const token = localStorage.getItem('token');
    const body = { ...schoolNote };

    return firstValueFrom(
      this.http.put<SchoolNoteDTO>(`/school/save-school-note`, body, {
        headers: { Authorization: `Bearer ${token}` },
      })
    ).catch((err) => {
      console.error(
        'PUT /school/save-school-note failed:',
        err.status,
        err.error
      );
      throw err;
    });
  }
}

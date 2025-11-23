import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SchoolDTO } from '../interfaces/school.dto';
import { firstValueFrom, Observable } from 'rxjs';
import { SchoolLessonDTO } from '../interfaces/school-lessons.dto';
import { SchoolRoomDTO } from '../interfaces/school-rooms.dto';
import { SchoolFeeDTO } from '../interfaces/school-fees.dto';
import { SchoolNoteDTO } from '../interfaces/school-notes.dto';
import { SchoolNoteFilter } from '../interfaces/filter/school-note-filter.dto';
import { SchoolFeeFilter } from '../interfaces/filter/school-fee-filter.dto';
import { SchoolRoomFilter } from '../interfaces/filter/school-room-filter.dto';
import { SchoolFilter } from '../interfaces/filter/school-filter.dto';
import { SchoolLessonFilter } from '../interfaces/filter/school-lesson-filter.dto';

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

  getSchools(filter?: SchoolFilter): Observable<SchoolDTO[]> {
    const token = localStorage.getItem('token');
    let params = new HttpParams();
    if (filter?.name) {
      params = params.set('name', filter.name);
    }
    return this.http.get<SchoolDTO[]>(`${this.apiUrl}/get-schools`, {
      headers: {
        Authorization: 'Bearer ' + token,
      },
      params: params,
    });
  }

  getSchoolLessons(filter?: SchoolLessonFilter): Observable<SchoolLessonDTO[]> {
    const token = localStorage.getItem('token');
    let params = new HttpParams();
    if (filter?.schoolId) {
      params = params.set('schoolId', filter.schoolId);
    }
    if (filter?.minPrice) {
      params = params.set('minPrice', filter.minPrice.toString());
    }
    if (filter?.maxPrice) {
      params = params.set('maxPrice', filter.maxPrice.toString());
    }
    if (filter?.name) {
      params = params.set('name', filter.name);
    }
    if (filter?.week) {
      params = params.set('week', filter.week);
    }
    return this.http.get<SchoolLessonDTO[]>(
      `${this.apiUrl}/get-school-lessons`,
      {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      }
    );
  }

  getSchoolRooms(filter?: SchoolRoomFilter): Observable<SchoolRoomDTO[]> {
    const token = localStorage.getItem('token');
    let params = new HttpParams();
    if (filter?.schoolId) {
      params = params.set('schoolId', filter.schoolId);
    }
    if (filter?.name) {
      params = params.set('name', filter.name);
    }
    if (filter?.week) {
      params = params.set('week', filter.week);
    }
    return this.http.get<SchoolRoomDTO[]>(`${this.apiUrl}/get-school-rooms`, {
      headers: {
        Authorization: 'Bearer ' + token,
      },
      params: params,
    });
  }

  getSchoolFees(filter?: SchoolFeeFilter): Observable<SchoolFeeDTO[]> {
    const token = localStorage.getItem('token');
    let params = new HttpParams();
    if (filter?.schoolId) {
      params = params.set('schoolId', filter.schoolId);
    }
    if (filter?.minFee) {
      params = params.set('minFee', filter.minFee.toString());
    }

    if (filter?.maxFee) {
      params = params.set('maxFee', filter.maxFee.toString());
    }

    if (filter?.name) {
      params = params.set('name', filter.name);
    }

    return this.http.get<SchoolFeeDTO[]>(`${this.apiUrl}/get-school-fees`, {
      headers: {
        Authorization: 'Bearer ' + token,
      },
      params: params,
    });
  }

  getSchoolNotes(filter?: SchoolNoteFilter): Observable<SchoolNoteDTO[]> {
    const token = localStorage.getItem('token');
    let params = new HttpParams();
    if (filter?.schoolId) {
      params = params.set('schoolId', filter.schoolId);
    }
    if (filter?.note) {
      params = params.set('note', filter.note);
    }
    return this.http.get<SchoolNoteDTO[]>(`${this.apiUrl}/get-school-notes`, {
      headers: {
        Authorization: 'Bearer ' + token,
      },
      params: params,
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

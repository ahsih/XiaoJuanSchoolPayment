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
import { SchoolPhotoFilter } from '../interfaces/filter/school-photo-filter.dto';
import { SchoolPhotoDTO } from '../interfaces/school-photo.dto';

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
      params = params.set('week', filter.week.toString());
    }
    return this.http.get<SchoolLessonDTO[]>(
      `${this.apiUrl}/get-school-lessons`,
      {
        headers: {
          Authorization: 'Bearer ' + token,
        },
        params: params,
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
      params = params.set('week', filter.week.toString());
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

  getSchoolPhotos(filter?: SchoolPhotoFilter): Observable<SchoolPhotoDTO[]> {
    const token = localStorage.getItem('token');
    let params = new HttpParams();
    if (filter?.schoolId) {
      params = params.set('schoolId', filter.schoolId);
    }
    if (filter?.schoolName) {
      params = params.set('schoolName', filter.schoolName);
    }
    if (filter?.isActive !== undefined) {
      params = params.set('isActive', String(filter.isActive));
    }
    return this.http.get<SchoolPhotoDTO[]>(`${this.apiUrl}/get-school-photos`, {
      headers: {
        Authorization: 'Bearer ' + token,
      },
      params: params,
    });
  }

  uploadSchoolPhoto(
    schoolId: string,
    file: File,
    category?: string,
    caption?: string,
    altText?: string,
    displayOrder = 0,
    isActive = true
  ): Promise<SchoolPhotoDTO> {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('schoolId', schoolId);
    formData.append('file', file);
    formData.append('displayOrder', String(displayOrder));
    formData.append('isActive', String(isActive));

    if (category) {
      formData.append('category', category);
    }
    if (caption) {
      formData.append('caption', caption);
    }
    if (altText) {
      formData.append('altText', altText);
    }

    return firstValueFrom(
      this.http.post<SchoolPhotoDTO>(`${this.apiUrl}/upload-photo`, formData, {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
    );
  }

  saveSchoolPhoto(photo: SchoolPhotoDTO): Promise<any> {
    const token = localStorage.getItem('token');
    return firstValueFrom(
      this.http.put<SchoolPhotoDTO>(`${this.apiUrl}/save-photo`, photo, {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
    );
  }

  deleteSchoolPhoto(id: string): Promise<any> {
    const token = localStorage.getItem('token');
    return firstValueFrom(
      this.http.delete(`${this.apiUrl}/delete-photo/${id}`, {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
    );
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

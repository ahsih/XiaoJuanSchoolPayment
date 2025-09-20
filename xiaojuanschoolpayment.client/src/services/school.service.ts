import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { SchoolDTO } from "../interfaces/school.dto";
import { firstValueFrom, Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class SchoolService {
    private apiUrl = 'school'
    constructor(private http: HttpClient) { }
    saveSchool(school: SchoolDTO): Promise<any> {
        const token = localStorage.getItem("token");
        return firstValueFrom(this.http.put<SchoolDTO>(`${this.apiUrl}/save`, school, {
            headers: {
                "Authorization": "Bearer " + token
            }
        }));
    }

    getSchools(): Observable<SchoolDTO[]> {
        const token = localStorage.getItem("token");
        return this.http.get<SchoolDTO[]>(`${this.apiUrl}/get-schools`, {
            headers: {
                "Authorization": "Bearer " + token
            }
        });
    }
}
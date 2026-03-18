import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const BASE = 'http://localhost:8080/api/hr';

@Injectable({ providedIn: 'root' })
export class HrService {
  constructor(private http: HttpClient) {}

  getAllEmployees(): Observable<any[]> {
    return this.http.get<any[]>(`${BASE}/employees`);
  }

  getPendingEmployees(): Observable<any[]> {
    return this.http.get<any[]>(`${BASE}/employees/pending`);
  }

  getEmployeeDetail(id: number): Observable<any> {
    return this.http.get<any>(`${BASE}/employees/${id}`);
  }

  approveProfile(id: number): Observable<any> {
    return this.http.post<any>(`${BASE}/employees/${id}/approve`, {});
  }

  rejectProfile(id: number, reason: string): Observable<any> {
    return this.http.post<any>(`${BASE}/employees/${id}/reject`, { reason });
  }

  getStats(): Observable<any> {
    return this.http.get<any>(`${BASE}/stats`);
  }
}

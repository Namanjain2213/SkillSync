import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const BASE = 'http://localhost:8080/api/admin';

@Injectable({ providedIn: 'root' })
export class AdminService {
  constructor(private http: HttpClient) {}

  getStats(): Observable<any> {
    return this.http.get(`${BASE}/stats`);
  }

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${BASE}/users`);
  }

  getUsersByRole(role: string): Observable<any[]> {
    return this.http.get<any[]>(`${BASE}/users/role/${role}`);
  }

  createUser(data: any): Observable<any> {
    return this.http.post(`${BASE}/users`, data);
  }

  toggleStatus(id: number): Observable<any> {
    return this.http.patch(`${BASE}/users/${id}/toggle-status`, {});
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${BASE}/users/${id}`);
  }

  onBenchEmployee(id: number): Observable<any> {
    return this.http.post(`${BASE}/employees/${id}/on-bench`, {});
  }

  approveEmployee(id: number): Observable<any> {
    return this.http.post(`${BASE}/employees/${id}/approve`, {});
  }
}

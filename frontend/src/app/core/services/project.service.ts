import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const BASE = 'http://localhost:8080/api/pm';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  constructor(private http: HttpClient) {}

  createProject(data: any): Observable<any> {
    return this.http.post(`${BASE}/projects`, data);
  }

  getMyProjects(): Observable<any[]> {
    return this.http.get<any[]>(`${BASE}/projects`);
  }

  getProject(id: number): Observable<any> {
    return this.http.get(`${BASE}/projects/${id}`);
  }

  updateProject(id: number, data: any): Observable<any> {
    return this.http.put(`${BASE}/projects/${id}`, data);
  }

  getCandidates(projectId: number): Observable<any[]> {
    return this.http.get<any[]>(`${BASE}/projects/${projectId}/candidates`);
  }
}

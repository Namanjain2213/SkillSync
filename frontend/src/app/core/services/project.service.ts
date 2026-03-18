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

  getApplications(projectId: number): Observable<any[]> {
    return this.http.get<any[]>(`${BASE}/projects/${projectId}/applications`);
  }

  approveApplication(applicationId: number, note: string = ''): Observable<any> {
    return this.http.post(`${BASE}/applications/${applicationId}/approve`, { note });
  }

  rejectApplication(applicationId: number, note: string = ''): Observable<any> {
    return this.http.post(`${BASE}/applications/${applicationId}/reject`, { note });
  }
}

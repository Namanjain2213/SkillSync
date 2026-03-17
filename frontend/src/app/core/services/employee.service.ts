import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface EmployeeProfile {
  name: string;
  email: string;
  contactNo: string;
  address: string;
  highestQualification: string;
  skills: string[];
}

export interface McqQuestion {
  id: number;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  difficulty: string;
}

export interface McqTest {
  testId: number;
  skill: string;
  questions: McqQuestion[];
  totalQuestions: number;
  timeLimit: number;
}

export interface TestSubmission {
  testId: number;
  answers: { [questionId: number]: string };
}

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  constructor(private http: HttpClient) {}

  createProfile(profile: EmployeeProfile): Observable<any> {
    return this.http.post(`${environment.apiUrl}/employee/profile`, profile);
  }

  getProfile(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/employee/profile`);
  }

  uploadCertification(name: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('file', file);
    return this.http.post(`${environment.apiUrl}/employee/certification`, formData);
  }

  generateTest(skill: string): Observable<McqTest> {
    return this.http.get<McqTest>(`${environment.apiUrl}/employee/test/${skill}`);
  }

  submitTest(submission: TestSubmission): Observable<any> {
    return this.http.post(`${environment.apiUrl}/employee/test/submit`, submission);
  }
}
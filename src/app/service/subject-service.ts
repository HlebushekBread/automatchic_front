import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Task } from './task-service';
import { User } from './user-service';

export interface Subject {
  id: number;
  name: string;
  teacher: string;
  description: string;
  gradingType: string;
  gradingMax: number;
  grading5: number;
  grading4: number;
  grading3: number;
  gradingMin: number;
  publicity: string;
  user: User;
  task: Task[];
}

@Injectable({
  providedIn: 'root',
})
export class SubjectService {
  private http = inject(HttpClient);

  getPublicSubjects(): Observable<Subject[]> {
    return this.http.get<Subject[]>(`${environment.apiUrl}/subjects/public`);
  }

  getUserSubjects(): Observable<Subject[]> {
    return this.http.get<Subject[]>(`${environment.apiUrl}/subjects/user`);
  }
}

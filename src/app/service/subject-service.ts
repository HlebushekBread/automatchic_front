import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from './user-service';

export const GradingTypeTranslation: Record<string, string> = {
  CREDIT: 'Зачет',
  GRADE: 'Оценка',
  EXAM: 'Экзамен',
};

export const TaskTypeTranslation: Record<string, string> = {
  HOMEWORK: 'Домашняя работа',
  LABWORK: 'Лабораторная работа',
  TEST: 'Тест',
};

export const PublicityTranslation: Record<string, string> = {
  PRIVATE: 'Приватный',
  PUBLIC: 'Публичный',
};

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
  targetGrade: number;
  publicity: string;
  user: User;
  tasks: Task[];
  links: Link[];
}

export interface Task {
  id: number;
  name: string;
  type: string;
  dueDate: Date;
  maxGrade: number;
  receivedGrade: number;
  gradeWeight: number;
}

export interface Link {
  id: number;
  name: string;
  fullLink: string;
}

export interface SubjectDto {
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
  targetGrade: number;
  publicity: string;
}

@Injectable({
  providedIn: 'root',
})
export class SubjectService {
  private http = inject(HttpClient);

  getById(preview: boolean, id: number): Observable<Subject> {
    if (preview) {
      return this.http.get<Subject>(`${environment.apiUrl}/subjects/preview/${id}`);
    } else {
      return this.http.get<Subject>(`${environment.apiUrl}/subjects/view/${id}`);
    }
  }

  getPublicSubjects(): Observable<Subject[]> {
    return this.http.get<Subject[]>(`${environment.apiUrl}/subjects/public`);
  }

  getUserSubjects(): Observable<Subject[]> {
    return this.http.get<Subject[]>(`${environment.apiUrl}/subjects/user`);
  }

  saveSubject(data: SubjectDto): Observable<{ id: number }> {
    return this.http.put<{ id: number }>(`${environment.apiUrl}/subjects/save`, data);
  }
}

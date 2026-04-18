import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export const TaskTypeTranslation: Record<string, string> = {
  HOMEWORK: 'Домашняя работа',
  LABWORK: 'Лабораторная работа',
  TEST: 'Тест',

  PROJECT: 'Проект',
  PRESENTATION: 'Доклад',
  EXAM: 'Экзамен',

  PRACTICE: 'Практика',
  PARTICIPATION: 'Активность',
  ATTENDANCE: 'Посещаемость',
  OTHER: 'Другое',
};

export interface Task {
  id: number;
  name: string;
  type: string;
  dueDate: Date;
  maxGrade: number;
  receivedGrade: number;
  gradeWeight: number;
  position: number;
}

export interface FullTask {
  id: number;
  name: string;
  type: string;
  dueDate: Date;
  maxGrade: number;
  receivedGrade: number;
  gradeWeight: number;
  position: number;
  subjectId: number;
}

export interface BasicTask {
  id: number;
  name: string;
  type: string;
  dueDate: Date;
  subjectId: number;
}

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private http = inject(HttpClient);

  saveTask(data: FullTask): Observable<{ id: number }> {
    return this.http.put<{ id: number }>(`${environment.apiUrl}/tasks/save`, data);
  }

  updateTaskPositions(positions: { id: number; position: number }[]) {
    return this.http.patch(`${environment.apiUrl}/tasks/positions`, positions);
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/tasks/delete/${id}`);
  }

  getScheduled(): Observable<BasicTask[]> {
    return this.http.get<BasicTask[]>(`${environment.apiUrl}/tasks/scheduled/self`);
  }
}

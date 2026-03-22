import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Task {
  id: number;
  name: string;
  type: string;
  dueDate: Date;
  maxGrade: number;
  receivedGrade: number;
  gradeWeight: number;
}

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private http = inject(HttpClient);

  saveTask(data: Task): Observable<{ id: number }> {
    return this.http.put<{ id: number }>(`${environment.apiUrl}/subjects/save`, data);
  }
}

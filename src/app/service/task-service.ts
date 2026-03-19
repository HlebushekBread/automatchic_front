import { Injectable } from '@angular/core';

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
export class TaskService {}

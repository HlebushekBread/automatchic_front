import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ProgressView {
  id: number;
  totalScore: number;
  totalWeight: number;
  gradingType: string;
  evaluationType: string;
  targetGrade: number;
  gradingMax: number;
  grading5: number;
  grading4: number;
  grading3: number;
  gradingMin: number;
}

export interface ProgressHistoryEntry {
  id: number;
  totalScore: number;
  totalWeight: number;
  gradingType: string;
  evaluationType: string;
  targetGrade: number;
  gradingMax: number;
  grading5: number;
  grading4: number;
  grading3: number;
  gradingMin: number;
  eventType: string;
  timestamp: Date;
}

export interface ProgressChartData {
  timestampX: Date;

  currentScoreY: number;
  targetGradeY: number;
  gradingMaxY: number;
  grading5Y: number;
  grading4Y: number;
  grading3Y: number;
  gradingMinY: number;

  gradingType: string;
  evaluationType: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProgressService {
  private http = inject(HttpClient);

  getChartDataById(id: number): Observable<ProgressChartData[]> {
    return this.http.get<ProgressChartData[]>(`${environment.apiUrl}/progress/${id}/chart`);
  }
}

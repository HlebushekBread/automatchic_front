import { Component, computed, inject, input } from '@angular/core';
import {
  GradingTypeTranslation,
  PublicityTranslation,
  Subject,
  TaskTypeTranslation,
} from '../../../service/subject-service';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-subject-component',
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './user-subject-component.html',
  styleUrl: './user-subject-component.scss',
})
export class UserSubjectComponent {
  protected readonly Math = Math;

  readonly gradingTypeTranslation = GradingTypeTranslation;
  readonly taskTypeTranslation = TaskTypeTranslation;
  readonly publicityTranslation = PublicityTranslation;

  subject = input.required<Subject>();

  upcomingTasks = computed(() => {
    const now = new Date();

    return this.subject()
      .tasks.filter((task) => new Date(task.dueDate) >= now)
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 4);
  });

  getCurrentScore(): number {
    return this.subject().tasks.reduce((sum, task) => {
      return sum + (task.receivedGrade || 0);
    }, 0);
  }

  getMissingScore(): number {
    const score = this.getCurrentScore();
    const subject = this.subject();

    if (subject.targetGrade == 4) return subject.gradingMax - score;
    if (subject.targetGrade == 3) return subject.grading5 - score;
    if (subject.targetGrade == 2) return subject.grading4 - score;
    if (subject.targetGrade == 1) return subject.grading3 - score;
    if (subject.targetGrade == 0) return subject.gradingMin - score;
    return 0;
  }

  getCurrentGrade(): number {
    const score = this.getCurrentScore();
    const subject = this.subject();

    if (score >= subject.gradingMax) return 6;
    if (score >= subject.grading5) return 5;
    if (score >= subject.grading4) return 4;
    if (score >= subject.grading3) return 3;
    if (score >= subject.gradingMin) return 2;
    if (score >= 0) return 1;
    return 0;
  }

  readonly gradeInfo: Record<number, { translation: string; color: string; text: string }> = {
    6: { translation: '+', color: 'var(--grade-max)', text: 'var(--text-light)' },
    5: { translation: '5', color: 'var(--grade-5)', text: 'var(--text-dark)' },
    4: { translation: '4', color: 'var(--grade-4)', text: 'var(--text-light)' },
    3: { translation: '3', color: 'var(--grade-3)', text: 'var(--text-dark)' },
    2: { translation: '2', color: 'var(--grade-min)', text: 'var(--text-light)' },
    1: { translation: '-', color: 'var(--grade-less)', text: 'var(--text-light)' },
    0: { translation: '-', color: 'var(--grade-less)', text: 'var(--text-light)' },
  };
}

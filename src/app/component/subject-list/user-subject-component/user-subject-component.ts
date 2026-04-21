import { Component, computed, input } from '@angular/core';
import {
  FullSubject,
  GradeInfo,
  GradingTypeTranslation,
  PublicityTranslation,
} from '../../../service/subject-service';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Task, TaskTypeTranslation } from '../../../service/task-service';

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

  readonly gradeInfo = GradeInfo;

  subject = input.required<FullSubject>();

  upcomingTasks = computed(() => {
    const now = new Date();

    return this.subject()
      .tasks.filter((task: Task) => new Date(task.dueDate) >= now)
      .sort((a: Task, b: Task) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 4);
  });

  getCurrentScore(): number {
    const total = this.subject().tasks.reduce((sum, task) => {
      return sum + (Number(task.receivedGrade) || 0) * Number(task.gradeWeight || 0);
    }, 0);

    let score = 0;

    if (this.subject().evaluationType !== 'AVERAGE') {
      score = total;
    } else {
      const weights = this.subject().tasks.reduce((sum, task) => {
        return sum + (task.receivedGrade * task.gradeWeight > 0 ? Number(task.gradeWeight) : 0);
      }, 0);
      score = weights !== 0 ? total / weights : 0;
    }

    return Number(score.toFixed(2));
  }

  getMissingScore(): string {
    const v = this.subject();
    if (!v) return '0';

    const gradings = [
      Number(v.gradingMin) || 0,
      Number(v.grading3) || 0,
      Number(v.grading4) || 0,
      Number(v.grading5) || 0,
      Number(v.gradingMax) || 0,
    ];

    const targetValue = gradings[v.targetGrade] || 0;
    return Math.max(0, targetValue - this.getCurrentScore()).toFixed(2);
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
}

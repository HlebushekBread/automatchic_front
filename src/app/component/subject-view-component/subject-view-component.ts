import { Component, inject, signal } from '@angular/core';
import {
  GradingTypeTranslation,
  PublicityTranslation,
  Subject,
  SubjectService,
  TaskTypeTranslation,
} from '../../service/subject-service';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { AuthService } from '../../service/auth-service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-subject-view-component',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './subject-view-component.html',
  styleUrl: './subject-view-component.scss',
})
export class SubjectViewComponent {
  private authService = inject(AuthService);
  private subjectService = inject(SubjectService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);

  readonly gradingTypeTranslation = GradingTypeTranslation;
  gradingTypes = Object.keys(this.gradingTypeTranslation);

  readonly taskTypeTranslation = TaskTypeTranslation;
  taskTypes = Object.keys(this.taskTypeTranslation);

  readonly publicityTranslation = PublicityTranslation;
  publicities = Object.keys(this.publicityTranslation);

  errorMessage = signal('');

  ngOnInit() {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const id = Number(params.get('id'));
          return this.subjectService.getById(false, id);
        }),
      )
      .subscribe({
        next: (subject) => {
          if (!subject) {
            this.errorMessage.set('Ошибка получения.');
          } else {
            this.errorMessage.set('');
            this.patchSubjectForm(subject);
          }
        },
        error: (err: HttpErrorResponse) =>
          this.errorMessage.set(err.error?.message || 'Ошибка доступа'),
      });
  }

  subjectForm: FormGroup = this.formBuilder.group({
    id: [null, [Validators.required]],
    name: [null, [Validators.required]],
    teacher: [null],
    description: [null],
    gradingType: [null, [Validators.required]],
    gradingMax: [null],
    grading5: [null],
    grading4: [null],
    grading3: [null],
    gradingMin: [null],
    targetGrade: [null, [Validators.required]],
    publicity: [null, [Validators.required]],
  });

  private patchSubjectForm(subject: Subject) {
    this.subjectForm.patchValue({
      id: subject.id,
      name: subject.name,
      teacher: subject.teacher,
      description: subject.description,
      gradingType: subject.gradingType,
      gradingMax: subject.gradingMax,
      grading5: subject.grading5,
      grading4: subject.grading4,
      grading3: subject.grading3,
      gradingMin: subject.gradingMin,
      targetGrade: subject.targetGrade,
      publicity: subject.publicity,
    });
  }

  switchPublicity(value: string) {
    this.subjectForm.patchValue({ publicity: value });
  }
}

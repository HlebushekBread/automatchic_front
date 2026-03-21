import { Component, inject, signal } from '@angular/core';
import {
  GradingTypeTranslation,
  PublicityTranslation,
  Subject,
  SubjectDto,
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
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
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

  readonly gradeInfo: Record<number, { translation: string; color: string; text: string }> = {
    6: { translation: 'max', color: 'var(--grade-max)', text: 'var(--text-light)' },
    5: { translation: '5', color: 'var(--grade-5)', text: 'var(--text-dark)' },
    4: { translation: '4', color: 'var(--grade-4)', text: 'var(--text-light)' },
    3: { translation: '3', color: 'var(--grade-3)', text: 'var(--text-dark)' },
    2: { translation: 'min', color: 'var(--grade-min)', text: 'var(--text-light)' },
    1: { translation: '-', color: 'var(--grade-less)', text: 'var(--text-light)' },
    0: { translation: '-', color: 'var(--grade-less)', text: 'var(--text-light)' },
  };

  readonly gradeFields = [
    { control: 'gradingMax', grade: 4 },
    { control: 'grading5', grade: 3 },
    { control: 'grading4', grade: 2, hideForCredit: true },
    { control: 'grading3', grade: 1, hideForCredit: true },
    { control: 'gradingMin', grade: 0 },
  ];

  errorMessage = signal('');

  ngOnInit() {
    this.subjectForm.disable();
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
            this.adjustFields();
          }
        },
        error: (err: HttpErrorResponse) =>
          this.errorMessage.set(err.error?.message || 'Ошибка доступа'),
      });
  }

  subjectForm!: FormGroup;

  constructor() {
    this.subjectForm = this.formBuilder.group(
      {
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
      },
      {
        validators: [this.gradingValidator.bind(this)],
      },
    );
  }

  private gradingValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    const v = group.value;
    const checks = [
      { upper: v.gradingMax, lower: v.grading5, key: '200_lt_max' },
      { upper: v.gradingMax, lower: v.grading5, key: 'max_lt_5' },
      { upper: v.grading5, lower: v.grading4, key: '5_lt_4' },
      { upper: v.grading4, lower: v.grading3, key: '4_lt_3' },
      { upper: v.grading3, lower: v.gradingMin, key: '3_lt_min' },
      { upper: v.gradingMin, lower: 0, key: 'min_lt_0' },
    ];

    const errors: ValidationErrors = {};
    let hasError = false;

    for (const check of checks) {
      if (Number(check.upper) < Number(check.lower)) {
        errors[check.key] = true;
        hasError = true;
      }
    }

    return hasError ? { gradingChain: errors } : null;
  };

  private patchSubjectForm(subject: Subject | SubjectDto) {
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

  getCurrentSubject(): SubjectDto {
    return this.subjectForm.getRawValue();
  }

  preveousSubject = signal({
    id: 0,
    name: '',
    teacher: '',
    description: '',
    gradingType: '',
    gradingMax: 0,
    grading5: 0,
    grading4: 0,
    grading3: 0,
    gradingMin: 0,
    targetGrade: 0,
    publicity: '',
  });

  isEdit = signal(false);

  onEdit() {
    this.isEdit.set(true);
    this.subjectForm.enable();
    this.preveousSubject.set(this.getCurrentSubject());
  }

  onSubmit() {
    this.adjustFields();
    if (this.subjectForm.invalid) {
      console.log(this.subjectForm.errors);
      this.subjectForm.markAllAsTouched();
      return;
    }
    this.isEdit.set(false);
    this.patchSubjectForm(this.getCurrentSubject());
    this.subjectForm.disable();
    this.subjectService.saveSubject(this.getCurrentSubject()).subscribe({
      next: () => {},
      error: () => {},
    });
  }

  onCancel() {
    this.isEdit.set(false);
    this.patchSubjectForm(this.preveousSubject());
    this.adjustFields();
    this.subjectForm.disable();
  }

  isDeleteModalOpen = signal(false);

  onDelete() {
    this.isEdit.set(false);
    this.subjectForm.disable();
    this.subjectService.deleteSubject(this.getCurrentSubject().id).subscribe({
      next: () => {
        this.isDeleteModalOpen.set(false);
        this.router.navigate(['/subjects/view']);
      },
      error: () => {},
    });
  }

  switchPublicity(value: string) {
    this.subjectForm.patchValue({ publicity: value });
  }

  isGradingTypeCredit = signal(false);

  adjustFields() {
    const rawValues = this.subjectForm.getRawValue();
    const isCredit = rawValues.gradingType === 'CREDIT';

    this.isGradingTypeCredit.set(isCredit);

    let gradingMax = Math.max(0, Number(rawValues.gradingMax || 0));
    let grading5 = Math.max(0, Number(rawValues.grading5 || 0));
    let grading4 = Math.max(0, Number(rawValues.grading4 || 0));
    let grading3 = Math.max(0, Number(rawValues.grading3 || 0));
    let gradingMin = Math.max(0, Number(rawValues.gradingMin || 0));

    const updates: any = {
      gradingMax: gradingMax,
      grading5: grading5,
      grading4: grading4,
      grading3: grading3,
      gradingMin: gradingMin,
    };

    if (isCredit) {
      if (rawValues.targetGrade === 1 || rawValues.targetGrade === 2) {
        updates.targetGrade = 3;
      }
      updates.grading4 = updates.grading5;
      updates.grading3 = updates.grading5;
    }

    this.subjectForm.patchValue(updates, { emitEvent: false });
  }
}

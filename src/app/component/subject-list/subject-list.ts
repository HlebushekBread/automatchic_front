import { Component, inject } from '@angular/core';
import { SubjectService } from '../../service/subject-service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-subject-list',
  imports: [],
  templateUrl: './subject-list.html',
  styleUrl: './subject-list.scss',
})
export class SubjectList {
  private subjectService = inject(SubjectService);

  subjectList = toSignal(this.subjectService.getUserSubjects(), { initialValue: [] });
}

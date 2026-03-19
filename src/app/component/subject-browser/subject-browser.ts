import { Component, inject } from '@angular/core';
import { SubjectService } from '../../service/subject-service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-subject-browser',
  imports: [],
  templateUrl: './subject-browser.html',
  styleUrl: './subject-browser.scss',
})
export class SubjectBrowser {
  private subjectService = inject(SubjectService);

  subjectList = toSignal(this.subjectService.getPublicSubjects(), { initialValue: [] });
}

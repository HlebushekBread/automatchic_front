import { Component, computed, inject, signal } from '@angular/core';
import { GradingTypeTranslation, SubjectService } from '../../service/subject-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { BrowserSubjectComponent } from './browser-subject-component/browser-subject-component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-subject-browser',
  imports: [BrowserSubjectComponent, FormsModule],
  templateUrl: './subject-browser.html',
  styleUrl: './subject-browser.scss',
})
export class SubjectBrowser {
  private subjectService = inject(SubjectService);

  subjectList = toSignal(this.subjectService.getPublicSubjects(), { initialValue: [] });

  gradingTypeTranslation = GradingTypeTranslation;
  gradingTypes = Object.keys(this.gradingTypeTranslation);

  searchQuery = signal('');
  selectedType = signal('all');

  getAbbreviation(text: string): string {
    if (!text) return '';

    return text
      .split(' ')
      .filter((word) => word.length > 0)
      .map((word) => word[0])
      .join('')
      .toUpperCase();
  }

  filteredSubjects = computed(() => {
    const query = this.searchQuery()
      .replace(/[\.\s\-]/g, '')
      .toLowerCase();
    const type = this.selectedType();

    return this.subjectList().filter((subject) => {
      const matchesSearch =
        subject.name.toLowerCase().includes(query) ||
        this.getAbbreviation(subject.name).toLowerCase().includes(query) ||
        subject.teacher.toLowerCase().includes(query) ||
        this.getAbbreviation(subject.teacher).toLowerCase().includes(query) ||
        subject.user.fullName.toLowerCase().includes(query) ||
        this.getAbbreviation(subject.user.fullName).toLowerCase().includes(query) ||
        subject.user.username.toLowerCase().includes(query) ||
        subject.user.group
          .replace(/[\.\s\-]/g, '')
          .toLowerCase()
          .includes(query);
      const matchesType = type === 'all' || subject.gradingType === type;
      return matchesSearch && matchesType;
    });
  });
}

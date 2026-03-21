import { Component, computed, inject, signal } from '@angular/core';
import {
  GradingTypeTranslation,
  PublicityTranslation,
  SubjectService,
} from '../../service/subject-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { UserSubjectComponent } from './user-subject-component/user-subject-component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-subject-list',
  imports: [UserSubjectComponent, FormsModule],
  templateUrl: './subject-list.html',
  styleUrl: './subject-list.scss',
})
export class SubjectList {
  private subjectService = inject(SubjectService);

  subjectList = toSignal(this.subjectService.getUserSubjects(), { initialValue: [] });

  gradingTypeTranslation = GradingTypeTranslation;
  gradingTypes = Object.keys(this.gradingTypeTranslation);
  publicityTranslation = PublicityTranslation;
  publicities = Object.keys(this.publicityTranslation);

  searchQuery = signal('');
  selectedType = signal('all');
  selectedPublicity = signal('all');

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
    const publicity = this.selectedPublicity();

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
      const matchesPublicity = publicity === 'all' || subject.publicity === publicity;
      return matchesSearch && matchesType && matchesPublicity;
    });
  });
}

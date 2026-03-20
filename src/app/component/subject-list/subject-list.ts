import { Component, computed, inject, signal } from '@angular/core';
import { GradingTypeTranslation, SubjectService } from '../../service/subject-service';
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
    const query = this.searchQuery().toLowerCase();
    const type = this.selectedType();

    return this.subjectList().filter((subject) => {
      const matchesSearch =
        subject.name.toLowerCase().includes(query) ||
        this.getAbbreviation(subject.name).toLowerCase().includes(query) ||
        subject.teacher.toLowerCase().includes(query) ||
        this.getAbbreviation(subject.teacher)
          .toLowerCase()
          .includes(query.replace(/[\.\s]/g, '')) ||
        subject.user.fullName.toLowerCase().includes(query) ||
        this.getAbbreviation(subject.user.fullName)
          .toLowerCase()
          .includes(query.replace(/[\.\s]/g, '')) ||
        subject.user.username.toLowerCase().includes(query) ||
        subject.user.group.toLowerCase().includes(query);
      const matchesType = type === 'all' || subject.gradingType === type;
      return matchesSearch && matchesType;
    });
  });
}

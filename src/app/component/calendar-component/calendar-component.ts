import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { BasicTask, TaskService } from '../../service/task-service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-calendar-component',
  imports: [RouterLink],
  templateUrl: './calendar-component.html',
  styleUrl: './calendar-component.scss',
})
export class CalendarComponent implements OnInit {
  private taskService = inject(TaskService);

  today = signal(new Date().toLocaleDateString('en-CA').split('T')[0]);
  tasks = signal<BasicTask[]>([]);
  selectedDate = signal(new Date());

  monthLabel = computed(() => {
    const date = this.selectedDate();
    const label = date.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
    return label.charAt(0).toUpperCase() + label.slice(1);
  });

  changeMonth(offset: number) {
    this.selectedDate.update((current) => {
      return new Date(current.getFullYear(), current.getMonth() + offset, 1, 12, 0, 0);
    });
  }

  tasksByDate = computed(() => {
    return this.tasks().reduce((acc: any, task) => {
      const dateKey = task.dueDate.toString().split('T')[0];
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(task);
      return acc;
    }, {});
  });

  currentMonthDays = computed(() => {
    const year = this.selectedDate().getFullYear();
    const month = this.selectedDate().getMonth();

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    return Array.from({ length: daysInMonth }, (_, i) => {
      const date = new Date(year, month, i + 1);
      const iso = date.toLocaleDateString('en-CA');
      const weekdayRaw = date.toLocaleDateString('ru-RU', { weekday: 'short' });
      const weekday = weekdayRaw.charAt(0).toUpperCase() + weekdayRaw.slice(1);
      let gridColumn = 0;
      if (i === 0) {
        const dayOfWeek = date.getDay();
        gridColumn = dayOfWeek === 0 ? 7 : dayOfWeek;
      }
      return {
        date,
        iso,
        dayNumber: i + 1,
        weekday,
        gridColumn,
      };
    });
  });

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getScheduled().subscribe({
      next: (response) => this.tasks.set(response),
      error: (error) => console.error('Ошибка загрузки задач', error),
    });
  }
}

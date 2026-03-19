import { Routes } from '@angular/router';
import { ProfileComponent } from './component/profile-component/profile-component';
import { SubjectList } from './component/subject-list/subject-list';
import { authGuard } from './util/auth.guard';
import { SubjectBrowser } from './component/subject-browser/subject-browser';

export const routes: Routes = [
  {
    path: 'profile',
    pathMatch: 'full',
    component: ProfileComponent,
  },
  {
    path: 'subjects/browse',
    pathMatch: 'full',
    component: SubjectBrowser,
  },
  {
    path: 'subjects/my',
    pathMatch: 'full',
    component: SubjectList,
    canActivate: [authGuard],
  },
];

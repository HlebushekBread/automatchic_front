import { Routes } from '@angular/router';
import { ProfileComponent } from './component/profile-component/profile-component';
import { SubjectList } from './component/subject-list/subject-list';
import { authGuard } from './util/auth.guard';
import { SubjectBrowser } from './component/subject-browser/subject-browser';
import { SubjectViewComponent } from './component/subject-view-component/subject-view-component';

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
    path: 'subjects/view',
    pathMatch: 'full',
    component: SubjectList,
    canActivate: [authGuard],
  },
  {
    path: 'subjects/view/:id',
    pathMatch: 'full',
    component: SubjectViewComponent,
    canActivate: [authGuard],
  },
];

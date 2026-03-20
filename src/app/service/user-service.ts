import { Injectable } from '@angular/core';

export const RoleTranslation: Record<string, string> = {
  STUDENT: 'Студент',
};

export interface User {
  id: number;
  username: string;
  fullName: string;
  group: string;
  role: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {}

import { Injectable } from '@angular/core';

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

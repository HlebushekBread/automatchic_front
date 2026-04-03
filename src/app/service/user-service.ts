import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

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
export class UserService {
  private http = inject(HttpClient);

  saveUser(data: { fullName: string; group: string }): Observable<{ token: string }> {
    return this.http.patch<{ token: string }>(`${environment.apiUrl}/users/update/self`, data);
  }
}

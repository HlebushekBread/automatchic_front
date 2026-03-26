import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../service/auth-service';
import { AuthForm } from './auth-form/auth-form';

@Component({
  selector: 'app-profile-component',
  imports: [AuthForm],
  templateUrl: './profile-component.html',
  styleUrl: './profile-component.scss',
})
export class ProfileComponent {
  private authService = inject(AuthService);

  readonly isAuthenticated = signal(this.authService.isAuthenticated());
  readonly tokenUsername = signal(this.authService.getTokenUsername());
  readonly tokenFullName = signal(this.authService.getTokenFullName());
  readonly tokenGroup = signal(this.authService.getTokenGroup());

  username = signal(this.authService.getTokenUsername());

  logout() {
    console.log('Выход...');

    this.authService.logout();
    window.location.reload();
  }
}

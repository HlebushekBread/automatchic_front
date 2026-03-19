import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../service/auth-service';
import { LoginForm } from './login-form/login-form';

@Component({
  selector: 'app-profile-component',
  imports: [LoginForm],
  templateUrl: './profile-component.html',
  styleUrl: './profile-component.scss',
})
export class ProfileComponent {
  private authService = inject(AuthService);

  readonly isAuthenticated = signal(this.authService.isAuthenticated());
  readonly tokenUsername = signal(this.authService.getTokenUsername());
  readonly tokenFullName = signal(this.authService.getTokenFullName());
  readonly tokenGroup = signal(this.authService.getTokenGroup());

  logout() {
    console.log('Выход...');

    this.authService.logout();
    window.location.reload();
  }
}

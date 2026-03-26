import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../service/auth-service';
import { CommonModule } from '@angular/common';
import { take } from 'rxjs';

@Component({
  selector: 'app-auth-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './auth-form.html',
  styleUrl: './auth-form.scss',
})
export class AuthForm {
  private authService = inject(AuthService);

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    fullName: new FormControl(''),
    group: new FormControl(''),
  });

  error = signal('');
  isRegisterMode = signal(false);

  onLogin() {
    if (this.loginForm.valid) {
      this.authService
        .login({
          username: this.loginForm.value.username || '',
          password: this.loginForm.value.password || '',
        })
        .pipe(take(1))
        .subscribe({
          next: () => {
            this.error.set('');
            window.location.reload();
          },
          error: () => {
            this.error.set('Неверные данные');
          },
        });
    }
  }

  onRegister() {
    if (this.loginForm.valid) {
      this.authService
        .register({
          username: this.loginForm.value.username || '',
          password: this.loginForm.value.password || '',
          fullName: this.loginForm.value.fullName || '',
          group: this.loginForm.value.group || '',
        })
        .pipe(take(1))
        .subscribe({
          next: () => {
            this.error.set('');
            window.location.reload();
          },
          error: () => {
            this.error.set('Пользователь существует');
          },
        });
    }
  }

  text = signal(this.authService.getTokenAuthorities());
}

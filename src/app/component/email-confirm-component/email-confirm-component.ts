import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../service/auth-service';

@Component({
  selector: 'app-email-confirm-component',
  imports: [],
  templateUrl: './email-confirm-component.html',
  styleUrl: './email-confirm-component.scss',
})
export class EmailConfirmComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (token) {
      this.authService.confirm(token).subscribe({
        next: () => {
          alert('Почта успешно подтверждена!');
          this.router.navigate(['/profile']);
        },
        error: (err) => {
          console.error('Ошибка подтверждения', err);
          alert('Ссылка недействительна или срок действия истек.');
          this.router.navigate(['/profile']);
        },
      });
    } else {
      console.error('Токен отсутствует в URL');
      this.router.navigate(['/profile']);
    }
  }
}

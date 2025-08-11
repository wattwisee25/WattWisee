import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
    imports: [FormsModule],
  templateUrl: './reset-password.html',
    styleUrls: ['./reset-password.css']
})
export class ResetPasswordComponent {
  password = '';
  token = '';
  message = '';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {
    this.token = this.route.snapshot.paramMap.get('token') || '';
  }

  onSubmit() {
    this.authService.resetPassword(this.token, this.password).subscribe({
      next: () => {
        this.message = 'Password updated successfully!';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: () => {
        this.message = 'Reset link invalid or expired.';
      }
    });
  }
}

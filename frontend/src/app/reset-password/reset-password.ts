// reset-password.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  imports: [CommonModule, FormsModule],
  templateUrl: './reset-password.html',
  styleUrls: ['./reset-password.css']
})
export class ResetPasswordComponent implements OnInit {
  token = '';
  newPassword = '';
  confirmPassword = '';
  message = '';
  error = '';
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Legge il token dai parametri URL
    this.route.params.subscribe(params => {
      this.token = params['token'];
      console.log('[RESET-PASSWORD] Token received:', this.token);
      if (!this.token) {
        this.error = 'Reset token not valid';
        console.error('[RESET-PASSWORD] No token found in URL');
      }
    });
  }

  onSubmit() {
    if (this.newPassword !== this.confirmPassword) {
      this.error = 'Passwords do not match';
      this.message = '';
      return;
    }

    if (this.newPassword.length < 2) {
      this.error = 'Password must be at least 2 characters long';
      this.message = '';
      return;
    }

    this.loading = true;
    this.error = '';
    this.message = '';

    this.authService.resetPassword(this.token, this.newPassword).subscribe(
      () => {
        this.message = 'Password reset successfully. Redirecting to login...';
        this.error = '';
        this.loading = false;
        setTimeout(() => this.router.navigate(['/login']), 3000);
      },
      (err) => {
        this.error = err.error?.message || 'An error occurred while resetting the password';
        this.message = '';
        this.loading = false;
      }
    );
  }
}

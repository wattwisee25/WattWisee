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

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
  }

  onSubmit() {
    if (this.newPassword !== this.confirmPassword) {
      this.error = 'Le password non coincidono';
      return;
    }

    this.authService.resetPassword(this.token, this.newPassword).subscribe(
      () => {
        this.message = 'Password resettata con successo!';
        this.error = '';
        setTimeout(() => this.router.navigate(['/login']), 3000);
      },
      (err) => {
        this.error = err.error.message || 'Si è verificato un errore';
        this.message = '';
      }
    );
  }
}
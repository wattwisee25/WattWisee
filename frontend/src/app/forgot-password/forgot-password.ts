// forgot-password.component.ts
import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  imports: [CommonModule, FormsModule],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.css']
})
export class ForgotPasswordComponent {
  email = '';
  message = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.forgotPassword(this.email).subscribe(
      () => {
        this.message = 'Email di reset inviata. Controlla la tua casella di posta.';
        this.error = '';
      },
      (err) => {
        this.error = err.error.message || 'Si è verificato un errore';
        this.message = '';
      }
    );
  }
}
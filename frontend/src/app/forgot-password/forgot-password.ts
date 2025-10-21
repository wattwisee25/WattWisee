// forgot-password.component.ts
import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BackButton } from "../back-button/back-button";

@Component({
  selector: 'app-forgot-password',
  imports: [CommonModule, FormsModule, BackButton],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.css']
})
export class ForgotPassword {
  email = '';
  message = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.forgotPassword(this.email).subscribe(
      () => {
        this.message = 'Reset email sent. Check your mailbox.';
        this.error = '';
      },
      (err) => {
        this.error = err.error.message || 'An error occured.';
        this.message = '';
      }
    );
  }
}
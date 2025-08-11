import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  imports: [CommonModule, FormsModule],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.css']
})
export class ForgotPasswordComponent {
  email: string = '';
  message: string = '';

  constructor(private http: HttpClient) {}

  onSubmit() {
    if (!this.email) {
      this.message = 'Email is required';
      return;
    }

    this.http.post<{ message: string }>(
  'http://localhost:3000/api/users/forgot-password',
  { email: this.email },
  { withCredentials: true } // se usi cookie, altrimenti puoi togliere
)
.subscribe({
  next: (res) => {
    this.message = res.message;
  },
  error: (err) => {
    this.message = err.error?.message || 'An error occurred';
  }
});

  }
}


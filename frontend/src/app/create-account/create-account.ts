import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-create-account',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './create-account.html',
  styleUrls: ['./create-account.css']
})
export class CreateAccountComponent {
  constructor(private http: HttpClient) {}

  user = {
    contact_name: '',
    company_name: '',
    register_as: '',
    SEAI_number: '',
    phone: '',
    email: '',
    password: '',
    permission_contact: ''
  };

  repeat_password = ''; // 🔹 variabile separata SOLO per il controllo
  passwordError = ''; // 🔹 per mostrare errori di password

  showPassword = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (!this.user.contact_name || !this.user.email || !this.user.password) return;

    if (this.user.password !== this.repeat_password) {
    this.passwordError = '⚠️ The passwords do not match.';
    return;
  } else {
    this.passwordError = '';
  }

    // 🔹 Costruisco l'oggetto da inviare senza repeat_password
    const payload = { ...this.user };

    this.http.post('http://localhost:3000/api/users', payload).subscribe({
      next: (res: any) => {
        console.log('Successful registration:', res);
        alert(res.message || 'Registration successful!');
      },
      error: (err) => {
        console.error('Recording error:', err);
        alert(err.error?.error || 'Error during registration!');
      }
    });
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BackButton } from '../back-button/back-button';
import { environment } from '../../environments/environment.prod';

@Component({
  selector: 'app-create-account',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, BackButton],
  templateUrl: './create-account.html',
  styleUrls: ['./create-account.css']
})
export class CreateAccount {
  constructor(private http: HttpClient, private router: Router) {}

  user = {
    contact_name: '',
    company_name: '',
    register_as: '',
    SEAI_number: '',
    phone: '',
    email: '',
    password: '',
    permission_contact: false
  };

  repeat_password = ''; //variabile separata SOLO per il controllo
  passwordError = ''; //per mostrare errori di password

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

    //Costruisco l'oggetto da inviare senza repeat_password
    const payload = { ...this.user };

    this.http.post(`${environment.apiUrl}/api/users`, payload).subscribe({
      next: (res: any) => {
        console.log('Successful registration:', res);
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Recording error:', err);
        alert(err.error?.error || 'Error during registration!');
      }
    });
  }
}

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent implements OnInit {
  showPassword = false;

  email = '';
  password = '';
  remember = false;
  loginError = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    // Se c'è un valore salvato, precompila l'email
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      this.email = savedEmail;
      this.remember = true;
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    this.loginError = '';

    const payload = {
      email: this.email,
      password: this.password
    };

    this.http.post('http://localhost:3000/api/users/login', payload)
      .subscribe({
        next: () => {
          if (this.remember) {
            localStorage.setItem('rememberedEmail', this.email);
          } else {
            localStorage.removeItem('rememberedEmail');
          }
          this.router.navigate(['/glossary']);
        },
        error: (err) => {
          this.loginError = 'Incorrect email or password';
          console.error(err);
        }
      });
  }
}

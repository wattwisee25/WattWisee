import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { BackButton } from "../back-button/back-button";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, BackButton],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login implements OnInit {
  email = '';
  password = '';
  remember = false;
  showPassword = false;
  loginError = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Ripristina email salvata se "remember me" era selezionato
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      this.email = savedEmail;
      this.remember = true;
    }

    // Verifica se l’utente è già loggato
    this.authService.checkAuthStatus().subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.router.navigate(['/home']);
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    this.loginError = '';

    this.authService.login(this.email, this.password, this.remember).subscribe({
      next: (res: any) => {
        // Salva email se "remember me"
        if (this.remember) {
          localStorage.setItem('rememberedEmail', this.email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }

        // Salva userId ricevuto dal backend
        localStorage.setItem('userId', res.userId);

        // Redirect verso OTP
        this.router.navigate(['/otp'], { queryParams: { email: this.email } });
      },
      error: (err) => {
        console.error(err);
        this.loginError = err.error?.message || 'Incorrect email or password';
      }
    });
  }

}

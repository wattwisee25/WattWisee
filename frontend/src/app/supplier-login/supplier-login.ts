import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-supplier-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './supplier-login.html',
  styleUrl: './supplier-login.css'
})
export class SupplierLoginComponent implements OnInit {
  showPassword = false;

  email = '';
  password = '';
  remember = false;
  loginError = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      this.email = savedEmail;
      this.remember = true;
    }

    this.authService.checkAuthStatus().subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.router.navigate(['/action-plan-suppler']);
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
  this.loginError = '';

  this.authService.supplierLogin(this.email, this.password, this.remember).subscribe({
    next: () => {
      if (this.remember) {
        localStorage.setItem('rememberedEmail', this.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
      this.router.navigate(['/supplier-otp'], { queryParams: { email: this.email } });
    },
    error: (err) => {
      this.loginError = 'Incorrect email or password (Supplier)';
      console.error(err);
    }
  });
}

}

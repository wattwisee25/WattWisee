import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  imports: [CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  showPassword: boolean = false;
  password: string = '';

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-sign-in',
  imports: [CommonModule],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.css'
})
export class SignInComponent {
  showPassword: boolean = false;
  password: string = '';

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}

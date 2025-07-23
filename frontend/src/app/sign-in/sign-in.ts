import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User, UserService } from '../user.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sign-in.html',
  styleUrls: ['./sign-in.css']
})
export class SignInComponent {
  showPassword: boolean = false;
  
  user: User = {
    contact_name: '',
    company_name: '',
    register_as: '',
    SEAI_number: '',
    phone: '',
    email: '',
    password: '',
    permission_contact: false
  };

  constructor(private userService: UserService) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    this.userService.registerUser(this.user).subscribe({
      next: (res) => {
        alert('User registered successfully!');
        // qui puoi resettare il form o fare redirect
      },
      error: (err) => {
        alert('Error registering user');
        console.error(err);
      }
    });
  }
}


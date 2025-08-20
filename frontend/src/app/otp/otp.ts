// otp.component.ts
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-otp',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './otp.html',
  styleUrls: ['./otp.css']
})
export class OtpComponent {
  email: string = '';
  otp: string = '';

  constructor(private route: ActivatedRoute, private auth: AuthService, private router: Router) {
    this.route.queryParams.subscribe(params => this.email = params['email']);
  }

  verifyOtp() {
    this.auth.verifyOtp(this.email, this.otp).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        this.router.navigate(['/profile']);
      },
      error: (err) => alert(err.error.message)
    });
  }
}

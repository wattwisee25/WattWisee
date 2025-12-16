// otp.component.ts
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BackButton } from "../back-button/back-button";

@Component({
  selector: 'app-otp',
  imports: [CommonModule, FormsModule, BackButton],
  standalone: true,
  templateUrl: './otp.html',
  styleUrls: ['./otp.css']
})
export class Otp {
  email: string = '';
  otp: string = '';

  constructor(private route: ActivatedRoute, private auth: AuthService, private router: Router) {
    this.route.queryParams.subscribe(params => this.email = params['email']);
  }

verifyOtp() {
  this.auth.verifyOtp(this.email, this.otp).subscribe({
    next: (res) => {
      const firstLogin = res.firstLogin;

      if (firstLogin) {
        this.router.navigate(['/welcome']);
      } else {
        this.router.navigate(['/home']);
      }
    },
    error: (err) => {
      alert(err.error.message || 'Invalid or expired OTP');
      console.error('Verify OTP error:', err);
    }
  });
}


}

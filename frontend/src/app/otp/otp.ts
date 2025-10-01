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
    // After receiving the token and the flag from the backend
    const token = res.token;
    const firstLogin = res.firstLogin;

    // Save the token in a cookie
    document.cookie = `token=${token}; path=/; samesite=strict;`;
    // Add "secure" only if you are using HTTPS in production
    // document.cookie = `token=${token}; path=/; samesite=strict; secure`;

    // Redirect depending on whether this is the first login
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

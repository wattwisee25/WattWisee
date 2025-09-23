import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-supplier-otp',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './supplier-otp.html',
  styleUrl: './supplier-otp.css'
})
export class SupplierOtpComponent {
  email: string = '';
  otp: string = '';

  constructor(private route: ActivatedRoute, private auth: AuthService, private router: Router) {
    this.route.queryParams.subscribe(params => this.email = params['email']);
  }

  verifyOtp() {
    this.auth.verifyOtp(this.email, this.otp).subscribe({
      next: (res) => {
// Dopo aver ricevuto il token dal backend
const token = res.token; // oppure res['token']

// Salvo il token in cookie
document.cookie = `token=${token}; path=/; samesite=strict;`;
// secure va messo solo se sei in HTTPS

        this.router.navigate(['/action-plan-supplier']);
      },
      error: (err) => alert(err.error.message)
    });
  }
}

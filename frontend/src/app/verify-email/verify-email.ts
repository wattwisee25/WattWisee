import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-verify-email',
  imports: [FormsModule, ReactiveFormsModule],
    standalone: true,
  templateUrl: './verify-email.html',
  styleUrls: ['./verify-email.css']
})
export class VerifyEmail implements OnInit {
  verifyForm: FormGroup;
  userId: string = '';
  loading = false;
  error = '';
  success = '';
  resendLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private fb: FormBuilder
  ) {
    this.verifyForm = this.fb.group({
      code: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
    });
  }

  ngOnInit(): void {
    this.userId = this.route.snapshot.queryParams['userId'] || '';
    if (!this.userId) {
      this.router.navigate(['/login']);
    }
  }

  onSubmit() {
    if (this.verifyForm.invalid) return;

    this.loading = true;
    this.error = '';
    this.success = '';

    const code = this.verifyForm.value.code;

    this.http.post('http://localhost:3000/api/register/verify-email', {
      userId: this.userId,
      code: code
    }).subscribe({
      next: (response: any) => {
        this.success = response.message;
        localStorage.setItem('token', response.token);
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 2000);
      },
      error: (error) => {
        this.loading = false;
        this.error = error.error?.message || 'Verification failed';
      }
    });
  }

  resendCode() {
    this.resendLoading = true;
    this.error = '';
    
    this.http.post('http://localhost:3000/api/register/resend-verification', {
      userId: this.userId
    }).subscribe({
      next: (response: any) => {
        this.resendLoading = false;
        this.success = 'Verification code resent successfully';
      },
      error: (error) => {
        this.resendLoading = false;
        this.error = error.error?.message || 'Failed to resend code';
      }
    });
  }
}

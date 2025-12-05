import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-access',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './access.html',
  styleUrls: ['./access.css'] // correzione da styleUrl → styleUrls
})
export class Access implements OnInit {

  email: string = '';
  password: string = '';
  rememberMe: boolean = false;
  errorMessage: string = '';

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      // se esiste un'email ricordata, vai direttamente alla pagina home
      this.router.navigate(['/home']);
    }
  }

  login() {
    // POST login al backend usando environment.apiUrl
    this.http.post(`${environment.apiUrl}/api/users/login`, {
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res: any) => {
        // se l’utente ha spuntato "remember me"
        if (this.rememberMe) {
          localStorage.setItem('rememberedEmail', this.email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }

        // salva token/sessione come preferisci
        localStorage.setItem('token', res.token);

        // reindirizza alla home
        this.router.navigate(['/home']);
      },
      error: err => {
        console.error('Login failed', err);
        this.errorMessage = err.error?.message || 'Login failed';
      }
    });
  }
}

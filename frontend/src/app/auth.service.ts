import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.apiUrl}/api/users`;

  constructor(private http: HttpClient, private router: Router) { }

  // Login utente
  login(email: string, password: string, remember: boolean): Observable<{ token: string, firstLogin: boolean }> {
    return this.http.post<{ token: string, firstLogin: boolean }>(
      `${this.apiUrl}/login`,
      { email, password, remember },
      { withCredentials: true } // essenziale per cookie HttpOnly
    );
  }

  // Login fornitore
  supplierLogin(email: string, password: string, remember: boolean): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/supplier-login`,
      { email, password, remember },
      { withCredentials: true }
    );
  }

  // Controlla se l'utente è autenticato
  checkAuthStatus(): Observable<boolean> {
    return this.http.get<any>(`${this.apiUrl}/me`, { withCredentials: true }).pipe(
      map(user => !!user),
      catchError(() => of(false))
    );
  }

  // Ottieni dati utente corrente
  getCurrentUser(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/me`, { withCredentials: true });
  }

  // Aggiorna dati utente
  updateUser(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/me`, data, { withCredentials: true });
  }

  // Logout
  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true });
  }

  // Cancella account
  deleteAccount(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/me`, { withCredentials: true });
  }

  // Richiedi reset password
  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email }, { withCredentials: true });
  }

  // Reset password con token
  resetPassword(token: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, { token, password }, { withCredentials: true });
  }

  // Verifica OTP (per login o registrazione)
  verifyOtp(email: string, otp: string): Observable<{ token: string, firstLogin: boolean }> {
    return this.http.post<{ token: string, firstLogin: boolean }>(
      `${this.apiUrl}/verify-otp`,
      { email, otp },
      { withCredentials: true }
    );
  }
}
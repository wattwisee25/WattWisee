import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router, RouterModule } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000/api/users';
  
  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string, remember: boolean): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password, remember }, { withCredentials: true });
  }

    // login supplier
  supplierLogin(email: string, password: string, remember: boolean): Observable<any> {
    return this.http.post(`${this.apiUrl}/supplier-login`, { email, password, remember });
  }

  checkAuthStatus(): Observable<boolean> {
    return this.http.get<any>(`${this.apiUrl}/me`, { withCredentials: true }).pipe(
      map(user => !!user),
      catchError(() => of(false))
    );
  }

  getCurrentUser(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/me`, { withCredentials: true });
  }


updateUser(data: any): Observable<any> {
  return this.http.put(`${this.apiUrl}/me`, data, { withCredentials: true });
}


logout(): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/logout`, {}, { withCredentials: true });
}

  deleteAccount(): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/me`, { withCredentials: true });
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email }, { withCredentials: true });
  }

  resetPassword(token: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, { token, password });
  }

   verifyOtp(email: string, otp: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify-otp`, { email, otp });
  }

}

















import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

interface AuthResponse {
  authenticated: boolean;
  user?: { email: string };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.checkAuthStatus();
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }, { withCredentials: true })
      .pipe(
        map(response => {
          this.currentUserSubject.next(response.user);
          return response;
        })
      );
  }

  logout(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login/logout`, {}, { withCredentials: true })
      .pipe(
        map(() => {
          this.currentUserSubject.next(null);
          this.router.navigate(['/login']);
          return { success: true };
        }),
        catchError((error) => {
          console.error('Logout error:', error);
          this.currentUserSubject.next(null);
          this.router.navigate(['/login']);
          return of({ success: false, error: error.message });
        })
      );
  }

  checkAuthStatus(): Observable<boolean> {
    return this.http.get<AuthResponse>(`${this.apiUrl}/login/me`, { withCredentials: true })
      .pipe(
        map(response => {
          if (response.authenticated && response.user) {
            this.currentUserSubject.next(response.user);
            return true;
          }
          return false;
        }),
        catchError(() => {
          this.currentUserSubject.next(null);
          return of(false);
        })
      );
  }

  isLoggedIn(): Observable<boolean> {
    return this.currentUser$.pipe(
      map(user => !!user)
    );
  }

  getCurrentUser(): Observable<any> {
    return this.currentUser$;
  }
}

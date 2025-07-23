import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  contact_name: string;
  company_name: string;
  register_as: string;
  SEAI_number: string;
  phone: string;
  email: string;
  password: string;
  permission_contact: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/users'; // indirizzo backend

  constructor(private http: HttpClient) {}

  // Metodo per registrare un utente
  registerUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  // Metodo per ottenere tutti gli utenti (opzionale)
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }
}

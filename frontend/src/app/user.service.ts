import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../enviroments/enviroments';

export interface User {
  _id: Object;
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
private apiUrl = `${environment.apiUrl}/users`;
 // indirizzo backend

  constructor(private http: HttpClient) { }

  // Metodo per registrare un utente
  registerUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  // Metodo per ottenere tutti gli utenti
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

getSuppliers(): Observable<User[]> {
  return this.http.get<User[]>(`${this.apiUrl}/suppliers`, { withCredentials: true });
}



  deleteAccount(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/me`, { withCredentials: true });
  }
}

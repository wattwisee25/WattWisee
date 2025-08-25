import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeepseekService {

  private apiUrl = 'http://localhost:3000/api/deepseek/search'; // punta al tuo backend

  constructor(private http: HttpClient) { }

  search(query: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { query });
  }
}

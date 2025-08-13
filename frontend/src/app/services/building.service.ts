import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Building {
  _id: string;
  name: string;
  imageUrl?: string;
}

@Injectable({
  providedIn: 'root',
})
export class BuildingService {
  private apiUrl = 'http://localhost:3000/api/buildings'; // indirizzo backend

  constructor(private http: HttpClient) {}

  getBuildings(): Observable<Building[]> {
    return this.http.get<Building[]>(this.apiUrl);
  }
}
